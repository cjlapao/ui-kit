# Design: ConnectionFlow — obstacle-aware path engine (Hanan-grid A*)

**Date:** 2026-10-20
**Status:** Approved by user (collision-checked engine for ALL edges; engine
picks any side freely; A* Hanan approach; bundled calls accepted: shared
lane map, dev-loop demo fixture, no-touch invariant tests)
**Touches:** `common/connectionFlow/{router,layout,types}.ts` (shared — the
Vue kit gets it identically), tests, demo.

## Problem

`emitBranch` and the chain walks route with one fixed turn and no knowledge
of card positions:

- Track gate loops (`plan-gate` → `plan`) run their horizontal segments
  across the faces of the cards in between.
- Chain failures (`review` → `implement`) force a left exit + a lane only
  `bypassLift` (18px) off the card edge + a top entry whose final approach
  is *inside* the card's ring clearance — in a single-column chain the lane
  rides over the cards. It should take the free lane on the left and enter
  from the left instead.
- Blue success/handoff edges clip neighbours whenever the naive turn line
  falls inside a card (uneven row heights).

The router doctrine stays: **every edge in the graph is routed by this
module and nothing else** — so the engine goes into `router.ts`, not into a
caller.

## Architecture

Two layers, both in `router.ts`:

1. **Fast path (byte-identical today's output):** every edge first gets its
   current `routePorts` route. `segmentsCrossBoxes(points, obstacles)`
   (axis-aligned segment × box, terminals' own cards excluded) decides
   whether it touches anything. Clean → done. Track hops, fan spines and
   bypass lifts are clean by construction, so all existing routes/pins are
   untouched and cost nothing extra.
2. **`routeBetween(from, to, obstacles, opts)`** — the engine, consulted
   only when the naive route collides:
   - **Endpoints:** `{ box, t, preferSides? }` — the engine tries all four
     exit × four entry sides (`port(box, side, t)`), each scored by A*;
     the terminals' own cards are excluded from the obstacle set. Returns
     the winning route **and its chosen ports** (the layout draws the
     connectors where the edge actually lands).
   - **Grid (Hanan):** candidate xs/ys = the two stub coords per endpoint,
     every obstacle's `left/right ± clearance` and vertical/horizontal
     centres, deduped within 1px. Cap 4096 cells — over that, drop centre
     lines; still over, keep the naive route (never hang, never blank).
   - **A\*:** states `(i, j, dir)`; first move must leave along the source
     port's normal, last must arrive along the target's. Cost = px length +
     `bendPenalty` (18) per direction change + `obstaclePenalty` (60/px,
     computed as analytic overlap length) + `lanePenalty` (12) per prior
     use of the same grid segment. Heuristic Manhattan (admissible: all
     costs positive). Deterministic neighbour order.
   - **Soft obstacles:** traversing a card costs 60×px instead of being
     forbidden — the engine **always** returns a route and always returns
     the fewest/shortest crossings when boxed in. A clean route always
     beats any penetration.
   - **Shared lanes:** one `Map<segmentKey, uses>` per layout run, updated
     by every engine-routed edge, read by later ones — two retry loops into
     the same card stack themselves side-by-side (adjacent clearance lines)
     instead of drawing one line twice. Routing order is the deterministic
     edge-emission order.
   - **Preferences, not straitjackets:** upstream failure edges get a
     −25 bonus on left-exit and top-entry totals, keeping the retry loop's
     visual idiom when it is free; the engine overrides it whenever a card
     is in the way.
   - **Output:** same `{ points, d }` shape as `routePorts` — the shared
     `roundedPath`/`simplify`, so `edgeStyle`, travelling dots
     (`animateMotion path`), `labelAnchor` and connectors work unchanged.
   - Constants (`bend/obstacle/lane` costs, clearance default) exported for
     tests; overridable via options.

## Layout wiring (`layout.ts`)

- After pass 1: `obstacles = laidOut.map(boxOf)` (every card: track, lanes,
  fan children, chain grid). One `laneUses` map per run.
- New option `pathClearance: number` (`DEFAULT_LAYOUT_OPTIONS`, default
  **12** ≈ md ring radius + margin) — obstacles are inflated by this so a
  clean route also clears the terminal bulges.
- All six edge builders (track, fan child, chain entry, chain walk, branch
  success/failure, bypass) go through one `routeEdge()` helper:
  naive `routePorts` (with today's `via` spines) → collision check →
  `routeBetween` fallback. `addConnector` receives the **returned** ports,
  so rings/bulges relocate with a side change (outline bulges key on
  `port.side` already).
- Chain failure's old forced lane (`min(x) − bypassLift`) stays as the
  *naive* candidate only — colliding is now precisely what triggers the
  engine, whose clearance lines (12, not 18-against-a-270px-card) keep
  lanes genuinely outside the cards.

## Backward compatibility

Non-colliding edges (every current passing test: track, fan, bypass, dots,
viewport, chain-straight-downs) keep **byte-identical** points/d. New
behaviour fires only where today's output was broken. Vue kit: zero API
change, same geometry.

## Tests

`connectionFlowPath.test.ts` (router level):
- `segmentsCrossBoxes`: touch vs cross vs near-miss.
- Wall between two cards → route crosses no obstacle; enters a free side.
- **Vertical column loop-back** (user's case): three stacked cards, edge
  bottom-most → top-most enters the target's **left** and its lane lies
  left of the cards (min x < card left).
- Boxed-in target → route still exists, crossings strictly fewer than the
  naive route's (best-effort).
- Non-colliding pair → `routeBetween` output points equal `routePorts`'
  naive equivalent (pin).
- Shared lanes: two edges into adjacent cards on the same approach do not
  draw the same grid segment (segment keys disjoint).

`connectionFlowChain.test.ts` gains the fixture-level invariant:
- For every routed edge, no segment crosses any card except its terminals'
  own boxes (epsilon = ring clearance), across the whole dev-loop-style
  fixture (track gates with cross-column reject loops + 3×3 chain with an
  upstream `review → create-code` failure + single-column chain).

## Demo

`examples/Pipeline.tsx` reworked as the **dev-loop** story matching the
screenshots: `setup → plan → plan-gate (failure → plan) → build chain
[create-pr | create-code, unit-tests, lint | verify-code (failure →
create-code) | secure-code, scan-deps | review-code (failure →
create-code) | merge-code] → qa (failure → review-code) → done`, so the
docs page shows gate loops arcing over/around the cards on clean lanes,
the vertical single-column loop entering from the left, and the blue
walks threading the gaps. Playground untouched (it inherits the fix).

## Non-goals
- Avoiding crossings between *edges* (only cards are obstacles; a light
  lane-reuse penalty discourages overlap of same-corridor runs, but edge
  crossings remain legitimate graph topology).
- Port-assignment net ordering / full Sugiyama; per-item port pinning
  (engine's free choice can grow a hint later if ever needed).
- Anything Vue-side beyond reaping the shared geometry.

## Addendum (same day, user-approved): row air and crossing hops

Crossings stay legal (the non-goal above stands) — but a crossing that
reads as a merge is a lie about the graph, so the engine now *draws*
them as over/under, and the chain rows get room to breathe.

- **`rowGap` default 12 → 20.** The ladder rows sat too close at every
  zoom; the engine's lanes (12 px clearance) sit comfortably inside the
  bigger gap. Callers that pass `rowGap` are untouched. The
  parent→first-row seam follows the same gap, not the fan children's
  `childGap`: it carries a real connector with ports and dots at both
  ends, exactly like a row handoff, and at 12 px its two rings nearly
  touched.
- **Crossing detection** (`routeCrossings`, router.ts): a post-layout
  pass compares every pair of routed edges; a segment pair crosses when
  one runs horizontal and the other vertical through the other's
  *interior* (strict inequality — a touch at a vertex or a collinear
  run is not a crossing). The horizontal edge is the one that hops.
- **The hop** is a semicircle (radius ~6, PCB convention) inserted into
  the horizontal's path at the crossing point, bulging up — safe by
  construction, since lanes keep 12 px clear of cards. A hop is skipped
  when it would land within radius + corner-radius of a corner, or
  within radius + 2 of a trimmed endpoint (ports own their neighbourhood);
  hops closer than 2r + 2 on one segment share a shrunken radius or
  drop the later one. `edgeStyle` governs corners only — hops are round
  on every style, and since the travelling dots follow the same path,
  they hop too.
- Edges with no crossings keep their `d` byte-identical (untouched);
  `LaidOutEdge` gains the edge's `style` so the post-pass can rebuild a
  crossing edge's path exactly as the router would have drawn it.
- Tests: a crossing pair gets the arc token and the untouched one does
  not; parallel, vertex-touch and near-port crossings get nothing; a
  whole layout (grid whose failure lane crosses the row-handoff
  verticals) carries at least one arc.

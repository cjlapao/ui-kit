# Design: ConnectionFlow — chained child grids + success/failure branches

**Date:** 2026-10-20
**Status:** Approved by user (grid model, opt-in chain per parent, walk-the-row
then drop, branches always-drawn/state-driven)
**Touches:** `common/connectionFlow/{types,layout,measure,router}.ts`,
`react/src/components/ConnectionFlow/*`, demo.

## Background

`ConnectionFlow` renders a left→right track of `nodes`; `children` hang
vertically below a parent, each with its own elbow from the parent
(`layout.ts` Pass 3). The user wants a CI-style story: a `build` step expands
into sub-steps that read as one continuous flow — the flow walks *down* into
the first child, walks the children, and the **last** child carries the
connection onward to `build`'s next top-level sibling. Children may also
extend to the **right** into multiple columns (a grid), card size fixed. And
each card can emit a **success** and a **failure** connection, differently
coloured, where failure can loop back upstream (verify → create code) so the
flow can re-descend on a retry.

## Confirmed semantics (user decisions)

1. **Opt-in per parent.** `childLayout?: "fan" | "chain"`, default `"fan"` —
   today's elbows are untouched. Chain is a card-by-card opt-in.
2. **Grid: walk the row, then drop.** Children are rows. Flow walks each row
   left→right (standard track links: right-mid → left-mid), then drops from
   the **last** card of the row into the **first** card of the next row
   (bottom-mid → top-mid). Cards keep the standard size; extra columns widen
   the row (longer connectors), the grid never grows taller.
3. **Two branch connections per card.** `success` and `failure`, each
   `{ to?, tone?, label? }`, per-item tones like every other tone here.
   - **success** defaults to the implicit walk (next card right, else first
     card below, else — for the grid's last card — the parent's next
     top-level sibling); an explicit `to` overrides the successor.
   - **failure** is an explicit edge (no implicit). Enters the target at
     **top-mid**, detouring on the left, so a loop-back visibly *re-enters*
     the target the way a chain drop does.
   - Default tones: success `STATUS_TONE.succeeded` (emerald), failure
     `STATUS_TONE.failed` (rose).
4. **Always drawn, state-driven.** Both branches always render; when the
   source `status`/active implies failure the rose edge flows and the
   success edge dims (`stopped`), and vice-versa — reusing the
   `flowing`/`stopped` connector states. Travelling dots follow existing
   `animated` plumbing.

## Data model (`types.ts`)

```ts
export interface ConnectionFlowBranch {
  to?: string;          // target node id; success omitted ⇒ implicit next
  tone?: TrueColor;     // default emerald (success) / rose (failure)
  label?: string;       // caption along the edge
}

export interface ConnectionFlowNode {
  // ...existing
  /** How children attach. @default "fan" */
  childLayout?: "fan" | "chain";
  /**
   * Chain mode accepts rows: `children: ConnectionFlowNode[][]`. A flat
   * array is still valid in chain mode (each entry is its own row). Fan
   * mode is unchanged (flat array, one elbow per child).
   */
  children?: ConnectionFlowNode[];      // fan (unchanged)
  rows?: ConnectionFlowNode[][];        // chain: rows of cards, walked L→R then top→bottom
  success?: ConnectionFlowBranch;
  failure?: ConnectionFlowBranch;
}
```

`rows` is a **separate field** rather than overloading `children` with a
union: it keeps `children: ConnectionFlowNode[]` intact for fan (and for
`measureBranch`/`childEdges`/renderers), and chain reads `rows` (or a flat
`children` promoted to one-per-row). A normaliser `toRows(node)` lives in
`types.ts`: chain ⇒ `node.rows ?? (node.children ?? []).map((c) => [c])`.

`LaidOutEdge` gains `kind?: "track" | "chain" | "branch"` and
`branchKind?: "success" | "failure"` (optional — renderers keep working; the
test suite asserts on them). `ConnectionFlowLayoutOptions` gains
`rowGap: number` (vertical gap between grid rows; default = `childGap`) and
`gridIndent: number` (left inset of the grid under its parent; default =
`childIndent`).

## Layout (`layout.ts`)

### Pass 1 — placement
- A chain parent is one column in `buildColumns`; `columnBounds` and `x`
  advance use the column's **width**, which becomes `max(cardWidth, gridWidth)`
  where `gridWidth = gridIndent + maxCols*width + (maxCols-1)*connectorWidth`.
  `x += columnWidth + connectorWidth`. (Track-edge routing already reads live
  boxes via `columnBox`, so only the advance is fixed-width today.)
- Parent card placed at the column top, standard size. Its grid hangs below:
  `gridTop = parent.bottom + childGap`; row `r` at `gridTop + Σ(rowHeight+rowGap)`;
  card `c` of a row at `gridX + c*(width+connectorWidth)`, `gridX =
  columnStart + gridIndent`. Every card is a real `LaidOutNode` (depth ≥ 1).

### Pass 2 — track edges
- The edge **into** a chain parent targets the parent card (unchanged).
- The parent emits **no** right-side edge; instead the edge that would have
  left the parent now leaves the grid's **last card** (last row, last column)
  to the parent's next top-level sibling. Implemented by resolving the
  track-edge `sourceNodes` for a chain column to `[lastGridCard]`.
- Honours `terminal` on the parent (a terminal chain parent emits no onward
  edge; a terminal last-grid-card likewise suppresses it) and `skipped`
  (a skipped whole chain column is bypassed by `lastLiveBefore` as today).

### Pass 3 — grid edges (`childEdges` rewritten for chain)
For each chain parent, build the ordered walk `W` = cards in row-major order:
- **Entry:** parent bottom-mid → `W[0]` top-mid.
- **Row link** `W[i]→W[i+1]` where same row: right-mid → left-mid (routed
  through `routePorts`, style = flow `edgeStyle`).
- **Row handoff** `W[i]→W[i+1]` where next row: bottom-mid → top-mid.
- A card whose `success.to` is set overrides its `W[i]→W[i+1]` successor edge
  (drawn to that target instead). `success.tone/label` style it.
- Skipped cards: a `skipped` card in the row is stepped over (the walk links
  its live neighbours), consistent with the track bypass rules.

### Branch edges (new pass)
For every card with `success?.to` (explicit) or `failure?.to`:
- Resolve target by id (may be upstream → loop-back).
- `from` port: the branch leaves the source at right-mid (success) or
  left-mid (failure) — failure uses `left` so the loop-back heads toward the
  column spine.
- `to` port: **top-mid** of the target for a failure (re-entry), the natural
  `selectSides` port for an explicit success.
- Route via `routePorts` with a left **lane** `via.x` when the target sits
  upstream/left of the source (detour around the grid's left edge, so the
  loop doesn't cut through cards).
- Tone from `branch.tone ?? (success ? emerald : rose)`; state from the
  source's failure status (rose flowing / emerald `stopped`, else the
  inverse). Both edges are always pushed; only their `state`/`animated`
  differ.

### `measure.ts` — `measureBranch`
Chain height = `own + childGap + Σ(max(row card heights) + rowGap)`; the
recursion into each card still uses `measureBranch`. Fan path unchanged.

### `router.ts`
`routePorts` already routes any port pair; loop-back uses the existing
`via` mechanism (a fixed `via.x` lane). `selectSides` unchanged; branch
routing sets ports explicitly rather than calling `selectSides`.

## Backward compatibility & tests
- `childLayout` defaults to `fan`; no `rows`/`success`/`failure` ⇒ **byte-
  identical** layout. Existing `connectionFlow*.test` files must pass
  untouched (fan elbows, track, bypass, dots, viewport).
- New `connectionFlowChain.test.ts` (layout): rows place horizontally and
  share column widths; walk edges (right/left within row, bottom/top across
  rows); entry from parent bottom-mid; exit from last card to next sibling;
  `success.to` override; **failure loop-back** enters target top-mid with the
  left lane and routes upstream; tones default emerald/rose + per-item
  override; skipped card stepped over; state driven by source status.
- `connectionFlow.test.ts`: `toRows` normaliser (flat & nested), `measureBranch`
  chain heights.

## Demo (`react/demo/.../connection-flow`)
- New `examples/Pipeline.tsx`: setup → build(chain: create pr | create code →
  unit tests → lint | verify code | secure code → scan deps | review | merge)
  → deploy → done, with `verify` `failure: { to: "create-code", label:
  "retry" }` looping back and flowing rose while its success dims.
- Playground: a `childLayout` toggle (fan/chain) on the structure controls +
  a failure-tone choice; docs page gains a "Branching & chains" section.

## Non-goals
- More than one success and one failure edge per card; dashed styles beyond
  `edgeStyle`; an execution engine (retry counts, real status transitions —
  status still comes from the caller).
- Reordering top-level `nodes` by branch (the walk is the declaration order).

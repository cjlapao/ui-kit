# NetworkGraph empty state — design

Date: 2026-11-19. Follow-up to the inspector/hover/full-size/skeleton
specs for the same component.

## Problem

While the graph had no visible nodes, `NetworkGraph` showed a bare
centered text ("No visible nodes") on the canvas — unlike AgentMap,
which presents its empty case through the kit `EmptyState` component
(plain variant, icon, title, subtitle). Review also decided an empty
graph must not keep a legend: with nothing rendered, a community legend
has nothing to describe.

## Design

The plain overlay becomes the kit's **`EmptyState`** (same component
AgentMap uses), shown under the same condition as before
(`!visibleNodes.length`, so it covers both "no data" and "everything
filtered out"):

- `variant="plain"`, `dashed={false}`, `icon="NetworkNodes"` (registry
  icon), tinted via `color={gridTone}` so the disc matches the lattice.
- `title` = existing `kit.networkGraph.empty` ("No visible nodes") —
  keeps current text and tests; `subtitle` = new `emptySubtitle` key
  in all five curated catalogs.
- **Way back**: when nodes exist but all communities are filtered out,
  an `actions` footer holds a soft `Select all` Button (existing key)
  that re-enables every community through the same `filter` handler as
  the legend. With genuinely no nodes there is no button — nothing to
  restore. The wrapper stays `pointer-events-none` (panning never
  blocked); only the button is `pointer-events-auto`.
- **Legend hidden while empty**: the legend column now also requires
  `visibleNodes.length > 0`.
- `emptyMessage` keeps its contract: a node passed in replaces the
  whole EmptyState.

Rejected: AgentMap's `AiRobot` (wrong metaphor) and a bespoke div
(`EmptyState` is the kit primitive; reusing it keeps empty states
consistent across components).

## Verification

Three jsdom tests (icon state + subtitle + no legend + no button on
zero data; legend vanishes on filter-all and the Select-all action
brings both back; `emptyMessage` override). Existing "No visible nodes"
assertions keep passing since the title reuses the key. Suite green
(60 tests incl. i18n parity); tsc/eslint/demo-tsc clean.

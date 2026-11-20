# NetworkGraph full size modes — design

Date: 2026-11-19. Follow-up to the inspector/hover specs for the same
component.

## Problem

Embedders that place the graph inside a fixed-height layout (dashboards,
split panes) had to fight the fixed `height` prop; AgentMap already solves
this with `fullHeight`/`fullWidth`. Mirror that contract exactly.

## API

On `NetworkGraphProps`, identical in name, default and wording to AgentMap:

- `fullHeight?: boolean` — default `false`. Fill the height of a parent
  with a defined height; overrides the `height` prop.
- `fullWidth?: boolean` — default `true`. Fill the available width;
  `false` fits content (`width:fit-content; max-width:100%`).

## Design

**Chosen approach** — root classes + CSS stretching, exactly AgentMap's
pattern. Rejected: inline-style sizing in TSX (diverges from the kit
pattern) and copying AgentMap's `viewportHeight` ResizeObserver math
(needed there only because the agent list sizes itself off the measured
height; here CSS flex absorbs it and the canvas already re-fits through
its own ResizeObserver).

**Mechanics**

- Root gains `cj-network-graph--full-height` and
  `--full-width`/`--intrinsic-width` (width rules copied verbatim from
  agent-map.css). The base `cj-network-graph` grid class stays gated on
  `inspector`, and the full-height row rule
  (`grid-template-rows: minmax(0,1fr)`) doubles the class so it only
  lands where the grid exists; the plain block case works via
  percentage heights.
- Height chain: root `height:100%` → `__main` → graph Panel gets a
  `__graph-panel` class (`height:100%`) and `flexBody` (Panel's proven
  flex-body mode), then `__group`, `__layout` and the canvas
  `__graph-box` become `flex:1; min-height:0`. With `fullHeight` the
  box's inline `height`/`minHeight` are not emitted at all, so nothing
  fights the CSS.
- The inspector column needs no change: the grid row already stretches
  it and `__details`/`__body` scroll handle overflow.

## Verification

Three jsdom tests: default keeps inline `480px` + full-width class;
`fullHeight` adds the class, drops the inline height and flexes the
panel; `fullWidth={false}` swaps the width class. Playground gains
"Full height"/"Full width" toggles with a 640px preview wrapper
(AgentMapPage pattern); props table documents the pair.

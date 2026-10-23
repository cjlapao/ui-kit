# NetworkGraph (React only)

Approved direction: Canvas network rendering inside the existing Panel, with themed React controls and a combobox-style documentation page. Initial target is thousands of nodes; no fixed performance guarantee until measured.

## Public contract

Readonly nodes and edges with stable string IDs; optional community membership, TrueColor tones, radius, and finite x/y coordinates. Missing coordinates receive a deterministic clustered layout in linear time. This is not a running physics simulation. Invalid edges and duplicate IDs are ignored consistently. Consumers can supply positions from their own layout engine.

Panel supplies surface variants, tone, corner, glass opacity, and vibrancy. Community filtering, node selection, explicit edge-path highlighting, zoom/pan, fit/reset, loading/empty/disabled states, and callbacks form the interaction surface. Selection and community visibility support controlled and uncontrolled usage. A shortest-path helper traverses unweighted undirected edges.

## Rendering and accessibility

A transparent HiDPI Canvas draws on demand through requestAnimationFrame. World-space spatial buckets accelerate node picking. Pan and zoom do not rerender node DOM. Layout/model building is memoized. Resize and theme changes repaint; all observers and frames are cleaned up. No continuous animation, respecting reduced motion by construction.

Keyboard users can cycle visible nodes with arrows, select with Enter/Space, clear with Escape, zoom with +/- and fit with Home. A live status names the focused/selected node. Standard kit controls expose zoom, reset, filtering, and a searchable node picker. Strings use kit catalogs.

## Demo and validation

PageHeader, PlaygroundPanel, ControlAccordion, ExampleCards with raw source, PropsTable, and A11ySection follow Combobox. Examples cover basics, community filtering, explicit paths, surface variants, and 2,000 nodes. Validate graph normalization, path finding, picking, zoom anchoring, filtering and keyboard/control behavior; run React typecheck/lint and demo build. Inspect the rendered demo if browser tooling is available.

## Implementation sequence

1. Typed graph model and geometry helpers.
2. On-demand Canvas renderer and themed component.
3. Exports, catalogs, docs registry, playground, and examples.
4. Focused tests, type/lint/build checks, browser verification.

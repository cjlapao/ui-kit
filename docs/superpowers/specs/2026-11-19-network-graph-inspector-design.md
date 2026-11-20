# NetworkGraph inspector panel — design

Date: 2026-11-19 · Scope: React only (`react/src/components/NetworkGraph`, playground + docs page). Vue parity not in scope.

## Problem

`NetworkGraph` has selection (canvas click, keyboard, search) but no way to
inspect the selected node beyond the one-line live status. AgentMap already
solved this with an animated inspector column that slides in when an agent is
selected; the network graph should offer the same pattern, with a sensible
standard body and full styling control over the panel and its buttons.

## Goals

1. Opt-in inspector (`inspector`, **default false**) so existing consumers see
   zero markup or visual change until they enable it.
2. The AgentMap animation: a grid column `0 → 280px` (240ms ease) beside the
   graph, with the inspector itself animating `grid-template-rows: 0fr → 1fr`,
   `translateX(-8px) → none` and opacity (180–240ms), collapsing to a stacked
   column below 640px and honouring `prefers-reduced-motion`.
3. A rich standard body: eyebrow title, node label, community chip (dot uses
   community/node tone), node id, connection count, and a clickable neighbour
   list that selects and centres those nodes.
4. Built-in footer buttons **"Center on node"** and **"Close"**, styled by
   `inspectorButtonVariant` / `inspectorButtonTone` / `inspectorButtonWeight`
   (defaults `solid` / `slate`), replaceable via `renderInspectorActions`.
5. Panel styling independent of the graph: `inspectorVariant` /
   `inspectorTone` with `"auto"` inheriting the graph's `variant` / `tone`,
   mirroring the existing `legendVariant` / `legendTone` contract. Corners and
   glass settings follow the graph Panel.
6. Escape-to-close and selection-clearing keep working; the inspector is
   `aria-hidden` + `inert` while closed.

## API added to `NetworkGraphProps`

| Prop | Type | Default |
| --- | --- | --- |
| `inspector` | `boolean` | `false` |
| `inspectorVariant` / `inspectorTone` | `"auto" \| SurfaceVariant` / `"auto" \| SurfaceTone` | `"auto"` |
| `inspectorWidth` | `number` (clamped 180–480) | `280` |
| `inspectorTitle` | `ReactNode` | `kit.networkGraph.inspector` |
| `inspectorButtonVariant` / `inspectorButtonTone` / `inspectorButtonWeight` | `ButtonVariant` / `TrueColor` / `ButtonWeight` | `"solid"` / `"slate"` / — |
| `renderInspectorBody` | `(node, info) => ReactNode` | standard body |
| `renderInspectorActions` | `(node, info, helpers) => ReactNode` | Center + Close |

`NetworkGraphSelectionInfo`: `label`, `community?`, `connectionCount`,
`neighbors` (visible neighbours in declaration order, from
`model.adjacency` / `model.byId`). `NetworkGraphInspectorHelpers`:
`centerOnNode()` (reuses `useNetworkCanvas().focusNode`) and `close()`
(clears selection and focus). Both types are exported from the package root.

## Structure & animation

The inspector lives **outside** the graph card, in an AgentMap-shaped root
grid (`minmax(0,1fr) 0px → minmax(0,1fr) <width>`, gap `0 → 16px`, both
240ms ease), and reveals with AgentMap's exact inspector animation:
`grid-template-rows: 0fr → 1fr` + `translateX(-8px) → none` + opacity
180/240ms. The aside stretches to the graph card's height like AgentMap's;
below the fit threshold the grid collapses to one column and the inspector
stacks under the card (same `--stacked` idea as AgentMap).

> Updated later: the stack breakpoint is the main column's floor alone —
> `componentWidth < (inspectorStackBelow ?? inspectorMinMainWidth)`, measured
> on the root via ResizeObserver (the width `__main` itself gets when
> stacked; a window-based variant was tried and reverted). Width remains the
> only input, and the inspector's own width and the 16px gap never move the
> breakpoint; `INSPECTOR_GAP` was dropped from the TSX with the old derived
> formula.

```
div.cj-network-graph (root grid; 0→width column; --stacked when too narrow)
├─ div.cj-network-graph__main > Panel(graph)
│  └─ combobox · graph + legend row · instructions · status
└─ aside.cj-network-graph__inspector ← 0fr→1fr + translateX + opacity (AgentMap)
   └─ div__inspector-inner > Panel.cj-network-graph__details (flexBody)
      ├─ div.cj-network-graph__body     ← flex-1, scrolls when content is long
      │  └─ …eyebrow/title/chip/meta + neighbours inside a ScrollArea…
      └─ div.cj-network-graph__actions  ← footer, pinned to the bottom
```

Overflow is handled in layers: the whole body scrolls inside
`.cj-network-graph__body`, and the connections list has its own capped
`ScrollArea` (`.cj-network-graph__neighbor-scroll`, 176px) so a long
neighbour list stays scannable. The footer sits outside the scroll region,
below its own divider.

The root wrapper only gains classes/inline `--cj-network-graph-inspector-width`
when `inspector` is on, so non-inspector renders are visually identical to
before (existing tests pass unchanged). Stylesheets follow the dual-import
contract: `network-graph.css` is imported by `NetworkGraph.tsx` **and**
`@import`ed in `react/src/styles.css`.

## i18n

Six keys added to `kit.networkGraph` in all five curated catalogs (parity is
test-enforced): `inspector`, `nodeId`, `connections`, `neighbors`,
`centerOnNode`, `close`.

## Graph lattice (follow-up)

The canvas box gets AgentMap's lattice treatment via the shared
`GridBackground` component, with graph-appropriate defaults:
`grid?: boolean | Pick<GridBackgroundProps, "pattern" | "size" | "lineColor"
| "dotSize" | "opacity" | "fade" | "fadeStart">` (default `true` — dots, 32px
lattice, dotSize 1.5, opacity 0.35, radial fade) and `gridTone?: TrueColor`
(default `"blue"`, wired as `--cj-network-graph-grid-color: var(--color-…-500)`
on the graph box exactly like AgentMap's `--cj-agent-map-grid-color`).
Dots are heavier than AgentMap's line defaults (1.5px / 0.35 vs 1px / 0.12):
AgentMap draws over a dark glowing viewport, while NetworkGraph panels are
usually light surfaces where isolated 1px dots at 12% vanish — the heavier
defaults were verified visible on white and dark via a headless render.
The lattice is the first child of the canvas wrapper and the canvas gained
`relative`, so the canvas paints above it while the lattice keeps
`pointer-events: none` + `aria-hidden` — selection, panning and the controls
overlay are untouched. `grid={{ lineColor }}` overrides `gridTone`, matching
AgentMap's documented precedence.

## Alternatives considered

- **Popover over the canvas** — rejected: occludes the graph the user is
  reading; AgentMap's side-column pattern is the established kit behaviour.
- **Inspector always on (empty state when nothing selected)** — rejected per
  review: opt-in default false keeps the current zero-visual-change contract.
- **Append `renderInspectorBody` to the standard body (AgentMap's
  `renderAgentDetails` semantics)** — rejected: the ask was "our own **or**
  the standard one", so the renderer replaces the body; footer buttons stay
  unless `renderInspectorActions` replaces them.

## Verification

- `NetworkGraph.test.tsx`: inspector tests (opt-in absence, open/close
  + standard body, variant/tone inheritance and overrides, built-in button
  styling + action replacement, body replacement, neighbour selection,
  height lock + pinned footer, neighbour ScrollArea) plus docking/threshold
  coverage for `inspectorMinMainWidth` / `inspectorStackBelow`.
- `styles.contract.test.ts` + `common/i18n` catalog parity + demo `tsc`.
- Playground gains an **Inspector** control group (enable, variant, tone,
  button variant/tone, custom body); docs page gains an **Inspector** example
  and five props rows.

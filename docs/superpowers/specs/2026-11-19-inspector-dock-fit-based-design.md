# Inspector dock decision — fit-based, overridable

Date: 2026-11-19 · Scope: React only (`NetworkGraph`, `AgentMap`). The Vue kit has no
copy of either component, so there is nothing to port.
Follows: `2026-11-19-playground-page-width-design.md`

## Problem

Both inspectors choose "beside the graph" vs "below the graph" from a hard-coded
minimum width on the component root:

| component | decision | measured element |
| --- | --- | --- |
| `NetworkGraph` | `width < 640` → stacked ([NetworkGraph.tsx:83](../../../react/src/components/NetworkGraph/NetworkGraph.tsx)) | root, `ResizeObserver` |
| `AgentMap` | `width < 800` → stacked ([AgentMap.tsx:91](../../../react/src/components/AgentMap/AgentMap.tsx)) | root, `ResizeObserver` |

The number is unrelated to what actually has to fit — the inspector column (280px)
plus its 16px gap plus a graph column still wide enough to read. In the playground the
measured root is `viewport − 256` (side menu) `− 320` (the `PlaygroundPanel` controls
column) `− 48` (preview padding), so measured live after the page-width fix:

| viewport | playground preview | measured root | `AgentMap` result |
| --- | --- | --- | --- |
| 1280 | 640 | 592 | stacked |
| 1440 | 800 | 752 | **stacked — 48px short** |
| 1600 | 960 | 912 | docked |
| 1920 | 1216 | 1168 | docked |

So `AgentMap` needs a ~1600px viewport to ever show the docked pattern in the docs
playground, and the same component docks in the `ExampleCard` stages (no controls
column) at viewports where the playground stacks. That is the "why is it always at the
bottom" complaint.

`agent-map.css` also carries `@media (max-width:700px) { .cj-agent-map { grid-template-columns:1fr } }`
— dead code (the base `.cj-agent-map.cj-agent-map` rule is more specific and wins), and
the wrong axis anyway: it measures the viewport, not the component.

## Decision

**Derive the threshold from what has to fit, and let the caller override it.**

```
docked  ⟺  componentWidth ≥ inspectorWidth + gap + minMainWidth
stacked  ⟺  otherwise, or when inspectorStackBelow overrides the comparison
```

| component | constants | derived default threshold |
| --- | --- | --- |
| `NetworkGraph` | `inspectorWidth` (clamped 180–480, default 280) + 16 + `inspectorMinMainWidth` (default 320) | **616** (was 640) |
| `AgentMap` | 280 (its CSS column) + 16 + `inspectorMinMainWidth` (default 360) | **656** (was 800) |

`AgentMap` keeps a slightly larger `minMainWidth` than `NetworkGraph` because its main
column is the project map, which needs more room to be legible than a force graph does.

### API added

`NetworkGraphProps` (in `NetworkGraph/types.ts`) and `AgentMapProps`:

| prop | type | default | meaning |
| --- | --- | --- | --- |
| `inspectorMinMainWidth` | `number` | `320` / `360` | the graph column's floor used by the derived threshold |
| `inspectorStackBelow` | `number` | — | replaces the comparison outright: stack while `width < n`. `0` always docks, a large value always stacks. Beats `inspectorMinMainWidth`. |

Defaults keep both components' behaviour for existing consumers — the only change is
that the stack line moves where it should have been, so the docs playground docks.

### Other changes

- The `inspectorWidth` clamp (180–480) is factored into one helper so the CSS variable
  and the threshold can never disagree about the column width.
- The dead `@media (max-width:700px)` rule leaves `agent-map.css`; the component's own
  measurement is the single authority. Kit CSS must be rebuilt afterwards
  (`npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css`).
- `PropsTable` rows for both new props on the `NetworkGraph` and `AgentMap` docs pages,
  per the kit-docs page standard.

## Testing

jsdom tests mock `getBoundingClientRect` + `ResizeObserver` (the pattern already used by
the legend-placement test) and assert the `--stacked` class:

- `NetworkGraph`: docked at 700 / stacked at 500 by default; `inspectorWidth={480}`
  raises the threshold so 700 stacks; `inspectorMinMainWidth={600}` stacks 700;
  `inspectorStackBelow={0}` docks 500.
- `AgentMap`: stacked at 700 under the old rule, docked under the derived one;
  `inspectorStackBelow={900}` stacks it again.

Browser check: the `/agent-map` and `/network-graph` playgrounds at 1280 and 1440 report
`--stacked` absent (docked) where they previously stacked.

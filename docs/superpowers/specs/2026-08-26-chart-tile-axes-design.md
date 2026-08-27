# Tile-mode axes: master switch + per-axis axisLine/labels — Design (Round 29)

Goal (user): use the chart engine inside **tiles** — stat cards where the
series (line, bar, …) stays, animations stay, line area fills stay, but
**all axis clutter** (domain lines, tick labels, grids, and the reserved
axis margins) can be removed. Two reference looks from the user:

1. "Active capsules" tile — labels + grid kept, **solid axis lines gone**.
2. "CPU utilization" tile — **nothing**: no labels, no grid, no lines,
   and the plot reclaims the axis margins so the line fills the card.

## 1. Root prop — `axes?: boolean` (default `true`)

On `ChartRootProps` (both `Chart.Svg` and `Chart.Canvas`):

- When `false` ("tile mode"):
  - `computeLayout` stops reserving axis margins:
    `showXAxis = axes && (hasCartesian || summary.hasXAxis)`,
    `showYAxis = axes && hasCartesian`,
    `hasRightYAxis = axes && needsRightYAxis`.
    The plot area reclaims that space (full-area plot).
  - A new context flag `axesEnabled` (default `true`) gates the
    `XAxis`/`YAxis` children: SVG renders `null`, canvas skips the
    `feature:xaxis` / `feature:yaxis:*` draw registration — even if
    children are present.
- Non-cartesian charts are unaffected (they have no cartesian axis
  chrome; their margins are already zero).
- Scales, hover, tooltip, crosshair, and `Chart.AxisBadges` are
  untouched — they operate on scales, not on axis chrome.

## 2. Per-axis props (on the `Chart.XAxis` / `Chart.YAxis` children)

| Prop | Axis | Default | Controls |
|---|---|---|---|
| `axisLine` | X, Y | `true` | the solid domain line (bottom for X, left/right for Y) |
| `labels` | X (new), Y (redefined) | `true` | tick/category text only |
| `grid` (existing) | X (non-categorical), Y (left) | `true` | dashed gridlines — unchanged |

- `YAxis labels` **semantics change**: it previously hid the domain
  line *and* the tick text together; it now hides tick text only.
  The domain line is controlled by `axisLine`. One existing demo
  (`examples/BarModes.tsx`) used the old compound form — updated to
  `labels={false} axisLine={false}` to keep its intended look.
- The transposed (categorical-Y) branch of `YAxis` honors the same two
  props for its line + category labels.
- Canvas renderer mirrors both conditions in the registered draw
  functions (they currently hard-code the line and labels).
- Naming matches the recharts vocabulary (`axisLine={false}`) the user
  is already reaching for in their tile WIP.

## 3. Playground (shared `ChartPlayground` → every chart page)

- New state `axesMode: "all" | "labels" | "none"` (default `"all"`).
- New `MultiToggle` control **"Axes"** (All / Labels / None) in the
  shared controls block, next to the Grid control.
  - **All** — current behavior.
  - **Labels** — `axisLine={false}` on the axis children (labels +
    grid follow the existing Grid control) — the "Active capsules"
    look.
  - **None** — `axes={false}` on the preview root — the CPU-tile
    look (full-area plot, zero chrome).
- Implementation: the existing `gridProps` object (already spread onto
  every axis child) gains `axisLine: axesMode === "labels" ? false :
  undefined`; the preview `<Root>` gains
  `axes={axesMode === "none" ? false : undefined}`.

## 4. Tests — `chart-components.test.tsx`

- `axes={false}` (line chart with both axis children): no
  `[data-chart-feature="xaxis"]` / `yaxis-left` groups, and the hover
  rect (plot area) is measurably larger than the default render.
- XAxis `axisLine={false}`: domain line count 1 → 0, tick labels
  unchanged. XAxis `labels={false}`: labels gone, line kept.
- YAxis `axisLine={false}`: tick text kept, line gone. YAxis
  `labels={false}` (new semantics): line kept, text gone.
- Existing suite (incl. the re-titled
  `labels={false}` YAxis test) still green.

## 5. Verification

- Kit tsc (WIP-filtered) + full vitest (baseline 2499 / 106 files).
- Demo tsc (WIP-filtered).
- Playwright on :5176 (line + bar pages, dark + light): Axes All /
  Labels / None screenshots; assert plot area grows in None mode;
  canvas renderer spot-check (no crash, no chrome).

## 6. Out of scope

- Per-axis independent margin control (only the master switch shrinks
  margins).
- Non-cartesian axis chrome (RadarAxis/PolarAxis keep their own
  controls).
- Legend/title/caption hiding (separate features).
- `tickLine` (recharts tick marks) — this chart never drew tick marks,
  so there is nothing to toggle.

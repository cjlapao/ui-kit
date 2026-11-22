# Gantt loading & empty states — design

Date: 2026-11-19
Status: approved by owner in session ("lets implement it")

## Problem

React Gantt renders a bare empty region when data is loading or there are no
tasks — no spinner, no skeleton, no message. Vue Gantt already ships a
row-shaped skeleton (`loading` prop) and an empty block with an `empty` slot,
but has no spinner mode. The kit convention (`loading` + `loaderType`,
default `"skeleton"`, custom-content override) is established by
Panel/TaskBoard/PagedPanel/SplitView/Carousel; Gantt must join it in both
kits, and the playground must exercise it.

## Decisions

- **Props (both kits)** — `loading?: boolean` (default `false`) and
  `loaderType?: "skeleton" | PanelLoaderType` (default `"skeleton"`),
  matching the Panel/TaskBoard vocabulary. React adds node overrides
  `loadingState?: ReactNode` and `emptyState?: ReactNode` (kit convention
  from SplitView/Carousel/TaskBoard); Vue expresses the same via
  `#loading` / `#empty` slots (`#empty` already exists; `#loading` is new).
- **States** — `loading` wins over empty. `isEmpty = tasks.length === 0`.
  The row area renders only when `!loading && !isEmpty`:
  - `loading && loaderType === "skeleton"` → the row area is replaced by
    `loadingState` / `#loading` if given, otherwise the Gantt-shaped
    skeleton (12 pulsing rows: sticky label pill in the fixed block, a bar
    block at deterministic pseudo-random offsets in the timeline — Vue's
    existing markup becomes the shared reference, ported to React).
  - `loading && loaderType !== "skeleton"` → the current row area stays
    (rows if any, or blank), and a `Loader` of that variant floats centered
    over the body region in an absolutely positioned overlay. The owner
    chose overlay-over-rows (refresh-friendly, matches Panel/TaskBoard).
  - `!loading && isEmpty` → centered muted message in the body region,
    `emptyState` / `#empty` override, fallback `labels.empty` (the catalog
    keys `loading`/`empty` already exist in `GanttLabels`).
  - The scale header stays live in every state; the today line and its chip
    are hidden while `loading || isEmpty` (Vue's existing precedent).
- **Hooks** — `data-gantt-skeleton`, `data-gantt-loader` (overlay),
  `data-gantt-empty` on the respective blocks; `aria-busy` on the chart root
  while `loading` (React spreads it onto Panel's root; Vue binds it on the
  root element).
- **Auto-scroll interplay** — the open scroll is blocked while
  `loading || isEmpty` (nothing to center on). Flipping `loading` false
  re-runs the open scroll, so a chart that mounts loading still lands
  centered on today when data arrives; the ResizeObserver pin makes the
  settle free. Flipping `loading` true cancels any pending pin.
- **Playground** (`react/demo/src/kit-docs/components/gantt/GanttPlayground.tsx`)
  — `ToggleRow` "Loading", a segmented "Loader type" (skeleton / spinner /
  progress), and a `ToggleRow` "No tasks" that swaps in an empty array.

## Out of scope

- Per-region loading (columns/scale), error states, retry affordances
  (Panel-level `error`/`onRetry` belongs to TaskBoard-shaped containers).
- Virtualized row skeletons beyond the fixed 12-row placeholder.

## Testing

Both kits: skeleton replaces rows on `loading` (+ `aria-busy`); spinner
overlay renders for other variants with rows preserved; empty block shows
`labels.empty` copy and the custom override; `loading` beats empty; today
line hidden in both states; open scroll blocked while loading and fires
when loading flips off.

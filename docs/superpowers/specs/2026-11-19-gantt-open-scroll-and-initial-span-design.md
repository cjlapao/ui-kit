# Gantt — open-scroll robustness, visible-region centering, `initialSpan`

Date: 2026-11-19 · Follows: `2026-11-19-gantt-auto-scroll-to-today-design.md`

## Problems

1. **Open scroll dies on zero-size measurement.** The mount-time `auto` scroll
   measures the scroller immediately. Inside a tab, an animated container, or any
   host that lays out after mount, `clientWidth`/`scrollWidth` read `0`, the target
   computes to `0`, and nothing ever retries — opening looks dead.
2. **Centering counts the fixed column block as viewport.** The body scroller spans
   the whole component, but its left `leftWidth` px are covered by the non-scrolling
   TASK/OWNER/PROGRESS block. Centering in `clientWidth` puts "now" near the right
   edge of what the user actually sees (screenshot: Northwind demo, Day preset).
   The line must center in the **visible timeline region** — from the fixed block's
   right edge to the viewport's right edge.
3. **No named initial span.** Uncontrolled zoom starts at a number (`initialZoom`,
   px/day); there is no way to say "open at hour" without duplicating the preset
   table in app code.

## Decisions

- **Centering** — `todayScrollLeft(todayX, viewportWidth, contentWidth, fixedLeftWidth = 0)`:
  center in `viewportWidth − fixedLeftWidth`, same edge clamps (right clamp still
  against the full `contentWidth − viewportWidth`). Components pass their
  `leftWidth` (grid + column widths, the exact block that overlays the scroller).
- **Open scroll commits now, pins until the user takes over** — mount path
  always performs the `auto` scroll immediately, then keeps a
  `ResizeObserver` (on the scroller box *and* its content child — growing
  `scrollWidth` leaves the box untouched) re-committing the centering against
  fresh geometry, because early layout is fluid (CSS arriving, fonts, lazy
  rows, late column-width state) and a single mount-time measure can center
  against stale numbers. The pin ends on the user's first `wheel` /
  `pointerdown` / `touchstart` on the scroller, on a tier jump (which
  cancels it and takes over with the smooth tier scroll), or on unmount.
  Hosts whose observer never reports (no RO, inert test polyfills) keep the
  immediate scroll as the final answer — so no path can hang waiting for a
  report, and a manual scroll after opening is never stolen.
- **`initialSpan?: GanttZoomTier`** (`"hour" | "day" | "week" | "month" |
  "quarter"`) — uncontrolled only, ignored when `zoom` is controlled. Resolved
  via new engine `zoomForSpan(span)` which looks up `GANTT_ZOOM_PRESETS` by
  lowercased label — the preset table stays the single source of truth.
  Precedence: numeric `initialZoom` wins when both are given. React drops the
  `initialZoom = 16` destructure default so `initialZoom ?? span ?? 16` is
  honest; Vue drops the `withDefaults` entry the same way.
- Combines naturally: `<Gantt initialSpan="hour" />` opens at the hour scale and
  lands centered on "now".

## Testing

- Engine: `todayScrollLeft` cases for the `fixedLeftWidth` offset (center shifts
  right by half the block) + clamps; `zoomForSpan` maps all five spans to the
  `GANTT_ZOOM_PRESETS` values.
- Both kits: `initialSpan="hour"` uncontrolled renders the hour tier
  (`[data-gantt-label-span]` markers present); `initialSpan="hour"` +
  `initialZoom={48}` renders day tier (numeric wins); existing open/tier/off
  scroll tests keep asserting one `auto`, one `smooth`, none.

## Out of scope

Opening to specific dates (`initialRange`), controlled-mode span snapping,
vertical centering, persisting span choice.

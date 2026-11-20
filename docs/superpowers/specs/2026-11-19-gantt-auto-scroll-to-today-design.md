# Gantt — auto-scroll to today on open and tier changes

Date: 2026-11-19 · Status: approved · Builds on: `2026-11-19-gantt-hour-scale-design.md`

## Problem

The Gantt opens scrolled to the far left of the padded view range (tasks minus
7 days), so the user never sees "now" without hunting for it — and after a
zoom preset jump (e.g. Quarter → Hour) the scroll position is anchored to the
old range, which at hour scale is usually nowhere near today. The user asked
for an option that, on open and whenever the time slots change (hour/day/week/
…), scrolls to the day/hour we are currently in.

## Decisions (user-approved)

- **Prop, default on**: `autoScrollToToday?: boolean` in both kits, default
  `true` — opt out with `autoScrollToToday={false}`. Independent of
  `showToday`: marker visibility is styling; orientation to "now" is a
  separate concern.
- **Centered**: today's line lands at the horizontal middle of the viewport.
- **Tier-change triggers only**: re-center on mount and when the header tier
  changes — i.e. `pickBaseUnit(zoom)` crosses a boundary (Hour↔Day↔Week↔
  Month↔Quarter), which is exactly what preset clicks do. Fine `−`/`+` zoom
  or pinch *within* a tier never re-centers, so the feature never fights
  manual panning.

Rejected: engine-emitted scroll-request model (overkill for one imperative
side effect) and `scrollIntoView()` on the today marker (no centering control,
scrolls ancestors, marker unmounts when out of range).

## Engine (`common/gantt`)

One new pure helper in `drag.ts` (next to `todayX`), exported via the barrel:

```ts
/** Centered, clamped target for the body scroller to bring "now" into view. */
export function todayScrollLeft(
  todayX: number,
  viewportWidth: number,
  contentWidth: number,
): number {
  return Math.max(0, Math.min(todayX - viewportWidth / 2, contentWidth - viewportWidth));
}
```

Content narrower than the viewport → `0`. Both kits share this math.

## Components (React + Vue)

Same logic, two idiomatic wirings — each in the Gantt root component, next to
the existing scroll/zoom anchoring code:

- React: `const scrollTierRef = useRef<string | null>(null)` + `useEffect` on
  `[autoScrollToToday, zoom, todayX, range.start]`. On run: bail when
  `!autoScrollToToday`; compute `tier = pickBaseUnit(zoom)`; bail when a tier
  was seen before and it equals the current one; otherwise record the tier and
  scroll. First run (mount) scrolls instantly (`behavior: "auto"`), later tier
  jumps scroll `smooth`.
- Vue: identical with `onMounted` + `watch(zoom, ...)` (and `todayX`/`range`
  sources so a data shift still no-ops within a tier), same tier memo.
- Applying the scroll (both kits, jsdom-safe + old-Safari-safe):

  ```ts
  const left = todayScrollLeft(todayX, el.clientWidth, el.scrollWidth);
  if (typeof el.scrollTo === "function") el.scrollTo({ left, behavior });
  else el.scrollLeft = left;
  ```

  (`scrollTo` is undefined in jsdom; the `scrollLeft` fallback keeps every
  existing mount safe with the prop defaulting to on.)

No changes to the header-sync transform, pinch anchor math, or keyboard zoom —
they operate on `scrollLeft` as before; this only writes it at mount/tier
changes.

## Testing

- Engine (`gantt-engine.test.ts`): centering (`todayX − vw/2`), left clamp at
  0, right clamp at `contentWidth − viewportWidth`, tiny content → 0.
- Kits (React + Vue): with a spied `scrollTo` on the `.gantt-scroller`
  element — mount performs one call with `behavior: "auto"`; changing zoom
  across tiers (288 → 48) performs a call with `behavior: "smooth"`; a
  same-tier zoom change (288 → 384, both hour) performs **no** new call;
  `autoScrollToToday={false}` performs none.

## Docs

Prop-table rows in `docs/design_system/ui-kit.md` Gantt sections + one clause
in the "Today" paragraph.

## Out of scope

Re-centering on data/range changes, "scroll to selected task", preserving the
last manual pan position across tier changes (by design the tier jump takes
over), vertical scrolling, and `scrollTo` animation-duration tuning.

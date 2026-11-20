# Gantt sizing + control surfaces — design

Date: 2026-11-19 · Scope: React only (`react/src/components/Gantt`, playground).
Vue parity deliberately deferred.

## Goals

1. `fullHeight` / `fullWidth` options so the Gantt can fill its parent instead
   of the fixed `height={520}`.
2. First-class `none` surface variant — selectable and rendered correctly
   (the variant type already allows it; the playground never offered it and
   the zoom pill went chromeless with it).
3. Independent surface choice for the zoom controls (the Day/Week/Month/
   Quarter pill + ± buttons): `controlsVariant` / `controlsTone`.

## API — `GanttProps` (all additive, defaults preserve today's pixels)

```ts
/** Fill the height of a parent with a defined height; `height` (default 520) then acts as a min-height. @default false */
fullHeight?: boolean;
/** Fill the available width (Panel fullWidth pass-through). @default false */
fullWidth?: boolean;
/** Surface variant for the zoom controls. Defaults to the chart's own `variant`. */
controlsVariant?: SurfaceVariant;
/** Container tint for the zoom controls. Defaults to the chart's own `tone`. */
controlsTone?: SurfaceTone;
```

Naming follows the kit vocabulary (`ActivityFeed.controlsTone`,
`SmartGridLayout.controlVariant`); Table's `panelVariant: "auto" | …` reads
as "the chart's own panel", which this is not.

## Behavior

- **fullHeight**: root `Panel` gets `h-full`; the style becomes
  `{ minHeight: height }` (React px-converts numbers) and the fixed
  `height` style is dropped. The body scroller is already
  `flex-1 min-h-0 overflow-auto`, so growth/clip need no other change.
  Parent without a defined height degrades to the min-height — graceful.
- **fullWidth**: pass `fullWidth` to `Panel` (explicit `w-full` contract,
  today a no-op since Panel's base already stretches).
- **none variant**: `variantBaseStyles.none === ""` already strips fill/
  border/backdrop; chart header seam and grid stay (they are chart
  furniture, not card chrome). The playground gains the option.
- **controlsVariant / controlsTone**: resolved as
  `controlsVariant ?? variant`, `controlsTone ?? tone` and passed to
  `GanttToolbar`, feeding its `getSurfaceVariantClasses(variant, tone)` pill
  chrome. Unset ⇒ byte-identical to today. `variant="none"` +
  `controlsVariant="elevated"` = chromeless chart with a raised pill.
  The header icon chip stays on the chart's own surface.

## Testability

- `data-gantt-toolbar` on the pill container (GanttToolbar root div).

## Playground (react/demo kit-docs GanttPlayground)

- `VARIANTS` gains `None (no card)`.
- New selects: "Controls variant" / "Controls tone", each with a
  "Follow chart" first entry mapping to `undefined`.
- New toggles: "Full height (fill parent)", "Full width"; when full height is
  on, the preview is wrapped in a bounded `h-[560px]` box so the fill is
  visible. `reset` returns all new state.

## Tests (Gantt.test.tsx)

- default: fixed 520px height, no `h-full`/min-height.
- `fullHeight`: `h-full`, `height` style dropped, `minHeight` 520px;
  with `height={400}` → min-height 400px.
- `fullWidth`: root carries `w-full` (consumer contract lock).
- `variant="none"`: `data-variant="none"`, no surface shadow/fill paint.
- pill follows chart surface by default (classes equal
  `getSurfaceVariantClasses(variant, tone)`).
- `controlsVariant="elevated"` + `controlsTone="blue"` on a `none` chart:
  pill carries the elevated+blue classes, root stays unpainted.

## Out of scope

Vue Gantt, segmented-track internals, docs tables beyond the playground.

## Addendum (approved same day): `columnEdges`

```ts
/** Frame the fixed-column block with vertical hairlines on its outer edges. @default false */
columnEdges?: boolean;
```

- The right edge (fixed/timeline seam, `border-r` on every sticky block) is
  already drawn on every variant — left unconditionally so painted surfaces
  don't regress. `columnEdges` adds the **left** hairline (`border-l`, same
  `surfaceText.divider` token) so the table stays boxed on `variant="none"`,
  where the card border no longer frames the left edge.
- Threads through: header column strip, lane rows, task rows, drag clone,
  and the loading skeleton.
- Testability hook: `data-gantt-columns` on the header's fixed-column strip.
- Playground toggle "Column edges (box the fixed table)".
- Tests: default carries no `border-l` on row/header stickies; on → task
  row, lane row and header strip all carry `border-l`, and the `border-r`
  seam is locked.

## Addendum 2 (same day): `corner` control on the `none` surface

**Problem** — `variant="none"` paints no card, so the `corner` prop had
nothing to round: the Panel's radius (still applied) clips content that
never reaches the corners, making the control look dead on a bare chart.

**Design (approved)** — the hairline frame turns itself on exactly when the
chart is bare, and the `corner` prop shapes **only the table** (the chart
header above stays outside it — with no panel chrome it is not part of the
table):

- When `variant === "none"`, `tableFramed` puts `data-gantt-frame` on the
  **two stacked halves of the table**:
  - the **column-header strip** (TASK/OWNER/PROGRESS + scale window) wears
    `border-x border-t` + `overflow-hidden` and the rounded **top**
    corners (`border-radius: r r 0 0`) — `overflow-hidden` is required so
    the fixed block's opaque fill can't paint square over the round;
  - the **body scroller** wears `border-x border-b` and the rounded
    **bottom** corners (`0 0 r r`). A border on the scroll container sits
    at the visible body edge without scrolling and clips sticky columns to
    the round for free.
- The seam under the chart header is the frame's own top border (the chart
  header strip's `border-b` is dropped when framed) — no doubled line at
  the table's top. The strip's `border-b` seam to the body stays.
- **`columnEdges` yields to the frame**: when framed, the row/lane/header
  stickies drop their `border-l` (the frame's border-x is the same pixel —
  the double line in the playground was exactly that stack). On painted
  variants `columnEdges` still draws its own line.
- Radius comes from `getSurfaceCornerRem(corner)` inline, so no per-step
  `rounded-b-*` classes need safelisting and every `corner` token works.
- No new prop, no DOM-structure change (no wrapper element — sibling
  relations the header-scroll sync and existing tests depend on are
  untouched). Painted variants draw no frame: the card is already the box.

**Tests** — none draws **two** `data-gantt-frame` halves (head: `border-t`
+ rounded top + overflow-hidden, body: `border-b` + rounded bottom), chart
header keeps no seam of its own when framed; `corner="rounded-xl"` rounds
both halves to 2rem; `none` + `columnEdges` → zero sticky `border-l` (one
line); elevated draws no frame at all.

## Addendum 3 (same day): body scroller → kit `ScrollArea`

**Problem** — the bottom-right corner rendered a white square wherever both
scrollbars were present. Root cause: `THIN_SCROLLBAR` styles the webkit
thumb/track but never `::-webkit-scrollbar-corner`, so Chrome filled the
two-scrollbar square with the default scrollbar face (white-ish), and the
`-webkit-scrollbar` string was Chrome-only anyway — Firefox kept native
bars.

**Fix (user-suggested)** — the body is now the kit's own `ScrollArea`
(`Table`'s blessed viewport): native scrollbars hidden entirely, thin
**overlay** thumbs instead (visible per `variant="auto"` — on hover/scroll),
its `scrollarea-corner` is `bg-transparent`, and rendering is identical on
every browser.

- `.gantt-scroller` (and the frame's border/radius/`data-gantt-frame`)
  stays on the ScrollArea **frame**; `scrollRef` is forwarded through
  `viewportRef` to the element that actually scrolls — header scale sync,
  zoom anchoring, pinch-zoom and the drag hook are unchanged.
- The header sync moved from the JSX `onScroll` (which `ScrollArea` binds
  to the frame, and scroll does **not** bubble) to a native `scroll`
  listener on the viewport, registered in the existing wheel effect.
- `overscroll-contain` via `viewportClassName` (the documented hook),
  `tabIndex={-1}` so the viewport never steals a tab stop — the Gantt root
  owns the keyboard.
- Conventions inherited from `ScrollArea`: overlay thumbs float over
  content (no reserved scrollbar track anymore) and the content keeps the
  10px right lane so a thumb never sits on a bar — same as `Table`.

**Tests** — the route-derived-width test reaches the sized content via
`[data-slot="scrollarea-content"] > div` (`.gantt-scroller` remains the
ScrollArea frame, keeping the sibling structure the header tests navigate);
all Gantt + ScrollArea suites green (140).

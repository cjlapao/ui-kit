# Gantt Chart Component — Design & Implementation Spec

**Date:** 2026-08-30 · **Status:** implemented (this spec records the as-built design) · **Scope:**
`common/gantt/` (shared engine), `react/src/components/Gantt/` (React), `vue/src/components/Gantt/`
(Vue), plus the demo + design-system doc.

**Goal (verbatim):** _"Create a new component — a Gantt chart — that follows our UI design but is
very feature rich: drag and drop, drag to reorder, resize, color for each column, lanes, groups,
etc. Find the best of the best and match those features."_

**Research:** `docs/gantt-chart-library-research.md` (full competitor/feature survey). Top feature
set distilled from dhtmlxGantt, FullCalendar, MUI X, Ganttastic, Syncfusion, and the open-source
field is implemented here; **swimlanes and row-reorder are the deliberate differentiators** (most
competitors lack them, and the user explicitly asked for both).

---

## 1. Headline architecture decision

**Split the component into a framework-agnostic engine and thin per-framework renderers.**

The entire hard part — date normalisation, calendar-aligned time-scale construction, row/geometry
layout, and every drag/resize/reorder/dependency interaction — is **pure TypeScript with no DOM or
framework imports**, living in `common/gantt/`. The React and Vue kits import the same engine and
only differ in rendering + pointer wiring. This:

- makes the two ports behaviourally identical by construction;
- makes the engine unit-testable headlessly (no DOM) — `react/src/components/Gantt/gantt-engine.test.ts`;
- satisfies the monorepo rule that `common/` never imports framework code.

```
common/gantt/            ← shared, framework-agnostic (the "best of the best" math)
├─ types.ts              data model + zoom presets + labels
├─ time.ts               date/scale math (toMs, dateToX, buildTimeScale, computeViewRange, snapDate, …)
├─ layout.ts             buildRows, rollupProgress, applyRowReorder, resolveDropBeforeId
├─ drag.ts               applyDragDates, commitDragEdit, progressFromPointer, linkPath, …
├─ tokens.ts             TrueColor → Tailwind class maps
├─ sample.ts             realistic fixture (lanes/groups/milestones/typed links)
└─ index.ts              barrel

react/src/components/Gantt/   Gantt.tsx · GanttScale · GanttBodyRow · GanttLinkLayer · GanttToolbar · useGanttDrag
vue/src/components/Gantt/     Gantt.vue · GanttScale · GanttBodyRow · GanttLinkLayer · GanttToolbar · useGanttDrag
```

## 2. Data model (fully controlled)

```ts
interface GanttTask {
  id: string;
  name: string;
  start: GanttDate; end: GanttDate;      // GanttDate = string | Date | number(epoch ms)
  progress?: number;                     // 0..1
  type?: "task" | "milestone";
  parent?: string;                       // hierarchy = flat list + parent pointer
  lane?: string;                         // swimlane id
  owner?: string;
  color?: TrueColor;                     // per-task colour
  open?: boolean;                        // default collapse
  locked?: boolean;                      // disables edits
}
interface GanttLink { id?: string; source: string; target: string; type?: "fs"|"ff"|"sf"|"ss"; color?: TrueColor }
interface GanttLane  { id: string; label: string; color?: TrueColor; description?: string; open?: boolean }
interface GanttColumn{ key: string; title: string; tone?; width?; align?; kind?: "text"|"progress"|"owner"|"badge" }
```

Design choices driven by the research:

- **Flat `tasks[]` + `parent`** (not nested) — trivially serialisable, easy to diff, and
  `buildRows` derives indentation/depth. Matches how the top libraries model sub-tasks.
- **`links[]` separate from tasks** — dependencies are first-class, typed
  (finish→start / start→start / finish→finish / start→finish), and can carry their own colour.
- **`lanes[]` separate** — swimlanes are a differentiator; unassigned tasks fall into a synthetic
  "General" lane that only renders a header when explicit lanes are present.
- **`rowOrder` separate** — the component never mutates the caller's arrays; reorder is emitted.
- **`GanttDate`** accepts ISO strings, `Date`, or epoch ms and is normalised once via `toMs`.

**Controlled contract:** `tasks` / `links` / `rowOrder` in; `onTasksChange` / `onLinksChange` /
`onReorder` out. `editable` is derived from callback presence unless explicitly set. A 3-stage
**start → preview → commit** event model underlies every drag (preview = live DOM geometry, commit =
the single emitted change). The live preview is **scoped to the dragged task only** — the row whose
id matches the drag's `taskId` receives the preview dates; every other bar keeps its committed
geometry until the commit lands. The dependency arrows **re-route live** during a move/resize: the
link layer computes from the dragged task's preview geometry, so connected arrows follow the bar in
tandem instead of snapping into place on drop.

## 3. Feature set (mapped to the research)

| Research "best-of-best" feature | Where | Notes |
|---|---|---|
| Drag to move (preserve duration) | `drag.applyDragDates(kind:"move")` | snapped to unit |
| Drag to resize start/end | `applyDragDates(kind:"resize-*")` | 1-hour minimum clamp |
| Progress edit | `progressFromPointer` | knob drag → `progress` |
| Row reorder (differentiator) | `applyRowReorder` + `resolveDropBeforeId` | within-lane in v1 |
| Typed dependencies FS/FF/SF/SS | `linkPath` / `computeLinkPaths` | arrowhead + port nodes computed in engine (the arrowhead stops `LINK_PORT_CLEAR` short of the port dot — fill + halo + 2px — so it reads as pointing *at* the dot, never hidden under it); every connector reads **source right → target left** (left port = parents/predecessors, right port = children/successors); type shown by dash style (`ff`/`sf`) + tooltip. Best-path routing never crosses **any** bar (source, target, or an intermediate one in the way): a clear vertical channel in the gap for forward links (slid to a clear column when a bar blocks it), a drop in a clear column via the row-boundary band for overlapping/"going back" links, and a right-outside detour around every bar when no clear column exists. **Diagram-style alignment**: a global pass groups connectors whose vertical legs share a y-corridor and slides them into one shared column (lines may overlap each other, never a bar). Every "passing a bar" moment uses one uniform margin — `LINK_PASS_PADDING`: a vertical run hugs the nearest bar edge it passes at exactly that distance, and a shared column hugs the nearest passed bar at the same distance (a leg passing no bar drops at the target's `LINK_ENTRY_CLEAR` — far enough left that the rounded elbow *and* the arrowhead both keep a straight approach into the port dot — and the first corner keeps `LINK_EXIT_CLEAR` past the source edge so the exit curve never hugs the bar). Links sharing a bar edge take **ordered even slots** (`computeLinkFanOffsets`): each side's links are sorted by the other endpoint's Y and assigned evenly spaced ports (spacing = min(`LINK_FAN_MAX_SPREAD` 16, (barH − 2·`LINK_FAN_INSET` 4)/(n−1)), n=1 stays centred) so ports never overlap and lines never cross at the ports; the drag-to-create handle and the rubber preview depart from the **handle slot** (`fanHandleOffset`): the bar centre when free, otherwise `LINK_FAN_MAX_SPREAD` away from the nearest port toward the bar edge (floating `LINK_HANDLE_OVERHANG` 4px into the row padding), falling back to the largest free gap on a crowded side — so the handle never sits on an existing port. The timeline carries a **right gutter** (`LINK_RIGHT_GUTTER`, 24px of blank surface past the scale) so rightmost outside-route swings and their arrowheads never sit at the scroll edge |
| Drag to create dependency | `useGanttDrag` link kind + `linkSourceAnchor` | rubber-band preview |
| Hierarchy + roll-up progress | `buildRows` + `rollupProgress` | duration-weighted |
| Collapsible groups + lanes | `buildRows` (`open`), component collapse state | lanes are a differentiator |
| Multi-scale header + smooth zoom | `buildTimeScale` + `pickBaseUnit` | coarse→fine, calendar-true widths; header is a detached strip above the body (scale window scroll-synced, toolbar pinned to its right edge) |
| Snap to unit | `snapDate` | none/hour/day/week |
| Milestones | `type:"milestone"` | diamond glyph, zero-width bar |
| Per-task / per-lane / accent colour | `tokens.ts` | `TrueColor` only |
| Today marker | `todayX` | line + "Today" chip on the header's scale window **and** a body line, same x; `motion-reduce`-safe |
| Select + delete dependency | link layer + `onRootKeyDown` + `pickLinkAt` | click to select (focuses chart, glows, floating ✕ control); `Delete`/`Backspace`, double-click, or the control remove; `Esc` or clicking/pressing outside the connector deselects. Each arrow has a wide invisible **hit stroke** (`LINK_HIT_RADIUS` px each side of the 1.5px line) so it can be grabbed without pixel-perfect aiming; a click resolves to the **nearest** route within the radius, so two close connectors never fight over the same pointer |
| Keyboard editing | `onBarKeyDown` | arrows nudge, Shift+arrows resize |
| Framework-agnostic core | `common/gantt/` | reusable by any framework |

**Explicitly deferred to v2:** row/timeline **virtualisation** (the row model is already a flat,
ordered list of px-geometric rows, so it drops in cleanly), lead/lag offsets on links, and
cross-lane drag.

## 4. Time scale & zoom

- **Zoom = `pxPerDay`** (a number, not a semantic level), clamped to `GANTT_MIN_ZOOM=0.4` …
  `GANTT_MAX_ZOOM=96`.
- **`GANTT_ZOOM_PRESETS`:** Day `48`, Week `16`, Month `5`, Quarter `1.6`. The toolbar snaps to the
  nearest preset label but allows fine `−`/`+` (×/÷ 1.25) and `Ctrl`/`Cmd`+scroll pinch at the cursor.
- **Zoom-independent view range:** `computeViewRange(starts, ends)` = data span ±7 days, computed from
  the *dates*, not the zoom. This is what makes zoom anchoring exact (the day under the cursor stays
  under the cursor).
- **Multi-level header:** `pickBaseUnit(pxPerDay)` → fine unit (≥24px day, ≥4px week, ≥0.8px month,
  else quarter); `buildTimeScale` emits a coarse band + fine band whose columns tile the range with
  **calendar-true widths** (a week column is always 7 days wide; edge columns clamp to the range).
  ISO week numbers are shown. The scale **renders each cell at its true `width`** (not
  content-sized), so the header's column boundaries coincide exactly with the body's grid lines —
  same data, same px, in both kits. The month label is **month name + full 4-digit year**
  (never a 2-digit year — at day zoom "Aug 26" reads as the 26th and looks misaligned against the
  day numbers).

## 5. Layout

`buildRows(tasks, lanes?, rowOrder?, rowHeight?)` returns
`{ rows, tasksById, laneById, laneOrder }`. Each `GanttRow` carries `key`
(`task:<id>` / `lane:<id>`), `top`, `height`, `depth`, `isGroup`, `progress`, `lane`, `task`.
`DEFAULT_ROW_HEIGHT=44`, `GROUP_ROW_HEIGHT=40`. The left column area is a set of `GanttColumn`s
(name 220 / owner 120 / progress 110 by default).

- **The chart is a `Panel`.** The container chrome (fill, border, backdrop, corner) comes from
  the `variant` prop (`PanelVariant`, **default `elevated`**). The variant propagates through the
  shared surface tokens to everything the chart renders: the header hairline and row/cell hairlines
  use `getSurfaceTextTokens(variant).divider` (solid → neutral hairline, translucent → the glass
  divider), and the zoom toolbar pill uses the shared surface-variant class set
  (`getSurfaceVariantClasses(variant, "neutral")`) so it sits flush beside the container.
- **Detached header.** The header is a fixed strip *above* the body — not inside the scroller, so
  it never scrolls and no `sticky` is needed. It is three zones: the column labels (fixed
  `leftWidth`), a **scale window** (`overflow-hidden`, takes the rest) whose scale content is
  translated by `−scrollLeft` in sync with the body scroller so the multi-scale header stays
  aligned with the grid, and the **zoom toolbar pinned to the header's right edge** (absolute
  overlay — always visible, never scrolls out of view). A transform is used instead of copying
  `scrollLeft` into the window: the body's scroll range can exceed the window's (the link layer's
  right-outside detours push the body's `scrollWidth` past the timeline end), so a clamped
  scroll-copy would silently desync, while a translate tracks the body 1:1 at every position.
- **`leftWidth` includes the 36px grip/caret column** (`GRIP_WIDTH` + the column widths). The
  left block, the grid lines and the scale window all start at `leftWidth`, so the columns never
  overflow into the first days of the timeline and the header columns line up exactly with the
  row cells.
- **Chart header strip.** The `shrink-0` strip **above the 52px column header** is **always
  rendered** (it provides the header space even when `title` / `subtitle` / `icon` /
  `actions` are absent) and the **zoom selector always renders inside it at the right edge**
  (after `actions`) — it never floats over the scale window. Part of the chart surface, so
  the `variant` applies to it: its bottom hairline uses `getSurfaceTextTokens(variant).divider`
  and the icon tile (`h-10 w-10 rounded-xl`) uses
  `getSurfaceVariantClasses(variant, "neutral")` (elevated → white tile + soft shadow,
  flush → flat bordered tile, glass → translucent). `subtitle` renders as a small uppercase
  eyebrow **above** the `title` (reference-design layout); both truncate. In React
  `icon`/`actions` are `ReactNode`; in Vue they are `VNodeChild` props rendered via the
  internal `VNodeRenderer` (same pattern as `renderCell`/`renderBar`). `false` counts as
  absent for the node props (React idiom — and Vue boolean-casts VNode-typed props to
  `false` when they are not passed); the body's `flex-1` absorbs the strip's height.
- **Scale bands:** the coarse band is a fixed 24px; the fine band takes the remaining height
  (`flex-1`) and the label/sublabel spans use `leading-none` so a two-line cell (day number +
  weekday, month + year) fully fits the band — no clipped sublabels at day zoom.
- **Lane rows share the task-row column geometry:** the lane's left block is zoned into
  grip (caret) + the same columns, and the lane's roll-up progress renders in the **Progress
  column** (not at the right edge of the row), aligned with the task rows' progress cells.
- **Today marker on the header.** The today line pierces the header scale window at `todayX`
  with a "Today" chip riding today's column; the body keeps its own today line (header line and
  body line share the same x by construction).
- The **body is the only scroller** (both axes) with the sticky-left column cells; the timeline is
  a single horizontally-scrollable region of width `rangeWidth × pxPerDay`.

## 6. Styling & accessibility

- **Colour discipline:** only `TrueColor` (21 palettes) reaches the chart. Every colour is a
  class-string token from `tokens.ts` (bar fill/progress, lane band, link stroke/fill, today line,
  selection ring) — **no hand hex**, matching the rest of the kit.
- **Safelist:** the dynamic classes the tokens emit are added to `scripts/generate-safelist.mjs`
  (a Gantt section: `bg-{c}-700/70`, `dark:bg-{c}-950`, `dark:bg-{c}-950/40`,
  `border-{c}-600/40`, `dark:border-{c}-500/50`, `ring-{c}-400/50`) and regenerated — required because
  Tailwind v4's scanner can't see template-built class strings.
- **A11y:** bars are `role="button"` with `aria-label="<name>, <start>–<end>"`, `data-gantt-bar` /
  `data-row-key` hooks, a visible selection ring, focus-visible, and a `motion-reduce`-safe today
  pulse; `loading` renders a skeleton with `aria-busy`; `tasks: []` renders a quiet empty state.
- **Dark mode** via the kit's `dark:` custom variant; glass/flat surfaces inherit `Panel` conventions.

## 7. Verification

| Check | Command | Result |
|---|---|---|
| Engine unit tests (35) | `cd react && npx vitest run src/components/Gantt/gantt-engine.test.ts` | ✅ pass |
| React component tests (12) | `cd react && npx vitest run src/components/Gantt/Gantt.test.tsx` | ✅ pass |
| Full React typecheck | `cd react && npx tsc --noEmit -p tsconfig.json` | ✅ exit 0 |
| Full React test suite (3665) | `cd react && npx vitest run` | ✅ pass |
| React kit build | `cd react && npm run build` | ✅ |
| React demo build | `cd react/demo && npx vite build` | ✅ exit 0 |
| Vue typecheck (vue-tsc) | `cd vue && npm run lint` | ✅ (see Vue port) |
| Vue kit build | `cd vue && npm run build` | ✅ |

## 8. Files added / changed

- **Added** `common/gantt/{types,time,layout,drag,tokens,sample,index}.ts`
- **Added** `react/src/components/Gantt/{Gantt,GanttScale,GanttBodyRow,GanttLinkLayer,GanttToolbar}.tsx`,
  `react/src/components/Gantt/useGanttDrag.ts`, `react/src/components/Gantt/index.ts`
- **Added** tests `react/src/components/Gantt/{gantt-engine.test.ts,Gantt.test.tsx}`
- **Added** `vue/src/components/Gantt/*` (Vue port)
- **Added** demo `react/demo/src/pages/UxDemo/demos/GanttDemo.tsx` (+ section registration)
- **Changed** `react/src/components/index.ts` (export Gantt), `scripts/generate-safelist.mjs`
  (Gantt section) + regenerated `common/safelist.css`
- **Docs** `docs/gantt-chart-library-research.md`, `docs/design_system/ui-kit.md` (catalog + section),
  this spec.
- **Chart header (added later this session):** `title` / `subtitle` / `icon` / `actions` props on
  `react/src/components/Gantt/Gantt.tsx` + `vue/src/components/Gantt/Gantt.vue` (strip above the
  column header), demo usage in
  `react/demo/src/kit-docs/components/gantt/GanttPlayground.tsx`, tests in
  `Gantt.test.tsx` / `Gantt.test.ts`.

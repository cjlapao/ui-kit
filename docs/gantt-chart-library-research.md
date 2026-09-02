# Gantt Chart Library Research — "Best of the Best" Feature Matrix

**Purpose:** Input to the design spec for a feature-rich, custom Gantt component in the ui-kit.
**Research date:** 2026-08-30 (all vendor pages fetched live; Bryntum API verified by inspecting the actual `@bryntum/gantt-trial@7.3.5` npm distribution, d.htmlx/Syncfusion verified via their docs sites, open-source candidates via npm registry READMEs/source).

> Method note: the session's `web_search` tool was unavailable (no API key), so research was done by direct fetches of vendor pages/docs + npm package inspection. Every material claim below has a source URL. Items I could not verify are explicitly marked **(unverified)**.

---

## 1. Landscape findings (read this first)

1. **AG Grid no longer has its own Gantt.** The AG Grid docs site now routes "Gantt Charts → See Bryntum Gantt", and the ag-grid.com navigation lists Bryntum products (Gantt, Scheduler, Scheduler Pro, Calendar, Task Board) as first-class products. The old `/ag-grid-enterprise/gantt/` page is a 404. Practical consequence: for a UI kit, "AG Grid Gantt" **is** Bryntum Gantt; AG Grid itself is only a *DIY foundation* (grid with row drag, tree data, virtualization) on which you'd hand-roll a Gantt. Sources: [docs.ag-grid.com Gantt redirect](https://docs.ag-grid.com/gantt/), [ag-grid.com nav](https://www.ag-grid.com/), [AG Grid pricing](https://www.ag-grid.com/license-pricing/).
2. **dhtmlxGantt v10 is the big open-source story.** The Community edition moved from GPL-2.0 to **MIT** (v10+), got a new scheduling engine and official Angular/Vue wrappers, and ships a surprisingly complete core for free (4 link types, drag-and-drop, keyboard navigation, smart rendering, milestones) — though note a long list of features (undo/redo, critical path, resource management, baselines, task grouping, WBS, multi-task DnD, dynamic loading…) are PRO-only per the editions table in §3. Source: [dhtmlx product page](https://dhtmlx.com/docs/products/dhtmlxGantt/), [Community vs PRO table](https://docs.dhtmlx.com/gantt/guides/editions-comparison/).
3. **Bryntum Gantt remains the feature ceiling.** It is the only vendor with: full 4-type dependency editing with lead/lag, critical path, S-curves, baselines, version history, animated dependent-task redraws, a real scheduling engine that also runs in Node, PERT integration, and per-developer pricing that's actually cheaper than its rivals. Source: [Bryntum Gantt](https://www.bryntum.com/products/gantt/), [full feature list](https://www.bryntum.com/products/gantt/features/), [pricing](https://www.bryntum.com/store/).
4. **The open-source field is thin.** `gantt-task-react` (MIT) is the best React option but is a "timeline with grid" — no resources, no virtualization, no critical path, no keyboard a11y. `frappe-gantt` (MIT) is a lightweight timeline editor (no grid at all). `react-gantt` (codejamninja) is stale (last release 2019) and display-only. `ant-gantt` (Didi) was **unpublished from npm in Jan 2021** and its GitHub repo is gone (404). PrimeVue (v5) has **no Gantt component** (only a vertical `Timeline`), verified via the [PrimeVue component list](https://primevue.org/components/). FullCalendar's `@fullcalendar/timeline` plugin (MIT) is a *timeline*, not a Gantt (no grid, no dependencies, no milestones).
5. **Syncfusion is the "broad enterprise SDK" pick** — the strongest a11y story of all (WCAG 2.2 AA, WAI-ARIA grid/gridcell/aria-grabbed), built-in virtualization (rows *and* timeline), critical path, split tasks — but it's the most configuration-heavy and the least "Gantt-native" (no snapping, no row reordering, no swimlanes in what's documented).

---

## 2. Feature matrix

Legend: ✅ yes (core) · 🟡 partial / PRO / config-dependent · ❌ no / not documented · — not applicable

| Feature | **Bryntum Gantt 7.3.5** | **dhtmlxGantt 10.x** | **Syncfusion JS Gantt (EJ2)** | **AG Grid (DIY foundation)** | **gantt-task-react 0.3.9 (MIT)** | **frappe-gantt 1.2.2 (MIT)** | **FullCalendar Timeline 6.1.21 (MIT)** |
|---|---|---|---|---|---|---|---|
| **Drag & drop to move task** | ✅ mouse+touch; `beforeTaskDrag` → `afterTaskDrop`, cancelable | ✅ `drag_move`; `onBeforeTaskMove`/`onAfterTaskMove`, cancelable; multi-task DnD = PRO | ✅ taskbar drag (`allowTaskbarDragAndDrop`); `taskbarEditing`/`taskbarEdited` + `actionBegin` cancel | ✅ as grid rows (`rowDrag`) only; you build the bar logic | ✅ `onDateChange(task, children)` on drag end | ✅ bar drag; `move_dependencies` cascades | ✅ core event drag (move) |
| **Drag to resize (duration)** | ✅ `beforeTaskResize` → `afterTaskDrop`; split-task segments (`beforeTaskSegmentResize`) | ✅ `drag_resize`; resize via grid or timeline | ✅ left/right resize grippers (`.e-gantt-left/right-resize-gripper`) | ❌ (roll it) | ✅ same `onDateChange` (start/end handles, `handleWidth`) | ✅ bar resize | ✅ core event resize |
| **Drag to reorder rows (vertical)** | ✅ grid row drag: `gridRowDragStart`/`gridRowDrop`/`gridRowDragAbort`; column drag too | ✅ `order_branch` / `order_branch_free`; `onRowDragStart`/`onRowDragEnd`; `reorder_grid_columns` | ❌ (order = data order; hierarchy only) | ✅ tree row drag | ❌ | ❌ (no grid) | ❌ (no rows) |
| **Dependencies (FS/FF/SF/SS)** | ✅ all 4 types + **lead/lag** (`lag`, `lagUnit`), drag-to-create links, bidirectional, cycle-safe | ✅ all 4 types + lag (PRO for full set incl. constraints); `drag_links`; `findCycles()` | ✅ all 4 + **offsets** (e.g. `"2:SS:2d"`), predecessor editor, per-connector styling | ❌ (roll it) | 🟡 single-style arrows (`dependencies: string[]`), no types, no lag | 🟡 arrows, single type, `move_dependencies` | ❌ |
| **Progress %** | ✅ `progress` on TaskModel, ProgressBar feature, planned/actual percent | ✅ `task.progress`, **`drag_progress`** (drag to set %), progress coloring | ✅ `progress` field, progress resize gripper, multi-taskbar rollup | n/a | ✅ `onProgressChange`, progress drag | ✅ `progress`, `show_expected_progress` | ❌ |
| **Milestones (diamond)** | ✅ `type:'milestone'`, `toMilestone()`, MilestoneColumn | ✅ task type `milestone` (Community ✔) | ✅ `milestoneTemplate`, milestone rows | ❌ | ✅ `type:'milestone'` | ❌ | ❌ (custom render only) |
| **Lanes / swimlanes** | ❌ (closest: `subGridConfigs` side-by-side grids + `groupBy`) | ❌ (closest: tasks grouping PRO) | ❌ (closest: resource view groups rows by resource) | 🟡 (custom) | ❌ | ❌ | ❌ |
| **Groups / collapsible headers w/ rollup** | ✅ `type:'group'`, collapsible grid sections, group bars roll up duration/progress | ✅ parent/summary tasks auto-rollup; "Tasks grouping" = PRO | ✅ parent tasks rollup; `enableMultiTaskbar` aggregates child progress in collapsed parent bars | ✅ tree/group rows rollup (grid-level) | ✅ `type:'project'` row w/ aggregated children bar | ❌ (flat list) | ❌ |
| **Subtasks / hierarchy (indent)** | ✅ parent/child tree, indent/outdent, tree editing | ✅ parent/child; keyboard `Shift+←/→` indent/outdent | ✅ nested JSON (`child:'subtasks'`) tree | ✅ tree data (self-referential) | ✅ `children[]`, expander (`onExpanderClick`) | ❌ | ❌ |
| **Custom colors per task/row** | ✅ CSS class on model data or `eventRenderer`; per-taskbar styling API | ✅ `task_class` template, per-task CSS, progress-percent coloring | ✅ `queryTaskbarInfo` → per-task `taskbarBgColor`/`progressBarBgColor`; cell templates | ✅ cell styles | ✅ per-task `styles` (bg/progress/selected colors) + global | 🟡 CSS vars/theme options | 🟡 event color prop |
| **Column/row customization (per-column color/tone)** | ✅ 25+ built-in columns, custom columns, per-column styling, dynamic row height | ✅ configurable columns, per-column styling, `columns` API, custom tree formatting | ✅ custom columns, WBS column, frozen columns, column-based media queries | ✅ columns API (pin/move/size/style) | 🟡 `TaskListHeader`/`TaskListTable` React slots, per-cell widths | ❌ (no grid) | ❌ (no grid) |
| **Multi-level time scale (day/week/month/quarter)** | ✅ multi-scale time axis, **customizable zoom levels**, "milliseconds to years" | ✅ `scales` array (any units, e.g. year+month / week+day), `smart_scales`, working-hours scales | ✅ hour/day/week/month/year views + zoom "minute to decade" | n/a (timeline you render) | ✅ `viewMode`: Hour, QuarterDay, HalfDay, Day, Week, Month, Year (discrete) | ✅ Day/Week/Month/Year + **custom `view_modes`** (upper/lower header formats) | ✅ timelineDay/Week/Month/Year views |
| **Zoom in/out on timeline** | ✅ `zoomIn/zoomOut/zoomInFull/zoomOutFull/zoomToLevel/zoomToSpan`, min/max levels, smooth zoom | ✅ `gantt.zoomTo/zoomMax/zoomMin` (level = scale unit) | ✅ timeline zoom (cell width + units dynamically) | n/a | ❌ (view switch only) | ❌ (view switch only) | ❌ (view switch only) |
| **Today / current-date marker** | ✅ **ProgressLine** feature (statusDate / current-date line, `progressLineDrawn`) | ✅ dynamic "today" progress line + `addMarker` for custom time markers | 🟡 (unverified: holidays/event markers yes; dedicated today line not confirmed in fetched docs) | n/a | ✅ `todayColor` (highlights current period column) | ✅ today marker line + `scroll_to:'today'` + `today_button` | ✅ (core "now indicator") |
| **Custom task rendering / templates** | ✅ "each timeline element (task, parent, milestone) rendered with your own custom template"; `taskRenderer`; 50+ widgets; rich tooltips | ✅ `gantt.templates.*` (task_text, task_class, tooltip_text, bar_height…), `type_renderers`, `addTaskLayer/addLinkLayer/addMarker` for custom timeline elements | ✅ `taskbarTemplate` / `parentTaskbarTemplate` / `milestoneTemplate`, tooltip templates, custom editors | ✅ custom cell renderer/components | ✅ `TooltipContent` / `TaskListHeader` / `TaskListTable` React components | ✅ `popup` API (custom HTML, actions) | ✅ event content custom renderers |
| **Critical path** | ✅ `CriticalPaths` feature module (verified in API) + S-curve, baselines, conflicts examples | ✅ **PRO** (`highlight_critical_path`, `getFreeSlack()`, auto-scheduling) | ✅ `enableCriticalPath` + `criticalPath` module; CPM slack calc, red highlight, `getCriticalTasks()`, `isCritical` flag | ❌ | ❌ | ❌ | ❌ |
| **Resource loading / capacity** | ✅ assignments, resource model with **capacity (`units` %)** and overallocation flags, assignment picker, drag-from-grid to assign; auto-scheduling/constraints = Scheduler Pro | ✅ **PRO**: resource store, load histograms, usage diagrams, load balancing, per-resource calendars | 🟡 resource *allocation* (multiple resources/task) + hierarchical **resource view**; no load-balancing histogram documented | n/a | ❌ | ❌ | ❌ (resources = separate Scheduler plugin, commercial) |
| **Snapping (snap to day/week)** | ✅ `snap: boolean` — "snap to the current time resolution increment while interacting with scheduled events. Affects drag drop and resizing" (verified in d.ts) | ✅ `time_step` (minutes) + `round_dnd_dates`; multi-day/week stepping via config | ❌ (none documented) | n/a | ✅ `timeStep` (ms) for `onDateChange` | ✅ `snap_at` (interval, per view mode) | 🟡 `snapDuration` (core) |
| **Keyboard accessibility** | ✅ keyboard navigation + shortcuts, focus renditions (`enableKeyboardCssModifiers`), `selectOnKeyboardNavigation` (verified in d.ts) | ✅ `keyboard_navigation` plugin: row **and** cell navigation, full built-in shortcut set (Tab/Arrows/Ctrl+Enter create/Delete/Enter lightbox/Shift+←→ indent/Ctrl+Z undo), custom scoped shortcuts, `wai_aria_attributes` config | ✅ strongest claim: **WCAG 2.2 AA**, full keyboard cell nav, WAI-ARIA (`grid`, `gridcell`, `aria-grabbed`, `aria-expanded`, `aria-rowindex`/`aria-colindex`), screen-reader support, RTL | ✅ grid keyboard nav + ARIA (grid-level only) | ❌ (not documented) | ❌ (not documented) | 🟡 basic (core) |
| **Virtualization / big-data perf** | ✅ "support for huge datasets", grid virtual scrolling, timeline column virtualization, "big data set demo" | ✅ `smart_rendering` (Community ✔), `dynamic_loading` + `branch_loading` (PRO) — "tens of thousands of tasks" | ✅ `enableVirtualization` (row) **+ `enableTimelineVirtualization`** (timeline cells on demand) | ✅ DOM virtualization, massive row counts | ❌ (renders all rows) | ❌ (renders all bars) | ❌ |
| **Undo/redo** | ✅ (feature list) | 🟡 **PRO** per editions table | ✅ (module) | ✅ (grid-level) | ✅ (return `false` from callback = undo op) | ❌ | ✅ (core) |
| **Touch support** | ✅ | ✅ (`touch_drag`, iOS/Android) | ✅ (touch gestures, zero-config) | ✅ | ✅ | ✅ | ✅ |
| **Export** | ✅ PDF/PNG/Excel, MS Project, ICS, print, PERT | ✅ PDF/PNG/Excel/iCal/MS Project/Primavera P6 (local modules or online) | ✅ Excel/PDF/CSV | ✅ CSV/Excel (grid) | ❌ | ❌ | ✅ (core, limited) |
| **MS Project import** | ✅ via MPXJ | ✅ MS Project + Primavera P6 (PRO add-on modules) | ✅ (blog docs) | ❌ | ❌ | ❌ | ❌ |

### Notable per-library extras

- **Bryntum:** S-curve, baselines vs actual, **version history** (project snapshots w/ change log), scheduling **conflicts** detection (postpone/resolve), animated redraw showing how dependents move, scheduling engine **runs server-side in Node**, 5 themes + high-contrast themes, 256 documented Gantt events (rich `before*/after*` lifecycle), JSON data packs with `load`/`sync` CRUD.
- **dhtmlxGantt:** 8 skins (Terrace/Dark/Material/Contrast…), baselines/deadlines (PRO), task constraints (PRO), WBS codes (PRO), split tasks (PRO), unscheduled tasks (PRO), lightbox (customizable edit form), quick info/touch popups, DataProcessor (auto AJAX sync), Node.js server module (PRO), multi-Gantt per page, AI-assisted config (MCP server, agent skills — new in v10 era).
- **Syncfusion:** split/merge tasks, WBS column, frozen columns (left/right/both), auto-scroll-to-taskbar on row selection, data markers & event markers, holidays, Excel-like + menu filtering, OData/REST/WCF data binding, themes incl. **Tailwind CSS**, column-based media queries, AI assistant (MCP server, agent skills).
- **gantt-task-react:** `isDisabled` per task, RTL, locales, `preStepsCount` padding, selected-task styling, Promise-returning callbacks for validation.
- **frappe-gantt:** `ignore` periods (weekends/holidays excluded from progress math), `infinite_padding` (infinite horizontal scroll), multilingual, popup action buttons, used by ERPNext.

---

## 3. License & pricing

| Library | License | Price (as of 2026-08) | What's free |
|---|---|---|---|
| **Bryntum Gantt** | Commercial (per-developer; EUL for internal apps, **OEM** for SaaS/redistribution; every dev needs a license) | **From $940** per product; Complete bundle (Gantt+Scheduler+Scheduler Pro+Grid+Calendar+TaskBoard) **from $3,790** | 30-day trial; trial package on public npm (`@bryntum/gantt-trial`, aliasable to licensed package). Legacy open-source ganttjs (GPL-2.0) is archived |
| **dhtmlxGantt** | **Community: MIT** (v10+; earlier free versions were GPL-2.0) · PRO: commercial per-developer, 1-yr term w/ support | PRO: **$799** Individual / **$1,599** Commercial / **$2,999** Enterprise / **$5,999** Ultimate (bundles from ~$206/dev) | Core Gantt under MIT: DnD, 4 link types, inline editing, keyboard nav, smart rendering, milestones/projects, undo/redo (no — PRO), baselines (no — PRO)… see editions table. **PRO-only:** auto-scheduling, critical path, resource management, baselines/deadlines/constraints, task grouping, WBS, multi-task selection, multi-task DnD, dynamic loading, undo/redo, split tasks, decimals, placeholder row |
| **Syncfusion JS Gantt** | Commercial (Essential JS 2 / Gantt SDK); **free Community License** if < $1M revenue, ≤5 devs, ≤10 employees | Quote-based via "Buy Now" (30-day trial; pricing not published on product page) — treat as ~$799–$1,500/dev ballpark (unverified) | Community License (qualifying small orgs); 30-day full trial |
| **AG Grid** | Community: **MIT** · Enterprise: commercial | **From $999/dev** (perpetual, 1 yr updates); Grid+Charts bundle **from $1,498/dev** | MIT Community edition (no Gantt module — see §1) |
| **gantt-task-react** | MIT | Free | Everything listed in matrix |
| **frappe-gantt** | MIT | Free | Everything listed |
| **react-gantt (codejamninja)** | MIT | Free | Everything (stale since 2019) |
| **@fullcalendar/timeline** | **MIT** (Standard plugins; Premium/Scheduler is commercial) | Free (MIT); FullCalendar Premium commercial | Timeline plugin is a Standard plugin → MIT |
| **ant-gantt** | (MIT) | **Dead**: unpublished from npm 2021-01, GitHub repo 404 | — |

Sources: [Bryntum store](https://www.bryntum.com/store/), [Bryntum licensing](https://www.bryntum.com/products/gantt/license/), [dhtmlx product page (prices)](https://dhtmlx.com/docs/products/dhtmlxGantt/), [dhtmlx editions comparison](https://docs.dhtmlx.com/gantt/guides/editions-comparison/), [Syncfusion product page (license FAQ)](https://www.syncfusion.com/javascript-ui-controls/gantt-chart), [AG Grid pricing](https://www.ag-grid.com/license-pricing/), [FullCalendar license](https://fullcalendar.io/license), npm registry metadata (gantt-task-react v0.3.9, frappe-gantt v1.2.2, react-gantt v2.1.8, @fullcalendar/timeline v6.1.21, primevue v5.0.1, ant-gantt unpublished).

---

## 4. API design patterns (the interesting part for our core)

### 4.1 Data shapes

| Library | Tasks | Dependencies | Resources | Notes |
|---|---|---|---|---|
| **Bryntum** | `tasks[]` flat, with `parent` ref; model instances in a Store | `dependencies[]` separate: `{source, target, type (FS/FF/SF/SS int const), lag, lagUnit}` | `resources[]` + `assignments[]` (task×resource×units) | Store-based MVC; JSON: `{tasks, dependencies, assignments, resources}`; CRUD packs with `requestType: 'load'|'sync'` (`beforeLoad`/`beforeSync` hooks) |
| **dhtmlx** | `data[]` flat, `parent` id; `gantt.parse({data, links})` | `links[]` separate: `{source, target, type, lag}` | `resources` store (PRO) | `DataProcessor` auto-fires AJAX on add/update/delete |
| **Syncfusion** | **Nested** JSON (`child: 'subtasks'`), mapped via `taskFields` | **Inline string field** `Predecessor` (e.g. `"1,3:SS:2d"`) | Allocation fields inline | `dataSource` + declarative `taskFields` mapping; module `Inject()` |
| **gantt-task-react** | **Nested** `children[]` | `dependencies: string[]` (parent ids) | — | Props-driven; `onDateChange(task, children)` returns void/boolean/Promise (false = undo) |
| **frappe-gantt** | Flat `[{id,name,start,end,progress,dependencies[]}]` | Inline `dependencies[]` (ids) | — | `new Gantt(el, tasks)` + options object; `.update_task(id, props)` |
| **FullCalendar** | `events[]` `{start,end}` | — | (Scheduler plugin, premium) | `Calendar` instance + plugin |

**Pattern consensus:** the serious Gantts (Bryntum, dhtmlx) keep **tasks and links as separate arrays with a `parent` reference** (flat hierarchy, not nested children). Syncfusion and gantt-task-react use nested children / inline predecessor strings — convenient for display, awkward for editing, undo, real-time sync, and cycle detection. **Recommendation: follow the Bryntum/dhtmlx shape** (see §7).

### 4.2 Event / edit-emission patterns

- **Bryntum** (256 Gantt events, verified in 7.3.5 `gantt.d.ts`): fine-grained `before*/after*` lifecycle with **cancelable validation**: `beforeTaskDrag` → `beforeTaskDropFinalize` → `afterTaskDrop`; `beforeTaskResize`/`beforeTaskResizeFinalize`; `beforeTaskSegmentDrag/Resize/Drop` (split tasks); `beforeDependencyAdd/Edit/Delete`, `beforeDependencyCreateDrag` → `afterDependencyCreateDrop` (draw-a-link gesture); `gridRowDragStart/gridRowDrop`; `beforeTaskAdd/Save/Delete/Edit`. Plus store-level `change` events and `catchAll`. Server sync via load/sync packs.
- **dhtmlx**: `attachEvent`/`detachEvent` on the gantt **and on DOM parts** (e.g. `gantt.$task_data.attachEvent("onBeforeDrag")`); `onBeforeTaskMove` (cancelable) / `onAfterTaskMove`; `onAfterTaskUpdate`; `onRowDragStart`/`onRowDragEnd`; `onAfterLinkAdd/Delete/Update`; DataProcessor `onAfterBatchUpdate`; custom scoped keyboard shortcuts (`addShortcut(key, fn, scope)`).
- **Syncfusion**: `actionBegin` (cancelable validation for drag/resize/dependency/cell edits) + `actionComplete`; rendering hooks `queryTaskbarInfo`/`queryCellInfo` (per-task conditional color/visibility/ARIA); `taskbarEditing`/`taskbarEdited`; template props; `beforeTooltipRender`.
- **gantt-task-react**: React props callbacks only (`onDateChange`, `onProgressChange`, `onDelete`, `onClick`, `onExpanderClick`), with `false`-return undo and `timeStep` snapping.

**Design implication for our core:** a three-stage event contract (`start` → `preview` (per-frame) → `commit`, with a cancelable `before` hook) reproduces the union of the three commercial patterns and is what every serious product needs for validation, undo, and optimistic UI.

### 4.3 Config vs API split

- dhtmlx: `gantt.config.*` (169 documented config options) + `gantt.templates.*` + methods.
- Syncfusion: declarative config + `Inject()` modules (Selection, Edit, CriticalPath, VirtualScroll, UndoRedo…).
- Bryntum: instance config + **feature plugins** (CriticalPaths, ProgressLine, PercentBar, Versioning…) toggled via `features: [...]`.
- gantt-task-react: `EventOption` / `DisplayOption` / `StylingOption` prop groups.

---

## 5. Top 10 must-have features for a best-in-class Gantt (ordered)

1. **Drag-to-move task with a cancelable event contract** — the single most-cited capability; every serious product emits `before/after` hooks with validation (Bryntum `beforeTaskDrag`, dhtmlx `onBeforeTaskMove`, Syncfusion `actionBegin`). A UI-kit Gantt without it is a chart, not a tool.
2. **Drag-to-resize (duration) + drag-to-set-progress** — timeline editing is the essence of Gantt; dhtmlx proves three edit gestures coexist (`drag_move`, `drag_resize`, `drag_progress`); Bryntum adds split-task segment resize.
3. **Typed dependencies (FS/SS/FF/SF) with lead/lag, drawn as arrows, drag-creatable, cycle-safe** — this is the #1 differentiator from "timeline with bars"; all three commercial leaders support 4 types + offset (Bryntum `lag`/`lagUnit`, Syncfusion `"SS:2d"` offsets, dhtmlx `lag`); cycle detection (`findCycles`) is dhtmlx's bonus.
4. **Hierarchical tasks with collapsible group/summary bars and rollup** (duration + progress) — real projects are trees; rollup is table stakes (Bryntum group tasks, dhtmlx summary tasks, Syncfusion `enableMultiTaskbar` aggregation).
5. **Multi-level time scales + smooth zoom + snapping** — month→hour header stacks (dhtmlx `scales[]`, Bryntum "milliseconds to years" w/ custom zoom levels) and snapping to the current zoom step (Bryntum `snap`, dhtmlx `time_step`/`round_dnd_dates`, frappe `snap_at`) are what make dragging feel professional.
6. **Milestones (diamond markers)** — cheap to build, universally expected (Bryntum/dhtmlx/gantt-task-react all have first-class milestone types).
7. **Template-based custom rendering (taskbar, row, tooltip) + per-task/row color** — non-negotiable for a UI kit that must fit a design system; every leader offers it (Bryntum templates, dhtmlx `gantt.templates.*`, Syncfusion `*Template` props).
8. **Today/status line + holidays/worktime awareness** — orientation markers (Bryntum ProgressLine, dhtmlx markers, frappe today line) plus working-time calendars (all three commercial) for duration math.
9. **Performance: row virtualization + timeline-column virtualization** — the ui-kit will be asked for 1,000+ tasks; only Bryntum/dhtmlx (smart rendering + lazy branch loading)/Syncfusion (row **and** timeline virtualization) demonstrate this today; gantt-task-react/frappe render everything.
10. **Framework-agnostic core with thin framework adapters** — the architectural differentiator: Bryntum (JS core + React/Vue/Angular wrappers) and dhtmlx (core + official wrappers since v10) prove the model; our core should own the data model + gesture engine + rendering interface so React/Vue adapters are dumb bindings.

*(Honorable mentions, in differentiator tier: undo/redo, full keyboard a11y (WCAG 2.2 AA), critical path, baselines, export.)*

---

## 6. Table stakes vs differentiators

**Table stakes** (missing = not best-in-class; users will immediately notice):
drag-move · drag-resize · progress % · milestones · dependencies (≥FS, ideally 4 types) · hierarchy with rollup · multi-level time header · zoom · today marker · per-task colors · templates · inline grid editing · undo/redo · basic keyboard navigation · smooth behavior at hundreds of tasks · touch support.

**Differentiators** (competitive advantage for our component):
- typed links + lead/lag + drag-to-create + cycle detection
- **critical path** (CPM, zero/negative slack; only Bryntum/dhtmlx-PRO/Syncfusion)
- auto-scheduling & constraints (Bryntum engine, dhtmlx PRO)
- **baselines** + version history + conflict detection (Bryntum; dhtmlx PRO baselines; Syncfusion baselines)
- resource assignment + **capacity/load visualization** (Bryntum/dhtmlx PRO; Syncfusion partial)
- split tasks (Bryntum segments, Syncfusion split/merge, dhtmlx PRO)
- S-curves / PERT (Bryntum)
- **WCAG 2.2 AA + ARIA gridcell/aria-grabbed** (Syncfusion's bar; none else document it this strongly)
- timeline + row virtualization (all-3-commercial; none of the OSS)
- MS Project / Primavera / Excel import-export
- multi-grid / sub-grid layouts (Bryntum)
- server-side scheduling engine on Node (Bryntum, dhtmlx PRO)
- animated dependent-task redraws (Bryntum)

---

## 7. Recommended framework-agnostic data model (Gantt core)

```ts
// Core data shape — flat, denormalization-free, diff- and virtualization-friendly
interface GanttData {
  tasks: GanttTask[];              // FLAT list; hierarchy via `parent` (NOT nested children)
  links: GanttLink[];              // dependencies as a separate array
  resources?: GanttResource[];     // optional; assignments live on tasks
  project?: GanttProject;
  // Derived (computed in core, cached): taskTree, rollups, criticalPath, laneBuckets
}

interface GanttTask {
  id: string;
  name: string;
  startDate: string;               // ISO date/time — source of truth
  endDate: string;
  // duration is derived (worktime-aware); storing both start+end avoids
  // the Syncfusion-style ambiguity and matches dhtmlx/gantt-task-react
  parent?: string | null;          // hierarchy (flat reference)
  type?: 'task' | 'group' | 'milestone';   // 'group' = summary bar w/ rollup
  progress?: number;               // 0–100
  // Presentation & grouping hooks (lane = swimlane; groupKey = any-field grouping)
  laneId?: string;
  groupKey?: string;
  colorClass?: string;
  style?: Record<string, unknown>;
  workCalendarId?: string;         // working-time calendar (weekends/holidays)
  constraints?: { earliestStart?: string; latestStart?: string; latestEnd?: string; fixed?: boolean };
  resources?: { id: string; units?: number }[];  // assignments inline (units % of capacity)
  [customField: string]: unknown;  // extensible (Bryntum pattern: add fields to models)
}

interface GanttLink {
  id: string;
  source: string;                  // task id
  target: string;                  // task id
  type?: 'FS' | 'SS' | 'FF' | 'SF'; // default 'FS'
  lag?: { amount: number; unit: 'd' | 'h' | 'w' | 'm' };  // lead (negative) / lag
  hard?: boolean;                  // hard vs soft constraint (Bryntum hardType)
  colorClass?: string;
}

interface GanttResource {
  id: string;
  name: string;
  capacity?: number;               // 0–100 units
  calendarId?: string;
  colorClass?: string;
}

interface GanttProject {
  startDate?: string;
  endDate?: string;
  statusDate?: string;             // reference date for the today/progress line
  timezone?: string;
}
```

**Event contract (core → host):**

```ts
type GanttEvent =
  | { type: 'task:dragStart' | 'task:preview' | 'task:commit'; task: GanttTask; delta: { startDelta?, endDelta? } }
  | { type: 'task:resizeStart' | 'task:resizePreview' | 'task:resized'; task: GanttTask; edge: 'start'|'end'|'progress' }
  | { type: 'task:progressChanged'; task: GanttTask }
  | { type: 'row:reordered'; taskId: string; newIndex: number; parent?: string }
  | { type: 'link:created' | 'link:removed' | 'link:updated'; link: GanttLink }
  | { type: 'group:toggled'; taskId: string; collapsed: boolean };

// Validation: host may cancel 'task:dragStart'/'task:preview'/'link:created'
// by returning false / setting event.cancel = true  (Bryntum before* + Syncfusion actionBegin pattern)
// Commit fires once, post-undo; host persists and the core re-renders from data (single source of truth)
```

**Why these choices:**
- **Flat `tasks[]` + `parent`** (Bryntum/dhtmlx pattern) instead of nested children (Syncfusion/gantt-task-react): O(1) updates, trivial diff/patch for real-time sync, simple virtualization, no deep-clone hazards; the tree is a derived structure the core builds once per change.
- **Separate `links[]`** instead of inline predecessor strings: enables per-link styling, typed links with lag, link-level events, cycle detection, and clean server sync (the three commercial leaders all converge on this).
- **`startDate`+`endDate` as truth**, duration derived: matches dhtmlx & gantt-task-react; keeps worktime calendars (weekend/holiday math) correct without re-deriving from durations; Syncfusion stores all three, which forces consistency rules.
- **`laneId`/`groupKey` as fields** (not structural nesting): supports both swimlanes and Bryntum's "group by any field" with one mechanism; lanes are a projection, not a schema change.
- **Inline `resources[]` on tasks + separate `resources[]` list**: 90% of use (assignments w/ units) without a third join table; can be split into an `assignments[]` array later (Bryntum's shape) if capacity math needs it.
- **`statusDate` on project**: drives the today/progress line independently of "today" (Bryntum ProgressLine semantics) — important for planning tools operating on historical data.
- **`type: 'group'` explicit**: rollup bars are a first-class task type (Bryntum), not an inference from having children (dhtmlx auto-types) — makes the data model explicit and serializable.

---

## 8. Sources

- Bryntum: [product page](https://www.bryntum.com/products/gantt/) · [full feature list](https://www.bryntum.com/products/gantt/features/) · [licensing](https://www.bryntum.com/products/gantt/license/) · [pricing store](https://www.bryntum.com/store/) · npm `@bryntum/gantt-trial@7.3.5` (API verified from distribution: `gantt.d.ts` — events, `snap`, ProgressLine, CriticalPaths, SubGrid, DependencyBaseModel `lag`/`lagUnit`)
- dhtmlx: [product page + prices](https://dhtmlx.com/docs/products/dhtmlxGantt/) · [docs home](https://docs.dhtmlx.com/gantt/) · [Community vs PRO](https://docs.dhtmlx.com/gantt/guides/editions-comparison/) · [keyboard navigation](https://docs.dhtmlx.com/gantt/guides/keyboard-navigation/) · [click_drag DnD](https://docs.dhtmlx.com/gantt/guides/advanced-dnd/) · [API overview (methods/config/events)](https://docs.dhtmlx.com/gantt/api/api-overview/) · [order_branch](https://docs.dhtmlx.com/gantt/api/config/order_branch/) · [time_step](https://docs.dhtmlx.com/gantt/api/config/time_step/)
- Syncfusion: [product page](https://www.syncfusion.com/javascript-ui-controls/gantt-chart) · [taskbar doc](https://help.syncfusion.com/gantt-sdk/javascript/gantt-chart/taskbar) · [critical path](https://help.syncfusion.com/gantt-sdk/javascript/gantt-chart/critical-path) · [accessibility](https://help.syncfusion.com/gantt-sdk/javascript/gantt-chart/accessibility) · [virtual scroll](https://help.syncfusion.com/gantt-sdk/javascript/gantt-chart/virtual-scroll)
- AG Grid: [pricing](https://www.ag-grid.com/license-pricing/) · [docs nav: "Gantt Charts → See Bryntum Gantt"](https://docs.ag-grid.com/gantt/) · legacy gantt page 404 (fetched 2026-08-30)
- Open source: [gantt-task-react README (npm)](https://www.npmjs.com/package/gantt-task-react) · [frappe-gantt README (npm)](https://www.npmjs.com/package/frappe-gantt) · [react-gantt README (npm)](https://www.npmjs.com/package/react-gantt) · [@fullcalendar/timeline README (npm)](https://www.npmjs.com/package/@fullcalendar/timeline) · [FullCalendar license](https://fullcalendar.io/license) · [PrimeVue components](https://primevue.org/components/) · ant-gantt npm (unpublished 2021) + github.com/didi/ant-gantt (404)

## 9. Caveats / unverified items

- **Syncfusion exact JS Gantt price** is not published on the product page (quote-based); ballpark marked unverified.
- **Syncfusion today-line**: not confirmed in the fetched docs (holidays/event/data markers are confirmed); matrix row marked 🟡.
- **Bryntum docs site** (docs.bryntum.com) returned HTTP 503 to automated fetches; Bryntum API claims were verified against the actual v7.3.5 distribution instead (stronger evidence), but some prose claims (S-curve, animated redraws) come from the product/feature pages.
- **dhtmlx Community vs PRO** boundary is authoritative per their editions table, but individual PRO features may shift between releases; v10 is recent.
- AG Grid↔Bryntum corporate relationship: evidenced by the ag-grid.com site structure (Bryntum products in nav, docs redirect) — not a stated acquisition in fetched content; treat as "marketed together under AG Grid Ltd".

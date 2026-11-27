# Docs inventory — the standardization pass

**This file is the work list. Read it before touching a component page, and update
it after finishing one.** It is generated in part (the table below) and hand-marked
in part (the `Done` column), so it stays true across sessions: nothing is tracked
anywhere else. If you have lost the thread of the session, everything you need is
here.

## The goal

Every page in the side menu should look and behave like the same page:

1. a **playground** built on the schema-driven engine, whose **Code view prints the
   exact source — including the fixture data — that produces what is on screen**;
2. an honest **API** table;
3. an honest **Keyboard support** table;
4. an honest **Internationalization** topic.

…because a docs site where each page invents its own playground is a site where the
reader cannot trust any of them. The engine (`src/kit-docs/shared/playground/`)
already exists and is proven on two pages; this pass is mechanical work with a
quality bar, not design work.

## What "done" means for one page

Mark the `Done` box only when every line below is true for that page. "It already
looks fine" is not a pass — each line is verified against the component's source in
`react/src/components/`.

1. **Playground on the engine.** The page renders `<Playground playground={…}
   preview={…} …/>` from `shared/playground`. The options, the preview and the
   snippet all come from one `PlaygroundConfig` in `<name>Playground.ts` (`.tsx`, in the
   preview's own file, when the fixtures are JSX — one file holding config, preview
   and `code` beats two whose names differ only in casing). No
   hand-written `PlaygroundPanel` call remains. If the component is imperative
   (raises through a hook, pins a viewport), pass `code`; if it is declarative,
   pass `component={{ tag, imports }}` — AvatarGroup is the template, Toast is the
   imperative case.
2. **Defaults are the component's defaults.** Each field's `default` is what the
   *component* ships with, read from its source — not what makes the preview look
   best. `docDefault` is the printing bar; leave it out unless the documented
   default genuinely differs from the opening value, and if you set it, say why in
   a comment on that field. A prop with no documented default gets `alwaysEmit:
   true`. The rule this pass exists to enforce: **the playground opens at the
   control's own default, so the Code view starts minimal and prints a line only
   where the reader has actually deviated.**
3. **Preview and snippet agree.** The preview consumes the same resolved `state`
   and `data` the snippet prints, and every fixture is deterministic — no
   `Math.random()`, no `Date.now()`.
4. **Data shown, not hidden.** Anything the preview needs that is not a prop
   (rows, roster, tree, series) is a `data` source, so the Code view prints either
   the literal (`emit: "literal"`) or the generator (`emit: "source"`), with
   `note:` explaining how it was made.
5. **API table matches reality.** `PropsTable` covers every prop the component
   accepts (plus the attributes it forwards), with the true default in the `default`
   column and no invented rows. Add the section if the page has none.
6. **Keyboard support is real.** `A11ySection` → `A11yTopic title="Keyboard
   support"` with a `KeyboardSupportTable` whose rows are only bindings that exist
   in the source. Native behaviour may be named; invented key bindings may not.
7. **i18n answers the one question.** `A11yTopic title="Internationalization"`
   states who owns the strings the component speaks (component, `labels` prop, or
   the caller's children), and what happens in RTL or with long strings.
8. **A snippet test guards it.** `<name>Snippet.test.ts` prints the snippet from a
   few states and asserts (a) every printed attribute is a row of the page's own
   `PropsTable`, (b) default values are *not* printed, (c) the couplings between
   fields hold. This is what catches a playground that lies.

## How to convert one page

```bash
# 1. read the component's real API, its @default annotations, its key handlers
sed -n 1,200p react/src/components/Button.tsx        # most components are flat files
grep -rn "@default" react/src/components/Toast/types.ts
# 2. copy the shape of the declarative template, then fill the schema in
$EDITOR react/demo/src/kit-docs/components/avatar-group/avatarGroupPlayground.ts
# 3. typecheck the demo, test this page, refresh the table
cd react/demo && ../node_modules/.bin/tsc -p tsconfig.json --noEmit
npx --prefix react vitest run --root react demo/src/kit-docs/components/button
npm --prefix react/demo run audit
```

Then flip the page's `Done` box — its leading `☐` becomes `✅` — and move to the
next row. The table is regenerated from the registry on every `audit` run, so
hand-edit nothing else in it: the `✅` is carried across by slug and the rest of
the row is recomputed from the source. Rules of the engine (field kinds,
`alwaysEmit`, data sources, why `docDefault` exists) are in
[CONVENTIONS.md](CONVENTIONS.md); the tests for the engine itself are
`shared/playground/*.test.*`.

Notes on the tooling: `npm --prefix react test` (full kit suite) must be run from
`react/`, not the repo root — `src/icons/icons.test.ts` resolves paths from
`process.cwd()`. The demo has no vitest of its own; docs tests run through
`react/vitest.config.ts`.

## Order of work

Top to bottom in the side menu, one page at a time: Layout, Basics, Forms, Data,
Charts, Feedback, Overlays, Utilities. Within a category the table is already in
menu order. Take the whole page — playground *and* the three sections — rather than
doing every playground first: a half-converted page tells the reader less than a
plain one.

## Exempt pages

These are guides or galleries, not components — no playground and no props table is
expected, so they are done when their prose is accurate:

`utilities`, `a11y`, `i18n`, `charts` (the charts index), `icons` (icon gallery),
`charts-synced`, `charts-annotations` (compositions of other charts — a playground
would print a page of plumbing; a static `ExampleCard` set is honest).

## Status

<!-- BEGIN GENERATED TABLE — npm --prefix react/demo run audit -->
- **143 pages** in the side menu, **9 fully done** — run `npm --prefix react/demo run audit` after every conversion to refresh this table.
- Playground: 9 on the engine · 126 legacy `PlaygroundPanel` · 1 inline · 7 without one.
- Standard sections: API 80 · Screen reader 67 · Keyboard 66 · i18n 64.
- Tests: 9 pages have one · examples missing on 12 pages.

### Layout — 7/24 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ✅ | [Page Body Layout](page-body-layout/PageBodyLayoutPage.tsx) | `page-body-layout` | 🟢 engine | 17 fields | ✅ | ✅ | ✅ | ✅ | 0 | `pageBodyLayoutSnippet.test.ts` |
| ✅ | [Side Menu](side-menu/SideMenuPage.tsx) | `side-menu` | 🟢 engine | 37 fields · ⚠ 1 default | ✅ | ✅ | ⬜ | ✅ | 18 | `sideMenuSnippet.test.ts` |
| ✅ | [Breadcrumb](breadcrumb/BreadcrumbPage.tsx) | `breadcrumb` | 🟢 engine | 6 fields | ✅ | ✅ | ✅ | ✅ | 6 | `breadcrumbSnippet.test.ts` |
| ✅ | [Glass Background](glass-background/GlassBackgroundPage.tsx) | `glass-background` | 🟢 engine | 6 fields | ✅ | ✅ | ✅ | ✅ | 5 | `glassBackgroundSnippet.test.ts` |
| ✅ | [Gradient Backdrop](gradient-backdrop/GradientBackdropPage.tsx) | `gradient-backdrop` | 🟢 engine | 8 fields | ✅ | ✅ | ✅ | ✅ | 4 | `gradientBackdropSnippet.test.ts` |
| ✅ | [Grid Background](grid-background/GridBackgroundPage.tsx) | `grid-background` | 🟢 engine | 8 fields | ✅ | ✅ | ✅ | ✅ | 4 | `gridBackgroundSnippet.test.ts` |
| ✅ | [Panel](panel/PanelPage.tsx) | `panel` | 🟢 engine | 39 fields | ✅ | ✅ | ✅ | ✅ | 9 | `panelSnippet.test.ts` |
| ☐ | [Collapsible Help Text](collapsible-help-text/CollapsibleHelpTextPage.tsx) | `collapsible-help-text` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Collapsible Panel](collapsible-panel/CollapsiblePanelPage.tsx) | `collapsible-panel` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Accordion](accordion/AccordionPage.tsx) | `accordion` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [App Divider](app-divider/AppDividerPage.tsx) | `app-divider` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Code Block](code-block/CodeBlockPage.tsx) | `code-block` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Content Actions](content-actions/ContentActionsPage.tsx) | `content-actions` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Header Group](header-group/HeaderGroupPage.tsx) | `header-group` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Panel Hero](panel-hero/PanelHeroPage.tsx) | `panel-hero` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Toolbar](toolbar/ToolbarPage.tsx) | `toolbar` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Page Header](page-header/PageHeaderPage.tsx) | `page-header` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Scroll Area](scroll-area/ScrollAreaPage.tsx) | `scroll-area` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Paged Panel](paged-panel/PagedPanelPage.tsx) | `paged-panel` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 2 | — |
| ☐ | [Tag Panel](tag-panel/TagPanelPage.tsx) | `tag-panel` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 1 | — |
| ☐ | [Smart Grid Layout](smart-grid-layout/SmartGridLayoutPage.tsx) | `smart-grid-layout` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Side Panel](side-panel/SidePanelPage.tsx) | `side-panel` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Split View](split-view/SplitViewPage.tsx) | `split-view` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Info Row](info-row/InfoRowPage.tsx) | `info-row` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 7 | — |

### Basics — 0/12 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Button](button/ButtonPage.tsx) | `button` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Toggle](toggle/TogglePage.tsx) | `toggle` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Checkbox](checkbox/CheckboxPage.tsx) | `checkbox` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Custom Icon](custom-icon/CustomIconPage.tsx) | `custom-icon` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Icon Registry](icons/IconsPage.tsx) | `icons` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Dynamic Image](dynamic-img/DynamicImgPage.tsx) | `dynamic-img` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Pill](pill/PillPage.tsx) | `pill` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Dropdown Button](dropdown-button/DropdownButtonPage.tsx) | `dropdown-button` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Icon Button](icon-button/IconButtonPage.tsx) | `icon-button` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Expandable Button](expandable-button/ExpandableButtonPage.tsx) | `expandable-button` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 7 | — |
| ☐ | [Tabs](tabs/TabsPage.tsx) | `tabs` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [User Avatar](user-avatar/UserAvatarPage.tsx) | `user-avatar` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |

### Forms — 0/27 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Identity Picker](identity-picker/IdentityPickerPage.tsx) | `identity-picker` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [File Upload](file-upload/FileUploadPage.tsx) | `file-upload` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Input](input/InputPage.tsx) | `input` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 9 | — |
| ☐ | [Slug Input](slug-input/SlugInputPage.tsx) | `slug-input` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Filter Bar](filter-bar/FilterBarPage.tsx) | `filter-bar` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Search Bar](searchbar/SearchBarPage.tsx) | `searchbar` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 7 | — |
| ☐ | [Textarea](textarea/TextareaPage.tsx) | `textarea` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Form](form/FormPage.tsx) | `form` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [FieldRow](field-row/FieldRowPage.tsx) | `field-row` | 🟡 panel | — | ✅ | ✅ | ⬜ | ⬜ | 3 | — |
| ☐ | [Date Picker](datepicker/DatePickerPage.tsx) | `datepicker` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 8 | — |
| ☐ | [Key/Value Array](key-value-array-field/KeyValueArrayFieldPage.tsx) | `key-value-array-field` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Smart Input](smart-input/SmartInputPage.tsx) | `smart-input` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Multi Select Pills](multi-select-pills/MultiSelectPillsPage.tsx) | `multi-select-pills` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Multi Select Panel](multi-select-panel/MultiSelectPanelPage.tsx) | `multi-select-panel` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Input OTP](input-otp/InputOtpPage.tsx) | `input-otp` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 9 | — |
| ☐ | [Rating](rating/RatingPage.tsx) | `rating` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 10 | — |
| ☐ | [Slider](slider/SliderPage.tsx) | `slider` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 10 | — |
| ☐ | [Select](select/SelectPage.tsx) | `select` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |
| ☐ | [Input Group](input-group/InputGroupPage.tsx) | `input-group` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Password Input](password-input/PasswordInputPage.tsx) | `password-input` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Multi Toggle](multi-toggle/MultiTogglePage.tsx) | `multi-toggle` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Icon Toggle Group](icon-toggle-group/IconToggleGroupPage.tsx) | `icon-toggle-group` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Picker](picker/PickerPage.tsx) | `picker` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |
| ☐ | [Tag Picker](tag-picker/TagPickerPage.tsx) | `tag-picker` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 4 | — |
| ☐ | [Variable Picker](variable-picker/VariablePickerPage.tsx) | `variable-picker` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 0 | — |
| ☐ | [Dynamic Form Field](dynamic-form-field/DynamicFormFieldPage.tsx) | `dynamic-form-field` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Combobox](combobox/ComboboxPage.tsx) | `combobox` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 5 | — |

### Data — 1/31 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Agent Map](agent-map/AgentMapPage.tsx) | `agent-map` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Knowledge Explorer](knowledge-explorer/KnowledgeExplorerPage.tsx) | `knowledge-explorer` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Table](table/TablePage.tsx) | `table` | 🟡 panel | — | ✅ | ✅ | ✅ | ⬜ | 3 | — |
| ☐ | [Access Matrix](access-matrix/AccessMatrixPage.tsx) | `access-matrix` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Tree](tree/TreePage.tsx) | `tree` | 🟡 panel | — | ⬜ | ⬜ | ✅ | ⬜ | 8 | — |
| ☐ | [Organization Chart](org-chart/OrgChartPage.tsx) | `organization-chart` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 7 | — |
| ☐ | [Timeline Panel](timeline-panel/TimelinePanelPage.tsx) | `timeline-panel` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Terminal](terminal/TerminalPage.tsx) | `terminal` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Workflow Tracker](workflow-tracker/WorkflowTrackerPage.tsx) | `workflow-tracker` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 8 | — |
| ☐ | [Gantt Chart](gantt/GanttPage.tsx) | `gantt` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 6 | — |
| ☐ | [Task Board](task-board/TaskBoardPage.tsx) | `task-board` | 🟡 panel | — | ✅ | ✅ | ⬜ | ✅ | 9 | — |
| ☐ | [Color Swatches](color-swatches/ColorSwatchesPage.tsx) | `color-swatches` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Custom Color Swatches](custom-color-swatches/CustomColorSwatchesPage.tsx) | `custom-color-swatches` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 5 | — |
| ✅ | [Avatar Group](avatar-group/AvatarGroupPage.tsx) | `avatar-group` | 🟢 engine | 9 fields | ✅ | ✅ | ✅ | ✅ | 6 | `avatarGroupSnippet.test.ts` |
| ☐ | [Breakdown Card](breakdown-card/BreakdownCardPage.tsx) | `breakdown-card` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 2 | — |
| ☐ | [Chat](chat/ChatPage.tsx) | `chat` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Activity Feed](activity-feed/ActivityFeedPage.tsx) | `activity-feed` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Infinite Scroll Panel](infinite-scroll-panel/InfiniteScrollPanelPage.tsx) | `infinite-scroll-panel` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Detail Item Card](detail-item-card/DetailItemCardPage.tsx) | `detail-item-card` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Carousel](carousel/CarouselPage.tsx) | `carousel` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 7 | — |
| ☐ | [Stack Carousel](stack-carousel/StackCarouselPage.tsx) | `stack-carousel` | 🟡 panel | — | ✅ | ⬜ | ✅ | ✅ | 1 | — |
| ☐ | [Trace Graph](trace-graph/TraceGraphPage.tsx) | `trace-graph` | 🟡 panel | — | ✅ | ⬜ | ✅ | ✅ | 2 | — |
| ☐ | [Stat Card](stat-card/StatCardPage.tsx) | `stat-card` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 12 | — |
| ☐ | [Diagram Flow](diagram-flow/DiagramFlowPage.tsx) | `diagram-flow` | 🟠 inline | — | ✅ | ✅ | ✅ | ✅ | 2 | — |
| ☐ | [Connection Flow](connection-flow/ConnectionFlowPage.tsx) | `connection-flow` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 16 | — |
| ☐ | [Metric Bar](metric-bar/MetricBarPage.tsx) | `metric-bar` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 2 | — |
| ☐ | [Multi Progress Bar](multi-progress-bar/MultiProgressBarPage.tsx) | `multi-progress-bar` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 5 | — |
| ☐ | [Truncated Text](truncated-text/TruncatedTextPage.tsx) | `truncated-text` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Stat Tiles](stat-tile/StatTilePage.tsx) | `stat-tile` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Smart Value](smart-value/SmartValuePage.tsx) | `smart-value` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Network Graph](network-graph/NetworkGraphPage.tsx) | `network-graph` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 6 | — |

### Charts — 0/18 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Charts](charts/ChartsPage.tsx) | `charts` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Line](charts/LineChartPage.tsx) | `charts-line` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Bar](charts/BarChartPage.tsx) | `charts-bar` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Pie & Donut](charts/PieChartPage.tsx) | `charts-pie` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Candlestick](charts/CandlestickChartPage.tsx) | `charts-candlestick` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Range Area](charts/RangeAreaChartPage.tsx) | `charts-range-area` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Radar](charts/RadarChartPage.tsx) | `charts-radar` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Polar](charts/PolarChartPage.tsx) | `charts-polar` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Gauge](charts/GaugeChartPage.tsx) | `charts-gauge` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Nightingale](charts/NightingaleChartPage.tsx) | `charts-nightingale` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Combo](charts/ComboChartPage.tsx) | `charts-combo` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Synced charts](charts/SyncedChartPage.tsx) | `charts-synced` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Treemap](charts/TreemapChartPage.tsx) | `charts-treemap` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Funnel](charts/FunnelChartPage.tsx) | `charts-funnel` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Heatmap](charts/HeatmapChartPage.tsx) | `charts-heatmap` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Waterfall](charts/WaterfallChartPage.tsx) | `charts-waterfall` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Scatter & Bubble](charts/ScatterChartPage.tsx) | `charts-scatter` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |
| ☐ | [Reference & Callouts](charts/AnnotationsChartPage.tsx) | `charts-annotations` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 42 | — |

### Feedback — 1/20 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [AI Robot](ai-robot/AiRobotPage.tsx) | `ai-robot` | 🟡 panel | — | ✅ | ✅ | ⬜ | ⬜ | 1 | — |
| ☐ | [AI Orb](ai-orb/AiOrbPage.tsx) | `ai-orb` | 🟡 panel | — | ✅ | ✅ | ✅ | ✅ | 3 | — |
| ☐ | [Action Panel](action-panel/ActionPanelPage.tsx) | `action-panel` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Alert](alert/AlertPage.tsx) | `alert` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 5 | — |
| ☐ | [Badge](badge/BadgePage.tsx) | `badge` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 8 | — |
| ☐ | [Badge Icon](badge-icon/BadgeIconPage.tsx) | `badge-icon` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 5 | — |
| ☐ | [ECG Monitor](ecg-monitor/EcgMonitorPage.tsx) | `ecg-monitor` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [API Error State](api-error-state/ApiErrorStatePage.tsx) | `api-error-state` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Empty State](empty-state/EmptyStatePage.tsx) | `empty-state` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Progress](progress/ProgressPage.tsx) | `progress` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Spinner](spinner/SpinnerPage.tsx) | `spinner` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Status Spinner](status-spinner/StatusSpinnerPage.tsx) | `status-spinner` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [LED](led/LedPage.tsx) | `led` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Progress Spinner](progress-spinner/ProgressSpinnerPage.tsx) | `progress-spinner` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 6 | — |
| ☐ | [Loader](loader/LoaderPage.tsx) | `loader` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Shimmer](shimmer/ShimmerPage.tsx) | `shimmer` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Stepper](stepper/StepperPage.tsx) | `stepper` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Dot Stepper](dot-stepper/DotStepperPage.tsx) | `dot-stepper` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [CondensedStepper](condensed-stepper/CondensedStepperPage.tsx) | `condensed-stepper` | 🟡 panel | — | ✅ | ✅ | ✅ | ⬜ | 2 | — |
| ✅ | [Toast](toast/ToastPage.tsx) | `toast` | 🟢 engine | 17 fields · ⚠ 2 default | ✅ | ✅ | ✅ | ✅ | 8 | `ToastPlayground.test.tsx` `toastSnippet.test.ts` |

### Overlays — 0/8 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Menu](menu/MenuPage.tsx) | `menu` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Menu Button](menu-button/MenuButtonPage.tsx) | `menu-button` | 🟡 panel | — | ✅ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [Notification Modal](notification-modal/NotificationModalPage.tsx) | `notification-modal` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 1 | — |
| ☐ | [Modal](modal/ModalPage.tsx) | `modal` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 6 | — |
| ☐ | [Tooltip](tooltip/TooltipPage.tsx) | `tooltip` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 6 | — |
| ☐ | [Dropdown Menu](dropdown-menu/DropdownMenuPage.tsx) | `dropdown-menu` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 3 | — |
| ☐ | [Help Button](help-button/HelpButtonPage.tsx) | `help-button` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 4 | — |
| ☐ | [Popover](popover/PopoverPage.tsx) | `popover` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 9 | — |

### Utilities — 0/3 done

|  | Page | Slug | Playground | Fields | API | SR | Kbd | i18n | Ex | Tests |
|:--:|---|---|---|---|:--:|:--:|:--:|:--:|:--:|---|
| ☐ | [Utilities](utilities/UtilitiesPage.tsx) | `utilities` | 🔴 none | — | ⬜ | ⬜ | ⬜ | ⬜ | 0 | — |
| ☐ | [I18n](i18n/I18nPage.tsx) | `i18n` | 🟡 panel | — | ⬜ | ⬜ | ⬜ | ⬜ | 7 | — |
| ☐ | [A11y](a11y/A11yPage.tsx) | `a11y` | 🔴 none | — | ⬜ | ✅ | ✅ | ⬜ | 0 | — |
<!-- END GENERATED TABLE -->

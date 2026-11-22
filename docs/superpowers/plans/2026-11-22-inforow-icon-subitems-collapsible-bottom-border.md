# InfoRow: icon, sub-items, collapsible body, bottom border — implementation plan

**Goal:** Ship the approved spec (`docs/superpowers/specs/2026-11-22-inforow-icon-subitems-collapsible-bottom-border-design.md`): leading `icon` + `iconClassName`, stacked `subItems` (text/value pairs, `mono`), an opt-in collapsible `body` animated with the CollapsiblePanel grid-rows technique, and a `bottomBorder` opt-in that only takes effect on the `simple`/`none` variants — in both the React and Vue kits, with tests and React docs coverage.

**Architecture:** The row root becomes a `flex flex-col` block that keeps every existing class (plain-is-root invariant, `group`/`group/inforow` scope, `last:border-0` hairline, copy wash, padding). Inside it: a **main line** (icon span + label + value/copy cluster + chevron — the row's old horizontal layout, and the toggle target only when collapsible), a **sub-items** column, and a **body region** (grid `0fr→1fr`, `min-h-0 overflow-hidden`, `role="region"` + `inert` when collapsed — never `hidden`). Vue mirrors this through the existing `InfoRow` → `internal/InfoRowContent` view-object seam: all classes/aria resolve in `InfoRow.vue`, `InfoRowContent.vue` only binds. Vue adds `v-model:expanded` + `toggle` emit and `#body` / `#sub-item` slots; React uses a `body` prop (children is in the spread attrs). No new i18n strings.

**Ground rules:**

- Never break: `group`/`group/inforow` scoping, plain-is-root, `last:border-0`, the copy reveal, truncation measurement, `hideIfEmpty` semantics (extended, not replaced).
- Sub-items and body never toggle the row; only the main line does, and only when collapsible. The value/copy cluster stops click+keydown propagation while collapsible.
- Collapsed body is `inert` (React: spread cast for React 18 types), not `hidden`; transitions opt out under `motion-reduce`.
- Keyboard toggle is target-guarded (`event.target === event.currentTarget`) so activation from the copy button never toggles.
- Only commit files this plan touches, by explicit pathspec — the working tree has unrelated uncommitted icon work.

---

## Task 1 — React component (`react/src/components/InfoRow.tsx`)

- [x] `sizeTokens`: add `iconIndent` per size — `xs: "pl-6"`, `sm: "pl-6"`, `md: "pl-8"`, `lg: "pl-9"`, `xl: "pl-10"` (icon box + `gap-2`/`gap-3` ⇒ title edge).
- [x] Export `interface InfoRowSubItem { text?: React.ReactNode; value?: React.ReactNode; mono?: boolean; className?: string }`.
- [x] `InfoRowProps`: add `icon?: IconName | React.ReactElement`, `iconClassName?: string`, `subItems?: InfoRowSubItem[]`, `collapsible?: boolean`, `defaultExpanded?: boolean`, `expanded?: boolean`, `onToggle?: (expanded: boolean) => void`, `body?: React.ReactNode`, `bottomBorder?: boolean`. Add `"onToggle"` to the `Omit` union (it collides with React's DOM toggle handler). Import `type IconName` from `"../types"`.
- [x] `InfoRow` wrapper: destructure every new prop into the `_*` strip list so none lands on the DOM div or the `Panel`; extend the `hideIfEmpty` early-return exemptions with `!(subItems?.length) && body === undefined && !collapsible`.
- [x] `InfoRowBody`: destructure the new props (plus `variant`, `tone` raw). State: `const [internalExpanded, setInternalExpanded] = useState(defaultExpanded ?? false)`; `isControlled = typeof expanded === "boolean"`; `isCollapsible = collapsible ?? body !== undefined`; ids from `useId()` (import it). `handleToggle` mirrors CollapsiblePanel (skip internal set when controlled, always call `onToggle`); `handleHeaderKeyDown` target-guarded, Enter/Space `preventDefault` + toggle.
- [x] Icon: `renderIcon` from `useIconRenderer()`; `aria-hidden` `shrink-0` span; class = `classNames(!hasTextColor(iconClassName) && (tone === "none" ? text.muted : `text-${rowTone}-500 dark:text-${rowTone}-400`), iconClassName)` (tone-accent shapes are already safelisted via the loader precedent).
- [x] Root: `flex items-center` → `flex flex-col` (drop the row gap here); a computed `sectionEdge = bottomBorder && !noBorder && (variant === "simple" || variant === "none")` swaps the hairline: while on, the hairline renders **without** its `last:border-0` (that `:last-child` rule outranks the plain class and would kill the requested edge on the final row), and the edge itself is `border-b ${text.divider}` with no `last:` rule — every row that asks gets one, including the last.
- [x] Main line div: `"flex min-w-0 items-center rounded-[inherit] text-left"`, `tokens.gap`; when collapsible add `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-controls`, `onClick`, `onKeyDown`, and `"cursor-pointer"` + `trigger.hover` + `trigger.focusRing` (same tokens CollapsiblePanel's header uses). Children: icon span, the **existing** label span and value/copy cluster verbatim, then the chevron span (`flex shrink-0 items-center transition-transform duration-300` + `text.muted` + `rotate-0`/`rotate-180`, `renderIcon("ArrowDown", tokens.iconSize)`) when collapsible. Value cluster gets click/keydown `stopPropagation` only when collapsible.
- [x] Sub-items column after the main line: `flex flex-col` + `icon && tokens.iconIndent`; each line `flex items-baseline gap-1.5 wrap-break-word` + `item.className`; muted `tokens.text` text span, `font-medium` body-ink value span (+ `font-mono` when `mono`); booleans localise to `t("kit.inforow.yes"/"no")`; lines with neither text nor value are skipped.
- [x] Body region after sub-items, whenever `body !== undefined` — driven by `bodyOpen = isCollapsible ? isExpanded : true` so a `collapsible={false}` row still renders its body, always-open, just without the toggle affordance: grid wrapper `"grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none"` + `opacity-0/100` + inline `gridTemplateRows` `0fr/1fr`; inner `"min-h-0 overflow-hidden"` with `id`, `role="region"`, `aria-labelledby`, `aria-hidden` and the `{...(bodyOpen ? {} : ({ inert: true } as Record<string, unknown>))}` spread — copied from `CollapsiblePanel.tsx` lines 190–232; content div `"w-full"` + `tokens.text` + `text.body` + `icon && tokens.iconIndent` (no extra padding — the row's own padding aligns it).
- [x] `npx tsc --noEmit -p .` in `react/` (or `npm run lint`) stays clean for this file.

## Task 2 — React tests (`react/src/components/InfoRow.test.tsx`)

- [x] Icon: renders (svg present), tone tint (`text-emerald-500` when `tone="emerald"`, no manual color needed), `text.muted` when `tone="none"`, `iconClassName` text color replaces the tone tint (`hasTextColor` path), element icon passthrough, `aria-hidden`.
- [x] Sub-items: text+value render, `font-mono` only when `mono`, indent class present with icon and absent without, boolean value localised, empty rows skipped, row survives `hideIfEmpty` with no main `value` when `subItems` non-empty.
- [x] Collapsible: no toggle affordance by default; with `body`: main line has `role=button`/`aria-expanded=false`/`aria-controls`, chevron present (`rotate-0`); click toggles + `onToggle(true)` + `inert` gone + `rotate-180`; Space/Enter on the main line toggle; Enter from the copy button does **not** toggle (stopPropagation + target guard); collapsed region `inert` + `aria-hidden`, never `hidden`; grid classes (`transition-[grid-template-rows,opacity]`, `motion-reduce:transition-none`) present; controlled `expanded` prop wins and `defaultExpanded` starts open; row survives `hideIfEmpty` with only `body`.
- [x] Bottom border matrix: `none`/`simple` + `bottomBorder` → `border-b`; other variants ignored; `plain` untouched (`last:border-0` intact); no border by default.
- [x] `TMPDIR=$PWD/.tmp npx vitest run src/components/InfoRow.test.tsx` green (every existing expectation still passes).

## Task 3 — Vue component (`vue/src/components/InfoRow.vue` + `internal/InfoRowContent.vue`)

- [x] `InfoRow.vue`: export `interface InfoRowSubItem { text?: string | number; value?: string | number | boolean | null; mono?: boolean; className?: string }`; add props `icon?: IconName | VNode`, `iconClassName?`, `subItems?`, `collapsible?`, `defaultExpanded?`, `expanded?`, `bottomBorder?` (defaults via `withDefaults`; `expanded` is the `v-model:expanded` prop); emits `toggle: [expanded: boolean]` + `update:expanded: [expanded: boolean]`. State: `internalExpanded` + `isControlled` + `isExpanded` mirroring `CollapsiblePanel.vue`; `headerId`/`contentId` from `useId()` (Vue 3.5, precedent: `InlinePanel.vue`).
- [x] Resolve everything class-shaped in `InfoRow.vue` into the `InfoRowView`: `mainLineClass` (+collapsible cursor/hover/focus tokens), `headerAria` (`{role, tabindex, "aria-expanded", "aria-controls"}` or `{}`), `iconNode: VNode | null` (`renderIcon(props.icon, tokens.iconSize, classNames(!hasTextColor(iconClassName) && (tone === "none" ? text.muted : `text-${tone}-500 dark:text-${tone}-400`), iconClassName))`), `chevronClass`, `subItems` (normalised: boolean→Yes/No via existing `normaliseValue`, per-line `lineClass`/`textClass`/`valueClass`, empty lines filtered out) + `subItemsClass` (`flex flex-col` + `icon && iconIndent`), `collapsible`, `hasBody` (`slots.body !== undefined`), `bodyClass`/`bodyStyle`/`bodyRegionAttrs`/`bodyContentClass` per spec, `headerId`/`contentId`.
- [x] `sizeTokens`: same `iconIndent` map; `rowClass`: `flex items-center` → `flex flex-col`, append the `bottomBorder && (variant === "simple" || variant === "none")` hairline; keep `isPlain && classAttr` on the row root.
- [x] `InfoRowContent.vue`: extend `InfoRowView` type; root keeps `:class="view.rowClass"` + `aria-busy`; add main-line div `v-bind="view.headerAria"` + `v-on="view.collapsible ? headerHandlers : {}"` (`headerHandlers` = click→`emit("toggle")`, keydown target-guarded Enter/Space); icon span `<VNodeRenderer :nodes="view.iconNode" />` (`aria-hidden`, `shrink-0`); value cluster `v-on="view.collapsible ? { click: stop, keydown: stop } : {}"`; chevron span when `view.collapsible`; sub-items `v-for` with `#sub-item` scoped-slot escape (`:item`, `:index`); body region when `view.collapsible && view.hasBody` rendering `<slot name="body" />` inside the grid/region/content divs bound from view. `defineEmits` gains `toggle`.
- [x] `InfoRow.vue` template: pass `#body` and `#sub-item` through to `InfoRowContent` on **both** the plain-root and Panel branches, guarded by `$slots`.
- [x] `npm run lint` (vue-tsc) clean.

## Task 4 — Vue tests (`vue/src/components/InfoRow.test.ts` — new)

- [x] `@vue/test-utils` mount harness mirroring other Vue component tests in the repo; cover the same matrix as Task 2 plus Vue specifics: `v-model:expanded` two-way (`update:expanded` emitted, prop drives), `#body` slot renders inside region, `#sub-item` slot overrides default pair markup, non-collapsible row has no click handler semantics (main line lacks `role=button`).
- [x] `TMPDIR=$PWD/.tmp npx vitest run src/components/InfoRow.test.ts` green.

## Task 5 — Exports (`react/src/components/index.ts`, `vue/src/components/index.ts`)

- [x] Re-export `type InfoRowSubItem` alongside `InfoRowProps` in both barrels.

## Task 6 — React docs (`react/demo/src/kit-docs/components/info-row/`)

- [x] `examples/SubItems.tsx` — screenshot 1: `icon="Check"`, `tone="emerald"`, no main `value`, sub-item `Policy: …` with `mono` value, `plain` rows.
- [x] `examples/Collapsible.tsx` — screenshot 2: "Blueprint, secret, workspace and scope are ready" row with `icon`, chevron, `#` bullet-list `body` (`defaultExpanded`).
- [x] `examples/BottomBorder.tsx` — screenshot 3: `variant="none"` key/value rows with `bottomBorder`, copyable token row.
- [x] `InfoRowPage.tsx`: import the three examples + `?raw` sources, add ExampleCards (title/description/preview, matching existing card style).
- [x] `InfoRowPlayground.tsx`: `icon` select, `iconClassName`-less tone demo, sub-items toggle, `collapsible` + `defaultExpanded` toggles, `bottomBorder` toggle **disabled unless variant is `simple`/`none`**.
- [x] `PropsTable.tsx`: rows for the nine new props (type/default/description; `values` for enums where relevant).
- [x] A11y notes: collapsible region (button header, `aria-controls`, `inert` collapsed, target-guarded keyboard, copy button never toggles), icon `aria-hidden`, bottom border as section separator.

## Task 7 — Verification

- [x] React: `cd react && TMPDIR=$PWD/.tmp npx vitest run` (full suite) — only pre-existing failures, if any, reported separately.
- [x] Vue: `cd vue && TMPDIR=$PWD/.tmp npx vitest run` (full suite).
- [x] `react: npm run lint`; `vue: npm run lint`.
- [x] Builds: `cd react && npm run build`; `cd vue && npm run build` (types + css included). Demo: `cd react/demo && npm run build` (or repo `make build-demo-react`).
- [x] Commit per task with explicit pathspecs (`git commit -m "feat(react): …" -- react/src/...`), keeping the unrelated icon work uncommitted.

## Deliverable checklist

- [x] Spec + plan committed.
- [x] React + Vue components, both test files green.
- [x] Barrels export `InfoRowSubItem`.
- [x] Docs pages render the three screenshot scenarios.
- [x] Full suites + lints + builds pass (pre-existing issues called out, not fixed here).
- [x] Learnings.md entry if a non-obvious trap surfaced (per repo convention).

# ActivityFeed: sub-items with a collapsible disclosure — implementation plan

**Goal:** Ship the approved spec (`docs/superpowers/specs/2026-11-24-activityfeed-subitems-collapsible-design.md`): `subItems` on `ActivityFeedItem` (standard feed sub-rows or custom `body` nodes, one level), a hybrid disclosure toggle (row-is-the-toggle when the item has no `onClick`; chevron `<button>` only when it does), the InfoRow grid-rows animation (`0fr→1fr` + opacity, 300ms `ease-in-out`, `motion-reduce`, `inert` while collapsed), per-item controlled/uncontrolled state (`defaultExpanded`/`expanded`/`onToggle`, Vue `@toggle(id, expanded)`) — in both kits, with tests, i18n and React docs coverage.

**Architecture:** React gains a module-level `FeedRow` component inside `ActivityFeed.tsx` (owns `useId` + toggle wiring; rows without `subItems` render today's exact tree) and a shared row-content renderer used by both the main row and standard sub-rows. Uncontrolled open state is a `Record<item.id, boolean>` in `ActivityFeed`. The toggle rides the row `Panel`'s card action (cursor/wash/ring/keys/guard for free); the chevron-button mode stopPropagation's its own click; the region wrapper stops click/keydown **only while the row is the toggle**. Vue mirrors through a new `internal/ActivityFeedRow.vue` (view-object seam, like `InfoRowContent.vue`) — the Vue Panel has no descendant guard, so the region stop is load-bearing there. New i18n namespace `kit.activityfeed` (chevron button labels only).

**Ground rules:**

- Never break: existing rows render byte-identically without `subItems` (no chevron, no region, no new tab stops); skeleton/empty/loading, infinite scroll, `rowVariant` dividers-vs-gap, `active`/`attention` untouched.
- The gesture is InfoRow's markup class-for-class; never `hidden`; collapsed region `inert` (+ React-18 spread cast) and `aria-hidden`.
- Sub-items never filter, never carry `onClick`/`active`/`attention`; the header count stays top-level-only.
- Region content never folds the row (React: Panel guard + region stop; Vue: region stop is the whole story).
- Only commit files this plan touches, by explicit pathspec — the working tree has unrelated uncommitted icon work.

---

## Task 1 — i18n (`common/i18n/builtIn/{en,de,es,fr,pt}.ts`)

- [ ] Add `activityfeed: { showSubitems, hideSubitems }` to the `kit` block of every locale (before `codeBlock` in en; consistent position in the others). en: "Show sub-items" / "Hide sub-items"; fr: « Afficher les sous-éléments » / « Masquer les sous-éléments »; es: "Mostrar subelementos" / "Ocultar subelementos"; de: "Unterpunkte anzeigen" / "Unterpunkte ausblenden"; pt: "Mostrar subitens" / "Ocultar subitens".
- [ ] en.ts header comment: add the `activityfeed ActivityFeed.tsx/.vue (chevron toggle aria)` line to the source-components list.
- [ ] `catalog-consistency` / `catalog` tests green (`npx vitest run src/i18n` from `react/`, or the common suite runner).

## Task 2 — React component (`react/src/components/ActivityFeed.tsx`)

- [ ] Export `interface ActivityFeedSubItem { title?, description?, code?, actor?, timestamp?, tone?, count?, body?: ReactNode }` (doc'd like `ActivityFeedItem`; one level, read-only).
- [ ] `ActivityFeedItem` gains `subItems?: ActivityFeedSubItem[]`, `defaultExpanded?: boolean`, `expanded?: boolean`, `onToggle?: (expanded: boolean) => void` — documented per spec.
- [ ] Extract the standard row template to a module-level `rowContent(entry, dotClass)` returning today's JSX (dot span, actor/title, `×count` Pill, description, code chip, `<time>` only when `timestamp`); main rows keep `rowVariant`-independent behavior; sub-rows call the same function with their dot ladder `sub.tone ?? item.tone ?? card ladder`.
- [ ] `FeedRow` (module-level component): props `{ item, rowVariant, rowTone, rowCorner, cardAccent, open, onToggle }`; `useId` → `headerId`/`contentId`; `useIconRenderer` for `ArrowDown` at `sm`; `hasSubs = !!item.subItems?.length`; `rowIsToggle = hasSubs && !item.onClick`.
  - Row `Panel`: `onClick={item.onClick ?? (hasSubs ? onToggle : undefined)}`, plus `{...(rowIsToggle ? { "aria-expanded": open, "aria-controls": contentId } : {})}`.
  - Main line div gains `id={headerId}`; chevron after `rowBody`: span (`aria-hidden`, muted, `rotate-0/180`, `transition-transform duration-300`) when `rowIsToggle`, or `<button type="button">` (aria-label from `kit.activityfeed.*`, `aria-expanded`, `aria-controls`, `onClick` stopPropagation + `onToggle`, `rounded-sm` + `getSurfaceTriggerTokens(cardAccent).focusRing`) when `hasSubs && item.onClick`.
  - Region (when `hasSubs`): grid wrapper (InfoRow classes verbatim + `cursor-auto` + inline `gridTemplateRows`) with click/keydown stopPropagation **only while `rowIsToggle`**; `role="region"` inner (`min-h-0 overflow-hidden`, `aria-labelledby`, `aria-hidden` + inert cast when closed); column `pl-5 flex flex-col gap-1.5`; each sub-item wrapped in `flex items-start gap-3` rendering `sub.body` (VNode as-is) or `rowContent(sub, dotClass(sub))`.
- [ ] `ActivityFeed`: `const [openMap, setOpenMap] = useState<Record<string, boolean>>({})`; per visible item compute `open` (controlled `item.expanded` wins; else `openMap[id] ?? defaultExpanded ?? false`) and the toggle (`setOpenMap` when uncontrolled, always `item.onToggle?.(!open)`); replace the inline `<li>` body with `<FeedRow>`.
- [ ] `react/src/components/index.ts`: add `type ActivityFeedSubItem` to the ActivityFeed re-export block.
- [ ] `npx tsc --noEmit` + lint clean for the file.

## Task 3 — React tests (`react/src/components/ActivityFeed.test.tsx`)

- [ ] Sub-row rendering: fields, `×count` pill, `<time>` only with `timestamp`, dot ladder sub→parent→card, custom `body` sub suppresses fields, region/column indent `pl-5`.
- [ ] Presence: no chevron/region without `subItems`; empty array behaves like absent.
- [ ] Row-is-the-toggle: row Panel carries `aria-expanded`/`aria-controls`; click + Enter/Space toggle; `onToggle` called; sub-content click does not fold (stopPropagation); collapsed region `inert` + `aria-hidden` + grid classes, never `hidden`; chevron `rotate-180` when open.
- [ ] Chevron-button mode (`onClick` present): row click → `onClick` only; chevron button toggles with localized `aria-label`, no `onClick` fired.
- [ ] State: `defaultExpanded` open at mount; controlled `expanded` wins and only calls `onToggle`; open state survives a filter switch; filtered-out parent hides sub-rows.
- [ ] `TMPDIR=$PWD/.tmp npx vitest run src/components/ActivityFeed.test.tsx` green (all existing expectations intact).

## Task 4 — Vue component (`vue/src/components/ActivityFeed.vue` + `internal/ActivityFeedRow.vue`)

- [ ] Types: `ActivityFeedSubItem` (VNodeChild `body`), item gains `subItems`/`defaultExpanded`/`expanded`; new emit `(event: "toggle", id: string, expanded: boolean)`.
- [ ] Parent script: `openMap` ref keyed by id (controlled via `item.expanded`), `toggleItem(item)`, per-item view builders (dot classes, chevron mode/classes/label, sub-row views incl. `hasBody`), ids via `useId()`.
- [ ] `internal/ActivityFeedRow.vue`: view-object props mirroring `InfoRowContent.vue`'s style — row `Panel` binding (`variant/tone/corner/padding`, card-action `onClick`, `active/pulse/borderColor`, aria spread when row-is-toggle), main line (VNodeRenderer body or template, chevron span/button), grid region (attrs incl. `inert` when closed, handlers stopping click/keydown while row-is-toggle — load-bearing without a Panel guard), `pl-5` column, sub-rows via shared template renderer.
- [ ] `vue/src/components/index.ts`: export `type ActivityFeedSubItem`.
- [ ] `npx vue-tsc --noEmit` (or the kit's typecheck script) clean.

## Task 5 — Vue tests (`vue/src/components/ActivityFeed.test.ts`)

- [ ] Mirror Task 3 with `mount`: emits `toggle` with `[id, expanded]`; controlled `expanded`; region attrs (`inert`, `aria-hidden`, grid classes); chevron button mode (`aria-label`, row `onClick` untouched); sub-row fields + custom body VNode; parent filtering hides sub-rows.
- [ ] `npx vitest run src/components/ActivityFeed.test.ts` green.

## Task 6 — Docs (react demo)

- [ ] `examples/SubItems.tsx`: deploy event row with standard per-service sub-rows + one custom-body sub-row (incident idiom from `CustomRows.tsx`); wired into `ActivityFeedPage` as an `ExampleCard` with `?raw` code.
- [ ] `ActivityFeedPlayground`: **sub-items** toggle in Parts (two items gain sub-items — one all-standard, one with a custom-body sub) + nested **expanded** toggle driving the controlled `expanded`/`onToggle` path; footnote sentence for the disclosure.
- [ ] `ActivityFeedPage` API paragraph: item shape gains `subItems`/`defaultExpanded`/`expanded`/`onToggle`; hybrid toggle stated once; read-only sub-item contract.

## Task 7 — Final gate

- [ ] React: `npx vitest run src/components/ActivityFeed.test.tsx` + `src/i18n` suites; `tsc --noEmit`.
- [ ] Vue: ActivityFeed suite green; kit typecheck clean.
- [ ] Demo builds (`npm run build` in react/demo if cheap, else typecheck).
- [ ] Commit by explicit pathspecs: i18n 5 files, react component + barrel + test, vue SFCs + barrel + test, 3 demo files, Learnings.md entry if a new trap surfaced.

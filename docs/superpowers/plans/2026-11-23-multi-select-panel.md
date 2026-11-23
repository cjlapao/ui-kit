# MultiSelectPanel — implementation plan

**Goal:** Ship the approved spec ([docs/superpowers/specs/2026-11-23-multi-select-panel-design.md](../specs/2026-11-23-multi-select-panel-design.md)): a group of selectable cards built by composing the kit's `Panel` and `Checkbox` — uppercase group `label`, `columns`-wide grid with every card the same height, each card carrying checkbox → icon → title with pills hugging the title and a subtitle underneath, all optional but the title; multiple and single selection; React only.

**Architecture:** One file, `react/src/components/MultiSelectPanel.tsx`: a `fieldset` (+`legend`, `role="radiogroup"` in single mode) → a `grid` div → one `Card` per option. `Card` is a **`Panel` that owns the interaction** — `clickable`, caller `role` of `checkbox`/`radio` with `aria-checked`, `active={selected}` for the rim + tint, our `onClick`/`onKeyDown`/`tabIndex` — whose body is one **presentation `Checkbox`** that supplies the drawn box *and* the card's whole text column through its `label`/`description` slots, so card typography stays on Checkbox's `SIZE_STYLES` scale. The input carries `name`/`value`/`checked` for native submission and is otherwise inert (`tabIndex=-1`, `aria-hidden`, `pointer-events:none` on the input element itself, `onClick` preventDefault, no-op `onChange`). Group props are the defaults; option fields override. Surface vocabulary is `Pick`ed from `PanelProps`; `checkboxVariant` is the one Checkbox-side surface knob, and `tone` feeds box accent, selection rim and hover wash together.

**Ground rules:**

- Never break: `Checkbox` and `Panel` public behaviour, `MultiSelectPills`' rendered output, the `hasInteractiveDescendant` contract for *real* nested controls (a focusable control must still warn; `isClickOwnedByDescendant` is not touched).
- One click → exactly one `onChange`. The three events a click produces are enumerated in spec §3; only the label/section click toggles.
- Every colour comes from `theme/Theme` tokens (`getPanelToneStyles`, `getSurfaceActiveTokens`, `getSurfaceTextTokens`) — no hardcoded `text-neutral-*`/`bg-*` in the component outside the surfaces Panel already owns.
- No new arbitrary Tailwind classes that need safelisting: grid tracks go through inline `style`, gaps reuse `MultiSelectPills`' exported `GAP_CLASSES`.
- No new i18n strings — every visible string is caller-supplied.
- Only commit files this plan touches, by explicit pathspec — the working tree has unrelated uncommitted stat-tile/StatCard/Popover work. `.git` is read-only under the current sandbox, so commits need the user's approval; a rejected commit is not a task failure.

---

## Task 1 — Shared a11y: presentational controls don't warn (`common/a11y/interactive.ts`)

- [ ] RED first: new `react/src/a11y/interactive.test.ts` (beside `warn.test.ts`) — a visible focusable control inside a container reports `true`; an `aria-hidden="true"` + `tabindex="-1"` input reports `false`; either condition alone still reports `true`; `isClickOwnedByDescendant` unchanged for a real nested control and for `[data-panel-no-click]`.
- [ ] `hasInteractiveDescendant`: iterate `root.querySelectorAll(INTERACTIVE_SELECTOR)` instead of `querySelector`, `continue` past any match that has `tabindex="-1"` **and** `closest('[aria-hidden="true"]')` (which matches the element itself), return `true` on the first match that survives. Keep the `typeof root.querySelector !== "function"` guard. Comment why: a control AT cannot see and the keyboard cannot reach is decoration, not a competing control.
- [ ] `cd react && npx vitest run src/a11y` green; `npx vitest run src/components/Panel` still green (Panel is the function's only consumer repo-wide).

## Task 2 — Reuse the gap scale (`react/src/components/MultiSelectPills.tsx`)

- [ ] `const GAP_CLASSES` → `export const GAP_CLASSES` (one keyword, no behaviour change; it keys on the shared `ControlSize`).

## Task 3 — Component (`react/src/components/MultiSelectPanel.tsx`)

- [ ] Types exactly as spec §1: `MultiSelectPanelOption` (`value`, `title` required, `subtitle`, `icon`, `labels`, `disabled`, and the six overrides) and `MultiSelectPanelProps extends Pick<PanelProps, "variant"|"tone"|"padding"|"corner"|"transparency"|"hoverable"|"hoverShadow"|"decoration"|"pulse"|"borderColor"|"backgroundColor"|"glassOpacity"|"vibrancy"|"specularMode">`. Runtime defaults: `variant="elevated"`, `tone="blue"`, `padding="sm"`, `corner="rounded-sm"`, `columns=2`, `gap="md"`, `size="md"`, `checkboxVariant="flat"`, `labelVariant="outline"`, `selectionMode="multiple"`, `allowDeselect=true`.
- [ ] Selection state: `isControlled = value !== undefined`; uncontrolled `useState(defaultValue ?? [])` initialised **once** (never re-derived — `defaultValue` identity must not reset the group, the trap documented at [MultiSelectPills.tsx:127](../../react/src/components/MultiSelectPills.tsx#L127)); a `useRef` holding the latest array so a burst of clicks in one tick cannot drop a toggle.
- [ ] `toggle(value)`: multiple → add/remove; single → replace, or clear when `allowDeselect` and already selected; skip `disabled` options and a disabled group; always hand `onChange` the next array.
- [ ] `Card` (same file): `Panel` with `key`/`ref` (ref into `cardRefs.current[index]`), `clickable`, `role={selectionMode === "single" ? "radio" : "checkbox"}`, `aria-checked={selected}`, `aria-disabled` via Panel's `disabled`, `active={selected}`, `tabIndex={roving}`, `onClick={() => toggle(option.value)}`, `onKeyDown`, and the resolved surface props.
- [ ] Names are explicit: `aria-labelledby={`${cardId}-title`}` on the card (title span only — pills must not leak into the name), `aria-describedby={`${cardId}-subtitle`}` when there is a subtitle, `id={`${cardId}-input`}` passed to the Checkbox. `cardId` from `useId()` per card.
- [ ] Body = `<Checkbox fullWidth checked={selected} disabled={cardDisabled} tone size variant={checkboxVariant} descriptionPlacement="bottom" label={<TitleRow/>} description={option.subtitle} …presentation />`, where presentation props go on the **input** through Checkbox's input spread: `tabIndex={-1}`, `aria-hidden="true"`, `style={{ pointerEvents: "none" }}`, `onClick={(e) => e.preventDefault()}`, `onChange={() => {}}`, plus `name` (`${name}[]` / `name`) and `value={option.value}`.
- [ ] `TitleRow`: flex row, `min-w-0` — `renderIcon(option.icon, iconSize)` in an `aria-hidden` `shrink-0` span → `<span id={`${cardId}-title`}>` → pill cluster (`flex flex-wrap gap-1`, one `Pill size="sm"` per `labels` entry, `tone={labelTone ?? cardTone}`, `variant={labelVariant}`). Missing icon / missing subtitle / missing labels render nothing, and the row stays aligned (no reserved gutters).
- [ ] Grid: `style={{ display: "grid", gridTemplateColumns: `repeat(${clamped}, minmax(0, 1fr))`, gridAutoRows: "1fr" }}` + `classNames(GAP_CLASSES[gap], className)`; clamp `columns` to 1–6; `fieldset` carries `disabled` for the group, `role="radiogroup"` + `aria-labelledby`/`aria-describedby` when `label`/`description` exist.
- [ ] Keyboard: one `onKeyDown` shared by the cards, target-guarded (`event.target === event.currentTarget`). `Enter`/`Space` → `preventDefault()` + `toggle`; single mode additionally handles `ArrowUp/Down/Left/Right/Home/End` → move focus to the next/first/last enabled card via `cardRefs` and select it (wraps). Multiple mode: arrows do nothing (each card is its own tab stop).

## Task 4 — Tests (`react/src/components/MultiSelectPanel.test.tsx`)

Mirror the spec §8 matrix; every assertion from the rendered DOM, following the `data-`-free conventions of [Checkbox.test.tsx](../../react/src/components/Checkbox.test.tsx):

- [ ] toggle on/off; `onChange` receives the full next array; **`onChange` called exactly once per click** (the §3 regression).
- [ ] uncontrolled `defaultValue` is initial; re-render with a same-content new array identity does not reset; controlled `value` wins and internal state does not leak.
- [ ] single mode: selection replaces; `allowDeselect={false}` keeps one picked; default clears on second click.
- [ ] radiogroup: exactly one card has `tabIndex=0`; arrows move focus **and** select; wraps at both ends; `Home`/`End`; disabled cards skipped; multiple mode: every enabled card is `tabIndex=0`.
- [ ] `Enter`/`Space` activate and `Space` is `preventDefault`ed (assert `defaultPrevented`); disabled card never calls `onChange` and its input is `disabled`.
- [ ] Submit: a `FormData` over a real `<form>` carries `${name}[]` per selection in multiple mode and `name` in single, and omits disabled cards.
- [ ] ARIA: `role`/`aria-checked` per mode; card `aria-labelledby` resolves to the title text **without** the pill text; `aria-describedby` resolves to the subtitle; group `aria-labelledby`/`aria-describedby` from `label`/`description`.
- [ ] Grid: track count from `columns`, `0`/`9` clamped to 1/6, `grid-auto-rows: 1fr`, gap class from `GAP_CLASSES`.
- [ ] Overrides: `option.variant`/`tone`/`corner`/`padding`/`pulse`/`checkboxVariant` beat group props (assert through Panel's `data-variant`/`data-tone`/`data-active` and the box's classes); group `tone` reaches both box accent and active rim.
- [ ] Optionals: title-only renders; `icon` as registry name and as element; `labels` render through `Pill`; nothing renders for absent slots.
- [ ] No `Panel:clickable-nested-interactive` dev warning (console spy), and the presentation input is `aria-hidden` + `tabindex="-1"`.
- [ ] `cd react && npx vitest run src/components/MultiSelectPanel.test.tsx --coverage.enabled=false` green.

## Task 5 — Export (`react/src/components/index.ts`)

- [ ] `export { default as MultiSelectPanel, type MultiSelectPanelProps, type MultiSelectPanelOption } from "./MultiSelectPanel";` in the alphabetical slot beside `MultiSelectPills` ([components/index.ts:396](../../react/src/components/index.ts#L396)). `react/src/index.ts` re-exports `./components`, so no second edit.

## Task 6 — Docs (`react/demo/src/kit-docs/components/multi-select-panel/`)

- [ ] `MultiSelectPanelPage.tsx` — `PageHeader`, playground, Examples, `PropsTable`, `A11ySection` (screen reader / `KeyboardSupportTable` matching spec §4 row for row / internationalization: the component speaks nothing, every string is the caller's) per [CONVENTIONS.md](../../demo/src/kit-docs/CONVENTIONS.md).
- [ ] `examples/Capabilities.tsx` — the reference: `label="Input and output"`, `columns={2}`, Text checked, Image / Speech to text / Text to speech free, icons + subtitles.
- [ ] `examples/SingleChoice.tsx` — `selectionMode="single"` with pills, showing one tab stop and arrow picking.
- [ ] `examples/Overrides.tsx` — per-option `tone`/`variant`/`pulse`, a disabled card, pills, and a long title proving equal card heights.
- [ ] `MultiSelectPanelPlayground.tsx` — `PlaygroundPanel` + `ControlAccordion`: `columns`, `gap`, `size`, `selectionMode`, `allowDeselect`, `disabled`, `label`/`description` toggles, `checkboxVariant`, the `Pick`ed Panel surface controls, `labelTone`/`labelVariant`, and `useEventLog` for `onChange`.
- [ ] `registry.ts` — one entry, `category: "Forms"`, `slug: "multi-select-panel"`, a real `IconName` from the registry.
- [ ] `cd react/demo && npx tsc --noEmit -p tsconfig.json` clean.

## Task 7 — Verification

- [ ] `cd react && npx vitest run src/components/MultiSelectPanel.test.tsx src/components/Panel src/components/Checkbox src/components/MultiSelectPills src/a11y --coverage.enabled=false`.
- [ ] `cd react && npx tsc --noEmit && npx eslint src/components/MultiSelectPanel.tsx`.
- [ ] Kit CSS rebuild before trusting a browser: `cd react && npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css`.
- [ ] Real-browser pass on the docs route: equal card heights across rows, rim + tint against the dark backdrop, pill wrapping, focus ring, arrow picking — jsdom proves none of these.
- [ ] Commit spec + component + tests + docs by explicit pathspec, with approval.

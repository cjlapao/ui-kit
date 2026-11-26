# Popup-family option-row washes — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-26-popup-family-option-tones-design.md`](../specs/2026-11-26-popup-family-option-tones-design.md)

Rule of the whole change: **the wash is resolved once by
`resolveOptionRowWash` in `common/theme/Theme.ts`; no component derives a hover
or selected hue on its own.** Components spread `{ hover, cursor, selected }`;
they do not do colour arithmetic.

**Ground rules:**

- Never break: trigger/field paint (`inputFillTone`, open rim, glow, focus
  ring), `VariablePicker`'s per-group badge/tab colours, `danger` items,
  disabled rows, every existing public behaviour. Both props unset must render
  React rows pixel-identical to today.
- Vue changes are exactly the ones the spec's "Vue drift fix" section lists —
  the step recipes retire, `VariablePicker` rows wash for the first time, the
  private `toneTokens` maps retire.
- Every new colour string is a template literal in `common/theme/Theme.ts`
  over `TrueColor`; nothing outside Theme.ts invents a `bg-{c}-…` shape.
- `react/src/theme/Theme.ts` and `vue/src/theme/Theme.ts` are `export *`
  re-exports of `common/theme/Theme.ts` — new exports reach both kits without
  barrel edits (verify, don't assume).
- Only commit files this plan touches, by explicit pathspec — the working tree
  has unrelated uncommitted icon work. `.git` is read-only under the current
  sandbox, so commits need the user's approval; a rejected commit is not a
  task failure.
- Before Task 1, run the full React and Vue suites once and **record the
  failure baseline here** (previous plans mention a React "8-failure known
  baseline"; verify it, don't inherit it). Fill in: React `___` / Vue `___`.

---

## Task 1 — Theme owns the rule (`common/theme/Theme.ts`)

- [x] RED first: new `react/src/theme/optionRowWash.test.ts` (beside
      `tonalRim.test.ts`), asserting for **all 21** `TRUE_COLORS`:
      `getOptionRowWashClasses(t)` is exactly
      `hover:bg-{t}-500/15 dark:hover:bg-{t}-500/20` /
      `bg-{t}-500/15 dark:bg-{t}-500/20`;
      `getOptionSelectedClasses(t)` is exactly the
      `bg-{t}-50 / text-{t}-700 dark:text-{t}-300 / text-{t}-500 dark:text-{t}-400`
      triple; `resolveOptionRowWash` follows the spec's precedence table row by
      row (both unset → the `POPUP_ROW_WASH` constants verbatim; explicit hue;
      `"selected"` follows `optionSelectedTone ?? tone`; cursor class is the
      hover class without the `hover:` prefix).
- [x] Implement the three helpers + `export type OptionRowTone = TrueColor |
      "selected"` directly under `POPUP_ROW_WASH`, whose comment block gets two
      sentences: the toned twins of this constant live in
      `getOptionRowWashClasses`; callers resolve through `resolveOptionRowWash`,
      never by hand.
- [x] Gate: `cd react && npx vitest run src/theme/optionRowWash` green;
      `npx tsc --noEmit -p tsconfig.json` at 0 errors.

## Task 2 — Safelist declares the shapes

- [x] Add to `scripts/generate-safelist.mjs` (near the surface-hover block at
      :372-381 where the `-500/xx` family lives): `hover:bg-{COLOR}-500/15`,
      `bg-{COLOR}-500/15`, `bg-{COLOR}-500/20`, `dark:bg-{COLOR}-500/20`, and
      `dark:hover:bg-{COLOR}-500/20` if the contract test still reports it
      (the `{15,25,35,45}` braces at :381 lack `20`). Comment the block
      "popup family toned row wash" like its neighbours do.
- [x] `node scripts/generate-safelist.mjs` regenerates `common/safelist.css`.
- [x] Extend `react/src/theme/themeSafelist.test.ts`: import
      `getOptionRowWashClasses` + `getOptionSelectedClasses`, add both to the
      generators its `collect()` walks.
- [x] Gate: `npm run build:react && npx --prefix react vitest run
      src/theme/themeSafelist` green — it reads the built stylesheet, so it is
      the only proof a shape exists.

## Task 3 — React `Picker` + `TagPicker` (full triple)

- [x] RED first in `Picker.test.tsx` / `TagPicker.test.tsx`, following the
      spec's Testing list: default (rows carry `POPUP_ROW_WASH.hover`, no
      `-{c}-500/15` in the popup), `optionHoverTone="rose"` (unselected rows
      wear the rose wash, selected row keeps its fill),
      `optionSelectedTone="emerald"` (fill/copy/checkmark ink emerald, trigger
      open rim still the field `tone`), `optionHoverTone="selected"` with and
      without `optionSelectedTone`, cursor parity on
      `data-active`-by-keyboard rows. Read the existing assertions first and
      match how they open the popup and read row classes.
- [x] Props + JSDoc (wording from the spec's API block) on both components'
      props interfaces; destructure both.
- [x] `const rowWash = resolveOptionRowWash({ optionHoverTone,
      optionSelectedTone, tone: effectiveTone })` once per render; spread into
      the row classNames: `POPUP_ROW_WASH.hover`/`.cursor` usages (incl. the
      group-header toggle buttons, `Picker.tsx:947`, `TagPicker.tsx:943-945`)
      become `rowWash.hover`/`rowWash.cursor`; `colorTokens.optionSelectedBg/
      Text/Icon` become `rowWash.selected.bg/text/icon`.
- [x] Delete only the three `optionSelected*` entries from each component's
      private `toneTokens` map — `triggerOpen`, `triggerOpenBorder`,
      `filterActive` stay.
- [x] Gate: `npx vitest run src/components/Picker src/components/TagPicker`
      green.

## Task 4 — React `Combobox` (cursor + text-only selected)

- [x] RED first in `Combobox.test.tsx`: default, `optionHoverTone`,
      `optionSelectedTone` moves the selected option's copy hue only,
      `"selected"` follow, cursor parity on the `activeIndex` row
      (`:530` paints `POPUP_ROW_WASH.cursor`).
- [x] Same wiring as Task 3. `Combobox` keeps its own selected-copy recipe
      (`text-{t}-700 dark:text-{t}-200`) — parameterise `toneClasses` (or the
      inline lookup) by the **resolved** selected tone, not the raw field tone.
      `optionSelectedTone` is on this component's props; it moves text, no
      fill.
- [x] Gate: `npx vitest run src/components/Combobox` green.

## Task 5 — React `VariablePicker` + `DropdownMenu` (hover only)

- [x] RED first in `VariablePicker.test.tsx` / `DropdownMenu.test.tsx`:
      default wash, `optionHoverTone` wash, `"selected"` resolves to the
      field `tone` (they have no selected paint). No `optionSelectedTone` in
      either props interface.
- [x] `VariablePicker.tsx:108` and `DropdownMenu.tsx:494` go through
      `resolveOptionRowWash`. Keep `VariablePicker`'s doctrine comment intact
      and extend it: the row wash is neutral by doctrine — an explicit
      `optionHoverTone` is the caller overruling that on purpose.
- [x] Gate: `npx vitest run src/components/VariablePicker src/components/DropdownMenu` green.

## Task 6 — Vue `Picker` + `TagPicker`

- [x] RED first in `Picker.test.ts` / `TagPicker.test.ts`, mirroring Task 3's
      cases (and asserting the old step classes — `hover:bg-neutral-50`,
      `dark:hover:bg-neutral-800/60` — are gone).
- [x] Import `POPUP_ROW_WASH`, `resolveOptionRowWash`,
      `getOptionSelectedClasses`, `OptionRowTone` from `../theme/Theme`
      (verify that re-export reaches them; Vue `Picker.vue:3` already imports
      `TRUE_COLORS` from there).
- [x] Rows (`Picker.vue:721`, `TagPicker.vue:736/836`) and the group-header
      select-all row (`Picker.vue:693`) take `rowWash.hover` (Vue `Picker`
      has no keyboard cursor — pointer only, per spec); selected fill/copy/ink
      take `rowWash.selected.*`; the private `optionSelected*` map entries
      (`Picker.vue:30-31`, `TagPicker.vue:30-31`) delete.
- [x] Gate: `cd vue && npx vitest run src/components/Picker src/components/TagPicker` green.

## Task 7 — Vue `Combobox`, `DropdownMenu`, `VariablePicker`

- [x] `Combobox.vue`: `toneClasses.active` / `toneClasses.selected`
      parameterised by the resolved tones; hover/active row takes
      `rowWash.hover`/`rowWash.cursor` (its `activeIndex` is the cursor).
      `optionSelectedTone` applies (copy hue, as React).
- [x] `DropdownMenu.vue:477` idle branch → `rowWash.hover`; danger branch
      untouched.
- [x] `VariablePicker.vue`: rows gain `rowWash.hover` — first hover wash they
      ever had (spec §Vue drift).
- [x] RED tests per component first, matching each file's existing style.
- [x] Gate: `cd vue && npx vitest run src/components/Combobox src/components/DropdownMenu src/components/VariablePicker` green.

## Task 8 — Docs and playgrounds (`react/demo/src/kit-docs/`)

- [x] One sentence naming `optionHoverTone`/`optionSelectedTone` in each
      family member's page (`picker/`, `tag-picker/`, `combobox/`,
      `variable-picker/`, `dropdown-menu/` as they exist).
- [x] `PickerPlayground.tsx`: two `HueControl`s (from `kit-docs/shared/`) —
      *Selected hue* and *Hover hue*, the latter with an Auto row plus the
      "Follow selection" choice feeding `"selected"`. Same pair on the
      DropdownMenu playground, hover control only.
- [x] Gate: `cd react/demo && npx tsc --noEmit` at its pre-existing baseline
      (previous plan says 10 errors — measure, don't inherit).

## Task 9 — Verify

- [x] Full `cd react && npx vitest run` and `cd vue && npx vitest run` at the
      baseline recorded above; `npx eslint` clean on every touched file.
- [x] `npm run build:react && npm run build:vue`; `themeSafelist.test.ts`
      green on the fresh builds.
- [x] Throwaway Chromium harness (`playwright-core`, scratch dir, deleted
      afterwards — the pattern from
      [2026-11-23-hover-follows-selection](2026-11-23-hover-follows-selection.md)
      Task 6): open a `Picker` with `tone="blue"`,
      `optionSelectedTone="emerald"`, `optionHoverTone="selected"`; a real
      `page.hover()` must produce a computed `background-color` equal to
      emerald-500/15 (light) and /20 (dark) on an unselected row, the selected
      row keeps its emerald fill under the pointer, and the trigger's open rim
      stays blue. Report the computed values, not the intent.
- [x] Commit by explicit pathspec: Theme.ts, safelist script + generated
      css, the 10 component files, the theme/component tests, the doc pages +
      playgrounds, this plan (ticked).

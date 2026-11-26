# Popup family — overridable option-row washes (`optionHoverTone` / `optionSelectedTone`)

Date: 2026-11-26
Components: `Picker`, `TagPicker`, `Combobox`, `VariablePicker`, `DropdownMenu` —
React (`react/src/components/*.tsx`) **and** Vue (`vue/src/components/*.vue`).

## Problem

An option row in any of the five popup components wears a hover wash nobody can
change. In React it is the shared constant `POPUP_ROW_WASH.hover`
(`hover:bg-neutral-900/5 dark:hover:bg-neutral-100/10`, `common/theme/Theme.ts`),
used verbatim by every family member (`DropdownMenu.tsx:494`,
`VariablePicker.tsx:108`, `TagPicker.tsx:833/943`, `Picker.tsx:827/947/977`, …).
In Vue there is not even the constant: rows hardcode the pre-blend step recipe
(`hover:bg-neutral-50 dark:hover:bg-neutral-800/60` in `Picker.vue:721` and
`TagPicker.vue:736/836`, `hover:bg-neutral-100 dark:hover:bg-neutral-800` in
`DropdownMenu.vue:477`) that commit `2d024d52` retired on React.

There is no way to reach those rows from outside:

- The popup is portaled to `document.body`, so no descendant selector from the
  trigger's `className` can paint the rows — `className` styles the trigger only.
- No prop exposes a popup class, and no CSS custom property participates in the
  row paint.

The second half of the complaint: the selected option row's fill, copy and
checkmark ink are welded to the field's `tone` (the private per-component
`toneTokens` maps — `optionSelectedBg: bg-{tone}-50 dark:bg-{tone}-900/20`,
`optionSelectedText`, `optionSelectedIcon`, e.g. `Picker.tsx:84-86`,
`Picker.vue:30`). Retinting the selected rows therefore also moves the focus
border, ring, icons and glow — state colours the caller may want to keep.

The requested ability, from the field: override the dropdown's hover colour,
override the selected colour, and let hover follow the selected colour so the
open list reads as one hue.

## Requested behavior

- Callers can set the hover wash of option rows to any kit hue.
- Callers can set the selected rows' hue independently of `tone` (which keeps
  owning focus border/ring/glow).
- Hover can be declared as "same hue as the selected rows" rather than naming
  the colour twice.
- The whole popup family gains this — not just `Picker` — since the wash is one
  shared constant by design and the family must not drift apart on it.
- Both frameworks, React and Vue.

## Design

### API — on all five components, both frameworks

```ts
/** The hue a row wash may wear: a kit tone, or "selected" — the effective
 *  selected hue (`optionSelectedTone ?? tone`). */
export type OptionRowTone = TrueColor | "selected";

export interface PickerProps /* …same two props on the rest of the family… */ {
  // …
  /**
   * The hue the selected option rows wear — fill, copy and checkmark ink.
   * Default: the field's `tone`. Focus border, ring and glow stay `tone`'s
   * either way — this prop moves only what happens inside the popup.
   */
  optionSelectedTone?: TrueColor;
  /**
   * The hue the unselected option rows wear under the pointer — and under the
   * keyboard cursor, which by definition wears the same whisper as hover.
   * Unset keeps today's neutral blend (`POPUP_ROW_WASH`). `"selected"`
   * follows the effective selected hue.
   * @default undefined
   */
  optionHoverTone?: OptionRowTone;
}
```

Applicability is driven by what each component actually paints — the props are
typed only where a selected-row paint exists, so nobody gets a prop that does
nothing:

| Component      | `optionHoverTone` | `optionSelectedTone`                                                            |
| -------------- | ----------------- | ------------------------------------------------------------------------------- |
| Picker         | hover + cursor    | fill, copy, checkmark ink                                                        |
| TagPicker      | hover + cursor    | fill, copy, checkmark ink                                                        |
| Combobox       | hover + cursor    | copy hue of the option matching the current value (selected is text-only today) |
| VariablePicker | hover             | — (no selected paint; colour identity rides the badge/tab)                       |
| DropdownMenu   | hover             | — (action menu; no selected state)                                               |

`OptionRowTone` is exported from the theme barrel (`common/theme/Theme.ts`,
re-exported by `react/src/theme` and the Vue equivalent).

Naming: `option*` matches the family's existing grammar — the rows are
`role="option"`, the token names are already `optionSelectedBg/Text/Icon` —
and the `panel*` props set the precedent for per-popup flat props.
(`rowHoverTone`, ActivityFeed's shape, belongs to the list-row grammar; the
popup family speaks "option".)

### Recipes — one definition in `common/theme/Theme.ts`

The toned twins of the neutral constants, built the way `getSubItemHoverClasses`
is built (template literals over `TrueColor`, safelist-enforced):

```ts
/** The toned twin of POPUP_ROW_WASH — a blend, never a step. */
export const getOptionRowWashClasses = (tone: TrueColor) => ({
  hover: `hover:bg-${tone}-500/15 dark:hover:bg-${tone}-500/20`,
  cursor: `bg-${tone}-500/15 dark:bg-${tone}-500/20`,
} as const);

/** The toned selected-row triple, lifted from the five components' private
 *  toneTokens maps — fill, copy, and the checkmark/radio ink that must ride
 *  with it (a rose row with a blue tick reads broken). */
export const getOptionSelectedClasses = (tone: TrueColor) => ({
  bg: `bg-${tone}-50 dark:bg-${tone}-900/20`,
  text: `text-${tone}-700 dark:text-${tone}-300`,
  icon: `text-${tone}-500 dark:text-${tone}-400`,
} as const);
```

Alphas mirror `getSubItemHoverClasses` (`-500/15` light, `-500/20` dark): the
wash lightens in dark and darkens in light against any card, which is the
"blend, never a step" doctrine `POPUP_ROW_WASH` was born from. The cursor class
is the hover class minus the `hover:` prefix — same whisper, by construction.

`getOptionSelectedClasses` is the Picker/TagPicker triple (they are the
components with a selected fill + copy + checkmark). `Combobox` keeps its own
selected-copy pair (`text-{tone}-700 dark:text-{tone}-200`, `Combobox.tsx:81`)
but parameterises it by the resolved selected hue instead of the raw field
tone — changing that recipe here is not the job of this change.

### Resolution — one place, not ten

```ts
/** Precedence for the popup family's row washes. Components spread the result
 *  into their row classNames; none re-derives the rule. */
export const resolveOptionRowWash = (opts: {
  optionHoverTone?: OptionRowTone;
  optionSelectedTone?: TrueColor;
  tone: TrueColor; // the field's effective tone (color alias already folded)
}) => {
  const selectedTone = opts.optionSelectedTone ?? opts.tone;
  const selected = getOptionSelectedClasses(selectedTone);
  if (opts.optionHoverTone === undefined)
    return { selected, hover: POPUP_ROW_WASH.hover, cursor: POPUP_ROW_WASH.cursor };
  const wash = getOptionRowWashClasses(
    opts.optionHoverTone === "selected" ? selectedTone : opts.optionHoverTone,
  );
  return { selected, hover: wash.hover, cursor: wash.cursor };
};
```

Precedence table (the whole behaviour contract):

| `optionHoverTone`       | `optionSelectedTone` | unselected row wash        | selected row hue |
| ----------------------- | -------------------- | -------------------------- | ---------------- |
| unset                   | unset                | neutral blend (today)      | `tone` (today)   |
| unset                   | `"emerald"`          | neutral blend              | emerald          |
| `"rose"`                | unset                | rose wash                  | `tone`           |
| `"selected"`            | `"emerald"`          | emerald wash               | emerald          |
| `"selected"`            | unset                | `tone` wash                | `tone`           |

Both props unset must be pixel-identical to today's **React** rendering.
`VariablePicker` and `DropdownMenu` stop at the wash columns of this table —
they have no selected paint (see the applicability matrix).

### Component wiring (10 files)

Each component replaces its `POPUP_ROW_WASH.*` usages and its private selected
`toneTokens` entries with the resolver output, applied to:

- option rows (hover on unselected, selected fill/copy/ink on selected, cursor
  wash under the keyboard cursor — where the component paints one; React
  `Combobox` paints the cursor wash at `:530`, Vue `Combobox` drives an
  `activeIndex` already),
- the multi-select group-header toggle rows that wear `POPUP_ROW_WASH.hover`
  today (`Picker.tsx:947`, `TagPicker.tsx:943-945`) — they are rows of the list,
  they follow the list.

Things that do **not** change: trigger/field paint (`inputFillTone`, open rim,
glow, focus ring), `VariablePicker`'s per-group colours (they ride the badge and
the tab, never the row — unchanged; `optionHoverTone` is caller-chosen, and a
caller who wants toned rows asks for it), `danger` items (stay rose),
separators and empty-state rows, disabled rows (stay wash-free).

### Vue drift fix (included, deliberately)

The Vue family never followed `2d024d52`. As part of this work, Vue rows move
onto the shared constants and getters — same source of truth React uses:

- `Picker.vue:721`, `TagPicker.vue:736/836` and `DropdownMenu.vue:477` (idle
  branch) trade their step recipes for `POPUP_ROW_WASH`;
- the private `toneTokens` maps (`Picker.vue:30`, `TagPicker.vue:30`,
  `Combobox.vue`'s `toneClasses`) are replaced by the shared
  `getOptionSelectedClasses` / resolver output;
- where a Vue component has no keyboard-cursor paint today (Vue `Picker`), only
  the pointer wash is applied — no new behaviour, just the honest mapping;
- Vue `VariablePicker` rows have **no hover wash at all** today (React's row
  got one at `VariablePicker.tsx:108`, Vue's did not) — the family constant
  gives them the pointer feedback their React sibling always had.

Intentional visible effects: Vue light-mode row hover becomes visible
(`neutral-50` on white was a near-invisible step; the blend shows) and Vue
VariablePicker rows wash for the first time.

### Safelist

New interpolated shapes exist in the stylesheet only if
`scripts/generate-safelist.mjs` declares them. Add whatever
`themeSafelist.test.ts` reports missing after the first build; the expected
new shapes are `hover:bg-{COLOR}-500/15`, `bg-{COLOR}-500/15`,
`bg-{COLOR}-500/20` and `dark:bg-{COLOR}-500/20` — several siblings
(`dark:hover:bg-{COLOR}-500/20`, `bg-{COLOR}-50`, `dark:bg-{COLOR}-900/20`)
are already declared for other recipes. The gate is the existing built-CSS
contract test (`react/src/theme/themeSafelist.test.ts`, run after `npm run
build:react`), extended with the new getters so all 21 tones are checked.

## Testing

Per-component vitest additions (React `.test.tsx` / Vue `.test.ts`, all five):

1. **default** — props unset: rows carry `POPUP_ROW_WASH.hover` (and Vue rows
   now carry it where they carried the step recipe); no `-{color}-500/15`
   class anywhere in the popup;
2. **`optionHoverTone="rose"`** — unselected rows carry the rose hover class;
   selected row keeps its fill (hover paints unselected rows only, as today);
3. **`optionSelectedTone="emerald"`** (Picker, TagPicker, Combobox) — selected
   fill/copy/ink are emerald while the trigger's focus/open rim still reads the
   field `tone`;
4. **`optionHoverTone="selected"`** — hover hue equals the effective selected
   hue, with and without `optionSelectedTone`;
5. **cursor parity** — where the component paints a keyboard cursor, its class
   is the hover class without the `hover:` prefix.

Plus: the extended `themeSafelist.test.ts` over the built stylesheet.

## Docs

- JSDoc on the two props (above is the wording).
- One-sentence mention of `optionHoverTone`/`optionSelectedTone` in each
  family member's kit-docs page (`react/demo/src/kit-docs/components/…`).
- Playground tone pickers for the two props on **Picker and DropdownMenu only**
  — the other three inherit the same code path and do not need four more
  controls.

## Out of scope

- `Menu` / `MenuButton` — separate surface, hover already follows tone via
  `itemTone` + `getSideMenuItemTokens`;
- `DatePicker`'s calendar cells — they share the constant but are not option
  rows; adoption later would be its own decision;
- per-item `hoverTone` on `PickerItem`/`MenuItem`-style entries (ActivityFeed
  has it; no demand here — caller-level props only, YAGNI);
- raw class pass-throughs and CSS-custom-property seams (evaluated and
  rejected: class pass-throughs bypass the theme grammar; vars fight the
  `dark:` split and duplicate machinery the class system already provides).

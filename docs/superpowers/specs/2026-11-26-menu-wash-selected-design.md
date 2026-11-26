# Spec: Menu — Faded Tone Wash on the Selected Radio Row

Date: 2026-11-26
Status: implemented — Menu wash tests green; themeSafelist walk added; react lint + build clean

## Goal

Give `Menu` an opt-in option that paints the selected row — the one carrying the
radio gutter dot — with a faded wash of the item's own tone: paler than the
panel in the light theme, sunk deeper than the panel in the dark theme, so the
selection reads at a glance without waiting for the small dot to be noticed.

## Problem

`Menu` rows resolve a tone (`item.tone ?? props.itemTone ?? props.tone`) and the
kit already speaks "faded tone" as a fill everywhere else — `SideMenu`'s active
row (`bg-{c}-50 dark:bg-{c}-500/10`), `Picker`'s selected option
(`bg-{c}-50 dark:bg-{c}-900/20`) — but a checked `type: "radio"` row in `Menu`
gets **no fill at all**. Selection lives entirely in a 6px `bg-current` dot in
the leading gutter (Menu.tsx:172) plus `aria-checked`. A menu of radio rows
whose tone the author already set looks toneless on the very row the tone is
about.

## Decisions (from the design session)

| Question | Decision |
|---|---|
| Which menu | React `Menu` only (`Menu` is React-only; no Vue counterpart to update) |
| Which selection | Radio rows only — `type: "radio"` with `checked: true` (the gutter-dot marker). `selectedKey` rows keep their right-aligned check unchanged |
| Fill pair | `bg-{c}-50` light / `dark:bg-{c}-900/20` dark — literally lighter than the tone in light, darker in dark; the same pair `Picker.optionSelectedBg` uses |
| Text on the wash | Tone the copy and the dot (dot paints `bg-current`): `text-{c}-700 dark:text-{c}-300`, mirroring `Picker.optionSelectedText` |
| Option shape | One menu-wide boolean, `washSelected` (opt-in, default off). No per-row variant (YAGNI); per-row *tone* already flows through `item.tone` |
| Untinted case | `tone: "none"` falls back to neutral. A `{c}-900/20` wash on a neutral-900 panel is invisible, so the neutral entry gets the SideMenu-style stronger pair: `bg-neutral-100 dark:bg-neutral-800/60` |
| Danger rows | A `danger` radio washes `rose` — the row's ink is already rose, so the wash takes the same hue |
| Disabled rows | No wash; the existing `opacity-40` treatment wins |

## Design

### 1. Token table — `common/theme/Theme.ts`

A generated table beside `sideMenuItemTokens`, same shape and same
`Object.fromEntries(TRUE_COLORS…)` construction, plus the neutral override:

```ts
export interface SelectedRowTokens { bg: string; text: string }

const selectedRowTokens: Record<TrueColor, SelectedRowTokens> =
  Object.fromEntries(TRUE_COLORS.map((c) => [c, {
    bg: `bg-${c}-50 dark:bg-${c}-900/20`,
    text: `text-${c}-700 dark:text-${c}-300`,
  }]));

selectedRowTokens.neutral = {
  bg: "bg-neutral-100 dark:bg-neutral-800/60",
  text: "text-neutral-900 dark:text-neutral-100",
};

export const getSelectedRowTokens = (color: TrueColor): SelectedRowTokens =>
  selectedRowTokens[color] ?? selectedRowTokens.blue;
```

The generated shape is the point: every previous hand-written 21-tone literal in
this kit drifted (`Picker`'s original spelled `red` as rose and `green` as
emerald, and the misspelled classes were never emitted at all — see the header
comment in `Picker.tsx`).

**Safelist:** zero new entries. Every emitted class shape already ships —
`bg-{COLOR}-50`, `text-{COLOR}-700`, `dark:text-{COLOR}-300`,
`dark:bg-{COLOR}-900/{…,20,…}` (generate-safelist.mjs:98, 117, 194, 228) — and
the neutral override reuses the exact pair `sideMenuItemTokens.neutral.bg`
already emits. `themeSafelist.test.ts` gains a walk over
`getSelectedRowTokens` across all 21 tones.

### 2. API — `react/src/components/Menu/types.ts`

```ts
/** Paint the checked `type: "radio"` row with a faded wash of its own tone —
 * pale `bg-{c}-50` in light, sunk `dark:bg-{c}-900/20` in dark — so selection
 * reads before the gutter dot is even noticed. The tone resolves like the
 * row's other tone-driven styles (`item.tone ?? itemTone ?? tone`, "none"
 * washes neutral, `danger` washes rose). Row copy and dot take the tone too.
 * Decorative only — `aria-checked` and the dot are the truth. @default false */
washSelected?: boolean;
```

`MenuButton` forwards it (one-line pass-through, matching how it forwards
`selectedKey`).

### 3. Rendering — `Menu.tsx` `MenuRow`

```ts
const washed = Boolean(props.washSelected) && item.type === "radio"
  && item.checked && !item.disabled;
```

When `washed`, the row's `className` appends
`getSelectedRowTokens(item.danger ? "rose" : itemTone).bg` and `.text`.
The hover tokens already on the row keep working: Tailwind emits variant rules
after base utilities, so `hover:bg-{c}-100` (light) /
`dark:hover:bg-{c}-500/20` (dark) still step *away* from the resting wash in
both themes. `role`, `aria-checked` and the dot are untouched.

### 4. Tests & demo

- `Menu.test.tsx`
  - off by default: checked radio row carries no wash classes;
  - on + blue tone: `bg-blue-50`, `dark:bg-blue-900/20`, `text-blue-700`,
    `dark:text-blue-300`;
  - on + untinted: the neutral pair;
  - on + `danger` radio: the rose pair;
  - unchecked radios and `selectedKey` rows never wash;
  - disabled checked radio never washes.
- `themeSafelist.test.ts`: walk `getSelectedRowTokens` over `TRUE_COLORS` +
  the neutral override, asserting each class exists in the built stylesheet.
- `MenuPlayground`: "Wash selected" `ToggleRow` beside the existing controls;
  the Light/Dark/System radio group is already the demo subject.

## Out of scope

- `selectedKey` row fills, per-row `washSelected` overrides, `SideMenu`
  changes, Vue kit changes, migrating `Picker` onto the new table (possible
  follow-up).

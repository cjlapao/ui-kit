# MultiSelectPanel — checkbox cards on a uniform grid

Date: 2026-11-23
Components: `react/src/components/MultiSelectPanel.tsx` (new),
`common/a11y/interactive.ts` (surgical: `hasInteractiveDescendant` skip for presentational
controls) — React only. Vue parity (`vue/src/components/MultiSelectPanel.vue`) is a separate
future port, the way `MenuButton` shipped React-only.

## Problem

The UX target is a capability picker: an uppercase group heading ("INPUT AND OUTPUT"), then a
two-column grid of cards — each with a checkbox at the left, an icon, a title, and a muted
subtitle underneath. The selected card carries a 2px coloured rim and a tone-tinted fill
(the "Text" card in the reference). Other cards show label pills on the title row. Some
cards can be disabled.

The kit has every part and no assembly:

1. `Checkbox` ([react/src/components/Checkbox.tsx](../../react/src/components/Checkbox.tsx))
   draws the box off the real (visually hidden) input, and has `label` / `description` /
   `descriptionPlacement` / `tone` / `size` / `variant` on the shared `InputVariant` scale.
2. `Panel` ([react/src/components/Panel.tsx](../../react/src/components/Panel.tsx)) has the
   surface (`variant`, `tone`, `padding`, `corner`, `transparency`, glass knobs), the pointer
   answer (`hoverable`), activation (`clickable`: `role`, `tabIndex`, Enter/Space, focus ring,
   pressed step) and the sustained selection state (`active` — 2px inset rim + tone fill, which
   is exactly the reference's selected card).
3. `MultiSelectPills` already solved the *control* half of this — options,
   controlled/uncontrolled value, `selectionMode`, `allowDeselect`, `name[]` submission, the
   radiogroup keyboard pattern — but renders pills, not cards.

Writing the card by hand would fork Panel's surface map and Checkbox's box for a third time.
This component composes the two APIs instead.

## Requested behaviour

From the request and the reference image:

- A new component composing the **existing** `Checkbox` and `Panel` APIs.
- Expose the Panel properties that matter on the card, and pass the shared `tone` to the
  Checkbox; expose the **textbox variant** (`InputVariant`) for the box as well.
- The group sets its own `label` and the **number of columns**; a grid fills those columns so
  **all panels are always the same size**.
- Card order on the title row: checkbox, icon, title — subtitle underneath, label pills on the
  title row. Everything except the **title** is optional.
- Selection: multiple **and** single mode.
- React only.

## Decisions taken in review

- **Panel owns the interaction** (chosen over "Checkbox owns interaction"). The card is one
  tab stop and one announced control; the Checkbox becomes the drawn box and the form field.
  Rejected alternative — Checkbox owning it — would have moved the card's padding onto the
  Checkbox `<label>` to win the card-wide hit area, and left the card itself
  non-`clickable`, so Panel's pressed step, focus ring and activation semantics would have had
  to be rebuilt by hand.
- **Structured option slots** (`title`, `subtitle`, `icon`, `labels`) rather than free
  `children`, following `MenuButton`'s structured trigger slots. Consistent card layout, no
  per-use styling guesswork; `children` on an option is out.
- **Group props + per-option overrides** rather than a pass-through `panel={{…}}` object or a
  flat `panelVariant`-prefixed list. The group value is the default; the option field wins.
  Discoverable and type-safe, and it keeps Panel's and Checkbox's colliding names (`variant`,
  `tone`, `size`) apart: `variant`/`tone` are the Panel's, the box's surface is
  `checkboxVariant`.
- **`columns` is a plain number, not a breakpoint map.** The kit has no breakpoint vocabulary
  anywhere else; a `{base, sm, lg}` object would be the only one. Consumers who need
  responsive columns wrap the group.
- **Equal rows across the whole group** (`grid-auto-rows: 1fr`), not per-row stretch — the
  reference's grid is uniform, and "all panels are the same size" is the requirement.
- **Pills hug the title** (left, flowing, wrapping) rather than being pinned to the card's
  right edge, which would read as a table row.
- **Cards are `role="checkbox"` / `role="radio"`, not `aria-pressed` buttons.** A multi-select
  group of cards is a checkbox group; Panel defaults `role` to `button` only when the caller
  does not pass one ([Panel.tsx:1212](../../react/src/components/Panel.tsx#L1212)).
- **`corner` defaults to `"rounded-sm"`** — the theme's 0.5rem step
  (`surfaceCornerClasses`, [common/theme/Theme.ts:1293](../../common/theme/Theme.ts#L1293)) —
  which is the radius in the reference. Panel's own default, `"rounded-md"`, is 1rem and reads
  too round for a card of this size.
- **One hue, `tone`, drives three things** — the Checkbox accent, Panel's selection rim hue
  (`activeHue` = `borderColor ?? tone`, blue floor) and the hover wash — so a selected card
  never wears a rim in a colour its box does not.

## Design

### 1. Public API (`react/src/components/MultiSelectPanel.tsx`)

```ts
export interface MultiSelectPanelOption {
  value: string;
  /** The only required field. Rendered on the title row. */
  title: React.ReactNode;
  /** Muted line under the title. */
  subtitle?: React.ReactNode;
  /** Registry name (resolved by `renderIcon`) or an element. */
  icon?: React.ReactNode;
  /** Pills on the title row, hugging the title and wrapping when they overflow. */
  labels?: React.ReactNode[];
  disabled?: boolean;

  /** Beats the group's `variant` for this card. */
  variant?: PanelVariant;
  /** Beats the group's `tone` (rim hue, hover wash and box accent together). */
  tone?: TrueColor;
  /** Beats the group's `corner`. */
  corner?: SurfaceCorner;
  /** Beats the group's `padding`. */
  padding?: SurfacePadding;
  /** Beats the group's `pulse`. */
  pulse?: boolean;
  /** Beats the group's `checkboxVariant` for this card's box. */
  checkboxVariant?: InputVariant;
}

export interface MultiSelectPanelProps
  extends Pick<
    PanelProps,
    | "variant" | "tone" | "padding" | "corner" | "transparency"
    | "hoverable" | "hoverShadow" | "decoration" | "pulse"
    | "borderColor" | "backgroundColor"
    | "glassOpacity" | "vibrancy" | "specularMode"
  > {
  /** Name of the submitted fields. `${name}[]` in multiple mode, `${name}` in single. */
  name: string;
  options: MultiSelectPanelOption[];

  /** Group heading above the grid — the reference's "INPUT AND OUTPUT". */
  label?: React.ReactNode;
  /** Helper under the heading, wired to the group via `aria-describedby`. */
  description?: React.ReactNode;

  value?: string[];
  defaultValue?: string[];
  onChange?: (selectedValues: string[]) => void;

  /** @default "multiple" */
  selectionMode?: "multiple" | "single";
  /** Single mode: whether clicking the selected card clears it. @default true */
  allowDeselect?: boolean;

  /** Disable the whole group. */
  disabled?: boolean;

  /** Grid tracks, clamped to 1–6. @default 2 */
  columns?: number;
  /** Space between cards, on the shared control scale. @default "md" */
  gap?: ControlSize;
  /** Card typography, icon and box size, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Surface treatment of the checkbox box, on the textbox scale. @default "flat" */
  checkboxVariant?: InputVariant;

  /** Tone of the `labels` pills. @default the card's tone */
  labelTone?: TrueColor;
  /** Variant of the `labels` pills. @default "outline" */
  labelVariant?: PillVariant;

  className?: string;
}
```

Defaults: `variant="elevated"`, `tone="blue"`, `padding="sm"`, `corner="rounded-sm"`,
`columns=2`, `gap="md"`, `size="md"`, `checkboxVariant="flat"`, `labelVariant="outline"`.

Resolved the way the kit already resolves aliases — group value, then option override:
`const variant = option.variant ?? variantProp ?? "elevated"`.

**Named `label`, not `legend`** as `MultiSelectPills` calls it: the request's word, and the
word the rest of the kit's form controls use for the text above a control. `MultiSelectPills`
keeps its own name — renaming it is unrelated churn.

**Not exposed on a card:** Panel's `title`, `subtitle`, `badge`, `media`, `actions`, `loading`
and `loaderType`. They render as their own header/body blocks and would fight the composed
row; the card's copy comes from the option fields. **Out of scope:** `indeterminate`, group
validation status/message, `required`, a loading skeleton for the grid, and the Vue port.

### 2. Composition

```
<fieldset>                                  role=radiogroup in single mode
  <legend>label</legend>  <p>description</p>
  <div style="display:grid; grid-template-columns: repeat(columns, minmax(0,1fr));
              grid-auto-rows: 1fr">
    <Panel  clickable  role="checkbox"|"radio"  aria-checked  active={selected}
            aria-labelledby  aria-describedby  tabIndex  onClick  onKeyDown  …surface>
      <Checkbox  fullWidth  checked  disabled  tone  size  variant={checkboxVariant}
                 descriptionPlacement="bottom"  label={<row/>}  description={subtitle}
                 …presentation />
    </Panel>
  </div>
</fieldset>
```

- **Panel is the interactive layer.** `clickable` supplies the focus ring, the pointer cursor
  and the pressed step; `onClick` runs Panel's guarded path. `hoverable` defaults to true
  through Panel's own rule (`hoverable ?? Boolean(onClick)`).
- **`role` comes from us**, not Panel's default, together with `aria-checked`; `tabIndex` is
  ours too (Panel honours a caller `tabIndex` before its own `0`). In single mode the group
  takes `role="radiogroup"`.
- **Names are explicit, not name-from-content.** `aria-labelledby` points at the title span
  (`id={`${cardId}-title`}`) so the pills do not leak into the card's accessible name, and
  `aria-describedby` points at the subtitle (`id={`${cardId}-subtitle`}`). The Checkbox is
  passed `id={`${cardId}-input`}` so the box and its description stay one control to the
  browser.
- **The Checkbox is the card's whole text column.** Passing `label`/`description` — rather
  than laying out the title and subtitle by hand — keeps card typography on Checkbox's own
  `SIZE_STYLES` scale (`size` → label/description/glyph/gap/controlOffset) instead of a second
  scale invented here, and the `items-start` + `controlOffset` alignment is what puts the box
  on the title's cap height as in the reference.
- **The box is decoration.** `tabIndex={-1}`, `aria-hidden="true"`,
  `style={{ pointerEvents: "none" }}`, `onClick={(e) => e.preventDefault()}` and a no-op
  `onChange` all reach the **`<input>`** through Checkbox's input spread
  (`{...inputProps}`, [Checkbox.tsx:295](../../react/src/components/Checkbox.tsx#L295)) —
  *not* through `inputClassName`, which lands on the drawn box (already `pointer-events-none`
  by construction). `preventDefault` on the click refuses the native flip so the box can never
  show a state `checked` does not carry, and the `onChange` is present only so React treats the
  field as controlled and stays quiet. The input still carries `name`, `value` and `checked`,
  so the group submits natively and disabled cards drop out of the submit, exactly as
  `MultiSelectPills`' hidden inputs do.
  Muting the input's pointer events is deliberate and costs one thing worth naming: Checkbox
  keeps the input hittable on purpose so `peer-hover` can light the box's border
  ([Checkbox.tsx:286](../../react/src/components/Checkbox.tsx#L286)). Here the card answers the
  pointer — Panel's own hover step — so a box-local hover would be a second, disagreeing answer.
- **The title row** is one flex row inside the `label` slot: `renderIcon(icon, size)` from
  [react/src/utils/renderIcon.tsx](../../react/src/utils/renderIcon.tsx) → title span → pills.
  A string icon resolves through the kit registry, an element is cloned with the size class.
  `min-w-0` on the title and `flex-wrap` on the pill group so a long title truncates gracefully
  and pills wrap instead of blowing the track (`minmax(0, 1fr)` on the grid).
- **The `<fieldset>` carries `disabled`** for the whole group, as `MultiSelectPills` does, so
  every card's input leaves the submit at once; per-option `disabled` is set on the individual
  input and on Panel (veil + `aria-disabled`).
- **Pills are the kit's `Pill`** ([react/src/components/Pill.tsx](../../react/src/components/Pill.tsx)),
  `size="sm"`, `tone={labelTone ?? card tone}`, `variant={labelVariant}`, one per `labels`
  entry. `labels` entries may be strings or nodes; strings become pill children.

### 3. Click path — one toggle per click

Three events arrive from one pointer click; only one may toggle:

1. the click on the label/section — **this is the one that toggles**;
2. the label-forwarded click on the input — suppressed by Panel's
   `isClickOwnedByDescendant` guard ([Panel.tsx:692](../../react/src/components/Panel.tsx#L692));
3. the input's own flip — refused by the presentation `onClick`/`onChange` pair, which never
   toggles.

The `pointer-events-none` on the input is load-bearing, not cosmetic: with it, a click on the
box resolves to the (non-interactive) Checkbox wrapper span, so the card toggles; without it,
the box would be a ~20px dead zone inside a card that is otherwise clickable everywhere.

Keyboard activation goes through the same code path as a pointer press: our `onKeyDown`
toggles the card's own option directly, and only when `event.target` is the card element
itself — the same guard Panel's own `handleCardKeyDown` uses, which ours displaces
([Panel.tsx:1236](../../react/src/components/Panel.tsx#L1236)). `Space` calls
`preventDefault()` so it presses the card instead of scrolling the page.

### 4. Keyboard and focus

| Context | Key | Behaviour |
| --- | --- | --- |
| multiple | `Tab` | Each card is its own tab stop. |
| multiple | `Enter`, `Space` | Toggles the card; `Space` does not scroll. |
| single | `Tab` | One tab stop: the selected card, else the first enabled one. |
| single | `↑ ↓ ← →` | Moves focus and selects (wraps at the ends) — the radiogroup pattern `MultiSelectPills` uses. |
| single | `Home` / `End` | First / last enabled card, and selects it. |
| either | — | Disabled cards are skipped and never activate. |

Cards are addressed through `Panel`'s forwarded ref (it forwards to its `section`,
[Panel.tsx:562](../../react/src/components/Panel.tsx#L562)) held in a `useRef<(HTMLElement | null)[]>`
indexed by option, so arrow navigation calls `.focus()` on the card element itself.

### 5. Grid and equal sizing

`display: grid`, `grid-template-columns: repeat(columns, minmax(0, 1fr))` (inline style — no
arbitrary Tailwind class to safelist), `gridAutoRows: "1fr"` so every card in the group is the
height of the tallest one, and `gap` from the shared control scale. The gap map is the one
`MultiSelectPills` already keeps
([MultiSelectPills.tsx:76](../../react/src/components/MultiSelectPills.tsx#L76)) — that file
exports `GAP_CLASSES` and this one imports it, rather than minting a third copy that can drift.
`columns` is clamped to 1–6 with `Math.min`/`Math.max` — a `columns={0}` grid renders nothing,
which is never what a caller meant. Cards get `className="h-full"`; grid items stretch, and
Panel is already `flex w-full min-h-0 flex-col`.

### 6. Shared-code change (`common/a11y/interactive.ts`)

`hasInteractiveDescendant` returns true for **any** element matching
`INTERACTIVE_SELECTOR`, which includes `input`. A clickable Panel whose body carries the
presentation checkbox would therefore trip the `Panel:clickable-nested-interactive` dev warn
([Panel.tsx:719](../../react/src/components/Panel.tsx#L719)) on every card, in every dev
render — a false alarm on a control that is neither visible to assistive tech nor reachable by
keyboard.

Change: iterate the matches and skip any that has `tabindex="-1"` **and** is inside (or is)
`[aria-hidden="true"]`. A visible, focusable control still warns; `isClickOwnedByDescendant`
is untouched, so a real nested control still owns its clicks and still swallows the card's.
`hasInteractiveDescendant` has exactly one consumer repo-wide (`Panel`), so nothing else can
regress.

### 7. Files

| File | Change |
| --- | --- |
| `react/src/components/MultiSelectPanel.tsx` | New — component, types, internal `Card` and `OptionPills`. |
| `react/src/components/MultiSelectPanel.test.tsx` | New — see §8. |
| `common/a11y/interactive.ts` | `hasInteractiveDescendant` presentational skip. |
| `react/src/components/MultiSelectPills.tsx` | Export `GAP_CLASSES` (one keyword) so the grid reuses it. |
| `react/src/a11y/interactive.test.ts` | New — beside the existing `warn.test.ts`. |
| `react/src/index.ts` | Export the component and its types, beside `MultiToggle`/`MultiSelectPills`. |
| `react/demo/src/kit-docs/components/multi-select-panel/MultiSelectPanelPage.tsx` | New docs page. |
| `react/demo/src/kit-docs/registry.ts` | One entry, category **Forms**. |

If the component file outgrows ~260 lines during implementation, the card moves to
`react/src/components/MultiSelectPanel/Card.tsx` — the `Menu/` and `MenuButton/` precedent —
rather than staying one long file.

### 8. Tests

`react/src/components/MultiSelectPanel.test.tsx`:

- toggling selects and deselects; `onChange` receives the full next array.
- **`onChange` fires exactly once per click** — the regression this design's §3 exists for.
- uncontrolled: `defaultValue` is the initial value and its array identity changing on
  re-render does not reset the selection (the trap documented at
  [MultiSelectPills.tsx:127](../../react/src/components/MultiSelectPills.tsx#L127));
  controlled: `value` wins and no internal state leaks.
- single mode: selecting replaces the selection; `allowDeselect={false}` keeps one picked;
  `allowDeselect` default true clears it.
- radiogroup: one tab stop, arrows move focus *and* select, wrapping; `Home`/`End`; disabled
  cards skipped.
- multiple mode: every card is a tab stop; `Enter`/`Space` activate; `Space` does not scroll
  (`preventDefault` asserted).
- A disabled card does not call `onChange`, is `aria-disabled`, and its input is `disabled`
  so it is absent from a `FormData` submit; multiple mode submits `${name}[]` for each
  selected value, single mode submits `name`.
- ARIA: `role`, `aria-checked`, `aria-labelledby` resolving to the title text only (pills
  excluded), `aria-describedby` covering the subtitle, group `aria-labelledby`/`describedby`.
- Grid: `columns` sets the track count, clamps out-of-range values, and `grid-auto-rows` is
  `1fr`.
- Overrides: `option.variant`/`tone`/`corner`/`padding`/`pulse`/`checkboxVariant` beat the
  group props; the group's `tone` reaches both the box accent and the active rim.
- Optional slots: renders with only a title; icon accepted as a registry name *and* as an
  element; pills render through `Pill`.
- No `Panel:clickable-nested-interactive` dev warning (console spy).

`react/src/a11y/interactive.test.ts`:

- a visible focusable control inside a container still reports `true`;
- an `aria-hidden="true"` + `tabindex="-1"` input reports `false`;
- `aria-hidden` without `tabindex="-1"` (and vice versa) still reports `true`;
- `isClickOwnedByDescendant` is unchanged for a real nested control.

### 9. Docs

One page + one registry entry. Examples: the reference's `INPUT AND OUTPUT` group (Text
checked, the other three free); single-select; per-option overrides; a disabled card; pills +
icons; and a long-title card proving every card still matches height. Playground: `columns`,
`gap`, `size`, `selectionMode`, `allowDeselect`, `disabled`, `label`/`description` toggles,
and the Panel surface controls (`variant`, `tone`, `corner`, `padding`, `transparency`,
`hoverable`, `decoration`, `pulse`, glass knobs) plus `checkboxVariant` and `size`. Then the
page standard from
[CONVENTIONS.md](../../react/demo/src/kit-docs/CONVENTIONS.md): **Key Accessibility**
(`A11ySection` → screen reader, `KeyboardSupportTable` matching §4 row for row,
internationalization — the component speaks nothing itself, every string is a caller's) and
**API** (`PropsTable`, defaults from the component's runtime defaults, with a row for
"which Panel props are passed through and which are not").

### 10. Verification

```
cd react && npx vitest run src/components/MultiSelectPanel.test.tsx src/components/Panel src/a11y
cd react && npx tsc --noEmit
cd react && npx eslint src/components/MultiSelectPanel.tsx
```

Panel's own suites are the regression net for the `common/a11y` change. Then the kit CSS
rebuild the conventions file requires before trusting a browser
(`npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css`), and a real-Chrome screenshot
of the docs page: jsdom cannot prove equal card heights, truncation, or the rim against a dark
backdrop.

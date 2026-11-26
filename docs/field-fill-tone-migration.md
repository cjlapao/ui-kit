# Migrating a control's fill: `backgroundColor` → `fillTone` / `inputFillTone` / `inputTone`

Who this is for: an agent given one control and told to give it the same fill vocabulary the
field family already has. Read §1 before touching code; §2 is the conversion that already
landed (callers may still be on the old word); §4 is the queue of controls that have the props
no one gave them yet; §5 is the recipe; §6 lists mistakes that are already paid for.

Source of truth: [`common/theme/Theme.ts`](../common/theme/Theme.ts) (`getInputVariantTokens`,
`InputVariantOptions`), the design record
[`docs/superpowers/specs/2026-11-25-field-fill-tone-override-design.md`](superpowers/specs/2026-11-25-field-fill-tone-override-design.md),
and the rename commit `1e544060`. The React kit is the contract; `vue/src` is deferred by record.

## 1. The vocabulary — three words, three decisions

| Prop | Lives on | Moves | Must never move |
| --- | --- | --- | --- |
| `fillTone?: TrueColor` | the control that **is** the field | the field's fill, at the variant's own recipe | focus border, ring, caret, `ghost`'s hover rim, icons, gradient glow |
| `inputFillTone?: TrueColor` | the control that **has** fields | the same, for the fields it renders | the card it also paints |
| `inputTone?: TrueColor` | a composite that renders fields | the nested fields' affordances — focus border, ring, caret, a checkbox's checked fill | the composite's own chips, tabs, tiles, badges, card chrome |
| `tone?: TrueColor` (or `color`) | everything | the container's accent: card chrome and the control's own states | the fill |
| `backgroundColor?: TrueColor` | **cards only** — `Panel`, `StatCard`, `MultiSelectPanel` | the container's fill | a field. Do not rename it |
| `panelTone` / `panelVariant` | controls with a popup or a card surface | that surface | the field |

Two rules cover almost every judgement call:

- **`fillTone` / `inputFillTone` paints the field's fill and nothing else.** `inputTone` is the
  dial for the nested fields' affordances. The container's `tone` owns card chrome.
- **The theme has one option, not three.** `getInputVariantTokens(variant, tone, corner, options)`
  takes `options.fillTone` and it is the only fill door. A composite maps its `inputFillTone`
  *into* that bag; never add a second theme option, and never let a composite paint a fill by hand.

`neutral` as a hue means "the variant's own resting fill", not grey. `underline` has no fill, so
the prop is a documented no-op there. In `ghost` only the washes follow the fill — the hover rim is
an affordance the pointer asks for, so it stays in `tone`.

## 2. The conversion that already landed (`1e544060`)

`backgroundColor` was the wrong word for a field, because the kit had already given that word to
the card. The rename is a **pure rename — no mechanics moved**, same per-variant recipe:

```tsx
- <Input     backgroundColor="rose" tone="blue" />   // a field on rose, still focusing blue
+ <Input     fillTone="rose"        tone="blue" />

- <Textarea  backgroundColor="rose" />
+ <Textarea  fillTone="rose" />
```

- **Renamed** `backgroundColor` → `fillTone` on: `Input`, `Textarea`, `Select`, `SearchBar`,
  `InputGroup`, `InputOtp`. `PasswordInput` and `SlugInput` inherit it (`…Props extends
  InputProps`, props spread into `<Input>`) — nothing to do there.
- **New** `inputFillTone` on composites that render fields: `Picker`, `TagPicker`, `Combobox`,
  `SmartInput`, `DatePicker`, `KeyValueArrayField`, `DynamicFormField`, `VariablePicker`. New, not
  renamed: those controls' inner field used to follow `tone` and had no fill dial of its own.
  Mirrors the `inputVariant` / `inputClassName` pair those composites already carry.
- **Unchanged on purpose:** `Panel`, `StatCard`, `MultiSelectPanel` keep `backgroundColor`. Two
  names meaning two things *is* the distinction — `VariablePicker` is a card holding a search
  field, and it needs the two words to mean different things. Same for `StatGraphTile`,
  `MarkdownEditor`, `Gantt/*`, `Terminal/*`, `CustomColorSwatches`.

Sweep for stragglers before starting new work, and read each hit rather than trusting the count:

```bash
grep -rn "backgroundColor=" react/demo react/src docs --include="*.tsx" --include="*.mdx" \
  | grep -viE "panel|statcard|multiselectpanel|statgraphtile|gantt|terminal|markdown|colorswatch"
```

A hit on a card is correct; a hit on a field is a missed caller; a hit on a composite is a caller
that was never painting anything.

## 3. The queue — controls that have fields and no fill dial

All eight render a real field today. Add `inputFillTone`; add `inputTone` only where the caller has
a reason to disagree with the container on the fields' *accent* too (a control that is mostly a
card around one search box, like `SplitView` or `SideMenu`, wants both — otherwise the field can
agree on paint and still disagree on focus).

| Control | The field(s) it renders | Add |
| --- | --- | --- |
| `FilterBar` | `SearchBar` (`FilterBar.tsx:392`), `Input` (`:520`, `:561`) | `inputFillTone`, `inputTone` |
| `SplitView` | `SearchBar` (`SplitView.tsx:1155`) | `inputFillTone`, `inputTone` |
| `Chat` | `Select` (`Chat.tsx:711`), `Input` (`:893`, `:945`) | `inputFillTone`, `inputTone` |
| `SideMenu` | `Input` (`SideMenu.tsx:1967`) | `inputFillTone`, `inputTone` |
| `Table` | `Select` (`Table.tsx:2983`) | `inputFillTone` |
| `TaskBoardColumnEditor` | the editor's `Input`/`Select` in `TaskBoardColumnEditor.tsx` | `inputFillTone` |
| `SmartGridLayout` | `Input` (`SmartGridLayout.tsx:3521`) | `inputFillTone` |
| `SmartGridItemPalette` | `Input` (`SmartGridItemPalette.tsx:137`) | `inputFillTone` |

Check the line still points where it did — these files move. If the control has no `tone`/`color`
prop at all (`SmartGridItemPalette`), it still gets `inputFillTone`: the fill can be a caller's
decision even when the accent is not.

## 4. Which prop a control gets

1. Does the control paint the surface the user types into? → `fillTone`, straight into
   `getInputVariantTokens`' `options`.
2. Does it *contain* fields? → `inputFillTone`, mapped into the same option.
3. Do its nested fields' focus/ring/caret need to disagree with the card? → also `inputTone`,
   resolved once as `const fieldTone = inputTone ?? tone;` and handed to the fields.
4. Does it paint a card? → `backgroundColor` stays as it is. Do not rename it, and do not route
   the fill through it.

## 5. The recipe, one control at a time

1. **Declare** the prop beside `inputVariant` / `inputClassName`, with a docstring that names what
   it moves and what it refuses to move. Copy the voice from `Input.tsx`'s `fillTone`.
2. **Forward** it correctly: composite → composite forwards **`inputFillTone`** (a composite that
   owns a composite must hand the word down, or the inner rows silently keep the old behaviour);
   composite → `<Input>` / `<SearchBar>` / `<Select>` passes **`fillTone`**.
3. **Accent**, if added: `const fieldTone = inputTone ?? tone;` once, near the other derived
   values; `tone={fieldTone}` / `color={fieldTone}` on the nested fields only. Chips, tabs, tiles,
   badges and card chrome keep `color={tone}`.
4. **Playground** (mandatory — anything visual needs a live judge): a `HueControl` per prop, above
   the existing tone control, with `autoLabel="Auto — the card's accent"`. See
   `react/demo/src/kit-docs/components/key-value-array-field/KeyValueArrayFieldPlayground.tsx`.
   Add the prop to the page's API table too.
5. **Contract**: a row in `react/src/components/fieldFamilyFillContract.test.tsx` — `draw` renders
   the control with hue and tone deliberately disagreeing, `open` reveals any popup. Popups portal
   into `document.body`, so the scans walk the body; a closed popup proves nothing.
6. **Prove the test has teeth**: replace `inputTone ?? tone` with `tone` and `inputFillTone` with
   `undefined`, confirm *exactly* the new tests redden, restore. A green suite that stays green
   through the sabotage is not a test.
7. **Build before trusting anything**: `cd react && TMPDIR=/home/cjlapao/code/cjlapao/ui-kit/.tmp/vitest-tmp npm run build`,
   then the suites. `themeSafelist.test.ts` asserts against `react/dist/index.css`, so a stale
   `dist` validates the previous change. Same `TMPDIR` for every `npx`/`vitest`/`tsc`.

## 6. Mistakes already paid for — do not rediscover them

- **A row inside a popup washes with `POPUP_ROW_WASH`** (`common/theme/Theme.ts`), never with a
  hardcoded `hover:bg-neutral-50 dark:hover:bg-neutral-800/60`. A card is a blend, and in dark a
  neutral `simple` card lands on `neutral-800` — a step there is invisible; only a blend from the
  light end of the scale reads on every base. Adding rows to `Picker`/`TagPicker`/`Combobox`/
  `VariablePicker`/`DropdownMenu`/`Table`'s menus means using the constant.
- **Don't assert a token that no longer exists.** A `not.toContain("bg-neutral-50")` of a retired
  literal cannot fail. Assert against the constant (`popupRowWash.test.tsx` does) so a retune
  retunes the assertion instead of vacating it.
- **Use the real prop names in tests.** `SearchBar`'s hue prop is `color`, not `tone`; a contract
  row that passes a nonexistent prop passes on the kit's default blue and proves nothing.
- **A checkbox's accent is whole-field.** Its checked fill *is* its accent, so `inputTone` paints a
  blue tick on a neutral field. That is the intended reading — the checkbox is one of the fields.
- **Don't rename a card's `backgroundColor`** to look consistent. The name difference is the design.
- **Popups portal into `document.body`.** A leak scan that walks the render container sees nothing.
- **`vue/src` stays deferred.** Mirror the React prop list when the port comes; don't invent a
  second answer while it waits.

## 7. Done, for one control

- The prop renders a field whose fill answers the caller and whose states answer `tone` (or
  `inputTone`), on a white card and on a tinted one, in both schemes.
- A playground control exists and the API table lists the prop with its default.
- One contract row, mutation-verified; `npm run build` green; `themeSafelist`, the control's own
  suite and `popupRowWash` green.
- No new `bg-*` literal in the component where the theme already owns that paint.

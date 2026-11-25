# The field's fill hue — `fillTone` and `inputFillTone`

**Status:** approved 2026-11-25
**Supersedes the prop name in:** [`2026-11-24-input-background-tone-override-design.md`](./2026-11-24-input-background-tone-override-design.md), which introduced the behaviour as `backgroundColor`
**Plan:** [`../plans/2026-11-25-field-fill-tone-override.md`](../plans/2026-11-25-field-fill-tone-override.md)

## Why the name had to move

`backgroundColor` was a good name for `Input` and a bad name for the family. Two things went wrong once it spread.

It means **card** on every Panel-based component — `Panel`, `StatCard`, `MultiSelectPanel` all take `backgroundColor?: TrueColor` for the container's fill, and `common/theme/Theme.ts` now holds both meanings a few hundred lines apart. `VariablePicker` is where the collision becomes visible: it is a card (`variant?: SurfaceVariant`, `panelTone`, `corner`, `raisedSurface`) that contains a `SearchBar`, so `backgroundColor` on it would have read as "the card" while doing something to the search box.

And *fill* is ambiguous inside a composite. `Picker` paints a trigger, an option list and a card; `TagPicker` adds pills; `DatePicker` adds a calendar. "The background" does not say which.

## The rule

**`fillTone` paints the field's fill and nothing else.** Every other hue prop keeps exactly the surface it owns today — `tone` the affordances, `itemColor` the pills, `panelTone`/`panelVariant`/`panelCorner`/`raisedSurface` the cards. A rose `Picker` therefore rests in rose and still opens a neutral menu until you ask for `panelTone`. This is the same rule the 2026-11-24 spec settled, including the `ghost` hover rim staying in `tone`: a state class earns its hue from whatever the state answers to, and the pointer and the keyboard answer to the tone.

## Naming

The kit's hue props are all accent words — `tone` drives six decisions, and `color` is literally an alias for `tone` on six components — so the prefix has to carry the meaning. Two shapes are already established: `gradientFrom` and `glowIntensity` each take **one decision** off `tone`, and `inputVariant` / `inputClassName` name a prop that belongs to the input *inside* a composite. So:

- **`fillTone`** — the control *is* the field. Names the decision, not the surface.
- **`inputFillTone`** — the control *has* a field among other surfaces. The prefix says which.

A component with two inputs shares one value across them; the prop is per-component, not per-control.

The theme keeps a single decision name — `InputVariantOptions.fillTone` — and composites map theirs into it, exactly as `inputVariant` maps into the getter's `variant`. `Panel`'s `backgroundColor` is untouched: the rename's whole purpose is that one word stops meaning two things.

Rejected: `fillColor` (owned by the chart family for the area under a line, `chart/props.ts:36`), `fieldTone` (next to `tone`, on a component with no panel, it reads as two names for one thing), `fieldColor` (`color` means accent here), `backgroundTone` (still reads as card), `surfaceColor` (`SurfaceTone` is already a type for panel tones).

## Catalog A — components

| component | prop | holds | must never move |
|---|---|---|---|
| `Input` | `fillTone` | the field box's `bg-*` at the variant's recipe | focus border/ring, icon colours, glow, validation border, DOM attrs |
| `Textarea` | `fillTone` | as `Input` | as `Input`, plus the resize handle |
| `Select` | `fillTone` | the wrapper box the surface lives in | the caret; `[&>option]` leading and colour — the option list belongs to the browser |
| `SearchBar` | `fillTone` | the bar box | search icon, clear and submit buttons, glow (`color`, `glowIntensity`) |
| `InputGroup` | `fillTone` | the group box — children render `unstyled` (`InputGroup.tsx:143`), so it is the only thing painting | add-on buttons and chips, `tone` states |
| `InputOtp` | `fillTone` | every cell, one shared value | the focused cell's border and ring, caret, separators |
| `PasswordInput` | inherited | box, through `Omit<InputProps, …>` | reveal button and its ring |
| `SlugInput` | inherited | box, through `extends InputProps` | lock affordance, regenerate button |
| `Picker` | `inputFillTone` | the trigger box only | option hover and selected states (`tone`), the dropdown card, the chevron |
| `TagPicker` | `inputFillTone` | the trigger box only | tag pills (`itemColor`), the `+n` overflow chip, the dropdown card |
| `Combobox` | `inputFillTone` | forwarded to its inner `<Input>` | the body Panel, option rows |
| `SmartInput` | `inputFillTone` | the trigger field | the suggestions panel and its rows |
| `DatePicker` | `inputFillTone` | the field box | the calendar card, today and selected day cells, clear and today buttons |
| `VariablePicker` | `inputFillTone` | the inner `SearchBar`'s box, nothing else | the card (`variant`, `panelTone`, `corner`, `raisedSurface`), row hover and selected (`tone`), the missing-value rose |
| `IdentityPicker` | `inputFillTone` + `inputTone` | the three fields nested in the card — emoji search, category select, initials input — one shared value each: the fill's hue and the accent their states answer | the card (`variant`, `tone`, `raisedSurface`), emoji tiles and their selected ring, category chips, the segmented tabs, the dropzone |
| `KeyValueArrayField` | `inputFillTone` + `inputTone` | both inputs of every row, shared — the fill's hue and the accent their states answer | the add button and headings (`tone`), the remove button's semantic rose, the help block |
| `DynamicFormField` | `inputFillTone` + `inputTone` | every field it renders — `shared`, the checkbox **and** the Map branch (forwarded down to the nested `KeyValueArrayField`) | the `MultiSelectPanel` container, label and description colours, validation border |

## Catalog B — theme and tests

| file | change |
|---|---|
| `common/theme/Theme.ts` | `InputVariantOptions.backgroundColor` → `fillTone`, surgically — `getPanelToneStyles`' `backgroundColor` is the card and keeps its name |
| `scripts/generate-safelist.mjs` | the comment naming the producer; no shape is new, so no `@source inline` line |
| `react/src/theme/inputVariants.test.ts`, `themeSafelist.test.ts` | option key and `describe` rename |
| `Input.test.tsx`, `PasswordInput.test.tsx`, `SlugInput.test.tsx` | prop rename in the existing fill cases |
| **new** `react/src/components/fieldFamilyFillContract.test.tsx` | 18 rows × five assertions, `expectFillOnly` defined once |

## Catalog C — demo

input / textarea / select Playground + Page: rename. picker, tag-picker, combobox, searchbar, smart-input, input-group, input-otp, password-input, slug-input, datepicker, key-value-array-field, dynamic-form-field, variable-picker (26 files): add a `HueControl` labelled **Fill tone** on the fields and **Input fill tone** on the composites, under Tone, plus an API row after `variant`/`tone` ending with the card-is-`panelTone` sentence. `input/examples/FillVsTone.tsx` renames; **new** `tag-picker/examples/FillVsPills.tsx` is the composite case where the difference is visible — rose trigger, `itemColor` pills, neutral menu.

## Catalog D — not touched

`Panel.tsx`, `StatCard.tsx`, `MultiSelectPanel.tsx`, `StatGraphTile.tsx`, `Toolbar.tsx`, `Terminal/*`, `Gantt/*`, `TraceGraph/*`, `MarkdownEditor.tsx`, `CustomColorSwatches.tsx`, `chart/*`, `common/theme/nestedPanel.ts`, the Panel tests, and the gantt / stat-card / multi-select-panel / trace-graph demo pages: `backgroundColor` there means a card or an inline style, not a field fill. All of `vue/src` stays deferred by record; the React suite is the portable contract and the rename lands there when the port does.

## The contract

The rule is worth nothing if it is only prose. `fieldFamilyFillContract.test.tsx` runs every component in Catalog A through five assertions with `tone="blue"` and the fill hue `rose`:

1. the field box carries the hue's `bg-*` paint at its variant's recipe;
2. strip the `bg-*` colour utilities from that box's class list and no `-rose-` survives — the structural form of "only the fill moved", which is what would have caught the hover-rim bug the day it shipped;
3. the tone's affordances are intact (`focus-within:border-blue-400`, `ring-blue-400/60`);
4. where there is a popup, opened and not merely rendered, its root contains no trace of the hue — so `TagPicker`'s pills and `VariablePicker`'s card are checked where they live;
5. the prop never reaches the DOM as an attribute on the inner `<input>`.

Rows are data — a render, whatever setup the widget needs to exist, and an optional popup opener — so a new field-surface component joins by adding a row, and a missing row is a visible gap rather than an invisible one.

## History

The two local commits (`385da752`, `ec195e58`) are unreleased, so they are squashed into one that introduces `fillTone` from the start; a log entry that announces a public prop and renames it before it ships is noise.

*Addendum, same day.* The catalogue had a hole in it, and the playground found it before any test did: `IdentityPicker` is a Panel-shaped card holding three fields (emoji search, category select, initials input) and it appeared in neither Catalog A nor Catalog D — it simply was not thought about, because the audit walked out from the *field* components and this one files itself under identity/upload. It now carries `inputFillTone` on all three nested fields with one shared value, two contract rows (the emoji tab and the monogram tab, since the initials input is not in the DOM until its mode is offered), a playground control and an API row. The lesson for the next pass: the enumeration has to walk the components that *contain* a `getInputVariantTokens` consumer, not the ones that are one. The remaining candidates found that way, none of them yet judged — `FilterBar`, `SplitView`, `Chat`, `SideMenu`, `Table`, `TaskBoardColumnEditor`, `SmartGridLayout`, `SmartGridItemPalette`.

*Addendum II.* `IdentityPicker` also gained **`inputTone`** — the accent the nested fields answer for focus border, ring, caret and `ghost`'s hover rim. Without it the three fields could disagree with the card on their *paint* but not on their *states*, which is half a split: `tone="neutral"` with `inputFillTone="neutral"` gives a neutral card with white fields that still focus grey. The three props together — `tone`, `inputTone`, `inputFillTone` — are what make "neutral card, white fields, blue focus" one line of markup instead of a fork. The rule holds on the new prop too: it moves the fields' affordances and nothing else, so the tiles, chips, tabs, preview and dropzone stay `tone`'s no matter what the fields answer. Proven in `IdentityPicker.test.tsx` by the pair that renders `tone="emerald" inputTone="blue" inputFillTone="neutral"` and checks which element ends up wearing which hue; commenting out the `?? tone` fallback reddens it.

*Addendum III.* `inputTone` generalised the moment it left `IdentityPicker`: `KeyValueArrayField` and `DynamicFormField` took the same third owner, and `DynamicFormField` forwards it into the `KeyValueArrayField` its Map branch renders — a composite that owns a composite still has to hand the word down or the inner rows keep the old behaviour and the split is silently half-done. Three components, three vocabularies, one rule: **the fill's hue and the states' accent are different decisions, and the container's accent is a third.** What the nested fields answer is `inputFillTone` + `inputTone`; what the card answers is `tone`.

The checkbox is where the rule needed stating rather than assuming: a checkbox's accent is not only a focus affordance, it is the *checked* fill (`peer-checked:bg-{tone}-700`). Setting `inputTone` therefore paints a tick blue on a neutral field. That is the intended reading — the checkbox is one of the fields this control renders, so it answers the fields' accent whole, not just its ring — and the test pins the light-mode `peer-focus-visible:ring-blue-500` and its `dark:` `-400` twin rather than one lucky step. Both are the same affordance; the earlier version of that assertion looked for `-400` only and passed nothing because it matched nothing.

Proven the same way each time: render `tone="emerald"` with the fields on blue-and-white, assert the field's box carries no `emerald` token at all while the add button still does, and drop the `?? tone` fallback to watch exactly those tests redden — two in `KeyValueArrayField`, two in the Map branch, one on the checkbox.

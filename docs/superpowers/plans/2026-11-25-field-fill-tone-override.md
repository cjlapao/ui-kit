# Field fill hue — `fillTone` / `inputFillTone` implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-25-field-fill-tone-override-design.md`](../specs/2026-11-25-field-fill-tone-override-design.md)

Rule of the whole change: **the fill hue paints the field's `bg-*` and nothing else; every affordance keeps following `tone`, every card keeps following `panelTone`.** Standalone controls call the prop `fillTone`, composites call it `inputFillTone` and map it into the theme's single `fillTone` option.

## Task 1 — the theme owns one decision name (`common/theme/Theme.ts`)

- [x] `InputVariantOptions.backgroundColor` → `fillTone` (option, docstring, and the three internal reads: the ghost branch's `bgHue`, the post-`glass` override, and `fieldFillFor`'s caller).
- [x] `getPanelToneStyles`' `backgroundColor` **stays** — same file, different meaning, and that separation is the point of the rename. Add a line to the option's docstring saying so, because the two now differ by name only in the reader's memory.
- [x] `scripts/generate-safelist.mjs`: rename the producer named in the comment; no new `@source inline` line (every shape the recipes emit already exists).
- [x] `gate`: `npx vitest run src/theme/inputVariants.test.ts` green after the option key is renamed in `inputVariants.test.ts` and `themeSafelist.test.ts`.

## Task 2 — the controls that *are* the field (`Input`, `Textarea`, `Select`, `SearchBar`, `InputGroup`, `InputOtp`)

- [x] `backgroundColor` → `fillTone` at every site: decl, destructure, getter options bag, and the prose in the shared docstring.
- [x] `PasswordInput` / `SlugInput` need no source change — they inherit through `Omit<InputProps, …>` / `extends InputProps`; their tests' `getAttribute("filltone")` assertions are what prove it still does not reach the DOM.
- [x] `gate`: `npx vitest run src/components/Input.test.tsx src/components/PasswordInput.test.tsx src/components/SlugInput.test.tsx` green.

## Task 3 — the controls that *have* a field (`Picker`, `TagPicker`, `Combobox`, `SmartInput`, `DatePicker`, `KeyValueArrayField`, `DynamicFormField`)

- [x] Public prop becomes `inputFillTone`; the docstring gains the composite sentence — the card is `panelTone`'s, the pills are `itemColor`'s, this is the field's fill.
- [x] Options bags read `fillTone: inputFillTone` (shorthand breaks: `Picker:394`, `TagPicker:373`, `SmartInput:212`, `DatePicker:527`, `DynamicFormField:245`); JSX sites on inner field controls read `fillTone={inputFillTone}` (`Combobox:576`, `KeyValueArrayField:254/276/471`, `DynamicFormField:327`).
- [x] `DatePicker`: public type lives in `DatePicker/types.ts:115`, forwarded through the options bag — both rename.
- [x] `gate`: `npx tsc --noEmit` clean in `react/`; the composite suites green.

## Task 4 — `VariablePicker` gains the prop (`react/src/components/VariablePicker.tsx`)

- [x] `inputFillTone?: TrueColor` after `panelTone`, docstring in the component's own voice: it paints the search box, **not** the card — the card is `variant`/`panelTone`/`corner`/`raisedSurface`. Name the surprise; do not leave it to be discovered.
- [x] Forward to the `SearchBar` at :255 as `fillTone={inputFillTone}`.
- [x] `gate`: `npx vitest run src/components/VariablePicker.test.tsx` green.

## Task 5 — the family contract (`react/src/components/fieldFamilyFillContract.test.tsx`, new)

- [x] `expectFillOnly(el, { hue, tone })`: strip `bg-*` colour utilities, assert no `-hue-` survives, assert the tone's focus classes are present.
- [x] One row per Catalog A component: render, the setup it needs (`options`, `groups`, `query`), optional popup opener + popup root selector.
- [x] Five assertions per row, including the popup-hue-free one and the no-DOM-attribute one.
- [x] `gate`: run against a **rebuilt** `dist` — `npm run build` first, or the safelist guard is green against a stale stylesheet and means nothing.

## Task 6 — the playgrounds, which is where the gap actually was

- [x] Rename in `input`, `textarea`, `select` Playground + Page.
- [x] Add the `HueControl` — **Fill tone** on fields, **Input fill tone** on composites — under Tone, plus state `useState<TrueColor | undefined>` and pass it to the preview, in the other 13 dirs (26 files).
- [x] API row after `variant`/`tone` in each Page, ending with the card-is-`panelTone` sentence.
- [x] `gate`: `cd react/demo && npx tsc --noEmit` adds no errors in the touched files.

## Task 7 — the composite example (`react/demo/src/kit-docs/components/tag-picker/`)

- [x] `examples/FillVsPills.tsx`: `tone="blue" inputFillTone="rose" itemColor="amber"` — rose trigger, amber pills, neutral menu, so the three hue props are visible as three separate decisions.
- [x] Register in `TagPickerPage.tsx` with an `ExampleCard` whose description names which prop owns what.

## Task 8 — the record

- [x] Add a dated revision to [`2026-11-24-input-background-tone-override-design.md`](../specs/2026-11-24-input-background-tone-override-design.md): the prop is `backgroundColor` no longer, why, and a pointer here.
- [x] `Learnings.md`: the vocabulary lesson — hue props in this kit are accent words, so a per-decision override names the decision (`fillTone`, like `gradientFrom`) rather than the surface, because "surface" is what makes composites ambiguous; update the cross-kit row for the new name.
- [x] `gate`: full `npx vitest run` matches the 8 pre-existing failures at `58f6d4aa` and nothing else; `npx eslint src` clean.

## Task 9 — history

- [x] *Not done as written, and it would have been wrong.* Between the design and this commit another session ran `git reset HEAD~8` on `main` and then `git pull --ff`, which dropped `385da752` and `ec195e58` from the branch — they are orphaned objects now, reachable by SHA, not ancestors of `HEAD`. Their **content** survived into `HEAD` (which still carries the option as `backgroundColor`), re-committed by someone else's `wip` commit along with work that is not mine. There is therefore nothing to squash, and rewriting the six commits now sitting on top of `58f6d4aa` — including another session's `wip` and a version bump — to tidy my own history would be rewriting theirs. This work lands as one commit on top of `HEAD` that renames what `HEAD` introduced.
- [x] The user's in-flight work is still never committed, and there is more of it than at design time: `react/src/components/DiagramFlow/`, `react/demo/src/kit-docs/components/diagram-flow/`, the `export * from "./DiagramFlow"` line in `react/src/components/index.ts` and the `diagram-flow` entry in `react/demo/src/kit-docs/registry.ts` are all deliberately left unstaged. Staged by explicit path, never `git add -A` — `index.ts` and `registry.ts` are the two files where "just add everything" would have shipped half of someone else's component.

# FieldRow height alignment — design

Date: 2026-11-19 · Scope: React only (`react/src`, playground). Vue parity deliberately deferred.
Companion mockups: `.superpowers/brainstorm/2-1795081383/content/` (goal + approaches A/B/C).

## Problem

A toolbar row composed today the way `aeon`'s GraphExplorer composes it —
`div.flex.items-end.gap-3` of `FormField`-wrapped fields plus a trailing
`Button` — misaligns as soon as any control is taller than one text line.
A `Picker` whose selected item carries a `subtitle` renders a two-line
trigger; the neighbouring `Combobox` and `Button` stay one line and drift on
the bottom edge; the `Picker` itself jumps height between placeholder (one
line) and selected (two lines).

## Goals

1. Fields (Input/Select/Combobox/…), when placed next to a two-line control,
   grow to the shared height instead of shrinking to their content —
   content vertically centred.
2. The `Picker` trigger reserves its two-line height from the start
   (placeholder/loading states included), so the row never jumps.
3. A composition component (`FieldRow`): drop fields and bare buttons in,
   they auto-size into aligned **label / control / hint** bands — no
   per-control props.
4. Trailing `Button`/`IconButton` join the control band at field height
   (approving user choice: "everything stretches").

## Approaches considered

- **A (chosen)** — `FieldRow` as a CSS grid with three shared bands
  (`grid-template-rows: auto 1fr auto`, `grid-auto-flow: column`); fields
  span the bands via `subgrid`, bare children land in the control band.
  One wrapper aligns everything, uneven labels/hints included.
- B — explicit `lines={2}` on every control, row stays plain flex. Rejected:
  per-control bookkeeping reintroduces the exact bug class (forget one
  control → back to the screenshot).
- C — `flex items-stretch` + context. Rejected: an unlabeled bare button
  cannot know it lacks a label and stretches into the label band.

`lines` survives from B as the standalone escape hatch (§Tokens) — not the
row mechanism.

## API

### `FieldRow` (new, `react/src/components/FieldRow.tsx`)

```tsx
<FieldRow gap="md" className="…">
  <FormField label="Symbol" className="w-80"><Picker items={…} /></FormField>
  <FormField label="Kind" className="w-40"><Combobox … /></FormField>
  <Button color="blue">Explore</Button>
</FieldRow>
```

```ts
export interface FieldRowProps {
  /** Shared gap scale, same semantics as FormLayout. @default "md" */
  gap?: ControlSize;
  children: ReactNode;
  className?: string;
}
```

- Root: `grid` with `grid-auto-flow: column`, `grid-template-rows: auto 1fr
  auto`, `gap-y-2` for band spacing and a column-gap from a toolbar-tight
  ControlSize scale (`xs:gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6
  xl:gap-x-8`; arbitrary utilities in-class are fine — the kit already
  ships `grid-rows-[1fr]`-style utilities).
- `FormField` children are **direct grid items**: `FormField` sets
  displayName, `FieldRow` detects it and provides the row context; the
  FormField root itself carries the cell classes (below). No wrapper div —
  the subgrid element must be the parent grid's item.
- Every other direct child is wrapped in a cell `div` with `[grid-row:2]`
  (control band only).
- Single row, no wrapping (v1 scope); responsive collapse is out of scope.
- Subgrid baseline: Chrome 117+, Safari 16+, Firefox 71+ — acceptable.
- Widths move to `FormField className="w-80"` (it already forwards
  `className`); consumer width-wrapper divs are no longer needed — and would
  break band sharing, so the playground/aeon migration drops them.

### `FieldRowContext` (new, `react/src/contexts/FieldRowContext.tsx`)

`{ inRow: true }` provided by `FieldRow`; `useFieldRow()` helper. Same
pattern as `SurfaceContext`. Exported from `contexts/index.ts`.

### `FormField` (row-aware mode)

Consumes `useFieldRow()`. Inside a row:

- root classes become `grid [grid-row:span_3] [grid-template-rows:subgrid]`
  (+ width/`className`) — FormField **is** the grid item and the subgrid
  container;
- renders exactly three children — label block, control block, notes block
  (notes block only when hint/error/helpText exist) — so subgrid
  auto-placement lands them in bands 1/2/3; the flex-era stretch spacer and
  the `gap-2` are dropped (band row-gaps own the spacing);
- `FormField.displayName = "FormField"` so `FieldRow` can detect its own
  children;
- outside a row: byte-identical to today.

### Tokens — `common/theme/Theme.ts` (re-exported by `react/src/theme`)

```ts
/** Literal min-height classes so Tailwind's scan + styles.contract.test.ts
 *  see them: line/padding/border math derived from FIELD_SIZE_STYLES. */
export const FIELD_LINE_MIN_HEIGHTS: Record<ControlSize, Record<1 | 2, string>>;
export const getFieldMinHeightClass = (size: ControlSize, lines: 1 | 2): string;
```

md/2-lines = `min-h-[54px]` (20+16 text lines + 8+8 py + 1+1 border). One
source of truth, static strings, no runtime calc.

### `lines?: 1 | 2` prop — standalone escape hatch

On `Input`, `Select`, `Combobox`, `SearchBar`: applies
`getFieldMinHeightClass(size, lines)` to the trigger box. Outside any row
this is the only way to reserve two lines; inside a row it merely floors the
band (taller siblings still win).

### `Picker` — auto-reserve + override

`lines?: 1 | 2`. Resolution: explicit `lines` wins, else
`items.some(i => i.subtitle != null || i.body != null) ? 2 : 1`. The trigger
root gets the min-height token in **all** states (placeholder, loading,
selected), so nothing jumps. `lines={1}` opts out. Async-loaded items that
only gain subtitles after load: consumers pass `lines={2}`.

### Controls grow into the band

Via `useFieldRow()`: inside a row the trigger box gets the same `h-full`
the existing `fullHeight` prop gives it (`items-center` is already on these
boxes). Wired into: `Select`, `Combobox`, `SearchBar`, `TagPicker`,
`DatePicker`, `SmartInput`, `Textarea`, `PasswordInput`, `InputOtp`;
`Input` and `Picker` map the context onto their existing `fullHeight`.

### `Button` / `IconButton`

No context consumption: the bare-child cell is a flex row, and flex's
cross-axis stretch sizes the button to the control band for free — no
`h-full` class, no risk of a portalled menu button elsewhere in the tree
being stretched by accident. Variants, padding and standalone sizing
untouched.

## Testability

- `data-field-row` on the `FieldRow` root (contract-prefix rules: no new CSS
  prefix needed — all layout is Tailwind utilities).
- jsdom measures no pixels: tests assert classes/structure —
  band/cell classes per child kind, spacer-less three-child FormField in
  row mode, `h-full` on each control in/out of a row, Picker reserve
  matrix (items with/without subtitle/body, explicit lines 1/2),
  `FIELD_LINE_MIN_HEIGHTS` shape + contract test green.

## Playground (react/demo kit-docs)

- New `field-row` docs page, same format as sibling pages (registry entry,
  PageHeader, playground, before/after sections, prop tables, a11y topic):
  reproduces the GraphExplorer toolbar — misaligned plain-flex vs
  `FieldRow` — plus band demos (uneven labels/hints, bare button, `lines`
  escape hatch).
- "In a row" cross-example on the **Picker, Combobox, Select and Input**
  pages (same example format as their existing examples), showing that
  control inside a `FieldRow` beside two others — the pattern is
  discoverable from any of them.

## Consumer migration (aeon, separate repo/repo PR)

```diff
-<div className="flex flex-wrap items-end gap-3">
-  <div className="w-80 max-w-full"><FormField label={…}><Picker …/></FormField></div>
-  <div className="w-40 shrink-0"><FormField label={…}><Combobox …/></FormField></div>
-  <Button …>Explore</Button>
-</div>
+<FieldRow gap="sm">
+  <FormField label={…} className="w-80"><Picker …/></FormField>
+  <FormField label={…} className="w-40"><Combobox …/></FormField>
+  <Button …>Explore</Button>
+</FieldRow>
```

## Out of scope

Vue port (parity follow-up), row wrapping/responsive collapse,
`MultiToggle`/`Toolbar` changes, pixel-level tests.

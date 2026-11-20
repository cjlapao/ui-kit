# IconToggleGroup — implementation plan

> Spec: `../specs/2026-11-19-icon-toggle-group-design.md` (approved in session 2026-11-19).
> For agentic workers: implement task-by-task; each task ends with its check green.

**Goal:** a label-free sibling of `MultiToggle` — an icon-only segmented
control whose options are `IconButton`s wearing their own `active` state, on
a Panel-family track. No indicator pill, no measurement, no spring. React kit
only; Vue parity is explicitly deferred.

**Architecture:** the group is a thin radiogroup: it owns the track surface
(`getSurfaceVariantClasses`), the roving-focus keyboard contract and the
selection API, and nothing else. Selection paint rides the theme's existing
`buttonActive.icon` / `buttonActiveHover.icon` slots via a new
`IconButton.active` prop that mirrors `Button.active` one-to-one.

## Task 1: `IconButton.active`

- [x] `react/src/components/IconButton.tsx`: `active?: boolean` prop (JSDoc:
      persistent "on" state, hover suppressed, `accentColor` overrides the
      active colour, glass ignores it), destructured so it never spreads to
      the DOM.
- [x] Active classes resolve through `getButtonActiveClasses(variant,
      accentColor ?? color)` + `getButtonActiveHoverClasses(...)` (dropped
      when disabled/loading); they *replace* the variant's colour classes,
      and the accent hover override stands down while active.
- [x] `IconButton.test.tsx` — "active state" describe: theme-slot paint,
      base-hover suppression, `accentColor` override, disabled keeps fill
      without the hover step, inactive untouched, glass ignores active.

## Task 2: `IconToggleGroup`

- [x] `react/src/components/IconToggleGroup.tsx`: radiogroup around
      `IconButton`s; options `{ value, icon, label?, tooltip?,
      tooltipPosition?, disabled? }`; `aria-label` chain
      `label → tooltip → value`; roving tabindex; arrows wrap and skip
      disabled; Home/End; same-value/disabled clicks are no-ops.
- [x] Track: `getSurfaceVariantClasses(variant, tone)`, uniform `p-1`,
      size-stepped gap, `rounded` shared by track and buttons
      (`"md" | "lg" | "xl" | "full"`, default `"lg"`), `fullWidth` →
      `flex-1`, group `disabled` → `aria-disabled` + dim.
- [x] Active button re-supplies `getSurfaceTriggerTokens(tone).focusRing`
      (the active slot drops the variant's ring); inactive buttons keep
      their own — never two ring colours on one element.
- [x] `IconToggleGroup.test.tsx`: roles/state, click contract, keyboard
      (wrap, Home/End, skip disabled, one tab stop), every
      `SURFACE_VARIANTS` member matches Panel's classes, every `TRUE_COLORS`
      tone paints the active option from the shared theme (no drift),
      `accentTone` targets only the active option, `fullWidth`, naming
      fallbacks, native props land on the group, and the component carries
      **no** indicator/spring CSS variables.
- [x] Exports: `react/src/components/index.ts`
      (`IconToggleGroup`, `ICON_TOGGLE_GROUP_ROUNDED`,
      `ICON_TOGGLE_GROUP_VARIANTS`, prop/option/variant/shape types) and
      `react/src/index.ts` default re-export.

## Task 3: Docs site

- [x] `react/demo/src/kit-docs/components/icon-toggle-group/`:
      `IconToggleGroupPage.tsx` (header, playground, 4 examples, props
      table, a11y sections), `IconToggleGroupPlayground.tsx` (track
      variant / tone / accent / corner / size / full width / disabled /
      one-disabled / panel ladder / glass), `examples/{TrackVariants,
      Tones,Sizes,TooltipsAndDisabled}.tsx`.
- [x] `registry.ts`: entry `icon-toggle-group`, category *Forms*, icon
      `ViewGrid`, lazy page import.

## Checks

- [x] `vitest run` green for `IconToggleGroup` + `IconButton` (65 tests).
- [x] `tsc --noEmit` green for the library (the two `SideMenu` errors
      belong to unrelated WIP in the working tree).
- [x] Demo `vite build` bundles the new page.

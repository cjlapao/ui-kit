# MultiToggle — hideable segments with a jump-safe indicator (`hidden` per option)

Date: 2026-11-26
Components: `MultiToggle` — React (`react/src/components/MultiToggle.tsx`)
**and** Vue (`vue/src/components/MultiToggle.vue`), plus the shared motion layer
(`common/theme/multiToggleMotion.ts`, `common/multi-toggle.css`).

## Problem

The control can already disable one option (`option.disabled` — dimmed, inert to
click and arrow keys) but it cannot remove one without the caller editing the
`options` array, and it cannot *animate the removal* sanely.

Worse, the indicator maths assumes every option renders:

- `activeIndex` is the **raw index into `options`** and `segmentCount` counts
  every non-separator option. Both feed the `fullWidth` even-segment pill maths
  (`translateX(activeIndex * segmentWidth)`), so any option that ever stops
  rendering must desync the pill.
- When the selected option does not render, `updateIndicatorPosition()` bails on
  the missing `activeButton` and leaves the **stale geometry on screen** — the
  pill sits over the wrong segment.
- The `activeWidthStrategy="max"` measuring pass reads `measurementRefs` for
  hidden options too, so a hidden long label would still stretch every segment.
- `optionsSignature` ignores a show/hide flip, so nothing re-measures.

And a hidden *inactive* option that collapses the row must not make the pill
slide across the track; a pill **appearing or vanishing** is a jump, not a
journey.

## Requested behavior

- `{ hidden: true }` on any option — item or separator — takes it out of the
  track completely: no render, no measurement, no tab stop, skipped by arrow
  keys, Home and End. Segments close ranks.
- If the **selected** option is hidden, the pill **jumps out of sight instantly**
  (no cross-track slide) and the group `value` is kept untouched — deciding a
  new value is the caller's job. Un-hiding the option brings the pill back,
  again without sliding in from wherever it last was.
- Per-option `disabled` keeps its current semantics (a selected option stays
  selected, pill and all); the gap was only that neither state is demoable —
  the playground and docs page expose both.
- Both frameworks, React and Vue.

## Design

### 1. API — one new field, both frameworks

```ts
export interface MultiToggleOption {
  value?: string;
  label?: ReactNode;              // VNode union on Vue
  icon?: string | ReactElement;   // VNode union on Vue
  disabled?: boolean;             // unchanged
  /**
   * Takes the option out of the track entirely — no render, no measurement,
   * no tab stop, skipped by keyboard navigation. The group's `value` is never
   * touched: a hidden option may stay the selected one, in which case the
   * indicator is withdrawn until it (or the selection) comes back.
   */
  hidden?: boolean;
  width?: MultiToggleOptionWidth;
  type?: "item" | "separator";
}
```

`hidden` on a separator removes its hairline and its padding exactly as if it
had never been in the array.

### 2. Indicator maths — visible-only

A single derived set replaces the raw `options` everywhere geometry is computed:

- `visibleItems` = options that are neither `type: "separator"` nor `hidden`.
- `segmentCount = Math.max(1, visibleItems.length)` — the all-hidden group
  renders an empty track and clamps like the all-separator guard already does.
- `visibleActiveIndex` = index of the selected value **within `visibleItems`**,
  or `-1`. Two distinct "no pill" sources are kept apart:
  - **`activeHidden`** — the value matches an option, but that option is
    hidden → withdraw the pill (see §3).
  - **unmatched value** — matches no option at all → today's clamp-to-first
    behaviour is preserved verbatim (no breaking change).
- Replaced call sites, React and Vue alike:
  - `indicatorStyle` (fallback): both the even-segment and the percentage
    formula use `visibleActiveIndex` / `segmentCount`.
  - `updateIndicatorPosition()`: reads `optionRefs` at the **visible** index;
    the `usesSegmentLayout` branch and the measured branch both position from
    the visible set. The early return on a missing button no longer strands
    stale geometry, because the hidden case is handled explicitly.
  - `measureMaxWidth` / the hidden measuring layer: hidden options are skipped
    and their `measurementRefs` slots are nulled, so a hidden label never
    feeds `maxOptionWidth`.
  - `hasCustomWidths` is derived from **visible** options only — a hidden
    option's `width` must not push visible siblings into the custom-width
    layout. (When it reappears and flips the layout, the existing signature
    machinery re-measures; the reflow animates.)
  - `optionsSignature` gains `:${option.hidden ?? ""}` so `layoutSignature`
    changes on a hide/show flip and everything re-measures, React
    (`useLayoutEffect` deps) and Vue (`watch` sources) alike.
- Keyboard: `handleKeyDown`'s `selectable` filter gains `&& !option.hidden`.
  Roving tabindex needs nothing — a hidden option renders no button.
- Tooltip overflow labels (`overflowLabels` is indexed by raw index) keep their
  raw-index keying; hidden entries simply stay `undefined`.

### 3. The jump — geometry snaps when the pill appears or vanishes

The pill rides `--mt-offset` / `--mt-width` custom-property transitions
(`common/multi-toggle.css`). Two additions:

```css
@property --mt-opacity {
  syntax: "<number>";
  inherits: false;
  initial-value: 1;
}

/* One frame of no transition: the pill snaps instead of sliding in/out. */
.multi-toggle-indicator[data-mt-jump] {
  transition: none;
}
```

- `getMultiToggleMotionStyle` also emits `"--mt-opacity": "0" | "1"`; the
  indicator span paints `opacity: var(--mt-opacity, 1)`. `--mt-opacity` is
  **not** in `transition-property` — visibility flips are instantaneous by
  definition, and an overshoot easing on opacity would look like a flicker.
- Both frameworks keep the previous pill-visibility state
  (`indicatorVisibleRef`, a `useState`/`ref` mirror of `!activeHidden`) and
  compare it during the layout effect / post-flush watch that already updates
  geometry. Whenever it flips **either way**, that render carries
  `data-mt-jump` on the indicator span — so the geometry variables land
  instantly (no slide-in from the last position, no half-visible cross-track
  glide while fading) — and the attribute is cleared on the next animation
  frame (`requestAnimationFrame`, double-rAF in React to also clear after the
  style commit).
- Normal selection changes between **visible** options keep today's spring
  untouched: the attribute is absent and the custom-property transition runs.
- Hiding an **inactive** option is not a jump: the pill stays visible, the row
  reflows and the existing ResizeObserver / signature machinery glides the
  pill to its new measured offset.
- `prefers-reduced-motion` already kills the transition entirely; the jump path
  is a superset of that, so it needs no extra rule.

### 4. Demos, docs, tests

- **Playground** (`react/demo/.../MultiTogglePlayground.tsx`): in the *Options*
  accordion, one row per segment (`Day` / `Week` / `Month`) with two switches —
  **Hide** and **Disable**. Group-level *Disabled* stays as is.
- **Docs page** (`MultiTogglePage.tsx`): new example card
  "Hiding & disabling segments" (`examples/HiddenDisabled.tsx`, raw-imported
  like its siblings) — a mini toolbar whose buttons hide/disable each option,
  demonstrating the pill jump when the selected one is hidden. `PageHeader`
  copy mentions hidden segments alongside the existing arrow-key sentence.
- **Tests** (mirroring the existing mocks in `MultiToggle.test.tsx` /
  `MultiToggle.test.ts`):
  1. `hidden` option renders no button and no separator.
  2. Selecting a hidden option's value → indicator carries `--mt-opacity: 0`
     and `data-mt-jump`; `onChange` is not fired; the value is preserved.
  3. Un-hiding it → indicator returns to `--mt-opacity: 1` with `data-mt-jump`
     on the flip frame.
  4. `fullWidth` even-segment layout with the **first** option hidden and the
     second selected → pill offset uses visible index `0`, `segmentCount`
     counts two.
  5. Arrow keys, Home and End skip hidden options.
  6. `activeWidthStrategy="max"` ignores a hidden option's width.
- **Out of scope**: auto-clamping `value`, `hidden` + `showOnlyActiveLabel`
  interactions beyond what the visible-set maths gives for free, Vue demo page
  (Vue has no MultiToggle docs page today).

## Files touched

| File | Change |
| --- | --- |
| `react/src/components/MultiToggle.tsx` | `hidden` field, visible-set maths, jump state |
| `vue/src/components/MultiToggle.vue` | mirror of the above |
| `common/theme/multiToggleMotion.ts` | emit `--mt-opacity` |
| `common/multi-toggle.css` | `@property --mt-opacity`, `[data-mt-jump] { transition: none }` |
| `react/src/components/MultiToggle.test.tsx` | cases 1–6 |
| `vue/src/components/MultiToggle.test.ts` | cases 1–6 |
| `react/demo/.../MultiTogglePlayground.tsx` | per-segment Hide / Disable switches |
| `react/demo/.../MultiTogglePage.tsx` + `examples/HiddenDisabled.tsx` | new example card |

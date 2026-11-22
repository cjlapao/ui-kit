# CustomColorSwatches — single/dual colour picker with custom colours

Date: 2026-11-21
Status: approved (React only; Vue port deferred)

## Purpose

A colour control built on the `ColorSwatches` dot idiom that additionally lets
the user add **their own colour** through the OS picker. Two modes:

- **single** — pick one colour from the tone strip or a custom one.
- **dual** — pick a **border/fill colour** for a pill; the **text colour** is
  auto-calculated from it (same hue, opposite lightness end — dark fill →
  light ink, light fill → dark ink) and can be **overridden**. Dual-mode
  swatches carry their hex as text and, `ExpandableButton`-style, expand a bit
  on hover to reveal it.

Brainstorm decisions: general colour control (no tag semantics); filled-pill
preview; hex reveal; OS picker for custom entry; text override via popover on
the selected swatch.

## Scope

- React package + demo playground. Vue port deferred (SlugInput precedent).
- The colour math is framework-agnostic and lands in `common/utils/` so the
  Vue port and the playground can reuse it.
- `ColorSwatches` itself is **not** modified.

New files:

| file | role |
| --- | --- |
| `common/utils/colorMath.ts` (+ `.test.ts`) | pure colour math: hex parse/format, sRGB relative luminance, WCAG contrast ratio, hex ⇆ oklch, AA ink stepper |
| `react/src/utils/colorMath.ts` | re-export mirror (slugify precedent), barrelled in `react/src/utils/index.ts` |
| `react/src/theme/themeColors.ts` | `getTrueColorHex(tone, step, isDark)` over `tailwind-palette.json` |
| `react/src/components/CustomColorSwatches.tsx` (+ `.test.tsx`) | the component |
| `react/demo/src/kit-docs/components/custom-color-swatches/*` | docs page, playground, examples |

Barrel additions: `react/src/components/index.ts`, `react/src/utils/index.ts`,
`react/demo/src/kit-docs/registry.ts`.

## Public API

```ts
/** A colour chosen from the strip: a kit tone (resolved hex) or the user's own. */
export type SwatchColor = { tone: TrueColor | "custom"; hex: string };

/** The dual-mode text colour: the calculated ink, or an explicit override. */
export type SwatchText = { mode: "auto" } | { mode: "custom"; hex: string };

export type SwatchDualValue = { border: SwatchColor; text: SwatchText };

export interface CustomColorSwatchesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** @default "single" */
  mode?: "single" | "dual";
  /** The tones to display. @default TRUE_COLORS */
  colors?: readonly TrueColor[];
  /** Dot ladder, the shared control scale. @default "md" */
  size?: ControlSize;
  /** Controlled value; uncontrolled (internal state) when omitted. */
  value?: SwatchColor | SwatchDualValue;
  /** Initial value for the uncontrolled case. */
  defaultValue?: SwatchColor | SwatchDualValue;
  /** Fired on every committed selection. */
  onChange?: (value: SwatchColor | SwatchDualValue) => void;
  /** Seed for the OS picker before any custom colour exists. @default "#6366f1" */
  defaultCustomHex?: string;
  /** @default false */
  disabled?: boolean;
  className?: string;
}
```

`value` is narrowed by `mode` at runtime: `single` carries a `SwatchColor`,
`dual` a `SwatchDualValue`. A wrong-shape or bad-hex value is treated as
unselected and reports once via `console.warn` (kit precedent:
`warnIfAriaHiddenFocusable`).

For dual mode, the resolved ink for `{ mode: "auto" }` is exported as
`getAutoTextInk(fillHex: string, isDark: boolean): string` from
`common/utils/colorMath.ts` — consumers painting real `Pill`s call the same
function the component uses, so preview and product never drift.

## Interaction

### Shared strip

A wrapping flex row of dots + a trailing **custom swatch**. No `+N`
condensation — a picker shows everything. Dots reuse the `ColorSwatches`
glyph idiom: `getTrueColorDotClass` fill, scale halo on hover, selection ring
`ring-2 ring-offset-2 ring-neutral-900 ring-offset-white` +
`dark:ring-white dark:ring-offset-neutral-900`, focus-visible outline.
The `size` prop uses the same `DOT_CLASS`/`DOT_PX` ladder.

Custom swatch before any custom colour: conic rainbow disc with a `+`.
After: the custom colour inside a faint rainbow rim.

### Single mode

- Click a tone → it becomes the selection (ring), `onChange({tone, hex})`.
- The custom swatch is a `<label>` wrapping a visually-hidden
  `<input type="color">` seeded with `defaultCustomHex` (or the current
  custom hex). Clicking opens the OS picker; `onInput` updates the swatch
  live, `onChange` (commit) selects `{tone: "custom", hex}`. Re-click
  re-opens to edit. An empty/unchanged commit leaves the value untouched.

### Dual mode

- Each dot is a **filled mini-pill**: background + border = the colour, and
  its **hex as text** in `getAutoTextInk` of that fill. At rest it reads as a
  dot (label hidden, `0fr` grid track, `ExpandableButton`'s reveal trick); on
  hover/focus the track springs to `1fr` and the hex slides out. The selected
  swatch stays expanded and carries the selection ring.
- Click an unselected swatch → select border, `text` resets to `{mode:"auto"}`
  for the new fill, popover closes.
- Click the **selected** swatch → toggle the **"Text colour" popover**,
  anchored via `useAnchoredPopupPosition` (same infra as other kit popups):
  - **Auto** chip: half-filled disc showing the current calculated ink;
    `aria-pressed` when text is auto; clicking restores `{mode:"auto"}`.
  - Tone dots for `colors` + the rainbow custom dot (own hidden
    `<input type="color">`); picking one sets `{mode:"custom", hex}`.
  - Escape / outside click closes; focus returns to the trigger.
- While text is overridden, the selected pill keeps an affordance cue: dotted
  underline under the hex + `aria-label` naming the override.
- Reduced motion (`prefersReducedMotion()`): no reveal animation — hex text
  always shown, popover without slide.

## Auto-ink rule (`getAutoTextInk`)

1. Parse fill hex → sRGB relative luminance `L`. `L < 0.42` → light ink,
   else dark ink (WCAG midpoint).
2. **On-palette for kit tones** (fill is a palette step): light ink = the
   first of that hue's `{100, 200, 300}` steps with WCAG ratio ≥ 4.5 vs the
   fill; dark ink = first of `{700, 800, 900}`; if none qualifies take
   `50`/`950`.
3. **On-hue for custom hexes**: hold hue and chroma in oklch, step lightness
   outward (toward 0.95 or 0.25) in 0.02 ticks until the ratio reaches 4.5;
   clamp at the ends; if still short (pathological mid-tone), fall back to
   `#ffffff` / `#000000` by luminance direction.
4. The function is pure and deterministic; the same input always yields the
   same ink.

`getTrueColorHex(tone, step, isDark)` resolves kit steps through
`tailwind-palette.json` (oklch strings → hex), mirroring the component's fill
choice: `500` in light, `400` in dark (`useIsDarkMode`). Custom hexes are
literal in both schemes.

## Accessibility

- Strip: `role="group"`, `aria-label="Colour swatches"` /
  `"Border colour"` (dual). Dots: real buttons, `aria-pressed`,
  `aria-label` = tone name or hex (`"Custom colour"` for the custom one).
- Popover: `role="group"` `aria-label="Text colour"`, Escape-closable, focus
  returned to trigger. Hidden colour inputs stay focusable and keyboard-
  reachable (Enter opens the OS picker).

## Tests

- `common/utils/colorMath.test.ts`: hex parsing (`#rgb`, `#rrggbb`, case);
  luminance of known values; step-pick matrix — all 21 tones × both schemes
  × chosen ink assert ratio ≥ 4.5; hue-sweep over custom hexes (every hue at
  lightness 0.1–0.9) asserting AA or the documented `#fff`/`#000` fallback;
  determinism.
- `CustomColorSwatches.test.tsx` (RTL, mirroring `ColorSwatches.test.tsx`
  style): 21 dots + custom render; tone select → `onChange` payload;
  custom `input`/`change` events; dual: select keeps pill expanded with hex;
  second click opens popover; Auto chip restores auto; tone pick overrides;
  Escape closes; guarded value warns and renders unselected; disabled blocks.

## Out of scope

- Vue port (follow-up), `+N` condensation, shade-grid picking, alpha/opacity,
  preset palettes beyond the kit tones, i18n beyond existing kit strings.

# Panel attention pulse — design

Date: 2026-11-20
Status: approved by user (hue: follow the active accent rule `borderColor ??
tone ?? blue`; `disabled` wins — pulse off; approach A: sibling
`.panel-pulse` block mirroring the pill; "implement option A, update the
playground")
References: `react/src/styles.css` (`---- Pill attention pulse ----` section,
`.pill-pulse`, `@keyframes pill-pulse`, the reduced-motion static glow),
`react/src/components/Pill.tsx` (`pulse` prop, `pulsing = pulse &&
!disabled`, the `--pill-glow`/`--pill-glow-dark` inline custom-property
precedent), `react/src/components/Panel.tsx` (`activeHue` accent rule,
`resolvedStyle`, section classNames), `react/src/components/Pill.test.tsx`
(`describe("pulse")` — the assertion shape this mirrors)
Scope: **React kit only** (`@cjlapao/ui-kit`); the Vue panel stays as it is
and the divergence is recorded in `Learnings.md`, as the active-state row
(2026-11-19) records its own.

## Why

The Pill already knows how to be the thing the eye lands on: `pulse` glows
INWARD from its own rim — an inset box-shadow swell, clipped to the
border-box, so the attention call never spills into the layout. The Panel has
the same neighbourhood problem (a card among cards must announce itself) but
no such call. The ask is explicit: the same treatment, same way, inwards.

## Decisions taken in conversation

- **Hue: the active accent rule** (user pick, over tone-only and a dedicated
  `pulseColor` prop). The glow wears `borderColor ?? tone`, with the kit blue
  as floor when untinted — the exact `activeHue` the active rim resolves, so
  on a card that is both selected and pulsing the rim and the glow always
  agree, and an untinted card pulses in blue, never gray.
- **`disabled` wins — pulse off** (user pick, the Pill's own reasoning kept
  verbatim: an attention call on a card the app has dimmed is a
  contradiction). This is deliberately *unlike* the active rim, which stays
  legible under the disabled veil: selection is information, the pulse is a
  demand, and a dimmed card may not demand.
- **Technique: sibling `.panel-pulse` block** (approach A, over a shared
  `.ui-attn-pulse` utility and over Tailwind's `animate-pulse` overlay).
  The Pill ships; retrofitting it to a shared class would rename a public
  styling knob (`--pill-glow`) and put a working feature under test for no
  real saving — the duplication is one colour-agnostic keyframes block, and
  each component's CSS comment stays honest about its own surface
  ("re-composite the ring" means different things on a pill's `shadow-sm`
  than on an `elevated` card's `shadow-xl`).
- **The glow is the section's own inset box-shadow** — the same mechanism
  that made the pill's right choice: inset shadows are the element's own
  paint, unaffected by the Panel's `overflow-hidden`, clipped to the
  border-box, and follow the corner radius (`corner` knob) natively. It
  coexists with everything the Panel already layers because it touches no
  property any of them touch: the hover wash and pressed step are
  `background-color`, the active rim is `outline`, the pulse is
  `box-shadow`. A card can be hovered, pressed, selected and pulsing at
  once, and all four read.
- **Hue rides as custom properties, not class shapes.** The component sets
  `--panel-glow: var(--color-{hue}-500)` and `--panel-glow-dark:
  var(--color-{hue}-300)` inline (the Select-accent precedent the Pill
  follows); the keyframes stay colour-agnostic. Consequences: no per-tone
  class shapes, **no safelist work**, and a new tone needs no CSS of its
  own. The `--color-{c}-500`/`-300` theme variables are already emitted for
  all 21 tones (the hover-rim and active-rim safelist shapes consume
  `-500`; the pill family consumes the rest).
- **Dark theme rides a step brighter** (`-300`): the variants' dark fills
  are dark, the same reason the pill's dark rim light rides `-300`.

## Shape

### `react/src/styles.css` — new section after the pill's

```css
.panel-pulse {
  --_panel-glow: var(--panel-glow, currentColor);
  animation: panel-pulse 2s ease-in-out infinite;
}
:where(.dark) .panel-pulse {
  --_panel-glow: var(--panel-glow-dark, var(--panel-glow, currentColor));
}
@keyframes panel-pulse { /* 0%,100% → 55% → 0%,100% */ }
```

- The swell matches the pill's: `inset 0 0 0 0 color-mix(… 55%)` at rest →
  `inset 0 0 10px 3px color-mix(… 38%)` at 55%, 2s `ease-in-out` infinite.
  The alpha lives in `color-mix`, the colour in the variable.
- Every keyframe stop re-composites the five Tailwind shadow variables
  (`--tw-inset-shadow`, `--tw-inset-ring-shadow`, `--tw-ring-offset-shadow`,
  `--tw-ring-shadow`, `--tw-shadow`, each with `0 0 #0000` fallbacks) before
  the inset entry — a running keyframe wins over the plain declarations that
  paint `elevated`'s `shadow-xl ring-1 ring-black/5`, the subtle/tonal rings
  and the clickable card's focus ring, so all of them survive the glow.
- `@media (prefers-reduced-motion: reduce)`: `animation: none` and a static
  `inset 0 0 7px 2px color-mix(… 32%)` glow, so reduced-motion users still
  see *which* card matters — the pill's contract exactly.

### `react/src/components/Panel.tsx`

- `pulse?: boolean` prop, `@default false`, JSDoc in the file's voice:
  glows inward from the rim in the accent hue, never spills into the layout,
  on while set, off while `disabled`, reduced-motion keeps a static inner
  glow; the hue is the accent rule shared with the active rim.
- `const pulsing = pulse && !disabled;` beside the active-state derivations.
- Hue: reuses `activeHue` (`borderColor ?? (tone === "none" ? "blue" :
  tone)`) — one accent rule, one source.
- `resolvedStyle` gains, only while `pulsing`, the two custom properties
  (spread-as-cast, the Pill's idiom), so a caller's own `style` is preserved.
- Section `classNames` gain `pulsing && "panel-pulse"`, next to `activeRim`.
- No `data-pulse` attribute: the pulse is a transient visual the caller set
  by hand, not a state to style against from outside (the Pill publishes no
  hook either; `active` got `data-active` because selection is *computed*
  context).

### Coexistence matrix (asserted, not assumed)

| already on the card | pulse |
| --- | --- |
| `active` rim (outline) | glow + rim both paint; same hue by construction |
| hover wash / pressed step (`background-color`) | all paint; different property |
| `elevated` `shadow-xl`/ring, subtle/tonal rings, focus ring | re-composited inside the keyframe |
| `disabled` | pulse off (class and custom properties absent) |
| glass / liquid-glass fills | pulses — the halo is a box-shadow, a translucent fill suits it |

## Tests

Mirror of `Pill.test.tsx › pulse`, on the `section`:

1. off by default — no `panel-pulse` class, `--panel-glow` unset.
2. on at a tone — class present; `--panel-glow` = `var(--color-cyan-500)`,
   `--panel-glow-dark` = `var(--color-cyan-300)`.
3. accent rule — untinted → `var(--color-blue-500)`; `borderColor="rose"`
   over `tone="cyan"` → rose.
4. `disabled` wins — class and custom properties absent.
5. `active` + `pulse` — `outline-2` and `panel-pulse` both present.
6. pulses on `glass` and on `liquid-glass`; pulses while clickable (the
   focus ring's class still present).
7. stylesheet contract — `styles.contract.test.ts` gains `"panel-"` to
   `CONTRACT_PREFIXES` (the `pill-` precedent), so the raw hook the component
   emits cannot ship without its rule inside `styles.css`'s closure; the
   keyframes/reduced-motion contract lives in the stylesheet, guarded by
   that rule requirement, exactly as the pill's does (the component suite
   asserts class + custom properties, never media queries — jsdom cannot
   simulate `prefers-reduced-motion`, and the pill suite doesn't pretend to).

## Playground & docs

- `PanelPlayground.tsx`: a `Pulse` `ToggleRow` in the States group, wired to
  the prop (user explicitly reminded: do not forget the playground).
- `docs/test_suites/panel.md`: the pulse cases as `TC-PNL-049`… (append-only).
- `Learnings.md`: a dated Cross-kit row — React-only, Vue knowingly lags,
  and the no-safelist-needed consequence of riding hue on custom properties.

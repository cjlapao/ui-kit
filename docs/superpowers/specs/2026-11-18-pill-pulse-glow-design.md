# Pill attention pulse — design

**Date:** 2026-11-18 · **Component:** `Pill` (React + Vue kits) · **Status:** approved

## Problem

Pills label state; nothing in the family can *call attention*. Apps need a
way to make one pill the thing the eye lands on (a live incident, a pending
action) without inventing per-app CSS.

## API

```
pulse?: boolean   // default false
```

One boolean, both kits (`onClick`-style prop on React, plain prop on Vue).
Always-on while set — it is an attention call, not an entrance.

## Look

A breathing halo in the pill's own tone: `box-shadow` swells from the edge
(~45% alpha at rest → soft 12px blur + 4px spread at ~55% of a 2s
ease-in-out cycle) and settles back. Same colour family as CondensedStepper's
`DISC_DIFFUSION` — a mid-lightness step of the tone — so blue breathes blue.

## Colour plumbing

The component sets `--pill-glow: var(--color-{tone}-500)` (and
`--pill-glow-dark: var(--color-{tone}-400)`, preferred inside `.dark`)
inline — the `Select` accent precedent. The keyframes in `styles.css`
(both kits) are colour-agnostic, so: **no safelist additions, no hand-written
per-colour map** (the Learnings rule), and the alpha comes from
`color-mix(in srgb, … , transparent)` inside the keyframes.

The keyframes re-composite the Tailwind shadow variables
(`--tw-ring-shadow`, `--tw-shadow`, …) ahead of the glow so a keyframe-animated
`box-shadow` never hides the `focus-visible` ring or `solid`'s `shadow-sm`.

## Coverage

- Label pills and `dot` (the live-status case), all five variants — a
  box-shadow reads fine over a glass fill.
- Suppressed while `disabled` (an opacity-50 ghost must not breathe).
- Stacks with `onClick` (the ring still composites; see above).

## A11y

`prefers-reduced-motion: reduce` zeroes the animation and leaves a faint
static glow, so the pill still reads as *the one that matters* without motion.
The pulse is styling only — no new accessible name or live region; it never
conveys meaning text can't carry on its own (same rule as `animate-pulse`
use elsewhere in the kit).

## Tests

React (`Pill.test.tsx`) and Vue (`Pill.test.ts`, new file — Pill had none):
default off; `pulse` adds the class and the `--pill-glow` custom property
naming the tone; suppressed when `disabled`; the dot form pulses.
`pill-` joins `CONTRACT_PREFIXES` (source contract test + dist check), with
the one comment token that would false-positive rephrased.

## Playground

*Pulse* `ToggleRow` in the Pill playground's States group (wired to the dot
too), an `AttentionPulse.tsx` example, and a `pulse` row in the page's
PropsTable. The React demo must be served against a rebuilt
`react/dist/index.css` (styles.css is consumed from the build).

## Amendment — the pulse turned inward (same day)

The outward halo painted over neighbouring content, so hosts needed padding
to absorb it. The animated layer is now an **`inset`** box-shadow (rest →
`inset 0 0 10px 3px` at 38% alpha at 55% of the cycle): clipped to the
border-box, so the attention call has zero layout effect. A rim light must
out-light a dark fill, so `--pill-glow-dark` rode from `-400` to `-300` —
solid's dark fill is `-400`, and at `-400` the inward glow was invisible
exactly where attention is called. Dots read as breathing beads (the inset
blur fills the whole bead — truer to a live indicator than a rim). The
custom-property colour plumbing, the ring re-composite, reduced-motion's
static inner glow and the `disabled` suppression are unchanged.

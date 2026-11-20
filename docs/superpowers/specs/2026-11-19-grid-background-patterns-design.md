# Grid Background — dot pattern + docs playground · design

Date: 2026-11-19 · Scope: React only (`react/src`, `react/demo` kit-docs). Vue parity deliberately out of scope.

## Problem

`GridBackground` is the kit's decorative lattice layer — two `linear-gradient`
rules at `background-size: size × size`, masked for an edge fade, already
exported and already used by `AgentMap` (`grid={{ size, fade, opacity, … }}`).

Two gaps:

1. **No docs page.** The component is exported from `components/index.ts` but
   has no entry in `kit-docs/registry.ts`; the only place it is demonstrated is
   a strip at the bottom of the Agent Map page, which teaches the map, not the
   layer.
2. **One pattern only.** Some surfaces want the crossings, not the lines — the
   four cardinal points of each square, as dots. Today a host has to hand-roll
   that background.

## Goals

1. `pattern="grid" | "dots"` on `GridBackground`, **default `"grid"`** — every
   existing caller (including `AgentMap`) renders byte-identically.
2. Dots land on the **intersections of the same lattice** the lines draw, so
   switching pattern in place doesn't shift the phase.
3. `pattern` + `dotSize` flow through `AgentMap`'s `grid` prop; the map keeps
   lines as its own default.
4. A `Layout`-category docs page with a playground, so both patterns are
   tunable live.

## Approaches considered (the dot lattice)

- **A (chosen) — `radial-gradient(circle at 0 0, …)` at `background-size: size
  × size`.** Each tile paints the quarter of a dot at its origin; the three
  abutting tiles supply the other quarters, so one full dot appears on every
  crossing. Same lattice as the lines, `currentColor` keeps working, the
  existing mask keeps working, no extra DOM.
- B — `circle at 50% 50%`: full dots at cell *centres*, i.e. half a cell off
  the crossings. Rejected: that is a different lattice, not "the squares'
  cardinal points".
- C — SVG data-URI or a `box-shadow` dot field: needs escaping, loses
  `currentColor`, and fights the mask. Rejected.

## API

### `GridBackground` (`react/src/components/GridBackground.tsx`)

```ts
export type GridBackgroundPattern = "grid" | "dots";

/** Literal list, kit convention (cf. GRADIENT_BACKDROP_TEMPLATE_IDS) so the
 *  docs playground derives its options from the component. */
export const GRID_BACKGROUND_PATTERNS: readonly GridBackgroundPattern[] = ["grid", "dots"];

export interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Lattice shape. @default "grid" */
  pattern?: GridBackgroundPattern;
  /** Spacing in CSS px, shared by both patterns. @default 32 */
  size?: number;
  /** Colour of the lines, or of the dots. @default "currentColor" */
  lineColor?: string;
  /** Dot radius in CSS px; inert for "grid". @default 1 */
  dotSize?: number;
  /** 0–1. @default 0.12 */
  opacity?: number;
  /** @default "none" */
  fade?: "none" | "radial" | "vertical";
  /** % staying solid before the fade. @default 15 */
  fadeStart?: number;
  /** @default "absolute" */
  position?: "absolute" | "relative";
}
```

- The `"grid"` default lives in the destructuring, like every other prop
  default here — no separate constant to drift out of sync with it.
- `dotSize` is guarded like its neighbours: non-finite → `1`; clamped to
  `[0.25, size / 2]` (past half the cell a dot collides with its neighbour and
  stops reading as a point).
- Dots layer: `radial-gradient(circle at 0 0, ${lineColor} ${r}px, transparent
  ${r + 0.5}px)` — the half-pixel ramp is the anti-alias; a hard stop renders
  visibly stair-stepped. `backgroundSize` stays `${size}px ${size}px` for both
  patterns, which *is* the alignment guarantee.
- `fade` / `fadeStart` / `opacity` / `position` / `children` semantics are
  unchanged and pattern-independent; the inner layer keeps `aria-hidden` +
  `pointer-events: none`.
- `components/index.ts` additionally exports `type GridBackgroundPattern` and
  `GRID_BACKGROUND_PATTERNS` next to the existing pair.

### `AgentMap` (`react/src/components/AgentMap/AgentMap.tsx`)

```diff
-  grid?: false | Pick<GridBackgroundProps, "size" | "lineColor" | "opacity" | "fade" | "fadeStart">;
+  grid?: false | Pick<GridBackgroundProps, "pattern" | "size" | "lineColor" | "dotSize" | "opacity" | "fade" | "fadeStart">;
```

The call site already spreads `{...grid}` after its own defaults, so no other
change: `grid={{ pattern: "dots", dotSize: 1.5 }}` reaches the layer, and
`gridTone`'s `--cj-agent-map-grid-color` still colours it (dots included).

## Docs page — `react/demo/src/kit-docs/components/grid-background/`

Registry entry (`registry.ts`), in `Layout`, immediately after Gradient Backdrop,
icon `ViewGrid` (the name repeats with Agent Map — `Sun` already repeats across
AI Robot and AI Orb):

> **Grid Background** — "A decorative square lattice or dot lattice to sit behind
> any surface: pick the pattern, spacing, colour and edge fade."

`GridBackgroundPlayground.tsx` — `PlaygroundPanel` (`hideBackgroundToggle`, as
Glass Background does: the layer is the subject, a photo behind it just adds
noise) + `ControlAccordion` groups:

| Group | Controls |
| --- | --- |
| Pattern | `ChoiceControl` Grid · Dots (2 options → segmented `MultiToggle`) |
| Lattice | Spacing slider 8–96px · Opacity slider 0–100% · Tone `ColorSwatches` → `var(--color-{tone}-500)` |
| Dots | Dot size slider 0.5–8px — rendered only while `pattern === "dots"` |
| Fade | `ChoiceControl` None · Radial · Vertical, plus a Fade-start slider 0–85% when not None |

Preview: a `h-72 w-full max-w-lg rounded-xl` stage holding the layer plus a
`Panel` on top, so legibility under real content is judgeable, with the
`pattern · size · opacity` readout the Glass playground uses. Conditional
control blocks are composed into `groups` (the documented `ControlAccordion`
pattern), so no stale open-group ids.

`examples/` — one `ExampleCard` per file, each with `?raw` source:

1. `GridVsDots.tsx` — same settings, two cells side by side; the caption states
   the dots sit where the lines used to cross.
2. `Fades.tsx` — `none` / `radial` / `vertical` in one row.
3. `Scale.tsx` — 12px dense vs 64px loose, to show `dotSize` is absolute px and
   does not scale with spacing.
4. `BehindSurface.tsx` — map-style: dots under a floating `Panel`, i.e. what
   `AgentMap` renders with `grid={{ pattern: "dots" }}`.

Page closes with the two standard sections from `kit-docs/CONVENTIONS.md`:
**Key Accessibility** (`A11ySection` → Screen reader: `aria-hidden` + `pointer-events:
none`, the layer is never a named region and hosts must not label it; Keyboard
Support: a "None — non-interactive and unreachable" row, no invented bindings;
Internationalization: speaks no strings, any text it sits under is host-owned)
and **API** (`PropsTable`, defaults read off the component's destructuring).

### Agent Map page

Its "Grid background" group gains a Pattern `ChoiceControl` (and a dot-size
slider when dots), so the fleet can be viewed on either lattice; the standalone
"Reusable grid background" strip keeps mirroring the playground settings and
therefore demonstrates dots too. Two props-table rows mention `pattern` /
`dotSize`.

## Testing

`react/src/components/GridBackground.test.tsx` (extended):

- default emits two `linear-gradient`s and no `radial-gradient`;
- `pattern="dots"` → `backgroundImage` contains `radial-gradient(circle at 0 0`,
  the radius, and keeps `backgroundSize: "48px 48px"` at `size={48}` — the
  alignment guarantee stated as an assertion;
- `dotSize` clamping: `0` → `0.25px`, `NaN` → `1px`, `size` → `size/2`;
- the mask still applies on dots (`fade="radial"` → `maskImage` contains
  `radial-gradient`), and `opacity` still lands on the layer.

`react/src/components/AgentMap/AgentMap.test.tsx` (one case): `grid={{ pattern:
"dots" }}` puts a `radial-gradient` on the `aria-hidden` viewport layer, while
the default still shows lines.

Demo docs pages carry no tests (no `*.test.tsx` exists under `react/demo`) —
verified by running the demo.

## Notes

Inline styles only, no new Tailwind class strings in `react/src`, so the kit CSS
rebuild caveat in `CONVENTIONS.md` does not apply here.

## Out of scope

Vue port, dot shapes beyond circles (crosses, ticks), animated/drifting
lattices, per-axis spacing (`sizeX`/`sizeY`), a second colour for dots.

# Panel hue controls — design

**Date:** 2026-11-23
**Components:** `Panel`, `MultiSelectPanel`
**Status:** approved — pulse hue, select hue and checkbox hue may each disagree with the tone

## The problem

`Panel` derives every state colour from one value:

```ts
// react/src/components/Panel.tsx
const activeHue: TrueColor =
  borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone);
```

That single hue paints the selection rim (`getSurfaceActiveTokens(hue).rim`), the
active wash (`getPanelToneStyles(hue)`) and the attention glow (`--panel-glow`).
So a card can be *one* colour, and a caller who wants an amber selection on a
blue card — or an urgent rose pulse that is not the card's brand hue — has no way
to ask. `MultiSelectPanel` inherits the constraint twice over: the card's
`Checkbox` box is handed the card's tone, so the box can never disagree with the
surface it sits on.

## The design

Two new `Panel` props, one new `MultiSelectPanel` group prop, and per-option
overrides that follow the pattern the component already uses for `variant`,
`tone` and `pulse`.

### Panel

```ts
/** Which the selected state is painted. @default auto — `borderColor ?? tone`, blue floor */
activeTone?: TrueColor;
/** Which the attention glow is painted. @default auto — the active hue */
pulseTone?: TrueColor;
```

Resolution, in place of today's single line:

```ts
const activeHue: TrueColor =
  activeTone ??
  borderColor ??
  (resolvedTone === "none" ? "blue" : resolvedTone);

const pulseHue: TrueColor = pulseTone ?? activeHue;
```

Rules this pins down:

- **Precedence.** `activeTone` beats `borderColor`, which beats `tone`, which
  falls to the kit's blue. `backgroundColor` still beats the active wash —
  caller's paint beats component state — while the rim ignites in `activeTone`.
- **One hue for the selected state.** `activeTone` drives the rim *and* the
  wash, so a card selected in amber reads as one decision rather than an amber
  outline around a blue fill.
- **The pulse agrees unless told otherwise.** `pulseTone` defaults to the
  *active* hue, not to the tone, which keeps the documented promise that a card
  both `active` and pulsing glows in its rim's colour.
- **Everything else stays on `tone`.** The hover wash, the pressed step
  (`hoverColor`), decoration and the resting surface are not selection and do
  not follow `activeTone`.
- **States still beat hues.** `pulsing = pulse && !disabled` is untouched, so a
  dimmed card still cannot demand attention, and the glow custom properties are
  still only written while pulsing.
- **Backwards compatible.** Both props are optional; undefined produces
  byte-identical classes and custom properties to today.

Naming: `*Tone` follows the kit — `IconToggleGroup.accentTone` is exactly this
pattern ("Overrides the active option's fill tone, leaving the track's alone",
resolved `accentTone ?? tone`), and `AgentMap` carries `glowTone` beside
`gridTone`. `hoverColor` keeps its name: it predates the `color`→`tone`
renaming, and renaming it buys nothing a caller needs.

No `"auto"` literal in the union — omission is the kit's spelling of auto
(`labelTone`, `accentTone`, `checkboxVariant`). The playgrounds get an explicit
**Auto** chip so the default stays discoverable.

### MultiSelectPanel

- `MultiSelectPanelSurfaceProps` (the `Pick` from `PanelProps`) gains
  `pulseTone | activeTone`: group defaults for free, consistent with how `pulse`
  and `borderColor` already travel.
- `MultiSelectPanelOption` gains `pulseTone?: TrueColor` and
  `activeTone?: TrueColor`, each "beats the group's".
- New `checkboxTone?: TrueColor` on the group beside `checkboxVariant`, plus
  `option.checkboxTone`, resolved:

  ```ts
  const boxHue = option.checkboxTone ?? checkboxTone ?? cardTone; // blue floor when tone="none"
  ```

  Auto means the card's own tone, which is today's behaviour: a card keeps its
  present look until someone splits the box loose, and then an emerald box can
  sit on a blue card.

## Tests

`Panel.test.tsx`, new block *"the hues a panel can wear"*:

- rim and wash follow `activeTone`;
- the glow's `--panel-glow` / `--panel-glow-dark` follow `pulseTone`;
- unset props reproduce today's classes and vars byte-for-byte;
- `activeTone` beats `borderColor`, `borderColor` beats `tone`, `tone="none"`
  floors to blue;
- unset `pulseTone` follows `activeTone`;
- `disabled` still writes no glow vars at all.

`MultiSelectPanel.test.tsx`:

- group `checkboxTone` reaches the box span (`peer-checked:bg-{hue}-700`) while
  the card's `data-tone` stays the card's hue;
- `option.checkboxTone` beats the group;
- per-option `activeTone` / `pulseTone` beat the group's.

## Docs

- `HueControl` in `react/demo/src/kit-docs/shared/` — an **Auto** chip plus
  `ColorSwatches`, mirroring `SurfaceToneControl`'s "None — no tint" chip.
- Panel playground: *Pulse hue* and *Selected hue*; MP playground: those two plus
  *Checkbox hue*.
- Props-table rows on both pages, and a line that hue is never the only signal:
  selection also rides an outline, the tick and `aria-checked`/`aria-selected`,
  and the pulse survives `prefers-reduced-motion` as a static glow.

## Verification

Vitest on both components, `tsc --noEmit` on `react` and `react/demo`, eslint on
touched files, then a browser pass: one group, blue cards, amber selection, rose
pulse, emerald box — light and dark, checked by measured custom-property values
and computed outline colour rather than by eye.

# StatCard active & pulsing — design

**Date:** 2026-11-23
**Components:** `StatCard`, and through it `StatTile`, `StatCountTile`, `StatGoalTile`, `StatHealthCard`, `StatChartTile`, `StatGraphTile`
**Status:** approved — the card's selection rim and attention glow join the Panel surface API

## The problem

`StatCard` renders exactly one `Panel` and forwards half of its vocabulary — the
surface half:

```tsx
// react/src/components/StatCard.tsx:667
<Panel
  variant={variant}
  tone={surfaceTone}
  corner={corner}
  padding={padding}
  decoration={resolvedDecoration}
  …
```

The other half — the half that says *this card is the one the user picked* and
*this card wants to be looked at* — stops at the boundary. `Panel` has had
`active`, `pulse`, `activeTone` and `pulseTone` since
[2026-11-23-panel-hue-controls-design.md](2026-11-23-panel-hue-controls-design.md),
and a dashboard of tiles can express neither: a selected filter tile, a KPI that
is drifting, a live counter that should breathe. Today a caller reaching for it
has to drop to a raw `Panel` and re-implement the label / value / trend /
progress / drilldown blocks around it, which is the entire reason `StatCard`
exists.

`StatTile` is a rename layer over `StatCard` that spreads `{...rest}`
([StatTile.tsx:100](../../../react/src/components/StatTile.tsx#L100)), and the
sibling tiles (`StatCountTile`, `StatGoalTile`, `StatHealthCard`,
`StatChartTile`, and `StatGraphTile` via `{...props}`) do the same. So this is
one addition to `StatCardProps` and the whole family gains the feature — no
per-tile edits.

## The design

Four optional props on `StatCardProps`, forwarded verbatim. **`StatCard`
resolves no hues of its own.**

```ts
// StatCardProps, beside the other surface props after `padding`
active?: boolean;
activeTone?: TrueColor;
pulse?: boolean;
pulseTone?: TrueColor;
```

```tsx
// StatCard's Panel, after `decoration`
active={active}
activeTone={activeTone}
pulse={pulse}
pulseTone={pulseTone}
```

### Why nothing is computed here

`StatCard` already hands `Panel` `tone={surfaceTone}`, so Panel's own chains
already mean *the card's own hue* with no help:

```
activeHue = activeTone ?? borderColor ?? (surfaceTone === "none" ? "blue" : surfaceTone)
pulseHue  = pulseTone ?? activeHue
```

Re-deriving either in `StatCard` — from `getSurfaceAccentColor(surfaceTone)`,
which is the card's own accent helper — would put a second copy of those rules
where they can drift, and Panel's rim / wash / glow already disagree with the
card in exactly the ways a caller may want. The card's job is the metric block;
the surface's state belongs to the surface.

The prop docs mirror Panel's wording (`selection, not the pointer`; `urgency and
brand are different messages`) with the `@default "auto" — …` convention, and
no `"auto"` literal in the union — omission *is* auto, as on `Panel`,
`IconToggleGroup.accentTone` and last week's `MultiSelectPanel`.

### Two caveats, documented rather than papered over

**A `gradient` card shows the rim and the glow, not the wash.** `gradient`
paints an inline `background` (950 → 800 → 700 diagonal, alpha-stepped on
translucent variants), and an inline `background` outranks Panel's active fill —
the same "caller's paint beats state" rule that lets `backgroundColor` beat the
wash. That is the right hierarchy here: the gradient is the card's *identity*,
the rim is its *state*, and the outline rim plus the glow already read on a dark
field. Documented on `active`, so nobody hunts for a missing wash.

**`pulse` always pulses.** Panel gates the glow with `pulsing = pulse &&
!disabled`, and a `StatCard` has no `disabled` of its own — it isn't in
`React.HTMLAttributes<HTMLElement>`, so it cannot even arrive through `{...rest}`.
Panel's gate stays untouched (it is documented behaviour, and `MultiSelectPanel`
relies on it for disabled options); the card simply never engages it. Documented
on `pulse` as a one-liner rather than left as a silent asymmetry with `Panel`.

### What the family gets for free

`StatTileProps extends Omit<StatCardProps, "meta" | "progress">` and the other
tiles' `Omit` lists drop metric-block props (`body`, `value`, `subtitle`,
`variant`, `children`) — none of them touches these four, and each renders
`<StatCard {...rest}>`. So `active` / `pulse` / `activeTone` / `pulseTone` reach
every tile without editing one. One test asserts the landing on both `StatTile`
and `StatGraphTile`, because `StatGraphTile`'s wholesale `{...props}` is the
shape most likely to be "tidied" into enumerated forwarding and quietly lose it.

### Out of scope

- **Vue.** `vue/src/components/Panel.vue` has neither `active` nor `pulse`, so
  there is nothing to mirror; porting Panel's selection half is its own project.
- **`disabled` / `disabledVeil` / `borderColor`.** Decided against: `disabled`
  needs veil, click-guard and focus rules for a card that may be a button *or*
  a drilldown trigger, and `borderColor` only feeds an auto chain the card
  doesn't run.
- **No auto-`active` while the drilldown is open.** `active` means what the
  caller says it means; the popover already carries its own open affordance, and
  a rim that means two things is a rim the user can't read.

## Verification

`react/src/components/StatCard.test.tsx` — a describe mirroring Panel's
`the hues a card can wear`:

1. unset is byte-identical to today: no `panel-pulse`, no `--panel-glow` in the
   inline `style`, no `data-active`;
2. `pulse` → the class plus `--panel-glow: var(--color-{tone}-500)` and
   `--panel-glow-dark: var(--color-{tone}-300)`;
3. `pulseTone` moves the glow while rim and wash keep the card's `tone`;
4. `active` → `data-active` and the tone's `outline-{tone}-500` rim;
5. `activeTone` moves rim and wash together;
6. `pulse` with no `pulseTone` glows at the selected hue (the one-colour case);
7. `pulseTone` and `activeTone` are independent;
8. both props land on the `Panel` root through `StatTile` and `StatGraphTile`.

Then a throwaway Vite harness drives the real playground in Chromium and reads
computed `--panel-glow`, `--panel-glow-dark` and `box-shadow` light and dark, on
a toned card, an untoned one (the blue floor) and a `gradient` one — and is
deleted afterwards, as every harness this session has been.

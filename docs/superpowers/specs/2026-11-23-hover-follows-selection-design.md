# Hover follows the selection hue — design

**Date:** 2026-11-23
**Status:** design approved by the caller ("approve lets do it"), this document is the record
**Components:** `Panel`, `MultiSelectPanel`, `StatCard` (and therefore the whole Stat tile family)

## The problem

`Panel` resolves two hue chains that never meet.

```tsx
// Panel.tsx:815 — everything the pointer asks for
const hoverHue = hoverColor ?? (resolvedTone === "none" ? undefined : resolvedTone);

// Panel.tsx:847 — everything the selection state wears
const activeHue: TrueColor =
  activeTone ?? borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone);
```

So `tone="cyan"` with `activeTone="amber"` gives a card whose rim, wash and attention glow are amber while its **hover wash, pressed step and rim ignition stay cyan** — `getSurfaceHoverTokens(variant, hoverHue)` derives all three from the one wrong hue. On a card that is selected *and* being hovered, the two hues sit on top of each other at once. It is the same class of wrong as a button whose focus ring disagrees with its hover.

The three components meet it differently:

- **`Panel`** owns the resolution and is the only place a fix can live. Its playground has `activeTone` and `pulseTone` swatches but no hover control, so the mismatch is unavoidable and unrecoverable from the UI.
- **`MultiSelectPanel`** forwards `option.activeTone ?? activeTone` straight into `<Panel>` (:494) and every option card is clickable (:472), so hover is live on every card. It inherits the fix for free — but it has no hover knob in either tier, while `activeTone`, `pulseTone` and `checkboxTone` all have one.
- **`StatCard`** exposes no hover prop at all, so a card's hover hue is always its `tone`. Worse for demos: the playground preview has no `onClick`, so `isHoverable` is false and it renders no hover tokens whatsoever — a hover swatch there would be a control that does nothing.

Two docstrings are already false about this. `MultiSelectPanelOption.tone` promises "Everything the hue was already driving follows it — the hover wash" (:75–79), which stays true but stops being the whole story. `Panel.hoverColor`'s `@default` says "the Panel's own `tone`" (:268), which is about to be a half-truth.

## Design

One line, in the one place the hue is resolved:

```tsx
const hoverHue =
  hoverColor ?? activeTone ?? (resolvedTone === "none" ? undefined : resolvedTone);
```

The rest of the file already hangs off `hoverHue`: `getSurfaceHoverTokens(variant, hoverHue ?? "none")` yields the wash, the pressed step and the rim ignition as a set, and `isTintedHover` decides tinted wash versus `SURFACE_NEUTRAL_HOVER`. One edit therefore moves all three pointer responses in step, with no new code paths and no new class shapes — `themeSafelist.test.ts` already walks `getSurfaceHoverTokens` across nine variants and 21 tones, so every hover shape the new chain can ask for is already generated.

The chain now reads like its neighbours:

| what the card does | hue chain |
| --- | --- |
| rests | `tone` |
| answers the pointer | `hoverColor ?? activeTone ?? tone` |
| is chosen | `activeTone ?? borderColor ?? tone`, blue floor |
| demands attention | `pulseTone ?? activeHue` |

`activeTone` thus becomes *the hue this card wears when it is chosen* — which includes the hover that previews the choosing — rather than only the colour of the rim after the click.

### Decisions, and the alternatives they reject

**~~The follow is triggered by `activeTone` being set, not by `active` being true.~~ SUPERSEDED THE SAME DAY by Amendment 1: the follow is gated on `active`.** The original reasoning — a card in a selectable list should hover in the hue it is about to turn into, and gating keeps the mismatch right up to the moment of the decision — was wrong in the presence of a group, because a group hands its `activeTone` to every card it owns, chosen or not.

**No opt-in boolean.** `activeTone` shipped this week and has no callers whose hover would change unexpectedly, so the correct behaviour is affordable as the default. A `hoverFollowsActive` flag would have an off position that is the thing we just agreed looks wrong, and every hue prop in this family already works as an implicit chain with an explicit override — `hoverColor` is that override, so the boolean would be a second, redundant one.

**`borderColor` stays out of the hover chain.** It feeds `activeHue`, and on `border`-rim variants the hover ignites a `hover:border-*` class, so a `borderColor` override has the same mismatch today. It is still excluded, because `borderColor` is a *resting-edge* override routinely used for neutral hairlines — a grey border around a cyan card is a deliberate look, and a grey hover is not what anyone wants from it — and unlike `activeTone` it is a shipped prop with existing users, whose hovers would repaint on no request. Anyone who means their border as an accent passes `hoverColor`. **This decision gets a test**, or a future tidy-up folds it into `activeHue` and quietly repaints a thousand neutral borders.

**`checkboxTone` stays out too.** The box is the control; the card's hover is the card's response to being approached. They are different messages and the group is allowed to separate them, which is the whole reason `checkboxTone` exists.

### The card and group knobs

- `StatCard` gains `hoverColor?: TrueColor` and `hoverable?: boolean`, forwarded verbatim beside `active`, `activeTone`, `pulse`, `pulseTone`. `hoverShadow` already lives there, so this completes the hover trio rather than opening a new surface — and `hoverable` is the piece that lets a card answer the pointer without pretending to be clickable, which is also what makes the stat playground able to show any hover at all.
- `MultiSelectPanel` gains `hoverColor` in **both** tiers: in the `Pick<PanelProps, …>` surface list (:34–53) at group level, and as `option.hoverColor ?? hoverColor` per card, matching how `activeTone`, `pulseTone` and `checkboxTone` already resolve. `hoverable` is already picked (:41).

### Documentation that moves with the code

- `Panel.hoverColor` and `Panel.activeTone` docstrings state the chain honestly.
- `MultiSelectPanelOption.tone` and the new `hoverColor` fields follow the kit's existing "Beats the group's X … `undefined` follows the group" wording; the group row says *"Auto — the selected hue, else the card's own"*.
- Playgrounds: a *Hover hue* `HueControl` in `PanelPlayground` beside the `activeTone`/`pulseTone` pair; *Hoverable* toggle plus gated *Hover hue* swatch in `StatBaseControls`, which Stat Tiles inherits; a *Hover hue* swatch in `MultiSelectPanelPlayground`; a prop row beside *activeTone / pulseTone* on the MultiSelectPanel page (:167).
- Examples: a fifth card in `panel/examples/Hues.tsx` (it has four) — clickable, `activeTone`-overridden, so hovering it is the demonstration — and a sixth in `stat-card/examples/Selection.tsx` (it has five).

## Out of scope

- **Vue.** `Panel` there has no `active`, `activeTone` or `pulse` at all, so there is nothing for the hover to follow. `getSurfaceHoverTokens` is untouched, so the Vue kit's hovers cannot change.
- The **depth** of the hover step stays the theme's, as `hoverColor` already promises — only the hue is the caller's.
- No `pressedTone`/`rimTone` knobs; they come with the hue, as they do today.
- No change to `disabled`, which already removes every hover token (`isHoverable && !disabled && …`, :999, :1264) and silences the pulse.

## Verification

1. `Panel.test.tsx` — a describe over the chain: `activeTone` steers wash, pressed and rim when `hoverColor` is absent; `hoverColor` beats `activeTone`; **`borderColor` does not steer the hover**; untoned + `activeTone` takes a tinted hover where untoned + nothing keeps `SURFACE_NEUTRAL_HOVER`; `disabled` kills all hover tokens even with `activeTone`.
2. `MultiSelectPanel.test.tsx` — group `hoverColor` reaches every card, `option.hoverColor` beats it, and `option.activeTone` steers the hover through the option layer (the forwarding is the part that rots).
3. `StatCard.test.tsx` — `hoverColor` and `hoverable` reach the surface; `tone="cyan"` + `activeTone="amber"` hovers amber *through a card*, and through `StatTile` too.
4. `themeSafelist.test.ts` unchanged and passing — the check that no class shape was added.
5. Throwaway Vite + Chromium harness under `react/demo/<scratch>/`, driving a **real** `page.hover()` — jsdom has no hover — reading computed `background-color` and `border-color` light and dark across: cyan + `activeTone` amber; the same plus `hoverColor`; the same plus `borderColor`; untoned + `activeTone`; untoned alone. Plus one MultiSelectPanel group and one `hoverable` stat card. Harness deleted afterwards.
6. Full `react` suite against its known baseline (8 pre-existing failures), `react/demo` `tsc` at its 10 pre-existing errors, `eslint` clean on touched files.

## Baseline notes for the implementer

- Vitest needs `TMPDIR=$PWD/.tmp … --coverage.enabled=false`.
- Prettier printWidth is 100; never run `prettier --write` over these files.
- Playwright is only available as `playwright-core` (default-import, then destructure `chromium`) with `executablePath` pointing at `~/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome` and `--allow-file-access-from-files`.
- Docs-kit controls live in `shared/HueControl.tsx` (`HueControl` = swatch row + Auto button); collapsible playground groups render `inert` until expanded, so any driving script clicks *Expand all* first.

## Amendment 1 — the follow is gated on `active`

Reported from the MultiSelectPanel playground in the dark theme: an untoned group, `activeTone` set to teal, one card selected. The selected card's rim and wash were teal while its hover was the component's neutral veil — the original complaint, still standing for the one card that had a state to be consistent with. The fix that had just shipped solved it by making `activeTone` steer the hover, which in a group makes **every** card hover teal: the colour of a state that one card has and the rest do not. Both are wrong; the difference is only which card looks confused.

The rule became:

```
hoverHue = hoverColor ?? (active ? activeTone : undefined) ?? (tone === "none" ? undefined : tone)
```

- **The follow belongs to the state, not to the hue.** A card hovers in its selection hue only while it is the selected one; unselected cards — including every neighbour a group handed the same `activeTone` — keep hovering in their own tone, or in the neutral veil when they have none.
- **Only an explicit `activeTone` triggers it.** A card whose selection hue merely comes from `borderColor`, from `tone`, or from the kit's blue floor hovers exactly as it did before this feature: nothing that nobody complained about changes. (The alternative — follow whatever `activeHue` resolves to — would quietly repaint every active untoned card in the kit.)
- **`hoverColor` still outranks the whole chain**, whether or not the card is selected: it is the documented override, and it is what a caller uses to keep a whole group hovering in the brand hue.
- **The gate lives in `Panel`, not in `MultiSelectPanel`.** `Panel` already owns all four hue chains and receives `active` per card, so the rule is written once and `StatCard`, the Stat tiles and `MultiSelectPanel` inherit it — `MultiSelectPanel` forwards `active={isSelected}` and `activeTone={option.activeTone ?? activeTone}`, which is exactly what makes the split per-item. Gating inside `MultiSelectPanel` instead would have left `Panel` and `StatCard` inconsistent and the rule in two places.
- `borderColor` stays out, for the reason already given, and its test still locks that.

Measured after the change (`page.hover()`, computed styles, both schemes): untoned group with `activeTone="teal"` — selected card `teal-500/10 → teal-500/20`, unselected card no surface colour at all and the `white/8.6%` veil; the same group with `hoverColor="lime"` — both cards `lime/20`, selected or not; cyan group — selected `teal`, neighbour `cyan`; `Panel`/`StatCard` untoned with `activeTone` — veil when unselected, tinted step when selected. `themeSafelist.test.ts` still untouched, so the class shapes are the same set as before the amendment.

# Alert + Toast — a `tonal` surface, and `solid` earns an edge

Date: 2026-11-26
Status: implemented
Follows: `panel-tonal-border` (2026-11-25) — same rim arithmetic; the *direction* rule differs, and why it differs is the interesting half of this document
Touches: `getAlertVariantTokens`, `ALERT_VARIANTS`, `scripts/generate-safelist.mjs`, `react/src/theme/paletteProbe.ts` (new), `react/src/theme/alertRim.test.ts` (new), the toast/alert docs family

## Problem

`solid` has no edge. Its token was literally `border: "border-transparent"`
(`common/theme/Theme.ts`), so a card's whole contour in dark mode is a
`bg-{c}-400` fill and a `shadow-sm`. Measured: **1.000:1** against its own fill
and **1.000:1** against the page — not a weak edge, no edge.

For a single card that survives on the fill's own luminance. For a *deck* it
fails: in `stacked` mode only the ~12px the `gap` lets through of the card
behind is visible, and five identical `{c}-400` fills agree with the front
card, so the stack reads as one shape with stepped protrusions. The report
this spec starts from is exactly that — the toast playground, three
`intent="success"`, `color="emerald"`, `variant="solid"` cards stacked.

`subtle` and `outline` already carry a tone border, and the glass pair takes
its rim from `glass.ts`. The two variants that go edgeless are `solid` and the
glass pair, and only `solid` is asked to change here.

There is also no `tonal`. The tinted family jumped from `subtle` (`{c}-50` /
`{c}-900/40`) straight to `solid` (a saturated `{c}-700` / `{c}-400` slab),
with nothing between them that has real chroma *and* stays readable.

## Decisions (user-approved)

1. **`tonal` joins the shared table.** `ALERT_VARIANTS` becomes
   `["subtle", "solid", "tonal", "outline", "glass", "liquid-glass"]` —
   inserted after `solid`, so the demo row reads light → heavy → glass.
   `ToastInput["variant"]` is `AlertVariant`, so the toast gains it without a
   new field; `Alert.tsx` needs no branch (only `GLASS_VARIANTS` special-cases
   a variant). A toast-only union would make `Surfaces.tsx`'s claim — "the same
   surfaces as Alert, one token table drives both" — false, and two tables for
   one scale is the drift this kit legislates against.
2. **`tonal` is *not* Panel's `tonal`.** The first implementation borrowed
   `getPanelToneStyles(color)`'s `tonalBg` / `tonalBorder` verbatim, on the
   argument that "tonal" should mean one thing across the kit. It was reverted
   after the screenshot review: measured against the page, Panel's tint is
   **1.099** (light, worst yellow) / **1.138** (dark, worst rose) — a card made
   of air, which is right for a panel sitting *inside* content and wrong for an
   object that arrives unannounced in the corner of someone's work. The callout
   now declares its own opaque pair (**1.164** / **1.179**), and
   `alertRim.test.ts` has a test that keeps the two from converging again.
   What is still shared with Panel is the *law*, not the palette: the rim steps
   past the fill, away from the page.
3. **The edge goes on `tonal` and `solid`.** Not on the glass pair: their
   `border-white/50 dark:border-white/10` is achromatic precisely so a glass
   card reads over a photograph, and tinting it trades a real property for a
   cosmetic match. `subtle` and `outline` keep what they have.
4. **Border only — no deck dimming.** A rim says where a card ends, not that
   another one is behind it, so a brightness step for cards behind in the
   collapsed deck was considered and deferred: it would apply to glass cards
   too, and the deck problem is unconfirmed until the rim is in front of a
   person. Revisit from evidence, not before.
5. **The playground widens to `22.5rem`** (approved separately, before this
   design). It is the surface the screenshot came from and the place both
   changes get judged. The kit default (`TOAST_DEFAULT_WIDTH`, `18.75rem`) is
   untouched: this is one page's staging, not a scale change.

## Measurements

Composite over `white` / `neutral-900`, WCAG 2.1 ratio, worst of all 21
`TRUE_COLORS` — the arithmetic now lives in `react/src/theme/paletteProbe.ts`
(extracted from `tonalRim.test.ts`, which imports it), because two suites
measuring the same composite with two hand-written parsers is two chances to be
wrong. jsdom computes no colours, so this arithmetic is the only witness.

**How much of an object a fill makes** (fill vs page) — the table that reversed
decision 2:

| fill | light | dark |
| --- | --- | --- |
| `Panel` `tonalBg` (`{c}-200/60` / `{c}-500/15`) | 1.099 (yellow) | 1.138 (rose) |
| `tonal`, chosen (`{c}-200` / `{c}-800`) | **1.164** (yellow) | **1.179** (stone) |
| `subtle` | 1.034 (lime) | 1.000 (neutral) |
| `solid` (for scale) | 4.924 (yellow) | 5.742 (indigo) |

**The rim bars**, shared with `tonalRim.test.ts`: ≥ **1.10:1** against the fill
it frames, ≥ **1.20:1** against the page, both modes, all 21 tones.

`solid`, rim candidates over the `-700` / `-400` fill:

| rim | vs its own fill | vs the page | verdict |
| --- | --- | --- | --- |
| `border-transparent` (as shipped) | 1.000 | 1.000 | no edge |
| light `border-{c}-600` | **1.239** (violet) | **2.931** (yellow) | **chosen** |
| dark `border-{c}-500` | **1.216** (orange) | **3.704** (gray) | **chosen** |
| light `border-{c}-700` | 1.000 | — | the fill itself: a rim that agrees with its own card |
| light `border-{c}-800` | 1.250 | 6.875 | cleared both bars, **rejected** — a frame dropped over the tone |
| dark `border-{c}-600` | 1.510 | 2.296 | cleared, rejected with the row above (first pass) |
| dark `border-{c}-900` | 3.367 | **1.000** (neutral) | **rejected** — lands back on the ground it was meant to leave |

The two rejected "clears both bars" rows are the reason the spec has a direction
rule and not only floors. `solid`'s rim is the fill's neighbour **toward the
page** — page → rim → fill, one step — so the seam between two identical fills
is one rung of the ramp, not an outline. The `-800` / `-600` first pass passed
1.10 and 1.20 and was rejected by eye, and it stays in the test as a canary that
must keep failing on the *ordering*, which is the assertion the floors alone
cannot make.

`tonal`, rim candidates over its own fill (fill `bg-{c}-200` / `dark:bg-{c}-800`,
rim `border-{c}-400` / `dark:border-{c}-600`, title `{c}-950` / `{c}-50`,
body `{c}-900` / `{c}-200`, icon `{c}-800` / `{c}-300`):

| | rim vs fill | rim vs page | title | body | icon |
| --- | --- | --- | --- | --- | --- |
| light | 1.316 (lime) | 1.535 (lime) | 10.350 (blue) | 6.809 (rose) | 5.422 (orange) |
| dark | 1.557 (violet) | 2.296 (neutral) | 6.641 (yellow) | 5.422 (orange) | 4.123 (rose) |

Copy is held to 4.5:1 (AA, small text); the icon to 3:1 (WCAG 1.4.11 — it is a
graphical object, and `alertRim.test.ts` says so in the bar it asserts). Two
alternatives were measured and declined: dark `bg-{c}-900` lifts every copy
pair (icon 5.011, title 8.394) but on the neutrals it is the page's own
darkness, so the card stops reading as a tone; and `bg-{c}-100` with a
`{c}-300` rim clears at 1.201 — two hundredths off the floor, and `100` is
`subtle`'s family. `-800` is the last dark rung that still reads as the colour
it is named for; `-700` approaches `solid` and would erase the distinction this
variant exists to make.

## Implementation surface

1. **`common/theme/Theme.ts`**
   - `ALERT_VARIANTS` += `"tonal"` after `"solid"`.
   - new `tonal` arm, opaque, with the measurements above in its comment;
     `getPanelToneStyles` is left alone because `Panel` (and `Toolbar`) still
     want their whisper.
   - the `solid` arm's `border: "border-transparent"` → `border-${c}-600
     dark:border-${c}-500`.
   - `solid`'s detail line `text-white/90` → `text-white/95` (and the dark
     `-{c}-950/90` → `/95`): at /90 the alpha does the damage the shade was
     picked to avoid — yellow, lime and green land at **4.31–4.36:1**, under the
     bar the fill was chosen to clear. A secondary line is still copy.
   - the dismiss string was duplicated across the `subtle`, `outline`, `tonal`
     and fallback arms; it is now the `alertDismissTokens(color)` helper.
2. **`scripts/generate-safelist.mjs`** → regenerate `common/safelist.css`
   (348 lines). Five shapes added, all verified present exactly once:
   `text-{COLOR}-950`, `border-{COLOR}-600`, `dark:border-{COLOR}-600`,
   `dark:text-{COLOR}-950/95`, `dark:hover:text-{COLOR}-950`. The last was
   missing *before* this change: `solid`'s dismiss has been hovering to its own
   rest colour for its whole life.
3. **`react/src/theme/paletteProbe.ts`** (new) — `toLinearSrgb`, `luminance`,
   `page`, `ratio`, `paint(classes, mode, {ground, props})`, `worstOf`. The
   `props` filter exists because a surface string carries `bg-…` *and* `text-…`:
   measuring a fill against its own `text-white` is a tautology dressed as a
   test.
4. **`react/src/theme/alertRim.test.ts`** (new, 9 tests) — the two bars over 21
   tones × 2 modes × `solid`/`tonal`; the copy floors; the two direction rules
   (`solid` page → rim → fill, `tonal` page → fill → rim); an exact-rung
   anti-drift assertion; the Panel-divergence test; the glass pair's empty rim;
   `ALERT_VARIANTS` order; and the canaries that the rejected rungs keep
   failing.
5. **`react/src/theme/themeSafelist.test.ts`** — the walk now includes
   `getAlertVariantTokens` over every variant. That walk is what found
   `dark:hover:text-{c}-950` and would otherwise have let a missing rim shape
   render as `currentColor` while `alertRim.test.ts` measured a colour the
   stylesheet never contained.
6. ~~`contrast.test.ts` gains the alert pairs~~ — declined after writing
   `alertRim.test.ts`: the copy floors are already there, measured on the
   composite of the fill rather than against the page, and a second suite over
   the same table is a second place for the numbers to disagree.
7. **Tests and docs that would otherwise lie**
   - `react/src/components/Alert.test.tsx` swept a *copy* of the variant array;
     it now iterates `ALERT_VARIANTS` so the sweep cannot go stale again.
   - `Toast.test.tsx:233` already maps `ALERT_VARIANTS` → `tonal` was covered
     the moment it landed.
   - the three places that said "five" now say six (or read
     `ALERT_VARIANTS.length`).
   - `toast/ToastPlayground.tsx:277` → `width="22.5rem"` (approved separately).

## Out of scope

- Deck dimming / `deckStep` prop (decision 4).
- Glass rim tinting (decision 3).
- Vue: `vue/src` has no toast component — only `types/Toast.ts` and
  `toastUtils.ts`, and `AlertVariant` is re-exported there as a type. Nothing
  to render, nothing to change.

## Verification

- `npx vitest run src/components/Toast/Toast.test.tsx src/components/Alert.test.tsx src/theme`
  → **15 files, 801 tests passing**, including the new `alertRim.test.ts` (9)
  and the extended `themeSafelist.test.ts` run against a rebuilt
  `dist/index.css` (`npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css`
  — the guard is only green against a fresh build).
- `npm --prefix react run lint` → clean (`tsc --noEmit && eslint src`).
- A screenshot pass on the **real** docs playground (not a fixture): the
  playground at its shipped `22.5rem`, deck of three, `solid` and `tonal`,
  emerald-triple and emerald/amber/sky-mixed, light and dark — eight shots. The
  deck from the report reads as three cards in both modes, the `solid` rim is a
  hairline rather than an outline, and `tonal` reads as an opaque card that is
  not `solid` and not `subtle`.

## Follow-ups (same session, after that review)

Two things the screenshots showed that the brief had not asked for and the user
then did.

**The close button was parked, not cornered.** It sat a full padding-step off
its own border (`py-3` at `md`), which reads as a control floating in the
card's top-right quadrant rather than as the card's close affordance. It is now
lifted into the corner by half the card's padding — a `closeInset` field on
`ToastSizeTokens`, because the table is the single description of card geometry
and a `-mt-1.5` written into the component would be a second source of truth —
and its box came down one rung (`md h-7 → h-6`, `lg h-8 → h-7`, `xl h-9 → h-8`),
which hands ~10px of the row back to the copy. The ladder stops at `h-6`:
**24px is WCAG 2.5.8's minimum target**, so "a bit less space" has a floor and
the floor is a number. `xs` keeps its 20px box on a card whose whole content row
is 20px tall. `react/src/theme/toastGeometry.test.ts` (3 tests) pins the inset
to ≤ half the padding on both axes, the boxes to a non-decreasing square ladder
`[20, 24, 24, 28, 32]`, and the glyph rungs the box was shrunk around.

**Width is not size.** The playground only had `Size`, which moves the title,
the detail, the glyph and the card's height together — so there was no way to
say "wider". `ToastViewport` already owned a `width` prop (the deck's column,
which every card fills at `width: 100%`); it was simply hard-coded here. It is
now a control with the deck's realistic widths, `18.75rem` (kit default) through
`30rem` and a `min(92vw, 34rem)` corner-filling preset, and the playground's own
caption says which lever does what: width is the column, Size is the type. No
API change — the prop existed, the demo hid it. Verified with three decks at one
width in `xs`, `md` and `xl`: identical column, different type and height.

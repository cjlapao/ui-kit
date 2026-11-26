# Alert + Toast `tonal`, and `solid` earns an edge — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-26-alert-tonal-variant-design.md`](../specs/2026-11-26-alert-tonal-variant-design.md)

Rule of the whole change: **a rim is a measured object, not a taste.** Every
colour that goes on the edge of a callout is chosen against the composite of the
fill it frames and the page it sits on, worst of all 21 `TRUE_COLORS`, in both
modes — and the *ordering* of page / rim / fill is asserted too, because the
first-pass rim cleared every ratio floor and still looked wrong.

**Ground rules:**

- Never break: `TOAST_DEFAULT_WIDTH` stays `18.75rem` and the `18.75rem`
  assertion in `Toast.test.tsx:393` stays put — the playground's `width` is one
  page's staging, not a scale change.
- Never break: `solid`'s fills stay `{c}-700` / `{c}-400`. White copy needs
  ≥4.5:1 and those rungs are the ones that give it; a "nicer" mid-tone fails 11
  of 21 tones.
- Never move a threshold to admit a rung. Change the rung and record the
  numbers in the spec's Measurements table.
- If a suite rejects a rung, that is the finding, not the suite.
- Only commit files this plan touches, by explicit pathspec — the working tree
  has unrelated uncommitted icon / ActivityFeed / picker work.
- Baseline: `cd react && mkdir -p ../.tmp/vitest-tmp && TMPDIR=$PWD/../.tmp/vitest-tmp npx vitest run src/theme src/components/Toast src/components/Alert.test.tsx --coverage=false`
  → 15 files / 801 tests green before and after.

---

## Task 1 — Colour maths, extracted (`react/src/theme/paletteProbe.ts`, new)

- [x] Lift `toLinearSrgb`, `gamma`, `luminance`, `page`, `ratio`, `paint`,
      `worstOf`, `palette` out of `tonalRim.test.ts` so a second suite can use
      them; `tonalRim.test.ts` keeps its behaviour and loses its parser.
- [x] `paint(classes, mode, { ground, props })` — a caller-supplied ground (a
      rim is measured *on* the fill it frames) and a `props` filter, because a
      surface string carries `bg-…` **and** `text-…`: measuring a fill against
      its own `text-white` is a tautology dressed as a test.
- [x] `transparent` resolves to the ground; `text-`/`fill-`/`stroke-` parse too.

## Task 2 — The variant table (`common/theme/Theme.ts`)

- [x] `ALERT_VARIANTS` += `"tonal"`, after `"solid"` (light → heavy → glass).
- [x] `alertDismissTokens(color)` helper; the four copies of that string
      collapse into it.
- [x] `solid`: `border: "border-transparent"` → `border-${c}-600
      dark:border-${c}-500`, with the measurement and the three rejected rungs
      in the comment.
- [x] `tonal`: its own opaque arm — `bg-{c}-200 text-{c}-950 /
      dark:bg-{c}-800 dark:text-{c}-50`, rim `-400` / `-600`, copy `-900` /
      `-200`, icon `-800` / `-300`. **Not** `getPanelToneStyles`: the reversal is
      decision 2 in the spec, with the fill-presence numbers beside it.
      `getPanelToneStyles` stays as `Panel` wants it.
- [x] `solid`'s detail `/90` → `/95` (at /90 the alpha puts yellow, lime and
      green at 4.31–4.36:1).
- [x] `ToastSizeTokens.closeInset` (new field) + one rung off `close` for
      `md`/`lg`/`xl`; ladder bottoms out at 24px, WCAG 2.5.8's minimum target.

## Task 3 — The card (`react/src/components/Toast/ToastMessageCard.tsx`)

- [x] Root already carries `border`, so `tokens.border` lands with no new
      property; glass pair untouched (`GLASS_VARIANTS` unchanged).
- [x] Dismiss button gains `size.closeInset` — the corner, on both axes.
- [x] No `tonal` branch anywhere: `Alert.tsx` needed none either, which is the
      point of putting the variant in the shared table.

## Task 4 — Safelist (`scripts/generate-safelist.mjs` → `common/safelist.css`)

- [x] Alert block gains `text-{COLOR}-950`, `border-{COLOR}-600`,
      `dark:border-{COLOR}-600`, `dark:text-{COLOR}-950/95`,
      `dark:hover:text-{COLOR}-950`.
- [x] `node scripts/generate-safelist.mjs` (348 lines), each new shape verified
      present exactly once; rebuild `dist/index.css` before the guard runs.

## Task 5 — Tests

- [x] `react/src/theme/alertRim.test.ts` (new, 9): the two bars × 21 tones ×
      2 modes × `solid`/`tonal`; copy floors (4.5 copy, 3.0 glyph); `solid`'s
      page → rim → fill and `tonal`'s page → fill → rim; exact-rung anti-drift;
      the Panel-divergence pair; the glass pair's empty rim; `ALERT_VARIANTS`
      order; the rejected rungs as canaries, `-800` failing on *ordering*.
- [x] `react/src/theme/toastGeometry.test.ts` (new, 3): inset ≤ half the
      padding on both axes, square non-decreasing boxes `[20,24,24,28,32]`, the
      glyph rungs the boxes were shrunk around.
- [x] `themeSafelist.test.ts` walks `getAlertVariantTokens` over every variant.
- [x] `Alert.test.tsx` iterates `ALERT_VARIANTS` instead of a copy of it.
- [x] `Toast.test.tsx` needed no edit — `:233` already maps the table.
- [ ] ~~`contrast.test.ts` gains the alert pairs~~ — declined: `alertRim` holds
      them on the composite of the fill; a second suite over one table is a
      second place for the numbers to disagree.

## Task 6 — Docs family

- [x] `toast/ToastPlayground.tsx` — `width="22.5rem"` → a `Width` control beside
      `Position` (`18.75rem` → `30rem`, plus `min(92vw, 34rem)`), with the
      caption saying width is the column and Size is the type.
- [x] Three places that said "five" say six (or read `ALERT_VARIANTS.length`):
      `toast/examples/Surfaces.tsx`, `alert/examples/Variants.tsx`,
      `kit-docs/registry.ts`.

## Task 7 — Verification gates

- [x] `npx vitest run src/theme src/components/Toast src/components/Alert.test.tsx
      --coverage=false` → 17 files / 821 tests green.
- [x] `npm --prefix react run lint` → `tsc --noEmit && eslint src` clean.
- [x] Negative-margin utilities present in the rebuilt `dist/index.css`.
- [x] Real playground, eight shots: deck of three × {`solid`,`tonal`} ×
      {light,dark}, the corner close-up, and one width with `xs`/`md`/`xl` in
      the same deck — the deck reads as three cards, the × sits on the corner,
      the column is identical while the type is not.
- [x] Vue untouched: `vue/src` has no toast component, only `types/Toast.ts` and
      `toastUtils.ts`.

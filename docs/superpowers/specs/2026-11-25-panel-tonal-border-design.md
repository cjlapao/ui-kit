# Panel — `tonal` earns a resting edge

Date: 2026-11-25
Status: approved
Follows: `outlined` hairline (`outlineBorder`), rim-ignition grammar (`getSurfaceHoverTokens`), StatCard's sunk-hairline lesson (`TONED_SURFACE_VARIANTS`)

## Problem

`tonal` has no edge. Its base is `shadow-sm ring-1 ring-transparent
dark:ring-white/5` over a `bg-{c}-200/60 dark:bg-{c}-500/15` fill, so in
light mode the card's whole boundary is `shadow-sm`: the fill, the page and
the rim agree and the card floats without a contour. In dark it keeps the
`white/5` haze `subtle` and `simple` also wear — an achromatic film that
ignores which hue the card is wearing, and a third of the weight
`elevated`'s `dark:ring-white/10` carries on a plain card.

The tone palette already holds two hairlines and, measured against the
tonal fill itself, each one fits in only one mode:

- `border` (`border-{c}-300 dark:border-{c}-500/50`) is the *strong* edge —
  what `subtle` nominally asks for and what the Popover arrow uses for a
  borderless variant's tip. Its light half reads (1.184:1); its dark half is
  **1.589:1** against the fill — a frame, not an edge.
- `outlineBorder` (`border-{c}-200 dark:border-{c}-500/25`) is tuned for a
  *white/neutral-900* ground. Its dark half reads (1.129:1); its light half,
  laid on a `{c}-200/60` fill, measures **1.059:1** — the same
  one-step-off-the-fill mistake StatCard recorded when its footer divider
  sank into its own tinted card.

`tonalBorder` is therefore the light half of `border` plus the dark half of
`outlineBorder`: same hue as the fill, one step *further along the direction
the fill already travelled* — deeper in light (the fill went down the ramp
from the page), brighter in dark (the fill went up off `neutral-900`).

## Decisions (user-approved)

1. **Scope: every tonal surface.** One token consumed by the shared variant
   map, so Panel, Toolbar, TimelinePanel and everything built on
   `getSurfaceVariantClasses` gain the edge together. A tonal card that
   reads borderless beside one that has a rim is the drift this kit already
   legislates against.
2. **Weight: match the `outlined` hairline**, measured against the harder
   side (the tonal fill, not the page).
3. **Property: a real 1px `border`**, joining `outlined`/`glass`/`default`/
   `liquid-glass`, not a ring colour on the vestigial `ring-1`.
4. **`simple`, `subtle` and `elevated` are untouched.** `simple` is the
   chrome-less sibling (no shadow either); the fix is `tonal`'s, not the
   whole tinted family's.

## Measurements

Composite over `white` / `neutral-900`, WCAG 2.1 ratio, worst of all 21
`TRUE_COLORS` — the harness `react/src/theme/surfaceHover.test.ts` already
uses (jsdom computes no colours, so arithmetic is the only witness).

| rung | vs its own fill | vs the page |
| --- | --- | --- |
| light `border-{c}-300` (chosen) | **1.184:1** (worst lime) | 1.303:1 |
| dark `border-{c}-500/25` (chosen) | **1.129:1** (worst gray) | 1.297:1 |
| `outlined`'s hairline on its own white/neutral ground | 1.164:1 / 1.297:1 | same |
| rejected — `outlineBorder`'s light half (`{c}-200`) on the tonal fill | 1.059:1 | 1.164:1 |
| rejected — `border`'s dark half (`{c}-500/50`) on the tonal fill | 1.589:1 | 1.849:1 |
| rejected — the current hover rung (`{c}-300/70`) as a resting edge | 1.103:1 | 1.213:1 |

Hover rungs, against what they have to survive:

| rung | vs the resting rim | vs the hovered fill (`{c}-300/70` / `{c}-400/25`) |
| --- | --- | --- |
| light `hover:border-{c}-400` | **1.178:1** | 1.265:1 (worst lime) |
| dark `dark:hover:border-{c}-400/50` | **1.807:1** | 1.613:1 (worst indigo) |
| rejected `hover:ring-{c}-300/70` (today) | lighter than the resting rim | — |

`tone="none"` (fill `bg-white dark:bg-neutral-900`): `border-neutral-200
dark:border-white/10` → 1.259:1 / 1.324:1, the weight `elevated`'s ring
carries on the same ground.

## Design

### 1. The token (`common/theme/Theme.ts`)

`PanelToneConfig` gains `tonalBorder`, generated beside `tonalBg` so fill
and edge are decided in one place:

```ts
tonalBg:     `bg-${color}-200/60 dark:bg-${color}-500/15`,   // unchanged
tonalBorder: `border-${color}-300 dark:border-${color}-500/25`,
```

`getPanelToneStyles("none")` overrides it to
`border-neutral-200 dark:border-white/10` — an untinted card gets the
neutral hairline, matching that getter's `tonalBg` override to
`bg-white dark:bg-neutral-900`.

### 2. The base map, in all four copies

`SURFACE_VARIANT_BASE.tonal` (theme), `variantBaseStyles.tonal`
(React Panel), its Vue copy, and `variantShellStyles.tonal`
(Vue TimelinePanel) become:

```
border shadow-sm ring-1 ring-transparent     // + dark:text-neutral-100 in the Vue copies
```

The `dark:ring-white/5` goes with it: a white halo *outside* a toned edge
reads as two opinions about one border.

Why a border and not the ring's colour:

- **The `currentColor` trap.** `ring-1` survives today only because
  `ring-transparent` is beside it; a ring *colour* handed to a base that
  lost that class paints a near-black rule. `border` with no colour falls
  back to `currentColor` too, but the colour is now mandatory in the same
  branch, and the width never leaves the base — the pairing the `outlined`
  case already enforces ("a real 1px border, not a ring").
- **The Popover arrow draws borders.** `getPanelEdgeChrome` hands the
  borderless variants `palette.border` so the diamond's V is not invisible.
  With the panel edge finally a border too, tonal hands the arrow
  `palette.tonalBorder` and the join stops being ring-outside-the-box vs
  border-inside-it.
- **`active` already lands on a border** — the 2px inset outline paints
  over the hairline, exactly as `outlined`'s comment promises.
- Layout is unchanged: Tailwind's `box-sizing: border-box` keeps the outer
  box; the content box tightens by 1px, which is what every other bordered
  variant already costs.

### 3. The rim ladder (`getSurfaceHoverTokens`)

A resting rim at `-{c}-300` is already darker than today's ignition
(`hover:ring-{c}-300/70`, 1.103:1), so the pointer would *lighten* the edge.
The rim takes the rule the wash already follows — a step measured from
where the surface sits, per `surfaceTintDepth` — and ignites the property it
actually wears:

- `surfaceRimKind.tonal: "ring" → "border"` (and `panelRimKind.tonal` in
  Vue Panel, which describes what *that* file renders).
- In the border branch, non-translucent variants pick their rung by depth:
  `plain`/`sheer` keep `{c}-300 dark:{c}-500/50` (so `outlined` is
  unchanged); `tinted` — i.e. `tonal` — takes
  `hover:border-{c}-400 dark:hover:border-{c}-400/50`.
- The ring branch is left alone: `elevated`, `subtle` and `simple` rest
  rimless, so there is nothing for them to step up from.

The wash, the pressed step, the 2px `active` outline, the disabled veil and
the nested-panel depth wash all stay as they are. The nested wash overlay is
an `absolute inset-0` element, which resolves to the padding box, so a
nested tonal card's wash sits inside its new border instead of tinting it.

### 4. Rollout

| File | Change |
| --- | --- |
| `common/theme/Theme.ts` | `PanelToneConfig.tonalBorder` + generation, the `"none"` override, `SURFACE_VARIANT_BASE.tonal`, `surfaceRimKind.tonal`, the depth-aware border rung, `getRawSurfaceVariantClasses` tonal case (`borderClass ?? palette.tonalBorder`) |
| `react/src/components/Panel.tsx` | `variantBaseStyles.tonal`, tonal branch (`effectiveBorderClass ?? palette.tonalBorder`), `getPanelEdgeChrome` tonal → `palette.tonalBorder` |
| `vue/src/components/Panel.vue` | `variantBaseStyles.tonal`, `panelRimKind.tonal`, tonal branch |
| `react/src/components/Toolbar.tsx`, `vue/src/components/Toolbar.vue` | tonal branch passes `palette.tonalBorder` |
| `vue/src/components/TimelinePanel/TimelinePanel.vue` | `variantShellStyles.tonal` + tonal branch (React's TimelinePanel delegates to Panel) |

Consumers of `getSurfaceVariantClasses` — SmartGridLayout, SplitView,
CondensedStepper, FilterBar, TaskBoardHeader, MultiToggle — pick the edge up
from the shared getter with no edit of their own.

### 5. Safelist (`scripts/generate-safelist.mjs`)

`border-{COLOR}-300` and `dark:border-{COLOR}-500/25` are already declared
(the `outlined`/`liquidBorder` shapes). Two are new, and
`react/src/theme/themeSafelist.test.ts` walks both `getPanelToneStyles` and
`getSurfaceHoverTokens` across all 21 tones, so it fails the build against
the compiled `dist/index.css` if either is not added:

```
@source inline("hover:border-{COLOR}-400");
@source inline("dark:hover:border-{COLOR}-400/50");
```

## Tests

React `react/src/components/Panel.test.tsx`:

1. `tonal` renders `border` **and** `border-{c}-300` **and**
   `dark:border-{c}-500/25` — the width-without-colour and
   colour-without-width traps both, per tone.
2. `borderColor="rose"` replaces the rim colour and keeps the width.
3. `tone="none"` takes `border-neutral-200 dark:border-white/10`.
4. The hover-rim assertions move to the border rungs — `Panel.test.tsx:796-798`
   ("ignites the rim the variant actually wears") and the three `activeTone`
   cases at `:924`, `:947`, `:968` — and now assert
   `not.toMatch(/(?:^|\s)(?:dark:)?hover:ring-/)` for `tonal`.

React `react/src/theme/`: extend `surfaceHover.test.ts`'s harness (or a
sibling `tonalRim.test.ts` reusing it) to walk all 21 tones × both modes and
assert the resting rim (a) moves away from the page in the direction the
fill already moved, (b) clears **1.10:1** against the tonal fill and
**1.20:1** against the page, and (c) is beaten by the hover rung by at least
**1.10:1** rim-to-rim. The test reads the classes the theme emits and
composites them — it fails on the *numbers*, so re-toning a rung cannot
silently un-see the edge.

Vue `vue/src/components/Panel.test.ts`: mirror 1–3.

## Demo

No new control: `PanelPlayground`'s existing variant picker reaches `tonal`,
and `PanelSurfaceControls` already drives tone/borderColor, so the edge can
be flipped live in both modes next to `outlined` for comparison. Verify the
Toolbar and StatCard pages too — both draw tonal surfaces from the shared
token.

## Gates

`npm --prefix react run build` (so `dist/index.css` exists for the
safelist test) → react vitest (Panel, themeSafelist, surfaceHover,
surfaceNone, surfaceTransparency) → `npx tsc --noEmit` → vue vitest +
`npx vue-tsc --noEmit`. `Learnings.md` gains the entry: a borderless
variant gaining an edge has to move its hover rung with it, or the pointer
lightens what it should ignite.

## Out of scope

- `simple` gaining a rim (chrome-less by design) and `subtle` gaining the
  rim its `palette.border` only nominally asks for.
- Any change to the wash, pressed, `active`, disabled, transparency or
  nested-panel ladder maths.
- Per-caller opt-out (`tonalBorder?: boolean`): YAGNI — `borderColor` is
  already the escape hatch, and a caller who wants the old borderless card
  can pass `borderColor` of their own choosing.

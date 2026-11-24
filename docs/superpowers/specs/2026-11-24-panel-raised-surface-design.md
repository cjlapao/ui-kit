# Panel — raisedSurface (forced depth step)

Date: 2026-11-24
Status: approved
Follows: nested-panels ladder (`6b2e080e`), ActivityFeed depth-step rest (`5f88288d`)

## Problem

The nested-panels ladder gives a tinted card its visible depth step: a
`simple`/`tonal`/`subtle`/`glass`/`liquid-glass` Panel inside a matching
(same variant, same tone) parent Panel wears an alpha wash — black 4/8/12%
in light, white 4/8/12% in dark, capped at three steps. The ladder is the
kit's language for "this rests on that".

A Panel placed directly on the neutral *page* background never enters the
ladder — depth 0, no wash — and a `none`/`neutral`-toned card fills with
`bg-white dark:bg-neutral-900`, the same paint as the theme's own neutral
surface. Fill, rim and page agree; the card disappears (observed on the
playground's checkbox-list rows over the neutral page).

## Decisions (user-approved)

1. **`raisedSurface?: boolean`** (default `false`) on `Panel` in both kits —
   a symmetric opt-in to the existing `nestedSurface` opt-out. Rejected
   names: `elevate` (collides with the `elevated` variant), and a new
   variant (the step is a state of the surface, not a different surface).
2. **Tinted set only** — the toggle paints on the ladder's five variants
   (`simple`/`tonal`/`subtle`/`glass`/`liquid-glass`). On `elevated` and
   `outlined` it is a documented no-op: they separate from the page via
   fill + rim + shadow. On `none`/`default` likewise.
3. **Force survives the caller's own paint** — unlike the auto ladder, the
   forced step is not cancelled by `backgroundColor` or
   `nestedSurface={false}`. The toggle is the caller explicitly asking for
   the step; `backgroundColor="neutral"` maps to white/neutral-900, exactly
   the invisibility case being fixed.
4. **Boolean, not a step picker** — YAGNI; can widen to `1|2|3` later.

## Design

### Ladder helper (`common/theme/nestedPanel.ts`)

`nestedPanelSurface(parent, variant, tone, eligible, force = false)` gains a
fifth argument. The auto ladder is computed exactly as today; then

- `depth = force && TINTED_VARIANTS.includes(variant) ? Math.max(autoDepth, 1) : autoDepth`

The forced step is a **floor, not an override**: a card physically nested
two levels deep keeps its 8% wash — the toggle never removes a step, only
guarantees at least one. Existing callers (React/Vue Panel, ActivityFeed)
keep passing four arguments and are unchanged.

### Publish semantics

The Panel publishes its resolved `nestedPanel` (forced depth included) into
the nested-panel context, so a matching child of a raised panel steps to
depth 2 off it — the ladder continues from a forced step like any other. A
raised panel whose `backgroundColor` is set still publishes
`eligible: false`, so the ladder does **not** continue through a custom
fill (a child cannot assume it matches paint it cannot see).

### What stays untouched

- The wash rendering condition (`depth > 0 && !isOverlay`): overlay-media
  panels never wash, forced or not.
- The cap at step 3, `aria-hidden` + `data-nested-panel-wash`, the
  `pointer-events-none absolute inset-0` overlay div — same DOM, same
  themes. Both themes are inherent: the wash is an alpha overlay,
  `bg-black/[…]` light / `dark:bg-white/[…]`.
- The transparency precomposition path — the wash is its own element, not a
  background utility on the section.

### API

React (`react/src/components/Panel.tsx`):

- `raisedSurface?: boolean` on `PanelProps`, JSDoc: force at least the first
  nested-panels depth step, even outside a matching parent panel — the fix
  for a tinted card on a neutral page background where fill and rim agree
  with the page and disappear. No-op outside the ladder's tinted variants;
  beats `nestedSurface={false}` and `backgroundColor`; floors, never
  lowers.

Vue (`vue/src/components/Panel.vue`): same prop + JSDoc, `withDefaults`
carries `raisedSurface: false`, and the `nestedPanel` computed passes
`props.raisedSurface` as `force`.

### Tests

React `Panel.nesting.test.tsx` + Vue `Panel.nesting.test.ts` mirror:

1. Forced step-1 wash with no parent, on each of the five tinted variants.
2. Wash survives `backgroundColor` and `nestedSurface={false}`.
3. No-op on `elevated` (and `none`) — no wash element at all.
4. Floor semantics: forced + auto-nested keeps step 2 (`[0.08]`).
5. Ladder continues off a raised parent: matching child steps to 2.

### Demo

`PanelPlayground.tsx`: a `ToggleRow` for `raisedSurface` (same pattern as
`disabledVeil`/`active`) so the card can be flipped live over the demo's
neutral page background. `PanelPage.tsx`: one-sentence mention alongside
the nesting copy.

## Gates

`npx tsc --noEmit` (react) + Panel suites; `npx vue-tsc --noEmit` (vue) +
Vue Panel suites; demo tsc baseline. Commits by explicit pathspec.

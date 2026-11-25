# Panel `tonal` resting edge — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-25-panel-tonal-border-design.md`](../specs/2026-11-25-panel-tonal-border-design.md)

Rule of the whole change: **the tone decides the edge, and the edge is one step
further along the direction the fill already travelled** — `{c}-300` where the
fill went down to `{c}-200/60`, `{c}-500/25` where it went up to `{c}-500/15`.
Everything else about `tonal` (fill, shadow, wash, pressed, `active` outline,
veil, nesting) stays where it is.

## Task 1 — the theme owns the rung (`common/theme/Theme.ts`)

- [x] `PanelToneConfig` gains `tonalBorder: string`, docstringed as *the edge the
      tonal fill needs*, not a copy of `border`: the light half is `border`'s
      rung, the dark half is `outlineBorder`'s, and the two rows of the measured
      table are quoted so nobody "simplifies" it back to one of them.
- [x] `theme.panel[color]`: `tonalBorder: \`border-${color}-300 dark:border-${color}-500/25\``.
- [x] `getPanelToneStyles("none")` overrides it to `border-neutral-200 dark:border-white/10`
      beside the existing `tonalBg` override.
- [x] `SURFACE_VARIANT_BASE.tonal`: `border shadow-sm ring-1 ring-transparent`
      (the `dark:ring-white/5` haze goes — the tone edge does that job now).
- [x] `surfaceRimKind.tonal`: `"ring"` → `"border"`; the table's comment gains the
      sentence that the rim ignites the property the variant actually wears.
- [x] `getSurfaceHoverTokens`' border branch picks its rung by
      `surfaceTintDepth[variant]` for non-translucent variants: `plain`/`sheer`
      keep `{c}-300 dark:{c}-500/50` (so `outlined` is byte-identical), `tinted`
      takes `hover:border-{c}-400 dark:hover:border-{c}-400/50`. The ring branch
      is untouched — `elevated`, `subtle`, `simple` rest rimless, so they have no
      rung to step up from.
- [x] `getRawSurfaceVariantClasses`' `tonal` case: `borderClass ?? palette.tonalBorder`
      where it passed `borderClass ?? ""`.
- [x] `gate`: `npx tsc --noEmit` in `react/` and `vue/` (the type is required, so
      any missed generation site is a compile error, not a silent no-edge).

## Task 2 — the two Panel shells (`react/src/components/Panel.tsx`, `vue/src/components/Panel.vue`)

- [x] React `variantBaseStyles.tonal` mirrors `SURFACE_VARIANT_BASE.tonal`.
- [x] React tonal branch: `effectiveBorderClass ?? palette.tonalBorder` (it passed
      no rim at all), comment updated — `borderColor` still overrides it.
- [x] React `getPanelEdgeChrome` `tonal` case: `border: palette.tonalBorder`
      (was `palette.border`) so the Popover arrow's V and the panel edge are the
      same 1px border in the same colour; `subtle`/`simple` keep `palette.border`
      because they are still genuinely borderless.
- [x] Vue `variantBaseStyles.tonal` gains `border`, loses `dark:ring-white/5`,
      keeps its text tokens; `panelRimKind.tonal` → `"border"` with the existing
      "this kit draws what it draws" comment extended.
- [x] Vue tonal branch: `effectiveBorderClass.value ?? palette.value.tonalBorder`.
- [x] `gate`: `npx vitest run src/components/Panel.test.tsx` (React) and the Vue
      Panel suite — expected failures are exactly the four hover-rim assertions
      Task 5 rewrites; nothing else moves.

## Task 3 — the other surfaces that paint `tonal` themselves

- [x] `react/src/components/Toolbar.tsx` + `vue/src/components/Toolbar.vue`:
      tonal branch passes `palette.tonalBorder` beside `palette.tonalBg`.
- [x] `vue/src/components/TimelinePanel/TimelinePanel.vue`: `variantShellStyles.tonal`
      gains `border`, drops `dark:ring-white/5`; its tonal case passes the colour.
      (React's TimelinePanel delegates to `Panel` — verified, no edit.)
- [x] Confirm the `getSurfaceVariantClasses` consumers need nothing: SmartGridLayout,
      SplitView, CondensedStepper, FilterBar, TaskBoardHeader, MultiToggle.
- [x] `gate`: `npx vitest run` on the Toolbar, TimelinePanel and SmartGrid suites.

## Task 4 — the stylesheet has to contain the classes (`scripts/generate-safelist.mjs`)

- [x] `@source inline("hover:border-{COLOR}-400");` and
      `@source inline("dark:hover:border-{COLOR}-400/50");` — the resting pair
      (`border-{COLOR}-300`, `dark:border-{COLOR}-500/25`) is already declared by
      `outlined`/`liquidBorder`, and `dark:border-white/10` comes in as a literal
      through `SURFACE_GLASS_RIM`; verify all five survive into `dist/index.css`
      rather than trusting the generator's source.
      *Landed, with both halves of the first clause already present*: only
      `dark:hover:border-{COLOR}-400/50` was genuinely new, and the shape that
      looked missing (`hover:border-{COLOR}-400`) is declared twice above it.
      The missing step was procedural — `common/safelist.css` is a committed
      generated file, so the class stayed out of the bundle until
      `node scripts/generate-safelist.mjs` was run by hand.
- [x] `gate`: `npm --prefix react run build`, then
      `npx vitest run src/theme/themeSafelist.test.ts` green against the **fresh**
      stylesheet (a green run against a stale `dist` means nothing).

## Task 5 — tests: the class list and the numbers

- [x] `react/src/components/Panel.test.tsx`: new block — `tonal` carries `border`
      **and** `border-{c}-300` **and** `dark:border-{c}-500/25` (both traps at
      once: width without colour, colour without width); `borderColor="rose"`
      replaces the colour and keeps the width; `tone="none"` takes
      `border-neutral-200 dark:border-white/10`.
- [x] Move the four hover-rim assertions (`:796-798`, `:924`, `:947`, `:968`) to
      `hover:border-{c}-400 dark:hover:border-{c}-400/50` and assert
      `not.toMatch(/(?:^|\s)(?:dark:)?hover:ring-/)` on `tonal` — the rim now
      ignites one property.
- [x] `react/src/theme/tonalRim.test.ts` (new), reusing `surfaceHover.test.ts`'s
      composite harness: for all 21 tones × both modes the resting rim moves
      away from the page in the direction the fill already moved, clears
      **1.10:1** against the tonal fill and **1.20:1** against the page, and the
      hover rung beats it by **1.10:1** rim-to-rim. Asserts on numbers read out of
      the emitted classes, so a re-tone cannot quietly un-see the edge.
- [x] `vue/src/components/Panel.test.ts`: mirror the React class assertions.
- [x] `gate`: those suites green, plus `surfaceNone`, `surfaceTransparency`,
      `surfaceHover` and `Panel.nesting` unchanged — the nested wash still sits
      inside the new border.

## Task 6 — the record

- [x] `Learnings.md`: dated row — a borderless variant gaining a resting edge has
      to move its hover rung with it, or the pointer *lightens* the thing it is
      supposed to ignite; plus the measured-rung table and the fact that the two
      existing hairlines each fitted in only one mode.
- [x] `docs/design_system/theme.md` if it enumerates the panel tone slots.
- [x] `gate`: full `npx vitest run` in `react/` matches the pre-existing failure
      baseline and adds nothing; `npx eslint src` clean; `npx vue-tsc --noEmit`
      clean. Commit by explicit pathspec — never `git add -A`: this tree carries
      another session's Menu/DiagramFlow/tooltip work, and the pre-commit git
      calls need `TMPDIR=/tmp` (the harness `TMPDIR` is read-only).

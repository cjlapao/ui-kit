# Panel active state — implementation plan

> Spec: `../specs/2026-11-19-panel-active-state-design.md` (approved 2026-11-19).
> For agentic workers: implement task-by-task; each task ends with its check green.

**Goal:** `Panel` gains `active?: boolean` — a 2px inset rim in the active hue
plus a variant-aware light tone fill, matching the Knowledge Explorer
selected-card look as a first-class component state (React kit only).

**Architecture:** the rim grammar joins the shared theme getters in `common/`
(alongside `getSurfaceHoverTokens`), so the safelist generator and its
stylesheet test walk it like every other tone-derived class. The fill swap
rides the existing per-variant fill slot in `Panel.tsx`, before the
`getSurfaceTransparencyClasses` rewrite, exactly like `backgroundColor` and
the hover wash do.

## Task 1: Theme getter + safelist shapes

- [ ] Add `SurfaceActiveTokens` + `getSurfaceActiveTokens(tone: TrueColor)`
      to `common/theme/Theme.ts`, beside `getSurfaceHoverTokens`:
      `rim: "outline-2 -outline-offset-2 outline-${tone}-500 dark:outline-${tone}-400"`.
- [ ] `scripts/generate-safelist.mjs`: a Panel-active section emitting
      `@source inline("outline-{COLOR}-500")` and
      `@source inline("dark:outline-{COLOR}-400")`.
- [ ] `react/src/theme/themeSafelist.test.ts`: import the getter and walk it
      per tone in `generatedClasses()`.
- [ ] `node scripts/generate-safelist.mjs` regenerates `common/safelist.css`
      (diff shows only the two new shapes).

## Task 2: Panel component

- [ ] `react/src/components/Panel.tsx`: `active?: boolean` prop (JSDoc:
      sustained selected state; caller owns the toggle ARIA; distinct from
      the pressed step), destructured `active = false` so it never spreads
      to the DOM.
- [ ] `activeHue = borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone)`;
      `activePalette = getPanelToneStyles(activeHue)`;
      `activeFill` = active palette's per-variant fill (`subtleBg` for
      none/elevated/outlined/subtle, `tonalBg` for tonal/simple, `glassBg`
      for glass/default, `liquidBg` for liquid-glass), `undefined` when an
      explicit `backgroundColor` is given or `active` is false.
- [ ] Wire `activeFill` into each variant branch's fill slot (replacing the
      variant's own bg class where it lives inside a base string).
- [ ] Rim: `getSurfaceActiveTokens(activeHue).rim` appended when `active`,
      outside the transparency rewrite (outline is not a background).
- [ ] `data-active={active || undefined}` next to `data-variant`/`data-tone`.

## Task 3: Tests

- [ ] `Panel.test.tsx` — `describe("Panel — active state")` with the spec's
      eight cases (off by default; cyan rim+fill+tint; blue floor;
      `borderColor` override; per-variant fill map; `backgroundColor`
      precedence; coexists with hoverable/pressed; visible under disabled).
- [ ] Run `cd react && npx vitest run src/components/Panel.test.tsx` → green.

## Task 4: Build guardrails, playground, docs

- [ ] `cd react && npm run build` (fresh `dist/index.css` with the new
      safelist shapes), then `npx vitest run src/theme/themeSafelist.test.ts` → green.
- [ ] `PanelPlayground.tsx`: `Active` ToggleRow in the States group.
- [ ] `docs/test_suites/panel.md`: the active cases.
- [ ] `Learnings.md`: dated row recording the React-only `active` and the
      Vue `Panel.vue` divergence (SidePanel precedent).

## Task 5: Verification & commit

- [ ] `cd react && npm run lint` → clean (tsc + eslint).
- [ ] Focused suites: `npx vitest run src/components/Panel.test.tsx src/theme/themeSafelist.test.ts`.
- [ ] One feature commit (spec already committed separately).

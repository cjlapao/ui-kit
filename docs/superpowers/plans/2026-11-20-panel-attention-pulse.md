# Panel attention pulse — implementation plan

> Spec: `../specs/2026-11-20-panel-attention-pulse-design.md` (approved
> 2026-11-20). For agentic workers: implement task-by-task; each task ends
> with its check green.

**Goal:** `Panel` gains `pulse?: boolean` — an inward rim glow that swells
from the card's own edge in the accent hue, the Pill's attention mechanism
rendered on a container surface (React kit only).

**Architecture:** no shared-theme work: the hue rides inline custom
properties (`--panel-glow`/`--panel-glow-dark`), so the keyframes are
colour-agnostic, the safelist stays untouched, and the only new raw hook is
`.panel-pulse` in `react/src/styles.css`, guarded via `CONTRACT_PREFIXES`.

## Task 1: Stylesheet

- [ ] `react/src/styles.css`: new `---- Panel attention pulse ----` section
      directly after the pill's (it can point at the pill's comment instead
      of repeating the inset rationale): `.panel-pulse` +
      `:where(.dark) .panel-pulse` resolving `--_panel-glow` from
      `--panel-glow`/`--panel-glow-dark` (fallback `currentColor`),
      `animation: panel-pulse 2s ease-in-out infinite`.
- [ ] `@keyframes panel-pulse`: `0%,100%` → `inset 0 0 0 0
      color-mix(in srgb, var(--_panel-glow) 55%, transparent)`; `55%` →
      `inset 0 0 10px 3px color-mix(… 38%)`; every stop re-composites the
      five `--tw-*-shadow`/`--tw-*-ring-shadow` variables with `0 0 #0000`
      fallbacks first (elevated's `shadow-xl ring-1`, the subtle/tonal
      rings, the focus ring must survive).
- [ ] `@media (prefers-reduced-motion: reduce)`: `animation: none` + static
      `inset 0 0 7px 2px color-mix(… 32%)` glow.
- [ ] `react/src/styles.contract.test.ts`: `CONTRACT_PREFIXES` gains
      `"panel-"` (the `pill-` precedent; `panel-` tokens appear in no
      non-test source today, so no unrelated rule is demanded).

## Task 2: Panel component

- [ ] `react/src/components/Panel.tsx`: `pulse?: boolean` prop (JSDoc in the
      pill's voice: glows inward from its rim, never spills into the layout,
      off while `disabled`, reduced-motion keeps the static glow, hue is the
      shared accent rule), destructured `pulse = false`.
- [ ] `const pulsing = pulse && !disabled;` beside the active derivations;
      hue reuses `activeHue` — one accent rule for rim and glow.
- [ ] `resolvedStyle`: while `pulsing`, add the two custom properties via
      the Pill's spread-as-cast idiom, after the caller's `style` is spread
      so caller keys win/lose deliberately (glow keys are ours).
- [ ] Section `classNames` gain `pulsing && "panel-pulse"` next to
      `activeRim`. No `data-pulse`.

## Task 3: Tests

- [ ] `Panel.test.tsx` — `describe("Panel — attention pulse", …)` mirroring
      `Pill.test.tsx › pulse`: off by default; class + `--panel-glow`/
      `--panel-glow-dark` on; accent-rule hues (untinted → blue, `borderColor`
      wins over `tone`); disabled wins; `active` + `pulse` coexist
      (`outline-2` and `panel-pulse` both present); pulses on `glass`,
      `liquid-glass`, and while clickable with the focus-ring classes intact.
- [ ] `cd react && TMPDIR=$PWD/.tmp node_modules/.bin/vitest run
      src/components/Panel.test.tsx src/styles.contract.test.ts` → green.

## Task 4: Build guardrails, playground, docs

- [ ] `cd react && TMPDIR=$PWD/.tmp node_modules/.bin/tsup` — fresh
      `dist/index.css` carrying `.panel-pulse`; then
      `node_modules/.bin/vitest run src/theme/themeSafelist.test.ts` → green.
- [ ] `PanelPlayground.tsx`: `Pulse` `ToggleRow` in the States group (user
      reminder: do not forget the playground), wired to the prop.
- [ ] `docs/test_suites/panel.md`: `TC-PNL-049`… append-only pulse cases.
- [ ] `Learnings.md`: dated Cross-kit row — React-only, Vue knowingly lags
      (active-state row is the sibling); note the no-safelist-needed
      consequence of riding hue on custom properties.

## Task 5: Verification & commit

- [ ] `node_modules/.bin/tsc --noEmit` (only the known pre-existing
      SideMenu.test.tsx TS2322), `node_modules/.bin/eslint src` clean.
- [ ] Full suite: no failures beyond the six pre-existing baseline ones.
- [ ] `rm -rf react/.tmp`; stage only this feature's files; commit
      `feat(react): Panel attention pulse — inward rim glow in the accent hue`.

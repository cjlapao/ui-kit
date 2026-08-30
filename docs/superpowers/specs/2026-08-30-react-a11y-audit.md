# React Kit — Accessibility (a11y) Audit & Remediation Spec

**Date:** 2026-08-30 · **Status:** draft (pending user review) · **Scope:**
`react/` only (`@cjlapao/ui-kit`) — the shared `common/` sources are in scope
only where the React kit consumes them. Vue kit excluded (separate pass later).
**Standard:** WCAG 2.1 AA (perceived as the baseline for "the standard") plus
the ARIA Authoring Practices (APG) patterns for composite widgets.

**Audit method (all evidence generated 2026-08-30, reproducible):**

| Pass | Tool | Result |
| --- | --- | --- |
| Static JSX | `eslint-plugin-jsx-a11y` (all 60 rules at error) via scratch harness in `.a11y-audit/` | **172 findings** across 144 files (raw: `.a11y-audit/results.json`) |
| Runtime markup | `axe-core` over SSR-rendered components (scratch harness `react/a11y-axe.scan.test.tsx`, components rendered with no props) | 62 of 152 files rendered; **16 with violations** |
| Static census | grep over `react/src/components` (aria/role census, keyboard handlers, focus traps, `focus-visible`, `prefers-reduced-motion`, Escape handling, `getByRole` in tests) | see §3 |

> The scratch harnesses are throw-away (`.a11y-audit/`, `react/a11y-axe.scan.test.tsx` —
> not committed); §6 Phase B makes them permanent.

---

## 1. Headline conclusion

The kit is **a11y-aware but not a11y-complete**. There is a real ARIA
foundation (213× `aria-label`, 85× `aria-expanded`, roving tabindex in
Table/DatePicker, focus traps in Modal/Popover/DropdownMenu, 15
`prefers-reduced-motion` guards, 20× `aria-live`, 47 test files using
`getByRole`), but three classes of genuine gaps exist:

1. **Keyboard access holes** — ~30 interactive `<div>`s carry
   mouse handlers without keyboard handlers or proper roles (the single
   largest gap; ~60 of the 172 static findings).
2. **ARIA misuse in DatePicker** — attributes not supported by the
   element's role (`aria-expanded` on the text input, `aria-selected` on
   `<button>` days) — confirmed by both the lint rule
   (`role-supports-aria-props`) and axe (`aria-allowed-attr`).
3. **No gates** — nothing in CI or dev-mode warnings enforces the rules
   above, so regressions are invisible.

A smaller set of usage-dependent gaps (controls that only get an
accessible name when the consumer passes `aria-label`) argues for
**dev-time warnings**, not code changes.

## 2. Findings — P0 (actual WCAG/ARIA violations)

Each item: WCAG/ARIA clause · evidence · affected files.

### P0-1 Interactive elements without keyboard access
- **WCAG 2.1.1 (Keyboard) / 2.4.3 (Focus Order); ARIA APG.**
- Evidence: `jsx-a11y/click-events-have-key-events` (15) +
  `no-static-element-interactions` (32) +
  `no-noninteractive-element-interactions` (10).
- Affected (top offenders by distinct finding): `DropdownMenu`, `Picker`,
  `Select` (wrapper span), `SideMenu` (nav rows), `SplitView` (drag handle),
  `StatChartTile`, `Stepper`, `Carousel`, `CollapsiblePanel`, `Accordion`,
  `DatePicker/CalendarPanel`, `InfoRow`, `DetailItemCard`,
  `MultiProgressBar`, `SidePanel`.
- **Triage note:** a subset is likely false-positive at the file level —
  e.g. `Select`'s wrapper routes a click to `select.focus()` and the inner
  native `<select>` is the real control; `Modal`'s backdrop is a dismiss
  affordance. Each widget needs a 10-minute manual pass to classify:
  (a) already fine (wrapper pattern), (b) missing keyboard handler,
  (c) missing role. Expected outcome: ~10–15 widgets need real fixes
  (add `role`, `tabIndex`, `onKeyDown`, or restructure to a native
  element), the rest get an eslint `/* jsx-a11y: ... */` justification
  comment so the gate stays meaningful.

### P0-2 DatePicker ARIA attribute misuse
- **ARIA spec "aria-allowed-attr"; WCAG 4.1.2 (Name, Role, Value).**
- Evidence: `jsx-a11y/role-supports-aria-props` (4) + axe
  `aria-allowed-attr` (critical).
  - `DatePicker.tsx:662` — `aria-expanded` on the text `input` (textbox
    role does not support it; belongs on a combobox trigger).
  - `CalendarPanel.tsx:438`, `DayGrid.tsx:258` — `aria-selected` on day
    `<button>`s (button supports `aria-pressed`, not `aria-selected`).
- Fix: model the field as `role="combobox"` + `aria-haspopup="dialog"` on
  the trigger (APG date-picker pattern) or move the state attributes to a
  wrapping button; days get `aria-pressed` (or an APG gridcell treatment).

### P0-3 Interactive ARIA containers not focusable
- **WCAG 2.1.1; ARIA APG (menu / radiogroup / tree must be reachable).**
- Evidence: `jsx-a11y/interactive-supports-focus` (3):
  `DropdownMenu.tsx:442` (`role="menu"`), `Rating.tsx:179`
  (`role="radiogroup"`), `Tree.tsx:606` (`role="tree"`).
- Fix: container gets `tabIndex={-1}` + focus management (focus moves in
  on open / first item focused per APG). `Rating` is a small win;
  `Tree`/`DropdownMenu` already have item-level focus — they need the
  container-level focus stop.

### P0-4 `aria-hidden` on focusable elements
- **WCAG 4.1.2 / axe `aria-hiddehidden` class of errors.**
- Evidence: `jsx-a11y/no-aria-hidden-on-focusable` (4) in `Table.tsx:1666`
  (hidden cells in a focusable row/grid context).
- Fix: scope `aria-hidden` off the focusable node (wrap the hidden part),
  or make the node non-focusable when hidden.

### P0-5 `tabIndex` on non-interactive elements (focus-order pollution)
- **WCAG 2.4.3 (Focus Order).**
- Evidence: `jsx-a11y/no-noninteractive-tabindex` (5): `Tooltip.tsx:74`
  (worst: a non-interactive tooltip is a focus stop that SR users hit with
  nothing actionable), `DetailItemCard.tsx:129`, `InfoRow.tsx:359`,
  `SmartGridLayout.tsx:4077`, `TooltipWrapper` path.
- Fix: remove `tabIndex` unless the element is actually interactive; for
  cards that *are* clickable, make them P0-1-class interactive elements
  (role=button + key handling) instead.

### P0-6 Missing accessible names on form controls (usage-dependent)
- **WCAG 1.3.1 / 3.3.2 / 4.1.2 — axe `label`/`button-name`/`select-name`
  (critical).**
- Evidence: `jsx-a11y/control-has-associated-label` (13) in `DayGrid`,
  `InlinePanel`, `Modal`, `Picker`, `SearchBar`, `Table`, `TagPicker`, …
  and the no-props axe pass (Button, Checkbox, Combobox, Input,
  MarkdownEditor, PasswordInput, Select, Textarea, Toggle).
- **Assessment:** most are *consumer* duties (`aria-label` props exist),
  not kit defects — but the kit currently renders perfectly happily
  unlabeled when the consumer forgets. Fix = dev warnings (P1-2), plus
  genuine kit fixes where a label exists but isn't wired (verify
  `FormField`/`Input` `htmlFor` linkage — only 8 `htmlFor` in the whole
  kit; the `useId`-based linkage should be verified end-to-end in the
  P1-2 pass).

## 3. Findings — P1 (robustness & support gaps)

### P1-1 No a11y CI gates
Nothing in `npm run lint`/test enforces a11y. The scratch harnesses in the
audit header prove the tooling works in-repo (jsx-a11y flat config;
axe-core over vitest jsdom). Permanent versions in Phase B.

### P1-2 No dev-time a11y warnings
The kit has a dev-warn infra only for i18n (`common/i18n/warn.ts`).
Recommended: a small `common/a11y/warn.ts` (`devWarnA11yOnce`) used by
controls to warn when rendered with **no accessible name** (no `aria-label`
and no non-empty text children), dialogs rendered without a title, and
`aria-hidden` + focusable detected in the same element tree. One-time per
component, dev-only, never throws — same contract as the i18n warns.

### P1-3 SVG icons with `role="img"` and no text (7×)
- Evidence: axe `svg-img-alt` (serious) in `MarkdownEditor.tsx` (toolbar
  icons).
- Fix: `aria-hidden` on decorative icons (correct default) or
  `aria-label`/`<title>` where meaningful.

### P1-4 `autoFocus`
- Evidence: `jsx-a11y/no-autofocus` (1) `SmartGridLayout.tsx:3373`.
- Triage: intentional? If it restores edit focus, replace with an explicit
  `ref.focus()` effect guarded by reduced-attention context; otherwise
  drop.

### P1-5 Focus-visible verification for 7 files
Heuristic found `outline-none` with no `focus:`/`focus-visible:`/token
focus classes in-file: `SplitView`, `SmartInput`, `ConnectionFlowSvg`,
`Picker`, `Popover`, `Select`, `TagPicker`. Manual spot-check showed most
are covered by theme-token focus classes (`tokens.focusRing`,
`group-focus-within`) — **verify the drag/interactive `div`s in
`SplitView`, `SmartInput`, `ConnectionFlowSvg` actually show a visible
focus indicator** (WCAG 2.4.7); the other four are expected false
positives.

### P1-6 Color contrast — unverified
jsdom has no layout, so the audit cannot check WCAG 1.4.3/1.4.6. The theme
tokens already encode high-contrast intent for glass surfaces
(`common/theme/Theme.ts`), but no contrast assertion exists anywhere.
Phase C: add a contrast test over the token palette (pairs × light/dark)
and a visual pass for the demo.

### P1-7 No a11y documentation / keyboard reference
Nothing documents per-widget keyboard operation (the APG expectation for
composite widgets). Phase C: an a11y guide (support statement, keyboard
table, SR known-behaviors, how to label controls in consumer apps).

## 4. Findings — P2 (hygiene, low urgency)

- `jsx-a11y/prefer-tag-over-role` (63): prefer native tags over
  `role` where feasible (`<button>` over `role="button"`, `<img>` over
  `role="img"`). Many are legitimate composites (keep role + document).
  Do during P0 widget restructures; don't do as a standalone sweep.
- `jsx-a11y/label-has-for` (12): mixed nesting/`id` label association —
  config-level nuance; resolves naturally when P1-2 verifies `htmlFor`
  linkage.
- `jsx-a11y/no-interactive-element-to-noninteractive-role` (4):
  `EcgMonitor`, `SmartGridLayout`, `ChartRoot` put non-interactive roles
  on interactive wrappers — decide intent (interactive canvas vs
  decorative), likely `role="img"` + `aria-label` on the chart root with
  `tabIndex` removed or keyboard support added.

## 5. Current state — what already holds up (no action)

- **Focus traps + restore** (verified 2026-08-30): `Modal` and
  `InlinePanel` capture `document.activeElement` on open and restore it on
  close (`previouslyFocusedRef`); `Popover` returns focus to the trigger on
  close; `DropdownMenu` restores on Escape/item activation and
  deliberately *not* on outside click (documented: restoring would steal
  focus and scroll back). `Panel` traps. All four hold up — Phase A keeps
  the restore tests, no fix needed.
- **Escape handling**: 17 components handle `Escape` (dialogs, menus,
  popovers).
- **Motion**: 15 `prefers-reduced-motion` guards in `styles.css`.
- **Live regions**: 20× `aria-live` (toasts, status announcements).
- **Roles/structure**: proper `dialog`/`alertdialog`, `menu`/`menuitem`,
  `tree`/`treeitem`, `grid`, `combobox` usage with `aria-activedescendant`
  (9×) in the complex widgets.
- **Test discipline**: 47 test files assert via `getByRole` — a11y-aware
  tests exist; they just don't cover the gaps in §2.

## 6. Remediation plan

### Phase A — P0 fixes (estimate: 3–5 days)
Per-widget, ordered by exposure:
1. `DatePicker` ARIA rework (P0-2) + its three sub-files.
2. Keyboard/role triage & fixes for the P0-1 list (10–15 widgets):
   `DropdownMenu`, `Picker`, `SideMenu`, `SplitView`, `Stepper`,
   `Carousel`, `StatChartTile`, `CollapsiblePanel`, `TagPicker`,
   `InfoRow`/`DetailItemCard` (make clickable cards proper buttons or
   drop the click), `SmartInput`.
3. Focusable containers: `DropdownMenu`/`Rating`/`Tree` (P0-3).
4. `Table` `aria-hidden` scoping (P0-4); `tabIndex` removals (P0-5) incl.
   `Tooltip`.
5. Add regression tests for the verified focus-restore behaviour (§5) —
   capture/restore is implemented; make it test-enforced.
**Gate per task:** new/updated `getByRole` + keyboard-event tests
(`fireEvent.keyDown`) for each touched widget; jsx-a11y findings for the
file at zero (or justified).
**Status (2026-08-30):** steps 1–5 complete. Commits: `d037ee1`
(DatePicker, DropdownMenu), `ba63e2c` (Picker, SideMenu), `7dab14e`
(widget batch: SplitView, Stepper, Carousel, StatChartTile,
CollapsiblePanel, SmartInput, TagPicker), `0214eb2` (Tree/Rating/Table
containers + labels, Tooltip/InfoRow/DetailItemCard anchors), `73e3697`
(effective lint exemptions). Verified: every Phase A touched file at
**zero non-P2 jsx-a11y findings** under the scratch all-rules config
(only `prefer-tag-over-role` P2 items remain, for the Phase B config);
full suite 2974/2974; demo build green. Residual, deliberately not
touched: `SmartGridLayout.tsx` (18 findings: `autoFocus`, static
interactions, `tabIndex`) — the file is mid-change in the working tree;
fix after that work lands, or in Phase B via documented exceptions.

**Status (Phase B, 2026-08-30):** all three Phase B items landed.
1. **ESLint jsx-a11y gate** — `react/eslint.config.mjs` (flat config,
   tsParser, `jsx-a11y` recommended set + `no-aria-hidden-on-focusable`
   at error; `label-has-associated-control` demoted to warn — its static
   association check false-positives on labels wrapping kit controls and
   the demo pages; the complementary `control-has-associated-label`
   stays error; unused disable directives report at warn; per-file
   override for the mid-change `SmartGridLayout.tsx`). `react/package.json`
   `lint` script is now `tsc --noEmit && eslint src`; devDeps added
   (`eslint`, `eslint-plugin-jsx-a11y`, `@typescript-eslint/parser`,
   `axe-core`). Gate proven both ways: baseline 0 errors, a planted
   violation file fails with 4 errors.
2. **axe-core harness** — `react/src/a11y/axe-scan.test.tsx`: 47-fixture
   props table (Modal, InlinePanel, Popover, DropdownMenu, Picker,
   TagPicker, Table, Tree, TreeView, Stepper, Carousel, SplitView,
   SidePanel, SideMenu, …) asserting no serious/critical violations;
   `color-contrast` disabled (jsdom has no computed colour). It caught a
   real defect: TagPicker rendered chip remove-`<button>`s *inside* the
   trigger `<button>` (invalid nested HTML, axe `nested-interactive`).
   Fixed: the trigger is now a plain non-interactive div (mouse
   convenience click only, justified eslint-disable) and the chevron is
   the real `aria-haspopup=listbox` button carrying
   `aria-expanded/controls/invalid/busy` + ArrowDown-to-open.
3. **Dev warnings** — `common/a11y/warn.ts` (`devWarnA11yOnce`,
   dev-only, deduped, never throws — same contract as `i18n/warn.ts`)
   wired into Button/IconButton (name + aria-hidden-on-focusable),
   Toggle/Checkbox/Tree (missing accessible name), Modal (headless
   without ariaLabel), SidePanel (missing title); unit-tested in
   `react/src/a11y/warn.test.ts`.
Gate: `npm run lint` and `npm test` both fail on new a11y violations —
verified (planted jsx-a11y violations fail lint; the axe harness fails
the suite on new serious/critical violations).

### Phase B — gates & warnings (estimate: 1–2 days)
1. **ESLint jsx-a11y in CI**: add to `react/` lint (eslint 9 flat config,
   `jsx-a11y` recommended set at error + the P0 rules above; allow
   inline `// eslint-disable-next-line jsx-a11y/…` with a *reason*
   convention for legitimate composites).
2. **axe-core vitest harness**: promote `a11y-axe.scan.test.tsx` to a
   permanent `react/src/a11y/axe-scan.test.tsx` with a per-component
   **props fixture table** (covers the 90 currently-skipped components:
   Table, DropdownMenu, Modal, SideMenu, … rendered with realistic
   props; `color-contrast` stays disabled in jsdom).
3. **Dev warnings** (P1-2): `common/a11y/warn.ts` + wiring into
   Button/IconButton/form controls/dialogs.
**Gate:** `npm run lint` and `npm test` both fail on new a11y violations.

### Phase C — verification & docs (estimate: 2–3 days)
1. Contrast test over theme token pairs (P1-6) + visual light/dark pass
   of the demo.
2. A11y guide page in the demo (React docs registry, `slug: "a11y"`,
   Utilities category — same pattern as the i18n page): support
   statement (target WCAG 2.1 AA), per-widget keyboard table, SR
   known-behaviors, consumer labeling guide.
3. Manual SR pass checklist (NVDA + VoiceOver, 10-page run through the
   demo) — documented as a release gate for future changes.
4. Fix `svg-img-alt` (P1-3), `autoFocus` (P1-4), P1-5 verification, P2
   sweep opportunistically.

**Definition of done:** P0 findings at zero with tests; lint+axe gates
in CI; dev warnings live; a11y guide published; contrast asserted for
tokens; SR checklist documented.

## 7. Known limitations of this audit

- Static lint has a false-positive rate on composite patterns (wrapper
  divs that delegate to a native control) — P0-1 numbers are *upper
  bounds* pending triage.
- The axe pass renders 62/152 components with no props; interactive
  states (open menus, filled tables, focused items) are not covered —
  Phase B's fixture harness closes most of that.
- Color contrast and real screen-reader behavior cannot be asserted in
  jsdom — Phase C items 1 & 3 are the only true verification.
- Vue kit, and the kit's *consumer* usage patterns, are out of scope.

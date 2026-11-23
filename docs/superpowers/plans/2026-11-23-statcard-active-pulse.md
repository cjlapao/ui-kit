# StatCard active & pulsing — implementation plan

**Goal:** Ship the approved spec ([docs/superpowers/specs/2026-11-23-statcard-active-pulse-design.md](../specs/2026-11-23-statcard-active-pulse-design.md)): `StatCard` exposes `Panel`'s selection and attention-glow half — `active`, `activeTone`, `pulse`, `pulseTone` — forwarded verbatim so `Panel` keeps owning every hue rule, and the whole Stat family inherits it through the rest-spreads it already has. React only.

**Architecture:** Four optional props on `StatCardProps`, beside the other surface props after `padding`; destructured `active = false, pulse = false, activeTone, pulseTone`; handed to the one `<Panel>` the card renders, after `decoration`. No resolution logic in `StatCard`: it already passes `tone={surfaceTone}`, so Panel's `activeTone ?? borderColor ?? (tone === "none" ? "blue" : tone)` and `pulseTone ?? activeHue` chains already mean *the card's own hue*, blue floor included. `StatTile` and the sibling tiles need no edits — each renders `<StatCard {...rest}>`.

**Ground rules:**

- Never break: an unset card must emit byte-identical classes and inline vars to today's. Both booleans default `false`; the two tones stay `undefined` unless given.
- No hue arithmetic in `StatCard` — no `getSurfaceAccentColor` / `getSurfaceActiveTokens` call added there. Panel is the single source of the chains.
- `Panel`'s `pulsing = pulse && !disabled` gate stays untouched; the card simply never engages it (it has no `disabled`). Documented, not patched around.
- Keep the gradient card's inline `background` authoritative — the wash losing to it is the documented hierarchy, not a bug to fix with a conditional.
- Docs copy: no unescaped double quotes inside a prop description (a `tone="none"` in a `@default` string once broke the build).
- Tests run with `TMPDIR=$PWD/.tmp npx vitest run … --coverage.enabled=false` from `react/`. Never `prettier --write` — the tree is unformatted at baseline.
- Only commit files this plan touches, by explicit pathspec; `.git` is read-only under the current sandbox, so a commit needs the user's approval and a rejected commit is not a task failure.

---

## Task 1 — Component (`react/src/components/StatCard.tsx`)

- [x] `StatCardProps`, after `padding?: PanelPadding;` (:188): the four props, `TrueColor` tones, `@default "auto" — \`borderColor ?? tone\`, blue floor` for `activeTone` and `@default "auto" — the active hue` for `pulseTone`, wording mirroring `Panel`'s (:204–218, :249–259) with the two caveats — gradient cards show rim + glow only, and `pulse` always pulses because a card has no `disabled`.
  - *Deviation:* the card has no `borderColor`, so `activeTone`'s `@default` reads *"auto — the card's own `tone`"*; naming a prop the component doesn't take would be a doc that lies.
- [x] Destructure after `padding = "md",` (:416): `active = false, activeTone, pulse = false, pulseTone,`.
- [x] `<Panel>` after `decoration={resolvedDecoration}` (:672): `active={active} activeTone={activeTone} pulse={pulse} pulseTone={pulseTone}`.
- [x] `cd react && npx tsc --noEmit -p tsconfig.json` adds no new error; `npx vitest run src/components/StatCard src/components/StatTile src/components/StatFamily` stays green.

## Task 2 — Tests (`react/src/components/StatCard.test.tsx`)

- [x] New describe `the hues a card can wear`, the eight cases in spec §Verification. Read the glow off the card's inline `style` / `getPropertyValue`, the rim off the class list (reuse `Panel.test.tsx`'s `surfaceColourOf` approach, not its import), and `data-active` as the active marker.
- [x] Query the `Panel` root deliberately (`container.querySelector("section")` or the card's own attribute), then assert the same two attributes through `StatTile` and `StatGraphTile` — `StatGraphTile`'s `{...props}` is the shape most likely to regress into enumerated forwarding.
- [x] RED-then-green discipline, **with the RED moved to the type level.** Writing case 3 against the unmodified component passed: `StatCardProps extends React.HTMLAttributes<HTMLElement>` and the card spreads `{...rest}` onto `<Panel>`, so all four props *already* reached the surface at runtime — they simply weren't in the type, and JSX excess-property checking is what rejected them. The honest RED was therefore `npx tsc --noEmit`, which produced exactly nine errors naming the four missing props across `StatCard`, `StatTile`, `StatCountTile` and `StatGraphTile`. That is also the finding this feature rests on: **the boundary was the type, not the runtime** — the work is a typed API, its documentation and its regression net, not new rendering code.

## Task 3 — Docs (`react/demo/src/kit-docs/`)

- [x] `shared/StatBaseControls.tsx`: a `Selected & pulsing` `ControlGroup` (`id: "selection"`, sitting between *Core* and *Text*) — `ToggleRow` Selected, gated `HueControl` Selected hue (autoLabel "Auto — the card's own hue"), `ToggleRow` Pulse, gated `HueControl` Pulse hue ("Auto — the selected hue"). Added to the hook's returned `statProps`, so the StatCard **and** StatTile playgrounds both gain the controls and the preview props from one edit.
- [x] `components/stat-card/examples/Selection.tsx` + `?raw` import + `ExampleCard title="Selected & pulsing"` on `StatCardPage.tsx`: plain, selected, selected-in-amber, pulsing in rose on a cyan card, and a `gradient` card that is `active` + `pulse` — the caveat made visible.
- [x] Prop rows on `StatCardPage.tsx` and `StatTilePage.tsx` for the four, worded as on the Panel page (`active / activeTone / pulse / pulseTone` in one row is fine if the table groups them).
  - *Deviation:* neither stat page has a `PropsTable` at all (only Panel/MultiSelectPanel and friends do), so inventing one would be the odd shape on the page. The four landed where these pages actually document things: the `Selection` example card's description, the `StatCardPlayground` helper paragraph, and the `StatTilePage` header's "every tile inherits `StatCardProps` in full" enumeration, which now names `active` and `pulse`.

## Task 4 — Verify

- [x] `npx vitest run src/components/StatCard src/components/StatTile src/components/StatFamily` green (158 tests); full `react` suite run against baseline for parity.
- [x] Throwaway Vite harness under `react/demo/stat-check/`: eight cards measured light and dark (rim `outline-color`, `--panel-glow`, `--_panel-glow`, inset `box-shadow`, `--ui-surface-color`, `background-image`) plus the real playground driven by clicks. Highlights: cyan `active` → rim `oklch(0.715 .143 215.221)` + wash `oklch(98.4% .019 200.873)`; `activeTone="amber"` → `oklch(0.769 .188 70.08)` + amber wash with the cyan gone; `pulseTone="rose"` → glow `oklch(64.5% .246 16.439)` light / `oklch(81% .117 11.638)` dark while the rim stays emerald; untoned → blue floor on rim and glow; `gradient` → `linear-gradient(135deg, …)` still authoritative with rim and glow on top; `StatTile` with `activeTone="violet"` + `pulseTone="lime"` → violet rim, lime glow, proving inheritance in the browser. Playground: Selected → blue rim (tone is `(none)`), amber swatch → amber rim + wash, Pulse → glow at the selected hue, rose swatch → rose glow with the rim left amber. Harness deleted afterwards.
- [x] `npx eslint` clean on the touched files; `react/demo` `tsc` shows only the ten pre-existing errors.

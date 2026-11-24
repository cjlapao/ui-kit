# Hover follows the selection hue — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-23-hover-follows-selection-design.md`](../specs/2026-11-23-hover-follows-selection-design.md)

Rule of the whole change: **`hoverColor ?? activeTone ?? (tone === "none" ? undefined : tone)`**. Nothing else resolves a hover hue anywhere in the kit.

## Task 1 — Panel owns the rule (`react/src/components/Panel.tsx`)

- [x] `hoverHue` (:815): insert `activeTone` between `hoverColor` and the tone fallback.
- [x] Rewrite the comment above it: the hover hue is an explicit `hoverColor`, else the hue the caller gave the selection, else the card's own tone — and say why (`borderColor` deliberately excluded: a neutral hairline is not an accent, and it predates this with users of its own).
- [x] `hoverColor` docstring (:267–276): `@default` stops saying "the Panel's own `tone`"; it now says the selected hue when the Panel has one, else its tone.
- [x] `activeTone` docstring (:219–230): it is the hue the card wears when chosen — rim, wash **and the hover that previews the choosing**.
- [x] `gate`: `cd react && npx tsc --noEmit -p tsconfig.json` stays at 0 errors; `npx vitest run src/components/Panel` stays green **before** any test is written for the new behaviour (the chain change must not break an existing hover assertion — if one does, read it before changing it).

## Task 2 — StatCard completes the hover trio (`react/src/components/StatCard.tsx`)

- [x] Props after the four from the previous feature: `hoverColor?: TrueColor` (same "Auto — the selected hue, else the card's own" meaning) and `hoverable?: boolean` (`@default` — follows whether the card answers the pointer; `true` makes a non-clickable card hover-back, `false` silences a clickable one's wash without removing the cursor).
- [x] Destructure both; pass both to `<Panel>` beside `active`/`activeTone`/`pulse`/`pulseTone`.
- [x] No hue arithmetic in the card, as before — Panel owns the chains.

## Task 3 — MultiSelectPanel, both tiers (`react/src/components/MultiSelectPanel.tsx`)

- [x] `MultiSelectPanelSurfaceProps` Pick list (:34–53): add `"hoverColor"` beside `"hoverable"` and `"hoverShadow"`.
- [x] `MultiSelectPanelOption`: `hoverColor?: TrueColor` in the per-option override block, worded like its neighbours — *"Beats the group's `hoverColor` — this card's hover wash, pressed step and rim ignition. `undefined` follows the group, whose default is the card's selected hue, else its own tone."*
- [x] Destructure `hoverColor` and resolve `option.hoverColor ?? hoverColor` where `activeTone`/`pulseTone` already resolve (:493–494), passing it to `<Panel>`.
- [x] `MultiSelectPanelOption.tone` docstring (:75–79): the hover no longer follows `tone` alone — it follows the selection hue when the card has one.

## Task 4 — Tests

- [x] `Panel.test.tsx`, new describe on the hover chain: `activeTone` steers wash + pressed + rim classes with no `hoverColor`; `hoverColor` beats `activeTone`; **`borderColor` does not steer the hover** (the negative that locks the decision); untoned + `activeTone` → tinted classes where untoned alone keeps the neutral `group-hover` veil; `disabled` + `activeTone` → no hover tokens at all.
- [x] `MultiSelectPanel.test.tsx`: group `hoverColor` lands on every card; `option.hoverColor` beats the group; `option.activeTone` steers the hover (proves the forwarding, which is what rots).
- [x] `StatCard.test.tsx`: `hoverColor` reaches the surface; `hoverable` turns hover on without `onClick`; `tone="cyan"` + `activeTone="amber"` hovers amber, through `StatCard` **and** `StatTile`.
- [x] Read the existing hover assertions in `Panel.test.tsx` first and match how they read classes; add to the existing describe if one already covers hover tokens.
- [x] `themeSafelist.test.ts` must pass untouched — proof that no class shape was introduced.

## Task 5 — Docs and playgrounds (`react/demo/src/kit-docs/`)

- [x] `components/panel/PanelPlayground.tsx`: *Hover hue* `HueControl` beside the `activeTone`/`pulseTone` pair, `autoLabel="Auto — the selected hue, else the panel's own"`.
- [x] `components/panel/examples/Hues.tsx`: a fifth card — clickable, `tone` + `activeTone`, the one you hover to see the follow. Update the example's card count in its description on `PanelPage.tsx` if one is quoted.
- [x] `shared/StatBaseControls.tsx`: *Hoverable* `ToggleRow` and a gated *Hover hue* `HueControl` in the *Selected & pulsing* group; both into `statProps`, so Stat Tiles inherits them.
- [x] `components/stat-card/examples/Selection.tsx`: a sixth card — `hoverable`, `tone="cyan"`, `activeTone="amber"` — with the docstring saying the hover is the point of that card.
- [x] `components/multi-select-panel/MultiSelectPanelPlayground.tsx`: *Hover hue* swatch; `MultiSelectPanelPage.tsx`: extend the `activeTone / pulseTone` prop row (:167) and the option-shape row (:90) with `hoverColor`. Never unescaped double quotes inside a prop description string.

## Task 6 — Verify

- [x] `npx vitest run src/components/Panel src/components/StatCard src/components/StatTile src/components/StatFamily src/components/MultiSelectPanel` green; full `react` suite at its 8-failure known baseline.
- [x] `npx eslint` clean on the touched files; `react/demo` `tsc` at its 10 pre-existing errors.
- [x] Throwaway Chromium harness (`react/demo/<scratch>/`, deleted afterwards) driving a **real** `page.hover()` — jsdom cannot answer any of these: computed `background-color` and `border-color` on hover, light and dark, for cyan+`activeTone` amber, the same plus `hoverColor`, the same plus `borderColor`, untoned+`activeTone`, untoned alone, one MultiSelectPanel group, one `hoverable` stat card. Hover must be driven by the mouse, not by adding classes.
- [x] Report the numbers, not the intent: which hue each card actually hovered in.

## Verification — what the browser actually painted

`react/demo/hover-check/` (built with the demo's own Vite config, opened over
`file://`, mouse moved by Playwright's `page.hover()`, styles read back with
`getComputedStyle`; harness deleted afterwards). Each row is
`--ui-surface-color @ --ui-surface-alpha` at rest → under the pointer; hue is
Tailwind's, so the colour name is the fact, not the oklch.

| card | light | dark |
| --- | --- | --- |
| tonal cyan, `activeTone="amber"` | cyan-200/60 → **amber-300/70** | cyan-500/15 → **amber-400/25** |
| the same, `hoverColor="rose"` | cyan-200/60 → **rose-300/70** | cyan-500/15 → **rose-400/25** |
| the same, `borderColor="neutral"`, `active` | amber-300/70 (hover) — border stayed **neutral-300/neutral-500-50%**, selection rim stayed **amber** | amber-400/25, border neutral, rim `oklch(.828 .189 84.4)` amber |
| untoned, `activeTone="emerald"` | white → **emerald-300**, no veil | neutral-900 → **emerald-400/20**, no veil |
| untoned, nothing else | no surface var at all; neutral veil `black/3.5%` appears | same; veil `white/8.6%` |
| MultiSelectPanel card, group `activeTone="amber"` | white → **amber** (hue 95.6 light / 70.1 dark) | — |
| the same group, `option.hoverColor="lime"` | white → **lime** (hue 122.3 / 130.9), distinct from its neighbours | — |
| `StatCard hoverable` (no `onClick`) | white → **amber** | neutral-900 → **amber-400/20** |
| `StatTile hoverable` (no `onClick`) | white → **amber** | neutral-900 → **amber-400/20** |

The pressed step moved with the wash in every tinted row (`active:[--ui-surface-
color]` carries the same hue), and the two untinted rows prove the two halves of
the rule: a card with a chosen hue gets a tinted hover it never had, a card
without one keeps the neutral veil exactly as before.

## Notes for the record

- Suite: 5940 passed, 8 failed — the pre-existing set (`axe-scan` Table
  `aria-required-children`, CondensedStepper / PageHeader / SplitView / TagPicker
  stale class expectations, 2 ExpandableButton hover-timing, i18n dead keys). The
  `IdentityPicker` timeout flake did not recur. `themeSafelist.test.ts` passed
  untouched: no new class shape was introduced.
- `react/demo` `tsc`: 9 errors, all pre-existing families (4 stat-tile drilldown
  `StatCardDrilldownItem`, 2 terminal `GlassOpacity`/`GlassVibrancy`, 2
  custom-icon, 1 `StatBaseControls` export). One baseline error — the unused
  `React` in `panel/examples/NestedSurfaces.tsx` — is gone, not by this work.
- The user's parallel `raisedSurface` commits (13:48–13:50) swept five docs files
  — `StatCardPage`, `StatCardPlayground`, `StatTilePage`, `MultiSelectPanelPage`,
  `MultiSelectPanelPlayground` — into git with the hover wording in them. The
  components, the tests and the remaining docs files are still uncommitted; `.git`
  is read-only to this agent, so nothing here was committed by me.


## Amendment 1 — the follow is gated on `active`

Seen in the MultiSelectPanel playground (dark, untoned group, `activeTone="teal"`,
one card chosen): the chosen card had a teal rim and wash and a neutral hover,
while the rule as first shipped made *every* card in the group hover teal. Both
readings are wrong; the chain is now

```
hoverColor ?? (active ? activeTone : undefined) ?? (tone === "none" ? undefined : tone)
```

so the follow belongs to the state, not to the hue — one card hovers in the
selection hue while it is selected, its neighbours keep their own tone, and
`hoverColor` outranks all of it. Only an explicit `activeTone` triggers the
follow, `borderColor` is still out, and the gate sits in `Panel` where the other
three chains already live, so `StatCard`, the tiles and `MultiSelectPanel`
inherit it. Full reasoning and the measured table:
`docs/superpowers/specs/2026-11-23-hover-follows-selection-design.md` § Amendment 1.

- Tests moved with it: the Panel follow test now sets `active`, and a new one —
  *"leaves an unchosen card hovering in its own tone, activeTone and all"* — locks
  the gate; the MultiSelectPanel test asserts the selected card hovers amber while
  its unselected neighbours hover cyan; the StatCard test checks both halves
  through the card.

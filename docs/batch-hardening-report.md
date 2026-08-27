# Batch hardening run — 20 components

Autonomous overnight pass over the list of untested components, following
`docs/component-hardening-brief.md`. **Started 2026-08-26.**

Read the [Status table](#status) first: it says what is finished, what is
partial, and what was deliberately left. Everything marked ⚠️ or ❌ needs a
human decision or a follow-up session.

## Legend

| Mark | Meaning |
|---|---|
| ✅ | Done to the brief: bugs fixed, shared scales, tests passing |
| 🟡 | Code hardened + tested, but docs page / Vue demo still owed |
| ⚠️ | Changed, but something needs your decision |
| ❌ | Not started |
| 🗑️ | Recommended for deletion or merge — not done without your say-so |

## Status

| # | Component | React | Vue | Tests | State |
|---|---|---|---|---|---|
| 1 | `Tooltip` | ✅ | ✅ | 5 | Reduced to a `TooltipWrapper` variant |
| 2 | `MetricBar` | ✅ | ✅ | 5 + 6 | Now renders `Progress` |
| 3 | `MultiProgressBar` | ✅ | ✅ | 8 | 🟡 no docs page |
| 4 | `MultiToggle` | ✅ | ✅ | 10 + 8 | 🟡 breaking props type |
| 5 | `NotificationModal` | ✅ | ✅ | 7 + 6 | ⚠️ `error` vs `danger` naming |
| 6 | `PagedPanel` | ✅ | ✅ | 11 + 10 | 🟡 breaking padding |
| 7 | `PasswordInput` | ✅ | ✅ | 5 + 5 | ⚠️ Vue `Input` lacks `readOnly` |
| 8 | `StatTile` | ✅ rebased | ⚠️ fixes only | 10 + 5 | ⚠️ **no `StatCard.vue`** |
| 9 | `StatCountTile` | ✅ rebased | ⚠️ fixes only | ↑ | ⚠️ same |
| 10 | `StatChartTile` | ✅ fixes | ✅ fixes | — | ⚠️ same |
| 11 | `StatGoalTile` | ✅ fixes | ✅ fixes | — | ⚠️ same |
| 12 | `Picker` | ✅ map | ✅ map | 7 + 5 | 🟡 much left, see below |
| 13 | `TagPicker` | ✅ map | ✅ map | ↑ | 🟡 same |
| 14 | `SplitView` | ✅ map | ✅ map | ↑ | 🟡 same |
| 15 | `UserAvatar` | ✅ | ✅ | 8 + 8 | Done |
| 16 | `TagPanel` | ✅ | ❌ | 6 | 🟡 Vue not updated |
| 17 | `SmartValue` | ✅ already | ✅ already | 11 | Tests only |
| 18 | `SmartVariableParts` | ✅ already | n/a | ↑ | React-only component |
| 19 | `TruncatedText` | ✅ | ❌ | ↑ | 🟡 Vue not updated |
| 20 | `VariablePicker` | ✅ | ❌ | ↑ | 🟡 Vue not updated |

**Verification at the end of the run**

| Check | Result |
|---|---|
| react `tsc --noEmit` | clean |
| react vitest | **2286 passed** / 100 files (was 2189 / 92) |
| react build | ok |
| vue `vue-tsc --noEmit` | clean |
| vue vitest | **792 passed** / 36 files (was 753 / 30) |
| vue build | ok |
| react demo typecheck + build | clean, **15 docs pages** |
| vue demo typecheck + build | **9 error files** — unchanged baseline, none mine |

## The three things that need your decision

1. **There is no `StatCard.vue`.** `StatCard` is React-only, so the four Vue
   Stat tiles could not be rebased and still carry their own `Panel`,
   decoration corner and error block. Port it, or accept the divergence.
   (§8–11)
2. **`NotificationModal` ships `error` where the kit's shared `AlertIntent`
   says `danger`.** Two vocabularies for one concept. (§5)
3. **`Picker` / `TagPicker` / `SplitView` only had their colour maps fixed.**
   Three copies of the portal positioning logic, inline SVG instead of the icon
   registry, no keyboard nav in `Picker`, and `SplitView` still hardcodes
   `bg-white` / `bg-gray-50` on its own chrome. Each needs a session. (§12–14)

## kit-docs pages — added in a follow-up pass

**All 20 are now documented** (14 new pages + the pre-existing `Tooltip` one).
Each has a `PageHeader`, an interactive `Playground` wired to the real props,
and worked `ExampleCard` examples whose source is shown verbatim.

| Page | Category | Covers |
|---|---|---|
| `/metric-bar` | Data | `MetricBar` |
| `/multi-progress-bar` | Data | `MultiProgressBar` |
| `/stat-tile` | Data | `StatTile`, `StatCountTile`, `StatGoalTile`, `StatChartTile` |
| `/smart-value` | Data | `SmartValue`, `SmartVariableParts` |
| `/truncated-text` | Data | `TruncatedText` |
| `/multi-toggle` | Forms | `MultiToggle` |
| `/password-input` | Forms | `PasswordInput` |
| `/picker` | Forms | `Picker` |
| `/tag-picker` | Forms | `TagPicker` |
| `/variable-picker` | Forms | `VariablePicker` |
| `/paged-panel` | Layout | `PagedPanel` |
| `/split-view` | Layout | `SplitView` |
| `/tag-panel` | Layout | `TagPanel` |
| `/user-avatar` | Basics | `UserAvatar` |
| `/notification-modal` | Overlays | `NotificationModal` |
| `/tooltip` | — | `Tooltip` (pre-existing) |

Each playground foregrounds the specific bug that was fixed, so the page
doubles as the test surface: the `MultiToggle` one tells you to use the arrow
keys, `PasswordInput` shows the toggle withdrawing on a disabled field,
`Picker`/`SplitView` let you flip to `red`/`green`/`stone` — the tones that
previously rendered as their neighbours or not at all.

Two barrel gaps surfaced while wiring these up and were fixed:
`USER_AVATAR_SHAPES` / `UserAvatarShape` and `NOTIFICATION_TYPES` were not
exported, so a consumer could not enumerate them.

## Still not done

- **No Vue demo pages** for any of the 20. The React kit-docs is now complete;
  the Vue demo app is not.
- **No visual verification.** Nothing here was screenshotted light/dark or over
  glass; the evidence in this report is types, tests, measured CSS and the
  docs pages themselves.
- **Vue twins skipped** for `TagPanel`, `TruncatedText`, `VariablePicker`.

---

## 1. `Tooltip` ✅ — revisited, see the follow-up at the end

**Decision: kept, but reduced to a thin variant of `TooltipWrapper`.**

The kit had two independent tooltip implementations. `TooltipWrapper` portals,
does viewport collision detection and adds no wrapper element; `Tooltip` had a
second, simpler copy with **no collision detection**, so a tooltip near the
right edge of the window ran off-screen here while the identical one on an
`IconButton` shifted itself inward.

`Tooltip` now renders `TooltipWrapper` and supplies the wrapper element itself
— which is the only thing it ever added. Both kits.

- Fixed: no viewport collision handling (off-screen near window edges).
- Fixed: pointer-only. The wrapper is now a tab stop and `TooltipWrapper`
  answers to focus, so a keyboard user can surface it.
- Kept: `text` / `delay` / `position` / `wrapperClassName` API unchanged.
- Tests: 5 (React).

**Left:** no Vue test file; no docs page (it is documented through the
components that use it).

---

## 2. `MetricBar` ✅

**Decision: kept, rewritten to render `Progress`.**

`Progress` already has `label`, `showValue` and `formatValue`, and wires the
label as the bar's `aria-labelledby`. `MetricBar` hand-rolled that header row,
so the `role="progressbar"` underneath it had **no accessible name** and was
announced as just "progress bar".

- Fixed: missing accessible name (§5.6).
- Fixed: `color?: SpinnerColor` and a hardcoded `size="sm"` → full
  `ControlSize` ladder and `tone`/`color` on every tone.
- Fixed: hardcoded `text-neutral-*` → the caption/reading come from `Progress`.
- Fixed (Vue): the SFC exported itself (`export { default as MetricBar } from
  "./MetricBar.vue"`) to get a named export, because `export *` does not carry
  a default. Now exported properly from `components/index.ts`.
- Tests: 5 React, 6 Vue (including one asserting the barrel export).

**Left:** no docs page or Vue demo.

---

## 3. `MultiProgressBar` 🟡

**Decision: kept and hardened.**

- Fixed: the stacked bar had **no role and no label**, so the whole chart was
  invisible to a screen reader and its numbers existed only in a hover
  tooltip. It is now `role="img"` with a text alternative naming every slice.
- Fixed: series took a raw Tailwind class (`color: "bg-rose-500"`). They now
  take `tone: TrueColor`; the raw `color` stays as a deprecated escape hatch so
  existing call sites keep working.
- Fixed: no size scale → full `ControlSize`.
- Fixed: hardcoded `text-neutral-*` throughout → surface tokens
  (`useSurfaceText` in React, spelled out in Vue).
- Added: `hideLegend`.
- Tests: 8 React.

### Shared bug found here, fixed in the theme

`getColorPalette` / `getColorPaletteNames` fell back to a **random** colour
past the 21-colour spectrum. A chart with more than 21 series therefore
repainted in different colours on every render, and any component calling the
helper twice (once for the bar, once for the legend) got two different palettes
for the same data. Both now cycle the ordered spectrum, so a palette is a pure
function of its length. This also affects `StatChartTile` and `StatGoalTile`.

**Left:** the segment tooltip still follows the cursor with its own portal
rather than using `TooltipWrapper` — that is deliberate (it tracks the pointer
along the bar, which `TooltipWrapper` cannot do), but it means the segment
values are still mouse-only. No Vue test; no docs page.

---

## 4. `MultiToggle` 🟡

**Decision: kept and hardened. Both kits.**

The theme already had a generated `getMultiToggleColorTokens(color)` producing
exactly the strings this component's local 21-entry map held — so the map was a
duplicate of a function that already existed, and it had drifted.

- Fixed: `green` painted **emerald** classes and `red` painted **rose** — those
  two tones rendered as their neighbours while the other 19 were correct
  (§5.2). ~130 lines deleted in each kit.
- Fixed: `MultiToggleSize = "sm" | "md" | "lg"` → `ControlSize`, so a toggle
  can now line up with an `xs` or `xl` Button.
- Fixed (a11y): every option carried **both** `aria-checked` and
  `aria-pressed` — a radio's state and a toggle button's state, in two
  vocabularies, on one element.
- Fixed (a11y): the component used a roving tabindex but handled **no keys**,
  so a keyboard user could focus the group and had no way to change the
  selection — the one interaction a radiogroup exists for. Arrow keys, Home,
  End, wrapping, and skipping disabled options all work now.
- Fixed: native props were spread onto **every option button**, so a caller's
  `onClick` replaced each option's own handler and an `id` was duplicated once
  per option. They now land on the group `<div>`, which is what they describe.
  React's props type changed from `ButtonHTMLAttributes<HTMLButtonElement>` to
  `HTMLAttributes<HTMLDivElement>` to say so.
- Tests: 10 React, 8 Vue.

**Breaking:** the React props type no longer extends `ButtonHTMLAttributes`, so
button-only attributes (`formAction`, `type`) are no longer accepted. `disabled`
is declared explicitly and still works.

**Left:** it has a kit-docs presence already (used by other demos) but no page
of its own; no visual verification pass.

---

## 5. `NotificationModal` 🟡

**Decision: kept and hardened. Both kits.**

- Fixed: `titleColor` (`text-emerald-900` and three siblings) was declared in
  the config and **never read** — dead, and with no dark-mode partner (§5.3).
- Fixed: `error` and `warning` both used the `Warning` glyph, so a failure and
  a caution were indistinguishable. `error` now uses `Error`.
- Fixed: the message was `text-gray-600` with **no dark-mode partner** — copy
  near-invisible on a dark modal. Now reads the surface tokens.
- Fixed: `color={config.color as any}` — the config typed its tone as a bare
  `string`, and the cast hid that nothing checked it against `TrueColor`.
- Added: `NOTIFICATION_TYPES` runtime list, `icon`/`tone` overrides, and the
  rest of `ModalProps` now passes through (`size` was hardcoded to `"sm"`).
- Tests: 7 React, 6 Vue.

**Note:** the kit's shared severity vocabulary is `AlertIntent`
(`info | success | warning | danger | neutral`). This component ships `error`
rather than `danger`. I kept the existing name so call sites do not break —
**worth a decision**: either rename to `danger` with a deprecated alias, or
accept the two vocabularies permanently.

**Left:** no docs page or Vue demo.

---

## 6. `PagedPanel` 🟡

**Decision: kept and hardened. Both kits.**

- Fixed (React): the page clamp ran **during render**
  (`if (safeCurrent !== current) setCurrent(safeCurrent)`), which is a
  state update in the render phase — React re-runs the component immediately
  and warns. Moved to an effect; a test asserts no console error when the page
  list shrinks.
- Fixed (a11y): paging swapped the content with **no announcement**. The
  position counter is now `role="status" aria-live="polite"`.
- Fixed: the nav buttons were a hand-rolled `<button>` with hardcoded
  `hover:bg-neutral-*` and a hardcoded `focus-visible:ring-blue-500` — now
  `IconButton`, so they take the panel's `tone` and the kit's focus ring.
- Fixed: hardcoded `text-neutral-*` and `border-neutral-100` throughout → the
  surface tokens (a `PagedPanelBody` / `PagedPanelContent` child so it can read
  the provider the Panel publishes).
- Fixed: bare "No data available." / error text → real `EmptyState`s.
- Fixed (Vue): the header markup was written out **twice** (bare vs Panel
  branch). Extracted to `internal/PagedPanelContent.vue`.
- Added: `tone`, `size` (full `ControlSize`), controlled `page` +
  `onPageChange` / `update:page`, `emptyState` slot, `emptyMessage`.
- Tests: 11 React, 10 Vue.

**Breaking:** the Panel is now `padding="none"` and the content owns its
padding. Previously Panel's default padding sat *outside* the header's own
`px-4 py-3`, giving a double inset.

**Left:** no docs page or Vue demo.

---

## 7. `PasswordInput` 🟡

**Decision: kept — it is a legitimate thin wrapper over `Input`.**

- Fixed: the eye glyph was a raw icon component with a hardcoded `w-4 h-4`, so
  it stayed 16px at every `size` (visibly wrong on `lg`/`xl`) and bypassed the
  kit's icon renderer. Now a registry name, which `Input` sizes.
- Fixed: the reveal toggle stayed live on a `disabled` or `readOnly` field, so
  a password the user could not edit could still be read back.
- Added: `revealable` (opt out of the toggle entirely) and a controlled
  `revealed` + `onRevealedChange` / `update:revealed`.
- Tests: 5 React, 5 Vue.

**Gap found in Vue's `Input`:** it declares no `readOnly` prop at all, where
React's has one through `InputHTMLAttributes`. `PasswordInput` reads it off
`$attrs` as a workaround. **Worth fixing in `Input.vue` itself.**

**Left:** it has a kit-docs presence already; no dedicated page.

---

## 8–11. The Stat family — `StatTile`, `StatCountTile`, `StatChartTile`, `StatGoalTile` ⚠️

**Decision (React): rebased on `StatCard`, as you asked.**
**Decision (Vue): NOT rebased — see the blocker below.**

### What `StatCard` gained

`StatCard` was the hardened one but lacked most of what the tiles need, so the
"extra options/styles" went in first: `subtitle`, `actions`, `body`,
`progressBar`, `meta`, `footer`, `decoration`, `error`, `loading` +
`spinnerVariant`/`spinnerThickness`/`spinnerTone`, `onClick`, `hoverEffect`,
`valueTone`, and `trend.label`. Its own 30 tests still pass unchanged.

### `StatTile` — now a ~100-line adapter over `StatCard`

It was a second, parallel implementation of the same card: its own `Panel`, its
own decoration corner, its own error block, its own trend pill, its own
progress bar. All of those already existed on `StatCard`.

- Fixed: the progress bar was **two nested divs with the percentage in a
  sibling span and no `role`** — a screen reader saw a bare number with nothing
  attached. Now a real `Progress` with an accessible name.
- Fixed: the error retry was a bare `<button className="text-blue-600 …">` — a
  hardcoded blue with no dark-mode partner and no focus ring. Now a `Button`.
- Fixed (a11y): `onClick` sat on a `div`, so the card could be focused and
  never activated from the keyboard. Now `role="button"`, `tabIndex`, and
  Enter/Space.
- Fixed: `StatTileMeta.variant` and `.color` were declared and **never read**
  (§5.3) — marked `@deprecated` in both kits.
- `StatCountTile` is likewise a `StatCard` with the breakdown in `children`.

### `StatChartTile` / `StatGoalTile`

Kept their chart bodies (a donut and a set of rings — genuinely their own
thing), with the bugs fixed in **both kits**:

- Fixed: `text-${color}-${intensity}` was built from **two interpolations**.
  Only the `-500` step is safelisted for every tone, so any other `intensity`
  rendered **no colour at all**. The prop is now `@deprecated` and the class is
  pinned to `-500`; the empty-donut placeholder uses an explicit neutral track.
- Fixed (a11y): both SVGs had **no role and no accessible name** — the donut's
  values existed only in per-segment `<title>`s, and the goal ring had nothing
  tying it to the percentage beside it. Both are now `role="img"` with a full
  text alternative.
- Fixed: `StatChartTile`'s nav buttons were hand-rolled `<button>`s with
  hardcoded neutral hovers → `IconButton` (React).

### ⚠️ Blocker: there is no `StatCard.vue`

`StatCard` exists **only in the React kit**. The Vue tiles therefore could not
be rebased, and still carry their own `Panel`, decoration corner and error
block. I applied the bug fixes above to them directly instead.

**This is the decision I need from you:** either port `StatCard` to Vue (it is
a substantial component — gradient washes, `EcgMonitor`, `ProgressSpinner`,
the full size ladder) and then collapse the four Vue tiles onto it the way
React now is, or accept that the two kits' Stat families diverge permanently.
Until then the Vue tiles do not pass `color` through to the Panel's tone — only
the decoration wash and icon chip are tinted, which the React ones now do.

- Tests: 10 React, 5 Vue.

**Left:** no docs pages or Vue demos for any of the four. `StatGraphTile` (not
on your list) now has to `Omit<"variant">` from `StatTileProps` because
`StatCard` brought the Panel surface family in under that name — worth a look,
since it uses `variant` for its own chart style.

---

## 12–14. `Picker`, `TagPicker`, `SplitView` ✅ (tone maps) 🟡 (rest)

**Decision: kept; the hand-written tone maps replaced with generated ones. Both kits.**

These three carried the kit's three largest hand-written colour maps — 21
entries each, ~180 lines apiece per kit — and all three had drifted the same
way. **This one is worth reading carefully, because the bug hid itself.**

- `Picker` and `TagPicker`: `red` spelled every one of its classes with
  **rose**, and `green` spelled every one with **emerald**. Those two tones
  rendered as their neighbours.
- `SplitView`: aliased **both `neutral` and `stone`** to one shared
  `neutralActive` object, so a `stone` SplitView silently rendered neutral —
  and `neutral` itself used `border-l-neutral-500` where all 19 others used
  `-600`.

### Why it was invisible

The literal strings in those files were also **what Tailwind scanned**. So the
map and the stylesheet agreed with each other: `ring-rose-500/20` existed
because `Picker` spelled it, and `ring-red-500/20` did not exist *because
nothing spelled it*. Auditing the built CSS would have shown "red is missing"
and looked like a safelist gap rather than a drifted map.

Measured before the fix, across the 21 tones:

| shape | tones missing from `dist/index.css` |
|---|---|
| `ring-{c}-500/20` | red, green |
| `dark:bg-{c}-900/20` | red, green |
| `bg-{c}-50/60` | red, green |
| `border-l-{c}-600` | neutral, stone |
| `dark:bg-{c}-900/30` | stone |
| `dark:bg-{c}-900/50` | gray, zinc, stone |

**So generating the maps was not enough** — the corrected tones would have
rendered *no colour at all*. `scripts/generate-safelist.mjs` gained
`ring-{COLOR}-500/20`, `bg-{COLOR}-50/60`, `dark:bg-{COLOR}-900/{10,20,30,50}`
and `border-l-{COLOR}-600`. Rebuilt and re-verified: all ten shapes now emit
for all 21 tones.

- Tests: 7 React, 5 Vue — including per-tone assertions and explicit
  `red`-is-red / `green`-is-green / `stone`-is-stone checks.

**Left, and significant:** only the colour maps were addressed. All three
components still have real problems I did **not** get to:

- `Picker` and `TagPicker` each carry their own ~90-line copy of the portal
  positioning logic (`viewportBounds`, `resolveBoundaryBounds`,
  `resolveZIndex`) — three copies including `DropdownMenu`. Should be one hook.
- Both draw their own search input, chevron, spinner and checkmark as inline
  SVG instead of using `Input`, `CustomIcon` and the registry.
- `Picker` has no keyboard navigation at all (`TagPicker` has arrow keys).
- `Picker`'s `updatePosition` has an incomplete dependency array
  (`[open]` only, though it reads `escapeBoundary`).
- `SplitView` is 1,200+ lines and still hardcodes `bg-white`, `bg-gray-50/80`
  and `border-gray-200` on its own chrome — it will not sit on a dark or glass
  page correctly.
- None of the three take a `size` from `ControlSize` (`Picker` has a local
  `"sm" | "md"`, `SplitView` a local `"sm" | "md" | "lg"`).

---

## 15. `UserAvatar` ✅

**Decision: kept and rewritten. Both kits.**

- Fixed (a11y): the avatar stands for a person but was an **unlabelled `div`** —
  only the happy-path `<img>` had an `alt`, so an avatar falling back to an
  initial (the common case) was invisible to a screen reader. Now `role="img"`
  with a name, and the `<img>`'s redundant alt is emptied.
- Fixed: `size` was a bare pixel number, so an avatar could not be told to
  match the `sm` Button beside it. Now `ControlSize | number` — a number still
  works and wins.
- Fixed: hardcoded `bg-slate-200 text-slate-600`, so the chip was slate
  whatever the app's palette. Now `tone` through `getPillColorClasses`.
- Fixed: the `useEffect` listed `size` in its dependency array while only
  reading `avatarUrl` — a resize reset the error state and re-showed a broken
  image.
- Added: `USER_AVATAR_SHAPES`, `shape` (with `variant` kept as a deprecated
  alias), native props pass-through.
- Tests: 8 React, 8 Vue.

---

## 16. `TagPanel` 🟡 (React only)

- Fixed: `size` (a `SectionSize`, the *header's* scale) was handed to the
  overflow `Pill`, which expects a `PillSize` — two different scales sharing
  one prop. Split into `size` and `tagSize`.
- Fixed: the overflow control was a bare `<button>` wrapping a `Pill` — a
  nested interactive with no focus ring of its own. Now a `Button`.
- Fixed: the empty state was a bare italic `<span className="text-neutral-400">`
  → a real `EmptyState`, plus an `emptyMessage` prop.
- Tests: 6 React.

**Left:** the Vue twin was not updated. No docs page.

---

## 17–18. `SmartValue`, `SmartVariableParts` ✅

**Decision: no changes needed — these were already hardened.**

Both already use `getPillColorClasses`, shared tones and `IconButton`; neither
has a hand-written colour map or a hardcoded `text-neutral-*`. They were on
your list as untested, not as unhardened.

- Added: tests only — 11 covering the badge/parts/value trio, including that
  an unknown token and a declared-but-empty one stay visually distinct, and
  that a secret is masked rather than printed.
- `SmartVariableParts` has **no Vue twin**; it is React-only.

---

## 19. `TruncatedText` ✅

- Fixed (a11y): `TooltipWrapper` now answers to focus, but the truncated
  element was never focusable — so a keyboard user still could not read a
  cut-off label. It is now a tab stop **only while actually truncated**, so it
  does not add a dead tab stop to every label on a page.
- Kept: the existing `ResizeObserver` guard against detached nodes, and the
  always-mounted `TooltipWrapper` (both were already correct and load-bearing).

---

## 20. `VariablePicker` ✅

**Decision: kept — already hardened apart from one scale.**

- Fixed: `size?: "sm" | "md" | "lg"` → `ControlSize`.
- Otherwise already correct: renders `Panel`, reads `useSurfaceText()`, uses
  `getSurfaceTriggerTokens`, no colour map.
- Tests: included in the Smart-family file above.


---

# Follow-up: `Tooltip` rebuilt (2026-08-27)

Two problems reported after the batch run: *"they all seem dark"* and *"there
is no collision detection on any side"*. Both confirmed.

## Appearance — there was only ever one look

The box was `bg-neutral-900 … dark:bg-neutral-700`: **dark in both themes**,
with no light appearance at all. There is now a `variant`:

- **`surface`** (default) follows the theme — a white card with a hairline ring
  in light mode, `neutral-800` in dark.
- **`inverted`** contrasts against the page — `neutral-900` in light, white in
  dark. This is the classic tooltip convention, kept as an option.

Verified in a headless render: all four sides × both variants × both themes.

## Collision — there was horizontal clamping and nothing else

What existed: a `top`/`bottom` tooltip was clamped horizontally so it did not
run past the left or right edge. That was all. There was **no vertical flip**
(a `top` tooltip on a trigger near the top of the window rendered off-screen)
and **no `left`/`right` placement at all** — the type was literally
`"top" | "bottom"`.

What replaces it, in `common/tooltip/placement.ts` — pure geometry, no DOM, no
framework, **shared by both kits**:

1. Try the preferred side.
2. If it has no room, flip to the opposite side.
3. If neither fits, fall back to a perpendicular side.
4. If nothing fits, use whichever has the most room — degrade to "least bad"
   rather than off-screen.
5. Clamp the box inside the viewport on the cross axis.
6. **Slide the caret** so it still points at the trigger after clamping — the
   old code did this for the horizontal case only, and could push the caret off
   the end of the box.

`position` is now documented as a *preference*, and the rendered tooltip
publishes `data-side` so a caller (or a test) can see which side was used.

Also fixed while in there: an open tooltip is now re-placed on scroll and
resize. It previously kept its position from the moment it opened, so scrolling
under an open tooltip left it stranded.

## Tests

- **16 geometry tests** against real numbers, including *every side at every
  corner* stays on screen, and the caret never leaves the box. This is the part
  JSDOM cannot test — it reports every element as zero-sized, so the collision
  logic is untestable through a rendered component.
- **9 React + 7 Vue** component tests covering both looks, all four sides,
  focus-open, and teardown.

## API additions

`TOOLTIP_POSITIONS`, `TOOLTIP_VARIANTS`, `TooltipVariant`, `offset`, `margin`,
plus `resolveTooltipPlacement` / `resolveTooltipSide` exported so an app can
reuse the geometry. Barrel gaps fixed in both kits.

## Docs

`/tooltip` gained a collision playground (four triggers pinned to the edges of
a boxed area, so you can watch them flip and clamp), a **Both looks** example,
and a **Collision handling** example. `Position` now enumerates all four sides
from the runtime list.

## Arrow rebuilt (same day, after "the arrows for left and right do not show")

The arrows *were* rendering — a DOM probe confirmed correct size, offset and
coloured edge on all four sides. They were **invisible**: a CSS triangle built
from `border-<side>-<colour>` carries no outline, so on the light `surface`
variant it was a white shape on a white page. `top`/`bottom` only seemed to
work because they sat inside the box's drop shadow; `left`/`right` stick out
sideways where the shadow is weakest, which is why those two were reported.

The arrow is now a **rotated square** sharing the bubble's fill and border,
with the border on only the two outward-facing faces — the two facing into the
bubble share its fill and vanish, so the arrow reads as part of the shape.

That required swapping the bubble's translucent `ring-1 ring-black/10` for a
solid `border`: a translucent edge composites differently over the page than
over the fill, so the arrow's outline and the box's would not have matched.

Verified visually: all four sides × both variants × both themes, light and
dark. Four new tests assert the arrow carries an outline, that exactly the two
outward edges are bordered, that it shares the box fill, and that `inverted`
(which has no visible outline) does not sprout one.

## `boundary` added (after "how is the collision working in the demo?")

The collision example looked broken, and the demo was the reason. Its triggers
sat at the corners of a dashed `div` in the middle of a tall page, labelled
"No room above or to my left" — but collision is measured against the
**viewport**, which had room in every direction there. Nothing flipped, and the
labels were false. The engine was right; the documentation of it was the bug.

Rather than just rewrite the copy, the claim is now true. `boundary` (both
kits, both components) constrains a tooltip to an element — a scroll container,
a panel, a modal — flipping and clamping against *that* edge. It is intersected
with the viewport, so a constrained tooltip still never leaves the screen, and
it defaults to the viewport so nothing changes for existing callers.

Measured, same four triggers, same requested side (`top`):

| boundary | resolved sides (TL, TR, BL, BR) |
|---|---|
| the dashed box | `bottom`, `bottom`, `top`, `top` — top corners flip |
| the window (default) | `top`, `top`, `top`, `top` — nothing flips |

The playground and the Collision example both got a **Constrain to the box**
toggle, so the difference is visible rather than asserted. 4 new placement
tests cover flipping against a boundary, clamping inside it, the intersection
with the viewport, and that omitting it is identical to passing the viewport.

**Left:** `Tooltip`/`TooltipWrapper` still have no Vue demo page. The `maxWidth`
is a flat `max-w-xs` rather than a prop.

---

# Follow-up: two runtime errors reported (2026-08-27)

## `ToggleRow is not defined` — mine

I added a **Constrain to the box** toggle to `TooltipPlayground` and did not
add `ToggleRow` to its import list. `tsc` caught it; my verification did not,
because I had reduced that step to `tsc … | grep -c ""`, which prints the
*number* of error lines. I read the `1` as a pass. Fixed, and the lesson is in
`Learnings.md`: never reduce a verification step to a count you then have to
interpret.

## `Invalid DOM property "clip-rule"` — pre-existing, systemic

Not from this work — the icons were committed in `6097e21`. My `StatTile`
example was just the first thing to render `Database`.

React does not translate raw SVG attribute names: it logs `Invalid DOM
property` and **drops the attribute**. An ignored `fill-rule` or `clip-rule`
changes how a path is filled, so the icon renders subtly wrong while looking
plausible.

**Nine icon components** were affected: `Aws`, `Clone`, `Database`, `Offline`,
`PodmanDesktop`, `RemoteHost`, `ReverseProxyHTTP`,
`ReverseProxyHeadersRequest`, `ReverseProxyHeadersResponse` — carrying
`clip-rule`, `fill-opacity`, `stop-color` and `stop-opacity`. All fixed.

Since these are pasted from exported SVG and will drift again, there is now a
guard: `react/src/icons/icons.test.ts` scans every icon component for the
seventeen kebab-case SVG attribute names and for `class=` instead of
`className`. Verified it fails — naming the file and the exact fix — when the
bug is reintroduced.

The Vue kit is unaffected: templates accept kebab-case.

## Verification after both fixes

| Check | Result |
|---|---|
| react `tsc --noEmit` | clean |
| react vitest | **2333 passed** / 103 files (chart suite included — the other agent's Heatmap work has landed) |
| react build + demo build | ok |
| vue `vue-tsc` / vitest / build | clean / **799 passed** / ok |
| vue demo | 9 error files — unchanged baseline |

---

# `MeterGroup` folded into `MultiProgressBar` (2026-08-27)

The two drew the same picture — one quantity split into labelled shares —
but `MultiProgressBar` also dimmed the other segments on hover and tracked the
cursor with a tooltip. Rather than keep two implementations, `MeterGroup`'s
whole feature set moved across.

## What moved

| From `MeterGroup` | Now on `MultiProgressBar` |
|---|---|
| `min` / `max` range | `min` / `max`; the old `total` is a deprecated alias for `max` |
| `orientation` + `height` | same, plus the legend flips to the side when vertical |
| `labelPosition` (start/end) | same |
| `labelOrientation` (row/column) | same |
| `showLabels` | same; the old `hideLegend` still works and is deprecated |
| `barSize` (px) | same — overrides the thickness `size` implies |
| per-item `icon` | `series[].icon`, shown instead of the colour dot |
| `loading` + skeleton | same, shaped like the bar *and* its legend |
| `error` / `errorState` | same, via `EmptyState` |
| `emptyMessage` / `emptyState` | same |
| `role="meter"` + `aria-valuemin/max/now` | same |
| percent in the label | `showPercent` |

Two things improved in the move rather than being copied:

- **The meter now has both semantics.** `MeterGroup` published the range but
  nothing about the slices; `MultiProgressBar` published the slices but used
  `role="img"`. It now carries `role="meter"` with the range **and**
  `aria-valuetext` naming every slice, so the breakdown is reachable without a
  pointer.
- **Overflow is handled.** `MeterGroup` clamped each segment to 100%
  independently, so values summing past the range silently pushed the last
  segments off the end. The shares are now scaled down together.

## `MeterGroup` is deprecated, not deleted

- `react/src/components/MeterGroup.tsx` keeps compiling and exporting. It
  carries an `@deprecated` block with a worked migration example (`items` →
  `series`, each entry needs a `key`, `color` → `tone`).
- Its kit-docs page is **unregistered** — gone from the demo nav. The page
  files are left in place with a note saying why, so reverting is trivial.
- Its own test file still passes unchanged.

## Docs

`/multi-progress-bar` gained three examples covering what moved —
**Orientation and legend placement**, **Icons in the legend**, and
**Loading, error and empty** — plus playground controls for orientation,
legend position and layout, percentages, icons and the three states. Nothing
demonstrated on the old page is now undocumented.

- Tests: 17 on `MultiProgressBar` (9 new, covering every migrated capability).

## ⚠️ Kit divergence

`MeterGroup` was **React-only**, so this was a React-only change — and Vue's
`MultiProgressBar` now lags the React one by everything in the table above.
Worth deciding whether to port it; the Vue component is otherwise a faithful
mirror and the port is mechanical.

---

# `MultiToggle` variants realigned to the Panel family (2026-08-27)

## The diagnosis

`MultiToggle`'s `variant` was `theme | solid | soft` — three ways of drawing
the **indicator**, not the track. That is why it matched nothing else in the
kit: it was named after the wrong thing. A segmented control's track is a
container holding segments, so it belongs to the **panel family**, and there
was no way to put one on a glass surface at all.

## The redesign

Two independent axes, where there was one confused one:

| Prop | Scale | Default |
|---|---|---|
| `variant` | the **Panel surface family** — all eight `SURFACE_VARIANTS` | `subtle` |
| `indicator` | `solid` \| `soft` \| `tonal` — how the active segment is drawn | `solid` |

`tone` replaces `color` (which no other control in the kit calls it);
`accentTone` replaces `accentColor`. Both old names still work and are marked
`@deprecated`.

## Shared getter, so this cannot drift

`Panel`'s per-variant class switch was private to `Panel`. Promoted to
`getSurfaceVariantClasses(variant, tone, overrides)` in the theme, alongside
`SURFACE_VARIANT_BASE`, `SURFACE_GLASS_RIM` and
`TRANSLUCENT_SURFACE_VARIANTS`. The test asserts not "it renders" but that the
track contains **every class `Panel` would put on the same surface at the same
tone** — so the two cannot diverge.

## Also fixed in the pass

- The option copy was a hardcoded `text-neutral-600 dark:text-neutral-300`,
  unreadable on a glass track over a photo. It now comes from
  `getSurfaceTextTokens(variant)`, like every other surface-aware control.
- Options gained the kit's focus ring via `getSurfaceTriggerTokens(tone)`.
- The disabled state was a hardcoded neutral; it now uses the surface's muted
  token.

## Breaking

- `variant="theme" | "solid" | "soft"` no longer type-checks. The four
  in-repo call sites (the React and Vue `ThemeToggle`s) were migrated to
  `indicator="tonal"`, which is what `"theme"` drew.
- The default look changes: the track is now `subtle` (tone-tinted) with a
  `solid` raised pill, where it was a fixed neutral track with a tone-tinted
  pill.
- The active label moved from `{tone}-700` to `{tone}-600`, which is the token
  the solid/soft indicators were already using.

Verified visually: all eight track variants paired with the `Panel` they
match, in light, dark and over a photo backdrop; plus the three indicators.
Tests: 14 React, 12 Vue.

**⚠️ Still open:** `MeterGroup`'s absorption into `MultiProgressBar` was
React-only, so Vue's `MultiProgressBar` still lags. Unrelated to this change
but still outstanding.

---

# Follow-up: the `tonal` indicator's border was black (2026-08-27)

Reported: with `indicator="tonal"` and `tone="blue"`, the pill's border came
out black instead of blue.

## Cause

`border-{tone}-400/40` had **no CSS behind it**, so `border` resolved to
`currentColor` — the inherited near-black text colour. Checking the rest of
that token found three of its four shapes missing for **all 21 tones**:

| shape | emitted before |
|---|---|
| `bg-{c}-500/15` | 21/21 |
| `border-{c}-400/40` | **0/21** |
| `dark:border-{c}-300/20` | **0/21** |
| `dark:bg-{c}-400/20` | **0/21** |

So the tonal indicator only ever worked as a light-mode fill. This is
pre-existing — the string is `theme.multiToggle[color].indicator`, which the
old `variant="theme"` used verbatim. I carried it over without re-checking,
which is my own §5.5 checklist item.

## The systemic version

Scanning every per-tone class the theme generates against the built stylesheet
found **16 shapes missing for all 21 tones**, not one:

- `Panel` — `muted` copy, `overlayGradient`, `decorationShape`,
  `decorationGradient`
- `StatCard` / `StatTile` — the decoration corner's wash (`bg-{c}-300/40`),
  which my own Stat work had started relying on
- `Tabs` — the segmented container's dark fill
- `MultiToggle` — the whole `tonal` indicator bar its light fill

All 16 added to `scripts/generate-safelist.mjs`, rebuilt, and re-verified
present for all 21 tones.

## Guard

`react/src/theme/themeSafelist.test.ts` walks every per-tone getter in the
theme, collects the classes, and asserts each one exists in `dist/index.css`.
It reports the *shape* rather than 21 near-identical lines, and skips cleanly
when there is no build to check. Verified it fails — naming
`border-{tone}-400/40` — when that shape is removed from the generator.

One methodological note worth keeping: my first pass compared the theme's
classes against the **safelist source**, and reported 14 shapes. One of them
(`bg-{c}-100/80`) was in the stylesheet all along via another route. The built
CSS is the only authority.

---

# Follow-up: the `solid` indicator had no visible edge (2026-08-27)

Reported alongside the `tonal` border fix: on a light track the `solid` pill
was `bg-white shadow-sm` and nothing else, so the only thing marking the active
segment was its blue *label*. The pill itself did not read.

All three indicators now carry a **tone-following border**, graded by emphasis:

| indicator | fill | edge |
|---|---|---|
| `solid` | white / `neutral-800` | `border-{tone}-300`, `shadow-md` — the crispest |
| `soft` | `{tone}-100` / `{tone}-900/30` | `border-{tone}-300` |
| `tonal` | `{tone}-500/15` / `{tone}-400/20` | `border-{tone}-400/40` — the most washed |

No new safelist shapes were needed — every class used was already emitted for
all 21 tones, verified against the built stylesheet in both light and dark.

Two tests guard it: one asserts every indicator carries an edge whose colour is
*spelled out* rather than inherited, and one asserts that wherever `border` is
present a matching `border-{tone}-*` is too — which is the exact failure that
produced the black rule.

## Note on a false alarm

One cell in the verification screenshot showed an olive-looking border. Sampling
it gave `rgb(222, 237, 0)` — blue channel at **0** where it should be 255,
across 34 pixels of one anti-aliased edge, with the neighbouring pixels correct
at `rgb(223, 236, 255)`. That is the SwiftShader 8-bit overflow already
documented in `Learnings.md`, not a CSS fault.

## ⚠️ Suite currently blocked by another agent

`react/src/components/chart/index.ts` imports `./react/series/TreemapSeries`,
which does not exist yet — an in-flight Treemap. Because the components barrel
pulls in the chart barrel, this fails **every** React test file that imports the
barrel, not just chart ones, and breaks the demo dev server.

Nothing to do with this work. The files I touched were run directly and pass:
`MultiToggle`, `MultiProgressBar`, `themeSafelist`, `Tooltip`,
`tooltipPlacement`, `icons` — **71 tests**. Vue is unaffected: `vue-tsc` clean,
**804 passing**. Re-run the full React suite once that file lands.

---

# `PagedPanel` gained the kit's three loaders (2026-08-27)

`PAGED_PANEL_LOADERS = ["skeleton", "spinner", "progress"]`, **skeleton by
default**, matching `ConnectionFlow` and the rest of the kit. Both kits.

## The bug this surfaced

`loading` was being handed straight to `Panel`, which meant:

- **`bare` mode had no loading treatment at all.** There is no `Panel` on that
  path, so the prop went nowhere — the component simply rendered its page while
  claiming to be loading.
- Panel's loader knows nothing about the header/page split, so it covered the
  whole card. A paged panel that collapses to a bare spinner loses its nav and
  its position indicator mid-fetch.

`PagedPanel` now owns `loading`, `loaderType`, `progress`, `loadingLabel` and
`loadingState`/`#loading`, and `Omit`s them from the inherited `PanelProps` so
the two cannot both fire. The header survives in every case; only the page is
replaced.

## The skeleton is shaped like a page

Three copy lines at 3/4, full and 5/6 width — roughly what a page occupies — so
the panel keeps its real height and nothing jumps when the data lands. Carries
`motion-reduce:animate-none`.

## Also

- `loading` now wins over the empty state. Previously `total === 0 && !loading`
  suppressed the empty state but nothing took its place on the bare path.
- Tests: 18 React (7 new), 16 Vue (6 new) — including that bare mode loads,
  that the header survives, and that loading beats empty.
- Docs: a **Loading** example rendering all three, plus playground controls.

Verified visually in light and dark: all three treatments, plus bare-mode
skeleton and spinner beside a loaded panel for height comparison.

**Note on a false alarm:** one Vue suite run reported a single failure while a
build was running concurrently in the same shell. Three clean runs afterwards
(**810 passing** each) — it was the concurrent build, not a flaky test.

---

# `PasswordInput` made a true `Input` (2026-08-27)

Asked for: behave exactly like `Input` but with the password mechanism, and
match the demo/props on the common ones.

## The bug: Vue was swallowing three-quarters of its own API

`PasswordInputProps extends Omit<InputProps, …>`, so **Vue declared every one
of `Input`'s props on `PasswordInput`** — which removes them from `$attrs`.
The template forwarded only `$attrs`. Measured:

| passed to `PasswordInput` | reached `Input` |
|---|---|
| `size="xl"` | `"md"` — its default |
| `variant="underline"` | `"flat"` — its default |
| `tone="rose"` | `undefined` |
| `placeholder="Secret"` | ✅ — but only because it is a *native attribute* |

That last row is why it survived review: the props that still worked were the
HTML ones, and the props that silently died were the kit's own. Every existing
test passed throughout.

Fixed by forwarding the declared props explicitly, built by removal
(`const { revealable, revealed, ...rest } = props`) so a prop added to `Input`
reaches it without an edit here, with `undefined` values stripped so `Input`'s
own defaults still apply. React was already correct — its spread has no
equivalent trap.

## Tests that would have caught it

The decisive one is **markup equality with the thing it wraps**: render
`PasswordInput` and a bare `Input` at the same settings and assert the
`<input>` class lists are identical. One line, and it fails the moment a prop
stops arriving. Added in both kits, alongside per-prop forwarding assertions,
native-attribute and ref forwarding, and "Input's defaults still apply when a
prop is not passed".

- Tests: 9 React (4 new), 9 Vue (4 new).

## Demo now matches `Input`'s

The playground carries the same control set as the `Input` playground —
variant, size, tone, validation, glow, placeholder, leading icon, disabled,
read-only, on-glass — with the two password-specific props in their own group,
so the parity claim is visible rather than asserted. A new **It is an Input**
example pairs the two at identical settings row by row.

Verified visually: all six input variants and all five sizes, `Input` beside
`PasswordInput`, plus error / success / disabled. The boxes are
indistinguishable apart from the mask and the eye.

## Not a gap, after checking

Vue's `Input` declares no `readOnly` prop where React's has one through
`InputHTMLAttributes` — but **neither kit styles it**; it is a native attribute
in both, so behaviour is identical. `PasswordInput` reads it off `$attrs` in
Vue. Worth declaring on `Input.vue` for type parity, but it is not a
behavioural difference.

---

# `StatCard` revamped as the base for the Stat family (2026-08-27)

The first of the Stat components; the tiles inherit from this one next.

## What changed

| Ask | Result |
|---|---|
| padding | Already there; now surfaced in the demo across the full `SurfacePadding` scale |
| loader types | `STAT_CARD_LOADERS = ["skeleton","spinner","progress"]`, **skeleton default** |
| title colour + size | `labelTone`, `labelSize` — new, falling back to `size` |
| value colour + size | `valueTone` (now value-only), `valueSize` — falls back to `size` |
| variants from Panel | Already `PanelVariant`; `decoration` now comes from Panel too |
| progress type | One `progress` + `progressType: "spinner" \| "bar"`; the bar spans the full width, pinned bottom |
| trend kept, health strip out | `health`/`healthBpm` **removed**; the strip is now **`StatHealthCard`** |
| icon loses the quarter-circle | Deleted; `decoration` is now Panel's `none/gradient/shapes/both` |
| sync value → progress | `syncValueToProgress` |

## The three that were actually bugs

- **`valueTone` tinted the label as well**, so a muted label over a coloured
  figure — the common case — could not be expressed. Now two props, each
  falling back so every existing call site renders identically.
- **The quarter-circle was implied by `icon`.** A hard `rounded-bl-[100px]`
  wash cut an arc across the corner and you got it whether you wanted it or
  not. `Panel` already had a decoration system; the local one is gone.
- **`progress` and `progressBar` were separate props** that could both be set
  and disagreed about tone and value. One feature, one value, one type.

`syncValueToProgress` reads the percentage off the card's own `value` —
including out of a string like `"72%"` — and ignores a non-numeric value,
falling back to `progress` as given.

## Demo rule applied

New shared `ChoiceControl`: a full-width segmented `MultiToggle` when there are
**fewer than four** options, a full-width `Select` otherwise. The `StatCard`
playground uses it throughout. It is a shared control, so the other ~40
playgrounds can adopt it — I did not convert them unasked.

- Tests: 43 on `StatCard` (14 new), 40 across the Stat family.
- Verified visually: both progress renderings and the sync, independent
  label/value tone and size, all four decorations, all three loaders,
  `StatHealthCard`, and the full padding scale.

## Breaking

- `decoration` changed from `boolean` to `PanelDecoration`. `withDecoration`
  is kept as the boolean alias (`true` → `"shapes"`), which is what `StatTile`
  and `StatCountTile` now pass.
- `loading` no longer always overlays: `skeleton` (the new default) replaces
  the content instead. Pass `loaderType="spinner"` for the old behaviour.
- `health`/`healthBpm` removed from `StatCard` in favour of `StatHealthCard`.

**Next:** `StatTile`, `StatCountTile`, `StatChartTile`, `StatGoalTile` to
inherit these properly — and the Vue kit still has no `StatCard` at all, which
remains the open decision from the batch run.

---

## `StatCard` follow-up: three rendering faults (2026-08-27)

### 1. The overlay loaders were inset with square corners

`StatCard` rendered `<Loader overlay>` as a *child of `Panel`*, which lands
inside Panel's padded content div. `absolute inset-0` therefore filled **that**
box — inset by the padding — and `rounded-[inherit]` inherited no radius. The
result was a square overlay floating inside a rounded card, more obvious the
larger the padding.

`Panel` already renders its own loader at the card's level, so `StatCard` now
delegates: `loading` + `loaderType` + `loaderColor` + `loaderProgress` go to
`Panel` for the `spinner` and `progress` types, and `StatCard` keeps only its
card-shaped `skeleton`. Tested with `padding="xl"` and an assertion that the
overlay's nearest `<section>` is the card root.

### 2. The progress bar's caption vanished on a gradient

`Progress` hardcoded `text-neutral-700 dark:text-neutral-200` for the label and
`text-neutral-500` for the value — invisible on a saturated wash. It now takes
`labelClassName` / `valueClassName`, guarded with `hasTextColor` so a supplied
colour *replaces* the default rather than racing it, and `StatCard` passes
white copy when `gradient` is on.

### 3. The spinner readout was too small, wrongly coloured, and crowded

- **Colour:** same hardcoded neutral pair, unreadable on a gradient.
  `ProgressSpinner` gained `valueClassName`, same guard.
- **Size:** the rings were 16–40px carrying a **6–12px** percentage. The number
  is the entire point of a determinate spinner and it could not be read at any
  size. Rings are now 24–56px with a 8–16px readout. `StatCard` is its only
  consumer inside the kit, so the blast radius is small.
- **Spacing:** the ring sat directly under the trend pill; the row went from
  `pt-2` to `pt-4`.

Three existing `ProgressSpinner` tests asserted the old geometry — including
one that recomputed the stroke weight from the old px values — and were updated
with the reason recorded.

Tests: 47 on `StatCard` (4 new), 21 on `ProgressSpinner` (2 new). 2398 passing
overall. Verified visually against all three reported cases, on gradient, plain
and tonal cards.


## Correction — the health strip was not actually removed the first time

Reported by the user: *"did we remove the health monitor? I still see the examples in the demo page."* They were right, and the entry above originally claimed more than I had done.

What I had actually done was mark `health`/`healthBpm` with `@deprecated` and leave the `{health && <EcgMonitor …/>}` branch rendering. A JSDoc tag is a note to a reader; it removes nothing. The docs page still had a dedicated **Health** example built on `<StatCard health=…>`, the page blurb still advertised a "live health strip", and the size-scale description still listed the strip among the things `size` steps — so the demo showed exactly what the user said it showed.

The brief said *"then the trend no health strip, this would move to another child Stat card"*. Moving means the origin no longer has it. Now done properly:

- `StatCard.tsx` — props, destructure, render branch, and both `EcgMonitor` imports deleted. `StatCard` can no longer mount a canvas at all.
- `StatCard.test.tsx` — the three tests asserting the strip *renders* replaced with one asserting it never does. The `StatHealthCard` block already covered the new home.
- `stat-card/examples/Health.tsx` — rebuilt on `StatHealthCard`.
- `StatCardPage.tsx` — the three stale sentences rewritten; the loader example retitled, since it no longer carries health cards.
- `examples/States.tsx` — the three `StatHealthCard`s dropped; they duplicated the dedicated section.
- `UxDemo/demos/StatCardDemo.tsx` — the playground's health switch now selects the *component* (`StatCard` vs `StatHealthCard`) rather than setting a prop that no longer exists. That file is `// @ts-nocheck`, so nothing would have flagged the dead prop.

Verified by DOM probe on the built page rather than by eye: exactly 3 `<canvas>` elements, all three `StatHealthCard`s in the Health strip section, none anywhere else.

**Lesson.** Deprecating and moving are different pieces of work, and I recorded the second while doing the first. A `@deprecated` tag has no effect on a demo — the demo renders whatever still works. When the task is *move X out of Y*, the check is that Y can no longer do X, and the place to check it is the rendered page, not the prop table.

## The Stat family, rebased on the revamped StatCard

Brief: *"rebuild all of the other stat tiles using this base and inheriting the properties, because we are using one demo for all, we need a select on the playground to show them off. the playground options needs to be the same as the base stat card plus the stat variant and the extra properties that this type of card uses."*

### What "inheriting the properties" changed

Before this pass the tiles technically extended `StatCardProps`, but each one *subtracted* from it and renamed what was left. The result was a family where the same concept had a different name and a different reach on every member:

| Component | Was | Now |
|---|---|---|
| `StatTile` | `Omit<StatCardProps, 11 props>`; `title`/`color`/`textColor`/`progress`-object | Full `StatCardProps`. Old names kept as deprecated aliases that map onto the modern ones; the modern one wins when both are passed. |
| `StatCountTile` | `Omit<StatCardProps, 9 props>` | Full `StatCardProps` + `breakdown`. |
| `StatGoalTile` | extended **`StatTile`**, so it inherited the renames too | extends `StatCard` + `goals`, `ringSize`. |
| `StatChartTile` | extended `StatTile`; read `props.color` | extends `StatCard` + `data`, `chartSize`. |
| `StatGraphTile` | extended `StatTile`; **omitted `variant`** and reused the name for the chart kind | extends `StatCard` + `data`, `series`, `chartType`. |
| `StatHealthCard` | already `StatCard` + `state`/`bpm`/`height` | unchanged. |

The `StatGraphTile` row is the one that was a real defect rather than an inconsistency: because it declared `variant: "bar" | "sparkline"` and omitted the base card's `variant`, a graph tile was the only Stat component that could not be given a Panel surface. `variant` now means the surface, as everywhere else; `chartType` means the chart. Old call sites keep working — a `variant` holding `"bar"` or `"sparkline"` is read as the chart kind.

### Bugs found on the way

- **Neither `StatGoalTile` nor `StatChartTile` honoured `size`.** The ring was a fixed 56px and the donut a fixed 192px with a `text-4xl` centre, at every size from `xs` to `xl`. Both now have a token table like the base card's.
- **Both hardcoded `text-neutral-900 dark:text-neutral-100` and friends** for their body copy, so neither responded to a translucent surface and both were unreadable under a `gradient` wash. They read `useSurfaceText()` now and take an explicit gradient branch, as `StatCard` does.
- **`StatChartTile` crashed on a shrinking dataset list** — `data[currentIndex]` with a stale index. Clamped, with a test that rerenders a shorter list under a mounted tile.
- **A goal value outside 0–100 overdrew its ring**, wrapping past the circumference so 140% and 100% were indistinguishable. Clamped.
- **`StatGraphTile` drew light-mode axes and gridlines on every card**, dark ones included. Recharts writes those into presentation attributes where a `dark:` utility never reaches; added `useIsDarkMode()`, a read-only observer of the `dark` class. It deliberately does not call `useTheme` — that hook *owns* the class and writes `localStorage`, so calling it from a leaf would install a second writer of shared state.

### The demo

One playground, `StatTilePlayground`, with a **Stat variant** select at the top and the variant's own extras directly beneath it.

The base controls come from a new shared hook, `kit-docs/shared/StatBaseControls.tsx`, which the `StatCard` page's playground now uses too. That is the mechanism, not a convention: the requirement is that the tile playground offers the same options as the base card, and two hand-maintained copies drift the moment a prop is added. There is one copy, and it returns a `StatCardProps` object that spreads onto any member of the family — which only works *because* they all inherit the same props, so the demo doubles as a check on the refactor.

### Tests

`StatFamily.test.tsx`, 69 tests. The core of it is a `describe.each` over all six variants asserting the same base-prop contract — label, icon, trend, tone, corner, padding, progress bar, error with a working retry, skeleton, meta, footer, every control size. These are written against rendered output rather than types on purpose: the failure being guarded is a wrapper that declares a prop and forgets to forward it, which type-checks perfectly.

### Left out

**The Vue twins.** `vue/src/components/` has `StatTile.vue`, `StatCountTile.vue`, `StatGoalTile.vue`, `StatChartTile.vue` and `StatGraphTile.vue`, but there is **no `StatCard.vue`** — the base does not exist in that kit, so there is nothing to rebase onto. The React `StatCard` revamp did not create one either, so this is the same gap that pass left open, now one step larger. Porting `StatCard` to Vue and rebasing five components on it is its own piece of work, not a rider on this one.

### Verification

React `tsc` clean, 106 files / 2470 tests passing, demo build green, Vue library `vue-tsc` clean. Checked headless in light and dark: all six variants render, dark-mode axis and grid colours confirmed by reading the attributes (`#94a3b8` / `#334155`) rather than the screenshot — the tint they show under SwiftShader is the channel-wrap artifact, not a bug. The bar chart appearing empty was the mount animation not completing under virtual time; with `chartAnimation={false}` the rects are there, and the prop is now a playground toggle.

## Paging promoted from StatChartTile to the base StatCard

Brief: *"one thing I notice in one of the chart variant is that we are allowed pagination, this is a great idea to be on the base stat card that every other one can use. lets add that and an example on how to add the paged."*

`StatChartTile` had a prev / next stepper over its datasets, hand-rolled in its own body. It is now `StatCard`'s, so every variant pages.

### What was shared, and what deliberately was not

`PagedPanel` already had this mechanic, so there were about to be three copies. The **state** is now one hook, `hooks/usePager.ts`: controlled or uncontrolled, clamped on read, resynced by an effect rather than a render-phase `setState`, with optional `loop`. `PagedPanel` and `StatCard` both use it.

The **presentation** is not shared, and that is on purpose. `PagedPanel`'s header carries a title, a subtitle and a divider that a metric card has no room for; forcing one header to serve both would have made both worse. What the two must not disagree about is the clamping and the end conditions, and that is exactly the part in the hook.

Extracting the clamp fixed a real bug by construction: `StatChartTile`'s copy read `data[currentIndex]` with no clamp, so a dataset list that shrank under a mounted tile — a reload returning fewer datasets — crashed on `undefined`.

### The API

```tsx
pages?: StatCardPage[]        // each page overrides the card while it shows
page?: number                 // controlled; omit for uncontrolled
onPageChange?: (page) => void
pagerPlacement?: "top" | "bottom"   // default "top"
showPageIndicator?: boolean   // the "2 / 5" counter, default true
loopPages?: boolean           // wrap past the ends, default false
```

A `StatCardPage` may set `title`, `label`, `value`, `subtitle`, `icon`, `trend`, `body`, `progress`, `meta` or `footer`. **Anything it leaves out falls back to the card**, which is what lets a list of datasets avoid restating the surface, the icon or the trend on every entry. `title` is the caption between the arrows.

Two details worth recording:

- The arrows `stopPropagation`. A Stat card is often `onClick`-able, and without it pressing an arrow would page *and* activate the card underneath.
- The counter is `role="status" aria-live="polite"`, so paging announces the new position instead of leaving a screen reader with no idea the content changed. `StatChartTile`'s stepper had no live region at all.

`StatChartTile` now maps its datasets onto `pages` and renders one donut; its nav header and its index state are gone.

### Demo

`Paged.tsx` on the Stat Card page shows both placements — a plain card paging through regions with the pager on top, and a count tile paging through months with `loopPages` and `pagerPlacement="bottom"`, proving the strip composes with a body the tile owns. The base controls hook gained Paged / Loop / Counter toggles and a placement choice, so paging is reachable from both playgrounds and on every variant.

13 paging tests in `StatFamily.test.tsx`, including the controlled case, the shrinking list, the loop wrap in both directions, and the click not reaching a clickable card.

### Noticed, not fixed

`ExampleCard` renders its `description` as plain text, so the backticks that many of these docs pages already use show literally rather than as code spans. Pre-existing and page-wide, not introduced here — worth a one-line fix in the shared component, but changing how every docs description renders is not a rider on a pagination change.

## Follow-up — "States.tsx does not provide an export named 'default'"

Reported from the dev server. The file *does* export a default, `tsc` is clean and the production build is green, so the error had to be coming from Vite's module graph rather than the source. Fetching the transformed module straight from a fresh dev server confirmed it: `export default function States()` is right there, and the page loads with no console errors and no error overlay.

What made it possible is a **circular import through the barrel**. `StatCard.tsx` did `import { Panel } from "."` — and `components/index.ts` re-exports `StatCard`, so the cycle is `StatCard → barrel → StatCard`. Vite's HMR is where that stops being harmless: when the barrel is re-evaluated mid-update, an importer can observe it partially initialised, and the binding it wanted is missing. The error surfaces at whichever module did the importing, which is why it pointed at an innocent example file.

Adding `StatPager` to the barrel perturbed the evaluation order right before the report, which is almost certainly what tipped it over.

Fixed by importing `Panel` directly from `./Panel`. Five other components still import from the barrel — `InlinePanel`, `SmartGridLayout`, `Modal`, `StartupStageStepper`, `Table` — each one the same latent cycle. They are pre-existing and were not touched here, but they are the same bug waiting for a barrel edit.

Note that the demo aliases `@cjlapao/ui-kit` to the kit's *source*, so every edit to a kit file invalidates the barrel for the demo. A long-running dev server across a session of barrel edits is exactly the condition this shows up in; a restart clears it, and removing the cycles stops it recurring.


## Correction — the export error was my file writes, not the barrel cycle

Two reports of `States.tsx … does not provide an export named 'default'`. I first attributed it to a circular import through the component barrel. That was wrong as a *cause*, and I should have reproduced before explaining.

Reproduced properly by driving Vite directly:

1. Connecting to the dev server's HMR socket and touching the file shows Vite sends a **`full-reload`**, not a `js-update` — the `?raw` import on the same file makes it non-HMR-able. So the `?t=` URL in the error was never going to come from editing that file by itself.
2. Truncating the file and requesting it while empty makes Vite serve **a module with no exports at all** — which is exactly the reported error. Restoring the file fixes it on the next request.

The truncation is mine. Rewriting a file with `cat > file` or a read-then-write script leaves it empty for a few milliseconds, Vite's watcher fires on that intermediate state, and a dev server that happens to be running picks up the empty module. It happened twice because I rewrote demo files in two separate turns while a dev server was live.

Two consequences:

- **The server recovers on its own; the browser does not.** The stale module error sits in the console until the page is reloaded. Nothing needed fixing in the source — the file was correct the whole time, which is why `tsc`, the production build and a fresh dev server all passed while the user kept seeing the error.
- **Write files atomically** — temp file plus `mv` — so the watcher never observes a truncated file. That is the actual fix, and it is on my side, not in the repo.

The barrel-cycle fix in `StatCard.tsx` stands on its own merits (a component should not import its siblings through the package barrel), but it did not cause this and did not fix it.

## Picker — onto the shared field system, and the loading row

Brief: *"first we need to make it look like all the other inputs like Input.tsx, then we also need to fix the loading alignment."*

### The field system moved into the theme

`Input`, `Select` and `SearchBar` each carried a **byte-for-byte copy** of the same three things: the per-tone focus tokens, the `xs`–`xl` padding and type scale, and the validation surfaces. Adding a fourth copy to `Picker` would have made the drift worse, so all three now live in `common/theme/Theme.ts`:

- `getFieldToneTokens(tone)` — `focusBorder`, `focusRing` (inset), `icon`, `buttonFocusRing`
- `FIELD_SIZE_STYLES` / `getFieldSizeTokens(size)` — `px`, `py`, `underlinePy`, `text`, `icon`, `button`
- `FIELD_STATUS_CLASSES` — the error and success surfaces

`Input` and `Select` were migrated onto them with **no test changes**, which is the proof the tables were genuinely identical. `Select` keeps only what is actually its own: the option line-height map and `BOXED_VALUE_LEADING`.

### What Picker was missing

| | Before | After |
|---|---|---|
| Surface | hardcoded `bg-white dark:bg-neutral-900` + `border-neutral-300` | `getInputVariantTokens(variant)` — flat, elevated, ghost, underline, glass, gradient |
| Size | a local `"sm" \| "md"` | the full `ControlSize` scale, from the shared table |
| Focus | `ring-2 ring-{tone}-500/20`, **not inset** | the field system's `-400` border + inset ring |
| Validation | none | `validationStatus` with `aria-invalid` |
| Disabled | none | `disabled`, dimmed with opacity rather than a neutral fill |
| Gradient | none | the glow treatment, with `gradientFrom`/`gradientTo`/`glowIntensity` |
| Copy colours | hardcoded neutrals | the variant's `text` / `icon` tokens |
| Tone prop | `color` only | `tone`, with `color` kept as the alias every sibling has |

The non-inset ring was a real defect, not just an inconsistency: an outer ring is painted outside the border box, so any ancestor with `overflow: auto|hidden` clips it — and `Panel`'s body is `overflow-auto` by default. A Picker inside a Panel showed a sheared ring with hard square corners. Every sibling field had already been fixed for exactly this; `Picker` had been missed.

Widening `size` is a pure widening — `"sm"` and `"md"` are both valid `ControlSize` values — so no call site breaks.

### The loading row

The reported bug. The loading branch was the only one of four without a `flex-1` child: the placeholder had it, the multi-select content had it, the selected-item block had it. So nothing grew, and the chevron sat immediately after the word "Loading…" instead of at the trailing edge.

Fixed by wrapping the spinner and copy in a `flex-1` span. While there, the hand-rolled inline `<svg>` — the `opacity-25` circle plus `opacity-75` path pattern, fixed at `h-4 w-4` and `text-neutral-400` regardless of size or tone — was replaced with the kit's `Spinner`, sized from the field scale and tinted with the tone. The trigger also gained `aria-busy`, `aria-haspopup="listbox"` and `aria-expanded`, none of which it had.

### Demo

The playground now exposes variant, tone, the full size scale, validation, glow and disabled — plus a **Compare with Input** toggle that renders an `Input` directly beneath with the same props, so the alignment claim is visible rather than asserted. Two new examples: `Variants.tsx` (all six surfaces) and `States.tsx` (loading, disabled, error, and beside an Input).

12 new tests, including one that asserts the loading row has a growing child and that the chevron is the trigger's last element.

### Left out

- **`TagPicker` is the same component with the same problems** — its own non-inset `ring-{tone}-500/20`, its own hardcoded surface, no variant support. Its test in `Picker.test.tsx` still asserts the old shape, and that difference is now the marker for what is left. It is the obvious next one.
- **`vue/src/components/Picker.vue`** was not touched; the Vue kit has no shared field system to move it onto.
- `SearchBar` and `InputGroup` still hold their own copies of the tone/size tables and should be migrated onto the theme's the same way `Input` and `Select` were.

## The rest of the field-system migration — TagPicker, SearchBar, InputGroup

The three follow-ups flagged after `Picker`. The Vue twin is explicitly out of scope; it is its own project.

### SearchBar and InputGroup — mechanical, no test changes

Both were migrated onto the theme's field tables and **no test needed editing**, which is the evidence the local copies were genuinely identical rather than quietly drifted.

- **`SearchBar`** kept exactly one thing of its own: `CLEAR_HOVER`, the clear button's per-tone hover treatment, which no other field has. Its `focusBorder`, `focusRing`, `icon` and `clearFocusRing` (now `buttonFocusRing`) were byte-for-byte `Input`'s, and its size table was the shared one minus `button`.
- **`InputGroup`** gave up only its size table. Its tone tokens are deliberately *not* the shared ones and stay local with a note saying why: the group draws its edge with an `outline` rather than a `ring`, because the addons sit flush against the group's edges with opaque fills and paint straight over a ring — outlines are painted after all descendants, so they survive. Forcing it onto the shared shape would have reintroduced the bug that comment records.

That distinction is the point: sharing is right when disagreement would be a bug, and wrong when the difference is the fix.

### TagPicker — the same treatment as Picker

| | Before | After |
|---|---|---|
| Surface | hardcoded `bg-white dark:bg-neutral-900` + `border-neutral-300` | the six `InputVariant` surfaces |
| Size | **no size prop at all**; `px-3 py-2 text-sm min-h-10.5` fixed | full `ControlSize`, with a per-size `MIN_HEIGHT` |
| Focus | `ring-2 ring-{tone}-500/20`, not inset | the field system's `-400` border + inset ring |
| Validation / gradient | none | `validationStatus` with `aria-invalid`; the glow treatment |
| Tone prop | `color` only | `tone`, with `color` as the alias |
| Spinner | raw inline `<svg>`, fixed `h-4 w-4`, `text-neutral-400` | the kit's `Spinner`, sized from the field scale and tinted |
| `aria-busy` | absent | present |

`MIN_HEIGHT` is new rather than carried over: the pills wrap, so without a floor the trigger is shorter when empty and the control jumps as the first tag lands. It was a single hardcoded `min-h-10.5`, which only made sense at `md`.

**`readOnly` stopped repainting the surface.** It applied `bg-neutral-50 dark:bg-neutral-800/50`, a same-specificity fight with the variant's own fill that turned a glass or underline trigger into an opaque grey slab. It now dims with `opacity-75` — the same call `Input` already made for `disabled`, and for the same reason.

TagPicker's chevron already used `ml-auto`, so it never had Picker's loading-alignment bug.

### Demos

Both playgrounds now expose variant, tone, the full size scale, validation, glow and the behaviour toggles, each with a **Compare with Input** switch rendering an `Input` beneath with the same props — so the alignment claim is visible rather than asserted. A `Variants.tsx` example was added to the TagPicker page.

10 new TagPicker tests, including one asserting `readOnly` dims rather than repaints.

### Verification

React `tsc` clean, 106 files / 2508 tests passing, both builds green, Vue `vue-tsc` clean. Safelist regenerated and checked per-tone against the built `dist/index.css`; the new `min-h-*` classes are literals in source, so Tailwind scans them without a safelist entry.

Two notes:

- Regenerating `common/safelist.css` also picked up ~62 `stroke-*` / `fill-*` lines from the charts agent's edits to `generate-safelist.mjs`, which had not been regenerated. Correct output of their source change, not mine.
- The full suite produced a spurious failure on three separate runs — `Breadcrumb` twice, `Accordion` and `Carousel` once each — always passing in isolation and on re-run, with the failing test reporting 6–10s. These are load-sensitive timing tests, not regressions, but the suite has a flakiness problem worth its own pass.

## Loading: disabling the pickers, and a loading state for SearchBar

### Picker and TagPicker — loading disables the trigger

`loading` showed the spinner but left the trigger clickable, so you could open a picker onto an empty list — which reads as "no results" rather than "not ready", the opposite of what is true. Both now pass `disabled={disabled || loading}`, and `TagPicker`'s click guard gained `&& !loading`.

The two states are kept visually distinct rather than collapsed:

- **disabled** — `cursor-not-allowed` and `opacity-60` (`opacity-50` on TagPicker, its existing value)
- **loading** — `cursor-wait`, and *no* dim

Fading a loading trigger would fade the spinner, which is the one thing on it that explains why it is inert. The dim stays for a genuine `disabled`, where there is nothing else saying so.

### SearchBar — a loading state, and why it does not disable

New `loading` prop: the **leading glyph** becomes a `Spinner` and the bar reports `aria-busy`. It replaces the search icon rather than sitting beside the clear button, so nothing shifts position when the query resolves.

**The input deliberately stays enabled.** This is the opposite call to the pickers, for a real reason: a picker disables its trigger because there is nothing to choose until the list lands, but the entire point of a search bar is that you keep typing while the previous query is in flight. Disabling it would swallow keystrokes and fight the debounce. Clearing also stays available while loading, so an in-flight search can be abandoned.

### Demo

The SearchBar playground gained a `loading` toggle *and* a simulated in-flight search — typing holds each query for 900ms, so the spinner is a state you can watch happen rather than a prop you flip. A `Loading.tsx` example puts a loading `SearchBar` next to a loading `Picker` so the two different answers are visible side by side, and `TagPicker` gained the `States.tsx` example `Picker` already had.

8 new tests: the trigger is disabled and will not open, loading takes the wait cursor and not the dim, a genuinely disabled control still dims, the SearchBar input stays typable while loading, and the query can still be cleared.

### Verification

`tsc` clean, 106 files / 2516 tests passing, both builds green. Confirmed on the built pages by DOM probe rather than by eye: both loading triggers carry `aria-busy="true"`, a real `disabled` attribute and `cursor-wait`.

## SplitView — variants, tone, sub-items and the three loaders

Brief: *"the variants, we need to add them, then the search needs to follow that same variants. we need to add to the demo a way to disable the notification icon when something is new and add examples of the sub items we can have there so the main item can expand. we also change the property color for tone to be inline with the other ones and the loading needs to have the 3 types."*

### Variants, and two real bugs they exposed

`variant` is now the `Panel` surface family — all eight, via `getSurfaceVariantClasses`. Adopting it uncovered two defects rather than just an absence:

- **The detail pane was a bare `bg-white` with no `dark:` partner.** The entire right-hand half stayed a white slab in dark mode. It now has no fill of its own and inherits the container's surface.
- **The list pane used an opaque `bg-gray-50/80 dark:bg-gray-900/80`.** An opaque fill *replaces* the container's surface, so a glass or liquid-glass SplitView would have lost its backdrop on that half. It is now a translucent tint — `bg-black/[0.025] dark:bg-white/[0.025]` — which composites over whatever the variant paints. The row hover was changed the same way for the same reason.

Every remaining hardcoded `gray-*` (the list title, the empty message, row labels and subtitles, the expand caret, the single-item action bar) now comes from `getSurfaceTextTokens(variant)` or the tone palette, so the copy tracks the surface it sits on.

### `tone`, and a separate `surfaceTone`

`color` became `tone`, with `color` kept as a deprecated alias and `tone` winning when both are passed.

Then a problem the rename made visible: feeding `tone` to `getSurfaceVariantClasses` tinted the whole two-pane layout in the accent colour, so the default `blue` silently repainted every existing SplitView `bg-blue-50/80`. **`surfaceTone` is a separate prop defaulting to `neutral`.** The accent's job is to stand out *against* the surface; an accent that matches its own background has nothing to stand out from. `tone` stays the accent — active row, resizer, search field — and `surfaceTone` tints the panes only when asked.

### Search follows the surface

The built-in `SearchBar` was pinned to `variant="gradient"` with a `subtle` glow on every surface. `SEARCH_VARIANT_FOR_SURFACE` maps each surface to the `InputVariant` that belongs on it — glass on glass, ghost on subtle and tonal, elevated on elevated, flat on outlined and default. `searchVariant` overrides it. The field also takes its size from the SplitView's own.

### The notification dot

`showHighlightIndicator` (default `true`). Off, a `highlight` row keeps its accent tint and loses the pulsing dot — the state without the cue, which is what you want once the user has been told, or on a list where most rows are new and the dots become noise.

### Sub-items

No API change — `subContent` already existed — but two things made it hard to use, both fixed:

- **The expand caret was `opacity-0` until hover.** The only cue that a row *had* sub-items was hovering it, so on a list where only some rows expand the feature was undiscoverable. It is `opacity-60` now, rising to full on hover.
- There were **no examples**. `SubItems.tsx` shows both modes side by side: `autoExpand` (selecting opens the sub-items) and `autoExpand={false}` (a caret separates selecting from drilling in), the second also demonstrating `showHighlightIndicator={false}`.

### Loaders

`loaderType` with the kit's three treatments, `skeleton` by default, plus `loadingProgress` for the determinate bar. The skeleton is shaped like both panes so the list keeps its width and the layout does not jump; the spinner and progress types still cover the view, leaving the previous content readable underneath.

The skeleton's list half is capped at `max-w-[45%]`: the list width is a fixed `w-72`, which in a container narrower than that ate the whole view and left the detail half nowhere to draw — visible immediately in the three-across docs example.

### Demo

The playground gained variant, accent tone, surface tone, search variant, loader type, sub-items, expand-on-select and the new-item indicator. Three new examples: `Variants.tsx` (all eight surfaces), `SubItems.tsx`, `Loaders.tsx`.

23 tests in a new `SplitView.test.tsx` — every variant renders, the detail pane has no fill, the list tint is translucent, the surface stays neutral while `surfaceTone` tints, the search follows and can be overridden, `tone` and `color` agree with `tone` winning, the dot is opt-out, the caret is visible without hover, all three loaders behave, and sub-content is gated correctly in both expand modes.

### Verification

React `tsc` clean, **107 files / 2544 tests** passing, both builds green, Vue `vue-tsc` clean. Safelist regenerated and checked per-tone against the built `dist/index.css`.

Two process notes:

- The full test suite was **OOM-killed** (exit 137) at the default worker count. `--maxWorkers=2` runs clean. That is the same pressure behind the intermittent `Breadcrumb` / `Accordion` / `Carousel` timing failures reported earlier — memory-starved workers, not flaky assertions. The suite would benefit from a bounded worker count in its config.
- A `vite preview` process killed mid-build left `demo/build/index.html` at **0 bytes**, which made the docs page look empty and briefly read as a code failure. Same class as the truncated-file problem from earlier in the session: a partial write from an interrupted process, not a bug in the source.

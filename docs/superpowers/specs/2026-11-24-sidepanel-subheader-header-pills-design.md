# SidePanel — subHeader strip & headerPills section

Date: 2026-11-24
Status: approved
Follows: side-panel-surface-variants (`2026-10-25`), ai-orb-playground-side-panel (`2026-11-19`)

## Problem

A SidePanel has exactly three regions: header, scrolling body, footer. Two
real needs fall between them:

1. **A non-scrolling action strip under the title section.** Filters, tab
   bars, context actions that belong to the panel as a whole and must stay
   visible while the body scrolls. Today the only places to put them are the
   header (wrong row — the title belongs there) or the top of `children`
   (wrong box — it scrolls away with the body).
2. **A pills / quick-actions slot in the title row, centred with the close
   button.** `headerActions` exists but reads as the button cluster; a status
   pill or a quick toggle next to the close button wants its own slot so the
   two can coexist and be styled separately.

The footer needs no work: it is already `flex-none` outside the scroll
container (both kits), i.e. sticky — it just never said so.

## Decisions (user-approved)

1. **`subHeader?: ReactNode`** — the strip between the title section and the
   body. Rejected: `actionHeader` (one word-swap from the existing
   `headerActions` — a doc/autocomplete trap), `toolbar` (implies buttons
   only; the section is for anything), `bodyHeader` (InlinePanel's word, but
   it reads as part of the body, which this explicitly is not).
2. **`headerPills?: ReactNode`** — new prop, DOM order inside the header's
   right cluster: `[collapse] [headerActions] [headerPills] [close]`.
   `headerActions` keeps its meaning (buttons/menus); the two coexist.
3. **React only.** The Vue kit's SidePanel is the knowingly-behind legacy
   port; the divergence is recorded in Learnings.md, not silently fixed,
   per the existing convention (vue/CONVENTIONS.md, Learnings 2026-11-17).
4. **Borderless strip.** The React SidePanel's chrome carries no hairlines —
   surfaces are variant-driven, and the Modal lesson stands: hardcoded
   dividers break glass surfaces. A lone `border-b` under the strip would
   also read arbitrary when nothing separates header from strip. Consumers
   style through a `data-sp-sub-header` hook, matching the `data-sp-*`
   convention the tests and skins already use.
5. **Strip padding, not header padding.** Same `px` as the header from the
   `size` token, `py` one step tighter (the Modal tabs-strip precedent:
   `py-2` under a `py-4` header). It must read as a strip under the header,
   not a second header.

## Design

### Region map (unchanged invariants)

Only the body is the overflow container (`flex-1 min-h-0 overflow-y-auto`).
`subHeader` is a `flex-none` sibling between the header and the body inside
`data-sp-content`, so it can never scroll; the footer keeps its existing
`flex-none` seat below the body.

```
header      flex-none   [icon] title/subtitle   [collapse][actions][pills][close]
subHeader   flex-none   ← NEW (absent ⇒ renders nothing)
body        flex-1 min-h-0 overflow-y-auto      children
footer      flex-none   (already sticky)
```

### `subHeader` (`react/src/components/SidePanel.tsx`)

- New `SidePanelProps` entry, documented as *"non-scrolling strip between the
  title section and the body — filters, tabs, context actions; usable for
  anything."*
- Rendered `{subHeader && <div data-sp-sub-header className={classNames("relative flex-none", SIZE_TOKENS[size].stripPad)}>{subHeader}</div>}`
  between the header div and the body div.
- `SIZE_TOKENS` gains a `stripPad` per size: `xs px-2 py-1`, `sm px-3 py-1.5`,
  `md px-4 py-2`, `lg px-5 py-2.5`, `xl px-6 py-3`. Existing `pad` untouched.
- Lives inside `data-sp-content`, so collapse gets it for free: the collapsed
  rail keeps the full panel mounted, `inert` + `aria-hidden` + `opacity-0`
  hide the strip along with everything else. `top`/`bottom` panels stack it
  identically (same flex column); docked/overlay and both `motion` modes are
  unaffected — the strip is inside the already-clipped content box.
- No new i18n keys: the section carries caller content only, like the
  header and body.

### `headerPills`

- Rendered inside the existing right cluster
  (`flex shrink-0 items-center gap-1 pt-0.5`) as
  `{headerPills && <div data-sp-header-pills className="flex items-center gap-1">{headerPills}</div>}`,
  after `headerActions`, before the close `IconButton`.
- Centring with the close button is structural: pills and the close button
  are siblings in the same `items-center` row, so no per-size optical
  alignment code is added — the cluster's existing `pt-0.5` keeps the whole
  row (close button included) optically level with the title.
- Pills stay in the tab order and the accessibility tree (they are real
  controls, unlike the scrim) — nothing to hide.

### Footer doc touch-up

`footer`'s JSDoc and PropsTable line gain the explicit word: sticky, never
scrolls with the body. No behaviour change.

### Out of scope (recorded)

- Vue parity (`actionHeader`/`headerPills` slots) — Learnings.md divergence
  line added; component work, not decision work, whenever the Vue port
  catches up.

## Tests (vitest, `SidePanel.test.tsx`)

New describe "SidePanel — subHeader and headerPills":

1. strip renders as a sibling **before** the scroll container and is
   `flex-none` — it is not inside the `overflow-y-auto` element.
2. no strip element when `subHeader` is absent.
3. strip carries the `size` scale's padding (`md` → `px-4 py-2`).
4. pills render in DOM order after `headerActions` and before the close
   button, inside the same `items-center` cluster row.
5. pills and `headerActions` coexist when both are provided.
6. collapsed panel: strip and pills sit under `data-sp-content` and inherit
   the `inert` + `aria-hidden` + `opacity-0` hiding.

## Demo & docs (`react/demo/src/kit-docs/components/side-panel/`)

- `SidePanelPlayground`: two Behaviour toggles — **Action strip** (a filter
  row of small buttons) and **Header pills** (a count pill + a quick-action
  icon button) — wired to the new props.
- `examples/ActionsAndPills.tsx` + ExampleCard on `SidePanelPage`: an
  inspector showing the strip with filter buttons and two pills beside the
  close, body scrolling under both.
- `PropsTable`: rows for `subHeader` and `headerPills`; `footer` row reworded
  to state it never scrolls.

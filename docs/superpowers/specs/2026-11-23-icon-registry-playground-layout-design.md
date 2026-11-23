# Icon Registry playground — fixed search & kit CodeBlock

Date: 2026-11-23
File: `react/demo/src/kit-docs/components/icons/IconsPage.tsx`

## Problem

The Icon Registry gallery page scrolled as one document: the `SearchBar`
(once clamped to `max-w-md`) rode away with the page, so hunting through
hundreds of icons meant scrolling back up to refine the query. The usage
snippet also used the docs-local `shared/CodeBlock` instead of the kit's own
`CodeBlock` component, so the page didn't exercise (or advertise) the kit
component it documents alongside.

## Design

Single-column restructure of the gallery inside the existing two-column grid:

- The gallery column hosts the `SearchBar` at the top, full width of the
  tile grid (the `max-w-md` clamp is gone).
- The tile grid lives inside the kit `ScrollArea`
  (`variant="hover"`, `mask`) capped with
  `max-h-[calc(100dvh-20rem)] min-h-[16rem]`. The 20rem reserve covers the
  SideMenuLayout header, page header, search bar and paddings, so the docs
  body itself never scrolls and the search is permanently on screen. Icons
  browse inside the area's own scrollport. No sticky positioning anywhere —
  the user explicitly asked for a scroll-area layout instead.
- The usage snippet renders through the kit `CodeBlock`
  (`@cjlapao/ui-kit`) with `value/filename/language="tsx"`,
  `showLineNumbers`, and `maxHeight={360}` so the sticky aside stays compact
  (its internal `ScrollArea` handles longer snippets). The kit component's
  root is already `relative`, satisfying the docs CONVENTIONS sr-only rule.
- The preview/size/notes aside and the two-column grid (tiles + 22rem aside,
  `items-start`, `auto-rows-min content-start`) are unchanged.

## Verification

Headless Chromium against the running Vite demo (`/icons`, 1440×900):

- Scroll the icon area to 1200px → search bar bounding box y unchanged
  (217 → 217); `#docs-scroll` body `scrollHeight === clientHeight` (840 =
  840), i.e. the page body cannot scroll at all.
- Area metrics: `scrollHeight 4444` vs `clientHeight 580` — real internal
  scroll; `max-h-[calc(100dvh-20rem)]` resolves to 580px at 900px viewport.
- Filtering ("arrow") narrows the grid instantly with the bar still on
  screen; kit CodeBlock shows `Search.tsx`, line numbers, highlight, copy
  button.
- `tsc --noEmit` on the demo: no new errors (five pre-existing ones in
  unrelated example files remain).

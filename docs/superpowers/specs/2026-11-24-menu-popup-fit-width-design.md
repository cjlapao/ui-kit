# Spec: Menu Popup Fit-to-Cap Width + ScrollArea Block Fix

Date: 2026-11-24
Status: implemented (a67f00ef) — browser-verified: scrollWidth == clientWidth on the
consumer menu, 256 floor on short menus, ellipsis at a custom 420 cap

## Goal

A `Menu` popup (and every `horizontal={false}` `ScrollArea`) must never clip its
content horizontally. Long row titles should make the popup grow to fit — up to a
`maxWidth` cap — instead of being sliced mid-word at the panel edge.

## Problem

A consumer app's menu with icon + title + description rows renders with
descriptions cut mid-word at the right border and titles cut **without** an
ellipsis. Reproduced in headless Chrome with the kit's exact DOM chain:

| content wrapper | viewport client | content scrollWidth | outcome |
|---|---|---|---|
| `table min-w-full` (current) | 226px | **258px** | mid-word clipping, no scrollbar |
| `block min-w-full` | 226px | 226px | clean — ellipses work, wrapping correct |

Root cause is three layers stacking:

1. **Fixed popup width.** `MenuPopup` (react/src/components/Menu/MenuPopup.tsx:42)
   applies an inline `width` (`props.width ?? 256`, set at Menu.tsx:212 and
   Menu.tsx:318) plus a hard-coded `maxWidth: calc(100vw - 16px)`.
2. **Table content wrapper.** `ScrollArea` renders its content div as
   `display: table; min-width: 100%` (+ a permanent 10px scrollbar lane, `pr-2.5`)
   at react/src/components/ScrollArea.tsx:461.
3. **`truncate` titles.** Menu rows ellipsize titles with `block truncate`
   (white-space: nowrap) at Menu.tsx:175. In table layout a table is never
   narrower than its widest unbreakable content, so the longest one-line title
   inflates the whole table beyond the popup's fixed width. The flex child's
   `min-w-0` does not rescue table sizing.

Because `MenuSurface` passes `horizontal={false}` — which sets `overflow-x: hidden`
on the viewport (ScrollArea.tsx:443) — the overflow is silently clipped: no
scrollbar, descriptions wrap at the *inflated* width and are sliced mid-word,
titles lose their ellipsis because the ellipsis point lands off-screen.

Measured inflation: table width = longest title's full one-line width + icon
gutter (28px) + row padding (24px) + scrollbar lane (10px).

## Design

Approach chosen: **width-as-floor + `maxWidth` cap** (over opt-in `width="fit"`,
which leaves the broken case broken by default, and over wrapping titles, which
doesn't let the menu grow).

### 1. ScrollArea: no table layout without a horizontal axis

React `ScrollArea.tsx:461`:

```tsx
virtualScroll ? "h-full min-w-full"
  : horizontal ? "table min-w-full"
  : "block min-w-full"
```

Table sizing exists to let horizontally scrollable content exceed the viewport;
with `horizontal={false}` it can only inflate and clip. The 10px `pr-2.5`
scrollbar lane is kept (with Tailwind's border-box and `block`, content ==
viewport width).

Vue `ScrollArea.vue:269` gets the same conditional (`props.horizontal` defaults
to `true` there, mirroring React).

Consumers affected: every explicit `horizontal={false}` call site (Menu, Combobox
list, Select list, TagPicker, SideMenu panes, Memory/Library/KnowledgeMap lists,
AgentMap lists, …) — all vertical lists, for which block is the correct layout.
The default (`horizontal` true) keeps `table`.

### 2. Menu: `width` becomes a floor; new `maxWidth`

`MenuProps` (react/src/components/Menu/types.ts):

| prop | before | after |
|---|---|---|
| `width?: number \| string` | fixed popup width, default 256 | **minimum** popup width (floor), default 256 |
| `maxWidth?: number` | — | cap for content-driven growth, **default 380** |

`MenuPopup` takes `maxWidth` and renders instead of the inline fixed width:

```ts
minWidth: width,                                        // floor, default 256
maxWidth: `min(${maxWidth}px, calc(100vw - 16px))`,      // cap, never past viewport
```

No inline `width`. A fixed-position box shrink-wraps to its content: narrow
menus sit on the floor (256px — rendering unchanged), long rows widen it up to
the cap, and `truncate` titles ellipsize only past the cap. Descriptions wrap
inside the box.

Applied consistently in all three `Menu` render modes:

- root popup — Menu.tsx:318, popup branch (`<MenuPopup … width={props.width ?? 256}>`)
- tiered submenus — Menu.tsx:212 (`props.width ?? 256` → same floor+cap)
- inline mode — Menu.tsx:318, else branch (`<div style={{ width … }}>`) →
  `minWidth`/`maxWidth` (cap falls back to `100%` of the layout container)

`MenuButton` (react/src/components/MenuButton/MenuButton.tsx + types.ts): new
`menuMaxWidth` prop threaded to `Menu.maxWidth`.

### 3. Untouched

- `DropdownMenu` (React and Vue): no ScrollArea, already content-sized; its
  hard viewport−16 clamp stays.
- `maxHeight` / `--menu-popup-max-height` scroll-cap machinery.
- ScrollArea's `table` default for horizontal scrolling.

## Testing

- `ScrollArea.test.tsx`: content wrapper gets `block min-w-full` when
  `horizontal={false}`, `table min-w-full` by default; `virtualScroll` branch
  unchanged. Existing `horizontal={false}` tests (bars, tabIndex, inline
  overflow clamp) must stay green.
- `vue ScrollArea.test.ts`: same class assertion via `props.horizontal`.
- `Menu.test.tsx` / `MenuButton.test.tsx`: opening a popup sets the portal
  element's inline `minWidth` (`256px` default) and `maxWidth`
  (`min(380px, calc(100vw - 16px))` default); custom `width`/`maxWidth` values
  appear verbatim. (jsdom has no layout — see harness.)
- Real-browser check (playwright-core + system Chrome, reusing the
  `.menu-repro/` harness): a menu with the consumer's long title/description
  rows must measure viewport `scrollWidth === clientWidth`, show ellipsized
  titles at the cap, and match the popup box to the longest row within the cap.

## Docs / demo

- kit-docs Menu page: `width` description updated (floor semantics), `maxWidth`
  added to the props table; MenuButton page gains `menuMaxWidth`.
- Menu/MenuButton playgrounds: numeric control for `maxWidth`.

## Acceptance criteria

1. The reported menu (icon + title + description + separators at the kit's
   default sizes) clips **nothing**: viewport `scrollWidth == clientWidth`
   in Chrome at width 240–480.
2. Long titles are fully visible up to the 380px cap; past it they ellipsize
   at the panel edge (with the `…` visible).
3. Menus whose content fits under 256px render exactly as before.
4. `maxWidth` (and `menuMaxWidth`) override the cap; viewport−16 remains the
   absolute safety limit.
5. No regression in `ScrollArea` consumers with `horizontal={false}` (vertical
   scrolling, bars, masks) or default (both-axis) usage.

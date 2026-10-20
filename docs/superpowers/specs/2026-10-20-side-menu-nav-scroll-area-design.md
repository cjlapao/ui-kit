# Design: SideMenu nav body scrolls through ScrollArea (hover bar)

**Date:** 2026-10-20
**Status:** Approved by user ("lets make the scroll only show on hover" — approval
of the presented swap with the bar visibility set to `hover`)
**Follows:** ScrollArea is the kit's answer to per-browser scrollbar painting;
the SideMenu's nav body was the last scroller in the shell still using the
webkit-pseudo paint.

## Background

The nav list is one shared scroll box for all three shells (desktop panel,
offcanvas, mobile drawer) at `SideMenu.tsx:1136`:

```tsx
<div className={`flex-1 px-3 py-1 overflow-y-auto w-full ${THIN_SCROLLBAR}`}>
```

`THIN_SCROLLBAR`'s `[&::-webkit-scrollbar]` string is Chrome-only — Firefox
kept its default bar — and the bar is always painted. `ScrollArea` hides the
native scrollbar (scrolling stays fully native) and tracks the content with
thin overlay bars whose visibility follows a `variant`.

## Decisions (user-confirmed)

- **Component:** the `ScrollArea` swap as presented (frame `flex-1 w-full`,
  `contentClassName="px-3 py-1"`).
- **Bar visibility:** `variant="hover"` — the bar shows only while the
  pointer is over the list (user's follow-up), not the `auto`
  while-scrolling default.

## Changes

### `SideMenu.tsx`

- Import `ScrollArea`; replace the nav scroll `<div>` with
  `<ScrollArea variant="hover" className="flex-1 w-full"
  contentClassName="px-3 py-1">` wrapping the existing `<nav>` in place.
- Padding lives on the content wrapper so it scrolls with the rows (today's
  semantics) and rows keep their 12px inset; the frame's `overflow-hidden`
  zeroes the flex automatic minimum size exactly as `overflow-y-auto` did,
  so the footer/collapse bar stay pinned.
- `mask` stays off (discrete rows, no clipped-row story). `tabIndex` default
  kept: while the list overflows the viewport joins the tab order for
  arrow-scrolling; when it fits it doesn't.
- `THIN_SCROLLBAR` import removed — that line was its only use in the file.
- All three shells share this render path, so all three get the identical
  cross-browser bar. The skeleton (static, never scrolls) is untouched.

### Tests — `SideMenu.test.tsx`

- The nav renders inside the ScrollArea slots (`scrollarea` frame wraps
  `scrollarea-content`, which carries `px-3 py-1`), with
  `data-variant="hover"` on the frame.
- No `overflow-y-auto`/`THIN_SCROLLBAR` residue on the body scroller.
- Links still render and stay clickable inside the new wrapper.

### Demo

No new example — the existing SideMenu playground preview exercises the
nav scroller (long item list, all variants); the hover-only bar is visible
there immediately. Kit `dist` rebuilt so the running site serves it.

## Non-goals

- `mask` fade, `always`/`scroll` variants, per-caller bar-visibility props
  on SideMenu.
- Scroller changes in the skeleton or the dropdown panels.

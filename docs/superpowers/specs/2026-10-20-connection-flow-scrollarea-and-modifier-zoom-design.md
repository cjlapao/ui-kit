# Design: ConnectionFlow — ScrollArea viewports + modifier-gated wheel zoom

**Date:** 2026-10-20
**Status:** Approved by user (Ctrl **or** Cmd gate, `variant="auto"` bars, build)
**Touches:** `react/src/components/ScrollArea.tsx`,
`react/src/components/ConnectionFlow/{ConnectionFlow.tsx,ConnectionFlowSvg.tsx}`,
demo copy.

## Background

The flow's viewport is a raw `overflow-auto` div with the native thin
scrollbar, and its `onWheel` zooms unconditionally — the wheel that should
page through a flow instead scales the graph, and the page behind can never
be scrolled from over it. Card bodies that cap with `maxHeight` scroll the
same way (native bar). The kit already owns `ScrollArea`, whose virtual bars
implement PrimeVue's variants: `auto` (pointer-over or while scrolling, then
fades), `hover`, `scroll`, `always`, `hidden`.

## Decisions (user-confirmed)

1. **ScrollArea in both places, `variant="auto"`** — the macOS overlay: bars
   are invisible until the pointer is over the area or it is being scrolled.
   Viewport and capped card bodies both switch from native overflow to
   `ScrollArea`; the per-card wheel guard (`data-scrolls`) retires with it.
2. **Wheel zooms only with a modifier**: `ctrlKey || metaKey` (Windows
   Ctrl, macOS Cmd; trackpad pinch already arrives as Ctrl+wheel, so pinch
   keeps zooming). A plain wheel is left entirely to the browser: it scrolls
   the area — both axes — or a card body that scrolls. The zoom buttons,
   fit, `fitOnLoad` and the imperative handle are untouched.

## ScrollArea (additive only)

- `viewportClassName?: string` — classes for the scrolling viewport, for the
  caller that must reach the scroller itself (`overscroll-contain`, so a
  wheel at the end of the canvas does not chain to the page). Default
  `undefined`: every existing consumer is byte-identical.
- `viewportRef?: React.Ref<HTMLDivElement>` — forwarded, merged with the
  internal ref (callback composition). This is how ConnectionFlow keeps its
  existing `viewportRef`-based fit/zoom/pan code pointed at the real
  scroller; the alternative (`querySelector('[data-slot=…]')`, the pattern
  Table and Combobox use) was rejected only because a ref is exact and the
  component is in the same package.

## ConnectionFlow viewport

- The scroll div becomes
  `<ScrollArea variant="auto" className="h-full w-full select-none"
  viewportClassName="overscroll-contain" viewportRef={viewportRef} …>`.
- Frame (which receives the spread handlers) keeps `onWheel/onPointerDown/
  onPointerMove/onPointerUp` — events bubble from the viewport. Pointer
  capture moves to the frame (`currentTarget`); the pan exclusion selector
  gains `[data-slot="scrollarea-scrollbar"]` so dragging a thumb never pans.
- `onWheel`: `if (!interactive) return; if (!(e.ctrlKey || e.metaKey))
  return; e.preventDefault(); zoom…` — the `[data-scrolls]` guard is deleted
  with its purpose: a plain wheel no longer reaches the zoom code.
- `THIN_SCROLLBAR_FIELD` import retired here.

## Card body (Svg renderer)

The scaled body div keeps size/padding/transform; its `overflow-y-auto +
THIN_SCROLLBAR_FIELD`, `data-scrolls` and `stopPropagation` wheel guard go.
When `laid.scrollable`, the content is wrapped in
`<ScrollArea variant="auto" className="h-full w-full"
contentClassName="block w-full">` — `block` deliberately overrides the
content wrapper's `table` display, which exists for horizontal fitting and
would shrink-to-fit a card body that has a fixed width and scrolls only
vertically.

## Behaviour notes

- Bars inside the scaled card are drawn in the card's own coordinate space
  (the transform covers them) — they zoom with the card, as everything else
  in it does.
- Keyboard: the viewport joins the tab order when it overflows (ScrollArea
  default) — arrow/Page keys scroll; `auto` shows the bars while doing so,
  which is exactly why `auto` was picked over `hover`.
- `interactive={false}` still disables zoom/pan entirely.

## Tests

- `ScrollArea.test.tsx`: `viewportClassName` lands on the viewport;
  forwarded `viewportRef` points at the viewport (data-slot match).
- `connectionFlowViewport.test.tsx` (existing queries keep working — the
  viewport element still carries `.overscroll-contain`):
  - viewport is a ScrollArea (`[data-slot="scrollarea"]` + viewport slot);
  - plain `wheel` (no modifier) does **not** change the zoom readout and is
    not `preventDefault`ed;
  - `ctrlKey` wheel (and `metaKey`) does zoom (readout 100% → ≠100%) and
    preventDefaults;
  - toolbar zoom/fit/reset tests unchanged.
- `connectionFlowNodeBody`-level: a `maxHeight` (scrollable) card renders a
  nested ScrollArea inside the card, and a non-scrollable card does not.

## Demo

Copy fixes only: playground caption "Scroll to zoom" → "Ctrl/⌘‑scroll (or
pinch) to zoom"; docs-page header sentence mentions the modifier.

## Non-breaking

`ScrollArea` gains two optional props (default = current behaviour);
`ConnectionFlow` consumers keep props/behaviour except the two approved
interaction changes (wheel semantics, bar style). No layout/geometry change.

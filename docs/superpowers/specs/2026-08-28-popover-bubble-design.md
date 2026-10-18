# Popover "bubble" indicator design

**Date:** 2026-08-28
**Status:** approved (user sign-off on both open questions: single dot, `arrow` union)
**Supersedes:** nothing — additive to the Popover shipped in `2026-08-28-popover-design.md`

## Problem

The Popover's speech-bubble arrow joins the panel to the trigger. For some
surfaces and layouts a *detached* indicator reads lighter and more modern —
the classic thinking-bubble dot floating between the panel and its trigger.
The user asked for a second, selectable indicator style to compare.

## Decisions (approved)

1. **Single dot** — not a decreasing trail. A trail is a follow-up extension.
2. **One prop, union type** — `arrow?: boolean | "bubble"`:
   - `true` (default) → the classic rotated-square arrow (unchanged).
   - `false` → no indicator (unchanged).
   - `"bubble"` → the detached dot.
   Normalised internally to `arrowMode: "arrow" | "bubble" | "none"`, so
   existing `true`/`false` call sites keep compiling and rendering.

## Geometry

- New constants: `BUBBLE_SIZE = 12` (diameter), `BUBBLE_OFFSET = 24`
  (trigger↔panel gap in bubble mode, vs `PLACEMENT_OFFSET = 8`),
  `BUBBLE_CLEARANCE = 6` (free space kept around the dot:
  12 + 2·6 = 24 = the offset).
- **The offset is part of the fit maths.** `resolveTooltipPlacement` receives
  `offset: arrowMode === "bubble" ? BUBBLE_OFFSET : PLACEMENT_OFFSET`, so
  flip/side decisions account for the extra room the bubble needs.
- **The dot is placed from the *actual* gap**, not the nominal one. (The
  shared geometry never clamps the pointing axis — it must stay adjacent to
  the trigger — so in practice the gap is always the offset; measuring it
  from the resolved rects keeps the dot correct if that ever changes.)
  Per side, with the resolved box rect and the trigger rect:
  - `gap` = distance between the trigger's facing edge and the box's facing
    edge (e.g. `box.top − trigger.bottom` for `bottom`).
  - `dotSize = clamp(gap − 2·BUBBLE_CLEARANCE, 4, BUBBLE_SIZE)` — defensive
    floor/ceiling; `BUBBLE_SIZE` in practice.
  - Centre: along the caret axis at the caret (same trigger-centre tracking
    as the arrow); across, at the gap midpoint.
  - Style per side (`bottom` shown; `top` mirrors, `left`/`right` swap axes):
    `{ left: caret − dotSize/2, top: −gap/2 − dotSize/2 }`.

## Rendering

- The dot is one `span` in the overlay, a sibling of the panel:
  `data-popover-bubble`, `rounded-full`, `border` (full 1 px ring — a
  detached circle, unlike the arrow's two-side V) + `chrome.border`
  (the tone/variant edge colour) + `chrome.fill` + `chrome.backdrop`,
  `z-20`, `pointer-events-none`. It wears the panel's own edge chrome, so a
  glass popover gets a frosted bead, tonal gets a tinted bead with a tone rim,
  etc.
- **No notch in bubble mode** — the dot never touches the panel edge, so the
  border/ring runs unbroken. The arrow + notch render only when
  `arrowMode === "arrow"`.
- The dot lives inside the overlay wrapper, so it enters/leaves with the
  panel's animation and inherits the `scale(0.93)` transform (harmless for a
  12 px dot).

## Tests

- `arrow="bubble"`: box sits at the 24 px offset (bottom: `top = trigger.bottom + 24`);
  dot present with `left = caret − 6`, `top = −18`, 12 px, `rounded-full`,
  variant's edge colour; **no** `[data-popover-notch]`, no `.rotate-45`.
- Caret tracking: narrow trigger + wide box (grow alignment moves the box
  off-centre) — the dot still sits on the trigger's centre (`left = 44`, not
  the box-centre position).
- Flip: trigger near the viewport bottom → `top` side, box at `trigger.top − 24 − height`,
  dot below the panel edge at `+gap/2 − half` (`top: 6px`).
- `arrow={false}`: neither arrow, dot, nor notch. Default (`true`): unchanged
  arrow (existing tests guard this).

## Out of scope

- Decreasing dot trail (follow-up).
- Per-instance dot size/offset overrides (YAGNI).
- Docs page copy beyond the playground control and prop docs.

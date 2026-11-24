# ActivityFeed — `subRowCorner` (the wash's corner, selectable)

Date: 2026-11-24
Status: approved (design proposed in chat, "lets add the option then")
Follows: actions zone (`f36902f5`), optical-line fix (`7bc9219b`), clip room (`12a20fa3`)

## Problem

The sub-row wash's corner is welded to a raw `rounded-md` in both kits —
the one piece of row chrome that never joined the corner scale. The feed
already exposes `corner` (card) and `rowCorner` (rows' Panels); subs have
nothing.

## Decision (user-approved)

A feed prop, `rowCorner`'s exact sibling grammar:

- `subRowCorner?: SurfaceCorner` — resolved through
  `getSurfaceCornerClass`, the same accessor the Panels ride.
- **Default `"rounded-sm"`** → the scale's 0.5rem step: the step nearest
  the current raw `rounded-md` (0.375rem), so the change is a hair rounder,
  not a new shape. Documented as `@default "rounded-sm"`.
  (`"auto"` resolves to the scale's container default like everywhere.)

## Design

- **React**: prop beside `rowCorner`; the sub wrapper's class list swaps
  `rounded-md` for `getSurfaceCornerClass(subRowCorner)` inside the
  existing `classNames(...)` composition.
- **Vue**: same prop in `withDefaults` (`subRowCorner: "rounded-sm"`);
  `rowView`'s `subRowClass` composition swaps the literal for the
  accessor.
- **Playground**: a "Sub-row corner" `SelectControl` with
  `panelCornerOptions` beside "Item corner"; state defaults `"rounded-sm"`,
  wired to the feed.
- **Docs**: `subRowCorner` joins the props sentence next to
  `rowVariant`/`rowTone`/`rowCorner`.

## Tests (both kits)

1. Default: the sub wrapper carries `rounded-lg` (what `"rounded-sm"`
   resolves to) — asserted via `getSurfaceCornerClass` so the test rides
   the scale, not a frozen class.
2. Override: `subRowCorner="rounded-xl"` puts `rounded-4xl` on the wrapper
   and drops the default token.

## Non-goals

No per-sub-item corner (subs disagreeing radii reads wrong), no per-row
override, no playground state for per-item fields.

# ActivityFeed — `subRowPadding` (+ `subRowCorner` default)

Date: 2026-11-24 (amended twice after user preview feedback)
Status: approved
Follows: `subRowCorner` (`c835656e`), clip room (`12a20fa3`)

## Problem

The sub-row wash rode welded `px-1.5 py-0.5` (plus its `-mx-1.5 -my-0.5`
bleed) and a fixed `gap-1.5 py-1.5` column — the last piece of sub-row
chrome with no knob. The feed's `padding` prop only talks to the card.

## Decisions (user-approved, post-preview)

- `subRowPadding?: SurfacePadding` — **`@default "md"`**. The `xs` rung is
  the old welded look (pixel-neutral for anyone who asks for it); the
  feed's resting default sits two rungs up — preview feedback pushed the
  washes roomier each round, settling where the padding finally reads as
  padding at a glance.
- `subRowCorner` — **`@default "rounded-sm"`**, the corner scale's sm step
  (0.5rem). History: first shipped on the xs step ("rounded", 0.125rem,
  the user's "rounded-xs"); after preview the washes moved up to sm, one
  rung above the rows — chrome nested inside a row reads better a step
  softer than its container.

## Design — the lockstep map

Wash padding is not free: bleed (`-mx`/`-my`), column `gap`, `py`, and
`pr` are mechanically tied — the clip-room arithmetic from `12a20fa3`
(button spills 4px past the 20px band; wash bleeds past the row box; the
region clips). One map encodes the invariants:

| step | wash (`row`: px/py = −mx/−my bleed) | column (`gap` + py + pr) |
|---|---|---|
| none | `px-0 py-0` | `gap-0.5 py-1 pr-0` |
| xs | `px-1.5 py-0.5` | `gap-1.5 py-1.5 pr-1.5` |
| sm | `px-2 py-1` | `gap-2.5 py-2 pr-2` |
| md ← default | `px-3 py-2` | `gap-4.5 py-3 pr-3` |
| lg | `px-4 py-3` | `gap-6.5 py-4 pr-4` |
| xl | `px-5 py-4` | `gap-8.5 py-5 pr-5` |

Invariants:

- bleed = padding — entries stay pinned at the column's leading edge, the
  wash bleeds into the gutter;
- column `py` = bleed + 4px — constant clearance under the region's clip
  line for the actions button's spill;
- column `pr` = bleed — **the right gutter**. Without it the right-side
  bleed is clipped flat by the region's `overflow-hidden`, the padding
  cancels itself, and content sits flush against the wash's clipped edge
  (the bug the user caught in preview: "not applied to the right");
- column `gap` = 2·bleed + 2px — constant 2px air between stacked washes
  instead of overlap.

Rung sizes: the first cut grew steps by only 2px of vertical padding —
indistinguishable rungs. Steps now roughly double: wash heights
20/24/28/36/44/52px (`none`…`xl`), so `md` over `xs` reads unmistakably.

The map lives in `common/theme/nestedPanel.ts` beside the wash ladder:
`SUB_ROW_PADDING: Record<SurfacePadding, { row: string; column: string }>`
— static classes, framework-free, both kits + tests read the same table.

## Design — threading

- **React**: `subRowPadding` on `ActivityFeedProps` → feed destructure →
  `FeedRow` prop → `subRowClass` composition swaps the welded literals for
  `SUB_ROW_PADDING[p].row`; the column div takes `SUB_ROW_PADDING[p].column`
  beside its fixed `flex flex-col pl-5`.
- **Vue**: prop + `withDefaults`; `rowView` builds `subRowClass` from the
  map and a `subColumnClass` string; `ActivityFeedRow.vue` binds
  `:class="view.subColumnClass"` on the column div.
- **Defaults**: React destructure + Vue `withDefaults` + playground state
  all at `subRowCorner: "rounded-sm"`, `subRowPadding: "md"`.

## Playground / docs

- "Sub-row padding" `SelectControl` (`panelPaddingOptions`) under
  "Sub-row corner"; `subRowPadding={subPadding}` on the feed.
- Docs clause: `subRowPadding` beside the `subRowCorner` mention with
  both sm defaults named.

## Tests (both kits)

1. Default padding: wrapper carries `SUB_ROW_PADDING.md.row` tokens,
   column carries `SUB_ROW_PADDING.md.column` — asserted through the map.
2. Override `"lg"`: wrapper + column carry the `lg` tokens; the `md`
   tokens (`-mx-3`, `gap-4.5`) absent.
Corner assertions ride `getSurfaceCornerClass("rounded-sm")`.

## Non-goals

No per-sub-item padding, no asymmetric (x vs y) steps, no scale edits.

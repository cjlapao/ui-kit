# NetworkGraph controls corner & legend scroll zone — design

Date: 2026-11-19. Follow-up to the same component's inspector/hover/
full-size/skeleton/empty-state/auto-reveal specs.

## Problem

The zoom-control pill sat `absolute bottom-3 right-3` inside the graph
box, so with the legend docked right it rendered to the LEFT of the
legend column instead of the component's true bottom-right corner. The
legend column also grew with its content, with no scroll affordance.

## Design

When the legend is visible AND docked right (`legendVisible &&
legendOnRight`):

- The controls overlay is hoisted from `__graph-box` to a direct child
  of the (now `relative`) `__layout` row — `bottom-3 right-3 z-10`
  against the whole layout, i.e. the true bottom-right corner past the
  legend.
- The legend column leaves the flow: `__graph-box` keeps its width via
  `marginRight: legendWidth + 16` (the 16px flex gap the removed flow
  sibling used to consume), and the legend renders as
  `__legend-absolute` — `absolute right-0 top-0` with
  `bottom: 56px` — a reserved zone of controls height + bottom margin.
- Inside the wrapper the legend content (plain rows or the `legendPanel`
  Panel) renders through `ScrollArea` (`horizontal={false}`,
  `className="cj-network-graph__legend-scroll h-full"`), so a long
  community list stops above the controls zone and scrolls.

Everything else is untouched: bottom legend placement keeps the flow
column and box-corner controls; no legend (or empty graph) renders the
controls inside the box exactly as before; the skeleton keeps its
mirrored flow layout.

Rejected: overlaying the legend over the canvas (it deliberately
displaces the graph), CSS `bottom` guesses for control height (a static
56px matches pill+margin with headroom).

## Verification

Four jsdom tests: controls are a direct layout child (not in the box)
when docked right; `__legend-absolute` pins `bottom:56px`, width
192/224, contains the legend content inside the ScrollArea root and the
box carries the `marginRight` push (208/240); bottom placement and
legend-less renders keep box-corner controls and no absolute wrapper.
Full suite green (71 incl. styles contract and i18n parity);
tsc/eslint/demo-tsc clean.

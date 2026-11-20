# NetworkGraph loading skeleton — design

Date: 2026-11-19. Follow-up to the inspector/hover/full-size specs for
the same component.

## Problem

While `loading`, the graph card showed Panel's generic `PanelSkeleton`
(three shimmer bars) inside an otherwise empty tall card. The placeholder
should instead preview the settled component: search bar, canvas surface
with the zoom pill, the community legend column and the caption lines.

## Design

**Chosen approach** — `NetworkGraph` renders its own layout-shaped
skeleton (`GraphSkeleton`, local to NetworkGraph.tsx) as the Panel's
children when `loading`, and stops forwarding `loading` to `Panel` so
`PanelSkeleton` never takes over. Rejected: customizing the shared
`PanelSkeleton` (affects every Panel consumer) and a spinner overlay
(repsresents nothing).

Interaction safety is unchanged: the canvas, combobox and legend are all
gated by `locked` (`disabled || loading`) anyway, and `Panel` keeps
`disabled` for the dimming overlay. Accessibility: the group carries
`aria-busy={loading}` and a single `role="status"` sr-only paragraph
announces `kit.networkGraph.loading` (new key in all five curated
catalogs — parity is test-enforced; the dead-key test passes because the
key is referenced).

**Skeleton layout** — built from the kit's `SkeletonBar` (named export of
Panel.tsx): search bar `h-9 rounded-lg`; canvas block reusing the real
`__layout`/`__graph-box` classes (so `fullHeight` stretches it identically
and the `height` prop governs otherwise) with a plain rounded-md surface
and a bottom-right zoom pill of five small bars matching the controls
cluster; legend column (only when `showCommunities` and groups exist,
right/bottom per `legendPosition`, real widths 192/224) with a heading bar
plus `min(groups + 1, 7)` rows of checkbox-square + label + count bars;
two caption bars (72% / 28%). Everything placeholder is `aria-hidden`.

**Non-goals (YAGNI)**: no skeleton for the closed inspector aside, no
shimmer customization, no `loaderType` surfacing.

## Verification

Three jsdom tests (layout markers + row count + sr-only announcement,
legend follows `showCommunities`, skeleton gives way to the real graph).
The existing "canvas absent while loading" test still passes because the
skeleton contains no `role="application"`. Suite: 141/142 (the one
failure is the pre-existing `kit.traceGraph.*` dead-keys one); tsc/eslint
clean.

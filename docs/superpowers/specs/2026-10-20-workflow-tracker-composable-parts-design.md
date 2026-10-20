# Design: WorkflowTracker as composite + separately consumable parts

**Date:** 2026-10-20
**Status:** Approved by user (design presented, answered "Approved — write the spec")
**Follows:** `2026-10-20-workflow-tracker-details-panel-design.md`,
`2026-10-20-workflow-tracker-quick-actions-design.md`

## Background

Apps want pieces of the tracker in different places — the rail alone in a
sidebar, the step details in a run view, the scrollable details body in
another column — without re-deriving progress, tallies, the active step or the
token objects. The all-in-one `<WorkflowTracker>` must keep its exact API.

Precedent in the kit: `ConnectionFlow` ships a composite plus separately
exported parts (`ConnectionFlowHeader`, `ConnectionFlowNodeBody`) from one
folder with per-part tests.

## Decisions (user-confirmed)

- **Scope:** three consumables — the rail ("the main"), the step details card,
  and the details body card (already built as `WorkflowDetailsCard`, just
  needs a consumer-level wrapper + export). Roll-up cards and the page header
  stay exclusive to the composite.
- **Props:** every part takes the same `data` object plus the styling props
  that apply to it and `labels` overrides, and derives everything itself
  (progress, tallies, active step + fallback). Parts render their own `Panel`,
  so standalone use is pixel-identical to the all-in-one. Parts are stateless
  — the parent owns `activeStepId`, exactly as the composite does today.
  (Rejected: low-level resolved props — consumers would wire derivations
  themselves; escape-hatch overrides — premature.)

## Changes

### 1. Shared plumbing — `chrome.ts` (new)

- `DEFAULT_LABELS` moves out of `WorkflowTracker.tsx` and is exported here.
- `useWorkflowChrome({accentColor?, attentionColor?, blockedColor?,
  mutedColor?, variant?, translucentSurfaces?})` → `{palette, surfaces}` —
  the memoized derivation the composite does today, defaults included.
- `resolveLabels(overrides)` → full `WorkflowTrackerLabels`.
- `buildCardProps({variant, cardTone, corner, glassOpacity, vibrancy,
  specularMode, padding})` → the shared `cardProps` object.

### 2. Public parts (new files, consumer-level)

| Component | Renders | Callbacks |
| --- | --- | --- |
| `WorkflowTrackerRail` | Panel + progress header + timeline + legend | `onStepSelect`, `onSubStepSelect` (nested rows), `onStepAction` |
| `WorkflowTrackerStepDetails` | Panel + active-step card (header, meta, sub-steps, quick actions) | `onSubStepSelect`, `onStepAction` |
| `WorkflowTrackerDetails` | Panel + `ScrollArea` body card | none |

Shared props across all three: `data` (defaults to `sampleWorkflow`),
`labels`, colors, card props (`variant`, `cardTone`, `corner`,
`glassOpacity`, `vibrancy`, `specularMode`, `padding`,
`translucentSurfaces`), `className`/`style`. Rail adds `loading`,
`loadingRows`, `showLegend`, `emptyState`; step details adds `loading`;
details is `null` when the resolved active step has no non-empty `details`
(same rule as the composite).

Advanced composite pass-throughs (documented, not for daily use):
`cardClassName` (the grid-related classes the composite adds — sticky rail,
fill-mode stretch) and `cardScrollable` (rail body scroll in fill mode).

Internals (`WorkflowTimeline`, `WorkflowDetailPanel`, `WorkflowDetailsCard`,
`WorkflowQuickActions`, `parts.tsx`) stay unexported implementation.

### 3. The composite becomes a layout of the parts

`WorkflowTracker.tsx` keeps every current prop (`railWidth`, `fillHeight`,
`fillHeightOffset`, `stickyRail`, header, roll-ups, loading…) and is
refactored to render the three parts inside its grid instead of hand-wrapping
`Panel` around internals, passing `cardClassName`/`cardScrollable` for the
fill/sticky mechanics. One implementation, no drift: the existing 49-test
composite suite is the regression guard — composite markup must not change.

### 4. Exports, demo, tests

- `WorkflowTracker/index.ts` + the kit barrel export the three parts and
  their prop types. Nothing removed.
- Demo: new "Composable parts" example — rail in a narrow left card,
  `WorkflowTrackerStepDetails` top-right, `WorkflowTrackerDetails` in a
  separate right area; one `activeStepId` in parent state drives all three.
- New `WorkflowTrackerParts.test.tsx`: rail standalone (progress %, legend,
  row clicks, rail quick actions); step details standalone (active fallback,
  sub-step summary, card quick actions); details standalone (region name,
  absent without content); each part ignores callbacks it doesn't own.

## Non-goals

- Roll-up cards, page header, `fillHeight`/`railWidth`/`stickyRail` on the
  parts (composite-level layout).
- Context/compound pattern — parts mount in independent places, so explicit
  props + parent-owned state win over shared context.
- Vue port (no tracker there yet).

# Design: WorkflowTrackerRollups — the roll-up grid as a fourth part

**Date:** 2026-10-20
**Status:** Approved by user ("Yes — fourth part")
**Amends:** `2026-10-20-workflow-tracker-composable-parts-design.md` — its
"roll-ups stay composite-only" non-goal is superseded. The composite's grid/
header mechanics (`fillHeight`, `railWidth`, `stickyRail`, page header) stay
composite-only; the roll-up **cards** join the parts.

## Background

The composable-parts story let apps re-assemble rail, step card and details
body anywhere — but the "Needs attention" / "Skipped steps" roll-ups stayed
trapped inside `<WorkflowTracker>`, and `WorkflowSummaryCard` is internal. A
split-view app had no way to show the attention panel except hand-rolling an
imitation, which the design language forbids in spirit. This closes the gap
the same way the details card was made consumable.

## Changes

### New part — `WorkflowTrackerRollups.tsx`

- Props: `data` (defaults to `sampleWorkflow`), `loading`, `labels`, the shared
  `WorkflowTrackerStyleProps`, plus `className`/`style` on the grid wrapper.
- Derives `getAttentionSteps`/`getSkippedSteps` from `data` and renders
  **exactly** the composite's block: `grid grid-cols-1 gap-5 @xl:grid-cols-2`,
  each non-empty list in its own `Panel` (`buildCardProps`) wrapping the
  internal `WorkflowSummaryCard` titled from `labels.needsAttention` /
  `labels.skippedSteps`.
- Same mount rule as the composite: `null` while `loading` or when both lists
  are empty.
- Stateless; static rows (roll-ups were never interactive).

### Composite refactor

`WorkflowTracker.tsx` replaces its hand-rolled roll-up block with
`<WorkflowTrackerRollups {...styleProps} data loading labels/>`; its local
`attentionSteps`/`skippedSteps` memos and the now-unused `Panel` /
`buildCardProps` / roll-up imports leave. The 49-test composite suite (which
covers roll-up rendering) is the pixel-parity guard.

### Exports, demo, tests, docs

- Folder `index.ts`: `WorkflowTrackerRollups` + `WorkflowTrackerRollupsProps`
  (barrel propagates automatically).
- Demo `ComposableParts.tsx` gains `<WorkflowTrackerRollups data={data} />`
  under the stacked cards — the split view now shows the attention panel.
- `WorkflowTrackerParts.test.tsx`: new describe — renders attention+skipped
  cards with titles/nodes from `data`, nothing while loading or when no step
  qualifies, labels overrides retarget the titles.
- Agent prompt
  (`docs/agent-prompts/2026-10-20-workflow-tracker-integration-prompt.md`):
  `WorkflowTrackerRollups` joins the imports and the split-view example; the
  "build your own card from `getAttentionSteps`" note is replaced by the part.

## Non-goals

- Making roll-up rows clickable (never interactive).
- `showLegend`-style toggles or per-card visibility props — presence follows
  the derived lists, like the composite.

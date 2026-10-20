# Design: WorkflowTracker quick-action buttons for gate-type steps

**Date:** 2026-10-20
**Status:** Approved by user (design presented, answered "Approved — write the spec")
**Follows:** `2026-10-20-workflow-tracker-details-panel-design.md`

## Background

Some steps — typically `attention` or `blocked` — are really human gates: the
run waits for somebody to approve, decline or nudge. Consumers need quick
action buttons on the rail steps ("first panel") and also somewhere in the
step detail card, without breaking the tracker's quiet design language.

## Decisions (user-confirmed)

- **API:** data model + one callback — steps carry `actions`, the tracker
  renders them with the kit's `Button`, and one `onStepAction(stepId,
  actionId)` fires. (Rejected: render-prop slot — every consumer restyles
  and the kit can't guarantee the design language; "both" — extra surface.)
- **Visibility:** render wherever the step appears whenever `actions` is
  non-empty — no status filtering, no hover trickery — but only when
  `onStepAction` is supplied (the tracker's standing read-only rule; dead
  buttons never render).
- **Visual weight:** uniform quiet `Button size="xs" variant="soft"`,
  `color = action.tone ?? accentColor`; per-action `variant` as the escape
  hatch. No solid blocks in the rail, no second button system.
- **Placement:** rail — a wrapping row under the step's meta line, indented
  to the label edge, rendered as siblings *outside* the row's `<button>`
  (no nested buttons; the label stays the step's click target). Detail
  card — right cluster of the header, joining `Elapsed` with the same gap.

## Changes

### 1. Types (`types.ts`)

- `WorkflowAction` — exported: `{ id: string; label: React.ReactNode;
  tone?: TrueColor; variant?: ButtonVariant; leadingIcon?: string |
  ReactElement; disabled?: boolean }`.
- `WorkflowStep.actions?: WorkflowAction[]`.
- `WorkflowTrackerProps.onStepAction?: (stepId: string, actionId: string)
  => void`.
- `WorkflowTrackerLabels.quickActions: string` (default `"Quick actions"`) —
  accessible name of the `role="group"` wrapper.

### 2. New shared piece `WorkflowQuickActions.tsx`

Both surfaces render through it so they cannot drift:

- `flex flex-wrap gap-1.5` group, `role="group"`, `aria-label={
  labels.quickActions}`; renders `null` without the callback or with an
  empty list.
- Each action: kit `Button size="xs" weight="medium"
  variant={action.variant ?? "soft"} color={action.tone ?? palette.accent}
  disabled leadingIcon onClick={() => onAction(stepId, action.id)}`.
  Nothing else — all chrome comes from `Button` + the palette.

### 3. Placement wiring

- `WorkflowTimeline` step `<li>`: `{row}` then
  `<WorkflowQuickActions className="mt-2" style marginLeft NESTED_INDENT>`
  (sibling of the row button, before the nested sub-steps box).
- `WorkflowDetailPanel` header right cluster:
  `<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
  {elapsed}{actions}</div>` — Elapsed keeps its seat.
- `WorkflowTracker` forwards `onStepAction` into both children; nothing
  changes in the details card from the previous feature.

### 4. Edge cases

- No `onStepAction` → zero action buttons anywhere (fixture actions stay
  invisible while the tracker is read-only).
- `actions` absent or `[]` → no wrapper element at all.
- Overflow of actions wraps in both surfaces; `xs` keeps rail rows compact.
- Loading skeletons unchanged.

### 5. Demo & tests

- `sampleWorkflow`: `insurance_certificates` gets Review + Remind vendor;
  `legal_review` gets Nudge Legal — visible when the playground's
  Interactive toggle supplies the callbacks; the playground logs the last
  action like the other callbacks.
- `DetailsCard.tsx` example: Approve/Decline on the gate step in
  emerald/rose tones.
- Tests: actions render only with the callback (rail + card); click
  forwards `(stepId, actionId)`; an action button is never a descendant of
  the row button (nesting guard); default tone is the accent; empty list
  renders nothing. Full suite + lint green.

## Non-goals

- Built-in gate vocabulary (approve/decline enums), per-action pending
  state, icon-only overflow menu.

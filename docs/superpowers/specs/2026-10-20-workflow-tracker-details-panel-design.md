# Design: WorkflowTracker scrollable step-details card

**Date:** 2026-10-20
**Status:** Approved by user (design sections presented, answered "Approved — write the spec")

## Background

Consumers of `WorkflowTracker` (e.g. the workflow-runner app) currently render
their own "STEP DETAILS" block — status/cost/time fields, "Artifacts and
changes" chips — as a separate section *outside* the tracker, below both
columns. The request: let the tracker own that block. A free-form detail card
should sit below the current sub-step display (the step card in the right
column), mount only when the active step carries content, and use the kit's
`ScrollArea` for scrolling so the page itself never grows.

## Decisions (user-confirmed)

- **Content source:** free-form slot per step — the caller passes a
  `ReactNode`; the tracker only frames it in a card with a scroll area. No
  built-in structured fields (metrics/artifacts), no built-in header — the
  caller's node keeps its own markup (its "STEP DETAILS · SURVEY" heading and
  "Open full step →" link live inside the node).
- **Placement:** a separate card in the right column, directly under the step
  card (where the attention/skipped roll-ups already stack).
- **Sizing:** "fill remaining viewport". The right column becomes a
  viewport-height flex layout and the detail card stretches into the leftover
  space, scrolling internally; the page never scrolls.
- **Trigger:** the card mounts only when the resolved active step has a
  non-empty `details` node. No empty shell, no placeholder, no collapse
  toggle.
- **Mechanism (Approach 1 of 3):** pure-CSS `dvh` mode via props — no
  ResizeObserver. (Rejected: caller-sized container — pushes the guarantee to
  every consumer; JS measurement — machinery disproportionate to a
  presentational component.)

## Changes

### 1. Types (`types.ts`)

- `WorkflowStep.details?: React.ReactNode` — free-form content for the
  details card, shown while this step is the active one.
- `WorkflowTrackerProps.fillHeight?: boolean` (default `false`) — enables the
  viewport-fill layout. Default off; no existing consumer's layout changes.
- `WorkflowTrackerProps.fillHeightOffset?: number | string` (default `0`) —
  height reserved above the tracker (page header etc.) in the
  `calc(100dvh − offset)`; numbers become `px`.
- `WorkflowTrackerLabels.details: string` (default `"Step details"`) — not
  visible text; the accessible name of the scrollable region.

### 2. New component `WorkflowDetailsCard.tsx`

`Panel` (shared `cardProps` + `flexBody`, `flex-1`) wrapping
`<ScrollArea className="h-full" mask role="region" aria-label={labels.details}>`
around `step.details`. The height chain resolves because `Panel`'s section is
already `flex min-h-0` and `ScrollArea`'s viewport inherits the resolved
height; `overflow-hidden` on the frame zeroes the automatic minimum size so
the card can shrink below content height.

### 3. Layout (`WorkflowTracker.tsx`)

When `fillHeight` (and only from the `@4xl` two-column breakpoint up):

- Grid gets `height: calc(100dvh − var(--wt-fill-offset))`; the custom
  property is set on the root beside `--wt-rail-width`. Below `@4xl` the
  height drops away — stacked mobile behaves like today and the page scrolls
  normally.
- Rail `Panel` becomes `@4xl:self-stretch @4xl:min-h-0` and `scrollable`
  (its existing thin-scrollbar body) so a long rail scrolls inside its card
  instead of pushing the page. `stickyRail` is redundant in fill mode and is
  suppressed there (the rail no longer shares page scroll).
- Right column gets `@4xl:self-stretch @4xl:min-h-0`; step card and roll-ups
  stay `shrink-0`, the details card is `flex-1` between them.

### 4. Edge cases

- No `details` / `null` / `""` on the active step, no active step, or
  `loading` → card not mounted (same hiding rule as the roll-up cards).
- `fillHeight` off → card renders at content height in normal flow;
  `ScrollArea` is inert when nothing overflows.
- `fillHeight` on with no details card → grid height still fixed, column
  content top-aligns; no empty shell.
- See-through `Panel` variants: the card uses the same `cardProps` as its
  siblings, so translucency/surface tokens apply automatically.

### 5. Demo, docs, tests

- `sampleWorkflow`: `details` nodes on the active step and one roll-up step
  (mock status/cost/artifact-chip block in kit style) so the feature is
  visible in the demo without app code.
- Playground: `fillHeight` toggle + `fillHeightOffset` control following the
  existing `ControlAccordion` pattern; prop-table entries on the kit-docs page.
- `WorkflowTracker.test.tsx`: card mounts with `details`, hidden without /
  while loading; `fillHeight` puts the `100dvh` calc and the custom property
  on the grid; the scroll region carries the accessible name; default
  rendering untouched (fill off). Full test + lint suite green.

## Non-goals

- Structured detail fields (metrics/artifacts) — free-form slot only.
- Sticky headers or collapse toggles inside the details card.
- A Vue port (the Vue kit has no `WorkflowTracker` yet).

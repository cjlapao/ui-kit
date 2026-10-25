# Collapsible standalone workflow rail

Design approved in chat on 2026-10-24.

Add opt-in `collapsible`, `collapsed`, `defaultCollapsed`, and
`onCollapsedChange` to WorkflowTrackerRail. Internal state is used unless
`collapsed` is supplied. With `collapsible=false`, render the existing expanded
rail regardless of collapse state. The parent continues to own activeStepId.

The compact rail is 56px wide with a top chevron control and connected status
nodes. Labels, progress, legend, nested sub-steps and quick actions are hidden;
step selection, accessible names and active-step indication remain available.
The expanded width defaults to 360px when collapsible and can be overridden
with style.width. Width and label opacity animate for 200ms, with reduced-motion
support. Existing theme and status tokens apply in both states.

`fillHeight` fills a parent with a defined height, in both states. Timeline
content scrolls internally; the toggle remains visible. It does not infer a
viewport offset. Existing non-collapsible defaults and composite layout stay
compatible. Toggle labels can be overridden on the rail.

Implementation: extend the rail state and layout, adapt the shared timeline
and loading state, add a standalone interactive demo, then run focused tracker
tests and TypeScript/lint checks. Cover controlled and uncontrolled operation,
opt-in gating, collapsed row selection, hidden actions, loading/empty states,
and fill-height layout. No new dependency is needed.

## Follow-up requested in chat

The compact toggle is centered and uses an xs IconButton with the shared
SURFACE_TO_BUTTON_VARIANT mapping and the panel tone. Expanded, it sits to the
right of the progress header. The selected compact step keeps its original circular status node inside a
rounded neutral-200 background (neutral-700 in dark mode), with an accent edge
marker; keyboard focus styling remains separate from selection.

`renderStepPopover(step)` supplies optional React content for collapsed steps.
`stepPopoverProps` overrides placement, variant, tone, corner, padding, maxWidth,
arrow, and className. Without content the compact node retains its tooltip.
The existing Popover gains opt-in `triggerMode="hover"`: pointer and focus open
it, a short leave delay allows crossing into the popup, and Escape dismisses it.
Moving the pointer out must not steal focus. Expanded rails do not invoke the
render callback or keep a popup mounted. A consumer-supplied action is shown in
the demo; selecting a step dismisses its popup without immediately reopening on retained
focus. Hovering the step again opens a fresh preview.

## Consumer controls and compact progress

`renderControls({ collapsed })` adds consumer-owned content immediately below
the workflow steps, before the legend, in the same scroll area. The callback
receives the effective collapsed state, including uncontrolled state and the
`collapsible=false` override. Consumers render a component that chooses its
compact/expanded layout; keeping that component type stable preserves its local
state across toggles. The rail owns spacing and a section divider, while the
consumer owns labels, controls, data, and actions. Controls remain usable when
the timeline is loading or empty. The exported context type is
`WorkflowTrackerRailControlsContext`.

A compact progress badge sits below the expand toggle, above the scrolling
steps. It uses the existing derived percentage, localized progress label, and
accent tokens. It includes progressbar semantics and handles 0–100%; it is
omitted while loading or when no steps are available. The agents demo renders
avatar buttons when collapsed and full rows plus a footprint chart expanded.

## Scroll area integration

The timeline and consumer controls share the kit ScrollArea with
`variant="hover"`. Native Panel scrolling is disabled; both standalone
`fillHeight` and the composite's `cardScrollable` use the internal scroll area.
Progress, the toggle, and the legend remain outside that area. The details card
and the standalone demo's details column also use hover-only ScrollArea bars.

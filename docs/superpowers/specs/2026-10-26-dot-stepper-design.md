# DotStepper

A compact horizontal step indicator for table rows, using the kit's shared
control sizes, surfaces, colours, padding, corners, TooltipWrapper and Popover.
It is a separate component from CondensedStepper: no labels, connectors or
expanding flanks occupy the row.

## Window and status

`steps` uses the existing `StepperStep[]` type. `currentStepId` takes precedence
over zero-based `currentIndex`; otherwise resolve the explicit active step or
the first unfinished step. An empty array renders no dots. All completed steps
render completed, with no pulse or active popover. Explicit step statuses win;
otherwise steps before the current step are completed and later steps pending.
Errors use the kit's error colour and never pulse.

`maxVisible` defaults to 5 and counts actual steps only, as approved by the user.
Normalize non-finite limits to the default and clamp finite limits to at least 1.
Use a contiguous window centred on the current step, clamped to the array edges.
For an even window, favour one extra upcoming step. With 10 steps and a limit
of 5, active step 2 shows steps 1–5; active step 5 shows steps 3–7.

Hidden steps add a pair of smaller overlapping dots outside either end of the
window. They carry accessible hidden-step counts and a tooltip, and do not
change selection. They use completed colour when all represented steps are
complete, error colour if any hidden step has failed, otherwise pending colour.
The active step is always a full dot inside the window.

## Appearance and API

Expose `size` (xs through xl, default sm), `variant`, `tone`, `padding`, `corner`, and the
shared glass surface options. Default to a quiet pill surface with compact
padding (none by default), full corners and blue tone. Default surface is tonal.
Padding uses the shared compact surface scale, at half the Panel inset: xs
4/6px, sm 8/10px, md 12/16px, lg 16/20px, xl 20/24px at base/sm breakpoints.
The shared helper is available for other small components to opt into.
Default completed colour is emerald and
pending colour is a light neutral in each theme. `doneColor`, `nextColor` and
`errorColor` override status colours; `tone` colours the active dot.
Dot geometry stays circular and does not shift when selected or pulsing.

`animated` defaults to true. Only the active step pulses, with a centred halo
visible in both themes; reduced motion disables the animation. The component
does not auto-advance or mutate consumer progress.

## Interactions

Use TooltipWrapper directly around each step trigger, so there is one keyboard
focus stop per step. The tooltip shows the step's title. Allow a string tooltip
override for titles rendered as React nodes. Each trigger has an accessible name
including its position and status, and the active trigger has `aria-current`.

`renderActiveContent(step, index)` supplies optional content for the existing
Popover, anchored to the active dot. Expose popover configuration through a
typed prop excluding trigger, children and visible (managed internally). Clicking/Enter opens it; Escape and
outside click use existing Popover behavior. Progress changes close stale
content and associate any new popup with the new active step. Other steps only
notify `onStepSelect` when provided. `disabled` blocks interaction.

## Demo and validation

Add a dedicated docs page using the shared PlaygroundPanel and ControlAccordion.
Include total/current/max controls, size, surface, padding, corners, status
colours, animation, disabled state and optional active popover. Include examples
inside real table rows, a short flow, overflowing flows and an all-done flow.
Document exports, defaults and zero-based indices.

Test the pure window planner at start, middle and end, odd/even and tiny limits,
empty input and all-done flows. Test tooltips, popover keyboard behavior, colour
overrides, disabled state and active-only animation. Verify light/dark visuals,
all size tokens, pulse alignment and overflow in a table row. Run focused tests,
library type checking, lint and build; report unrelated demo diagnostics separately.

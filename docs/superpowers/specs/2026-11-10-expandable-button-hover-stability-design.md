# ExpandableButton hover stability

## Approved design

Prevent hover flicker when ExpandableButton expansion changes layout and moves the rounded button away from the pointer. Add a rectangular hover area covering the button's current bounds, including its rounded corners. Expand immediately on entry; collapse after the pointer has remained outside for 500 milliseconds. Returning before that deadline cancels collapse.

## API and behavior

Add `collapseDelay?: number`, defaulting to 500 milliseconds. A value of zero requests immediate collapse. The delay applies only to hover-driven expansion. Preserve controlled `expanded`, click, always, focus-only, loading and disabled behavior. For hover+focus, maintain expansion while either the hover grace period or focus remains active. Preserve keyboard focus-visible and touch focus behavior in hover mode.

Keep the visual button rounded. Implement the rectangular hit area without adding permanent reserved width or intercepting neighboring controls outside the button's rectangular bounds. The hit area follows the animated button dimensions. The 500-millisecond grace period allows the user to reach a button that moves after expansion; it does not guarantee the pointer remains over a button that has moved arbitrarily far.

Use explicit hover state to keep the visual expansion and `onExpandedChange` notifications consistent with delayed collapse. Report one effective transition per expansion or collapse. Forward consumer mouse/focus handlers normally. Preserve the forwarded button ref, native click behavior, styling hooks and tooltip integration.

## Lifecycle and accessibility

Cancel a pending collapse when the pointer re-enters. Clear timers on unmount, disable/loading transitions, and changes to expansion ownership or trigger mode. Ignore stale timer callbacks. Controlled expansion remains owned by the caller. Keyboard interaction must remain usable without pointer hover.

## Scope and validation

The current component exists in React; no new Vue component is included. Update React component documentation and playground with collapseDelay. Preserve existing comments, updating explanations that explicitly describe the superseded pure-CSS hover implementation.

Add meaningful tests for immediate opening, delayed collapse, re-entry cancellation, hover+focus interaction, controlled expansion, disabled/loading transitions, trigger changes and cleanup. Run existing ExpandableButton tests, relevant type/lint checks, and a browser reproduction using a constrained layout where expansion moves or wraps the button. Check that rounded corners belong to the rectangular hover area and neighboring controls remain reachable.

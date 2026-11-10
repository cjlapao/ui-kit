# ContentActions layout

## Approved design

Add a small, visually neutral ContentActions component to React and Vue. It places arbitrary content beside an action group. Growing actions take space from the content instead of wrapping below it. This supports ExpandableButton and other controls without coupling the layout to their implementation.

## Public API

React accepts `children` for content and `actions` for the action region. Vue uses its default slot for content and an `actions` slot for actions. Both expose `gap` using the shared control size scale (default md), `align` (`start`, `center`, or `end`, default start), and class overrides for the root, content and actions regions. Forward ordinary root div attributes, including style and accessible labels. Export the component and its props through the normal component barrels.

## Layout and overflow

Render a non-wrapping horizontal flex row with no background, border, radius, padding, shadow or toolbar role. The content region fills remaining space with `flex: 1` and `min-width: 0`. Actions use their intrinsic width and remain in a single horizontal row. Direct action children do not shrink.

As actions expand, the content region becomes narrower. Consumers choose how nested content handles that width: ordinary text can wrap; titles may use truncation classes. The component must not silently hide arbitrary content or apply ellipsis to every child.

When actions alone exceed available width, their region shrinks and scrolls horizontally rather than wrapping, overlapping content, or widening the page. The component adapts to the width of its parent; it has no fixed breakpoint and does not move actions to another row. The action region must remain keyboard accessible and allow focus to reveal clipped controls. Reuse existing ScrollArea where it preserves these sizing and native focus-scrolling requirements.

If actions are absent, omit their region and gap so content gets the full width. Preserve DOM order: content, then actions. Do not clone or inject props into consumer elements. ExpandableButton remains unchanged.

## Documentation and validation

Add a documentation page and navigation entry following the existing layout component patterns. Include a bounded, resizable example with a title, description, and expandable actions; explain min-width requirements, content truncation, and horizontal action overflow.

Test slot/prop rendering, root attributes, alignment and gap choices, missing actions, and action semantics in both frameworks. Verify real browser layout at ordinary and narrow widths: hover expansion keeps actions on the same row, reduces content width, and preserves access to oversized actions. Run focused tests, relevant type/lint checks, and package builds as needed to verify public exports.

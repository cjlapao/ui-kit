# Page body layout

Approved arrangement: header above a body with full-height left/right zones, a centre, and a bottom zone beneath only the centre.

**The layout is zones only.** `left`, `right` and `bottom` are plain nodes. The layout holds no state: no collapse, no sizes, no toggles, no resize handles. Each zone is a `shrink-0` flex item sized by its content; the centre is `flex-1` and takes the rest. Left/right zones stretch content to the body's height, the bottom zone to the centre's width. `false`/`null` omit a zone. A `gap` (default 8px) separates zones as cards.

Controls own their behaviour. `WorkflowTrackerRail` collapses and animates its own width. `SidePanel` with `docked` sits in flow at its own `width` (or `height` for `side="bottom"`, docked-only), animates its own collapse, and renders its own resize handle on the edge facing the content. A docked bottom panel folds to its measured header height and expands upward.

The layout uses the shared Panel surface variants. Consumers give it a bounded height; centre and zones scroll independently. The row is floored at `min-width: fit-content` so the centre's minimum width makes a tight container scroll rather than overlap a zone.

PageHeader gains the shared surface family, tone and glass options using Panel for surface rendering.

A documentation page demonstrates a collapsible workflow rail, centre activity, a resizable docked Files SidePanel and a resizable bottom-docked Terminal SidePanel, with shared variant selection.

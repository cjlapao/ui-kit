# ConnectionFlow edit mode (React)

Approved direction. Existing layout, routing, spacing and viewport behavior remain the foundation.

## Interaction

`editMode` defaults to false. When enabled, the inner 10% band at each card edge reveals a ghost terminal at the nearest side. Corners choose the nearest border, with a small hysteresis when dragging so tiny pointer movements do not alternate sides. Disabled cards and interactive controls do not initiate creation.

Pressing anywhere in that side band (or on the terminal) starts a pointer drag with a stable, unique ghost ID. A dashed, tinted card outline previews the new node's drop slot; a ghost line connects it to its source. The line uses the current edge style and tone. SmartGridLayout supplies the visual precedent: a dashed border and subdued tone tint.

As the pointer moves around the source card, the source terminal switches to the appropriate top, right, bottom or left side. Top and bottom drops use vertical slots; left and right drops use horizontal slots. Slots account for the current cards, connector exits and lane spacing. If a slot is obstructed, the preview moves outward to the nearest clear slot. The preview never covers an existing card.

The first version creates new neighbouring nodes; it does not reconnect existing nodes or move existing cards. Snapshot hit geometry at drag start, as SmartGridLayout does, and convert pointer coordinates through the existing zoom and scroll transforms. Changes to the real graph during a drag cancel the stale preview.

Pointer release on a valid slot emits one creation request. Release back inside the source, Escape, pointer cancellation, loss of capture, disabling edit mode, source removal, or unmount cancels without emitting. Ignore the click following a completed drag. Pan from the background and the existing modifier-wheel zoom remain available.

## API recommendation

```ts
editMode?: boolean;
onNodeCreate?: (
  ghostId: string,
  placement: { sourceId: string; side: "top" | "right" | "bottom" | "left" },
) => void;
```

The ghost ID is the first argument so consumers opening a panel or modal can handle just the ID. The placement argument lets applications persist the requested relationship without reading private layout state. The user approved the ID-first callback with placement context.

Approved lifecycle: keep the dropped placeholder visible until the application supplies a real node with that ID, or dismisses it. A handle method `dismissGhost(id)` supports canceling the application's modal. The application owns the real nodes and their topology; the component does not mutate the supplied node arrays. The user approved retaining placeholders until resolved.

## Implementation boundaries

A React edit overlay owns hover, drag and pending placeholders. Its interaction targets are active only in edit mode; unresolved placeholders remain visible when editing is disabled. The shared layout engine continues to route real nodes without editor state or changes to its public data model. Preview geometry uses existing route helpers without reserving or mutating real lanes. Deferred ghosts can extend the drawing bounds but do not trigger automatic zoom resets.

Use current tone tokens and surface variants, including glass, with no new color system. Ghosts remain visually distinct from selectable real nodes. Keyboard users can focus a side action and invoke creation without a mouse drag; accessible names and cancellation/status announcements use kit translation strings.

## Validation

Cover all four side bands; corner selection and hysteresis; direction changes during drag; valid and canceled drops; one callback per completed drag; stable IDs; replacement/dismissal lifecycle; disabled cards; zoomed/scrolled pointer conversion; obstacle-free slots; nested control interactions; and cleanup on data changes or edit-mode exit.

Retain all current routing, caption, lane-spacing, crossing-hop, node-selection and viewport tests. Add a documentation example where a drop opens a SidePanel form and saving replaces the ghost using the same ID. Existing card centre clicks open the same panel for title, subtitle, tone and height changes. Visually inspect editing at multiple zoom levels and with glass and solid surfaces.

## Stage 2: explicit topology and existing-node connections

The editing demo supplies `connections: ConnectionFlowConnection[]`. Each entry has a stable `id`, `fromId`, `toId`, optional `fromSide`/`toSide`, and the existing connector visual configuration. When provided, this array is the complete topology: an empty array draws no edges, and layout groups/rows control placement without inferring links. Omitting it preserves all legacy workflow inference.

Creating a node adds only the source-to-new-node connection requested by the drag. It never inherits the source's incoming/outgoing links or replaces existing connections.

Dropping an edit connector onto an existing card previews a dashed route and highlights that target. Release emits `onConnect({ sourceId, targetId, sourceSide, targetSide })`; it emits no node-creation request and creates no placeholder. The application commits the connection through the controlled connections prop. Self-links, duplicate directed connections and disabled targets are rejected. Escape and pointer cancellation discard the preview. Full sides try the nearest available adjacent side.

Explicit links pass through the existing anchor allocation, obstacle routing, caption, spacing and crossing-hop calculations. The demo keeps its node property SidePanel for node creation/editing; an existing-node connection requires no panel.


## Persisting editor rows and columns

Top-level editor nodes may all declare `gridPosition: { column, row }` using signed integer indices. Columns and rows are ordered by these indices; each row uses its tallest card and retains the existing caption and connector clearance budgets. The legacy automatic layout remains the default when cells are absent.

For a graph using these cells, the ghost snaps to an existing row/column when its destination cell is free. Creation includes `gridPosition` in the placement context. The demo persists this cell directly instead of inserting a top-level column or inferring parallel groups. Creating a step right of a second-row card can therefore fill the second row under Review without moving Review or adding unrelated connections.


Dragging into empty space snaps the two grid axes independently, including one new row or column at the outer boundaries. A lower-row source can create a card in the row beside Review without adding a link to Review. Source-side switching still follows the drag direction, while the target cell follows the pointer. Pending ghosts retain their requested cell during reflow; pointer release emits that same placement.


## Existing connection editing (2026-10-24)

Explicit connections support an optional tone (source-node tone by default), a free-text type, accessible description, arbitrary data, and editable/deletable flags. These values are application-owned metadata, not an execution schema. Endpoint color overrides remain available; inferred workflow connections retain their existing appearance.

In edit mode each explicit rendered edge has a stable focusable hit target along its actual routed path and caption. Click/Space selects; double-click/Enter requests editing; Delete/Backspace on the focused target requests removal; Escape clears selection. Form keystrokes never delete connections. Read-only graphs retain their existing pointer/pan behavior. Selection has optional controlled selectedConnectionId plus onConnectionSelect, or internal state when the prop is omitted. Editing/removal callbacks receive the original ConnectionFlowConnection and never mutate controlled data. editable/deletable false suppress the corresponding request. Removing a connection leaves nodes intact.

The demo owns its connection SidePanel, label/type/description/tone fields, save/cancel/delete actions and immutable state updates. The API and accessibility documentation show these responsibilities and a separate green/red connection tone example. No generic condition builder is added.

# DiagramFlow editor design

## Goal and boundary

Create a separate React `DiagramFlow` component for editing workflow diagrams. Use the existing `ConnectionFlow` implementation as a starting point, but isolate the new editor and any modified layout or routing code so its development does not change existing `ConnectionFlow` behavior or API. Preserve the existing component, its demos, and its tests. Evaluate shared utilities individually; copy any utility that needs changes incompatible with this boundary.

The component is a diagram editor and execution-state viewer. The consuming application owns persistence, condition evaluation, execution, scheduling, join completion, and the meaning of skipped paths.

## Graph model

- Nodes have stable IDs, application-owned data, positions, optional parent IDs, and optional execution state. A parent can contain an ordered sequence of child nodes. Parent membership is independent of connections.
- Connections have stable IDs, source and target IDs, a `success` or `failure` outcome, and optional application-owned condition and display metadata. Multiple connections may share a source and outcome. Connection endpoints can cross a parent boundary.
- Joins can express an all-incoming-paths requirement. The application reports when each incoming condition is satisfied and when the join may proceed. A skipped path does not automatically satisfy a join; the application decides and reports its contribution.
- Execution states include running, succeeded, failed, and skipped. A condition's representation is application-owned; the editor displays and allows editing metadata through an integration point rather than prescribing a condition language.
- Validation rejects missing endpoints, duplicate IDs, invalid parent relationships, and cyclic parent membership. Connection cycles are valid and must not be confused with parent cycles. Exact duplicate-connection policy must permit distinct outcomes and conditions between the same endpoints.

## Required behavior

For `A → B → C → D`, creating E from B adds B → E without altering B → C. E may connect to C. Both outgoing connections can be success paths with separate conditions. When C is an all-paths join, C waits until the application reports all required incoming conditions satisfied.

C may contain `C1 → C2 → C3`. C2 can connect back to C1 on failure, so the application can retry until C2 succeeds. C3 connects to D on success. The application reports C complete after the contained sequence completes; the editor does not execute the sequence or infer execution from the diagram.

Creating a branch never silently splits an existing connection or rewires unrelated edges. A canceled creation creates no node or connection. A single completed gesture produces one creation request. Transient previews and pending drafts have a clearly defined lifecycle, never become persisted graph nodes by themselves, and disappear when resolved or canceled.

## Layout and interaction

Use a grid-assisted canvas: nodes have persisted positions, snap to a configurable grid, and can be moved manually. Display distinct lanes for parallel paths and route connections around nodes. Support horizontal and vertical arrangements, including a vertical child ladder within a parent. Auto-align and auto-layout are explicit actions; ordinary graph edits do not unexpectedly rearrange manually positioned nodes. Keep graph topology independent from position and never infer new connections from proximity.

Provide clear handles for creating branches and connecting existing nodes, including visible outcome and condition labels. Give loops, success and failure paths distinguishable visual treatment in addition to color. Provide clear join and parent-child indicators, keyboard-accessible actions, zoom and pan, selection, cancellation, and undo/redo. The API exposes controlled graph updates and atomic operations so node and edge changes cannot be committed inconsistently. If operations conflict with newer application state, reject or revalidate them rather than silently changing the wrong graph.

## Implementation sequence

1. Reproduce the reported duplicate empty nodes and messy branch placement in the existing editor. Record the triggering gesture, callbacks, ghost IDs, and persisted data. Do not assume a root cause before reproduction.
2. Copy and isolate the React component and required layout/routing code under the new `DiagramFlow` boundary. Add exports and a separate demo without modifying existing `ConnectionFlow` behavior.
3. Introduce the explicit graph and operation model, including draft lifecycle, parent membership, outcome paths, conditions, and joins. Define compatibility and serialization before choosing public TypeScript names.
4. Implement branch and existing-node connection editing, then nested vertical sequences and failure loops. Ensure operations preserve unrelated graph edges.
5. Add manual positioning, snapping, routing, alignment and undo/redo. Use the demo to exercise branches, rejoining paths, nested loops and application-reported execution states.
6. Verify accessibility and behavior in a real browser at multiple zoom levels. Run existing ConnectionFlow tests as regression coverage and add targeted tests for the new editor.

## Acceptance criteria

- One creation gesture produces exactly one request and at most one pending preview; cancel removes the preview without persisting data.
- B → E does not change B → C; E → C can coexist with B → C. Conditions and outcomes remain attached to the correct connections after editing and reload.
- An all-paths join does not visually report readiness until the application reports the required paths satisfied, including its explicit decision for skipped paths.
- C1 → C2 → C3, C2 failure → C1, and C3 success → D remain distinct after editing and reload. Parent containment has no cycles; valid connection loops render safely.
- Horizontal and vertical flows remain readable without node overlap; explicit auto-layout does not run during ordinary edits. Manual positions survive save and reload.
- Existing `ConnectionFlow` public behavior, documentation examples, and tests remain intact. Browser tests cover pointer, keyboard, cancellation, zoom, pan, branches, joins, loops, and nested connections.

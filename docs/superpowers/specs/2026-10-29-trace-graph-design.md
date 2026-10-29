# TraceGraph design

## Purpose

A read-only, animated graph visualization for histories and dependency flows.
Consumers define what points and connections mean. Agent turns, tool calls,
interactions and parallel agents are one example. Target hundreds to thousands
of points. Support a single chain, forks, independent branches and merges.

The graph itself must not use DOM nodes or SVG paths per item. HTML remains
appropriate for toolbar controls, consumer detail overlays and accessibility.

## Rendering

Use an isolated WebGL2 renderer for point sprites, sampled connection curves,
selection rings and animated activity. Use a Canvas 2D text layer for labels,
sharing the same camera transform and device-pixel ratio. Keep the rendering
interface independent of React and layout. Provide a Canvas 2D graph fallback
when WebGL is unavailable, and handle context loss and restoration.

Reuse the kit's palette resolution, surface variants, tone, corner, padding,
loading and empty-state conventions. The sample's dark atmosphere is a demo
theme, not a hardcoded component appearance. Glow and flowing particles are
optional, adjustable effects; light themes must remain legible.

Cull offscreen geometry, batch draw calls and update geometry buffers only
when their data changes. Use a spatial index for node and edge hit testing.
Animate with requestAnimationFrame only while motion is needed; suspend when
hidden or offscreen. Respect reduced motion and cap rendering resolution.

## Consumer data

Nodes have stable ids, optional labels, timestamps/order, lane/group, status,
tone and metadata. Edges have stable ids, source/target ids, optional tone,
status and metadata. Consumers explicitly identify active nodes/edges; do not
assume every outgoing edge from a running node is active.

Two layout modes share the same renderer and camera:

- timeline: time or explicit order determines the progression axis; stable
  lanes separate concurrent activity. Missing times can use supplied order.
- dependency: directed dependencies determine depth; deterministic lanes
  separate branches and compact again where they rejoin.

Single chains stay on one lane. Do not invent permanent branches or duplicate
nodes to represent merges. Multiple roots are valid; do not add fake data to
join them. Duplicate ids, missing endpoints and cycles must be validated and
reported through diagnostics, without crashing the entire visualization.
Dependency cycles use a deterministic fallback ordering and back-edge styling.

Layout resides in common/traceGraph with no browser dependency. Retain lane
assignments and existing positions during append updates where possible, so
the live graph does not reorganize on every event. Worker offloading is a
later optimization if profiling shows layout blocks interaction.

## Interaction and details

Pan by dragging, zoom at the pointer with wheel/pinch, and expose fit/reset,
zoom buttons and animated focus commands. Distinguish a click from a drag.
Zoom changes label density and point detail; selected and focused labels have
priority. Resolve overlapping labels rather than showing every label.

Support node/edge selection callbacks for external details. Also support
consumer render callbacks for hover tooltips and selected detail popovers,
anchored to projected screen coordinates. Selection and camera focus are
independent; selecting a point should not necessarily move the camera.

When a selected point leaves the viewport, dismiss its anchored popup while
retaining selection for an external details panel. Recalculate anchors during
camera movement and resize. DOM detail content is consumer-owned; graph labels
remain canvas-rendered.

Provide a named keyboard-focusable graph, directional traversal, activation
for selected details, Escape dismissal and a bounded accessible list/search
alternative. Do not create thousands of hidden tab stops. Labels and toolbar
copy use the kit's i18n conventions with consumer overrides.

## Animation

Animate newly appended points and edges, active point pulses, and directional
flow along active edges. Completed paths settle into a static appearance.
Animate pan, zoom-to-fit, focus and layout transitions with consistent easing.
Reduced motion keeps state/selection readable while removing nonessential
pulsing, particles and camera interpolation.

## Follow mode

Follow frames explicitly supplied active node ids; if omitted, use nodes whose
status is running. Follow the active frontier plus a limited nearby context,
not the entire historical graph. With multiple active agents, frame their
combined bounds, constrained by min/max zoom and viewport padding.

Use an inner safe zone and hysteresis: the camera moves only when targets
leave that zone or their combined bounds no longer fit. Retarget an ongoing
camera transition from its current interpolated position when events arrive.
Coalesce bursts of updates; avoid repeated zoom-in/zoom-out jitter. If active
targets disappear, hold the current view until new valid targets arrive.

Expose off/following/paused follow state, with controlled and uncontrolled
support and a state-change callback. User pan, zoom or an explicit manual focus
command pauses follow immediately and cancels camera motion. Selection alone
does not pause follow unless it moves the camera. Resume following re-frames
the current frontier smoothly; it does not replay missed camera movements.

## Proposed public shape

TraceGraph accepts nodes, edges, layout, activeNodeIds, activeEdgeIds,
selectedNodeId, selection callbacks, renderNodeTooltip, renderNodePopover,
followMode/defaultFollowMode/onFollowModeChange, graph surface props and
animation settings. An imperative ref provides fit, zoomTo, focusNodes,
resumeFollowing and pauseFollowing. Final types should follow the existing
NetworkGraph and ConnectionFlow naming where their semantics agree.

## Implementation phases

1. Define data, layout and camera contracts. Implement deterministic timeline
   and dependency layouts with single-path, fork and rejoin fixtures.
2. Build renderer lifecycle, geometry batching, hit testing, camera transforms,
   resize handling and fallback rendering.
3. Add selection, details overlays, zoom-dependent labels and keyboard access.
4. Add activity/layout animations and follow mode, including interruption,
   resumption, concurrent frontiers and reduced motion.
5. Register a demo page with a conventional playground, timeline/dependency
   examples, fork/rejoin, agent/tool-call live playback, follow controls, theme
   controls, consumer detail callbacks and a large-data stress fixture.

## Verification

Unit-test deterministic layout, cycles and invalid references, append stability,
camera transforms and bounds, hit testing, and follow-state transitions.
Integration-test selection callbacks, detail anchoring, input interruption,
resize and renderer cleanup. Inspect live playback in light/dark themes and
with reduced motion. Exercise fallback/context loss. Profile hundreds and
thousands of points on available hardware and document measured limits; do not
promise a frame rate without measurement.

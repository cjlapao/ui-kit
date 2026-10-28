# Gantt dependency routing improvements

**Date:** 2026-10-28  
**Status:** Approved for implementation  
**Scope:** Gantt dependency routing, drawing bounds, hit testing, tests, and demo coverage

## Context

Gantt already uses a pure, framework-independent routing engine in
`common/gantt/drag.ts`. It derives bar geometry from dates and rows, avoids task
bars, fans links across shared ports, aligns routes globally, and re-routes
dependencies live while a task moves or resizes. The React component derives
the resulting paths with `useMemo`; it does not measure task bars from the DOM.

ConnectionFlow recently added three techniques that address gaps still visible
in dense Gantt charts:

1. independent routes account for already occupied lanes instead of drawing
   repeatedly over the same segment;
2. perpendicular crossings receive a small PCB-style hop so a crossing cannot
   be mistaken for a merge;
3. drawing bounds come from routed geometry rather than a fixed canvas margin.

The Gantt should adopt those techniques without replacing its specialized
timeline router. The existing right-edge-to-left-edge dependency convention,
row-boundary escape routes, port fan, task-bar avoidance, and live preview
behavior remain unchanged.

## Goals

- Keep independent dependency links visually distinguishable in shared
  corridors.
- Make unavoidable perpendicular crossings read as crossings.
- Ensure outside detours always fit inside the horizontal scroll extent.
- Preserve stable routes while links, rows, or tasks are unchanged.
- Preserve live re-routing during task move and resize.
- Keep routing pure and framework independent.
- Keep dense-chart interaction responsive.

## Non-goals

- Replacing Gantt routing with ConnectionFlow's Hanan-grid A* router.
- Allowing arbitrary source or target sides. Gantt dependencies continue to
  leave the source's right edge and enter the target's left edge.
- DOM measurement of bars or connectors.
- Changing dependency types, arrow styling, port fan behavior, or drag/drop
  semantics.
- Preventing all connector crossings. Some crossings are valid graph topology;
  the goal is to render them unambiguously.

## Chosen approach

Keep the current route construction and add three deterministic post-routing
stages:

1. allocate distinct lanes to compatible vertical channels;
2. decorate true perpendicular crossings with hops;
3. calculate the rendered horizontal extent from the final geometry.

This is preferred over a full shared-router migration because Gantt has a
constrained and predictable geometry. Its current router already guarantees
the important task-bar avoidance behavior at substantially lower cost than an
A* search on every pointer move.

## Lane allocation

Replace `alignVerticalChannels` with a lane allocator operating on the same
route `Channel` metadata.

The allocator groups channels whose Y spans overlap transitively. Within each
group it processes links in stable identity order:

1. explicit `link.id`, when present;
2. otherwise `source`, `target`, and normalized `type`;
3. original index only as the final duplicate tie-breaker.

For each channel, choose the nearest available X slot that:

- lies inside that channel's existing `(lo, hi)` window;
- retains `LINK_PASS_PADDING` from every bar crossed by the channel's Y span;
- remains separated from previously allocated independent channels by the lane
  spacing;
- minimizes displacement from the route's original preferred X.

Lane spacing is a Gantt routing constant derived from the visible stroke,
selection stroke, hop radius, and a small visual gap. It is not exposed as a
public component prop in this change.

If no distinct slot fits, retain the existing safe channel instead of pushing
the connector through a task bar. This fallback can still overlap another
connector, but it preserves correctness and allows the crossing/selection
layers to remain usable. Duplicate links are not silently removed.

The allocator must not change source or target port coordinates. Port fan
ordering remains responsible for separation at bar edges.

## Crossing hops

After lane allocation, compare final orthogonal route segments. A crossing is
eligible only when the interior of one horizontal segment intersects the
interior of one vertical segment.

Do not add a hop for:

- collinear or parallel overlap;
- a touch at a segment endpoint;
- a crossing inside the space reserved for a rounded elbow;
- a crossing too close to a source port, target port, or arrow approach;
- crossings whose available horizontal run cannot support the minimum hop.

The horizontal route receives a semicircular hop. The hop radius defaults to
the current Gantt elbow radius and shrinks when two nearby crossings cannot
both fit at full size. Routes without a crossing retain byte-identical SVG path
output after lane allocation.

Introduce the crossing implementation as a focused framework-independent
helper under `common/gantt`. Do not modify ConnectionFlow or import its
component, layout, or router modules in this change. A later refactor may
extract the two proven implementations behind a shared primitive, but that is
separate work with its own regression scope.

### Hit testing

The visible hop and selection geometry must agree. The route result therefore
exposes hit-test geometry that follows the hop, either as sampled points or as
explicit arc metadata understood by `pickLinkAt`.

Using only the pre-hop orthogonal points is not acceptable: at the top of a
hop, the old geometry would consider the vertical connector closer and could
select the wrong dependency. The SVG's wide transparent hit path continues to
provide the initial event target, while the pure nearest-route resolver uses
the final visible geometry to disambiguate nearby links.

## Route-derived drawing bounds

After final paths and arrowheads are resolved, compute the furthest horizontal
coordinate occupied by:

- route points and hop geometry;
- source and target port halos;
- arrowhead polygons;
- the selected-link stroke allowance.

The effective link-layer width is:

```text
max(timelineWidth + LINK_RIGHT_GUTTER, furthestRouteX + routeSafetyPadding)
```

Use the same effective extent for the Gantt body scroll content and
`GanttLinkLayer`. `LINK_RIGHT_GUTTER` remains the minimum blank margin, so
existing charts keep their present spacing.

This change only expands the right side. The time range already provides the
timeline origin and task padding, while backward routes use safe row-boundary
channels. Supporting a negative drawing origin would require decoupling the
drag overlay's timeline origin from the visual SVG origin and is outside this
change. Add a regression assertion that existing routing does not generate a
visually clipped negative extent for the supported fixtures.

## Resize and update behavior

Do not add a `ResizeObserver` for dependency geometry. Routes depend on task
dates, visible row geometry, zoom, links, and live drag overrides, all of which
already participate in memoized calculation.

- Task move/resize: update the live bar map and recompute lanes, hops, and
  bounds in the same render as the current preview.
- Row reorder/collapse: recompute from the new visible row model.
- Zoom or date-range change: recompute from the new timeline coordinates.
- Fixed-column resize: move the timeline's screen origin only; do not recompute
  timeline-space routes solely because `leftWidth` changed.
- Container resize: allow normal scrolling and layout; it does not alter route
  geometry.

Add the effective link extent to the existing header-scroll synchronization
dependencies so the detached scale remains aligned if the scroll range grows
or shrinks.

## Performance

Routing remains a pure calculation under the existing `useMemo` boundary. No
derived paths are copied into React state and no effect performs layout work.

Avoid an unconditional edge-by-edge, segment-by-segment crossing pass for
obviously unrelated routes. Build segment bounding boxes, group them into
coarse row-height spatial buckets, and perform exact intersection checks only
for horizontal/vertical candidates sharing a bucket. Lane allocation reuses
the existing channel groups and bar interval helpers.

The implementation should be validated with a dense fixture of approximately
100–200 visible dependencies. The acceptance criterion is that live task
resize remains responsive and routing work stays bounded; no public performance
budget prop is introduced.

## Test plan

### Pure engine tests

- Independent links in one Y corridor receive distinct vertical lanes.
- Reordering the input link array does not swap lanes for links with stable
  identities.
- Every allocated channel preserves task-bar clearance.
- A corridor with insufficient room falls back to a safe existing channel.
- A perpendicular interior crossing adds one hop to the horizontal route.
- Parallel overlap, endpoint touches, elbow-adjacent intersections, and
  port-adjacent intersections add no hop.
- Closely packed crossings shrink or omit hops without malformed SVG.
- Nearest-route hit testing follows the visible hop.
- The calculated route extent contains every path, halo, and arrowhead.
- Missing source or target bars continue to skip the dangling dependency.

### React tests

- The body content and link layer use the same route-derived width.
- A right-outside detour expands the horizontal scroll extent beyond the
  minimum gutter.
- Live move and resize update the visible path and its extent before commit.
- Row reorder, lane/group collapse, zoom, and date-range changes produce the
  expected recalculation.
- Fixed-column resizing preserves timeline-space path data.
- Header translation remains synchronized at the expanded scroll boundary.

### Demo and visual review

Add a dense-dependencies example to the Gantt documentation showing shared
corridors, fan-in/fan-out, backward dependencies, intermediate obstacles, and
at least one unavoidable crossing. Review it in light and dark themes while:

- moving and resizing a connected task;
- changing zoom;
- resizing fixed columns;
- collapsing and expanding a group or lane;
- scrolling to the furthest right detour;
- selecting links at and around a hop.

## Expected files

- `common/gantt/drag.ts`
- `common/gantt/types.ts`
- a focused crossing helper under `common/gantt/`
- `react/src/components/Gantt/Gantt.tsx`
- `react/src/components/Gantt/GanttLinkLayer.tsx`
- `react/src/components/Gantt/gantt-engine.test.ts`
- `react/src/components/Gantt/Gantt.test.tsx`
- Gantt demo documentation and example files

No public Gantt props are required for this improvement.

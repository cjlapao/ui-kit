import { describe, it, expect } from "vitest";
import {
  buildColumns,
  fitToViewport,
  getToneClasses,
  hitTestNode,
  layoutConnectionFlow,
  layoutIsAnimated,
  connectorDotRadius,
  connectorVisual,
  dotTiming,
  getNodeSurface,
  nodeIcon,
  labelAnchor,
  tracePathTo,
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTION_FLOW_STATUSES,
  CONNECTOR_RING_RADIUS,
  STATUS_ICON,
  STATUS_TONE,
  DEFAULT_LAYOUT_OPTIONS,
  NODE_CORNER_RADIUS,
  NODE_METRICS,
  itemGlyph,
  itemsReserveGlyph,
  measureHeader,
  measureNode,
  visibleItems,
  type ConnectionFlowNode,
} from "../../connectionFlow";
import {
  CONTROL_SIZES,
  SURFACE_CORNERS,
  SURFACE_VARIANTS,
  TRUE_COLORS,
} from "../../theme/Theme";

const flow = (...nodes: ConnectionFlowNode[]) => nodes;

describe("ConnectionFlow layout", () => {
  describe("columns", () => {
    it("groups consecutive parallel nodes into one column", () => {
      const columns = buildColumns(
        flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d" },
        ),
      );
      expect(columns.map((c) => c.nodes.length)).toEqual([1, 2, 1]);
      expect(columns[1].parallel).toBe(true);
    });

    it("places each column to the right of the last", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }, { id: "c" }),
      });
      const xs = layout.nodes.map((n) => n.x);
      expect(xs[0]).toBeLessThan(xs[1]);
      expect(xs[1]).toBeLessThan(xs[2]);
    });

    it("starts a new column at a change of group", () => {
      // Consecutive `parallel` nodes form one column, which left no way to put
      // two multi-lane columns next to each other: three lanes feeding two
      // became a single column of five.
      const columns = buildColumns(
        flow(
          { id: "a" },
          { id: "b", kind: "parallel", group: "build" },
          { id: "c", kind: "parallel", group: "build" },
          { id: "d", kind: "parallel", group: "publish" },
          { id: "e", kind: "parallel", group: "publish" },
        ),
      );
      expect(columns.map((c) => c.nodes.length)).toEqual([1, 2, 2]);
      expect(columns[1].parallel && columns[2].parallel).toBe(true);
    });

    it("keeps an ungrouped run as one column", () => {
      const columns = buildColumns(
        flow({ id: "b", kind: "parallel" }, { id: "c", kind: "parallel" }),
      );
      expect(columns).toHaveLength(1);
    });

    it("connects every lane of one parallel column to every lane of the next", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a", kind: "parallel", group: "build" },
          { id: "b", kind: "parallel", group: "build" },
          { id: "c", kind: "parallel", group: "publish" },
          { id: "d", kind: "parallel", group: "publish" },
        ),
      });
      const between = layout.edges.filter(
        (e) => e.fromId === "a" || e.fromId === "b",
      );
      expect(
        between.map((e) => `${e.fromId}->${e.toId}`).sort(),
      ).toEqual(["a->c", "a->d", "b->c", "b->d"]);
    });

    it("stacks a parallel column into lanes", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
        ),
      });
      const b = layout.nodes.find((n) => n.id === "b")!;
      const c = layout.nodes.find((n) => n.id === "c")!;
      expect(b.x).toBe(c.x);
      expect(c.y).toBeGreaterThan(b.y);
    });
  });

  describe("edges", () => {
    it("connects each column to the next", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
      });
      expect(layout.edges).toHaveLength(1);
      expect(layout.edges[0].fromId).toBe("a");
      expect(layout.edges[0].toId).toBe("b");
    });

    it("fans out into a parallel column and back in", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d" },
        ),
      });
      const out = layout.edges.filter((e) => e.fromId === "a");
      const back = layout.edges.filter((e) => e.toId === "d");
      expect(out.map((e) => e.toId).sort()).toEqual(["b", "c"]);
      expect(back.map((e) => e.fromId).sort()).toEqual(["b", "c"]);
    });

    it("emits no edge past a terminal node", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", terminal: true }, { id: "b" }),
      });
      expect(layout.edges).toHaveLength(0);
    });

    it("draws a label once per fan, not once per lane", () => {
      // Every edge of a fan carries the same connector config, so the label
      // was drawn once per lane, stacked on top of itself.
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel", connector: { label: "on: main" } },
          { id: "c", kind: "parallel", connector: { label: "on: main" } },
        ),
      });
      const labelled = layout.edges.filter((e) => e.label !== undefined);
      expect(labelled).toHaveLength(1);
    });

    it("hangs children below their parent and joins them", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", children: [{ id: "a1" }, { id: "a2" }] }),
      });
      const parent = layout.nodes.find((n) => n.id === "a")!;
      const child = layout.nodes.find((n) => n.id === "a1")!;
      expect(child.y).toBeGreaterThan(parent.y + parent.height);
      expect(child.x).toBeGreaterThan(parent.x);
      expect(child.depth).toBe(1);
      expect(layout.edges.some((e) => e.id === "a v> a1".replace(/ /g, ""))).toBe(
        true,
      );
    });
  });

  describe("skipped steps", () => {
    it("arches over an explicitly skipped node", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b", skipped: true }, { id: "c" }),
      });
      const edge = layout.edges.find((e) => e.toId === "c")!;
      expect(edge.fromId).toBe("a");
      expect(edge.bypass).toBe(true);
      expect(layout.edges.some((e) => e.toId === "b")).toBe(false);
    });

    it("anchors the bypass to the same ports as any other edge", () => {
      // It used to leave from each card's *top*, which is why it needed to be
      // one arc between the column boxes: per lane, a lower riser cut straight
      // through the card above it. Leaving sideways and rising clear of the
      // card outside it removes the reason for the special case.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b", skipped: true }, { id: "c" }),
      });
      const a = layout.nodes.find((n) => n.id === "a")!;
      const c = layout.nodes.find((n) => n.id === "c")!;
      const edge = layout.edges.find((e) => e.bypass)!;
      const [start] = edge.points;
      const end = edge.points[edge.points.length - 1];
      const dot = connectorDotRadius(CONNECTOR_RING_RADIUS.md);
      // Out of the source's right border, into the target's left one, each
      // stopping at the core dot rather than running under it.
      expect(start.x).toBeCloseTo(a.x + a.width + dot, 1);
      expect(start.y).toBeCloseTo(a.y + a.anchorY, 1);
      expect(end.x).toBeCloseTo(c.x - dot, 1);
      expect(end.y).toBeCloseTo(c.y + c.anchorY, 1);
      // And it goes over the top in between.
      expect(Math.min(...edge.points.map((p) => p.y))).toBeLessThan(a.y);
    });

    it("auto-detects an untouched step that something after it passed", () => {
      const layout = layoutConnectionFlow({
        autoState: true,
        nodes: flow(
          { id: "a", tone: "emerald" },
          { id: "b", tone: "neutral" },
          { id: "c", tone: "emerald" },
        ),
      });
      expect(layout.edges.find((e) => e.toId === "c")!.fromId).toBe("a");
    });

    it("honours an explicit skipped:false on a neutral node", () => {
      // A step that ran but happens to be neutral must not be arched over.
      const layout = layoutConnectionFlow({
        autoState: true,
        nodes: flow(
          { id: "a", tone: "emerald" },
          { id: "b", tone: "neutral", skipped: false },
          { id: "c", tone: "emerald" },
        ),
      });
      expect(layout.edges.find((e) => e.toId === "c")!.fromId).toBe("b");
    });
  });

  describe("edge state", () => {
    it("derives state from tone under autoState", () => {
      const layout = layoutConnectionFlow({
        autoState: true,
        nodes: flow(
          { id: "a", tone: "emerald" },
          { id: "b", tone: "blue", active: true },
          { id: "c", tone: "neutral" },
        ),
      });
      expect(layout.edges.find((e) => e.toId === "b")!.state).toBe("flowing");
      expect(layout.edges.find((e) => e.toId === "c")!.state).toBe("stopped");
    });

    it("lets an explicit state win", () => {
      const layout = layoutConnectionFlow({
        autoState: true,
        nodes: flow(
          { id: "a", tone: "emerald" },
          { id: "b", tone: "neutral", connector: { state: "flowing" } },
        ),
      });
      expect(layout.edges[0].state).toBe("flowing");
    });

    it("only animates what is moving", () => {
      const still = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        flowState: "stopped",
        animated: true,
      });
      expect(layoutIsAnimated(still)).toBe(false);

      const moving = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        flowState: "flowing",
        animated: true,
      });
      expect(layoutIsAnimated(moving)).toBe(true);
    });
  });

  describe("routing", () => {
    it("applies the edge style to every edge, not just the track", () => {
      // The child edges used to be a hard-coded three-point L and the bypass a
      // hard-coded lift, so `curved` curved the main track and left both of
      // those as square elbows.
      const layout = layoutConnectionFlow({
        options: { edgeStyle: "curved" },
        nodes: flow(
          { id: "a", children: [{ id: "a1" }] },
          { id: "b", skipped: true },
          { id: "c" },
        ),
      });
      expect(layout.edges.length).toBeGreaterThan(1);
      for (const edge of layout.edges) {
        expect(edge.d).toContain("Q");
      }
    });

    it("routes all three styles the same way, differing only at the corners", () => {
      // `straight` used to mean a direct diagonal between the ports, which
      // ignored the bypass clearance entirely and cut a shallow line across
      // the very cards it was meant to avoid. The route is one thing and the
      // corner treatment is another.
      const shape = (edgeStyle: "orthogonal" | "curved" | "straight") =>
        layoutConnectionFlow({
          options: { edgeStyle },
          nodes: flow({ id: "a" }, { id: "s", skipped: true }, { id: "c" }),
        }).edges.find((e) => e.bypass)!;

      const straight = shape("straight");
      const orthogonal = shape("orthogonal");
      const curved = shape("curved");

      // Same waypoints...
      expect(orthogonal.points).toEqual(straight.points);
      expect(curved.points).toEqual(straight.points);
      // ...drawn with sharper or softer corners.
      expect(straight.d).not.toMatch(/[CQ]/);
      expect(orthogonal.d).toContain("Q");
      expect(curved.d).toContain("Q");
      // Curved rounds each corner as far as its segments allow, so it has less
      // straight line left in it than the fixed-radius orthogonal does.
      const straightRuns = (d: string) => (d.match(/L /g) ?? []).length;
      expect(straightRuns(curved.d)).toBeLessThanOrEqual(
        straightRuns(orthogonal.d),
      );
    });

    it("rounds the corners of an orthogonal edge", () => {
      const layout = layoutConnectionFlow({
        options: { edgeStyle: "orthogonal" },
        nodes: flow({ id: "a", children: [{ id: "a1" }] }),
      });
      expect(layout.edges[0].d).toContain("Q");
    });

    it("keeps an aligned edge to two points in every style", () => {
      // Two nodes at the same height need no turn at all, so the collinear
      // waypoints collapse and there is nothing left for a corner style to do.
      for (const edgeStyle of CONNECTION_FLOW_EDGE_STYLES) {
        const layout = layoutConnectionFlow({
          options: { edgeStyle },
          nodes: flow({ id: "a" }, { id: "b" }),
        });
        expect(layout.edges[0].points).toHaveLength(2);
        expect(layout.edges[0].d).not.toMatch(/[CQ]/);
      }
    });

    it("gives a whole fan one spine", () => {
      // Turning at each pair's own midpoint put a wide card's elbow at a
      // different x from its narrower sibling's, so a single branch point in
      // the graph was drawn as several.
      const layout = layoutConnectionFlow({
        options: { edgeStyle: "straight" },
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d", kind: "parallel" },
        ),
      });
      const fan = layout.edges.filter((e) => e.fromId === "a");
      expect(fan).toHaveLength(3);
      // The lane level with the source needs no turn at all and collapses to a
      // straight run; the ones that do turn all turn on the same vertical.
      const turning = fan.filter((e) => e.points.length > 2);
      expect(turning.length).toBeGreaterThan(1);
      const turns = turning.map((e) => e.points[1].x.toFixed(3));
      expect(new Set(turns).size).toBe(1);
    });

    it("gives every edge a path the dots can follow", () => {
      // The dots animate along `d`, so an edge without one would have its dots
      // travelling a different route from the line they sit on.
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a", children: [{ id: "a1" }] },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
        ),
      });
      for (const edge of layout.edges) {
        expect(edge.d.startsWith("M")).toBe(true);
      }
    });

    it("leaves a node on the side facing its target", () => {
      // Ports are chosen from the geometry, which is what makes a child edge
      // leave the parent's bottom and a track edge leave its right without
      // either being special-cased.
      const layout = layoutConnectionFlow({
        options: { edgeStyle: "straight" },
        nodes: flow({ id: "a", children: [{ id: "a1" }] }, { id: "b" }),
      });
      const a = layout.nodes.find((n) => n.id === "a")!;
      const track = layout.edges.find((e) => e.toId === "b")!;
      const child = layout.edges.find((e) => e.toId === "a1")!;
      const dot = connectorDotRadius(CONNECTOR_RING_RADIUS.md);
      expect(track.points[0].x).toBeCloseTo(a.x + a.width + dot, 1);
      expect(child.points[0].y).toBeCloseTo(a.y + a.height + dot, 1);
    });
  });

  describe("bypass routing", () => {
    it("connects every lane across a skipped run, on one shared line", () => {
      // A single arc between the column bounding boxes left every lane but the
      // first with no edge at all — they looked orphaned, and `tracePathTo`
      // reported no ancestry for them because there was genuinely none. Each
      // lane gets its own edge; they share the clearance line, and the overlap
      // is the merge.
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a", kind: "parallel" },
          { id: "b", kind: "parallel" },
          { id: "skip", skipped: true },
          { id: "c" },
        ),
      });
      const arcs = layout.edges.filter((e) => e.bypass);
      expect(arcs.map((e) => e.fromId).sort()).toEqual(["a", "b"]);
      expect(arcs.every((e) => e.toId === "c")).toBe(true);

      // One clearance line, and one riser, so the two read as a single path.
      const tops = arcs.map((e) => Math.min(...e.points.map((p) => p.y)));
      expect(new Set(tops.map((t) => t.toFixed(3))).size).toBe(1);
      const risers = arcs.map((e) => e.points[1].x.toFixed(3));
      expect(new Set(risers).size).toBe(1);

      // Neither riser crosses the card in the lane above it.
      const cards = layout.nodes.filter((n) => n.id === "a" || n.id === "b");
      for (const arc of arcs) {
        for (const point of arc.points) {
          const inside = cards.some(
            (n) =>
              point.x > n.x &&
              point.x < n.x + n.width &&
              point.y > n.y &&
              point.y < n.y + n.height,
          );
          expect(inside).toBe(false);
        }
      }
    });

    it("gives every bypassed lane a traceable ancestry", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "skip", skipped: true },
          { id: "c", kind: "parallel" },
          { id: "d", kind: "parallel" },
        ),
      });
      // The lower lane used to have no incoming edge, so hovering it lit
      // nothing at all.
      expect(tracePathTo(layout, "d").nodes.has("a")).toBe(true);
    });

    it("clears every card it arches over", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "s1", skipped: true, description: "tall enough to matter" },
          { id: "s2", skipped: true },
          { id: "c" },
        ),
      });
      const arc = layout.edges.find((e) => e.bypass)!;
      const highest = Math.min(...arc.points.map((p) => p.y));
      const skippedTops = layout.nodes
        .filter((n) => n.id === "s1" || n.id === "s2")
        .map((n) => n.y);
      for (const top of skippedTops) {
        expect(highest).toBeLessThan(top);
      }
    });

    it("spans a run of several skipped steps with one arc", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "s1", skipped: true },
          { id: "s2", skipped: true },
          { id: "s3", skipped: true },
          { id: "c" },
        ),
      });
      const arcs = layout.edges.filter((e) => e.bypass);
      expect(arcs).toHaveLength(1);
      expect(arcs[0].fromId).toBe("a");
      expect(arcs[0].toId).toBe("c");
    });

    it("measures the arc, not just the cards", () => {
      // A bypass lifts above the cards, so bounds taken from nodes alone
      // described a box the arc did not fit in — and `fitToViewport`, which
      // trusts those numbers, then scaled the graph so the arc sat outside the
      // frame. Every edge point must land inside the reported bounds.
      const layout = layoutConnectionFlow({
        options: { padding: 4, bypassLift: 40 },
        nodes: flow({ id: "a" }, { id: "s", skipped: true }, { id: "c" }),
      });
      for (const edge of layout.edges) {
        for (const point of edge.points) {
          expect(point.x).toBeGreaterThanOrEqual(layout.offsetX);
          expect(point.y).toBeGreaterThanOrEqual(layout.offsetY);
          expect(point.x).toBeLessThanOrEqual(layout.width);
          expect(point.y).toBeLessThanOrEqual(layout.height);
        }
      }
    });

    it("shifts the fit so an overhanging arc stays visible", () => {
      // A lift deeper than the padding pushes the arc above the origin.
      const layout = layoutConnectionFlow({
        options: { padding: 4, bypassLift: 40 },
        nodes: flow({ id: "a" }, { id: "s", skipped: true }, { id: "c" }),
      });
      expect(layout.offsetY).toBeLessThan(0);

      const fit = fitToViewport(layout, 800, 400);
      const highest = Math.min(
        ...layout.edges.flatMap((e) => e.points.map((p) => p.y)),
      );
      expect(fit.offsetY + highest * fit.scale).toBeGreaterThanOrEqual(-0.001);
    });

    it("follows the edge style like any other edge", () => {
      const curved = layoutConnectionFlow({
        options: { edgeStyle: "curved" },
        nodes: flow({ id: "a" }, { id: "s", skipped: true }, { id: "c" }),
      });
      expect(curved.edges.find((e) => e.bypass)!.d).toContain("Q");
    });
  });

  describe("path highlight", () => {
    it("traces every ancestor of the focused node", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }),
      });
      const path = tracePathTo(layout, "c");
      expect([...path.nodes].sort()).toEqual(["a", "b", "c"]);
      expect(path.nodes.has("d")).toBe(false);
      expect(path.edges.size).toBe(2);
    });

    it("includes every lane of a parallel column on the path", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d" },
        ),
      });
      const path = tracePathTo(layout, "d");
      expect([...path.nodes].sort()).toEqual(["a", "b", "c", "d"]);
    });

    it("terminates on a cycle instead of looping forever", () => {
      const layout = layoutConnectionFlow({ nodes: flow({ id: "a" }) });
      layout.edges.push({
        id: "loop",
        fromId: "a",
        toId: "a",
        state: "stopped",
        points: [],
        d: "",
        sourceTone: "neutral",
        targetTone: "neutral",
        bypass: false,
        emitIndex: 0,
        emitCount: 1,
        emitSpan: 0,
        animated: false,
      });
      expect(() => tracePathTo(layout, "a")).not.toThrow();
    });
  });

  describe("hit testing", () => {
    it("finds the node under a point", () => {
      const layout = layoutConnectionFlow({ nodes: flow({ id: "a" }) });
      const node = layout.nodes[0];
      expect(hitTestNode(layout, node.x + 5, node.y + 5)?.id).toBe("a");
      expect(hitTestNode(layout, node.x - 50, node.y)).toBeNull();
    });

    it("ignores a disabled node", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", disabled: true }),
      });
      const node = layout.nodes[0];
      expect(hitTestNode(layout, node.x + 5, node.y + 5)).toBeNull();
    });
  });

  describe("fit", () => {
    it("scales the graph into the viewport and centres it", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }, { id: "c" }),
      });
      const fit = fitToViewport(layout, 400, 200);
      expect(fit.scale).toBeLessThan(1);
      expect(layout.width * fit.scale).toBeLessThanOrEqual(400.001);
      expect(fit.offsetX).toBeGreaterThanOrEqual(0);
    });

    it("never scales past 1:1 for a graph smaller than the viewport", () => {
      const layout = layoutConnectionFlow({ nodes: flow({ id: "a" }) });
      expect(fitToViewport(layout, 4000, 2000).scale).toBe(1);
    });

    it("survives a zero-sized viewport instead of dividing by zero", () => {
      const layout = layoutConnectionFlow({ nodes: flow({ id: "a" }) });
      expect(fitToViewport(layout, 0, 0).scale).toBe(1);
    });
  });

  describe("connectors", () => {
    it("puts a terminal at each end of an edge", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
      });
      const edge = layout.edges[0];
      const last = edge.points[edge.points.length - 1];
      const near = (p: { x: number; y: number }) =>
        layout.connectors.find(
          (c) => Math.hypot(c.x - p.x, c.y - p.y) <= c.radius + 0.01,
        );
      // The route is trimmed to stop at the ring, so an endpoint sits exactly
      // one radius outside the terminal it belongs to rather than on top of it.
      expect(near(edge.points[0])).toBeDefined();
      expect(near(last)).toBeDefined();
      expect(edge.points[0].x).not.toBeCloseTo(near(edge.points[0])!.x, 3);
    });

    it("shares one terminal between every edge of a fan-out", () => {
      // Three edges leaving one card meet at one port. An edge that painted
      // its own endpoints stamped three rings on that spot, which the
      // highlight then dimmed three times over — so a "dimmed" connector came
      // out darker than a lit one.
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d", kind: "parallel" },
        ),
      });
      const onA = layout.connectors.filter((c) => c.nodeId === "a");
      expect(onA).toHaveLength(1);
      expect(onA[0].edgeIds).toHaveLength(3);
    });

    it("gives a node one terminal per side it connects on", () => {
      // `b` is entered from the left and left again on the right.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }, { id: "c" }),
      });
      const onB = layout.connectors.filter((c) => c.nodeId === "b");
      expect(onB).toHaveLength(2);
      expect(new Set(onB.map((c) => c.side))).toEqual(new Set(["left", "right"]));
    });

    it("takes the liveliest state of the edges meeting it", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel", connector: { state: "disabled" } },
          { id: "c", kind: "parallel", connector: { state: "flowing" } },
        ),
      });
      const onA = layout.connectors.find((c) => c.nodeId === "a")!;
      expect(onA.state).toBe("flowing");
    });

    it("sizes the ring from the shared scale", () => {
      const small = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        options: { ringSize: "xs" },
      });
      const large = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        options: { ringSize: "xl" },
      });
      expect(small.connectors[0].radius).toBe(CONNECTOR_RING_RADIUS.xs);
      expect(large.connectors[0].radius).toBeGreaterThan(
        small.connectors[0].radius,
      );
    });

    it("lets one edge override the ring size", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b", connector: { ringSize: "xl" } }),
      });
      expect(
        layout.connectors.every((c) => c.radius === CONNECTOR_RING_RADIUS.xl),
      ).toBe(true);
    });

    it("collapses the ring onto the dot at `fit`", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        options: { ringSize: "fit" },
      });
      expect(connectorVisual(layout.connectors[0]).solid).toBe(true);
    });

    it("bulges the border and puts a solid dot at its centre", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b", tone: "blue" }),
      });
      const connector = layout.connectors.find((c) => c.nodeId === "b")!;
      const visual = connectorVisual(connector);
      expect(visual.solid).toBe(false);
      expect(visual.dotRadius).toBeLessThan(visual.radius);
      expect(visual.dotClass).toEqual(getToneClasses("blue").dot);
    });

    it("makes the bulge part of the node's own outline", () => {
      // Not a marker drawn on top of the card: one closed path, so the bulge
      // takes the same fill as the rest of the node and no border crosses it.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
      });
      const a = layout.nodes.find((n) => n.id === "a")!;
      const onA = layout.connectors.find((c) => c.nodeId === "a")!;
      expect(onA.side).toBe("right");
      expect(onA.x).toBeCloseTo(a.x + a.width, 3);

      expect(a.outline).toMatch(/^M /);
      expect(a.outline.trim().endsWith("Z")).toBe(true);
      // The outline runs down the right border, stops one radius short of the
      // port, arcs over it, and carries on — so the apex is the only part
      // outside the box.
      expect(a.outline).toContain(
        `L ${a.x + a.width} ${onA.y - onA.radius} A ${onA.radius} ${onA.radius} 0 0 1 ${a.x + a.width} ${onA.y + onA.radius}`,
      );
    });

    it("leaves the outline straight at `fit`", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        options: { ringSize: "fit", nodeCornerRadius: 0 },
      });
      const a = layout.nodes.find((n) => n.id === "a")!;
      expect(connectorVisual(layout.connectors[0]).solid).toBe(true);
      expect(a.outline).not.toContain("A");
    });

    it("tightens a corner rather than dropping a bulge that lands near it", () => {
      // A child port sits close to the bottom-left corner by design, and a
      // terminal that appears at some sizes and not others is worse than a
      // corner a couple of px sharper than asked for.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", children: [{ id: "a1" }] }),
        options: { ringSize: "xl", nodeCornerRadius: 14 },
      });
      const a = layout.nodes.find((n) => n.id === "a")!;
      const bottom = layout.connectors.find(
        (c) => c.nodeId === "a" && c.side === "bottom",
      )!;
      // The bulge is there at full size...
      expect(a.outline).toContain(`A ${bottom.radius} ${bottom.radius} 0 0 1`);
      // ...and the corners gave way for it.
      const radii = [...a.outline.matchAll(/A (\d+(?:\.\d+)?) /g)].map((m) =>
        Number(m[1]),
      );
      expect(radii).toContain(bottom.radius);
      expect(Math.min(...radii)).toBeLessThan(14);
    });

    it("puts an edge caption on its longest straight run", () => {
      // Halfway along the route lands wherever the arithmetic puts it — on a
      // corner, or hard against a card. The longest run is the one stretch
      // guaranteed to have room to write.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "s", skipped: true }, { id: "c" }),
      });
      const bypass = layout.edges.find((e) => e.bypass)!;
      const at = labelAnchor(bypass.points);
      // The arc's longest run is the horizontal it travels above the cards.
      const top = Math.min(...bypass.points.map((p) => p.y));
      expect(at.y).toBeCloseTo(top, 3);
      expect(at.x).toBeGreaterThan(bypass.points[0].x);
    });

    it("dims a terminal whose edges have not been reached", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b", connector: { state: "disabled" } }),
      });
      expect(connectorVisual(layout.connectors[0]).opacity).toBeLessThan(1);
    });

    it("counts the rings in the layout bounds", () => {
      // A ring straddles the border, so half of it hangs outside the box the
      // node reported. Left out, `fit` clipped the outer half of every
      // terminal on the leftmost card.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a" }, { id: "b" }),
        options: { padding: 2, ringSize: "xl" },
      });
      for (const c of layout.connectors) {
        expect(c.x - c.radius).toBeGreaterThanOrEqual(layout.offsetX);
        expect(c.y - c.radius).toBeGreaterThanOrEqual(layout.offsetY);
        expect(c.x + c.radius).toBeLessThanOrEqual(layout.width);
        expect(c.y + c.radius).toBeLessThanOrEqual(layout.height);
      }
    });

    it("terminates a child edge on the parent and the child", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", children: [{ id: "a1" }] }),
      });
      expect(layout.connectors.some((c) => c.nodeId === "a1")).toBe(true);
      expect(layout.connectors.some((c) => c.nodeId === "a")).toBe(true);
    });

    it("shares the parent terminal between all its children", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", children: [{ id: "a1" }, { id: "a2" }] }),
      });
      const onA = layout.connectors.filter((c) => c.nodeId === "a");
      expect(onA).toHaveLength(1);
      expect(onA[0].edgeIds).toHaveLength(2);
    });
  });

  describe("measurement", () => {
    it("derives the base height from the type it has to hold", () => {
      // Written down separately, the two drifted: the table said 64 while the
      // padding and line boxes it also declared came to 57.
      for (const size of CONTROL_SIZES) {
        const m = NODE_METRICS[size];
        expect(m.height).toBe(m.padding * 2 + m.titleLine + m.bodyLine);
      }
    });

    it("gives a title-and-subtitle card exactly the base height", () => {
      for (const size of CONTROL_SIZES) {
        const metrics = NODE_METRICS[size];
        const height = measureNode(
          { id: "a", title: "T", subtitle: "S" },
          { ...DEFAULT_LAYOUT_OPTIONS, metrics },
        );
        expect(height).toBe(metrics.height);
      }
    });

    it("keeps the glyph column from making a row shorter than the text", () => {
      const metrics = NODE_METRICS.md;
      const withGlyph = measureHeader(
        { id: "a", title: "T", subtitle: "S", icon: "Rocket" },
        metrics,
      );
      const without = measureHeader({ id: "a", title: "T", subtitle: "S" }, metrics);
      expect(withGlyph).toBeGreaterThanOrEqual(without);
    });

    it("grows for a description and for a progress bar", () => {
      const options = DEFAULT_LAYOUT_OPTIONS;
      const base = measureNode({ id: "a", title: "T", subtitle: "S" }, options);
      const described = measureNode(
        { id: "a", title: "T", subtitle: "S", description: "d" },
        options,
      );
      const barred = measureNode(
        { id: "a", title: "T", subtitle: "S", progress: 0.5 },
        options,
      );
      expect(described).toBeGreaterThan(base);
      expect(barred).toBeGreaterThan(base);
    });

    it("gives a node that declares a height exactly that", () => {
      // A caller-supplied body cannot be measured, so it says how much room it
      // needs and scrolls inside it.
      expect(
        measureNode({ id: "a", title: "T", height: 300 }, DEFAULT_LAYOUT_OPTIONS),
      ).toBe(300);
    });

    it("scales every part of the card with `size`, not just the box", () => {
      // `size` used to change the box while the renderers hardcoded a 10px
      // inset and `text-[13px]`, so an xs flow and an xl flow had identical
      // type and padding.
      const xs = NODE_METRICS.xs;
      const xl = NODE_METRICS.xl;
      for (const key of [
        "width",
        "padding",
        "title",
        "titleLine",
        "body",
        "bodyLine",
        "gap",
        "height",
      ] as const) {
        expect(xl[key]).toBeGreaterThan(xs[key]);
      }
    });

    it("keeps the glyph in the range where an icon and a spinner agree", () => {
      // A spinner replaces the icon in the same slot, so the row must not
      // shift when it does: CustomIcon and ProgressSpinner render the same px
      // only at xs / sm / md.
      for (const size of CONTROL_SIZES) {
        expect(["xs", "sm", "md"]).toContain(NODE_METRICS[size].glyphSize);
      }
    });
  });

  describe("items", () => {
    const withItems = (count: number, over = {}) => ({
      id: "a",
      title: "Card",
      items: Array.from({ length: count }, (_, i) => ({
        id: `i${i}`,
        title: `Item ${i}`,
      })),
      ...over,
    });

    it("grows the card for every visible row", () => {
      const one = layoutConnectionFlow({ nodes: flow(withItems(1)) });
      const two = layoutConnectionFlow({ nodes: flow(withItems(2)) });
      expect(two.nodes[0].height).toBeGreaterThan(one.nodes[0].height);
    });

    it("stops growing at the cap, and makes room for the button", () => {
      const two = layoutConnectionFlow({ nodes: flow(withItems(2)) });
      const nine = layoutConnectionFlow({ nodes: flow(withItems(9)) });
      // Seven more rows, but only the "show more" row's worth of height.
      const extra = nine.nodes[0].height - two.nodes[0].height;
      expect(extra).toBe(
        DEFAULT_LAYOUT_OPTIONS.metrics.itemGap +
          DEFAULT_LAYOUT_OPTIONS.metrics.moreRow,
      );
    });

    it("grows again when the node is expanded", () => {
      const collapsed = layoutConnectionFlow({ nodes: flow(withItems(6)) });
      const open = layoutConnectionFlow({
        nodes: flow(withItems(6)),
        expanded: new Set(["a"]),
      });
      expect(open.nodes[0].height).toBeGreaterThan(collapsed.nodes[0].height);
    });

    it("re-cuts the silhouette and the ports when a card expands", () => {
      // Expansion is a layout input precisely because it moves everything:
      // the card is taller, so its side port sits lower and its outline is a
      // different path.
      const nodes = flow(withItems(6), { id: "b" });
      const collapsed = layoutConnectionFlow({ nodes });
      const open = layoutConnectionFlow({ nodes, expanded: new Set(["a"]) });
      expect(open.nodes[0].outline).not.toEqual(collapsed.nodes[0].outline);
      const portY = (l: typeof collapsed) =>
        l.connectors.find((c) => c.nodeId === "a" && c.side === "right")!.y;
      expect(portY(open)).toBeGreaterThan(portY(collapsed));
    });

    it("honours a per-node cap over the flow's", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(withItems(6, { maxItems: 4 })),
        options: { maxVisibleItems: 1 },
      });
      expect(visibleItems(layout.nodes[0].node, {
        ...DEFAULT_LAYOUT_OPTIONS,
        maxVisibleItems: 1,
      }).items).toHaveLength(4);
    });

    it("adds bar height only for the items that draw one", () => {
      const plain = layoutConnectionFlow({ nodes: flow(withItems(2)) });
      const barred = layoutConnectionFlow({
        nodes: flow({
          id: "a",
          title: "Card",
          items: [
            { id: "i0", title: "a", progress: 0.5 },
            { id: "i1", title: "b" },
          ],
        }),
      });
      expect(barred.nodes[0].height - plain.nodes[0].height).toBe(
        DEFAULT_LAYOUT_OPTIONS.metrics.gap +
          DEFAULT_LAYOUT_OPTIONS.metrics.barHeight,
      );
    });

    it("costs no height for a spinner, which sits in the glyph slot", () => {
      const spun = layoutConnectionFlow({
        nodes: flow({
          id: "a",
          title: "Card",
          itemProgress: "spinner",
          items: [{ id: "i0", title: "a", progress: 0.5 }],
        }),
      });
      const plain = layoutConnectionFlow({
        nodes: flow({
          id: "a",
          title: "Card",
          itemProgress: "none",
          items: [{ id: "i0", title: "a", icon: "Rocket" }],
        }),
      });
      expect(spun.nodes[0].height).toBe(plain.nodes[0].height);
    });

    it("hands the glyph slot back to the icon at 100%", () => {
      const item = {
        id: "i",
        title: "Done",
        icon: "Rocket",
        progress: 1,
        progressType: "spinner" as const,
      };
      expect(itemGlyph(item, "bar")).toEqual({ kind: "icon", name: "Rocket" });
      expect(itemGlyph({ ...item, progress: 0.5 }, "bar").kind).toBe("spinner");
    });

    it("reserves the glyph column for the whole list or none of it", () => {
      const some = [
        { id: "a", title: "a", icon: "Rocket" },
        { id: "b", title: "b" },
      ];
      expect(itemsReserveGlyph(some, "bar")).toBe(true);
      expect(
        itemsReserveGlyph([{ id: "b", title: "b" }], "bar"),
      ).toBe(false);
    });
  });

  describe("scrolling", () => {
    it("caps a card at `maxHeight` and scrolls it", () => {
      const tall = {
        id: "a",
        title: "Card",
        items: Array.from({ length: 8 }, (_, i) => ({
          id: `i${i}`,
          title: `Item ${i}`,
        })),
        maxItems: 0,
        maxHeight: 90,
      };
      const layout = layoutConnectionFlow({ nodes: flow(tall) });
      expect(layout.nodes[0].height).toBe(90);
      expect(layout.nodes[0].scrollable).toBe(true);
    });

    it("does not scroll a card the cap never bit into", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", title: "T", subtitle: "S", maxHeight: 500 }),
      });
      expect(layout.nodes[0].scrollable).toBe(false);
    });

    it("scrolls a card that declared an exact height", () => {
      // A template cannot be measured, so a declared height is a promise the
      // content might exceed.
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", title: "T", height: 200 }),
      });
      expect(layout.nodes[0].height).toBe(200);
      expect(layout.nodes[0].scrollable).toBe(true);
    });

    it("lets `scrollable` be stated outright", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", title: "T", height: 200, scrollable: false }),
      });
      expect(layout.nodes[0].scrollable).toBe(false);
    });
  });

  describe("travelling dots", () => {
    it("gives every dot the same speed, whatever its route", () => {
      // A fixed duration made a short hop crawl while a long arc raced: the
      // two read as unrelated animations rather than as one flow.
      const short = dotTiming(100, 0, 1, 100, 100, 1);
      const long = dotTiming(400, 0, 1, 400, 100, 1);
      const travelOf = (t: typeof short, length: number) =>
        length / (t.cycle * t.arrival);
      expect(travelOf(short, 100)).toBeCloseTo(travelOf(long, 400), 6);
      expect(travelOf(short, 100)).toBeCloseTo(100, 6);
    });

    it("stacks one interval of delay per position in the round-robin", () => {
      const first = dotTiming(100, 0, 3, 100, 100, 0.5);
      const second = dotTiming(100, 1, 3, 100, 100, 0.5);
      const third = dotTiming(100, 2, 3, 100, 100, 0.5);
      expect(first.begin).toBe(-0);
      expect(second.begin).toBe(-0.5);
      expect(third.begin).toBe(-1);
      // One cycle covers the whole round, so each source emits once per slot.
      expect(first.cycle).toBe(1.5);
    });

    it("leaves a gap after the dot arrives", () => {
      const timing = dotTiming(100, 0, 4, 100, 100, 1);
      expect(timing.cycle).toBe(4);
      expect(timing.arrival).toBeCloseTo(0.25, 6);
    });

    it("stretches the cycle to fit the longest route in the round", () => {
      // Otherwise the group falls out of step with itself: derived per edge, a
      // round containing one long route gives each dot a different period.
      const long = dotTiming(1000, 0, 2, 1000, 100, 1);
      const short = dotTiming(200, 1, 2, 1000, 100, 1);
      expect(long.cycle).toBe(10);
      expect(short.cycle).toBe(10);
      // And the short one still moves at the same speed, arriving sooner.
      expect(long.arrival).toBe(1);
      expect(short.arrival).toBeCloseTo(0.2, 6);
    });

    it("numbers a source's animated edges in turn", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "b", kind: "parallel" },
          { id: "c", kind: "parallel" },
          { id: "d", kind: "parallel" },
        ),
      });
      const fan = layout.edges.filter((e) => e.fromId === "a" && e.animated);
      expect(fan.map((e) => e.emitIndex)).toEqual([0, 1, 2]);
      expect(fan.every((e) => e.emitCount === 3)).toBe(true);
    });

    it("gives a slot only to the edges that actually animate", () => {
      const layout = layoutConnectionFlow({
        animated: false,
        nodes: flow({ id: "a" }, { id: "b" }),
      });
      expect(layout.edges.every((e) => e.emitCount === 1)).toBe(true);
    });
  });

  describe("status", () => {
    it("picks the tone from the status when no tone is set", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a", status: "succeeded" },
          { id: "b", status: "failed" },
          { id: "c", status: "running" },
        ),
      });
      const toneOf = (id: string) =>
        layout.nodes.find((n) => n.id === id)!.tone;
      expect(toneOf("a")).toBe(STATUS_TONE.succeeded);
      expect(toneOf("b")).toBe(STATUS_TONE.failed);
      expect(toneOf("c")).toBe(STATUS_TONE.running);
    });

    it("lets an explicit tone override the status", () => {
      const layout = layoutConnectionFlow({
        nodes: flow({ id: "a", status: "failed", tone: "violet" }),
      });
      expect(layout.nodes[0].tone).toBe("violet");
    });

    it("falls back to neutral with neither", () => {
      const layout = layoutConnectionFlow({ nodes: flow({ id: "a" }) });
      expect(layout.nodes[0].tone).toBe("neutral");
    });

    it("has a tone for every status", () => {
      for (const status of CONNECTION_FLOW_STATUSES) {
        expect(TRUE_COLORS).toContain(STATUS_TONE[status]);
      }
    });

    it("gives a status a glyph so it is not signalled by colour alone", () => {
      // `pending` and `skipped` share a tone outright, so colour cannot be the
      // only difference between them.
      for (const status of CONNECTION_FLOW_STATUSES) {
        expect(nodeIcon({ id: "x", status })).toBe(STATUS_ICON[status]);
      }
      expect(STATUS_ICON.pending).not.toEqual(STATUS_ICON.skipped);
    });

    it("lets the node's own icon win over the status glyph", () => {
      expect(nodeIcon({ id: "x", status: "failed", icon: "Rocket" })).toBe(
        "Rocket",
      );
    });

    it("treats `running` as active and `skipped` as bypassed", () => {
      // Stated once instead of three times: a node that says it is running and
      // then has to also say `active: true` is a prop waiting to disagree.
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "s", status: "skipped" },
          { id: "c", status: "running" },
        ),
      });
      expect(layout.edges.some((e) => e.bypass)).toBe(true);
      expect(layoutIsAnimated(layout)).toBe(true);
    });

    it("lets an explicit `skipped: false` override the status", () => {
      const layout = layoutConnectionFlow({
        nodes: flow(
          { id: "a" },
          { id: "s", status: "skipped", skipped: false },
          { id: "c" },
        ),
      });
      expect(layout.edges.some((e) => e.bypass)).toBe(false);
    });
  });

  describe("node surfaces", () => {
    it("has a distinct surface for every shared variant", () => {
      // The card is painted from the same shade table `Panel` uses, so a flow
      // dropped into a page of cards is not the one surface that looks
      // different.
      const fills = SURFACE_VARIANTS.map(
        (variant) => getNodeSurface("blue", variant).fill,
      );
      expect(new Set(fills).size).toBeGreaterThan(1);
      for (const variant of SURFACE_VARIANTS) {
        expect(getNodeSurface("blue", variant).fill).toMatch(/^fill-/);
      }
    });

    it("carries the tone into the variants that are tinted", () => {
      for (const variant of ["subtle", "tonal", "glass", "simple"] as const) {
        expect(getNodeSurface("violet", variant).fill).toContain("violet");
      }
    });

    it("falls back rather than returning undefined for an unknown variant", () => {
      const surface = getNodeSurface(
        "blue",
        "nonsense" as unknown as (typeof SURFACE_VARIANTS)[number],
      );
      expect(surface.fill).toBeTruthy();
    });
  });

  describe("theme scales", () => {
    it("has a class set for every tone", () => {
      // The table this replaces had 21 entries in which `pink` was present but
      // is not a TrueColor, `neutral` was absent, and `slate` was remapped to
      // neutral by a switch whose every other branch returned its own input.
      for (const tone of TRUE_COLORS) {
        const classes = getToneClasses(tone);
        expect(classes.fill).toContain(`-${tone}-`);
        expect(classes.border).toContain(`-${tone}-`);
      }
    });

    it("keeps slate distinct from neutral", () => {
      expect(getToneClasses("slate").fill).not.toEqual(
        getToneClasses("neutral").fill,
      );
    });

    it("has a radius for every shared surface corner", () => {
      // Derived from SURFACE_CORNERS, so a member added to or removed from the
      // shared scale is a compile error rather than an undefined radius.
      for (const corner of SURFACE_CORNERS) {
        expect(typeof NODE_CORNER_RADIUS[corner]).toBe("number");
      }
    });
  });
});

import { describe, expect, it } from "vitest";
import { layoutTraceGraph, TraceHitIndex } from "../../../../common/traceGraph/model";
import { fitTrace, screenPoint, worldPoint, zoomTraceAt, traceNeedsFollow } from "../../../../common/traceGraph/camera";

const nodes = ["root", "a", "b", "join", "end"].map(id => ({ id }));
const edges = [["root", "a"], ["root", "b"], ["a", "join"], ["b", "join"], ["join", "end"]].map(([source, target]) => ({ id: `${source}:${target}`, source, target }));

describe("TraceGraph layout", () => {
  it("keeps a chain on one lane", () => {
    const scene = layoutTraceGraph(nodes.slice(0, 3), [{ id: "1", source: "root", target: "a" }, { id: "2", source: "a", target: "b" }]);
    expect(new Set(scene.nodes.map(node => node.y)).size).toBe(1);
    expect(scene.nodes.map(node => node.x)).toEqual([0, 112, 224]);
  });
  it("separates forks and returns a merge to the original lane", () => {
    const scene = layoutTraceGraph(nodes, edges);
    expect(scene.byId.get("a")!.y).not.toBe(scene.byId.get("b")!.y);
    expect(scene.byId.get("join")!.y).toBe(scene.byId.get("root")!.y);
    expect(scene.byId.get("join")!.x).toBeGreaterThan(scene.byId.get("a")!.x);
    expect(scene.edges).toHaveLength(5);
  });
  it("keeps existing nodes stable when events append", () => {
    const first = layoutTraceGraph(nodes.slice(0, 4), edges.slice(0, 4));
    const next = layoutTraceGraph(nodes, edges, "dependency", first);
    for (const node of first.nodes) expect(next.byId.get(node.id)).toMatchObject({ x: node.x, y: node.y });
  });
  it("sorts timeline points by time/order with deterministic ties", () => {
    const scene = layoutTraceGraph([{ id: "later", time: 20 }, { id: "early", time: 10 }, { id: "same", time: 20 }], [], "timeline");
    expect(scene.nodes.map(node => node.id)).toEqual(["early", "later", "same"]);
  });
  it("reports malformed data and renders valid connections without throwing", () => {
    const scene = layoutTraceGraph([...nodes, { id: "root" }], [...edges, edges[0], { id: "missing", source: "root", target: "unknown" }]);
    expect(scene.diagnostics.map(item => item.kind)).toEqual(["duplicate-node", "duplicate-edge", "missing-endpoint"]);
    expect(scene.nodes).toHaveLength(5); expect(scene.edges).toHaveLength(5);
  });
  it("falls back deterministically for cycles and draws a back edge", () => {
    const cyclic = [{ id: "1", source: "a", target: "b" }, { id: "2", source: "b", target: "a" }];
    const a = layoutTraceGraph([{ id: "a" }, { id: "b" }], cyclic);
    const b = layoutTraceGraph([{ id: "a" }, { id: "b" }], cyclic);
    expect(a.nodes).toEqual(b.nodes);
    expect(a.diagnostics.some(item => item.kind === "cycle")).toBe(true);
    expect(a.edges.some(edge => edge.back)).toBe(true);
  });
  it("hits nodes before edges and curves between endpoints", () => {
    const scene = layoutTraceGraph(nodes, edges), index = new TraceHitIndex(scene);
    expect(index.pick(scene.nodes[0], 10).node?.id).toBe("root");
    const point = scene.edges[0].points[12];
    expect(index.pick(point, 10).edge?.id).toBe("root:a");
    expect(index.pick({ x: -10000, y: -10000 }, 10)).toEqual({ edge: undefined });
  });
  it("handles thousands of points with no dropped connections", () => {
    const many = Array.from({ length: 2800 }, (_, i) => ({ id: String(i) }));
    const links = many.slice(1).map((node, i) => ({ id: String(i), source: String(i), target: node.id }));
    const scene = layoutTraceGraph(many, links);
    expect(scene.nodes).toHaveLength(2800); expect(scene.edges).toHaveLength(2799);
    expect(new TraceHitIndex(scene).pick(scene.nodes[2000], 12).node?.id).toBe("2000");
  });
});

describe("TraceGraph camera", () => {
  it("preserves the world point under pointer-centered zoom", () => {
    const before = { x: 40, y: 80, zoom: .5 }, pointer = { x: 300, y: 100 };
    const after = zoomTraceAt(before, pointer, 2);
    expect(worldPoint(pointer, before)).toEqual(worldPoint(pointer, after));
    expect(screenPoint(worldPoint(pointer, before), before)).toEqual(pointer);
  });
  it("frames parallel active points with padding and bounded zoom", () => {
    const points = [{ x: 0, y: -100 }, { x: 500, y: 200 }];
    const view = fitTrace(points, 800, 400, .02, 2, 50);
    for (const point of points) {
      const p = screenPoint(point, view);
      expect(p.x).toBeGreaterThanOrEqual(50); expect(p.x).toBeLessThanOrEqual(750);
      expect(p.y).toBeGreaterThanOrEqual(50); expect(p.y).toBeLessThanOrEqual(350);
    }
    expect(view.zoom).toBeLessThanOrEqual(2);
  });
  it("holds position for empty and in-safe-zone frontiers", () => {
    const view = { x: 400, y: 200, zoom: 1 };
    expect(traceNeedsFollow([], view, 800, 400)).toBe(false);
    expect(traceNeedsFollow([{ x: 10, y: 5 }], view, 800, 400)).toBe(false);
    expect(traceNeedsFollow([{ x: 500, y: 0 }], view, 800, 400)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import {
  buildNetwork,
  findNetworkPath,
  fitNetwork,
  pickNode,
  zoomAt,
} from "./model";

const nodes = [
  { id: "a", x: -40, y: 0 },
  { id: "b", x: 40, y: 0 },
  { id: "c", community: "inferred" },
];
const edges = [
  { id: "ab", source: "a", target: "b" },
  { id: "bc", source: "b", target: "c" },
];

describe("NetworkGraph model", () => {
  it("keeps caller data immutable and generates deterministic finite positions", () => {
    const input = Object.freeze(nodes.map((n) => Object.freeze({ ...n })));
    const a = buildNetwork(input, Object.freeze(edges));
    expect(a.nodes).toEqual(buildNetwork(input, edges).nodes);
    expect(a.byId.get("a")).toMatchObject({ x: -40, y: 0 });
    expect(
      a.nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y)),
    ).toBe(true);
    expect(a.groups).toEqual([{ id: "inferred", label: "inferred" }]);
    expect(input[2].x).toBeUndefined();
  });
  it("uses first IDs, ignores dangling links, normalizes invalid positions and radii", () => {
    const graph = buildNetwork(
      [
        ...nodes,
        { id: "a", x: 999, y: 999 },
        { id: "bad", x: Infinity, y: NaN, radius: -4 },
      ],
      [...edges, edges[0], { id: "missing", source: "a", target: "absent" }],
    );
    expect(graph.nodes).toHaveLength(4);
    expect(graph.edges).toHaveLength(2);
    expect(graph.byId.get("a")?.x).toBe(-40);
    expect(graph.byId.get("bad")?.radius).toBe(1);
    expect(Number.isFinite(graph.byId.get("bad")?.x)).toBe(true);
  });
  it("finds shortest paths in either direction and handles cycles and disconnections", () => {
    const graph = [
      ...edges,
      { id: "ca", source: "c", target: "a" },
      { id: "self", source: "a", target: "a" },
    ];
    expect(findNetworkPath(edges, "a", "c")).toEqual(["ab", "bc"]);
    expect(findNetworkPath(edges, "c", "a")).toEqual(["bc", "ab"]);
    expect(findNetworkPath(graph, "a", "c")).toEqual(["ca"]);
    expect(findNetworkPath(graph, "a", "missing")).toEqual([]);
    expect(findNetworkPath(graph, "a", "a")).toEqual([]);
  });
  it("fits all node bounds into the viewport", () => {
    const graph = buildNetwork(nodes, edges);
    const view = fitNetwork(graph.nodes, 640, 360);
    for (const node of graph.nodes) {
      expect(
        (node.x - node.radius) * view.zoom + view.x,
      ).toBeGreaterThanOrEqual(31);
      expect((node.x + node.radius) * view.zoom + view.x).toBeLessThanOrEqual(
        609,
      );
      expect(
        (node.y - node.radius) * view.zoom + view.y,
      ).toBeGreaterThanOrEqual(31);
      expect((node.y + node.radius) * view.zoom + view.y).toBeLessThanOrEqual(
        329,
      );
    }
    expect(fitNetwork([], 640, 360)).toEqual({ x: 320, y: 180, zoom: 1 });
  });
  it("keeps the world point under the zoom anchor fixed and clamps zoom", () => {
    const view = { x: 30, y: 20, zoom: 2 };
    const next = zoomAt(view, 1.25, 100, 80);
    expect((100 - next.x) / next.zoom).toBe((100 - view.x) / view.zoom);
    expect((80 - next.y) / next.zoom).toBe((80 - view.y) / view.zoom);
    expect(zoomAt(view, 100, 0, 0).zoom).toBe(8);
    expect(zoomAt(view, 0.0001, 0, 0).zoom).toBe(0.05);
  });
  it("picks only visible nearby nodes, across spatial bucket boundaries", () => {
    const graph = buildNetwork(
      [
        { id: "a", x: 63, y: -1 },
        { id: "b", x: 70, y: -1 },
      ],
      [],
    );
    expect(pickNode(graph, new Set(["a", "b"]), 65, -1, 1)?.id).toBe("a");
    expect(pickNode(graph, new Set(["b"]), 65, -1, 1)?.id).toBe("b");
    expect(pickNode(graph, new Set(), 65, -1, 1)).toBeUndefined();
    expect(pickNode(graph, new Set(["a"]), 300, 300, 1)).toBeUndefined();
  });
});

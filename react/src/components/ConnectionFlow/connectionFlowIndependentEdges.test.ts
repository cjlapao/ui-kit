import { describe, expect, it } from "vitest";
import {
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTOR_RING_RADIUS,
  layoutConnectionFlow,
  parallelOverlap,
  segmentsCrossBoxes,
  type ConnectionFlowNode,
} from "../../connectionFlow";

const nodes: ConnectionFlowNode[] = [
  { id: "release", title: "Release", height: 88 },
  { id: "mac", title: "Mac", kind: "parallel", group: "matrix", height: 120 },
  {
    id: "windows",
    title: "Windows",
    kind: "parallel",
    group: "matrix",
    height: 120,
  },
  {
    id: "docker",
    title: "Docker",
    kind: "parallel",
    group: "matrix",
    height: 120,
  },
  {
    id: "staging",
    group: "deploy",
    title: "Staging",
    kind: "parallel",
    height: 88,
    connector: { label: "on main" },
  },
  {
    id: "announce",
    title: "Announce",
    kind: "parallel",
    group: "deploy",
    height: 104,
  },
];

describe("independent ConnectionFlow edges", () => {
  it("retains each connection's ring size and state after splitting terminals", () => {
    const layout = layoutConnectionFlow({
      nodes: [
        { id: "a", height: 104 },
        {
          id: "b",
          kind: "parallel",
          connector: { ringSize: "sm", state: "disabled" },
        },
        {
          id: "c",
          kind: "parallel",
          connector: { ringSize: "lg", state: "flowing" },
        },
      ],
    });
    for (const edge of layout.edges) {
      const terminals = layout.connectors.filter(
        (c) => c.edgeIds[0] === edge.id,
      );
      const radius =
        edge.toId === "b" ? CONNECTOR_RING_RADIUS.sm : CONNECTOR_RING_RADIUS.lg;
      expect(terminals).toHaveLength(2);
      expect(
        terminals.every((c) => c.radius === radius && c.state === edge.state),
      ).toBe(true);
    }
  });
  it.each(CONNECTION_FLOW_EDGE_STYLES)(
    "grows only the row seam carrying an overflow terminal (%s)",
    (edgeStyle) => {
      const layout = layoutConnectionFlow({
        nodes: nodes.map((node) => node.id === "staging"
          ? { ...node, height: 75 }
          : node),
        options: { edgeStyle },
      });
      const staging = layout.nodes.find((n) => n.id === "staging")!;
      const announce = layout.nodes.find((n) => n.id === "announce")!;
      const bottom = layout.connectors.find((c) =>
        c.nodeId === "staging" && c.side === "bottom",
      );
      expect(bottom).toBeDefined();
      expect(announce.y - staging.y - staging.height).toBeGreaterThanOrEqual(48);
      const mac = layout.nodes.find((n) => n.id === "mac")!;
      const windows = layout.nodes.find((n) => n.id === "windows")!;
      const docker = layout.nodes.find((n) => n.id === "docker")!;
      expect(windows.y - mac.y - mac.height).toBe(16);
      expect(docker.y - windows.y - windows.height).toBe(16);
      for (const edge of layout.edges)
        expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
      // Allocation and the subsequent reflow are deterministic.
      const repeated = layoutConnectionFlow({
        nodes: nodes.map((node) => node.id === "staging"
          ? { ...node, height: 75 }
          : node),
        options: { edgeStyle },
      });
      expect(repeated).toEqual(layout);
    },
  );
  it("reserves vertical connector room at explicit row boundaries without changing the requested minimum", () => {
    const options = { rowGap: 20 };
    const layout = layoutConnectionFlow({
      nodes: [{
        id: "parent", childLayout: "chain",
        rows: [
          [{ id: "a", height: 48 }, { id: "b", height: 48 }],
          [{ id: "c", height: 48 }],
          [{ id: "d", height: 48 }],
        ],
      }],
      options,
    });
    const node = (id: string) => layout.nodes.find((n) => n.id === id)!;
    for (const [above, below] of [["parent", "a"], ["b", "c"], ["c", "d"]])
      expect(node(below).y - node(above).y - node(above).height)
        .toBeGreaterThanOrEqual(48);
    expect(node("a").y).toBe(node("b").y);
    expect(options.rowGap).toBe(20);
    for (const edge of layout.edges)
      expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
  });
  for (const edgeStyle of CONNECTION_FLOW_EDGE_STYLES)
    it(`allocates independent terminals and corridors for ${edgeStyle} fans`, () => {
      const layout = layoutConnectionFlow({ nodes, options: { edgeStyle } });
      expect(layout.edges).toHaveLength(9);
      expect(layout.connectors).toHaveLength(layout.edges.length * 2);
      for (const connector of layout.connectors)
        expect(connector.edgeIds).toHaveLength(1);
      for (const node of layout.nodes) {
        const anchors = layout.connectors.filter((c) => c.nodeId === node.id);
        expect(new Set(anchors.map((c) => `${c.x}:${c.y}`)).size).toBe(
          anchors.length,
        );
      }
      for (const edge of layout.edges) {
        expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(
          false,
        );
        for (const nodeId of [edge.fromId, edge.toId])
          expect(
            layout.connectors.filter(
              (c) => c.nodeId === nodeId && c.edgeIds[0] === edge.id,
            ),
          ).toHaveLength(1);
      }
      for (let i = 0; i < layout.edges.length; i++)
        for (let j = i + 1; j < layout.edges.length; j++)
          expect(
            parallelOverlap(layout.edges[i].points, layout.edges[j].points, 24),
            `${layout.edges[i].id} / ${layout.edges[j].id}`,
          ).toBeLessThanOrEqual(1);
      const matrix = layout.nodes.filter((n) =>
        ["mac", "windows", "docker"].includes(n.id),
      );
      const deploy = layout.nodes.filter((n) =>
        ["staging", "announce"].includes(n.id),
      );
      expect(
        Math.min(...deploy.map((n) => n.x)) -
          Math.max(...matrix.map((n) => n.x + n.width)),
      ).toBeCloseTo(48 + 5 * 24);
    });
});

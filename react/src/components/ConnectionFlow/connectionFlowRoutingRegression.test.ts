import { describe, expect, it } from "vitest";
import {
  DEFAULT_LAYOUT_OPTIONS,
  layoutConnectionFlow,
  parallelOverlap,
  routeBetween,
  segmentsCrossBoxes,
  type ConnectionFlowNode,
} from "../../connectionFlow";

const retries = (height = 88): ConnectionFlowNode[] => [
  { id: "implement", title: "Implement", height },
  { id: "offer-review", title: "Offer review", height: 88 },
  {
    id: "review",
    title: "Inline review",
    height: 88,
    failure: { to: "implement" },
  },
  { id: "offer-security", title: "Offer security", height: 88 },
  {
    id: "security",
    title: "Security",
    height: 88,
    failure: { to: "implement" },
  },
];

describe("retry routing regressions", () => {
  it("keeps adjacent handoffs in their gap and never travels through either endpoint card", () => {
    const layout = layoutConnectionFlow({ nodes: retries() });
    for (const edge of layout.edges) {
      expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(
        false,
      );
      if (edge.branchKind === "failure") continue;
      const from = layout.nodes.find((n) => n.id === edge.fromId)!;
      const to = layout.nodes.find((n) => n.id === edge.toId)!;
      for (const point of edge.points) {
        expect(point.x, edge.id).toBeGreaterThanOrEqual(from.x + from.width);
        expect(point.x, edge.id).toBeLessThanOrEqual(to.x);
      }
    }
  });
  it("puts unrelated returns on separate lanes instead of drawing over another route", () => {
    const layout = layoutConnectionFlow({ nodes: retries() });
    for (let i = 0; i < layout.edges.length; i++)
      for (let j = i + 1; j < layout.edges.length; j++) {
        expect(
          parallelOverlap(layout.edges[i].points, layout.edges[j].points),
          `${layout.edges[i].id} / ${layout.edges[j].id}`,
        ).toBeLessThanOrEqual(1);
      }
    const arrivals = layout.connectors.filter((c) => c.nodeId === "implement");
    expect(arrivals.every((c) => c.edgeIds.length === 1)).toBe(true);
  });
  it("moves overflow anchors to an adjacent side, away from corners and one another", () => {
    const layout = layoutConnectionFlow({ nodes: retries(48) });
    const target = layout.nodes.find((n) => n.id === "implement")!;
    const anchors = layout.connectors.filter((c) => c.nodeId === target.id);
    expect(anchors.filter((c) => c.side === "right")).toHaveLength(1);
    expect(anchors.some((c) => c.side === "top" || c.side === "bottom")).toBe(
      true,
    );
    for (const a of anchors) {
      const vertical = a.side === "left" || a.side === "right";
      const coordinate = vertical ? a.y : a.x;
      const start = vertical ? target.y : target.x;
      const length = vertical ? target.height : target.width;
      expect(coordinate).toBeGreaterThanOrEqual(
        start + a.radius + DEFAULT_LAYOUT_OPTIONS.nodeCornerRadius,
      );
      expect(coordinate).toBeLessThanOrEqual(
        start + length - a.radius - DEFAULT_LAYOUT_OPTIONS.nodeCornerRadius,
      );
      if (!vertical) expect(a.x).toBeGreaterThan(target.x + target.width / 2);
      for (const b of anchors)
        if (a !== b && a.side === b.side)
          expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(
            a.radius + b.radius + 6,
          );
    }
    for (const edge of layout.edges)
      expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(
        false,
      );
  });
  it("keeps retry captions on outer lanes without detouring normal handoffs or merging returns", () => {
    const fixture = retries(104);
    fixture[2].failure!.label = "Implement · retry";
    fixture[4].failure!.label = "Implement · retry";
    const layout = layoutConnectionFlow({ nodes: fixture });
    for (const edge of layout.edges) {
      if (edge.branchKind !== "failure") {
        const from = layout.nodes.find((n) => n.id === edge.fromId)!,
          to = layout.nodes.find((n) => n.id === edge.toId)!;
        const endpoints = [
          edge.points[0].y,
          edge.points[edge.points.length - 1].y,
        ];
        for (const point of edge.points) {
          expect(point.x).toBeGreaterThanOrEqual(from.x + from.width);
          expect(point.x).toBeLessThanOrEqual(to.x);
          expect(point.y).toBeGreaterThanOrEqual(Math.min(...endpoints));
          expect(point.y).toBeLessThanOrEqual(Math.max(...endpoints));
        }
      }
      if (edge.caption)
        for (const node of layout.nodes)
          expect(
            edge.caption.y + edge.caption.height <= node.y ||
              edge.caption.y >= node.y + node.height ||
              edge.caption.x + edge.caption.width <= node.x ||
              edge.caption.x >= node.x + node.width,
          ).toBe(true);
    }
    const returns = layout.edges.filter((e) => e.branchKind === "failure");
    expect(returns.every((e) => e.caption)).toBe(true);
    expect(
      parallelOverlap(returns[0].points, returns[1].points),
    ).toBeLessThanOrEqual(1);
  });
  it("retains exact endpoint stubs next to corridor coordinates less than a pixel away", () => {
    const from = { x: 400, y: 0, width: 100, height: 100 };
    const to = { x: 0, y: 0, width: 100, height: 100 };
    const route = routeBetween(
      { box: from, t: 0.5, sides: ["left"] },
      { box: to, t: 0.51, sides: ["right"] },
      [from, to],
      {
        style: "orthogonal",
        occupied: [
          [
            { x: 120, y: 50.5 },
            { x: 380, y: 50.5 },
          ],
        ],
      },
    );
    expect(route).not.toBeNull();
    expect(route!.points[0].y).toBe(50);
    expect(route!.points[route!.points.length - 1].y).toBe(51);
    expect(segmentsCrossBoxes(route!.points, [from, to])).toBe(false);
  });
});

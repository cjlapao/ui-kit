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
  it("does not widen the ladder-to-QA gap for QA's upstream retry label", () => {
    const layout = layoutConnectionFlow({ nodes: [
      { id: "plan", title: "Plan" },
      { id: "build", title: "Build", childLayout: "chain", rows: [
        [{ id: "code", title: "Code" }, { id: "scan", title: "Scan deps" }],
        [{ id: "merge", title: "Merge code" }],
      ] },
      { id: "qa", title: "QA", failure: { to: "plan", label: "max 2 · then escalate" } },
    ] });
    const right = Math.max(...layout.nodes.filter(n => ["build", "code", "scan", "merge"].includes(n.id)).map(n => n.x + n.width));
    const qa = layout.nodes.find(n => n.id === "qa")!;
    expect(qa.x - right).toBe(DEFAULT_LAYOUT_OPTIONS.connectorWidth);
    for (const edge of layout.edges) expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
    expect(layout.edges.find(e => e.branchKind === "failure")?.caption).toBeDefined();
  });
  it("does not reserve a retry caption in the scan-to-review ladder seam", () => {
    const layout = layoutConnectionFlow({ nodes: [
      { id: "build", title: "Build", childLayout: "chain", rows: [
        [{ id: "create-code", title: "Create code" }, { id: "unit-tests", title: "Unit tests" }],
        [{ id: "lint", title: "Lint" }],
        [{ id: "secure-code", title: "Secure code" }, { id: "scan-deps", title: "Scan deps" }],
        [{ id: "review-code", title: "Review code", failure: { to: "create-code", label: "max 2 · retry" } }],
        [{ id: "merge-code", title: "Merge code" }],
      ] },
      { id: "qa", title: "QA" },
    ] });
    const scan = layout.nodes.find(n => n.id === "scan-deps")!;
    const review = layout.nodes.find(n => n.id === "review-code")!;
    expect(review.y - scan.y - scan.height).toBeLessThanOrEqual(80);
    for (const edge of layout.edges) expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
    expect(layout.edges.find(e => e.branchKind === "failure")?.caption).toBeDefined();
  });
  it("keeps independent labelled retries compact instead of stacking global outer lanes", () => {
    const nodes: ConnectionFlowNode[] = [];
    for (let i = 0; i < 4; i++) nodes.push(
      { id: `task-${i}`, title: "Task", height: 120 },
      { id: `gate-${i}`, title: "Approval", height: 120, failure: { to: `task-${i}`, label: "plan · max 2 · then escalate" } },
    );
    const layout = layoutConnectionFlow({ nodes });
    const top = Math.min(...layout.nodes.map(n => n.y));
    const bottom = Math.max(...layout.nodes.map(n => n.y + n.height));
    for (const edge of layout.edges) {
      expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
      if (edge.branchKind !== "failure") continue;
      expect(edge.caption, edge.id).toBeDefined();
      for (const p of edge.points) {
        expect(p.y, edge.id).toBeGreaterThanOrEqual(top - 100);
        expect(p.y, edge.id).toBeLessThanOrEqual(bottom + 100);
      }
    }
  });
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

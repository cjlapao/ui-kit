import {
  port,
  routeBetween,
  routePolyline,
  routePorts,
  segmentsCrossBoxes,
  parallelOverlap,
  routingLaneSpacing,
} from "./router";
import type { PortSide } from "./router";
import { CONNECTOR_RING_RADIUS, connectorDotRadius } from "./types";
import type {
  ConnectionFlowLayoutOptions,
  LaidOutConnector,
  LaidOutEdge,
  LaidOutNode,
} from "./types";

/** Allocate one terminal per edge endpoint. Overflow uses the nearest free side;
 * each route reserves its own lane, including fan-in and fan-out connections. */
export function separateAnchors(
  nodes: LaidOutNode[],
  edges: LaidOutEdge[],
  connectors: Map<string, LaidOutConnector>,
  options: ConnectionFlowLayoutOptions,
) {
  const laneSpacing = routingLaneSpacing(
    options.pathClearance,
    options.cornerRadius,
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  const moved = new Set<string>();
  const groupsByNode = new Map<string, LaidOutConnector[]>();
  for (const original of connectors.values()) {
    const groups = new Map<string, LaidOutEdge[]>();
    for (const id of original.edgeIds) {
      const e = edgeById.get(id);
      if (!e) continue;
      const key = e.id;
      const group = groups.get(key) ?? [];
      group.push(e);
      groups.set(key, group);
    }
    const list = groupsByNode.get(original.nodeId) ?? [];
    [...groups.values()].forEach((group, index) => {
      const first = group[0];
      list.push({
        ...original,
        id: groups.size === 1 ? original.id : `${original.id}:anchor-${index}`,
        edgeIds: group.map((e) => e.id),
        radius:
          CONNECTOR_RING_RADIUS[
            first.ringSize ?? (first.kind === "branch"
              ? undefined
              : byId.get(first.toId)?.node.connector?.ringSize) ??
              options.ringSize
          ],
        tone:
          first.fromId === original.nodeId
            ? first.sourceTone
            : first.targetTone,
        active: group.some((e) => e.animated),
        state: group.some((e) => e.state === "flowing")
          ? "flowing"
          : group.some((e) => e.state === "stopped")
            ? "stopped"
            : "disabled",
      });
    });
    groupsByNode.set(original.nodeId, list);
  }
  connectors.clear();
  const sides: PortSide[] = ["left", "right", "top", "bottom"];
  for (const [nodeId, groups] of groupsByNode) {
    const node = byId.get(nodeId)!;
    const radius = Math.max(...groups.map((g) => g.radius)),
      spacing = Math.max(radius * 2 + 6, laneSpacing);
    const inset = radius + options.nodeCornerRadius;
    const capacity = (side: PortSide) =>
      Math.max(
        0,
        Math.floor(
          ((side === "left" || side === "right" ? node.height : node.width) -
            2 * inset) /
            spacing,
        ) + 1,
      );
    const assigned = new Map<PortSide, LaidOutConnector[]>();
    // Normal handoffs get first choice; overflow retries move around them.
    groups.sort(
      (a, b) =>
        Number(edgeById.get(a.edgeIds[0])?.branchKind === "failure") -
        Number(edgeById.get(b.edgeIds[0])?.branchKind === "failure"),
    );
    for (const group of groups) {
      const originalSide = group.side;
      const e = edgeById.get(group.edgeIds[0])!;
      const remote =
        byId.get((e.fromId === nodeId ? e.toId : e.fromId) ?? "") ?? node;
      const candidates = sides.filter(
        (side) => (assigned.get(side)?.length ?? 0) < capacity(side),
      );
      const score = (side: PortSide) => {
        if (side === originalSide) return -1e9;
        const p = port(node, side);
        const vx = remote.x + remote.width / 2 - p.x,
          vy = remote.y + remote.height / 2 - p.y;
        const opposite =
          (side === "left" && originalSide === "right") ||
          (side === "right" && originalSide === "left") ||
          (side === "top" && originalSide === "bottom") ||
          (side === "bottom" && originalSide === "top");
        return (
          Math.hypot(vx, vy) +
          Math.max(0, -(p.dx * vx + p.dy * vy)) +
          (opposite ? node.width + node.height : 0)
        );
      };
      candidates.sort((a, b) => score(a) - score(b));
      group.side = candidates[0] ?? originalSide;
      if (group.side !== originalSide)
        for (const id of group.edgeIds) moved.add(id);
      const list = assigned.get(group.side) ?? [];
      list.push(group);
      assigned.set(group.side, list);
    }
    for (const [side, list] of assigned) {
      const vertical = side === "left" || side === "right";
      const start = vertical ? node.y : node.x,
        length = vertical ? node.height : node.width;
      const min = start + Math.min(inset, length / 2),
        max = start + length - Math.min(inset, length / 2);
      const values = list
        .map((c) => (vertical ? c.y : c.x))
        .sort((a, b) => a - b);
      const keep = values.every(
        (v, i) => v >= min && v <= max && (!i || v - values[i - 1] >= spacing),
      );
      const span = spacing * (list.length - 1);
      const preferred =
        list.reduce((sum, c) => sum + (vertical ? c.y : c.x), 0) / list.length;
      const center = Math.max(
        min + span / 2,
        Math.min(max - span / 2, preferred),
      );
      list.forEach((c, index) => {
        const p = port(node, side);
        const at = keep
          ? vertical
            ? c.y
            : c.x
          : center - span / 2 + index * spacing;
        const x = vertical ? p.x : at,
          y = vertical ? at : p.y;
        if (x !== c.x || y !== c.y) for (const id of c.edgeIds) moved.add(id);
        c.x = x;
        c.y = y;
        connectors.set(c.id, c);
      });
    }
  }
  const endpoints = new Map<
    string,
    { from?: LaidOutConnector; to?: LaidOutConnector }
  >();
  for (const c of connectors.values())
    for (const id of c.edgeIds) {
      const e = edgeById.get(id)!;
      const pair = endpoints.get(id) ?? {};
      if (e.fromId === c.nodeId) pair.from = c;
      else pair.to = c;
      endpoints.set(id, pair);
    }
  const accepted: LaidOutEdge[] = [];
  for (const edge of edges) {
    const { from, to } = endpoints.get(edge.id) ?? {};
    if (!from || !to) {
      accepted.push(edge);
      continue;
    }
    const fromNode = byId.get(from.nodeId)!,
      toNode = byId.get(to.nodeId)!;
    const fromPort = { ...port(fromNode, from.side), x: from.x, y: from.y },
      toPort = { ...port(toNode, to.side), x: to.x, y: to.y };
    const style = edge.style ?? options.edgeStyle;
    const settings = {
      style,
      radius: options.cornerRadius,
      stub: Math.min(18, options.connectorWidth / 3),
      trim: connectorDotRadius(from.radius),
      clearance: options.pathClearance,
      laneSpacing,
    };
    const occupied = accepted.map((e) => e.points);
    let candidate = { points: edge.points, d: edge.d };
    if (moved.has(edge.id)) {
      // Try the simple local handoff first. The grid search must not turn a
      // small anchor offset into a detour around either endpoint card.
      candidate = routePorts(fromPort, toPort, settings);
      if (segmentsCrossBoxes(candidate.points, nodes)) {
        const points = edge.points.map((p) => ({ ...p }));
        if (points.length >= 4) {
          for (const [c, end] of [
            [from, false],
            [to, true],
          ] as const) {
            const i = end ? points.length - 1 : 0,
              j = end ? i - 1 : 1;
            if (c.side === "left" || c.side === "right") {
              points[i].y = c.y;
              points[j].y = c.y;
              points[i].x =
                c.x + port(byId.get(c.nodeId)!, c.side).dx * settings.trim;
            } else {
              points[i].x = c.x;
              points[j].x = c.x;
              points[i].y =
                c.y + port(byId.get(c.nodeId)!, c.side).dy * settings.trim;
            }
          }
          if (
            points.every(
              (p, i) =>
                !i || p.x === points[i - 1].x || p.y === points[i - 1].y,
            ) &&
            !segmentsCrossBoxes(points, nodes)
          )
            candidate = routePolyline(points, style, options.cornerRadius);
        }
      }
    }
    const overlap = (points: LaidOutEdge["points"]) =>
      occupied.reduce(
        (sum, p) => sum + parallelOverlap(points, p, laneSpacing) +
          100 * parallelOverlap(points, p),
        0,
      );
    if (
      segmentsCrossBoxes(candidate.points, nodes) ||
      overlap(candidate.points) > 1
    ) {
      const fraction = (n: LaidOutNode, c: LaidOutConnector) =>
        c.side === "left" || c.side === "right"
          ? (c.y - n.y) / n.height
          : (c.x - n.x) / n.width;
      const route = routeBetween(
        { box: fromNode, t: fraction(fromNode, from), sides: [from.side] },
        { box: toNode, t: fraction(toNode, to), sides: [to.side] },
        nodes,
        { ...settings, occupied },
      );
      if (
        route &&
        !segmentsCrossBoxes(route.points, nodes) &&
        (segmentsCrossBoxes(candidate.points, nodes) ||
          overlap(route.points) < overlap(candidate.points))
      )
        candidate = route;
    }
    Object.assign(edge, candidate);
    accepted.push(edge);
  }
}

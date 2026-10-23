import type {
  NetworkGraphCommunity,
  NetworkGraphEdge,
  NetworkGraphNode,
  NetworkGraphViewport,
} from "./types";

export interface PositionedNode extends NetworkGraphNode {
  x: number;
  y: number;
  radius: number;
}
export interface ResolvedEdge extends NetworkGraphEdge {
  from: PositionedNode;
  to: PositionedNode;
}
const CELL = 64;
const cellKey = (x: number, y: number) =>
  `${Math.floor(x / CELL)},${Math.floor(y / CELL)}`;

/** Deterministic O(nodes + edges) placement. Never mutates caller data. */
export function buildNetwork(
  nodes: readonly NetworkGraphNode[],
  edges: readonly NetworkGraphEdge[],
  communities: readonly NetworkGraphCommunity[] = [],
) {
  const groups = new Map(communities.map((c) => [c.id, c]));
  for (const n of nodes)
    if (n.community && !groups.has(n.community))
      groups.set(n.community, { id: n.community, label: n.community });
  const groupIds = [...groups.keys()];
  const groupIndexes = new Map(groupIds.map((id, i) => [id, i]));
  const offsets = new Map<string, number>();
  const byId = new Map<string, PositionedNode>();
  const buckets = new Map<string, PositionedNode[]>();
  const clusterDistance =
    groupIds.length > 1 ? Math.max(160, Math.sqrt(nodes.length) * 12) : 0;
  for (const node of nodes) {
    if (byId.has(node.id)) continue;
    const group = node.community ?? "";
    const index = offsets.get(group) ?? 0;
    offsets.set(group, index + 1);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const clusterAngle =
      ((groupIndexes.get(group) ?? 0) / Math.max(1, groupIds.length)) *
      Math.PI *
      2;
    const distance = Math.sqrt(index) * 16;
    const positioned: PositionedNode = {
      ...node,
      x:
        Number.isFinite(node.x) && Number.isFinite(node.y)
          ? node.x!
          : Math.cos(clusterAngle) * clusterDistance +
            Math.cos(angle) * distance,
      y:
        Number.isFinite(node.x) && Number.isFinite(node.y)
          ? node.y!
          : Math.sin(clusterAngle) * clusterDistance +
            Math.sin(angle) * distance,
      radius: Number.isFinite(node.radius)
        ? Math.max(1, Math.min(40, node.radius!))
        : 4,
    };
    byId.set(node.id, positioned);
    const key = cellKey(positioned.x, positioned.y);
    const bucket = buckets.get(key) ?? [];
    bucket.push(positioned);
    buckets.set(key, bucket);
  }
  const edgeIds = new Set<string>();
  const links: ResolvedEdge[] = [];
  const adjacency = new Map<string, Set<string>>();
  for (const edge of edges) {
    const from = byId.get(edge.source),
      to = byId.get(edge.target);
    if (!from || !to || edgeIds.has(edge.id)) continue;
    edgeIds.add(edge.id);
    links.push({ ...edge, from, to });
    for (const [a, b] of [
      [from.id, to.id],
      [to.id, from.id],
    ]) {
      const neighbors = adjacency.get(a) ?? new Set<string>();
      neighbors.add(b);
      adjacency.set(a, neighbors);
    }
  }
  return {
    nodes: [...byId.values()],
    edges: links,
    byId,
    groups: [...groups.values()],
    adjacency,
    buckets,
  };
}
export type NetworkModel = ReturnType<typeof buildNetwork>;
export const clampZoom = (zoom: number) => Math.max(0.05, Math.min(8, zoom));
export function zoomAt(
  view: NetworkGraphViewport,
  factor: number,
  x: number,
  y: number,
): NetworkGraphViewport {
  const zoom = clampZoom(view.zoom * factor);
  const ratio = zoom / view.zoom;
  return { x: x - (x - view.x) * ratio, y: y - (y - view.y) * ratio, zoom };
}
export function fitNetwork(
  nodes: readonly PositionedNode[],
  width: number,
  height: number,
): NetworkGraphViewport {
  if (!nodes.length) return { x: width / 2, y: height / 2, zoom: 1 };
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x - n.radius);
    maxX = Math.max(maxX, n.x + n.radius);
    minY = Math.min(minY, n.y - n.radius);
    maxY = Math.max(maxY, n.y + n.radius);
  }
  const zoom = clampZoom(
    Math.min(
      Math.max(1, width - 64) / Math.max(1, maxX - minX),
      Math.max(1, height - 64) / Math.max(1, maxY - minY),
      2,
    ),
  );
  return {
    x: width / 2 - ((minX + maxX) / 2) * zoom,
    y: height / 2 - ((minY + maxY) / 2) * zoom,
    zoom,
  };
}
export function pickNode(
  model: NetworkModel,
  visible: ReadonlySet<string>,
  x: number,
  y: number,
  zoom: number,
) {
  const reach = Math.max(40, 8 / zoom);
  let best: PositionedNode | undefined,
    bestDistance = Infinity;
  for (
    let cx = Math.floor((x - reach) / CELL);
    cx <= Math.floor((x + reach) / CELL);
    cx++
  ) {
    for (
      let cy = Math.floor((y - reach) / CELL);
      cy <= Math.floor((y + reach) / CELL);
      cy++
    ) {
      for (const node of model.buckets.get(`${cx},${cy}`) ?? []) {
        if (!visible.has(node.id)) continue;
        const distance = Math.hypot(node.x - x, node.y - y);
        if (
          distance <= Math.max(node.radius, 8 / zoom) &&
          distance < bestDistance
        ) {
          best = node;
          bestDistance = distance;
        }
      }
    }
  }
  return best;
}
/** Returns edge IDs along the shortest unweighted, undirected path, or [] when disconnected. */
export function findNetworkPath(
  edges: readonly NetworkGraphEdge[],
  source: string,
  target: string,
): string[] {
  const adjacency = new Map<string, { node: string; edge: string }[]>();
  for (const edge of edges)
    for (const [a, b] of [
      [edge.source, edge.target],
      [edge.target, edge.source],
    ]) {
      const list = adjacency.get(a) ?? [];
      list.push({ node: b, edge: edge.id });
      adjacency.set(a, list);
    }
  const visited = new Map<string, { node: string; edge: string }>();
  const queue = [source];
  const seen = new Set(queue);
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    if (node === target) {
      const path: string[] = [];
      let current = target;
      while (current !== source) {
        const previous = visited.get(current)!;
        path.push(previous.edge);
        current = previous.node;
      }
      return path.reverse();
    }
    for (const next of adjacency.get(node) ?? [])
      if (!seen.has(next.node)) {
        seen.add(next.node);
        visited.set(next.node, { node, edge: next.edge });
        queue.push(next.node);
      }
  }
  return [];
}

export type TraceGraphLayout = "timeline" | "dependency";
export type TraceGraphStatus = "idle" | "running" | "done" | "error" | "blocked";
export interface TraceGraphNode {
  id: string;
  label?: string;
  time?: number;
  order?: number;
  lane?: string;
  status?: TraceGraphStatus;
  tone?: string;
  metadata?: unknown;
}
export interface TraceGraphEdge {
  id: string;
  source: string;
  target: string;
  status?: TraceGraphStatus;
  tone?: string;
  metadata?: unknown;
}
export interface TracePoint { x: number; y: number }
export interface TracePositionedNode extends TraceGraphNode, TracePoint {}
export interface TracePositionedEdge extends TraceGraphEdge {
  points: TracePoint[];
  back: boolean;
}
export interface TraceDiagnostic { kind: "duplicate-node" | "duplicate-edge" | "missing-endpoint" | "cycle"; id: string }
export interface TraceScene {
  nodes: TracePositionedNode[];
  edges: TracePositionedEdge[];
  byId: Map<string, TracePositionedNode>;
  neighbors: Map<string, Set<string>>;
  diagnostics: TraceDiagnostic[];
}

export function traceCurve(from: TracePoint, to: TracePoint, back = false): TracePoint[] {
  const reach = Math.max(36, Math.abs(to.x - from.x) * 0.5);
  const c1 = back ? { x: from.x + reach, y: Math.min(from.y, to.y) - 70 } : { x: from.x + reach, y: from.y };
  const c2 = back ? { x: to.x - reach, y: Math.min(from.y, to.y) - 70 } : { x: to.x - reach, y: to.y };
  return Array.from({ length: 25 }, (_, i) => {
    const t = i / 24, s = 1 - t;
    return { x: s ** 3 * from.x + 3 * s * s * t * c1.x + 3 * s * t * t * c2.x + t ** 3 * to.x,
      y: s ** 3 * from.y + 3 * s * s * t * c1.y + 3 * s * t * t * c2.y + t ** 3 * to.y };
  });
}

/** Deterministic lanes, preserving previous positions during append updates. */
export function layoutTraceGraph(nodes: readonly TraceGraphNode[], edges: readonly TraceGraphEdge[], mode: TraceGraphLayout = "dependency", previous?: TraceScene): TraceScene {
  const diagnostics: TraceDiagnostic[] = [];
  const input = new Map<string, TraceGraphNode>();
  for (const node of nodes) {
    if (input.has(node.id)) diagnostics.push({ kind: "duplicate-node", id: node.id });
    else input.set(node.id, node);
  }
  const incoming = new Map<string, string[]>(), outgoing = new Map<string, string[]>();
  const neighbors = new Map<string, Set<string>>();
  for (const id of input.keys()) { incoming.set(id, []); outgoing.set(id, []); neighbors.set(id, new Set()); }
  const valid: TraceGraphEdge[] = [], ids = new Set<string>();
  for (const edge of edges) {
    if (ids.has(edge.id)) { diagnostics.push({ kind: "duplicate-edge", id: edge.id }); continue; }
    ids.add(edge.id);
    if (!input.has(edge.source) || !input.has(edge.target)) { diagnostics.push({ kind: "missing-endpoint", id: edge.id }); continue; }
    valid.push(edge); incoming.get(edge.target)!.push(edge.source); outgoing.get(edge.source)!.push(edge.target);
    neighbors.get(edge.source)!.add(edge.target); neighbors.get(edge.target)!.add(edge.source);
  }
  const degree = new Map([...incoming].map(([id, parents]) => [id, parents.length]));
  const queue = [...input.keys()].filter(id => degree.get(id) === 0), sorted: string[] = [];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i]; sorted.push(id);
    for (const child of outgoing.get(id)!) {
      degree.set(child, degree.get(child)! - 1);
      if (degree.get(child) === 0) queue.push(child);
    }
  }
  const seen = new Set(sorted);
  for (const id of input.keys()) if (!seen.has(id)) { sorted.push(id); diagnostics.push({ kind: "cycle", id }); }
  const inputOrder = new Map(nodes.map((node, index) => [node.id, index]));
  if (mode === "timeline") sorted.sort((a, b) => {
    const na = input.get(a)!, nb = input.get(b)!;
    return (na.time ?? na.order ?? inputOrder.get(a)!) - (nb.time ?? nb.order ?? inputOrder.get(b)!);
  });
  const depths = new Map<string, number>(), byId = new Map<string, TracePositionedNode>();
  const columns = new Map<number, Set<number>>(), groups = new Map<string, number>();
  for (const node of input.values()) if (node.lane && !groups.has(node.lane)) groups.set(node.lane, groups.size);
  let rootLane = 0;
  sorted.forEach((id, i) => {
    const node = input.get(id)!;
    const parents = incoming.get(id)!.map(p => byId.get(p)).filter((p): p is TracePositionedNode => !!p);
    const depth = mode === "timeline" ? i : parents.length ? Math.max(...parents.map(p => depths.get(p.id)!)) + 1 : 0;
    depths.set(id, depth);
    const used = columns.get(depth) ?? new Set<number>();
    let lane = node.lane ? groups.get(node.lane)! : previous?.byId.get(id)?.y !== undefined
      ? previous.byId.get(id)!.y / 72 : parents.length ? Math.min(...parents.map(p => p.y / 72)) : rootLane++;
    const preferred = lane;
    for (let j = 1; used.has(lane); j++) lane = preferred + (j % 2 ? Math.ceil(j / 2) : -j / 2);
    used.add(lane); columns.set(depth, used);
    // Timeline ranks preserve stable spacing; time/order determine ordering,
    // not proportional wall-clock distances (idle gaps do not dwarf activity).
    byId.set(id, { ...node, x: depth * 112, y: lane * 72 });
  });
  return { nodes: [...byId.values()], byId, neighbors, diagnostics,
    edges: valid.map(edge => {
      const from = byId.get(edge.source)!, to = byId.get(edge.target)!;
      const back = to.x <= from.x;
      return { ...edge, back, points: traceCurve(from, to, back) };
    }) };
}

/** Coarse world-space buckets, independent of zoom and rendering technology. */
export class TraceHitIndex {
  private nodes = new Map<string, TracePositionedNode[]>();
  private segments = new Map<string, { edge: TracePositionedEdge; a: TracePoint; b: TracePoint }[]>();
  constructor(scene: TraceScene) {
    for (const node of scene.nodes) {
      const key = this.key(node.x, node.y), bucket = this.nodes.get(key) ?? [];
      bucket.push(node); this.nodes.set(key, bucket);
    }
    for (const edge of scene.edges) for (let i = 1; i < edge.points.length; i++) {
      const a = edge.points[i - 1], b = edge.points[i];
      for (let x = Math.floor(Math.min(a.x, b.x) / 128); x <= Math.floor(Math.max(a.x, b.x) / 128); x++)
        for (let y = Math.floor(Math.min(a.y, b.y) / 128); y <= Math.floor(Math.max(a.y, b.y) / 128); y++) {
          const key = `${x},${y}`, bucket = this.segments.get(key) ?? [];
          bucket.push({ edge, a, b }); this.segments.set(key, bucket);
        }
    }
  }
  private key(x: number, y: number) { return `${Math.floor(x / 128)},${Math.floor(y / 128)}`; }
  pick(point: TracePoint, radius: number): { node?: TracePositionedNode; edge?: TracePositionedEdge } {
    // Keep queries bounded when zoomed far out; nearby points still win.
    const r = Math.min(radius, 256);
    let best = r, node: TracePositionedNode | undefined, edge: TracePositionedEdge | undefined;
    for (let x = Math.floor((point.x - r) / 128); x <= Math.floor((point.x + r) / 128); x++)
      for (let y = Math.floor((point.y - r) / 128); y <= Math.floor((point.y + r) / 128); y++) {
        for (const candidate of this.nodes.get(`${x},${y}`) ?? []) {
          const d = Math.hypot(candidate.x - point.x, candidate.y - point.y);
          if (d <= best) { best = d; node = candidate; }
        }
      }
    if (node) return { node };
    best = r * 0.5;
    for (const segment of this.segments.get(this.key(point.x, point.y)) ?? []) {
      const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
      const t = Math.max(0, Math.min(1, ((point.x - segment.a.x) * dx + (point.y - segment.a.y) * dy) / (dx * dx + dy * dy || 1)));
      const distance = Math.hypot(point.x - segment.a.x - t * dx, point.y - segment.a.y - t * dy);
      if (distance < best) { best = distance; edge = segment.edge; }
    }
    return { edge };
  }
}

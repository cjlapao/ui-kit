import {
  port,
  PORT_NORMALS,
  parallelOverlap,
  routingLaneSpacing,
  routeBetween,
  routePolyline,
  routePorts,
  routeLength,
  segmentsCrossBoxes,
  type Box,
} from "./router";
import {
  connectorDotRadius,
  type ConnectionFlowLayoutOptions,
  type LaidOutConnector,
  type LaidOutEdge,
  type LaidOutNode,
} from "./types";

const PADDING = 8;
const MARGIN = 12;
const LINE_HEIGHT = 14;
// Rounded corners consume part of their approach. Reserve twice the stub:
// the router uses half the distance to an obstacle as its safe departure run.
const captionStub = (options: ConnectionFlowLayoutOptions) =>
  18 + options.cornerRadius;
const captionEscape = (options: ConnectionFlowLayoutOptions) =>
  2 * captionStub(options) + MARGIN;
/** Conservative glyph advances at the renderer's fixed 10px font size. */
export const captionTextWidth = (text: string) =>
  Array.from(text).reduce(
    (sum, c) =>
      sum +
      ((c.codePointAt(0) ?? 0) >= 0x2e80
        ? 12
        : /[MW@%]/.test(c)
          ? 9
          : /[ilI.,'!:;| ]/.test(c)
            ? 3.5
            : 6.8),
    0,
  );

export function wrapCaption(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const paragraph of text.split(/\r?\n/u)) {
    for (const word of paragraph.split(/\s+/u).filter(Boolean)) {
      if (line && captionTextWidth(`${line} ${word}`) <= width) {
        line += ` ${word}`;
        continue;
      }
      if (line) {
        lines.push(line);
        line = "";
      }
      for (const character of word) {
        if (line && captionTextWidth(line + character) > width) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    lines.push(line);
    line = "";
  }
  return lines.length ? lines : [""];
}
const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;
const inflate = (b: Box, by = 6): Box => ({
  x: b.x - by,
  y: b.y - by,
  width: b.width + 2 * by,
  height: b.height + 2 * by,
});

/** Captions own real corridor area, not a rectangle painted over the board.
 * Place labelled routes in order, reserve their bounds, then route unlabelled
 * paths around them. Previously placed captions never move under a later edge.
 */
export function layoutCaptions(
  nodes: LaidOutNode[],
  edges: LaidOutEdge[],
  connectors: Map<string, LaidOutConnector>,
  options: ConnectionFlowLayoutOptions,
) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const endpoints = new Map<
    string,
    { from?: LaidOutConnector; to?: LaidOutConnector }
  >();
  for (const c of connectors.values())
    for (const id of c.edgeIds) {
      const e = edges.find((e) => e.id === id);
      if (!e) continue;
      const pair = endpoints.get(id) ?? {};
      if (e.fromId === c.nodeId) pair.from = c;
      else pair.to = c;
      endpoints.set(id, pair);
    }
  const reserved: Box[] = [];
  const labelled: LaidOutEdge[] = [];
  const settings = (edge: LaidOutEdge) => ({
    strictObstacles: true,
    style: edge.style ?? options.edgeStyle,
    radius: options.cornerRadius,
    stub: captionStub(options),
    trim: connectorDotRadius(endpoints.get(edge.id)?.from?.radius ?? 6),
    clearance: options.pathClearance,
  });
  const escapes: Box[] = [...connectors.values()].map((c) => {
    const { dx, dy } = PORT_NORMALS[c.side];
    const length = captionEscape(options) + connectorDotRadius(c.radius);
    return {
      x: Math.min(c.x, c.x + dx * length) - 1,
      y: Math.min(c.y, c.y + dy * length) - 1,
      width: Math.abs(dx * length) + 2,
      height: Math.abs(dy * length) + 2,
    };
  });
  const endpoint = (c: LaidOutConnector) => {
    const box = byId.get(c.nodeId)!;
    return {
      box,
      t:
        c.side === "left" || c.side === "right"
          ? (c.y - box.y) / box.height
          : (c.x - box.x) / box.width,
      sides: [c.side],
    };
  };
  const avoid = (edge: LaidOutEdge, boxes: Box[]) => {
    const occupied = edges
      .filter((other) => other !== edge)
      .map((other) => other.points);
    const score = (points: LaidOutEdge["points"]) =>
      occupied.reduce(
        (sum, path) => sum + parallelOverlap(
          points, path,
          routingLaneSpacing(options.pathClearance, options.cornerRadius),
        ) + 100 * parallelOverlap(points, path),
        0,
      );
    const blocked = segmentsCrossBoxes(edge.points, boxes);
    if (!blocked && score(edge.points) <= 1) return;
    const { from, to } = endpoints.get(edge.id) ?? {};
    if (!from || !to) return;
    const route = routeBetween(
      endpoint(from),
      endpoint(to),
      [...nodes, ...boxes],
      {
        ...settings(edge),
        occupied,
      },
    );
    if (
      route &&
      !segmentsCrossBoxes(route.points, [...nodes, ...boxes]) &&
      (blocked || score(route.points) < score(edge.points))
    )
      Object.assign(edge, { points: route.points, d: route.d });
  };
  const measure = (text: string, width: number, x: number, y: number) => {
    const lines = wrapCaption(text, Math.max(10, width - 2 * PADDING));
    const measuredWidth = Math.min(
      width,
      Math.max(...lines.map(captionTextWidth)) + 2 * PADDING,
    );
    const height = lines.length * LINE_HEIGHT + PADDING;
    return {
      x: x - measuredWidth / 2,
      y: y - height / 2,
      width: measuredWidth,
      height,
      lines,
      lineHeight: LINE_HEIGHT,
    };
  };
  for (const edge of edges) {
    if (!edge.label) continue;
    const pair = endpoints.get(edge.id);
    if (
      pair?.from &&
      pair.to &&
      (pair.from.side === "left" || pair.from.side === "right") &&
      (pair.to.side === "left" || pair.to.side === "right") &&
      pair.from.side !== pair.to.side
    ) {
      const from = {
        ...port(byId.get(pair.from.nodeId)!, pair.from.side),
        x: pair.from.x,
        y: pair.from.y,
      };
      const to = {
        ...port(byId.get(pair.to.nodeId)!, pair.to.side),
        x: pair.to.x,
        y: pair.to.y,
      };
      const local = routePorts(from, to, {
        ...settings(edge),
        via: {
          x: to.x + to.dx * (captionEscape(options) + settings(edge).trim + 8),
        },
      });
      if (!segmentsCrossBoxes(local.points, [...nodes, ...reserved]))
        Object.assign(edge, local);
    }
    avoid(edge, reserved);
    const text = edge.label;
    let captionDetour = false;
    const readableWidth = Math.max(
      64,
      Math.min(96, Math.max(...text.split(/\s+/u).map(captionTextWidth))) + 16,
    );
    const candidates: {
      x: number;
      y: number;
      width: number;
      length: number;
      segment: number;
      vertical: boolean;
    }[] = [];
    for (let i = 1; i < edge.points.length; i++) {
      const a = edge.points[i - 1],
        b = edge.points[i];
      const startMargin = i === 1 ? captionEscape(options) + 6 : MARGIN;
      const endMargin =
        i === edge.points.length - 1 ? captionEscape(options) + 6 : MARGIN;
      const available = Math.abs(b.x - a.x) - startMargin - endMargin;
      if (a.y === b.y && available >= 32)
        candidates.push({
          x:
            (a.x + b.x + Math.sign(b.x - a.x) * (startMargin - endMargin)) /
            2,
          y: a.y,
          width: Math.min(240, available),
          length: Math.abs(b.x - a.x),
          segment: i - 1,
          vertical: false,
        });
      else if (
        a.x === b.x &&
        Math.abs(b.y - a.y) >= 2 * MARGIN + LINE_HEIGHT + PADDING
      )
        for (const width of [160, 112, 80, 48, 32])
          candidates.push({
            x: a.x,
            y: (a.y + b.y) / 2,
            width,
            length: Math.abs(b.y - a.y),
            segment: i - 1,
            vertical: true,
          });
    }
    candidates.sort((a, b) => b.length - a.length);
    const protectedPaths = edges.filter(
      (other) =>
        other !== edge && other.branchKind !== "failure" && !other.label,
    );
    for (const candidate of candidates) {
      if (candidate.width < readableWidth) continue;
      const base = measure(text, candidate.width, candidate.x, candidate.y);
      const canMove =
        !candidate.vertical &&
        candidate.segment > 0 &&
        candidate.segment < edge.points.length - 2;
      const middle =
        nodes.reduce((sum, n) => sum + n.y + n.height / 2, 0) /
        Math.max(1, nodes.length);
      const direction = candidate.y >= middle ? 1 : -1;
      const offsets = [0];
      const stride = Math.max(4, options.pathClearance);
      if (canMove)
        for (
          let step = 1;
          step <=
          Math.ceil(
            (base.height + Math.max(...nodes.map((n) => n.height))) / stride,
          ) +
            2;
          step++
        )
          offsets.push(direction * step * stride, -direction * step * stride);
      for (const offset of offsets) {
        const caption = { ...base, y: base.y + offset };
        if (
          candidate.vertical &&
          caption.height > candidate.length - 2 * MARGIN
        )
          continue;
        if (
          nodes.some((n) => intersects(inflate(caption), n)) ||
          escapes.some((b) => intersects(inflate(caption), b)) ||
          reserved.some((b) => intersects(inflate(caption), b))
        )
          continue;
        if (
          [...labelled, ...protectedPaths].some((e) =>
            segmentsCrossBoxes(e.points, [inflate(caption)]),
          )
        )
          continue;
        const points = edge.points.map((p) => ({ ...p }));
        if (offset) {
          points[candidate.segment].y += offset;
          points[candidate.segment + 1].y += offset;
        }
        if (segmentsCrossBoxes(points, [...nodes, ...reserved])) continue;
        edge.caption = caption;
        captionDetour = offset !== 0;
        if (offset)
          Object.assign(
            edge,
            routePolyline(points, settings(edge).style, options.cornerRadius),
          );
        break;
      }
      if (edge.caption) break;
    }
    if (!edge.caption || captionDetour) {
      // Reserve a readable horizontal caption instead of wrapping into a tall
      // label just because the normal connector gap is narrow.
      const caption = measure(
        text,
        Math.min(240, Math.max(96, captionTextWidth(text) + PADDING * 2)),
        0,
        0,
      );
      const { from, to } = endpoints.get(edge.id) ?? {};
      if (from && to) {
        const center = (from.x + to.x) / 2;
        const left = center - caption.width / 2 - MARGIN,
          right = center + caption.width / 2 + MARGIN;
        // Only obstacles in this route's horizontal span affect its outer
        // corridor. Unrelated loops must not keep lifting subsequent routes.
        const spanLeft = Math.min(from.x, to.x, left), spanRight = Math.max(from.x, to.x, right);
        const local = [...nodes, ...reserved].filter(b => b.x <= spanRight && b.x + b.width >= spanLeft);
        const gap = MARGIN + caption.height / 2 + options.pathClearance;
        const above = Math.min(from.y, to.y, ...local.map(b => b.y)) - gap;
        const below = Math.max(from.y, to.y, ...local.map(b => b.y + b.height)) + gap;
        let best: { points: LaidOutEdge["points"]; y: number; cost: number } | undefined;
        for (const top of [above, below]) {
          const forward = from.x <= to.x;
          const start = {
            x: forward ? left : right,
            y: top,
            width: 0,
            height: 0,
          };
          const end = { x: forward ? right : left, y: top, width: 0, height: 0 };
          const obstacles = [...nodes, ...reserved];
          const first = routeBetween(
            endpoint(from),
            { box: start, t: 0.5, sides: [forward ? "left" : "right"] },
            obstacles,
            { ...settings(edge), strictObstacles: true },
          );
          const last = routeBetween(
            { box: end, t: 0.5, sides: [forward ? "right" : "left"] },
            endpoint(to),
            obstacles,
            { ...settings(edge), strictObstacles: true },
          );
          if (first && last) {
            const points = [...first.points, ...last.points];
            const bounds = { ...caption, x: center - caption.width / 2, y: top - caption.height / 2 };
            if (!segmentsCrossBoxes(points, obstacles) &&
                !obstacles.some(b => intersects(inflate(bounds), b)) &&
                ![...labelled, ...protectedPaths].some(e => segmentsCrossBoxes(e.points, [inflate(bounds)]))) {
              const cost = routeLength(points) + points.length * options.cornerRadius;
              if (!best || cost < best.cost) best = { points, y: top, cost };
            }
          }
        }
        if (best && (!edge.caption || best.cost < routeLength(edge.points) + edge.points.length * options.cornerRadius)) {
          Object.assign(edge, routePolyline(best.points, settings(edge).style, options.cornerRadius));
          edge.caption = { ...caption, x: center - caption.width / 2, y: best.y - caption.height / 2 };
        }
      }
    }
    if (edge.caption) {
      reserved.push(inflate(edge.caption));
      labelled.push(edge);
    }
  }
  for (const edge of edges) if (!edge.label) avoid(edge, reserved);
}

/** Per-node seam budgets. A retry reserves the seam on the side of its
 * target; a normal connector reserves the seam before its destination. */
export function captionSpacing(
  nodes: readonly import("./types").ConnectionFlowNode[],
  options: ConnectionFlowLayoutOptions,
) {
  type Spacing = { horizontal: number; vertical: number };
  const before = new Map<string, Spacing>(),
    after = new Map<string, Spacing>();
  const all: import("./types").ConnectionFlowNode[] = [];
  const seen = new Set<string>();
  const visit = (n: import("./types").ConnectionFlowNode) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    all.push(n);
    for (const c of n.children ?? []) visit(c);
    for (const row of n.rows ?? []) for (const c of row) visit(c);
  };
  nodes.forEach(visit);
  const ranks = new Map(all.map((n, i) => [n.id, i]));
  const reserve = (
    map: Map<string, Spacing>,
    id: string,
    text: string | undefined,
  ) => {
    if (!text) return;
    const width = captionTextWidth(text);
    if (width <= Math.max(48, options.connectorWidth - 40)) return;
    // Grow smoothly with text length, retaining useful word wrapping.
    const budget = Math.min(
      240,
      Math.max(64, Math.sqrt(width * LINE_HEIGHT * 4)),
    );
    const old = map.get(id);
    map.set(id, {
      horizontal: Math.max(
        old?.horizontal ?? 0,
        budget + 2 * (captionEscape(options) + MARGIN),
      ),
      vertical: Math.max(
        old?.vertical ?? 0,
        wrapCaption(text, budget).length * LINE_HEIGHT +
          PADDING +
          2 * (captionEscape(options) + MARGIN),
      ),
    });
  };
  for (const n of all) {
    reserve(before, n.id, n.connector?.label);
    for (const branch of [n.success, n.failure])
      if (branch) {
        const upstream =
          branch.to !== undefined &&
          (ranks.get(branch.to) ?? Infinity) < (ranks.get(n.id) ?? 0);
        // Return captions own an outer routing corridor. Reserving either
        // seam before the source stretches unrelated handoffs (including
        // a ladder's exit to QA) without helping that return label fit.
        if (!upstream) reserve(after, n.id, branch.label);
      }
  }
  return { before, after };
}

import type { ConnectionFlowEdgeStyle } from "./types";

/**
 * Every edge in the graph is routed by this module and nothing else.
 *
 * The old code grew a bespoke point-list per edge kind — a mid-X elbow for the
 * main track, a hard-coded L for children, a four-point lift for bypasses — so
 * `edgeStyle: "curved"` curved the main track and left the children as square
 * elbows, and a bypass ignored the style entirely. Anything with its own
 * routing code is an edge style waiting to be forgotten.
 *
 * The model is two ports and a shape. A port is a point on a node's border
 * plus the direction a line must *leave* it in; the router turns any pair of
 * ports into a path in the requested style. Adding a style means adding one
 * branch here, and every edge in the graph gets it at once.
 */

export type PortSide = "top" | "right" | "bottom" | "left";

export interface Port {
  x: number;
  y: number;
  side: PortSide;
  /** Outward unit normal — the direction a line leaves this port in. */
  dx: number;
  dy: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The outward direction of each border, as a unit vector. */
export const PORT_NORMALS: Record<PortSide, { dx: number; dy: number }> = {
  top: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  bottom: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

/**
 * A point on one side of a box. `t` slides along that side from 0 to 1, which
 * is what lets a fan-out give each lane its own port instead of stacking every
 * line on the same pixel.
 */
export const port = (box: Box, side: PortSide, t = 0.5): Port => {
  const clamped = Math.min(1, Math.max(0, t));
  const { dx, dy } = PORT_NORMALS[side];
  switch (side) {
    case "top":
      return { x: box.x + box.width * clamped, y: box.y, side, dx, dy };
    case "bottom":
      return {
        x: box.x + box.width * clamped,
        y: box.y + box.height,
        side,
        dx,
        dy,
      };
    case "left":
      return { x: box.x, y: box.y + box.height * clamped, side, dx, dy };
    case "right":
      return {
        x: box.x + box.width,
        y: box.y + box.height * clamped,
        side,
        dx,
        dy,
      };
  }
};

/** A port at an absolute offset along a side rather than a fraction of it. */
export const portAt = (
  box: Box,
  side: PortSide,
  offset: number,
): Port => {
  const span = side === "top" || side === "bottom" ? box.width : box.height;
  return port(box, side, span === 0 ? 0.5 : offset / span);
};

const isHorizontal = (side: PortSide) => side === "left" || side === "right";

/**
 * Picks the pair of sides that gives the shortest, least-crossing route.
 *
 * Purely geometric: whichever axis the two boxes are actually separated on
 * wins, and the ports face each other across that gap. This is what makes a
 * child edge leave its parent's *bottom* and a track edge leave its *right*
 * without either being special-cased.
 */
export const selectSides = (
  source: Box,
  target: Box,
): { from: PortSide; to: PortSide } => {
  const gapRight = target.x - (source.x + source.width);
  const gapLeft = source.x - (target.x + target.width);
  const gapBelow = target.y - (source.y + source.height);
  const gapAbove = source.y - (target.y + target.height);

  const horizontalGap = Math.max(gapRight, gapLeft);
  const verticalGap = Math.max(gapBelow, gapAbove);

  // Separated on both axes: prefer the wider gap, so the line runs mostly
  // along the direction the nodes are actually apart in.
  if (horizontalGap >= verticalGap && horizontalGap > 0) {
    return gapRight >= gapLeft
      ? { from: "right", to: "left" }
      : { from: "left", to: "right" };
  }
  if (verticalGap > 0) {
    return gapBelow >= gapAbove
      ? { from: "bottom", to: "top" }
      : { from: "top", to: "bottom" };
  }
  // Overlapping boxes — fall back to the dominant centre-to-centre direction.
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { from: "right", to: "left" } : { from: "left", to: "right" };
  }
  return dy >= 0 ? { from: "bottom", to: "top" } : { from: "top", to: "bottom" };
};

export interface RouteOptions {
  style: ConnectionFlowEdgeStyle;
  /** How far a line runs straight out of a port before it may turn. */
  stub?: number;
  /** Corner radius on an orthogonal path. */
  radius?: number;
  /**
   * Forces the turn onto a specific coordinate — used by a bypass, which must
   * clear the cards it arches over rather than turning halfway.
   */
  via?: { x?: number; y?: number };
  /**
   * Stops the line this far short of each port, along that port's own normal.
   *
   * A terminal ring is drawn centred on the port, so an untrimmed line runs
   * under the ring and out the far side. Trimming here rather than in the
   * renderer keeps the travelling dots honest: they follow this same path, so
   * they stop where the line stops instead of sliding into the card.
   */
  trim?: number;
}

/**
 * Corner radius per style, given the layout's own.
 *
 * `curved` asks for an unbounded radius; `roundedPath` clamps each corner to
 * half of its shorter neighbouring segment, so "as round as it can be" needs
 * no second geometry — the same waypoints simply come out smooth.
 */
const CORNER: Record<ConnectionFlowEdgeStyle, (radius: number) => number> = {
  straight: () => 0,
  orthogonal: (radius) => radius,
  curved: () => Number.POSITIVE_INFINITY,
};

export interface Route {
  /** Waypoints, for label placement and measurement. */
  points: { x: number; y: number }[];
  /** The SVG path. Also what the travelling dots follow, so the dots and the
   *  line can never disagree about the route. */
  d: string;
}

const line = (points: { x: number; y: number }[]) =>
  points.map((p, i) => `${i === 0 ? "M" : "L"} ${round(p.x)} ${round(p.y)}`).join(" ");

const round = (n: number) => Math.round(n * 100) / 100;

/** Drops the middle point of any run of three collinear points. */
const simplify = (points: { x: number; y: number }[]) => {
  const out: { x: number; y: number }[] = [];
  for (const p of points) {
    const a = out[out.length - 2];
    const b = out[out.length - 1];
    if (a && b && ((a.x === b.x && b.x === p.x) || (a.y === b.y && b.y === p.y))) {
      out[out.length - 1] = p;
      continue;
    }
    if (b && b.x === p.x && b.y === p.y) continue;
    out.push(p);
  }
  return out;
};

/**
 * An orthogonal path with rounded corners.
 *
 * Emitted as a real path rather than a polyline because the travelling dots
 * follow the same string — a polyline with square corners and a rounded
 * stroke would put the dots on a different route from the line they are
 * meant to be on.
 */
const roundedPath = (points: { x: number; y: number }[], radius: number) => {
  if (points.length < 3) return line(points);
  const parts: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const outLen = Math.hypot(next.x - curr.x, next.y - curr.y);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    if (r <= 0.5) {
      parts.push(`L ${round(curr.x)} ${round(curr.y)}`);
      continue;
    }
    const inX = curr.x - ((curr.x - prev.x) / inLen) * r;
    const inY = curr.y - ((curr.y - prev.y) / inLen) * r;
    const outX = curr.x + ((next.x - curr.x) / outLen) * r;
    const outY = curr.y + ((next.y - curr.y) / outLen) * r;
    parts.push(`L ${round(inX)} ${round(inY)}`);
    parts.push(`Q ${round(curr.x)} ${round(curr.y)} ${round(outX)} ${round(outY)}`);
  }
  const last = points[points.length - 1];
  parts.push(`L ${round(last.x)} ${round(last.y)}`);
  return parts.join(" ");
};

/**
 * Routes one edge between two ports in the requested style.
 *
 * Every edge in the graph — track, child, fan and bypass alike — comes through
 * here, which is the whole point: `edgeStyle` cannot apply to some edges and
 * not others, because there is only one place that turns ports into a path.
 */
/** Slides a port along its own normal, away from the box it sits on. */
const retreat = (p: Port, by: number): Port =>
  by === 0 ? p : { ...p, x: p.x + p.dx * by, y: p.y + p.dy * by };

export const routePorts = (
  fromPort: Port,
  toPort: Port,
  options: RouteOptions,
): Route => {
  const { style, via } = options;
  const stub = options.stub ?? 18;
  const radius = options.radius ?? 8;
  const from = retreat(fromPort, options.trim ?? 0);
  const to = retreat(toPort, options.trim ?? 0);

  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  // A short edge gets a proportionally shorter stub, or the stubs overshoot
  // each other and the line doubles back on itself.
  const reach = Math.max(4, Math.min(stub, distance / 2));

  const fromStub = { x: from.x + from.dx * reach, y: from.y + from.dy * reach };
  const toStub = { x: to.x + to.dx * reach, y: to.y + to.dy * reach };

  // Every style routes the same way — out along each port's normal, then an
  // axis-aligned turn. `via` overrides where that turn happens, which is how a
  // bypass is made to clear the cards it arches over instead of turning at the
  // midpoint, and how a whole fan is made to share one spine.
  //
  // The styles differ only in how the corners are drawn. `straight` used to
  // mean a direct diagonal between the ports, which ignored `via` entirely —
  // so a bypass in that style cut a shallow line straight across the cards it
  // was supposed to be avoiding.
  const bothHorizontal = isHorizontal(from.side) && isHorizontal(to.side);
  const bothVertical = !isHorizontal(from.side) && !isHorizontal(to.side);

  // `via` names *which axis* the turn is on as well as where it sits. Left to
  // the port orientations alone, two side-by-side cards can only turn on x —
  // but a bypass leaves its source sideways like any other edge and then has
  // to turn *upward*, over the cards it is going around. That combination is
  // why the bypass used to need a routing path of its own.
  const axis =
    via?.y !== undefined
      ? "y"
      : via?.x !== undefined
        ? "x"
        : bothHorizontal
          ? "x"
          : bothVertical
            ? "y"
            : null;

  let waypoints: { x: number; y: number }[];

  if (axis === "x") {
    const turnX = via?.x ?? (fromStub.x + toStub.x) / 2;
    waypoints = [
      from,
      fromStub,
      { x: turnX, y: fromStub.y },
      { x: turnX, y: toStub.y },
      toStub,
      to,
    ];
  } else if (axis === "y") {
    const turnY = via?.y ?? (fromStub.y + toStub.y) / 2;
    waypoints = [
      from,
      fromStub,
      { x: fromStub.x, y: turnY },
      { x: toStub.x, y: turnY },
      toStub,
      to,
    ];
  } else if (isHorizontal(from.side)) {
    // Leaves sideways, arrives vertically: one corner.
    waypoints = [from, fromStub, { x: toStub.x, y: fromStub.y }, toStub, to];
  } else {
    // Leaves vertically, arrives sideways.
    waypoints = [from, fromStub, { x: fromStub.x, y: toStub.y }, toStub, to];
  }

  const points = simplify(waypoints);
  return { points, d: roundedPath(points, CORNER[style](radius)) };
};

/** Total length of a waypoint list. */
export const routeLength = (points: { x: number; y: number }[]): number => {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
};


/** A port the node's outline detours around. */
export interface OutlineBulge {
  side: PortSide;
  /** Position along that side: an x for top/bottom, a y for left/right. */
  at: number;
  radius: number;
}

/**
 * The node's outline: a rounded rectangle that detours around each of its
 * ports.
 *
 * The terminal is not a marker drawn on top of the card — it *is* the card,
 * bulging. So there is no chord across the bulge and its interior takes the
 * same fill as the rest of the node, which only works if the whole silhouette
 * is one path. A CSS border cannot do this, which is why the card is painted
 * here and the DOM element above it carries only content.
 *
 * Traversed clockwise, so every arc — corners and bulges alike — is a
 * sweep-1 turn.
 */
export const nodeOutline = (
  box: Box,
  cornerRadius: number,
  bulges: OutlineBulge[],
): string => {
  const { x, y, width: w, height: h } = box;
  const right = x + w;
  const bottom = y + h;

  // The corner tightens to make room for a bulge that lands near it, rather
  // than the bulge being dropped: a child port sits close to the bottom-left
  // corner by design, and a terminal that appears at some sizes and not
  // others is worse than a corner 2px sharper than asked for.
  let cr = Math.max(0, Math.min(cornerRadius, w / 2, h / 2));
  for (const bulge of bulges) {
    const [start, end] =
      bulge.side === "top" || bulge.side === "bottom" ? [x, right] : [y, bottom];
    const room =
      Math.min(bulge.at - start, end - bulge.at) - bulge.radius;
    cr = Math.min(cr, Math.max(0, room));
  }

  const on = (side: PortSide, descending = false) =>
    bulges
      .filter((b) => b.side === side && b.radius > 0)
      .sort((a, b) => (descending ? b.at - a.at : a.at - b.at));

  const parts: string[] = [`M ${round(x + cr)} ${round(y)}`];
  // A zero radius is a corner, not an arc — emitting `A 0 0 …` for a square
  // card leaves the path littered with no-ops.
  const arc = (r: number, tx: number, ty: number) =>
    parts.push(
      r > 0
        ? `A ${round(r)} ${round(r)} 0 0 1 ${round(tx)} ${round(ty)}`
        : `L ${round(tx)} ${round(ty)}`,
    );
  const to = (tx: number, ty: number) =>
    parts.push(`L ${round(tx)} ${round(ty)}`);

  on("top").forEach((b) => {
    to(b.at - b.radius, y);
    arc(b.radius, b.at + b.radius, y);
  });
  to(right - cr, y);
  arc(cr, right, y + cr);

  on("right").forEach((b) => {
    to(right, b.at - b.radius);
    arc(b.radius, right, b.at + b.radius);
  });
  to(right, bottom - cr);
  arc(cr, right - cr, bottom);

  on("bottom", true).forEach((b) => {
    to(b.at + b.radius, bottom);
    arc(b.radius, b.at - b.radius, bottom);
  });
  to(x + cr, bottom);
  arc(cr, x, bottom - cr);

  on("left", true).forEach((b) => {
    to(x, b.at + b.radius);
    arc(b.radius, x, b.at - b.radius);
  });
  to(x, y + cr);
  arc(cr, x + cr, y);

  parts.push("Z");
  return parts.join(" ");
};

/**
 * Where a caption sits on a route: the middle of its longest straight run.
 *
 * Halfway *along the route* lands wherever the arithmetic puts it — on a
 * corner, or hard against a card — because a route's midpoint has nothing to
 * do with where there is room to write. The longest run is the one stretch
 * guaranteed to have some.
 */
export const labelAnchor = (
  points: { x: number; y: number }[],
): { x: number; y: number } => {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];
  let best = 0;
  let bestLength = -1;
  for (let i = 1; i < points.length; i += 1) {
    const length = Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
    if (length > bestLength) {
      bestLength = length;
      best = i;
    }
  }
  return {
    x: (points[best - 1].x + points[best].x) / 2,
    y: (points[best - 1].y + points[best].y) / 2,
  };
};

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
export const portAt = (box: Box, side: PortSide, offset: number): Port => {
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
    return dx >= 0
      ? { from: "right", to: "left" }
      : { from: "left", to: "right" };
  }
  return dy >= 0
    ? { from: "bottom", to: "top" }
    : { from: "top", to: "bottom" };
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
  points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${round(p.x)} ${round(p.y)}`)
    .join(" ");

const round = (n: number) => Math.round(n * 100) / 100;

/** Drops the middle point of any run of three collinear points. */
const simplify = (points: { x: number; y: number }[]) => {
  const out: { x: number; y: number }[] = [];
  for (const p of points) {
    const a = out[out.length - 2];
    const b = out[out.length - 1];
    if (
      a &&
      b &&
      ((a.x === b.x && b.x === p.x) || (a.y === b.y && b.y === p.y))
    ) {
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
    parts.push(
      `Q ${round(curr.x)} ${round(curr.y)} ${round(outX)} ${round(outY)}`,
    );
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

/** Rebuild an existing corridor after moving a terminal along its side. */
export const routePolyline = (
  points: { x: number; y: number }[],
  style: ConnectionFlowEdgeStyle,
  radius: number,
): Route => ({ points, d: roundedPath(points, CORNER[style](radius)) });

/** Total length of a waypoint list. */
export const routeLength = (points: { x: number; y: number }[]): number => {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
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
      bulge.side === "top" || bulge.side === "bottom"
        ? [x, right]
        : [y, bottom];
    const room = Math.min(bulge.at - start, end - bulge.at) - bulge.radius;
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

// ── The path engine ────────────────────────────────────────────────────────
//
// `routePorts` turns two ports into a path without knowing where anything
// else is — which is exactly right for the edges the layout parks in
// corridors by construction, and exactly wrong for an edge asked to find its
// way back to a card upstream: the fixed single turn ran across whatever
// cards stood between. The engine below answers that question honestly:
// it routes around the cards.
//
// It is a deliberate second layer, not a replacement: callers first take the
// `routePorts` route, check it with `segmentsCrossBoxes`, and consult
// `routeBetween` only when that route touches something. Edges that already
// run through gaps therefore keep byte-identical output — the engine cannot
// change what was never broken, and cannot cost anything either.

/** One end of a route, with the card it must connect to. */
export interface PathEndpoint {
  box: Box;
  /**
   * The connection line, as a fraction along the side. Callers pass the
   * card's own `anchorY / height`; a side change simply slides the same
   * fraction along the new side.
   */
  t: number;
  /**
   * The visual idiom, as a preference: these sides get a bonus, never a
   * straitjacket — a card in the way always outranks the idiom.
   */
  preferSides?: PortSide[];
  /** Optional hard constraint for already allocated terminal sides. */
  sides?: PortSide[];
}

/**
 * Shared lane accounting. Every route the engine returns charges its grid
 * segments here, and later routes pay for reusing them — so two retry loops
 * into the same card stack stack themselves side by side on adjacent
 * clearance lines instead of drawing one line twice.
 */
export type LaneUse = Map<string, number>;
export const createLaneUse = (): LaneUse => new Map();

export interface PathOptions {
  /** Require all obstacle interiors to remain clear (caption corridor routing). */
  strictObstacles?: boolean;
  style: ConnectionFlowEdgeStyle;
  /** How far a line must run out of a port before it may turn. */
  stub?: number;
  radius?: number;
  trim?: number;
  /**
   * Obstacle inflation. A clean route passes at least this far outside every
   * card — sized for the terminal rings, so a route that clears the inflated
   * box also clears the bulges sticking out of the real one.
   */
  clearance?: number;
  /** Extra cost per change of direction. */
  bendPenalty?: number;
  /** Cost per px travelled inside an inflated card. Finite on purpose. */
  obstaclePenalty?: number;
  /** Cost per prior use of the same grid segment. */
  lanePenalty?: number;
  /** Score taken off for connecting on a preferred side. */
  preferBonus?: number;
  /** Shared across one layout run — see `createLaneUse`. */
  laneUse?: LaneUse;
  /** Minimum distance between parallel independent lanes. */
  laneSpacing?: number;
  /** Existing routes: charge crowding and expose adjacent lanes. */
  occupied?: readonly (readonly { x: number; y: number }[])[];
}

/** Minimum centre-to-centre lane distance, including room for a 6px hop. */
export const routingLaneSpacing = (clearance: number, cornerRadius: number) =>
  Math.max(16, clearance, 2 * cornerRadius + 8);

/** Length of parallel overlap within a lane; perpendicular crossings use bridges. */
export const parallelOverlap = (
  a: readonly { x: number; y: number }[],
  b: readonly { x: number; y: number }[],
  spacing = 0.01,
): number => {
  let total = 0;
  for (let i = 1; i < a.length; i++)
    for (let j = 1; j < b.length; j++) {
      const p = a[i - 1],
        q = a[i],
        r = b[j - 1],
        s = b[j];
      if (p.y === q.y && r.y === s.y && Math.abs(p.y - r.y) < spacing - 0.0001)
        total += Math.max(
          0,
          Math.min(Math.max(p.x, q.x), Math.max(r.x, s.x)) -
            Math.max(Math.min(p.x, q.x), Math.min(r.x, s.x)),
        );
      else if (p.x === q.x && r.x === s.x && Math.abs(p.x - r.x) < spacing - 0.0001)
        total += Math.max(
          0,
          Math.min(Math.max(p.y, q.y), Math.max(r.y, s.y)) -
            Math.max(Math.min(p.y, q.y), Math.min(r.y, s.y)),
        );
    }
  return total;
};

const sameBox = (a: Box, b: Box) =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

/** Does any segment of this waypoint list pass through the interior of a box? */
export const segmentsCrossBoxes = (
  points: { x: number; y: number }[],
  boxes: Box[],
): boolean => {
  for (const b of boxes) {
    const right = b.x + b.width;
    const bottom = b.y + b.height;
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1];
      const c = points[i];
      if (a.x === c.x) {
        const lo = Math.min(a.y, c.y);
        const hi = Math.max(a.y, c.y);
        if (a.x > b.x && a.x < right && hi > b.y && lo < bottom) return true;
      } else if (a.y === c.y) {
        const lo = Math.min(a.x, c.x);
        const hi = Math.max(a.x, c.x);
        if (a.y > b.y && a.y < bottom && hi > b.x && lo < right) return true;
      }
    }
  }
  return false;
};

const DIRS = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
] as const;

const dirOf = (dx: number, dy: number): number =>
  DIRS.findIndex((d) => d.dx === dx && d.dy === dy);

const SIDES: PortSide[] = ["top", "right", "bottom", "left"];

/** Sorted, de-duplicated grid lines; near-coincident lines are one line. */
const gridLines = (values: number[], low: number, high: number): number[] => {
  const sorted = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const out: number[] = [];
  for (const v of sorted) {
    if (out.length === 0 || v - out[out.length - 1] > 1) out.push(v);
  }
  // Ring roads: one line beyond everything on each side — cards included,
  // not just the two ends — so a route can always go around the outside
  // rather than through the middle.
  const span = Math.max(1, high - low);
  return [
    low - Math.min(60, span * 0.25),
    ...out,
    high + Math.min(60, span * 0.25),
  ];
};

/**
 * A grid segment identified by where it physically is, not by indices —
 * every candidate side-pair builds its own grid, and a lane is the same
 * lane in all of them.
 */
const segKey = (x1: number, y1: number, x2: number, y2: number): string =>
  x1 === x2
    ? `v:${round(x1)}>${round(Math.min(y1, y2))}-${round(Math.max(y1, y2))}`
    : `h:${round(y1)}>${round(Math.min(x1, x2))}-${round(Math.max(x1, x2))}`;

/** Smallest binary heap over `f`; ties keep insertion order. */
class Heap<T> {
  private items: T[] = [];
  constructor(private f: (t: T) => number) {}
  get size() {
    return this.items.length;
  }
  push(item: T) {
    const items = this.items;
    items.push(item);
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.f(items[parent]) <= this.f(items[i])) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }
  pop(): T {
    const items = this.items;
    const top = items[0];
    const last = items.pop() as T;
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < items.length && this.f(items[l]) < this.f(items[m])) m = l;
        if (r < items.length && this.f(items[r]) < this.f(items[m])) m = r;
        if (m === i) break;
        [items[m], items[i]] = [items[i], items[m]];
        i = m;
      }
    }
    return top;
  }
}

export interface RoutedPath extends Route {
  /** The ports the engine actually connected — the layout draws its
   *  connectors here, wherever that turns out to be. */
  fromPort: Port;
  toPort: Port;
}

interface PairResult {
  cost: number;
  points: { x: number; y: number }[];
  fromPort: Port;
  toPort: Port;
  segments: string[];
}

/**
 * A* over the grid the cards define.
 *
 * Candidate lines come from the cards themselves — each inflated edge is a
 * lane that provably clears the cards (a Hanan grid), plus ring roads beyond
 * them all. Cost is length, plus a penalty per bend, plus a *large but
 * finite* penalty per px inside an inflated card, plus a small one per reuse
 * of an already-used lane. Finite obstacles are the important part: an edge
 * boxed in by cards still draws its fewest-crossings route rather than
 * vanishing, and a clean route always outranks any number of crossings.
 *
 * Returns `null` only when the grid would be too large to search — the
 * caller then keeps its naive route. The engine never hangs and never blanks.
 */
export const routeBetween = (
  from: PathEndpoint,
  to: PathEndpoint,
  obstacles: Box[],
  options: PathOptions,
): RoutedPath | null => {
  const clearance = options.clearance ?? 12;
  const stub = options.stub ?? 18;
  const radius = options.radius ?? 8;
  const trim = options.trim ?? 0;
  const bendPenalty = options.bendPenalty ?? 18;
  const obstaclePenalty = options.obstaclePenalty ?? 60;
  const lanePenalty = options.lanePenalty ?? 12;
  const preferBonus = options.preferBonus ?? 25;
  const laneUse = options.laneUse;

  const blocked = obstacles.filter(
    (b) => !sameBox(b, from.box) && !sameBox(b, to.box),
  );
  const inflated: Box[] = blocked.map((b) => ({
    x: b.x - clearance,
    y: b.y - clearance,
    width: b.width + clearance * 2,
    height: b.height + clearance * 2,
  }));

  // Only cards the route could plausibly reach matter: anything further
  // away than the detour budget can only add cost, never remove it.
  const fx = from.box.x + from.box.width / 2;
  const fy = from.box.y + from.box.height / 2;
  const tx = to.box.x + to.box.width / 2;
  const ty = to.box.y + to.box.height / 2;
  const dist = Math.hypot(tx - fx, ty - fy);
  const reachLimit =
    Math.max(from.box.width, from.box.height, to.box.width, to.box.height) +
    dist * 1.5 +
    240;
  const near = inflated.filter((b) => {
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    return (
      Math.hypot(cx - fx, cy - fy) < reachLimit &&
      Math.hypot(cx - tx, cy - ty) < reachLimit
    );
  });

  const lowX = Math.min(from.box.x, to.box.x) - reachLimit;
  const highX =
    Math.max(from.box.x + from.box.width, to.box.x + to.box.width) + reachLimit;
  const lowY = Math.min(from.box.y, to.box.y) - reachLimit;
  const highY =
    Math.max(from.box.y + from.box.height, to.box.y + to.box.height) +
    reachLimit;

  const baseXs: number[] = [];
  const baseYs: number[] = [];
  let ringLowX = Math.min(from.box.x, to.box.x);
  let ringHighX = Math.max(
    from.box.x + from.box.width,
    to.box.x + to.box.width,
  );
  let ringLowY = Math.min(from.box.y, to.box.y);
  let ringHighY = Math.max(
    from.box.y + from.box.height,
    to.box.y + to.box.height,
  );
  for (const b of near) {
    baseXs.push(b.x, b.x + b.width);
    baseYs.push(b.y, b.y + b.height);
    ringLowX = Math.min(ringLowX, b.x);
    ringHighX = Math.max(ringHighX, b.x + b.width);
    ringLowY = Math.min(ringLowY, b.y);
    ringHighY = Math.max(ringHighY, b.y + b.height);
  }

  const laneSpacing = options.laneSpacing ?? routingLaneSpacing(clearance, radius);
  for (const path of options.occupied ?? [])
    for (const p of path) {
      baseXs.push(p.x - laneSpacing, p.x, p.x + laneSpacing);
      baseYs.push(p.y - laneSpacing, p.y, p.y + laneSpacing);
    }
  let best: PairResult | null = null;

  for (const fromSide of from.sides ?? SIDES) {
    for (const toSide of to.sides ?? SIDES) {
      const fromPort = port(from.box, fromSide, from.t);
      const toPort = port(to.box, toSide, to.t);
      const fromTrim = retreat(fromPort, trim);
      const toTrim = retreat(toPort, trim);
      const pairDist = Math.hypot(toTrim.x - fromTrim.x, toTrim.y - fromTrim.y);
      const reach = Math.max(4, Math.min(stub, pairDist / 2));
      const safeReach = (p: Port) => {
        let available = reach;
        for (const b of [...obstacles, from.box, to.box]) {
          let distance = Infinity;
          if (p.dx && p.y > b.y && p.y < b.y + b.height)
            distance = p.dx > 0 ? b.x - p.x : p.x - b.x - b.width;
          if (p.dy && p.x > b.x && p.x < b.x + b.width)
            distance = p.dy > 0 ? b.y - p.y : p.y - b.y - b.height;
          if (distance >= 0) available = Math.min(available, distance / 2);
        }
        return Math.max(0.5, available);
      };
      const fromReach = safeReach(fromTrim),
        toReach = safeReach(toTrim);
      const fromStub = {
        x: fromTrim.x + fromPort.dx * fromReach,
        y: fromTrim.y + fromPort.dy * fromReach,
      };
      const toStub = {
        x: toTrim.x + toPort.dx * toReach,
        y: toTrim.y + toPort.dy * toReach,
      };

      const gridXs = gridLines(
        [...baseXs, fromStub.x, toStub.x],
        Math.min(fromStub.x, toStub.x, ringLowX),
        Math.max(fromStub.x, toStub.x, ringHighX),
      ).filter((v) => v >= lowX && v <= highX);
      const gridYs = gridLines(
        [...baseYs, fromStub.y, toStub.y],
        Math.min(fromStub.y, toStub.y, ringLowY),
        Math.max(fromStub.y, toStub.y, ringHighY),
      ).filter((v) => v >= lowY && v <= highY);
      // Near-coincident corridor lines may be coalesced, but endpoint stubs
      // must survive exactly. A 1px anchor offset otherwise removes a start
      // or goal from the grid and silently disables the collision engine.
      const xs = [...new Set([...gridXs, fromStub.x, toStub.x])].sort(
        (a, b) => a - b,
      );
      const ys = [...new Set([...gridYs, fromStub.y, toStub.y])].sort(
        (a, b) => a - b,
      );
      if (xs.length * ys.length > 65_536) return null; // keep the naive route

      const xOf = new Map(xs.map((v, i) => [round(v), i]));
      const yOf = new Map(ys.map((v, i) => [round(v), i]));
      const si = xOf.get(round(fromStub.x));
      const sj = yOf.get(round(fromStub.y));
      const gi = xOf.get(round(toStub.x));
      const gj = yOf.get(round(toStub.y));
      if (
        si === undefined ||
        sj === undefined ||
        gi === undefined ||
        gj === undefined
      ) {
        continue;
      }

      const startDir = dirOf(fromPort.dx, fromPort.dy);
      const W = xs.length;
      const H = ys.length;
      const stateCount = W * H * 4;
      const gScore = new Float64Array(stateCount).fill(
        Number.POSITIVE_INFINITY,
      );
      const cameFrom = new Int32Array(stateCount).fill(-1);
      const keyOf = (i: number, j: number, d: number) => (j * W + i) * 4 + d;
      const heur = (i: number, j: number) =>
        Math.abs(xs[i] - xs[gi]) + Math.abs(ys[j] - ys[gj]);

      // Precompute what each grid line runs through: a horizontal move on
      // row j only ever crosses the cards whose inflated box contains that
      // line's y, and the same down the columns. The engine then scores a
      // step against a handful of intervals instead of the whole board.
      const rowXs: ([number, number][] | undefined)[] = new Array(H);
      for (let j = 0; j < H; j += 1) {
        const y = ys[j];
        let list: [number, number][] | undefined;
        for (const b of near) {
          if (y > b.y && y < b.y + b.height) {
            (list ??= []).push([b.x, b.x + b.width]);
          }
        }
        rowXs[j] = list;
      }
      const colYs: ([number, number][] | undefined)[] = new Array(W);
      for (let i = 0; i < W; i += 1) {
        const x = xs[i];
        let list: [number, number][] | undefined;
        for (const b of near) {
          if (x > b.x && x < b.x + b.width) {
            (list ??= []).push([b.y, b.y + b.height]);
          }
        }
        colYs[i] = list;
      }
      const penetration = (i: number, j: number, ni: number, nj: number) => {
        let total = 0;
        if (i === ni) {
          const list = colYs[i];
          if (!list) return 0;
          const lo = Math.min(ys[j], ys[nj]);
          const hi = Math.max(ys[j], ys[nj]);
          for (const [l, r] of list)
            total += Math.max(0, Math.min(hi, r) - Math.max(lo, l));
        } else {
          const list = rowXs[j];
          if (!list) return 0;
          const lo = Math.min(xs[i], xs[ni]);
          const hi = Math.max(xs[i], xs[ni]);
          for (const [l, r] of list)
            total += Math.max(0, Math.min(hi, r) - Math.max(lo, l));
        }
        return total;
      };

      const heap = new Heap<{ i: number; j: number; d: number; g: number }>(
        (s) => s.g + heur(s.i, s.j),
      );
      const startKey = keyOf(si, sj, startDir);
      gScore[startKey] = 0;
      heap.push({ i: si, j: sj, d: startDir, g: 0 });
      // The line must leave along the port's normal; charge the stub, it is
      // part of the route and can run through a card's clearance.
      let found: { i: number; j: number; d: number; g: number } | null = null;
      const cutoff = best
        ? best.cost + preferBonus * 2
        : Number.POSITIVE_INFINITY;
      let pops = 0;

      while (heap.size > 0) {
        const s = heap.pop();
        if (++pops > 60_000) break; // bounded: this pair loses to whatever already won
        const key = keyOf(s.i, s.j, s.d);
        if (s.g > gScore[key]) continue;
        if (s.g + heur(s.i, s.j) >= cutoff) break;
        if (s.i === gi && s.j === gj) {
          found = s;
          break;
        }
        for (let d = 0; d < 4; d += 1) {
          const { dx, dy } = DIRS[d];
          const ni: number = s.i + dx;
          const nj: number = s.j + dy;
          if (ni < 0 || ni >= W || nj < 0 || nj >= H) continue;
          // The port-to-stub segment already supplies the normal approach.
          // Turning at a stub is legal, but immediately reversing along it
          // would fold the path back over itself. Card interiors stay blocked.
          if (
            s.i === si &&
            s.j === sj &&
            DIRS[d].dx === -fromPort.dx &&
            DIRS[d].dy === -fromPort.dy
          )
            continue;
          if (
            ni === gi &&
            nj === gj &&
            DIRS[d].dx === toPort.dx &&
            DIRS[d].dy === toPort.dy
          )
            continue;
          const dirPenalty = d === s.d ? 0 : bendPenalty;
          const nx = xs[ni];
          const ny = ys[nj];
          const segment = [
            { x: xs[s.i], y: ys[s.j] },
            { x: nx, y: ny },
          ];
          // Endpoint cards remain solid. Excluding them allowed an approach
          // to pass through its own target and masquerade as another edge.
          if (
            segmentsCrossBoxes(
              segment,
              options.strictObstacles
                ? [...obstacles, from.box, to.box]
                : [from.box, to.box],
            )
          )
            continue;
          let step =
            Math.abs(nx - xs[s.i]) + Math.abs(ny - ys[s.j]) + dirPenalty;
          step += penetration(s.i, s.j, ni, nj) * obstaclePenalty;
          const prior = laneUse?.get(segKey(xs[s.i], ys[s.j], nx, ny)) ?? 0;
          if (prior > 0) step += prior * lanePenalty;
          for (const occupied of options.occupied ?? [])
            step +=
              (parallelOverlap(segment, occupied, laneSpacing) +
                100 * parallelOverlap(segment, occupied)) * lanePenalty;
          const nKey = keyOf(ni, nj, d);
          const ng = s.g + step;
          if (ng < gScore[nKey]) {
            gScore[nKey] = ng;
            cameFrom[nKey] = key;
            heap.push({ i: ni, j: nj, d, g: ng });
          }
        }
      }
      if (!found) continue;

      let bonus = 0;
      if (from.preferSides?.includes(fromSide)) bonus += preferBonus;
      if (to.preferSides?.includes(toSide)) bonus += preferBonus;
      const cost = found.g - bonus;
      if (best && cost >= best.cost) continue;

      const chainKeys: number[] = [];
      let k = keyOf(found.i, found.j, found.d);
      while (k !== -1) {
        chainKeys.push(k);
        k = cameFrom[k];
      }
      chainKeys.reverse();
      const nodes = chainKeys.map((key) => {
        const st = Math.floor(key / 4);
        return { x: xs[st % W], y: ys[Math.floor(st / W)] };
      });
      const segments: string[] = [];
      for (let p = 1; p < nodes.length; p += 1) {
        segments.push(
          segKey(nodes[p - 1].x, nodes[p - 1].y, nodes[p].x, nodes[p].y),
        );
      }
      const points = simplify([fromTrim, ...nodes, toTrim]);
      best = { cost, points, fromPort, toPort, segments };
    }
  }

  if (!best) return null;
  if (laneUse) {
    for (const seg of best.segments)
      laneUse.set(seg, (laneUse.get(seg) ?? 0) + 1);
  }
  return {
    points: best.points,
    d: roundedPath(best.points, CORNER[options.style](radius)),
    fromPort: best.fromPort,
    toPort: best.toPort,
  };
};

// ── Crossing hops ─────────────────────────────────────────────────────────
//
// Crossings between edges are legitimate graph topology — the engine is not
// asked to avoid them — but a crossing that reads as a merge lies about the
// graph. So where a vertical runs through a horizontal, the horizontal hops
// over it: the PCB convention, drawn into the same path the travelling dots
// follow, so the dots hop too.

export interface RoutableEdge {
  id: string;
  points: { x: number; y: number }[];
  style: ConnectionFlowEdgeStyle;
}

interface Jump {
  /** Index of the (horizontal) segment the hop rides: points[segment]→[segment+1]. */
  segment: number;
  /** The crossing x on that segment. */
  at: number;
  /** Hop radius, after packing. */
  r: number;
}

const JUMP_RADIUS = 6;

/** Crossings where one edge runs horizontal and the other vertical through
 *  its interior — a touch at a vertex or a collinear run is not a crossing. */
const segmentCrossings = (
  aId: string,
  a: { x: number; y: number }[],
  bId: string,
  b: { x: number; y: number }[],
  jumpRadius: number,
  aRadius: number[],
  bRadius: number[],
): JumpEdge[] => {
  const out: JumpEdge[] = [];
  const corner = (_p: typeof a, i: number, radii: number[]) => radii[i];
  const check = (
    id: string,
    h: typeof a,
    i: number,
    v: typeof a,
    j: number,
    hr: number[],
    vr: number[],
  ) => {
    const h1 = h[i],
      h2 = h[i + 1],
      v1 = v[j],
      v2 = v[j + 1];
    if (h1.y !== h2.y || h1.x === h2.x || v1.x !== v2.x || v1.y === v2.y)
      return;
    const hdir = Math.sign(h2.x - h1.x),
      vdir = Math.sign(v2.y - v1.y);
    const alongH = (v1.x - h1.x) * hdir,
      alongV = (h1.y - v1.y) * vdir;
    const hlen = Math.abs(h2.x - h1.x),
      vlen = Math.abs(v2.y - v1.y);
    // Reserve only the corners actually painted, not a full extra jump on
    // the vertical line. Short risers can still pass through a horizontal.
    if (
      alongV <= corner(v, j, vr) + 0.01 ||
      alongV >= vlen - corner(v, j + 1, vr) - 0.01
    )
      return;
    const r = Math.min(
      jumpRadius,
      alongH - corner(h, i, hr) - 1,
      hlen - alongH - corner(h, i + 1, hr) - 1,
    );
    if (r >= 2.5) out.push({ edgeId: id, segment: i, at: v1.x, r });
  };
  for (let i = 0; i < a.length - 1; i++)
    for (let j = 0; j < b.length - 1; j++) {
      check(aId, a, i, b, j, aRadius, bRadius);
      check(bId, b, j, a, i, bRadius, aRadius);
    }
  return out;
};

interface JumpEdge {
  edgeId: string;
  segment: number;
  at: number;
  r: number;
}

/**
 * The path of an edge, drawn like `roundedPath` would draw it — with
 * semicircular hops (bulging up) inserted into its horizontal segments.
 * `edgeStyle` governs the corners only; hops are round on every style.
 */
const jumpPath = (
  points: { x: number; y: number }[],
  style: ConnectionFlowEdgeStyle,
  cornerRadius: number,
  jumps: Jump[],
  corners?: number[],
): string => {
  if (points.length < 2) return line(points);
  const radius = CORNER[style](cornerRadius);
  const bySeg = new Map<number, Jump[]>();
  for (const j of jumps)
    (bySeg.get(j.segment) ?? bySeg.set(j.segment, []).get(j.segment)!).push(j);
  const parts: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev.y === curr.y) {
      const dir = curr.x >= prev.x ? 1 : -1;
      const on = (bySeg.get(i - 1) ?? [])
        .slice()
        .sort((a, b) => (a.at - b.at) * dir);
      for (const j of on) {
        parts.push(`L ${round(j.at - dir * j.r)} ${round(curr.y)}`);
        // Bulge up either way: travelling left→right the arc sweeps
        // anticlockwise, right→left it sweeps clockwise.
        parts.push(
          `A ${round(j.r)} ${round(j.r)} 0 0 ${dir === 1 ? 0 : 1} ${round(j.at + dir * j.r)} ${round(curr.y)}`,
        );
      }
    }
    if (i === points.length - 1) {
      parts.push(`L ${round(curr.x)} ${round(curr.y)}`);
      break;
    }
    // The corner at `curr`, exactly as `roundedPath` draws it.
    const next = points[i + 1];
    const inLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const outLen = Math.hypot(next.x - curr.x, next.y - curr.y);
    const r = corners?.[i] ?? Math.min(radius, inLen / 2, outLen / 2);
    if (r <= 0.5) {
      parts.push(`L ${round(curr.x)} ${round(curr.y)}`);
      continue;
    }
    const inX = curr.x - ((curr.x - prev.x) / inLen) * r;
    const inY = curr.y - ((curr.y - prev.y) / inLen) * r;
    const outX = curr.x + ((next.x - curr.x) / outLen) * r;
    const outY = curr.y + ((next.y - curr.y) / outLen) * r;
    parts.push(`L ${round(inX)} ${round(inY)}`);
    parts.push(
      `Q ${round(curr.x)} ${round(curr.y)} ${round(outX)} ${round(outY)}`,
    );
  }
  return parts.join(" ");
};

/**
 * The crossing pass: compare every pair of routed edges and give the
 * horizontal one of each crossing a hop. Returns the new `d` for the edges
 * that gained hops or needed a tighter corner to preserve a crossing.
 */
export const routeCrossings = (
  edges: RoutableEdge[],
  options: { cornerRadius?: number; jumpRadius?: number } = {},
): Map<string, string> => {
  const cornerRadius = options.cornerRadius ?? 8;
  const jumpRadius = options.jumpRadius ?? JUMP_RADIUS;
  // Preserve a straight crossing even when a large curved corner would
  // otherwise sweep over it. Both participants use these exact corner limits.
  const corners = edges.map((edge) =>
    edge.points.map((p, i, points) =>
      !i || i === points.length - 1
        ? 0
        : Math.min(
            CORNER[edge.style](cornerRadius),
            Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) / 2,
            Math.hypot(p.x - points[i + 1].x, p.y - points[i + 1].y) / 2,
          ),
    ),
  );
  const changed = new Set<number>();
  const protect = (h: number, i: number, v: number, j: number) => {
    const [a, b] = edges[h].points.slice(i, i + 2);
    const [c, d] = edges[v].points.slice(j, j + 2);
    if (a.y !== b.y || a.x === b.x || c.x !== d.x || c.y === d.y) return;
    const left = Math.min(a.x, b.x),
      right = Math.max(a.x, b.x);
    const top = Math.min(c.y, d.y),
      bottom = Math.max(c.y, d.y);
    if (c.x <= left || c.x >= right || a.y <= top || a.y >= bottom) return;
    const hop = Math.min(jumpRadius, c.x - left - 1, right - c.x - 1);
    if (hop < 2.5) return;
    for (const [index, vertex, room] of [
      [h, i, Math.abs(c.x - a.x) - hop - 1],
      [h, i + 1, Math.abs(c.x - b.x) - hop - 1],
      [v, j, Math.abs(a.y - c.y) - 1],
      [v, j + 1, Math.abs(a.y - d.y) - 1],
    ]) {
      const limit = Math.max(0, room);
      if (corners[index][vertex] > limit) {
        corners[index][vertex] = limit;
        changed.add(index);
      }
    }
  };
  for (let a = 0; a < edges.length; a++)
    for (let b = a + 1; b < edges.length; b++)
      for (let i = 0; i < edges[a].points.length - 1; i++)
        for (let j = 0; j < edges[b].points.length - 1; j++) {
          protect(a, i, b, j);
          protect(b, j, a, i);
        }
  const found = new Map<string, Jump[]>();
  for (let a = 0; a < edges.length; a += 1) {
    for (let b = a + 1; b < edges.length; b += 1) {
      for (const cross of segmentCrossings(
        edges[a].id,
        edges[a].points,
        edges[b].id,
        edges[b].points,
        jumpRadius,
        corners[a],
        corners[b],
      )) {
        (
          found.get(cross.edgeId) ??
          found.set(cross.edgeId, []).get(cross.edgeId)!
        ).push({
          segment: cross.segment,
          at: cross.at,
          r: cross.r,
        });
      }
    }
  }
  const out = new Map<string, string>();
  const byId = new Map(edges.map((e) => [e.id, e]));
  for (const index of changed)
    out.set(
      edges[index].id,
      jumpPath(edges[index].points, edges[index].style, cornerRadius, [], corners[index]),
    );
  for (const [id, list] of found) {
    const edge = byId.get(id);
    if (!edge) continue;
    // Share the available space symmetrically so a preceding hop cannot
    // consume the room needed to render the next crossing.
    const perSegment = new Map<number, Jump[]>();
    for (const j of list)
      (
        perSegment.get(j.segment) ??
        perSegment.set(j.segment, []).get(j.segment)!
      ).push(j);
    const packed: Jump[] = [];
    for (const seg of perSegment.values()) {
      seg.sort((x, y) => x.at - y.at);
      const unique = seg.filter((j, i) => !i || j.at !== seg[i - 1].at);
      for (let i = 0; i < unique.length; i++) {
        const j = unique[i];
        const before = i ? (j.at - unique[i - 1].at) / 2 - 0.5 : Infinity;
        const after = i + 1 < unique.length
          ? (unique[i + 1].at - j.at) / 2 - 0.5
          : Infinity;
        const r = Math.min(j.r, before, after);
        if (r < 1) continue;
        packed.push({ ...j, r });
      }
    }
    if (packed.length === 0) continue;
    out.set(
      id,
      jumpPath(edge.points, edge.style, cornerRadius, packed, corners[edges.indexOf(edge)]),
    );
  }
  return out;
};

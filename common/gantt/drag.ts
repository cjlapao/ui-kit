/**
 * Gantt interaction math — pure. Converts pointer deltas into date/duration
 * edits and computes dependency-arrow geometry.
 *
 * The framework layer (React/Vue) owns the pointer listeners; everything
 * here is a function in, value out, which keeps the behaviour unit-testable
 * without a DOM.
 */

import type {
  GanttBarGeometry,
  GanttLink,
  GanttLinkPath,
  GanttLinkPoint,
  GanttLinkType,
  GanttSnap,
  GanttTask,
  TrueColor,
} from "./types";
import {
  daysBetween,
  msToIso,
  snapDate,
  startOfDay,
  toMs,
  MS_PER_DAY,
} from "./time";

export const MIN_TASK_MS = 3_600_000; // one hour minimum for non-milestones

export interface GanttDragState {
  kind: "move" | "resize-start" | "resize-end" | "link" | "reorder" | "progress";
  taskId: string;
  /** Pointer x at drag start, in timeline space. */
  startX: number;
  /** Pointer y at drag start, in row-area space. */
  startY: number;
  /** The task's start/end at drag start, epoch ms. */
  originStart: number;
  originEnd: number;
  /** Row keys the pointer is currently over (reorder preview). */
  beforeKey?: string | null;
  /** Live pointer position (timeline x / row-area y). */
  x: number;
  y: number;
}

/**
 * Produce the edited start/end for a live drag. `deltaX` is in px, the
 * pointer delta from the drag origin. `snap` quantises the result.
 *
 * - `move` shifts both edges.
 * - `resize-start` moves the start edge, clamped to `end - MIN_TASK_MS`.
 * - `resize-end` moves the end edge, clamped to `start + MIN_TASK_MS`.
 */
export function applyDragDates(
  state: Pick<GanttDragState, "kind" | "originStart" | "originEnd">,
  deltaX: number,
  pxPerDay: number,
  snap: GanttSnap,
): { start: number; end: number } {
  const deltaMs = (deltaX / pxPerDay) * MS_PER_DAY;
  let { originStart: s, originEnd: e } = state;

  if (state.kind === "move") {
    s = s + deltaMs;
    e = e + deltaMs;
  } else if (state.kind === "resize-start") {
    s = s + deltaMs;
    if (e - s < MIN_TASK_MS) s = e - MIN_TASK_MS;
  } else if (state.kind === "resize-end") {
    e = e + deltaMs;
    if (e - s < MIN_TASK_MS) e = s + MIN_TASK_MS;
  }

  if (snap !== "none") {
    if (state.kind === "resize-start") s = snapDate(s, snap);
    else if (state.kind === "resize-end") e = snapDate(e, snap);
    else {
      // move: snap the start edge, keep the duration.
      const dur = e - s;
      s = snapDate(s, snap);
      e = s + dur;
    }
  }
  return { start: s, end: e };
}

/**
 * Commit a drag onto a task: returns the edited task with ISO dates (or the
 * same task when the edit is a no-op).
 */
export function commitDragEdit(
  task: GanttTask,
  startMs: number,
  endMs: number,
): GanttTask {
  // Compare by epoch ms, not string, so a no-op edit (same instant, any ISO
  // spelling) returns the identical task and avoids a pointless re-render.
  if (toMs(task.start) === startMs && toMs(task.end) === endMs) return task;
  return { ...task, start: msToIso(startMs), end: msToIso(endMs) };
}

/** Live progress (0..1) while dragging a progress knob. */
export function progressFromPointer(pointerX: number, barLeft: number, barWidth: number): number {
  if (barWidth <= 0) return 1;
  const p = (pointerX - barLeft) / barWidth;
  return Math.min(1, Math.max(0, Math.round(p * 100) / 100));
}

// ── Dependency arrow geometry ────────────────────────────────────────────────

/** Radius of the port (connection node) drawn at each bar edge. */
export const LINK_PORT_R = 3.5;
/**
 * The one uniform margin (px) a connector keeps whenever it passes by a bar:
 * every vertical run hugs the nearest bar edge it passes at exactly this
 * distance (and stays at least this far from the source/target bars it
 * departs or enters). A single constant for obstacle avoidance *and* the
 * shared-column alignment pass, so "passing a bar" always reads as the same
 * padding everywhere in the diagram.
 */
export const LINK_PASS_PADDING = 6;
/** Radius of the rounded elbow at each turn. */
const LINK_ELBOW_R = 6;
/** Length of the arrowhead. */
const LINK_HEAD = 7;
/** How far the arrowhead's tip stops short of the target port, so it points
 *  *at* the connector dot (fill + 2.5 halo) instead of vanishing under it:
 *  port fill + halo + a 2px gap. */
const LINK_PORT_CLEAR = LINK_PORT_R + 2.5 + 2;
/** Straight run (px) a route must keep between a port and the nearest
 *  rounded corner, so the elbow reads as its own curve, not a blob hugging
 *  the bar or the arrowhead. */
const LINK_CORNER_ROOM = LINK_ELBOW_R + 2;
/** How far past the source's right edge (beyond the port dot + halo) the
 *  first corner must sit, keeping the exit curve clear of the bar. */
const LINK_EXIT_CLEAR = LINK_PORT_R + 2.5 + LINK_CORNER_ROOM + 2;
/** How far left of the target's left edge the final corner must sit, so the
 *  rounded elbow *and* the arrowhead both sit on a straight approach:
 *  corner room + port clearance + arrowhead length + margin. */
export const LINK_ENTRY_CLEAR = LINK_CORNER_ROOM + LINK_PORT_CLEAR + LINK_HEAD + 2;
/** Glyph height of a bar inside its row (rows carry padding above/below). */
const LINK_BAR_HEIGHT = 24;

/** A 2D point in timeline pixel space (x, y). */
export type GanttPt = [number, number];
type Pt = GanttPt;
/** A closed x-interval that a vertical run must not cross. */
type XInterval = [number, number];

/** The bar's real vertical extent (bars are inset from their row edges). */
function barYExtent(g: GanttBarGeometry): [number, number] {
  const inset = Math.max(0, (g.height - LINK_BAR_HEIGHT) / 2);
  return [g.top + inset, g.top + g.height - inset];
}

/**
 * x-intervals a vertical run between `y1` and `y2` must stay out of: every
 * obstacle bar whose vertical extent overlaps the run, each expanded by the
 * channel clearance. (Obstacles are the bars a connector must not cross —
 * i.e. every bar except its own source and target.)
 */
function blockedIntervals(
  obstacles: GanttBarGeometry[],
  y1: number,
  y2: number,
  clear: number,
): XInterval[] {
  const lo = Math.min(y1, y2);
  const hi = Math.max(y1, y2);
  const out: XInterval[] = [];
  for (const o of obstacles) {
    const [bo, bh] = barYExtent(o);
    if (bo < hi && bh > lo) out.push([o.left - clear, o.left + o.width + clear]);
  }
  return out;
}

/** Clip blocked intervals to the open window `(lo, hi)` and merge overlaps. */
function clipMerge(lo: number, hi: number, intervals: XInterval[]): XInterval[] {
  const clipped: XInterval[] = [];
  for (const [a, b] of intervals) {
    const ca = Math.max(a, lo);
    const cb = Math.min(b, hi);
    if (ca < cb) clipped.push([ca, cb]);
  }
  clipped.sort((p, q) => p[0] - q[0]);
  const merged: XInterval[] = [];
  for (const [a, b] of clipped) {
    const last = merged[merged.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  return merged;
}

/**
 * The clearest x for a vertical run inside the open window `(lo, hi)`
 * (either bound may be ±Infinity): the point nearest to `target` that lies
 * outside every blocked interval. Returns `null` when the window is fully
 * blocked. (Bars are finite, so an unbounded window always yields a point.)
 */
function findClearX(lo: number, hi: number, target: number, blocked: XInterval[]): number | null {
  if (!(lo < hi)) return null;
  const merged = clipMerge(lo, hi, blocked);
  // Walk the clear gaps (the complement) and keep the point nearest to target.
  let best: number | null = null;
  let bestDist = Infinity;
  let gapStart = lo;
  for (const [a, b] of merged) {
    if (a > gapStart) {
      const cand = Math.min(Math.max(target, gapStart), a);
      const dist = Math.abs(target - cand);
      if (dist < bestDist) {
        bestDist = dist;
        best = cand;
      }
    }
    gapStart = Math.max(gapStart, b);
  }
  if (gapStart < hi) {
    const cand = Math.min(Math.max(target, gapStart), hi);
    const dist = Math.abs(target - cand);
    if (dist < bestDist) best = cand;
  }
  return best;
}

const f = (n: number): string => Number(n.toFixed(2)).toString();

/**
 * Build an SVG path through `pts` with rounded corners at every interior
 * point (quadratic bezier through the corner). End points are not rounded.
 * Collinear runs collapse to a plain straight line.
 */
function roundedPath(pts: Pt[], radius: number): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < n; i++) {
    const cur = pts[i];
    if (i === n - 1) {
      d += ` L ${f(cur[0])} ${f(cur[1])}`;
      continue;
    }
    const prev = pts[i - 1];
    const next = pts[i + 1];
    // Incoming / outgoing directions.
    const vinX = cur[0] - prev[0];
    const vinY = cur[1] - prev[1];
    const voutX = next[0] - cur[0];
    const voutY = next[1] - cur[1];
    const lenIn = Math.hypot(vinX, vinY);
    const lenOut = Math.hypot(voutX, voutY);
    if (lenIn < 0.5 || lenOut < 0.5) {
      d += ` L ${f(cur[0])} ${f(cur[1])}`;
      continue;
    }
    const ri = Math.min(radius, lenIn / 2);
    const ro = Math.min(radius, lenOut / 2);
    const a: Pt = [cur[0] - (vinX / lenIn) * ri, cur[1] - (vinY / lenIn) * ri];
    const b: Pt = [cur[0] + (voutX / lenOut) * ro, cur[1] + (voutY / lenOut) * ro];
    d += ` L ${f(a[0])} ${f(a[1])} Q ${f(cur[0])} ${f(cur[1])} ${f(b[0])} ${f(b[1])}`;
  }
  return d;
}

/** A filled triangle pointing in `dir` (+1 right / -1 left) with its tip at (tipX, tipY). */
function arrowHead(tipX: number, tipY: number, dir: 1 | -1): string {
  const w = LINK_HEAD * 0.55;
  const baseX = tipX - dir * LINK_HEAD;
  return `${f(tipX)},${f(tipY)} ${f(baseX)},${f(tipY - w)} ${f(baseX)},${f(tipY + w)}`;
}

/**
 * A vertical channel run that the global alignment pass may slide to a shared
 * x. `seg` is the index of the segment in the route's point list (the run is
 * between `points[seg]` and `points[seg + 1]`); `(lo, hi)` is the open window
 * of x values that keep the route's horizontal stubs clear of the source and
 * target bars (so a channel can never be dragged over a bar by alignment).
 */
interface Channel {
  seg: number;
  lo: number;
  hi: number;
}

/**
 * Compute the orthogonal route (corner points, pre-rounding) for a single
 * link, given the bars it must not cross. This is the core routing; {@link
 * linkPath} wraps it to also emit the SVG path, and {@link computeLinkPaths}
 * runs a global alignment pass over many routes so that overlapping vertical
 * runs share an x (diagram-style: lines may overlap each other, never a bar).
 *
 * Port convention (agreed): the connector always leaves the **source's right
 * edge** and enters the **target's left edge**, so every dependency reads
 * "item 1's right → item 2's left"; the link type is carried by the line
 * style (dashed for `ff`/`sf`) and the tooltip, not by which edge is used.
 * The arrowhead's tip stops `LINK_PORT_CLEAR` short of the port so it points
 * *at* the connector dot (which sits on the bar edge) instead of vanishing
 * under it.
 *
 * Route shapes (none ever crosses a bar):
 * - **Same row** — a straight connector between the two ports (no channels).
 * - **Target to the right** — a vertical channel in the horizontal gap, in a
 *   column no intermediate bar occupies (channel window
 *   `(fr + LINK_EXIT_CLEAR, tl - LINK_ENTRY_CLEAR)`).
 * - **Overlapping / "going back"** — the connector steps out of the source row
 *   into the clear row-boundary band, drops in a clear column, and enters the
 *   target's left edge (drop-channel window `(-∞, tl - LINK_ENTRY_CLEAR)`).
 * - **No clear column** — the route swings out to the right of every bar in
 *   the corridor, drops to the target row's clear band, and enters the port
 *   (two channels: the right swing `(fr, +∞)` and the drop
 *   `(-∞, tl - LINK_ENTRY_CLEAR)`).
 *
 * The exit corner keeps `LINK_EXIT_CLEAR` past the source edge and the final
 * corner keeps `LINK_ENTRY_CLEAR` before the target edge, so a rounded elbow
 * never hugs a bar and the elbow + arrowhead always sit on a straight run
 * into the port dot.
 *
 * `obstacles` are the bars (other than the source and target) the connector
 * must not cross. `fanSrcY` / `fanTgtY` offset the port vertically so several
 * links sharing a bar fan out instead of stacking.
 */
function routePoints(
  from: GanttBarGeometry,
  to: GanttBarGeometry,
  fanSrcY: number,
  fanTgtY: number,
  obstacles: GanttBarGeometry[],
): { points: Pt[]; arrow?: string; channels: Channel[] } {
  const fr = from.left + from.width; // source right edge (departure port)
  const tl = to.left; // target left edge (entry port)
  const sy = from.top + from.height / 2 + fanSrcY;
  const ty = to.top + to.height / 2 + fanTgtY;

  const depart = LINK_PORT_R + 1; // how far the line starts out from the source port
  const start: Pt = [fr + depart, sy];
  const end: Pt = [tl - LINK_PORT_CLEAR - LINK_HEAD, ty]; // line stops short of the arrowhead, which points at the port dot

  // Same row → straight connector between the ports.
  if (Math.abs(sy - ty) < 0.5) {
    return {
      points: [start, end],
      arrow: tl - fr > LINK_PORT_CLEAR + LINK_HEAD + depart ? arrowHead(tl - LINK_PORT_CLEAR, ty, 1) : undefined,
      channels: [],
    };
  }

  // Columns the vertical run (from sy to ty) must avoid: every intermediate
  // bar whose rows the run passes through, each expanded by the clearance.
  const blocked = blockedIntervals(obstacles, sy, ty, LINK_PASS_PADDING);

  // "Around the right outside of everything": exit the source's right port,
  // run right of every bar in the corridor, drop to the target row's clear
  // band (a row boundary is clear of every bar), travel back along that band,
  // and enter the target's left port.
  const outsideRoute = (): { points: Pt[]; channels: Channel[] } => {
    const rightOfAll = Math.max(
      fr,
      to.left + to.width,
      ...obstacles.map((o) => o.left + o.width),
    );
    const X = rightOfAll + LINK_PASS_PADDING;
    const bandT = ty > sy ? to.top + to.height : to.top; // target row boundary
    // Drop far enough left of the port that the elbow + arrowhead keep a
    // straight approach (LINK_ENTRY_CLEAR from the target edge).
    const inX = tl - LINK_ENTRY_CLEAR;
    return {
      points: [start, [X, sy], [X, bandT], [inX, bandT], [inX, ty], end],
      // seg 1 = the right swing (x = X), seg 3 = the drop (x = inX).
      channels: [
        { seg: 1, lo: fr, hi: Infinity },
        { seg: 3, lo: -Infinity, hi: tl - LINK_ENTRY_CLEAR },
      ],
    };
  };

  // Target's left edge clears the source's right edge → a vertical channel
  // fits in the horizontal gap between the two bars; pick the clear column
  // nearest the middle of that gap. The window keeps LINK_EXIT_CLEAR past the
  // source edge (so the exit curve doesn't hug the bar) and LINK_ENTRY_CLEAR
  // before the target edge (so the elbow + arrowhead keep a straight
  // approach). A gap too narrow for both falls through to the outside route.
  if (tl - fr >= 2 * LINK_PASS_PADDING) {
    const cx = findClearX(
      fr + LINK_EXIT_CLEAR,
      tl - LINK_ENTRY_CLEAR,
      (fr + tl) / 2,
      blocked,
    );
    if (cx != null) {
      return {
        points: [start, [cx, sy], [cx, ty], end],
        arrow: arrowHead(tl - LINK_PORT_CLEAR, ty, 1),
        // seg 1 = the channel (x = cx); it must stay between the ports.
        channels: [{ seg: 1, lo: fr + LINK_EXIT_CLEAR, hi: tl - LINK_ENTRY_CLEAR }],
      };
    }
    // A bar in the way (or a gap too narrow for the port clearances) blocks
    // the channel → swing around everything.
    const o = outsideRoute();
    return { points: o.points, arrow: arrowHead(tl - LINK_PORT_CLEAR, ty, 1), channels: o.channels };
  }

  // Overlapping / going back (or a tight forward gap): step out of the source
  // row into the clear band just beyond it (on the target's side), travel
  // across that band (a row-boundary line is clear of every bar), then drop
  // in a column clear of every intermediate bar and enter the target's left
  // edge. `inX` keeps the target-port clearance (LINK_ENTRY_CLEAR) when
  // possible, and steps left of any blocking bar otherwise.
  const tightInX = tl - LINK_ENTRY_CLEAR;
  const inX = findClearX(-Infinity, tl - LINK_ENTRY_CLEAR, tightInX, blocked) ?? tightInX;
  const bandY = ty > sy ? from.top + from.height : from.top;
  return {
    points: [start, [start[0], bandY], [inX, bandY], [inX, ty], end],
    arrow: arrowHead(tl - LINK_PORT_CLEAR, ty, 1),
    // seg 2 = the drop (x = inX); it must stay left of the arrowhead.
    channels: [{ seg: 2, lo: -Infinity, hi: tl - LINK_ENTRY_CLEAR }],
  };
}

/**
 * Compute the SVG path, arrowhead and port anchors for a dependency link.
 *
 * Port convention (agreed): the connector always leaves the **source's right
 * edge** (its "children" side — the successors it leads to) and enters the
 * **target's left edge** (its "parents" side — the predecessors it depends on).
 * So every dependency reads "item 1's right → item 2's left", and the link
 * type (`fs`/`ff`/`ss`/`sf`) is conveyed by the line style (dashed for
 * `ff`/`sf`) and the tooltip rather than by which edge is used.
 *
 * Routing is a best-path orthogonal route that never crosses a bar:
 * - **Same row** — a straight connector between the two ports.
 * - **Target to the right** — a vertical channel in the horizontal gap
 *   between the bars, in a column no intermediate bar occupies.
 * - **Overlapping / "going back"** — the connector steps out of the source
 *   row into the clear row-boundary band, drops in a clear column, and
 *   enters the target's left edge.
 * - **No clear column** — the route swings out to the right of every bar in
 *   the corridor, drops to the target row's clear band, and enters the port.
 *
 * `obstacles` are the bars (other than the source and target) the connector
 * must not cross. `fanSrcY` / `fanTgtY` offset the port vertically so several
 * links sharing a bar fan out instead of stacking. `points` are the corner
 * points of the route (pre-rounding), exposed for the global alignment pass.
 */
export function linkPath(
  from: GanttBarGeometry,
  to: GanttBarGeometry,
  type: GanttLinkType,
  fanSrcY = 0,
  fanTgtY = 0,
  obstacles: GanttBarGeometry[] = [],
): { d: string; points: Pt[]; arrow?: string; from: GanttLinkPoint; to: GanttLinkPoint } {
  // `type` is retained for the caller (dashed for ff/sf + tooltip); the port
  // convention is the same for every type.
  void type;
  const fr = from.left + from.width;
  const tl = to.left;
  const sy = from.top + from.height / 2 + fanSrcY;
  const ty = to.top + to.height / 2 + fanTgtY;
  const { points, arrow } = routePoints(from, to, fanSrcY, fanTgtY, obstacles);
  return {
    d: roundedPath(points, LINK_ELBOW_R),
    points,
    arrow,
    from: { x: fr, y: sy },
    to: { x: tl, y: ty },
  };
}

/** Max spacing (px) between adjacent ports of links sharing a bar edge. */
export const LINK_FAN_MAX_SPREAD = 16;
/** Min distance (px) from a port to the bar's top/bottom edge. */
export const LINK_FAN_INSET = 4;
/** How far past the bar's half height the hover handle may float (into the
 *  row's padding) so it can keep the fan's spacing from an occupied port. */
export const LINK_HANDLE_OVERHANG = 4;
/** Blank right gutter (px) past the timeline, so rightmost link routes and
 *  their arrowheads never sit at the scroll edge. */
export const LINK_RIGHT_GUTTER = 24;

/** Effective (visual) height a bar edge spans for port distribution. The bar
 *  paints `LINK_BAR_HEIGHT` tall, centred in its (taller) row. */
function fanBarHeight(g: GanttBarGeometry): number {
  return Math.min(g.height, LINK_BAR_HEIGHT);
}

/** Per-bar port slots: `out` = outgoing ports on the right edge, `inc` =
 *  incoming ports on the left edge, both as dense arrays of offsets from the
 *  bar's centre, in slot order (top → bottom). */
export interface GanttLinkFanOffsets {
  out: number[];
  inc: number[];
}

/** Result of {@link computeLinkFanOffsets}: dense per-bar slots for the hover
 *  handles, plus the per-link lookup the path router uses. */
export interface GanttLinkFanResult {
  bars: Map<string, GanttLinkFanOffsets>;
  /** One entry per input link (same order as `links`): the offset its source
   *  edge and target edge ports sit at. Links whose bars are missing get 0. */
  perLink: { src: number; tgt: number }[];
}

/**
 * Compute the vertical port slots for every bar edge.
 *
 * Links sharing a side are **ordered by the other endpoint's centre Y** (top
 * to bottom) and assigned evenly spaced slots: with n > 1 the spacing is
 * `min(LINK_FAN_MAX_SPREAD, (barH - 2·LINK_FAN_INSET) / (n - 1))`, so ports
 * fan across the bar edge without leaving it; a single link stays centred.
 * Ordering by the other endpoint keeps the fan from crossing at the ports.
 */
export function computeLinkFanOffsets(
  links: GanttLink[],
  bars: Map<string, GanttBarGeometry>,
): GanttLinkFanResult {
  const barMap = new Map<string, GanttLinkFanOffsets>();
  const perLink: { src: number; tgt: number }[] = links.map(() => ({ src: 0, tgt: 0 }));

  const group = (side: "out" | "inc", other: (l: GanttLink) => string): void => {
    const by = new Map<string, { y: number; idx: number }[]>();
    links.forEach((link, idx) => {
      const id = side === "out" ? link.source : link.target;
      const self = bars.get(id);
      const otherGeom = bars.get(other(link));
      if (!self || !otherGeom) return;
      const list = by.get(id);
      if (list) list.push({ y: otherGeom.top + otherGeom.height / 2, idx });
      else by.set(id, [{ y: otherGeom.top + otherGeom.height / 2, idx }]);
    });
    for (const [id, list] of by) {
      const g = bars.get(id);
      if (!g) continue;
      const n = list.length;
      const spacing =
        n > 1
          ? Math.min(LINK_FAN_MAX_SPREAD, (fanBarHeight(g) - 2 * LINK_FAN_INSET) / (n - 1))
          : 0;
      const sorted = [...list].sort((a, b) => a.y - b.y || a.idx - b.idx);
      const dense: number[] = [];
      sorted.forEach((item, i) => {
        const offset = (i - (n - 1) / 2) * spacing;
        dense.push(offset);
        perLink[item.idx][side === "out" ? "src" : "tgt"] = offset;
      });
      const o = barMap.get(id) ?? { out: [], inc: [] };
      if (side === "out") o.out = dense;
      else o.inc = dense;
      barMap.set(id, o);
    }
  };
  group("out", (l) => l.target);
  group("inc", (l) => l.source);
  return { bars: barMap, perLink };
}

/**
 * Pick the slot a *new* connector's hover handle / rubber preview should use
 * on a bar edge that already carries `taken` port offsets.
 *
 * The handle floats into the row's padding, so the slot range extends
 * {@link LINK_HANDLE_OVERHANG} past the bar's half height. Placement by
 * preference:
 * 1. the bar centre, when no port sits within a visible gap;
 * 2. otherwise `LINK_FAN_MAX_SPREAD` (the fan's own spacing) away from the
 *    nearest port, pushed toward the bar's edge (top first) — so the handle
 *    never sits on a port and reads with the same spacing the fan gives its
 *    ports;
 * 3. otherwise the centre of the largest free gap (a crowded side).
 * `0` when the side is free.
 */
export function fanHandleOffset(barHeight: number, taken: number[]): number {
  const n = taken.length;
  if (n === 0) return 0;
  const half = Math.min(barHeight, LINK_BAR_HEIGHT) / 2 + LINK_HANDLE_OVERHANG;
  // A slot reads clear of a port when the handle (r 5) keeps a visible gap
  // from the port's dot + halo.
  const clearOf = (x: number) =>
    taken.every((t) => Math.abs(x - t) >= LINK_PORT_R + 2.5 + 3);

  // 1) The centre.
  if (clearOf(0)) return 0;

  // 2) The fan's own spacing, toward the edge (top first). A port exactly at
  //    the centre belongs to both sides.
  for (const sign of [-1, 1] as const) {
    const sidePorts = taken.filter((t) => sign * t >= 0);
    if (sidePorts.length === 0) continue;
    const nearest = Math.min(...sidePorts.map((t) => Math.abs(t)));
    const cand = sign * (nearest + LINK_FAN_MAX_SPREAD);
    if (Math.abs(cand) <= half && clearOf(cand)) return cand;
  }

  // 3) Largest free gap, each taken port excluding its dot + halo zone.
  const EXCL = LINK_PORT_R + 2.5;
  const zones: [number, number][] = taken
    .map((p) => [Math.max(p - EXCL, -half), Math.min(p + EXCL, half)] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const free: [number, number][] = [];
  let cursor = -half;
  for (const [a, b] of zones) {
    if (a > cursor) free.push([cursor, a]);
    cursor = Math.max(cursor, b);
  }
  if (cursor < half) free.push([cursor, half]);
  if (free.length === 0) return 0;
  let best = free[0];
  for (const iv of free) if (iv[1] - iv[0] > best[1] - best[0]) best = iv;
  return (best[0] + best[1]) / 2;
}

/**
 * Align overlapping vertical channel runs so that connectors whose vertical
 * legs share a y-corridor drop into the **same column** (diagram-style: lines
 * may overlap one another, but never a bar). Runs are grouped by transitive
 * y-overlap; each group slides to the single clear column that (a) is clear of
 * every bar across the group's combined y-span and (b) lies inside every
 * member's valid window, so no horizontal stub is dragged over a bar.
 */
function alignVerticalChannels(
  routes: { points: Pt[]; channels: Channel[] }[],
  bars: GanttBarGeometry[],
): void {
  // Gather every channel with its current x and y-span.
  const chans: {
    route: number;
    seg: number;
    x: number;
    y1: number;
    y2: number;
    lo: number;
    hi: number;
  }[] = [];
  routes.forEach((r, ri) => {
    for (const ch of r.channels) {
      const a = r.points[ch.seg];
      const b = r.points[ch.seg + 1];
      chans.push({
        route: ri,
        seg: ch.seg,
        x: a[0],
        y1: Math.min(a[1], b[1]),
        y2: Math.max(a[1], b[1]),
        lo: ch.lo,
        hi: ch.hi,
      });
    }
  });
  if (chans.length < 2) return;

  // Union-find over channels whose y-spans overlap (they share a corridor).
  const parent = chans.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < chans.length; i++) {
    for (let j = i + 1; j < chans.length; j++) {
      if (Math.max(chans[i].y1, chans[j].y1) < Math.min(chans[i].y2, chans[j].y2)) {
        const ri = find(i);
        const rj = find(j);
        if (ri !== rj) parent[ri] = rj;
      }
    }
  }
  const groups = new Map<number, number[]>();
  chans.forEach((_, i) => {
    const g = find(i);
    const list = groups.get(g);
    if (list) list.push(i);
    else groups.set(g, [i]);
  });

  for (const idxs of groups.values()) {
    if (idxs.length < 2) continue;
    const runs = idxs.map((i) => chans[i]);
    const yLo = Math.min(...runs.map((r) => r.y1));
    const yHi = Math.max(...runs.map((r) => r.y2));
    const interLo = Math.max(...runs.map((r) => r.lo));
    const interHi = Math.min(...runs.map((r) => r.hi));
    if (interLo >= interHi) continue; // windows don't overlap — can't align
    if (Math.max(...runs.map((r) => r.x)) - Math.min(...runs.map((r) => r.x)) < 0.5) {
      continue; // already in the same column
    }
    // Columns clear of every bar across the combined y-span, at the passing
    // padding.
    const blocked = blockedIntervals(bars, yLo, yHi, LINK_PASS_PADDING);
    const meanX = runs.reduce((s, r) => s + r.x, 0) / runs.length;
    // Preferred: hug the nearest passed bar at exactly the passing padding —
    // the edges of the merged blocked intervals are precisely those positions
    // (a merged interval's left edge is P px left of its nearest bar's left
    // edge, its right edge P px right of its farthest bar's right edge). Pick
    // the hug closest to the members' mean column so the shared column sits
    // where the lines already run; when no bar is in the way, fall back to the
    // clear column nearest the mean (centred in the open gap).
    const merged = clipMerge(interLo, interHi, blocked);
    let targetX: number | null = null;
    let bestDist = Infinity;
    for (const [a, b] of merged) {
      for (const cand of [a, b]) {
        if (cand <= interLo || cand >= interHi) continue;
        const d = Math.abs(cand - meanX);
        if (d < bestDist) {
          bestDist = d;
          targetX = cand;
        }
      }
    }
    if (targetX == null) targetX = findClearX(interLo, interHi, meanX, merged);
    if (targetX == null) continue;
    for (const r of runs) {
      const pts = routes[r.route].points;
      pts[r.seg][0] = targetX;
      pts[r.seg + 1][0] = targetX;
    }
  }
}

/**
 * Resolve all visible links into draw-ready paths. Links referencing missing
 * bars are skipped (defensive — a removed task must not break the overlay).
 *
 * Links that share a source (fan-out) or a target (fan-in) take **ordered
 * even slots** on the bar edge ({@link computeLinkFanOffsets}): sorted by the
 * other endpoint's Y, evenly spaced and clamped to the bar, so ports never
 * overlap and lines never cross at the ports. After every route is computed,
 * a global pass aligns overlapping vertical channels into shared columns.
 */
export function computeLinkPaths(
  links: GanttLink[],
  bars: Map<string, GanttBarGeometry>,
  defaultColor: TrueColor,
): GanttLinkPath[] {
  // Port slots per bar edge (per-link lookup, dense per-bar for the handles).
  const fan = computeLinkFanOffsets(links, bars);

  const allBars = [...bars.values()];
  const routes: {
    link: GanttLink;
    points: Pt[];
    channels: Channel[];
    arrow?: string;
    fromPt: GanttLinkPoint;
    toPt: GanttLinkPoint;
    color: TrueColor;
    type: GanttLinkType;
  }[] = [];

  for (let li = 0; li < links.length; li++) {
    const link = links[li];
    const from = bars.get(link.source);
    const to = bars.get(link.target);
    if (!from || !to) continue;
    const type: GanttLinkType = link.type ?? "fs";

    // Port slot for this link on each bar edge (0 = centred).
    const fanSrcY = fan.perLink[li].src;
    const fanTgtY = fan.perLink[li].tgt;

    // Every bar (except the two endpoints) whose row the connector's vertical
    // run passes through — those are the bars the route must not cross.
    const fr = from.left + from.width;
    const tl = to.left;
    const sy = from.top + from.height / 2 + fanSrcY;
    const ty = to.top + to.height / 2 + fanTgtY;
    const lo = Math.min(sy, ty);
    const hi = Math.max(sy, ty);
    const obstacles: GanttBarGeometry[] = [];
    for (const g of allBars) {
      if (g === from || g === to) continue;
      const [bo, bh] = barYExtent(g);
      if (bo < hi && bh > lo) obstacles.push(g);
    }

    const { points, channels, arrow } = routePoints(from, to, fanSrcY, fanTgtY, obstacles);
    routes.push({
      link,
      points,
      channels,
      arrow,
      fromPt: { x: fr, y: sy },
      toPt: { x: tl, y: ty },
      color: link.color ?? defaultColor,
      type,
    });
  }

  // Global pass: slide overlapping vertical channels into shared columns.
  alignVerticalChannels(routes, allBars);

  const paths: GanttLinkPath[] = [];
  for (const r of routes) {
    paths.push({
      link: r.link,
      d: roundedPath(r.points, LINK_ELBOW_R),
      points: r.points,
      arrow: r.arrow,
      from: r.fromPt,
      to: r.toPt,
      color: r.color,
      type: r.type,
    });
  }
  return paths;
}

/**
 * Compute the rubber-band preview path for a link being dragged from `source`
 * toward a pointer at (px, py).
 *
 * - When `target` is supplied (the bar currently under the pointer), the
 *   preview is the *exact* committed-connector path — the same best-path,
 *   collision-free right→left route the arrow will take once dropped, so the
 *   preview never crosses a bar.
 * - When there is no target (dangling mid-drag), the preview runs from the
 *   source's right port to the pointer, routed to clear the source bar and
 *   every other bar: it descends/ascends in the clear column nearest the
 *   pointer (stepping into the clear band on the pointer's side when the
 *   pointer is to the left of the source's right edge).
 *
 * `obstacles` are the bars (other than the source and any snapped target) the
 * preview must not cross — normally every other visible bar.
 *
 * Returns the same shape as {@link linkPath} so the layer can render the
 * preview identically to a committed arrow (arrowhead + port nodes).
 */
export function rubberLinkPath(
  source: GanttBarGeometry,
  px: number,
  py: number,
  target?: GanttBarGeometry,
  obstacles: GanttBarGeometry[] = [],
  /** Vertical slot the rubber band departs from on the source edge (the
   *  hover-handle's {@link fanHandleOffset}), so the preview never starts on an
   *  existing port. Defaults to the bar centre. */
  fromOffset = 0,
): { d: string; arrow?: string; from: GanttLinkPoint; to: GanttLinkPoint } {
  if (target) {
    return linkPath(source, target, "fs", 0, 0, obstacles);
  }
  const fr = source.left + source.width;
  const sy = source.top + source.height / 2 + fromOffset;
  const fromPt: GanttLinkPoint = { x: fr, y: sy };
  const toPt: GanttLinkPoint = { x: px, y: py };
  const depart = LINK_PORT_R + 1;
  const start: Pt = [fr + depart, sy];
  const end: Pt = [px, py];

  // A clear column nearest the pointer (never over the source bar, never over
  // another bar in the corridor between the source row and the pointer).
  const blocked = blockedIntervals(obstacles, sy, py, LINK_PASS_PADDING);
  const x =
    px >= fr
      ? findClearX(fr + 1, Infinity, px, blocked) ?? fr + 1
      : findClearX(-Infinity, fr - 1, px, blocked) ?? fr - 1;

  if (px >= fr) {
    // Pointer to the right of the source's right edge: out-and-over, clear of
    // the source bar and of every bar the run passes.
    const d = roundedPath([start, [x, sy], [x, py], end], LINK_ELBOW_R);
    return { d, from: fromPt, to: toPt };
  }
  // Pointer to the left of the source's right edge: step into the clear band
  // on the pointer's side, travel across it (a row-boundary line is clear of
  // every bar), then down/up to the clear column by the pointer — never
  // across the source bar or any other bar.
  const bandY = py > sy ? source.top + source.height : source.top;
  const d = roundedPath([start, [start[0], bandY], [x, bandY], [x, py], end], LINK_ELBOW_R);
  return { d, from: fromPt, to: toPt };
}

/**
 * Anchor a link-creation drag: given the pointer position relative to a bar,
 * return which edge the new link departs from (`"out"` = right edge, the
 * common FS source side). Used to aim the rubber-band preview.
 */
export function linkSourceAnchor(
  bar: GanttBarGeometry,
  pointerX: number,
): { x: number; y: number; side: 1 | -1 } {
  const midX = bar.left + bar.width / 2;
  const side: 1 | -1 = pointerX >= midX ? 1 : -1;
  const x = side === 1 ? bar.left + bar.width : bar.left;
  return { x, y: bar.top + bar.height / 2, side };
}

/**
 * Pick radius (px) for selecting a dependency: the pointer selects the
 * nearest link whose route passes within this many px of it. The visible
 * stroke is ~1.5px wide, so without this, grabbing an arrow would demand
 * pixel-perfect aiming.
 */
export const LINK_HIT_RADIUS = 6;

function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Perpendicular distance from (x, y) to a polyline (Infinity when empty). */
export function linkDistance(points: readonly GanttPt[], x: number, y: number): number {
  let best = Infinity;
  for (let i = 0; i + 1 < points.length; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    const d = distToSegment(x, y, ax, ay, bx, by);
    if (d < best) best = d;
    if (best === 0) break;
  }
  return best;
}

/**
 * The link the pointer at (x, y) is aiming at: the nearest route within
 * {@link LINK_HIT_RADIUS}. When two connectors run close together the closer
 * one wins (exact ties go to the earlier link), so a generous radius never
 * makes neighbouring arrows ambiguous.
 */
export function pickLinkAt(
  paths: readonly GanttLinkPath[],
  x: number,
  y: number,
  radius: number = LINK_HIT_RADIUS,
): GanttLinkPath | null {
  let best: GanttLinkPath | null = null;
  let bestDist = Infinity;
  for (const p of paths) {
    const d = linkDistance(p.points, x, y);
    if (d <= radius && d < bestDist) {
      best = p;
      bestDist = d;
    }
  }
  return best;
}

/** Today marker x for a `today` date within the view. */
export function todayX(today: number, viewStart: number, pxPerDay: number): number {
  const t = startOfDay(today);
  return (t - viewStart) * (1 / MS_PER_DAY) * pxPerDay;
}

/** Convenience: duration label from a drag state's live dates. */
export function dragDurationLabel(start: number, end: number): string {
  return `${Math.max(0, Math.round(daysBetween(start, end) * 10) / 10)}d`;
}

/**
 * Shared annotation-card layout: resolves callout card positions for ALL
 * annotations of a chart in one pass so the cards never overlap each other.
 *
 * Pure function — the root runs it (see `annotationLayout` in ChartRoot)
 * and the <Annotation> components consume their own rect. Greedy in DOM
 * order: earlier annotations keep their requested placement, later ones
 * move (vertical lane stacking) when their preferred spot is taken.
 */

/** Fixed card height (two rows): matches the Annotation component constants. */
export const ANNOTATION_CARD_H = 50;
/** Minimum gap between two card rects. */
export const ANNOTATION_GAP = 6;
/** Offset between the marker point and the card edge. */
const ANNOTATION_OFFSET = 14;

export type AnnotationSide = "top" | "bottom" | "left" | "right";

export interface AnnotationCardInput {
  /** Marker pixel position (already mapped through the scales). */
  px: number;
  py: number;
  /** Requested side; "auto" when the prop is absent. */
  placement: "auto" | AnnotationSide;
  /** Card width (char-count heuristic). */
  cardW: number;
}

export interface AnnotationCardRect {
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  /** Where the card ended up relative to its marker (leader anchoring). */
  side: AnnotationSide;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AnnotationBounds {
  area: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
}

/** Inclusive-overlap test with a uniform gap on all sides. */
function overlaps(a: Rect, b: Rect, gap: number): boolean {
  return (
    a.x < b.x + b.w + gap &&
    a.x + a.w + gap > b.x &&
    a.y < b.y + b.h + gap &&
    a.y + a.h + gap > b.y
  );
}

/** Raw candidate rect for one side (mirrors the component's geometry). */
function sideRect(
  px: number,
  py: number,
  w: number,
  side: AnnotationSide | "auto-legacy",
  bounds?: AnnotationBounds,
): Rect {
  if (side === "top")
    return { x: px - w / 2, y: py - ANNOTATION_CARD_H - ANNOTATION_OFFSET, w, h: ANNOTATION_CARD_H };
  if (side === "bottom")
    return { x: px - w / 2, y: py + ANNOTATION_OFFSET, w, h: ANNOTATION_CARD_H };
  if (side === "left")
    return { x: px - w - ANNOTATION_OFFSET, y: py - ANNOTATION_CARD_H / 2, w, h: ANNOTATION_CARD_H };
  if (side === "right")
    return { x: px + ANNOTATION_OFFSET, y: py - ANNOTATION_CARD_H / 2, w, h: ANNOTATION_CARD_H };
  // auto-legacy: the single-card default (top-left of the marker) with the
  // historical edge flips — kept so single-annotation charts are unchanged.
  let x = px - w - ANNOTATION_OFFSET;
  let y = py - ANNOTATION_CARD_H - 12;
  if (bounds) {
    if (x < bounds.area.x - 40) x = px + ANNOTATION_OFFSET;
    if (y < 4) y = py + ANNOTATION_OFFSET;
  }
  return { x, y, w, h: ANNOTATION_CARD_H };
}

/** The component's edge logic: flip below the point at the plot top, clamp
 *  into the chart box. */
function clampRect(
  r: Rect,
  py: number,
  bounds: AnnotationBounds,
): Rect {
  const { area, width, height } = bounds;
  const plotBottom = area.y + area.height;
  let y = r.y;
  if (y < area.y) {
    const flipped = py + ANNOTATION_OFFSET;
    y = flipped + ANNOTATION_CARD_H <= plotBottom ? flipped : area.y;
  } else if (y + ANNOTATION_CARD_H > plotBottom) {
    y = Math.max(area.y, plotBottom - ANNOTATION_CARD_H);
  }
  y = Math.max(2, Math.min(y, height - ANNOTATION_CARD_H - 2));
  const x = Math.max(2, Math.min(r.x, width - r.w - 2));
  return { x, y, w: r.w, h: r.h };
}

/** Candidate order: requested side first, then the rest; auto leads with
 *  the legacy single-card position. */
function candidateSides(
  placement: AnnotationCardInput["placement"],
): Array<AnnotationSide | "auto-legacy"> {
  const all: Array<AnnotationSide | "auto-legacy"> =
    placement === "auto"
      ? ["auto-legacy", "right", "left", "top", "bottom"]
      : [placement, "top", "right", "left", "bottom"];
  return all.filter((s, i) => all.indexOf(s) === i);
}

/** Where the rect ended up relative to its marker (leader anchoring). */
function sideOf(rect: Rect, px: number, py: number): AnnotationSide {
  const dx = rect.x + rect.w / 2 - px;
  const dy = rect.y + rect.h / 2 - py;
  if (Math.abs(dy) >= Math.abs(dx))
    return dy < 0 ? "top" : "bottom";
  return dx < 0 ? "left" : "right";
}

/**
 * Resolve non-overlapping card rects for all annotations, in order.
 * Earlier annotations keep their preferred spot; later ones shift into a
 * free vertical lane (or, if the plot is full, stay clamped — never an
 * infinite loop).
 */
export function layoutAnnotationCards(
  inputs: AnnotationCardInput[],
  bounds: AnnotationBounds,
): AnnotationCardRect[] {
  const placed: Rect[] = [];
  return inputs.map((inp) => {
    let chosen: Rect | null = null;
    for (const side of candidateSides(inp.placement)) {
      const rect = clampRect(sideRect(inp.px, inp.py, inp.cardW, side, bounds), inp.py, bounds);
      if (!placed.some((p) => overlaps(p, rect, ANNOTATION_GAP))) {
        chosen = rect;
        break;
      }
    }
    if (chosen === null) {
      // Every preferred spot is taken: start from the first candidate and
      // walk into a free vertical lane away from the marker.
      let rect = clampRect(
        sideRect(
          inp.px,
          inp.py,
          inp.cardW,
          candidateSides(inp.placement)[0],
          bounds,
        ),
        inp.py,
        bounds,
      );
      const dir = rect.y + rect.h / 2 >= inp.py ? 1 : -1;
      const step = ANNOTATION_CARD_H + ANNOTATION_GAP;
      const minY = 2;
      const maxY = bounds.height - ANNOTATION_CARD_H - 2;
      for (let i = 0; i < 24; i++) {
        if (!placed.some((p) => overlaps(p, rect, ANNOTATION_GAP))) break;
        const next = rect.y + dir * step;
        if (next < minY || next > maxY) break;
        rect = { ...rect, y: next };
      }
      chosen = rect;
    }
    placed.push(chosen);
    return {
      cardX: chosen.x,
      cardY: chosen.y,
      cardW: chosen.w,
      cardH: chosen.h,
      side: sideOf(chosen, inp.px, inp.py),
    };
  });
}

import { describe, expect, it } from "vitest";
import {
  ANNOTATION_CARD_H,
  ANNOTATION_GAP,
  layoutAnnotationCards,
  type AnnotationBounds,
} from "./annotation-layout";

const bounds: AnnotationBounds = {
  area: { x: 60, y: 40, width: 680, height: 300 },
  width: 800,
  height: 380,
};

/** Two rects are free of collision when they don't touch even with the
 *  minimum gap. */
function collisionFree(a: { cardX: number; cardY: number }, b: { cardX: number; cardY: number }, w = 120) {
  const ix = a.cardX < b.cardX + w + ANNOTATION_GAP && a.cardX + w + ANNOTATION_GAP > b.cardX;
  const iy = a.cardY < b.cardY + ANNOTATION_CARD_H + ANNOTATION_GAP && a.cardY + ANNOTATION_CARD_H + ANNOTATION_GAP > b.cardY;
  return !(ix && iy);
}

describe("layoutAnnotationCards", () => {
  it("keeps the requested placement when nothing collides", () => {
    const [a] = layoutAnnotationCards(
      [{ px: 400, py: 200, placement: "right", cardW: 120 }],
      bounds,
    );
    expect(a.cardX).toBe(400 + 14);
    expect(a.cardY).toBe(200 - ANNOTATION_CARD_H / 2);
    expect(a.side).toBe("right");
  });

  it("keeps the legacy single-card auto position", () => {
    const [a] = layoutAnnotationCards(
      [{ px: 400, py: 200, placement: "auto", cardW: 120 }],
      bounds,
    );
    // auto-legacy: top-left of the marker, 14px / 12px offsets.
    expect(a.cardX).toBe(400 - 120 - 14);
    expect(a.cardY).toBe(200 - ANNOTATION_CARD_H - 12);
  });

  it("shifts a colliding card into a free lane", () => {
    const [a, b] = layoutAnnotationCards(
      [
        { px: 400, py: 200, placement: "right", cardW: 120 },
        { px: 420, py: 210, placement: "right", cardW: 120 },
      ],
      bounds,
    );
    expect(a.cardX).toBe(414);
    // b's preferred spot collides with a — it must not.
    expect(collisionFree(a, b)).toBe(true);
    // b resolved on a different side of its marker.
    expect(b.side).not.toBe("right");
  });

  it("is order-stable: earlier annotations keep the spot", () => {
    const first = layoutAnnotationCards(
      [
        { px: 400, py: 200, placement: "right", cardW: 120 },
        { px: 420, py: 210, placement: "right", cardW: 120 },
      ],
      bounds,
    );
    const swapped = layoutAnnotationCards(
      [
        { px: 420, py: 210, placement: "right", cardW: 120 },
        { px: 400, py: 200, placement: "right", cardW: 120 },
      ],
      bounds,
    );
    // The first card of each run keeps its requested position.
    expect(first[0].cardX).toBe(414);
    expect(first[0].cardY).toBe(200 - ANNOTATION_CARD_H / 2);
    expect(swapped[0].cardX).toBe(434);
    expect(swapped[0].cardY).toBe(210 - ANNOTATION_CARD_H / 2);
    expect(collisionFree(first[0], first[1])).toBe(true);
    expect(collisionFree(swapped[0], swapped[1])).toBe(true);
  });

  it("flips a top card below the point at the plot top", () => {
    const [a] = layoutAnnotationCards(
      [{ px: 400, py: 48, placement: "top", cardW: 120 }],
      bounds,
    );
    // A top card at py=48 would leave the plot — it flips below the point.
    expect(a.cardY).toBe(48 + 14);
    expect(a.side).toBe("bottom");
  });

  it("tries the next side when the requested side is occupied", () => {
    const [a, b, c] = layoutAnnotationCards(
      [
        // All three want the same right-side spot at (400, 200).
        { px: 400, py: 200, placement: "right", cardW: 120 },
        { px: 400, py: 200, placement: "right", cardW: 120 },
        { px: 400, py: 200, placement: "right", cardW: 120 },
      ],
      bounds,
    );
    expect(a.cardX).toBe(414);
    // b and c are pushed into free lanes below/above — never overlapping.
    expect(collisionFree(a, b)).toBe(true);
    expect(collisionFree(a, c)).toBe(true);
    expect(collisionFree(b, c)).toBe(true);
  });

  it("clamps every card into the chart box", () => {
    const [a, b, c] = layoutAnnotationCards(
      [
        { px: 8, py: 372, placement: "left", cardW: 200 },
        { px: 792, py: 372, placement: "right", cardW: 200 },
        { px: 400, py: 372, placement: "bottom", cardW: 200 },
      ],
      bounds,
    );
    for (const r of [a, b, c]) {
      expect(r.cardX).toBeGreaterThanOrEqual(2);
      expect(r.cardX + r.cardW).toBeLessThanOrEqual(bounds.width - 2);
      expect(r.cardY).toBeGreaterThanOrEqual(2);
      expect(r.cardY + r.cardH).toBeLessThanOrEqual(bounds.height - 2);
    }
  });

  it("handles an empty input list", () => {
    expect(layoutAnnotationCards([], bounds)).toEqual([]);
  });
});

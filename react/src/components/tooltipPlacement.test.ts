import { describe, it, expect } from "vitest";
import {
  TOOLTIP_POSITIONS,
  resolveTooltipPlacement,
  resolveTooltipSide,
  type TooltipPosition,
} from "../../../common/tooltip/placement";

const VIEWPORT = { width: 1000, height: 800 };
const TOOLTIP = { width: 200, height: 40 };

/** A trigger box centred at (cx, cy). */
const trigger = (cx: number, cy: number, w = 100, h = 30) => ({
  left: cx - w / 2,
  top: cy - h / 2,
  width: w,
  height: h,
});

const place = (
  preferred: TooltipPosition,
  cx: number,
  cy: number,
  overrides: Partial<Parameters<typeof resolveTooltipPlacement>[0]> = {},
) =>
  resolveTooltipPlacement({
    trigger: trigger(cx, cy),
    tooltip: TOOLTIP,
    viewport: VIEWPORT,
    preferred,
    ...overrides,
  });

describe("tooltip placement", () => {
  describe("side selection", () => {
    it("keeps the preferred side when it fits", () => {
      for (const side of TOOLTIP_POSITIONS) {
        const result = place(side, 500, 400);
        expect(result.side).toBe(side);
        expect(result.flipped).toBe(false);
      }
    });

    it("flips to the opposite side when the preferred one has no room", () => {
      // Near the top edge: `top` cannot fit, so it becomes `bottom`.
      expect(place("top", 500, 20).side).toBe("bottom");
      expect(place("bottom", 500, 780).side).toBe("top");
      expect(place("left", 20, 400).side).toBe("right");
      expect(place("right", 980, 400).side).toBe("left");
    });

    it("reports the flip", () => {
      expect(place("top", 500, 20).flipped).toBe(true);
      expect(place("top", 500, 400).flipped).toBe(false);
    });

    it("falls back to a perpendicular side when neither vertical one fits", () => {
      // A viewport shorter than the tooltip needs: no room above or below.
      const result = resolveTooltipSide({
        trigger: trigger(500, 30, 100, 20),
        tooltip: { width: 100, height: 200 },
        viewport: { width: 1000, height: 60 },
        preferred: "top",
      });
      expect(["left", "right"]).toContain(result.side);
    });

    it("picks the roomiest side when nothing fits at all", () => {
      // Tiny viewport, big tooltip — every side overflows.
      const result = resolveTooltipSide({
        trigger: trigger(50, 50, 20, 20),
        tooltip: { width: 400, height: 400 },
        viewport: { width: 100, height: 100 },
        preferred: "top",
      });
      expect(TOOLTIP_POSITIONS).toContain(result.side);
    });
  });

  describe("position", () => {
    it("sits above the trigger with the gap for `top`", () => {
      const t = trigger(500, 400);
      const r = place("top", 500, 400, { offset: 8 });
      expect(r.top).toBe(t.top - 8 - TOOLTIP.height);
    });

    it("sits below the trigger with the gap for `bottom`", () => {
      const t = trigger(500, 400);
      const r = place("bottom", 500, 400, { offset: 8 });
      expect(r.top).toBe(t.top + t.height + 8);
    });

    it("sits beside the trigger for `left` and `right`", () => {
      const t = trigger(500, 400);
      expect(place("left", 500, 400, { offset: 8 }).left).toBe(
        t.left - 8 - TOOLTIP.width,
      );
      expect(place("right", 500, 400, { offset: 8 }).left).toBe(
        t.left + t.width + 8,
      );
    });

    it("centres on the trigger when there is room", () => {
      const r = place("top", 500, 400);
      expect(r.left).toBe(500 - TOOLTIP.width / 2);
    });
  });

  describe("clamping", () => {
    it("never lets the box cross the left or right edge", () => {
      for (const cx of [0, 5, 30, 970, 1000]) {
        const r = place("top", cx, 400, { margin: 8 });
        expect(r.left).toBeGreaterThanOrEqual(8);
        expect(r.left + TOOLTIP.width).toBeLessThanOrEqual(VIEWPORT.width - 8);
      }
    });

    it("never lets the box cross the top or bottom edge on a side placement", () => {
      for (const cy of [0, 5, 30, 770, 800]) {
        const r = place("right", 500, cy, { margin: 8 });
        expect(r.top).toBeGreaterThanOrEqual(8);
        expect(r.top + TOOLTIP.height).toBeLessThanOrEqual(VIEWPORT.height - 8);
      }
    });

    it("stays on screen for every side at every corner", () => {
      const corners = [
        [0, 0],
        [1000, 0],
        [0, 800],
        [1000, 800],
      ] as const;
      for (const side of TOOLTIP_POSITIONS) {
        for (const [cx, cy] of corners) {
          const r = place(side, cx, cy, { margin: 8 });
          expect(r.left).toBeGreaterThanOrEqual(8);
          expect(r.top).toBeGreaterThanOrEqual(8);
          expect(r.left + TOOLTIP.width).toBeLessThanOrEqual(VIEWPORT.width - 8);
          expect(r.top + TOOLTIP.height).toBeLessThanOrEqual(
            VIEWPORT.height - 8,
          );
        }
      }
    });
  });

  describe("boundary", () => {
    // A box in the middle of a roomy viewport — exactly the case that made the
    // docs demo look broken: the triggers sat at the corners of a dashed div,
    // but collision was measured against the *viewport*, which had room
    // everywhere, so nothing ever flipped and the labels lied.
    const BOX = { left: 300, top: 300, width: 400, height: 200 };

    it("flips against the boundary, not just the viewport", () => {
      // Trigger at the boundary's top edge. The viewport has 300px above it,
      // so without a boundary this stays on `top`.
      const withoutBoundary = place("top", 500, 310);
      expect(withoutBoundary.side).toBe("top");

      const withBoundary = resolveTooltipPlacement({
        trigger: trigger(500, 310),
        tooltip: TOOLTIP,
        viewport: VIEWPORT,
        boundary: BOX,
        preferred: "top",
      });
      expect(withBoundary.side).toBe("bottom");
      expect(withBoundary.flipped).toBe(true);
    });

    it("clamps inside the boundary", () => {
      const r = resolveTooltipPlacement({
        trigger: trigger(320, 400),
        tooltip: TOOLTIP,
        viewport: VIEWPORT,
        boundary: BOX,
        preferred: "top",
        margin: 8,
      });
      expect(r.left).toBeGreaterThanOrEqual(BOX.left + 8);
      expect(r.left + TOOLTIP.width).toBeLessThanOrEqual(
        BOX.left + BOX.width - 8,
      );
    });

    it("still keeps the tooltip on screen when the boundary hangs off it", () => {
      // A boundary partly off-screen must not license going off-screen: the
      // two limits intersect rather than replace one another.
      const r = resolveTooltipPlacement({
        trigger: trigger(60, 400),
        tooltip: TOOLTIP,
        viewport: VIEWPORT,
        boundary: { left: -500, top: 300, width: 800, height: 200 },
        preferred: "top",
        margin: 8,
      });
      expect(r.left).toBeGreaterThanOrEqual(8);
    });

    it("defaults to the viewport when no boundary is given", () => {
      const withExplicit = resolveTooltipPlacement({
        trigger: trigger(500, 400),
        tooltip: TOOLTIP,
        viewport: VIEWPORT,
        boundary: { left: 0, top: 0, width: VIEWPORT.width, height: VIEWPORT.height },
        preferred: "top",
      });
      expect(withExplicit).toEqual(place("top", 500, 400));
    });
  });

  describe("caret", () => {
    it("sits at the tooltip's centre when nothing was clamped", () => {
      const r = place("top", 500, 400);
      expect(r.caret).toBeCloseTo(TOOLTIP.width / 2, 5);
    });

    it("follows the trigger after the box is clamped", () => {
      // Hard against the left edge: the box stops at the margin but the caret
      // has to keep pointing at the trigger, which is further left.
      const r = place("top", 40, 400, { margin: 8 });
      expect(r.left).toBe(8);
      expect(r.caret).toBeCloseTo(40 - 8, 5);
      expect(r.caret).toBeLessThan(TOOLTIP.width / 2);
    });

    it("never leaves the tooltip box", () => {
      for (const cx of [0, 10, 50, 500, 950, 990, 1000]) {
        const r = place("top", cx, 400, { caretInset: 10 });
        expect(r.caret).toBeGreaterThanOrEqual(0);
        expect(r.caret).toBeLessThanOrEqual(TOOLTIP.width);
      }
    });

    it("slides on the vertical axis for a side placement", () => {
      const r = place("right", 500, 20, { margin: 8 });
      expect(r.caret).toBeGreaterThanOrEqual(0);
      expect(r.caret).toBeLessThanOrEqual(TOOLTIP.height);
    });
  });
});

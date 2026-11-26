/**
 * The toast card's close affordance is geometry, and geometry is testable
 * even in jsdom — jsdom lays nothing out, but it cannot make `h-6` mean
 * something else.
 *
 * Two claims live here, both from the review that asked for the button to sit
 * *on* the corner and take less space:
 *
 *   - it hugs the corner. The card's own padding is what parked it a full step
 *     off its border, so every size carries a `closeInset` that hands half of
 *     that padding back. Half, never more: past that the button leaves the
 *     card's border box and the corner it was asked to sit on becomes a
 *     hanging widget.
 *   - it takes less space. The box is one rung narrower than the copy row
 *     beside it, and the ladder stops at 24px — WCAG 2.5.8's minimum target.
 *     A target is not decoration: "make the × smaller" has a floor, and the
 *     floor is a number, not a preference.
 */
import { describe, it, expect } from "vitest";
import { CONTROL_SIZES, getToastSizeTokens } from "../../../common/theme/Theme";

/** Tailwind's 0.25rem grid: `h-6` is 24px, `py-3` is 12px. */
const pxOf = (cls: string, prop: string): number => {
  const m = new RegExp(`(?:^|\\s)-?${prop}-(\\d+(?:\\.\\d+)?)(?=\\s|$)`).exec(cls);
  if (!m) throw new Error(`no ${prop}-N in "${cls}"`);
  return Number(m[1]) * 4;
};

const insetOf = (size: Parameters<typeof getToastSizeTokens>[0]) => {
  const { closeInset, container } = getToastSizeTokens(size);
  return { x: pxOf(closeInset, "mr"), y: pxOf(closeInset, "mt"), padX: pxOf(container, "px"), padY: pxOf(container, "py") };
};

describe("toast close button", () => {
  it("sits on the corner, by half the card's padding and no further", () => {
    for (const size of CONTROL_SIZES) {
      const { x, y, padX, padY } = insetOf(size);
      // Negative, so a pull toward the border — and never a pull that puts
      // the button outside the card.
      expect(x).toBeGreaterThan(0);
      expect(y).toBeGreaterThan(0);
      expect(x).toBeLessThanOrEqual(padX / 2);
      expect(y).toBeLessThanOrEqual(padY / 2);
      // Both axes: a button lifted but not shifted is still parked against the
      // text column, which is the half-fix that reads as a misalignment.
      expect(closeInsetHasBothAxes(size)).toBe(true);
    }
  });

  it("is a square box, and the ladder bottoms out at the 24px target", () => {
    const boxes = CONTROL_SIZES.map((size) => {
      const { close } = getToastSizeTokens(size);
      const h = pxOf(close, "h");
      const w = pxOf(close, "w");
      expect(w).toBe(h);
      return h;
    });

    // One step at a time, never shrinking as the card grows: an `xl` card whose
    // × is smaller than the `md` one is the bug this asserts against.
    for (let i = 1; i < boxes.length; i++)
      expect(boxes[i]).toBeGreaterThanOrEqual(boxes[i - 1]);

    // `xs` is the documented exception — a 20px box on a 20px-tall card.
    expect(boxes.slice(1)).toEqual([24, 24, 28, 32]);
    for (const box of boxes.slice(1)) expect(box).toBeGreaterThanOrEqual(24);
  });

  it("shrinks the box without shrinking the glyph it carries", () => {
    // The rung came down; the glyph did not, so the × reads as a corner mark
    // rather than as a speck inside a 24px box.
    expect(getToastSizeTokens("md").closeIcon).toBe("sm");
    expect(getToastSizeTokens("lg").closeIcon).toBe("sm");
    expect(getToastSizeTokens("xl").closeIcon).toBe("md");
  });
});

function closeInsetHasBothAxes(size: Parameters<typeof getToastSizeTokens>[0]): boolean {
  const { closeInset } = getToastSizeTokens(size);
  return /(^|\s)-mt-[\d.]+/.test(closeInset) && /(^|\s)-mr-[\d.]+/.test(closeInset);
}

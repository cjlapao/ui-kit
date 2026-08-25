import { describe, it, expect } from "vitest";
import { computeLayout, LAYOUT_SIZES, resolveMargins } from "./layout";

const FULL = {
  width: 900,
  height: 500,
  hasTitle: true,
  hasSubtitle: true,
  hasLegend: true,
  hasXAxis: true,
  hasYAxis: true,
  hasRightYAxis: true,
  hasCaption: true,
};

describe("resolveMargins", () => {
  it("uses defaults when nothing is provided", () => {
    expect(resolveMargins(undefined)).toEqual({
      top: LAYOUT_SIZES.defaultMargin.top,
      right: LAYOUT_SIZES.defaultMargin.right,
      bottom: LAYOUT_SIZES.defaultMargin.bottom,
      left: LAYOUT_SIZES.defaultMargin.left,
    });
  });

  it("overrides per side", () => {
    expect(resolveMargins({ left: 99 })).toEqual({
      top: LAYOUT_SIZES.defaultMargin.top,
      right: LAYOUT_SIZES.defaultMargin.right,
      bottom: LAYOUT_SIZES.defaultMargin.bottom,
      left: 99,
    });
  });
});

describe("computeLayout", () => {
  it("reserves vertical space in documented order", () => {
    const l = computeLayout({ ...FULL, hasRightYAxis: false, hasCaption: false });
    const { chartArea: a, margin } = l;
    expect(a.y).toBe(
      margin.top + LAYOUT_SIZES.title + LAYOUT_SIZES.subtitle + LAYOUT_SIZES.legend,
    );
    expect(a.height).toBe(
      l.height -
        margin.top -
        margin.bottom -
        LAYOUT_SIZES.title -
        LAYOUT_SIZES.subtitle -
        LAYOUT_SIZES.legend -
        LAYOUT_SIZES.xAxis,
    );
  });

  it("reserves horizontal space for y axes", () => {
    const single = computeLayout({ ...FULL, hasRightYAxis: false });
    const dual = computeLayout(FULL);
    expect(single.chartArea.width).toBe(
      dual.chartArea.width + LAYOUT_SIZES.rightYAxis,
    );
    expect(single.chartArea.x).toBe(
      single.margin.left + LAYOUT_SIZES.yAxis,
    );
  });

  it("frees the legend row when there is no legend", () => {
    const withLegend = computeLayout({ ...FULL, hasRightYAxis: false });
    const noLegend = computeLayout({ ...FULL, hasLegend: false, hasRightYAxis: false });
    expect(noLegend.chartArea.y).toBe(
      withLegend.chartArea.y - LAYOUT_SIZES.legend,
    );
    expect(noLegend.chartArea.height).toBe(
      withLegend.chartArea.height + LAYOUT_SIZES.legend,
    );
  });

  it("reserves the legend strip at the bottom for bottom legends", () => {
    const top = computeLayout({ ...FULL, hasRightYAxis: false });
    const bottom = computeLayout({
      ...FULL,
      hasRightYAxis: false,
      legendPosition: "bottom",
    });
    // bottom legend: plot keeps the top edge (no strip under the title)…
    expect(bottom.chartArea.y).toBe(
      top.chartArea.y - LAYOUT_SIZES.legend,
    );
    // …but still loses the legend height (now from the bottom, above the
    // x-axis label row) — same plot height, sitting one legend strip
    // higher than the top-legend layout.
    expect(bottom.chartArea.height).toBe(top.chartArea.height);
    expect(bottom.chartArea.y + bottom.chartArea.height).toBe(
      top.chartArea.y + top.chartArea.height - LAYOUT_SIZES.legend,
    );
  });

  it("never produces negative areas", () => {
    const l = computeLayout({
      width: 50,
      height: 50,
      hasXAxis: true,
      hasYAxis: true,
      hasLegend: true,
      hasTitle: true,
    });
    expect(l.chartArea.width).toBeGreaterThanOrEqual(0);
    expect(l.chartArea.height).toBeGreaterThanOrEqual(0);
  });

  it("respects explicit margins", () => {
    const l = computeLayout({
      width: 100,
      height: 100,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      hasYAxis: false,
      hasXAxis: false,
    });
    expect(l.chartArea).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });
});

import { describe, it, expect } from "vitest";
import {
  DEFAULT_SERIES_PALETTE,
  getChartTheme,
  resolveColor,
  resolveToneHex,
  TRUE_COLOR_HEX,
} from "./theme";

describe("TRUE_COLOR_HEX", () => {
  it("covers the 21 kit tones", () => {
    const expected = [
      "red", "orange", "amber", "yellow", "lime", "green", "emerald",
      "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
      "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral",
      "stone",
    ];
    for (const tone of expected) {
      expect(TRUE_COLOR_HEX[tone], `missing tone ${tone}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("resolveColor", () => {
  it("passes hex strings through", () => {
    const c = resolveColor("#ff0000", 0);
    expect(c.stroke).toBe("#ff0000");
    expect(c.fill).toBe("#ff0000");
    expect(c.isGradient).toBe(false);
  });

  it("resolves kit tone names to hex", () => {
    expect(resolveColor("purple", 0).stroke).toBe(TRUE_COLOR_HEX.purple);
    expect(resolveColor("sky", 3).stroke).toBe(TRUE_COLOR_HEX.sky);
  });

  it("falls back to the palette for unknown tone names (never crashes)", () => {
    const c = resolveColor("not-a-tone", 1);
    expect(c.stroke).toBe(DEFAULT_SERIES_PALETTE[1]);
  });

  it("cycles the palette for undefined colors", () => {
    expect(resolveColor(undefined, 0).stroke).toBe(DEFAULT_SERIES_PALETTE[0]);
    expect(resolveColor(undefined, 8).stroke).toBe(DEFAULT_SERIES_PALETTE[0]);
    expect(resolveColor(undefined, 1).stroke).toBe(DEFAULT_SERIES_PALETTE[1]);
  });

  it("keeps the gradient object and derives a base from the first stop", () => {
    const grad = {
      x1: 0, y1: 0, x2: 0, y2: 1,
      stops: [
        { offset: 0, color: "#8b5cf6", opacity: 0.6 },
        { offset: 1, color: "#8b5cf6", opacity: 0 },
      ],
    };
    const c = resolveColor(grad, 0);
    expect(c.isGradient).toBe(true);
    expect(c.gradient).toBe(grad);
    expect(c.base).toBe("#8b5cf6");
  });

  it("accepts a custom palette", () => {
    expect(resolveColor(undefined, 0, ["#111111"])).toEqual(
      expect.objectContaining({ stroke: "#111111" }),
    );
    // empty palette → default violet, not undefined
    expect(resolveColor(undefined, 0, []).stroke).toBe("#8b5cf6");
  });
});

describe("resolveToneHex", () => {
  it("resolves tones and falls back by index", () => {
    expect(resolveToneHex("red", 0)).toBe(TRUE_COLOR_HEX.red);
    expect(resolveToneHex("bogus-tone", 2)).toBe(DEFAULT_SERIES_PALETTE[2]);
    expect(resolveToneHex(undefined, 3)).toBe(DEFAULT_SERIES_PALETTE[3]);
    // raw hex passes through
    expect(resolveToneHex("#123456", 0)).toBe("#123456");
  });
});

describe("getChartTheme", () => {
  it("has distinct light and dark schemes", () => {
    const light = getChartTheme("light");
    const dark = getChartTheme("dark");
    expect(light.titleText).not.toBe(dark.titleText);
    expect(light.tooltipBg).not.toBe(dark.tooltipBg);
  });

  it("dark tokens keep readable text", () => {
    const dark = getChartTheme("dark");
    expect(dark.tooltipText).toMatch(/^#f/);
  });
});

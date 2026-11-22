import { describe, expect, it } from "vitest";
import {
  LEGIBILITY_FLOOR,
  WCAG_AA,
  contrastRatio,
  getAutoTextInk,
  getSelectionRingHex,
  hexToOklch,
  isHexColor,
  normalizeHex,
  oklchToHex,
  relativeLuminance,
  rgbToHex,
  toHex,
  toLinearSrgb,
} from "./colorMath";

describe("normalizeHex / isHexColor", () => {
  it("accepts 3- and 6-digit hexes with or without the hash", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("AbCDeF")).toBe("#abcdef");
    expect(normalizeHex("  #123456  ")).toBe("#123456");
    expect(isHexColor("#fff")).toBe(true);
  });

  it("rejects everything else", () => {
    expect(normalizeHex("#12")).toBeNull();
    expect(normalizeHex("red")).toBeNull();
    expect(normalizeHex("#12345g")).toBeNull();
    expect(normalizeHex(null)).toBeNull();
    expect(isHexColor(12345)).toBe(false);
  });
});

describe("sRGB round trips", () => {
  it("maps hexes through linear space and back without drift", () => {
    for (const hex of ["#000000", "#ffffff", "#3b82f6", "#f59e0b", "#010203"]) {
      const rgb = toLinearSrgb(hex);
      expect(rgb).not.toBeNull();
      const back = rgbToHex(
        rgb!.map((c) => {
          const g =
            c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
          return Math.round(Math.min(1, Math.max(0, g)) * 255);
        }) as [number, number, number],
      );
      expect(back).toBe(hex);
    }
  });

  it("converts Tailwind oklch palette strings", () => {
    // blue-500 from the v4 default theme. Note v4 recalibrated the palette:
    // this oklch is *not* the v3 #3b82f6 — the conversion must be faithful
    // to the compiled CSS, not to the old hex memory.
    const linear = toLinearSrgb("oklch(62.3% 0.214 259.815)");
    expect(linear).not.toBeNull();
    expect(relativeLuminance("oklch(62.3% 0.214 259.815)")).toBeCloseTo(
      0.229,
      2,
    );
    const hex = toHex("oklch(62.3% 0.214 259.815)");
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    expect(hex).toBe("#2b7fff");
  });

  it("is null for unsupported colour strings", () => {
    expect(toLinearSrgb("red")).toBeNull();
    expect(toHex("hsl(0 0% 50%)")).toBeNull();
  });
});

describe("relativeLuminance / contrastRatio", () => {
  it("matches the WCAG anchors", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#777777", "#777777")).toBe(1);
  });

  it("throws on colours it cannot parse", () => {
    expect(() => relativeLuminance("chartreuse")).toThrow(TypeError);
  });
});

describe("oklch round trips", () => {
  it("keeps hexes close through oklch and back", () => {
    for (const hex of ["#3b82f6", "#f59e0b", "#22c55e", "#111827"]) {
      const start = hexToOklch(hex);
      expect(start.L).toBeGreaterThan(0);
      expect(start.H).toBeGreaterThanOrEqual(0);
      expect(start.H).toBeLessThan(360);
      expect(oklchToHex(start)).toBe(hex);
    }
  });

  it("throws on junk", () => {
    expect(() => hexToOklch("nope")).toThrow();
  });
});

describe("getAutoTextInk", () => {
  it("splits direction on fill luminance", () => {
    // Dark fill → light ink; light fill → dark ink.
    expect(relativeLuminance("#1e3a8a")).toBeLessThan(0.42);
    expect(contrastRatio(getAutoTextInk("#1e3a8a"), "#1e3a8a")).toBeGreaterThanOrEqual(WCAG_AA);
    expect(contrastRatio(getAutoTextInk("#fef3c7"), "#fef3c7")).toBeGreaterThanOrEqual(WCAG_AA);
  });

  it("prefers a same-hue step over the achromatic ends", () => {
    const ladder = {
      light: ["#dbeafe", "#bfdbfe", "#93c5fd"],
      dark: ["#1e3a8a"],
    };
    // blue-500: no light ink reaches AA, so blue-100 wins at the floor
    // rather than a black flip that would read as dark-on-mid.
    const ink = getAutoTextInk("#3b82f6", ladder);
    expect(ink).toBe("#dbeafe");
    expect(contrastRatio(ink, "#3b82f6")).toBeGreaterThanOrEqual(
      LEGIBILITY_FLOOR,
    );
  });

  it("takes the most colourful ladder step that clears AA", () => {
    const ladder = {
      light: ["#ffffff"],
      dark: ["#b45309", "#92400e", "#78350f", "#451a03"],
    };
    // amber-500 is light enough to ask for dark ink; the first dark step
    // reaching AA wins over the prettier-but-failing earlier steps.
    expect(getAutoTextInk("#f59e0b", ladder)).toBe("#451a03");
  });

  it("flips direction when the preferred end cannot be legible", () => {
    const ladder = {
      light: ["#86efac", "#bbf7d0", "#dcfce7", "#f0fdf4"],
      dark: ["#15803d", "#166534", "#14532d", "#052e16"],
    };
    // green-500: white caps at 2.3:1, so the dark-green ladder takes it.
    const ink = getAutoTextInk("#22c55e", ladder);
    expect(contrastRatio(ink, "#22c55e")).toBeGreaterThanOrEqual(WCAG_AA);
    expect(relativeLuminance(ink)).toBeLessThan(relativeLuminance("#22c55e"));
  });

  it("steps same-hue for off-palette colours with no ladder", () => {
    const ink = getAutoTextInk("#7c3aed"); // violet-600, no ladder given
    expect(contrastRatio(ink, "#7c3aed")).toBeGreaterThanOrEqual(
      LEGIBILITY_FLOOR,
    );
    // Still recognisably the same hue family, not a bare black or white.
    expect(ink).not.toBe("#000000");
    expect(ink).not.toBe("#ffffff");
    const hueOf = (hex: string) => Math.round(hexToOklch(hex).H);
    expect(Math.abs(hueOf(ink) - hueOf("#7c3aed"))).toBeLessThan(20);
  });

  it("always lands legible, whatever the fill", () => {
    const fills = [
      "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9",
      "#14b8a6", "#f97316", "#171717", "#fafafa", "#7c3aed", "#db2777",
      "#64748b", "#facc15", "#052e16", "#ffffff", "#000000",
    ];
    for (const fill of fills) {
      expect(
        contrastRatio(getAutoTextInk(fill), fill),
        `ink on ${fill}`,
      ).toBeGreaterThanOrEqual(LEGIBILITY_FLOOR);
    }
  });

  it("is deterministic and throws on junk fills", () => {
    expect(getAutoTextInk("#3b82f6")).toBe(getAutoTextInk("#3b82f6"));
    expect(() => getAutoTextInk("not-a-colour")).toThrow(TypeError);
  });
});

describe("getSelectionRingHex", () => {
  it("deepens the fill's own hue for the ring", () => {
    const ring = getSelectionRingHex("#3b82f6", false)!;
    const fill = hexToOklch("#3b82f6");
    const r = hexToOklch(ring);
    expect(Math.abs(r.H - fill.H)).toBeLessThan(1); // same hue
    expect(r.L).toBeLessThan(fill.L); // deepened
  });

  it("drags light fills down to the mid-ring, and lifts dark ones in dark mode", () => {
    expect(hexToOklch(getSelectionRingHex("#ffffff", false)!).L).toBeCloseTo(0.5, 1);
    // 0.6 before the hex quantisation round trip — compare to the target, not the edge.
    expect(hexToOklch(getSelectionRingHex("#0b0b0b", true)!).L).toBeCloseTo(0.6, 1);
  });

  it("leaves already-deep fills deep", () => {
    expect(hexToOklch(getSelectionRingHex("#111827", false)!).L).toBeLessThan(0.2);
  });

  it("is null for junk", () => {
    expect(getSelectionRingHex("nope", false)).toBeNull();
  });
});

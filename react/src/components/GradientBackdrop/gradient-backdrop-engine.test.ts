import { describe, it, expect } from "vitest";
import {
  GRADIENT_BACKDROP_TEMPLATES,
  GRADIENT_BACKDROP_TEMPLATE_IDS,
  deriveDarkColor,
  deriveLightColor,
  gradientBackdropCss,
  hexToOklch,
  oklchToHex,
  resolveGradientBackdropTheme,
} from "../../../../common/backdrop";

/** The docs' original hand-written strings — the templates must reproduce them exactly. */
const GOLDEN: Record<string, { light: string; dark: string }> = {
  slate: {
    light: "radial-gradient(1100px 560px at 18% -8%, #e2e8f0 0%, rgba(226,232,240,0) 62%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 55%, #cbd5e1 100%)",
    dark: "radial-gradient(1100px 560px at 18% -8%, #334155 0%, rgba(51,65,85,0) 62%), linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
  },
  mist: {
    light: "radial-gradient(900px 500px at 82% 8%, #dbeafe 0%, rgba(219,234,254,0) 58%), linear-gradient(160deg, #f8fafc 0%, #e6edf5 55%, #d3dde9 100%)",
    dark: "radial-gradient(900px 500px at 82% 8%, #16304f 0%, rgba(22,48,79,0) 58%), linear-gradient(160deg, #0b1220 0%, #16202e 55%, #1f2c3d 100%)",
  },
  stone: {
    light: "radial-gradient(1000px 560px at 14% 108%, #e7e5e4 0%, rgba(231,229,228,0) 62%), linear-gradient(135deg, #fafaf9 0%, #e7e5e4 55%, #d6d3d1 100%)",
    dark: "radial-gradient(1000px 560px at 14% 108%, #292524 0%, rgba(41,37,36,0) 62%), linear-gradient(135deg, #1c1917 0%, #292524 55%, #44403c 100%)",
  },
  dune: {
    light: "radial-gradient(900px 480px at 50% 118%, #ece7df 0%, rgba(236,231,223,0) 60%), linear-gradient(180deg, #f7f4ef 0%, #ece7df 55%, #ded5c8 100%)",
    dark: "radial-gradient(900px 480px at 50% 118%, #221e1a 0%, rgba(34,30,26,0) 60%), linear-gradient(180deg, #141210 0%, #221e1a 55%, #35302a 100%)",
  },
  fog: {
    light: "radial-gradient(820px 420px at 50% 118%, #e2e8f0 0%, rgba(226,232,240,0) 60%), linear-gradient(120deg, #f5f7fa 0%, #e8edf3 50%, #f5f7fa 100%)",
    dark: "radial-gradient(820px 420px at 50% 118%, #1e293b 0%, rgba(30,41,59,0) 60%), linear-gradient(120deg, #0f1420 0%, #1a2332 50%, #0f1420 100%)",
  },
  graphite: {
    light: "radial-gradient(1000px 520px at 22% -10%, #d1d5db 0%, rgba(209,213,219,0) 60%), linear-gradient(135deg, #e5e7eb 0%, #d1d5db 45%, #9ca3af 100%)",
    dark: "radial-gradient(1000px 520px at 22% -10%, #3f3f46 0%, rgba(63,63,70,0) 60%), linear-gradient(135deg, #18181b 0%, #27272a 45%, #3f3f46 100%)",
  },
};

const ROLES = ["glow", "from", "via", "to"] as const;

describe("templates", () => {
  it("lists the six templates in order", () => {
    expect(GRADIENT_BACKDROP_TEMPLATE_IDS).toEqual(["slate", "mist", "stone", "dune", "fog", "graphite"]);
  });

  it.each(Object.keys(GOLDEN))("%s reproduces the original CSS exactly, light and dark", (id) => {
    const t = resolveGradientBackdropTheme(id as keyof typeof GRADIENT_BACKDROP_TEMPLATES);
    expect(gradientBackdropCss(t.light, t.shape)).toBe(GOLDEN[id].light);
    expect(gradientBackdropCss(t.dark, t.shape)).toBe(GOLDEN[id].dark);
  });
});

describe("colour space", () => {
  it("hex → OKLCH → hex round-trips", () => {
    for (const hex of ["#e2e8f0", "#0f172a", "#ece7df", "#9ca3af", "#16304f", "#ffffff", "#000000"]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    }
  });

  it("accepts #rgb shorthand and uppercase", () => {
    expect(oklchToHex(hexToOklch("#FFF"))).toBe("#ffffff");
  });

  it("rejects what is not a hex colour", () => {
    expect(() => hexToOklch("blue")).toThrow(/hex/);
    expect(() => hexToOklch("#12")).toThrow(/hex/);
  });

  it("an out-of-gamut colour is brought into sRGB by reducing chroma, keeping lightness and hue", () => {
    const hex = oklchToHex({ L: 0.7, C: 0.4, H: 150 });
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    const back = hexToOklch(hex);
    expect(back.L).toBeCloseTo(0.7, 1);
    expect(Math.abs(back.H - 150)).toBeLessThan(6);
  });
});

describe("derivation (fitted on the six templates)", () => {
  // Every pair of the six templates: the derived colour lands near the
  // hand-picked one — the formula is a fit, so this is a tolerance, not equality.
  it("light → dark lands within 0.09 lightness of every hand-picked dark colour, hue kept", () => {
    for (const id of GRADIENT_BACKDROP_TEMPLATE_IDS) {
      const t = GRADIENT_BACKDROP_TEMPLATES[id];
      for (const role of ROLES) {
        const derived = hexToOklch(deriveDarkColor(t.light![role], role));
        const actual = hexToOklch(t.dark![role]);
        expect(Math.abs(derived.L - actual.L), `${id}.${role}`).toBeLessThan(0.09);
      }
    }
  });

  // The "to" stop is the loosest fit (max 0.107): the six templates disagree most there.
  it("dark → light lands within 0.11 lightness of every hand-picked light colour", () => {
    for (const id of GRADIENT_BACKDROP_TEMPLATE_IDS) {
      const t = GRADIENT_BACKDROP_TEMPLATES[id];
      for (const role of ROLES) {
        const derived = hexToOklch(deriveLightColor(t.dark![role], role));
        const actual = hexToOklch(t.light![role]);
        expect(Math.abs(derived.L - actual.L), `${id}.${role}`).toBeLessThan(0.11);
      }
    }
  });

  it("keeps the hue of a chromatic colour", () => {
    const light = hexToOklch("#dbeafe");
    const dark = hexToOklch(deriveDarkColor("#dbeafe"));
    expect(Math.abs(dark.H - light.H)).toBeLessThan(6);
  });

  it("a very light colour becomes a dark one and back", () => {
    const dark = deriveDarkColor("#f8fafc");
    expect(hexToOklch(dark).L).toBeLessThan(0.3);
    expect(hexToOklch(deriveLightColor(dark)).L).toBeGreaterThan(0.9);
  });

  it("caps derived chroma so a tinted light never turns into a loud dark", () => {
    expect(hexToOklch(deriveDarkColor("#bfdbfe")).C).toBeLessThanOrEqual(0.081);
  });
});

describe("resolveGradientBackdropTheme", () => {
  it("a template id resolves to its full theme", () => {
    const t = resolveGradientBackdropTheme("mist");
    expect(t.light.glow).toBe("#dbeafe");
    expect(t.dark.glow).toBe("#16304f");
    expect(t.shape.angle).toBe(160);
  });

  it("a custom theme with both sides is used as given", () => {
    const light = { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" };
    const dark = { glow: "#78350f", from: "#1c1917", via: "#292524", to: "#451a03" };
    const t = resolveGradientBackdropTheme({ light, dark });
    expect(t.light).toEqual(light);
    expect(t.dark).toEqual(dark);
  });

  it("only light given: dark is derived per colour", () => {
    const light = { glow: "#e2e8f0", from: "#f8fafc", via: "#e2e8f0", to: "#cbd5e1" };
    const t = resolveGradientBackdropTheme({ light });
    for (const role of ROLES) expect(t.dark[role]).toBe(deriveDarkColor(light[role], role));
  });

  it("only dark given: light is derived per colour", () => {
    const dark = { glow: "#334155", from: "#0f172a", via: "#1e293b", to: "#334155" };
    const t = resolveGradientBackdropTheme({ dark });
    for (const role of ROLES) expect(t.light[role]).toBe(deriveLightColor(dark[role], role));
  });

  it("shape defaults to Slate's and a partial shape overrides only what it names", () => {
    const t = resolveGradientBackdropTheme({ light: GRADIENT_BACKDROP_TEMPLATES.slate.light!, shape: { angle: 90 } });
    expect(t.shape).toEqual({ ...GRADIENT_BACKDROP_TEMPLATES.slate.shape, angle: 90 });
  });

  it("a theme with neither side falls back to the Slate template", () => {
    const t = resolveGradientBackdropTheme({});
    expect(t.light).toEqual(GRADIENT_BACKDROP_TEMPLATES.slate.light);
  });

  it("an unknown template id falls back to Slate", () => {
    expect(resolveGradientBackdropTheme("nope" as never).light).toEqual(GRADIENT_BACKDROP_TEMPLATES.slate.light);
  });
});

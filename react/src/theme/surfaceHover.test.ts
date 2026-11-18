/**
 * A container hover has to be *seen*, and only arithmetic can say so.
 *
 * Panel's tinted hover shipped broken twice over, and both times it looked
 * plausible in review: `hover:bg-{c}-50 dark:hover:bg-{c}-900/20` reads like a
 * sensible pair of steps, but a `tonal` card rests on `{c}-200/60` — so the
 * light step was *lighter* than the card (the surface faded out under the
 * pointer) and the dark step, at `{c}-900/20` over a `{c}-500/15` fill, was
 * darker still (1.10:1, in the wrong direction: a shadow falling on the card,
 * not a lift). Dark mode is where it was worst, which is where the kit's
 * translucent variants live.
 *
 * So this reads the classes `getSurfaceHoverTokens` actually emits, resolves
 * them against the palette Tailwind will compile them to, composites them on
 * the page, and asserts the three things a hover must do:
 *
 *   - **dark: lift.** ≥1.15:1 against the surface's own rest fill.
 *   - **light: deepen, never fade.** The wash must lose luminance and gain
 *     colour; a card going pale under a pointer is the bug this file exists for.
 *   - **pressed: past hover,** in the same direction.
 *
 * The last block runs the *old* pair through the same bar and requires it to
 * fail: if someone loosens a threshold here, the regression they are about to
 * allow is the one this test was written from, not an abstract new one.
 *
 * Colour maths mirrors `contrast.test.ts` (jsdom computes no colours, so no
 * other test in the kit can measure any of this).
 */
import { describe, it, expect } from "vitest";
import {
  SURFACE_VARIANT_BASE,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  SURFACE_NEUTRAL_HOVER,
  SURFACE_TINT_DEPTHS,
  getPanelToneStyles,
  getSurfaceHoverTokens,
  type SurfaceVariant,
  type TrueColor,
} from "../../../common/theme/Theme";
import { getSurfaceGlassFillClass } from "./glass";
import paletteFixture from "./tailwind-palette.json";

type Rgb = [number, number, number];
type Mode = "light" | "dark";
type State = "rest" | "hover" | "pressed";

// ── Colour maths (mirrors contrast.test.ts) ─────────────────────────────────

const palette: Record<string, string> = paletteFixture.colors;

function toLinearSrgb(color: string): Rgb {
  const hex = color.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (hex) {
    const raw = hex[1];
    const expanded =
      raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
    const n = parseInt(expanded, 16);
    return [
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    ].map((c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    ) as Rgb;
  }
  const m = color.match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!m) throw new Error(`unsupported colour: ${color}`);
  const L = Number(m[1]) / 100;
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const md = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  const r = 4.0767416621 * l - 3.3077115913 * md + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * md - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * md + 1.7076147010 * s;
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, bl)),
  ];
}

const gamma = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const luminance = (rgb: Rgb): number =>
  0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

/** Rough sRGB chroma — how much *colour* is in the fill, not how light it is. */
const chroma = (rgb: Rgb): number => {
  const srgb = rgb.map(gamma);
  return Math.max(...srgb) - Math.min(...srgb);
};

function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  const srgb = fg.map((c, i) => gamma(c) * alpha + gamma(bg[i]) * (1 - alpha)) as Rgb;
  return srgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  ) as Rgb;
}

function ratio(a: Rgb, b: Rgb): number {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
}

// ── Resolving a class string to a painted colour ────────────────────────────

const FILL = /^bg-([a-z]+-?\d+|white|black)(?:\/(.+))?$/;

type Fill = { color: string; alpha: number };

/**
 * The `bg-*` token a class list paints for one mode and one state. A token with
 * no `dark:` prefix still shows in dark mode when nothing dark overrides it, so
 * dark mode ranks the prefixed token above the plain one.
 */
function pick(classes: string, mode: Mode, state: State): Fill | null {
  let best: { fill: Fill; rank: number } | null = null;
  for (const raw of classes.split(/\s+/).filter(Boolean)) {
    let rest = raw;
    const prefixes: string[] = [];
    for (;;) {
      const m = rest.match(/^(dark|hover|group-hover|active|group-active):(.*)$/);
      if (!m) break;
      prefixes.push(m[1]);
      rest = m[2];
    }
    const mm = rest.match(FILL);
    if (!mm) continue;
    const isDark = prefixes.includes("dark");
    const tokenState: State = prefixes.some((p) => p === "active" || p === "group-active")
      ? "pressed"
      : prefixes.some((p) => p === "hover" || p === "group-hover")
        ? "hover"
        : "rest";
    if (tokenState !== state) continue;
    if (mode === "light" && isDark) continue;
    const alphaRaw = mm[2];
    const alpha =
      alphaRaw === undefined
        ? 1
        : alphaRaw.startsWith("[")
          ? Number(alphaRaw.slice(1, -1))
          : Number(alphaRaw) / 100;
    // Rank 2 = explicitly for this mode; rank 1 = inherited from the other one.
    const rank = (mode === "dark" ? isDark : !isDark) ? 2 : 1;
    if (!best || rank >= best.rank) best = { fill: { color: mm[1], alpha }, rank };
  }
  return best?.fill ?? null;
}

const page = (mode: Mode): Rgb => toLinearSrgb(palette[mode === "light" ? "white" : "neutral-900"]);

/** Composite a resolved fill onto the page it sits on. */
function paint(fill: Fill | null, mode: Mode): Rgb {
  if (!fill) return page(mode);
  const source = palette[fill.color];
  if (!source) throw new Error(`palette has no colour "${fill.color}"`);
  return composite(toLinearSrgb(source), fill.alpha, page(mode));
}

/** What the variant actually shows before the pointer arrives. */
function restClasses(variant: SurfaceVariant, tone: TrueColor): string {
  const p = getPanelToneStyles(tone);
  switch (variant) {
    case "none":
    case "subtle":
      return p.subtleBg;
    case "tonal":
    case "simple":
      return p.tonalBg;
    case "glass":
      return p.glassBg;
    case "liquid-glass":
      return getSurfaceGlassFillClass(tone, "frosted");
    default:
      return SURFACE_VARIANT_BASE[variant];
  }
}

const SATURATED: readonly TrueColor[] = TRUE_COLORS.filter(
  (c) => !["neutral", "gray", "slate", "zinc", "stone"].includes(c),
);

// ── The bars ────────────────────────────────────────────────────────────────
// A hover on an area this large is legible well below text-contrast levels —
// Material's own state layer is 8% on white and 8–16% on dark — but it has to
// clear *something*, and "something" is what had never been written down.
const DARK_LIFT = 1.15;
const LIGHT_STEP = 1.04;
const PRESSED_STEP = 1.06;

describe("container surface hover is visible", () => {
  const cases: { variant: SurfaceVariant; tone: TrueColor }[] = [];
  for (const variant of SURFACE_VARIANTS)
    for (const tone of TRUE_COLORS) cases.push({ variant, tone });

  it("lifts the surface off its own fill in dark mode", () => {
    const offenders: string[] = [];
    for (const { variant, tone } of cases) {
      const tokens = getSurfaceHoverTokens(variant, tone);
      const rest = paint(pick(restClasses(variant, tone), "dark", "rest"), "dark");
      const hover = paint(pick(tokens.wash, "dark", "hover"), "dark");
      const measured = ratio(hover, rest);
      if (luminance(hover) <= luminance(rest))
        offenders.push(`${variant}/${tone}: dark hover goes DOWN (${measured.toFixed(3)}:1)`);
      else if (measured < DARK_LIFT)
        offenders.push(`${variant}/${tone}: dark hover only ${measured.toFixed(3)}:1`);
    }
    expect(offenders).toEqual([]);
  });

  it("deepens the surface instead of fading it out in light mode", () => {
    const offenders: string[] = [];
    for (const { variant, tone } of cases) {
      const tokens = getSurfaceHoverTokens(variant, tone);
      const rest = paint(pick(restClasses(variant, tone), "light", "rest"), "light");
      const hover = paint(pick(tokens.wash, "light", "hover"), "light");
      const measured = ratio(hover, rest);
      if (luminance(hover) >= luminance(rest))
        offenders.push(`${variant}/${tone}: light hover goes UP (${measured.toFixed(3)}:1) — the card fades out`);
      else if (measured < LIGHT_STEP)
        offenders.push(`${variant}/${tone}: light hover only ${measured.toFixed(3)}:1`);
    }
    expect(offenders).toEqual([]);
  });

  it("adds colour as it darkens, so a pale hue still reads on a white page", () => {
    const offenders: string[] = [];
    for (const { variant, tone } of cases) {
      if (!SATURATED.includes(tone)) continue;
      // `plain` starts from white (zero chroma), so *any* hue is an increase;
      // the check that matters is that the wash never drains the card.
      const tokens = getSurfaceHoverTokens(variant, tone);
      const rest = paint(pick(restClasses(variant, tone), "light", "rest"), "light");
      const hover = paint(pick(tokens.wash, "light", "hover"), "light");
      if (chroma(hover) - chroma(rest) < 0.01)
        offenders.push(
          `${variant}/${tone}: chroma ${chroma(rest).toFixed(3)} → ${chroma(hover).toFixed(3)}`,
        );
    }
    expect(offenders).toEqual([]);
  });

  it("carries the pressed step past the hover, in the same direction", () => {
    const offenders: string[] = [];
    for (const { variant, tone } of cases) {
      const { wash, pressed } = getSurfaceHoverTokens(variant, tone);
      for (const mode of ["light", "dark"] as const) {
        const hover = paint(pick(wash, mode, "hover"), mode);
        const down = paint(pick(pressed, mode, "pressed"), mode);
        const measured = ratio(down, hover);
        const onward =
          mode === "dark" ? luminance(down) > luminance(hover) : luminance(down) < luminance(hover);
        if (!onward || measured < PRESSED_STEP)
          offenders.push(`${variant}/${tone} ${mode}: pressed only ${measured.toFixed(3)}:1 past hover`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("never reaches for a dark shade below 600 for a dark-mode wash", () => {
    // The `-900` step is the original sin: it is darker than every fill it can
    // land on, so the "hover" reads as the card sinking.
    const offenders: string[] = [];
    for (const variant of SURFACE_VARIANTS)
      for (const tone of TRUE_COLORS) {
        const { wash, pressed } = getSurfaceHoverTokens(variant, tone);
        for (const cls of `${wash} ${pressed}`.split(/\s+/))
          if (/^dark:/.test(cls) && /-([6-9]00|950)(?:\/\d+)?$/.test(cls))
            offenders.push(`${variant}/${tone}: ${cls}`);
      }
    expect(offenders).toEqual([]);
  });

  it("lifts an untinted panel too — the veil included", () => {
    const dark = paint(
      pick(`${SURFACE_NEUTRAL_HOVER.wash} ${SURFACE_NEUTRAL_HOVER.pressed}`, "dark", "hover"),
      "dark",
    );
    const light = paint(
      pick(`${SURFACE_NEUTRAL_HOVER.wash} ${SURFACE_NEUTRAL_HOVER.pressed}`, "light", "hover"),
      "light",
    );
    expect(ratio(dark, page("dark"))).toBeGreaterThanOrEqual(DARK_LIFT);
    expect(luminance(dark)).toBeGreaterThan(luminance(page("dark")));
    expect(ratio(light, page("light"))).toBeGreaterThanOrEqual(LIGHT_STEP);
    expect(luminance(light)).toBeLessThan(luminance(page("light")));
  });

  it("covers every tint depth with a distinct step", () => {
    const depths = new Map<string, string>();
    for (const variant of SURFACE_VARIANTS)
      depths.set(variant, getSurfaceHoverTokens(variant, "blue").wash);
    // Three depths, three answers: a hover measured against nothing cannot also
    // be the hover measured against a `{c}-200/60` fill.
    expect(new Set(depths.values()).size).toBe(
      new Set(SURFACE_TINT_DEPTHS).size,
    );
  });

  /**
   * The canary. This is the pair that shipped, run through the bars above; if
   * any of these flips, the thresholds were loosened to admit the bug again.
   */
  it("the pair this test was written from still fails the bar", () => {
    const oldWash = "hover:bg-blue-50 dark:hover:bg-blue-900/20";
    const restTonal = paint(pick(getPanelToneStyles("blue").tonalBg, "dark", "rest"), "dark");
    const oldDark = paint(pick(oldWash, "dark", "hover"), "dark");
    // 1.10:1 and in the wrong direction: invisible, and a shadow rather than a lift.
    expect(luminance(oldDark)).toBeLessThan(luminance(restTonal));
    expect(ratio(oldDark, restTonal)).toBeLessThan(DARK_LIFT);

    const restLight = paint(pick(getPanelToneStyles("blue").tonalBg, "light", "rest"), "light");
    const oldLight = paint(pick(oldWash, "light", "hover"), "light");
    // Lighter than the card it was supposed to press.
    expect(luminance(oldLight)).toBeGreaterThan(luminance(restLight));

    // And the untinted veil: 4% white on a dark page, the step nobody saw.
    const oldVeil = pick("group-hover:bg-white/[0.04]", "dark", "hover");
    expect(ratio(paint(oldVeil, "dark"), page("dark"))).toBeLessThan(DARK_LIFT);
  });
});

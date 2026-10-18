/**
 * WCAG 2.1 AA contrast gate over the theme token pairs (audit P1-6).
 *
 * jsdom computes no colours, so no other test can check WCAG 1.4.3. This one
 * resolves the *actual* token classes the components render (via the real
 * theme accessors) against the actual palette values (extracted from the
 * installed Tailwind v4 default theme into `tailwind-palette.json`) and
 * asserts every text/fill pair the kit renders meets AA (4.5:1, normal
 * text):
 *
 *   - surface text (heading/body/description/muted) on the opaque surface
 *     fills, light + dark,
 *   - every button variant's label/fill pair in base, hover, active and
 *     active-hover states, for all 21 tones, light + dark — the kit's own
 *     documented contrast rule (see `createTheme` in common/theme/Theme.ts).
 *
 * Translucent dark fills (e.g. `bg-{c}-500/10`) are composited over
 * `neutral-900` — the lightest opaque dark surface fill — the worst case
 * for light text on a dark page.
 *
 * If a token is changed to a low-contrast value, this test fails and names
 * the offenders with their measured ratios.
 */
import { describe, it, expect } from "vitest";
import {
  getButtonActiveClasses,
  getButtonActiveHoverClasses,
  getButtonColorClasses,
  getButtonHoverClasses,
  getSurfaceTextTokens,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  type TrueColor,
} from "../../../common/theme/Theme";
import paletteFixture from "./tailwind-palette.json";

// ── Colour maths ──────────────────────────────────────────────────────────────

const palette: Record<string, string> = paletteFixture.colors;

/** oklch(L% C H) or #hex (3 or 6 digits) -> linear sRGB [r,g,b] (0..1). */
function toLinearSrgb(color: string): [number, number, number] {
  const hex = color.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (hex) {
    const raw = hex[1];
    const expanded =
      raw.length === 3
        ? raw.split("").map((c) => c + c).join("")
        : raw;
    const n = parseInt(expanded, 16);
    const srgb: number[] = [
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    ];
    return srgb.map((c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    ) as [number, number, number];
  }
  const m = color.match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!m) throw new Error(`unsupported colour: ${color}`);
  const L = Number(m[1]) / 100;
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;
  // OKLab -> LMS (cubed)
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const md = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  // linear sRGB (clamped: a few gamut-edge colours overflow by <2%)
  const r = 4.0767416621 * l - 3.3077115913 * md + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * md - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * md + 1.7076147010 * s;
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, bl)),
  ];
}

function gamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** WCAG relative luminance — takes LINEAR sRGB (WCAG linearizes first). */
function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Alpha-composite fg over bg (sRGB space, per CSS). */
function composite(
  fg: [number, number, number],
  alpha: number,
  bg: [number, number, number],
): [number, number, number] {
  const toSrgb = gamma;
  const srgb = fg.map((c, i) =>
    toSrgb(c) * alpha + toSrgb(bg[i]) * (1 - alpha),
  ) as [number, number, number];
  return srgb.map(
    (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)),
  ) as [number, number, number];
}

function contrastRatio(fgRgb: [number, number, number], bgRgb: [number, number, number]): number {
  const hi = Math.max(luminance(fgRgb), luminance(bgRgb));
  const lo = Math.min(luminance(fgRgb), luminance(bgRgb));
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Resolve the effective text + fill tokens for a mode from a set of class
 * strings (later strings override earlier ones — the way the component
 * composes base + hover/active tokens). `stripHover` admits `hover:`-
 * prefixed tokens (base/hover vs. active/active-hover states).
 */
function effectivePair(
  classStrings: string[],
  mode: "light" | "dark",
  stripHover: boolean,
): { text: string | null; fill: { name: string; alpha: number } | null } {
  const tokens = classStrings.join(" ").split(/\s+/).reverse();
  let text: string | null = null;
  let fill: { name: string; alpha: number } | null = null;
  for (const t of tokens) {
    const isDark = t.startsWith("dark:");
    let rest = isDark ? t.slice("dark:".length) : t;
    if (mode === "light" && isDark) continue;
    if (mode === "dark" && !isDark) continue;
    if (rest.startsWith("hover:")) {
      if (!stripHover) continue;
      rest = rest.slice("hover:".length);
    }
    let m = rest.match(/^text-([a-z]+(?:-\d+)?)(?:\/\d+)?$/);
    if (m && text === null) text = m[1];
    m = rest.match(/^bg-([a-z]+(?:-\d+)?)(?:\/(\d+))?$/);
    if (m && fill === null) {
      fill = { name: m[1], alpha: m[2] ? Number(m[2]) / 100 : 1 };
    }
  }
  return { text, fill };
}

interface Violation {
  where: string;
  ratio: number;
  text: string;
  bg: string;
}

const AA = 4.5;

function checkPair(
  violations: Violation[],
  where: string,
  classStrings: string[],
  mode: "light" | "dark",
  stripHover: boolean,
  substrate: string,
): void {
  const { text, fill } = effectivePair(classStrings, mode, stripHover);
  if (!text) return;
  const fillRgb = fill ? toLinearSrgb(palette[fill.name]) : null;
  const substrateRgb = toLinearSrgb(palette[substrate]);
  const bg =
    fillRgb && fill
      ? fill.alpha >= 1
        ? fillRgb
        : composite(fillRgb, fill.alpha, substrateRgb)
      : substrateRgb;
  const ratio = contrastRatio(toLinearSrgb(palette[text]), bg);
  if (!(ratio >= AA)) {
    violations.push({
      where,
      ratio: Math.round(ratio * 100) / 100,
      text,
      bg: fill ? `${fill.name}@${fill.alpha} over ${substrate}` : substrate,
    });
  }
}

function expectNoViolations(violations: Violation[]): void {
  expect(
    violations,
    `contrast violations (need ${AA}:1):\n` +
      violations
        .map((v) => `  ${v.where}: ${v.ratio}:1 (${v.text} on ${v.bg})`)
        .join("\n"),
  ).toEqual([]);
}

// ── Surface text ──────────────────────────────────────────────────────────────

const DARK_FILLS = ["neutral-950", "neutral-900"];

describe("surface text tokens (WCAG 1.4.3 AA)", () => {
  it.each(SURFACE_VARIANTS)("%s", (variant) => {
    const tokens = getSurfaceTextTokens(variant);
    const violations: Violation[] = [];
    for (const key of ["heading", "body", "description", "muted"] as const) {
      checkPair(violations, `${variant}/${key} (light)`, [tokens[key]], "light", false, "white");
      for (const bg of DARK_FILLS) {
        checkPair(violations, `${variant}/${key} (dark on ${bg})`, [tokens[key]], "dark", false, bg);
      }
    }
    expectNoViolations(violations);
  });
});

// ── Buttons ───────────────────────────────────────────────────────────────────

// Dark translucent fills composite over the lightest opaque dark surface.
const DARK_SUBSTRATE = "neutral-900";
const LIGHT_SUBSTRATE = "white";

const BUTTON_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "link",
  "clear",
  "icon",
] as const;

const buttonCases: Array<{
  label: string;
  build: (variant: (typeof BUTTON_VARIANTS)[number], color: TrueColor) => string[];
  stripHover: boolean;
}> = [
  {
    label: "base",
    build: (v, c) => [getButtonColorClasses(v, c)],
    stripHover: false,
  },
  {
    label: "hover",
    build: (v, c) => [getButtonColorClasses(v, c), getButtonHoverClasses(v, c)],
    stripHover: true,
  },
  {
    label: "active",
    build: (v, c) => [getButtonActiveClasses(v, c)],
    stripHover: false,
  },
  {
    label: "active-hover",
    build: (v, c) => [
      getButtonActiveClasses(v, c),
      getButtonActiveHoverClasses(v, c),
    ],
    stripHover: true,
  },
];

describe("button label/fill pairs (WCAG 1.4.3 AA)", () => {
  const cases = BUTTON_VARIANTS.flatMap((variant) =>
    TRUE_COLORS.flatMap((color) =>
      buttonCases.map((state) => [variant, color, state] as const),
    ),
  );
  it.each(cases)("%s / %s / %s", (variant, color, state) => {
    const violations: Violation[] = [];
    const strings = state.build(variant, color as TrueColor);
    checkPair(
      violations,
      `${variant}/${color}/${state.label} (light)`,
      strings,
      "light",
      state.stripHover,
      LIGHT_SUBSTRATE,
    );
    checkPair(
      violations,
      `${variant}/${color}/${state.label} (dark)`,
      strings,
      "dark",
      state.stripHover,
      DARK_SUBSTRATE,
    );
    expectNoViolations(violations);
  });
});

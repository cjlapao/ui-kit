/**
 * The palette probe the rim and hover tests measure against.
 *
 * jsdom computes no colours: `getComputedStyle` returns the class strings we
 * put in, so a stylesheet assertion cannot say whether an edge is visible.
 * The only witness is arithmetic — resolve the utility against the same
 * palette Tailwind will compile it to, composite it, take the WCAG ratio.
 *
 * This is the block `tonalRim.test.ts` grew and `surfaceHover.test.ts`
 * mirrored; it lives here now because `alertRim.test.ts` measures the same
 * four things about a different variant, and a third copy of gamma is how two
 * of them quietly stop agreeing about what "1.10:1" means.
 */
import paletteFixture from "./tailwind-palette.json";

export type Rgb = [number, number, number];
export type Mode = "light" | "dark";

export const palette: Record<string, string> = paletteFixture.colors;

export function toLinearSrgb(color: string): Rgb {
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

export const gamma = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export const luminance = (rgb: Rgb): number =>
  0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

export const page = (mode: Mode): Rgb =>
  toLinearSrgb(palette[mode === "light" ? "white" : "neutral-900"]);

export const ratio = (a: Rgb, b: Rgb): number => {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
};

const TOKEN =
  /^(bg|border|ring|text|fill|stroke)-([a-z]+-?\d+|white|black|transparent)(?:\/(\d+))?$/;

const COLOUR_PROPS = ["bg", "border", "ring"] as const;

/**
 * A colour utility composited onto the page, prefixes stripped. `dark:` ranks
 * above the plain token in dark mode and is skipped in light mode, the way the
 * cascade resolves it — a rim is a 1px line, so half of it being wrong is not
 * a rounding error, it is no edge at all.
 *
 * `ground` defaults to the page; pass a card's own fill to ask what the
 * utility looks like *on the card*, which is the question a rim and a line of
 * copy answer. `props` narrows which utilities count: a surface string carries
 * `bg-…` and `text-…` together, and measuring a fill against `text-white`
 * would be a tautology dressed up as a test. `transparent` resolves to the
 * ground, because that is what it is.
 */
export function paint(
  classes: string,
  mode: Mode,
  opts: { ground?: Rgb; props?: readonly string[] } = {},
): Rgb {
  const bg = opts.ground ?? page(mode);
  const props = opts.props ?? COLOUR_PROPS;
  let best: { rgb: Rgb; rank: number } | null = null;
  for (const raw of classes.split(/\s+/).filter(Boolean)) {
    let rest = raw;
    const prefixes: string[] = [];
    for (;;) {
      const m = rest.match(/^(dark|hover|active|group-hover):(.*)$/);
      if (!m) break;
      prefixes.push(m[1]);
      rest = m[2];
    }
    const mm = rest.match(TOKEN);
    if (!mm) continue;
    if (!props.includes(mm[1])) continue;
    const isDark = prefixes.includes("dark");
    if (mode === "light" && isDark) continue;
    const rank = (mode === "dark" ? isDark : !isDark) ? 2 : 1;
    if (mm[2] === "transparent") {
      if (!best || rank >= best.rank) best = { rgb: bg, rank };
      continue;
    }
    const source = palette[mm[2]];
    if (!source) throw new Error(`palette has no colour "${mm[2]}"`);
    const alpha = mm[3] === undefined ? 1 : Number(mm[3]) / 100;
    const base = toLinearSrgb(source);
    const srgb = base.map((c, i) =>
      gamma(c) * alpha + gamma(bg[i]) * (1 - alpha),
    ) as Rgb;
    const rgb = srgb.map((c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    ) as Rgb;
    if (!best || rank >= best.rank) best = { rgb, rank };
  }
  if (!best) throw new Error(`no ${props.join("/")} utility in "${classes}"`);
  return best.rgb;
}

/** The worst a set of tones does against a bar — the number a table quotes. */
export const worstOf = <T extends string>(
  tones: readonly T[],
  measure: (tone: T) => number,
): number => Math.min(...tones.map(measure));

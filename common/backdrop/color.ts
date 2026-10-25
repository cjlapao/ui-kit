/**
 * Colour space helpers for the backdrop engine: sRGB hex ⇄ OKLCH.
 *
 * OKLCH is used because its lightness is perceptual — mirroring a light
 * colour into a dark one along L keeps the hue and reads as "the same colour,
 * at night", which hex or HSL arithmetic does not.
 */

export interface Oklch {
  /** Lightness, 0..1. */
  L: number;
  /** Chroma, 0..~0.37. */
  C: number;
  /** Hue in degrees. */
  H: number;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** Parse `#rgb` / `#rrggbb` into 0..255 channels. */
export function parseHex(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Expected a hex colour (#rgb or #rrggbb), got "${hex}"`);
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = parseHex(hex).map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const H = (Math.atan2(B, A) * 180) / Math.PI;
  return { L, C: Math.hypot(A, B), H: H < 0 ? H + 360 : H };
}

/** OKLCH → linear sRGB (may fall outside 0..1 when out of gamut). */
function oklchToLinear({ L, C, H }: Oklch): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: number[]) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

/**
 * OKLCH → `#rrggbb`. An out-of-gamut colour keeps its lightness and hue and
 * gives up chroma (binary search) until it fits sRGB — the CSS Color 4 way.
 */
export function oklchToHex(color: Oklch): string {
  const L = Math.min(1, Math.max(0, color.L));
  let rgb = oklchToLinear({ ...color, L });
  if (!inGamut(rgb)) {
    let lo = 0;
    let hi = color.C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ L, C: mid, H: color.H }))) lo = mid;
      else hi = mid;
    }
    rgb = oklchToLinear({ L, C: lo, H: color.H });
  }
  return (
    "#" +
    rgb
      .map((c) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, c))))) * 255))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

/** `#rrggbb` → `rgba(r,g,b,a)` (no spaces — the format the templates use). */
export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

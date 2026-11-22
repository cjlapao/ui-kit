/**
 * Colour maths shared by every framework port.
 *
 * `CustomColorSwatches` paints swatches with *concrete* hex values (a custom
 * colour is exactly the hex the user chose — no `dark:` utility can describe
 * it), and its dual mode needs the calculated ink for a filled pill: the
 * same-hue step that stays legible on the fill. Tailwind ships colours as
 * `oklch()` strings in its v4 default theme (see `tailwind-palette.json`), so
 * this module carries the hex ⇄ sRGB ⇄ oklab/oklch conversions and the WCAG
 * 2.1 luminance/contrast pair that the kit's contrast audits already lean on
 * (the math here is the one proven in `react/src/theme/contrast.test.ts`).
 *
 * Pure functions only — no DOM, no React, no framework imports.
 */

/** sRGB channels, 0..255. */
export type Rgb = [number, number, number];

import { hexToOklch, oklchToHex } from "../backdrop/color";

/** The WCAG 2.1 AA gate for normal text. */
export const WCAG_AA = 4.5;

/**
 * The floor an auto-ink pick may settle for. A same-hue ink on a mid-luminance
 * fill cannot always reach AA — white on `blue-500` is 3.69:1, so demanding
 * 4.5 would abandon the hue entirely. The ladder therefore takes the most
 * colourful step that clears this floor when none clears AA.
 */
export const LEGIBILITY_FLOOR = 3;

/** Luminance below which the fill counts as "dark" and asks for light ink. */
export const DARK_FILL_LUMINANCE = 0.42;

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const OKLCH_RE = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+(-?[\d.]+)\s*\)$/;

/** True for `#rgb`/`#rrggbb`, with or without the hash. */
export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_RE.test(value.trim());
}

/** `#RRGGBB` lowercase, or null when the value is not a hex colour. */
export function normalizeHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = HEX_RE.exec(value.trim());
  if (!match) return null;
  let raw = match[1].toLowerCase();
  if (raw.length === 3) raw = raw.split("").map((c) => c + c).join("");
  return `#${raw}`;
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

function parseHex(hex: string): Rgb | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const n = parseInt(normalized.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channelToLinear(c8: number): number {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function channelToSrgbByte(c: number): number {
  const g = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp01(g) * 255);
}

/** `#rrggbb` → [r,g,b] 0..255, or null when unparseable. */
export function hexToRgb(hex: string): Rgb | null {
  return parseHex(hex);
}

/** [r,g,b] 0..255 (any range, clamped) → `#rrggbb`. */
export function rgbToHex([r, g, b]: Rgb): string {
  const byte = (x: number) =>
    Math.min(255, Math.max(0, Math.round(x)))
      .toString(16)
      .padStart(2, "0");
  return `#${byte(r)}${byte(g)}${byte(b)}`;
}

/**
 * A CSS colour this module understands — `#rgb`/`#rrggbb` (hash optional) or
 * the Tailwind v4 palette form `oklch(L% C H)` — as linear sRGB. Null for
 * anything else.
 */
export function toLinearSrgb(color: string): Rgb | null {
  const hex = parseHex(color);
  if (hex) return hex.map(channelToLinear) as Rgb;
  const m = OKLCH_RE.exec(color.trim());
  if (!m) return null;
  const L = Number(m[1]) / 100;
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  // OKLab -> LMS (cubed) -> linear sRGB. A few gamut-edge colours overflow by
  // <2%, hence the clamp — same treatment the contrast audit gives them.
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const md = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  const r = 4.0767416621 * l - 3.3077115913 * md + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * md - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * md + 1.707614701 * s;
  return [clamp01(r), clamp01(g), clamp01(bl)];
}

/** WCAG 2.1 relative luminance of any supported CSS colour. */
export function relativeLuminance(color: string): number {
  const rgb = toLinearSrgb(color);
  if (!rgb) throw new TypeError(`Unsupported colour: ${color}`);
  const [r, g, b] = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio (1..21) between two supported colours. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The oklch pair is not re-implemented here: `common/backdrop/color.ts` is the
 * kit's canonical sRGB ⇄ OKLCH module (its gamut map binary-searches chroma
 * down at constant hue, where a naive clamp would shift the hue — which is
 * exactly what the auto-ink stepper must not do). Re-exported under the same
 * bindings, so the kit has one pair of names, not two.
 */
export { hexToOklch, oklchToHex, type Oklch } from "../backdrop/color";

/** Any supported CSS colour (hex or `oklch(L% C H)`) normalised to `#rrggbb`. */
export function toHex(color: string): string | null {
  const direct = normalizeHex(color);
  if (direct) return direct;
  const rgb = toLinearSrgb(color);
  if (!rgb) return null;
  return rgbToHex(rgb.map(channelToSrgbByte) as Rgb);
}

/**
 * Ordered chromatic ink candidates for each direction, concrete hexes, most
 * colourful first — the on-palette steps of the fill's own tone, say. The
 * achromatic ends are not ladder rungs: they are the last-resort fallback
 * `getAutoTextInk` tries itself, after the continuous same-hue sweep.
 */
export interface InkLadder {
  light: readonly string[];
  dark: readonly string[];
}

const NO_LADDER: readonly string[] = [];

function firstAbove(
  candidates: readonly string[],
  fill: string,
  gate: number,
): string | null {
  for (const candidate of candidates) {
    try {
      if (contrastRatio(candidate, fill) >= gate) return candidate;
    } catch {
      // A malformed candidate is simply not a candidate.
    }
  }
  return null;
}

/**
 * Continuous same-hue fallback for colours off the palette: hold hue and
 * chroma, step oklch lightness outward in 0.02 ticks toward the requested end
 * until the ink clears `gate`. Null when even the clamped end fails.
 */
function stepTowardEnd(
  fill: string,
  towardLight: boolean,
  gate: number,
): string | null {
  const start = hexToOklch(fill);
  const direction = towardLight ? 1 : -1;
  for (let L = start.L; ; L += direction * 0.02) {
    const clamped = Math.min(0.99, Math.max(0.01, L));
    const candidate = oklchToHex({ L: clamped, C: start.C, H: start.H });
    if (contrastRatio(candidate, fill) >= gate) return candidate;
    // Checked the end tick — the gate is unmet, give up this direction.
    if (L >= 0.99 || L <= 0.01) return null;
  }
}

/**
 * The text ink for a filled swatch: same hue, opposite lightness end — a dark
 * fill asks for light ink, a light fill for dark ink.
 *
 * Selection order, first hit wins — the fill's own hue is kept as long as any
 * ink on the user's side of the split is legible, and only a direction that
 * cannot be made readable at all flips to the other end:
 * 1. preferred ladder at AA, most colourful step first;
 * 2. continuous same-hue stepping in the preferred direction at AA — the rung
 *    ladder misses for off-palette colours;
 * 3. preferred ladder at the legibility floor — a same-hue ink that cannot
 *    reach AA keeps the hue instead of flipping; white on `blue-500` never
 *    reaches AA anyway (3.69:1), so `blue-100` at 3.0:1 stays the pick;
 * 4. continuous stepping in the preferred direction at the floor;
 * 5–8. the same four passes toward the other end, legibility outranking hue
 *    now that the preferred direction has failed (`green-500` caps near 2.3:1
 *    with light inks, so it takes dark green);
 * 9. plain `#ffffff` / `#000000`, whichever contrasts better — the worst
 *    fill-against-best-achromatic ratio is 4.58:1, so this always clears AA.
 */
export function getAutoTextInk(fillHex: string, ladder?: InkLadder): string {
  const fill = normalizeHex(fillHex);
  if (!fill) throw new TypeError(`Unsupported fill colour: ${fillHex}`);
  const light = ladder?.light ?? NO_LADDER;
  const dark = ladder?.dark ?? NO_LADDER;
  const darkFill = relativeLuminance(fill) < DARK_FILL_LUMINANCE;
  const preferred = darkFill ? light : dark;
  const opposite = darkFill ? dark : light;

  return (
    firstAbove(preferred, fill, WCAG_AA) ??
    stepTowardEnd(fill, darkFill, WCAG_AA) ??
    firstAbove(preferred, fill, LEGIBILITY_FLOOR) ??
    stepTowardEnd(fill, darkFill, LEGIBILITY_FLOOR) ??
    firstAbove(opposite, fill, WCAG_AA) ??
    stepTowardEnd(fill, !darkFill, WCAG_AA) ??
    firstAbove(opposite, fill, LEGIBILITY_FLOOR) ??
    stepTowardEnd(fill, !darkFill, LEGIBILITY_FLOOR) ??
    (contrastRatio("#ffffff", fill) >= contrastRatio("#000000", fill)
      ? "#ffffff"
      : "#000000")
  );
}

/**
 * The selection-ring colour for a filled swatch: the fill itself, same hue
 * and chroma, lightness pulled to a value that reads against the surface —
 * deepened in light mode, lifted in dark. A fill already past the mark keeps
 * its own distance from it (a near-black stays a near-black ring on white);
 * one that would sit invisible on the surface is dragged to it (a white pill
 * on white gets a mid-ring of its own hue).
 */
export function getSelectionRingHex(fillHex: string, isDark: boolean): string | null {
  const fill = normalizeHex(fillHex);
  if (!fill) return null;
  const { L, C, H } = hexToOklch(fill);
  const moved = isDark ? Math.max(L + 0.15, 0.6) : Math.min(L - 0.15, 0.5);
  return oklchToHex({ L: Math.min(0.99, Math.max(0.01, moved)), C, H });
}

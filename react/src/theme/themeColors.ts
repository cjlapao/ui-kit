/**
 * Concrete hexes for the kit's tone palette.
 *
 * Class-based tinting (`bg-blue-500 dark:bg-blue-400`) is what `ColorSwatches`
 * renders with, but a custom colour swatch must paint the *exact* colour the
 * user chose — and in dual mode the pill's fill and text ink have to be real
 * hexes to compute contrast between them. This module resolves the Tailwind
 * v4 default theme (`tailwind-palette.json`, the same strings the compiled
 * CSS ships) into `#rrggbb`, so a swatch drawn from the palette matches the
 * utility class an app would write down to the byte.
 *
 * The kit's fill step is 500 in light mode and 400 in dark — the same ladder
 * `getTrueColorDotClass` uses.
 */

import palette from "./tailwind-palette.json";
import type { TrueColor } from "./Theme";
import { toHex, type InkLadder } from "../utils/colorMath";

const COLORS = palette.colors as Record<string, string>;

/** The step a tone is rendered at — the `getTrueColorDotClass` ladder. */
export const TRUE_COLOR_FILL_STEP = { light: 500, dark: 400 } as const;

/** Cache: palette keys are hit over and over across swatches. */
const hexCache = new Map<string, string | null>();

function resolve(key: string): string | null {
  const cached = hexCache.get(key);
  if (cached !== undefined) return cached;
  const raw = COLORS[key];
  const hex = raw ? toHex(raw) : null;
  hexCache.set(key, hex);
  return hex;
}

/**
 * `#rrggbb` for a tone at a Tailwind step (50…950), e.g. ("blue", 300).
 * Null for tones or steps the palette does not carry.
 */
export function getTrueColorHex(
  tone: TrueColor,
  step: number,
): string | null {
  return resolve(`${tone}-${step}`);
}

/**
 * The tone's fill — 500 light, 400 dark, matching `getTrueColorDotClass` so
 * an inline-painted swatch and a utility-class swatch are the same colour.
 */
export function getTrueColorFillHex(
  tone: TrueColor,
  isDark: boolean,
): string {
  const step = isDark ? TRUE_COLOR_FILL_STEP.dark : TRUE_COLOR_FILL_STEP.light;
  return getTrueColorHex(tone, step) ?? getTrueColorHex(tone, 500)!;
}

const LIGHT_STEPS = [300, 200, 100, 50] as const;
const DARK_STEPS = [700, 800, 900, 950] as const;

/**
 * The on-palette ink ladder for a tone: its own light steps (most colourful
 * first) for a dark fill, its dark steps for a light fill. Feed to
 * `getAutoTextInk` so a palette tone's ink lands on real Tailwind steps
 * rather than continuous oklch values.
 */
export function getTrueColorInkLadder(tone: TrueColor): InkLadder {
  return {
    light: LIGHT_STEPS.map((s) => getTrueColorHex(tone, s)).filter(
      (h): h is string => h !== null,
    ),
    dark: DARK_STEPS.map((s) => getTrueColorHex(tone, s)).filter(
      (h): h is string => h !== null,
    ),
  };
}

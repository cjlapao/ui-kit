import type { TrueColor } from "./Theme";

type RandomIntensity = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

const RANDOM_INTENSITIES: RandomIntensity[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

// Keep this aligned with TrueColor values that map to Tailwind palette names.
// `slate` and `neutral` are excluded to avoid neutral/gray outputs.
const RANDOM_THEME_COLORS: TrueColor[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "rose",
  "gray",
  "zinc",
  "stone",
];

const randomFrom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export interface RandomThemeColorValue {
  color: string;
  intensity: RandomIntensity;
  token: string;
}

/**
 * Returns a random Tailwind color token based on the ui-kit theme palette,
 * like `blue-500` or `emerald-300`.
 */
export const getRandomThemeColorValue = (): RandomThemeColorValue => {
  const themeColor = randomFrom(RANDOM_THEME_COLORS);
  const intensity = randomFrom(RANDOM_INTENSITIES);
  return {
    color: themeColor,
    intensity,
    token: `${themeColor}-${intensity}`,
  };
};

/**
 * Returns a random Tailwind utility class for a theme color token.
 * Example: `getRandomThemeColorClass('bg')` -> `bg-blue-500`.
 */
export const getRandomThemeColorClass = (
  prefix: "bg" | "text" | "border" = "bg",
): string => {
  const { token } = getRandomThemeColorValue();
  return `${prefix}-${token}`;
};

// Ordered spectrum colors from TrueColor — used as the primary palette before falling back to random.
const THEME_MULTI_COLORS: TrueColor[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
];

/**
 * Returns an array of `count` Tailwind color utility classes.
 * Uses TrueColor values in order (at intensity 500), cycling once the
 * spectrum runs out, so the result is a pure function of `count`.
 *
 * @example
 * getColorPalette(5)           // ['bg-red-500', 'bg-orange-500', ...]
 * getColorPalette(5, 'text')   // ['text-red-500', 'text-orange-500', ...]
 */
export const getColorPalette = (
  count: number,
  prefix: "bg" | "text" | "border" = "bg",
): string[] =>
  Array.from(
    { length: count },
    // Cycles the ordered spectrum past its end. It used to fall back to
    // `getRandomThemeColorClass`, which made a palette of more than 21 entries
    // *non-deterministic*: the chart repainted in different colours on every
    // render, and a component calling this twice (once for the bar, once for
    // the legend) got two different palettes for the same data.
    (_, i) => `${prefix}-${THEME_MULTI_COLORS[i % THEME_MULTI_COLORS.length]}-500`,
  );

/**
 * Returns an array of `count` TrueColor names (e.g. `'red'`, `'orange'`, `'blue'`).
 * Uses TrueColor values in order, cycling once the spectrum runs out, so the
 * result is a pure function of `count`.
 * Useful when components construct their own Tailwind class strings via template literals.
 *
 * @example
 * getColorPaletteNames(3) // ['red', 'orange', 'amber']
 */
export const getColorPaletteNames = (count: number): TrueColor[] =>
  // Cycles rather than randomising past the end, for the same reason as
  // `getColorPalette`: a palette has to be a pure function of its length.
  Array.from(
    { length: count },
    (_, i) => THEME_MULTI_COLORS[i % THEME_MULTI_COLORS.length],
  );
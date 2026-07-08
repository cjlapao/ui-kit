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
 * Uses TrueColor values in order (at intensity 500) for the first N items,
 * then falls back to `getRandomThemeColorClass` for any overflow.
 *
 * @example
 * getColorPalette(5)           // ['bg-red-500', 'bg-orange-500', ...]
 * getColorPalette(5, 'text')   // ['text-red-500', 'text-orange-500', ...]
 */
export const getColorPalette = (
  count: number,
  prefix: "bg" | "text" | "border" = "bg",
): string[] =>
  Array.from({ length: count }, (_, i) => {
    if (i < THEME_MULTI_COLORS.length) {
      return `${prefix}-${THEME_MULTI_COLORS[i]}-500`;
    }
    return getRandomThemeColorClass(prefix);
  });

/**
 * Returns an array of `count` TrueColor names (e.g. `'red'`, `'orange'`, `'blue'`).
 * Uses TrueColor values in order for the first N items,
 * then falls back to random colors from RANDOM_THEME_COLORS for overflow.
 * Useful when components construct their own Tailwind class strings via template literals.
 *
 * @example
 * getColorPaletteNames(3) // ['red', 'orange', 'amber']
 */
export const getColorPaletteNames = (count: number): TrueColor[] =>
  Array.from({ length: count }, (_, i) => {
    if (i < THEME_MULTI_COLORS.length) {
      return THEME_MULTI_COLORS[i];
    }
    return randomFrom(RANDOM_THEME_COLORS);
  });
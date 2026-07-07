/**
 * common/theme/glass.ts — Framework-agnostic glass utility module.
 *
 * Extracts all glass logic from Panel into reusable functions and types
 * so that any control (Button, IconButton, DropdownButton, etc.) can
 * compose glass styling without duplicating the Panel implementation.
 *
 * This file is pure TypeScript — no React, Vue, or DOM imports.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Backdrop vibrancy level for glass surfaces.
 * - `"low"`     → 1.0× saturation
 * - `"medium"`  → 1.2× saturation (default)
 * - `"high"`    → 1.4× saturation
 * - `number`    → arbitrary multiplier (0 – 2 recommended)
 */
export type GlassVibrancy = "low" | "medium" | "high" | number;

/**
 * Glass fill transparency level.
 * - `"frosted"` → 45 % light / 15 % dark  (default)
 * - `"light"`   → 70 % light / 25 % dark
 * - `"clear"`   → 20 % light /  5 % dark
 * - `number`    → 0–1 fraction; light = round(frac × 100), dark = min(round(frac × 30), 30)
 */
export type GlassOpacity = "frosted" | "light" | "clear" | number;

/**
 * Specular highlight mode for glass surfaces.
 * - `"none"`    → no specular overlay
 * - `"classic"` → single hairline gradient at top edge
 * - `"halo"`    → corner caps + diffuse band + bottom darken
 */
export type SpecularMode = "none" | "classic" | "halo";

// ---------------------------------------------------------------------------
// Minimal colour resolver (mirrors `resolveColor` from Theme.ts)
// ---------------------------------------------------------------------------

/** Maps semantic colour tokens to Tailwind colour names. */
const SEMANTIC_MAP: Record<string, string> = {
  brand: "blue",
  info: "sky",
  success: "emerald",
  warning: "amber",
  danger: "rose",
  theme: "neutral",
  parallels: "red",
};

/**
 * Tailwind colour names that are safe to use in dynamic utility classes.
 * Used to gate glass fill generation — colours outside this set fall back
 * to "neutral" so no invalid CSS is emitted.
 */
const GLASS_COLOR_SAFELIST: ReadonlySet<string> = new Set([
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
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
]);

/** Resolve a semantic/theme colour to a Tailwind colour name. */
export const resolveColor = (color: string): string => {
  return SEMANTIC_MAP[color] ?? color;
};

// ---------------------------------------------------------------------------
// getGlassFillClass
// ---------------------------------------------------------------------------

/**
 * Compute the Tailwind fill classes for a glass surface.
 *
 * Returns a string like `"bg-blue-100/55 hover:bg-blue-100/65 dark:bg-blue-600/25 dark:hover:bg-blue-600/35"`.
 *
 * @param color   - ThemeColour token (e.g. `"blue"`, `"brand"`, `"success"`)
 * @param opacity - Glass opacity preset or numeric fraction (0–1)
 */
export const getGlassFillClass = (
  color: string,
  opacity: GlassOpacity,
): string => {
  const litOpacity: number = (() => {
    if (typeof opacity === "number") return Math.round(opacity * 100);
    if (opacity === "frosted") return 55;
    if (opacity === "light") return 75;
    if (opacity === "clear") return 30;
    return 55; // fallback
  })();

  const drkOpacity: number = (() => {
    if (typeof opacity === "number")
      return Math.min(Math.round(opacity * 30), 30);
    if (opacity === "frosted") return 25;
    if (opacity === "light") return 35;
    if (opacity === "clear") return 10;
    return 25; // fallback
  })();

  const base = resolveColor(color);

  // Gate against colours that don't exist in Tailwind's palette (e.g.
  // "fuchsia" was removed in v3.2, "white" is a literal, not a colour).
  // Fall back to "neutral" so no invalid CSS is emitted.
  const safeBase = GLASS_COLOR_SAFELIST.has(base) ? base : "neutral";

  return `bg-${safeBase}-100/${litOpacity} hover:bg-${safeBase}-100/${litOpacity + 10} dark:bg-${safeBase}-600/${drkOpacity} dark:hover:bg-${safeBase}-600/${drkOpacity + 10}`;
};

// ---------------------------------------------------------------------------
// getGlassVibrancyClass
// ---------------------------------------------------------------------------

/**
 * Map a vibrancy setting to a Tailwind backdrop-saturate class.
 *
 * @param vibrancy - Low / medium / high preset or arbitrary multiplier
 * @returns e.g. `"backdrop-saturate-[1.2]"`
 */
export const getGlassVibrancyClass = (vibrancy: GlassVibrancy): string => {
  const value: number = (() => {
    if (typeof vibrancy === "number") return vibrancy;
    if (vibrancy === "low") return 1;
    if (vibrancy === "medium") return 1.2;
    if (vibrancy === "high") return 1.4;
    return 1.2;
  })();

  return `backdrop-saturate-[${value}]`;
};

// ---------------------------------------------------------------------------
// getSpecularClasses
// ---------------------------------------------------------------------------

/**
 * Build Tailwind classes for a specular highlight overlay.
 *
 * - `"none"`       → `null` (no overlay)
 * - `"classic"`    → soft top-edge hairline reflection
 * - `"halo"`       → corner caps + diffuse top glow
 *
 * @returns class string or `null`
 */
export const getSpecularClasses = (mode: SpecularMode): string | null => {
  switch (mode) {
    case "none":
      return null;

    /**
     * Classic: a soft top-edge reflection, like light grazing the upper edge
     * of a pane of glass. Subtle white-to-transparent gradient, 10px tall,
     * spanning the full width, softly clipped by the track's rounded corners.
     */
    case "classic":
      return (
        "pointer-events-none absolute inset-x-0 top-0 h-[10px]" +
        " bg-gradient-to-b from-white/12 via-white/4 to-transparent" +
        " dark:from-white/5 dark:via-white/2"
      );

    /**
     * Halo: two corner reflections (top-left + top-right) plus a diffuse
     * glow band across the top. Mimics light scattering across a curved
     * glass surface — soft, wide, and very low opacity.
     */
    case "halo":
      return (
        // Top-left corner reflection
        "pointer-events-none absolute top-0 left-0 w-[40%] h-[35%]" +
        " rounded-tl-[inherit]" +
        " bg-gradient-to-br from-white/10 via-white/4 to-transparent" +
        // Top-right corner reflection
        " pointer-events-none absolute top-0 right-0 w-[40%] h-[35%]" +
        " rounded-tr-[inherit]" +
        " bg-gradient-to-bl from-white/10 via-white/4 to-transparent" +
        // Diffuse top glow band
        " pointer-events-none absolute inset-x-0 top-0 h-[20%]" +
        " bg-gradient-to-b from-white/6 via-white/2 to-transparent" +
        " dark:from-white/3 dark:via-white/1"
      );

    default:
      return null;
  }
};
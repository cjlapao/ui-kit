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
 * Returns a string like `"bg-blue-50/45 dark:bg-blue-500/15"`.
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
    if (opacity === "frosted") return 45;
    if (opacity === "light") return 70;
    if (opacity === "clear") return 20;
    return 45; // fallback
  })();

  const drkOpacity: number = (() => {
    if (typeof opacity === "number")
      return Math.min(Math.round(opacity * 30), 30);
    if (opacity === "frosted") return 15;
    if (opacity === "light") return 25;
    if (opacity === "clear") return 5;
    return 15; // fallback
  })();

  const base = resolveColor(color);

  return `bg-${base}-50/${litOpacity} dark:bg-${base}-500/${drkOpacity}`;
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
 * - `"classic"`    → top-edge hairline gradient
 * - `"halo"`       → corner caps + diffuse band + bottom darken
 *
 * @returns class string or `null`
 */
export const getSpecularClasses = (mode: SpecularMode): string | null => {
  switch (mode) {
    case "none":
      return null;

    case "classic":
      return (
        "pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit]" +
        " bg-gradient-to-r from-transparent via-white/40 to-transparent" +
        " dark:via-white/10"
      );

    case "halo":
      return (
        // Top-left corner cap
        "pointer-events-none absolute top-0 left-0 w-24 h-12 rounded-tl-[inherit]" +
        " bg-gradient-to-br from-white/45 via-white/15 to-transparent" +
        // Top-right corner cap
        " pointer-events-none absolute top-0 right-0 w-24 h-12 rounded-tr-[inherit]" +
        " bg-gradient-to-bl from-white/45 via-white/15 to-transparent" +
        // Diffuse glow band
        " pointer-events-none absolute inset-x-0 top-0 h-[28%]" +
        " bg-gradient-to-b from-white/20 via-white/8 to-transparent" +
        // Bottom darken
        " pointer-events-none absolute inset-x-0 bottom-0 h-[15%]" +
        " bg-gradient-to-t from-transparent to-black/4"
      );

    default:
      return null;
  }
};
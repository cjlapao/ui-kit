/**
 * common/theme/glass.ts — Framework-agnostic glass utility module.
 *
 * Extracts all glass logic from Panel into reusable functions and types
 * so that any control (Button, IconButton, DropdownButton, etc.) can
 * compose glass styling without duplicating the Panel implementation.
 *
 * This file is pure TypeScript — no React, Vue, or DOM imports.
 */

import type { TrueColor } from "./Theme";

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
 * - `"frosted"` → 65 % light / 25 % dark  (default)
 * - `"light"`   → 85 % light / 35 % dark
 * - `"clear"`   → 30 % light / 10 % dark  (sheer — pair with a light backdrop)
 * - `number`    → 0–1 fraction; light = round(frac × 100), dark = min(round(frac × 30), 30)
 *
 * Only the three presets (and their +10 hover steps) are safelisted. A numeric
 * value emits an arbitrary opacity that Tailwind's scanner cannot see, so the
 * fill silently disappears unless that exact step happens to be generated —
 * see `scripts/generate-safelist.mjs`.
 */
export type GlassOpacity = "frosted" | "light" | "clear" | number;

/**
 * Specular highlight mode for glass surfaces.
 * - `"none"`    → no specular overlay
 * - `"classic"` → sheen falling from the top edge
 * - `"halo"`    → broad bloom plus two off-centre corner glints
 */
export type SpecularMode = "none" | "classic" | "halo";

// ---------------------------------------------------------------------------
// Colour safelist
// ---------------------------------------------------------------------------

/**
 * Tailwind colour names that are safe to use in dynamic utility classes.
 * Mirrors the TrueColor union from Theme.ts to guard against invalid CSS
 * being emitted for colours that don't exist in Tailwind's palette.
 */
const GLASS_COLOR_SAFELIST: ReadonlySet<TrueColor> = new Set([
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
]);

// ---------------------------------------------------------------------------
// getGlassFillClass
// ---------------------------------------------------------------------------

/**
 * Compute the Tailwind fill classes for a glass surface.
 *
 * Returns a string like `"bg-blue-100/55 hover:bg-blue-100/65 dark:bg-blue-600/25 dark:hover:bg-blue-600/35"`.
 *
 * @param color   - TrueColor token (e.g. `"blue"`, `"red"`, `"fuchsia"`)
 * @param opacity - Glass opacity preset or numeric fraction (0–1)
 */
export const getGlassFillClass = (
  color: TrueColor,
  opacity: GlassOpacity,
): string => {
  const litOpacity: number = (() => {
    if (typeof opacity === "number") return Math.round(opacity * 100);
    // Raised from 55/75: at the old values a `{color}-900` label sat on a fill
    // too sheer to carry it over a dark backdrop. These steps (and their +10
    // hover partners) are all safelisted.
    if (opacity === "frosted") return 65;
    if (opacity === "light") return 85;
    if (opacity === "clear") return 30;
    return 65; // fallback
  })();

  const drkOpacity: number = (() => {
    if (typeof opacity === "number")
      return Math.min(Math.round(opacity * 30), 30);
    if (opacity === "frosted") return 25;
    if (opacity === "light") return 35;
    if (opacity === "clear") return 10;
    return 25; // fallback
  })();

  // Gate against colours that don't exist in Tailwind's palette (e.g.
  // "white" is a literal, not a colour).
  // Fall back to "neutral" so no invalid CSS is emitted.
  const safeBase: TrueColor = GLASS_COLOR_SAFELIST.has(color)
    ? color
    : "neutral";

  return `bg-${safeBase}-100/${litOpacity} hover:bg-${safeBase}-100/${litOpacity + 10} dark:bg-${safeBase}-600/${drkOpacity} dark:hover:bg-${safeBase}-600/${drkOpacity + 10}`;
};

// ---------------------------------------------------------------------------
// getSurfaceGlassFillClass
// ---------------------------------------------------------------------------

/**
 * Glass fill for a *container* surface — `Panel` and anything built on it.
 *
 * Deliberately sheerer than `getGlassFillClass`, which is tuned for controls.
 * A Button is a small target that has to stay legible against its own label; a
 * Panel covers most of the viewport, and the same 65% fill over that area
 * turns the backdrop into a flat wash and defeats the point of glass. It also
 * omits the hover step: a card is not hoverable by default.
 *
 * `Panel` built these strings inline, so the two implementations of "glass
 * fill" sat in different files with different scales and no shared safelist.
 * The steps here are the ones `scripts/generate-safelist.mjs` emits.
 */
export const getSurfaceGlassFillClass = (
  color: TrueColor,
  opacity: GlassOpacity,
): string => {
  const litOpacity: number = (() => {
    if (typeof opacity === "number") return Math.round(opacity * 100);
    if (opacity === "frosted") return 45;
    if (opacity === "light") return 70;
    if (opacity === "clear") return 20;
    return 45;
  })();

  const drkOpacity: number = (() => {
    if (typeof opacity === "number") return Math.min(Math.round(opacity * 30), 30);
    if (opacity === "frosted") return 15;
    if (opacity === "light") return 25;
    if (opacity === "clear") return 5;
    return 15;
  })();

  const safeBase: TrueColor = GLASS_COLOR_SAFELIST.has(color)
    ? color
    : "neutral";

  return `bg-${safeBase}-50/${litOpacity} dark:bg-${safeBase}-500/${drkOpacity}`;
};

// ---------------------------------------------------------------------------
// Container halo
// ---------------------------------------------------------------------------

/**
 * Halo specular for a container, as stacked full-bleed gradient layers for a
 * `background-image`.
 *
 * Every layer spans the whole surface and reaches full transparency *inside*
 * its own box, so none of them contributes a visible edge. An earlier version
 * used two fixed `w-24 h-12` corner boxes filled with linear gradients — a
 * linear gradient only fades along one axis, so the boxes' remaining edges cut
 * off hard and read as two grey rectangles in the corners.
 *
 * Layer order is top-most first: the broad bloom, two off-centre glints that
 * keep the light from looking symmetrical, then a little weight at the base.
 * Exported so both kits' `Panel` paint the identical halo.
 */
export const SURFACE_HALO_LIGHT = [
  "radial-gradient(130% 90% at 50% -30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 38%, rgba(255,255,255,0) 72%)",
  "radial-gradient(45% 55% at 8% -6%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0) 65%)",
  "radial-gradient(45% 55% at 92% -6%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 65%)",
  "linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 32%)",
].join(",");

export const SURFACE_HALO_DARK = [
  "radial-gradient(130% 90% at 50% -30%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 72%)",
  "radial-gradient(45% 55% at 8% -6%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 65%)",
  "radial-gradient(45% 55% at 92% -6%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 65%)",
  "linear-gradient(to top, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 32%)",
].join(",");

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
 * Specular paint for a glass surface.
 *
 * Two rules, both learned the hard way:
 *
 * 1. **Paint only.** Callers already position the overlay
 *    (`pointer-events-none absolute inset-0 rounded-[inherit]`). Returning
 *    layout utilities on top of that produced conflicting pairs — `inset-0`
 *    against `inset-x-0 top-0 h-[10px]` — where whichever Tailwind emitted
 *    last won, so the overlay never had the geometry it was written for.
 *
 * 2. **Full-bleed, fading to transparent inside itself.** A partial-size box
 *    with a linear gradient only fades along one axis, so its remaining edges
 *    cut off hard and render as visible rectangles. `halo` previously
 *    concatenated three such overlays into one class string applied to one
 *    element, so its corner boxes, its band and its three gradient directions
 *    all fought each other and collapsed into a single weak band.
 */

/** Sheen falling from the top edge, reaching zero before the bottom. */
const SPECULAR_CLASSIC =
  "bg-gradient-to-b from-white/35 via-white/8 to-transparent dark:from-white/12 dark:via-white/[0.03]";

/**
 * Broad bloom anchored above the top edge plus two off-centre glints, as
 * stacked radial layers in a single `background-image`. Written as one
 * unbroken literal per mode so Tailwind's scanner sees the whole candidate.
 */
const SPECULAR_HALO_LIGHT =
  "bg-[radial-gradient(120%_85%_at_50%_-25%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0)_72%),radial-gradient(45%_60%_at_12%_-8%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%),radial-gradient(45%_60%_at_88%_-8%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_60%)]";

const SPECULAR_HALO_DARK =
  "dark:bg-[radial-gradient(120%_85%_at_50%_-25%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0)_72%),radial-gradient(45%_60%_at_12%_-8%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_60%),radial-gradient(45%_60%_at_88%_-8%,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_60%)]";

/**
 * Build the specular paint classes for a glass surface.
 *
 * The caller owns positioning; this returns background utilities only.
 *
 * @returns class string, or `null` for `"none"`
 */
export const getSpecularClasses = (mode: SpecularMode): string | null => {
  switch (mode) {
    case "none":
      return null;

    case "classic":
      return SPECULAR_CLASSIC;

    case "halo":
      return `${SPECULAR_HALO_LIGHT} ${SPECULAR_HALO_DARK}`;

    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// getGlassChromeClasses
// ---------------------------------------------------------------------------

/**
 * Text, rim and focus ring for a glass control.
 *
 * Glass surfaces drop the variant's own colour classes (those paint an opaque
 * fill), which previously left the control with **no** text colour, border or
 * focus ring at all — the label inherited whatever the page happened to set.
 *
 * The rim is deliberately tone-independent white: a saturated `{color}-500`
 * edge fights the backdrop the control is meant to sit over. Matches the rim
 * `Panel` uses for its glass variants.
 */
export interface GlassChromeOptions {
  /**
   * Include the hover response and focus ring. Turn it off for a glass surface
   * that is only a label — a rim that brightens under the cursor on something
   * you cannot click reads as a broken affordance.
   * @default true
   */
  interactive?: boolean;
}

export const getGlassChromeClasses = (
  color: TrueColor,
  options: GlassChromeOptions = {},
): string => {
  const { interactive = true } = options;
  const safeBase: TrueColor = GLASS_COLOR_SAFELIST.has(color)
    ? color
    : "neutral";

  const chrome = [
    // At rest the rim stays a neutral white: a saturated `{color}-500` edge at
    // rest would fight the backdrop the control sits over. Matches `Panel`.
    "border border-white/50 dark:border-white/10",
    `text-${safeBase}-900 dark:text-${safeBase}-50`,
  ];

  if (interactive) {
    // Hover ignites the rim in the control's own tone. The border is glass's
    // defining feature, so it carries the state: a colour + saturation jump on
    // the edge reads far more strongly than brightening the white rim, and it
    // is the response the flat, in-surface hover needs now the shadow is gone.
    // Still no shadow — a drop shadow reads as the panel lifting, which
    // contradicts the other variants' hover (a plain darken or denser tint).
    chrome.push(
      `hover:border-${safeBase}-500 dark:hover:border-${safeBase}-300`,
      `focus-visible:ring-2 focus-visible:ring-${safeBase}-400 focus-visible:ring-offset-2`,
    );
  }

  return chrome.join(" ");
};
/**
 * Dither noise (film grain) — one shared texture for every surface that paints
 * one (SidePanel, GradientBackdrop).
 *
 * A fractal-turbulence SVG, desaturated to grey so a multiply pass cannot cast
 * colour. The blend differs per scheme because `overlay` is a no-op on a
 * near-white base: light surfaces get a faint multiply, dark ones an overlay.
 */

export const NOISE_BACKGROUND_IMAGE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export type NoiseScheme = "auto" | "light" | "dark";

const LIGHT = "mix-blend-multiply opacity-[0.08]";
const DARK = "mix-blend-overlay opacity-[0.4]";

/**
 * Blend + strength of the noise layer: `auto` follows the kit's `dark` class,
 * `light` / `dark` pin one (for a surface whose scheme is not the page's).
 */
export function getNoiseBlendClasses(scheme: NoiseScheme = "auto"): string {
  if (scheme === "light") return LIGHT;
  if (scheme === "dark") return DARK;
  return `${LIGHT} dark:mix-blend-overlay dark:opacity-[0.4]`;
}

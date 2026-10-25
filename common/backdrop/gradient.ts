/**
 * GradientBackdrop engine — the soft gradient backdrops the kit's docs use
 * behind glass, as themes a consumer can pick from or define.
 *
 * A backdrop is one radial glow over a three-stop linear gradient. A theme
 * holds the four colours for light and/or dark mode plus the shape. Give only
 * one side and the other is derived (`deriveDarkColor` / `deriveLightColor`)
 * with a formula fitted on the six built-in templates.
 */

import { hexToOklch, hexToRgba, oklchToHex } from "./color";

/** The four colours of one scheme. */
export interface GradientBackdropColors {
  /** The radial highlight. */
  glow: string;
  /** Linear gradient start. */
  from: string;
  /** Linear gradient middle stop. */
  via: string;
  /** Linear gradient end. */
  to: string;
}

export type GradientBackdropRole = keyof GradientBackdropColors;

/** Geometry shared by both schemes. */
export interface GradientBackdropShape {
  /** Linear gradient angle, degrees. */
  angle: number;
  /** Position of the middle stop, %. */
  viaStop: number;
  /** Radial glow ellipse size, px. */
  glowWidth: number;
  glowHeight: number;
  /** Radial glow centre, % of the box (may sit outside: -8, 118…). */
  glowX: number;
  glowY: number;
  /** Where the glow has faded out, %. */
  glowFade: number;
}

/**
 * A backdrop theme. Give `light`, `dark`, or both — the missing side is
 * derived. `shape` overrides any part of the default (Slate's) geometry.
 */
export interface GradientBackdropTheme {
  label?: string;
  light?: GradientBackdropColors;
  dark?: GradientBackdropColors;
  shape?: Partial<GradientBackdropShape>;
}

/** A theme with every part present — what the renderer consumes. */
export interface ResolvedGradientBackdropTheme {
  label?: string;
  light: GradientBackdropColors;
  dark: GradientBackdropColors;
  shape: GradientBackdropShape;
}

/** Built-in template ids — runtime list so demos can enumerate them. */
export const GRADIENT_BACKDROP_TEMPLATE_IDS = ["slate", "mist", "stone", "dune", "fog", "graphite"] as const;
export type GradientBackdropTemplateId = (typeof GRADIENT_BACKDROP_TEMPLATE_IDS)[number];

const shape = (
  angle: number,
  viaStop: number,
  glowWidth: number,
  glowHeight: number,
  glowX: number,
  glowY: number,
  glowFade: number,
): GradientBackdropShape => ({ angle, viaStop, glowWidth, glowHeight, glowX, glowY, glowFade });

/**
 * Muted, low-saturation templates (slates, greys, warm neutrals) — they stand
 * in for real app content, so translucent components can be judged the way
 * they will look in a product.
 */
export const GRADIENT_BACKDROP_TEMPLATES: Record<GradientBackdropTemplateId, ResolvedGradientBackdropTheme> = {
  slate: {
    label: "Slate",
    light: { glow: "#e2e8f0", from: "#f8fafc", via: "#e2e8f0", to: "#cbd5e1" },
    dark: { glow: "#334155", from: "#0f172a", via: "#1e293b", to: "#334155" },
    shape: shape(135, 55, 1100, 560, 18, -8, 62),
  },
  mist: {
    label: "Mist",
    light: { glow: "#dbeafe", from: "#f8fafc", via: "#e6edf5", to: "#d3dde9" },
    dark: { glow: "#16304f", from: "#0b1220", via: "#16202e", to: "#1f2c3d" },
    shape: shape(160, 55, 900, 500, 82, 8, 58),
  },
  stone: {
    label: "Stone",
    light: { glow: "#e7e5e4", from: "#fafaf9", via: "#e7e5e4", to: "#d6d3d1" },
    dark: { glow: "#292524", from: "#1c1917", via: "#292524", to: "#44403c" },
    shape: shape(135, 55, 1000, 560, 14, 108, 62),
  },
  dune: {
    label: "Dune",
    light: { glow: "#ece7df", from: "#f7f4ef", via: "#ece7df", to: "#ded5c8" },
    dark: { glow: "#221e1a", from: "#141210", via: "#221e1a", to: "#35302a" },
    shape: shape(180, 55, 900, 480, 50, 118, 60),
  },
  fog: {
    label: "Fog",
    light: { glow: "#e2e8f0", from: "#f5f7fa", via: "#e8edf3", to: "#f5f7fa" },
    dark: { glow: "#1e293b", from: "#0f1420", via: "#1a2332", to: "#0f1420" },
    shape: shape(120, 50, 820, 420, 50, 118, 60),
  },
  graphite: {
    label: "Graphite",
    light: { glow: "#d1d5db", from: "#e5e7eb", via: "#d1d5db", to: "#9ca3af" },
    dark: { glow: "#3f3f46", from: "#18181b", via: "#27272a", to: "#3f3f46" },
    shape: shape(135, 45, 1000, 520, 22, -10, 60),
  },
};

/**
 * The derivation formula, fitted (least squares, OKLCH lightness) on the 24
 * light/dark colour pairs of the six templates, one line per role because
 * the roles behave differently: the base (`from`) of a dark backdrop sits in
 * a narrow band (~0.18–0.22) whatever the light one was, while the glow and
 * the end stop keep more of their light-mode contrast.
 *
 *   dark L  = a + b · light L      light L = c + d · dark L
 *
 * The two directions are fitted separately rather than inverted: inverting
 * the near-flat `from` line would amplify every difference sevenfold. Max
 * error against the hand-picked templates: 0.079 (→dark), 0.107 (→light).
 * Hue is kept; chroma doubles going dark (median of the pairs), capped so a
 * tinted light never becomes a loud dark, and halves going light.
 */
export const GRADIENT_BACKDROP_DERIVATION: Record<
  GradientBackdropRole,
  { toDark: [number, number]; toLight: [number, number] }
> = {
  glow: { toDark: [1.5005, -1.3003], toLight: [0.9904, -0.2338] },
  from: { toDark: [0.3317, -0.1368], toLight: [1.0358, -0.3275] },
  via: { toDark: [0.5799, -0.3472], toLight: [1.1357, -0.8186] },
  to: { toDark: [0.8527, -0.6169], toLight: [1.1453, -0.8766] },
};
const DARK_CHROMA_GAIN = 2;
const DARK_CHROMA_MAX = 0.08;
const clampL = (L: number) => Math.min(0.99, Math.max(0.05, L));

/** The dark-mode partner of a light-mode colour in `role`. */
export function deriveDarkColor(hex: string, role: GradientBackdropRole = "via"): string {
  const c = hexToOklch(hex);
  const [a, b] = GRADIENT_BACKDROP_DERIVATION[role].toDark;
  return oklchToHex({ L: clampL(a + b * c.L), C: Math.min(c.C * DARK_CHROMA_GAIN, DARK_CHROMA_MAX), H: c.H });
}

/** The light-mode partner of a dark-mode colour in `role`. */
export function deriveLightColor(hex: string, role: GradientBackdropRole = "via"): string {
  const c = hexToOklch(hex);
  const [a, b] = GRADIENT_BACKDROP_DERIVATION[role].toLight;
  return oklchToHex({ L: clampL(a + b * c.L), C: c.C / DARK_CHROMA_GAIN, H: c.H });
}

const ROLES: GradientBackdropRole[] = ["glow", "from", "via", "to"];
const derive = (colors: GradientBackdropColors, fn: (hex: string, role: GradientBackdropRole) => string) =>
  Object.fromEntries(ROLES.map((r) => [r, fn(colors[r], r)])) as unknown as GradientBackdropColors;

/**
 * A template id or a theme → a complete theme. A missing side is derived; a
 * theme with neither side (or an unknown id) falls back to Slate.
 */
export function resolveGradientBackdropTheme(
  theme: GradientBackdropTemplateId | GradientBackdropTheme = "slate",
): ResolvedGradientBackdropTheme {
  if (typeof theme === "string") return GRADIENT_BACKDROP_TEMPLATES[theme] ?? GRADIENT_BACKDROP_TEMPLATES.slate;
  const base = GRADIENT_BACKDROP_TEMPLATES.slate;
  const shapeOut = { ...base.shape, ...theme.shape };
  if (!theme.light && !theme.dark) return { ...base, label: theme.label ?? base.label, shape: shapeOut };
  const light = theme.light ?? derive(theme.dark!, deriveLightColor);
  const dark = theme.dark ?? derive(theme.light!, deriveDarkColor);
  return { label: theme.label, light, dark, shape: shapeOut };
}

/** The CSS `background` value for one scheme. */
export function gradientBackdropCss(colors: GradientBackdropColors, s: GradientBackdropShape): string {
  return (
    `radial-gradient(${s.glowWidth}px ${s.glowHeight}px at ${s.glowX}% ${s.glowY}%, ${colors.glow} 0%, ${hexToRgba(colors.glow, 0)} ${s.glowFade}%), ` +
    `linear-gradient(${s.angle}deg, ${colors.from} 0%, ${colors.via} ${s.viaStop}%, ${colors.to} 100%)`
  );
}

/**
 * Chart theming: per-scheme tokens and color resolution.
 *
 * Chart marks paint with SVG attributes / canvas fillStyle, so colors are
 * plain hex strings here (never Tailwind classes). The TrueColor-name → hex
 * map keeps series colors inside the kit's 21-tone system while staying
 * framework-agnostic.
 */
import type {
  ChartColor,
  ChartThemeMode,
  ChartThemeTokens,
  GradientColor,
  ResolvedColor,
} from "./types";

// ── TrueColor hex map ────────────────────────────────────────────────────────
// Tailwind 500-level values for the kit's 21 TrueColors.

export const TRUE_COLOR_HEX: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
};

/**
 * The default series palette, in the reference demo's order:
 * violet, blue, emerald, red — then the rest of the kit hues.
 * 400-level values read better on both dark and light chart surfaces.
 */
export const DEFAULT_SERIES_PALETTE: string[] = [
  "#8b5cf6", // violet-500
  "#60a5fa", // blue-400
  "#34d399", // emerald-400
  "#f87171", // red-400
  "#fbbf24", // amber-400
  "#2dd4bf", // teal-400
  "#f472b6", // pink-400
  "#fb923c", // orange-400
];

// ── Scheme tokens ────────────────────────────────────────────────────────────

const LIGHT_TOKENS: ChartThemeTokens = {
  textColor: "#6b7280", // gray-500
  subtleText: "#9ca3af", // gray-400
  titleText: "#111827", // gray-900
  subtitleText: "#6b7280",
  gridColor: "#e5e7eb", // gray-200
  axisColor: "#d1d5db", // gray-300
  tooltipBg: "rgba(255, 255, 255, 0.96)",
  tooltipBorder: "#e5e7eb",
  tooltipText: "#111827",
  tooltipSubtleText: "#6b7280",
  annotationBg: "rgba(255, 255, 255, 0.97)",
  annotationBorder: "#d1d5db",
  bandLabelBg: "rgba(255, 255, 255, 0.9)",
  badgeBg: "#ffffff",
  emptyText: "#9ca3af",
  crosshairColor: "#9ca3af",
};

const DARK_TOKENS: ChartThemeTokens = {
  textColor: "#9ca3af", // gray-400
  subtleText: "#6b7280", // gray-500
  titleText: "#f9fafb", // gray-50
  subtitleText: "#9ca3af",
  gridColor: "rgba(75, 85, 99, 0.4)", // gray-600 @ 40%
  axisColor: "#4b5563", // gray-600
  tooltipBg: "rgba(11, 15, 20, 0.92)",
  tooltipBorder: "#2a3140",
  tooltipText: "#f3f4f6",
  tooltipSubtleText: "#9ca3af",
  annotationBg: "rgba(10, 14, 19, 0.95)",
  annotationBorder: "#2a3140",
  bandLabelBg: "rgba(10, 14, 19, 0.75)",
  badgeBg: "#111827",
  emptyText: "#4b5563",
  crosshairColor: "#6b7280",
};

const THEMES: Record<ChartThemeMode, ChartThemeTokens> = {
  light: LIGHT_TOKENS,
  dark: DARK_TOKENS,
};

export function getChartTheme(mode: ChartThemeMode): ChartThemeTokens {
  return THEMES[mode];
}

// ── Color resolution ─────────────────────────────────────────────────────────

/**
 * Blend a hex color toward black (factor 0 = original, 1 = black).
 * Non-hex inputs fall back to a neutral dark pill so labels always keep
 * contrast on top of their slice.
 */
export function shadeColor(color: string, factor: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return "rgba(15, 23, 42, 0.55)";
  const n = parseInt(m[1], 16);
  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(((n >> 16) & 255) * (1 - f));
  const g = Math.round(((n >> 8) & 255) * (1 - f));
  const b = Math.round((n & 255) * (1 - f));
  return `rgb(${r}, ${g}, ${b})`;
}

function isGradientColor(input: ChartColor): input is GradientColor {
  return (
    typeof input === "object" &&
    input !== null &&
    Array.isArray((input as GradientColor).stops)
  );
}

/**
 * Looks like a raw CSS color (hex, rgb/rgba, hsl, color(...), or a spaced
 * functional notation) — as opposed to a tone name like "purple".
 */
function looksLikeCssColor(s: string): boolean {
  return (
    s.startsWith("#") ||
    /(rgba?|hsla?|hwb|lab|lch|oklab|oklch|cmyk|color)\(/.test(s) ||
    s.includes(" ")
  );
}

/**
 * Resolve a series color input to renderer-ready colors.
 *
 * - gradient object → passed through, base = first stop color
 * - TrueColor name  → hex from {@link TRUE_COLOR_HEX}
 * - CSS color string (hex/rgb/hsl/…) → passed through
 * - any other string (unknown tone name) → palette fallback, never a
 *   silently-broken CSS color
 * - undefined       → palette[index % palette.length]
 */
export function resolveColor(
  input: ChartColor | undefined,
  index: number,
  palette: string[] = DEFAULT_SERIES_PALETTE,
): ResolvedColor {
  const fallback =
    palette.length > 0 ? palette[index % palette.length] : "#8b5cf6";

  if (input === undefined || input === null) {
    return { stroke: fallback, fill: fallback, isGradient: false, base: fallback };
  }

  if (isGradientColor(input)) {
    const base = input.stops.length > 0 ? input.stops[0].color : fallback;
    return {
      stroke: base,
      fill: base,
      gradient: input,
      isGradient: true,
      base,
    };
  }

  const hex = TRUE_COLOR_HEX[input];
  if (hex) {
    return { stroke: hex, fill: hex, isGradient: false, base: hex };
  }
  if (looksLikeCssColor(input)) {
    return { stroke: input, fill: input, isGradient: false, base: input };
  }
  return { stroke: fallback, fill: fallback, isGradient: false, base: fallback };
}

/**
 * A tone color for non-series chrome (annotations, bands) with a fallback so
 * unknown tones degrade to the palette instead of `undefined`.
 */
export function resolveToneHex(
  tone: string | undefined,
  index: number,
  palette: string[] = DEFAULT_SERIES_PALETTE,
): string {
  if (!tone) return resolveColor(undefined, index, palette).stroke;
  const hex = TRUE_COLOR_HEX[tone];
  if (hex) return hex;
  if (looksLikeCssColor(tone)) return tone;
  return resolveColor(undefined, index, palette).stroke;
}

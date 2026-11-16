export type AiOrbState = "idle" | "listening" | "speaking";
export type AiOrbPreset = "solar" | "ion" | "ember";
export type AiOrbQuality = "low" | "balanced" | "high";

export interface AiOrbAppearance {
  coreColor?: string;
  accentColor?: string;
  glowColor?: string;
  /** Brightness of the surrounding glow, from 0 to 1. */
  glow?: number;
  /** Ambient and audio-driven motion, from 0 to 1. */
  motionIntensity?: number;
  /** Strength of automatic detail enhancement below 240 CSS pixels, from 0 to 1. */
  definition?: number;
}

export const AI_ORB_PRESETS: Record<AiOrbPreset, Required<AiOrbAppearance>> = {
  solar: { coreColor: "#ffe9a8", accentColor: "#ff9b32", glowColor: "#ed5b16", glow: 0.7, motionIntensity: 0.75, definition: 1 },
  ion: { coreColor: "#e0fffa", accentColor: "#63e8dd", glowColor: "#158ca5", glow: 0.55, motionIntensity: 0.6, definition: 1 },
  ember: { coreColor: "#641b18", accentColor: "#ff7754", glowColor: "#ad2517", glow: 0.45, motionIntensity: 0.4, definition: 1 },
};

export const AI_ORB_QUALITY = {
  low: { fps: 24, dpr: 1, particles: 8, flares: 6, rings: 2 },
  balanced: { fps: 30, dpr: 1.5, particles: 16, flares: 10, rings: 3 },
  high: { fps: 60, dpr: 2, particles: 24, flares: 14, rings: 3 },
} as const;

export function unit(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
}

export function resolveAppearance(preset: AiOrbPreset, appearance?: AiOrbAppearance): Required<AiOrbAppearance> {
  const base = AI_ORB_PRESETS[preset];
  const color = (value: string | undefined, fallback: string) => {
    if (!value || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) return fallback;
    return value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value;
  };
  return {
    coreColor: color(appearance?.coreColor, base.coreColor),
    accentColor: color(appearance?.accentColor, base.accentColor),
    glowColor: color(appearance?.glowColor, base.glowColor),
    glow: unit(appearance?.glow, base.glow),
    motionIntensity: unit(appearance?.motionIntensity, base.motionIntensity),
    definition: unit(appearance?.definition, base.definition),
  };
}

export function backingSize(cssSize: number, dpr: number, quality: AiOrbQuality): number {
  return Math.max(1, Math.min(1024, Math.round(cssSize * Math.min(dpr || 1, AI_ORB_QUALITY[quality].dpr))));
}

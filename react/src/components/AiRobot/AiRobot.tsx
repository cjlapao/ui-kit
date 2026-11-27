import { memo, useId, type CSSProperties } from "react";
import { Bip } from "./Bip";
import { Bit } from "./Bit";
import { Hex } from "./Hex";
import { Io } from "./Io";
import { Andy } from "./Andy";
import { Spark } from "./Spark";
import { getTrueColorTextClass, type ControlSize, type TrueColor } from "../../theme/Theme";

export type AiRobotSize = ControlSize;
export type AiRobotTone = TrueColor;
export type AiRobotVariant = "outline" | "solid";
export type AiRobotIdentity = "bop" | "bip" | "bit" | "hex" | "io" | "andy" | "spark";

const SIZES: Record<AiRobotSize, number> = { xs: 32, sm: 48, md: 64, lg: 96, xl: 128 };

export interface AiRobotProps {
  /** Shared size scale, or a custom size in CSS pixels. */
  size?: AiRobotSize | number;
  /** Color from the shared TrueColor palette. */
  tone?: AiRobotTone;
  /** Robot character. */
  identity?: AiRobotIdentity;
  /** Body style. */
  variant?: AiRobotVariant;
  /** Pause the wave, eyes, and mouth animation. */
  paused?: boolean;
  /** Accessible name. Omit for a decorative robot. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** A lightweight animated robot using the shared color palette. */
export const AiRobot = memo(function AiRobot({ size = "md", tone = "neutral", identity = "bop", variant = "outline", paused = false, label, className, style }: AiRobotProps) {
  const safeSize = typeof size === "number" ? (Number.isFinite(size) && size > 0 ? size : SIZES.md) : (SIZES[size] ?? SIZES.md);
  const maskId = useId();
  return (
    <svg viewBox={identity === "andy" ? "0 -77.5 1179 1179" : identity === "bit" ? "0 0 15 15" : (identity === "bip" || identity === "hex" || identity === "io" || identity === "spark") ? "0 0 24 24" : "0 0 64 64"} xmlns="http://www.w3.org/2000/svg" className={[getTrueColorTextClass(tone), className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}
      data-paused={paused ? "true" : undefined}
      style={{ display: "inline-block", width: safeSize, height: "auto", maxWidth: "100%", verticalAlign: "middle", ...style }}>
      <style>{`
        @keyframes cj-ai-robot-wave { 0%, 100% { transform: scaleY(.82); } 50% { transform: scaleY(1.08); } }
        @keyframes cj-ai-robot-mouth { 0%, 100% { transform: scaleY(.55); } 50% { transform: scaleY(1); } }
        @keyframes cj-ai-robot-bit-mouth { 0%, 100% { transform: scaleX(.75); } 50% { transform: scaleX(1); } }
        @keyframes cj-ai-robot-spark-arm { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes cj-ai-robot-spark-head { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes cj-ai-robot-io-mouth { 0%, 100% { transform: scaleY(.82); } 50% { transform: scaleY(1); } }
        @keyframes cj-ai-robot-antenna { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes cj-ai-robot-blink { 0%, 44%, 48%, 100% { transform: scaleY(1); } 46% { transform: scaleY(.08); } }
        .cj-ai-robot-wave { transform-box: fill-box; transform-origin: center bottom; animation: cj-ai-robot-wave 2.8s ease-in-out infinite; }
        .cj-ai-robot-eyes { transform-box: fill-box; transform-origin: center; animation: cj-ai-robot-blink 5.7s ease-in-out infinite; }
        .cj-ai-robot-bar { transform-box: fill-box; transform-origin: center; animation: cj-ai-robot-mouth 1.15s ease-in-out infinite alternate; }
        .cj-ai-robot-antenna { transform-box: fill-box; transform-origin: center bottom; animation: cj-ai-robot-antenna 3s ease-in-out infinite; }
        .cj-ai-robot-bit-mouth { transform-box: fill-box; transform-origin: center; animation: cj-ai-robot-bit-mouth 1.8s ease-in-out infinite; }
        .cj-ai-robot-io-mouth { transform-box: fill-box; transform-origin: center bottom; animation: cj-ai-robot-io-mouth 1.4s ease-in-out infinite; }
        .cj-ai-robot-spark-left, .cj-ai-robot-spark-right { transform-box: view-box; animation: cj-ai-robot-spark-arm 2.6s ease-in-out infinite; }
        .cj-ai-robot-spark-left { transform-origin: 6.8px 17.7px; }
        .cj-ai-robot-spark-right { transform-origin: 17.2px 17.7px; animation-direction: reverse; }
        .cj-ai-robot-spark-head { transform-box: view-box; transform-origin: 12px 10.5px; animation: cj-ai-robot-spark-head 4s ease-in-out infinite; }
        [data-paused="true"] .cj-ai-robot-spark-head, [data-paused="true"] .cj-ai-robot-spark-left, [data-paused="true"] .cj-ai-robot-spark-right, [data-paused="true"] .cj-ai-robot-io-mouth, [data-paused="true"] .cj-ai-robot-bit-mouth, [data-paused="true"] .cj-ai-robot-antenna, [data-paused="true"] .cj-ai-robot-wave, [data-paused="true"] .cj-ai-robot-eyes, [data-paused="true"] .cj-ai-robot-bar { animation: none; }
        @media (prefers-reduced-motion: reduce) { .cj-ai-robot-spark-head, .cj-ai-robot-spark-left, .cj-ai-robot-spark-right, .cj-ai-robot-io-mouth, .cj-ai-robot-bit-mouth, .cj-ai-robot-antenna, .cj-ai-robot-wave, .cj-ai-robot-eyes, .cj-ai-robot-bar { animation: none; } }
      `}</style>
      {identity === "spark" ? <Spark variant={variant} maskId={maskId} /> : identity === "andy" ? <Andy variant={variant} maskId={maskId} /> : identity === "io" ? <Io variant={variant} maskId={maskId} /> : identity === "hex" ? <Hex variant={variant} maskId={maskId} /> : identity === "bit" ? <Bit variant={variant} maskId={maskId} /> : identity === "bip" ? <Bip variant={variant} maskId={maskId} /> : <>
      {variant === "solid" && <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="white" />
          <g className="cj-ai-robot-eyes" fill="black">
            <circle cx="21.5" cy="31.5" r="6" /><circle cx="42.5" cy="31.5" r="6" />
          </g>
          <rect x="16" y="41.8" width="32" height="11.6" rx="5.8" fill="black" />
          <circle cx="32" cy="37" r="2.5" fill="black" />
        </mask>
      </defs>}
      <g fill="currentColor">
        <path className="cj-ai-robot-wave" d="M7.801 14.539c1.586-1.984 4.832-2.37 7.145-2.827c1.941-.384 4.049-.612 5.881-1.394c2.596-1 2.48-4.931 3.268-4.931c.588 0 2.697 3.019 4.549 3.019c1.58 0 2.58-3.697 3.453-3.697c.877 0 1.871 3.697 3.451 3.697c1.854 0 3.963-3.019 4.551-3.019c.785 0 .672 3.931 3.268 4.931c1.832.781 3.939 1.01 5.881 1.394c2.313.457 5.559.843 7.145 2.827c.582.727 1.729-.113 1.207-.887c-.656-.975-1.637-1.658-2.674-2.168c-3.377-1.658-11.639-1.31-12.334-5.653c-.914-5.694-5.855.062-6.771.062C34.76 5.893 34.246 2 32.096 2c-2.152 0-2.664 3.893-3.723 3.893c-.916 0-5.859-5.756-6.771-.062c-.695 4.344-8.959 3.995-12.334 5.653c-1.037.51-2.02 1.193-2.674 2.168c-.522.774.625 1.614 1.207.887" />
        <path d="M58 15.98a4 4 0 0 0-4 4c0 1.86 1.279 3.412 3 3.858V47.98h-.5v-2.393c0-2.303-1.537-4.107-3.5-4.107V36c0-15.464-5.535-24-21-24c-15.463 0-21 8.536-21 24v5.48c-1.93 0-3.5 1.843-3.5 4.107v2.393H7V23.839a3.99 3.99 0 0 0 3-3.858a4 4 0 0 0-8 0c0 1.86 1.279 3.412 3 3.858V49.98h2.5v2.391c0 2.305 1.537 4.109 3.5 4.109V57a5 5 0 0 0 5 5h32a5 5 0 0 0 5-5v-.52c1.963 0 3.5-1.805 3.5-4.109V49.98H59V23.839a3.99 3.99 0 0 0 3-3.858a3.998 3.998 0 0 0-4-4.001m-52 6.5c-1.379 0-2.5-1.121-2.5-2.5s1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5s-1.121 2.5-2.5 2.5m5 32.5c-1.104 0-2-1.168-2-2.609v-6.784c0-1.439.896-2.607 2-2.607v12M50.5 57c0 1.379-1.121 2.5-2.5 2.5H16a2.502 2.502 0 0 1-2.5-2.5V36s-.331-4.09 1.037-9.778C16.521 17.977 22.136 14.5 32 14.5s15.272 3.529 17.463 11.722C50.843 31.382 50.5 36 50.5 36v21m4.5-9.02v4.391c0 1.441-.895 2.609-2 2.609v-12c1.105 0 2 1.168 2 2.607v2.393m3-25.5c-1.379 0-2.5-1.121-2.5-2.5s1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5s-1.121 2.5-2.5 2.5" />
        {variant === "solid" ? <path mask={`url(#${maskId})`} d="M13.5 36c0-15 5.1-21.5 18.5-21.5S50.5 21 50.5 36v21a2.5 2.5 0 0 1-2.5 2.5H16a2.5 2.5 0 0 1-2.5-2.5Z" /> :
          <g className="cj-ai-robot-eyes"><path d="M21.5 37.5a6 6 0 0 0 6-6a6 6 0 1 0-6 6m0-8.285a2.285 2.285 0 1 1 0 4.572a2.285 2.285 0 0 1 0-4.572" /><path d="M42.5 25.5a6 6 0 1 0 0 12a6 6 0 0 0 0-12m0 8.287a2.285 2.285 0 1 1 0-4.57a2.285 2.285 0 0 1 0 4.57" /></g>}
        <path d="M44.232 41.088H19.77c-7.359 0-7.359 13 0 13h24.463c7.357 0 7.357-13-.001-13m-.72 11.5H20.488c-5.984 0-5.984-10 0-10h23.023c5.985 0 5.985 10 .001 10" />
        {[20.193, 24.916, 29.639, 34.361, 39.084, 43.807].map((x, index) => (
          <rect key={x} className="cj-ai-robot-bar" x={x - 1} y={43.514} width="2" height="8.148" rx="1"
            style={{ animationDelay: `${index * -0.17}s` }} />
        ))}
        {variant === "outline" && <path d="M32 39.48c.668 0 1.295-.26 1.768-.732s.732-1.102.732-1.77s-.261-1.295-.732-1.766c-.945-.945-2.59-.945-3.535 0c-.472.471-.732 1.098-.732 1.766s.26 1.297.732 1.77s1.099.732 1.767.732m0-4c.4 0 .777.156 1.061.439a1.485 1.485 0 0 1 .231 1.811l-2.043-2.042c.227-.131.482-.208.751-.208m-1.291.749l2.024 2.024c-.569.315-1.321.261-1.794-.212a1.495 1.495 0 0 1-.439-1.063c0-.269.076-.524.209-.749" />}
      </g>
      </>}
    </svg>
  );
});

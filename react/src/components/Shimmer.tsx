import classNames from "classnames";
import React from "react";
import { TRUE_COLORS, type TrueColor } from "../theme/Theme";

/**
 * A light sweep across waiting text — the "thinking…" effect chat UIs use
 * while a response is pending.
 *
 * The sweep is pure CSS (`.shimmer-text` in styles.css): a gradient clipped
 * to the glyphs whose background position animates. The gradient stops read
 * `currentColor`, which resolves to the span's own color, so inherit mode
 * and every tone run through one code path — `tone` only overrides the span
 * color, via the tone's own Tailwind variable (the StatusSpinner pattern),
 * and the highlight is always `color-mix`-derived from that same color.
 */
export const SHIMMER_SPEEDS = ["slow", "normal", "fast"] as const;
export type ShimmerSpeed = (typeof SHIMMER_SPEEDS)[number];

/** The kit's 21 tones, reused as-is. */
export const SHIMMER_TONES = TRUE_COLORS;
export type ShimmerTone = TrueColor;

/** Sweep period per speed, published as the `--shimmer-dur` custom property. */
const SHIMMER_DURATIONS: Record<ShimmerSpeed, string> = {
  slow: "3200ms",
  normal: "2000ms",
  fast: "1200ms",
};

export interface ShimmerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text to shimmer. */
  children: React.ReactNode;
  /** @default "normal" — slow 3.2s · normal 2s · fast 1.2s per sweep */
  speed?: ShimmerSpeed;
  /** @default undefined — inherits the surrounding text color */
  tone?: ShimmerTone;
  className?: string;
}

const Shimmer = React.forwardRef<HTMLSpanElement, ShimmerProps>(
  ({ children, speed = "normal", tone, className, style, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        {...rest}
        className={classNames("shimmer-text", className)}
        style={
          {
            // The tone reads its own Tailwind variable, so it can never
            // render as another colour; absent, `--shimmer-c` stays unset
            // and the span inherits the surrounding text color.
            ...(tone ? { "--shimmer-c": `var(--color-${tone}-400)` } : {}),
            "--shimmer-dur": SHIMMER_DURATIONS[speed],
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </span>
    );
  },
);

Shimmer.displayName = "Shimmer";

export default Shimmer;

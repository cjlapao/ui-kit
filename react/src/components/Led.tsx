import React, { forwardRef } from "react";
import classNames from "classnames";
import { getTrueColorTextClass, type ControlSize, type TrueColor } from "../theme/Theme";

export const LED_ANIMATIONS = ["none", "pulse", "breathe", "blink", "vibrate"] as const;
export type LedAnimation = (typeof LED_ANIMATIONS)[number];
export type LedVariant = "lit" | "flat";
export interface LedProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** @default "emerald" */
  tone?: TrueColor;
  /** Dot diameter: xs 6px, sm 8px, md 10px, lg 14px, xl 18px. */
  size?: ControlSize;
  /** Core treatment. Flat keeps glow and motion without a highlight or rim. @default "lit" */
  variant?: LedVariant;
  /** @default "none" */
  animation?: LedAnimation;
  /** Whether the LED is lit. Off LEDs retain their tone without glow or motion. */
  lit?: boolean;
  /** Glow strength, clamped to 0–3. @default 1 */
  glowIntensity?: number;
  /** Animation cycle in milliseconds, minimum 600. @default 1600 */
  duration?: number;
  /** Accessible name. Without a label or aria-label, the LED is decorative. */
  label?: string;
}
const diameters: Record<ControlSize, number> = { xs: 6, sm: 8, md: 10, lg: 14, xl: 18 };

/** A compact, theme-aware signal light. Does not reserve space for its halo. */
export const Led = forwardRef<HTMLSpanElement, LedProps>(function Led({
  tone = "emerald", size = "md", variant = "lit", animation = "none", lit = true,
  glowIntensity = 1, duration = 1600, label, className, style, "aria-label": ariaLabel, ...rest
}, ref) {
  const name = ariaLabel ?? label;
  const intensity = Number.isFinite(glowIntensity) ? Math.max(0, Math.min(3, glowIntensity)) : 1;
  const milliseconds = Number.isFinite(duration) ? Math.max(600, duration) : 1600;
  return <span {...rest} ref={ref} role={name ? "img" : undefined} aria-label={name} aria-hidden={name ? undefined : true}
    data-lit={lit} data-variant={variant} data-animation={lit ? animation : "none"}
    className={classNames("kit-led", getTrueColorTextClass(tone), className)}
    style={{ "--led-size": `${diameters[size]}px`, "--led-glow": lit ? intensity : 0, "--led-duration": `${milliseconds}ms`, ...style } as React.CSSProperties}>
    <span className="kit-led-halo" aria-hidden="true" />
    <span className="kit-led-core" aria-hidden="true" />
  </span>;
});

export default Led;

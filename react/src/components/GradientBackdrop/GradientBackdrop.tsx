/**
 * GradientBackdrop — a soft radial-over-linear gradient to put glass and
 * translucent components on, in light and dark.
 *
 * Pick a built-in template (`slate`, `mist`, `stone`, `dune`, `fog`,
 * `graphite`) or pass your own theme. A theme may define only `light` or
 * only `dark` colours; the other side is derived with the formula fitted on
 * the templates (see `GRADIENT_BACKDROP_DERIVATION`).
 *
 * By default both schemes are emitted as CSS variables and the kit's `dark:`
 * variant picks one, so the backdrop follows the theme with no JavaScript.
 *
 * ```tsx
 * <GradientBackdrop theme="mist" className="rounded-xl p-8">
 *   <Panel variant="glass">…</Panel>
 * </GradientBackdrop>
 *
 * <GradientBackdrop theme={{ light: { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" } }} />
 * ```
 */

import React, { useMemo } from "react";
import classNames from "classnames";
import {
  gradientBackdropCss,
  resolveGradientBackdropTheme,
  type GradientBackdropTemplateId,
  type GradientBackdropTheme,
} from "../../../../common/backdrop";

/** Which scheme to draw: follow the kit's dark mode, or pin one. */
export type GradientBackdropScheme = "auto" | "light" | "dark";
export const GRADIENT_BACKDROP_SCHEMES = ["auto", "light", "dark"] as const;

export interface GradientBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A built-in template id, or your own theme. @default "slate" */
  theme?: GradientBackdropTemplateId | GradientBackdropTheme;
  /** `auto` follows the kit's `dark` class; `light` / `dark` pin one. @default "auto" */
  scheme?: GradientBackdropScheme;
  children?: React.ReactNode;
}

export const GradientBackdrop = React.forwardRef<HTMLDivElement, GradientBackdropProps>(
  ({ theme = "slate", scheme = "auto", className, style, children, ...rest }, ref) => {
    // A theme object literal changes identity every render; key the memo on
    // its content so the gradients are only rebuilt when the colours change.
    const themeKey = typeof theme === "string" ? theme : JSON.stringify(theme);
    const resolved = useMemo(() => {
      const t = resolveGradientBackdropTheme(theme);
      return { light: gradientBackdropCss(t.light, t.shape), dark: gradientBackdropCss(t.dark, t.shape) };
    }, [themeKey]);

    const backdropStyle: React.CSSProperties =
      scheme === "auto"
        ? ({ "--gradient-backdrop-light": resolved.light, "--gradient-backdrop-dark": resolved.dark } as React.CSSProperties)
        : { background: resolved[scheme] };

    return (
      <div
        ref={ref}
        {...rest}
        data-gradient-backdrop
        data-theme={typeof theme === "string" ? theme : "custom"}
        data-scheme={scheme}
        className={classNames(
          "relative",
          scheme === "auto" &&
            "[background:var(--gradient-backdrop-light)] dark:[background:var(--gradient-backdrop-dark)]",
          className,
        )}
        style={{ ...backdropStyle, ...style }}
      >
        {children}
      </div>
    );
  },
);
GradientBackdrop.displayName = "GradientBackdrop";

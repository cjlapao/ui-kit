import { type ReactNode } from "react";
import classNames from "classnames";
import {
  GLASS_RIM,
  variantBaseStyles,
  type PanelCorner,
  type PanelPadding,
  type PanelVariant,
} from "./Panel";
import {
  DEFAULT_SURFACE_CORNER,
  getPanelToneStyles,
  getSurfaceCornerClass,
  getSurfacePaddingClass,
  type TrueColor,
} from "../theme/Theme";
import {
  getGlassVibrancyClass,
  getSurfaceGlassFillClass,
  type GlassOpacity,
  type GlassVibrancy,
} from "../theme/glass";
import { SurfaceProvider } from "../contexts/SurfaceContext";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The left group — PrimeVue's `start` slot.
   */
  start?: ReactNode;
  /**
   * The centered group — PrimeVue's `center` slot. It stays centered by
   * `justify-between`, so keep it narrow (a search field, a stepper).
   */
  center?: ReactNode;
  /**
   * The right group — PrimeVue's `end` slot.
   */
  end?: ReactNode;
  /**
   * Extra content appended after the three regions as its own group. The
   * regions stay in the DOM when empty (as in PrimeVue), so an `end`-only
   * toolbar still parks its actions on the right.
   */
  children?: ReactNode;
  /**
   * Surface treatment — Panel's shared set, from an invisible `simple` bar to
   * `liquid-glass`. A toolbar is a Panel turned sideways: same variants,
   * same tone rules, same theme helpers.
   * @default "outlined"
   */
  variant?: PanelVariant;
  /** Accent for the tinted and translucent variants. @default "neutral" */
  tone?: TrueColor;
  /**
   * Inset around the regions, on the shared container scale — the same
   * language as the Button inside. A bar wants it small; `none` lets a
   * toolbar bleed flush into the content it serves.
   * @default "xs"
   */
  padding?: PanelPadding;
  /** Corner rounding, the shared container scale. @default DEFAULT_SURFACE_CORNER */
  corner?: PanelCorner;
  /** Backdrop vibrancy for the `liquid-glass` variant. @default "medium" */
  vibrancy?: GlassVibrancy;
  /** Glass fill opacity for the `liquid-glass` variant. @default "frosted" */
  glassOpacity?: GlassOpacity;
  className?: string;
}

const GROUP_CLASS = "flex min-w-0 flex-wrap items-center gap-2";

/**
 * A bar that groups the actions for the content beside it — PrimeVue's
 * Toolbar: `start` / `center` / `end` regions, one row, `role="toolbar"` —
 * wearing the kit's shared Panel surface.
 *
 * The bar names itself PrimeVue's way: nothing. A `role="toolbar"` without a
 * name announces fine, but on a page with several toolbars the name is the
 * only thing that tells "Formatting" from "Filters" — pass `aria-label` or
 * `aria-labelledby` to say which.
 */
export const Toolbar = ({
  start,
  center,
  end,
  children,
  variant = "outlined",
  tone = "neutral",
  padding = "xs",
  corner = DEFAULT_SURFACE_CORNER,
  vibrancy = "medium",
  glassOpacity = "frosted",
  className = "",
  ...rest
}: ToolbarProps) => {
  const palette = getPanelToneStyles(tone);

  // Panel's per-variant chrome, minus its `borderColor` / `backgroundColor`
  // overrides — the parts of the switch every surface shares.
  const variantClasses = (() => {
    switch (variant) {
      case "outlined":
        return classNames(variantBaseStyles.outlined, palette.outlineBorder);
      case "subtle":
        return classNames(
          variantBaseStyles.subtle,
          palette.border,
          palette.subtleBg,
        );
      case "tonal":
        return classNames(variantBaseStyles.tonal, palette.tonalBg);
      case "default":
        return classNames(variantBaseStyles.default, GLASS_RIM);
      case "glass":
        return classNames(
          variantBaseStyles.glass,
          GLASS_RIM,
          palette.glassBg,
        );
      case "liquid-glass":
        return classNames(
          variantBaseStyles["liquid-glass"],
          getGlassVibrancyClass(vibrancy),
          getSurfaceGlassFillClass(tone, glassOpacity),
          palette.liquidBorder,
          palette.liquidShadow,
        );
      case "simple":
        return classNames(variantBaseStyles.simple, palette.tonalBg);
      // `elevated` is Panel's fallback branch too.
      case "elevated":
      default:
        return variantBaseStyles.elevated;
    }
  })();

  return (
    <div
      {...rest}
      role="toolbar"
      className={classNames(
        "flex flex-wrap items-center justify-between gap-2",
        variantClasses,
        getSurfaceCornerClass(corner),
        getSurfacePaddingClass(padding),
        className,
      )}
    >
      {/* Content cannot work out the surface for itself — an `Input` on a
          glass toolbar reads Panel's tokens through the same context. */}
      <SurfaceProvider variant={variant}>
        <div className={GROUP_CLASS}>{start}</div>
        <div className={GROUP_CLASS}>{center}</div>
        <div className={GROUP_CLASS}>{end}</div>
        {children != null && <div className={GROUP_CLASS}>{children}</div>}
      </SurfaceProvider>
    </div>
  );
};

Toolbar.displayName = "Toolbar";

export default Toolbar;

import React, {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";
import classNames from "classnames";
import { type IconSize } from "../types/Icon";
import { useIconRenderer } from "../contexts/IconContext";
import {
  getButtonColorClasses,
  getButtonBaseClasses,
  getButtonHoverClasses,
  getButtonActiveClasses,
  getButtonActiveHoverClasses,
  getControlSizeTokens,
  DEFAULT_TRIGGER_CORNER,
  CONTROL_SIZES,
  type ControlSize,
  type TrueColor,
  type ButtonVariant,
  type ButtonWeight,
} from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "./Tooltip";

export type ButtonColor = TrueColor;
export type { ButtonVariant };
export type { GlassVibrancy, GlassOpacity, SpecularMode };

/**
 * Buttons use the shared control scale. Aliased rather than redeclared so a
 * change to `ControlSize` reaches Button without a second list to update.
 */
export const BUTTON_SIZES = CONTROL_SIZES;
export type ButtonSize = ControlSize;
/** Re-exported from the theme, where the runtime lists live. */
export { BUTTON_VARIANTS, BUTTON_WEIGHTS } from "../theme/Theme";
export type { ButtonWeight };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: TrueColor;
  size?: ButtonSize;
  weight?: ButtonWeight;
  fullWidth?: boolean;
  leadingIcon?: string | React.ReactElement;
  trailingIcon?: string | React.ReactElement;
  loading?: boolean;
  iconOnly?: boolean;
  accent?: boolean;
  accentColor?: TrueColor;
  /**
   * Raw CSS colour to tint the leading/trailing icon. Omit it and the icon
   * inherits the button's text colour (icons paint with `currentColor`), so
   * the glyph and the label always match; set it to override just the glyph.
   */
  iconColor?: string;
  /** When true, renders in a persistent lighter "on" state with hover suppressed. accentColor overrides the active color. */
  active?: boolean;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. */
  specularMode?: SpecularMode;
  className?: string;
  children?: ReactNode;
  /** When set, a styled tooltip is shown on hover. */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
}

// `disabled:opacity-50` is applied conditionally rather than living here:
// `loading` also sets the disabled attribute (to block clicks), and dimming a
// loading control to 50% fades the spinner along with it — the one element
// that needs to stay visible.
// `DEFAULT_TRIGGER_CORNER` (not a local `rounded-md`) so a Button next to an
// Input is the same box — Input already uses `rounded-lg`.
const baseClasses = `inline-flex items-center justify-center ${DEFAULT_TRIGGER_CORNER} transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed select-none`;

const weightClasses: Record<ButtonWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      color = "blue",
      size = "md",
      weight = "normal",
      fullWidth = false,
      leadingIcon,
      trailingIcon,
      loading = false,
      iconOnly = false,
      accent = false,
      accentColor,
      iconColor,
      active = false,
      glass = false,
      vibrancy = "medium",
      glassOpacity = "frosted",
      specularMode = "none",
      className,
      children,
      disabled,
      onClick,
      tooltip,
      tooltipPosition,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const renderIcon = useIconRenderer();
    const sizeConfig = getControlSizeTokens(size);
    const baseColorClasses = getButtonColorClasses(variant, color);
    const isIconMode = iconOnly || variant === "icon";
    const accentTone = accentColor ?? color;
    const accentRingClass = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHoverClass =
      iconAccentHover[accentTone] ?? iconAccentHover.blue;
    // Accent means "the parent owns the fill": drop the variant's fill and
    // draw only the accent ring + hover. True for icon mode and for a text
    // Button alike (it used to be dead outside icon mode).
    const accentClasses = accent
      ? classNames(
          "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
          accentRingClass,
          accentHoverClass,
        )
      : null;

    const isEffectivelyDisabled = (disabled ?? false) || loading;
    // active: persistent lighter "on" state, no hover; accentColor overrides the active color
    // accentColor on enabled non-active: replaces only the hover classes
    const colorClasses = (() => {
      if (active) {
        const activeColor = accentColor ?? color;
        const activeBase = getButtonActiveClasses(variant, activeColor);
        return isEffectivelyDisabled
          ? activeBase
          : classNames(
              activeBase,
              getButtonActiveHoverClasses(variant, activeColor),
            );
      }
      if (!isIconMode && accentColor && !isEffectivelyDisabled)
        return classNames(
          getButtonBaseClasses(variant, color),
          getButtonHoverClasses(variant, accentColor),
        );
      return baseColorClasses;
    })();

    // Glass styling — variant="glass" auto-enables glass; glass prop overrides
    const isGlass = variant === "glass" || glass;
    // The variant's own colour classes are dropped for glass (they paint an
    // opaque fill), so the chrome — text colour, rim, focus ring — has to come
    // from here or the button ends up with none of it.
    const glassClasses = isGlass
      ? classNames(
          "backdrop-blur-sm",
          getGlassFillClass(color, glassOpacity),
          getGlassVibrancyClass(vibrancy),
          getGlassChromeClasses(color),
        )
      : null;

    const resolvedSpecularMode = isGlass ? specularMode : "none";
    const specularOverlay =
      resolvedSpecularMode !== "none"
        ? (() => {
            const specClasses = getSpecularClasses(resolvedSpecularMode);
            return specClasses ? (
              <div
                className={classNames(
                  "pointer-events-none absolute inset-0 rounded-[inherit]",
                  specClasses,
                )}
                aria-hidden="true"
              />
            ) : null;
          })()
        : null;

    const computedClassName = classNames(
      baseClasses,
      !loading && "disabled:opacity-50",
      sizeConfig.gap,
      isIconMode ? sizeConfig.iconOnly : sizeConfig.text,
      isGlass ? accentClasses : (accentClasses ?? colorClasses),
      weightClasses[weight],
      fullWidth && "w-full",
      isGlass && "relative",
      glassClasses,
      className,
    );

    const spinner = (
      <span
        className={classNames(
          "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none",
          sizeConfig.spinner,
        )}
        aria-hidden="true"
      />
    );

    const isDisabled = disabled ?? false;
    const ariaLabel = (props as { "aria-label"?: string })["aria-label"];
    const srOnlyContent =
      typeof children === "string"
        ? children
        : ariaLabel
          ? ariaLabel
          : undefined;

    // Icons paint with `currentColor`, so by default they inherit the
    // button's text colour and the glyph always matches the label. An
    // `iconColor` tints only the glyph by wrapping it in a span that carries
    // the colour (a raw value, so it needs an inline style, not a class).
    const renderIconSlot = (icon?: string | React.ReactElement) => {
      if (!icon) return null;
      const node = renderIcon(
        icon,
        size as IconSize,
        classNames("flex-shrink-0", sizeConfig.icon),
      );
      if (!iconColor) return node;
      return (
        <span
          className="inline-flex shrink-0 items-center"
          style={{ color: iconColor }}
        >
          {node}
        </span>
      );
    };

    const button = (
      <button
        ref={ref}
        // A `<button>` inside a `<form>` is `type="submit"` by default, which
        // made every unspec'd Button submit the form. Default to "button";
        // an explicit `type` prop still wins.
        type={type}
        className={computedClassName}
        disabled={isDisabled || loading}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-glass={isGlass}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {specularOverlay}
        {loading ? spinner : renderIconSlot(leadingIcon)}
        {isIconMode ? (
          // `||`, not `??`: an empty-string `children` is a string, and
          // `"" ?? "Button"` is `""` — an sr-only span with no name, i.e. a
          // button a screen reader announces as just "button".
          <span className="sr-only">{srOnlyContent || "Button"}</span>
        ) : (
          children
        )}
        {!loading && renderIconSlot(trailingIcon)}
      </button>
    );

    if (tooltip) {
      return (
        <TooltipWrapper text={tooltip} position={tooltipPosition}>
          {button}
        </TooltipWrapper>
      );
    }

    return button;
  },
);

Button.displayName = "Button";

export default Button;

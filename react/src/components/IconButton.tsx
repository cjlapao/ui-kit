import classNames from "classnames";
import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
import Spinner, { type SpinnerColor } from "./Spinner";
import { warnIfAriaHiddenFocusable } from "../../../common/a11y/warn";
import { useIconRenderer } from "../contexts/IconContext";
import { getButtonColorClasses, getControlSizeTokens } from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import type { IconSize } from "../types/Icon";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "./Tooltip";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";

type IconButtonRounded = "md" | "lg" | "xl" | "full";

const roundedMap: Record<IconButtonRounded, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// `disabled:opacity-50` is applied conditionally rather than living here:
// `loading` also sets the disabled attribute (to block clicks), and dimming a
// loading control to 50% fades the spinner along with it — the one element
// that needs to stay visible.
const baseClasses =
  "inline-flex items-center justify-center select-none transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> {
  icon: string | React.ReactElement;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: IconButtonRounded;
  customSizeClass?: string;
  iconClassName?: string;
  loading?: boolean;
  spinnerVariant?: "solid" | "segments";
  spinnerColor?: SpinnerColor;
  srLabel?: string;
  accent?: boolean;
  accentColor?: ButtonColor;
  /**
   * Raw CSS colour to tint the icon. Omit it and the icon inherits the
   * button's text colour (icons paint with `currentColor`), so the glyph
   * always matches; set it to override just the icon.
   */
  iconColor?: string;
  /** When set, a styled tooltip is shown on hover (replaces the native title attribute). */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. Defaults to "clear" for IconButton. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. Defaults to "none" for IconButton. */
  specularMode?: SpecularMode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = "icon",
      color = "blue",
      size = "md",
      rounded = "full",
      customSizeClass,
      iconClassName,
      loading = false,
      spinnerVariant = "segments",
      spinnerColor,
      srLabel,
      accent = false,
      accentColor,
      iconColor,
      glass = false,
      vibrancy = "medium",
      glassOpacity = "clear",
      specularMode = "none",
      className,
      disabled,
      tooltip,
      tooltipPosition,
      ...rest
    },
    ref,
  ) => {
    const renderIcon = useIconRenderer();
    const sizeConfig = getControlSizeTokens(size);
    const baseColorClasses = getButtonColorClasses(variant, color);
    const accentTone = accentColor ?? color;
    const accentRing = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHover = iconAccentHover[accentTone] ?? iconAccentHover.blue;
    const accentClasses = accent
      ? classNames(
          "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
          accentRing,
          accentHover,
        )
      : null;

    // When accent is off but accentColor is explicitly provided,
    // apply hover text color for non-solid variants (ghost, soft, outline, icon)
    const nonAccentHover =
      !accent && accentColor && variant !== "solid"
        ? (iconAccentHover[accentColor] ?? null)
        : null;

    const dimensionClass = customSizeClass ?? sizeConfig.box;
    const spinnerColorToken: SpinnerColor =
      spinnerColor ?? (color as SpinnerColor);

    // Glass styling — variant="glass" auto-enables glass; glass prop overrides
    const isGlass = variant === "glass" || glass;
    // The variant's own colour classes are dropped for glass (they paint an
    // opaque fill), so the chrome — text colour, rim, focus ring — has to come
    // from here or the control ends up with none of it.
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
      dimensionClass,
      roundedMap[rounded] ?? roundedMap.full,
      isGlass ? (accentClasses ?? "") : (accentClasses ?? baseColorClasses),
      nonAccentHover,
      isGlass && "relative",
      glassClasses,
      className,
    );

    // The icon paints with `currentColor`, so by default it inherits the
    // button's text colour and the glyph always matches. An `iconColor`
    // tints only the glyph by wrapping it in a span that carries the colour.
    const iconNode = renderIcon(
      icon,
      size as IconSize,
      classNames("flex-shrink-0", sizeConfig.icon, iconClassName),
    );
    const iconContent = iconColor ? (
      <span
        className="inline-flex shrink-0 items-center"
        style={{ color: iconColor }}
      >
        {iconNode}
      </span>
    ) : (
      iconNode
    );

    // Pull aria-label and title out of rest so we can set them explicitly.
    // title falls back to aria-label → srLabel so the native browser tooltip
    // always shows the accessible label rather than the icon's own SVG title.
    // When a styled tooltip is provided, omit the native title to avoid doubling.
    const { "aria-label": ariaLabel, title, type = "button", ...restProps } = rest;
    const computedAriaLabel = ariaLabel ?? srLabel;
    const computedTitle = tooltip ? undefined : (title ?? computedAriaLabel);
    // a11y (P1-2): the sr-only fallback always names the button, but a
    // focusable node that is also aria-hidden is still a defect.
    warnIfAriaHiddenFocusable("IconButton", {
      ariaHidden: (rest as { "aria-hidden"?: boolean })["aria-hidden"],
      interactive: !(disabled || loading),
    });

    const button = (
      <button
        ref={ref}
        // `type="button"` by default — see Button: the native default is
        // "submit", which made an unspec'd icon button submit its form.
        type={type}
        className={computedClassName}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-glass={isGlass}
        disabled={disabled || loading}
        aria-label={computedAriaLabel}
        title={computedTitle}
        {...restProps}
      >
        {specularOverlay}
        {loading ? (
          <Spinner
            size={sizeConfig.spinnerSize}
            color={spinnerColorToken}
            variant={spinnerVariant}
            aria-hidden="true"
          />
        ) : (
          iconContent
        )}
        <span className="sr-only">
          {srLabel || rest["aria-label"] || "Icon button"}
        </span>
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

IconButton.displayName = "IconButton";

export default IconButton;

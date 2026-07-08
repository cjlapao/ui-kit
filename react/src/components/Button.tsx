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
  type TrueColor,
  type ButtonVariant,
} from "../theme/Theme";
import {
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

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonWeight = "normal" | "medium" | "semibold" | "bold";

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

const baseClasses =
  "inline-flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 select-none";

const sizeStyles: Record<
  ButtonSize,
  { base: string; iconOnly: string; gap: string; icon: string; spinner: string }
> = {
  xs: {
    base: "px-2 py-1 text-xs",
    iconOnly: "p-1.5 text-xs",
    gap: "gap-1.5",
    icon: "h-4 w-4",
    spinner: "h-4 w-4",
  },
  sm: {
    base: "px-3 py-2 text-xs",
    iconOnly: "p-2 text-xs",
    gap: "gap-1.5",
    icon: "h-5 w-5",
    spinner: "h-4 w-4",
  },
  md: {
    base: "px-3.5 py-2.5 text-sm",
    iconOnly: "p-2.5 text-sm",
    gap: "gap-2",
    icon: "h-6 w-6",
    spinner: "h-6 w-6",
  },
  lg: {
    base: "px-4 py-2.5 text-base",
    iconOnly: "p-3 text-base",
    gap: "gap-2.5",
    icon: "h-7 w-7",
    spinner: "h-7 w-7",
  },
  xl: {
    base: "px-5 py-3 text-base",
    iconOnly: "p-3.5 text-base",
    gap: "gap-3",
    icon: "h-8 w-8",
    spinner: "h-8 w-8",
  },
};

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
      ...props
    },
    ref,
  ) => {
    const renderIcon = useIconRenderer();
    const sizeConfig = sizeStyles[size] ?? sizeStyles.md;
    const baseColorClasses = getButtonColorClasses(variant, color);
    const isIconMode = iconOnly || variant === "icon";
    const accentTone = accentColor ?? color;
    const accentRingClass = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHoverClass =
      iconAccentHover[accentTone] ?? iconAccentHover.blue;
    const accentClasses =
      isIconMode && accent
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
    const glassClasses = isGlass
      ? classNames(
          "backdrop-blur-sm",
          getGlassFillClass(color, glassOpacity),
          getGlassVibrancyClass(vibrancy),
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
      sizeConfig.gap,
      isIconMode ? sizeConfig.iconOnly : sizeConfig.base,
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
          "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent",
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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    };

    const button = (
      <button
        ref={ref}
        className={computedClassName}
        disabled={isDisabled || loading}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-glass={glass}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...props}
      >
        {specularOverlay}
        {loading
          ? spinner
          : renderIcon(
              leadingIcon,
              size as IconSize,
              classNames(" flex-shrink-0", sizeConfig.icon),
            )}
        {isIconMode ? (
          <span className="sr-only">{srOnlyContent ?? "Button"}</span>
        ) : (
          children
        )}
        {!loading &&
          renderIcon(
            trailingIcon,
            size as IconSize,
            classNames("flex-shrink-0", sizeConfig.icon),
          )}
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

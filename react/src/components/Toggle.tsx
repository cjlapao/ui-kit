import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useRef,
} from "react";
import classNames from "classnames";
import { type TrueColor, getToggleColorClasses } from "../theme/Theme";
import {
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";
import { useIconRenderer } from "../contexts/IconContext";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "./Tooltip";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleAlign = "left" | "right";
export type ToggleDescriptionPlacement = "inline" | "stacked";
export type TogglePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const paddingStyles: Record<TogglePadding, string> = {
  none: "",
  xs: "p-0.5",
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
  xl: "p-3",
};

export interface ToggleProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "children"
  > {
  label?: ReactNode;
  description?: ReactNode;
  descriptionPlacement?: ToggleDescriptionPlacement;
  size?: ToggleSize;
  padding?: TogglePadding;
  color?: TrueColor;
  alignLabel?: ToggleAlign;
  iconOn?: string | React.ReactElement;
  iconOff?: string | React.ReactElement;
  fullWidth?: boolean;
  className?: string;
  /** When set, a styled tooltip is shown on hover. */
  tooltip?: string;
  /** Position of the tooltip relative to the toggle. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. */
  specularMode?: SpecularMode;
}

const sizeTokens: Record<
  ToggleSize,
  {
    track: string;
    thumb: string;
    thumbOffset: string;
    thumbTranslate: string;
    gap: string;
    font: string;
    description: string;
  }
> = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-4",
    gap: "gap-2",
    font: "text-sm",
    description: "text-xs",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-5",
    gap: "gap-3",
    font: "text-sm",
    description: "text-xs",
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-6",
    gap: "gap-3",
    font: "text-base",
    description: "text-sm",
  },
};

const iconWrapSize: Record<ToggleSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      id,
      label,
      description,
      descriptionPlacement = "stacked",
      size = "md",
      padding = "sm",
      color = "blue",
      alignLabel = "right",
      iconOn,
      iconOff,
      fullWidth = false,
      className,
      disabled,
      onChange,
      tooltip,
      tooltipPosition,
      glass = false,
      vibrancy = "medium",
      glassOpacity = "frosted",
      specularMode = "none",
      ...inputProps
    },
    forwardedRef,
  ) => {
    const renderIcon = useIconRenderer();
    const generatedId = useId();
    const toggleId = id ?? generatedId;
    const descriptionId = description ? `${toggleId}-description` : undefined;
    const inputRef = useRef<HTMLInputElement>(null);

    const mergeRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const sizeStyles = sizeTokens[size] ?? sizeTokens.md;
    const colorStyles = getToggleColorClasses(color);

    const glassSpecularClass = glass
      ? getSpecularClasses(specularMode)
      : null;

    const toggle = (
      <div
        data-glass={glass}
        className={classNames(
          "group flex select-none items-center",
          alignLabel === "left" ? "flex-row-reverse" : "flex-row",
          sizeStyles.gap,
          paddingStyles[padding],
          fullWidth && "w-full",
          disabled && "cursor-not-allowed opacity-60",
          inputProps.readOnly && !disabled && "cursor-default",
          !disabled && !inputProps.readOnly && "cursor-pointer",
          className,
        )}
        onClick={(e) => {
          if (inputProps.readOnly) {
            e.preventDefault();
          }
          if (!disabled && !inputProps.readOnly && onChange) {
            const newChecked = !inputRef.current?.checked;
            onChange({ target: { checked: newChecked } } as any);
          }
        }}
      >
        <span className="relative inline-flex shrink-0">
          <input
            id={toggleId}
            ref={mergeRefs}
            type="checkbox"
            role="switch"
            className={classNames(
              "peer sr-only",
              disabled
                ? "cursor-not-allowed"
                : inputProps.readOnly
                  ? "cursor-default"
                  : "cursor-pointer",
            )}
            aria-describedby={descriptionId}
            disabled={disabled}
            onChange={onChange}
            onClick={(e) => {
              if (inputProps.readOnly) {
                e.preventDefault();
              }
            }}
            {...inputProps}
          />

          <span
            aria-hidden="true"
            className={classNames(
              "block relative rounded-full overflow-hidden border border-transparent bg-neutral-200 dark:bg-neutral-600 transition-colors duration-200 ease-in-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2",
              sizeStyles.track,
              glass
                ? classNames(
                    "backdrop-blur-sm",
                    getGlassFillClass(color, glassOpacity),
                    getGlassVibrancyClass(vibrancy),
                    "dark:bg-neutral-600",
                  )
                : colorStyles,
              disabled && "opacity-70 peer-checked:opacity-70 dark:opacity-50",
            )}
          />

          {glassSpecularClass && (
            <div
              aria-hidden="true"
              className={classNames(
                "pointer-events-none absolute inset-0 rounded-full",
                glassSpecularClass,
              )}
            />
          )}

          {iconOff && (
            <span
              className={classNames(
                "pointer-events-none absolute inset-y-0 left-1 flex items-center text-neutral-400 transition-opacity duration-200 ease-in-out",
                iconWrapSize[size],
                "peer-checked:opacity-0",
              )}
            >
              {renderIcon(iconOff, "sm")}
            </span>
          )}

          {iconOn && (
            <span
              className={classNames(
                "pointer-events-none text-black absolute inset-y-0 right-1 flex items-center text-black opacity-0 transition-opacity duration-200 ease-in-out",
                iconWrapSize[size],
                "peer-checked:opacity-100",
              )}
            >
              {renderIcon(iconOn, "sm")}
            </span>
          )}

          <span
            className={classNames(
              "pointer-events-none absolute transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out dark:bg-neutral-200",
              "translate-x-0",
              sizeStyles.thumb,
              sizeStyles.thumbOffset,
              sizeStyles.thumbTranslate,
            )}
          />
        </span>
        {label && (
          <label
            htmlFor={toggleId}
            className={classNames(
              "min-w-0",
              descriptionPlacement === "inline"
                ? "flex flex-wrap items-center gap-2 text-neutral-900 dark:text-neutral-100"
                : "flex flex-col",
            )}
          >
            <span
              className={classNames(
                sizeStyles.font,
                "font-medium leading-tight text-neutral-900 dark:text-neutral-100 mt-0.5",
                disabled && "text-neutral-400 dark:text-neutral-300",
              )}
            >
              {label}
            </span>
            {description && (
              <span
                id={descriptionId}
                className={classNames(
                  sizeStyles.description,
                  "text-neutral-400 dark:text-neutral-300",
                  descriptionPlacement === "stacked" && "mt-1",
                  disabled && "text-neutral-300 dark:text-neutral-400",
                )}
              >
                {description}
              </span>
            )}
          </label>
        )}
        {!label && description && (
          <span
            id={descriptionId}
            className={classNames(
              sizeStyles.description,
              "text-neutral-400 dark:text-neutral-300",
              descriptionPlacement === "stacked" && "mt-1",
              disabled && "text-neutral-300 dark:text-neutral-400",
            )}
          >
            {description}
          </span>
        )}
      </div>
    );

    if (tooltip) {
      return (
        <TooltipWrapper text={tooltip} position={tooltipPosition}>
          {toggle}
        </TooltipWrapper>
      );
    }

    return toggle;
  },
);

Toggle.displayName = "Toggle";

export default Toggle;

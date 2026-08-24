import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useRef,
} from "react";
import classNames from "classnames";
import {
  TOGGLE_VARIANTS,
  type ControlSize,
  type ToggleVariant,
  type TrueColor,
  getToggleVariantTokens,
} from "../theme/Theme";
import {
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";
import { useIconRenderer } from "../contexts/IconContext";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "./Tooltip";

/**
 * The shared control scale, so a `Toggle` lines up with the `Input`, `Button`
 * and `SearchBar` beside it. Was a local `"sm" | "md" | "lg"`, which left
 * `xs` and `xl` unreachable even though every sibling control offered them.
 */
export type ToggleSize = ControlSize;
export type ToggleAlign = "left" | "right";
export type ToggleDescriptionPlacement = "inline" | "stacked";
export type TogglePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/** Re-exported from the theme, where the runtime lists live. */
export { TOGGLE_VARIANTS };
export type { ToggleVariant };

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
  /** Visual treatment — the same five values `Button` and `Slider` offer. @default "solid" */
  variant?: ToggleVariant;
  color?: TrueColor;
  alignLabel?: ToggleAlign;
  /** Rendered in the half of the track the thumb is not in while checked. */
  iconOn?: string | React.ReactElement;
  /** Rendered in the half of the track the thumb is not in while unchecked. */
  iconOff?: string | React.ReactElement;
  fullWidth?: boolean;
  className?: string;
  /** When set, a styled tooltip is shown on hover. */
  tooltip?: string;
  /** Position of the tooltip relative to the toggle. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /**
   * Shorthand for `variant="glass"`. Prefer `variant`.
   * @deprecated
   */
  glass?: boolean;
  /** Backdrop vibrancy level for the glass variant. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for the glass variant. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for the glass variant. */
  specularMode?: SpecularMode;
}

// `thumbTranslate` is the checked travel: track width − thumb width − the
// 2px inset on both sides, so the thumb lands flush against the far wall —
// xs 28−12−4=12, sm 36−16−4=16, md 44−20−4=20, lg 56−24−4=28, xl 64−28−4=32.
// A short travel leaves a gap on the right that reads as a stuck thumb.
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
  xs: {
    track: "h-4 w-7",
    thumb: "h-3 w-3",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-3",
    gap: "gap-2",
    font: "text-xs",
    description: "text-xs",
  },
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
    thumbTranslate: "peer-checked:translate-x-7",
    gap: "gap-3",
    font: "text-base",
    description: "text-sm",
  },
  xl: {
    track: "h-8 w-16",
    thumb: "h-7 w-7",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-8",
    gap: "gap-3",
    font: "text-base",
    description: "text-sm",
  },
};

// The icon spans the *empty half* of the track — track width minus the thumb
// minus the 2px inset on both sides — and centers the glyph inside it, so the
// gap to the thumb always equals the gap to the wall, at every size.
const iconHalfSize: Record<ToggleSize, string> = {
  xs: "w-3", // 28 - 12 - 4 = 12
  sm: "w-4", // 36 - 16 - 4 = 16
  md: "w-5", // 44 - 20 - 4 = 20
  lg: "w-7", // 56 - 24 - 4 = 28
  xl: "w-8", // 64 - 28 - 4 = 32
};

// The glyph scales with the track (~60% of its height). The old fixed "sm"
// (20px) glyph was wider than the empty half below lg, so it ran into the
// thumb — and at xs it overflowed the half entirely.
const iconGlyphSize: Record<ToggleSize, string> = {
  xs: "h-2.5 w-2.5",
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
  xl: "h-5 w-5",
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
      variant = "solid",
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
      glass,
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

    // `glass` is the legacy spelling of `variant="glass"`.
    const effectiveVariant: ToggleVariant = glass ? "glass" : variant;
    const isGlass = effectiveVariant === "glass";
    const tokens = getToggleVariantTokens(
      color,
      effectiveVariant,
      glassOpacity,
    );

    // The vibrancy class is a plain (unvarianted) utility, so it only paints
    // while the checked state's `peer-checked:backdrop-blur-sm` has a
    // backdrop-filter chain to compose into — at rest the neutral fill is
    // opaque and the saturate variable is inert.
    const glassVibrancyClass = isGlass ? getGlassVibrancyClass(vibrancy) : null;
    const glassSpecularClass = isGlass ? getSpecularClasses(specularMode) : null;

    const toggle = (
      <div
        data-glass={isGlass}
        data-variant={effectiveVariant}
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
        // Clicking the row (the sr-only input's visible track, or the padding
        // around it) toggles. It must ignore clicks the browser already
        // handles — the input itself and its <label htmlFor> — because those
        // fire the input's own onChange, and acting on them again on the way
        // up would double-fire.
        onClick={(e) => {
          if (inputProps.readOnly) {
            e.preventDefault();
            return;
          }
          if (disabled) return;

          const input = inputRef.current;
          const target = e.target as HTMLElement | null;
          if (!input || !target) return;
          if (target === input || target.closest("label")) return;

          // A real programmatic click: the browser flips the checkbox — so an
          // uncontrolled toggle's state (and the thumb) actually moves — and
          // runs the genuine change path. Firing `onChange` with a hand-built
          // event instead left the input's checked state behind, so the app
          // said "on" while the track still read "off".
          input.click();
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
              "block relative rounded-full overflow-hidden border border-transparent bg-neutral-200 dark:bg-neutral-600 transition-colors duration-200 ease-in-out peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
              sizeStyles.track,
              tokens.track,
              tokens.ring,
              isGlass && "peer-checked:backdrop-blur-sm",
              glassVibrancyClass,
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
                "pointer-events-none absolute inset-y-0 right-0.5 flex items-center justify-center text-neutral-500 transition-opacity duration-200 ease-in-out dark:text-neutral-400",
                iconHalfSize[size],
                "peer-checked:opacity-0",
              )}
            >
              {renderIcon(iconOff, "xs", iconGlyphSize[size])}
            </span>
          )}

          {iconOn && (
            <span
              className={classNames(
                "pointer-events-none absolute inset-y-0 left-0.5 flex items-center justify-center text-white opacity-0 transition-opacity duration-200 ease-in-out dark:text-neutral-950",
                iconHalfSize[size],
                "peer-checked:opacity-100",
              )}
            >
              {renderIcon(iconOn, "xs", iconGlyphSize[size])}
            </span>
          )}

          <span
            className={classNames(
              "pointer-events-none absolute transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out dark:bg-neutral-200",
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

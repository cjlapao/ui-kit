import React, {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  SURFACE_VARIANTS,
  getMultiToggleVariantTokens,
  getSurfaceTextTokens,
  getSurfaceVariantClasses,
  getSurfaceTriggerTokens,
  type ControlSize,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { IconSize } from "../types/Icon";

/**
 * The shared control scale. Was a component-local `sm | md | lg`, so a toggle
 * could not line up with the `xs` or `xl` Button beside it.
 */
export type MultiToggleSize = ControlSize;
export type MultiToggleShape =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";
/**
 * The track is a surface, so it takes the **Panel family** — the same eight
 * variants, reading identically beside a `Panel` at the same tone.
 *
 * This replaces a component-local `theme | solid | soft`, which described the
 * *indicator* rather than the track and had no relationship to anything else
 * in the kit.
 */
export const MULTI_TOGGLE_VARIANTS = SURFACE_VARIANTS;
export type MultiToggleVariant = SurfaceVariant;

/**
 * How the active segment is drawn. This is what the old `variant` union was
 * actually describing, now separated from the track's surface so the two can
 * be chosen independently.
 */
export const MULTI_TOGGLE_INDICATORS = ["solid", "soft", "tonal"] as const;
export type MultiToggleIndicator = (typeof MULTI_TOGGLE_INDICATORS)[number];

/** @deprecated The old indicator-shaped variant union. */
export type LegacyMultiToggleVariant = "theme" | "solid" | "soft";

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type MultiToggleOptionWidth = number | LiteralUnion<"auto">;
export type MultiToggleActiveWidthStrategy = "auto" | "max";

export interface MultiToggleOption {
  value: string;
  label?: ReactNode;
  icon?: string | React.ReactElement;
  disabled?: boolean;
  width?: MultiToggleOptionWidth;
}

export interface MultiToggleProps
  // The root element is the radiogroup `<div>`, not a button. These props used
  // to be `ButtonHTMLAttributes` spread onto *every option*, so a caller's
  // `onClick` replaced each option's own handler and an `id` was duplicated
  // once per option. They now land on the group, which is where an `id`,
  // `aria-label` or `data-*` belongs.
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Disables the whole group. */
  disabled?: boolean;
  options: MultiToggleOption[];
  value: string;
  rounded?: MultiToggleShape;

  onChange: (value: string) => void;
  size?: MultiToggleSize;
  /** Accent for the indicator, the active label and the focus ring. @default "blue" */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other control calls it. */
  color?: TrueColor;
  fullWidth?: boolean;
  className?: string;
  showOnlyActiveLabel?: boolean;
  truncateOverflow?: boolean;
  adaptiveWidth?: boolean;
  optionMaxWidth?: number | string;
  activeWidthStrategy?: MultiToggleActiveWidthStrategy;
  /** The track's surface, from the Panel family. @default "subtle" */
  variant?: MultiToggleVariant;
  /** How the active segment is drawn. @default "solid" */
  indicator?: MultiToggleIndicator;
  /** Overrides the active option's text tone. */
  accentTone?: TrueColor;
  /** @deprecated Use `accentTone`. */
  accentColor?: TrueColor;
}

const sizeTokens: Record<
  MultiToggleSize,
  {
    track: string;
    indicatorInset: string;
    cell: string;
    gap: string;
    label: string;
    icon: string;
    paddingY: string;
  }
> = {
  xs: {
    track: "h-7 text-[11px]",
    indicatorInset: "inset-y-[0px]",
    cell: "px-1.5 py-0.5",
    gap: "gap-1",
    label: "text-[11px]",
    icon: "h-3.5 w-3.5",
    paddingY: "py-0.5",
  },
  sm: {
    track: "h-8 text-xs",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2 py-1",
    gap: "gap-1",
    label: "text-xs",
    icon: "h-4 w-4",
    paddingY: "py-0.5",
  },
  md: {
    track: "h-9 text-sm",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2.5 py-1.5",
    gap: "gap-1.5",
    label: "text-sm",
    icon: "h-5 w-5",
    paddingY: "py-0.5",
  },
  lg: {
    track: "h-11 text-base",
    indicatorInset: "inset-y-[0px]",
    cell: "px-3.5 py-2",
    gap: "gap-2",
    label: "text-base",
    icon: "h-6 w-6",
    paddingY: "py-0.5",
  },
  xl: {
    track: "h-12 text-lg",
    indicatorInset: "inset-y-[0px]",
    cell: "px-4 py-2.5",
    gap: "gap-2.5",
    label: "text-lg",
    icon: "h-7 w-7",
    paddingY: "py-0.5",
  },
};

const CONTAINER_HORIZONTAL_PADDING = 2;
const INDICATOR_MARGIN = 1;

const computeInset = (segmentWidth: number) => {
  if (segmentWidth <= 0) {
    return 0;
  }
  const proportional = segmentWidth / 16;
  return Math.min(INDICATOR_MARGIN, proportional);
};

const toCssDimension = (value?: number | string | null): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
};

const MultiToggle: React.FC<MultiToggleProps> = ({
  options,
  value,
  onChange,
  size = "md",
  tone,
  color,
  fullWidth = false,
  className,
  showOnlyActiveLabel = false,
  truncateOverflow,
  adaptiveWidth = false,
  optionMaxWidth,
  disabled,
  rounded = "lg",
  style: sharedButtonStyle,
  activeWidthStrategy = "auto",
  variant = "subtle",
  indicator = "solid",
  accentTone,
  accentColor,
  ...buttonProps
}) => {
  const renderIcon = useIconRenderer();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const measurementRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasCustomWidths =
    adaptiveWidth || options.some((option) => option.width !== undefined);
  const [indicatorInlineStyle, setIndicatorInlineStyle] =
    useState<React.CSSProperties>();
  const [maxOptionWidth, setMaxOptionWidth] = useState<number>();
  const parsedOptionMaxWidth = toCssDimension(optionMaxWidth);
  const shouldLockToMaxWidth = hasCustomWidths && activeWidthStrategy === "max";
  const controlRounded =
    rounded === "none"
      ? ""
      : rounded === "xs"
        ? "rounded-xs"
        : rounded === "sm"
          ? "rounded-sm"
          : rounded === "md"
            ? "rounded-md"
            : rounded === "lg"
              ? "rounded-lg"
              : rounded === "xl"
                ? "rounded-xl"
                : "rounded-full";

  // Inner indicator is inset by p-0.5 (2px), so use one step smaller radius
  // to preserve consistent visual gap between track edge and indicator corners.
  const indicatorRounded =
    rounded === "none" || rounded === "xs"
      ? ""
      : rounded === "sm"
        ? "rounded-xs"
        : rounded === "md"
          ? "rounded-sm"
          : rounded === "lg"
            ? "rounded-md"
            : rounded === "xl"
              ? "rounded-lg"
              : "rounded-full";

  const optionCount = options.length ?? 0;
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const sizeStyles = sizeTokens[size] ?? sizeTokens.md;
  // `color` is the old name for `tone`.
  const resolvedTone = tone ?? color ?? "blue";
  const resolvedAccent = accentTone ?? accentColor ?? resolvedTone;
  const variantTokens = getMultiToggleVariantTokens(resolvedTone);
  const trigger = getSurfaceTriggerTokens(resolvedTone);
  // The track is a surface, so its copy colour comes from the surface — a
  // hardcoded `text-neutral-600` is unreadable on `glass` over a photo.
  const surfaceText = getSurfaceTextTokens(variant);
  const trackClasses = getSurfaceVariantClasses(variant, resolvedTone);
  const activeTextClass = getMultiToggleVariantTokens(resolvedAccent).activeText;

  /**
   * The active pill. All three carry a tone-following edge: a white pill on a
   * light track with only a soft shadow is nearly invisible — the selection
   * read as "the blue label" rather than as a moved pill.
   *
   * `solid` is the crispest (a raised card with a full-strength hairline),
   * `soft` tints the fill, `tonal` is the most washed.
   */
  const indicatorClasses = {
    solid: `bg-white shadow-md border border-${resolvedTone}-300 dark:bg-neutral-800 dark:border-${resolvedTone}-500/50`,
    soft: `${variantTokens.softIndicator} border border-${resolvedTone}-300 dark:border-${resolvedTone}-500/25`,
    tonal: `bg-${resolvedTone}-500/15 dark:bg-${resolvedTone}-400/20 border border-${resolvedTone}-400/40 dark:border-${resolvedTone}-300/20`,
  }[indicator];
  const usesSegmentLayout = !hasCustomWidths && !shouldLockToMaxWidth;
  optionRefs.current.length = optionCount;
  measurementRefs.current.length = optionCount;

  const indicatorStyle = useMemo(() => {
    const segmentExpression = `(100% - ${CONTAINER_HORIZONTAL_PADDING * 2}px) / ${optionCount}`;
    const margin = INDICATOR_MARGIN;

    if (usesSegmentLayout) {
      return {
        width: `calc(${segmentExpression} - ${margin * 2}px)`,
        transform: `translateX(calc(${CONTAINER_HORIZONTAL_PADDING}px + ${activeIndex} * (${segmentExpression}) + ${margin}px))`,
      };
    }

    const widthPercent = 100 / optionCount;
    return {
      width: `calc(${widthPercent}% - ${margin * 2}px)`,
      transform: `translateX(calc(${activeIndex} * (100% / ${optionCount}) + ${margin}px))`,
    };
  }, [activeIndex, optionCount, usesSegmentLayout]);

  const updateIndicatorPosition = useCallback(() => {
    const container = containerRef.current;
    const activeButton = optionRefs.current[activeIndex];

    if (!container || !activeButton) {
      return;
    }

    const containerStyles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
    const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
    const containerInnerWidth = Math.max(
      0,
      container.clientWidth - paddingLeft - paddingRight,
    );

    if (usesSegmentLayout) {
      const segmentWidth = containerInnerWidth / optionCount;
      const inset = computeInset(segmentWidth);
      const indicatorWidth = Math.max(0, segmentWidth - inset * 2);
      const offset = paddingLeft + activeIndex * segmentWidth + inset;
      setIndicatorInlineStyle({
        width: `${indicatorWidth}px`,
        transform: `translateX(${offset}px)`,
      });
      return;
    }

    const baseWidth =
      shouldLockToMaxWidth && maxOptionWidth
        ? maxOptionWidth
        : activeButton.offsetWidth;
    const inset = computeInset(baseWidth);
    const indicatorWidth = Math.max(
      0,
      Math.min(baseWidth, containerInnerWidth) - inset * 2,
    );
    // offsetLeft is relative to the container's border-box edge (same as `absolute left-0`),
    // so do NOT subtract paddingLeft — that would shift the pill left and create unequal gutters.
    let offset = activeButton.offsetLeft + inset;
    const maxOffset = Math.max(
      inset,
      container.clientWidth - indicatorWidth - inset,
    );
    offset = Math.min(Math.max(offset, inset), maxOffset);

    setIndicatorInlineStyle({
      width: `${indicatorWidth}px`,
      transform: `translateX(${offset}px)`,
    });
  }, [
    activeIndex,
    shouldLockToMaxWidth,
    maxOptionWidth,
    optionCount,
    usesSegmentLayout,
  ]);

  const optionsSignature = useMemo(
    () =>
      options
        .map((option) => {
          const labelSignature =
            typeof option.label === "string"
              ? option.label
              : option.label !== undefined
                ? "node"
                : "";
          return `${option.value}:${option.width ?? ""}:${labelSignature}`;
        })
        .join("|"),
    [options],
  );

  useLayoutEffect(() => {
    if (!shouldLockToMaxWidth) {
      setMaxOptionWidth(undefined);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerStyles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
    const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
    const containerInnerWidth = Math.max(
      0,
      container.clientWidth - paddingLeft - paddingRight,
    );

    const widths = measurementRefs.current.map(
      (node) => node?.offsetWidth ?? 0,
    );
    const largestWidth = widths.reduce(
      (currentMax, width) => (width > currentMax ? width : currentMax),
      0,
    );
    const constrainedWidth = Math.min(largestWidth, containerInnerWidth);

    setMaxOptionWidth(constrainedWidth || undefined);
  }, [shouldLockToMaxWidth, optionsSignature, size, optionMaxWidth]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    updateIndicatorPosition();

    const handleWindowResize = () => {
      updateIndicatorPosition();
    };

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateIndicatorPosition();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      optionRefs.current.forEach((button) => {
        if (button) {
          resizeObserver?.observe(button);
        }
      });
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      resizeObserver?.disconnect();
    };
  }, [
    optionsSignature,
    optionMaxWidth,
    updateIndicatorPosition,
    shouldLockToMaxWidth,
    maxOptionWidth,
  ]);

  /**
   * Arrow-key navigation. The component already used a roving tabindex (only
   * the active option is tabbable) but handled no keys, so a keyboard user
   * could reach the group and then had no way to change the selection — the
   * one interaction a radiogroup exists for.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const step =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? -1
            : 0;
      if (step === 0 && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();

      const selectable = options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.disabled && !disabled);
      if (selectable.length === 0) return;

      if (event.key === "Home" || event.key === "End") {
        const target =
          event.key === "Home"
            ? selectable[0]
            : selectable[selectable.length - 1];
        onChange(target.option.value);
        optionRefs.current[target.index]?.focus();
        return;
      }

      const current = selectable.findIndex(({ index }) => index === activeIndex);
      // Wraps at both ends, which is what the radiogroup pattern specifies.
      const next =
        selectable[
          (current + step + selectable.length) % selectable.length
        ];
      onChange(next.option.value);
      optionRefs.current[next.index]?.focus();
    },
    [options, disabled, activeIndex, onChange],
  );

  const shouldTruncate = truncateOverflow ?? true;
  const computedIndicatorStyle = indicatorInlineStyle ?? indicatorStyle;

  return (
    <div
      ref={containerRef}
      className={classNames(
        "relative inline-flex select-none items-center p-0.5",
        trackClasses,
        controlRounded,
        sizeStyles.track,
        fullWidth && "w-full",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      role="radiogroup"
      aria-disabled={disabled}
      {...buttonProps}
    >
      <span
        className={classNames(
          "pointer-events-none absolute left-0 flex items-center justify-center transition-transform duration-200 ease-out",
          sizeStyles.indicatorInset,
          sizeStyles.paddingY,
        )}
        style={computedIndicatorStyle ?? indicatorStyle}
      >
        <span
          className={classNames("h-full w-full", indicatorRounded, indicatorClasses)}
        />
      </span>

      {shouldLockToMaxWidth && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            height: 0,
            overflow: "hidden",
          }}
        >
          {options.map((option, index) => {
            const measurementStyle: React.CSSProperties = {};
            if (option.width && option.width !== "auto") {
              const targetWidth = toCssDimension(option.width);
              if (targetWidth) {
                measurementStyle.width = targetWidth;
              }
            }
            if (parsedOptionMaxWidth) {
              measurementStyle.maxWidth = parsedOptionMaxWidth;
            }

            return (
              <div
                key={`measure-${option.value}`}
                ref={(node) => {
                  measurementRefs.current[index] = node;
                }}
                className={classNames(
                  "inline-flex min-w-0 items-center justify-center rounded-full",
                  sizeStyles.cell,
                  sizeStyles.gap,
                )}
                style={measurementStyle}
              >
                <span
                  className={classNames(
                    "flex min-w-0 items-center justify-center",
                    sizeStyles.gap,
                  )}
                >
                  {option.icon &&
                    renderIcon(option.icon, size as IconSize, sizeStyles.icon)}
                  {option.label && (
                    <span className={classNames(sizeStyles.label, "min-w-0")}>
                      {option.label}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {options.map((option, index) => {
        const isActive = option.value == value;
        const optionDisabled = disabled || option.disabled;
        const applyCustomWidth =
          hasCustomWidths && (!showOnlyActiveLabel || isActive);
        const customWidthValue =
          option.width !== undefined
            ? option.width
            : adaptiveWidth && applyCustomWidth
              ? "auto"
              : undefined;
        let buttonStyle: React.CSSProperties | undefined;

        if (applyCustomWidth) {
          buttonStyle = {
            flex: "0 1 auto",
            minWidth: 0,
          };

          if (customWidthValue && customWidthValue !== "auto") {
            const targetWidth = toCssDimension(customWidthValue);
            if (targetWidth) {
              buttonStyle.flex = "0 0 auto";
              buttonStyle.width = targetWidth;
            }
          }

          if (parsedOptionMaxWidth) {
            buttonStyle.maxWidth = parsedOptionMaxWidth;
          }
        }

        if (shouldLockToMaxWidth && isActive && maxOptionWidth) {
          if (!buttonStyle) {
            buttonStyle = {
              flex: "0 0 auto",
              minWidth: 0,
            };
          } else {
            buttonStyle.flex = "0 0 auto";
          }
          buttonStyle.width = `${maxOptionWidth}px`;
          if (parsedOptionMaxWidth) {
            buttonStyle.maxWidth = parsedOptionMaxWidth;
          }
        }

        const mergedStyle =
          sharedButtonStyle || buttonStyle
            ? {
                ...(sharedButtonStyle ?? {}),
                ...(buttonStyle ?? {}),
              }
            : undefined;

        return (
          <button
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            key={option.value}
            type="button"
            className={classNames(
              "relative z-[1] flex min-w-0 items-center justify-center transition-colors duration-150",
              controlRounded,
              sizeStyles.cell,
              sizeStyles.gap,
              hasCustomWidths ? "flex-none" : "flex-1",
              trigger.focusRing,
              optionDisabled
                ? classNames(surfaceText.muted, "cursor-not-allowed opacity-60")
                : classNames(
                    "cursor-pointer",
                    isActive ? activeTextClass : surfaceText.body,
                    variantTokens.hover,
                  ),
            )}
            onClick={() => {
              if (optionDisabled || option.value === value) {
                return;
              }
              onChange(option.value);
            }}
            disabled={optionDisabled}
            // `role="radio"` takes `aria-checked`. It also carried
            // `aria-pressed`, which belongs to a toggle button — a screen
            // reader announced the state twice, in two different vocabularies.
            role="radio"
            aria-checked={isActive}
            tabIndex={optionDisabled ? -1 : isActive ? 0 : -1}
            onKeyDown={handleKeyDown}
            style={mergedStyle}
          >
            <span
              className={classNames(
                "flex min-w-0 items-center justify-center",
                sizeStyles.gap,
              )}
            >
              {option.icon &&
                renderIcon(option.icon, size as IconSize, sizeStyles.icon)}
              {option.label && (!showOnlyActiveLabel || isActive) && (
                <span
                  className={classNames(
                    sizeStyles.label,
                    "min-w-0 px-1 text-center leading-tight block",
                    shouldTruncate ? "truncate" : "whitespace-nowrap",
                  )}
                  title={
                    shouldTruncate && typeof option.label === "string"
                      ? option.label
                      : undefined
                  }
                >
                  {option.label}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

MultiToggle.displayName = "MultiToggle";

export default MultiToggle;

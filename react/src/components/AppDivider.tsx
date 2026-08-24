import React from "react";
import classNames from "classnames";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { ControlSize, TrueColor } from "../theme/Theme";

export type AppDividerOrientation = "vertical" | "horizontal";
export type AppDividerLabelPosition = "start" | "center" | "end";

export const APP_DIVIDER_VARIANTS = [
  "solid",
  "dashed",
  "dotted",
  "gradient",
] as const;
export type AppDividerVariant = (typeof APP_DIVIDER_VARIANTS)[number];

/**
 * Line thickness in CSS pixels.
 *
 * Applied inline rather than through `border-{n}` classes: Tailwind's border
 * ladder jumps 1 → 2 → 4 → 8, which is far too coarse for a rule. The previous
 * version used `w-[1.2px]`, a fractional width that rounds unpredictably —
 * 1px on one display, 2px on another, and occasionally invisible.
 */
const THICKNESS: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

/** Margin along the divider's cross axis. */
const SPACING: Record<"none" | ControlSize, { vertical: string; horizontal: string }> = {
  none: { vertical: "", horizontal: "" },
  xs: { vertical: "mx-1", horizontal: "my-1" },
  sm: { vertical: "mx-2", horizontal: "my-2" },
  md: { vertical: "mx-3", horizontal: "my-3" },
  lg: { vertical: "mx-4", horizontal: "my-4" },
  xl: { vertical: "mx-6", horizontal: "my-6" },
};

export interface AppDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  /**
   * Which way the rule runs. Stays `vertical` by default — this component was
   * written for header sections and every existing call site relies on it.
   * @default "vertical"
   */
  orientation?: AppDividerOrientation;
  /** @default "solid" */
  variant?: AppDividerVariant;
  /**
   * Accent colour. Omit it and the rule takes the surrounding surface's own
   * divider colour, which adapts on glass.
   */
  tone?: TrueColor;
  /** Line thickness on the shared control scale. @default "xs" */
  size?: ControlSize;
  /** Space either side of the rule. @default "sm" */
  spacing?: "none" | ControlSize;
  /**
   * Length along the rule's own axis — height when vertical, width when
   * horizontal. Defaults to `1.5rem` vertical, full width horizontal.
   */
  length?: number | string;
  /** Text or node set into the rule. */
  label?: React.ReactNode;
  /** @default "center" */
  labelPosition?: AppDividerLabelPosition;
  /**
   * Hidden from assistive technology. Defaults to true for an unlabelled rule,
   * which is decoration; a labelled one is announced as a separator.
   */
  decorative?: boolean;

  /** @deprecated Use `length`. */
  height?: number | string;
  /** @deprecated Use `size`, or pass a number of pixels. */
  width?: number;
  /** @deprecated Use `spacing`. */
  margin?: number | string;
}

const toCss = (value: number | string): string =>
  typeof value === "number" ? `${value}px` : value;

export const AppDivider: React.FC<AppDividerProps> = ({
  orientation = "vertical",
  variant = "solid",
  tone,
  size = "xs",
  spacing = "sm",
  length,
  label,
  labelPosition = "center",
  decorative,
  height,
  width,
  margin,
  className,
  style,
  ...rest
}) => {
  const surface = useSurfaceText();
  const isVertical = orientation === "vertical";

  // `height`, `width` and `margin` were declared in the props interface and
  // never destructured — three documented props that did nothing at all.
  // They are honoured now, as aliases of the replacements.
  const resolvedLength = length ?? height ?? (isVertical ? "1.5rem" : "100%");
  const thickness = width ?? THICKNESS[size] ?? THICKNESS.xs;
  const spacingClass =
    margin === undefined
      ? (SPACING[spacing] ?? SPACING.sm)[isVertical ? "vertical" : "horizontal"]
      : undefined;
  const spacingStyle =
    margin === undefined
      ? undefined
      : isVertical
        ? { marginInline: toCss(margin) }
        : { marginBlock: toCss(margin) };

  const isDecorative = decorative ?? !label;

  const line = (() => {
    if (variant === "gradient") {
      return (
        <span
          aria-hidden="true"
          // The line has to fill its wrapper along the rule's own axis. With
          // only `self-stretch` a horizontal rule was a zero-width span and
          // painted nothing at all.
          className={classNames(
            "shrink-0",
            isVertical ? "self-stretch" : "w-full",
          )}
          style={{
            // Built from Tailwind's own colour custom properties rather than a
            // `via-{tone}-400` class, so every tone works without a safelist
            // entry — the same approach the gradient glow uses.
            backgroundImage: `linear-gradient(${
              isVertical ? "to bottom" : "to right"
            }, transparent, var(--color-${tone ?? "neutral"}-400), transparent)`,
            ...(isVertical
              ? { width: `${thickness}px` }
              : { height: `${thickness}px` }),
          }}
        />
      );
    }

    return (
      <span
        aria-hidden="true"
        className={classNames(
          "shrink-0",
          isVertical ? "self-stretch" : "w-full",
          // Border colour classes, so an unlabelled rule can simply take the
          // surface's own `divider` token and adapt on glass.
          // A deliberately toned rule should be visible: `-300 / -500/25` was
          // the *hairline outline* pairing and all but vanished on a dark card.
          tone
            ? `border-${tone}-400 dark:border-${tone}-500`
            : surface.divider,
        )}
        style={{
          borderStyle: variant,
          ...(isVertical
            ? { borderLeftWidth: `${thickness}px`, borderTopWidth: 0 }
            : { borderTopWidth: `${thickness}px`, borderLeftWidth: 0 }),
        }}
      />
    );
  })();

  const sizeStyle: React.CSSProperties = isVertical
    ? { height: toCss(resolvedLength) }
    : { width: toCss(resolvedLength) };

  const labelNode = label ? (
    <span
      className={classNames(
        "shrink-0 text-xs font-medium",
        surface.muted,
        isVertical ? "py-1" : "px-2",
      )}
    >
      {label}
    </span>
  ) : null;

  /** A start- or end-positioned label keeps a short stub on the far side. */
  const [leadGrow, tailGrow] =
    labelPosition === "start"
      ? ["shrink-0 basis-4", "flex-1"]
      : labelPosition === "end"
        ? ["flex-1", "shrink-0 basis-4"]
        : ["flex-1", "flex-1"];

  return (
    <div
      role={isDecorative ? undefined : "separator"}
      aria-orientation={isDecorative ? undefined : orientation}
      aria-hidden={isDecorative || undefined}
      className={classNames(
        "flex items-center",
        isVertical ? "flex-col" : "flex-row",
        spacingClass,
        className,
      )}
      style={{ ...sizeStyle, ...spacingStyle, ...style }}
      {...rest}
    >
      {labelNode ? (
        <>
          <span className={classNames("flex", leadGrow)}>{line}</span>
          {labelNode}
          <span className={classNames("flex", tailGrow)}>{line}</span>
        </>
      ) : (
        <span className="flex flex-1">{line}</span>
      )}
    </div>
  );
};

AppDivider.displayName = "AppDivider";

export default AppDivider;

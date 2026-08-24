import React from "react";
import classNames from "classnames";

import type { ControlSize, TrueColor } from "../theme/Theme";
import { getBadgeColorClasses, getPillColorClasses } from "../theme/Theme";

export const BADGE_VARIANTS = ["solid", "soft", "outline"] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = ControlSize;

type BadgeSizeTokens = {
  /** Minimum box for a count badge — it grows with wider content. */
  box: string;
  text: string;
  padding: string;
  /** Diameter of the dot form. */
  dot: string;
};

const SIZES: Record<BadgeSize, BadgeSizeTokens> = {
  xs: {
    box: "min-h-3.5 min-w-3.5",
    text: "text-[9px]",
    padding: "px-1",
    dot: "h-1.5 w-1.5",
  },
  // `sm` is the shape the component had before it took a size prop, so
  // existing call sites keep their exact footprint.
  sm: {
    box: "min-h-4.5 min-w-4.5",
    text: "text-[10px]",
    padding: "px-1.5",
    dot: "h-2 w-2",
  },
  md: {
    box: "min-h-5 min-w-5",
    text: "text-[11px]",
    padding: "px-1.5",
    dot: "h-2.5 w-2.5",
  },
  lg: {
    box: "min-h-6 min-w-6",
    text: "text-xs",
    padding: "px-2",
    dot: "h-3 w-3",
  },
  xl: {
    box: "min-h-7 min-w-7",
    text: "text-sm",
    padding: "px-2",
    dot: "h-3.5 w-3.5",
  },
};

/**
 * `solid` keeps the badge's own token — it is the only one of the three with a
 * dark-mode step tuned for a small filled pill. `soft` and `outline` come from
 * the shared Pill tokens rather than a second hand-written pair.
 */
const getVariantClasses = (tone: TrueColor, variant: BadgeVariant): string => {
  if (variant === "solid") return getBadgeColorClasses(tone);
  const pill = getPillColorClasses(tone, variant);
  return classNames(pill.base, pill.border);
};

export interface BadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> {
  /** Content to display inside the badge. */
  count?: number | string;
  /** Show only a dot indicator, with no count. */
  dot?: boolean;
  /** Max count to display before showing "+". @default 99 */
  maxCount?: number;
  /**
   * Render a `0` instead of nothing. A zero count is hidden by default, which
   * is usually right for a notification badge and wrong for a tally.
   */
  showZero?: boolean;
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "solid" */
  variant?: BadgeVariant;
  /** @default "sm" */
  size?: BadgeSize;
  /**
   * A ring in the page background colour, so the badge stays legible where it
   * overlaps an icon or avatar. Turn it off when the badge sits on its own.
   * @default true
   */
  ring?: boolean;
  /** Draws attention with a pinging halo. Respects `prefers-reduced-motion`. */
  pulse?: boolean;
  /**
   * What assistive technology announces. Defaults to the displayed value, so a
   * count is read out instead of being silently dropped.
   */
  label?: string;
  /**
   * Hide from assistive technology entirely. Defaults to true for a dot, which
   * carries no value of its own, and false for a count.
   */
  decorative?: boolean;
  /** Fully custom content, in place of `count`. */
  children?: React.ReactNode;
}

/**
 * Badge component for displaying notification counts or indicators.
 */
export const Badge: React.FC<BadgeProps> = ({
  count,
  dot = false,
  maxCount = 99,
  showZero = false,
  tone = "neutral",
  variant = "solid",
  size = "sm",
  ring = true,
  pulse = false,
  label,
  decorative,
  className,
  style,
  children,
  ...rest
}) => {
  const hasContent = children !== undefined && children !== null;

  if (!dot && !hasContent && count === 0 && !showZero) {
    return null;
  }

  const sizeToken = SIZES[size] ?? SIZES.sm;
  const colorClass = getVariantClasses(tone, variant);

  // A ring only reads against whatever is behind the badge, so it is painted
  // in the page background colour rather than a tone.
  const ringClass = ring
    ? "border border-white/80 dark:border-neutral-900/60"
    : "border border-transparent";

  const numeric = typeof count === "string" ? Number(count) : count;
  const overflowed =
    typeof numeric === "number" &&
    Number.isFinite(numeric) &&
    numeric > maxCount;
  const displayValue = hasContent
    ? children
    : count === undefined
      ? ""
      : overflowed
        ? `${maxCount}+`
        : count;

  const isDecorative = decorative ?? dot;
  // With a `label` the badge is announced as that instead of its digits, so
  // the visual content is hidden to avoid reading both. Without one the digits
  // *are* the accessible content — no duplicate copy in the DOM.
  const labelled = !isDecorative && Boolean(label);

  const pulseRing = pulse ? (
    <span
      aria-hidden="true"
      className={classNames(
        "absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none",
        colorClass,
      )}
    />
  ) : null;

  if (dot) {
    return (
      <span
        className={classNames(
          // The dot *is* the badge. It used to be an 18px transparent box with
          // an 8px dot inside it, so `ring` drew a visible circle around
          // nothing and the footprint never matched the dot you could see.
          "relative inline-block shrink-0 rounded-full",
          sizeToken.dot,
          colorClass,
          ringClass,
          className,
        )}
        style={style}
        aria-hidden={isDecorative || undefined}
        role={labelled ? "img" : undefined}
        aria-label={labelled ? label : undefined}
        {...rest}
      >
        {pulseRing}
      </span>
    );
  }

  return (
    <span
      className={classNames(
        "relative inline-grid place-items-center rounded-full text-center font-semibold leading-none tabular-nums",
        sizeToken.box,
        sizeToken.text,
        sizeToken.padding,
        colorClass,
        ringClass,
        className,
      )}
      style={style}
      // Not `aria-hidden` any more: a count badge carries the only copy of
      // "how many", and hiding it meant a screen-reader user never heard it.
      aria-hidden={isDecorative || undefined}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? label : undefined}
      {...rest}
    >
      {pulseRing}
      {/* `.badge-count` trims the line box to cap-height/baseline so the digits
          sit on the circle's centre rather than ~0.3px below it. */}
      <span
        className="badge-count relative"
        aria-hidden={labelled || undefined}
      >
        {displayValue}
      </span>
    </span>
  );
};

Badge.displayName = "Badge";

export default Badge;

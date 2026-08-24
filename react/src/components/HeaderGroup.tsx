import React, { type ReactNode } from "react";
import classNames from "classnames";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { ControlSize, TrueColor } from "../theme/Theme";

/** Space between adjacent groups, in CSS pixels. */
const GAP_PX: Record<ControlSize, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/** Space between the items inside one group. */
const ITEM_GAP: Record<ControlSize, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

/**
 * The separator is a `::before` on the *second* of two adjacent groups, so a
 * lone group never draws a leading rule and no wrapper element is needed
 * between them. Both the gap and the separator's offset read the same custom
 * property, so changing `gap` cannot leave the rule off-centre — they were
 * previously a hardcoded `ml-2` and `left-[-4px]` that had to be kept in sync
 * by hand.
 */
const SEPARATOR = [
  "[&+&]:ml-[var(--header-group-gap)]",
  "[&+&::before]:content-['']",
  "[&+&::before]:absolute",
  "[&+&::before]:left-[calc(var(--header-group-gap)/-2)]",
  "[&+&::before]:top-1/2",
  "[&+&::before]:-translate-y-1/2",
  "[&+&::before]:h-1/2",
  "[&+&::before]:w-px",
  "[&+&::before]:bg-[var(--header-group-divider)]",
].join(" ");

export interface HeaderGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  children: ReactNode;
  /** Space between this group and the one before it. @default "sm" */
  gap?: ControlSize;
  /** Space between the items inside this group. @default "xs" */
  itemGap?: ControlSize;
  /** Draw a separator when this group follows another. @default true */
  divider?: boolean;
  /**
   * Colour of that separator. Omit it and the rule takes the surrounding
   * surface's own divider colour, which adapts on glass.
   */
  tone?: TrueColor;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
}

export const HeaderGroup: React.FC<HeaderGroupProps> = ({
  children,
  gap = "sm",
  itemGap = "xs",
  divider = true,
  tone,
  label,
  className,
  style,
  ...rest
}) => {
  const surface = useSurfaceText();

  const gapPx = GAP_PX[gap] ?? GAP_PX.sm;
  const itemGapClass = ITEM_GAP[itemGap] ?? ITEM_GAP.xs;

  return (
    <div
      // `role="group"` because that is what this is — a related cluster of
      // header controls. It had no semantics at all.
      role="group"
      aria-label={label}
      className={classNames(
        "relative flex h-full items-center",
        // Was `text-black dark:text-white`, which ignores the surface it sits
        // on — a header group over glass needs the higher-contrast copy.
        surface.heading,
        divider && SEPARATOR,
        className,
      )}
      style={
        {
          "--header-group-gap": `${gapPx}px`,
          // Built from Tailwind's own colour custom properties, so every tone
          // works without needing a safelist entry *inside* an arbitrary
          // variant. Untoned, the rule is a fraction of the surrounding text
          // colour, which is already surface-aware — the old flat
          // `bg-neutral-300` had no dark partner and all but vanished on a
          // dark header.
          "--header-group-divider": tone
            ? `var(--color-${tone}-400)`
            : "color-mix(in srgb, currentColor 25%, transparent)",
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <div className={classNames("flex items-center px-1", itemGapClass)}>
        {children}
      </div>
    </div>
  );
};

HeaderGroup.displayName = "HeaderGroup";

export default HeaderGroup;

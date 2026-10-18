import React, { type ReactNode, useLayoutEffect, useState } from "react";
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
 * Separator thickness in CSS pixels, on the shared control scale — the same
 * ladder `AppDivider` uses for its rule.
 */
const SEPARATOR_THICKNESS: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

/**
 * The separator is a `::before` on the *second* of two adjacent groups, so a
 * lone group never draws a leading rule and no wrapper element is needed
 * between them.
 *
 * Two deliberate raster details, learned the hard way:
 * - The rule carries **no transform**. A `-translate-y-1/2` used to centre it
 *   vertically, but any transform takes the element out of the browser's
 *   paint-time pixel snapping — on a header that sits at a fractional layout
 *   origin (a centred toolbar is enough), the 1px rule then anti-aliased
 * *across* two device pixels, so some separators rendered visibly thicker
 *   than others. `top-1/4` + `h-1/2` centre it exactly as well, transform-
 *   free, so its behaviour is uniform across engines.
 * - Centering is computed from integer pixels (rounded `left`, explicit
 *   `width`) rather than `calc(gap/-2)` + `w-px`, so no half-pixel enters
 *   from our own arithmetic.
 * - The remaining fraction is not ours: headers sit at fractional layout
 *   origins (a centred toolbar is enough), and browsers anti-alias
 *   absolutely-positioned boxes at fractional offsets — a 1px rule spanning
 *   columns 89%/11% reads noticeably thicker than one spanning 69%/31%.
 *   Nothing in CSS (transforms included — squashed layers skip snapping) can
 *   align a line with the device grid from inside that equation, so the rule
 *   is snapped to whole device pixels in JS from the element's measured
 *   origin. The correction is below half a device pixel, centring-accurate.
 */
const SEPARATOR = [
  "[&+&]:ml-[var(--header-group-gap)]",
  "[&+&::before]:content-['']",
  "[&+&::before]:absolute",
  "[&+&::before]:left-[var(--header-group-sep-x)]",
  "[&+&::before]:top-1/4",
  "[&+&::before]:h-1/2",
  "[&+&::before]:w-[var(--header-group-sep-w)]",
  "[&+&::before]:bg-[var(--header-group-divider)]",
].join(" ");

export interface HeaderGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> {
  children: ReactNode;
  /** Space between this group and the one before it. @default "sm" */
  gap?: ControlSize;
  /** Space between the items inside this group. @default "xs" */
  itemGap?: ControlSize;
  /** Draw a separator when this group follows another. @default true */
  divider?: boolean;
  /**
   * Separator thickness — the shared control scale (1/2/3/4/6 px, xs–xl) or a
   * number of pixels.
   * @default "xs"
   */
  separatorSize?: ControlSize | number;
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
  separatorSize = "xs",
  tone,
  label,
  className,
  style,
  ...rest
}) => {
  const surface = useSurfaceText();
  const ref = React.useRef<HTMLDivElement>(null);
  // Sub-pixel correction that lands the separator on the device-pixel grid.
  const [snapPx, setSnapPx] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined")
      return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const dpr = window.devicePixelRatio || 1;
      const left = el.getBoundingClientRect().left;
      setSnapPx(Math.round(left * dpr) / dpr - left);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const parent = el.parentElement;
    if (parent) ro.observe(parent);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const gapPx = GAP_PX[gap] ?? GAP_PX.sm;
  const itemGapClass = ITEM_GAP[itemGap] ?? ITEM_GAP.xs;
  const separatorPx =
    typeof separatorSize === "number"
      ? separatorSize
      : (SEPARATOR_THICKNESS[separatorSize] ?? SEPARATOR_THICKNESS.xs);

  return (
    <div
      ref={ref}
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
          // Integer-pixel geometry for the rule (see SEPARATOR): centred in
          // the gutter, half the thickness, rounded to whole pixels.
          "--header-group-sep-x": `${
            -Math.round((gapPx + separatorPx) / 2) + Number(snapPx.toFixed(4))
          }px`,
          "--header-group-sep-w": `${separatorPx}px`,
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

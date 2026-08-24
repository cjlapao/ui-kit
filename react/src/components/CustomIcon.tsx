import React, { useMemo } from "react";
import { type IconName, iconRegistry } from "../icons/registry";
import { mergeClassTokens, hasExplicitSize } from "../utils/iconUtils";
import type { IconSize } from "../types/Icon";
import type { TrueColor } from "../theme/Theme";

export interface CustomIconProps
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    "children" | "color" | "onClick"
  > {
  /** Name of the icon to display. */
  icon: IconName;
  /**
   * Accessible name. Omit it and the icon is treated as decoration and hidden
   * from assistive technology — which is right for an icon sitting beside a
   * label, and wrong for one standing on its own.
   */
  alt?: string;
  /** Explicit size in pixels or any CSS length, overriding `size`. */
  customSize?: number | string;
  /** Size on the shared control scale. @default "md" */
  size?: IconSize;
  /** Theme colour. Ignored when `colored` is set. */
  tone?: TrueColor;
  /**
   * Raw CSS colour, for a value outside the palette. Wins over `tone`.
   * Ignored when `colored` is set.
   */
  color?: string;
  /** Raw CSS colour on hover. Ignored when `colored` is set. */
  hoverColor?: string;
  /** Keep the icon's own colours instead of tinting it. */
  colored?: boolean;
  /** Spins the icon. Respects `prefers-reduced-motion`. */
  spin?: boolean;
  /**
   * Makes the icon activatable. It renders as a real `<button>` so it is
   * reachable by keyboard — the previous `onClick` sat on a plain `<span>`,
   * which no keyboard user could reach.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;

  /** @deprecated No longer used with component-based icons. */
  forceSvg?: boolean;
}

const SIZE_CLASS_MAP: Record<IconSize, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
};

/** Warn once per missing name, not once per render. */
const warned = new Set<string>();

export const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  alt,
  customSize,
  size = "md",
  tone,
  color,
  hoverColor,
  colored = false,
  spin = false,
  onClick,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  const IconComponent = iconRegistry[icon];

  const dimension = useMemo(() => {
    if (!customSize) return undefined;
    return typeof customSize === "number" ? `${customSize}px` : customSize;
  }, [customSize]);

  const baseStyle = useMemo(() => {
    const next: React.CSSProperties = { ...style };
    if (dimension) {
      next.width = dimension;
      next.height = dimension;
    }
    if (!colored) {
      // The icons paint with `fill="currentColor"` / `stroke="currentColor"`,
      // so the CSS `color` property is what tints them. This used to set an
      // `--icon-color` custom property that nothing anywhere consumed, making
      // `color` and `hoverColor` two more props that did nothing.
      if (color) next.color = color;
      if (hoverColor) {
        (next as Record<string, string>)["--icon-hover-color"] = hoverColor;
      }
    }
    return next;
  }, [style, dimension, color, hoverColor, colored]);

  const sizeClass =
    !dimension && !hasExplicitSize(className) ? SIZE_CLASS_MAP[size] : undefined;

  const toneClass =
    !colored && !color && tone
      ? `text-${tone}-500 dark:text-${tone}-400`
      : undefined;

  const shared = mergeClassTokens(
    "inline-flex shrink-0 items-center justify-center",
    sizeClass,
    toneClass,
    // An inline style cannot express `:hover`, so the hover colour travels as
    // a custom property and `.custom-icon` consumes it.
    hoverColor && !colored ? "custom-icon transition-colors" : undefined,
    spin ? "animate-spin motion-reduce:animate-none" : undefined,
    disabled ? "pointer-events-none opacity-50" : undefined,
    className,
  );

  const decorative = !alt;
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": alt } as const);

  const content = IconComponent ? (
    <IconComponent className="h-full w-full" aria-hidden="true" focusable="false" />
  ) : (
    // The fallback used to drop every computed class, so a missing icon had no
    // size at all unless `customSize` was given — it collapsed the layout
    // around it.
    <span className="grid h-full w-full place-items-center rounded bg-neutral-100 text-[0.6em] font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
      {icon?.charAt(0) || "?"}
    </span>
  );

  if (!IconComponent && icon && !warned.has(icon)) {
    warned.add(icon);
    console.warn(`Icon not found in registry: ${icon}`);
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={mergeClassTokens(
          shared,
          "cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
        )}
        style={baseStyle}
        // A control needs a name; without `alt` it would be an unlabelled
        // button rather than harmless decoration.
        aria-label={alt}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={shared} style={baseStyle} {...a11y} {...rest}>
      {content}
    </span>
  );
};

CustomIcon.displayName = "CustomIcon";

export default CustomIcon;

import React from "react";
import classNames from "classnames";

import { useIconRenderer } from "../contexts/IconContext";
import { useKitT } from "../i18n";
import type { ControlSize, TrueColor } from "../theme/Theme";
import { getPillColorClasses } from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../theme/glass";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";

export const PILL_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "glass",
  "liquid-glass",
] as const;

/**
 * Corner scale for a pill. Deliberately not `SurfaceCorner` — that scale is
 * tuned for cards, where `rounded-md` means 16px, which on a 24px-tall pill is
 * almost a capsule anyway.
 */
export const PILL_CORNERS = ["none", "sm", "md", "lg", "full"] as const;
export type PillCorner = (typeof PILL_CORNERS)[number];

const CORNER_CLASSES: Record<PillCorner, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

/** The two see-through variants, which take the glass props. */
const GLASS_VARIANTS = new Set<PillVariant>(["glass", "liquid-glass"]);
export type PillVariant = (typeof PILL_VARIANTS)[number];
/** The shared control scale — it used to be its own four-step union. */
export type PillSize = ControlSize;
export type PillTone = TrueColor;

const SIZE_STYLES: Record<PillSize, string> = {
  xs: "text-[11px] h-4 px-2 gap-1",
  sm: "text-[12px] h-5 px-2.5 gap-1",
  md: "text-xs h-6 px-3 gap-1.5",
  lg: "text-sm h-7 px-4 gap-1.5",
  xl: "text-sm h-8 px-5 gap-2",
};

/** Matches `Badge`'s dot ladder, so the two line up at the same size. */
const DOT_STYLES: Record<PillSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

const ICON_SIZE: Record<PillSize, "xs" | "sm"> = {
  xs: "xs",
  sm: "xs",
  md: "xs",
  lg: "sm",
  xl: "sm",
};

export interface PillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color" | "onClick"> {
  tone?: PillTone;
  /** @default "soft" */
  variant?: PillVariant;
  /** @default "md" */
  size?: PillSize;
  /** @default "full" */
  corner?: PillCorner;
  uppercase?: boolean;
  /** Glass fill transparency, for the see-through variants. @default "frosted" */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /**
   * Specular highlight. `liquid-glass` defaults to `classic`; plain `glass`
   * defaults to none, which is the difference between the two.
   */
  specularMode?: SpecularMode;
  /** Icon before the label. A registry name, or any node. */
  icon?: React.ReactNode;
  /** Icon after the label. */
  trailingIcon?: React.ReactNode;
  /**
   * Renders as a bare status dot with no label. Any `children`, `icon` or
   * `onRemove` are dropped, so it stays a dot.
   */
  dot?: boolean;
  /** Adds a remove button. Its click does not activate the pill itself. */
  onRemove?: () => void;
  /** Accessible name for that button. @default "Remove" */
  removeLabel?: string;
  /** Makes the whole pill activatable — it renders as a real `<button>`. */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  /** Truncates a long label instead of stretching the pill. */
  maxWidth?: number | string;
  /**
   * Accessible name for a `dot`, which has no text of its own. Without one the
   * dot is treated as decoration and hidden.
   */
  label?: string;
}

export const Pill: React.FC<PillProps> = ({
  tone = "blue",
  variant = "soft",
  size = "md",
  corner = "full",
  uppercase = false,
  glassOpacity = "frosted",
  vibrancy = "medium",
  specularMode,
  icon,
  trailingIcon,
  dot = false,
  onRemove,
  removeLabel,
  onClick,
  disabled = false,
  maxWidth,
  label,
  className,
  children,
  style,
  ...rest
}) => {
  const t = useKitT();
  const renderIcon = useIconRenderer();

  const isGlass = GLASS_VARIANTS.has(variant);
  const isInteractive = Boolean(onClick) || Boolean(onRemove);

  // The tone map only covers the opaque variants; a glass pill drops them
  // entirely — they paint a solid fill — and takes its rim, copy colour and
  // focus ring from the shared glass chrome instead.
  const toneTokens = isGlass
    ? { base: undefined as string | undefined, border: undefined as string | undefined }
    : getPillColorClasses(tone, variant as "solid" | "soft" | "outline");

  const glassClasses = isGlass
    ? classNames(
        // `liquid-glass` is the heavier treatment: more blur, and a specular
        // highlight by default. Proportionate to a pill — Panel uses xl/2xl
        // for a whole card.
        variant === "liquid-glass" ? "backdrop-blur-md" : "backdrop-blur-sm",
        getGlassFillClass(tone, glassOpacity),
        getGlassVibrancyClass(vibrancy),
        getGlassChromeClasses(tone, { interactive: isInteractive }),
      )
    : undefined;

  const resolvedSpecular: SpecularMode =
    specularMode ?? (variant === "liquid-glass" ? "classic" : "none");
  const specularClasses = isGlass ? getSpecularClasses(resolvedSpecular) : null;
  const specularOverlay = specularClasses ? (
    <span
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        specularClasses,
      )}
    />
  ) : null;

  // A registry name or an element goes through the renderer so it is sized
  // with the pill; anything else is passed through untouched.
  const renderAdornment = (adornment: React.ReactNode) =>
    typeof adornment === "string" || React.isValidElement(adornment)
      ? renderIcon(adornment, ICON_SIZE[size] ?? "xs")
      : adornment;

  // ── Dot ────────────────────────────────────────────────────────────────────
  if (dot) {
    // The size token is left off entirely rather than overridden. It used to be
    // applied and then "cancelled" by `h-2 px-0` in the same class list — two
    // utilities at the same specificity, so emission order decided, and `h-6`
    // won. A dot rendered as a full-size lozenge.
    return (
      <span
        className={classNames(
          "inline-block shrink-0 rounded-full",
          DOT_STYLES[size] ?? DOT_STYLES.md,
          toneTokens.base,
          toneTokens.border,
          glassClasses,
          disabled && "opacity-50",
          className,
        )}
        style={style}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...rest}
      />
    );
  }

  const content = (
    <>
      {icon && (
        <span className="flex shrink-0 items-center text-inherit">
          {renderAdornment(icon)}
        </span>
      )}
      <span className={classNames(maxWidth !== undefined && "truncate")}>
        {children}
      </span>
      {trailingIcon && (
        <span className="flex shrink-0 items-center text-inherit">
          {renderAdornment(trailingIcon)}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          disabled={disabled}
          onClick={(event) => {
            // Otherwise removing a pill would also activate it.
            event.stopPropagation();
            onRemove();
          }}
          aria-label={removeLabel ?? t("kit.pill.remove")}
          className="-mr-1 flex shrink-0 items-center rounded-full p-0.5 opacity-70 transition hover:bg-black/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current disabled:pointer-events-none dark:hover:bg-white/20"
        >
          {renderIcon("Close", "xs")}
        </button>
      )}
    </>
  );

  const shared = classNames(
    "inline-flex max-w-full items-center justify-center leading-none",
    CORNER_CLASSES[corner] ?? CORNER_CLASSES.full,
    SIZE_STYLES[size] ?? SIZE_STYLES.md,
    toneTokens.base,
    toneTokens.border,
    isGlass && "relative overflow-hidden",
    glassClasses,
    uppercase && "uppercase tracking-wide",
    disabled && "opacity-50",
    className,
  );

  const sizeStyle: React.CSSProperties = {
    ...(maxWidth !== undefined
      ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }
      : undefined),
    ...style,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={classNames(
          shared,
          "cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
        )}
        style={sizeStyle}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {specularOverlay}
        {content}
      </button>
    );
  }

  return (
    // A `<span>`, and the props say so — they used to be typed as
    // `HTMLAttributes<HTMLDivElement>` for an element that was never a div.
    <span className={shared} style={sizeStyle} {...rest}>
      {specularOverlay}
      {content}
    </span>
  );
};

Pill.displayName = "Pill";

export default Pill;

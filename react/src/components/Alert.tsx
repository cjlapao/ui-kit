import React, { useId, useMemo, useState } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  ALERT_INTENT_CONFIG,
  DEFAULT_SURFACE_CORNER,
  getAlertVariantTokens,
  getSurfaceCornerClass,
  type AlertIconAlign,
  type AlertIntent,
  type AlertVariant,
  type ControlSize,
  type SurfaceCorner,
  type TrueColor,
} from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassOpacity,
  type GlassVibrancy,
  type SpecularMode,
} from "../theme/glass";
import type { IconSize } from "../types/Icon";

export {
  ALERT_INTENTS,
  ALERT_VARIANTS,
  ALERT_ICON_ALIGNMENTS,
  ALERT_INTENT_CONFIG,
} from "../theme/Theme";
export type { AlertIconAlign, AlertIntent, AlertVariant };
export type AlertSize = ControlSize;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  /**
   * What the callout means. Picks the tone, the default icon and how assistive
   * technology announces it. `color` overrides just the tone.
   * @default "neutral"
   */
  intent?: AlertIntent;
  /** @deprecated Use `color`, or `intent` for a semantic callout. */
  tone?: TrueColor;
  /** Overrides the tone the `intent` would have chosen. */
  color?: TrueColor;
  /** @default "subtle" */
  variant?: AlertVariant;
  /** @default "md" */
  size?: AlertSize;
  /** Corner radius, on the shared container scale. */
  corner?: SurfaceCorner;
  title?: React.ReactNode;
  /**
   * Body copy. `children` is used instead when this is omitted — the component
   * previously accepted `children` through `HTMLAttributes` and rendered none
   * of it, so `<Alert>text</Alert>` produced an empty callout.
   */
  description?: React.ReactNode;
  /** A registry icon name, a node, or `false` to show none. */
  icon?: string | React.ReactElement | false;
  /**
   * Icon size, on the shared control scale. Defaults to a step derived from
   * `size`, which is right in most cases — set this when the callout needs a
   * heavier glyph than its copy would suggest.
   */
  iconSize?: ControlSize;
  /**
   * Where the icon sits against the content. @default "top"
   */
  iconAlign?: AlertIconAlign;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  /**
   * Controls visibility. Leave it unset and a dismissible alert hides itself —
   * it used to render a dismiss button that did nothing at all unless the
   * caller wired up `onDismiss` *and* their own state.
   */
  open?: boolean;
  /** Label for the dismiss button. @default "Dismiss alert" */
  dismissLabel?: string;
  /** Overrides the politeness the `intent` would have chosen. */
  live?: "assertive" | "polite" | "off";
  /** Glass fill transparency, for the glass variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the glass variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the glass variants. */
  specularMode?: SpecularMode;
  children?: React.ReactNode;
}

type AlertSizeTokens = {
  container: string;
  gap: string;
  title: string;
  text: string;
  icon: IconSize;
  /**
   * Height of the icon's box when it is top-aligned: exactly the title's line
   * box, so the glyph centres on the title's cap height. The default glyph is
   * a couple of pixels taller than this and overflows it harmlessly — the
   * container's padding absorbs it.
   */
  iconBox: string;
  /**
   * The same height as a floor rather than a fixed value, used when the caller
   * overrides `iconSize`. A glyph much taller than the title would otherwise
   * spill outside the callout entirely at the small sizes, where the vertical
   * padding is only 6px.
   */
  iconBoxLoose: string;
  dismiss: string;
  dismissIcon: IconSize;
  actions: string;
};

const SIZE_STYLES: Record<AlertSize, AlertSizeTokens> = {
  xs: {
    container: "px-2.5 py-1.5",
    gap: "gap-2",
    title: "text-xs",
    text: "text-xs",
    icon: "sm",
    iconBox: "h-4",
    iconBoxLoose: "min-h-4",
    dismiss: "h-5 w-5",
    dismissIcon: "xs",
    actions: "pt-1.5",
  },
  sm: {
    container: "px-3 py-2",
    gap: "gap-2.5",
    title: "text-xs",
    text: "text-xs",
    icon: "sm",
    iconBox: "h-4",
    iconBoxLoose: "min-h-4",
    dismiss: "h-6 w-6",
    dismissIcon: "sm",
    actions: "pt-2",
  },
  md: {
    container: "px-4 py-3",
    gap: "gap-3",
    title: "text-sm",
    text: "text-sm",
    icon: "md",
    iconBox: "h-5",
    iconBoxLoose: "min-h-5",
    dismiss: "h-8 w-8",
    dismissIcon: "sm",
    actions: "pt-2",
  },
  lg: {
    container: "px-5 py-4",
    gap: "gap-3.5",
    title: "text-base",
    text: "text-sm",
    icon: "lg",
    iconBox: "h-6",
    iconBoxLoose: "min-h-6",
    dismiss: "h-9 w-9",
    dismissIcon: "md",
    actions: "pt-3",
  },
  xl: {
    container: "px-6 py-5",
    gap: "gap-4",
    title: "text-lg",
    text: "text-base",
    icon: "xl",
    iconBox: "h-7",
    iconBoxLoose: "min-h-7",
    dismiss: "h-10 w-10",
    dismissIcon: "md",
    actions: "pt-3",
  },
};

const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

/**
 * `top` keeps its own fixed-height box (see the render), so it only needs the
 * default `align-self`. The other two drop the box and let the flex line place
 * them against the full content height.
 */
const ALIGN_CLASSES: Record<AlertIconAlign, string> = {
  top: "self-start",
  center: "self-center",
  bottom: "self-end",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      intent = "neutral",
      tone,
      color,
      variant = "subtle",
      size = "md",
      corner = DEFAULT_SURFACE_CORNER,
      title,
      description,
      icon,
      iconSize,
      iconAlign = "top",
      actions,
      dismissible = false,
      onDismiss,
      open,
      dismissLabel = "Dismiss alert",
      live,
      glassOpacity = "frosted",
      vibrancy = "medium",
      specularMode = "none",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const renderIcon = useIconRenderer();
    const titleId = useId();
    const [selfDismissed, setSelfDismissed] = useState(false);

    const config = ALERT_INTENT_CONFIG[intent] ?? ALERT_INTENT_CONFIG.neutral;
    const effectiveColor = color ?? tone ?? config.tone;
    const sizeToken = SIZE_STYLES[size] ?? SIZE_STYLES.md;
    const tokens = useMemo(
      () => getAlertVariantTokens(effectiveColor, variant),
      [effectiveColor, variant],
    );

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : !selfDismissed;

    const isGlass = GLASS_VARIANTS.includes(variant);
    const glassClasses = isGlass
      ? classNames(
          variant === "liquid-glass" ? "backdrop-blur-md" : "backdrop-blur-sm",
          getGlassFillClass(effectiveColor, glassOpacity),
          getGlassVibrancyClass(vibrancy),
          // A callout is not a control: no hover rim, no focus ring on the box
          // itself. The dismiss button brings its own.
          getGlassChromeClasses(effectiveColor, { interactive: false }),
        )
      : null;

    const specularClasses = isGlass ? getSpecularClasses(specularMode) : null;

    const handleDismiss = () => {
      if (!isControlled) setSelfDismissed(true);
      onDismiss?.();
    };

    if (!isOpen) return null;

    const resolvedIcon =
      icon === false ? null : (icon ?? config.icon);

    // `role="alert"` is an assertive live region — it interrupts the screen
    // reader mid-sentence. Every alert used to carry it, including the purely
    // informational ones that are on the page at load.
    const politeness = live ?? config.live;
    const role =
      politeness === "assertive"
        ? "alert"
        : politeness === "polite"
          ? "status"
          : undefined;

    const body = description ?? children;
    const hasTitle = title !== undefined && title !== null && title !== "";

    return (
      <div
        ref={ref}
        className={classNames(
          "relative flex w-full border shadow-sm transition",
          sizeToken.container,
          sizeToken.gap,
          getSurfaceCornerClass(corner),
          tokens.surface,
          tokens.border,
          isGlass && "overflow-hidden",
          glassClasses,
          className,
        )}
        role={role}
        aria-live={politeness === "off" ? undefined : politeness}
        aria-labelledby={hasTitle ? titleId : undefined}
        {...rest}
      >
        {specularClasses && (
          <div
            className={classNames(
              "pointer-events-none absolute inset-0 rounded-[inherit]",
              specularClasses,
            )}
            aria-hidden="true"
          />
        )}

        {resolvedIcon && (
          <div
            className={classNames(
              // `pt-1` used to fake the top alignment: a magic offset that only
              // lined up with the `md` title and drifted at every other size.
              // A box exactly the height of the title's line, with the glyph
              // centred in it, lands on the title's cap height at any size.
              // An explicit `iconSize` relaxes that to a floor — the caller is
              // overriding the calibration, and a glyph much taller than the
              // title would otherwise spill outside the callout.
              "flex flex-shrink-0 items-center",
              ALIGN_CLASSES[iconAlign] ?? ALIGN_CLASSES.top,
              iconAlign === "top" &&
                (iconSize ? sizeToken.iconBoxLoose : sizeToken.iconBox),
              tokens.icon,
            )}
          >
            {renderIcon(resolvedIcon, iconSize ?? sizeToken.icon)}
          </div>
        )}

        <div className="relative flex min-w-0 flex-1 flex-col gap-1">
          {hasTitle && (
            <div
              id={titleId}
              className={classNames(
                "font-semibold leading-tight",
                sizeToken.title,
              )}
            >
              {title}
            </div>
          )}
          {body !== undefined && body !== null && body !== "" && (
            <div
              className={classNames(
                "leading-relaxed",
                sizeToken.text,
                tokens.text,
              )}
            >
              {body}
            </div>
          )}
          {actions && (
            <div className={classNames(sizeToken.actions, sizeToken.text)}>
              {actions}
            </div>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={classNames(
              "relative inline-flex flex-shrink-0 items-center justify-center self-start rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
              sizeToken.dismiss,
              tokens.dismiss,
            )}
            aria-label={dismissLabel}
          >
            {renderIcon("Close", sizeToken.dismissIcon)}
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export default Alert;

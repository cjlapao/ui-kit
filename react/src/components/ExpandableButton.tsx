import {
  CONTROL_SPRINGS as EXPANDABLE_BUTTON_SPRINGS,
  CONTROL_SPRING_TOKENS as EXPANDABLE_BUTTON_SPRING_TOKENS,
  type ControlSpring as ExpandableButtonSpring,
} from "../../../common/theme/springs";
import classNames from "classnames";
import React, {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
import Spinner, { type SpinnerColor } from "./Spinner";
import { warnIfAriaHiddenFocusable } from "../../../common/a11y/warn";
import { useIconRenderer } from "../contexts/IconContext";
import { getButtonColorClasses, getControlSizeTokens } from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import type { IconSize } from "../types/Icon";
import TooltipWrapper from "./TooltipWrapper";
import type { TooltipPosition } from "./Tooltip";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";

type ExpandableButtonRounded = "md" | "lg" | "xl" | "full";

const roundedMap: Record<ExpandableButtonRounded, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/**
 * What reveals the label.
 *
 * Hover uses React state with a collapse grace period; focus remains CSS-driven.
 * `click` puts the open state in React so it survives a tap and
 * answers to Enter/Space, and `always` renders the control expanded — useful
 * for a sidebar that has just been pinned open.
 */
export const EXPAND_TRIGGERS = [
  "hover",
  "focus",
  "hover+focus",
  "click",
  "always",
] as const;
export type ExpandTrigger = (typeof EXPAND_TRIGGERS)[number];

export { EXPANDABLE_BUTTON_SPRINGS, EXPANDABLE_BUTTON_SPRING_TOKENS };
export type { ExpandableButtonSpring };

/**
 * How the glyph behaves while the label slides out.
 *
 * `pop-tilt` is the reference animation: scale past 1 and lean over, so the
 * icon reads as the thing pulling the label open.
 */
export const EXPANDABLE_BUTTON_ICON_MOTIONS = [
  "pop-tilt",
  "pop",
  "tilt",
  "lift",
  "none",
] as const;
export type ExpandableButtonIconMotion =
  (typeof EXPANDABLE_BUTTON_ICON_MOTIONS)[number];

// No `transition-colors` here, unlike Button/IconButton: `.eb-btn` owns the
// transition list (the elastic curve and the colour fade have different
// durations, which a single Tailwind utility cannot express).
const baseClasses =
  "inline-flex items-center select-none focus-visible:outline-none disabled:cursor-not-allowed";

export interface ExpandableButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> {
  icon: string | React.ReactElement;
  /** The text that slides out. Rendered as real text, but the accessible name comes from `srLabel`/`aria-label` — see the docs page. */
  label: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: ExpandableButtonRounded;
  /** Escape hatch replacing the computed padding/box class. Prefer `size`. */
  customSizeClass?: string;
  iconClassName?: string;
  /** Class for the label's inner content span (the one that fades and slides). */
  labelClassName?: string;
  loading?: boolean;
  spinnerVariant?: "solid" | "segments";
  spinnerColor?: SpinnerColor;
  /**
   * The accessible name. The label itself stays `aria-hidden` while collapsed
   * (a 0-width `overflow: hidden` box is unreliable across screen readers),
   * so this — not the visible text — is what gets announced.
   */
  srLabel?: string;
  accent?: boolean;
  accentColor?: ButtonColor;
  /**
   * Raw CSS colour to tint the icon. Omit it and the icon inherits the
   * button's text colour (icons paint with `currentColor`), so the glyph
   * always matches; set it to override just the icon.
   */
  iconColor?: string;
  /** When set, a styled tooltip is shown on hover (replaces the native title attribute). */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. Defaults to "clear" for icon-style controls. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. Defaults to "none". */
  specularMode?: SpecularMode;
  /** What reveals the label. Defaults to "hover". */
  expandOn?: ExpandTrigger;
  /** Time outside the rectangular hover area before collapsing, in ms. Defaults to 500. */
  collapseDelay?: number;
  /**
   * Controlled open state. When set it owns the control outright: the hover
   * and focus triggers are switched off — glyph included, since the whole
   * reveal hangs off the same open switch — rather than left to animate a
   * label the caller has decided should stay shut.
   */
  expanded?: boolean;
  /** Initial open state for the uncontrolled `expandOn="click"` mode. */
  defaultExpanded?: boolean;
  /**
   * Fired when the effective open state changes: once the pointer and focus
   * have *both* let go after the hover grace period (so a `hover+focus` control does not
   * report `true` twice on arrival, nor `false` on mouse-leave while focus
   * still holds the label open), and on every toggle in `click` mode. Nothing
   * comes from `always`, and nothing from a value you set yourself.
   */
  onExpandedChange?: (expanded: boolean) => void;
  /** Spring preset driving the reveal. Defaults to "bouncy" (the overshoot curve). */
  spring?: ExpandableButtonSpring;
  /** Override the preset's duration in ms. The curve still comes from `spring`. */
  springDuration?: number;
  /**
   * How long the label takes to fade in, in ms. It rides a plain ease rather
   * than the spring — an opacity that overshoots 1 just clips — so it is
   * separable. Defaults to the stylesheet's 300ms.
   */
  fadeDuration?: number;
  /**
   * The gap the label opens between itself and the glyph, as a CSS length.
   * Relative units are the point: `0.6em` keeps the spacing in proportion at
   * every `size`. Defaults to the stylesheet's `0.6em`.
   */
  labelGap?: string;
  /**
   * How far back the label starts, so it appears to slide out from behind the
   * glyph rather than fade in on the spot. A CSS length; defaults to the
   * stylesheet's `0.8em`.
   */
  labelSlide?: string;
  /** Optional resting shadow + a deeper one on hover, both on the spring. Defaults to false. */
  elevate?: boolean;
  /** What the glyph does while the label slides out. Defaults to "pop-tilt". */
  iconMotion?: ExpandableButtonIconMotion;
  /** Press feedback: the button squishes to 94%. Defaults to true. */
  squish?: boolean;
  /** Where the label sits relative to the glyph. Defaults to "after". */
  labelPlacement?: "after" | "before";
}

const ExpandableButton = forwardRef<HTMLButtonElement, ExpandableButtonProps>(
  (
    {
      icon,
      label,
      variant = "icon",
      color = "blue",
      size = "md",
      rounded = "full",
      customSizeClass,
      iconClassName,
      labelClassName,
      loading = false,
      spinnerVariant = "segments",
      spinnerColor,
      srLabel,
      accent = false,
      accentColor,
      iconColor,
      glass = false,
      vibrancy = "medium",
      glassOpacity = "clear",
      specularMode = "none",
      expandOn = "hover",
      collapseDelay = 150,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      spring = "bouncy",
      springDuration,
      fadeDuration,
      labelGap,
      labelSlide,
      elevate = false,
      iconMotion = "pop-tilt",
      squish = true,
      labelPlacement = "after",
      className,
      disabled,
      tooltip,
      tooltipPosition,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const renderIcon = useIconRenderer();
    const sizeConfig = getControlSizeTokens(size);
    const baseColorClasses = getButtonColorClasses(variant, color);
    const accentTone = accentColor ?? color;
    const accentRing = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHover = iconAccentHover[accentTone] ?? iconAccentHover.blue;
    const accentClasses = accent
      ? classNames(
          "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
          accentRing,
          accentHover,
        )
      : null;

    // When accent is off but accentColor is explicitly provided,
    // apply hover text color for non-solid variants (ghost, soft, outline, icon)
    const nonAccentHover =
      !accent && accentColor && variant !== "solid"
        ? (iconAccentHover[accentColor] ?? null)
        : null;

    // Symmetric padding, not the text-button `px/py` pair: at rest the control
    // is a circle, and an asymmetrical padding would make it a pill the moment
    // it renders. The label carries its own gap when it opens.
    const dimensionClass = customSizeClass ?? sizeConfig.iconOnly;
    const spinnerColorToken: SpinnerColor =
      spinnerColor ?? (color as SpinnerColor);

    // Glass styling — variant="glass" auto-enables glass; glass prop overrides
    const isGlass = variant === "glass" || glass;
    // The variant's own colour classes are dropped for glass (they paint an
    // opaque fill), so the chrome — text colour, rim, focus ring — has to come
    // from here or the control ends up with none of it.
    const glassClasses = isGlass
      ? classNames(
          "backdrop-blur-sm",
          getGlassFillClass(color, glassOpacity),
          getGlassVibrancyClass(vibrancy),
          getGlassChromeClasses(color),
        )
      : null;

    const resolvedSpecularMode = isGlass ? specularMode : "none";
    const specularOverlay =
      resolvedSpecularMode !== "none"
        ? (() => {
            const specClasses = getSpecularClasses(resolvedSpecularMode);
            return specClasses ? (
              <div
                className={classNames(
                  "pointer-events-none absolute inset-0 rounded-[inherit]",
                  specClasses,
                )}
                aria-hidden="true"
              />
            ) : null;
          })()
        : null;

    // Click owns its toggle; hover adds a grace period before releasing the
    // CSS open switch. Focus is still answered by the stylesheet.
    const isControlled = expanded !== undefined;
    const [open, setOpen] = useState(defaultExpanded);
    const controlledOpen = isControlled ? !!expanded : open;
    const clickMode = expandOn === "click";
    // A controlled (or always, or click) button owns the open state outright,
    // so the CSS hover/focus triggers are switched off rather than left to
    // fight the caller's `expanded`.
    const ownsOpenState = isControlled || clickMode || expandOn === "always";
    const openAttribute =
      expandOn === "always"
        ? true
        : ownsOpenState
          ? controlledOpen
          : false;
    const cssHover =
      !ownsOpenState && (expandOn === "hover" || expandOn === "hover+focus");
    const cssFocus =
      !ownsOpenState && (expandOn === "focus" || expandOn === "hover+focus");

    // `report` exists so a caller can follow the state without the control
    // tracking individual events: hover and focus are tracked in refs, and the
    // callback fires only when the *composite* answer changes. (Reporting each
    // event instead would announce `true` twice for one hover+focus arrival,
    // and `false` on mouse-leave while the label is still held open by focus.)
    const [hoverOpen, setHoverOpen] = useState(false);
    const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hoveredRef = useRef(false);
    const focusedRef = useRef(false);
    const reportedRef = useRef<boolean>(
      expandOn === "always" ? true : controlledOpen,
    );
    const report = useCallback(
      (next: boolean) => {
        if (next === reportedRef.current) return;
        reportedRef.current = next;
        onExpandedChange?.(next);
      },
      [onExpandedChange],
    );
    const reportComposite = useCallback(
      () => report(hoveredRef.current || focusedRef.current),
      [report],
    );

    const reportCompositeRef = useRef(reportComposite);
    useLayoutEffect(() => { reportCompositeRef.current = reportComposite; });
    const cancelCollapse = useCallback(() => {
      if (collapseTimer.current !== null) {
        clearTimeout(collapseTimer.current);
        collapseTimer.current = null;
      }
    }, []);
    useEffect(() => {
      cancelCollapse();
      hoveredRef.current = false;
      focusedRef.current = false;
      setHoverOpen(false);
      // Synchronize ownership without announcing a caller-controlled change.
      reportedRef.current = expandOn === "always"
        ? true
        : isControlled || clickMode ? controlledOpen : false;
      return cancelCollapse;
    }, [cancelCollapse, expandOn, isControlled, controlledOpen, clickMode, disabled, loading]);

    const enterHover = () => {
      cancelCollapse();
      hoveredRef.current = true;
      setHoverOpen(true);
      reportComposite();
    };
    const leaveHover = () => {
      cancelCollapse();
      const release = () => {
        collapseTimer.current = null;
        hoveredRef.current = false;
        setHoverOpen(false);
        reportCompositeRef.current();
      };
      if (collapseDelay <= 0) release();
      else collapseTimer.current = setTimeout(release, collapseDelay);
    };

    const computedClassName = classNames(
      "eb-btn",
      baseClasses,
      !loading && "disabled:opacity-50",
      dimensionClass,
      roundedMap[rounded] ?? roundedMap.full,
      isGlass ? (accentClasses ?? "") : (accentClasses ?? baseColorClasses),
      nonAccentHover,
      "relative",
      glassClasses,
      className,
    );

    // The spring lives in custom properties rather than class strings so a
    // caller can tune the physics without a Tailwind safelist entry — and so
    // `prefers-reduced-motion` can zero the durations from the stylesheet.
    const springConfig =
      EXPANDABLE_BUTTON_SPRING_TOKENS[spring] ??
      EXPANDABLE_BUTTON_SPRING_TOKENS.bouncy;
    const springVars = {
      "--eb-spring-easing": springConfig.easing,
      "--eb-spring-duration": `${springDuration ?? springConfig.duration}ms`,
      ...(fadeDuration !== undefined
        ? { "--eb-fade-duration": `${fadeDuration}ms` }
        : null),
      ...(labelGap ? { "--eb-label-gap": labelGap } : null),
      ...(labelSlide ? { "--eb-label-slide": labelSlide } : null),
    } as CSSProperties;

    // The icon paints with `currentColor`, so by default it inherits the
    // button's text colour and the glyph always matches. An `iconColor`
    // tints only the glyph by wrapping it in a span that carries the colour.
    const iconNode = renderIcon(
      icon,
      size as IconSize,
      classNames("flex-shrink-0", sizeConfig.icon, iconClassName),
    );
    const glyph = (
      <span className="eb-icon" aria-hidden="true">
        {iconColor ? (
          <span
            className="inline-flex shrink-0 items-center"
            style={{ color: iconColor }}
          >
            {iconNode}
          </span>
        ) : (
          iconNode
        )}
      </span>
    );

    // 0fr → 1fr is what lets the label animate to its natural width: the
    // track is a grid column that has no intrinsic size of its own, so the
    // browser interpolates the column and the content follows.
    const labelTrack = (
      <span className="eb-label-track" aria-hidden="true">
        <span className={classNames("eb-label", labelClassName)}>
          {label}
        </span>
      </span>
    );

    // Pull aria-label, title and style out of rest so they can be composed
    // rather than clobbered. title falls back to aria-label → srLabel → label
    // so the native browser tooltip always shows the accessible name rather
    // than nothing. When a styled tooltip is provided, omit the native title to
    // avoid doubling.
    // `style` needs the same care: the spring lives in inline custom
    // properties, and a bare `{...restProps}` spread after `style={…}` would
    // let a caller's `{ marginTop: 8 }` silently delete them — leaving the
    // control on the stylesheet's default curve. The caller's own declarations
    // are merged *last*, so an explicit `--eb-spring-duration` still wins.
    const {
      "aria-label": ariaLabel,
      title,
      type = "button",
      style: restStyle,
      ...restProps
    } = rest;
    const style: CSSProperties = { ...springVars, ...restStyle };
    const fallbackName = typeof label === "string" ? label : undefined;
    const computedAriaLabel = ariaLabel ?? srLabel ?? fallbackName;
    const computedTitle = tooltip ? undefined : (title ?? computedAriaLabel);
    // The visible label is decorative (0 width when closed, so its exposure to
    // the a11y tree is unreliable); the sr-only span is the name that never
    // disappears.
    const srText = computedAriaLabel ?? "Expandable button";
    // a11y: the sr-only fallback always names the button, but a focusable node
    // that is also aria-hidden is still a defect.
    warnIfAriaHiddenFocusable("ExpandableButton", {
      ariaHidden: (rest as { "aria-hidden"?: boolean })["aria-hidden"],
      interactive: !(disabled || loading),
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (clickMode && !disabled && !loading) {
        const next = !controlledOpen;
        if (!isControlled) setOpen(next);
        report(next);
      }
      onClick?.(event);
    };

    const button = (
      <button
        ref={ref}
        // `type="button"` by default — see Button: the native default is
        // "submit", which made an unspec'd button submit its form.
        type={type}
        className={computedClassName}
        style={style}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-glass={isGlass}
        data-expanded={openAttribute}
        data-expand-hover={cssHover}
        data-hovered={cssHover && hoverOpen && !disabled && !loading}
        data-expand-focus={cssFocus}
        data-elevate={elevate}
        data-icon-motion={loading ? "none" : iconMotion}
        data-squish={squish}
        data-label-placement={labelPlacement}
        disabled={disabled || loading}
        aria-label={computedAriaLabel}
        aria-expanded={ownsOpenState ? openAttribute : undefined}
        title={computedTitle}
        onClick={handleClick}
        onMouseEnter={
          cssHover
            ? (event) => {
                if (!disabled && !loading) enterHover();
                onMouseEnter?.(event);
              }
            : onMouseEnter
        }
        onMouseLeave={
          cssHover
            ? (event) => {
                if (!disabled && !loading) leaveHover();
                onMouseLeave?.(event);
              }
            : onMouseLeave
        }
        onFocus={
          cssFocus || cssHover
            ? (event) => {
                focusedRef.current = cssFocus ||
                  event.currentTarget.matches(":focus-visible") ||
                  window.matchMedia("(hover: none)").matches;
                reportComposite();
                onFocus?.(event);
              }
            : onFocus
        }
        onBlur={
          cssFocus || cssHover
            ? (event) => {
                focusedRef.current = false;
                reportComposite();
                onBlur?.(event);
              }
            : onBlur
        }
        {...restProps}
      >
        {cssHover && <span className="eb-hitbox" aria-hidden="true" />}
        {specularOverlay}
        {loading ? (
          <span className="eb-icon" aria-hidden="true">
            <Spinner
              size={sizeConfig.spinnerSize}
              color={spinnerColorToken}
              variant={spinnerVariant}
            />
          </span>
        ) : (
          glyph
        )}
        {labelTrack}
        <span className="sr-only">{srText}</span>
      </button>
    );

    if (tooltip) {
      return (
        <TooltipWrapper text={tooltip} position={tooltipPosition}>
          {button}
        </TooltipWrapper>
      );
    }

    return button;
  },
);

ExpandableButton.displayName = "ExpandableButton";

export default ExpandableButton;

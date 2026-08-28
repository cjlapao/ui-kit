import React from "react";
import classNames from "classnames";
import Button, { type ButtonProps } from "./Button";
import Loader, { type LoaderProps } from "./Loader";
import {
  DEFAULT_SURFACE_CORNER,
  getPanelToneStyles,
  getSurfaceCornerClass,
  getSurfacePaddingClass,
  getSurfacePaddingClasses,
  getSurfaceTextTokens,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import {
  SURFACE_HALO_DARK,
  SURFACE_HALO_LIGHT,
  getGlassVibrancyClass,
  getSurfaceGlassFillClass,
  type GlassOpacity,
  type GlassVibrancy,
} from "../theme/glass";
import { SurfaceProvider } from "../contexts/SurfaceContext";

/**
 * The shared container surface set, from the theme. Aliased rather than
 * redeclared so `Panel` and `FormSection` cannot drift.
 */
export type PanelVariant = SurfaceVariant;
export type PanelTone = TrueColor;
export type PanelDecoration = "none" | "gradient" | "shapes" | "both";
export type PanelMediaPlacement = "top" | "start" | "end" | "overlay";
/**
 * `none` plus the shared `ControlSize` scale, so a Panel's inset and the
 * Button inside it are described in the same language. Gained `xl`.
 */
export type PanelPadding = SurfacePadding;
/** The shared container radius scale. Gained `rounded-xl`. */
export type PanelCorner = SurfaceCorner;
export type PanelActionLayout = "auto" | "stacked" | "inline";
export type PanelLoaderType =
  | Exclude<LoaderProps["variant"], undefined>
  | "skeleton";
export type PanelSpecularMode = "none" | "classic" | "halo";

export interface PanelAction extends Pick<
  ButtonProps,
  | "variant"
  | "color"
  | "size"
  | "weight"
  | "leadingIcon"
  | "trailingIcon"
  | "loading"
  | "disabled"
  | "accent"
  | "accentColor"
> {
  id?: string;
  label: React.ReactNode;
  onClick?: ButtonProps["onClick"];
  className?: string;
}

export interface PanelProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title?: React.ReactNode;
  titleClassName?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  badge?: React.ReactNode;
  media?: React.ReactNode;
  mediaPlacement?: PanelMediaPlacement;
  actions?: PanelAction[];
  actionLayout?: PanelActionLayout;
  variant?: PanelVariant;
  tone?: TrueColor;
  padding?: PanelPadding;
  corner?: PanelCorner;
  fullWidth?: boolean;
  disabled?: boolean;
  flexBody?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
  loading?: boolean;
  loaderType?: PanelLoaderType;
  loaderTitle?: React.ReactNode;
  loaderMessage?: React.ReactNode;
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  /**
   * Body placeholder lines rendered by `loaderType="skeleton"`.
   * @default 3
   */
  skeletonLines?: number;
  hoverShadow?: boolean;
  decoration?: PanelDecoration;
  /**
   * Adds a subtle background tint on hover and lightens any decoration elements.
   * Defaults to `true` when an `onClick` handler is present, otherwise `false`.
   */
  hoverable?: boolean;
  color?: TrueColor;
  /**
   * Override the default hover color.
   * If not provided, it defaults to the `color` prop if available, or a neutral tint.
   */
  hoverColor?: TrueColor;
  /**
   * Override the default border color.
   * If not provided, it defaults to the `tone` or `color` prop depending on variant.
   */
  borderColor?: TrueColor;
  /**
   * Override the default background color.
   */
  backgroundColor?: TrueColor;
  /**
   * controls if the panel body should be scrollable
   * @default true
   */
  scrollable?: boolean;
  /**
   * Backdrop vibrancy for the liquid-glass variant.
   * Shares its type with the control-side glass helpers.
   */
  vibrancy?: GlassVibrancy;
  /**
   * Glass fill opacity for the liquid-glass variant.
   * Only the three presets are safelisted — a numeric value emits an arbitrary
   * opacity Tailwind's scanner cannot see, so the fill silently disappears.
   * @default "frosted"
   */
  glassOpacity?: GlassOpacity;
  /**
   * Whether the liquid-glass variant shows a specular highlight at the top.
   * @default true
   *
   * @deprecated Use specularMode instead. Kept for backward compatibility.
   * When both are provided, specularMode takes precedence. If neither is set,
   * defaults to "classic".
   */
  specularHighlight?: boolean;
  /**
   * Specular highlight mode for the liquid-glass variant.
   * Controls how light reflects off the glass surface.
   * @default "classic"
   */
  specularMode?: PanelSpecularMode;
}

/**
 * Chrome only — fill, shadow, ring, border, blur. Text colour is NOT set here:
 * it comes from `getSurfaceTextTokens(variant)`, so the translucent variants
 * automatically get the higher-contrast copy instead of each entry carrying
 * its own hardcoded `text-neutral-*` pair that only worked on an opaque card.
 */
const variantBaseStyles: Record<PanelVariant, string> = {
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
  // A real 1px border, not a ring. `ring-1` with no ring colour resolves to
  // currentColor, which painted a near-black rule in light mode.
  outlined: "border bg-white/90 dark:bg-neutral-900/80",
  subtle: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  tonal: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  default:
    "border bg-white/80 backdrop-blur-xl shadow-2xl dark:bg-neutral-900/70",
  glass:
    "border backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20",
  "liquid-glass": "border backdrop-blur-2xl",
  simple: "ring-transparent dark:ring-white/5",
};

/**
 * Rim for the translucent variants. Deliberately tone-independent: a saturated
 * `{tone}-500` edge fights the backdrop it is meant to sit over, so glass gets
 * a light rim that reads as a bevel instead of an outline. Pass `borderColor`
 * for a coloured rim.
 */
const GLASS_RIM = "border-white/50 dark:border-white/10";

/** Variants whose surface is see-through, so they get a specular top edge. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

export type PanelEdgeChrome = {
  /** The edge's surface fill — what the fragment behind the rim is painted with. */
  fill: string;
  /** Border colour classes for the arrow's two visible sides. */
  border: string;
  /** Backdrop treatment (blur + vibrancy) for the translucent variants. */
  backdrop: string;
};

/**
 * A surface's edge chrome as a standalone fragment — the Popover's
 * rotated-square arrow must read as a continuation of the panel's own edge,
 * so it takes the fill, rim and backdrop from the same tokens the variant
 * branches above use instead of a second, drifting home of "what an edge
 * looks like". The caller applies the side-specific border widths
 * (`border-t border-l`, …); this returns colour and paint only, so one
 * fragment can never emit two widths for one property (§5.1).
 *
 * The ring-based variants (elevated, subtle) are mirrored as *borders* of the
 * same colour: a ring is a full box-shadow and cannot give the arrow its two
 * visible sides, while the hidden half of a full border would show through a
 * translucent panel.
 */
export const getPanelEdgeChrome = (
  variant: SurfaceVariant,
  tone: TrueColor,
  glassOpacity: GlassOpacity = "frosted",
  vibrancy: GlassVibrancy = "medium",
): PanelEdgeChrome => {
  const palette = getPanelToneStyles(tone);
  switch (variant) {
    case "outlined":
      return {
        fill: "bg-white/90 dark:bg-neutral-900/80",
        border: palette.outlineBorder,
        backdrop: "",
      };
    case "subtle":
      return {
        fill: palette.subtleBg,
        border: "border-transparent dark:border-white/5",
        backdrop: "",
      };
    case "tonal":
      return { fill: palette.tonalBg, border: "border-transparent", backdrop: "" };
    case "default":
      return {
        fill: "bg-white/80 dark:bg-neutral-900/70",
        border: GLASS_RIM,
        backdrop: "backdrop-blur-xl",
      };
    case "glass":
      return {
        fill: palette.glassBg,
        border: GLASS_RIM,
        backdrop: "backdrop-blur-xl",
      };
    case "liquid-glass":
      return {
        fill: getSurfaceGlassFillClass(tone, glassOpacity),
        border: palette.liquidBorder,
        backdrop: `backdrop-blur-2xl ${getGlassVibrancyClass(vibrancy)}`,
      };
    case "simple":
      return { fill: palette.tonalBg, border: "border-transparent", backdrop: "" };
    case "elevated":
    default:
      return {
        fill: "bg-white dark:bg-neutral-900",
        border: "border-black/5 dark:border-white/10",
        backdrop: "",
      };
  }
};

/**
 * Re-exported from the theme for `CollapsiblePanel` and `TimelinePanel`, which
 * import the map directly rather than taking a Panel.
 */
export const paddingStyles: Record<PanelPadding, string> =
  getSurfacePaddingClasses();

const actionButtonWidth: Record<PanelActionLayout, string> = {
  auto: "w-full sm:w-auto",
  stacked: "w-full",
  inline: "w-auto",
};

const actionWrapperLayout: Record<PanelActionLayout, string> = {
  auto: "flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
  stacked: "flex-col gap-3",
  inline: "flex-wrap items-center gap-3",
};

const defaultActionColor: TrueColor = "neutral";

/**
 * One placeholder bar. `bg-black/10 dark:bg-white/10` rather than a neutral
 * shade so the same bar reads correctly on a solid card and on glass.
 * Exported so other components' skeletons (SideMenu) pulse in the same ink.
 */
export const SkeletonBar: React.FC<{
  width?: string;
  /**
   * Height utility, replacing the default rather than sitting beside it —
   * `h-3` and a caller's `h-2` are the same specificity, so both present means
   * emission order picks the winner (§5.1).
   */
  height?: string;
  /**
   * Background utilities, replacing the neutral ink for the same reason: a
   * tone-tinted `bg-{c}-500/20` passed through `className` would sit beside
   * `bg-black/10` and the winner would be emission order, not the caller.
   */
  ink?: string;
  className?: string;
}> = ({ width, height = "h-3", ink = "bg-black/10 dark:bg-white/10", className }) => (
  <span
    className={classNames("block rounded-full", ink, height, className)}
    style={width ? { width } : undefined}
  />
);

interface PanelSkeletonProps {
  hasMedia: boolean;
  hasBadge: boolean;
  hasTitle: boolean;
  hasSubtitle: boolean;
  hasDescription: boolean;
  hasBody: boolean;
  actionCount: number;
  lines: number;
  actionLayout: PanelActionLayout;
}

/**
 * Placeholder shaped like the Panel's own content: only the slots the caller
 * actually passed get a bar, so the skeleton keeps the card's real height
 * instead of collapsing or over-reserving.
 */
const PanelSkeleton: React.FC<PanelSkeletonProps> = ({
  hasMedia,
  hasBadge,
  hasTitle,
  hasSubtitle,
  hasDescription,
  hasBody,
  actionCount,
  lines,
  actionLayout,
}) => (
  <div
    className="flex min-h-0 flex-1 animate-pulse flex-col gap-4 motion-reduce:animate-none"
    aria-hidden="true"
  >
    {hasMedia && (
      <span className="block h-40 w-full rounded-xl bg-black/10 dark:bg-white/10" />
    )}
    {(hasBadge || hasTitle || hasSubtitle || hasDescription) && (
      <div className="space-y-3">
        {hasBadge && <SkeletonBar width="4.5rem" className="h-5" />}
        {hasTitle && <SkeletonBar width="55%" className="h-5" />}
        {hasSubtitle && <SkeletonBar width="35%" className="h-4" />}
        {hasDescription && (
          <div className="space-y-2">
            <SkeletonBar width="100%" className="h-2.5" />
            <SkeletonBar width="80%" className="h-2.5" />
          </div>
        )}
      </div>
    )}
    {hasBody && lines > 0 && (
      <div className="flex-1 space-y-2.5">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonBar
            key={index}
            width={index === lines - 1 ? "60%" : "100%"}
            className="h-2.5"
          />
        ))}
      </div>
    )}
    {actionCount > 0 && (
      <div
        className={classNames(
          "flex pt-3",
          actionLayout === "stacked"
            ? "flex-col gap-3"
            : "flex-wrap items-center gap-3",
        )}
      >
        {Array.from({ length: actionCount }).map((_, index) => (
          <SkeletonBar
            key={index}
            width={actionLayout === "stacked" ? "100%" : "6.5rem"}
            className="h-9 rounded-md"
          />
        ))}
      </div>
    )}
  </div>
);

/**
 * `forwardRef` so callers that need the card element itself — `Modal` uses it
 * for its focus trap and drag clamping — can reach it without a wrapper div
 * that would disturb the layout.
 */
const Panel = React.forwardRef<HTMLElement, PanelProps>(function Panel(
  {
    title,
    subtitle,
    description,
    badge,
    media,
    mediaPlacement = "top",
    actions,
    actionLayout = "auto",
    variant = "elevated",
    tone = "neutral",
    padding = "md",
    corner = DEFAULT_SURFACE_CORNER,
    fullWidth,
    maxWidth,
    minHeight,
    className,
    bodyClassName,
    bodyStyle,
    style,
    children,
    loading = false,
    disabled = false,
    flexBody = false,
    loaderType = "spinner",
    loaderTitle,
    loaderMessage,
    loaderProgress,
    loaderColor,
    skeletonLines = 3,
    hoverShadow = false,
    decoration = "none",
    hoverable,
    titleClassName,
    subtitleClassName,
    descriptionClassName,
    color,
    hoverColor,
    borderColor,
    backgroundColor,
    scrollable = true,
    vibrancy = "medium",
    glassOpacity = "frosted",
    specularHighlight = true,
    specularMode,
    ...rest
  },
  ref,
) {
  const palette = getPanelToneStyles(tone);
  // A translucent card composites over whatever the app puts behind it, so the
  // light end of the neutral scale disappears — subtitles and descriptions on
  // a glass Panel over a photo were effectively invisible while the title
  // still read. These tokens step the copy two shades in the right direction.
  const surfaceText = getSurfaceTextTokens(variant);
  const isHoverable = hoverable ?? Boolean(rest.onClick);
  const isGlass = GLASS_VARIANTS.includes(variant);

  const resolvedSpecularMode: PanelSpecularMode = (() => {
    if (specularMode !== undefined) return specularMode;
    if (specularHighlight === false) return "none";
    return "classic";
  })();

  const effectiveHoverColor =
    hoverColor ?? (color && color !== "neutral" ? color : undefined);
  const hoverColorName = effectiveHoverColor ? effectiveHoverColor : undefined;

  const borderPalette = borderColor
    ? getPanelToneStyles(borderColor)
    : undefined;
  const effectiveBorderClass = borderPalette?.border;

  const bgPalette = backgroundColor
    ? getPanelToneStyles(backgroundColor)
    : undefined;

  const effectiveBgClass = (() => {
    if (!backgroundColor) return undefined;
    if (backgroundColor === "neutral") return "bg-white dark:bg-neutral-900";
    if (bgPalette) {
      if (variant === "glass") return bgPalette.glassBg;
      if (variant === "subtle") return bgPalette.subtleBg;
      if (variant === "simple") return bgPalette.tonalBg;
      if (variant === "tonal") return bgPalette.tonalBg;
      // For elevated/outlined, we might want to apply the subtle background
      return bgPalette.tonalBg;
    }
    return undefined;
  })();

  const isOverlay = mediaPlacement === "overlay" && Boolean(media);
  const hasMedia = Boolean(media);
  // Decoration is suppressed in overlay mode since the image + gradient already provide impact
  const showDecorationGradient =
    !isOverlay && (decoration === "gradient" || decoration === "both");
  const showDecorationShapes =
    !isOverlay && (decoration === "shapes" || decoration === "both");

  const resolvedStyle: React.CSSProperties = (() => {
    const styles: React.CSSProperties = { ...style };
    if (maxWidth !== undefined) {
      styles.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    }
    if (minHeight !== undefined) {
      styles.minHeight =
        typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    }
    return styles;
  })();

  // Both were assembled inline from magic numbers that had drifted from the
  // control-side helpers in theme/glass.ts. The container scale lives there
  // now, next to the control scale and the safelist that covers both.
  const vibrancyClass = getGlassVibrancyClass(vibrancy);
  const glassFillClass = getSurfaceGlassFillClass(tone, glassOpacity);

  const variantClasses = (() => {
    switch (variant) {
      case "outlined":
        return classNames(
          variantBaseStyles.outlined,
          effectiveBorderClass ?? palette.outlineBorder,
        );
      case "subtle":
        return classNames(
          variantBaseStyles.subtle,
          effectiveBorderClass ?? palette.border,
          effectiveBgClass ?? palette.subtleBg,
        );
      case "tonal":
        return classNames(
          variantBaseStyles.tonal,
          effectiveBgClass ?? palette.tonalBg,
          effectiveBorderClass,
        );
      case "default":
        return classNames(
          variantBaseStyles.default,
          effectiveBorderClass ?? GLASS_RIM,
        );
      case "glass":
        return classNames(
          variantBaseStyles.glass,
          effectiveBorderClass ?? GLASS_RIM,
          effectiveBgClass ?? palette.glassBg,
        );
      case "liquid-glass":
        return classNames(
          // `border` was missing, so liquidBorder — a colour-only class — never
          // rendered and the panel had no rim at all.
          variantBaseStyles["liquid-glass"],
          vibrancyClass,
          glassFillClass,
          effectiveBorderClass ?? palette.liquidBorder,
          palette.liquidShadow,
          palette.liquidHeading,
        );
      case "simple":
        return classNames(
          variantBaseStyles.simple,
          effectiveBgClass ?? palette.tonalBg,
          effectiveBorderClass,
        );
      // `elevated` is also the fallback — the two branches used to be
      // byte-identical copies.
      case "elevated":
      default:
        return classNames(
          // A caller-supplied background replaces the variant's own white fill
          // but keeps its shadow and ring.
          effectiveBgClass
            ? "shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            : variantBaseStyles.elevated,
          effectiveBorderClass,
          effectiveBgClass,
        );
    }
  })();

  const overlayClasses = isOverlay
    ? "relative overflow-hidden text-white shadow-xl ring-0"
    : undefined;

  const headingClass = isOverlay
    ? "text-white"
    : variant === "liquid-glass"
      ? palette.liquidHeading
      : palette.heading;
  const subtitleClass = isOverlay ? "text-white/80" : surfaceText.description;
  const descriptionClass = isOverlay ? "text-white/75" : surfaceText.muted;
  const badgeNode =
    typeof badge === "string" ? (
      <span
        className={classNames(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
          isOverlay
            ? "bg-white/15 text-white/90 backdrop-blur-sm"
            : palette.badge,
        )}
      >
        {badge}
      </span>
    ) : (
      badge
    );

  const titleNode =
    typeof title === "string" ? (
      <h3
        className={classNames(
          "text-xl font-semibold leading-7",
          headingClass,
          titleClassName,
        )}
      >
        {title}
      </h3>
    ) : (
      title
    );

  const subtitleNode =
    typeof subtitle === "string" ? (
      <p
        className={classNames(
          "text-base font-medium leading-6",
          subtitleClass,
          subtitleClassName,
        )}
      >
        {subtitle}
      </p>
    ) : (
      subtitle
    );

  const descriptionNode =
    typeof description === "string" ? (
      <p
        className={classNames(
          "text-sm leading-6",
          descriptionClass,
          descriptionClassName,
        )}
      >
        {description}
      </p>
    ) : (
      description
    );

  const headerSection =
    badgeNode || titleNode || subtitleNode || descriptionNode ? (
      <div className={`space-y-3${flexBody ? " flex flex-col" : ""}`}>
        {badge && <div>{badgeNode}</div>}
        {title && <div className="space-y-2">{titleNode}</div>}
        {subtitle && <div>{subtitleNode}</div>}
        {description && <div>{descriptionNode}</div>}
      </div>
    ) : null;

  const bodyContent = children ? (
    <div
      className={classNames(
        padding === "none" ? "" : "space-y-3 leading-6",
        // min-h-0 lets this flex item shrink below its content height, so
        // height-constrained parents (e.g. a fullHeight Table) actually clip
        // and scroll instead of stretching the panel.
        flexBody ? "flex-1 flex flex-col w-full min-h-0" : "",
        isOverlay ? "text-white/80" : surfaceText.body,
        bodyClassName,
      )}
      style={bodyStyle}
    >
      {children}
    </div>
  ) : null;

  const bodySection = bodyContent ? (
    <div
      className={classNames(
        flexBody ? "flex-1 flex flex-col w-full" : "",
        "min-h-0 flex-1",
        scrollable
          ? "overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent"
          : "",
        padding === "none" ? "" : "pr-1",
      )}
    >
      {bodyContent}
    </div>
  ) : null;

  const actionsSection =
    actions && actions.length > 0 ? (
      <div
        className={classNames(
          "flex pt-3",
          actionWrapperLayout[actionLayout],
          bodySection ? "mt-auto" : "mt-4",
        )}
      >
        {actions.map((action, index) => {
          const {
            id,
            label,
            className: actionClassName,
            color,
            size,
            ...buttonProps
          } = action;
          const key = id ?? `${index}`;
          const responsiveWidth = actionButtonWidth[actionLayout];

          return (
            <Button
              key={key}
              color={color ?? defaultActionColor}
              size={size ?? "md"}
              className={classNames(responsiveWidth, actionClassName)}
              {...buttonProps}
            >
              {label}
            </Button>
          );
        })}
      </div>
    ) : null;

  const mediaTopNode =
    hasMedia && mediaPlacement === "top" ? (
      <div className="overflow-hidden">{media}</div>
    ) : null;

  const mediaSideNode =
    hasMedia && (mediaPlacement === "start" || mediaPlacement === "end") ? (
      <div className="w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10 sm:w-1/3 sm:min-w-[14rem]">
        {media}
      </div>
    ) : null;

  const showSkeleton = loading && loaderType === "skeleton";

  const skeletonSection = showSkeleton ? (
    <PanelSkeleton
      hasMedia={hasMedia && mediaPlacement !== "overlay"}
      hasBadge={Boolean(badge)}
      hasTitle={Boolean(title)}
      hasSubtitle={Boolean(subtitle)}
      hasDescription={Boolean(description)}
      hasBody={Boolean(children)}
      actionCount={actions?.length ?? 0}
      lines={skeletonLines}
      actionLayout={actionLayout}
    />
  ) : null;

  const contentSection = (() => {
    if (skeletonSection) {
      return skeletonSection;
    }

    if (mediaPlacement === "start" || mediaPlacement === "end") {
      return (
        <div
          className={classNames(
            "flex min-h-0 flex-1 flex-col gap-6 sm:flex-row",
            mediaPlacement === "end" ? "sm:flex-row-reverse" : "sm:flex-row",
            hasMedia ? "sm:items-start" : undefined,
          )}
        >
          {mediaSideNode}
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            {headerSection}
            {bodySection}
            {actionsSection}
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {mediaTopNode}
        {headerSection}
        {bodySection}
        {actionsSection}
      </div>
    );
  })();

  // Published so nested content — FormField hints, dividers, anything using
  // `useSurfaceText` — knows whether it is sitting on a see-through card.
  return (
    <SurfaceProvider variant={variant}>
      <section
        ref={ref}
        className={classNames(
          "relative flex w-full min-h-0 flex-col overflow-hidden shrink-0",
          !isOverlay && surfaceText.body,
          variantClasses,
          getSurfacePaddingClass(padding),
          getSurfaceCornerClass(corner),
          fullWidth ? "w-full" : undefined,
          isOverlay ? overlayClasses : undefined,
          hoverShadow &&
            "transition-shadow duration-200 hover:shadow-xl hover:-translate-y-[1px]",
          isHoverable && "group cursor-pointer",
          isHoverable &&
            hoverColorName &&
            `hover:bg-${hoverColorName}-50 dark:hover:bg-${hoverColorName}-900/20`,
          className,
        )}
        style={resolvedStyle}
        data-variant={variant}
        data-tone={tone}
        aria-busy={loading}
        {...rest}
      >
        {isOverlay && !showSkeleton && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-full">{media}</div>
            </div>
            <div
              className={classNames(
                "pointer-events-none absolute inset-0 bg-gradient-to-br",
                palette.overlayGradient,
              )}
            />
          </>
        )}
        {showDecorationGradient && (
          <div
            className={classNames(
              "pointer-events-none absolute inset-0 bg-gradient-to-br",
              palette.decorationGradient,
              isHoverable &&
                "transition-opacity duration-200 group-hover:opacity-50",
            )}
            aria-hidden="true"
          />
        )}
        {showDecorationShapes && (
          <>
            <div
              className={classNames(
                "pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-50",
              )}
              aria-hidden="true"
            />
            <div
              className={classNames(
                "pointer-events-none absolute -left-8 -bottom-10 w-36 h-36 rounded-full opacity-70",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-40",
              )}
              aria-hidden="true"
            />
            <div
              className={classNames(
                "pointer-events-none absolute right-10 bottom-8 w-16 h-16 rounded-full opacity-50",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-25",
              )}
              aria-hidden="true"
            />
          </>
        )}
        {isHoverable && !hoverColorName && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-transparent transition-colors duration-200 group-hover:bg-black/[0.025] dark:group-hover:bg-white/[0.04]"
            aria-hidden="true"
          />
        )}
        {isGlass && resolvedSpecularMode !== "none" && (
          <>
            {resolvedSpecularMode === "classic" && (
              <>
                {/* Bright top edge — the bevel that sells the surface as glass. */}
                <div
                  className={classNames(
                    "pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit]",
                    "bg-gradient-to-r from-transparent via-white/60 to-transparent",
                    "dark:via-white/20",
                  )}
                  aria-hidden="true"
                />
                {/* Light falling across the upper third, so the fill is not flat. */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[inherit] bg-gradient-to-b from-white/25 to-transparent dark:from-white/5"
                  aria-hidden="true"
                />
              </>
            )}
            {resolvedSpecularMode === "halo" && (
              <>
                {/* One full-bleed layer per mode — see SURFACE_HALO_LIGHT. */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] dark:hidden"
                  style={{ backgroundImage: SURFACE_HALO_LIGHT }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 hidden rounded-[inherit] dark:block"
                  style={{ backgroundImage: SURFACE_HALO_DARK }}
                  aria-hidden="true"
                />
                {/* Same bevel the classic mode draws — 1px, so it cannot seam. */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit] bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
                  aria-hidden="true"
                />
              </>
            )}
          </>
        )}
        <div
          className={classNames(
            "relative z-10 flex min-h-0 flex-1 flex-col gap-4",
            isOverlay && "backdrop-blur-sm",
          )}
        >
          {disabled && (
            <div
              className="absolute inset-0 z-10 bg-white/70 dark:bg-neutral-900/70"
              aria-hidden="true"
            />
          )}
          {contentSection}
        </div>
        {loading && !showSkeleton && (
          <Loader
            overlay
            variant={loaderType as Exclude<LoaderProps["variant"], undefined>}
            title={loaderTitle}
            label={loaderMessage}
            progress={loaderProgress}
            color={loaderColor}
          />
        )}
      </section>
    </SurfaceProvider>
  );
});

Panel.displayName = "Panel";

export default Panel;

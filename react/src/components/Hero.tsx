import React from "react";
import classNames from "classnames";

import Panel, { type PanelDecoration } from "./Panel";
import { CustomIcon } from "./CustomIcon";
import { useSurfaceText } from "../contexts/SurfaceContext";
import {
  DEFAULT_SURFACE_CORNER,
  SURFACE_VARIANTS,
  getGlowTokens,
  getSurfaceCornerClass,
  getSurfacePaddingClass,
  resolveGlowGradient,
  type ControlSize,
  type GlowIntensity,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";
import { type IconName } from "../icons/registry";

/**
 * Every container surface, plus the saturated `gradient` band that is the
 * component's own reason to exist — the same shape `EmptyState` uses for its
 * extra `plain`.
 */
export const HERO_VARIANTS = [...SURFACE_VARIANTS, "gradient"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

/** The shared control scale. Both were bespoke unions, and the subtitle's was
 *  truncated to three members, so a hero could not be sized past `md`. */
export type HeroTitleSize = ControlSize;
export type HeroSubtitleSize = ControlSize;
/** The shared container padding scale. */
export type HeroPadding = SurfacePadding;

/** Elements a hero's title may be rendered as. */
export const HERO_TITLE_ELEMENTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
] as const;
export type HeroTitleElement = (typeof HERO_TITLE_ELEMENTS)[number];

export interface HeroProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  /** Main heading. */
  title: React.ReactNode;
  /** Supporting line under the title. */
  subtitle?: React.ReactNode;
  /**
   * What the title is rendered as. It was always a `<p>`, so a banner that
   * reads as the top of a page announced nothing to a screen reader.
   * @default "p"
   */
  titleAs?: HeroTitleElement;
  /** Registry icon name, or a node. Omit it and the slot is not drawn. */
  icon?: IconName | React.ReactElement;
  /** @default "blue" */
  tone?: TrueColor;
  /** Alias for `tone`, matching the rest of the kit. */
  color?: TrueColor;
  /** @default "gradient" */
  variant?: HeroVariant;
  /** @default "sm" */
  titleSize?: HeroTitleSize;
  /** @default "xs" */
  subtitleSize?: HeroSubtitleSize;
  /** @default "sm" */
  padding?: HeroPadding;
  /** Corner radius on the shared container scale. */
  corner?: SurfaceCorner;
  /** @deprecated Use `corner`. Ignored when `corner` is set. */
  rounded?: boolean;
  /**
   * Decorative layer inside the banner: floating circles, a diagonal wash,
   * both, or neither. @default "both"
   */
  decoration?: PanelDecoration;
  /** Start colour of the gradient. Defaults to the tone's 700 shade. */
  gradientFrom?: string;
  /** End colour of the gradient. Defaults to the tone's 800 shade. */
  gradientTo?: string;
  /** Halo behind the banner. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** Glass fill transparency, for the see-through variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the see-through variants. */
  specularMode?: SpecularMode;
}

const TITLE_SIZES: Record<ControlSize, string> = {
  xs: "text-xs font-bold",
  sm: "text-sm font-bold",
  md: "text-base font-bold",
  lg: "text-lg font-semibold",
  xl: "text-xl font-semibold",
};

const SUBTITLE_SIZES: Record<ControlSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

/** Icon chip, scaled with the title rather than pinned at 48px. */
const CHIP_SIZES: Record<ControlSize, { box: string; glyph: number }> = {
  xs: { box: "h-8 w-8", glyph: 16 },
  sm: { box: "h-10 w-10", glyph: 18 },
  md: { box: "h-12 w-12", glyph: 22 },
  lg: { box: "h-14 w-14", glyph: 26 },
  xl: { box: "h-16 w-16", glyph: 30 },
};

interface HeroBodyProps
  extends Pick<
    HeroProps,
    "title" | "subtitle" | "titleAs" | "icon" | "titleSize" | "subtitleSize"
  > {
  /** The gradient band paints its own white copy; a surface does not. */
  onGradient: boolean;
}

/**
 * Split out so it can read `useSurfaceText()` — a component cannot consume a
 * provider it renders itself, and the copy on every non-gradient variant has
 * to come from the surface. The old version hardcoded `text-white` on all of
 * them.
 */
const HeroBody: React.FC<HeroBodyProps> = ({
  title,
  subtitle,
  titleAs = "p",
  icon,
  titleSize = "sm",
  subtitleSize = "xs",
  onGradient,
}) => {
  const surfaceText = useSurfaceText();
  const chip = CHIP_SIZES[titleSize] ?? CHIP_SIZES.sm;
  const Title = titleAs;

  const iconNode = icon ? (
    typeof icon === "string" ? (
      <CustomIcon
        icon={icon as IconName}
        customSize={chip.glyph}
        className={onGradient ? "text-white" : surfaceText.heading}
      />
    ) : (
      icon
    )
  ) : null;

  return (
    <div className="relative flex items-center gap-4">
      {iconNode && (
        <div
          className={classNames(
            "flex shrink-0 items-center justify-center rounded-xl border shadow-inner backdrop-blur-sm",
            chip.box,
            onGradient
              ? "border-white/20 bg-white/15"
              : "border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/10",
          )}
        >
          {iconNode}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Title
          className={classNames(
            "leading-tight",
            TITLE_SIZES[titleSize] ?? TITLE_SIZES.sm,
            onGradient ? "text-white" : surfaceText.heading,
          )}
        >
          {title}
        </Title>
        {subtitle && (
          <p
            className={classNames(
              "mt-0.5 leading-relaxed",
              SUBTITLE_SIZES[subtitleSize] ?? SUBTITLE_SIZES.xs,
              onGradient ? "text-white/75" : surfaceText.description,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * A banner: an icon, a heading and a supporting line, on a saturated gradient
 * or on any of the kit's container surfaces.
 *
 * The gradient stops are the tone's **700 and 800** shades, read from
 * Tailwind's own palette variables. They used to be a hand-written table of 21
 * pairs in which every tone bled into its neighbour — `sky` painted
 * sky→indigo, `red` painted red→rose — and the light end sat at `-400`, where
 * the white copy this component insists on measures 2.94:1 on yellow. White on
 * `{tone}-700` is the kit's measured floor at 4.93:1.
 */
const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  titleAs = "p",
  icon,
  tone,
  color,
  variant = "gradient",
  titleSize = "sm",
  subtitleSize = "xs",
  padding = "sm",
  corner,
  rounded = true,
  decoration = "both",
  gradientFrom,
  gradientTo,
  glowIntensity = "soft",
  glassOpacity,
  vibrancy,
  specularMode,
  className,
  ...rest
}) => {
  const accent = tone ?? color ?? "blue";
  const effectiveCorner: SurfaceCorner =
    corner ?? (rounded ? DEFAULT_SURFACE_CORNER : "none");

  const showShapes = decoration === "shapes" || decoration === "both";
  const showGradient = decoration === "gradient" || decoration === "both";

  const body = (
    <HeroBody
      title={title}
      subtitle={subtitle}
      titleAs={titleAs}
      icon={icon}
      titleSize={titleSize}
      subtitleSize={subtitleSize}
      onGradient={variant === "gradient"}
    />
  );

  if (variant !== "gradient") {
    // Every other variant is a Panel, which brings its own fill, ring, glass
    // props and the surface context the copy reads from.
    return (
      <Panel
        className={classNames("w-full", className)}
        variant={variant}
        tone={accent}
        corner={effectiveCorner}
        padding={padding}
        decoration={decoration}
        glassOpacity={glassOpacity}
        vibrancy={vibrancy}
        specularMode={specularMode}
        scrollable={false}
        {...rest}
      >
        {body}
      </Panel>
    );
  }

  const glow = getGlowTokens(glowIntensity);
  // The tone's own palette variables rather than a literal class pair, so a
  // tone can never be missing and no two tones can drift apart.
  const [from, to] = resolveGlowGradient(accent, gradientFrom, gradientTo);
  const [stopFrom, stopTo] = [
    gradientFrom ?? `var(--color-${accent}-700)`,
    gradientTo ?? `var(--color-${accent}-800)`,
  ];

  return (
    <div className={classNames("relative w-full", glow.pad)}>
      {/* Halo behind the band. Inset inside the reserved padding so an
          ancestor with `overflow: auto` cannot clip it — the same rule the
          gradient inputs follow. */}
      <div
        aria-hidden="true"
        className={classNames(
          "pointer-events-none absolute rounded-[inherit]",
          glow.inset,
          glow.blur,
        )}
        style={{
          background: `linear-gradient(to right, ${from}, ${to})`,
          opacity: glow.idleOpacity,
        }}
      />
      <div
        className={classNames(
          "relative flex items-center gap-4 overflow-hidden shadow-lg",
          getSurfacePaddingClass(padding),
          getSurfaceCornerClass(effectiveCorner),
          className,
        )}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${stopFrom}, ${stopTo})`,
        }}
        data-variant="gradient"
        data-tone={accent}
        {...rest}
      >
        {showShapes && (
          <>
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-8 -bottom-10 h-36 w-36 rounded-full bg-white/10 opacity-70"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-10 bottom-8 h-16 w-16 rounded-full bg-white/10 opacity-50"
              aria-hidden="true"
            />
          </>
        )}
        {showGradient && (
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 to-transparent"
            aria-hidden="true"
          />
        )}
        <div className="relative min-w-0 flex-1">{body}</div>
      </div>
    </div>
  );
};

Hero.displayName = "Hero";

export default Hero;

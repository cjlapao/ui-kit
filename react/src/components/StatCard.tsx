import { getSurfaceAccentColor } from "../theme/Theme";
import type { SurfaceTone } from "../theme/Theme";
import React, { useState } from "react";
import classNames from "classnames";
// Direct, not `from "."`: the barrel re-exports StatCard, so going through
// it makes this a cycle — and a partially-initialised barrel is what produces
// "does not provide an export named default" under HMR.
import Panel from "./Panel";
import Popover from "./Popover";
import StatTileDrilldownPanel, {
  type StatCardDrilldown,
  type StatCardDrilldownItem,
} from "./StatTileDrilldownPanel";
import { Pill } from "./Pill";
import { CustomIcon } from "./CustomIcon";
import ProgressSpinner from "./ProgressSpinner";
import Progress from "./Progress";
import Button from "./Button";
import StatPager, { type StatPagerPlacement } from "./StatPager";
import { usePager } from "../hooks/usePager";
import { type IconName } from "../icons/registry";
import {
  getPillColorClasses,
  getStatTileColorClasses,
  getSurfaceTextTokens,
  type ControlSize,
  type TrueColor,
} from "../theme";
import type {
  PanelVariant,
  PanelCorner,
  PanelPadding,
  PanelDecoration,
} from "./Panel";

/**
 * The shared control scale. `xs` and `xl` are the new extremes; `sm`, `md` and
 * `lg` keep exactly the metrics they had before the widening.
 */
export type StatCardSize = ControlSize;

export interface StatCardTrend {
  value: string | number;
  direction: "up" | "down" | "neutral";
  /** Caption under the value, e.g. "vs. last week". */
  label?: React.ReactNode;
}

/** A small icon + text item in the card's footer strip. */
export interface StatCardMeta {
  text: React.ReactNode;
  icon?: IconName;
}

/**
 * How `progress` is drawn: the corner spinner, or a full-width bar pinned to
 * the bottom of the card.
 */
export const STAT_CARD_PROGRESS_TYPES = ["spinner", "bar"] as const;
export type StatCardProgressType = (typeof STAT_CARD_PROGRESS_TYPES)[number];

/**
 * The kit's three loader treatments, with `skeleton` the default — a
 * placeholder shaped like the card keeps its height, where an overlay spinner
 * hides the layout and the grid reflows when the data lands.
 */
export const STAT_CARD_LOADERS = ["skeleton", "spinner", "progress"] as const;
export type StatCardLoader = (typeof STAT_CARD_LOADERS)[number];

/**
 * Where the icon sits against the card's title.
 *
 * `left` — the default — puts the icon before the title in one row, with the
 * title centred on the icon. `right` is the original treatment: the icon
 * pinned to the card's top-right, beside `actions`.
 */
export const STAT_CARD_ICON_PLACEMENTS = ["left", "right"] as const;
export type StatCardIconPlacement = (typeof STAT_CARD_ICON_PLACEMENTS)[number];

/**
 * @deprecated Use `progress` with `progressType="bar"`.
 */
export interface StatCardProgressBar {
  value: number;
  /** @default "Progress" */
  label?: React.ReactNode;
  /** Falls back to the card's own `tone`. */
  tone?: TrueColor;
}

/**
 * One page of a paged card.
 *
 * Every field overrides the card's own for as long as that page is showing;
 * anything left out falls back to the card. That is what lets a paged card be
 * built from a list of datasets without restating the surface, the icon or the
 * trend on each one.
 */
export interface StatCardPage {
  /** React key. Falls back to the index. */
  id?: string | number;
  /** Caption shown between the pager arrows. Falls back to the card's `label`. */
  title?: React.ReactNode;
  label?: React.ReactNode;
  value?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: IconName;
  trend?: StatCardTrend;
  /** Replaces the value block, as `body` does on the card. */
  body?: React.ReactNode;
  progress?: boolean | number;
  meta?: StatCardMeta[];
  footer?: React.ReactNode;
}

export interface StatCardError {
  message?: string;
  icon?: IconName;
  onRetry?: () => void;
  /** @default "Try Again" */
  retryLabel?: string;
}

export interface StatCardProps<
  T extends StatCardDrilldownItem = StatCardDrilldownItem,
> extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  icon?: IconName;
  /**
   * Tone of the icon chip. Falls back to the card's own `tone`, so a toned
   * card tints its chip without extra wiring.
   * @default tone ?? "neutral"
   */
  iconTone?: TrueColor;
  /**
   * Paints the toned chip (background + border) behind the icon. Off by
   * default: the icon renders bare, and `iconTone` then tints the glyph
   * itself — on a `gradient` card the glyph stays white.
   * @default false
   */
  iconBackground?: boolean;
  /**
   * Where the icon sits relative to the title. `left` renders it before the
   * title with the title centred on the icon; `right` pins it to the card's
   * top-right, beside `actions`.
   * @default "left"
   */
  iconPlacement?: StatCardIconPlacement;
  trend?: StatCardTrend;
  /** Overall scale. Label and value inherit it unless they override. */
  size?: StatCardSize;
  tone?: SurfaceTone;
  /**
   * Paints the surface with a dark diagonal `tone` gradient (950 → 800 → 700),
   * the PrimeVue showcase wash — dark enough that white copy and a light
   * spinner arc both read. On a translucent surface variant the stops step
   * down to 60% alpha so the backdrop blur stays visible. Switches the copy
   * to white. Defaults to "blue" when no `tone` is given.
   * @default false
   */
  gradient?: boolean;
  /**
   * Pins an indeterminate `ProgressSpinner` to the card's bottom-right
   * corner, tinted with the card's `tone` (blue when no `tone` is given) and
   * sized to the card's `size`. Pass a number for a determinate value instead
   * — it is clamped like `ProgressSpinner`'s own.
   * @default false
   */
  progress?: boolean | number;
  /** How `progress` is drawn. @default "spinner" */
  progressType?: StatCardProgressType;
  /** Caption for `progressType="bar"`. @default "Progress" */
  progressLabel?: React.ReactNode;
  /** Tone of the progress indicator. Falls back to the card's `tone`. */
  progressTone?: TrueColor;
  /**
   * Drives the progress from the card's own `value`, so a percentage metric
   * does not have to be written twice. A non-numeric `value` is ignored and
   * `progress` is used as given.
   * @default false
   */
  syncValueToProgress?: boolean;
  /** The Panel surface family. */
  variant?: PanelVariant;
  corner?: PanelCorner;
  /** Inner spacing, from the shared surface scale. @default "md" */
  padding?: PanelPadding;
  /**
   * Draws the card as the selected one — the surface rim plus a wash in the
   * selection's hue, exactly as `Panel` draws it.
   *
   * This is selection, not the pointer: `hoverEffect` keeps layering over it,
   * and a selected card that is also clicked stays selected-looking. Two things
   * differ from a bare `Panel`. A `gradient` card paints its own background,
   * which outranks the active wash the way `backgroundColor` does — the rim and
   * the glow still say selected, and the wash is the one thing a dark card has
   * no room for. And a `StatCard` has no `disabled` of its own, so nothing ever
   * dims it. `data-active` is exposed for caller CSS.
   * @default false
   */
  active?: boolean;
  /**
   * The hue the selected state wears — its own, not the card's. Rim and wash
   * follow it together, so a blue KPI selected in amber reads as one decision
   * rather than as an amber outline around a blue fill. Omitted, it takes the
   * card's own `tone`, with the kit's blue as floor on an untoned card.
   * @default "auto" — the card's own `tone`
   */
  activeTone?: TrueColor;
  /**
   * The attention call: a glow that swells inward from the card's own rim, the
   * Pill's pulse at card scale — for a metric that is live, drifting, or simply
   * the one to look at. Inward is the point: the inset shadow is clipped to the
   * border-box and follows `corner`, so it never spills into the grid.
   *
   * `Panel` silences the pulse while `disabled`; a `StatCard` has no disabled
   * state, so a card asked to pulse pulses. Reduced-motion users get the static
   * inner glow instead of the swell, so *which* card matters still reads.
   * @default false
   */
  pulse?: boolean;
  /**
   * The hue the glow swells in. Urgency and brand are different messages: a
   * blue card can insist in rose without wearing rose. Omitted, the glow takes
   * the selection's hue, so a card that is both `active` and pulsing says both
   * things in one colour until this splits them.
   * @default "auto" — the active hue
   */
  pulseTone?: TrueColor;
  /**
   * Tints the value. Separate from `tone`, which drives the surface and the
   * icon chip — and now separate from `labelTone`, which it used to tint too.
   */
  valueTone?: TrueColor;
  /** Type scale for the value. Falls back to `size`. */
  valueSize?: StatCardSize;
  /** Tints the label. */
  labelTone?: TrueColor;
  /**
   * Type scale for the label. Falls back to `size`. The title reads from the
   * dedicated title scale (`LABEL_SIZE_TOKENS`), one step above the card's
   * copy scale; the subtitle keeps the copy scale.
   */
  labelSize?: StatCardSize;
  /** Secondary line under the value. */
  subtitle?: React.ReactNode;
  /** Controls rendered at the top-right, beside or instead of the icon. */
  actions?: React.ReactNode;
  /**
   * Replaces the value/trend block entirely with the card's own content — a
   * chart, a list, a gauge. `children` is additive; `body` is a replacement.
   */
  body?: React.ReactNode;
  /** @deprecated Use `progress` with `progressType="bar"`. */
  progressBar?: StatCardProgressBar;
  /** Small icon + text items above the footer. */
  meta?: StatCardMeta[];
  /** Free-form content below the meta strip. */
  footer?: React.ReactNode;
  /**
   * The card's background flourish, from `Panel`'s own decoration system —
   * a soft tone gradient, floating shapes, or both.
   *
   * This replaces a hand-rolled quarter-circle: a hard `rounded-bl-[100px]`
   * wash pinned to the top-right corner, which cut a visible arc across the
   * card and was silently implied by `icon`. `Panel` already draws a better
   * one, so the card no longer paints its own.
   * @default "none"
   */
  decoration?: PanelDecoration;
  /** @deprecated Boolean form of `decoration`; `true` means `"shapes"`. */
  withDecoration?: boolean;
  /**
   * Turns the card into a paged one: prev / next arrows with the current
   * page's title between them, and each page overriding the card's own
   * content while it shows.
   *
   * This started as `StatChartTile`'s dataset stepper. It belongs here, so
   * every Stat variant can page — a count tile through months, a goal tile
   * through teams, a health card through regions.
   */
  pages?: StatCardPage[];
  /** Controlled page index. Omit for uncontrolled paging. */
  page?: number;
  /** Fires whenever the visible page changes. */
  onPageChange?: (page: number) => void;
  /** Where the pager sits relative to the content. @default "top" */
  pagerPlacement?: StatPagerPlacement;
  /** Shows the `2 / 5` counter under the page title. @default true */
  showPageIndicator?: boolean;
  /** Wrap past the ends instead of stopping. @default false */
  loopPages?: boolean;
  /** Replaces the body with a failure message and an optional retry. */
  error?: StatCardError | null;
  /** Replaces the card's content with a loading treatment. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: StatCardLoader;
  /** @default "segments" */
  spinnerVariant?: "solid" | "segments";
  /** @default "normal" */
  spinnerThickness?: "thin" | "normal" | "thick";
  /** Falls back to the card's `tone`. */
  spinnerTone?: TrueColor;
  /** Makes the whole card activatable. Renders a real button wrapper. */
  onClick?: () => void;
  /** Lifts the card on hover. Only meaningful with `onClick` or `drilldown`. */
  hoverEffect?: boolean;
  /**
   * The list behind the card. Set it and the card click opens an anchored,
   * solid-surface dropdown whose rows stream in page by page from the app's
   * `fetchItems` — the tile IS the trigger (chevron-free, keyboard-complete,
   * lazy: nothing is fetched until first open). The card's `onClick` steps
   * aside while it is set: one click, one action; put navigation in
   * `onItemClick` or the `footer` instead.
   */
  drilldown?: StatCardDrilldown<T>;
  /**
   * Draw the card as a perfect square: its height follows its width. On a
   * wide stage, cap the width from the parent (or with `style`) and the tile
   * stays a square instead of stretching into a banner.
   * @default false
   */
  square?: boolean;
  /**
   * Free-form content (a chart, a spinner, a sparkline) rendered in a
   * flexible slot after the value and trend.
   */
  children?: React.ReactNode;
}

const SIZE_TOKENS: Record<
  StatCardSize,
  {
    value: string;
    label: string;
    chip: string;
    icon: ControlSize;
    pill: ControlSize;
    ecg: number;
  }
> = {
  xs: {
    value: "text-lg",
    label: "text-xs",
    chip: "h-7 w-7 rounded-md",
    icon: "xs",
    pill: "xs",
    ecg: 36,
  },
  sm: {
    value: "text-xl",
    label: "text-xs",
    chip: "h-8 w-8 rounded-md",
    icon: "sm",
    pill: "xs",
    ecg: 44,
  },
  md: {
    value: "text-3xl",
    label: "text-sm",
    chip: "h-9 w-9 rounded-lg",
    icon: "md",
    pill: "sm",
    ecg: 60,
  },
  lg: {
    value: "text-4xl",
    label: "text-sm",
    chip: "h-11 w-11 rounded-lg",
    icon: "lg",
    pill: "md",
    ecg: 72,
  },
  xl: {
    value: "text-5xl",
    label: "text-sm",
    chip: "h-12 w-12 rounded-xl",
    icon: "lg",
    pill: "md",
    ecg: 80,
  },
};

/**
 * The title's own type scale.
 *
 * The title used to share the card's copy scale with the subtitle, which read
 * small on a card whose whole point is the metric. It now steps a size above
 * the copy scale at every `size`; `labelSize` indexes this same table, so an
 * explicit choice never lands smaller than the default it replaces. The
 * subtitle stays on the copy scale, which is what keeps it a subtitle.
 */
const LABEL_SIZE_TOKENS: Record<StatCardSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
  xl: "text-lg",
};

const TREND_TONES: Record<StatCardTrend["direction"], TrueColor> = {
  up: "emerald",
  down: "rose",
  neutral: "slate",
};

const TREND_ICONS: Record<StatCardTrend["direction"], IconName> = {
  up: "ArrowUp",
  down: "ArrowDown",
  neutral: "Equal",
};

const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

/**
 * The surfaces whose fill *is* a tint of the tone (or a translucent glass).
 * The opaque `border-{c}-200 dark:border-{c}-800` hairline is the same hue
 * one step off those backgrounds, so it sank into them — a neutral tonal
 * card showed almost no line at all. On these variants the footer divider
 * takes the alpha pair instead, which reads on any fill.
 */
const TONED_SURFACE_VARIANTS: readonly PanelVariant[] = [
  "subtle",
  "tonal",
  "glass",
  "simple",
  "liquid-glass",
];

const isEmpty = (node: React.ReactNode): boolean =>
  node == null || node === "" || node === false;

// Generic in the drilldown item type so `renderItem`/`onItemClick` see the
// app's own fields, not just the built-in row's. Consumers that pass no
// `drilldown` (every tile in the family, all existing pages) get the default
// item type and identical inference to the old non-generic `React.FC`.
const StatCard = <T extends StatCardDrilldownItem = StatCardDrilldownItem>({
  label: labelProp,
  value: valueProp,
  icon: iconProp,
  iconTone,
  iconBackground = false,
  iconPlacement = "left",
  trend: trendProp,
  size = "md",
  tone: surfaceTone = "none",
  gradient = false,
  progress: progressProp = false,
  progressType = "spinner",
  progressLabel,
  progressTone,
  syncValueToProgress = false,
  variant,
  corner = "rounded-lg",
  padding = "md",
  active = false,
  activeTone,
  pulse = false,
  pulseTone,
  valueTone,
  valueSize,
  labelTone,
  labelSize,
  subtitle: subtitleProp,
  actions,
  body: bodyProp,
  progressBar,
  meta: metaProp,
  footer: footerProp,
  decoration = "none",
  withDecoration,
  pages,
  page,
  onPageChange,
  pagerPlacement = "top",
  showPageIndicator = true,
  loopPages = false,
  error,
  loading = false,
  loaderType = "skeleton",
  spinnerVariant = "segments",
  spinnerThickness = "normal",
  spinnerTone,
  onClick,
  hoverEffect = false,
  drilldown,
  square = false,
  className,
  style,
  children,
  ...rest
}: StatCardProps<T>) => {
  const tone = getSurfaceAccentColor(surfaceTone);

  // ── Drilldown ─────────────────────────────────────────────────────────────
  // The card is the trigger: one state, one action per click. `onClick` steps
  // aside while `drilldown` is set (documented on the prop) so a click can
  // never both navigate and open — and Popover's trigger clone finds no
  // handler of its own to chain on the card.
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const hasDrilldown = !!drilldown;
  const activatable = !!onClick || hasDrilldown;
  const activate = () => {
    if (hasDrilldown) {
      // Keyboard path — the click path runs through Popover's
      // `onVisibleChange` instead. Both must report, or `onOpenChange`
      // would lie about Enter/Space opens.
      const next = !drilldownOpen;
      setDrilldownOpen(next);
      drilldown.onOpenChange?.(next);
    } else onClick?.();
  };
  // ── Paging ────────────────────────────────────────────────────────────────
  // The index lives in `usePager`, shared with `PagedPanel`, so the clamping
  // and the end conditions cannot drift between the two.
  const pager = usePager({
    count: pages?.length ?? 0,
    page,
    onPageChange,
    loop: loopPages,
  });
  const activePage = pages && pages.length > 0 ? pages[pager.page] : undefined;
  const isPaged = !!activePage;
  // Each page overrides the card for as long as it shows; anything it leaves
  // out falls back to the card, so a list of datasets does not have to restate
  // the surface, the icon or the trend on every entry.
  const label = activePage?.label ?? labelProp;
  const value = activePage?.value ?? valueProp;
  const icon = activePage?.icon ?? iconProp;
  const trend = activePage?.trend ?? trendProp;
  const subtitle = activePage?.subtitle ?? subtitleProp;
  const body = activePage?.body ?? bodyProp;
  const meta = activePage?.meta ?? metaProp;
  const footer = activePage?.footer ?? footerProp;
  const progress = activePage?.progress ?? progressProp;
  const pagerTitle = activePage?.title ?? (activePage?.label ? undefined : label);

  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  // Label and value carry their own scale, falling back to the card's.
  const valueTokens = SIZE_TOKENS[valueSize ?? size] ?? tokens;
  const labelTokens = SIZE_TOKENS[labelSize ?? size] ?? tokens;
  // The title reads from its own scale — the copy scale made it read small.
  const titleScale = LABEL_SIZE_TOKENS[labelSize ?? size] ?? LABEL_SIZE_TOKENS.md;
  const hasLabel = !isEmpty(label);
  const hasValue = !isEmpty(value);
  const hasIcon = !!icon;
  const hasTrend = !!trend;
  const hasHeader = hasLabel || hasIcon || !isEmpty(actions);
  const hasErrorEarly = !!error;
  /**
   * `syncValueToProgress` reads the percentage off the card's own `value`, so
   * a metric that *is* a percentage does not have to be written twice. A
   * non-numeric value falls back to whatever `progress` was given.
   */
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value.replace("%", "")))
        ? Number(value.replace("%", ""))
        : undefined;
  const syncedProgress =
    syncValueToProgress && numericValue !== undefined ? numericValue : undefined;
  const progressValue =
    syncedProgress ?? (typeof progress === "number" ? progress : undefined);
  const hasProgress =
    progress === true || typeof progress === "number" || syncedProgress !== undefined;
  // `progressBar` is the old shape; it implies the bar.
  const hasProgressBarLegacy = !!progressBar;
  const showProgressBar =
    !hasErrorEarly && (progressType === "bar" || hasProgressBarLegacy) && (hasProgress || hasProgressBarLegacy);
  const showProgressSpinner =
    !hasErrorEarly && hasProgress && progressType === "spinner" && !progressBar;

  const hasSubtitle = !isEmpty(subtitle);
  const hasBody = !isEmpty(body);
  const hasError = !!error;
  const hasMeta = !!meta && meta.length > 0;
  const hasFooter = !isEmpty(footer);
  // `decoration` is implied by `icon` so the Stat tiles, which never set it
  // explicitly, keep the washed corner they have always drawn.
  // `withDecoration` is the old boolean.
  const resolvedDecoration: PanelDecoration =
    withDecoration === true ? "shapes" : withDecoration === false ? "none" : decoration;
  const statTokens = getStatTileColorClasses(tone ?? "neutral");

  const chipTokens = getPillColorClasses(iconTone ?? tone ?? "neutral", "soft");
  const iconColor = iconTone ?? tone ?? "neutral";
  const trendTone = trend ? (TREND_TONES[trend.direction] ?? "slate") : "slate";

  const gradientTone = tone ?? "blue";
  // A translucent Panel already composites over the page, so a full-strength
  // wash would bury it — on those the stops step down to 60% alpha, the same
  // trick the glass fills use. The inline `background` overrides the variant's
  // own fill while its shadow, ring and blur stay intact.
  const translucentSurface = getSurfaceTextTokens(
    variant ?? "elevated",
  ).translucent;
  const gradientStop = (shade: "700" | "800" | "950") =>
    translucentSurface
      ? `color-mix(in srgb, var(--color-${gradientTone}-${shade}) 60%, transparent)`
      : `var(--color-${gradientTone}-${shade})`;
  // A dark three-stop wash for every tone: the lightest stop (700) still sits
  // deep enough that white copy and a `-400` spinner arc keep their contrast.
  const gradientBackground = gradient
    ? `linear-gradient(135deg, ${gradientStop("950")}, ${gradientStop("800")} 50%, ${gradientStop("700")})`
    : undefined;
  const onGradient = Boolean(gradientBackground);

  const titleClass = classNames(
    // `leading-none` after the size class: Tailwind's `text-*` ships its own
    // line-height, and a line box is glyphs-plus-descender-space — centring
    // that on the icon puts the visible copy low. With no half-leading the
    // title's box *is* its glyphs, so `items-center` lands true at any title
    // size against any icon size.
    "min-w-0 font-medium leading-none",
    onGradient
      ? "text-white/80"
      : labelTone
        ? `text-${labelTone}-600 dark:text-${labelTone}-400`
        : "text-neutral-500 dark:text-neutral-400",
    titleScale,
  );

  /**
   * The icon with or without its chip. With the chip off, the tone tints the
   * glyph itself, so `iconTone` keeps meaning — there is just no background
   * left for it.
   */
  const iconNode = hasIcon ? (
    iconBackground ? (
      <span
        className={classNames(
          "inline-flex flex-none items-center justify-center",
          tokens.chip,
          onGradient
            ? "bg-white/20 text-white"
            : classNames(chipTokens.base, chipTokens.border),
        )}
      >
        <CustomIcon icon={icon} size={tokens.icon} />
      </span>
    ) : (
      <span
        className={classNames(
          "flex-none",
          onGradient
            ? "text-white"
            : `text-${iconColor}-600 dark:text-${iconColor}-400`,
        )}
      >
        <CustomIcon icon={icon} size={tokens.icon} />
      </span>
    )
  ) : null;

  /**
   * The hairline above the meta/footer strip. Opaque `-200/-800` on the
   * plain surfaces, where it sits on paper; the alpha pair on the toned
   * variants, where that hairline is the same hue as the fill one step off
   * and disappears (a neutral tonal card showed almost no line at all).
   */
  const dividerClass = onGradient
    ? "border-white/20"
    : variant && TONED_SURFACE_VARIANTS.includes(variant)
      ? `border-${tone ?? "neutral"}-400/40 dark:border-${tone ?? "neutral"}-500/40`
      : statTokens.divider;

  const skeleton = (
    <div className="flex min-w-0 flex-1 flex-col gap-3" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        {iconPlacement === "left" ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {hasIcon && (
              <div
                className={classNames(
                  SKELETON,
                  iconBackground ? tokens.chip : "h-4 w-4 rounded",
                )}
              />
            )}
            <div className={classNames(SKELETON, "h-3 w-24 rounded")} />
          </span>
        ) : (
          <>
            <div className={classNames(SKELETON, "h-3 w-24 rounded")} />
            {hasIcon && (
              <div
                className={classNames(
                  SKELETON,
                  iconBackground ? tokens.chip : "h-4 w-4 rounded",
                )}
              />
            )}
          </>
        )}
      </div>
      <div className={classNames(SKELETON, "h-8 w-2/3 rounded")} />
      {hasSubtitle && <div className={classNames(SKELETON, "h-3 w-1/2 rounded")} />}
      {(showProgressBar || hasProgressBarLegacy) && (
        <div className={classNames(SKELETON, "mt-auto h-2 w-full rounded-full")} />
      )}
    </div>
  );

  const card = (
    // A metric card is content-sized, so the Panel body must not scroll:
    // a 4px line-height rounding in the flex chain otherwise grows a
    // scrollbar, and the vertical bar then eats the width and a second,
    // horizontal one appears.
    <Panel
      variant={variant}
      tone={surfaceTone}
      corner={corner}
      padding={padding}
      decoration={resolvedDecoration}
      active={active}
      activeTone={activeTone}
      pulse={pulse}
      pulseTone={pulseTone}
      loading={loading && loaderType !== "skeleton"}
      loaderType={loaderType === "skeleton" ? "spinner" : loaderType}
      loaderColor={spinnerTone ?? tone ?? "blue"}
      loaderProgress={progressValue}
      flexBody
      scrollable={false}
      data-gradient={onGradient || undefined}
      style={
        gradientBackground ? { ...style, background: gradientBackground } : style
      }
      onClick={hasDrilldown ? undefined : onClick}
      role={activatable ? "button" : undefined}
      tabIndex={activatable ? 0 : undefined}
      onKeyDown={
        activatable
          ? (event) => {
              // A `div` with a click handler is not a button: without this a
              // keyboard user could focus the card and never activate it.
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate();
              }
            }
          : undefined
      }
      className={classNames(
        "flex flex-col",
        square && "aspect-square",
        activatable && "cursor-pointer",
        activatable && !hoverEffect && "hover:shadow-md",
        activatable && hoverEffect && "hover:-translate-y-1 hover:shadow-lg",
        "transition-all duration-200",
        className,
      )}
      {...rest}
    >
      {/*
        `flex-1`, not `h-full`: the card's height often comes from a
        min-height, which browsers treat as indefinite for percentage
        resolution, so `h-full` here would silently fall back to the
        content height and the flex children could never pin to the edge.
      */}
      {loading && loaderType === "skeleton" ? (
        skeleton
      ) : (
      <div className="flex min-w-0 flex-1 flex-col">
        {hasHeader &&
          (iconPlacement === "left" ? (
            // Icon then title, as one row centred on the icon; `actions`
            // still pin to the right edge. The title carries `leading-none`
            // (see `titleClass`): a line box is glyphs-plus-descender-space,
            // so centring it on the icon puts the visible copy low — with no
            // half-leading the title's box *is* its glyphs, and
            // `items-center` lands true at any title size against any icon
            // size.
            <div className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 flex-1 items-center gap-2 leading-none">
                {iconNode}
                {hasLabel && <span className={titleClass}>{label}</span>}
              </span>
              {!isEmpty(actions) && (
                <span className="flex flex-none items-center gap-1">
                  {actions}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              {hasLabel ? (
                <span className={titleClass}>{label}</span>
              ) : (
                <span />
              )}
              <span className="flex flex-none items-center gap-1">
                {!isEmpty(actions) && actions}
                {iconNode}
              </span>
            </div>
          ))}

        {isPaged && pagerPlacement === "top" && (
          <StatPager
            pager={pager}
            label={pagerTitle}
            size={size}
            tone={progressTone ?? tone ?? "blue"}
            showIndicator={showPageIndicator}
            onGradient={onGradient}
            className={"pt-3"}
          />
        )}

        {hasError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-2 text-center">
            {error!.icon && (
              <CustomIcon
                icon={error!.icon}
                size="md"
                className="text-rose-500 dark:text-rose-400"
              />
            )}
            <p
              className={classNames(
                "text-sm",
                onGradient ? "text-white/80" : "text-neutral-600 dark:text-neutral-400",
              )}
            >
              {error!.message || "Failed to load data"}
            </p>
            {error!.onRetry && (
              // Was a bare `<button className="text-blue-600 …">` with a
              // hardcoded blue and no dark-mode partner.
              <Button
                variant="link"
                size="xs"
                color={tone ?? "blue"}
                onClick={(event) => {
                  event.stopPropagation();
                  error!.onRetry?.();
                }}
              >
                {error!.retryLabel ?? "Try Again"}
              </Button>
            )}
          </div>
        ) : hasBody ? (
          <div className="flex min-h-0 flex-1 flex-col pt-2">{body}</div>
        ) : (
          hasValue && (
            <div
              className={classNames(
                "flex-1 self-start pt-2 font-semibold tracking-tight",
                onGradient
                  ? "text-white"
                  : valueTone
                    ? `text-${valueTone}-700 dark:text-${valueTone}-100`
                    : "text-neutral-900 dark:text-white",
                valueTokens.value,
              )}
            >
              {value}
            </div>
          )
        )}

        {!hasError && !hasBody && hasSubtitle && (
          <div
            className={classNames(
              "pt-1",
              labelTokens.label,
              onGradient ? "text-white/80" : "text-neutral-500 dark:text-neutral-400",
            )}
          >
            {subtitle}
          </div>
        )}

        {hasTrend && (
          <div
            className={classNames(
              "flex items-end justify-end pt-2",
              !hasValue && "mt-auto",
            )}
          >
            <Pill
              tone={trendTone}
              variant={onGradient ? "solid" : "soft"}
              size={tokens.pill}
              icon={<CustomIcon icon={TREND_ICONS[trend!.direction]} size="xs" />}
            >
              {trend!.value}
            </Pill>
          </div>
        )}

        {trend?.label && (
          <div
            className={classNames(
              "pt-1 text-right text-xs",
              onGradient ? "text-white/70" : "text-neutral-400 dark:text-neutral-500",
            )}
          >
            {trend.label}
          </div>
        )}


        {/*
          Destructured (not left in `rest`) on purpose: a JSX children
          expression wins over `children` in a spread prop, so leaving it in
          `rest` would let Panel silently swallow it.
        */}
        {(!isEmpty(children) || showProgressSpinner) && (
          <div
            className={classNames(
              // `pt-4`, not `pt-2`: the ring sits directly under the trend
              // pill and the two were touching.
              "flex min-h-0 flex-1 items-end gap-3 pt-4",
              isEmpty(children) && "justify-end",
            )}
          >
            {!isEmpty(children) && (
              <div className="min-w-0 flex-1">{children}</div>
            )}
            {showProgressSpinner && (
              <ProgressSpinner
                size={size}
                color={progressTone ?? gradientTone}
                value={progressValue}
                ariaLabel="Progress"
                valueClassName={onGradient ? "text-white" : undefined}
              />
            )}
          </div>
        )}

        {showProgressBar && (
          // A real `Progress`, so the bar is a labelled `role="progressbar"`
          // with an accessible name — the hand-rolled one in `StatTile` was two
          // nested divs with a percentage in a sibling span and no role at all.
          // `mt-auto` pins it to the bottom and it spans the full width, which
          // is the whole point of the bar rendering.
          <div className="mt-auto w-full pt-3">
            <Progress
              value={progressBar?.value ?? progressValue ?? 0}
              label={progressBar?.label ?? progressLabel ?? "Progress"}
              showValue
              size={size === "xs" || size === "sm" ? "xs" : "sm"}
              color={progressBar?.tone ?? progressTone ?? tone ?? "blue"}
              // The default neutral caption vanishes into a gradient wash.
              labelClassName={onGradient ? "text-white" : undefined}
              valueClassName={onGradient ? "text-white/80" : undefined}
            />
          </div>
        )}

        {isPaged && pagerPlacement === "bottom" && (
          <StatPager
            pager={pager}
            label={pagerTitle}
            size={size}
            tone={progressTone ?? tone ?? "blue"}
            showIndicator={showPageIndicator}
            onGradient={onGradient}
            className={"mt-auto pt-3"}
          />
        )}

        {(hasMeta || hasFooter) && !hasError && (
          <div
            className={classNames("mt-4 border-t pt-4", dividerClass)}
          >
            {hasMeta && (
              <div className="flex flex-wrap gap-3">
                {meta!.map((item, idx) => (
                  <div
                    key={idx}
                    className={classNames(
                      "flex items-center text-sm",
                      onGradient
                        ? "text-white/80"
                        : "text-neutral-600 dark:text-neutral-300",
                    )}
                  >
                    {item.icon && (
                      <CustomIcon
                        icon={item.icon}
                        size="sm"
                        className="mr-1.5 opacity-70"
                      />
                    )}
                    {item.text}
                  </div>
                ))}
              </div>
            )}
            {hasFooter && <div className={hasMeta ? "mt-2" : undefined}>{footer}</div>}
          </div>
        )}
      </div>
      )}


    </Panel>
  );

  if (!drilldown) return card;

  // The overlay owns the open motion, the viewport clamp and the outside
  // click; the panel owns the list. `bareTrigger` keeps the card a true
  // child of the consumer's grid — no wrapper box stealing the layout.
  return (
    <Popover
      trigger={card}
      bareTrigger
      visible={drilldownOpen}
      onOpenChange={(next) => {
        setDrilldownOpen(next);
        drilldown.onOpenChange?.(next);
      }}
      placement={drilldown.placement ?? "auto"}
      variant={drilldown.variant ?? "elevated"}
      corner={drilldown.corner ?? "rounded-sm"}
      padding={drilldown.padding ?? "none"}
      matchTriggerWidth={drilldown.matchTileWidth}
      width={drilldown.width}
      align={drilldown.align ?? "start"}
      arrow={drilldown.arrow ?? true}
      maxWidth={drilldown.maxWidth ?? 520}
    >
      <StatTileDrilldownPanel
        {...drilldown}
        open={drilldownOpen}
        tone={surfaceTone}
        title={drilldown.title ?? label}
      />
    </Popover>
  );
};

export default StatCard;

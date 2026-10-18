import React from "react";
import classNames from "classnames";
// Direct, not `from "."`: the barrel re-exports StatCard, so going through
// it makes this a cycle — and a partially-initialised barrel is what produces
// "does not provide an export named default" under HMR.
import Panel from "./Panel";
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

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  icon?: IconName;
  /**
   * Tone of the icon chip. Falls back to the card's own `tone`, so a toned
   * card tints its chip without extra wiring.
   * @default tone ?? "neutral"
   */
  iconTone?: TrueColor;
  trend?: StatCardTrend;
  /** Overall scale. Label and value inherit it unless they override. */
  size?: StatCardSize;
  tone?: TrueColor;
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
   * Tints the value. Separate from `tone`, which drives the surface and the
   * icon chip — and now separate from `labelTone`, which it used to tint too.
   */
  valueTone?: TrueColor;
  /** Type scale for the value. Falls back to `size`. */
  valueSize?: StatCardSize;
  /** Tints the label. */
  labelTone?: TrueColor;
  /** Type scale for the label. Falls back to `size`. */
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
  /** Lifts the card on hover. Only meaningful with `onClick`. */
  hoverEffect?: boolean;
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

const isEmpty = (node: React.ReactNode): boolean =>
  node == null || node === "" || node === false;

const StatCard: React.FC<StatCardProps> = ({
  label: labelProp,
  value: valueProp,
  icon: iconProp,
  iconTone,
  trend: trendProp,
  size = "md",
  tone,
  gradient = false,
  progress: progressProp = false,
  progressType = "spinner",
  progressLabel,
  progressTone,
  syncValueToProgress = false,
  variant,
  corner = "rounded-lg",
  padding = "md",
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
  className,
  style,
  children,
  ...rest
}) => {
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

  const skeleton = (
    <div className="flex min-w-0 flex-1 flex-col gap-3" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className={classNames(SKELETON, "h-3 w-24 rounded")} />
        {hasIcon && <div className={classNames(SKELETON, tokens.chip)} />}
      </div>
      <div className={classNames(SKELETON, "h-8 w-2/3 rounded")} />
      {hasSubtitle && <div className={classNames(SKELETON, "h-3 w-1/2 rounded")} />}
      {(showProgressBar || hasProgressBarLegacy) && (
        <div className={classNames(SKELETON, "mt-auto h-2 w-full rounded-full")} />
      )}
    </div>
  );

  return (
    // A metric card is content-sized, so the Panel body must not scroll:
    // a 4px line-height rounding in the flex chain otherwise grows a
    // scrollbar, and the vertical bar then eats the width and a second,
    // horizontal one appears.
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      decoration={resolvedDecoration}
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
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              // A `div` with a click handler is not a button: without this a
              // keyboard user could focus the card and never activate it.
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={classNames(
        "flex flex-col",
        onClick && "cursor-pointer",
        onClick && !hoverEffect && "hover:shadow-md",
        onClick && hoverEffect && "hover:-translate-y-1 hover:shadow-lg",
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
        {hasHeader && (
          <div className="flex items-start justify-between gap-3">
            {hasLabel ? (
              <span
                className={classNames(
                  "min-w-0 font-medium",
                  onGradient
                    ? "text-white/80"
                    : labelTone
                      ? `text-${labelTone}-600 dark:text-${labelTone}-400`
                      : "text-neutral-500 dark:text-neutral-400",
                  labelTokens.label,
                )}
              >
                {label}
              </span>
            ) : (
              <span />
            )}
            <span className="flex flex-none items-center gap-1">
              {!isEmpty(actions) && actions}
              {hasIcon && (
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
              )}
            </span>
          </div>
        )}

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
            className={classNames(
              "mt-4 border-t pt-4",
              onGradient ? "border-white/20" : statTokens.divider,
            )}
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
};

export default StatCard;

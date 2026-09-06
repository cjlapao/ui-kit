import classNames from "classnames";
import Button, { type ButtonVariant } from "./Button";
import Chart from "./chart";
import Panel, { SkeletonBar } from "./Panel";
import {
  getTrueColorDotClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";

/** One slice of the breakdown — its tone paints both the slice and the dot. */
export interface BreakdownItem {
  id: string;
  label: string;
  value: number;
  /** Shown instead of the raw value (a formatted count, a currency). */
  displayValue?: string;
  /** @default "blue" */
  tone?: TrueColor;
}

/** A label/value pair in the card's summary strip. */
export interface BreakdownStat {
  label: string;
  value: string;
}

export interface BreakdownCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  title: string;
  /** Small copy under the title. */
  caption?: string;
  items: BreakdownItem[];
  /** Summary strip along the bottom — totals that outlive the filter. */
  stats?: BreakdownStat[];
  ctaLabel?: string;
  onCta?: () => void;
  /**
   * Draws the card's own shape in placeholder ink while the numbers are in
   * flight — the frame keeps its height, nothing jumps when data lands.
   * @default false
   */
  loading?: boolean;
  /**
   * The CTA's button variant. Follows the card's own `variant` by default —
   * an outlined card offers an outlined button.
   * @default SURFACE_TO_BUTTON_VARIANT[variant]
   */
  ctaVariant?: ButtonVariant;
  /** Surface, as every card in the kit takes it. @default "outlined" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "md" */
  padding?: SurfacePadding;
  corner?: SurfaceCorner;
}

/**
 * A whole split into parts: the donut says *how much*, the labelled rows say
 * *of what*, and the summary strip says *so what* — one card for the
 * question "where did it all go".
 */
export const BreakdownCard = ({
  title,
  caption = "",
  items,
  stats = [],
  ctaLabel = "",
  onCta,
  loading = false,
  ctaVariant,
  variant = "outlined",
  tone = "neutral",
  padding = "md",
  corner,
  className = "",
  ...rest
}: BreakdownCardProps) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Panel
      {...rest}
      variant={variant}
      tone={tone}
      padding={padding}
      corner={corner}
      className={classNames("w-full", className)}
    >
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {caption && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {caption}
            </p>
          )}
        </div>
        {loading ? (
          <div
            className="animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="size-44 shrink-0 rounded-full border-[24px] border-black/10 dark:border-white/10" />
              <ul className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
                {Array.from({ length: Math.max(items.length, 3) })
                  .slice(0, 7)
                  .map((_, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <SkeletonBar
                        className="size-2.5 shrink-0 rounded-full"
                        height="h-2.5"
                      />
                      <SkeletonBar className="h-3 flex-1" width={`${68 - index * 6}%`} />
                      <SkeletonBar className="h-3 w-10 shrink-0" />
                      <SkeletonBar className="h-3 w-6 shrink-0" />
                    </li>
                  ))}
              </ul>
            </div>
            {stats.length > 0 && (
              <div
                className={classNames(
                  "mt-5 grid gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-800",
                  stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3",
                )}
              >
                {stats.map((stat, index) => (
                  <div key={stat.label || index}>
                    <SkeletonBar className="h-2.5 w-12" />
                    <SkeletonBar className="mt-1.5 h-3 w-16" />
                  </div>
                ))}
              </div>
            )}
            {ctaLabel && <SkeletonBar className="mt-5 h-3 w-28" />}
          </div>
        ) : (
        <>
        <section className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="w-44 shrink-0">
            <Chart.Svg height={176}>
            <Chart.Pie
              data={items}
              name={title}
              valueField="value"
              categoryField="label"
              colors={items.map((item) => item.tone ?? "blue")}
              innerRadius={0.72}
              padAngle={0.02}
              cornerRadius={4}
            />
            <Chart.Hover />
            <Chart.PieCenter
              title="TOTAL"
              value={total}
              subtitle={`${items.length} parts`}
            />
            </Chart.Svg>
          </div>

          <ul className="flex w-full min-w-0 flex-1 flex-col gap-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <span
                  className={classNames(
                    getTrueColorDotClass(item.tone ?? "blue"),
                    "size-2.5 shrink-0 rounded-full",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="tabular-nums font-medium">
                  {item.displayValue ?? item.value}
                </span>
                <span className="w-10 text-right font-mono text-[11px] tracking-tighter text-neutral-400 tabular-nums dark:text-neutral-500">
                  {total > 0 ? `${Math.round((item.value / total) * 100)}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {stats.length > 0 && (
          <div
            className={classNames(
              "grid gap-3 border-t pt-3 dark:border-neutral-800",
              stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </div>
                <div className="mt-0.5 font-mono text-sm font-medium tracking-tighter">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {ctaLabel && (
          <Button
          variant={ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
          size="sm"
          trailingIcon="ChevronRight"
          onClick={onCta}
        >
            {ctaLabel}
          </Button>
        )}
        </>
        )}
      </div>
    </Panel>
  );
};

BreakdownCard.displayName = "BreakdownCard";

export default BreakdownCard;

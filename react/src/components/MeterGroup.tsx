import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";
import { ORIENTATIONS, TRUE_COLORS } from "../theme/Theme";
import type { Orientation, TrueColor } from "../theme/Theme";
import type { IconRenderer } from "../types/Icon";
import { useIconRenderer } from "../contexts/IconContext";
import EmptyState from "./EmptyState";

export const METERGROUP_ORIENTATIONS = ORIENTATIONS;
export type MeterGroupOrientation = Orientation;
export type MeterGroupLabelPosition = "start" | "end";

/**
 * One segment of the meter — a labelled share of the total range.
 *
 * @deprecated Use `MultiProgressBarSeries`.
 */
export interface MeterItem {
  /** Text shown in the label list. */
  label: string;
  /** The segment's value, within `[min, max]`. */
  value: number;
  /** Tone of this segment. Falls back to the group's `color`. */
  color?: TrueColor;
  /** Icon rendered before the label instead of the colour marker. */
  icon?: Parameters<IconRenderer>[0];
}

export interface MeterGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  /** The segments to display. */
  items: readonly MeterItem[];
  /** Lower boundary of the range. @default 0 */
  min?: number;
  /** Upper boundary of the range. @default 100 */
  max?: number;
  /** @default "horizontal" */
  orientation?: MeterGroupOrientation;
  /** Where the label list sits relative to the bar. @default "end" */
  labelPosition?: MeterGroupLabelPosition;
  /** How the label list lays its rows out. @default "horizontal" */
  labelOrientation?: MeterGroupOrientation;
  /** Show the label list. @default true */
  showLabels?: boolean;
  /** Tone used by segments that don't set their own `color`. @default "blue" */
  color?: TrueColor;
  /** Bar thickness for horizontal, bar width for vertical. @default 12 */
  barSize?: number;
  /** Track height for vertical layouts. @default "200px" */
  height?: string | number;
  /** Accessible name for the meter region. @default "Meter group" */
  ariaLabel?: string;
  /** Show a skeleton shaped like the meter instead of the content. */
  loading?: boolean;
  /** Custom loading content, replacing the skeleton. */
  loadingState?: ReactNode;
  /** Show an error state in place of the content; a string is the message. */
  error?: ReactNode | null;
  /** Custom error content. */
  errorState?: ReactNode;
  /** Message shown when `items` is empty. @default "No items to display." */
  emptyMessage?: string;
  /** Custom empty content. */
  emptyState?: ReactNode;
}

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list, the same way `Carousel` builds its,
// so a new tone in the theme reaches the meter group without a hand-typed entry.

type MeterGroupToneTokens = {
  /** Fill of the segment bar. */
  fill: string;
  /** Colour of the square label marker. */
  marker: string;
  /** Tint of the label icon. */
  icon: string;
};

const buildToneTokens = (color: TrueColor): MeterGroupToneTokens => ({
  fill: `bg-${color}-500 dark:bg-${color}-400`,
  marker: `bg-${color}-400 dark:bg-${color}-300`,
  icon: `text-${color}-600 dark:text-${color}-400`,
});

const TONE_TOKENS: Record<TrueColor, MeterGroupToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, MeterGroupToneTokens>;

const getToneTokens = (color: TrueColor): MeterGroupToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

const toPx = (value: string | number): string =>
  typeof value === "number" ? `${value}px` : value;

/**
 * @deprecated Use `MultiProgressBar`, which absorbed everything this does.
 *
 * The two drew the same picture — one quantity split into labelled shares —
 * but `MultiProgressBar` also dims the other segments on hover and follows the
 * cursor with a tooltip. Rather than keep two implementations, its whole
 * feature set moved across: `min`/`max`, `orientation`, `height`,
 * `labelPosition`, `labelOrientation`, `showLabels`, `barSize`, per-item
 * `icon`, the loading skeleton, the error and empty states, and the
 * `role="meter"` semantics with `aria-valuemin` / `max` / `now`.
 *
 * Migration is close to mechanical:
 *
 * ```tsx
 * // before
 * <MeterGroup items={[{ label: "Running", value: 12 }]} max={20} />
 * // after — `items` is `series`, and each entry needs a stable `key`
 * <MultiProgressBar series={[{ key: "running", label: "Running", value: 12 }]} max={20} />
 * ```
 *
 * `MeterItem.color` becomes `MultiProgressBarSeries.tone`. This file is kept
 * so existing imports keep compiling; it is no longer in the kit-docs demo and
 * will be removed in a future release.
 */
export function MeterGroup({
  items,
  min = 0,
  max = 100,
  orientation = "horizontal",
  labelPosition = "end",
  labelOrientation = "horizontal",
  showLabels = true,
  color = "blue",
  barSize = 12,
  height = "200px",
  ariaLabel = "Meter group",
  loading = false,
  loadingState,
  error,
  errorState,
  emptyMessage = "No items to display.",
  emptyState,
  className,
  ...rest
}: MeterGroupProps): ReactNode {
  const isVertical = orientation === "vertical";
  const renderIcon = useIconRenderer();

  // A degenerate range would divide by zero; pin it to 1 so `percent` stays finite.
  const range = max - min || 1;
  const percent = (value: number): number => {
    const p = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, Math.round(Number.isFinite(p) ? p : 0)));
  };

  const sum = items.reduce((total, item) => {
    const v = Number.isFinite(item.value) ? item.value : 0;
    return total + v;
  }, 0);

  const segments = items.map((item) => {
    const tone = item.color ?? color;
    return {
      ...item,
      tone,
      tokens: getToneTokens(tone),
      pct: percent(item.value),
    };
  });

  const labels = showLabels && (
    <ol
      aria-label="Meter breakdown"
      className={classNames(
        "flex gap-x-4 gap-y-1.5 text-sm",
        labelOrientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
      )}
    >
      {segments.map((seg, i) => (
        <li
          key={i}
          className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300"
        >
          {seg.icon ? (
            <span
              className={classNames(
                "flex items-center",
                seg.tokens.icon,
              )}
            >
              {renderIcon(seg.icon, "sm")}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={classNames(
                "h-2 w-2 shrink-0 rounded-[2px]",
                seg.tokens.marker,
              )}
            />
          )}
          <span className="whitespace-nowrap">
            {seg.label}{" "}
            <span className="text-neutral-400 dark:text-neutral-500">
              ({seg.pct}%)
            </span>
          </span>
        </li>
      ))}
    </ol>
  );

  const bar = (
    <div
      className={classNames(
        "relative w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10",
        isVertical && "shrink-0",
      )}
      style={
        isVertical
          ? { width: barSize, height: toPx(height) }
          : { height: barSize }
      }
    >
      <div
        className={classNames(
          "flex h-full w-full",
          isVertical ? "flex-col" : "flex-row",
        )}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            aria-hidden="true"
            data-meter-segment
            className={classNames(
              "shrink-0 grow-0",
              isVertical ? "w-full" : "h-full",
              seg.tokens.fill,
            )}
            style={
              isVertical
                ? { height: `${seg.pct}%` }
                : { width: `${seg.pct}%` }
            }
          />
        ))}
      </div>
    </div>
  );

  const skeletonChips = segments.length > 0 && (
    <div
      className={classNames(
        "flex gap-2",
        labelOrientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
      )}
    >
      {segments.map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={classNames("h-2 w-2 rounded-[2px]", SKELETON)} />
          <div className={classNames("h-3 w-20 rounded", SKELETON)} />
        </div>
      ))}
    </div>
  );

  const skeleton = (
    <div
      className={classNames(
        "flex flex-col gap-3",
        // Mirrors the content layout — labels on the cross axis.
        isVertical ? "flex-row items-center" : "items-stretch",
      )}
    >
      {labelPosition === "start" ? skeletonChips : null}
      <div
        className={classNames(
          "relative w-full overflow-hidden rounded-full",
          SKELETON,
          isVertical && "shrink-0",
        )}
        style={
          isVertical
            ? { width: barSize, height: toPx(height) }
            : { height: barSize }
        }
      />
      {labelPosition === "end" ? skeletonChips : null}
    </div>
  );

  return (
    <div
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={sum}
      aria-busy={loading || undefined}
      data-orientation={orientation}
      data-color={color}
      className={classNames("w-full", className)}
      {...rest}
    >
      {loading ? (
        loadingState ?? skeleton
      ) : error ? (
        errorState ?? (
          <EmptyState
            icon="Error"
            tone="rose"
            title="Something went wrong"
            subtitle={
              typeof error === "string"
                ? error
                : "An unexpected error occurred."
            }
          />
        )
      ) : items.length === 0 ? (
        emptyState ?? <EmptyState icon="ViewGrid" title={emptyMessage} />
      ) : (
        <div
          className={classNames(
            "flex flex-col gap-3",
            // Labels sit on the cross axis: a horizontal bar has them above
            // or below, a vertical bar has them to the side (PrimeVue layout).
            isVertical ? "flex-row items-center" : "items-stretch",
            labelPosition === "start" &&
              (isVertical ? "flex-row-reverse" : "flex-col-reverse"),
          )}
        >
          {bar}
          {labels}
        </div>
      )}
    </div>
  );
}

export default MeterGroup;

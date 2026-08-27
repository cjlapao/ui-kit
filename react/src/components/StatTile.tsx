import React from "react";
import StatCard, {
  type StatCardError,
  type StatCardMeta,
  type StatCardProps,
  type StatCardTrend,
} from "./StatCard";
import type { TrueColor } from "../theme";

export type StatTileTrend = StatCardTrend;
export type StatTileError = StatCardError;

export interface StatTileMeta extends StatCardMeta {
  /**
   * @deprecated Never read. `StatTile` rendered meta items as plain
   * icon + text, so these two were declared and ignored (§5.3).
   */
  variant?: "text" | "badge";
  /** @deprecated Never read. */
  color?: TrueColor;
}

/** @deprecated The object form of `progress`. Use `progress` + `progressType="bar"`. */
export interface StatTileProgress {
  value: number;
  label?: string;
  color?: TrueColor;
}

/**
 * `StatTile` is `StatCard`. It inherits every prop the base card takes —
 * `variant`, `tone`, `size`, `padding`, `corner`, `decoration`, `labelTone`,
 * `valueSize`, `progressType`, `loaderType`, `gradient`, and the rest — and
 * adds nothing of its own.
 *
 * What it keeps are the *older names* for props the base card has since
 * renamed. Those are the deprecated block below: each maps onto its modern
 * counterpart, and the modern one wins when both are given.
 */
export interface StatTileProps
  extends Omit<StatCardProps, "meta" | "progress"> {
  /** Base `progress`, widened to accept the old bar object. */
  progress?: boolean | number | StatTileProgress;
  meta?: StatTileMeta[];

  /** @deprecated Use `label`. */
  title?: React.ReactNode;
  /** @deprecated Use `tone`. */
  color?: TrueColor;
  /**
   * @deprecated Tints the label and value together. `StatCard` splits these
   * into `labelTone` and `valueTone`; use those for independent control.
   */
  textColor?: TrueColor;
  /**
   * @deprecated Use `progress` with the default `progressType="spinner"`.
   * Existed only because the old `progress` was a bar object and shadowed the
   * base card's corner spinner.
   */
  progressSpinner?: boolean | number;
  /** @deprecated Use `hoverEffect`. */
  withHoverEffect?: boolean;
  /** @deprecated Use `spinnerTone`. */
  spinnerColor?: TrueColor;
}

/** True for the deprecated `{ value, label, color }` bar object. */
const isProgressObject = (
  progress: StatTileProps["progress"],
): progress is StatTileProgress =>
  typeof progress === "object" && progress !== null;

/**
 * The metric tile.
 *
 * It used to be a second, parallel implementation of the same card — its own
 * `Panel`, its own decoration corner, its own error block, its own hand-rolled
 * progress bar (two nested divs with no `role`), its own trend pill. All of
 * that lives on `StatCard`, so this is a rename layer over it and nothing
 * more: new code can use `StatCard` directly and lose nothing.
 */
const StatTile: React.FC<StatTileProps> = ({
  // Deprecated aliases, resolved below.
  title,
  color,
  textColor,
  progressSpinner,
  withHoverEffect,
  spinnerColor,
  // Modern names, which win wherever both are supplied.
  label,
  tone,
  labelTone,
  valueTone,
  hoverEffect,
  spinnerTone,
  progress,
  progressType,
  progressLabel,
  progressTone,
  meta,
  ...rest
}) => {
  const barObject = isProgressObject(progress) ? progress : undefined;
  return (
    <StatCard
      {...rest}
      label={label ?? title}
      tone={tone ?? color}
      labelTone={labelTone ?? textColor}
      valueTone={valueTone ?? textColor}
      hoverEffect={hoverEffect ?? withHoverEffect}
      spinnerTone={spinnerTone ?? spinnerColor}
      meta={meta}
      // The bar object implies the bar; anything else passes straight through.
      progress={
        barObject ? barObject.value : ((progress as boolean | number | undefined) ?? progressSpinner)
      }
      progressType={progressType ?? (barObject ? "bar" : undefined)}
      progressLabel={progressLabel ?? barObject?.label}
      progressTone={progressTone ?? barObject?.color}
    />
  );
};

StatTile.displayName = "StatTile";

export default StatTile;

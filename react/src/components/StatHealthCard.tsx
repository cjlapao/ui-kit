import React from "react";
import StatCard, { type StatCardProps } from "./StatCard";
import EcgMonitor, { type EcgMonitorState } from "./EcgMonitor";
import type { ControlSize } from "../theme";

/** ECG height per card size, so the strip scales with the card. */
const ECG_HEIGHT: Record<ControlSize, number> = {
  xs: 36,
  sm: 44,
  md: 60,
  lg: 72,
  xl: 80,
};

export interface StatHealthCardProps
  extends Omit<StatCardProps, "body" | "health" | "healthBpm"> {
  /** The trace to draw: steady when healthy, jittered when degraded, flat when down. */
  state: EcgMonitorState;
  /** Beats per minute. @default 60 */
  bpm?: number;
  /** Overrides the height the card's `size` implies. */
  height?: number;
}

/**
 * A `StatCard` whose body is a live ECG trace — service health as a metric
 * card.
 *
 * The strip used to be a `health` prop on `StatCard` itself, which meant every
 * card carried an `EcgMonitor` import and a canvas-shaped branch it almost
 * never used. Splitting it out keeps `StatCard` about a number and lets this
 * one own the monitor's own props (`bpm`, `height`) properly, where before
 * they were two extra props on a component that mostly ignored them.
 *
 * Everything `StatCard` takes still applies: variant, tone, size, padding,
 * loader, trend, meta, footer.
 */
const StatHealthCard: React.FC<StatHealthCardProps> = ({
  state,
  bpm = 60,
  height,
  size = "md",
  ...rest
}) => (
  <StatCard
    {...rest}
    size={size}
    body={
      <EcgMonitor
        state={state}
        bpm={bpm}
        useFullWidth
        height={height ?? ECG_HEIGHT[size] ?? ECG_HEIGHT.md}
        className="mt-1"
      />
    }
  />
);

StatHealthCard.displayName = "StatHealthCard";

export default StatHealthCard;

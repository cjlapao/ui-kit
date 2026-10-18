import React, { useMemo } from "react";
import classNames from "classnames";
import StatCard, { type StatCardProps } from "./StatCard";
import { CustomIcon } from "./CustomIcon";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { type IconName } from "../icons/registry";
import type { ControlSize, TrueColor } from "../theme";
import { getColorPaletteNames } from "../theme";

export interface StatGoalItem {
  value: number;
  label: string;
  icon: IconName;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
  tooltip?: string;
}

/**
 * `StatCard` whose body is a stack of circular goal rings. Every base prop
 * applies unchanged; `goals` is the only addition, and `ringSize` overrides
 * what the card's `size` implies.
 */
export interface StatGoalTileProps
  extends Omit<StatCardProps, "body" | "value" | "subtitle"> {
  goals: StatGoalItem[];
  /** Overrides the ring diameter the card's `size` implies, in px. */
  ringSize?: number;

  /** @deprecated Use `label`. */
  title?: React.ReactNode;
  /** @deprecated Use `tone`. */
  color?: TrueColor;
}

/**
 * Ring diameter, stroke and copy scale per card size, so a goal tile in an
 * `xs` grid is not the same physical size as one in an `xl` hero slot. The
 * ring was a fixed 56px at every size before.
 */
const GOAL_TOKENS: Record<
  ControlSize,
  { ring: number; stroke: number; icon: ControlSize; value: string; label: string; gap: string }
> = {
  xs: { ring: 36, stroke: 3, icon: "xs", value: "text-base", label: "text-[10px]", gap: "gap-2 py-1.5" },
  sm: { ring: 44, stroke: 3, icon: "sm", value: "text-lg", label: "text-[11px]", gap: "gap-3 py-2" },
  md: { ring: 56, stroke: 4, icon: "md", value: "text-2xl", label: "text-xs", gap: "gap-4 py-3" },
  lg: { ring: 68, stroke: 5, icon: "lg", value: "text-3xl", label: "text-sm", gap: "gap-4 py-3.5" },
  xl: { ring: 80, stroke: 6, icon: "lg", value: "text-4xl", label: "text-sm", gap: "gap-5 py-4" },
};

const CircularProgress: React.FC<{
  value: number;
  color: TrueColor;
  icon: IconName;
  label: string;
  size: number;
  strokeWidth: number;
  iconSize: ControlSize;
  onGradient: boolean;
}> = ({ value, color, icon, label, size, strokeWidth, iconSize, onGradient }) => {
  const radius = (size - strokeWidth) / 2 - 1;
  const circumference = radius * 2 * Math.PI;
  // A value outside 0–100 would draw a ring longer than its own circumference,
  // which reads as a full ring with no way to tell it apart from exactly 100.
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        // The ring carried no role and no name — the percentage beside it was
        // the only thing a screen reader could reach, with nothing tying the
        // two together.
        role="img"
        aria-label={`${label}: ${clamped}%`}
        className="h-full w-full -rotate-90 transform overflow-visible"
      >
        <circle
          className={
            onGradient ? "text-white/20" : "text-neutral-100 dark:text-neutral-800"
          }
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`text-${color}-500 transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className={onGradient ? "absolute text-white" : `absolute text-${color}-500`}>
        <CustomIcon icon={icon} size={iconSize} />
      </div>
    </div>
  );
};

/** The goal rows, split out so they can read the surrounding surface tokens. */
const Goals: React.FC<{
  goals: (StatGoalItem & { color: TrueColor })[];
  tokens: (typeof GOAL_TOKENS)[ControlSize];
  ringSize?: number;
  onGradient: boolean;
}> = ({ goals, tokens, ringSize, onGradient }) => {
  const text = useSurfaceText();
  return (
    <div className="flex h-full flex-col justify-center">
      {goals.map((goal, idx) => (
        <React.Fragment key={idx}>
          <div
            className={classNames(
              "flex items-center first:pt-0 last:pb-0",
              tokens.gap,
            )}
            title={goal.tooltip}
          >
            <CircularProgress
              value={goal.value}
              color={goal.color}
              icon={goal.icon}
              label={goal.label}
              size={ringSize ?? tokens.ring}
              strokeWidth={tokens.stroke}
              iconSize={tokens.icon}
              onGradient={onGradient}
            />
            <div className="flex min-w-0 flex-col">
              <span
                className={classNames(
                  "font-bold leading-none",
                  tokens.value,
                  onGradient ? "text-white" : text.heading,
                )}
              >
                {goal.value}%
              </span>
              <span
                className={classNames(
                  "mt-1 font-medium",
                  tokens.label,
                  onGradient ? "text-white/70" : text.muted,
                )}
              >
                {goal.label}
              </span>
            </div>
          </div>
          {idx < goals.length - 1 && (
            <div
              className={classNames(
                "my-1 h-px w-full border-t",
                onGradient ? "border-white/20" : text.divider,
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const StatGoalTile: React.FC<StatGoalTileProps> = ({
  goals,
  ringSize,
  title,
  color,
  label,
  tone,
  size = "md",
  gradient = false,
  ...rest
}) => {
  const resolvedGoals = useMemo(() => {
    const palette = getColorPaletteNames(goals.length);
    return goals.map((goal, i) => ({
      ...goal,
      color: (goal.color ?? palette[i]) as TrueColor,
    }));
  }, [goals]);

  const tokens = GOAL_TOKENS[size] ?? GOAL_TOKENS.md;

  return (
    <StatCard
      {...rest}
      label={label ?? title}
      tone={tone ?? color}
      size={size}
      gradient={gradient}
      body={
        <Goals
          goals={resolvedGoals}
          tokens={tokens}
          ringSize={ringSize}
          onGradient={gradient}
        />
      }
    />
  );
};

StatGoalTile.displayName = "StatGoalTile";

export default StatGoalTile;

/**
 * Gantt colour tokens — TrueColor → Tailwind class maps.
 *
 * Every dynamic class produced here is emitted by
 * `scripts/generate-safelist.mjs` (Gantt section), because the scanner only
 * sees static strings. The dark: pairs keep the chart legible on both
 * schemes without a single hand-edited hex.
 */

import type { TrueColor } from "../theme/Theme";

export interface GanttBarTokens {
  /** Bar fill (light + dark identical — saturated reads on both). Used for
   *  the milestone diamond, owner initials and badges. */
  fill: string;
  /** Light base of a task bar — the un-done part of a bar reads as a soft
   *  tint, so the darker progress fill stands out (done vs. remaining). */
  base: string;
  /** Base hover step. */
  baseHover: string;
  /** Progress overlay inside the bar (the done part, a step darker than the
   *  base). */
  progress: string;
  /** Milestone diamond fill. */
  milestone: string;
  /** Bar border / 1px rim. */
  rim: string;
  /** Text on the bar. */
  text: string;
  /** Soft tint used for the row wash behind a task's bar. */
  soft: string;
  /** Soft tint, dark scheme. */
  softDark: string;
}

export function getGanttBarTokens(color: TrueColor): GanttBarTokens {
  const c = color;
  return {
    fill: `bg-${c}-500`,
    base: `bg-${c}-300/70 dark:bg-${c}-400/35`,
    baseHover: `hover:bg-${c}-400/70 dark:hover:bg-${c}-400/55`,
    progress: `bg-${c}-700/70`,
    milestone: `bg-${c}-500`,
    rim: `border-${c}-600/40`,
    text: "text-white",
    soft: `bg-${c}-50/70`,
    softDark: `dark:bg-${c}-950/40`,
  };
}

export interface GanttLaneTokens {
  /** Lane band background. */
  band: string;
  /** Lane header label colour. */
  label: string;
  /** Accent edge of the lane header. */
  accent: string;
  /** Progress chip fill. */
  chip: string;
}

export function getGanttLaneTokens(color: TrueColor): GanttLaneTokens {
  const c = color;
  return {
    band: `bg-${c}-50/70 dark:bg-${c}-950/40`,
    label: `text-${c}-800 dark:text-${c}-200`,
    accent: `border-${c}-400 dark:border-${c}-500/50`,
    chip: `bg-${c}-500`,
  };
}

export interface GanttColumnTokens {
  /** Header cell background. */
  header: string;
  /** Header text. */
  text: string;
  /** Cell divider. */
  border: string;
}

export function getGanttColumnTokens(color: TrueColor): GanttColumnTokens {
  const c = color;
  return {
    header: `bg-${c}-50 dark:bg-${c}-950/40`,
    text: `text-${c}-800 dark:text-${c}-200`,
    border: `border-${c}-300/50 dark:border-${c}-500/25`,
  };
}

export interface GanttLinkTokens {
  /** SVG stroke class for the arrow. */
  stroke: string;
  /** Arrow head / port-node fill. */
  fill: string;
  /** Pale halo behind a port node. */
  halo: string;
}

export function getGanttLinkTokens(color: TrueColor): GanttLinkTokens {
  const c = color;
  return {
    stroke: `stroke-${c}-500 dark:stroke-${c}-400`,
    fill: `fill-${c}-500 dark:fill-${c}-400`,
    halo: `fill-${c}-50 dark:fill-${c}-500/10`,
  };
}

/** Today marker: the Gantt's accent colour. */
export function getGanttTodayTokens(color: TrueColor): { line: string; chip: string; text: string } {
  const c = color;
  return {
    line: `border-${c}-500`,
    chip: `bg-${c}-500`,
    text: `text-${c}-700 dark:text-${c}-300`,
  };
}

/** Selection ring for a focused/selected bar. */
export function getGanttSelectionTokens(color: TrueColor): { ring: string; row: string } {
  const c = color;
  return {
    ring: `ring-2 ring-${c}-400/50`,
    row: `bg-${c}-50/70 dark:bg-${c}-950/40`,
  };
}

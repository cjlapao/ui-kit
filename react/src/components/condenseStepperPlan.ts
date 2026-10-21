/**
 * The condense plan — the only clever part of CondensedStepper, and it has
 * no DOM in it.
 *
 * The strip is one line: the current step anchored in the middle, what has
 * been walked compressed to the left, what is queued compressed to the right.
 * How much of each flank stays compressed and how much the reveal can show
 * is arithmetic over the steps — counts, caps, the `+N` remainder, and the
 * degenerate rulings (no past, no future, all done, a single step). The
 * component measures nothing to decide these; it draws what this says.
 */
import type { StepStatus, StepperStep } from "./Stepper";

export type CondensedZone = "past" | "future";

/**
 * A flank earns an expansion when it holds more than this many steps:
 * with three or fewer, every step is already on show and there is
 * nothing left to reveal — the quiet discs *are* the truth, not a
 * teaser for it.
 */
export const QUIET_EXPAND_THRESHOLD = 3;

/**
 * The quiet motif — how many discs a flank shows while closed. Fixed,
 * not the count: three ticks say "work is done here", two dots say
 * "there is a queue", whatever the real numbers. The counts live in
 * the summaries and the reveal; the motif only indicates.
 */
export const QUIET_PAST_DISCS = 3;
export const QUIET_FUTURE_DISCS = 2;

export interface CondensedFlankPlan {
  /** The flank's step indices, in display order (past: oldest first). */
  indices: number[];
  /**
   * The discs shown while quiet, in display order. The honest flank: it
   * mirrors the real count, capped at `maxSteps` — and it shows the
   * *nearest* window: the last steps of the past (most recently done,
   * closest to the anchor) and the first of the queue (next up).
   */
  quietIndices: number[];
  /** The window the reveal shows (capped by `maxSteps`), nearest side. */
  revealedIndices: number[];
  /** How many `indices` the reveal leaves to the `+N` chip. */
  overflow: number;
  /**
   * Whether the flank has a reveal at all. A flank of three or fewer
   * shows everything already — the accordion, its button and its
   * tooltip are withheld, because promising to reveal what is already
   * visible is the theatre the realistic strip killed.
   */
  expandable: boolean;
}

export interface CondenseStepperPlan {
  /** The middle anchor. −1 only when there are no steps at all. */
  centreIndex: number;
  /** True when the anchor itself reads as completed (every step done). */
  allDone: boolean;
  hasPast: boolean;
  hasFuture: boolean;
  /** Resolved per index: explicit status wins; the anchor falls back to active. */
  statuses: StepStatus[];
  past: CondensedFlankPlan;
  future: CondensedFlankPlan;
}

export interface CondenseStepperPlanInput {
  /** Revealed items per flank when expanded, before `+N` carries the
   * rest. @default 6 */
  maxSteps?: number;
  /**
   * `panel` (default): the full strip — quiet discs mirror the true
   * count (nearest window, capped at `maxSteps`), and flanks of more
   * than three earn the accordion reveal. `card`: the condensed strip —
   * one solid disc per flank quiet, and expansion only reveals the count
   * while the anchor compresses to its index (no accordion).
   */
  mode?: "panel" | "card";
}

const EMPTY_FLANK: CondensedFlankPlan = {
  indices: [],
  quietIndices: [],
  revealedIndices: [],
  overflow: 0,
  expandable: false,
};

const flank = (
  indices: number[],
  quietCap: number,
  maxSteps: number,
  side: "past" | "future",
  expandable: boolean,
): CondensedFlankPlan => {
  // The window is the NEAREST side: the past keeps its most recent
  // steps (the ones just walked, closest to the anchor), the queue
  // keeps its next-up steps. Both cap at `maxSteps`.
  const nearest = (list: number[], cap: number) =>
    side === "past" ? list.slice(Math.max(0, list.length - cap)) : list.slice(0, cap);
  return {
    indices,
    quietIndices: nearest(indices, quietCap),
    revealedIndices: nearest(indices, maxSteps),
    overflow: Math.max(0, indices.length - maxSteps),
    expandable,
  };
};

/**
 * Where the anchor sits: `currentStepId` (matched by id) wins over
 * `currentIndex` (clamped into range); with neither, the first step that has
 * not been completed; when every step is completed, the last one — the strip
 * ends on its final step, ✓ and all, rather than on nothing.
 */
export const resolveCentreIndex = (
  steps: readonly StepperStep[],
  currentIndex?: number,
  currentStepId?: string,
): number => {
  if (steps.length === 0) return -1;
  if (currentStepId !== undefined) {
    const byId = steps.findIndex((s) => s.id === currentStepId);
    if (byId >= 0) return byId;
  }
  if (currentIndex !== undefined) {
    return Math.min(Math.max(0, currentIndex), steps.length - 1);
  }
  const firstOpen = steps.findIndex((s) => s.status !== "completed");
  return firstOpen >= 0 ? firstOpen : steps.length - 1;
};

export const condenseStepperPlan = (
  steps: readonly StepperStep[],
  centreIndex: number,
  input: CondenseStepperPlanInput = {},
): CondenseStepperPlan => {
  const maxSteps = Math.max(0, input.maxSteps ?? 6);
  const isCard = input.mode === "card";
  const n = steps.length;
  if (n === 0) {
    return {
      centreIndex: -1,
      allDone: false,
      hasPast: false,
      hasFuture: false,
      statuses: [],
      past: { ...EMPTY_FLANK },
      future: { ...EMPTY_FLANK },
    };
  }
  const centre = Math.min(Math.max(0, centreIndex), n - 1);
  const statuses: StepStatus[] = steps.map((s, i) =>
    s.status ?? (i === centre ? "active" : "pending"),
  );
  // Position, not status, draws the flanks: everything left of the anchor is
  // walked, everything right is queued. Statuses only colour what's there.
  const pastIndices: number[] = [];
  for (let i = 0; i < centre; i += 1) pastIndices.push(i);
  const futureIndices: number[] = [];
  for (let i = centre + 1; i < n; i += 1) futureIndices.push(i);
  // A single step is just the pill; the flanks need something to be beside.
  const hasZones = n > 1;
  return {
    centreIndex: centre,
    allDone: statuses[centre] === "completed",
    hasPast: hasZones && pastIndices.length > 0,
    hasFuture: hasZones && futureIndices.length > 0,
    statuses,
    past: flank(pastIndices, isCard ? 1 : QUIET_PAST_DISCS, maxSteps, "past",
      isCard || pastIndices.length > QUIET_EXPAND_THRESHOLD),
    future: flank(futureIndices, isCard ? 1 : QUIET_FUTURE_DISCS, maxSteps, "future",
      isCard || futureIndices.length > QUIET_EXPAND_THRESHOLD),
  };
};

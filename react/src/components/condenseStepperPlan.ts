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

/** How many overlapping discs each flank shows while quiet. */
export const QUIET_PAST_DISCS = 3;
export const QUIET_FUTURE_DISCS = 2;

export interface CondensedFlankPlan {
  /** The flank's step indices, in display order (past: oldest first). */
  indices: number[];
  /** Leading discs while quiet — never more than `indices.length`. */
  quietDiscs: number;
  /** The leading slice the reveal shows (capped by `maxVisible`). */
  revealedIndices: number[];
  /** How many `indices` the reveal leaves to the `+N` chip. */
  overflow: number;
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
  /** Revealed items per flank before `+N` carries the rest. @default 5 */
  maxVisible?: number;
}

const EMPTY_FLANK: CondensedFlankPlan = {
  indices: [],
  quietDiscs: 0,
  revealedIndices: [],
  overflow: 0,
};

const flank = (
  indices: number[],
  quietCap: number,
  maxVisible: number,
): CondensedFlankPlan => ({
  indices,
  quietDiscs: Math.min(indices.length, quietCap),
  revealedIndices: indices.slice(0, maxVisible),
  overflow: Math.max(0, indices.length - maxVisible),
});

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
  const maxVisible = Math.max(0, input.maxVisible ?? 5);
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
    past: flank(pastIndices, QUIET_PAST_DISCS, maxVisible),
    future: flank(futureIndices, QUIET_FUTURE_DISCS, maxVisible),
  };
};

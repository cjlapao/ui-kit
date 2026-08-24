import { normalizeStatus } from "./statusTokens";
import type { WorkflowStep, WorkflowSubStep } from "./types";

export interface WorkflowTallies {
  done: number;
  skipped: number;
  flagged: number;
  remaining: number;
}

export interface WorkflowSubSummary {
  accepted: number;
  skipped: number;
  open: number;
}

export interface ResolvedActiveStep {
  step: WorkflowStep;
  /** 1-based position in `steps`. */
  index: number;
}

/** Share of steps in `done`, rounded to a whole percent. */
export const computeProgress = (steps: WorkflowStep[]): number => {
  if (steps.length === 0) {
    return 0;
  }
  const done = steps.filter(
    (step) => normalizeStatus(step.status) === "done",
  ).length;
  return Math.round((done / steps.length) * 100);
};

/** `blocked` and `attention` both count as flagged; everything else remains. */
export const computeTallies = (steps: WorkflowStep[]): WorkflowTallies => {
  const tallies: WorkflowTallies = {
    done: 0,
    skipped: 0,
    flagged: 0,
    remaining: 0,
  };

  steps.forEach((step) => {
    switch (normalizeStatus(step.status)) {
      case "done":
        tallies.done += 1;
        break;
      case "skipped":
        tallies.skipped += 1;
        break;
      case "attention":
      case "blocked":
        tallies.flagged += 1;
        break;
      default:
        tallies.remaining += 1;
    }
  });

  return tallies;
};

export const computeSubSummary = (
  subSteps: WorkflowSubStep[] = [],
): WorkflowSubSummary => {
  const summary: WorkflowSubSummary = { accepted: 0, skipped: 0, open: 0 };

  subSteps.forEach((subStep) => {
    switch (normalizeStatus(subStep.status)) {
      case "done":
        summary.accepted += 1;
        break;
      case "skipped":
        summary.skipped += 1;
        break;
      default:
        summary.open += 1;
    }
  });

  return summary;
};

export const getAttentionSteps = (steps: WorkflowStep[]): WorkflowStep[] =>
  steps.filter((step) => {
    const status = normalizeStatus(step.status);
    return status === "attention" || status === "blocked";
  });

export const getSkippedSteps = (steps: WorkflowStep[]): WorkflowStep[] =>
  steps.filter((step) => normalizeStatus(step.status) === "skipped");

/** `activeStepId` wins; otherwise the first in-progress step, otherwise the first step. */
export const resolveActiveStep = (
  steps: WorkflowStep[],
  activeStepId?: string,
): ResolvedActiveStep | undefined => {
  if (steps.length === 0) {
    return undefined;
  }

  const byId = steps.findIndex((step) => step.id === activeStepId);
  if (byId >= 0) {
    return { step: steps[byId], index: byId + 1 };
  }

  const inProgress = steps.findIndex(
    (step) => normalizeStatus(step.status) === "in_progress",
  );
  if (inProgress >= 0) {
    return { step: steps[inProgress], index: inProgress + 1 };
  }

  return { step: steps[0], index: 1 };
};

import type { StepperStep, StepStatus } from "../Stepper";

/** A contiguous window of actual steps; overflow never consumes a slot. */
export function planDotSteps(steps: StepperStep[], currentIndex?: number, currentStepId?: string, maxVisible = 5) {
  const limit = Number.isFinite(maxVisible) ? Math.max(1, Math.floor(maxVisible)) : 5;
  const allDone = steps.length > 0 && steps.every(step => step.status === "completed");
  const byId = currentStepId === undefined ? -1 : steps.findIndex(step => step.id === currentStepId);
  const explicitActive = steps.findIndex(step => step.status === "active");
  const firstUnfinished = steps.findIndex(step => step.status !== "completed");
  const requested = byId >= 0 ? byId : Number.isFinite(currentIndex) ? Math.floor(currentIndex!) : explicitActive >= 0 ? explicitActive : firstUnfinished;
  const activeIndex = !steps.length || allDone ? -1 : Math.max(0, Math.min(steps.length - 1, requested));
  const anchor = activeIndex < 0 ? steps.length - 1 : activeIndex;
  const start = Math.max(0, Math.min(anchor - Math.floor((limit - 1) / 2), steps.length - limit));
  const end = Math.min(steps.length, start + limit);
  const statuses: StepStatus[] = steps.map((step, index) => {
    if (step.status && step.status !== "active") return step.status;
    return index === activeIndex ? "active" : index < activeIndex ? "completed" : "pending";
  });
  return { activeIndex, start, end, statuses, indices: Array.from({ length: end - start }, (_, index) => start + index), before: start, after: steps.length - end };
}

export function overflowStatus(statuses: StepStatus[]): StepStatus {
  return statuses.every(status => status === "completed") ? "completed" : statuses.includes("error") ? "error" : "pending";
}

import { describe, expect, it } from "vitest";
import type { StepperStep } from "../Stepper";
import { overflowStatus, planDotSteps } from "./plan";

const steps: StepperStep[] = Array.from({ length: 10 }, (_, index) => ({ id: `s${index}`, title: `Step ${index + 1}` }));

describe("DotStepper window", () => {
  it.each([
    [0, [0, 1, 2, 3, 4], 0, 5],
    [1, [0, 1, 2, 3, 4], 0, 5],
    [4, [2, 3, 4, 5, 6], 2, 3],
    [9, [5, 6, 7, 8, 9], 5, 0],
  ])("keeps five actual steps around index %i", (current, indices, before, after) => {
    expect(planDotSteps(steps, current as number)).toMatchObject({ indices, before, after });
  });
  it("favours upcoming steps for even limits and handles tiny/invalid limits", () => {
    expect(planDotSteps(steps, 4, undefined, 4).indices).toEqual([3, 4, 5, 6]);
    expect(planDotSteps(steps, 4, undefined, 1).indices).toEqual([4]);
    expect(planDotSteps(steps, 4, undefined, 0).indices).toEqual([4]);
    expect(planDotSteps(steps, 4, undefined, NaN).indices).toHaveLength(5);
    expect(planDotSteps(steps, 4, undefined, Infinity).indices).toHaveLength(5);
    expect(planDotSteps(steps, 4, undefined, 20).indices).toHaveLength(10);
  });
  it("handles empty, short and completed flows without inventing an active step", () => {
    expect(planDotSteps([])).toMatchObject({ activeIndex: -1, indices: [], before: 0, after: 0 });
    expect(planDotSteps(steps.slice(0, 2), 1).indices).toEqual([0, 1]);
    const done = planDotSteps(steps.map(step => ({ ...step, status: "completed" })));
    expect(done).toMatchObject({ activeIndex: -1, indices: [5, 6, 7, 8, 9], before: 5, after: 0 });
    expect(done.statuses.every(status => status === "completed")).toBe(true);
  });
  it("resolves ids before indices, clamps indices and infers statuses", () => {
    expect(planDotSteps(steps, 0, "s4")).toMatchObject({ activeIndex: 4, statuses: ["completed", "completed", "completed", "completed", "active", "pending", "pending", "pending", "pending", "pending"] });
    expect(planDotSteps(steps, -9).activeIndex).toBe(0);
    expect(planDotSteps(steps, 99).activeIndex).toBe(9);
    expect(planDotSteps(steps, NaN).activeIndex).toBe(0);
  });
  it("preserves explicit errors/pending and resolves only one active step", () => {
    const explicit: StepperStep[] = [{ title: "Done", status: "completed" }, { title: "Waiting", status: "pending" }, { title: "Running", status: "active" }, { title: "Failed", status: "error" }];
    expect(planDotSteps(explicit)).toMatchObject({ activeIndex: 2, statuses: ["completed", "pending", "active", "error"] });
    expect(planDotSteps(explicit, 1).statuses).toEqual(["completed", "pending", "pending", "error"]);
    expect(overflowStatus(["completed", "completed"])).toBe("completed");
    expect(overflowStatus(["completed", "pending"])).toBe("pending");
    expect(overflowStatus(["pending", "error"])).toBe("error");
  });
});

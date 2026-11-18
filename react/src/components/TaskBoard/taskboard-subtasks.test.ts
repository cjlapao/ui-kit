import { describe, it, expect } from "vitest";
import { resolveSubtasks, type TaskBoardSubtask } from "../../../../common/taskboard";

const s = (id: string, extra?: Partial<TaskBoardSubtask>): TaskBoardSubtask => ({ id, title: `Task ${id}`, ...extra });

describe("resolveSubtasks", () => {
  it("resolves plain done flags: completed, one active, the rest pending", () => {
    const r = resolveSubtasks([s("a", { done: true }), s("b", { done: true }), s("c"), s("d")]);
    expect(r.subtasks.map((x) => x.status)).toEqual(["completed", "completed", "active", "pending"]);
    expect(r).toMatchObject({ done: 2, total: 4 });
  });

  it("treats done: false like an unstated item — the first one becomes active", () => {
    const r = resolveSubtasks([s("a", { done: false }), s("b", { done: false })]);
    expect(r.subtasks.map((x) => x.status)).toEqual(["active", "pending"]);
    expect(r.done).toBe(0);
  });

  it("only the first unstated item is active", () => {
    const r = resolveSubtasks([s("a"), s("b"), s("c")]);
    expect(r.subtasks.map((x) => x.status)).toEqual(["active", "pending", "pending"]);
  });

  it("explicit statuses are kept verbatim, including out-of-order completions", () => {
    const r = resolveSubtasks([
      s("a", { status: "completed" }),
      s("b", { status: "pending" }),
      s("c", { status: "active" }),
      s("d", { status: "error" }),
    ]);
    expect(r.subtasks.map((x) => x.status)).toEqual(["completed", "pending", "active", "error"]);
    expect(r.done).toBe(1);
  });

  it("status wins over done", () => {
    const r = resolveSubtasks([s("a", { done: true, status: "error" })]);
    expect(r.subtasks[0].status).toBe("error");
    expect(r.done).toBe(0);
    // The error item is stated, so the next unstated one is the active item.
    const mixed = resolveSubtasks([s("a", { done: true, status: "error" }), s("b")]);
    expect(mixed.subtasks.map((x) => x.status)).toEqual(["error", "active"]);
  });

  it("all done reads as done — no active dot is invented", () => {
    const r = resolveSubtasks([s("a", { done: true }), s("b", { status: "completed" })]);
    expect(r.subtasks.every((x) => x.status === "completed")).toBe(true);
    expect(r).toMatchObject({ done: 2, total: 2 });
  });

  it("an empty list resolves to nothing", () => {
    expect(resolveSubtasks([])).toEqual({ subtasks: [], done: 0, total: 0 });
  });

  it("carries ids and titles through without touching the input", () => {
    const input = [s("x", { title: "Ship it" }), s("y", { data: { ticket: 7 } })];
    const snapshot = JSON.parse(JSON.stringify(input));
    const r = resolveSubtasks(input);
    expect(r.subtasks.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: "x", title: "Ship it" },
      { id: "y", title: "Task y" },
    ]);
    expect(input).toEqual(snapshot);
  });
});

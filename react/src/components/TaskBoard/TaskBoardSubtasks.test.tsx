/**
 * Sub tasks on cards: a read-only DotStepper row (non-focusable — the card
 * itself is the control) plus a done/total fraction, windowed to the
 * board's `subtaskMaxVisible` with the overflow stacking.
 */
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen, within } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const card = (id: string) => document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
const subRow = (id: string) => card(id).querySelector("[data-card-subtasks]") as HTMLElement;
// Avatars are role="img" too — count dots inside the sub task row only.
const dotsIn = (id: string) => within(subRow(id)).getAllByRole("img");
const key = (id: string, k: string) => fireEvent.keyDown(card(id), { key: k });

function renderBoard(props: Partial<TaskBoardProps> = {}, cards: TaskBoardCard[] = roadmap.cards, columns = roadmap.columns) {
  const onCardsChange = vi.fn();
  render(
    <TaskBoard cards={cards} columns={columns} onCardsChange={onCardsChange} {...props} />,
  );
  return { onCardsChange };
}

describe("TaskBoard sub tasks", () => {
  it("renders dots and the fraction for a card with sub tasks, absent otherwise", () => {
    renderBoard();
    // r2: 7 sub tasks, 2 done — fraction, group label and dots follow.
    expect(card("r2").querySelector("[data-card-subtasks]")).not.toBeNull();
    expect(within(card("r2")).getByText("2/7")).toBeInTheDocument();
    expect(within(card("r2")).getByRole("group", { name: "2 of 7 subtasks" })).toBeInTheDocument();
    // r1 has no sub tasks at all.
    expect(card("r1").querySelector("[data-card-subtasks]")).toBeNull();
  });

  it("windowing: three dots plus the overflow stacks by default", () => {
    renderBoard();
    // r2: seven sub tasks against the default window of three.
    expect(dotsIn("r2")).toHaveLength(5); // three windowed steps + two stacks
    expect(within(card("r2")).getByRole("img", { name: "1 more steps before" })).toBeInTheDocument();
    expect(within(card("r2")).getByRole("img", { name: "3 more steps after" })).toBeInTheDocument();
    // The active sub task (first unstated, #3) is in the window and current.
    expect(within(card("r2")).getByRole("img", { name: "Idempotent events, step 3 of 7, active" })).toHaveAttribute("aria-current", "step");
    // Past the window the step is gone — only its stack speaks for it.
    expect(within(card("r2")).queryByRole("img", { name: "Meter backfill tool, step 6 of 7, pending" })).toBeNull();
    // Explicit states paint through: r12 has a done flag and an error status.
    expect(within(card("r12")).getByRole("img", { name: "Retention job, step 2 of 4, error" })).toBeInTheDocument();
    expect(within(card("r12")).getByText("1/4")).toBeInTheDocument();
  });

  it("subtaskMaxVisible widens the window", () => {
    renderBoard({ subtaskMaxVisible: 6 });
    expect(within(card("r2")).getByRole("img", { name: "Meter backfill tool, step 6 of 7, pending" })).toBeInTheDocument();
    expect(within(card("r2")).getByRole("img", { name: "1 more steps after" })).toBeInTheDocument();
    expect(within(card("r2")).queryByRole("img", { name: /before/ })).toBeNull();
  });

  it("subtaskMaxVisible narrows the window to one", () => {
    renderBoard({ subtaskMaxVisible: 1 });
    // One step dot + both stacks = 3.
    expect(dotsIn("r2")).toHaveLength(3);
    expect(within(card("r2")).getByRole("img", { name: "4 more steps after" })).toBeInTheDocument();
  });

  it("dots add no button and no tab stop, yet their click still opens the card", () => {
    const onCardOpen = vi.fn();
    renderBoard({ onCardOpen });
    const row = card("r2").querySelector("[data-card-subtasks]") as HTMLElement;
    expect(row.querySelector("button")).toBeNull();
    expect(row.querySelector('[tabindex="0"]')).toBeNull();
    fireEvent.click(within(row).getByRole("img", { name: "Idempotent events, step 3 of 7, active" }));
    expect(onCardOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "r2" }));
  });

  it("an empty sub task list is no row at all", () => {
    renderBoard({}, roadmap.cards.map((c) => (c.id === "r1" ? { ...c, subtasks: [] } : c)));
    expect(card("r1").querySelector("[data-card-subtasks]")).toBeNull();
  });

  it("the compact card layout shows the dots too", () => {
    const field = sampleTaskBoard.fieldOps();
    renderBoard({ cardLayout: "compact" }, field.cards, field.columns);
    const c = document.querySelector('[data-card-id="f3"]') as HTMLElement;
    expect(c.querySelector("[data-card-subtasks]")).not.toBeNull();
    expect(within(c).getByText("1/3")).toBeInTheDocument();
    expect(dotsIn("f3")).toHaveLength(3); // three sub tasks, no stacks
  });

  it("moves carry sub tasks through untouched", () => {
    const { onCardsChange } = renderBoard();
    // Keyboard move: grab r2, step to the next column, drop.
    card("r2").focus();
    key("r2", " ");
    key("r2", "ArrowRight");
    key("r2", " ");
    expect(onCardsChange).toHaveBeenCalled();
    const [next, move] = onCardsChange.mock.calls[0];
    expect(move.to.column).toBe("discovery");
    const r2 = next.find((c: TaskBoardCard) => c.id === "r2");
    expect(r2?.column).toBe("discovery");
    expect(r2?.subtasks).toHaveLength(7);
    expect(r2?.subtasks[0]).toEqual(roadmap.cards.find((c) => c.id === "r2")?.subtasks?.[0]);
  });

  it("the whole card remains the only accessible card control", () => {
    renderBoard();
    expect(screen.getAllByRole("application")).toHaveLength(1);
    // The group label is the count, not the raw "Workflow progress" default.
    expect(screen.queryByRole("group", { name: "Workflow progress" })).toBeNull();
  });
});

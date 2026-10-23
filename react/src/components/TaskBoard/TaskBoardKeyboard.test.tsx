import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard, type TaskBoardColumn, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const cardEl = (id: string) => document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
const live = () => document.querySelector("[data-taskboard-live]")!.textContent;
const key = (id: string, k: string, extra: KeyboardEventInit = {}) => fireEvent.keyDown(cardEl(id), { key: k, ...extra });

function renderBoard(props: Partial<TaskBoardProps> = {}, columns: TaskBoardColumn[] = roadmap.columns) {
  const onCardsChange = vi.fn();
  const utils = render(
    <TaskBoard cards={roadmap.cards} columns={columns} onCardsChange={onCardsChange} {...props} />,
  );
  return { ...utils, onCardsChange };
}

describe("TaskBoard keyboard", () => {
  it("Space grabs, ArrowRight moves, Space drops — and each step is announced", () => {
    const { onCardsChange } = renderBoard();
    key("r1", " ");
    expect(cardEl("r1").getAttribute("data-grabbed")).toBe("true");
    expect(live()).toContain("Picked up Persona-based onboarding paths");
    key("r1", "ArrowRight");
    expect(live()).toBe("Moved to Discovery, position 1 of 4");
    expect(document.activeElement).toBe(cardEl("r1"));
    key("r1", " ");
    expect(onCardsChange).toHaveBeenCalledTimes(1);
    expect(onCardsChange.mock.calls[0][1]).toEqual({
      cardId: "r1",
      from: { column: "ideas", lane: null, index: 0 },
      to: { column: "discovery", lane: null, index: 0 },
    });
    expect(live()).toBe("Dropped Persona-based onboarding paths in Discovery");
  });

  it("Escape after a grab emits nothing and announces the cancel", () => {
    const { onCardsChange } = renderBoard();
    key("r1", " ");
    key("r1", "ArrowRight");
    key("r1", "Escape");
    expect(onCardsChange).not.toHaveBeenCalled();
    expect(live()).toBe("Move cancelled");
    expect(cardEl("r1").closest("[data-bucket]")!.getAttribute("data-bucket")).toBe("ideas::");
  });

  it("Tab while a card is held cancels the grab — a held lock must never outlive focus", () => {
    const { onCardsChange } = renderBoard();
    key("r1", " ");
    key("r1", "ArrowRight");
    key("r1", "Tab");
    expect(document.querySelector("[data-grabbed]")).toBeNull();
    expect(live()).toBe("Move cancelled");
    expect(onCardsChange).not.toHaveBeenCalled();
  });

  it("ArrowRight skips a full column", () => {
    const columns = roadmap.columns.map((c) => (c.id === "discovery" ? { ...c, wipLimit: 3 } : c));
    renderBoard({}, columns);
    key("r1", " ");
    key("r1", "ArrowRight");
    expect(live()).toBe("Moved to Ready, position 1 of 4");
  });

  it("ArrowDown while grabbed reorders inside the column", () => {
    const { onCardsChange } = renderBoard();
    key("r1", " ");
    key("r1", "ArrowDown");
    expect(live()).toBe("Moved to Ideas, position 2 of 4");
    key("r1", " ");
    expect(onCardsChange.mock.calls[0][1].to).toEqual({ column: "ideas", lane: null, index: 1 });
  });

  it("a keyboard drop goes through onBeforeMove", async () => {
    const onBeforeMove = vi.fn(() => Promise.resolve(false));
    const { onCardsChange } = renderBoard({ onBeforeMove });
    key("r1", " ");
    key("r1", "ArrowRight");
    await act(async () => {
      key("r1", " ");
    });
    expect(onBeforeMove).toHaveBeenCalledTimes(1);
    expect(onCardsChange).not.toHaveBeenCalled();
  });

  it("arrows move focus between cards and columns when nothing is grabbed", () => {
    renderBoard();
    cardEl("r1").focus();
    key("r1", "ArrowDown");
    expect(document.activeElement).toBe(cardEl("r2"));
    key("r2", "ArrowRight");
    expect(document.activeElement).toBe(cardEl("r6"));
    key("r6", "ArrowUp");
    expect(document.activeElement).toBe(cardEl("r5"));
  });

  it("only one card is in the tab order (roving tabindex)", () => {
    renderBoard();
    const tabbable = [...document.querySelectorAll("[data-card-id]")].filter((e) => e.getAttribute("tabindex") === "0");
    expect(tabbable.map((e) => e.getAttribute("data-card-id"))).toEqual(["r1"]);
    cardEl("r1").focus();
    key("r1", "ArrowDown");
    const after = [...document.querySelectorAll("[data-card-id]")].filter((e) => e.getAttribute("tabindex") === "0");
    expect(after.map((e) => e.getAttribute("data-card-id"))).toEqual(["r2"]);
  });

  it("in RTL, ArrowLeft moves to the next column", () => {
    const onCardsChange = vi.fn();
    render(
      <div dir="rtl">
        <TaskBoard cards={roadmap.cards} columns={roadmap.columns} onCardsChange={onCardsChange} />
      </div>,
    );
    key("r1", " ");
    key("r1", "ArrowLeft");
    expect(live()).toBe("Moved to Discovery, position 1 of 4");
  });

  it("Shift+F10 opens the context menu payload", () => {
    const onCardContextMenu = vi.fn();
    renderBoard({ onCardContextMenu });
    key("r2", "F10", { shiftKey: true });
    expect(onCardContextMenu).toHaveBeenCalledWith(expect.objectContaining({ column: "ideas", index: 1 }));
  });

  it("a read-only board does not grab", () => {
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    key("r1", " ");
    expect(cardEl("r1").getAttribute("data-grabbed")).toBeNull();
  });

  it("the board is an application region with a role description", () => {
    renderBoard();
    const root = document.querySelector("[data-taskboard]")!;
    expect(root.getAttribute("role")).toBe("application");
    expect(root.getAttribute("aria-roledescription")).toBe("task board");
  });
});

describe("TaskBoard selection", () => {
  const cards: TaskBoardCard[] = roadmap.cards;
  it("click selects one; ctrl-click toggles; shift-click selects a range in the bucket", () => {
    const onSelectionChange = vi.fn();
    render(<TaskBoard cards={cards} columns={roadmap.columns} onSelectionChange={onSelectionChange} />);
    fireEvent.click(cardEl("r1"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1"]);
    fireEvent.click(cardEl("r3"), { ctrlKey: true });
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1", "r3"]);
    fireEvent.click(cardEl("r3"), { metaKey: true });
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1"]);
    // A ctrl/⌘-click moves the range anchor (file-manager convention), so
    // re-anchor on r1 before the shift-click.
    fireEvent.click(cardEl("r1"));
    fireEvent.click(cardEl("r4"), { shiftKey: true });
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1", "r2", "r3", "r4"]);
    expect(cardEl("r2").getAttribute("data-selected")).toBe("true");
  });

  it("a modifier click selects without opening", () => {
    const onCardOpen = vi.fn();
    render(<TaskBoard cards={cards} columns={roadmap.columns} onCardOpen={onCardOpen} />);
    fireEvent.click(cardEl("r1"), { ctrlKey: true });
    expect(onCardOpen).not.toHaveBeenCalled();
    fireEvent.click(cardEl("r1"));
    expect(onCardOpen).toHaveBeenCalledTimes(1);
  });

  it("controlled selectedIds wins", () => {
    render(<TaskBoard cards={cards} columns={roadmap.columns} selectedIds={["r5"]} onSelectionChange={() => {}} />);
    fireEvent.click(cardEl("r1"));
    expect(cardEl("r1").getAttribute("data-selected")).toBeNull();
    expect(cardEl("r5").getAttribute("data-selected")).toBe("true");
  });
});

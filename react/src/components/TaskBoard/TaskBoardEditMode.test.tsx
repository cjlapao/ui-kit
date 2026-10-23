import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, within } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardColumn, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const fieldOps = sampleTaskBoard.fieldOps();
const order = () => [...document.querySelectorAll("[data-column-target]")].map((e) => e.getAttribute("data-column-target"));
const grip = (id: string) => document.querySelector(`[data-column-grip="${id}"]`) as HTMLElement;
const live = () => document.querySelector("[data-taskboard-live]")!.textContent;

function renderBoard(props: Partial<TaskBoardProps> = {}) {
  const onColumnsChange = vi.fn();
  const utils = render(
    <TaskBoard cards={roadmap.cards} columns={roadmap.columns} onColumnsChange={onColumnsChange} editMode {...props} />,
  );
  return { ...utils, onColumnsChange };
}
const ids = (cols: TaskBoardColumn[]) => cols.map((c) => c.id);

/* Column i spans x ∈ [i*300, i*300+288], in DOM order. */
let restore: () => void;
beforeEach(() => {
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const id = this.getAttribute("data-column-target");
    if (id) {
      const i = order().indexOf(id);
      const left = i * 300;
      return { left, right: left + 288, width: 288, top: 0, bottom: 400, height: 400, x: left, y: 0, toJSON() {} } as DOMRect;
    }
    return original.call(this);
  };
  restore = () => {
    Element.prototype.getBoundingClientRect = original;
  };
});
afterEach(() => restore());

function pointer(type: string, x: number, y = 20) {
  fireEvent(window, new PointerEvent(type, { clientX: x, clientY: y, bubbles: true }));
}

describe("TaskBoard edit mode", () => {
  it("outside edit mode there are no grips and no add-column slot", () => {
    renderBoard({ editMode: false });
    expect(document.querySelector("[data-column-grip]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add column" })).toBeNull();
  });

  it("edit mode needs onColumnsChange — without it nothing is editable", () => {
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} editMode />);
    expect(document.querySelector("[data-column-grip]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add column" })).toBeNull();
  });

  it("edit mode shows a grip per column, collapsed ones included, and an add-column slot", () => {
    renderBoard({ columns: roadmap.columns.map((c) => (c.id === "blocked" ? { ...c, collapsed: true } : c)) });
    for (const c of roadmap.columns) expect(grip(c.id)).toBeTruthy();
    expect(grip("ideas").getAttribute("aria-label")).toBe("Move Ideas");
    expect(screen.getByRole("button", { name: "Add column" })).toBeTruthy();
  });

  it("adds a column from its name: Enter commits, the id is slugged and unique", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.click(screen.getByRole("button", { name: "Add column" }));
    const input = screen.getByRole("textbox", { name: "Column name" });
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: "Ready" } });
    fireEvent.keyDown(input, { key: "Enter" });
    const next = onColumnsChange.mock.calls[0][0] as TaskBoardColumn[];
    expect(next.length).toBe(roadmap.columns.length + 1);
    expect(next[next.length - 1]).toEqual({ id: "ready-2", title: "Ready" });
    // The slot goes back to its button, ready for the next column.
    expect(screen.getByRole("button", { name: "Add column" })).toBeTruthy();
  });

  it("Escape and a blank name add nothing", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.click(screen.getByRole("button", { name: "Add column" }));
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Column name" }), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Add column" }));
    const input = screen.getByRole("textbox", { name: "Column name" });
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onColumnsChange).not.toHaveBeenCalled();
  });

  it("drags a column by its grip: live reorder, one commit on drop", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
    pointer("pointermove", 30);
    pointer("pointermove", 310); // just inside Discovery (300..588) — swaps at once
    expect(document.querySelector("[data-taskboard-column-clone]")).toBeTruthy();
    expect(order().slice(0, 2)).toEqual(["discovery", "ideas"]);
    expect(document.querySelector('[data-column-target="ideas"]')!.getAttribute("data-column-dragging")).toBe("true");
    pointer("pointerup", 310);
    expect(onColumnsChange).toHaveBeenCalledTimes(1);
    expect(ids(onColumnsChange.mock.calls[0][0]).slice(0, 2)).toEqual(["discovery", "ideas"]);
    expect(document.querySelector("[data-taskboard-column-clone]")).toBeNull();
  });

  it("moving back over the column just passed swaps it back", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
    pointer("pointermove", 30);
    pointer("pointermove", 310);
    expect(order().slice(0, 2)).toEqual(["discovery", "ideas"]);
    // Discovery now sits at 0..288 — moving left into it swaps back.
    pointer("pointermove", 280);
    expect(order().slice(0, 2)).toEqual(["ideas", "discovery"]);
    pointer("pointerup", 280);
    expect(onColumnsChange).not.toHaveBeenCalled();
  });

  it("the drag clone is the whole column — header and cards — with no live hooks", () => {
    renderBoard();
    fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
    pointer("pointermove", 40);
    const clone = document.querySelector("[data-taskboard-column-clone]") as HTMLElement;
    expect(within(clone).getByText("Ideas")).toBeTruthy();
    expect(within(clone).getByText("Persona-based onboarding paths")).toBeTruthy();
    expect(within(clone).getByText("AI summary opt-in")).toBeTruthy();
    expect(clone.querySelector("[data-card-id], [data-bucket], [data-column-target], [data-column-grip]")).toBeNull();
    expect(clone.style.width).toBe("288px");
    expect(clone.style.height).toBe("400px");
    pointer("pointerup", 40);
  });

  it("a swap slides the columns into place (FLIP transform)", () => {
    const offset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft");
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get(this: HTMLElement) {
        const id = this.getAttribute("data-column-target");
        return id ? order().indexOf(id) * 300 : 0;
      },
    });
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
    try {
      renderBoard();
      fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
      pointer("pointermove", 30);
      pointer("pointermove", 310);
      // Discovery moved from x=300 to x=0: it starts drawn where it was.
      const discovery = document.querySelector('[data-column-target="discovery"]') as HTMLElement;
      expect(discovery.style.transform).toBe("translateX(300px)");
      pointer("pointerup", 310);
    } finally {
      raf.mockRestore();
      if (offset) Object.defineProperty(HTMLElement.prototype, "offsetLeft", offset);
    }
  });

  it("dropping a column where it started emits nothing", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
    pointer("pointermove", 40);
    pointer("pointerup", 40);
    expect(onColumnsChange).not.toHaveBeenCalled();
  });

  it("Escape cancels a column drag", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.pointerDown(grip("ideas"), { clientX: 20, clientY: 20, button: 0 });
    pointer("pointermove", 30);
    pointer("pointermove", 760);
    fireEvent.keyDown(window, { key: "Escape" });
    pointer("pointerup", 760);
    expect(onColumnsChange).not.toHaveBeenCalled();
    expect(order()[0]).toBe("ideas");
  });

  it("keyboard: Space picks a column up, arrows move it, Space drops — announced", () => {
    const { onColumnsChange } = renderBoard();
    grip("ideas").focus();
    fireEvent.keyDown(grip("ideas"), { key: " " });
    expect(live()).toContain("Picked up Ideas");
    fireEvent.keyDown(grip("ideas"), { key: "ArrowRight" });
    fireEvent.keyDown(grip("ideas"), { key: "ArrowRight" });
    expect(live()).toBe("Ideas moved to position 3 of 5");
    expect(document.activeElement).toBe(grip("ideas"));
    fireEvent.keyDown(grip("ideas"), { key: " " });
    expect(ids(onColumnsChange.mock.calls[0][0])).toEqual(["discovery", "ready", "ideas", "building", "blocked"]);
  });

  it("keyboard: Escape and Tab cancel a column move", () => {
    const { onColumnsChange } = renderBoard();
    fireEvent.keyDown(grip("ideas"), { key: " " });
    fireEvent.keyDown(grip("ideas"), { key: "ArrowRight" });
    fireEvent.keyDown(grip("ideas"), { key: "Escape" });
    expect(live()).toBe("Move cancelled");
    fireEvent.keyDown(grip("ideas"), { key: " " });
    fireEvent.keyDown(grip("ideas"), { key: "ArrowRight" });
    fireEvent.keyDown(grip("ideas"), { key: "Tab" });
    expect(onColumnsChange).not.toHaveBeenCalled();
    expect(order()[0]).toBe("ideas");
  });

  it("the lanes layout reorders columns from the header row and can add columns", () => {
    const onColumnsChange = vi.fn();
    render(
      <TaskBoard
        layout="lanes"
        editMode
        cards={fieldOps.cards}
        columns={fieldOps.columns}
        lanes={fieldOps.lanes}
        onColumnsChange={onColumnsChange}
      />,
    );
    const header = document.querySelector('[data-lane-column-header="intake"]') as HTMLElement;
    expect(within(header).getByRole("button", { name: "Move Intake" })).toBeTruthy();
    fireEvent.keyDown(grip("intake"), { key: " " });
    fireEvent.keyDown(grip("intake"), { key: "ArrowRight" });
    fireEvent.keyDown(grip("intake"), { key: " " });
    expect(ids(onColumnsChange.mock.calls[0][0]).slice(0, 2)).toEqual(["scheduled", "intake"]);
    expect(screen.getByRole("button", { name: "Add column" })).toBeTruthy();
  });
});

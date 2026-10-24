import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, within } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardColumn, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const fieldOps = sampleTaskBoard.fieldOps();
const column = (id: string) => document.querySelector(`[data-column-id="${id}"]`) as HTMLElement;
const addIn = (id: string) => within(column(id)).queryByRole("button", { name: /Add card/ });
const live = () => document.querySelector("[data-taskboard-live]")!.textContent;
const withMax = (id: string, maxItems: number) =>
  roadmap.columns.map((c): TaskBoardColumn => (c.id === id ? { ...c, maxItems } : c));

function renderBoard(props: Partial<TaskBoardProps> = {}) {
  const onCardsChange = vi.fn();
  render(
    <TaskBoard cards={roadmap.cards} columns={roadmap.columns} onCardsChange={onCardsChange} onAddCard={() => {}} {...props} />,
  );
  return { onCardsChange };
}

describe("TaskBoard max items", () => {
  it("a column at its maxItems hides Add card; one below keeps it", () => {
    // Ideas holds 4, Discovery 3.
    renderBoard({ columns: roadmap.columns.map((c) => (c.id === "ideas" ? { ...c, maxItems: 4 } : c.id === "discovery" ? { ...c, maxItems: 4 } : c)) });
    expect(addIn("ideas")).toBeNull();
    expect(column("ideas").getAttribute("data-full")).toBe("true");
    expect(addIn("discovery")).toBeTruthy();
    expect(column("discovery").hasAttribute("data-full")).toBe(false);
  });

  it("the board-wide maxItems applies to every column, and a column's own value overrides it", () => {
    renderBoard({ maxItems: 3, columns: withMax("building", 10) });
    expect(addIn("ideas")).toBeNull(); // 4 ≥ 3
    expect(addIn("discovery")).toBeNull(); // 3 ≥ 3
    expect(addIn("blocked")).toBeTruthy(); // 2 < 3
    expect(addIn("building")).toBeTruthy(); // own max 10
  });

  it("shows count / max when the column has no WIP limit", () => {
    renderBoard({ columns: withMax("discovery", 5) });
    expect(column("discovery").querySelector("[data-column-count]")!.textContent).toBe("3 / 5");
  });

  it("a full column refuses a keyboard move — the arrow skips it", () => {
    renderBoard({ columns: withMax("discovery", 3) });
    fireEvent.keyDown(document.querySelector('[data-card-id="r1"]')!, { key: " " });
    fireEvent.keyDown(document.querySelector('[data-card-id="r1"]')!, { key: "ArrowRight" });
    expect(live()).toBe("Moved to Ready, position 1 of 4");
  });

  it("lanes: a full column hides the Add card button in every lane cell", () => {
    render(
      <TaskBoard
        layout="lanes"
        cards={fieldOps.cards}
        columns={fieldOps.columns.map((c) => (c.id === "intake" ? { ...c, maxItems: 4 } : c))}
        lanes={fieldOps.lanes}
        onAddCard={() => {}}
      />,
    );
    expect(screen.queryByRole("button", { name: /Add card — Intake/ })).toBeNull();
    expect(screen.getAllByRole("button", { name: /Add card — Scheduled/ }).length).toBe(fieldOps.lanes!.length);
  });
});

describe("TaskBoard column editor — max items", () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 100, left: 100, right: 400, bottom: 260, width: 300, height: 160, x: 100, y: 100, toJSON: () => ({}),
    } as DOMRect);
  });
  afterEach(() => vi.restoreAllMocks());

  async function openEditor(columns: TaskBoardColumn[], onColumnsChange = vi.fn()) {
    render(<TaskBoard cards={roadmap.cards} columns={columns} onColumnsChange={onColumnsChange} editMode />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Ready" }));
    return { dialog: await screen.findByRole("dialog"), onColumnsChange };
  }
  const saved = (fn: ReturnType<typeof vi.fn>) => (fn.mock.calls[0][0] as TaskBoardColumn[]).find((c) => c.id === "ready")!;

  it("is prefilled and saved", async () => {
    const { dialog, onColumnsChange } = await openEditor(withMax("ready", 6));
    const input = within(dialog).getByRole("spinbutton", { name: "Max items" });
    expect(input).toHaveValue(6);
    fireEvent.change(input, { target: { value: "8" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(saved(onColumnsChange).maxItems).toBe(8);
  });

  it("clearing it removes the column's own cap", async () => {
    const { dialog, onColumnsChange } = await openEditor(withMax("ready", 6));
    fireEvent.change(within(dialog).getByRole("spinbutton", { name: "Max items" }), { target: { value: "" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect("maxItems" in saved(onColumnsChange)).toBe(false);
  });

  it("a cap below 1 cannot be saved", async () => {
    const { dialog } = await openEditor(roadmap.columns);
    fireEvent.change(within(dialog).getByRole("spinbutton", { name: "Max items" }), { target: { value: "0" } });
    expect(within(dialog).getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

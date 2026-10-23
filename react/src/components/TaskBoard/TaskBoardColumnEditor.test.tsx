import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen, within } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardColumn, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const fieldOps = sampleTaskBoard.fieldOps();

function renderBoard(props: Partial<TaskBoardProps> = {}) {
  const onColumnsChange = vi.fn();
  render(
    <TaskBoard cards={roadmap.cards} columns={roadmap.columns} onColumnsChange={onColumnsChange} editMode {...props} />,
  );
  return { onColumnsChange };
}

async function openEditor(name: string) {
  fireEvent.click(screen.getByRole("button", { name: `Edit ${name}` }));
  return screen.findByRole("dialog");
}
const edited = (fn: ReturnType<typeof vi.fn>, id: string) =>
  (fn.mock.calls[0][0] as TaskBoardColumn[]).find((c) => c.id === id)!;

describe("TaskBoard column editor", () => {
  it("there is no edit button outside edit mode", () => {
    renderBoard({ editMode: false });
    expect(screen.queryByRole("button", { name: "Edit Ideas" })).toBeNull();
  });

  it("every column gets an edit button in edit mode, collapsed strips and the lanes header included", () => {
    renderBoard({ columns: roadmap.columns.map((c) => (c.id === "blocked" ? { ...c, collapsed: true } : c)) });
    for (const c of roadmap.columns) expect(screen.getByRole("button", { name: `Edit ${c.title}` })).toBeTruthy();
  });

  it("the lanes layout has the edit button in the header row", () => {
    render(
      <TaskBoard layout="lanes" editMode cards={fieldOps.cards} columns={fieldOps.columns} lanes={fieldOps.lanes} onColumnsChange={() => {}} />,
    );
    const header = document.querySelector('[data-lane-column-header="intake"]') as HTMLElement;
    expect(within(header).getByRole("button", { name: "Edit Intake" })).toBeTruthy();
  });

  it("opens prefilled with the column's properties", async () => {
    const columns = roadmap.columns.map((c) =>
      c.id === "ready" ? { ...c, wipLimit: 4, locked: true, accepts: ["discovery"], color: "rose" as const } : c,
    );
    renderBoard({ columns });
    const dialog = await openEditor("Ready");
    expect(within(dialog).getByRole("textbox", { name: "Column name" })).toHaveValue("Ready");
    expect(within(dialog).getByRole("spinbutton", { name: "WIP limit" })).toHaveValue(4);
    expect(within(dialog).getByRole("switch", { name: /Locked/ })).toBeChecked();
    expect(within(dialog).getByRole("checkbox", { name: "Discovery" })).toBeChecked();
    expect(within(dialog).getByRole("checkbox", { name: "Ideas" })).not.toBeChecked();
    // A column cannot list itself as a source.
    expect(within(dialog).queryByRole("checkbox", { name: "Ready" })).toBeNull();
    expect(within(dialog).getByRole("button", { name: "rose" })).toHaveAttribute("aria-pressed", "true");
  });

  it("Save commits every property through onColumnsChange and closes", async () => {
    const { onColumnsChange } = renderBoard();
    const dialog = await openEditor("Ideas");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Column name" }), { target: { value: "Backlog" } });
    fireEvent.change(within(dialog).getByRole("spinbutton", { name: "WIP limit" }), { target: { value: "3" } });
    fireEvent.click(within(dialog).getByRole("switch", { name: /Locked/ }));
    fireEvent.click(within(dialog).getByRole("checkbox", { name: "Discovery" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "violet" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(onColumnsChange).toHaveBeenCalledTimes(1);
    expect(edited(onColumnsChange, "ideas")).toEqual({
      id: "ideas",
      title: "Backlog",
      color: "violet",
      wipLimit: 3,
      locked: true,
      accepts: ["discovery"],
    });
    // Other columns untouched, order kept.
    expect((onColumnsChange.mock.calls[0][0] as TaskBoardColumn[]).map((c) => c.id)).toEqual(roadmap.columns.map((c) => c.id));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clearing the limit and unticking every source removes those properties", async () => {
    const columns = roadmap.columns.map((c) => (c.id === "ready" ? { ...c, wipLimit: 4, accepts: ["discovery"] } : c));
    const { onColumnsChange } = renderBoard({ columns });
    const dialog = await openEditor("Ready");
    fireEvent.change(within(dialog).getByRole("spinbutton", { name: "WIP limit" }), { target: { value: "" } });
    fireEvent.click(within(dialog).getByRole("checkbox", { name: "Discovery" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    const ready = edited(onColumnsChange, "ready");
    expect("wipLimit" in ready).toBe(false);
    expect("accepts" in ready).toBe(false);
  });

  it("Enter in the name field saves", async () => {
    const { onColumnsChange } = renderBoard();
    const dialog = await openEditor("Ideas");
    const name = within(dialog).getByRole("textbox", { name: "Column name" });
    fireEvent.change(name, { target: { value: "Inbox" } });
    fireEvent.keyDown(name, { key: "Enter" });
    expect(edited(onColumnsChange, "ideas").title).toBe("Inbox");
  });

  it("Cancel closes without a change", async () => {
    const { onColumnsChange } = renderBoard();
    const dialog = await openEditor("Ideas");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Column name" }), { target: { value: "Nope" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(onColumnsChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a blank name or a limit below 1 cannot be saved", async () => {
    const { onColumnsChange } = renderBoard();
    const dialog = await openEditor("Ideas");
    const save = within(dialog).getByRole("button", { name: "Save" });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Column name" }), { target: { value: "  " } });
    expect(save).toBeDisabled();
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Column name" }), { target: { value: "Ideas" } });
    fireEvent.change(within(dialog).getByRole("spinbutton", { name: "WIP limit" }), { target: { value: "0" } });
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(onColumnsChange).not.toHaveBeenCalled();
  });
});

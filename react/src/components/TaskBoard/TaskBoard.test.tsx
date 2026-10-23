import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { SURFACE_VARIANTS } from "../../theme/Theme";
import { TaskBoard, sampleTaskBoard, type TaskBoardProps } from "./index";

const roadmap = sampleTaskBoard.roadmap();

function renderBoard(props: Partial<TaskBoardProps> = {}) {
  return render(
    <TaskBoard
      cards={roadmap.cards}
      columns={roadmap.columns}
      priorities={roadmap.priorities}
      title="Horizon Roadmap"
      {...props}
    />,
  );
}

const column = (id: string) => document.querySelector(`[data-column-id="${id}"]`) as HTMLElement;

describe("TaskBoard — columns layout", () => {
  it("renders every column with its title and count", () => {
    renderBoard();
    for (const col of roadmap.columns) {
      const el = column(col.id);
      expect(el).toBeTruthy();
      expect(within(el).getByText(col.title)).toBeTruthy();
    }
    expect(column("ideas").querySelector("[data-column-count]")!.textContent).toBe("4");
  });

  it("shows the WIP readout and marks a full column", () => {
    const columns = roadmap.columns.map((c) => (c.id === "ready" ? { ...c, wipLimit: 3 } : c));
    renderBoard({ columns });
    const ready = column("ready");
    expect(ready.querySelector("[data-column-count]")!.textContent).toBe("3 / 3");
    expect(ready.getAttribute("data-wip")).toBe("full");
  });

  it("detailed cards show tags, priority, checklist and due date", () => {
    renderBoard();
    const card = document.querySelector('[data-card-id="r5"]') as HTMLElement;
    expect(card.getAttribute("data-card-layout")).toBe("detailed");
    expect(within(card).getByText("mobile")).toBeTruthy();
    expect(within(card).getByText("P2")).toBeTruthy();
    expect(within(card).getByText("1/3")).toBeTruthy();
    expect(card.querySelector("[data-card-due]")).toBeTruthy();
  });

  it("compact cards put the avatar in the title row", () => {
    const f = sampleTaskBoard.fieldOps();
    render(<TaskBoard cards={f.cards} columns={f.columns} priorities={f.priorities} cardLayout="compact" />);
    const card = document.querySelector('[data-card-id="f1"]') as HTMLElement;
    expect(card.getAttribute("data-card-layout")).toBe("compact");
    expect(card.querySelector("[data-card-title-row] [data-card-avatars]")).toBeTruthy();
    expect(within(card).getByText("2p")).toBeTruthy();
  });

  it.each(SURFACE_VARIANTS)("renders inside Panel with the %s variant", (variant) => {
    const { container } = renderBoard({ variant });
    expect(container.querySelector("[data-taskboard]")).toBeTruthy();
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("plain renders no Panel chrome", () => {
    const { container } = renderBoard({ variant: "plain" });
    expect(container.querySelector("[data-taskboard]")).toBeTruthy();
    expect(container.querySelector("section")).toBeNull();
  });

  it("loading renders the column-shaped skeleton and aria-busy", () => {
    renderBoard({ loading: true });
    expect(document.querySelector("[data-taskboard]")!.getAttribute("aria-busy")).toBe("true");
    expect(document.querySelector("[data-taskboard-skeleton]")).toBeTruthy();
    expect(document.querySelector('[data-card-id="r1"]')).toBeNull();
  });

  it("error renders the message and a Retry that calls onRetry", () => {
    const onRetry = vi.fn();
    renderBoard({ error: "Board service is down", onRetry });
    expect(screen.getByText("Board service is down")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("error: true uses the built-in message", () => {
    renderBoard({ error: true });
    expect(screen.getByText("Couldn’t load the board")).toBeTruthy();
  });

  it("no cards renders the empty state and keeps the columns", () => {
    renderBoard({ cards: [] });
    expect(screen.getByText("No cards yet")).toBeTruthy();
    expect(column("ideas")).toBeTruthy();
    renderBoard({ cards: [], emptyState: <span>Nothing planned</span> });
    expect(screen.getByText("Nothing planned")).toBeTruthy();
  });

  it("the collapse caret emits collapsed columns and a collapsed column is a strip", () => {
    vi.useFakeTimers();
    const onColumnsChange = vi.fn();
    const { rerender } = renderBoard({ onColumnsChange });
    fireEvent.click(within(column("ideas")).getByRole("button", { name: "Collapse Ideas" }));
    const next = onColumnsChange.mock.calls[0][0];
    expect(next.find((c: { id: string }) => c.id === "ideas").collapsed).toBe(true);
    rerender(<TaskBoard cards={roadmap.cards} columns={next} onColumnsChange={onColumnsChange} />);
    expect(column("ideas").getAttribute("data-collapsed")).toBe("true");
    act(() => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();
    expect(column("ideas").querySelector('[data-card-id="r1"]')).toBeNull();
    expect(within(column("ideas")).getByRole("button", { name: "Expand Ideas" })).toBeTruthy();
  });

  it("+ Add card emits the column", () => {
    const onAddCard = vi.fn();
    renderBoard({ onAddCard });
    fireEvent.click(within(column("ideas")).getByRole("button", { name: /Add card/ }));
    expect(onAddCard).toHaveBeenCalledWith({ column: "ideas", lane: null });
  });

  it("no Add card button without onAddCard", () => {
    renderBoard();
    expect(screen.queryByRole("button", { name: /Add card/ })).toBeNull();
  });

  it("click opens a card, right-click emits the context-menu payload", () => {
    const onCardOpen = vi.fn();
    const onCardContextMenu = vi.fn();
    renderBoard({ onCardOpen, onCardContextMenu });
    const card = document.querySelector('[data-card-id="r2"]') as HTMLElement;
    fireEvent.click(card);
    expect(onCardOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "r2" }));
    fireEvent.contextMenu(card, { clientX: 40, clientY: 50 });
    const payload = onCardContextMenu.mock.calls[0][0];
    expect(payload).toMatchObject({ column: "ideas", lane: null, index: 1, x: 40, y: 50 });
    expect(payload.card.id).toBe("r2");
    expect(payload.event).toBeTruthy();
  });

  it("a card is a focusable button and Enter opens it", () => {
    const onCardOpen = vi.fn();
    renderBoard({ onCardOpen });
    const card = document.querySelector('[data-card-id="r3"]') as HTMLElement;
    expect(card.getAttribute("role")).toBe("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onCardOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "r3" }));
  });

  it("renderCard replaces the card body", () => {
    renderBoard({ renderCard: (card) => <b>custom {card.id}</b> });
    expect(screen.getByText("custom r1")).toBeTruthy();
  });

  it("renders the header title, subtitle, summary and actions", () => {
    renderBoard({ subtitle: "Q3 launch", summary: <span>22 initiatives</span>, actions: <button>Act</button> });
    expect(screen.getByText("Horizon Roadmap")).toBeTruthy();
    expect(screen.getByText("Q3 launch")).toBeTruthy();
    expect(screen.getByText("22 initiatives")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Act" })).toBeTruthy();
  });

  it("source never hardcodes neutral/slate text colours", () => {
    const dir = path.dirname(fileURLToPath(new URL(import.meta.url)));
    for (const f of fs.readdirSync(dir)) {
      if (!/^TaskBoard.*\.tsx$/.test(f) || f.includes(".test.")) continue;
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      expect(src, f).not.toMatch(/text-(slate|neutral)-\d/);
    }
  });
});

describe("TaskBoard — lanes layout", () => {
  const f = sampleTaskBoard.fieldOps();
  const renderLanes = (props: Partial<TaskBoardProps> = {}) =>
    render(
      <TaskBoard
        layout="lanes"
        cardLayout="compact"
        cards={f.cards}
        columns={f.columns}
        lanes={f.lanes}
        priorities={f.priorities}
        {...props}
      />,
    );

  it("renders the column header row and one row per lane with counts", () => {
    renderLanes();
    const headers = document.querySelectorAll("[data-lane-column-header]");
    expect([...headers].map((h) => h.getAttribute("data-lane-column-header"))).toEqual(f.columns.map((c) => c.id));
    expect(document.querySelectorAll("[data-lane-id]").length).toBe(f.lanes!.length);
    const north = document.querySelector('[data-lane-id="north"]') as HTMLElement;
    expect(within(north).getByText("North Region")).toBeTruthy();
    expect(north.querySelector("[data-lane-count]")!.textContent).toBe("6");
    const intake = document.querySelector('[data-lane-column-header="intake"]') as HTMLElement;
    expect(intake.querySelector("[data-column-count]")!.textContent).toBe("4");
  });

  it("places a card in its column × lane cell", () => {
    renderLanes();
    const cell = document.querySelector('[data-bucket="intake::north"]') as HTMLElement;
    expect(within(cell).getByText("Quote backup generator service")).toBeTruthy();
  });

  it("the lane caret emits collapsed lanes; a collapsed lane hides its cells and keeps its header", () => {
    const onLanesChange = vi.fn();
    const { rerender } = renderLanes({ onLanesChange });
    const north = () => document.querySelector('[data-lane-id="north"]') as HTMLElement;
    fireEvent.click(within(north()).getByRole("button", { name: "Collapse North Region" }));
    const next = onLanesChange.mock.calls[0][0];
    expect(next.find((l: { id: string }) => l.id === "north").collapsed).toBe(true);
    vi.useFakeTimers();
    rerender(<TaskBoard layout="lanes" cards={f.cards} columns={f.columns} lanes={next} onLanesChange={onLanesChange} />);
    expect(north().getAttribute("data-collapsed")).toBe("true");
    act(() => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();
    expect(document.querySelector('[data-bucket="intake::north"]')).toBeNull();
    expect(within(north()).getByText("North Region")).toBeTruthy();
  });

  it("add card in a lane cell emits column and lane", () => {
    const onAddCard = vi.fn();
    renderLanes({ onAddCard });
    const north = document.querySelector('[data-lane-id="north"]') as HTMLElement;
    fireEvent.click(within(north).getAllByRole("button", { name: /Add card/ })[0]);
    expect(onAddCard).toHaveBeenCalledWith({ column: "intake", lane: "north" });
  });
});

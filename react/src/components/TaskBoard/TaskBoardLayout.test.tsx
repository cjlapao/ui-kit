import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, within, act } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardColumn } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const fieldOps = sampleTaskBoard.fieldOps();
const column = (id: string) => document.querySelector(`[data-column-id="${id}"]`) as HTMLElement;
const collapse = (cols: TaskBoardColumn[], id: string, collapsed = true) =>
  cols.map((c) => (c.id === id ? { ...c, collapsed } : c));

afterEach(() => vi.useRealTimers());

describe("TaskBoard layout — equal columns", () => {
  it("the column row stretches every column, collapsed strips included, to the tallest", () => {
    render(<TaskBoard cards={roadmap.cards} columns={collapse(roadmap.columns, "ready")} />);
    const row = document.querySelector("[data-taskboard-columns]") as HTMLElement;
    expect(row.className).toContain("items-stretch");
    for (const col of roadmap.columns) {
      expect(column(col.id).className).not.toMatch(/\bmax-h-full\b|\bself-start\b/);
    }
  });

  it("uses the size width by default and accepts numeric or CSS column widths", () => {
    const { rerender } = render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} size="sm" />);
    expect(column("ideas").style.width).toBe("248px");

    rerender(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} columnWidth={336} />);
    expect(column("ideas").style.width).toBe("336px");
    expect((column("ideas").querySelector("[data-column-body]") as HTMLElement).style.width).toBe("336px");

    rerender(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} columnWidth="21rem" />);
    expect(column("ideas").style.width).toBe("21rem");
  });

  it("falls back to the size width for auto and invalid numeric widths", () => {
    const { rerender } = render(
      <TaskBoard cards={roadmap.cards} columns={roadmap.columns} size="lg" columnWidth="auto" />,
    );
    expect(column("ideas").style.width).toBe("320px");

    rerender(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} size="lg" columnWidth={0} />);
    expect(column("ideas").style.width).toBe("320px");

    rerender(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} size="lg" columnWidth="  " />);
    expect(column("ideas").style.width).toBe("320px");
  });

  it("adds breathing room above the first card inside each column scroller", () => {
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    const content = column("ideas").querySelector('[data-slot="scrollarea-content"]') as HTMLElement;
    expect(content).toHaveClass("pt-1");
  });

  it("uses the column width override for the loading skeleton", () => {
    render(
      <TaskBoard
        cards={roadmap.cards}
        columns={roadmap.columns}
        loading
        loaderType="skeleton"
        columnWidth="19rem"
      />,
    );
    const skeleton = document.querySelector("[data-taskboard-skeleton]") as HTMLElement;
    expect((skeleton.firstElementChild as HTMLElement).style.width).toBe("19rem");
  });
});

describe("TaskBoard layout — ScrollArea", () => {
  it("the board and every open column scroll through ScrollArea with hover-only bars", () => {
    render(<TaskBoard cards={roadmap.cards} columns={collapse(roadmap.columns, "blocked")} />);
    const areas = [...document.querySelectorAll('[data-taskboard-scroll][data-slot="scrollarea"]')];
    // 1 board scroller + 4 open columns (Blocked is collapsed — nothing to scroll).
    expect(areas.length).toBe(5);
    for (const a of areas) expect(a.getAttribute("data-variant")).toBe("hover");
    expect(column("ideas").querySelector('[data-slot="scrollarea"] [data-bucket="ideas::"]')).toBeTruthy();
  });

  it("the lane grid scrolls through one ScrollArea with hover-only bars", () => {
    render(<TaskBoard layout="lanes" cards={fieldOps.cards} columns={fieldOps.columns} lanes={fieldOps.lanes} />);
    const areas = [...document.querySelectorAll('[data-taskboard-scroll][data-slot="scrollarea"]')];
    expect(areas.length).toBe(1);
    expect(areas[0].getAttribute("data-variant")).toBe("hover");
  });

  it("drag auto-scroll moves the ScrollArea viewport near its edge", () => {
    const { container } = render(
      <TaskBoard cards={roadmap.cards} columns={roadmap.columns} onCardsChange={() => {}} />,
    );
    const frame = container.querySelector('[data-taskboard-columns]')!.closest('[data-slot="scrollarea"]')!;
    const viewport = frame.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement;
    Object.defineProperty(viewport, "scrollWidth", { configurable: true, value: 3000 });
    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 1000 });
    const rect = { top: 0, left: 0, right: 1000, bottom: 600, width: 1000, height: 600, x: 0, y: 0, toJSON() {} } as DOMRect;
    for (const el of [frame, viewport]) (el as HTMLElement).getBoundingClientRect = () => rect;
    let frameCb: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frameCb = cb;
      return 1;
    });
    const card = document.querySelector('[data-card-id="r1"]') as HTMLElement;
    fireEvent.pointerDown(card, { clientX: 100, clientY: 100, button: 0 });
    fireEvent(window, new PointerEvent("pointermove", { clientX: 120, clientY: 100 }));
    fireEvent(window, new PointerEvent("pointermove", { clientX: 990, clientY: 300 }));
    act(() => frameCb?.(0));
    expect(viewport.scrollLeft).toBeGreaterThan(0);
    fireEvent(window, new PointerEvent("pointerup", { clientX: 990, clientY: 300 }));
  });
});

describe("TaskBoard layout — collapse animation", () => {
  it("a collapsing column animates its width and keeps its cards until the animation ends", () => {
    vi.useFakeTimers();
    const { rerender } = render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} onColumnsChange={() => {}} />);
    expect(column("ideas").className).toContain("transition-[width]");
    rerender(<TaskBoard cards={roadmap.cards} columns={collapse(roadmap.columns, "ideas")} onColumnsChange={() => {}} />);
    const ideas = column("ideas");
    expect(ideas.style.width).toBe("44px");
    // Mid-animation: still mounted, but inert so focus and drops skip it.
    expect(ideas.querySelector('[data-card-id="r1"]')).toBeTruthy();
    expect(ideas.querySelector("[data-column-body]")!.hasAttribute("inert")).toBe(true);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(column("ideas").querySelector('[data-card-id="r1"]')).toBeNull();
  });

  it("expanding mounts the cards at once and animates back to full width", () => {
    const { rerender } = render(
      <TaskBoard cards={roadmap.cards} columns={collapse(roadmap.columns, "ideas")} onColumnsChange={() => {}} />,
    );
    expect(column("ideas").querySelector('[data-card-id="r1"]')).toBeNull();
    rerender(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} onColumnsChange={() => {}} />);
    expect(column("ideas").querySelector('[data-card-id="r1"]')).toBeTruthy();
    expect(column("ideas").style.width).toBe("288px");
  });

  it("a collapsing lane animates its row height (grid rows 1fr → 0fr)", () => {
    vi.useFakeTimers();
    const lanes = fieldOps.lanes!;
    const props = { layout: "lanes" as const, cards: fieldOps.cards, columns: fieldOps.columns, onLanesChange: () => {} };
    const { rerender } = render(<TaskBoard {...props} lanes={lanes} />);
    const cell = () => document.querySelector('[data-lane-id="north"] [data-lane-cell]') as HTMLElement;
    expect(cell().className).toContain("grid-rows-[1fr]");
    rerender(<TaskBoard {...props} lanes={lanes.map((l) => (l.id === "north" ? { ...l, collapsed: true } : l))} />);
    expect(cell().className).toContain("grid-rows-[0fr]");
    expect(within(document.querySelector('[data-lane-id="north"]') as HTMLElement).getByText("Quote backup generator service")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(document.querySelector('[data-bucket="intake::north"]')).toBeNull();
  });

  it("the lane grid animates column widths when a column collapses", () => {
    render(<TaskBoard layout="lanes" cards={fieldOps.cards} columns={fieldOps.columns} lanes={fieldOps.lanes} />);
    expect((document.querySelector("[data-lane-grid]") as HTMLElement).className).toContain("transition-[grid-template-columns]");
  });

  it("uses the column width override for lane tracks while keeping collapsed tracks narrow", () => {
    const columns = collapse(fieldOps.columns, fieldOps.columns[0].id);
    render(
      <TaskBoard
        layout="lanes"
        cards={fieldOps.cards}
        columns={columns}
        lanes={fieldOps.lanes}
        columnWidth="22rem"
      />,
    );
    const grid = document.querySelector("[data-lane-grid]") as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain("44px");
    expect(grid.style.gridTemplateColumns).toContain("22rem");
  });
});

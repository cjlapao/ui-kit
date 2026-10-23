import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { getSurfaceCornerClass, SURFACE_CORNERS } from "../../theme/Theme";
import { getTaskBoardCardToneTokens } from "../../../../common/taskboard";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard } from "./index";

const roadmap = sampleTaskBoard.roadmap();
const column = (id: string) => document.querySelector(`[data-column-id="${id}"]`) as HTMLElement;
const cardEl = (id: string) => document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
const hasAll = (el: Element, classes: string) => classes.split(" ").every((c) => el.classList.contains(c));

describe("TaskBoard corners", () => {
  it("columns default to the md container corner", () => {
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    expect(column("ideas").classList.contains(getSurfaceCornerClass("rounded-md"))).toBe(true);
  });

  it.each(SURFACE_CORNERS.filter((c) => c !== "auto"))("columnCorner=%s rounds every column, collapsed ones too", (corner) => {
    const columns = roadmap.columns.map((c) => (c.id === "blocked" ? { ...c, collapsed: true } : c));
    render(<TaskBoard cards={roadmap.cards} columns={columns} columnCorner={corner} />);
    for (const c of columns) expect(column(c.id).classList.contains(getSurfaceCornerClass(corner))).toBe(true);
  });

  it("the loading skeleton wells follow columnCorner", () => {
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} loading columnCorner="none" />);
    const well = document.querySelector("[data-taskboard-skeleton] > div")!;
    expect(well.classList.contains("rounded-none")).toBe(true);
  });

  it("the board's Panel defaults to the md corner", () => {
    const { container } = render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    expect(container.querySelector("section")!.classList.contains(getSurfaceCornerClass("rounded-md"))).toBe(true);
  });
});

describe("TaskBoard card tone", () => {
  const toned: TaskBoardCard[] = roadmap.cards.map((c) =>
    c.id === "r1" ? { ...c, tone: "rose" } : c.id === "r2" ? { ...c, tone: "emerald" } : c,
  );

  it("a card's tone tints its surface, each card its own colour", () => {
    render(<TaskBoard cards={toned} columns={roadmap.columns} />);
    expect(cardEl("r1").getAttribute("data-tone")).toBe("rose");
    expect(hasAll(cardEl("r1"), getTaskBoardCardToneTokens("rose").solid)).toBe(true);
    expect(hasAll(cardEl("r2"), getTaskBoardCardToneTokens("emerald").solid)).toBe(true);
  });

  it("an untoned card keeps the neutral surface", () => {
    render(<TaskBoard cards={toned} columns={roadmap.columns} />);
    expect(cardEl("r3").hasAttribute("data-tone")).toBe(false);
    expect(cardEl("r3").classList.contains("bg-white")).toBe(true);
  });

  it("on a translucent board a toned card uses the glass tint", () => {
    render(<TaskBoard cards={toned} columns={roadmap.columns} variant="glass" />);
    expect(hasAll(cardEl("r1"), getTaskBoardCardToneTokens("rose").glass)).toBe(true);
    expect(cardEl("r1").classList.contains("bg-white")).toBe(false);
  });

  it("the drag clone keeps the card's tone", () => {
    render(<TaskBoard cards={toned} columns={roadmap.columns} onCardsChange={() => {}} />);
    fireEvent.pointerDown(cardEl("r1"), { clientX: 10, clientY: 10, button: 0 });
    fireEvent(window, new PointerEvent("pointermove", { clientX: 60, clientY: 60 }));
    const clone = document.querySelector("[data-taskboard-clone]")!;
    expect(hasAll(clone, getTaskBoardCardToneTokens("rose").solid)).toBe(true);
    fireEvent(window, new PointerEvent("pointerup", { clientX: 60, clientY: 60 }));
  });
});

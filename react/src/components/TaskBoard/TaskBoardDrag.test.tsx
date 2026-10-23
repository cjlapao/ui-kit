import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard, type TaskBoardColumn, type TaskBoardProps } from "./index";

/*
 * Layout mock: column i spans x ∈ [i*300, i*300+288]; inside a bucket the
 * n-th card (in DOM order) spans y ∈ [n*100, n*100+90]. elementFromPoint
 * resolves x to the column's bucket — enough for the drop math to run as it
 * does in a browser.
 */
const COLUMN_PITCH = 300;
const CARD_PITCH = 100;
const CARD_HEIGHT = 90;

let columnIds: string[] = [];

function installLayout() {
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const id = this.getAttribute("data-card-id");
    const bucket = this.closest("[data-bucket]");
    if (id && bucket) {
      const i = [...bucket.querySelectorAll("[data-card-id]")].indexOf(this);
      const col = columnIds.indexOf(bucket.getAttribute("data-bucket")!.split("::")[0]);
      const top = i * CARD_PITCH;
      const left = col * COLUMN_PITCH;
      return { top, bottom: top + CARD_HEIGHT, left, right: left + 288, width: 288, height: CARD_HEIGHT, x: left, y: top, toJSON() {} } as DOMRect;
    }
    return original.call(this);
  };
  (document as unknown as { elementFromPoint: (x: number, y: number) => Element | null }).elementFromPoint = (x: number) => {
    const col = columnIds[Math.floor(x / COLUMN_PITCH)];
    return col ? document.querySelector(`[data-bucket="${col}::"]`) : null;
  };
  return () => {
    Element.prototype.getBoundingClientRect = original;
  };
}

const roadmap = sampleTaskBoard.roadmap();
const cardEl = (id: string) => document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
const bucketIds = (col: string) =>
  [...document.querySelectorAll(`[data-bucket="${col}::"] [data-card-id]`)].map((e) => e.getAttribute("data-card-id"));

function pointer(type: string, x: number, y: number, extra: PointerEventInit = {}) {
  fireEvent(window, new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, ...extra }));
}

/** Press a card, move to (x, y) in two steps, optionally release. */
function drag(id: string, x: number, y: number, release = true) {
  fireEvent.pointerDown(cardEl(id), { clientX: 10, clientY: 10, button: 0, pointerId: 1 });
  pointer("pointermove", 20, 20);
  pointer("pointermove", x, y);
  if (release) pointer("pointerup", x, y);
}

function renderBoard(props: Partial<TaskBoardProps> = {}, cards: TaskBoardCard[] = roadmap.cards, columns: TaskBoardColumn[] = roadmap.columns) {
  columnIds = columns.map((c) => c.id);
  const onCardsChange = vi.fn();
  const utils = render(<TaskBoard cards={cards} columns={columns} onCardsChange={onCardsChange} {...props} />);
  return { ...utils, onCardsChange };
}

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

describe("TaskBoard pointer drag", () => {
  it("drag across columns commits one onCardsChange with the move", () => {
    const { onCardsChange } = renderBoard();
    drag("r1", COLUMN_PITCH + 10, 10);
    expect(onCardsChange).toHaveBeenCalledTimes(1);
    const [next, move] = onCardsChange.mock.calls[0];
    expect(move).toEqual({
      cardId: "r1",
      from: { column: "ideas", lane: null, index: 0 },
      to: { column: "discovery", lane: null, index: 0 },
    });
    expect(next.find((c: TaskBoardCard) => c.id === "r1").column).toBe("discovery");
  });

  it("shows a floating clone and a live preview while dragging", () => {
    renderBoard();
    drag("r1", COLUMN_PITCH + 10, 130, false);
    expect(document.querySelector("[data-taskboard-clone]")).toBeTruthy();
    expect(bucketIds("discovery")).toEqual(["r5", "r1", "r6", "r7"]);
    expect(cardEl("r1").getAttribute("data-dragging")).toBe("true");
    pointer("pointerup", COLUMN_PITCH + 10, 130);
    expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
  });

  it("text selection is suppressed during a drag and restored after", () => {
    renderBoard();
    document.body.style.userSelect = "text";
    drag("r1", COLUMN_PITCH + 10, 10, false);
    expect(document.body.style.userSelect).toBe("none");
    pointer("pointerup", COLUMN_PITCH + 10, 10);
    expect(document.body.style.userSelect).toBe("text");
    document.body.style.userSelect = "";
  });

  it("drop on origin emits nothing", () => {
    const { onCardsChange } = renderBoard();
    drag("r1", 10, 40);
    expect(onCardsChange).not.toHaveBeenCalled();
  });

  it("a full WIP column marks data-drop=invalid and the drop emits nothing", () => {
    const columns = roadmap.columns.map((c) => (c.id === "discovery" ? { ...c, wipLimit: 3 } : c));
    const { onCardsChange } = renderBoard({}, roadmap.cards, columns);
    drag("r1", COLUMN_PITCH + 10, 10, false);
    expect(document.querySelector('[data-bucket="discovery::"]')!.getAttribute("data-drop")).toBe("invalid");
    expect(bucketIds("discovery")).toEqual(["r5", "r6", "r7"]);
    pointer("pointerup", COLUMN_PITCH + 10, 10);
    expect(onCardsChange).not.toHaveBeenCalled();
  });

  it("onBeforeMove resolving false restores the original index and never emits", async () => {
    let resolve!: (v: boolean) => void;
    const onBeforeMove = vi.fn(() => new Promise<boolean>((r) => (resolve = r)));
    const { onCardsChange } = renderBoard({ onBeforeMove });
    drag("r2", COLUMN_PITCH + 10, 10);
    expect(onBeforeMove).toHaveBeenCalledTimes(1);
    expect(cardEl("r2").getAttribute("data-pending")).toBe("true");
    expect(bucketIds("discovery")[0]).toBe("r2");
    await act(async () => resolve(false));
    expect(onCardsChange).not.toHaveBeenCalled();
    expect(bucketIds("ideas")).toEqual(["r1", "r2", "r3", "r4"]);
    expect(cardEl("r2").getAttribute("data-pending")).toBeNull();
  });

  it("onBeforeMove throwing clears pending and never emits", async () => {
    const onBeforeMove = vi.fn(() => Promise.reject(new Error("nope")));
    const { onCardsChange } = renderBoard({ onBeforeMove });
    await act(async () => drag("r2", COLUMN_PITCH + 10, 10));
    expect(onCardsChange).not.toHaveBeenCalled();
    expect(cardEl("r2").getAttribute("data-pending")).toBeNull();
    expect(bucketIds("ideas")).toEqual(["r1", "r2", "r3", "r4"]);
  });

  it("onBeforeMove resolving true emits once", async () => {
    const onBeforeMove = vi.fn(() => Promise.resolve(true));
    const { onCardsChange } = renderBoard({ onBeforeMove });
    await act(async () => drag("r2", COLUMN_PITCH + 10, 10));
    expect(onCardsChange).toHaveBeenCalledTimes(1);
  });

  it("a new cards prop mid-drag keeps the drag alive and commits against the latest cards", () => {
    const { onCardsChange, rerender } = renderBoard();
    drag("r1", COLUMN_PITCH + 10, 10, false);
    const remote = roadmap.cards.map((c) => (c.id === "r16" ? { ...c, column: "ready" } : c));
    rerender(<TaskBoard cards={remote} columns={roadmap.columns} onCardsChange={onCardsChange} />);
    expect(document.querySelector("[data-taskboard-clone]")).toBeTruthy();
    pointer("pointermove", COLUMN_PITCH + 12, 10);
    pointer("pointerup", COLUMN_PITCH + 12, 10);
    expect(onCardsChange).toHaveBeenCalledTimes(1);
    const [next] = onCardsChange.mock.calls[0];
    expect(next.find((c: TaskBoardCard) => c.id === "r1").column).toBe("discovery");
    expect(next.find((c: TaskBoardCard) => c.id === "r16").column).toBe("ready");
  });

  it("Escape cancels", () => {
    const { onCardsChange } = renderBoard();
    drag("r1", COLUMN_PITCH + 10, 10, false);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
    pointer("pointerup", COLUMN_PITCH + 10, 10);
    expect(onCardsChange).not.toHaveBeenCalled();
    expect(bucketIds("ideas")[0]).toBe("r1");
  });

  it("a locked card does not start a drag", () => {
    const cards = roadmap.cards.map((c) => (c.id === "r1" ? { ...c, locked: true } : c));
    const { onCardsChange } = renderBoard({}, cards);
    drag("r1", COLUMN_PITCH + 10, 10);
    expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
    expect(onCardsChange).not.toHaveBeenCalled();
  });

  it("a read-only board does not drag", () => {
    columnIds = roadmap.columns.map((c) => c.id);
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    drag("r1", COLUMN_PITCH + 10, 10, false);
    expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
  });

  it("the click that ends a drag does not open the card", () => {
    const onCardOpen = vi.fn();
    renderBoard({ onCardOpen });
    drag("r1", COLUMN_PITCH + 10, 10);
    fireEvent.click(cardEl("r1"));
    expect(onCardOpen).not.toHaveBeenCalled();
    fireEvent.click(cardEl("r1"));
    expect(onCardOpen).toHaveBeenCalledTimes(1);
  });

  it("a touch press must hold before it drags", () => {
    vi.useFakeTimers();
    try {
      renderBoard();
      fireEvent.pointerDown(cardEl("r1"), { clientX: 10, clientY: 10, button: 0, pointerType: "touch" });
      pointer("pointermove", 10, 40, { pointerType: "touch" });
      expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
      pointer("pointerup", 10, 40, { pointerType: "touch" });

      fireEvent.pointerDown(cardEl("r1"), { clientX: 10, clientY: 10, button: 0, pointerType: "touch" });
      act(() => {
        vi.advanceTimersByTime(260);
      });
      pointer("pointermove", COLUMN_PITCH + 10, 10, { pointerType: "touch" });
      expect(document.querySelector("[data-taskboard-clone]")).toBeTruthy();
      pointer("pointerup", COLUMN_PITCH + 10, 10, { pointerType: "touch" });
    } finally {
      vi.useRealTimers();
    }
  });
});

import { describe, it, expect } from "vitest";
import { moveColumn, resolveColumnSwapIndex, uniqueColumnId, type TaskBoardColumn } from "../../../../common/taskboard";

const COLS: TaskBoardColumn[] = ["a", "b", "c", "d"].map((id) => ({ id, title: id.toUpperCase() }));
const ids = (cols: TaskBoardColumn[]) => cols.map((c) => c.id);

describe("moveColumn", () => {
  it("moves a column right", () => expect(ids(moveColumn(COLS, "a", 2))).toEqual(["b", "c", "a", "d"]));
  it("moves a column left", () => expect(ids(moveColumn(COLS, "d", 0))).toEqual(["d", "a", "b", "c"]));
  it("clamps past the end", () => expect(ids(moveColumn(COLS, "a", 99))).toEqual(["b", "c", "d", "a"]));
  it("same index returns the same order", () => expect(ids(moveColumn(COLS, "b", 1))).toEqual(["a", "b", "c", "d"]));
  it("unknown id returns the input", () => expect(moveColumn(COLS, "zz", 0)).toBe(COLS));
  it("never mutates the input", () => {
    moveColumn(COLS, "a", 3);
    expect(ids(COLS)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("uniqueColumnId", () => {
  it("slugs the title", () => expect(uniqueColumnId("Ready for QA", COLS)).toBe("ready-for-qa"));
  it("suffixes a taken id", () => {
    expect(uniqueColumnId("A", COLS)).toBe("a-2");
    expect(uniqueColumnId("A", [...COLS, { id: "a-2", title: "x" }])).toBe("a-3");
  });
  it("falls back when the title has no letters", () => expect(uniqueColumnId("!!!", COLS)).toBe("column"));
});

describe("resolveColumnSwapIndex", () => {
  // Preview order a b c d, 100px wide, 10px gaps; the dragged column is in the list.
  const rects = ["a", "b", "c", "d"].map((id, i) => ({ id, left: i * 110, width: 100 }));
  it("swaps as soon as the pointer enters the right neighbour while moving right", () =>
    expect(resolveColumnSwapIndex(rects, 112, "a", 0, 1)).toBe(1));
  it("swaps with the left neighbour while moving left", () =>
    expect(resolveColumnSwapIndex(rects, 330 + 98, "d", 3, -1)).toBe(3) /* still over itself */);
  it("swaps left as soon as the pointer enters the left neighbour", () =>
    expect(resolveColumnSwapIndex(rects, 318, "d", 3, -1)).toBe(2));
  it("a neighbour behind the direction of travel does not swap (no flip-flop)", () =>
    expect(resolveColumnSwapIndex(rects, 112, "a", 0, -1)).toBe(0));
  it("over the dragged column itself keeps the current target", () =>
    expect(resolveColumnSwapIndex(rects, 50, "a", 0, 1)).toBe(0));
  it("in a gap keeps the current target", () =>
    expect(resolveColumnSwapIndex(rects, 105, "a", 0, 1)).toBe(0));
  it("past the last column while moving right → the end", () =>
    expect(resolveColumnSwapIndex(rects, 900, "a", 0, 1)).toBe(3));
  it("before the first column while moving left → the start", () =>
    expect(resolveColumnSwapIndex(rects, -50, "d", 3, -1)).toBe(0));
  it("a wide column over a narrow strip settles after one swap", () => {
    // b is a 44px strip. Dragging a (288px) right: enter b → swap.
    const r1 = [{ id: "a", left: 0, width: 288 }, { id: "b", left: 298, width: 44 }];
    expect(resolveColumnSwapIndex(r1, 300, "a", 0, 1)).toBe(1);
    // After the swap b sits at 0..44 and a at 54..342: the pointer at 301 is over a — stable.
    const r2 = [{ id: "b", left: 0, width: 44 }, { id: "a", left: 54, width: 288 }];
    expect(resolveColumnSwapIndex(r2, 301, "a", 1, 1)).toBe(1);
  });
  it("RTL: array order runs right to left", () => {
    const rtl = ["a", "b", "c", "d"].map((id, i) => ({ id, left: 330 - i * 110, width: 100 }));
    // a is rightmost; moving left on screen = forward in the array.
    expect(resolveColumnSwapIndex(rtl, 300, "a", 0, -1, true)).toBe(1);
  });
});

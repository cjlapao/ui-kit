import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { TRUE_COLORS } from "../../../../common/theme/Theme";
import {
  applyMove,
  createTaskBoardHistory,
  getTaskBoardChipTokens,
  getTaskBoardColumnTokens,
  getTaskBoardPeerTokens,
  peerColor,
  type TaskBoardCard,
  type TaskBoardColumn,
  type TaskBoardMove,
} from "../../../../common/taskboard";
import { useTaskBoardText } from "./labels";

const COLS: TaskBoardColumn[] = [
  { id: "a", title: "A" },
  { id: "b", title: "B" },
];
const CARDS: TaskBoardCard[] = [
  { id: "1", title: "1", column: "a" },
  { id: "2", title: "2", column: "a" },
];
const MOVE: TaskBoardMove = {
  cardId: "1",
  from: { column: "a", lane: null, index: 0 },
  to: { column: "b", lane: null, index: 0 },
};

describe("createTaskBoardHistory", () => {
  it("undo then redo round-trips", () => {
    const h = createTaskBoardHistory();
    const moved = applyMove(CARDS, MOVE, COLS);
    h.push(MOVE);
    expect(h.canUndo).toBe(true);
    expect(h.size).toBe(1);
    const undone = h.undo(moved, COLS)!;
    expect(undone).toEqual(CARDS);
    expect(h.canRedo).toBe(true);
    expect(h.redo(undone, COLS)).toEqual(moved);
  });

  it("push after undo clears redo", () => {
    const h = createTaskBoardHistory();
    h.push(MOVE);
    h.undo(applyMove(CARDS, MOVE, COLS), COLS);
    h.push(MOVE);
    expect(h.canRedo).toBe(false);
  });

  it("undo on an empty stack returns null", () => {
    expect(createTaskBoardHistory().undo(CARDS, COLS)).toBeNull();
  });

  it("respects the limit", () => {
    const h = createTaskBoardHistory(2);
    h.push(MOVE);
    h.push(MOVE);
    h.push(MOVE);
    expect(h.size).toBe(2);
  });

  it("clear empties both stacks", () => {
    const h = createTaskBoardHistory();
    h.push(MOVE);
    h.clear();
    expect(h.canUndo).toBe(false);
  });
});

describe("tokens", () => {
  it("peerColor is stable and always a TrueColor", () => {
    expect(peerColor("user-42")).toBe(peerColor("user-42"));
    for (const id of ["a", "b", "carlos", "x".repeat(40)]) expect(TRUE_COLORS).toContain(peerColor(id));
  });
  it("column edge", () => expect(getTaskBoardColumnTokens("rose").edge).toBe("border-t-rose-500"));
  it("chip", () => expect(getTaskBoardChipTokens("blue").chip).toContain("bg-blue-100"));
  it("peer ring", () => expect(getTaskBoardPeerTokens("teal").ring).toBe("ring-teal-500"));
});

describe("useTaskBoardText", () => {
  it("resolves the built-in catalog with values", () => {
    const { result } = renderHook(() => useTaskBoardText());
    expect(result.current("addCard")).toBe("Add card");
    expect(result.current("held", { name: "Sam" })).toBe("Sam is moving this");
    expect(result.current("cardCount", { count: 1 })).toBe("1 card");
  });
  it("labels override the catalog and interpolate", () => {
    const { result } = renderHook(() => useTaskBoardText({ held: "{name} tient la carte" }));
    expect(result.current("held", { name: "Sam" })).toBe("Sam tient la carte");
  });
});

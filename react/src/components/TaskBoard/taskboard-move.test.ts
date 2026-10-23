import { describe, it, expect } from "vitest";
import {
  applyMove,
  bucketCards,
  bucketKey,
  keyboardTarget,
  resolveDropIndex,
  validateMove,
  type MoveContext,
  type TaskBoardCard,
  type TaskBoardColumn,
  type TaskBoardLane,
} from "../../../../common/taskboard";

const cols = (over: Partial<Record<string, Partial<TaskBoardColumn>>> = {}): TaskBoardColumn[] =>
  ["a", "b", "c"].map((id) => ({ id, title: id.toUpperCase(), ...over[id] }));
const LANES: TaskBoardLane[] = [
  { id: "l1", title: "L1" },
  { id: "l2", title: "L2" },
];
const CARDS: TaskBoardCard[] = [
  { id: "a1", title: "a1", column: "a" },
  { id: "a2", title: "a2", column: "a" },
  { id: "a3", title: "a3", column: "a" },
  { id: "b1", title: "b1", column: "b" },
];
const slot = (column: string, index: number, lane: string | null = null) => ({ column, lane, index });
const ids = (cards: TaskBoardCard[], column: string, lane: string | null = null, lanes?: TaskBoardLane[]) =>
  bucketCards(cards, cols(), lanes).get(bucketKey(column, lane))!.map((c) => c.id);

describe("validateMove", () => {
  const ctx = (o: Partial<MoveContext> = {}): MoveContext => ({ cards: CARDS, columns: cols(), ...o });
  it("allows a plain move", () => {
    expect(validateMove(ctx(), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: true });
  });
  it("locked card", () => {
    const cards = CARDS.map((c) => (c.id === "a1" ? { ...c, locked: true } : c));
    expect(validateMove(ctx({ cards }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: false, reason: "locked-card" });
  });
  it("locked target column", () => {
    expect(validateMove(ctx({ columns: cols({ b: { locked: true } }) }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) }).ok).toBe(false);
  });
  it("locked source column lets no card leave", () => {
    expect(validateMove(ctx({ columns: cols({ a: { locked: true } }) }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: false, reason: "locked-column" });
  });
  it("locked lane", () => {
    const cards = CARDS.map((c) => ({ ...c, lane: "l1" }));
    const lanes = [LANES[0], { ...LANES[1], locked: true }];
    expect(validateMove(ctx({ cards, lanes }), { cardId: "a1", from: slot("a", 0, "l1"), to: slot("a", 0, "l2") })).toEqual({ ok: false, reason: "locked-lane" });
  });
  it("not accepted by a transition rule", () => {
    expect(validateMove(ctx({ columns: cols({ c: { accepts: ["b"] } }) }), { cardId: "a1", from: slot("a", 0), to: slot("c", 0) })).toEqual({ ok: false, reason: "not-accepted" });
  });
  it("full WIP column refuses a newcomer", () => {
    expect(validateMove(ctx({ columns: cols({ b: { wipLimit: 1 } }) }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: false, reason: "wip-column" });
  });
  it("reordering inside a full column never trips WIP", () => {
    expect(validateMove(ctx({ columns: cols({ a: { wipLimit: 3 } }) }), { cardId: "a1", from: slot("a", 0), to: slot("a", 2) })).toEqual({ ok: true });
  });
  it("full WIP lane refuses a newcomer", () => {
    const cards = CARDS.map((c) => ({ ...c, lane: c.id === "b1" ? "l2" : "l1" }));
    const lanes = [LANES[0], { ...LANES[1], wipLimit: 1 }];
    expect(validateMove(ctx({ cards, lanes }), { cardId: "a1", from: slot("a", 0, "l1"), to: slot("a", 0, "l2") })).toEqual({ ok: false, reason: "wip-lane" });
  });
  it("held by someone else", () => {
    const heldBy = new Map([["a1", "peer"]]);
    expect(validateMove(ctx({ heldBy, selfId: "me" }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: false, reason: "held" });
    expect(validateMove(ctx({ heldBy, selfId: "peer" }), { cardId: "a1", from: slot("a", 0), to: slot("b", 0) })).toEqual({ ok: true });
  });
});

describe("applyMove", () => {
  it("reorders within a bucket", () => {
    const next = applyMove(CARDS, { cardId: "a1", from: slot("a", 0), to: slot("a", 2) }, cols());
    expect(ids(next, "a")).toEqual(["a2", "a3", "a1"]);
  });
  it("moves across columns at an index", () => {
    const next = applyMove(CARDS, { cardId: "a2", from: slot("a", 1), to: slot("b", 0) }, cols());
    expect(ids(next, "a")).toEqual(["a1", "a3"]);
    expect(ids(next, "b")).toEqual(["a2", "b1"]);
    expect(next.find((c) => c.id === "a2")!.column).toBe("b");
  });
  it("moves into an empty column", () => {
    const next = applyMove(CARDS, { cardId: "a2", from: slot("a", 1), to: slot("c", 0) }, cols());
    expect(ids(next, "c")).toEqual(["a2"]);
  });
  it("moves across lanes", () => {
    const cards = CARDS.map((c) => ({ ...c, lane: "l1" }));
    const next = applyMove(cards, { cardId: "a1", from: slot("a", 0, "l1"), to: slot("a", 0, "l2") }, cols(), LANES);
    expect(ids(next, "a", "l2", LANES)).toEqual(["a1"]);
    expect(next.find((c) => c.id === "a1")!.lane).toBe("l2");
  });
  it("leaves the input untouched", () => {
    const copy = JSON.parse(JSON.stringify(CARDS));
    applyMove(CARDS, { cardId: "a1", from: slot("a", 0), to: slot("b", 1) }, cols());
    expect(CARDS).toEqual(copy);
  });
  it("clamps an index past the end", () => {
    const next = applyMove(CARDS, { cardId: "a1", from: slot("a", 0), to: slot("b", 99) }, cols());
    expect(ids(next, "b")).toEqual(["b1", "a1"]);
  });
});

describe("resolveDropIndex", () => {
  const rects = [
    { id: "x", top: 0, height: 100 },
    { id: "y", top: 110, height: 100 },
    { id: "z", top: 220, height: 100 },
  ];
  it("above a midpoint → before", () => expect(resolveDropIndex(rects, 130, "drag", null)).toBe(1));
  it("below a midpoint → after", () => expect(resolveDropIndex(rects, 190, "drag", null)).toBe(2));
  it("past the last card → end", () => expect(resolveDropIndex(rects, 900, "drag", null)).toBe(3));
  it("in a gap → before the next", () => expect(resolveDropIndex(rects, 105, "drag", null)).toBe(1));
  it("over the dragged card keeps current", () => expect(resolveDropIndex(rects, 150, "y", 0)).toBe(0));
  it("over the dragged card with no current → its own slot", () => expect(resolveDropIndex(rects, 150, "y", null)).toBe(1));
  it("indexes exclude the dragged card", () => expect(resolveDropIndex(rects, 290, "x", null)).toBe(2));
  it("empty bucket → 0", () => expect(resolveDropIndex([], 10, "x", null)).toBe(0));
});

describe("keyboardTarget", () => {
  const ctx = (o: Partial<MoveContext> = {}): MoveContext => ({ cards: CARDS, columns: cols(), ...o });
  it("right moves to the next column, index clamped", () => {
    expect(keyboardTarget(ctx(), slot("a", 2), "a3", "right")).toEqual(slot("b", 1));
  });
  it("skips a full column", () => {
    expect(keyboardTarget(ctx({ columns: cols({ b: { wipLimit: 1 } }) }), slot("a", 0), "a1", "right")).toEqual(slot("c", 0));
  });
  it("skips a collapsed column", () => {
    expect(keyboardTarget(ctx({ columns: cols({ b: { collapsed: true } }) }), slot("a", 0), "a1", "right")).toEqual(slot("c", 0));
  });
  it("null at the board edge", () => {
    expect(keyboardTarget(ctx(), slot("a", 0), "a1", "left")).toBeNull();
  });
  it("down/up within a bucket", () => {
    expect(keyboardTarget(ctx(), slot("a", 0), "a1", "down")).toEqual(slot("a", 1));
    expect(keyboardTarget(ctx(), slot("a", 0), "a1", "up")).toBeNull();
    expect(keyboardTarget(ctx(), slot("a", 2), "a3", "down")).toBeNull();
  });
  it("lane-down moves to the next lane", () => {
    const cards = CARDS.map((c) => ({ ...c, lane: "l1" }));
    expect(keyboardTarget(ctx({ cards, lanes: LANES }), slot("a", 1, "l1"), "a2", "lane-down")).toEqual(slot("a", 0, "l2"));
  });
});

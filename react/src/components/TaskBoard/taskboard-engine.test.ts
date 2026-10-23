import { describe, it, expect } from "vitest";
import {
  bucketCards,
  bucketKey,
  columnCount,
  laneCount,
  wipState,
  sampleTaskBoard,
  type TaskBoardCard,
  type TaskBoardColumn,
  type TaskBoardLane,
} from "../../../../common/taskboard";

const COLS: TaskBoardColumn[] = [
  { id: "a", title: "A" },
  { id: "b", title: "B" },
];
const LANES: TaskBoardLane[] = [
  { id: "l1", title: "L1" },
  { id: "l2", title: "L2" },
];

describe("bucketCards", () => {
  it("keeps array order inside a bucket", () => {
    const cards: TaskBoardCard[] = [
      { id: "c3", title: "3", column: "a" },
      { id: "c1", title: "1", column: "a" },
      { id: "c2", title: "2", column: "a" },
    ];
    const map = bucketCards(cards, COLS);
    expect(map.get(bucketKey("a", null))!.map((c) => c.id)).toEqual(["c3", "c1", "c2"]);
    expect(map.get(bucketKey("b", null))).toEqual([]);
  });

  it("buckets by column × lane", () => {
    const cards: TaskBoardCard[] = [
      { id: "c1", title: "1", column: "a", lane: "l1" },
      { id: "c2", title: "2", column: "a", lane: "l2" },
      { id: "c3", title: "3", column: "b", lane: "l2" },
    ];
    const map = bucketCards(cards, COLS, LANES);
    expect(map.get(bucketKey("a", "l2"))!.map((c) => c.id)).toEqual(["c2"]);
    expect(map.get(bucketKey("b", "l2"))!.map((c) => c.id)).toEqual(["c3"]);
    expect(map.get(bucketKey("b", "l1"))).toEqual([]);
  });

  it("puts lane-less and unknown-lane cards in the first lane when lanes exist", () => {
    const cards: TaskBoardCard[] = [
      { id: "c1", title: "1", column: "a" },
      { id: "c2", title: "2", column: "a", lane: "nope" },
    ];
    const map = bucketCards(cards, COLS, LANES);
    expect(map.get(bucketKey("a", "l1"))!.map((c) => c.id)).toEqual(["c1", "c2"]);
  });

  it("hides cards whose column is unknown", () => {
    const map = bucketCards([{ id: "x", title: "x", column: "zzz" }], COLS);
    const all = [...map.values()].flat();
    expect(all).toEqual([]);
  });
});

describe("counts", () => {
  const cards: TaskBoardCard[] = [
    { id: "1", title: "1", column: "a", lane: "l1" },
    { id: "2", title: "2", column: "a", lane: "l2" },
    { id: "3", title: "3", column: "b", lane: "l2" },
  ];
  it("columnCount counts a column", () => expect(columnCount(cards, "a")).toBe(2));
  it("laneCount counts a lane", () => expect(laneCount(cards, "l2")).toBe(2));
});

describe("wipState", () => {
  it.each([
    [2, undefined, "none"],
    [2, 3, "ok"],
    [3, 3, "full"],
    [4, 3, "over"],
  ] as const)("%i/%s → %s", (n, l, s) => expect(wipState(n, l)).toBe(s));
});

describe("fixtures", () => {
  it("roadmap matches screenshot 1", () => {
    const r = sampleTaskBoard.roadmap();
    expect(r.columns.map((c) => c.title)).toEqual(["Ideas", "Discovery", "Ready", "Building", "Blocked"]);
    expect(columnCount(r.cards, "ideas")).toBe(4);
    expect(columnCount(r.cards, "discovery")).toBe(3);
    expect(columnCount(r.cards, "ready")).toBe(3);
    expect(columnCount(r.cards, "building")).toBe(4);
    expect(r.priorities.map((p) => p.label)).toEqual(["P1", "P2", "P3", "P4"]);
  });

  it("field ops matches screenshot 2", () => {
    const f = sampleTaskBoard.fieldOps();
    expect(f.columns.map((c) => c.title)).toEqual(["Intake", "Scheduled", "On site", "Review", "Closed"]);
    expect(f.lanes!.slice(0, 3).map((l) => l.title)).toEqual([
      "North Region",
      "Downtown Retail",
      "Airport Terminal",
    ]);
    const map = bucketCards(f.cards, f.columns, f.lanes);
    expect(map.get(bucketKey("intake", "north"))!.map((c) => c.title)).toContain(
      "Quote backup generator service",
    );
  });

  it("fixtures return fresh arrays each call", () => {
    expect(sampleTaskBoard.roadmap().cards).not.toBe(sampleTaskBoard.roadmap().cards);
  });
});

import { describe, it, expect } from "vitest";
import {
  createLaneUse,
  port,
  routeBetween,
  routeCrossings,
  routePorts,
  segmentsCrossBoxes,
  type Box,
} from "../../connectionFlow";

/**
 * The path engine: A* over the grid the cards define, behind a collision
 * check. What is pinned here is the contract — cards are not crossed, a
 * boxed-in edge is never dropped, an edge that already runs clean is not
 * touched, and lanes are shared rather than redrawn.
 */

const A: Box = { x: 0, y: 100, width: 100, height: 40 };
const B: Box = { x: 400, y: 100, width: 100, height: 40 };

describe("segmentsCrossBoxes", () => {
  it("counts a crossing but not a touch", () => {
    const box = { x: 40, y: -10, width: 20, height: 20 };
    expect(
      segmentsCrossBoxes(
        [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        [box],
      ),
    ).toBe(true);
    // Along the border is a lane, not a crossing — that is what the
    // clearance lines are for.
    expect(
      segmentsCrossBoxes(
        [
          { x: 0, y: -10 },
          { x: 100, y: -10 },
        ],
        [box],
      ),
    ).toBe(false);
    // And a near miss that never reaches the box is nothing at all.
    expect(
      segmentsCrossBoxes(
        [
          { x: 0, y: 0 },
          { x: 30, y: 0 },
        ],
        [box],
      ),
    ).toBe(false);
  });
});

describe("routeBetween", () => {
  it("goes around a wall the naive route would have crossed", () => {
    const wall: Box = { x: 230, y: 60, width: 60, height: 200 };
    const naive = routePorts(port(A, "right", 0.5), port(B, "left", 0.5), {
      style: "orthogonal",
    });
    // The point of the whole exercise: the old route does cross.
    expect(segmentsCrossBoxes(naive.points, [wall])).toBe(true);

    const route = routeBetween({ box: A, t: 0.5 }, { box: B, t: 0.5 }, [A, B, wall], {
      style: "orthogonal",
    });
    expect(route).not.toBeNull();
    expect(segmentsCrossBoxes(route!.points, [wall])).toBe(false);
    // The terminals are excluded, not avoided: the line still connects.
    expect(route!.fromPort.side).toBeTruthy();
  });

  it("meets a vertical column from the left when the top lane is blocked", () => {
    // Three cards in one column; the top card has a neighbour directly
    // above, so the lane across its top is not free. The retry loop from
    // the bottom card must then come up the empty side and enter from the
    // left rather than plough over anything.
    const top: Box = { x: 100, y: 40, width: 200, height: 60 };
    const mid: Box = { x: 100, y: 160, width: 200, height: 60 };
    const bottom: Box = { x: 100, y: 280, width: 200, height: 60 };
    const above: Box = { x: 100, y: -30, width: 200, height: 60 };
    const route = routeBetween(
      { box: bottom, t: 0.5, preferSides: ["left"] },
      { box: top, t: 0.5, preferSides: ["top"] },
      [top, mid, bottom, above],
      { style: "orthogonal" },
    );
    expect(route).not.toBeNull();
    expect(route!.toPort.side).toBe("left");
    expect(Math.min(...route!.points.map((p) => p.x))).toBeLessThan(top.x);
    expect(segmentsCrossBoxes(route!.points, [mid, above])).toBe(false);
  });

  it("still draws an edge when every approach crosses something", () => {
    // A target walled in on all four sides: soft obstacles mean the
    // engine answers with the fewest crossings rather than silence.
    const target: Box = { x: 400, y: 100, width: 100, height: 40 };
    const ring: Box[] = [
      { x: 300, y: 100, width: 60, height: 60 }, // left
      { x: 510, y: 90, width: 40, height: 60 }, // right
      { x: 400, y: 24, width: 100, height: 48 }, // above
      { x: 400, y: 220, width: 100, height: 48 }, // below
    ];
    const naive = routePorts(port(A, "right", 0.5), port(target, "left", 0.5), {
      style: "orthogonal",
    });
    const route = routeBetween({ box: A, t: 0.5 }, { box: target, t: 0.5 }, [A, target, ...ring], {
      style: "orthogonal",
    });
    expect(route).not.toBeNull();
    const crossings = (points: { x: number; y: number }[]) =>
      ring.filter((b) => segmentsCrossBoxes(points, [b])).length;
    expect(crossings(naive.points)).toBeGreaterThan(0);
    expect(crossings(route!.points)).toBeLessThanOrEqual(crossings(naive.points));
  });

  it("changes nothing about a route that was already clean", () => {
    // Byte-identical is the compatibility promise: what was never broken
    // comes out of the engine exactly as it went in.
    const right: Box = { x: 172, y: 0, width: 100, height: 40 };
    const small: Box = { x: 0, y: 0, width: 100, height: 40 };
    const naive = routePorts(port(small, "right", 0.5), port(right, "left", 0.5), {
      style: "orthogonal",
    });
    const route = routeBetween({ box: small, t: 0.5 }, { box: right, t: 0.5 }, [small, right], {
      style: "orthogonal",
    });
    expect(route!.points).toEqual(naive.points);
    expect(route!.d).toBe(naive.d);
  });

  it("charges the shared ledger so a second route sees the lane taken", () => {
    const wall: Box = { x: 230, y: 60, width: 60, height: 200 };
    const laneUse = createLaneUse();
    const first = routeBetween(
      { box: A, t: 0.5 },
      { box: B, t: 0.5 },
      [A, B, wall],
      { style: "orthogonal", laneUse },
    );
    const second = routeBetween(
      { box: A, t: 0.5 },
      { box: B, t: 0.5 },
      [A, B, wall],
      { style: "orthogonal", laneUse },
    );
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    // The very same route twice must leave some segment charged twice —
    // that charge is what nudges a third loop onto the next lane.
    expect(Math.max(...laneUse.values())).toBeGreaterThanOrEqual(2);
  });
});

describe("routeCrossings", () => {
  const line = (x1: number, y1: number, x2: number, y2: number) => [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];

  it("hops the horizontal over a vertical running through it", () => {
    const h = { id: "h", points: line(0, 50, 100, 50), style: "orthogonal" as const };
    const v = { id: "v", points: line(50, 40, 50, 60), style: "orthogonal" as const };
    const out = routeCrossings([h, v]);
    // The horizontal hops; the vertical is untouched — it stays byte-identical.
    expect(out.has("h")).toBe(true);
    expect(out.has("v")).toBe(false);
    const d = out.get("h")!;
    // A semicircle at the crossing, bulging up.
    expect(d).toMatch(/L 44 50 A 6 6 0 0 0 56 50 L 100 50/);
  });

  it("counts neither parallels, vertex touches, nor crossings near the ends", () => {
    const h = { id: "h", points: line(0, 50, 100, 50), style: "orthogonal" as const };
    const parallel = { id: "p", points: line(0, 51, 100, 51), style: "orthogonal" as const };
    const touch = { id: "t", points: line(0, 50, 0, 20), style: "orthogonal" as const };
    const nearStart = { id: "n", points: line(2, 40, 2, 60), style: "orthogonal" as const };
    const out = routeCrossings([h, parallel, touch, nearStart]);
    expect(out.size).toBe(0);
  });

  it("packs hops too close to share their radius", () => {
    const h = { id: "h", points: line(0, 50, 100, 50), style: "orthogonal" as const };
    const close1 = { id: "a", points: line(48, 40, 48, 60), style: "orthogonal" as const };
    const close2 = { id: "b", points: line(52, 40, 52, 60), style: "orthogonal" as const };
    const out = routeCrossings([h, close1, close2]);
    const d = out.get("h")!;
    const arcs = d.match(/A /g)?.length ?? 0;
    // 48 and 52 are four apart — two 6-px hops cannot fit; the packer
    // shrinks or drops rather than flattening an arc into a bump.
    expect(arcs).toBeGreaterThanOrEqual(1);
    expect(arcs).toBeLessThanOrEqual(2);
    expect(d).toMatch(/A (\d+(\.\d+)?) (\1) 0 0/);
  });
});

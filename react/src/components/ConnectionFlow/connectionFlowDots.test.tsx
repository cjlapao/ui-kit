import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import ConnectionFlow from "./ConnectionFlow";
import { routeLength, type ConnectionFlowNode } from "../../connectionFlow";

const FAN: ConnectionFlowNode[] = [
  { id: "src", title: "Source" },
  { id: "a", title: "A", kind: "parallel", group: "g" },
  { id: "b", title: "B", kind: "parallel", group: "g" },
  { id: "c", title: "C", kind: "parallel", group: "g" },
];

const motions = (container: HTMLElement) =>
  [...container.querySelectorAll("animateMotion")].map((el) => ({
    dur: parseFloat(el.getAttribute("dur")!),
    begin: parseFloat(el.getAttribute("begin")!),
    keyPoints: el.getAttribute("keyPoints"),
    arrival: parseFloat(el.getAttribute("keyTimes")!.split(";")[1]),
    path: el.getAttribute("path")!,
  }));

/**
 * The dots are declarative SMIL, and a headless browser will not advance their
 * clock — so what is worth pinning is the timing handed to them, which is
 * exactly what the animation is.
 */
describe("ConnectionFlow travelling dots", () => {
  it("sends one dot per edge, not a stream", () => {
    const { container } = render(<ConnectionFlow nodes={FAN} />);
    // Three targets, one dot each.
    expect(motions(container)).toHaveLength(3);
  });

  it("stacks one interval of delay per edge, in order", () => {
    const { container } = render(
      <ConnectionFlow nodes={FAN} dotInterval={500} />,
    );
    const begins = motions(container)
      .map((m) => m.begin)
      .sort((a, b) => b - a);
    expect(begins).toEqual([0, -0.5, -1]);
  });

  it("shares one cycle across a source's edges, so the round repeats evenly", () => {
    const { container } = render(
      <ConnectionFlow nodes={FAN} dotInterval={500} />,
    );
    const durations = new Set(motions(container).map((m) => m.dur));
    expect(durations.size).toBe(1);
    // Long enough for the whole round, and for its longest route.
    expect([...durations][0]).toBeGreaterThanOrEqual(1.5);
  });

  it("keeps the round-robin in step when one route is much longer", () => {
    // Sized per edge, a group containing one long route gives each dot a
    // different period and the rhythm falls apart.
    const nodes: ConnectionFlowNode[] = [
      { id: "src", title: "Source" },
      { id: "near", title: "Near", kind: "parallel", group: "g" },
      { id: "far", title: "Far", kind: "parallel", group: "g", height: 500 },
    ];
    const { container } = render(
      <ConnectionFlow nodes={nodes} dotInterval={200} />,
    );
    const durations = new Set(motions(container).map((m) => m.dur));
    expect(durations.size).toBe(1);
    // The short edge still arrives well before the long one.
    const arrivals = motions(container).map((m) => m.arrival).sort();
    expect(arrivals[0]).toBeLessThan(arrivals[arrivals.length - 1]);
  });

  it("moves every dot at the same speed, whatever its route", () => {
    // The point of the change: a fixed duration made a short hop crawl while
    // a long arc raced.
    const nodes: ConnectionFlowNode[] = [
      { id: "src", title: "Source" },
      { id: "near", title: "Near", kind: "parallel", group: "g" },
      // Far enough down that its edge is markedly longer than the first.
      { id: "far", title: "Far", kind: "parallel", group: "g", height: 400 },
      { id: "last", title: "Last", kind: "parallel", group: "g" },
    ];
    const { container } = render(
      <ConnectionFlow nodes={nodes} dotSpeed={200} dotInterval={1000} />,
    );
    const lengths = motions(container).map((m) => {
      // Recover the route from the path the dot follows.
      const numbers = m.path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i + 1 < numbers.length; i += 2) {
        points.push({ x: numbers[i], y: numbers[i + 1] });
      }
      return { travel: m.dur * m.arrival, length: routeLength(points) };
    });
    const speeds = lengths.map((l) => l.length / l.travel);
    // Straight-line measurement of a rounded path is approximate, so allow a
    // little slack — the point is that they are the same, not the exact value.
    for (const speed of speeds) {
      expect(speed).toBeCloseTo(speeds[0], 0);
    }
    expect(new Set(lengths.map((l) => l.travel)).size).toBeGreaterThan(1);
  });

  it("parks the dot at the end and hides it until its next turn", () => {
    const { container } = render(
      <ConnectionFlow nodes={FAN} dotInterval={2000} />,
    );
    const motion = motions(container)[0];
    // Holds position 1 from `arrival` to the end of the cycle...
    expect(motion.keyPoints).toBe("0;1;1");
    expect(motion.arrival).toBeLessThan(1);
    // ...with the opacity switching off at the same instant.
    const fade = container.querySelector('animate[attributeName="opacity"]')!;
    expect(fade.getAttribute("values")).toBe("1;0");
    expect(fade.getAttribute("calcMode")).toBe("discrete");
    expect(parseFloat(fade.getAttribute("keyTimes")!.split(";")[1])).toBeCloseTo(
      motion.arrival,
      4,
    );
  });

  it("draws no dots at all when the flow is not animated", () => {
    const { container } = render(<ConnectionFlow nodes={FAN} animated={false} />);
    expect(motions(container)).toHaveLength(0);
  });
});

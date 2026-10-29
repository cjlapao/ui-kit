import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ConnectionFlow from "./ConnectionFlow";
import {
  layoutConnectionFlow,
  segmentsCrossBoxes,
  type ConnectionFlowNode,
} from "../../connectionFlow";
import {
  captionTextWidth,
  wrapCaption,
} from "../../../../common/connectionFlow/captions";

const text = "clarify · max 2 · then escalate for another review";
const nodes: ConnectionFlowNode[] = [
  { id: "clarify", title: "Clarify", height: 88 },
  {
    id: "gate",
    title: "Clarify answers",
    height: 88,
    connector: { label: text },
  },
  {
    id: "review",
    title: "Review",
    height: 88,
    failure: {
      to: "clarify",
      label: "Return to clarification and retry the review",
    },
  },
  {
    id: "security",
    title: "Security",
    height: 88,
    failure: {
      to: "clarify",
      label: "Return to clarification and retry the security scan",
    },
  },
];
const intersects = (
  a: { x: number; y: number; width: number; height: number },
  b: typeof a,
) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

describe("ConnectionFlow captions", () => {
  it("wraps words and long tokens without losing text or exceeding its text budget", () => {
    for (const text of [
      "review before pushing",
      "aVeryLongUnbrokenIdentifier_123456789",
      "检查代码然后重试",
      "First line\nSecond line",
    ]) {
      const lines = wrapCaption(text, 40);
      expect(lines.join("").replace(/\s/g, "")).toBe(text.replace(/\s/g, ""));
      for (const line of lines)
        expect(captionTextWidth(line)).toBeLessThanOrEqual(40);
    }
  });
  it("reserves wrapped caption height and keeps captions away from cards, captions and foreign paths", () => {
    const layout = layoutConnectionFlow({ nodes });
    const labels = layout.edges.filter((e) => e.label);
    expect(labels.every((e) => !!e.caption)).toBe(true);
    expect(labels.some((e) => e.caption!.lines.length > 1)).toBe(true);
    for (const edge of labels) {
      const caption = edge.caption!;
      for (const node of layout.nodes)
        expect(intersects(caption, node), `${edge.id} / ${node.id}`).toBe(
          false,
        );
      for (const other of labels)
        if (other !== edge)
          expect(
            intersects(caption, other.caption!),
            `${edge.id} / ${other.id}`,
          ).toBe(false);
      for (const other of layout.edges)
        if (other !== edge)
          expect(
            segmentsCrossBoxes(other.points, [caption]),
            `${other.id} through ${edge.id}`,
          ).toBe(false);
      for (const line of caption.lines)
        expect(captionTextWidth(line)).toBeLessThanOrEqual(
          caption.width - 16 + 0.01,
        );
      const centerY = caption.y + caption.height / 2;
      const horizontal = edge.points.some(
        (p, i) =>
          i > 0 &&
          p.y === centerY &&
          edge.points[i - 1].y === centerY &&
          caption.x >= Math.min(p.x, edge.points[i - 1].x) + 12 - 0.01 &&
          caption.x + caption.width <=
            Math.max(p.x, edge.points[i - 1].x) - 12 + 0.01,
      );
      const vertical = edge.points.some(
        (p, i) =>
          i > 0 &&
          p.x === caption.x + caption.width / 2 &&
          edge.points[i - 1].x === p.x &&
          caption.y >= Math.min(p.y, edge.points[i - 1].y) + 12 - 0.01 &&
          caption.y + caption.height <=
            Math.max(p.y, edge.points[i - 1].y) - 12 + 0.01,
      );
      expect(horizontal || vertical, edge.id).toBe(true);
      expect(caption.y).toBeGreaterThanOrEqual(layout.offsetY);
      expect(caption.y + caption.height).toBeLessThanOrEqual(layout.height);
    }
  });
  it("increases card and row spacing for long captions without mutating explicit minimum gaps", () => {
    const options = { connectorWidth: 72, rowGap: 20 };
    const makeNodes = (label: string): ConnectionFlowNode[] => [
      {
        id: "parent",
        childLayout: "chain",
        rows: [[{ id: "a", success: { label } }], [{ id: "b" }]],
      },
    ];
    const baseline = layoutConnectionFlow({ nodes: makeNodes(""), options });
    const expanded = layoutConnectionFlow({ nodes: makeNodes(text), options });
    const rowGap = (layout: typeof expanded) => {
      const a = layout.nodes.find((n) => n.id === "a")!,
        b = layout.nodes.find((n) => n.id === "b")!;
      return b.y - a.y - a.height;
    };
    expect(rowGap(expanded)).toBeGreaterThan(rowGap(baseline));
    const short = layoutConnectionFlow({
      nodes: [{ id: "a" }, { id: "b" }],
      options,
    });
    const wide = layoutConnectionFlow({
      nodes: [{ id: "a" }, { id: "b", connector: { label: text } }],
      options,
    });
    const gap = (layout: typeof expanded) =>
      layout.nodes[1].x - layout.nodes[0].x - layout.nodes[0].width;
    expect(gap(wide)).toBeGreaterThan(gap(short));
    expect(options).toEqual({ connectorWidth: 72, rowGap: 20 });
  });
  it("sizes each seam independently and leaves unrelated gaps at their minimum", () => {
    const layout = layoutConnectionFlow({
      nodes: [
        { id: "clarify", height: 104 },
        {
          id: "answers",
          height: 104,
          connector: { label: "clarify · max 2 · then escalate" },
        },
        {
          id: "discovery",
          height: 104,
          failure: {
            to: "clarify",
            label:
              "Review the answers and return to clarification before another attempt",
          },
        },
        { id: "done", height: 104 },
      ],
    });
    const gaps = layout.nodes
      .slice(1)
      .map((n, i) => n.x - layout.nodes[i].x - layout.nodes[i].width);
    // The forward caption needs its own seam; the upstream retry caption
    // belongs to an outer lane and must not widen the next handoff.
    expect(gaps[0]).toBeGreaterThan(72);
    expect(gaps[1]).toBe(72);
    expect(gaps[2]).toBe(72);
    expect(layout.edges.filter((e) => e.label).every((e) => e.caption)).toBe(
      true,
    );
  });
  it.each(["orthogonal", "curved", "straight"] as const)(
    "leaves a straight exit and entry beside wrapped captions (%s)",
    (edgeStyle) => {
      const layout = layoutConnectionFlow({
        nodes: [
          { id: "clarify", height: 104 },
          {
            id: "answers",
            height: 104,
            connector: { label: "clarify · max 2 · then escalate" },
          },
          {
            id: "discovery",
            height: 104,
            failure: {
              to: "clarify",
              label:
                "Review the answers and return to clarification before another attempt",
            },
          },
        ],
        options: { edgeStyle },
      });
      for (const edge of layout.edges) {
        const points = edge.points;
        for (const [a, b] of [
          [points[0], points[1]],
          [points[points.length - 1], points[points.length - 2]],
        ]) {
          // Even curved corners consume at most half a terminal segment:
          // keep at least 9px visibly straight, independent of zoom.
          expect(
            Math.hypot(b.x - a.x, b.y - a.y),
            edge.id,
          ).toBeGreaterThanOrEqual(18 - 0.01);
        }
        for (const other of layout.edges) {
          if (!other.caption) continue;
          for (const terminal of [points[0], points[points.length - 1]]) {
            const caption = other.caption;
            const dx = Math.max(
              caption.x - terminal.x,
              0,
              terminal.x - caption.x - caption.width,
            );
            const dy = Math.max(
              caption.y - terminal.y,
              0,
              terminal.y - caption.y - caption.height,
            );
            expect(
              Math.hypot(dx, dy),
              `${edge.id} beside ${other.id}`,
            ).toBeGreaterThanOrEqual(26);
          }
        }
      }
      // The short label still fits locally rather than being sent outside.
      expect(layout.edges[0].caption!.y).toBeGreaterThan(layout.nodes[0].y);
    },
  );
  it("uses neutral contrast on solid surfaces and preserves glass caption colors", () => {
    const { container, rerender } = render(
      <ConnectionFlow nodes={nodes} variant="outlined" />,
    );
    const label = () => container.querySelector("[data-edge-caption] text")!;
    expect(label()).toHaveClass("fill-neutral-700", "dark:fill-neutral-200");
    expect(label().querySelectorAll("tspan").length).toBeGreaterThan(1);
    expect(label()).toHaveAttribute("aria-label", text);
    rerender(<ConnectionFlow nodes={nodes} variant="glass" />);
    expect(label()).toHaveClass("fill-neutral-500", "dark:fill-neutral-400");
  });
});

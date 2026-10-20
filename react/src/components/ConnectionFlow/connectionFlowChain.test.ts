import { describe, it, expect } from "vitest";
import {
  layoutConnectionFlow,
  measureBranch,
  measureNode,
  segmentsCrossBoxes,
  toRows,
  tracePathTo,
  DEFAULT_LAYOUT_OPTIONS,
  STATUS_TONE,
  type ConnectionFlowNode,
  type ConnectionFlowLayout,
  type LaidOutEdge,
  type LaidOutNode,
} from "../../connectionFlow";

/**
 * The chained grid: a card whose children form rows, walked rightward and
 * downward, with success/failure outcomes on any card. The grid reads as a
 * CI pipeline because that is the story it was designed against.
 */

const node = (layout: ConnectionFlowLayout, id: string): LaidOutNode => {
  const found = layout.nodes.find((n) => n.id === id);
  if (!found) throw new Error(`node ${id} was not laid out`);
  return found;
};

const edge = (layout: ConnectionFlowLayout, id: string): LaidOutEdge => {
  const found = layout.edges.find((e) => e.id === id);
  if (!found) throw new Error(`edge ${id} was not routed`);
  return found;
};

const edgesFrom = (layout: ConnectionFlowLayout, id: string): LaidOutEdge[] =>
  layout.edges.filter((e) => e.fromId === id);

const bottom = (n: LaidOutNode) => n.y + n.height;
const right = (n: LaidOutNode) => n.x + n.width;
const lastPoint = (e: LaidOutEdge) => e.points[e.points.length - 1];

const pipeline = (): ConnectionFlowNode[] => [
  { id: "setup", status: "succeeded" },
  {
    id: "build",
    status: "running",
    childLayout: "chain",
    rows: [
      [{ id: "create-pr", status: "succeeded" }],
      [
        { id: "create-code", status: "succeeded" },
        { id: "lint", status: "succeeded" },
      ],
      [
        {
          id: "verify",
          status: "failed",
          failure: { to: "create-code", label: "retry" },
        },
      ],
      [{ id: "merge", status: "pending" }],
    ],
  },
  { id: "deploy", status: "pending" },
];

describe("ConnectionFlow chained grid", () => {
  describe("toRows", () => {
    it("reads rows verbatim", () => {
      const rows = toRows({
        id: "p",
        rows: [[{ id: "a" }, { id: "b" }], [{ id: "c" }]],
      });
      expect(rows.map((r) => r.map((c) => c.id))).toEqual([["a", "b"], ["c"]]);
    });

    it("promotes a flat children list to one card per row", () => {
      const rows = toRows({ id: "p", children: [{ id: "a" }, { id: "b" }] });
      expect(rows.map((r) => r.map((c) => c.id))).toEqual([["a"], ["b"]]);
    });

    it("is empty for a card without children", () => {
      expect(toRows({ id: "p" })).toEqual([]);
    });
  });

  describe("measure", () => {
    it("stacks row maxima, never the cards of a row", () => {
      const options = DEFAULT_LAYOUT_OPTIONS;
      const parent: ConnectionFlowNode = {
        id: "p",
        childLayout: "chain",
        rows: [
          [{ id: "a" }, { id: "b", status: "running", subtitle: "x" }],
          [{ id: "c" }],
        ],
      };
      expect(measureBranch(parent, options)).toBe(
        measureNode(parent, options) +
          options.childGap +
          Math.max(
            measureNode({ id: "a" }, options),
            measureNode({ id: "b", status: "running", subtitle: "x" }, options),
          ) +
          options.rowGap +
          measureNode({ id: "c" }, options),
      );
    });
  });

  describe("placement", () => {
    it("lays rows out rightward and downward at standard card size", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const options = DEFAULT_LAYOUT_OPTIONS;
      const build = node(layout, "build");
      const createPr = node(layout, "create-pr");
      const createCode = node(layout, "create-code");
      const lint = node(layout, "lint");
      const verify = node(layout, "verify");

      // The grid hangs below the parent card.
      expect(createPr.y).toBeGreaterThanOrEqual(bottom(build));
      // Cards keep the standard size and sit one connector apart.
      expect(createCode.width).toBe(options.metrics.width);
      expect(lint.x).toBe(createCode.x + options.metrics.width + options.connectorWidth);
      // A row's cards share a row; rows descend.
      expect(createCode.y).toBe(lint.y);
      expect(verify.y).toBeGreaterThan(bottom(lint));
    });

    it("advances the next top-level column clear of the grid", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const options = DEFAULT_LAYOUT_OPTIONS;
      const setup = node(layout, "setup");
      const build = node(layout, "build");
      const deploy = node(layout, "deploy");
      const lint = node(layout, "lint");
      // The track keeps its stride before the parent…
      expect(build.x).toBe(right(setup) + options.connectorWidth);
      // …and resumes clear of the grid's widest row.
      expect(deploy.x).toBe(right(lint) + options.connectorWidth);
    });
  });

  describe("the walk", () => {
    it("enters from the parent's bottom into the first card's top", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const build = node(layout, "build");
      const createPr = node(layout, "create-pr");
      const entry = edge(layout, "build~in>create-pr");
      expect(entry.kind).toBe("chain");
      expect(entry.points[0].y).toBeGreaterThanOrEqual(bottom(build));
      expect(lastPoint(entry).y).toBeLessThanOrEqual(createPr.y);
    });

    it("links a row left to right through the connector gap", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const createCode = node(layout, "create-code");
      const lint = node(layout, "lint");
      const walk = edge(layout, "create-code~walk>lint");
      expect(walk.kind).toBe("chain");
      expect(walk.points[0].x).toBeGreaterThanOrEqual(right(createCode));
      expect(lastPoint(walk).x).toBeLessThanOrEqual(lint.x);
      expect(walk.points[0].y).toBeCloseTo(createCode.y + createCode.height / 2, 1);
    });

    it("drops from a row's last card into the next row's first", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const lint = node(layout, "lint");
      const verify = node(layout, "verify");
      const handoff = edge(layout, "lint~walk>verify");
      expect(handoff.points[0].y).toBeGreaterThanOrEqual(bottom(lint));
      expect(lastPoint(handoff).y).toBeLessThanOrEqual(verify.y);
    });

    it("carries the flow onward from the grid's last card, not the parent", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      // The exit card hands off to the parent's next sibling…
      expect(layout.edges.some((e) => e.fromId === "merge" && e.toId === "deploy")).toBe(true);
      // …and the parent itself emits nothing onward but its grid entry.
      expect(edgesFrom(layout, "build").every((e) => e.kind === "chain")).toBe(true);
      expect(layout.edges.some((e) => e.fromId === "build" && e.toId === "deploy")).toBe(false);
    });

    it("stops the onward edge at a terminal parent", () => {
      const nodes = pipeline().map((n) =>
        n.id === "build" ? { ...n, terminal: true } : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      expect(layout.edges.some((e) => e.fromId === "merge" && e.toId === "deploy")).toBe(false);
    });

    it("steps over a skipped card", () => {
      const nodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [{ id: "a" }],
                [{ id: "b", skipped: true }],
                [{ id: "c" }],
              ],
            }
          : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      expect(layout.edges.some((e) => e.toId === "b")).toBe(false);
      expect(layout.edges.some((e) => e.fromId === "a" && e.toId === "c")).toBe(true);
    });
  });

  describe("outcome branches", () => {
    it("routes a failure loop-back clear of every card it passes", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const verify = node(layout, "verify");
      const loop = edge(layout, "verify~fail>create-code");
      expect(loop.kind).toBe("branch");
      expect(loop.branchKind).toBe("failure");
      // Leaves the source at its outline — the engine picks the side, the
      // route may only ever start on the source's boundary.
      const offBox = (p: { x: number; y: number }) =>
        Math.max(
          Math.abs(p.x - (verify.x + verify.width / 2)) - verify.width / 2,
          Math.abs(p.y - (verify.y + verify.height / 2)) - verify.height / 2,
        );
      expect(offBox(loop.points[0])).toBeLessThanOrEqual(24);
      // …and the one thing the old fixed turn could not promise: nothing it
      // runs along is a card. The engine chooses the side and the lane —
      // what it may never do is cross a face to get there.
      const others = layout.nodes
        .filter((n) => n.id !== verify.id && n.id !== "create-code")
        .map((n) => ({ x: n.x, y: n.y, width: n.width, height: n.height }));
      expect(segmentsCrossBoxes(loop.points, others)).toBe(false);
      expect(loop.label).toBe("retry");
    });

    it("lights the failure edge and dims the walk when the source failed", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const loop = edge(layout, "verify~fail>create-code");
      expect(loop.state).toBe("flowing");
      expect(loop.animated).toBe(true);
      expect(edge(layout, "verify~walk>merge").state).toBe("stopped");
    });

    it("draws both edges stopped while the source has not failed", () => {
      const nodes = pipeline().map((n): ConnectionFlowNode =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [
                  {
                    id: "verify",
                    status: "running",
                    failure: { to: "merge" },
                    success: { to: "merge" },
                  },
                ],
                [{ id: "merge" }],
              ],
            }
          : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      expect(edge(layout, "verify~fail>merge").state).toBe("stopped");
      expect(edge(layout, "verify~ok>merge").state).toBe("flowing");
    });

    it("defaults to emerald and rose and honours a per-item tone", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const loop = edge(layout, "verify~fail>create-code");
      expect(loop.sourceTone).toBe(STATUS_TONE.failed);
      expect(loop.targetTone).toBe(STATUS_TONE.failed);

      const nodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [
                  {
                    id: "gate",
                    failure: { to: "gate", tone: "amber" as const },
                  },
                ],
              ],
            }
          : n,
      );
      const overridden = layoutConnectionFlow({ nodes });
      // Self-targets are refused rather than drawn as a zero-length loop.
      expect(overridden.edges.some((e) => e.branchKind === "failure")).toBe(false);

      const toneNodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [{ id: "a" }],
                [{ id: "b", failure: { to: "a", tone: "amber" as const } }],
              ],
            }
          : n,
      );
      const toneLayout = layoutConnectionFlow({ nodes: toneNodes });
      const custom = edge(toneLayout, "b~fail>a");
      expect(custom.sourceTone).toBe("amber");
      expect(custom.targetTone).toBe("amber");
    });

    it("lets success.to replace the implicit successor", () => {
      const nodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [
                  { id: "a", success: { to: "c" } },
                  { id: "b" },
                  { id: "c" },
                ],
              ],
            }
          : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      expect(edge(layout, "a~ok>c").kind).toBe("branch");
      expect(edge(layout, "a~ok>c").branchKind).toBe("success");
      expect(edge(layout, "a~ok>c").sourceTone).toBe(STATUS_TONE.succeeded);
      expect(layout.edges.some((e) => e.id === "a~walk>b")).toBe(false);
      expect(layout.edges.some((e) => e.toId === "b")).toBe(false);
    });

    it("restyles the implicit walk edge when success has no target", () => {
      const nodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [[{ id: "a", success: { label: "ok" } }, { id: "b" }]],
            }
          : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      const walk = edge(layout, "a~walk>b");
      expect(walk.sourceTone).toBe(STATUS_TONE.succeeded);
      expect(walk.label).toBe("ok");
    });

    it("routes the grid's exit through the exit card's own success", () => {
      const nodes = pipeline().map((n) =>
        n.id === "build"
          ? {
              ...n,
              rows: [
                [{ id: "merge", success: { to: "deploy", label: "ship" } }],
              ],
            }
          : n,
      );
      const layout = layoutConnectionFlow({ nodes });
      expect(edge(layout, "merge~ok>deploy").kind).toBe("branch");
      expect(layout.edges.some((e) => e.kind === undefined && e.fromId === "merge")).toBe(
        false,
      );
    });

    it("connects outcomes between cards outside the grid too", () => {
      const nodes: ConnectionFlowNode[] = [
        { id: "a", status: "failed", failure: { to: "b" } },
        { id: "b", status: "pending", terminal: true },
      ];
      const layout = layoutConnectionFlow({ nodes });
      const loop = edge(layout, "a~fail>b");
      expect(loop.branchKind).toBe("failure");
      expect(loop.state).toBe("flowing");
    });
  });

  describe("the path engine", () => {
    const devLoop = (): ConnectionFlowNode[] => [
      { id: "setup", status: "succeeded" },
      { id: "plan", status: "succeeded" },
      { id: "plan-gate", status: "running", failure: { to: "plan", label: "max 2" } },
      {
        id: "build",
        childLayout: "chain",
        rows: [
          [{ id: "issue" }],
          [{ id: "implement" }, { id: "verify" }],
          [{ id: "security" }],
          [{ id: "commit-local" }, { id: "pr" }],
          [{ id: "review", failure: { to: "implement", label: "max 2" } }],
          [{ id: "merge" }, { id: "close-issue" }],
        ],
      },
      { id: "qa", status: "failed", failure: { to: "plan", label: "max 2" } },
      { id: "done", terminal: true },
    ];

    it("routes every edge without crossing a card that is not its own", () => {
      // The one law of the engine, asserted over a whole board: gates
      // loop back across columns, the grid's review card fails all the way
      // up into `implement`, qa fails out of the grid back to `plan` — and
      // nothing any of them travel along is a card face.
      const layout = layoutConnectionFlow({ nodes: devLoop() });
      expect(layout.edges.length).toBeGreaterThan(10);
      for (const e of layout.edges) {
        const others = layout.nodes
          .filter((n) => n.id !== e.fromId && n.id !== e.toId)
          .map((n) => ({ x: n.x, y: n.y, width: n.width, height: n.height }));
        expect(segmentsCrossBoxes(e.points, others), `edge ${e.id}`).toBe(false);
      }
    });

    it("hops a horizontal line over a vertical one where they cross", () => {
      // The ladder from the bug report, where the re-run lane and the
      // handoffs genuinely cross. Crossings stay legal — but a crossing has
      // to read as over-and-under: the horizontal carries semicircular
      // hops, which only the hop pass ever puts into a path (rounded
      // corners are quadratic, never arcs).
      const nodes: ConnectionFlowNode[] = [
        { id: "setup" },
        {
          id: "build",
          childLayout: "chain",
          rows: [
            [{ id: "create-pr" }],
            [{ id: "create-code" }, { id: "unit-tests" }, { id: "lint" }],
            [{ id: "verify-code", status: "failed", failure: { to: "create-code", label: "re-run" } }],
            [{ id: "secure-code" }, { id: "scan-deps" }],
            [{ id: "review-code" }],
            [{ id: "merge-code", success: { label: "ship" } }],
          ],
        },
        { id: "deploy" },
        { id: "done", terminal: true },
      ];
      const layout = layoutConnectionFlow({ nodes });
      const hopped = layout.edges.filter((e) => / A /.test(e.d));
      expect(hopped.length).toBeGreaterThan(0);
      // And the hop is an actual semicircle, not a stray arc elsewhere.
      for (const e of hopped) expect(e.d).toMatch(/A (\d+(\.\d+)?) (\1) 0 0 [01] /);
    });
  });

  describe("backward compatibility", () => {
    it("leaves the fan layout untouched", () => {
      const layout = layoutConnectionFlow({
        nodes: [{ id: "p", children: [{ id: "c1" }, { id: "c2" }] }],
      });
      expect(layout.edges.some((e) => e.id === "pv>c1")).toBe(true);
      expect(layout.edges.some((e) => e.kind === "chain")).toBe(false);
      const parent = node(layout, "p");
      const child = node(layout, "c1");
      expect(child.x).toBeGreaterThan(parent.x);
      expect(child.y).toBeGreaterThanOrEqual(bottom(parent));
    });

    it("keeps the walk's ancestry traceable", () => {
      const layout = layoutConnectionFlow({ nodes: pipeline() });
      const trace = tracePathTo(layout, "merge");
      expect(trace.nodes.has("verify")).toBe(true);
      expect(trace.nodes.has("build")).toBe(true);
    });
  });
});

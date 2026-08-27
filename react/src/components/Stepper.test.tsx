import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Stepper, {
  type StepperStep,
  type StepperNodeCorner,
} from "./Stepper";
import { CONTROL_SIZES, SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const STEPS: StepperStep[] = [
  { id: "s0", title: "One", subtitle: "First" },
  { id: "s1", title: "Two", subtitle: "Second" },
  { id: "s2", title: "Three", subtitle: "Third" },
];

const activeNode = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("button[aria-current='step']");

const connectorSpans = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("span.pointer-events-none.absolute"));

describe("Stepper", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = render(
        <Stepper steps={STEPS} variant={variant} />,
      );
      expect(
        container.querySelector(`section[data-variant="${variant}"]`),
      ).not.toBeNull();
    });

    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() => render(<Stepper steps={STEPS} tone={tone} />)).not.toThrow();
    });

    it.each(CONTROL_SIZES)("renders at size %s", (size) => {
      expect(() => render(<Stepper steps={STEPS} size={size} />)).not.toThrow();
    });

    it("drives node density from the shared ControlSize scale", () => {
      const { container } = render(<Stepper steps={STEPS} size="lg" />);
      expect(activeNode(container)?.className).toContain("h-12 w-12");
    });
  });

  describe("node corner", () => {
    it("defaults to the classic circle (rounded-full)", () => {
      const { container } = render(<Stepper steps={STEPS} />);
      expect(activeNode(container)?.className).toContain("rounded-full");
    });

    const cornerCases: [StepperNodeCorner, string][] = [
      ["none", "rounded-none"],
      ["rounded", "rounded-sm"],
      ["rounded-sm", "rounded-lg"],
      ["rounded-md", "rounded-2xl"],
      ["rounded-lg", "rounded-3xl"],
      ["rounded-xl", "rounded-4xl"],
    ];

    it.each(cornerCases)(
      "maps nodeCorner %s to the Panel corner class %s",
      (corner, cls) => {
        const { container } = render(
          <Stepper steps={STEPS} nodeCorner={corner} />,
        );
        expect(activeNode(container)?.className).toContain(cls);
        expect(activeNode(container)?.className).not.toContain("rounded-full");
      },
    );
  });

  describe("loader type", () => {
    const statusRoles = (container: HTMLElement) =>
      container.querySelectorAll('[role="status"]').length;

    it("whole-stepper skeleton: no Panel loader, body is a skeleton", () => {
      const { container } = render(
        <Stepper steps={STEPS} loading loaderType="skeleton" />,
      );
      // The Panel is not told to load — the Stepper draws its own skeleton.
      expect(statusRoles(container)).toBe(0);
      // The real step copy is replaced by pulsing lines.
      expect(screen.queryByText("One")).toBeNull();
    });

    it("skeleton: the connector is one inset segment per gap, not one full-width line through the discs", () => {
      const { container } = render(
        <Stepper steps={STEPS} loading loaderType="skeleton" />,
      );
      // 3 discs → 2 per-gap connector segments, each pulled 8px clear of its
      // discs (mx-2). The old single `left-0 right-0` line that ran through
      // the translucent discs is gone.
      const bars = container.querySelectorAll(".mx-2.flex-1");
      expect(bars).toHaveLength(2);
      expect(container.querySelector(".left-0.right-0")).toBeNull();
    });

    it.each(["spinner", "progress"] as const)(
      "whole-stepper %s: the Panel shows its loader overlay",
      (type) => {
        const { container } = render(
          <Stepper steps={STEPS} loading loaderType={type} />,
        );
        expect(statusRoles(container)).toBeGreaterThan(0);
      },
    );

    it("per-step progress: the node shows a loader overlay", () => {
      const { container } = render(
        <Stepper steps={STEPS} loaderStepIds={["s0"]} loaderType="progress" />,
      );
      expect(statusRoles(container)).toBeGreaterThan(0);
    });

    it("per-step skeleton: the node stays put (no overlay)", () => {
      const { container } = render(
        <Stepper steps={STEPS} loaderStepIds={["s0"]} loaderType="skeleton" />,
      );
      expect(statusRoles(container)).toBe(0);
    });
  });

  describe("contrast (AA) fills", () => {
    it("uses the -700/-950 active fill, not the 2.94:1 -600", () => {
      const { container } = render(
        <Stepper steps={STEPS} tone="emerald" defaultCurrentIndex={0} />,
      );
      const node = activeNode(container)!;
      expect(node.className).toContain("bg-emerald-700");
      expect(node.className).toContain("dark:bg-emerald-400");
      expect(node.className).toContain("dark:text-emerald-950");
      expect(node.className).not.toContain("bg-emerald-600");
    });

    it("uses the -700/-300 pending copy pair, not the 2.1:1 -500", () => {
      const { container } = render(
        <Stepper steps={STEPS} tone="emerald" defaultCurrentIndex={0} />,
      );
      const pending = container.querySelectorAll<HTMLElement>("button")[2];
      expect(pending.className).toContain("text-emerald-700");
      expect(pending.className).toContain("dark:text-emerald-300");
      expect(pending.className).not.toContain("text-emerald-500");
    });

    it("keeps the pending node transparent so it does not slab on glass", () => {
      const { container } = render(
        <Stepper steps={STEPS} tone="emerald" defaultCurrentIndex={0} />,
      );
      const pending = container.querySelectorAll<HTMLElement>("button")[2];
      expect(pending.className).toContain("bg-transparent");
      expect(pending.className).not.toContain("bg-white");
    });

    it("renders an error step on the semantic rose -700/-400 pair", () => {
      const { container } = render(
        <Stepper
          steps={[{ id: "e", title: "Broken", status: "error" }]}
          tone="emerald"
        />,
      );
      const node = activeNode(container) ?? container.querySelector("button")!;
      expect(node.className).toContain("bg-rose-700");
      expect(node.className).toContain("dark:bg-rose-400");
      expect(node.className).not.toContain("bg-rose-500");
    });
  });

  describe("safelisted dark/alpha classes", () => {
    it("carries the previously-missing dark + alpha classes per tone", () => {
      const { container } = render(
        <Stepper
          steps={[
            { id: "s0", title: "One", status: "completed" },
            { id: "s1", title: "Two", status: "active" },
            { id: "s2", title: "Three" },
          ]}
          tone="emerald"
          defaultCurrentIndex={1}
        />,
      );
      const html = container.innerHTML;
      // completed fill (dark alpha), pending border (dark alpha), connector
      // base (dark alpha) — all three were missing from the built CSS.
      expect(html).toContain("dark:bg-emerald-600/60");
      expect(html).toContain("dark:border-emerald-700/60");
      expect(html).toContain("dark:bg-emerald-700/40");
    });
  });

  describe("connector fill direction", () => {
    it("fills the left connector on the previous step and the right on this step", () => {
      const { container } = render(
        <Stepper
          steps={[
            { id: "s0", title: "One", status: "completed" },
            { id: "s1", title: "Two", status: "completed" },
            { id: "s2", title: "Three", status: "active" },
            { id: "s3", title: "Four" },
          ]}
          tone="emerald"
          defaultCurrentIndex={2}
        />,
      );
      const filled = connectorSpans(container).filter((el) =>
        el.classList.contains("bg-emerald-700"),
      ).length;
      const base = connectorSpans(container).filter((el) =>
        el.classList.contains("bg-emerald-100"),
      ).length;
      // s0-right, s1-left, s1-right, s2-left fill; s2-right (active) and
      // s3-left stay base. The old single class set filled s2-right too.
      expect(filled).toBe(4);
      expect(base).toBe(2);
    });
  });

  describe("connector geometry (edge-to-edge)", () => {
    const spanStyles = (container: HTMLElement) =>
      connectorSpans(container).map((el) => {
        const span = el as HTMLElement;
        return {
          left: span.style.left || null,
          right: span.style.right || null,
          width: span.style.width || null,
        };
      });

    it("right align: the left span bridges the gap to the previous node's edge", () => {
      const { container } = render(
        <Stepper steps={STEPS} connectorAlign="right" />,
      );
      // 3 steps → 2 left spans (cells 1, 2). Without the -8px bridge the line
      // stopped one gap (8px) short of the previous node. (CSSOM folds
      // -40px + 8px to -32px.)
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("-8px");
        expect(span.width).toBe("calc(100% - 32px)");
      }
    });

    it("left align: the right span bridges the gap to the next node's edge", () => {
      const { container } = render(
        <Stepper steps={STEPS} connectorAlign="left" />,
      );
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.right).toBe("-8px");
        expect(span.width).toBe("calc(100% - 32px)");
      }
    });

    it("center align: the gap splits at the cell boundary", () => {
      const { container } = render(<Stepper steps={STEPS} />);
      const spans = spanStyles(container);
      // cell 0: right span; cell 1: left + right; cell 2: left span
      expect(spans).toHaveLength(4);
      expect(spans[0]).toEqual({
        left: null,
        right: "0px",
        width: "calc(50% - 20px)",
      });
      expect(spans[1]).toEqual({
        left: "-8px",
        right: null,
        width: "calc(50% - 12px)",
      });
      expect(spans[2]).toEqual({
        left: null,
        right: "0px",
        width: "calc(50% - 20px)",
      });
      expect(spans[3]).toEqual({
        left: "-8px",
        right: null,
        width: "calc(50% - 12px)",
      });
    });

    it("connectNodes: spans meet the node edge — no gap, no overshoot", () => {
      const { container } = render(
        <Stepper steps={STEPS} connectNodes connectorAlign="right" />,
      );
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("0px");
        expect(span.width).toBe("calc(100% - 40px)");
      }
    });

    it("renders no in-flow connector segments (nodes stay on their edges)", () => {
      const { container } = render(<Stepper steps={STEPS} />);
      // The old detached flex segment (pl-4 pr-2) shifted centered nodes
      // off the cell center, leaving the line 12px short of the node.
      expect(container.querySelector(".pl-4.pr-2")).toBeNull();
    });

    it("vertical: the line runs edge-to-edge, never into the circle", () => {
      const real = Element.prototype.getBoundingClientRect;
      const zeroRect = (): DOMRect =>
        ({
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
      // React nodes carry no data-step-index (the index lives in the ref
      // closure), so identify the node buttons by visit order instead.
      let nodeOrdinal = -1;
      Element.prototype.getBoundingClientRect = function (
        this: Element,
      ): DOMRect {
        const el = this as HTMLElement;
        if (el.tagName !== "BUTTON") return zeroRect();
        nodeOrdinal += 1;
        const top = 483 + nodeOrdinal * 100;
        return {
          ...zeroRect(),
          top,
          bottom: top + 40,
          right: 40,
          width: 40,
          height: 40,
          y: top,
        };
      };
      try {
        const { container } = render(
          <Stepper steps={STEPS} orientation="vertical" />,
        );
        const spans = connectorSpans(container);
        expect(spans).toHaveLength(2);
        for (const el of spans) {
          const span = el as HTMLElement;
          expect(span.style.top).toBe("40px");
          // measured center-to-center is 100px; minus two radii (40px) leaves
          // the edge-to-edge run between the circles.
          expect(span.style.height).toBe("60px");
        }
      } finally {
        Element.prototype.getBoundingClientRect = real;
      }
    });
  });

  describe("connector geometry (line inset)", () => {
    const spanStyles = (container: HTMLElement) =>
      connectorSpans(container).map((el) => {
        const span = el as HTMLElement;
        return {
          left: span.style.left || null,
          right: span.style.right || null,
          width: span.style.width || null,
        };
      });

    it("right align: the line stops 8px short of both circles", () => {
      const { container } = render(
        <Stepper steps={STEPS} connector="line" connectorAlign="right" />,
      );
      // left = inset - gap = 8 - 8 = 0 (starts at the previous node's edge,
      // i.e. 8px clear of it); width loses 8px at EACH end.
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("0px");
        expect(span.width).toBe("calc(100% - 48px)");
      }
    });

    it("left align: the line stops 8px short of both circles", () => {
      const { container } = render(
        <Stepper steps={STEPS} connector="line" connectorAlign="left" />,
      );
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.right).toBe("0px");
        expect(span.width).toBe("calc(100% - 48px)");
      }
    });

    it("center align: each half-span insets its own node end only", () => {
      const { container } = render(
        <Stepper steps={STEPS} connector="line" />,
      );
      // cell 0: right span; cell 1: left + right; cell 2: left span. The
      // cell-boundary ends (mid-gap) stay flush; only the node-facing ends
      // pull back 8px, so the line stays continuous across the gap.
      const spans = spanStyles(container);
      expect(spans).toHaveLength(4);
      expect(spans[0]).toEqual({
        left: null,
        right: "0px",
        width: "calc(50% - 28px)",
      });
      expect(spans[1]).toEqual({
        left: "-8px",
        right: null,
        width: "calc(50% - 20px)",
      });
      expect(spans[2]).toEqual({
        left: null,
        right: "0px",
        width: "calc(50% - 28px)",
      });
      expect(spans[3]).toEqual({
        left: "-8px",
        right: null,
        width: "calc(50% - 20px)",
      });
    });

    it("center align: the junction corners are squared (no notch where the two half-spans meet)", () => {
      const { container } = render(
        <Stepper steps={STEPS} connector="progress" />,
      );
      const zero = (v: string) => v.replace("px", "");
      const corners = connectorSpans(container).map((el) => {
        const s = (el as HTMLElement).style;
        return {
          tl: s.borderTopLeftRadius,
          tr: s.borderTopRightRadius,
          bl: s.borderBottomLeftRadius,
          br: s.borderBottomRightRadius,
        };
      });
      expect(corners).toHaveLength(4);
      // spans[0]/spans[2] are the right half-spans: their RIGHT (junction)
      // corners are squared so they meet the neighbouring half-span without a
      // notch; the node-side (left) corners stay rounded.
      for (const c of [corners[0], corners[2]]) {
        expect(zero(c.tr)).toBe("0");
        expect(zero(c.br)).toBe("0");
      }
      // spans[1]/spans[3] are the left half-spans: their LEFT (junction)
      // corners are squared for the same reason.
      for (const c of [corners[1], corners[3]]) {
        expect(zero(c.tl)).toBe("0");
        expect(zero(c.bl)).toBe("0");
      }
    });

    it("connectNodes + line: the gap stays 8px on each side of the circles", () => {
      const { container } = render(
        <Stepper
          steps={STEPS}
          connector="line"
          connectNodes
          connectorAlign="right"
        />,
      );
      // gap is 0, so the inset wins: left = 8 - 0 = 8px.
      const spans = spanStyles(container);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("8px");
        expect(span.width).toBe("calc(100% - 56px)");
      }
    });

    it("vertical: the line stops 8px short of both circles", () => {
      const real = Element.prototype.getBoundingClientRect;
      const zeroRect = (): DOMRect =>
        ({
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
      let nodeOrdinal = -1;
      Element.prototype.getBoundingClientRect = function (
        this: Element,
      ): DOMRect {
        const el = this as HTMLElement;
        if (el.tagName !== "BUTTON") return zeroRect();
        nodeOrdinal += 1;
        const top = 483 + nodeOrdinal * 100;
        return {
          ...zeroRect(),
          top,
          bottom: top + 40,
          right: 40,
          width: 40,
          height: 40,
          y: top,
        };
      };
      try {
        const { container } = render(
          <Stepper
            steps={STEPS}
            connector="line"
            orientation="vertical"
          />,
        );
        const spans = connectorSpans(container);
        expect(spans).toHaveLength(2);
        for (const el of spans) {
          const span = el as HTMLElement;
          expect(span.style.top).toBe("48px");
          // 100px center-to-center − 40px (two radii) − 16px (two insets).
          expect(span.style.height).toBe("44px");
        }
      } finally {
        Element.prototype.getBoundingClientRect = real;
      }
    });
  });

  describe("single tab stop + keyboard", () => {
    it("makes exactly one button per step (the node), not the body", () => {
      const { container } = render(<Stepper steps={STEPS} />);
      expect(container.querySelectorAll("button").length).toBe(3);
    });

    it("moves focus between nodes with the arrow keys without activating", () => {
      const onChange = vi.fn();
      render(<Stepper steps={STEPS} onChange={onChange} />);
      const [first, second] = Array.from(
        screen.getAllByRole("button"),
      ) as HTMLElement[];

      first.focus();
      fireEvent.keyDown(first, { key: "ArrowRight" });
      expect(second).toHaveFocus();
      expect(onChange).not.toHaveBeenCalled();
    });

    it("jumps to the first and last nodes with Home and End", () => {
      render(<Stepper steps={STEPS} />);
      const nodes = screen.getAllByRole("button") as HTMLElement[];
      nodes[2].focus();
      fireEvent.keyDown(nodes[2], { key: "Home" });
      expect(nodes[0]).toHaveFocus();
      fireEvent.keyDown(nodes[0], { key: "End" });
      expect(nodes[2]).toHaveFocus();
    });
  });

  describe("panel integration", () => {
    it("applies the shared corner scale to the Panel root", () => {
      const { container } = render(<Stepper steps={STEPS} corner="rounded-xl" />);
      expect(container.querySelector("section")?.className).toContain(
        "rounded-4xl",
      );
    });

    it("renders the nodes as divs and ignores clicks while disabled", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Stepper steps={STEPS} disabled onChange={onChange} />,
      );
      expect(container.querySelectorAll("button").length).toBe(0);
      const firstDiv = container.querySelector("div.relative.z-10");
      expect(firstDiv).not.toBeNull();
      fireEvent.click(firstDiv!);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("covers the whole stepper while loading", () => {
      render(<Stepper steps={STEPS} loading />);
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });
  });

  describe("progress", () => {
    it("publishes a labelled progressbar with the right value", () => {
      render(
        <Stepper
          steps={STEPS}
          showProgressBar
          showProgressSummary
          defaultCurrentIndex={1}
        />,
      );
      const bar = screen.getByRole("progressbar");
      expect(bar.getAttribute("aria-valuenow")).toBe("33");
    });

    it("sits above the steps when progressBarPosition=top, below when bottom", () => {
      const top = render(
        <Stepper steps={STEPS} showProgressBar progressBarPosition="top" />,
      );
      const topBar = top.container.querySelector<HTMLElement>("[role='progressbar']")!;
      const topFirstNode = top.container.querySelector<HTMLElement>("button")!;
      expect(
        topBar.compareDocumentPosition(topFirstNode) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();

      const bottom = render(
        <Stepper steps={STEPS} showProgressBar progressBarPosition="bottom" />,
      );
      const bottomBar = bottom.container.querySelector<HTMLElement>(
        "[role='progressbar']",
      )!;
      const bottomFirstNode = bottom.container.querySelector<HTMLElement>("button")!;
      expect(
        bottomBar.compareDocumentPosition(bottomFirstNode) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeFalsy();
    });
  });

  describe("wired-up (formerly dead) props", () => {
    it("drops the transition classes entirely when animated={false}", () => {
      const { container } = render(<Stepper steps={STEPS} animated={false} />);
      expect(container.innerHTML).not.toContain("transition-all duration-200");
      expect(container.innerHTML).not.toContain(
        "transition-colors duration-200",
      );
    });

    it("renders per-step actions from renderActions", () => {
      render(
        <Stepper
          steps={STEPS}
          renderActions={(step) => (
            <button type="button">{step.title} action</button>
          )}
        />,
      );
      expect(screen.getByText("Two action")).toBeTruthy();
    });

    it("shows a loader overlay on a loading step's node", () => {
      render(<Stepper steps={STEPS} loaderStepIds={["s1"]} />);
      // The active step's content region shows a skeleton, and the node a Loader.
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });
  });

  describe("states", () => {
    it("shows an empty state when there are no steps", () => {
      render(<Stepper steps={[]} />);
      expect(screen.getByText("No steps")).toBeTruthy();
    });
  });
});

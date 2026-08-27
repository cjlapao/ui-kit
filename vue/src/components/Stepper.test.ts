import { describe, it, expect, vi } from "vitest";
import { h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Stepper from "./Stepper.vue";
import type { StepperStep, StepperNodeCorner } from "./Stepper.vue";
import { CONTROL_SIZES, SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const STEPS: StepperStep[] = [
  { id: "s0", title: "One", subtitle: "First" },
  { id: "s1", title: "Two", subtitle: "Second" },
  { id: "s2", title: "Three", subtitle: "Third" },
];

const activeNode = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find("button[aria-current='step']");

const connectorSpans = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll("span.pointer-events-none.absolute");

describe("Stepper (Vue)", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const wrapper = mount(Stepper, { props: { steps: STEPS, variant } });
      expect(
        wrapper.find(`section[data-variant="${variant}"]`).exists(),
      ).toBe(true);
    });

    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() => mount(Stepper, { props: { steps: STEPS, tone } })).not.toThrow();
    });

    it.each(CONTROL_SIZES)("renders at size %s", (size) => {
      expect(() => mount(Stepper, { props: { steps: STEPS, size } })).not.toThrow();
    });

    it("drives node density from the shared ControlSize scale", () => {
      const wrapper = mount(Stepper, { props: { steps: STEPS, size: "lg" } });
      const node = activeNode(wrapper).classes();
      expect(node).toContain("h-12");
      expect(node).toContain("w-12");
    });
  });

  describe("node corner", () => {
    it("defaults to the classic circle (rounded-full)", () => {
      const wrapper = mount(Stepper, { props: { steps: STEPS } });
      expect(activeNode(wrapper).classes()).toContain("rounded-full");
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
        const wrapper = mount(Stepper, {
          props: { steps: STEPS, nodeCorner: corner },
        });
        const classes = activeNode(wrapper).classes();
        expect(classes).toContain(cls);
        expect(classes).not.toContain("rounded-full");
      },
    );
  });

  describe("contrast (AA) fills", () => {
    it("uses the -700/-950 active fill, not the 2.94:1 -600", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, tone: "emerald", defaultCurrentIndex: 0 },
      });
      const node = activeNode(wrapper);
      expect(node.classes()).toContain("bg-emerald-700");
      expect(node.classes()).toContain("dark:bg-emerald-400");
      expect(node.classes()).toContain("dark:text-emerald-950");
      expect(node.classes()).not.toContain("bg-emerald-600");
    });

    it("uses the -700/-300 pending copy pair, not the 2.1:1 -500", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, tone: "emerald", defaultCurrentIndex: 0 },
      });
      const pending = wrapper.findAll("button")[2];
      expect(pending.classes()).toContain("text-emerald-700");
      expect(pending.classes()).toContain("dark:text-emerald-300");
      expect(pending.classes()).not.toContain("text-emerald-500");
    });

    it("keeps the pending node transparent so it does not slab on glass", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, tone: "emerald", defaultCurrentIndex: 0 },
      });
      const pending = wrapper.findAll("button")[2];
      expect(pending.classes()).toContain("bg-transparent");
      expect(pending.classes()).not.toContain("bg-white");
    });

    it("renders an error step on the semantic rose -700/-400 pair", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: [{ id: "e", title: "Broken", status: "error" }],
          tone: "emerald",
        },
      });
      const node = activeNode(wrapper).exists()
        ? activeNode(wrapper)
        : wrapper.find("button");
      expect(node.classes()).toContain("bg-rose-700");
      expect(node.classes()).toContain("dark:bg-rose-400");
      expect(node.classes()).not.toContain("bg-rose-500");
    });
  });

  describe("safelisted dark/alpha classes", () => {
    it("carries the previously-missing dark + alpha classes per tone", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: [
            { id: "s0", title: "One", status: "completed" },
            { id: "s1", title: "Two", status: "active" },
            { id: "s2", title: "Three" },
          ],
          tone: "emerald",
          defaultCurrentIndex: 1,
        },
      });
      const html = wrapper.html();
      expect(html).toContain("dark:bg-emerald-600/60");
      expect(html).toContain("dark:border-emerald-700/60");
      expect(html).toContain("dark:bg-emerald-700/40");
    });
  });

  describe("connector fill direction", () => {
    it("fills the left connector on the previous step and the right on this step", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: [
            { id: "s0", title: "One", status: "completed" },
            { id: "s1", title: "Two", status: "completed" },
            { id: "s2", title: "Three", status: "active" },
            { id: "s3", title: "Four" },
          ],
          tone: "emerald",
          defaultCurrentIndex: 2,
        },
      });
      const spans = connectorSpans(wrapper);
      const filled = spans.filter((el) =>
        el.classes().includes("bg-emerald-700"),
      ).length;
      const base = spans.filter((el) =>
        el.classes().includes("bg-emerald-100"),
      ).length;
      expect(filled).toBe(4);
      expect(base).toBe(2);
    });
  });

  describe("connector geometry (edge-to-edge)", () => {
    const spanStyles = (wrapper: ReturnType<typeof mount>) =>
      connectorSpans(wrapper).map((el) => {
        const span = el.element as HTMLElement;
        return {
          left: span.style.left || null,
          right: span.style.right || null,
          width: span.style.width || null,
        };
      });

    it("right align: the left span bridges the gap to the previous node's edge", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connectorAlign: "right" },
      });
      // 3 steps → 2 left spans (cells 1, 2). Without the -8px bridge the line
      // stopped one gap (8px) short of the previous node. (CSSOM folds
      // -40px + 8px to -32px.)
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("-8px");
        expect(span.width).toBe("calc(100% - 32px)");
      }
    });

    it("left align: the right span bridges the gap to the next node's edge", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connectorAlign: "left" },
      });
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.right).toBe("-8px");
        expect(span.width).toBe("calc(100% - 32px)");
      }
    });

    it("center align: the gap splits at the cell boundary", () => {
      const wrapper = mount(Stepper, { props: { steps: STEPS } });
      const spans = spanStyles(wrapper);
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
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connectNodes: true, connectorAlign: "right" },
      });
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("0px");
        expect(span.width).toBe("calc(100% - 40px)");
      }
    });

    it("renders no in-flow connector segments (nodes stay on their edges)", () => {
      const wrapper = mount(Stepper, { props: { steps: STEPS } });
      // The old detached flex segment (pl-4 pr-2) shifted centered nodes
      // off the cell center, leaving the line 12px short of the node.
      expect(wrapper.find(".pl-4.pr-2").exists()).toBe(false);
    });

    it("vertical: the line runs edge-to-edge, never into the circle", async () => {
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
      Element.prototype.getBoundingClientRect = function (
        this: Element,
      ): DOMRect {
        const el = this as HTMLElement;
        const idx = el.dataset?.stepIndex;
        if (idx === undefined) return zeroRect();
        const top = 483 + Number(idx) * 100;
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
        const wrapper = mount(Stepper, {
          props: { steps: STEPS, orientation: "vertical" },
        });
        // verticalSegments is set in onMounted → the spans appear on the
        // next tick.
        await nextTick();
        const spans = connectorSpans(wrapper);
        expect(spans).toHaveLength(2);
        for (const el of spans) {
          const span = el.element as HTMLElement;
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
    const spanStyles = (wrapper: ReturnType<typeof mount>) =>
      connectorSpans(wrapper).map((el) => {
        const span = el.element as HTMLElement;
        return {
          left: span.style.left || null,
          right: span.style.right || null,
          width: span.style.width || null,
        };
      });

    it("right align: the line stops 8px short of both circles", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connector: "line", connectorAlign: "right" },
      });
      // left = inset - gap = 8 - 8 = 0 (starts at the previous node's edge,
      // i.e. 8px clear of it); width loses 8px at EACH end.
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("0px");
        expect(span.width).toBe("calc(100% - 48px)");
      }
    });

    it("left align: the line stops 8px short of both circles", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connector: "line", connectorAlign: "left" },
      });
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.right).toBe("0px");
        expect(span.width).toBe("calc(100% - 48px)");
      }
    });

    it("center align: each half-span insets its own node end only", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connector: "line" },
      });
      // cell 0: right span; cell 1: left + right; cell 2: left span. The
      // cell-boundary ends (mid-gap) stay flush; only the node-facing ends
      // pull back 8px, so the line stays continuous across the gap.
      const spans = spanStyles(wrapper);
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
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, connector: "progress" },
      });
      const zero = (v: string) => v.replace("px", "");
      const corners = connectorSpans(wrapper).map((el) => {
        const s = (el.element as HTMLElement).style;
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
      const wrapper = mount(Stepper, {
        props: {
          steps: STEPS,
          connector: "line",
          connectNodes: true,
          connectorAlign: "right",
        },
      });
      // gap is 0, so the inset wins: left = 8 - 0 = 8px.
      const spans = spanStyles(wrapper);
      expect(spans).toHaveLength(2);
      for (const span of spans) {
        expect(span.left).toBe("8px");
        expect(span.width).toBe("calc(100% - 56px)");
      }
    });

    it("vertical: the line stops 8px short of both circles", async () => {
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
      Element.prototype.getBoundingClientRect = function (
        this: Element,
      ): DOMRect {
        const el = this as HTMLElement;
        const idx = el.dataset?.stepIndex;
        if (idx === undefined) return zeroRect();
        const top = 483 + Number(idx) * 100;
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
        const wrapper = mount(Stepper, {
          props: { steps: STEPS, connector: "line", orientation: "vertical" },
        });
        await nextTick();
        const spans = connectorSpans(wrapper);
        expect(spans).toHaveLength(2);
        for (const el of spans) {
          const span = el.element as HTMLElement;
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
      const wrapper = mount(Stepper, { props: { steps: STEPS } });
      expect(wrapper.findAll("button").length).toBe(3);
    });

    it("moves focus between nodes with the arrow keys without activating", async () => {
      const onChange = vi.fn();
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, onChange },
      });
      const nodes = wrapper.findAll("button");
      const focusSpy = vi.spyOn(nodes[1].element, "focus");
      (nodes[0].element as HTMLElement).focus();
      await nodes[0].trigger("keydown", { key: "ArrowRight" });
      expect(focusSpy).toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("panel integration", () => {
    it("applies the shared corner scale to the Panel root", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, corner: "rounded-xl" },
      });
      expect(wrapper.find("section").classes()).toContain("rounded-4xl");
    });

    it("renders the nodes as divs and ignores clicks while disabled", async () => {
      const onChange = vi.fn();
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, disabled: true, onChange },
      });
      expect(wrapper.findAll("button").length).toBe(0);
      const firstDiv = wrapper.find("div.relative.z-10");
      expect(firstDiv.exists()).toBe(true);
      await firstDiv.trigger("click");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("covers the whole stepper while loading", () => {
      const wrapper = mount(Stepper, { props: { steps: STEPS, loading: true } });
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });
  });

  describe("loader type", () => {
    const statusCount = (w: ReturnType<typeof mount>) =>
      w.findAll('[role="status"]').length;

    it("whole-stepper skeleton: no Panel loader, body is a skeleton", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, loading: true, loaderType: "skeleton" },
      });
      expect(statusCount(wrapper)).toBe(0);
      expect(wrapper.text()).not.toContain("One");
    });

    it("skeleton: the connector is one inset segment per gap, not one full-width line through the discs", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, loading: true, loaderType: "skeleton" },
      });
      // 3 discs → 2 per-gap connector segments, each pulled 8px clear of its
      // discs (mx-2). The old single `left-0 right-0` line that ran through
      // the translucent discs is gone.
      expect(wrapper.findAll(".mx-2.flex-1").length).toBe(2);
      expect(wrapper.find(".left-0.right-0").exists()).toBe(false);
    });

    it.each(["spinner", "progress"] as const)(
      "whole-stepper %s: the Panel shows its loader overlay",
      (type) => {
        const wrapper = mount(Stepper, {
          props: { steps: STEPS, loading: true, loaderType: type },
        });
        expect(statusCount(wrapper)).toBeGreaterThan(0);
      },
    );

    it("per-step progress: the node shows a loader overlay", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: STEPS,
          loaderStepIds: ["s0"],
          loaderType: "progress",
        },
      });
      expect(statusCount(wrapper)).toBeGreaterThan(0);
    });

    it("per-step skeleton: the node stays put (no overlay)", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: STEPS,
          loaderStepIds: ["s0"],
          loaderType: "skeleton",
        },
      });
      expect(statusCount(wrapper)).toBe(0);
    });
  });

  describe("progress", () => {
    it("publishes a labelled progressbar with the right value", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: STEPS,
          showProgressBar: true,
          showProgressSummary: true,
          defaultCurrentIndex: 1,
        },
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.attributes("aria-valuenow")).toBe("33");
    });

    it("sits above the steps when top, below when bottom (via order)", () => {
      // The order sits on the progress block div (the progressbar's parent).
      const top = mount(Stepper, {
        props: { steps: STEPS, showProgressBar: true, progressBarPosition: "top" },
      });
      expect(top.find('[role="progressbar"]').element.parentElement?.style.order).toBe(
        "0",
      );
      const bottom = mount(Stepper, {
        props: { steps: STEPS, showProgressBar: true, progressBarPosition: "bottom" },
      });
      expect(bottom.find('[role="progressbar"]').element.parentElement?.style.order).toBe(
        "1",
      );
    });
  });

  describe("wired-up (formerly dead) props", () => {
    it("drops the transition classes entirely when animated=false", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, animated: false },
      });
      expect(wrapper.html()).not.toContain("transition-all duration-200");
      expect(wrapper.html()).not.toContain("transition-colors duration-200");
    });

    it("renders per-step actions from renderActions", () => {
      const wrapper = mount(Stepper, {
        props: {
          steps: STEPS,
          renderActions: (step: StepperStep) =>
            h("button", `${step.title} action`),
        },
      });
      expect(wrapper.text()).toContain("Two action");
    });

    it("shows a loader on a loading step", () => {
      const wrapper = mount(Stepper, {
        props: { steps: STEPS, loaderStepIds: ["s1"] },
      });
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });
  });

  describe("states", () => {
    it("shows an empty state when there are no steps", () => {
      const wrapper = mount(Stepper, { props: { steps: [] } });
      expect(wrapper.text()).toContain("No steps");
    });
  });
});

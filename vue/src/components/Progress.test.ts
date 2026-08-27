import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Progress from "./Progress.vue";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const mountBar = (props: Record<string, unknown> = {}) =>
  mount(Progress, { props });

const bar = (w: ReturnType<typeof mountBar>) => w.find('[role="progressbar"]');
const fill = (w: ReturnType<typeof mountBar>) =>
  bar(w).element.firstElementChild as HTMLElement;

describe("Progress", () => {
  describe("value", () => {
    it("clamps into the range", () => {
      expect(fill(mountBar({ value: 140 })).style.width).toBe("100%");
      expect(fill(mountBar({ value: -20 })).style.width).toBe("0%");
    });

    it("maps an arbitrary min/max onto the fill", () => {
      // The bar used to assume 0–100, so a byte counter or a step index had to
      // be converted by the caller before it could be shown.
      const w = mountBar({ value: 75, min: 50, max: 100 });
      expect(fill(w).style.width).toBe("50%");
      expect(bar(w).attributes("aria-valuemin")).toBe("50");
      expect(bar(w).attributes("aria-valuemax")).toBe("100");
      expect(bar(w).attributes("aria-valuenow")).toBe("75");
    });

    it("survives a zero-width range instead of dividing by zero", () => {
      expect(fill(mountBar({ value: 5, min: 5, max: 5 })).style.width).toBe("0%");
    });
  });

  describe("indeterminate", () => {
    it("omits aria-valuenow, which is what signals it", () => {
      const w = mountBar({ indeterminate: true });
      expect(bar(w).attributes("aria-valuenow")).toBeUndefined();
      expect(bar(w).attributes("aria-valuemax")).toBe("100");
    });

    it("sweeps instead of filling", () => {
      const w = mountBar({ indeterminate: true, value: 40 });
      expect(fill(w).className).toContain("progress-indeterminate");
      expect(fill(w).style.width).toBe("");
    });

    it("drops the shimmer and pulse, which fight the sweep", () => {
      const w = mountBar({ indeterminate: true, motion: "shimmer-pulse" });
      expect(w.find(".progress-shimmer").exists()).toBe(false);
      expect(fill(w).className).not.toContain("animate-pulse");
    });
  });

  describe("motion", () => {
    it("drives duration and direction through custom properties", () => {
      // They used to be an inline `animation` shorthand, which a
      // `prefers-reduced-motion` media query cannot override — so the bar
      // animated regardless of the user's setting.
      const w = mountBar({
        motion: "shimmer",
        motionSpeed: "fast",
        motionDirection: "reverse",
      });
      const style = bar(w).attributes("style")!;
      expect(style).toContain("--progress-duration: 1.2s");
      expect(style).toContain("--progress-direction: reverse");
      expect(w.find(".progress-shimmer").exists()).toBe(true);
      expect(style).not.toContain("animation:");
    });

    it("names the keyframes through a class, so the stylesheet owns them", () => {
      expect(mountBar({ motion: "stripes" }).find(".progress-stripes").exists()).toBe(
        true,
      );
    });

    it("still honours the deprecated showShimmer", () => {
      expect(
        mountBar({ showShimmer: true }).find(".progress-shimmer").exists(),
      ).toBe(true);
      expect(
        mountBar({ showShimmer: false }).find(".progress-shimmer").exists(),
      ).toBe(false);
    });

    it("hides the decorative overlays from assistive tech", () => {
      const w = mountBar({ motion: "stripes-shimmer" });
      for (const overlay of w.findAll("span")) {
        expect(overlay.attributes("aria-hidden")).toBe("true");
      }
    });
  });

  describe("label and value", () => {
    it("names the bar with its label", () => {
      // `role="progressbar"` with no accessible name is announced as just
      // "progress bar".
      const w = mountBar({ label: "Uploading", value: 30 });
      const id = bar(w).attributes("aria-labelledby");
      expect(id).toBeTruthy();
      expect(w.find(`[id="${id}"]`).text()).toBe("Uploading");
    });

    it("shows the value and publishes it as aria-valuetext", () => {
      const w = mountBar({ value: 30, showValue: true });
      expect(w.text()).toContain("30%");
      expect(bar(w).attributes("aria-valuetext")).toBe("30%");
    });

    it("takes a custom formatter", () => {
      const w = mountBar({
        value: 512,
        max: 1024,
        showValue: true,
        formatValue: (value: number, percent: number) =>
          `${value} MB (${Math.round(percent)}%)`,
      });
      expect(w.text()).toContain("512 MB (50%)");
      expect(bar(w).attributes("aria-valuetext")).toBe("512 MB (50%)");
    });

    it("renders the bare track when there is no header", () => {
      expect(mountBar({ value: 30 }).element.getAttribute("role")).toBe(
        "progressbar",
      );
    });
  });

  describe("appearance", () => {
    it("offers the whole shared control scale", () => {
      // Was a local "xs" | "sm" | "md" | "lg"; `xl` was unreachable.
      const heights = CONTROL_SIZES.map(
        (size) =>
          bar(mountBar({ size }))
            .classes()
            .find((c) => /^h-/.test(c))!,
      );
      expect(new Set(heights).size).toBe(CONTROL_SIZES.length);
    });

    it("renders every tone", () => {
      for (const color of TRUE_COLORS) {
        expect(fill(mountBar({ color, value: 50 })).className).toContain(
          `bg-${color}-500`,
        );
      }
    });

    it("accepts `tone` as an alias for `color`", () => {
      expect(fill(mountBar({ tone: "violet", value: 50 })).className).toContain(
        "bg-violet-500",
      );
    });

    it("squares off on request", () => {
      const classes = bar(mountBar({ corner: "none" })).classes();
      expect(classes).toContain("rounded-none");
      expect(classes).not.toContain("rounded-full");
    });
  });
});

describe("Progress header row", () => {
  it("parks a lone value over the end of the bar, not the start", () => {
    // `justify-between` with a single child aligns it to the start, so a bar
    // with a value and no label had its percentage stranded on the left.
    const wrapper = mount(Progress, { props: { value: 40, showValue: true } });
    expect(wrapper.get(".items-baseline").classes()).toContain("justify-end");
  });

  it("keeps label and value at opposite ends when both are shown", () => {
    const wrapper = mount(Progress, {
      props: { value: 40, showValue: true, label: "Uploading" },
    });
    expect(wrapper.get(".items-baseline").classes()).toContain(
      "justify-between",
    );
  });
});

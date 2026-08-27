import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

import Tooltip from "./Tooltip.vue";
import { TOOLTIP_POSITIONS } from "../../../common/tooltip/placement";

const mountTip = (props: Record<string, unknown> = {}) =>
  mount(Tooltip, {
    props: { text: "Explain", delay: 0, ...props },
    slots: { default: () => h("span", "label") },
    attachTo: document.body,
  });

const open = async (w: ReturnType<typeof mountTip>) => {
  await w.get("div[tabindex]").trigger("mouseenter");
  await vi.advanceTimersByTimeAsync(10);
  await w.vm.$nextTick();
};

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("renders the slot untouched when there is no text", () => {
    const w = mount(Tooltip, { slots: { default: () => h("b", "hi") } });
    expect(w.find("b").exists()).toBe(true);
    expect(w.find("div[tabindex]").exists()).toBe(false);
  });

  it("shows on hover after the delay, teleported to the body", async () => {
    vi.useFakeTimers();
    const w = mountTip();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await open(w);
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("Explain");
  });

  it("opens on keyboard focus, not only on hover", async () => {
    vi.useFakeTimers();
    const w = mountTip();
    const trigger = w.get("div[tabindex]");
    expect(trigger.attributes("tabindex")).toBe("0");
    await trigger.trigger("focus");
    await vi.advanceTimersByTimeAsync(10);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  });

  it("has a light look and a dark look, not one dark look for both", async () => {
    // It used to be `bg-neutral-900 … dark:bg-neutral-700` — dark in both
    // themes, with no light appearance at all.
    vi.useFakeTimers();
    const w = mountTip();
    await open(w);
    const tip = document.querySelector('[role="tooltip"]')!;
    expect(tip.className).toContain("bg-white");
    expect(tip.className).toContain("dark:bg-neutral-800");
  });

  it("offers an inverted variant for the classic contrast look", async () => {
    vi.useFakeTimers();
    const w = mountTip({ variant: "inverted" });
    await open(w);
    const tip = document.querySelector('[role="tooltip"]')!;
    expect(tip.className).toContain("bg-neutral-900");
    expect(tip.className).toContain("dark:bg-white");
  });

  it("accepts all four sides and publishes the one it used", async () => {
    expect(TOOLTIP_POSITIONS).toEqual(["top", "bottom", "left", "right"]);
    for (const position of TOOLTIP_POSITIONS) {
      vi.useFakeTimers();
      const w = mountTip({ position });
      await open(w);
      const tip = document.querySelector('[role="tooltip"]')!;
      expect(TOOLTIP_POSITIONS).toContain(tip.getAttribute("data-side"));
      w.unmount();
      document.body.innerHTML = "";
      vi.useRealTimers();
    }
  });

  it("hides again on leave", async () => {
    vi.useFakeTimers();
    const w = mountTip();
    await open(w);
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    await w.get("div[tabindex]").trigger("mouseleave");
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

// No TooltipWrapper mock in this file — it exists to prove the real delay path
// (Button → TooltipWrapper → the 1s default, or `tooltipDelay`) is wired. The
// mock in Button.test.ts can only show that a prop was handed over; an
// undefined delay reaching `setTimeout` would mean an instant tip, and only the
// real component can catch that.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => () => null,
}));

const mountButton = (props: Record<string, unknown> = {}) =>
  mount(Button, {
    props: { tooltip: "Ship it", ...props },
    slots: { default: "Go" },
    attachTo: document.body,
  });

const hover = async (w: ReturnType<typeof mountButton>) => {
  await w.find("button").trigger("mouseenter");
};

describe("Button — tooltip timing", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("waits the kit's 1s default before the tip appears", async () => {
    vi.useFakeTimers();
    const w = mountButton();
    await hover(w);
    await vi.advanceTimersByTimeAsync(999);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    await w.vm.$nextTick();
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("Ship it");
    w.unmount();
  });

  it("tooltipDelay retunes the wait", async () => {
    vi.useFakeTimers();
    const w = mountButton({ tooltipDelay: 100 });
    await hover(w);
    await vi.advanceTimersByTimeAsync(99);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    w.unmount();
  });

  it("never shows the tip after the pointer leaves inside the delay", async () => {
    vi.useFakeTimers();
    const w = mountButton({ tooltipDelay: 300 });
    await hover(w);
    await w.find("button").trigger("mouseleave");
    await vi.advanceTimersByTimeAsync(600);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    w.unmount();
  });

  it("stays away entirely while tooltipDisabled is set", async () => {
    vi.useFakeTimers();
    const w = mountButton({ tooltipDisabled: true });
    await hover(w);
    await vi.advanceTimersByTimeAsync(2000);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    w.unmount();
  });

  it("pulls a visible tip off the moment suppression flips on", async () => {
    // The `DropdownButton` case: its popup opens under the trigger mid-hover,
    // so the tip has to vanish without the pointer moving.
    vi.useFakeTimers();
    const w = mountButton();
    await hover(w);
    await vi.advanceTimersByTimeAsync(1000);
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    await w.setProps({ tooltipDisabled: true });
    await w.vm.$nextTick();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    w.unmount();
  });

  it("does not leak tooltip props onto the button element", () => {
    const w = mountButton({ tooltipDelay: 120, tooltipDisabled: false });
    const names = w
      .find("button")
      .element.getAttributeNames()
      .map((name) => name.toLowerCase());
    expect(names.filter((name) => name.includes("tooltip"))).toEqual([]);
    w.unmount();
  });
});

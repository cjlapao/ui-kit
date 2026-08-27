import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressSpinner from "./ProgressSpinner.vue";

/**
 * The Vue twin of the React component. The two are expected to sit side by
 * side at identical weight, so the geometry is asserted rather than eyeballed.
 */
describe("ProgressSpinner", () => {
  it("is indeterminate with no value, and says so in ARIA", () => {
    const wrapper = mount(ProgressSpinner);
    const root = wrapper.get('[role="progressbar"]');
    expect(root.attributes("aria-valuenow")).toBeUndefined();
    expect(wrapper.find(".progress-spinner-dash").exists()).toBe(true);
    expect(wrapper.find(".progress-spinner-rotate").exists()).toBe(true);
  });

  it("publishes the value when it has one", () => {
    const wrapper = mount(ProgressSpinner, { props: { value: 40 } });
    const root = wrapper.get('[role="progressbar"]');
    expect(root.attributes("aria-valuenow")).toBe("40");
    expect(root.attributes("aria-valuetext")).toBe("40%");
    // A determinate ring does not animate.
    expect(wrapper.find(".progress-spinner-dash").exists()).toBe(false);
  });

  it("clamps out-of-range values", () => {
    const over = mount(ProgressSpinner, { props: { value: 140 } });
    const under = mount(ProgressSpinner, { props: { value: -20 } });
    expect(over.get('[role="progressbar"]').attributes("aria-valuenow")).toBe(
      "100",
    );
    expect(under.get('[role="progressbar"]').attributes("aria-valuenow")).toBe(
      "0",
    );
  });

  it("shows the readout only when determinate and asked", () => {
    expect(mount(ProgressSpinner, { props: { value: 50 } }).text()).toContain(
      "50%",
    );
    expect(
      mount(ProgressSpinner, { props: { value: 50, showValue: false } }).text(),
    ).toBe("");
    expect(mount(ProgressSpinner).text()).toBe("");
  });

  it("converts the px stroke into viewBox units, so weight holds at every size", () => {
    // Left in px, "normal" would be a different physical weight at each size.
    const widths = (["xs", "md", "xl"] as const).map((size) =>
      Number(
        mount(ProgressSpinner, { props: { size } })
          .get("circle")
          .attributes("stroke-width"),
      ),
    );
    expect(new Set(widths).size).toBe(widths.length);
    for (const w of widths) expect(w).toBeGreaterThan(0);
  });

  it("pulls the radius in so a thick stroke does not clip", () => {
    const r = Number(
      mount(ProgressSpinner, { props: { size: "xs", thickness: "thick" } })
        .get("circle")
        .attributes("r"),
    );
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(25);
  });
});

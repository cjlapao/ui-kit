import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ColorSwatches from "./ColorSwatches.vue";

const chipBy = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.find(`button[aria-label="${label}"]`);

describe("ColorSwatches", () => {
  it("shows the full TrueColors set (condensed) when given nothing", () => {
    const wrapper = mount(ColorSwatches);
    // One layout: all 21 dots mounted, the clip what changes.
    expect(wrapper.findAll("[title]")).toHaveLength(21);
    expect(chipBy(wrapper, "Show 16 more colours").exists()).toBe(true);
  });

  it("is plain and unexpandable when everything fits the count rule", () => {
    const wrapper = mount(ColorSwatches, { props: { colors: ["red", "green", "blue"] } });
    expect(wrapper.findAll("button")).toHaveLength(0);
  });

  it("the chip expands and collapses, announcing the state", async () => {
    const wrapper = mount(ColorSwatches, {
      props: { colors: ["red", "green", "blue", "yellow"], maxVisible: 2 },
    });
    await chipBy(wrapper, "Show 2 more colours").trigger("click");
    expect(wrapper.element.hasAttribute("data-expanded")).toBe(true);
    for (const chip of wrapper.findAll("button"))
      expect(chip.attributes("aria-expanded")).toBe("true");
    await chipBy(wrapper, "Collapse colours").trigger("click");
    expect(wrapper.element.hasAttribute("data-expanded")).toBe(false);
  });

  it("opens on hover when expandOn is hover", async () => {
    const wrapper = mount(ColorSwatches, {
      props: { expandOn: "hover", colors: ["red", "green", "blue", "yellow"], maxVisible: 2 },
    });
    await wrapper.trigger("pointerenter");
    expect(wrapper.element.hasAttribute("data-expanded")).toBe(true);
    await wrapper.trigger("pointerleave");
    expect(wrapper.element.hasAttribute("data-expanded")).toBe(false);
  });

  it("starts expanded with defaultExpanded", () => {
    const wrapper = mount(ColorSwatches, {
      props: { defaultExpanded: true, colors: ["red", "green", "blue", "yellow"], maxVisible: 2 },
    });
    expect(wrapper.element.hasAttribute("data-expanded")).toBe(true);
  });

  it("maps size to dot classes and shape to rounding", () => {
    const wrapper = mount(ColorSwatches, { props: { size: "lg", shape: "square", colors: ["red"] } });
    expect(wrapper.find(".size-7.rounded-md").exists()).toBe(true);
  });

  it("shows names only in the expansion, but offers the chip to reveal them", () => {
    const wrapper = mount(ColorSwatches, { props: { showNames: true, colors: ["teal"] } });
    expect(chipBy(wrapper, "Expand colours").exists()).toBe(true);
    expect(wrapper.text()).toContain("teal");
  });

  it("merges a passed class onto the root", () => {
    const wrapper = mount(ColorSwatches, {
      props: { colors: ["red"] },
      attrs: { class: "rounded-lg" },
    });
    expect(wrapper.classes()).toContain("rounded-lg");
    expect(wrapper.classes()).toContain("relative");
  });
});

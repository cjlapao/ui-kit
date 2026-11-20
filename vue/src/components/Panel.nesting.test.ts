import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import Panel from "./Panel.vue";

describe("nested panel surfaces", () => {
  it.each(["simple", "tonal", "subtle", "glass", "liquid-glass"] as const)("steps matching %s panels", (variant) => {
    const child = () => h(Panel, { variant, tone: "neutral" }, { default: () => h(Panel, { variant, tone: "neutral" }) });
    const wrapper = mount(Panel, { props: { variant, tone: "neutral" }, slots: { default: child } });
    const panels = wrapper.element.querySelectorAll("section");
    expect(wrapper.element.querySelector(":scope > [data-nested-panel-wash]")).toBeNull();
    expect(panels[0].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
    expect(panels[1].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.08]");
  });

  it("reacts to parent tone changes and honors opt-out and overrides", async () => {
    const wrapper = mount(Panel, { props: { variant: "simple", tone: "blue" }, slots: { default: () => [h(Panel, { variant: "simple", tone: "blue" }), h(Panel, { variant: "simple", tone: "blue", nestedSurface: false }), h(Panel, { variant: "simple", tone: "blue", backgroundColor: "rose" })] } });
    const panels = wrapper.element.querySelectorAll("section");
    expect(panels[0].querySelector(":scope > [data-nested-panel-wash]")).not.toBeNull();
    expect(panels[1].querySelector(":scope > [data-nested-panel-wash]")).toBeNull();
    expect(panels[2].querySelector(":scope > [data-nested-panel-wash]")).toBeNull();
    await wrapper.setProps({ tone: "rose" });
    expect(panels[0].querySelector(":scope > [data-nested-panel-wash]")).toBeNull();
  });
});

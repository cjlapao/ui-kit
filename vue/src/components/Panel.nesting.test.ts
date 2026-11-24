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

  it.each(["simple", "tonal", "subtle", "glass", "liquid-glass"] as const)("raisedSurface forces the first depth step on %s without a parent", (variant) => {
    const wrapper = mount(Panel, { props: { variant, tone: "neutral", raisedSurface: true } });
    const wash = wrapper.element.querySelector(":scope > [data-nested-panel-wash]");
    expect(wash?.className).toContain("bg-black/[0.04]");
    expect(wash?.getAttribute("aria-hidden")).toBe("true");
  });

  it("raisedSurface survives nestedSurface opt-outs and background overrides", () => {
    const optedOut = mount(Panel, { props: { variant: "tonal", tone: "neutral", raisedSurface: true, nestedSurface: false } });
    expect(optedOut.element.querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
    const painted = mount(Panel, { props: { variant: "tonal", tone: "neutral", raisedSurface: true, backgroundColor: "neutral" } });
    expect(painted.element.querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
  });

  it("raisedSurface is a no-op outside the ladder's tinted variants", () => {
    const elevated = mount(Panel, { props: { variant: "elevated", tone: "neutral", raisedSurface: true } });
    const outlined = mount(Panel, { props: { variant: "outlined", tone: "neutral", raisedSurface: true } });
    const none = mount(Panel, { props: { variant: "none", raisedSurface: true } });
    expect(elevated.element.querySelector("[data-nested-panel-wash]")).toBeNull();
    expect(outlined.element.querySelector("[data-nested-panel-wash]")).toBeNull();
    expect(none.element.querySelector("[data-nested-panel-wash]")).toBeNull();
  });

  it("raisedSurface floors, never lowers — auto-nested cards keep their step", () => {
    const wrapper = mount(Panel, { props: { variant: "tonal", tone: "neutral" }, slots: { default: () => h(Panel, { variant: "tonal", tone: "neutral" }, { default: () => h(Panel, { variant: "tonal", tone: "neutral", raisedSurface: true }) }) } });
    const panels = wrapper.element.querySelectorAll("section");
    expect(panels[1].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.08]");
  });

  it("the ladder continues off a raised parent — a matching child steps to depth 2", () => {
    const wrapper = mount(Panel, { props: { variant: "tonal", tone: "neutral", raisedSurface: true }, slots: { default: () => h(Panel, { variant: "tonal", tone: "neutral" }) } });
    const panels = wrapper.element.querySelectorAll("section");
    expect(wrapper.element.querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.04]");
    expect(panels[0].querySelector(":scope > [data-nested-panel-wash]")?.className).toContain("bg-black/[0.08]");
  });
});

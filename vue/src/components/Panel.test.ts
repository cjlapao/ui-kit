import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Panel from "./Panel.vue";

describe("Panel untinted surfaces", () => {
  it("keeps elevated as the default and defaults to none tone", () => {
    const wrapper = mount(Panel, { slots: { default: "Body" } });
    expect(wrapper.attributes("data-variant")).toBe("elevated");
    expect(wrapper.attributes("data-tone")).toBe("none");
  });

  it("renders a layout-only none surface", () => {
    const wrapper = mount(Panel, { props: { variant: "none" }, slots: { default: "Body" } });
    expect(wrapper.text()).toContain("Body");
    expect(wrapper.classes().filter(token => /^(?:dark:)?(?:bg-|border(?:-|$)|ring-|shadow|backdrop-)/.test(token))).toEqual([]);
  });

  it("supports explicit tint and explicit none overrides the legacy color", async () => {
    const wrapper = mount(Panel, { props: { variant: "none", tone: "rose" } });
    expect(wrapper.classes().join(" ")).toContain("--color-rose-50");
    await wrapper.setProps({ tone: "none", color: "rose" });
    expect(wrapper.attributes("data-tone")).toBe("none");
    expect(wrapper.classes().some(token => token.includes("bg-rose"))).toBe(false);
  });
  it("explicit none also overrides legacy tint on glass rims and hover", () => {
    const wrapper = mount(Panel, { props: { variant: "glass", tone: "none", color: "rose", hoverable: true } });
    expect(wrapper.classes().join(" ")).not.toContain("rose");
  });

});

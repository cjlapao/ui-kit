import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import ContentActions from "./ContentActions.vue";

const actions = '[data-slot="content-actions-actions"]';
describe("ContentActions", () => {
  it("renders content before actions and preserves native semantics", () => {
    const wrapper = mount(ContentActions, { slots: { default: '<h2>Agent</h2>', actions: '<button>Edit</button>' } });
    expect(wrapper.find("h2").text()).toBe("Agent");
    expect(wrapper.element.firstElementChild?.textContent).toBe("Agent");
    expect(wrapper.find("button").attributes("role")).toBeUndefined();
    expect(wrapper.attributes("role")).toBeUndefined();
  });
  it("omits the action region when no slot is supplied", () => {
    const wrapper = mount(ContentActions, { slots: { default: "Content" } });
    expect(wrapper.find(actions).exists()).toBe(false);
    expect(wrapper.text()).toBe("Content");
  });
  it("forwards root attributes, listeners and class overrides", async () => {
    const click = vi.fn();
    const wrapper = mount(ContentActions, {
      props: { contentClassName: "content-custom", actionsClassName: "actions-custom" },
      attrs: { id: "header", class: "root-custom", "aria-label": "Agent header", style: { width: "320px" }, onClick: click },
      slots: { default: "Content", actions: "<button>Edit</button>" },
    });
    expect(wrapper.attributes("id")).toBe("header");
    expect(wrapper.attributes("aria-label")).toBe("Agent header");
    expect(wrapper.classes()).toContain("root-custom");
    expect(wrapper.attributes("style")).toContain("width: 320px");
    expect(wrapper.find('[data-slot="content-actions-content"]').classes()).toContain("content-custom");
    expect(wrapper.find(actions).classes()).toContain("actions-custom");
    await wrapper.find("button").trigger("click");
    expect(click).toHaveBeenCalledTimes(1);
  });
  it.each(["xs", "sm", "md", "lg", "xl"] as const)("accepts %s spacing", (gap) => {
    const wrapper = mount(ContentActions, { props: { gap }, slots: { default: "Content", actions: "<button>Edit</button>" } });
    expect(wrapper.find(actions).exists()).toBe(true);
  });
  it.each(["start", "center", "end"] as const)("accepts %s alignment", (align) => {
    const wrapper = mount(ContentActions, { props: { align }, slots: { default: "Content", actions: "<button>Edit</button>" } });
    expect(wrapper.find("button").text()).toBe("Edit");
  });
});

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import BreakdownCard, { type BreakdownItem } from "./BreakdownCard.vue";

const items: BreakdownItem[] = [
  { id: "a", label: "Alpha", value: 60, tone: "blue" },
  { id: "b", label: "Beta", value: 30, displayValue: "30k", tone: "amber" },
  { id: "c", label: "Gamma", value: 10, tone: "rose" },
];

describe("BreakdownCard", () => {
  it("renders title, caption and one labelled row per item", () => {
    const wrapper = mount(BreakdownCard, {
      props: { title: "Where it went", caption: "last quarter", items },
    });
    expect(wrapper.text()).toContain("Where it went");
    expect(wrapper.text()).toContain("last quarter");
    expect(wrapper.text()).toContain("Alpha");
    expect(wrapper.text()).toContain("Beta");
    expect(wrapper.text()).toContain("Gamma");
  });

  it("prefers displayValue over the raw value", () => {
    const wrapper = mount(BreakdownCard, { props: { title: "t", items } });
    expect(wrapper.text()).toContain("30k");
    expect(wrapper.text()).toContain("60");
  });

  it("computes whole-number shares of the total", () => {
    const wrapper = mount(BreakdownCard, { props: { title: "t", items } });
    expect(wrapper.text()).toContain("60%");
    expect(wrapper.text()).toContain("30%");
    expect(wrapper.text()).toContain("10%");
  });

  it("shows dashes instead of shares when nothing adds up", () => {
    const wrapper = mount(BreakdownCard, {
      props: { title: "t", items: [{ id: "z", label: "Zero", value: 0 }] },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("draws one donut slice per item", () => {
    const wrapper = mount(BreakdownCard, { props: { title: "Mix", items } });
    expect(wrapper.findAll("svg circle[stroke-dasharray]")).toHaveLength(3);
  });

  it("emits cta from the CTA button", async () => {
    const wrapper = mount(BreakdownCard, {
      props: { title: "t", items, ctaLabel: "Full report" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("cta")).toHaveLength(1);
  });

  it("renders the stats strip", () => {
    const wrapper = mount(BreakdownCard, {
      props: {
        title: "t",
        items,
        stats: [
          { label: "Total", value: "100k" },
          { label: "Delta", value: "+12%" },
        ],
      },
    });
    expect(wrapper.text()).toContain("Total");
    expect(wrapper.text()).toContain("100k");
    expect(wrapper.text()).toContain("+12%");
  });
  it("draws its own shape in placeholder ink while loading", () => {
    const wrapper = mount(BreakdownCard, {
      props: { title: "Cloud spend", items, loading: true },
      attachTo: document.body,
    });
    expect(wrapper.text()).toContain("Cloud spend");
    expect(wrapper.find(".animate-pulse").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Alpha");
    wrapper.unmount();
  });
});

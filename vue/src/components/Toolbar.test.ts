import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Toolbar from "./Toolbar.vue";

describe("Toolbar", () => {
  it("is a toolbar", () => {
    const w = mount(Toolbar, { slots: { start: "<button>a</button>" } });
    expect(w.attributes("role")).toBe("toolbar");
  });

  it("can name itself for assistive tech", () => {
    const w = mount(Toolbar, {
      attrs: { "aria-label": "Formatting" },
      slots: { start: "<button>a</button>" },
    });
    expect(w.attributes("aria-label")).toBe("Formatting");
  });

  it("lays out start, center and end in that order", () => {
    const w = mount(Toolbar, {
      slots: {
        start: '<span class="s" />',
        center: '<span class="c" />',
        end: '<span class="e" />',
      },
    });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(3);
    expect(groups[0].find(".s").exists()).toBe(true);
    expect(groups[1].find(".c").exists()).toBe(true);
    expect(groups[2].find(".e").exists()).toBe(true);
  });

  it("keeps the empty regions in the DOM, so `end` alone still parks right", () => {
    const w = mount(Toolbar, { slots: { end: '<span class="e" />' } });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(3);
    expect(groups[0].element.children.length).toBe(0);
    expect(groups[2].find(".e").exists()).toBe(true);
  });

  it("appends the default slot as a fourth group after the regions", () => {
    const w = mount(Toolbar, {
      slots: { start: '<span class="s" />', default: '<span class="x" />' },
    });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(4);
    expect(groups[3].find(".x").exists()).toBe(true);
  });

  it("passes attributes through and merges the class", () => {
    const w = mount(Toolbar, {
      attrs: { id: "tb", class: "border-0 bg-transparent" },
    });
    expect(w.attributes("id")).toBe("tb");
    expect(w.attributes("class")).toContain("border-0");
    expect(w.attributes("class")).toContain("rounded-2xl");
  });

  it("wears the Panel variant set", () => {
    expect(mount(Toolbar).attributes("class")).toContain("bg-white/90");
    expect(
      mount(Toolbar, { props: { variant: "elevated" } }).attributes("class"),
    ).toContain("shadow-xl");
    expect(
      mount(Toolbar, { props: { variant: "simple" } }).attributes("class"),
    ).toContain("bg-neutral-100");
  });

  it("tints the surface by tone, Panel-style", () => {
    expect(
      mount(Toolbar, { props: { variant: "tonal", tone: "indigo" } }).attributes(
        "class",
      ),
    ).toContain("indigo");
  });

  it("takes the shared corner and padding scales", () => {
    expect(
      mount(Toolbar, { props: { corner: "none" } }).attributes("class"),
    ).toContain("rounded-none");
    expect(
      mount(Toolbar, { props: { corner: "rounded-xl" } }).attributes("class"),
    ).toContain("rounded-4xl");
    expect(
      mount(Toolbar, { props: { padding: "none" } }).attributes("class"),
    ).toContain("p-0");
    expect(
      mount(Toolbar, { props: { padding: "sm" } }).attributes("class"),
    ).toContain("p-4");
  });
});

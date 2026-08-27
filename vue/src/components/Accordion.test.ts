import { describe, it, expect } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import Accordion from "./Accordion.vue";
import type { AccordionItem } from "./Accordion.vue";
import { CONTROL_SIZES, SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const ITEMS: AccordionItem[] = [
  { id: "a", title: "Alpha", subtitle: "First region", content: "Alpha content" },
  { id: "b", title: "Beta", content: "Beta content" },
];

const header = (wrapper: ReturnType<typeof mount>, title: string) =>
  wrapper
    .findAll('[role="button"]')
    .find((el) => el.text().includes(title))!;

describe("Accordion (Vue)", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const wrapper = mount(Accordion, { props: { items: ITEMS, variant } });
      expect(wrapper.find(`section[data-variant="${variant}"]`).exists()).toBe(true);
    });

    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() => mount(Accordion, { props: { items: ITEMS, tone } })).not.toThrow();
    });

    it.each(CONTROL_SIZES)("renders at size %s", (size) => {
      expect(() => mount(Accordion, { props: { items: ITEMS, size } })).not.toThrow();
    });
  });

  describe("tones actually apply", () => {
    it("drives the header hover and focus ring from the tone, not a neutral fallback", () => {
      // The old table only had a `neutral` entry and fell back to it with a
      // non-null assertion, so twenty of the twenty-one tones did nothing.
      const wrapper = mount(Accordion, { props: { items: ITEMS, tone: "emerald" } });
      const headerEl = header(wrapper, "Alpha");
      expect(headerEl.classes()).toContain("hover:bg-emerald-100/40");
      expect(headerEl.classes()).toContain("focus-visible:ring-emerald-400");
      expect(headerEl.classes()).not.toContain("bg-neutral-50/50");
    });
  });

  describe("toggling", () => {
    it("opens via defaultOpenIds and toggles on click", async () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, defaultOpenIds: ["a"] },
      });
      const alpha = header(wrapper, "Alpha");
      expect(alpha.attributes("aria-expanded")).toBe("true");

      await alpha.trigger("click");
      expect(alpha.attributes("aria-expanded")).toBe("false");
    });

    it("emits change and stays controlled via openIds", async () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, openIds: [] },
      });
      const alpha = header(wrapper, "Alpha");

      await alpha.trigger("click");
      expect(wrapper.emitted("change")).toBeTruthy();
      expect(wrapper.emitted("change")![0]).toEqual([["a"]]);
      // The parent owns the state, so nothing moves until it says so.
      expect(alpha.attributes("aria-expanded")).toBe("false");
    });

    it("ignores clicks and keys while disabled", async () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, disabled: true },
      });
      const alpha = header(wrapper, "Alpha");
      expect(alpha.attributes("aria-disabled")).toBe("true");
      expect(alpha.attributes("tabindex")).toBe("-1");

      await alpha.trigger("click");
      await alpha.trigger("keydown", { key: "Enter" });
      expect(alpha.attributes("aria-expanded")).toBe("false");
    });
  });

  describe("content", () => {
    it("animates open with grid rows rather than a guessed max-height", () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, defaultOpenIds: ["a"] },
      });
      const open = wrapper.find('[data-item-id="a"] [data-open="true"]');
      const closed = wrapper.find('[data-item-id="b"] [data-open="false"]');
      expect(open.attributes("style")).toContain("grid-template-rows: 1fr");
      expect(closed.attributes("style")).toContain("grid-template-rows: 0fr");
    });

    it("drops the transition entirely when animated=false", () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, animated: false },
      });
      const grid = wrapper.find('[data-open="false"]');
      expect(grid.classes()).not.toContain("transition-[grid-template-rows,opacity]");
    });

    it("does not emit a dynamic duration class", () => {
      const wrapper = mount(Accordion, { props: { items: ITEMS } });
      expect(wrapper.html()).not.toContain("duration-[");
    });

    it("makes the collapsed region inert, not merely invisible", () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, defaultOpenIds: ["a"] },
      });
      const closed = wrapper.find('[data-item-id="b"] [role="region"]');
      const open = wrapper.find('[data-item-id="a"] [role="region"]');
      expect(closed.attributes("inert")).toBeDefined();
      expect(closed.attributes("aria-hidden")).toBe("true");
      expect(open.attributes("inert")).toBeUndefined();
      expect(open.attributes("aria-hidden")).toBeUndefined();
    });

    it("labels each region by its own header", () => {
      const wrapper = mount(Accordion, { props: { items: ITEMS } });
      const regions = wrapper.findAll('[role="region"]');
      expect(regions.length).toBe(2);
      for (const region of regions) {
        const labelBy = region.attributes("aria-labelledby")!;
        expect(labelBy).not.toBe("");
        expect(wrapper.find(`[id="${labelBy}"]`).exists()).toBe(true);
      }
    });
  });

  describe("ids stay unique across instances", () => {
    it("two accordions with the same item ids do not collide", () => {
      const wrapper = mount({
        render: () =>
          h("div", [h(Accordion, { items: ITEMS }), h(Accordion, { items: ITEMS })]),
      });
      const controls = wrapper
        .findAll("[aria-controls]")
        .map((el) => el.attributes("aria-controls"));
      expect(controls.length).toBe(4);
      expect(new Set(controls).size).toBe(4);
    });
  });

  describe("indicators", () => {
    it("is a plain glyph, not a 128px circle", () => {
      // The old version built `h-${32} w-${32}` from a number, and Tailwind's
      // `h-32` is 8rem — a 128px ring around every row.
      const wrapper = mount(Accordion, { props: { items: ITEMS } });
      const indicator = wrapper.find(
        '[data-item-id="a"] [role="button"] > [aria-hidden="true"]',
      );
      expect(indicator.exists()).toBe(true);
      expect(indicator.classes()).not.toContain("rounded-full");
      expect(indicator.classes().some((c) => /^h-\d+$/.test(c))).toBe(false);
    });

    it("hides the indicator when none", () => {
      const wrapper = mount(Accordion, {
        props: { items: ITEMS, indicator: "none" },
      });
      expect(
        wrapper.find('[data-item-id="a"] [role="button"] > [aria-hidden="true"]').exists(),
      ).toBe(false);
    });
  });

  describe("states", () => {
    it("shows an empty state when there are no items", () => {
      const wrapper = mount(Accordion, { props: { items: [] } });
      expect(wrapper.text()).toContain("No items");
    });

    it("covers a loading row", () => {
      const wrapper = mount(Accordion, {
        props: { items: [{ ...ITEMS[0], loading: true }] },
      });
      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });
  });
});

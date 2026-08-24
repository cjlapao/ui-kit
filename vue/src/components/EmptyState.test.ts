import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyState, { EMPTY_STATE_VARIANTS } from "./EmptyState.vue";
import { TRUE_COLORS } from "../theme/Theme";

const mountState = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(EmptyState, { props: { title: "t", ...props }, slots });

describe("EmptyState", () => {
  describe("tones", () => {
    it("paints every tone from the scale, with no gaps", () => {
      // Both kits carried a hand-written map: React had five static neutral
      // entries plus a builder, Vue had one entry in which `neutral` resolved
      // to *slate* classes. So the same tone rendered differently per kit.
      for (const tone of TRUE_COLORS) {
        expect(mountState({ tone }).html()).toContain(`text-${tone}-500`);
      }
    });

    it("resolves `neutral` to neutral, not slate", () => {
      const html = mountState({ tone: "neutral" }).html();
      expect(html).toContain("neutral-500");
      expect(html).not.toContain("slate-500");
    });

    it("accepts `color` as an alias for `tone`", () => {
      expect(mountState({ color: "violet" }).html()).toContain(
        "text-violet-500",
      );
    });

    it("tints only the glyph with `iconColor`", () => {
      const html = mountState({ tone: "blue", iconColor: "rose" }).html();
      expect(html).toContain("text-rose-500");
      expect(html).not.toContain("text-blue-500");
    });
  });

  describe("surface", () => {
    it("renders every variant", () => {
      for (const variant of EMPTY_STATE_VARIANTS) {
        expect(mountState({ variant }).find("[class]").exists()).toBe(true);
      }
    });

    it("draws no card at all for `plain`", () => {
      const root = mountState({ variant: "plain" }).element as HTMLElement;
      expect(root.className).not.toMatch(/\bborder\b/);
      expect(root.className).not.toContain("outline-dashed");
      expect(root.className).not.toContain("bg-");
    });

    it("draws the dashed rule as an outline, not a border", () => {
      // A `border-2` layered on Panel's own `border` is a same-specificity
      // collision decided by emission order. An outline sits on top of any
      // variant and takes no space in the box model.
      const root = mountState({ tone: "emerald", dashed: true })
        .element as HTMLElement;
      expect(root.className).toContain("outline-dashed");
      expect(root.className).toContain("outline-emerald-300");
    });

    it("can drop the dashed rule", () => {
      const root = mountState({ dashed: false }).element as HTMLElement;
      expect(root.className).not.toContain("outline-dashed");
    });

    it("treats the two deprecated flags together as `plain`", () => {
      const root = mountState({
        disableBorder: true,
        transparentBackground: true,
      }).element as HTMLElement;
      expect(root.className).not.toContain("outline-dashed");
    });
  });

  describe("content", () => {
    it("renders without a title", () => {
      const wrapper = mount(EmptyState, {
        props: { subtitle: "Nothing here yet" },
      });
      expect(wrapper.text()).toContain("Nothing here yet");
    });

    it("names the region with its title", () => {
      const wrapper = mountState({ title: "No results" });
      const labelId = wrapper.attributes("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(wrapper.get(`[id="${labelId}"]`).text()).toBe("No results");
    });

    it("breaks long words without shredding prose", () => {
      // It was `break-all`, which splits ordinary sentences mid-word.
      const html = mountState({ subtitle: "s" }).html();
      expect(html).toContain("break-words");
      expect(html).not.toContain("break-all");
    });
  });

  describe("action", () => {
    it("renders from a label alone", () => {
      // It used to require `actionLabel` *and* `onAction`, so a label whose
      // handler was resolved conditionally rendered nothing.
      expect(mountState({ actionLabel: "Create" }).find("button").exists()).toBe(
        true,
      );
    });

    it("calls the handler and emits", async () => {
      const onAction = vi.fn();
      const wrapper = mountState({ actionLabel: "Create", onAction });
      await wrapper.find("button").trigger("click");
      expect(onAction).toHaveBeenCalledOnce();
      expect(wrapper.emitted("action")).toHaveLength(1);
    });

    it("takes arbitrary footer content instead", () => {
      const wrapper = mountState(
        { actionLabel: "Ignored" },
        { actions: '<button type="button">Custom</button>' },
      );
      expect(wrapper.text()).toContain("Custom");
      expect(wrapper.text()).not.toContain("Ignored");
    });

    it("defaults the button tone to the empty state's", () => {
      const wrapper = mountState({ tone: "amber", actionLabel: "Create" });
      expect(wrapper.find("button").attributes("data-color")).toBe("amber");
    });
  });

  describe("size", () => {
    it("scales the icon, type and action together", () => {
      const small = mountState({ size: "xs", actionLabel: "a" });
      const large = mountState({ size: "xl", actionLabel: "a" });

      expect(small.html()).toContain("h-8 w-8");
      expect(small.html()).toContain("text-sm");
      expect(small.find("button").attributes("data-size")).toBe("xs");

      expect(large.html()).toContain("h-16 w-16");
      expect(large.html()).toContain("text-2xl");
      expect(large.find("button").attributes("data-size")).toBe("md");
    });

    it("still honours the deprecated `textSize`", () => {
      expect(mountState({ textSize: "xl" }).html()).toContain("text-2xl");
    });

    it("lets `size` win over `textSize`", () => {
      expect(mountState({ size: "xs", textSize: "xl" }).html()).toContain(
        "h-8 w-8",
      );
    });
  });

  describe("icon", () => {
    it("renders a real glyph by default", () => {
      // The default was `"Plus"`, which is not in the registry — so every
      // default empty state rendered the missing-icon placeholder.
      expect(mountState().find("svg").exists()).toBe(true);
    });

    it("sizes the glyph once", () => {
      const box = mountState().find("svg").element.parentElement!.className;
      expect(box).toContain("h-12 w-12");
      expect(box.split(" ").filter((c) => /^h-\d/.test(c))).toHaveLength(1);
    });

    it("gives the disc a partner in both themes", () => {
      // It was `dark:bg-white/5` with nothing in light mode, and square.
      const disc = mountState({ tone: "sky" })
        .find("svg")
        .element.closest("div")!.className;
      expect(disc).toContain("bg-sky-100/70");
      expect(disc).toContain("dark:bg-sky-500/15");
      expect(disc).toContain("rounded-full");
    });

    it("can drop the disc and the glyph", () => {
      const disc = mountState({ iconBackground: false })
        .find("svg")
        .element.closest("div")!.className;
      expect(disc).not.toContain("bg-");

      expect(mountState({ showIcon: false }).find("svg").exists()).toBe(false);
    });
  });
});

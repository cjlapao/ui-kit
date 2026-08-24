import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "./Alert.vue";
import {
  ALERT_INTENT_CONFIG,
  ALERT_INTENTS,
  ALERT_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

const mountAlert = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(Alert, { props: { title: "t", ...props }, slots });

describe("Alert", () => {
  describe("intent", () => {
    it("resolves every intent to a real tone and icon", () => {
      // The demos passed `tone="info" | "success" | "warning" | "danger"` for
      // months. None is a TrueColor, so `getAlertColorClasses` fell through to
      // its blue fallback and all four rendered identically.
      for (const intent of ALERT_INTENTS) {
        const { tone } = ALERT_INTENT_CONFIG[intent];
        expect(TRUE_COLORS).toContain(tone);
        expect(mountAlert({ intent }).html()).toContain(`${tone}-50`);
      }
    });

    it("lets `color` override the intent's tone", () => {
      const html = mountAlert({ intent: "danger", color: "violet" }).html();
      expect(html).toContain("violet-50");
      expect(html).not.toContain("red-50");
    });

    it("still honours the deprecated `tone`", () => {
      expect(mountAlert({ tone: "teal" }).html()).toContain("teal-50");
    });

    it("shows an icon for every tone", () => {
      // Vue's `defaultIcons` had exactly one entry — `neutral` — so 20 of the
      // 21 tones rendered no icon at all while React rendered one.
      for (const intent of ALERT_INTENTS) {
        expect(mountAlert({ intent }).find("svg").exists()).toBe(true);
      }
    });
  });

  describe("live region", () => {
    it("interrupts for a failure and waits its turn for information", () => {
      expect(mountAlert({ intent: "danger" }).attributes("role")).toBe("alert");
      expect(mountAlert({ intent: "info" }).attributes("role")).toBe("status");
    });

    it("can be silenced", () => {
      const wrapper = mountAlert({ intent: "danger", live: "off" });
      expect(wrapper.attributes("role")).toBeUndefined();
      expect(wrapper.attributes("aria-live")).toBeUndefined();
    });
  });

  describe("content", () => {
    it("renders the default slot when there is no description", () => {
      const wrapper = mountAlert({}, { default: "Body copy" });
      expect(wrapper.text()).toContain("Body copy");
    });

    it("names the callout with its title", () => {
      const wrapper = mountAlert({ title: "Disk full" });
      const labelId = wrapper.attributes("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(wrapper.get(`[id="${labelId}"]`).text()).toBe("Disk full");
    });
  });

  describe("dismissing", () => {
    it("hides itself when nothing else owns the state", async () => {
      const wrapper = mountAlert({ dismissible: true });
      await wrapper.find("button").trigger("click");
      expect(wrapper.find("[role]").exists()).toBe(false);
      expect(wrapper.emitted("dismiss")).toHaveLength(1);
    });

    it("stays put when `open` is controlled", async () => {
      const wrapper = mountAlert({ dismissible: true, open: true });
      await wrapper.find("button").trigger("click");
      expect(wrapper.emitted("dismiss")).toHaveLength(1);
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("takes a custom dismiss label", () => {
      const wrapper = mountAlert({
        dismissible: true,
        dismissLabel: "Close banner",
      });
      expect(wrapper.find("button").attributes("aria-label")).toBe(
        "Close banner",
      );
    });
  });

  describe("variants", () => {
    it("puts a solid fill under copy that reaches WCAG AA", () => {
      // The fill used to be `{color}-600` light / `-500` dark under white,
      // which is under 4.5:1 for 11 and 16 of the 21 tones respectively.
      for (const color of TRUE_COLORS) {
        const html = mountAlert({ variant: "solid", color, description: "d" }).html();
        expect(html).toContain(`bg-${color}-700`);
        expect(html).toContain(`dark:bg-${color}-400`);
        expect(html).toContain(`dark:text-${color}-950`);
      }
    });

    it("keeps solid copy legible on the fill", () => {
      const html = mountAlert({
        variant: "solid",
        color: "blue",
        description: "d",
      }).html();
      expect(html).toContain("bg-blue-700");
      expect(html).toContain("text-white");
      expect(html).not.toContain("text-blue-700");
    });

    it("leaves outline transparent", () => {
      const html = mountAlert({ variant: "outline", color: "blue" }).html();
      expect(html).toContain("bg-transparent");
      expect(html).not.toContain("bg-white");
    });

    it("blurs the backdrop for the glass pair", () => {
      for (const variant of ["glass", "liquid-glass"] as const) {
        expect(mountAlert({ variant }).html()).toContain("backdrop-blur");
      }
    });

    it("renders every tone and variant without a gap", () => {
      for (const color of TRUE_COLORS) {
        for (const variant of ALERT_VARIANTS) {
          const wrapper = mountAlert({ color, variant, description: "d" });
          expect(wrapper.find("[class]").exists()).toBe(true);
        }
      }
    });
  });

  describe("size", () => {
    it("scales the box with the shared control scale", () => {
      expect(mountAlert({ size: "xs" }).html()).toContain("px-2.5");
      const large = mountAlert({ size: "xl" }).html();
      expect(large).toContain("px-6");
      expect(large).toContain("text-lg");
    });
  });

  describe("icon", () => {
    it("scales independently of the callout", () => {
      // CustomIcon puts the dimensions on its own wrapper span, not the svg.
      const glyphBox = (props: Record<string, unknown>) =>
        mountAlert({ size: "xs", ...props }).find("svg").element.parentElement!
          .className;

      // The size-derived step for `xs` is `sm` (h-5); `iconSize` overrides it.
      expect(glyphBox({})).toContain("h-5");
      expect(glyphBox({ iconSize: "xl" })).toContain("h-8");
    });

    it("keeps the default glyph centred on the title's line", () => {
      // A `min-h` box lets the default glyph — which is a step taller than the
      // title's line — push its own centre ~3px below the title's. The fixed
      // box is what makes them agree; only an explicit `iconSize` relaxes it.
      const box = mountAlert({ description: "d" })
        .find("svg")
        .element.closest("div")!
        .className.split(" ");
      expect(box).toContain("h-5");
      expect(box).not.toContain("min-h-5");
    });

    it("aligns top, centre or bottom", () => {
      const box = (iconAlign: "top" | "center" | "bottom") =>
        mountAlert({ iconAlign, description: "d" })
          .find("svg")
          .element.closest("div")!.className;

      expect(box("top")).toContain("self-start");
      // The fixed box is what pins the glyph to the title's line, so it only
      // applies to the top alignment — the other two size to the whole block.
      expect(box("top").split(" ")).toContain("h-5");
      expect(box("center")).toContain("self-center");
      expect(box("center").split(" ")).not.toContain("h-5");
      expect(box("bottom")).toContain("self-end");
      expect(box("bottom").split(" ")).not.toContain("h-5");
    });

    it("grows its box rather than overflowing for a large icon", () => {
      // The box used to be a fixed `h-5`, so an icon taller than the title's
      // line spilled out of it.
      const box = mountAlert({ size: "xs", iconSize: "xl", iconAlign: "top" })
        .find("svg")
        .element.closest("div")!
        .className.split(" ");
      expect(box).toContain("min-h-4");
      expect(box.some((token) => /^h-\d/.test(token))).toBe(false);
    });

    it("can be turned off", () => {
      expect(
        mountAlert({ intent: "danger", icon: false }).find("svg").exists(),
      ).toBe(false);
    });
  });
});

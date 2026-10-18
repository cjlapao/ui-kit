import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import HelpButton from "./HelpButton.vue";
import {
  CONTROL_SIZES,
  SURFACE_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

// The panel is a <Teleport to="body">, so it is queried off the document, not
// the wrapper. VTU does not remove teleported nodes reliably, so we clear them
// around each test (same as DropdownMenu.test).
const clearPanels = () => {
  document.body
    .querySelectorAll('[role="dialog"]')
    .forEach((el) => el.remove());
};
beforeEach(clearPanels);
afterEach(clearPanels);

const panel = () =>
  document.querySelector('[role="dialog"]') as HTMLElement | null;

describe("HelpButton (Vue)", () => {
  describe("tones — generated from the theme, no hand-written map", () => {
    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(
        () => mount(HelpButton, { props: { content: "x", color: tone } }),
      ).not.toThrow();
    });

    it.each(TRUE_COLORS)(
      "the header carries %s's own accent (not the neutral fallback)",
      async (tone) => {
        mount(HelpButton, { props: { content: "x", color: tone } });
        await nextTick();
        const html = panel()!.innerHTML;
        expect(html).toContain(`bg-${tone}-50/80`);
        expect(html).toContain(`dark:bg-${tone}-500/10`);
        expect(html).toContain(`text-${tone}-700`);
        expect(html).toContain(`dark:text-${tone}-200`);
      },
    );
  });

  describe("surface variant", () => {
    it.each(SURFACE_VARIANTS)("applies the %s surface", async (variant) => {
      mount(HelpButton, { props: { content: "x", variant } });
      await nextTick();
      expect(panel()).not.toBeNull();
    });
  });

  describe("loading", () => {
    it("shows a skeleton body, not the copy, while loading", async () => {
      mount(HelpButton, {
        props: { content: "The real help copy", loading: true },
      });
      await nextTick();
      const html = panel()!.innerHTML;
      expect(html).toContain("animate-pulse");
      expect(html).not.toContain("The real help copy");
    });
    it("shows the copy when not loading", async () => {
      mount(HelpButton, { props: { content: "The real help copy" } });
      await nextTick();
      const html = panel()!.innerHTML;
      expect(html).toContain("The real help copy");
      expect(html).not.toContain("animate-pulse");
    });
  });

  describe("size — the shared ControlSize scale", () => {
    it.each(CONTROL_SIZES)("accepts control size %s", (size) => {
      expect(
        () => mount(HelpButton, { props: { content: "x", size } }),
      ).not.toThrow();
    });
  });
});

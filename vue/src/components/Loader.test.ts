import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Loader from "./Loader.vue";
import { TRUE_COLORS } from "../theme/Theme";

const root = (w: ReturnType<typeof mount>) => w.element as HTMLElement;
const bar = (w: ReturnType<typeof mount>) =>
  w.find('[role="progressbar"]').element as HTMLElement;

describe("Loader", () => {
  it("is a status region", () => {
    const w = mount(Loader, { props: { title: "Syncing" } });
    expect(w.find('[role="status"]').exists()).toBe(true);
  });

  describe("variants", () => {
    it("renders a spinner by default", () => {
      const w = mount(Loader);
      expect(w.find('[class*="animate"]').exists()).toBe(true);
    });

    it("renders a progress bar on demand", () => {
      const w = mount(Loader, { props: { variant: "progress", progress: 40 } });
      expect(w.find('[role="progressbar"]').exists()).toBe(true);
    });
  });

  describe("size", () => {
    it("drives the progress bar height, not just the spinner", () => {
      // The bar was hardcoded to size="md" before: `size` was a dead prop on
      // the progress variant.
      const w = mount(Loader, { props: { variant: "progress", size: "xl" } });
      expect(bar(w).className).toContain("h-4");

      const sm = mount(Loader, { props: { variant: "progress", size: "sm" } });
      expect(bar(sm).className).toContain("h-1.5");
    });

    it("scales the title and label type with the same prop", () => {
      const w = mount(Loader, { props: { size: "xs", title: "T", label: "L" } });
      const [title, , label] = Array.from(root(w).children);
      expect((title as HTMLElement).className).toContain("text-xs");
      expect((label as HTMLElement).className).toContain("text-xs");
    });
  });

  describe("progress", () => {
    it("publishes the value", () => {
      const w = mount(Loader, { props: { variant: "progress", progress: 40 } });
      expect(bar(w).getAttribute("aria-valuenow")).toBe("40");
    });

    it("indeterminate sweeps and omits aria-valuenow", () => {
      const w = mount(Loader, { props: { variant: "progress", indeterminate: true } });
      expect(bar(w).getAttribute("aria-valuenow")).toBeNull();
    });
  });

  describe("overlay", () => {
    it("covers the positioned ancestor with a solid scrim by default", () => {
      const w = mount(Loader, { props: { overlay: true, title: "Busy" } });
      const cls = root(w).className;
      expect(cls).toContain("absolute");
      expect(cls).toContain("inset-0");
      expect(cls).toContain("z-50");
      expect(cls).toContain("bg-white/85");
      expect(cls).toContain("dark:bg-neutral-900/80");
    });

    it("takes its glass fill from the shared theme scale, tinted with its tone", () => {
      const w = mount(Loader, { props: { overlay: true, glass: true, color: "blue", title: "Busy" } });
      const cls = root(w).className;
      expect(cls).toContain("bg-blue-50/70");
      expect(cls).toContain("dark:bg-blue-500/25");
    });

    it("emits the glass fill for every one of the 21 tones", () => {
      for (const color of TRUE_COLORS) {
        const w = mount(Loader, { props: { overlay: true, glass: true, color, title: "Busy" } });
        const cls = root(w).className;
        expect(cls).toContain(`bg-${color}-50/70`);
        expect(cls).toContain(`dark:bg-${color}-500/25`);
      }
    });

    it("spells out the surface tokens it draws", () => {
      // Vue has no SurfaceProvider yet, so the overlay computes its own
      // surface tokens instead of reading a context.
      const glass = mount(Loader, { props: { overlay: true, glass: true, title: "Busy", label: "Hang tight" } });
      const glassLabel = Array.from(root(glass).children).filter(
        (el) => (el as HTMLElement).tagName === "DIV" && (el.textContent || "").includes("Hang tight"),
      )[0] as HTMLElement;
      expect(glassLabel.className).toContain("text-neutral-800");

      const scrim = mount(Loader, { props: { overlay: true, title: "Busy", label: "Hang tight" } });
      const scrimLabel = Array.from(root(scrim).children).filter(
        (el) => (el as HTMLElement).tagName === "DIV" && (el.textContent || "").includes("Hang tight"),
      )[0] as HTMLElement;
      expect(scrimLabel.className).toContain("text-neutral-600 dark:text-neutral-300");
    });
  });
});

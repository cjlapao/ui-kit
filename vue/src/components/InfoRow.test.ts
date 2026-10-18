import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import InfoRow, { INFO_ROW_VARIANTS, INFO_ROW_LOADERS } from "./InfoRow.vue";
import {
  CONTROL_SIZES,
  PLAIN_SURFACE_VARIANTS,
  SURFACE_PADDINGS,
  TRUE_COLORS,
  getSurfaceTriggerTokens,
  hasTextColor,
  stripTextColor,
} from "../theme/Theme";

const mockClipboard = (impl?: () => Promise<void>) => {
  const writeText = vi.fn(impl ?? (() => Promise.resolve()));
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
  return writeText;
};

const dropClipboard = () => {
  Object.defineProperty(navigator, "clipboard", {
    value: undefined,
    configurable: true,
    writable: true,
  });
};

const mountRow = (props: Record<string, unknown> = {}) =>
  mount(InfoRow, { props: { label: "L", ...props }, attachTo: document.body });

const copyButton = (w: ReturnType<typeof mountRow>) => w.get("button");

describe("InfoRow", () => {
  beforeEach(() => {
    mockClipboard();
  });
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("shared scales", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        const w = mountRow({ value: "V", size });
        expect(w.html()).not.toBe("");
        w.unmount();
      }
      expect(CONTROL_SIZES).toContain("xl");
    });

    it("takes every surface padding", () => {
      for (const padding of SURFACE_PADDINGS) {
        const w = mountRow({ value: "V", padding });
        expect(w.html()).not.toBe("");
        w.unmount();
      }
    });

    it("exposes the promoted surface-plus-plain list, not a private copy", () => {
      expect(INFO_ROW_VARIANTS).toBe(PLAIN_SURFACE_VARIANTS);
      expect(INFO_ROW_VARIANTS).toContain("plain");
      expect(INFO_ROW_VARIANTS).toContain("liquid-glass");
    });

    it("renders every variant", () => {
      for (const variant of INFO_ROW_VARIANTS) {
        const w = mountRow({ value: "V", variant });
        expect(w.html()).not.toBe("");
        w.unmount();
      }
    });

    it("draws the hover wash and focus ring in every tone, generated not hand-written", () => {
      for (const tone of TRUE_COLORS) {
        const w = mountRow({ value: "V", tone, hoverable: true });
        const { hover, focusRing } = getSurfaceTriggerTokens(tone);
        expect(w.html()).toContain(hover.split(" ")[0]);
        expect(w.html()).toContain(focusRing.split(" ").slice(-1)[0]);
        w.unmount();
      }
    });
  });

  describe("layout", () => {
    it("is its own root element when plain, so `last:border-0` still matches", () => {
      const w = mountRow({ value: "V" });
      expect(w.element.className).toContain("last:border-0");
      expect(w.element.className).toContain("flex");
    });

    it("wraps in a Panel for any non-plain variant", () => {
      const w = mountRow({ value: "V", variant: "elevated" });
      expect(w.element.className).not.toContain("last:border-0");
      expect(w.find(".last\\:border-0").exists()).toBe(true);
    });

    it("forwards native attributes to the root", () => {
      const w = mountRow({ value: "V", id: "row-1" });
      expect(w.element.getAttribute("id")).toBe("row-1");
    });
  });

  describe("value normalisation", () => {
    it("renders a boolean as Yes / No", async () => {
      const w = mountRow({ value: true });
      expect(w.text()).toContain("Yes");
      await w.setProps({ value: false });
      expect(w.text()).toContain("No");
    });

    it("hides an empty row by default and shows the placeholder when told not to", async () => {
      const w = mountRow({ value: "" });
      // A `v-if`ed-away root renders as an empty comment placeholder, not "".
      expect(w.find("span").exists()).toBe(false);
      await w.setProps({ hideIfEmpty: false });
      expect(w.text()).toContain("—");
    });

    it("suppresses the copy button for a `value` slot", () => {
      const w = mount(InfoRow, {
        props: { label: "L" },
        slots: { value: "<em>rich</em>" },
      });
      expect(w.find("button").exists()).toBe(false);
    });
  });

  describe("loading, empty and error", () => {
    it("stays visible while loading even with no value yet", () => {
      const w = mountRow({ loading: true });
      expect(w.find("span").exists()).toBe(true);
      expect(w.element.getAttribute("aria-busy")).toBe("true");
    });

    it("stays visible for an error with no value", () => {
      const w = mountRow({ error: "Lookup failed" });
      expect(w.find("span").exists()).toBe(true);
      expect(w.text()).toContain("Lookup failed");
    });

    it("offers both loaders", () => {
      expect(INFO_ROW_LOADERS).toEqual(["skeleton", "spinner"]);
      expect(mountRow({ loading: true, loaderType: "skeleton" }).html()).toContain(
        "animate-pulse",
      );
      expect(mountRow({ loading: true, loaderType: "spinner" }).html()).toContain(
        "animate-spin",
      );
    });

    it("tints both loaders with the row's tone, in every tone", () => {
      for (const tone of TRUE_COLORS) {
        const skeleton = mountRow({
          loading: true,
          loaderType: "skeleton",
          tone,
        });
        expect(skeleton.html()).toContain(`bg-${tone}-500/20`);
        expect(skeleton.html()).toContain(`dark:bg-${tone}-500/25`);
        expect(skeleton.html()).not.toContain("bg-black/10");
        skeleton.unmount();

        const spinner = mountRow({ loading: true, loaderType: "spinner", tone });
        expect(spinner.html()).toContain(`text-${tone}-500`);
        expect(spinner.html()).toContain(`dark:text-${tone}-400`);
        spinner.unmount();
      }
    });

    it("stops both loaders under reduced motion", () => {
      expect(mountRow({ loading: true }).html()).toContain(
        "motion-reduce:animate-none",
      );
    });

    it("shows no copy button while loading or errored", async () => {
      const w = mountRow({ value: "V", loading: true });
      expect(w.find("button").exists()).toBe(false);
      await w.setProps({ loading: false, error: "nope" });
      expect(w.find("button").exists()).toBe(false);
    });

    it("announces an error politely rather than assertively", () => {
      const w = mountRow({ error: "Lookup failed" });
      expect(w.findAll('[role="status"]').length).toBeGreaterThan(0);
      expect(w.find('[role="alert"]').exists()).toBe(false);
    });
  });

  describe("copy", () => {
    it("writes the value and reports it", async () => {
      const writeText = mockClipboard();
      const w = mountRow({ value: "abc-123" });
      await copyButton(w).trigger("click");
      await flushPromises();
      expect(writeText).toHaveBeenCalledWith("abc-123");
      expect(w.emitted("copy")?.[0]).toEqual(["abc-123"]);
    });

    it("survives a missing clipboard instead of throwing", async () => {
      // `navigator.clipboard` is undefined outside a secure context. The old
      // code read `.writeText` off it unguarded.
      dropClipboard();
      const w = mountRow({ value: "abc" });
      await copyButton(w).trigger("click");
      await flushPromises();
      expect(w.text()).toContain("Copy failed");
      expect(w.emitted("copy")).toBeUndefined();
    });

    it("survives a rejected write instead of an unhandled rejection", async () => {
      mockClipboard(() => Promise.reject(new Error("not focused")));
      const w = mountRow({ value: "abc" });
      await copyButton(w).trigger("click");
      await flushPromises();
      expect(w.text()).toContain("Copy failed");
      expect(w.emitted("copy")).toBeUndefined();
    });

    it("confirms in a polite live region", async () => {
      const w = mountRow({ value: "abc" });
      await copyButton(w).trigger("click");
      await flushPromises();
      const live = w.findAll('[role="status"]').map((n) => n.text());
      expect(live).toContain("Copied to clipboard");
    });

    it("keeps the copy button reachable by keyboard", () => {
      const w = mountRow({ value: "abc" });
      expect(copyButton(w).element.className).toContain(
        "focus-visible:opacity-100",
      );
    });
  });

  describe("class overrides", () => {
    it("lets a caller's text colour replace the row's own", () => {
      const w = mountRow({
        value: "V",
        valueClassName: "text-sky-500",
        labelClassName: "text-emerald-600 font-semibold",
      });
      const html = w.html();
      expect(html).toContain("text-sky-500");
      expect(html).toContain("text-emerald-600");
      expect(html).not.toContain("text-neutral-500");
      expect(html).not.toContain("text-neutral-700");
    });

    it("keeps its own colour when the override sets only a size or weight", () => {
      const w = mountRow({ value: "V", valueClassName: "font-bold text-lg" });
      expect(w.html()).toContain("text-neutral-700");
    });
  });

  describe("hasTextColor / stripTextColor", () => {
    it("tells a text colour apart from a text size", () => {
      expect(hasTextColor("text-sky-500")).toBe(true);
      expect(hasTextColor("dark:text-white")).toBe(true);
      expect(hasTextColor("text-black/40")).toBe(true);
      expect(hasTextColor("text-sm")).toBe(false);
      expect(hasTextColor("text-base font-bold")).toBe(false);
      expect(hasTextColor("text-[11px]")).toBe(false);
      expect(hasTextColor(undefined)).toBe(false);
    });

    it("removes only the colour", () => {
      expect(stripTextColor("text-sm text-sky-500 font-bold")).toBe(
        "text-sm font-bold",
      );
    });
  });

  describe("parity with the React kit", () => {
    it("uses the same size, padding and loader lists", () => {
      expect(INFO_ROW_LOADERS).toEqual(["skeleton", "spinner"]);
      expect([...SURFACE_PADDINGS]).toEqual(["none", ...CONTROL_SIZES]);
    });
  });
});

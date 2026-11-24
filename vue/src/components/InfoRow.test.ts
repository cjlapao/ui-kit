import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { h } from "vue";
import { DOMWrapper, mount, flushPromises } from "@vue/test-utils";

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

    it("renders no placeholder at all when emptyText is null", async () => {
      const w = mountRow({ value: "", hideIfEmpty: false, emptyText: null });
      expect(w.find("span").exists()).toBe(true); // the row itself stands
      expect(w.text()).not.toContain("—");
      expect(w.text()).toContain("L");
      // Loading and error are states, not decoration — they still paint.
      await w.setProps({ loading: true });
      expect(w.html()).toContain("animate-pulse");
      await w.setProps({ loading: false, error: "Lookup failed" });
      expect(w.text()).toContain("Lookup failed");
    });

    it("keeps a sub-item row clean of the dash when emptyText is null", () => {
      // The Image-digest shape: the row lives for its sub-items, and the
      // empty value must not greet it with a floating "—".
      const w = mountRow({
        value: "",
        subItems: [{ text: "Policy:", value: "allow" }],
        emptyText: null,
      });
      expect(w.text()).not.toContain("—");
      expect(w.text()).toContain("Policy:");
    });

    it("still hides the whole row under hideIfEmpty when there is no placeholder", () => {
      const w = mountRow({ value: "", emptyText: null });
      expect(w.find("span").exists()).toBe(false);
    });

    it("lets a `value` slot own the area even with no placeholder", () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "", emptyText: null },
        slots: { value: "<em>rich</em>" },
      });
      expect(w.html()).toContain("<em>rich</em>");
      expect(w.text()).not.toContain("—");
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
      expect(w.get(".text-emerald-600").classes()).not.toContain("text-neutral-500");
      expect(w.get(".text-sky-500").classes()).not.toContain("text-neutral-700");
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

  // ── icon / sub-items / collapsible body / bottom border ──────────────────
  // Mirrors the React matrix (InfoRow.test.tsx); a `plain` row is its own
  // root, so the main line is its first child either way.

  const rowRoot = (w: ReturnType<typeof mountRow>): HTMLElement =>
    (w.element.classList.contains("group")
      ? w.element
      : w.element.querySelector("div.group")) as HTMLElement;
  const mainLine = (w: ReturnType<typeof mountRow>) =>
    rowRoot(w).children[0] as HTMLElement;
  const region = (w: ReturnType<typeof mountRow>) =>
    rowRoot(w).querySelector('[role="region"]') as HTMLElement;
  // The main line as a triggerable wrapper. `findAll` would match the root
  // itself, so the element comes from the structural helper.
  const lineWrapper = (w: ReturnType<typeof mountRow>) =>
    new DOMWrapper(mainLine(w));

  describe("icon", () => {
    it("renders before the title, hidden from assistive tech", () => {
      const w = mountRow({ value: "V", icon: "Check" });
      const wrap = mainLine(w).children[0] as HTMLElement;
      expect(wrap.getAttribute("aria-hidden")).toBe("true");
      expect(wrap.innerHTML).toContain("<svg");
    });

    it("tints with the row's tone", () => {
      const w = mountRow({ value: "V", icon: "Check", tone: "emerald" });
      const wrap = mainLine(w).children[0] as HTMLElement;
      expect(wrap.innerHTML).toContain("text-emerald-500");
      expect(wrap.innerHTML).toContain("dark:text-emerald-400");
    });

    it("falls back to muted ink at tone none", () => {
      const w = mountRow({ value: "V", icon: "Check" });
      const wrap = mainLine(w).children[0] as HTMLElement;
      expect(wrap.innerHTML).toContain("text-neutral-500");
    });

    it("lets iconClassName own the tint", () => {
      const w = mountRow({
        value: "V",
        icon: "Check",
        tone: "emerald",
        iconClassName: "text-sky-500",
      });
      const wrap = mainLine(w).children[0] as HTMLElement;
      expect(wrap.innerHTML).toContain("text-sky-500");
      expect(wrap.innerHTML).not.toContain("text-emerald-500");
    });

    it("passes a custom VNode icon through", () => {
      const w = mountRow({ value: "V", icon: h("i", { class: "my-icon" }) });
      const wrap = mainLine(w).children[0] as HTMLElement;
      expect(wrap.innerHTML).toContain("my-icon");
    });
  });

  describe("sub-items", () => {
    const subColumn = (w: ReturnType<typeof mountRow>) =>
      rowRoot(w).children[1] as HTMLElement;

    it("renders a muted lead-in and a body-ink value", () => {
      const w = mountRow({
        subItems: [{ text: "Policy:", value: "trigger_access.all.allow" }],
      });
      expect(w.text()).toContain("Policy:");
      expect(w.text()).toContain("trigger_access.all.allow");
      const line = subColumn(w).children[0] as HTMLElement;
      expect((line.children[0] as HTMLElement).className).toContain(
        "text-neutral-500",
      );
      expect((line.children[1] as HTMLElement).className).toContain(
        "font-medium",
      );
    });

    it("sets font-mono only when asked", () => {
      const w = mountRow({
        subItems: [
          { text: "a", value: "1", mono: true },
          { text: "b", value: "2" },
        ],
      });
      const [monoLine, plainLine] = subColumn(w).children as HTMLCollectionOf<HTMLElement>;
      expect((monoLine.children[1] as HTMLElement).className).toContain("font-mono");
      expect((plainLine.children[1] as HTMLElement).className).not.toContain(
        "font-mono",
      );
    });

    it("indents under the icon only when one is rendered", () => {
      const withIcon = mountRow({ icon: "Check", subItems: [{ value: "v" }] });
      expect(subColumn(withIcon).className).toContain("pl-8");
      const without = mountRow({ subItems: [{ value: "v" }] });
      expect(subColumn(without).className).not.toContain("pl-8");
    });

    it("localises boolean values", () => {
      const w = mountRow({ subItems: [{ text: "active:", value: true }] });
      expect(w.text()).toContain("Yes");
    });

    it("skips lines with neither text nor value", () => {
      const w = mountRow({ subItems: [{}, { text: "kept" }] });
      expect(subColumn(w).children).toHaveLength(1);
      expect(w.text()).toContain("kept");
    });

    it("keeps the row alive with no main value", () => {
      const w = mountRow({ subItems: [{ text: "only" }] });
      expect(rowRoot(w)).not.toBeNull();
      expect(w.text()).toContain("only");
    });

    it("hands the line markup to the sub-item slot", () => {
      const w = mount(InfoRow, {
        props: { label: "L", subItems: [{ text: "Policy:", value: "x.y" }] },
        slots: { "sub-item": "<b>= {{ item.text }}</b>" },
      });
      expect(w.html()).toContain("<b>= Policy:</b>");
    });
  });

  describe("collapsible body", () => {
    const body = { body: "<ul><li>detail</li></ul>" };

    it("offers no affordance without a body", () => {
      const w = mountRow({ value: "V" });
      expect(mainLine(w).getAttribute("role")).toBeNull();
      expect(rowRoot(w).getAttribute("role")).toBeNull();
      // Label and value cluster only — no icon, no chevron. (The copy icon
      // carries its own `aria-hidden`, so a root-wide query would not do.)
      expect(mainLine(w).children).toHaveLength(2);
    });

    it("washes the whole row on hover, not just the main line", () => {
      const withBody = mount(InfoRow, {
        props: { label: "L", value: "V", tone: "emerald" },
        slots: body,
        attachTo: document.body,
      });
      const { hover, focusRing } = getSurfaceTriggerTokens("emerald");
      // The wash, the pointer and the focus ring all live on the root — the
      // whole control is the toggle, wash and affordances alike; the main
      // line is layout only.
      const root = rowRoot(withBody);
      expect(root.className).toContain(hover.split(" ")[0]);
      expect(root.className).toContain("rounded-md");
      expect(root.className).toContain("cursor-pointer");
      expect(root.className).toContain(focusRing.split(" ")[0]);
      const line = mainLine(withBody);
      expect(line.className).not.toContain(hover.split(" ")[0]);
      withBody.unmount();
    });

    it("makes the whole control the trigger, chevron included", () => {
      const withBody = mount(InfoRow, {
        props: { label: "Trigger: webhook", value: "V" },
        slots: body,
        attachTo: document.body,
      });
      const root = rowRoot(withBody);
      const line = mainLine(withBody);
      // Role, tab stop and aria live on the root — the block the wash paints.
      expect(root.getAttribute("role")).toBe("button");
      expect(root.getAttribute("tabindex")).toBe("0");
      expect(root.getAttribute("aria-expanded")).toBe("false");
      expect(root.getAttribute("aria-controls")).toBe(region(withBody).id);
      // The main line is layout only; it keeps the region's label anchor.
      expect(line.getAttribute("role")).toBeNull();
      expect(region(withBody).getAttribute("aria-labelledby")).toBe(
        line.getAttribute("id"),
      );
      const chevron = line.children[line.children.length - 1] as HTMLElement;
      expect(chevron.className).toContain("rotate-0");
      expect(chevron.innerHTML).toContain("<svg");
      withBody.unmount();
    });

    it("toggles on click, emitting both events, dropping inert and flipping the chevron", async () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V" },
        slots: body,
        attachTo: document.body,
      });
      // A click anywhere inside bubbles to the root — the whole control is
      // the toggle.
      await lineWrapper(w).trigger("click");
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
      expect(w.emitted("toggle")?.[0]).toEqual([true]);
      expect(w.emitted("update:expanded")?.[0]).toEqual([true]);
      expect(region(w).hasAttribute("inert")).toBe(false);
      const chevron = mainLine(w).children[
        mainLine(w).children.length - 1
      ] as HTMLElement;
      expect(chevron.className).toContain("rotate-180");
    });

    it("toggles when the click lands on a sub-item — the whole control answers", async () => {
      const w = mount(InfoRow, {
        props: {
          label: "L",
          value: "V",
          subItems: [{ text: "Policy:", value: "x" }],
        },
        slots: body,
        attachTo: document.body,
      });
      const subLine = rowRoot(w).children[1].children[0] as HTMLElement;
      await new DOMWrapper(subLine).trigger("click");
      expect(w.emitted("toggle")?.[0]).toEqual([true]);
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
    });

    it("keeps the open body and interactive content out of the toggle", async () => {
      const w = mount(InfoRow, {
        props: {
          label: "L",
          value: "V",
          subItems: [{ text: "docs" }],
          defaultExpanded: true,
        },
        slots: {
          ...body,
          "sub-item": `<template #default="{ item }"><a href="#docs" data-testid="link">{{ item.text }}</a></template>`,
        },
        attachTo: document.body,
      });
      // The body is the app's content: its clicks stop at the wrapper. And
      // the row-level guard keeps real interactive content — here a link a
      // sub-item slot put in — out of the toggle.
      await new DOMWrapper(region(w).querySelector("li")!).trigger("click");
      await w.get('[data-testid="link"]').trigger("click");
      expect(w.emitted("toggle")).toBeUndefined();
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
    });

    it("toggles from Enter and Space on the row itself, never from a child", async () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "abc" },
        slots: body,
        attachTo: document.body,
      });
      const row = new DOMWrapper(rowRoot(w));
      // dispatched by hand so `preventDefault` is observable: a row-level
      // Space must not scroll the page.
      const enter = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      expect(rowRoot(w).dispatchEvent(enter)).toBe(false);
      await w.vm.$nextTick();
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
      // A keystroke arriving from a nested element (target guard + the
      // cluster's stop) must not toggle.
      await new DOMWrapper(mainLine(w).querySelector("span")!).trigger(
        "keydown",
        { key: " " },
      );
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
      await row.trigger("keydown", { key: " " });
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("false");
    });

    it("never toggles from the copy cluster", async () => {
      const writeText = mockClipboard();
      const w = mount(InfoRow, {
        props: { label: "Token", value: "sk-123" },
        slots: body,
        attachTo: document.body,
      });
      await w.get("button").trigger("click");
      await flushPromises();
      expect(writeText).toHaveBeenCalledWith("sk-123");
      expect(w.emitted("toggle")).toBeUndefined();
      await w.get("button").trigger("keydown", { key: "Enter" });
      expect(w.emitted("toggle")).toBeUndefined();
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("false");
    });

    it("keeps the collapsed region inert and hidden from AT, never display:none", () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V" },
        slots: body,
        attachTo: document.body,
      });
      const regionEl = region(w);
      expect(regionEl.hasAttribute("inert")).toBe(true);
      expect(regionEl.getAttribute("aria-hidden")).toBe("true");
      expect(regionEl.hasAttribute("hidden")).toBe(false);
      expect(regionEl.getAttribute("aria-labelledby")).toBe(
        mainLine(w).getAttribute("id"),
      );
    });

    it("animates with the CollapsiblePanel grid gesture", async () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V" },
        slots: body,
        attachTo: document.body,
      });
      const grid = region(w).parentElement as HTMLElement;
      expect(grid.className).toContain("transition-[grid-template-rows,opacity]");
      expect(grid.className).toContain("motion-reduce:transition-none");
      expect(grid.style.gridTemplateRows).toBe("0fr");
      await lineWrapper(w).trigger("click");
      expect(grid.style.gridTemplateRows).toBe("1fr");
    });

    it("starts open on defaultExpanded", () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V", defaultExpanded: true },
        slots: body,
        attachTo: document.body,
      });
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
      expect(region(w).hasAttribute("inert")).toBe(false);
    });

    it("keeps a controlled row still and only reports intent", async () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V", expanded: true },
        slots: body,
        attachTo: document.body,
      });
      await lineWrapper(w).trigger("click");
      expect(rowRoot(w).getAttribute("aria-expanded")).toBe("true");
      expect(w.emitted("update:expanded")?.[0]).toEqual([false]);
    });

    it("renders an always-open body when collapsible is false", () => {
      const w = mount(InfoRow, {
        props: { label: "L", value: "V", collapsible: false },
        slots: body,
        attachTo: document.body,
      });
      expect(mainLine(w).getAttribute("role")).toBeNull();
      expect(rowRoot(w).getAttribute("role")).toBeNull();
      expect(rowRoot(w).className).not.toContain("cursor-pointer");
      expect(region(w)).not.toBeNull();
      expect(region(w).hasAttribute("inert")).toBe(false);
      expect(w.text()).toContain("detail");
    });

    it("keeps a body-only row alive under hideIfEmpty", () => {
      const w = mount(InfoRow, {
        props: { label: "L" },
        slots: body,
        attachTo: document.body,
      });
      expect(w.text()).toContain("detail");
    });
  });

  describe("bottom border", () => {
    const rowClassesFor = (props: Record<string, unknown>) => {
      const w = mountRow({ value: "V", ...props });
      const cls = rowRoot(w).className;
      w.unmount();
      return cls;
    };

    it("draws the section edge on simple and none", () => {
      for (const variant of ["simple", "none"]) {
        const cls = rowClassesFor({ variant, bottomBorder: true });
        expect(cls).toContain("border-b");
        expect(cls).not.toContain("last:border-0");
      }
    });

    it("is ignored by every other variant", () => {
      for (const variant of ["elevated", "bordered", "outline"]) {
        expect(rowClassesFor({ variant, bottomBorder: true })).toContain(
          "last:border-0",
        );
      }
    });

    it("never disturbs the plain hairline", () => {
      expect(rowClassesFor({ bottomBorder: true })).toContain("last:border-0");
    });

    it("stays off by default", () => {
      expect(rowClassesFor({ variant: "simple" })).toContain("last:border-0");
    });

    it("stands down when noBorder says no borders at all", () => {
      expect(rowClassesFor({ variant: "simple", bottomBorder: true, noBorder: true })).not.toContain(
        "border-b",
      );
    });
  });
});

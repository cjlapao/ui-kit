import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

import PagedPanel, { PAGED_PANEL_LOADERS } from "./PagedPanel.vue";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const PAGES = [h("p", "One"), h("p", "Two"), h("p", "Three")];

const mountPanel = (props: Record<string, unknown> = {}) =>
  mount(PagedPanel, { props: { pages: PAGES, ...props }, attachTo: document.body });

const nav = (w: ReturnType<typeof mountPanel>, label: string) =>
  w.findAll("button").find((b) => b.attributes("aria-label") === label)!;

describe("PagedPanel", () => {
  it("shows one page at a time and moves with the nav buttons", async () => {
    const w = mountPanel({ title: "T" });
    expect(w.text()).toContain("One");
    await nav(w, "Next page").trigger("click");
    expect(w.text()).toContain("Two");
    await nav(w, "Previous page").trigger("click");
    expect(w.text()).toContain("One");
  });

  it("disables the nav at each end", async () => {
    const w = mountPanel();
    expect(nav(w, "Previous page").attributes("disabled")).toBeDefined();
    await nav(w, "Next page").trigger("click");
    await nav(w, "Next page").trigger("click");
    expect(nav(w, "Next page").attributes("disabled")).toBeDefined();
  });

  it("announces the position politely", () => {
    // Paging used to change the content with no announcement at all.
    const w = mountPanel();
    const status = w.get('[role="status"]');
    expect(status.text()).toContain("1 / 3");
    expect(status.attributes("aria-live")).toBe("polite");
  });

  it("takes a per-page title array", async () => {
    const w = mountPanel({ title: ["A", "B", "C"] });
    expect(w.text()).toContain("A");
    await nav(w, "Next page").trigger("click");
    expect(w.text()).toContain("B");
  });

  it("clamps when the page list shrinks", async () => {
    const w = mountPanel();
    await nav(w, "Next page").trigger("click");
    await nav(w, "Next page").trigger("click");
    expect(w.text()).toContain("Three");
    await w.setProps({ pages: [PAGES[0]] });
    expect(w.text()).toContain("One");
  });

  it("can be driven as a controlled component", async () => {
    const w = mountPanel({ page: 1 });
    expect(w.text()).toContain("Two");
    await nav(w, "Next page").trigger("click");
    expect(w.emitted("update:page")?.[0]).toEqual([2]);
    // Still controlled: it did not move itself.
    expect(w.text()).toContain("Two");
  });

  it("renders an EmptyState rather than bare text when there are no pages", () => {
    const w = mountPanel({ pages: [] });
    expect(w.text()).toContain("No data available.");
  });

  it("renders an EmptyState for an error", () => {
    const w = mountPanel({ error: "Boom" });
    expect(w.text()).toContain("Boom");
    expect(w.text()).not.toContain("One");
  });

  it("hides the nav entirely for a single page", () => {
    const w = mountPanel({ pages: [PAGES[0]] });
    expect(w.findAll("button")).toHaveLength(0);
  });

  describe("loading", () => {
    it("offers the kit's three loader types, skeleton by default", () => {
      expect(PAGED_PANEL_LOADERS).toEqual(["skeleton", "spinner", "progress"]);
      expect(mountPanel({ loading: true }).html()).toContain("animate-pulse");
    });

    it("draws a spinner and a progress bar when asked", () => {
      const spin = mountPanel({ loading: true, loaderType: "spinner" });
      expect(spin.findAll('[role="status"]').length).toBeGreaterThan(0);
      const prog = mountPanel({
        loading: true,
        loaderType: "progress",
        progress: 40,
      });
      expect(prog.get('[role="progressbar"]').attributes("aria-valuenow")).toBe(
        "40",
      );
    });

    it("replaces the page while loading, but keeps the header", () => {
      const w = mountPanel({ loading: true, title: "T" });
      expect(w.text()).not.toContain("One");
      expect(nav(w, "Next page")).toBeTruthy();
      expect(w.text()).toContain("T");
    });

    it("loads in bare mode too, where Panel's own loader cannot reach", () => {
      // `loading` used to be handed to Panel, so the bare path — which renders
      // no Panel — had no loading treatment at all.
      const w = mountPanel({ loading: true, bare: true });
      expect(w.html()).toContain("animate-pulse");
      expect(w.text()).not.toContain("One");
    });

    it("prefers loading over the empty state", () => {
      const w = mountPanel({ pages: [], loading: true });
      expect(w.text()).not.toContain("No data available.");
    });

    it("takes a custom loading slot", () => {
      const w = mount(PagedPanel, {
        props: { pages: PAGES, loading: true },
        slots: { loading: "<span>fetching…</span>" },
      });
      expect(w.text()).toContain("fetching…");
    });
  });

  it("takes every size and tone", () => {
    for (const size of CONTROL_SIZES) {
      const w = mountPanel({ size });
      expect(nav(w, "Next page")).toBeTruthy();
      w.unmount();
    }
    for (const tone of TRUE_COLORS) {
      const w = mountPanel({ tone });
      expect(nav(w, "Next page")).toBeTruthy();
      w.unmount();
    }
  });
});

import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ScrollArea from "./ScrollArea.vue";

const tracks = (w: ReturnType<typeof mount>) => w.findAll('[data-slot="scrollarea-scrollbar"]');
const viewportEl = (w: ReturnType<typeof mount>) =>
  w.find('[data-slot="scrollarea-viewport"]').element as HTMLElement;

/** Make the viewport report a vertical overflow, then let it re-measure. */
const overflowY = (w: ReturnType<typeof mount>, height: number) => {
  const el = viewportEl(w);
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: height });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: 100 });
  return w.find('[data-slot="scrollarea-viewport"]').trigger("scroll");
};

describe("ScrollArea", () => {
  it("renders viewport, content, both bars, handles and the corner", () => {
    const w = mount(ScrollArea, { slots: { default: "<p>content</p>" } });
    expect(w.find('[data-slot="scrollarea-viewport"]').exists()).toBe(true);
    expect(w.find('[data-slot="scrollarea-content"]').exists()).toBe(true);
    const bars = tracks(w);
    expect(bars).toHaveLength(2);
    expect(bars[0].attributes("data-orientation")).toBe("vertical");
    expect(bars[1].attributes("data-orientation")).toBe("horizontal");
    expect(w.findAll('[data-slot="scrollarea-handle"]')).toHaveLength(2);
    expect(w.find('[data-slot="scrollarea-corner"]').exists()).toBe(true);
  });

  it("hides the bars while everything fits, and keeps the viewport out of the tab order", () => {
    const w = mount(ScrollArea, { props: { variant: "always" }, slots: { default: "<p/>" } });
    for (const bar of tracks(w)) expect(bar.attributes("data-state")).toBe("hidden");
    expect(viewportEl(w).tabIndex).toBe(-1);
  });

  it("a vertical overflow brings the viewport into the tab order and, with `always`, shows the bar", async () => {
    const w = mount(ScrollArea, { props: { variant: "always" }, slots: { default: "<p/>" } });
    await overflowY(w, 1000);
    expect(viewportEl(w).tabIndex).toBe(0);
    expect(tracks(w)[0].attributes("data-state")).toBe("visible");
    expect(tracks(w)[1].attributes("data-state")).toBe("hidden");
  });

  it("`auto` keeps the bar hidden until hover, even while overflowing", async () => {
    vi.useFakeTimers();
    try {
      const w = mount(ScrollArea, { slots: { default: "<p/>" } });
      await overflowY(w, 1000);
      expect(tracks(w)[0].attributes("data-state")).toBe("visible"); // the scroll itself shows it
      vi.advanceTimersByTime(900); // ... and it fades once the scrolling lingers out
      await w.vm.$nextTick();
      expect(tracks(w)[0].attributes("data-state")).toBe("hidden");
      await w.trigger("pointerenter");
      expect(tracks(w)[0].attributes("data-state")).toBe("visible");
    } finally {
      vi.useRealTimers();
    }
  });

  it("`hidden` never shows a bar, overflowing or not", async () => {
    const w = mount(ScrollArea, { props: { variant: "hidden" }, slots: { default: "<p/>" } });
    await overflowY(w, 1000);
    expect(tracks(w)[0].attributes("data-state")).toBe("hidden");
  });

  it("exposes the variant on the root and passes attributes through", () => {
    const w = mount(ScrollArea, {
      props: { variant: "hover" },
      attrs: { id: "sa", class: "rounded-lg border", "aria-label": "Logs" },
      slots: { default: "<p/>" },
    });
    const root = w.find('[data-slot="scrollarea"]');
    expect(root.attributes("data-variant")).toBe("hover");
    expect(root.attributes("id")).toBe("sa");
    expect(root.attributes("aria-label")).toBe("Logs");
    expect(root.attributes("class")).toContain("rounded-lg");
    expect(root.attributes("class")).toContain("relative");
  });

  it("the bars announce themselves to assistive tech", () => {
    const w = mount(ScrollArea, { slots: { default: "<p/>" } });
    const bar = tracks(w)[0];
    expect(bar.attributes("role")).toBe("scrollbar");
    expect(bar.attributes("aria-controls")).toBe(viewportEl(w).id);
    expect(bar.attributes("aria-orientation")).toBe("vertical");
  });
});

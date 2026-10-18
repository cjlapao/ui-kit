import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import StatTile from "./StatTile.vue";
import StatCountTile from "./StatCountTile.vue";
import { TRUE_COLORS } from "../theme/Theme";

describe("StatTile", () => {
  it("renders the headline figures", () => {
    const w = mount(StatTile, {
      props: { title: "Capsules", value: 42, subtitle: "in this org" },
    });
    expect(w.text()).toContain("Capsules");
    expect(w.text()).toContain("42");
    expect(w.text()).toContain("in this org");
  });

  it("draws the progress bar as a real progressbar with a name", () => {
    // It used to be two nested divs with the percentage in a sibling span —
    // no role, so a screen reader saw a number with no meaning attached.
    const w = mount(StatTile, {
      props: { title: "T", value: 1, progress: { value: 60, label: "Used" } },
    });
    const bar = w.get('[role="progressbar"]');
    expect(bar.attributes("aria-valuenow")).toBe("60");
    const labelledBy = bar.attributes("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(w.get(`#${labelledBy}`).text()).toContain("Used");
  });

  it("uses a real Button for the error retry", () => {
    // Was a bare `<button class="text-blue-600 …">` — hardcoded blue, no
    // dark-mode partner, no focus ring.
    const w = mount(StatTile, {
      props: { title: "T", value: 1, error: { message: "Boom", onRetry: () => {} } },
    });
    expect(w.text()).toContain("Boom");
    expect(w.html()).not.toContain("text-blue-600 hover:text-blue-700");
  });

  it("takes every tone on its decoration and icon chip", () => {
    // Note: unlike the rebased React kit, the Vue tile does not pass `color`
    // through to the Panel's own tone — only the decoration wash and the icon
    // are tinted. See the report: Vue has no `StatCard` to rebase onto.
    for (const tone of TRUE_COLORS) {
      const w = mount(StatTile, {
        props: { title: "T", value: 1, color: tone, icon: "Rocket" },
      });
      expect(w.html()).toContain(`bg-${tone}-300/40`);
      w.unmount();
    }
  });
});

describe("StatCountTile", () => {
  it("renders the count and its breakdown", () => {
    const w = mount(StatCountTile, {
      props: {
        title: "Total",
        count: 128,
        breakdown: [
          { label: "Running", value: 100 },
          { label: "Stopped", value: 28, color: "rose" },
        ],
      },
    });
    expect(w.text()).toContain("128");
    expect(w.text()).toContain("Running");
    expect(w.html()).toContain("text-rose-600");
  });
});

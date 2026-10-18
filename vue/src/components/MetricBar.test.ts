import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import MetricBar from "./MetricBar.vue";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const mountBar = (props: Record<string, unknown> = {}) =>
  mount(MetricBar, { props: { label: "Disk", percentage: 60, ...props } });

describe("MetricBar", () => {
  it("gives the progressbar an accessible name from the label", () => {
    const w = mountBar({ value: "12 / 20 GB" });
    const bar = w.get('[role="progressbar"]');
    const labelledBy = bar.attributes("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(w.get(`#${labelledBy}`).text()).toContain("Disk");
  });

  it("shows the caller's free-form reading, not a computed percentage", () => {
    const w = mountBar({ value: "12 / 20 GB" });
    expect(w.text()).toContain("12 / 20 GB");
    expect(w.text()).not.toContain("60%");
  });

  it("falls back to the percentage when no value is given", () => {
    const w = mountBar();
    expect(w.get('[role="progressbar"]').attributes("aria-valuenow")).toBe("60");
  });

  it("takes every control size", () => {
    for (const size of CONTROL_SIZES) {
      const w = mountBar({ size });
      expect(w.find('[role="progressbar"]').exists()).toBe(true);
      w.unmount();
    }
    expect(CONTROL_SIZES).toContain("xl");
  });

  it("takes every tone, through `color` or `tone`", () => {
    for (const tone of TRUE_COLORS) {
      const w = mountBar({ tone });
      expect(w.html()).toContain(tone);
      w.unmount();
    }
  });

  it("is exported from the components barrel", () => {
    // It used to reach the public API through a self-referential re-export
    // inside its own SFC, because `export *` does not carry a default export.
    //
    // Asserted against the barrel *source* rather than by importing it: an
    // `import("./index")` pulls in every component in the kit, and under the
    // full suite that raced with module init and failed intermittently. A
    // flaky test is worse than no test.
    const barrel = readFileSync(
      resolve(process.cwd(), "src/components/index.ts"),
      "utf8",
    );
    expect(barrel).toContain("default as MetricBar");
    expect(barrel).toContain('from "./MetricBar.vue"');
  });
});

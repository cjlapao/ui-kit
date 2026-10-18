import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import MultiToggle from "./MultiToggle.vue";
import {
  CONTROL_SIZES,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  getMultiToggleVariantTokens,
  getSurfaceVariantClasses,
} from "../theme/Theme";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

const mountToggle = (props: Record<string, unknown> = {}) =>
  mount(MultiToggle, {
    props: { options: OPTIONS, modelValue: "a", ...props },
    attachTo: document.body,
  });

const radios = (w: ReturnType<typeof mountToggle>) =>
  w.findAll('[role="radio"]');

describe("MultiToggle", () => {
  it("takes every tone from the generated theme tokens, with no drift", () => {
    // The 21-entry local map had `green` painting *emerald* classes and `red`
    // painting *rose* — those two rendered as their neighbours.
    for (const tone of TRUE_COLORS) {
      const w = mountToggle({ tone });
      expect(w.html()).toContain(
        getMultiToggleVariantTokens(tone).activeText.split(" ")[0],
      );
      w.unmount();
    }
  });

  it("resolves `green` to green and `red` to red", () => {
    const green = mountToggle({ tone: "green" });
    expect(green.html()).toContain("text-green-600");
    expect(green.html()).not.toContain("text-emerald-600");
    const red = mountToggle({ tone: "red" });
    expect(red.html()).toContain("text-red-600");
    expect(red.html()).not.toContain("text-rose-600");
  });

  it("still accepts `color` as the old name for `tone`", () => {
    expect(mountToggle({ color: "fuchsia" }).html()).toContain("fuchsia");
  });

  it("takes the Panel surface family, matching Panel at the same tone", () => {
    // The track is a surface, so it belongs to the same family — it used to
    // have a component-local `theme | solid | soft` that described the
    // *indicator* and matched nothing else in the kit.
    for (const variant of SURFACE_VARIANTS) {
      const w = mountToggle({ variant, tone: "violet" });
      for (const cls of getSurfaceVariantClasses(variant, "violet").split(" ")) {
        if (cls) expect(w.element.className).toContain(cls);
      }
      w.unmount();
    }
  });

  it("draws the active segment three ways, independently of the track", () => {
    expect(mountToggle({ indicator: "solid" }).html()).toContain("bg-white");
    expect(mountToggle({ indicator: "soft", tone: "violet" }).html()).toContain(
      "bg-violet-100",
    );
    expect(mountToggle({ indicator: "tonal", tone: "violet" }).html()).toContain(
      "bg-violet-500/15",
    );
  });

  it("gives every indicator a tone-following edge", () => {
    // A white pill on a light track with only a soft shadow was nearly
    // invisible, and `border` with no colour behind it resolves to
    // `currentColor` — a near-black rule around a blue pill.
    for (const indicator of ["solid", "soft", "tonal"] as const) {
      const w = mountToggle({ indicator, tone: "violet" });
      const pill = w.get(".pointer-events-none > span");
      expect(pill.classes().join(" ")).toContain("border");
      expect(pill.classes().join(" ")).toMatch(/border-violet-\d{3}/);
      w.unmount();
    }
  });

  it("takes its copy colour from the surface, so glass stays readable", () => {
    // Was a hardcoded `text-neutral-600 dark:text-neutral-300`.
    expect(mountToggle({ variant: "glass" }).html()).toContain("text-neutral-800");
  });

  it("takes every control size", () => {
    for (const size of CONTROL_SIZES) {
      const w = mountToggle({ size });
      expect(radios(w)).toHaveLength(3);
      w.unmount();
    }
    expect(CONTROL_SIZES).toContain("xs");
    expect(CONTROL_SIZES).toContain("xl");
  });

  it("announces state once, as a radio", () => {
    const w = mountToggle();
    expect(radios(w)[0].attributes("aria-checked")).toBe("true");
    expect(radios(w)[0].attributes("aria-pressed")).toBeUndefined();
  });

  it("moves the selection with the arrow keys", async () => {
    const w = mountToggle({ modelValue: "a" });
    await radios(w)[0].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["b"]);
  });

  it("wraps at both ends, and jumps with Home and End", async () => {
    const w = mountToggle({ modelValue: "a" });
    await radios(w)[0].trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["c"]);

    const w2 = mountToggle({ modelValue: "b" });
    await radios(w2)[1].trigger("keydown", { key: "End" });
    expect(w2.emitted("update:modelValue")?.[0]).toEqual(["c"]);
  });

  it("steps over a disabled option", async () => {
    const w = mountToggle({
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
        { value: "c", label: "C" },
      ],
      modelValue: "a",
    });
    await radios(w)[0].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["c"]);
  });

  it("puts an id on the group, not on every option", () => {
    // Bound to each button, an `id` was duplicated once per option.
    const w = mountToggle({ id: "toggle-1" });
    expect(w.element.getAttribute("id")).toBe("toggle-1");
    expect(w.findAll("#toggle-1")).toHaveLength(1);
  });
});

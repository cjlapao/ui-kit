import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pill from "./Pill.vue";
import { TRUE_COLORS } from "../theme/Theme";

const styleOf = (w: ReturnType<typeof mount>) =>
  (w.element as HTMLElement).style;

describe("Pill", () => {
  describe("pulse", () => {
    it("is off by default", () => {
      const w = mount(Pill, { props: {}, slots: { default: "Label" } });
      expect(w.classes()).not.toContain("pill-pulse");
      expect(styleOf(w).getPropertyValue("--pill-glow")).toBe("");
    });

    it("breathes in its own tone", () => {
      const w = mount(Pill, {
        props: { tone: "rose", pulse: true },
        slots: { default: "Live" },
      });
      expect(w.classes()).toContain("pill-pulse");
      // The tone travels as a custom property, not a class shape — the
      // stylesheet stays colour-agnostic and the safelist stays untouched.
      expect(styleOf(w).getPropertyValue("--pill-glow")).toBe(
        "var(--color-rose-500)",
      );
      expect(styleOf(w).getPropertyValue("--pill-glow-dark")).toBe(
        "var(--color-rose-300)",
      );
    });

    it.each(TRUE_COLORS)("names tone %s's colour", (tone) => {
      const w = mount(Pill, {
        props: { tone, pulse: true },
        slots: { default: "x" },
      });
      expect(styleOf(w).getPropertyValue("--pill-glow")).toBe(
        `var(--color-${tone}-500)`,
      );
    });

    it("a disabled pill does not call attention", () => {
      // An attention call on a pill the app has dimmed is a contradiction.
      const w = mount(Pill, {
        props: { pulse: true, disabled: true },
        slots: { default: "Quiet" },
      });
      expect(w.classes()).not.toContain("pill-pulse");
    });

    it("pulses as a button too — the ring still composites over the glow", () => {
      const w = mount(Pill, {
        props: { pulse: true, clickable: true },
        slots: { default: "Act" },
      });
      expect(w.classes()).toContain("pill-pulse");
      expect(w.classes()).toContain("focus-visible:ring-2");
    });

    it("a dot pulses too", () => {
      const w = mount(Pill, { props: { dot: true, pulse: true, tone: "amber" } });
      expect(w.classes()).toContain("pill-pulse");
      expect(styleOf(w).getPropertyValue("--pill-glow")).toBe(
        "var(--color-amber-500)",
      );
    });

    it("coexists with maxWidth", () => {
      const w = mount(Pill, {
        props: { pulse: true, maxWidth: 120 },
        slots: { default: "A very long label" },
      });
      expect(w.classes()).toContain("pill-pulse");
      expect(styleOf(w).maxWidth).toBe("120px");
      expect(styleOf(w).getPropertyValue("--pill-glow")).toBe(
        "var(--color-blue-500)",
      );
    });
  });
});

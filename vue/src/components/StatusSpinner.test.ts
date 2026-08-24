import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatusSpinner from "./StatusSpinner.vue";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  getStatusSpinnerSizeTokens,
  getStatusSpinnerToneTokens,
} from "../theme/Theme";

const circle = (w: ReturnType<typeof mount>) =>
  w.find('[role="status"] > span').element as HTMLElement;
const ring = (w: ReturnType<typeof mount>) =>
  w.find('[role="status"] > span > span').element as HTMLElement;
const dot = (w: ReturnType<typeof mount>) =>
  w.findAll('[role="status"] > span > span')[1].element as HTMLElement;

describe("StatusSpinner", () => {
  describe("accessibility", () => {
    it("is a status region", () => {
      expect(mount(StatusSpinner).find('[role="status"]').exists()).toBe(true);
    });

    it("announces Loading by default", () => {
      const w = mount(StatusSpinner);
      expect(w.find(".sr-only").text()).toBe("Loading");
      expect(w.text()).toBe("Loading");
    });

    it("does not announce a visible label twice", () => {
      // The label used to sit in the status region AND in an sr-only copy
      // beside it, so screen readers heard it twice.
      const w = mount(StatusSpinner, { props: { label: "Deploying update" } });
      expect(w.findAll(".sr-only")).toHaveLength(0);
      expect(w.text()).toBe("Deploying update");
    });

    it("stops spinning under prefers-reduced-motion", () => {
      const w = mount(StatusSpinner);
      expect(ring(w).className).toContain("motion-reduce:animate-none");
    });
  });

  describe("size", () => {
    it("follows the shared control scale", () => {
      const diameters: Record<string, string> = {
        xs: "h-4 w-4",
        sm: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      };
      for (const size of CONTROL_SIZES) {
        const w = mount(StatusSpinner, { props: { size } });
        expect(circle(w).className).toContain(diameters[size]);
        expect(circle(w).className).toContain(
          getStatusSpinnerSizeTokens(size).wrapper,
        );
      }
    });

    it("scales the dot and the ring width with the size", () => {
      for (const size of CONTROL_SIZES) {
        const w = mount(StatusSpinner, { props: { size } });
        expect(dot(w).className).toContain(getStatusSpinnerSizeTokens(size).dot);
        expect(ring(w).className).toContain(
          getStatusSpinnerSizeTokens(size).border,
        );
      }
    });
  });

  describe("tone", () => {
    it("defaults to blue", () => {
      const w = mount(StatusSpinner);
      expect(dot(w).className).toContain("bg-blue-400");
    });

    it("every one of the 21 tones comes from the theme, undrifted", () => {
      for (const tone of TRUE_COLORS) {
        const w = mount(StatusSpinner, { props: { tone } });
        const tokens = getStatusSpinnerToneTokens(tone);
        // The dot class has to name its own tone — the maps that drifted in
        // every other component sent red to rose and green to emerald.
        expect(dot(w).className).toContain(tokens.dot);
        expect(dot(w).className).toContain(`bg-${tone}-400`);
        expect(dot(w).className).toContain(`dark:bg-${tone}-300`);
      }
    });
  });

  describe("animated", () => {
    it("spins by default", () => {
      const w = mount(StatusSpinner);
      expect(ring(w).className).toContain("animate-spin");
    });

    it("animated=false parks the ring and stops the spin", () => {
      const w = mount(StatusSpinner, { props: { animated: false } });
      expect(ring(w).className).not.toContain("animate-spin");
    });
  });
});

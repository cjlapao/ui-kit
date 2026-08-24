import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Spinner from "./Spinner.vue";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  getSpinnerColorTokens,
} from "../theme/Theme";

const ring = (w: ReturnType<typeof mount>) =>
  w.find('[role="status"] > span').element as HTMLElement;

describe("Spinner", () => {
  describe("accessibility", () => {
    it("is a status region", () => {
      expect(mount(Spinner).find('[role="status"]').exists()).toBe(true);
    });

    it("announces Loading by default", () => {
      const w = mount(Spinner);
      expect(w.find(".sr-only").text()).toBe("Loading");
      expect(w.text()).toBe("Loading");
    });

    it("does not announce a visible label twice", () => {
      // The label used to sit in the status region AND in an sr-only copy
      // beside it, so screen readers heard it twice.
      const w = mount(Spinner, { props: { label: "Deploying update" } });
      expect(w.findAll(".sr-only")).toHaveLength(0);
      expect(w.text()).toBe("Deploying update");
    });

    it("stops spinning under prefers-reduced-motion", () => {
      const w = mount(Spinner);
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
        const w = mount(Spinner, { props: { size } });
        expect(ring(w).className).toContain(diameters[size]);
      }
    });

    it("maps every thickness to a real border width", () => {
      const w = mount(Spinner, { props: { size: "md", thickness: "thin" } });
      expect(ring(w).className).toContain("border-3");

      const thick = mount(Spinner, { props: { size: "xl", thickness: "thick" } });
      expect(ring(thick).className).toContain("border-[5.5px]");
    });
  });

  describe("variant", () => {
    it("solid paints one arc, segments all four sides", () => {
      const solid = ring(mount(Spinner, { props: { variant: "solid" } }));
      expect(solid.className).toContain("border-t-");
      expect(solid.className).not.toContain("border-r-");
      expect(solid.className).not.toContain("border-b-");
      expect(solid.className).not.toContain("border-l-");

      const segments = ring(mount(Spinner, { props: { variant: "segments" } }));
      for (const side of ["border-t-", "border-r-", "border-b-", "border-l-"]) {
        expect(segments.className).toContain(side);
      }
    });
  });

  describe("color", () => {
    it("every one of the 21 tones comes from the theme, undrifted", () => {
      for (const color of TRUE_COLORS) {
        const w = mount(Spinner, { props: { color } });
        const [top] = getSpinnerColorTokens(color);
        expect(ring(w).className).toContain(top);
        // The map that drifted in every other component sent red to rose and
        // green to emerald — the class has to name its own tone.
        expect(ring(w).className).toContain(`border-t-${color}`);
      }
    });

    it("segments apply all four tone sides for every tone", () => {
      for (const color of TRUE_COLORS) {
        const w = mount(Spinner, { props: { color, variant: "segments" } });
        for (const token of getSpinnerColorTokens(color)) {
          expect(ring(w).className).toContain(token);
        }
      }
    });
  });
});

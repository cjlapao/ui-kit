import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  getSpinnerColorTokens,
} from "../theme/Theme";
import { SurfaceProvider } from "../contexts/SurfaceContext";

const ring = (container: HTMLElement) =>
  container.querySelector('[role="status"] > span') as HTMLElement;

describe("Spinner", () => {
  describe("accessibility", () => {
    it("is a status region", () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('[role="status"]')).toBeTruthy();
    });

    it("announces Loading by default", () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector(".sr-only")?.textContent).toBe("Loading");
      expect(container.textContent).toBe("Loading");
    });

    it("does not announce a visible label twice", () => {
      // The label used to sit in the status region AND in an sr-only copy
      // beside it, so screen readers heard it twice.
      const { container } = render(<Spinner label="Deploying update" />);
      expect(container.querySelectorAll(".sr-only")).toHaveLength(0);
      expect(container.textContent).toBe("Deploying update");
    });

    it("colours the label from the surface it sits on", () => {
      const { container: solid } = render(<Spinner label="Syncing" />);
      expect(ring(solid).nextElementSibling?.className).toContain(
        "text-neutral-700",
      );

      const { container: glass } = render(
        <SurfaceProvider variant="liquid-glass">
          <Spinner label="Syncing" />
        </SurfaceProvider>,
      );
      expect(ring(glass).nextElementSibling?.className).toContain(
        "text-neutral-800",
      );
    });

    it("stops spinning under prefers-reduced-motion", () => {
      const { container } = render(<Spinner />);
      expect(ring(container).className).toContain("motion-reduce:animate-none");
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
        const { container } = render(<Spinner size={size} />);
        expect(ring(container).className).toContain(diameters[size]);
      }
    });

    it("maps every thickness to a real border width", () => {
      // `border-3` only exists in Tailwind v4; the class has to be in the
      // built CSS, not just plausible-looking.
      const { container } = render(<Spinner size="md" thickness="thin" />);
      expect(ring(container).className).toContain("border-3");

      const { container: thick } = render(
        <Spinner size="xl" thickness="thick" />,
      );
      expect(ring(thick).className).toContain("border-[5.5px]");
    });
  });

  describe("variant", () => {
    it("solid paints one arc, segments all four sides", () => {
      const { container: solid } = render(<Spinner variant="solid" />);
      const solidRing = ring(solid);
      expect(solidRing.className).toContain("border-t-");
      expect(solidRing.className).not.toContain("border-r-");
      expect(solidRing.className).not.toContain("border-b-");
      expect(solidRing.className).not.toContain("border-l-");

      const { container: segments } = render(<Spinner variant="segments" />);
      const segmentRing = ring(segments);
      for (const side of ["border-t-", "border-r-", "border-b-", "border-l-"]) {
        expect(segmentRing.className).toContain(side);
      }
    });
  });

  describe("color", () => {
    it("every one of the 21 tones comes from the theme, undrifted", () => {
      for (const color of TRUE_COLORS) {
        const { container } = render(<Spinner color={color} />);
        const [top] = getSpinnerColorTokens(color);
        expect(ring(container).className).toContain(top);
        // The map that drifted in every other component sent red to rose and
        // green to emerald — the class has to name its own tone.
        expect(ring(container).className).toContain(`border-t-${color}`);
      }
    });

    it("segments apply all four tone sides for every tone", () => {
      for (const color of TRUE_COLORS) {
        const { container } = render(
          <Spinner color={color} variant="segments" />,
        );
        for (const token of getSpinnerColorTokens(color)) {
          expect(ring(container).className).toContain(token);
        }
      }
    });
  });
});

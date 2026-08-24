import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StatusSpinner from "./StatusSpinner";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  getStatusSpinnerSizeTokens,
  getStatusSpinnerToneTokens,
} from "../theme/Theme";
import { SurfaceProvider } from "../contexts/SurfaceContext";

const circle = (container: HTMLElement) =>
  container.querySelector('[role="status"] > span') as HTMLElement;
const ring = (container: HTMLElement) =>
  circle(container).querySelector("span") as HTMLElement;
const dot = (container: HTMLElement) =>
  circle(container).querySelectorAll("span")[1] as HTMLElement;

describe("StatusSpinner", () => {
  describe("accessibility", () => {
    it("is a status region", () => {
      const { container } = render(<StatusSpinner />);
      expect(container.querySelector('[role="status"]')).toBeTruthy();
    });

    it("announces Loading by default", () => {
      const { container } = render(<StatusSpinner />);
      expect(container.querySelector(".sr-only")?.textContent).toBe("Loading");
      expect(container.textContent).toBe("Loading");
    });

    it("does not announce a visible label twice", () => {
      // The label used to sit in the status region AND in an sr-only copy
      // beside it, so screen readers heard it twice.
      const { container } = render(<StatusSpinner label="Deploying update" />);
      expect(container.querySelectorAll(".sr-only")).toHaveLength(0);
      expect(container.textContent).toBe("Deploying update");
    });

    it("colours the label from the surface it sits on", () => {
      const { container: solid } = render(<StatusSpinner label="Syncing" />);
      expect(
        (circle(solid).nextElementSibling as HTMLElement).className,
      ).toContain("text-neutral-700");

      const { container: glass } = render(
        <SurfaceProvider variant="liquid-glass">
          <StatusSpinner label="Syncing" />
        </SurfaceProvider>,
      );
      expect(
        (circle(glass).nextElementSibling as HTMLElement).className,
      ).toContain("text-neutral-800");
    });

    it("stops spinning under prefers-reduced-motion", () => {
      const { container } = render(<StatusSpinner />);
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
        const { container } = render(<StatusSpinner size={size} />);
        expect(circle(container).className).toContain(diameters[size]);
        expect(circle(container).className).toContain(
          getStatusSpinnerSizeTokens(size).wrapper,
        );
      }
    });

    it("scales the dot and the ring width with the size", () => {
      for (const size of CONTROL_SIZES) {
        const { container } = render(<StatusSpinner size={size} />);
        expect(dot(container).className).toContain(
          getStatusSpinnerSizeTokens(size).dot,
        );
        expect(ring(container).className).toContain(
          getStatusSpinnerSizeTokens(size).border,
        );
      }
    });
  });

  describe("tone", () => {
    it("defaults to blue", () => {
      const { container } = render(<StatusSpinner />);
      expect(dot(container).className).toContain("bg-blue-400");
    });

    it("every one of the 21 tones comes from the theme, undrifted", () => {
      for (const tone of TRUE_COLORS) {
        const { container } = render(<StatusSpinner tone={tone} />);
        const tokens = getStatusSpinnerToneTokens(tone);
        // The dot class has to name its own tone — the maps that drifted in
        // every other component sent red to rose and green to emerald.
        expect(dot(container).className).toContain(tokens.dot);
        expect(dot(container).className).toContain(`bg-${tone}-400`);
        expect(dot(container).className).toContain(`dark:bg-${tone}-300`);
        // The arc reads the tone's own Tailwind variable, not a hard-coded rgb.
        expect(
          (ring(container) as HTMLElement).style.borderTopColor,
        ).toBe(`var(--color-${tone}-400)`);
      }
    });
  });

  describe("animated", () => {
    it("spins by default and paints one arc on the track", () => {
      const { container } = render(<StatusSpinner />);
      const tokens = getStatusSpinnerToneTokens("blue");
      const style = (ring(container) as HTMLElement).style;
      expect(ring(container).className).toContain("animate-spin");
      expect(style.borderTopColor).toBe(tokens.arc);
      expect(style.borderRightColor).toBe(tokens.track);
      expect(style.borderBottomColor).toBe(tokens.track);
      expect(style.borderLeftColor).toBe(tokens.track);
    });

    it("animated=false parks a full track ring and stops the spin", () => {
      const { container } = render(<StatusSpinner animated={false} />);
      const tokens = getStatusSpinnerToneTokens("blue");
      const style = (ring(container) as HTMLElement).style;
      expect(ring(container).className).not.toContain("animate-spin");
      expect(style.borderColor).toBe(tokens.track);
      expect(style.borderTopColor).toBe("");
    });
  });
});

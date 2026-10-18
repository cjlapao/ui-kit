import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ProgressSpinner from "./ProgressSpinner";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  getProgressSpinnerToneTokens,
} from "../theme/Theme";

const bar = (container: HTMLElement) =>
  container.querySelector('[role="progressbar"]') as HTMLElement;

const svg = (container: HTMLElement) =>
  bar(container).querySelector("svg") as SVGElement;

const circles = (container: HTMLElement) =>
  Array.from(svg(container).querySelectorAll("circle")) as SVGCircleElement[];

const dasharray = (circle: SVGCircleElement) =>
  Number(circle.getAttribute("stroke-dasharray")?.split(" ")[0]);

const radius = (circle: SVGCircleElement) =>
  Number(circle.getAttribute("r"));

const TAU_R = (r: number) => 2 * Math.PI * r;

describe("ProgressSpinner", () => {
  describe("accessibility", () => {
    it("is an indeterminate progressbar by default", () => {
      const { container } = render(<ProgressSpinner />);
      const node = bar(container);
      expect(node.getAttribute("aria-label")).toBe("Loading");
      expect(node.getAttribute("aria-valuenow")).toBeNull();
      expect(node.getAttribute("aria-valuemin")).toBeNull();
      expect(node.getAttribute("aria-valuemax")).toBeNull();
    });

    it("announces a custom label", () => {
      const { container } = render(<ProgressSpinner ariaLabel="Uploading" />);
      expect(bar(container).getAttribute("aria-label")).toBe("Uploading");
    });

    it("is a determinate progressbar with a value", () => {
      const { container } = render(<ProgressSpinner value={62} />);
      const node = bar(container);
      expect(node.getAttribute("aria-valuemin")).toBe("0");
      expect(node.getAttribute("aria-valuemax")).toBe("100");
      expect(node.getAttribute("aria-valuenow")).toBe("62");
      expect(node.getAttribute("aria-valuetext")).toBe("62%");
    });

    it("clamps out-of-range values before announcing them", () => {
      const { container } = render(<ProgressSpinner value={150} />);
      const node = bar(container);
      expect(node.getAttribute("aria-valuenow")).toBe("100");
      expect(node.getAttribute("aria-valuetext")).toBe("100%");

      const { container: below } = render(<ProgressSpinner value={-20} />);
      expect(bar(below).getAttribute("aria-valuenow")).toBe("0");
    });

    it("computes the percentage against a custom range", () => {
      const { container } = render(
        <ProgressSpinner value={30} min={10} max={50} />,
      );
      const node = bar(container);
      expect(node.getAttribute("aria-valuenow")).toBe("30");
      expect(node.getAttribute("aria-valuetext")).toBe("50%");
    });
  });

  describe("value readout", () => {
    it("shows the rounded percentage in the centre when determinate", () => {
      const { container } = render(<ProgressSpinner value={33.4} />);
      const readout = bar(container).querySelector(
        "span",
      ) as HTMLElement | null;
      expect(readout?.textContent).toBe("33%");
    });

    it("hides the readout when showValue is false", () => {
      const { container } = render(<ProgressSpinner value={50} showValue={false} />);
      expect(bar(container).querySelector("span")).toBeNull();
    });

    it("never shows a readout when indeterminate", () => {
      const { container } = render(<ProgressSpinner />);
      expect(bar(container).querySelector("span")).toBeNull();
    });

    it("sizes the readout with the control scale", () => {
      // The readout lives inside the ring, so it stays under the control
      // diameter — but both grew: a 6px percentage inside a 16px ring was
      // unreadable, and the number is the point of a determinate spinner.
      const texts: Record<string, string> = {
        xs: "text-[8px]",
        sm: "text-[9px]",
        md: "text-[11px]",
        lg: "text-sm",
        xl: "text-base",
      };
      for (const size of CONTROL_SIZES) {
        const { container } = render(<ProgressSpinner value={10} size={size} />);
        expect(
          (bar(container).querySelector("span") as HTMLElement).className,
        ).toContain(texts[size]);
      }
    });
  });

  describe("geometry", () => {
    it("follows the shared control scale", () => {
      // Grew alongside the readout — see the readout test above.
      const diameters: Record<string, string> = {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-14 w-14",
      };
      for (const size of CONTROL_SIZES) {
        const { container } = render(<ProgressSpinner size={size} />);
        expect(bar(container).className).toContain(diameters[size]);
      }
    });

    it("keeps the rendered stroke weight at the declared px", () => {
      // md/normal is 3.5px on the control's own diameter — converted into
      // viewBox units so the weight survives the SVG scaling. The diameters
      // grew with the readout (md 24→40, xl 40→56), so these follow.
      const { container } = render(
        <ProgressSpinner size="md" thickness="normal" />,
      );
      expect(radius(circles(container)[0])).toBeCloseTo(
        25 - (3.5 * 50) / 40 / 2 - 0.5,
        5,
      );

      const { container: thick } = render(
        <ProgressSpinner size="xl" thickness="thick" />,
      );
      for (const circle of circles(thick)) {
        expect(Number(circle.getAttribute("stroke-width"))).toBeCloseTo(
          (5.5 * 50) / 56,
          5,
        );
      }
    });

    it("pulls the radius in so thick strokes never clip the viewBox", () => {
      const { container } = render(
        <ProgressSpinner size="xs" thickness="thick" />,
      );
      const r = radius(circles(container)[0]);
      const stroke = Number(circles(container)[0].getAttribute("stroke-width"));
      // Outer edge (measured from the centre) must stay inside the box.
      expect(r + stroke / 2).toBeLessThanOrEqual(25);
      // …and use most of the ring, not a shy sliver.
      expect(r).toBeGreaterThan(15);
    });

    it("draws the determinate arc as a proportion of the circumference", () => {
      const { container } = render(<ProgressSpinner value={60} />);
      const [track, arc] = circles(container);
      const expected = 0.6 * TAU_R(radius(arc));
      expect(dasharray(arc)).toBeCloseTo(expected, 3);
      // The gap keeps the rest of the ring empty.
      const gap = Number(arc.getAttribute("stroke-dasharray")?.split(" ")[1]);
      expect(gap).toBeCloseTo(TAU_R(radius(arc)), 3);
      expect(track.getAttribute("stroke-dasharray")).toBeNull();
    });

    it("starts the determinate arc at twelve o'clock", () => {
      const { container } = render(<ProgressSpinner value={25} />);
      const arc = circles(container)[1];
      expect(arc.getAttribute("transform")).toBe("rotate(-90 25 25)");
    });
  });

  describe("tone", () => {
    it("every one of the 21 tones paints arc and track from its own variable", () => {
      for (const color of TRUE_COLORS) {
        const { container } = render(<ProgressSpinner color={color} />);
        const tokens = getProgressSpinnerToneTokens(color);
        const [track, arc] = circles(container);
        expect(track.getAttribute("stroke")).toBe(tokens.track);
        expect(arc.getAttribute("stroke")).toBe(tokens.arc);
        // The map that drifted in other components sent red to rose — each
        // tone has to name its own colour variable.
        expect(tokens.arc).toContain(`--color-${color}-400`);
        expect(tokens.track).toContain(`--color-${color}-400`);
      }
    });
  });

  describe("motion", () => {
    it("animates the rotate and the dash when indeterminate", () => {
      const { container } = render(<ProgressSpinner />);
      expect(svg(container).getAttribute("class")).toContain(
        "progress-spinner-rotate",
      );
      const dash = circles(container)[1];
      expect(dash.classList.contains("progress-spinner-dash")).toBe(true);
    });

    it("passes animationDuration down as a custom property", () => {
      const { container } = render(
        <ProgressSpinner animationDuration="400ms" />,
      );
      expect(svg(container).style.getPropertyValue("--progress-spinner-duration")).toBe(
        "400ms",
      );
    });

    it("runs static when determinate", () => {
      const { container } = render(<ProgressSpinner value={40} />);
      expect(svg(container).getAttribute("class")).not.toContain(
        "progress-spinner-rotate",
      );
      for (const circle of circles(container)) {
        expect(circle.classList.contains("progress-spinner-dash")).toBe(false);
      }
    });
  });

  describe("integration", () => {
    it("forwards className and ref", () => {
      const ref = { current: null as HTMLDivElement | null };
      const { container } = render(
        <ProgressSpinner ref={ref} className="ml-4" />,
      );
      expect(ref.current).toBe(bar(container));
      expect(bar(container).className).toContain("ml-4");
    });
  });
});

describe("ProgressSpinner — readout", () => {
  it("is large enough to read at every size", () => {
    // The rings were 16–40px with a 6–12px percentage inside them; the number
    // is the point of a determinate spinner and it could not be read.
    const MIN_PX: Record<string, number> = { xs: 8, sm: 9, md: 11, lg: 14, xl: 16 };
    for (const size of CONTROL_SIZES) {
      const { container, unmount } = render(
        <ProgressSpinner value={72} size={size} />,
      );
      const readout = container.querySelector("span")!;
      const cls = readout.className;
      const arbitrary = cls.match(/text-\[(\d+)px\]/);
      const px = arbitrary
        ? Number(arbitrary[1])
        : /text-base/.test(cls)
          ? 16
          : /text-sm/.test(cls)
            ? 14
            : 0;
      expect(px).toBeGreaterThanOrEqual(MIN_PX[size]);
      unmount();
    }
  });

  it("lets the caller colour the readout for a saturated surface", () => {
    const { container } = render(
      <ProgressSpinner value={72} valueClassName="text-white" />,
    );
    const readout = container.querySelector("span")!;
    expect(readout.className).toContain("text-white");
    // The default neutral pair is dropped rather than racing it.
    expect(readout.className).not.toContain("text-neutral-700");
  });
});

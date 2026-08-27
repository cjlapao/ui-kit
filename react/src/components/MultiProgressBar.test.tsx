import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MultiProgressBar from "./MultiProgressBar";
import { getColorPalette, getColorPaletteNames } from "../theme";
import { CONTROL_SIZES } from "../theme/Theme";

const SERIES = [
  { key: "a", label: "Running", value: 3 },
  { key: "b", label: "Stopped", value: 1 },
];

describe("MultiProgressBar", () => {
  it("gives the stacked bar a text alternative naming every slice", () => {
    // The chart used to be invisible to a screen reader: no role, no label,
    // and the numbers existed only inside a hover tooltip.
    render(<MultiProgressBar label="Capsules" total={4} series={SERIES} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAccessibleName("Capsules");
    const valueText = meter.getAttribute("aria-valuetext")!;
    expect(valueText).toContain("Running: 3");
    expect(valueText).toContain("Stopped: 1");
  });

  it("assigns a tone per series from the shared palette", () => {
    const { container } = render(
      <MultiProgressBar label="C" total={4} series={SERIES} />,
    );
    const [first, second] = getColorPaletteNames(2);
    expect(container.innerHTML).toContain(`bg-${first}-500`);
    expect(container.innerHTML).toContain(`bg-${second}-500`);
  });

  it("lets a series name its own tone", () => {
    const { container } = render(
      <MultiProgressBar
        label="C"
        total={4}
        series={[{ key: "a", label: "A", value: 1, tone: "fuchsia" }]}
      />,
    );
    expect(container.innerHTML).toContain("bg-fuchsia-500");
  });

  it("still honours a raw `color` class for existing call sites", () => {
    const { container } = render(
      <MultiProgressBar
        label="C"
        total={4}
        series={[{ key: "a", label: "A", value: 1, color: "bg-rose-500" }]}
      />,
    );
    expect(container.innerHTML).toContain("bg-rose-500");
  });

  it("takes every control size", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(
        <MultiProgressBar label="C" total={4} series={SERIES} size={size} />,
      );
      expect(screen.getByRole("meter")).toBeTruthy();
      unmount();
    }
  });

  describe("absorbed from MeterGroup", () => {
    it("is a meter, with the range published", () => {
      // MeterGroup's semantics: a stacked bar is one quantity split into
      // shares, so `meter` with min/max/now is more accurate than `img`.
      render(
        <MultiProgressBar label="C" min={0} max={20} series={SERIES} />,
      );
      const meter = screen.getByRole("meter");
      expect(meter.getAttribute("aria-valuemin")).toBe("0");
      expect(meter.getAttribute("aria-valuemax")).toBe("20");
      expect(meter.getAttribute("aria-valuenow")).toBe("4");
      // …and the slices are still named, which MeterGroup did not do.
      expect(meter.getAttribute("aria-valuetext")).toContain("Running: 3");
    });

    it("takes min/max, with `total` still working as the old name for max", () => {
      const { container: withMax, unmount } = render(
        <MultiProgressBar label="C" max={4} series={SERIES} />,
      );
      const maxWidths = Array.from(
        withMax.querySelectorAll<HTMLElement>("[data-meter-segment]"),
      ).map((el) => el.style.width);
      unmount();

      const { container: withTotal } = render(
        <MultiProgressBar label="C" total={4} series={SERIES} />,
      );
      const totalWidths = Array.from(
        withTotal.querySelectorAll<HTMLElement>("[data-meter-segment]"),
      ).map((el) => el.style.width);
      expect(maxWidths).toEqual(totalWidths);
      expect(maxWidths[0]).toBe("75%");
    });

    it("renders vertically, with the track length as height", () => {
      const { container } = render(
        <MultiProgressBar
          label="C"
          max={4}
          series={SERIES}
          orientation="vertical"
          height={300}
          barSize={16}
        />,
      );
      expect(screen.getByRole("meter").getAttribute("data-orientation")).toBe(
        "vertical",
      );
      const segs = container.querySelectorAll<HTMLElement>("[data-meter-segment]");
      // Vertical segments size on height, not width.
      expect(segs[0].style.height).toBe("75%");
      expect(segs[0].style.width).toBe("");
    });

    it("places the legend before or after the bar", () => {
      const { container: end, unmount } = render(
        <MultiProgressBar label="C" max={4} series={SERIES} />,
      );
      expect(end.innerHTML).not.toContain("flex-col-reverse");
      unmount();
      const { container: start } = render(
        <MultiProgressBar label="C" max={4} series={SERIES} labelPosition="start" />,
      );
      expect(start.innerHTML).toContain("flex-col-reverse");
    });

    it("lays the legend out in a column when asked", () => {
      const { container } = render(
        <MultiProgressBar
          label="C"
          max={4}
          series={SERIES}
          labelOrientation="vertical"
        />,
      );
      expect(
        container.querySelector('[aria-label="Breakdown"]')!.className,
      ).toContain("flex-col");
    });

    it("shows a per-segment icon instead of the dot", () => {
      const { container } = render(
        <MultiProgressBar
          label="C"
          max={4}
          series={[{ key: "a", label: "A", value: 1, icon: "Rocket" }]}
        />,
      );
      // The colour dot is gone for that row.
      expect(container.querySelector("[aria-hidden] .rounded-full")).toBeNull();
    });

    it("can show each share as a percentage", () => {
      render(
        <MultiProgressBar label="C" max={4} series={SERIES} showPercent />,
      );
      expect(screen.getByText("(75%)")).toBeTruthy();
    });

    it("renders a loading skeleton, an error and an empty state", () => {
      const { container: busy, unmount } = render(
        <MultiProgressBar label="C" max={4} series={SERIES} loading />,
      );
      expect(busy.innerHTML).toContain("animate-pulse");
      expect(screen.getByRole("meter").getAttribute("aria-busy")).toBe("true");
      unmount();

      const { unmount: u2 } = render(
        <MultiProgressBar label="C" max={4} series={SERIES} error="Boom" />,
      );
      expect(screen.getByText("Boom")).toBeTruthy();
      u2();

      render(<MultiProgressBar label="C" max={4} series={[]} />);
      expect(screen.getByText("No items to display.")).toBeTruthy();
    });

    it("takes an explicit accessible name", () => {
      render(
        <MultiProgressBar label="C" max={4} series={SERIES} ariaLabel="Capsule states" />,
      );
      expect(screen.getByRole("meter")).toHaveAccessibleName("Capsule states");
    });
  });

  it("can hide the legend", () => {
    const { container, rerender } = render(
      <MultiProgressBar label="C" total={4} series={SERIES} />,
    );
    expect(container.textContent).toContain("Running");
    rerender(
      <MultiProgressBar label="C" total={4} series={SERIES} hideLegend />,
    );
    expect(container.textContent).not.toContain("Running");
  });
});

describe("colour palette helpers", () => {
  it("are a pure function of the count, past the end of the spectrum", () => {
    // They used to fall back to a *random* colour beyond 21 entries, so a
    // chart repainted differently on every render, and a component calling
    // this twice (bar + legend) got two different palettes for one dataset.
    expect(getColorPaletteNames(30)).toEqual(getColorPaletteNames(30));
    expect(getColorPalette(30)).toEqual(getColorPalette(30));
    expect(getColorPalette(30, "text")).toEqual(getColorPalette(30, "text"));
  });

  it("cycles the spectrum instead of inventing colours", () => {
    const names = getColorPaletteNames(25);
    expect(names.slice(21)).toEqual(getColorPaletteNames(4));
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricBar from "./MetricBar";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

describe("MetricBar", () => {
  it("gives the progressbar an accessible name from the label", () => {
    // The hand-rolled header this replaces was a plain span, so the bar under
    // it was announced as just "progress bar".
    render(<MetricBar label="Disk" value="12 / 20 GB" percentage={60} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAccessibleName("Disk");
  });

  it("shows the caller's free-form reading, not a computed percentage", () => {
    render(<MetricBar label="Disk" value="12 / 20 GB" percentage={60} />);
    expect(screen.getByText("12 / 20 GB")).toBeTruthy();
    expect(screen.queryByText("60%")).toBeNull();
  });

  it("falls back to the percentage when no value is given", () => {
    render(<MetricBar label="Disk" percentage={60} />);
    // No reading requested, so Progress renders no value cell.
    expect(screen.queryByText("12 / 20 GB")).toBeNull();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "60",
    );
  });

  it("takes every control size", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(
        <MetricBar label="L" percentage={10} size={size} />,
      );
      expect(screen.getByRole("progressbar")).toBeTruthy();
      unmount();
    }
    expect(CONTROL_SIZES).toContain("xl");
  });

  it("takes every tone, through `color` or `tone`", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <MetricBar label="L" percentage={50} tone={tone} />,
      );
      expect(container.innerHTML).toContain(tone);
      unmount();
    }
  });
});

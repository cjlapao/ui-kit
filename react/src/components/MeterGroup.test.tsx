import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MeterGroup, { type MeterItem } from "./MeterGroup";
import { TRUE_COLORS } from "../../../common/theme/Theme";

const ITEMS: MeterItem[] = [
  { label: "Apps", value: 16, color: "emerald" },
  { label: "Messages", value: 8, color: "amber" },
  { label: "Media", value: 24, color: "blue" },
  { label: "System", value: 10, color: "violet" },
];

const root = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="meter"]')!;

const segments = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>("[data-meter-segment]"));

const labelList = (container: HTMLElement) =>
  container.querySelector<HTMLOListElement>("[aria-label='Meter breakdown']");

describe("MeterGroup", () => {
  it("renders one segment per item with the computed percent width", () => {
    const { container } = render(<MeterGroup items={ITEMS} />);
    const segs = segments(container);
    expect(segs).toHaveLength(4);
    expect(segs[0].style.width).toBe("16%");
    expect(segs[1].style.width).toBe("8%");
    expect(segs[2].style.width).toBe("24%");
    expect(segs[3].style.width).toBe("10%");
  });

  it("exposes the meter role with the range and the raw total", () => {
    const { container } = render(<MeterGroup items={ITEMS} />);
    const meter = root(container);
    expect(meter).not.toBeNull();
    expect(meter.getAttribute("aria-valuemin")).toBe("0");
    expect(meter.getAttribute("aria-valuemax")).toBe("100");
    expect(meter.getAttribute("aria-valuenow")).toBe("58");
    expect(meter.getAttribute("aria-label")).toBe("Meter group");
  });

  it("accepts a custom accessible name", () => {
    const { container } = render(
      <MeterGroup items={ITEMS} ariaLabel="Disk usage" />,
    );
    expect(root(container).getAttribute("aria-label")).toBe("Disk usage");
  });

  it("renders each label with its rounded percent", () => {
    const { container } = render(<MeterGroup items={ITEMS} />);
    const list = labelList(container)!;
    expect(list).not.toBeNull();
    const rows = Array.from(list.querySelectorAll("li"));
    expect(rows).toHaveLength(4);
    expect(rows[0].textContent).toContain("Apps");
    expect(rows[0].textContent).toContain("(16%)");
    expect(rows[3].textContent).toContain("(10%)");
  });

  it("rounds fractional percents in the labels", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "X", value: 33.4 }]} />,
    );
    expect(labelList(container)!.textContent).toContain("(33%)");
  });
});

describe("MeterGroup percent calculation", () => {
  it("maps values against the default 0-100 range", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 25 }]} />,
    );
    expect(segments(container)[0].style.width).toBe("25%");
  });

  it("maps values against a custom min-max range", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 50 }]} min={0} max={200} />,
    );
    expect(segments(container)[0].style.width).toBe("25%");
  });

  it("respects a non-zero min", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 12.5 }]} min={5} max={15} />,
    );
    expect(segments(container)[0].style.width).toBe("75%");
  });

  it("clamps values above max to 100%", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 250 }]} max={100} />,
    );
    expect(segments(container)[0].style.width).toBe("100%");
  });

  it("clamps values below min to 0%", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: -5 }]} min={0} />,
    );
    expect(segments(container)[0].style.width).toBe("0%");
  });

  it("treats non-finite values as zero", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: Number.NaN }]} />,
    );
    expect(segments(container)[0].style.width).toBe("0%");
  });

  it("does not divide by zero when min equals max", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 5 }]} min={5} max={5} />,
    );
    expect(segments(container)[0].style.width).toBe("0%");
  });

  it("reports the raw (unclamped) sum on the meter role", () => {
    const { container } = render(
      <MeterGroup items={ITEMS.slice(0, 2)} />,
    );
    expect(root(container).getAttribute("aria-valuenow")).toBe("24");
  });
});

describe("MeterGroup orientation", () => {
  it("sizes segments by width in horizontal mode", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 40 }]} />,
    );
    expect(root(container).dataset.orientation).toBe("horizontal");
    const seg = segments(container)[0];
    expect(seg.style.width).toBe("40%");
    expect(seg.style.height).toBe("");
  });

  it("sizes segments by height in vertical mode", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 40 }]} orientation="vertical" />,
    );
    expect(root(container).dataset.orientation).toBe("vertical");
    const seg = segments(container)[0];
    expect(seg.style.height).toBe("40%");
    expect(seg.style.width).toBe("");
  });

  it("spans the track in both axes so segment percentages have a basis", () => {
    const horizontal = render(
      <MeterGroup items={[{ label: "A", value: 40 }]} />,
    );
    const vertical = render(
      <MeterGroup items={[{ label: "A", value: 40 }]} orientation="vertical" />,
    );
    for (const { container } of [horizontal, vertical]) {
      const inner = segments(container)[0].parentElement!;
      // Without h-full the vertical size of the segments (h-full) resolves
      // against an auto-height container and collapses to zero in a browser.
      expect(inner.className).toContain("h-full");
      expect(inner.className).toContain("w-full");
    }
  });

  it("applies the vertical track height", () => {
    const { container } = render(
      <MeterGroup
        items={[{ label: "A", value: 40 }]}
        orientation="vertical"
        height="320px"
      />,
    );
    const track = segments(container)[0].parentElement!.parentElement!;
    expect(track.style.height).toBe("320px");
  });

  it("accepts a numeric vertical height", () => {
    const { container } = render(
      <MeterGroup
        items={[{ label: "A", value: 40 }]}
        orientation="vertical"
        height={150}
      />,
    );
    const track = segments(container)[0].parentElement!.parentElement!;
    expect(track.style.height).toBe("150px");
  });
});

describe("MeterGroup labels", () => {
  it("hides the label list when showLabels is false", () => {
    const { container } = render(<MeterGroup items={ITEMS} showLabels={false} />);
    expect(labelList(container)).toBeNull();
  });

  it("places the labels above the bar when they lead (horizontal)", () => {
    const { container } = render(
      <MeterGroup items={ITEMS} labelPosition="start" />,
    );
    const layout = root(container).firstElementChild as HTMLElement;
    // Horizontal bars stack column-wise: labels on the cross axis (top).
    expect(layout.className).toContain("flex-col-reverse");
  });

  it("places the labels below the bar when they trail (horizontal)", () => {
    const { container } = render(<MeterGroup items={ITEMS} />);
    const layout = root(container).firstElementChild as HTMLElement;
    expect(layout.className).toContain("flex-col");
    expect(layout.className).not.toContain("flex-col-reverse");
  });

  it("places the labels to the left of the bar when they lead (vertical)", () => {
    const { container } = render(
      <MeterGroup
        items={ITEMS}
        orientation="vertical"
        labelPosition="start"
      />,
    );
    const layout = root(container).firstElementChild as HTMLElement;
    // Vertical bars lay out row-wise: labels on the cross axis (left).
    expect(layout.className).toContain("flex-row-reverse");
  });

  it("places the labels to the right of the bar when they trail (vertical)", () => {
    const { container } = render(
      <MeterGroup items={ITEMS} orientation="vertical" />,
    );
    const layout = root(container).firstElementChild as HTMLElement;
    expect(layout.className).toContain("flex-row");
    expect(layout.className).not.toContain("flex-row-reverse");
  });

  it("lays the label list out vertically on request", () => {
    const { container } = render(
      <MeterGroup items={ITEMS} labelOrientation="vertical" />,
    );
    expect(labelList(container)!.className).toContain("flex-col");
  });

  it("lays the label list out horizontally by default", () => {
    const { container } = render(<MeterGroup items={ITEMS} />);
    expect(labelList(container)!.className).toContain("flex-row");
  });

  it("renders an icon in place of the colour marker", () => {
    const { container } = render(
      <MeterGroup
        items={[
          { label: "Apps", value: 16, color: "emerald", icon: "Cog" },
          { label: "Media", value: 24, color: "blue" },
        ]}
      />,
    );
    const rows = Array.from(labelList(container)!.querySelectorAll("li"));
    expect(rows[0].querySelector("svg")).not.toBeNull();
    // The icon row has no marker square; the second row still does.
    const markerSquares = Array.from(
      labelList(container)!.querySelectorAll(".h-2.w-2"),
    );
    expect(markerSquares).toHaveLength(1);
  });
});

describe("MeterGroup tone matrix", () => {
  it.each(TRUE_COLORS as readonly string[])("uses the %s tone for a segment", (color) => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 10, color: color as never }]} />,
    );
    const seg = segments(container)[0];
    expect(seg.className).toContain(`bg-${color}-500`);
    expect(seg.className).toContain(`dark:bg-${color}-400`);
  });

  it.each(TRUE_COLORS as readonly string[])(
    "uses the %s tone for the label marker",
    (color) => {
      const { container } = render(
        <MeterGroup items={[{ label: "A", value: 10, color: color as never }]} />,
      );
      const marker =
        labelList(container)!.querySelector('[aria-hidden="true"]')!;
      expect(marker.className).toContain(`bg-${color}-400`);
      expect(marker.className).toContain(`dark:bg-${color}-300`);
    },
  );

  it("falls back to the group tone when an item has no colour", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 10 }]} color="teal" />,
    );
    expect(segments(container)[0].className).toContain("bg-teal-500");
  });

  it("defaults the group tone to blue", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 10 }]} />,
    );
    expect(segments(container)[0].className).toContain("bg-blue-500");
  });

  it("stamps the group tone on the root data attribute", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 10 }]} color="rose" />,
    );
    expect(root(container).dataset.color).toBe("rose");
  });
});

describe("MeterGroup states", () => {
  it("shows a pulsing skeleton while loading and hides the content", () => {
    const { container } = render(<MeterGroup items={ITEMS} loading />);
    expect(root(container).getAttribute("aria-busy")).toBe("true");
    expect(segments(container)).toHaveLength(0);
    expect(labelList(container)).toBeNull();
    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThanOrEqual(3);
  });

  it("renders custom loading content instead of the skeleton", () => {
    const { container, getByText } = render(
      <MeterGroup items={ITEMS} loading loadingState={<div>Fetching meters</div>} />,
    );
    expect(getByText("Fetching meters")).not.toBeNull();
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });

  it("shows an error state in place of the content", () => {
    const { container, getByText } = render(
      <MeterGroup items={ITEMS} error="Could not load meters" />,
    );
    expect(segments(container)).toHaveLength(0);
    expect(getByText("Could not load meters")).not.toBeNull();
  });

  it("renders custom error content", () => {
    const { getByText } = render(
      <MeterGroup items={ITEMS} errorState={<div>Custom failure</div>} error="x" />,
    );
    expect(getByText("Custom failure")).not.toBeNull();
  });

  it("shows the empty message when there are no items", () => {
    const { getByText } = render(<MeterGroup items={[]} />);
    expect(getByText("No items to display.")).not.toBeNull();
  });

  it("accepts a custom empty message", () => {
    const { getByText } = render(
      <MeterGroup items={[]} emptyMessage="Nothing to measure yet." />,
    );
    expect(getByText("Nothing to measure yet.")).not.toBeNull();
  });

  it("renders custom empty content", () => {
    const { getByText } = render(
      <MeterGroup items={[]} emptyState={<div>No meters</div>} />,
    );
    expect(getByText("No meters")).not.toBeNull();
  });

  it("keeps the meter role on the root in every state", () => {
    const { container: c1 } = render(<MeterGroup items={[]} loading />);
    const { container: c2 } = render(<MeterGroup items={[]} error="e" />);
    expect(c1.querySelector('[role="meter"]')).not.toBeNull();
    expect(c2.querySelector('[role="meter"]')).not.toBeNull();
  });
});

describe("MeterGroup composition", () => {
  it("spreads extra attributes onto the root", () => {
    const { container } = render(
      <MeterGroup items={ITEMS} data-testid="mg" className="custom" />,
    );
    expect(root(container).dataset.testid).toBe("mg");
    expect(root(container).className).toContain("custom");
  });

  it("applies a custom bar size", () => {
    const { container } = render(
      <MeterGroup items={[{ label: "A", value: 10 }]} barSize={20} />,
    );
    const track = segments(container)[0].parentElement!.parentElement!;
    expect(track.style.height).toBe("20px");
  });
});

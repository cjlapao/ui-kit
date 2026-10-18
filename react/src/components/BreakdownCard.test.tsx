import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BreakdownCard, { type BreakdownItem } from "./BreakdownCard";

const items: BreakdownItem[] = [
  { id: "a", label: "Alpha", value: 60, tone: "blue" },
  { id: "b", label: "Beta", value: 30, displayValue: "30k", tone: "amber" },
  { id: "c", label: "Gamma", value: 10, tone: "rose" },
];

describe("BreakdownCard", () => {
  it("renders title, caption and one labelled row per item", () => {
    render(<BreakdownCard title="Where it went" caption="last quarter" items={items} />);
    expect(screen.getByText("Where it went")).toBeInTheDocument();
    expect(screen.getByText("last quarter")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("prefers displayValue over the raw value", () => {
    render(<BreakdownCard title="t" items={items} />);
    expect(screen.getByText("30k")).toBeInTheDocument();
    // The other rows show their raw value.
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("computes whole-number shares of the total", () => {
    render(<BreakdownCard title="t" items={items} />);
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  it("shows dashes instead of shares when nothing adds up", () => {
    render(
      <BreakdownCard
        title="t"
        items={[{ id: "z", label: "Zero", value: 0, tone: "neutral" }]}
      />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("renders the stats strip", () => {
    render(
      <BreakdownCard
        title="t"
        items={items}
        stats={[
          { label: "Total", value: "100k" },
          { label: "Delta", value: "+12%" },
        ]}
      />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("100k")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("fires onCta from the CTA button", () => {
    const onCta = vi.fn();
    render(<BreakdownCard title="t" items={items} ctaLabel="Full report" onCta={onCta} />);
    fireEvent.click(screen.getByRole("button", { name: "Full report" }));
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  it("merges className onto the card surface", () => {
    const { container } = render(
      <BreakdownCard title="t" items={items} className="custom-card" />,
    );
    expect(container.querySelector(".custom-card")).toBeInTheDocument();
  });
  it("draws its own shape in placeholder ink while loading", () => {
    const { container } = render(<BreakdownCard title="Cloud spend" items={items} loading />);
    expect(screen.getByText("Cloud spend")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });
});

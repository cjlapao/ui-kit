import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StatTile from "./StatTile";
import StatCountTile from "./StatCountTile";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

describe("StatTile (rebased on StatCard)", () => {
  it("renders the headline figures", () => {
    render(<StatTile title="Capsules" value={42} subtitle="in this org" />);
    expect(screen.getByText("Capsules")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("in this org")).toBeTruthy();
  });

  it("draws the progress bar as a real progressbar with a name", () => {
    // It used to be two nested divs with the percentage in a sibling span —
    // no role, so a screen reader saw a number with no meaning attached.
    render(
      <StatTile title="T" value={1} progress={{ value: 60, label: "Used" }} />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAccessibleName("Used");
    expect(bar.getAttribute("aria-valuenow")).toBe("60");
  });

  it("shows a trend with its caption", () => {
    render(
      <StatTile
        title="T"
        value={1}
        trend={{ value: "+12%", direction: "up", label: "vs. last week" }}
      />,
    );
    expect(screen.getByText("+12%")).toBeTruthy();
    expect(screen.getByText("vs. last week")).toBeTruthy();
  });

  it("renders an error with a retry that is a real Button", () => {
    const onRetry = vi.fn();
    render(
      <StatTile title="T" value={1} error={{ message: "Boom", onRetry }} />,
    );
    expect(screen.getByText("Boom")).toBeTruthy();
    fireEvent.click(screen.getByText("Try Again"));
    expect(onRetry).toHaveBeenCalled();
    // The value is replaced, not shown alongside the failure.
    expect(screen.queryByText("1")).toBeNull();
  });

  it("is keyboard-activatable when clickable", () => {
    // A div with onClick is not a button: the card could be focused and never
    // activated from the keyboard.
    const onClick = vi.fn();
    const { container } = render(
      <StatTile title="T" value={1} onClick={onClick} />,
    );
    const card = container.querySelector('[role="button"]')!;
    expect(card.getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalled();
  });

  it("takes every size and tone", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(<StatTile title="T" value={1} size={size} />);
      expect(screen.getByText("T")).toBeTruthy();
      unmount();
    }
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <StatTile title="T" value={1} color={tone} />,
      );
      expect(container.innerHTML).toContain(tone);
      unmount();
    }
  });

  it("tints the title and value with textColor", () => {
    const { container } = render(
      <StatTile title="T" value={1} textColor="fuchsia" />,
    );
    // The value takes `-700`, the label `-600`. StatCard separates the two
    // tones now; `textColor` sets both.
    expect(container.innerHTML).toContain("text-fuchsia-700");
    expect(container.innerHTML).toContain("text-fuchsia-600");
  });

  it("renders meta and footer", () => {
    render(
      <StatTile
        title="T"
        value={1}
        meta={[{ text: "3 regions" }]}
        footer={<span>updated now</span>}
      />,
    );
    expect(screen.getByText("3 regions")).toBeTruthy();
    expect(screen.getByText("updated now")).toBeTruthy();
  });
});

describe("StatCountTile (rebased on StatCard)", () => {
  it("renders the count and its breakdown", () => {
    render(
      <StatCountTile
        title="Total"
        count={128}
        breakdown={[
          { label: "Running", value: 100 },
          { label: "Stopped", value: 28, color: "rose" },
        ]}
      />,
    );
    expect(screen.getByText("Total")).toBeTruthy();
    expect(screen.getByText("128")).toBeTruthy();
    expect(screen.getByText("Running")).toBeTruthy();
    expect(screen.getByText("28")).toBeTruthy();
  });

  it("tints a breakdown figure", () => {
    const { container } = render(
      <StatCountTile
        title="T"
        count={1}
        breakdown={[{ label: "X", value: 1, color: "emerald" }]}
      />,
    );
    expect(container.innerHTML).toContain("text-emerald-600");
  });
});

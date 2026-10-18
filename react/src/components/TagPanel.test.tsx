import { describe, it, expect, vi } from "vitest";
import { act } from "@testing-library/react";
import { fireEvent, render, screen } from "@testing-library/react";
import TagPanel from "./TagPanel";
import { TRUE_COLORS } from "../theme/Theme";

const TAGS = Array.from({ length: 8 }, (_, i) => ({ label: `tag-${i}` }));

describe("TagPanel", () => {
  it("limits the pills and unfolds them on one overflow chip", () => {
    // The overflow pills are always mounted — ColorSwatches' cascade needs
    // them in the flow. Collapsed, they are hidden (aria-hidden, width 0,
    // scaled away); the chip is one control both ways (`aria-expanded`).
    render(<TagPanel title="Tags" tags={TAGS} tagLimit={3} />);
    expect(screen.getByText("tag-2")).toBeTruthy();
    expect(
      screen.getByText("tag-4").closest('[aria-hidden="true"]'),
    ).toBeTruthy();
    const chip = screen.getByLabelText("Show 5 more tags");
    fireEvent.click(chip);
    expect(screen.getByText("tag-7").closest("[aria-hidden]")).toBeNull();
    // The expanded layout is held while the pills ripple out, then commits.
    vi.useFakeTimers();
    fireEvent.click(screen.getByLabelText("Collapse tags"));
    act(() => vi.advanceTimersByTime(310));
    vi.useRealTimers();
    expect(
      screen.getByText("tag-7").closest('[aria-hidden="true"]'),
    ).toBeTruthy();
  });

  it("keeps the empty state under the header's scale", () => {
    // PANE_EMPTY_STATE_SIZE: the default (md) section takes the xs state —
    // text-sm copy, no shouting over an md header.
    const { unmount: unmountFirst } = render(<TagPanel title="Tags" tags={[]} />);
    expect(screen.getByText("No tags").className).toContain("text-sm");
    unmountFirst();
    const { unmount } = render(<TagPanel title="Tags" tags={[]} size="lg" />);
    expect(screen.getByText("No tags").className).toContain("text-base");
    unmount();
  });

  it("shows everything when tagLimit is 0", () => {
    render(<TagPanel tags={TAGS} tagLimit={0} />);
    expect(screen.getByText("tag-7")).toBeTruthy();
  });

  it("renders an EmptyState rather than bare italic text", () => {
    const { container } = render(<TagPanel tags={[]} />);
    expect(screen.getByText("No tags")).toBeTruthy();
    expect(container.innerHTML).not.toContain("italic");
  });

  it("takes a custom empty message and a custom empty state", () => {
    const { unmount } = render(
      <TagPanel tags={[]} emptyMessage="Nothing yet" />,
    );
    expect(screen.getByText("Nothing yet")).toBeTruthy();
    unmount();
    render(<TagPanel tags={[]} emptyState={<span>custom</span>} />);
    expect(screen.getByText("custom")).toBeTruthy();
  });

  it("separates the header scale from the pill scale", () => {
    // `size` (a SectionSize) used to be handed to the overflow Pill, which
    // expects a PillSize — two different scales sharing one prop.
    render(
      <TagPanel title="T" tags={TAGS} tagLimit={2} size="lg" tagSize="md" />,
    );
    expect(screen.getByLabelText("Show 6 more tags")).toBeTruthy();
  });

  it("takes every tone on a tag", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <TagPanel tags={[{ label: "x", tone }]} />,
      );
      expect(container.innerHTML).toContain(tone);
      unmount();
    }
  });
});

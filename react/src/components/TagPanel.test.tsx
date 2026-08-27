import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TagPanel from "./TagPanel";
import { TRUE_COLORS } from "../theme/Theme";

const TAGS = Array.from({ length: 8 }, (_, i) => ({ label: `tag-${i}` }));

describe("TagPanel", () => {
  it("limits the pills and expands on the overflow control", () => {
    render(<TagPanel title="Tags" tags={TAGS} tagLimit={3} />);
    expect(screen.getByText("tag-2")).toBeTruthy();
    expect(screen.queryByText("tag-4")).toBeNull();
    fireEvent.click(screen.getByLabelText("Show 5 more tags"));
    expect(screen.getByText("tag-7")).toBeTruthy();
    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText("tag-7")).toBeNull();
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
    const { unmount } = render(<TagPanel tags={[]} emptyMessage="Nothing yet" />);
    expect(screen.getByText("Nothing yet")).toBeTruthy();
    unmount();
    render(<TagPanel tags={[]} emptyState={<span>custom</span>} />);
    expect(screen.getByText("custom")).toBeTruthy();
  });

  it("separates the header scale from the pill scale", () => {
    // `size` (a SectionSize) used to be handed to the overflow Pill, which
    // expects a PillSize — two different scales sharing one prop.
    render(<TagPanel title="T" tags={TAGS} tagLimit={2} size="lg" tagSize="md" />);
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

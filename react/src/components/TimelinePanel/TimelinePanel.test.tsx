import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelinePanel from "./TimelinePanel";
import type { TimelinePanelItem } from "./types";
import { SURFACE_VARIANTS } from "../../theme/Theme";

// jsdom has no layout, so every row measures 0 and the connector SVG (which
// only renders once heights are known) never appears. Assertions therefore
// target the rows, the shell and the loading states.
const items: TimelinePanelItem[] = [
  { id: "a", title: "First", subtitle: "one", isRoot: true },
  { id: "b", title: "Second", subtitle: "two", depth: 1 },
  { id: "c", title: "Live", isCurrent: true },
];

describe("TimelinePanel", () => {
  it("renders a Panel shell, not its own card", () => {
    const { container } = render(
      <TimelinePanel title="Snapshots" items={items} variant="glass" />,
    );
    // `data-variant` is Panel's own marker — its presence is the proof that
    // the local copy of the variant chrome is gone.
    const section = container.querySelector("section[data-variant]");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("data-variant")).toBe("glass");
  });

  it.each(SURFACE_VARIANTS)("supports the %s surface", (variant) => {
    const { container } = render(
      <TimelinePanel items={items} variant={variant} />,
    );
    expect(
      container.querySelector(`section[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("First")).toBeTruthy();
  });

  it("renders every item", () => {
    render(<TimelinePanel items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.title as string)).toBeTruthy();
    }
  });

  describe("loading", () => {
    it("draws a timeline-shaped skeleton and no rows", () => {
      const { container } = render(
        <TimelinePanel items={items} loading loaderType="skeleton" />,
      );
      expect(screen.queryByText("First")).toBeNull();
      expect(container.querySelector(".animate-pulse")).not.toBeNull();
      expect(container.querySelector("section")?.getAttribute("aria-busy")).toBe(
        "true",
      );
    });

    it("breaks the rail around each anchor instead of running it behind them", () => {
      const { container } = render(
        <TimelinePanel items={[]} loading loaderType="skeleton" skeletonRows={4} />,
      );
      // One segment per gap end: the first row has nothing above it and the
      // last nothing below, so 2n - 2. A single continuous rail showed through
      // the translucent dots, because two stacked low-alpha fills read as one
      // darker fill rather than as a solid disc.
      expect(container.querySelectorAll("span.w-0\\.5")).toHaveLength(6);
    });

    it("sizes the skeleton from skeletonRows when there is nothing to shape it on", () => {
      const { container } = render(
        <TimelinePanel items={[]} loading loaderType="skeleton" skeletonRows={6} />,
      );
      // One anchor dot per placeholder row.
      expect(container.querySelectorAll("span.absolute.top-1\\/2")).toHaveLength(
        6,
      );
    });

    it("withholds the header action, and stands a placeholder in for it under the skeleton", () => {
      // The header is outside the body, so the overlay loader never covered it
      // and the action stayed clickable mid-load.
      const action = { label: "Create Snapshot", onClick: () => {} };
      const { container, rerender } = render(
        <TimelinePanel title="Snapshots" headerAction={action} items={items} />,
      );
      expect(screen.getByRole("button", { name: "Create Snapshot" })).toBeTruthy();

      rerender(
        <TimelinePanel
          title="Snapshots"
          headerAction={action}
          items={items}
          loading
          loaderType="skeleton"
        />,
      );
      expect(screen.queryByRole("button", { name: "Create Snapshot" })).toBeNull();
      // Placeholder keeps the header from collapsing.
      expect(container.querySelector("span.w-28")).not.toBeNull();

      rerender(
        <TimelinePanel
          title="Snapshots"
          headerAction={action}
          items={items}
          loading
          loaderType="spinner"
        />,
      );
      expect(screen.queryByRole("button", { name: "Create Snapshot" })).toBeNull();
      expect(container.querySelector("span.w-28")).toBeNull();
    });

    it("withholds a custom header action node too", () => {
      render(
        <TimelinePanel
          title="Snapshots"
          headerAction={<button type="button">Custom</button>}
          items={items}
          loading
        />,
      );
      expect(screen.queryByRole("button", { name: "Custom" })).toBeNull();
    });

    it("keeps the rows visible when refreshing over existing items", () => {
      render(<TimelinePanel items={items} loading loaderType="spinner" />);
      expect(screen.getByText("First")).toBeTruthy();
    });
  });

  describe("empty state", () => {
    it("falls back to a default message", () => {
      // An omitted `emptyState` used to render nothing at all.
      render(<TimelinePanel title="Snapshots" items={[]} />);
      expect(screen.getByText("Nothing to show yet.")).toBeTruthy();
    });

    it("uses the caller's node when given", () => {
      render(<TimelinePanel items={[]} emptyState="No snapshots" />);
      expect(screen.getByText("No snapshots")).toBeTruthy();
      expect(screen.queryByText("Nothing to show yet.")).toBeNull();
    });
  });

  describe("animation", () => {
    it("staggers the rows by default", () => {
      const { container } = render(<TimelinePanel items={items} />);
      const rows = container.querySelectorAll(".timeline-row-enter");
      expect(rows).toHaveLength(items.length);
      expect((rows[1] as HTMLElement).style.animationDelay).toBe("45ms");
    });

    it("adds no animation classes or delays when off", () => {
      const { container } = render(
        <TimelinePanel items={items} animate={false} />,
      );
      expect(container.querySelector(".timeline-row-enter")).toBeNull();
      expect(container.querySelector(".timeline-current-pulse")).toBeNull();
    });
  });

  it("forwards actionSize to the row buttons", () => {
    const withAction: TimelinePanelItem[] = [
      { id: "a", title: "First", actions: [{ label: "Revert" }] },
    ];
    const { rerender } = render(
      <TimelinePanel items={withAction} actionSize="sm" />,
    );
    const small = screen.getByRole("button", { name: "Revert" }).className;
    rerender(<TimelinePanel items={withAction} actionSize="xl" />);
    const large = screen.getByRole("button", { name: "Revert" }).className;
    // `actionSize` used to be hardcoded to "sm" with no way to change it.
    expect(small).not.toBe(large);
  });
});

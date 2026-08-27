import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PagedPanel, { PAGED_PANEL_LOADERS } from "./PagedPanel";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const PAGES = [<p key="1">One</p>, <p key="2">Two</p>, <p key="3">Three</p>];

describe("PagedPanel", () => {
  it("shows one page at a time and moves with the nav buttons", () => {
    render(<PagedPanel pages={PAGES} title="T" />);
    expect(screen.getByText("One")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByText("Two")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(screen.getByText("One")).toBeTruthy();
  });

  it("disables the nav at each end", () => {
    render(<PagedPanel pages={PAGES} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Next page"));
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("announces the position politely", () => {
    // Paging used to change the content with no announcement at all.
    render(<PagedPanel pages={PAGES} />);
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("1 / 3");
    expect(status.getAttribute("aria-live")).toBe("polite");
  });

  it("takes a per-page title array", () => {
    render(<PagedPanel pages={PAGES} title={["A", "B", "C"]} />);
    expect(screen.getByText("A")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("clamps when the page list shrinks, without a render-phase setState", () => {
    // The clamp used to run *during render* (`if (safe !== current)
    // setCurrent(...)`), which React re-runs immediately and warns about.
    const warn = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<PagedPanel pages={PAGES} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByText("Three")).toBeTruthy();
    rerender(<PagedPanel pages={[PAGES[0]]} />);
    expect(screen.getByText("One")).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("can be driven as a controlled component", () => {
    const onPageChange = vi.fn();
    render(<PagedPanel pages={PAGES} page={1} onPageChange={onPageChange} />);
    expect(screen.getByText("Two")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
    // Still controlled: it did not move itself.
    expect(screen.getByText("Two")).toBeTruthy();
  });

  it("renders an EmptyState rather than bare text when there are no pages", () => {
    render(<PagedPanel pages={[]} />);
    expect(screen.getByText("No data available.")).toBeTruthy();
  });

  it("renders an EmptyState for an error", () => {
    render(<PagedPanel pages={PAGES} error="Boom" />);
    expect(screen.getByText("Boom")).toBeTruthy();
    expect(screen.queryByText("One")).toBeNull();
  });

  it("hides the nav entirely for a single page", () => {
    render(<PagedPanel pages={[PAGES[0]]} />);
    expect(screen.queryByLabelText("Next page")).toBeNull();
  });

  it("takes every size and tone", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(<PagedPanel pages={PAGES} size={size} />);
      expect(screen.getByLabelText("Next page")).toBeTruthy();
      unmount();
    }
    for (const tone of TRUE_COLORS) {
      const { unmount } = render(<PagedPanel pages={PAGES} tone={tone} />);
      expect(screen.getByLabelText("Next page")).toBeTruthy();
      unmount();
    }
  });

  describe("loading", () => {
    it("offers the kit's three loader types, skeleton by default", () => {
      expect(PAGED_PANEL_LOADERS).toEqual(["skeleton", "spinner", "progress"]);
      const { container } = render(<PagedPanel pages={PAGES} loading />);
      expect(container.innerHTML).toContain("animate-pulse");
    });

    it("draws a spinner and a progress bar when asked", () => {
      const { unmount } = render(
        <PagedPanel pages={PAGES} loading loaderType="spinner" />,
      );
      // The default spinner variant is `segments`, whose animation is an
      // arbitrary-value class — assert the role it publishes, not the class.
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
      unmount();
      render(
        <PagedPanel pages={PAGES} loading loaderType="progress" progress={40} />,
      );
      const bar = screen.getByRole("progressbar");
      expect(bar.getAttribute("aria-valuenow")).toBe("40");
    });

    it("replaces the page while loading, but keeps the header", () => {
      render(<PagedPanel pages={PAGES} loading title="T" />);
      expect(screen.queryByText("One")).toBeNull();
      // The nav is still there, so the panel does not collapse to a spinner.
      expect(screen.getByLabelText("Next page")).toBeTruthy();
      expect(screen.getByText("T")).toBeTruthy();
    });

    it("loads in bare mode too, where Panel's own loader cannot reach", () => {
      // `loading` used to be handed to Panel, so the bare path — which renders
      // no Panel — had no loading treatment at all.
      const { container } = render(<PagedPanel pages={PAGES} loading bare />);
      expect(container.innerHTML).toContain("animate-pulse");
      expect(screen.queryByText("One")).toBeNull();
    });

    it("prefers loading over the empty state", () => {
      render(<PagedPanel pages={[]} loading />);
      expect(screen.queryByText("No data available.")).toBeNull();
    });

    it("takes a custom loading node", () => {
      render(
        <PagedPanel pages={PAGES} loading loadingState={<span>fetching…</span>} />,
      );
      expect(screen.getByText("fetching…")).toBeTruthy();
    });

    it("stops the skeleton under reduced motion", () => {
      const { container } = render(<PagedPanel pages={PAGES} loading />);
      expect(container.innerHTML).toContain("motion-reduce:animate-none");
    });
  });

  it("drops the Panel wrapper when bare", () => {
    const { container } = render(<PagedPanel pages={PAGES} bare />);
    expect(container.innerHTML).not.toContain("shadow");
    expect(screen.getByText("One")).toBeTruthy();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import InfiniteScrollPanel from "./InfiniteScrollPanel";
import { SURFACE_VARIANTS } from "../theme/Theme";

/**
 * jsdom has no IntersectionObserver. This stub records every instance so a
 * test can drive the sentinel directly.
 */
const observers: Array<{ trigger: (isIntersecting: boolean) => void }> = [];

class IO {
  private callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.push({
      trigger: (isIntersecting) =>
        this.callback(
          [{ isIntersecting }] as unknown as IntersectionObserverEntry[],
          this as unknown as IntersectionObserver,
        ),
    });
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", IO);
});

const items = [1, 2, 3];
const renderItem = (item: number) => <div>Item {item}</div>;

const setup = (overrides: Partial<Parameters<typeof InfiniteScrollPanel<number>>[0]> = {}) =>
  render(
    <InfiniteScrollPanel<number>
      items={items}
      hasMore={false}
      onLoadMore={async () => {}}
      renderItem={renderItem}
      {...overrides}
    />,
  );

describe("InfiniteScrollPanel", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = setup({ variant });
      expect(
        container.querySelector(`section[data-variant="${variant}"]`),
      ).not.toBeNull();
    });

    it("renders no card for the plain variant", () => {
      const { container } = setup({ variant: "plain" });
      expect(container.querySelector("section[data-variant]")).toBeNull();
      expect(screen.getByText("Item 1")).toBeTruthy();
    });
  });

  describe("layouts", () => {
    it("preserves order in grid, list and masonry", () => {
      for (const layout of ["grid", "list", "masonry"] as const) {
        const { unmount } = setup({ layout });
        const rendered = screen
          .getAllByText(/^Item \d+$/)
          .map((el) => el.textContent);
        expect(rendered).toEqual(["Item 1", "Item 2", "Item 3"]);
        unmount();
      }
    });

    it("sets an explicit column template rather than a grid-cols class", () => {
      // The old version had a hand-written `grid-cols-1..5` ladder, so a sixth
      // column silently collapsed to one.
      const { container } = setup({ layout: "grid", columnTemplate: "repeat(6, 1fr)" });
      const grid = container.querySelector<HTMLElement>('[style*="grid-template-columns"]');
      expect(grid?.style.gridTemplateColumns).toBe("repeat(6, 1fr)");
    });
  });

  describe("empty and end states", () => {
    it("shows the empty state", () => {
      setup({ items: [] });
      expect(screen.getByText("No items found")).toBeTruthy();
    });

    it("shows a spinner instead while the first page loads", () => {
      setup({ items: [], isLoading: true });
      expect(screen.queryByText("No items found")).toBeNull();
    });

    it("marks the end of the list", () => {
      // The list used to just stop, with nothing to say it was finished.
      setup({ hasMore: false });
      expect(screen.getByText("You have reached the end")).toBeTruthy();
    });

    it("shows the loader instead while more may arrive", () => {
      setup({ hasMore: true });
      expect(screen.getByText("Loading more...")).toBeTruthy();
      expect(screen.queryByText("You have reached the end")).toBeNull();
    });
  });

  describe("fetching", () => {
    it("loads when the sentinel comes into view", async () => {
      const onLoadMore = vi.fn().mockResolvedValue(undefined);
      setup({ hasMore: true, onLoadMore });
      expect(observers.length).toBeGreaterThan(0);

      observers[observers.length - 1].trigger(true);
      await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(1));
    });

    it("does not fire while already loading", async () => {
      const onLoadMore = vi.fn().mockResolvedValue(undefined);
      setup({ hasMore: true, isLoading: true, onLoadMore });
      observers[observers.length - 1]?.trigger(true);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it("keeps fetching until minItems is reached", async () => {
      const onLoadMore = vi.fn().mockResolvedValue(undefined);
      setup({ items: [1], hasMore: true, minItems: 5, onLoadMore });
      await waitFor(() => expect(onLoadMore).toHaveBeenCalled());
    });

    it("does not fetch on minItems once enough are loaded", async () => {
      const onLoadMore = vi.fn().mockResolvedValue(undefined);
      setup({ items: [1, 2, 3], hasMore: true, minItems: 2, onLoadMore });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(onLoadMore).not.toHaveBeenCalled();
    });
  });

  describe("errors", () => {
    it("offers a retry instead of swallowing the failure", async () => {
      // `onLoadMore` rejections used to go to console.error only, so a failed
      // page looked exactly like the end of the list.
      const onError = vi.fn();
      const onLoadMore = vi
        .fn()
        .mockRejectedValueOnce(new Error("boom"))
        .mockResolvedValue(undefined);

      setup({ hasMore: true, onLoadMore, onError });
      observers[observers.length - 1].trigger(true);

      await waitFor(() =>
        expect(screen.getByText("Could not load more items.")).toBeTruthy(),
      );
      expect(onError).toHaveBeenCalled();
      expect(screen.queryByText("Loading more...")).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
      await waitFor(() =>
        expect(screen.queryByText("Could not load more items.")).toBeNull(),
      );
    });
  });

  it("uses getItemKey when given", () => {
    const getItemKey = vi.fn((item: number) => `k-${item}`);
    setup({ getItemKey });
    expect(getItemKey).toHaveBeenCalledTimes(items.length);
  });
});

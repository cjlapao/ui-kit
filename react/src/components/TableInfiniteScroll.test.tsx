import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Table from "./Table";
import type { TableInfiniteScrollState } from "./Table";

const observers: Array<{ trigger: () => void; root: Element | Document | null | undefined; margin: string | undefined; target?: Element; disconnect: ReturnType<typeof vi.fn> }> = [];
beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", class {
    disconnect = vi.fn();
    entry: typeof observers[number];
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.entry = { trigger: () => callback([{ isIntersecting: true }] as IntersectionObserverEntry[], this as unknown as IntersectionObserver), root: options?.root, margin: options?.rootMargin, disconnect: this.disconnect };
      observers.push(this.entry);
    }
    observe(target: Element) { this.entry.target = target; }
  });
});
afterEach(() => vi.unstubAllGlobals());
const rows = [{ id: 1, name: "First" }];
const columns = [{ id: "name", header: "Name", accessor: "name" as const }];
const props = { columns, data: rows, maxHeight: 300, rowKey: (row: typeof rows[number]) => row.id };
const config = (overrides: Partial<TableInfiniteScrollState> = {}): TableInfiniteScrollState => ({ hasMore: true, onLoadMore: vi.fn().mockResolvedValue(undefined), ...overrides });
const trigger = () => act(() => observers[observers.length - 1]!.trigger());

describe("Table infinite scroll", () => {
  it("observes inside the existing body viewport and locks duplicate requests", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const { container, rerender } = render(<Table {...props} infiniteScroll={config({ onLoadMore, rootMargin: 120 })} />);
    const observer = observers[observers.length - 1]!;
    expect(observer.root?.contains(observer.target!)).toBe(true);
    expect(observer.root?.contains(container.querySelector('[data-slot="table-header"]')!)).toBe(false);
    expect(observer.target?.closest("table")).toBeNull();
    expect(observer.margin).toBe("0px 0px 120px 0px");
    act(() => { observer.trigger(); observer.trigger(); });
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByText("First")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Loading more...");
    rerender(<Table {...props} data={[...rows, { id: 2, name: "Second" }]} infiniteScroll={config({ onLoadMore })} />);
    await act(async () => resolve());
    trigger();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    await act(async () => resolve());
    expect(screen.getByText("Second")).toBeTruthy();
  });

  it("stops automatic loading after a page adds no rows", async () => {
    const state = config();
    render(<Table {...props} infiniteScroll={state} />);
    trigger();
    await waitFor(() => expect(screen.getByRole("button", { name: "Load more" })).toBeTruthy());
    trigger();
    expect(state.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("retains rows on failure and retries explicitly", async () => {
    const onError = vi.fn();
    const onLoadMore = vi.fn().mockRejectedValueOnce(false).mockResolvedValue(undefined);
    render(<Table {...props} infiniteScroll={config({ onLoadMore, onError })} />);
    trigger();
    await waitFor(() => expect(screen.getByText("Could not load more items.")).toBeTruthy());
    expect(screen.getByText("First")).toBeTruthy();
    expect(onError).toHaveBeenCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
  });

  it("blocks initial loading and stops at exhaustion", async () => {
    const state = config();
    const { rerender } = render(<Table {...props} loading infiniteScroll={state} />);
    expect(observers).toHaveLength(0);
    expect(state.onLoadMore).not.toHaveBeenCalled();
    rerender(<Table {...props} infiniteScroll={{ ...state, hasMore: false }} />);
    expect(screen.getByText("You have reached the end")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("resets scroll, ignores stale failures and waits for the previous request", async () => {
    let reject!: (error: Error) => void;
    const onError = vi.fn();
    const onLoadMore = vi.fn().mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail; })).mockResolvedValue(undefined);
    const state = config({ onLoadMore, onError, resetKey: "old" });
    const { rerender } = render(<Table {...props} infiniteScroll={state} />);
    const root = observers[observers.length - 1]!.root as HTMLDivElement;
    root.scrollTop = 120;
    trigger();
    rerender(<Table {...props} infiniteScroll={{ ...state, resetKey: "new" }} />);
    expect(root.scrollTop).toBe(0);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await act(async () => reject(new Error("stale")));
    expect(onError).not.toHaveBeenCalled();
    expect(screen.queryByText("Could not load more items.")).toBeNull();
    trigger();
    await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
  });

  it("keeps the request lock when switching between table and panel views", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const { container } = render(<Table {...props} panelItem={(row) => <div>{row.name} card</div>} infiniteScroll={config({ onLoadMore })} />);
    trigger();
    fireEvent.click(screen.getByRole("button", { name: "Switch to panel view" }));
    expect(screen.getByText("First card")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Loading more...");
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await act(async () => resolve());
    const observer = observers[observers.length - 1]!;
    expect(observer.root?.contains(container.querySelector('[data-slot="table-infinite-scroll"]')!)).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    await act(async () => resolve());
  });

  it("clears failed state when resetKey changes", async () => {
    const state = config({ onLoadMore: vi.fn().mockRejectedValue(new Error("failed")), resetKey: 0 });
    const { rerender } = render(<Table {...props} infiniteScroll={state} />);
    trigger();
    await waitFor(() => expect(screen.getByText("Could not load more items.")).toBeTruthy());
    rerender(<Table {...props} infiniteScroll={{ ...state, resetKey: 1 }} />);
    expect(screen.queryByText("Could not load more items.")).toBeNull();
    expect(screen.getByRole("button", { name: "Load more" })).toBeTruthy();
  });

  it("disconnects on unmount", () => {
    const { unmount } = render(<Table {...props} infiniteScroll={config()} />);
    const observer = observers[observers.length - 1]!;
    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
    observer.trigger();
  });

  it("keeps pagination by default and hides it in infinite mode while preserving custom footers", () => {
    const pagination = { page: 1, pageSize: 20, total: 100, onPageChange: vi.fn(), onPageSizeChange: vi.fn() };
    const { rerender } = render(<Table {...props} pagination={pagination} />);
    expect(screen.getByText(/Page 1 of 5/)).toBeTruthy();
    rerender(<Table {...props} pagination={pagination} infiniteScroll={config()} />);
    expect(screen.queryByText(/Page 1 of 5/)).toBeNull();
    rerender(<Table {...props} footer="Custom footer" pagination={pagination} infiniteScroll={config()} />);
    expect(screen.getByText("Custom footer")).toBeTruthy();
  });

  it("provides manual loading without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const state = config();
    render(<Table {...props} infiniteScroll={state} />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    await waitFor(() => expect(state.onLoadMore).toHaveBeenCalledTimes(1));
  });
});

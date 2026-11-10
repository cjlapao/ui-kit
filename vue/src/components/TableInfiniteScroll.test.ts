import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Table from "./Table.vue";
import InfiniteScrollPanel from "./InfiniteScrollPanel.vue";
import type { TableProps, TableInfiniteScrollState } from "./Table.vue";

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
const config = (overrides: Partial<TableInfiniteScrollState> = {}): TableInfiniteScrollState => ({ hasMore: true, onLoadMore: vi.fn().mockResolvedValue(undefined), ...overrides });
const wrappers: Array<{ unmount: () => void }> = [];
const setup = (overrides: Partial<TableProps<typeof rows[number]>> = {}) => {
  const wrapper = mount(Table as any, { props: { columns: [{ id: "name", header: "Name", accessor: "name" }], data: rows, maxHeight: 300, ...overrides } });
  wrappers.push(wrapper);
  return wrapper;
};
afterEach(() => { wrappers.splice(0).forEach((wrapper) => wrapper.unmount()); });
const button = (wrapper: ReturnType<typeof setup>, text: string) => wrapper.findAll("button").find((node) => node.text() === text)!;

describe("Table infinite scroll", () => {
  it("observes inside the body viewport and locks duplicate requests", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const wrapper = setup({ infiniteScroll: config({ onLoadMore, rootMargin: 120 }) });
    await flushPromises();
    const observer = observers[observers.length - 1]!;
    expect(observer.root?.contains(observer.target!)).toBe(true);
    expect(observer.target?.closest("table")).toBeNull();
    expect(observer.margin).toBe("0px 0px 120px 0px");
    observer.trigger(); observer.trigger();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ data: [...rows, { id: 2, name: "Second" }] });
    expect(wrapper.text()).toContain("First");
    expect(wrapper.text()).toContain("Loading more...");
    resolve(); await flushPromises();
    observers[observers.length - 1]!.trigger();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    resolve(); await flushPromises();
    expect(wrapper.text()).toContain("Second");
  });

  it("stops automatic loading when a page adds no rows", async () => {
    const state = config();
    setup({ infiniteScroll: state }); await flushPromises();
    observers[observers.length - 1]!.trigger(); await flushPromises();
    observers[observers.length - 1]!.trigger(); await flushPromises();
    expect(state.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("retains rows on failure and retries explicitly", async () => {
    const onError = vi.fn();
    const onLoadMore = vi.fn().mockRejectedValueOnce(false).mockResolvedValue(undefined);
    const wrapper = setup({ infiniteScroll: config({ onLoadMore, onError }) });
    await flushPromises(); observers[observers.length - 1]!.trigger(); await flushPromises();
    expect(wrapper.text()).toContain("Could not load more items.");
    expect(wrapper.text()).toContain("First");
    expect(onError).toHaveBeenCalledWith(false);
    await button(wrapper, "Try again").trigger("click"); await flushPromises();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).not.toContain("Could not load more items.");
  });

  it("suppresses initial loading and stops at exhaustion", async () => {
    const state = config();
    const wrapper = setup({ infiniteScroll: state, loading: true });
    await flushPromises(); expect(observers).toHaveLength(0);
    expect(state.onLoadMore).not.toHaveBeenCalled();
    await wrapper.setProps({ loading: false, infiniteScroll: { ...state, hasMore: false } });
    expect(wrapper.text()).toContain("You have reached the end");
    expect(button(wrapper, "Load more")).toBeUndefined();
  });

  it("resets scroll and ignores old failures while preserving the request lock", async () => {
    let reject!: (error: Error) => void;
    const onError = vi.fn();
    const onLoadMore = vi.fn().mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail; })).mockResolvedValue(undefined);
    const state = config({ onLoadMore, onError, resetKey: "old" });
    const wrapper = setup({ infiniteScroll: state }); await flushPromises();
    const root = observers[observers.length - 1]!.root as HTMLDivElement;
    root.scrollTop = 120;
    observers[observers.length - 1]!.trigger();
    await wrapper.setProps({ infiniteScroll: { ...state, resetKey: "new" } });
    expect(root.scrollTop).toBe(0);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    reject(new Error("stale")); await flushPromises();
    expect(onError).not.toHaveBeenCalled();
    expect(wrapper.text()).not.toContain("Could not load more items.");
    observers[observers.length - 1]!.trigger(); await flushPromises();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("keeps the request lock when switching between table and panel views", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const wrapper = setup({ infiniteScroll: config({ onLoadMore }), panelItem: (row) => row.name + " card" });
    await flushPromises();
    observers[observers.length - 1]!.trigger();
    await wrapper.find('[aria-label="Switch to panel view"]').trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("First card");
    expect(wrapper.text()).toContain("Loading more...");
    expect(button(wrapper, "Load more")).toBeUndefined();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    resolve(); await flushPromises();
    const observer = observers[observers.length - 1]!;
    expect(observer.root?.contains(observer.target!)).toBe(true);
    await button(wrapper, "Load more").trigger("click");
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    resolve(); await flushPromises();
  });

  it("clears failures when resetKey changes", async () => {
    const state = config({ onLoadMore: vi.fn().mockRejectedValue(new Error("failed")), resetKey: 0 });
    const wrapper = setup({ infiniteScroll: state }); await flushPromises();
    observers[observers.length - 1]!.trigger(); await flushPromises();
    expect(wrapper.text()).toContain("Could not load more items.");
    await wrapper.setProps({ infiniteScroll: { ...state, resetKey: 1 } });
    expect(wrapper.text()).not.toContain("Could not load more items.");
    expect(button(wrapper, "Load more")).toBeTruthy();
  });

  it("disconnects on unmount", async () => {
    const state = config();
    const wrapper = setup({ infiniteScroll: state }); await flushPromises();
    const observer = observers[observers.length - 1]!;
    wrapper.unmount(); wrappers.pop();
    expect(observer.disconnect).toHaveBeenCalled();
    observer.trigger();
    expect(state.onLoadMore).not.toHaveBeenCalled();
  });

  it("preserves pagination and custom footers", async () => {
    const pagination = { page: 1, pageSize: 20, total: 100, onPageChange: vi.fn(), onPageSizeChange: vi.fn() };
    const wrapper = setup({ pagination });
    expect(wrapper.text()).toContain("Page 1 of 5");
    await wrapper.setProps({ infiniteScroll: config() });
    expect(wrapper.text()).not.toContain("Page 1 of 5");
    await wrapper.setProps({ footer: "Custom footer" });
    expect(wrapper.text()).toContain("Custom footer");
  });

  it("supports manual loading without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const state = config();
    const wrapper = setup({ infiniteScroll: state }); await flushPromises();
    await button(wrapper, "Load more").trigger("click"); await flushPromises();
    expect(state.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("shares panel loading, retry and minItems behavior", async () => {
    const onLoadMore = vi.fn().mockRejectedValueOnce(false).mockResolvedValue(undefined);
    const wrapper = mount(InfiniteScrollPanel as any, { props: { items: [1], hasMore: true, onLoadMore, minItems: 2, layout: "list" }, slots: { renderItem: "Item" } });
    wrappers.push(wrapper);
    await flushPromises();
    expect(wrapper.text()).toContain("Could not load more items.");
    await wrapper.findAll("button").find((node) => node.text() === "Try again")!.trigger("click");
    await flushPromises();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });
});

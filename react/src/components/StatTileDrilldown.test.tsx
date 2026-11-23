import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StatCard from "./StatCard";
import {
  usePagedFetcher,
  type PagedFetcherPage,
} from "../hooks/usePagedFetcher";

afterEach(cleanup);

/* ------------------------------------------------------------------ */
/*  The fake API                                                        */
/* ------------------------------------------------------------------ */

interface AlertItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: "Warning" | "Info" | "Error";
  count?: number;
}

const alerts = (from: number, to: number): AlertItem[] =>
  Array.from({ length: to - from }, (_, i) => ({
    id: `a${from + i}`,
    title: `Alert ${from + i}`,
    subtitle: `detail ${from + i}`,
    icon: "Warning",
    count: from + i,
  }));

/** A paged endpoint over `alerts`, recording every call. */
const makeApi = (
  total = 45,
  opts: { failFirst?: boolean } = {},
) => {
  const calls: { page: number; pageSize: number }[] = [];
  let firstFailed = !opts.failFirst;
  const fetchItems = vi.fn(
    async ({
      page,
      pageSize,
    }: {
      page: number;
      pageSize: number;
      signal: AbortSignal;
    }): Promise<PagedFetcherPage<AlertItem>> => {
      calls.push({ page, pageSize });
      if (!firstFailed && page === 0) {
        firstFailed = true;
        throw new Error("boom");
      }
      const start = page * pageSize;
      const items = alerts(start, Math.min(start + pageSize, total));
      return { items, hasMore: start + pageSize < total, total };
    },
  );
  return { fetchItems, calls };
};

/* ------------------------------------------------------------------ */
/*  usePagedFetcher                                                     */
/* ------------------------------------------------------------------ */

describe("usePagedFetcher", () => {
  it("fetches nothing until enabled, then exactly one page 0", async () => {
    const { fetchItems, calls } = makeApi();
    const { rerender } = renderHook(
      ({ enabled }) =>
        usePagedFetcher<AlertItem>({ fetchItems, pageSize: 10, enabled }),
      { initialProps: { enabled: false } },
    );
    expect(fetchItems).not.toHaveBeenCalled();

    rerender({ enabled: true });
    rerender({ enabled: true });
    await waitFor(() => expect(calls).toEqual([{ page: 0, pageSize: 10 }]));
  });

  it("appends pages through loadMore and stops at hasMore=false", async () => {
    const { fetchItems, calls } = makeApi(25);
    const { result } = renderHook(() =>
      usePagedFetcher<AlertItem>({ fetchItems, pageSize: 10, enabled: true }),
    );
    await waitFor(() => expect(result.current.items).toHaveLength(10));

    await act(() => result.current.loadMore());
    expect(calls[1]).toEqual({ page: 1, pageSize: 10 });
    expect(result.current.items).toHaveLength(20);
    expect(result.current.hasMore).toBe(true);

    await act(() => result.current.loadMore());
    expect(result.current.items).toHaveLength(25);
    expect(result.current.hasMore).toBe(false);

    // The sentinel may still fire once more — the guard must not call the API.
    const before = calls.length;
    await act(() => result.current.loadMore());
    expect(calls).toHaveLength(before);
  });

  it("refetches from page 0 when reloadKey changes", async () => {
    const { fetchItems, calls } = makeApi();
    const { rerender } = renderHook(
      ({ reloadKey }) =>
        usePagedFetcher<AlertItem>({
          fetchItems,
          pageSize: 10,
          enabled: true,
          reloadKey,
        }),
      { initialProps: { reloadKey: "a" } },
    );
    await waitFor(() => expect(calls).toHaveLength(1));
    rerender({ reloadKey: "b" });
    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].page).toBe(0);
  });

  it("reports a first-page failure and refetches on reload", async () => {
    const { fetchItems, calls } = makeApi(45, { failFirst: true });
    const { result } = renderHook(() =>
      usePagedFetcher<AlertItem>({ fetchItems, pageSize: 10, enabled: true }),
    );
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.items).toHaveLength(0);

    act(() => result.current.reload());
    await waitFor(() => expect(result.current.items).toHaveLength(10));
    expect(result.current.error).toBeNull();
    expect(calls.map((c) => c.page)).toEqual([0, 0]);
  });

  it("discards a stale page-0 response after a reloadKey swap", async () => {
    const resolvers: ((page: PagedFetcherPage<AlertItem>) => void)[] = [];
    const fetchItems = vi.fn(
      () =>
        new Promise<PagedFetcherPage<AlertItem>>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const { rerender, result } = renderHook(
      ({ reloadKey }) =>
        usePagedFetcher<AlertItem>({ fetchItems, pageSize: 10, reloadKey }),
      { initialProps: { reloadKey: "one" as string | number } },
    );
    await waitFor(() => expect(fetchItems).toHaveBeenCalledTimes(1));

    // Swap the key while page 0 is still in flight, then let the stale
    // request resolve late.
    rerender({ reloadKey: "two" });
    await waitFor(() => expect(fetchItems).toHaveBeenCalledTimes(2));
    await act(async () =>
      resolvers[0]({ items: alerts(999, 1000), hasMore: false }),
    );
    expect(result.current.items).toHaveLength(0); // stale — discarded

    await act(async () =>
      resolvers[1]({ items: alerts(0, 1), hasMore: false }),
    );
    expect(result.current.items.map((i) => i.id)).toEqual(["a0"]);
  });
});

/* ------------------------------------------------------------------ */
/*  StatCard integration                                                */
/* ------------------------------------------------------------------ */

/*
 * jsdom reports every box as zero-sized, which makes the Popover skip
 * positioning and keep the overlay `visibility: hidden` (role queries then
 * skip it); a prototype-level rect mock gives every element a box, exactly
 * like the Popover's own tests.
 */
const makeRect = (): DOMRect => {
  const top = 400;
  const left = 400;
  const width = 300;
  const height = 160;
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
};

const DEFAULT_RECT = makeRect();

beforeEach(() => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    () => DEFAULT_RECT,
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/*
 * jsdom fires no `animationend`, so the Popover's phase machine would strand
 * the overlay in `entering` (where it stays `visibility: hidden` and role
 * queries skip it). Same helper the Popover's own tests use.
 */
const completeOverlayPhase = async (
  wrapper: Element,
  phase: "entering" | "leaving",
) => {
  await act(async () => {
    const animationName =
      phase === "entering" ? "popover-overlay-enter" : "popover-overlay-leave";
    for (const type of ["animationend", "webkitAnimationEnd"]) {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, "animationName", { value: animationName });
      wrapper.dispatchEvent(event);
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
};

const overlay = () => document.querySelector<HTMLElement>(".popover-overlay");

/** Clicks the tile and drives the overlay through its enter animation. */
const openByClick = async () => {
  fireEvent.click(screen.getByRole("button", { name: /Needs you/ }));
  const wrapper = overlay();
  expect(wrapper).not.toBeNull();
  await completeOverlayPhase(wrapper as Element, "entering");
};

const dialog = () => screen.queryByRole("dialog");

const renderCard = (props: React.ComponentProps<typeof StatCard>) =>
  render(<StatCard label="Needs you" value={3} {...props} />);

describe("StatCard drilldown", () => {
  it("does not fetch and is activatable while closed", () => {
    const { fetchItems } = makeApi();
    renderCard({ drilldown: { fetchItems } });
    const card = screen.getByRole("button", { name: /Needs you/ });
    expect(card).toHaveAttribute("aria-haspopup", "dialog");
    expect(card).toHaveAttribute("aria-expanded", "false");
    expect(fetchItems).not.toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });

  it("opens on tile click and renders header, rows and counts", async () => {
    const { fetchItems } = makeApi(45);
    renderCard({
      drilldown: { fetchItems, title: "Needs you — oldest first", pageSize: 10 },
    });
    await openByClick();

    const box = dialog() as HTMLElement;
    expect(box).not.toBeNull();
    expect(
      within(box).getByText("Needs you — oldest first"),
    ).toBeInTheDocument();
    // total chip + 10 rows
    expect(within(box).getByText("45")).toBeInTheDocument();
    expect(within(box).getByText("Alert 0")).toBeInTheDocument();
    // No `onItemClick`: rows are plain rows, not buttons.
    expect(within(box).queryAllByRole("button")).toHaveLength(0);
    expect(box.querySelectorAll(".stat-drilldown-row")).toHaveLength(10);
    // header total + 10 row-count pills (excluding any load-more spinner)
    expect(
      box.querySelectorAll(".stat-drilldown-row span.rounded-full"),
    ).toHaveLength(10);
  });

  it("shows skeleton rows while the first page loads", async () => {
    let release: (page: PagedFetcherPage<AlertItem>) => void = () => {};
    const fetchItems = vi.fn(
      () =>
        new Promise<PagedFetcherPage<AlertItem>>((resolve) => {
          release = resolve;
        }),
    );
    renderCard({ drilldown: { fetchItems } });
    await openByClick();

    const box = dialog() as HTMLElement;
    expect(box).not.toBeNull();
    expect(box.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    await act(async () => release({ items: alerts(0, 1), hasMore: false }));
    await waitFor(() =>
      expect(
        within(dialog() as HTMLElement).getByText("Alert 0"),
      ).toBeInTheDocument(),
    );
  });

  it("fires onItemClick with the row's item and keeps onClick unfired", async () => {
    const { fetchItems } = makeApi(45);
    const onItemClick = vi.fn();
    const onClick = vi.fn();
    renderCard({ onClick, drilldown: { fetchItems, onItemClick, pageSize: 10 } });
    await openByClick();

    const box = dialog() as HTMLElement;
    await waitFor(() =>
      expect(within(box).getByText("Alert 3")).toBeInTheDocument(),
    );
    fireEvent.click(within(box).getByText("Alert 3"));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect((onItemClick.mock.calls[0] as [AlertItem, number])[0].id).toBe("a3");
    expect(onItemClick.mock.calls[0][1]).toBe(3);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("opens from the keyboard (Enter) and closes on Escape", async () => {
    const { fetchItems } = makeApi();
    const onOpenChange = vi.fn();
    renderCard({ drilldown: { fetchItems, onOpenChange } });
    const card = screen.getByRole("button", { name: /Needs you/ });

    fireEvent.keyDown(card, { key: "Enter" });
    const wrapper = overlay();
    expect(wrapper).not.toBeNull();
    await completeOverlayPhase(wrapper as Element, "entering");
    expect(dialog()).not.toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
    await waitFor(() =>
      expect(card).toHaveAttribute("aria-expanded", "false"),
    );
  });

  it("refetches on the retry button after a first-page failure", async () => {
    const { fetchItems } = makeApi(45, { failFirst: true });
    renderCard({ drilldown: { fetchItems, pageSize: 10 } });
    await openByClick();

    const box = dialog() as HTMLElement;
    await waitFor(() =>
      expect(
        within(box).getByText(/Couldn't load/),
      ).toBeInTheDocument(),
    );
    fireEvent.click(
      within(box).getByRole("button", { name: /Try again/ }),
    );
    await waitFor(() =>
      expect(
        within(dialog() as HTMLElement).getByText("Alert 0"),
      ).toBeInTheDocument(),
    );
    expect(fetchItems).toHaveBeenCalledTimes(2);
  });

  it("renders the footer above the end marker when the list is exhausted", async () => {
    const { fetchItems } = makeApi(3);
    renderCard({
      drilldown: {
        fetchItems,
        pageSize: 10,
        footer: <button type="button">View all alerts</button>,
      },
    });
    await openByClick();

    const box = dialog() as HTMLElement;
    await waitFor(() =>
      expect(within(box).getByText("Alert 2")).toBeInTheDocument(),
    );
    expect(
      within(box).getByText("You're all caught up"),
    ).toBeInTheDocument();
    expect(
      within(box).getByRole("button", { name: "View all alerts" }),
    ).toBeInTheDocument();
  });

  it("uses a custom renderItem when given", async () => {
    const { fetchItems } = makeApi(45);
    renderCard({
      drilldown: {
        fetchItems,
        pageSize: 10,
        renderItem: (item) => <span>custom {item.id}</span>,
      },
    });
    await openByClick();

    const box = dialog() as HTMLElement;
    await waitFor(() =>
      expect(within(box).getByText("custom a0")).toBeInTheDocument(),
    );
    expect(within(box).queryByText("Alert 0")).toBeNull();
  });

  it("closes fully and refetches fresh on reopen", async () => {
    // The Popover unmounts the overlay when its leave animation ends, so the
    // fetcher unmounts too — reopening the alerts list is a fresh pull, which
    // is the right trade for a "Needs you" tile.
    const { fetchItems, calls } = makeApi(45);
    renderCard({ drilldown: { fetchItems, pageSize: 10 } });
    await openByClick();
    expect(dialog()).not.toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    const leaving = overlay();
    expect(leaving).not.toBeNull();
    await completeOverlayPhase(leaving as Element, "leaving");
    await waitFor(() => expect(overlay()).toBeNull());
    expect(screen.getByRole("button", { name: /Needs you/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await openByClick();
    expect(dialog()).not.toBeNull();
    expect(calls.filter((c) => c.page === 0)).toHaveLength(2);
    await waitFor(() =>
      expect(
        within(dialog() as HTMLElement).getByText("Alert 0"),
      ).toBeInTheDocument(),
    );
  });

  it("stretches the panel to the tile when matchTileWidth is set", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({
      drilldown: { fetchItems, pageSize: 4, matchTileWidth: true },
    });
    await openByClick();
    const wrapper = overlay() as HTMLElement;
    // The mocked trigger box is 300 wide — the panel takes it, before the
    // position pass measures the wrapper.
    expect(wrapper.style.width).toBe("300px");
    // The 320px content floor is dropped, so it cannot outvote the tile.
    const panel = (dialog() as HTMLElement).querySelector(
      ".stat-drilldown-panel",
    ) as HTMLElement;
    expect(panel.style.minWidth).toBe("0px");
  });

  it("leaves the content floor in place when matchTileWidth is set with a minWidth", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({
      drilldown: {
        fetchItems,
        pageSize: 4,
        matchTileWidth: true,
        minWidth: 360,
      },
    });
    await openByClick();
    // CSS min-width wins over the inline width — a narrow tile never
    // squeezes an item that needs room.
    const panel = (dialog() as HTMLElement).querySelector(
      ".stat-drilldown-panel",
    ) as HTMLElement;
    expect(panel.style.minWidth).toBe("360px");
  });

  it("customizes the overlay surface, corner and padding", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({
      drilldown: {
        fetchItems,
        pageSize: 4,
        corner: "rounded-xl",
        padding: "md",
      },
    });
    await openByClick();
    const box = dialog() as HTMLElement;
    // `role=dialog` sits on the overlay wrapper; the corner rides the Panel
    // card inside it.
    expect(box.querySelector('[class*="rounded-4xl"]')).not.toBeNull();
    // The overlay's own inset around the panel, on the shared scale.
    expect(box.querySelector(".p-6")).not.toBeNull();
  });

  it("opens with the snug rounded-sm corner by default", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({ drilldown: { fetchItems, pageSize: 4 } });
    await openByClick();
    const box = dialog() as HTMLElement;
    // The `rounded-sm` token maps up the scale to the `rounded-lg` class —
    // the menu reads as a snug card, not the deep container radius.
    expect(box.querySelector('[class*="rounded-lg"]')).not.toBeNull();
    expect(box.querySelector('[class*="rounded-3xl"]')).toBeNull();
  });

  it("opens at the given width and adapts it to the room the kept edge has", async () => {
    const { fetchItems } = makeApi(12);
    // The mocked tile sits at left 400, 300 wide; the viewport is 1024.
    // `start` keeps the left edge, so the room runs to the right edge:
    // 1024 − 8 − 400 = 616 — the 900 request narrows, it does not slide.
    renderCard({ drilldown: { fetchItems, pageSize: 4, width: 900 } });
    await openByClick();
    expect((overlay() as HTMLElement).style.width).toBe("616px");
    expect((overlay() as HTMLElement).style.left).toBe("400px");
  });

  it("pins the trailing edge when align is end", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({
      drilldown: { fetchItems, pageSize: 4, width: 900, align: "end" },
    });
    await openByClick();
    // Room to the tile's right edge: 700 − 8 = 692; the box hangs left
    // from that pinned edge.
    expect((overlay() as HTMLElement).style.width).toBe("692px");
    expect((overlay() as HTMLElement).style.left).toBe("8px");
  });

  it("centres the menu on the tile when align is center", async () => {
    const { fetchItems } = makeApi(12);
    renderCard({
      drilldown: { fetchItems, pageSize: 4, width: 900, align: "center" },
    });
    await openByClick();
    // 900 fits symmetrically about the tile's centre (550): 550 − 450.
    expect((overlay() as HTMLElement).style.width).toBe("900px");
    expect((overlay() as HTMLElement).style.left).toBe("100px");
  });

  it("floors the list area with minHeight", async () => {
    const { fetchItems } = makeApi(2);
    renderCard({ drilldown: { fetchItems, pageSize: 2, minHeight: 240 } });
    await openByClick();
    await waitFor(() =>
      expect(
        within(dialog() as HTMLElement).getByText("Alert 0"),
      ).toBeInTheDocument(),
    );
    const scroller = (dialog() as HTMLElement).querySelector(
      '[data-slot="scrollarea"]',
    ) as HTMLElement;
    expect(scroller.style.minHeight).toBe("240px");
  });

  it("keeps the card square when square is set", () => {
    const { fetchItems } = makeApi(12);
    renderCard({ drilldown: { fetchItems }, square: true });
    // The tile is the trigger; its height must follow its width so a wide
    // stage does not stretch it into a banner.
    expect(
      screen.getByRole("button", { name: /Needs you/ }),
    ).toHaveClass("aspect-square");
  });
});

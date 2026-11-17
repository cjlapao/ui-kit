import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { getButtonColorClasses, getSurfaceVariantClasses } from "../theme";
import ActivityFeed, { type ActivityFeedItem, type ActivityFeedProps } from "./ActivityFeed";

const items: ActivityFeedItem[] = [
  {
    id: "1",
    title: "deployed the release",
    actor: "Ada",
    timestamp: "3m ago",
    tone: "green",
    category: "deploys",
    code: "#412",
  },
  {
    id: "2",
    title: "flagged a slow query",
    actor: "Bot",
    timestamp: "1h ago",
    tone: "amber",
    category: "alerts",
    count: 3,
  },
  { id: "3", title: "joined the workspace", actor: "Grace", timestamp: "2h ago", tone: "blue" },
];

/**
 * jsdom has no IntersectionObserver. This stub records every instance so a
 * test can drive the sentinel directly (same shape the InfiniteScrollPanel
 * suite uses).
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ActivityFeed", () => {
  it("renders the default title and every item", () => {
    render(<ActivityFeed items={items} />);
    expect(screen.getByText("Recent activity")).toBeInTheDocument();
    expect(screen.getByText(/deployed the release/)).toBeInTheDocument();
    expect(screen.getByText(/flagged a slow query/)).toBeInTheDocument();
    expect(screen.getByText(/joined the workspace/)).toBeInTheDocument();
    expect(screen.getByText("#412")).toBeInTheDocument();
    expect(screen.getByText("3m ago")).toBeInTheDocument();
  });

  it("filters through the segment control, prepending All", () => {
    const onFilterChange = vi.fn();
    render(
      <ActivityFeed
        items={items}
        filters={[
          { label: "Deploys", value: "deploys" },
          { label: "Alerts", value: "alerts" },
        ]}
        onFilterChange={onFilterChange}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Alerts" }));
    expect(onFilterChange).toHaveBeenCalledWith("alerts");
    expect(screen.queryByText(/deployed the release/)).not.toBeInTheDocument();
    // Untoned-for-the-filter items fall back to tone matching via category;
    // item 3 has no category, so it only shows under All.
    fireEvent.click(screen.getByRole("radio", { name: "All" }));
    expect(screen.getByText(/joined the workspace/)).toBeInTheDocument();
  });

  it("shows the aggregate badge for counted entries", () => {
    render(<ActivityFeed items={items} />);
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("renders the load-more tail only with both parts and fires it", () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<ActivityFeed items={items} onLoadMore={onLoadMore} />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    rerender(<ActivityFeed items={items} onLoadMore={onLoadMore} hasMore />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state when a filter leaves nothing", () => {
    render(
      <ActivityFeed
        items={[{ id: "x", title: "did a thing", timestamp: "now", category: "deploys" }]}
        filters={[{ label: "Alerts", value: "alerts" }]}
        defaultFilter="alerts"
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders the header tag and link", () => {
    const onLink = vi.fn();
    render(
      <ActivityFeed
        items={items}
        tag="main"
        linkLabel="Full audit log"
        onLink={onLink}
        totalCount={98}
      />,
    );
    expect(screen.getByText("main")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Full audit log/ }));
    expect(onLink).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/98/)).toBeInTheDocument();
  });

  it("lets a toned card speak through the whole feed", () => {
    const { container } = render(
      <ActivityFeed
        items={[{ id: "quiet", title: "Quiet entry", timestamp: "now" }, ...items]}
        tone="amber"
        variant="elevated"
        linkLabel="Full audit log"
        onLink={vi.fn()}
      />,
    );
    // An untoned entry adopts the card's tone...
    expect(container.querySelector('[aria-hidden="true"].bg-amber-500')).toBeInTheDocument();
    // ...and the CTA wears both the surface's button (elevated -> solid) and its tone.
    const cta = screen.getByRole("button", { name: /Full audit log/ });
    expect(cta.className).toContain(getButtonColorClasses("solid", "amber").split(" ")[0]);
  });

  it("defaults every control to what the card's variant implies", () => {
    const { container } = render(
      <ActivityFeed
        items={items}
        linkLabel="Full audit log"
        onLink={vi.fn()}
        hasMore
        onLoadMore={vi.fn()}
        filters={[{ value: "deploys", label: "Deploys" }]}
      />,
    );
    const implied = getButtonColorClasses("outline", "blue").split(" ")[0];
    expect(screen.getByRole("button", { name: /Full audit log/ }).className).toContain(implied);
    expect(screen.getByRole("button", { name: /Load more/ }).className).toContain(implied);
    // The filter track wears the card's own surface vocabulary.
    expect(
      container.querySelector('[role="radiogroup"]')!.className,
    ).toContain(getSurfaceVariantClasses("outlined", "blue").split(" ")[0]);
  });

  it("merges className onto the card surface", () => {
    const { container } = render(<ActivityFeed items={items} className="feed-x" />);
    expect(container.querySelector(".feed-x")).toBeInTheDocument();
  });
  it("keeps the row rhythm while loading", () => {
    const { container } = render(<ActivityFeed items={items} title="Deploy stream" loading hasMore onLoadMore={vi.fn()} />);
    expect(screen.getByText("Deploy stream")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.queryByText(/rotated the signing keys/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Load more/ })).not.toBeInTheDocument();
  });

  describe("controlsTone", () => {
    const withControls: Partial<ActivityFeedProps> = {
      tag: "t",
      linkLabel: "Full audit log",
      onLink: vi.fn(),
      hasMore: true,
      onLoadMore: vi.fn(),
      filters: [{ label: "Alerts", value: "alerts" }],
    };

    it("inherits the controls' own defaults on an untoned card", () => {
      const { container } = render(<ActivityFeed items={items} {...withControls} />);
      const blue = getButtonColorClasses("outline", "blue").split(" ")[0];
      expect(screen.getByRole("button", { name: /Load more/ }).className).toContain(blue);
      expect(container.innerHTML).toContain("bg-blue-50");
    });

    it("dresses the filter, both buttons and the pill in the chosen tone", () => {
      const { container } = render(
        <ActivityFeed items={items} {...withControls} controlsTone="amber" />,
      );
      const amber = getButtonColorClasses("outline", "amber").split(" ")[0];
      expect(screen.getByRole("button", { name: /Load more/ }).className).toContain(amber);
      expect(screen.getByRole("button", { name: /Full audit log/ }).className).toContain(amber);
      expect(container.querySelector('[role="radiogroup"]')!.outerHTML).toContain("amber");
      expect(container.innerHTML).toContain("bg-amber-50");
    });

    it("wins over the card's own tone", () => {
      render(
        <ActivityFeed items={items} {...withControls} tone="violet" controlsTone="amber" />,
      );
      const amber = getButtonColorClasses("outline", "amber").split(" ")[0];
      const btn = screen.getByRole("button", { name: /Load more/ });
      expect(btn.className).toContain(amber);
      expect(btn.className).not.toContain("violet");
    });

    it("can be deliberately grey with an explicit neutral", () => {
      render(<ActivityFeed items={items} {...withControls} controlsTone="neutral" />);
      const grey = getButtonColorClasses("outline", "neutral").split(" ")[0];
      expect(screen.getByRole("button", { name: /Load more/ }).className).toContain(grey);
    });

    it("filterTone moves only the filter", () => {
      const { container } = render(
        <ActivityFeed items={items} {...withControls} controlsTone="amber" filterTone="emerald" />,
      );
      expect(container.querySelector('[role="radiogroup"]')!.outerHTML).toContain("emerald");
      const btn = screen.getByRole("button", { name: /Load more/ });
      expect(btn.className).toContain(getButtonColorClasses("outline", "amber").split(" ")[0]);
      expect(btn.className).not.toContain("emerald");
    });

    it("filterTone reaches the filter on an untoned card, leaving the buttons default", () => {
      const { container } = render(
        <ActivityFeed items={items} {...withControls} filterTone="rose" />,
      );
      expect(container.querySelector('[role="radiogroup"]')!.outerHTML).toContain("rose");
      expect(screen.getByRole("button", { name: /Load more/ }).className).toContain(
        getButtonColorClasses("outline", "blue").split(" ")[0],
      );
    });
  });

  describe("infinite loading (loadMode)", () => {
    it("watches a sentinel inside the capped body instead of a button", () => {
      render(
        <ActivityFeed items={items} maxHeight={240} hasMore onLoadMore={vi.fn()} />,
      );
      // Infinite is the default: no button tail, but a live observer.
      expect(screen.queryByRole("button", { name: /Load more/ })).toBeNull();
      expect(observers.length).toBeGreaterThan(0);
    });

    it("requests the next page when the sentinel is reached", async () => {
      const onLoadMore = vi.fn(async () => {});
      render(
        <ActivityFeed items={items} maxHeight={240} hasMore onLoadMore={onLoadMore} />,
      );
      await act(async () => {
        observers[observers.length - 1].trigger(true);
      });
      await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(1));
    });

    it("keeps the explicit button tail in loadMode=\"button\"", () => {
      render(
        <ActivityFeed
          items={items}
          maxHeight={240}
          hasMore
          loadMode="button"
          onLoadMore={vi.fn()}
        />,
      );
      expect(screen.getByRole("button", { name: /Load more/ })).toBeInTheDocument();
      expect(observers.length).toBe(0);
    });

    it("degrades to the button when scroll mode has no capped body", () => {
      render(<ActivityFeed items={items} hasMore onLoadMore={vi.fn()} />);
      expect(screen.getByRole("button", { name: /Load more/ })).toBeInTheDocument();
      expect(observers.length).toBe(0);
    });

    it("offers a retry on a rejected page, not silence", async () => {
      const onLoadMore = vi.fn(async () => {
        throw new Error("boom");
      });
      const { container } = render(
        <ActivityFeed items={items} maxHeight={240} hasMore onLoadMore={onLoadMore} />,
      );
      await act(async () => {
        observers[observers.length - 1].trigger(true);
      });
      await waitFor(() =>
        expect(container.querySelector('[data-slot="activity-feed-scroll-error"]')).not.toBeNull(),
      );
      fireEvent.click(screen.getByRole("button", { name: /Try again/ }));
      await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
    });
  });

  describe("scrollable body (maxHeight)", () => {
    it("renders the full list without a scroller by default", () => {
      const { container } = render(<ActivityFeed items={items} />);
      expect(container.querySelector('[data-slot="scrollarea"]')).toBeNull();
      expect(container.querySelectorAll("li").length).toBe(items.length);
    });

    it("caps the body, scrolls the rows and keeps Load more pinned outside", () => {
      const { container } = render(
        <ActivityFeed items={items} maxHeight={240} hasMore loadMode="button" onLoadMore={vi.fn()} />,
      );
      const frame = container.querySelector('[data-slot="scrollarea"]') as HTMLElement;
      const viewport = container.querySelector('[data-slot="scrollarea-viewport"]');
      expect(frame).not.toBeNull();
      expect(frame.style.maxHeight).toBe("240px");
      expect(viewport!.querySelector("li")).not.toBeNull();
      // The tail button must survive the scroll — it is the reason for it.
      expect(
        screen.getByRole("button", { name: /Load more/ }).closest('[data-slot="scrollarea"]'),
      ).toBeNull();
    });

    it("accepts any CSS length", () => {
      const { container } = render(<ActivityFeed items={items} maxHeight="18rem" />);
      expect(
        (container.querySelector('[data-slot="scrollarea"]') as HTMLElement).style.maxHeight,
      ).toBe("18rem");
    });

    it("insets the rows so the hover wash breathes and the bar has a gutter", () => {
      // Rows carry their own horizontal padding: text never touches the
      // wash edge, and `ScrollArea` widens the gutter to the bar's width
      // whenever the thumb is drawn.
      const { container } = render(<ActivityFeed items={items} maxHeight={240} />);
      const li = container.querySelector("li") as HTMLElement;
      expect(li.className).toContain("px-2");
      expect(container.innerHTML).not.toContain("mask-image");
    });

    it("makes a row with onClick activatable, with the table's hover grammar", () => {
      const onClick = vi.fn();
      const { container } = render(
        <ActivityFeed
          items={[
            { id: "a", title: "did a thing", timestamp: "now", onClick },
            { id: "b", title: "plain", timestamp: "now" },
          ]}
        />,
      );
      const [rowA, rowB] = container.querySelectorAll("li");
      fireEvent.click(rowA!);
      expect(onClick).toHaveBeenCalledTimes(1);
      // A row-activated control is keyboard-reachable too.
      expect(rowA!.getAttribute("role")).toBe("button");
      expect(rowA!.getAttribute("tabindex")).toBe("0");
      fireEvent.keyDown(rowA!, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(2);
      expect(rowA!.className).toContain("cursor-pointer");
      expect(rowA!.className).toContain("hover:bg-neutral-50");
      expect(rowB!.className).not.toContain("cursor-pointer");
      expect(rowB!.getAttribute("role")).toBeNull();
    });

    it("scrolls the skeleton too, so loading never resizes the card", () => {
      const { container } = render(<ActivityFeed items={items} maxHeight={240} loading />);
      const viewport = container.querySelector('[data-slot="scrollarea-viewport"]');
      expect(viewport!.querySelector(".animate-pulse")).not.toBeNull();
    });
  });
});

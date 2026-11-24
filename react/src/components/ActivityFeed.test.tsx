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
      // The template row's Panel carries the inset — `xs` padding, so text
      // never touches the wash edge and `ScrollArea` widens the gutter to
      // the bar's width whenever the thumb is drawn.
      const { container } = render(<ActivityFeed items={items} maxHeight={240} />);
      const panel = container.querySelector("li > section") as HTMLElement;
      expect(panel.className).toContain("p-2");
      expect(container.innerHTML).not.toContain("mask-image");
    });

    it("follows countLabel for the header count — worded, wordless, or gone", () => {
      const items = [
        { id: "a", title: "one", timestamp: "now" },
        { id: "b", title: "two", timestamp: "now" },
      ];
      const headerText = (container: HTMLElement) =>
        container.querySelector("h3")!.parentElement!.textContent;
      const { container, rerender } = render(<ActivityFeed title="Feed" items={items} />);
      // The feed's own noun agrees with the count it draws, not with a
      // `totalCount` it was never given.
      expect(headerText(container)).toContain("2 events");
      rerender(<ActivityFeed title="Feed" items={items} countLabel="pod restart" />);
      // The caller's noun rides verbatim — the kit does not pluralise what
      // it did not choose.
      expect(headerText(container)).toContain("2 pod restart");
      rerender(<ActivityFeed title="Feed" items={items} countLabel="" />);
      expect(headerText(container)).toMatch(/(^|\D)2(\D|$)/);
      expect(headerText(container)).not.toContain("event");
      rerender(<ActivityFeed title="Feed" items={items} countLabel={false} />);
      // Hidden means gone — no invisible placeholder, no layout slot.
      expect(headerText(container)).toBe("Feed");
    });

    it("hands an active row the selection rim and an attention row the pulse", () => {
      const { container } = render(
        <ActivityFeed
          items={[
            { id: "a", title: "current", timestamp: "now", active: true },
            { id: "b", title: "urgent", timestamp: "now", attention: true },
            { id: "c", title: "plain", timestamp: "now" },
          ]}
        />,
      );
      const panels = Array.from(container.querySelectorAll("li > section")) as HTMLElement[];
      // Untinted rows activate on the kit's blue floor; the rim is the
      // shared outline token, so it never fights the variant's widths.
      expect(panels[0].getAttribute("data-active")).toBe("true");
      expect(panels[0].className).toMatch(/outline-2/);
      expect(panels[0].className).toMatch(/outline-blue-500/);
      expect(panels[1].className).toContain("panel-pulse");
      expect(panels[1].style.getPropertyValue("--panel-glow")).toBe("var(--color-blue-500)");
      expect(panels[2].className).not.toContain("panel-pulse");
      expect(panels[2].getAttribute("data-active")).toBeNull();
    });

    it("lets attentionTone move the state hue, rim and glow together", () => {
      const { container } = render(
        <ActivityFeed
          items={[
            {
              id: "a",
              title: "current",
              timestamp: "now",
              active: true,
              attention: true,
              attentionTone: "amber",
            },
          ]}
        />,
      );
      const row = container.querySelector("li > section") as HTMLElement;
      // One hue for both states — the Panel's `borderColor ?? tone` rule
      // its row Panel wears, so a selected-and-pulsing row always agrees.
      expect(row.className).toMatch(/outline-amber-500/);
      expect(row.style.getPropertyValue("--panel-glow")).toBe("var(--color-amber-500)");
      expect(row.style.getPropertyValue("--panel-glow-dark")).toBe("var(--color-amber-300)");
    });

    it("swaps the list dividers for vertical air when rows carry a surface", () => {
      const plain = render(<ActivityFeed items={items} />);
      const tight = plain.container.querySelector("ol") as HTMLElement;
      expect(tight.className).toContain("divide-y");
      expect(tight.className).not.toContain("space-y");

      const styled = render(<ActivityFeed items={items} rowVariant="elevated" />);
      const gapped = styled.container.querySelector("ol") as HTMLElement;
      expect(gapped.className).not.toContain("divide-y");
      expect(gapped.className).toContain("space-y-2");
    });

    it("leaves the rows on the corner scale's xs step and lets rowCorner move them", () => {
      const plain = render(<ActivityFeed items={items} />);
      // The scale's `rounded` step is the class Tailwind calls `rounded-sm`.
      expect(
        (plain.container.querySelector("li > section") as HTMLElement).className,
      ).toContain("rounded-sm");

      const sharp = render(<ActivityFeed items={items} rowCorner="none" />);
      expect(
        (sharp.container.querySelector("li > section") as HTMLElement).className,
      ).toContain("rounded-none");
    });

    it("drives the row Panel with rowVariant/rowTone, inheriting the card tone by default", () => {
      const styled = render(<ActivityFeed items={items} rowVariant="glass" />);
      const panel = styled.container.querySelector("li > section") as HTMLElement;
      expect(panel.className).toContain("backdrop-blur"); // glass, not the default `none`

      // A row tone that does not follow the card, on the plain variant —
      // glass composites its own way and carries no surface-color token.
      const toned = render(<ActivityFeed items={items} rowTone="rose" />);
      const tonePanel = toned.container.querySelector("li > section") as HTMLElement;
      expect(/--ui-surface-color:var\(--color-rose/.test(tonePanel.className)).toBe(true);
    });

    it("inherits the card's tone on the rows when rowTone is unset", () => {
      const { container } = render(<ActivityFeed items={items} tone="blue" />);
      const panel = container.querySelector("li > section") as HTMLElement;
      expect(panel.className).not.toContain("backdrop-blur"); // default `none`
      expect(/--ui-surface-color:var\(--color-blue/.test(panel.className)).toBe(true);
    });

    it("makes a row with onClick activatable, with the Panel's hover grammar", () => {
      const onClick = vi.fn();
      const { container } = render(
        <ActivityFeed
          items={[
            { id: "a", title: "did a thing", timestamp: "now", onClick },
            { id: "b", title: "plain", timestamp: "now" },
          ]}
        />,
      );
      // The row is a Panel now: the section is the surface, the affordance
      // and the a11y node — role, tabIndex, the guarded click and the
      // toned hover wash all come from the Panel API.
      const panelA = container.querySelectorAll("li > section")[0] as HTMLElement;
      const panelB = container.querySelectorAll("li > section")[1] as HTMLElement;
      fireEvent.click(panelA);
      expect(onClick).toHaveBeenCalledTimes(1);
      // A row-activated control is keyboard-reachable too.
      expect(panelA.getAttribute("role")).toBe("button");
      expect(panelA.getAttribute("tabindex")).toBe("0");
      fireEvent.keyDown(panelA, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(2);
      expect(panelA.className).toContain("cursor-pointer");
      expect(panelB.className).not.toContain("cursor-pointer");
      expect(panelB.getAttribute("role")).toBeNull();
    });

    it("scrolls the skeleton too, so loading never resizes the card", () => {
      const { container } = render(<ActivityFeed items={items} maxHeight={240} loading />);
      const viewport = container.querySelector('[data-slot="scrollarea-viewport"]');
      expect(viewport!.querySelector(".animate-pulse")).not.toBeNull();
    });
  });

  describe("custom item bodies", () => {
    it("renders the item's body in place of the whole row content", () => {
      const { container } = render(
        <ActivityFeed
          items={[
            {
              id: "custom",
              title: "hidden title",
              description: "hidden description",
              code: "#412",
              timestamp: "3m ago",
              body: <div>custom row UI</div>,
            },
            { id: "null-body", title: "default row", timestamp: "now", body: null },
            { id: "plain", title: "plain row", timestamp: "now" },
          ]}
        />,
      );
      const rows = container.querySelectorAll("li");
      expect(rows[0]!.textContent).toContain("custom row UI");
      // The whole default row is gone for the custom item — dot, text, code, time.
      expect(rows[0]!.textContent).not.toContain("hidden title");
      expect(rows[0]!.textContent).not.toContain("#412");
      expect(rows[0]!.querySelector("time")).toBeNull();
      expect(rows[0]!.querySelector('[aria-hidden="true"]')).toBeNull();
      // `null` falls back to the default row, exactly like the absent field.
      expect(rows[1]!.textContent).toContain("default row");
      expect(rows[1]!.querySelector("time")).not.toBeNull();
      expect(rows[2]!.textContent).toContain("plain row");
    });

    it("keeps the row wrapper — and the clickable grammar — around a custom body", () => {
      const onClick = vi.fn();
      const { container } = render(
        <ActivityFeed
          items={[
            {
              id: "custom",
              title: "ignored",
              timestamp: "now",
              onClick,
              body: <span>custom</span>,
            },
          ]}
        />,
      );
      const row = container.querySelector("li") as HTMLElement;
      // The feed still owns the row: the body is the Panel's only content,
      // and the `onClick` grammar wraps it as it wraps the default row.
      expect(row.textContent).toBe("custom");
      const panel = row.querySelector("section") as HTMLElement;
      expect(panel.className).toContain("p-2");
      expect(panel.getAttribute("role")).toBe("button");
      expect(panel.getAttribute("tabindex")).toBe("0");
      expect(panel.className).toContain("cursor-pointer");
      fireEvent.click(panel);
      expect(onClick).toHaveBeenCalledTimes(1);
      fireEvent.keyDown(panel, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("sub-items disclosure", () => {
    const deploy: ActivityFeedItem = {
      id: "deploy",
      title: "deployed the release",
      actor: "CI",
      timestamp: "1h ago",
      tone: "blue",
      subItems: [
        { actor: "api", title: "rolled 4 pods", count: 4, code: "svc/api", timestamp: "59m ago" },
        { title: "cache warm-up", description: "warmed 12k keys", tone: "green" },
      ],
    };

    it("renders standard sub-rows with their fields, indented under the title", () => {
      const { container } = render(<ActivityFeed items={[deploy]} />);
      const row = container.querySelectorAll("li")[0]!;
      const region = row.querySelector('[role="region"]')!;
      // Collapsed at rest: inert + aria-hidden — never `hidden` — and the
      // grid carries 0fr, InfoRow's gesture exactly.
      expect(region.hasAttribute("inert")).toBe(true);
      expect(region.getAttribute("aria-hidden")).toBe("true");
      expect(region.hasAttribute("hidden")).toBe(false);
      const grid = region.parentElement as HTMLElement;
      expect(grid.className).toContain("transition-[grid-template-rows,opacity]");
      expect(grid.className).toContain("motion-reduce:transition-none");
      expect(grid.style.gridTemplateRows).toBe("0fr");
      expect(grid.style.opacity).toBe("");
      // The region answers to its row: labelled by the main line,
      // controlled from the toggle.
      const labelledBy = region.getAttribute("aria-labelledby")!;
      expect(document.getElementById(labelledBy)!.textContent).toContain("deployed the release");
      // Column indent = dot (size-2) + gap-3 = the title's leading edge.
      const subs = region.querySelectorAll(".pl-5 > div");
      expect(subs).toHaveLength(2);
      expect(subs[0]!.textContent).toContain("rolled 4 pods");
      expect(subs[0]!.textContent).toContain("×4");
      expect(subs[0]!.querySelector("time")!.textContent).toBe("59m ago");
      expect(subs[1]!.textContent).toContain("warmed 12k keys");
      // A sub-line without a timestamp draws no <time> at all.
      expect(subs[1]!.querySelector("time")).toBeNull();
    });

    it("resolves the sub-row dot down the ladder — sub, then parent, then card", () => {
      const { container } = render(
        <ActivityFeed
          tone="amber"
          items={[
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "blue",
              subItems: [{ title: "explicit", tone: "rose" }, { title: "inherits parent" }],
            },
            {
              id: "q",
              title: "untoned parent",
              timestamp: "now",
              subItems: [{ title: "card floor" }],
            },
          ]}
        />,
      );
      const dots = Array.from(
        container.querySelectorAll<HTMLElement>('[role="region"] .pl-5 > div > span:first-child'),
      );
      expect(dots[0]!.className).toContain("bg-rose-500");
      expect(dots[1]!.className).toContain("bg-blue-500");
      expect(dots[2]!.className).toContain("bg-amber-500");
    });

    it("renders a custom-body sub-item in place of the fields, keeping the indent", () => {
      const { container } = render(
        <ActivityFeed
          items={[
            {
              id: "mix",
              title: "aggregated",
              timestamp: "now",
              subItems: [
                { title: "standard sub" },
                { title: "ignored", body: <span>custom sub UI</span> },
              ],
            },
          ]}
        />,
      );
      const subs = container.querySelectorAll('[role="region"] .pl-5 > div');
      expect(subs[1]!.textContent).toBe("custom sub UI");
      expect(subs[1]!.textContent).not.toContain("ignored");
      // Same row grammar for the wrapper — the indent column holds both.
      expect(subs[1]!.className).toContain("flex items-start gap-3");
      expect(subs[0]!.textContent).toContain("standard sub");
    });

    it("leaves rows without sub-items exactly as they were — no chevron, no region, no tab stop", () => {
      const { container } = render(
        <ActivityFeed items={[{ id: "a", title: "t", timestamp: "now" }, { id: "b", title: "t2", timestamp: "now", subItems: [] }]} />,
      );
      for (const row of Array.from(container.querySelectorAll("li"))) {
        expect(row.querySelector('[role="region"]')).toBeNull();
        expect(row.querySelector("button")).toBeNull();
        // Only the dot carries aria-hidden — no chevron joined it.
        expect(row.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
      }
    });

    describe("row-is-the-toggle (no onClick)", () => {
      it("toggles through the row Panel's card action, a11y pair included", () => {
        const onToggle = vi.fn();
        const { container } = render(
          <ActivityFeed items={[{ ...deploy, onToggle }]} />,
        );
        const panel = container.querySelector("li > section") as HTMLElement;
        expect(panel.getAttribute("aria-expanded")).toBe("false");
        expect(panel.getAttribute("role")).toBe("button");
        expect(panel.getAttribute("tabindex")).toBe("0");
        expect(panel.className).toContain("cursor-pointer");
        const contentId = panel.getAttribute("aria-controls");
        expect(contentId).toBeTruthy();
        fireEvent.click(panel);
        expect(onToggle).toHaveBeenCalledWith(true);
        expect(panel.getAttribute("aria-expanded")).toBe("true");
        expect(document.getElementById(contentId!)!.hasAttribute("inert")).toBe(false);
        // The chevron is decorative here — the row is the toggle.
        const chevron = panel.querySelector(".rotate-180");
        expect(chevron).not.toBeNull();
        expect(chevron!.getAttribute("aria-hidden")).toBe("true");
        // Enter rides the same guarded path.
        fireEvent.keyDown(panel, { key: "Enter" });
        expect(onToggle).toHaveBeenCalledWith(false);
      });

      it("never folds while the reader clicks or keys inside the region", () => {
        const onToggle = vi.fn();
        const { container } = render(
          <ActivityFeed items={[{ ...deploy, defaultExpanded: true, onToggle }]} />,
        );
        const region = container.querySelector('[role="region"]')!;
        fireEvent.click(region.querySelector(".pl-5 > div")!);
        fireEvent.keyDown(region.querySelector(".pl-5 > div")!, { key: "Enter" });
        expect(onToggle).not.toHaveBeenCalled();
        expect(container.querySelector("li > section")!.getAttribute("aria-expanded")).toBe("true");
      });

      it("keeps an uncontrolled row open across a filter switch", () => {
        const both: ActivityFeedItem[] = [
          { ...deploy, category: "deploys" },
          { id: "other", title: "flagged", timestamp: "now", category: "alerts" },
        ];
        const { container } = render(
          <ActivityFeed items={both} filters={[{ label: "Deploys", value: "deploys" }, { label: "Alerts", value: "alerts" }]} />,
        );
        const panel = () => container.querySelector("li > section") as HTMLElement;
        fireEvent.click(panel()); // open
        expect(panel().getAttribute("aria-expanded")).toBe("true");
        fireEvent.click(screen.getByRole("radio", { name: "Alerts" }));
        expect(container.querySelector('[role="region"]')).toBeNull(); // hidden with its parent
        fireEvent.click(screen.getByRole("radio", { name: "All" }));
        expect(panel().getAttribute("aria-expanded")).toBe("true"); // as open as left
      });
    });

    describe("chevron-button mode (row keeps its onClick)", () => {
      it("keeps the row action and the disclosure strangers to each other", () => {
        const onClick = vi.fn();
        const onToggle = vi.fn();
        const { container } = render(
          <ActivityFeed items={[{ ...deploy, onClick, onToggle }]} />,
        );
        const panel = container.querySelector("li > section") as HTMLElement;
        // The disclosure's a11y pair lives on the chevron, not the row.
        expect(panel.getAttribute("aria-expanded")).toBeNull();
        const chevron = screen.getByRole("button", { name: "Show sub-items" });
        expect(chevron.getAttribute("aria-expanded")).toBe("false");
        fireEvent.click(panel);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onToggle).not.toHaveBeenCalled();
        fireEvent.click(chevron);
        expect(onToggle).toHaveBeenCalledWith(true);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: "Hide sub-items" }).getAttribute("aria-expanded")).toBe("true");
      });
    });

    describe("controlled rows", () => {
      it("answer only to the prop, and only report intent", () => {
        const onToggle = vi.fn();
        const { container } = render(
          <ActivityFeed items={[{ ...deploy, expanded: true, onToggle }]} />,
        );
        const panel = container.querySelector("li > section") as HTMLElement;
        expect(panel.getAttribute("aria-expanded")).toBe("true");
        fireEvent.click(panel);
        expect(onToggle).toHaveBeenCalledWith(false);
        // The prop did not move, so neither did the row.
        expect(panel.getAttribute("aria-expanded")).toBe("true");
        expect(container.querySelector('[role="region"]')!.hasAttribute("inert")).toBe(false);
      });

      it("lets an explicit expanded win the seeding against defaultExpanded", () => {
        const { container } = render(
          <ActivityFeed items={[{ ...deploy, expanded: false, defaultExpanded: true }]} />,
        );
        expect(container.querySelector("li > section")!.getAttribute("aria-expanded")).toBe("false");
        expect(container.querySelector('[role="region"]')!.hasAttribute("inert")).toBe(true);
      });
    });

    it("never lets a sub-item match a filter — and hides them with their parent", () => {
      const { container } = render(
        <ActivityFeed
          items={[
            { ...deploy, category: "deploys" },
            { id: "other", title: "flagged", timestamp: "now", category: "alerts" },
          ]}
          filters={[{ label: "Deploys", value: "deploys" }, { label: "Alerts", value: "alerts" }]}
          defaultFilter="alerts"
        />,
      );
      expect(screen.queryByText("rolled 4 pods")).not.toBeInTheDocument();
      expect(container.querySelector('[role="region"]')).toBeNull();
    });
  });

  describe("loader modes", () => {
    it("replaces the body with the feed-shaped skeleton by default", () => {
      const { container } = render(
        <ActivityFeed
          items={items}
          loading
          tag="live"
          linkLabel="Full audit log"
          filters={[{ label: "Deploys", value: "deploys" }]}
        />,
      );
      const skeleton = container.querySelector(".animate-pulse");
      expect(skeleton).not.toBeNull();
      expect(container.querySelectorAll("li")).toHaveLength(0);
      // The placeholder is shaped like the feed: one row per pending entry
      // (the auto-count), each with the dot and the right-hand time bar.
      const rows = skeleton!.querySelectorAll(":scope > div");
      expect(rows).toHaveLength(3);
      expect(rows[0]!.querySelector("time")).toBeNull();
      // Skeleton mode is a rewrite: controls yield until the events land.
      expect(container.querySelector('[role="radiogroup"]')).toBeNull();
      expect(container.textContent).not.toContain("Full audit log");
    });

    it("pins a Loader overlay over the rows for spinner, controls yielding", () => {
      const { container } = render(
        <ActivityFeed
          items={items}
          loading
          loaderType="spinner"
          tag="live"
          filters={[{ label: "Deploys", value: "deploys" }]}
        />,
      );
      // The real rows stay beneath the overlay — no skeleton swap.
      expect(container.querySelectorAll("li")).toHaveLength(items.length);
      expect(container.querySelector(".animate-pulse")).toBeNull();
      // The overlay is pinned to the feed-body wrapper, not the rows.
      const overlay = Array.from(container.querySelectorAll('[role="status"]')).find(
        (node) => node.className.includes("absolute"),
      );
      expect(overlay).toBeDefined();
      expect(overlay!.className).toContain("inset-0");
      // Any loading style clears the controls — the overlay carries a visible
      // label, so the card never reads as half-loaded.
      expect(container.querySelector('[role="radiogroup"]')).toBeNull();
      expect(container.textContent).not.toContain("live");
      expect(overlay!.textContent).toContain("Loading");
    });

    it("draws the progress bar with its fill and label", () => {
      const { container } = render(
        <ActivityFeed items={items} loading loaderType="progress" loaderProgress={40} loadingMessage="Fetching the trail" />,
      );
      const bar = container.querySelector('[role="progressbar"]');
      expect(bar).not.toBeNull();
      expect(bar!.getAttribute("aria-valuenow")).toBe("40");
      expect(container.textContent).toContain("Fetching the trail");
      expect(container.querySelectorAll("li")).toHaveLength(items.length);
      expect(container.querySelector('[role="radiogroup"]')).toBeNull();
    });

    it("lets skeletonRows pin the placeholder count", () => {
      const { container } = render(<ActivityFeed items={items} loading skeletonRows={2} />);
      expect(container.querySelectorAll(".animate-pulse > div")).toHaveLength(2);
    });
  });
});

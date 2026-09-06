import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { getButtonColorClasses, getSurfaceVariantClasses } from "../theme";
import ActivityFeed, { type ActivityFeedItem } from "./ActivityFeed";

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
});

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ActivityFeed, { type ActivityFeedItem } from "./ActivityFeed.vue";
import { getButtonColorClasses, getSurfaceVariantClasses } from "../theme";

const items: ActivityFeedItem[] = [
  { id: "1", title: "deployed the release", actor: "Ada", timestamp: "3m ago", tone: "green", category: "deploys", code: "#412" },
  { id: "2", title: "flagged a slow query", actor: "Bot", timestamp: "1h ago", tone: "amber", category: "alerts", count: 3 },
  { id: "3", title: "joined the workspace", actor: "Grace", timestamp: "2h ago", tone: "blue" },
];

describe("ActivityFeed", () => {
  it("renders the default title and every item", () => {
    const wrapper = mount(ActivityFeed, { props: { items } });
    expect(wrapper.text()).toContain("Recent activity");
    expect(wrapper.text()).toContain("deployed the release");
    expect(wrapper.text()).toContain("flagged a slow query");
    expect(wrapper.text()).toContain("joined the workspace");
    expect(wrapper.text()).toContain("#412");
    expect(wrapper.text()).toContain("3m ago");
  });

  it("filters through the segment control and emits filterChange", async () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items,
        filters: [
          { label: "Deploys", value: "deploys" },
          { label: "Alerts", value: "alerts" },
        ],
      },
    });
    await wrapper.findAll("button").find((b) => b.text() === "Alerts")!.trigger("click");
    expect(wrapper.emitted("filterChange")?.[0]).toEqual(["alerts"]);
    expect(wrapper.text()).not.toContain("deployed the release");
    await wrapper.findAll("button").find((b) => b.text() === "All")!.trigger("click");
    expect(wrapper.text()).toContain("joined the workspace");
  });

  it("shows the aggregate badge for counted entries", () => {
    const wrapper = mount(ActivityFeed, { props: { items } });
    expect(wrapper.text()).toContain("×3");
  });

  it("renders the load-more tail only with hasMore and emits loadMore", async () => {
    const wrapper = mount(ActivityFeed, { props: { items } });
    expect(wrapper.text()).not.toContain("Load more");
    await wrapper.setProps({ hasMore: true });
    const more = wrapper.findAll("button").find((b) => b.text() === "Load more");
    await more!.trigger("click");
    expect(wrapper.emitted("loadMore")).toHaveLength(1);
  });

  it("shows the empty state when a filter leaves nothing", () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [{ id: "x", title: "did a thing", timestamp: "now", category: "deploys" }],
        filters: [{ label: "Alerts", value: "alerts" }],
        defaultFilter: "alerts",
      },
    });
    expect(wrapper.text()).toContain("Nothing here");
  });

  it("renders the header tag and emits link", async () => {
    const wrapper = mount(ActivityFeed, {
      props: { items, tag: "main", linkLabel: "Full audit log", totalCount: 98 },
    });
    expect(wrapper.text()).toContain("main");
    expect(wrapper.text()).toContain("98");
    const link = wrapper.findAll("button").find((b) => b.text().includes("Full audit log"));
    await link!.trigger("click");
    expect(wrapper.emitted("link")).toHaveLength(1);
  });
  it("lets a toned card speak through the whole feed", async () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [{ id: "quiet", title: "Quiet entry", timestamp: "now" }, ...items],
        tone: "amber",
        variant: "elevated",
        linkLabel: "Full audit log",
      },
      attachTo: document.body,
    });
    // An untoned entry adopts the card's tone...
    expect(wrapper.find('[aria-hidden="true"].bg-amber-500').exists()).toBe(true);
    // ...and the CTA wears both the surface's button (elevated -> solid) and its tone.
    const cta = wrapper.findAll("button").find((b) => b.text().includes("Full audit log"))!;
    expect(cta.classes().join(" ")).toContain(getButtonColorClasses("solid", "amber").split(" ")[0]);
    wrapper.unmount();
  });

  it("defaults every control to what the card's variant implies", async () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items,
        linkLabel: "Full audit log",
        hasMore: true,
        filters: [{ value: "deploys", label: "Deploys" }],
      },
      attachTo: document.body,
    });
    const implied = getButtonColorClasses("outline", "blue").split(" ")[0];
    const buttons = wrapper.findAll("button");
    expect(buttons.find((b) => b.text().includes("Full audit log"))!.classes().join(" ")).toContain(implied);
    expect(buttons.find((b) => b.text().includes("Load more"))!.classes().join(" ")).toContain(implied);
    // The filter track wears the card's own surface vocabulary.
    expect(wrapper.find('[role="radiogroup"]').classes().join(" ")).toContain(
      getSurfaceVariantClasses("outlined", "blue").split(" ")[0],
    );
    wrapper.unmount();
  });
  it("keeps the row rhythm while loading", () => {
    const wrapper = mount(ActivityFeed, {
      props: { items, title: "Deploy stream", loading: true, hasMore: true },
      attachTo: document.body,
    });
    expect(wrapper.text()).toContain("Deploy stream");
    expect(wrapper.find(".animate-pulse").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("rotated the signing keys");
    expect(wrapper.text()).not.toContain("Load more");
    wrapper.unmount();
  });
});

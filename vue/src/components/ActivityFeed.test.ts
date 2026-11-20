import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
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

  it("renders an item's body in place of the whole row content", () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [
          {
            id: "custom",
            title: "hidden title",
            description: "hidden description",
            code: "#412",
            timestamp: "3m ago",
            body: h("div", null, "custom row UI"),
          },
          { id: "null-body", title: "default row", timestamp: "now", body: null },
        ] as ActivityFeedItem[],
      },
      attachTo: document.body,
    });
    const rows = wrapper.findAll("li");
    expect(rows[0]!.text()).toContain("custom row UI");
    // The whole default row is gone for the custom item — dot, text, code, time.
    expect(rows[0]!.text()).not.toContain("hidden title");
    expect(rows[0]!.text()).not.toContain("#412");
    expect(rows[0]!.find("time").exists()).toBe(false);
    expect(rows[0]!.find('[aria-hidden="true"]').exists()).toBe(false);
    // `null` falls back to the default row, exactly like the absent field.
    expect(rows[1]!.text()).toContain("default row");
    expect(rows[1]!.find("time").exists()).toBe(true);
    wrapper.unmount();
  });

  it("keeps the feed's row wrapper around a custom body", () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [
          { id: "custom", title: "ignored", timestamp: "now", body: h("span", null, "custom") },
        ],
      },
      attachTo: document.body,
    });
    const row = wrapper.find("li");
    // The feed still owns the row: the body is the row Panel's only
    // content, and the Panel carries the `xs` inset.
    expect(row.text()).toBe("custom");
    expect(row.find("section").classes()).toContain("p-2");
    wrapper.unmount();
  });

  it("hands an active row the selection rim and an attention row the pulse", () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [
          { id: "a", title: "current", timestamp: "now", active: true },
          { id: "b", title: "urgent", timestamp: "now", attention: true },
          { id: "c", title: "plain", timestamp: "now" },
        ],
      },
      attachTo: document.body,
    });
    const panels = wrapper.findAll("li > section");
    // Untinted rows activate on the kit's blue floor; the rim is the shared
    // outline token, so it never fights the variant's widths.
    expect(panels[0].attributes("data-active")).toBe("true");
    expect(panels[0].classes()).toContain("outline-2");
    expect(panels[0].classes()).toContain("outline-blue-500");
    expect(panels[1].classes()).toContain("panel-pulse");
    expect(panels[1].attributes("style")).toContain("--panel-glow: var(--color-blue-500)");
    expect(panels[2].classes()).not.toContain("panel-pulse");
    expect(panels[2].attributes("data-active")).toBeUndefined();
    wrapper.unmount();
  });

  it("lets attentionTone move the state hue, rim and glow together", () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [
          {
            id: "a",
            title: "current",
            timestamp: "now",
            active: true,
            attention: true,
            attentionTone: "amber",
          },
        ],
      },
      attachTo: document.body,
    });
    const row = wrapper.find("li > section");
    // One hue for both states — the Panel's `borderColor ?? tone` rule its
    // row Panel wears, so a selected-and-pulsing row always agrees.
    expect(row.classes()).toContain("outline-amber-500");
    expect(row.attributes("style")).toContain("--panel-glow: var(--color-amber-500)");
    expect(row.attributes("style")).toContain("--panel-glow-dark: var(--color-amber-300)");
    wrapper.unmount();
  });

  it("swaps the list dividers for vertical air when rows carry a surface", () => {
    const plain = mount(ActivityFeed, { props: { items }, attachTo: document.body });
    const tight = plain.find("ol");
    expect(tight.attributes("class")).toMatch(/divide-y/);
    expect(tight.attributes("class")).not.toMatch(/space-y/);
    plain.unmount();

    const styled = mount(ActivityFeed, {
      props: { items, rowVariant: "elevated" },
      attachTo: document.body,
    });
    const gapped = styled.find("ol");
    expect(gapped.attributes("class")).not.toMatch(/divide-y/);
    expect(gapped.attributes("class")).toMatch(/space-y-2/);
    styled.unmount();
  });

  it("leaves the rows on the corner scale's xs step and lets rowCorner move them", () => {
    const plain = mount(ActivityFeed, { props: { items }, attachTo: document.body });
    // The scale's `rounded` step is the class Tailwind calls `rounded-sm`.
    expect(plain.find("li > section").attributes("class")).toMatch(/rounded-sm/);
    plain.unmount();

    const sharp = mount(ActivityFeed, {
      props: { items, rowCorner: "none" },
      attachTo: document.body,
    });
    expect(sharp.find("li > section").attributes("class")).toMatch(/rounded-none/);
    sharp.unmount();
  });

  it("drives the row Panel with rowVariant/rowTone, inheriting the card tone by default", () => {
    const styled = mount(ActivityFeed, {
      props: { items, rowVariant: "glass" },
      attachTo: document.body,
    });
    expect(styled.find("li > section").attributes("class")).toMatch(/backdrop-blur/); // glass, not the default `none`
    styled.unmount();

    // A row tone that does not follow the card, on the plain variant —
    // glass composites its own way and carries no surface-color token.
    const toned = mount(ActivityFeed, {
      props: { items, rowTone: "rose" },
      attachTo: document.body,
    });
    expect(toned.find("li > section").attributes("class")).toMatch(
      /--ui-surface-color:var\(--color-rose/,
    );
    toned.unmount();

    const inheriting = mount(ActivityFeed, {
      props: { items, tone: "blue" },
      attachTo: document.body,
    });
    const plain = inheriting.find("li > section");
    expect(plain.attributes("class")).not.toMatch(/backdrop-blur/); // default `none`
    expect(plain.attributes("class")).toMatch(/--ui-surface-color:var\(--color-blue/);
    inheriting.unmount();
  });

  it("hands a clickable row to the Panel's card-action API", () => {
    let fired = 0;
    const wrapper = mount(ActivityFeed, {
      props: {
        items: [
          { id: "a", title: "did a thing", timestamp: "now", onClick: () => { fired += 1; } },
          { id: "b", title: "plain", timestamp: "now" },
        ] as ActivityFeedItem[],
      },
      attachTo: document.body,
    });
    const panels = wrapper.findAll("li > section");
    // The row is a Panel now: the click, the cursor and the hover wash all
    // come from its API — no hand-rolled row classes.
    expect(panels[0]!.classes()).toContain("cursor-pointer");
    expect(panels[1]!.classes()).not.toContain("cursor-pointer");
    expect(panels[0]!.classes()).toContain("p-2");
    panels[0]!.trigger("click");
    expect(fired).toBe(1);
    wrapper.unmount();
  });

  describe("loader modes", () => {
    it("replaces the body with the feed-shaped skeleton by default", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items,
          loading: true,
          tag: "live",
          linkLabel: "Full audit log",
          filters: [{ label: "Deploys", value: "deploys" }],
        },
        attachTo: document.body,
      });
      expect(wrapper.find(".animate-pulse").exists()).toBe(true);
      expect(wrapper.findAll("li")).toHaveLength(0);
      // The auto-count follows the pending page.
      expect(wrapper.findAll(".animate-pulse > div")).toHaveLength(3);
      // Skeleton mode is a rewrite: controls yield while the feed is written.
      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(false);
      expect(wrapper.text()).not.toContain("Full audit log");
      wrapper.unmount();
    });

    it("pins a Loader overlay over the rows for spinner, controls yielding", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items,
          loading: true,
          loaderType: "spinner",
          tag: "live",
          filters: [{ label: "Deploys", value: "deploys" }],
        },
        attachTo: document.body,
      });
      // The real rows stay beneath the overlay — no skeleton swap.
      expect(wrapper.findAll("li")).toHaveLength(items.length);
      expect(wrapper.find(".animate-pulse").exists()).toBe(false);
      const overlay = wrapper
        .findAll('[role="status"]')
        .find((n) => n.classes().includes("absolute"));
      expect(overlay).toBeTruthy();
      expect(overlay!.classes()).toContain("inset-0");
      // Any loading style clears the controls; the overlay carries a label.
      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(false);
      expect(wrapper.text()).not.toContain("live");
      expect(overlay!.text()).toContain("Loading");
      wrapper.unmount();
    });

    it("draws the progress bar with its fill and label", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items,
          loading: true,
          loaderType: "progress",
          loaderProgress: 40,
          loadingMessage: "Fetching the trail",
        },
        attachTo: document.body,
      });
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.exists()).toBe(true);
      expect(bar.attributes("aria-valuenow")).toBe("40");
      expect(wrapper.text()).toContain("Fetching the trail");
      expect(wrapper.findAll("li")).toHaveLength(items.length);
      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(false);
      wrapper.unmount();
    });

    it("lets skeletonRows pin the placeholder count", () => {
      const wrapper = mount(ActivityFeed, {
        props: { items, loading: true, skeletonRows: 2 },
        attachTo: document.body,
      });
      expect(wrapper.findAll(".animate-pulse > div")).toHaveLength(2);
      wrapper.unmount();
    });
  });
});

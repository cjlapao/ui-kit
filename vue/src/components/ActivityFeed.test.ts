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

  it("follows countLabel for the header count — worded, wordless, or gone", async () => {
    const items = [
      { id: "a", title: "one", timestamp: "now" },
      { id: "b", title: "two", timestamp: "now" },
    ];
    const wrapper = mount(ActivityFeed, { props: { title: "Feed", items } });
    const headerText = () => wrapper.find("h3").element.parentElement?.textContent ?? "";
    // The feed's own noun agrees with the count it draws.
    expect(headerText()).toContain("2 events");
    // The caller's noun rides verbatim — the kit does not pluralise it.
    await wrapper.setProps({ countLabel: "pod restart" });
    expect(headerText()).toContain("2 pod restart");
    await wrapper.setProps({ countLabel: "" });
    expect(headerText()).toMatch(/(^|\D)2(\D|$)/);
    expect(headerText()).not.toContain("event");
    // Hidden means gone — no invisible placeholder, no layout slot.
    await wrapper.setProps({ countLabel: false });
    expect(headerText()).toBe("Feed");
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
      const wrapper = mount(ActivityFeed, {
        props: { items: [deploy] },
        attachTo: document.body,
      });
      const row = wrapper.findAll("li")[0]!;
      const region = row.find('[role="region"]');
      // Collapsed at rest: inert + aria-hidden — never `hidden` — and the
      // grid carries 0fr, InfoRow's gesture exactly.
      expect(region.attributes("inert")).toBeDefined();
      expect(region.attributes("aria-hidden")).toBe("true");
      expect(region.attributes("hidden")).toBeUndefined();
      const grid = region.element.parentElement as HTMLElement;
      expect(grid.classList.contains("transition-[grid-template-rows,opacity]")).toBe(true);
      expect(grid.classList.contains("motion-reduce:transition-none")).toBe(true);
      expect(grid.style.gridTemplateRows).toBe("0fr");
      // The region answers to its row: labelled by the main line.
      const labelledBy = region.attributes("aria-labelledby")!;
      expect(document.getElementById(labelledBy)!.textContent).toContain("deployed the release");
      // Column indent = dot (size-2) + gap-3 = the title's leading edge.
      const subs = row.findAll(".pl-5 > div");
      expect(subs).toHaveLength(2);
      expect(subs[0]!.text()).toContain("rolled 4 pods");
      expect(subs[0]!.text()).toContain("×4");
      expect(subs[0]!.find("time").text()).toBe("59m ago");
      expect(subs[1]!.text()).toContain("warmed 12k keys");
      // A sub-line without a timestamp draws no <time> at all.
      expect(subs[1]!.find("time").exists()).toBe(false);
      wrapper.unmount();
    });

    it("resolves the sub-row dot down the ladder — sub, then parent, then card", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          tone: "amber" as const,
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "blue" as const,
              subItems: [{ title: "explicit", tone: "rose" as const }, { title: "inherits parent" }],
            },
            {
              id: "q",
              title: "untoned parent",
              timestamp: "now",
              subItems: [{ title: "card floor" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const dots = wrapper.findAll('[role="region"] .pl-5 > div > span:first-child');
      // Exact tokens: the hover lift embeds `group-hover:bg-{c}-500`, so a
      // substring check would let the resting step drift unnoticed.
      expect(dots[0]!.classes()).toEqual(
        expect.arrayContaining(["bg-rose-600", "dark:bg-rose-300"]),
      );
      expect(dots[1]!.classes()).toEqual(
        expect.arrayContaining(["bg-blue-600", "dark:bg-blue-300"]),
      );
      expect(dots[2]!.classes()).toEqual(
        expect.arrayContaining(["bg-amber-600", "dark:bg-amber-300"]),
      );
      wrapper.unmount();
    });

    it("steps sub-row dots one off the parent's in both themes", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "blue" as const,
              subItems: [{ title: "explicit", tone: "rose" as const }, { title: "inherits parent" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const mainDot = wrapper
        .findAll('li [aria-hidden="true"].size-2')
        .filter((el) => !el.element.closest('[role="region"]'))[0]!;
      expect(mainDot.classes()).toEqual(
        expect.arrayContaining(["bg-blue-500", "dark:bg-blue-400"]),
      );
      const subDots = wrapper.findAll('[role="region"] .pl-5 > div > span:first-child');
      expect(subDots[0]!.classes()).toEqual(
        expect.arrayContaining(["bg-rose-600", "dark:bg-rose-300"]),
      );
      expect(subDots[1]!.classes()).toEqual(
        expect.arrayContaining(["bg-blue-600", "dark:bg-blue-300"]),
      );
      wrapper.unmount();
    });

    it("washes the sub-row and lifts its dot in the hover tone", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "blue" as const,
              subItems: [{ title: "sub", hoverTone: "amber" as const }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const sub = wrapper.find('[role="region"] .pl-5 > div');
      expect(sub.classes()).toEqual(
        expect.arrayContaining([
          "group",
          "rounded-md",
          "transition-colors",
          "motion-reduce:transition-none",
          "hover:bg-amber-100",
          "dark:hover:bg-amber-500/20",
        ]),
      );
      const dot = sub.find("span:first-child");
      // Resting from the parent's blue, hover in the explicit amber.
      expect(dot.classes()).toEqual(
        expect.arrayContaining([
          "bg-blue-600",
          "dark:bg-blue-300",
          "group-hover:bg-amber-500",
          "dark:group-hover:bg-amber-400",
          "transition-colors",
          "motion-reduce:transition-none",
        ]),
      );
      wrapper.unmount();
    });

    it("inherits the resolved tone for the hover when no hoverTone is set", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "emerald" as const,
              subItems: [{ title: "sub" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const sub = wrapper.find('[role="region"] .pl-5 > div');
      expect(sub.classes()).toEqual(
        expect.arrayContaining(["hover:bg-emerald-100", "dark:hover:bg-emerald-500/20"]),
      );
      const dot = sub.find("span:first-child");
      expect(dot.classes()).toEqual(
        expect.arrayContaining([
          "group-hover:bg-emerald-500",
          "dark:group-hover:bg-emerald-400",
        ]),
      );
      wrapper.unmount();
    });

    it("washes custom-body sub-rows without drawing a dot", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              tone: "sky" as const,
              subItems: [{ title: "ignored", body: h("span", "custom sub UI") }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const sub = wrapper.find('[role="region"] .pl-5 > div');
      expect(sub.classes()).toEqual(
        expect.arrayContaining(["hover:bg-sky-100", "dark:hover:bg-sky-500/20"]),
      );
      // The wash is the wrapper's; the custom node answers for everything inside.
      expect(sub.find('[aria-hidden="true"]').exists()).toBe(false);
      wrapper.unmount();
    });

    it("rests sub-rows on the nested panels' depth step", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "p",
              title: "parent",
              timestamp: "now",
              subItems: [{ title: "sub" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      // Same ladder nested Panels climb — one step off the surface they sit
      // on, lighter in dark — so subs read as their own rows, not flat ink.
      const sub = wrapper.find('[role="region"] .pl-5 > div');
      expect(sub.classes()).toEqual(
        expect.arrayContaining(["bg-black/[0.04]", "dark:bg-white/[0.04]"]),
      );
      wrapper.unmount();
    });

    it("renders a custom-body sub-item in place of the fields, keeping the indent", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "mix",
              title: "aggregated",
              timestamp: "now",
              subItems: [
                { title: "standard sub" },
                { title: "ignored", body: h("span", null, "custom sub UI") },
              ],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const subs = wrapper.findAll('[role="region"] .pl-5 > div');
      expect(subs[1]!.text()).toBe("custom sub UI");
      expect(subs[1]!.text()).not.toContain("ignored");
      // Same row grammar for the wrapper — the indent column holds both.
      expect(subs[1]!.classes()).toContain("gap-3");
      expect(subs[0]!.text()).toContain("standard sub");
      wrapper.unmount();
    });

    it("leaves rows without sub-items exactly as they were — no chevron, no region, no tab stop", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            { id: "a", title: "t", timestamp: "now" },
            { id: "b", title: "t2", timestamp: "now", subItems: [] },
          ],
        },
        attachTo: document.body,
      });
      for (const row of wrapper.findAll("li")) {
        expect(row.find('[role="region"]').exists()).toBe(false);
        expect(row.find("button").exists()).toBe(false);
        // Only the dot carries aria-hidden — no chevron joined it.
        expect(row.findAll('[aria-hidden="true"]')).toHaveLength(1);
      }
      wrapper.unmount();
    });

    describe("row-is-the-toggle (no onClick)", () => {
      it("toggles through the row Panel's card action, a11y pair included", async () => {
        const wrapper = mount(ActivityFeed, {
          props: { items: [deploy] },
          attachTo: document.body,
        });
        const panel = wrapper.find("li > section");
        expect(panel.attributes("aria-expanded")).toBe("false");
        expect(panel.classes()).toContain("cursor-pointer");
        const contentId = panel.attributes("aria-controls");
        expect(contentId).toBeTruthy();
        await panel.trigger("click");
        expect(wrapper.emitted("toggle")?.[0]).toEqual(["deploy", true]);
        expect(panel.attributes("aria-expanded")).toBe("true");
        expect(document.getElementById(contentId!)!.hasAttribute("inert")).toBe(false);
        // The chevron is decorative here — the row is the toggle.
        const chevron = panel.find(".rotate-180");
        expect(chevron.exists()).toBe(true);
        expect(chevron.attributes("aria-hidden")).toBe("true");
        wrapper.unmount();
      });

      it("never folds while the reader clicks or keys inside the region", async () => {
        const wrapper = mount(ActivityFeed, {
          props: { items: [{ ...deploy, defaultExpanded: true }] },
          attachTo: document.body,
        });
        expect(wrapper.find('[role="region"]').exists()).toBe(true);
        const sub = wrapper.find(".pl-5 > div");
        await sub.trigger("click");
        await sub.trigger("keydown", { key: "Enter" });
        expect(wrapper.emitted("toggle")).toBeUndefined();
        expect(wrapper.find("li > section").attributes("aria-expanded")).toBe("true");
        wrapper.unmount();
      });

      it("keeps an uncontrolled row open across a filter switch", async () => {
        const wrapper = mount(ActivityFeed, {
          props: {
            items: [
              { ...deploy, category: "deploys" },
              { id: "other", title: "flagged", timestamp: "now", category: "alerts" },
            ] as ActivityFeedItem[],
            filters: [
              { label: "Deploys", value: "deploys" },
              { label: "Alerts", value: "alerts" },
            ],
          },
          attachTo: document.body,
        });
        await wrapper.find("li > section").trigger("click");
        expect(wrapper.find("li > section").attributes("aria-expanded")).toBe("true");
        await wrapper
          .findAll("button")
          .find((b) => b.text() === "Alerts")!
          .trigger("click");
        expect(wrapper.find('[role="region"]').exists()).toBe(false); // hidden with its parent
        await wrapper
          .findAll("button")
          .find((b) => b.text() === "All")!
          .trigger("click");
        expect(wrapper.find("li > section").attributes("aria-expanded")).toBe("true"); // as open as left
        wrapper.unmount();
      });
    });

    describe("chevron-button mode (row keeps its onClick)", () => {
      it("keeps the row action and the disclosure strangers to each other", async () => {
        let fired = 0;
        const wrapper = mount(ActivityFeed, {
          props: {
            items: [{ ...deploy, onClick: () => { fired += 1; } }] as ActivityFeedItem[],
          },
          attachTo: document.body,
        });
        const panel = wrapper.find("li > section");
        // The disclosure's a11y pair lives on the chevron, not the row.
        expect(panel.attributes("aria-expanded")).toBeUndefined();
        const chevron = wrapper
          .findAll("button")
          .find((b) => b.attributes("aria-label") === "Show sub-items")!;
        expect(chevron.attributes("aria-expanded")).toBe("false");
        await panel.trigger("click");
        expect(fired).toBe(1);
        expect(wrapper.emitted("toggle")).toBeUndefined();
        await chevron.trigger("click");
        expect(wrapper.emitted("toggle")?.[0]).toEqual(["deploy", true]);
        expect(fired).toBe(1); // the disclosure never reaches the row action
        expect(
          wrapper
            .findAll("button")
            .find((b) => b.attributes("aria-label") === "Hide sub-items")!
            .attributes("aria-expanded"),
        ).toBe("true");
        wrapper.unmount();
      });
    });

    describe("controlled rows", () => {
      it("answer only to the prop, and only report intent", async () => {
        const wrapper = mount(ActivityFeed, {
          props: {
            items: [{ ...deploy, expanded: true }] as ActivityFeedItem[],
          },
          attachTo: document.body,
        });
        const panel = wrapper.find("li > section");
        expect(panel.attributes("aria-expanded")).toBe("true");
        await panel.trigger("click");
        expect(wrapper.emitted("toggle")?.[0]).toEqual(["deploy", false]);
        // The prop did not move, so neither did the row.
        expect(panel.attributes("aria-expanded")).toBe("true");
        expect(wrapper.find('[role="region"]').attributes("inert")).toBeUndefined();
        wrapper.unmount();
      });

      it("lets an explicit expanded win the seeding against defaultExpanded", () => {
        const wrapper = mount(ActivityFeed, {
          props: {
            items: [{ ...deploy, expanded: false, defaultExpanded: true }] as ActivityFeedItem[],
          },
          attachTo: document.body,
        });
        expect(wrapper.find("li > section").attributes("aria-expanded")).toBe("false");
        expect(wrapper.find('[role="region"]').attributes("inert")).toBeDefined();
        wrapper.unmount();
      });
    });

    it("never lets a sub-item match a filter — and hides them with their parent", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            { ...deploy, category: "deploys" },
            { id: "other", title: "flagged", timestamp: "now", category: "alerts" },
          ] as ActivityFeedItem[],
          filters: [
            { label: "Deploys", value: "deploys" },
            { label: "Alerts", value: "alerts" },
          ],
          defaultFilter: "alerts",
        },
        attachTo: document.body,
      });
      expect(wrapper.text()).not.toContain("rolled 4 pods");
      expect(wrapper.find('[role="region"]').exists()).toBe(false);
      wrapper.unmount();
    });
  });

  describe("actions zone", () => {
    // The zone is the wrapper's own literal class list — stable to match.
    const zoneOf = (parent: Element) =>
      parent.querySelector<HTMLElement>(":scope > div.flex.h-5.shrink-0.items-center.gap-1");
    const headerOf = (wrapper: ReturnType<typeof mount>) =>
      document.getElementById(
        wrapper.find('[role="region"]').attributes("aria-labelledby")!,
      )!;

    it("draws the zone on the right — before the caret, after the sub-row's time", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "act",
              title: "deployed the release",
              timestamp: "3m ago",
              actions: h("span", "row menu"),
              subItems: [
                { title: "rolled pods", timestamp: "2m ago", actions: h("span", "sub menu") },
              ],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const header = headerOf(wrapper);
      const zone = zoneOf(header);
      expect(zone).not.toBeNull();
      expect(zone!.textContent).toBe("row menu");
      // Right before the caret — the chevron stays the header's last child.
      expect(zone!.nextElementSibling).toBe(header.lastElementChild);
      expect(header.lastElementChild!.getAttribute("aria-hidden")).toBe("true");
      // One optical line: the time, the dots and the caret all ride the
      // title's 20px first-line band, centered.
      expect(zone!.className.split(/\s+/)).toEqual(
        expect.arrayContaining(["h-5", "items-center"]),
      );
      expect(header.lastElementChild!.className.split(/\s+/)).toContain("h-5");
      // In the sub-row the zone trails the timestamp.
      const subWrapper = wrapper.find('[role="region"] .pl-5 > div').element;
      const subZone = zoneOf(subWrapper);
      expect(subZone).not.toBeNull();
      expect(subZone!.textContent).toBe("sub menu");
      expect(subZone!.previousElementSibling!.tagName).toBe("TIME");
      wrapper.unmount();
    });

    it("swallows clicks and keys — the row toggle stays still", async () => {
      let inside = 0;
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "act",
              title: "deployed",
              timestamp: "3m ago",
              actions: h("span", { onClick: () => { inside += 1; } }, "row menu"),
              subItems: [{ title: "sub", timestamp: "2m ago" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const panel = wrapper.find("li > section");
      const zone = zoneOf(headerOf(wrapper))!;
      // A plain span: the Vue Panel guards nothing, so only the zone's
      // own swallow keeps the row still.
      const span = zone.querySelector("span")!;
      span.click();
      await wrapper.vm.$nextTick();
      expect(inside).toBe(1);
      expect(wrapper.emitted("toggle")).toBeUndefined();
      expect(panel.attributes("aria-expanded")).toBe("false");
      span.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("toggle")).toBeUndefined();
      wrapper.unmount();
    });

    it("keeps the row action a stranger to the zone", async () => {
      let fired = 0;
      let inside = 0;
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "act",
              title: "t",
              timestamp: "now",
              onClick: () => { fired += 1; },
              actions: h("span", { onClick: () => { inside += 1; } }, "menu"),
              subItems: [{ title: "sub", timestamp: "now" }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const zone = zoneOf(headerOf(wrapper))!;
      zone.querySelector("span")!.click();
      await wrapper.vm.$nextTick();
      expect(inside).toBe(1);
      expect(fired).toBe(0);
      expect(wrapper.emitted("toggle")).toBeUndefined();
      // The chevron still owns the disclosure.
      const chevron = wrapper
        .findAll("button")
        .find((b) => b.attributes("aria-label") === "Show sub-items")!;
      await chevron.trigger("click");
      expect(wrapper.emitted("toggle")?.[0]).toEqual(["act", true]);
      wrapper.unmount();
    });

    it("draws alongside a custom body — row and sub-row", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            {
              id: "act",
              title: "t",
              timestamp: "now",
              body: h("b", "custom UI"),
              actions: h("span", "row menu"),
              subItems: [{ title: "x", body: h("b", "custom sub UI"), actions: h("span", "sub menu") }],
            },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      const header = headerOf(wrapper);
      expect(header.querySelector("b")!.textContent).toBe("custom UI");
      expect(zoneOf(header)!.textContent).toBe("row menu");
      const subWrapper = wrapper.find('[role="region"] .pl-5 > div').element;
      expect(subWrapper.querySelector("b")!.textContent).toBe("custom sub UI");
      expect(zoneOf(subWrapper)!.textContent).toBe("sub menu");
      wrapper.unmount();
    });

    it("draws no zone without actions", () => {
      const wrapper = mount(ActivityFeed, {
        props: {
          items: [
            { id: "a", title: "t", timestamp: "now", subItems: [{ title: "s", timestamp: "now" }] },
          ] as ActivityFeedItem[],
        },
        attachTo: document.body,
      });
      expect(zoneOf(headerOf(wrapper))).toBeNull();
      expect(zoneOf(wrapper.find('[role="region"] .pl-5 > div').element)).toBeNull();
      wrapper.unmount();
    });
  });
});

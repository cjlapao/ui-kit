import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Tabs, { type TabItem } from "./Tabs";

// The whole component had no tests until the keyboard pass; everything a
// consumer relies on — roving tabindex, arrow navigation, panel wiring,
// controlled mode — is pinned here.
// This vitest config enables no RTL auto-cleanup; without this, renders leak
// between tests and every getByRole below sees multiple matches.
afterEach(cleanup);

import { cleanup } from "@testing-library/react";

const ITEMS: TabItem[] = [
  { id: "general", label: "General", panel: "General content" },
  { id: "network", label: "Network", panel: "Network content" },
  { id: "advanced", label: "Advanced", panel: "Advanced content" },
];

const DISABLED_ITEMS: TabItem[] = [
  ITEMS[0]!,
  { ...ITEMS[1]!, disabled: true },
  ITEMS[2]!,
];

const tablist = () => screen.getByRole("tablist");
const tab = (name: string) => screen.getByRole("tab", { name });
const tabs = () => screen.getAllByRole("tab");

describe("Tabs — structure", () => {
  it("renders a tablist of tabs, first selected by default", () => {
    render(<Tabs items={ITEMS} />);
    expect(tablist()).toBeInTheDocument();
    expect(tabs()).toHaveLength(3);
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
    expect(tab("Network")).toHaveAttribute("aria-selected", "false");
  });

  it("respects defaultValue in uncontrolled mode", () => {
    render(<Tabs items={ITEMS} defaultValue="network" />);
    expect(tab("Network")).toHaveAttribute("aria-selected", "true");
  });

  it("wires tab to panel: aria-controls / id / aria-labelledby", () => {
    render(<Tabs items={ITEMS} panelIdPrefix="settings" />);
    expect(tab("General")).toHaveAttribute("aria-controls", "settings-general");
    const panel = document.getElementById("settings-general")!;
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("aria-labelledby", "tab-general");
  });

  it("a tab without a panel gets no aria-controls", () => {
    render(<Tabs items={[{ id: "solo", label: "Solo" }]} />);
    expect(tab("Solo")).not.toHaveAttribute("aria-controls");
  });

  it("only the active panel is visible", () => {
    render(<Tabs items={ITEMS} defaultValue="network" />);
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels).toHaveLength(3);
    expect(document.getElementById("tab-panel-network")).not.toHaveAttribute(
      "hidden",
    );
    expect(document.getElementById("tab-panel-general")).toHaveAttribute(
      "hidden",
    );
  });

  it("the list announces its orientation", () => {
    render(<Tabs items={ITEMS} orientation="vertical" />);
    expect(tablist()).toHaveAttribute("aria-orientation", "vertical");
  });
});

describe("Tabs — selection", () => {
  it("click selects and reports (id, item)", () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} onChange={onChange} />);
    fireEvent.click(tab("Network"));
    expect(tab("Network")).toHaveAttribute("aria-selected", "true");
    expect(onChange).toHaveBeenCalledWith("network", ITEMS[1]);
  });

  it("controlled mode follows value, not clicks", () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} value="general" onChange={onChange} />);
    fireEvent.click(tab("Network"));
    expect(onChange).toHaveBeenCalledWith("network", ITEMS[1]);
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });

  it("reselecting the active tab is silent unless allowReselect", () => {
    const onChange = vi.fn();
    const { unmount } = render(<Tabs items={ITEMS} onChange={onChange} />);
    fireEvent.click(tab("General"));
    expect(onChange).not.toHaveBeenCalled();
    unmount();

    render(<Tabs items={ITEMS} onChange={onChange} allowReselect />);
    fireEvent.click(tab("General"));
    expect(onChange).toHaveBeenCalledWith("general", ITEMS[0]);
  });

  it("disabled tabs are natively disabled and inert", () => {
    const onChange = vi.fn();
    render(<Tabs items={DISABLED_ITEMS} onChange={onChange} />);
    expect(tab("Network")).toBeDisabled();
    fireEvent.click(tab("Network"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("a vanished active tab falls back to the first item", () => {
    const { rerender } = render(<Tabs items={ITEMS} defaultValue="advanced" />);
    rerender(<Tabs items={ITEMS.slice(0, 2)} defaultValue="advanced" />);
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs — roving tabindex and keyboard", () => {
  it("exactly one tab is in the tab order", () => {
    render(<Tabs items={ITEMS} />);
    expect(tab("General")).toHaveAttribute("tabindex", "0");
    expect(tab("Network")).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight advances selection, focuses, and wraps", () => {
    render(<Tabs items={ITEMS} />);
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    expect(tab("Network")).toHaveAttribute("aria-selected", "true");
    expect(tab("Network")).toHaveFocus();
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowLeft walks backwards and wraps to the end", () => {
    render(<Tabs items={ITEMS} />);
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowLeft" });
    expect(tab("Advanced")).toHaveAttribute("aria-selected", "true");
  });

  it("disabled tabs are skipped in both directions", () => {
    render(<Tabs items={DISABLED_ITEMS} />);
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    expect(tab("Advanced")).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tablist(), { key: "ArrowLeft" });
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });

  it("Home and End jump to the ends", () => {
    render(<Tabs items={ITEMS} defaultValue="network" />);
    tab("Network").focus();
    fireEvent.keyDown(tablist(), { key: "End" });
    expect(tab("Advanced")).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tablist(), { key: "Home" });
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });

  it("vertical orientation drives on the vertical axis", () => {
    render(<Tabs items={ITEMS} orientation="vertical" />);
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowDown" });
    expect(tab("Network")).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tablist(), { key: "ArrowUp" });
    expect(tab("General")).toHaveAttribute("aria-selected", "true");
  });

  it("Enter activates like a click", () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} onChange={onChange} />);
    fireEvent.click(tab("Advanced"));
    expect(onChange).toHaveBeenCalledWith("advanced", ITEMS[2]);
  });

  it("the controlled-mode focus handoff waits for the owner: refused changes do not steal focus", () => {
    // Same handler, but the owner never changes `value` — the manual
    // activation path must leave focus put rather than strand it on a tab
    // the owner declined to select.
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} value="general" onChange={onChange} />);
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalled();
    expect(tab("General")).toHaveFocus();
  });
});

describe("Tabs — overflow: uniform tabs and scroll lanes", () => {
  it("tabs keep their shape — no uneven flex-shrink", () => {
    render(<Tabs items={ITEMS} />);
    // shrink-0 + nowrap: a crowded bar scrolls instead of squashing each
    // tab into a different geometry.
    for (const el of tabs()) {
      expect(el.className).toContain("shrink-0");
      expect(el.className).toContain("whitespace-nowrap");
    }
  });

  it("a horizontal bar without actions is one kit ScrollArea lane", () => {
    render(<Tabs items={ITEMS} />);
    const viewport = tablist().closest('[data-slot="scrollarea-viewport"]');
    expect(viewport).toBeInTheDocument();
    // Kit virtual bars — the hover variant — not a browser scrollbar.
    expect(viewport?.closest("[data-slot='scrollarea']")).toHaveAttribute(
      "data-variant",
      "hover",
    );
    // The viewport stays out of the tab order: the tabs own the keyboard.
    expect(viewport).toHaveAttribute("tabindex", "-1");
  });

  it("with actions the bar splits: tabs keep the free space, actions a capped slice, both scrolling", () => {
    render(
      <Tabs
        items={[
          {
            id: "a",
            label: "Alpha",
            actions: [{ icon: "Add", label: "Add" }],
          },
          { id: "b", label: "Beta" },
        ]}
      />,
    );
    const actions = document.getElementById("tab-item-actions-end")!;
    const actionsLane = actions.closest('[data-slot="scrollarea"]')!;
    expect(actionsLane).toHaveAttribute("data-variant", "hover");
    expect(actionsLane.className).toContain("max-w-tab-actions");
    const tabLane = tablist().closest('[data-slot="scrollarea"]')!;
    expect(tabLane).toHaveAttribute("data-variant", "hover");
    expect(tabLane.className).toContain("flex-1");
    // The two lanes are siblings; neither nests the other.
    expect(tabLane.contains(actions)).toBe(false);
    expect(actionsLane.contains(tab("Alpha"))).toBe(false);
  });

  it("vertical: the tab column is the scroll lane, not the whole component", () => {
    render(<Tabs items={ITEMS} orientation="vertical" />);
    const viewport = tablist().closest('[data-slot="scrollarea-viewport"]');
    expect(viewport).toBeInTheDocument();
    expect(viewport?.closest("[data-slot='scrollarea']")).toHaveAttribute(
      "data-variant",
      "hover",
    );
    expect(viewport).toHaveAttribute("tabindex", "-1");
    // The panels are NOT inside the lane — they keep their own height.
    expect(
      document
        .getElementById("tab-panel-general")!
        .closest('[data-slot="scrollarea"]'),
    ).toBeNull();
  });

  it("vertical: actions sit outside the scroll, always visible", () => {
    render(
      <Tabs
        orientation="vertical"
        items={[
          {
            id: "a",
            label: "Alpha",
            actions: [{ icon: "Add", label: "Add" }],
          },
          { id: "b", label: "Beta" },
        ]}
      />,
    );
    const actions = document.getElementById("tab-item-actions-end")!;
    expect(actions.className).toContain("flex-shrink-0");
    // Never inside the scrolling lane — it cannot be cut at the fold.
    expect(actions.closest('[data-slot="scrollarea-viewport"]')).toBeNull();
  });

  it("arrow navigation scrolls the newly focused tab into view", () => {
    render(<Tabs items={ITEMS} />);
    const target = tab("Network");
    const spy = vi.fn();
    target.scrollIntoView = spy;
    tab("General").focus();
    fireEvent.keyDown(tablist(), { key: "ArrowRight" });
    expect(spy).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
  });
});

describe("Tabs — styling contracts", () => {
  it("md tabs carry a real type size (text-md is not a class)", () => {
    render(<Tabs items={ITEMS} size="md" />);
    expect(tab("General").className).toContain("text-base");
    expect(tab("General").className).not.toContain("text-md");
  });

  it("takes the whole control scale — xs to xl, like Button", () => {
    // Tabs once stopped at lg; the theme's scale runs xs→xl.
    const { unmount } = render(<Tabs items={ITEMS} size="xs" />);
    const xs = tab("General");
    expect(xs.className).toContain("text-xs");
    expect(xs.className).toContain("px-2");
    unmount();

    render(
      <Tabs
        items={[{ id: "general", label: "General", icon: "Run" }]}
        size="xl"
      />,
    );
    const xl = tab("General");
    expect(xl.className).toContain("text-lg");
    expect(xl.className).toContain("px-6");
    // The icon step lives on the glyph wrapper, not the button.
    expect(xl.querySelector('[class*="h-6 w-6"]')).not.toBeNull();
  });

  it("the active underline tab shows its bar", () => {
    render(<Tabs items={ITEMS} />);
    expect(tab("General").className).toMatch(/(^|\s)after:opacity-100(\s|$)/);
    // Inactive tabs carry only the `group-hover:` variant of the same class.
    expect(tab("Network").className).toMatch(/group-hover:after:opacity-100/);
    expect(tab("Network").className).not.toMatch(
      /(^|\s)after:opacity-100(\s|$)/,
    );
  });

  it("defaults to blue with a tone focus ring", () => {
    render(<Tabs items={ITEMS} />);
    expect(tab("General").className).toMatch(/focus-visible:ring-blue-\d00/);
  });

  it("glass variants paint the surface and a ring on the active tab", () => {
    render(<Tabs items={ITEMS} variant="glass" color="emerald" />);
    const active = tab("General");
    expect(active.className).toContain("backdrop-blur-sm");
    expect(active.className).toContain("ring-emerald-400/60");
    expect(tab("Network").className).not.toContain("ring-emerald-400/60");
  });

  it("radius maps glass pills to the shared corner scale", () => {
    render(<Tabs items={ITEMS} variant="liquid-glass" radius="full" />);
    expect(tab("General").className).toContain("rounded-full");
  });

  it("dividers only render where they are defined", () => {
    const { rerender } = render(<Tabs items={ITEMS} showDividers />);
    expect(screen.getAllByText("", { exact: false }).length).toBeGreaterThan(0);
    rerender(<Tabs items={ITEMS} showDividers variant="pill" />);
    expect(screen.queryByText("General")).toBeInTheDocument();
  });

  it("fullWidth stretches every tab", () => {
    render(<Tabs items={ITEMS} fullWidth />);
    expect(tab("Network").className).toContain("flex-1");
  });
});

describe("Tabs — panels, badges and actions", () => {
  it("actions follow the tabs tone by default", () => {
    render(
      <Tabs
        color="violet"
        items={[
          { id: "a", label: "Alpha", actions: [{ icon: "Add", label: "Add" }] },
        ]}
      />,
    );
    const actions = document.getElementById("tab-item-actions-end")!;
    // Ghost glyphs carry their own tone text; the container tone still
    // colours any custom `node` action that inherits text.
    expect(actions.className).toContain("text-violet-600");
    expect(actions.className).toContain("dark:text-violet-400");
    expect(actions.className).not.toContain("text-neutral-400");
  });

  it("an action&rsquo;s own color still wins over actionsColor", () => {
    // The container carries the override; a per-action color still wins,
    // stamped into the button's own tone classes.
    render(
      <Tabs
        actionsColor="emerald"
        items={[
          {
            id: "a",
            label: "Alpha",
            actions: [{ icon: "Add", label: "Add", color: "rose" }],
          },
        ]}
      />,
    );
    const button = document.querySelector("#tab-item-actions-end button")!;
    // Ghost buttons stamp their tone into the hover and focus-ring classes,
    // so those prove which colour the button actually resolved.
    expect(button.className).toContain("hover:bg-rose-100");
    expect(button.className).toContain("focus-visible:ring-rose-400");
    expect(button.className).not.toContain("emerald");
  });

  it("actionsColor overrides the tone for every unpinned action", () => {
    render(
      <Tabs
        actionsColor="emerald"
        items={[
          {
            id: "a",
            label: "Alpha",
            actions: [{ icon: "Add", label: "Add", color: "rose" }],
          },
        ]}
      />,
    );
    const actions = document.getElementById("tab-item-actions-end")!;
    expect(actions.className).toContain("text-emerald-600");
    expect(actions.className).not.toContain("text-blue-600");
  });

  it("actionsColor=auto with the default tone is still readable (no neutral wash)", () => {
    render(
      <Tabs
        items={[
          { id: "a", label: "Alpha", actions: [{ icon: "Add", label: "Add" }] },
        ]}
      />,
    );
    expect(
      document.getElementById("tab-item-actions-end")!.className,
    ).toContain("text-blue-600");
  });

  it("scrolls its panels with the kit's ScrollArea, not an overlay trick", () => {
    const { container } = render(<Tabs items={ITEMS} />);
    const panel = document.getElementById("tab-panel-general")!;
    expect(panel.querySelector('[data-slot="scrollarea"]')).not.toBeNull();
    // The old fake fade: an opaque gradient painted over the top edge that
    // matched only a literally-white panel, and the `-webkit-scrollbar`
    // hope it wrapped. Neither survives.
    expect(panel.innerHTML).not.toContain("bg-gradient-to");
    expect(panel.innerHTML).not.toContain("scrollbar-thin");
    expect(container).toBeInTheDocument();
  });

  it("badges render inside their tab", () => {
    render(
      <Tabs
        items={[
          { id: "inbox", label: "Inbox", badge: 12 },
          { id: "sent", label: "Sent" },
        ]}
      />,
    );
    // The badge text is part of the tab's accessible name.
    expect(screen.getByRole("tab", { name: /Inbox/ })).toHaveTextContent("12");
  });

  it("tab actions belong to the active tab and land at the end of the bar", () => {
    const onAction = vi.fn();
    render(
      <Tabs
        items={[
          {
            id: "a",
            label: "Alpha",
            actions: [
              { icon: "Search", label: "Search inside", onClick: onAction },
            ],
          },
          { id: "b", label: "Beta", actions: [{ icon: "Add", label: "Add" }] },
        ]}
      />,
    );
    const action = screen.getByRole("button", { name: "Search inside" });
    expect(action).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add" }),
    ).not.toBeInTheDocument();
    fireEvent.click(action);
    expect(onAction).toHaveBeenCalled();
  });

  it("no actions means no spacer eating the layout", () => {
    render(<Tabs items={ITEMS} />);
    expect(document.getElementById("tab-item-actions-end")).toBeNull();
  });
});

describe("Tabs - tone text must not collide with the neutral", () => {
  const items = [
    { id: "a", label: "Alpha", panel: <div /> },
    { id: "b", label: "Beta", panel: <div /> },
  ];

  const classesOf = (el: Element) => el.className.split(" ");

  it("redundant neutral washes must never reach an accent-backgrounded active tab", () => {
    for (const variant of ["segmented", "minimal", "underline"] as const) {
      cleanup();
      render(
        <Tabs items={items} defaultValue="a" color="blue" variant={variant} />,
      );
      const classes = classesOf(screen.getByRole("tab", { selected: true }));
      // No variant's active tab may carry the neutral wash - it would
      // out-cascade the tone for alphabetically-early hues.
      expect(classes).not.toContain("text-neutral-600");
      if (variant !== "segmented") {
        // minimal/underline mark the active tab with tone TEXT;
        // segmented marks it with an accent background and white text.
        expect(classes).toContain("text-blue-600");
      }
    }
  });

  it("inactive tabs keep the neutral", () => {
    render(
      <Tabs items={items} defaultValue="a" color="blue" variant="minimal" />,
    );
    const classes = classesOf(screen.getByRole("tab", { selected: false }));
    expect(classes).toContain("text-neutral-600");
    expect(classes).not.toContain("text-blue-600");
  });
});

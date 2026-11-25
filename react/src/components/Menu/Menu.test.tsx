import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Menu, type MenuItem } from "./Menu";

const items: MenuItem[] = [
  { id: "documents", label: "Documents", type: "group", items: [
    { id: "new", label: "New" },
    { id: "disabled", label: "Disabled", disabled: true },
    { id: "reports", label: "Reports", items: [{ id: "monthly", label: "Monthly" }, { id: "yearly", label: "Yearly" }] },
  ] },
  { id: "separator", type: "separator" },
  { id: "hidden", label: "Hidden", hidden: true },
  { id: "settings", label: "Settings" },
];

describe("Menu", () => {
  it("renders labelled groups and hides unavailable entries", () => {
    render(<Menu items={items} aria-label="Workspace" header={<strong>Account</strong>} footer="Footer" />);
    expect(screen.getByRole("menu", { name: "Workspace" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Documents" })).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).toBeNull();
    expect(screen.getByRole("menuitem", { name: "Disabled" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
  it("styles rows independently from their surface and honors individual overrides", () => {
    const { container } = render(<Menu tone="neutral" padding="lg" corner="rounded-xl"
      itemTone="blue" itemPadding="none" itemCorner="none" items={[
        { id: "default", label: "Default row" },
        { id: "override", label: "Custom row", tone: "rose", padding: "xs", corner: "rounded-lg" },
      ]} />);
    const row = screen.getByRole("menuitem", { name: "Default row" });
    expect(row).toHaveClass("p-0", "rounded-none", "hover:bg-blue-100");
    expect(row).not.toHaveClass("px-3", "py-2", "rounded-lg");
    expect(screen.getByRole("menuitem", { name: "Custom row" })).toHaveClass("p-1", "sm:p-1.5", "rounded-3xl", "hover:bg-rose-100");
    expect(container.querySelector("section")).toHaveClass("rounded-4xl");
    expect(container.querySelector("[data-menu-padding]")).toHaveClass("p-4", "sm:p-5");
  });
  it("uses compact xs padding by default", () => {
    const { container } = render(<Menu items={items} />);
    expect(container.querySelector("[data-menu-padding]")).toHaveClass("p-1", "sm:p-1.5");
    expect(container.querySelector("[data-menu-padding]")).not.toHaveClass("p-2", "sm:p-3");
    // Surface corner matches the rows' rounded-sm default token (rounded-lg class).
    expect(container.querySelector("section")).toHaveClass("rounded-lg");
  });
  it("navigates across groups, skips disabled items, and supports typeahead", () => {
    render(<Menu items={items} />);
    const first = screen.getByRole("menuitem", { name: "New" });
    first.focus();
    expect(first).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Reports" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "n" });
    expect(first).toHaveFocus();
  });
  it("expands inline and returns focus to the parent with Left Arrow", async () => {
    render(<Menu items={items} submenuMode="inline" />);
    const parent = screen.getByRole("menuitem", { name: "Reports" });
    fireEvent.keyDown(parent, { key: "ArrowRight" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Monthly" })).toHaveFocus());
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(parent).toHaveFocus();
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
  });
  it("leaves controlled expansion with its owner", () => {
    const change = vi.fn();
    render(<Menu items={items} submenuMode="inline" expandedKeys={[]} onExpandedKeysChange={change} />);
    fireEvent.click(screen.getByRole("menuitem", { name: "Reports" }));
    expect(change).toHaveBeenCalledWith(["reports"]);
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
  });
  it("executes commands, checkbox and radio callbacks without closing checks", async () => {
    const check = vi.fn(); const radio = vi.fn(); const command = vi.fn(); const close = vi.fn();
    render(<Menu trigger={<button>Open</button>} onOpenChange={close} items={[
      { id: "check", label: "Notifications", type: "checkbox", checked: true, onCheckedChange: check },
      { id: "radio", label: "Dark", type: "radio", checked: false, onCheckedChange: radio },
      { id: "command", label: "Save", command },
    ]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Notifications" }));
    expect(check).toHaveBeenCalledWith(false);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    expect(radio).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole("menuitem", { name: "Save" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("opens popup on keyboard, restores focus on Escape, and dismisses outside", async () => {
    render(<Menu trigger={<button>Open</button>} items={items} />);
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "New" })).toHaveFocus());
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("renders tiered descendants in portals and treats child clicks as inside", async () => {
    render(<Menu submenuMode="tiered" trigger={<button>Open</button>} items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.mouseEnter(screen.getByRole("menuitem", { name: "Reports" }));
    const child = screen.getByRole("menuitem", { name: "Monthly" });
    fireEvent.pointerDown(child);
    expect(screen.getAllByRole("menu")).toHaveLength(2);
    fireEvent.click(child);
    // Branch collapse: the submenu unmounts, the root menu stays open.
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
    expect(screen.getByRole("menuitem", { name: "Reports" })).toBeInTheDocument();
  });
  it("mixes inline sections with tiered rows and supports static outside dismissal", () => {
    render(<Menu submenuMode="tiered" items={[
      { id: "usage", label: "Usage", type: "section", submenuMode: "inline", content: <p>Weekly: 66%</p> },
      { id: "help", label: "Help", items: [{ id: "guide", label: "Guide" }] },
    ]} />);
    fireEvent.click(screen.getByRole("menuitem", { name: "Usage" }));
    expect(screen.getByText("Weekly: 66%")).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByRole("menuitem", { name: "Help" }));
    expect(screen.getByRole("menuitem", { name: "Guide" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menuitem", { name: "Guide" })).toBeNull();
    expect(screen.getByText("Weekly: 66%")).toBeInTheDocument();
  });
  it("keeps a disabled command inert and supports router and external links", () => {
    const command = vi.fn();
    render(<MemoryRouter><Menu items={[
      { id: "disabled", label: "Disabled", disabled: true, command },
      { id: "route", label: "Projects", to: "/projects" },
      { id: "external", label: "Docs", href: "https://example.com", target: "_blank" },
    ]} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("menuitem", { name: "Disabled" }));
    expect(command).not.toHaveBeenCalled();
    expect(screen.getByRole("menuitem", { name: "Projects" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("menuitem", { name: "Docs" })).toHaveAttribute("rel", "noopener noreferrer");
  });
  it("allows traversing the gap into a tiered submenu", () => {
    vi.useFakeTimers();
    const { container } = render(<Menu submenuMode="tiered" items={items} />);
    fireEvent.mouseEnter(screen.getByRole("menuitem", { name: "Reports" }));
    fireEvent.mouseLeave(container.querySelector("[data-menu-owner]")!);
    fireEvent.mouseEnter(screen.getByRole("menu", { name: "Reports" }).closest("[data-menu-owner]")!);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole("menuitem", { name: "Monthly" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe("Menu selection (selectedKey)", () => {
  const tree: MenuItem[] = [
    { id: "model", label: "Sonnet 5.5", description: "Most efficient for simpler tasks" },
    { id: "effort", label: "Effort", submenuHeader: "Higher effort means more thorough responses.", items: [
      { id: "low", label: "Low" }, { id: "medium", label: "Medium" },
    ] },
    { id: "theme", label: "Theme", trailing: "Explicit", items: [{ id: "dark", label: "Dark" }] },
    { id: "notify", label: "Notify", type: "checkbox", checked: true },
  ];
  it("checks the selected row with menuitemradio semantics", () => {
    render(<Menu items={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }]} selectedKey="b" />);
    const row = screen.getByRole("menuitemradio", { name: "Beta" });
    expect(row).toHaveAttribute("aria-checked", "true");
    expect(row.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Alpha" })).not.toHaveAttribute("aria-checked");
  });
  it("echoes the selected descendant on its parent row", () => {
    render(<Menu items={tree} selectedKey="medium" />);
    expect(screen.getByRole("menuitem", { name: "Effort" })).toHaveTextContent("Medium");
  });
  it("lets an explicit trailing suppress the echo", () => {
    render(<Menu items={tree} selectedKey="dark" />);
    const themed = screen.getByRole("menuitem", { name: "Theme" });
    expect(themed).toHaveTextContent("Explicit");
    expect(themed).not.toHaveTextContent("Dark");
  });
  it("keeps checkbox rows checkable-first", () => {
    render(<Menu items={tree} selectedKey="notify" />);
    expect(screen.getByRole("menuitemcheckbox", { name: "Notify" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitemradio")).toBeNull();
  });
  it("renders submenuHeader only inside the opened submenu", () => {
    render(<Menu items={tree} />);
    expect(screen.queryByText(/Higher effort/)).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Effort" }));
    expect(screen.getByText(/Higher effort/)).toBeInTheDocument();
  });
  it("ignores a selectedKey that matches no row", () => {
    render(<Menu items={tree} selectedKey="ghost" />);
    expect(screen.queryAllByRole("menuitemradio")).toHaveLength(0);
  });
  it("caps the popup scroll area to the space left on the chosen side", async () => {
    render(<Menu trigger={<button>Open</button>} items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const portal = Array.from(document.body.children).find(el => el.getAttribute("style")?.includes("position: fixed")) as HTMLElement;
    expect(portal).toBeTruthy();
    expect(portal.style.getPropertyValue("--menu-popup-max-height")).toBe(`${window.innerHeight - 4 - 8}px`);
    const frame = portal.querySelector('[data-menu-padding] > [data-slot="scrollarea"]') as HTMLElement;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute("style")).toContain("var(--menu-popup-max-height");
    // The kit ScrollArea does the scrolling — no raw overflow-auto div left.
    expect(frame.querySelector('[data-slot="scrollarea-viewport"] [data-slot="scrollarea-content"]')).toBeTruthy();
    expect(frame).toHaveAttribute("data-variant", "auto");
  });
});

describe("Menu toggle items", () => {
  it("draws a trailing switch with menuitemcheckbox semantics", () => {
    render(<Menu items={[{ id: "autosave", label: "Autosave", type: "toggle", checked: true, onCheckedChange: vi.fn() }]} />);
    const row = screen.getByRole("menuitemcheckbox", { name: "Autosave" });
    expect(row).toHaveAttribute("aria-checked", "true");
    expect(row.querySelector("[data-menu-switch]")).toHaveAttribute("data-menu-switch", "on");
  });
  it("flips onCheckedChange without closing the menu", () => {
    const onCheckedChange = vi.fn();
    render(<Menu trigger={<button>Open</button>} items={[{ id: "autosave", label: "Autosave", type: "toggle", checked: false, onCheckedChange }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Autosave" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // Checkbox-like rows stay open — toggling is not an exit.
    expect(screen.getByRole("menuitemcheckbox", { name: "Autosave" })).toBeInTheDocument();
  });
  it("keeps the leading icon slot instead of a check glyph", () => {
    render(<Menu items={[{ id: "autosave", label: "Autosave", type: "toggle", icon: "Star", checked: false, onCheckedChange: vi.fn() }]} />);
    const row = screen.getByRole("menuitemcheckbox", { name: "Autosave" });
    expect(row.querySelector("[data-menu-switch]")).toHaveAttribute("data-menu-switch", "off");
    expect(row.querySelector("span[aria-hidden=\"true\"] svg")).toBeTruthy();
  });
  it("slides the switch thumb to the far wall when checked", () => {
    // Regression: the thumb sat still because its travel utility never made
    // it into the shipped CSS. The checked class pair must be present.
    render(<Menu items={[
      { id: "on", label: "On", type: "toggle", checked: true, onCheckedChange: vi.fn() },
      { id: "off", label: "Off", type: "toggle", checked: false, onCheckedChange: vi.fn() },
    ]} />);
    const thumb = screen.getByRole("menuitemcheckbox", { name: "On" }).querySelector<HTMLElement>("[data-menu-switch] > span");
    expect(thumb).toHaveClass("-translate-y-1/2");
    expect(thumb).toHaveClass("translate-x-3");
    const offThumb = screen.getByRole("menuitemcheckbox", { name: "Off" }).querySelector<HTMLElement>("[data-menu-switch] > span");
    expect(offThumb).not.toHaveClass("translate-x-3");
  });
});

describe("Menu defaults", () => {
  it("opens submenus as tiered popups by default", () => {
    render(<Menu items={[{ id: "parent", label: "Parent", items: [{ id: "child", label: "Child" }] }]} />);
    const parent = screen.getByRole("menuitem", { name: "Parent" });
    expect(parent).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(parent);
    const child = screen.getByRole("menuitem", { name: "Child" });
    expect(child).toBeInTheDocument();
    // Tiered: the popup is its own menu, not an inline continuation of the list.
    expect(child.closest("ul")).not.toBe(parent.closest("ul"));
  });
  it("drops the leading gutter when no row paints an icon", () => {
    render(<Menu items={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta", trailing: "⌘B" }]} />);
    expect(screen.getByRole("menuitem", { name: "Alpha" }).querySelector("span[aria-hidden]")).toBeNull();
  });
  it("reserves the gutter on every row once one row carries an icon", () => {
    render(<Menu items={[{ id: "a", label: "Alpha", icon: "Star" }, { id: "b", label: "Beta" }]} />);
    expect(screen.getByRole("menuitem", { name: "Beta" }).querySelector("span[aria-hidden]")).toBeTruthy();
  });
  it("reserves the gutter for checkbox rows even without icons", () => {
    render(<Menu items={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta", type: "checkbox", checked: false, onCheckedChange: vi.fn() }]} />);
    expect(screen.getByRole("menuitem", { name: "Alpha" }).querySelector("span[aria-hidden]")).toBeTruthy();
  });
});

describe("Menu closeOnSelect", () => {
  it("keeps the popup open while plain rows act when the menu opts out", () => {
    const command = vi.fn();
    render(<Menu closeOnSelect={false} trigger={<button>Open</button>} items={[{ id: "a", label: "Alpha", command }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Alpha" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
  it("lets a row override the menu-wide opt-out", () => {
    render(<Menu closeOnSelect={false} trigger={<button>Open</button>} items={[{ id: "a", label: "Alpha", closeOnSelect: true }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Alpha" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("lets a checkable row opt back into closing", () => {
    render(<Menu trigger={<button>Open</button>} items={[{ id: "a", label: "Alpha", type: "checkbox", checked: false, closeOnSelect: true, onCheckedChange: vi.fn() }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Alpha" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Menu submenu selection", () => {
  it("collapses the submenu chain back to the root and keeps the menu open", async () => {
    const command = vi.fn();
    render(<Menu trigger={<button>Open</button>} items={[{ id: "reports", label: "Reports", items: [{ id: "monthly", label: "Monthly", command }]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Reports" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Monthly" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
    expect(screen.getByRole("menuitem", { name: "Reports" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Reports" })).toHaveFocus());
  });
  it("collapses every level from the deepest submenu row", async () => {
    render(<Menu trigger={<button>Open</button>} items={[{ id: "export", label: "Export", items: [{ id: "docs", label: "Documents", items: [{ id: "pdf", label: "PDF", command: vi.fn() }]}]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Export" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Documents" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "PDF" }));
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(screen.queryByRole("menuitem", { name: "PDF" })).toBeNull();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Export" })).toHaveFocus());
  });
  it("closes the whole menu for an explicit closeOnSelect inside a submenu", () => {
    render(<Menu trigger={<button>Open</button>} items={[{ id: "more", label: "More", items: [{ id: "opus", label: "Opus", closeOnSelect: true }]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "More" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Opus" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("collapses submenus even when the menu opts out of closing", async () => {
    // A menu-wide false keeps the ROOT open — it does not pin submenus: a
    // plain submenu row still ends its branch and lands focus back on the
    // opening row.
    const command = vi.fn();
    render(<Menu closeOnSelect={false} trigger={<button>Open</button>} items={[{ id: "reports", label: "Reports", items: [{ id: "monthly", label: "Monthly", command }]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Reports" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Monthly" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Reports" })).toHaveFocus());
  });
  it("keeps the submenu open for a row-level opt-out", () => {
    // The effort-row flow: the author pins this specific row, submenu stays.
    const command = vi.fn();
    render(<Menu trigger={<button>Open</button>} items={[{ id: "effort", label: "Effort", items: [{ id: "low", label: "Low", closeOnSelect: false, command }]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Effort" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Low" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("menu")).toHaveLength(2);
    expect(screen.getByRole("menuitem", { name: "Low" })).toBeInTheDocument();
  });
  it("collapses inline sections without closing the menu", async () => {
    const command = vi.fn();
    render(<Menu submenuMode="inline" items={[{ id: "reports", label: "Reports", items: [{ id: "monthly", label: "Monthly", command }]}]} />);
    fireEvent.click(screen.getByRole("menuitem", { name: "Reports" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Monthly" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Reports" })).toHaveFocus());
  });
  it("leaves checkable submenu rows sitting open where they are", () => {
    const check = vi.fn();
    render(<Menu trigger={<button>Open</button>} items={[{ id: "include", label: "Include", items: [{ id: "toc", label: "TOC", type: "checkbox", checked: false, onCheckedChange: check }]}]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Include" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "TOC" }));
    expect(check).toHaveBeenCalledWith(true);
    expect(screen.getAllByRole("menu")).toHaveLength(2);
  });
  it("floors the popup at width and caps content growth at maxWidth, with the viewport clamp on top", () => {
    render(<Menu trigger={<button>Open</button>} open items={[{ id: "a", label: "Alpha" }]} />);
    const popup = Array.from(document.querySelectorAll<HTMLElement>("div")).find(el => el.style.position === "fixed")!;
    expect(popup.style.minWidth).toBe("256px");
    expect(popup.style.maxWidth).toBe("min(380px, calc(100vw - 16px))");
    expect(popup.style.width).toBe(""); // content-driven, never fixed
  });
  it("width and maxWidth pass through to the popup as floor and cap", () => {
    render(<Menu trigger={<button>Open</button>} open width={300} maxWidth={460} items={[{ id: "a", label: "Alpha" }]} />);
    const popup = Array.from(document.querySelectorAll<HTMLElement>("div")).find(el => el.style.position === "fixed")!;
    expect(popup.style.minWidth).toBe("300px");
    expect(popup.style.maxWidth).toBe("min(460px, calc(100vw - 16px))");
  });
  it("inline menus floor and cap instead of fixing a width", () => {
    const { container } = render(<Menu width={300} maxWidth={460} items={[{ id: "a", label: "Alpha" }]} />);
    const box = Array.from(container.querySelectorAll<HTMLElement>("div")).find(el => el.style.minWidth === "300px")!;
    expect(box.style.maxWidth).toBe("min(460px, 100%)");
    expect(box.style.width).toBe("");
  });
});

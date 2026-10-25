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
    render(<Menu items={items} />);
    const parent = screen.getByRole("menuitem", { name: "Reports" });
    fireEvent.keyDown(parent, { key: "ArrowRight" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Monthly" })).toHaveFocus());
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(parent).toHaveFocus();
    expect(screen.queryByRole("menuitem", { name: "Monthly" })).toBeNull();
  });
  it("leaves controlled expansion with its owner", () => {
    const change = vi.fn();
    render(<Menu items={items} expandedKeys={[]} onExpandedKeysChange={change} />);
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
    expect(screen.queryByRole("menu")).toBeNull();
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

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { MenuButton } from "./MenuButton";
import type { MenuItem } from "../Menu/types";

const items: MenuItem[] = [
  { id: "sonnet", label: "Sonnet 5.5", description: "Most efficient for simpler tasks" },
  { id: "effort", label: "Effort", submenuHeader: "Higher effort means more thorough responses.", items: [
    { id: "low", label: "Low" }, { id: "medium", label: "Medium" }, { id: "max", label: "Max" },
  ] },
  { id: "more", label: "More models", items: [{ id: "opus", label: "Opus 5.5" }] },
];

describe("MenuButton", () => {
  it("renders the trigger slots with menu trigger semantics", () => {
    render(<MenuButton icon="Brain" title="Sonnet 5.5" subtitle="Most efficient for simpler tasks" pill={{ label: "Medium", tone: "amber" }} items={items} />);
    const trigger = screen.getByRole("button", { name: /Sonnet 5\.5/ });
    expect(trigger).toHaveTextContent("Most efficient for simpler tasks");
    expect(trigger).toHaveTextContent("Medium");
    expect(trigger.querySelector("svg")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("hides the caret on request", () => {
    render(<MenuButton title="Model" caret={false} items={items} />);
    expect(screen.getByRole("button").querySelectorAll("svg")).toHaveLength(0);
  });
  it("renders a raw node pill verbatim", () => {
    render(<MenuButton title="Model" pill={<mark>Pro</mark>} items={items} />);
    expect(screen.getByRole("button")).toHaveTextContent("Pro");
  });
  it("opens on click, reports open state and closes on select", async () => {
    const onSelect = vi.fn(); const onOpenChange = vi.fn();
    render(<MenuButton title="Model" items={items} onSelect={onSelect} onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: /Model/ });
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("menuitem", { name: "Sonnet 5.5" }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "sonnet" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
  it("opens on ArrowDown and restores focus to the trigger on Escape", async () => {
    render(<MenuButton title="Model" items={items} />);
    const trigger = screen.getByRole("button", { name: /Model/ });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Sonnet 5.5" })).toHaveFocus());
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("checks the selected row and echoes it on its submenu parent", () => {
    render(<MenuButton title="Model" selectedKey="medium" items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /Model/ }));
    expect(screen.getByRole("menuitem", { name: "Effort" })).toHaveTextContent("Medium");
    fireEvent.click(screen.getByRole("menuitem", { name: "Effort" }));
    expect(screen.getByRole("menuitemradio", { name: "Medium" })).toHaveAttribute("aria-checked", "true");
  });
  it("renders the submenu header only while the submenu is open", () => {
    render(<MenuButton title="Model" items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /Model/ }));
    expect(screen.queryByText(/Higher effort/)).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Effort" }));
    expect(screen.getByText(/Higher effort/)).toBeInTheDocument();
  });
  it("renders menu header and footer inside the popup", () => {
    render(<MenuButton title="Model" items={items} menuHeader={<strong>Picker</strong>} menuFooter="Plan note" />);
    fireEvent.click(screen.getByRole("button", { name: /Model/ }));
    expect(screen.getByText("Picker")).toBeInTheDocument();
    expect(screen.getByText("Plan note")).toBeInTheDocument();
  });
  it("keeps a disabled trigger inert", () => {
    render(<MenuButton title="Model" items={items} disabled />);
    fireEvent.click(screen.getByRole("button", { name: /Model/ }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("passes button styling through to the trigger", () => {
    render(<MenuButton title="Model" items={items} variant="outline" color="emerald" size="lg" weight="semibold" />);
    const trigger = screen.getByRole("button", { name: /Model/ });
    expect(trigger).toHaveAttribute("data-variant", "outline");
    expect(trigger).toHaveAttribute("data-color", "emerald");
    expect(trigger).toHaveAttribute("data-size", "lg");
    expect(trigger).toHaveClass("font-semibold");
  });
  it("forwards closeOnSelect so plain rows keep the menu open", () => {
    const command = vi.fn();
    render(<MenuButton title="Pick" items={[{ id: "a", label: "Alpha", command }]} closeOnSelect={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Pick/ }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Alpha" }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("keeps the trigger tooltip out of the way while the menu is open", () => {
    vi.useFakeTimers();
    render(<MenuButton tooltip="Pick a model" title="Model" items={items} />);
    const trigger = screen.getByRole("button", { name: /Model/ });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // Half a second is too twitchy for a trigger this wide — the kit default
    // is a full second.
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // The tip would float over the rows (portal, z 9999) — the open menu owns
    // the space now.
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    // Close: hovering the trigger surfaces the tooltip again.
    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    vi.useRealTimers();
  });
  it("tooltipDelay retunes the trigger tip", () => {
    // The prop rides Button's vocabulary through to the real tooltip, so a
    // dense picker can answer faster than the kit's 1s default.
    vi.useFakeTimers();
    render(
      <MenuButton tooltip="Pick a model" tooltipDelay={100} title="Model" items={items} />,
    );
    const trigger = screen.getByRole("button", { name: /Model/ });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    vi.useRealTimers();
  });
  describe("trigger width", () => {
    it("pins the trigger and keeps the ellipsis chain intact", () => {
      render(
        <MenuButton
          title="Sonnet 5.5 — most efficient for simpler tasks"
          subtitle="Free plan · 3 agents"
          width={220}
          items={items}
        />,
      );
      const trigger = screen.getByRole("button", { name: /Sonnet 5.5/ });
      expect(trigger.style.width).toBe("220px");
      // The shrink chain an ellipsis depends on: the column has to be allowed
      // to drop below its content width, and every line has to clip rather
      // than push the box wider.
      const column = trigger.querySelector("span")!;
      expect(column).toHaveClass("min-w-0");
      const lines = Array.from(column.children) as HTMLElement[];
      expect(lines).toHaveLength(2);
      for (const line of lines) expect(line).toHaveClass("truncate");
    });

    it("maxWidth caps a content-sized trigger, and a CSS length passes through", () => {
      render(<MenuButton title="Model" maxWidth="16rem" items={items} />);
      expect(screen.getByRole("button", { name: /Model/ }).style.maxWidth).toBe("16rem");
    });

    it("keeps the caller's own style keys while the width props win", () => {
      render(<MenuButton title="Model" width={200} style={{ marginTop: 4 }} items={items} />);
      const trigger = screen.getByRole("button", { name: /Model/ });
      expect(trigger.style.marginTop).toBe("4px");
      expect(trigger.style.width).toBe("200px");
    });

    it("never leaks the width props onto the DOM as attributes", () => {
      render(<MenuButton title="Model" width={200} maxWidth={300} items={items} />);
      const trigger = screen.getByRole("button", { name: /Model/ });
      expect(trigger.hasAttribute("width")).toBe(false);
      expect(trigger.hasAttribute("maxwidth")).toBe(false);
    });
  });
  it("menuMaxWidth sets the popup growth cap next to the width floor", () => {
    render(<MenuButton title="Model" open menuWidth={300} menuMaxWidth={460} items={items} />);
    const popup = Array.from(document.querySelectorAll<HTMLElement>("div")).find(el => el.style.position === "fixed")!;
    expect(popup.style.minWidth).toBe("300px");
    expect(popup.style.maxWidth).toBe("min(460px, calc(100vw - 16px))");
  });
});

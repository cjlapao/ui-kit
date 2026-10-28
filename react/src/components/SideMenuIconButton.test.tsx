import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SideMenuIconButton } from "./SideMenuIconButton";
import SideMenu from "./SideMenu";
import Menu from "./Menu/Menu";
import Popover from "./Popover";

describe("SideMenuIconButton", () => {
  it("anchors a Menu to one native button and preserves caller handlers", () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    render(<Menu trigger={<SideMenuIconButton ref={ref} icon="User" label="Account trigger" onClick={click} />}
      items={[{ id: "profile", label: "Profile" }]} />);
    const button = screen.getByRole("button", { name: "Account trigger" });
    expect(ref.current).toBe(button);
    expect(button.querySelector("button")).toBeNull();
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Profile" })).toBeInTheDocument();
  });

  it("opens a Popover through the button tile", () => {
    render(<Popover trigger={<SideMenuIconButton icon="User" label="Status trigger" />}>Connection ready</Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Status trigger" }));
    expect(screen.getByText("Connection ready")).toBeInTheDocument();
  });

  it("inherits collapse and tone in the footer and reveals its label when expanded", () => {
    const footer = vi.fn(() => <SideMenuIconButton icon="User" label="Footer account" active />);
    const view = (collapsed: boolean) => <MemoryRouter><SideMenu responsive={false} fullHeight collapsible collapsed={collapsed}
      onToggleCollapse={() => {}} color="emerald" side="right" items={[]} footer={footer} /></MemoryRouter>;
    const { rerender } = render(view(true));
    expect(footer).toHaveBeenLastCalledWith({ collapsed: true, side: "right" });
    expect(screen.queryByText("Footer account")).toBeNull();
    expect(screen.getByRole("button", { name: "Footer account" }).className).toContain("emerald");
    rerender(view(false));
    expect(screen.getByText("Footer account")).toBeInTheDocument();
    expect(footer).toHaveBeenLastCalledWith({ collapsed: false, side: "right" });
  });

  it("disables loading and disabled triggers", () => {
    const click = vi.fn();
    const { rerender } = render(<SideMenuIconButton label="Wait" loading onClick={click} />);
    const button = screen.getByRole("button", { name: "Wait" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(click).not.toHaveBeenCalled();
    rerender(<SideMenuIconButton label="Wait" disabled onClick={click} />);
    expect(button).toBeDisabled();
  });
});

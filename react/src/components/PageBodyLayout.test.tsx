import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PageBodyLayout } from "./PageBodyLayout";
import SidePanel from "./SidePanel";

describe("PageBodyLayout", () => {
  it("places the bottom under the centre, between full-height side zones", () => {
    const { container } = render(<PageBodyLayout header={<h1>Workspace</h1>} left="Steps" right="Files" bottom="Output">Centre</PageBodyLayout>);
    const center = container.querySelector('[data-page-region="center"]')!;
    const bottom = container.querySelector('[data-page-region="bottom"]')!;
    const left = container.querySelector('[data-page-region="left"]')!;
    expect(center.parentElement).toBe(bottom.parentElement);
    expect(center.parentElement).not.toBe(left.parentElement);
    expect(screen.getByRole("heading", { name: "Workspace" })).toBeInTheDocument();
  });

  it("is only zones: no toggles, no separators, no sizes of its own", () => {
    const { container } = render(<PageBodyLayout left="Steps" right="Files" bottom="Output">Centre</PageBodyLayout>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("separator")).toBeNull();
    for (const zone of ["left", "right", "bottom"]) {
      const el = container.querySelector(`[data-page-region="${zone}"]`) as HTMLElement;
      expect(el.style.width).toBe("");
      expect(el.style.height).toBe("");
    }
  });

  it("omits zones given false or null", () => {
    const { container } = render(<PageBodyLayout left={false} right={null}>Centre</PageBodyLayout>);
    expect(container.querySelector('[data-page-region="left"]')).toBeNull();
    expect(container.querySelector('[data-page-region="right"]')).toBeNull();
  });

  it("lets a docked SidePanel collapse itself while its zone follows", () => {
    const { container } = render(
      <PageBodyLayout right={<SidePanel docked isOpen collapsible width={300} title="Files"><input aria-label="Draft" defaultValue="Kept" /></SidePanel>}>Centre</PageBodyLayout>,
    );
    const shell = container.querySelector('[data-page-region="right"] [data-sp-shell]') as HTMLElement;
    expect(shell.style.width).toBe("300px");
    fireEvent.change(screen.getByRole("textbox", { name: "Draft", hidden: true }), { target: { value: "Unsaved" } });
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    expect(shell.style.width).toBe("56px");
    fireEvent.click(screen.getByRole("button", { name: "Expand panel" }));
    expect(shell.style.width).toBe("300px");
    expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue("Unsaved");
  });
});

describe("PageBodyLayout — none", () => {
  it.each(["none", "plain"] as const)("%s draws no surface and no outer padding, leaving only the zone gaps", (variant) => {
    const { container } = render(<PageBodyLayout variant={variant} gap={12} left="Steps">Centre</PageBodyLayout>);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-page-layout", "none");
    expect(root.className).not.toMatch(/border|bg-|shadow/);
    const row = container.querySelector('[data-page-region="left"]')!.parentElement as HTMLElement;
    expect(row.style.paddingLeft).toBe("");
    expect(row.style.paddingTop).toBe("0px");
    expect(row.style.gap).toBe("12px");
  });
});

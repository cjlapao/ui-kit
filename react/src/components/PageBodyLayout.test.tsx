import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PageBodyLayout } from "./PageBodyLayout";

const files = { label: "Files", defaultSize: 280, minSize: 160, maxSize: 400, content: <input aria-label="Draft" defaultValue="Kept" /> };
describe("PageBodyLayout", () => {
  it("places the bottom under the centre, between full-height side regions", () => {
    const { container } = render(<PageBodyLayout header={<h1>Workspace</h1>} left={{ label: "Rail", content: "Steps" }} right={files} bottom={{ label: "Terminal", content: "Output" }}>Centre</PageBodyLayout>);
    const center = container.querySelector('[data-page-region="center"]')!;
    const bottom = container.querySelector('[data-page-region="bottom"]')!;
    const left = container.querySelector('[data-page-region="left"]')!;
    expect(center.parentElement).toBe(bottom.parentElement);
    expect(center.parentElement).not.toBe(left.parentElement);
    expect(screen.getByRole("heading", { name: "Workspace" })).toBeInTheDocument();
  });
  it("resizes the right and bottom with mirrored keyboard directions and clamps limits", () => {
    const { container } = render(<PageBodyLayout right={files} bottom={{ label: "Terminal", content: "Output", defaultSize: 180, minSize: 80, maxSize: 300 }}>Centre</PageBodyLayout>);
    const right = screen.getByRole("separator", { name: "Resize Files" });
    fireEvent.keyDown(right, { key: "ArrowLeft" });
    expect(right).toHaveAttribute("aria-valuenow", "300");
    expect(container.querySelector('[data-page-region="right"]')).toHaveStyle({ width: "300px" });
    fireEvent.keyDown(right, { key: "End" });
    fireEvent.keyDown(right, { key: "ArrowLeft" });
    expect(right).toHaveAttribute("aria-valuenow", "400");
    const bottom = screen.getByRole("separator", { name: "Resize Terminal" });
    fireEvent.keyDown(bottom, { key: "ArrowUp" });
    expect(bottom).toHaveAttribute("aria-valuenow", "200");
    fireEvent.keyDown(bottom, { key: "Home" });
    expect(bottom).toHaveAttribute("aria-valuenow", "80");
  });
  it("drags the right panel and restores document interaction styles", () => {
    render(<PageBodyLayout right={files}>Centre</PageBodyLayout>);
    const separator = screen.getByRole("separator");
    fireEvent.pointerDown(separator, { button: 0, clientX: 500 });
    fireEvent.pointerMove(window, { clientX: 460 });
    expect(separator).toHaveAttribute("aria-valuenow", "320");
    fireEvent.pointerUp(window);
    expect(document.body.style.cursor).toBe("");
    expect(document.body.style.userSelect).toBe("");
  });
  it("preserves child state and expanded dimensions when collapsing", () => {
    const { container } = render(<PageBodyLayout right={files}>Centre</PageBodyLayout>);
    fireEvent.change(screen.getByRole("textbox", { name: "Draft" }), { target: { value: "Unsaved" } });
    fireEvent.click(screen.getByRole("button", { name: "Collapse Files" }));
    expect(screen.queryByRole("separator")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(container.querySelector('[data-page-region="right"]')).toHaveAttribute("data-collapsed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Expand Files" }));
    expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue("Unsaved");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "280");
  });
  it("notifies controlled dimensions and collapse without overriding them", () => {
    const onSizeChange = vi.fn(); const onCollapsedChange = vi.fn();
    render(<PageBodyLayout right={{ ...files, size: 250, collapsed: false, onSizeChange, onCollapsedChange }}>Centre</PageBodyLayout>);
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });
    expect(onSizeChange).toHaveBeenCalledWith(270);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "250");
    fireEvent.click(screen.getByRole("button", { name: "Collapse Files" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

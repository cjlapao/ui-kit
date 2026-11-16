import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import WorkflowTrackerRail from "./WorkflowTrackerRail";

afterEach(() => vi.unstubAllGlobals());
const controls = () => <button>Agent controls</button>;
const handle = () => screen.getByRole("separator", { name: "Resize workflow footer" });

describe("WorkflowTrackerRail footer split", () => {
  it("separates the footer and steps into independent viewports at 30%", () => {
    const { container } = render(<WorkflowTrackerRail fillHeight renderControls={controls} />);
    const footer = screen.getByRole("region", { name: "Workflow footer" });
    const stepViewport = container.querySelector("ol")!.closest('[data-slot="scrollarea-viewport"]')!;
    const footerViewport = footer.querySelector('[data-slot="scrollarea-viewport"]')!;
    expect(stepViewport).not.toBe(footerViewport);
    expect(stepViewport).not.toContainElement(screen.getByRole("button", { name: "Agent controls" }));
    expect(footerViewport).toContainElement(screen.getByRole("button", { name: "Agent controls" }));
    expect(footer.style.flexGrow).toBe("30");
    expect(stepViewport.parentElement?.style.flexGrow).toBe("70");
    expect(screen.queryByRole("separator")).toBeNull();
  });
  it("supports keyboard resizing and clamps both ends", () => {
    const onChange = vi.fn();
    render(<WorkflowTrackerRail fillHeight footerResizable renderControls={controls} onFooterHeightChange={onChange} />);
    fireEvent.keyDown(handle(), { key: "ArrowUp" });
    expect(handle()).toHaveAttribute("aria-valuenow", "35");
    fireEvent.keyDown(handle(), { key: "ArrowDown", shiftKey: true });
    expect(handle()).toHaveAttribute("aria-valuenow", "25");
    fireEvent.keyDown(handle(), { key: "End" });
    fireEvent.keyDown(handle(), { key: "ArrowUp" });
    expect(handle()).toHaveAttribute("aria-valuenow", "80");
    fireEvent.keyDown(handle(), { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(10);
  });
  it("supports controlled sizing and preserves it through collapse", () => {
    const onChange = vi.fn();
    const props = { fillHeight: true, collapsible: true, footerResizable: true, renderControls: controls, onFooterHeightChange: onChange };
    const { rerender } = render(<WorkflowTrackerRail {...props} footerHeight={40} />);
    const content = screen.getByRole("button", { name: "Agent controls" });
    fireEvent.keyDown(handle(), { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(45);
    expect(handle()).toHaveAttribute("aria-valuenow", "40");
    rerender(<WorkflowTrackerRail {...props} footerHeight={55} collapsed />);
    expect(handle()).toHaveAttribute("aria-valuenow", "55");
    expect(screen.getByRole("button", { name: "Agent controls" })).toBe(content);
  });
  it("does not render a handle without footer content or constrained height", () => {
    const { rerender } = render(<WorkflowTrackerRail fillHeight footerResizable />);
    expect(screen.queryByRole("separator")).toBeNull();
    rerender(<WorkflowTrackerRail footerResizable renderControls={controls} />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(screen.getByRole("button", { name: "Agent controls" })).toBeInTheDocument();
  });
  it("keeps the footer and its size while loading", () => {
    render(<WorkflowTrackerRail fillHeight loading footerResizable defaultFooterHeight={45} renderControls={controls} footerLabel="Agents" footerResizeLabel="Resize agents" />);
    expect(screen.getByRole("region", { name: "Agents" })).toContainElement(screen.getByRole("button", { name: "Agent controls" }));
    expect(screen.getByRole("separator", { name: "Resize agents" })).toHaveAttribute("aria-valuenow", "45");
  });
  it("resizes by pointer movement and stops after cancellation", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    const { container } = render(<WorkflowTrackerRail fillHeight footerResizable renderControls={controls} />);
    const separator = handle();
    const body = separator.parentElement!;
    vi.spyOn(body, "getBoundingClientRect").mockReturnValue({ height: 412 } as DOMRect);
    vi.spyOn(separator, "getBoundingClientRect").mockReturnValue({ height: 12 } as DOMRect);
    fireEvent.pointerDown(separator, { button: 0, clientY: 300 });
    fireEvent.pointerMove(separator, { clientY: 220 });
    expect(handle()).toHaveAttribute("aria-valuenow", "50");
    fireEvent.pointerCancel(separator);
    fireEvent.pointerMove(separator, { clientY: 100 });
    expect(handle()).toHaveAttribute("aria-valuenow", "50");
    expect(container.querySelector("ol")).toBeInTheDocument();
  });
});

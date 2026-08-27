import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";

import ConnectionFlow from "./ConnectionFlow";
import type { ConnectionFlowNode } from "../../connectionFlow";

const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "A", subtitle: "one" },
  {
    id: "b",
    title: "B",
    items: Array.from({ length: 5 }, (_, i) => ({
      id: `i${i}`,
      title: `Item ${i}`,
    })),
  },
];

/**
 * The viewport pans by capturing the pointer. Capture redirects every later
 * pointer event — `pointerup` included — to the capturing element, so a press
 * that started on a control never produces a click on it: the zoom buttons and
 * "show more" did nothing at all.
 */
describe("ConnectionFlow viewport", () => {
  const viewportOf = (container: HTMLElement) =>
    container.querySelector<HTMLElement>(".overscroll-contain")!;

  it("does not start a pan from a control", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const viewport = viewportOf(container);
    const capture = vi.fn();
    viewport.setPointerCapture = capture;

    const button = container.querySelector<HTMLElement>("button")!;
    fireEvent.pointerDown(button, { button: 0, pointerId: 1 });
    expect(capture).not.toHaveBeenCalled();
  });

  it("still pans from the canvas itself", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const viewport = viewportOf(container);
    const capture = vi.fn();
    viewport.setPointerCapture = capture;
    viewport.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(viewport, { button: 0, pointerId: 1 });
    expect(capture).toHaveBeenCalled();
  });

  it("opens at 100%, not at whatever fits", () => {
    // The viewport scrolls, so a graph larger than its frame is reachable
    // without shrinking it to illegibility.
    const { getByTitle } = render(<ConnectionFlow nodes={NODES} />);
    expect(getByTitle("Zoom level").textContent).toBe("100%");
  });

  it("zooms in and out from the toolbar", () => {
    const onZoomChange = vi.fn();
    const { getByLabelText, getByTitle } = render(
      <ConnectionFlow nodes={NODES} onZoomChange={onZoomChange} />,
    );
    fireEvent.click(getByLabelText("Zoom in"));
    expect(onZoomChange).toHaveBeenLastCalledWith(1.2);
    expect(getByTitle("Zoom level").textContent).toBe("120%");

    fireEvent.click(getByLabelText("Zoom out"));
    expect(getByTitle("Zoom level").textContent).toBe("100%");
  });

  it("resets the zoom from its own button", () => {
    // The percentage used to carry the reset, which nothing about a readout
    // announces.
    const { getByLabelText, getByTitle } = render(<ConnectionFlow nodes={NODES} />);
    fireEvent.click(getByLabelText("Zoom in"));
    fireEvent.click(getByLabelText("Zoom in"));
    expect(getByTitle("Zoom level").textContent).not.toBe("100%");
    fireEvent.click(getByLabelText("Reset zoom to 100%"));
    expect(getByTitle("Zoom level").textContent).toBe("100%");
  });

  it("sizes the canvas to the content so the viewport can scroll to it", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const canvas = viewportOf(container).firstElementChild as HTMLElement;
    expect(parseFloat(canvas.style.width)).toBeGreaterThan(0);
    expect(parseFloat(canvas.style.height)).toBeGreaterThan(0);
  });

  it("expands a card from the show-more button", () => {
    const { getByText, queryByText } = render(<ConnectionFlow nodes={NODES} />);
    expect(queryByText("Item 4")).toBeNull();
    fireEvent.click(getByText("Show 3 more"));
    expect(queryByText("Item 4")).toBeTruthy();
  });
});

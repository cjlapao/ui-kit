import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";

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
  it("frames one or multiple active cards, pauses on zoom and resumes", () => {
    const observers: { callback: ResizeObserverCallback; target?: Element }[] = [];
    vi.stubGlobal("ResizeObserver", class {
      entry: { callback: ResizeObserverCallback; target?: Element };
      constructor(callback: ResizeObserverCallback) { this.entry = { callback }; observers.push(this.entry); }
      observe(target: Element) { this.entry.target = target; }
      disconnect() {}
    });
    const nodes: ConnectionFlowNode[] = Array.from({ length: 6 }, (_, i) => ({ id: String(i), title: `Step ${i}` }));
    const change = vi.fn();
    const view = (ids: string[]) => <ConnectionFlow nodes={nodes} defaultFollowMode="following" activeNodeIds={ids} followDuration={0} minZoom={.05} onFollowModeChange={change} />;
    const { container, rerender, getByTitle, getByLabelText, getByRole } = render(view(["0"]));
    const viewport = container.querySelector('[data-slot="scrollarea-viewport"]')!;
    act(() => observers.filter(o => o.target === viewport).forEach(o => o.callback([{ target: viewport, contentRect: { width: 600, height: 300 } } as ResizeObserverEntry], {} as ResizeObserver)));
    const closeZoom = Number(getByTitle("Zoom level").textContent?.replace("%", ""));
    expect(closeZoom).toBeGreaterThan(100);
    rerender(view(["0", "5"]));
    const wideZoom = Number(getByTitle("Zoom level").textContent?.replace("%", ""));
    expect(wideZoom).toBeLessThan(closeZoom);
    fireEvent.click(getByLabelText("Zoom in"));
    expect(change).toHaveBeenLastCalledWith("paused");
    const manualZoom = getByTitle("Zoom level").textContent;
    rerender(view(["3"]));
    expect(getByTitle("Zoom level").textContent).toBe(manualZoom);
    fireEvent.click(getByRole("button", { name: "Resume following" }));
    expect(change).toHaveBeenLastCalledWith("following");
    expect(Number(getByTitle("Zoom level").textContent?.replace("%", ""))).toBeGreaterThan(wideZoom);
  });
  it("requests controlled follow changes without taking ownership", () => {
    const change = vi.fn();
    const { getByRole } = render(<ConnectionFlow nodes={NODES} followMode="off" onFollowModeChange={change} />);
    fireEvent.click(getByRole("button", { name: "Follow active" }));
    expect(change).toHaveBeenCalledWith("following");
    expect(getByRole("button", { name: "Follow active" })).toHaveAttribute("aria-pressed", "false");
  });
  const viewportOf = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[data-slot="scrollarea-viewport"]')!;
  const frameOf = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[data-slot="scrollarea"]')!;

  it("scrolls through the kit ScrollArea, not a native bar", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    // One ScrollArea is the viewport itself…
    expect(container.querySelector('[data-slot="scrollarea-viewport"]')).toBe(
      viewportOf(container),
    );
    // …and its bars are virtual, shown per the variant.
    expect(
      frameOf(container).querySelector('[data-slot="scrollarea-scrollbar"]'),
    ).toBeTruthy();
  });

  it("does not start a pan from a control", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const capture = vi.fn();
    frameOf(container).setPointerCapture = capture;

    const button = container.querySelector<HTMLElement>("button")!;
    fireEvent.pointerDown(button, { button: 0, pointerId: 1 });
    expect(capture).not.toHaveBeenCalled();
  });

  it("does not start a pan from a scrollbar thumb", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const capture = vi.fn();
    frameOf(container).setPointerCapture = capture;

    const thumb = frameOf(container).querySelector<HTMLElement>(
      '[data-slot="scrollarea-scrollbar"]',
    )!;
    fireEvent.pointerDown(thumb, { button: 0, pointerId: 1 });
    expect(capture).not.toHaveBeenCalled();
  });

  it("still pans from the canvas itself", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    const capture = vi.fn();
    frameOf(container).setPointerCapture = capture;
    frameOf(container).releasePointerCapture = vi.fn();

    fireEvent.pointerDown(viewportOf(container), { button: 0, pointerId: 1 });
    expect(capture).toHaveBeenCalled();
  });

  it("leaves a plain wheel to the page", () => {
    // Only dragging pans the flow. Its viewport cannot consume a native wheel.
    const onZoomChange = vi.fn();
    const { container, getByTitle } = render(
      <ConnectionFlow nodes={NODES} onZoomChange={onZoomChange} />,
    );
    const notCancelled = fireEvent.wheel(viewportOf(container), {
      deltaY: -120,
    });
    expect(viewportOf(container)).toHaveClass("!overflow-hidden");
    expect(viewportOf(container)).not.toHaveClass("overscroll-contain");
    expect(notCancelled).toBe(true);
    expect(onZoomChange).not.toHaveBeenCalled();
    expect(getByTitle("Zoom level").textContent).toBe("100%");
  });

  it("zooms on Ctrl- and Cmd-wheel, cancelling the browser gesture", () => {
    // Trackpad pinch arrives as a Ctrl-wheel, so this is pinch-zoom too;
    // cancelling it is what keeps the browser page from zooming as well.
    const { container, getByTitle } = render(<ConnectionFlow nodes={NODES} />);
    const viewport = viewportOf(container);
    const cancelled = fireEvent.wheel(viewport, {
      deltaY: -120,
      ctrlKey: true,
    });
    expect(cancelled).toBe(false);
    expect(getByTitle("Zoom level").textContent).toBe("110%");

    fireEvent.wheel(viewport, { deltaY: -120, metaKey: true });
    expect(getByTitle("Zoom level").textContent).toBe("121%");
  });

  it("ignores the wheel entirely when not interactive", () => {
    const { container, getByTitle } = render(
      <ConnectionFlow nodes={NODES} interactive={false} />,
    );
    fireEvent.wheel(viewportOf(container), { deltaY: -120, ctrlKey: true });
    expect(getByTitle("Zoom level").textContent).toBe("100%");
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
    const { getByLabelText, getByTitle } = render(
      <ConnectionFlow nodes={NODES} />,
    );
    fireEvent.click(getByLabelText("Zoom in"));
    fireEvent.click(getByLabelText("Zoom in"));
    expect(getByTitle("Zoom level").textContent).not.toBe("100%");
    fireEvent.click(getByLabelText("Reset zoom to 100%"));
    expect(getByTitle("Zoom level").textContent).toBe("100%");
  });

  it("sizes the canvas to the content so the viewport can scroll to it", () => {
    const { container } = render(<ConnectionFlow nodes={NODES} />);
    // One level in sits ScrollArea's content wrapper; the canvas is inside.
    const content = viewportOf(container).firstElementChild as HTMLElement;
    const canvas = content.firstElementChild as HTMLElement;
    expect(parseFloat(canvas.style.width)).toBeGreaterThan(0);
    expect(parseFloat(canvas.style.height)).toBeGreaterThan(0);
  });

  it("scrolls a capped card body with a ScrollArea of its own", () => {
    // Nested bars: the card belongs to the area, so it gets the same hover
    // behaviour as the viewport — never a native bar.
    const nodes: ConnectionFlowNode[] = [
      {
        id: "capped",
        title: "Capped",
        maxHeight: 80,
        items: [
          ...Array.from({ length: 8 }, (_, i) => ({
            id: `x${i}`,
            title: `Row ${i}`,
          })),
        ],
      },
    ];
    const { container } = render(<ConnectionFlow nodes={nodes} />);
    // Both viewports leave native wheel scrolling to the page.
    for (const viewport of container.querySelectorAll(
      '[data-slot="scrollarea-viewport"]',
    ))
      expect(viewport).toHaveClass("!overflow-hidden");
    // The viewport ScrollArea plus the card's own.
    expect(
      container.querySelectorAll('[data-slot="scrollarea"]').length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("expands a card from the show-more button", () => {
    const { getByText, queryByText } = render(<ConnectionFlow nodes={NODES} />);
    expect(queryByText("Item 4")).toBeNull();
    fireEvent.click(getByText("Show 3 more"));
    expect(queryByText("Item 4")).toBeTruthy();
  });
});

describe("ConnectionFlow manual zoom ownership", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("does not auto-fit over manual zoom after a viewport resize", () => {
    let width = 700;
    const observers: { callback: ResizeObserverCallback; target?: Element }[] =
      [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        entry: { callback: ResizeObserverCallback; target?: Element };
        constructor(callback: ResizeObserverCallback) {
          this.entry = { callback };
          observers.push(this.entry);
        }
        observe(target: Element) {
          this.entry.target = target;
        }
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
      () => width,
    );
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(260);
    const { container, getByTitle, getByLabelText } = render(
      <ConnectionFlow nodes={NODES} fitOnLoad />,
    );
    const viewport = container.querySelector(
      '[data-slot="scrollarea-viewport"]',
    )!;
    const resize = () =>
      act(() => {
        for (const observer of observers)
          if (observer.target === viewport)
            observer.callback(
              [
                {
                  target: viewport,
                  contentRect: { width, height: 260 },
                } as ResizeObserverEntry,
              ],
              {} as ResizeObserver,
            );
      });
    resize();
    fireEvent.click(getByLabelText("Zoom in"));
    const zoom = getByTitle("Zoom level").textContent;
    width = 600;
    resize();
    expect(getByTitle("Zoom level").textContent).toBe(zoom);
  });
  it("captures Ctrl-wheel over the floating toolbar without capturing plain scrolling", () => {
    const { getByLabelText, getByTitle } = render(
      <ConnectionFlow nodes={NODES} />,
    );
    const toolbar = getByLabelText("Zoom in").parentElement!;
    expect(fireEvent.wheel(toolbar, { deltaY: -120 })).toBe(true);
    expect(getByTitle("Zoom level")).toHaveTextContent("100%");
    expect(fireEvent.wheel(toolbar, { deltaY: -120, ctrlKey: true })).toBe(
      false,
    );
    expect(getByTitle("Zoom level")).toHaveTextContent("110%");
  });
});

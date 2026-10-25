import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ScrollArea from "./ScrollArea";

const viewport = () =>
  document.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement;
const bars = () =>
  Array.from(document.querySelectorAll('[data-slot="scrollarea-scrollbar"]'));

/** Make the viewport report a vertical overflow, then let it re-measure. */
const overflowY = (element: HTMLElement, height: number) => {
  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    value: height,
  });
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    value: 100,
  });
  fireEvent.scroll(element);
};

/** The same, sideways — the axis a nav list must never answer to. */
const overflowX = (element: HTMLElement, width: number) => {
  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: 100,
  });
  fireEvent.scroll(element);
};

describe("ScrollArea", () => {
  it("controls a virtual viewport in logical units with hover-only bars", () => {
    const onScroll = vi.fn();
    render(
      <ScrollArea
        variant="hover"
        virtualScroll={{
          contentSize: 100,
          viewportSize: 10,
          offset: 0,
          onScroll,
        }}
      >
        <div>Virtual engine</div>
      </ScrollArea>,
    );
    expect(bars()).toHaveLength(1);
    const bar = bars()[0];
    const handle = bar.querySelector(
      '[data-slot="scrollarea-handle"]',
    ) as HTMLElement;
    Object.defineProperty(handle.parentElement, "clientHeight", {
      configurable: true,
      value: 100,
    });
    handle.setPointerCapture = vi.fn();
    fireEvent.scroll(viewport());
    expect(bar).toHaveAttribute("data-state", "hidden");
    fireEvent.pointerEnter(document.querySelector('[data-slot="scrollarea"]')!);
    expect(bar).toHaveAttribute("data-state", "visible");
    fireEvent(
      handle,
      new MouseEvent("pointerdown", { bubbles: true, clientY: 0 }),
    );
    fireEvent(
      handle,
      new MouseEvent("pointermove", { bubbles: true, clientY: 38 }),
    );
    expect(onScroll).toHaveBeenCalledWith(45);
    expect(viewport()).toHaveStyle({ overflow: "hidden" });
  });

  it("renders viewport, content, both bars, handles and the corner", () => {
    render(
      <ScrollArea className="h-40">
        <p>content</p>
      </ScrollArea>,
    );
    expect(viewport()).toBeTruthy();
    expect(
      document.querySelector('[data-slot="scrollarea-content"]'),
    ).toBeTruthy();
    const tracks = bars();
    expect(tracks).toHaveLength(2);
    expect(tracks[0].getAttribute("data-orientation")).toBe("vertical");
    expect(tracks[1].getAttribute("data-orientation")).toBe("horizontal");
    expect(
      document.querySelectorAll('[data-slot="scrollarea-handle"]'),
    ).toHaveLength(2);
    expect(
      document.querySelector('[data-slot="scrollarea-corner"]'),
    ).toBeTruthy();
  });

  it("carries the frame's maximum height into the viewport", () => {
    // A `max-h` frame only scrolls because the viewport inherits the cap —
    // a percentage height would resolve against the frame's *auto* height,
    // the viewport would grow past the cap, and the frame would just clip
    // content it never learned was scrollable. (The picker's row list,
    // capped at `max-h-64`, depends on this.)
    render(
      <ScrollArea className="max-h-64">
        <p>content</p>
      </ScrollArea>,
    );
    expect(viewport().style.maxHeight || viewport().className).toContain(
      "inherit",
    );
  });

  it("hides the bars while everything fits, and keeps the viewport out of the tab order", () => {
    render(
      <ScrollArea variant="always">
        <p>fits</p>
      </ScrollArea>,
    );
    for (const bar of bars())
      expect(bar.getAttribute("data-state")).toBe("hidden");
    expect(viewport().tabIndex).toBe(-1);
  });

  it("a vertical overflow brings the viewport into the tab order and, with `always`, shows the bar", () => {
    render(
      <ScrollArea variant="always">
        <p>content</p>
      </ScrollArea>,
    );
    overflowY(viewport(), 1000);
    expect(viewport().tabIndex).toBe(0);
    expect(viewport().dataset.overflowY).toBe("");
    expect(bars()[0].getAttribute("data-state")).toBe("visible");
    // The horizontal axis still fits, so its bar stays hidden.
    expect(bars()[1].getAttribute("data-state")).toBe("hidden");
  });

  it("`auto` keeps the bar hidden until hover, even while overflowing", () => {
    vi.useFakeTimers();
    try {
      render(
        <ScrollArea>
          <p>content</p>
        </ScrollArea>,
      );
      overflowY(viewport(), 1000);
      expect(bars()[0].getAttribute("data-state")).toBe("visible"); // the scroll itself shows it
      act(() => {
        vi.advanceTimersByTime(900); // ... and it fades once the scrolling lingers out
      });
      expect(bars()[0].getAttribute("data-state")).toBe("hidden");
      fireEvent.pointerEnter(
        document.querySelector('[data-slot="scrollarea"]')!,
      );
      expect(bars()[0].getAttribute("data-state")).toBe("visible");
    } finally {
      vi.useRealTimers();
    }
  });

  it("`hidden` never shows a bar, overflowing or not", () => {
    render(
      <ScrollArea variant="hidden">
        <p>content</p>
      </ScrollArea>,
    );
    overflowY(viewport(), 1000);
    expect(bars()[0].getAttribute("data-state")).toBe("hidden");
  });

  it("scrolling marks the bar visible under `scroll`, and announces the position", () => {
    render(
      <ScrollArea variant="scroll">
        <p>content</p>
      </ScrollArea>,
    );
    overflowY(viewport(), 1000);
    expect(bars()[0].getAttribute("data-state")).toBe("visible");
    expect(bars()[0].getAttribute("role")).toBe("scrollbar");
    expect(bars()[0].getAttribute("aria-controls")).toBe(viewport().id);
    expect(bars()[0].getAttribute("aria-valuenow")).toBe("0");
  });

  it("exposes the variant on the root and merges the caller's class", () => {
    render(
      <ScrollArea variant="hover" className="rounded-lg border">
        <p>content</p>
      </ScrollArea>,
    );
    const root = document.querySelector('[data-slot="scrollarea"]')!;
    expect(root.getAttribute("data-variant")).toBe("hover");
    expect(root.className).toContain("rounded-lg");
    expect(root.className).toContain("relative");
  });

  it("hides native scrollbars on the viewport via utility classes", () => {
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    expect(viewport().className).toContain("[scrollbar-width:none]");
    expect(viewport().className).toContain("[&::-webkit-scrollbar]:hidden");
  });

  it("the content wrapper stretches for horizontal scroll sizing", () => {
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    const content = document.querySelector('[data-slot="scrollarea-content"]')!;
    expect(content.className).toContain("min-w-full");
    expect(content).toHaveTextContent("content");
  });

  it("passes attributes through to the root", () => {
    render(
      <ScrollArea id="sa" data-testid="sa" aria-label="Logs">
        <p>content</p>
      </ScrollArea>,
    );
    expect(screen.getByTestId("sa").id).toBe("sa");
    expect(screen.getByLabelText("Logs")).toBeTruthy();
  });

  it("adds viewport classes and hands the viewport to a forwarded ref", () => {
    // The caller that drives the scroll position itself — pan, zoom
    // anchoring — needs the element that scrolls, not the frame, and the
    // wheel policy that lives on it (`overscroll-contain`).
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ScrollArea viewportRef={ref} viewportClassName="overscroll-contain">
        <p>content</p>
      </ScrollArea>,
    );
    expect(viewport().className).toContain("overscroll-contain");
    expect(ref.current).toBe(viewport());
  });

  describe("horizontal={false} — a region with one axis", () => {
    it("draws no sideways bar at all, even when the content is wider", () => {
      // `scrollWidth` reports content clipped by `overflow-x: hidden` as
      // loudly as content that scrolls, so the bar has to be ruled out at
      // the source: the SideMenu's badge that is too wide for the panel
      // must clip, not grow a scrollbar nobody asked for.
      render(
        <ScrollArea variant="always" horizontal={false}>
          <p>content</p>
        </ScrollArea>,
      );
      overflowX(viewport(), 1000);
      expect(bars().map((b) => b.getAttribute("data-orientation"))).toEqual([
        "vertical",
      ]);
      expect(viewport().dataset.overflowX).toBeUndefined();
      expect(viewport().tabIndex).toBe(-1);
    });

    it("clamps the axis on the scroller, where a class could lose the cascade", () => {
      // An `overflow-x-hidden` class competes with the viewport's own
      // `overflow-auto` and the cascade, not the class order, decides.
      render(
        <ScrollArea horizontal={false}>
          <p>content</p>
        </ScrollArea>,
      );
      expect(viewport().style.overflowX).toBe("hidden");
    });

    it("still scrolls, and still shows the bar, vertically", () => {
      render(
        <ScrollArea variant="always" horizontal={false}>
          <p>content</p>
        </ScrollArea>,
      );
      overflowY(viewport(), 1000);
      expect(bars()).toHaveLength(1);
      expect(bars()[0].getAttribute("data-state")).toBe("visible");
      expect(viewport().style.overflowY).not.toBe("hidden");
      expect(viewport().tabIndex).toBe(0);
    });

    it("keeps both axes by default", () => {
      render(
        <ScrollArea variant="always">
          <p>content</p>
        </ScrollArea>,
      );
      overflowX(viewport(), 1000);
      expect(bars()).toHaveLength(2);
      expect(bars()[1].getAttribute("data-state")).toBe("visible");
      expect(viewport().style.overflowX).toBe("");
    });
  });
});

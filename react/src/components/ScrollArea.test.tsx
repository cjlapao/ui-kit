import { describe, expect, it, vi } from "vitest";
import { Profiler } from "react";
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
  it("contains sticky child stacking below the scrollbar siblings", () => {
    render(<ScrollArea><div className="sticky right-0 z-30">Actions</div></ScrollArea>);
    expect(viewport()).toHaveClass("relative", "z-0");
    for (const bar of bars()) {
      expect(viewport()).not.toContainElement(bar as HTMLElement);
      expect(bar.parentElement).toBe(viewport().parentElement);
    }
  });

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

  it("reserves the bar's lane only while the axis actually scrolls, never on gesture", () => {
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    const content = document.querySelector(
      '[data-slot="scrollarea-content"]',
    ) as HTMLElement;
    // Nothing overflows, no bar can ever exist — the content keeps its
    // full width; a short list should not trail a phantom gutter.
    expect(content.className).not.toContain("pr-2.5");
    overflowY(viewport(), 400);
    expect(content.className).toContain("pr-2.5");
    // The lane follows scrollability, never visibility: the auto/hover
    // thumb appears and hides on gesture, and a gutter tied to that would
    // jog the text sideways on every pointer move.
    fireEvent.pointerEnter(document.querySelector('[data-slot="scrollarea"]')!);
    expect(content.className).toContain("pr-2.5");
    fireEvent.pointerLeave(document.querySelector('[data-slot="scrollarea"]')!);
    expect(content.className).toContain("pr-2.5");
  });

  it("does not reserve the vertical lane for a sideways-only region", () => {
    render(
      <ScrollArea vertical={false}>
        <p>content</p>
      </ScrollArea>,
    );
    overflowX(viewport(), 400);
    const content = document.querySelector(
      '[data-slot="scrollarea-content"]',
    ) as HTMLElement;
    // The lane guards the *vertical* thumb; a region that only scrolls
    // sideways has no thumb on the right edge to keep clear of.
    expect(content.className).not.toContain("pr-2.5");
  });

  it("refunds the lane when the caller's own padding is the lane (gutter=false)", () => {
    // A padded menu list trails its rows with ≥10px already; keeping the
    // content lane on top of that would hang the rows further from the
    // right panel edge than from the left.
    render(
      <ScrollArea gutter={false}>
        <p>content</p>
      </ScrollArea>,
    );
    const content = document.querySelector(
      '[data-slot="scrollarea-content"]',
    ) as HTMLElement;
    expect(content.className).not.toContain("pr-2.5");
    // The bar itself is untouched — the lane refund is content-side only.
    expect(
      document.querySelector('[data-slot="scrollarea-scrollbar"][data-orientation="vertical"]'),
    ).toBeTruthy();
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

  it("supports horizontal-only scrolling", () => {
    render(<ScrollArea vertical={false} variant="always"><p>content</p></ScrollArea>);
    overflowY(viewport(), 1000);
    overflowX(viewport(), 1000);
    expect(viewport().style.overflowY).toBe("hidden");
    expect(viewport().dataset.overflowY).toBeUndefined();
    expect(bars().map(bar => bar.getAttribute("data-orientation"))).toEqual(["horizontal"]);
    expect(bars()[0].getAttribute("data-state")).toBe("visible");
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

    it("lays content out as a block, never a table, so a nowrap row cannot inflate the locked axis", () => {
      // A `table` content box is never narrower than its widest unbreakable
      // content — a truncated menu title would inflate it past the viewport,
      // where the hidden axis slices text mid-word. Block wraps instead.
      render(
        <ScrollArea horizontal={false}>
          <p>content</p>
        </ScrollArea>,
      );
      const content = document.querySelector('[data-slot="scrollarea-content"]')!;
      expect(content).toHaveClass("block", "min-w-full");
      expect(content).not.toHaveClass("table");
    });

    it("keeps the table layout while the axis can scroll — content must be able to widen", () => {
      render(
        <ScrollArea>
          <p>content</p>
        </ScrollArea>,
      );
      const content = document.querySelector('[data-slot="scrollarea-content"]')!;
      expect(content).toHaveClass("table", "min-w-full");
      expect(content).not.toHaveClass("block");
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

// ── The collapse-sweep budget (2026-11): nothing re-renders, nothing
// re-subscribes, when the page merely resizes near an unchanged area ─────────
/**
 * A ResizeObserver spy: counts instances and `observe`/`disconnect` calls and
 * lets a test fire the callback the component would see from the engine.
 */
class SpyResizeObserver {
  static created: SpyResizeObserver[] = [];
  observeCount = 0;
  disconnectCount = 0;
  constructor(public callback: ResizeObserverCallback) {
    SpyResizeObserver.created.push(this);
  }
  observe() {
    this.observeCount += 1;
  }
  unobserve() {}
  disconnect() {
    this.disconnectCount += 1;
  }
  fire() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const flushFrames = async (ms = 40) => {
  await act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, ms));
  });
};

describe("ScrollArea — inside the animation's frame budget", () => {
  it("renders zero extra times when a resize leaves the geometry identical", async () => {
    // The panel-sweep coupling: a collapse elsewhere in the page makes every
    // observing ScrollArea re-measure. Identical geometry must not cost a
    // single render — the guarded `update()` reuses the previous state
    // objects and React bails out entirely.
    SpyResizeObserver.created = [];
    vi.stubGlobal("ResizeObserver", SpyResizeObserver);
    let commits = 0;
    render(
      <Profiler id="scrollarea" onRender={() => { commits += 1; }}>
        <ScrollArea>
          <div>Unchanged content</div>
        </ScrollArea>
      </Profiler>,
    );
    await flushFrames();
    expect(SpyResizeObserver.created).toHaveLength(1);
    const observer = SpyResizeObserver.created[0];
    const before = commits;
    // Viewport AND content callbacks in one frame, no deltas.
    observer.fire();
    observer.fire();
    await flushFrames();
    expect(commits).toBe(before);

    // And the update is genuinely alive, not merely unhooked: real geometry
    // movement still reaches the thumbs.
    Object.defineProperty(viewport(), "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(viewport(), "clientHeight", {
      configurable: true,
      value: 100,
    });
    observer.fire();
    await flushFrames();
    expect(commits).toBeGreaterThan(before);
    vi.unstubAllGlobals();
  });

  it("an inline virtualScroll literal never recreates the observer", () => {
    // A host passing `virtualScroll={{ offset, contentSize, viewportSize }}`
    // as a literal gets a fresh object each render. The subscription depends
    // on the fields (through a latest-ref), so the observer survives all
    // three renders untouched — no teardown, no rebuild, no forced update.
    SpyResizeObserver.created = [];
    vi.stubGlobal("ResizeObserver", SpyResizeObserver);
    const onScroll = vi.fn();
    const view = (
      <ScrollArea
        virtualScroll={{ contentSize: 100, viewportSize: 10, offset: 0, onScroll }}
      >
        <div>engine</div>
      </ScrollArea>
    );
    const { rerender } = render(view);
    expect(SpyResizeObserver.created).toHaveLength(1);
    const observer = SpyResizeObserver.created[0];
    expect(observer.observeCount).toBe(2); // viewport + content, once
    rerender(
      <ScrollArea
        virtualScroll={{ contentSize: 100, viewportSize: 10, offset: 0, onScroll }}
      >
        <div>engine</div>
      </ScrollArea>,
    );
    rerender(
      <ScrollArea
        virtualScroll={{ contentSize: 100, viewportSize: 10, offset: 0, onScroll }}
      >
        <div>engine</div>
      </ScrollArea>,
    );
    expect(SpyResizeObserver.created).toHaveLength(1);
    expect(observer.observeCount).toBe(2);
    expect(observer.disconnectCount).toBe(0);
    vi.unstubAllGlobals();
  });

  it("coalesces both observer callbacks of a frame into one update", async () => {
    // Two callbacks per frame is normal (viewport + content); the rAF batch
    // means the component still runs one measurement pass. Here: even after
    // both fire, the thumb metrics commit at most once per frame — with
    // changing geometry that shows as one render, not two.
    SpyResizeObserver.created = [];
    vi.stubGlobal("ResizeObserver", SpyResizeObserver);
    let commits = 0;
    render(
      <Profiler id="scrollarea" onRender={() => { commits += 1; }}>
        <ScrollArea>
          <div>content</div>
        </ScrollArea>
      </Profiler>,
    );
    await flushFrames();
    const observer = SpyResizeObserver.created[0];
    Object.defineProperty(viewport(), "scrollHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(viewport(), "clientHeight", {
      configurable: true,
      value: 100,
    });
    const before = commits;
    observer.fire();
    observer.fire();
    observer.fire(); // a third in the same frame: still one pass
    await flushFrames();
    expect(commits - before).toBeLessThanOrEqual(1);
    vi.unstubAllGlobals();
  });
});

import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ScrollArea from "./ScrollArea";

const viewport = () => document.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement;
const bars = () =>
  Array.from(document.querySelectorAll('[data-slot="scrollarea-scrollbar"]'));

/** Make the viewport report a vertical overflow, then let it re-measure. */
const overflowY = (element: HTMLElement, height: number) => {
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: height });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: 100 });
  fireEvent.scroll(element);
};

describe("ScrollArea", () => {
  it("renders viewport, content, both bars, handles and the corner", () => {
    render(
      <ScrollArea className="h-40">
        <p>content</p>
      </ScrollArea>,
    );
    expect(viewport()).toBeTruthy();
    expect(document.querySelector('[data-slot="scrollarea-content"]')).toBeTruthy();
    const tracks = bars();
    expect(tracks).toHaveLength(2);
    expect(tracks[0].getAttribute("data-orientation")).toBe("vertical");
    expect(tracks[1].getAttribute("data-orientation")).toBe("horizontal");
    expect(document.querySelectorAll('[data-slot="scrollarea-handle"]')).toHaveLength(2);
    expect(document.querySelector('[data-slot="scrollarea-corner"]')).toBeTruthy();
  });

  it("hides the bars while everything fits, and keeps the viewport out of the tab order", () => {
    render(
      <ScrollArea variant="always">
        <p>fits</p>
      </ScrollArea>,
    );
    for (const bar of bars()) expect(bar.getAttribute("data-state")).toBe("hidden");
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
      fireEvent.pointerEnter(document.querySelector('[data-slot="scrollarea"]')!);
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
});

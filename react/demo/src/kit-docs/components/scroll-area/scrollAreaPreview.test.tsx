import { describe, it, expect } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ScrollAreaPlayground } from "./ScrollAreaPlayground";

/** The kit's own test helpers, borrowed: jsdom measures nothing on its own. */
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

const viewport = (view: ReturnType<typeof render>): HTMLElement =>
  view.container.querySelector(
    '[data-slot="scrollarea-viewport"]',
  ) as HTMLElement;

const content = (view: ReturnType<typeof render>): HTMLElement =>
  view.container.querySelector(
    '[data-slot="scrollarea-content"]',
  ) as HTMLElement;

describe("ScrollAreaPlayground render", () => {
  it("mounts the region the docs describe", () => {
    const view = render(<ScrollAreaPlayground />);
    expect(
      view.container.querySelector('[data-slot="scrollarea"]'),
    ).not.toBeNull();
    expect(viewport(view)).not.toBeNull();
    const bars = view.container.querySelectorAll(
      '[data-slot="scrollarea-scrollbar"]',
    );
    // The two bars are there, and both are hidden from assistive tech (:523,:558).
    expect(bars.length).toBe(2);
    for (const bar of Array.from(bars)) {
      expect(bar.getAttribute("aria-hidden")).toBe("true");
      expect(bar.getAttribute("role")).toBe("scrollbar");
    }
    // The content is the fixture the Code view prints, and the knobs are the ones
    // the page claims to offer.
    expect(view.container.textContent).toContain("Tokyo");
    expect(view.container.textContent).toContain("Bengaluru");
    expect(view.container.textContent).toContain("gutter — the content pays");
    expect(view.container.textContent).toContain("className — the frame");
  });

  it("makes the region a tab stop only while it overflows", () => {
    const view = render(<ScrollAreaPlayground />);
    const scroller = viewport(view);
    expect(scroller.getAttribute("tabindex")).toBe("-1");
    overflowY(scroller, 448);
    expect(scroller.getAttribute("tabindex")).toBe("0");
    // And the lane is paid while that axis scrolls (:504) — the content wrapper
    // carries the 10px inset, not the frame.
    expect(content(view).className).toContain("pr-2.5");
    fireEvent.click(view.getByText("Fits — nothing overflows"));
    overflowY(scroller, 100);
    expect(scroller.getAttribute("tabindex")).toBe("-1");
    expect(content(view).className).not.toContain("pr-2.5");
  });

  it("refunds the lane when the caller's padding is the lane", () => {
    const view = render(<ScrollAreaPlayground />);
    overflowY(viewport(view), 448);
    expect(content(view).className).toContain("pr-2.5");
    fireEvent.click(view.getByText("gutter — the content pays the bar's lane"));
    expect(content(view).className).not.toContain("pr-2.5");
  });

  it("clamps the scroller when an engine owns the viewport", () => {
    const view = render(<ScrollAreaPlayground />);
    const scroller = viewport(view);
    fireEvent.click(view.getByText("virtualScroll — an engine owns the viewport"));
    // The kit draws the bar; the host scrolls (:467), so `overflow` is inline.
    expect(scroller.style.overflow).toBe("hidden");
    overflowY(scroller, 100);
    // The measurement now comes from the engine's numbers, not the DOM (:267-269).
    expect(scroller.getAttribute("data-overflow-y")).toBe("");
    expect(view.container.textContent).toContain("448px of content");
    expect(view.container.textContent).toContain("224px viewport");
  });
});

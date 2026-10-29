import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StackCarousel } from "./StackCarousel";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });
const items = ["One", "Two", "Three", "Four", "Five"];
const deck = (extra = {}) => <StackCarousel items={items} getItemLabel={item => item} {...extra} />;

describe("StackCarousel", () => {
  it.each([true, false])("defers hover expansion throughout wheel activity (wheel=%s)", wheel => {
    vi.useFakeTimers();
    render(deck({ expandable: true, expandOnHover: true, showExpandButton: true, wheel }));
    const root = screen.getByRole("region");
    fireEvent.pointerEnter(root);
    act(() => vi.advanceTimersByTime(1500));
    fireEvent.wheel(root, { deltaY: 80 });
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("button", { name: "Expand stack" })).toBeInTheDocument();
    fireEvent.wheel(root, { deltaX: 40 });
    act(() => vi.advanceTimersByTime(1999));
    expect(screen.getByRole("button", { name: "Expand stack" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("button", { name: "Collapse stack" })).toBeInTheDocument();
  });
  it("stops finite navigation at both ends and never wraps peeking layers", () => {
    const change = vi.fn();
    const { container } = render(deck({ loop: false, onActiveIndexChange: change }));
    const root = screen.getByRole("region");
    expect(screen.getByRole("button", { name: "Previous item" })).toBeDisabled();
    fireEvent.keyDown(root, { key: "ArrowUp" });
    expect(change).not.toHaveBeenCalled();
    fireEvent.keyDown(root, { key: "End" });
    expect(screen.getByRole("button", { name: "Next item" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Show One" })).toBeNull();
    expect(container.querySelectorAll('[data-stack-rank="1"]')).toHaveLength(0);
    change.mockClear();
    fireEvent.wheel(root, { deltaY: 100 });
    fireEvent.keyDown(root, { key: "ArrowDown" });
    expect(change).not.toHaveBeenCalled();
  });

  it("expands all items with an independent footer button and preserves selection", () => {
    render(<StackCarousel items={items} expandable showExpandButton showNavigators={false} defaultActiveIndex={2}
      renderItem={item => <button>{item} action</button>} />);
    fireEvent.click(screen.getByRole("button", { name: "Expand stack" }));
    for (const item of items) expect(screen.getByRole("button", { name: `${item} action` })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowDown" });
    fireEvent.click(screen.getByRole("button", { name: "Collapse stack" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 / 5");
    expect(document.querySelector('[data-stack-rank="1"] [inert]')).not.toBeNull();
  });

  it("allows consumer-controlled expansion without taking ownership", () => {
    const change = vi.fn();
    const { rerender } = render(deck({ expandable: true, expanded: false, showExpandButton: true, onExpandedChange: change }));
    fireEvent.click(screen.getByRole("button", { name: "Expand stack" }));
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Expand stack" })).toHaveAttribute("aria-expanded", "false");
    rerender(deck({ expandable: true, expanded: true, showExpandButton: true, onExpandedChange: change }));
    expect(screen.getByRole("button", { name: "Collapse stack" })).toHaveAttribute("aria-expanded", "true");
  });

  it("restarts stationary-hover timing on movement and collapses hover-opened lists", () => {
    vi.useFakeTimers();
    render(deck({ expandable: true, expandOnHover: true, showExpandButton: true, hoverExpandDelay: 2000 }));
    const root = screen.getByRole("region");
    fireEvent.pointerEnter(root);
    act(() => vi.advanceTimersByTime(1500));
    fireEvent.pointerMove(root);
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("button", { name: "Expand stack" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: "Collapse stack" })).toBeInTheDocument();
    fireEvent.pointerLeave(root);
    act(() => vi.advanceTimersByTime(499));
    expect(screen.getByRole("button", { name: "Collapse stack" })).toBeInTheDocument();
    fireEvent.pointerEnter(root);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: "Collapse stack" })).toBeInTheDocument();
    fireEvent.pointerLeave(root);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: "Expand stack" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Expand stack" }));
    fireEvent.pointerLeave(root);
    expect(screen.getByRole("button", { name: "Collapse stack" })).toBeInTheDocument();
  });
  it("wraps in both directions using keyboard and navigators", () => {
    render(deck());
    const root = screen.getByRole("region", { name: "Card stack" });
    fireEvent.keyDown(root, { key: "ArrowUp" });
    expect(screen.getByRole("status")).toHaveTextContent("Five · 5 / 5");
    fireEvent.click(screen.getByRole("button", { name: "Next item" }));
    expect(screen.getByRole("status")).toHaveTextContent("One · 1 / 5");
    fireEvent.keyDown(root, { key: "End" });
    expect(screen.getByRole("status")).toHaveTextContent("Five · 5 / 5");
  });

  it("clicks either peeking card and keeps only the active content focusable", () => {
    render(<StackCarousel items={items} getItemLabel={item => item}
      renderItem={item => <button>{item} action</button>} />);
    expect(screen.getByRole("button", { name: "One action" })).toBeInTheDocument();
    const secondLayer = document.querySelector('[data-stack-rank="1"]')!;
    expect(secondLayer.querySelector("[inert]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Show Three" }));
    expect(screen.getByRole("status")).toHaveTextContent("Three · 3 / 5");
    expect(screen.getByRole("region")).toHaveFocus();
  });

  it("requests a controlled change without taking ownership of the index", () => {
    const onActiveIndexChange = vi.fn();
    render(deck({ activeIndex: 3, onActiveIndexChange }));
    fireEvent.click(screen.getByRole("button", { name: "Next item" }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole("status")).toHaveTextContent("Four · 4 / 5");
  });

  it("advances once per continuous wheel gesture and preserves pinch zoom", () => {
    let time = 1000;
    vi.spyOn(Date, "now").mockImplementation(() => time);
    render(deck());
    const root = screen.getByRole("region");
    fireEvent.wheel(root, { deltaY: 100, ctrlKey: true });
    expect(screen.getByRole("status")).toHaveTextContent("One · 1 / 5");
    fireEvent.wheel(root, { deltaY: 100 });
    time += 30;
    fireEvent.wheel(root, { deltaY: 80 });
    expect(screen.getByRole("status")).toHaveTextContent("Two · 2 / 5");
    time += 200;
    fireEvent.wheel(root, { deltaY: -100 });
    expect(screen.getByRole("status")).toHaveTextContent("One · 1 / 5");
  });

  it("lets nested content scroll until its boundary", () => {
    render(<StackCarousel items={items} renderItem={item => <div style={{ overflowY: "auto" }} data-testid={`scroll-${item}`}>{item}</div>} />);
    const scroller = screen.getByTestId("scroll-One");
    Object.defineProperties(scroller, { scrollHeight: { value: 300 }, clientHeight: { value: 100 }, scrollTop: { value: 0, writable: true } });
    fireEvent.wheel(scroller, { deltaY: 100 });
    expect(screen.getByRole("status")).toHaveTextContent("1 / 5");
    scroller.scrollTop = 200;
    fireEvent.wheel(scroller, { deltaY: 100 });
    expect(screen.getByRole("status")).toHaveTextContent("2 / 5");
  });

  it("measures active height and adds only two offsets for a large collection", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ height: 100 } as DOMRect);
    const many = Array.from({ length: 100 }, (_, i) => String(i));
    const { container, rerender } = render(<StackCarousel items={many} visibleCount={20} stackOffset={12} />);
    expect(container.querySelector("[data-stack-carousel-track]")).toHaveStyle({ height: "124px" });
    expect(container.querySelectorAll("[data-stack-rank]")).toHaveLength(3);
    rerender(<StackCarousel items={["Only"]} />);
    expect(container.querySelector("[data-stack-carousel-track]")).toHaveStyle({ height: "100px" });
    expect(screen.queryByRole("button", { name: "Next item" })).toBeNull();
  });

  it("does not hijack keyboard events inside the active card", () => {
    render(<StackCarousel items={items} renderItem={item => <input aria-label={item} />} />);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "One" }), { key: "ArrowDown" });
    expect(screen.getByRole("status")).toHaveTextContent("1 / 5");
  });

  it("handles empty content and item removal", () => {
    const { rerender } = render(deck({ defaultActiveIndex: 4 }));
    rerender(<StackCarousel items={["A", "B"]} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 / 2");
    rerender(<StackCarousel items={[]} emptyState="Nothing here" />);
    expect(within(screen.getByRole("region")).getByText("Nothing here")).toBeInTheDocument();
  });

  it("supports vertical swipes", () => {
    render(deck());
    const track = document.querySelector("[data-stack-carousel-track]")!;
    fireEvent.touchStart(track, { touches: [{ clientX: 20, clientY: 100 }] });
    fireEvent.touchEnd(track, { changedTouches: [{ clientX: 22, clientY: 40 }] });
    expect(screen.getByRole("status")).toHaveTextContent("Two · 2 / 5");
  });
});

import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeEach,
} from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import Carousel from "./Carousel";
import { TRUE_COLORS } from "../../../common/theme/Theme";

const SLIDES = [
  "Alpha",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
].map((label) => <div key={label}>{label}</div>);

/** The moving list — it carries the transform and the aria-live region. */
const track = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("[aria-live]")!;

const groups = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="group"]'));

const dots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>("ul[aria-label='Slides'] button"));

const nextButton = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>(
    'button[aria-label="Next page"]',
  )!;

const prevButton = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>(
    'button[aria-label="Previous page"]',
  )!;

const transform = (container: HTMLElement) =>
  track(container).style.transform;

const swipe = (
  container: HTMLElement,
  { from, to, pointerType = "touch" }: { from: number; to: number; pointerType?: string },
) => {
  const viewport = track(container).parentElement!;
  fireEvent.pointerDown(viewport, {
    clientX: from,
    clientY: 0,
    pointerId: 1,
    pointerType,
  });
  fireEvent.pointerUp(viewport, {
    clientX: to,
    clientY: 0,
    pointerId: 1,
    pointerType,
  });
};

beforeEach(() => {
  // jsdom has no layout, so pointer capture is a no-op stub.
  Object.assign(Element.prototype, {
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
    hasPointerCapture: () => false,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Carousel", () => {
  describe("rendering", () => {
    it("renders a labelled region with one group per item", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      const region = container.querySelector('[role="region"]')!;
      expect(region).toHaveAttribute("aria-label", "Carousel");
      expect(groups(container)).toHaveLength(5);
      expect(groups(container)[0]).toHaveAttribute("aria-label", "Slide 1 of 5");
      expect(groups(container)[4]).toHaveAttribute("aria-label", "Slide 5 of 5");
    });

    it("uses the custom ariaLabel", () => {
      const { container } = render(<Carousel items={SLIDES} ariaLabel="Gallery" />);
      expect(container.querySelector('[role="region"]')).toHaveAttribute(
        "aria-label",
        "Gallery",
      );
    });

    it("renders raw ReactNode items as-is and header/footer around the track", () => {
      const { container } = render(
        <Carousel
          items={SLIDES}
          header={<div data-testid="head" />}
          footer={<div data-testid="foot" />}
        />,
      );
      expect(container.querySelector("[data-testid=head]")).not.toBeNull();
      expect(container.querySelector("[data-testid=foot]")).not.toBeNull();
      expect(track(container).textContent).toContain("Alpha");
    });

    it("draws items through renderItem", () => {
      const { container } = render(
        <Carousel
          items={[1, 2]}
          renderItem={(n) => <b data-testid={`item-${n}`}>{n * 10}</b>}
        />,
      );
      expect(container.querySelector('[data-testid=item-1]')).toHaveTextContent(
        "10",
      );
    });

    it("marks the off-screen items aria-hidden and the visible ones active", () => {
      const { container } = render(<Carousel items={SLIDES} numVisible={2} />);
      const [a, b, c] = groups(container);
      expect(a).not.toHaveAttribute("aria-hidden");
      expect(b).not.toHaveAttribute("aria-hidden");
      expect(c).toHaveAttribute("aria-hidden", "true");
      expect(a).toHaveAttribute("data-carousel-active", "true");
      expect(c).not.toHaveAttribute("data-carousel-active");
    });

    it("renders clones at both ends in circular mode only", () => {
      const plain = render(<Carousel items={SLIDES} />);
      // Non-circular: 5 real items, no clones → track has exactly 5 children.
      expect(track(plain.container).children).toHaveLength(5);
      // In circular mode with nv = 1, the track gains nv tail clones + nv head clones.
      const circular = render(<Carousel items={SLIDES} circular />);
      expect(track(circular.container).children).toHaveLength(7);
    });

    it("hides the navigators and indicators on request", () => {
      const { container } = render(
        <Carousel items={SLIDES} showNavigators={false} showIndicators={false} />,
      );
      expect(nextButton(container)).toBeNull();
      expect(prevButton(container)).toBeNull();
      expect(dots(container)).toHaveLength(0);
    });

    it("uses the custom navigator labels", () => {
      const { container } = render(
        <Carousel items={SLIDES} prevLabel="Back" nextLabel="Forward" />,
      );
      expect(
        container.querySelector('button[aria-label="Back"]'),
      ).not.toBeNull();
      expect(
        container.querySelector('button[aria-label="Forward"]'),
      ).not.toBeNull();
    });

    it("shifts along the y-axis in vertical orientation and sets the viewport height", () => {
      const { container } = render(
        <Carousel items={SLIDES} orientation="vertical" defaultPage={1} />,
      );
      expect(container.querySelector('[role="region"]')).toHaveAttribute(
        "data-orientation",
        "vertical",
      );
      expect(transform(container)).toBe("translate3d(0, -100%, 0)");
      expect(track(container).parentElement).toHaveStyle({ height: "300px" });
    });

    it("turns aria-live on only while autoplay is set", () => {
      const off = render(<Carousel items={SLIDES} />);
      expect(track(off.container)).toHaveAttribute("aria-live", "off");
      off.unmount();
      const on = render(<Carousel items={SLIDES} autoplayInterval={1000} />);
      expect(track(on.container)).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("navigation", () => {
    it("advances and reports the page with next, and steps back with prev", () => {
      const onPageChange = vi.fn();
      const { container } = render(
        <Carousel items={SLIDES} onPageChange={onPageChange} />,
      );
      expect(transform(container)).toBe("translate3d(0%, 0, 0)");
      fireEvent.click(nextButton(container));
      expect(transform(container)).toBe("translate3d(-100%, 0, 0)");
      expect(onPageChange).toHaveBeenLastCalledWith(1);
      fireEvent.click(prevButton(container));
      expect(transform(container)).toBe("translate3d(0%, 0, 0)");
      expect(onPageChange).toHaveBeenLastCalledWith(0);
    });

    it("disables the navigators at the ends in linear mode", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      expect(prevButton(container)).toBeDisabled();
      expect(nextButton(container)).not.toBeDisabled();
      const last = render(<Carousel items={SLIDES} defaultPage={4} />);
      expect(nextButton(last.container)).toBeDisabled();
      expect(prevButton(last.container)).not.toBeDisabled();
    });

    it("clamps the last page to the final items", () => {
      const ten = Array.from({ length: 10 }, (_, i) => (
        <div key={i}>{i}</div>
      ));
      const { container } = render(
        <Carousel items={ten} numVisible={3} defaultPage={7} />,
      );
      // 8 pages (len=10, nv=3 → totalPages = ceil(7/1)+1 = 8).
      // The last page (page 7) shows items 7,8,9; physical shift = -7 items.
      // Transform = -7 * (100/3)% = -233.33...%
      expect(transform(container)).toBe("translate3d(-233.33333333333334%, 0, 0)");
      expect(dots(container)).toHaveLength(8);
    });

    it("advances numScroll items per step", () => {
      const { container } = render(<Carousel items={SLIDES} numScroll={2} />);
      fireEvent.click(nextButton(container));
      expect(transform(container)).toBe("translate3d(-200%, 0, 0)");
    });

    it("jumps to the page an indicator names", () => {
      const onPageChange = vi.fn();
      const { container } = render(
        <Carousel items={SLIDES} onPageChange={onPageChange} />,
      );
      fireEvent.click(dots(container)[2]);
      expect(transform(container)).toBe("translate3d(-200%, 0, 0)");
      expect(onPageChange).toHaveBeenLastCalledWith(2);
      expect(dots(container)[2]).toHaveAttribute("aria-current", "page");
    });

    it("starts at defaultPage when uncontrolled", () => {
      const { container } = render(<Carousel items={SLIDES} defaultPage={2} />);
      expect(transform(container)).toBe("translate3d(-200%, 0, 0)");
      expect(dots(container)[2]).toHaveAttribute("aria-current", "page");
    });

    it("clamps an out-of-range defaultPage", () => {
      const { container } = render(<Carousel items={SLIDES} defaultPage={99} />);
      expect(transform(container)).toBe("translate3d(-400%, 0, 0)");
    });

    it("is driven by the page prop when controlled", () => {
      const onPageChange = vi.fn();
      const ui = render(
        <Carousel items={SLIDES} page={0} onPageChange={onPageChange} />,
      );
      // A click reports the change but does not move the track on its own.
      fireEvent.click(nextButton(ui.container));
      expect(onPageChange).toHaveBeenLastCalledWith(1);
      expect(transform(ui.container)).toBe("translate3d(0%, 0, 0)");
      // The parent's update moves it.
      ui.rerender(
        <Carousel items={SLIDES} page={2} onPageChange={onPageChange} />,
      );
      expect(transform(ui.container)).toBe("translate3d(-200%, 0, 0)");
    });

    it("keeps the navigators enabled in circular mode", () => {
      const first = render(<Carousel items={SLIDES} circular />);
      expect(prevButton(first.container)).not.toBeDisabled();
      expect(nextButton(first.container)).not.toBeDisabled();
      const last = render(
        <Carousel items={SLIDES} circular defaultPage={4} />,
      );
      expect(nextButton(last.container)).not.toBeDisabled();
    });
  });

  describe("circular mode", () => {
    it("flows past the end, wraps to page 0, and re-anchors after the animation", async () => {
      vi.useFakeTimers();
      const onPageChange = vi.fn();
      const { container } = render(
        <Carousel items={SLIDES} circular onPageChange={onPageChange} />,
      );
      for (let i = 0; i < 4; i++) fireEvent.click(nextButton(container));
      expect(onPageChange).toHaveBeenLastCalledWith(4);
      expect(transform(container)).toBe("translate3d(-500%, 0, 0)");

      // Wrap forward: animate to the head clones (-(len + nv) = -6), report 0.
      fireEvent.click(nextButton(container));
      expect(onPageChange).toHaveBeenLastCalledWith(0);
      expect(transform(container)).toBe("translate3d(-600%, 0, 0)");

      // Once the 500ms animation has finished the track snaps back to the
      // real position of page 0 — invisible, because the clones show the
      // same content. The snap is a state update that must be flushed.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(550);
      });
      expect(transform(container)).toBe("translate3d(-100%, 0, 0)");

      // The next step moves from the re-anchored position, not the wrap one.
      fireEvent.click(nextButton(container));
      expect(onPageChange).toHaveBeenLastCalledWith(1);
      expect(transform(container)).toBe("translate3d(-200%, 0, 0)");
    });

    it("flows past the start and wraps to the last page", async () => {
      vi.useFakeTimers();
      const onPageChange = vi.fn();
      const { container } = render(
        <Carousel items={SLIDES} circular onPageChange={onPageChange} />,
      );
      // Wrap backward from page 0: animate to the tail clones (0), report 4.
      fireEvent.click(prevButton(container));
      expect(onPageChange).toHaveBeenLastCalledWith(4);
      expect(transform(container)).toBe("translate3d(0%, 0, 0)");
      // The snap is a state update that must be flushed via act().
      await act(async () => {
        await vi.advanceTimersByTimeAsync(550);
      });
      expect(transform(container)).toBe("translate3d(-500%, 0, 0)");
    });

    it("supersedes the wrap snap when a newer navigation lands first", async () => {
      vi.useFakeTimers();
      const { container } = render(<Carousel items={SLIDES} circular />);
      for (let i = 0; i < 4; i++) fireEvent.click(nextButton(container));
      fireEvent.click(nextButton(container)); // wrap, page -> 0, physical -600%
      // A new navigation before the snap cancels it.
      fireEvent.click(dots(container)[2]);
      expect(transform(container)).toBe("translate3d(-300%, 0, 0)");
      await vi.advanceTimersByTimeAsync(550);
      expect(transform(container)).toBe("translate3d(-300%, 0, 0)");
    });
  });

  describe("indicators", () => {
    it("gives the active indicator aria-current and the tone fill", () => {
      const { container } = render(
        <Carousel items={SLIDES} defaultPage={1} color="emerald" />,
      );
      expect(dots(container)[1]).toHaveAttribute("aria-current", "page");
      expect(dots(container)[1].className).toContain("bg-emerald-500");
      expect(dots(container)[1].className).toContain("dark:bg-emerald-400");
      expect(dots(container)[0]).not.toHaveAttribute("aria-current");
    });

    it("roves the tabindex so only one dot is in the tab order", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      const tabbable = dots(container).filter((d) => d.tabIndex === 0);
      expect(tabbable).toHaveLength(1);
      expect(tabbable[0]).toHaveAttribute("aria-label", "Page 1");
    });

    it("moves focus with the arrow keys, Home, End and Tab", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      const list = container.querySelector("ul[aria-label='Slides']")!;
      const [d1, d2] = dots(container);

      d1.focus();
      fireEvent.keyDown(list, { key: "ArrowRight" });
      expect(document.activeElement).toBe(d2);

      fireEvent.keyDown(list, { key: "End" });
      expect(document.activeElement).toBe(dots(container)[4]);

      fireEvent.keyDown(list, { key: "Home" });
      expect(document.activeElement).toBe(dots(container)[0]);

      // Tab returns the roving focus to the page currently shown.
      fireEvent.click(nextButton(container)); // page -> 1
      fireEvent.keyDown(list, { key: "Tab" });
      expect(document.activeElement).toBe(dots(container)[1]);
      expect(dots(container)[1].tabIndex).toBe(0);
    });

    it("swallows the vertical arrows on a horizontal carousel", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      const list = container.querySelector("ul[aria-label='Slides']")!;
      const [d1, d2] = dots(container);
      d2.focus();
      // Neither moves focus (PrimeVue maps them nowhere) nor scrolls the page.
      fireEvent.keyDown(list, { key: "ArrowUp" });
      expect(document.activeElement).toBe(d2);
      fireEvent.keyDown(list, { key: "PageDown" });
      expect(document.activeElement).toBe(d2);
      fireEvent.keyDown(list, { key: "ArrowLeft" });
      expect(document.activeElement).toBe(d1);
    });

    it("lets the vertical arrows move focus on a vertical carousel", () => {
      const { container } = render(
        <Carousel items={SLIDES} orientation="vertical" />,
      );
      const list = container.querySelector("ul[aria-label='Slides']")!;
      const [d1, d2] = dots(container);
      d2.focus();
      fireEvent.keyDown(list, { key: "ArrowUp" }); // "backward" vertically
      expect(document.activeElement).toBe(d1);
    });
  });

  describe("swipe", () => {
    it("advances on a leftward touch beyond the threshold", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      swipe(container, { from: 100, to: 30 });
      expect(transform(container)).toBe("translate3d(-100%, 0, 0)");
    });

    it("steps back on a rightward touch", () => {
      const { container } = render(
        <Carousel items={SLIDES} defaultPage={2} />,
      );
      swipe(container, { from: 30, to: 120 });
      expect(transform(container)).toBe("translate3d(-100%, 0, 0)");
    });

    it("ignores short touches and mouse drags", () => {
      const { container } = render(<Carousel items={SLIDES} />);
      swipe(container, { from: 100, to: 90 });
      expect(transform(container)).toBe("translate3d(0%, 0, 0)");
      swipe(container, { from: 100, to: 10, pointerType: "mouse" });
      expect(transform(container)).toBe("translate3d(0%, 0, 0)");
    });
  });

  describe("autoplay", () => {
    it("advances on the interval and pauses after a manual navigation", async () => {
      vi.useFakeTimers();
      const { container } = render(
        <Carousel items={SLIDES} autoplayInterval={1000} />,
      );
      // Autoplay implies circular, so page 0 sits at the circular baseline.
      expect(transform(container)).toBe("translate3d(-100%, 0, 0)");
      await act(async () => { vi.advanceTimersByTime(1000); });
      expect(transform(container)).toBe("translate3d(-200%, 0, 0)");
      await act(async () => { vi.advanceTimersByTime(1000); });
      expect(transform(container)).toBe("translate3d(-300%, 0, 0)");

      fireEvent.click(nextButton(container)); // manual: page 3, autoplay stops
      expect(transform(container)).toBe("translate3d(-400%, 0, 0)");
      await act(async () => { vi.advanceTimersByTime(3000); });
      expect(transform(container)).toBe("translate3d(-400%, 0, 0)");
    });

    it("does not run without items to show", () => {
      vi.useFakeTimers();
      const onPageChange = vi.fn();
      render(<Carousel items={SLIDES} numVisible={5} autoplayInterval={1000} onPageChange={onPageChange} />);
      vi.advanceTimersByTime(3000);
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("responsive options", () => {
    const originalWidth = window.innerWidth;
    afterEach(() => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
    });

    it("applies the first breakpoint at or above the window width", () => {
      const setWidth = (w: number) =>
        Object.defineProperty(window, "innerWidth", {
          configurable: true,
          value: w,
        });
      // jsdom's window is 1024 wide: the 767 breakpoint does not match yet.
      const { container } = render(
        <Carousel
          items={SLIDES}
          responsiveOptions={[{ breakpoint: 767, numVisible: 2 }]}
        />,
      );
      expect(track(container).children).toHaveLength(5);

      setWidth(700);
      fireEvent(window, new Event("resize"));
      // nv = 2: 5 items + 2 clones per end are hidden; 4 pages instead of 5.
      expect(dots(container)).toHaveLength(4);
      expect((track(container).children[0] as HTMLElement).style.flexBasis).toBe("50%");
    });

    it("re-anchors the track when the breakpoint changes the geometry", () => {
      const setWidth = (w: number) =>
        Object.defineProperty(window, "innerWidth", {
          configurable: true,
          value: w,
        });
      const { container } = render(
        <Carousel
          items={SLIDES}
          defaultPage={4}
          responsiveOptions={[{ breakpoint: 767, numVisible: 2 }]}
        />,
      );
      expect(transform(container)).toBe("translate3d(-400%, 0, 0)");
      setWidth(700);
      fireEvent(window, new Event("resize"));
      // Breakpoint matches: nv=2, totalPages=ceil((5-2)/1)+1=4, safePage clamps to 3.
      // Physical shift = -3 items; with nv=2 each item is 50% wide → -150%.
      expect(transform(container)).toBe("translate3d(-150%, 0, 0)");
    });
  });

  describe("states", () => {
    it("shows a skeleton shaped like the carousel while loading", () => {
      const { container } = render(
        <Carousel items={SLIDES} loading numVisible={2} />,
      );
      expect(container.querySelector('[role="region"]')).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(container.querySelectorAll('[role="group"]')).toHaveLength(0);
      const pulses = container.querySelectorAll(".animate-pulse");
      // 2 slides + 2 navigator chips + indicator dots.
      expect(pulses.length).toBeGreaterThanOrEqual(5);
    });

    it("renders a custom loading state instead of the skeleton", () => {
      const { container } = render(
        <Carousel items={SLIDES} loading loadingState={<div data-testid="spin" />} />,
      );
      expect(container.querySelector('[data-testid=spin]')).not.toBeNull();
      expect(container.querySelector(".animate-pulse")).toBeNull();
    });

    it("shows the error state with the message", () => {
      const { container } = render(
        <Carousel items={SLIDES} error="The gallery could not be loaded." />,
      );
      expect(container.textContent).toContain("Something went wrong");
      expect(container.textContent).toContain(
        "The gallery could not be loaded.",
      );
      expect(container.querySelectorAll('[role="group"]')).toHaveLength(0);
    });

    it("renders a custom error state", () => {
      const { container } = render(
        <Carousel
          items={SLIDES}
          error
          errorState={<div data-testid="err" />}
        />,
      );
      expect(container.querySelector('[data-testid=err]')).not.toBeNull();
    });

    it("shows the empty state with a default and a custom message", () => {
      const { container } = render(<Carousel items={[]} />);
      expect(container.textContent).toContain("No items to display.");

      const custom = render(<Carousel items={[]} emptyMessage="Nothing here yet." />);
      expect(custom.container.textContent).toContain("Nothing here yet.");
      expect(custom.container.querySelectorAll('[role="group"]')).toHaveLength(0);
      expect(dots(custom.container)).toHaveLength(0);
    });

    it("renders a custom empty state", () => {
      const { container } = render(
        <Carousel items={[]} emptyState={<div data-testid="empty" />} />,
      );
      expect(container.querySelector('[data-testid=empty]')).not.toBeNull();
    });

    it("gives loading priority over error and empty", () => {
      const { container } = render(
        <Carousel items={[]} loading error="broken" />,
      );
      expect(container.querySelector(".animate-pulse")).not.toBeNull();
      expect(container.textContent).not.toContain("Something went wrong");
    });
  });

  describe("tone matrix", () => {
    it("tints the active dot and the navigators for every TrueColor", () => {
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(
          <Carousel items={SLIDES} color={color} />,
        );
        expect(container).toBeTruthy();
        const active = dots(container)[0];
        expect(active.className).toContain(`bg-${color}-500`);
        expect(active.className).toContain(`dark:bg-${color}-400`);
        const nav = nextButton(container);
        expect(nav.className).toContain(`hover:text-${color}-600`);
        expect(nav.className).toContain(`dark:hover:text-${color}-400`);
        expect(nav.className).toContain(`focus-visible:ring-${color}-400`);
        expect(container.querySelector('[role="region"]')).toHaveAttribute(
          "data-color",
          color,
        );
        unmount();
      }
    });
  });
});

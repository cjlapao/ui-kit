import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, act } from "@testing-library/react";
import Tooltip from "./Tooltip";
import { TOOLTIP_POSITIONS } from "../../../common/tooltip/placement";

describe("Tooltip", () => {
  afterEach(() => {
    // No manual body clearing: the tooltip is portaled and RTL's own cleanup
    // owns those nodes — removing them here makes its unmount throw.
    vi.useRealTimers();
  });

  it("renders children untouched when there is no text", () => {
    const { container } = render(
      <Tooltip>
        <b>hi</b>
      </Tooltip>,
    );
    // No wrapper element at all — the fragment path.
    expect(container.querySelector("b")).not.toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("shows the tooltip on hover after the delay, portaled to the body", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip text="Explain" delay={100}>
        label
      </Tooltip>,
    );
    const trigger = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(trigger);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("Explain");
    // Portaled: it is not inside the component's own container.
    expect(container.contains(tip)).toBe(false);
  });

  it("opens on keyboard focus, not only on hover", () => {
    // The wrapper is a plain div, so without a tab stop a keyboard user could
    // never surface the tooltip.
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip text="Explain" delay={0}>
        label
      </Tooltip>,
    );
    const trigger = container.firstElementChild as HTMLElement;
    expect(trigger.getAttribute("tabindex")).toBe("0");
    fireEvent.focus(trigger);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  });

  it("hides again on leave", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip text="Explain" delay={0}>
        label
      </Tooltip>,
    );
    const trigger = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    fireEvent.mouseLeave(trigger);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  describe("appearance", () => {
    it("has a light look and a dark look, not one dark look for both", () => {
      // It used to be `bg-neutral-900 … dark:bg-neutral-700` — dark in both
      // themes, with no light appearance at all.
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="Explain" delay={0}>
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const tip = document.querySelector('[role="tooltip"]')!;
      expect(tip.className).toContain("bg-white");
      expect(tip.className).toContain("dark:bg-neutral-800");
    });

    it("offers an inverted variant for the classic contrast look", () => {
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="Explain" delay={0} variant="inverted">
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const tip = document.querySelector('[role="tooltip"]')!;
      expect(tip.className).toContain("bg-neutral-900");
      expect(tip.className).toContain("dark:bg-white");
    });
  });

  describe("arrow", () => {
    const openTip = (position: "top" | "bottom" | "left" | "right") => {
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="Explain" delay={0} position={position}>
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const tip = document.querySelector('[role="tooltip"]')!;
      return tip.querySelector<HTMLElement>("span[aria-hidden]")!;
    };

    it("carries an outline on every side, not just a fill", () => {
      // It was a CSS triangle built from `border-<side>-<colour>`, which has
      // no outline of its own — so on the light `surface` variant it was a
      // white shape on a white page and simply did not read. Reported as
      // "the arrows for left and right do not show".
      for (const position of TOOLTIP_POSITIONS) {
        const arrow = openTip(position);
        expect(arrow.className).toContain("border-neutral-200");
        expect(arrow.className).toContain("dark:border-neutral-700");
        // Exactly the two outward-facing edges are bordered.
        const edges = ["border-t", "border-r", "border-b", "border-l"].filter(
          (edge) =>
            arrow.className
              .split(" ")
              .some((c) => c === edge),
        );
        expect(edges).toHaveLength(2);
        vi.useRealTimers();
      }
    });

    it("shares the box fill so the inner half disappears into it", () => {
      const arrow = openTip("right");
      expect(arrow.className).toContain("bg-white");
      expect(arrow.className).toContain("dark:bg-neutral-800");
    });

    it("is rotated onto the edge matching the side actually used", () => {
      // JSDOM reports every box as zero-sized, so the requested side is not
      // guaranteed — read the side the component resolved to and assert the
      // arrow was placed to match it.
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="Explain" delay={0} position="left">
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const tip = document.querySelector('[role="tooltip"]')!;
      const arrow = tip.querySelector<HTMLElement>("span[aria-hidden]")!;
      const edge = {
        top: "top-full",
        bottom: "top-0",
        left: "left-full",
        right: "left-0",
      }[tip.getAttribute("data-side") as "top"];
      expect(arrow.style.transform).toContain("rotate(45deg)");
      expect(arrow.className).toContain(edge);
    });

    it("has no border on the inverted variant, which has no outline", () => {
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="Explain" delay={0} variant="inverted">
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const arrow = document
        .querySelector('[role="tooltip"]')!
        .querySelector<HTMLElement>("span[aria-hidden]")!;
      // Border colour equals the fill, so no rim shows.
      expect(arrow.className).toContain("bg-neutral-900");
      expect(arrow.className).toContain("border-neutral-900");
    });
  });

  describe("placement", () => {
    it("accepts all four sides", () => {
      expect(TOOLTIP_POSITIONS).toEqual(["top", "bottom", "left", "right"]);
      for (const position of TOOLTIP_POSITIONS) {
        vi.useFakeTimers();
        const { container, unmount } = render(
          <Tooltip text="x" delay={0} position={position}>
            label
          </Tooltip>,
        );
        fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
        act(() => {
          vi.advanceTimersByTime(10);
        });
        expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
        unmount();
        vi.useRealTimers();
      }
    });

    it("publishes the side it actually used", () => {
      // JSDOM reports zero-size boxes, so this asserts the attribute exists
      // and is one of the four — the geometry itself is covered exhaustively
      // in tooltipPlacement.test.ts against real numbers.
      vi.useFakeTimers();
      const { container } = render(
        <Tooltip text="x" delay={0} position="right">
          label
        </Tooltip>,
      );
      fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      const tip = document.querySelector('[role="tooltip"]')!;
      expect(TOOLTIP_POSITIONS).toContain(tip.getAttribute("data-side"));
    });
  });

  it("keeps the caller's wrapper class", () => {
    const { container } = render(
      <Tooltip text="x" wrapperClassName="w-full">
        label
      </Tooltip>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "w-full",
    );
  });
});

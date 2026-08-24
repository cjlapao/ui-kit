import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Slider, { SLIDER_VARIANTS, type SliderVariant } from "./Slider";
import { TRUE_COLORS } from "../../../common/theme/Theme";

const handles = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLDivElement>('[role="slider"]'),
  );

const valuenow = (el: HTMLElement) => el.getAttribute("aria-valuenow");

/**
 * jsdom lays nothing out, so the track's box is faked: 200 units long at
 * origin, which maps a client coordinate straight to a 0–100 percentage
 * (clientX 100 -> 50, clientY 0 -> 100 in vertical mode).
 */
const rectMock = (width = 200, height = 24) =>
  vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockReturnValue({
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

const dragTo = (
  el: HTMLElement,
  { clientX = 0, clientY = 0 }: { clientX?: number; clientY?: number },
) => {
  fireEvent.pointerDown(el, { clientX, clientY, pointerId: 1, button: 0 });
  fireEvent.pointerMove(el, { clientX, clientY, pointerId: 1 });
};

const release = (el: HTMLElement) =>
  fireEvent.pointerUp(el, { pointerId: 1 });

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
});

describe("Slider", () => {
  describe("rendering", () => {
    it("renders one handle carrying the slider role and its value attributes", () => {
      const { container } = render(<Slider defaultValue={50} />);
      const [handle] = handles(container);
      expect(handle).toHaveAttribute("aria-valuemin", "0");
      expect(handle).toHaveAttribute("aria-valuemax", "100");
      expect(handle).toHaveAttribute("aria-valuenow", "50");
      expect(handle).toHaveAttribute("aria-orientation", "horizontal");
      expect(handle).toHaveAttribute("aria-label", "Slider");
      expect(handle).toHaveAttribute("tabindex", "0");
    });

    it("uses the ariaLabel for the handle", () => {
      const { container } = render(<Slider defaultValue={50} ariaLabel="Volume" />);
      expect(handles(container)[0]).toHaveAttribute("aria-label", "Volume");
    });

    it("renders two labelled handles in range mode", () => {
      const { container } = render(<Slider range defaultValue={[20, 80]} />);
      const list = handles(container);
      expect(list).toHaveLength(2);
      expect(valuenow(list[0])).toBe("20");
      expect(valuenow(list[1])).toBe("80");
      expect(list[0]).toHaveAttribute("aria-label", "Minimum");
      expect(list[1]).toHaveAttribute("aria-label", "Maximum");
    });

    it("snaps the default value to the step and clamps it to the bounds", () => {
      const stepped = render(<Slider defaultValue={33} step={20} />);
      expect(valuenow(handles(stepped.container)[0])).toBe("40");
      stepped.unmount();

      const clamped = render(<Slider defaultValue={120} />);
      expect(valuenow(handles(clamped.container)[0])).toBe("100");
    });

    it("renders a controlled value and follows it across updates", () => {
      const { container, rerender } = render(<Slider value={30} />);
      expect(valuenow(handles(container)[0])).toBe("30");
      rerender(<Slider value={70} />);
      expect(valuenow(handles(container)[0])).toBe("70");
    });

    it("treats a null value as the minimum", () => {
      const { container } = render(<Slider value={null} />);
      expect(valuenow(handles(container)[0])).toBe("0");
    });

    it("reports the vertical orientation on the handle", () => {
      const { container } = render(<Slider orientation="vertical" defaultValue={40} />);
      expect(handles(container)[0]).toHaveAttribute("aria-orientation", "vertical");
      expect(valuenow(handles(container)[0])).toBe("40");
    });

    it("paints the fill and handle in the error colour when invalid", () => {
      const { container } = render(<Slider defaultValue={30} invalid />);
      expect(container.querySelector(".bg-rose-500")).not.toBeNull();
      expect(handles(container)[0].className).toContain("border-rose-400");
    });
  });

  describe("pointer", () => {
    it("dragging the handle moves the value and fires onChange", () => {
      rectMock();
      const onChange = vi.fn();
      const { container } = render(
        <Slider defaultValue={20} onChange={onChange} />,
      );
      const [handle] = handles(container);
      dragTo(handle, { clientX: 100 });
      expect(onChange).toHaveBeenCalledWith(50);
      expect(valuenow(handle)).toBe("50");
    });

    it("fires onSlideEnd once when the drag ends", () => {
      rectMock();
      const onSlideEnd = vi.fn();
      const { container } = render(
        <Slider defaultValue={20} onSlideEnd={onSlideEnd} />,
      );
      const [handle] = handles(container);
      dragTo(handle, { clientX: 100 });
      expect(onSlideEnd).not.toHaveBeenCalled();
      release(handle);
      expect(onSlideEnd).toHaveBeenCalledTimes(1);
      expect(onSlideEnd).toHaveBeenCalledWith(50);
    });

    it("snaps a dragged position to the step", () => {
      rectMock();
      const onChange = vi.fn();
      const { container } = render(
        <Slider step={20} defaultValue={20} onChange={onChange} />,
      );
      dragTo(handles(container)[0], { clientX: 105 });
      // 52.5 is not on the 20-step grid, so it lands on 60.
      expect(onChange).toHaveBeenLastCalledWith(60);
    });

    it("a track press jumps the nearest handle and can keep dragging", () => {
      rectMock();
      const onChange = vi.fn();
      const { container } = render(
        <Slider range defaultValue={[20, 80]} onChange={onChange} />,
      );
      const track = container.querySelector(
        "div.cursor-pointer",
      ) as HTMLElement;
      dragTo(track, { clientX: 30 });
      // 15 is closer to 20 than to 80, so the min handle moves.
      expect(onChange).toHaveBeenLastCalledWith([15, 80]);
    });

    it("keeps the range handles from crossing", () => {
      rectMock();
      const { container } = render(<Slider range defaultValue={[20, 80]} />);
      const [minHandle] = handles(container);
      dragTo(minHandle, { clientX: 190 });
      expect(valuenow(minHandle)).toBe("80");
      expect(valuenow(handles(container)[1])).toBe("80");
    });

    it("enforces minStepsBetweenHandles in range mode", () => {
      rectMock();
      const first = render(
        <Slider range defaultValue={[20, 80]} minStepsBetweenHandles={20} />,
      );
      const [minHandle, maxHandle] = handles(first.container);
      dragTo(maxHandle, { clientX: 50 });
      // 25 would leave a 5-step gap; the floor is 20 + 20 steps.
      expect(valuenow(minHandle)).toBe("20");
      expect(valuenow(maxHandle)).toBe("40");
      first.unmount();

      const second = render(
        <Slider range defaultValue={[20, 80]} minStepsBetweenHandles={20} />,
      );
      dragTo(handles(second.container)[0], { clientX: 180 });
      // 90 would close the gap below 20 steps; the ceiling is 80 − 20.
      expect(valuenow(handles(second.container)[0])).toBe("60");
      expect(valuenow(handles(second.container)[1])).toBe("80");
    });

    it("reads vertical position bottom-up", () => {
      rectMock(24, 200);
      const onChange = vi.fn();
      const { container } = render(
        <Slider orientation="vertical" defaultValue={20} onChange={onChange} />,
      );
      const [handle] = handles(container);
      dragTo(handle, { clientY: 100 });
      expect(onChange).toHaveBeenLastCalledWith(50);
      dragTo(handle, { clientY: 0 });
      expect(onChange).toHaveBeenLastCalledWith(100);
    });
  });

  describe("keyboard", () => {
    it("moves by one step with the arrow keys", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider defaultValue={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      fireEvent.keyDown(handle, { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith(51);
      fireEvent.keyDown(handle, { key: "ArrowDown" });
      expect(onChange).toHaveBeenLastCalledWith(50);
      fireEvent.keyDown(handle, { key: "ArrowUp" });
      expect(onChange).toHaveBeenLastCalledWith(51);
      fireEvent.keyDown(handle, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenLastCalledWith(50);
    });

    it("clamps at the bounds", () => {
      const atMax = render(<Slider defaultValue={100} />);
      fireEvent.keyDown(handles(atMax.container)[0], { key: "ArrowRight" });
      expect(valuenow(handles(atMax.container)[0])).toBe("100");

      const atMin = render(<Slider defaultValue={0} />);
      fireEvent.keyDown(handles(atMin.container)[0], { key: "ArrowLeft" });
      expect(valuenow(handles(atMin.container)[0])).toBe("0");
    });

    it("jumps to the bounds with Home and End", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider defaultValue={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      fireEvent.keyDown(handle, { key: "Home" });
      expect(onChange).toHaveBeenLastCalledWith(0);
      fireEvent.keyDown(handle, { key: "End" });
      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("moves ten steps with PageUp and PageDown", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider defaultValue={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      fireEvent.keyDown(handle, { key: "PageUp" });
      expect(onChange).toHaveBeenLastCalledWith(60);
      fireEvent.keyDown(handle, { key: "PageDown" });
      expect(onChange).toHaveBeenLastCalledWith(50);

      const stepped = render(
        <Slider defaultValue={95} step={5} onChange={onChange} />,
      );
      fireEvent.keyDown(handles(stepped.container)[0], { key: "PageUp" });
      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("adjusts only the focused handle in range mode", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider range defaultValue={[20, 80]} onChange={onChange} />,
      );
      const [minHandle, maxHandle] = handles(container);
      fireEvent.keyDown(minHandle, { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith([21, 80]);
      fireEvent.keyDown(maxHandle, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenLastCalledWith([21, 79]);
    });

    it("respects custom min and max", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider min={10} max={90} value={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      expect(handle).toHaveAttribute("aria-valuemin", "10");
      expect(handle).toHaveAttribute("aria-valuemax", "90");
      fireEvent.keyDown(handle, { key: "End" });
      expect(onChange).toHaveBeenLastCalledWith(90);
    });
  });

  describe("states", () => {
    it("disabled leaves the tab order and ignores input", () => {
      rectMock();
      const onChange = vi.fn();
      const { container } = render(
        <Slider disabled defaultValue={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      expect(handle).toHaveAttribute("tabindex", "-1");
      dragTo(handle, { clientX: 100 });
      fireEvent.keyDown(handle, { key: "End" });
      expect(onChange).not.toHaveBeenCalled();
      expect(valuenow(handle)).toBe("50");
    });

    it("disabledMinHandle freezes only the start handle", () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider range defaultValue={[20, 80]} disabledMinHandle onChange={onChange} />,
      );
      const [minHandle, maxHandle] = handles(container);
      expect(minHandle).toHaveAttribute("tabindex", "-1");
      expect(minHandle).toHaveAttribute("aria-disabled", "true");
      expect(maxHandle).toHaveAttribute("tabindex", "0");
      fireEvent.keyDown(minHandle, { key: "End" });
      expect(onChange).not.toHaveBeenCalled();
      fireEvent.keyDown(maxHandle, { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith([20, 81]);
    });

    it("disabledMaxHandle freezes only the end handle", () => {
      const { container } = render(
        <Slider range defaultValue={[20, 80]} disabledMaxHandle />,
      );
      const [minHandle, maxHandle] = handles(container);
      expect(minHandle).toHaveAttribute("tabindex", "0");
      expect(maxHandle).toHaveAttribute("tabindex", "-1");
    });

    it("readOnly stays focusable but ignores input", () => {
      rectMock();
      const onChange = vi.fn();
      const { container } = render(
        <Slider readOnly defaultValue={50} onChange={onChange} />,
      );
      const [handle] = handles(container);
      expect(handle).toHaveAttribute("tabindex", "0");
      expect(handle).toHaveAttribute("aria-readonly", "true");
      dragTo(handle, { clientX: 100 });
      fireEvent.keyDown(handle, { key: "End" });
      expect(onChange).not.toHaveBeenCalled();
      expect(valuenow(handle)).toBe("50");
    });
  });

  describe("controlled", () => {
    it("does not move when the parent ignores onChange", () => {
      rectMock();
      const { container } = render(
        <Slider value={50} onChange={() => undefined} />,
      );
      const [handle] = handles(container);
      dragTo(handle, { clientX: 160 });
      fireEvent.keyDown(handle, { key: "End" });
      expect(valuenow(handle)).toBe("50");
    });
  });

  describe("appearance", () => {
    it("offers exactly the variants a track can express", () => {
      expect([...SLIDER_VARIANTS]).toEqual([
        "solid",
        "soft",
        "outline",
        "ghost",
        "glass",
      ]);
    });

    const fill = (container: HTMLElement) =>
      (
        container.querySelector("div.cursor-pointer") as HTMLElement
      ).firstElementChild as HTMLElement;

    it("emits the solid fill in every colour", () => {
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(
          <Slider defaultValue={30} color={color} />,
        );
        expect(fill(container).className).toContain(` bg-${color}-500 `);
        expect(fill(container).className).toContain(`dark:bg-${color}-400`);
        unmount();
      }
    });

    it("paints each variant distinctly", () => {
      const expectations: [SliderVariant, string, string][] = [
        ["solid", " bg-blue-500 ", "border-blue-500"],
        ["soft", " bg-blue-200 ", "border-blue-300"],
        ["outline", " bg-blue-50 ", "border-blue-400"],
        ["ghost", " bg-blue-500/20 ", "border-neutral-300"],
      ];
      for (const [variant, fillClass, handleClass] of expectations) {
        const { container, unmount } = render(
          <Slider defaultValue={30} variant={variant} />,
        );
        expect(fill(container).className).toContain(fillClass);
        expect(handles(container)[0].className).toContain(handleClass);
        unmount();
      }
    });

    it("uses the frosted glass fill for the glass variant", () => {
      const { container } = render(<Slider defaultValue={30} variant="glass" />);
      expect(fill(container).className).toContain("backdrop-blur-sm");
      expect(fill(container).className).toContain("bg-blue-100/65");
      expect(handles(container)[0].className).toContain("border-white/70");
    });

    it("treats tone as an alias for color", () => {
      const { container } = render(<Slider defaultValue={30} tone="red" />);
      expect(fill(container).className).toContain(" bg-red-500 ");
    });

    it("lets color win over tone", () => {
      const { container } = render(
        <Slider defaultValue={30} color="red" tone="green" />,
      );
      expect(fill(container).className).toContain(" bg-red-500 ");
    });

    it("applies the variant focus ring to the handle", () => {
      const solid = render(<Slider defaultValue={30} />);
      expect(handles(solid.container)[0].className).toContain(
        "focus-visible:ring-blue-500",
      );
      solid.unmount();

      const soft = render(<Slider defaultValue={30} variant="soft" />);
      expect(handles(soft.container)[0].className).toContain(
        "focus-visible:ring-blue-400",
      );
    });

    it("paints invalid over any variant", () => {
      const { container } = render(
        <Slider defaultValue={30} variant="soft" invalid />,
      );
      expect(fill(container).className).toContain("bg-rose-500");
      expect(handles(container)[0].className).toContain("border-rose-400");
    });

    it("exposes variant and colour data attributes", () => {
      const { container } = render(
        <Slider defaultValue={30} variant="outline" color="teal" />,
      );
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute("data-variant", "outline");
      expect(root).toHaveAttribute("data-color", "teal");
    });
  });

  describe("value shape", () => {
    it("reports a number for a single handle and a pair for a range", () => {
      rectMock();
      const single = vi.fn();
      const range = vi.fn();
      const one = render(<Slider defaultValue={20} onChange={single} />);
      dragTo(handles(one.container)[0], { clientX: 100 });
      expect(single).toHaveBeenLastCalledWith(50);
      one.unmount();

      const two = render(<Slider range defaultValue={[20, 80]} onChange={range} />);
      dragTo(handles(two.container)[0], { clientX: 100 });
      expect(range).toHaveBeenLastCalledWith([50, 80]);
    });
  });
});

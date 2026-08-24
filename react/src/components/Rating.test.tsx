import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Rating from "./Rating";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
} from "../../../common/theme/Theme";

const radios = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLInputElement>("input[type=\"radio\"]"),
  );

const labelOf = (radio: HTMLInputElement) => radio.closest("label") as HTMLLabelElement;

const litCount = (container: HTMLElement) =>
  container.querySelectorAll(".text-amber-400").length;

const radioWithValue = (container: HTMLElement, value: string) => {
  const radio = radios(container).find((r) => r.value === value);
  expect(radio).toBeDefined();
  return radio as HTMLInputElement;
};

describe("Rating", () => {
  describe("rendering", () => {
    it("renders five radios by default inside a labelled radiogroup", () => {
      const { container } = render(<Rating />);
      expect(radios(container)).toHaveLength(5);
      expect(
        container.querySelector('[role="radiogroup"][aria-label="Rating"]'),
      ).not.toBeNull();
    });

    it("gives every radio a shared name and a per-value label", () => {
      const { container } = render(<Rating name="review" defaultValue={3} />);
      const list = radios(container);
      expect(list[0]).toHaveAttribute("name", "review");
      list.forEach((radio, i) => {
        expect(radio).toHaveAttribute("name", "review");
        expect(radio).toHaveAttribute("aria-label", `${i + 1} ${i === 0 ? "star" : "stars"}`);
      });
    });

    it("generates a shared name when none is given", () => {
      const { container } = render(<Rating />);
      const list = radios(container);
      const names = new Set(list.map((radio) => radio.getAttribute("name")));
      expect(names.size).toBe(1);
      expect([...names][0]).not.toBe("");
    });

    it("renders the requested number of stars, clamped to 1..15", () => {
      const eight = render(<Rating stars={8} />);
      expect(radios(eight.container)).toHaveLength(8);
      eight.unmount();

      const zero = render(<Rating stars={0} />);
      expect(radios(zero.container)).toHaveLength(1);
      zero.unmount();

      const huge = render(<Rating stars={99} />);
      expect(radios(huge.container)).toHaveLength(15);
      huge.unmount();
    });

    it("checks only the radio for the defaultValue", () => {
      const { container } = render(<Rating defaultValue={3} />);
      const list = radios(container);
      expect(list[0].checked).toBe(false);
      expect(list[1].checked).toBe(false);
      expect(list[2].checked).toBe(true);
      expect(list[3].checked).toBe(false);
      expect(list[4].checked).toBe(false);
    });

    it("renders a controlled value and follows it across updates", () => {
      const { container, rerender } = render(<Rating value={4} />);
      expect(radios(container)[3].checked).toBe(true);
      expect(radios(container)[4].checked).toBe(false);
      rerender(<Rating value={5} />);
      expect(radios(container)[4].checked).toBe(true);
      expect(radios(container)[3].checked).toBe(false);
    });

    it("treats a null value as empty", () => {
      const { container } = render(<Rating value={null} />);
      for (const radio of radios(container)) {
        expect(radio.checked).toBe(false);
      }
    });

    it("clamps a value above the star count and floors it when halves are off", () => {
      const clamped = render(<Rating defaultValue={99} />);
      expect(radios(clamped.container)[4].checked).toBe(true);
      expect(radios(clamped.container)[3].checked).toBe(false);
      clamped.unmount();

      const floored = render(<Rating defaultValue={3.5} />);
      expect(radios(floored.container)[3].checked).toBe(false);
      expect(radios(floored.container)[2].checked).toBe(true);
      floored.unmount();
    });
  });

  describe("selection", () => {
    it("clicking a star selects it and fires onChange", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating onChange={onChange} />);
      const list = radios(container);
      fireEvent.click(list[2]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(3);
      expect(list[2].checked).toBe(true);
    });

    it("updates its own state when uncontrolled", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating defaultValue={1} onChange={onChange} />);
      const list = radios(container);
      expect(list[0].checked).toBe(true);
      fireEvent.click(list[3]);
      expect(onChange).toHaveBeenCalledWith(4);
      expect(list[3].checked).toBe(true);
      expect(list[0].checked).toBe(false);
    });

    it("does not move a controlled value on its own", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating value={2} onChange={onChange} />);
      const list = radios(container);
      fireEvent.click(list[3]);
      expect(onChange).toHaveBeenCalledWith(4);
      expect(list[1].checked).toBe(true);
      expect(list[3].checked).toBe(false);
    });

    it("does not re-fire when the already-selected star is clicked", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating defaultValue={3} onChange={onChange} />);
      fireEvent.click(radios(container)[2]);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("half stars", () => {
    it("renders a half radio per star when allowHalf is on", () => {
      const { container } = render(<Rating allowHalf />);
      const list = radios(container);
      expect(list).toHaveLength(10);
      expect(list.map((radio) => radio.value)).toEqual([
        "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5",
      ]);
    });

    it("selects a half value from the left half of a star", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating allowHalf onChange={onChange} />);
      const half = radioWithValue(container, "2.5");
      fireEvent.click(half);
      expect(onChange).toHaveBeenCalledWith(2.5);
      expect(half.checked).toBe(true);
    });

    it("selects the full value from the right half of a star", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating allowHalf onChange={onChange} />);
      const full = radioWithValue(container, "3");
      fireEvent.click(full);
      expect(onChange).toHaveBeenCalledWith(3);
      expect(full.checked).toBe(true);
    });

    it("shows a half star as half lit", () => {
      const { container } = render(<Rating allowHalf defaultValue={3.5} />);
      const list = radios(container);
      expect(list.filter((radio) => radio.checked)).toHaveLength(1);
      expect(list[6].checked).toBe(true); // 3.5
      expect(list[7].checked).toBe(false); // 4
      // Each lit half paints its own clipped star glyph: 3 full stars (six
      // halves) plus the lit half = seven.
      expect(litCount(container)).toBe(7);
    });
  });

  describe("keyboard", () => {
    it("exposes real radios so the browser's group handling applies", () => {
      const { container } = render(<Rating defaultValue={2} />);
      const list = radios(container);
      expect(list).toHaveLength(5);
      list[1].focus();
      expect(document.activeElement).toBe(list[1]);
      expect(list[1].hasAttribute("disabled")).toBe(false);
    });
  });

  describe("states", () => {
    it("disabled disables every radio and swallows clicks", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating disabled defaultValue={2} onChange={onChange} />);
      const list = radios(container);
      for (const radio of list) expect(radio).toBeDisabled();
      fireEvent.click(list[3]);
      expect(onChange).not.toHaveBeenCalled();
      expect(list[3].checked).toBe(false);
    });

    it("readOnly freezes the stars and marks the group read-only", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating readOnly defaultValue={2} onChange={onChange} />);
      const group = container.querySelector('[role="radiogroup"]');
      expect(group).toHaveAttribute("aria-readonly", "true");
      const list = radios(container);
      for (const radio of list) expect(radio).toBeDisabled();
      fireEvent.click(list[3]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("invalid paints the lit stars with the error colour", () => {
      const { container } = render(<Rating invalid defaultValue={3} />);
      expect(container.querySelector(".text-rose-500")).not.toBeNull();
      expect(litCount(container)).toBe(0);
    });
  });

  describe("hover preview", () => {
    it("previewing a star on hover lights it without changing the value", () => {
      const onChange = vi.fn();
      const { container } = render(<Rating defaultValue={1} onChange={onChange} />);
      expect(litCount(container)).toBe(1);
      fireEvent.mouseEnter(labelOf(radios(container)[3]));
      expect(litCount(container)).toBe(4);
      expect(onChange).not.toHaveBeenCalled();
      expect(radios(container)[0].checked).toBe(true);
      expect(radios(container)[3].checked).toBe(false);
    });

    it("leaving the group clears the preview", () => {
      const { container } = render(<Rating defaultValue={1} />);
      const group = container.querySelector<HTMLElement>('[role="radiogroup"]');
      expect(group).not.toBeNull();
      fireEvent.mouseEnter(labelOf(radios(container)[3]));
      expect(litCount(container)).toBe(4);
      fireEvent.mouseLeave(group as HTMLElement);
      expect(litCount(container)).toBe(1);
    });

    it("a half preview lights only the hovered half", () => {
      const { container } = render(<Rating allowHalf defaultValue={2} />);
      const half = radioWithValue(container, "2.5");
      fireEvent.mouseEnter(labelOf(half));
      // Two full stars (four halves) plus the hovered half = five lit halves.
      expect(litCount(container)).toBe(5);
      expect(half.checked).toBe(false);
    });
  });

  describe("appearance", () => {
    it("emits the tone it was given, for every tone", () => {
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(<Rating tone={tone} defaultValue={3} />);
        expect(container.querySelector(`.text-${tone}-400`)).not.toBeNull();
        unmount();
      }
    });

    it.each([
      ["xs", "h-3.5"],
      ["sm", "h-4"],
      ["md", "h-5"],
      ["lg", "h-7"],
      ["xl", "h-9"],
    ] as const)("renders the %s size", (size, expected) => {
      const { container } = render(<Rating size={size} />);
      expect(container.querySelector(`[class*="${expected}"]`)).not.toBeNull();
    });

    it("offers every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(<Rating size={size} />);
        expect(radios(container)).toHaveLength(5);
        unmount();
      }
    });

    it("lays the stars out vertically on request", () => {
      const { container } = render(<Rating orientation="vertical" />);
      const group = container.firstElementChild as HTMLElement;
      expect(group.className).toContain("flex-col");
    });
  });

  describe("custom icons", () => {
    it("renders an element provided for the on icon", () => {
      const { container } = render(
        <Rating defaultValue={3} onIcon={<b data-on-icon />} />,
      );
      expect(container.querySelectorAll("[data-on-icon]")).toHaveLength(3);
    });

    it("renders the off icon for unlit stars", () => {
      const { container } = render(
        <Rating defaultValue={2} offIcon={<i data-off-icon />} />,
      );
      expect(container.querySelectorAll("[data-off-icon]")).toHaveLength(3);
    });

    it("invokes a function icon once per lit position with the star index", () => {
      const icon = vi.fn((index: number) => <span data-fn-icon data-index={index} />);
      const { container } = render(<Rating defaultValue={3} onIcon={icon} />);
      expect(icon.mock.calls.map(([index]) => index)).toEqual([1, 2, 3]);
      expect(container.querySelectorAll("[data-fn-icon]")).toHaveLength(3);
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import InputOtp from "./InputOtp";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
} from "../../../common/theme/Theme";

const cells = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("input"));

const values = (container: HTMLElement) => cells(container).map((cell) => cell.value);

const typeIn = (container: HTMLElement, index: number, char: string) =>
  fireEvent.change(cells(container)[index], { target: { value: char } });

describe("InputOtp", () => {
  describe("rendering", () => {
    it("renders four cells by default inside an labelled group", () => {
      const { container } = render(<InputOtp />);
      expect(cells(container)).toHaveLength(4);
      expect(
        container.querySelector('[role="group"][aria-label="One-time password"]'),
      ).not.toBeNull();
    });

    it("renders the requested number of cells, each with a positional aria-label", () => {
      const { container } = render(<InputOtp length={6} />);
      const list = cells(container);
      expect(list).toHaveLength(6);
      list.forEach((cell, i) => {
        expect(cell).toHaveAttribute(
          "aria-label",
          `One-time password, character ${i + 1} of 6`,
        );
      });
    });

    it("clamps length into the sane 1..20 range", () => {
      const zero = render(<InputOtp length={0} />);
      expect(cells(zero.container)).toHaveLength(1);
      zero.unmount();
      const huge = render(<InputOtp length={99} />);
      expect(cells(huge.container)).toHaveLength(20);
      huge.unmount();
    });

    it("shows the defaultValue on mount", () => {
      const { container } = render(<InputOtp defaultValue="12" />);
      expect(values(container)).toEqual(["1", "2", "", ""]);
    });

    it("renders a controlled value", () => {
      const { container } = render(<InputOtp value="7890" />);
      expect(values(container)).toEqual(["7", "8", "9", "0"]);
    });

    it("only the first cell carries the name and one-time-code autocomplete", () => {
      const { container } = render(<InputOtp name="code" />);
      const list = cells(container);
      expect(list[0]).toHaveAttribute("name", "code");
      expect(list[0]).toHaveAttribute("autocomplete", "one-time-code");
      for (let i = 1; i < list.length; i++) {
        expect(list[i].hasAttribute("name")).toBe(false);
      }
    });
  });

  describe("input", () => {
    it("fills the cell, reports the code and advances focus", () => {
      const onChange = vi.fn();
      const { container } = render(<InputOtp onChange={onChange} />);
      typeIn(container, 0, "5");
      expect(onChange).toHaveBeenCalledWith("5");
      expect(cells(container)[1]).toHaveFocus();
    });

    it("keeps focus on the last cell once it is filled", () => {
      const { container } = render(<InputOtp defaultValue="123" />);
      const list = cells(container);
      list[3].focus();
      typeIn(container, 3, "9");
      expect(values(container)).toEqual(["1", "2", "3", "9"]);
      expect(list[3]).toHaveFocus();
    });

    it("replaces the character of a filled cell it is focused on", () => {
      const onChange = vi.fn();
      const { container } = render(
        <InputOtp defaultValue="1234" onChange={onChange} />,
      );
      const list = cells(container);
      list[2].focus();
      typeIn(container, 2, "7");
      expect(onChange).toHaveBeenCalledWith("1274");
      expect(values(container)).toEqual(["1", "2", "7", "4"]);
    });

    it("writes a keystroke past the end at the end of the string, not into a hole", () => {
      const { container } = render(<InputOtp defaultValue="1" />);
      const list = cells(container);
      list[3].focus();
      typeIn(container, 3, "5");
      expect(values(container)).toEqual(["1", "5", "", ""]);
      expect(list[2]).toHaveFocus();
    });

    it("distributes a paste left-to-right and parks focus at the end", () => {
      const onChange = vi.fn();
      const { container } = render(<InputOtp onChange={onChange} />);
      const list = cells(container);
      list[1].focus();
      fireEvent.paste(list[1], { clipboardData: { getData: () => "987" } });
      expect(onChange).toHaveBeenCalledWith("987");
      expect(values(container)).toEqual(["9", "8", "7", ""]);
      expect(list[2]).toHaveFocus();
    });

    it("truncates a paste longer than the remaining capacity", () => {
      const { container } = render(<InputOtp length={6} defaultValue="12" />);
      const list = cells(container);
      list[2].focus();
      fireEvent.paste(list[2], { clipboardData: { getData: () => "3456789" } });
      expect(values(container)).toEqual(["1", "2", "3", "4", "5", "6"]);
    });

    it("ignores characters outside the allowed set when integerOnly", () => {
      const onChange = vi.fn();
      const { container } = render(<InputOtp integerOnly onChange={onChange} />);
      typeIn(container, 0, "a");
      expect(onChange).not.toHaveBeenCalled();
      typeIn(container, 0, "7");
      expect(onChange).toHaveBeenCalledWith("7");
      expect(cells(container)[0]).toHaveAttribute("inputmode", "numeric");
    });
  });

  describe("keyboard", () => {
    it("backspace clears a filled cell and keeps focus", () => {
      const onChange = vi.fn();
      const { container } = render(
        <InputOtp defaultValue="12" onChange={onChange} />,
      );
      const list = cells(container);
      list[1].focus();
      fireEvent.keyDown(list[1], { key: "Backspace" });
      expect(onChange).toHaveBeenCalledWith("1");
      expect(list[1]).toHaveFocus();
    });

    it("backspace on an empty cell clears the previous one and moves back", () => {
      const onChange = vi.fn();
      const { container } = render(
        <InputOtp defaultValue="12" onChange={onChange} />,
      );
      const list = cells(container);
      list[2].focus();
      fireEvent.keyDown(list[2], { key: "Backspace" });
      expect(onChange).toHaveBeenCalledWith("1");
      expect(list[1]).toHaveFocus();
    });

    it("arrow keys move focus without typing", () => {
      const { container } = render(<InputOtp defaultValue="1" />);
      const list = cells(container);
      list[0].focus();
      fireEvent.keyDown(list[0], { key: "ArrowRight" });
      expect(list[1]).toHaveFocus();
      fireEvent.keyDown(list[1], { key: "ArrowLeft" });
      expect(list[0]).toHaveFocus();
    });

    it("arrows stop at the edges", () => {
      const { container } = render(<InputOtp />);
      const list = cells(container);
      list[0].focus();
      fireEvent.keyDown(list[0], { key: "ArrowLeft" });
      expect(list[0]).toHaveFocus();
      list[3].focus();
      fireEvent.keyDown(list[3], { key: "ArrowRight" });
      expect(list[3]).toHaveFocus();
    });
  });

  describe("completion", () => {
    it("fires onComplete once, when the last cell transitions to filled", () => {
      const onChange = vi.fn();
      const onComplete = vi.fn();
      const { container } = render(
        <InputOtp length={2} onChange={onChange} onComplete={onComplete} />,
      );
      const list = cells(container);
      fireEvent.change(list[0], { target: { value: "1" } });
      expect(onComplete).not.toHaveBeenCalled();
      fireEvent.change(list[1], { target: { value: "2" } });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith("12");

      // Overwriting the last cell while already complete must not re-fire.
      list[1].focus();
      fireEvent.change(list[1], { target: { value: "9" } });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith("19");
    });
  });

  describe("states", () => {
    it("mask renders password inputs so the browser hides the characters", () => {
      const { container } = render(<InputOtp mask defaultValue="12" />);
      for (const cell of cells(container)) {
        expect(cell).toHaveAttribute("type", "password");
      }
    });

    it("disabled inputs do not change", () => {
      const onChange = vi.fn();
      const { container } = render(<InputOtp disabled onChange={onChange} />);
      const list = cells(container);
      for (const cell of list) expect(cell).toBeDisabled();
      fireEvent.change(list[0], { target: { value: "5" } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it("readOnly inputs keep the readOnly attribute", () => {
      const { container } = render(<InputOtp readOnly />);
      for (const cell of cells(container)) {
        expect(cell).toHaveAttribute("readonly");
      }
    });

    it("invalid paints the error border on every cell", () => {
      const { container } = render(<InputOtp invalid />);
      for (const cell of cells(container)) {
        expect(cell.className).toContain("border-rose-500");
      }
    });
  });

  describe("appearance", () => {
    it.each([
      ["outlined", "border-neutral-300"],
      ["filled", "bg-neutral-100"],
    ] as const)("renders the %s variant", (variant, expected) => {
      const { container } = render(<InputOtp variant={variant} />);
      const classList = cells(container)[0].className.split(/\s+/);
      expect(classList).toContain(expected);
    });

    it("emits the tone it was given, for every tone", () => {
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(<InputOtp tone={tone} />);
        expect(cells(container)[0].className).toContain(
          `focus:border-${tone}-400`,
        );
        unmount();
      }
    });

    it.each([
      ["sm", "h-9 w-9"],
      ["md", "h-11 w-11"],
      ["lg", "h-14 w-14"],
    ] as const)("renders the %s size", (size, expected) => {
      const { container } = render(<InputOtp size={size} />);
      const classList = cells(container)[0].className.split(/\s+/);
      expect(classList.join(" ")).toContain(expected);
    });

    it("offers every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(<InputOtp size={size} />);
        expect(cells(container)[0]).not.toBeNull();
        unmount();
      }
    });
  });

  describe("renderCell", () => {
    it("receives the cell context and keeps full behaviour through inputProps", () => {
      const onChange = vi.fn();
      const { container } = render(
        <InputOtp
          defaultValue="12"
          onChange={onChange}
          renderCell={(cell) => (
            <input
              {...cell.inputProps}
              data-custom-cell
              className={`underline-cell ${cell.focused ? "focused" : ""}`}
            />
          )}
        />,
      );
      const list = Array.from(container.querySelectorAll("[data-custom-cell]"));
      expect(list).toHaveLength(4);
      expect(list[0]).toHaveValue("1");
      expect(list[2].className).toContain("underline-cell");

      const list2 = Array.from(container.querySelectorAll("input"));
      fireEvent.focus(list2[0]);
      fireEvent.change(list2[0], { target: { value: "9" } });
      expect(onChange).toHaveBeenCalledWith("92");
    });
  });
});

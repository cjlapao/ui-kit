import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import MultiSelectPills from "./MultiSelectPills";
import type { MultiSelectPillOption } from "./MultiSelectPills";

const OPTIONS: MultiSelectPillOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma", disabled: true },
];

const pill = (name: string) => screen.getByRole("button", { name: new RegExp(name) });

describe("MultiSelectPills", () => {
  describe("tones", () => {
    it("paints red as red and green as green", () => {
      // The old hand-written 21-colour map mapped `red` to rose classes and
      // `green` to emerald ones, so two tones silently rendered as a different
      // colour. Composing with Pill removes the second source of truth.
      const { container: red } = render(
        <MultiSelectPills
          name="t"
          color="red"
          options={[OPTIONS[0]]}
          value={["a"]}
        />,
      );
      expect(red.innerHTML).toContain("red-500");
      expect(red.innerHTML).not.toContain("rose-500");

      const { container: green } = render(
        <MultiSelectPills
          name="t"
          color="green"
          options={[OPTIONS[0]]}
          value={["a"]}
        />,
      );
      expect(green.innerHTML).toContain("green-500");
      expect(green.innerHTML).not.toContain("emerald-500");
    });
  });

  describe("selection", () => {
    it("toggles several values when uncontrolled", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills name="t" options={OPTIONS} onChange={onChange} />,
      );
      fireEvent.click(pill("Alpha"));
      expect(onChange).toHaveBeenLastCalledWith(["a"]);

      fireEvent.click(pill("Beta"));
      expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);

      fireEvent.click(pill("Alpha"));
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
    });

    it("stays controlled when `value` is supplied", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          value={[]}
          onChange={onChange}
        />,
      );
      fireEvent.click(pill("Alpha"));
      expect(onChange).toHaveBeenCalledWith(["a"]);
      // The parent owns the state, so nothing moves until it says so.
      expect(pill("Alpha").getAttribute("aria-pressed")).toBe("false");
    });

    it("keeps only one value in single mode", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          selectionMode="single"
          onChange={onChange}
        />,
      );
      fireEvent.click(pill("Alpha"));
      fireEvent.click(pill("Beta"));
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
    });

    it("can refuse to deselect the single choice", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          selectionMode="single"
          allowDeselect={false}
          defaultValue={["a"]}
          onChange={onChange}
        />,
      );
      fireEvent.click(pill("Alpha"));
      expect(onChange).toHaveBeenLastCalledWith(["a"]);
    });

    it("ignores a disabled option", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills name="t" options={OPTIONS} onChange={onChange} />,
      );
      fireEvent.click(pill("Gamma"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("form value", () => {
    it("mirrors the selection into hidden inputs", () => {
      const Harness = () => {
        const [selected, setSelected] = useState<string[]>([]);
        return (
          <MultiSelectPills
            name="tags"
            options={OPTIONS}
            value={selected}
            onChange={setSelected}
          />
        );
      };
      const { container } = render(<Harness />);
      const inputs = () =>
        [...container.querySelectorAll<HTMLInputElement>('input[name="tags[]"]')];

      expect(inputs()).toHaveLength(3);
      expect(inputs().filter((i) => i.checked)).toHaveLength(0);

      fireEvent.click(pill("Alpha"));
      expect(inputs().filter((i) => i.checked).map((i) => i.value)).toEqual(["a"]);
    });

    it("hides those inputs from assistive tech", () => {
      // The Pill carries `aria-pressed`; announcing a checkbox as well would
      // read every option twice.
      const { container } = render(
        <MultiSelectPills name="t" options={OPTIONS} />,
      );
      for (const input of container.querySelectorAll("input")) {
        expect(input.getAttribute("aria-hidden")).toBe("true");
        expect(input.getAttribute("tabindex")).toBe("-1");
      }
    });
  });

  describe("appearance", () => {
    it("uses different variants for selected and unselected", () => {
      const { container } = render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          value={["a"]}
          color="violet"
        />,
      );
      const buttons = [...container.querySelectorAll("button")];
      expect(buttons[0].className).toContain("bg-violet-500");
      expect(buttons[1].className).not.toContain("bg-violet-500");
    });

    it("supports the glass variants", () => {
      const { container } = render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          value={["a"]}
          variant="liquid-glass"
          unselectedVariant="glass"
        />,
      );
      for (const button of container.querySelectorAll("button")) {
        expect(button.className).toContain("backdrop-blur");
      }
    });

    it("marks the selection with more than colour when asked", () => {
      // `neutral` selected and unselected differ by a barely-visible fill, so
      // a group in that tone signalled its state by colour alone.
      const { container } = render(
        <MultiSelectPills
          name="t"
          options={OPTIONS}
          value={["a"]}
          checkmark
        />,
      );
      const buttons = [...container.querySelectorAll("button")];
      expect(buttons[0].querySelector("svg")).not.toBeNull();
      expect(buttons[1].querySelector("svg")).toBeNull();
    });

    it("rounds the pills on request", () => {
      const { container } = render(
        <MultiSelectPills name="t" options={OPTIONS} rounded="md" />,
      );
      const button = container.querySelector("button")!;
      expect(button.className).toContain("rounded-md");
      expect(button.className).not.toContain("rounded-full");
    });
  });
});

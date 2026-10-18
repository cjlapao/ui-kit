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

const pill = (name: string) =>
  screen.getByRole("checkbox", { name: new RegExp(name) });
const radio = (name: string) =>
  screen.getByRole("radio", { name: new RegExp(name) });

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
      expect(pill("Alpha").getAttribute("aria-checked")).toBe("false");
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
      fireEvent.click(radio("Alpha"));
      fireEvent.click(radio("Beta"));
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
      fireEvent.click(radio("Alpha"));
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
      const inputs = () => [
        ...container.querySelectorAll<HTMLInputElement>('input[name="tags[]"]'),
      ];

      expect(inputs()).toHaveLength(3);
      expect(inputs().filter((i) => i.checked)).toHaveLength(0);

      fireEvent.click(pill("Alpha"));
      expect(
        inputs()
          .filter((i) => i.checked)
          .map((i) => i.value),
      ).toEqual(["a"]);
    });

    it("hides those inputs from assistive tech", () => {
      // The Pill carries the role and `aria-checked`; announcing a form
      // input as well would read every option twice.
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
      // Word-boundary match: the outline pill's interactive hover step
      // `dark:hover:bg-violet-500/20` legitimately contains the substring
      // `bg-violet-500` — the assertion is about the solid FILL class.
      expect(buttons[0].className).toMatch(/(^|\s)bg-violet-500(\s|$)/);
      expect(buttons[1].className).not.toMatch(/(^|\s)bg-violet-500(\s|$)/);
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
        <MultiSelectPills name="t" options={OPTIONS} value={["a"]} checkmark />,
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

  describe("kit conventions", () => {
    it("defaults to the shared md control size", () => {
      const { container } = render(
        <MultiSelectPills name="t" options={OPTIONS} />,
      );
      // `sm` was a leftover of the component-local size scale; pills line up
      // with the rest of the kit at the Pill's own default now.
      expect(container.querySelector("button")!.className).toContain("h-6");
    });

    it("takes `tone` and still honours the deprecated `color`", () => {
      for (const alias of ["tone", "color"] as const) {
        const { container } = render(
          <MultiSelectPills
            name="t"
            options={[OPTIONS[0]]}
            value={["a"]}
            {...{ [alias]: "violet" }}
          />,
        );
        expect(container.querySelector("button")!.className).toMatch(
          /(^|\s)bg-violet-500(\s|$)/,
        );
      }
    });

    it("takes `corner` and still honours the deprecated `rounded`", () => {
      const { container } = render(
        <MultiSelectPills name="t" options={OPTIONS} corner="lg" />,
      );
      const button = container.querySelector("button")!;
      expect(button.className).toContain("rounded-lg");
      expect(button.className).not.toContain("rounded-full");
    });

    it("announces a checkbox group in multiple mode", () => {
      render(
        <MultiSelectPills
          name="t"
          legend="Includes"
          options={OPTIONS}
          value={["a"]}
        />,
      );
      const boxes = screen.getAllByRole("checkbox");
      // The hidden form inputs are aria-hidden — only the pills are announced.
      expect(boxes).toHaveLength(3);
      expect(boxes[0].getAttribute("aria-checked")).toBe("true");
      expect(boxes[1].getAttribute("aria-checked")).toBe("false");
      // Every checkbox is its own tab stop, like the native stack they mirror.
      expect(boxes[1].getAttribute("tabindex")).toBeNull();
    });

    it("is a legend-named radiogroup in single mode, with a roving tab stop", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectPills
          name="t"
          legend="Mode"
          options={OPTIONS}
          selectionMode="single"
          defaultValue={["a"]}
          onChange={onChange}
        />,
      );
      // The role lands on the fieldset itself — one element, named by its
      // own legend.
      const group = screen.getByRole("radiogroup", { name: "Mode" });
      expect(group.tagName).toBe("FIELDSET");
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
      expect(
        radios.filter((r) => r.getAttribute("tabindex") === "0"),
      ).toHaveLength(1);

      // From the tab stop, arrows pick and wrap; `Gamma` is disabled, so
      // Beta's next is Alpha.
      fireEvent.keyDown(radios[0], { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
      expect(document.activeElement).toBe(radios[1]);

      fireEvent.keyDown(radios[1], { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith(["a"]);

      // Home/End land on the first/last *selectable* option.
      fireEvent.keyDown(radios[0], { key: "End" });
      expect(onChange).toHaveBeenLastCalledWith(["b"]);
    });

    it("submits a plain radio field in single mode", () => {
      const { container } = render(
        <MultiSelectPills
          name="mode"
          options={OPTIONS}
          selectionMode="single"
          defaultValue={["a"]}
        />,
      );
      const inputs = [
        ...container.querySelectorAll<HTMLInputElement>(
          'input[type="radio"][name="mode"]',
        ),
      ];
      expect(inputs).toHaveLength(3);
      expect(inputs.filter((i) => i.checked).map((i) => i.value)).toEqual([
        "a",
      ]);
    });
  });
});

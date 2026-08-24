import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import Checkbox from "./Checkbox";
import { CONTROL_SIZES, INPUT_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const box = (container: HTMLElement) =>
  container.querySelector("input")!.nextElementSibling!.className;

describe("Checkbox", () => {
  describe("the control is drawn, not native", () => {
    it("hides the native rendering so the box styling applies", () => {
      // The old control kept `appearance: auto` and layered `rounded border
      // bg-white dark:bg-neutral-900 checked:border-transparent …` on it. A
      // native checkbox ignores all of that — measured `border-width: 0`,
      // `border-radius: 0` — so only `accent-color` did anything, and dark mode
      // rendered the browser's light widget.
      const { container } = render(<Checkbox label="t" />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("appearance-none");
      expect(input.className).toContain("opacity-0");
      expect(box(container)).toContain("border-2");
    });

    it("puts the box and both glyphs as siblings of the input", () => {
      // `peer-*` compiles to a general-sibling selector, so a glyph nested
      // inside the box would never match.
      const { container } = render(<Checkbox label="t" />);
      const input = container.querySelector("input")!;
      const siblings = [...input.parentElement!.children].filter(
        (node) => node !== input,
      );
      expect(siblings).toHaveLength(3);
      for (const sibling of siblings) {
        expect(sibling.className).toMatch(/peer-(checked|indeterminate|hover)/);
      }
    });
  });

  describe("tones", () => {
    it("paints every tone, with a glyph that survives the fill", () => {
      // White on `{color}-600` is 2.94:1 on yellow — under even the 3:1 WCAG
      // asks of a graphical object. The fill steps to -700 light / -400 dark.
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(
          <Checkbox color={color} label="t" />,
        );
        const classes = box(container);
        expect(classes).toContain(`peer-checked:bg-${color}-700`);
        expect(classes).toContain(`dark:peer-checked:bg-${color}-400`);
        unmount();
      }
    });

    it("matches the glyph colour to the fill in each theme", () => {
      const { container } = render(<Checkbox color="yellow" label="t" />);
      const glyph = container.querySelectorAll("svg")[0].parentElement!;
      expect(glyph.className).toContain("text-white");
      expect(glyph.className).toContain("dark:text-yellow-950");
    });
  });

  describe("size", () => {
    it("renders a real class at every step", () => {
      // `text-md` and `mt-0.2` are not Tailwind classes; the `md` row had no
      // type size and the `lg` row no offset.
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(
          <Checkbox size={size} label="t" description="d" />,
        );
        expect(container.innerHTML).not.toContain("text-md");
        expect(container.innerHTML).not.toContain("mt-0.2");
        unmount();
      }
    });

    it("scales the box and the type together", () => {
      const { container: small } = render(<Checkbox size="xs" label="t" />);
      const { container: large } = render(<Checkbox size="xl" label="t" />);
      expect(small.innerHTML).toContain("h-3.5 w-3.5");
      expect(small.innerHTML).toContain("text-xs");
      expect(large.innerHTML).toContain("h-7 w-7");
      expect(large.innerHTML).toContain("text-xl");
    });
  });

  describe("variant", () => {
    it("offers the same surfaces as Input and SearchBar", () => {
      // A checkbox that is always an opaque white square does not match a
      // `glass` SearchBar sitting next to it in the same form.
      for (const variant of INPUT_VARIANTS) {
        const { container, unmount } = render(
          <Checkbox variant={variant} label="t" />,
        );
        expect(box(container)).not.toBe("");
        unmount();
      }
    });

    it("makes the see-through variants see-through", () => {
      const { container: flat } = render(<Checkbox variant="flat" label="t" />);
      const { container: glass } = render(
        <Checkbox variant="glass" label="t" />,
      );
      expect(box(flat)).toContain("bg-white");
      expect(box(glass)).toContain("backdrop-blur");
      expect(box(glass)).toContain("bg-white/45");
    });

    it("carries no radius, so the size token keeps control of it", () => {
      // `rounded-lg` from the variant would be a same-specificity fight with
      // the per-size radius on the wrapper.
      for (const variant of INPUT_VARIANTS) {
        const { container, unmount } = render(
          <Checkbox variant={variant} size="xs" label="t" />,
        );
        expect(box(container)).not.toMatch(/\brounded-(?!\[inherit\])/);
        unmount();
      }
    });

    it("lets the error border replace the variant's, not stack on it", () => {
      const { container } = render(
        <Checkbox variant="glass" validationStatus="error" label="t" />,
      );
      const classes = box(container);
      expect(classes).toContain("border-rose-400");
      expect(classes).not.toContain("border-white/50");
    });
  });

  describe("indeterminate", () => {
    it("sets the DOM property on mount, not only on change", () => {
      const { container } = render(<Checkbox label="t" indeterminate />);
      expect(container.querySelector("input")!.indeterminate).toBe(true);
    });

    it("announces itself as mixed", () => {
      render(<Checkbox label="t" indeterminate />);
      expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
        "mixed",
      );
    });

    it("clears when the prop goes away", () => {
      const { container, rerender } = render(
        <Checkbox label="t" indeterminate />,
      );
      rerender(<Checkbox label="t" indeterminate={false} />);
      expect(container.querySelector("input")!.indeterminate).toBe(false);
    });
  });

  describe("disabled", () => {
    it("keeps the checked fill so the tick stays visible", () => {
      // `peer-disabled:bg-neutral-100` beat `peer-checked:bg-{tone}-700` on
      // emission order, so a disabled checked box lost its fill and its white
      // tick disappeared into the grey.
      const { container } = render(<Checkbox label="t" disabled defaultChecked />);
      const classes = box(container);
      expect(classes).toContain("peer-checked:bg-blue-700");
      expect(classes).not.toContain("peer-disabled:bg-");
    });
  });

  describe("validation", () => {
    it("marks an error on the input and the box", () => {
      const { container } = render(
        <Checkbox label="t" validationStatus="error" validationMessage="Nope" />,
      );
      expect(
        container.querySelector("input")!.getAttribute("aria-invalid"),
      ).toBe("true");
      expect(box(container)).toContain("border-rose-400");
      expect(screen.getByText("Nope")).toBeTruthy();
    });

    it("points `aria-describedby` at both the description and the message", () => {
      const { container } = render(
        <Checkbox label="t" description="Help" validationMessage="Nope" />,
      );
      const input = container.querySelector("input")!;
      const ids = input.getAttribute("aria-describedby")!.split(" ");
      expect(ids).toHaveLength(2);
      for (const id of ids) {
        expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
      }
    });

    it("marks a required label", () => {
      const { container } = render(<Checkbox label="Terms" required />);
      expect(container.querySelector("input")!.required).toBe(true);
      expect(container.textContent).toContain("*");
    });
  });

  describe("behaviour", () => {
    it("toggles through the hidden input", () => {
      const Harness = () => {
        const [checked, setChecked] = useState(false);
        return (
          <Checkbox
            label="t"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
        );
      };
      render(<Harness />);
      const input = screen.getByRole("checkbox") as HTMLInputElement;
      fireEvent.click(input);
      expect(input.checked).toBe(true);
    });

    it("forwards a ref to the real input", () => {
      const ref = vi.fn();
      render(<Checkbox label="t" ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });

    it("associates the label with the input", () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText("Accept terms")).toBeTruthy();
    });
  });
});

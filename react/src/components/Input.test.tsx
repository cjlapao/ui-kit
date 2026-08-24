import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";
import { getInputVariantTokens } from "../theme/Theme";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "../../../common/theme/Theme";

const field = (container: HTMLElement) =>
  container.querySelector("span.group")!.className;

describe("Input", () => {
  /**
   * `Input` used to hardcode its copy and icon colours while taking only
   * `surface` from the theme, so a theme-level contrast fix reached `SearchBar`
   * and `Textarea` and silently skipped this control. These keep all four token
   * fields wired up — the surface now lands on the field wrapper, matching
   * `SearchBar`, and the copy on the `<input>` inside it.
   */
  describe("variant tokens", () => {
    it.each(INPUT_VARIANTS)("applies the %s surface and copy", (variant) => {
      const { container } = render(<Input variant={variant} placeholder="p" />);
      const tokens = getInputVariantTokens(variant);
      const box = field(container).split(/\s+/);
      const copy = screen.getByPlaceholderText("p").className.split(/\s+/);

      for (const expected of tokens.surface.split(/\s+/)) {
        expect(box).toContain(expected);
      }
      for (const expected of tokens.text.split(/\s+/)) {
        expect(copy).toContain(expected);
      }
    });

    it("gives underline the high-contrast copy, not the solid set", () => {
      render(<Input variant="underline" placeholder="p" />);
      const classes = screen.getByPlaceholderText("p").className;

      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).toContain("dark:placeholder:text-neutral-300");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("drops the horizontal padding for underline", () => {
      // There is no box to inset from, and the text needs room above the rule.
      const { container } = render(<Input variant="underline" />);
      expect(field(container)).toContain("pt-2 pb-3");
      expect(field(container)).not.toContain("px-3");
    });

    it("paints no ring around a borderless underline", () => {
      const { container } = render(<Input variant="underline" />);
      expect(field(container)).not.toContain("ring-2");
    });

    it("puts a glow behind the gradient variant only", () => {
      const { container: gradient } = render(<Input variant="gradient" />);
      const { container: flat } = render(<Input variant="flat" />);
      expect(gradient.querySelector('[aria-hidden="true"]')).not.toBeNull();
      expect(flat.querySelector('[aria-hidden="true"]')).toBeNull();
    });
  });

  describe("tones", () => {
    it("emits the tone it was given, for every tone", () => {
      // The hand-written 21-entry map had two wrong: `red` emitted `rose-*` and
      // `green` emitted `emerald-*`, so those tones rendered as another colour.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(<Input tone={tone} />);
        expect(field(container)).toContain(`focus-within:border-${tone}-400`);
        expect(field(container)).toContain(
          `focus-within:ring-${tone}-400/60`,
        );
        unmount();
      }
    });

    it("keeps red red and green green", () => {
      const { container: red } = render(<Input tone="red" />);
      expect(field(red)).toContain("red-400");
      expect(field(red)).not.toContain("rose-400");

      const { container: green } = render(<Input tone="green" />);
      expect(field(green)).toContain("green-400");
      expect(field(green)).not.toContain("emerald-400");
    });

    it("insets the focus ring so a scrolling ancestor cannot clip it", () => {
      const { container } = render(<Input tone="blue" />);
      expect(field(container)).toContain("focus-within:ring-inset");
    });

    it("accepts `color` as an alias for `tone`", () => {
      const { container } = render(<Input color="violet" />);
      expect(field(container)).toContain("focus-within:border-violet-400");
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      // Was a local "sm" | "md" | "lg"; `xs` and `xl` were unreachable even
      // though every sibling control had them.
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(<Input size={size} />);
        expect(field(container)).not.toBe("");
        unmount();
      }
    });

    it("scales padding and type together", () => {
      const { container: small } = render(<Input size="xs" placeholder="p" />);
      expect(field(small)).toContain("px-2");
      expect(screen.getByPlaceholderText("p").className).toContain("text-xs");
    });
  });

  describe("validation", () => {
    it("does not overwrite the variant's copy colour", () => {
      // The status classes used to force `text-neutral-900
      // placeholder:text-neutral-400 dark:text-neutral-100`, so an errored
      // glass or underline field lost its high-contrast pair.
      render(
        <Input variant="underline" validationStatus="error" placeholder="p" />,
      );
      const classes = screen.getByPlaceholderText("p").className;
      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("puts the status border on the box", () => {
      const { container } = render(<Input validationStatus="error" />);
      expect(field(container)).toContain("border-rose-500");
    });

    it("sets aria-invalid, and a caller cannot contradict it", () => {
      render(
        <Input validationStatus="error" aria-invalid={false} placeholder="p" />,
      );
      expect(
        screen.getByPlaceholderText("p").getAttribute("aria-invalid"),
      ).toBe("true");
    });
  });

  describe("disabled", () => {
    it("dims rather than repainting the fill", () => {
      // `disabled:bg-neutral-100` was a same-specificity fight with every
      // variant's own fill, and turned a glass field into a grey slab.
      const { container } = render(<Input variant="glass" disabled />);
      expect(field(container)).toContain("opacity-60");
      expect(field(container)).not.toContain("disabled:bg-neutral-100");
      expect(field(container)).toContain("bg-white/45");
    });
  });

  describe("icons", () => {
    it("takes its resting colour from the variant and its accent from the tone", () => {
      // Both used to be unprefixed `text-*` on the same element, so which one
      // won was decided by emission order.
      const { container } = render(
        <Input variant="underline" tone="violet" leadingIcon="Search" />,
      );
      const icon = container.querySelector("span.mr-2")!.className;
      expect(icon).toContain("text-neutral-600");
      expect(icon).toContain("group-focus-within:text-violet-500");
    });

    it("renders the trailing icon as a button with a name when clickable", () => {
      const onClick = vi.fn();
      render(
        <Input
          trailingIcon="Close"
          onTrailingIconClick={onClick}
          trailingIconLabel="Clear field"
        />,
      );
      const button = screen.getByRole("button", { name: "Clear field" });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("keeps a static trailing icon out of the pointer path", () => {
      const { container } = render(<Input trailingIcon="Info" />);
      expect(container.querySelector("button")).toBeNull();
      expect(container.querySelector("span.ml-2")!.className).toContain(
        "pointer-events-none",
      );
    });

    it("needs no padding hack to make room for them", () => {
      // The icons were absolutely positioned and the input carried `pl-10` /
      // `pr-10` to clear them; they are flex siblings now.
      const { container } = render(
        <Input leadingIcon="Search" trailingIcon="Info" placeholder="p" />,
      );
      const classes = screen.getByPlaceholderText("p").className;
      expect(classes).not.toContain("pl-");
      expect(classes).not.toContain("pr-");
      expect(container.querySelector("span.mr-2")).not.toBeNull();
    });
  });

  describe("unstyled", () => {
    it("drops the surface for InputGroup", () => {
      const { container } = render(<Input unstyled variant="elevated" />);
      expect(field(container)).not.toContain("border-neutral-300");
      expect(field(container)).not.toContain("shadow-sm");
    });
  });

  describe("behaviour", () => {
    it("forwards a ref to the real input", () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });

    it("passes change events through", () => {
      const onChange = vi.fn();
      render(<Input onChange={onChange} placeholder="p" />);
      fireEvent.change(screen.getByPlaceholderText("p"), {
        target: { value: "x" },
      });
      expect(onChange).toHaveBeenCalledOnce();
    });
  });
});

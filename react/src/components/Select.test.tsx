import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Select from "./Select";
import { getInputVariantTokens } from "../theme/Theme";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
  getControlSizeTokens,
} from "../../../common/theme/Theme";

const field = (container: HTMLElement) =>
  container.querySelector("span.group")!.className;

const options = (
  <>
    <option value="a">A</option>
    <option value="b">B</option>
  </>
);

describe("Select", () => {
  describe("variant tokens", () => {
    it.each(INPUT_VARIANTS)("applies the %s surface and copy", (variant) => {
      const { container } = render(
        <Select variant={variant} aria-label="s">
          {options}
        </Select>,
      );
      const tokens = getInputVariantTokens(variant);
      const box = field(container).split(/\s+/);
      const copy = screen.getByLabelText("s").className.split(/\s+/);

      for (const expected of tokens.surface.split(/\s+/)) {
        expect(box).toContain(expected);
      }
      for (const expected of tokens.text.split(/\s+/)) {
        expect(copy).toContain(expected);
      }
    });

    it("was hardcoded to one surface before", () => {
      // `rounded-lg border border-neutral-300 bg-white shadow-sm` was baked in,
      // so a Select was the one control in a form that could not be made to
      // match the Input and SearchBar beside it.
      const { container: glass } = render(
        <Select variant="glass" aria-label="s">
          {options}
        </Select>,
      );
      expect(field(glass)).toContain("backdrop-blur-md");
      expect(field(glass)).not.toContain("border-neutral-300");
    });

    it("drops the horizontal padding for underline and paints no ring", () => {
      const { container } = render(
        <Select variant="underline" aria-label="s">
          {options}
        </Select>,
      );
      expect(field(container)).toContain("pt-2 pb-3");
      expect(field(container)).not.toContain("px-3");
      expect(field(container)).not.toContain("ring-2");
    });
  });

  describe("tones", () => {
    it("emits the tone it was given, for every tone", () => {
      // The hand-written map pointed `gray`, `zinc` and `stone` at
      // `neutral-500` classes, so three of the five neutral tones silently
      // rendered as a fourth.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <Select tone={tone} aria-label="s">
            {options}
          </Select>,
        );
        expect(field(container)).toContain(`focus-within:border-${tone}-400`);
        unmount();
      }
    });

    it("keeps the neutrals distinct", () => {
      for (const tone of ["gray", "zinc", "stone"] as const) {
        const { container, unmount } = render(
          <Select tone={tone} aria-label="s">
            {options}
          </Select>,
        );
        expect(field(container)).toContain(`focus-within:border-${tone}-400`);
        expect(field(container)).not.toContain("border-neutral-500");
        unmount();
      }
    });

    it("insets the focus ring so a scrolling ancestor cannot clip it", () => {
      const { container } = render(
        <Select aria-label="s">{options}</Select>,
      );
      expect(field(container)).toContain("focus-within:ring-inset");
    });

    it("accepts `color` as an alias for `tone`", () => {
      const { container } = render(
        <Select color="violet" aria-label="s">
          {options}
        </Select>,
      );
      expect(field(container)).toContain("focus-within:border-violet-400");
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      // Was a local "sm" | "md" | "lg".
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(
          <Select size={size} aria-label="s">
            {options}
          </Select>,
        );
        expect(field(container)).not.toBe("");
        unmount();
      }
    });

    it("gives the box one horizontal padding, not two", () => {
      // The size token carried `pr-9`/`pr-10`/`pr-11` and the caret branch
      // added another `pr-10` on top; a leading icon added `pl-9` next to the
      // token's own `px-*`. Both were same-specificity fights.
      const { container } = render(
        <Select size="sm" leadingIcon="Search" aria-label="s">
          {options}
        </Select>,
      );
      const tokens = field(container)
        .split(/\s+/)
        .filter((token) => /^(p[xlr])-/.test(token));
      expect(tokens).toEqual(["px-2.5"]);
    });
  });

  describe("caret and icons", () => {
    it("hides the platform caret so ours is the only one", () => {
      render(<Select aria-label="s">{options}</Select>);
      expect(screen.getByLabelText("s").className).toContain("appearance-none");
    });

    it("takes its resting colour from the variant and its accent from the tone", () => {
      // The caret used to be tone-coloured at rest and never changed on focus.
      const { container } = render(
        <Select variant="underline" tone="violet" aria-label="s">
          {options}
        </Select>,
      );
      const caret = container.querySelector("span.ml-2")!.className;
      expect(caret).toContain("text-neutral-600");
      expect(caret).toContain("group-focus-within:text-violet-500");
    });

    it("drops the caret for multiple and on request", () => {
      const { container: multi } = render(
        <Select multiple aria-label="s">
          {options}
        </Select>,
      );
      expect(multi.querySelector("span.ml-2")).toBeNull();

      const { container: hidden } = render(
        <Select hideCaret aria-label="s">
          {options}
        </Select>,
      );
      expect(hidden.querySelector("span.ml-2")).toBeNull();
    });

    it("opts into a stylable picker where the browser has one", () => {
      // The platform popup respects `color` and `background-color` on an
      // `<option>` and nothing else. `appearance: base-select` (Chrome 135+)
      // swaps it for a real element the kit can style; the class matches
      // nothing elsewhere, so those browsers keep the native popup.
      render(<Select aria-label="s">{options}</Select>);
      expect(screen.getByLabelText("s").className).toContain("ui-select");
    });

    it("drives the picker's accent from the tone", () => {
      // Tailwind exposes every palette entry as a CSS variable, so the tone
      // travels as a variable reference — nothing to safelist, and the
      // stylesheet stays colour-agnostic.
      const { container } = render(
        <Select tone="violet" aria-label="s">
          {options}
        </Select>,
      );
      const style = container.querySelector("select")!.getAttribute("style")!;
      expect(style).toContain("--ui-select-accent: var(--color-violet-500)");
      expect(style).toContain(
        "--ui-select-accent-strong: var(--color-violet-700)",
      );
    });

    it("keeps the accent when the caller passes a style", () => {
      // `{...rest}` would have dropped it outright.
      const { container } = render(
        <Select tone="violet" style={{ width: "10rem" }} aria-label="s">
          {options}
        </Select>,
      );
      const style = container.querySelector("select")!.getAttribute("style")!;
      expect(style).toContain("--ui-select-accent");
      expect(style).toContain("width: 10rem");
    });

    it("gives the options their own fill for the native popup", () => {
      // The dropdown is painted by the platform from the select's own
      // background; with the surface on the wrapper the select is transparent,
      // which would leave the open list white in dark mode.
      render(<Select aria-label="s">{options}</Select>);
      const classes = screen.getByLabelText("s").className;
      expect(classes).toContain("[&>option]:bg-white");
      expect(classes).toContain("dark:[&>option]:bg-neutral-900");
    });
  });

  describe("validation", () => {
    it("does not overwrite the variant's copy colour", () => {
      render(
        <Select variant="underline" validationStatus="error" aria-label="s">
          {options}
        </Select>,
      );
      // The status classes used to force `text-neutral-900
      // dark:text-neutral-100`, so an errored glass or underline select lost
      // the high-contrast pair. The placeholder is what distinguishes them.
      const classes = screen.getByLabelText("s").className;
      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).toContain("dark:text-neutral-50");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("puts the status border on the box", () => {
      const { container } = render(
        <Select validationStatus="error" aria-label="s">
          {options}
        </Select>,
      );
      expect(field(container)).toContain("border-rose-500");
    });

    it("sets aria-invalid, and a caller cannot contradict it", () => {
      render(
        <Select validationStatus="error" aria-invalid={false} aria-label="s">
          {options}
        </Select>,
      );
      expect(screen.getByLabelText("s").getAttribute("aria-invalid")).toBe(
        "true",
      );
    });
  });

  describe("disabled", () => {
    it("dims rather than repainting the fill", () => {
      const { container } = render(
        <Select variant="glass" disabled aria-label="s">
          {options}
        </Select>,
      );
      expect(field(container)).toContain("opacity-60");
      expect(field(container)).not.toContain("disabled:bg-neutral-100");
      expect(field(container)).toContain("bg-white/45");
    });
  });

  describe("behaviour", () => {
    it("renders a placeholder option that cannot be chosen", () => {
      render(
        <Select placeholder="Pick one" aria-label="s">
          {options}
        </Select>,
      );
      const option = screen.getByText("Pick one") as HTMLOptionElement;
      expect(option.disabled).toBe(true);
      expect(option.hidden).toBe(true);
    });

    it("actually shows the placeholder when nothing is selected", () => {
      // A `hidden disabled` first option is not what the browser lands on: for
      // an uncontrolled select it picks the first *selectable* option, so the
      // placeholder never appeared unless the caller also passed `value=""`.
      const { container } = render(
        <Select placeholder="Pick one" aria-label="s">
          {options}
        </Select>,
      );
      expect((container.querySelector("select") as HTMLSelectElement).value).toBe(
        "",
      );
    });

    it("does not fight a caller that owns the value", () => {
      const { container } = render(
        <Select placeholder="Pick one" defaultValue="b" aria-label="s">
          {options}
        </Select>,
      );
      expect((container.querySelector("select") as HTMLSelectElement).value).toBe(
        "b",
      );
    });

    it("forwards a ref and change events", () => {
      const ref = vi.fn();
      const onChange = vi.fn();
      render(
        <Select ref={ref} onChange={onChange} aria-label="s">
          {options}
        </Select>,
      );
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLSelectElement));
      fireEvent.change(screen.getByLabelText("s"), { target: { value: "b" } });
      expect(onChange).toHaveBeenCalledOnce();
    });

    it("drops the surface when unstyled, for InputGroup", () => {
      const { container } = render(
        <Select unstyled aria-label="s">
          {options}
        </Select>,
      );
      expect(field(container)).not.toContain("border-neutral-300");
      expect(field(container)).not.toContain("shadow-sm");
    });
  });

  describe("value placement", () => {
    // The platform draws the selected value centred within the select's
    // intrinsic content region — a 24px box at the kit's font sizes — not
    // within the CSS line box. With the natural line heights (16–24px) the
    // value sat 2.5px high at `md` and 4px high at `xs`/`sm`, while an Input
    // beside it sat dead-centre. The line box is forced to the region's
    // height (`leading-6`) so the platform centres the value in every size.
    it.each(CONTROL_SIZES)("matches the line box to the box at %s", (size) => {
      render(
        <Select size={size} aria-label="s">
          {options}
        </Select>,
      );
      expect(screen.getByLabelText("s").className).toContain("leading-6");
    });

    it("leaves underline alone — its value sits clear of the rule, not centred in a box", () => {
      render(
        <Select variant="underline" aria-label="s">
          {options}
        </Select>,
      );
      expect(screen.getByLabelText("s").className).not.toContain("leading-6");
    });

    it("leaves multiple alone — a list, not a single value", () => {
      render(
        <Select multiple aria-label="s">
          {options}
        </Select>,
      );
      expect(screen.getByLabelText("s").className).not.toContain("leading-6");
    });

    // The options inherit the select's forced line height, which would grow
    // every dropdown row 4px; they pin their own line height back to the
    // size's natural one.
    it.each(CONTROL_SIZES)(
      "keeps the popup rows at their natural height at %s",
      (size) => {
        // Tailwind's type scale: text-xs = 16px = leading-4, text-sm = 20px
        // = leading-5, text-base = 24px = leading-6.
        const leadingFor: Record<string, string> = {
          "text-xs": "[&>option]:leading-4",
          "text-sm": "[&>option]:leading-5",
          "text-base": "[&>option]:leading-6",
        };
        const textClass = getControlSizeTokens(size).text
          .split(/\s+/)
          .find((token) => token.startsWith("text-"))!;
        render(
          <Select size={size} aria-label="s">
            {options}
          </Select>,
        );
        expect(screen.getByLabelText("s").className).toContain(
          leadingFor[textClass],
        );
      },
    );
  });

  describe("caret clicks", () => {
    // The caret and the wrapper padding are outside the <select>; before the
    // fix a click on them landed on the wrapper span and nothing happened, so
    // only the middle strip of the box opened the dropdown.
    const stubShowPicker = (select: HTMLElement) => {
      const showPicker = vi.fn();
      (select as HTMLSelectElement & { showPicker?: () => void }).showPicker =
        showPicker;
      return showPicker;
    };

    it("opens the picker when the caret is clicked", () => {
      const { container } = render(
        <Select aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      const showPicker = stubShowPicker(select);
      fireEvent.click(container.querySelector("span.ml-2")!);
      expect(showPicker).toHaveBeenCalledOnce();
    });

    it("opens the picker when the wrapper padding is clicked", () => {
      const { container } = render(
        <Select aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      const showPicker = stubShowPicker(select);
      fireEvent.click(container.querySelector("span.group")!);
      expect(showPicker).toHaveBeenCalledOnce();
    });

    it("leaves a click on the select itself to the platform", () => {
      render(
        <Select aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      const showPicker = stubShowPicker(select);
      fireEvent.click(select);
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("does not open the picker when disabled", () => {
      const { container } = render(
        <Select disabled aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      const showPicker = stubShowPicker(select);
      fireEvent.click(container.querySelector("span.group")!);
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("does not open the picker for multiple", () => {
      const { container } = render(
        <Select multiple aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      const showPicker = stubShowPicker(select);
      fireEvent.click(container.querySelector("span.group")!);
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("focuses the select where showPicker is unavailable", () => {
      // Firefox has no showPicker; the fallback is still better than the
      // click being lost. jsdom never has it, so this is the default path.
      const { container } = render(
        <Select aria-label="s">
          {options}
        </Select>,
      );
      const select = screen.getByLabelText("s");
      fireEvent.click(container.querySelector("span.group")!);
      expect(document.activeElement).toBe(select);
    });
  });
});

import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";
import { getInputVariantTokens, stripFillClass } from "../theme/Theme";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "../../../common/theme/Theme";

const field = (container: HTMLElement) =>
  container.querySelector("span.group")!.className;

afterEach(cleanup);

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
      const tokens = getInputVariantTokens(variant, "blue");
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

  it("tints the ghost surface with the tone", () => {
    // Ghost used to be a grey slab whatever the tone said.
    const { container } = render(
      <Input variant="ghost" tone="violet" placeholder="p" />,
    );
    const box = field(container);
    expect(box).toContain("bg-violet-100");
    expect(box).toContain("hover:bg-violet-200");
    expect(box).toContain("hover:border-violet-300");
    expect(box).toContain("dark:bg-violet-500/10");
    expect(box).not.toContain("bg-neutral-200");
  });

  it("starts the achromatic tones a rung darker, where they are visible", () => {
    // The five hueless tones measure ΔE 1.7–2.1 off white at the tint table's
    // first step — on a white panel a `tone="neutral"` field had no box at
    // all, which is the bug this pins. They ride `-200` rest / `-300` hover /
    // `-400` rim, the rung where they read as loudly as a coloured `-100`.
    const { container } = render(<Input variant="ghost" tone="neutral" />);
    const box = field(container);
    expect(box).toContain("bg-neutral-200");
    expect(box).toContain("hover:bg-neutral-300");
    expect(box).toContain("hover:border-neutral-400");
  });

  /**
   * `getInputVariantTokens` took a tone and spent it in the ghost branch
   * alone, so a `glass` + `tone="blue"` pair painted `bg-white/45` and read as
   * an `elevated` box dropped onto the backdrop — measured in the browser, its
   * computed fill was `oklab(1 0 0 / 0.1)`, white with no hue at all. The fill
   * now follows a tone the caller *chose*, and only one: every field resolves a
   * missing tone to `blue`, so tinting from the resolved value would repaint
   * every bare glass field in the product.
   */
  describe("a glass field given a tone", () => {
    it("tints the fill in both schemes", () => {
      const { container } = render(<Input variant="glass" tone="blue" />);
      const cls = field(container);
      expect(cls).toContain("bg-blue-100/45");
      expect(cls).toContain("dark:bg-blue-500/10");
      expect(cls).not.toContain("bg-white/45");
    });

    it("keeps the trim that makes it glass rather than ghost", () => {
      // The strip that removes the white fill must not take the rim, the blur
      // or the shadow with it — they are the whole difference between the two.
      const { container } = render(<Input variant="glass" tone="violet" />);
      const cls = field(container);
      expect(cls).toContain("border-black/15");
      expect(cls).toContain("dark:border-white/15");
      expect(cls).toContain("backdrop-blur-md");
      expect(cls).toContain("shadow-sm");
      expect(cls).toContain("rounded-lg");
    });

    it("tints from the deprecated color alias as well", () => {
      // `effectiveTone` honours `color`; a glass field reading only `tone`
      // would support half of the field's own colour API.
      const { container } = render(<Input variant="glass" color="violet" />);
      expect(field(container)).toContain("bg-violet-100/45");
    });

    it("leaves a field nobody tinted exactly as it was", () => {
      const { container } = render(<Input variant="glass" />);
      const cls = field(container);
      expect(cls).toContain("bg-white/45");
      expect(cls).not.toContain("bg-blue-100/45");
    });

    it("keeps the tint when a status strips the border from the same string", () => {
      // `stripBorderColor` edits this very class string. Two strippers over one
      // string, and the failure mode is a field that quietly stops being
      // tinted — the bug this branch exists to fix, so it gets its own guard.
      const { container } = render(
        <Input variant="glass" tone="blue" validationStatus="error" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-blue-100/45");
      expect(cls).toContain("border-rose-500");
    });

    it("is the token's doing, not the component's", () => {
      // The contract all nine fields inherit, asserted at its source so no
      // component can be fixed by a local patch that leaves the others broken.
      expect(
        getInputVariantTokens("glass", "blue", "auto", {
          explicitTone: "blue",
        }).surface,
      ).toContain("bg-blue-100/45");
      expect(getInputVariantTokens("glass", "blue", "auto").surface).toContain(
        "bg-white/45",
      );
    });

    it("tints in every tone the palette offers", () => {
      // A dynamic class is only real if the built stylesheet carries it. This
      // is the source half of that check; the browser probe is the other.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <Input variant="glass" tone={tone} />,
        );
        const cls = field(container);
        expect(cls).toContain(`bg-${tone}-100/45`);
        expect(cls).toContain(`dark:bg-${tone}-500/10`);
        unmount();
      }
    });

    it("strips fills and nothing else", () => {
      // Too wide and it eats the gradient variant's direction; too narrow and
      // the white fill survives under the tint, which makes the tint invisible.
      expect(
        stripFillClass(
          "bg-gradient-to-r bg-white/80 dark:bg-neutral-900/70 bg-cover border-white/40 backdrop-blur-xl rounded-xl",
        ),
      ).toBe(
        "bg-gradient-to-r bg-cover border-white/40 backdrop-blur-xl rounded-xl",
      );
    });
  });

  /**
   * The fill may wear a hue the states do not. `tone` drives six decisions —
   * focus border, focus ring, icons, the inline button's ring, the gradient's
   * glow and the fill — and `backgroundColor` takes the last one off the table,
   * per variant. So the assertions come in pairs on purpose: a rose fill *and*
   * a blue focus in the same class string is the entire feature, and either
   * half alone is a field that does nothing new.
   */
  describe("a field given a background hue", () => {
    it("paints a flat field in the hue and still focuses in the tone", () => {
      const { container } = render(
        <Input variant="flat" tone="blue" backgroundColor="rose" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-rose-50");
      expect(cls).toContain("dark:bg-rose-500/10");
      // The border is the box's edge, not its paint: it stays the variant's.
      expect(cls).toContain("border-neutral-300");
      expect(cls).toContain("focus-within:border-blue-400");
      expect(cls).toContain("focus-within:ring-blue-400/60");
    });

    it("keeps glass sheer, blurred and rimmed while the body turns rose", () => {
      const { container } = render(
        <Input variant="glass" tone="blue" backgroundColor="rose" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-rose-100/45");
      // The tone must not win this one: `glass` tints from `explicitTone`, and
      // the override is applied after that branch for exactly this reason.
      expect(cls).not.toContain("bg-blue-100/45");
      expect(cls).toContain("border-black/15");
      expect(cls).toContain("backdrop-blur-md");
      expect(cls).toContain("shadow-sm");
    });

    it("keeps the gradient's glow in the tone and its body in the hue", () => {
      const { container } = render(
        <Input variant="gradient" tone="blue" backgroundColor="rose" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-rose-50/80");
      expect(cls).toContain("dark:bg-rose-500/15");
      expect(cls).not.toContain("bg-white/80");
      // Sheer on purpose — an opaque body would bury both of these.
      expect(cls).toContain("backdrop-blur-xl");
    });

    it("moves ghost's washes to the hue and keeps its rim and focus in the tone", () => {
      const { container } = render(
        <Input variant="ghost" tone="blue" backgroundColor="rose" />,
      );
      const cls = field(container);
      // The paint.
      expect(cls).toContain("bg-rose-100");
      expect(cls).toContain("hover:bg-rose-200");
      expect(cls).not.toContain("bg-blue-100");
      // The affordances the pointer and the keyboard ask for. The hover rim was
      // painted with the fill until a caller noticed a rose field answering the
      // mouse in rose — it belongs with the focus border, not the background.
      expect(cls).toContain("hover:border-blue-300");
      expect(cls).not.toContain("border-rose-");
      expect(cls).toContain("focus-within:ring-blue-400/60");
    });

    it("does nothing to underline, which has no box to paint", () => {
      const { container } = render(
        <Input variant="underline" tone="blue" backgroundColor="rose" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-transparent");
      expect(cls).not.toContain("bg-rose-");
    });

    it("takes the variant's own fill back on neutral, over a tinted tone", () => {
      const { container } = render(
        <Input variant="glass" tone="blue" backgroundColor="neutral" />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-white/45");
      expect(cls).not.toContain("bg-blue-100/45");
    });

    it("survives the border stripper a validation status runs over the string", () => {
      // `stripBorderColor` edits this same class string on error, and the pair of
      // strippers over one string is where fills have gone missing before.
      const { container } = render(
        <Input
          variant="flat"
          tone="blue"
          backgroundColor="rose"
          validationStatus="error"
        />,
      );
      const cls = field(container);
      expect(cls).toContain("bg-rose-50");
      expect(cls).toContain("border-rose-500");
    });

    it("paints every hue the palette offers", () => {
      // The source half of the safelist contract: a class the theme builds by
      // template literal is only real if the stylesheet carries it.
      for (const hue of TRUE_COLORS) {
        if (hue === "neutral") continue; // the variant's own fill, tested above
        const { container, unmount } = render(
          <Input variant="flat" backgroundColor={hue} />,
        );
        expect(field(container)).toContain(`bg-${hue}-50`);
        unmount();
      }
    });

    it("leaves a field nobody tinted exactly as it was", () => {
      const { container } = render(<Input variant="flat" tone="blue" />);
      const cls = field(container);
      expect(cls).toContain("bg-white");
      expect(cls).not.toContain("bg-rose-50");
    });
  });

  describe("tones", () => {
    it("emits the tone it was given, for every tone", () => {
      // The hand-written 21-entry map had two wrong: `red` emitted `rose-*` and
      // `green` emitted `emerald-*`, so those tones rendered as another colour.
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(<Input tone={tone} />);
        expect(field(container)).toContain(`focus-within:border-${tone}-400`);
        expect(field(container)).toContain(`focus-within:ring-${tone}-400/60`);
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

    it("names the unnamed action button through the catalog", () => {
      render(<Input trailingIcon="X" onTrailingIconClick={() => undefined} />);
      expect(
        screen.getByRole("button", { name: "Input action" }),
      ).toBeInTheDocument();
    });

    it("translates the default action-button name", async () => {
      const { I18nProvider } = await import("../i18n/I18nContext");
      render(
        <I18nProvider locales={{}} locale="de" detect={false} storageKey={null}>
          <Input trailingIcon="X" onTrailingIconClick={() => undefined} />
        </I18nProvider>,
      );
      expect(
        screen.getByRole("button", { name: "Feldaktion" }),
      ).toBeInTheDocument();
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

import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import Select from "./Select.vue";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
  getControlSizeTokens,
  getInputVariantTokens,
} from "../theme/Theme";

const OPTIONS = () => [
  h("option", { value: "a" }, "A"),
  h("option", { value: "b" }, "B"),
];

const mountSelect = (props: Record<string, unknown> = {}) =>
  mount(Select, { props, slots: { default: OPTIONS } });

const field = (wrapper: ReturnType<typeof mountSelect>) =>
  wrapper.find("span.group").classes().join(" ");

const copy = (wrapper: ReturnType<typeof mountSelect>) =>
  wrapper.find("select").classes().join(" ");

describe("Select", () => {
  describe("variant tokens", () => {
    it.each(INPUT_VARIANTS)("applies the %s surface and copy", (variant) => {
      const wrapper = mountSelect({ variant });
      const tokens = getInputVariantTokens(variant);
      for (const expected of tokens.surface.split(/\s+/)) {
        expect(field(wrapper)).toContain(expected);
      }
      for (const expected of tokens.text.split(/\s+/)) {
        expect(copy(wrapper)).toContain(expected);
      }
    });

    it("was hardcoded to one surface before", () => {
      // `rounded-lg border border-neutral-300 bg-white shadow-sm` was baked in,
      // so a Select was the one control in a form that could not be made to
      // match the Input and SearchBar beside it.
      const classes = field(mountSelect({ variant: "glass" }));
      expect(classes).toContain("backdrop-blur-md");
      expect(classes).not.toContain("border-neutral-300");
    });

    it("drops the horizontal padding for underline and paints no ring", () => {
      const classes = field(mountSelect({ variant: "underline" }));
      expect(classes).toContain("pt-2");
      expect(classes).not.toContain("px-3");
      expect(classes).not.toContain("ring-2");
    });
  });

  describe("tones", () => {
    it("emits the tone it was given, for every tone", () => {
      // The hand-written map pointed `gray`, `zinc` and `stone` at
      // `neutral-500` classes, so three of the five neutral tones silently
      // rendered as a fourth.
      for (const tone of TRUE_COLORS) {
        expect(field(mountSelect({ tone }))).toContain(
          `focus-within:border-${tone}-400`,
        );
      }
    });

    it("keeps the neutrals distinct", () => {
      for (const tone of ["gray", "zinc", "stone"] as const) {
        const classes = field(mountSelect({ tone }));
        expect(classes).toContain(`focus-within:border-${tone}-400`);
        expect(classes).not.toContain("border-neutral-500");
      }
    });

    it("insets the focus ring so a scrolling ancestor cannot clip it", () => {
      expect(field(mountSelect())).toContain("focus-within:ring-inset");
    });

    it("accepts `color` as an alias for `tone`", () => {
      expect(field(mountSelect({ color: "violet" }))).toContain(
        "focus-within:border-violet-400",
      );
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      for (const size of CONTROL_SIZES) {
        expect(field(mountSelect({ size }))).not.toBe("");
      }
    });

    it("gives the box one horizontal padding, not two", () => {
      // The size token carried `pr-9`/`pr-10`/`pr-11` and the caret branch
      // added another `pr-10` on top; a leading icon added `pl-9` next to the
      // token's own `px-*`. Both were same-specificity fights.
      const tokens = mountSelect({ size: "sm", leadingIcon: "Search" })
        .find("span.group")
        .classes()
        .filter((token) => /^(p[xlr])-/.test(token));
      expect(tokens).toEqual(["px-2.5"]);
    });
  });

  describe("caret and icons", () => {
    it("hides the platform caret so ours is the only one", () => {
      expect(copy(mountSelect())).toContain("appearance-none");
    });

    it("takes its resting colour from the variant and its accent from the tone", () => {
      const caret = mountSelect({ variant: "underline", tone: "violet" })
        .find("span.ml-2")
        .classes()
        .join(" ");
      expect(caret).toContain("text-neutral-600");
      expect(caret).toContain("group-focus-within:text-violet-500");
    });

    it("drops the caret for multiple and on request", () => {
      expect(mountSelect({ multiple: true }).find("span.ml-2").exists()).toBe(
        false,
      );
      expect(mountSelect({ hideCaret: true }).find("span.ml-2").exists()).toBe(
        false,
      );
    });

    it("opts into a stylable picker where the browser has one", () => {
      // The platform popup respects `color` and `background-color` on an
      // `<option>` and nothing else. `appearance: base-select` (Chrome 135+)
      // swaps it for a real element the kit can style; the class matches
      // nothing elsewhere, so those browsers keep the native popup.
      expect(copy(mountSelect())).toContain("ui-select");
    });

    it("drives the picker's accent from the tone", () => {
      // Tailwind exposes every palette entry as a CSS variable, so the tone
      // travels as a variable reference — nothing to safelist, and the
      // stylesheet stays colour-agnostic.
      const style = mountSelect({ tone: "violet" })
        .find("select")
        .attributes("style")!;
      expect(style).toContain("--ui-select-accent: var(--color-violet-500)");
      expect(style).toContain(
        "--ui-select-accent-strong: var(--color-violet-700)",
      );
    });

    it("gives the options their own fill for the native popup", () => {
      // The dropdown is painted by the platform from the select's own
      // background; with the surface on the wrapper the select is transparent,
      // which would leave the open list white in dark mode.
      const classes = copy(mountSelect());
      expect(classes).toContain("[&>option]:bg-white");
      expect(classes).toContain("dark:[&>option]:bg-neutral-900");
    });
  });

  describe("validation", () => {
    it("does not overwrite the variant's copy colour", () => {
      const classes = copy(
        mountSelect({ variant: "underline", validationStatus: "error" }),
      );
      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).toContain("dark:text-neutral-50");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("puts the status border on the box", () => {
      expect(field(mountSelect({ validationStatus: "error" }))).toContain(
        "border-rose-500",
      );
    });

    it("sets aria-invalid", () => {
      expect(
        mountSelect({ validationStatus: "error" })
          .find("select")
          .attributes("aria-invalid"),
      ).toBe("true");
    });
  });

  describe("disabled", () => {
    it("dims rather than repainting the fill", () => {
      const classes = field(mountSelect({ variant: "glass", disabled: true }));
      expect(classes).toContain("opacity-60");
      expect(classes).not.toContain("disabled:bg-neutral-100");
      expect(classes).toContain("bg-white/45");
    });
  });

  describe("behaviour", () => {
    it("renders a placeholder option that cannot be chosen", () => {
      const option = mountSelect({ placeholder: "Pick one" }).find("option")
        .element as HTMLOptionElement;
      expect(option.disabled).toBe(true);
      expect(option.hidden).toBe(true);
    });

    it("actually shows the placeholder when nothing is selected", () => {
      // A `hidden disabled` first option is not what the browser lands on: it
      // picks the first *selectable* option, so the placeholder never appeared
      // unless the caller also bound an empty value.
      const select = mountSelect({ placeholder: "Pick one" }).find("select")
        .element as HTMLSelectElement;
      expect(select.value).toBe("");
    });

    it("does not fight a caller that owns the value", () => {
      const select = mountSelect({
        placeholder: "Pick one",
        modelValue: "b",
      }).find("select").element as HTMLSelectElement;
      expect(select.value).toBe("b");
    });

    it("emits the new value", async () => {
      const wrapper = mountSelect();
      await wrapper.find("select").setValue("b");
      expect(wrapper.emitted("update:modelValue")).toEqual([["b"]]);
      expect(wrapper.emitted("change")).toHaveLength(1);
    });

    it("drops the surface when unstyled, for InputGroup", () => {
      const classes = field(mountSelect({ unstyled: true }));
      expect(classes).not.toContain("border-neutral-300");
      expect(classes).not.toContain("shadow-sm");
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
      expect(copy(mountSelect({ size }))).toContain("leading-6");
    });

    it("leaves underline alone — its value sits clear of the rule, not centred in a box", () => {
      expect(copy(mountSelect({ variant: "underline" }))).not.toContain(
        "leading-6",
      );
    });

    it("leaves multiple alone — a list, not a single value", () => {
      expect(copy(mountSelect({ multiple: true }))).not.toContain("leading-6");
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
        expect(copy(mountSelect({ size }))).toContain(leadingFor[textClass]);
      },
    );
  });

  describe("caret clicks", () => {
    // The caret and the wrapper padding are outside the <select>; before the
    // fix a click on them landed on the wrapper span and nothing happened, so
    // only the middle strip of the box opened the dropdown.
    const stubShowPicker = (wrapper: ReturnType<typeof mountSelect>) => {
      const showPicker = vi.fn();
      (
        wrapper.find("select").element as HTMLSelectElement & {
          showPicker?: () => void;
        }
      ).showPicker = showPicker;
      return showPicker;
    };

    it("opens the picker when the caret is clicked", async () => {
      const wrapper = mountSelect();
      const showPicker = stubShowPicker(wrapper);
      await wrapper.find("span.ml-2").trigger("click");
      expect(showPicker).toHaveBeenCalledOnce();
    });

    it("opens the picker when the wrapper padding is clicked", async () => {
      const wrapper = mountSelect();
      const showPicker = stubShowPicker(wrapper);
      await wrapper.find("span.group").trigger("click");
      expect(showPicker).toHaveBeenCalledOnce();
    });

    it("leaves a click on the select itself to the platform", async () => {
      const wrapper = mountSelect();
      const showPicker = stubShowPicker(wrapper);
      await wrapper.find("select").trigger("click");
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("does not open the picker when disabled", async () => {
      const wrapper = mountSelect({ disabled: true });
      const showPicker = stubShowPicker(wrapper);
      await wrapper.find("span.group").trigger("click");
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("does not open the picker for multiple", async () => {
      const wrapper = mountSelect({ multiple: true });
      const showPicker = stubShowPicker(wrapper);
      await wrapper.find("span.group").trigger("click");
      expect(showPicker).not.toHaveBeenCalled();
    });

    it("focuses the select where showPicker is unavailable", async () => {
      // Firefox has no showPicker; the fallback is still better than the
      // click being lost. jsdom never has it, so this is the default path.
      // `focus()` is a no-op outside the document, so attach.
      const host = document.createElement("div");
      document.body.appendChild(host);
      const wrapper = mount(Select, {
        props: {},
        slots: { default: OPTIONS },
        attachTo: host,
      });
      await wrapper.find("span.group").trigger("click");
      expect(wrapper.find("select").element).toBe(document.activeElement);
      wrapper.unmount();
      host.remove();
    });
  });
});

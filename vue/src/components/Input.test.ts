import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";
import {
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
  getInputVariantTokens,
} from "../theme/Theme";

const mountInput = (props: Record<string, unknown> = {}) =>
  mount(Input, { props });

const field = (wrapper: ReturnType<typeof mountInput>) =>
  wrapper.find("span.group").classes().join(" ");

const copy = (wrapper: ReturnType<typeof mountInput>) =>
  wrapper.find("input").classes().join(" ");

describe("Input", () => {
  describe("variant tokens", () => {
    it.each(INPUT_VARIANTS)("applies the %s surface and copy", (variant) => {
      const wrapper = mountInput({ variant });
      const tokens = getInputVariantTokens(variant);
      for (const expected of tokens.surface.split(/\s+/)) {
        expect(field(wrapper)).toContain(expected);
      }
      for (const expected of tokens.text.split(/\s+/)) {
        expect(copy(wrapper)).toContain(expected);
      }
    });

    it("gives underline the high-contrast copy, not the solid set", () => {
      const classes = copy(mountInput({ variant: "underline" }));
      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("drops the horizontal padding for underline", () => {
      const classes = field(mountInput({ variant: "underline" }));
      expect(classes).toContain("pt-2");
      expect(classes).not.toContain("px-3");
    });

    it("paints no ring around a borderless underline", () => {
      expect(field(mountInput({ variant: "underline" }))).not.toContain(
        "ring-2",
      );
    });

    it("puts a glow behind the gradient variant only", () => {
      // Vue's Input had the `gradient` surface but never painted a glow at all,
      // so the variant looked identical to `flat` with a rounder border.
      expect(
        mountInput({ variant: "gradient" }).find('[aria-hidden="true"]').exists(),
      ).toBe(true);
      expect(
        mountInput({ variant: "flat" }).find('[aria-hidden="true"]').exists(),
      ).toBe(false);
    });
  });

  describe("tones", () => {
    it("emits the tone it was given, for every tone", () => {
      // The hand-written 21-entry map had two wrong: `red` emitted `rose-*` and
      // `green` emitted `emerald-*`, so those tones rendered as another colour.
      for (const tone of TRUE_COLORS) {
        const classes = field(mountInput({ tone }));
        expect(classes).toContain(`focus-within:border-${tone}-400`);
        expect(classes).toContain(`focus-within:ring-${tone}-400/60`);
      }
    });

    it("keeps red red and green green", () => {
      expect(field(mountInput({ tone: "red" }))).not.toContain("rose-400");
      expect(field(mountInput({ tone: "green" }))).not.toContain(
        "emerald-400",
      );
    });

    it("insets the focus ring so a scrolling ancestor cannot clip it", () => {
      expect(field(mountInput({ tone: "blue" }))).toContain(
        "focus-within:ring-inset",
      );
    });

    it("accepts `color` as an alias for `tone`", () => {
      expect(field(mountInput({ color: "violet" }))).toContain(
        "focus-within:border-violet-400",
      );
    });
  });

  describe("size", () => {
    it("offers the whole shared control scale", () => {
      for (const size of CONTROL_SIZES) {
        expect(field(mountInput({ size }))).not.toBe("");
      }
    });

    it("scales padding and type together", () => {
      const wrapper = mountInput({ size: "xs" });
      expect(field(wrapper)).toContain("px-2");
      expect(copy(wrapper)).toContain("text-xs");
    });
  });

  describe("validation", () => {
    it("does not overwrite the variant's copy colour", () => {
      const classes = copy(
        mountInput({ variant: "underline", validationStatus: "error" }),
      );
      expect(classes).toContain("placeholder:text-neutral-600");
      expect(classes).not.toContain("placeholder:text-neutral-400");
    });

    it("puts the status border on the box", () => {
      expect(field(mountInput({ validationStatus: "error" }))).toContain(
        "border-rose-500",
      );
    });

    it("sets aria-invalid", () => {
      expect(
        mountInput({ validationStatus: "error" })
          .find("input")
          .attributes("aria-invalid"),
      ).toBe("true");
    });
  });

  describe("disabled", () => {
    it("dims rather than repainting the fill", () => {
      const classes = field(mountInput({ variant: "glass", disabled: true }));
      expect(classes).toContain("opacity-60");
      expect(classes).not.toContain("disabled:bg-neutral-100");
      expect(classes).toContain("bg-white/45");
    });
  });

  describe("icons", () => {
    it("takes its resting colour from the variant and its accent from the tone", () => {
      const icon = mountInput({
        variant: "underline",
        tone: "violet",
        leadingIcon: "Search",
      })
        .find("span.mr-2")
        .classes()
        .join(" ");
      expect(icon).toContain("text-neutral-600");
      expect(icon).toContain("group-focus-within:text-violet-500");
    });

    it("renders the trailing icon as a button with a name when clickable", async () => {
      const onTrailingIconClick = vi.fn();
      const wrapper = mountInput({
        trailingIcon: "Close",
        onTrailingIconClick,
        trailingIconLabel: "Clear field",
      });
      const button = wrapper.find("button");
      expect(button.attributes("aria-label")).toBe("Clear field");
      await button.trigger("click");
      expect(onTrailingIconClick).toHaveBeenCalledOnce();
    });

    it("keeps a static trailing icon out of the pointer path", () => {
      const wrapper = mountInput({ trailingIcon: "Info" });
      expect(wrapper.find("button").exists()).toBe(false);
      expect(wrapper.find("span.ml-2").classes()).toContain(
        "pointer-events-none",
      );
    });

    it("needs no padding hack to make room for them", () => {
      // The icons were absolutely positioned and the input carried `pl-10` /
      // `pr-10` to clear them; they are flex siblings now.
      const wrapper = mountInput({
        leadingIcon: "Search",
        trailingIcon: "Info",
      });
      expect(copy(wrapper)).not.toContain("pl-");
      expect(copy(wrapper)).not.toContain("pr-");
      expect(wrapper.find("span.mr-2").exists()).toBe(true);
    });
  });

  describe("unstyled", () => {
    it("drops the surface for InputGroup", () => {
      const classes = field(mountInput({ unstyled: true, variant: "elevated" }));
      expect(classes).not.toContain("border-neutral-300");
      expect(classes).not.toContain("shadow-sm");
    });
  });

  describe("behaviour", () => {
    it("emits the new value", async () => {
      const wrapper = mountInput();
      await wrapper.find("input").setValue("x");
      expect(wrapper.emitted("update:modelValue")).toEqual([["x"]]);
    });
  });
});

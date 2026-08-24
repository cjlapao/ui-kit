import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Checkbox from "./Checkbox.vue";
import { CONTROL_SIZES, INPUT_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const mountBox = (props: Record<string, unknown> = {}) =>
  mount(Checkbox, { props: { label: "t", ...props }, attachTo: document.body });

const boxClass = (wrapper: ReturnType<typeof mountBox>) =>
  wrapper.find("input").element.nextElementSibling!.className;

describe("Checkbox", () => {
  describe("the control is drawn, not native", () => {
    it("hides the native rendering so the box styling applies", () => {
      // The old control kept `appearance: auto` and layered `rounded border
      // bg-white dark:bg-neutral-900 checked:border-transparent …` on it. A
      // native checkbox ignores all of that, so only `accent-color` did
      // anything and dark mode rendered the browser's light widget.
      const wrapper = mountBox();
      const input = wrapper.find("input");
      expect(input.classes()).toContain("appearance-none");
      expect(input.classes()).toContain("opacity-0");
      expect(boxClass(wrapper)).toContain("border-2");
    });

    it("puts the box and both glyphs as siblings of the input", () => {
      // `peer-*` compiles to a general-sibling selector, so a glyph nested
      // inside the box would never match.
      const wrapper = mountBox();
      const input = wrapper.find("input").element;
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
        const classes = boxClass(mountBox({ color }));
        expect(classes).toContain(`peer-checked:bg-${color}-700`);
        expect(classes).toContain(`dark:peer-checked:bg-${color}-400`);
      }
    });

    it("matches the glyph colour to the fill in each theme", () => {
      const glyph = mountBox({ color: "yellow" }).findAll("svg")[0].element
        .parentElement!;
      expect(glyph.className).toContain("text-white");
      expect(glyph.className).toContain("dark:text-yellow-950");
    });
  });

  describe("size", () => {
    it("renders a real class at every step", () => {
      // `text-md` and `mt-0.2` are not Tailwind classes; the `md` row had no
      // type size and the `lg` row no offset.
      for (const size of CONTROL_SIZES) {
        const html = mountBox({ size, description: "d" }).html();
        expect(html).not.toContain("text-md");
        expect(html).not.toContain("mt-0.2");
      }
    });

    it("scales the box and the type together", () => {
      expect(mountBox({ size: "xs" }).html()).toContain("h-3.5 w-3.5");
      expect(mountBox({ size: "xs" }).html()).toContain("text-xs");
      expect(mountBox({ size: "xl" }).html()).toContain("h-7 w-7");
      expect(mountBox({ size: "xl" }).html()).toContain("text-xl");
    });
  });

  describe("variant", () => {
    it("offers the same surfaces as Input and SearchBar", () => {
      // A checkbox that is always an opaque white square does not match a
      // `glass` SearchBar sitting next to it in the same form.
      for (const variant of INPUT_VARIANTS) {
        expect(boxClass(mountBox({ variant }))).not.toBe("");
      }
    });

    it("makes the see-through variants see-through", () => {
      expect(boxClass(mountBox({ variant: "flat" }))).toContain("bg-white");
      const glass = boxClass(mountBox({ variant: "glass" }));
      expect(glass).toContain("backdrop-blur");
      expect(glass).toContain("bg-white/45");
    });

    it("carries no radius, so the size token keeps control of it", () => {
      // `rounded-lg` from the variant would be a same-specificity fight with
      // the per-size radius on the wrapper.
      for (const variant of INPUT_VARIANTS) {
        expect(boxClass(mountBox({ variant, size: "xs" }))).not.toMatch(
          /\brounded-(?!\[inherit\])/,
        );
      }
    });

    it("lets the error border replace the variant's, not stack on it", () => {
      const classes = boxClass(
        mountBox({ variant: "glass", validationStatus: "error" }),
      );
      expect(classes).toContain("border-rose-400");
      expect(classes).not.toContain("border-white/50");
    });
  });

  describe("indeterminate", () => {
    it("sets the DOM property", () => {
      expect(mountBox({ indeterminate: true }).find("input").element.indeterminate).toBe(
        true,
      );
    });

    it("announces itself as mixed", () => {
      expect(
        mountBox({ indeterminate: true }).find("input").attributes("aria-checked"),
      ).toBe("mixed");
    });

    it("clears when the prop goes away", async () => {
      const wrapper = mountBox({ indeterminate: true });
      await wrapper.setProps({ indeterminate: false });
      expect(wrapper.find("input").element.indeterminate).toBe(false);
    });
  });

  describe("disabled", () => {
    it("keeps the checked fill so the tick stays visible", () => {
      // `peer-disabled:bg-neutral-100` beat `peer-checked:bg-{tone}-700` on
      // emission order, so a disabled checked box lost its fill and its white
      // tick disappeared into the grey.
      const classes = boxClass(mountBox({ disabled: true, modelValue: true }));
      expect(classes).toContain("peer-checked:bg-blue-700");
      expect(classes).not.toContain("peer-disabled:bg-");
    });
  });

  describe("validation", () => {
    it("marks an error on the input and the box", () => {
      const wrapper = mountBox({
        validationStatus: "error",
        validationMessage: "Nope",
      });
      expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
      expect(boxClass(wrapper)).toContain("border-rose-400");
      expect(wrapper.text()).toContain("Nope");
    });

    it("points `aria-describedby` at both the description and the message", () => {
      const wrapper = mountBox({
        description: "Help",
        validationMessage: "Nope",
      });
      const ids = wrapper
        .find("input")
        .attributes("aria-describedby")!
        .split(" ");
      expect(ids).toHaveLength(2);
      for (const id of ids) {
        expect(wrapper.find(`[id="${id}"]`).exists()).toBe(true);
      }
    });

    it("marks a required label", () => {
      const wrapper = mountBox({ label: "Terms", required: true });
      expect(wrapper.find("input").element.required).toBe(true);
      expect(wrapper.text()).toContain("*");
    });
  });

  describe("behaviour", () => {
    it("emits through the hidden input", async () => {
      const wrapper = mountBox();
      const input = wrapper.find("input");
      await input.setValue(true);
      expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
      expect(wrapper.emitted("change")).toHaveLength(1);
    });

    it("associates the label with the input", () => {
      const wrapper = mountBox({ label: "Accept terms" });
      const id = wrapper.find("input").attributes("id");
      expect(wrapper.find("label").element.contains(wrapper.find("input").element)).toBe(
        true,
      );
      expect(id).toBeTruthy();
    });
  });
});

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MultiSelectPills from "./MultiSelectPills.vue";
import type { MultiSelectPillOption } from "./MultiSelectPills.vue";

const OPTIONS: MultiSelectPillOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma", disabled: true },
];

const mountPills = (props: Record<string, unknown> = {}) =>
  mount(MultiSelectPills, { props: { name: "t", options: OPTIONS, ...props } });

const pills = (wrapper: ReturnType<typeof mountPills>) =>
  wrapper.findAll("button");

describe("MultiSelectPills", () => {
  describe("tones", () => {
    it("paints red as red and green as green", () => {
      // The old hand-written 21-colour map mapped `red` to rose classes and
      // `green` to emerald ones, so two tones silently rendered as a different
      // colour. Composing with Pill removes the second source of truth.
      const red = mountPills({ color: "red", modelValue: ["a"] });
      expect(red.html()).toContain("red-500");
      expect(red.html()).not.toContain("rose-500");

      const green = mountPills({ color: "green", modelValue: ["a"] });
      expect(green.html()).toContain("green-500");
      expect(green.html()).not.toContain("emerald-500");
    });
  });

  describe("selection", () => {
    it("toggles several values when uncontrolled", async () => {
      const wrapper = mountPills();
      await pills(wrapper)[0].trigger("click");
      await pills(wrapper)[1].trigger("click");
      await pills(wrapper)[0].trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([
        [["a"]],
        [["a", "b"]],
        [["b"]],
      ]);
      expect(wrapper.emitted("change")).toHaveLength(3);
    });

    it("stays controlled when `modelValue` is supplied", async () => {
      const wrapper = mountPills({ modelValue: [] });
      await pills(wrapper)[0].trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([[["a"]]]);
      // The parent owns the state, so nothing moves until it says so.
      expect(pills(wrapper)[0].attributes("aria-pressed")).toBe("false");
    });

    it("keeps only one value in single mode", async () => {
      const wrapper = mountPills({ selectionMode: "single" });
      await pills(wrapper)[0].trigger("click");
      await pills(wrapper)[1].trigger("click");

      const emitted = wrapper.emitted("update:modelValue")!;
      expect(emitted[emitted.length - 1]).toEqual([["b"]]);
    });

    it("can refuse to deselect the single choice", async () => {
      const wrapper = mountPills({
        selectionMode: "single",
        allowDeselect: false,
        defaultValue: ["a"],
      });
      await pills(wrapper)[0].trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([[["a"]]]);
    });

    it("ignores a disabled option", async () => {
      const wrapper = mountPills();
      await pills(wrapper)[2].trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });
  });

  describe("form value", () => {
    it("mirrors the selection into hidden inputs", () => {
      const wrapper = mountPills({ name: "tags", modelValue: ["a"] });
      const inputs = wrapper.findAll<HTMLInputElement>('input[name="tags[]"]');

      expect(inputs).toHaveLength(3);
      expect(inputs.filter((input) => input.element.checked)).toHaveLength(1);
      expect(inputs[0].element.value).toBe("a");
    });

    it("hides those inputs from assistive tech", () => {
      // The Pill carries `aria-pressed`; announcing a checkbox as well would
      // read every option twice.
      const wrapper = mountPills();
      for (const input of wrapper.findAll("input")) {
        expect(input.attributes("aria-hidden")).toBe("true");
        expect(input.attributes("tabindex")).toBe("-1");
      }
    });
  });

  describe("appearance", () => {
    it("uses different variants for selected and unselected", () => {
      const wrapper = mountPills({ modelValue: ["a"], color: "violet" });
      const [selected, unselected] = pills(wrapper);
      expect(selected.classes().join(" ")).toContain("bg-violet-500");
      expect(unselected.classes().join(" ")).not.toContain("bg-violet-500");
    });

    it("supports the glass variants", () => {
      const wrapper = mountPills({
        modelValue: ["a"],
        variant: "liquid-glass",
        unselectedVariant: "glass",
      });
      for (const pill of pills(wrapper)) {
        expect(pill.classes().join(" ")).toContain("backdrop-blur");
      }
    });

    it("marks the selection with more than colour when asked", () => {
      // `neutral` selected and unselected differ by a barely-visible fill, so
      // a group in that tone signalled its state by colour alone.
      const wrapper = mountPills({ modelValue: ["a"], checkmark: true });
      const [selected, unselected] = pills(wrapper);
      expect(selected.find("svg").exists()).toBe(true);
      expect(unselected.find("svg").exists()).toBe(false);
    });

    it("rounds the pills on request", () => {
      const wrapper = mountPills({ rounded: "md" });
      const classes = pills(wrapper)[0].classes();
      expect(classes).toContain("rounded-md");
      expect(classes).not.toContain("rounded-full");
    });
  });
});

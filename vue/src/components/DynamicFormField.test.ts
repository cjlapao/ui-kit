import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import DynamicFormField, { normalizeOptions } from "./DynamicFormField.vue";
import { CapsuleBlueprintValueType } from "../../../common/types/CapsuleBlueprint";
import type { CapsuleBlueprintParameter } from "../../../common/types/CapsuleBlueprint";
import { CONTROL_SIZES, SURFACE_VARIANTS } from "../theme/Theme";

const param = (
  over: Partial<CapsuleBlueprintParameter> = {},
): CapsuleBlueprintParameter => ({
  name: "Region",
  key: "region",
  value_type: CapsuleBlueprintValueType.String,
  ...over,
});

const mountField = (
  over: Partial<CapsuleBlueprintParameter> = {},
  props: Record<string, unknown> = {},
) => mount(DynamicFormField, { props: { parameter: param(over), ...props } });

const lastChange = (w: ReturnType<typeof mountField>) => {
  const events = w.emitted("change") ?? [];
  return events[events.length - 1];
};

describe("DynamicFormField", () => {
  describe("value types", () => {
    it("renders a control for every type the blueprint can hold", () => {
      // `List` and `Map` used to render nothing inside an empty bordered card.
      for (const value_type of Object.values(CapsuleBlueprintValueType)) {
        const w = mountField({ value_type, options: ["a", "b"] });
        expect(
          w.find("input").exists() ||
            w.find("select").exists() ||
            w.find("textarea").exists() ||
            w.find("button").exists(),
        ).toBe(true);
      }
    });

    it("renders nothing at all for a type it cannot draw", () => {
      // Vue leaves a `v-if` placeholder comment; nothing is rendered.
      expect(mountField({ value_type: "quantum" as never }).find("*").exists()).toBe(
        false,
      );
    });

    it("renders nothing when hidden", () => {
      expect(mountField({}, { isVisible: false }).find("*").exists()).toBe(false);
    });

    it("masks a secret", () => {
      expect(
        mountField({ is_secret: true }).find('input[type="password"]').exists(),
      ).toBe(true);
    });

    it("sends a number for an int, not a string", async () => {
      const w = mountField({ value_type: CapsuleBlueprintValueType.Int });
      await w.get("input").setValue("42");
      expect(lastChange(w)).toEqual(["global", "region", 42, true]);
    });

    it("splits a list into entries and joins them back", async () => {
      const w = mountField(
        { value_type: CapsuleBlueprintValueType.List },
        { value: ["one", "two"] },
      );
      const area = w.get("textarea");
      expect((area.element as HTMLTextAreaElement).value).toBe("one\ntwo");
      await area.setValue("a\nb\n");
      expect(lastChange(w)).toEqual(["global", "region", ["a", "b"], true]);
    });
  });

  describe("the label, hint and error", () => {
    it("marks a parameter required under either spelling", () => {
      // The blueprint type carries both; only `is_required` was ever read.
      for (const key of ["is_required", "required"] as const) {
        const w = mountField({ [key]: true });
        expect(w.get("input").attributes("required")).toBeDefined();
      }
    });

    it("associates the label with the control", () => {
      const w = mountField();
      expect(w.get("label").attributes("for")).toBe(w.get("input").attributes("id"));
    });

    it("shows the error for a checkbox, not just for a text field", () => {
      // The boolean branch rendered no error at all.
      const w = mountField(
        { value_type: CapsuleBlueprintValueType.Boolean },
        { error: "Must be accepted" },
      );
      expect(w.text()).toContain("Must be accepted");
    });

    it("shows the error for every value type", () => {
      for (const value_type of [
        CapsuleBlueprintValueType.String,
        CapsuleBlueprintValueType.Int,
        CapsuleBlueprintValueType.Boolean,
        CapsuleBlueprintValueType.Select,
        CapsuleBlueprintValueType.List,
      ]) {
        const w = mountField({ value_type, options: ["a"] }, { error: "Nope" });
        expect(w.text()).toContain("Nope");
      }
    });
  });

  describe("select options", () => {
    it("reads all three shapes a blueprint uses", () => {
      expect(normalizeOptions(["a"])).toEqual([
        { id: "opt-0-a", label: "a", value: "a" },
      ]);
      expect(normalizeOptions({ eu: "Europe" })).toEqual([
        { id: "opt-0-eu", label: "Europe", value: "eu" },
      ]);
      expect(normalizeOptions([{ key: "eu", value: "Europe" }])).toEqual([
        { id: "opt-0-eu", label: "Europe", value: "eu" },
      ]);
    });

    it("also accepts the `label` spelling most callers write", () => {
      expect(normalizeOptions([{ key: "eu", label: "Europe" }])).toEqual([
        { id: "opt-0-eu", label: "Europe", value: "eu" },
      ]);
    });
  });

  describe("the shared scales", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        expect(mountField({}, { size }).find("input").exists()).toBe(true);
      }
    });

    it("takes every container surface, plus plain", () => {
      for (const variant of [...SURFACE_VARIANTS, "plain" as const]) {
        const w = mountField({}, { variant });
        // `plain` draws no card — previously impossible, every field forced one.
        expect(w.find("section").exists()).toBe(variant !== "plain");
      }
    });
  });

  describe("dependencies", () => {
    it("re-evaluates on blur for an int, not only for a string", async () => {
      for (const value_type of [
        CapsuleBlueprintValueType.String,
        CapsuleBlueprintValueType.Int,
      ]) {
        const w = mountField({ value_type, depends_on: ["other"] }, { value: "x" });
        await w.get("input").trigger("blur");
        expect(lastChange(w)).toEqual(["global", "region", "x", true]);
      }
    });

    it("stays quiet on blur when nothing depends on it", async () => {
      const w = mountField();
      await w.get("input").trigger("blur");
      expect(w.emitted("change")).toBeUndefined();
    });

    it("routes the change to the parameter's own service", async () => {
      const w = mountField({ service_name: "db" });
      await w.get("input").setValue("x");
      expect(lastChange(w)).toEqual(["db", "region", "x", true]);
    });
  });

  describe("disabled and read-only", () => {
    it("reports nothing while disabled", async () => {
      const w = mountField({}, { disabled: true });
      await w.get("input").setValue("x");
      expect(w.emitted("change")).toBeUndefined();
    });

    it("reports nothing while read-only", async () => {
      const w = mountField({}, { readOnly: true });
      await w.get("input").setValue("x");
      expect(w.emitted("change")).toBeUndefined();
    });
  });
});

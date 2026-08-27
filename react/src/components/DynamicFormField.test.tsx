import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";

import DynamicFormField, { normalizeOptions } from "./DynamicFormField";
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

const setup = (
  over: Partial<CapsuleBlueprintParameter> = {},
  props: Partial<React.ComponentProps<typeof DynamicFormField>> = {},
) => {
  const onChange = vi.fn();
  const utils = render(
    <DynamicFormField parameter={param(over)} onChange={onChange} {...props} />,
  );
  return { ...utils, onChange };
};

describe("DynamicFormField", () => {
  describe("value types", () => {
    it("renders a control for every type the blueprint can hold", () => {
      // `List` and `Map` used to fall through to `default:` and render an
      // empty bordered card — two of the six value types.
      for (const value_type of Object.values(CapsuleBlueprintValueType)) {
        const { container } = render(
          <DynamicFormField
            parameter={param({ value_type, options: ["a", "b"] })}
            onChange={() => {}}
          />,
        );
        // `Map` renders the kit's key/value editor, which starts on its
        // empty state with an Add button rather than a bare input.
        expect(
          container.querySelector("input, select, textarea, button"),
        ).toBeTruthy();
      }
    });

    it("renders nothing at all for a type it cannot draw", () => {
      // Rather than an empty card, which is what it did.
      const { container } = render(
        <DynamicFormField
          parameter={param({ value_type: "quantum" as never })}
          onChange={() => {}}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when hidden", () => {
      const { container } = setup({}, { isVisible: false });
      expect(container.firstChild).toBeNull();
    });

    it("masks a secret", () => {
      const { container } = setup({ is_secret: true });
      expect(container.querySelector('input[type="password"]')).toBeTruthy();
    });

    it("sends a number for an int, not a string", () => {
      const { container, onChange } = setup({
        value_type: CapsuleBlueprintValueType.Int,
      });
      const input = container.querySelector("input")!;
      fireEvent.change(input, { target: { value: "42" } });
      expect(onChange).toHaveBeenCalledWith("global", "region", 42, true);
    });

    it("splits a list into entries and joins them back", () => {
      const { container, onChange } = setup(
        { value_type: CapsuleBlueprintValueType.List },
        { value: ["one", "two"] },
      );
      const area = container.querySelector("textarea")!;
      expect(area.value).toBe("one\ntwo");
      fireEvent.change(area, { target: { value: "a\nb\n" } });
      expect(onChange).toHaveBeenCalledWith("global", "region", ["a", "b"], true);
    });
  });

  describe("the label, hint and error", () => {
    it("marks a parameter required under either spelling", () => {
      // The blueprint type carries both; only `is_required` was ever read.
      for (const key of ["is_required", "required"] as const) {
        const { container } = render(
          <DynamicFormField
            parameter={param({ [key]: true })}
            onChange={() => {}}
          />,
        );
        expect(container.querySelector("input")?.required).toBe(true);
      }
    });

    it("associates the label with the control", () => {
      // The label had no `htmlFor` and the control no `id`, so clicking the
      // label did nothing and assistive tech saw two unrelated elements.
      const { container } = setup();
      const label = container.querySelector("label")!;
      const input = container.querySelector("input")!;
      expect(label.getAttribute("for")).toBe(input.id);
      expect(input.id).toBeTruthy();
    });

    it("shows the error for a checkbox, not just for a text field", () => {
      // The boolean branch rendered no error at all, so a failed checkbox
      // validated silently.
      const { getByText } = setup(
        { value_type: CapsuleBlueprintValueType.Boolean },
        { error: "Must be accepted" },
      );
      expect(getByText("Must be accepted")).toBeTruthy();
    });

    it("shows the error for every value type", () => {
      for (const value_type of [
        CapsuleBlueprintValueType.String,
        CapsuleBlueprintValueType.Int,
        CapsuleBlueprintValueType.Boolean,
        CapsuleBlueprintValueType.Select,
        CapsuleBlueprintValueType.List,
      ]) {
        const { container } = render(
          <DynamicFormField
            parameter={param({ value_type, options: ["a"] })}
            onChange={() => {}}
            error="Nope"
          />,
        );
        expect(container.textContent).toContain("Nope");
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

    it("offers an empty choice when the parameter is optional", () => {
      // A `<select>` with no empty option lands on its first entry, so an
      // untouched optional parameter reported a value nobody chose.
      const { container } = setup({
        value_type: CapsuleBlueprintValueType.Select,
        options: ["a", "b"],
      });
      expect(container.querySelector("select")?.value).toBe("");
    });
  });

  describe("the shared scales", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { container } = render(
          <DynamicFormField
            parameter={param()}
            onChange={() => {}}
            size={size}
          />,
        );
        expect(container.querySelector("input")).toBeTruthy();
      }
    });

    it("takes every container surface, plus plain", () => {
      for (const variant of [...SURFACE_VARIANTS, "plain" as const]) {
        const { container } = render(
          <DynamicFormField
            parameter={param()}
            onChange={() => {}}
            variant={variant}
          />,
        );
        // `plain` draws no card, so no `<section>` — that was previously
        // impossible: every field forced a bordered card.
        expect(Boolean(container.querySelector("section"))).toBe(
          variant !== "plain",
        );
      }
    });
  });

  describe("dependencies", () => {
    it("re-evaluates on blur for an int, not only for a string", () => {
      // Was `String` only, so an `Int` that other fields depend on never
      // triggered them.
      for (const value_type of [
        CapsuleBlueprintValueType.String,
        CapsuleBlueprintValueType.Int,
      ]) {
        const onChange = vi.fn();
        const { container } = render(
          <DynamicFormField
            parameter={param({ value_type, depends_on: ["other"] })}
            value="x"
            onChange={onChange}
          />,
        );
        fireEvent.blur(container.querySelector("input")!);
        expect(onChange).toHaveBeenCalledWith("global", "region", "x", true);
      }
    });

    it("stays quiet on blur when nothing depends on it", () => {
      const { container, onChange } = setup();
      fireEvent.blur(container.querySelector("input")!);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("routes the change to the parameter's own service", () => {
      const { container, onChange } = setup({ service_name: "db" });
      fireEvent.change(container.querySelector("input")!, {
        target: { value: "x" },
      });
      expect(onChange).toHaveBeenCalledWith("db", "region", "x", true);
    });
  });

  describe("disabled and read-only", () => {
    it("reports nothing while disabled", () => {
      const { container, onChange } = setup({}, { disabled: true });
      fireEvent.change(container.querySelector("input")!, {
        target: { value: "x" },
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it("reports nothing while read-only", () => {
      const { container, onChange } = setup({}, { readOnly: true });
      fireEvent.change(container.querySelector("input")!, {
        target: { value: "x" },
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

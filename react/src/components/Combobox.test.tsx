import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";

import Combobox, { getComboboxToneClasses } from "./Combobox";
import { CONTROL_SIZES, TRUE_COLORS, VALIDATION_STATUSES } from "../theme/Theme";

const FRUIT = ["Apple", "Apricot", "Banana", "Cherry"];

const setup = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => {
  const onChange = vi.fn();
  const utils = render(
    <Combobox options={FRUIT} onChange={onChange} {...props} />,
  );
  return { ...utils, onChange, field: utils.getByRole("combobox") };
};

describe("Combobox", () => {
  describe("tones", () => {
    it("has a class set for every tone", () => {
      // The table this replaces had 21 hand-written entries; four components
      // in this kit shipped the same drift before anyone noticed.
      for (const tone of TRUE_COLORS) {
        const classes = getComboboxToneClasses(tone);
        expect(classes.active).toContain(`-${tone}-`);
        expect(classes.selected).toContain(`-${tone}-`);
      }
    });

    it("does not paint `red` as rose or `green` as emerald", () => {
      // The exact drift the old map carried.
      expect(getComboboxToneClasses("red").active).toContain("-red-");
      expect(getComboboxToneClasses("red").active).not.toContain("rose");
      expect(getComboboxToneClasses("green").active).toContain("-green-");
      expect(getComboboxToneClasses("green").active).not.toContain("emerald");
    });

    it("falls back to a key that exists", () => {
      // `InputGroup` fell back to a key that did not, and crashed for 15 tones.
      expect(getComboboxToneClasses(undefined).active).toBeTruthy();
      expect(
        getComboboxToneClasses("nonsense" as never).active,
      ).toBeTruthy();
    });
  });

  describe("the shared scales", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        const { container } = render(
          <Combobox options={FRUIT} onChange={() => {}} size={size} />,
        );
        expect(container.querySelector('[role="combobox"]')).toBeTruthy();
      }
    });

    it("takes the shared validation statuses", () => {
      expect([...VALIDATION_STATUSES]).toEqual(["none", "error", "success"]);
      for (const validationStatus of VALIDATION_STATUSES) {
        const { container } = render(
          <Combobox
            options={FRUIT}
            onChange={() => {}}
            validationStatus={validationStatus}
          />,
        );
        expect(container.querySelector('[role="combobox"]')).toBeTruthy();
      }
    });

    it("still honours the deprecated `error` flag", () => {
      const { container } = render(
        <Combobox options={FRUIT} onChange={() => {}} error />,
      );
      // Rose is the kit's error tone; the old version hardcoded `red-300`.
      expect(container.innerHTML).toContain("rose");
    });
  });

  describe("the listbox", () => {
    it("is announced as a combobox with a controlled listbox", () => {
      // The old version was a bare `<input>` and `<div onClick>` rows: no
      // role, no `aria-expanded`, and nothing a screen reader could follow.
      const { field, getByRole } = setup();
      expect(field.getAttribute("aria-expanded")).toBe("false");
      fireEvent.focus(field);
      expect(field.getAttribute("aria-expanded")).toBe("true");
      const list = getByRole("listbox");
      expect(field.getAttribute("aria-controls")).toBe(list.id);
      expect(within(list).getAllByRole("option")).toHaveLength(FRUIT.length);
    });

    it("filters on what has been typed", () => {
      const { field, getByRole } = setup();
      fireEvent.focus(field);
      fireEvent.change(field, { target: { value: "ap" } });
      const options = within(getByRole("listbox")).getAllByRole("option");
      expect(options.map((o) => o.textContent)).toEqual(["Apple", "Apricot"]);
    });

    it("says so when nothing matches, rather than showing an empty box", () => {
      const { field, getByRole } = setup();
      fireEvent.focus(field);
      fireEvent.change(field, { target: { value: "zzz" } });
      expect(within(getByRole("listbox")).queryAllByRole("option")).toHaveLength(
        0,
      );
      expect(getByRole("listbox").textContent).toContain("No matching options");
    });

    it("shows a spinner while options are loading", () => {
      const { field, getByRole } = setup({ loading: true });
      fireEvent.focus(field);
      expect(getByRole("listbox").textContent).toContain("Loading");
      expect(within(getByRole("listbox")).queryAllByRole("option")).toHaveLength(
        0,
      );
    });
  });

  describe("the keyboard", () => {
    it("opens and moves with the arrows", () => {
      // None of this existed: the old rows were `<div onClick>` with no
      // keyboard path to them at all.
      const { field, getByRole } = setup();
      fireEvent.keyDown(field, { key: "ArrowDown" });
      const list = getByRole("listbox");
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${list.id}-0`,
      );
      fireEvent.keyDown(field, { key: "ArrowDown" });
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${list.id}-1`,
      );
      fireEvent.keyDown(field, { key: "ArrowUp" });
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${list.id}-0`,
      );
    });

    it("wraps at both ends, and jumps with Home and End", () => {
      const { field, getByRole } = setup();
      fireEvent.keyDown(field, { key: "ArrowUp" });
      const list = getByRole("listbox");
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${list.id}-${FRUIT.length - 1}`,
      );
      fireEvent.keyDown(field, { key: "Home" });
      expect(field.getAttribute("aria-activedescendant")).toBe(`${list.id}-0`);
      fireEvent.keyDown(field, { key: "End" });
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${list.id}-${FRUIT.length - 1}`,
      );
    });

    it("commits with Enter and closes with Escape", () => {
      const onSelect = vi.fn();
      const { field, onChange, queryByRole } = setup({ onSelect });
      fireEvent.keyDown(field, { key: "ArrowDown" });
      fireEvent.keyDown(field, { key: "Enter" });
      expect(onChange).toHaveBeenLastCalledWith("Apple");
      expect(onSelect).toHaveBeenCalledWith({ value: "Apple" });
      expect(queryByRole("listbox")).toBeNull();

      fireEvent.keyDown(field, { key: "ArrowDown" });
      fireEvent.keyDown(field, { key: "Escape" });
      expect(queryByRole("listbox")).toBeNull();
    });

    it("steps over a disabled row instead of landing on it", () => {
      const { field, getByRole } = setup({
        options: [
          { value: "One" },
          { value: "Two", disabled: true },
          { value: "Three" },
        ],
      });
      fireEvent.keyDown(field, { key: "ArrowDown" });
      fireEvent.keyDown(field, { key: "ArrowDown" });
      expect(field.getAttribute("aria-activedescendant")).toBe(
        `${getByRole("listbox").id}-2`,
      );
    });
  });

  describe("options", () => {
    it("accepts objects as well as bare strings", () => {
      const { field, getByText } = setup({
        options: [
          { value: "gb", label: "United Kingdom", description: "Europe" },
        ],
      });
      fireEvent.focus(field);
      expect(getByText("United Kingdom")).toBeTruthy();
      expect(getByText("Europe")).toBeTruthy();
    });

    it("marks the current value as selected", () => {
      const { field, getByRole } = setup({ value: "Banana" });
      fireEvent.focus(field);
      const selected = within(getByRole("listbox"))
        .getAllByRole("option")
        .filter((o) => o.getAttribute("aria-selected") === "true");
      expect(selected).toHaveLength(1);
      expect(selected[0].textContent).toContain("Banana");
    });

    it("does not commit a disabled row that is clicked", () => {
      const { field, getByText, onChange } = setup({
        options: [{ value: "Nope", disabled: true }],
      });
      fireEvent.focus(field);
      fireEvent.mouseDown(getByText("Nope"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("the trailing affordance", () => {
    it("clears when there is something to clear", () => {
      const { getByLabelText, onChange } = setup({ value: "Apple" });
      fireEvent.click(getByLabelText("Clear"));
      expect(onChange).toHaveBeenCalledWith("");
    });

    it("otherwise toggles the list", () => {
      const { getByLabelText, queryByRole } = setup();
      expect(queryByRole("listbox")).toBeNull();
      fireEvent.click(getByLabelText("Show options"));
      expect(queryByRole("listbox")).toBeTruthy();
    });

    it("offers neither while disabled", () => {
      const { queryByRole } = setup({ value: "Apple", disabled: true });
      expect(queryByRole("listbox")).toBeNull();
    });
  });

  it("never opens when read-only", () => {
    const { field, queryByRole } = setup({ readOnly: true });
    fireEvent.focus(field);
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(queryByRole("listbox")).toBeNull();
  });
});

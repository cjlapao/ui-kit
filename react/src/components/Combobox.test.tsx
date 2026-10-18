import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";

import Combobox, { getComboboxToneClasses } from "./Combobox";
import {
  CONTROL_SIZES,
  TRUE_COLORS,
  VALIDATION_STATUSES,
} from "../theme/Theme";

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
      // The wash is fill-only; text stays with `selected` so hover (CSS)
      // and the cursor (fill) can never fight over a colour rule.
      // The table this replaces had 21 hand-written entries; four components
      // in this kit shipped the same drift before anyone noticed.
      for (const tone of TRUE_COLORS) {
        const classes = getComboboxToneClasses(tone);
        expect(classes.wash).toContain(`-${tone}-`);
        expect(classes.selected).toContain(`-${tone}-`);
      }
    });

    it("does not paint `red` as rose or `green` as emerald", () => {
      // The exact drift the old map carried.
      expect(getComboboxToneClasses("red").wash).toContain("-red-");
      expect(getComboboxToneClasses("red").wash).not.toContain("rose");
      expect(getComboboxToneClasses("green").wash).toContain("-green-");
      expect(getComboboxToneClasses("green").wash).not.toContain("emerald");
    });

    it("falls back to a key that exists", () => {
      // `InputGroup` fell back to a key that did not, and crashed for 15 tones.
      expect(getComboboxToneClasses(undefined).wash).toBeTruthy();
      expect(getComboboxToneClasses("nonsense" as never).wash).toBeTruthy();
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
      expect(
        within(getByRole("listbox")).queryAllByRole("option"),
      ).toHaveLength(0);
      expect(getByRole("listbox").textContent).toContain("No matching options");
    });

    it("shows a spinner while options are loading", () => {
      const { field, getByRole } = setup({ loading: true });
      fireEvent.focus(field);
      expect(getByRole("listbox").textContent).toContain("Loading");
      expect(
        within(getByRole("listbox")).queryAllByRole("option"),
      ).toHaveLength(0);
    });
  });

  describe("the keyboard", () => {
    it("opens and moves with the arrows", () => {
      // None of this existed: the old rows were `<div onClick>` with no
      // keyboard path to them at all.
      const { field, getByRole } = setup();
      fireEvent.keyDown(field, { key: "ArrowDown" });
      const list = getByRole("listbox");
      expect(field.getAttribute("aria-activedescendant")).toBe(`${list.id}-0`);
      fireEvent.keyDown(field, { key: "ArrowDown" });
      expect(field.getAttribute("aria-activedescendant")).toBe(`${list.id}-1`);
      fireEvent.keyDown(field, { key: "ArrowUp" });
      expect(field.getAttribute("aria-activedescendant")).toBe(`${list.id}-0`);
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

describe("Combobox - the popup", () => {
  const openList = (utils: ReturnType<typeof setup>) => {
    fireEvent.focus(utils.field);
    return document.querySelector('[data-slot="combobox-popup"]')!;
  };

  it("opens a portaled panel, not an in-flow box", () => {
    const utils = setup();
    const popup = openList(utils);
    // A combobox near a scroller's edge must not have its options
    // clipped by it - the popup is a <body> child, placed fixed.
    expect(popup.parentElement).toBe(document.body);
    expect(popup.className.split(" ")).toContain("fixed");
    // The card is a Panel from the container family.
    expect(popup.querySelector("section")).toBeTruthy();
    // ...and the list is a ScrollArea, not a bare overflow box.
    const list = utils.getByRole("listbox");
    expect(list.parentElement?.parentElement?.className).toContain("overflow");
  });

  it("hover washes in the tone - the list is the field's shadow", () => {
    const utils = setup({ tone: "violet" });
    openList(utils);
    const row = utils.getByRole("option", { name: "Banana" });
    fireEvent.mouseEnter(row);
    const classes = row.className.split(" ");
    expect(classes).toContain("hover:bg-violet-50");
    expect(classes).toContain("dark:hover:bg-violet-500/15");
    // Tone only ever through the hover: rules - a mere mouse-into-the-list
    // (no hover: state in jsdom) must not leave a static accent fill.
    expect(
      classes.filter((c) => c.startsWith("bg-") && !c.includes("hover")).length,
    ).toBe(0);
  });

  it("the keyboard cursor washes, in tone on the selected row and neutral elsewhere", () => {
    // The typed query narrows the list, so drive the cursor with a
    // committed value: the one row visible is the selected one.
    const utils = setup({ value: "Banana" });
    fireEvent.keyDown(utils.field, { key: "ArrowDown" });
    const onSelected = utils
      .getByRole("option", { name: "Banana" })!
      .className.split(" ");
    expect(onSelected).toContain("bg-blue-50");
    expect(onSelected).toContain("ring-inset");
    // An unselected cursor row is a position marker, not an accent block.
    const plain = render(<Combobox options={FRUIT} onChange={() => {}} />);
    const plainField = within(plain.container).getByRole("combobox");
    fireEvent.keyDown(plainField, { key: "ArrowDown" }); // Apple
    // Rows live in the portal, so this render's own list id scopes them.
    const onPlain = document
      .getElementById(`${plainField.getAttribute("aria-controls")}-0`)!
      .className.split(" ");
    expect(onPlain).toContain("bg-neutral-50");
    expect(onPlain.some((c) => c.startsWith("bg-blue-"))).toBe(false);
  });

  it("Escape dismisses the list without waking the host's ladder", () => {
    const onHostEscape = vi.fn();
    const utils = render(
      <div onKeyDown={onHostEscape}>
        <Combobox options={FRUIT} onChange={() => {}} />
      </div>,
    );
    const field = utils.getByRole("combobox");
    fireEvent.focus(field);
    fireEvent.keyDown(field, { key: "Escape" });
    expect(utils.queryByRole("listbox")).toBeNull();
    expect(onHostEscape).not.toHaveBeenCalled();
    // Closed, the next Escape belongs to the host again.
    fireEvent.keyDown(field, { key: "Escape" });
    expect(onHostEscape).toHaveBeenCalled();
  });

  it("a glass field opens a glass popup by default", () => {
    const utils = render(
      <Combobox options={FRUIT} onChange={() => {}} variant="glass" />,
    );
    fireEvent.focus(utils.getByRole("combobox"));
    const card = document.querySelector(
      '[data-slot="combobox-popup"] section',
    )!;
    expect(card.className).toContain("backdrop-blur");
  });
});

describe("Combobox - loading reads before the list is even open", () => {
  it("spins in the trailing slot of the closed field", () => {
    const { field, getByLabelText } = setup({ loading: true });
    // A spinner nobody can see because the popup is closed is how
    // `loading` came to look like a no-op.
    expect(getByLabelText("Loading…")).toBeTruthy();
    expect(field.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the keyboard cursor off rows it cannot show", () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const utils = render(
      <Combobox
        options={FRUIT}
        loading
        onChange={onChange}
        onSelect={onSelect}
      />,
    );
    const field = utils.getByRole("combobox");
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(field.getAttribute("aria-activedescendant")).toBeNull();
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onSelect).not.toHaveBeenCalled();
    expect(field.getAttribute("aria-expanded")).toBe("true");
    // The list itself is the spinner, not the hidden rows.
    expect(utils.getByRole("listbox").textContent).toContain("Loading");
    expect(utils.queryAllByRole("option")).toHaveLength(0);
  });

  it("the clear button stands down while fetching", () => {
    const { queryByLabelText } = setup({ value: "Apple", loading: true });
    expect(queryByLabelText("Clear")).toBeNull();
    expect(queryByLabelText("Loading…")).toBeTruthy();
  });
});

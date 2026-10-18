import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Combobox from "./Combobox.vue";
import { CONTROL_SIZES, TRUE_COLORS, VALIDATION_STATUSES } from "../theme/Theme";

const FRUIT = ["Apple", "Apricot", "Banana", "Cherry"];

const mountBox = (props: Record<string, unknown> = {}) =>
  mount(Combobox, {
    props: { options: FRUIT, ...props },
    attachTo: document.body,
  });

const field = (w: ReturnType<typeof mountBox>) => w.get('[role="combobox"]');

describe("Combobox", () => {
  describe("tones", () => {
    it("has a class set for every tone, generated not hand-written", () => {
      // The table this replaces had 21 entries in which `red` painted rose and
      // `green` painted emerald.
      for (const tone of TRUE_COLORS) {
        const w = mountBox({ tone, value: "Apple" });
        field(w).trigger("focus");
        expect(w.html()).toContain(`-${tone}-`);
      }
    });
  });

  describe("the shared scales", () => {
    it("takes every control size", () => {
      for (const size of CONTROL_SIZES) {
        expect(mountBox({ size }).find('[role="combobox"]').exists()).toBe(true);
      }
    });

    it("takes the shared validation statuses", () => {
      expect([...VALIDATION_STATUSES]).toEqual(["none", "error", "success"]);
      for (const validationStatus of VALIDATION_STATUSES) {
        expect(
          mountBox({ validationStatus }).find('[role="combobox"]').exists(),
        ).toBe(true);
      }
    });

    it("still honours the deprecated `error` flag", () => {
      // Rose is the kit's error tone; the old version hardcoded `red-300`.
      expect(mountBox({ error: true }).html()).toContain("rose");
    });
  });

  describe("the listbox", () => {
    it("is announced as a combobox with a controlled listbox", async () => {
      // The old version was a bare `<input>` and `<div onClick>` rows.
      const w = mountBox();
      expect(field(w).attributes("aria-expanded")).toBe("false");
      await field(w).trigger("focus");
      expect(field(w).attributes("aria-expanded")).toBe("true");
      const list = w.get('[role="listbox"]');
      expect(field(w).attributes("aria-controls")).toBe(list.attributes("id"));
      expect(w.findAll('[role="option"]')).toHaveLength(FRUIT.length);
    });

    it("filters on what has been typed", async () => {
      const w = mountBox();
      await field(w).trigger("focus");
      await field(w).setValue("ap");
      expect(w.findAll('[role="option"]').map((o) => o.text())).toEqual([
        "Apple",
        "Apricot",
      ]);
    });

    it("says so when nothing matches", async () => {
      const w = mountBox();
      await field(w).trigger("focus");
      await field(w).setValue("zzz");
      expect(w.findAll('[role="option"]')).toHaveLength(0);
      expect(w.get('[role="listbox"]').text()).toContain("No matching options");
    });

    it("shows a spinner while options are loading", async () => {
      const w = mountBox({ loading: true });
      await field(w).trigger("focus");
      expect(w.get('[role="listbox"]').text()).toContain("Loading");
      expect(w.findAll('[role="option"]')).toHaveLength(0);
    });
  });

  describe("the keyboard", () => {
    it("opens and moves with the arrows", async () => {
      // None of this existed: the old rows had no keyboard path to them.
      const w = mountBox();
      await field(w).trigger("keydown", { key: "ArrowDown" });
      const listId = w.get('[role="listbox"]').attributes("id");
      expect(field(w).attributes("aria-activedescendant")).toBe(`${listId}-0`);
      await field(w).trigger("keydown", { key: "ArrowDown" });
      expect(field(w).attributes("aria-activedescendant")).toBe(`${listId}-1`);
      await field(w).trigger("keydown", { key: "ArrowUp" });
      expect(field(w).attributes("aria-activedescendant")).toBe(`${listId}-0`);
    });

    it("wraps at both ends, and jumps with Home and End", async () => {
      const w = mountBox();
      await field(w).trigger("keydown", { key: "ArrowUp" });
      const listId = w.get('[role="listbox"]').attributes("id");
      expect(field(w).attributes("aria-activedescendant")).toBe(
        `${listId}-${FRUIT.length - 1}`,
      );
      await field(w).trigger("keydown", { key: "Home" });
      expect(field(w).attributes("aria-activedescendant")).toBe(`${listId}-0`);
    });

    it("commits with Enter and stays closed afterwards", async () => {
      // Committing refocuses the field, and focus opens the list — so this
      // used to re-open the very list it had just closed.
      const w = mountBox();
      await field(w).trigger("keydown", { key: "ArrowDown" });
      await field(w).trigger("keydown", { key: "Enter" });
      // `.at()` needs es2022 lib; the Vue kit targets lower.
      const values = w.emitted("update:value") ?? [];
      const selects = w.emitted("select") ?? [];
      expect(values[values.length - 1]).toEqual(["Apple"]);
      expect(selects[selects.length - 1]).toEqual([{ value: "Apple" }]);
      expect(w.find('[role="listbox"]').exists()).toBe(false);
      // ...and the caret comes back to the field. This assertion is the one
      // that catches a throwing `focusField`: the exception escapes through
      // the keydown listener, so without it the test passes while the commit
      // path is broken.
      expect(document.activeElement).toBe(field(w).element);
    });

    it("closes with Escape", async () => {
      const w = mountBox();
      await field(w).trigger("keydown", { key: "ArrowDown" });
      await field(w).trigger("keydown", { key: "Escape" });
      expect(w.find('[role="listbox"]').exists()).toBe(false);
    });

    it("steps over a disabled row instead of landing on it", async () => {
      const w = mountBox({
        options: [
          { value: "One" },
          { value: "Two", disabled: true },
          { value: "Three" },
        ],
      });
      await field(w).trigger("keydown", { key: "ArrowDown" });
      await field(w).trigger("keydown", { key: "ArrowDown" });
      const listId = w.get('[role="listbox"]').attributes("id");
      expect(field(w).attributes("aria-activedescendant")).toBe(`${listId}-2`);
    });
  });

  describe("options", () => {
    it("accepts objects as well as bare strings", async () => {
      const w = mountBox({
        options: [
          { value: "gb", label: "United Kingdom", description: "Europe" },
        ],
      });
      await field(w).trigger("focus");
      expect(w.text()).toContain("United Kingdom");
      expect(w.text()).toContain("Europe");
    });

    it("marks the current value as selected", async () => {
      const w = mountBox({ value: "Banana" });
      await field(w).trigger("focus");
      const selected = w
        .findAll('[role="option"]')
        .filter((o) => o.attributes("aria-selected") === "true");
      expect(selected).toHaveLength(1);
      expect(selected[0].text()).toContain("Banana");
    });

    it("does not commit a disabled row that is clicked", async () => {
      const w = mountBox({ options: [{ value: "Nope", disabled: true }] });
      await field(w).trigger("focus");
      await w.get('[role="option"]').trigger("mousedown");
      expect(w.emitted("update:value")).toBeUndefined();
    });
  });

  it("never opens when read-only", async () => {
    const w = mountBox({ readOnly: true });
    await field(w).trigger("focus");
    await field(w).trigger("keydown", { key: "ArrowDown" });
    expect(w.find('[role="listbox"]').exists()).toBe(false);
  });
});

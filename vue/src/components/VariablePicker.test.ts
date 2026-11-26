import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";

import VariablePicker from "./VariablePicker.vue";
import { POPUP_ROW_WASH } from "../theme/Theme";
import type { SmartVariableGroup } from "../types/Variables";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "App",
    variables: [{ key: "REGION", label: "Region", value: "eu-west-1" }],
  },
];

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(VariablePicker, {
    props: { groups: GROUPS, ...props },
    attachTo: document.body,
  });

const row = () =>
  Array.from(document.querySelectorAll("button")).find((b) =>
    b.textContent?.includes("Region"),
  )!;

describe("VariablePicker (vue) — optionHoverTone (popup row wash)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("rows wash with the family blend, not the surface-trigger family", () => {
    mountPicker();
    const classes = row().className.split(" ");
    // Vue's row used to wear the surface-trigger hover — tinted per group,
    // so one tab hovered green and the next purple. React retired that in
    // the list doctrine; the family constant now lands it here too.
    expect(classes).toEqual(
      expect.arrayContaining(POPUP_ROW_WASH.hover.split(" ")),
    );
    expect(row().className).not.toMatch(/-500\/15/);
  });

  it("optionHoverTone paints the row under the pointer", () => {
    mountPicker({ optionHoverTone: "rose" });
    expect(row().className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-rose-500/15",
        "dark:hover:bg-rose-500/20",
      ]),
    );
  });

  it('"selected" follows the row tone — the group hue when it names one', () => {
    mountPicker({ optionHoverTone: "selected" });
    expect(row().className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-blue-500/15",
        "dark:hover:bg-blue-500/20",
      ]),
    );
  });

  it("with a group hue, the wash follows the group", () => {
    mountPicker({
      groups: [{ ...GROUPS[0], tone: "violet" }],
      optionHoverTone: "selected",
    });
    expect(row().className.split(" ")).toEqual(
      expect.arrayContaining([
        "hover:bg-violet-500/15",
        "dark:hover:bg-violet-500/20",
      ]),
    );
  });
});

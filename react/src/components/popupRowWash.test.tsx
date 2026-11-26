/**
 * Popup rows wash; they do not paint over the card.
 *
 * Every row here sits on a *card*, and in dark mode a card is not `neutral-900`
 * but a blend — `--ui-surface-color` at `--ui-surface-alpha` over
 * `--ui-surface-base` — which for a neutral `simple` card composites to roughly
 * `neutral-800`. The wash this family shared was `dark:hover:bg-neutral-800/60`:
 * one luminance unit from the surface it is supposed to stand out of, so a
 * `Picker` in `ghost` with a neutral panel showed the pointer nothing at all as
 * it crossed the list. A blend from the light end of the scale cannot collide —
 * there is no base it does not lighten — which is why the wash is one constant
 * in the theme rather than a step each component picks for itself.
 *
 * The rows are the combinations the report arrived in: a tinted field whose
 * panel was left neutral, which is exactly when nobody notices a missing wash
 * until the list is the only thing on screen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { useRef, useState, type ReactElement } from "react";

import Combobox from "./Combobox";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";
import Picker from "./Picker";
import TagPicker, { type TagPickerItem } from "./TagPicker";
import { VariablePicker } from "./VariablePicker";
import { POPUP_ROW_WASH } from "../theme/Theme";
import type { SmartVariableGroup } from "../types/Variables";

vi.mock("../contexts/IconContext", () => ({ useIconRenderer: () => vi.fn() }));

afterEach(() => render(null));

const LIGHT_WASH = POPUP_ROW_WASH.hover.split(" ")[0];
const DARK_WASH = POPUP_ROW_WASH.hover.split(" ")[1];
const DARK_CURSOR = POPUP_ROW_WASH.cursor.split(" ")[1];

/** What a row used to wear, and what it must never wear again. */
const RETIRED = new Set([
  "hover:bg-neutral-50",
  "dark:hover:bg-neutral-800/60",
  "bg-neutral-50",
  "dark:bg-neutral-800/60",
  "hover:bg-neutral-100",
  "dark:hover:bg-neutral-800",
]);

const classes = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const rowsIn = (selector: string) => {
  const rows = Array.from(document.body.querySelectorAll<HTMLElement>(selector));
  expect(rows.length, "the popup never opened — a closed popup tests nothing").toBeGreaterThan(0);
  return rows;
};

const ITEMS = [
  { id: "a", title: "api-gateway", subtitle: "eu-west-1" },
  { id: "b", title: "worker-pool", subtitle: "us-east-1" },
];
const TAG_ITEMS: TagPickerItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];
const MENU_ITEMS: DropdownMenuOption[] = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
];
const GROUPS: SmartVariableGroup[] = [
  { id: "global", label: "Global", tone: "indigo", variables: [{ key: "APP_NAME", value: "orchestrator" }] },
];

/** `DropdownMenu` is anchored and controlled, the way `DropdownButton` drives it. */
const MenuHarness = () => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open] = useState(true);
  return (
    <div>
      <div ref={anchorRef} />
      <DropdownMenu anchorRef={anchorRef} open={open} onClose={() => {}} items={MENU_ITEMS} />
    </div>
  );
};

type Row = {
  name: string;
  draw: () => ReactElement;
  /** Reveal the card, then name the rows the pointer travels across. */
  open: () => string;
  /**
   * Whether every row wears the shared wash or only the one the keyboard is on.
   * `Combobox` is the exception: its rows answer the tone on hover — a single
   * choice, so "this is pickable" is worth the colour — and the neutral wash is
   * left to the keyboard cursor alone.
   */
  every?: boolean;
};

const ROWS: Row[] = [
  {
    // The reported combination: ghost field, blue accent, neutral fill, and a
    // `simple` card left on the neutral panel tone.
    name: "Picker",
    draw: () => (
      <Picker
        items={ITEMS}
        variant="ghost"
        tone="blue"
        inputFillTone="neutral"
        panelVariant="simple"
        panelTone="neutral"
      />
    ),
    open: () => {
      fireEvent.click(document.body.querySelector('[aria-haspopup="listbox"]')!);
      return '[role="option"]';
    },
  },
  {
    name: "Picker (grouped, with the select-all header)",
    draw: () => (
      <Picker
        items={[
          { id: "a", title: "api-gateway", group: "Fleet" },
          { id: "b", title: "worker-pool", group: "Fleet" },
        ]}
        multi
        groupSelectable
        variant="ghost"
        tone="blue"
        inputFillTone="neutral"
        panelVariant="simple"
        panelTone="neutral"
      />
    ),
    open: () => {
      fireEvent.click(document.body.querySelector('[aria-haspopup="listbox"]')!);
      return '[role="option"], [role="checkbox"]';
    },
  },
  {
    name: "TagPicker",
    draw: () => (
      <TagPicker
        items={TAG_ITEMS}
        value={[]}
        onChange={vi.fn()}
        allowCreate
        variant="ghost"
        tone="blue"
        inputFillTone="neutral"
        panelVariant="simple"
        panelTone="neutral"
      />
    ),
    open: () => {
      fireEvent.click(document.body.querySelector('[aria-haspopup="listbox"]')!);
      return '[role="option"], [role="button"]';
    },
  },
  {
    name: "Combobox (the keyboard cursor)",
    draw: () => (
      <Combobox
        options={["Apple", "Apricot", "Banana"]}
        onChange={vi.fn()}
        variant="ghost"
        tone="blue"
        inputFillTone="neutral"
        panelVariant="simple"
        panelTone="neutral"
      />
    ),
    open: () => {
      const input = document.body.querySelector('[role="combobox"]') as HTMLInputElement;
      fireEvent.focus(input);
      // The cursor wash paints only for the keyboard; hover is left to CSS.
      fireEvent.keyDown(input, { key: "ArrowDown" });
      return '[role="option"]';
    },
    every: false,
  },
  {
    name: "VariablePicker",
    draw: () => (
      <VariablePicker
        groups={GROUPS}
        onSelect={vi.fn()}
        variant="simple"
        tone="blue"
        inputFillTone="neutral"
        panelTone="neutral"
      />
    ),
    open: () => "button[class*='hover:bg-']",
  },
  {
    name: "DropdownMenu",
    draw: () => <MenuHarness />,
    open: () => '[role="menuitem"], [role="menuitemcheckbox"], button',
  },
];

describe("the popup family's row wash", () => {
  it.each(ROWS)("$name", ({ draw, open, every }) => {
    render(draw());
    const selector = open();
    const worn: string[][] = [];
    // The two halves of the shared constant, so the pointer answers on a white
    // popover and on a neutral card alike.
    const shared = (tokens: string[]) =>
      tokens.filter((t) => t === LIGHT_WASH || t === DARK_WASH || t === DARK_CURSOR);
    for (const row of rowsIn(selector)) {
      const tokens = classes(row);
      // 1. Nothing retired: the step that collided with the card is gone.
      expect(tokens.filter((t) => RETIRED.has(t)), `${row.tagName} still wears the retired wash`).toEqual([]);
      // 2. The generalized rule: a dark-mode wash drawn from the dark half of
      //    the neutral scale cannot read on a card that already lives there.
      expect(
        tokens.filter((t) => /^dark:(?:hover:)?bg-neutral-[5-9]\d\d/.test(t)),
        `${row.tagName} washes with a dark step — on a dark card that is invisible`,
      ).toEqual([]);
      // 3. And the row does wash.
      if (every !== false) {
        expect(shared(tokens).length, `${row.tagName} carries no part of the shared wash`).toBeGreaterThan(0);
      }
      worn.push(tokens);
    }
    if (every === false) {
      // Only the row the keyboard is on is expected to wash.
      expect(worn.some((tokens) => shared(tokens).length > 0), "no row carried the shared wash").toBe(true);
    }
  });
});

/**
 * The field family's one contract, proved in one place.
 *
 * `fillTone` — `inputFillTone` on the composites — paints the field's `bg-*`
 * fill and nothing else. Every affordance keeps following `tone`: the focus
 * border and ring, the icons, the glow, and `ghost`'s hover rim, which is what
 * the pointer asks for and so belongs to the tone, not the paint. Every card
 * keeps following `panelTone`.
 *
 * One table, five assertions, eighteen controls. The assertions are deliberately
 * hue-blind to *intent*: they only ask which class tokens mention the hue, so a
 * leak into a rim, a border, a pill or a menu row fails the same way — which is
 * exactly how the ghost hover-rim regression would have been caught the day it
 * shipped. A new field-surface component joins by adding a row; forgetting to
 * leaves a hole this table makes visible rather than one nobody looks for.
 *
 * See docs/superpowers/specs/2026-11-25-field-fill-tone-override-design.md.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState, type ReactElement } from "react";

import Combobox from "./Combobox";
import DatePicker from "./DatePicker/DatePicker";
import DynamicFormField from "./DynamicFormField";
import Input from "./Input";
import InputGroup from "./InputGroup";
import IdentityPicker from "./IdentityPicker/IdentityPicker";
import InputOtp from "./InputOtp";
import KeyValueArrayField, { type KeyValuePair } from "./KeyValueArrayField";
import PasswordInput from "./PasswordInput";
import Picker from "./Picker";
import SearchBar from "./SearchBar";
import Select from "./Select";
import SlugInput from "./SlugInput";
import SmartInput from "./SmartInput";
import TagPicker, { type TagPickerItem } from "./TagPicker";
import Textarea from "./Textarea";
import { VariablePicker } from "./VariablePicker";
import {
  CapsuleBlueprintValueType,
  type CapsuleBlueprintParameter,
} from "../../../common/types/CapsuleBlueprint";
import type { SmartVariableGroup } from "../types/Variables";

/**
 * `fuchsia`, not the `rose` the design notes reach for: rose is the kit's
 * semantic error colour — `VariablePicker` paints a missing value
 * `text-rose-500` — and a contract that flags a semantic colour as a leak
 * trains people to weaken the assertion instead of reading the failure.
 */
const HUE = "fuchsia";
const TONE = "blue";

const PICKER_ITEMS = [
  { id: "a", title: "Alpha" },
  { id: "b", title: "Beta" },
];

const TAG_ITEMS: TagPickerItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const FRUIT = ["Apple", "Apricot", "Banana"];

const GROUPS: SmartVariableGroup[] = [
  {
    id: "global",
    label: "Global",
    tone: "indigo",
    variables: [{ key: "APP_NAME", value: "orchestrator" }],
  },
];

const PAIRS: KeyValuePair[] = [{ key: "region", value: "eu-west" }];

/**
 * `SmartInput` is controlled, so the contract has to be the one holding state:
 * typing `{{` has to survive the round trip or the suggestions never appear,
 * and a row that never reveals its panel quietly stops testing what it says.
 */
const SmartInputHarness = () => {
  const [value, setValue] = useState("");
  return (
    <SmartInput
      value={value}
      onChange={setValue}
      groups={GROUPS}
      aria-label="f"
      tone={TONE}
      inputFillTone={HUE}
    />
  );
};

const PARAM: CapsuleBlueprintParameter = {
  name: "Region",
  key: "region",
  value_type: CapsuleBlueprintValueType.String,
};

type Row = {
  name: string;
  /** The control as a caller would write it, hue and tone already disagreed. */
  draw: () => ReactElement;
  /**
   * Reveal the surface the caller cannot see until the pointer asks — the
   * dropdown, the calendar, the suggestions. A closed popup is not in the DOM,
   * so without this the "the menu stayed out of it" assertion proves nothing.
   * Every popup in this family renders through a portal into `document.body`,
   * which is why the scans below walk the body and not the container: a
   * container-scoped leak check would never see the menu it claims to check.
   */
  open?: () => void;
};

const click = (selector: string) => {
  const el = document.body.querySelector(selector);
  if (el) fireEvent.click(el);
};

const focus = (selector: string) => {
  const el = document.body.querySelector(selector);
  if (el) fireEvent.focus(el);
};

const ROWS: Row[] = [
  {
    name: "Input",
    draw: () => (
      <Input aria-label="f" tone={TONE} fillTone={HUE} defaultValue="x" />
    ),
  },
  {
    name: "Textarea",
    draw: () => (
      <Textarea aria-label="f" tone={TONE} fillTone={HUE} defaultValue="x" />
    ),
  },
  {
    name: "Select",
    draw: () => (
      <Select aria-label="f" tone={TONE} fillTone={HUE} defaultValue="a">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    ),
  },
  {
    name: "SearchBar",
    draw: () => (
      <SearchBar onSearch={() => {}} tone={TONE} fillTone={HUE} />
    ),
  },
  {
    name: "InputGroup",
    draw: () => (
      <InputGroup tone={TONE} fillTone={HUE} leadingAddon="@">
        <Input defaultValue="x" />
      </InputGroup>
    ),
  },
  {
    name: "InputOtp",
    draw: () => <InputOtp tone={TONE} fillTone={HUE} length={4} />,
  },
  {
    name: "PasswordInput",
    draw: () => <PasswordInput aria-label="f" tone={TONE} fillTone={HUE} />,
  },
  {
    name: "SlugInput",
    draw: () => (
      <SlugInput defaultValue="Hello, World!" tone={TONE} fillTone={HUE} />
    ),
  },
  {
    name: "Picker",
    draw: () => <Picker items={PICKER_ITEMS} tone={TONE} inputFillTone={HUE} />,
    open: () => click('[aria-haspopup="listbox"]'),
  },
  {
    name: "TagPicker",
    draw: () => (
      <TagPicker
        items={TAG_ITEMS}
        value={[]}
        onChange={vi.fn()}
        tone={TONE}
        inputFillTone={HUE}
      />
    ),
    open: () => click('[aria-haspopup="listbox"]'),
  },
  {
    name: "Combobox",
    draw: () => (
      <Combobox options={FRUIT} onChange={vi.fn()} tone={TONE} inputFillTone={HUE} />
    ),
    open: () => focus('[role="combobox"]'),
  },
  {
    name: "SmartInput",
    draw: () => (
      <SmartInputHarness />
    ),
    open: () => {
      // It rests in display mode; editing reveals the field and the field's own
      // affordance opens the variable card — the one surface in this family a
      // caller can tint from two directions, so it is worth the two hops.
      if (!screen.queryByRole("button", { name: "Insert variable" })) {
        fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
      }
      fireEvent.click(screen.getByRole("button", { name: "Insert variable" }));
    },
  },
  {
    name: "DatePicker",
    draw: () => (
      <DatePicker
        defaultValue={new Date(2026, 2, 15)}
        tone={TONE}
        inputFillTone={HUE}
      />
    ),
    open: () => fireEvent.click(screen.getByRole("button", { name: /Choose a date/ })),
  },
  {
    name: "VariablePicker",
    draw: () => (
      <VariablePicker
        groups={GROUPS}
        onSelect={vi.fn()}
        tone={TONE}
        inputFillTone={HUE}
      />
    ),
  },
  {
    name: "KeyValueArrayField",
    draw: () => (
      <KeyValueArrayField
        label="Metadata"
        value={PAIRS}
        onChange={vi.fn()}
        tone={TONE}
        inputFillTone={HUE}
      />
    ),
  },
  {
    // A card holding three fields. Both rows matter: the emoji tab is where the
    // search box and the category select sit side by side and have to agree,
    // and the monogram tab is the field nobody sees until the tab is offered.
    name: "IdentityPicker (search and category)",
    draw: () => (
      <IdentityPicker
        name="Project Atlas"
        modes={["emoji"]}
        tone={TONE}
        inputFillTone={HUE}
        onChange={vi.fn()}
      />
    ),
  },
  {
    name: "IdentityPicker (initials)",
    draw: () => (
      <IdentityPicker
        name="Project Atlas"
        modes={["monogram"]}
        tone={TONE}
        inputFillTone={HUE}
        onChange={vi.fn()}
      />
    ),
  },
  {
    name: "DynamicFormField",
    draw: () => (
      <DynamicFormField
        parameter={PARAM}
        onChange={vi.fn()}
        tone={TONE}
        inputFillTone={HUE}
      />
    ),
  },
];

/** A token is paint, not affordance, when its utility is `bg-`. */
const isFillToken = (token: string) =>
  token.split(":").pop()!.startsWith("bg-");

const tokenListOf = (el: Element) =>
  // `className` is an SVGAnimatedString on SVG elements, not a string.
  (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

const tokensIn = (root: Element) =>
  Array.from(root.querySelectorAll("[class]")).flatMap(tokenListOf);

/** Elements wearing the hue as their fill — the field boxes themselves. */
const paintedBoxes = (root: Element) =>
  Array.from(root.querySelectorAll("[class]")).filter((el) =>
    tokenListOf(el).some((t) => isFillToken(t) && t.includes(`-${HUE}-`)),
  );

const toneAffordances = (root: Element) =>
  tokensIn(root).filter(
    (t) =>
      /(^|:)focus/.test(t) &&
      // The affordance is a ring, a border *or* an outline — `InputGroup`
      // dresses its box with `outline-blue-200/70` deepening to
      // `focus-within:outline-blue-400`, which is its honest equivalent of the
      // border other fields use. The hue must never be in this list.
      new RegExp(`(?:border|ring|outline)-${TONE}-`).test(t),
  );

describe("the field family's fill contract", () => {
  it.each(ROWS)("$name", ({ draw, open }) => {
    const { container } = render(draw());

    // 1. The fill moved: some element wears the hue as a `bg-*` paint, at the
    //    variant's own recipe (every row here rests in `flat`).
    const boxes = paintedBoxes(document.body);
    expect(boxes.length).toBeGreaterThan(0);
    expect(
      tokensIn(document.body).some((t) => new RegExp(`^bg-${HUE}-`).test(t)),
    ).toBe(true);

    // 2. The affordances stayed: something still answers the keyboard in the
    //    tone. A fill override that also took the focus ring is the failure
    //    this whole contract exists to prevent.
    expect(toneAffordances(document.body).length).toBeGreaterThan(0);

    // 3. Reveal what the caller cannot see yet — and fail loudly if the reveal
    //    did not happen. An opener that silently no-ops turns assertion 4 from
    //    "the menu stayed out of it" into "the menu was never there", which is
    //    the kind of quiet weakening a contract file has to defend against.
    if (open) {
      const before = document.body.querySelectorAll("*").length;
      open();
      expect(document.body.querySelectorAll("*").length).toBeGreaterThan(
        before,
      );
    }

    // 4. Nothing but the fill ever mentions the hue — no rim, no border, no
    //    pill, no menu row, no card. One pass, every element, including the
    //    popup opened above.
    expect(
      tokensIn(document.body).filter(
        (t) => t.includes(`-${HUE}-`) && !isFillToken(t),
      ),
    ).toEqual([]);

    // 5. The prop is a styling decision, not markup: it never reaches the DOM
    //    as an attribute on the inner control.
    expect(
      document.body.querySelector("[filltone], [inputfilltone]"),
    ).toBeNull();
  });
});

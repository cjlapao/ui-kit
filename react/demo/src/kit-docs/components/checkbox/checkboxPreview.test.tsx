import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { CheckboxPlayground } from "./CheckboxPlayground";
import { CHECKBOX_PROPS } from "./CheckboxPage";
import {
  DESCRIPTION_EXAMPLE,
  INPUT_CLASS_EXAMPLE,
  LABEL_DEFAULT,
  MESSAGE_EXAMPLE,
  STAGE_CLASS,
} from "./checkboxStage";

/**
 * The preview is the page's claim that the tag it prints is the thing that paints,
 * so these tests read the DOM the component really produces (:267-436) rather than
 * trusting the prose: one input, three drawings over it, a `<label>` that wraps
 * instead of pointing, and state that only a browser — not the component — decides.
 */

const open = (): ReturnType<typeof render> => {
  const view = render(<CheckboxPlayground />);
  const expand = Array.from(view.container.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim() === "Expand all",
  );
  if (expand) fireEvent.click(expand);
  return view;
};

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector<HTMLElement>(`.${STAGE_CLASS.split(" ").join(".")}`);
  if (!node) throw new Error("no preview stage");
  return node;
};

/** The row is a real `<label>` that contains the input (:409-420). */
const theRow = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>("label");
  if (!node) throw new Error("no label row in the preview");
  return node;
};

const theInput = (view: ReturnType<typeof render>): HTMLInputElement => {
  const node = stage(view).querySelector<HTMLInputElement>('input[type="checkbox"]');
  if (!node) throw new Error("no checkbox in the preview");
  return node;
};

/** The drawn box — the first `aria-hidden` sibling of the input (:300-322). */
/** The sized wrapper the box fills (`inset-0` needs a sized parent, :267-274). */
const theBoxWrap = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    'span[class*="inline-block"][class*="shrink-0"]',
  );
  if (!node) throw new Error("no box wrapper in the preview");
  return node;
};

const theBox = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>('span[aria-hidden="true"]');
  if (!node) throw new Error("no drawn box in the preview");
  return node;
};

/** The label's own span — `font-medium` is its own class (:379-385). */
const theLabelSpan = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>('label span[class*="font-medium"]');
  if (!node) throw new Error("no label span in the preview");
  return node;
};

const fieldBox = (view: ReturnType<typeof render>, label: string): HTMLElement => {
  const span = Array.from(view.container.querySelectorAll("span")).find(
    (node) => (node.textContent ?? "").trim() === label,
  );
  const box = span?.parentElement;
  if (!box) throw new Error(`no control labelled "${label}" in the controls`);
  return box as HTMLElement;
};

const hasField = (view: ReturnType<typeof render>, label: string): boolean =>
  Array.from(view.container.querySelectorAll("span")).some(
    (node) => (node.textContent ?? "").trim() === label,
  );

/** A choice, however the chrome chose to render it: a `MultiToggle` or a `Select`. */
const choose = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const box = fieldBox(view, label);
  const select = box.querySelector("select");
  if (select) {
    const option = Array.from(select.querySelectorAll("option")).find(
      (node) =>
        node.textContent?.trim() === value || node.getAttribute("value") === value,
    );
    if (!option) throw new Error(`"${value}" is not an option of "${label}"`);
    fireEvent.change(select, {
      target: { value: option.getAttribute("value") ?? value },
    });
    return;
  }
  const button = Array.from(box.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim().toLowerCase() === value.toLowerCase(),
  );
  if (!button) throw new Error(`"${value}" is not an option of "${label}"`);
  fireEvent.click(button);
};

const chooseSwatch = (view: ReturnType<typeof render>, tone: string): void => {
  fireEvent.click(
    within(fieldBox(view, TONE)).getByRole("button", { name: tone }),
  );
};

/** The chrome puts one knob's label and its switch in the same `<label>` row. */
const flip = (view: ReturnType<typeof render>, label: string): void => {
  const node = fieldBox(view, label).querySelector('[role="switch"]');
  if (!node) throw new Error(`no switch labelled "${label}"`);
  fireEvent.click(node);
};

const typeInto = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no text box for "${label}"`);
  fireEvent.change(input, { target: { value } });
};

const VARIANT = "Variant (:62,:194,:3421-3424)";
const SIZE = "Size (:58,:193,:247)";
const SIDE = "Box side (:77,:199,:412)";
const TONE = "Tone (:248,:3442-3453)";
const LEGACY = "Use the deprecated `color` (:71,:248)";
const FULL_WIDTH = "Full width (:75,:372,:405,:414)";
const LABEL = "Label (:52,:378-396)";
const DESCRIPTION = "Description (:54,:346-357)";
const PLACEMENT = "Description layout (:56,:351,:373-375)";
const REQUIRED = "Required (:86,:294,:387-394)";
const ARIA_LABEL = "aria-label (:215-219)";
const VALIDATION = "Validation (:82,:308-310,:428-431)";
const MESSAGE = "Message (:84,:422-436)";
const INDETERMINATE = "Indeterminate (:73,:229,:292,:337)";
const STARTS_CHECKED = "Starts checked (:295)";
const CONTROLLED = "Controlled by state (:295)";
const DISABLED = "Disabled (:205,:293,:319,:415)";
const INPUT_CLASS = "inputClassName (:89,:320)";

const rowClasses = (view: ReturnType<typeof render>): string =>
  theRow(view).getAttribute("class") ?? "";

const boxClasses = (view: ReturnType<typeof render>): string =>
  theBox(view).getAttribute("class") ?? "";

const labelClasses = (view: ReturnType<typeof render>): string =>
  theLabelSpan(view).getAttribute("class") ?? "";

/** The span holding the label and the description (`min-w-0`, :361-376). */
const labelBlockClasses = (view: ReturnType<typeof render>): string => {
  const node = theRow(view).querySelector<HTMLElement>('span[class*="min-w-0"]');
  if (!node) throw new Error("no label block in the preview");
  return node.getAttribute("class") ?? "";
};

const captions = (view: ReturnType<typeof render>): string =>
  Array.from(stage(view).querySelectorAll("p"))
    .map((node) => node.textContent ?? "")
    .join(" ");

/** The span holding the tick (`peer-checked:opacity-100`) or the dash. */
const glyphSpan = (view: ReturnType<typeof render>, marker: string): HTMLElement => {
  const node = Array.from(stage(view).querySelectorAll('span[aria-hidden="true"]')).find(
    (candidate) => (candidate.getAttribute("class") ?? "").includes(marker),
  );
  if (!node) throw new Error(`no glyph span carrying ${marker}`);
  return node as HTMLElement;
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Checkbox preview", () => {
  it("is one input under three drawings, all of them hidden from a reader (:275-342)", () => {
    const view = open();
    const input = theInput(view);
    expect(input.type).toBe("checkbox");
    // An invisible overlay, not `sr-only` — and still pointer-enabled (:279-289).
    expect(input.getAttribute("class")).toContain("opacity-0");
    expect(input.getAttribute("class")).toContain("appearance-none");
    expect(input.getAttribute("class")).not.toContain("pointer-events-none");
    // Box, tick and dash are all decoration (:300-342).
    expect(stage(view).querySelectorAll('span[aria-hidden="true"]')).toHaveLength(3);
    expect(theBox(view).getAttribute("class")).toContain("border-2");
  });

  it("names itself by nesting, not by htmlFor, and the whole row is the target (:409-420)", () => {
    const view = open();
    const input = theInput(view);
    expect(theRow(view).contains(input)).toBe(true);
    expect(theRow(view).getAttribute("for")).toBeNull();
    fireEvent.click(theLabelSpan(view));
    expect(input.checked).toBe(true);
    // One activation, not two — a double dispatch would land back at false.
    expect(captions(view)).toContain("onChange fired with checked=true (:295)");
  });

  it("stays quiet when a description alone names the box (:210-219)", () => {
    // Before the warning test: the development warning is deduplicated per
    // component (`warn:69`), so the quiet case has to be heard first.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    // Order matters: a render with neither name would legitimately warn.
    typeInto(view, DESCRIPTION, "One email a week");
    typeInto(view, LABEL, "");
    expect(theInput(view).disabled).toBe(false);
    expect(
      warn.mock.calls.some((call) =>
        String(call[0]).includes("<Checkbox> has no accessible name"),
      ),
    ).toBe(false);
  });

  it("warns in development when the box has no name at all (:215-219)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    typeInto(view, LABEL, "");
    expect(
      warn.mock.calls.some((call) =>
        String(call[0]).includes("<Checkbox> has no accessible name"),
      ),
    ).toBe(true);
  });

  it("hands a reader the description and the message in one aria-describedby (:264-265,:290)", () => {
    const view = open();
    typeInto(view, DESCRIPTION, DESCRIPTION_EXAMPLE);
    choose(view, VALIDATION, "error");
    const input = theInput(view);
    expect(input.getAttribute("aria-describedby")).toBe(
      `${input.id}-description ${input.id}-message`,
    );
    expect(input.id).not.toBe("");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("replaces the variant's border outright when validation says error (:305-310)", () => {
    const view = open();
    choose(view, VARIANT, "elevated");
    expect(boxClasses(view)).toContain("border-");
    choose(view, VALIDATION, "error");
    typeInto(view, MESSAGE, MESSAGE_EXAMPLE);
    expect(boxClasses(view)).toContain("border-rose-400");
    expect(stage(view).textContent).toContain("You have to accept this to continue");
  });

  it("draws the dash and says “mixed” for an indeterminate box (:292,:334-342)", () => {
    const view = open();
    flip(view, INDETERMINATE);
    const input = theInput(view);
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("mixed");
    expect(glyphSpan(view, "peer-indeterminate:opacity-100").tagName).toBe("SPAN");
    expect(captions(view)).toContain("Mixed: the dash is drawn");
  });

  it("lets the browser clear the mixed property while the attribute keeps claiming it (:227-245,:292)", () => {
    const view = open();
    flip(view, INDETERMINATE);
    const input = theInput(view);
    expect(input.indeterminate).toBe(true);
    fireEvent.click(theRow(view));
    // The browser owns the property and clears it on activation…
    expect(input.indeterminate).toBe(false);
    // …while `aria-checked` is written from the prop, so it still says mixed.
    expect(input.getAttribute("aria-checked")).toBe("mixed");
  });

  it("starts checked when told to, uncontrolled (:295)", () => {
    const view = open();
    flip(view, STARTS_CHECKED);
    expect(theInput(view).checked).toBe(true);
  });

  it("leaves a controlled box still, until the app's own state moves (:295)", () => {
    const view = open();
    flip(view, CONTROLLED);
    const input = theInput(view);
    expect(input.checked).toBe(false);
    fireEvent.click(theRow(view));
    expect(input.checked).toBe(true);
    expect(captions(view)).toContain("isOn is true");
  });

  it("puts the real attribute on the input when disabled, and dims the row (:293,:415)", () => {
    const view = open();
    flip(view, DISABLED);
    const input = theInput(view);
    expect(input.disabled).toBe(true);
    expect(rowClasses(view)).toContain("opacity-60");
    expect(rowClasses(view)).toContain("cursor-not-allowed");
    fireEvent.click(theRow(view));
    expect(input.checked).toBe(false);
    expect(captions(view)).toContain("the input carries the real attribute");
  });

  it("keeps a disabled checked box its fill, so the tick never goes grey on grey (:314-319)", () => {
    const view = open();
    flip(view, STARTS_CHECKED);
    flip(view, DISABLED);
    expect(boxClasses(view)).toContain("peer-checked:bg-blue-700");
    expect(boxClasses(view)).not.toContain("peer-disabled:bg-neutral-100");
    expect(boxClasses(view)).toContain("peer-disabled:border-neutral-200");
  });

  it("takes the box, glyph and gap from the size (:103-146,:247)", () => {
    const view = open();
    expect(labelClasses(view)).toContain("text-base");
    const wrap = (cls: string) => (theBoxWrap(view).getAttribute("class") ?? "").includes(cls);
    expect(wrap("h-5 w-5")).toBe(true);
    expect(wrap("rounded-md")).toBe(true);
    choose(view, SIZE, "xs");
    expect(wrap("h-3.5 w-3.5")).toBe(true);
    // The label's type size rides the same step (:108,:125).
    expect(labelClasses(view)).toContain("text-xs");
    expect(glyphSpan(view, "peer-checked:opacity-100").querySelector("svg")?.getAttribute("class")).toContain(
      "h-2.5 w-2.5",
    );
    expect(rowClasses(view)).toContain("gap-1.5");
  });

  it("reverses the row, rather than duplicating it, when the box goes last (:412)", () => {
    const view = open();
    expect(rowClasses(view)).not.toContain("flex-row-reverse");
    choose(view, SIDE, "right");
    expect(rowClasses(view)).toContain("flex-row-reverse");
    expect(rowClasses(view)).toContain("justify-between");
  });

  it("stretches the row and grows the label block, so alignment has room (:364-372,:414)", () => {
    const view = open();
    expect(rowClasses(view)).not.toContain("w-full");
    flip(view, FULL_WIDTH);
    expect(rowClasses(view)).toContain("w-full");
    expect(labelBlockClasses(view)).toContain("grow");
  });

  it("paints the fill, the dash and the ring with the tone (:3442-3453)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    flip(view, INDETERMINATE);
    expect(boxClasses(view)).toContain("peer-checked:bg-emerald-700");
    expect(boxClasses(view)).toContain("peer-indeterminate:bg-emerald-700");
    expect(boxClasses(view)).toContain("peer-focus-visible:ring-emerald-500");
  });

  it("honours the deprecated `color` spelling while it is on the tag (:71,:248)", () => {
    const view = open();
    flip(view, LEGACY);
    chooseSwatch(view, "rose");
    expect(theInput(view).disabled).toBe(false);
    expect(boxClasses(view)).toContain("peer-checked:bg-rose-700");
  });

  it("tints the glass fill and shadows the tick instead of trusting the fill (:251-261,:3434-3440)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    choose(view, VARIANT, "glass");
    expect(boxClasses(view)).toContain("peer-checked:bg-emerald-500/40");
    expect(boxClasses(view)).not.toContain("peer-checked:bg-emerald-700");
    expect(glyphSpan(view, "peer-checked:opacity-100").getAttribute("class")).toContain(
      "drop-shadow-sm",
    );
  });

  it("hands a typed aria-label to the input, where a reader will find it (:215-219,:295)", () => {
    const view = open();
    typeInto(view, ARIA_LABEL, "Subscribe to the digest");
    expect(theInput(view).getAttribute("aria-label")).toBe("Subscribe to the digest");
    expect(theLabelSpan(view).textContent).toContain(LABEL_DEFAULT);
  });

  it("brings the message's own control out only when there is a status to tint (:84)", () => {
    const view = open();
    expect(hasField(view, MESSAGE)).toBe(false);
    choose(view, VALIDATION, "error");
    expect(hasField(view, MESSAGE)).toBe(true);
    expect(stage(view).textContent).toContain(MESSAGE_EXAMPLE);
  });

  it("lands inputClassName on the drawn box, not on the input (:89,:320)", () => {
    const view = open();
    typeInto(view, INPUT_CLASS, INPUT_CLASS_EXAMPLE);
    expect(boxClasses(view)).toContain(INPUT_CLASS_EXAMPLE);
    expect(theInput(view).getAttribute("class")).not.toContain(INPUT_CLASS_EXAMPLE);
  });

  it("marks the input required and keeps the asterisk out of the reader's way (:294,:387-394)", () => {
    const view = open();
    flip(view, REQUIRED);
    expect(theInput(view).required).toBe(true);
    const asterisk = Array.from(theLabelSpan(view).querySelectorAll("span")).find(
      (node) => (node.getAttribute("class") ?? "").includes("text-rose-500"),
    );
    expect(asterisk?.getAttribute("aria-hidden")).toBe("true");
    expect(asterisk?.textContent).toBe("*");
  });

  it("puts the description beside the label instead of under it (:351,:373-375)", () => {
    const view = open();
    typeInto(view, DESCRIPTION, DESCRIPTION_EXAMPLE);
    const description = Array.from(stage(view).querySelectorAll("span")).find(
      (node) => (node.textContent ?? "").trim() === DESCRIPTION_EXAMPLE,
    );
    expect(description?.getAttribute("class")).toContain("block");
    choose(view, PLACEMENT, "inline");
    const same = Array.from(stage(view).querySelectorAll("span")).find(
      (node) => (node.textContent ?? "").trim() === DESCRIPTION_EXAMPLE,
    );
    expect(same?.getAttribute("class")).not.toContain("block");
    expect(labelBlockClasses(view)).toContain("flex-wrap");
  });

  it("documents in the table every prop the preview is driven by", () => {
    const names = new Set(
      CHECKBOX_PROPS.filter((prop) => !prop.name.startsWith("…")).flatMap((prop) =>
        prop.name.split(" / ").map((part) => part.trim()),
      ),
    );
    for (const field of [
      "variant",
      "size",
      "controlAlign",
      "fullWidth",
      "tone",
      "label",
      "description",
      "descriptionPlacement",
      "required",
      "validationStatus",
      "validationMessage",
      "indeterminate",
      "defaultChecked",
      "disabled",
      "inputClassName",
    ]) {
      expect(names.has(field), `${field} has no row`).toBe(true);
    }
  });
});

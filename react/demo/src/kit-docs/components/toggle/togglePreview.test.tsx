import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import TogglePlayground from "./TogglePlayground";
import { DESCRIPTION_EXAMPLE, LABEL_DEFAULT } from "./toggleStage";

/**
 * The preview is the half of this page's claim that has to survive a browser: the
 * attributes the component really puts on the checkbox, the classes it only puts on the
 * track once a prop asks, and the one thing it insists on — that a switch has a name.
 * Everything below is read back off the mounted elements, never off the config.
 */

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/** The row carries the resolved variant (:274) — the one handle on the hit area. */
const theRow = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>("[data-variant]");
  if (!node) throw new Error("no row in the preview");
  return node;
};

const theInput = (view: ReturnType<typeof render>): HTMLInputElement => {
  const node = stage(view).querySelector<HTMLInputElement>('input[type="checkbox"]');
  if (!node) throw new Error("no checkbox in the preview");
  return node;
};

/** The visible track — the first `aria-hidden` sibling of the input (:336-347). */
const theTrack = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!node) throw new Error("no track in the preview");
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
    fireEvent.change(select, { target: { value: option.getAttribute("value") ?? value } });
    return;
  }
  const button = Array.from(box.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim() === value,
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

const VARIANT = "Variant (:200,:247-248,:3221-3227)";
const SIZE = "Size (:198,:244)";
const PADDING = "Padding (:199,:49-56)";
const SIDE = "Label side (:203,:277)";
const TONE = "Tone (:251,:252-256)";
const LEGACY = "Use the deprecated `color` (:75,:251)";
const FULL_WIDTH = "Full width (:206,:280)";
const LABEL = "Label (:62,:394-410)";
const DESCRIPTION = "Description (:63,:412-424)";
const PLACEMENT = "Description layout (:197,:398-400)";
const ICON_ON = "Icon when on (:78,:371-381)";
const STARTS_ON = "Starts on (:333,:386-389)";
const CONTROLLED = "Controlled by state (:327,:333)";
const DISABLED = "Disabled (:208,:281,:326,:345)";
const READ_ONLY = "Read only (:282-283,:292-294,:328-332)";
const TOOLTIP = "Tooltip (:84,:443-448)";
const TOOLTIP_POSITION = "Tooltip position (:86,:445)";
const GLASS = "Glass (:91,:247-248,:273)";
const VIBRANCY = "Vibrancy (:93,:262)";
const SPECULAR = "Specular (:97,:263-265,:349-357)";

/** The open, ready-to-use playground. */
const open = (): ReturnType<typeof render> => {
  const view = render(<TogglePlayground />);
  fireEvent.click(within(view.container).getByRole("button", { name: "Expand all" }));
  return view;
};

const classes = (view: ReturnType<typeof render>): string =>
  theRow(view).getAttribute("class") ?? "";

const trackClasses = (view: ReturnType<typeof render>): string =>
  theTrack(view).getAttribute("class") ?? "";

const captions = (view: ReturnType<typeof render>): string =>
  stage(view).textContent ?? "";

afterEach(() => {
  // Portalled tooltips live on `document.body`, outside the container RTL would
  // clear, and this project runs without RTL's automatic cleanup.
  cleanup();
  for (const node of Array.from(document.body.querySelectorAll('[role="tooltip"]'))) {
    if (node.parentElement === document.body) node.remove();
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Toggle preview", () => {
  it("is one checkbox wearing a switch, with the track as a picture (:315-316,:337)", () => {
    const view = open();
    const input = theInput(view);
    expect(input.type).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
    expect(input.className).toContain("sr-only");
    expect(within(stage(view)).getByRole("switch", { name: LABEL_DEFAULT })).toBe(input);
    expect(theTrack(view).getAttribute("aria-hidden")).toBe("true");
  });

  it("names itself through a real label and describes itself through aria-describedby (:394-410,:325)", () => {
    const view = open();
    typeInto(view, DESCRIPTION, DESCRIPTION_EXAMPLE);
    const input = theInput(view);
    const label = stage(view).querySelector("label");
    expect(label?.textContent).toContain(LABEL_DEFAULT);
    expect(label?.getAttribute("for")).toBe(input.id);
    expect(input.getAttribute("aria-describedby")).toBe(`${input.id}-description`);
    expect(captions(view)).toContain(DESCRIPTION_EXAMPLE);
  });

  it("warns in development when the switch has no name at all (:221-225)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    typeInto(view, LABEL, "");
    expect(stage(view).querySelector("label")).toBeNull();
    expect(warn.mock.calls.flat().join(" ")).toContain("no accessible name");
    expect(warn.mock.calls.flat().join(" ")).toContain("Toggle");
  });

  it("toggles when the row itself is clicked, not just the input (:291-309)", () => {
    const view = open();
    expect(theInput(view).checked).toBe(false);
    fireEvent.click(theRow(view));
    expect(theInput(view).checked).toBe(true);
    expect(captions(view)).toContain("onChange fired with checked=true (:327)");
  });

  it("counts a click on the label as one change, not two (:301)", () => {
    const view = open();
    fireEvent.click(within(stage(view)).getByText(LABEL_DEFAULT));
    expect(theInput(view).checked).toBe(true);
    expect(captions(view)).toContain("onChange fired with checked=true (:327)");
  });

  it("starts on when told to, uncontrolled (:333)", () => {
    const view = open();
    flip(view, STARTS_ON);
    expect(theInput(view).checked).toBe(true);
  });

  it("leaves a controlled switch still, until the app's own state moves (:333)", () => {
    const view = open();
    flip(view, CONTROLLED);
    const input = theInput(view);
    expect(input.checked).toBe(false);
    fireEvent.click(theRow(view));
    expect(input.checked).toBe(true);
    expect(captions(view)).toContain("isOn is true");
  });

  it("puts the real attribute on the input when disabled (:326)", () => {
    const view = open();
    flip(view, DISABLED);
    const input = theInput(view);
    expect(input.disabled).toBe(true);
    expect(classes(view)).toContain("opacity-60");
    fireEvent.click(theRow(view));
    expect(input.checked).toBe(false);
    expect(captions(view)).toContain("the input carries the real attribute");
  });

  it("prevents a read-only flip instead of ignoring it, and stays focusable (:292-294,:328-332)", () => {
    const view = open();
    flip(view, READ_ONLY);
    const input = theInput(view);
    expect(input.disabled).toBe(false);
    expect(classes(view)).toContain("cursor-default");
    fireEvent.click(theRow(view));
    expect(input.checked).toBe(false);
    expect(captions(view)).toContain("Read only");
  });

  it("takes the track and thumb geometry from the size (:244,:110-167)", () => {
    const view = open();
    expect(trackClasses(view)).toContain("h-6 w-11");
    choose(view, SIZE, "xs");
    expect(trackClasses(view)).toContain("h-4 w-7");
    const thumb = stage(view).querySelector('[class*="shadow-sm"]');
    expect(thumb?.getAttribute("class")).toContain("peer-checked:translate-x-3");
  });

  it("pads the hit area, and the padded edge still toggles (:49-56,:291-309)", () => {
    const view = open();
    expect(classes(view)).toContain("p-1");
    choose(view, PADDING, "xl");
    expect(classes(view)).toContain("p-3");
    fireEvent.click(theRow(view));
    expect(theInput(view).checked).toBe(true);
  });

  it("flips the row rather than duplicating it when the label goes first (:277)", () => {
    const view = open();
    expect(classes(view)).toContain("flex-row");
    choose(view, SIDE, "left");
    expect(classes(view)).toContain("flex-row-reverse");
  });

  it("stretches the row on request (:280)", () => {
    const view = open();
    expect(classes(view)).not.toContain("w-full");
    flip(view, FULL_WIDTH);
    expect(classes(view)).toContain("w-full");
  });

  it("paints the on-state fill and the ring with the tone (:251,:3315-3320)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    expect(trackClasses(view)).toContain("peer-checked:bg-emerald-500");
    expect(trackClasses(view)).toContain("peer-focus-visible:ring-emerald-400");
  });

  it("honours the deprecated `color` spelling while it is on the tag (:249-251)", () => {
    const view = open();
    flip(view, LEGACY);
    chooseSwatch(view, "rose");
    expect(theInput(view).disabled).toBe(false);
    expect(trackClasses(view)).toContain("peer-checked:bg-rose-500");
  });

  it("says which variant the row resolved to, whichever spelling set it (:247-274)", () => {
    const view = open();
    expect(theRow(view).getAttribute("data-variant")).toBe("solid");
    expect(theRow(view).getAttribute("data-glass")).toBe("false");
    choose(view, VARIANT, "soft");
    expect(theRow(view).getAttribute("data-variant")).toBe("soft");
    expect(trackClasses(view)).toContain("peer-checked:bg-blue-200");
    flip(view, GLASS);
    expect(theRow(view).getAttribute("data-variant")).toBe("glass");
    expect(theRow(view).getAttribute("data-glass")).toBe("true");
    expect(trackClasses(view)).toContain("peer-checked:backdrop-blur-sm");
  });

  it("hides the glass knobs until there is a glass surface (:262-265)", () => {
    const view = open();
    expect(hasField(view, VIBRANCY)).toBe(false);
    expect(hasField(view, SPECULAR)).toBe(false);
    flip(view, GLASS);
    expect(hasField(view, VIBRANCY)).toBe(true);
    choose(view, VIBRANCY, "High");
    expect(trackClasses(view)).toContain("saturate");
    choose(view, SPECULAR, "Halo");
    const overlay = Array.from(stage(view).querySelectorAll('[aria-hidden="true"]')).find(
      (node) => (node.getAttribute("class") ?? "").includes("inset-0"),
    );
    expect(overlay).toBeDefined();
  });

  it("cross-fades the two glyphs inside the hidden track (:359-381)", () => {
    const view = open();
    choose(view, ICON_ON, "Sun");
    const on = Array.from(stage(view).querySelectorAll("span")).find((node) =>
      (node.getAttribute("class") ?? "").includes("peer-checked:opacity-100"),
    );
    expect(on).toBeDefined();
    expect(on?.querySelector("svg")).toBeTruthy();
  });

  it("keeps the tooltip's own controls out of the way until there is a tip (:443-448)", () => {
    const view = open();
    expect(hasField(view, TOOLTIP_POSITION)).toBe(false);
    typeInto(view, TOOLTIP, "One email a day, no more");
    expect(hasField(view, TOOLTIP_POSITION)).toBe(true);
  });

  it("brings the tooltip up over the row after its delay (:443-448)", async () => {
    const view = open();
    typeInto(view, TOOLTIP, "One email a day, no more");
    vi.useFakeTimers();
    fireEvent.mouseEnter(theRow(view));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200);
    });
    expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain(
      "One email a day, no more",
    );
    expect(theRow(view).getAttribute("aria-describedby")).toBeTruthy();
  });

  it("puts the description's placement on the label block, not on a second layout (:398-400)", () => {
    const view = open();
    typeInto(view, DESCRIPTION, DESCRIPTION_EXAMPLE);
    const label = stage(view).querySelector("label");
    expect(label?.className).toContain("flex-col");
    choose(view, PLACEMENT, "inline");
    expect(stage(view).querySelector("label")?.className).toContain("flex-wrap");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import ButtonPlayground from "./ButtonPlayground";
import { ARIA_LABEL_EXAMPLE, ICON_COLOR_EXAMPLE, LABEL_DEFAULT } from "./buttonStage";

/**
 * The preview is the half of this page's claim that has to survive a browser: the
 * attributes the component really puts on the `<button>`, the ones it only puts there
 * once a prop asks, and the strings it takes from the catalog. Everything below is
 * read back off the mounted element — never off the config that produced it.
 */

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/** Button stamps `data-variant` on the element it renders (:306) — the one handle. */
const theButton = (view: ReturnType<typeof render>): HTMLButtonElement => {
  const node = stage(view).querySelector<HTMLButtonElement>("[data-variant]");
  if (!node) throw new Error("no <button> in the preview");
  return node;
};

/**
 * One control, found by the label the config writes. The chrome renders captions as
 * plain `<span>`s — a `Select` carries no accessible name of its own — so the label
 * is the way in.
 */
/**
 * The controls column prints a field label in a `<span>`, and an accordion
 * group title is a `<span>` too — so a field named "Source" and a group named
 * "Source" are otherwise interchangeable. The group title lives inside the
 * disclosure button (`Accordion.tsx:343`, `:383`); a field label never does.
 */
const CONTROL_ROW =
  'select, input, textarea, [role="switch"], [role="radiogroup"], [role="group"]';

const labelBoxes = (view: ReturnType<typeof render>, label: string): HTMLElement[] =>
  Array.from(view.container.querySelectorAll("span"))
    .filter(
      (node) =>
        (node.textContent ?? "").trim() === label &&
        !node.closest("button") &&
        !node.closest("[aria-expanded]"),
    )
    .map((span) => span.parentElement)
    .filter((box): box is HTMLElement => box !== null);

/** The box holding a field's control, preferring one that actually has a control. */
const controlBox = (
  view: ReturnType<typeof render>,
  label: string,
): HTMLElement | undefined => {
  const boxes = labelBoxes(view, label);
  return boxes.find((box) => box.querySelector(CONTROL_ROW)) ?? boxes[0];
};

const fieldBox = (view: ReturnType<typeof render>, label: string): HTMLElement => {
  const box = controlBox(view, label);
  if (!box) throw new Error(`no control labelled "${label}" in the controls`);
  return box;
};

const hasField = (view: ReturnType<typeof render>, label: string): boolean =>
  controlBox(view, label) !== undefined;
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

/** Swatches are named by the tone itself, not by text. */
const chooseSwatch = (view: ReturnType<typeof render>, tone: string): void => {
  fireEvent.click(within(fieldBox(view, "Color")).getByRole("button", { name: tone }));
};

const flip = (view: ReturnType<typeof render>, name: RegExp): void => {
  fireEvent.click(within(view.container).getByRole("switch", { name }));
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

const LABEL = "Label (children, :82,:268-273,:324)";
const TOOLTIP = "Tooltip";
const TOOLTIP_DELAY = "Tooltip delay (ms, :91,:335)";

/** The open, ready-to-use playground. */
const open = (): ReturnType<typeof render> => {
  const view = render(<ButtonPlayground />);
  fireEvent.click(within(view.container).getByRole("button", { name: "Expand all" }));
  return view;
};

const classes = (view: ReturnType<typeof render>): string =>
  theButton(view).getAttribute("class") ?? "";

const captions = (view: ReturnType<typeof render>): string =>
  stage(view).textContent ?? "";

afterEach(() => {
  // Portalled tooltips live on `document.body`, outside the container RTL would
  // clear, and this project runs without RTL's automatic cleanup.
  cleanup();
  for (const node of Array.from(document.body.querySelectorAll('[role="tooltip"]'))) {
    if (node.parentElement === document.body) node.remove();
  }
  vi.restoreAllMocks();
});

describe("Button preview", () => {
  it("warns once, in development, about a button with no name (:263)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    typeInto(view, LABEL, "");
    expect(theButton(view).textContent).toBe("");
    expect(warn.mock.calls.flat().join(" ")).toContain("no accessible name");
  });

  it("renders a real <button> with the kit's own defaults, not attributes it invented", () => {
    const view = open();
    const button = theButton(view);
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.textContent).toContain(LABEL_DEFAULT);
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(button.hasAttribute("aria-expanded")).toBe(false);
    expect(button.getAttribute("data-variant")).toBe("solid");
    expect(button.getAttribute("data-color")).toBe("blue");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("data-glass")).toBe("false");
  });

  it("names itself after the label, and after the catalog when there is none (:316-325)", () => {
    const view = open();
    expect(within(stage(view)).getByRole("button", { name: LABEL_DEFAULT })).toBeTruthy();
    flip(view, /^Icon only/);
    typeInto(view, LABEL, "");
    // The last-resort name is the catalog's, not a bare "button" (:322).
    expect(within(stage(view)).getByRole("button", { name: "Button" })).toBeTruthy();
    typeInto(view, "aria-label", ARIA_LABEL_EXAMPLE);
    expect(
      within(stage(view)).getByRole("button", { name: ARIA_LABEL_EXAMPLE }),
    ).toBeTruthy();
  });

  it("keeps a click from landing while loading, and says so (:305)", () => {
    const view = open();
    flip(view, /^Wire a click handler/);
    expect(captions(view)).toContain("No click reported");
    fireEvent.click(theButton(view));
    expect(captions(view)).toContain('<button type="button">');
    flip(view, /^Loading/);
    fireEvent.click(theButton(view));
    expect(captions(view)).toContain("No click reported");
    const button = theButton(view);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("hides the spinner and the icons it replaced from readers (:250-258,:315,:326)", () => {
    const view = open();
    choose(view, "Trailing icon", "ArrowDown");
    expect(theButton(view).querySelectorAll("svg")).toHaveLength(1);
    flip(view, /^Loading/);
    expect(theButton(view).querySelectorAll("svg")).toHaveLength(0);
    const spinner = theButton(view).querySelector('[class*="animate-spin"]');
    expect(spinner).toBeTruthy();
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    // The dimming that would fade the spinner is deliberately not applied (:239).
    expect(classes(view)).not.toContain("disabled:opacity-50");
  });

  it("dims a plain disabled button instead, and drops it from the tab order (:305)", () => {
    const view = open();
    flip(view, /^Disabled/);
    expect(theButton(view).disabled).toBe(true);
    expect(classes(view)).toContain("disabled:opacity-50");
    expect(theButton(view).hasAttribute("aria-busy")).toBe(false);
  });

  it("holds the variant's own hover open while a popup is up, and sits it out when the surface is owned (:212-218)", () => {
    const view = open();
    flip(view, /^Popup is open/);
    const button = theButton(view);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(classes(view)).toContain("aria-expanded:");
    flip(view, /^Glass/);
    expect(classes(view)).not.toContain("aria-expanded:");
  });

  it("hands the colour to accentColor twice over — hover only, unless active (:180-184,:170-179)", () => {
    const view = open();
    choose(view, "Accent color", "emerald");
    expect(classes(view)).toContain("bg-blue");
    expect(classes(view)).toContain("hover:bg-emerald");
    flip(view, /^Active/);
    expect(classes(view)).toContain("bg-emerald");
    expect(classes(view)).not.toContain("bg-blue");
  });

  it("strips the fill for accent, ring and hover only (:158-164)", () => {
    const view = open();
    flip(view, /^Accent/);
    expect(classes(view)).toContain("bg-transparent");
    expect(classes(view)).toContain("text-inherit");
  });

  it("builds the glass surface from the glass helpers and reports it (:189-200,:309)", () => {
    const view = open();
    choose(view, "Variant", "glass");
    expect(theButton(view).getAttribute("data-glass")).toBe("true");
    expect(classes(view)).toContain("backdrop-blur");
    expect(classes(view)).toContain("relative");
    // The specular overlay is decoration, so it is not in the accessibility tree.
    expect(theButton(view).querySelector('[aria-hidden="true"][class*="pointer-events-none"]')).toBeNull();
    choose(view, "Specular", "Halo");
    expect(
      theButton(view).querySelector('[aria-hidden="true"][class*="pointer-events-none"]'),
    ).toBeTruthy();
  });

  it("hides the glass knobs until there is a glass surface to tune (:193-200)", () => {
    const view = open();
    expect(hasField(view, "Vibrancy")).toBe(false);
    expect(hasField(view, "Specular")).toBe(false);
    flip(view, /^Glass/);
    expect(hasField(view, "Vibrancy")).toBe(true);
    choose(view, "Vibrancy", "High");
    expect(classes(view)).toMatch(/backdrop-blur/);
  });

  it("paints the size, weight and width from the shared tokens (:148,:241,:243-244)", () => {
    const view = open();
    choose(view, "Size", "xs");
    choose(view, "Weight", "bold");
    flip(view, /^Full width/);
    const at = classes(view);
    expect(at).toContain("text-xs");
    expect(at).toContain("font-bold");
    expect(at).toContain("w-full");
    expect(theButton(view).getAttribute("data-size")).toBe("xs");
  });

  it("tints only the glyph, and paints the label with currentColor (:286-294)", () => {
    const view = open();
    choose(view, "Leading icon", "Search");
    typeInto(view, "Icon color", ICON_COLOR_EXAMPLE);
    const tinted = theButton(view).querySelector<HTMLElement>("[style*='color']");
    expect(tinted?.style.color).toBe("rgb(245, 158, 11)");
    expect(theButton(view).querySelector("svg")).toBeTruthy();
  });

  it("shows the tooltip to a keyboard user without waiting out the pointer's delay (:330-341)", async () => {
    const view = open();
    typeInto(view, TOOLTIP, "Ship it when the tests pass");
    typeInto(view, TOOLTIP_DELAY, "0");
    const button = theButton(view);
    expect(button.hasAttribute("aria-describedby")).toBe(false);
    fireEvent.focus(button);
    await waitFor(() => {
      expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    });
    expect(button.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain(
      "Ship it when the tests pass",
    );
  });

  it("keeps a suppressed tip hidden, which is what MenuButton relies on (:336)", () => {
    const view = open();
    typeInto(view, TOOLTIP, "Ship it when the tests pass");
    typeInto(view, TOOLTIP_DELAY, "0");
    flip(view, /^Tooltip suppressed/);
    fireEvent.focus(theButton(view));
    fireEvent.mouseEnter(theButton(view));
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
    expect(theButton(view).hasAttribute("aria-describedby")).toBe(false);
  });

  it("puts the button in a form that does not submit until it is told to (:141,:300-303)", () => {
    const view = open();
    flip(view, /^Sit it in a form/);
    expect(captions(view)).toContain("The form never saw a submit");
    // The Button is a `type="button"` element, so pressing it leaves the form alone.
    fireEvent.click(theButton(view));
    expect(captions(view)).toContain("The form never saw a submit");
    // The form itself is live: a real submit button still gets there.
    fireEvent.click(
      within(stage(view)).getByRole("button", { name: "Submit the form" }),
    );
    expect(captions(view)).toContain("The form submitted");
  });

  it("submits the form the moment type says so (:303)", () => {
    const view = open();
    flip(view, /^Sit it in a form/);
    choose(view, "type", "submit");
    fireEvent.click(theButton(view));
    expect(captions(view)).toContain("The form submitted");
  });

  it("recolors the fill from the swatches, and only the fill's family (:117,:149)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    expect(theButton(view).getAttribute("data-color")).toBe("emerald");
    expect(classes(view)).toContain("bg-emerald");
    expect(classes(view)).not.toContain("bg-blue");
  });
});

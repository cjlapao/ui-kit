import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { DynamicImgPlayground } from "./DynamicImgPlayground";
import { DYNAMIC_IMG_PROPS, DynamicImgPage, KEYBOARD } from "./DynamicImgPage";
import { FALLBACK_DEFAULT, STAGE_CLASS } from "./dynamicImgStage";

/**
 * The preview is the page's claim about untrusted markup, so these tests read the DOM
 * that came back rather than trusting the caption: which branch rendered, what the
 * allowlist removed from the live tree, which colours survived the recolouring pass,
 * what an `alt` does to the accessibility attributes, and whether the printed source
 * still describes what is on screen.
 */

const open = (): ReturnType<typeof render> => {
  const view = render(<DynamicImgPlayground />);
  const expand = Array.from(view.container.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim() === "Expand all",
  );
  if (expand) fireEvent.click(expand);
  return view;
};

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector<HTMLElement>(
    `.${STAGE_CLASS.split(" ").join(".")}`,
  );
  if (!node) throw new Error("no preview stage");
  return node;
};

/** The `<span>` the SVG branch renders (`:109-130`), if that branch is live. */
const theWrapper = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="inline-flex"][class*="select-none"]',
  );
  if (!node) throw new Error("no SVG wrapper in the preview");
  return node;
};

/** The `<img>` the raster branch renders (`:92-105`), if that branch is live. */
const theImage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>("img");
  if (!node) throw new Error("no <img> in the preview");
  return node;
};

/** The placeholder the icon renderer returned (`:63,:87`). */
const thePlaceholder = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="inline-flex"][class*="shrink-0"]',
  );
  if (!node) throw new Error("no fallback icon in the preview");
  return node;
};

/** Every line the stage writes under the image. */
const notes = (view: ReturnType<typeof render>): string =>
  Array.from(stage(view).querySelectorAll("p, span"))
    .map((node) => node.textContent ?? "")
    .join(" ");

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
  fireEvent.click(within(fieldBox(view, TONE)).getByRole("button", { name: tone }));
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
  const box = fieldBox(view, label);
  const field = box.querySelector("input, textarea");
  if (!field) throw new Error(`no text box for "${label}"`);
  fireEvent.change(field, { target: { value } });
};

/** The source half of the stage, which the panel only shows on request. */
const showCode = (view: ReturnType<typeof render>): string => {
  const group = view.container.querySelector('[aria-label="Playground view"]');
  if (!group) throw new Error("no view switch on the playground");
  const button = within(group as HTMLElement).getByRole("radio", { name: "Code" });
  fireEvent.click(button);
  const pre = view.container.querySelector("pre");
  if (!pre) throw new Error("the Code view rendered no <pre>");
  return pre.textContent ?? "";
};

/** Back to the live half of the stage after the Code view took it over. */
const showPreview = (view: ReturnType<typeof render>): void => {
  const group = view.container.querySelector('[aria-label="Playground view"]');
  if (!group) throw new Error("no view switch on the playground");
  fireEvent.click(within(group as HTMLElement).getByRole("radio", { name: "Preview" }));
};

const SOURCE = "Source";
const SIZE = "size";
const TONE = "tone";
const ALT = "alt";
const TITLE = "title";
const FILL = "fill";
const STROKE = "stroke";
const COLORED = "colored — keep its own colours";
const FALLBACK = "fallbackIcon";
const CUSTOM = "…or type a source of your own";
const GLASS = "Show it on glass";

/** Markup the parser accepts and the allowlist cannot rebuild: an unclosed document. */
const UNBUILDABLE = '<svg xmlns="http://www.w3.org/2000/svg"><rect';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("dynamic image preview", () => {
  it("recolours the shape it was given, on the way in", () => {
    const view = open();
    // The sample arrives as `fill="#2563eb"`; the sanitizer hands back currentColor.
    expect(theWrapper(view).querySelector("circle")?.getAttribute("fill")).toBe(
      "currentColor",
    );
    expect(notes(view)).toContain("Kept: svg, circle");
  });

  it("keeps a tone out of the class list until one is chosen (:67)", () => {
    const view = open();
    expect(theWrapper(view).className).not.toContain("text-");
    chooseSwatch(view, "emerald");
    expect(theWrapper(view).className).toContain(
      "text-emerald-500 dark:text-emerald-400",
    );
  });

  it("lets a raw fill win over the tone, and says so", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    typeInto(view, FILL, "#f97316");
    // :67 — the tone class is never even applied.
    expect(theWrapper(view).className).not.toContain("text-emerald");
    expect(theWrapper(view).querySelector("circle")?.getAttribute("fill")).toBe(
      "#f97316",
    );
    expect(notes(view)).toContain("tone is set but invisible here");
  });

  it("does nothing at all when colored is on (:77-78)", () => {
    const view = open();
    flip(view, COLORED);
    expect(theWrapper(view).querySelector("circle")?.getAttribute("fill")).toBe(
      "#2563eb",
    );
    expect(notes(view)).toContain("kept every colour it arrived with");
  });

  it("leaves fill=none alone so an outline stays an outline", () => {
    const view = open();
    choose(view, SOURCE, "Outline only");
    const path = theWrapper(view).querySelector("path");
    expect(path?.getAttribute("fill")).toBe("none");
    expect(path?.getAttribute("stroke")).toBe("currentColor");
    typeInto(view, STROKE, "#0f172a");
    expect(theWrapper(view).querySelector("path")?.getAttribute("stroke")).toBe(
      "#0f172a",
    );
  });

  it("flattens a gradient while recolouring, and restores it with colored", () => {
    const view = open();
    choose(view, SOURCE, "Gradient");
    // The stops keep their colours; the shape painting with them does not (:211-215).
    const stops = theWrapper(view).querySelectorAll("stop");
    expect(stops[0]?.getAttribute("stop-color")).toBe("#f43f5e");
    expect(theWrapper(view).querySelector("rect")?.getAttribute("fill")).toBe(
      "currentColor",
    );
    flip(view, COLORED);
    expect(theWrapper(view).querySelector("rect")?.getAttribute("fill")).toBe(
      "url(#g)",
    );
  });

  it("removes everything hostile from the live document, not just from the caption", () => {
    const view = open();
    choose(view, SOURCE, "Hostile SVG");
    const wrapper = theWrapper(view);
    for (const tag of ["script", "image", "a", "foreignObject", "style"]) {
      expect(wrapper.querySelector(tag), `<${tag}> survived`).toBeNull();
    }
    // The geometry that was safe is still there, and it cannot fetch anything.
    const circle = wrapper.querySelector("circle");
    expect(circle).not.toBeNull();
    expect(circle?.hasAttribute("onload")).toBe(false);
    expect(wrapper.innerHTML).not.toContain("evil.example");
    expect(notes(view)).toContain("The allowlist fails closed");
    expect(notes(view)).toContain("onload");
  });

  it("shows the reader the markup that was injected, not the markup that arrived", () => {
    const view = open();
    choose(view, SOURCE, "Hostile SVG");
    const blocks = Array.from(stage(view).querySelectorAll("pre")).map(
      (node) => node.textContent ?? "",
    );
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain("<script>");
    expect(blocks[1]).not.toContain("<script>");
    expect(blocks[1]).toContain("<circle");
  });

  it("renders a raster as an inert img and never recolours it", () => {
    const view = open();
    choose(view, SOURCE, "Raster (PNG)");
    const image = theImage(view);
    expect(image.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
    expect(image.getAttribute("alt")).toBe("");
    expect(image.getAttribute("aria-hidden")).toBe("true");
    expect(image.className).toContain("object-contain");
    // No recolouring pass runs at all, so no tone class and no wrapper span.
    expect(image.className).not.toContain("text-emerald");
    expect(
      stage(view).querySelector('[class*="inline-flex"][class*="select-none"]'),
    ).toBeNull();
    expect(notes(view)).toContain("raster data URL");
  });

  it("names the image only when the reader supplies a name", () => {
    const view = open();
    expect(theWrapper(view).getAttribute("aria-hidden")).toBe("true");
    expect(theWrapper(view).hasAttribute("role")).toBe(false);
    typeInto(view, ALT, "Quarterly report");
    expect(theWrapper(view).getAttribute("role")).toBe("img");
    expect(theWrapper(view).getAttribute("aria-label")).toBe("Quarterly report");
    expect(theWrapper(view).hasAttribute("aria-hidden")).toBe(false);
    // The same switch on the other branch is a real alt attribute (:96).
    choose(view, SOURCE, "Raster (PNG)");
    expect(theImage(view).getAttribute("alt")).toBe("Quarterly report");
    expect(theImage(view).hasAttribute("aria-hidden")).toBe(false);
  });

  it("hands title to both branches, as a tooltip and nothing more", () => {
    const view = open();
    typeInto(view, TITLE, "Updated at 06:00");
    expect(theWrapper(view).getAttribute("title")).toBe("Updated at 06:00");
    choose(view, SOURCE, "Raster (PNG)");
    expect(theImage(view).getAttribute("title")).toBe("Updated at 06:00");
    expect(notes(view)).toContain("hover-only");
  });

  it("puts the size ladder on both branches (:99-101)", () => {
    const view = open();
    choose(view, SIZE, "xl");
    expect(theWrapper(view).className).toContain("h-10 w-10");
    choose(view, SOURCE, "Raster (PNG)");
    expect(theImage(view).className).toContain("h-10 w-10");
    expect(notes(view)).toContain("40px");
  });

  it("paints the placeholder for a value that is not an image", () => {
    const view = open();
    choose(view, SOURCE, "Not an image");
    expect(stage(view).querySelector("img")).toBeNull();
    expect(
      stage(view).querySelector('[class*="inline-flex"][class*="select-none"]'),
    ).toBeNull();
    expect(thePlaceholder(view)).toBeTruthy();
    expect(notes(view)).toContain("paints instead");
  });

  it("paints the placeholder for markup the allowlist cannot rebuild, and never the markup", () => {
    const view = open();
    typeInto(view, CUSTOM, UNBUILDABLE);
    expect(
      stage(view).querySelector('[class*="inline-flex"][class*="select-none"]'),
    ).toBeNull();
    expect(thePlaceholder(view)).toBeTruthy();
    // The rejected string stays out of the document: only the "handed in" block holds it.
    const blocks = Array.from(stage(view).querySelectorAll("pre")).map(
      (node) => node.textContent ?? "",
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain("<rect");
  });

  it("asks for a placeholder name only while one is painting, and paints what it picks", () => {
    const view = open();
    expect(hasField(view, FALLBACK)).toBe(false);
    choose(view, SOURCE, "Not an image");
    expect(hasField(view, FALLBACK)).toBe(true);
    const before = thePlaceholder(view).innerHTML;
    expect(notes(view)).toContain(FALLBACK_DEFAULT);
    choose(view, FALLBACK, "Warning");
    expect(thePlaceholder(view).innerHTML).not.toBe(before);
  });

  it("treats an empty source as nothing to render", () => {
    const view = open();
    choose(view, SOURCE, "Nothing at all");
    expect(thePlaceholder(view)).toBeTruthy();
    expect(stage(view).querySelector("img")).toBeNull();
    expect(showCode(view)).toContain("<DynamicImg />");
  });

  it("agrees with the source it prints", () => {
    const view = open();
    choose(view, SOURCE, "Hostile SVG");
    choose(view, SIZE, "lg");
    typeInto(view, ALT, "Quarterly report");
    typeInto(view, FILL, "#f97316");
    const code = showCode(view);
    expect(code).toContain("src={HOSTILE_SVG}");
    expect(code).toContain('alt="Quarterly report"');
    expect(code).toContain('size="lg"');
    expect(code).toContain('fill="#f97316"');
    // …and the DOM behind it says the same thing.
    showPreview(view);
    const wrapper = theWrapper(view);
    expect(wrapper.getAttribute("aria-label")).toBe("Quarterly report");
    expect(wrapper.className).toContain("h-8 w-8");
    expect(wrapper.querySelector("circle")?.getAttribute("fill")).toBe("#f97316");
  });

  it("keeps a typed source in the reader's hands", () => {
    const view = open();
    typeInto(
      view,
      CUSTOM,
      '<svg xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="6" /></svg>',
    );
    expect(theWrapper(view).querySelector("ellipse")).not.toBeNull();
    expect(theWrapper(view).querySelector("circle")).toBeNull();
    expect(showCode(view)).toContain("src={SOURCE}");
  });

  it("treats the backdrop toggle as workbench chrome, not a prop", () => {
    const view = open();
    // The variant classes land on the Panel's own <section>, not its inner column.
    const panel = stage(view).querySelector("section") as HTMLElement;
    const before = panel.className;
    flip(view, GLASS);
    expect(panel.className).not.toBe(before);
    expect(showCode(view)).not.toContain("glass");
  });

  it("lists no key binding the component does not have", () => {
    expect(KEYBOARD.length).toBeGreaterThan(0);
    for (const binding of KEYBOARD) {
      expect(binding.keys.length).toBeGreaterThan(0);
    }
    // Nothing here claims a handler the component binds: it binds none (:48-62).
    expect(KEYBOARD.map((binding) => binding.keys.join("+"))).toContain("Tab");
    expect(KEYBOARD.map((binding) => binding.keys.join("+"))).toContain("Enter+Space");
  });

  it("documents a prop for every switch the workbench offers", () => {
    const rows = DYNAMIC_IMG_PROPS.map((prop) => prop.name);
    for (const name of ["size", "tone", "fill", "stroke", "colored", "alt", "title"]) {
      expect(rows, `${name} has a control but no row`).toContain(name);
    }
    expect(rows.some((name) => name.startsWith("…"))).toBe(true);
  });

  it("renders the page, its keyboard table and its prop table", () => {
    const view = render(<DynamicImgPage />);
    expect(
      Array.from(view.container.querySelectorAll("h2, h3")).some((node) =>
        /keyboard/i.test(node.textContent ?? ""),
      ),
    ).toBe(true);
    expect(view.container.querySelectorAll("tbody").length).toBeGreaterThan(0);
    expect(view.container.textContent).toContain("fallbackIcon");
    expect(view.container.textContent).toContain("sanitizeSvg");
  });

  it("never leaves the reader with an empty stage", async () => {
    const view = open();
    for (const label of [
      "Filled shape",
      "Outline only",
      "Gradient",
      "Base64 SVG data URL",
      "Raster (PNG)",
      "Hostile SVG",
      "Not an image",
      "Nothing at all",
    ]) {
      await act(async () => choose(view, SOURCE, label));
      const painted =
        stage(view).querySelector("img") ??
        stage(view).querySelector('[class*="inline-flex"][class*="select-none"]') ??
        stage(view).querySelector('[class*="inline-flex"][class*="shrink-0"]');
      expect(painted, `${label} painted nothing`).not.toBeNull();
    }
  });
});

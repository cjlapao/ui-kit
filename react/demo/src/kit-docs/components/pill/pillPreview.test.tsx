import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { PillPlayground } from "./PillPlayground";
import { KEYBOARD, PillPage } from "./PillPage";
import { STAGE_CLASS } from "./pillStage";

/**
 * The preview is this page's claim about a component that renders two different
 * elements, so these tests read the DOM that came back rather than trusting the
 * caption: which element is on screen, what the keyboard can reach, which of the
 * tone's classes survived, whether the dot really dropped its children, and
 * whether the source the Code view prints still describes it.
 */

const open = (): ReturnType<typeof render> => {
  const view = render(<PillPlayground />);
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

/** The pill itself — `shared` carries these two utilities whichever element rendered (:277). */
const thePill = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="max-w-full"][class*="leading-none"]',
  );
  if (!node) throw new Error("no pill in the preview");
  return node;
};

/** The dot branch's element (:224-240), which shares none of those utilities. */
const theDot = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="inline-block"][class*="shrink-0"][class*="rounded-full"]',
  );
  if (!node) throw new Error("no dot in the preview");
  return node;
};

/**
 * The specular overlay, which exists only when the resolver returned classes
 * (:200-208). `rounded-[inherit]` is its own signature — `pointer-events-none`
 * also appears in the remove button's disabled state, so it proves nothing.
 */
const theOverlay = (view: ReturnType<typeof render>): HTMLElement | null =>
  stage(view).querySelector<HTMLElement>('[class*="rounded-[inherit]"]');

const theRemoveButton = (view: ReturnType<typeof render>): HTMLElement => {
  const node = within(thePill(view)).queryByRole("button", {
    name: /remove|supprimer|entfernen|quitar|remover/i,
  });
  if (!node) throw new Error("no remove button in the preview");
  return node as HTMLElement;
};

/** Every line the stage writes under the pill. */
const notes = (view: ReturnType<typeof render>): string =>
  Array.from(stage(view).querySelectorAll("p"))
    .map((node) => node.textContent ?? "")
    .join(" ");

/** Neither of the page's tables carries an accessible name, so they are found by header. */
const tableWithHeader = (
  view: ReturnType<typeof render>,
  header: string,
): HTMLElement => {
  const table = Array.from(view.container.querySelectorAll("table")).find(
    (node) => (node.querySelector("thead th")?.textContent ?? "").trim() === header,
  );
  if (!table) throw new Error(`no table headed "${header}"`);
  return table as HTMLElement;
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
  fireEvent.click(within(group as HTMLElement).getByRole("radio", { name: "Code" }));
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

const VARIANT = "variant (:79-80,:129)";
const TONE = "tone (:78,:128)";
const SIZE = "size (:81-82,:130)";
const CORNER = "corner (:83-84,:131)";
const LABEL = "The label — children (:147,:244-253)";
const UPPERCASE = "uppercase (:85,:286)";
const ICON = "icon (:95-96,:246-250)";
const TRAILING = "trailingIcon (:97-98,:254-258)";
const MAX_WIDTH = "maxWidth (:118-119,:293-295)";
const DOT = "dot — a bare status dot (:99-103,:218-242)";
const DOT_LABEL = "label — names the dot (:120-124,:236-238)";
const PULSE = "pulse (:104-110,:285)";
const CLICK = "onClick — makes it a button (:115-116,:299-316)";
const REMOVE = "onRemove — adds the remove button (:111-112,:259-273)";
const REMOVE_LABEL = "removeLabel (:113-114,:268)";
const DISABLED = "disabled (:117,:287)";
const OPACITY = "glassOpacity (:86-87,:133)";
const VIBRANCY = "vibrancy (:88-89,:134)";
const SPECULAR = "specularMode (:90-94,:197-198)";
const LOCALE = "Preview locale (not a prop)";
const BACKDROP = "Give it something to see through (not a prop)";

afterEach(() => {
  cleanup();
});

describe("pill preview", () => {
  it("renders a label, not a control, at rest (:318-325)", () => {
    const view = open();
    const pill = thePill(view);
    expect(pill.tagName).toBe("SPAN");
    expect(within(pill).queryByRole("button")).toBeNull();
    expect(pill.hasAttribute("tabindex")).toBe(false);
    expect(pill.hasAttribute("aria-label")).toBe(false);
    expect(pill.textContent).toBe("Operational");
    expect(notes(view)).toContain("A <span>");
    expect(notes(view)).toContain("hover only answers to onClick");
  });

  it("swaps in a real button the moment onClick is set (:299-316)", () => {
    const view = open();
    flip(view, CLICK);
    const pill = thePill(view);
    expect(pill.tagName).toBe("BUTTON");
    expect(pill.getAttribute("type")).toBe("button");
    expect(pill.className).toContain("cursor-pointer");
    expect(pill.className).toContain("focus-visible:ring-2");
    expect(pill.className).toContain("focus-visible:ring-current");
    expect(notes(view)).toContain('A real <button type="button">');
  });

  it("only lets the tone answer to the cursor once there is a click to make (:282)", () => {
    const view = open();
    // Soft, blue: the theme's hover step is `hover:bg-blue-100`.
    expect(thePill(view).className).not.toContain("hover:bg-blue-100");
    flip(view, CLICK);
    expect(thePill(view).className).toContain("hover:bg-blue-100");
  });

  it("nests the remove button as its own named focus stop (:259-273)", () => {
    const view = open();
    flip(view, REMOVE);
    const button = theRemoveButton(view);
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-label")).toBe("Remove");
    expect(button.className).toContain("focus-visible:ring-1");
    expect(button.className).toContain("-mr-1");
    // The pill around it is still a span: a removable label is not a button.
    expect(thePill(view).tagName).toBe("SPAN");
    expect(notes(view)).toContain("second, nested focus stop");
  });

  it("asks the catalog for the remove name, and stops when the caller gives one (:268)", () => {
    const view = open();
    flip(view, REMOVE);
    expect(theRemoveButton(view).getAttribute("aria-label")).toBe("Remove");

    choose(view, LOCALE, "fr");
    expect(theRemoveButton(view).getAttribute("aria-label")).toBe("Supprimer");
    expect(notes(view)).toContain("Supprimer");
    expect(notes(view)).toContain("builtIn/fr.ts:346-348");

    typeInto(view, REMOVE_LABEL, "Remove filter");
    expect(theRemoveButton(view).getAttribute("aria-label")).toBe("Remove filter");
    expect(notes(view)).toContain("removeLabel wins over the catalog");

    choose(view, LOCALE, "de");
    expect(theRemoveButton(view).getAttribute("aria-label")).toBe("Remove filter");
  });

  it("removes without activating the pill, and reports both separately (:263-267)", () => {
    const view = open();
    flip(view, CLICK);
    flip(view, REMOVE);
    fireEvent.click(theRemoveButton(view));
    expect(stage(view).querySelector('[data-report="remove"]')).not.toBeNull();
    expect(stage(view).querySelector('[data-report="click"]')).toBeNull();
    fireEvent.click(thePill(view));
    expect(stage(view).querySelector('[data-report="click"]')).not.toBeNull();
  });

  it("renders a dot with no name as decoration, and names it on request (:236-238)", () => {
    const view = open();
    flip(view, DOT);
    const dot = theDot(view);
    expect(dot.tagName).toBe("SPAN");
    expect(dot.getAttribute("aria-hidden")).toBe("true");
    expect(dot.hasAttribute("role")).toBe(false);
    expect(dot.textContent).toBe("");
    // The label the pill was carrying has been dropped, not hidden.
    expect(stage(view).textContent).not.toContain("Operational");

    typeInto(view, DOT_LABEL, "Degraded");
    expect(theDot(view).getAttribute("role")).toBe("img");
    expect(theDot(view).getAttribute("aria-label")).toBe("Degraded");
    expect(theDot(view).hasAttribute("aria-hidden")).toBe(false);
    expect(notes(view)).toContain("role=\"img\"");
  });

  it("keeps the dot on its own size ladder rather than the pill's (:59-66,:227)", () => {
    const view = open();
    choose(view, SIZE, "xl");
    flip(view, DOT);
    const dot = theDot(view);
    expect(dot.className).toContain("h-3.5");
    expect(dot.className).toContain("w-3.5");
    expect(dot.className).not.toContain("h-8");
    expect(dot.className).not.toContain("px-5");
  });

  it("gives a glass pill its blur, its saturation and its highlight (:185-208)", () => {
    const view = open();
    choose(view, VARIANT, "liquid-glass");
    const pill = thePill(view);
    expect(pill.className).toContain("backdrop-blur-md");
    expect(pill.className).toContain("relative overflow-hidden");
    expect(pill.className).toContain("backdrop-saturate-[1.2]");
    expect(pill.className).toContain("bg-blue-200/65");
    expect(pill.className).toContain("border border-white/50");
    // liquid-glass resolves the highlight to classic on its own (:197-198).
    const overlay = theOverlay(view);
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute("aria-hidden")).toBe("true");
    expect(overlay?.className).toContain("rounded-[inherit]");
  });

  it("makes plain glass the lighter of the pair, down to the missing highlight", () => {
    const view = open();
    choose(view, VARIANT, "glass");
    const pill = thePill(view);
    expect(pill.className).toContain("backdrop-blur-sm");
    expect(theOverlay(view)).toBeNull();
    expect(notes(view)).toContain("no overlay element exists at all");

    choose(view, SPECULAR, "Halo");
    expect(theOverlay(view)?.className).toContain("radial-gradient");

    choose(view, SPECULAR, "None");
    expect(theOverlay(view)).toBeNull();
  });

  it("lets the two glass knobs speak for themselves (:191-192 ← glass.ts:98-130,:223-233)", () => {
    const view = open();
    choose(view, VARIANT, "glass");
    choose(view, OPACITY, "Clear");
    expect(thePill(view).className).toContain("bg-blue-200/30");
    choose(view, VIBRANCY, "High");
    expect(thePill(view).className).toContain("backdrop-saturate-[1.4]");
  });

  it("paints the opaque variants straight from the theme table (:2919-2933)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    expect(thePill(view).className).toContain("bg-emerald-50");
    expect(thePill(view).className).toContain("text-emerald-700");

    choose(view, VARIANT, "solid");
    expect(thePill(view).className).toContain("bg-emerald-500");
    expect(thePill(view).className).toContain("text-white");

    choose(view, VARIANT, "outline");
    expect(thePill(view).className).toContain("border-emerald-200");
    expect(thePill(view).className).not.toContain("bg-emerald-500");
  });

  it("keeps a glass pill's rim white and its copy in the tone (:333-334)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    choose(view, VARIANT, "glass");
    const pill = thePill(view);
    expect(pill.className).toContain("border border-white/50");
    expect(pill.className).toContain("text-emerald-900");
    expect(pill.className).not.toContain("border-emerald-");
  });

  it("maps corner and uppercase to the classes the source names (:278,:286)", () => {
    const view = open();
    expect(thePill(view).className).toContain("rounded-full");
    choose(view, CORNER, "None");
    expect(thePill(view).className).toContain("rounded-none");
    flip(view, UPPERCASE);
    expect(thePill(view).className).toContain("uppercase tracking-wide");
  });

  it("truncates the label and hands the width to the style (:251,:291-297)", () => {
    const view = open();
    const label = Array.from(thePill(view).querySelectorAll("span")).find((node) =>
      (node.textContent ?? "").includes("Operational"),
    );
    expect(label?.className).not.toContain("truncate");
    typeInto(view, MAX_WIDTH, "200");
    expect(thePill(view).style.maxWidth).toBe("200px");
    expect(thePill(view).className).not.toContain("truncate");
    const clipped = thePill(view).querySelector('[class*="truncate"]');
    expect(clipped).not.toBeNull();
  });

  it("glows in its own tone, and stops when the app has dimmed it (:161-172,:285)", () => {
    const view = open();
    flip(view, PULSE);
    const pill = thePill(view);
    expect(pill.className).toContain("pill-pulse");
    expect(pill.getAttribute("style") ?? "").toContain("--pill-glow: var(--color-blue-500)");
    expect(pill.getAttribute("style") ?? "").toContain("--pill-glow-dark: var(--color-blue-300)");

    flip(view, DISABLED);
    expect(thePill(view).className).not.toContain("pill-pulse");
    expect(thePill(view).className).toContain("opacity-50");
    expect(notes(view)).toContain("pulsing is pulse && !disabled");
  });

  it("disables the remove button for real, not just by looks (:262)", () => {
    const view = open();
    flip(view, REMOVE);
    flip(view, DISABLED);
    expect(theRemoveButton(view).hasAttribute("disabled")).toBe(true);
    expect(notes(view)).toContain("real disabled attribute");
  });

  it("puts an adornment through the renderer, at the size the pill implies (:210-215)", () => {
    const view = open();
    choose(view, ICON, "Check");
    choose(view, TRAILING, "ChevronRight");
    const pill = thePill(view);
    // Two svgs, each inside the `flex shrink-0` wrapper the content adds (:246-258).
    expect(pill.querySelectorAll("svg").length).toBe(2);
    expect(pill.children.length).toBe(3);
    choose(view, SIZE, "xl");
    expect(notes(view)).toContain("collapses the five steps to two");
    expect(notes(view)).toContain("sm here");
  });

  it("puts the label in the tag as children, never as an attribute (:147,:244-253)", () => {
    const view = open();
    typeInto(view, LABEL, "Quarterly report");
    const pill = thePill(view);
    expect(pill.textContent).toBe("Quarterly report");
    expect(pill.hasAttribute("label")).toBe(false);
    expect(notes(view)).not.toContain("A bare <span>");
  });

  it("drops the props the dot branch never reaches, whichever knobs are left on (:218-242)", () => {
    const view = open();
    flip(view, DOT);
    flip(view, PULSE);
    expect(hasField(view, REMOVE)).toBe(false);
    expect(hasField(view, CLICK)).toBe(false);
    expect(hasField(view, ICON)).toBe(false);
    expect(hasField(view, MAX_WIDTH)).toBe(false);
    // and the dot keeps the four things the branch does read (:226-235)
    const dot = theDot(view);
    expect(dot.className).toContain("pill-pulse");
    expect(dot.className).toContain("bg-blue-50");
  });

  it("gives the glass pill a backdrop to prove the blur is doing anything", () => {
    const view = open();
    choose(view, VARIANT, "liquid-glass");
    expect(notes(view)).toContain("nothing behind this pill to see through");
    flip(view, BACKDROP);
    const backdrop = stage(view).querySelector('[class*="linear-gradient"]');
    expect(backdrop).not.toBeNull();
    expect(backdrop?.contains(thePill(view))).toBe(true);
    expect(notes(view)).not.toContain("nothing behind this pill to see through");
  });

  it("agrees with the source it prints", () => {
    const view = open();
    choose(view, VARIANT, "liquid-glass");
    choose(view, SPECULAR, "None");
    chooseSwatch(view, "rose");
    flip(view, REMOVE);
    flip(view, CLICK);
    const code = showCode(view);
    expect(code).toContain('variant="liquid-glass"');
    expect(code).toContain('tone="rose"');
    expect(code).toContain('specularMode="none"');
    expect(code).toContain("onClick={() => setPinned(true)}");
    expect(code).toContain("onRemove={() => setShown(false)}");
    expect(code).not.toContain("removeLabel");

    showPreview(view);
    const pill = thePill(view);
    expect(pill.tagName).toBe("BUTTON");
    expect(pill.className).toContain("backdrop-blur-md");
    expect(pill.className).toContain("bg-rose-500");
    expect(theOverlay(view)).toBeNull();
    expect(theRemoveButton(view).getAttribute("aria-label")).toBe("Remove");
  });

  it("resets back to the span the page opened with", () => {
    const view = open();
    flip(view, CLICK);
    expect(thePill(view).tagName).toBe("BUTTON");
    const reset = Array.from(view.container.querySelectorAll("button")).find(
      (node) => (node.textContent ?? "").trim() === "Reset",
    );
    expect(reset, "the panel offers no way back").toBeDefined();
    act(() => fireEvent.click(reset as HTMLElement));
    expect(thePill(view).tagName).toBe("SPAN");
  });
});

describe("pill page", () => {
  it("tells the keyboard only what the source binds", () => {
    const view = render(<PillPage />);
    const table = tableWithHeader(view, "Key");
    const keysColumn = Array.from(table.querySelectorAll("tbody tr")).map((row) =>
      (row.querySelector("td")?.textContent ?? "").trim(),
    );
    // Exactly what the source can produce: two elements, both real buttons, and no
    // handler of Pill's own (:76-125,:299-316,:259-273).
    expect(keysColumn).toEqual(["Tab", "Shift+Tab", "Enter+Space", "Any key"]);
    const spoken = new Set(["Tab", "Shift", "Enter", "Space", "Any key"]);
    for (const binding of KEYBOARD) {
      for (const key of binding.keys) {
        expect(spoken.has(key), `claimed ${key}`).toBe(true);
      }
    }
    expect(KEYBOARD.length).toBeGreaterThanOrEqual(4);
    cleanup();
  });

  it("names the one string the kit translates, in the five catalogs it ships it in", () => {
    const view = render(<PillPage />);
    const text = view.container.textContent ?? "";
    for (const word of ["Remove", "Supprimer", "Entfernen", "Quitar", "Remover"]) {
      expect(text.includes(word), `missing ${word}`).toBe(true);
    }
    expect(text).toContain("kit.pill.remove");
    expect(text).toContain("useKitT");
    expect(text).toContain("builtIn/en.ts:376-378");
    cleanup();
  });

  it("documents a row for every prop the playground prints", () => {
    const view = render(<PillPage />);
    const table = tableWithHeader(view, "Prop");
    const rows = Array.from(table.querySelectorAll("tbody tr")).map(
      (row) => row.querySelector("th, td")?.textContent ?? "",
    );
    for (const name of ["specularMode", "maxWidth", "removeLabel", "dot", "label", "corner"]) {
      expect(rows, `${name} has no row`).toContain(name);
    }
    cleanup();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { registerIcons } from "@cjlapao/ui-kit";
import { IconsPlayground } from "./IconsPlayground";
import { IconsPage, KEYBOARD } from "./IconsPage";
import { DUPLICATE_MESSAGE, STAGE_CLASS } from "./iconsRegistryStage";

/**
 * The preview is the page's claim that the map really answered, so these tests read
 * the DOM the registry produced rather than trusting the caption: which glyph is
 * painted, whether the name came from a registration or the generated map, what a
 * refused call leaves behind, and what happens to the name when the preview unmounts.
 */

const open = (): ReturnType<typeof render> => {
  const view = render(<IconsPlayground />);
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

/** The wrapper CustomIcon builds for the resolved glyph. */
const theIcon = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="inline-flex"][class*="shrink-0"]',
  );
  if (!node) throw new Error("no icon wrapper in the preview");
  return node;
};

/** The workbench's own glyph, if the name resolved to one. */
const theConsumerGlyph = (view: ReturnType<typeof render>): Element | null =>
  theIcon(view).querySelector("[data-glyph]");

const theMonogram = (view: ReturnType<typeof render>): HTMLElement => {
  const node = theIcon(view).querySelector<HTMLElement>(
    '[class*="place-items-center"]',
  );
  if (!node) throw new Error("no fallback monogram in the preview");
  return node;
};

/** Every line the stage writes under the icon. */
const notes = (view: ReturnType<typeof render>): string =>
  Array.from(stage(view).querySelectorAll("p, span"))
    .map((node) => node.textContent ?? "")
    .join(" ");

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

/** The batch size is a real number input, not a set of buttons. */
const setNumber = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector('input[type="number"]');
  if (!input) throw new Error(`no number box for "${label}"`);
  fireEvent.change(input, { target: { value } });
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

const typeInto = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no text box for "${label}"`);
  fireEvent.change(input, { target: { value } });
};

const BATCH = "Glyphs in the batch (:40)";
const STACK = "Claim the target name too (:26,:50)";
const OVERRIDE = "{ override: true } (:38,:44)";
const AFTER_PAINT = "Register after first paint (:12-15,:78)";
const TARGET = "Resolve this name (:24-28)";
const ALT = "alt (:20,:125-128)";
const SIZE = "Size (:24,:51-57,:105-106)";
const TONE = "Tone (:26,:108-111)";

/** A glyph for the tests' own registrations — never one the stage owns. */
const FOREIGN = () => (
  <svg data-glyph="Foreign" viewBox="0 0 24 24" aria-hidden="true" focusable="false" />
);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("icon registry preview", () => {
  it("asks the map out loud and paints what it answers", () => {
    const view = open();
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Pulse");
    expect(notes(view)).toContain("consumer registration");
  });

  it("says so when a name belongs to nobody (:130-144)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    choose(view, TARGET, "Unicorn");
    expect(theIcon(view).querySelector("svg")).toBeNull();
    expect(theMonogram(view).textContent).toBe("U");
    expect(notes(view)).toContain("monogram");
    expect(warn.mock.calls.map((call) => String(call[0]))).toContain(
      "Icon not found in registry: Unicorn",
    );
    warn.mockRestore();
  });

  it("reaches the generated registry when no registration claims the name", () => {
    const view = open();
    choose(view, TARGET, "Star");
    // A built-in glyph: no `data-glyph`, because that attribute is the workbench's.
    expect(theIcon(view).querySelector("svg")).not.toBeNull();
    expect(theConsumerGlyph(view)).toBeNull();
    expect(notes(view)).toContain("generated registry");
  });

  it("leaves a name out of the preview until the batch covers it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    choose(view, TARGET, "Ring");
    expect(theIcon(view).querySelector("svg")).toBeNull();
    expect(notes(view)).toContain("neither");
    setNumber(view, BATCH, "2");
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Ring");
    warn.mockRestore();
  });

  it("paints the newest registration, not the first one (:26,:50)", () => {
    const view = open();
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Pulse");
    // Stacking without the flag is refused, so the batch's drawing stays put.
    flip(view, STACK);
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Pulse");
    expect(notes(view)).toContain(DUPLICATE_MESSAGE);
    // With it, the second call lands and takes the name: same name, new drawing.
    flip(view, OVERRIDE);
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Ring");
    expect(notes(view)).toContain("newest registration");
    expect(notes(view)).toContain("Names this workbench is holding");
  });

  it("refuses the claim without override, and keeps what was already there", () => {
    const view = open();
    choose(view, TARGET, "Star");
    flip(view, STACK);
    // The claim call throws (:44-46); the built-in glyph is untouched.
    expect(theConsumerGlyph(view)).toBeNull();
    expect(theIcon(view).querySelector("svg")).not.toBeNull();
    expect(notes(view)).toContain("Icon already registered");
    expect(notes(view)).toContain("Nothing was written");
  });

  it("only shows the override switch where a call would be refused", () => {
    const view = open();
    expect(hasField(view, OVERRIDE)).toBe(false);
    // `Pulse` is the batch's own name, so the claim is heading for a collision.
    flip(view, STACK);
    expect(hasField(view, OVERRIDE)).toBe(true);
    flip(view, STACK);
    // Nobody at all owns `Unicorn`: the claim is free, so no flag is offered.
    choose(view, TARGET, "Unicorn");
    flip(view, STACK);
    expect(hasField(view, OVERRIDE)).toBe(false);
  });

  it("lets override through, and hands the name back on the way out (:55-66)", () => {
    const view = open();
    choose(view, TARGET, "Star");
    flip(view, STACK);
    flip(view, OVERRIDE);
    // The claim paints: the target is `Star`, the drawing is the batch's other glyph.
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Ring");
    expect(notes(view)).toContain("override");
    // A built-in name is a collision for everyone, override or no override (:44).
    expect(() => registerIcons({ Star: FOREIGN })).toThrow(
      "Icon already registered: Star",
    );
    // The batch's own name, though, is held by this preview and nobody else.
    expect(() => registerIcons({ Pulse: FOREIGN })).toThrow(
      "Icon already registered: Pulse",
    );
    view.unmount();
    // Unmounting released it — which is the only reason this page is safe to open.
    const dispose = registerIcons({ Pulse: FOREIGN });
    expect(() => dispose()).not.toThrow();
  });

  it("waits for a click when the batch is deferred, then repaints (:78)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Pulse");
    flip(view, AFTER_PAINT);
    // Unregistered, still mounted: the same element, now a monogram.
    expect(theIcon(view).querySelector("svg")).toBeNull();
    expect(notes(view)).toContain("monogram");
    const button = Array.from(stage(view).querySelectorAll("button")).find(
      (node) => (node.textContent ?? "").trim() === "Register the batch",
    );
    if (!button) throw new Error("no button to run the deferred batch");
    act(() => fireEvent.click(button));
    expect(theConsumerGlyph(view)?.getAttribute("data-glyph")).toBe("Pulse");
    warn.mockRestore();
  });

  it("names itself with `alt` and keeps the glyph quiet (:125-131)", () => {
    const view = open();
    expect(theIcon(view).getAttribute("aria-hidden")).toBe("true");
    typeInto(view, ALT, "Pulse report");
    expect(theIcon(view).getAttribute("role")).toBe("img");
    expect(theIcon(view).getAttribute("aria-label")).toBe("Pulse report");
    expect(theIcon(view).querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sizes the preview on the same ladder as every other icon (:51-57)", () => {
    const view = open();
    expect(theIcon(view).getAttribute("class")).toContain("h-6 w-6");
    choose(view, SIZE, "xl");
    expect(theIcon(view).getAttribute("class")).toContain("h-8 w-8");
    expect(theIcon(view).getAttribute("class")).not.toContain("h-6 w-6");
  });

  it("tints it through currentColor, like anything else in the kit (:108-111)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    expect(theIcon(view).getAttribute("class")).toContain("text-emerald-500");
  });

  it("paints and prints the same tag", () => {
    const view = open();
    choose(view, SIZE, "lg");
    choose(view, TARGET, "Star");
    expect(theIcon(view).getAttribute("class")).toContain("h-7 w-7");
    const shown = showCode(view);
    expect(shown).toContain('icon="Star"');
    expect(shown).toContain('size="lg"');
    expect(shown).toContain("registerIcons({ Pulse: PulseGlyph })");
  });

  it("keeps the batch honest about what it registered", () => {
    const view = open();
    setNumber(view, BATCH, "3");
    expect(notes(view)).toContain("Pulse, Ring, Bars");
    setNumber(view, BATCH, "0");
    expect(notes(view)).toContain("No call yet");
  });
});

describe("icon gallery", () => {
  const openGallery = (): ReturnType<typeof render> => render(<IconsPage />);

  it("gives every tile a name, a state and a silent glyph", () => {
    const view = openGallery();
    const tiles = Array.from(view.container.querySelectorAll("button")).filter(
      (node) => node.querySelector("svg") && node.textContent?.trim(),
    );
    expect(tiles.length).toBeGreaterThan(200);
    const tile = tiles.find((node) => node.textContent?.trim() === "Star");
    if (!tile) throw new Error("Star is not in the gallery");
    expect(tile.getAttribute("type")).toBe("button");
    expect(tile.getAttribute("aria-pressed")).toBe("false");
    expect(tile.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(tile.querySelector("svg")?.getAttribute("focusable")).toBe("false");
    fireEvent.click(tile);
    expect(tile.getAttribute("aria-pressed")).toBe("true");
  });

  it("has no roving focus to invent — one tab stop per icon", () => {
    const view = openGallery();
    const tiles = Array.from(view.container.querySelectorAll("button")).filter(
      (node) => node.querySelector("svg"),
    );
    for (const tile of tiles.slice(0, 40)) {
      expect(tile.hasAttribute("tabindex"), tile.textContent ?? "").toBe(false);
    }
  });

  it("searches through the translated bar but labels it in English", () => {
    const view = openGallery();
    const input = view.container.querySelector("input");
    if (!input) throw new Error("no search box on the gallery");
    expect(input.getAttribute("placeholder")).toMatch(/^Search \d+ icons/);
    expect(input.hasAttribute("aria-label")).toBe(false);
    fireEvent.change(input, { target: { value: "no-such-icon" } });
    const clear = Array.from(view.container.querySelectorAll("button")).find(
      (node) => node.getAttribute("aria-label") === "Clear search",
    );
    expect(clear, "the clear button is the translated string").toBeTruthy();
  });

  it("claims no key that the kit does not bind", () => {
    expect(KEYBOARD.map((binding) => binding.keys.join("+"))).toEqual([
      "Tab",
      "Enter",
      "Space",
      "Escape",
      "↑+↓+←+→+Page Up+Page Down+Home+End",
      "Any+on a bar or thumb",
    ]);
  });
});

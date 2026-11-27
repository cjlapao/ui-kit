import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { registerIcons } from "@cjlapao/ui-kit";
import { CustomIconPlayground } from "./CustomIconPlayground";
import { CUSTOM_ICON_PROPS, KEYBOARD } from "./CustomIconPage";
import {
  CLASS_EXAMPLE,
  COLOR_EXAMPLE,
  CUSTOM_SIZE_EXAMPLE,
  HOVER_COLOR_EXAMPLE,
  STAGE_CLASS,
} from "./customIconStage";

/**
 * The preview is the page's claim that the tag it prints is the thing that paints,
 * so these tests read the DOM the component really produces (:105-171) rather than
 * trusting the prose: a span that becomes a button, an `aria-hidden` that only
 * `alt` removes, three colour props that fight in a documented order, and the
 * monogram that keeps its size when a name is missing.
 */

const open = (): ReturnType<typeof render> => {
  const view = render(<CustomIconPlayground />);
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

/** The wrapper the component builds — a span, or a button once `onClick` exists. */
const theIcon = (view: ReturnType<typeof render>): HTMLElement => {
  const node = stage(view).querySelector<HTMLElement>(
    '[class*="inline-flex"][class*="shrink-0"]',
  );
  if (!node) throw new Error("no icon wrapper in the preview");
  return node;
};

/** The glyph itself, which is always hidden from a reader (:131). */
const theGlyph = (view: ReturnType<typeof render>): SVGElement => {
  const node = theIcon(view).querySelector<SVGElement>("svg");
  if (!node) throw new Error("no glyph in the preview");
  return node;
};

/** The monogram square an unknown name renders (:136-138). */
const theMonogram = (view: ReturnType<typeof render>): HTMLElement => {
  const node = theIcon(view).querySelector<HTMLElement>('[class*="place-items-center"]');
  if (!node) throw new Error("no fallback monogram in the preview");
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
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no text box for "${label}"`);
  fireEvent.change(input, { target: { value } });
};

const ICON = "Icon (:14,:79,:141-144)";
const ALT = "alt (:20,:125-128)";
const CUSTOM_SIZE = "customSize (:22,:81-91)";
const SIZE = "Size (:24,:51-57,:66,:105-106)";
const CLASS_NAME = "className (:45,:105-106,:122)";
const TONE = "Tone (:26,:108-111)";
const COLOR = "color (:31,:97,:109)";
const HOVER = "hoverColor (:33,:98-100,:119)";
const COLORED = "colored — keep its own colours (:35,:70,:92-101)";
const SPIN = "spin (:37,:71,:120)";
const ACTIVATABLE = "onClick — make it a button (:43,:146-164)";
const DISABLED = "Disabled (:44,:73,:121,:151)";

const wrapperClasses = (view: ReturnType<typeof render>): string =>
  theIcon(view).getAttribute("class") ?? "";

const wrapperStyle = (view: ReturnType<typeof render>): string =>
  theIcon(view).getAttribute("style") ?? "";

/** What the stage says under the icon (:125-128 and friends). */
const note = (view: ReturnType<typeof render>): string =>
  Array.from(stage(view).querySelectorAll("p, span"))
    .map((node) => node.textContent ?? "")
    .join(" ");

/*
 * A consumer glyph for the registration test. It takes no props on purpose: this
 * workspace carries two copies of `@types/react` (`react/` and `react/demo/`), and a
 * props-forwarding `SVGProps<SVGSVGElement>` component will not typecheck against the
 * kit's `IconComponent` — the same wall `examples/ConsumerIcons.tsx` sits on. What is
 * under test is that a late registration repaints (:78), and a plain glyph proves
 * that; the props-forwarding contract belongs to the registry's own tests.
 */
const PULSE = () => (
  <svg viewBox="0 0 24 24">
    <path data-testid="consumer-glyph" fill="currentColor" d="M0 0h24v24H0z" />
  </svg>
);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("custom icon preview", () => {
  it("is decoration until `alt` says otherwise, and the glyph never speaks (:125-131)", () => {
    const view = open();
    const wrapper = theIcon(view);
    expect(wrapper.tagName).toBe("SPAN");
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.getAttribute("role")).toBeNull();
    expect(wrapper.getAttribute("aria-label")).toBeNull();
    const glyph = theGlyph(view);
    expect(glyph.getAttribute("aria-hidden")).toBe("true");
    expect(glyph.getAttribute("focusable")).toBe("false");
    expect(note(view)).toContain("decoration");
  });

  it("becomes one announced image the moment a name is typed (:126-128)", () => {
    const view = open();
    typeInto(view, ALT, "Mark everything as read");
    const wrapper = theIcon(view);
    expect(wrapper.getAttribute("role")).toBe("img");
    expect(wrapper.getAttribute("aria-label")).toBe("Mark everything as read");
    expect(wrapper.hasAttribute("aria-hidden")).toBe(false);
    // The glyph stays hidden, or the name would be read twice over.
    expect(theGlyph(view).getAttribute("aria-hidden")).toBe("true");
    expect(note(view)).toContain("aria-hidden");
  });

  it("takes its box from one rung of the shared scale (:51-57,:105-106)", () => {
    const view = open();
    expect(wrapperClasses(view)).toContain("h-6 w-6");
    choose(view, SIZE, "xs");
    expect(wrapperClasses(view)).toContain("h-4 w-4");
    expect(wrapperClasses(view)).not.toContain("h-6 w-6");
    choose(view, SIZE, "xl");
    expect(wrapperClasses(view)).toContain("h-8 w-8");
  });

  it("writes a pixel count into inline style, and retires the class (:81-106)", () => {
    const view = open();
    typeInto(view, CUSTOM_SIZE, CUSTOM_SIZE_EXAMPLE);
    expect(theIcon(view).style.width).toBe("48px");
    expect(theIcon(view).style.height).toBe("48px");
    expect(wrapperClasses(view)).not.toContain("h-6 w-6");
    expect(note(view)).toContain("48px");
  });

  it("takes a CSS length verbatim instead of guessing at it (:83)", () => {
    const view = open();
    typeInto(view, CUSTOM_SIZE, "2.5rem");
    expect(theIcon(view).style.width).toBe("2.5rem");
  });

  it("lets a size in your className win the whole argument (:105-106,:122)", () => {
    const view = open();
    typeInto(view, CLASS_NAME, CLASS_EXAMPLE);
    expect(wrapperClasses(view)).toContain("h-10 w-10");
    expect(wrapperClasses(view)).not.toContain("h-6 w-6");
    // The `size` knob still reads `md` — the component simply never added a class.
    expect(note(view)).toContain("already carries a size");
  });

  it("tints through currentColor when a tone is chosen (:108-111)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    expect(wrapperClasses(view)).toContain("text-emerald-500");
    expect(wrapperClasses(view)).toContain("dark:text-emerald-400");
  });

  it("lets a raw colour beat the tone, rather than blending the two (:31,:97,:109)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    typeInto(view, COLOR, COLOR_EXAMPLE);
    expect(wrapperStyle(view)).toMatch(/rgb\(14, 165, 233\)|#0ea5e9/i);
    // `tone` is only consulted when there is no raw colour (:109).
    expect(wrapperClasses(view)).not.toContain("text-emerald-500");
  });

  it("carries a hover colour as a custom property, because inline cannot do :hover (:98-100,:119)", () => {
    const view = open();
    expect(wrapperClasses(view)).not.toContain("custom-icon");
    typeInto(view, HOVER, HOVER_COLOR_EXAMPLE);
    expect(theIcon(view).style.getPropertyValue("--icon-hover-color")).toBe(
      HOVER_COLOR_EXAMPLE,
    );
    expect(wrapperClasses(view)).toContain("custom-icon");
    expect(wrapperClasses(view)).toContain("transition-colors");
  });

  it("keeps the glyph's own paint when `colored` is on, from all three props (:92-101,:109)", () => {
    const view = open();
    chooseSwatch(view, "emerald");
    typeInto(view, COLOR, COLOR_EXAMPLE);
    typeInto(view, HOVER, HOVER_COLOR_EXAMPLE);
    flip(view, COLORED);
    expect(wrapperClasses(view)).not.toContain("text-emerald-500");
    expect(wrapperClasses(view)).not.toContain("custom-icon");
    expect(wrapperStyle(view)).not.toContain("color:");
    expect(note(view)).toContain("inert");
  });

  it("spins, and stops for a reader who asked for less motion (:120)", () => {
    const view = open();
    flip(view, SPIN);
    expect(wrapperClasses(view)).toContain("animate-spin");
    expect(wrapperClasses(view)).toContain("motion-reduce:animate-none");
  });

  it("dims and mutes a span-mode icon, which was never interactive anyway (:121)", () => {
    const view = open();
    flip(view, DISABLED);
    expect(wrapperClasses(view)).toContain("pointer-events-none");
    expect(wrapperClasses(view)).toContain("opacity-50");
    expect(theIcon(view).tagName).toBe("SPAN");
    expect(theIcon(view).hasAttribute("disabled")).toBe(false);
  });

  it("swaps the span for a real button when it is given a job (:146-164)", () => {
    const view = open();
    flip(view, ACTIVATABLE);
    const button = theIcon(view);
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("class")).toContain("focus-visible:ring-2");
    expect(button.getAttribute("class")).toContain("focus-visible:ring-current");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    fireEvent.click(button);
    expect(note(view)).toContain("Pressed");
    warn.mockRestore();
  });

  it("names the button with `alt`, and says what happens when it is missing (:157-159)", () => {
    const view = open();
    flip(view, ACTIVATABLE);
    expect(theIcon(view).getAttribute("aria-label")).toBeNull();
    typeInto(view, ALT, "Delete the draft");
    expect(theIcon(view).getAttribute("aria-label")).toBe("Delete the draft");
  });

  it("hands disabled to the element, so the button leaves the tab order (:151)", () => {
    const view = open();
    flip(view, ACTIVATABLE);
    flip(view, DISABLED);
    const button = theIcon(view) as HTMLButtonElement;
    expect(button.tagName).toBe("BUTTON");
    expect(button.disabled).toBe(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // A native disabled button never reaches the handler, so no press is reported.
    fireEvent.click(button);
    expect(note(view)).not.toContain("Pressed");
    expect(note(view)).toContain("tab order");
    warn.mockRestore();
  });

  it("falls back to a monogram that keeps the size it was asked for (:130-144)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    choose(view, ICON, "Unicorn");
    expect(theMonogram(view).textContent).toBe("U");
    // The old fallback dropped the classes and collapsed the layout (:133-135).
    expect(wrapperClasses(view)).toContain("h-6 w-6");
    expect(theIcon(view).querySelector("svg")).toBeNull();
    expect(warn.mock.calls.map((call) => String(call[0]))).toContain(
      "Icon not found in registry: Unicorn",
    );
    expect(note(view)).toContain("monogram");
    warn.mockRestore();
  });

  it("warns once per name, not once per render (:59-60,:141-144)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    choose(view, ICON, "QuantumWidget");
    choose(view, ICON, "Search");
    choose(view, ICON, "QuantumWidget");
    const said = warn.mock.calls
      .map((call) => String(call[0]))
      .filter((line) => line.includes("Icon not found in registry: QuantumWidget"));
    expect(said).toHaveLength(1);
    warn.mockRestore();
  });

  it("repaints an icon registered after it mounted (:78)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = open();
    choose(view, ICON, "Unicorn");
    expect(theIcon(view).querySelector("svg")).toBeNull();
    // The subscription is external, so the repaint has to be flushed deliberately —
    // that is the whole point of `useSyncExternalStore` here (:78).
    let dispose = (): void => {};
    act(() => {
      dispose = registerIcons({ Unicorn: PULSE });
    });
    try {
      // The component stamps its own class on the glyph, so this is its svg (:131).
      expect(theIcon(view).querySelector("svg")).not.toBeNull();
      expect(
        theIcon(view).querySelector('[class*="place-items-center"]'),
      ).toBeNull();
      expect(
        theIcon(view).querySelector('[data-testid="consumer-glyph"]'),
      ).not.toBeNull();
    } finally {
      act(() => dispose());
    }
    warn.mockRestore();
  });

  it("keeps the wrapper's own layout classes whatever the glyph is", () => {
    const view = open();
    const base = wrapperClasses(view);
    expect(base).toContain("inline-flex");
    expect(base).toContain("items-center");
    expect(base).toContain("justify-center");
    choose(view, ICON, "Trash");
    expect(wrapperClasses(view)).toBe(base);
    expect(theIcon(view).querySelector("svg")).not.toBeNull();
  });

  it("documents in the table every prop the preview is driven by", () => {
    const rows = new Set(
      CUSTOM_ICON_PROPS.filter((prop) => !prop.name.startsWith("…")).map((prop) =>
        prop.name.trim(),
      ),
    );
    for (const name of [
      "icon",
      "alt",
      "customSize",
      "size",
      "className",
      "tone",
      "color",
      "hoverColor",
      "colored",
      "spin",
      "onClick",
      "disabled",
      // Documented even though no knob touches them, because the page says what
      // they do — `style` merges, `forceSvg` is inert (:75,:47-48).
      "style",
      "forceSvg",
    ]) {
      expect(rows.has(name), `${name} has no row`).toBe(true);
    }
  });

  it("claims only the keys a real button already has", () => {
    // `CustomIcon.tsx` registers no key handler, so the table may only list what
    // the element provides — and only in button mode.
    expect(KEYBOARD.map((binding) => binding.keys.join("+"))).toEqual([
      "Tab",
      "Enter",
      "Space",
    ]);
    expect(hasField(open(), "Last press")).toBe(false);
  });
});

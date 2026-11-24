import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import MultiSelectPanel from "./MultiSelectPanel";
import type { MultiSelectPanelOption } from "./MultiSelectPanel";
import { resetA11yWarned } from "../../../common/a11y/warn";

const OPTIONS: MultiSelectPanelOption[] = [
  { value: "text", title: "Text", subtitle: "Plain text in and out" },
  { value: "image", title: "Image", subtitle: "Raster and vector", labels: ["Beta"] },
  { value: "speech", title: "Speech", subtitle: "Audio either way" },
  { value: "premium", title: "Transcription", labels: ["Premium"], disabled: true },
];

const card = (name: string | RegExp) =>
  screen.getByRole("checkbox", { name });
const radioCard = (name: string | RegExp) =>
  screen.getByRole("radio", { name });

/** The panel sections, in option order. */
const cards = () => screen.getAllByRole("checkbox");

const renderGroup = (
  props: Partial<React.ComponentProps<typeof MultiSelectPanel>> = {},
) =>
  render(
    <MultiSelectPanel name="io" options={OPTIONS} label="Input and output" {...props} />,
  );

describe("MultiSelectPanel", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetA11yWarned();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("selection", () => {
    it("toggles a card on and off, reporting the whole selection", () => {
      const onChange = vi.fn();
      renderGroup({ onChange });

      fireEvent.click(card("Text"));
      expect(onChange).toHaveBeenLastCalledWith(["text"]);
      expect(card("Text")).toHaveAttribute("aria-checked", "true");

      fireEvent.click(card("Image"));
      expect(onChange).toHaveBeenLastCalledWith(["text", "image"]);

      fireEvent.click(card("Text"));
      expect(onChange).toHaveBeenLastCalledWith(["image"]);
      expect(card("Image")).toHaveAttribute("aria-checked", "true");
    });

    it("reports one change per click, whichever part of the card was hit", () => {
      // A click inside the composed card produces three events: on the text,
      // on the label, and the label's forwarded activation of the input. Only
      // one of them may reach `onChange`, or a click would cancel itself out.
      const onChange = vi.fn();
      const { container } = renderGroup({ onChange });

      fireEvent.click(screen.getByText("Plain text in and out"));
      expect(onChange).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText("Text"));
      expect(onChange).toHaveBeenCalledTimes(2);

      fireEvent.click(card("Text"));
      expect(onChange).toHaveBeenCalledTimes(3);

      // An odd number of clicks later, the drawn box still agrees with the
      // state, rather than being left flipped by the browser underneath a
      // controlled field.
      const input = container.querySelector(
        'input[name="io[]"]',
      ) as HTMLInputElement;
      expect(input.checked).toBe(true);
    });

    it("starts from defaultValue and survives a new array identity", () => {
      const onChange = vi.fn();
      const { rerender } = renderGroup({ defaultValue: ["image"], onChange });
      expect(card("Image")).toHaveAttribute("aria-checked", "true");

      fireEvent.click(card("Text"));
      expect(onChange).toHaveBeenLastCalledWith(["image", "text"]);

      // A parent that re-renders with a fresh `defaultValue` literal must not
      // wipe a group the user has been clicking.
      rerender(
        <MultiSelectPanel
          name="io"
          options={OPTIONS}
          label="Input and output"
          defaultValue={["image"]}
          onChange={onChange}
        />,
      );
      expect(card("Text")).toHaveAttribute("aria-checked", "true");
    });

    it("obeys `value` when controlled", () => {
      const onChange = vi.fn();
      renderGroup({ value: ["speech"], onChange });
      expect(card("Speech")).toHaveAttribute("aria-checked", "true");

      fireEvent.click(card("Text"));
      expect(onChange).toHaveBeenCalledTimes(1);
      // Still the caller's selection — nothing leaked into internal state.
      expect(card("Text")).toHaveAttribute("aria-checked", "false");
      expect(card("Speech")).toHaveAttribute("aria-checked", "true");
    });

    it("never activates a disabled card", () => {
      const onChange = vi.fn();
      renderGroup({ onChange });
      const disabled = screen.getByRole("checkbox", { name: "Transcription" });
      fireEvent.click(disabled);
      expect(onChange).not.toHaveBeenCalled();
      expect(disabled).toHaveAttribute("aria-disabled", "true");
    });

    it("never activates any card while the group is disabled", () => {
      const onChange = vi.fn();
      renderGroup({ disabled: true, onChange });
      fireEvent.click(card("Text"));
      expect(onChange).not.toHaveBeenCalled();
      expect(card("Text")).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("single mode", () => {
    it("replaces the selection and deselects on the second click", () => {
      const onChange = vi.fn();
      renderGroup({ selectionMode: "single", onChange });

      fireEvent.click(radioCard("Text"));
      expect(onChange).toHaveBeenLastCalledWith(["text"]);

      fireEvent.click(radioCard("Image"));
      expect(onChange).toHaveBeenLastCalledWith(["image"]);

      fireEvent.click(radioCard("Image"));
      expect(onChange).toHaveBeenLastCalledWith([]);
      expect(radioCard("Image")).toHaveAttribute("aria-checked", "false");
    });

    it("keeps one picked when allowDeselect is off", () => {
      const onChange = vi.fn();
      renderGroup({ selectionMode: "single", allowDeselect: false, onChange });

      fireEvent.click(radioCard("Text"));
      onChange.mockClear();
      fireEvent.click(radioCard("Text"));
      expect(onChange).not.toHaveBeenCalled();
      expect(radioCard("Text")).toHaveAttribute("aria-checked", "true");
    });

    it("labels the group as a radiogroup", () => {
      renderGroup({ selectionMode: "single", description: "Pick one" });
      const group = screen.getByRole("radiogroup");
      expect(group).toHaveAttribute(
        "aria-labelledby",
        screen.getByText("Input and output").id,
      );
      expect(
        document.getElementById(group.getAttribute("aria-describedby") ?? "")
          ?.textContent,
      ).toBe("Pick one");
    });
  });

  describe("keyboard", () => {
    it("activates with Enter and Space, and keeps Space from scrolling", () => {
      const onChange = vi.fn();
      renderGroup({ onChange });

      const pressed = fireEvent.keyDown(card("Text"), { key: " " });
      expect(pressed).toBe(false); // preventDefault
      expect(onChange).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card("Image"), { key: "Enter" });
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("ignores a key that came from inside the card", () => {
      const onChange = vi.fn();
      renderGroup({ onChange });
      fireEvent.keyDown(screen.getByText("Plain text in and out"), {
        key: "Enter",
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it("gives the radiogroup one tab stop that arrows move and pick with", () => {
      const onChange = vi.fn();
      renderGroup({ selectionMode: "single", defaultValue: ["text"], onChange });

      const stops = screen
        .getAllByRole("radio")
        .filter((el) => el.tabIndex === 0);
      expect(stops).toHaveLength(1);
      expect(stops[0]).toBe(radioCard("Text"));

      fireEvent.keyDown(radioCard("Text"), { key: "ArrowDown" });
      expect(onChange).toHaveBeenLastCalledWith(["image"]);
      expect(document.activeElement).toBe(radioCard("Image"));

      fireEvent.keyDown(radioCard("Image"), { key: "ArrowUp" });
      expect(onChange).toHaveBeenLastCalledWith(["text"]);
      expect(document.activeElement).toBe(radioCard("Text"));
    });

    it("wraps, honours Home and End, and steps over disabled cards", () => {
      const onChange = vi.fn();
      renderGroup({ selectionMode: "single", defaultValue: ["speech"], onChange });

      // Speech → (Transcription is off) → Text: the disabled card is skipped.
      fireEvent.keyDown(radioCard("Speech"), { key: "ArrowRight" });
      expect(onChange).toHaveBeenLastCalledWith(["text"]);

      // Text → Image → Speech → (skipped) wraps back to Text.
      fireEvent.keyDown(radioCard("Text"), { key: "ArrowRight" });
      fireEvent.keyDown(radioCard("Image"), { key: "ArrowRight" });
      fireEvent.keyDown(radioCard("Speech"), { key: "ArrowRight" });
      expect(document.activeElement).toBe(radioCard("Text"));

      fireEvent.keyDown(radioCard("Text"), { key: "End" });
      // Last usable card, never the disabled one.
      expect(document.activeElement).toBe(radioCard("Speech"));

      fireEvent.keyDown(radioCard("Speech"), { key: "Home" });
      expect(document.activeElement).toBe(radioCard("Text"));
    });

    it("leaves every enabled card its own tab stop in multiple mode", () => {
      renderGroup();
      const enabled = cards().filter(
        (el) => el.getAttribute("aria-disabled") !== "true",
      );
      expect(enabled).toHaveLength(3);
      enabled.forEach((el) => expect(el.tabIndex).toBe(0));
      expect(screen.getByRole("checkbox", { name: "Transcription" }).tabIndex).toBe(-1);
    });
  });

  describe("form submission", () => {
    const submit = (
      props: Partial<React.ComponentProps<typeof MultiSelectPanel>>,
    ) => {
      let data: FormData | undefined;
      render(
        <form
          onSubmit={(event) => {
            event.preventDefault();
            data = new FormData(event.currentTarget);
          }}
        >
          <MultiSelectPanel name="io" options={OPTIONS} {...props} />
          <button type="submit">Send</button>
        </form>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Send" }));
      return data;
    };

    it("submits one checkbox field per selection, minus the disabled ones", () => {
      const data = submit({ defaultValue: ["text", "image", "premium"] });
      expect(data?.getAll("io[]")).toEqual(["text", "image"]);
    });

    it("submits a plain radio field in single mode", () => {
      const data = submit({ selectionMode: "single", defaultValue: ["speech"] });
      expect(data?.get("io")).toBe("speech");
      expect(data?.get("io[]")).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("names a card after its title alone, and describes it with the subtitle", () => {
      renderGroup();
      const withPills = screen.getByRole("checkbox", {
        name: "Image",
      });
      // The pills are decoration on the row; folding them into the name would
      // make every "Beta" card sound like a different control.
      expect(withPills.getAttribute("aria-labelledby")).toBe(
        screen.getByText("Image").id,
      );
      expect(
        document.getElementById(
          withPills.getAttribute("aria-describedby") ?? "",
        )?.textContent,
      ).toBe("Raster and vector");
    });

    it("keeps the submission input out of the accessibility tree", () => {
      const { container } = renderGroup({ defaultValue: ["text"] });
      const input = container.querySelector(
        'input[name="io[]"]',
      ) as HTMLInputElement;
      expect(input).toHaveAttribute("aria-hidden", "true");
      expect(input).toHaveAttribute("tabindex", "-1");
      // Not rendered at all: the card is the only thing the pointer can hit,
      // and axe's `nested-interactive` rule agrees that it is not a control.
      expect(input).not.toBeVisible();
      expect(input).toHaveStyle({ pointerEvents: "none" });
      // One control announced per card, not a checkbox inside a checkbox.
      expect(screen.getAllByRole("checkbox")).toHaveLength(OPTIONS.length);
    });

    it("does not warn about the card being a clickable container of controls", () => {
      // The card is clickable and its body holds an `input`; that input is
      // inert on purpose, so `Panel` must stay quiet about it.
      renderGroup();
      expect(warnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("clickable-nested-interactive"),
      );
    });

    it("labels the group from `label` and `description`", () => {
      const { container } = renderGroup({ description: "What the model accepts" });
      const legend = screen.getByText("Input and output");
      const helper = screen.getByText("What the model accepts");
      const fieldset = container.querySelector("fieldset") as HTMLElement;
      // A `<legend>` inside a `<fieldset>` names the group natively; the ARIA
      // pair says the same thing to a reader that ignores the fieldset.
      expect(legend.tagName).toBe("LEGEND");
      expect(fieldset.getAttribute("aria-labelledby")).toBe(legend.id);
      expect(fieldset.getAttribute("aria-describedby")).toBe(helper.id);
    });
  });

  describe("grid", () => {
    const grid = (props: Partial<React.ComponentProps<typeof MultiSelectPanel>>) => {
      const { container } = renderGroup(props);
      return container.querySelector("[style*='grid-template-columns']") as HTMLElement;
    };

    it("makes `columns` the number of equal tracks, clamped to six", () => {
      expect(grid({}).style.gridTemplateColumns).toBe(
        "repeat(2, minmax(0, 1fr))",
      );
      expect(grid({ columns: 4 }).style.gridTemplateColumns).toBe(
        "repeat(4, minmax(0, 1fr))",
      );
      expect(grid({ columns: 0 }).style.gridTemplateColumns).toBe(
        "repeat(1, minmax(0, 1fr))",
      );
      expect(grid({ columns: 9 }).style.gridTemplateColumns).toBe(
        "repeat(6, minmax(0, 1fr))",
      );
    });

    it("gives every row the same height and spaces cards on the shared scale", () => {
      expect(grid({}).style.gridAutoRows).toBe("1fr");
      expect(grid({}).className).toContain("gap-3");
      expect(grid({ gap: "lg" }).className).toContain("gap-4");
    });
  });

  describe("option overrides and optionals", () => {
    it("lets a card outvote the group on every surface knob", () => {
      const { container } = renderGroup({
        variant: "tonal",
        tone: "blue",
        corner: "rounded-md",
        checkboxVariant: "flat",
        options: [
          { value: "a", title: "Alpha" },
          {
            value: "b",
            title: "Bravo",
            variant: "glass",
            tone: "emerald",
            corner: "rounded-sm",
            padding: "lg",
            pulse: true,
            checkboxVariant: "ghost",
          },
        ],
      });
      const [alpha, bravo] = Array.from(
        container.querySelectorAll("[data-multiselect-card]"),
      ) as HTMLElement[];

      expect(alpha.dataset.variant).toBe("tonal");
      expect(alpha.dataset.tone).toBe("blue");
      expect(bravo.dataset.variant).toBe("glass");
      expect(bravo.dataset.tone).toBe("emerald");
      expect(bravo).toHaveClass("panel-pulse");

      // The tone reaches the box accent too, so card and box never disagree.
      // The box is the sibling of the invisible input, inside its wrapper.
      const bravoBox = within(bravo)
        .getByRole("checkbox", { hidden: true })
        .nextElementSibling as HTMLElement;
      expect(bravoBox.className).toContain("peer-checked:border-emerald-700");
      expect(bravoBox.className).toContain("bg-neutral-200");
      const alphaBox = (alpha.querySelector("input") as HTMLElement)
        .nextElementSibling as HTMLElement;
      expect(alphaBox.className).toContain("peer-checked:border-blue-700");
      expect(alphaBox.className).toContain("bg-white");
    });

    it("marks the selected card active for its rim and tint", () => {
      const { container } = renderGroup({ defaultValue: ["text"] });
      const selected = container.querySelector(
        "[data-multiselect-card='text']",
      ) as HTMLElement;
      const rest = container.querySelector(
        "[data-multiselect-card='image']",
      ) as HTMLElement;
      expect(selected.dataset.active).toBe("true");
      expect(rest.dataset.active).toBeUndefined();
    });

    it("renders a title-only card with no trace of the missing slots", () => {
      render(
        <MultiSelectPanel
          name="io"
          options={[{ value: "solo", title: "Only a title" }]}
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Only a title" })).toBeTruthy();

      // No reserved gutter where the icon would have been: the title leads its
      // own row. (The tick glyph inside the box is `Checkbox`'s, always there.)
      const title = screen.getByText("Only a title");
      expect(title.parentElement?.firstElementChild).toBe(title);
      // And no subtitle paragraph.
      expect(
        document.getElementById(`${title.id.replace(/-title$/, "")}-input-description`),
      ).toBeNull();
    });

    it("renders an icon as a registry name or as an element", () => {
      const { container } = render(
        <MultiSelectPanel
          name="io"
          options={[
            { value: "a", title: "Alpha", icon: "Globe" },
            { value: "b", title: "Bravo", icon: <i data-testid="hand-drawn" /> },
          ]}
        />,
      );
      expect(container.querySelector("[data-multiselect-card='a'] svg")).toBeTruthy();
      expect(screen.getByTestId("hand-drawn")).toBeTruthy();
    });

    it("renders the label pills on the title row", () => {
      renderGroup();
      const withPills = screen.getByRole("checkbox", { name: "Image" });
      expect(within(withPills).getByText("Beta")).toBeTruthy();
      expect(within(withPills).getByText("Raster and vector")).toBeTruthy();
    });

    it("lets the group choose which end of the title row the pills sit on", () => {
      const { rerender } = renderGroup();
      const pushed = () =>
        screen
          .getByRole("checkbox", { name: "Image" })
          .querySelector('[class*="ms-auto"]');

      // Hugging the title is the default: no push, so the two read as one
      // phrase, and the pills stay after the title in reading order.
      expect(pushed()).toBeNull();

      rerender(
        <MultiSelectPanel name="io" options={OPTIONS} labelAlign="right" />,
      );
      // Logical margin, not `ml-auto` — an RTL card pushes to its own end.
      expect(pushed()?.className).toContain("ms-auto");
      // Still after the title, so the reading order never moves.
      const title = screen.getByText("Image");
      const pills = pushed()!;
      expect(title.parentElement?.contains(pills)).toBe(true);
      expect(
        Array.from(title.parentElement!.children).indexOf(pills),
      ).toBeGreaterThan(
        Array.from(title.parentElement!.children).indexOf(title),
      );
    });

    it("dims a disabled card rather than laying a sheet over it", () => {
      renderGroup();
      const off = screen.getByRole("checkbox", { name: "Transcription" });

      // The card still behaves as disabled.
      expect(off).toHaveAttribute("aria-disabled", "true");
      expect(off).toHaveAttribute("data-disabled", "true");
      expect(off.className).toContain("cursor-not-allowed");
      // And says it once, in the option's own voice — the sheet Panel would
      // have added reads as a rectangle inside a flat `tonal`/`simple` card.
      expect(
        Array.from(off.querySelectorAll("div")).some((el) =>
          el.className.includes("bg-white/70"),
        ),
      ).toBe(false);
      expect(
        (off.querySelector("label") as HTMLElement).className,
      ).toContain("opacity-60");
    });
  });

  describe("hues of its own", () => {
    /**
     * A card's hue is not its fate. `checkboxTone`, `activeTone` and
     * `pulseTone` all follow the rule the surface props set — a group default
     * each card may veto — and all three default to what the card already
     * wears, so a group whose author has no opinion looks as it always did.
     */
    const cardEl = (container: HTMLElement, value: string) =>
      container.querySelector(`[data-multiselect-card='${value}']`) as HTMLElement;
    /** The drawn box: the sibling of the hidden input, inside its wrapper. */
    const boxOf = (card: HTMLElement) =>
      (card.querySelector("input") as HTMLElement)
        .nextElementSibling as HTMLElement;

    it("hands each box its own card's hue while nobody asks otherwise", () => {
      const { container } = renderGroup({
        tone: "violet",
        defaultValue: ["text"],
      });
      const selected = cardEl(container, "text");
      expect(selected.dataset.tone).toBe("violet");
      expect(boxOf(selected).className).toContain("peer-checked:bg-violet-700");
    });

    it("can put the boxes in a hue the cards do not wear", () => {
      const { container } = renderGroup({
        tone: "blue",
        checkboxTone: "emerald",
        defaultValue: ["text"],
      });
      const selected = cardEl(container, "text");
      const box = boxOf(selected);
      expect(box.className).toContain("peer-checked:bg-emerald-700");
      expect(box.className).toContain("peer-checked:border-emerald-700");
      // Only the box moved. The card is still its group's blue, rim included —
      // which is the point: an emerald tick may sit on a blue card.
      expect(selected.dataset.tone).toBe("blue");
      expect(selected.className).not.toContain("outline-emerald-500");
    });

    it("lets one card outvote the group on its box", () => {
      const { container } = renderGroup({
        checkboxTone: "emerald",
        defaultValue: ["text", "image"],
        options: [
          { value: "text", title: "Text" },
          { value: "image", title: "Image", checkboxTone: "amber" },
        ],
      });
      expect(boxOf(cardEl(container, "text")).className).toContain(
        "peer-checked:bg-emerald-700",
      );
      expect(boxOf(cardEl(container, "image")).className).toContain(
        "peer-checked:bg-amber-700",
      );
    });

    it("floors an untinted group's boxes to the kit blue, and lets them leave", () => {
      const { container } = renderGroup({ tone: "none", defaultValue: ["text"] });
      expect(boxOf(cardEl(container, "text")).className).toContain(
        "peer-checked:bg-blue-700",
      );

      const tinted = renderGroup({
        tone: "none",
        checkboxTone: "rose",
        defaultValue: ["text"],
      });
      expect(boxOf(cardEl(tinted.container, "text")).className).toContain(
        "peer-checked:bg-rose-700",
      );
    });

    it("selects a card in a hue of its own, rim and wash together", () => {
      const { container } = renderGroup({
        tone: "blue",
        activeTone: "amber",
        defaultValue: ["text"],
      });
      const selected = cardEl(container, "text");
      expect(selected.dataset.active).toBe("true");
      expect(selected.className).toContain("outline-amber-500");
      expect(selected.className).not.toContain("outline-blue-500");
      // An unselected card shows no rim at all — the hue is waiting, not shown.
      expect(cardEl(container, "image").className).not.toContain("outline-2");
    });

    it("lets one card be selected in a different hue from its neighbours", () => {
      const { container } = renderGroup({
        activeTone: "amber",
        defaultValue: ["text", "image"],
        options: [
          { value: "text", title: "Text" },
          { value: "image", title: "Image", activeTone: "rose" },
        ],
      });
      expect(cardEl(container, "text").className).toContain("outline-amber-500");
      expect(cardEl(container, "image").className).toContain("outline-rose-500");
    });

    it("pulses a card in a hue that is not the card's, per card", () => {
      const { container } = renderGroup({
        tone: "cyan",
        pulse: true,
        pulseTone: "rose",
        options: [
          { value: "text", title: "Text" },
          { value: "image", title: "Image", pulseTone: "amber" },
        ],
      });
      expect(cardEl(container, "text").style.getPropertyValue("--panel-glow")).toBe(
        "var(--color-rose-500)",
      );
      expect(cardEl(container, "image").style.getPropertyValue("--panel-glow")).toBe(
        "var(--color-amber-500)",
      );
    });

    it("keeps the glow on the card's own hue when nobody names one", () => {
      const { container } = renderGroup({ tone: "cyan", pulse: true });
      expect(cardEl(container, "text").style.getPropertyValue("--panel-glow")).toBe(
        "var(--color-cyan-500)",
      );
      // …and with the selection given a hue, the glow follows the selection,
      // so a selected-and-pulsing card still speaks in one colour.
      const selected = renderGroup({
        tone: "cyan",
        activeTone: "amber",
        pulse: true,
        defaultValue: ["text"],
      });
      expect(
        cardEl(selected.container, "text").style.getPropertyValue("--panel-glow"),
      ).toBe("var(--color-amber-500)");
    });

    /**
     * The hover asks the *selection*, so the card that is selected previews its
     * own state and the rest of the group keeps hovering in the tone they were
     * given — which is why these three assertions are the forwarding's insurance:
     * a card that stops forwarding `hoverColor` fails nothing else here.
     */
    const hoverHueOf = (cls: string): string | undefined => {
      for (const token of cls.split(/\s+/)) {
        const utility = token.match(/^hover:bg-([a-z]+)-\d+/);
        const variable = token.match(
          /^hover:\[--ui-surface-color:var\(--color-([a-z]+)-\d+\)\]$/,
        );
        const hue = utility?.[1] ?? variable?.[1];
        if (hue) return hue;
      }
      return undefined;
    };

    it("hovers the chosen card in the group's hue and the rest in their own", () => {
      const { container } = renderGroup({
        tone: "cyan",
        activeTone: "amber",
        defaultValue: ["text"],
      });
      // The selected card hovers in the hue its rim and wash already wear…
      expect(hoverHueOf(cardEl(container, "text").className)).toBe("amber");
      // …while its unselected neighbours borrow nothing from it, even though
      // every one of them was handed the group's `activeTone`.
      expect(hoverHueOf(cardEl(container, "image").className)).toBe("cyan");
      expect(hoverHueOf(cardEl(container, "speech").className)).toBe("cyan");
    });

    it("hovers in the card's own tone when nobody names a hue", () => {
      const { container } = renderGroup({ tone: "cyan" });
      expect(hoverHueOf(cardEl(container, "text").className)).toBe("cyan");
    });

    it("lets hoverColor overrule the selection hue, the group's and one card's", () => {
      const { container } = renderGroup({
        tone: "cyan",
        activeTone: "amber",
        hoverColor: "rose",
        defaultValue: ["text", "image"],
        options: [
          { value: "text", title: "Text" },
          { value: "image", title: "Image", hoverColor: "lime" },
        ],
      });
      // Both cards are selected, so both would hover in the selection's amber.
      // The group's `hoverColor` beats that…
      expect(hoverHueOf(cardEl(container, "text").className)).toBe("rose");
      // …and one card's beats both.
      expect(hoverHueOf(cardEl(container, "image").className)).toBe("lime");
    });
  });
});

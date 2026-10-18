import { I18nProvider } from "../i18n";
import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Picker from "./Picker";
import TagPicker from "./TagPicker";
import SplitView from "./SplitView";
import { TRUE_COLORS, getSurfaceCornerClass } from "../theme/Theme";

const ITEMS = [
  { id: "a", title: "Alpha" },
  { id: "b", title: "Beta" },
];

describe("Picker", () => {
  it("paints every tone in its own tone, with no drift", () => {
    // The 21-entry literal had `red` spelling every class with *rose* and
    // `green` with *emerald*, so those two rendered as their neighbours.
    for (const tone of TRUE_COLORS) {
      const { unmount } = render(
        <Picker items={ITEMS} selectedId="a" color={tone} />,
      );
      fireEvent.click(screen.getByRole("button"));
      // The open state is the field system's focus treatment now:
      // the tone's -400 border with an *inset* ring.
      expect(document.body.innerHTML).toContain(`ring-${tone}-400/60`);
      unmount();
      document.body.innerHTML = "";
    }
  });

  it("resolves `red` to red and `green` to green", () => {
    const { unmount } = render(<Picker items={ITEMS} color="red" />);
    fireEvent.click(screen.getByRole("button"));
    expect(document.body.innerHTML).toContain("border-red-400");
    expect(document.body.innerHTML).not.toContain("border-rose-400");
    unmount();
    document.body.innerHTML = "";

    render(<Picker items={ITEMS} color="green" />);
    fireEvent.click(screen.getByRole("button"));
    expect(document.body.innerHTML).toContain("border-green-400");
    expect(document.body.innerHTML).not.toContain("border-emerald-400");
  });

  it("selects an item", () => {
    const onSelect = vi.fn();
    render(<Picker items={ITEMS} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.mouseDown(screen.getByText("Beta"));
    fireEvent.click(screen.getByText("Beta"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }));
  });
});

describe("TagPicker", () => {
  it("paints every tone in its own tone, with no drift", () => {
    for (const tone of TRUE_COLORS) {
      const { unmount } = render(
        <TagPicker
          items={ITEMS.map((i) => ({ id: i.id, label: i.title }))}
          value={[]}
          onChange={vi.fn()}
          color={tone}
        />,
      );
      fireEvent.click(screen.getByRole("button"));
      // Same field-system focus treatment as Picker: the tone's -400 border
      // with an *inset* ring.
      expect(document.body.innerHTML).toContain(`ring-${tone}-400/60`);
      unmount();
      document.body.innerHTML = "";
    }
  });

  it("resolves `green` to green", () => {
    render(
      <TagPicker
        items={[{ id: "a", label: "A" }]}
        value={[]}
        onChange={vi.fn()}
        color="green"
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(document.body.innerHTML).toContain("border-green-400");
    expect(document.body.innerHTML).not.toContain("border-emerald-400");
  });

  it("labels the search combobox and announces the focused option", () => {
    render(
      <TagPicker
        items={ITEMS.map((i) => ({ id: i.id, label: i.title }))}
        value={[]}
        onChange={vi.fn()}
      />,
    );
    fireEvent.click(document.querySelector("[aria-haspopup]") as HTMLElement);
    const search = screen.getByRole("combobox");
    expect(search).toHaveAttribute("aria-label", "Search tags");
    fireEvent.keyDown(search, { key: "ArrowDown" });
    const firstOption = screen.getAllByRole("option")[0];
    expect(search.getAttribute("aria-activedescendant")).toBe(
      firstOption.getAttribute("id"),
    );
  });
});

describe("SplitView", () => {
  const items = [
    { id: "a", label: "Alpha", panel: <p>A panel</p> },
    { id: "b", label: "Beta", panel: <p>B panel</p> },
  ];

  it("paints every tone in its own tone", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <SplitView items={items} color={tone} />,
      );
      expect(container.innerHTML).toContain(
        `bg-${tone}-600 dark:bg-${tone}-400`,
      );
      unmount();
    }
  });

  it("no longer aliases stone and neutral to one shared palette", () => {
    // Both used to point at the same `neutralActive` object, so a `stone`
    // SplitView silently rendered neutral — and `neutral` used the 500
    // weight where every other tone used 600.
    const { container: stone, unmount } = render(
      <SplitView items={items} color="stone" />,
    );
    expect(stone.innerHTML).toContain("bg-stone-600 dark:bg-stone-400");
    // The specific bug: stone rendered the neutral accent.
    expect(stone.innerHTML).not.toContain("bg-neutral-500");
    expect(stone.innerHTML).not.toContain("bg-neutral-600 dark:bg-neutral-400");
    unmount();

    const { container: neutral } = render(
      <SplitView items={items} color="neutral" />,
    );
    expect(neutral.innerHTML).toContain("bg-neutral-600 dark:bg-neutral-400");
  });
});

describe("Picker — the shared field system", () => {
  it("draws the variant's surface rather than a hardcoded white box", () => {
    // It painted `bg-white dark:bg-neutral-900` with a `border-neutral-300`
    // regardless, so a Picker could not be glass, ghost, underlined or
    // elevated while every sibling field could.
    const { container, rerender } = render(
      <Picker items={ITEMS} variant="elevated" />,
    );
    expect(container.querySelector("button")!.className).toContain("shadow-sm");
    rerender(<Picker items={ITEMS} variant="ghost" />);
    expect(container.querySelector("button")!.className).toContain(
      "border-transparent",
    );
  });

  it("focuses with an inset ring, like Input and Select", () => {
    // A non-inset ring is painted outside the border box, so any ancestor with
    // `overflow: auto|hidden` — Panel's body, by default — shears it off.
    const { container } = render(<Picker items={ITEMS} tone="violet" />);
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("focus-within:ring-inset");
    expect(cls).toContain("focus-within:ring-violet-400/60");
    expect(cls).toContain("focus-within:border-violet-400");
  });

  it("takes the whole control scale, not just sm and md", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { container, unmount } = render(
        <Picker items={ITEMS} size={size} />,
      );
      expect(container.querySelector("button")!.className).toMatch(/px-\d/);
      unmount();
    }
  });

  it("pads identically to an Input of the same size", () => {
    // The point of the shared scale: a Picker stacked on an Input lines up.
    const picker = render(<Picker items={ITEMS} size="lg" />);
    const cls = picker.container.querySelector("button")!.className;
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-2.5");
  });

  it("shows the error surface and reports itself invalid", () => {
    const { container } = render(
      <Picker items={ITEMS} validationStatus="error" />,
    );
    const button = container.querySelector("button")!;
    expect(button.className).toContain("border-rose-500");
    expect(button.getAttribute("aria-invalid")).toBe("true");
  });

  it("dims rather than repainting when disabled", () => {
    const { container } = render(<Picker items={ITEMS} disabled />);
    const button = container.querySelector("button")!;
    expect(button).toBeDisabled();
    expect(button.className).toContain("opacity-60");
    // Not a neutral fill, which would fight the variant's own surface.
    expect(button.className).not.toContain("bg-neutral-100");
  });

  it("`tone` and its `color` alias agree", () => {
    const a = render(<Picker items={ITEMS} tone="emerald" />);
    const aCls = a.container.querySelector("button")!.className;
    a.unmount();
    const b = render(<Picker items={ITEMS} color="emerald" />);
    expect(b.container.querySelector("button")!.className).toBe(aCls);
  });

  it("wraps the gradient variant in a glow", () => {
    const { container } = render(<Picker items={ITEMS} variant="gradient" />);
    const glow = container.querySelector("[aria-hidden]") as HTMLElement | null;
    expect(glow).not.toBeNull();
    expect(glow!.style.boxShadow).toContain("px 0");
  });

  it("announces itself as a listbox trigger", () => {
    render(<Picker items={ITEMS} />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("Picker — accessibility (listbox + keyboard)", () => {
  it("exposes the option list as a listbox of options with selected state", () => {
    render(<Picker items={ITEMS} selectedId="b" onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Beta/ }));
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(2);
    const beta = within(listbox).getByRole("option", { name: /Beta/ });
    expect(beta).toHaveAttribute("aria-selected", "true");
  });

  it("exposes the search field as a labelled combobox driving the listbox", () => {
    render(<Picker items={ITEMS} />);
    fireEvent.click(screen.getByRole("button"));
    const search = screen.getByRole("combobox");
    expect(search).toHaveAttribute("aria-label", "Search options");
    const listboxId = search.getAttribute("aria-controls");
    expect(document.getElementById(listboxId ?? "")).toHaveAttribute(
      "role",
      "listbox",
    );
  });

  it("supports ArrowDown/Enter keyboard selection and announces the active option", () => {
    const onSelect = vi.fn();
    render(<Picker items={ITEMS} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    const search = screen.getByRole("combobox");
    // Opening highlights the first option; it is announced via
    // aria-activedescendant.
    const firstOption = screen.getAllByRole("option")[0];
    expect(search.getAttribute("aria-activedescendant")).toBe(
      firstOption.getAttribute("id"),
    );
    // ArrowDown moves to the second option, Enter selects it.
    fireEvent.keyDown(search, { key: "ArrowDown" });
    const secondOption = screen.getAllByRole("option")[1];
    expect(search.getAttribute("aria-activedescendant")).toBe(
      secondOption.getAttribute("id"),
    );
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }));
  });

  it("multi-select: the clear action is a real button and the list is multiselectable", () => {
    render(
      <Picker
        items={ITEMS}
        multi
        selectedIds={["a", "b"]}
        onMultiChange={vi.fn()}
      />,
    );
    fireEvent.click(
      document.querySelector('[aria-haspopup="listbox"]') as HTMLElement,
    );
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );
    // The "N selected / Clear" row is a button, not a clickable <li>.
    const clear = screen.getByRole("button", {
      name: /selected/i,
    });
    expect(clear).toBeInTheDocument();
  });
});

describe("Picker — loading row", () => {
  it("pushes the chevron to the trailing edge", () => {
    // Reported: the chevron sat immediately after "Loading…" instead of at the
    // right-hand edge. Neither the spinner nor the copy grew, because the
    // loading branch was the only one without a `flex-1` child.
    const { container } = render(<Picker items={[]} loading />);
    const button = container.querySelector("button")!;
    const grower = button.querySelector(".flex-1");
    expect(grower).not.toBeNull();
    expect(grower!.textContent).toContain("Loading");
    // And the chevron is the last child, after it.
    expect(button.lastElementChild!.tagName.toLowerCase()).toBe("svg");
  });

  it("marks itself busy while loading", () => {
    render(<Picker items={[]} loading />);
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
  });

  it("scales the spinner with the field size", () => {
    const small = render(<Picker items={[]} loading size="xs" />);
    const smallCls =
      small.container.querySelector("span[class*='rounded-full']")?.className ??
      "";
    small.unmount();
    const large = render(<Picker items={[]} loading size="lg" />);
    const largeCls =
      large.container.querySelector("span[class*='rounded-full']")?.className ??
      "";
    expect(smallCls).not.toBe("");
    expect(largeCls).not.toBe(smallCls);
  });
});

describe("TagPicker — the shared field system", () => {
  const TAGS = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
  ];
  const noop = () => {};

  // The trigger is a plain (non-interactive) div — the chips carry their own
  // remove <button>s inside it, so an interactive container is invalid. The
  // chevron button (aria-haspopup) is its stable anchor.
  const triggerOf = (c: HTMLElement): HTMLElement =>
    c.querySelector('button[aria-haspopup="listbox"]')!.parentElement!;

  it("draws the variant's surface rather than a hardcoded white box", () => {
    const { container, rerender } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="elevated" />,
    );
    expect(triggerOf(container).className).toContain("shadow-sm");
    rerender(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="ghost" />,
    );
    expect(triggerOf(container).className).toContain("border-transparent");
  });

  it("focuses with an inset ring, like every other field", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} tone="violet" />,
    );
    const cls = triggerOf(container).className;
    expect(cls).toContain("focus-within:ring-inset");
    expect(cls).toContain("focus-within:ring-violet-400/60");
  });

  it("takes the whole control scale and pads like an Input", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} size="lg" />,
    );
    const cls = triggerOf(container).className;
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-2.5");
  });

  it("keeps a minimum height so the trigger does not jump on the first tag", () => {
    const empty = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} size="md" />,
    );
    expect(triggerOf(empty.container).className).toContain("min-h-");
  });

  it("shows the error surface and reports itself invalid", () => {
    const { container } = render(
      <TagPicker
        items={TAGS}
        value={[]}
        onChange={noop}
        validationStatus="error"
      />,
    );
    const trigger = triggerOf(container);
    expect(trigger.className).toContain("border-rose-500");
    expect(
      container
        .querySelector('button[aria-haspopup="listbox"]')!
        .getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("dims for readOnly rather than repainting the surface", () => {
    // A `bg-neutral-50` here was a same-specificity fight with the variant's
    // own fill, and turned a glass or underline trigger into a grey slab.
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} readOnly />,
    );
    const cls = triggerOf(container).className;
    expect(cls).toContain("opacity-75");
    expect(cls).not.toContain("bg-neutral-50");
  });

  it("`tone` and its `color` alias agree", () => {
    const a = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} tone="emerald" />,
    );
    const aCls = triggerOf(a.container).className;
    a.unmount();
    const b = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} color="emerald" />,
    );
    expect(triggerOf(b.container).className).toBe(aCls);
  });

  it("wraps the gradient variant in a glow", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="gradient" />,
    );
    const glow = container.querySelector("[aria-hidden]") as HTMLElement | null;
    expect(glow).not.toBeNull();
    expect(glow!.style.boxShadow).toContain("px 0");
  });

  it("marks itself busy while loading and grows the copy", () => {
    const { container } = render(
      <TagPicker items={[]} value={[]} onChange={noop} loading />,
    );
    const chevron = container.querySelector('button[aria-haspopup="listbox"]')!;
    expect(chevron.getAttribute("aria-busy")).toBe("true");
    expect(
      chevron.parentElement!.querySelector(".flex-1")!.textContent,
    ).toContain("Loading");
  });
});

describe("Picker — multi highlight is position, not selection", () => {
  const multi = (selectedIds: string[] = []) => {
    const onMultiChange = vi.fn();
    const utils = render(
      <Picker
        items={ITEMS}
        multi
        selectedIds={selectedIds}
        onMultiChange={onMultiChange}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    return { ...utils, onMultiChange };
  };

  it("opens an empty multi selection with nothing highlighted", () => {
    // A lone lit row on a list of unchecked boxes reads as "already
    // picked". The cursor only appears once the keyboard asks for it.
    multi();
    expect(document.querySelector('[data-active="true"]')).toBeNull();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getAllByRole("option")[0]).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("does not paint an unchecked row with the selected fill", () => {
    // Opening highlights a row for the keyboard; in multi mode that row
    // may well be unchecked, and the grey fill read as "selected" while
    // the checkbox said otherwise.
    multi(["b"]);
    const active = screen.getAllByRole("option")[1];
    expect(active).toHaveAttribute("data-active", "true");
    expect(active.className).toContain("bg-blue-50");
    expect(active).toHaveAttribute("aria-selected", "true");
    // And a highlighted row that is NOT checked is only ever a whisper.
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowUp" });
    const activeUnselected = screen.getAllByRole("option")[0];
    expect(activeUnselected.className).toContain("bg-neutral-50");
    expect(activeUnselected.className).not.toContain("bg-blue-50");
    expect(activeUnselected).not.toHaveAttribute("aria-selected");
  });

  it("follows the click, and the checkbox is the truth", () => {
    const { onMultiChange, unmount } = multi();
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]);
    expect(onMultiChange).toHaveBeenCalledWith(["b"]);
    // The highlight moved to the clicked row - no phantom left behind.
    expect(options[1]).toHaveAttribute("data-active", "true");
    expect(options[0].hasAttribute("data-active")).toBe(false);
    // With the selection applied (the controlled flow), clicking the same
    // row again deselects - the checkbox is the truth, the highlight is not.
    unmount();
    const second = multi(["b"]);
    fireEvent.click(screen.getAllByRole("option")[1]);
    expect(second.onMultiChange).toHaveBeenCalledWith([]);
  });

  it("washes only on the keyboard's initiative - a click leaves no residue", () => {
    // The reported bug: deselecting a row kept showing the position wash,
    // loudest on the glass popup where bg-neutral-50 reads as a grey band.
    // The wash is the keyboard's focus-visible marker; mouse answers
    // itself via the checkbox.
    const { onMultiChange } = multi();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    const first = screen.getAllByRole("option")[0];
    expect(first.className.split(" ")).toContain("bg-neutral-50");
    // Deselect through the mouse: cursor moves for the keyboard's sake,
    // but no wash is parked on the row.
    onMultiChange.mockClear();
    fireEvent.click(first);
    expect(first).toHaveAttribute("data-active", "true");
    expect(first.className.split(" ")).not.toContain("bg-neutral-50");
    // And one arrow press brings it back.
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getAllByRole("option")[1]).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(screen.getAllByRole("option")[1].className.split(" ")).toContain(
      "bg-neutral-50",
    );
  });

  it("keeps the tone wash and adds a ring when the keyboard lands on a checked row", () => {
    multi(["a"]);
    const selected = screen.getAllByRole("option")[0];
    expect(selected).toHaveAttribute("aria-selected", "true");
    // Opening starts on the selected row: its tone wash stays the fill.
    expect(selected.className.split(" ")).toContain("bg-blue-50");
    expect(selected.className.split(" ")).not.toContain("bg-neutral-50");
  });
});

describe("Picker — the portaled popup places against the viewport", () => {
  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalRect;
  });
  let originalRect: typeof Element.prototype.getBoundingClientRect;

  it("lands below the field inside a clipping panel host", () => {
    // A Panel host scrolls (overflow) - the popup is portaled to the body,
    // so the host must NOT act as a boundary: clamping against the host's
    // short rect parked the popup on top of the field (the reported bug).
    // The DatePicker's overlay hook documents the same coordinate fix.
    originalRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (this: Element) {
      if (this.hasAttribute("data-host-clip")) {
        return mockRect(100, 160, 400); // a short clipped card
      }
      if (
        this.getAttribute("role") === "combobox" ||
        this.tagName === "BUTTON"
      ) {
        return mockRect(100, 134, 200); // the field
      }
      if (
        this.hasAttribute("data-slot") &&
        this.getAttribute("data-slot") === "picker-popup"
      ) {
        return mockRect(0, 300, 200); // the popup's (tall) box
      }
      return originalRect.call(this);
    };
    render(
      <div data-host-clip style={{ overflow: "auto" }}>
        <Picker items={ITEMS} />
      </div>,
    );
    fireEvent.click(screen.getByRole("button"));
    const popup = document.querySelector('[data-slot="picker-popup"]')!;
    // Below the field (134 + 4 gap) - not clamped into the host's 100..160
    // strip, which is where the boundary walk used to drop it.
    expect((popup as HTMLElement).style.top).toBe("138px");
  });

  function mockRect(top: number, bottom: number, width: number): DOMRect {
    return {
      top,
      bottom,
      left: 100,
      right: 100 + width,
      width,
      height: bottom - top,
      x: 100,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  }
});

describe("Picker — the option list scrolls like the rest of the kit", () => {
  it("scrolls through the shared ScrollArea, not a raw overflow div", () => {
    render(<Picker items={ITEMS} />);
    fireEvent.click(screen.getByRole("button"));
    // The kit's overlay scrollbars (ScrollArea's viewport) - the same
    // furniture VariablePicker's groups and the tab lanes use - rather
    // than the browser's native bar.
    expect(
      screen.getByRole("listbox").closest('[data-slot="scrollarea-viewport"]'),
    ).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(ITEMS.length);
  });
});

describe("Picker — the dropdown surface follows the field", () => {
  const popupCard = () => {
    const shell = document.querySelector('[data-slot="picker-popup"]');
    return (shell?.firstElementChild as HTMLElement | null)?.className ?? "";
  };

  it("maps the field variant to a surface, glass included", () => {
    // The hardcoded `bg-white shadow-xl` box made a glass field's popup an
    // opaque slab. `"auto"` follows SURFACE_VARIANT_FOR_FIELD, the mapping
    // SmartInput's suggestion card already uses.
    const { unmount } = render(<Picker items={ITEMS} variant="glass" />);
    fireEvent.click(screen.getByRole("button"));
    expect(popupCard()).toContain("backdrop-blur-xl");
    unmount();
    render(<Picker items={ITEMS} variant="underline" />);
    fireEvent.click(screen.getByRole("button"));
    // Underline's popup is `subtle` — no rim colour to speak of.
    expect(popupCard()).toContain("ring-transparent");
  });

  it("resolves the card corner through the theme in auto mode", () => {
    // A hardcoded `rounded-lg` ignored the theme's corner scale; `auto`
    // keeps the ladder SmartInput's card holds.
    render(<Picker items={ITEMS} />);
    fireEvent.click(screen.getByRole("button"));
    expect(popupCard()).toContain(getSurfaceCornerClass("auto"));
  });

  it("takes an explicit panelCorner", () => {
    render(<Picker items={ITEMS} panelCorner="none" />);
    fireEvent.click(screen.getByRole("button"));
    expect(popupCard()).toContain("rounded-none");
    expect(popupCard()).not.toContain("rounded-2xl");
  });

  it("takes an explicit panelVariant", () => {
    render(<Picker items={ITEMS} variant="glass" panelVariant="outlined" />);
    fireEvent.click(screen.getByRole("button"));
    expect(popupCard()).toContain("bg-white/90");
    expect(popupCard()).not.toContain("backdrop-blur");
  });
});

describe("Picker — underline is laid out like Input's", () => {
  it("drops the box treatment for the underline variant", () => {
    render(<Picker items={ITEMS} variant="underline" />);
    const trigger = screen.getByRole("button");
    // A ring around a borderless field reads as a stray box — Input skips
    // it, and so must the sibling that claims the same field system.
    expect(trigger.className).not.toContain("focus-within:ring");
    // The underline padding scale — never the box's horizontal inset.
    expect(trigger.className).toMatch(/pt-\d pb-\d/);
    expect(trigger.className).not.toMatch(/\bpx-\d/);
  });

  it("tints the rule while open without boxing it", () => {
    render(<Picker items={ITEMS} variant="underline" />);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(trigger.className).toContain("border-blue-400");
    expect(trigger.className).not.toContain("ring-2");
  });
});

describe("Picker — i18n", () => {
  const items = [
    { id: "1", title: "Alpha" },
    { id: "2", title: "Beta" },
  ];

  it("speaks the user's language out of the box", () => {
    // The defaults ARE the product for most callers — English defaults in a
    // German app are the bug, and no prop can fix what was never passed.
    render(
      <I18nProvider locales={{}} locale="de" detect={false} storageKey={null}>
        <Picker items={items} onSelect={vi.fn()} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    const search = screen.getByRole("combobox", {
      name: "Optionen durchsuchen",
    });
    expect(search.getAttribute("placeholder")).toBe("Suchen…");
    expect(screen.getByRole("listbox", { name: "Optionen" })).toBeTruthy();
    expect(screen.queryByText("Select an item…")).toBeNull();
  });

  it("localises the empty and loading copy", () => {
    render(
      <I18nProvider locales={{}} locale="de" detect={false} storageKey={null}>
        <Picker items={[]} loading onSelect={vi.fn()} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Wird geladen…")).toBeTruthy();
    expect(screen.queryByText("Loading…")).toBeNull();
  });
});

describe("loading disables the trigger", () => {
  const TAGS = [{ id: "a", label: "Alpha" }];
  const noop = () => {};

  it("Picker: the trigger is disabled and will not open", () => {
    render(<Picker items={[]} loading />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("Picker: shows a wait cursor rather than the disabled dim", () => {
    // The spinner already says why the control is inert; fading it too would
    // only make that harder to read.
    const { container } = render(<Picker items={[]} loading />);
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("cursor-wait");
    expect(cls).not.toContain("opacity-60");
  });

  it("Picker: a genuinely disabled picker still dims", () => {
    const { container } = render(<Picker items={[]} disabled />);
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("opacity-60");
    expect(cls).not.toContain("cursor-wait");
  });

  it("TagPicker: the trigger is disabled and will not open", () => {
    render(<TagPicker items={TAGS} value={[]} onChange={noop} loading />);
    // The interactive opener is the chevron button; loading/aria-disabled
    // replaces the native `disabled` on a div trigger.
    const chevron = screen.getByRole("button", { name: "Toggle options" });
    expect(chevron.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(chevron);
    expect(chevron.getAttribute("aria-expanded")).toBe("false");
  });

  it("TagPicker: shows a wait cursor rather than the disabled dim", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} loading />,
    );
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("cursor-wait");
    expect(cls).not.toContain("opacity-50");
  });
});

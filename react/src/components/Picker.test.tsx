import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Picker from "./Picker";
import TagPicker from "./TagPicker";
import SplitView from "./SplitView";
import { TRUE_COLORS } from "../theme/Theme";

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
        <TagPicker items={ITEMS.map((i) => ({ id: i.id, label: i.title }))} value={[]} onChange={vi.fn()} color={tone} />,
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
      <TagPicker items={[{ id: "a", label: "A" }]} value={[]} onChange={vi.fn()} color="green" />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(document.body.innerHTML).toContain("border-green-400");
    expect(document.body.innerHTML).not.toContain("border-emerald-400");
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
      expect(container.innerHTML).toContain(`border-l-${tone}-600`);
      unmount();
    }
  });

  it("no longer aliases stone and neutral to one shared palette", () => {
    // Both used to point at the same `neutralActive` object, so a `stone`
    // SplitView silently rendered neutral — and `neutral` used
    // `border-l-neutral-500` where every other tone used `-600`.
    const { container: stone, unmount } = render(
      <SplitView items={items} color="stone" />,
    );
    expect(stone.innerHTML).toContain("border-l-stone-600");
    // The specific bug: stone rendered the neutral border.
    expect(stone.innerHTML).not.toContain("border-l-neutral-500");
    expect(stone.innerHTML).not.toContain("border-l-neutral-600");
    unmount();

    const { container: neutral } = render(
      <SplitView items={items} color="neutral" />,
    );
    expect(neutral.innerHTML).toContain("border-l-neutral-600");
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
    expect(glow!.style.background).toContain("linear-gradient");
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
    const smallCls = small.container.querySelector("span[class*='rounded-full']")?.className ?? "";
    small.unmount();
    const large = render(<Picker items={[]} loading size="lg" />);
    const largeCls = large.container.querySelector("span[class*='rounded-full']")?.className ?? "";
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

  it("draws the variant's surface rather than a hardcoded white box", () => {
    const { container, rerender } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="elevated" />,
    );
    expect(container.querySelector("button")!.className).toContain("shadow-sm");
    rerender(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="ghost" />,
    );
    expect(container.querySelector("button")!.className).toContain(
      "border-transparent",
    );
  });

  it("focuses with an inset ring, like every other field", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} tone="violet" />,
    );
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("focus-within:ring-inset");
    expect(cls).toContain("focus-within:ring-violet-400/60");
  });

  it("takes the whole control scale and pads like an Input", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} size="lg" />,
    );
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-2.5");
  });

  it("keeps a minimum height so the trigger does not jump on the first tag", () => {
    const empty = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} size="md" />,
    );
    expect(empty.container.querySelector("button")!.className).toContain(
      "min-h-",
    );
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
    const button = container.querySelector("button")!;
    expect(button.className).toContain("border-rose-500");
    expect(button.getAttribute("aria-invalid")).toBe("true");
  });

  it("dims for readOnly rather than repainting the surface", () => {
    // A `bg-neutral-50` here was a same-specificity fight with the variant's
    // own fill, and turned a glass or underline trigger into a grey slab.
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} readOnly />,
    );
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("opacity-75");
    expect(cls).not.toContain("bg-neutral-50");
  });

  it("`tone` and its `color` alias agree", () => {
    const a = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} tone="emerald" />,
    );
    const aCls = a.container.querySelector("button")!.className;
    a.unmount();
    const b = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} color="emerald" />,
    );
    expect(b.container.querySelector("button")!.className).toBe(aCls);
  });

  it("wraps the gradient variant in a glow", () => {
    const { container } = render(
      <TagPicker items={TAGS} value={[]} onChange={noop} variant="gradient" />,
    );
    const glow = container.querySelector("[aria-hidden]") as HTMLElement | null;
    expect(glow).not.toBeNull();
    expect(glow!.style.background).toContain("linear-gradient");
  });

  it("marks itself busy while loading and grows the copy", () => {
    const { container } = render(
      <TagPicker items={[]} value={[]} onChange={noop} loading />,
    );
    const button = container.querySelector("button")!;
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector(".flex-1")!.textContent).toContain("Loading");
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
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
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

import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import SpeedDial, { type SpeedDialItem } from "./SpeedDial";

const ITEMS: SpeedDialItem[] = [
  { icon: "Edit", label: "Edit" },
  { icon: "Refresh", label: "Refresh" },
  { icon: "Trash", label: "Delete" },
];

const mainButton = () =>
  screen.getByRole("button", { name: /actions/i }) as HTMLButtonElement;

const itemButtons = () =>
  screen.queryAllByRole("menuitem") as HTMLButtonElement[];

const itemTransforms = () =>
  itemButtons().map((button) =>
    (button.parentElement as HTMLElement).style.transform,
  );

describe("SpeedDial — open/close", () => {
  it("starts collapsed with the menu hidden", () => {
    render(<SpeedDial items={ITEMS} />);
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
    const [first] = itemButtons();
    expect((first.parentElement as HTMLElement).style.opacity).toBe("0");
  });

  it("expands on main button click", () => {
    render(<SpeedDial items={ITEMS} />);
    fireEvent.click(mainButton());
    expect(mainButton().getAttribute("aria-expanded")).toBe("true");
    const [first] = itemButtons();
    expect((first.parentElement as HTMLElement).style.opacity).toBe("1");
  });

  it("fires the item handler and closes", () => {
    const onClick = vi.fn();
    render(<SpeedDial items={[{ icon: "Edit", label: "Edit", onClick }]} />);
    fireEvent.click(mainButton());
    fireEvent.click(itemButtons()[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
  });

  it("respects a controlled visible prop", () => {
    const { rerender } = render(<SpeedDial items={ITEMS} visible />);
    expect(mainButton().getAttribute("aria-expanded")).toBe("true");
    rerender(<SpeedDial items={ITEMS} visible={false} />);
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on outside click", () => {
    render(<SpeedDial items={ITEMS} />);
    fireEvent.click(mainButton());
    fireEvent.mouseDown(document.body);
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape", () => {
    render(<SpeedDial items={ITEMS} />);
    fireEvent.click(mainButton());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
  });

  it("does not expand while disabled", () => {
    render(<SpeedDial items={ITEMS} disabled />);
    expect(mainButton().disabled).toBe(true);
    fireEvent.click(mainButton());
    expect(mainButton().getAttribute("aria-expanded")).toBe("false");
  });

  it("renders a mask behind the open dial", () => {
    const { container, rerender } = render(<SpeedDial items={ITEMS} mask />);
    expect(container.querySelector(".backdrop-blur-\\[2px\\]")).toBeNull();
    rerender(
      <SpeedDial items={ITEMS} mask visible />,
    );
    expect(container.querySelector(".backdrop-blur-\\[2px\\]")).not.toBeNull();
  });
});

describe("SpeedDial — labels", () => {
  const labelPills = (container: HTMLElement) =>
    [...container.querySelectorAll("span.whitespace-nowrap")].map(
      (pill) => pill.textContent,
    );

  it("shows labels when expanded for linear dials", () => {
    const { container } = render(<SpeedDial items={ITEMS} visible />);
    expect(labelPills(container)).toEqual(["Edit", "Refresh", "Delete"]);
  });

  it("hides labels when showLabels is off", () => {
    const { container } = render(
      <SpeedDial items={ITEMS} visible showLabels={false} />,
    );
    expect(labelPills(container)).toEqual([]);
  });
});

describe("SpeedDial — per-item styling", () => {
  it("applies a per-item variant and color override", () => {
    render(
      <SpeedDial
        items={[
          { icon: "Edit", label: "Edit", variant: "outline", color: "rose" },
          { icon: "Trash", label: "Delete" },
        ]}
        visible
      />,
    );
    const [edit, del] = itemButtons();
    expect(edit.className).toContain("border-rose-200");
    // Outline copy is `{c}-700` — the contrast-safe step (white/`-600` on the
    // tinted fill was under 4.5:1 for 9 of the 21 tones).
    expect(edit.className).toContain("text-rose-700");
    // The unstyled item falls back to the dial-level default (soft blue).
    expect(del.className).toContain("bg-blue-50");
    expect(del.className).toContain("text-blue-700");
  });

  it("lets the dial-level itemVariant apply when an item has none", () => {
    render(
      <SpeedDial
        items={[{ icon: "Edit", label: "Edit" }]}
        itemVariant="solid"
        itemColor="emerald"
        visible
      />,
    );
    const [first] = itemButtons();
    // Solid fill is `{c}-700` — the contrast-safe step (white on `-500`
    // measured as low as 1.91:1 on yellow).
    expect(first.className).toContain("bg-emerald-700");
  });

  it("widens the spacing unit when one item is bigger", () => {
    const { rerender } = render(
      <SpeedDial items={ITEMS.slice(0, 2)} direction="up" visible />,
    );
    expect(itemTransforms()[1]).toContain("translate(0px, -112px)");
    rerender(
      <SpeedDial
        items={[ITEMS[0], { ...ITEMS[1], size: "xl" }]}
        direction="up"
        visible
      />,
    );
    // xl = 56px + 8px gap = 64px unit for every item.
    expect(itemTransforms()[1]).toContain("translate(0px, -128px)");
  });
});

describe("SpeedDial — geometry", () => {
  it("stacks items vertically for linear up (lg size = 48px + 8px gap)", () => {
    render(<SpeedDial items={ITEMS} direction="up" visible />);
    const [first, second] = itemTransforms();
    expect(first).toContain("translate(0px, -56px)");
    expect(second).toContain("translate(0px, -112px)");
  });

  it("stacks items downward for linear down", () => {
    render(<SpeedDial items={ITEMS} direction="down" visible />);
    const [first] = itemTransforms();
    expect(first).toContain("translate(0px, 56px)");
  });

  it("fans items into the up-right quadrant for quarter-circle", () => {
    render(
      <SpeedDial items={ITEMS} type="quarter-circle" direction="up-right" visible />,
    );
    const [first, , last] = itemTransforms();
    expect(first).toContain("translate(0px, -");
    expect(last).toContain("px, 0px)");
  });

  it("fans items into the down-left quadrant for quarter-circle", () => {
    render(
      <SpeedDial items={ITEMS} type="quarter-circle" direction="down-left" visible />,
    );
    const [first, , last] = itemTransforms();
    expect(first).toContain("translate(-84.14px, 0px)");
    expect(last).toContain("translate(0px, 84.14px)");
  });

  it("places items on a ring for circle type", () => {
    const ring: SpeedDialItem[] = [
      { icon: "Edit", label: "A" },
      { icon: "Refresh", label: "B" },
      { icon: "Trash", label: "C" },
      { icon: "Copy", label: "D" },
    ];
    render(<SpeedDial items={ring} type="circle" visible />);
    const [first, second] = itemTransforms();
    expect(first).toContain("translate(0px, -");
    expect(second).toContain("px, 0px)");
  });

  it("honours an explicit radius for arc types", () => {
    render(
      <SpeedDial
        items={[ITEMS[0]]}
        type="semi-circle"
        direction="up"
        radius={90}
        visible
      />,
    );
    const [first] = itemTransforms();
    expect(first).toContain("translate(0px, -90px)");
  });

  it("ignores radius for the linear type", () => {
    render(<SpeedDial items={ITEMS} direction="up" radius={90} visible />);
    const [first] = itemTransforms();
    expect(first).toContain("translate(0px, -56px)");
  });

  it("falls back for a direction the type does not support", () => {
    render(<SpeedDial items={ITEMS} type="quarter-circle" direction="up" visible />);
    const [first] = itemTransforms();
    expect(first).toContain("translate(0px, -");
  });
});

describe("SpeedDial — glass main button", () => {
  it("renders the main button as glass when the variant is glass", () => {
    render(<SpeedDial items={ITEMS} variant="glass" />);
    const tokens = new Set(mainButton().className.split(/\s+/));
    expect(tokens.has("backdrop-blur-sm")).toBe(true);
    expect(tokens.has("backdrop-saturate-[1.2]")).toBe(true);
  });

  it("forwards the glass chrome props to the main button", () => {
    const { rerender } = render(
      <SpeedDial items={ITEMS} variant="glass" specularMode="classic" />,
    );
    // The specular overlay is an absolutely-positioned gradient layer.
    expect(mainButton().querySelector(".rounded-\\[inherit\\]")).not.toBeNull();
    rerender(<SpeedDial items={ITEMS} variant="glass" vibrancy="high" />);
    expect(mainButton().className).toContain("backdrop-saturate-[1.4]");
    expect(mainButton().querySelector(".rounded-\\[inherit\\]")).toBeNull();
  });
});

describe("SpeedDial — positioning", () => {
  it("lets a consumer position class win over the internal relative", () => {
    const { container } = render(
      <SpeedDial items={ITEMS} className="absolute bottom-6 right-6" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("absolute");
    expect(root.className).not.toContain("relative");
  });

  it("is relative by default", () => {
    const { container } = render(<SpeedDial items={ITEMS} />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "relative",
    );
  });
});

describe("SpeedDial — icon rotation", () => {
  it("rotates the main icon when expanded", () => {
    render(<SpeedDial items={ITEMS} />);
    expect(mainButton().querySelector(".rotate-45")).toBeNull();
    fireEvent.click(mainButton());
    expect(mainButton().querySelector(".rotate-45")).not.toBeNull();
  });

  it("swaps to expandedIcon without rotating", () => {
    render(<SpeedDial items={ITEMS} expandedIcon="Close" visible />);
    expect(mainButton().querySelector("[class*='rotate-45']")).toBeNull();
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, within, act } from "@testing-library/react";
import { CustomColorSwatches } from "./CustomColorSwatches";
import { getTrueColorFillHex } from "../theme/themeColors";
import { TRUE_COLORS } from "../theme";
import { contrastRatio, getSelectionRingHex } from "../utils/colorMath";
import type { KitStorageAdapter } from "../utils/safeStorage";

/** A storage double that behaves like a tiny localStorage. */
function storageDouble(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  const adapter: KitStorageAdapter = {
    getItem: vi.fn((k: string) => map.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      map.set(k, v);
    }),
    removeItem: vi.fn((k: string) => {
      map.delete(k);
    }),
  };
  return { adapter, map };
}

beforeEach(cleanup);

/** jsdom serialises inline `color:` as rgb(); bring it back for contrasts. */
function rgbStyleToHex(styleColor: string): string | null {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/.exec(styleColor);
  if (!m) return null;
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((v) => Number(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

describe("CustomColorSwatches — single", () => {
  it("offers every tone plus the custom swatch in a named group", () => {
    const { container } = render(<CustomColorSwatches />);
    expect(
      screen.getByRole("group", { name: "Colour swatches" }),
    ).toBeInTheDocument();
    // 21 tones as buttons; the custom entry is a colour input, not a button.
    expect(
      within(container).getAllByRole("button", { hidden: false }),
    ).toHaveLength(21);
    expect(screen.getByLabelText(/Custom colour/)).toBeInTheDocument();
  });

  it("picks a tone and reports it with the palette hex", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "blue" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      tone: "blue",
      hex: getTrueColorFillHex("blue", false),
    });
    expect(screen.getByRole("button", { name: "blue" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "blue" }).className).toContain(
      "ring-2",
    );
  });

  it("re-clicking the chosen tone calls the pick off", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches defaultValue={{ tone: "blue", hex: "#3b82f6" }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "blue" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("commits a custom colour from the native picker and saves it", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches onChange={onChange} />);
    const input = screen.getByLabelText(/Custom colour/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "#123456" } });
    expect(onChange).toHaveBeenCalledWith({ tone: "custom", hex: "#123456" });
    // The colour lives on as its own saved dot, selected; the `+` door resets
    // to plain rainbow — it holds nothing.
    const saved = screen.getByRole("button", { name: "Custom colour #123456" });
    expect(saved).toHaveAttribute("aria-pressed", "true");
  });

  it("rejects an invalid value with one warning, staying unselected", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      // Deliberately malformed on purpose.
      <CustomColorSwatches value={{ tone: "puce", hex: "not-a-hex" } as never} />,
    );
    expect(
      screen
        .getAllByRole("button")
        .every((b) => b.getAttribute("aria-pressed") === "false"),
    ).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("disables everything when disabled", () => {
    render(<CustomColorSwatches disabled />);
    for (const button of screen.getAllByRole("button"))
      expect(button).toBeDisabled();
    expect(screen.getByLabelText(/Custom colour/)).toBeDisabled();
  });
});

describe("CustomColorSwatches — dual", () => {
  const blueHex = getTrueColorFillHex("blue", false);

  it("renders filled pills that carry the hex as their label", () => {
    render(<CustomColorSwatches mode="dual" />);
    expect(
      screen.getByRole("group", { name: "Border colour" }),
    ).toBeInTheDocument();
    // The pill for blue shows its hex, tinted by the auto ink.
    const pill = screen.getByRole("button", { name: "blue border" });
    expect(pill).toHaveTextContent(blueHex);
    const label = pill.querySelector("span.font-mono") as HTMLElement;
    const fill = rgbStyleToHex(pill.style.backgroundColor)!;
    const ink = rgbStyleToHex(label.style.color)!;
    expect(contrastRatio(fill, ink)).toBeGreaterThanOrEqual(3);
    // Collapsed by default: width is the dot, so no room for text yet — and
    // the hex stays fully hidden rather than peeking through the clip.
    expect(["12px", "16px", "20px", "28px", "36px"]).toContain(pill.style.width);
    expect(label.style.opacity).toBe("0");
    expect(pill.style.boxShadow).toBe("");
  });

  it("picks a border with auto text, then opens the override popover on re-click", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches mode="dual" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "blue border" }));
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "blue", hex: blueHex },
      text: { mode: "auto" },
    });
    // Selected: open — the hex shows — and ringed in the fill's own deepened hue.
    const picked = screen.getByRole("button", { name: "blue border" });
    expect((picked.querySelector("span.font-mono") as HTMLElement).style.opacity).toBe("1");
    expect(picked.style.boxShadow).toContain(getSelectionRingHex(blueHex, false));
    expect(picked.style.boxShadow).toContain("#ffffff"); // the surface gap
    // Selecting opens the reveal; clicking the selected pill opens the popover.
    fireEvent.click(screen.getByRole("button", { name: "blue border" }));
    const popover = screen.getByRole("group", { name: "Text colour" });
    expect(popover).toBeInTheDocument();
    expect(
      within(popover).getByRole("button", { name: /Automatic/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("overrides the ink from the popover — tone, then back to auto", () => {
    const onChange = vi.fn();
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{ border: { tone: "blue", hex: blueHex }, text: { mode: "auto" } }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "blue border" }));
    const popover = screen.getByRole("group", { name: "Text colour" });
    const greenHex = getTrueColorFillHex("green", false);
    fireEvent.click(within(popover).getByRole("button", { name: "green text colour" }));
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "blue", hex: blueHex },
      text: { mode: "custom", hex: greenHex },
    });
    // The selected pill marks the override on its label.
    const pill = screen.getByRole("button", { name: "blue border" });
    expect(pill.querySelector("[class*='decoration-dotted']")).not.toBeNull();
    // Auto takes it back.
    fireEvent.click(within(popover).getByRole("button", { name: /Automatic/ }));
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "blue", hex: blueHex },
      text: { mode: "auto" },
    });
  });

  it("closes the popover on Escape and returns focus to the pill", () => {
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{ border: { tone: "blue", hex: blueHex }, text: { mode: "auto" } }}
      />,
    );
    const pill = screen.getByRole("button", { name: "blue border" });
    fireEvent.click(pill);
    expect(screen.getByRole("group", { name: "Text colour" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("group", { name: "Text colour" }),
    ).not.toBeInTheDocument();
    expect(document.activeElement).toBe(pill);
  });

  it("closes the popover on an outside press", () => {
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{ border: { tone: "blue", hex: blueHex }, text: { mode: "auto" } }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "blue border" }));
    expect(screen.getByRole("group", { name: "Text colour" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(
      screen.queryByRole("group", { name: "Text colour" }),
    ).not.toBeInTheDocument();
  });

  it("saves a committed custom border as its own pill, ringed in its own hue", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches mode="dual" onChange={onChange} />);
    const input = screen.getByLabelText(
      /^Custom border colour$/,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "#0b0b0b" } });
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "custom", hex: "#0b0b0b" },
      text: { mode: "auto" },
    });
    // The colour outlives the door: its own pill, ringed in its deepened hue.
    const pill = screen.getByRole("button", {
      name: "Custom border colour #0b0b0b",
    });
    expect(pill.style.boxShadow).toContain(getSelectionRingHex("#0b0b0b", false));
    // And the `+` door stays a door — no ring, no fill of its own.
    expect(input.closest("label")!.style.boxShadow).toBe("");
  });

  it("treats an unselected border click as a fresh pick — text resets to auto", () => {
    const onChange = vi.fn();
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{
          border: { tone: "blue", hex: blueHex },
          text: { mode: "custom", hex: "#111111" },
        }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "amber border" }));
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "amber", hex: getTrueColorFillHex("amber", false) },
      text: { mode: "auto" },
    });
  });
});

describe("CustomColorSwatches — saved colours & extras", () => {
  const commitViaPlus = (hex: string) => {
    fireEvent.change(
      screen.getByLabelText(/^Custom border colour$/) as HTMLInputElement,
      { target: { value: hex } },
    );
  };

  it("keeps saved pills when another swatch takes the selection", () => {
    render(<CustomColorSwatches mode="dual" />);
    commitViaPlus("#0b0b0b");
    fireEvent.click(screen.getByRole("button", { name: "blue border" }));
    const pill = screen.getByRole("button", {
      name: "Custom border colour #0b0b0b",
    });
    expect(pill).toHaveAttribute("aria-pressed", "false");
    expect(pill).toBeInTheDocument();
  });

  it("persists saves under the namespaced key and restores them on remount", () => {
    const { adapter, map } = storageDouble();
    render(
      <CustomColorSwatches mode="dual" storageKey="demo" storage={adapter} />,
    );
    commitViaPlus("#0b0b0b");
    expect(adapter.setItem).toHaveBeenCalledWith(
      "ui-kit:swatches:demo",
      JSON.stringify({ v: 1, colors: ["#0b0b0b"] }),
    );
    // Same storage, fresh mount: the pill comes back by itself.
    cleanup();
    expect(map.get("ui-kit:swatches:demo")).toBeTruthy();
    render(
      <CustomColorSwatches mode="dual" storageKey="demo" storage={adapter} />,
    );
    expect(
      screen.getByRole("button", { name: "Custom border colour #0b0b0b" }),
    ).toBeInTheDocument();
  });

  it("without storageKey nothing is written and saves still work", () => {
    const { adapter } = storageDouble();
    render(<CustomColorSwatches mode="dual" storage={adapter} />);
    commitViaPlus("#0b0b0b");
    expect(
      screen.getByRole("button", { name: "Custom border colour #0b0b0b" }),
    ).toBeInTheDocument();
    expect(adapter.setItem).not.toHaveBeenCalled();
  });

  it("re-clicking a saved pill opens its editor; the edit saves in place", () => {
    const onChange = vi.fn();
    const onCustomColorsChange = vi.fn();
    const { adapter } = storageDouble();
    render(
      <CustomColorSwatches
        mode="dual"
        storageKey="demo"
        storage={adapter}
        onChange={onChange}
        onCustomColorsChange={onCustomColorsChange}
      />,
    );
    commitViaPlus("#0b0b0b");
    const pill = screen.getByRole("button", {
      name: "Custom border colour #0b0b0b",
    });
    fireEvent.click(pill); // already selected → the picker opens
    expect(pill).toHaveAttribute("aria-expanded", "true");
    fireEvent.change(screen.getByLabelText("Edit saved colour #0b0b0b"), {
      target: { value: "#0a0a0a" },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      border: { tone: "custom", hex: "#0a0a0a" },
      text: { mode: "auto" },
    });
    expect(onCustomColorsChange).toHaveBeenLastCalledWith(["#0a0a0a"]);
    expect(adapter.setItem).toHaveBeenLastCalledWith(
      "ui-kit:swatches:demo",
      JSON.stringify({ v: 1, colors: ["#0a0a0a"] }),
    );
    expect(
      screen.queryByRole("button", { name: "Custom border colour #0b0b0b" }),
    ).not.toBeInTheDocument();
  });

  it("× removes a saved colour — and clears its selection silently", () => {
    const onChange = vi.fn();
    const { adapter } = storageDouble();
    render(
      <CustomColorSwatches mode="dual" storageKey="demo" storage={adapter} onChange={onChange} />,
    );
    commitViaPlus("#0b0b0b");
    expect(onChange).toHaveBeenCalledTimes(1); // the commit itself
    fireEvent.click(
      screen.getByRole("button", { name: "Remove #0b0b0b from saved colours" }),
    );
    expect(
      screen.queryByRole("button", { name: "Custom border colour #0b0b0b" }),
    ).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1); // deleting ≠ changing the value
    expect(adapter.setItem).toHaveBeenLastCalledWith(
      "ui-kit:swatches:demo",
      JSON.stringify({ v: 1, colors: [] }),
    );
  });

  it("right-click removes a saved colour", () => {
    render(<CustomColorSwatches mode="dual" />);
    commitViaPlus("#0b0b0b");
    fireEvent.contextMenu(
      screen.getByRole("button", { name: "Custom border colour #0b0b0b" }),
    );
    expect(
      screen.queryByRole("button", { name: "Custom border colour #0b0b0b" }),
    ).not.toBeInTheDocument();
  });

  it("a transient selected custom (from a value) renders without a remove control", () => {
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{
          border: { tone: "custom", hex: "#ff00ff" },
          text: { mode: "auto" },
        }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Custom border colour #ff00ff" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Remove #ff00ff from saved colours",
      }),
    ).not.toBeInTheDocument();
  });

  it("opens the text popover from the corner dot on a custom pill", () => {
    render(<CustomColorSwatches mode="dual" />);
    commitViaPlus("#0b0b0b");
    fireEvent.click(
      screen.getByRole("button", { name: "Text colour options for #0b0b0b" }),
    );
    expect(screen.getByRole("group", { name: "Text colour" })).toBeInTheDocument();
  });

  it("merges extras after the palette, deduped against it", () => {
    const blueHex = getTrueColorFillHex("blue", false);
    render(<CustomColorSwatches mode="dual" extraColors={["#123456", blueHex, "#123456"]} />);
    expect(
      screen.getAllByRole("button", { name: "Custom border colour #123456" }),
    ).toHaveLength(1);
    // The palette is untouched — and its colour was not smuggled in twice.
    expect(
      screen.getAllByRole("button", { name: "blue border" }),
    ).toHaveLength(1);
  });

  it("single mode: saves become dots that select, edit and remove", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/^Custom colour$/) as HTMLInputElement, {
      target: { value: "#123456" },
    });
    const dot = screen.getByRole("button", { name: "Custom colour #123456" });
    expect(dot).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(dot); // selected → editor opens
    expect(dot).toHaveAttribute("aria-expanded", "true");
    fireEvent.change(screen.getByLabelText("Edit saved colour #123456"), {
      target: { value: "#654321" },
    });
    expect(onChange).toHaveBeenLastCalledWith({ tone: "custom", hex: "#654321" });
    fireEvent.click(
      screen.getByRole("button", { name: "Remove #654321 from saved colours" }),
    );
    expect(
      screen.queryByRole("button", { name: "Custom colour #654321" }),
    ).not.toBeInTheDocument();
  });
});

describe("CustomColorSwatches — order & condensation", () => {
  const customLabels = () =>
    screen
      .getAllByRole("button")
      .map((b) => b.getAttribute("aria-label") ?? "")
      .filter((l) => /^Custom colour #/.test(l));
  const commitViaPlus = (hex: string) =>
    fireEvent.change(
      screen.getByLabelText(/^Custom colour$/) as HTMLInputElement,
      { target: { value: hex } },
    );

  it("the newest save sits last, beside the door", () => {
    render(<CustomColorSwatches />);
    commitViaPlus("#111111");
    commitViaPlus("#222222");
    commitViaPlus("#111111"); // re-adding promotes it to newest
    expect(customLabels()).toEqual([
      "Custom colour #222222",
      "Custom colour #111111",
    ]);
  });

  it("a plain edit keeps its place in line", () => {
    render(<CustomColorSwatches />);
    commitViaPlus("#111111");
    commitViaPlus("#222222");
    fireEvent.change(screen.getByLabelText("Edit saved colour #111111"), {
      target: { value: "#999999" },
    });
    expect(customLabels()).toEqual([
      "Custom colour #999999",
      "Custom colour #222222",
    ]);
  });

  it("condenses to maxVisible behind a +N chip that unfolds on click", () => {
    render(<CustomColorSwatches maxVisible={3} />);
    const group = screen.getByRole("group", { name: "Colour swatches" });
    // Three dots and the chip — the rest hides behind it.
    expect(
      within(group).getAllByRole("button", { hidden: false }),
    ).toHaveLength(4);
    const chip = within(group).getByRole("button", {
      name: "Show 19 more colours",
    });
    expect(chip).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(chip);
    expect(
      within(group).getByRole("button", { name: "Collapse colours" }),
    ).toHaveAttribute("aria-expanded", "true");
    // All 21 tone dots and the chip; the door is an input, not a button.
    expect(
      within(group).getAllByRole("button", { hidden: false }),
    ).toHaveLength(22);
    fireEvent.click(within(group).getByRole("button", { name: "Collapse colours" }));
    expect(chip).toHaveAttribute("aria-expanded", "false");
  });

  it("the chosen colour keeps a slot on the collapsed row", () => {
    const tail = TRUE_COLORS[TRUE_COLORS.length - 1];
    render(
      <CustomColorSwatches
        maxVisible={3}
        defaultValue={{ tone: tail, hex: "#123456" }}
      />,
    );
    expect(screen.getByRole("button", { name: tail })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      within(screen.getByRole("group", { name: "Colour swatches" })).getAllByRole(
        "button",
        { hidden: false },
      ),
    ).toHaveLength(4); // still folded — the chosen one swapped into view
  });

  it("expandOn=hover unfolds on enter and folds a second after leave", () => {
    vi.useFakeTimers();
    try {
      render(<CustomColorSwatches maxVisible={3} expandOn="hover" />);
      const group = screen.getByRole("group", { name: "Colour swatches" });
      const root = group.parentElement!;
      const visibleButtons = () =>
        within(group).getAllByRole("button", { hidden: false });
      expect(visibleButtons()).toHaveLength(4);
      fireEvent.pointerEnter(root);
      expect(visibleButtons()).toHaveLength(22);
      fireEvent.pointerLeave(root);
      // Grace period: the row waits a beat, still open...
      act(() => void vi.advanceTimersByTime(600));
      expect(visibleButtons()).toHaveLength(22);
      // ...and coming back inside the beat calls the fold off.
      fireEvent.pointerEnter(root);
      act(() => void vi.advanceTimersByTime(2000));
      expect(visibleButtons()).toHaveLength(22);
      // Leave again: after the full beat — plus the retract ripple — it folds.
      fireEvent.pointerLeave(root);
      act(() => void vi.advanceTimersByTime(1000 + 350));
      expect(visibleButtons()).toHaveLength(4);
      expect(
        within(group).getByRole("button", { name: "Show 19 more colours" }),
      ).toHaveAttribute("aria-expanded", "false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("a clicked swatch does not pin the hover row open", () => {
    vi.useFakeTimers();
    try {
      render(<CustomColorSwatches maxVisible={3} expandOn="hover" />);
      const group = screen.getByRole("group", { name: "Colour swatches" });
      const root = group.parentElement!;
      fireEvent.pointerEnter(root);
      const blue = within(group).getByRole("button", { name: "blue" });
      fireEvent.click(blue);
      fireEvent.focus(blue); // a click lands focus — that must not hold the row
      fireEvent.pointerLeave(root);
      act(() => void vi.advanceTimersByTime(1000 + 350));
      expect(
        within(group).getAllByRole("button", { hidden: false }),
      ).toHaveLength(4);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("CustomColorSwatches — revocable pick", () => {
  it("clicking the chosen dot again calls the pick off", () => {
    const onChange = vi.fn();
    render(<CustomColorSwatches onChange={onChange} />);
    const red = screen.getByRole("button", { name: "red" });
    fireEvent.click(red);
    expect(red).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(red);
    expect(red).toHaveAttribute("aria-pressed", "false");
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("a press outside the row calls the pick off", () => {
    const onChange = vi.fn();
    render(
      <CustomColorSwatches
        defaultValue={{ tone: "red", hex: "#ef4444" }}
        onChange={onChange}
      />,
    );
    const red = screen.getByRole("button", { name: "red" });
    expect(red).toHaveAttribute("aria-pressed", "true");
    // A press inside the row keeps the pick — only a press off it revokes.
    fireEvent.pointerDown(
      screen.getByRole("group", { name: "Colour swatches" }),
    );
    expect(onChange).not.toHaveBeenCalledWith(null);
    fireEvent.pointerDown(document.body);
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(red).toHaveAttribute("aria-pressed", "false");
  });

  it("an outside press with the ink popover open dismisses only the popover", () => {
    const onChange = vi.fn();
    render(
      <CustomColorSwatches
        mode="dual"
        defaultValue={{
          border: { tone: "red", hex: "#ef4444" },
          text: { mode: "auto" },
        }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "red border" }));
    expect(
      screen.getByRole("group", { name: "Text colour" }),
    ).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(
      screen.queryByRole("group", { name: "Text colour" }),
    ).not.toBeInTheDocument();
    // The overlay got the press; the pick stands.
    expect(onChange).not.toHaveBeenCalledWith(null);
    expect(screen.getByRole("button", { name: "red border" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

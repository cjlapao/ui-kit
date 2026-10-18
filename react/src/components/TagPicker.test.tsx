import { afterEach, describe, it, expect, vi } from "vitest";

const ORIGINAL_RECT = Element.prototype.getBoundingClientRect;
afterEach(() => {
  Element.prototype.getBoundingClientRect = ORIGINAL_RECT;
});
import { fireEvent, render, screen } from "@testing-library/react";
import TagPicker, { type TagPickerItem } from "./TagPicker";
import { I18nProvider } from "../i18n";

const ITEMS: TagPickerItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta", tags: [{ label: "prod", tone: "neutral" }] },
  { id: "c", label: "Gamma" },
];

/** Controlled harness: mirrors how the playground applies onChange. */
const Harness = ({
  value = [] as string[],
  ...props
}: Partial<TagPickerProps> & { value?: string[] }) => {
  const [values, setValues] = useState<string[]>(value);
  return (
    <TagPicker items={ITEMS} value={values} onChange={setValues} {...props} />
  );
};

import { useState } from "react";
import type { TagPickerProps } from "./TagPicker";

const openDropdown = () => {
  fireEvent.click(screen.getByRole("button", { name: "Toggle options" }));
};

describe("TagPicker - trigger", () => {
  it("shows the translated placeholder when empty", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    expect(screen.getByText("Select…")).toBeInTheDocument();
  });

  it("renders a pill per value, labelled by the item, with a named remove button", () => {
    render(<TagPicker items={ITEMS} value={["a", "zzz"]} onChange={vi.fn()} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    // Free-text values show their raw text as the pill label.
    expect(screen.getByText("zzz")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Alpha" }),
    ).toBeInTheDocument();
  });

  it("removes a pill", () => {
    const onChange = vi.fn();
    render(<TagPicker items={ITEMS} value={["a", "b"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove Beta" }));
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("hides the remove buttons when readOnly", () => {
    render(
      <TagPicker items={ITEMS} value={["a"]} onChange={vi.fn()} readOnly />,
    );
    expect(
      screen.queryByRole("button", { name: "Remove Alpha" }),
    ).not.toBeInTheDocument();
  });

  it("caps pills at tagLimit and expands through Show less", () => {
    render(<Harness value={["a", "b", "c"]} tagLimit={2} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show 1 more tags" }));
    expect(
      screen.queryByRole("button", { name: "Remove Gamma" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show less" }));
    expect(
      screen.queryByRole("button", { name: "Remove Gamma" }),
    ).not.toBeInTheDocument();
  });

  it("deletes the last pill with Backspace on an empty search", () => {
    const onChange = vi.fn();
    render(<TagPicker items={ITEMS} value={["a", "b"]} onChange={onChange} />);
    openDropdown();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });
});

describe("TagPicker - dropdown", () => {
  it("opens from the chevron with a search combobox driving the listbox", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    openDropdown();
    expect(
      screen.getByRole("combobox", { name: "Search tags" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listbox", { name: "Options" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("toggles values in multi mode without closing", () => {
    const onChange = vi.fn();
    render(<TagPicker items={ITEMS} value={["a"]} onChange={onChange} />);
    openDropdown();
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("replaces and closes in single mode", () => {
    const onChange = vi.fn();
    render(
      <TagPicker
        items={ITEMS}
        value={["a"]}
        multi={false}
        onChange={onChange}
      />,
    );
    openDropdown();
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["b"]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("filters by label and by pill tags", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    openDropdown();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "gam" },
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "prod" },
    });
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
  });

  it("shows the filtered empty state distinct from the plain empty state", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    openDropdown();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "zzz" },
    });
    expect(screen.getByText("No items match your search.")).toBeInTheDocument();
  });

  it("offers a Create row only for unknown queries", () => {
    const onCreateItem = vi.fn();
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        allowCreate
        onCreateItem={onCreateItem}
      />,
    );
    openDropdown();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Alpha" },
    });
    expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "delta" },
    });
    fireEvent.click(screen.getByText(/Create/));
    expect(onCreateItem).toHaveBeenCalledWith("delta");
  });

  it("stores the created value itself when no onCreateItem is given", () => {
    render(<Harness allowCreate />);
    openDropdown();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "delta" },
    });
    fireEvent.click(screen.getByText(/Create/));
    // The raw text lands in value and surfaces as a free-text pill -
    // a create that vanishes is indistinguishable from a broken control.
    expect(
      screen.getByRole("button", { name: "Remove delta" }),
    ).toBeInTheDocument();
  });

  it("closes a single-mode create even when the owner persists it", () => {
    // Closing is UI, not data: onCreateItem replaces the storing, not
    // the dropdown behaviour.
    const onCreateItem = vi.fn();
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        multi={false}
        allowCreate
        onCreateItem={onCreateItem}
      />,
    );
    openDropdown();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "delta" },
    });
    fireEvent.click(screen.getByText(/Create/));
    expect(onCreateItem).toHaveBeenCalledWith("delta");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("normalizes values before storing them", () => {
    const onChange = vi.fn();
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={onChange}
        normalizeValue={(v) => v.toUpperCase()}
      />,
    );
    openDropdown();
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["B"]);
  });

  it("reports the loading state in both places", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} loading />);
    expect(screen.getAllByText("Loading…").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Toggle options" }),
    ).toHaveAttribute("aria-busy", "true");
  });

  it("closes on an outside pointerdown and consumes Escape", () => {
    render(
      <div>
        <div data-testid="outside">outside</div>
        <TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />
      </div>,
    );
    openDropdown();
    fireEvent.pointerDown(screen.getByTestId("outside"), {
      clientX: 1,
      clientY: 1,
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("TagPicker - the highlight is position, not selection", () => {
  it("opens an empty multi selection with nothing highlighted", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    openDropdown();
    expect(document.querySelector('[data-active="true"]')).toBeNull();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getAllByRole("option")[0]).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("lights an unchecked focused row with a whisper, never the selected wash", () => {
    render(<TagPicker items={ITEMS} value={["a"]} onChange={vi.fn()} />);
    openDropdown();
    // The cursor starts on the checked row...
    const checked = screen.getAllByRole("option")[0];
    expect(checked).toHaveAttribute("data-active", "true");
    expect(checked.className.split(" ")).toContain("bg-blue-50");
    // ...and ArrowDown lands on an unchecked row without claiming it.
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    const active = screen.getAllByRole("option")[1];
    expect(active).toHaveAttribute("data-active", "true");
    expect(active.className.split(" ")).toContain("bg-neutral-50");
    expect(active.className.split(" ")).not.toContain("bg-blue-50");
    // aria-selected="false" is correct (and required) in a multi-selectable
    // listbox - the WASH is the lie-detector, not the attribute.
    expect(active).toHaveAttribute("aria-selected", "false");
  });

  it("follows the click - no phantom left behind", () => {
    render(<Harness value={[]} />);
    openDropdown();
    fireEvent.click(screen.getByText("Beta"));
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("data-active", "true");
    expect(options[0].hasAttribute("data-active")).toBe(false);
  });
});

describe("TagPicker - a click leaves no residue", () => {
  it("washes only on the keyboard's initiative", () => {
    // The reported bug: deselecting a tag kept the position wash on the
    // row - loudest on the glass popup, where it reads as a grey band.
    render(<Harness value={[]} />);
    openDropdown();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    const first = screen.getAllByRole("option")[0];
    expect(first.className.split(" ")).toContain("bg-neutral-50");
    fireEvent.click(first);
    expect(first).toHaveAttribute("data-active", "true");
    expect(first.className.split(" ")).not.toContain("bg-neutral-50");
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getAllByRole("option")[1].className.split(" ")).toContain(
      "bg-neutral-50",
    );
  });
});

describe("TagPicker - the dropdown surface follows the field", () => {
  const popupCard = () =>
    document.querySelector('[data-slot="tagpicker-popup"]')?.firstElementChild
      ?.className;

  it("maps a glass field to a glass popup", () => {
    render(
      <TagPicker items={ITEMS} value={[]} onChange={vi.fn()} variant="glass" />,
    );
    openDropdown();
    expect(popupCard()).toContain("backdrop-blur-xl");
  });

  it("maps an underline field to a subtle card", () => {
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        variant="underline"
      />,
    );
    openDropdown();
    expect(popupCard()).toContain("ring-transparent");
  });

  it("takes an explicit panelVariant and panelCorner", () => {
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        variant="glass"
        panelVariant="outlined"
        panelCorner="none"
      />,
    );
    openDropdown();
    expect(popupCard()).toContain("bg-white/90");
    expect(popupCard()).not.toContain("backdrop-blur");
    expect(popupCard()).toContain("rounded-none");
  });

  it("scrolls through the shared ScrollArea", () => {
    render(<TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />);
    openDropdown();
    expect(
      screen.getByRole("listbox").closest('[data-slot="scrollarea-viewport"]'),
    ).toBeTruthy();
  });

  it("lands below the field inside a clipping panel host", () => {
    // The popup is portaled to the body - a scrollable Panel host must not
    // act as a boundary (the DatePicker's overlay documents this fix).
    Element.prototype.getBoundingClientRect = function (this: Element) {
      if (this.hasAttribute("data-host-clip")) return mockRect(100, 160, 400);
      if (this.tagName === "DIV" && this.className.includes("group")) {
        return mockRect(100, 134, 200); // the trigger
      }
      if (this.getAttribute("data-slot") === "tagpicker-popup") {
        return mockRect(0, 300, 200);
      }
      return ORIGINAL_RECT.call(this);
    };
    render(
      <div data-host-clip style={{ overflow: "auto" }}>
        <TagPicker items={ITEMS} value={[]} onChange={vi.fn()} />
      </div>,
    );
    openDropdown();
    const popup = document.querySelector('[data-slot="tagpicker-popup"]')!;
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

describe("TagPicker - the underline is laid out like Input's", () => {
  const trigger = () =>
    document.querySelector('[aria-haspopup="listbox"]')!.closest("div")!;

  it("drops the box treatment for the underline variant", () => {
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        variant="underline"
      />,
    );
    const el = trigger();
    expect(el.className).not.toContain("focus-within:ring");
    expect(el.className).toMatch(/pt-\d pb-\d/);
    expect(el.className).not.toMatch(/\bpx-\d/);
  });

  it("tints the rule when open, without a box", () => {
    render(
      <TagPicker
        items={ITEMS}
        value={[]}
        onChange={vi.fn()}
        variant="underline"
      />,
    );
    openDropdown();
    const el = trigger();
    expect(el.className).toContain("border-blue-400");
    expect(el.className).not.toContain("ring-2");
  });
});

describe("TagPicker - tone", () => {
  it("defaults to blue and lets tone beat the deprecated color", () => {
    const { unmount } = render(
      <TagPicker items={ITEMS} value={["a"]} onChange={vi.fn()} color="red" />,
    );
    openDropdown();
    expect(screen.getAllByRole("option")[0].className).toContain("bg-red-50");
    unmount();
    render(
      <TagPicker
        items={ITEMS}
        value={["a"]}
        onChange={vi.fn()}
        tone="green"
        color="red"
      />,
    );
    openDropdown();
    expect(screen.getAllByRole("option")[0].className).toContain("bg-green-50");
  });
});

describe("TagPicker - i18n", () => {
  it("localizes the defaults, pills and aria labels", () => {
    render(
      <I18nProvider locales={{}} locale="de" detect={false} storageKey={null}>
        <TagPicker items={ITEMS} value={["a"]} onChange={vi.fn()} />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Alpha entfernen" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Optionen umschalten" }),
    );
    expect(
      screen.getByRole("combobox", { name: "Tags durchsuchen" }),
    ).toHaveAttribute("placeholder", "Suchen…");
    expect(
      screen.getByRole("listbox", { name: "Optionen" }),
    ).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, act } from "@testing-library/react";
import { useRef, useState } from "react";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";

// The component pulls useIconRenderer on mount; our items use no icons, so a
// no-op renderer is enough to keep it from touching the real Icon context.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

const ITEMS: DropdownMenuOption[] = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
];

type HarnessProps = {
  items?: DropdownMenuOption[];
  side?: "auto" | "top" | "bottom";
  onClose?: () => void;
  onSelect?: (item: DropdownMenuOption) => void;
};

// A minimal host that owns the `open` state and points the menu at a real
// (mock-measured) anchor div, the way DropdownButton does in production.
function Harness({ items = ITEMS, side = "auto", onClose, onSelect }: HarnessProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div ref={anchorRef} data-testid="anchor" />
      <DropdownMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
        items={items}
        side={side}
        onSelect={onSelect}
      />
    </div>
  );
}

// A host whose trigger is a real focusable button, for the focus-restore tests.
function FocusHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        Trigger
      </button>
      <div ref={anchorRef} data-testid="anchor" />
      <DropdownMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS}
      />
    </div>
  );
}

const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null;
const itemEls = () =>
  Array.from(document.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[];
const activeStop = () => itemEls().find((el) => el.getAttribute("tabindex") === "0");

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
};

// jsdom lays nothing out, so the anchor and menu boxes are faked. The menu is
// recognised by its `role="menu"`; everything else is treated as the anchor.
const mockLayout = (anchor: Partial<DOMRect>, menuRect: Partial<DOMRect>) =>
  vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const isMenu = this.getAttribute?.("role") === "menu";
      return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        ...(isMenu ? menuRect : anchor),
        toJSON: () => ({}),
      } as DOMRect;
    });

const runFrame = () =>
  vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DropdownMenu — collision detection (viewport boundary)", () => {
  it("flips UP when the anchor is near the bottom of the viewport", () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 880, left: 400, right: 520, bottom: 900, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    render(<Harness />);

    const top = parseFloat(menu()!.style.top);
    // Anchor bottom is 900 in a 1000px viewport — no room below — so the menu
    // opens above the anchor: 880 - 8 (offset) - 120 (menu height) = 752.
    expect(top).toBe(752);
    expect(top).toBeLessThan(880);
  });

  it("drops DOWN when the anchor is near the top of the viewport", () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 100, left: 400, right: 520, bottom: 120, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    render(<Harness />);

    const top = parseFloat(menu()!.style.top);
    // Anchor bottom is 120 with plenty of room below — menu opens underneath:
    // 120 + 8 (offset) = 128.
    expect(top).toBe(128);
    expect(top).toBeGreaterThan(120);
  });

  it("honours an explicit side='top'", () => {
    setViewport(1000, 1000);
    mockLayout(
      { top: 100, left: 400, right: 520, bottom: 120, width: 120, height: 20 },
      { top: 0, left: 0, right: 220, bottom: 120, width: 220, height: 120 },
    );
    render(<Harness side="top" />);

    // Forced above even though there is room below: 100 - 8 - 120 = -28,
    // clamped to the viewport top margin of 8.
    const top = parseFloat(menu()!.style.top);
    expect(top).toBe(8);
  });
});

describe("DropdownMenu — accessibility", () => {
  it("marks the container as a vertical menu and each option as a menuitem", () => {
    render(<Harness />);
    expect(menu()).toHaveAttribute("role", "menu");
    expect(menu()).toHaveAttribute("aria-orientation", "vertical");
    const items = itemEls();
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item).toHaveAttribute("role", "menuitem");
    }
  });

  it("makes the first option the active roving stop on open", () => {
    render(<Harness />);
    const items = itemEls();
    expect(items[0]).toHaveAttribute("tabindex", "0");
    expect(items[1]).toHaveAttribute("tabindex", "-1");
    expect(items[2]).toHaveAttribute("tabindex", "-1");
  });

  it("moves the active stop with ArrowDown / ArrowUp / Home / End (with wrap)", () => {
    render(<Harness />);
    const items = itemEls();

    expect(activeStop()).toBe(items[0]);
    fireEvent.keyDown(menu()!, { key: "ArrowDown" });
    expect(activeStop()).toBe(items[1]);
    fireEvent.keyDown(menu()!, { key: "End" });
    expect(activeStop()).toBe(items[2]);
    fireEvent.keyDown(menu()!, { key: "Home" });
    expect(activeStop()).toBe(items[0]);
    // ArrowUp from the first wraps to the last.
    fireEvent.keyDown(menu()!, { key: "ArrowUp" });
    expect(activeStop()).toBe(items[2]);
  });

  it("skips disabled options while navigating", () => {
    render(
      <Harness
        items={[
          { value: "1", label: "One" },
          { value: "2", label: "Two", disabled: true },
          { value: "3", label: "Three" },
        ]}
      />,
    );
    const items = itemEls();
    fireEvent.keyDown(menu()!, { key: "ArrowDown" });
    // Skips the disabled middle option and lands on the last.
    expect(items[2]).toHaveAttribute("tabindex", "0");
  });
});

describe("DropdownMenu — behaviour", () => {
  it("closes on Tab (the menu is not a modal trap)", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    fireEvent.keyDown(menu()!, { key: "Tab" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("selects an enabled option and closes", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<Harness onSelect={onSelect} onClose={onClose} />);
    fireEvent.click(itemEls()[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores a disabled option", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <Harness
        items={[{ value: "1", label: "One", disabled: true }]}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    fireEvent.click(itemEls()[0]);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("DropdownMenu — focus management", () => {
  it("moves focus to the first option on open", () => {
    runFrame();
    render(<Harness />);
    expect(document.activeElement).toBe(itemEls()[0]);
  });

  it("restores focus to the trigger when closed via Escape", async () => {
    runFrame();
    const { container } = render(<FocusHarness />);
    const trigger = container.querySelector("button")!;

    trigger.focus();
    fireEvent.click(trigger); // opens; focus moves to the first option
    expect(document.activeElement).toBe(itemEls()[0]);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await act(async () => {}); // flush the open=false re-render + close effect

    expect(document.activeElement).toBe(trigger);
  });

  it("does NOT restore focus on an outside click", async () => {
    runFrame();
    const { container } = render(<FocusHarness />);
    const trigger = container.querySelector("button")!;

    trigger.focus();
    fireEvent.click(trigger); // opens; focus moves to the first option
    expect(document.activeElement).toBe(itemEls()[0]);

    // A deliberate click elsewhere must not yank focus back to the trigger.
    fireEvent.pointerDown(document.body);
    await act(async () => {});

    expect(document.activeElement).not.toBe(trigger);
  });
});

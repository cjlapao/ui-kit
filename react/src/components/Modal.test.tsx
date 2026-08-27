import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal, { MODAL_POSITIONS } from "./Modal";
import { SURFACE_VARIANTS, getSurfaceCornerClass } from "../theme/Theme";

/**
 * The Modal portals into `document.body`, so RTL's `container` is empty —
 * every query has to go through the document.
 */
const open = (props: Partial<React.ComponentProps<typeof Modal>> = {}) => {
  render(
    <Modal isOpen onClose={() => {}} title="Settings" {...props}>
      <p>Body</p>
    </Modal>,
  );
  return {
    panel: () => document.querySelector<HTMLElement>("section[data-variant]"),
    overlay: () => document.querySelector<HTMLElement>(".fixed.inset-0"),
  };
};

const dialog = () => screen.getByRole("dialog");
const header = () =>
  dialog().querySelector<HTMLElement>("div.flex.shrink-0.items-start")!;

beforeEach(() => {
  // jsdom has no layout, so pointer capture is a no-op stub.
  Object.assign(Element.prototype, {
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
    hasPointerCapture: () => false,
  });
});

describe("Modal — surface", () => {
  it("renders a Panel, so it takes the shared corner scale", () => {
    // Was a hardcoded `rounded-[28px]` white box.
    const { panel } = open();
    expect(panel()).not.toBeNull();
    expect(panel()!.className).toContain(getSurfaceCornerClass("rounded-md"));
  });

  it.each(SURFACE_VARIANTS)("supports the %s surface", (variant) => {
    open({ variant });
    expect(
      document.querySelector(`section[data-variant="${variant}"]`),
    ).not.toBeNull();
  });

  it("accepts a different corner", () => {
    const { panel } = open({ corner: "rounded-xl" });
    expect(panel()!.className).toContain(getSurfaceCornerClass("rounded-xl"));
  });
});

describe("Modal — inner regions follow the surface", () => {
  const region = (selector: string) =>
    dialog().querySelector<HTMLElement>(selector)!;

  it("keeps the recessed fill on a solid surface", () => {
    open({ variant: "elevated", footer: <span>f</span> });
    expect(region(".flex-1.overflow-hidden").className).toContain(
      "bg-neutral-50",
    );
  });

  it.each(["glass", "liquid-glass", "default"] as const)(
    "drops the opaque fill on the %s surface",
    (variant) => {
      // An opaque `bg-neutral-50` over a glass card reads as a hole punched
      // through it — the header looked like glass and nothing else did.
      open({ variant, footer: <span>f</span>, bodyHeader: <span>bh</span> });
      const body = region(".flex-1.overflow-hidden");
      expect(body.className).not.toContain("bg-neutral-50");
      expect(body.className).toContain("bg-white/10");
    },
  );

  it("uses the surface's own hairline on glass", () => {
    open({ variant: "glass" });
    expect(header().className).not.toContain("border-neutral-200/70");
    expect(header().className).toContain("border-white/30");
  });

  it("takes its copy colour from the surface", () => {
    open({ variant: "liquid-glass", description: "Sub" });
    const heading = dialog().querySelector("h2")!;
    expect(heading.className).toContain("text-neutral-900");
  });
});

describe("Modal — position", () => {
  it.each(MODAL_POSITIONS)("places the dialog %s", (position) => {
    const { overlay } = open({ position });
    if (position === "center") {
      expect(overlay()!.className).toContain("items-center justify-center");
    }
    expect(overlay()!.className).toMatch(/items-(start|center|end)/);
    expect(overlay()!.className).toMatch(/justify-(start|center|end)/);
  });

  it("centres by default", () => {
    const { overlay } = open();
    expect(overlay()!.className).toContain("items-center justify-center");
  });
});

describe("Modal — maximise", () => {
  it("has no maximise button unless asked", () => {
    open();
    expect(screen.queryByRole("button", { name: /Maximi/ })).toBeNull();
  });

  it("toggles, and reports the change", () => {
    const onMaximizedChange = vi.fn();
    open({ showMaximizeButton: true, onMaximizedChange });

    const button = screen.getByRole("button", { name: "Maximise dialog" });
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);
    expect(onMaximizedChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("button", { name: "Restore dialog" }).getAttribute(
        "aria-pressed",
      ),
    ).toBe("true");
  });

  it("opens maximised on request", () => {
    const { panel } = open({ showMaximized: true });
    expect(panel()!.className).toContain("h-full");
  });
});

describe("Modal — dragging", () => {
  it("marks the header as a drag handle by default", () => {
    open();
    expect(header().className).toContain("cursor-grab");
  });

  it("does not when dragging is off", () => {
    open({ draggable: false });
    expect(header().className).not.toContain("cursor-grab");
  });

  it("moves the dialog", () => {
    const { panel } = open();
    expect(panel()!.style.transform).toBe("");

    fireEvent.pointerDown(header(), { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(header(), { pointerId: 1, clientX: 160, clientY: 140 });
    expect(panel()!.style.transform).toContain("translate(");

    fireEvent.pointerUp(header(), { pointerId: 1 });
  });

  it("ignores a drag started on a header control", () => {
    // Otherwise pressing Close or a header action would drag the window.
    const { panel } = open({ showMaximizeButton: true });
    const close = screen.getByRole("button", { name: "Close dialog" });

    fireEvent.pointerDown(close, { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(header(), { pointerId: 1, clientX: 200, clientY: 200 });
    expect(panel()!.style.transform).toBe("");
  });

  it("is disabled while maximised", () => {
    open({ showMaximized: true });
    expect(header().className).not.toContain("cursor-grab");
  });
});

describe("Modal — headless", () => {
  it("drops the header entirely", () => {
    open({ headless: true });
    expect(screen.queryByText("Settings")).toBeNull();
    expect(screen.queryByRole("button", { name: "Close dialog" })).toBeNull();
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("still closes on Escape", () => {
    const onClose = vi.fn();
    open({ headless: true, onClose });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});

describe("Modal — Escape and stacking", () => {
  it("closes only the innermost dialog", () => {
    // Every mounted Modal used to add its own document listener, so one
    // Escape closed the whole stack.
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <>
        <Modal isOpen onClose={outer} title="Outer">
          outer
        </Modal>
        <Modal isOpen onClose={inner} title="Inner">
          inner
        </Modal>
      </>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it("does not close when closeOnEsc is off", () => {
    const onClose = vi.fn();
    open({ onClose, closeOnEsc: false });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("Modal — focus trap", () => {
  it("wraps Tab from the last control back to the first", () => {
    // `aria-modal="true"` promises focus stays inside; nothing enforced it, so
    // Tab walked straight out into the page behind the overlay.
    open({
      footer: <button type="button">Save</button>,
    });
    const save = screen.getByRole("button", { name: "Save" });
    save.focus();

    fireEvent.keyDown(dialog(), { key: "Tab" });
    expect(document.activeElement).not.toBe(save);
    expect(dialog().contains(document.activeElement)).toBe(true);
  });

  it("wraps Shift+Tab from the first control to the last", () => {
    open({ footer: <button type="button">Save</button> });
    const close = screen.getByRole("button", { name: "Close dialog" });
    close.focus();

    fireEvent.keyDown(dialog(), { key: "Tab", shiftKey: true });
    expect(dialog().contains(document.activeElement)).toBe(true);
  });
});

describe("Modal — basics still work", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="x">
        body
      </Modal>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("closes on a backdrop click", () => {
    const onClose = vi.fn();
    const { overlay } = open({ onClose });
    fireEvent.mouseDown(overlay()!);
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the dialog open when the body is clicked", () => {
    const onClose = vi.fn();
    open({ onClose });
    fireEvent.mouseDown(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

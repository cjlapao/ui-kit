import { useState } from "react";
import { act } from "react";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import InlinePanel from "./InlinePanel";

// jsdom runs no transition animations; make rAF fire synchronously so the
// open/close focus effects settle within the test.
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

beforeEach(() => {
  // jsdom has no layout, so pointer capture is a no-op stub.
  Object.assign(Element.prototype, {
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
  });
});

describe("InlinePanel — focus management", () => {
  function Harness() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setIsOpen(true)}>
          Open
        </button>
        <InlinePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Filters"
        >
          <p>Panel body</p>
        </InlinePanel>
      </>
    );
  }

  it("restores focus to the trigger when the panel closes (Escape)", async () => {
    runFrame();
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });
    await act(async () => {});

    // The panel unmounts on transitionend, which jsdom never fires — the
    // focus restore happens on `isOpen=false`, well before the unmount.
    expect(document.activeElement).toBe(trigger);

    // Finish the exit animation (the listener is on the shell, the
    // dialog's parent) and assert the unmount.
    fireEvent.transitionEnd(dialog.parentElement as HTMLElement);
    await act(async () => {});
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

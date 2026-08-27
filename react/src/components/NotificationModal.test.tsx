import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NotificationModal, { NOTIFICATION_TYPES } from "./NotificationModal";

const base = {
  isOpen: true,
  onClose: vi.fn(),
  title: "Heads up",
  message: "Something happened",
};

describe("NotificationModal", () => {
  it("renders every type", () => {
    for (const type of NOTIFICATION_TYPES) {
      const { unmount } = render(<NotificationModal {...base} type={type} />);
      expect(screen.getByText("Heads up")).toBeTruthy();
      unmount();
    }
  });

  it("gives error and warning different glyphs", () => {
    // Both used to map to `Warning`, so a failure and a caution were
    // indistinguishable. The Modal portals, so read `document`, not the
    // render container — which is empty.
    const { unmount } = render(<NotificationModal {...base} type="error" />);
    const errHtml = document.body.innerHTML;
    unmount();
    render(<NotificationModal {...base} type="warning" />);
    expect(errHtml).not.toBe(document.body.innerHTML);
    expect(errHtml).not.toBe("");
  });

  it("gives the message a dark-mode colour", () => {
    // Was a bare `text-gray-600`, so the copy was near-invisible on a dark
    // modal.
    render(<NotificationModal {...base} />);
    const msg = screen.getByText("Something happened");
    expect(msg.className).toContain("dark:");
  });

  it("no longer carries the dead `titleColor` classes", () => {
    render(<NotificationModal {...base} type="success" />);
    expect(document.body.innerHTML).not.toContain("text-emerald-900");
  });

  it("calls onAction, or falls back to onClose", () => {
    const onAction = vi.fn();
    const { unmount } = render(
      <NotificationModal {...base} actionLabel="Go" onAction={onAction} />,
    );
    fireEvent.click(screen.getByText("Go"));
    expect(onAction).toHaveBeenCalled();
    unmount();

    const onClose = vi.fn();
    render(
      <NotificationModal {...base} onClose={onClose} actionLabel="Dismiss" />,
    );
    fireEvent.click(screen.getByText("Dismiss"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows a secondary action when asked", () => {
    const onSecondary = vi.fn();
    render(
      <NotificationModal
        {...base}
        secondaryActionLabel="Cancel"
        onSecondaryAction={onSecondary}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onSecondary).toHaveBeenCalled();
  });

  it("lets the caller override the tone and glyph the type would pick", () => {
    render(<NotificationModal {...base} type="info" tone="fuchsia" />);
    expect(document.body.innerHTML).toContain("fuchsia");
  });
});

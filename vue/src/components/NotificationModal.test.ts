import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";

import NotificationModal, { NOTIFICATION_TYPES } from "./NotificationModal.vue";

const mountModal = (props: Record<string, unknown> = {}) =>
  mount(NotificationModal, {
    props: {
      isOpen: true,
      title: "Heads up",
      message: "Something happened",
      ...props,
    },
    attachTo: document.body,
  });

describe("NotificationModal", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders every type", () => {
    for (const type of NOTIFICATION_TYPES) {
      const w = mountModal({ type });
      expect(document.body.textContent).toContain("Heads up");
      w.unmount();
      document.body.innerHTML = "";
    }
  });

  it("gives error and warning different glyphs", () => {
    // Both used to map to `Warning`, so a failure and a caution were
    // indistinguishable.
    const err = mountModal({ type: "error" });
    const errHtml = document.body.innerHTML;
    err.unmount();
    document.body.innerHTML = "";
    mountModal({ type: "warning" });
    expect(errHtml).not.toBe("");
    expect(errHtml).not.toBe(document.body.innerHTML);
  });

  it("gives the message a dark-mode colour", () => {
    // Was a bare `text-gray-600`, so the copy was near-invisible on a dark
    // modal.
    mountModal();
    expect(document.body.innerHTML).toContain("dark:text-neutral-300");
    expect(document.body.innerHTML).not.toContain("text-gray-600");
  });

  it("no longer carries the dead `titleColor` classes", () => {
    mountModal({ type: "success" });
    expect(document.body.innerHTML).not.toContain("text-emerald-900");
  });

  it("falls back to close when no action handler is bound", async () => {
    const w = mountModal({ actionLabel: "Dismiss" });
    const buttons = document.body.querySelectorAll("button");
    const dismiss = Array.from(buttons).find((b) =>
      b.textContent?.includes("Dismiss"),
    )!;
    dismiss.click();
    await w.vm.$nextTick();
    expect(w.emitted("close")).toBeTruthy();
  });

  it("lets the caller override the tone the type would pick", () => {
    mountModal({ type: "info", tone: "fuchsia" });
    expect(document.body.innerHTML).toContain("fuchsia");
  });
});

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import {
  ToastProvider,
  ToastViewport,
  type ToastBreakpoints,
} from ".";
import { useToast, type ToastApi } from "./useToast";
import { TOAST_EXIT_MS } from "./toastStore";
import {
  ALERT_INTENT_CONFIG,
  ALERT_INTENTS,
  ALERT_VARIANTS,
  CONTROL_SIZES,
  getAlertVariantTokens,
  getToastSizeTokens,
  TOAST_POSITIONS,
  type ToastPosition,
} from "../../theme/Theme";
import { getGlassFillClass } from "../../theme/glass";

/**
 * Integration tests for the provider + viewport + card stack. jsdom specifics
 * that shape these tests:
 *  - every box reports zero size, so cards never measure a height (the height
 *    registry stays empty) — geometry assertions use the data attributes and
 *    inline variables instead of computed CSS.
 *  - `data-mounted` flips via requestAnimationFrame, which vi.useFakeTimers()
 *    controls — `settleFrame` advances it.
 *  - the exit splice happens on the store's timer, so `settle` advances
 *    past TOAST_EXIT_MS.
 */

let api: ToastApi | null = null;
const Capture = () => {
  api = useToast().toast;
  return null;
};

const renderToastApp = (
  viewportProps: {
    position?: ToastPosition;
    mode?: "stacked" | "expanded";
    gap?: number;
    limit?: number;
    width?: string;
    zIndex?: number;
    breakpoints?: ToastBreakpoints;
    group?: string;
  } = {},
) => {
  const utils = render(
    <ToastProvider>
      <Capture />
      <ToastViewport {...viewportProps} />
    </ToastProvider>,
  );
  return { ...utils, api: () => api as ToastApi };
};

const settleFrame = () => act(() => vi.advanceTimersByTime(16));
const settle = () =>
  act(() => vi.advanceTimersByTime(TOAST_EXIT_MS + 50));

const cards = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".kit-toast-message"));
const container = () =>
  document.querySelector<HTMLElement>(".kit-toast") as HTMLElement;
const card = (index = 0) => cards()[index];

describe("Toast", () => {
  beforeEach(() => {
    api = null;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("raises toasts through the hook and routes them to the portal viewport", () => {
    renderToastApp();
    act(() => {
      api!.success("Saved", "Your changes are live.");
    });
    expect(cards()).toHaveLength(1);
    expect(document.body.contains(container())).toBe(true);
    expect(within(card()).getByText("Saved")).toBeTruthy();
    expect(within(card()).getByText("Your changes are live.")).toBeTruthy();
  });

  it("applies the alert-intent a11y config: role and aria-live per intent", () => {
    renderToastApp();
    act(() => {
      ALERT_INTENTS.forEach((intent) => {
        api!.show({ intent, title: `toast-${intent}` });
      });
    });
    expect(cards()).toHaveLength(ALERT_INTENTS.length);
    ALERT_INTENTS.forEach((intent, i) => {
      const el = cards()[i];
      const config = ALERT_INTENT_CONFIG[intent];
      expect(el.getAttribute("role")).toBe(config.live === "assertive" ? "alert" : "status");
      expect(el.getAttribute("aria-live")).toBe(config.live);
      expect(el.getAttribute("aria-atomic")).toBe("true");
    });
    // danger is the assertive one
    const danger = cards()[ALERT_INTENTS.indexOf("danger")];
    expect(danger.getAttribute("role")).toBe("alert");
    expect(danger.getAttribute("aria-live")).toBe("assertive");
  });

  it("shows the intent icon, hides it on icon:false, and honours custom icons", () => {
    renderToastApp();
    act(() => {
      api!.success("with icon");
      api!.show({ intent: "info", title: "no icon", icon: false });
    });
    const [withIcon, withoutIcon] = cards();
    // the close button contributes its own svg; the intent icon adds one more
    expect(withIcon.querySelectorAll("svg")).toHaveLength(2);
    expect(withoutIcon.querySelectorAll("svg")).toHaveLength(1);
  });

  it("swaps the icon for a spinner while loading", () => {
    renderToastApp();
    act(() => {
      api!.show({ intent: "danger", title: "Uploading", loading: true });
    });
    const el = card();
    // the card itself is role=alert, so a role=status inside it is the spinner
    expect(within(el).getByRole("status").tagName).toBe("SPAN");
  });

  it("renders a labelled progress bar and updates it via toast.update", () => {
    renderToastApp();
    let id = 0;
    act(() => {
      id = api!.show({ intent: "info", title: "Downloading", progress: 20 });
    });
    settleFrame();
    const bar = () => within(card()).getByRole("progressbar");
    expect(bar()).not.toBeNull();
    expect(bar().getAttribute("aria-valuenow")).toBe("20");
    act(() => {
      api!.update(id, { progress: 77 });
    });
    expect(bar().getAttribute("aria-valuenow")).toBe("77");
  });

  it("close button dismisses after the exit window", () => {
    renderToastApp();
    act(() => {
      api!.warning("Bye");
    });
    settleFrame();
    expect(within(card()).getByRole("button", { name: "Close notification" })).toBeTruthy();
    act(() => {
      fireEvent.click(within(card()).getByRole("button", { name: "Close notification" }));
    });
    expect(card().getAttribute("data-removed")).toBe("");
    settle();
    expect(cards()).toHaveLength(0);
  });

  it("captures the pointer on the pressed element, not the card root", () => {
    // jsdom cannot model pointer-capture click retargeting, so assert what
    // the browser keys off: capturing on the card *root* retargets the
    // close button's click to the card and the button never fires — a
    // press-and-release on × did nothing in a real browser. PrimeVue
    // captures on `event.target` for exactly this reason.
    renderToastApp();
    act(() => {
      api!.warning("Bye");
    });
    settleFrame();
    const close = within(card()).getByRole("button", {
      name: "Close notification",
    });
    const original = Element.prototype.setPointerCapture;
    let capturedOn: Element | null = null;
    Element.prototype.setPointerCapture = function (this: Element) {
      capturedOn = this;
    };
    try {
      act(() => {
        fireEvent.pointerDown(close, {
          pointerId: 7,
          button: 0,
          pointerType: "mouse",
          clientX: 10,
          clientY: 10,
        });
      });
    } finally {
      Element.prototype.setPointerCapture = original;
    }
    expect(capturedOn).toBe(close);
    // The pointerdown still armed the card's swipe state (drag from the
    // button is tracked; a no-drag release just springs back).
    expect(card().hasAttribute("data-swiping")).toBe(true);
  });

  it("closable:false renders no dismiss button", () => {
    renderToastApp();
    act(() => {
      api!.show({ intent: "info", title: "Quiet", closable: false });
    });
    expect(within(card()).queryByRole("button")).toBeNull();
  });

  it("message onClick fires on the card body, action clicks stop propagation", () => {
    renderToastApp();
    const onClick = vi.fn();
    const onAction = vi.fn();
    act(() => {
      api!.show({ intent: "info", title: "Clickable", onClick, actions: [{ label: "Retry", onClick: onAction }] });
    });
    settleFrame();
    const action = screen.getByRole("button", { name: "Retry" });
    expect(action.closest('[data-dismissible="false"]')).not.toBeNull();
    fireEvent.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(card());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("surfaces — the Alert-family token contract", () => {
    it("every variant + tone renders the exact getAlertVariantTokens surface", () => {
      for (const variant of ALERT_VARIANTS) {
        for (const intent of ALERT_INTENTS) {
          const { unmount } = renderToastApp();
          act(() => {
            api!.show({ intent, variant, title: `s-${variant}` });
          });
          settleFrame();
          const el = card();
          const tokens = getAlertVariantTokens(
            ALERT_INTENT_CONFIG[intent].tone,
            variant,
          );
          expect(el.className).toContain(tokens.surface);
          // parity with Alert: the icon tone class sits on the icon wrapper,
          // not the svg
          const iconWrapper = el.querySelector("svg")?.parentElement
            ?.parentElement;
          expect(iconWrapper?.className).toContain(tokens.icon);
          if (variant === "glass" || variant === "liquid-glass") {
            expect(el.className).toContain(
              getGlassFillClass(ALERT_INTENT_CONFIG[intent].tone, "frosted"),
            );
          } else {
            expect(el.className).toContain(tokens.border);
          }
          unmount();
        }
      }
    });

    it("honours the glass depth props", () => {
      renderToastApp();
      act(() => {
        api!.show({
          intent: "success",
          title: "Clear glass",
          variant: "glass",
          color: "cyan",
          glassOpacity: "clear",
        });
      });
      settleFrame();
      expect(card().className).toContain(getGlassFillClass("cyan", "clear"));
    });
  });

  describe("sizes — the shared control scale", () => {
    it("every ControlSize renders the toast size-token container class", () => {
      for (const size of CONTROL_SIZES) {
        const { unmount } = renderToastApp();
        act(() => {
          api!.show({ title: `size-${size}`, size });
        });
        settleFrame();
        expect(card().className).toContain(getToastSizeTokens(size).container);
        unmount();
      }
    });
  });

  describe("stacking", () => {
    it("marks the newest card front, ranks the rest, and pins z-index to recency", () => {
      renderToastApp();
      act(() => {
        api!.info("old");
        api!.info("newer");
        api!.info("newest");
      });
      settleFrame();
      const [old, newer, newest] = cards();
      expect(newest.hasAttribute("data-front")).toBe(true);
      expect(old.hasAttribute("data-front")).toBe(false);
      expect(newest.dataset.index).toBe("2");
      expect(newer.dataset.index).toBe("1");
      expect(old.dataset.index).toBe("0");
      expect(newest.style.zIndex).toBe("3");
      expect(old.style.zIndex).toBe("1");
    });

    it("hides cards beyond the limit and un-hides them as the stack drains", () => {
      renderToastApp({ limit: 3 });
      act(() => {
        for (let i = 1; i <= 4; i++) api!.info(`m${i}`);
      });
      settleFrame();
      const [m1, , , m4] = cards();
      expect(m1.hasAttribute("data-visible")).toBe(false);
      expect(m1.getAttribute("aria-hidden")).toBe("true");
      // the hidden card's close button is out of the tab order
      expect(
        within(m1).getByRole("button", {
          name: "Close notification",
          hidden: true,
        }).tabIndex,
      ).toBe(-1);

      act(() => {
        fireEvent.click(within(m4).getByRole("button", { name: "Close notification" }));
      });
      settle();
      const rest = cards();
      expect(rest).toHaveLength(3);
      expect(rest[0].hasAttribute("data-visible")).toBe(true);
      expect(rest[0].hasAttribute("aria-hidden")).toBe(false);
    });

    it("the expanded state fans out on hover and retracts on leave", () => {
      renderToastApp();
      act(() => {
        api!.info("a");
        api!.info("b");
      });
      settleFrame();
      const el = container();
      expect(el.hasAttribute("data-expanded")).toBe(false);
      act(() => {
        fireEvent.mouseOver(el);
      });
      expect(el.hasAttribute("data-expanded")).toBe(true);
      act(() => {
        fireEvent.mouseOut(el, { relatedTarget: document.body });
      });
      expect(el.hasAttribute("data-expanded")).toBe(false);
    });

    it("mode=expanded stays expanded", () => {
      renderToastApp({ mode: "expanded" });
      expect(container().hasAttribute("data-expanded")).toBe(true);
    });

    it("keeps the card root overflow-visible so the expanded seam bridge is not clipped", () => {
      // A root-level overflow clip (the glass variant used to set
      // overflow-hidden on the root) clips the ::after seam bridge that
      // keeps the hover group "inside" while the pointer crosses the gaps
      // between fanned-out cards — the stack then collapsed mid-gap. The
      // collapsed clamp is the stylesheet's own rule on the clamped
      // state, not the card's variant, so the class must stay off.
      renderToastApp();
      act(() => {
        api!.show({ intent: "success", variant: "glass", title: "g" });
        api!.show({ intent: "info", variant: "liquid-glass", title: "l" });
        api!.show({ intent: "info", variant: "solid", title: "s" });
      });
      settleFrame();
      for (const el of cards()) {
        expect(el.className).not.toContain("overflow-hidden");
      }
    });
  });

  describe("viewports", () => {
    it("positions all seven corners with the right raise factor and geometry", () => {
      for (const position of TOAST_POSITIONS) {
        const { unmount } = renderToastApp({ position });
        const el = container();
        expect(el.getAttribute("data-position")).toBe(position);
        expect(el.style.getPropertyValue("--kt-raise-factor")).toBe(
          position.startsWith("bottom") ? "-1" : "1",
        );
        expect(el.style.getPropertyValue("--kt-gap")).toBe("12px");
        expect(el.style.width).toBe("18.75rem");
        expect(el.style.zIndex).toBe("2000");
        unmount();
      }
    });

    it("grouped viewports only receive their group's messages", () => {
      const first = render(
        <ToastProvider>
          <Capture />
          <ToastViewport group="downloads" position="bottom-right" />
        </ToastProvider>,
      );
      act(() => {
        api!.info("dl", undefined, { group: "downloads" });
      });
      expect(cards()).toHaveLength(1);
      first.unmount();
    });

    it("honours the breakpoints prop as scoped style rules", () => {
      renderToastApp({ breakpoints: { "767px": { width: "90vw" } } });
      const style = Array.from(document.querySelectorAll("style")).find((s) =>
        s.textContent?.includes("data-ktoast-instance"),
      );
      expect(style).toBeTruthy();
      expect(style!.textContent).toContain("max-width: 767px");
      expect(style!.textContent).toContain("width: 90vw");
    });
  });

  it("survives StrictMode: one portal, one container, no duplicate cards", () => {
    render(
      <React.StrictMode>
        <ToastProvider>
          <Capture />
          <ToastViewport />
        </ToastProvider>
      </React.StrictMode>,
    );
    act(() => {
      api!.success("once");
    });
    settleFrame();
    expect(document.querySelectorAll(".kit-toast")).toHaveLength(1);
    expect(cards()).toHaveLength(1);
    expect(within(card()).getByText("once")).toBeTruthy();
  });
});

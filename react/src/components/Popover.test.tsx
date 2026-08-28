import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Popover, { POPOVER_PLACEMENTS } from "./Popover";
import { SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

/**
 * The overlay's enter/leave classes only complete via `animationend`, which
 * jsdom never fires on its own — a helper advances the state machine.
 * jsdom quirks: no `AnimationEvent` constructor (so `animationName` is
 * defined manually), and because jsdom's CSSStyleDeclaration exposes
 * `webkitAnimation`, React 19 subscribes to the legacy camelCase
 * `webkitAnimationEnd` name rather than `animationend` — so both are
 * dispatched. In real browsers the unprefixed name is used.
 */
const completeOverlayPhase = (
  wrapper: Element,
  phase: "entering" | "leaving",
) =>
  act(async () => {
    const animationName =
      phase === "entering" ? "popover-overlay-enter" : "popover-overlay-leave";
    for (const type of ["animationend", "webkitAnimationEnd"]) {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, "animationName", { value: animationName });
      wrapper.dispatchEvent(event);
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  });

const overlay = () =>
  document.querySelector<HTMLElement>(".popover-overlay");

const openPopover = async () => {
  fireEvent.click(screen.getByRole("button", { name: /Toggle/ }));
  const w = overlay();
  expect(w).not.toBeNull();
  await completeOverlayPhase(w as Element, "entering");
  return w as HTMLElement;
};

/**
 * jsdom reports every box as zero-sized, which (correctly) makes the
 * component skip positioning. A prototype-level mock gives every element a
 * deterministic rect; specific elements (the trigger for flip tests) get
 * their own via the `rects` map.
 */
const makeRect = (
  rect: Partial<{ top: number; left: number; width: number; height: number }>,
): DOMRect => {
  const top = rect.top ?? 400;
  const left = rect.left ?? 400;
  const width = rect.width ?? 300;
  const height = rect.height ?? 160;
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
};

const rects = new Map<Element, DOMRect>();
const DEFAULT_RECT = makeRect({});

beforeEach(() => {
  rects.clear();
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      return rects.get(this) ?? DEFAULT_RECT;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderPopover = (props: Partial<React.ComponentProps<typeof Popover>> = {}) =>
  render(
    <Popover trigger={<button type="button">Toggle</button>} {...props}>
      <span data-testid="popover-content">content</span>
    </Popover>,
  );

describe("Popover", () => {
  it("exports the runtime placement list", () => {
    expect(POPOVER_PLACEMENTS).toEqual(["auto", "top", "bottom", "left", "right"]);
  });

  it("starts closed: no overlay, trigger advertises the dialog", () => {
    renderPopover();
    expect(overlay()).toBeNull();
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
  });

  it("opens on trigger click, fires onShow, positions the overlay", async () => {
    const onShow = vi.fn();
    renderPopover({ onShow });
    await openPopover();
    const w = overlay() as HTMLElement;
    expect(w).toHaveAttribute("role", "dialog");
    expect(w).toHaveAttribute("aria-modal", "false");
    expect(onShow).toHaveBeenCalledTimes(1);
    // Default anchor rect (400,400,300×160) → bottom side, left 400.
    expect(w).toHaveAttribute("data-placement", "bottom");
    expect(w.style.top).toBe("568px");
    expect(w.style.left).toBe("400px");
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", w.id);
  });

  it("points the arrow at the trigger's centre (caret − half the arrow)", async () => {
    renderPopover();
    await openPopover();
    const w = overlay() as HTMLElement;
    const arrow = w.querySelector<HTMLElement>(".rotate-45");
    expect(arrow).not.toBeNull();
    // The diamond sits in a clip window centred on the caret: trigger
    // centre x = 550; grow box left = 400 → caret 150 → window at 150 − 11.31.
    const clip = arrow!.parentElement as HTMLElement;
    expect(clip.style.left).toBe("138.69px");
    expect(clip.style.top).toBe("-11.31px");
    expect(clip.style.width).toBe("22.62px");
    expect(clip.style.height).toBe("11.31px");
    expect(clip.style.overflow).toBe("hidden");
    // The arrow paints over the panel, so the edge cannot run through the V.
    expect(clip.className).toContain("z-20");
    // Bottom side: the visible V is the square's top + left borders.
    expect(arrow!.className).toContain("border-t");
    expect(arrow!.className).toContain("border-l");
  });

  it("clips the arrow to the half outside the panel (no rotated square over glass)", async () => {
    renderPopover();
    await openPopover();
    const w = overlay() as HTMLElement;
    const arrow = w.querySelector<HTMLElement>(".rotate-45");
    expect(arrow).not.toBeNull();
    const clip = arrow!.parentElement as HTMLElement;
    // The 16 px square rotated 45° spans 22.62 px; the window shows only the
    // outer 11.31 px, with the panel edge on its inner boundary. The inner
    // half of the diamond (the part that would sit over the panel) is
    // outside the window's box entirely, so nothing is painted over the
    // surface — this is what removed the "rotated rectangle" on glass.
    const clipR = {
      left: parseFloat(clip.style.left),
      top: parseFloat(clip.style.top),
      width: parseFloat(clip.style.width),
      height: parseFloat(clip.style.height),
    };
    const diamond = {
      left: clipR.left + parseFloat(arrow!.style.left),
      top: clipR.top + parseFloat(arrow!.style.top),
      size: 16,
    };
    // Diamond centre sits exactly on the panel edge (top: 0).
    expect(diamond.top + 8).toBeCloseTo(0, 5);
    // The diamond's bottom (its inner tip) is clipped: it extends to
    // top+16 = +8 in panel coordinates, but only to the clip window's
    // bottom edge (also 0) does it exist.
    expect(clipR.top + clipR.height).toBeCloseTo(0, 5);
  });

  it("notches the panel edge at the caret so the border stops at the V", async () => {
    renderPopover();
    await openPopover();
    const w = overlay() as HTMLElement;
    const notch = w.querySelector<HTMLElement>("[data-popover-notch]");
    expect(notch).not.toBeNull();
    // Bottom side, caret 150: a 24 × 2 strip centred on the caret,
    // straddling the top edge, painted over the panel with its fill.
    expect(notch!.style.left).toBe("138px");
    expect(notch!.style.top).toBe("-1px");
    expect(notch!.style.width).toBe("24px");
    expect(notch!.style.height).toBe("2px");
    expect(notch!.className).toContain("z-10");
    expect(notch!.className).toContain("bg-white");
  });

  it("aligns the box edge to the trigger's edge, not its centre (grow)", async () => {
    const { container } = renderPopover();
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    // A 100 px trigger at (400, 400) with the default 300 px box: centre
    // alignment would land at x=300; grow alignment lands at x=400 (the
    // trigger's left edge), because the box fits on the right.
    rects.set(trigger, makeRect({ top: 400, left: 400, width: 100, height: 40 }));
    fireEvent.click(trigger);
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "entering");
    const positioned = overlay() as HTMLElement;
    expect(positioned).toHaveAttribute("data-placement", "bottom");
    expect(positioned.style.left).toBe("400px");
    // Caret tracks the trigger centre (450): 450 − 400 = 50 → the clip
    // window's left edge is at 50 − 11.31.
    const clip = positioned.querySelector<HTMLElement>(".rotate-45")!.parentElement as HTMLElement;
    expect(clip.style.left).toBe("38.69px");
    expect(container).toBeDefined();
  });

  it("grows left when the box does not fit on the right", async () => {
    const { container } = renderPopover();
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    // Trigger at (800, 400)–(900, 440): a 300 px box to the right would
    // cross the 1024 px viewport, so it grows left — right edge on the
    // trigger's right edge → left = 900 − 300 = 600 (centre would be 700).
    rects.set(trigger, makeRect({ top: 400, left: 800, width: 100, height: 40 }));
    fireEvent.click(trigger);
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "entering");
    const positioned = overlay() as HTMLElement;
    expect(positioned.style.left).toBe("600px");
    // Caret still on the trigger centre (850) → 850 − 600 = 250 → clip
    // window at 250 − 11.31.
    const clip = positioned.querySelector<HTMLElement>(".rotate-45")!.parentElement as HTMLElement;
    expect(clip.style.left).toBe("238.69px");
    expect(container).toBeDefined();
  });

  it("hides the arrow with arrow={false}", async () => {
    renderPopover({ arrow: false });
    await openPopover();
    expect((overlay() as HTMLElement).querySelector(".rotate-45")).toBeNull();
  });

  it("closes on the trigger re-click and fires onHide exactly once", async () => {
    const onShow = vi.fn();
    const onHide = vi.fn();
    renderPopover({ onShow, onHide });
    await openPopover();
    fireEvent.click(screen.getByRole("button", { name: /Toggle/ }));
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "leaving");
    expect(overlay()).toBeNull();
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("returns focus to the trigger when it closes", async () => {
    renderPopover();
    await openPopover();
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    trigger.blur();
    fireEvent.click(trigger);
    await act(async () => {});
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on an outside mousedown when dismissable (default)", async () => {
    renderPopover();
    await openPopover();
    fireEvent.mouseDown(document.body);
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "leaving");
    expect(overlay()).toBeNull();
  });

  it("stays open on an outside mousedown with dismissable={false}", async () => {
    renderPopover({ dismissable: false });
    await openPopover();
    fireEvent.mouseDown(document.body);
    expect(overlay()).not.toBeNull();
  });

  it("closes on Escape and not when closeOnEscape={false}", async () => {
    renderPopover();
    await openPopover();
    fireEvent.keyDown(document, { key: "Escape" });
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "leaving");
    expect(overlay()).toBeNull();

    cleanup();
    renderPopover({ closeOnEscape: false });
    await openPopover();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(overlay()).not.toBeNull();
  });

  it("still fires the trigger's own onClick", async () => {
    const onClick = vi.fn();
    render(
      <Popover
        trigger={
          <button type="button" onClick={onClick}>
            Toggle
          </button>
        }
      >
        <span>content</span>
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Toggle/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(overlay()).not.toBeNull();
  });

  it("controlled: outside click asks via onOpenChange and the overlay stays", async () => {
    const onOpenChange = vi.fn();
    renderPopover({ visible: true, onOpenChange });
    await act(async () => {
      await completeOverlayPhase(overlay() as Element, "entering");
    });
    expect(overlay()).not.toBeNull();
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // The parent kept visible={true} — the overlay must still be there.
    expect(overlay()).not.toBeNull();
  });

  it("controlled: the trigger asks to open through onOpenChange", async () => {
    const onOpenChange = vi.fn();
    renderPopover({ visible: false, onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: /Toggle/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("flips to the top when the anchor sits near the viewport bottom", async () => {
    const { container } = renderPopover();
    const trigger = screen.getByRole("button", { name: /Toggle/ });
    // 40 px tall, 38 px above the 768 px viewport bottom: a 160 px popover
    // does not fit below (38 − 8 < 168), so the shared geometry flips up.
    rects.set(trigger, makeRect({ top: 720, left: 400, width: 300, height: 40 }));
    fireEvent.click(trigger);
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "entering");
    const positioned = overlay() as HTMLElement;
    expect(positioned).toHaveAttribute("data-placement", "top");
    // Box top = 720 − 8 − 160 = 552 → above the anchor's top (720).
    expect(positioned.style.top).toBe("552px");
    // The arrow now rides the bottom edge: the clip window hangs below it.
    const arrow = positioned.querySelector<HTMLElement>(".rotate-45");
    const clip = arrow!.parentElement as HTMLElement;
    expect(clip.style.bottom).toBe("-11.31px");
    // Bottom-side V: the square's bottom + right borders.
    expect(arrow!.className).toContain("border-b");
    expect(arrow!.className).toContain("border-r");
    expect(container).toBeDefined();
  });

  it("honours an explicit placement", async () => {
    renderPopover({ placement: "right" });
    await openPopover();
    const w = overlay() as HTMLElement;
    expect(w).toHaveAttribute("data-placement", "right");
    // Box left = 400 + 300 + 8 = 708.
    expect(w.style.left).toBe("708px");
  });

  /** Initiate the close (trigger re-click), then run the leave animation. */
  const closePopover = async () => {
    fireEvent.click(screen.getByRole("button", { name: /Toggle/ }));
    const w = overlay();
    expect(w).not.toBeNull();
    await completeOverlayPhase(w as Element, "leaving");
    expect(overlay()).toBeNull();
  };

  it("renders every surface variant on the shared Panel", async () => {
    for (const variant of SURFACE_VARIANTS) {
      cleanup();
      renderPopover({ variant });
      await openPopover();
      const w = overlay() as HTMLElement;
      expect(w).toHaveAttribute("data-variant", variant);
      // The surface is a real Panel section inside the wrapper.
      expect(w.querySelector("section")).not.toBeNull();
      await closePopover();
    }
  });

  it("renders every tone with the panel's data attribute", async () => {
    for (const tone of TRUE_COLORS) {
      cleanup();
      renderPopover({ tone });
      await openPopover();
      expect(overlay()).toHaveAttribute("data-tone", tone);
      await closePopover();
    }
  });

  it("gives borderless-variant arrows the tone's edge so they stay visible", async () => {
    // Tonal's panel edge is ring-transparent and its fill is a near-white
    // tint — a transparent V would be an invisible arrow. The arrow instead
    // carries the tone's own border (the same token the panel would use),
    // so the tip reads as outlined while its fill still matches the panel.
    for (const variant of ["tonal", "subtle", "simple"] as const) {
      cleanup();
      renderPopover({ variant, tone: "cyan" });
      await openPopover();
      const arrow = (overlay() as HTMLElement).querySelector<HTMLElement>(
        ".rotate-45",
      );
      expect(arrow).not.toBeNull();
      expect(arrow!.className).toContain("border-cyan-300");
      await closePopover();
    }
  });

  it("keeps the panel's own edge colour on rimmed-variant arrows", async () => {
    cleanup();
    renderPopover({ variant: "glass", tone: "cyan" });
    await openPopover();
    const arrow = (overlay() as HTMLElement).querySelector<HTMLElement>(
      ".rotate-45",
    );
    // Glass rims are tone-independent (white bevel), not the tone border.
    expect(arrow!.className).toContain("border-white/50");
    expect(arrow!.className).not.toContain("border-cyan-300");
    await closePopover();
  });

  it("shows the spinner overlay when loading", async () => {
    renderPopover({ loading: true });
    await openPopover();
    const w = overlay() as HTMLElement;
    expect(w).toHaveAttribute("aria-busy", "true");
    // The kit Loader overlay carries role="status".
    expect(w.querySelector('[role="status"]')).not.toBeNull();
  });

  it("shows the progress loader with its progress value", async () => {
    renderPopover({ loading: true, loaderType: "progress", loaderProgress: 42 });
    await openPopover();
    const w = overlay() as HTMLElement;
    const bar = w.querySelector<HTMLElement>('[role="progressbar"]');
    expect(bar).not.toBeNull();
    expect(bar).toHaveAttribute("aria-valuenow", "42");
  });

  it("replaces the content with a skeleton when loading with skeleton", async () => {
    renderPopover({ loading: true, loaderType: "skeleton", skeletonLines: 2 });
    await openPopover();
    const w = overlay() as HTMLElement;
    expect(screen.queryByTestId("popover-content")).toBeNull();
    // Title bar + two body lines.
    const bars = w.querySelectorAll(".rounded-full");
    expect(bars.length).toBe(3);
    expect(w).toHaveAttribute("aria-busy", "true");
  });

  it("focuses an [autofocus] element when it opens", async () => {
    render(
      <Popover trigger={<button type="button">Toggle</button>}>
        <input autoFocus aria-label="autofocused" />
      </Popover>,
    );
    await openPopover();
    expect(document.activeElement).toBe(screen.getByLabelText("autofocused"));
  });
});

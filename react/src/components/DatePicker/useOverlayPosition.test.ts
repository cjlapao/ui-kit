import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useOverlayPosition } from "./useOverlayPosition";

// The hook measures with getBoundingClientRect and walks the DOM; jsdom
// gives every element a zero rect, so a clipped box is planted per element.

type Box = { top: number; left: number; width: number; height: number };

const setBox = (el: HTMLElement, box: Box) => {
  el.getBoundingClientRect = () =>
    ({
      x: box.left,
      y: box.top,
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height,
      right: box.left + box.width,
      bottom: box.top + box.height,
      toJSON: () => ({}),
    }) as DOMRect;
};

/**
 * Page > card (overflow-hidden for its radius) > body scroller (overflow-auto,
 * only slightly larger than the field) > input — the exact chain a DatePicker
 * inside a scrollable `Panel` produces.
 */
const chain = ({
  cardBox,
  bodyBox,
  anchorBox = { top: 300, left: 60, width: 200, height: 36 },
  filterOnCard = false,
}: {
  cardBox: Box;
  bodyBox: Box;
  anchorBox?: Box;
  filterOnCard?: boolean;
}) => {
  const card = document.createElement("div");
  card.style.overflow = "hidden";
  if (filterOnCard) card.style.filter = "blur(20px)";
  const body = document.createElement("div");
  body.style.overflowY = "auto";
  const anchor = document.createElement("input");
  card.appendChild(body);
  body.appendChild(anchor);
  document.body.appendChild(card);
  setBox(card, cardBox);
  setBox(body, bodyBox);
  setBox(anchor, anchorBox);
  return { anchor, cleanup: () => card.remove() };
};

const openPanel = () => {
  const panel = document.createElement("div");
  document.body.appendChild(panel);
  // A real overlay carries its own transform, so its bbox sits at its
  // rendered spot; jsdom reports 0 until a box is planted here.
  setBox(panel, { top: 340, left: 60, width: 300, height: 300 });
  Object.defineProperty(panel, "offsetWidth", {
    value: 300,
    configurable: true,
  });
  Object.defineProperty(panel, "offsetHeight", {
    value: 300,
    configurable: true,
  });
  Object.defineProperty(panel, "offsetHeight", {
    value: 300,
    configurable: true,
  });
  return { panel, cleanup: () => panel.remove() };
};

const run = async (anchor: HTMLElement, panel: HTMLElement) => {
  const { result } = renderHook(() => {
    const anchorRef = useRef<HTMLElement | null>(anchor);
    const panelRef = useRef<HTMLElement | null>(panel);
    const [open, setOpen] = useState(false);
    useLayoutEffect(() => setOpen(true), []);
    const style = useOverlayPosition(anchorRef, panelRef, open);
    // A rendered fixed overlay has a bbox matching its style — jsdom does
    // not lay it out, so give the hook the honest number it measures.
    useLayoutEffect(() => {
      if (!style) return;
      const top = Number.parseInt(String(style.top ?? "0"), 10) || 0;
      const left = Number.parseInt(String(style.left ?? "0"), 10) || 0;
      panel.getBoundingClientRect = () =>
        ({
          x: left,
          y: top,
          top,
          left,
          width: 300,
          height: 300,
          right: left + 300,
          bottom: top + 300,
          toJSON: () => ({}),
        }) as DOMRect;
    });
    return { style };
  });
  // The style lands after the open-effect's own layout pass, so let the
  // hook settle before reading it.
  await waitFor(() => {
    if (result.current.style === undefined) throw new Error("no style yet");
  });
  return result.current.style as CSSProperties;
};

describe("useOverlayPosition boundary", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 768,
      configurable: true,
    });
  });

  it("clamps to the viewport, not to a clipping panel around the anchor", async () => {
    // Card (overflow-hidden shell) + inner body scroller hugging the field:
    // the portaled overlay is a <body> child, so neither can clip it and
    // neither may clamp it. The old chain walk parked the panel against the
    // scroller's top edge — 268 instead of the honest 340 below the field.
    const { anchor, cleanup: c1 } = chain({
      cardBox: { top: 40, left: 20, width: 900, height: 600 },
      bodyBox: { top: 260, left: 40, width: 840, height: 90 },
    });
    const { panel, cleanup: c2 } = openPanel();
    const style = await run(anchor, panel);
    expect(style.position).toBe("fixed");
    expect(style.top).toBe(300 + 36 + 4); // anchor bottom + offset
    expect(style.left).toBe(60);
    c1();
    c2();
  });

  it("flips to the roomier side and clamps to the viewport margin", async () => {
    // A short viewport: below would overflow by 48px, above by 12 — the
    // hook flips above and lands on the viewport's top margin. Purely
    // viewport math: the card boxes are decoration the fix made irrelevant.
    Object.defineProperty(window, "innerHeight", {
      value: 600,
      configurable: true,
    });
    const { anchor, cleanup: c1 } = chain({
      cardBox: { top: 40, left: 20, width: 900, height: 310 },
      bodyBox: { top: 40, left: 20, width: 900, height: 310 },
    });
    const { panel, cleanup: c2 } = openPanel();
    const style = await run(anchor, panel);
    expect(style.top).toBe(8); // viewport top + margin — above side, clamped
    c1();
    c2();
  });
});

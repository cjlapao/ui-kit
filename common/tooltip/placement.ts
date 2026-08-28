/**
 * Tooltip placement with collision handling.
 *
 * Pure geometry, deliberately free of DOM and framework: both kits call the
 * same function so a tooltip lands in the same place in React and in Vue, and
 * so the interesting part — the flipping and clamping — can be tested directly
 * instead of through a rendered component.
 *
 * What this replaces: the previous implementation clamped the tooltip
 * *horizontally* and nothing else. A `top` tooltip on a trigger near the top of
 * the window rendered off-screen, `left` and `right` did not exist as
 * placements at all, and the caret could drift off the end of a clamped
 * tooltip.
 */

export const TOOLTIP_POSITIONS = ["top", "bottom", "left", "right"] as const;
export type TooltipPosition = (typeof TOOLTIP_POSITIONS)[number];

/** The subset of `DOMRect` this needs. */
export interface TooltipRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface TooltipViewport {
  width: number;
  height: number;
}

/**
 * Intersection of two boxes. A tooltip constrained to a panel must *also* stay
 * on screen, so the two limits combine rather than replace one another.
 */
const intersect = (a: TooltipRect, b: TooltipRect): TooltipRect => {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.left + a.width, b.left + b.width);
  const bottom = Math.min(a.top + a.height, b.top + b.height);
  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
};

export interface TooltipPlacementInput {
  /** The trigger's viewport-relative box. */
  trigger: TooltipRect;
  /** The tooltip's measured size. */
  tooltip: { width: number; height: number };
  viewport: TooltipViewport;
  /**
   * Region the tooltip must stay inside, in viewport coordinates. Defaults to
   * the viewport itself.
   *
   * Pass a scroll container's or panel's rect to keep a tooltip within it —
   * the tooltip then flips and clamps against *that* edge, which is what makes
   * a bounded demo (or a tooltip inside a modal) behave the way the surrounding
   * box implies it should. The boundary is intersected with the viewport, so a
   * constrained tooltip still never leaves the screen.
   */
  boundary?: TooltipRect;
  /** Preferred side. Flipped or reassigned when it does not fit. */
  preferred: TooltipPosition;
  /** Gap between trigger and tooltip. @default 8 */
  offset?: number;
  /** Minimum distance to keep from every viewport edge. @default 8 */
  margin?: number;
  /**
   * Keeps the caret this far from the tooltip's corners, so it never sits on
   * the rounded part or pokes past the end. @default 10
   */
  caretInset?: number;
  /**
   * How the box aligns along the caret axis.
   *
   * `"center"` (default) centres the box on the trigger — what a tooltip
   * should do: it is a label and it floats over its target.
   *
   * `"grow"` grows the box away from the trigger, aligning the near edge
   * with the trigger's near edge: it grows toward the side that has room, so
   * right (left edges aligned) when the box fits there, otherwise left
   * (right edges aligned). What a popover should do: the panel reads as
   * anchored to the button it came from, not floating over its centre.
   *
   * The caret maths below are identical for both — the caret always tracks
   * the trigger's centre after clamping.
   */
  align?: "center" | "grow";
}

export interface TooltipPlacement {
  /** The side actually used — may differ from `preferred` after a flip. */
  side: TooltipPosition;
  /** Viewport-relative position for the tooltip box. */
  left: number;
  top: number;
  /**
   * Caret offset in px from the tooltip's leading edge, along whichever axis
   * the caret slides on: x for `top`/`bottom`, y for `left`/`right`.
   */
  caret: number;
  /** True when the preferred side could not be used. */
  flipped: boolean;
}

const OPPOSITE: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const isVertical = (side: TooltipPosition): boolean =>
  side === "top" || side === "bottom";

const clamp = (value: number, min: number, max: number): number =>
  // `max` can be below `min` when the tooltip is larger than the viewport;
  // pinning to `min` then keeps the top/left edge visible rather than the
  // bottom/right, which is the useful half.
  Math.max(min, Math.min(value, Math.max(min, max)));

/** Space available on a side, between the trigger and the boundary edge. */
const spaceOn = (
  side: TooltipPosition,
  trigger: TooltipRect,
  bounds: TooltipRect,
  margin: number,
): number => {
  switch (side) {
    case "top":
      return trigger.top - bounds.top - margin;
    case "bottom":
      return bounds.top + bounds.height - (trigger.top + trigger.height) - margin;
    case "left":
      return trigger.left - bounds.left - margin;
    case "right":
      return bounds.left + bounds.width - (trigger.left + trigger.width) - margin;
  }
};

/** The region the tooltip must stay inside: boundary ∩ viewport. */
const resolveBounds = (input: TooltipPlacementInput): TooltipRect => {
  const viewportRect: TooltipRect = {
    top: 0,
    left: 0,
    width: input.viewport.width,
    height: input.viewport.height,
  };
  return input.boundary
    ? intersect(viewportRect, input.boundary)
    : viewportRect;
};

/**
 * The `"grow"` alignment along one axis: the box starts at the trigger's
 * near edge and grows toward the side that has room — right/down when the
 * whole box fits there, otherwise left/up — then gets clamped into the
 * bounds. Growing right means the box's leading edge sits on the trigger's
 * leading edge; growing left means its trailing edge sits on the trigger's
 * trailing edge.
 */
const growAlong = (
  axis: "x" | "y",
  trigger: TooltipRect,
  span: number,
  bounds: TooltipRect,
  margin: number,
): number => {
  const from = axis === "x" ? trigger.left : trigger.top;
  const to =
    axis === "x"
      ? trigger.left + trigger.width
      : trigger.top + trigger.height;
  const boundStart = axis === "x" ? bounds.left : bounds.top;
  const boundSpan = axis === "x" ? bounds.width : bounds.height;
  const growsPositive = from + span <= boundStart + boundSpan - margin;
  const value = growsPositive ? from : to - span;
  const min = boundStart + margin;
  const max = boundStart + boundSpan - span - margin;
  return clamp(value, min, max);
};

/** How much room a side needs for the tooltip plus its gap. */
const needsOn = (
  side: TooltipPosition,
  tooltip: { width: number; height: number },
  offset: number,
): number => (isVertical(side) ? tooltip.height : tooltip.width) + offset;

/**
 * Chooses a side: the preferred one if it fits, then its opposite, then the
 * remaining two — and if nothing fits, whichever has the most room, so the
 * tooltip degrades to "least bad" instead of running off the screen.
 */
export const resolveTooltipSide = (
  input: TooltipPlacementInput,
): { side: TooltipPosition; flipped: boolean } => {
  const { trigger, tooltip, preferred } = input;
  const offset = input.offset ?? 8;
  const margin = input.margin ?? 8;
  const bounds = resolveBounds(input);

  const candidates: TooltipPosition[] = [
    preferred,
    OPPOSITE[preferred],
    ...TOOLTIP_POSITIONS.filter(
      (side) => side !== preferred && side !== OPPOSITE[preferred],
    ),
  ];

  for (const side of candidates) {
    if (spaceOn(side, trigger, bounds, margin) >= needsOn(side, tooltip, offset)) {
      return { side, flipped: side !== preferred };
    }
  }

  const best = candidates.reduce((a, b) =>
    spaceOn(b, trigger, bounds, margin) > spaceOn(a, trigger, bounds, margin)
      ? b
      : a,
  );
  return { side: best, flipped: best !== preferred };
};

/**
 * Full placement: side, box position, and where the caret has to sit so it
 * still points at the trigger's centre after any clamping.
 */
export const resolveTooltipPlacement = (
  input: TooltipPlacementInput,
): TooltipPlacement => {
  const { trigger, tooltip } = input;
  const offset = input.offset ?? 8;
  const margin = input.margin ?? 8;
  const caretInset = input.caretInset ?? 10;
  const align = input.align ?? "center";
  const bounds = resolveBounds(input);

  const { side, flipped } = resolveTooltipSide(input);

  const triggerCenterX = trigger.left + trigger.width / 2;
  const triggerCenterY = trigger.top + trigger.height / 2;

  let left: number;
  let top: number;

  if (isVertical(side)) {
    top =
      side === "top"
        ? trigger.top - offset - tooltip.height
        : trigger.top + trigger.height + offset;
    if (align === "grow") {
      left = growAlong("x", trigger, tooltip.width, bounds, margin);
    } else {
      // Centre on the trigger, then keep the whole box inside the bounds.
      left = clamp(
        triggerCenterX - tooltip.width / 2,
        bounds.left + margin,
        bounds.left + bounds.width - tooltip.width - margin,
      );
    }
  } else {
    left =
      side === "left"
        ? trigger.left - offset - tooltip.width
        : trigger.left + trigger.width + offset;
    if (align === "grow") {
      top = growAlong("y", trigger, tooltip.height, bounds, margin);
    } else {
      top = clamp(
        triggerCenterY - tooltip.height / 2,
        bounds.top + margin,
        bounds.top + bounds.height - tooltip.height - margin,
      );
    }
  }

  // The caret tracks the trigger, not the box: after clamping, the tooltip's
  // centre and the trigger's centre are no longer the same point.
  const caret = isVertical(side)
    ? clamp(
        triggerCenterX - left,
        Math.min(caretInset, tooltip.width / 2),
        Math.max(caretInset, tooltip.width - caretInset),
      )
    : clamp(
        triggerCenterY - top,
        Math.min(caretInset, tooltip.height / 2),
        Math.max(caretInset, tooltip.height - caretInset),
      );

  return { side, left, top, caret, flipped };
};

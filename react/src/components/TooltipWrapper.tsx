import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  resolveTooltipPlacement,
  type TooltipPlacement,
  type TooltipPosition,
} from "../../../common/tooltip/placement";
import {
  TOOLTIP_ARROW_BORDER,
  TOOLTIP_ARROW_EDGE,
  getTooltipVariantTokens,
  type TooltipVariant,
} from "../../../common/tooltip/tokens";

export interface TooltipWrapperProps {
  /** Tooltip text. When omitted no tooltip is shown but the child is rendered unchanged. */
  text?: string;
  /** Delay in ms before the tooltip appears. @default 500 */
  delay?: number;
  /**
   * Preferred side. The tooltip flips to the opposite side, then to a
   * perpendicular one, when there is not enough room — so this is a
   * preference, not a guarantee. @default "top"
   */
  position?: TooltipPosition;
  /** How the tooltip is painted. @default "surface" */
  variant?: TooltipVariant;
  /** Gap between trigger and tooltip, in px. @default 8 */
  offset?: number;
  /** Minimum distance kept from every viewport edge, in px. @default 8 */
  margin?: number;
  /**
   * Keep the tooltip inside this element instead of the whole viewport — a
   * scroll container, a panel, a modal. It flips and clamps against *that*
   * edge, intersected with the viewport so it still never leaves the screen.
   */
  boundary?: HTMLElement | null;
  /** The element to attach the tooltip to. Must accept mouse and focus handlers. */
  children: React.ReactElement<React.HTMLAttributes<Element>>;
}

/**
 * Attaches a styled tooltip to any child element without adding any wrapper
 * element to the DOM. The tooltip is rendered via a React portal directly into
 * document.body and positioned with `position: fixed`, so it has zero impact on
 * the child's layout or spacing.
 *
 * Collision handling lives in `common/tooltip/placement.ts` — shared with the
 * Vue kit, and tested directly as geometry. It flips to the opposite side when
 * the preferred one has no room, falls back to a perpendicular side when
 * neither fits, clamps the box inside the viewport, and slides the caret so it
 * still points at the trigger after clamping.
 *
 * The component always renders a Fragment so that switching `text` between
 * undefined and a string value never causes the child element to unmount —
 * important when the child holds a ref (e.g. for truncation detection).
 */
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  text,
  delay = 500,
  position = "top",
  variant = "surface",
  offset = 8,
  margin = 8,
  boundary,
  children,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRectRef = useRef<DOMRect | null>(null);

  const [visible, setVisible] = useState(false);
  // `null` until the tooltip has been measured, which is also the "not yet
  // positioned, keep it hidden" signal — otherwise there is a one-frame flash
  // at the wrong place near a viewport edge.
  const [placement, setPlacement] = useState<TooltipPlacement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Hide immediately when text is removed while tooltip is showing.
  useEffect(() => {
    if (!text && visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
      setPlacement(null);
    }
  }, [text, visible]);

  const measure = useCallback(() => {
    const el = tooltipRef.current;
    const trigger = triggerRectRef.current;
    if (!el || !trigger) return;
    const box = el.getBoundingClientRect();
    const bounds = boundary?.getBoundingClientRect();
    setPlacement(
      resolveTooltipPlacement({
        trigger,
        tooltip: { width: box.width, height: box.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        boundary: bounds
          ? {
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            }
          : undefined,
        preferred: position,
        offset,
        margin,
      }),
    );
  }, [position, offset, margin, boundary]);

  // Measure once the tooltip is in the DOM. `placement === null` gates the
  // re-run so this settles in one pass instead of looping on its own output.
  useLayoutEffect(() => {
    if (!visible || placement !== null) return;
    measure();
  }, [visible, placement, measure]);

  // Re-place while open: the page can scroll or resize under an open tooltip,
  // which used to leave it stranded at a stale position.
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [visible, measure]);

  const show = useCallback(
    (e: React.MouseEvent | React.FocusEvent) => {
      // No text → no tooltip; still forward the original handler.
      if (text) {
        triggerRectRef.current = (
          e.currentTarget as Element
        ).getBoundingClientRect();
        setPlacement(null);
        timerRef.current = setTimeout(() => setVisible(true), delay);
      }
      if (e.type === "focus") {
        children.props.onFocus?.(e as React.FocusEvent<Element>);
      } else {
        children.props.onMouseEnter?.(e as React.MouseEvent<Element>);
      }
    },
    [text, delay, children.props],
  );

  const hide = useCallback(
    (e?: React.MouseEvent | React.FocusEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
      setPlacement(null);
      if (e?.type === "blur") {
        children.props.onBlur?.(e as React.FocusEvent<Element>);
      } else if (e) {
        children.props.onMouseLeave?.(e as React.MouseEvent<Element>);
      }
    },
    [children.props],
  );

  // Focus as well as hover: a tooltip that only answers to a pointer is
  // invisible to anyone driving the page from the keyboard. The child still
  // has to be focusable for this to fire — give it `tabIndex={0}` when it is
  // not natively so.
  const child = React.cloneElement(children, {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  });

  const side = placement?.side ?? position;
  const tokens = getTooltipVariantTokens(variant);
  const vertical = side === "top" || side === "bottom";

  return (
    <>
      {child}
      {visible &&
        text &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            data-side={side}
            style={{
              position: "fixed",
              top: placement?.top ?? 0,
              left: placement?.left ?? 0,
              visibility: placement ? "visible" : "hidden",
              zIndex: 9999,
            }}
            className={classNames(
              "pointer-events-none max-w-xs rounded-md px-2.5 py-1.5 text-xs leading-snug",
              tokens.box,
            )}
          >
            {text}
            {/*
              A rotated square centred on the box edge, not a CSS triangle. A
              triangle made of `border-*-<colour>` carries no outline, so on
              the light `surface` variant it was a white shape on a white page.
              Half of this sits inside the box, where its unbordered edges
              share the fill and disappear.
            */}
            <span
              aria-hidden="true"
              style={{
                ...(vertical
                  ? { left: placement?.caret ?? 0 }
                  : { top: placement?.caret ?? 0 }),
                transform: "translate(-50%, -50%) rotate(45deg)",
              }}
              className={classNames(
                "absolute h-2 w-2",
                TOOLTIP_ARROW_EDGE[side],
                TOOLTIP_ARROW_BORDER[side],
                tokens.arrow,
              )}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default TooltipWrapper;

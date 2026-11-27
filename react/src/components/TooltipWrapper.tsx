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
  /** Delay in ms before the tooltip appears. @default 1000 */
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
  /**
   * Suppress the tooltip — it hides immediately if visible and cannot appear
   * while disabled. Use it while an overlapping surface the trigger owns (an
   * open Menu popup, say) should not be covered by a floating tip.
   */
  disabled?: boolean;
}

/**
 * Does this anchor belong to a surface that is currently open? `Menu` stamps
 * `data-menu-open` on its trigger, so a tip anchored to that element — or to a
 * wrapper the author put around it, which is exactly what the standalone
 * `Tooltip` does — can tell that the space under it now belongs to a popup.
 * Checked by query rather than by prop so the rule holds for whoever anchored
 * the tip, not only for the callers that remembered to pass `disabled`.
 */
const anchorsOpenSurface = (el: Element | null): boolean =>
  !!el && ( !!el.closest("[data-menu-open]") || !!el.querySelector("[data-menu-open]") );

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
  delay = 1000,
  position = "top",
  variant = "surface",
  offset = 8,
  margin = 8,
  boundary,
  disabled,
  children,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRectRef = useRef<DOMRect | null>(null);
  // The element the tip hangs off, kept as an element (the rect is only its
  // geometry) so the open-surface check can run again after the delay.
  const anchorElRef = useRef<Element | null>(null);
  // Read from the pending-reveal timer, which outlives the render that
  // scheduled it and would otherwise hold a stale `disabled`.
  const disabledRef = useRef(disabled);

  const [visible, setVisible] = useState(false);
  const [colorScheme, setColorScheme] = useState<string | null>(null);
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
      // No text → no tooltip; a suppressed one behaves the same. Either way
      // the child's own handlers still run.
      const anchor = e.currentTarget as Element;
      if (text && !disabled && !anchorsOpenSurface(anchor)) {
        setColorScheme(
          (e.currentTarget as Element)
            .closest("[data-color-scheme]")
            ?.getAttribute("data-color-scheme") ?? null,
        );
        anchorElRef.current = anchor;
        triggerRectRef.current = anchor.getBoundingClientRect();
        setPlacement(null);
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          // Ask again at the end of the wait, not just at the start: during
          // that second the caller may have suppressed the tip or the menu
          // this trigger owns may have opened, and a tip scheduled before
          // either would otherwise land on top of the rows.
          if (disabledRef.current || anchorsOpenSurface(anchor)) return;
          setVisible(true);
        }, delay);
      }
      if (e.type === "focus") {
        children.props.onFocus?.(e as React.FocusEvent<Element>);
      } else {
        children.props.onMouseEnter?.(e as React.MouseEvent<Element>);
      }
    },
    [text, delay, disabled, children.props],
  );

  // End a visible or pending tip without touching the child's handlers — the
  // two paths that dismiss on their own (suppressed by the caller, or the
  // surface the anchor owns just opened) have no pointer event behind them.
  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
    setPlacement(null);
  }, []);

  const hide = useCallback(
    (e?: React.MouseEvent | React.FocusEvent) => {
      dismiss();
      if (e?.type === "blur") {
        children.props.onBlur?.(e as React.FocusEvent<Element>);
      } else if (e) {
        children.props.onMouseLeave?.(e as React.MouseEvent<Element>);
      }
    },
    [dismiss, children.props],
  );

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  // Suppressed mid-flight (the menu this trigger owns just opened): cancel any
  // pending show and pull a visible tip down at once.
  useEffect(() => {
    if (disabled) dismiss();
  }, [disabled, dismiss]);

  // The same rule for callers who never passed `disabled` — a `<Tooltip>`
  // wrapped around a Menu trigger, say, has no idea the menu exists. Watch the
  // marker the Menu writes on its trigger instead of hoping for a mouseleave
  // that never comes, because the cursor did stay on the trigger. Scoped to
  // that one attribute and to the time the tip is actually on screen.
  useEffect(() => {
    if (!visible) return;
    const anchor = anchorElRef.current;
    if (!anchor) return;
    if (anchorsOpenSurface(anchor)) {
      dismiss();
      return;
    }
    const observer = new MutationObserver(() => {
      if (anchorsOpenSurface(anchor)) dismiss();
    });
    observer.observe(anchor, {
      attributes: true,
      attributeFilter: ["data-menu-open"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [visible, dismiss]);

  // Focus as well as hover: a tooltip that only answers to a pointer is
  // invisible to anyone driving the page from the keyboard. The child still
  // has to be focusable for this to fire — give it `tabIndex={0}` when it is
  // not natively so.
  const tooltipId = React.useId();
  const child = React.cloneElement(children, {
    // The WAI pattern for tooltips: the relationship is declared only while
    // the tooltip exists — a permanent `aria-describedby` to an absent id is
    // a dangling reference most readers skip silently.
    "aria-describedby": visible && text ? tooltipId : undefined,
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
            id={tooltipId}
            role="tooltip"
            data-color-scheme={colorScheme ?? undefined}
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
              colorScheme === "dark" && "dark",
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

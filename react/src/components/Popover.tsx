import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Loader, { type LoaderProps } from "./Loader";
import Panel, {
  getPanelEdgeChrome,
  SkeletonBar,
  type PanelLoaderType,
  type PanelSpecularMode,
} from "./Panel";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceCornerClass,
  getSurfaceCornerRem,
  getSurfacePaddingClass,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import { resolveOverlayZIndex } from "../../../common/utils/overlayZIndex";
import {
  resolveTooltipPlacement,
  type TooltipPlacement,
  type TooltipPosition,
} from "../../../common/tooltip/placement";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export const POPOVER_PLACEMENTS = [
  "auto",
  "top",
  "bottom",
  "left",
  "right",
] as const;
export type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];

/**
 * The shared loader language: `Panel`'s own loader types, so a popover and
 * the card it sits beside load with the same chrome.
 */
export type PopoverLoaderType = PanelLoaderType;

export interface PopoverProps {
  /**
   * The element to anchor the popover to. Cloned with the toggle `onClick`,
   * a composed `ref` and `aria-haspopup` / `aria-expanded` / `aria-controls`
   * — any DOM element works (`Button`, `IconButton`, a styled `<span>`).
   */
  trigger: ReactElement;
  /** The popover's content. */
  children?: ReactNode;
  /**
   * Preferred side. The preferred one if it fits, then its opposite, then the
   * perpendiculars — the shared placement geometry, so the arrow keeps
   * pointing at the trigger after any clamping. `auto` uses the canonical
   * `bottom` side as the preference.
   * @default "auto"
   */
  placement?: PopoverPlacement;
  /** Surface treatment — the shared container family the `Panel` owns. @default "elevated" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "rounded-md" */
  corner?: SurfaceCorner;
  /** Body inset, on the shared container scale. @default "sm" */
  padding?: SurfacePadding;
  /** Content-sized below this cap, which is itself capped at the viewport. @default 320 */
  maxWidth?: number;
  /** The rotated-square arrow that points at the trigger. @default true */
  arrow?: boolean;
  /** Close on a click outside the trigger and the popover. @default true */
  dismissable?: boolean;
  /** Close on Escape, returning focus to the trigger. @default true */
  closeOnEscape?: boolean;
  /**
   * Controlled open state. Uncontrolled by default. In controlled mode the
   * component never flips `visible` itself — it asks through `onOpenChange`.
   */
  visible?: boolean;
  /**
   * Fires on every intent change (trigger click, outside click, Escape) in
   * both modes. In controlled mode this is the request the parent answers by
   * updating `visible`.
   */
  onOpenChange?: (open: boolean) => void;
  /** The overlay starts showing (the enter animation begins). */
  onShow?: () => void;
  /** The overlay actually hides (the leave animation completes). */
  onHide?: () => void;
  /** @default false */
  loading?: boolean;
  /** @default "spinner" */
  loaderType?: PopoverLoaderType;
  loaderTitle?: ReactNode;
  loaderMessage?: ReactNode;
  /** `loaderType="progress"` only. */
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  /** Body placeholder lines for `loaderType="skeleton"`. @default 3 */
  skeletonLines?: number;
  /**
   * Backdrop vibrancy for the liquid-glass variant — forwarded to the Panel.
   * @default "medium"
   */
  vibrancy?: GlassVibrancy;
  /**
   * Glass fill opacity for the glass variants — forwarded to the Panel.
   * @default "frosted"
   */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for the glass variants — forwarded to the Panel. */
  specularMode?: PanelSpecularMode;
  /** Extra classes for the overlay wrapper. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const OVERLAY_ENTER_ANIMATION = "popover-overlay-enter";
const OVERLAY_LEAVE_ANIMATION = "popover-overlay-leave";

/** 16 px (w-4 h-4) rotated 45° — the diamond tip reaches ~11 px out. */
const ARROW_SIZE = 16;
const ARROW_HALF = ARROW_SIZE / 2;
/** Trigger ↔ popover gap. */
const PLACEMENT_OFFSET = 8;
/** Minimum distance to every viewport edge. */
const VIEWPORT_MARGIN = 8;

type OverlayPhase = "closed" | "entering" | "open" | "leaving";

/**
 * The corner radius in px, so the caret inset can keep the arrow off the
 * rounded part of the edge (the `resolveTooltipPlacement` `caretInset` rule).
 */
const cornerRadiusPx = (corner: SurfaceCorner): number =>
  parseFloat(getSurfaceCornerRem(corner)) * 16;

/**
 * The two border sides that form the arrow's visible V, per the side the
 * popover actually sits on. The hidden half has no border at all — a full
 * border's far sides would show through a translucent panel.
 */
const ARROW_SIDE_BORDERS: Record<TooltipPosition, string> = {
  bottom: "border-t border-l",
  top: "border-b border-r",
  left: "border-t border-r",
  right: "border-b border-l",
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                            */
/* ------------------------------------------------------------------ */

/**
 * Placeholder shaped like popover content: a short title bar over the body
 * lines, in the shared skeleton ink so it pulses the same on glass and on a
 * solid card.
 */
const PopoverSkeleton: React.FC<{ lines: number }> = ({ lines }) => (
  <div className="space-y-3" aria-hidden="true">
    <SkeletonBar width="55%" className="h-4" />
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBar
        key={index}
        width={index === lines - 1 ? "70%" : "100%"}
        className="h-2.5"
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = "auto",
  variant = "elevated",
  tone = "neutral",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "sm",
  maxWidth = 320,
  arrow = true,
  dismissable = true,
  closeOnEscape = true,
  visible,
  onOpenChange,
  onShow,
  onHide,
  loading = false,
  loaderType = "spinner",
  loaderTitle,
  loaderMessage,
  loaderProgress,
  loaderColor,
  skeletonLines = 3,
  vibrancy = "medium",
  glassOpacity = "frosted",
  specularMode,
  className,
}) => {
  const popoverId = useId();

  const isControlled = visible !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? visible : uncontrolledOpen;

  const [phase, setPhase] = useState<OverlayPhase>("closed");
  const phaseRef = useRef<OverlayPhase>("closed");
  phaseRef.current = phase;

  const [position, setPosition] = useState<{
    style: CSSProperties;
    placement: TooltipPlacement;
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerWrapperRef = useRef<HTMLSpanElement>(null);
  /** The anchor node — the trigger itself when it forwards a ref. */
  const anchorRef = useRef<HTMLElement | null>(null);

  // Latest-handler refs: the dismissal/escape listeners and the
  // `animationend` handler must never see stale callbacks.
  const onShowRef = useRef(onShow);
  onShowRef.current = onShow;
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const showFiredRef = useRef(false);
  const hideFiredRef = useRef(false);

  const overlayVisible = phase !== "closed";

  /* ---------------------------------------------------------------- */
  /*  Intent                                                            */
  /* ---------------------------------------------------------------- */

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChangeRef.current?.(next);
    },
    [isControlled],
  );

  /* ---------------------------------------------------------------- */
  /*  Phase machine                                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const p = phaseRef.current;
    if (open) {
      if (p === "closed") {
        hideFiredRef.current = false;
        setPhase("entering");
      }
    } else if (p === "entering" || p === "open") {
      setPhase("leaving");
    }
  }, [open]);

  useEffect(() => {
    if (phase === "entering" && !showFiredRef.current) {
      showFiredRef.current = true;
      onShowRef.current?.();
    }
    if (phase === "closed") {
      showFiredRef.current = false;
    }
  }, [phase]);

  const handleOverlayAnimationEnd = (
    event: AnimationEvent<HTMLDivElement>,
  ) => {
    // Guard per Learnings: animation events bubble from every descendant —
    // only the wrapper's own overlay animation ends the phase.
    if (event.target !== event.currentTarget) return;
    if (
      event.animationName !== OVERLAY_ENTER_ANIMATION &&
      event.animationName !== OVERLAY_LEAVE_ANIMATION
    ) {
      return;
    }
    if (phaseRef.current === "entering") {
      setPhase("open");
    } else if (phaseRef.current === "leaving") {
      setPhase("closed");
      setPosition(null);
      if (!hideFiredRef.current) {
        hideFiredRef.current = true;
        onHideRef.current?.();
      }
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Placement — two-pass: mount hidden, measure, position, animate   */
  /* ---------------------------------------------------------------- */

  const computePosition = useCallback(() => {
    const wrapper = wrapperRef.current;
    const anchor = anchorRef.current ?? triggerWrapperRef.current;
    if (!wrapper || !anchor) return;
    const anchorRect = anchor.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    // Unlaid-out (jsdom) or zero-sized boxes would poison the maths.
    if (wrapperRect.width === 0 || wrapperRect.height === 0) return;

    const resolved = resolveTooltipPlacement({
      trigger: {
        top: anchorRect.top,
        left: anchorRect.left,
        width: anchorRect.width,
        height: anchorRect.height,
      },
      tooltip: { width: wrapperRect.width, height: wrapperRect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      preferred: placement === "auto" ? "bottom" : placement,
      offset: PLACEMENT_OFFSET,
      margin: VIEWPORT_MARGIN,
      caretInset: cornerRadiusPx(corner) + 8,
    });

    setPosition({
      style: {
        position: "fixed",
        top: resolved.top,
        left: resolved.left,
        zIndex: resolveOverlayZIndex(anchor),
      },
      placement: resolved,
    });
  }, [placement, corner]);

  useLayoutEffect(() => {
    if (!overlayVisible || position) return;
    computePosition();
  }, [overlayVisible, position, computePosition]);

  // Land focus on `[autofocus]` once the panel has its final position —
  // PrimeVue's on-open focus, minus the trap: this is a non-modal popover,
  // and stealing focus into plain copy would be worse than keeping it on
  // the trigger.
  useLayoutEffect(() => {
    if (phase !== "entering" || !position) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.querySelector<HTMLElement>("[autofocus]")?.focus({
      preventScroll: true,
    });
  }, [phase, position]);

  // Return focus to the trigger when the close begins, while the panel is
  // still visible — the HelpButton contract.
  useEffect(() => {
    if (phase !== "leaving") return;
    const target =
      anchorRef.current ??
      triggerWrapperRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]",
      );
    target?.focus({ preventScroll: true });
  }, [phase]);

  // Scroll and resize REPOSITION instead of closing — the kit's deliberate
  // deviation from PrimeVue's close-on-scroll (see useOverlayPosition).
  useEffect(() => {
    if (!overlayVisible) return;
    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (phaseRef.current === "entering" || phaseRef.current === "open") {
          computePosition();
        }
      });
    };
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : undefined;
    if (ro) {
      if (triggerWrapperRef.current) ro.observe(triggerWrapperRef.current);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, [overlayVisible, computePosition]);

  /* ---------------------------------------------------------------- */
  /*  Dismissal                                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!overlayVisible || !dismissable) return;
    const onMousedown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current?.contains(target)) return;
      // The trigger toggles on click, not mousedown — exclude it here so the
      // click gets to run its own toggle (PrimeVue's isTargetClicked guard).
      if (triggerWrapperRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMousedown);
    return () => document.removeEventListener("mousedown", onMousedown);
  }, [overlayVisible, dismissable, setOpen]);

  useEffect(() => {
    if (!overlayVisible || !closeOnEscape) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [overlayVisible, closeOnEscape, setOpen]);

  /* ---------------------------------------------------------------- */
  /*  Trigger                                                           */
  /* ---------------------------------------------------------------- */

  const existingRef = isValidElement(trigger)
    ? ((trigger.props ?? {}) as { ref?: Ref<unknown> }).ref
    : undefined;

  // Composed ref: ours measures the anchor, the caller's still works. When
  // the trigger does not forward a ref (plain span, non-forwarding component)
  // `anchorRef` stays null and measurement falls back to the wrapper span.
  const setAnchorNode = (node: HTMLElement | null) => {
    anchorRef.current = node;
    if (typeof existingRef === "function") existingRef(node);
    else if (existingRef && typeof existingRef === "object") {
      (existingRef as { current: unknown }).current = node;
    }
  };

  const handleTriggerClick = (event: React.MouseEvent) => {
    const existing = ((trigger.props ?? {}) as {
      onClick?: (e: React.MouseEvent) => void;
    }).onClick;
    existing?.(event);
    setOpen(!open);
  };

  const renderedTrigger = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: setAnchorNode,
        onClick: handleTriggerClick,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? popoverId : undefined,
      })
    : trigger;

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  const chrome = getPanelEdgeChrome(variant, tone, glassOpacity, vibrancy);

  const cappedMaxWidth =
    typeof window === "undefined"
      ? maxWidth
      : Math.min(maxWidth, window.innerWidth - VIEWPORT_MARGIN * 2);

  const overlayStyle: CSSProperties = position
    ? { ...position.style, maxWidth: cappedMaxWidth }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        visibility: "hidden",
        maxWidth: cappedMaxWidth,
      };

  const arrowStyle: CSSProperties = (() => {
    if (!position) return {};
    const { side, caret } = position.placement;
    switch (side) {
      case "bottom":
        return { top: -ARROW_HALF, left: caret - ARROW_HALF };
      case "top":
        return { bottom: -ARROW_HALF, left: caret - ARROW_HALF };
      case "left":
        return { top: caret - ARROW_HALF, right: -ARROW_HALF };
      case "right":
        return { top: caret - ARROW_HALF, left: -ARROW_HALF };
    }
  })();

  const showSkeleton = loading && loaderType === "skeleton";

  return (
    <span ref={triggerWrapperRef} className="inline-flex">
      {renderedTrigger}
      {overlayVisible &&
        createPortal(
          <div
            ref={wrapperRef}
            id={popoverId}
            role="dialog"
            aria-modal="false"
            tabIndex={-1}
            data-variant={variant}
            data-tone={tone}
            data-placement={position?.placement.side}
            aria-busy={loading}
            onAnimationEnd={handleOverlayAnimationEnd}
            className={classNames(
              "popover-overlay outline-none",
              phase === "entering" && "popover-overlay--enter",
              phase === "leaving" && "popover-overlay--leave",
              // The Loader overlay's `rounded-[inherit]` reads this.
              getSurfaceCornerClass(corner),
              className,
            )}
            style={overlayStyle}
          >
            {arrow && position && (
              <span
                aria-hidden="true"
                className={classNames(
                  "pointer-events-none absolute block h-4 w-4 rotate-45",
                  ARROW_SIDE_BORDERS[position.placement.side],
                  chrome.border,
                  chrome.fill,
                  chrome.backdrop,
                )}
                style={arrowStyle}
              />
            )}
            {/*
              The surface is a real, PASSIVE `Panel`: `padding="none"` +
              `scrollable={false}`, with the scroll moved to the inner
              region — Panel's default padded `overflow-auto` body
              double-scrolls and fights the fixed positioning (Learnings).
            */}
            <Panel
              variant={variant}
              tone={tone}
              corner={corner}
              padding="none"
              scrollable={false}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              specularMode={specularMode}
            >
              <div className="max-h-[55vh] overflow-y-auto">
                <div className={getSurfacePaddingClass(padding)}>
                  {showSkeleton ? (
                    <PopoverSkeleton lines={skeletonLines} />
                  ) : (
                    children
                  )}
                </div>
              </div>
            </Panel>
            {loading && !showSkeleton && (
              <Loader
                overlay
                variant={
                  loaderType as Exclude<LoaderProps["variant"], undefined>
                }
                title={loaderTitle}
                label={loaderMessage}
                progress={loaderProgress}
                color={loaderColor}
              />
            )}
          </div>,
          document.body,
        )}
    </span>
  );
};

Popover.displayName = "Popover";

export default Popover;

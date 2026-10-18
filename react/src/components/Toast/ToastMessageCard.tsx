import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import classNames from "classnames";
import Button from "../Button";
import { useKitT } from "../../i18n";
import Progress from "../Progress";
import Spinner from "../Spinner";
import { useIconRenderer } from "../../contexts/IconContext";
import {
  ALERT_INTENT_CONFIG,
  DEFAULT_SURFACE_CORNER,
  getAlertVariantTokens,
  getSurfaceCornerClass,
  getToastSizeTokens,
  type AlertVariant,
  type TrueColor,
} from "../../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../../theme/glass";
import type { ToastMessage } from "./types";

/**
 * The two variants that composite over whatever is behind them — the same
 * pair `Alert` and `Panel` use, so a toast on a glass card reads as the same
 * family.
 */
const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

/**
 * A drag commits when it covers 40% of the drag axis — PrimeVue's swipe
 * feel, measured against the card's own size so a small `xs` card does not
 * need a smaller gesture to throw away than a big `xl` one.
 */
const SWIPE_COMMIT_FRACTION = 0.4;
/** The fly-off transition, matching `.kit-toast-message` (300ms). */
const SWIPE_EXIT_MS = 300;

export interface ToastMessageCardProps {
  message: ToastMessage;
  /**
   * Stack rank, 0 = newest / front. For a removing card this is the frozen
   * pre-removal rank (the count of still-present newer messages), so the
   * stack behind it reflows while it leaves.
   */
  index: number;
  /** Offset from the corner in px: the summed heights of newer, still-present toasts. */
  offset: number;
  /** Stacking order — the newest sits on top. */
  zIndex: number;
  /** Within the viewport's `limit`; older cards wait their turn. */
  visible: boolean;
  /** The container is expanded (mode or hover/focus of the group). */
  expanded: boolean;
  /** The message's position in the store's append order (debug/tests). */
  orderIndex: number;
  onMeasure: (id: number, height: number) => void;
  onClose: (id: number) => void;
  onSwipeCommit: (id: number) => void;
}

/**
 * One toast card.
 *
 * The surface is Alert's status language (intent → tone/icon/politeness,
 * variant → fill/rim/copy) rendered at toast compactness — not a full
 * `Panel`, whose padding/scroll/provider machinery is wrong inside a
 * height-measured, height-clipped stack (the spec's "passive Panel"
 * precedent, as Popover applies it to its own surface).
 *
 * All stack geometry is CSS (`.kit-toast-message` in styles.css) driven by
 * the data attributes and the `--kt-*` custom properties below; this
 * component only reports what it measured.
 */
const ToastMessageCard: React.FC<ToastMessageCardProps> = ({
  message,
  index,
  offset,
  zIndex,
  visible,
  expanded,
  orderIndex,
  onMeasure,
  onClose,
  onSwipeCommit,
}) => {
  const t = useKitT();
  const renderIcon = useIconRenderer();
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Reveal only after the first paint has the off-screen start state, so the
  // entry transition has somewhere to come from (PrimeVue's data-mounted).
  const [mounted, setMounted] = useState(false);
  const [measured, setMeasured] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [swipeOut, setSwipeOut] = useState<
    "up" | "down" | "left" | "right" | null
  >(null);
  const dragRef = useRef<{ x: number; y: number; pointerId: number } | null>(
    null,
  );
  const swipeExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config =
    ALERT_INTENT_CONFIG[message.intent] ?? ALERT_INTENT_CONFIG.neutral;
  const tokens = getAlertVariantTokens(message.color, message.variant);
  const size = getToastSizeTokens(message.size);
  const isGlass = GLASS_VARIANTS.includes(message.variant);

  const glassClasses = isGlass
    ? classNames(
        // The same blur steps Alert uses: a toast is a small callout, not a
        // full-bleed container.
        message.variant === "liquid-glass" ? "backdrop-blur-md" : "backdrop-blur-sm",
        getGlassFillClass(message.color, message.glassOpacity),
        getGlassVibrancyClass(message.vibrancy),
        getGlassChromeClasses(message.color, { interactive: false }),
      )
    : null;
  const specularClasses = isGlass
    ? getSpecularClasses(message.specularMode)
    : null;

  // A toast that warns or fails interrupts; one that informs does not
  // (brief §5.6 — the split Alert encodes in its intent config).
  const role = config.live === "assertive" ? "alert" : "status";

  const setSwipeVars = useCallback((dx: number, dy: number) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--kt-swipe-x", `${dx}px`);
    el.style.setProperty("--kt-swipe-y", `${dy}px`);
  }, []);

  // Measure the card's *root* at a forced `height: auto` — PrimeVue's
  // measureHeight, verbatim in spirit. The collapsed deck clamps the root to
  // the front height, so a plain getBoundingClientRect on the root would
  // report the clamp and the deck could never learn the real height (the
  // back cards would then sit entirely behind the front card and the peek
  // strips would never show). Flashing `height: auto` is layout-invisible
  // for the content element, so observing the content below cannot loop.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const content = measureRef.current;
    if (!root || !content) return;
    const report = () => {
      const prev = root.style.height;
      root.style.height = "auto";
      const height = Math.round(root.getBoundingClientRect().height);
      root.style.height = prev;
      if (height > 0) {
        setMeasured((prev) => (prev === height ? prev : height));
        onMeasure(message.id, height);
      }
    };
    report();
    const observer = new ResizeObserver(report);
    observer.observe(content);
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [message.id, onMeasure]);

  useLayoutEffect(
    () => () => {
      if (swipeExitRef.current) clearTimeout(swipeExitRef.current);
    },
    [],
  );

  // ── swipe-to-dismiss (PrimeVue parity, four directions) ────────────────
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (message.removing || swipeOut) return;
    // The actions row and anything else marking itself data-dismissible
    // keeps its own pointer semantics — a drag must not start on a button.
    if (
      (event.target as HTMLElement).closest?.('[data-dismissible="false"]')
    ) {
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    // Capture on the *pressed element*, not the card root — PrimeVue's
    // `t.target.setPointerCapture`, for a reason: a capture on an ancestor
    // retargets the resulting click to that ancestor, so a press on the
    // close button would deliver its click to the card instead of the
    // button and the button's handler would never run. Capture on the
    // target (which may be a deep child) keeps the click on the pressed
    // element; pointer events still bubble up to this root while captured.
    try {
      (event.target as Element).setPointerCapture?.(event.pointerId);
    } catch {
      // InvalidPointerId (e.g. the pointer already released) — the drag
      // still tracks via bubbling, capture is only a safety net.
    }
    setSwiping(true);
    setSwiped(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !swiping || drag.pointerId !== event.pointerId) return;
    setSwipeVars(event.clientX - drag.x, event.clientY - drag.y);
  };

  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !swiping || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setSwiping(false);
    if (swipeOut) return;

    const el = rootRef.current;
    if (!el) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const amount = horizontal ? Math.abs(dx) : Math.abs(dy);
    const extent = horizontal ? el.offsetWidth : el.offsetHeight;

    if (extent > 0 && amount > extent * SWIPE_COMMIT_FRACTION) {
      const direction = horizontal
        ? dx < 0
          ? "left"
          : "right"
        : dy < 0
          ? "up"
          : "down";
      // Keep the last drag delta: the fly-off continues from where the finger
      // left the card.
      setSwipeOut(direction);
      swipeExitRef.current = setTimeout(
        () => onSwipeCommit(message.id),
        SWIPE_EXIT_MS,
      );
    } else {
      setSwipeVars(0, 0);
    }
  };

  const resolvedIcon = message.loading
    ? undefined
    : message.icon === false
      ? undefined
      : message.icon;

  const style: CSSProperties = {
    zIndex,
    // The state machine's parameters (styles.css reads them). Parameters
    // inline, animation in the class — so prefers-reduced-motion can zero
    // the duration without fighting an inline style (brief §5.10).
    ["--kt-index" as string]: String(index),
    ["--kt-offset" as string]: `${offset}px`,
    ...(measured > 0
      ? { ["--kt-height" as string]: `${measured}px` }
      : {}),
  };

  // NOTE: the root must NOT carry overflow-hidden. The expanded deck hangs
  // a seam bridge off each card's ::after (styles.css) so the hover-group
  // stays "inside" while the pointer crosses the gaps between fanned-out
  // cards — a root-level overflow clip would clip the bridge away and the
  // stack would collapse mid-gap. Clamping in the collapsed deck is done by
  // the stylesheet rule instead (it targets the clamped state, not the
  // card's variant), and nothing in the glass chrome spills the root's
  // border box: the specular overlay is inset-0 with a matching radius and
  // every bit of content sits inside the padding.
  return (
    // message.onClick is a consumer pointer callback on a transient
    // (auto-dismissed) message; the keyboard-accessible activation path is
    // the toast's action button, and consumers who need a keyboard-
    // activatable card should use that.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- transient message; keyboard activation lives on the action button
    <div
      ref={rootRef}
      className={classNames(
        "kit-toast-message relative w-full border shadow-sm",
        size.container,
        getSurfaceCornerClass(DEFAULT_SURFACE_CORNER),
        tokens.surface,
        tokens.border,
        glassClasses,
      )}
      style={style}
      data-id={message.id}
      data-index={orderIndex}
      data-stack=""
      data-mounted={mounted ? "" : undefined}
      data-removed={message.removing ? "" : undefined}
      data-front={index === 0 ? "" : undefined}
      data-expanded={expanded ? "" : undefined}
      data-visible={visible ? "" : undefined}
      data-swiping={swiping ? "" : undefined}
      data-swiped={swiped ? "" : undefined}
      data-swipe-out={swipeOut ?? undefined}
      data-swipe-direction={swipeOut ?? undefined}
      role={role}
      aria-live={config.live}
      aria-atomic="true"
      aria-hidden={
        visible || message.removing ? undefined : "true"
      }
      onClick={(event) => {
        // The close button and the actions row stop their own propagation;
        // anything else is the message itself (slightly stricter than
        // PrimeVue, whose close button also fires the message click).
        message.onClick?.(event);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishSwipe}
      onPointerCancel={finishSwipe}
    >
      {specularClasses && (
        <div
          className={classNames(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            specularClasses,
          )}
          aria-hidden="true"
        />
      )}

      <div ref={measureRef} className="relative flex w-full">
        <div className={classNames("flex min-w-0 flex-1", size.gap)}>
          {(message.loading || resolvedIcon) && (
            <div
              className={classNames(
                "flex flex-shrink-0 items-center self-start",
                size.iconBox,
                tokens.icon,
              )}
            >
              {message.loading ? (
                <Spinner size={size.icon} color={message.color} />
              ) : (
                renderIcon(resolvedIcon, size.icon)
              )}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col break-words whitespace-pre-line">
            {message.title != null && message.title !== "" && (
              <div className={classNames("font-semibold leading-tight", size.title)}>
                {message.title}
              </div>
            )}
            {message.detail != null && message.detail !== "" && (
              <div className={classNames("leading-relaxed", size.detail, tokens.text)}>
                {message.detail}
              </div>
            )}
            {message.progress != null && (
              <Progress
                value={message.progress}
                size={size.progress}
                color={message.color}
                aria-label={
                  typeof message.title === "string" ? message.title : "Progress"
                }
              />
            )}
            {message.actions && message.actions.length > 0 && (
              <div
                data-dismissible="false"
                className={classNames("flex flex-wrap items-center gap-1.5", size.actions)}
              >
                {message.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    color={message.color as TrueColor}
                    size={size.action}
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick?.();
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {message.closable && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose(message.id);
            }}
            className={classNames(
              "absolute top-1 end-1 inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
              size.close,
              tokens.dismiss,
            )}
            aria-label={t("kit.toast.closeAria")}
            /* PrimeVue's isTabbable: a hidden (over-limit) card keeps its
               button out of the tab order until it becomes visible. */
            tabIndex={visible ? undefined : -1}
          >
            {renderIcon("Close", size.closeIcon)}
          </button>
        )}
      </div>
    </div>
  );
};

ToastMessageCard.displayName = "ToastMessageCard";

export default ToastMessageCard;

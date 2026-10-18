import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import ToastMessageCard from "./ToastMessageCard";
import { useToastStore } from "./toastContext";
import type {
  ToastCloseHandler,
  ToastLifeEndHandler,
  ToastMessage,
} from "./types";
import {
  DEFAULT_TOAST_GAP_PX,
  DEFAULT_TOAST_LIMIT,
  DEFAULT_TOAST_MODE,
  DEFAULT_TOAST_POSITION,
  DEFAULT_TOAST_Z_INDEX,
  TOAST_DEFAULT_WIDTH,
  type ToastMode,
  type ToastPosition,
} from "../../theme/Theme";

export interface ToastBreakpoints {
  /** e.g. `{ "479px": { width: "90vw" } }` — PrimeVue parity. */
  [breakpoint: string]: { width?: string };
}

export interface ToastViewportProps {
  /**
   * Routing key: the viewport renders only messages whose `group` equals it
   * (ungrouped viewports render ungrouped messages — PrimeVue's strict
   * equality). Omit for the common single-stack app.
   */
  group?: string;
  /** @default "top-right" */
  position?: ToastPosition;
  /** @default "stacked" — the deck that fans out on hover. */
  mode?: ToastMode;
  /** Stack offset between cards, in px. @default 12 */
  gap?: number;
  /** How many newest toasts stay visible. @default 3 */
  limit?: number;
  /** Viewport width. @default "18.75rem" (PrimeVue's 300px) */
  width?: string;
  /** @default 2000 — above Modal's 1600. */
  zIndex?: number;
  /**
   * Responsive widths, PrimeVue parity: a `<style>` scoped to this viewport
   * is injected with the media queries.
   */
  breakpoints?: ToastBreakpoints;
  /** Fires when a message of this viewport's group closes (any reason). */
  onClose?: ToastCloseHandler;
  /** Fires when one of its messages expires via `life`. */
  onLifeEnd?: ToastLifeEndHandler;
  className?: string;
  style?: CSSProperties;
}

interface DerivedEntry {
  id: number;
  /** 0 = newest / front; frozen for removing cards. */
  index: number;
  /** Corner offset in px (summed heights of newer, still-present cards). */
  offset: number;
  /** Stacking order. */
  z: number;
  /** Within `limit`. */
  visible: boolean;
}

interface Derived {
  entries: DerivedEntry[];
  /** The newest card's measured height — the collapsed bar height. */
  frontHeight: number;
}

/**
 * Pure geometry: from the store's append-ordered slice, each card's stack
 * rank, its corner offset, its z-order and its visibility.
 *
 * "Newer" means later in the append order. A removing card's rank/offset are
 * computed against the still-present newer cards — its pre-removal values —
 * so the stack behind it reflows while it leaves (PrimeVue freezes
 * `offsetBeforeRemove` the same way).
 */
const deriveStack = (
  messages: readonly ToastMessage[],
  heights: ReadonlyMap<number, number>,
  limit: number,
): Derived => {
  const position = new Map<number, number>();
  messages.forEach((m, i) => position.set(m.id, i));
  const active = messages.filter((m) => !m.removing);
  const activeNewer = (m: ToastMessage) =>
    active.filter((a) => (position.get(a.id) ?? 0) > (position.get(m.id) ?? 0));

  const entries: DerivedEntry[] = messages.map((m) => {
    const newer = activeNewer(m);
    const index = newer.length;
    // The summed heights of the newer, still-present cards. For a removing
    // card that is exactly its pre-removal offset (the newer cards are
    // unaffected by its leaving), so no separate freeze is needed.
    const offset = newer.reduce(
      (sum, a) => sum + (heights.get(a.id) ?? 0),
      0,
    );
    return {
      id: m.id,
      index,
      offset,
      z: messages.length - index,
      // PrimeVue's data-visible parity: a card hidden by `limit` un-hides
      // automatically as the cards in front of it leave.
      visible: index < limit,
    };
  });

  // The deck's bar height is the newest *present* card's — a leaving front
  // card must not stretch the deck while it flies away.
  const frontSource = active.length ? active[active.length - 1] : undefined;

  return {
    entries,
    frontHeight: frontSource ? (heights.get(frontSource.id) ?? 0) : 0,
  };
};

let instanceSeq = 1;

/**
 * A toast viewport — one fixed corner (or the center) of the screen.
 *
 * Mount one per (group, position) pair you want; multiple viewports of the
 * same group all render the same messages, exactly like PrimeVue's multiple
 * `<Toast group>` instances.
 *
 * The container publishes the stack's custom properties; each card publishes
 * its own. Everything geometric that follows is CSS (see `.kit-toast` in
 * styles.css) — the JS only reports measurements and the expand state.
 */
export const ToastViewport: React.FC<ToastViewportProps> = ({
  group,
  position = DEFAULT_TOAST_POSITION,
  mode = DEFAULT_TOAST_MODE,
  gap = DEFAULT_TOAST_GAP_PX,
  limit = DEFAULT_TOAST_LIMIT,
  width = TOAST_DEFAULT_WIDTH,
  zIndex = DEFAULT_TOAST_Z_INDEX,
  breakpoints,
  onClose,
  onLifeEnd,
  className,
  style,
}) => {
  const store = useToastStore();
  const { messages } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const slice = useMemo(
    () =>
      messages.filter((m) => m.group === group),
    [messages, group],
  );

  // ── height registry ────────────────────────────────────────────────────
  const [heights, setHeights] = useState<Map<number, number>>(() => new Map());
  const onMeasure = useCallback((id: number, height: number) => {
    setHeights((prev) => {
      if (prev.get(id) === height) return prev;
      const next = new Map(prev);
      next.set(id, height);
      return next;
    });
  }, []);

  // Prune heights of messages that left the store (after their exit window).
  const idsKey = slice.map((m) => m.id).join(",");
  useEffect(() => {
    setHeights((prev) => {
      const keep = new Set(idsKey ? idsKey.split(",").map(Number) : []);
      let changed = false;
      const next = new Map<number, number>();
      prev.forEach((h, id) => {
        if (keep.has(id)) next.set(id, h);
        else changed = true;
      });
      return changed ? next : prev;
    });
  }, [idsKey]);

  const derived = useMemo(
    () => deriveStack(slice, heights, limit),
    [slice, heights, limit],
  );

  // ── expand state (hover / focus / pointer of the group) ───────────────
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const expanded = mode === "expanded" || hoverExpanded;

  // relatedTarget can be `window` when the pointer or focus leaves the
  // document entirely (and test runners default to it), so only real Nodes
  // inside the container count as "still inside".
  const isInside = (target: EventTarget | null) =>
    target instanceof Node &&
    Boolean(containerRef.current?.contains(target));

  // PrimeVue: the auto-dismiss timers pause while the stack is hovered,
  // focused or pressed, and resume with their remaining time. Sticky
  // messages have no timer, so pause/resume is a no-op for them (store).
  useEffect(() => {
    if (hoverExpanded || interacting) {
      store.pauseGroup(group);
    } else {
      store.resumeGroup(group);
    }
    return () => store.resumeGroup(group);
  }, [hoverExpanded, interacting, store, group]);

  // ── viewport-scoped events ─────────────────────────────────────────────
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onLifeEndRef = useRef(onLifeEnd);
  onLifeEndRef.current = onLifeEnd;
  useEffect(() => {
    const own = (m: ToastMessage) => m.group === group;
    const unClose = store.onClose((m) => {
      if (own(m)) onCloseRef.current?.(m);
    });
    const unLife = store.onLifeEnd((m) => {
      if (own(m)) onLifeEndRef.current?.(m);
    });
    return () => {
      unClose();
      unLife();
    };
  }, [store, group]);

  // ── no-viewport bookkeeping + breakpoints style ───────────────────────
  const instanceId = useRef(instanceSeq++).current;
  useEffect(() => {
    const handle = store.registerViewport();
    return () => store.unregisterViewport(handle);
  }, [store]);

  const breakpointsStyle = useMemo(() => {
    if (!breakpoints) return "";
    const selector = `.kit-toast[data-ktoast-instance="${instanceId}"]`;
    let css = "";
    for (const [breakpoint, rules] of Object.entries(breakpoints)) {
      const decls = Object.entries(rules)
        .filter((v): v is [string, string] => v[1] !== undefined)
        .map(([prop, value]) => `${prop}: ${value} !important;`)
        .join(" ");
      if (decls) {
        css += `@media screen and (max-width: ${breakpoint}) { ${selector} { ${decls} } }`;
      }
    }
    return css;
  }, [breakpoints, instanceId]);

  // ── portal ─────────────────────────────────────────────────────────────
  const [portalEl] = useState<HTMLDivElement>(() =>
    typeof document === "undefined"
      ? (null as unknown as HTMLDivElement)
      : document.createElement("div"),
  );
  useEffect(() => {
    if (!portalEl) return;
    document.body.appendChild(portalEl);
    return () => {
      if (portalEl.parentNode) portalEl.parentNode.removeChild(portalEl);
    };
  }, [portalEl]);

  if (!portalEl) return null;

  const raiseFactor = position.startsWith("bottom") ? -1 : 1;
  const containerStyle: CSSProperties = {
    width,
    zIndex,
    ...style,
    ["--kt-gap" as string]: `${gap}px`,
    ["--kt-front-height" as string]: `${derived.frontHeight}px`,
    ["--kt-raise-factor" as string]: String(raiseFactor),
  };

  const cards: ReactNode[] = slice.map((m) => {
    const entry = derived.entries.find((e) => e.id === m.id);
    if (!entry) return null;
    return (
      <ToastMessageCard
        key={m.id}
        message={m}
        index={entry.index}
        offset={entry.offset}
        zIndex={entry.z}
        visible={entry.visible}
        expanded={expanded}
        orderIndex={slice.indexOf(m)}
        onMeasure={onMeasure}
        onClose={(id) => store.close(id, "close")}
        onSwipeCommit={(id) => store.close(id, "swipe")}
      />
    );
  });

  return createPortal(
    <>
      {breakpointsStyle ? <style>{breakpointsStyle}</style> : null}
      <div
        ref={containerRef}
        className={classNames("kit-toast", className)}
        style={containerStyle}
        data-position={position}
        data-mode={mode}
        data-ktoast-instance={instanceId}
        data-expanded={expanded ? "" : undefined}
        onMouseEnter={() => setHoverExpanded(true)}
        onMouseLeave={(event) => {
          if (!interacting && !isInside(event.relatedTarget)) {
            setHoverExpanded(false);
          }
        }}
        onFocus={() => setHoverExpanded(true)}
        onBlur={(event) => {
          // React's onBlur is focusout under the hood, so it bubbles from the
          // card's close button. relatedTarget is the next focus target; if
          // it is still inside the stack, keep it expanded.
          if (!interacting && !isInside(event.relatedTarget)) {
            setHoverExpanded(false);
          }
        }}
        onPointerDown={(event) => {
          if (
            (event.target as HTMLElement).closest?.(
              '[data-dismissible="false"]',
            )
          ) {
            return;
          }
          setInteracting(true);
        }}
        onPointerUp={() => setInteracting(false)}
        onPointerCancel={() => setInteracting(false)}
      >
        {cards}
      </div>
    </>,
    portalEl,
  );
};

ToastViewport.displayName = "ToastViewport";

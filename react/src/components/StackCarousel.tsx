import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Panel, { type PanelProps } from "./Panel";
import { getSurfaceCornerClass } from "../theme";

export interface StackCarouselProps<T = React.ReactNode> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange">,
  Pick<PanelProps, "variant" | "tone" | "corner" | "padding" | "transparency"> {
  items: readonly T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => React.Key;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** Includes the active card; clamped to 1–3. @default 3 */
  visibleCount?: number;
  /** Vertical space exposed by each peeking layer, in pixels. @default 12 */
  stackOffset?: number;
  /** @default true */
  wheel?: boolean;
  /** Wrap at either end. @default true */
  loop?: boolean;
  /** Allow the deck to expand into a list. @default false */
  expandable?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  showExpandButton?: boolean;
  /** Expand after the mouse remains still; collapse on pointer leave. */
  expandOnHover?: boolean;
  /** Stationary hover delay in milliseconds. @default 2000 */
  hoverExpandDelay?: number;
  /** Hover-opened stacks collapse this long after leaving; re-entry cancels it. @default 500 */
  hoverCollapseDelay?: number;
  expandLabel?: string;
  collapseLabel?: string;
  /** @default true */
  swipe?: boolean;
  /** @default true */
  showNavigators?: boolean;
  /** Show the active item title and position below the deck. Hidden visually
   * when false; screen readers still receive navigation announcements. @default true */
  showStatus?: boolean;
  /** @default "Card stack" */
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  getItemLabel?: (item: T, index: number) => string;
  emptyState?: React.ReactNode;
}

const DURATION = 300;
const wrap = (index: number, count: number) => count ? ((Math.trunc(index) % count) + count) % count : 0;

/** One interactive card above up to two peeking layers, with circular navigation. */
export function StackCarousel<T = React.ReactNode>({
  items, renderItem, getItemKey, activeIndex, defaultActiveIndex = 0, onActiveIndexChange,
  visibleCount = 3, stackOffset = 12, wheel = true, swipe = true, showNavigators = true, showStatus = true,
  loop = true, expandable = false, expanded, defaultExpanded = false, onExpandedChange,
  showExpandButton = false, expandOnHover = false, hoverExpandDelay = 2000, hoverCollapseDelay = 500,
  expandLabel = "Expand stack", collapseLabel = "Collapse stack",
  ariaLabel = "Card stack", previousLabel = "Previous item", nextLabel = "Next item", getItemLabel,
  emptyState = "No items to display.", variant = "elevated", tone = "blue", corner = "auto",
  padding = "sm", transparency, className = "", onKeyDown, onPointerEnter, onPointerMove, onPointerLeave, onWheelCapture, style, ...rest
}: StackCarouselProps<T>) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expandable && (expanded ?? internalExpanded);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpened = useRef(false);
  const setExpanded = useCallback((value: boolean) => {
    if (expanded === undefined) setInternalExpanded(value);
    onExpandedChange?.(value);
  }, [expanded, onExpandedChange]);
  const clearHover = useCallback(() => { if (hoverTimer.current !== null) clearTimeout(hoverTimer.current); hoverTimer.current = null; }, []);
  const clearCollapse = useCallback(() => { if (collapseTimer.current !== null) clearTimeout(collapseTimer.current); collapseTimer.current = null; }, []);
  useEffect(() => { clearHover(); clearCollapse(); return () => { clearHover(); clearCollapse(); }; }, [expandable, expandOnHover, hoverExpandDelay, hoverCollapseDelay, isExpanded, clearHover, clearCollapse]);
  const armHover = (event?: Pick<React.PointerEvent, "pointerType">) => {
    clearHover();
    clearCollapse();
    if (!expandable || !expandOnHover || isExpanded || event?.pointerType === "touch") return;
    hoverTimer.current = setTimeout(() => { hoverOpened.current = true; setExpanded(true); }, Math.max(0, Number.isFinite(hoverExpandDelay) ? hoverExpandDelay : 2000));
  };
  const normalize = useCallback((value: number) => loop ? wrap(value, items.length) : Math.max(0, Math.min(items.length - 1, Math.trunc(value))), [loop, items.length]);
  const index = normalize(Number.isFinite(activeIndex ?? internalIndex) ? (activeIndex ?? internalIndex) : 0);
  const layers = Math.min(loop ? items.length : items.length - index, Math.max(1, Math.min(3, Math.trunc(visibleCount) || 1)));
  const offset = Math.max(0, Number.isFinite(stackOffset) ? stackOffset : 12);
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(index);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [height, setHeight] = useState(0);
  const wheelTime = useRef(0);
  const wheelDelta = useRef(0);
  const touch = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);
  const label = (i: number) => getItemLabel?.(items[i], i) ?? `Item ${i + 1}`;
  useLayoutEffect(() => {
    if (!isExpanded && document.activeElement instanceof Element &&
        rootRef.current?.contains(document.activeElement) && document.activeElement.closest("[inert]"))
      rootRef.current.focus({ preventScroll: true });
  }, [isExpanded]);

  const navigate = useCallback((next: number, focus = false) => {
    if (items.length < 2) return;
    const normalized = normalize(next);
    if (normalized === index) return;
    if (focus || measureRef.current?.contains(document.activeElement)) {
      rootRef.current?.focus({ preventScroll: true });
    }
    if (activeIndex === undefined) setInternalIndex(normalized);
    onActiveIndexChange?.(normalized);
  }, [items.length, index, activeIndex, onActiveIndexChange, normalize]);

  useLayoutEffect(() => {
    const old = previousIndex.current;
    previousIndex.current = index;
    if (old === index) return;
    setOutgoing(old < items.length ? old : null);
    const timer = window.setTimeout(() => setOutgoing(null), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, items.length]);

  useLayoutEffect(() => {
    const element = measureRef.current;
    if (!element || !items.length) { setHeight(0); return; }
    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [index, items.length, items[index], isExpanded]);

  // Let an inner scroll area consume its own wheel/swipe until its boundary.
  const canScrollInside = useCallback((target: EventTarget | null, delta: number) => {
    let element = target instanceof Element ? target : null;
    while (element && element !== rootRef.current) {
      if (element.matches("input, textarea, select, [contenteditable='true'], [role='slider'], [role='spinbutton']")) return true;
      if (element instanceof HTMLElement && /(auto|scroll)/.test(getComputedStyle(element).overflowY)
        && element.scrollHeight > element.clientHeight + 1
        && (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0)) return true;
      element = element.parentElement;
    }
    return false;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !swipe || isExpanded || items.length < 2) return;
    const handleMove = (event: TouchEvent) => {
      const start = touch.current;
      if (!start || event.touches.length !== 1) return;
      const point = event.touches[0];
      const delta = start.y - point.clientY;
      if (Math.abs(delta) > 8 && Math.abs(delta) > Math.abs(start.x - point.clientX)
        && !canScrollInside(start.target, delta)) event.preventDefault();
    };
    root.addEventListener("touchmove", handleMove, { passive: false });
    return () => root.removeEventListener("touchmove", handleMove);
  }, [swipe, isExpanded, items.length, canScrollInside]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !wheel || isExpanded || items.length < 2) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)
        || canScrollInside(event.target, event.deltaY)) return;
      event.preventDefault();
      const now = Date.now();
      const elapsed = now - wheelTime.current;
      wheelTime.current = now;
      // Consume momentum as part of the same gesture instead of racing cards.
      if (elapsed < 160 && wheelDelta.current === Infinity) return;
      if (elapsed >= 160) wheelDelta.current = 0;
      wheelDelta.current += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1);
      if (Math.abs(wheelDelta.current) < 24) return;
      navigate(index + Math.sign(wheelDelta.current));
      wheelDelta.current = Infinity;
    };
    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => root.removeEventListener("wheel", handleWheel);
  }, [wheel, isExpanded, items.length, index, navigate, canScrollInside]);

  const visible = isExpanded ? items.map((_, i) => i) : Array.from({ length: layers }, (_, rank) => normalize(index + rank));
  const rendered = [...visible];
  // Retain the old front in the very first changed render, before the layout
  // effect records it, so React can animate its existing DOM node out.
  const transitionFrom = previousIndex.current !== index ? previousIndex.current : outgoing;
  if (!isExpanded && transitionFrom !== null && transitionFrom < items.length && !rendered.includes(transitionFrom)) rendered.push(transitionFrom);

  return (
    // A focusable carousel region owns arrow navigation; child controls keep
    // their native key handling. It is a region rather than a single button.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div {...rest} ref={rootRef} role="region" aria-roledescription="carousel" aria-label={ariaLabel} tabIndex={0}
      className={`min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg ${className}`} style={style}
      onPointerEnter={event => { onPointerEnter?.(event); if (!event.defaultPrevented) armHover(event); }}
      onPointerMove={event => { onPointerMove?.(event); if (!event.defaultPrevented) armHover(event); }}
      onWheelCapture={event => {
        onWheelCapture?.(event);
        // Capture nested scrolling too, even when carousel wheel navigation
        // is disabled or an inner control consumes the gesture.
        if (event.deltaX || event.deltaY) armHover();
      }}
      onPointerLeave={event => {
        onPointerLeave?.(event); clearHover(); clearCollapse();
        if (hoverOpened.current) collapseTimer.current = setTimeout(() => {
          collapseTimer.current = null; hoverOpened.current = false; setExpanded(false);
        }, Math.max(0, Number.isFinite(hoverCollapseDelay) ? hoverCollapseDelay : 500));
      }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget || isExpanded) return;
        const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? index + 1
          : event.key === "ArrowUp" || event.key === "ArrowLeft" ? index - 1
          : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
        if (next !== null && items.length > 1) { event.preventDefault(); navigate(next); }
      }}>
      {!items.length ? <div className="text-sm text-neutral-500 dark:text-neutral-400">{emptyState}</div> : <>
        <div className="relative transition-[height] duration-300 ease-out motion-reduce:transition-none"
          data-stack-carousel-track data-expanded={isExpanded} style={{ height: !isExpanded && height ? height + Math.max(0, layers - 1) * offset : undefined }}
          onTouchStart={event => {
            if (!swipe || isExpanded || event.touches.length !== 1) { touch.current = null; return; }
            const point = event.touches[0];
            touch.current = { x: point.clientX, y: point.clientY, target: event.target };
          }}
          onTouchCancel={() => { touch.current = null; }}
          onTouchEnd={event => {
            const start = touch.current;
            touch.current = null;
            if (!start || !swipe || !event.changedTouches.length) return;
            const end = event.changedTouches[0];
            const delta = start.y - end.clientY;
            if (Math.abs(delta) >= 35 && Math.abs(delta) > Math.abs(start.x - end.clientX)
              && !canScrollInside(start.target, delta)) navigate(index + Math.sign(delta));
          }}>
          {rendered.map(i => {
            const rank = visible.indexOf(i);
            const active = isExpanded || rank === 0;
            const leaving = rank < 0;
            return (
              <div key={getItemKey?.(items[i], i) ?? i} data-stack-rank={rank}
                className={`w-full origin-top transition-[transform,opacity,height] duration-300 ease-out motion-reduce:transition-none ${getSurfaceCornerClass(corner)}`}
                style={{ position: isExpanded ? "relative" : height || !active ? "absolute" : "relative", top: 0, marginTop: isExpanded && rank > 0 ? offset : undefined,
                  zIndex: isExpanded ? 0 : leaving ? 4 : 3 - rank, opacity: leaving ? 0 : 1,
                  pointerEvents: leaving ? "none" : undefined,
                  transform: isExpanded ? "none" : leaving ? "translateY(-16px) scaleX(1.02)" : `translateY(${rank * offset}px) scaleX(${1 - rank * 0.04})`,
                  height: !active && height ? height : undefined }}>
                <div ref={i === index ? measureRef : undefined} inert={!active || undefined} aria-hidden={!active || undefined}
                  style={{ height: !active && height ? height : undefined }}>
                  <Panel variant={variant} tone={tone} corner={corner} padding={padding} transparency={transparency}
                    scrollable={false} className={!active ? "h-full" : undefined}>
                    <div className={!active && !leaving ? "invisible" : undefined}>
                      {renderItem ? renderItem(items[i], i) : items[i] as React.ReactNode}
                    </div>
                  </Panel>
                </div>
                {!active && !leaving && <button type="button" onClick={() => navigate(i, true)}
                  aria-label={`Show ${label(i)}`} className="absolute inset-0 w-full cursor-pointer rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" />}
              </div>
            );
          })}
        </div>
        <div className={showStatus || (showNavigators && items.length > 1) || (expandable && showExpandButton)
          ? "mt-3 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400" : undefined}>
          <span className={showStatus ? undefined : "sr-only"} role="status" aria-live="polite" aria-atomic="true">{label(index)} · {index + 1} / {items.length}</span>
          {((showNavigators && items.length > 1) || (expandable && showExpandButton)) && <div className="ml-auto flex items-center gap-1">
            {expandable && showExpandButton && <button type="button" aria-expanded={isExpanded} onClick={() => { hoverOpened.current = false; clearHover(); clearCollapse(); setExpanded(!isExpanded); }} className="rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">{isExpanded ? collapseLabel : expandLabel}</button>}
            {showNavigators && !isExpanded && items.length > 1 && <><button type="button" aria-label={previousLabel} disabled={!loop && index === 0} onClick={() => navigate(index - 1)}
              className="rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10">↑</button>
            <button type="button" aria-label={nextLabel} disabled={!loop && index === items.length - 1} onClick={() => navigate(index + 1)}
              className="rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10">↓</button></>}
          </div>}
        </div>
      </>}
    </div>
  );
}

export default StackCarousel;

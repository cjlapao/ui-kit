import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "./Panel";
import IconButton from "./IconButton";
import { COLLAPSED_RAIL_WIDTH, THIN_SCROLLBAR } from "../theme/Theme";

export type PageBodyRegionSide = "left" | "right" | "bottom";
export interface PageBodyRegionContext {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  size: number;
}
export interface PageBodyRegion {
  content: React.ReactNode | ((context: PageBodyRegionContext) => React.ReactNode);
  /** Accessible region name and resize/toggle label. */
  label: string;
  /** Expanded width, or height for bottom. @default 280 (bottom: 200) */
  defaultSize?: number;
  /** Controlled expanded dimension. */
  size?: number;
  onSizeChange?: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  collapsedSize?: number;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Defaults to true for right/bottom, false for left. */
  resizable?: boolean;
  /** Hide when the supplied component provides its own collapse control. */
  showToggle?: boolean;
}
export interface PageBodyLayoutProps extends Pick<PanelProps, "variant" | "tone" | "corner" | "glassOpacity" | "vibrancy" | "specularMode"> {
  header?: React.ReactNode;
  left?: PageBodyRegion;
  right?: PageBodyRegion;
  bottom?: PageBodyRegion;
  children?: React.ReactNode;
  className?: string;
  /** Minimum centre dimensions; smaller containers scroll the layout. */
  minCenterWidth?: number;
  minCenterHeight?: number;
}

function Region({ config, side }: { config: PageBodyRegion; side: PageBodyRegionSide }) {
  const vertical = side === "bottom";
  const [internalCollapsed, setInternalCollapsed] = useState(config.defaultCollapsed ?? false);
  const [internalSize, setInternalSize] = useState(config.defaultSize ?? (vertical ? 200 : 280));
  const collapsed = config.collapsed ?? internalCollapsed;
  const min = Math.max(0, config.minSize ?? (vertical ? 100 : 160));
  const max = Math.max(min, config.maxSize ?? (vertical ? 600 : 640));
  const size = Math.max(min, Math.min(max, config.size ?? internalSize));
  const collapsedSize = Math.max(0, config.collapsedSize ?? (vertical ? 40 : COLLAPSED_RAIL_WIDTH));
  const setCollapsed = (next: boolean) => {
    if (config.collapsed === undefined) setInternalCollapsed(next);
    config.onCollapsedChange?.(next);
  };
  const updateSize = useCallback((next: number) => {
    const value = Math.max(min, Math.min(max, next));
    if (config.size === undefined) setInternalSize(value);
    config.onSizeChange?.(value);
  }, [min, max, config.size, config.onSizeChange]);
  const drag = useRef<{ position: number; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) return;
    const previousCursor = document.body.style.cursor;
    const previousSelect = document.body.style.userSelect;
    document.body.style.cursor = vertical ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
    const move = (event: PointerEvent) => {
      if (!drag.current) return;
      const delta = (vertical ? event.clientY : event.clientX) - drag.current.position;
      updateSize(drag.current.size + delta * (side === "left" ? 1 : -1));
    };
    const stop = () => { drag.current = null; setDragging(false); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelect;
    };
  }, [dragging, vertical, side, updateSize]);
  const canResize = !collapsed && (config.resizable ?? side !== "left");
  const dimension = collapsed ? collapsedSize : size;
  return (
    <section aria-label={config.label} data-page-region={side} data-collapsed={collapsed}
      className="relative min-h-0 min-w-0 shrink-0 overflow-hidden"
      style={vertical ? { height: dimension } : { width: dimension }}>
      <div className="flex h-full min-h-0 flex-col">
        {config.showToggle !== false && (
          <div className="flex shrink-0 justify-end px-2 py-1">
            <IconButton
              size="xs" variant="ghost" color="neutral"
              icon={vertical ? (collapsed ? "ArrowChevronUp" : "ArrowChevronDown") : (collapsed === (side === "left") ? "ArrowChevronRight" : "ArrowChevronLeft")}
              aria-label={`${collapsed ? "Expand" : "Collapse"} ${config.label}`}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
        )}
        <div className={classNames("min-h-0 min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)}>
          {typeof config.content === "function" ? config.content({ collapsed, setCollapsed, size }) : (
            <div className="h-full" hidden={collapsed} inert={collapsed || undefined}>{config.content}</div>
          )}
        </div>
      </div>
      {canResize && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- focusable ARIA separator provides keyboard and pointer resizing
        <div role="separator" tabIndex={0} aria-label={`Resize ${config.label}`}
          aria-orientation={vertical ? "horizontal" : "vertical"}
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={size}
          className={classNames("absolute z-20 touch-none bg-transparent hover:bg-blue-400/30 focus-visible:bg-blue-400/30 focus-visible:outline-none", vertical ? "inset-x-0 top-0 h-2 cursor-row-resize" : side === "right" ? "inset-y-0 left-0 w-2 cursor-col-resize" : "inset-y-0 right-0 w-2 cursor-col-resize")}
          onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); drag.current = { position: vertical ? event.clientY : event.clientX, size }; setDragging(true); }}
          onKeyDown={(event) => {
            const grow = vertical ? "ArrowUp" : side === "right" ? "ArrowLeft" : "ArrowRight";
            const shrink = vertical ? "ArrowDown" : side === "right" ? "ArrowRight" : "ArrowLeft";
            if (![grow, shrink, "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            updateSize(event.key === "Home" ? min : event.key === "End" ? max : size + (event.key === grow ? 20 : -20));
          }}
        >
          <span aria-hidden="true" className={classNames(
            "pointer-events-none absolute rounded-full bg-neutral-300 dark:bg-neutral-600",
            vertical ? "left-1/2 top-0 h-1 w-10 -translate-x-1/2" : "left-0 top-1/2 h-10 w-1 -translate-y-1/2",
          )} />
        </div>
      )}
    </section>
  );
}

/** In-flow page regions: left/right span the body, bottom sits beneath the centre.
 * Give the layout a bounded height (for example h-full inside a flex-1 container).
 * Each region scrolls independently; children remain mounted when collapsed. */
export function PageBodyLayout({ header, left, right, bottom, children, className, minCenterWidth = 240, minCenterHeight = 120, variant = "outlined", ...surface }: PageBodyLayoutProps) {
  return (
    <Panel {...surface} variant={variant} padding="none" scrollable={false} flexBody className={classNames("h-full min-h-0 min-w-0", className)}>
      {header && <div className="shrink-0">{header}</div>}
      <div className={classNames("min-h-0 min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)}>
        <div className="flex h-full min-h-0" style={{ minWidth: minCenterWidth }}>
          {left && <Region side="left" config={left} />}
          <div className="flex min-w-0 flex-1 flex-col">
            <div data-page-region="center" className={classNames("min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)} style={{ minHeight: minCenterHeight, minWidth: minCenterWidth }}>{children}</div>
            {bottom && <Region side="bottom" config={bottom} />}
          </div>
          {right && <Region side="right" config={right} />}
        </div>
      </div>
    </Panel>
  );
}
export default PageBodyLayout;

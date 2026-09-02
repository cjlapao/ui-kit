/**
 * GanttLinkLayer — the absolutely-positioned SVG overlay that draws
 * dependency arrows. It also owns the `overlayRef` rect, which is the
 * timeline's origin in screen space (every drag coordinate resolves
 * against it).
 *
 * Pointer model: the layer is `pointer-events: none`; each link gets a wide
 * transparent hit path (`pointer-events: stroke`, ~{@link LINK_HIT_RADIUS}
 * px on each side of the 1.5px stroke) so arrows can be selected without
 * pixel-perfect aiming. A click is resolved by the engine's `pickLinkAt` —
 * the *nearest* route within the radius wins, so two close connectors never
 * fight over the same pointer (and neither blocks the bars underneath).
 * Arrowheads are polygons computed in the engine (no SVG markers, so every
 * browser gets the same shape and the `fill-*` token classes apply cleanly).
 */

import { forwardRef, useRef } from "react";
import {
  GanttLink,
  GanttLinkPath,
  GanttLinkPoint,
  TrueColor,
  getGanttLinkTokens,
  pickLinkAt,
  LINK_HIT_RADIUS,
} from "../../../../common/gantt";

export interface GanttRubberPreview {
  d: string;
  color: TrueColor;
  /** Arrowhead polygon (present when the pointer is over a target bar). */
  arrow?: string;
  /** Port anchors: source right edge and the target left edge / pointer. */
  from: GanttLinkPoint;
  to: GanttLinkPoint;
}

interface GanttLinkLayerProps {
  width: number;
  height: number;
  /** Left offset of the timeline inside the scroll content. */
  offsetLeft: number;
  paths: GanttLinkPath[];
  color: TrueColor;
  selected: GanttLink | null;
  rubber: GanttRubberPreview | null;
  interactive: boolean;
  onSelectLink: (link: GanttLink | null) => void;
  /** Remove the currently-selected link (floating delete control / dbl-click). */
  onDeleteLink?: (link: GanttLink) => void;
}

export const GanttLinkLayer = forwardRef<HTMLDivElement, GanttLinkLayerProps>(
  function GanttLinkLayer(
    {
      width,
      height,
      offsetLeft,
      paths,
      color,
      selected,
      rubber,
      interactive,
      onSelectLink,
      onDeleteLink,
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const selPath = selected ? paths.find((p) => p.link === selected) : undefined;
    const selColor = selPath ? (selPath.color ?? color) : color;
    const selMid = selPath
      ? { x: (selPath.from.x + selPath.to.x) / 2, y: (selPath.from.y + selPath.to.y) / 2 }
      : null;
    const canDelete = Boolean(interactive && onDeleteLink && selPath);

    /** Resolve a pointer event to the link the pointer is aiming at (nearest within radius). */
    const pickFromEvent = (e: React.MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      return pickLinkAt(paths, e.clientX - rect.left, e.clientY - rect.top);
    };

    /**
     * Toggle selection of the aimed-at link (clicking the selected one clears
     * it). Falls back to the path that received the click when the pointer
     * resolves to no route (e.g. coordinate-less synthetic clicks).
     */
    const handlePick = (e: React.MouseEvent, clicked: GanttLinkPath) => {
      e.stopPropagation();
      const pick = pickFromEvent(e) ?? clicked;
      onSelectLink(pick.link === selected ? null : pick.link);
    };

    /** Remove the aimed-at link (double-click). */
    const handleDelete = (e: React.MouseEvent, clicked: GanttLinkPath) => {
      e.stopPropagation();
      const pick = pickFromEvent(e) ?? clicked;
      if (interactive && onDeleteLink) onDeleteLink(pick.link);
    };

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute top-0 z-10"
        style={{ left: offsetLeft, width, height }}
      >
        <svg ref={svgRef} width={width} height={height} className="block overflow-visible">
          {paths.map((p, i) => {
            const tokens = getGanttLinkTokens(p.color ?? color);
            const sel = selected != null && p.link === selected;
            const nodeR = sel ? 4.5 : 3.5;
            return (
              <g
                key={`${p.link.source}->${p.link.target}-${p.type}-${i}`}
                style={sel ? { filter: `drop-shadow(0 0 3px var(--color-${p.color ?? color}-500))` } : undefined}
              >
                {/* Wide invisible hit target: makes the 1.5px stroke selectable without
                    pixel-perfect aiming. Clicks resolve to the NEAREST route within the
                    radius (engine `pickLinkAt`), so close connectors never fight over a
                    pointer. */}
                <path
                  d={p.d}
                  data-gantt-link-hit
                  data-gantt-keep-link-selection
                  fill="none"
                  stroke="transparent"
                  strokeLinejoin="round"
                  strokeWidth={LINK_HIT_RADIUS * 2}
                  style={{
                    pointerEvents: interactive ? "stroke" : "none",
                    cursor: interactive ? "pointer" : "default",
                  }}
                  onClick={(e) => handlePick(e, p)}
                  onDoubleClick={(e) => handleDelete(e, p)}
                >
                  <title>{`${p.link.source} → ${p.link.target} (${p.type.toUpperCase()})`}</title>
                </path>
                <path
                  d={p.d}
                  data-gantt-keep-link-selection
                  className={tokens.stroke}
                  fill="none"
                  strokeLinejoin="round"
                  strokeWidth={sel ? 2.5 : 1.5}
                  strokeDasharray={p.type === "ff" || p.type === "sf" ? "4 3" : undefined}
                  style={{
                    pointerEvents: interactive ? "stroke" : "none",
                    cursor: interactive ? "pointer" : "default",
                  }}
                  onClick={(e) => handlePick(e, p)}
                  onDoubleClick={(e) => handleDelete(e, p)}
                >
                  <title>{`${p.link.source} → ${p.link.target} (${p.type.toUpperCase()})`}</title>
                </path>
                {p.arrow && <polygon points={p.arrow} className={tokens.fill} />}
                {/* Port (connection) nodes: a pale halo + a solid dot at each bar edge. */}
                <circle cx={p.from.x} cy={p.from.y} r={nodeR + 2.5} className={tokens.halo} />
                <circle cx={p.from.x} cy={p.from.y} r={nodeR} className={tokens.fill} />
                <circle cx={p.to.x} cy={p.to.y} r={nodeR + 2.5} className={tokens.halo} />
                <circle cx={p.to.x} cy={p.to.y} r={nodeR} className={tokens.fill} />
              </g>
            );
          })}
          {rubber &&
            (() => {
              const tokens = getGanttLinkTokens(rubber.color);
              return (
                <g>
                  <path
                    d={rubber.d}
                    className={tokens.stroke}
                    fill="none"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                  />
                  {rubber.arrow && <polygon points={rubber.arrow} className={tokens.fill} />}
                  <circle cx={rubber.from.x} cy={rubber.from.y} r={6} className={tokens.halo} />
                  <circle cx={rubber.from.x} cy={rubber.from.y} r={3.5} className={tokens.fill} />
                  <circle cx={rubber.to.x} cy={rubber.to.y} r={6} className={tokens.halo} />
                  <circle cx={rubber.to.x} cy={rubber.to.y} r={3.5} className={tokens.fill} />
                </g>
              );
            })()}
        </svg>
        {/* Floating delete control for the selected link (mouse affordance;
            the Delete/Backspace key also works once the chart has focus). */}
        {canDelete && selMid && (
          <button
            type="button"
            tabIndex={-1}
            data-gantt-keep-link-selection
            className="pointer-events-auto absolute z-20 inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] font-semibold shadow-sm outline-none transition-transform hover:scale-105"
            style={{
              left: selMid.x,
              top: selMid.y,
              transform: "translate(-50%, calc(-100% - 8px))",
              backgroundColor: "var(--color-white, #ffffff)",
              borderColor: `var(--color-${selColor}-300)`,
              color: `var(--color-${selColor}-700)`,
            }}
            onClick={() => onDeleteLink!(selected!)}
            title="Remove this dependency (or press Delete)"
          >
            <span aria-hidden>✕</span> Delete
          </button>
        )}
      </div>
    );
  },
);

GanttLinkLayer.displayName = "GanttLinkLayer";

import React from "react";
import classNames from "classnames";

import ConnectionFlowNodeBody from "./ConnectionFlowNodeBody";
import {
  connectorVisual,
  dotTiming,
  getNodeSurface,
  getToneClasses,
  labelAnchor,
  routeLength,
  type ConnectionFlowLayout,
  type LaidOutConnector,
  type LaidOutEdge,
  type LaidOutNode,
  type ConnectionFlowLayoutOptions,
  type NodeMetrics,
} from "../../connectionFlow";
import type { SurfaceVariant } from "../../theme/Theme";

export interface ConnectionFlowSvgProps {
  layout: ConnectionFlowLayout;
  /** Px per second every dot travels at. */
  dotSpeed: number;
  /** Milliseconds between one dot leaving a source and the next. */
  dotInterval: number;
  /** Every number the card body is built from. */
  metrics: NodeMetrics;
  /** The resolved layout options, for the item cap. */
  options: ConnectionFlowLayoutOptions;
  /** Nodes whose item list is expanded. */
  expanded: ReadonlySet<string>;
  onToggleExpanded: (id: string) => void;
  /**
   * The surface the cards take. Resolved from the flow's own `variant` — a
   * card sitting inside a panel is part of that panel, not a second surface
   * language layered on top of it.
   */
  variant: SurfaceVariant;
  showProgress: boolean;
  animated: boolean;
  highlightNodes: Set<string>;
  highlightEdges: Set<string>;
  hoveredId: string | null;
  selectedId: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  onHover: (node: LaidOutNode | null) => void;
  onSelect: (node: LaidOutNode) => void;
  /** Replaces the default card body — the reason to choose this renderer. */
  renderNode?: (node: LaidOutNode) => React.ReactNode;
}

const ConnectionFlowSvg: React.FC<ConnectionFlowSvgProps> = ({
  layout,
  dotSpeed,
  dotInterval,
  metrics,
  options,
  expanded,
  onToggleExpanded,
  variant,
  showProgress,
  animated,
  highlightNodes,
  highlightEdges,
  hoveredId,
  selectedId,
  scale,
  offsetX,
  offsetY,
  onHover,
  onSelect,
  renderNode,
}) => {
  // Dimming is by opacity so the tone classes stay untouched. The dimmed
  // edges go in a group of their own rather than carrying the opacity each:
  // a fan's lines overlap on the run they share, and six translucent strokes
  // laid over each other composite back to nearly opaque — so the "dimmed"
  // spine came out barely darker than a lit one. One group, one opacity, and
  // it also puts the dimmed edges behind the lit ones where they belong.
  const isLit = (edge: LaidOutEdge) =>
    highlightEdges.size === 0 || highlightEdges.has(edge.id);
  const nodeOpacity = (node: LaidOutNode) =>
    highlightNodes.size === 0 || highlightNodes.has(node.id) ? 1 : 0.22;
  // A terminal is lit when any edge meeting it is, so a connector never
  // outshines the line it belongs to.
  const connectorOpacity = (connector: LaidOutConnector) =>
    highlightEdges.size === 0 ||
    connector.edgeIds.some((id) => highlightEdges.has(id))
      ? 1
      : 0.22;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Edges behind the cards, so a card covers the stub where its edge
          meets it. The terminals go in a third layer *above* the cards — a
          ring straddles the border, and drawn down here its inner half sat
          under a translucent card fill and came out muddy. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        {([false, true] as const).map((lit) => (
          <g
            key={String(lit)}
            opacity={lit ? 1 : 0.22}
            transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
          >
            {layout.edges
              .filter((edge) => isLit(edge) === lit)
              .map((edge) => {
                const dots = animated && edge.animated;
                const timing = dots
                  ? dotTiming(
                      routeLength(edge.points),
                      edge.emitIndex,
                      edge.emitCount,
                      edge.emitSpan,
                      dotSpeed,
                      dotInterval / 1000,
                    )
                  : null;
                const edgeTone = getToneClasses(edge.targetTone);
                return (
                  <g key={edge.id}>
                    <path
                      d={edge.d}
                      fill="none"
                      className={edgeTone.line}
                      strokeWidth={edge.state === "disabled" ? 1 : 1.75}
                      strokeDasharray={
                        edge.state === "disabled" ? "4 4" : undefined
                      }
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* One travelling dot, released on its turn.
                        `keyPoints`/`keyTimes` run the motion over the first
                        `arrival` of the cycle and park the dot at the end for
                        the rest; the opacity animation hides it while it
                        waits. Same weight and shade as a terminal's core, so
                        what flows along the line reads as the same material
                        as what it flows into. */}
                    {timing && (
                      <circle r={2} className={edgeTone.dot} opacity={0}>
                        <animateMotion
                          path={edge.d}
                          dur={`${timing.cycle.toFixed(3)}s`}
                          begin={`${timing.begin.toFixed(3)}s`}
                          repeatCount="indefinite"
                          calcMode="linear"
                          keyPoints="0;1;1"
                          keyTimes={`0;${timing.arrival.toFixed(4)};1`}
                        />
                        <animate
                          attributeName="opacity"
                          dur={`${timing.cycle.toFixed(3)}s`}
                          begin={`${timing.begin.toFixed(3)}s`}
                          repeatCount="indefinite"
                          calcMode="discrete"
                          values="1;0"
                          keyTimes={`0;${timing.arrival.toFixed(4)}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
          </g>
        ))}

        {/* Captions, in a pass of their own over the whole edge layer. Drawn
            inside each edge's group they were crossed by the *next* edge's
            line — a fan shares one spine, and that spine is a different edge
            from the one carrying the label. */}
        <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
          {layout.edges.map((edge) => {
            if (!edge.label) return null;
            const at = labelAnchor(edge.points);
            const width = edge.label.length * 6.8 + 16;
            return (
              <g key={edge.id} opacity={isLit(edge) ? 1 : 0.22}>
                <rect
                  x={at.x - width / 2}
                  y={at.y - 9}
                  width={width}
                  height={18}
                  rx={4}
                  className="fill-white dark:fill-neutral-900"
                />
                <text
                  x={at.x}
                  y={at.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-neutral-500 text-[10px] dark:fill-neutral-400"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* The cards themselves. Painted as paths rather than as CSS boxes,
          because a terminal is the card *bulging* — no chord across it, and
          the same fill inside — which a border cannot express. The elements
          below carry only content. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
          {layout.nodes.map((laid) => {
            const tone = getToneClasses(laid.tone);
            const surface = getNodeSurface(laid.tone, variant);
            const selected = selectedId === laid.id;
            return (
              <path
                key={laid.id}
                d={laid.outline}
                opacity={nodeOpacity(laid)}
                strokeWidth={selected ? 2 : hoveredId === laid.id ? 1.5 : 1}
                className={classNames(
                  surface.fill,
                  surface.effect,
                  // A selected card takes the tone at full strength whatever
                  // its variant, so the selection reads on `tonal` and `simple`
                  // too — they carry no rim of their own.
                  selected ? tone.shapeStrokeSelected : surface.stroke,
                )}
              />
            );
          })}
        </g>
      </svg>

      {/* Card content. The silhouette above owns fill, border and selection,
          so this element is transparent and exists for the text, the slot and
          the hit target. */}
      <div className="absolute inset-0">
        {layout.nodes.map((laid) => (
          <div
            key={laid.id}
            role="button"
            tabIndex={laid.node.disabled ? -1 : 0}
            className={classNames(
              "pointer-events-auto absolute overflow-hidden outline-none",
              laid.node.disabled ? "cursor-default" : "cursor-pointer",
            )}
            style={{
              left: offsetX + laid.x * scale,
              top: offsetY + laid.y * scale,
              width: laid.width * scale,
              height: laid.height * scale,
              opacity: nodeOpacity(laid),
            }}
            onMouseEnter={() => onHover(laid)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(laid)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(laid)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(laid);
              }
            }}
          >
            {/* The body is laid out at its natural size and scaled by one
                transform, so type, padding, gaps and the progress bar zoom
                together — and the height the DOM produces is the number
                `measureNode` computed, at any zoom. */}
            <div
              data-scrolls={laid.scrollable ? "" : undefined}
              className={classNames(
                laid.scrollable &&
                  "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent",
              )}
              style={{
                width: laid.width,
                height: laid.height,
                padding: metrics.padding,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              // A scrolling body has to keep its wheel events: without this the
              // canvas zooms instead, and the card can never be scrolled.
              onWheel={
                laid.scrollable
                  ? (event) => event.stopPropagation()
                  : undefined
              }
            >
              {renderNode ? (
                renderNode(laid)
              ) : (
                <ConnectionFlowNodeBody
                  node={laid}
                  metrics={metrics}
                  showProgress={showProgress}
                  options={options}
                  scrollable={laid.scrollable}
                  expanded={expanded}
                  onToggleExpanded={onToggleExpanded}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terminals, above the cards. One per port, not one per edge — the
          bulge around each is part of the card's own outline. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
          {layout.connectors.map((connector) => {
            const visual = connectorVisual(connector);
            return (
              <circle
                key={connector.id}
                cx={connector.x}
                cy={connector.y}
                r={visual.dotRadius}
                opacity={connectorOpacity(connector) * visual.opacity}
                className={visual.dotClass}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default ConnectionFlowSvg;

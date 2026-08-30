import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import Panel from "../Panel";
import type { PillVariant } from "../Pill";
import ConnectionFlowHeader from "./ConnectionFlowHeader";
import ConnectionFlowSkeleton from "./ConnectionFlowSkeleton";
import IconButton from "../IconButton";
import EmptyState from "../EmptyState";
import Progress from "../Progress";
import ProgressSpinner from "../ProgressSpinner";
import ConnectionFlowSvg from "./ConnectionFlowSvg";
import {
  DEFAULT_LAYOUT_OPTIONS,
  NODE_CORNER_RADIUS,
  NODE_METRICS,
  fitToViewport,
  flowProgress,
  getHeaderSurface,
  layoutConnectionFlow,
  tracePathTo,
  type ConnectionFlowEdgeStyle,
  type ConnectionFlowItemProgress,
  type ConnectionFlowLoader,
  type ConnectionFlowNode,
  type ConnectionFlowProgressType,
  type ConnectionFlowRingSize,
  type ConnectionState,
  type LaidOutNode,
} from "../../connectionFlow";
import {
  DEFAULT_SURFACE_CORNER,
  type ControlSize,
  type PlainSurfaceVariant,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
} from "../../theme/Theme";

export interface ConnectionFlowProps {
  nodes: ConnectionFlowNode[];
  variant?: PlainSurfaceVariant;
  tone?: TrueColor;
  size?: ControlSize;
  corner?: SurfaceCorner;
  edgeStyle?: ConnectionFlowEdgeStyle;
  /**
   * Surface treatment for the node cards, on the same container scale `Panel`
   * takes. A node's own `variant` overrides it. @default "subtle"
   */
  /**
   * Rows a card shows before the rest collapse behind a "show more" row.
   * A node's own `maxItems` overrides it. @default 2
   */
  maxVisibleItems?: number;
  /**
   * Where an item draws its progress: a bar under its text, or a spinner in
   * place of its glyph. A node's `itemProgress`, then an item's
   * `progressType`, override it. @default "bar"
   */
  itemProgress?: ConnectionFlowItemProgress;
  /**
   * Size of the ring drawn where an edge meets a node. `fit` collapses the
   * ring onto its core dot. @default "md"
   */
  ringSize?: ConnectionFlowRingSize;
  flowState?: ConnectionState;
  autoState?: boolean;
  animated?: boolean;
  /**
   * How fast a travelling dot moves, in px per second.
   *
   * One speed for the whole graph: a dot's flight time comes from its route's
   * own length, so a short hop and a long bypass arc move at the same pace
   * instead of each taking a fixed 2.4s. @default 120
   */
  dotSpeed?: number;
  /**
   * Milliseconds between one dot leaving a source and the next.
   *
   * A source releases one dot at a time, taking its outgoing edges in turn —
   * first target, second, third, then round again — so a fan reads as one
   * source feeding its targets rather than as a swarm. @default 700
   */
  dotInterval?: number;
  progressType?: ConnectionFlowProgressType;
  highlightPath?: boolean;
  showControls?: boolean;
  /**
   * Scale the graph to fit on first paint instead of opening at 100%.
   *
   * The viewport scrolls, so a graph larger than its frame is reachable
   * without shrinking it to illegibility — which is what fitting a tall flow
   * into a short frame does. @default false
   */
  fitOnLoad?: boolean;
  interactive?: boolean;
  minZoom?: number;
  maxZoom?: number;
  height?: number | string;
  /** Header title. Rendered by the flow, not by the wrapping Panel. */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small uppercase line above the title. */
  eyebrow?: React.ReactNode;
  /** Icon chip beside the title. A registry name, or any node. */
  icon?: React.ReactNode;
  /** Corner of that chip, on the shared container scale. */
  iconCorner?: SurfaceCorner;
  /** Pill at the right of the header. A string, or any node. */
  tag?: React.ReactNode;
  tagTone?: TrueColor;
  tagVariant?: PillVariant;
  /** Draw the header at all. @default true */
  showHeader?: boolean;
  /**
   * The flow's completion, 0–1. Defaults to the mean of whatever the nodes
   * report — which a pipeline usually knows better than the average of its
   * cards does.
   */
  progress?: number;
  loading?: boolean;
  /**
   * How `loading` is shown. `skeleton` is the default because it is the only
   * one that holds the card's shape: a spinner or a bar collapses the frame
   * and the layout jumps when the real graph arrives. @default "skeleton"
   */
  loaderType?: ConnectionFlowLoader;
  emptyMessage?: string;
  className?: string;
  onNodeClick?: (node: ConnectionFlowNode) => void;
  onNodeHover?: (node: ConnectionFlowNode | null) => void;
  onZoomChange?: (scale: number) => void;
  /** Custom card body. `renderer="svg"` only — a canvas has no elements. */
  renderNode?: (node: LaidOutNode) => React.ReactNode;
}

export interface ConnectionFlowHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  fit: () => void;
  setZoom: (value: number) => void;
}

/**
 * The registry has no "fit to view" or "minus" glyph. Rather than press a
 * wrong-but-present icon into service, these two are inline. `IconButton`
 * takes a node as readily as a name, so they keep the kit's sizing and focus
 * treatment.
 */
const FIT_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9V5a1 1 0 0 1 1-1h4" />
    <path d="M15 4h4a1 1 0 0 1 1 1v4" />
    <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
    <path d="M9 20H5a1 1 0 0 1-1-1v-4" />
  </svg>
);

const MINUS_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <path d="M6 12h12" />
  </svg>
);

const ConnectionFlow = React.forwardRef<
  ConnectionFlowHandle,
  ConnectionFlowProps
>(function ConnectionFlow(
  {
    nodes,
    variant = "outlined",
    tone = "neutral",
    size = "md",
    corner = DEFAULT_SURFACE_CORNER,
    edgeStyle = "orthogonal",
    maxVisibleItems = 2,
    itemProgress = "bar",
    ringSize = "md",
    flowState = "flowing",
    autoState = false,
    animated = true,
    dotSpeed = 120,
    dotInterval = 700,
    progressType = "bar",
    highlightPath = true,
    showControls = true,
    fitOnLoad = false,
    interactive = true,
    minZoom = 0.25,
    maxZoom = 2,
    height = 320,
    title,
    subtitle,
    eyebrow,
    icon,
    iconCorner = "rounded-md",
    tag,
    tagTone,
    tagVariant = "soft",
    showHeader = true,
    progress,
    loading = false,
    loaderType = "skeleton",
    emptyMessage,
    className,
    onNodeClick,
    onNodeHover,
    onZoomChange,
    renderNode,
  },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const metrics = NODE_METRICS[size] ?? NODE_METRICS.md;
  const radius = NODE_CORNER_RADIUS[corner] ?? NODE_CORNER_RADIUS["rounded-md"];

  const layoutOptions = useMemo(
    () => ({
      ...DEFAULT_LAYOUT_OPTIONS,
      metrics,
      edgeStyle,
      ringSize,
      maxVisibleItems,
      itemProgress,
      // The card silhouette is geometry, so the corner radius belongs to
      // the layout rather than to the renderer that draws it.
      nodeCornerRadius: radius,
    }),
    [metrics, edgeStyle, ringSize, maxVisibleItems, itemProgress, radius],
  );

  const layout = useMemo(
    () =>
      layoutConnectionFlow({
        nodes,
        flowState,
        autoState,
        animated,
        expanded,
        options: layoutOptions,
      }),
    [nodes, flowState, autoState, animated, expanded, layoutOptions],
  );

  const onToggleExpanded = useCallback((id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  // The lit set is the ancestry of whatever the pointer is on. Empty means
  // "no highlight", which the renderers read as "draw everything lit" — so the
  // default state costs nothing.
  const highlight = useMemo(() => {
    const focus = hoveredId ?? selectedId;
    if (!highlightPath || !focus) {
      return { nodes: new Set<string>(), edges: new Set<string>() };
    }
    return tracePathTo(layout, focus);
  }, [layout, hoveredId, selectedId, highlightPath]);

  const clampZoom = useCallback(
    (value: number) => Math.min(maxZoom, Math.max(minZoom, value)),
    [minZoom, maxZoom],
  );

  /**
   * A scroll position to apply once the canvas has been re-sized for the new
   * scale. Setting `scrollLeft` before the content grows just clamps against
   * the old extent, so the adjustment waits for the layout effect below.
   */
  const pendingScroll = useRef<((el: HTMLDivElement) => void) | null>(null);

  useLayoutEffect(() => {
    const element = viewportRef.current;
    const apply = pendingScroll.current;
    if (!element || !apply) return;
    pendingScroll.current = null;
    apply(element);
  }, [scale]);

  const setZoom = useCallback(
    (value: number, anchor?: { x: number; y: number }) => {
      const next = clampZoom(value);
      if (next === scale) return;
      const element = viewportRef.current;
      if (element) {
        // Zoom about a point, so the graph does not slide away from the
        // cursor. The canvas grows by `ratio`, so the distance from the
        // scroll origin to that point grows by the same factor.
        const point = anchor ?? {
          x: element.clientWidth / 2,
          y: element.clientHeight / 2,
        };
        const ratio = next / scale;
        const { scrollLeft, scrollTop } = element;
        pendingScroll.current = (el) => {
          el.scrollLeft = (scrollLeft + point.x) * ratio - point.x;
          el.scrollTop = (scrollTop + point.y) * ratio - point.y;
        };
      }
      setScale(next);
      onZoomChange?.(next);
    },
    [clampZoom, scale, onZoomChange],
  );

  const fit = useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;
    const { clientWidth, clientHeight } = element;
    if (!clientWidth || !clientHeight) return;
    const next = clampZoom(
      fitToViewport(layout, clientWidth, clientHeight, maxZoom).scale,
    );
    // Everything is visible at this scale, so the origin is the right place
    // to be looking.
    pendingScroll.current = (el) => {
      el.scrollLeft = 0;
      el.scrollTop = 0;
    };
    setScale(next);
    onZoomChange?.(next);
  }, [layout, maxZoom, clampZoom, onZoomChange]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => setZoom(scale * 1.2),
    zoomOut: () => setZoom(scale / 1.2),
    fit,
    setZoom: (value: number) => setZoom(value),
  }));

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setViewport({ width: box.width, height: box.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (fitOnLoad && viewport.width) fit();
    // Keyed on the graph and the viewport, deliberately *not* on `layout`:
    // expanding a card's item list changes the layout, and refitting on that
    // would slide the whole graph out from under the pointer that opened it.
  }, [fitOnLoad, nodes, viewport.width, viewport.height]);

  const onHover = (node: LaidOutNode | null) => {
    setHoveredId(node?.id ?? null);
    onNodeHover?.(node?.node ?? null);
  };

  const onSelect = (node: LaidOutNode) => {
    setSelectedId((current) => (current === node.id ? null : node.id));
    onNodeClick?.(node.node);
  };

  // Stated outright if the caller says so, else the mean of what the nodes
  // report — including cards built from items, which have no `progress` of
  // their own and used not to count at all.
  const overallProgress = useMemo(
    () => flowProgress(nodes, progress),
    [nodes, progress],
  );

  // `plain` draws no Panel, so the cards and the header take the nearest
  // real surface rather than inventing a second scale of their own.
  const surfaceVariant: SurfaceVariant =
    variant === "plain" ? "simple" : variant;
  const headerSurface = getHeaderSurface(surfaceVariant);

  const rendererProps = {
    layout,
    dotSpeed,
    dotInterval,
    metrics,
    options: layoutOptions,
    expanded,
    onToggleExpanded,
    variant: surfaceVariant,
    showProgress: progressType !== "none",
    animated,
    highlightNodes: highlight.nodes,
    highlightEdges: highlight.edges,
    hoveredId,
    selectedId,
    scale,
    // The canvas is sized to the content and scrolled natively, so the only
    // offset the renderers need is the overhang: a bypass arc lifts above the
    // origin, and its share of the canvas sits before the first card.
    offsetX: -layout.offsetX * scale,
    offsetY: -layout.offsetY * scale,
    onHover,
    onSelect,
  };

  // What the scroll area contains, including anything overhanging the origin.
  const canvas = {
    width: (layout.width - layout.offsetX) * scale,
    height: (layout.height - layout.offsetY) * scale,
  };

  const body = (
    <div className="relative w-full">
      {showHeader &&
        (eyebrow || title || subtitle || icon || tag || progressType !== "none") && (
          <>
            <div className="px-4 pt-4 pb-3">
              <ConnectionFlowHeader
                variant={surfaceVariant}
                tone={tone}
                eyebrow={eyebrow}
                title={title}
                subtitle={subtitle}
                icon={icon}
                iconCorner={iconCorner}
                tag={tag}
                tagTone={tagTone}
                tagVariant={tagVariant}
                progress={overallProgress}
                progressType={progressType}
                animated={animated}
                loading={loading}
              />
            </div>
            <div className={classNames("border-b", headerSurface.divider)} />
          </>
        )}

      {loading && loaderType !== "skeleton" ? (
        <div
          className="flex w-full items-center justify-center"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          {loaderType === "spinner" ? (
            <ProgressSpinner
              size="xl"
              color={tone === "neutral" ? "blue" : tone}
              ariaLabel="Loading flow"
            />
          ) : (
            <div className="w-1/2 max-w-sm">
              <Progress
                size="sm"
                color={tone === "neutral" ? "blue" : tone}
                indeterminate
                label="Loading flow"
              />
            </div>
          )}
        </div>
      ) : loading ? (
        <div
          className="w-full overflow-hidden"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          <ConnectionFlowSkeleton variant={surfaceVariant} metrics={metrics} />
        </div>
      ) : nodes.length === 0 ? (
        <EmptyState
          variant="plain"
          size="sm"
          icon="ViewGrid"
          title={emptyMessage ?? "Nothing to show"}
          subtitle="No steps have been reported for this flow."
        />
      ) : (
        <div
          className="relative w-full"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
        <div
          ref={viewportRef}
          className="h-full w-full select-none overflow-auto overscroll-contain [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ cursor: panning ? "grabbing" : undefined }}
          onWheel={(event) => {
            if (!interactive) return;
            // A card that scrolls its own body keeps its wheel: without this
            // the canvas zooms and the card can never be scrolled.
            if ((event.target as HTMLElement).closest("[data-scrolls]")) return;
            const rect = viewportRef.current?.getBoundingClientRect();
            const anchor = rect
              ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
              : undefined;
            setZoom(scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1), anchor);
          }}
          onPointerDown={(event) => {
            if (!interactive || event.button !== 0) return;
            // A press that starts on a control belongs to the control.
            // Capturing the pointer here redirects its `pointerup` to the
            // viewport, so the control never sees a click at all — which is
            // why the zoom buttons and "show more" did nothing.
            if (
              (event.target as HTMLElement).closest(
                "button, a, input, select, textarea, [data-no-pan]",
              )
            ) {
              return;
            }
            const element = viewportRef.current;
            if (!element) return;
            setPanning(true);
            panStart.current = {
              x: event.clientX,
              y: event.clientY,
              scrollLeft: element.scrollLeft,
              scrollTop: element.scrollTop,
            };
            element.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!panning) return;
            const element = viewportRef.current;
            if (!element) return;
            element.scrollLeft =
              panStart.current.scrollLeft - (event.clientX - panStart.current.x);
            element.scrollTop =
              panStart.current.scrollTop - (event.clientY - panStart.current.y);
          }}
          onPointerUp={(event) => {
            if (!panning) return;
            setPanning(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
        >
          {/* Sized to the content so the viewport can scroll to it natively.
              The renderers draw into this, not into the viewport. */}
          <div
            className="relative"
            style={{ width: canvas.width, height: canvas.height }}
          >
            <ConnectionFlowSvg {...rendererProps} renderNode={renderNode} />
          </div>
        </div>

          {/* Zoom controls, bottom-right, matching the placement GitHub
              Actions uses for the same job. */}
          {showControls && (
            <div
              data-no-pan
              className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
              <IconButton
                icon={FIT_ICON}
                size="xs"
                variant="ghost"
                color="slate"
                srLabel="Fit to view"
                tooltip="Fit to view"
                onClick={fit}
              />
              <IconButton
                icon={MINUS_ICON}
                size="xs"
                variant="ghost"
                color="slate"
                srLabel="Zoom out"
                tooltip="Zoom out"
                disabled={scale <= minZoom}
                onClick={() => setZoom(scale / 1.2)}
              />
              {/* A readout, not a control. The reset it used to carry was
                  invisible — nothing about a percentage says "click me" — so
                  it is a button of its own now. */}
              <span
                className="min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
                title="Zoom level"
              >
                {Math.round(scale * 100)}%
              </span>
              <IconButton
                icon="Add"
                size="xs"
                variant="ghost"
                color="slate"
                srLabel="Zoom in"
                tooltip="Zoom in"
                disabled={scale >= maxZoom}
                onClick={() => setZoom(scale * 1.2)}
              />
              <IconButton
                icon="Reset"
                size="xs"
                variant="ghost"
                color="slate"
                srLabel="Reset zoom to 100%"
                tooltip="Reset zoom"
                disabled={scale === 1}
                onClick={() => setZoom(1)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "plain") {
    return <div className={classNames("w-full", className)}>{body}</div>;
  }

  return (
    <Panel
      className={classNames("w-full", className)}
      variant={variant}
      tone={tone}
      corner={corner}
      padding="none"
      // Title, subtitle and loading are drawn by the flow's own header:
      // Panel's carries no icon chip and no progress, and `variant="plain"`
      // renders no Panel at all, so the header has to belong here either way.
      scrollable={false}
    >
      {body}
    </Panel>
  );
});

ConnectionFlow.displayName = "ConnectionFlow";

export default ConnectionFlow;

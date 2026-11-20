import { getSurfaceAccentColor } from "../../theme/Theme";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Panel, { SkeletonBar } from "../Panel";
import EmptyState from "../EmptyState";
import Button from "../Button";
import IconButton from "../IconButton";
import { GridBackground } from "../GridBackground";
import Checkbox from "../Checkbox";
import Combobox from "../Combobox";
import { ScrollArea } from "../ScrollArea";
import { useKitT } from "../../i18n";
import { buildNetwork, pickNode } from "./model";
import { useNetworkCanvas } from "./useNetworkCanvas";
import type {
  NetworkGraphCommunity,
  NetworkGraphEdge,
  NetworkGraphNode,
  NetworkGraphProps,
  NetworkGraphSelectionInfo,
} from "./types";
import "./network-graph.css";

const NO_COMMUNITIES: readonly NetworkGraphCommunity[] = [];
const NO_HIGHLIGHTS: readonly string[] = [];

/** Inspector column gap kept from the graph — must match network-graph.css. */
const INSPECTOR_GAP = 16;
/** The `inspectorWidth` default and its sanity clamp. */
const INSPECTOR_WIDTH_DEFAULT = 280;
const INSPECTOR_WIDTH_MIN = 180;
const INSPECTOR_WIDTH_MAX = 480;
/** Graph-column floor behind the derived dock threshold. */
const INSPECTOR_MIN_MAIN_WIDTH_DEFAULT = 320;

/** One clamp, so the CSS column and the dock threshold never disagree. */
const clampInspectorWidth = (value: number | undefined): number =>
  Math.max(
    INSPECTOR_WIDTH_MIN,
    Math.min(INSPECTOR_WIDTH_MAX, Number.isFinite(value) ? (value as number) : INSPECTOR_WIDTH_DEFAULT),
  );

export function NetworkGraph({
  nodes,
  edges,
  communities = NO_COMMUNITIES,
  height = 480,
  selectedNodeId,
  defaultSelectedNodeId = null,
  onNodeSelect,
  visibleCommunityIds,
  onVisibleCommunitiesChange,
  highlightedEdgeIds = NO_HIGHLIGHTS,
  showCommunities = true,
  legendPosition = "auto",
  legendPanel = false,
  legendVariant = "auto",
  legendTone = "auto",
  inspector = false,
  inspectorVariant = "auto",
  inspectorTone = "auto",
  inspectorWidth = INSPECTOR_WIDTH_DEFAULT,
  inspectorMinMainWidth = INSPECTOR_MIN_MAIN_WIDTH_DEFAULT,
  inspectorStackBelow,
  inspectorTitle,
  inspectorButtonVariant = "solid",
  inspectorButtonTone = "slate",
  inspectorButtonWeight,
  renderInspectorBody,
  renderInspectorActions,
  showLabels = false,
  showControls = true,
  grid = true,
  gridTone = "blue",
  hoverHighlight = true,
  fullHeight = false,
  fullWidth = true,
  ariaLabel,
  emptyMessage,
  onViewportChange,
  tone: surfaceTone = "none",
  variant = "elevated",
  disabled = false,
  loading = false,
  ...panelProps
}: NetworkGraphProps) {
  const tone = getSurfaceAccentColor(surfaceTone);
  const t = useKitT();
  const helpId = useId();
  const layoutRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hasLegendSpace, setHasLegendSpace] = useState(true);
  const [inspectorStacked, setInspectorStacked] = useState(false);
  const legendOnRight =
    legendPosition === "right" || (legendPosition === "auto" && hasLegendSpace);
  const resolvedInspectorWidth = clampInspectorWidth(inspectorWidth);
  useEffect(() => {
    const element = layoutRef.current;
    if (!element || legendPosition !== "auto") return;
    const measure = () =>
      setHasLegendSpace(element.getBoundingClientRect().width >= 600);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [legendPosition, loading]);
  useEffect(() => {
    const element = rootRef.current;
    if (!element || !inspector) return;
    // Fit-based rather than a magic number: the inspector docks beside the graph
    // only while the graph column keeps its floor after the inspector column and
    // its gap are taken from the component. `inspectorStackBelow` replaces the
    // comparison outright for callers who simply want one side or the other.
    const threshold =
      inspectorStackBelow ??
      resolvedInspectorWidth + INSPECTOR_GAP + inspectorMinMainWidth;
    const measure = () =>
      setInspectorStacked(element.getBoundingClientRect().width < threshold);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [inspector, resolvedInspectorWidth, inspectorMinMainWidth, inspectorStackBelow]);
  const model = useMemo(
    () => buildNetwork(nodes, edges, communities),
    [nodes, edges, communities],
  );
  const [internalSelected, setInternalSelected] = useState<string | null>(
    defaultSelectedNodeId,
  );
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // Mirrors drag.current.moved so the cursor can switch to the drag (closed
  // hand) icon only once a pan actually starts — plain clicks keep the
  // normal cursor instead of flashing :active the way active:cursor-grabbing did.
  const [panning, setPanning] = useState(false);
  // Node under the pointer (visual preview only — never selection).
  const [hovered, setHovered] = useState<string | null>(null);
  const enabled = useMemo(
    () =>
      new Set(
        visibleCommunityIds ??
          model.groups.filter((g) => !hidden.has(g.id)).map((g) => g.id),
      ),
    [visibleCommunityIds, model, hidden],
  );
  const visibleNodes = useMemo(
    () => model.nodes.filter((n) => !n.community || enabled.has(n.community)),
    [model, enabled],
  );
  const visible = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes],
  );
  const selection =
    selectedNodeId === undefined ? internalSelected : selectedNodeId;
  const selected =
    selection !== null && visible.has(selection) ? selection : null;
  const activeFocus = focused !== null && visible.has(focused) ? focused : null;
  const highlighted = useMemo(
    () => new Set(highlightedEdgeIds),
    [highlightedEdgeIds],
  );
  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const n of model.nodes)
      if (n.community)
        result.set(n.community, (result.get(n.community) ?? 0) + 1);
    return result;
  }, [model]);
  const selectedNode = selected !== null ? model.byId.get(selected) : undefined;
  const selectionInfo = useMemo<NetworkGraphSelectionInfo | null>(() => {
    if (!selectedNode) return null;
    const neighborIds = model.adjacency.get(selectedNode.id);
    const neighbors: NetworkGraphNode[] = [];
    if (neighborIds)
      for (const id of neighborIds)
        if (visible.has(id)) {
          const neighbor = model.byId.get(id);
          if (neighbor) neighbors.push(neighbor);
        }
    const community = selectedNode.community
      ? model.groups.find((group) => group.id === selectedNode.community)
      : undefined;
    return {
      label: selectedNode.label ?? selectedNode.id,
      community,
      connectionCount: neighborIds?.size ?? 0,
      neighbors,
    };
  }, [selectedNode, model, visible]);
  const canvas = useNetworkCanvas({
    active: !loading,
    model,
    nodes: visibleNodes,
    visible,
    selected,
    focused: activeFocus,
    hovered: hoverHighlight && !disabled && !loading ? hovered : null,
    highlighted,
    tone,
    showLabels,
    onViewportChange,
  });
  const locked = disabled || loading;
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const select = (id: string | null) => {
    if (locked) return;
    if (selectedNodeId === undefined) setInternalSelected(id);
    onNodeSelect?.(id === null ? null : (model.byId.get(id) ?? null));
  };
  const filter = (ids: string[]) => {
    if (locked) return;
    if (visibleCommunityIds === undefined)
      setHidden(
        new Set(
          model.groups.filter((g) => !ids.includes(g.id)).map((g) => g.id),
        ),
      );
    onVisibleCommunitiesChange?.(ids);
  };
  useEffect(() => {
    const element = canvas.canvasRef.current;
    if (!element || locked) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      canvas.zoomBy(
        Math.exp(-Math.max(-100, Math.min(100, event.deltaY)) * 0.008),
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [canvas.canvasRef, canvas.zoomBy, locked]);
  const keyboard = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (locked || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = visibleNodes.findIndex(
      (n) => n.id === (activeFocus ?? selected),
    );
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      event.preventDefault();
      const step =
        event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
      const nextIndex =
        index < 0
          ? step > 0
            ? 0
            : visibleNodes.length - 1
          : (index + step + visibleNodes.length) % visibleNodes.length;
      const node = visibleNodes[nextIndex];
      if (node) {
        setFocused(node.id);
        canvas.focusNode(node);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeFocus !== null) select(activeFocus);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setFocused(null);
      select(null);
    } else if (event.key === "Home") {
      event.preventDefault();
      canvas.fit();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      canvas.zoomBy(1.25);
    } else if (event.key === "-") {
      event.preventDefault();
      canvas.zoomBy(0.8);
    }
  };
  const focusedNode = model.byId.get(activeFocus ?? selected ?? "");
  const matchingNodes = useMemo(() => {
    const search = query.toLocaleLowerCase();
    return visibleNodes
      .filter((n) => (n.label ?? n.id).toLocaleLowerCase().includes(search))
      .slice(0, 50)
      .map((n) => ({ value: n.id, label: n.label ?? n.id }));
  }, [visibleNodes, query]);
  const graphHeight = Number.isFinite(height) ? Math.max(160, height) : 480;
  const gridEnabled = grid !== false;
  const gridOverrides = typeof grid === "object" ? grid : undefined;
  const resolvedLegendTone = legendTone === "auto" ? surfaceTone : legendTone;
  const legendContent = (
    <fieldset
      disabled={locked}
      className="flex min-w-0 shrink-0 flex-col gap-3 overflow-auto"
      style={{
        maxHeight: legendPanel ? Math.max(96, graphHeight - 64) : graphHeight,
      }}
    >
      <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
        {t("kit.networkGraph.communities")}
      </legend>
      <Checkbox
        size="sm"
        tone={getSurfaceAccentColor(resolvedLegendTone)}
        label={t("kit.networkGraph.selectAll")}
        checked={model.groups.every((g) => enabled.has(g.id))}
        indeterminate={
          model.groups.some((g) => enabled.has(g.id)) &&
          !model.groups.every((g) => enabled.has(g.id))
        }
        onChange={(event) =>
          filter(event.target.checked ? model.groups.map((g) => g.id) : [])
        }
      />
      {model.groups.map((group) => (
        <div key={group.id} className="flex items-center justify-between gap-2">
          <Checkbox
            size="sm"
            tone={group.tone ?? getSurfaceAccentColor(resolvedLegendTone)}
            label={group.label}
            checked={enabled.has(group.id)}
            onChange={(event) =>
              filter(
                event.target.checked
                  ? [...enabled, group.id]
                  : [...enabled].filter((id) => id !== group.id),
              )
            }
          />
          <span className="text-xs tabular-nums opacity-60">
            {counts.get(group.id) ?? 0}
          </span>
        </div>
      ))}
    </fieldset>
  );
  const resolvedInspectorVariant =
    inspectorVariant === "auto" ? variant : inspectorVariant;
  const resolvedInspectorTone =
    inspectorTone === "auto" ? surfaceTone : inspectorTone;
  const inspectorAccent = getSurfaceAccentColor(resolvedInspectorTone);
  const centerOnSelected = () => {
    if (!selectedNode) return;
    const positioned = model.byId.get(selectedNode.id);
    if (positioned) canvas.focusNode(positioned);
  };
  const closeInspector = () => {
    select(null);
    setFocused(null);
  };
  const inspectorContent =
    selectedNode && selectionInfo ? (
      <>
        <div className="cj-network-graph__body">
        <div className="cj-network-graph__eyebrow">
          {inspectorTitle ?? t("kit.networkGraph.inspector")}
        </div>
        <h3>{selectionInfo.label}</h3>
        {selectionInfo.community && (
          <span
            className="cj-network-graph__chip"
            style={
              {
                "--chip-color": `var(--color-${
                  selectionInfo.community.tone ??
                  selectedNode.tone ??
                  inspectorAccent
                }-500)`,
              } as React.CSSProperties
            }
          >
            <i />
            {selectionInfo.community.label}
          </span>
        )}
        <dl className="cj-network-graph__meta">
          <dt>{t("kit.networkGraph.nodeId")}</dt>
          <dd>
            <code>{selectedNode.id}</code>
          </dd>
          <dt>{t("kit.networkGraph.connections")}</dt>
          <dd>{selectionInfo.connectionCount}</dd>
        </dl>
        {renderInspectorBody ? (
          renderInspectorBody(selectedNode, selectionInfo)
        ) : (
          selectionInfo.neighbors.length > 0 && (
            <div className="cj-network-graph__neighbors">
              <small>{t("kit.networkGraph.neighbors")}</small>
              <ScrollArea
                variant="auto"
                horizontal={false}
                className="cj-network-graph__neighbor-scroll"
                aria-label={t("kit.networkGraph.neighbors")}
              >
                <div className="cj-network-graph__neighbor-rows">
                {selectionInfo.neighbors.map((neighbor) => (
                  <button
                    key={neighbor.id}
                    type="button"
                    className="cj-network-graph__neighbor"
                    style={
                      {
                        "--node-color": `var(--color-${
                          neighbor.tone ??
                          selectionInfo.community?.tone ??
                          inspectorAccent
                        }-500)`,
                      } as React.CSSProperties
                    }
                    onClick={() => {
                      select(neighbor.id);
                      setFocused(neighbor.id);
                      const positioned = model.byId.get(neighbor.id);
                      if (positioned) canvas.focusNode(positioned);
                    }}
                  >
                    <i />
                    <span>{neighbor.label ?? neighbor.id}</span>
                  </button>
                ))}
                </div>
              </ScrollArea>
            </div>
          )
        )}
        </div>
        <div className="cj-network-graph__actions">
          {renderInspectorActions ? (
            renderInspectorActions(selectedNode, selectionInfo, {
              centerOnNode: centerOnSelected,
              close: closeInspector,
            })
          ) : (
            <>
              <Button
                size="sm"
                fullWidth
                variant={inspectorButtonVariant}
                color={inspectorButtonTone}
                weight={inspectorButtonWeight}
                onClick={centerOnSelected}
              >
                {t("kit.networkGraph.centerOnNode")}
              </Button>
              <Button
                size="sm"
                fullWidth
                variant={inspectorButtonVariant}
                color={inspectorButtonTone}
                weight={inspectorButtonWeight}
                onClick={closeInspector}
              >
                {t("kit.networkGraph.close")}
              </Button>
            </>
          )}
        </div>
      </>
    ) : null;
  return (
    <div
      ref={rootRef}
      className={[
        inspector && "cj-network-graph",
        inspector &&
          selectedNode &&
          "cj-network-graph--inspector-open",
        inspector &&
          inspectorStacked &&
          "cj-network-graph--stacked",
        fullHeight && "cj-network-graph--full-height",
        fullWidth
          ? "cj-network-graph--full-width"
          : "cj-network-graph--intrinsic-width",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        inspector
          ? ({
              "--cj-network-graph-inspector-width": `${resolvedInspectorWidth}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="cj-network-graph__main">
    <Panel
      {...panelProps}
      className={[panelProps.className, "cj-network-graph__graph-panel"]
        .filter(Boolean)
        .join(" ")}
      flexBody={fullHeight || undefined}
      tone={surfaceTone}
      variant={variant}
      padding="sm"
      disabled={disabled}
      clickable={false}
      scrollable={false}
    >
      <div
        className="cj-network-graph__group flex min-w-0 flex-col gap-3"
        role="group"
        aria-label={ariaLabel ?? t("kit.networkGraph.name")}
        aria-disabled={locked || undefined}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <>
            <p role="status" className="sr-only">
              {t("kit.networkGraph.loading")}
            </p>
            <GraphSkeleton
              graphHeight={graphHeight}
              fullHeight={fullHeight}
              legendOnRight={legendOnRight}
              showLegend={showCommunities && model.groups.length > 0}
              legendPanel={legendPanel}
              showControls={showControls}
              groupCount={model.groups.length}
            />
          </>
        ) : (
          <>
        {showControls && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-40 flex-1">
              <Combobox
                size="sm"
                tone={tone}
                value={query}
                onChange={setQuery}
                disabled={locked}
                options={matchingNodes}
                aria-label={t("kit.networkGraph.findNode")}
                placeholder={t("kit.networkGraph.findNode")}
                onSelect={(option) => {
                  const node = model.byId.get(option.value);
                  if (node) {
                    select(node.id);
                    setFocused(node.id);
                    setQuery(node.label ?? node.id);
                    canvas.focusNode(node);
                  }
                }}
              />
            </div>
          </div>
        )}
        <div
          ref={layoutRef}
          className="cj-network-graph__layout flex min-w-0 gap-4"
          style={{ flexDirection: legendOnRight ? "row" : "column" }}
          data-legend-position={legendOnRight ? "right" : "bottom"}
        >
          <div
            className="cj-network-graph__graph-box relative min-w-0 flex-1"
            style={
              {
                ...(fullHeight
                  ? {}
                  : { height: graphHeight, minHeight: graphHeight }),
                ...(gridEnabled
                  ? {
                      "--cj-network-graph-grid-color": `var(--color-${gridTone}-500)`,
                    }
                  : {}),
              } as React.CSSProperties
            }
          >
            {gridEnabled && (
              <GridBackground
                className="cj-network-graph__grid"
                pattern="dots"
                size={32}
                lineColor="var(--cj-network-graph-grid-color, var(--color-blue-500, #3b82f6))"
                dotSize={1.5}
                opacity={0.35}
                fade="radial"
                {...gridOverrides}
              />
            )}
            <canvas
              ref={canvas.canvasRef}
              className={`relative block h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-${tone}-500 ${locked ? "" : panning ? "cursor-grabbing" : "cursor-default"}`}
              style={{ touchAction: locked ? "auto" : "none" }}
              tabIndex={locked ? -1 : 0}
              // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role -- A custom Canvas widget uses application to scope its documented keyboard navigation.
              role="application"
              aria-roledescription={t("kit.networkGraph.name")}
              aria-label={ariaLabel ?? t("kit.networkGraph.name")}
              aria-describedby={helpId}
              data-hovered={
                hoverHighlight && !locked ? (hovered ?? undefined) : undefined
              }
              onKeyDown={keyboard}
              onPointerDown={(event) => {
                if (locked || event.button !== 0 || drag.current) return;
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = {
                  id: event.pointerId,
                  x: event.clientX,
                  y: event.clientY,
                  originX: event.clientX,
                  originY: event.clientY,
                  moved: false,
                };
              }}
              onPointerMove={(event) => {
                const current = drag.current;
                if (!current) {
                  // Passive hover highlight — a preview, never a selection.
                  // Same strict hit test as click-select; setState bails out
                  // when the id is unchanged, so mouse moves stay cheap.
                  if (!hoverHighlight || locked) return;
                  const rect = event.currentTarget.getBoundingClientRect(),
                    view = canvas.view.current;
                  const node = pickNode(
                    model,
                    visible,
                    (event.clientX - rect.left - view.x) / view.zoom,
                    (event.clientY - rect.top - view.y) / view.zoom,
                    view.zoom,
                  );
                  setHovered(node?.id ?? null);
                  return;
                }
                if (locked || current.id !== event.pointerId) return;
                const dx = event.clientX - current.x,
                  dy = event.clientY - current.y;
                current.moved ||=
                  Math.hypot(
                    event.clientX - current.originX,
                    event.clientY - current.originY,
                  ) > 4;
                if (current.moved) {
                  setPanning(true);
                  setHovered(null);
                  canvas.update({
                    ...canvas.view.current,
                    x: canvas.view.current.x + dx,
                    y: canvas.view.current.y + dy,
                  });
                }
                current.x = event.clientX;
                current.y = event.clientY;
              }}
              onPointerLeave={() => setHovered(null)}
              onPointerUp={(event) => {
                const current = drag.current;
                if (!current || current.id !== event.pointerId) return;
                drag.current = null;
                setPanning(false);
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
                if (locked || current.moved) return;
                const rect = event.currentTarget.getBoundingClientRect(),
                  view = canvas.view.current;
                const node = pickNode(
                  model,
                  visible,
                  (event.clientX - rect.left - view.x) / view.zoom,
                  (event.clientY - rect.top - view.y) / view.zoom,
                  view.zoom,
                );
                setFocused(node?.id ?? null);
                select(node?.id ?? null);
              }}
              onPointerCancel={() => {
                drag.current = null;
                setPanning(false);
              }}
              onLostPointerCapture={() => {
                drag.current = null;
                setPanning(false);
              }}
            />
            {showControls && (
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
                <IconButton
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
                      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
                      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
                      <path d="M9 20H5a1 1 0 0 1-1-1v-4" />
                    </svg>
                  }
                  size="xs"
                  variant="ghost"
                  color="slate"
                  disabled={locked}
                  srLabel={t("kit.networkGraph.fit")}
                  tooltip={t("kit.networkGraph.fit")}
                  onClick={canvas.fit}
                />
                <IconButton
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M6 12h12" />
                    </svg>
                  }
                  size="xs"
                  variant="ghost"
                  color="slate"
                  disabled={locked || canvas.zoom <= 0.05}
                  srLabel={t("kit.networkGraph.zoomOut")}
                  tooltip={t("kit.networkGraph.zoomOut")}
                  onClick={() => canvas.zoomBy(0.8)}
                />
                <span
                  className="min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
                  aria-label={t("kit.networkGraph.zoom")}
                >
                  {Math.round(canvas.zoom * 100)}%
                </span>
                <IconButton
                  icon="Add"
                  size="xs"
                  variant="ghost"
                  color="slate"
                  disabled={locked || canvas.zoom >= 8}
                  srLabel={t("kit.networkGraph.zoomIn")}
                  tooltip={t("kit.networkGraph.zoomIn")}
                  onClick={() => canvas.zoomBy(1.25)}
                />
                <IconButton
                  icon="Reset"
                  size="xs"
                  variant="ghost"
                  color="slate"
                  disabled={locked}
                  srLabel={t("kit.networkGraph.reset")}
                  tooltip={t("kit.networkGraph.reset")}
                  onClick={() => {
                    select(null);
                    setFocused(null);
                    canvas.fit();
                  }}
                />
              </div>
            )}
            {!visibleNodes.length && (
              <div className="cj-network-graph__empty pointer-events-none absolute inset-0 grid place-items-center p-4">
                {emptyMessage ?? (
                  <EmptyState
                    variant="plain"
                    dashed={false}
                    color={gridTone}
                    icon="NetworkNodes"
                    title={t("kit.networkGraph.empty")}
                    subtitle={t("kit.networkGraph.emptySubtitle")}
                    actions={
                      model.nodes.length > 0 ? (
                        <span className="pointer-events-auto">
                          <Button
                            size="sm"
                            variant="soft"
                            color={gridTone}
                            onClick={() =>
                              filter(model.groups.map((g) => g.id))
                            }
                          >
                            {t("kit.networkGraph.selectAll")}
                          </Button>
                        </span>
                      ) : undefined
                    }
                  />
                )}
              </div>
            )}
          </div>
          {showCommunities && model.groups.length > 0 && visibleNodes.length > 0 && (
            <div
              className="min-w-0 shrink-0"
              style={{
                width: legendOnRight ? (legendPanel ? 224 : 192) : "100%",
              }}
            >
              {legendPanel ? (
                <Panel
                  variant={legendVariant === "auto" ? variant : legendVariant}
                  tone={resolvedLegendTone}
                  padding="xs"
                  corner={panelProps.corner}
                  glassOpacity={panelProps.glassOpacity}
                  vibrancy={panelProps.vibrancy}
                  specularMode={panelProps.specularMode}
                  scrollable={false}
                >
                  {legendContent}
                </Panel>
              ) : (
                legendContent
              )}
            </div>
          )}
        </div>
        <p id={helpId} className="text-xs opacity-70">
          {t("kit.networkGraph.instructions")}
        </p>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs"
        >
          {focusedNode
            ? t("kit.networkGraph.nodeStatus", {
                label: focusedNode.label ?? focusedNode.id,
                count: model.adjacency.get(focusedNode.id)?.size ?? 0,
              })
            : t("kit.networkGraph.summary", {
                nodes: visibleNodes.length,
                edges: model.edges.filter(
                  (e: NetworkGraphEdge) =>
                    visible.has(e.source) && visible.has(e.target),
                ).length,
              })}
        </p>
          </>
        )}
      </div>
    </Panel>
      </div>
      {inspector && (
        <aside
          className="cj-network-graph__inspector"
          aria-hidden={!selectedNode || undefined}
          inert={!selectedNode || undefined}
        >
          <div className="cj-network-graph__inspector-inner">
            <Panel
              variant={resolvedInspectorVariant}
              tone={resolvedInspectorTone}
              padding="sm"
              corner={panelProps.corner}
              glassOpacity={panelProps.glassOpacity}
              vibrancy={panelProps.vibrancy}
              specularMode={panelProps.specularMode}
              clickable={false}
              scrollable={false}
              flexBody
              className="cj-network-graph__details"
            >
              {inspectorContent}
            </Panel>
          </div>
        </aside>
      )}
    </div>
  );
}

/**
 * Loading placeholder shaped like the settled component — search bar, canvas
 * surface with the zoom pill, community legend column and the two caption
 * lines — so the skeleton previews what is about to render instead of three
 * generic bars.
 */
function GraphSkeleton({
  graphHeight,
  fullHeight,
  legendOnRight,
  showLegend,
  legendPanel,
  showControls,
  groupCount,
}: {
  graphHeight: number;
  fullHeight: boolean;
  legendOnRight: boolean;
  showLegend: boolean;
  legendPanel: boolean;
  showControls: boolean;
  groupCount: number;
}) {
  return (
    <div
      className="cj-network-graph__skeleton flex min-w-0 flex-col gap-3"
      aria-hidden="true"
    >
      {showControls && (
        <SkeletonBar height="h-9" width="100%" className="rounded-lg" />
      )}
      <div
        className="cj-network-graph__layout flex min-w-0 gap-4"
        style={{ flexDirection: legendOnRight ? "row" : "column" }}
      >
        <div
          className="cj-network-graph__graph-box relative min-w-0 flex-1"
          style={
            fullHeight
              ? undefined
              : { height: graphHeight, minHeight: graphHeight }
          }
        >
          <div className="block h-full w-full rounded-md bg-black/10 dark:bg-white/10" />
          {showControls && (
            <div className="cj-network-graph__skeleton-controls absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/90 p-1 dark:border-neutral-700 dark:bg-neutral-900/90">
              <SkeletonBar height="h-3" width="12px" />
              <SkeletonBar height="h-3" width="8px" />
              <SkeletonBar height="h-3" width="20px" />
              <SkeletonBar height="h-3" width="8px" />
              <SkeletonBar height="h-3" width="12px" />
            </div>
          )}
        </div>
        {showLegend && (
          <div
            className="cj-network-graph__skeleton-legend min-w-0 shrink-0"
            style={{ width: legendOnRight ? (legendPanel ? 224 : 192) : "100%" }}
          >
            <SkeletonBar height="h-3" width="7rem" className="mb-3" />
            {Array.from({ length: Math.min(groupCount + 1, 7) }, (_, row) => (
              <div
                key={row}
                className="cj-network-graph__skeleton-legend-row mb-2 flex items-center gap-2"
              >
                <span className="block h-3.5 w-3.5 rounded-[3px] bg-black/10 dark:bg-white/10" />
                <SkeletonBar height="h-3" className="flex-1" />
                <SkeletonBar height="h-3" width="16px" />
              </div>
            ))}
          </div>
        )}
      </div>
      <SkeletonBar height="h-3" width="72%" />
      <SkeletonBar height="h-3" width="28%" />
    </div>
  );
}
export default NetworkGraph;

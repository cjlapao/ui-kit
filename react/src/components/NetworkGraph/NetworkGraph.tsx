import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Panel from "../Panel";
import IconButton from "../IconButton";
import Checkbox from "../Checkbox";
import Combobox from "../Combobox";
import { useKitT } from "../../i18n";
import { buildNetwork, pickNode } from "./model";
import { useNetworkCanvas } from "./useNetworkCanvas";
import type {
  NetworkGraphCommunity,
  NetworkGraphEdge,
  NetworkGraphProps,
} from "./types";

const NO_COMMUNITIES: readonly NetworkGraphCommunity[] = [];
const NO_HIGHLIGHTS: readonly string[] = [];

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
  showLabels = false,
  showControls = true,
  ariaLabel,
  emptyMessage,
  onViewportChange,
  tone = "blue",
  variant = "elevated",
  disabled = false,
  loading = false,
  ...panelProps
}: NetworkGraphProps) {
  const t = useKitT();
  const helpId = useId();
  const layoutRef = useRef<HTMLDivElement>(null);
  const [hasLegendSpace, setHasLegendSpace] = useState(true);
  const legendOnRight =
    legendPosition === "right" || (legendPosition === "auto" && hasLegendSpace);
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
  const canvas = useNetworkCanvas({
    active: !loading,
    model,
    nodes: visibleNodes,
    visible,
    selected,
    focused: activeFocus,
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
  const resolvedLegendTone = legendTone === "auto" ? tone : legendTone;
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
        tone={resolvedLegendTone}
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
            tone={group.tone ?? resolvedLegendTone}
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
  return (
    <Panel
      {...panelProps}
      tone={tone}
      variant={variant}
      padding="sm"
      disabled={disabled}
      loading={loading}
      clickable={false}
      scrollable={false}
    >
      <div
        className="flex min-w-0 flex-col gap-3"
        role="group"
        aria-label={ariaLabel ?? t("kit.networkGraph.name")}
        aria-disabled={locked || undefined}
      >
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
          className="flex min-w-0 gap-4"
          style={{ flexDirection: legendOnRight ? "row" : "column" }}
          data-legend-position={legendOnRight ? "right" : "bottom"}
        >
          <div
            className="relative min-w-0 flex-1"
            style={{ height: graphHeight, minHeight: graphHeight }}
          >
            <canvas
              ref={canvas.canvasRef}
              className={`block h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-${tone}-500 ${locked ? "" : "cursor-grab active:cursor-grabbing"}`}
              style={{ touchAction: locked ? "auto" : "none" }}
              tabIndex={locked ? -1 : 0}
              // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role -- A custom Canvas widget uses application to scope its documented keyboard navigation.
              role="application"
              aria-roledescription={t("kit.networkGraph.name")}
              aria-label={ariaLabel ?? t("kit.networkGraph.name")}
              aria-describedby={helpId}
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
                if (locked || !current || current.id !== event.pointerId)
                  return;
                const dx = event.clientX - current.x,
                  dy = event.clientY - current.y;
                current.moved ||=
                  Math.hypot(
                    event.clientX - current.originX,
                    event.clientY - current.originY,
                  ) > 4;
                if (current.moved)
                  canvas.update({
                    ...canvas.view.current,
                    x: canvas.view.current.x + dx,
                    y: canvas.view.current.y + dy,
                  });
                current.x = event.clientX;
                current.y = event.clientY;
              }}
              onPointerUp={(event) => {
                const current = drag.current;
                if (!current || current.id !== event.pointerId) return;
                drag.current = null;
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
              }}
              onLostPointerCapture={() => {
                drag.current = null;
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
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
                {emptyMessage ?? t("kit.networkGraph.empty")}
              </div>
            )}
          </div>
          {showCommunities && model.groups.length > 0 && (
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
      </div>
    </Panel>
  );
}
export default NetworkGraph;

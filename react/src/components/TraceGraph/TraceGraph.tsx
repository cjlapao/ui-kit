import React, { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Panel from "../Panel";
import { useKitT } from "../../i18n";
import { layoutTraceGraph, TraceHitIndex, type TracePoint, type TraceScene } from "../../../../common/traceGraph/model";
import { fitTrace, screenPoint, traceNeedsFollow, worldPoint, zoomTraceAt, type TraceFollowMode, type TraceGraphViewport } from "../../../../common/traceGraph/camera";
import { TraceRenderer, type TracePaint } from "./renderer";
import type { TraceGraphHandle, TraceGraphProps } from "./types";

const EMPTY: readonly string[] = [];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const neutralView: TraceGraphViewport = { x: 0, y: 0, zoom: 1 };

export const TraceGraph = forwardRef<TraceGraphHandle, TraceGraphProps>(function TraceGraph({
  nodes, edges, layout = "dependency", height = 480, activeNodeIds, activeEdgeIds,
  selectedNodeId, defaultSelectedNodeId = null, onNodeSelect, onEdgeSelect,
  renderNodeTooltip, renderNodePopover, followMode, defaultFollowMode = "off", onFollowModeChange,
  onViewportChange, onDiagnostics, onRendererChange, renderer = "auto", minZoom = .001, maxZoom = 8,
  animation = true, glow = "all", showLabels = true, showControls = true, ariaLabel, emptyState, labels,
  sparkles = true, sparkleIntensity = 1, sparkleSpeed = 1, flareSize, pulseScale, junctionGlowIntensity = 1,
  tone = "blue", variant = "outlined", corner = "auto", padding = "none", loading = false, disabled = false, ...panelProps
}, ref) {
  const t = useKitT(), helpId = useId();
  const copy = (key: keyof NonNullable<TraceGraphProps["labels"]>) => labels?.[key] ?? t(`kit.traceGraph.${key}`);
  const hostRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), textRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const focusDetails = useRef(false);
  const rendererRef = useRef<TraceRenderer | null>(null), frameRef = useRef<number | null>(null);
  const current = useRef({ ...neutralView }), target = useRef({ ...neutralView });
  const cameraFrom = useRef({ ...neutralView }), cameraStart = useRef(-Infinity), sceneStart = useRef(-Infinity);
  const previousScene = useRef<TraceScene | undefined>(undefined), previousMode = useRef(layout);
  const scene = useMemo(() => layoutTraceGraph(nodes, edges, layout, previousMode.current === layout ? previousScene.current : undefined), [nodes, edges, layout]);
  const hitIndex = useMemo(() => new TraceHitIndex(scene), [scene]);
  const [size, setSize] = useState({ width: 1, height });
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelectedNodeId);
  const selection = selectedNodeId === undefined ? internalSelected : selectedNodeId;
  const selected = selection ? scene.byId.get(selection) : undefined;
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null), [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState(""), [detailsOpen, setDetailsOpen] = useState(false);
  const [internalFollow, setInternalFollow] = useState<TraceFollowMode>(defaultFollowMode);
  const follow = followMode ?? internalFollow;
  const [backend, setBackend] = useState<"webgl2" | "canvas2d">("canvas2d");
  const [viewLabel, setViewLabel] = useState(100);
  const [reduced, setReduced] = useState(false);
  const onScreen = useRef(true), pageVisible = useRef(true), ready = useRef(false);
  const lastPublish = useRef(0), latest = useRef({ size, scene, animation, reduced });
  const tickRef = useRef<(time: number) => void>(() => {});
  const schedule = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(time => { frameRef.current = null; tickRef.current(time); });
  }, []);
  const activeNodes = useMemo(() => new Set(activeNodeIds ?? scene.nodes.filter(node => node.status === "running").map(node => node.id)), [activeNodeIds, scene]);
  const activeEdges = useMemo(() => new Set(activeEdgeIds ?? scene.edges.filter(edge => edge.status === "running").map(edge => edge.id)), [activeEdgeIds, scene]);
  const requestFollow = useCallback((mode: TraceFollowMode) => {
    if (followMode === undefined) setInternalFollow(mode);
    onFollowModeChange?.(mode);
  }, [followMode, onFollowModeChange]);
  const pause = useCallback(() => {
    if (follow === "following") requestFollow("paused");
    target.current = { ...current.current }; cameraStart.current = -Infinity;
  }, [follow, requestFollow]);
  const move = useCallback((view: TraceGraphViewport, manual: boolean, animate = true) => {
    if (manual) pause();
    cameraFrom.current = { ...current.current }; target.current = view;
    cameraStart.current = animate && animation && !reduced ? performance.now() : -Infinity;
    if (!Number.isFinite(cameraStart.current)) current.current = { ...view };
    schedule();
  }, [pause, animation, reduced, schedule]);
  const fit = useCallback((animate = true) => {
    const points = [...scene.nodes, ...scene.edges.flatMap(edge => edge.points)];
    move(fitTrace(points, size.width, size.height, minZoom, Math.min(2, maxZoom)), true, animate);
  }, [scene, size, minZoom, maxZoom, move]);
  const zoomAt = useCallback((factor: number, point: TracePoint, animate = false) => {
    move(zoomTraceAt(current.current, point, clamp(current.current.zoom * factor, minZoom, maxZoom)), true, animate);
  }, [move, minZoom, maxZoom]);
  const followFrontier = useCallback((force = false) => {
    const active = [...activeNodes].map(id => scene.byId.get(id)).filter((node): node is NonNullable<typeof node> => !!node);
    if (!active.length || size.width <= 1) return;
    if (!force && !traceNeedsFollow(active, target.current, size.width, size.height)) return;
    const context = new Set(active.map(node => node.id));
    for (const node of active) for (const id of scene.neighbors.get(node.id) ?? EMPTY) context.add(id);
    const points = [...context].map(id => scene.byId.get(id)!).filter(Boolean);
    move(fitTrace(points, size.width, size.height, minZoom, Math.min(2, maxZoom), 72), false);
  }, [activeNodes, scene, size, minZoom, maxZoom, move]);
  const resume = useCallback(() => { requestFollow("following"); followFrontier(true); }, [requestFollow, followFrontier]);
  useImperativeHandle(ref, () => ({ fit, pauseFollowing: () => { pause(); if (follow !== "following") requestFollow("paused"); }, resumeFollowing: resume,
    getViewport: () => ({ ...current.current }),
    zoomTo: (zoom, animate = true) => move(zoomTraceAt(current.current, { x: size.width / 2, y: size.height / 2 }, clamp(zoom, minZoom, maxZoom)), true, animate),
    focusNodes: (ids, animate = true) => {
      const points = ids.map(id => scene.byId.get(id)).filter((node): node is NonNullable<typeof node> => !!node);
      if (points.length) move(fitTrace(points, size.width, size.height, minZoom, Math.min(2, maxZoom)), true, animate);
    },
  }), [fit, pause, follow, requestFollow, resume, size, minZoom, maxZoom, move, scene]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches); update();
    media.addEventListener("change", update); return () => media.removeEventListener("change", update);
  }, []);
  const [textColor, setTextColor] = useState("#737373");
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => { setTextColor(getComputedStyle(host).color); schedule(); };
    update();
    const observer = new MutationObserver(update);
    let parent: HTMLElement | null = host;
    while (parent) { observer.observe(parent, { attributes: true, attributeFilter: ["class", "style", "data-color-scheme"] }); parent = parent.parentElement; }
    return () => observer.disconnect();
  }, [schedule]);
  const paint: TracePaint = useMemo(() => ({ tone: tone === "none" ? "blue" : tone, text: textColor, selected: selection ?? null, selectedEdge, focused,
    activeNodes, activeEdges, glow: typeof glow === "boolean" ? glow ? "all" : "none" : glow, labels: showLabels,
    sparkles: sparkles && animation && !reduced,
    sparkleIntensity: Number.isFinite(sparkleIntensity) ? clamp(sparkleIntensity, 0, 3) : 1,
    sparkleSpeed: Number.isFinite(sparkleSpeed) ? clamp(sparkleSpeed, 0, 4) : 1,
    pulseScale: Number.isFinite(pulseScale) ? clamp(pulseScale!, 0, 6) : Number.isFinite(flareSize) ? clamp(flareSize! / 4, 0, 6) : 2.5,
    junctionGlowIntensity: Number.isFinite(junctionGlowIntensity) ? clamp(junctionGlowIntensity, 0, 3) : 1,
  }), [tone, textColor, selection, selectedEdge, focused, activeNodes, activeEdges, glow, showLabels, sparkles, animation, reduced, sparkleIntensity, sparkleSpeed, flareSize, pulseScale, junctionGlowIntensity]);
  const latestPaint = useRef(paint);
  useLayoutEffect(() => { latestPaint.current = paint; });
  useLayoutEffect(() => { latest.current = { size, scene, animation, reduced }; });
  useLayoutEffect(() => {
    const canvas = canvasRef.current, text = textRef.current, host = hostRef.current;
    if (!canvas || !text || !host) return;
    const setup = (fallback = false) => {
      rendererRef.current?.dispose();
      rendererRef.current = new TraceRenderer(canvas, text, renderer === "canvas" || fallback);
      const backend = rendererRef.current.backend; setBackend(backend); onRendererChange?.(backend);
      rendererRef.current.setScene(latest.current.scene, latestPaint.current); schedule();
    };
    setup();
    const lost = (event: Event) => { event.preventDefault(); setup(true); };
    const restored = () => setup();
    canvas.addEventListener("webglcontextlost", lost); canvas.addEventListener("webglcontextrestored", restored);
    const resize = () => { const box = host.getBoundingClientRect(); setSize({ width: Math.max(1, box.width), height: Math.max(1, box.height) }); schedule(); };
    resize(); const observer = new ResizeObserver(resize); observer.observe(host);
    return () => {
      observer.disconnect(); canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      rendererRef.current?.dispose(); rendererRef.current = null;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null;
    };
    // Scene/paint updates use the effect below; creating a context is lifecycle-only.
  }, [renderer]);
  useLayoutEffect(() => {
    rendererRef.current?.setScene(scene, paint, previousScene.current);
    if (previousScene.current !== scene) sceneStart.current = performance.now();
    previousScene.current = scene; previousMode.current = layout; schedule();
  }, [scene, paint, layout, schedule]);
  useEffect(() => { onDiagnostics?.(scene.diagnostics); }, [scene, onDiagnostics]);
  useEffect(() => {
    if (size.width <= 1 || !scene.nodes.length) return;
    if (!ready.current) {
      ready.current = true;
      move(fitTrace([...scene.nodes, ...scene.edges.flatMap(edge => edge.points)], size.width, size.height, minZoom, Math.min(2, maxZoom)), false, false);
      if (follow === "following") followFrontier(true);
    } else if (follow === "following") followFrontier();
  }, [scene, size, follow, followFrontier, move, minZoom, maxZoom]);
  useEffect(() => {
    const visible = () => { pageVisible.current = !document.hidden; if (pageVisible.current) schedule(); };
    document.addEventListener("visibilitychange", visible);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => { onScreen.current = entries[0]?.isIntersecting ?? true; if (onScreen.current) schedule(); });
    if (hostRef.current) observer?.observe(hostRef.current);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", visible); };
  }, [schedule]);
  const overlayNode = detailsOpen && selected ? selected : hovered ? scene.byId.get(hovered) : undefined;
  const showPopover = !!(detailsOpen && selected && renderNodePopover);
  const overlayContent = overlayNode ? showPopover ? renderNodePopover?.(overlayNode) : renderNodeTooltip?.(overlayNode) : null;
  const overlayNodeRef = useRef(overlayNode);
  useLayoutEffect(() => { overlayNodeRef.current = overlayNode; schedule(); }, [overlayNode, schedule]);
  useLayoutEffect(() => {
    tickRef.current = time => {
      if (!onScreen.current || !pageVisible.current) return;
      const moving = animation && !reduced;
      const elapsed = Math.min(1, (time - cameraStart.current) / 450);
      const ease = 1 - (1 - elapsed) ** 3;
      if (Number.isFinite(cameraStart.current)) current.current = {
        x: cameraFrom.current.x + (target.current.x - cameraFrom.current.x) * ease,
        y: cameraFrom.current.y + (target.current.y - cameraFrom.current.y) * ease,
        zoom: cameraFrom.current.zoom + (target.current.zoom - cameraFrom.current.zoom) * ease,
      };
      const mix = moving ? Math.min(1, (time - sceneStart.current) / 350) : 1;
      rendererRef.current?.draw(current.current, size.width, size.height, moving ? time / 1000 : 0, mix);
      const anchor = overlayNodeRef.current, overlay = overlayRef.current;
      if (anchor && overlay && hostRef.current) {
        const p = rendererRef.current?.projected(anchor, current.current, mix) ?? screenPoint(anchor, current.current), bounds = hostRef.current.getBoundingClientRect();
        const offscreen = p.x < 0 || p.x > size.width || p.y < 0 || p.y > size.height;
        overlay.style.visibility = offscreen ? "hidden" : "visible";
        overlay.style.left = `${clamp(bounds.left + p.x + 14, 8, Math.max(8, window.innerWidth - overlay.offsetWidth - 8))}px`;
        overlay.style.top = `${clamp(bounds.top + p.y + 14, 8, Math.max(8, window.innerHeight - overlay.offsetHeight - 8))}px`;
        if (!offscreen && focusDetails.current) {
          overlay.querySelector<HTMLButtonElement>("button")?.focus(); focusDetails.current = false;
        }
      }
      if (time - lastPublish.current > 100) { lastPublish.current = time; setViewLabel(Math.round(current.current.zoom * 10000) / 100); onViewportChange?.({ ...current.current }); }
      if ((moving && (elapsed < 1 || mix < 1 || activeNodes.size > 0 || activeEdges.size > 0)) && !loading) schedule();
    };
    schedule();
  });
  useEffect(() => {
    if (!detailsOpen) return;
    const outside = (event: PointerEvent) => {
      if (!overlayRef.current?.contains(event.target as Node) && !hostRef.current?.contains(event.target as Node)) setDetailsOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setDetailsOpen(false); hostRef.current?.focus(); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [detailsOpen]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const wheel = (event: WheelEvent) => {
      if (disabled || loading) return;
      event.preventDefault();
      const box = host.getBoundingClientRect();
      zoomAt(Math.exp(-event.deltaY * (event.deltaMode === 1 ? .03 : .002)), { x: event.clientX - box.left, y: event.clientY - box.top });
    };
    host.addEventListener("wheel", wheel, { passive: false });
    return () => host.removeEventListener("wheel", wheel);
  }, [zoomAt, disabled, loading]);
  const pointer = useRef<{ id: number; x: number; y: number; startX: number; startY: number; moved: boolean } | null>(null);
  const fingers = useRef(new Map<number, TracePoint>());
  const choose = (nodeId: string | null, focusPopup = false) => {
    focusDetails.current = !!nodeId && focusPopup;
    if (selectedNodeId === undefined) setInternalSelected(nodeId);
    setSelectedEdge(null); setDetailsOpen(!!nodeId && !!renderNodePopover); onNodeSelect?.(nodeId ? scene.byId.get(nodeId)! : null); schedule();
  };
  const localPoint = (event: React.PointerEvent) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
  const results = query ? scene.nodes.filter(node => `${node.label ?? ""} ${node.id}`.toLowerCase().includes(query.toLowerCase())).slice(0, 20) : [];
  const buttonClass = "rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-white/10";
  const overlay = overlayContent != null && overlayNode && typeof document !== "undefined" ? createPortal(
    <div ref={overlayRef} style={{ position: "fixed", zIndex: 100, width: 300, maxWidth: "calc(100vw - 16px)", visibility: "hidden" }}
      role={showPopover ? "dialog" : "tooltip"} aria-label={overlayNode.label ?? overlayNode.id}>
      <Panel variant="elevated" tone={tone === "none" ? "neutral" : tone} corner={corner} padding="xs" scrollable={false}>
        {showPopover && <button type="button" className={`${buttonClass} float-right ml-2`} aria-label={copy("close")} onClick={() => { setDetailsOpen(false); hostRef.current?.focus(); }}>×</button>}
        <div className="max-h-72 overflow-auto text-sm">{overlayContent}</div>
      </Panel>
    </div>, document.body) : null;

  return <Panel {...panelProps} variant={variant} tone={tone === "none" ? "neutral" : tone}
    backgroundColor={tone === "none" ? "neutral" : panelProps.backgroundColor}
    style={tone === "none" && variant === "simple" ? { borderWidth: 0, boxShadow: "none", ...panelProps.style } : panelProps.style}
    corner={corner} padding={padding} loading={loading} disabled={disabled} scrollable={false}>
    <div className="relative min-w-0">
      {showControls && <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 p-2 dark:border-neutral-800">
        <button type="button" className={buttonClass} disabled={disabled || loading} onClick={() => fit()}>{copy("fit")}</button>
        <button type="button" className={buttonClass} aria-label={copy("zoomOut")} disabled={disabled || loading} onClick={() => zoomAt(.8, { x: size.width / 2, y: size.height / 2 }, true)}>−</button>
        <span className="text-xs tabular-nums text-neutral-500">{viewLabel}%</span>
        <button type="button" className={buttonClass} aria-label={copy("zoomIn")} disabled={disabled || loading} onClick={() => zoomAt(1.25, { x: size.width / 2, y: size.height / 2 }, true)}>+</button>
        <button type="button" className={buttonClass} disabled={disabled || loading} aria-pressed={follow === "following"} onClick={() => follow === "following" ? pause() : resume()}>
          {follow === "following" ? copy("pause") : follow === "paused" ? copy("resume") : copy("follow")}
        </button>
        <div className="relative ml-auto">
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder={copy("search")} aria-label={copy("search")} disabled={disabled || loading}
            className="w-44 rounded-md border border-neutral-200 bg-transparent px-2 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-200" />
          {!!results.length && <ul className="absolute right-0 top-full z-20 mt-1 max-h-60 w-64 overflow-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            {results.map(node => <li key={node.id}><button type="button" className="w-full truncate rounded px-2 py-1 text-left text-xs hover:bg-neutral-100 dark:hover:bg-white/10"
              onClick={() => { choose(node.id); setFocused(node.id); setQuery(""); move(fitTrace([node], size.width, size.height, minZoom, Math.min(2, maxZoom)), true); }}>
              {node.label ?? node.id}
            </button></li>)}
          </ul>}
        </div>
      </div>}
      {/* This is a keyboard-operated spatial graph, not a collection of DOM nodes. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- application handles spatial keyboard/pointer navigation */}
      <div ref={hostRef} role="application" tabIndex={disabled ? -1 : 0} aria-label={ariaLabel ?? t("kit.traceGraph.name")} aria-describedby={helpId}
        data-trace-renderer={backend} data-follow-mode={follow}
        className="relative touch-none overflow-hidden text-neutral-600 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 dark:text-neutral-300"
        style={{ height, cursor: disabled ? "default" : hovered ? "pointer" : "grab" }}
        onPointerDown={event => {
          if (disabled || loading || event.button !== 0) return;
          const p = localPoint(event); fingers.current.set(event.pointerId, p);
          pointer.current = { id: event.pointerId, x: p.x, y: p.y, startX: p.x, startY: p.y, moved: false };
          event.currentTarget.setPointerCapture?.(event.pointerId); event.currentTarget.focus();
        }}
        onPointerMove={event => {
          if (disabled || loading) return;
          const p = localPoint(event), drag = pointer.current;
          if (fingers.current.has(event.pointerId) && fingers.current.size === 2) {
            const others = [...fingers.current].filter(([id]) => id !== event.pointerId);
            const old = fingers.current.get(event.pointerId)!, other = others[0][1];
            const before = Math.hypot(old.x - other.x, old.y - other.y), after = Math.hypot(p.x - other.x, p.y - other.y);
            if (before > 0) zoomAt(after / before, { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 });
            fingers.current.set(event.pointerId, p); if (drag) drag.moved = true; return;
          }
          if (drag && fingers.current.has(event.pointerId)) {
            const dx = p.x - drag.x, dy = p.y - drag.y;
            if (Math.hypot(p.x - drag.startX, p.y - drag.startY) > 3) drag.moved = true;
            if (drag.moved) { move({ ...current.current, x: current.current.x + dx, y: current.current.y + dy }, true, false); setHovered(null); }
            drag.x = p.x; drag.y = p.y; fingers.current.set(event.pointerId, p);
          } else setHovered(hitIndex.pick(worldPoint(p, current.current), 12 / current.current.zoom).node?.id ?? null);
        }}
        onPointerLeave={() => { if (!pointer.current) setHovered(null); }}
        onPointerCancel={() => { fingers.current.clear(); pointer.current = null; }}
        onPointerUp={event => {
          const drag = pointer.current, p = localPoint(event);
          fingers.current.delete(event.pointerId);
          if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (drag && !drag.moved && !disabled && !loading) {
            const hit = hitIndex.pick(worldPoint(p, current.current), 12 / current.current.zoom);
            if (hit.node) { choose(hit.node.id); setFocused(hit.node.id); }
            else if (hit.edge) { setSelectedEdge(hit.edge.id); setDetailsOpen(false); onEdgeSelect?.(hit.edge); }
            else { choose(null); onEdgeSelect?.(null); setFocused(null); }
          }
          pointer.current = null;
        }}
        onKeyDown={event => {
          if (disabled || loading || event.target !== event.currentTarget) return;
          const currentIndex = scene.nodes.findIndex(node => node.id === (focused ?? selection));
          if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const index = event.key === "Home" ? 0 : event.key === "End" ? scene.nodes.length - 1 : clamp(currentIndex + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1), 0, scene.nodes.length - 1);
            const node = scene.nodes[index]; if (!node) return;
            setFocused(node.id);
            if (traceNeedsFollow([node], current.current, size.width, size.height)) move(fitTrace([node], size.width, size.height, minZoom, Math.min(2, maxZoom)), true);
          } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (focused) choose(focused, true); }
          else if (event.key === "Escape") { setDetailsOpen(false); choose(null); setFocused(null); }
          else if (event.key === "+" || event.key === "=") zoomAt(1.25, { x: size.width / 2, y: size.height / 2 }, true);
          else if (event.key === "-") zoomAt(.8, { x: size.width / 2, y: size.height / 2 }, true);
        }}>
        <canvas ref={canvasRef} aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute inset-0 h-full w-full" />
        <canvas ref={textRef} aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute inset-0 h-full w-full" />
        {!scene.nodes.length && <div className="absolute inset-0 grid place-items-center text-sm">{emptyState ?? copy("empty")}</div>}
      </div>
      <p id={helpId} className="sr-only">{copy("help")}</p>
      <div role="status" className="sr-only" aria-live="polite">{focused ? scene.byId.get(focused)?.label ?? focused : selected?.label ?? `${scene.nodes.length} · ${scene.edges.length}`}</div>
      {selected && renderNodePopover && !detailsOpen && <button type="button" className={`${buttonClass} m-2`} onClick={() => setDetailsOpen(true)}>{copy("details")}</button>}
    </div>
    {overlay}
  </Panel>;
});

export default TraceGraph;

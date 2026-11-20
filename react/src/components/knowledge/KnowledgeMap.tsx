import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./knowledge.css";
import Checkbox from "../Checkbox";
import { GridBackground } from "../GridBackground";
import IconButton from "../IconButton";
import Panel from "../Panel";
import { buildKnowledgeScene } from "../../../../common/knowledge/model";
import type { KnowledgeScenePoint, KnowledgeRelationship } from "../../../../common/knowledge/model";
import { resolveControlChain, useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { KnowledgeMapProps } from "./types";
import type { TrueColor } from "../../theme";

// Canvas hex per cluster, with the same-index TrueColor name — the hex paints
// the canvas, the name paints the legend checkbox. The palette is the
// NetworkGraph community palette, so a topic reads the same in both graphs.
const COLORS = ["#0891b2", "#d97706", "#059669", "#e11d48", "#6366f1", "#8b5cf6"];
const TONES: TrueColor[] = ["cyan", "amber", "emerald", "rose", "indigo", "violet"];
const NO_RELATIONSHIPS: readonly KnowledgeRelationship[] = [];
interface Camera { x: number; y: number; zoom: number }
const INITIAL_CAMERA: Camera = { x: 0, y: 0, zoom: 1 };

export function KnowledgeMap({ memories, points, relationships = NO_RELATIONSHIPS, selectedId, defaultSelectedId = null,
  onSelectionChange, highlightedIds = [], selectedTopic, onTopicSelect, legendPosition = "auto", showLegend = true, showTitleDivider = false, height = 360, glow = true, showControls = true, hoverHighlight = true, grid = true, gridTone = "blue",
  size: controlSize = "sm", controlsTone = "auto",
  onDiagnostics, labels, className = "", loading = false, loaderType = "skeleton", loaderMessage, disabled = false, ...surface }: KnowledgeMapProps) {
  const copy = useKnowledgeCopy(labels), helpId = useId();
  // One chain for the map's chrome — the camera pill and the legend's Select all.
  const chain = resolveControlChain({ tone: surface.tone, variant: surface.variant, controlsTone });
  // NetworkGraph's lattice: a blue dot pattern behind the canvas, with the
  // same escape hatches — false hides it, an object overrides GridBackground.
  const gridEnabled = grid !== false;
  const gridOverrides = typeof grid === "object" ? grid : undefined;
  const scene = useMemo(() => buildKnowledgeScene(memories, points), [memories, points]);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const canvasRef = useRef<HTMLCanvasElement>(null), hostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; camera: Camera; moved: boolean } | null>(null);
  const [camera, setCamera] = useState(INITIAL_CAMERA), [size, setSize] = useState({ width: 640, height });
  // The graph's passive hover preview: an id, never a selection. Paint reads
  // it through a gate so disabled/loading canvases can never show a rim.
  const [hovered, setHovered] = useState<string | null>(null);
  const hoverId = hoverHighlight && !disabled && !loading ? hovered : null;
  const highlighted = useMemo(() => new Set(highlightedIds), [highlightedIds]);
  // The enabled topic set — null means every cluster is on, an array lights
  // exactly those, [] is the legend with every box empty. Paint and the
  // legend both read this one gate; the checkboxes write through
  // onTopicSelect, the NetworkGraph communities filter's own grammar.
  const hasTopicGate = selectedTopic != null;
  const topicFilter = useMemo(() => new Set(selectedTopic ?? []), [selectedTopic]);
  const clusters = useMemo(() => {
    const groups = new Map<string, { x: number; y: number; count: number; color: string; tone: TrueColor }>();
    const names = [...new Set(scene.points.map(point => point.clusterId))].sort();
    const colors = new Map(names.map((name, index) => [name, { color: COLORS[index % COLORS.length]!, tone: TONES[index % TONES.length]! }]));
    for (const point of scene.points) {
      const group = groups.get(point.clusterId) ?? { x: 0, y: 0, count: 0, ...colors.get(point.clusterId)! };
      group.x += point.x; group.y += point.y; group.count++; groups.set(point.clusterId, group);
    }
    for (const group of groups.values()) { group.x /= group.count; group.y /= group.count; }
    return groups;
  }, [scene]);
  // Legend placement, the NetworkGraph way: an observed 600px fit decides
  // right-versus-bottom in "auto"; explicit positions skip the observer.
  const layoutRef = useRef<HTMLDivElement>(null);
  const [hasLegendSpace, setHasLegendSpace] = useState(true);
  const legendOnRight = legendPosition === "right" || (legendPosition === "auto" && hasLegendSpace);
  useEffect(() => {
    const element = layoutRef.current;
    if (!element || legendPosition !== "auto") return;
    const measure = () => setHasLegendSpace(element.getBoundingClientRect().width >= 600);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, [legendPosition]);
  const geometry = useMemo(() => {
    const byId = new Map(scene.points.map(point => [point.memoryId, point]));
    const diagnostics = [...scene.diagnostics];
    const edges = relationships.flatMap(edge => {
      const source = byId.get(edge.source), target = byId.get(edge.target);
      if (!source || !target) { diagnostics.push({ code: "missing-endpoint", id: edge.id }); return []; }
      return [{ ...edge, source, target }];
    });
    return { edges, diagnostics };
  }, [scene, relationships]);
  useEffect(() => { onDiagnostics?.(geometry.diagnostics); }, [geometry.diagnostics, onDiagnostics]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => setSize({ width: Math.max(1, host.clientWidth), height: Math.max(120, height) });
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update); observer.observe(host);
    return () => observer.disconnect();
  }, [height]);
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const point of scene.points) { minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x); minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y); }
    return scene.points.length ? { x: (minX + maxX) / 2, y: (minY + maxY) / 2, width: Math.max(80, maxX - minX), height: Math.max(80, maxY - minY) } : { x: 0, y: 0, width: 640, height: 360 };
  }, [scene]);
  const fitZoom = Math.max(.000001, Math.min((size.width - 100) / bounds.width, (size.height - 100) / bounds.height, 3));
  const transform = useCallback((point: { x: number; y: number }) => ({
    x: (point.x - bounds.x) * fitZoom * camera.zoom + size.width / 2 + camera.x,
    y: (point.y - bounds.y) * fitZoom * camera.zoom + size.height / 2 + camera.y,
  }), [bounds, fitZoom, camera, size]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.width * ratio; canvas.height = size.height * ratio;
    ctx.scale(ratio, ratio); ctx.clearRect(0, 0, size.width, size.height);
    const textColor = getComputedStyle(canvas).color;
    for (const edge of geometry.edges) {
      const a = transform(edge.source), b = transform(edge.target);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = textColor; ctx.globalAlpha = .22; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    const labelBoxes: { x: number; y: number; width: number }[] = [];
    for (const [name, cluster] of clusters) {
      const center = transform(cluster);
      if (center.x < -160 || center.x > size.width + 160 || center.y < -160 || center.y > size.height + 160) continue;
      if (glow) {
        const radius = Math.min(150, 65 * Math.sqrt(camera.zoom));
        const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
        gradient.addColorStop(0, `${cluster.color}25`); gradient.addColorStop(1, `${cluster.color}00`);
        ctx.fillStyle = gradient; ctx.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
      }
      ctx.fillStyle = textColor; ctx.globalAlpha = hasTopicGate && !topicFilter.has(name) ? .35 : .7;
      ctx.font = "600 11px sans-serif"; ctx.textAlign = "center";
      const label = name || copy("ungrouped"), width = Math.min(ctx.measureText(label).width, size.width - 24);
      const x = Math.max(width / 2 + 12, Math.min(size.width - width / 2 - 12, center.x));
      let y = Math.max(20, Math.min(size.height - 16, center.y - 65));
      for (let attempt = 0; attempt < 8 && labelBoxes.some(box => Math.abs(box.y - y) < 16 && Math.abs(box.x - x) < (box.width + width) / 2 + 8); attempt++) y += 18;
      labelBoxes.push({ x, y, width });
      ctx.fillText(label, x, Math.min(size.height - 12, y), size.width - 24);
      ctx.globalAlpha = 1;
    }
    for (const point of scene.points) {
      const position = transform(point);
      if (position.x < -20 || position.x > size.width + 20 || position.y < -20 || position.y > size.height + 20) continue;
      const selected = point.memoryId === selection, marked = highlighted.has(point.memoryId), preview = !selected && !marked && point.memoryId === hoverId;
      ctx.globalAlpha = hasTopicGate && !topicFilter.has(point.memory.topic ?? "") && !selected && !marked && !preview ? .2 : 1;
      ctx.fillStyle = clusters.get(point.clusterId)!.color;
      ctx.beginPath(); ctx.arc(position.x, position.y, selected ? 6 : marked ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      if (selected || marked) { ctx.strokeStyle = textColor; ctx.lineWidth = selected ? 2 : 1; ctx.beginPath(); ctx.arc(position.x, position.y, selected ? 10 : 8, 0, Math.PI * 2); ctx.stroke(); }
      else if (preview) {
        // The graph's softer preview rim — a tone-colored whisper; selected
        // and marked points keep their own rims alone.
        ctx.strokeStyle = clusters.get(point.clusterId)!.color; ctx.globalAlpha = .9; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(position.x, position.y, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (selected || preview) { ctx.fillStyle = textColor; ctx.font = "600 12px sans-serif"; const label = point.memory.title.length > 38 ? `${point.memory.title.slice(0, 37)}…` : point.memory.title;
        const labelWidth = Math.min(ctx.measureText(label).width, size.width - 24);
        const labelX = Math.max(labelWidth / 2 + 12, Math.min(size.width - labelWidth / 2 - 12, position.x));
        ctx.fillText(label, labelX, Math.min(size.height - 12, position.y + 26), size.width - 24); }
      ctx.globalAlpha = 1;
    }
  }); // Paint on React updates only; idle maps have no animation loop. Theme changes also repaint below.
  useEffect(() => {
    // Theme classes can change above the component without changing its props.
    const observer = new MutationObserver(() => setSize(value => ({ ...value })));
    for (let node: HTMLElement | null = hostRef.current; node; node = node.parentElement) observer.observe(node, { attributes: true, attributeFilter: ["class", "data-color-scheme", "style"] });
    return () => observer.disconnect();
  }, []);
  const zoom = useCallback((factor: number, anchor = { x: size.width / 2, y: size.height / 2 }) => setCamera(current => {
    const next = Math.max(.25, Math.min(24, current.zoom * factor)), scale = next / current.zoom;
    return { zoom: next, x: anchor.x - size.width / 2 - (anchor.x - size.width / 2 - current.x) * scale,
      y: anchor.y - size.height / 2 - (anchor.y - size.height / 2 - current.y) * scale };
  }), [size.width, size.height]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheel = (event: WheelEvent) => {
      if (disabled || loading || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoom(event.deltaY < 0 ? 1.15 : 1 / 1.15, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, [disabled, loading, zoom]);
  function hit(x: number, y: number): KnowledgeScenePoint | undefined {
    let nearest: KnowledgeScenePoint | undefined, distance = 144;
    for (const point of scene.points) { const position = transform(point), squared = (position.x - x) ** 2 + (position.y - y) ** 2; if (squared < distance) { nearest = point; distance = squared; } }
    return nearest;
  }
  const selectableRelationships = geometry.edges.filter(edge => edge.source.memoryId === selection || edge.target.memoryId === selection);
  // The legend's enabled-set grammar, the NetworkGraph communities filter's
  // own: Select all is tri-state, a row toggle adds or drops one topic, and
  // the whole set writes out through one onTopicSelect call.
  const legendNames = [...clusters.keys()];
  const allTopicsOn = !hasTopicGate || (legendNames.length > 0 && legendNames.every(name => topicFilter.has(name)));
  const someTopicsOn = hasTopicGate && legendNames.some(name => topicFilter.has(name));
  const toggleTopic = (name: string, on: boolean) => {
    const base = selectedTopic ?? legendNames;
    onTopicSelect?.(on ? [...base, name] : base.filter(topic => topic !== name));
  };
  // The NetworkGraph legend, verbatim in look: uppercase legend, tri-state
  // Select all, one tone-colored Checkbox per cluster with the count riding
  // right in tabular figures. It filters; it is not a caption. Shown by
  // default whenever the callback exists — showLegend={false} opts out, and
  // any enabled set keeps filtering while the consumer owns its own control.
  const legendContent = !loading && showLegend && onTopicSelect && clusters.size > 0 && <fieldset disabled={disabled} className="flex min-w-0 shrink-0 flex-col gap-3 overflow-auto" style={{ maxHeight: Math.max(120, height) }}>
    <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">{copy("topic")}</legend>
    <Checkbox size={controlSize} tone={chain.controlsTone} label={copy("selectAll")}
      checked={allTopicsOn} indeterminate={someTopicsOn && !allTopicsOn}
      onChange={event => onTopicSelect(event.target.checked ? legendNames : [])} />
    {[...clusters.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, cluster]) => <div key={name || "—"} className="flex items-center justify-between gap-2">
      <Checkbox size={controlSize} tone={cluster.tone} label={name || copy("ungrouped")} checked={!hasTopicGate || topicFilter.has(name)} onChange={event => toggleTopic(name, event.target.checked)} />
      <span className="text-xs tabular-nums opacity-60">{cluster.count}</span>
    </div>)}
  </fieldset>;
  const showSkeleton = loading && loaderType === "skeleton";
  return <Panel variant="elevated" padding="none" disabled={disabled} {...surface} tone={chain.cardTone} loading={loading && !showSkeleton} loaderType={loaderType} loaderMessage={loaderMessage ?? copy("loading")} className={`kit-knowledge kit-knowledge-map ${className}`} aria-busy={loading}>
    {/* The map title rides the panel's own chrome; the hairline under it is
        opt-in, since the elevated panel edge already separates the regions. */}
    <div className={`kit-knowledge-toolbar${showTitleDivider ? "" : " kit-knowledge-toolbar--bare"}`}><strong>{copy("map")}</strong></div>
    {/* Canvas and legend share one flex row (or column, when the legend
        drops below) — NetworkGraph's layoutRef contract, with the placement
        recorded on the element for CSS and tests to read. */}
    <div ref={layoutRef} className="flex min-w-0 gap-4" style={{ flexDirection: legendOnRight ? "row" : "column" }} data-legend-position={legendOnRight ? "right" : "bottom"}>
      <div ref={hostRef} className="kit-knowledge-canvas min-w-0 flex-1" data-hovered={hoverId ?? undefined} style={{ height: Math.max(120, height), ...(gridEnabled ? { "--kit-knowledge-map-grid-color": `var(--color-${gridTone}-500)` } : {}) } as React.CSSProperties}>
      {gridEnabled && <GridBackground className="kit-knowledge-map-grid" pattern="dots" size={32} lineColor="var(--kit-knowledge-map-grid-color, var(--color-blue-500, #3b82f6))" dotSize={1.5} opacity={0.35} fade="radial" {...gridOverrides} />}
      {showSkeleton && <div className="kit-knowledge-map-skeleton animate-pulse motion-reduce:animate-none" role="status" aria-label={typeof loaderMessage === "string" ? loaderMessage : copy("loading")}><div aria-hidden="true">{Array.from({ length: 15 }, (_, index) => <span key={index} />)}</div></div>}
      <canvas ref={canvasRef} className="relative" style={{ width: "100%", height: "100%", display: showSkeleton ? "none" : undefined }} tabIndex={disabled || loading ? -1 : 0} role="img" aria-label={copy("map")} aria-describedby={helpId}
        onKeyDown={event => {
          if (disabled || loading) return;
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home", "Escape"].includes(event.key)) event.preventDefault();
          if (event.key === "+" || event.key === "=") zoom(1.3);
          else if (event.key === "-") zoom(1 / 1.3);
          else if (event.key === "Home") setCamera(INITIAL_CAMERA);
          else if (event.key === "Escape") select(null);
          else if (event.key.startsWith("Arrow")) setCamera(current => ({ ...current, x: current.x + (event.key === "ArrowLeft" ? 32 : event.key === "ArrowRight" ? -32 : 0), y: current.y + (event.key === "ArrowUp" ? 32 : event.key === "ArrowDown" ? -32 : 0) }));
        }}
        onPointerDown={event => { if (disabled || loading || event.button !== 0) return; event.currentTarget.setPointerCapture?.(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, camera, moved: false }; }}
        onPointerMove={event => { const start = drag.current;
          if (start) { if (disabled || loading) return; const dx = event.clientX - start.x, dy = event.clientY - start.y; if (Math.hypot(dx, dy) > 4) start.moved = true; if (start.moved) { setHovered(null); setCamera({ ...start.camera, x: start.camera.x + dx, y: start.camera.y + dy }); } return; }
          // Passive hover highlight — a preview, never a selection. Same
          // strict hit test as click-select; setState bails out when the id
          // is unchanged, so mouse moves stay cheap.
          if (disabled || loading || !hoverHighlight) return;
          const rect = event.currentTarget.getBoundingClientRect(), point = hit(event.clientX - rect.left, event.clientY - rect.top);
          setHovered(point?.memoryId ?? null); }}
        onPointerLeave={() => setHovered(null)}
        onPointerUp={event => { const start = drag.current; drag.current = null; if (!start || disabled || loading || start.moved) return; const rect = event.currentTarget.getBoundingClientRect(), point = hit(event.clientX - rect.left, event.clientY - rect.top); select(point?.memoryId ?? null); }}
        onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} />
      {!loading && !scene.points.length && <p className="kit-knowledge-map-empty" role="status">{copy("empty")}</p>}
      {/* The camera pill — the NetworkGraph cluster's own approach: floating
          bottom-right over the canvas, ghost xs IconButtons in the map's
          control tone, a tabular percent readout between the zoom steps, and
          a reset that clears selection and refits like the graph's. */}
      {showControls && !loading && <div className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
        <IconButton size="xs" variant="ghost" color={chain.controlsTone} disabled={disabled} srLabel={copy("fit")} tooltip={copy("fit")} onClick={() => setCamera(INITIAL_CAMERA)} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9V5a1 1 0 0 1 1-1h4" /><path d="M15 4h4a1 1 0 0 1 1 1v4" /><path d="M20 15v4a1 1 0 0 1-1 1h-4" /><path d="M9 20H5a1 1 0 0 1-1-1v-4" /></svg>} />
        <IconButton size="xs" variant="ghost" color={chain.controlsTone} disabled={disabled || camera.zoom <= .25} srLabel={copy("zoomOut")} tooltip={copy("zoomOut")} onClick={() => zoom(1 / 1.3)} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>} />
        <span className="min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400" aria-label={copy("zoom")}>{Math.round(camera.zoom * 100)}%</span>
        <IconButton size="xs" variant="ghost" color={chain.controlsTone} disabled={disabled || camera.zoom >= 24} srLabel={copy("zoomIn")} tooltip={copy("zoomIn")} onClick={() => zoom(1.3)} icon="Add" />
        <IconButton size="xs" variant="ghost" color={chain.controlsTone} disabled={disabled} srLabel={copy("reset")} tooltip={copy("reset")} onClick={() => { select(null); setCamera(INITIAL_CAMERA); }} icon="Reset" />
      </div>}
      </div>
      {/* The legend breathes like NetworkGraph's — the canvas runs edge to
          edge, but the checkboxes keep the panel's own inset on their side. */}
      {legendContent && <div className="min-w-0 shrink-0" style={{ width: legendOnRight ? 192 : "100%", padding: legendOnRight ? "1rem 1rem 1rem 0" : "0 1rem 1rem" }}>{legendContent}</div>}
    </div>
    {/* The layout prose lives for the canvas's aria-describedby only — the
        legend itself says the same thing on screen, better. */}
    <p id={helpId} className="sr-only">{copy(scene.projected ? "projectionNote" : "topicLayout")} {copy("mapHelp")}</p>
    {!loading && selectableRelationships.length > 0 && <section className="kit-knowledge-relationships"><h4>{copy("relationships")}</h4><ul>{selectableRelationships.map(edge => <li key={edge.id}>{edge.source.memory.title} · {edge.label} · {edge.target.memory.title}</li>)}</ul></section>}
  </Panel>;
}

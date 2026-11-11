import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Panel from "../Panel";
import { buildKnowledgeScene } from "../../../../common/knowledge/model";
import type { KnowledgeScenePoint, KnowledgeRelationship } from "../../../../common/knowledge/model";
import { useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { KnowledgeMapProps } from "./types";

const COLORS = ["#0891b2", "#d97706", "#059669", "#e11d48", "#6366f1", "#8b5cf6"];
const PAGE_SIZE = 24;
const NO_RELATIONSHIPS: readonly KnowledgeRelationship[] = [];
interface Camera { x: number; y: number; zoom: number }
const INITIAL_CAMERA: Camera = { x: 0, y: 0, zoom: 1 };

export function KnowledgeMap({ memories, points, relationships = NO_RELATIONSHIPS, selectedId, defaultSelectedId = null,
  onSelectionChange, highlightedIds = [], selectedTopic, onTopicSelect, height = 360, glow = true,
  onDiagnostics, labels, className = "", loading = false, disabled = false, ...surface }: KnowledgeMapProps) {
  const copy = useKnowledgeCopy(labels), helpId = useId();
  const scene = useMemo(() => buildKnowledgeScene(memories, points), [memories, points]);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const canvasRef = useRef<HTMLCanvasElement>(null), hostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; camera: Camera; moved: boolean } | null>(null);
  const [camera, setCamera] = useState(INITIAL_CAMERA), [size, setSize] = useState({ width: 640, height });
  const [query, setQuery] = useState(""), [page, setPage] = useState(0);
  const highlighted = useMemo(() => new Set(highlightedIds), [highlightedIds]);
  const clusters = useMemo(() => {
    const groups = new Map<string, { x: number; y: number; count: number; color: string }>();
    const names = [...new Set(scene.points.map(point => point.clusterId))].sort();
    const colors = new Map(names.map((name, index) => [name, COLORS[index % COLORS.length]]));
    for (const point of scene.points) {
      const group = groups.get(point.clusterId) ?? { x: 0, y: 0, count: 0, color: colors.get(point.clusterId)! };
      group.x += point.x; group.y += point.y; group.count++; groups.set(point.clusterId, group);
    }
    for (const group of groups.values()) { group.x /= group.count; group.y /= group.count; }
    return groups;
  }, [scene]);
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
      ctx.fillStyle = textColor; ctx.globalAlpha = selectedTopic && selectedTopic !== name ? .35 : .7;
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
      const selected = point.memoryId === selection, marked = highlighted.has(point.memoryId);
      ctx.globalAlpha = selectedTopic && selectedTopic !== point.memory.topic && !selected && !marked ? .2 : 1;
      ctx.fillStyle = clusters.get(point.clusterId)!.color;
      ctx.beginPath(); ctx.arc(position.x, position.y, selected ? 6 : marked ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      if (selected || marked) { ctx.strokeStyle = textColor; ctx.lineWidth = selected ? 2 : 1; ctx.beginPath(); ctx.arc(position.x, position.y, selected ? 10 : 8, 0, Math.PI * 2); ctx.stroke(); }
      if (selected) { ctx.fillStyle = textColor; ctx.font = "600 12px sans-serif"; const label = point.memory.title.length > 38 ? `${point.memory.title.slice(0, 37)}…` : point.memory.title;
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
      if (disabled || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoom(event.deltaY < 0 ? 1.15 : 1 / 1.15, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, [disabled, zoom]);
  function hit(x: number, y: number): KnowledgeScenePoint | undefined {
    let nearest: KnowledgeScenePoint | undefined, distance = 144;
    for (const point of scene.points) { const position = transform(point), squared = (position.x - x) ** 2 + (position.y - y) ** 2; if (squared < distance) { nearest = point; distance = squared; } }
    return nearest;
  }
  const matches = useMemo(() => scene.points.filter(point => (!selectedTopic || point.memory.topic === selectedTopic) && `${point.memory.title} ${point.memory.topic ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [scene, query, selectedTopic]);
  const lastPage = Math.max(0, Math.ceil(matches.length / PAGE_SIZE) - 1), currentPage = Math.min(page, lastPage);
  const selectableRelationships = geometry.edges.filter(edge => edge.source.memoryId === selection || edge.target.memoryId === selection);
  return <Panel tone="none" variant="outlined" padding="none" loading={loading} disabled={disabled} {...surface} className={`kit-knowledge kit-knowledge-map ${className}`} aria-busy={loading}>
    <div className="kit-knowledge-toolbar"><strong>{copy("map")}</strong><div className="kit-knowledge-view"><button type="button" disabled={disabled} onClick={() => setCamera(INITIAL_CAMERA)}>{copy("fit")}</button><button type="button" disabled={disabled} aria-label={copy("zoomOut")} onClick={() => zoom(1 / 1.3)}>−</button><button type="button" disabled={disabled} aria-label={copy("zoomIn")} onClick={() => zoom(1.3)}>+</button></div></div>
    <div ref={hostRef} className="kit-knowledge-canvas" style={{ height: Math.max(120, height) }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} tabIndex={disabled ? -1 : 0} role="img" aria-label={copy("map")} aria-describedby={helpId}
        onKeyDown={event => {
          if (disabled) return;
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home", "Escape"].includes(event.key)) event.preventDefault();
          if (event.key === "+" || event.key === "=") zoom(1.3);
          else if (event.key === "-") zoom(1 / 1.3);
          else if (event.key === "Home") setCamera(INITIAL_CAMERA);
          else if (event.key === "Escape") select(null);
          else if (event.key.startsWith("Arrow")) setCamera(current => ({ ...current, x: current.x + (event.key === "ArrowLeft" ? 32 : event.key === "ArrowRight" ? -32 : 0), y: current.y + (event.key === "ArrowUp" ? 32 : event.key === "ArrowDown" ? -32 : 0) }));
        }}
        onPointerDown={event => { if (disabled || event.button !== 0) return; event.currentTarget.setPointerCapture?.(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, camera, moved: false }; }}
        onPointerMove={event => { const start = drag.current; if (!start || disabled) return; const dx = event.clientX - start.x, dy = event.clientY - start.y; if (Math.hypot(dx, dy) > 4) start.moved = true; if (start.moved) setCamera({ ...start.camera, x: start.camera.x + dx, y: start.camera.y + dy }); }}
        onPointerUp={event => { const start = drag.current; drag.current = null; if (!start || disabled || start.moved) return; const rect = event.currentTarget.getBoundingClientRect(), point = hit(event.clientX - rect.left, event.clientY - rect.top); select(point?.memoryId ?? null); }}
        onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} />
      {(loading || !scene.points.length) && <p className="kit-knowledge-map-empty" role="status">{copy(loading ? "loading" : "empty")}</p>}
    </div>
    <p id={helpId} className="kit-knowledge-note">{copy(scene.projected ? "projectionNote" : "topicLayout")} {copy("mapHelp")}</p>
    {onTopicSelect && <div className="kit-knowledge-topics" role="group" aria-label={copy("topic")}><button disabled={disabled} type="button" aria-pressed={!selectedTopic} onClick={() => onTopicSelect(null)}>{copy("all")}</button>{[...new Set(memories.flatMap(memory => memory.topic ? [memory.topic] : []))].sort().map(topic => <button disabled={disabled} type="button" key={topic} aria-pressed={selectedTopic === topic} onClick={() => onTopicSelect(topic)}>{topic}</button>)}</div>}
    <details className="kit-knowledge-map-list"><summary>{copy("list")} · {matches.length}</summary><label>{copy("search")}<input type="search" value={query} disabled={disabled} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
      <ul>{matches.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map(point => <li key={point.memoryId}><button type="button" disabled={disabled} aria-pressed={point.memoryId === selection} onClick={() => select(point.memoryId)}>{point.memory.title}</button></li>)}</ul>
      {!matches.length && <p>{copy("noResults")}</p>}
      {lastPage > 0 && <div className="kit-knowledge-actions"><button type="button" disabled={disabled || currentPage === 0} onClick={() => setPage(currentPage - 1)}>{copy("previous")}</button><span>{currentPage + 1} / {lastPage + 1}</span><button type="button" disabled={disabled || currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>{copy("next")}</button></div>}
    </details>
    {selectableRelationships.length > 0 && <section className="kit-knowledge-relationships"><h4>{copy("relationships")}</h4><ul>{selectableRelationships.map(edge => <li key={edge.id}>{edge.source.memory.title} · {edge.label} · {edge.target.memory.title}</li>)}</ul></section>}
  </Panel>;
}

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { routeBetween, routePolyline, type Box, type PortSide } from './router';
import Panel from '../Panel';
import ProgressSpinner from '../ProgressSpinner';
import DotStepper from '../DotStepper';
import DiagramFlowControls from './DiagramFlowControls';
import { placeDiagramCaptions } from './captions';
import ConnectionFlowNodeBody from '../ConnectionFlow/ConnectionFlowNodeBody';
import { DEFAULT_LAYOUT_OPTIONS, NODE_METRICS, dotTiming, measureNode, nodeTone, routeLength, type ConnectionFlowItemProgress, type ConnectionFlowNode, type ConnectionFlowProgressType, type LaidOutNode } from '../../connectionFlow';
import type { ControlSize } from '../../theme/Theme';
import { DIAGRAM_SIDES, freeDiagramPort, nearestDiagramSide, type DiagramPort } from './ports';
import { applyDiagramFlowOperation, validateDiagramFlow, type DiagramFlowConnection, type DiagramFlowGraph, type DiagramFlowNode, type DiagramFlowOperation, type DiagramFlowOutcome, type DiagramFlowPanelProps } from './model';

export interface DiagramFlowProps {
  graph: DiagramFlowGraph;
  onChange: (graph: DiagramFlowGraph, operation: DiagramFlowOperation) => void;
  onConnectionEdit?: (connection: DiagramFlowConnection) => void;
  onNodeEdit?: (node: DiagramFlowNode) => void;
  /** Called when a node is clicked, including when it is a connection target. */
  onNodeClick?: (node: DiagramFlowNode) => void;
  /** Called when a connection is selected by click or keyboard. */
  onConnectionClick?: (connection: DiagramFlowConnection) => void;
  /** Reports a successful connection request after onChange. */
  onConnect?: (connection: DiagramFlowConnection) => void;
  /** Reports a successful endpoint change after onChange. */
  onReconnect?: (previous: DiagramFlowConnection, next: DiagramFlowConnection) => void;
  height?: number;
  gridSize?: number;
  readOnly?: boolean;
  /** Default Panel options for every node; individual nodes can override them. */
  nodePanelProps?: DiagramFlowPanelProps;
  /** Enable application-marked travelling dots. @default true */
  animated?: boolean;
  /** Speed in canvas pixels per second. @default 120 */
  dotSpeed?: number;
  /** Time between dot departures in milliseconds. @default 700 */
  dotInterval?: number;
  /** Default content scale and progress styles, overridable on each node. */
  size?: ControlSize;
  progressType?: ConnectionFlowProgressType;
  itemProgress?: ConnectionFlowItemProgress;
  maxVisibleItems?: number;
}
const WIDTH = 180, HEIGHT = 76;

/** Controlled diagram editor; the application owns execution and persistence. */
type ConnectionGesture = { kind: 'create'; sourceId: string; outcome: DiagramFlowOutcome; side?: PortSide } | { kind: 'reconnect'; edgeId: string; endpoint: 'source' | 'target' };
type PointerConnection = { gesture: ConnectionGesture; pointerId: number; x: number; y: number; startX: number; startY: number };

export default function DiagramFlow({ graph, onChange, onConnectionEdit, onNodeEdit, onNodeClick, onConnectionClick, onConnect, onReconnect, height = 560, gridSize = 20, readOnly = false, nodePanelProps, animated = true, dotSpeed = 120, dotInterval = 700, size = 'md', progressType = 'bar', itemProgress = 'bar', maxVisibleItems = 2 }: DiagramFlowProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<ConnectionGesture | null>(null);
  const [connectionDrag, setConnectionDrag] = useState<PointerConnection | null>(null);
  const connectionDragRef = useRef<PointerConnection | null>(null);
  const suppressClick = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<{ past: DiagramFlowGraph[]; future: DiagramFlowGraph[] }>({ past: [], future: [] });
  const lastGraph = useRef(graph);
  const expectedGraph = useRef<DiagramFlowGraph | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; original: { x: number; y: number }; moved: boolean } | null>(null);
  const [preview, setPreview] = useState<{ id: string; x: number; y: number } | null>(null);
  const [sizePreview, setSizePreview] = useState<{ id: string; width: number; height: number } | null>(null);
  const resize = useRef<{ id: string; pointerId: number; startX: number; startY: number; width: number; height: number } | null>(null);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (lastGraph.current !== graph) {
      if (expectedGraph.current !== graph) setHistory({ past: [], future: [] });
      lastGraph.current = graph;
      expectedGraph.current = null;
      drag.current = null;
      resize.current = null; setSizePreview(null);
      connectionDragRef.current = null;
      setConnectionDrag(null);
      setConnecting(null);
      setPreview(null);
    }
  }, [graph]);
  useEffect(() => {
    if (readOnly) { setConnecting(null); connectionDragRef.current = null; setConnectionDrag(null); drag.current = null; setPreview(null); resize.current = null; setSizePreview(null); }
  }, [readOnly]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && event.target instanceof Node && root.current?.contains(event.target)) {
        setConnecting(null); connectionDragRef.current = null; setConnectionDrag(null); resize.current = null; setSizePreview(null); setSelected(null); setSelectedEdge(null);
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  const errors = useMemo(() => validateDiagramFlow(graph), [graph]);
  const layoutOptions = useMemo(() => ({ ...DEFAULT_LAYOUT_OPTIONS, metrics: NODE_METRICS[size], itemProgress, maxVisibleItems }), [size, itemProgress, maxVisibleItems]);
  const nodes = useMemo(() => graph.nodes.map(n => preview?.id === n.id ? { ...n, position: { x: preview.x, y: preview.y } } : n), [graph.nodes, preview]);
  const byId = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
  const nodeSize = (node: DiagramFlowNode) => {
    const panel = { ...nodePanelProps, ...node.panelProps };
    const minimum = typeof panel.minHeight === 'number' ? panel.minHeight : 0;
    const paddingHeight = panel.padding === 'xl' ? 116 : panel.padding === 'lg' ? 100 : panel.padding === 'md' ? 84 : HEIGHT;
    const flowNode: ConnectionFlowNode = { ...node, height: undefined };
    // Panel's body wrapper and padding add space beyond the SVG card metrics.
    const stepperSize = node.dotStepper?.size ?? 'sm';
    const stepperPadding = node.dotStepper?.padding ?? 'none';
    const stepperHeight = node.dotStepper ? ({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }[stepperSize] + { none: 0, xs: 12, sm: 20, md: 32, lg: 40, xl: 48 }[stepperPadding] + 12) : 0;
    const contentHeight = measureNode(flowNode, layoutOptions, expanded) + (node.subtitle || node.description || node.items?.length || node.progress !== undefined ? 24 : 0) + stepperHeight;
    return { width: sizePreview?.id === node.id ? sizePreview.width : node.width ?? WIDTH, height: sizePreview?.id === node.id ? sizePreview.height : Math.max(node.height ?? Math.max(paddingHeight, contentHeight), minimum) };
  };
  const offsetX = 60 - Math.min(0, ...nodes.map(n => n.position.x - 80));
  const offsetY = 60 - Math.min(0, ...nodes.map(n => n.position.y - 80));
  const width = Math.max(900, ...nodes.map(n => n.position.x + offsetX + nodeSize(n).width + 140));
  const canvasHeight = Math.max(500, ...nodes.map(n => n.position.y + offsetY + nodeSize(n).height + 140));
  const snap = (value: number) => Math.round(value / Math.max(1, gridSize)) * Math.max(1, gridSize);
  const nextId = (prefix: string) => { let id: string; do { id = `${prefix}-${uid}-${++sequence.current}`; } while (graph.nodes.some(n => n.id === id) || graph.connections.some(e => e.id === id)); return id; };
  const commit = (operation: DiagramFlowOperation) => {
    const next = applyDiagramFlowOperation(graph, operation);
    if (!next) return false;
    setHistory(h => ({ past: [...h.past.slice(-49), graph], future: [] }));
    expectedGraph.current = next;
    onChange(next, operation);
    if (operation.type === 'connect') onConnect?.(operation.connection);
    if (operation.type === 'create' && operation.connection) onConnect?.(operation.connection);
    if (operation.type === 'update-connection') {
      const previous = graph.connections.find(edge => edge.id === operation.connection.id);
      if (previous && (previous.sourceId !== operation.connection.sourceId || previous.targetId !== operation.connection.targetId || previous.fromSide !== operation.connection.fromSide || previous.toSide !== operation.connection.toSide)) onReconnect?.(previous, operation.connection);
    }
    return true;
  };
  const travel = (direction: 'undo' | 'redo') => {
    const source = direction === 'undo' ? history.past : history.future;
    const target = source[source.length - 1];
    if (!target) return;
    setHistory(direction === 'undo' ? { past: history.past.slice(0, -1), future: [...history.future, graph] } : { past: [...history.past, graph], future: history.future.slice(0, -1) });
    expectedGraph.current = target;
    onChange(target, { type: 'replace', graph: target });
  };
  const move = (id: string, position: { x: number; y: number }) => {
    const moving = graph.nodes.find(n => n.id === id);
    if (!moving) return;
    const size = nodeSize(moving);
    if (graph.nodes.some(n => { const other = nodeSize(n); return n.id !== id && position.x < n.position.x + other.width + 16 && position.x + size.width + 16 > n.position.x && position.y < n.position.y + other.height + 16 && position.y + size.height + 16 > n.position.y; })) {
      setNotice('That position overlaps another step.');
      return;
    }
    setNotice('');
    commit({ type: 'move', id, position });
  };
  const resizeNode = (id: string, width: number, height: number) => {
    const node = graph.nodes.find(n => n.id === id);
    if (!node) return;
    const panel = { ...nodePanelProps, ...node.panelProps };
    const minHeight = typeof panel.minHeight === 'number' ? panel.minHeight : 0;
    const nextWidth = Math.max(120, snap(width));
    const nextHeight = Math.max(60, minHeight, snap(height));
    if (graph.nodes.some(n => { const other = nodeSize(n); return n.id !== id && node.position.x < n.position.x + other.width + 16 && node.position.x + nextWidth + 16 > n.position.x && node.position.y < n.position.y + other.height + 16 && node.position.y + nextHeight + 16 > n.position.y; })) {
      setNotice('That size overlaps another step.'); return;
    }
    setNotice('');
    commit({ type: 'update-node', node: { ...node, width: nextWidth, height: nextHeight } });
  };
  const add = (source: DiagramFlowNode | undefined, child: boolean) => {
    const id = nextId('node');
    let x = source ? source.position.x + (child ? 40 : 260) : 0;
    let y = source ? source.position.y + (child ? 140 : 120) : 0;
    while (graph.nodes.some(n => { const size = nodeSize(n); return x < n.position.x + size.width + 20 && x + WIDTH + 20 > n.position.x && y < n.position.y + size.height + 20 && y + HEIGHT + 20 > n.position.y; })) y += 120;
    const node: DiagramFlowNode = { id, title: 'New step', position: { x: snap(x), y: snap(y) }, ...(child && source ? { parentId: source.id } : source?.parentId ? { parentId: source.parentId } : {}) };
    const connection: DiagramFlowConnection | undefined = source && !child ? { id: nextId('edge'), sourceId: source.id, targetId: id, outcome: 'unknown' } : undefined;
    commit({ type: 'create', node, connection }); setSelected(id); setSelectedEdge(null);
  };
  const finishConnection = (gesture: ConnectionGesture, nodeId: string, side?: PortSide) => {
    if (gesture.kind === 'create') {
      if (gesture.sourceId === nodeId) { setNotice('A step cannot connect to itself.'); return; }
      if (commit({ type: 'connect', connection: { id: nextId('edge'), sourceId: gesture.sourceId, targetId: nodeId, outcome: gesture.outcome, ...(gesture.side ? { fromSide: gesture.side } : {}), ...(side ? { toSide: side } : {}) } })) setNotice('');
    } else {
      const edge = graph.connections.find(e => e.id === gesture.edgeId);
      if (!edge) return;
      const updated = { ...edge, [gesture.endpoint === 'source' ? 'sourceId' : 'targetId']: nodeId, ...(side ? { [gesture.endpoint === 'source' ? 'fromSide' : 'toSide']: side } : {}) };
      if (updated.sourceId === updated.targetId) { setNotice('A step cannot connect to itself.'); return; }
      if (updated.sourceId !== edge.sourceId || updated.targetId !== edge.targetId || updated.fromSide !== edge.fromSide || updated.toSide !== edge.toSide) commit({ type: 'update-connection', connection: updated });
      setNotice('');
    }
    setConnecting(null);
  };
  const routes = useMemo(() => {
    const box = (n: DiagramFlowNode): Box => ({ x: n.position.x + offsetX, y: n.position.y + offsetY, ...nodeSize(n) });
    const obstacles = nodes.map(box);
    const occupied: { x: number; y: number }[][] = [];
    const allocations = new Map<string, DiagramPort[]>();
    return graph.connections.flatMap(edge => {
      const from = byId.get(edge.sourceId), to = byId.get(edge.targetId);
      if (!from || !to || from.id === to.id) return [];
      const a = box(from), b = box(to), dx = b.x - a.x, dy = b.y - a.y;
      const sides: [PortSide, PortSide] = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? ['right', 'left'] : ['left', 'right']) : (dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom']);
      const findPort = (box: Box, side: PortSide, used: DiagramPort[]) =>
        [side, ...DIAGRAM_SIDES.filter(s => s !== side)].map(s => freeDiagramPort(box, s, used)).find(p => p !== null);
      const fromPort = findPort(a, edge.fromSide ?? sides[0], allocations.get(from.id) ?? []);
      const toPort = findPort(b, edge.toSide ?? sides[1], allocations.get(to.id) ?? []);
      if (!fromPort || !toPort) return [];
      const route = routeBetween({ box: a, t: fromPort.t, sides: [fromPort.side] }, { box: b, t: toPort.t, sides: [toPort.side] }, obstacles, { style: 'orthogonal', clearance: 12, stub: 22, radius: 8, strictObstacles: true, occupied });
      if (!route) return [];
      occupied.push(route.points);
      allocations.set(from.id, [...(allocations.get(from.id) ?? []), fromPort]);
      allocations.set(to.id, [...(allocations.get(to.id) ?? []), toPort]);
      return [{ edge, route, fromPort, toPort }];
    });
  }, [nodes, byId, graph.connections, offsetX, offsetY, nodePanelProps, sizePreview, expanded, layoutOptions]);
  const dotGroups = useMemo(() => {
    const groups = new Map<string, typeof routes>();
    for (const route of routes) if (animated && route.edge.animated) groups.set(route.edge.sourceId, [...(groups.get(route.edge.sourceId) ?? []), route]);
    return groups;
  }, [routes, animated]);
  const captions = useMemo(() => placeDiagramCaptions(routes.map(r => ({ id: r.edge.id, text: r.edge.label || r.edge.conditionLabel || '', points: r.route.points })), nodes.map(n => ({ x: n.position.x + offsetX, y: n.position.y + offsetY, ...nodeSize(n) }))), [routes, nodes, offsetX, offsetY, nodePanelProps, sizePreview, expanded, layoutOptions]);
  const canvasWidth = Math.max(width, ...Array.from(captions.values(), caption => caption.x + caption.width + 40));
  const canvasHeightWithCaptions = Math.max(canvasHeight, ...Array.from(captions.values(), caption => caption.y + caption.height + 40));
  const nodeBox = (node: DiagramFlowNode): Box => ({ x: node.position.x + offsetX, y: node.position.y + offsetY, ...nodeSize(node) });
  const nodeDisabled = (node: DiagramFlowNode) => node.panelProps?.disabled ?? nodePanelProps?.disabled ?? false;
  const portsFor = (node: DiagramFlowNode, excludedEdge?: string) => {
    const used = routes.filter(r => r.edge.id !== excludedEdge).flatMap(r => [
      ...(r.edge.sourceId === node.id ? [r.fromPort] : []),
      ...(r.edge.targetId === node.id ? [r.toPort] : []),
    ]);
    return DIAGRAM_SIDES.flatMap(side => { const port = freeDiagramPort(nodeBox(node), side, used); return port ? [port] : []; });
  };
  const pointAt = (clientX: number, clientY: number) => {
    const bounds = canvas.current?.getBoundingClientRect();
    return bounds ? { x: (clientX - bounds.left) / zoom, y: (clientY - bounds.top) / zoom } : null;
  };
  const dropAt = (point: { x: number; y: number }, gesture: ConnectionGesture) => {
    const edge = gesture.kind === 'reconnect' ? graph.connections.find(e => e.id === gesture.edgeId) : undefined;
    const fixed = gesture.kind === 'create' ? gesture.sourceId : gesture.endpoint === 'source' ? edge?.targetId : edge?.sourceId;
    const target = nodes.find(n => { const b = nodeBox(n); return !nodeDisabled(n) && n.id !== fixed && point.x >= b.x - 20 && point.x <= b.x + b.width + 20 && point.y >= b.y - 20 && point.y <= b.y + b.height + 20; });
    if (!target) return null;
    const choices = portsFor(target, edge?.id);
    const preferred = nearestDiagramSide(nodeBox(target), point.x, point.y);
    const port = choices.find(p => p.side === preferred) ?? choices.sort((a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y))[0];
    return port ? { node: target, port, choices } : null;
  };
  const handleGesture = (gesture: ConnectionGesture) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (readOnly || event.button !== 0) return;
      event.stopPropagation();
      const point = pointAt(event.clientX, event.clientY);
      if (!point) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const next = { gesture, pointerId: event.pointerId, ...point, startX: event.clientX, startY: event.clientY };
      connectionDragRef.current = next; setConnectionDrag(next); setConnecting(null);
    },
    onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => {
      const active = connectionDragRef.current;
      if (!active || active.pointerId !== event.pointerId) return;
      const point = pointAt(event.clientX, event.clientY);
      if (point) { const next = { ...active, ...point }; connectionDragRef.current = next; setConnectionDrag(next); }
    },
    onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => {
      const active = connectionDragRef.current;
      if (!active || active.pointerId !== event.pointerId) return;
      connectionDragRef.current = null; setConnectionDrag(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) < 4) return;
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 0);
      const point = pointAt(event.clientX, event.clientY);
      const target = point && dropAt(point, active.gesture);
      if (target) finishConnection(active.gesture, target.node.id, target.port.side);
      else setNotice('Connection canceled. Drop on a step to connect.');
    },
    onPointerCancel: () => { connectionDragRef.current = null; setConnectionDrag(null); },
    onLostPointerCapture: () => { connectionDragRef.current = null; setConnectionDrag(null); },
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (suppressClick.current) { suppressClick.current = false; return; }
      setConnecting(gesture); setNotice('');
    },
  });
  const activeGesture = connectionDrag?.gesture;
  const dropTarget = connectionDrag && dropAt(connectionDrag, connectionDrag.gesture);
  const dragEdge = activeGesture?.kind === 'reconnect' ? graph.connections.find(e => e.id === activeGesture.edgeId) : undefined;
  const fixedId = activeGesture?.kind === 'create' ? activeGesture.sourceId : activeGesture?.endpoint === 'source' ? dragEdge?.targetId : dragEdge?.sourceId;
  const fixedNode = fixedId ? byId.get(fixedId) : undefined;
  const previewPath = (() => {
    if (!connectionDrag || !activeGesture || !fixedNode) return null;
    const existing = activeGesture.kind === 'reconnect' ? routes.find(r => r.edge.id === activeGesture.edgeId) : undefined;
    const fixedPort = activeGesture.kind === 'create'
      ? portsFor(fixedNode).find(p => p.side === activeGesture.side)
      : activeGesture.endpoint === 'source' ? existing?.toPort : existing?.fromPort;
    if (!fixedPort) return null;
    const endBox: Box = dropTarget ? nodeBox(dropTarget.node) : { x: connectionDrag.x - 1, y: connectionDrag.y - 1, width: 2, height: 2 };
    const endSide = dropTarget?.port.side ?? nearestDiagramSide(endBox, fixedPort.x, fixedPort.y);
    const endT = dropTarget?.port.t ?? .5;
    const routed = routeBetween({ box: nodeBox(fixedNode), t: fixedPort.t, sides: [fixedPort.side] }, { box: endBox, t: endT, sides: [endSide] }, nodes.map(nodeBox), {
      style: 'orthogonal', clearance: 12, stub: 22, radius: 8, strictObstacles: true,
      occupied: routes.filter(r => r.edge.id !== dragEdge?.id).map(r => r.route.points),
    });
    if (routed) return routed.d;
    const end = dropTarget?.port ?? connectionDrag;
    const mid = (fixedPort.x + end.x) / 2;
    return routePolyline([fixedPort, { x: mid, y: fixedPort.y }, { x: mid, y: end.y }, end], 'orthogonal', 8).d;
  })();
  const selectedNode = byId.get(selected ?? '');
  const selectedConnection = graph.connections.find(edge => edge.id === selectedEdge);
  const activateNode = (node: DiagramFlowNode) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    onNodeClick?.(node);
    if (connecting) finishConnection(connecting, node.id);
    else { setSelected(node.id); setSelectedEdge(null); }
  };
  const fitDiagram = () => {
    const view = viewport.current;
    if (!view || !nodes.length || !view.clientWidth || !view.clientHeight) return;
    const boxes = [...nodes.map(nodeBox), ...captions.values()];
    const minX = Math.min(...boxes.map(box => box.x)), minY = Math.min(...boxes.map(box => box.y));
    const maxX = Math.max(...boxes.map(box => box.x + box.width)), maxY = Math.max(...boxes.map(box => box.y + box.height));
    const next = Math.max(.1, Math.min(2, (view.clientWidth - 64) / (maxX - minX), (view.clientHeight - 64) / (maxY - minY)));
    setZoom(next);
    requestAnimationFrame(() => { view.scrollLeft = Math.max(0, (minX + maxX) * next / 2 - view.clientWidth / 2); view.scrollTop = Math.max(0, (minY + maxY) * next / 2 - view.clientHeight / 2); });
  };
  return <div ref={root} data-diagram-flow className="overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">
    <style>{`[data-diagram-flow]{--diagram-caption-fill:var(--color-neutral-100,#f5f5f5);--diagram-caption-text:var(--color-neutral-700,#404040)} .dark [data-diagram-flow]{--diagram-caption-fill:var(--color-neutral-800,#262626);--diagram-caption-text:var(--color-neutral-100,#f5f5f5)}`}</style>
    <div role="status" className="min-h-6 px-3 text-xs text-neutral-500">{errors.length ? `Invalid graph: ${errors.join('; ')}` : notice || (routes.length < graph.connections.length ? 'Some connections cannot be routed. Move steps or free a connection point.' : connecting ? 'Choose a step to connect, or press Escape to cancel.' : 'Select a step or connection. Drag steps or connection handles.')}</div>
    <div className="relative"><div ref={viewport} className="overflow-auto" style={{ height }}><div style={{ width: canvasWidth * zoom, height: canvasHeightWithCaptions * zoom, position: 'relative', backgroundImage: 'radial-gradient(#a3a3a3 0.7px, transparent 0.7px)', backgroundSize: `${Math.max(1, gridSize) * zoom}px ${Math.max(1, gridSize) * zoom}px` }}>
      <div ref={canvas} style={{ position: 'absolute', width: canvasWidth, height: canvasHeightWithCaptions, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        <button type="button" tabIndex={-1} aria-label="Clear diagram selection" onClick={() => { setSelected(null); setSelectedEdge(null); setConnecting(null); setNotice(''); }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, padding: 0, background: 'transparent', cursor: 'default' }} />
        <svg aria-label="Connections" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker></defs>
          {routes.map(({ edge, route }) => <g key={edge.id}>
            {selectedEdge === edge.id && <path d={route.d} fill="none" stroke="#60a5fa" strokeWidth="8" opacity=".35" pointerEvents="none" />}
            <path d={route.d} fill="none" stroke="transparent" strokeWidth="12" pointerEvents="stroke" style={{ outline: 'none', cursor: 'pointer' }} tabIndex={0} role="button" aria-label={`${edge.outcome} connection from ${byId.get(edge.sourceId)?.title} to ${byId.get(edge.targetId)?.title}${edge.label || edge.conditionLabel ? `, ${edge.label || edge.conditionLabel}` : ''}`} onClick={() => { setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); } else if (!readOnly && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); commit({ type: 'remove-connection', id: edge.id }); setSelectedEdge(null); } }} onDoubleClick={() => onConnectionEdit?.(edge)} />
            <path d={route.d} fill="none" stroke={edge.outcome === 'failure' ? '#e11d48' : edge.outcome === 'success' ? '#059669' : '#94a3b8'} strokeWidth={selectedEdge === edge.id ? 3 : 2} strokeDasharray={edge.outcome === 'failure' ? '6 4' : undefined} markerEnd={`url(#${uid}-arrow)`} pointerEvents="none" />
            {edge.animated && animated && (() => { const group = dotGroups.get(edge.sourceId) ?? []; const index = group.findIndex(item => item.edge.id === edge.id); const span = Math.max(1, ...group.map(item => routeLength(item.route.points))); const timing = dotTiming(routeLength(route.points), Math.max(0, index), group.length, span, dotSpeed, Math.max(1, dotInterval) / 1000); return <circle data-diagram-flow-dot={edge.id} r={3} fill={edge.outcome === 'failure' ? '#fb7185' : edge.outcome === 'success' ? '#34d399' : '#cbd5e1'} opacity={0} className="motion-reduce:hidden" pointerEvents="none"><animateMotion path={route.d} dur={`${timing.cycle.toFixed(3)}s`} begin={`${timing.begin.toFixed(3)}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1" keyTimes={`0;${timing.arrival.toFixed(4)};1`} /><animate attributeName="opacity" dur={`${timing.cycle.toFixed(3)}s`} begin={`${timing.begin.toFixed(3)}s`} repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes={`0;${timing.arrival.toFixed(4)}`} /></circle>; })()}
          </g>)}
          {routes.map(({ edge }) => { const caption = captions.get(edge.id); if (!caption) return null; return <g key={`caption-${edge.id}`} data-diagram-caption={edge.id}>
            <rect x={caption.x} y={caption.y} width={caption.width} height={caption.height} rx={5} className="stroke-neutral-300 dark:stroke-neutral-600" strokeWidth={1} pointerEvents="all" style={{ cursor: 'pointer', fill: 'var(--diagram-caption-fill, #f5f5f5)' }} onClick={() => { setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); }} onDoubleClick={() => onConnectionEdit?.(edge)} />
            <text x={caption.x + caption.width / 2} y={caption.y + 4 + caption.lineHeight / 2} textAnchor="middle" dominantBaseline="central" className="text-[10px]" style={{ fill: 'var(--diagram-caption-text, #404040)' }} pointerEvents="none">{caption.lines.map((line, i) => <tspan key={i} x={caption.x + caption.width / 2} dy={i === 0 ? 0 : caption.lineHeight}>{line}</tspan>)}</text>
          </g>; })}
          {previewPath && <path data-diagram-connection-preview d={previewPath} stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 4" fill="none" pointerEvents="none" />}
        </svg>
        {nodes.map(node => { const panel = { variant: 'outlined' as const, padding: 'sm' as const, ...nodePanelProps, ...(node.tone ? { tone: node.tone } : {}), ...node.panelProps }; const dimensions = nodeSize(node); const flowNode: ConnectionFlowNode = node; const stepperReadOnly = node.dotStepper?.readOnly ?? !(node.dotStepper?.onStepSelect || node.dotStepper?.renderActiveContent); const hasControls = (!!node.dotStepper && !stepperReadOnly) || (node.items?.length ?? 0) > (node.maxItems ?? maxVisibleItems) || expanded.has(node.id); const laid: LaidOutNode = { id: node.id, node: flowNode, outline: '', x: node.position.x, y: node.position.y, ...dimensions, anchorY: dimensions.height / 2, column: 0, depth: 0, tone: nodeTone(flowNode), scrollable: true }; return <Panel key={node.id} {...panel} clickable={hasControls ? false : panel.clickable} role={hasControls ? 'group' : undefined} tabIndex={hasControls ? (panel.disabled ? -1 : 0) : undefined} data-diagram-node={node.id} aria-label={`${node.title} ${node.status ?? 'pending'}${node.join === 'all' ? `, join ${node.joinReady ? 'ready' : 'waiting'}` : ''}`} aria-pressed={hasControls ? undefined : selected === node.id} active={!!panel.active || selected === node.id || dropTarget?.node.id === node.id} onPointerEnter={() => setHoveredNode(node.id)} onPointerLeave={event => { if (!(event.relatedTarget instanceof Element) || event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id) setHoveredNode(null); }} onFocus={() => setHoveredNode(node.id)} onBlur={event => { if (!(event.relatedTarget instanceof Element) || event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id) setHoveredNode(null); }} onClick={() => activateNode(node)} onDoubleClick={() => onNodeEdit?.(node)}
          onPointerDown={event => { if (readOnly || connecting || event.button !== 0 || (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [data-no-drag]'))) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: node.id, x: event.clientX, y: event.clientY, original: node.position, moved: false }; }}
          onPointerMove={event => { const d = drag.current; if (!d || d.id !== node.id) return; const dx = (event.clientX - d.x) / zoom, dy = (event.clientY - d.y) / zoom; if (Math.hypot(dx, dy) < 4 && !d.moved) return; d.moved = true; setPreview({ id: node.id, x: snap(d.original.x + dx), y: snap(d.original.y + dy) }); }}
          onPointerUp={event => { const d = drag.current; drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (d?.moved) { suppressClick.current = true; setTimeout(() => { suppressClick.current = false; }, 0); move(node.id, { x: snap(d.original.x + (event.clientX - d.x) / zoom), y: snap(d.original.y + (event.clientY - d.y) / zoom) }); } setPreview(null); }}
          onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); return; } if (readOnly || connecting) return; const delta: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const direction = delta[event.key]; if (direction) { event.preventDefault(); move(node.id, { x: snap(node.position.x + direction[0] * gridSize), y: snap(node.position.y + direction[1] * gridSize) }); } }}
          onPointerCancel={() => { drag.current = null; setPreview(null); }}
          className={`text-left ${dropTarget?.node.id === node.id ? 'ring-4 ring-blue-400/60 ring-offset-2' : ''} ${panel.className ?? ''}`}
          style={{ ...panel.style, position: 'absolute', left: node.position.x + offsetX, top: node.position.y + offsetY, ...nodeSize(node), touchAction: 'none' }}>
          {hasControls && <button type="button" disabled={panel.disabled} className="sr-only focus:not-sr-only" onClick={event => { event.stopPropagation(); activateNode(node); }}>Select {node.title}</button>}
          <div className="flex h-full min-h-0 gap-2 overflow-y-auto">
            <div className="min-w-0 flex-1"><ConnectionFlowNodeBody node={laid} metrics={NODE_METRICS[size]} options={layoutOptions} scrollable expanded={expanded} onToggleExpanded={id => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} showProgress={(node.progressType ?? progressType) === 'bar'} />{node.dotStepper && <div data-no-drag data-diagram-stepper={node.id} className="mt-2 max-w-full overflow-x-auto"><DotStepper variant="none" {...node.dotStepper} readOnly={stepperReadOnly} aria-label={node.dotStepper['aria-label'] ?? `${node.title} steps`} /></div>}{node.join === 'all' && <span className="text-xs text-neutral-500">Join {node.joinReady ? 'ready' : 'waiting'}</span>}</div>
            {(node.progressType ?? progressType) === 'spinner' && node.progress !== undefined && <ProgressSpinner size="xs" color={nodeTone(flowNode)} value={node.progress * 100} showValue={false} />}
          </div>
        </Panel>; })}
        {!readOnly && selectedNode && !nodeDisabled(selectedNode) && (() => { const size = nodeSize(selectedNode); return <button type="button" data-diagram-resize={selectedNode.id} aria-label={`Resize ${selectedNode.title}`} title="Drag or use arrow keys to resize" className="absolute z-20 flex items-end justify-end rounded-sm border border-blue-500 bg-white text-blue-600 shadow focus-visible:outline focus-visible:outline-2 dark:bg-neutral-900" style={{ left: selectedNode.position.x + offsetX + size.width - 10, top: selectedNode.position.y + offsetY + size.height - 10, width: 20, height: 20, cursor: 'nwse-resize', touchAction: 'none' }}
          onPointerDown={event => { if (event.button !== 0) return; event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); resize.current = { id: selectedNode.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, ...size }; }}
          onPointerMove={event => { const r = resize.current; if (!r || r.pointerId !== event.pointerId) return; setSizePreview({ id: r.id, width: Math.max(120, snap(r.width + (event.clientX - r.startX) / zoom)), height: Math.max(60, snap(r.height + (event.clientY - r.startY) / zoom)) }); }}
          onPointerUp={event => { const r = resize.current; if (!r || r.pointerId !== event.pointerId) return; resize.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setSizePreview(null); if (Math.hypot(event.clientX - r.startX, event.clientY - r.startY) >= 4) resizeNode(r.id, r.width + (event.clientX - r.startX) / zoom, r.height + (event.clientY - r.startY) / zoom); }}
          onPointerCancel={() => { resize.current = null; setSizePreview(null); }} onLostPointerCapture={() => { resize.current = null; setSizePreview(null); }}
          onKeyDown={event => { const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const delta = directions[event.key]; if (delta) { event.preventDefault(); resizeNode(selectedNode.id, size.width + delta[0] * gridSize, size.height + delta[1] * gridSize); } }}>
          <span aria-hidden="true" className="text-xs leading-none">◢</span></button>; })()}
        {dropTarget && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full" style={{ overflow: 'visible' }}>{dropTarget.choices.map(port => <circle key={port.side} data-diagram-drop-side={port.side} cx={port.x} cy={port.y} r={port.side === dropTarget.port.side ? 8 : 5} fill={port.side === dropTarget.port.side ? '#3b82f6' : '#fff'} stroke="#3b82f6" strokeWidth="2" />)}</svg>}
        {!readOnly && nodes.filter(node => !nodeDisabled(node)).flatMap(node => portsFor(node).map(port => <button key={`${node.id}-${port.side}`} type="button" data-diagram-port={port.side} data-diagram-port-node={node.id} aria-label={`Connect from ${node.title}, ${port.side}`} title={`Connect from ${node.title}`} {...handleGesture({ kind: 'create', sourceId: node.id, outcome: 'unknown', side: port.side })} onPointerEnter={() => setHoveredNode(node.id)} onPointerLeave={event => { if (!(event.relatedTarget instanceof Element) || (event.relatedTarget.getAttribute('data-diagram-node') !== node.id && event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id)) setHoveredNode(null); }} onFocus={() => setHoveredNode(node.id)} onBlur={event => { if (!(event.relatedTarget instanceof Element) || (event.relatedTarget.getAttribute('data-diagram-node') !== node.id && event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id)) setHoveredNode(null); }} className="absolute rounded-full border-2 border-white bg-slate-500 shadow-md transition-opacity hover:bg-blue-500 focus-visible:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400" style={{ left: port.x - 8, top: port.y - 8, width: 16, height: 16, touchAction: 'none', opacity: hoveredNode === node.id || connectionDrag?.gesture.kind === 'create' && connectionDrag.gesture.sourceId === node.id ? 1 : 0, pointerEvents: hoveredNode === node.id ? 'auto' : 'none' }} />))}
        {!readOnly && routes.filter(({ edge }) => edge.id === selectedEdge).flatMap(({ edge, route }) => (['source', 'target'] as const).map((endpoint, i) => { const point = i ? route.points[route.points.length - 1] : route.points[0]; return <button key={`${edge.id}-${endpoint}`} type="button" data-diagram-endpoint={endpoint} aria-label={`Change ${endpoint} of ${edge.outcome} connection from ${byId.get(edge.sourceId)?.title} to ${byId.get(edge.targetId)?.title}`} title={`Change ${endpoint}`} {...handleGesture({ kind: 'reconnect', edgeId: edge.id, endpoint })} className="absolute rounded-full border-2 border-blue-600 bg-white shadow focus-visible:outline focus-visible:outline-2" style={{ left: point.x - 9, top: point.y - 9, width: 18, height: 18, touchAction: 'none' }} />; }))}
      </div>
    </div></div>
    <DiagramFlowControls readOnly={readOnly} canNode={!!selectedNode} canDelete={!!selected || !!selectedEdge} canUndo={!!history.past.length} canRedo={!!history.future.length} outcome={selectedConnection?.outcome} zoom={zoom}
      onAdd={() => add(undefined, false)} onBranch={() => selectedNode && add(selectedNode, false)} onChild={() => selectedNode && add(selectedNode, true)}
      onConnect={() => selectedNode && setConnecting({ kind: 'create', sourceId: selectedNode.id, outcome: 'unknown' })}
      onAlign={() => {
        const aligned = graph.nodes.map(n => ({ ...n, position: { x: snap(n.position.x), y: snap(n.position.y) } }));
        if (aligned.some((a, i) => aligned.some((b, j) => { const x = nodeSize(a), y = nodeSize(b); return i !== j && a.position.x < b.position.x + y.width + 16 && a.position.x + x.width + 16 > b.position.x && a.position.y < b.position.y + y.height + 16 && a.position.y + x.height + 16 > b.position.y; }))) { setNotice('Alignment would overlap steps.'); return; }
        setNotice(''); commit({ type: 'replace', graph: { ...graph, nodes: aligned } });
      }}
      onUndo={() => travel('undo')} onRedo={() => travel('redo')}
      onDelete={() => { if (selectedEdge) commit({ type: 'remove-connection', id: selectedEdge }); else if (selected) commit({ type: 'remove-node', id: selected }); setSelected(null); setSelectedEdge(null); }}
      onOutcome={outcome => { if (selectedConnection) commit({ type: 'update-connection', connection: { ...selectedConnection, outcome } }); }}
      onFit={fitDiagram} onZoomIn={() => setZoom(z => Math.min(2, z * 1.25))} onZoomOut={() => setZoom(z => Math.max(.1, z * .8))} />
    </div>
  </div>;
}

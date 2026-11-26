import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { routeBetween, routePolyline, routeCrossings, type Box, type PortSide } from './router';
import Panel, { type PanelProps } from '../Panel';
import Button from '../Button';
import '../NetworkGraph/network-graph.css';
import ScrollArea from '../ScrollArea';
import GridBackground, { type GridBackgroundProps } from '../GridBackground';
import ProgressSpinner from '../ProgressSpinner';
import DotStepper from '../DotStepper';
import DiagramFlowControls from './DiagramFlowControls';
import { placeDiagramCaptions } from './captions';
import ConnectionFlowNodeBody from '../ConnectionFlow/ConnectionFlowNodeBody';
import { DEFAULT_LAYOUT_OPTIONS, NODE_METRICS, dotTiming, measureNode, nodeTone, routeLength, type ConnectionFlowItemProgress, type ConnectionFlowNode, type ConnectionFlowProgressType, type LaidOutNode } from '../../connectionFlow';
import { getSurfaceHoverTokens, type ControlSize, type SurfaceTone, type SurfaceVariant } from '../../theme/Theme';
import { useKitT } from '../../i18n';
import { DIAGRAM_SIDES, alignedDiagramPorts, freeDiagramPort, nearestDiagramSide, type DiagramPort } from './ports';
import { applyDiagramFlowOperation, validateDiagramFlow, type DiagramFlowConnection, type DiagramFlowConnectorStyle, type DiagramFlowGraph, type DiagramFlowNode, type DiagramFlowOperation, type DiagramFlowOutcome, type DiagramFlowPanelProps } from './model';

export type DiagramFlowGridProps = Pick<GridBackgroundProps, 'pattern' | 'lineColor' | 'dotSize' | 'opacity' | 'fade' | 'fadeStart'>;

export interface DiagramFlowInspectorHelpers {
  /** True when changes are disabled, including on individually disabled nodes. */
  readOnly: boolean;
  /** Apply a validated node update through onChange and the undo history. */
  updateNode: (patch: Partial<Omit<DiagramFlowNode, 'id'>>) => boolean;
  close: () => void;
  centerOnNode: () => void;
}

export interface DiagramFlowProps extends Omit<PanelProps, 'children' | 'onChange' | 'onClick' | 'height' | 'size' | 'clickable' | 'scrollable'> {
  graph: DiagramFlowGraph;
  onChange: (graph: DiagramFlowGraph, operation: DiagramFlowOperation) => void;
  onConnectionEdit?: (connection: DiagramFlowConnection) => void;
  onNodeEdit?: (node: DiagramFlowNode) => void;
  /** Render custom content below the standard body. Return undefined to use node.body. */
  renderNodeBody?: (node: DiagramFlowNode) => ReactNode;
  /** Called when a node is clicked, including when it is a connection target. */
  onNodeClick?: (node: DiagramFlowNode) => void;
  /** Called when a connection is selected by click or keyboard. */
  onConnectionClick?: (connection: DiagramFlowConnection) => void;
  /** Reports a successful connection request after onChange. */
  onConnect?: (connection: DiagramFlowConnection) => void;
  /** Reports a successful endpoint change after onChange. */
  onReconnect?: (previous: DiagramFlowConnection, next: DiagramFlowConnection) => void;
  /** Called after an atomic node creation request, including its optional connection. */
  onNodeCreate?: (node: DiagramFlowNode, connection?: DiagramFlowConnection) => void;
  /** Show an inspector when a node is selected. @default false */
  inspector?: boolean;
  inspectorTitle?: ReactNode;
  /** Width of the inspector in pixels, clamped to 180–480. @default 280 */
  inspectorWidth?: number;
  /** Stack the inspector below the diagram under this width. @default 320 */
  inspectorStackBelow?: number;
  inspectorVariant?: 'auto' | NonNullable<PanelProps['variant']>;
  inspectorTone?: 'auto' | SurfaceTone;
  /** Replace the inspector's connection list with application-owned content. */
  renderInspectorBody?: (node: DiagramFlowNode, helpers: DiagramFlowInspectorHelpers) => ReactNode;
  /** Replace the inspector's footer actions. */
  renderInspectorActions?: (node: DiagramFlowNode, helpers: DiagramFlowInspectorHelpers) => ReactNode;
  height?: number;
  /** Spacing for both snapping and the background lattice. @default 20 */
  gridSize?: number;
  /** Terminal appearance for connections. Individual connections can override it. @default 'bulb' */
  connectorStyle?: DiagramFlowConnectorStyle;
  /** Show the background lattice or customize its appearance. @default true */
  grid?: boolean | DiagramFlowGridProps;
  /** Disable editing while allowing navigation and selection. @default true */
  readOnly?: boolean;
  /** Create a connected node when a connector is dropped in empty space. @default true */
  autoCreate?: boolean;
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
const STATUS_KEYS = { pending: 'kit.diagramFlow.statusPending', running: 'kit.diagramFlow.statusRunning', succeeded: 'kit.diagramFlow.statusSucceeded', failed: 'kit.diagramFlow.statusFailed', skipped: 'kit.diagramFlow.statusSkipped' } as const;
const SIDE_KEYS = { top: 'kit.diagramFlow.top', right: 'kit.diagramFlow.right', bottom: 'kit.diagramFlow.bottom', left: 'kit.diagramFlow.left' } as const;
/** Convert the Panel's hover token into a CSS color for a terminal surface. */
function terminalHoverColors(variant: SurfaceVariant, tone: SurfaceTone, kind: 'wash' | 'rim' = 'wash') {
  const prefix = kind === 'wash' ? 'bg' : 'border';
  const colors = getSurfaceHoverTokens(variant, tone)[kind].match(new RegExp(`${prefix}-([a-z]+)-(\\d+)(?:\\/(\\d+))?`, 'g')) ?? [];
  return colors.map(value => {
    const match = new RegExp(`^${prefix}-([a-z]+)-(\\d+)(?:\\/(\\d+))?$`).exec(value);
    return match ? { color: `var(--color-${match[1]}-${match[2]})`, alpha: `${match[3] ?? 100}%`, paint: `color-mix(in srgb, var(--color-${match[1]}-${match[2]}) ${match[3] ?? 100}%, transparent)` } : undefined;
  });
}
const ENDPOINT_KEYS = { source: 'kit.diagramFlow.source', target: 'kit.diagramFlow.target' } as const;

/** Controlled diagram editor; the application owns execution and persistence. */
type ConnectionGesture = { kind: 'create'; sourceId: string; outcome: DiagramFlowOutcome; side?: PortSide } | { kind: 'reconnect'; edgeId: string; endpoint: 'source' | 'target' };
type PointerConnection = { gesture: ConnectionGesture; pointerId: number; x: number; y: number; startX: number; startY: number };

export default function DiagramFlow({ graph, onChange, onConnectionEdit, onNodeEdit, renderNodeBody, onNodeClick, onConnectionClick, onConnect, onReconnect, onNodeCreate, inspector = false, inspectorTitle, inspectorWidth = 280, inspectorStackBelow = 320, inspectorVariant = 'auto', inspectorTone = 'auto', renderInspectorBody, renderInspectorActions, height = 560, gridSize = 20, grid = true, connectorStyle = 'bulb', readOnly = true, autoCreate = true, nodePanelProps, animated = true, dotSpeed = 120, dotInterval = 700, size = 'md', progressType = 'bar', itemProgress = 'bar', maxVisibleItems = 2, className, style, variant = 'outlined', tone = 'none', padding = 'none', ...surfaceProps }: DiagramFlowProps) {
  const t = useKitT();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const inspectorLayout = useRef<HTMLDivElement>(null);
  const [inspectorStacked, setInspectorStacked] = useState(false);
  useEffect(() => {
    const element = inspectorLayout.current;
    if (!element || !inspector) return;
    const measure = () => setInspectorStacked(element.getBoundingClientRect().width < inspectorStackBelow);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [inspector, inspectorStackBelow]);
  const viewport = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const hoveredNode = useRef<string | null>(null);
  const [connecting, setConnecting] = useState<ConnectionGesture | null>(null);
  const [connectionDrag, setConnectionDrag] = useState<PointerConnection | null>(null);
  const connectionDragRef = useRef<PointerConnection | null>(null);
  const suppressClick = useRef(false);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const pendingZoomScroll = useRef<{ left: number; top: number } | null>(null);
  const pan = useRef<{ pointerId: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressPanClick = useRef(false);
  const [panning, setPanning] = useState(false);
  const [history, setHistory] = useState<{ past: DiagramFlowGraph[]; future: DiagramFlowGraph[] }>({ past: [], future: [] });
  const lastGraph = useRef(graph);
  const expectedGraph = useRef<DiagramFlowGraph | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; original: { x: number; y: number }; moved: boolean } | null>(null);
  const [preview, setPreview] = useState<{ id: string; x: number; y: number } | null>(null);
  const [sizePreview, setSizePreview] = useState<{ id: string; width: number; height: number } | null>(null);
  const resize = useRef<{ id: string; pointerId: number; startX: number; startY: number; width: number; height: number } | null>(null);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [notice, setNotice] = useState('');
  const locked = !!surfaceProps.disabled || !!surfaceProps.loading;
  const editDisabled = readOnly || locked;
  // Hover changes only decoration. Updating it directly avoids reconciling
  // every node and connector on pointer movement through a large diagram.
  const setHoveredNode = (id: string | null, force = false) => {
    if (!force && hoveredNode.current === id) return;
    hoveredNode.current = id;
    const activeDrag = connectionDragRef.current;
    canvas.current?.querySelectorAll<HTMLElement | SVGElement>('[data-diagram-terminal-node], [data-diagram-terminal-dot-node], [data-diagram-port-node]').forEach(element => {
      const terminalNode = element.getAttribute('data-diagram-terminal-node');
      const dotNode = element.getAttribute('data-diagram-terminal-dot-node');
      const portNode = element.getAttribute('data-diagram-port-node');
      if (terminalNode !== null) { if (terminalNode === id && element.hasAttribute('data-hover-enabled')) element.setAttribute('data-hovered', 'true'); else element.removeAttribute('data-hovered'); }
      if (dotNode !== null) { if (dotNode === id && element.hasAttribute('data-contrast-enabled')) element.setAttribute('data-contrast', 'true'); else element.removeAttribute('data-contrast'); }
      if (portNode !== null) {
        const isHovered = portNode === id;
        const isDragSource = activeDrag?.gesture.kind === 'create' && activeDrag.gesture.sourceId === portNode;
        element.style.opacity = isHovered || isDragSource ? '1' : '0';
        element.style.pointerEvents = isHovered ? 'auto' : 'none';
      }
    });
  };
  useLayoutEffect(() => {
    if (hoveredNode.current !== null) setHoveredNode(hoveredNode.current, true);
  });
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
    if (editDisabled) { setConnecting(null); connectionDragRef.current = null; setConnectionDrag(null); drag.current = null; setPreview(null); resize.current = null; setSizePreview(null); }
  }, [editDisabled]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && event.target instanceof Node && root.current?.contains(event.target)) {
        setConnecting(null); connectionDragRef.current = null; setConnectionDrag(null); resize.current = null; setSizePreview(null); setSelected(null); setSelectedEdge(null);
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  useLayoutEffect(() => {
    const view = viewport.current;
    const target = pendingZoomScroll.current;
    if (view && target) {
      view.scrollLeft = target.left;
      view.scrollTop = target.top;
      pendingZoomScroll.current = null;
    }
  }, [zoom]);
  useEffect(() => {
    const view = viewport.current;
    if (!view || locked) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const previous = zoomRef.current;
      const next = Math.max(.1, Math.min(2, previous * Math.exp(-Math.max(-100, Math.min(100, event.deltaY)) * .008)));
      if (next === previous) return;
      const rect = view.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const scroll = pendingZoomScroll.current ?? { left: view.scrollLeft, top: view.scrollTop };
      pendingZoomScroll.current = { left: (scroll.left + x) * next / previous - x, top: (scroll.top + y) * next / previous - y };
      zoomRef.current = next;
      setZoom(next);
    };
    view.addEventListener('wheel', wheel, { passive: false });
    return () => view.removeEventListener('wheel', wheel);
  }, [locked]);
  useEffect(() => {
    const view = viewport.current;
    if (!view || locked) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target !== view || event.altKey || event.ctrlKey || event.metaKey) return;
      const moves: Record<string, [number, number]> = { ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -40], ArrowDown: [0, 40], PageUp: [0, -view.clientHeight], PageDown: [0, view.clientHeight] };
      const delta = moves[event.key];
      if (delta) { event.preventDefault(); view.scrollLeft += delta[0]; view.scrollTop += delta[1]; }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); view.scrollTop = event.key === 'Home' ? 0 : view.scrollHeight; }
    };
    view.addEventListener('keydown', onKeyDown);
    return () => view.removeEventListener('keydown', onKeyDown);
  }, [locked]);
  useEffect(() => {
    if (locked) { pan.current = null; setPanning(false); setHoveredNode(null); }
  }, [locked]);
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
  const spacing = Number.isFinite(gridSize) ? Math.max(1, gridSize) : 20;
  const snap = (value: number) => Math.round(value / spacing) * spacing;
  const nextId = (prefix: string) => { let id: string; do { id = `${prefix}-${uid}-${++sequence.current}`; } while (graph.nodes.some(n => n.id === id) || graph.connections.some(e => e.id === id)); return id; };
  const commit = (operation: DiagramFlowOperation) => {
    const next = applyDiagramFlowOperation(graph, operation);
    if (!next) return false;
    setHistory(h => ({ past: [...h.past.slice(-49), graph], future: [] }));
    expectedGraph.current = next;
    onChange(next, operation);
    if (operation.type === 'connect') onConnect?.(operation.connection);
    if (operation.type === 'create' && operation.connection) onConnect?.(operation.connection);
    if (operation.type === 'create') onNodeCreate?.(operation.node, operation.connection);
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
      setNotice(t('kit.diagramFlow.overlapPosition'));
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
      setNotice(t('kit.diagramFlow.overlapSize')); return;
    }
    setNotice('');
    commit({ type: 'update-node', node: { ...node, width: nextWidth, height: nextHeight } });
  };
  const add = (source: DiagramFlowNode | undefined, child: boolean) => {
    const id = nextId('node');
    let x = source ? source.position.x + (child ? 40 : 260) : 0;
    let y = source ? source.position.y + (child ? 140 : 120) : 0;
    while (graph.nodes.some(n => { const size = nodeSize(n); return x < n.position.x + size.width + 20 && x + WIDTH + 20 > n.position.x && y < n.position.y + size.height + 20 && y + HEIGHT + 20 > n.position.y; })) y += 120;
    const node: DiagramFlowNode = { id, title: t('kit.diagramFlow.newStep'), position: { x: snap(x), y: snap(y) }, ...(child && source ? { parentId: source.id } : source?.parentId ? { parentId: source.parentId } : {}) };
    const connection: DiagramFlowConnection | undefined = source && !child ? { id: nextId('edge'), sourceId: source.id, targetId: id, outcome: 'unknown' } : undefined;
    commit({ type: 'create', node, connection }); setSelected(id); setSelectedEdge(null);
  };
  const finishConnection = (gesture: ConnectionGesture, nodeId: string, side?: PortSide) => {
    if (gesture.kind === 'create') {
      if (gesture.sourceId === nodeId) { setNotice(t('kit.diagramFlow.selfConnect')); return; }
      if (commit({ type: 'connect', connection: { id: nextId('edge'), sourceId: gesture.sourceId, targetId: nodeId, outcome: gesture.outcome, ...(gesture.side ? { fromSide: gesture.side } : {}), ...(side ? { toSide: side } : {}) } })) setNotice('');
    } else {
      const edge = graph.connections.find(e => e.id === gesture.edgeId);
      if (!edge) return;
      const updated = { ...edge, [gesture.endpoint === 'source' ? 'sourceId' : 'targetId']: nodeId, ...(side ? { [gesture.endpoint === 'source' ? 'fromSide' : 'toSide']: side } : {}) };
      if (updated.sourceId === updated.targetId) { setNotice(t('kit.diagramFlow.selfConnect')); return; }
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
    const laidOut = graph.connections.flatMap(edge => {
      const from = byId.get(edge.sourceId), to = byId.get(edge.targetId);
      if (!from || !to || from.id === to.id) return [];
      const a = box(from), b = box(to), dx = b.x - a.x, dy = b.y - a.y;
      const sides: [PortSide, PortSide] = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? ['right', 'left'] : ['left', 'right']) : (dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom']);
      const findPort = (box: Box, side: PortSide, used: DiagramPort[]) =>
        [side, ...DIAGRAM_SIDES.filter(s => s !== side)].map(s => freeDiagramPort(box, s, used)).find(p => p !== null);
      const fromUsed = allocations.get(from.id) ?? [], toUsed = allocations.get(to.id) ?? [];
      const initialFrom = findPort(a, edge.fromSide ?? sides[0], fromUsed);
      const initialTo = findPort(b, edge.toSide ?? sides[1], toUsed);
      if (!initialFrom || !initialTo) return [];
      const [fromPort, toPort] = alignedDiagramPorts(a, initialFrom.side, fromUsed, b, initialTo.side, toUsed) ?? [initialFrom, initialTo];
      const route = routeBetween({ box: a, t: fromPort.t, sides: [fromPort.side] }, { box: b, t: toPort.t, sides: [toPort.side] }, obstacles, { style: 'orthogonal', clearance: 12, stub: 22, radius: 8, strictObstacles: true, occupied });
      if (!route) return [];
      occupied.push(route.points);
      allocations.set(from.id, [...(allocations.get(from.id) ?? []), fromPort]);
      allocations.set(to.id, [...(allocations.get(to.id) ?? []), toPort]);
      return [{ edge, route, fromPort, toPort }];
    });
    const hops = routeCrossings(laidOut.map(({ edge, route }) => ({ id: edge.id, points: route.points, style: 'orthogonal' as const })), { cornerRadius: 8 });
    return laidOut.map(item => ({ ...item, route: { ...item.route, d: hops.get(item.edge.id) ?? item.route.d } }));
  }, [nodes, byId, graph.connections, offsetX, offsetY, nodePanelProps, sizePreview, expanded, layoutOptions]);
  const bulbPorts = useMemo(() => {
    const map = new Map<string, DiagramPort[]>();
    for (const { edge, fromPort, toPort } of routes) {
      if ((edge.connectorStyle ?? connectorStyle) !== 'bulb') continue;
      map.set(edge.sourceId, [...(map.get(edge.sourceId) ?? []), fromPort]);
      map.set(edge.targetId, [...(map.get(edge.targetId) ?? []), toPort]);
    }
    return map;
  }, [routes, connectorStyle]);
  const maskId = (index: number) => `${uid}-terminal-mask-${index}`;
  const dotGroups = useMemo(() => {
    const groups = new Map<string, typeof routes>();
    for (const route of routes) if (animated && route.edge.animated) groups.set(route.edge.sourceId, [...(groups.get(route.edge.sourceId) ?? []), route]);
    return groups;
  }, [routes, animated]);
  const captions = useMemo(() => placeDiagramCaptions(routes.map(r => ({ id: r.edge.id, text: r.edge.label || r.edge.conditionLabel || '', points: r.route.points })), nodes.map(n => ({ x: n.position.x + offsetX, y: n.position.y + offsetY, ...nodeSize(n) }))), [routes, nodes, offsetX, offsetY, nodePanelProps, sizePreview, expanded, layoutOptions]);
  const canvasWidth = Math.max(width, ...Array.from(captions.values(), caption => caption.x + caption.width + 40));
  const canvasHeightWithCaptions = Math.max(canvasHeight, ...Array.from(captions.values(), caption => caption.y + caption.height + 40));
  const nodeBox = (node: DiagramFlowNode): Box => ({ x: node.position.x + offsetX, y: node.position.y + offsetY, ...nodeSize(node) });
  const nodeDisabled = (node: DiagramFlowNode) => locked || (node.panelProps?.disabled ?? nodePanelProps?.disabled ?? false);
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
  const createCandidate = (point: { x: number; y: number }, gesture: ConnectionGesture) => {
    if (!autoCreate || editDisabled || gesture.kind !== 'create') return null;
    const source = graph.nodes.find(node => node.id === gesture.sourceId);
    if (!source || nodeDisabled(source)) return null;
    const node: DiagramFlowNode = { id: '', title: t('kit.diagramFlow.newStep'), position: { x: snap(point.x - offsetX - WIDTH / 2), y: snap(point.y - offsetY - HEIGHT / 2) }, ...(source.parentId ? { parentId: source.parentId } : {}) };
    const size = nodeSize(node);
    const blocked = graph.nodes.some(existing => { const other = nodeSize(existing); return node.position.x < existing.position.x + other.width + 16 && node.position.x + size.width + 16 > existing.position.x && node.position.y < existing.position.y + other.height + 16 && node.position.y + size.height + 16 > existing.position.y; });
    return { node, source, size, blocked };
  };
  const createAt = (point: { x: number; y: number }, gesture: ConnectionGesture) => {
    const candidate = createCandidate(point, gesture);
    if (!candidate || gesture.kind !== 'create') return false;
    if (candidate.blocked) {
      setNotice(t('kit.diagramFlow.noSpace')); return true;
    }
    const id = nextId('node');
    const node = { ...candidate.node, id };
    const connection: DiagramFlowConnection = { id: nextId('edge'), sourceId: candidate.source.id, targetId: id, outcome: gesture.outcome, ...(gesture.side ? { fromSide: gesture.side } : {}) };
    if (commit({ type: 'create', node, connection })) { setSelected(id); setSelectedEdge(null); setNotice(''); }
    return true;
  };
  const handleGesture = (gesture: ConnectionGesture) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (editDisabled || event.button !== 0) return;
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
      else if (!point || !createAt(point, active.gesture)) setNotice(t('kit.diagramFlow.canceled'));
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
  const createPreview = connectionDrag && !dropTarget ? createCandidate(connectionDrag, connectionDrag.gesture) : null;
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
  const inspectorHelpers: DiagramFlowInspectorHelpers | undefined = selectedNode ? {
    readOnly: editDisabled || nodeDisabled(selectedNode),
    updateNode: patch => !editDisabled && !nodeDisabled(selectedNode) && commit({ type: 'update-node', node: { ...selectedNode, ...patch, id: selectedNode.id } }),
    close: () => setSelected(null),
    centerOnNode: () => {
      const view = viewport.current;
      if (!view) return;
      const dimensions = nodeSize(selectedNode);
      view.scrollLeft = (selectedNode.position.x + offsetX + dimensions.width / 2) * zoom - view.clientWidth / 2;
      view.scrollTop = (selectedNode.position.y + offsetY + dimensions.height / 2) * zoom - view.clientHeight / 2;
    },
  } : undefined;
  const selectedConnection = graph.connections.find(edge => edge.id === selectedEdge);
  const activateNode = (node: DiagramFlowNode) => {
    if (locked) return;
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
  return <div ref={inspectorLayout} className={[inspector && 'cj-network-graph', inspector && selectedNode && 'cj-network-graph--inspector-open', inspector && inspectorStacked && 'cj-network-graph--stacked'].filter(Boolean).join(' ')} style={inspector ? { '--cj-network-graph-inspector-width': `${Math.max(180, Math.min(480, Number.isFinite(inspectorWidth) ? inspectorWidth : 280))}px` } as React.CSSProperties : undefined}>
    <div className="cj-network-graph__main">
    <Panel {...surfaceProps} ref={root} aria-label={surfaceProps['aria-label'] ?? t('kit.diagramFlow.name')} data-diagram-flow variant={variant} tone={tone} padding={padding} clickable={false} scrollable={false} className={`overflow-hidden ${className ?? ''}`} style={style}>
    <style>{`[data-diagram-flow]{--diagram-caption-fill:var(--color-neutral-100,#f5f5f5);--diagram-caption-text:var(--color-neutral-700,#404040)} .dark [data-diagram-flow]{--diagram-caption-fill:var(--color-neutral-800,#262626);--diagram-caption-text:var(--color-neutral-100,#f5f5f5)} [data-diagram-terminal][data-hovered][data-tinted]{--ui-surface-color:var(--terminal-light-color);--ui-surface-alpha:var(--terminal-light-alpha)} [data-diagram-terminal][data-hovered][data-tinted]:not(.ui-surface-fill){background-color:var(--terminal-hover-light)} [data-diagram-terminal][data-hovered][data-hover-rim]{border-color:var(--terminal-rim-light)} .dark [data-diagram-terminal][data-hovered][data-hover-rim]{border-color:var(--terminal-rim-dark)} .dark [data-diagram-terminal][data-hovered][data-tinted]{--ui-surface-color:var(--terminal-dark-color);--ui-surface-alpha:var(--terminal-dark-alpha)} .dark [data-diagram-terminal][data-hovered][data-tinted]:not(.ui-surface-fill){background-color:var(--terminal-hover-dark)} [data-diagram-terminal][data-hovered]:not([data-tinted]) [data-terminal-hover-overlay]{background-color:rgb(0 0 0 / .045)} .dark [data-diagram-terminal][data-hovered]:not([data-tinted]) [data-terminal-hover-overlay]{background-color:rgb(255 255 255 / .1)} [data-diagram-terminal-dot][data-contrast][data-outcome=success]{fill:#065f46} .dark [data-diagram-terminal-dot][data-contrast][data-outcome=success]{fill:#a7f3d0} [data-diagram-terminal-dot][data-contrast][data-outcome=failure]{fill:#9f1239} .dark [data-diagram-terminal-dot][data-contrast][data-outcome=failure]{fill:#fecdd3} [data-diagram-terminal-dot][data-contrast][data-outcome=unknown]{fill:#1e293b} .dark [data-diagram-terminal-dot][data-contrast][data-outcome=unknown]{fill:#e2e8f0}`}</style>
    <div className="relative"><div role="status" className={errors.length || notice || routes.length < graph.connections.length ? 'absolute left-3 top-3 z-30 max-w-[calc(100%-1.5rem)] rounded-md border border-neutral-300 bg-white/95 px-3 py-2 text-xs text-neutral-700 shadow-sm dark:border-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-200' : 'sr-only'}>{errors.length ? t('kit.diagramFlow.invalid', { errors: errors.join('; ') }) : notice || (routes.length < graph.connections.length ? t('kit.diagramFlow.unroutable') : connecting ? t('kit.diagramFlow.chooseTarget') : t('kit.diagramFlow.instructions'))}</div><ScrollArea viewportRef={viewport} viewportClassName="!overflow-hidden" gutter={false} contentClassName="block" style={{ height }}><div style={{ width: canvasWidth * zoom, height: canvasHeightWithCaptions * zoom, position: 'relative' }}>
      <div ref={canvas} style={{ position: 'absolute', width: canvasWidth, height: canvasHeightWithCaptions, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        {grid !== false && <GridBackground data-diagram-grid aria-hidden="true" pattern="dots" lineColor="#a3a3a3" dotSize={.7} opacity={.7} {...(typeof grid === 'object' ? grid : {})} size={spacing} style={{ inset: 'auto', left: (offsetX % spacing) - spacing, top: (offsetY % spacing) - spacing, right: 0, bottom: 0 }} />}
        <button type="button" tabIndex={-1} aria-label={t('kit.diagramFlow.clear')} disabled={locked}
          onPointerDown={event => { const view = viewport.current; if (locked || event.button !== 0 || !view || pan.current) return; event.currentTarget.setPointerCapture(event.pointerId); pan.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: view.scrollLeft, top: view.scrollTop, moved: false }; }}
          onPointerMove={event => { const current = pan.current, view = viewport.current; if (!current || current.pointerId !== event.pointerId || !view || locked) return; const dx = event.clientX - current.x, dy = event.clientY - current.y; if (!current.moved && Math.hypot(dx, dy) <= 4) return; current.moved = true; setPanning(true); view.scrollLeft = current.left - dx; view.scrollTop = current.top - dy; }}
          onPointerUp={event => { const current = pan.current; if (!current || current.pointerId !== event.pointerId) return; pan.current = null; setPanning(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (current.moved) { suppressPanClick.current = true; setTimeout(() => { suppressPanClick.current = false; }, 0); } }}
          onPointerCancel={() => { pan.current = null; setPanning(false); }} onLostPointerCapture={() => { pan.current = null; setPanning(false); }}
          onClick={() => { if (suppressPanClick.current) { suppressPanClick.current = false; return; } setSelected(null); setSelectedEdge(null); setConnecting(null); setNotice(''); }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, padding: 0, background: 'transparent', cursor: panning ? 'grabbing' : 'default', touchAction: locked ? 'auto' : 'none' }} />
        <svg aria-label={t('kit.diagramFlow.connections')} style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker></defs>
          {routes.map(({ edge, route }) => <g key={edge.id}>
            {selectedEdge === edge.id && <path d={route.d} fill="none" stroke="#60a5fa" strokeWidth="8" opacity=".35" pointerEvents="none" />}
            <path d={route.d} fill="none" stroke="transparent" strokeWidth="12" pointerEvents="stroke" style={{ outline: 'none', cursor: 'pointer' }} tabIndex={locked ? -1 : 0} role="button" aria-label={t('kit.diagramFlow.edgeLabel', { outcome: t(`kit.diagramFlow.${edge.outcome}`).toLocaleLowerCase(), source: byId.get(edge.sourceId)?.title ?? edge.sourceId, target: byId.get(edge.targetId)?.title ?? edge.targetId, label: edge.label || edge.conditionLabel ? `, ${edge.label || edge.conditionLabel}` : '' })} onClick={() => { if (locked) return; setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); }} onKeyDown={e => { if (locked) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); } else if (!editDisabled && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); commit({ type: 'remove-connection', id: edge.id }); setSelectedEdge(null); } }} onDoubleClick={() => { if (!locked) onConnectionEdit?.(edge); }} />
            <path d={route.d} fill="none" stroke={edge.outcome === 'failure' ? '#e11d48' : edge.outcome === 'success' ? '#059669' : '#94a3b8'} strokeWidth={selectedEdge === edge.id ? 3 : 2} strokeDasharray={edge.outcome === 'failure' ? '6 4' : undefined} markerEnd={(edge.connectorStyle ?? connectorStyle) === 'arrow' ? `url(#${uid}-arrow)` : undefined} pointerEvents="none" />
            {edge.animated && animated && (() => { const group = dotGroups.get(edge.sourceId) ?? []; const index = group.findIndex(item => item.edge.id === edge.id); const span = Math.max(1, ...group.map(item => routeLength(item.route.points))); const timing = dotTiming(routeLength(route.points), Math.max(0, index), group.length, span, dotSpeed, Math.max(1, dotInterval) / 1000); return <circle data-diagram-flow-dot={edge.id} r={3} fill={edge.outcome === 'failure' ? '#fb7185' : edge.outcome === 'success' ? '#34d399' : '#cbd5e1'} opacity={0} className="motion-reduce:hidden" pointerEvents="none"><animateMotion path={route.d} dur={`${timing.cycle.toFixed(3)}s`} begin={`${timing.begin.toFixed(3)}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1" keyTimes={`0;${timing.arrival.toFixed(4)};1`} /><animate attributeName="opacity" dur={`${timing.cycle.toFixed(3)}s`} begin={`${timing.begin.toFixed(3)}s`} repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes={`0;${timing.arrival.toFixed(4)}`} /></circle>; })()}
          </g>)}
          {routes.map(({ edge }) => { const caption = captions.get(edge.id); if (!caption) return null; return <g key={`caption-${edge.id}`} data-diagram-caption={edge.id}>
            <rect x={caption.x} y={caption.y} width={caption.width} height={caption.height} rx={5} className="stroke-neutral-300 dark:stroke-neutral-600" strokeWidth={1} pointerEvents="all" style={{ cursor: 'pointer', fill: 'var(--diagram-caption-fill, #f5f5f5)' }} onClick={() => { if (locked) return; setSelectedEdge(edge.id); setSelected(null); onConnectionClick?.(edge); }} onDoubleClick={() => { if (!locked) onConnectionEdit?.(edge); }} />
            <text x={caption.x + caption.width / 2} y={caption.y + 4 + caption.lineHeight / 2} textAnchor="middle" dominantBaseline="central" className="text-[10px]" style={{ fill: 'var(--diagram-caption-text, #404040)' }} pointerEvents="none">{caption.lines.map((line, i) => <tspan key={i} x={caption.x + caption.width / 2} dy={i === 0 ? 0 : caption.lineHeight}>{line}</tspan>)}</text>
          </g>; })}
          {previewPath && <path data-diagram-connection-preview d={previewPath} stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 4" fill="none" pointerEvents="none" />}
          {createPreview && <rect data-diagram-create-preview x={createPreview.node.position.x + offsetX} y={createPreview.node.position.y + offsetY} width={createPreview.size.width} height={createPreview.size.height} rx={12} fill={createPreview.blocked ? '#f43f5e' : '#3b82f6'} fillOpacity="0.1" stroke={createPreview.blocked ? '#f43f5e' : '#3b82f6'} strokeWidth={2} strokeDasharray="6 5" pointerEvents="none" />}
        </svg>
        <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}><defs>
          {nodes.map((node, index) => { const ports = bulbPorts.get(node.id); if (!ports?.length) return null; const box = nodeBox(node); return <mask key={node.id} id={maskId(index)} maskUnits="userSpaceOnUse" x={0} y={0} width={box.width} height={box.height}>
            <rect width={box.width} height={box.height} fill="white" />
            {ports.map((port, i) => { const x = port.x - box.x, y = port.y - box.y; return <rect key={i} fill="black" x={port.side === 'right' ? box.width - 1 : port.side === 'left' ? 0 : x - 7} y={port.side === 'bottom' ? box.height - 1 : port.side === 'top' ? 0 : y - 7} width={port.side === 'left' || port.side === 'right' ? 1 : 14} height={port.side === 'top' || port.side === 'bottom' ? 1 : 14} />; })}
          </mask>; })}
        </defs></svg>
        {routes.flatMap(({ edge, fromPort, toPort }) => (edge.connectorStyle ?? connectorStyle) !== 'bulb' ? [] : ([{ port: fromPort, node: byId.get(edge.sourceId), endpoint: 'source' }, { port: toPort, node: byId.get(edge.targetId), endpoint: 'target' }] as const).map(({ port, node, endpoint }) => {
          if (!node) return null;
          const panel = { variant: 'outlined' as const, ...nodePanelProps, ...(node.tone ? { tone: node.tone } : {}), ...node.panelProps };
          const hoverEnabled = panel.hoverable !== false && !nodeDisabled(node);
          const hovered = hoveredNode.current === node.id && hoverEnabled;
          const hue = panel.hoverColor ?? (selected === node.id ? panel.activeTone : undefined) ?? (panel.tone === 'none' ? undefined : panel.tone);
          const [light, dark] = terminalHoverColors(panel.variant, hue ?? 'none');
          const [rimLight, rimDark] = terminalHoverColors(panel.variant, hue ?? 'none', 'rim');
          return <Panel key={`${edge.id}-${endpoint}`} data-diagram-terminal={endpoint} data-diagram-terminal-node={node.id} data-hover-enabled={hoverEnabled || undefined} data-hovered={hovered || undefined} data-tinted={hue ? true : undefined} data-hover-rim={rimLight && rimDark ? true : undefined} aria-hidden="true" variant={panel.variant} tone={panel.tone} active={!!panel.active || selected === node.id || dropTarget?.node.id === node.id} activeTone={panel.activeTone} borderColor={panel.borderColor} backgroundColor={panel.backgroundColor} transparency={panel.transparency} glassOpacity={panel.glassOpacity} vibrancy={panel.vibrancy} specularMode={panel.specularMode} raisedSurface={panel.raisedSurface} padding="none" clickable={false} hoverable={false} className="!rounded-full transition-colors duration-200" style={{ position: 'absolute', left: port.x - 7, top: port.y - 7, width: 14, height: 14, pointerEvents: 'none', zIndex: 0, borderRadius: '50%', '--terminal-hover-light': light?.paint, '--terminal-hover-dark': dark?.paint, '--terminal-light-color': light?.color, '--terminal-light-alpha': light?.alpha, '--terminal-dark-color': dark?.color, '--terminal-dark-alpha': dark?.alpha, '--terminal-rim-light': rimLight?.paint, '--terminal-rim-dark': rimDark?.paint } as React.CSSProperties}><span data-terminal-hover-overlay aria-hidden="true" className="transition-colors duration-200" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none' }} /></Panel>;
        }))}
        {nodes.map((node, index) => { const panel = { variant: 'outlined' as const, padding: 'sm' as const, ...nodePanelProps, ...(node.tone ? { tone: node.tone } : {}), ...node.panelProps }; const dimensions = nodeSize(node); const renderedBody = renderNodeBody?.(node); const customBody = renderedBody === undefined ? node.body : renderedBody; const hasCustomBody = customBody !== null && customBody !== undefined && customBody !== false; const flowNode: ConnectionFlowNode = node; const stepperReadOnly = node.dotStepper?.readOnly ?? !(node.dotStepper?.onStepSelect || node.dotStepper?.renderActiveContent); const hasControls = hasCustomBody || (!!node.dotStepper && !stepperReadOnly) || (node.items?.length ?? 0) > (node.maxItems ?? maxVisibleItems) || expanded.has(node.id); const laid: LaidOutNode = { id: node.id, node: flowNode, outline: '', x: node.position.x, y: node.position.y, ...dimensions, anchorY: dimensions.height / 2, column: 0, depth: 0, tone: nodeTone(flowNode), scrollable: true }; return <Panel key={node.id} {...panel} disabled={nodeDisabled(node)} clickable={hasControls ? false : panel.clickable} role={hasControls ? 'group' : undefined} tabIndex={hasControls ? (nodeDisabled(node) ? -1 : 0) : undefined} data-diagram-node={node.id} aria-label={t('kit.diagramFlow.nodeLabel', { title: node.title, status: t(STATUS_KEYS[node.status ?? 'pending']), join: node.join === 'all' ? `, ${t(node.joinReady ? 'kit.diagramFlow.joinReady' : 'kit.diagramFlow.joinWaiting').toLocaleLowerCase()}` : '' })} aria-pressed={hasControls ? undefined : selected === node.id} active={!!panel.active || selected === node.id || dropTarget?.node.id === node.id} onPointerEnter={() => setHoveredNode(node.id)} onPointerLeave={event => { if (!(event.relatedTarget instanceof Element) || event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id) setHoveredNode(null); }} onFocus={() => setHoveredNode(node.id)} onBlur={event => { if (!(event.relatedTarget instanceof Element) || event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id) setHoveredNode(null); }} onClick={() => activateNode(node)} onDoubleClick={() => { if (!locked) onNodeEdit?.(node); }}
          onPointerDown={event => { if (editDisabled || connecting || event.button !== 0 || (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [data-no-drag]'))) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: node.id, x: event.clientX, y: event.clientY, original: node.position, moved: false }; }}
          onPointerMove={event => { const d = drag.current; if (!d || d.id !== node.id) return; const dx = (event.clientX - d.x) / zoom, dy = (event.clientY - d.y) / zoom; if (Math.hypot(dx, dy) < 4 && !d.moved) return; d.moved = true; setPreview({ id: node.id, x: snap(d.original.x + dx), y: snap(d.original.y + dy) }); }}
          onPointerUp={event => { const d = drag.current; drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (d?.moved) { suppressClick.current = true; setTimeout(() => { suppressClick.current = false; }, 0); move(node.id, { x: snap(d.original.x + (event.clientX - d.x) / zoom), y: snap(d.original.y + (event.clientY - d.y) / zoom) }); } setPreview(null); }}
          onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); return; } if (editDisabled || connecting) return; const delta: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const direction = delta[event.key]; if (direction) { event.preventDefault(); move(node.id, { x: snap(node.position.x + direction[0] * spacing), y: snap(node.position.y + direction[1] * spacing) }); } }}
          onPointerCancel={() => { drag.current = null; setPreview(null); }}
          className={`text-left ${dropTarget?.node.id === node.id ? 'ring-4 ring-blue-400/60 ring-offset-2' : ''} ${panel.className ?? ''}`}
          style={{ ...panel.style, position: 'absolute', left: node.position.x + offsetX, top: node.position.y + offsetY, ...nodeSize(node), ...(bulbPorts.has(node.id) ? { maskImage: `url(#${maskId(index)})`, WebkitMaskImage: `url(#${maskId(index)})` } : {}), touchAction: 'none' }}>
          {hasControls && <button type="button" disabled={nodeDisabled(node)} className="sr-only focus:not-sr-only" onClick={event => { event.stopPropagation(); activateNode(node); }}>{t('kit.diagramFlow.selectNode', { title: node.title })}</button>}
          <div className="flex h-full min-h-0 gap-2 overflow-y-auto">
            <div className="min-w-0 flex-1"><ConnectionFlowNodeBody node={laid} metrics={NODE_METRICS[size]} options={layoutOptions} scrollable expanded={expanded} moreLabel={count => t('kit.diagramFlow.more', { count })} lessLabel={t('kit.diagramFlow.less')} onToggleExpanded={id => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} showProgress={(node.progressType ?? progressType) === 'bar'} />{node.dotStepper && <div data-no-drag data-diagram-stepper={node.id} className="mt-2 w-full max-w-full overflow-x-auto"><DotStepper variant="none" {...node.dotStepper} fullWidth={node.dotStepper.fullWidth ?? true} readOnly={stepperReadOnly} aria-label={node.dotStepper['aria-label'] ?? t('kit.diagramFlow.nodeSteps', { title: node.title })} /></div>}{node.join === 'all' && <span className="text-xs text-neutral-500">{t(node.joinReady ? 'kit.diagramFlow.joinReady' : 'kit.diagramFlow.joinWaiting')}</span>}{hasCustomBody && <div data-no-drag data-diagram-node-body={node.id} className="mt-2 min-w-0">{customBody}</div>}</div>
            {(node.progressType ?? progressType) === 'spinner' && node.progress !== undefined && <ProgressSpinner size="xs" color={nodeTone(flowNode)} value={node.progress * 100} showValue={false} />}
          </div>
        </Panel>; })}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full" style={{ overflow: 'visible' }}>
          {routes.flatMap(({ edge, fromPort, toPort }) => (edge.connectorStyle ?? connectorStyle) !== 'bulb' ? [] : [fromPort, toPort].map((port, i) => {
            const node = byId.get(i ? edge.targetId : edge.sourceId);
            const panel = node ? { ...nodePanelProps, ...(node.tone ? { tone: node.tone } : {}), ...node.panelProps } : undefined;
            const hue = panel?.hoverColor ?? (node && selected === node.id ? panel?.activeTone : undefined) ?? panel?.tone;
            const contrastEnabled = !!node && panel?.hoverable !== false && !nodeDisabled(node) && (edge.outcome === 'success' ? hue === 'emerald' || hue === 'green' : edge.outcome === 'failure' ? hue === 'rose' || hue === 'red' : hue === 'slate' || hue === 'gray');
            const matching = contrastEnabled && hoveredNode.current === node?.id;
            return <circle key={`${edge.id}-${i}`} data-diagram-terminal-dot={i ? 'target' : 'source'} data-diagram-terminal-dot-node={node?.id} data-contrast-enabled={contrastEnabled || undefined} data-contrast={matching || undefined} data-outcome={edge.outcome} cx={port.x} cy={port.y} r={3} fill={edge.outcome === 'failure' ? '#fb7185' : edge.outcome === 'success' ? '#10b981' : '#94a3b8'} />;
          }))}
        </svg>
        {!editDisabled && selectedNode && !nodeDisabled(selectedNode) && (() => { const size = nodeSize(selectedNode); return <button type="button" data-diagram-resize={selectedNode.id} aria-label={t('kit.diagramFlow.resize', { title: selectedNode.title })} title={t('kit.diagramFlow.resizeHint')} className="absolute z-20 flex items-end justify-end rounded-sm border border-blue-500 bg-white text-blue-600 shadow focus-visible:outline focus-visible:outline-2 dark:bg-neutral-900" style={{ left: selectedNode.position.x + offsetX + size.width - 10, top: selectedNode.position.y + offsetY + size.height - 10, width: 20, height: 20, cursor: 'nwse-resize', touchAction: 'none' }}
          onPointerDown={event => { if (event.button !== 0) return; event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); resize.current = { id: selectedNode.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, ...size }; }}
          onPointerMove={event => { const r = resize.current; if (!r || r.pointerId !== event.pointerId) return; setSizePreview({ id: r.id, width: Math.max(120, snap(r.width + (event.clientX - r.startX) / zoom)), height: Math.max(60, snap(r.height + (event.clientY - r.startY) / zoom)) }); }}
          onPointerUp={event => { const r = resize.current; if (!r || r.pointerId !== event.pointerId) return; resize.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setSizePreview(null); if (Math.hypot(event.clientX - r.startX, event.clientY - r.startY) >= 4) resizeNode(r.id, r.width + (event.clientX - r.startX) / zoom, r.height + (event.clientY - r.startY) / zoom); }}
          onPointerCancel={() => { resize.current = null; setSizePreview(null); }} onLostPointerCapture={() => { resize.current = null; setSizePreview(null); }}
          onKeyDown={event => { const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const delta = directions[event.key]; if (delta) { event.preventDefault(); resizeNode(selectedNode.id, size.width + delta[0] * spacing, size.height + delta[1] * spacing); } }}>
          <span aria-hidden="true" className="text-xs leading-none">◢</span></button>; })()}
        {dropTarget && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full" style={{ overflow: 'visible' }}>{dropTarget.choices.map(port => <circle key={port.side} data-diagram-drop-side={port.side} cx={port.x} cy={port.y} r={port.side === dropTarget.port.side ? 8 : 5} fill={port.side === dropTarget.port.side ? '#3b82f6' : '#fff'} stroke="#3b82f6" strokeWidth="2" />)}</svg>}
        {!editDisabled && nodes.filter(node => !nodeDisabled(node)).flatMap(node => portsFor(node).map(port => <button key={`${node.id}-${port.side}`} type="button" data-diagram-port={port.side} data-diagram-port-node={node.id} aria-label={t('kit.diagramFlow.portLabel', { title: node.title, side: t(SIDE_KEYS[port.side]) })} title={t('kit.diagramFlow.portLabel', { title: node.title, side: t(SIDE_KEYS[port.side]) })} {...handleGesture({ kind: 'create', sourceId: node.id, outcome: 'unknown', side: port.side })} onPointerEnter={() => setHoveredNode(node.id)} onPointerLeave={event => { if (!(event.relatedTarget instanceof Element) || (event.relatedTarget.getAttribute('data-diagram-node') !== node.id && event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id)) setHoveredNode(null); }} onFocus={() => setHoveredNode(node.id)} onBlur={event => { if (!(event.relatedTarget instanceof Element) || (event.relatedTarget.getAttribute('data-diagram-node') !== node.id && event.relatedTarget.getAttribute('data-diagram-port-node') !== node.id)) setHoveredNode(null); }} className="absolute rounded-full border-2 border-white bg-slate-500 shadow-md hover:bg-blue-500 focus-visible:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400" style={{ left: port.x - 8, top: port.y - 8, width: 16, height: 16, touchAction: 'none', opacity: hoveredNode.current === node.id || connectionDrag?.gesture.kind === 'create' && connectionDrag.gesture.sourceId === node.id ? 1 : 0, pointerEvents: hoveredNode.current === node.id ? 'auto' : 'none' }} />))}
        {!editDisabled && routes.filter(({ edge }) => edge.id === selectedEdge).flatMap(({ edge, route }) => (['source', 'target'] as const).map((endpoint, i) => { const point = i ? route.points[route.points.length - 1] : route.points[0]; return <button key={`${edge.id}-${endpoint}`} type="button" data-diagram-endpoint={endpoint} aria-label={t('kit.diagramFlow.endpointLabel', { endpoint: t(ENDPOINT_KEYS[endpoint]), outcome: t(`kit.diagramFlow.${edge.outcome}`).toLocaleLowerCase(), source: byId.get(edge.sourceId)?.title ?? edge.sourceId, target: byId.get(edge.targetId)?.title ?? edge.targetId })} title={t('kit.diagramFlow.endpointTitle', { endpoint: t(ENDPOINT_KEYS[endpoint]) })} {...handleGesture({ kind: 'reconnect', edgeId: edge.id, endpoint })} className="absolute rounded-full border-2 border-blue-600 bg-white shadow focus-visible:outline focus-visible:outline-2" style={{ left: point.x - 9, top: point.y - 9, width: 18, height: 18, touchAction: 'none' }} />; }))}
      </div>
    </div></ScrollArea>
    <DiagramFlowControls readOnly={editDisabled} locked={locked} canNode={!!selectedNode} canDelete={!!selected || !!selectedEdge} canUndo={!!history.past.length} canRedo={!!history.future.length} outcome={selectedConnection?.outcome} zoom={zoom}
      onAdd={() => add(undefined, false)} onBranch={() => selectedNode && add(selectedNode, false)} onChild={() => selectedNode && add(selectedNode, true)}
      onConnect={() => selectedNode && setConnecting({ kind: 'create', sourceId: selectedNode.id, outcome: 'unknown' })}
      onAlign={() => {
        const aligned = graph.nodes.map(n => ({ ...n, position: { x: snap(n.position.x), y: snap(n.position.y) } }));
        if (aligned.some((a, i) => aligned.some((b, j) => { const x = nodeSize(a), y = nodeSize(b); return i !== j && a.position.x < b.position.x + y.width + 16 && a.position.x + x.width + 16 > b.position.x && a.position.y < b.position.y + y.height + 16 && a.position.y + x.height + 16 > b.position.y; }))) { setNotice(t('kit.diagramFlow.overlapPosition')); return; }
        setNotice(''); commit({ type: 'replace', graph: { ...graph, nodes: aligned } });
      }}
      onUndo={() => travel('undo')} onRedo={() => travel('redo')}
      onDelete={() => { if (selectedEdge) commit({ type: 'remove-connection', id: selectedEdge }); else if (selected) commit({ type: 'remove-node', id: selected }); setSelected(null); setSelectedEdge(null); }}
      onOutcome={outcome => { if (selectedConnection) commit({ type: 'update-connection', connection: { ...selectedConnection, outcome } }); }}
      onFit={fitDiagram} onReset={() => { setSelected(null); setSelectedEdge(null); setConnecting(null); fitDiagram(); }} onZoomIn={() => setZoom(z => Math.min(2, z * 1.25))} onZoomOut={() => setZoom(z => Math.max(.1, z * .8))} />
    </div>
    </Panel>
    </div>
    {inspector && <aside className="cj-network-graph__inspector" aria-hidden={!selectedNode || undefined} inert={!selectedNode || undefined}>
      <div className="cj-network-graph__inspector-inner">
        <Panel variant={inspectorVariant === 'auto' ? variant : inspectorVariant} tone={inspectorTone === 'auto' ? tone : inspectorTone} padding="sm" corner={surfaceProps.corner} glassOpacity={surfaceProps.glassOpacity} vibrancy={surfaceProps.vibrancy} specularMode={surfaceProps.specularMode} clickable={false} scrollable={false} flexBody className="cj-network-graph__details" style={{ minHeight: inspectorStacked ? 240 : height }}>
          {selectedNode && inspectorHelpers && <>
            <div className="cj-network-graph__body">
              <div className="cj-network-graph__eyebrow">{inspectorTitle ?? t('kit.networkGraph.inspector')}</div>
              <h3>{selectedNode.title}</h3>
              <dl className="cj-network-graph__meta">
                <dt>{t('kit.networkGraph.nodeId')}</dt><dd><code>{selectedNode.id}</code></dd>
                <dt>{t('kit.networkGraph.connections')}</dt><dd>{graph.connections.filter(edge => edge.sourceId === selectedNode.id || edge.targetId === selectedNode.id).length}</dd>
              </dl>
              {renderInspectorBody ? renderInspectorBody(selectedNode, inspectorHelpers) : <div className="cj-network-graph__neighbors"><small>{t('kit.networkGraph.neighbors')}</small><div className="cj-network-graph__neighbor-rows">{graph.connections.filter(edge => edge.sourceId === selectedNode.id || edge.targetId === selectedNode.id).map(edge => { const neighbor = byId.get(edge.sourceId === selectedNode.id ? edge.targetId : edge.sourceId); return neighbor && <button key={edge.id} type="button" className="cj-network-graph__neighbor" onClick={() => setSelected(neighbor.id)}><i /><span>{neighbor.title}</span></button>; })}</div></div>}
            </div>
            <div className="cj-network-graph__actions">{renderInspectorActions ? renderInspectorActions(selectedNode, inspectorHelpers) : <><Button size="sm" fullWidth variant="solid" color="slate" onClick={inspectorHelpers.centerOnNode}>{t('kit.networkGraph.centerOnNode')}</Button><Button size="sm" fullWidth variant="solid" color="slate" onClick={inspectorHelpers.close}>{t('kit.networkGraph.close')}</Button></>}</div>
          </>}
        </Panel>
      </div>
    </aside>}
  </div>;
}

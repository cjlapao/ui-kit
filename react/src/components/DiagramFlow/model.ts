import type { ReactNode } from 'react';
import type { PanelProps } from '../Panel';
import type { DotStepperProps } from '../DotStepper';
import type { ConnectionFlowItemProgress, ConnectionFlowNodeItem, ConnectionFlowProgressType } from '../../connectionFlow';
import type { TrueColor } from '../../theme/Theme';

/** Positions are expressed in canvas pixels and owned by the application. */
export interface DiagramFlowPosition { x: number; y: number }
export type DiagramFlowConnectorStyle = 'bulb' | 'arrow';
export type DiagramFlowOutcome = 'unknown' | 'success' | 'failure';
export type DiagramFlowSide = 'top' | 'right' | 'bottom' | 'left';
export type DiagramFlowStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped';
export interface DiagramFlowNode {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  /** Optional custom content below the standard node content. Set height to reserve space. */
  body?: ReactNode;
  icon?: string;
  tone?: TrueColor;
  active?: boolean;
  /** Node progress, from 0 to 1. */
  progress?: number;
  progressType?: ConnectionFlowProgressType;
  items?: ConnectionFlowNodeItem[];
  itemProgress?: ConnectionFlowItemProgress;
  maxItems?: number;
  /** Optional DotStepper displayed inside this node. Its progress remains application-owned. */
  dotStepper?: DotStepperProps;
  position: DiagramFlowPosition;
  /** Optional canvas dimensions in pixels. Routing and collision checks use these values. */
  width?: number;
  height?: number;
  parentId?: string;
  status?: DiagramFlowStatus;
  join?: 'all';
  /** Whether the application considers this join ready. Never inferred by the editor. */
  joinReady?: boolean;
  /** Overrides the editor-wide node Panel settings for this node. */
  panelProps?: DiagramFlowPanelProps;
  data?: unknown;
}
export interface DiagramFlowConnection {
  id: string;
  sourceId: string;
  targetId: string;
  outcome: DiagramFlowOutcome;
  /** Override the diagram-wide terminal style for this connection. */
  connectorStyle?: DiagramFlowConnectorStyle;
  /** Optional sides chosen by the user when drawing a connection. */
  fromSide?: DiagramFlowSide;
  toSide?: DiagramFlowSide;
  label?: string;
  condition?: unknown;
  conditionLabel?: string;
  /** The application reports whether this incoming path satisfies a join. */
  satisfied?: boolean;
  /** Animate travelling dots when the application reports this path active. */
  animated?: boolean;
  data?: unknown;
}
export interface DiagramFlowGraph {
  nodes: DiagramFlowNode[];
  connections: DiagramFlowConnection[];
}
export type DiagramFlowOperation =
  | { type: 'create'; node: DiagramFlowNode; connection?: DiagramFlowConnection }
  | { type: 'connect'; connection: DiagramFlowConnection }
  | { type: 'move'; id: string; position: DiagramFlowPosition }
  | { type: 'remove-node'; id: string }
  | { type: 'remove-connection'; id: string }
  | { type: 'update-node'; node: DiagramFlowNode }
  | { type: 'update-connection'; connection: DiagramFlowConnection }
  | { type: 'replace'; graph: DiagramFlowGraph };

export function validateDiagramFlow(graph: DiagramFlowGraph): string[] {
  const errors: string[] = [];
  const nodes = new Map<string, DiagramFlowNode>();
  for (const node of graph.nodes) {
    if (!node.id || nodes.has(node.id)) errors.push(`Duplicate or empty node ID: ${node.id}`);
    nodes.set(node.id, node);
    if (!Number.isFinite(node.position.x) || !Number.isFinite(node.position.y)) errors.push(`Invalid position: ${node.id}`);
    if ((node.width !== undefined && (!Number.isFinite(node.width) || node.width <= 0)) || (node.height !== undefined && (!Number.isFinite(node.height) || node.height <= 0))) errors.push(`Invalid size: ${node.id}`);
  }
  for (const node of graph.nodes) {
    const seen = new Set([node.id]);
    let parent = node.parentId;
    while (parent) {
      if (seen.has(parent)) { errors.push(`Parent cycle: ${node.id}`); break; }
      seen.add(parent);
      const next = nodes.get(parent);
      if (!next) { errors.push(`Missing parent: ${parent}`); break; }
      parent = next.parentId;
    }
  }
  const edges = new Set<string>();
  for (const edge of graph.connections) {
    if (!edge.id || edges.has(edge.id)) errors.push(`Duplicate or empty connection ID: ${edge.id}`);
    edges.add(edge.id);
    if (!nodes.has(edge.sourceId) || !nodes.has(edge.targetId)) errors.push(`Missing endpoint: ${edge.id}`);
    if (edge.sourceId === edge.targetId) errors.push(`Self connection: ${edge.id}`);
    if (edge.outcome !== 'unknown' && edge.outcome !== 'success' && edge.outcome !== 'failure') errors.push(`Invalid outcome: ${edge.id}`);
  }
  return errors;
}

/** Apply a complete operation or return null when it cannot be applied safely. */
export function applyDiagramFlowOperation(graph: DiagramFlowGraph, operation: DiagramFlowOperation): DiagramFlowGraph | null {
  let next: DiagramFlowGraph;
  switch (operation.type) {
    case 'create':
      if (graph.nodes.some(n => n.id === operation.node.id)) return null;
      if (operation.connection && operation.connection.targetId !== operation.node.id) return null;
      next = { nodes: [...graph.nodes, operation.node], connections: operation.connection ? [...graph.connections, operation.connection] : graph.connections };
      break;
    case 'connect': next = { ...graph, connections: [...graph.connections, operation.connection] }; break;
    case 'move':
      if (!graph.nodes.some(n => n.id === operation.id)) return null;
      next = { ...graph, nodes: graph.nodes.map(n => n.id === operation.id ? { ...n, position: operation.position } : n) };
      break;
    case 'remove-node': {
      if (!graph.nodes.some(n => n.id === operation.id)) return null;
      const removed = new Set([operation.id]);
      let size = 0;
      while (size !== removed.size) { size = removed.size; for (const n of graph.nodes) if (n.parentId && removed.has(n.parentId)) removed.add(n.id); }
      next = { nodes: graph.nodes.filter(n => !removed.has(n.id)), connections: graph.connections.filter(e => !removed.has(e.sourceId) && !removed.has(e.targetId)) };
      break;
    }
    case 'remove-connection':
      if (!graph.connections.some(e => e.id === operation.id)) return null;
      next = { ...graph, connections: graph.connections.filter(e => e.id !== operation.id) }; break;
    case 'update-node':
      if (!graph.nodes.some(n => n.id === operation.node.id)) return null;
      next = { ...graph, nodes: graph.nodes.map(n => n.id === operation.node.id ? operation.node : n) }; break;
    case 'update-connection':
      if (!graph.connections.some(e => e.id === operation.connection.id)) return null;
      next = { ...graph, connections: graph.connections.map(e => e.id === operation.connection.id ? operation.connection : e) }; break;
    case 'replace': next = operation.graph; break;
  }
  return validateDiagramFlow(next).length ? null : next;
}
/** Panel appearance and content options; diagram interactions are controlled by DiagramFlow. */
export type DiagramFlowPanelProps = Omit<PanelProps, 'children' | 'onClick' | 'onKeyDown' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' | 'onPointerEnter' | 'onPointerLeave' | 'onFocus' | 'onBlur' | 'role' | 'tabIndex'>;

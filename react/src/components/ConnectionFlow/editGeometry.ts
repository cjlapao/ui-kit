import { port, routeBetween, type Box, type PortSide } from '../../../../common/connectionFlow/router';
import type { ConnectionFlowLayout, ConnectionFlowEdgeStyle, LaidOutNode } from '../../connectionFlow';

export type ConnectionFlowPlacement = {
  sourceId: string;
  side: PortSide;
  /** Persist on the new node when using a graph with explicit grid cells. */
  gridPosition?: { column: number; row: number };
};
export type FlowGhost = ConnectionFlowPlacement & { id: string; box: Box; d: string; source: { x: number; y: number; }; points: { x: number; y: number; }[]; };
export const EDIT_SIDES: PortSide[] = ['top', 'right', 'bottom', 'left'];
const opposite: Record<PortSide, PortSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export function dragSide(node: Box, x: number, y: number, previous: PortSide): PortSide {
  const dx = (x - node.x - node.width / 2) / node.width;
  const dy = (y - node.y - node.height / 2) / node.height;
  const weights = { left: -dx, right: dx, top: -dy, bottom: dy };
  const next = EDIT_SIDES.reduce((a, b) => weights[b] > weights[a] ? b : a, previous);
  return weights[next] > weights[previous] + 0.08 ? next : previous;
}
export const outsideCard = (box: Box, x: number, y: number) =>
  x < box.x || x > box.x + box.width || y < box.y || y > box.y + box.height;

/** Choose a free terminal instead of painting the draft on an existing ring. */
export function editPort(node: LaidOutNode, side: PortSide, layout: ConnectionFlowLayout) {
  const length = side === 'left' || side === 'right' ? node.height : node.width;
  const inset = Math.min(16, length / 2);
  const candidates: number[] = [];
  for (let at = inset; at <= length - inset; at += 4) candidates.push(at);
  candidates.sort((a, b) => Math.abs(a - length / 2) - Math.abs(b - length / 2));
  const anchors = layout.connectors.filter(c => c.nodeId === node.id && c.side === side);
  const at = candidates.find(at => anchors.every(c => Math.abs(
    at - (side === 'left' || side === 'right' ? c.y - node.y : c.x - node.x),
  ) >= c.radius + 10));
  return at === undefined ? null : port(node, side, at / length);
}

/** Snap each axis independently so a drag may also change row or column. */
export function ghostCellAt(node: LaidOutNode, side: PortSide, layout: ConnectionFlowLayout, x: number, y: number) {
  const cell = node.node.gridPosition;
  if (!cell) return undefined;
  const axis = (coordinate: number, dimension: 'column' | 'row') => {
    const horizontal = dimension === 'column';
    const entries = layout.nodes.filter(n => n.node.gridPosition).map(n => ({
      index: n.node.gridPosition![dimension],
      start: horizontal ? n.x : n.y,
      end: horizontal ? n.x + n.width : n.y + n.height,
    }));
    const first = entries.reduce((a, b) => a.index < b.index ? a : b);
    const last = entries.reduce((a, b) => a.index > b.index ? a : b);
    const size = horizontal ? node.width : node.height;
    const candidates = [
      ...entries.map(e => ({ index: e.index, centre: (e.start + e.end) / 2 })),
      { index: first.index - 1, centre: first.start - 72 - size / 2 },
      { index: last.index + 1, centre: last.end + 72 + size / 2 },
    ];
    return candidates.reduce((a, b) => Math.abs(a.centre - coordinate) <= Math.abs(b.centre - coordinate) ? a : b).index;
  };
  const column = axis(x, 'column');
  const row = axis(y, 'row');
  return {
    column: side === 'right' ? Math.max(cell.column + 1, column) : side === 'left' ? Math.min(cell.column - 1, column) : column,
    row: side === 'bottom' ? Math.max(cell.row + 1, row) : side === 'top' ? Math.min(cell.row - 1, row) : row,
  };
}

/** Drafts use free slots without rewriting any real node or route. */
export function placeGhost(
  id: string, node: LaidOutNode, side: PortSide, layout: ConnectionFlowLayout,
  pending: readonly FlowGhost[], style: ConnectionFlowEdgeStyle,
  requestedCell?: ConnectionFlowPlacement['gridPosition'],
): FlowGhost | null {
  const source = editPort(node, side, layout);
  if (!source) return null;
  const gap = 72;
  const obstacles = [...layout.nodes, ...pending.map(g => g.box)];
  for (let step = 0; step < obstacles.length + 2; step++) {
    const box: Box = { x: node.x, y: node.y, width: node.width, height: node.height };
    const cell = node.node.gridPosition;
    const gridPosition = cell ? {
      column: (requestedCell?.column ?? cell.column + (side === 'right' ? 1 : side === 'left' ? -1 : 0)) + (side === 'right' ? step : side === 'left' ? -step : 0),
      row: (requestedCell?.row ?? cell.row + (side === 'bottom' ? 1 : side === 'top' ? -1 : 0)) + (side === 'bottom' ? step : side === 'top' ? -step : 0),
    } : undefined;
    if (side === 'right') box.x += node.width + gap + step * (node.width + gap);
    if (side === 'left') box.x -= node.width + gap + step * (node.width + gap);
    if (side === 'bottom') box.y += node.height + gap + step * (node.height + gap);
    if (side === 'top') box.y -= node.height + gap + step * (node.height + gap);
    // Reuse an existing column/row rather than opening a new column merely
    // because its first row is occupied. The requested cell can still be free.
    if (gridPosition) {
      const axisStart = (dimension: 'column' | 'row') => {
        const horizontal = dimension === 'column';
        const entries = layout.nodes.filter(n => n.node.gridPosition);
        const exact = entries.find(n => n.node.gridPosition![dimension] === gridPosition[dimension]);
        if (exact) return horizontal ? exact.x : exact.y;
        const low = Math.min(...entries.map(n => n.node.gridPosition![dimension]));
        const high = Math.max(...entries.map(n => n.node.gridPosition![dimension]));
        const size = horizontal ? box.width : box.height;
        if (gridPosition[dimension] < low) return Math.min(...entries.map(n => horizontal ? n.x : n.y)) -
          (low - gridPosition[dimension]) * (size + gap);
        return Math.max(...entries.map(n => horizontal ? n.x + n.width : n.y + n.height)) + gap +
          (gridPosition[dimension] - high - 1) * (size + gap);
      };
      box.x = axisStart('column');
      box.y = axisStart('row');
    }
    if (obstacles.some(b => box.x < b.x + b.width + 16 && box.x + box.width + 16 > b.x &&
      box.y < b.y + b.height + 16 && box.y + box.height + 16 > b.y)) continue;
    const t = side === 'left' || side === 'right'
      ? (source.y - node.y) / node.height : (source.x - node.x) / node.width;
    const routed = routeBetween({ box: node, t, sides: [side] },
      { box, t: 0.5, sides: [opposite[side]] }, obstacles,
      {
        style, stub: 26, trim: 3, radius: 8, clearance: 12, strictObstacles: true,
        occupied: [...layout.edges.map(e => e.points), ...pending.map(g => g.points)]
      });
    if (!routed) continue;
    return {
      id, sourceId: node.id, side, ...(gridPosition ? { gridPosition } : {}), box, source, points: routed.points,
      d: routed.d
    };
  }
  return null;
}

export type ConnectionFlowConnectRequest = {
  sourceId: string;
  targetId: string;
  sourceSide: PortSide;
  targetSide: PortSide;
};
export type FlowConnectionPreview = ConnectionFlowConnectRequest & {
  d: string;
  points: { x: number; y: number }[];
  targetBox: Box;
  source: { x: number; y: number };
  target: { x: number; y: number };
};

/** Preview a link between existing cards without changing either card. */
export function previewConnection(
  source: LaidOutNode, target: LaidOutNode, sourceSide: PortSide, targetSide: PortSide,
  layout: ConnectionFlowLayout, style: ConnectionFlowEdgeStyle,
): FlowConnectionPreview | null {
  if (source.id === target.id || source.node.disabled || target.node.disabled ||
    layout.edges.some(e => e.fromId === source.id && e.toId === target.id)) return null;
  const sideOrder = (preferred: PortSide, node: Box, remote: Box) => {
    const others = EDIT_SIDES.filter(side => side !== preferred);
    others.sort((a, b) => {
      const score = (side: PortSide) => {
        const p = port(node, side);
        return Math.hypot(p.x - remote.x - remote.width / 2, p.y - remote.y - remote.height / 2) +
          (side === opposite[preferred] ? node.width + node.height : 0);
      };
      return score(a) - score(b);
    });
    return [preferred, ...others];
  };
  for (const fromSide of sideOrder(sourceSide, source, target))
    for (const toSide of sideOrder(targetSide, target, source)) {
      const from = editPort(source, fromSide, layout);
      const to = editPort(target, toSide, layout);
      if (!from || !to) continue;
      const fraction = (node: Box, p: NonNullable<typeof from>) => p.side === 'left' || p.side === 'right'
        ? (p.y - node.y) / node.height : (p.x - node.x) / node.width;
      const route = routeBetween(
        { box: source, t: fraction(source, from), sides: [fromSide] },
        { box: target, t: fraction(target, to), sides: [toSide] },
        layout.nodes, {
          style, stub: 26, trim: 3, radius: 8, clearance: 12,
        strictObstacles: true, occupied: layout.edges.map(e => e.points)
      },
      );
      if (route) return {
        sourceId: source.id, targetId: target.id, sourceSide: fromSide, targetSide: toSide,
        d: route.d, points: route.points, targetBox: target, source: from, target: to
      };
    }
  return null;
}

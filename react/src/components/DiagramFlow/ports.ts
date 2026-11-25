import type { Box, PortSide } from './router';

export interface DiagramPort { side: PortSide; t: number; x: number; y: number }
export const DIAGRAM_SIDES: PortSide[] = ['top', 'right', 'bottom', 'left'];

/** Pick the nearest free attachment point with room for both connector rings. */
export function freeDiagramPort(box: Box, side: PortSide, occupied: readonly DiagramPort[]): DiagramPort | null {
  const horizontal = side === 'top' || side === 'bottom';
  const length = horizontal ? box.width : box.height;
  const candidates: number[] = [];
  for (let offset = 0; offset <= length / 2 - 12; offset += 20) {
    candidates.push(length / 2 - offset);
    if (offset) candidates.push(length / 2 + offset);
  }
  const at = candidates.find(candidate => occupied.every(port => port.side !== side || Math.abs(port.t * length - candidate) >= 18));
  if (at === undefined) return null;
  const t = at / length;
  return { side, t, x: horizontal ? box.x + at : box.x + (side === 'right' ? box.width : 0), y: horizontal ? box.y + (side === 'bottom' ? box.height : 0) : box.y + at };
}

export function nearestDiagramSide(box: Box, x: number, y: number): PortSide {
  const distances = { top: Math.abs(y - box.y), right: Math.abs(x - box.x - box.width), bottom: Math.abs(y - box.y - box.height), left: Math.abs(x - box.x) };
  return DIAGRAM_SIDES.reduce((a, b) => distances[b] < distances[a] ? b : a);
}

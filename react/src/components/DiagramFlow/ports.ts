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

/** Align facing ports when both sides have room at the same coordinate. */
export function alignedDiagramPorts(
  a: Box, aSide: PortSide, aUsed: readonly DiagramPort[],
  b: Box, bSide: PortSide, bUsed: readonly DiagramPort[],
): [DiagramPort, DiagramPort] | null {
  const horizontal = (aSide === 'right' && bSide === 'left' && a.x + a.width <= b.x) || (aSide === 'left' && bSide === 'right' && b.x + b.width <= a.x);
  const vertical = (aSide === 'bottom' && bSide === 'top' && a.y + a.height <= b.y) || (aSide === 'top' && bSide === 'bottom' && b.y + b.height <= a.y);
  if (!horizontal && !vertical) return null;
  const aStart = horizontal ? a.y : a.x, bStart = horizontal ? b.y : b.x;
  const aLength = horizontal ? a.height : a.width, bLength = horizontal ? b.height : b.width;
  const min = Math.max(aStart + 12, bStart + 12), max = Math.min(aStart + aLength - 12, bStart + bLength - 12);
  if (min > max) return null;
  const preferred = Math.min(max, Math.max(min, (aStart + aLength / 2 + bStart + bLength / 2) / 2));
  const used = [...aUsed.filter(p => p.side === aSide).map(p => aStart + p.t * aLength), ...bUsed.filter(p => p.side === bSide).map(p => bStart + p.t * bLength)];
  const candidates = [preferred, min, max, ...used.flatMap(point => [point - 18, point + 18])]
    .filter(point => point >= min && point <= max && used.every(other => Math.abs(point - other) >= 18 - 1e-7))
    .sort((x, y) => Math.abs(x - preferred) - Math.abs(y - preferred));
  const coordinate = candidates[0];
  if (coordinate === undefined) return null;
  const makePort = (box: Box, side: PortSide, start: number, length: number): DiagramPort => ({
    side, t: (coordinate - start) / length,
    x: horizontal ? box.x + (side === 'right' ? box.width : 0) : coordinate,
    y: horizontal ? coordinate : box.y + (side === 'bottom' ? box.height : 0),
  });
  return [makePort(a, aSide, aStart, aLength), makePort(b, bSide, bStart, bLength)];
}

import { captionTextWidth, wrapCaption } from '../../../../common/connectionFlow/captions';
import { segmentsCrossBoxes, type Box } from './router';

export interface DiagramCaption extends Box { lines: string[]; lineHeight: number }
type Point = { x: number; y: number };
type CaptionInput = { id: string; text: string; points: Point[] };
const overlaps = (a: Box, b: Box) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
const inflate = (box: Box, n: number): Box => ({ x: box.x - n, y: box.y - n, width: box.width + n * 2, height: box.height + n * 2 });

/** Position captions near a straight segment, clear of cards, other captions and routes. */
export function placeDiagramCaptions(edges: readonly CaptionInput[], nodes: readonly Box[]): Map<string, DiagramCaption> {
  const result = new Map<string, DiagramCaption>();
  const reserved: Box[] = [];
  for (const edge of edges) {
    const text = edge.text.trim();
    if (!text || edge.points.length < 2) continue;
    const width = Math.max(36, Math.min(160, captionTextWidth(text) + 20));
    const lines = wrapCaption(text, width - 16);
    const height = lines.length * 14 + 8;
    const segments = edge.points.slice(1).map((b, i) => {
      const a = edge.points[i];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, horizontal: Math.abs(b.x - a.x) >= Math.abs(b.y - a.y), length: Math.hypot(b.x - a.x, b.y - a.y) };
    }).sort((a, b) => b.length - a.length);
    let chosen: DiagramCaption | undefined;
    for (const segment of segments) {
      // Move away from the line so labels don't hide the arrow or another path.
      for (const distance of [12, 28, 48, 72, 104, 144]) {
        for (const sign of [-1, 1]) {
          const x = segment.horizontal ? segment.x - width / 2 : segment.x + sign * (distance + width / 2) - width / 2;
          const y = segment.horizontal ? segment.y + sign * (distance + height / 2) - height / 2 : segment.y - height / 2;
          const box = { x, y, width, height, lines, lineHeight: 14 };
          const clear = inflate(box, 5);
          if (x < 0 || y < 0 || nodes.some(node => overlaps(clear, node)) || reserved.some(other => overlaps(clear, other))) continue;
          if (edges.some(other => other.id !== edge.id && segmentsCrossBoxes(other.points, [clear]))) continue;
          chosen = box; break;
        }
        if (chosen) break;
      }
      if (chosen) break;
    }
    // Dense graphs still need their label. Search outward without covering cards.
    if (!chosen) {
      const anchor = segments[0];
      for (let distance = 160; distance <= 1200 && !chosen; distance += 40) {
        for (const sign of [-1, 1]) {
          const box = { x: Math.max(0, anchor.x - width / 2), y: anchor.y + sign * distance - height / 2, width, height, lines, lineHeight: 14 };
          if (box.y >= 0 && !nodes.some(node => overlaps(inflate(box, 5), node)) && !reserved.some(other => overlaps(inflate(box, 5), other))) { chosen = box; break; }
        }
      }
    }
    if (chosen) { result.set(edge.id, chosen); reserved.push(chosen); }
  }
  return result;
}

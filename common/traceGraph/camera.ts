import type { TracePoint } from "./model";
export interface TraceGraphViewport { x: number; y: number; zoom: number }
export type TraceFollowMode = "off" | "following" | "paused";
export const screenPoint = (point: TracePoint, view: TraceGraphViewport): TracePoint => ({ x: point.x * view.zoom + view.x, y: point.y * view.zoom + view.y });
export const worldPoint = (point: TracePoint, view: TraceGraphViewport): TracePoint => ({ x: (point.x - view.x) / view.zoom, y: (point.y - view.y) / view.zoom });
export function zoomTraceAt(view: TraceGraphViewport, point: TracePoint, zoom: number): TraceGraphViewport {
  const world = worldPoint(point, view);
  return { zoom, x: point.x - world.x * zoom, y: point.y - world.y * zoom };
}
export function fitTrace(points: readonly TracePoint[], width: number, height: number, minZoom = 0.02, maxZoom = 2, padding = 56): TraceGraphViewport {
  if (!points.length) return { x: width / 2, y: height / 2, zoom: 1 };
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const p of points) { x1 = Math.min(x1, p.x); x2 = Math.max(x2, p.x); y1 = Math.min(y1, p.y); y2 = Math.max(y2, p.y); }
  const zoom = Math.max(minZoom, Math.min(maxZoom, Math.max(1, width - padding * 2) / Math.max(112, x2 - x1), Math.max(1, height - padding * 2) / Math.max(72, y2 - y1)));
  return { zoom, x: width / 2 - (x1 + x2) / 2 * zoom, y: height / 2 - (y1 + y2) / 2 * zoom };
}
/** Inner safe zone plus a looser zoom threshold stops frontier jitter. */
export function traceNeedsFollow(points: readonly TracePoint[], view: TraceGraphViewport, width: number, height: number): boolean {
  if (!points.length) return false;
  const margin = Math.min(80, width * 0.18, height * 0.18);
  return points.some(point => { const p = screenPoint(point, view); return p.x < margin || p.y < margin || p.x > width - margin || p.y > height - margin; });
}

/** Pulse radius is a multiple of the dot radius, shrinking in dense overviews. */
export function tracePulseRadius(dotRadius: number, scale: number, zoom: number) {
  return dotRadius * scale * Math.min(1, Math.max(0, zoom));
}

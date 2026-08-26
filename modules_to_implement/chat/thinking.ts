/**
 * Formats a thinking-stage duration (in ms) as a compact human string.
 * e.g. 2400 -> "2s", 90000 -> "1m 30s", 3661000 -> "1h 1m".
 * Round to the nearest whole second; sub-second stages read as "<1s".
 */
export function formatThinkingDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 1) return "<1s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes > 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  return `${seconds}s`;
}

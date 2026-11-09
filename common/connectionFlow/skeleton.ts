import { layoutConnectionFlow } from "./layout";
import type { ConnectionFlowLayout, ConnectionFlowNode, NodeMetrics } from "./types";

/** Use known topology while refreshing; otherwise preview a small branch and merge. */
export const getSkeletonLayout = (
  metrics: NodeMetrics,
  layout?: ConnectionFlowLayout,
  count = 6,
): ConnectionFlowLayout => {
  if (layout?.nodes.length) return layout;
  const nodes: ConnectionFlowNode[] = Array.from({ length: count }, (_, index) => ({
    id: `skeleton-${index}`,
    title: "Loading",
    subtitle: "Loading details",
    height: metrics.height + (index % 3) * metrics.bodyLine,
    ...(index === 2 || index === 3 ? { kind: "parallel" as const, group: "skeleton-branch" } : {}),
  }));
  return layoutConnectionFlow({ nodes, flowState: "stopped", options: { metrics } });
};

/** Fit every card, connector and overhang with breathing room on all sides. */
export const skeletonViewBox = (layout: ConnectionFlowLayout, padding: number) =>
  `${layout.offsetX - padding} ${layout.offsetY - padding} ${Math.max(1, layout.width - layout.offsetX + padding * 2)} ${Math.max(1, layout.height - layout.offsetY + padding * 2)}`;

/** Placeholder bars reflect the card's available body area, including taller cards. */
export const skeletonCardBars = (width: number, height: number, metrics: NodeMetrics) => {
  const padding = Math.min(metrics.padding, width / 5, height / 5);
  const innerWidth = Math.max(0, width - padding * 2);
  const glyph = Math.min(metrics.glyph, innerWidth / 4, height - padding * 2);
  const textX = padding + glyph + metrics.gap;
  const textWidth = Math.max(0, width - padding - textX);
  const bars = [
    { x: padding, y: padding, width: glyph, height: glyph, radius: 4 },
    { x: textX, y: padding + 1, width: textWidth * 0.8, height: Math.min(8, metrics.title / 2), radius: 3 },
    { x: textX, y: padding + glyph * 0.65, width: textWidth * 0.55, height: Math.min(6, metrics.body / 2), radius: 3 },
  ];
  for (let y = padding + glyph + metrics.gap; y + 6 <= height - padding; y += metrics.bodyLine) {
    bars.push({ x: padding, y, width: innerWidth * (bars.length % 2 ? 0.72 : 0.5), height: 6, radius: 3 });
  }
  return bars;
};

/**
 * <Chart.Hover> — declarative flag enabling pointer hover.
 * Renders nothing; the root reads its presence via child inspection and
 * exposes the hovered items through the context (and onHover).
 */
import { useEffect } from "react";
import { useChart } from "../ChartContext";
import type { HoverProps } from "../props";

export function Hover(props: HoverProps) {
  const ctx = useChart();

  useEffect(() => {
    props.onHover?.(ctx.hover);
  }, [ctx.hover, props.onHover]);

  return null;
}

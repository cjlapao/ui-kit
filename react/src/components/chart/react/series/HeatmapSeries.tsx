/**
 * <Chart.Heatmap> — self-contained grid of value-colored cells.
 *
 * Layout (owned by this series, like pie/gauge): row-label gutter on the
 * left, the rows × cols cell grid, a column-label row, and an optional
 * gradient legend bar below. Colors come from a multi-stop scale sampled
 * linearly over `domain`. Missing cells (absent or non-finite values)
 * render as null slots.
 *
 * Entrance: per-cell staggered grow/fade in row-major order.
 */
import { useEffect, useId, useMemo } from "react";
import {
  computeHeatmapLayout,
  sampleColorStops,
  contrastTextColor,
} from "../../engine/index";
import type { HeatmapCellDatum, HeatmapLayout } from "../../engine/index";
import { useChart } from "../ChartContext";
import { seriesDimStyle } from "../series-common";
import type { HeatmapSeriesProps } from "../props";

interface HeatmapModel {
  rows: string[];
  cols: string[];
  cells: HeatmapCellDatum[];
  layout: HeatmapLayout;
  gutter: number;
  min: number;
  max: number;
  stops: string[];
  colorFor: (v: number) => string;
  gap: number;
  radius: number;
  valueLabels: boolean;
  rowLabels: boolean;
  colLabels: boolean;
  showLegend: boolean;
  legendTicks: number;
  nullColor?: string;
}

const DEFAULT_STOPS = ["#dbeafe", "#3b82f6", "#7c3aed"];

function buildModel(me: {
  heatmapRows?: string[];
  heatmapCols?: string[];
  heatmapCells?: HeatmapCellDatum[];
  heatmapRange?: [number, number];
  heatmapColorStops?: string[];
  heatmapCellGap?: number;
  heatmapCornerRadius?: number;
  heatmapValueLabels?: boolean;
  heatmapRowLabels?: boolean;
  heatmapColLabels?: boolean;
  heatmapShowLegend?: boolean;
  heatmapLegendTicks?: number;
  heatmapNullColor?: string;
  heatmapRowLabelWidth?: number;
}, area: { x: number; y: number; width: number; height: number }): HeatmapModel | null {
  const rows = me.heatmapRows ?? [];
  const cols = me.heatmapCols ?? [];
  const cells = me.heatmapCells ?? [];
  if (rows.length === 0 || cols.length === 0) return null;
  const rowLabels = me.heatmapRowLabels ?? true;
  const colLabels = me.heatmapColLabels ?? true;
  const showLegend = me.heatmapShowLegend ?? true;
  const longest = rowLabels ? Math.max(0, ...rows.map((r) => r.length)) : 0;
  const gutter = me.heatmapRowLabelWidth ?? (rowLabels ? longest * 6.4 + 10 : 0);
  const layout = computeHeatmapLayout({
    area: { x: area.x, y: area.y, width: area.width, height: area.height },
    rowLabelWidth: gutter,
    colsCount: cols.length,
    rowsCount: rows.length,
    showColLabels: colLabels,
    showLegend,
  });
  const [min, max] = me.heatmapRange ?? [0, 1];
  const stops = me.heatmapColorStops ?? DEFAULT_STOPS;
  const span = max - min || 1;
  return {
    rows,
    cols,
    cells,
    layout,
    gutter,
    min,
    max,
    stops,
    colorFor: (v: number) =>
      sampleColorStops(stops, (v - min) / span),
    gap: me.heatmapCellGap ?? 3,
    radius: me.heatmapCornerRadius ?? 3,
    valueLabels: me.heatmapValueLabels ?? false,
    rowLabels,
    colLabels,
    showLegend,
    legendTicks: me.heatmapLegendTicks ?? 3,
    nullColor: me.heatmapNullColor,
  };
}

/** Per-cell entrance progress with a row-major stagger. */
function cellProgress(
  progress: number,
  rowIdx: number,
  colIdx: number,
  colsCount: number,
): number {
  if (progress >= 1) return 1;
  const order = rowIdx + colIdx * 0.35;
  const window = Math.max(colsCount + 8, 12) * 0.35;
  return Math.max(0, Math.min(1, (progress * (window + 4) - order * 0.35) / 3));
}

function tickLabel(v: number): string {
  if (Math.abs(v) >= 1000) {
    return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  }
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export function HeatmapSeries(props: HeatmapSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    area,
    progress,
    registerDraw,
    unregisterDraw,
    hover,
    hoverDim,
    animationsDisabled,
    theme,
    isDark,
  } = ctx;
  const gradId = useId().replace(/:/g, "");
  const me =
    ctx.series.find(
      (s) =>
        s.descriptor.type === "heatmap" &&
        (props.id === undefined || s.descriptor.id === props.id),
    ) ?? null;
  const seriesId = me?.descriptor.id ?? "heatmap";

  const model = useMemo(
    () => (me ? buildModel(me.descriptor, area) : null),
    [me, area],
  );
  const hidden = me?.hidden ?? false;
  const dim = seriesDimStyle(hover, seriesId, hoverDim);
  const groupOpacity = hidden ? 0 : dim;

  // Hovered cell grid index (root hit-tests; the item index is the raw
  // data index, which maps 1:1 to a cell).
  const hoverCellIdx = useMemo(() => {
    if (!model || !hover) return -1;
    const it = hover.items.find((i) => i.seriesId === seriesId);
    if (!it) return -1;
    return model.cells.findIndex((c) => c.index === it.index && c.value !== null);
  }, [hover, model, seriesId]);

  const valueFmt = me?.descriptor.heatmapValueLabelFormat;
  const tierFmt = me?.descriptor.heatmapTierLabel;
  const annotations = me?.descriptor.heatmapAnnotations ?? [];

  const settled = progress >= 1 || animationsDisabled;

  // ── Canvas ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !model) return;
    const {
      rows,
      cols,
      cells,
      layout,
      gap,
      radius,
      valueLabels,
      rowLabels,
      colLabels,
      showLegend,
      legendTicks,
      min,
      max,
      stops,
      colorFor,
      nullColor,
    } = model;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const p = animationsDisabled ? 1 : st.progress;
      c.save();
      c.globalAlpha = groupOpacity;
      const rx = (x: number, y: number, w: number, h: number, r: number) => {
        const rr = Math.max(0, Math.min(r, w / 2, h / 2));
        c.beginPath();
        c.moveTo(x + rr, y);
        c.arcTo(x + w, y, x + w, y + h, rr);
        c.arcTo(x + w, y + h, x, y + h, rr);
        c.arcTo(x, y + h, x, y, rr);
        c.arcTo(x, y, x + w, y, rr);
        c.closePath();
      };
      // Row labels
      if (rowLabels) {
        c.font = "11px ui-sans-serif, system-ui, sans-serif";
        c.fillStyle = theme.textColor;
        c.textAlign = "right";
        c.textBaseline = "middle";
        rows.forEach((r, i) => {
          c.fillText(r, layout.gridX - 8, layout.gridY + (i + 0.5) * layout.cellH);
        });
      }
      // Cells
      for (let r = 0; r < rows.length; r++) {
        for (let cc = 0; cc < cols.length; cc++) {
          const idx = r * cols.length + cc;
          const cell = cells[idx];
          const lp = animationsDisabled ? 1 : cellProgress(p, r, cc, cols.length);
          if (lp <= 0.01) continue;
          const x = layout.gridX + cc * layout.cellW + gap / 2;
          const y = layout.gridY + r * layout.cellH + gap / 2;
          const w = layout.cellW - gap;
          const h = layout.cellH - gap;
          c.save();
          c.globalAlpha = groupOpacity * lp;
          if (lp < 1) {
            const s = 0.55 + 0.45 * lp;
            c.translate(x + w / 2, y + h / 2);
            c.scale(s, s);
            c.translate(-(x + w / 2), -(y + h / 2));
          }
          if (cell && cell.value !== null) {
            rx(x, y, w, h, radius);
            c.fillStyle = colorFor(cell.value);
            c.fill();
            if (idx === hoverCellIdx) {
              c.strokeStyle = isDark ? "rgba(255,255,255,0.85)" : "rgba(17,24,39,0.6)";
              c.lineWidth = 1.5;
              c.stroke();
            }
            if (valueLabels && w > 30 && h > 18) {
              c.textAlign = "center";
              c.textBaseline = "middle";
              const txt = valueFmt
                ? valueFmt(cell.value, cell.data, cell.index)
                : cell.value.toFixed(2);
              const tier = tierFmt ? tierFmt(cell.value, cell.data, cell.index) : null;
              const tc = contrastTextColor(colorFor(cell.value));
              c.fillStyle = tc;
              c.font = "600 11px ui-sans-serif, system-ui, sans-serif";
              c.fillText(txt, x + w / 2, y + h / 2 + (tier ? -4 : 0));
              if (tier) {
                c.globalAlpha = groupOpacity * lp * 0.72;
                c.font = "500 9px ui-sans-serif, system-ui, sans-serif";
                c.fillText(tier, x + w / 2, y + h / 2 + 8);
              }
            }
          } else {
            rx(x, y, w, h, radius);
            c.fillStyle = nullColor ?? "transparent";
            if (nullColor) c.fill();
          }
          c.restore();
        }
      }
      // Col labels
      if (colLabels) {
        c.font = "11px ui-sans-serif, system-ui, sans-serif";
        c.fillStyle = theme.textColor;
        c.textAlign = "center";
        c.textBaseline = "top";
        cols.forEach((cl, i) => {
          c.fillText(
            cl,
            layout.gridX + (i + 0.5) * layout.cellW,
            layout.gridY + layout.gridH + 8,
          );
        });
      }
      // Legend
      if (showLegend && layout.legendY !== null) {
        const barH = 10;
        const ly = layout.legendY + 4;
        const grad = c.createLinearGradient(layout.gridX, 0, layout.gridX + layout.gridW, 0);
        for (let i = 0; i <= 10; i++) {
          grad.addColorStop(i / 10, sampleColorStops(stops, i / 10));
        }
        rx(layout.gridX, ly, layout.gridW, barH, barH / 2);
        c.fillStyle = grad;
        c.fill();
        c.font = "10px ui-sans-serif, system-ui, sans-serif";
        c.fillStyle = theme.subtleText;
        c.textBaseline = "top";
        const span = max - min || 1;
        for (let i = 0; i < legendTicks; i++) {
          const t = legendTicks === 1 ? 0.5 : i / (legendTicks - 1);
          const v = min + span * t;
          const x = layout.gridX + layout.gridW * t;
          c.textAlign = t === 0 ? "left" : t === 1 ? "right" : "center";
          c.fillText(tickLabel(v), x, ly + barH + 4);
        }
      }
      // Annotations
      for (const an of annotations) {
        const r = rows.indexOf(an.row);
        const cc = cols.indexOf(an.col);
        if (r === -1 || cc === -1) continue;
        const isLastRow = r === rows.length - 1;
        const px = layout.gridX + (cc + 0.5) * layout.cellW;
        const py = isLastRow
          ? layout.gridY + layout.gridH + (colLabels ? 22 : 4)
          : layout.gridY + (r + 1) * layout.cellH - 2;
        const w = an.label.length * 5.4 + 16;
        const x = Math.max(
          layout.gridX + 2,
          Math.min(px - w / 2, layout.gridX + layout.gridW - w - 2),
        );
        const fill =
          an.tone === "red"
            ? "#ef4444"
            : an.tone === "amber"
              ? "#f59e0b"
              : theme.annotationBg;
        rx(x, py, w, 18, 9);
        c.fillStyle = fill;
        c.fill();
        c.fillStyle = an.tone === "neutral" ? theme.titleText : "#ffffff";
        c.font = "600 10px ui-sans-serif, system-ui, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(an.label, x + w / 2, py + 9);
      }
      c.restore();
    };
    registerDraw(seriesId, fn);
    return () => unregisterDraw(seriesId);
  }, [
    renderer,
    model,
    hidden,
    seriesId,
    groupOpacity,
    hoverCellIdx,
    valueFmt,
    tierFmt,
    annotations,
    animationsDisabled,
    theme,
  ]);

  // ── SVG ────────────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  if (!model) return null;
  const {
    rows,
    cols,
    cells,
    layout,
    gap,
    radius,
    valueLabels,
    rowLabels,
    colLabels,
    showLegend,
    legendTicks,
    min,
    max,
    stops,
    colorFor,
    nullColor,
  } = model;
  const span = max - min || 1;
  
  const p = settled || animationsDisabled ? 1 : progress;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: groupOpacity,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      <defs>
        <linearGradient id={`hm-${gradId}`} x1="0" y1="0" x2="1" y2="0">
          {Array.from({ length: 11 }, (_, i) => (
            <stop
              key={i}
              offset={`${i * 10}%`}
              stopColor={sampleColorStops(stops, i / 10)}
            />
          ))}
        </linearGradient>
      </defs>
      {rowLabels &&
        rows.map((r, i) => (
          <text
            key={`rl-${r}`}
            x={layout.gridX - 8}
            y={layout.gridY + (i + 0.5) * layout.cellH}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
            fill={theme.textColor}
          >
            {r}
          </text>
        ))}
      {cells.map((cell, idx) => {
        const r = Math.floor(idx / cols.length);
        const cc = idx % cols.length;
        const lp = animationsDisabled ? 1 : cellProgress(p, r, cc, cols.length);
        if (lp <= 0.01) return null;
        const x = layout.gridX + cc * layout.cellW + gap / 2;
        const y = layout.gridY + r * layout.cellH + gap / 2;
        const w = layout.cellW - gap;
        const h = layout.cellH - gap;
        const cx = x + w / 2;
        const cy = y + h / 2;
        const hasValue = cell.value !== null;
        const fill = hasValue ? colorFor(cell.value as number) : nullColor ?? "transparent";
        const scale = lp < 1 ? `translate(${cx} ${cy}) scale(${0.55 + 0.45 * lp}) translate(${-cx} ${-cy})` : undefined;
        const hovered = idx === hoverCellIdx;
        const txt = hasValue && valueLabels && w > 30 && h > 18
          ? valueFmt
            ? valueFmt(cell.value as number, cell.data, cell.index)
            : (cell.value as number).toFixed(2)
          : null;
        const tier =
          txt && tierFmt
            ? tierFmt(cell.value as number, cell.data, cell.index)
            : null;
        return (
          <g key={`c-${r}-${cc}`} opacity={lp} transform={scale}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={Math.min(radius, w / 2, h / 2)}
              fill={fill}
              stroke={
                hovered
                  ? isDark
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(17,24,39,0.6)"
                  : undefined
              }
              strokeWidth={hovered ? 1.5 : undefined}
            />
            {txt && (
              <text
                x={cx}
                y={cy + (tier ? -4 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={600}
                fill={contrastTextColor(fill)}
              >
                {txt}
              </text>
            )}
            {tier && (
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={500}
                opacity={0.72}
                fill={contrastTextColor(fill)}
              >
                {tier}
              </text>
            )}
          </g>
        );
      })}
      {colLabels &&
        cols.map((cl, i) => (
          <text
            key={`cl-${cl}`}
            x={layout.gridX + (i + 0.5) * layout.cellW}
            y={layout.gridY + layout.gridH + 8}
            textAnchor="middle"
            dominantBaseline="hanging"
            fontSize={11}
            fill={theme.textColor}
          >
            {cl}
          </text>
        ))}
      {showLegend &&
        layout.legendY !== null &&
        (() => {
          const legendY = layout.legendY;
          return (
            <g>
          <rect
            x={layout.gridX}
            y={legendY + 4}
            width={layout.gridW}
            height={10}
            rx={5}
            fill={`url(#hm-${gradId})`}
          />
          {Array.from({ length: legendTicks }, (_, i) => {
            const t = legendTicks === 1 ? 0.5 : i / (legendTicks - 1);
            const v = min + span * t;
            return (
              <text
                key={`tick-${i}`}
                x={layout.gridX + layout.gridW * t}
                y={legendY + 4 + 10 + 4}
                textAnchor={t === 0 ? "start" : t === 1 ? "end" : "middle"}
                dominantBaseline="hanging"
                fontSize={10}
                fill={theme.subtleText}
              >
                {tickLabel(v)}
              </text>
            );
          })}
            </g>
          );
        })()}
      {annotations.map((an, i) => {
        const r = rows.indexOf(an.row);
        const cc = cols.indexOf(an.col);
        if (r === -1 || cc === -1) return null;
        const isLastRow = r === rows.length - 1;
        const px = layout.gridX + (cc + 0.5) * layout.cellW;
        const py = isLastRow
          ? layout.gridY + layout.gridH + (colLabels ? 22 : 4)
          : layout.gridY + (r + 1) * layout.cellH - 2;
        const w = an.label.length * 5.4 + 16;
        const x = Math.max(
          layout.gridX + 2,
          Math.min(px - w / 2, layout.gridX + layout.gridW - w - 2),
        );
        const fill =
          an.tone === "red"
            ? "#ef4444"
            : an.tone === "amber"
              ? "#f59e0b"
              : theme.annotationBg;
        return (
          <g key={`an-${i}`}>
            <rect x={x} y={py} width={w} height={18} rx={9} fill={fill} />
            <text
              x={x + w / 2}
              y={py + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fontWeight={600}
              fill={an.tone === "neutral" ? theme.titleText : "#ffffff"}
            >
              {an.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default HeatmapSeries;

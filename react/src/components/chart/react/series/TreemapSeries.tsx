/**
 * <Chart.Treemap> — self-contained squarified tile grid.
 *
 * Layout (owned by this series, like pie/gauge/heatmap): one region per
 * group (squarified by group total), an uppercase header band per group,
 * and squarified child tiles per region. No cartesian scales, no axes.
 *
 * Entrance: per-tile staggered fade/scale in layout order.
 */
import { useEffect, useMemo } from "react";
import {
  computeTreemapLayout,
  DEFAULT_SERIES_PALETTE,
} from "../../engine/index";
import { useChart } from "../ChartContext";
import { seriesDimStyle } from "../series-common";
import type { TreemapSeriesProps } from "../props";
import type { Rect } from "../../engine/index";

const DEFAULT_GAP = 2;

function buildModel(
  d: {
    data: unknown[];
    name?: string;
    treemapItems?: { label: string; value: number; group?: string }[];
    treemapGroups?: string[];
    treemapColor?: string;
    treemapColors?: string[];
    treemapColorAccessor?: (item: unknown, index: number) => string | undefined;
    treemapShowLabels?: boolean;
    treemapValueLabels?: boolean;
    treemapGap?: number;
    treemapCornerRadius?: number;
    treemapGroupHeaderHeight?: number;
    treemapDeltaAccessor?: (item: unknown, index: number) => number | null | undefined;
    paletteIndex: number;
    color?: import("../../engine/types").ChartColor;
  },
  area: { x: number; y: number; width: number; height: number },
  palette: string[],
): {
  layout: ReturnType<typeof computeTreemapLayout>;
  grouped: boolean;
  tiles: {
    rect: Rect;
    inset: Rect;
    label: string;
    value: number;
    data: unknown;
    index: number;
    group: number;
    color: string;
    delta: number | null;
  }[];
  gap: number;
  radius: number;
  showLabels: boolean;
  valueLabels: boolean;
  groupHeaders: { name: string; rect: Rect; total: number }[];
} | null {
  const items = d.treemapItems ?? [];
  if (items.length === 0) return null;
  const grouped = (d.treemapGroups?.length ?? 0) > 0;
  const hh = d.treemapGroupHeaderHeight ?? 18;
  const groups = grouped
    ? (d.treemapGroups ?? []).map((g) => ({
        name: g,
        values: items.filter((it) => it.group === g).map((it) => it.value),
      }))
    : [{ name: d.name ?? "Treemap", values: items.map((it) => it.value) }];
  const layout = computeTreemapLayout(area, groups, grouped ? hh : 0);

  const groupDataIdx: number[][] = groups.map((g) => {
    if (!grouped) return items.map((_, i) => i);
    const out: number[] = [];
    items.forEach((it, i) => {
      if (it.group === g.name) out.push(i);
    });
    return out;
  });

  const gap = d.treemapGap ?? DEFAULT_GAP;
  const radius = d.treemapCornerRadius ?? 0;
  const tiles: {
    rect: Rect;
    inset: Rect;
    label: string;
    value: number;
    data: unknown;
    index: number;
    group: number;
    color: string;
    delta: number | null;
  }[] = [];
  layout.groups.forEach((g, gi) => {
    g.tiles.forEach((r, ti) => {
      const idx = groupDataIdx[gi][ti];
      const it = items[idx];
      const delta =
        d.treemapDeltaAccessor?.(d.data[idx], idx) ?? null;
      tiles.push({
        rect: r,
        inset: {
          x: r.x + gap / 2,
          y: r.y + gap / 2,
          width: Math.max(r.width - gap, 0),
          height: Math.max(r.height - gap, 0),
        },
        label: it.label,
        value: it.value,
        data: d.data[idx],
        index: idx,
        group: gi,
        color: tileColor(d, idx, palette),
        delta,
      });
    });
  });
  const groupHeaders = grouped
    ? layout.groups
        .filter((g) => g.headerH > 0)
        .map((g, gi) => ({
            name: g.name,
            rect: g.rect,
            total: groupDataIdx[gi]
              ? items.filter((it) => it.group === g.name).reduce((a, b) => a + b.value, 0)
              : 0,
          }))
    : [];
  return {
    layout,
    grouped,
    tiles,
    gap,
    radius,
    showLabels: d.treemapShowLabels ?? true,
    valueLabels: d.treemapValueLabels ?? false,
    groupHeaders,
  };
}

function tileColor(
  d: {
    treemapColor?: string;
    treemapColors?: string[];
    treemapColorAccessor?: (item: unknown, index: number) => string | undefined;
    data: unknown[];
    color?: import("../../engine/types").ChartColor;
  },
  index: number,
  palette: string[],
): string {
  const acc = d.treemapColorAccessor?.(d.data[index], index);
  if (acc) return acc;
  if (d.treemapColors?.[index % d.treemapColors.length])
    return d.treemapColors[index % d.treemapColors.length];
  if (d.treemapColor) return d.treemapColor;
  if (typeof d.color === "string") return d.color;
  return palette[index % palette.length] ?? palette[0];
}

function deltaPill(
  delta: number | null,
  fmt?: (value: number, item: unknown, index: number) => string,
  data?: unknown,
  index?: number,
): { text: string; up: boolean } | null {
  if (delta === null || delta === undefined || delta === 0) return null;
  return {
    text: fmt ? fmt(delta, data, index ?? 0) : `${Math.abs(delta)}%`,
    up: delta > 0,
  };
}

export function TreemapSeries(props: TreemapSeriesProps<unknown>) {
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
    isDark,
    series,
  } = ctx;
  const me =
    series.find(
      (s) =>
        s.descriptor.type === "treemap" &&
        (props.id === undefined || s.descriptor.id === props.id),
    ) ?? null;
  const seriesId = me?.descriptor.id ?? "treemap";

  const model = useMemo(
    () =>
      me ? buildModel(me.descriptor, area, DEFAULT_SERIES_PALETTE) : null,
    [me, area],
  );
  const hidden = me?.hidden ?? false;
  const dim = seriesDimStyle(hover, seriesId, hoverDim);
  const groupOpacity = hidden ? 0 : dim;

  const labelFmt = me?.descriptor.treemapLabelFormat;
  const valueFmt = me?.descriptor.treemapValueLabelFormat;
  const deltaFmt = me?.descriptor.treemapDeltaFormat;
  const settled = progress >= 1 || animationsDisabled;
  const p = settled ? 1 : progress;

  // Hovered tile (root hit-tests; match by raw data index).
  const hoverTileIdx = useMemo(() => {
    if (!model || !hover) return -1;
    const it = hover.items.find((i) => i.seriesId === seriesId);
    if (!it || it.index === undefined || it.index < 0) return -1;
    return model.tiles.findIndex((t) => t.index === it.index);
  }, [hover, model, seriesId]);
  const hoverGroup = useMemo(() => {
    if (!model || !hover || model.grouped !== true) return -1;
    const it = hover.items.find((i) => i.seriesId === seriesId);
    if (!it || it.index !== -1) return -1;
    return model.groupHeaders.findIndex((h) => h.name === it.name);
  }, [hover, model, seriesId]);

  // ── Canvas ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !model) return;
    const { tiles, radius, showLabels, valueLabels, groupHeaders } = model;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const pp = animationsDisabled ? 1 : st.progress;
      c.save();
      c.globalAlpha = groupOpacity;
      // Group headers
      for (const h of groupHeaders) {
        c.fillStyle = "rgba(17,24,39,0.88)";
        c.font = "600 10px ui-sans-serif, system-ui, sans-serif";
        c.textAlign = "left";
        c.textBaseline = "middle";
        c.fillText(
          h.name.toUpperCase(),
          h.rect.x + 6,
          h.rect.y + 7,
        );
      }
      // Tiles
      tiles.forEach((t, i) => {
        const lp = animationsDisabled ? 1 : tileProgress(pp, i);
        if (lp <= 0.01) return;
        const r = t.inset;
        if (r.width <= 0 || r.height <= 0) return;
        c.save();
        c.globalAlpha = groupOpacity * lp;
        if (lp < 1) {
          const s = 0.6 + 0.4 * lp;
          c.translate(r.x + r.width / 2, r.y + r.height / 2);
          c.scale(s, s);
          c.translate(-(r.x + r.width / 2), -(r.y + r.height / 2));
        }
        roundedRect(c, r.x, r.y, r.width, r.height, radius);
        c.fillStyle = t.color;
        c.fill();
        if (i === hoverTileIdx) {
          c.strokeStyle = isDark
            ? "rgba(255,255,255,0.85)"
            : "rgba(17,24,39,0.6)";
          c.lineWidth = 1.5;
          c.stroke();
        }
        if (showLabels && !valueLabels && r.width > 34 && r.height > 20) {
          c.textAlign = "center";
          c.textBaseline = "middle";
          const label = labelFmt ? labelFmt(t.label, t.data, t.index) : t.label;
          c.font =
            "500 11px ui-sans-serif, system-ui, sans-serif";
          c.fillStyle = isDark ? "rgba(249,250,251,0.95)" : "rgba(17,24,39,0.9)";
          c.fillText(label, r.x + r.width / 2, r.y + r.height / 2);
        }
        if (valueLabels && r.width > 46 && r.height > 40) {
          c.textBaseline = "alphabetic";
          c.font = "600 11px ui-sans-serif, system-ui, sans-serif";
          c.fillStyle = isDark ? "rgba(249,250,251,0.95)" : "rgba(17,24,39,0.9)";
          c.textAlign = "left";
          c.fillText(
            labelFmt ? labelFmt(t.label, t.data, t.index) : t.label,
            r.x + 8,
            r.y + 16,
          );
          const pill = deltaPill(t.delta, deltaFmt, t.data, t.index);
          if (pill) drawPill(c, r.x + 8, r.y + 22, pill);
          c.fillStyle = isDark
            ? "rgba(156,163,175,0.9)"
            : "rgba(107,114,128,0.95)";
          c.font = "500 10px ui-sans-serif, system-ui, sans-serif";
          c.fillText(
            valueFmt ? valueFmt(t.value, t.data, t.index) : String(t.value),
            r.x + 8,
            r.y + r.height - 8,
          );
        }
        c.restore();
      });
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
    hoverTileIdx,
    hoverGroup,
    labelFmt,
    valueFmt,
    deltaFmt,
    animationsDisabled,
    isDark,
  ]);

  // ── SVG ────────────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  if (!model) return null;
  const { tiles, radius, showLabels, valueLabels, groupHeaders } = model;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: groupOpacity,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {groupHeaders.map((h, i) => (
        <g
          key={`gh-${i}`}
          style={
            i === hoverGroup
              ? { filter: isDark ? "brightness(1.25)" : "brightness(0.92)" }
              : undefined
          }
        >
          <rect
            x={h.rect.x}
            y={h.rect.y}
            width={h.rect.width}
            height={14}
            fill="rgba(17,24,39,0.88)"
          />
          <text
            x={h.rect.x + 6}
            y={h.rect.y + 7}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={600}
            fill="#f9fafb"
          >
            {h.name.toUpperCase()}
          </text>
        </g>
      ))}
      {tiles.map((t, i) => {
        const lp = animationsDisabled ? 1 : tileProgress(p, i);
        if (lp <= 0.01) return null;
        const r = t.inset;
        if (r.width <= 0 || r.height <= 0) return null;
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const scale =
          lp < 1
            ? `translate(${cx} ${cy}) scale(${0.6 + 0.4 * lp}) translate(${-cx} ${-cy})`
            : undefined;
        const label = labelFmt ? labelFmt(t.label, t.data, t.index) : t.label;
        const corner = valueLabels && r.width > 46 && r.height > 40;
        const pill = deltaPill(t.delta, deltaFmt, t.data, t.index);
        const hovered = i === hoverTileIdx;
        return (
          <g key={`t-${i}`} opacity={lp} transform={scale}>
            <rect
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              rx={Math.min(radius, r.width / 2, r.height / 2)}
              fill={t.color}
              stroke={
                hovered
                  ? isDark
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(17,24,39,0.6)"
                  : undefined
              }
              strokeWidth={hovered ? 1.5 : undefined}
            />
            {showLabels && !corner && r.width > 34 && r.height > 20 && (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={500}
                fill={isDark ? "rgba(249,250,251,0.95)" : "rgba(17,24,39,0.9)"}
              >
                {label}
              </text>
            )}
            {corner && (
              <g>
                <text
                  x={r.x + 8}
                  y={r.y + 16}
                  textAnchor="start"
                  dominantBaseline="alphabetic"
                  fontSize={11}
                  fontWeight={600}
                  fill={isDark ? "rgba(249,250,251,0.95)" : "rgba(17,24,39,0.9)"}
                >
                  {label}
                </text>
                {pill && (
                  <g>
                    <rect
                      x={r.x + 8}
                      y={r.y + 21}
                      width={pill.text.length * 5.4 + 14}
                      height={14}
                      rx={7}
                      fill={
                        pill.up
                          ? "rgba(16,185,129,0.18)"
                          : "rgba(239,68,68,0.18)"
                      }
                    />
                    <text
                      x={r.x + 14}
                      y={r.y + 28}
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={9}
                      fontWeight={600}
                      fill={pill.up ? "#10b981" : "#ef4444"}
                    >
                      {pill.up ? "▲" : "▼"} {pill.text}
                    </text>
                  </g>
                )}
                <text
                  x={r.x + 8}
                  y={r.y + r.height - 8}
                  textAnchor="start"
                  dominantBaseline="alphabetic"
                  fontSize={10}
                  fontWeight={500}
                  fill={
                    isDark
                      ? "rgba(156,163,175,0.9)"
                      : "rgba(107,114,128,0.95)"
                  }
                >
                  {valueFmt ? valueFmt(t.value, t.data, t.index) : String(t.value)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** Per-tile entrance progress with a layout-order stagger. */
function tileProgress(progress: number, idx: number): number {
  if (progress >= 1) return 1;
  return Math.max(0, Math.min(1, (progress * 1.4 - idx * 0.04) / 0.9));
}

function roundedRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
}

function drawPill(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  pill: { text: string; up: boolean },
) {
  c.save();
  roundedRect(c, x, y, pill.text.length * 5.4 + 14, 14, 7);
  c.fillStyle = pill.up ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)";
  c.fill();
  c.fillStyle = pill.up ? "#10b981" : "#ef4444";
  c.font = "600 9px ui-sans-serif, system-ui, sans-serif";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillText(`${pill.up ? "▲" : "▼"} ${pill.text}`, x + 6, y + 7);
  c.restore();
}

export default TreemapSeries;

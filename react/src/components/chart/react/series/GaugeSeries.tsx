/**
 * <Chart.Gauge> — a single value on an arc track (pie-family). Zones in
 * value space, optional outside ticks and a target marker; the center
 * readout is the shared <Chart.PieCenter> (registers a pie presentation).
 */
import { arc as d3arc } from "d3-shape";
import { useEffect, useMemo } from "react";
import {
  computeGaugeGeometry,
  gaugePoint,
} from "../../engine/index";
import { resolveToneHex } from "../../engine/index";
import { useChart } from "../ChartContext";
import type { GaugeSeriesProps } from "../props";

type Datum = { startAngle: number; endAngle: number };

// d3 arc paths are centered at the origin; callers position them with a
// translate transform (SVG) or c.translate (canvas).
function arcPath(
  innerRadius: number,
  outerRadius: number,
  seg: { startAngle: number; endAngle: number },
): string {
  const gen = d3arc<Datum>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  return (
    gen({
      startAngle: seg.startAngle,
      endAngle: seg.endAngle,
      data: {} as Datum,
      innerRadius,
      outerRadius,
      padAngle: 0,
    } as never) ?? ""
  );
}

export function GaugeSeries(props: GaugeSeriesProps) {
  const ctx = useChart();
  const {
    renderer,
    area,
    progress,
    registerDraw,
    unregisterDraw,
    theme,
    animationsDisabled,
  } = ctx;
  // Gauge descriptors are type "gauge" (findSeries only matches "pie").
  const state = ctx.series.find(
    (s) =>
      s.descriptor.type === "gauge" &&
      (props.id === undefined || s.descriptor.id === props.id),
  );
  const d = state?.descriptor;

  const hidden = state?.hidden ?? false;
  const seriesId = d?.id ?? "gauge";
  const baseColor = state?.color ?? "#8b5cf6";

  const cx = area.x + area.width / 2;
  const cy = area.y + area.height / 2;
  const outerRadius = Math.max(
    10,
    Math.min(area.width, area.height) / 2 - 8 - ((d?.gaugeTicks?.length ?? 8) + 10),
  );

  const final = useMemo(() => {
    if (!d) return null;
    return computeGaugeGeometry({
      value: d.gaugeValue ?? 0,
      min: d.gaugeMin ?? 0,
      max: d.gaugeMax ?? 100,
      arcSpan: d.gaugeArcSpan,
      startAngle: d.gaugeStartAngle,
      innerRadiusRatio: d.gaugeInnerRadius ?? 0.78,
      zones: d.gaugeZones,
      ticks: d.gaugeTicks,
      targetValue: d.gaugeTarget,
      cx,
      cy,
      outerRadius,
    });
  }, [d, area, outerRadius]);

  const p = animationsDisabled ? 1 : progress;
  const tone = resolveToneHex("red", 0);

  // Entrance: the value arc sweeps in; the track fades in.
  const entranceEnd = (startAngle: number, endAngle: number) => {
    const full = endAngle - startAngle;
    const sweep = full * p;
    return { startAngle, endAngle: startAngle + Math.max(0.0001, sweep) };
  };

  // ── Center readout: register a pie presentation so <Chart.PieCenter> ──
  // (and the pie hover state) work for gauges too.
  const value = d?.gaugeValue ?? 0;
  const max = d?.gaugeMax ?? 100;
  const min = d?.gaugeMin ?? 0;
  const presentation = useMemo(() => {
    if (!d) return null;
    return {
      cx,
      cy,
      innerRadius: final?.innerRadius ?? 0,
      outerRadius: final?.outerRadius ?? 0,
      total: max > min ? max : 0,
      slices: [
        {
          name: d.name ?? "Gauge",
          value,
          color: baseColor,
          labelAngle: final ? final.startAngle + final.arcSpan / 2 : 0,
        },
      ],
    };
  }, [d, final, value, max, min, baseColor]);

  useEffect(() => {
    if (!presentation) return;
    ctx.piePresentations.set(seriesId, presentation);
    ctx.requestRedraw();
    return () => {
      ctx.piePresentations.delete(seriesId);
    };
  }, [presentation, seriesId]);

  // ── Canvas ──────────────────────────────────────────────────────────────
  const trackColor = theme.gridColor;
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D) => {
      c.save();
      c.translate(final.cx, final.cy);
      const segs = final.fillSegments.map((seg) => entranceEnd(seg.startAngle, seg.endAngle));
      if (final.trackSegment) {
        const t = entranceEnd(final.trackSegment.startAngle, final.trackSegment.endAngle);
        c.globalAlpha = 0.35 * p;
        c.fillStyle = trackColor;
        c.fill(new Path2D(arcPath(final.innerRadius, final.outerRadius, t)));
        c.globalAlpha = 1;
      }
      segs.forEach((seg, i) => {
        c.fillStyle = final.fillSegments[i].color;
        c.fill(new Path2D(arcPath(final.innerRadius, final.outerRadius, seg)));
      });
      c.restore();
      // ticks + target in absolute coordinates
      c.save();
      if (final.ticks.length > 0) {
        const len = (d?.gaugeTicks?.length ?? 8) as number;
        c.strokeStyle = theme.subtleText;
        final.ticks.forEach((t) => {
          const r0 = final.outerRadius + 4;
          const r1 = r0 + (t.major ? len : len * 0.5);
          c.lineWidth = t.major ? 1.5 : 1;
          const a0 = gaugePoint(final.cx, final.cy, r0, t.angle);
          const a1 = gaugePoint(final.cx, final.cy, r1, t.angle);
          c.beginPath();
          c.moveTo(a0.x, a0.y);
          c.lineTo(a1.x, a1.y);
          c.stroke();
        });
      }
      // target marker
      if (final.target) {
        c.fillStyle = tone;
        c.beginPath();
        c.arc(final.target.x, final.target.y, 5, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "#fff";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(final.target.x, final.target.y, 5, 0, Math.PI * 2);
        c.stroke();
      }
      c.restore();
    };
    registerDraw(id, fn);
    return () => unregisterDraw(id);
  }, [renderer, final, hidden, seriesId, trackColor, tone, p, theme, registerDraw, unregisterDraw]);

  if (final === null) return null;

  if (renderer !== "svg") return null;

  const tickLen = d?.gaugeTicks?.length ?? 8;

  return (
    <g
      data-chart-series={seriesId}
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 250ms ease" }}
    >
      <g transform={`translate(${final.cx}, ${final.cy})`}>
        {/* Track (remaining span) */}
        {final.trackSegment && (
          <path
            d={arcPath(
              final.innerRadius,
              final.outerRadius,
              entranceEnd(
                final.trackSegment.startAngle,
                final.trackSegment.endAngle,
              ),
            )}
            fill={trackColor}
            opacity={0.35}
          />
        )}
        {/* Value arc zones */}
        {final.fillSegments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(
              final.innerRadius,
              final.outerRadius,
              entranceEnd(seg.startAngle, seg.endAngle),
            )}
            fill={seg.color}
          />
        ))}
      </g>
      {/* Ticks */}
      {final.ticks.map((t, i) => {
        const r0 = final.outerRadius + 4;
        const r1 = r0 + (t.major ? tickLen : tickLen * 0.5);
        const a0 = gaugePoint(final.cx, final.cy, r0, t.angle);
        const a1 = gaugePoint(final.cx, final.cy, r1, t.angle);
        return (
          <line
            key={i}
            x1={a0.x}
            y1={a0.y}
            x2={a1.x}
            y2={a1.y}
            stroke={theme.subtleText}
            strokeWidth={t.major ? 1.5 : 1}
          />
        );
      })}
      {/* Target marker */}
      {final.target && (
        <g>
          <circle
            cx={final.target.x}
            cy={final.target.y}
            r={5}
            fill={tone}
            stroke="#fff"
            strokeWidth={2}
          />
          {d?.gaugeTargetLabel && (
            <text
              x={final.target.labelX}
              y={final.target.labelY}
              fontSize={11}
              fontWeight={600}
              fill={tone}
              textAnchor="middle"
            >
              {d.gaugeTargetLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
}


<script lang="ts">
import type { TrueColor } from "../theme";
import type { StatTileProps } from "./StatTile.vue";

export interface StatGraphSeries {
  key: string;
  label: string;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
}

export interface StatGraphTileProps
  extends Omit<
    StatTileProps,
    "body" | "progress" | "trend" | "meta" | "footer"
  > {
  data: any[];
  variant: "bar" | "sparkline";
  series: StatGraphSeries[];
  height?: number;
  showLegend?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  /** Y-axis domain for sparkline. Defaults to [0, 'auto']. Use ['auto', 'auto'] for auto-scaling. */
  yDomain?: [number | string, number | string];
  /** Enable chart enter/update animation. Keep disabled for high-frequency realtime updates. */
  chartAnimation?: boolean;
  /** Animation duration when chartAnimation is enabled. */
  chartAnimationDuration?: number;
  /** Optional cap for rendered data points to reduce chart redraw work. */
  maxDataPoints?: number;
}

interface TooltipEntry {
  dataKey: string;
  value: unknown;
  fill: string;
  seriesLabel: string;
}

interface TooltipState {
  x: number;
  y: number;
  payload: TooltipEntry[];
  label: string;
}

// Graph colors helper
const colorMap: Record<string, string> = {
  // Spectrum colors (ThemeMultiColor — Tailwind 500 hex values)
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  text: "#64748b",
  grid: "#e2e8f0",
};

const getColor = (color: string) => colorMap[color] || "#3b82f6";

const textColor = "#64748b";
const gridColor = "#e2e8f0";

/** Compute a "nice" tick step (1/2/5 * 10^n) for the given max and tick count. */
function niceStep(max: number, count: number): number {
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import StatTile from "./StatTile.vue";
import { getColorPaletteNames } from "../theme";

defineOptions({ name: "StatGraphTile" });

const props = withDefaults(defineProps<StatGraphTileProps>(), {
  variant: "bar",
  height: 200,
  showLegend: true,
  showAxes: true,
  showGrid: true,
  showTooltip: true,
  yDomain: () => [0, "auto"] as [number | string, number | string],
  chartAnimation: true,
  chartAnimationDuration: 250,
  maxDataPoints: 0,
});

const resolvedSeries = computed(() => {
  const palette = getColorPaletteNames(props.series.length);
  return props.series.map((s, i) => ({
    ...s,
    color: (s.color ?? palette[i]) as TrueColor,
  }));
});

const chartData = computed(() => {
  if (
    !props.maxDataPoints ||
    props.maxDataPoints <= 0 ||
    props.data.length <= props.maxDataPoints
  )
    return props.data;
  return props.data.slice(-props.maxDataPoints);
});

const statTileProps = computed(() => {
  const {
    data: _data,
    variant: _variant,
    series: _series,
    height: _height,
    showLegend: _showLegend,
    showAxes: _showAxes,
    showGrid: _showGrid,
    showTooltip: _showTooltip,
    yDomain: _yDomain,
    chartAnimation: _chartAnimation,
    chartAnimationDuration: _chartAnimationDuration,
    maxDataPoints: _maxDataPoints,
    ...rest
  } = props;
  return rest;
});

// ── Container measurement (ResponsiveContainer replacement) ──────────────────

const wrapperRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;

watch(
  wrapperRef,
  (el) => {
    resizeObserver?.disconnect();
    if (el && typeof ResizeObserver !== "undefined") {
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) containerWidth.value = entry.contentRect.width;
        });
      }
      containerWidth.value = el.clientWidth;
      resizeObserver.observe(el);
    }
  },
  { flush: "post" },
);

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// ── Tooltip (portal via Teleport, same markup as the React kit) ───────────────

const tooltip = ref<TooltipState | null>(null);
const hoveredBand = ref<number | null>(null);
const activeIndex = ref<number | null>(null);

const clearHover = () => {
  hoveredBand.value = null;
  activeIndex.value = null;
  tooltip.value = null;
};

// ── Bar chart geometry ────────────────────────────────────────────────────────

const plotTop = 10;
const plotLeft = computed(() => (props.showAxes ? 40 : 0));
const plotBottom = computed(() => props.height - (props.showAxes ? 30 : 0));

const dataMax = computed(() => {
  let max = 0;
  for (const row of chartData.value) {
    for (const s of resolvedSeries.value) {
      const v = Number(row?.[s.key] ?? 0);
      if (Number.isFinite(v) && v > max) max = v;
    }
  }
  return max;
});

const yTicks = computed(() => {
  const max = dataMax.value > 0 ? dataMax.value : 1;
  const step = niceStep(max, 4);
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= top + step / 2; t += step) {
    ticks.push(Math.round(t * 1000) / 1000);
  }
  return ticks;
});

const yMax = computed(() => yTicks.value[yTicks.value.length - 1] || 1);

const yScale = (v: number) => {
  const bottom = plotBottom.value;
  return bottom - (v / yMax.value) * (bottom - plotTop);
};

interface BarRect {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  value: number;
}

interface BarBand {
  label: string;
  x: number;
  width: number;
  rects: BarRect[];
}

const bars = computed<BarBand[]>(() => {
  const rows = chartData.value;
  const n = rows.length;
  const plotWidth = containerWidth.value - plotLeft.value;
  if (!n || plotWidth <= 0) return [];
  const bandWidth = plotWidth / n;
  const seriesList = resolvedSeries.value;
  const m = seriesList.length;
  const barSize = 8;
  const barGap = 4;
  const groupWidth = m * barSize + (m - 1) * barGap;
  return rows.map((row, i) => {
    const bandX = plotLeft.value + i * bandWidth;
    const rects = seriesList.map((s, j) => {
      const v = Number(row?.[s.key] ?? 0);
      const y = yScale(Math.max(0, Number.isFinite(v) ? v : 0));
      return {
        key: s.key,
        x: bandX + bandWidth / 2 - groupWidth / 2 + j * (barSize + barGap),
        y,
        width: barSize,
        height: Math.max(0, plotBottom.value - y),
        fill: getColor(s.color),
        value: v,
      };
    });
    return { label: String(row?.name ?? ""), x: bandX, width: bandWidth, rects };
  });
});

const hoveredBandRect = computed(() =>
  hoveredBand.value !== null ? (bars.value[hoveredBand.value] ?? null) : null,
);

const onBarMouseMove = (e: MouseEvent) => {
  const el = wrapperRef.value;
  const bands = bars.value;
  if (!el || !bands.length) return;
  const rect = el.getBoundingClientRect();
  const localX = e.clientX - rect.left;
  const bandWidth = bands[0].width;
  let idx = Math.floor((localX - plotLeft.value) / bandWidth);
  idx = Math.max(0, Math.min(bands.length - 1, idx));
  hoveredBand.value = idx;
  if (!props.showTooltip) return;
  const row = chartData.value[idx];
  tooltip.value = {
    x: e.clientX,
    y: e.clientY,
    label: String(row?.name ?? ""),
    payload: resolvedSeries.value.map((s) => ({
      dataKey: s.key,
      value: row?.[s.key],
      fill: getColor(s.color),
      seriesLabel: s.label,
    })),
  };
};

// ── Sparkline geometry ────────────────────────────────────────────────────────

const sparkHeight = 80;
const sparkMargin = 5;

const sparkSeries = computed(() => resolvedSeries.value[0] ?? null);

const sparkValues = computed(() => {
  const s = sparkSeries.value;
  if (!s) return [];
  return chartData.value.map((row) => {
    const v = Number(row?.[s.key] ?? 0);
    return Number.isFinite(v) ? v : 0;
  });
});

const sparkDomain = computed(() => {
  const vals = sparkValues.value;
  const dataMin = vals.length ? Math.min(...vals) : 0;
  const dataMaxVal = vals.length ? Math.max(...vals) : 0;
  const [d0, d1] = props.yDomain;
  const min = typeof d0 === "number" ? d0 : dataMin;
  let max = typeof d1 === "number" ? d1 : dataMaxVal;
  if (max <= min) max = min + 1;
  return [min, max] as const;
});

const sparkPoints = computed(() => {
  const vals = sparkValues.value;
  const w = containerWidth.value;
  const n = vals.length;
  const [min, max] = sparkDomain.value;
  return vals.map((v, i) => ({
    x:
      n > 1
        ? sparkMargin + (i / (n - 1)) * (w - 2 * sparkMargin)
        : w / 2,
    y:
      sparkMargin +
      (1 - (v - min) / (max - min)) * (sparkHeight - 2 * sparkMargin),
    value: v,
  }));
});

const sparkPolyline = computed(() =>
  sparkPoints.value.map((p) => `${p.x},${p.y}`).join(" "),
);

const sparkColor = computed(() => getColor(sparkSeries.value?.color ?? "blue"));

const activePoint = computed(() =>
  activeIndex.value !== null
    ? (sparkPoints.value[activeIndex.value] ?? null)
    : null,
);

const onSparkMouseMove = (e: MouseEvent) => {
  const el = wrapperRef.value;
  const pts = sparkPoints.value;
  const s = sparkSeries.value;
  if (!el || !pts.length || !s || !props.showTooltip) return;
  const rect = el.getBoundingClientRect();
  const localX = e.clientX - rect.left;
  let nearest = 0;
  let best = Infinity;
  pts.forEach((p, i) => {
    const d = Math.abs(p.x - localX);
    if (d < best) {
      best = d;
      nearest = i;
    }
  });
  activeIndex.value = nearest;
  const p = pts[nearest];
  tooltip.value = {
    x: rect.left + p.x,
    y: rect.top + p.y,
    label: String(chartData.value[nearest]?.name ?? ""),
    payload: [
      {
        dataKey: s.key,
        value: p.value,
        fill: getColor(s.color),
        seriesLabel: s.label,
      },
    ],
  };
};

const chartTransitionStyle = computed(() =>
  props.chartAnimation
    ? { transition: `all ${props.chartAnimationDuration}ms ease-out` }
    : undefined,
);
</script>

<template>
  <StatTile v-bind="statTileProps">
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <!-- Legend (bar only) -->
    <template v-if="showLegend && variant === 'bar'" #actions>
      <div class="flex items-center space-x-4">
        <div v-for="s in resolvedSeries" :key="s.key" class="flex items-center">
          <div
            class="w-2.5 h-2.5 rounded-full mr-2"
            :style="{ backgroundColor: getColor(s.color) }"
          />
          <span
            class="text-xs text-neutral-500 dark:text-neutral-400 font-medium"
          >
            {{ s.label }}
          </span>
        </div>
      </div>
    </template>
    <template v-else-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>

    <template #body>
      <div class="flex flex-col h-full w-full">
        <!-- Sparkline -->
        <div v-if="variant === 'sparkline'" class="mt-2 mb-4 px-1">
          <div
            ref="wrapperRef"
            class="relative"
            :style="{ height: `${sparkHeight}px` }"
            @mouseleave="clearHover"
          >
            <svg
              v-if="containerWidth > 0 && sparkPoints.length > 0"
              class="block"
              :width="containerWidth"
              :height="sparkHeight"
              @mousemove="onSparkMouseMove"
            >
              <polyline
                :points="sparkPolyline"
                fill="none"
                :stroke="sparkColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="chartTransitionStyle"
              />
              <circle
                v-if="activePoint"
                :cx="activePoint.x"
                :cy="activePoint.y"
                r="6"
                :fill="sparkColor"
              />
            </svg>
          </div>
          <div class="mt-4">
            <div class="text-3xl font-bold text-neutral-900 dark:text-white">
              <slot name="value">{{ value }}</slot>
            </div>
            <div
              v-if="subtitle || $slots.subtitle"
              class="text-sm text-neutral-500 dark:text-neutral-400 mt-1"
            >
              <slot name="subtitle">{{ subtitle }}</slot>
            </div>
          </div>
        </div>

        <!-- Bar chart -->
        <div v-if="variant === 'bar'" class="mt-4">
          <div
            ref="wrapperRef"
            class="relative"
            :style="{ height: `${height}px` }"
            @mouseleave="clearHover"
          >
            <svg
              v-if="containerWidth > 0"
              class="block"
              :width="containerWidth"
              :height="height"
              @mousemove="onBarMouseMove"
            >
              <!-- Grid -->
              <template v-if="showGrid">
                <line
                  v-for="(t, i) in yTicks"
                  :key="`grid-${i}`"
                  :x1="plotLeft"
                  :x2="containerWidth"
                  :y1="yScale(t)"
                  :y2="yScale(t)"
                  :stroke="gridColor"
                  stroke-dasharray="3 3"
                  opacity="0.5"
                />
              </template>

              <!-- Axes -->
              <template v-if="showAxes">
                <text
                  v-for="(t, i) in yTicks"
                  :key="`ytick-${i}`"
                  :x="plotLeft - 8"
                  :y="yScale(t)"
                  text-anchor="end"
                  dominant-baseline="central"
                  :fill="textColor"
                  font-size="12"
                >
                  {{ t }}
                </text>
                <text
                  v-for="(band, i) in bars"
                  :key="`xtick-${i}`"
                  :x="band.x + band.width / 2"
                  :y="plotBottom + 22"
                  text-anchor="middle"
                  :fill="textColor"
                  font-size="12"
                >
                  {{ band.label }}
                </text>
              </template>

              <!-- Hover cursor (recharts cursor fill) -->
              <rect
                v-if="hoveredBandRect"
                :x="hoveredBandRect.x"
                :y="plotTop"
                :width="hoveredBandRect.width"
                :height="Math.max(0, plotBottom - plotTop)"
                fill="rgba(100,116,139,0.05)"
              />

              <!-- Bars -->
              <template v-for="(band, i) in bars" :key="`band-${i}`">
                <rect
                  v-for="bar in band.rects"
                  :key="bar.key"
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.width"
                  :height="bar.height"
                  :rx="Math.min(4, bar.width / 2, bar.height / 2)"
                  :fill="bar.fill"
                  :style="chartTransitionStyle"
                />
              </template>
            </svg>
          </div>
        </div>

        <!-- Portal tooltip (same approach as MultiProgressBar) -->
        <Teleport to="body">
          <div
            v-if="tooltip && tooltip.payload.length > 0"
            class="fixed z-[9999] pointer-events-none"
            :style="{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, calc(-100% - 12px))',
            }"
          >
            <div
              class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl ring-1 ring-black/10 dark:ring-black/5 min-w-[100px]"
            >
              <div
                v-for="entry in tooltip.payload"
                :key="entry.dataKey"
                class="flex items-center gap-2"
              >
                <span
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: entry.fill }"
                />
                <span class="font-semibold">{{ entry.value }}</span>
                <span
                  v-if="entry.seriesLabel"
                  class="text-neutral-400 dark:text-neutral-500"
                >
                  {{ entry.seriesLabel }}
                </span>
              </div>
            </div>
            <!-- Arrow -->
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-neutral-900 dark:border-t-white"
            />
          </div>
        </Teleport>
      </div>
    </template>
  </StatTile>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Chart, type Plugin } from 'chart.js'
import PrimeChart from 'primevue/chart'

export interface Series {
  id: string
  label: string
  color: string
  style?: 'solid' | 'dotted' | 'dashed'
  area?: boolean
  emphasizeLastPoint?: boolean
  loading?: boolean
}

export interface Metric {
  label: string
  value: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    tag?: string
    series: Series[]
    categories: string[]
    data: Record<string, number>[]
    showYAxis?: boolean
    metrics?: Metric[]
  }>(),
  {
    subtitle: '',
    tag: '',
    showYAxis: false,
    metrics: () => [],
  }
)

const gradientPlugin: Plugin = {
  id: 'gradientFill',
  afterDraw: (chart) => {
    const ctx = chart.ctx
    const chartArea = chart.chartArea
    const gradientCache: Record<string, CanvasGradient> = {}

    chart.data.datasets.forEach((dataset) => {
      const ds = dataset as { fill?: boolean | string; borderColor?: string }
      if (!ds.fill) return

      const key = ds.borderColor as string
      if (!gradientCache[key]) {
        const gradient = ctx.createLinearGradient(
          chartArea.left,
          chartArea.top,
          chartArea.left,
          chartArea.bottom,
        )
        const color = key
        gradient.addColorStop(0, hexToRgba(color, 0.15))
        gradient.addColorStop(1, hexToRgba(color, 0))
        gradientCache[key] = gradient
      }

      dataset.backgroundColor = gradientCache[key]
    })
  },
}

Chart.register(gradientPlugin)

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const chartData = computed(() => ({
  labels: props.categories,
  datasets: props.series.map((s) => ({
    label: s.label,
    data: props.data.map((row) => row[s.id] ?? 0),
    borderColor: s.color,
    backgroundColor: s.area ? hexToRgba(s.color, 0.15) : 'transparent',
    borderWidth: 2,
    borderDash: s.style === 'dotted' ? [4, 4] : s.style === 'dashed' ? [8, 4] : [],
    fill: s.area,
    tension: 0.3,
    pointRadius: 0,
    pointHoverRadius: 5,
    ...(s.emphasizeLastPoint
      ? {
          plugins: {
            datalabels: {
              align: 'top',
              color: s.color,
            },
          },
        }
      : {}),
  })),
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
    gradientFill: { enabled: true },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: (ctx: { label?: string }[]) => ctx[0]?.label ?? '',
        label: (ctx: { datasetLabel?: string; formattedValue?: string }) =>
          `${ctx.datasetLabel ?? ''}: ${ctx.formattedValue ?? ''}`,
      },
    },
  },
  scales: {
    x: {
      display: true,
      grid: { display: false },
      ticks: {
        color: '#9ca3af',
        font: { size: 11 },
      },
    },
    y: {
      display: props.showYAxis,
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
      ticks: {
        display: props.showYAxis,
        color: '#9ca3af',
        font: { size: 11 },
      },
    },
  },
}))
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-baseline justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="mt-0.5 text-sm text-gray-400">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div
          v-for="s in series"
          :key="s.id"
          class="flex items-center gap-1.5"
        >
          <span
            class="h-2.5 w-2.5 shrink-0 rounded-full"
            :style="{ backgroundColor: s.color }"
          ></span>
          <span class="text-xs font-medium text-gray-600">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <div v-if="tag" class="mb-3">
      <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-mono text-blue-700 ring-1 ring-blue-200">
        {{ tag }}
      </span>
    </div>

    <div class="flex-1">
      <div class="h-48 w-full">
        <PrimeChart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
      </div>
    </div>

    <div
      v-if="metrics.length > 0"
      class="mt-4 border-t border-gray-200 pt-3"
    >
      <div class="grid grid-cols-2 gap-3 divide-gray-200 sm:grid-cols-4 sm:divide-x">
        <div
          v-for="(metric, index) in metrics"
          :key="index"
          class="flex flex-col items-center px-3 py-2"
        >
          <span class="mb-1 text-center text-xs uppercase text-gray-400">
            {{ metric.label }}
          </span>
          <span
            class="text-xl font-bold"
            :class="metric.color ? metric.color : 'text-gray-900'"
          >
            {{ metric.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

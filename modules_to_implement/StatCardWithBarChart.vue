<script setup lang="ts">
import { computed } from 'vue'
import { Chart, type Plugin } from 'chart.js'
import PrimeChart from 'primevue/chart'
import PrimeTag from 'primevue/tag'
import Panel from './Panel.vue'

export type TagSeverity = 'info' | 'success' | 'danger' | 'warning' | 'secondary' | 'contrast'
export type BarColor =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | string

export interface BarChartPoint {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    value: string
    valueLabel?: string
    tag?: string
    tagSeverity?: TagSeverity
    delta?: string
    data?: BarChartPoint[]
    barColors?: BarColor | BarColor[]
    height?: number
    lastBarOngoing?: boolean
    loading?: boolean
    hideChart?: boolean
  }>(),
  {
    subtitle: '',
    tag: '',
    tagSeverity: 'info',
    delta: '',
    barColors: 'primary',
    height: 80,
    lastBarOngoing: false,
    hideChart: false,
  }
)

const colorMap: Record<string, string> = {
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  primary: '#2563eb',
  secondary: '#64748b',
}

function resolveColor(color: BarColor): string {
  if (color in colorMap) return colorMap[color]
  return color
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function lightenColor(color: string, alpha: number): string {
  if (color.startsWith('rgba')) return color
  if (color.startsWith('rgb')) return color
  return hexToRgba(color, alpha)
}

const originalBarColors = computed(() => {
  const colors = props.barColors
  if (Array.isArray(colors)) {
    return colors.map(resolveColor)
  }
  return [resolveColor(colors)]
})

const barColorsArray = computed(() => {
  const colors = props.barColors
  let result: string[] | string
  if (Array.isArray(colors)) {
    result = colors.map(resolveColor)
  } else {
    result = resolveColor(colors)
  }

  if (props.lastBarOngoing && Array.isArray(result) && result.length > 0) {
    const lightened = [...result]
    lightened[lightened.length - 1] = lightenColor(lightened[lightened.length - 1], 0.4)
    return lightened
  }

  return result
})

const chartData = computed(() => {
  const points = (props.data ?? []).slice(-7)
  console.log('[StatCardWithBarChart] chartData points:', points)
  const result = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        data: points.map((p) => p.value),
        backgroundColor: barColorsArray.value,
        borderColor: barColorsArray.value,
        borderWidth: 0,
        borderRadius: 4,
        barThickness: 24,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
    ],
  }
  console.log('[StatCardWithBarChart] chartData result:', result)
  return result
})

const dashedBorderPlugin: Plugin = {
  id: 'dashedBorder',
  afterDraw: (chart) => {
    const opts = chart.options as Record<string, unknown>
    const pluginOpts = (opts.plugins as Record<string, unknown> | undefined)?.dashedBorder as
      | { enabled?: boolean; borderColor?: string }
      | undefined
    if (!pluginOpts?.enabled) return

    const meta = chart.getDatasetMeta(0)
    const lastBarIndex = meta.data.length - 1
    const lastBar = meta.data[lastBarIndex] as unknown as { x: number; y: number; width: number; height: number }

    if (!lastBar) return

    const ctx = chart.ctx
    const halfWidth = lastBar.width / 2
    const bottomY = lastBar.y + lastBar.height / 2
    ctx.save()
    ctx.setLineDash([5, 3])
    ctx.strokeStyle = pluginOpts.borderColor ?? '#9ca3af'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(lastBar.x - halfWidth, bottomY)
    ctx.lineTo(lastBar.x + halfWidth, bottomY)
    ctx.stroke()
    ctx.restore()
  },
}

Chart.register(dashedBorderPlugin)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
    dashedBorder: {
      enabled: props.lastBarOngoing,
      borderColor: props.lastBarOngoing
        ? originalBarColors.value[originalBarColors.value.length - 1]
        : undefined,
    },
    tooltip: {
      callbacks: {
        title: (ctx: { label?: string }[]) => ctx[0]?.label ?? '',
        label: (ctx: { formattedValue?: string }) => `Value: ${ctx.formattedValue ?? ''}`,
      },
    },
  },
  scales: {
    x: {
      display: false,
      grid: { display: false },
      ticks: { display: false },
    },
    y: {
      display: true,
      grid: { display: false },
      ticks: { display: false },
      border: { display: false },
      beginAtZero: true,
    },
  },
}))

const deltaIsPositive = computed(() => props.delta && props.delta.startsWith('+'))
const deltaIsNegative = computed(() => props.delta && props.delta.startsWith('-'))
</script>

<template>
  <Panel tone="default" class="cursor-default h-full" :loading="loading">
    <div class="flex flex-col h-full">
      <dt class="truncate text-lg font-bold text-text">
        {{ title }}
      </dt>
      <dd v-if="subtitle" class="mt-1 truncate text-sm text-text-secondary">
        {{ subtitle }}
      </dd>
      <div class="mt-2 flex items-center gap-2">
        <span class="text-3xl font-semibold text-text">{{ value }}</span>
        <span v-if="valueLabel" class="text-sm text-text-secondary">{{ valueLabel }}</span>
        <template v-if="tag">
          <span v-if="delta" class="text-sm font-medium" :class="{
            'text-success': deltaIsPositive,
            'text-danger': deltaIsNegative,
          }">
            {{ delta }}
          </span>
          <PrimeTag :value="tag" :severity="tagSeverity" class="text-xs" />
        </template>
      </div>
      <div class="grow"></div>
      <div v-if="!hideChart" class="mt-3 overflow-hidden" :style="{ height: `${height}px` }">
        <PrimeChart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
      </div>
    </div>
  </Panel>
</template>

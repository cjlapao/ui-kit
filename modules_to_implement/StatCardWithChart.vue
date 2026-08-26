<script setup lang="ts">
import { ref, computed } from 'vue'
import PrimeChart from 'primevue/chart'
import PrimeTag from 'primevue/tag'
import Panel from './Panel.vue'

export type TagSeverity = 'info' | 'success' | 'danger' | 'warning' | 'secondary' | 'contrast'

export interface StatCardChartPoint {
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
    data?: StatCardChartPoint[]
    height?: number
    hideChart?: boolean
    loading?: boolean
  }>(),
  {
    subtitle: '',
    tag: '',
    tagSeverity: 'info',
    delta: '',
    height: 60,
    hideChart: false,
  }
)

const chartData = computed(() => {
  const points = props.data ?? []
  return {
    labels: points.map((p) => p.label),
    datasets: [
      {
        data: points.map((p) => p.value),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
    ],
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
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
})

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
      <div v-if="!hideChart" class="overflow-hidden" :style="{ height: `${height}px` }">
        <PrimeChart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrimeChart from 'primevue/chart'

export interface BreakdownItem {
  id: string
  label: string
  value: number
  displayValue?: string
  color: string
}

export interface StatRow {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    title: string
    caption?: string
    items: BreakdownItem[]
    stats?: StatRow[]
    ctaLabel?: string
  }>(),
  {
    caption: '',
    stats: () => [],
    ctaLabel: '',
  }
)

const emit = defineEmits<{
  (e: 'cta-click'): void
}>()

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))

const chartData = computed(() => ({
  labels: props.items.map((item) => item.label),
  datasets: [
    {
      data: props.items.map((item) => item.value),
      backgroundColor: props.items.map((item) => item.color),
      borderColor: '#ffffff',
      borderWidth: 2,
      cutout: '55%',
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
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
}))

const hasStats = computed(() => props.stats && props.stats.length > 0)
const hasCta = computed(() => !!props.ctaLabel)
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-baseline justify-between">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <span v-if="caption" class="text-sm text-gray-400">{{ caption }}</span>
    </div>

    <div class="flex flex-1 gap-6">
      <div class="relative h-40 w-40 flex-shrink-0">
        <PrimeChart type="doughnut" :data="chartData" :options="chartOptions" class="h-full w-full" />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-bold text-gray-700">{{ total }}</span>
        </div>
      </div>

      <div class="flex-1 space-y-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span
              class="h-3 w-3 shrink-0 rounded-full"
              :style="{ backgroundColor: item.color }"
            ></span>
            <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
          </div>
          <span class="text-sm font-bold text-gray-900">{{ item.displayValue ?? item.value }}</span>
        </div>
      </div>
    </div>

    <div v-if="hasStats" class="mt-4 border-t border-gray-200 pt-3">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="flex items-center justify-between py-1.5"
      >
        <span class="text-sm text-gray-400">{{ stat.label }}</span>
        <span class="text-sm font-bold text-gray-900">{{ stat.value }}</span>
      </div>
    </div>

    <button
      v-if="hasCta"
      class="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-bold text-blue-600 hover:bg-blue-50"
      @click="emit('cta-click')"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type Semantic = 'good' | 'warning' | 'bad' | 'neutral'

export interface BarItem {
  id: string
  label: string
  code?: string
  value: number
  displayValue?: string
  secondaryValue?: string
  secondaryState?: Semantic
  color?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    caption?: string
    tag?: string
    items: BarItem[]
    maxValue?: number
  }>(),
  {
    caption: '',
    tag: '',
    maxValue: 0,
  }
)

const effectiveMax = computed(() => {
  if (props.maxValue && props.maxValue > 0) return props.maxValue
  return Math.max(...props.items.map((item) => item.value), 1)
})

const semanticColors: Record<Semantic, string> = {
  good: 'text-green-600',
  warning: 'text-amber-600',
  bad: 'text-red-600',
  neutral: 'text-gray-600',
}

function getSecondaryColor(state?: Semantic): string {
  if (!state) return 'text-gray-600'
  return semanticColors[state]
}
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-baseline justify-between">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <span v-if="caption" class="text-sm text-gray-400">{{ caption }}</span>
    </div>

    <div v-if="tag" class="mb-3">
      <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-mono text-blue-700 ring-1 ring-blue-200">
        {{ tag }}
      </span>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="space-y-1.5"
      >
        <div class="flex items-baseline justify-between">
          <div class="flex items-baseline gap-2">
            <span class="font-bold text-gray-900">{{ item.label }}</span>
            <span v-if="item.code" class="text-xs font-mono text-gray-400">
              {{ item.code }}
            </span>
          </div>
          <div class="flex items-baseline gap-2 text-sm">
            <span
              v-if="item.displayValue"
              class="font-mono text-gray-500"
            >
              {{ item.displayValue }}
            </span>
            <span
              v-if="item.secondaryValue"
              :class="getSecondaryColor(item.secondaryState)"
              class="font-medium"
            >
              {{ item.secondaryValue }}
            </span>
          </div>
        </div>

        <div class="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="{
              'bg-blue-600': !item.color,
            }"
            :style="{
              width: `${(item.value / effectiveMax) * 100}%`,
              backgroundColor: item.color,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

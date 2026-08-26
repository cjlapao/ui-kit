<script setup lang="ts">
export type ActivityVariant = 'warning' | 'error' | 'success' | 'info' | 'neutral' | 'special'

export interface ActivityItem {
  id: string
  variant: ActivityVariant
  title: string
  description?: string
  code?: string
  actor?: string
  timestamp: string
  count?: number
}

const props = withDefaults(
  defineProps<{
    title?: string
    filters?: { label: string; value: string }[]
    activeFilter?: string
    linkLabel?: string
    tag?: string
    items: ActivityItem[]
    hasMore?: boolean
    loadMoreLabel?: string
    totalCount?: number
  }>(),
  {
    title: 'Recent activity',
    filters: () => [],
    activeFilter: 'all',
    linkLabel: 'Full audit log',
    tag: '',
    hasMore: true,
    loadMoreLabel: 'Load more',
    totalCount: 0,
  }
)

const emit = defineEmits<{
  (e: 'filter-change', value: string): void
  (e: 'link-click'): void
  (e: 'load-more'): void
}>()

interface VariantStyle {
  bg: string
  icon: string
  iconColor: string
}

const variantStyles: Record<ActivityVariant, VariantStyle> = {
  warning: { bg: 'bg-amber-100', icon: '!', iconColor: 'text-amber-600' },
  error: { bg: 'bg-red-100', icon: '✕', iconColor: 'text-red-600' },
  success: { bg: 'bg-green-100', icon: '✓', iconColor: 'text-green-600' },
  info: { bg: 'bg-blue-100', icon: '↑', iconColor: 'text-blue-600' },
  neutral: { bg: 'bg-blue-100', icon: '+', iconColor: 'text-blue-600' },
  special: { bg: 'bg-gray-100', icon: '$', iconColor: 'text-gray-600' },
}

const getVariantStyle = (variant: ActivityVariant): VariantStyle => {
  return variantStyles[variant] ?? variantStyles.info
}
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-baseline justify-between">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <div v-if="filters.length > 0" class="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium transition-all',
            activeFilter === filter.value
              ? 'rounded-full bg-blue-100 text-blue-700 ring-2 ring-blue-200'
              : 'rounded-full text-gray-600 hover:text-gray-900',
          ]"
          @click="emit('filter-change', filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
      <span v-if="totalCount > 0" class="text-sm text-gray-500">{{ totalCount }} total</span>
    </div>

    <div
      v-if="linkLabel"
      class="mb-3 flex items-baseline justify-between"
    >
      <button
        class="text-left text-sm text-blue-600 hover:text-blue-700 hover:underline"
        @click="emit('link-click')"
      >
        {{ linkLabel }}
      </button>
      <span
        v-if="tag"
        class="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-xs font-mono text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <div class="flex-1 space-y-0">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-start gap-3 py-3"
      >
        <div
          v-if="index > 0"
          class="absolute inset-x-0 top-0 h-px bg-gray-200"
        ></div>
        <div
          :class="[
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
            getVariantStyle(item.variant).bg,
            getVariantStyle(item.variant).iconColor,
          ]"
        >
          {{ getVariantStyle(item.variant).icon }}
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm">
            <span class="font-bold text-gray-900">{{ item.title }}</span>
            <span v-if="item.description" class="text-gray-600">
              — {{ item.description }}
            </span>
            <span v-if="item.count !== undefined" class="ml-2 text-sm font-medium text-gray-700">
              ({{ item.count }} agents)
            </span>
          </p>
          <p
            v-if="item.code || item.actor"
            class="mt-1 text-xs text-gray-400"
          >
            <span v-if="item.code" class="font-mono">{{ item.code }}</span>
            <span v-if="item.code && item.actor" class="mx-1">·</span>
            <span v-if="item.actor">{{ item.actor }}</span>
          </p>
        </div>

        <span class="shrink-0 text-xs text-gray-400">{{ item.timestamp }}</span>
      </div>
    </div>

    <button
      v-if="hasMore"
      class="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-bold text-gray-800 hover:bg-gray-50"
      @click="emit('load-more')"
    >
      {{ loadMoreLabel }}
    </button>
  </div>
</template>

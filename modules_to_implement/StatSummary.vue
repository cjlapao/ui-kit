<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    applied?: number
    pending?: number
    failed?: number
  }>(),
  {
    title: 'Policy expectations',
    applied: 15,
    pending: 6,
    failed: 3,
  }
)

const emit = defineEmits<{
  (e: 'manage-click'): void
}>()

const total = computed(() => props.applied + props.pending + props.failed)

const appliedPct = computed(() => (props.applied / total.value) * 100)
const pendingPct = computed(() => (props.pending / total.value) * 100)
const failedPct = computed(() => (props.failed / total.value) * 100)
</script>

<template>
  <div class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-baseline justify-between">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
        {{ pending }} pending
      </span>
    </div>

    <div class="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
      <div class="flex h-full">
        <div
          class="bg-success transition-all"
          :style="{ width: `${appliedPct}%` }"
        />
        <div
          class="bg-warning transition-all"
          :style="{ width: `${pendingPct}%` }"
        />
        <div
          class="bg-danger transition-all"
          :style="{ width: `${failedPct}%` }"
        />
      </div>
    </div>

    <div class="mb-4 border-b border-gray-200 pb-2">
      <div class="flex items-center justify-between py-1.5">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-sm bg-success"></span>
          <span class="text-sm font-medium text-gray-600">Applied</span>
        </div>
        <span class="text-sm font-bold text-gray-900">{{ applied }}</span>
      </div>
      <div class="flex items-center justify-between py-1.5">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-sm bg-warning"></span>
          <span class="text-sm font-medium text-gray-600">Pending</span>
        </div>
        <span class="text-sm font-bold text-warning">{{ pending }}</span>
      </div>
      <div class="flex items-center justify-between py-1.5">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-sm bg-danger"></span>
          <span class="text-sm font-medium text-gray-600">Failed</span>
        </div>
        <span class="text-sm font-bold text-danger">{{ failed }}</span>
      </div>
    </div>

    <div class="mb-4 border-t border-gray-200 pt-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Total</span>
        <span class="text-lg font-bold text-gray-900">{{ total }}</span>
      </div>
    </div>

    <button
      class="mt-auto w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-bold text-white hover:bg-primary-hover"
      @click="emit('manage-click')"
    >
      Manage policies
    </button>
  </div>
</template>

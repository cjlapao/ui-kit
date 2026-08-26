<script setup lang="ts">
import Panel from './Panel.vue'

const props = defineProps<{
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const changeColors = {
  positive: 'text-success',
  negative: 'text-danger',
  neutral: 'text-text-secondary',
}

const onPanelClick = () => {
  emit('click')
}
</script>

<template>
  <Panel tone="emerald" class="cursor-pointer" @click="onPanelClick">
    <dt class="truncate text-sm font-medium text-text-secondary">
      {{ title }}
    </dt>
    <dd class="mt-2 flex items-baseline gap-2">
      <span class="text-3xl font-semibold text-text">{{ value }}</span>
      <span class="text-sm" :class="changeColors[changeType]">{{ change }}</span>
    </dd>
  </Panel>
</template>

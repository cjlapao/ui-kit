<script setup lang="ts">
import { computed } from 'vue'
import PrimeTag from 'primevue/tag'
import Panel from './Panel.vue'

export type TagSeverity = 'info' | 'success' | 'danger' | 'warning' | 'secondary' | 'contrast'
export type ProgressColor =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | string

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    value: string
    valueLabel?: string
    tag?: string
    tagSeverity?: TagSeverity
    delta?: string
    progress: number
    progressColor?: ProgressColor
    progressText?: string
    loading?: boolean
  }>(),
  {
    subtitle: '',
    tag: '',
    tagSeverity: 'info',
    delta: '',
    progressColor: 'primary',
    progressText: '',
  }
)

const progressPercent = computed(() => Math.min(100, Math.max(0, props.progress)))

const progressColorClasses: Record<string, string> = {
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-primary',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
}

const progressBgClass = computed(() => {
  if (props.progressColor in progressColorClasses) {
    return progressColorClasses[props.progressColor]
  }
  return ''
})

const progressStyle = computed(() => {
  if (props.progressColor in progressColorClasses) {
    return undefined
  }
  return { backgroundColor: props.progressColor }
})

const deltaIsPositive = computed(() => props.delta && props.delta.startsWith('+'))
const deltaIsNegative = computed(() => props.delta && props.delta.startsWith('-'))
</script>

<template>
  <Panel tone="default" class="cursor-default h-full" :loading="props.loading">
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
      <div class="grow" />
      <div class="mt-3">
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div class="h-full rounded-full transition-all duration-300" :class="progressBgClass" :style="{ ...progressStyle, width: `${progressPercent}%` }" />
        </div>
        <p v-if="progressText" class="mt-1 text-xs text-text-secondary">
          {{ progressText }}
        </p>
      </div>
    </div>
  </Panel>
</template>

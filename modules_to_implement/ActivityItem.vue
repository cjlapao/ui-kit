<script setup lang="ts">
defineProps<{
  agent: string
  action: string
  time: string
}>()
</script>

<template>
  <div
    class="flex items-center justify-between py-3 border-b border-border last:border-0"
  >
    <div>
      <p class="text-sm font-medium text-text">{{ agent }}</p>
      <p class="text-sm text-text-secondary">{{ action }}</p>
    </div>
    <span class="text-xs text-text-secondary">{{ time }}</span>
  </div>
</template>

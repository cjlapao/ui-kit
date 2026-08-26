<template>
  <button
    v-if="visible"
    class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 text-sm text-slate-700 shadow-lg backdrop-blur hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
    data-testid="jump-to-bottom"
    @click="emit('jump')"
  >
    ↓ Latest
  </button>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (e: "jump"): void }>();
</script>

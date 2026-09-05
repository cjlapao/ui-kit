<script setup lang="ts">
import {
  BottomSheetProvider,
  IconProvider,
  renderIcon,
  useTheme,
} from "@cjlapao/ui-kit-vue";

// Apply the stored theme (shared "ui-kit-demo-theme" localStorage key) so the
// page honours the visitor's light/dark choice on load.
useTheme();
</script>

<template>
  <IconProvider :render-icon="renderIcon">
    <BottomSheetProvider>
      <div
        class="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center dark:bg-slate-950"
      >
        <h1 class="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Vue kit documentation
        </h1>
        <p class="max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Coming soon — the Vue kit's docs site is not ported yet. The React
          kit's docs site (
          <code class="font-mono">react/demo</code> ) documents the shared
          component set.
        </p>
      </div>
    </BottomSheetProvider>
  </IconProvider>
</template>

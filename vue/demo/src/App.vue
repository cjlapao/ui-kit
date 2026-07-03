<script setup lang="ts">
import { BottomSheetProvider, IconProvider, renderIcon } from "@cjlapao/ui-kit-vue";
import UxDemo from "./pages/UxDemo/UxDemo.vue";
</script>

<template>
  <IconProvider :render-icon="renderIcon">
    <BottomSheetProvider>
      <div class="min-h-screen bg-white dark:bg-slate-950">
        <UxDemo />
      </div>
    </BottomSheetProvider>
  </IconProvider>
</template>

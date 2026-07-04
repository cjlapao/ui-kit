<script setup lang="ts">
import { h } from "vue";
import { MultiToggle, Sun, Moon, ThemeAuto } from "@cjlapao/ui-kit-vue";
import type { ThemeMode } from "@cjlapao/ui-kit-vue";

defineProps<{ theme: ThemeMode }>();
const emit = defineEmits<{ (e: "change", theme: ThemeMode): void }>();

/**
 * Small header theme-selector built on the kit's MultiToggle.
 *
 * Options: light / dark / system — rendered icon-only (sun, moon, auto).
 * Color: brand (blue) so the active pill picks up the kit accent.
 */
const options = [
  { value: "light", icon: h(Sun, { class: "h-4 w-4" }) },
  { value: "dark", icon: h(Moon, { class: "h-4 w-4" }) },
  { value: "system", icon: h(ThemeAuto, { class: "h-4 w-4" }) },
];
</script>

<template>
  <MultiToggle
    :options="options"
    :model-value="theme"
    size="sm"
    color="brand"
    variant="theme"
    aria-label="Theme"
    @update:model-value="emit('change', $event as ThemeMode)"
  />
</template>

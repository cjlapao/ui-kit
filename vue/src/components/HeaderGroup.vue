<script lang="ts">
export interface HeaderGroupProps {}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "HeaderGroup", inheritAttrs: false });

defineProps<HeaderGroupProps>();

const { classAttr, restAttrs } = useClassAttrs();

const rootClass = computed(
  () => `flex
        items-center
        text-black
        dark:text-white
        h-full
        relative
        [&+&]:ml-2
        [&+&::before]:content-['']
        [&+&::before]:absolute
        [&+&::before]:left-[-4px]
        [&+&::before]:top-1/2
        [&+&::before]:-translate-y-1/2
        [&+&::before]:transform
        [&+&::before]:h-1/2
        [&+&::before]:w-[2px]
        [&+&::before]:bg-neutral-300
        ${classAttr.value ?? ""}`,
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div class="flex items-center px-1"><slot /></div>
  </div>
</template>

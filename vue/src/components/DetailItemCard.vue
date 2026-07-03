<script lang="ts">
export interface DetailItemCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  defaultExpanded?: boolean;
  badgesAlignment?: "bottom" | "right" | "bottom-end";
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";
import Button from "./Button.vue";

defineOptions({ name: "DetailItemCard", inheritAttrs: false });

const props = withDefaults(defineProps<DetailItemCardProps>(), {
  defaultExpanded: false,
  badgesAlignment: "right",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const expanded = ref(props.defaultExpanded);

const hasDetails = computed(() => !!slots.default);

const handleToggleExpand = (e: MouseEvent) => {
  if (hasDetails.value) {
    e.stopPropagation();
    expanded.value = !expanded.value;
  }
};

const rootClass = computed(
  () =>
    `flex w-full flex-col gap-2.5 ${expanded.value ? "expanded" : ""} ${classAttr.value ?? ""}`,
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div class="flex flex-1 flex-row items-center justify-between gap-1.5">
      <div v-if="hasDetails" class="flex-shrink-0">
        <Button
          variant="icon"
          class="h-6 w-6"
          :aria-expanded="expanded"
          :aria-label="expanded ? 'Collapse details' : 'Expand details'"
          @click="handleToggleExpand"
        >
          <span
            :class="`flex items-center justify-center text-lg font-bold transition-transform duration-200 ${expanded ? 'rotate-0' : 'rotate-0'}`"
          >
            {{ expanded ? "−" : "+" }}
          </span>
        </Button>
      </div>
      <div class="flex flex-1 flex-col leading-normal">
        <div class="text-base font-normal text-neutral-900 dark:text-neutral-100">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
        >
          {{ subtitle }}
        </div>
        <div v-if="description" class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ description }}
        </div>
        <div
          v-if="badgesAlignment == 'bottom'"
          class="flex flex-row justify-start gap-px"
        >
          <slot name="badges" />
        </div>
        <div
          v-if="badgesAlignment == 'bottom-end'"
          class="flex flex-row justify-end gap-px"
        >
          <slot name="badges" />
        </div>
      </div>

      <div v-if="badgesAlignment == 'right'" class="flex flex-col justify-end gap-px">
        <slot name="badges" />
      </div>
    </div>

    <div
      v-if="hasDetails && expanded"
      class="flex flex-col gap-2.5 px-[30px] text-sm text-neutral-500 dark:text-neutral-400"
    >
      <slot />
    </div>
  </div>
</template>

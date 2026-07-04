<script lang="ts">
type FormLayoutColumns = 1 | 2 | 3;
type FormLayoutGap = "sm" | "md" | "lg";

const columnClasses: Record<FormLayoutColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

const gapClasses: Record<FormLayoutGap, string> = {
  sm: "gap-x-4 gap-y-4",
  md: "gap-x-6 gap-y-6",
  lg: "gap-x-8 gap-y-8",
};

const verticalPaddingClasses: Record<FormLayoutGap, string> = {
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
};

export interface FormLayoutProps {
  columns?: FormLayoutColumns;
  gap?: FormLayoutGap;
  verticalPadding?: FormLayoutGap;
}

const alignItemsClasses: Record<FormLayoutColumns, string> = {
  1: "items-start",
  2: "items-center",
  3: "items-center",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "FormLayout", inheritAttrs: false });

const props = withDefaults(defineProps<FormLayoutProps>(), {
  columns: 1,
  gap: "md",
  verticalPadding: "sm",
});

const { classAttr, restAttrs } = useClassAttrs();

const computedClass = computed(() =>
  classNames(
    "grid px-2",
    verticalPaddingClasses[props.verticalPadding],
    alignItemsClasses[props.columns],
    columnClasses[props.columns],
    gapClasses[props.gap],
    classAttr.value,
  ),
);
</script>

<template>
  <div :class="computedClass" v-bind="restAttrs">
    <slot />
  </div>
</template>

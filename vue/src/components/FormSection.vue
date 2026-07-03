<script lang="ts">
export interface FormSectionProps {
  title?: string;
  description?: string;
  footer?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingMap: Record<
  "sm" | "md" | "lg",
  { body: string; header: string; footer: string }
> = {
  sm: {
    header: "px-4 py-4",
    body: "px-4 py-4",
    footer: "px-4 py-4",
  },
  md: {
    header: "px-6 py-5",
    body: "px-6 py-6",
    footer: "px-6 py-4",
  },
  lg: {
    header: "px-8 py-6",
    body: "px-8 py-8",
    footer: "px-8 py-6",
  },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "FormSection", inheritAttrs: false });

const props = withDefaults(defineProps<FormSectionProps>(), {
  padding: "md",
});

const { classAttr, restAttrs } = useClassAttrs();

const pad = computed(() => paddingMap[props.padding]);

const sectionClass = computed(() =>
  classNames(
    "rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    classAttr.value,
  ),
);
</script>

<template>
  <section :class="sectionClass" v-bind="restAttrs">
    <div
      v-if="title || description || $slots.title || $slots.description"
      :class="
        classNames('border-b border-neutral-200 dark:border-neutral-700', pad.header)
      "
    >
      <div>
        <h2
          v-if="title || $slots.title"
          class="text-base font-semibold leading-6 text-neutral-900 dark:text-neutral-100"
        >
          <slot name="title">{{ title }}</slot>
        </h2>
        <p
          v-if="description || $slots.description"
          class="mt-2 text-sm text-neutral-600 dark:text-neutral-300"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
    </div>
    <div :class="classNames('space-y-6', pad.body)"><slot /></div>
    <div
      v-if="footer || $slots.footer"
      :class="
        classNames('border-t border-neutral-200 dark:border-neutral-700', pad.footer)
      "
    >
      <slot name="footer">{{ footer }}</slot>
    </div>
  </section>
</template>

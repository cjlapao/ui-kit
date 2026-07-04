<script lang="ts">
import type { VNodeChild } from "vue";
import type { SectionSize, SectionVariant } from "./Section.vue";
import type { PillVariant, PillSize } from "./Pill.vue";
import type { ThemeColor } from "../theme/Theme";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TagPanelTag {
  id?: string;
  label: string;
  /** Pill tone. Defaults to `'neutral'`. */
  tone?: ThemeColor;
  /** Pill variant. Defaults to `'soft'`. */
  variant?: PillVariant;
  /** Pill size. Defaults to `'sm'`. */
  size?: PillSize;
  /** Optional leading icon inside the pill. */
  icon?: VNodeChild;
  children?: VNodeChild;
}

export interface TagPanelProps {
  /** Section heading. Omit entirely to hide the header. */
  title?: string;
  /** Optional secondary line below the title. */
  subtitle?: string;
  /** Tags to render as pills. */
  tags: TagPanelTag[];
  /**
   * Maximum number of pills shown before a `+N` overflow pill appears.
   * Set to `0` to always show all. Default: `5`.
   */
  tagLimit?: number;
  /**
   * Tone used for the `+N` overflow pill.
   * Defaults to `'neutral'`.
   */
  overflowTone?: ThemeColor;
  /** Controls header padding and font size. Defaults to `'md'`. */
  size?: SectionSize;
  /** Visual style of the section header. Defaults to `'uppercase'`. */
  variant?: SectionVariant;
  /** Extra classes for the tags container. */
  bodyClassName?: string;
  /** Remove all padding from the section header. */
  noPadding?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import Section from "./Section.vue";
import Pill from "./Pill.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "TagPanel", inheritAttrs: false });

const props = withDefaults(defineProps<TagPanelProps>(), {
  tagLimit: 5,
  overflowTone: "neutral",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const expanded = ref(false);

const limited = computed(
  () =>
    props.tagLimit > 0 && !expanded.value && props.tags.length > props.tagLimit,
);
const visible = computed(() =>
  limited.value ? props.tags.slice(0, props.tagLimit) : props.tags,
);
const overflowCount = computed(() => props.tags.length - props.tagLimit);

const hasTitle = computed(() => props.title != null || !!slots.title);

const rootClass = computed(() => classNames("flex flex-col", classAttr.value));

const bodyClass = computed(() =>
  classNames("flex flex-wrap items-center gap-1 px-0 pb-1", props.bodyClassName),
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <Section
      v-if="hasTitle"
      :title="title"
      :subtitle="subtitle"
      :size="size"
      :variant="variant"
      :no-padding="noPadding"
    >
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template v-if="$slots.subtitle" #subtitle>
        <slot name="subtitle" />
      </template>
      <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    </Section>

    <div :class="bodyClass">
      <template v-if="tags.length === 0">
        <slot name="emptyState">
          <span class="text-xs text-neutral-400 dark:text-neutral-500 italic">
            No tags
          </span>
        </slot>
      </template>
      <template v-else>
        <Pill
          v-for="(tag, i) in visible"
          :key="tag.id ?? `${tag.label}-${i}`"
          :tone="tag.tone ?? 'neutral'"
          :variant="tag.variant ?? 'soft'"
          :size="tag.size ?? 'sm'"
        >
          <template v-if="tag.icon" #icon>
            <VNodeRenderer :nodes="tag.icon" />
          </template>
          <VNodeRenderer :nodes="tag.children ?? tag.label" />
        </Pill>

        <button
          v-if="limited"
          type="button"
          :aria-label="`Show ${overflowCount} more tags`"
          class="inline-flex"
          @click="expanded = true"
        >
          <Pill :tone="overflowTone" variant="soft" :size="size">
            +{{ overflowCount }}
          </Pill>
        </button>

        <button
          v-if="expanded && tagLimit > 0 && tags.length > tagLimit"
          type="button"
          class="text-xs text-neutral-400 underline-offset-2 hover:underline dark:text-neutral-500"
          @click="expanded = false"
        >
          Show less
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import type { VNodeChild } from "vue";
import type { PanelProps } from "./Panel.vue";
import type { ControlSize, TrueColor } from "../theme/Theme";

/**
 * The kit's three loader treatments, with `skeleton` the default — a
 * placeholder shaped like the panel's own content keeps the block at its real
 * height, where a spinner collapses it and the page jumps when the data lands.
 */
export const PAGED_PANEL_LOADERS = ["skeleton", "spinner", "progress"] as const;
export type PagedPanelLoader = (typeof PAGED_PANEL_LOADERS)[number];

export interface PagedPanelProps
  // `loading`, `loaderType` and `progress` are owned here: Panel's loader
  // knows nothing about the header/page split, and in `bare` mode there is no
  // Panel at all for it to live on.
  extends Omit<
    PanelProps,
    "title" | "subtitle" | "loading" | "loaderType" | "progress"
  > {
  /** One entry per page — rendered one at a time. */
  pages: VNodeChild[];
  /**
   * Static title shown in the header, OR an array of per-page titles.
   * When an array is supplied its length should match `pages`.
   */
  title?: VNodeChild | VNodeChild[];
  /** Optional subtitle shown below the title (static). */
  subtitle?: VNodeChild;
  /** Replaces the page with a loading treatment. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: PagedPanelLoader;
  /** Determinate value for `loaderType="progress"`, 0–100. */
  progress?: number;
  /** Copy shown beside the spinner or progress bar. */
  loadingLabel?: string;
  /** Replaces the page with an error message. */
  error?: string | null;
  /** Copy for the default empty state. @default "No data available." */
  emptyMessage?: string;
  /** Accent for the nav buttons. @default "blue" */
  tone?: TrueColor;
  /** Scale of the nav buttons and header type. @default "md" */
  size?: ControlSize;
  /** Controlled page index. Omit for uncontrolled paging. */
  page?: number;
  /**
   * When true, renders without the Panel wrapper (no border, background or
   * shadow). Use this when embedding PagedPanel inside an existing Panel.
   */
  bare?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import classNames from "classnames";
import Panel from "./Panel.vue";
import PagedPanelContent, {
  type PagedPanelView,
} from "./internal/PagedPanelContent.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "PagedPanel", inheritAttrs: false });

const props = withDefaults(defineProps<PagedPanelProps>(), {
  bare: false,
  loading: false,
  loaderType: "skeleton",
  tone: "blue",
  size: "md",
  emptyMessage: "No data available.",
});

const emit = defineEmits<{ "update:page": [page: number] }>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const internal = ref(0);
const total = computed(() => props.pages.length);
const isControlled = computed(() => props.page !== undefined);

// Clamp when `pages` shrinks (e.g. after a data reload).
const current = computed(() => {
  const raw = isControlled.value ? (props.page ?? 0) : internal.value;
  return total.value > 0 ? Math.min(Math.max(0, raw), total.value - 1) : 0;
});

watch([total, current], () => {
  if (!isControlled.value && internal.value !== current.value) {
    internal.value = current.value;
  }
});

const goTo = (next: number) => {
  const clamped = Math.min(Math.max(0, next), Math.max(0, total.value - 1));
  if (!isControlled.value) internal.value = clamped;
  emit("update:page", clamped);
};

const resolvedTitle = computed(() =>
  Array.isArray(props.title) ? props.title[current.value] : props.title,
);

const view = computed<PagedPanelView>(() => ({
  resolvedTitle: resolvedTitle.value,
  subtitle: props.subtitle,
  page: props.pages[current.value],
  error: props.error,
  emptyMessage: props.emptyMessage,
  tone: props.tone,
  size: props.size,
  current: current.value,
  total: total.value,
  loading: Boolean(props.loading),
  loaderType: props.loaderType,
  progress: props.progress,
  loadingLabel: props.loadingLabel,
  hasEmptySlot: Boolean(slots.empty),
}));

const rootClass = computed(() =>
  classNames("relative overflow-hidden", classAttr.value),
);
</script>

<template>
  <div v-if="bare" :class="rootClass" v-bind="restAttrs">
    <PagedPanelContent
      :view="view"
      @prev="goTo(current - 1)"
      @next="goTo(current + 1)"
    >
      <template v-if="$slots.empty" #empty><slot name="empty" /></template>
      <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    </PagedPanelContent>
  </div>

  <Panel
    v-else
    v-bind="restAttrs"
    :tone="tone"
    padding="none"
    :body-class-name="total === 0 && !loading ? 'h-full' : ''"
    :loading="false"
    :class="rootClass"
  >
    <PagedPanelContent
      :view="view"
      @prev="goTo(current - 1)"
      @next="goTo(current + 1)"
    >
      <template v-if="$slots.empty" #empty><slot name="empty" /></template>
      <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    </PagedPanelContent>
  </Panel>
</template>

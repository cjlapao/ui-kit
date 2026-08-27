<script lang="ts">
import type { VNodeChild } from "vue";
import type { ControlSize, TrueColor } from "../../theme/Theme";

/** Everything the header + page body need, already resolved. */
export interface PagedPanelView {
  resolvedTitle?: VNodeChild;
  subtitle?: VNodeChild;
  page?: VNodeChild;
  error?: string | null;
  emptyMessage: string;
  tone: TrueColor;
  size: ControlSize;
  current: number;
  total: number;
  loading: boolean;
  loaderType: "skeleton" | "spinner" | "progress";
  progress?: number;
  loadingLabel?: string;
  hasEmptySlot: boolean;
}

export const PAGED_PANEL_SIZE_TOKENS: Record<
  ControlSize,
  { title: string; subtitle: string; counter: string; pad: string; icon: ControlSize }
> = {
  xs: { title: "text-xs", subtitle: "text-[10px]", counter: "text-[10px]", pad: "px-3 py-2", icon: "xs" },
  sm: { title: "text-xs", subtitle: "text-[11px]", counter: "text-[11px]", pad: "px-3 py-2", icon: "xs" },
  md: { title: "text-sm", subtitle: "text-xs", counter: "text-[11px]", pad: "px-4 py-3", icon: "sm" },
  lg: { title: "text-base", subtitle: "text-sm", counter: "text-xs", pad: "px-5 py-3.5", icon: "md" },
  xl: { title: "text-lg", subtitle: "text-base", counter: "text-sm", pad: "px-6 py-4", icon: "md" },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import IconButton from "../IconButton.vue";
import EmptyState from "../EmptyState.vue";
import Loader from "../Loader.vue";
import VNodeRenderer from "./VNodeRenderer";

/**
 * The header and page body, in one place.
 *
 * `PagedPanel` renders this either bare or inside a `Panel`, and the markup
 * used to be written out once per branch — which is how the two copies would
 * have drifted.
 */
defineOptions({ name: "PagedPanelContent", inheritAttrs: false });

const props = defineProps<{ view: PagedPanelView }>();
defineEmits<{ prev: []; next: [] }>();

/**
 * Vue has no `SurfaceProvider`, so the solid-surface tokens are spelled out.
 * They are the same strings `getSurfaceTextTokens("elevated")` returns.
 */
const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

const T = {
  heading: "text-neutral-900 dark:text-neutral-100",
  muted: "text-neutral-500 dark:text-neutral-400",
  divider: "border-neutral-200 dark:border-neutral-700",
};

const tokens = computed(
  () => PAGED_PANEL_SIZE_TOKENS[props.view.size] ?? PAGED_PANEL_SIZE_TOKENS.md,
);
const showNav = computed(() => props.view.total > 1);
const showHeader = computed(
  () =>
    props.view.resolvedTitle != null ||
    props.view.subtitle != null ||
    showNav.value,
);
</script>

<template>
  <div
    v-if="showHeader"
    :class="classNames('flex items-center gap-2 border-b', tokens.pad, T.divider)"
  >
    <div class="shrink-0">
      <IconButton
        v-if="showNav"
        icon="ArrowChevronLeft"
        variant="ghost"
        :color="view.tone"
        :size="tokens.icon"
        sr-label="Previous page"
        tooltip="Previous page"
        :disabled="view.current === 0"
        @click="$emit('prev')"
      />
    </div>

    <div class="flex-1 text-center min-w-0">
      <div
        v-if="view.resolvedTitle != null"
        :class="
          classNames('font-semibold leading-snug truncate', tokens.title, T.heading)
        "
      >
        <VNodeRenderer :nodes="view.resolvedTitle" />
      </div>
      <div
        v-if="view.subtitle != null"
        :class="classNames('mt-0.5 truncate', tokens.subtitle, T.muted)"
      >
        <VNodeRenderer :nodes="view.subtitle" />
      </div>
      <!-- Polite, so paging announces the new position instead of leaving a
           screen reader with no idea the content changed. -->
      <div
        v-if="showNav"
        role="status"
        aria-live="polite"
        :class="classNames('mt-0.5 tabular-nums', tokens.counter, T.muted)"
      >
        {{ view.current + 1 }} / {{ view.total }}
      </div>
    </div>

    <div class="shrink-0">
      <IconButton
        v-if="showNav"
        icon="ArrowChevronRight"
        variant="ghost"
        :color="view.tone"
        :size="tokens.icon"
        sr-label="Next page"
        tooltip="Next page"
        :disabled="view.current === view.total - 1"
        @click="$emit('next')"
      />
    </div>
  </div>

  <div class="h-full w-full p-4 flex items-center justify-center">
    <template v-if="view.loading">
      <slot name="loading">
        <!-- Shaped like a page: a couple of copy lines at the width real
             content tends to occupy, so the panel keeps its height and
             nothing jumps when the page arrives. -->
        <div
          v-if="view.loaderType === 'skeleton'"
          class="flex w-full flex-col gap-3"
          aria-hidden="true"
        >
          <div :class="classNames(SKELETON, 'h-3 w-3/4 rounded')" />
          <div :class="classNames(SKELETON, 'h-3 w-full rounded')" />
          <div :class="classNames(SKELETON, 'h-3 w-5/6 rounded')" />
        </div>
        <Loader
          v-else
          :variant="view.loaderType"
          :size="view.size === 'xs' || view.size === 'sm' ? 'sm' : 'md'"
          :color="view.tone"
          :progress="view.progress"
          :label="view.loadingLabel"
        />
      </slot>
    </template>
    <EmptyState
      v-else-if="view.error"
      variant="plain"
      icon="Error"
      icon-color="rose"
      title="Something went wrong"
      :subtitle="view.error"
      show-icon
    />
    <template v-else-if="view.total === 0">
      <slot name="empty">
        <EmptyState
          variant="plain"
          icon="Info"
          :title="view.emptyMessage"
          show-icon
          :tone="view.tone"
        />
      </slot>
    </template>
    <VNodeRenderer v-else :nodes="view.page" />
  </div>
</template>

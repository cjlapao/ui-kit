<script lang="ts">
import type { VNodeChild } from "vue";
import type { PanelProps } from "./Panel.vue";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PagedPanelProps
  extends Omit<PanelProps, "title" | "subtitle"> {
  /** One entry per page — rendered one at a time. */
  pages: VNodeChild[];
  /**
   * Static title shown in the header, OR an array of per-page titles.
   * When an array is supplied its length should match `pages`.
   */
  title?: VNodeChild | VNodeChild[];
  /** Optional subtitle shown below the title (static). */
  subtitle?: VNodeChild;
  /** Show a loading overlay over the whole panel. */
  error?: string | null;
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
import CustomIcon from "./CustomIcon.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "PagedPanel", inheritAttrs: false });

const props = withDefaults(defineProps<PagedPanelProps>(), {
  bare: false,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

// ── Nav button ───────────────────────────────────────────────────────────────

const navBtnClass = classNames(
  "flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150",
  "text-neutral-400 dark:text-neutral-500",
  "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200",
  "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400 dark:disabled:hover:text-neutral-500",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
);

// ── Component ────────────────────────────────────────────────────────────────

const current = ref(0);
const total = computed(() => props.pages.length);
const showNav = computed(() => total.value > 1);

// Guard: if pages shrinks (e.g. after a data reload) clamp to last valid page
const safeCurrent = computed(() =>
  total.value > 0 ? Math.min(current.value, total.value - 1) : 0,
);
watch([total, current], () => {
  if (safeCurrent.value !== current.value) {
    current.value = safeCurrent.value;
  }
});

// Resolve the title for the current page
const resolvedTitle = computed<VNodeChild>(() =>
  Array.isArray(props.title)
    ? (props.title as VNodeChild[])[safeCurrent.value]
    : props.title,
);
const showHeader = computed(
  () =>
    resolvedTitle.value != null ||
    props.subtitle != null ||
    showNav.value ||
    Boolean(slots.title) ||
    Boolean(slots.subtitle),
);

const goPrev = () => {
  current.value = Math.max(0, current.value - 1);
};
const goNext = () => {
  current.value = Math.min(total.value - 1, current.value + 1);
};

// Every Panel prop except the ones PagedPanel consumes is forwarded to Panel.
const panelProps = computed(() => {
  const {
    pages: _pages,
    title: _title,
    subtitle: _subtitle,
    error: _error,
    bare: _bare,
    ...rest
  } = props;
  return rest;
});

const wrapperClass = computed(() =>
  classNames("relative overflow-hidden", classAttr.value),
);
</script>

<template>
  <div v-if="bare" :class="wrapperClass" v-bind="restAttrs">
    <div
      v-if="showHeader"
      class="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800"
    >
      <!-- Left nav slot — always same width so title stays centred -->
      <div class="shrink-0 w-7">
        <button
          v-if="showNav"
          type="button"
          aria-label="Previous page"
          :disabled="current === 0"
          :class="navBtnClass"
          @click="goPrev"
        >
          <CustomIcon icon="ArrowChevronLeft" size="sm" />
        </button>
      </div>

      <!-- Centre: title + subtitle + page indicator -->
      <div class="flex-1 text-center min-w-0">
        <div
          v-if="resolvedTitle != null || $slots.title"
          class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 leading-snug truncate"
        >
          <slot name="title" :page="safeCurrent">
            <VNodeRenderer :nodes="resolvedTitle" />
          </slot>
        </div>
        <div
          v-if="subtitle != null || $slots.subtitle"
          class="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate"
        >
          <slot name="subtitle"><VNodeRenderer :nodes="subtitle" /></slot>
        </div>
        <div
          v-if="showNav"
          class="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 tabular-nums"
        >
          {{ safeCurrent + 1 }} / {{ total }}
        </div>
      </div>

      <!-- Right nav slot -->
      <div class="shrink-0 w-7">
        <button
          v-if="showNav"
          type="button"
          aria-label="Next page"
          :disabled="current === total - 1"
          :class="navBtnClass"
          @click="goNext"
        >
          <CustomIcon icon="ArrowChevronRight" size="sm" />
        </button>
      </div>
    </div>

    <div class="h-full w-full p-4 flex items-center justify-center">
      <p v-if="error" class="text-sm text-rose-500 dark:text-rose-400">
        {{ error }}
      </p>
      <p
        v-else-if="total === 0 && !loading"
        class="text-sm text-neutral-400 dark:text-neutral-500"
      >
        No data available.
      </p>
      <VNodeRenderer v-else :nodes="pages[safeCurrent]" />
    </div>
  </div>

  <Panel
    v-else
    v-bind="{ ...panelProps, ...restAttrs }"
    :body-class-name="total === 0 && !loading ? 'h-full' : ''"
    :class="wrapperClass"
  >
    <div
      v-if="showHeader"
      class="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800"
    >
      <!-- Left nav slot — always same width so title stays centred -->
      <div class="shrink-0 w-7">
        <button
          v-if="showNav"
          type="button"
          aria-label="Previous page"
          :disabled="current === 0"
          :class="navBtnClass"
          @click="goPrev"
        >
          <CustomIcon icon="ArrowChevronLeft" size="sm" />
        </button>
      </div>

      <!-- Centre: title + subtitle + page indicator -->
      <div class="flex-1 text-center min-w-0">
        <div
          v-if="resolvedTitle != null || $slots.title"
          class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 leading-snug truncate"
        >
          <slot name="title" :page="safeCurrent">
            <VNodeRenderer :nodes="resolvedTitle" />
          </slot>
        </div>
        <div
          v-if="subtitle != null || $slots.subtitle"
          class="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate"
        >
          <slot name="subtitle"><VNodeRenderer :nodes="subtitle" /></slot>
        </div>
        <div
          v-if="showNav"
          class="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 tabular-nums"
        >
          {{ safeCurrent + 1 }} / {{ total }}
        </div>
      </div>

      <!-- Right nav slot -->
      <div class="shrink-0 w-7">
        <button
          v-if="showNav"
          type="button"
          aria-label="Next page"
          :disabled="current === total - 1"
          :class="navBtnClass"
          @click="goNext"
        >
          <CustomIcon icon="ArrowChevronRight" size="sm" />
        </button>
      </div>
    </div>

    <div class="h-full w-full p-4 flex items-center justify-center">
      <p v-if="error" class="text-sm text-rose-500 dark:text-rose-400">
        {{ error }}
      </p>
      <p
        v-else-if="total === 0 && !loading"
        class="text-sm text-neutral-400 dark:text-neutral-500"
      >
        No data available.
      </p>
      <VNodeRenderer v-else :nodes="pages[safeCurrent]" />
    </div>
  </Panel>
</template>

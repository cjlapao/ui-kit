<script lang="ts">
export interface InfiniteScrollPanelProps<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  /**
   * Awaited when more items must be fetched — kept as a function prop (not an
   * emit) because the component awaits its promise to manage the internal
   * "loading more" state.
   */
  onLoadMore: () => Promise<void>;
  threshold?: number;
  debounceMs?: number;
  useFixedColumns?: boolean;
  minColumnWidthPx?: number;
  maxColumns?: number;
  columnTemplate?: string;
  masonry?: boolean;
}
</script>

<script setup lang="ts" generic="T">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import Spinner from "./Spinner.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "InfiniteScrollPanel", inheritAttrs: false });

const props = withDefaults(defineProps<InfiniteScrollPanelProps<T>>(), {
  threshold: 3,
  debounceMs: 100,
  useFixedColumns: false,
  minColumnWidthPx: 300,
  masonry: false,
});

defineSlots<{
  /** Renders each item — replaces the React `renderItem` render prop. */
  renderItem?: (props: { item: T; index: number }) => unknown;
  /** Replaces the React `loadingComponent` node prop. */
  loadingComponent?: () => unknown;
  /** Replaces the React `emptyComponent` node prop. */
  emptyComponent?: () => unknown;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const isLoadingMore = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);
const itemsContainerRef = ref<HTMLDivElement | null>(null);
const loadingRef = ref<HTMLDivElement | null>(null);
let itemRefs: Array<HTMLDivElement | null> = [];
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
let resizeObservers: ResizeObserver[] = [];
let rafId: number | null = null;
let delayedTimer: ReturnType<typeof setTimeout> | null = null;
const columnCount = ref<number>(1);

const setItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  itemRefs[index] = el as HTMLDivElement | null;
};

const handleLoadMore = async () => {
  if (isLoadingMore.value || !props.hasMore) return;

  isLoadingMore.value = true;
  try {
    await props.onLoadMore();
  } catch (error) {
    console.error("Error loading more items:", error);
  } finally {
    isLoadingMore.value = false;
  }
};

const handleScroll = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    if (!containerRef.value || !loadingRef.value) return;

    const container = containerRef.value;
    const loadingElement = loadingRef.value;
    const containerRect = container.getBoundingClientRect();
    const loadingRect = loadingElement.getBoundingClientRect();

    const isVisible =
      loadingRect.top <= containerRect.bottom + props.threshold * 50;

    if (isVisible && props.hasMore && !isLoadingMore.value && !props.isLoading) {
      void handleLoadMore();
    }
  }, props.debounceMs);
};

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  container.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
});
onUnmounted(() => {
  containerRef.value?.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  }
});

watch(
  [
    () => props.items.length,
    () => props.threshold,
    () => props.hasMore,
    isLoadingMore,
    () => props.isLoading,
  ],
  () => {
    if (
      props.items.length > 0 &&
      props.items.length < props.threshold &&
      props.hasMore &&
      !isLoadingMore.value &&
      !props.isLoading
    ) {
      void handleLoadMore();
    }
  },
  { immediate: true },
);

watch(
  [() => props.isLoading, isLoadingMore, () => props.items.length],
  () => {
    if (!props.isLoading && !isLoadingMore.value) {
      handleScroll();
    }
  },
  { immediate: true },
);

const recomputeMasonrySpans = () => {
  const grid = itemsContainerRef.value;
  if (!grid) return;
  const computedStyle = window.getComputedStyle(grid);
  const rowGap = parseFloat(computedStyle.rowGap || "0");
  const rowHeight = parseFloat(
    computedStyle.getPropertyValue("--masonry-row-height") || "8",
  );

  itemRefs.forEach((el) => {
    if (!el) return;
    const contentHeight = el.getBoundingClientRect().height;
    const rowSpan = Math.max(
      1,
      Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap)),
    );
    const current = el.style.gridRowEnd;
    const next = `span ${rowSpan}`;
    if (current !== next) {
      el.style.gridRowEnd = next;
    }
  });
};

const scheduleRecompute = (delayMs: number = 60) => {
  if (delayedTimer) {
    clearTimeout(delayedTimer);
    delayedTimer = null;
  }
  delayedTimer = setTimeout(() => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      recomputeMasonrySpans();
      rafId = null;
    });
  }, delayMs);
};

const masonryResizeHandler = () => scheduleRecompute(0);

const teardownMasonry = () => {
  window.removeEventListener("resize", masonryResizeHandler);
  resizeObservers.forEach((ro) => ro.disconnect());
  resizeObservers = [];
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (delayedTimer) {
    clearTimeout(delayedTimer);
    delayedTimer = null;
  }
};

const setupMasonry = () => {
  teardownMasonry();
  if (props.useFixedColumns) return;

  itemRefs.forEach((el) => {
    if (!el) return;
    const ro = new ResizeObserver(() => scheduleRecompute());
    ro.observe(el);
    resizeObservers.push(ro);
  });

  scheduleRecompute(0);

  window.addEventListener("resize", masonryResizeHandler);
};

onMounted(setupMasonry);
watch([() => props.items, () => props.useFixedColumns], setupMasonry, {
  flush: "post",
});
onUnmounted(teardownMasonry);

const computeColumns = () => {
  const container = containerRef.value;
  if (!container) return;
  const gap = 16;
  const width = container.clientWidth;
  const cols = Math.max(
    1,
    Math.floor((width + gap) / (props.minColumnWidthPx + gap)),
  );
  columnCount.value = props.maxColumns
    ? Math.min(cols, props.maxColumns)
    : cols;
};

const setupFixedColumns = () => {
  window.removeEventListener("resize", computeColumns);
  if (!props.useFixedColumns) return;
  computeColumns();
  window.addEventListener("resize", computeColumns);
};

onMounted(setupFixedColumns);
watch(
  [
    () => props.useFixedColumns,
    () => props.minColumnWidthPx,
    () => props.maxColumns,
  ],
  setupFixedColumns,
);
onUnmounted(() => window.removeEventListener("resize", computeColumns));

const containerClass = computed(() =>
  classNames(
    "relative flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto",
    "scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-300 hover:scrollbar-thumb-neutral-400",
    "dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600 dark:hover:scrollbar-thumb-neutral-500",
    "[&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded",
    classAttr.value,
  ),
);

const fixedColumnsGridClass = computed(() =>
  classNames(
    "mb-5 grid gap-4",
    columnCount.value === 1 && "grid-cols-1",
    columnCount.value === 2 && "grid-cols-2",
    columnCount.value === 3 && "grid-cols-3",
    columnCount.value === 4 && "grid-cols-4",
    columnCount.value >= 5 && "grid-cols-5",
  ),
);

const masonryGridClass = computed(() =>
  classNames(
    "mb-[60px] grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-start gap-2.5 py-4",
    props.masonry &&
      "[--masonry-row-height:8px] auto-rows-[var(--masonry-row-height)]",
  ),
);

const fixedColumnBuckets = computed(() =>
  Array.from({ length: columnCount.value }, (_, colIdx) =>
    props.items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => index % columnCount.value === colIdx),
  ),
);
</script>

<template>
  <div ref="containerRef" :class="containerClass" v-bind="restAttrs">
    <template v-if="items.length === 0 && !isLoading">
      <slot name="emptyComponent">
        <div
          class="flex items-center justify-center p-12 text-center text-base text-neutral-500 dark:text-neutral-400"
        >
          <span>No items found</span>
        </div>
      </slot>
    </template>
    <template v-else>
      <div v-if="useFixedColumns" :class="fixedColumnsGridClass">
        <div
          v-for="(bucket, colIdx) in fixedColumnBuckets"
          :key="colIdx"
          class="flex flex-col gap-4"
        >
          <div
            v-for="{ item, index } in bucket"
            :key="index"
            class="flex items-start justify-center"
          >
            <slot name="renderItem" :item="item" :index="index" />
          </div>
        </div>
      </div>
      <div
        v-else
        ref="itemsContainerRef"
        :class="masonryGridClass"
        :style="{ gridTemplateColumns: columnTemplate }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          :ref="(el) => setItemRef(el, index)"
          class="flex items-start justify-center"
        >
          <slot name="renderItem" :item="item" :index="index" />
        </div>
      </div>

      <div
        v-if="items.length > 0 && (hasMore || isLoadingMore)"
        ref="loadingRef"
        :class="`flex min-h-[100px]${!$slots.loadingComponent ? ' items-center justify-center p-8' : ''}`"
      >
        <slot name="loadingComponent">
          <div class="flex flex-col items-center justify-center gap-4">
            <Spinner
              thickness="thick"
              color="blue"
              size="lg"
              variant="segments"
            />
            <span class="text-md">Loading more...</span>
          </div>
        </slot>
      </div>
    </template>
  </div>
</template>

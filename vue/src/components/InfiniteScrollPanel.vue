<script lang="ts">
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
} from "./Panel.vue";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import type { ControlSize, TrueColor } from "../theme/Theme";

/** Every container surface, plus `plain` for use inside a card that exists. */
export type InfiniteScrollPanelVariant = PanelVariant | "plain";

/**
 * How the items are arranged.
 *
 * - `list`    — one column, reading order preserved
 * - `grid`    — responsive columns, reading order preserved (left to right)
 * - `masonry` — responsive columns, rows spanned to the item's height
 * - `columns` — balanced columns filled top-to-bottom, so reading order runs
 *               *down* each column rather than across
 *
 * Replaces the `masonry` / `useFixedColumns` boolean pair, which could express
 * four states of which only three meant anything and hid the reading-order
 * trade-off behind a name that did not mention it.
 */
export type InfiniteScrollLayout = "list" | "grid" | "masonry" | "columns";

export interface InfiniteScrollPanelProps<T> {
  items: T[];
  /** True while the *first* page is loading. */
  isLoading?: boolean;
  hasMore: boolean;
  /**
   * Awaited when more items are needed — kept as a function prop, not an emit,
   * because the component awaits its promise. Rejections surface as a retry
   * state rather than being swallowed into the console.
   */
  onLoadMore: () => Promise<void>;
  /** Stable key per item. Defaults to the index. */
  getItemKey?: (item: T, index: number) => string | number;

  // ── Layout ────────────────────────────────────────────────────────────────
  /** @default "masonry" */
  layout?: InfiniteScrollLayout;
  /** Narrowest a column may get before the count drops. @default 300 */
  minColumnWidth?: number;
  maxColumns?: number;
  /** Explicit `grid-template-columns`, overriding the computed one. */
  columnTemplate?: string;
  /** Space between items. @default "md" */
  gap?: ControlSize;

  // ── Fetching ──────────────────────────────────────────────────────────────
  /**
   * How far below the viewport the sentinel is observed, in pixels. Used to be
   * `threshold`, which was multiplied by a magic 50 *and* reused as an item
   * count — two different meanings for one prop.
   * @default 320
   */
  rootMargin?: number;
  /** Keep fetching until at least this many items are loaded. @default 0 */
  minItems?: number;

  // ── States ────────────────────────────────────────────────────────────────
  /** Copy for the built-in end marker. */
  endMessage?: string;
  /** Copy for the built-in empty state. */
  emptyMessage?: string;

  // ── Surface ───────────────────────────────────────────────────────────────
  /** @default "plain" — this is usually dropped into a card the app owns. */
  variant?: InfiniteScrollPanelVariant;
  tone?: TrueColor;
  corner?: PanelCorner;
  padding?: PanelPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
  /** Fixed height for the scroll area. Otherwise it fills its parent. */
  height?: number | string;
}

const GAP_CLASSES: Record<ControlSize, string> = {
  xs: "gap-1.5",
  sm: "gap-2.5",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/** Grid row unit for the masonry span maths. */
const MASONRY_ROW_PX = 8;

/** Thin scrollbar, the same treatment Panel's body uses. */
const SCROLLBAR =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent";
</script>

<script setup lang="ts" generic="T">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import Panel from "./Panel.vue";
import Spinner from "./Spinner.vue";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfacePaddingClass,
} from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "InfiniteScrollPanel", inheritAttrs: false });

const props = withDefaults(defineProps<InfiniteScrollPanelProps<T>>(), {
  isLoading: false,
  layout: "masonry",
  minColumnWidth: 300,
  gap: "md",
  rootMargin: 320,
  minItems: 0,
  endMessage: "You have reached the end",
  emptyMessage: "No items found",
  variant: "plain",
  tone: "blue",
  corner: () => DEFAULT_SURFACE_CORNER,
  padding: "none",
});

const emit = defineEmits<{ (event: "error", error: unknown): void }>();

defineSlots<{
  renderItem?: (props: { item: T; index: number }) => unknown;
  loadingComponent?: () => unknown;
  emptyComponent?: () => unknown;
  endComponent?: () => unknown;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const isLoadingMore = ref(false);
const error = ref<unknown>(null);
const columnCount = ref(1);

const containerRef = ref<HTMLDivElement | null>(null);
const gridRef = ref<HTMLDivElement | null>(null);
const sentinelRef = ref<HTMLDivElement | null>(null);
let itemRefs: Array<HTMLDivElement | null> = [];

let sentinelObserver: IntersectionObserver | null = null;
let widthObserver: ResizeObserver | null = null;
let itemObserver: ResizeObserver | null = null;

const busy = computed(() => props.isLoading || isLoadingMore.value);
const usesColumns = computed(() => props.layout !== "list");

const setItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  itemRefs[index] = el as HTMLDivElement | null;
};

const loadMore = async () => {
  if (isLoadingMore.value || !props.hasMore) return;
  isLoadingMore.value = true;
  error.value = null;
  try {
    await props.onLoadMore();
  } catch (caught) {
    // Was `console.error` and nothing else, so a failed page looked exactly
    // like the end of the list.
    error.value = caught ?? new Error("Failed to load more items");
    emit("error", caught);
  } finally {
    isLoadingMore.value = false;
  }
};

const retry = () => {
  error.value = null;
  void loadMore();
};

// ── Sentinel ────────────────────────────────────────────────────────────────
// An IntersectionObserver, not a debounced scroll handler comparing
// `getBoundingClientRect`s. The old approach missed fast scrolls, fired on
// every window resize, and could not see the sentinel inside a nested scroller
// that had not scrolled yet.
const teardownSentinel = () => {
  sentinelObserver?.disconnect();
  sentinelObserver = null;
};

const setupSentinel = async () => {
  teardownSentinel();
  if (!props.hasMore || error.value) return;
  await nextTick();
  const sentinel = sentinelRef.value;
  const root = containerRef.value;
  if (!sentinel || !root) return;

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !busy.value) {
        void loadMore();
      }
    },
    { root, rootMargin: `0px 0px ${props.rootMargin}px 0px`, threshold: 0 },
  );
  sentinelObserver.observe(sentinel);
};

watch(
  [() => props.hasMore, error, busy, () => props.rootMargin],
  () => void setupSentinel(),
);

// Keeps fetching while the panel is under-filled.
watch(
  [() => props.items.length, () => props.minItems, () => props.hasMore, busy],
  () => {
    if (!props.hasMore || busy.value || error.value) return;
    if (props.items.length < props.minItems) void loadMore();
  },
  { immediate: true },
);

// ── Columns ─────────────────────────────────────────────────────────────────
const measureColumns = () => {
  const element = containerRef.value;
  if (!element) return;
  const gapPx = 16;
  const fits = Math.max(
    1,
    Math.floor((element.clientWidth + gapPx) / (props.minColumnWidth + gapPx)),
  );
  columnCount.value = props.maxColumns
    ? Math.min(fits, props.maxColumns)
    : fits;
};

const setupColumns = () => {
  widthObserver?.disconnect();
  widthObserver = null;
  if (!usesColumns.value) {
    columnCount.value = 1;
    return;
  }
  const element = containerRef.value;
  if (!element) return;
  measureColumns();
  // A ResizeObserver on the panel, not a window resize listener: the panel is
  // often in a resizable split and the window never changes size.
  widthObserver = new ResizeObserver(measureColumns);
  widthObserver.observe(element);
};

// ── Masonry spans ───────────────────────────────────────────────────────────
const recomputeSpans = () => {
  if (props.layout !== "masonry") return;
  const grid = gridRef.value;
  if (!grid) return;
  const rowGap = parseFloat(window.getComputedStyle(grid).rowGap || "0");
  itemRefs.forEach((element) => {
    if (!element) return;
    const span = Math.max(
      1,
      Math.ceil(
        (element.getBoundingClientRect().height + rowGap) /
          (MASONRY_ROW_PX + rowGap),
      ),
    );
    const next = `span ${span}`;
    if (element.style.gridRowEnd !== next) element.style.gridRowEnd = next;
  });
};

const setupMasonry = async () => {
  itemObserver?.disconnect();
  itemObserver = null;
  // Stale refs when the list shrinks would otherwise be measured forever.
  itemRefs.length = props.items.length;
  if (props.layout !== "masonry") return;

  await nextTick();
  recomputeSpans();
  itemObserver = new ResizeObserver(recomputeSpans);
  itemRefs.forEach((element) => element && itemObserver?.observe(element));
};

onMounted(() => {
  setupColumns();
  void setupMasonry();
  void setupSentinel();
});

watch(
  [() => props.items, () => props.layout],
  () => void setupMasonry(),
  { flush: "post" },
);
watch(
  [usesColumns, () => props.minColumnWidth, () => props.maxColumns],
  setupColumns,
);

onBeforeUnmount(() => {
  teardownSentinel();
  widthObserver?.disconnect();
  itemObserver?.disconnect();
});

// ── Classes ─────────────────────────────────────────────────────────────────
const gapClass = computed(() => GAP_CLASSES[props.gap] ?? GAP_CLASSES.md);

const gridStyle = computed(() => {
  if (!usesColumns.value) return undefined;
  if (props.columnTemplate)
    return { gridTemplateColumns: props.columnTemplate };
  // Inline, not `grid-cols-{n}` classes: the old version had a hand-written
  // ladder that stopped at 5, so a sixth column silently became one column.
  return {
    gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
    ...(props.layout === "masonry"
      ? { gridAutoRows: `${MASONRY_ROW_PX}px` }
      : {}),
  };
});

/** Balanced buckets, filled top-to-bottom within each column. */
const buckets = computed(() => {
  if (props.layout !== "columns") return [];
  return Array.from({ length: columnCount.value }, (_, column) =>
    props.items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => index % columnCount.value === column),
  );
});

const containerClass = computed(() =>
  classNames(
    "relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden",
    // The inset lives on the scrolling element, not on the Panel around it. A
    // browser draws a scrollbar at the *scroller's* border edge, so padding
    // the Panel instead left the bar floating inside the card with a strip of
    // card still visible to its right.
    getSurfacePaddingClass(props.padding),
    // `scrollbar-thin scrollbar-track-*` came from the tailwind-scrollbar
    // plugin, which this kit does not install — every one of those classes was
    // inert.
    SCROLLBAR,
  ),
);

const heightStyle = computed(() =>
  props.height === undefined ? undefined : { height: props.height },
);

const keyFor = (item: T, index: number) =>
  props.getItemKey ? props.getItemKey(item, index) : index;
</script>

<template>
  <component
    :is="variant === 'plain' ? 'div' : Panel"
    v-bind="variant === 'plain' ? {} : {
      variant,
      tone,
      corner,
      glassOpacity,
      vibrancy,
      specularMode,
      // No inset here: the scrolling body owns it, so its scrollbar reaches
      // the card's edge.
      padding: 'none',
      scrollable: false,
    }"
    :class="classNames('h-full min-h-0', classAttr)"
  >
    <div
      ref="containerRef"
      v-bind="restAttrs"
      :class="containerClass"
      :style="heightStyle"
      :aria-busy="busy"
    >
      <!-- Empty / first load -->
      <template v-if="items.length === 0">
        <div
          v-if="isLoading"
          class="flex min-h-40 items-center justify-center p-8"
        >
          <slot name="loadingComponent">
            <Spinner :color="tone" size="lg" variant="segments" />
          </slot>
        </div>
        <slot v-else name="emptyComponent">
          <div
            class="flex min-h-40 items-center justify-center p-12 text-center text-sm text-neutral-500 dark:text-neutral-400"
          >
            {{ emptyMessage }}
          </div>
        </slot>
      </template>

      <template v-else>
        <!-- Balanced columns -->
        <div
          v-if="layout === 'columns'"
          :class="classNames('grid', gapClass)"
          :style="gridStyle"
        >
          <div
            v-for="(bucket, column) in buckets"
            :key="column"
            :class="classNames('flex flex-col', gapClass)"
          >
            <div
              v-for="{ item, index } in bucket"
              :key="keyFor(item, index)"
            >
              <slot name="renderItem" :item="item" :index="index" />
            </div>
          </div>
        </div>

        <!-- List / grid / masonry -->
        <div
          v-else
          ref="gridRef"
          :class="
            classNames(
              layout === 'list' ? 'flex flex-col' : 'grid items-start',
              gapClass,
            )
          "
          :style="gridStyle"
        >
          <div
            v-for="(item, index) in items"
            :key="keyFor(item, index)"
            :ref="(el) => setItemRef(el, index)"
          >
            <slot name="renderItem" :item="item" :index="index" />
          </div>
        </div>
      </template>

      <!-- Always rendered while more may arrive, so the observer has something
           to watch even before the first scroll. -->
      <div v-if="hasMore || error" ref="sentinelRef" aria-hidden="true" />

      <!-- Footer: retry, loading, or the end marker -->
      <div
        v-if="error"
        class="flex flex-col items-center justify-center gap-3 p-6 text-center"
      >
        <span class="text-sm text-rose-600 dark:text-rose-400">
          Could not load more items.
        </span>
        <Button
          size="sm"
          variant="outline"
          :color="tone"
          leading-icon="Refresh"
          @click="retry"
        >
          Try again
        </Button>
      </div>
      <div
        v-else-if="hasMore"
        class="flex items-center justify-center p-8"
      >
        <slot name="loadingComponent">
          <div class="flex flex-col items-center justify-center gap-3">
            <Spinner
              :color="tone"
              size="lg"
              variant="segments"
              thickness="thick"
            />
            <span class="text-sm text-neutral-500 dark:text-neutral-400">
              Loading more...
            </span>
          </div>
        </slot>
      </div>
      <!-- The list used to just stop, with no signal that it was finished. -->
      <slot v-else-if="items.length > 0" name="endComponent">
        <div
          class="flex items-center justify-center p-6 text-center text-xs text-neutral-500 dark:text-neutral-400"
        >
          {{ endMessage }}
        </div>
      </slot>
    </div>
  </component>
</template>

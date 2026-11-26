<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from "vue";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";
import Button from "./Button.vue";
import { useKitT } from "../i18n";
import { useScrollOverflow } from "../composables/useScrollOverflow";

const t = useKitT();
const props = defineProps<{
  config: TableInfiniteScrollState;
  itemCount: number;
  busy: boolean;
  error: unknown;
  loadMore: () => Promise<void>;
  /** The scroller the rows live in. The end marker only appears when its
   * content actually overflows — a table that fits has no end of scrolling
   * to announce. Without it the marker always shows, as it used to. */
  scrollElement?: HTMLElement | null;
}>();
const sentinelRef = ref<HTMLDivElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);
const emit = defineEmits<{ sentinel: [element: HTMLDivElement | null] }>();
watchEffect(() => emit("sentinel", sentinelRef.value));
onBeforeUnmount(() => emit("sentinel", null));

// This footer sits inside the scroller, so it excludes its own always-there
// box from the overflow reading — the marker never triggers itself in.
const scrollRef = computed(() => props.scrollElement);
const overflow = useScrollOverflow(scrollRef, {
  excludeRef: rootRef,
  deps: () => [props.itemCount, props.config.hasMore, props.error, props.busy],
});

const message = computed(() => props.error
  ? t("kit.table.loadMoreError")
  : props.busy
    ? t("kit.table.loadingMore")
    : !props.config.hasMore && props.itemCount > 0
      && props.config.showEndMarker !== false && overflow.value
      ? t("kit.table.endOfResults")
      : "");
</script>

<template>
  <div
    ref="rootRef"
    data-slot="table-infinite-scroll"
    class="p-3 text-center text-sm text-neutral-500 dark:text-neutral-400"
  >
    <div ref="sentinelRef" aria-hidden="true" />
    <div role="status" aria-live="polite">{{ message }}</div>
    <Button v-if="error" size="sm" variant="outline" @click="loadMore">
      {{ t("kit.table.retryLoadMore") }}
    </Button>
    <Button v-else-if="config.hasMore && !busy" size="sm" variant="outline" @click="loadMore">
      {{ t("kit.table.loadMore") }}
    </Button>
  </div>
</template>

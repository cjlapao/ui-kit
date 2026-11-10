<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from "vue";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";
import Button from "./Button.vue";
import { useKitT } from "../i18n";

const t = useKitT();
const props = defineProps<{
  config: TableInfiniteScrollState;
  itemCount: number;
  busy: boolean;
  error: unknown;
  loadMore: () => Promise<void>;
}>();
const sentinelRef = ref<HTMLDivElement | null>(null);
const emit = defineEmits<{ sentinel: [element: HTMLDivElement | null] }>();
watchEffect(() => emit("sentinel", sentinelRef.value));
onBeforeUnmount(() => emit("sentinel", null));

const message = computed(() => props.error
  ? t("kit.table.loadMoreError")
  : props.busy
    ? t("kit.table.loadingMore")
    : !props.config.hasMore && props.itemCount > 0
      ? t("kit.table.endOfResults")
      : "");
</script>

<template>
  <div
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

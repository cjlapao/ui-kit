<script lang="ts">
import { ref, watch, type Ref } from "vue";
import type { TreeTone } from "../TreeView/types";
import type { ConnectionFlowItem } from "./types";
import type { ColumnGeometry } from "./ConnectionFlowColumn.vue";

// Gap between parallel item cards
const GROUP_ROW_GAP = 8;

function useElementHeight(elRef: Ref<HTMLElement | null>): Ref<number> {
  const h = ref(0);
  watch(
    elRef,
    (el, _prev, onCleanup) => {
      if (!el) return;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        raf = requestAnimationFrame(() => {
          if (el) h.value = el.getBoundingClientRect().height;
        });
      });
      ro.observe(el);
      onCleanup(() => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      });
    },
    { immediate: true, flush: "post" },
  );
  return h;
}

export interface ConnectionFlowParallelGroupProps {
  items: ConnectionFlowItem[];
  globalTone?: TreeTone;
  itemWidth?: number | string;
  hoverable?: boolean;
}
</script>

<script setup lang="ts">
import { computed, shallowRef, type CSSProperties } from "vue";
import classNames from "classnames";
import TreeItemCard from "../TreeView/TreeItemCard.vue";

defineOptions({ name: "ConnectionFlowParallelGroup" });

const props = withDefaults(defineProps<ConnectionFlowParallelGroupProps>(), {
  hoverable: false,
});

const emit = defineEmits<{
  (e: "geometryChange", geo: ColumnGeometry): void;
}>();

const groupRef = ref<HTMLDivElement | null>(null);
const groupH = useElementHeight(groupRef);
const itemCount = computed(() => props.items.length);

// Per-item height measurements via individual refs
const itemEls = shallowRef<(HTMLElement | null)[]>([]);
const itemHeights = ref<number[]>(Array(itemCount.value).fill(0));

const setItemEl = (i: number, el: HTMLElement | null) => {
  if (itemEls.value[i] !== el) {
    const next = itemEls.value.slice();
    next[i] = el;
    itemEls.value = next;
  }
};

// Reset when item count changes
watch(itemCount, (n) => {
  itemHeights.value = Array(n).fill(0);
  itemEls.value = itemEls.value.slice(0, n);
});

// Register a ResizeObserver per item
watch(
  itemEls,
  (els, _prev, onCleanup) => {
    const observers: ResizeObserver[] = [];
    const rafs: number[] = [];
    els.forEach((el, i) => {
      if (!el) return;
      const ro = new ResizeObserver(() => {
        const raf = requestAnimationFrame(() => {
          if (!el) return;
          const h = el.getBoundingClientRect().height;
          if (itemHeights.value[i] === h) return;
          const n = [...itemHeights.value];
          n[i] = h;
          itemHeights.value = n;
        });
        rafs.push(raf);
      });
      ro.observe(el);
      observers.push(ro);
    });
    onCleanup(() => {
      rafs.forEach(cancelAnimationFrame);
      observers.forEach((ro) => ro.disconnect());
    });
  },
  { immediate: true, flush: "post" },
);

// Report geometry: anchor at the vertical centre of each item card
watch([groupH, itemHeights], () => {
  if (groupH.value === 0) return;
  if (itemHeights.value.some((h) => h === 0)) return;

  const anchors: number[] = [];
  let y = 0;
  itemHeights.value.forEach((h) => {
    anchors.push(y + h / 2);
    y += h + GROUP_ROW_GAP;
  });

  emit("geometryChange", {
    totalHeight: groupH.value,
    anchors,
    isParallelGroup: true,
  });
});

const rootClass = computed(() =>
  classNames(
    "flex flex-col",
    props.itemWidth ? "flex-shrink-0" : "flex-1 min-w-0",
  ),
);
const rootStyle = computed<CSSProperties>(() => ({
  gap: `${GROUP_ROW_GAP}px`,
  ...(props.itemWidth
    ? {
        width:
          typeof props.itemWidth === "number"
            ? `${props.itemWidth}px`
            : props.itemWidth,
      }
    : undefined),
}));

const resolveTone = (item: ConnectionFlowItem): TreeTone =>
  item.tone ?? props.globalTone ?? "neutral";
</script>

<template>
  <div ref="groupRef" :class="rootClass" :style="rootStyle">
    <div
      v-for="(item, i) in items"
      :key="item.id"
      :ref="(el: unknown) => setItemEl(i, el as HTMLElement | null)"
    >
      <TreeItemCard
        :icon="item.icon"
        :icon-class-name="item.iconClassName"
        :title="item.title"
        :title-class-name="item.titleClassName"
        :title-wrap="item.titleWrap"
        :title-scroll="item.titleScroll"
        :subtitle="item.subtitle"
        :subtitle-class-name="item.subtitleClassName"
        :description="item.description"
        :description-class-name="item.descriptionClassName"
        :badge="item.badge"
        :tone="resolveTone(item)"
        :body="item.body"
        :default-expanded="item.defaultExpanded"
        :actions="item.actions"
        :hover-actions="item.hoverActions"
        :hoverable="hoverable"
        :active-pulse="item.activePulse"
      />
    </div>
  </div>
</template>

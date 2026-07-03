<script lang="ts">
import { ref, watch, type Ref } from "vue";
import type {
  DropPosition,
  TreeItemData,
  TreeSvgConfig,
  TreeTone,
} from "./types";

// ── useElementHeight ─────────────────────────────────────────────────────────

function useElementHeight(elRef: Ref<HTMLElement | null>): Ref<number> {
  const h = ref(0);
  watch(
    elRef,
    (el, _prev, onCleanup) => {
      if (!el) return;
      const ro = new ResizeObserver(([e]) => {
        h.value = e.contentRect.height;
      });
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    },
    { immediate: true, flush: "post" },
  );
  return h;
}

// ── TreeItemRow — wraps a card + optional sub-tree, reports height/anchor ────

export interface TreeItemRowProps {
  item: TreeItemData;
  globalTone?: TreeTone;
  depth: number;
  index: number;
  // SVG config forwarded to sub-tree
  svgProps: TreeSvgConfig;
  // Reordering
  reorderable: boolean;
  isDragging: boolean;
  dropIndicator?: DropPosition | null;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import classNames from "classnames";
import TreeItemCard from "./TreeItemCard.vue";
import TreeLevel from "./TreeLevel.vue";
import IconButton from "../IconButton.vue";

defineOptions({ name: "TreeItemRow" });

const props = withDefaults(defineProps<TreeItemRowProps>(), {
  dropIndicator: null,
});

const emit = defineEmits<{
  // Callbacks for parent TrunkSvg
  (e: "rowElement", el: HTMLDivElement | null): void;
  (e: "heightChange", height: number): void;
  (e: "anchorChange", anchor: number): void;
  (e: "toneChange", tone: TreeTone): void;
  (e: "activeChange", active: boolean): void;
}>();

const rowEl = ref<HTMLDivElement | null>(null);
const cardEl = ref<HTMLDivElement | null>(null);
const childLevelWrapEl = ref<HTMLDivElement | null>(null);
const rowHeight = useElementHeight(rowEl);
const cardHeight = useElementHeight(cardEl);
const childLevelOffset = ref(0);

const resolvedTone = computed<TreeTone>(
  () => props.item.tone ?? props.globalTone ?? "neutral",
);
const isActive = computed(() => props.item.active ?? false);
const hasChildren = computed(() =>
  Boolean(props.item.children && props.item.children.length > 0),
);
const childrenExpanded = ref(props.item.defaultExpanded ?? true);

const toggleChildren = () => {
  childrenExpanded.value = !childrenExpanded.value;
};

onMounted(() => emit("rowElement", rowEl.value));
onBeforeUnmount(() => emit("rowElement", null));

// Report full row height (card + nested subtree) for level layout spacing.
watch(rowHeight, (h) => {
  if (h > 0) {
    emit("heightChange", h);
  }
});

// Anchor must be based on card height only (not children), otherwise expanded
// branches drift downward and no longer align with their own cards.
watch(cardHeight, (h) => {
  if (h > 0) {
    emit("anchorChange", h / 2);
  }
});

// Measure actual gap between the parent card border and nested TreeLevel
// container. This keeps parent->child connector anchoring correct across
// responsive layout changes and varying row densities.
watch(
  [cardEl, childLevelWrapEl, hasChildren, childrenExpanded],
  (_values, _prev, onCleanup) => {
    const card = cardEl.value;
    const childWrap = childLevelWrapEl.value;

    if (!card || !childWrap || !hasChildren.value || !childrenExpanded.value) {
      childLevelOffset.value = 0;
      return;
    }

    const computeOffset = () => {
      const cardRect = card.getBoundingClientRect();
      const childRect = childWrap.getBoundingClientRect();
      childLevelOffset.value = Math.max(0, childRect.top - cardRect.bottom);
    };

    computeOffset();
    const ro = new ResizeObserver(computeOffset);
    ro.observe(card);
    ro.observe(childWrap);
    window.addEventListener("resize", computeOffset);

    onCleanup(() => {
      ro.disconnect();
      window.removeEventListener("resize", computeOffset);
    });
  },
  { immediate: true, flush: "post" },
);

// Report tone and active
watch(resolvedTone, (t) => emit("toneChange", t), { immediate: true });
watch(isActive, (v) => emit("activeChange", v), { immediate: true });

const rowClass = computed(() =>
  classNames(
    "relative mb-2 min-w-0 transition-[transform,opacity] duration-200 ease-out",
    props.reorderable && "cursor-grab active:cursor-grabbing",
    props.isDragging && "opacity-70",
  ),
);
</script>

<template>
  <div ref="rowEl" :class="rowClass" :draggable="reorderable">
    <div
      v-if="dropIndicator"
      :class="
        classNames(
          'pointer-events-none absolute left-0 right-0 z-20 h-0.5 rounded-full bg-sky-400/90',
          dropIndicator === 'before' ? '-top-1' : '-bottom-1',
        )
      "
    />
    <div ref="cardEl">
      <TreeItemCard
        :icon="item.icon"
        :icon-class-name="item.iconClassName"
        :title="item.title"
        :title-class-name="item.titleClassName"
        :subtitle="item.subtitle"
        :subtitle-class-name="item.subtitleClassName"
        :description="item.description"
        :description-class-name="item.descriptionClassName"
        :badge="item.badge"
        :tone="resolvedTone"
        :body="item.body"
        :default-expanded="item.defaultExpanded"
        :expanded="hasChildren ? childrenExpanded : undefined"
        :force-toggle="hasChildren"
        :actions="item.actions"
        :hover-actions="item.hoverActions"
        :is-dragging="isDragging"
        :index="index"
        v-bind="hasChildren ? { onToggleExpanded: toggleChildren } : {}"
      >
        <template v-if="reorderable" #dragHandle>
          <IconButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="Drag"
            aria-label="Drag to reorder"
            tooltip="Drag to reorder"
          />
        </template>
      </TreeItemCard>
    </div>
    <!-- Recursive sub-tree for children -->
    <div
      v-if="hasChildren && childrenExpanded && item.children"
      ref="childLevelWrapEl"
      class="mt-1"
    >
      <TreeLevel
        :items="item.children"
        :global-tone="globalTone"
        :svg-props="svgProps"
        :parent-tone="resolvedTone"
        :parent-active="isActive"
        :parent-offset="childLevelOffset"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

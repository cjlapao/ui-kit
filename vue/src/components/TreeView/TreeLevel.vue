<script lang="ts">
import type {
  DropPosition,
  DropTarget,
  TreeItemData,
  TreeSvgConfig,
  TreeTone,
} from "./types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildOrderKey(items: TreeItemData[]): string {
  return items.map((item) => item.id).join("::");
}

function mergeItemsByExistingOrder(
  current: TreeItemData[],
  incoming: TreeItemData[],
): TreeItemData[] {
  const incomingById = new Map(incoming.map((item) => [item.id, item]));
  const next: TreeItemData[] = [];

  for (const item of current) {
    const incomingItem = incomingById.get(item.id);
    if (incomingItem) {
      next.push(incomingItem);
      incomingById.delete(item.id);
    }
  }

  for (const item of incoming) {
    if (incomingById.has(item.id)) {
      next.push(item);
      incomingById.delete(item.id);
    }
  }

  return next;
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

// ── TreeLevel — renders a list of items + their TrunkSvg ─────────────────────

export interface TreeLevelProps {
  items: TreeItemData[];
  globalTone?: TreeTone;
  svgProps: TreeSvgConfig;
  parentTone?: TreeTone;
  parentActive?: boolean;
  stubHeight?: number;
  parentOffset?: number;
  depth?: number;
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import TreeItemRow from "./TreeItemRow.vue";
import TreeFlowSvg, { INDENT_PX } from "./TreeFlowSvg.vue";

defineOptions({ name: "TreeLevel" });

const props = withDefaults(defineProps<TreeLevelProps>(), {
  parentActive: false,
  depth: 0,
});

const resolvedStubHeight = computed(
  () => props.stubHeight ?? props.svgProps.stubHeight ?? 12,
);
const resolvedIndent = computed(() => props.svgProps.indent ?? "xs");
const resolvedRowGap = computed(() => props.svgProps.rowGap ?? 8);
const indentPx = computed(() => INDENT_PX[resolvedIndent.value]);

const isReorderEnabled = computed(() =>
  Boolean(props.svgProps.reorderable && props.items.length > 1),
);

const orderedItems = shallowRef<TreeItemData[]>(props.items);
let prevIncomingOrderKey = buildOrderKey(props.items);
let hasLocalOrderOverride = false;

// Keep local order when parent re-renders unchanged order while async save is in-flight.
watch(
  () => props.items,
  (items) => {
    const incomingKey = buildOrderKey(items);
    if (!hasLocalOrderOverride) {
      orderedItems.value = items;
    } else if (incomingKey !== prevIncomingOrderKey) {
      hasLocalOrderOverride = false;
      orderedItems.value = items;
    } else {
      orderedItems.value = mergeItemsByExistingOrder(
        orderedItems.value,
        items,
      );
    }
    prevIncomingOrderKey = incomingKey;
  },
);

// Per-item state for the SVG (tracked by id, then projected to arrays)
const cardHeightById = shallowRef<Record<string, number>>({});
const cardAnchorById = shallowRef<Record<string, number>>({});
const toneById = shallowRef<Record<string, TreeTone>>({});
const activeById = shallowRef<Record<string, boolean>>({});

const rowElements: Record<string, HTMLDivElement | null> = {};
let previousTopById: Record<string, number> = {};

let dragStart: { id: string; index: number } | null = null;
let dropTargetCurrent: DropTarget | null = null;
const draggingId = ref<string | null>(null);
const dropTarget = ref<DropTarget | null>(null);

watch(orderedItems, (items) => {
  const validIds = new Set(items.map((item) => item.id));

  const prune = <T,>(prev: Record<string, T>): Record<string, T> => {
    let dirty = false;
    const next: Record<string, T> = {};
    for (const [id, value] of Object.entries(prev)) {
      if (validIds.has(id)) {
        next[id] = value;
      } else {
        dirty = true;
      }
    }
    return dirty ? next : prev;
  };

  cardHeightById.value = prune(cardHeightById.value);
  cardAnchorById.value = prune(cardAnchorById.value);
  toneById.value = prune(toneById.value);
  activeById.value = prune(activeById.value);
});

const updateHeight = (id: string, h: number) => {
  const prev = cardHeightById.value;
  if (prev[id] !== h) cardHeightById.value = { ...prev, [id]: h };
};

const updateAnchor = (id: string, a: number) => {
  const prev = cardAnchorById.value;
  if (prev[id] !== a) cardAnchorById.value = { ...prev, [id]: a };
};

const updateTone = (id: string, t: TreeTone) => {
  const prev = toneById.value;
  if (prev[id] !== t) toneById.value = { ...prev, [id]: t };
};

const updateActive = (id: string, active: boolean) => {
  const prev = activeById.value;
  if (prev[id] !== active) activeById.value = { ...prev, [id]: active };
};

const setRowElement = (id: string, el: HTMLDivElement | null) => {
  if (el) {
    rowElements[id] = el;
    return;
  }
  delete rowElements[id];
  delete previousTopById[id];
};

const clearDragState = () => {
  dragStart = null;
  dropTargetCurrent = null;
  draggingId.value = null;
  dropTarget.value = null;
};

const commitDrop = () => {
  if (!isReorderEnabled.value) {
    clearDragState();
    return;
  }

  const start = dragStart;
  const target = dropTargetCurrent;
  if (!start || !target) {
    clearDragState();
    return;
  }

  const items = orderedItems.value;
  const fromIndex = items.findIndex((item) => item.id === start.id);
  if (fromIndex === -1) {
    clearDragState();
    return;
  }

  let nextIndex = target.position === "after" ? target.index + 1 : target.index;
  if (nextIndex > fromIndex) {
    nextIndex -= 1;
  }
  nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));

  if (nextIndex !== fromIndex) {
    hasLocalOrderOverride = true;
    orderedItems.value = moveItem(items, fromIndex, nextIndex);
    props.svgProps.onReorder?.({
      id: start.id,
      oldOrder: fromIndex,
      newOrder: nextIndex,
    });
  }

  clearDragState();
};

// FLIP animation so sibling cards move smoothly when order changes.
const runFlip = () => {
  const nextTopById: Record<string, number> = {};

  for (const item of orderedItems.value) {
    const rowEl = rowElements[item.id];
    if (!rowEl) continue;

    const nextTop = rowEl.offsetTop;
    nextTopById[item.id] = nextTop;

    const prevTop = previousTopById[item.id];
    if (prevTop === undefined || prevTop === nextTop) continue;

    const deltaY = prevTop - nextTop;
    rowEl.style.transition = "none";
    rowEl.style.transform = `translateY(${deltaY}px)`;
    rowEl.style.willChange = "transform";

    requestAnimationFrame(() => {
      rowEl.style.transition = "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
      rowEl.style.transform = "translateY(0)";
    });
  }

  previousTopById = nextTopById;
};

onMounted(runFlip);
watch(orderedItems, runFlip, { flush: "post" });

const cardHeights = computed(() =>
  orderedItems.value.map((item) => cardHeightById.value[item.id] ?? 0),
);
const cardAnchors = computed(() =>
  orderedItems.value.map((item) => cardAnchorById.value[item.id] ?? 0),
);
const toneList = computed(() =>
  orderedItems.value.map(
    (item) =>
      toneById.value[item.id] ?? item.tone ?? props.globalTone ?? "neutral",
  ),
);
const activeList = computed(() =>
  orderedItems.value.map(
    (item) => activeById.value[item.id] ?? Boolean(item.active),
  ),
);

const handleLevelDragOver = (event: DragEvent) => {
  if (!isReorderEnabled.value || !dragStart) return;

  event.preventDefault();
  event.stopPropagation();

  const items = orderedItems.value;
  if (items.length === 0) return;

  const firstId = items[0]?.id;
  const lastId = items[items.length - 1]?.id;
  const firstRow = firstId ? rowElements[firstId] : null;
  const lastRow = lastId ? rowElements[lastId] : null;

  if (!firstRow || !lastRow) return;

  let nextTarget: DropTarget | null = null;
  const firstRect = firstRow.getBoundingClientRect();
  const lastRect = lastRow.getBoundingClientRect();

  if (event.clientY <= firstRect.top) {
    nextTarget = { index: 0, position: "before" };
  } else if (event.clientY >= lastRect.bottom) {
    nextTarget = { index: items.length - 1, position: "after" };
  }

  if (nextTarget) {
    const prevTarget = dropTargetCurrent;
    if (
      !prevTarget ||
      prevTarget.index !== nextTarget.index ||
      prevTarget.position !== nextTarget.position
    ) {
      dropTargetCurrent = nextTarget;
      dropTarget.value = nextTarget;
    }
  }

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const handleLevelDrop = (event: DragEvent) => {
  if (!isReorderEnabled.value) return;
  event.preventDefault();
  event.stopPropagation();
  commitDrop();
};

const onRowDragStart = (id: string, index: number, event: DragEvent) => {
  if (!isReorderEnabled.value) return;
  event.stopPropagation();
  dragStart = { id, index };
  dropTargetCurrent = { index, position: "before" };
  draggingId.value = id;
  dropTarget.value = { index, position: "before" };
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }
};

const onRowDragOver = (index: number, event: DragEvent) => {
  if (!isReorderEnabled.value || !dragStart) return;
  event.preventDefault();
  event.stopPropagation();

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const position: DropPosition =
    event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  const nextTarget: DropTarget = { index, position };

  const prevTarget = dropTargetCurrent;
  if (
    !prevTarget ||
    prevTarget.index !== nextTarget.index ||
    prevTarget.position !== nextTarget.position
  ) {
    dropTargetCurrent = nextTarget;
    dropTarget.value = nextTarget;
  }

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onRowDrop = (event: DragEvent) => {
  if (!isReorderEnabled.value) return;
  event.preventDefault();
  event.stopPropagation();
  commitDrop();
};

const onRowDragEnd = (event: DragEvent) => {
  if (!isReorderEnabled.value) return;
  event.stopPropagation();
  clearDragState();
};
</script>

<template>
  <div class="relative" :style="{ paddingLeft: `${indentPx}px` }">
    <div @dragover="handleLevelDragOver" @drop="handleLevelDrop">
      <TreeItemRow
        v-for="(item, i) in orderedItems"
        :key="item.id"
        :item="item"
        :global-tone="globalTone"
        :depth="depth"
        :index="i"
        :svg-props="svgProps"
        :reorderable="isReorderEnabled"
        :is-dragging="draggingId === item.id"
        :drop-indicator="
          dropTarget && dropTarget.index === i && draggingId !== item.id
            ? dropTarget.position
            : null
        "
        @row-element="(el) => setRowElement(item.id, el)"
        @height-change="(h) => updateHeight(item.id, h)"
        @anchor-change="(a) => updateAnchor(item.id, a)"
        @tone-change="(t) => updateTone(item.id, t)"
        @active-change="(v) => updateActive(item.id, v)"
        @dragstart="(event: DragEvent) => onRowDragStart(item.id, i, event)"
        @dragover="(event: DragEvent) => onRowDragOver(i, event)"
        @drop="onRowDrop"
        @dragend="onRowDragEnd"
      />
    </div>
    <!-- TrunkSvg rendered AFTER card rows so it paints on top of borders -->
    <TreeFlowSvg
      :card-heights="cardHeights"
      :card-anchors="cardAnchors"
      :tone-list="toneList"
      :active-list="activeList"
      :root-tone="parentTone"
      :root-active="parentActive"
      :row-gap="resolvedRowGap"
      :stub-height="resolvedStubHeight"
      :parent-offset="parentOffset"
      :depth="depth"
      :root-child-indent-extra="svgProps.rootChildIndentExtra"
      :indent="resolvedIndent"
      :show-line="svgProps.showLine"
      :show-connectors="svgProps.showConnectors"
      :connector-style="svgProps.connectorStyle"
      :branch-color-mode="svgProps.branchColorMode"
      :junction-style="svgProps.junctionStyle"
      :show-center-dot="svgProps.showCenterDot"
      :connector-half="svgProps.connectorHalf"
      :connector-border-size="svgProps.connectorBorderSize"
      :dot-spacing="svgProps.dotSpacing"
      :animated="svgProps.animated"
    />
  </div>
</template>

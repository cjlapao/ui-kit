<script lang="ts">
import { ref, watch, type Ref } from "vue";
import type { TreeTone } from "../TreeView/types";
import type { ConnectionFlowItem } from "./types";

// ── Geometry reported by a column ─────────────────────────────────────────────

export interface ColumnGeometry {
  /** Total rendered height of the whole column (parent + gap + all children). */
  totalHeight: number;
  /**
   * Y offsets (from the TOP of the column) to the centre of each source card.
   * anchors[0] = parent card, anchors[1..] = child cards (or parallel items).
   */
  anchors: number[];
  /** True when this geometry represents a parallel group (not a single-item column). */
  isParallelGroup?: boolean;
}

// ── useElementHeight ──────────────────────────────────────────────────────────

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

// ── ConnectionFlowColumn ──────────────────────────────────────────────────────

export interface ConnectionFlowColumnProps {
  item: ConnectionFlowItem;
  globalTone?: TreeTone;
  childIndent?: "xs" | "sm" | "md" | "lg";
  childRowGap?: number;
  animated?: boolean;
  showLine?: boolean;
  connectorHalf?: boolean;
  connectorBorderSize?: "fit" | "xs" | "sm" | "md" | "lg";
  dotSpacing?: number;
  itemWidth?: number | string;
  /** When true, forces all child branches to animate (mirrors parent connection state). */
  flowActive?: boolean;
  /** When true, cards show a hover lift effect. */
  hoverable?: boolean;
}

// Gap between parent card bottom and first child card top (mt-2)
const CHILD_GAP_TOP = 8;
// mb-2 gap after each ChildRow
const CHILD_ROW_MB = 8;
</script>

<script setup lang="ts">
import { computed, shallowRef, type CSSProperties } from "vue";
import classNames from "classnames";
import TreeItemCard from "../TreeView/TreeItemCard.vue";
import TreeFlowSvg, { INDENT_PX } from "../TreeView/TreeFlowSvg.vue";

defineOptions({ name: "ConnectionFlowColumn" });

const props = withDefaults(defineProps<ConnectionFlowColumnProps>(), {
  childIndent: "xs",
  childRowGap: CHILD_ROW_MB,
  animated: true,
  showLine: true,
  connectorHalf: true,
  connectorBorderSize: "xs",
  dotSpacing: 50,
  flowActive: false,
  hoverable: false,
});

const emit = defineEmits<{
  /** Reports geometry so ConnectionFlow can build a multi-source connector. */
  (e: "geometryChange", geo: ColumnGeometry): void;
}>();

const hasChildren = computed(
  () => !!(props.item.children && props.item.children.length > 0),
);
const resolvedTone = computed<TreeTone>(
  () => props.item.tone ?? props.globalTone ?? "neutral",
);
const childCount = computed(() => props.item.children?.length ?? 0);

// ── Refs & heights ────────────────────────────────────────────────────────
const columnRef = ref<HTMLDivElement | null>(null);
const parentCardRef = ref<HTMLDivElement | null>(null);
const parentCardH = useElementHeight(parentCardRef);
const columnH = useElementHeight(columnRef);

// Per-child measurements
const childEls = shallowRef<(HTMLElement | null)[]>([]);
const cardHeights = ref<number[]>(Array(childCount.value).fill(0));
const cardAnchors = ref<number[]>(Array(childCount.value).fill(0));
// Minimum height seen per child — the anchor tracks the collapsed card centre
const minChildHeights: (number | null)[] = [];

const setChildEl = (i: number, el: HTMLElement | null) => {
  if (childEls.value[i] !== el) {
    const next = childEls.value.slice();
    next[i] = el;
    childEls.value = next;
  }
};

// Reset arrays when child count changes
watch(childCount, (n) => {
  cardHeights.value = Array(n).fill(0);
  cardAnchors.value = Array(n).fill(0);
  minChildHeights.length = 0;
  childEls.value = childEls.value.slice(0, n);
});

const updH = (i: number, h: number) => {
  if (cardHeights.value[i] === h) return;
  const n = [...cardHeights.value];
  n[i] = h;
  cardHeights.value = n;
};
const updA = (i: number, a: number) => {
  if (cardAnchors.value[i] === a) return;
  const n = [...cardAnchors.value];
  n[i] = a;
  cardAnchors.value = n;
};

// Register a ResizeObserver per child row (mirrors React's ChildRow refs)
watch(
  childEls,
  (els, _prev, onCleanup) => {
    const observers: ResizeObserver[] = [];
    const rafs: number[] = [];
    els.forEach((el, i) => {
      if (!el) return;
      const ro = new ResizeObserver(() => {
        const raf = requestAnimationFrame(() => {
          if (!el) return;
          const h = el.getBoundingClientRect().height;
          if (h > 0) {
            updH(i, h);
            const minH = minChildHeights[i];
            if (minH === null || minH === undefined || h < minH) {
              minChildHeights[i] = h;
              updA(i, h / 2);
            }
          }
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

// Tone/active per child — derived directly from item data (mirrors ChildRow reports)
const toneList = computed<TreeTone[]>(() =>
  (props.item.children ?? []).map(
    (child) => child.tone ?? props.globalTone ?? "neutral",
  ),
);
const activeList = computed<boolean[]>(() =>
  (props.item.children ?? []).map((child) => child.active ?? false),
);

// ── Geometry → ConnectionFlow ─────────────────────────────────────────────
watch(
  [parentCardH, columnH, cardHeights, cardAnchors, hasChildren, () => props.childRowGap],
  () => {
    if (parentCardH.value === 0 || columnH.value === 0) return;

    const anchors: number[] = [parentCardH.value / 2];

    if (
      hasChildren.value &&
      cardHeights.value.length > 0 &&
      cardHeights.value.every((h) => h > 0)
    ) {
      // Children start after: parentCard + mt-2 (CHILD_GAP_TOP)
      const childBlockTop = parentCardH.value + CHILD_GAP_TOP;
      let rowTop = childBlockTop;
      cardHeights.value.forEach((h, idx) => {
        anchors.push(rowTop + (cardAnchors.value[idx] ?? h / 2));
        rowTop += h + props.childRowGap;
      });
    }

    emit("geometryChange", { totalHeight: columnH.value, anchors });
  },
);

// Force-active merging for TreeFlowSvg
const mergedActiveList = computed(() =>
  props.flowActive ? activeList.value.map(() => true) : activeList.value,
);

const rootClass = computed(() =>
  classNames(
    "flex flex-col relative",
    props.itemWidth ? "shrink-0" : "flex-1 min-w-0",
  ),
);
const rootStyle = computed<CSSProperties | undefined>(() =>
  props.itemWidth
    ? {
        width:
          typeof props.itemWidth === "number"
            ? `${props.itemWidth}px`
            : props.itemWidth,
      }
    : undefined,
);

const showTreeSvg = computed(
  () =>
    hasChildren.value &&
    parentCardH.value > 0 &&
    cardHeights.value.every((h) => h > 0),
);

// Column-level SVG: positioned to the left of the column
// and draws the [ shape connecting parent left edge to children's left edges
const treeSvgStyle = computed<CSSProperties>(() => ({
  position: "absolute",
  left: `${-INDENT_PX[props.childIndent]}px`,
  top: "0",
  pointerEvents: "none",
}));
</script>

<template>
  <div ref="columnRef" :class="rootClass" :style="rootStyle">
    <!-- Parent card — full width -->
    <div ref="parentCardRef">
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
        :tone="resolvedTone"
        :body="item.body"
        :default-expanded="item.defaultExpanded"
        :actions="item.actions"
        :hover-actions="item.hoverActions"
        :hoverable="hoverable"
        :active-pulse="item.activePulse"
      />
    </div>

    <!-- Children — full width, NO paddingLeft -->
    <div v-if="hasChildren" class="mt-2 flex-1">
      <div
        v-for="(child, i) in item.children"
        :key="child.id"
        :ref="(el: unknown) => setChildEl(i, el as HTMLElement | null)"
        class="mb-2 min-w-0"
      >
        <TreeItemCard
          :icon="child.icon"
          :icon-class-name="child.iconClassName"
          :title="child.title"
          :title-class-name="child.titleClassName"
          :title-wrap="child.titleWrap"
          :title-scroll="child.titleScroll"
          :subtitle="child.subtitle"
          :subtitle-class-name="child.subtitleClassName"
          :description="child.description"
          :description-class-name="child.descriptionClassName"
          :badge="child.badge"
          :tone="child.tone ?? globalTone ?? 'neutral'"
          :body="child.body"
          :default-expanded="child.defaultExpanded"
          :actions="child.actions"
          :hover-actions="child.hoverActions"
          :hoverable="hoverable"
          :active-pulse="child.activePulse"
          :index="i"
        />
      </div>
    </div>

    <!-- Column-level SVG: positioned to the left of the column
                and draws the [ shape connecting parent left edge to children's left edges -->
    <TreeFlowSvg
      v-if="showTreeSvg"
      mode="bracket"
      :parent-anchor-y="parentCardH - 16"
      :card-heights="cardHeights"
      :card-anchors="cardAnchors"
      :tone-list="toneList"
      :active-list="mergedActiveList"
      :root-tone="resolvedTone"
      :root-active="item.active || flowActive"
      :row-gap="childRowGap"
      :stub-height="parentCardH + CHILD_GAP_TOP"
      :indent="childIndent"
      :show-line="showLine"
      show-connectors
      :connector-half="connectorHalf"
      :connector-border-size="connectorBorderSize"
      :dot-spacing="dotSpacing"
      :animated="animated"
      :style="treeSvgStyle"
    />
  </div>
</template>

<script lang="ts">
import { isVNode } from "vue";
import type { PanelVariant, PanelCorner } from "../Panel.vue";
import type {
  TimelinePanelAction,
  TimelinePanelItem,
  TimelinePanelHeaderAction,
} from "./types";

// ── useIsDark — detects Tailwind dark class on <html> ────────────────────────

function detectDark(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("div");
  probe.className = "hidden dark:block";
  document.body.appendChild(probe);
  const dark = window.getComputedStyle(probe).display === "block";
  probe.remove();
  return dark;
}

// ── SVG layout constants ───────────────────────────────────────────────────────

/** Width of the left gutter that the SVG occupies. */
const SVG_W = 28;
/** X position of the vertical trunk line. */
const TRUNK_X = 12;
/**
 * One indent column = icon width (32px / w-8) + inner gap (12px / gap-3).
 * Each depth level shifts by this amount so a child's icon aligns with its
 * parent's text start.
 */
const ITEM_DEPTH_PX = 44;
/** Icon width in px (w-8). Used to compute parent icon center for L alignment. */
const ICON_W = 32;
/** Corner radius for the L-connector bend. */
const L_CORNER_R = 6;
/** Gap between the horizontal line end and the item icon. */
const L_GAP = 6;
/** Ring radius for root / current-state connectors. */
const ROOT_RING_R = 6.5;
/** Stroke width. */
const BW = 1.5;

// ── Variant shell styles (mirrors Panel) ──────────────────────────────────────

const variantShellStyles: Record<PanelVariant, string> = {
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 text-neutral-900 dark:text-neutral-100",
  outlined:
    "bg-white/90 text-neutral-900 ring-1 dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/10",
  subtle:
    "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  tonal:
    "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  default:
    "bg-white/80 backdrop-blur-xl text-neutral-900 shadow-2xl ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  glass:
    "backdrop-blur-xl text-neutral-900 ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  "liquid-glass":
    "backdrop-blur-2xl ring-1 ring-transparent dark:ring-white/5",
  simple:
    "text-neutral-900 ring-transparent dark:text-neutral-100 dark:ring-white/5",
};

const cornerStyles: Record<PanelCorner, string> = {
  rounded: "rounded-sm",
  "rounded-sm": "rounded-lg",
  "rounded-md": "rounded-2xl",
  "rounded-lg": "rounded-3xl",
  "rounded-full": "rounded-full",
  pill: "rounded-3xl",
  none: "rounded-none",
};

function isHeaderActionObject(v: unknown): v is TimelinePanelHeaderAction {
  return (
    typeof v === "object" &&
    v !== null &&
    !isVNode(v) &&
    !Array.isArray(v) &&
    "label" in v
  );
}

// ── TimelineSvg geometry (computed in setup, rendered in the template) ────────
// Absolute overlay drawn on top of the item rows.
// Renders:
//  • vertical trunk connecting only depth-0 items (root → current)
//  • root: filled anchor circle on trunk
//  • current: hollow anchor circle on trunk
//  • depth > 0 items: L-shaped connector at depth * DEPTH_INDENT
//      vertical from prev item's midY → this item's midY
//      horizontal → item icon
//    consecutive same-depth items share the vertical (their segments join)

interface TrunkSegment {
  y1: number;
  y2: number;
  dashed: boolean;
}

type ConnectorDatum =
  | { kind: "root"; id: string; my: number; isCurrent: boolean; dashY2: number }
  | { kind: "current"; id: string; my: number; dashY2: number; lPath: string | null }
  | { kind: "branch"; id: string; lPath: string };
</script>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import Button from "../Button.vue";
import DropdownMenu from "../DropdownMenu.vue";
import type { DropdownMenuOption } from "../DropdownMenu.vue";
import Loader from "../Loader.vue";
import VNodeRenderer from "../internal/VNodeRenderer";
import { getPanelToneStyles } from "../../theme/Theme";
import { getTreeColorTokens } from "../TreeView/toneColors";
import { paddingStyles } from "../Panel.vue";
import type { PanelPadding } from "../Panel.vue";
import { useClassAttrs } from "../../utils/attrsUtils";
import type { TimelinePanelProps } from "./types";

defineOptions({ name: "TimelinePanel", inheritAttrs: false });

const props = withDefaults(defineProps<TimelinePanelProps>(), {
  variant: "simple",
  tone: "neutral",
  padding: "sm",
  corner: "none",
  loading: false,
  showTrunkDots: false,
});

const { classAttr, restAttrs } = useClassAttrs();

// ── useIsDark — detects Tailwind dark class on <html> ────────────────────────
const isDark = ref(false);
let darkObserver: MutationObserver | null = null;
let darkMedia: MediaQueryList | null = null;
const updateDark = () => {
  isDark.value = detectDark();
};

onMounted(() => {
  darkObserver = new MutationObserver(updateDark);
  darkObserver.observe(document.documentElement, {
    attributeFilter: ["class"],
  });
  darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
  darkMedia.addEventListener("change", updateDark);
  updateDark();
});
onUnmounted(() => {
  darkMedia?.removeEventListener("change", updateDark);
  darkObserver?.disconnect();
});

const palette = computed(() => getPanelToneStyles(props.tone));

// ── Height measurement for SVG ────────────────────────────────────────────
const itemEls = ref<(HTMLDivElement | null)[]>([]);
const itemHeights = ref<number[]>([]);
let resizeObserver: ResizeObserver | null = null;

const setItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  itemEls.value[index] = el as HTMLDivElement | null;
};

const measureHeights = () => {
  const heights = itemEls.value.map((el) => el?.offsetHeight ?? 0);
  const prev = itemHeights.value;
  if (
    !(prev.length === heights.length && prev.every((h, i) => h === heights[i]))
  ) {
    itemHeights.value = heights;
  }
};

const setupObserver = () => {
  // Trim stale refs when items shrink (e.g. after a delete) so heights array
  // stays in sync with items.length and the SVG guard doesn't suppress render.
  itemEls.value = itemEls.value.slice(0, props.items.length);
  measureHeights();
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(measureHeights);
  itemEls.value.forEach((el) => el && resizeObserver!.observe(el));
};

onMounted(setupObserver);
watch(() => props.items, setupObserver, { flush: "post" });
onUnmounted(() => resizeObserver?.disconnect());

// ── TimelineSvg data ──────────────────────────────────────────────────────
const colorTokens = computed(() => {
  const ci = isDark.value ? 1 : 0;
  const tok = getTreeColorTokens(props.tone);
  // Derived color shorthands — [light, dark] resolved to current mode
  return {
    trunkColor: tok.trunk[ci],
    branchColor: tok.trunk[ci],
    rootFill: tok.connDot[ci], // tone accent fill for root circle
    rootBorder: tok.trunk[ci], // matches line color
    rootDot: tok.connFill[ci], // inner dot contrasts against filled circle
    curFill: tok.connFill[ci], // very light tinted bg for current circle
    curBorder: tok.trunk[ci], // matches line color
  };
});

// Compute midY for each item. No stub — cumY starts at 0.
const midYs = computed<number[]>(() => {
  const result: number[] = [];
  let cumY = 0;
  for (let i = 0; i < props.items.length; i++) {
    const h = itemHeights.value[i] ?? 44;
    result.push(cumY + h / 2);
    cumY += h;
  }
  return result;
});

const totalSvgH = computed(() => {
  let cumY = 0;
  for (let i = 0; i < props.items.length; i++) {
    cumY += itemHeights.value[i] ?? 44;
  }
  return cumY;
});

// SVG overlay — drawn once heights are known
const svgVisible = computed(
  () =>
    itemHeights.value.length === props.items.length &&
    props.items.length > 0 &&
    totalSvgH.value !== 0 &&
    midYs.value.length > 0,
);

const currentIdx = computed(() =>
  props.items.findIndex((it) => it.isCurrent),
);

// Trunk anchors: depth-0 items PLUS any isRoot / isCurrent items at any depth.
// isCurrent always renders its circle on the trunk (TRUNK_X), so the trunk
// must extend down to it even when depth > 0.
// Trunk segments: one segment between each consecutive pair of depth-0 items,
// leaving a gap of (ROOT_RING_R + L_GAP) around each anchor circle.
// Segments up to/including current are solid; segments after current are dashed.
const trunkSegments = computed<TrunkSegment[]>(() => {
  const d0Indices = props.items
    .map((it, idx) =>
      (it.depth ?? 0) === 0 || it.isRoot || it.isCurrent ? idx : -1,
    )
    .filter((idx) => idx >= 0);
  const ANCHOR_GAP = ROOT_RING_R + L_GAP;
  return d0Indices.slice(0, -1).map((fromIdx, i) => {
    const toIdx = d0Indices[i + 1];
    const dashed = currentIdx.value >= 0 && fromIdx >= currentIdx.value;
    return {
      y1: midYs.value[fromIdx] + ANCHOR_GAP,
      y2: midYs.value[toIdx] - ANCHOR_GAP,
      dashed,
    };
  });
});

// ── Trunk dots — one per item on the solid segment ────────────────────────
const trunkDots = computed<{ id: string; my: number }[]>(() => {
  if (!props.showTrunkDots) return [];
  const result: { id: string; my: number }[] = [];
  midYs.value.forEach((my, i) => {
    const item = props.items[i];
    if (!item || item.isRoot || item.isCurrent) return;
    const onSolid = currentIdx.value < 0 || i < currentIdx.value;
    if (!onSolid) return;
    result.push({ id: item.id, my });
  });
  return result;
});

// ── Per-item connectors ────────────────────────────────────────────────────
const connectors = computed<ConnectorDatum[]>(() => {
  const items = props.items;
  const result: ConnectorDatum[] = [];
  midYs.value.forEach((my, i) => {
    const item = items[i];
    if (!item) return;

    if (item.isRoot) {
      // When the root is also the current snapshot, draw the dashed
      // extension downward — otherwise the isCurrent branch is never reached.
      const dashY2 =
        i < items.length - 1 ? totalSvgH.value : my + ROOT_RING_R + 20;
      result.push({
        kind: "root",
        id: item.id,
        my,
        isCurrent: Boolean(item.isCurrent),
        dashY2,
      });
      return;
    }

    if (item.isCurrent) {
      const hasItemsAfter = i < items.length - 1;
      const dashY2 = hasItemsAfter ? totalSvgH.value : my + ROOT_RING_R + 20;
      const curDepth = Math.min(item.depth ?? 0, 3);
      let lPath: string | null = null;
      if (curDepth > 0) {
        const lx = SVG_W + (curDepth - 1) * ITEM_DEPTH_PX + ICON_W / 2;
        let prevRefIdxC = i - 1;
        while (
          prevRefIdxC > 0 &&
          (items[prevRefIdxC]?.depth ?? 0) > curDepth
        )
          prevRefIdxC--;
        const prevDepth = items[prevRefIdxC]
          ? (items[prevRefIdxC].depth ?? 0)
          : 0;
        const topGap =
          prevDepth < curDepth ? ICON_W / 2 + L_GAP : -L_CORNER_R;
        const topY = (midYs.value[prevRefIdxC] ?? my) + topGap;
        const rightX = SVG_W + curDepth * ITEM_DEPTH_PX - L_GAP;
        const cornerY = Math.max(topY, my - L_CORNER_R);
        lPath = [
          `M ${lx} ${topY}`,
          `L ${lx} ${cornerY}`,
          `A ${L_CORNER_R} ${L_CORNER_R} 0 0 0 ${lx + L_CORNER_R} ${my}`,
          `L ${rightX} ${my}`,
        ].join(" ");
      }
      result.push({ kind: "current", id: item.id, my, dashY2, lPath });
      return;
    }

    // L-shaped connector aligned to the parent icon center.
    // Vertical: from previous item's midY → this item's midY at parent icon center X.
    // Rounded corner → horizontal to this item's icon left edge.
    const depth = Math.min(item.depth ?? 0, 3);
    if (depth === 0) return;

    // X = center of the parent icon (depth - 1 level)
    const lx = SVG_W + (depth - 1) * ITEM_DEPTH_PX + ICON_W / 2;
    // Walk back to find the last item whose depth <= current depth so the
    // vertical segment spans across any deeper children in between.
    let prevRefIdx = i - 1;
    while (prevRefIdx > 0 && (items[prevRefIdx]?.depth ?? 0) > depth)
      prevRefIdx--;
    const prevDepth = items[prevRefIdx]
      ? (items[prevRefIdx].depth ?? 0)
      : 0;
    const topGap = prevDepth < depth ? ICON_W / 2 + L_GAP : -L_CORNER_R;
    const topY = (midYs.value[prevRefIdx] ?? my) + topGap;
    const rightX = SVG_W + depth * ITEM_DEPTH_PX - L_GAP;
    const cornerY = Math.max(topY, my - L_CORNER_R);

    const lPath = [
      `M ${lx} ${topY}`,
      `L ${lx} ${cornerY}`,
      `A ${L_CORNER_R} ${L_CORNER_R} 0 0 0 ${lx + L_CORNER_R} ${my}`,
      `L ${rightX} ${my}`,
    ].join(" ");

    result.push({ kind: "branch", id: item.id, lPath });
  });
  return result;
});

// ── Variant shell ─────────────────────────────────────────────────────────
const variantClass = computed(() => {
  switch (props.variant) {
    case "outlined":
      return classNames(variantShellStyles.outlined, palette.value.border);
    case "subtle":
      return classNames(
        variantShellStyles.subtle,
        palette.value.border,
        palette.value.subtleBg,
      );
    case "tonal":
      return classNames(variantShellStyles.tonal, palette.value.tonalBg);
    case "glass":
      return classNames(
        variantShellStyles.glass,
        "border",
        palette.value.glassBorder,
        palette.value.glassBg,
      );
    case "simple":
      return classNames(variantShellStyles.simple);
    default:
      return variantShellStyles[props.variant] ?? variantShellStyles.elevated;
  }
});

const sectionClass = computed(() =>
  classNames(
    "relative flex w-full flex-col overflow-hidden",
    paddingStyles[props.padding as PanelPadding],
    variantClass.value,
    cornerStyles[props.corner],
    classAttr.value,
  ),
);

// ── Header action ─────────────────────────────────────────────────────────
const headerActionObject = computed<TimelinePanelHeaderAction | null>(() =>
  isHeaderActionObject(props.headerAction) ? props.headerAction : null,
);
const headerActionNode = computed<VNodeChild>(() =>
  headerActionObject.value ? null : (props.headerAction as VNodeChild),
);

// ── TimelineItemRow helpers ───────────────────────────────────────────────
const itemDepthPx = (item: TimelinePanelItem) =>
  Math.min(item.depth ?? 0, 3) * ITEM_DEPTH_PX;

const overflowOptionsFor = (item: TimelinePanelItem): DropdownMenuOption[] =>
  (item.overflowActions ?? []).map((a) => ({
    label: a.label,
    value: a.value,
    icon: a.icon,
    danger: a.danger,
    disabled: a.disabled,
  }));

const handleOverflowSelect = (
  item: TimelinePanelItem,
  option: DropdownMenuOption,
) => {
  item.overflowActions?.find((a) => a.value === option.value)?.onClick?.();
};

const iconColorClasses = (item: TimelinePanelItem) =>
  classNames(item.iconBackground ? `rounded-full bg-${props.tone}-100` : "");

const itemActionsArray = (
  item: TimelinePanelItem,
): TimelinePanelAction[] | null =>
  Array.isArray(item.actions) ? (item.actions as TimelinePanelAction[]) : null;

const itemActionsNode = (item: TimelinePanelItem): VNodeChild =>
  Array.isArray(item.actions) ? null : (item.actions as VNodeChild);

const hasActionsRow = (item: TimelinePanelItem) =>
  (item.actions !== undefined &&
    item.actions !== null &&
    (!Array.isArray(item.actions) || item.actions.length > 0)) ||
  overflowOptionsFor(item).length > 0;

// ── Overflow (⋮) button state — keyed by item id ──────────────────────────
const openOverflowId = ref<string | null>(null);
const overflowBtnEls = ref<Record<string, HTMLButtonElement | null>>({});
const setOverflowBtnRef = (
  el: Element | ComponentPublicInstance | null,
  id: string,
) => {
  overflowBtnEls.value[id] = el as HTMLButtonElement | null;
};
const toggleOverflow = (id: string) => {
  openOverflowId.value = openOverflowId.value === id ? null : id;
};
</script>

<template>
  <section :class="sectionClass" :aria-busy="loading" v-bind="restAttrs">
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div
      v-if="title || $slots.title || headerAction || $slots.headerAction"
      :class="classNames('flex items-center justify-between gap-4')"
    >
      <h3
        v-if="title || $slots.title"
        :class="classNames('text-lg font-semibold leading-2', palette.heading)"
      >
        <slot name="title"><VNodeRenderer :nodes="title" /></slot>
      </h3>
      <template v-if="headerAction || $slots.headerAction">
        <div v-if="$slots.headerAction" class="flex shrink-0 gap-2">
          <slot name="headerAction" />
        </div>
        <Button
          v-else-if="headerActionObject"
          :variant="headerActionObject.variant ?? 'solid'"
          :color="headerActionObject.color ?? tone"
          :size="headerActionObject.size ?? 'sm'"
          :disabled="headerActionObject.disabled"
          :loading="headerActionObject.loading"
          :leading-icon="headerActionObject.leadingIcon"
          weight="semibold"
          @click="headerActionObject.onClick?.()"
        >
          <VNodeRenderer :nodes="headerActionObject.label" />
        </Button>
        <div v-else class="flex shrink-0 gap-2">
          <VNodeRenderer :nodes="headerActionNode" />
        </div>
      </template>
    </div>

    <!-- ── Body ───────────────────────────────────────────────────────────── -->
    <div class="relative">
      <!-- No items yet — centred spinner -->
      <div
        v-if="loading && items.length === 0"
        class="flex items-center justify-center min-h-30 w-full h-full"
      >
        <Loader
          :spinner-thickness="loaderProps?.spinnerThickness"
          :color="tone"
          :glass="loaderProps?.glass"
          :glass-blur-intensity="loaderProps?.glassBlurIntensity"
          :label="loaderProps?.label"
          :size="loaderProps?.size"
          :spinner-variant="loaderProps?.spinnerVariant"
          :title="loaderProps?.title"
          :variant="loaderProps?.variant"
        />
      </div>
      <div
        v-else-if="items.length === 0 && (emptyState || $slots.emptyState)"
        class="py-4"
      >
        <slot name="emptyState"><VNodeRenderer :nodes="emptyState" /></slot>
      </div>
      <div v-else class="relative">
        <!-- SVG overlay — drawn once heights are known -->
        <svg
          v-if="svgVisible"
          :width="SVG_W"
          :height="totalSvgH"
          :viewBox="`0 0 ${SVG_W} ${totalSvgH}`"
          overflow="visible"
          aria-hidden="true"
          style="position: absolute; left: 0; top: 0; pointer-events: none"
        >
          <!-- ── Vertical trunk — depth-0 items only, gaps around anchors ────────── -->
          <line
            v-for="(seg, i) in trunkSegments"
            :key="i"
            :x1="TRUNK_X"
            :y1="seg.y1"
            :x2="TRUNK_X"
            :y2="seg.y2"
            :stroke="colorTokens.trunkColor"
            :stroke-width="2"
            stroke-linecap="round"
            :stroke-dasharray="seg.dashed ? '3 4' : undefined"
          />

          <!-- ── Trunk dots — one per item on the solid segment ──────────────────── -->
          <circle
            v-for="dot in trunkDots"
            :key="`td-${dot.id}`"
            :cx="TRUNK_X"
            :cy="dot.my"
            :r="3"
            :fill="colorTokens.trunkColor"
          />

          <!-- ── Per-item connectors ──────────────────────────────────────────────── -->
          <template v-for="c in connectors" :key="c.id">
            <g v-if="c.kind === 'root'">
              <circle
                :cx="TRUNK_X"
                :cy="c.my"
                :r="ROOT_RING_R"
                :fill="colorTokens.rootFill"
              />
              <circle
                :cx="TRUNK_X"
                :cy="c.my"
                :r="ROOT_RING_R"
                :stroke="colorTokens.rootBorder"
                :stroke-width="BW"
                fill="none"
              />
              <circle
                :cx="TRUNK_X"
                :cy="c.my"
                r="2.5"
                :fill="colorTokens.rootDot"
              />
              <line
                v-if="c.isCurrent"
                :x1="TRUNK_X"
                :y1="c.my + ROOT_RING_R + 4"
                :x2="TRUNK_X"
                :y2="c.dashY2"
                :stroke="colorTokens.trunkColor"
                :stroke-width="1.5"
                stroke-linecap="round"
                stroke-dasharray="2 3"
              />
            </g>
            <g v-else-if="c.kind === 'current'">
              <circle
                :cx="TRUNK_X"
                :cy="c.my"
                :r="ROOT_RING_R"
                :fill="colorTokens.curFill"
              />
              <circle
                :cx="TRUNK_X"
                :cy="c.my"
                :r="ROOT_RING_R"
                :stroke="colorTokens.curBorder"
                :stroke-width="BW"
                fill="none"
              />
              <path
                v-if="c.lPath"
                :d="c.lPath"
                :stroke="colorTokens.branchColor"
                :stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
              />
              <line
                :x1="TRUNK_X"
                :y1="c.my + ROOT_RING_R + 4"
                :x2="TRUNK_X"
                :y2="c.dashY2"
                :stroke="colorTokens.trunkColor"
                :stroke-width="1.5"
                stroke-linecap="round"
                stroke-dasharray="2 3"
              />
            </g>
            <g v-else>
              <path
                :d="c.lPath"
                :stroke="colorTokens.branchColor"
                :stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
              />
            </g>
          </template>
        </svg>

        <div :class="classNames(loading && 'pointer-events-none')">
          <!-- paddingLeft = SVG_W + depthPx so the whole row is column-shifted (total inside parent) -->
          <div
            v-for="(item, i) in items"
            :key="item.id"
            :ref="(el) => setItemRef(el, i)"
            class="flex items-center gap-2 py-2.5"
            :style="{ paddingLeft: `${SVG_W + itemDepthPx(item)}px` }"
          >
            <!-- Icon + text -->
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <!-- Icon slot -->
              <div
                v-if="item.icon"
                :class="
                  classNames(
                    'flex h-8 w-8 shrink-0 items-center justify-center text-blue-500 dark:bg-neutral-800 dark:text-neutral-400',
                    iconColorClasses(item),
                  )
                "
              >
                <VNodeRenderer :nodes="item.icon" />
              </div>

              <div class="min-w-0 flex-1">
                <div
                  class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"
                >
                  <VNodeRenderer :nodes="item.title" />
                </div>
                <div
                  v-if="item.subtitle"
                  class="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400"
                >
                  <VNodeRenderer :nodes="item.subtitle" />
                </div>
              </div>
            </div>

            <!-- Actions — always at far right, unaffected by depth -->
            <div
              v-if="hasActionsRow(item)"
              class="flex shrink-0 items-center gap-1.5"
            >
              <template v-if="itemActionsArray(item)">
                <Button
                  v-for="(action, idx) in itemActionsArray(item)"
                  :key="idx"
                  :variant="action.variant ?? 'outline'"
                  :color="action.color ?? tone"
                  :size="action.size ?? 'sm'"
                  :disabled="action.disabled"
                  :loading="action.loading"
                  @click="action.onClick?.()"
                >
                  <VNodeRenderer :nodes="action.label" />
                </Button>
              </template>
              <VNodeRenderer v-else :nodes="itemActionsNode(item)" />
              <template v-if="overflowOptionsFor(item).length > 0">
                <button
                  :ref="(el) => setOverflowBtnRef(el, item.id)"
                  type="button"
                  aria-label="More actions"
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  @click="toggleOverflow(item.id)"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="2.5" cy="8" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="13.5" cy="8" r="1.5" />
                  </svg>
                </button>
                <DropdownMenu
                  :anchor-ref="overflowBtnEls[item.id] ?? null"
                  :open="openOverflowId === item.id"
                  :items="overflowOptionsFor(item)"
                  align="end"
                  :width="180"
                  @close="openOverflowId = null"
                  @select="
                    (opt) => {
                      handleOverflowSelect(item, opt);
                      openOverflowId = null;
                    }
                  "
                />
              </template>
            </div>
          </div>
        </div>

        <!-- Glass overlay loader when refreshing over existing items -->
        <Loader
          v-if="loading"
          overlay
          glass
          :color="tone"
          :spinner-thickness="loaderProps?.spinnerThickness"
          :glass-blur-intensity="loaderProps?.glassBlurIntensity ?? 'low'"
          :label="loaderProps?.label"
          :size="loaderProps?.size"
          :spinner-variant="loaderProps?.spinnerVariant"
          :title="loaderProps?.title"
          :variant="loaderProps?.variant"
          class="absolute inset-0 rounded-[inherit]"
        />
      </div>
    </div>
  </section>
</template>

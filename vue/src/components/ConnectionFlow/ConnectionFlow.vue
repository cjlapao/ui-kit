<script lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import type { ConnectionFlowItem } from "./types";
import type { TreeTone } from "../TreeView/types";

// ── useIsDark (local copy — mirrors ConnectionFlowConnector's) ─────────────────

function detectDark(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("div");
  probe.className = "hidden dark:block";
  document.body.appendChild(probe);
  const dark = window.getComputedStyle(probe).display === "block";
  probe.remove();
  return dark;
}

function useIsDark(): Ref<boolean> {
  const isDark = ref<boolean>(detectDark());

  const update = () => {
    isDark.value = detectDark();
  };
  let obs: MutationObserver | null = null;
  let media: MediaQueryList | null = null;

  onMounted(() => {
    obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributeFilter: ["class"] });
    media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    update();
  });
  onUnmounted(() => {
    media?.removeEventListener("change", update);
    obs?.disconnect();
  });
  return isDark;
}

// ── Bypass path data ──────────────────────────────────────────────────────────
// The bypass travels from the top-right connection point of the source card
// to the top-left connection point of the destination card using an orthogonal
// stepped path with rounded corners, staying just above the card tops.

interface BypassArcData {
  /** top-right connection point of source card — inset from corner */
  sx: number;
  /** top edge of source card */
  sy: number;
  /** top-left connection point of destination card — inset from corner */
  dx: number;
  /** top edge of destination card */
  dy: number;
  sourceTone: TreeTone;
  destTone: TreeTone;
  /** True when at least one item in the destination group is currently active (running). */
  destActive: boolean;
}

/** How many px above the card tops the bypass path travels. */
const BYPASS_LIFT = 10;
/** Radius of the rounded corners on the bypass path. */
const BYPASS_CORNER_R = 6;
/** Inset from card corners for the top-edge connection points (matches card border-radius). */
const CARD_CORNER_INSET = 19;
/** How many px the ring base overlaps into the card so the card border is fully covered. */
const RING_OVERLAP = 1;

// ── Column group — single item or parallel cluster ────────────────────────────

type ColumnGroup =
  | { kind: "single"; item: ConnectionFlowItem }
  | { kind: "parallel"; items: ConnectionFlowItem[] };

function buildGroups(items: ConnectionFlowItem[]): ColumnGroup[] {
  const groups: ColumnGroup[] = [];
  let i = 0;
  while (i < items.length) {
    if (items[i].parallel) {
      const batch: ConnectionFlowItem[] = [];
      while (i < items.length && items[i].parallel) {
        batch.push(items[i]);
        i++;
      }
      groups.push({ kind: "parallel", items: batch });
    } else {
      groups.push({ kind: "single", item: items[i] });
      i++;
    }
  }
  return groups;
}

/** Returns a stable key for a group */
function groupKey(g: ColumnGroup): string {
  return g.kind === "single" ? g.item.id : g.items.map((it) => it.id).join("|");
}

/** True when a group does NOT emit a right-side connector */
function isTerminal(g: ColumnGroup): boolean {
  return g.kind === "single"
    ? (g.item.terminal ?? false)
    : (g.items[g.items.length - 1]?.terminal ?? false);
}

/** True when every item in the group is flagged as skipped */
function isGroupSkipped(g: ColumnGroup): boolean {
  return g.kind === "single"
    ? (g.item.skipped ?? false)
    : g.items.every((it) => it.skipped ?? false);
}

/** Returns the effective tone of the first item in a group (neutral when unset). */
function effectiveTone(g: ColumnGroup): TreeTone {
  return (g.kind === "single" ? g.item.tone : g.items[0]?.tone) ?? "neutral";
}
</script>

<script setup lang="ts">
import { computed, watch, type CSSProperties } from "vue";
import classNames from "classnames";
import ConnectionFlowConnector, {
  type ConnectionFlowConnectorProps,
} from "./ConnectionFlowConnector.vue";
import ConnectionFlowColumn, {
  type ColumnGeometry,
} from "./ConnectionFlowColumn.vue";
import ConnectionFlowParallelGroup from "./ConnectionFlowParallelGroup.vue";
import type { ConnectionFlowProps, ConnectionState } from "./types";
import { getTreeColorTokens } from "../TreeView/toneColors";
import VNodeRenderer from "../internal/VNodeRenderer";
import { useClassAttrs } from "../../utils/attrsUtils";

// ── ConnectionFlow ────────────────────────────────────────────────────────────

defineOptions({ name: "ConnectionFlow", inheritAttrs: false });

const props = withDefaults(defineProps<ConnectionFlowProps>(), {
  flowState: "flowing",
  connectorWidth: 56,
  animated: true,
  dotSpacing: 60,
  connectorBorderSize: "xs",
  connectorHalf: true,
  showLine: true,
  childIndent: "xs",
  childRowGap: 8,
  allowScroll: false,
  autoScale: false,
  minScale: 0.55,
  hoverable: false,
  autoConnectorState: false,
  animateCompleted: false,
  fullWidthConnectors: false,
});

const { classAttr, restAttrs } = useClassAttrs();
const isDark = useIsDark();

// Track geometry per column group
const colGeo = ref<Record<number, ColumnGeometry>>({});

const handleGeo = (idx: number, geo: ColumnGeometry) => {
  const cur = colGeo.value[idx];
  if (
    cur &&
    cur.totalHeight === geo.totalHeight &&
    cur.isParallelGroup === geo.isParallelGroup &&
    cur.anchors.length === geo.anchors.length &&
    cur.anchors.every((a, i) => a === geo.anchors[i])
  )
    return;
  colGeo.value = { ...colGeo.value, [idx]: geo };
};

// ── Auto-scale ────────────────────────────────────────────────────────────
const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const scale = ref(1);
const scaledHeight = ref<number | undefined>(undefined);

watch(
  [
    () => props.autoScale,
    () => props.minScale,
    () => props.items,
    containerRef,
    contentRef,
  ],
  (_values, _prev, onCleanup) => {
    if (!props.autoScale) {
      scale.value = 1;
      scaledHeight.value = undefined;
      return;
    }

    const container = containerRef.value;
    const content = contentRef.value;
    if (!container || !content) return;

    const measure = () => {
      // Temporarily reset transform so we read the natural (scale=1) dimensions
      content.style.transform = "";
      const containerW = container.offsetWidth;
      const naturalW = content.scrollWidth;
      const naturalH = content.scrollHeight;
      if (!containerW || !naturalW) return;

      const raw = containerW / naturalW;
      const s = Math.min(1, Math.max(props.minScale, raw));
      scale.value = s;
      scaledHeight.value = s < 1 ? Math.ceil(naturalH * s) : undefined;
      // Restore the transform immediately — the reactive style binding won't
      // re-patch when the computed scale value is unchanged.
      content.style.transform = s < 1 ? `scale(${s})` : "";
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    onCleanup(() => ro.disconnect());
  },
  { immediate: true, flush: "post" },
);

// ── Bypass arc state ──────────────────────────────────────────────────────
// One element per group (index = group index); tracks only the card div, not the connector.
const groupDivEls: (HTMLDivElement | null)[] = [];
const bypassArcs = ref<BypassArcData[]>([]);

const setGroupDivEl = (gi: number, el: HTMLDivElement | null) => {
  groupDivEls[gi] = el;
};

// ── Pre-process items into groups ─────────────────────────────────────────
const groups = computed(() => buildGroups(props.items));

// ── Auto-skipped set ──────────────────────────────────────────────────────
// When autoConnectorState is on, derive which groups are "skipped" from their
// tone alone (neutral tone with at least one non-neutral successor).
// The result is stable across renders where items haven't changed.
// Explicit skipped:false always takes precedence — an item that was executed
// but happens to have a neutral tone must not be auto-treated as bypassed.
const autoSkippedSet = computed(() => {
  const set = new Set<number>();
  if (!props.autoConnectorState) return set;
  const grps = buildGroups(props.items);
  grps.forEach((g, gi) => {
    if (effectiveTone(g) !== "neutral") return;
    // If any item in the group explicitly declares skipped:false it ran —
    // honour that and skip the auto-detection for this group.
    const explicitlyNotSkipped =
      g.kind === "single"
        ? g.item.skipped === false
        : g.items.some((it) => it.skipped === false);
    if (explicitlyNotSkipped) return;
    const hasNonNeutralAfter = grps
      .slice(gi + 1)
      .some((sg) => effectiveTone(sg) !== "neutral");
    if (hasNonNeutralAfter) set.add(gi);
  });
  return set;
});

// Compute bypass arc positions from DOM measurements.
const computeBypassArcs = () => {
  if (!contentRef.value) return;
  const contentEl = contentRef.value;
  const contentRect = contentEl.getBoundingClientRect();
  if (!contentRect.width) return;

  const grps = buildGroups(props.items);
  const arcs: BypassArcData[] = [];
  let skipStart = -1;

  for (let gi = 0; gi <= grps.length; gi++) {
    const skipped =
      gi < grps.length &&
      (isGroupSkipped(grps[gi]) || autoSkippedSet.value.has(gi));

    if (skipped && skipStart === -1) {
      skipStart = gi;
    } else if (!skipped && skipStart !== -1) {
      // Arc from group[skipStart-1] to group[gi]
      const prevEl = groupDivEls[skipStart - 1];
      const nextEl = groupDivEls[gi];

      if (prevEl && nextEl) {
        const prevRect = prevEl.getBoundingClientRect();
        const nextRect = nextEl.getBoundingClientRect();
        // Convert screen coords → content's natural (pre-scale) coordinate space.
        // Connection points are on the TOP edge of each card, inset from the corners
        // so they sit inside the rounded-corner border (not at the very tip).
        const sx =
          (prevRect.right - CARD_CORNER_INSET - contentRect.left) / scale.value;
        const sy = (prevRect.top - contentRect.top) / scale.value;
        const dx =
          (nextRect.left + CARD_CORNER_INSET - contentRect.left) / scale.value;
        const dy = (nextRect.top - contentRect.top) / scale.value;

        const prevGroup = grps[skipStart - 1];
        const srcTone: TreeTone = prevGroup
          ? ((prevGroup.kind === "single"
              ? prevGroup.item.tone
              : prevGroup.items[0]?.tone) ?? "neutral")
          : "neutral";
        const dstGroup = grps[gi];
        const dstTone: TreeTone = dstGroup
          ? ((dstGroup.kind === "single"
              ? dstGroup.item.tone
              : dstGroup.items[0]?.tone) ?? "neutral")
          : "neutral";
        const destActive = dstGroup
          ? dstGroup.kind === "single"
            ? (dstGroup.item.active ?? false)
            : dstGroup.items.some((it) => it.active ?? false)
          : false;

        arcs.push({
          sx,
          sy,
          dx,
          dy,
          sourceTone: srcTone,
          destTone: dstTone,
          destActive,
        });
      }
      skipStart = -1;
    }
  }

  bypassArcs.value = arcs;
};

watch(
  [() => props.items, scale, autoSkippedSet, contentRef],
  (_values, _prev, onCleanup) => {
    computeBypassArcs();
    const ro = new ResizeObserver(computeBypassArcs);
    if (contentRef.value) ro.observe(contentRef.value);
    onCleanup(() => ro.disconnect());
  },
  { immediate: true, flush: "post" },
);

// Which groups emit a right-side connector
const emitsConnector = computed(() =>
  groups.value.map((g, gi) => !isTerminal(g) && gi < groups.value.length - 1),
);

// When autoScale is active and scale < 1 the content must overflow the clipped
// outer div — we allow horizontal scroll only if scale is pinned at minScale.
const needsScroll = computed(
  () => props.autoScale && scale.value <= props.minScale,
);

const outerClass = computed(() =>
  classNames(
    props.autoScale ? "relative w-full" : "flex items-start",
    !props.autoScale && props.fullWidthConnectors && "w-full",
    !props.autoScale && props.allowScroll && "overflow-auto max-w-full",
    needsScroll.value && "overflow-x-auto",
    !props.autoScale &&
      !props.allowScroll &&
      !needsScroll.value &&
      "overflow-hidden",
    classAttr.value,
  ),
);

const outerStyle = computed<CSSProperties | undefined>(() =>
  props.autoScale && scaledHeight.value !== undefined
    ? { height: `${scaledHeight.value}px` }
    : undefined,
);

const contentStyle = computed<CSSProperties | undefined>(() =>
  props.autoScale && scale.value < 1
    ? { transform: `scale(${scale.value})`, transformOrigin: "left top" }
    : undefined,
);

const contentClass = computed(() =>
  classNames(
    "relative flex items-start",
    props.fullWidthConnectors && "w-full",
  ),
);

const groupWrapClass = computed(() =>
  props.itemWidth || props.fullWidthConnectors ? "shrink-0" : "flex-1 min-w-0",
);
const groupWrapStyle = computed<CSSProperties | undefined>(() =>
  props.itemWidth
    ? {
        width:
          typeof props.itemWidth === "number"
            ? `${props.itemWidth}px`
            : props.itemWidth,
      }
    : undefined,
);

// ── Per-group render data ─────────────────────────────────────────────────

interface GroupRenderData {
  key: string;
  renderConnector: boolean;
  connectorProps: ConnectionFlowConnectorProps;
  state: ConnectionState;
  singleItem: ConnectionFlowItem | null;
  parallelItems: ConnectionFlowItem[] | null;
}

const groupRenders = computed<GroupRenderData[]>(() => {
  const grps = groups.value;
  const geo = colGeo.value;

  return grps.map((group, gi) => {
    const prevGroup = grps[gi - 1];
    const isFirst = gi === 0;
    const renderConnector =
      !isFirst && (prevGroup ? emitsConnector.value[gi - 1] : false);

    // Resolve connector config — from the group's "first receiver" item
    const receiverItem = group.kind === "single" ? group.item : group.items[0];
    const connCfg = receiverItem.connector;

    // Connector state: explicit override → auto-derived (if autoConnectorState) → global flowState
    const state: ConnectionState =
      connCfg?.state ??
      (props.autoConnectorState && prevGroup
        ? effectiveTone(prevGroup) !== "neutral"
          ? "stopped"
          : "disabled"
        : props.flowState);
    const icon = connCfg?.icon ?? props.flowIcon;
    const cWidth = connCfg?.width ?? props.connectorWidth;
    const cAnimated = connCfg?.animated ?? props.animated;
    const cDotSpace = connCfg?.dotSpacing ?? props.dotSpacing;
    const cBorder = connCfg?.borderSize ?? props.connectorBorderSize;
    const cHalf = connCfg?.halfRing ?? props.connectorHalf;
    const cShowLine = connCfg?.showLine ?? props.showLine;

    // Suppress animateCompleted on connectors adjacent to skipped groups —
    // the bypass arc already carries the animated flow over those steps.
    const thisGroupSkipped =
      isGroupSkipped(group) || autoSkippedSet.value.has(gi);
    const prevGroupSkipped =
      gi > 0 &&
      (isGroupSkipped(grps[gi - 1]) || autoSkippedSet.value.has(gi - 1));
    const cAnimateCompleted =
      thisGroupSkipped || prevGroupSkipped
        ? false
        : (connCfg?.animateCompleted ?? props.animateCompleted);

    // Source tone (from the outgoing / previous group)
    const prevFirstItem = prevGroup
      ? prevGroup.kind === "single"
        ? prevGroup.item
        : prevGroup.items[0]
      : undefined;
    const srcTone: TreeTone =
      connCfg?.sourceTone ?? prevFirstItem?.tone ?? "neutral";

    // Target tone (from this group's first item)
    const dstTone: TreeTone =
      connCfg?.targetTone ?? receiverItem.tone ?? "neutral";

    const prevGeo = geo[gi - 1];
    const curGeo = geo[gi];

    // Left anchors — all prev anchors (handles both single and parallel source)
    const leftAnchors = prevGeo?.anchors;

    // Right anchors — for fan-out into a parallel group
    const rightAnchors =
      curGeo?.isParallelGroup && curGeo.anchors.length > 1
        ? curGeo.anchors
        : undefined;

    // Right anchor Y for single target (not fan-out)
    const rightAnchorY = rightAnchors ? undefined : curGeo?.anchors[0];

    // Connector height: span the taller of the two adjacent groups
    const connectorHeight =
      prevGeo && curGeo
        ? Math.max(prevGeo.totalHeight, curGeo.totalHeight)
        : (prevGeo?.totalHeight ?? curGeo?.totalHeight);

    // Extra source tones for multi-source rings (fan-in from prev parallel group, or children)
    const extraSourceTones: TreeTone[] =
      prevGroup?.kind === "parallel"
        ? prevGroup.items.slice(1).map((it) => it.tone ?? "neutral")
        : prevGroup?.kind === "single"
          ? (prevGroup.item.children?.map(
              (c) => c.connector?.sourceTone ?? c.tone ?? "neutral",
            ) ?? [])
          : [];

    // Right anchor tones for fan-out rings
    const rightAnchorTones: TreeTone[] =
      rightAnchors && group.kind === "parallel"
        ? group.items.map((it) => it.tone ?? "neutral")
        : [];

    // Right anchor states for per-lane animation in fan-out
    const rightAnchorStates: ConnectionState[] =
      rightAnchors && group.kind === "parallel"
        ? group.items.map((it): ConnectionState => {
            if (it.connector?.state !== undefined) return it.connector.state;
            if (props.autoConnectorState) {
              if (it.active) return "flowing";
              const tone = it.tone ?? "neutral";
              return tone !== "neutral" ? "stopped" : "disabled";
            }
            return state;
          })
        : [];

    const connectorProps: ConnectionFlowConnectorProps = {
      state,
      sourceTone: srcTone,
      targetTone: dstTone,
      middleIcon: icon,
      width: cWidth,
      halfRing: cHalf,
      showLine: cShowLine,
      animated: cAnimated,
      dotSpacing: cDotSpace,
      borderSize: cBorder,
      sourceFill: connCfg?.sourceFill,
      sourceBorder: connCfg?.sourceBorder,
      sourceDot: connCfg?.sourceDot,
      targetFill: connCfg?.targetFill,
      targetBorder: connCfg?.targetBorder,
      targetDot: connCfg?.targetDot,
      dotColor: connCfg?.dotColor,
      leftAnchors,
      connectorHeight,
      rightAnchorY,
      extraSourceTones,
      rightAnchors,
      rightAnchorTones,
      rightAnchorStates,
      animateCompleted: cAnimateCompleted,
      fullWidth: props.fullWidthConnectors,
    };

    return {
      key: groupKey(group),
      renderConnector,
      connectorProps,
      state,
      singleItem: group.kind === "single" ? group.item : null,
      parallelItems: group.kind === "parallel" ? group.items : null,
    };
  });
});

// ── Bypass arc render data ────────────────────────────────────────────────

interface BypassArcDot {
  key: string;
  fill: string;
  path: string;
  dur: string;
  begin: string;
  opTimes: string;
}

interface BypassArcRender {
  key: number;
  d: string;
  lineColor: string;
  srcArcD: string;
  srcFill: string;
  srcBorder: string;
  srcDot: string;
  sx: number;
  sBase: number;
  dstArcD: string;
  dstFill: string;
  dstBorder: string;
  dstDot: string;
  dx: number;
  dBase: number;
  dots: BypassArcDot[];
}

// Ring visual constants (match ConnectionFlowConnector)
const BYPASS_RING_R = 5.5;
const BYPASS_RING_BW = 1.5;

const bypassArcRenders = computed<BypassArcRender[]>(() =>
  bypassArcs.value.map((arc, i) => {
    const ci = isDark.value ? 1 : 0;
    const srcTokens = getTreeColorTokens(arc.sourceTone);
    const dstTokens = getTreeColorTokens(arc.destTone);
    const lineColor = srcTokens.connBorder[ci];
    const dotFill = srcTokens.connDot[ci];

    // Path starts/ends RING_OVERLAP px inside the card top edge so the
    // ring fill covers the card border (same technique as left/right rings).
    const sBase = arc.sy + RING_OVERLAP;
    const dBase = arc.dy + RING_OVERLAP;

    // Orthogonal stepped path with rounded corners:
    //  (sx, sBase) → up → rounded bend → right → rounded bend → down to (dx, dBase)
    const aboveY = Math.min(arc.sy, arc.dy) - BYPASS_LIFT;
    const CR = BYPASS_CORNER_R;
    const d = [
      `M ${arc.sx} ${sBase}`,
      `V ${aboveY + CR}`,
      `Q ${arc.sx} ${aboveY} ${arc.sx + CR} ${aboveY}`,
      `H ${arc.dx - CR}`,
      `Q ${arc.dx} ${aboveY} ${arc.dx} ${aboveY + CR}`,
      `V ${dBase}`,
    ].join(" ");

    // Approximate path length for dot timing
    const legV1 = Math.abs(sBase - aboveY - CR);
    const legH = Math.max(0, arc.dx - arc.sx - 2 * CR);
    const legV2 = Math.abs(dBase - aboveY - CR);
    const corners = Math.PI * 0.5 * CR * 2; // two quarter-circle corners
    const pathLen = legV1 + legH + legV2 + corners;

    const DOT_VELOCITY = 35;
    const DOT_GAP = props.dotSpacing / DOT_VELOCITY;
    const numDots = Math.max(1, Math.ceil(pathLen / props.dotSpacing));
    const virtualLen = numDots * props.dotSpacing;
    const dur = numDots * DOT_GAP;

    // Add overflow extension AFTER the destination so dots follow the correct
    // arc shape (including the destination corner and descent) before the
    // invisible loop-back segment begins. Extending the H segment rightward
    // (old approach) caused dots to travel past the destination horizontally
    // and miss the descent curve entirely.
    const overflow = Math.max(0, virtualLen - pathLen);
    const dMotion =
      overflow > 0
        ? [
            `M ${arc.sx} ${sBase}`,
            `V ${aboveY + CR}`,
            `Q ${arc.sx} ${aboveY} ${arc.sx + CR} ${aboveY}`,
            `H ${arc.dx - CR}`,
            `Q ${arc.dx} ${aboveY} ${arc.dx} ${aboveY + CR}`,
            `V ${dBase}`,
            `v ${overflow}`,
          ].join(" ")
        : d;

    const fadeOutEnd = pathLen / virtualLen;
    const fadeOutStart = Math.max(0, fadeOutEnd - 10 / virtualLen);
    const fadeInEnd = Math.min(fadeOutStart, 4 / virtualLen);
    const opTimes = `0;${fadeInEnd.toFixed(4)};${fadeOutStart.toFixed(4)};${fadeOutEnd.toFixed(4)};1`;

    const ringR = BYPASS_RING_R;

    // Source ring — half-circle bumping upward, base sits RING_OVERLAP px
    // inside the card so the fill covers the card's top border.
    const srcFill = srcTokens.connFill[ci];
    const srcBorder = srcTokens.connBorder[ci];
    const srcDot = srcTokens.connDot[ci];
    const srcArcD = `M ${arc.sx - ringR} ${sBase} A ${ringR} ${ringR} 0 0 1 ${arc.sx + ringR} ${sBase}`;

    // Destination ring — same treatment.
    const dstFill = dstTokens.connFill[ci];
    const dstBorder = dstTokens.connBorder[ci];
    const dstDot = dstTokens.connDot[ci];
    const dstArcD = `M ${arc.dx - ringR} ${dBase} A ${ringR} ${ringR} 0 0 1 ${arc.dx + ringR} ${dBase}`;

    // Animated dots — only when bypass is actively being traversed
    // (source done, destination not yet reached), or when
    // animateCompleted is on (completed arcs also animate).
    // Animate when source is done AND destination is either
    // not yet reached (neutral) or currently running (destActive).
    const arcActive =
      arc.sourceTone !== "neutral" &&
      (arc.destTone === "neutral" || arc.destActive);
    const arcCompleted =
      arc.sourceTone !== "neutral" &&
      arc.destTone !== "neutral" &&
      !arc.destActive;
    const showDots =
      props.animated && (arcActive || (props.animateCompleted && arcCompleted));

    const dots: BypassArcDot[] = showDots
      ? Array.from({ length: numDots }, (_, di) => ({
          key: `${i}-${di}`,
          fill: dotFill,
          path: dMotion,
          dur: `${dur}s`,
          begin: `${(-di * DOT_GAP).toFixed(3)}s`,
          opTimes,
        }))
      : [];

    return {
      key: i,
      d,
      lineColor,
      srcArcD,
      srcFill,
      srcBorder,
      srcDot,
      sx: arc.sx,
      sBase,
      dstArcD,
      dstFill,
      dstBorder,
      dstDot,
      dx: arc.dx,
      dBase,
      dots,
    };
  }),
);
</script>

<template>
  <div
    v-if="groups.length > 0"
    ref="containerRef"
    :class="outerClass"
    :style="outerStyle"
    v-bind="restAttrs"
  >
    <div ref="contentRef" :class="contentClass" :style="contentStyle">
      <template v-for="(gr, gi) in groupRenders" :key="gr.key">
        <!-- Connector leading INTO this group -->
        <ConnectionFlowConnector
          v-if="gr.renderConnector"
          v-bind="gr.connectorProps"
        />

        <!-- Column or parallel group — wrapped in a ref div for bypass arc measurement -->
        <div
          :ref="(el: unknown) => setGroupDivEl(gi, el as HTMLDivElement | null)"
          :class="groupWrapClass"
          :style="groupWrapStyle"
        >
          <ConnectionFlowColumn
            v-if="gr.singleItem"
            :item="gr.singleItem"
            :child-indent="childIndent"
            :child-row-gap="childRowGap"
            :animated="animated"
            :show-line="showLine"
            :connector-half="connectorHalf"
            :connector-border-size="connectorBorderSize"
            :dot-spacing="dotSpacing"
            :flow-active="gr.state === 'flowing'"
            :item-width="itemWidth"
            :hoverable="hoverable"
            @geometry-change="(geo: ColumnGeometry) => handleGeo(gi, geo)"
          />
          <ConnectionFlowParallelGroup
            v-else-if="gr.parallelItems"
            :items="gr.parallelItems"
            :item-width="itemWidth"
            :hoverable="hoverable"
            @geometry-change="(geo: ColumnGeometry) => handleGeo(gi, geo)"
          />
        </div>
      </template>

      <div
        v-if="rightAction || $slots.rightAction"
        class="flex items-center shrink-0 ml-3 self-start"
      >
        <slot name="rightAction"><VNodeRenderer :nodes="rightAction" /></slot>
      </div>

      <!-- ── Bypass arc overlay ────────────────────────────────────────── -->
      <svg
        v-if="bypassArcRenders.length > 0"
        class="absolute inset-0 pointer-events-none z-20"
        :style="{ width: '100%', height: '100%', overflow: 'visible' }"
      >
        <g v-for="arc in bypassArcRenders" :key="arc.key">
          <!-- Bypass path -->
          <path
            :d="arc.d"
            fill="none"
            :stroke="arc.lineColor"
            :stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Source ring endpoint -->
          <path :d="arc.srcArcD" :fill="arc.srcFill" />
          <path
            :d="arc.srcArcD"
            :stroke="arc.srcBorder"
            :stroke-width="BYPASS_RING_BW"
            fill="none"
            stroke-linecap="round"
          />
          <circle :cx="arc.sx" :cy="arc.sBase" r="2" :fill="arc.srcDot" />

          <!-- Destination ring endpoint -->
          <path :d="arc.dstArcD" :fill="arc.dstFill" />
          <path
            :d="arc.dstArcD"
            :stroke="arc.dstBorder"
            :stroke-width="BYPASS_RING_BW"
            fill="none"
            stroke-linecap="round"
          />
          <circle :cx="arc.dx" :cy="arc.dBase" r="2" :fill="arc.dstDot" />

          <!-- Animated dots — only when bypass is actively being traversed
                              (source done, destination not yet reached), or when
                              animateCompleted is on (completed arcs also animate). -->
          <circle
            v-for="dot in arc.dots"
            :key="dot.key"
            r="3"
            :fill="dot.fill"
            opacity="0"
          >
            <animateMotion
              :path="dot.path"
              :dur="dot.dur"
              :begin="dot.begin"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0;0"
              :keyTimes="dot.opTimes"
              :dur="dot.dur"
              :begin="dot.begin"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  </div>
</template>

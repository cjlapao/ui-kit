<script lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";

// ── useIsDark — detects Tailwind dark class strategy on <html> ────────────────

function detectDark(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("div");
  probe.className = "hidden dark:block";
  document.body.appendChild(probe);
  const darkActive = window.getComputedStyle(probe).display === "block";
  probe.remove();
  return darkActive;
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

// ── Constants ────────────────────────────────────────────────────────────────

export const INDENT_PX: Record<"xs" | "sm" | "md" | "lg", number> = {
  xs: 24,
  sm: 36,
  md: 52,
  lg: 72,
};

const CONNECTOR_BORDER_WIDTH: Record<
  "fit" | "xs" | "sm" | "md" | "lg",
  number
> = {
  fit: 1,
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { getTreeColorTokens, NEUTRAL_TOKENS } from "./toneColors";
import type { TreeFlowSvgProps } from "./types";
import { useClassAttrs } from "../../utils/attrsUtils";

// ── TreeFlowSvg ──────────────────────────────────────────────────────────────
//
// Single SVG spanning all items at one tree level.
// Position: absolute, left:0, top:-stubHeight — extends above the items container
// to visually connect from the root/parent card down through the stub gap.
//
// Layout contract (enforced by parent container):
//   position:relative, paddingLeft:indentPx
//   This SVG: position:absolute, left:0, top:-stubHeight
//   Route rows: normal flow at x=indentPx
//   rendered LAST so it paints on top of card borders without z-index

defineOptions({ name: "TreeFlowSvg", inheritAttrs: false });

const props = withDefaults(defineProps<TreeFlowSvgProps>(), {
  mode: "tree",
  parentAnchorY: 0,
  parentOffset: 0,
  depth: 0,
  rootChildIndentExtra: 0,
  rootActive: false,
  stubHeight: 12,
  indent: "xs",
  showLine: true,
  showConnectors: true,
  connectorStyle: "rings",
  branchColorMode: "item",
  junctionStyle: "rounded",
  showCenterDot: true,
  connectorHalf: false,
  connectorBorderSize: "xs",
  dotSpacing: 50,
  animated: true,
});

const { classAttr, restAttrs } = useClassAttrs();

const isDark = useIsDark();
const indentPx = computed(() => INDENT_PX[props.indent]);
const branchDepthExtra = computed(() =>
  props.depth === 1 ? props.rootChildIndentExtra : 0,
);
const branchEndX = computed(() =>
  props.connectorStyle === "dots"
    ? indentPx.value + 2 + branchDepthExtra.value
    : indentPx.value + branchDepthExtra.value,
);

// ── Compute midYs (connector Y positions) ─────────────────────────────────
const geometry = computed(() => {
  const midYs: number[] = [];
  let cumY = props.stubHeight;
  for (let i = 0; i < props.cardHeights.length; i++) {
    const h = props.cardHeights[i] ?? 0;
    const anchor =
      (props.cardAnchors?.[i] ?? 0) > 0 ? props.cardAnchors![i] : h / 2;
    midYs.push(cumY + anchor);
    cumY += h + props.rowGap;
  }
  return { midYs, totalHeight: cumY };
});
const midYs = computed(() => geometry.value.midYs);
const totalHeight = computed(() => geometry.value.totalHeight);
const lastMidY = computed(() => midYs.value[midYs.value.length - 1] ?? 0);

const isBracket = computed(() => props.mode === "bracket");
const hasParentStub = computed(() => !isBracket.value && props.stubHeight > 0);
const normalizedParentOffset = computed(() => Math.max(0, props.parentOffset));
const rootInset = computed(() => (hasParentStub.value ? -2.8 : 0));
const branchCorner = 3;
const rootConnectorY = computed(() =>
  isBracket.value
    ? props.parentAnchorY
    : hasParentStub.value
      ? Math.max(
          -6,
          props.stubHeight - normalizedParentOffset.value + rootInset.value,
        )
      : 0,
);
const trunkTop = computed(() =>
  isBracket.value ? props.parentAnchorY : rootConnectorY.value,
);

const visible = computed(
  () =>
    !(
      lastMidY.value <= props.stubHeight ||
      totalHeight.value <= props.stubHeight
    ),
);

// ── Color helpers ─────────────────────────────────────────────────────────

const ci = computed(() => (isDark.value ? 1 : 0));

const rootTokens = computed(() => getTreeColorTokens(props.rootTone));
const trunkColor = computed(() =>
  props.rootActive
    ? rootTokens.value.connBorder[ci.value]
    : NEUTRAL_TOKENS.connBorder[ci.value],
);

const branchLineColor = (i: number): string => {
  if (!props.activeList[i]) return NEUTRAL_TOKENS.connBorder[ci.value];
  return (getTreeColorTokens(props.toneList[i]) ?? rootTokens.value)
    .connBorder[ci.value];
};
const branchUsesParentTone = computed(
  () => props.branchColorMode === "parent" && hasParentStub.value,
);
const resolvedTrunkColor = computed(() => trunkColor.value);
const resolvedBranchLineColor = (i: number): string =>
  branchUsesParentTone.value ? trunkColor.value : branchLineColor(i);

const cFill = (i: number): string =>
  (getTreeColorTokens(props.toneList[i]) ?? rootTokens.value).connFill[
    ci.value
  ];
const cBorder = (i: number): string =>
  (getTreeColorTokens(props.toneList[i]) ?? rootTokens.value).connBorder[
    ci.value
  ];
const cDot = (i: number): string =>
  (getTreeColorTokens(props.toneList[i]) ?? rootTokens.value).connDot[ci.value];

const rootFill = computed(() => rootTokens.value.connFill[ci.value]);
const rootBorder = computed(() => rootTokens.value.connBorder[ci.value]);
const rootDot = computed(() => rootTokens.value.connDot[ci.value]);

// ── Ring arc paths ─────────────────────────────────────────────────────────
const ringR = 5.5;
const bw = computed(() => CONNECTOR_BORDER_WIDTH[props.connectorBorderSize]);

// Entry ring → LEFT semicircle (top→bottom, sweep=0 CCW) — sits in gutter
const entryArc = (cx: number, cy: number) =>
  `M ${cx} ${cy - ringR} A ${ringR} ${ringR} 0 0 0 ${cx} ${cy + ringR}`;
// Root ring → BOTTOM semicircle (left→right, sweep=0) — sits below root card
const rootArc = (cx: number) =>
  `M ${cx - ringR} 0 A ${ringR} ${ringR} 0 0 0 ${cx + ringR} 0`;

// ── Dot animation ─────────────────────────────────────────────────────────
const isFlowing = computed(
  () => props.animated && (props.rootActive || props.activeList.some(Boolean)),
);
const dotColor = computed(() => (isDark.value ? "#d4d4d4" : "#737373")); // neutral-300 / neutral-500 as fallback
// Use root token dot color when flowing
const animDotColor = computed(() =>
  isFlowing.value ? rootTokens.value.connDot[ci.value] : dotColor.value,
);

const DOT_VELOCITY = 35;
const actualTrunkLen = computed(() =>
  isBracket.value
    ? indentPx.value - 12 + lastMidY.value - props.parentAnchorY
    : Math.max(0, lastMidY.value - trunkTop.value),
);
const numDots = computed(() =>
  Math.max(1, Math.ceil(actualTrunkLen.value / props.dotSpacing)),
);
const virtualTrunkLen = computed(() => numDots.value * props.dotSpacing);
const DOT_GAP = computed(() => props.dotSpacing / DOT_VELOCITY);
const DUR = computed(() => numDots.value * DOT_GAP.value);
const overflow = computed(() =>
  Math.max(0, virtualTrunkLen.value - actualTrunkLen.value),
);

const actualBranchLen = computed(() => Math.max(0, branchEndX.value - 12));
const branchFrac = computed(() => actualBranchLen.value / virtualTrunkLen.value);

interface TrunkDot {
  key: string;
  path: string;
  motionProps: Record<string, string>;
  opTimes: string;
  dur: string;
  begin: string;
}

// Trunk dots
const trunkDots = computed<TrunkDot[]>(() => {
  if (!isFlowing.value) return [];
  const isB = isBracket.value;
  const trPath = isB
    ? `M ${indentPx.value} ${props.parentAnchorY} L 12 ${props.parentAnchorY} L 12 ${lastMidY.value + overflow.value}`
    : `M 12 ${trunkTop.value} L 12 ${lastMidY.value + overflow.value}`;

  // Fix WebKit animateMotion pacing bugs by manually specifying linear distances
  const l1 = isB
    ? indentPx.value - 12
    : lastMidY.value + overflow.value - trunkTop.value;
  const l2 = isB
    ? lastMidY.value - props.parentAnchorY + overflow.value
    : 0;
  const total = l1 + l2;
  const p1 = total > 0 ? (l1 / total).toFixed(4) : "1";
  const motionProps: Record<string, string> = isB
    ? {
        calcMode: "linear",
        keyPoints: `0;${p1};1`,
        keyTimes: `0;${p1};1`,
      }
    : {};

  const fadeOutEnd = actualTrunkLen.value / virtualTrunkLen.value;
  const fadeOutStart = Math.max(0, fadeOutEnd - 10 / virtualTrunkLen.value);
  const fadeInEnd = Math.min(fadeOutStart, 4 / virtualTrunkLen.value);
  const opTimes = `0;${fadeInEnd.toFixed(4)};${fadeOutStart.toFixed(4)};${fadeOutEnd.toFixed(4)};1`;

  return Array.from({ length: numDots.value }, (_, i) => ({
    key: `trunk-${i}`,
    path: trPath,
    motionProps,
    opTimes,
    dur: `${DUR.value}s`,
    begin: `${(-i * DOT_GAP.value).toFixed(3)}s`,
  }));
});

interface BranchDot {
  key: string;
  my: number;
  begin: string;
  keyTimes: string;
  opKT: string;
}

// Branch dots — one set per active item
const branchDots = computed<BranchDot[]>(() => {
  if (!isFlowing.value) return [];
  const out: BranchDot[] = [];
  midYs.value.forEach((my, ri) => {
    if (!props.activeList[ri]) return;
    const pathToMy = isBracket.value
      ? indentPx.value - 12 + my - props.parentAnchorY
      : Math.max(0, my - trunkTop.value);
    const branchBeginBase = (pathToMy / virtualTrunkLen.value) * DUR.value;
    const bf = branchFrac.value;

    // Fixed-distance opacity fading ensures dots don't vanish prematurely on short branches
    const bFadeIn = Math.min(bf, 4 / virtualTrunkLen.value);
    const bFadeOutStart = Math.max(bFadeIn, bf - 10 / virtualTrunkLen.value);
    const bOpKT = `0;${bFadeIn.toFixed(4)};${bFadeOutStart.toFixed(4)};${bf.toFixed(4)};1`;

    for (let di = 0; di < numDots.value; di++) {
      out.push({
        key: `branch-${ri}-${di}`,
        my,
        begin: `${(branchBeginBase - di * DOT_GAP.value).toFixed(3)}s`,
        keyTimes: `0;${bf.toFixed(4)};1`,
        opKT: bOpKT,
      });
    }
  });
  return out;
});

const svgStyle = computed(() => ({
  position: "absolute" as const,
  left: "0",
  top: `${-props.stubHeight}px`,
  pointerEvents: "none" as const,
}));
</script>

<template>
  <svg
    v-if="visible"
    :width="indentPx"
    :height="totalHeight"
    :viewBox="`0 0 ${indentPx} ${totalHeight}`"
    overflow="visible"
    :class="classAttr"
    :style="svgStyle"
    v-bind="restAttrs"
  >
    <!-- Vertical trunk -->
    <path
      v-if="showLine"
      :d="`M 12 ${trunkTop} L 12 ${lastMidY}`"
      :stroke="resolvedTrunkColor"
      :stroke-width="connectorStyle === 'dots' ? 2.25 : 2.1"
      :stroke-linecap="junctionStyle === 'rounded' ? 'butt' : 'round'"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Parent line for bracket mode (horizontal from parent to trunk) -->
    <path
      v-if="showLine && isBracket"
      :d="`M ${indentPx} ${parentAnchorY} L 12 ${parentAnchorY}`"
      :stroke="resolvedTrunkColor"
      :stroke-width="2"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Per-item horizontal branches -->
    <template v-if="showLine">
      <path
        v-for="(my, i) in midYs"
        :key="`branch-${i}`"
        :d="
          junctionStyle === 'rounded'
            ? `M 12 ${my - branchCorner} L 12 ${my} L ${branchEndX} ${my}`
            : `M 12 ${my} L ${branchEndX} ${my}`
        "
        :stroke="resolvedBranchLineColor(i)"
        :stroke-width="connectorStyle === 'dots' ? 2.75 : 2.1"
        :stroke-linecap="junctionStyle === 'rounded' ? 'butt' : 'round'"
        stroke-linejoin="round"
        fill="none"
      />
    </template>

    <!-- Connector decorators — rendered after lines so they sit on top -->
    <template v-if="showConnectors && connectorStyle === 'rings'">
      <!-- Root connector -->
      <g v-if="isBracket">
        <template v-if="junctionStyle === 'dot'">
          <circle cx="12" :cy="parentAnchorY" r="4.5" :fill="rootFill" />
          <circle
            cx="12"
            :cy="parentAnchorY"
            r="4.5"
            :stroke="rootBorder"
            :stroke-width="bw"
            fill="none"
          />
          <circle
            v-if="showCenterDot"
            cx="12"
            :cy="parentAnchorY"
            r="2"
            :fill="rootDot"
          />
        </template>
        <circle :cx="indentPx" :cy="parentAnchorY" :r="ringR" :fill="rootFill" />
        <path
          v-if="connectorHalf"
          :d="entryArc(indentPx, parentAnchorY)"
          :stroke="rootBorder"
          :stroke-width="bw"
          fill="none"
          stroke-linecap="round"
        />
        <circle
          v-else
          :cx="indentPx"
          :cy="parentAnchorY"
          :r="ringR"
          :stroke="rootBorder"
          :stroke-width="bw"
          fill="none"
        />
        <circle
          v-if="showCenterDot"
          :cx="indentPx"
          :cy="parentAnchorY"
          r="2"
          :fill="rootDot"
        />
      </g>
      <g v-else-if="hasParentStub">
        <!-- Junction marker entering the child level (half ring by default). -->
        <template v-if="connectorHalf">
          <path
            :d="rootArc(12)"
            :fill="rootFill"
            :transform="`translate(0, ${rootConnectorY})`"
          />
          <path
            :d="rootArc(12)"
            :stroke="rootBorder"
            :stroke-width="bw"
            fill="none"
            stroke-linecap="round"
            :transform="`translate(0, ${rootConnectorY})`"
          />
        </template>
        <template v-else>
          <circle cx="12" :cy="rootConnectorY" :r="ringR" :fill="rootFill" />
          <circle
            cx="12"
            :cy="rootConnectorY"
            :r="ringR"
            :stroke="rootBorder"
            :stroke-width="bw"
            fill="none"
          />
        </template>
        <circle
          v-if="showCenterDot"
          cx="12"
          :cy="rootConnectorY"
          r="2"
          :fill="rootDot"
        />
      </g>
      <template v-else>
        <circle cx="12" :cy="rootConnectorY" :r="ringR" :fill="rootFill" />
        <path
          v-if="connectorHalf"
          :d="rootArc(12)"
          :stroke="rootBorder"
          :stroke-width="bw"
          fill="none"
          stroke-linecap="round"
          :transform="`translate(0, ${rootConnectorY})`"
        />
        <circle
          v-else
          cx="12"
          :cy="rootConnectorY"
          :r="ringR"
          :stroke="rootBorder"
          :stroke-width="bw"
          fill="none"
        />
        <circle
          v-if="showCenterDot"
          cx="12"
          :cy="rootConnectorY"
          r="2"
          :fill="rootDot"
        />
      </template>

      <!-- Per-item: junction dot on trunk + entry ring on card edge -->
      <g v-for="(my, i) in midYs" :key="`conn-${i}`">
        <template v-if="junctionStyle === 'dot'">
          <circle cx="12" :cy="my" r="4.5" :fill="cFill(i)" />
          <circle
            cx="12"
            :cy="my"
            r="4.5"
            :stroke="resolvedBranchLineColor(i)"
            :stroke-width="bw"
            fill="none"
          />
          <circle v-if="showCenterDot" cx="12" :cy="my" r="2" :fill="cDot(i)" />
        </template>
        <circle :cx="branchEndX" :cy="my" :r="ringR" :fill="cFill(i)" />
        <path
          v-if="connectorHalf"
          :d="entryArc(branchEndX, my)"
          :stroke="cBorder(i)"
          :stroke-width="bw"
          fill="none"
          stroke-linecap="round"
        />
        <circle
          v-else
          :cx="branchEndX"
          :cy="my"
          :r="ringR"
          :stroke="cBorder(i)"
          :stroke-width="bw"
          fill="none"
        />
        <circle
          v-if="showCenterDot"
          :cx="branchEndX"
          :cy="my"
          r="2"
          :fill="cDot(i)"
        />
      </g>
    </template>

    <!-- Lightweight connector dots (for cleaner tree style) -->
    <template v-if="showConnectors && connectorStyle === 'dots'">
      <circle cx="12" :cy="rootConnectorY" r="4.5" :fill="resolvedTrunkColor" />
      <g v-for="(my, i) in midYs" :key="`dot-conn-${i}`">
        <path
          :d="`M 12 ${my - 6} L 12 ${my + 6}`"
          :stroke="resolvedBranchLineColor(i)"
          :stroke-width="2.75"
          stroke-linecap="round"
          fill="none"
        />
        <circle cx="12" :cy="my" r="4.5" :fill="resolvedBranchLineColor(i)" />
        <circle
          :cx="branchEndX"
          :cy="my"
          r="4.5"
          :fill="resolvedBranchLineColor(i)"
        />
      </g>
    </template>

    <!-- Trunk dots -->
    <circle
      v-for="dot in trunkDots"
      :key="dot.key"
      r="3"
      :fill="animDotColor"
      opacity="0"
    >
      <animateMotion
        :path="dot.path"
        :dur="dot.dur"
        :begin="dot.begin"
        repeatCount="indefinite"
        v-bind="dot.motionProps"
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

    <!-- Branch dots — one set per active item -->
    <circle
      v-for="dot in branchDots"
      :key="dot.key"
      cx="12"
      :cy="dot.my"
      r="3"
      :fill="animDotColor"
      opacity="0"
    >
      <animate
        attributeName="cx"
        :values="`12;${branchEndX};${branchEndX}`"
        :keyTimes="dot.keyTimes"
        :dur="`${DUR}s`"
        :begin="dot.begin"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0;0"
        :keyTimes="dot.opKT"
        :dur="`${DUR}s`"
        :begin="dot.begin"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</template>

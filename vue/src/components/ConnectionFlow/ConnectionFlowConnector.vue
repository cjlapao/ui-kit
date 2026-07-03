<script lang="ts">
import { onMounted, onUnmounted, ref, type Ref, type VNodeChild } from "vue";
import type { TreeTone } from "../TreeView/types";
import type { ConnectionState } from "./types";

// ── useIsDark ─────────────────────────────────────────────────────────────────

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

// ── Border width map ──────────────────────────────────────────────────────────

const BORDER_WIDTH: Record<"fit" | "xs" | "sm" | "md" | "lg", number> = {
  fit: 1,
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
};

// ── ConnectionFlowConnector ───────────────────────────────────────────────────

export interface ConnectionFlowConnectorProps {
  state?: ConnectionState;
  sourceTone?: TreeTone;
  targetTone?: TreeTone;
  middleIcon?: VNodeChild;
  width?: number;
  halfRing?: boolean;
  showLine?: boolean;
  animated?: boolean;
  dotSpacing?: number;
  borderSize?: "fit" | "xs" | "sm" | "md" | "lg";
  // Fine-grained color overrides
  sourceFill?: string;
  sourceBorder?: string;
  sourceDot?: string;
  targetFill?: string;
  targetBorder?: string;
  targetDot?: string;
  dotColor?: string;
  /**
   * Multi-source mode: Y offsets from the TOP of the connector space for each
   * source card's centre (parent first, then children).
   * When provided and length > 1, a vertical trunk is drawn on the left side
   * connecting all source rings, and each source gets its own dotted line to
   * the RIGHT entry ring.
   */
  leftAnchors?: number[];
  /**
   * Total height the connector should occupy.
   * Defaults to the source column height; pass max(source, target) when heights differ.
   */
  connectorHeight?: number;
  /**
   * Y offset of the TARGET card's centre from the top of the connector space.
   * When different from the source anchor, a bezier curve is drawn between the
   * two ring positions instead of a straight horizontal line.
   * Defaults to the source anchor (straight line).
   */
  rightAnchorY?: number;
  /**
   * Tones for extra source rings (index 0 = parent, already set via sourceTone).
   * Used to colour child source rings independently.
   */
  extraSourceTones?: TreeTone[];
  /**
   * Fan-out mode: Y offsets from the TOP of the connector space for each TARGET card's centre.
   * When provided and length > 1, a vertical trunk is drawn on the RIGHT side
   * connecting all target rings, and each target gets its own dotted line from the LEFT entry ring.
   */
  rightAnchors?: number[];
  /**
   * Tones for each right-side ring in fan-out mode.
   * Index i corresponds to rightAnchors[i]. Falls back to targetTone.
   */
  rightAnchorTones?: TreeTone[];
  /**
   * Per-lane active state for fan-out mode.
   * Index i corresponds to rightAnchors[i]. When provided, each lane's animation is
   * controlled independently. Falls back to the overall `state`.
   */
  rightAnchorStates?: ConnectionState[];
  /**
   * When true, flowing dots are shown even when `state` is `'stopped'`
   * (already-traversed / completed connectors also animate).
   * Default: false
   */
  animateCompleted?: boolean;
  /**
   * When true, the connector stretches to fill available flex space instead of using a
   * fixed pixel width. The SVG geometry is recalculated from the measured container width
   * so rings stay at correct positions and the middle icon stays at the exact midpoint.
   * Default: false
   */
  fullWidth?: boolean;
}
</script>

<script setup lang="ts">
import { computed, useSlots, watch, type CSSProperties } from "vue";
import { getTreeColorTokens, NEUTRAL_TOKENS } from "../TreeView/toneColors";
import VNodeRenderer from "../internal/VNodeRenderer";

defineOptions({ name: "ConnectionFlowConnector" });

const props = withDefaults(defineProps<ConnectionFlowConnectorProps>(), {
  state: "flowing",
  sourceTone: "neutral",
  targetTone: "neutral",
  width: 56,
  halfRing: true,
  showLine: true,
  animated: true,
  dotSpacing: 60,
  borderSize: "xs",
  extraSourceTones: () => [],
  rightAnchorTones: () => [],
  rightAnchorStates: () => [],
  animateCompleted: false,
  fullWidth: false,
});

const slots = useSlots();
const isDark = useIsDark();

// ── Full-width mode: measure the actual rendered container width ───────────
const containerRef = ref<HTMLDivElement | null>(null);
const measuredWidth = ref(props.width);

watch(
  [() => props.fullWidth, () => props.width, containerRef],
  (_values, _prev, onCleanup) => {
    if (!props.fullWidth) {
      measuredWidth.value = props.width;
      return;
    }
    const el = containerRef.value;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const width = el.offsetWidth;
      if (width > 0) measuredWidth.value = width;
    });
    ro.observe(el);
    const initial = el.offsetWidth;
    if (initial > 0) measuredWidth.value = initial;
    onCleanup(() => ro.disconnect());
  },
  { immediate: true, flush: "post" },
);

const ci = computed(() => (isDark.value ? 1 : 0));
const bw = computed(() => BORDER_WIDTH[props.borderSize]);
const ringR = 5.5;

// isActive gates animated-dot rendering; extended to 'stopped' when animateCompleted is on
const isActive = computed(
  () =>
    props.state === "flowing" ||
    (props.animateCompleted && props.state === "stopped"),
);
// Show tone colors for both 'flowing' and 'stopped' — only 'disabled' uses neutral gray
const showTone = computed(() => props.state !== "disabled");

// Resolved color tokens for sourceTone (parent)
const srcTokens = computed(() => getTreeColorTokens(props.sourceTone));
const dstTokens = computed(() => getTreeColorTokens(props.targetTone));

const srcFill = computed(
  () => props.sourceFill ?? srcTokens.value.connFill[ci.value],
);
const srcBorder = computed(
  () => props.sourceBorder ?? srcTokens.value.connBorder[ci.value],
);
const srcDot = computed(
  () => props.sourceDot ?? srcTokens.value.connDot[ci.value],
);
const dstFill = computed(
  () =>
    props.targetFill ??
    (showTone.value
      ? dstTokens.value.connFill[ci.value]
      : NEUTRAL_TOKENS.connFill[ci.value]),
);
const dstBorder = computed(
  () =>
    props.targetBorder ??
    (showTone.value
      ? dstTokens.value.connBorder[ci.value]
      : NEUTRAL_TOKENS.connBorder[ci.value]),
);
const dstDot = computed(
  () =>
    props.targetDot ??
    (showTone.value
      ? dstTokens.value.connDot[ci.value]
      : NEUTRAL_TOKENS.connDot[ci.value]),
);
// Keep connector lines on the same tonal ramp as connector rings/cards.
const lineColor = computed(() =>
  showTone.value
    ? dstTokens.value.connBorder[ci.value]
    : NEUTRAL_TOKENS.connBorder[ci.value],
);
const animDotColor = computed(
  () =>
    props.dotColor ??
    (isActive.value
      ? dstTokens.value.connDot[ci.value]
      : NEUTRAL_TOKENS.connDot[ci.value]),
);

// ── Simple vs multi-source / fan-out mode ─────────────────────────────────
const leftAnchorList = computed(() => props.leftAnchors ?? []);
const rightAnchorList = computed(() => props.rightAnchors ?? []);
const isMultiSource = computed(() => leftAnchorList.value.length > 1);
const isMultiTarget = computed(() => rightAnchorList.value.length > 1);
// Connector SVG spans the full column height when geometry is known
const svgH = computed(() => props.connectorHeight ?? ringR * 2 + 4);
// Source anchor Y (left ring) — first left anchor or vertical centre of SVG
const sy = computed(() => props.leftAnchors?.[0] ?? svgH.value / 2);
// Target anchor Y (right ring) — when provided and different, draw a bezier curve
const ty = computed(() => props.rightAnchorY ?? sy.value);
// Keep legacy name for multi-source code that uses `my` throughout
const my = computed(() => sy.value);

// Effective width: measured container width when fullWidth, otherwise the fixed prop
const w = computed(() => (props.fullWidth ? measuredWidth.value : props.width));

// Fan-out: control-point X for bezier curves from source to each target lane
const fanOutCx = computed(() => w.value / 2);

// Global dot animation timing (px/s)
const DOT_VELOCITY = 35;
const DOT_GAP = computed(() => props.dotSpacing / DOT_VELOCITY);

// Arc helpers (half-rings)
// Source right-facing: opens rightward (sweep=1)
const srcArc = (y: number) =>
  `M 0 ${y - ringR} A ${ringR} ${ringR} 0 0 1 0 ${y + ringR}`;
// Target left-facing: opens leftward (sweep=0) — uses target anchor Y
const dstArc = computed(
  () =>
    `M ${w.value} ${ty.value - ringR} A ${ringR} ${ringR} 0 0 0 ${w.value} ${ty.value + ringR}`,
);
const dstArcAt = (ry: number) =>
  `M ${w.value} ${ry - ringR} A ${ringR} ${ringR} 0 0 0 ${w.value} ${ry + ringR}`;

// Trunk X — middle of the connector gap
const trunkX = computed(() => w.value / 2);

// ── Horizontal line path helpers ──────────────────────────────────────────
// Bezier curves per source lane converging to the feed entry point (trunkX, sy)
const srcLaneD = (ay: number) =>
  ay === sy.value
    ? `M 0 ${ay} L ${trunkX.value} ${sy.value}`
    : `M 0 ${ay} C ${trunkX.value / 2} ${ay}, ${trunkX.value / 2} ${sy.value}, ${trunkX.value} ${sy.value}`;
// Feed line from trunk to right ring — straight or bezier
const feedD = computed(() =>
  sy.value === ty.value
    ? `M ${trunkX.value} ${sy.value} L ${w.value - ringR} ${ty.value}`
    : `M ${trunkX.value} ${sy.value} C ${(trunkX.value + w.value) / 2} ${sy.value}, ${(trunkX.value + w.value) / 2} ${ty.value}, ${w.value - ringR} ${ty.value}`,
);
// One smooth bezier curve per target lane — departs and arrives horizontally
const targetLaneD = (ry: number) =>
  ry === sy.value
    ? `M ${ringR} ${sy.value} L ${w.value - ringR} ${ry}`
    : `M ${ringR} ${sy.value} C ${fanOutCx.value} ${sy.value}, ${fanOutCx.value} ${ry}, ${w.value - ringR} ${ry}`;
const simpleLineD = computed(() =>
  sy.value === ty.value
    ? `M ${ringR} ${sy.value} L ${w.value - ringR} ${ty.value}`
    : `M ${ringR} ${sy.value} C ${w.value / 2} ${sy.value}, ${w.value / 2} ${ty.value}, ${w.value - ringR} ${ty.value}`,
);

// ── Ring color helpers ────────────────────────────────────────────────────

const srcRingColors = (idx: number) => {
  const tone =
    idx === 0
      ? props.sourceTone
      : (props.extraSourceTones[idx - 1] ?? props.sourceTone);
  const tok = getTreeColorTokens(tone);
  return {
    fill: idx === 0 ? srcFill.value : tok.connFill[ci.value],
    border: idx === 0 ? srcBorder.value : tok.connBorder[ci.value],
    dot: idx === 0 ? srcDot.value : tok.connDot[ci.value],
  };
};

const dstRingColors = (idx: number) => {
  const tone = props.rightAnchorTones[idx] ?? props.targetTone;
  const tok = getTreeColorTokens(tone);
  const laneState = props.rightAnchorStates[idx] ?? props.state;
  const laneTone = laneState !== "disabled";
  return {
    fill: laneTone ? tok.connFill[ci.value] : NEUTRAL_TOKENS.connFill[ci.value],
    border: laneTone
      ? tok.connBorder[ci.value]
      : NEUTRAL_TOKENS.connBorder[ci.value],
    dot: laneTone ? tok.connDot[ci.value] : NEUTRAL_TOKENS.connDot[ci.value],
  };
};

// ── Animated dots ─────────────────────────────────────────────────────────

interface AnimDot {
  key: string;
  fill: string;
  cy?: number;
  motionPath?: string;
  cxValues?: string;
  opTimes: string;
  dur: string;
  begin: string;
}

const animatedDots = computed<AnimDot[]>(() => {
  if (!props.animated) return [];
  const out: AnimDot[] = [];
  const wv = w.value;
  const syv = sy.value;
  const tyv = ty.value;

  if (isMultiTarget.value) {
    // Fan-out: one bezier-path dot set per ACTIVE target lane
    rightAnchorList.value.forEach((ry, idx) => {
      const laneState = props.rightAnchorStates[idx] ?? props.state;
      const laneActive = laneState === "flowing";
      if (!laneActive) return;

      // Approximate arc length: horizontal span + half the vertical delta (bezier correction)
      const actualLen = wv - 2 * ringR + Math.abs(ry - syv) * 0.5;
      const numDots = Math.max(1, Math.ceil(actualLen / props.dotSpacing));
      const virtualLen = numDots * props.dotSpacing;
      const pathDur = numDots * DOT_GAP.value;
      const overflow = Math.max(0, virtualLen - actualLen);

      // Same bezier as the visual line; append a short L for overflow fade-out
      const pathData =
        ry === syv
          ? `M ${ringR} ${syv} L ${wv - ringR + overflow} ${syv}`
          : `M ${ringR} ${syv} C ${fanOutCx.value} ${syv}, ${fanOutCx.value} ${ry}, ${wv - ringR} ${ry} L ${wv - ringR + overflow} ${ry}`;

      const fadeOutEnd = actualLen / virtualLen;
      const fadeOutStart = Math.max(0, fadeOutEnd - 10 / virtualLen);
      const fadeInEnd = Math.min(fadeOutStart, 4 / virtualLen);
      const opTimes = `0;${fadeInEnd.toFixed(4)};${fadeOutStart.toFixed(4)};${fadeOutEnd.toFixed(4)};1`;

      const tone = props.rightAnchorTones[idx] ?? props.targetTone;
      const tok = getTreeColorTokens(tone);
      const dotFill = tok.connDot[ci.value];

      for (let di = 0; di < numDots; di++) {
        out.push({
          key: `dot-fan-${idx}-${di}`,
          fill: dotFill,
          motionPath: pathData,
          opTimes,
          dur: `${pathDur}s`,
          begin: `${(-di * DOT_GAP.value).toFixed(3)}s`,
        });
      }
    });
    return out;
  }

  if (!isActive.value) return out;

  if (isMultiSource.value) {
    // One bezier path per source lane: branch bezier → feed bezier → target
    leftAnchorList.value.forEach((ay, idx) => {
      // Approximate length: branch segment + feed segment
      const branchLen = trunkX.value + Math.abs(ay - syv) * 0.5;
      const feedH = wv - trunkX.value - ringR;
      const feedV = syv !== tyv ? Math.abs(tyv - syv) * 0.5 : 0;
      const actualLen = branchLen + feedH + feedV;

      const numDots = Math.max(1, Math.ceil(actualLen / props.dotSpacing));
      const virtualLen = numDots * props.dotSpacing;
      const pathDur = numDots * DOT_GAP.value;
      const overflow = Math.max(0, virtualLen - actualLen);

      // Branch bezier mirrors visual path; feed bezier matches feed line
      const cx = (trunkX.value + wv) / 2;
      const feedEndX = wv - ringR + overflow;
      const branchSeg =
        ay === syv
          ? `M 0 ${ay} L ${trunkX.value} ${syv}`
          : `M 0 ${ay} C ${trunkX.value / 2} ${ay}, ${trunkX.value / 2} ${syv}, ${trunkX.value} ${syv}`;
      const feedSeg =
        syv === tyv
          ? ` L ${feedEndX} ${tyv}`
          : ` C ${cx} ${syv}, ${cx} ${tyv}, ${feedEndX} ${tyv}`;
      const pathData = `${branchSeg}${feedSeg}`;

      const fadeOutEnd = actualLen / virtualLen;
      const fadeOutStart = Math.max(0, fadeOutEnd - 10 / virtualLen);
      const fadeInEnd = Math.min(fadeOutStart, 4 / virtualLen);
      const opTimes = `0;${fadeInEnd.toFixed(4)};${fadeOutStart.toFixed(4)};${fadeOutEnd.toFixed(4)};1`;

      for (let di = 0; di < numDots; di++) {
        out.push({
          key: `dot-${idx}-${di}`,
          fill: animDotColor.value,
          motionPath: pathData,
          opTimes,
          dur: `${pathDur}s`,
          begin: `${(-di * DOT_GAP.value).toFixed(3)}s`,
        });
      }
    });
    return out;
  }

  const actualLen = wv - 2 * ringR;
  const simpleNumDots = Math.max(1, Math.ceil(actualLen / props.dotSpacing));
  const virtualLen = simpleNumDots * props.dotSpacing;
  const simpleDur = simpleNumDots * DOT_GAP.value;
  const overflow = Math.max(0, virtualLen - actualLen);

  const fadeOutEnd = actualLen / virtualLen;
  const fadeOutStart = Math.max(0, fadeOutEnd - 10 / virtualLen);
  const fadeInEnd = Math.min(fadeOutStart, 4 / virtualLen);
  const opTimes = `0;${fadeInEnd.toFixed(4)};${fadeOutStart.toFixed(4)};${fadeOutEnd.toFixed(4)};1`;

  // When source and target are at different Y positions use animateMotion
  // along the same bezier path as the visible line so dots track it exactly.
  const isAngled = Math.abs(tyv - syv) > 1;
  const motionPath = isAngled
    ? `M ${ringR} ${syv} C ${wv / 2} ${syv}, ${wv / 2} ${tyv}, ${wv - ringR + overflow} ${tyv}`
    : undefined;

  for (let i = 0; i < simpleNumDots; i++) {
    out.push({
      key: `dot-${i}`,
      fill: animDotColor.value,
      cy: isAngled ? undefined : syv,
      motionPath,
      cxValues: isAngled
        ? undefined
        : `${ringR};${wv - ringR + overflow}`,
      opTimes,
      dur: `${simpleDur}s`,
      begin: `${(-i * DOT_GAP.value).toFixed(3)}s`,
    });
  }
  return out;
});

// ── Container / middle icon ───────────────────────────────────────────────

const containerClass = computed(
  () =>
    `relative z-10 flex items-start justify-center -mx-[1px]${props.fullWidth ? " flex-1 min-w-0" : " shrink-0"}`,
);
const containerStyle = computed<CSSProperties>(() =>
  props.fullWidth
    ? { height: `${svgH.value}px` }
    : { width: `${w.value}px`, height: `${svgH.value}px` },
);
const svgStyle: CSSProperties = {
  position: "absolute",
  left: "0",
  top: "0",
  pointerEvents: "none",
};

// Optional middle icon (single-source only)
const showMiddleIcon = computed(
  () =>
    !isMultiSource.value &&
    !!(
      (props.middleIcon !== undefined && props.middleIcon !== null) ||
      slots.middleIcon
    ),
);
</script>

<template>
  <div ref="containerRef" :class="containerClass" :style="containerStyle">
    <svg
      :width="w"
      :height="svgH"
      :viewBox="`0 0 ${w} ${svgH}`"
      overflow="visible"
      :style="svgStyle"
    >
      <!-- ── Horizontal line(s) ────────────────────────────────── -->
      <template v-if="showLine">
        <template v-if="isMultiSource">
          <!-- Bezier curves per source lane converging to the feed entry point (trunkX, sy) -->
          <path
            v-for="(ay, idx) in leftAnchorList"
            :key="`hline-src-${idx}`"
            :d="srcLaneD(ay)"
            :stroke="lineColor"
            :stroke-width="idx === 0 ? 2 : 1.5"
            stroke-linecap="round"
            :stroke-dasharray="state === 'disabled' ? '4 4' : undefined"
            :stroke-opacity="idx === 0 ? 1 : 0.75"
            fill="none"
          />
          <!-- Feed line from trunk to right ring — straight or bezier -->
          <path
            :d="feedD"
            :stroke="lineColor"
            :stroke-width="2"
            stroke-linecap="round"
            :stroke-dasharray="state === 'disabled' ? '4 4' : undefined"
            fill="none"
          />
        </template>
        <template v-else-if="isMultiTarget">
          <!-- One smooth bezier curve per target lane — departs and arrives horizontally -->
          <path
            v-for="(ry, idx) in rightAnchorList"
            :key="`hline-target-${idx}`"
            :d="targetLaneD(ry)"
            :stroke="lineColor"
            :stroke-width="idx === 0 ? 2 : 1.5"
            stroke-linecap="round"
            :stroke-dasharray="state === 'disabled' ? '4 4' : undefined"
            :stroke-opacity="idx === 0 ? 1 : 0.75"
            fill="none"
          />
        </template>
        <path
          v-else
          :d="simpleLineD"
          :stroke="lineColor"
          :stroke-width="2"
          stroke-linecap="round"
          fill="none"
          :stroke-dasharray="state === 'disabled' ? '4 4' : undefined"
        />
      </template>

      <!-- ── Source rings ─────────────────────────────────────── -->
      <template v-if="isMultiSource">
        <g v-for="(ay, idx) in leftAnchorList" :key="`src-${idx}`">
          <template v-if="halfRing">
            <path :d="srcArc(ay)" :fill="srcRingColors(idx).fill" />
            <path
              :d="srcArc(ay)"
              :stroke="srcRingColors(idx).border"
              :stroke-width="bw"
              fill="none"
              stroke-linecap="round"
            />
          </template>
          <template v-else>
            <circle
              :cx="0"
              :cy="ay"
              :r="ringR"
              :fill="srcRingColors(idx).fill"
            />
            <circle
              :cx="0"
              :cy="ay"
              :r="ringR"
              :stroke="srcRingColors(idx).border"
              :stroke-width="bw"
              fill="none"
            />
          </template>
          <circle :cx="0" :cy="ay" r="2" :fill="srcRingColors(idx).dot" />
        </g>
      </template>
      <g v-else>
        <template v-if="halfRing">
          <path :d="srcArc(my)" :fill="srcFill" />
          <path
            :d="srcArc(my)"
            :stroke="srcBorder"
            :stroke-width="bw"
            fill="none"
            stroke-linecap="round"
          />
        </template>
        <template v-else>
          <circle :cx="0" :cy="my" :r="ringR" :fill="srcFill" />
          <circle
            :cx="0"
            :cy="my"
            :r="ringR"
            :stroke="srcBorder"
            :stroke-width="bw"
            fill="none"
          />
        </template>
        <circle :cx="0" :cy="my" r="2" :fill="srcDot" />
      </g>

      <!-- ── Target entry ring(s) ── -->
      <template v-if="isMultiTarget">
        <g v-for="(ry, idx) in rightAnchorList" :key="`dst-${idx}`">
          <template v-if="halfRing">
            <path :d="dstArcAt(ry)" :fill="dstRingColors(idx).fill" />
            <path
              :d="dstArcAt(ry)"
              :stroke="dstRingColors(idx).border"
              :stroke-width="bw"
              fill="none"
              stroke-linecap="round"
            />
          </template>
          <template v-else>
            <circle
              :cx="w"
              :cy="ry"
              :r="ringR"
              :fill="dstRingColors(idx).fill"
            />
            <circle
              :cx="w"
              :cy="ry"
              :r="ringR"
              :stroke="dstRingColors(idx).border"
              :stroke-width="bw"
              fill="none"
            />
          </template>
          <circle :cx="w" :cy="ry" r="2" :fill="dstRingColors(idx).dot" />
        </g>
      </template>
      <g v-else>
        <template v-if="halfRing">
          <path :d="dstArc" :fill="dstFill" />
          <path
            :d="dstArc"
            :stroke="dstBorder"
            :stroke-width="bw"
            fill="none"
            stroke-linecap="round"
          />
        </template>
        <template v-else>
          <circle :cx="w" :cy="ty" :r="ringR" :fill="dstFill" />
          <circle
            :cx="w"
            :cy="ty"
            :r="ringR"
            :stroke="dstBorder"
            :stroke-width="bw"
            fill="none"
          />
        </template>
        <circle :cx="w" :cy="ty" r="2" :fill="dstDot" />
      </g>

      <!-- ── Animated dots ────────────────────────────────────── -->
      <circle
        v-for="dot in animatedDots"
        :key="dot.key"
        r="3"
        :fill="dot.fill"
        :cy="dot.cy"
        opacity="0"
      >
        <animateMotion
          v-if="dot.motionPath"
          :path="dot.motionPath"
          :dur="dot.dur"
          :begin="dot.begin"
          repeatCount="indefinite"
        />
        <animate
          v-else
          attributeName="cx"
          :values="dot.cxValues"
          keyTimes="0;1"
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
    </svg>

    <!-- Optional middle icon (single-source only) -->
    <div
      v-if="showMiddleIcon && fullWidth"
      class="absolute z-20 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-full p-0.5"
      :style="{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }"
    >
      <slot name="middleIcon"><VNodeRenderer :nodes="middleIcon" /></slot>
    </div>
    <div
      v-else-if="showMiddleIcon"
      class="relative z-20 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-full p-0.5 mt-auto mb-auto"
    >
      <slot name="middleIcon"><VNodeRenderer :nodes="middleIcon" /></slot>
    </div>
  </div>
</template>

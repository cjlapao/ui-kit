<script lang="ts">
import type { TooltipPosition } from "./Tooltip.vue";

export interface TooltipWrapperProps {
  /** Tooltip text. When omitted no tooltip is shown but the child is rendered unchanged. */
  text?: string;
  /** Delay in ms before the tooltip appears. Defaults to 500. */
  delay?: number;
  /** Where to place the tooltip relative to the child. Defaults to 'top'. */
  position?: TooltipPosition;
}

const VIEWPORT_PADDING = 8; // px to keep away from viewport edges
</script>

<script setup lang="ts">
/**
 * Attaches a styled tooltip to any child element without adding any wrapper
 * element to the DOM. The tooltip is rendered via Teleport directly into
 * document.body and positioned with `position: fixed`, so it has zero impact on
 * the child's layout or spacing.
 *
 * Includes edge collision detection: when the tooltip would overflow the
 * viewport, it is shifted inward and its caret is repositioned to still point
 * at the trigger element.
 *
 * The component always renders the slot content (cloned with hover handlers)
 * so that switching `text` between undefined and a string value never causes
 * the child element to unmount — important when the child holds a ref (e.g.
 * for truncation detection).
 */
import {
  cloneVNode,
  computed,
  isVNode,
  onUnmounted,
  ref,
  useSlots,
  watch,
  watchEffect,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "TooltipWrapper", inheritAttrs: false });

const props = withDefaults(defineProps<TooltipWrapperProps>(), {
  delay: 500,
  position: "top",
});

const slots = useSlots();

let timer: ReturnType<typeof setTimeout> | null = null;
const tooltipRef = ref<HTMLDivElement | null>(null);

const visible = ref(false);
// Captured center point of the trigger (fixed coords)
const triggerCenter = ref({ top: 0, left: 0 });
// Post-collision-detection final left for the tooltip (null = not yet measured)
const finalLeft = ref<number | null>(null);
// Caret left offset inside the tooltip box
const caretOffset = ref("50%");

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

// Hide immediately when text is removed while tooltip is showing.
watch([() => props.text, visible], ([text, vis]) => {
  if (!text && vis) {
    if (timer) clearTimeout(timer);
    visible.value = false;
    finalLeft.value = null;
  }
});

// After the tooltip renders, measure it and clamp within the viewport.
// The `finalLeft !== null` guard prevents re-running after we've already adjusted.
watchEffect(
  () => {
    if (!visible.value || !tooltipRef.value || finalLeft.value !== null) return;

    const el = tooltipRef.value;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;

    // Start from the ideal center-aligned position
    let left = triggerCenter.value.left;

    if (rect.right > vw - VIEWPORT_PADDING) {
      // Overflows right — shift left
      left = triggerCenter.value.left - (rect.right - (vw - VIEWPORT_PADDING));
    } else if (rect.left < VIEWPORT_PADDING) {
      // Overflows left — shift right
      left = triggerCenter.value.left + (VIEWPORT_PADDING - rect.left);
    }

    // Move the caret so it still points at the original trigger center.
    // rect.width is the tooltip width; caret is inside the tooltip box.
    const tooltipEdge = left - rect.width / 2;
    const caretPct =
      ((triggerCenter.value.left - tooltipEdge) / rect.width) * 100;
    caretOffset.value = `${Math.max(8, Math.min(92, caretPct))}%`;
    finalLeft.value = left;
  },
  { flush: "post" },
);

const show = (e: MouseEvent) => {
  // No text → no tooltip; the child's own handlers are preserved by cloneVNode's
  // prop merging, so they still fire.
  if (props.text) {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    triggerCenter.value = {
      top: props.position === "top" ? rect.top : rect.bottom,
      left: rect.left + rect.width / 2,
    };
    finalLeft.value = null;
    caretOffset.value = "50%";
    timer = setTimeout(() => {
      visible.value = true;
    }, props.delay);
  }
};

const hide = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  visible.value = false;
  finalLeft.value = null;
  caretOffset.value = "50%";
};

const isTop = computed(() => props.position === "top");
const renderLeft = computed(() => finalLeft.value ?? triggerCenter.value.left);

// Clone the slot content with the hover handlers attached so no wrapper
// element is added to the DOM (mirrors React.cloneElement).
const renderTrigger = (): VNodeChild => {
  const nodes = slots.default?.() ?? [];
  return nodes.map((node) =>
    isVNode(node) && typeof node.type !== "symbol"
      ? cloneVNode(node, { onMouseenter: show, onMouseleave: hide })
      : node,
  );
};

const tooltipStyle = computed(() => ({
  position: "fixed" as const,
  top: `${triggerCenter.value.top}px`,
  left: `${renderLeft.value}px`,
  transform: isTop.value
    ? "translate(-50%, calc(-100% - 8px))"
    : "translate(-50%, 8px)",
  // Hide until collision detection has run to avoid a 1-frame flash
  // at the wrong position when near the viewport edge
  visibility: (finalLeft.value === null ? "hidden" : "visible") as
    | "hidden"
    | "visible",
  zIndex: 9999,
}));

const caretClass = computed(() =>
  classNames(
    "absolute -translate-x-1/2 border-4 border-transparent",
    isTop.value
      ? "top-full border-t-neutral-900 dark:border-t-neutral-700"
      : "bottom-full border-b-neutral-900 dark:border-b-neutral-700",
  ),
);
</script>

<template>
  <VNodeRenderer :nodes="renderTrigger()" />
  <Teleport to="body">
    <div
      v-if="visible && text"
      ref="tooltipRef"
      role="tooltip"
      :style="tooltipStyle"
      class="pointer-events-none whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-lg dark:bg-neutral-700"
    >
      {{ text }}
      <span :style="{ left: caretOffset }" :class="caretClass" />
    </div>
  </Teleport>
</template>

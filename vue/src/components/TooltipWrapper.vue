<script lang="ts">
import type {
  TooltipPosition,
} from "../../../common/tooltip/placement";
import type { TooltipVariant } from "../../../common/tooltip/tokens";

export type { TooltipPosition, TooltipVariant };

export interface TooltipWrapperProps {
  /** Tooltip text. When omitted no tooltip is shown but the child is rendered unchanged. */
  text?: string;
  /** Delay in ms before the tooltip appears. @default 500 */
  delay?: number;
  /**
   * Preferred side. The tooltip flips to the opposite side, then to a
   * perpendicular one, when there is not enough room — so this is a
   * preference, not a guarantee. @default "top"
   */
  position?: TooltipPosition;
  /** How the tooltip is painted. @default "surface" */
  variant?: TooltipVariant;
  /** Gap between trigger and tooltip, in px. @default 8 */
  offset?: number;
  /** Minimum distance kept from every viewport edge, in px. @default 8 */
  margin?: number;
  /**
   * Keep the tooltip inside this element instead of the whole viewport — a
   * scroll container, a panel, a modal. It flips and clamps against *that*
   * edge, intersected with the viewport so it still never leaves the screen.
   */
  boundary?: HTMLElement | null;
}
</script>

<script setup lang="ts">
/**
 * Attaches a styled tooltip to the slot content without adding any wrapper
 * element to the DOM. The tooltip is teleported to `document.body` and
 * positioned with `position: fixed`, so it has zero impact on the child's
 * layout or spacing.
 *
 * Collision handling lives in `common/tooltip/placement.ts` — shared with the
 * React kit, and tested directly as geometry. It flips to the opposite side
 * when the preferred one has no room, falls back to a perpendicular side when
 * neither fits, clamps the box inside the viewport, and slides the caret so it
 * still points at the trigger after clamping.
 *
 * The slot content is cloned rather than wrapped, so switching `text` between
 * undefined and a string never unmounts the child — important when the child
 * holds a ref (e.g. for truncation detection).
 */
import {
  cloneVNode,
  computed,
  isVNode,
  onUnmounted,
  ref,
  useSlots,
  watch,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import VNodeRenderer from "./internal/VNodeRenderer";
import {
  resolveTooltipPlacement,
  type TooltipPlacement,
} from "../../../common/tooltip/placement";
import {
  TOOLTIP_ARROW_BORDER,
  TOOLTIP_ARROW_EDGE,
  getTooltipVariantTokens,
} from "../../../common/tooltip/tokens";

defineOptions({ name: "TooltipWrapper", inheritAttrs: false });

const props = withDefaults(defineProps<TooltipWrapperProps>(), {
  delay: 500,
  position: "top",
  variant: "surface",
  offset: 8,
  margin: 8,
});

const slots = useSlots();

let timer: ReturnType<typeof setTimeout> | null = null;
const tooltipRef = ref<HTMLDivElement | null>(null);
const visible = ref(false);
// `null` until measured, which is also the "not yet positioned, keep it
// hidden" signal — otherwise there is a one-frame flash at the wrong place
// near a viewport edge.
const placement = ref<TooltipPlacement | null>(null);
let triggerRect: DOMRect | null = null;

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

// Hide immediately when text is removed while the tooltip is showing.
watch(
  () => props.text,
  (text) => {
    if (!text && visible.value) {
      if (timer) clearTimeout(timer);
      visible.value = false;
      placement.value = null;
    }
  },
);

const measure = () => {
  const el = tooltipRef.value;
  if (!el || !triggerRect) return;
  const box = el.getBoundingClientRect();
  const bounds = props.boundary?.getBoundingClientRect();
  placement.value = resolveTooltipPlacement({
    trigger: triggerRect,
    tooltip: { width: box.width, height: box.height },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    boundary: bounds
      ? {
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
        }
      : undefined,
    preferred: props.position,
    offset: props.offset,
    margin: props.margin,
  });
};

// Measure once the tooltip is in the DOM. `flush: "post"` so the element
// exists; the `placement === null` guard settles it in one pass rather than
// looping on its own output.
watch(
  [visible, tooltipRef],
  () => {
    if (visible.value && placement.value === null) measure();
  },
  { flush: "post" },
);

// Re-place while open: the page can scroll or resize under an open tooltip,
// which used to leave it stranded at a stale position.
let frame = 0;
const schedule = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    frame = 0;
    measure();
  });
};

watch(visible, (open) => {
  if (open) {
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
  } else {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
  }
});

onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame);
  window.removeEventListener("resize", schedule);
  window.removeEventListener("scroll", schedule, true);
});

const show = (e: MouseEvent | FocusEvent) => {
  // No text → no tooltip; the child's own handlers are preserved by
  // cloneVNode's prop merging, so they still fire.
  if (!props.text) return;
  triggerRect = (e.currentTarget as Element).getBoundingClientRect();
  placement.value = null;
  timer = setTimeout(() => {
    visible.value = true;
  }, props.delay);
};

const hide = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  visible.value = false;
  placement.value = null;
};

const side = computed(() => placement.value?.side ?? props.position);
const tokens = computed(() => getTooltipVariantTokens(props.variant));
const vertical = computed(
  () => side.value === "top" || side.value === "bottom",
);

const tooltipStyle = computed(() => ({
  position: "fixed" as const,
  top: `${placement.value?.top ?? 0}px`,
  left: `${placement.value?.left ?? 0}px`,
  visibility: (placement.value ? "visible" : "hidden") as "visible" | "hidden",
  zIndex: 9999,
}));

const caretStyle = computed(() => ({
  ...(vertical.value
    ? { left: `${placement.value?.caret ?? 0}px` }
    : { top: `${placement.value?.caret ?? 0}px` }),
  transform: "translate(-50%, -50%) rotate(45deg)",
}));

const boxClass = computed(() =>
  classNames(
    "pointer-events-none max-w-xs rounded-md px-2.5 py-1.5 text-xs leading-snug",
    tokens.value.box,
  ),
);

/**
 * A rotated square centred on the box edge, not a CSS triangle. A triangle
 * made of `border-*-<colour>` carries no outline, so on the light `surface`
 * variant it was a white shape on a white page — invisible. Half of this sits
 * inside the box, where its unbordered edges share the fill and disappear.
 */
const caretClass = computed(() =>
  classNames(
    "absolute h-2 w-2",
    TOOLTIP_ARROW_EDGE[side.value],
    TOOLTIP_ARROW_BORDER[side.value],
    tokens.value.arrow,
  ),
);

// Clone the slot content with the handlers attached so no wrapper element is
// added to the DOM (mirrors React.cloneElement).
//
// Focus as well as hover: a tooltip that only answers to a pointer is invisible
// to anyone driving the page from the keyboard. The trigger still has to be
// focusable for this to fire.
const renderTrigger = (): VNodeChild => {
  const nodes = slots.default?.() ?? [];
  return nodes.map((node) =>
    isVNode(node) && typeof node.type !== "symbol"
      ? cloneVNode(node, {
          onMouseenter: show,
          onMouseleave: hide,
          onFocus: show,
          onBlur: hide,
        })
      : node,
  );
};
</script>

<template>
  <VNodeRenderer :nodes="renderTrigger()" />
  <Teleport to="body">
    <div
      v-if="visible && text"
      ref="tooltipRef"
      role="tooltip"
      :data-side="side"
      :style="tooltipStyle"
      :class="boxClass"
    >
      {{ text }}
      <span aria-hidden="true" :style="caretStyle" :class="caretClass" />
    </div>
  </Teleport>
</template>

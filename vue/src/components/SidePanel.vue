<script lang="ts">
import type { VNode } from "vue";
import type { IconSize } from "../types";
import type { TrueColor } from "../theme/Theme";

export interface SidePanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Panel title */
  title?: string;
  /** Secondary line rendered below the title */
  subtitle?: string;
  /** Width of the panel in px (default: 420) */
  width?: number;
  /** Optional icon rendered to the left of the title */
  icon?: string | VNode;
  /** Sticky footer rendered at the bottom of the panel */
  footer?: string;
  closeIconSize?: IconSize;
  /** Allow the user to drag the left edge to resize the panel. @default false */
  resizable?: boolean;
  /** Minimum width in px when resizable. @default 280 */
  minWidth?: number;
  /** Maximum width in px when resizable. @default 900 */
  maxWidth?: number;
  /** color for the resizer */
  color?: TrueColor;
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { useClassAttrs } from "../utils/attrsUtils";

/**
 * SidePanel — slides in from the right as a fixed overlay.
 *
 * Because it uses `position: fixed` it never affects the page layout,
 * so no horizontal scrollbar artifacts occur during the animation.
 *
 * ```tsx
 * <SidePanel isOpen={open} onClose={() => setOpen(false)} title="Details">
 *   …detail content…
 * </SidePanel>
 * ```
 */
defineOptions({ name: "SidePanel", inheritAttrs: false });

const props = withDefaults(defineProps<SidePanelProps>(), {
  width: 420,
  closeIconSize: "sm",
  resizable: false,
  minWidth: 280,
  maxWidth: 900,
  color: "neutral",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const instance = getCurrentInstance();

/** The close button is shown only when a `close` listener is attached. */
const hasCloseHandler = computed(() => Boolean(instance?.vnode.props?.onClose));

// Mount immediately on open so the opening animation can play.
// Unmount only after the closing animation finishes (onTransitionEnd).
const mounted = ref(props.isOpen);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) mounted.value = true;
  },
);

const handleTransitionEnd = () => {
  if (!props.isOpen) mounted.value = false;
};

// ── Resizing ──────────────────────────────────────────────────────────────
const currentWidth = ref(props.width);
const isDragging = ref(false);
let startX = 0;
let startWidth = 0;

// Keep currentWidth in sync if the width prop changes while not dragging
watch(
  () => props.width,
  (width) => {
    if (!isDragging.value) currentWidth.value = width;
  },
);

const onMouseDown = (e: MouseEvent) => {
  if (!props.resizable) return;
  e.preventDefault();
  isDragging.value = true;
  startX = e.clientX;
  startWidth = currentWidth.value;

  const onMouseMove = (ev: MouseEvent) => {
    const delta = startX - ev.clientX;
    const next = Math.min(
      props.maxWidth,
      Math.max(props.minWidth, startWidth + delta),
    );
    currentWidth.value = next;
  };
  document.body.style.userSelect = "none";
  document.body.style.cursor = "col-resize";
  const onMouseUp = () => {
    isDragging.value = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const resolvedWidth = computed(() =>
  props.resizable ? currentWidth.value : props.width,
);

const rootClass = computed(() =>
  classNames(
    "absolute top-0 right-0 h-full z-40",
    "overflow-hidden",
    // Only animate width when not actively resizing
    !isDragging.value && "transition-[width] duration-300 ease-in-out",
    "border-l border-neutral-200 dark:border-neutral-700",
    "shadow-xl dark:shadow-neutral-900/50",
  ),
);

const resizerClass = computed(
  () =>
    `h-full w-full bg-transparent transition-colors group-hover:bg-${props.color}-300/60 dark:group-hover:bg-${props.color}-600/60 active:bg-${props.color}-400/60 dark:active:bg-${props.color}-500/40`,
);

const innerClass = computed(() =>
  classNames("flex h-full flex-col bg-white dark:bg-neutral-900", classAttr.value),
);
</script>

<template>
  <div
    v-if="mounted"
    :class="rootClass"
    :style="{ width: isOpen ? `${resolvedWidth}px` : '0px' }"
    @transitionend="handleTransitionEnd"
  >
    <!-- Drag handle — left edge, only rendered when resizable -->
    <div
      v-if="resizable"
      class="absolute left-0 top-0 h-full z-40 w-1 cursor-col-resize group"
      @mousedown="onMouseDown"
    >
      <!-- Visible highlight on hover/drag -->
      <div :class="resizerClass" />
    </div>

    <!-- Inner container — fixed at target width so content never squishes during animation -->
    <div
      :class="innerClass"
      :style="{ width: `${resolvedWidth}px` }"
      v-bind="restAttrs"
    >
      <!-- ── Header ─────────────────────────────────────────────── -->
      <div
        class="flex-none flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3"
      >
        <div v-if="icon || $slots.icon" class="shrink-0 mt-0.5">
          <slot name="icon"><VNodeRenderer :nodes="icon" /></slot>
        </div>
        <div class="min-w-0 flex-1">
          <h3
            v-if="title || $slots.title"
            class="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate"
          >
            <slot name="title">{{ title }}</slot>
          </h3>
          <p
            v-if="subtitle || $slots.subtitle"
            class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate"
          >
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-1 pt-0.5">
          <slot name="headerActions" />
          <IconButton
            v-if="hasCloseHandler"
            icon="Close"
            :size="closeIconSize"
            variant="ghost"
            color="slate"
            aria-label="Close panel"
            @click="emit('close')"
          />
        </div>
      </div>

      <!-- ── Body ───────────────────────────────────────────────── -->
      <div class="flex-1 min-h-0 overflow-y-auto"><slot /></div>

      <!-- ── Footer ─────────────────────────────────────────────── -->
      <div
        v-if="footer || $slots.footer"
        class="flex-none border-t border-neutral-200 dark:border-neutral-700 px-4 py-3"
      >
        <slot name="footer">{{ footer }}</slot>
      </div>
    </div>
  </div>
</template>

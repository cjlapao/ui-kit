<script lang="ts">
export type TooltipPosition = "top" | "bottom";

export interface TooltipProps {
  /** Text shown in the tooltip. When omitted the component renders children as-is. */
  text?: string;
  /** How long to wait (ms) before showing the tooltip. Defaults to 500. */
  delay?: number;
  /** Where to place the tooltip relative to the trigger. Defaults to 'top'. */
  position?: TooltipPosition;
  /** Extra classes applied to the outer wrapper element. */
  wrapperClassName?: string;
}
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import classNames from "classnames";

defineOptions({ name: "Tooltip" });

const props = withDefaults(defineProps<TooltipProps>(), {
  delay: 500,
  position: "top",
});

let timer: ReturnType<typeof setTimeout> | null = null;
const wrapperRef = ref<HTMLDivElement | null>(null);
const visible = ref(false);
const coords = ref<{ x: number; y: number } | null>(null);

const show = () => {
  timer = setTimeout(() => {
    if (wrapperRef.value) {
      const rect = wrapperRef.value.getBoundingClientRect();
      coords.value = {
        x: rect.left + rect.width / 2,
        y: props.position === "top" ? rect.top : rect.bottom,
      };
    }
    visible.value = true;
  }, props.delay);
};

const hide = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  visible.value = false;
  coords.value = null;
};

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});

const isTop = computed(() => props.position === "top");

const wrapperClass = computed(() =>
  classNames("relative inline-flex", props.wrapperClassName),
);

const tooltipStyle = computed(() =>
  coords.value
    ? {
        left: `${coords.value.x}px`,
        top: `${coords.value.y}px`,
        transform: isTop.value
          ? "translate(-50%, calc(-100% - 6px))"
          : "translate(-50%, 6px)",
      }
    : undefined,
);

const caretClass = computed(() =>
  classNames(
    "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
    isTop.value
      ? "top-full border-t-neutral-900 dark:border-t-neutral-700"
      : "bottom-full border-b-neutral-900 dark:border-b-neutral-700",
  ),
);
</script>

<template>
  <slot v-if="!text" />
  <div
    v-else
    ref="wrapperRef"
    :class="wrapperClass"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot />
    <Teleport to="body">
      <div
        v-if="visible && coords"
        role="tooltip"
        class="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-lg dark:bg-neutral-700"
        :style="tooltipStyle"
      >
        {{ text }}
        <!-- caret -->
        <span :class="caretClass" />
      </div>
    </Teleport>
  </div>
</template>

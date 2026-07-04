<script lang="ts">
import type { TooltipPosition } from "./Tooltip.vue";

export interface TruncatedTextProps {
  /** The text to display, truncated with an ellipsis when it overflows. */
  text: string;
  /** Delay in ms before the tooltip becomes visible. Defaults to 2000. */
  delay?: number;
  /** Render as a different element. Defaults to "div". */
  as?: "div" | "span" | "p";
  /** Where to place the tooltip. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /**
   * When true, the outer `<div class="min-w-0">` wrapper is omitted and the
   * TooltipWrapper is returned directly. Use this when TruncatedText is a flex
   * child and you control sizing via `class` (e.g. `"min-w-0 flex-1"`).
   */
  noWrapper?: boolean;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";
import TooltipWrapper from "./TooltipWrapper.vue";

defineOptions({ name: "TruncatedText", inheritAttrs: false });

const props = withDefaults(defineProps<TruncatedTextProps>(), {
  delay: 2000,
  as: "div",
  tooltipPosition: "top",
  noWrapper: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLElement | null>(null);
const truncated = ref(false);

let observer: ResizeObserver | null = null;

// Guard against ResizeObserver firing for a detached node, which would
// report scrollWidth=0 and incorrectly reset the truncated state.
const check = () => {
  const node = el.value;
  if (node && node.isConnected) {
    truncated.value = node.scrollWidth > node.clientWidth;
  }
};

watch(
  [el, () => props.text],
  () => {
    observer?.disconnect();
    observer = null;
    const node = el.value;
    if (!node) return;
    observer = new ResizeObserver(check);
    observer.observe(node);
    check();
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const tagClass = computed(() =>
  ["truncate", classAttr.value].filter(Boolean).join(" "),
);
</script>

<template>
  <!--
    Always keep TooltipWrapper in the tree (pass text only when truncated).
    This avoids reconciliation switching between a bare tag and a
    TooltipWrapper>tag tree, which would unmount/remount the tag element and
    detach the ref, causing a ResizeObserver feedback loop.
  -->
  <div v-if="!noWrapper" class="min-w-0">
    <TooltipWrapper
      :text="truncated ? text : undefined"
      :delay="delay"
      :position="tooltipPosition"
    >
      <component :is="as" ref="el" :class="tagClass" v-bind="restAttrs">
        {{ text }}
      </component>
    </TooltipWrapper>
  </div>
  <TooltipWrapper
    v-else
    :text="truncated ? text : undefined"
    :delay="delay"
    :position="tooltipPosition"
  >
    <component :is="as" ref="el" :class="tagClass" v-bind="restAttrs">
      {{ text }}
    </component>
  </TooltipWrapper>
</template>

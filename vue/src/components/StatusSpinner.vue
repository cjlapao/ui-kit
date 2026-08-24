<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

/**
 * The shared control scale, so the status circle lines up with the `Spinner`
 * and the Button beside it instead of speaking its own size language.
 */
export type StatusSpinnerSize = ControlSize;
export type StatusSpinnerTone = TrueColor;

export interface StatusSpinnerProps {
  tone?: StatusSpinnerTone;
  size?: StatusSpinnerSize;
  animated?: boolean;
  /** Visible text beside the circle. Also announced — the circle alone reads as "Loading". */
  label?: string;
}
</script>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from "vue";
import classNames from "classnames";
import {
  getSurfaceTextTokens,
  getStatusSpinnerSizeTokens,
  getStatusSpinnerToneTokens,
} from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "StatusSpinner", inheritAttrs: false });

const props = withDefaults(defineProps<StatusSpinnerProps>(), {
  tone: "blue",
  size: "md",
  animated: true,
});

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLSpanElement | null>(null);
defineExpose({ el });

const toneTokens = computed(() => getStatusSpinnerToneTokens(props.tone));
const sizeTokens = computed(() => getStatusSpinnerSizeTokens(props.size));

// CSS colours, not classes: the four border sides carry four different
// values, and `dark:` cannot reach an inline style.
const ringStyle = computed<CSSProperties>(() =>
  props.animated
    ? {
        borderTopColor: toneTokens.value.arc,
        borderRightColor: toneTokens.value.track,
        borderBottomColor: toneTokens.value.track,
        borderLeftColor: toneTokens.value.track,
      }
    : {
        borderColor: toneTokens.value.track,
      },
);

const dotStyle = computed<CSSProperties>(() => ({
  boxShadow: `0 0 8px ${toneTokens.value.glow}`,
}));

const rootClass = computed(() =>
  classNames("inline-flex items-center gap-2", classAttr.value),
);

const wrapperClass = computed(() =>
  classNames(
    "relative inline-flex shrink-0 items-center justify-center",
    sizeTokens.value.wrapper,
  ),
);

const ringClass = computed(() =>
  classNames(
    "absolute inset-0 rounded-full border-solid border-transparent transition-all duration-200 ease-out",
    sizeTokens.value.border,
    props.animated && "animate-spin motion-reduce:animate-none",
  ),
);

const dotClass = computed(() =>
  classNames(
    "relative rounded-full ring-1 ring-white/40 dark:ring-black/40",
    sizeTokens.value.dot,
    toneTokens.value.dot,
  ),
);

// Vue has no SurfaceProvider yet, so the label takes the solid-surface tokens
// and cannot adapt to a glass panel around it.
const labelClass = `text-sm font-medium ${getSurfaceTextTokens("elevated").body}`;
</script>

<template>
  <span ref="el" :class="rootClass" role="status" v-bind="restAttrs">
    <span :class="wrapperClass">
      <span :class="ringClass" :style="ringStyle" />
      <span :class="dotClass" :style="dotStyle" />
    </span>
    <!-- With a visible label the text is already inside the status region —
         an sr-only copy beside it would be announced twice. -->
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span v-else class="sr-only">Loading</span>
  </span>
</template>

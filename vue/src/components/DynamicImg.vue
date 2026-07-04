<script lang="ts">
export interface DynamicImgProps {
  base64: string;
  fill?: string;
  stroke?: string;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "DynamicImg", inheritAttrs: false });

const props = withDefaults(defineProps<DynamicImgProps>(), {
  size: "md",
});

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const isPng = computed(() =>
  props.base64.toLowerCase().includes("data:image/png;base64,"),
);

const isSvg = computed(() =>
  props.base64.toLowerCase().includes("data:image/svg+xml;base64,"),
);

const svgStyled = computed(() => {
  const svgDecoded = atob(
    props.base64.replace(/^data:image\/svg\+xml;base64,/, ""),
  );

  return svgDecoded
    .replace(/fill=".*?"/g, `fill="${props.fill || "currentColor"}"`)
    .replace(/stroke=".*?"/g, `stroke="${props.stroke || "currentColor"}"`);
});

const svgContainerClass = computed(
  () =>
    `inline-flex select-none items-center justify-center p-[5px] text-current [&>svg]:h-full [&>svg]:w-full [&>svg_*]:fill-current [&>svg_*]:stroke-current ${sizeClasses[props.size]} ${classAttr.value ?? ""}`,
);
</script>

<template>
  <VNodeRenderer v-if="!base64" :nodes="renderIcon('Chat', size)" />
  <img
    v-else-if="isPng"
    :src="base64"
    alt="Dynamic Image"
    :class="classAttr"
    :title="title"
    v-bind="restAttrs"
  />
  <VNodeRenderer v-else-if="!isSvg" :nodes="renderIcon('Chat', size)" />
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    v-else
    :class="svgContainerClass"
    :title="title"
    v-bind="restAttrs"
    v-html="svgStyled"
  />
</template>

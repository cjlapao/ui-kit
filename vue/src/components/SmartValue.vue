<script lang="ts">
import type { CapsuleBlueprintParameter } from "../types/CapsuleBlueprint";

export interface SmartValueProps {
  value: string;
  globalParameters?: CapsuleBlueprintParameter[];
  serviceNames?: string[];
  context?: {
    slug?: string;
    enable_https?: boolean;
  };
}

type SmartValuePart =
  | { key: string; kind: "text"; text: string }
  | { key: string; kind: "token"; text: string; class: string; title: string };
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import IconButton from "./IconButton.vue";
import { resolveVariable, SMART_VAR_REGEX } from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SmartValue", inheritAttrs: false });

const props = withDefaults(defineProps<SmartValueProps>(), {
  value: "",
  globalParameters: () => [],
  serviceNames: () => [],
  context: () => ({}),
});

const { classAttr, restAttrs } = useClassAttrs();

const viewMode = ref<"token" | "value">("token");

// Case insensitive regex match
const hasVariables = computed(() =>
  new RegExp(SMART_VAR_REGEX, "gi").test(props.value),
);

const parts = computed<SmartValuePart[]>(() => {
  const value = props.value;
  const result: SmartValuePart[] = [];
  let lastIndex = 0;
  let match;

  const regex = new RegExp(SMART_VAR_REGEX, "gi");

  while ((match = regex.exec(value)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      result.push({
        key: `text-${lastIndex}`,
        kind: "text",
        text: value.substring(lastIndex, match.index),
      });
    }

    const fullToken = match[0];
    const type = match[1]; // var | env
    const source = match[2]; // global | system | service
    const name = match[3];

    if (viewMode.value === "value") {
      const ctx = {
        globalParameters: props.globalParameters,
        serviceNames: props.serviceNames,
        context: props.context,
      };
      // resolveVariable expects the full token usually, or we can adapt logic.
      // The utils resolveVariable expects the full token string to match its regex.
      const {
        value: resolvedVal,
        isResolved,
        isRuntime,
      } = resolveVariable(fullToken, ctx);
      const isEmpty = !resolvedVal;

      let badgeClass = "bg-green-50 text-green-700 border-green-200";
      if (isEmpty) {
        badgeClass = "bg-red-50 text-red-700 border-red-200";
      }

      if (isResolved && isRuntime) {
        badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
      } else if (source === "system" && !isEmpty) {
        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      }

      result.push({
        key: `token-${match.index}`,
        kind: "token",
        class: `mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none cursor-help align-middle`,
        title: isResolved ? `Value: ${resolvedVal}` : "Variable not found",
        text: isEmpty ? "empty" : resolvedVal,
      });
    } else {
      let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
      if (source === "global")
        badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
      if (source === "system")
        badgeClass = "bg-amber-50 text-amber-900 border-amber-200";
      if (source === "service")
        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

      result.push({
        key: `token-${match.index}`,
        kind: "token",
        class: `mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none cursor-help align-middle`,
        title: `${type}::${source}`,
        text: `${source === "global" ? "G" : source === "system" ? "S" : "SVC"}:${name}`,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < value.length) {
    result.push({
      key: `text-${lastIndex}`,
      kind: "text",
      text: value.substring(lastIndex),
    });
  }

  return result;
});

const toggleViewMode = (e: MouseEvent) => {
  e.stopPropagation();
  viewMode.value = viewMode.value === "token" ? "value" : "token";
};
</script>

<template>
  <span v-if="!hasVariables" :class="classAttr" v-bind="restAttrs">{{
    value
  }}</span>
  <div
    v-else
    :class="`flex items-start gap-1 group ${classAttr ?? ''}`"
    v-bind="restAttrs"
  >
    <div
      class="flex-1 min-w-0 flex flex-wrap items-center gap-y-1 max-h-[80px] overflow-y-auto"
    >
      <template v-for="part in parts" :key="part.key">
        <span v-if="part.kind === 'text'">{{ part.text }}</span>
        <span v-else :class="part.class" :title="part.title">{{
          part.text
        }}</span>
      </template>
    </div>
    <IconButton
      :icon="viewMode === 'token' ? 'EyeOpen' : 'EyeClosed'"
      variant="ghost"
      size="xs"
      class="text-slate-400 hover:text-slate-600 hidden group-hover:inline-flex"
      :title="viewMode === 'token' ? 'Show Values' : 'Show Tokens'"
      @click="toggleViewMode"
    />
  </div>
</template>

<script lang="ts">
import type {
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";
import type { TrueColor } from "../theme/Theme";
import type { SmartViewMode } from "./SmartVariableBadge.vue";

export interface SmartValueProps {
  value: string;
  /** The variable groups the tokens are resolved against. */
  groups?: SmartVariableGroup[];
  /** Turns a token into a display value. Defaults to a lookup over `groups`. */
  resolve?: SmartVariableResolver;
  /** Which view to open in. @default "token" */
  defaultViewMode?: SmartViewMode;
  /** Marks tokens that name no known variable. @default true */
  flagMissing?: boolean;
  /** Accent colour for the toggle. @default "blue" */
  tone?: TrueColor;
  /** Keeps the toggle visible instead of revealing it on hover. */
  alwaysShowToggle?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import SmartVariableBadge from "./SmartVariableBadge.vue";
import {
  createDefaultResolver,
  hasSmartVariables,
  splitSmartValue,
} from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SmartValue", inheritAttrs: false });

const props = withDefaults(defineProps<SmartValueProps>(), {
  value: "",
  groups: () => [],
  defaultViewMode: "token",
  flagMissing: true,
  tone: "blue",
  alwaysShowToggle: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const viewMode = ref<SmartViewMode>(props.defaultViewMode);

const hasVariables = computed(() => hasSmartVariables(props.value));

const resolver = computed<SmartVariableResolver>(
  () => props.resolve ?? createDefaultResolver(props.groups),
);

/** One split for the whole value — the loop used to be copied per component. */
const parts = computed(() => splitSmartValue(props.value));

const toggleLabel = computed(() =>
  viewMode.value === "token" ? "Show values" : "Show tokens",
);

const toggle = () => {
  viewMode.value = viewMode.value === "token" ? "value" : "token";
};
</script>

<template>
  <span v-if="!hasVariables" :class="classAttr" v-bind="restAttrs">
    {{ value }}
  </span>
  <span
    v-else
    v-bind="restAttrs"
    :class="classNames('group inline-flex items-start gap-1', classAttr)"
  >
    <span class="flex min-w-0 flex-1 flex-wrap items-center gap-y-1">
      <template v-for="part in parts" :key="part.index">
        <span v-if="part.kind === 'text'">{{ part.text }}</span>
        <SmartVariableBadge
          v-else
          :variable="part.variable"
          :groups="groups"
          :resolve="resolver"
          :mode="viewMode"
          :flag-missing="flagMissing"
        />
      </template>
    </span>
    <IconButton
      :icon="viewMode === 'token' ? 'EyeOpen' : 'EyeClosed'"
      variant="ghost"
      :color="tone"
      size="xs"
      :sr-label="toggleLabel"
      :tooltip="toggleLabel"
      :class="
        classNames(
          'shrink-0',
          !alwaysShowToggle &&
            'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100',
        )
      "
      @click.stop="toggle"
    />
  </span>
</template>

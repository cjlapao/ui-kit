<script lang="ts">
import type { CapsuleBlueprintParameter } from "../types/CapsuleBlueprint";

export interface SmartInputProps {
  modelValue: string;
  placeholder?: string;
  globalParameters?: CapsuleBlueprintParameter[];
  serviceNames?: string[];
  context?: {
    slug?: string;
    enable_https?: boolean;
  };
  multiline?: boolean; // If true, behaves like a textarea (kinda) or restricted? For now assuming single line mostly.
}

type SmartInputPart =
  | { key: string; kind: "text"; text: string }
  | { key: string; kind: "token"; text: string; class: string; title: string };
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import IconButton from "./IconButton.vue";
import VariablePicker from "./VariablePicker.vue";
import { type SmartVariable } from "../types/Variables";
import { SMART_VAR_REGEX } from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SmartInput", inheritAttrs: false });

const props = withDefaults(defineProps<SmartInputProps>(), {
  modelValue: "",
  globalParameters: () => [],
  serviceNames: () => [],
  context: () => ({}),
  // multiline // reserved for future
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { classAttr, restAttrs } = useClassAttrs();

const isEditing = ref(false);
const showPicker = ref(false);
const viewMode = ref<"token" | "value">("token"); // New state
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const pickerRef = ref<HTMLDivElement | null>(null);

// Calculate picker position (basic implementation)
const pickerPos = ref({ top: 0, left: 0 });

const hasVariables = computed(() => {
  const regex = new RegExp(SMART_VAR_REGEX);
  return regex.test(props.modelValue);
});

const handleContainerClick = () => {
  isEditing.value = true;
};

const handleInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const handleBlur = (e: FocusEvent) => {
  // Only stop editing if we didn't click into the picker or the toggle button
  if (
    !containerRef.value?.contains(e.relatedTarget as Node) &&
    !pickerRef.value?.contains(e.relatedTarget as Node)
  ) {
    isEditing.value = false;
    showPicker.value = false;
  }
};

const toggleView = (e: MouseEvent) => {
  e.stopPropagation();
  isEditing.value = false; // Force exit edit mode to see changes
  viewMode.value = viewMode.value === "token" ? "value" : "token";
};

const togglePicker = (e: MouseEvent) => {
  e.stopPropagation(); // Prevent container click from focusing input immediately if unnecessary
  if (showPicker.value) {
    showPicker.value = false;
  } else {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect();
      pickerPos.value = {
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      };
    }
    showPicker.value = true;
    isEditing.value = true; // Ensure we are in edit mode to receive insertion
  }
};

const handleSelectVariable = (variable: SmartVariable) => {
  // Insert variable at cursor position or append
  const input = inputRef.value;
  const value = props.modelValue;
  let newValue = value;

  if (input) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    newValue =
      value.substring(0, start) + variable.fullToken + value.substring(end);

    // Restore focus and cursor?
    // Setting state is async, so cursor restoration is tricky without effect.
    // For now simple append/replace.
  } else {
    newValue += variable.fullToken;
  }

  emit("update:modelValue", newValue);
  showPicker.value = false;
  // keep editing
  input?.focus();
};

watch(isEditing, (editing) => {
  if (editing) {
    void nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

// Close picker if clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    showPicker.value &&
    pickerRef.value &&
    !pickerRef.value.contains(event.target as Node) &&
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    showPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const resolveVariable = (
  type: string,
  source: string,
  name: string,
): { value: string; isResolved: boolean; isRuntime?: boolean } => {
  if (source === "global" || source === "env") {
    // NOTE: Current regex match groups: 1=type, 2=source, 3=name
    // But typically we see {{ var::global::NAME }}.
    // 'source' argument here comes from the second part.
    // If the user types {{ env::global::NAME }}, source is 'global'.

    let param = props.globalParameters.find((p) => p.key === name);
    if (!param) {
      // Fallback: Try case-insensitive comparison
      param = props.globalParameters.find(
        (p) => p.key.toLowerCase() === name.toLowerCase(),
      );
    }

    if (param) {
      // Strict Type Check
      if (param.type !== type) {
        return { value: "", isResolved: false };
      }
      return { value: param.default_value || "", isResolved: true };
    }
    return { value: "", isResolved: false };
  }
  if (source === "service") {
    return { value: name, isResolved: true };
  }
  if (source === "system") {
    const lowerName = name.toLowerCase();
    // Derived Variables
    if (lowerName === "sub_domain") {
      return { value: props.context.slug || "", isResolved: true };
    }
    if (lowerName === "domain") {
      return { value: "parallels.private", isResolved: true };
    }
    if (lowerName === "host_url") {
      const protocol = props.context.enable_https ? "https" : "http";
      const domain = "parallels.private";
      const sub = props.context.slug || "";
      if (sub) {
        return { value: `${protocol}://${sub}.${domain}`, isResolved: true };
      }
      return { value: "", isResolved: false };
    }

    // Runtime Variables
    const runtimeVars = [
      "name",
      "reverse_proxy_host",
      "ip_address",
      "host_gateway_ip",
      "capsule_id",
      "capsule_name",
      "host_ip",
      "app_url",
    ];
    if (runtimeVars.includes(lowerName)) {
      return { value: `[${lowerName}]`, isResolved: true, isRuntime: true };
    }

    // Fallback for unknown system vars
    return { value: `[System: ${name}]`, isResolved: true, isRuntime: true };
  }
  return { value: "", isResolved: false };
};

// Render parsed view
const viewParts = computed<SmartInputPart[]>(() => {
  const value = props.modelValue;
  const parts: SmartInputPart[] = [];
  let lastIndex = 0;
  let match;
  // Case insensitive regex match to align with MarkdownEditor
  const regex = new RegExp(SMART_VAR_REGEX, "gi");

  while ((match = regex.exec(value)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push({
        key: `text-${lastIndex}`,
        kind: "text",
        text: value.substring(lastIndex, match.index),
      });
    }

    // The variable token
    // const fullToken = match[0];
    const type = match[1]; // var | env
    const source = match[2]; // global | system | service
    const name = match[3];

    if (viewMode.value === "value") {
      const {
        value: resolvedVal,
        isResolved,
        isRuntime,
      } = resolveVariable(type, source, name);
      const isEmpty = !resolvedVal;

      let badgeClass = "bg-green-50 text-green-700 border-green-200";
      if (isEmpty) {
        badgeClass = "bg-red-50 text-red-700 border-red-200";
      }

      if (isResolved && isRuntime) {
        badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
      } else if (source === "system" && !isEmpty) {
        // Derived or resolved system vars (green/amber)
        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      }

      parts.push({
        key: `token-${match.index}`,
        kind: "token",
        class: `mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none cursor-help`,
        title: isResolved ? `Value: ${resolvedVal}` : "Variable not found",
        text: isEmpty ? "empty" : resolvedVal,
      });
    } else {
      let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
      if (source === "global") {
        if (type === "var") {
          badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
        } else if (type === "env") {
          badgeClass = "bg-teal-50 text-teal-700 border-teal-200";
        } else {
          badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
        }
      }
      if (source === "system")
        badgeClass = "bg-amber-50 text-amber-900 border-amber-200";
      if (source === "service")
        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

      let labelPrefix = "G";
      if (source === "global") {
        labelPrefix = type === "env" ? "ENV" : "VAR";
      } else if (source === "system") {
        labelPrefix = "SYS";
      } else if (source === "service") {
        labelPrefix = "SVC";
      }

      parts.push({
        key: `token-${match.index}`,
        kind: "token",
        class: `mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none cursor-help`,
        title: `${type}::${source}`,
        text: `${labelPrefix}:${name}`,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < value.length) {
    parts.push({
      key: `text-${lastIndex}`,
      kind: "text",
      text: value.substring(lastIndex),
    });
  }

  return parts;
});

const containerClass = computed(
  () =>
    `relative min-h-[38px] flex items-center rounded-lg border bg-white ${
      isEditing.value
        ? "border-blue-500 ring-1 ring-blue-500/20"
        : "border-slate-300 hover:border-slate-400"
    } ${classAttr.value ?? ""}`,
);
</script>

<template>
  <div ref="containerRef" :class="containerClass" v-bind="restAttrs">
    <input
      v-if="isEditing"
      ref="inputRef"
      :value="modelValue"
      class="flex-1 w-full h-full px-3 py-2 bg-transparent border-none outline-none text-sm font-mono placeholder:font-sans"
      :placeholder="placeholder"
      autocomplete="off"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div
      v-else
      class="flex-1 px-3 py-2 text-sm cursor-text h-full flex items-center"
      @click="handleContainerClick"
    >
      <span v-if="!modelValue" class="text-slate-400 italic">{{
        placeholder || "Empty"
      }}</span>
      <div v-else class="truncate">
        <template v-for="part in viewParts" :key="part.key">
          <span v-if="part.kind === 'text'">{{ part.text }}</span>
          <span v-else :class="part.class" :title="part.title">{{
            part.text
          }}</span>
        </template>
      </div>
    </div>

    <div class="flex items-center pr-1 border-l border-transparent gap-0.5">
      <IconButton
        v-if="hasVariables"
        :icon="viewMode === 'token' ? 'EyeOpen' : 'EyeClosed'"
        variant="ghost"
        size="sm"
        class="text-slate-400 hover:text-slate-600"
        :title="viewMode === 'token' ? 'Show Values' : 'Show Tokens'"
        @click="toggleView"
      />
      <IconButton
        icon="Plus"
        variant="ghost"
        size="sm"
        :class="
          showPicker
            ? 'text-blue-600 bg-blue-50'
            : 'text-slate-400 hover:text-slate-600'
        "
        title="Insert Variable"
        @click="togglePicker"
      />
    </div>

    <!-- Teleport for Variable Picker to avoid z-index/overflow issues -->
    <Teleport to="body">
      <div
        v-if="showPicker"
        ref="pickerRef"
        :style="{
          position: 'absolute',
          top: `${pickerPos.top}px`,
          left: `${pickerPos.left}px`,
          zIndex: 9999,
        }"
      >
        <VariablePicker
          :global-parameters="globalParameters"
          :service-names="serviceNames"
          @select="handleSelectVariable"
          @close="showPicker = false"
        />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";
import type { InputVariant, TrueColor } from "../theme/Theme";
import type { SmartViewMode } from "./SmartVariableBadge.vue";

/** `Input`'s three-step scale, so the two line up when stacked. */
export type SmartInputSize = "sm" | "md" | "lg";

export interface SmartInputProps {
  value: string;
  placeholder?: string;
  /**
   * The variable groups offered by the picker. Each group's `id` becomes the
   * token's middle segment, so the taxonomy is entirely the caller's.
   */
  groups?: SmartVariableGroup[];
  /**
   * Turns a token into a display value. Defaults to a lookup over `groups`;
   * supply your own for derived or environment-dependent values.
   */
  resolve?: SmartVariableResolver;
  /** Renders a textarea instead of a single-line field. */
  multiline?: boolean;
  /** Rows for the multiline field. @default 4 */
  rows?: number;
  disabled?: boolean;
  /** @default "md" */
  size?: SmartInputSize;
  /** Surface treatment, shared with `Input`, `Textarea` and `SearchBar`. */
  variant?: InputVariant;
  /** Accent colour for focus and the picker trigger. @default "blue" */
  tone?: TrueColor;
  /** Which view the preview opens in. @default "token" */
  defaultViewMode?: SmartViewMode;
  /** Typing the opening `{{` opens the picker. @default true */
  autocomplete?: boolean;
  /** Marks tokens that name no known variable, and counts them. @default true */
  flagMissing?: boolean;
  ariaLabel?: string;
}

const SIZE_STYLES: Record<
  SmartInputSize,
  { pad: string; text: string; icon: "xs" | "sm"; minHeight: string }
> = {
  sm: { pad: "px-3 py-1.5", text: "text-sm", icon: "xs", minHeight: "min-h-8" },
  md: {
    pad: "px-3.5 py-2.5",
    text: "text-sm",
    icon: "sm",
    minHeight: "min-h-10",
  },
  lg: { pad: "px-4 py-3", text: "text-base", icon: "sm", minHeight: "min-h-12" },
};

/** Distance from the viewport edge at which the picker flips above the field. */
const PICKER_HEIGHT = 420;

const SCROLLBAR =
  "pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent";

/** Index of the `{{` that opens the token the caret sits in, or the caret. */
const findTriggerStart = (value: string, caret: number): number => {
  const before = value.slice(0, caret);
  const open = before.lastIndexOf("{{");
  if (open === -1) return caret;
  if (before.slice(open).includes("}}")) return caret;
  return open;
};
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import VariablePicker from "./VariablePicker.vue";
import SmartVariableBadge from "./SmartVariableBadge.vue";
import { getInputVariantTokens } from "../theme/Theme";
import {
  createDefaultResolver,
  extractVariables,
  findDefinition,
  hasSmartVariables,
  splitSmartValue,
} from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SmartInput", inheritAttrs: false });

const props = withDefaults(defineProps<SmartInputProps>(), {
  value: "",
  groups: () => [],
  multiline: false,
  rows: 4,
  disabled: false,
  size: "md",
  variant: "flat",
  tone: "blue",
  defaultViewMode: "token",
  autocomplete: true,
  flagMissing: true,
});

const emit = defineEmits<{
  (event: "update:value", value: string): void;
  (event: "change", value: string): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const isEditing = ref(false);
const showPicker = ref(false);
const viewMode = ref<SmartViewMode>(props.defaultViewMode);
const pickerFilter = ref("");
const pickerPos = ref({ top: 0, left: 0, width: 0 });

const containerRef = ref<HTMLDivElement | null>(null);
const fieldRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const pickerRef = ref<HTMLDivElement | null>(null);
/** Cursor position to restore after an insertion. */
const caret = ref<number | null>(null);
/**
 * True when the picker was opened by typing `{{`. Only then does an insertion
 * replace the partial token — opening it from the button should insert at the
 * caret and leave the rest of the value alone.
 */
const autoTriggered = ref(false);

const sizeToken = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const surface = computed(() => getInputVariantTokens(props.variant));

const resolver = computed<SmartVariableResolver>(
  () => props.resolve ?? createDefaultResolver(props.groups),
);

const hasVariables = computed(() => hasSmartVariables(props.value));
const parts = computed(() => splitSmartValue(props.value));

// Counts tokens that name no known variable — a typo or a stale reference. A
// variable that exists but has no value yet is a softer state, not counted.
const missingCount = computed(() => {
  if (!props.flagMissing || !hasVariables.value) return 0;
  return extractVariables(props.value).filter((variable) =>
    props.groups.length > 0
      ? !findDefinition(props.groups, variable)
      : resolver.value(variable).state === "missing",
  ).length;
});

const update = (next: string) => {
  emit("update:value", next);
  emit("change", next);
};

// ── Picker placement ────────────────────────────────────────────────────────
const positionPicker = () => {
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;
  // Flip above when there is not enough room below, instead of running off the
  // bottom of the viewport.
  const below = window.innerHeight - rect.bottom;
  const flip = below < PICKER_HEIGHT && rect.top > below;
  pickerPos.value = {
    top: flip
      ? rect.top + window.scrollY - PICKER_HEIGHT - 4
      : rect.bottom + window.scrollY + 4,
    left: rect.left + window.scrollX,
    width: rect.width,
  };
};

// A pointer press outside both the field and the picker is what dismisses
// them. This owns the pointer case entirely, so `handleBlur` does not have to
// guess from a focus event whether the user left.
const handleOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    pickerRef.value?.contains(target) ||
    containerRef.value?.contains(target)
  ) {
    return;
  }
  isEditing.value = false;
  closePicker();
};

watch([showPicker, isEditing], ([open, editing]) => {
  if (open || editing) {
    document.addEventListener("mousedown", handleOutside);
  } else {
    document.removeEventListener("mousedown", handleOutside);
  }
});

watch(showPicker, (open) => {
  if (open) {
    positionPicker();
    // The old version measured once on open, so the panel stayed behind when
    // the page scrolled or the window resized.
    window.addEventListener("scroll", positionPicker, true);
    window.addEventListener("resize", positionPicker);
  } else {
    window.removeEventListener("scroll", positionPicker, true);
    window.removeEventListener("resize", positionPicker);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", positionPicker, true);
  window.removeEventListener("resize", positionPicker);
  document.removeEventListener("mousedown", handleOutside);
});

const openPicker = (filter = "", fromTyping = false) => {
  if (props.disabled) return;
  autoTriggered.value = fromTyping;
  pickerFilter.value = filter;
  isEditing.value = true;
  showPicker.value = true;
};

const closePicker = () => {
  autoTriggered.value = false;
  showPicker.value = false;
  pickerFilter.value = "";
};

watch(isEditing, async (editing) => {
  if (!editing) return;
  await nextTick();
  fieldRef.value?.focus();
});

// Restoring the caret after the value has landed: the old version simply
// dropped the cursor to the end after every insert.
watch(
  () => props.value,
  async () => {
    if (caret.value === null) return;
    const position = caret.value;
    caret.value = null;
    await nextTick();
    fieldRef.value?.setSelectionRange(position, position);
  },
);

const handleBlur = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null;
  // Pressing a non-focusable part of our own UI — the picker's header, a
  // label, the gap between rows — fires focusout with a null relatedTarget.
  // Reading that as "focus left the control" closed the picker whenever the
  // user clicked its own chrome. The outside-pointer listener covers the case
  // this was trying to catch, so blur only handles a *keyboard* move to some
  // other focusable element.
  if (!next) return;
  if (
    containerRef.value?.contains(next) ||
    pickerRef.value?.contains(next)
  ) {
    return;
  }
  isEditing.value = false;
  closePicker();
};

const handleSelect = (variable: SmartVariable) => {
  const field = fieldRef.value;
  const start = field?.selectionStart ?? props.value.length;
  const end = field?.selectionEnd ?? props.value.length;

  // When the picker was opened by typing `{{`, that partial token is replaced
  // rather than left behind in front of the inserted one. The previous
  // condition tested the filter and a literal `{{` suffix, so typing `{{ ` —
  // with a trailing space — produced `{{ {{ var::… }}`.
  const triggerStart = autoTriggered.value
    ? findTriggerStart(props.value, start)
    : start;

  const next =
    props.value.slice(0, triggerStart) +
    variable.fullToken +
    props.value.slice(end);
  caret.value = triggerStart + variable.fullToken.length;

  update(next);
  closePicker();
  field?.focus();
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const next = target.value;
  update(next);

  if (!props.autocomplete) return;
  const position = target.selectionStart ?? next.length;
  const before = next.slice(0, position);
  const trigger = findTriggerStart(next, position);
  const partial = before.slice(trigger);

  if (partial.startsWith("{{")) {
    // Only a name can follow the opening braces. Once the text after them
    // stops looking like one, the caret has left the token and the picker
    // should close rather than keep filtering on nonsense.
    const typed = partial.slice(2);
    if (/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(typed) && !typed.includes("\n")) {
      openPicker(typed.trim(), true);
      return;
    }
  }
  if (autoTriggered.value) {
    closePicker();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && showPicker.value) {
    event.preventDefault();
    closePicker();
  }
};

const toggleViewMode = () => {
  isEditing.value = false;
  viewMode.value = viewMode.value === "token" ? "value" : "token";
};

const containerClass = computed(() =>
  classNames(
    "group relative flex w-full transition",
    props.multiline ? "items-start" : "items-center",
    sizeToken.value.minHeight,
    // The surface comes from the shared input tokens, so this control is the
    // same box as the Input beside it. It used to hard-code
    // `bg-white border-slate-300` with no dark-mode partner at all.
    surface.value.surface,
    isEditing.value &&
      `ring-2 ring-inset ring-${props.tone}-400/60 border-${props.tone}-400`,
    props.disabled && "opacity-60",
    classAttr.value,
  ),
);

const fieldClass = computed(() =>
  classNames(
    "min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",
    sizeToken.value.text,
    sizeToken.value.pad,
    surface.value.text,
    // A multiline field scrolls, and the platform scrollbar landed hard
    // against the button column. Same thin treatment the Panel body uses,
    // plus a gutter so the two do not touch.
    props.multiline && SCROLLBAR,
  ),
);

const previewClass = computed(() =>
  classNames(
    "min-w-0 flex-1 cursor-text",
    sizeToken.value.text,
    sizeToken.value.pad,
    surface.value.text,
    props.multiline ? "whitespace-pre-wrap" : "truncate",
    props.disabled && "cursor-not-allowed",
  ),
);

const toggleLabel = computed(() =>
  viewMode.value === "token" ? "Show values" : "Show tokens",
);
</script>

<template>
  <div
    ref="containerRef"
    v-bind="restAttrs"
    :class="containerClass"
    @focusout="handleBlur"
  >
    <template v-if="isEditing && !disabled">
      <textarea
        v-if="multiline"
        ref="fieldRef"
        :rows="rows"
        :value="value"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :class="fieldClass"
        autocomplete="off"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <input
        v-else
        ref="fieldRef"
        type="text"
        :value="value"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :class="fieldClass"
        autocomplete="off"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </template>

    <div
      v-else
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="ariaLabel ?? placeholder ?? 'Edit value'"
      :class="previewClass"
      @click="!disabled && (isEditing = true)"
      @keydown.enter.prevent="isEditing = true"
      @keydown.space.prevent="isEditing = true"
    >
      <span v-if="!value" :class="classNames('italic', surface.icon)">
        {{ placeholder || "Empty" }}
      </span>
      <template v-for="part in parts" v-else :key="part.index">
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
    </div>

    <div
      :class="
        classNames('flex shrink-0 items-center gap-0.5 pr-1', multiline && 'pt-1')
      "
    >
      <span
        v-if="missingCount > 0"
        :title="`${missingCount} variable${missingCount === 1 ? '' : 's'} could not be resolved`"
        class="mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
      >
        {{ missingCount }} missing
      </span>
      <IconButton
        v-if="hasVariables"
        :icon="viewMode === 'token' ? 'EyeOpen' : 'EyeClosed'"
        variant="ghost"
        :color="tone"
        :size="sizeToken.icon"
        :disabled="disabled"
        :sr-label="toggleLabel"
        :tooltip="toggleLabel"
        @click="toggleViewMode"
      />
      <IconButton
        icon="Add"
        :variant="showPicker ? 'soft' : 'ghost'"
        :color="tone"
        :size="sizeToken.icon"
        :disabled="disabled"
        sr-label="Insert variable"
        tooltip="Insert variable"
        :aria-expanded="showPicker"
        @click="showPicker ? closePicker() : openPicker()"
      />
    </div>

    <Teleport v-if="showPicker" to="body">
      <div
        ref="pickerRef"
        :style="{
          position: 'absolute',
          top: `${pickerPos.top}px`,
          left: `${pickerPos.left}px`,
          minWidth: `${Math.max(pickerPos.width, 320)}px`,
          zIndex: 9999,
        }"
      >
        <VariablePicker
          :groups="groups"
          :resolve="resolver"
          :tone="tone"
          :size="size"
          :initial-search="pickerFilter"
          @select="handleSelect"
          @close="closePicker"
        />
      </div>
    </Teleport>
  </div>
</template>

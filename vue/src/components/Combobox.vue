<script lang="ts">
import type { VNode } from "vue";
import {
  VALIDATION_STATUSES,
  type ControlSize,
  type InputVariant,
  type TrueColor,
  type ValidationStatus,
} from "../theme/Theme";

export const COMBOBOX_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type ComboboxValidationStatus = ValidationStatus;
export type ComboboxSize = ControlSize;
export type ComboboxVariant = InputVariant;

export interface ComboboxOption {
  value: string;
  /** Falls back to `value`. */
  label?: string;
  /** Secondary line under the label. */
  description?: string;
  /** Registry icon name or a node. */
  icon?: string | VNode;
  disabled?: boolean;
}

/** A bare string is shorthand for `{ value }`. */
export type ComboboxOptionInput = string | ComboboxOption;

export interface ComboboxProps {
  value?: string;
  options: ComboboxOptionInput[];
  /** @default "md" */
  size?: ComboboxSize;
  /** Accent colour for the focus ring and the highlighted row. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `Select`. */
  color?: TrueColor;
  /** Entry style. @default "flat" */
  variant?: ComboboxVariant;
  /** @default "none" */
  validationStatus?: ComboboxValidationStatus;
  /** @deprecated Use `validationStatus="error"`. */
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Fetching options. The list shows a spinner instead of the empty message. */
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  /** Show the clear button once there is something to clear. @default true */
  clearable?: boolean;
  leadingIcon?: string | VNode;
  /** Rows to show before the list scrolls. @default 6 */
  visibleRows?: number;
  /** Classes for the field box. */
  fieldClass?: string;
  /** Classes for the drop-down. */
  listClass?: string;
  id?: string;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, useId } from "vue";
import classNames from "classnames";
import Input from "./Input.vue";
import Spinner from "./Spinner.vue";
import CustomIcon from "./CustomIcon.vue";
import { TRUE_COLORS } from "../theme/Theme";
import type { IconName } from "../icons/registry";

/**
 * A text field that suggests, without preventing.
 *
 * Renders `Input` rather than a second field implementation, so the box, the
 * sizes, the entry variants and the validation ring are the ones every other
 * control in the kit uses — the previous version drew its own `border px-3
 * py-2 text-sm` box with a hand-written 21-tone map and no size prop at all.
 */
defineOptions({ name: "Combobox", inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxProps>(), {
  value: "",
  size: "md",
  variant: "flat",
  validationStatus: "none",
  error: false,
  disabled: false,
  readOnly: false,
  loading: false,
  clearable: true,
  loadingMessage: "Loading…",
  emptyMessage: "No matching options. Keep typing to use what you entered.",
  visibleRows: 6,
});

const emit = defineEmits<{
  "update:value": [value: string];
  change: [value: string];
  /** Fired only when a row is chosen, not on every keystroke. */
  select: [option: ComboboxOption];
}>();

/**
 * Option tones, generated rather than written out.
 *
 * The table this replaces had 21 hand-written entries in which `red` painted
 * rose and `green` painted emerald — the same drift found in `Input`,
 * `Select` and `MultiSelectPills`.
 */
const buildToneClasses = (tone: TrueColor) => ({
  active: `bg-${tone}-50 text-${tone}-700 dark:bg-${tone}-500/15 dark:text-${tone}-200`,
  selected: `text-${tone}-700 dark:text-${tone}-200`,
});

const COMBOBOX_TONE_CLASSES = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, buildToneClasses(tone)]),
) as Record<TrueColor, { active: string; selected: string }>;

/** Row metrics per shared control size, so a row lines up with the field. */
const SIZE_ROW: Record<ComboboxSize, string> = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-3.5 py-2.5 text-base",
  xl: "px-4 py-3 text-base",
};

const normalise = (option: ComboboxOptionInput): ComboboxOption =>
  typeof option === "string" ? { value: option } : option;

const generatedId = useId();
const fieldId = computed(() => props.id ?? `${generatedId}-combobox`);
const listId = computed(() => `${fieldId.value}-listbox`);

const open = ref(false);
const query = ref(props.value);
const activeIndex = ref(-1);

/**
 * Suppresses the next focus-driven open.
 *
 * Committing puts focus back in the field, and focus opens the list — so
 * choosing an option re-opened the very list it had just closed.
 */
const skipNextFocusOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);

const accent = computed<TrueColor>(() => props.tone ?? props.color ?? "blue");
const toneClasses = computed(
  () => COMBOBOX_TONE_CLASSES[accent.value] ?? COMBOBOX_TONE_CLASSES.blue,
);
// `error` predates `validationStatus`; the explicit status wins.
const status = computed<ComboboxValidationStatus>(() =>
  props.validationStatus !== "none"
    ? props.validationStatus
    : props.error
      ? "error"
      : "none",
);
const rowClass = computed(() => SIZE_ROW[props.size] ?? SIZE_ROW.md);

watch(
  () => props.value,
  (next) => {
    query.value = next;
  },
);

const normalised = computed(() => props.options.map(normalise));

const filtered = computed(() => {
  if (!query.value) return normalised.value;
  const needle = query.value.toLowerCase();
  return normalised.value.filter(
    (option) =>
      option.value.toLowerCase().includes(needle) ||
      (option.label ?? "").toLowerCase().includes(needle),
  );
});

/** Rows a keyboard cursor may land on. A disabled row is skipped. */
const selectableIndexes = computed(() =>
  filtered.value
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0),
);

const showClear = computed(
  () =>
    props.clearable &&
    Boolean(query.value) &&
    !props.disabled &&
    !props.readOnly,
);

/**
 * `Input` exposes its own `<input>`, so ask for that rather than reaching
 * through `$el`: a component with more than one root node has a Text anchor
 * there, not an element, and `querySelector` on it throws.
 */
const focusField = () => {
  inputRef.value?.el?.focus();
};

const close = () => {
  open.value = false;
  activeIndex.value = -1;
};

const onPointerDown = (event: MouseEvent) => {
  if (!containerRef.value?.contains(event.target as Node)) close();
};

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener("mousedown", onPointerDown);
  else document.removeEventListener("mousedown", onPointerDown);
});

onBeforeUnmount(() => document.removeEventListener("mousedown", onPointerDown));

// Keep the cursor in view. A list that scrolls only with the mouse is not
// keyboard-navigable, however correct its `aria-activedescendant` is.
watch(activeIndex, async (index) => {
  if (!open.value || index < 0) return;
  await nextTick();
  // Optional-called: `scrollIntoView` is not implemented everywhere a
  // component tree gets rendered, and an unguarded call throws rather than
  // merely failing to scroll.
  listRef.value
    ?.querySelector(`[data-index="${index}"]`)
    ?.scrollIntoView?.({ block: "nearest" });
});

const commit = (option: ComboboxOption) => {
  if (option.disabled) return;
  query.value = option.value;
  emit("update:value", option.value);
  emit("change", option.value);
  emit("select", option);
  close();
  skipNextFocusOpen.value = true;
  focusField();
};

const step = (direction: 1 | -1) => {
  const indexes = selectableIndexes.value;
  if (indexes.length === 0) return;
  const position = indexes.indexOf(activeIndex.value);
  activeIndex.value =
    position === -1
      ? direction === 1
        ? indexes[0]
        : indexes[indexes.length - 1]
      : indexes[(position + direction + indexes.length) % indexes.length];
};

const onKeyDown = (event: KeyboardEvent) => {
  if (props.disabled || props.readOnly) return;
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!open.value) open.value = true;
      step(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!open.value) open.value = true;
      step(-1);
      break;
    case "Home":
      if (!open.value) break;
      event.preventDefault();
      activeIndex.value = selectableIndexes.value[0] ?? -1;
      break;
    case "End": {
      if (!open.value) break;
      event.preventDefault();
      const indexes = selectableIndexes.value;
      activeIndex.value = indexes[indexes.length - 1] ?? -1;
      break;
    }
    case "Enter":
      if (open.value && activeIndex.value >= 0) {
        const option = filtered.value[activeIndex.value];
        if (option) {
          event.preventDefault();
          commit(option);
        }
      }
      break;
    case "Escape":
      if (open.value) {
        event.preventDefault();
        close();
      }
      break;
    case "Tab":
      close();
      break;
    default:
      break;
  }
};

const onInput = (next: string) => {
  query.value = next;
  emit("update:value", next);
  emit("change", next);
  activeIndex.value = -1;
  if (!open.value) open.value = true;
};

const onTrailingIconClick = () => {
  if (showClear.value) {
    query.value = "";
    emit("update:value", "");
    emit("change", "");
    focusField();
    return;
  }
  if (props.disabled || props.readOnly) return;
  open.value = !open.value;
  focusField();
};

const onFocus = () => {
  if (skipNextFocusOpen.value) {
    skipNextFocusOpen.value = false;
    return;
  }
  if (!props.disabled && !props.readOnly) open.value = true;
};
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <Input
      ref="inputRef"
      v-bind="$attrs"
      :id="fieldId"
      type="text"
      :model-value="query"
      :size="size"
      :tone="accent"
      :variant="variant"
      :validation-status="status"
      :disabled="disabled"
      :readonly="readOnly"
      :placeholder="placeholder"
      :class="fieldClass"
      :leading-icon="leadingIcon"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="open ? listId : undefined"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      :aria-activedescendant="
        open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
      "
      autocomplete="off"
      :trailing-icon="showClear ? 'Close' : 'ArrowDown'"
      :trailing-icon-label="showClear ? 'Clear' : 'Show options'"
      @trailing-icon-click="onTrailingIconClick"
      @update:model-value="onInput(String($event))"
      @focus="onFocus"
      @keydown="onKeyDown"
    />

    <ul
      v-if="open && !disabled && !readOnly"
      :id="listId"
      ref="listRef"
      role="listbox"
      :aria-label="placeholder ?? 'Options'"
      :class="
        classNames(
          'absolute z-20 mt-1 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg',
          'dark:border-neutral-700 dark:bg-neutral-900',
          listClass,
        )
      "
      :style="{ maxHeight: `${visibleRows * 2.5}rem` }"
    >
      <li
        v-if="loading"
        :class="
          classNames(
            'flex items-center gap-2 text-neutral-500 dark:text-neutral-400',
            rowClass,
          )
        "
      >
        <Spinner size="xs" :color="accent" />
        {{ loadingMessage }}
      </li>

      <li
        v-else-if="filtered.length === 0"
        :class="
          classNames('italic text-neutral-500 dark:text-neutral-400', rowClass)
        "
      >
        {{ emptyMessage }}
      </li>

      <li
        v-for="(option, index) in filtered"
        v-else
        :id="`${listId}-${index}`"
        :key="option.value"
        :data-index="index"
        role="option"
        :aria-selected="option.value === value"
        :aria-disabled="option.disabled || undefined"
        :class="
          classNames(
            'flex items-center gap-2',
            rowClass,
            option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            // One class or the other, never both: two rules setting a
            // background at the same specificity are resolved by emission
            // order, which is arbitrary.
            index === activeIndex && !option.disabled
              ? toneClasses.active
              : option.value === value
                ? toneClasses.selected
                : 'text-neutral-900 dark:text-neutral-100',
            option.value === value && 'font-medium',
          )
        "
        @mousedown.prevent="commit(option)"
        @mouseenter="!option.disabled && (activeIndex = index)"
      >
        <span v-if="option.icon" class="inline-flex shrink-0 items-center">
          <CustomIcon
            v-if="typeof option.icon === 'string'"
            :icon="option.icon as IconName"
            :custom-size="16"
          />
          <component :is="option.icon" v-else />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate">{{ option.label ?? option.value }}</span>
          <span
            v-if="option.description"
            class="block truncate text-xs text-neutral-500 dark:text-neutral-400"
          >
            {{ option.description }}
          </span>
        </span>
        <CustomIcon
          v-if="option.value === value"
          icon="Check"
          :custom-size="16"
          class="shrink-0"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { VNode } from "vue";
import {
  TRUE_COLORS,
  getInputVariantTokens,
  stripBorderColor,
} from "../theme/Theme";
import { VALIDATION_STATUSES } from "../theme/Theme";
import type { ControlSize, InputVariant, TrueColor } from "../theme/Theme";

/** @deprecated Use `VALIDATION_STATUSES` from the theme. Kept as an alias. */
export const SELECT_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type SelectValidationStatus =
  (typeof SELECT_VALIDATION_STATUSES)[number];

/**
 * The shared control scale, so a Select lines up with the Input, SearchBar and
 * Button beside it. Was a local `"sm" | "md" | "lg"`.
 */
export type SelectSize = ControlSize;

/**
 * The same surfaces `Input`, `SearchBar` and `InputGroup` offer. A Select was
 * hardcoded to `rounded-lg border border-neutral-300 bg-white shadow-sm`, so it
 * was the one control in a form that could not be made to match the rest.
 */
export type SelectVariant = InputVariant;

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list. The hand-written map this replaces
// pointed `gray`, `zinc` and `stone` at `neutral-500` classes, so three of the
// five neutral tones silently rendered as a fourth.

type SelectToneTokens = {
  /** Border colour while the select has focus. */
  focusBorder: string;
  /** Glow ring while the select has focus. */
  focusRing: string;
  /** Caret and leading-icon colour while the select has focus. */
  icon: string;
};

const buildToneTokens = (color: TrueColor): SelectToneTokens => ({
  focusBorder: `focus-within:border-${color}-400`,
  // Inset, matching Input and SearchBar. An outer ring is painted outside the
  // border box, so any ancestor with `overflow: auto|hidden` clips it.
  focusRing: `focus-within:ring-2 focus-within:ring-inset focus-within:ring-${color}-400/60`,
  icon: `group-focus-within:text-${color}-500`,
});

const TONE_TOKENS: Record<TrueColor, SelectToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, SelectToneTokens>;

const getToneTokens = (color: TrueColor): SelectToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Sizing ────────────────────────────────────────────────────────────────────

/** Padding and type scale, mirroring `Input`'s so the two line up stacked. */
const SIZE_STYLES: Record<
  ControlSize,
  {
    px: string;
    py: string;
    /** `underline` has no box to inset from, and needs room above the rule. */
    underlinePy: string;
    text: string;
    icon: ControlSize;
    /**
     * Line height the popup options keep, mirroring `text` above. The select
     * itself is forced to `leading-6` (see `BOXED_VALUE_LEADING`) to center
     * its value, and the options inherit — so they pin their own line height
     * back to the natural one, or the dropdown rows would grow 4px.
     */
    optionLine: string;
  }
> = {
  xs: { px: "px-2", py: "py-1", underlinePy: "pt-1 pb-2", text: "text-xs", icon: "xs", optionLine: "[&>option]:leading-4" },
  sm: { px: "px-2.5", py: "py-1.5", underlinePy: "pt-1.5 pb-2.5", text: "text-xs", icon: "xs", optionLine: "[&>option]:leading-4" },
  md: { px: "px-3", py: "py-2", underlinePy: "pt-2 pb-3", text: "text-sm", icon: "sm", optionLine: "[&>option]:leading-5" },
  lg: { px: "px-4", py: "py-2.5", underlinePy: "pt-2.5 pb-3.5", text: "text-base", icon: "sm", optionLine: "[&>option]:leading-6" },
  xl: { px: "px-5", py: "py-3", underlinePy: "pt-3 pb-4", text: "text-base", icon: "sm", optionLine: "[&>option]:leading-6" },
};

/**
 * The value of a single-choice select is drawn by the platform, centered
 * within the select's *intrinsic* content region — a 24px box at the kit's
 * font sizes — not within the CSS line box. With the natural line heights
 * (16–24px) the line box is shorter than that region, so the value sat 2.5px
 * high at `md` and 4px high at `xs`/`sm` (measured against the box centre;
 * an `Input` beside it sat dead-centre). Forcing the line box to the region's
 * height makes the platform centre the value in every size, and the control's
 * height is unchanged because the region — not the line box — drives it.
 *
 * Skipped for `underline` (the value intentionally sits clear of the rule,
 * not centred in a box) and `multiple` (a list, not a single value).
 */
const BOXED_VALUE_LEADING = "leading-6";

/**
 * Border only at rest; the ring is part of the focus state, exactly as it is
 * for the tone tokens. A status used to add a bare `ring-2 ring-inset` at rest
 * with no ring *colour* — an unset ring colour resolves to `currentColor`, so
 * every errored or successful field carried a near-black 2px halo inside its
 * coloured border.
 *
 * These also carry no copy colour. The old version forced
 * `text-neutral-900 dark:text-neutral-100` alongside the border, so an errored
 * `underline` or `glass` field lost the high-contrast pair it needs to stay
 * legible over a backdrop.
 */
const STATUS_CLASSES: Record<Exclude<SelectValidationStatus, "none">, string> = {
  error:
    "border-rose-500 dark:border-rose-400 focus-within:border-rose-500 dark:focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-500/60 dark:focus-within:ring-rose-400/60",
  success:
    "border-emerald-500 dark:border-emerald-400 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500/60 dark:focus-within:ring-emerald-400/60",
};

/**
 * The dropdown itself is painted by the platform from the `<select>`'s own
 * background. Once the surface moves to the wrapper the select is transparent,
 * which would leave the open list white in dark mode — so the options carry
 * their own fill.
 */
const OPTION_CLASSES =
  "[&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-900 dark:[&>option]:text-neutral-100 [&>optgroup]:bg-white dark:[&>optgroup]:bg-neutral-900";

/**
 * Opts the control into a real, stylable dropdown where the browser supports
 * one (`appearance: base-select`, Chrome 135+); see the `.ui-select` block in
 * `styles.css`. Everywhere else the class matches nothing and the platform
 * popup is used, with the fills above.
 */
const PICKER_CLASS = "ui-select";

export interface SelectProps {
  modelValue?: string;
  /** @default "md" */
  size?: SelectSize;
  /** Accent colour for the focus border, ring and icon highlight. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `SearchBar`. */
  color?: TrueColor;
  /** Visual surface style. @default "flat" */
  variant?: SelectVariant;
  /** @default "none" */
  validationStatus?: SelectValidationStatus;
  placeholder?: string;
  leadingIcon?: string | VNode;
  /** Hides the drop-down caret. Always hidden for `multiple`. */
  hideCaret?: boolean;
  /** Classes for the inner `<select>` element itself. */
  selectClassName?: string;
  /** Drops the surface entirely — used by `InputGroup`. */
  unstyled?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}
</script>

<script setup lang="ts">
import { computed, isVNode, ref } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Select", inheritAttrs: false, __UI_SELECT: true });

const props = withDefaults(defineProps<SelectProps>(), {
  size: "md",
  variant: "flat",
  validationStatus: "none",
  hideCaret: false,
  unstyled: false,
  disabled: false,
  multiple: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [event: Event];
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIconFn = useIconRenderer();

const el = ref<HTMLSelectElement | null>(null);
defineExpose({ el });

const effectiveTone = computed(() => props.tone ?? props.color ?? "blue");
const sizeToken = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const tokens = computed(() => getToneTokens(effectiveTone.value));
const variantTokens = computed(() => getInputVariantTokens(props.variant));
const isUnderline = computed(() => props.variant === "underline");
const hasStatus = computed(() => props.validationStatus !== "none");
const showCaret = computed(() => !props.hideCaret && !props.multiple);

const statusIconClass = computed(() =>
  classNames(
    props.validationStatus === "error" && "text-rose-500 dark:text-rose-400",
    props.validationStatus === "success" &&
      "text-emerald-500 dark:text-emerald-400",
  ),
);

const iconClass = computed(() =>
  classNames(
    "pointer-events-none inline-flex shrink-0 items-center transition-colors",
    // Resting colour from the variant, focus accent from the tone. The old
    // caret was tone-coloured at rest and never changed.
    variantTokens.value.icon,
    !hasStatus.value && tokens.value.icon,
    statusIconClass.value,
  ),
);

const fieldClass = computed(() =>
  classNames(
    "group relative flex w-full transition",
    props.multiple ? "items-stretch" : "items-center",
    !props.unstyled &&
      (hasStatus.value
        ? stripBorderColor(variantTokens.value.surface)
        : variantTokens.value.surface),
    // Underline drops the horizontal padding — there is no box to inset from —
    // and gains a little extra below, so the text is not sitting on the rule.
    isUnderline.value
      ? sizeToken.value.underlinePy
      : classNames(sizeToken.value.px, sizeToken.value.py),
    !props.unstyled && !hasStatus.value && tokens.value.focusBorder,
    // A ring around a borderless underline reads as a stray box.
    !props.unstyled &&
      !isUnderline.value &&
      !hasStatus.value &&
      tokens.value.focusRing,
    !props.unstyled &&
      hasStatus.value &&
      STATUS_CLASSES[
        props.validationStatus as Exclude<SelectValidationStatus, "none">
      ],
    // Opacity, not a neutral fill: `disabled:bg-neutral-100` was a
    // same-specificity fight with every variant's own fill, and it turned a
    // glass or underline select into an opaque grey slab.
    props.disabled && "cursor-not-allowed opacity-60",
    classAttr.value,
  ),
);

const selectClass = computed(() =>
  classNames(
    // `appearance-none` hides the platform caret so ours is the only one.
    "min-w-0 flex-1 appearance-none border-none bg-transparent p-0 outline-none",
    sizeToken.value.text,
    // After `sizeToken.text` on purpose: it overrides that line height so
    // the platform centres the value (see `BOXED_VALUE_LEADING`).
    !isUnderline.value && !props.multiple && BOXED_VALUE_LEADING,
    variantTokens.value.text,
    OPTION_CLASSES,
    sizeToken.value.optionLine,
    PICKER_CLASS,
    "disabled:cursor-not-allowed",
    props.multiple && "min-h-[3.25rem]",
    props.selectClassName,
  ),
);

/**
 * Drives the styled picker's hover and selected colours. Tailwind v4 exposes
 * every palette entry as a CSS variable, so the tone travels as a variable
 * reference rather than a generated class — nothing to safelist, and the
 * stylesheet stays colour-agnostic.
 */
const pickerAccent = computed(() => ({
  "--ui-select-accent": `var(--color-${effectiveTone.value}-500)`,
  "--ui-select-accent-strong": `var(--color-${effectiveTone.value}-700)`,
  "--ui-select-accent-soft": `var(--color-${effectiveTone.value}-300)`,
}));

const leadingNodes = computed(() => {
  if (!props.leadingIcon) return null;
  if (isVNode(props.leadingIcon)) return props.leadingIcon;
  return renderIconFn(props.leadingIcon, sizeToken.value.icon);
});

const selectAttrs = computed(() => {
  const attrs: Record<string, unknown> = {
    ...restAttrs.value,
    // After the spread, so a caller cannot leave a select that reports itself
    // as valid while showing the error surface.
    "aria-invalid":
      props.validationStatus === "error"
        ? "true"
        : (restAttrs.value["aria-invalid"] as string | undefined),
  };
  if (props.modelValue !== undefined) {
    attrs.value = props.modelValue;
  } else if (props.placeholder !== undefined && !props.multiple) {
    // A `hidden disabled` first option is not what the browser lands on: it
    // picks the first *selectable* option instead, so the placeholder never
    // appeared unless the caller also bound an empty value.
    attrs.value = "";
  }
  return attrs;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
  emit("change", event);
};

/**
 * The caret and the wrapper's padding are *outside* the `<select>` — a click
 * on them lands on the wrapper span and nothing happened, so only the middle
 * strip of the box opened the dropdown. Route any wrapper click the select
 * did not get to `showPicker()` (a real click carries the user activation it
 * needs). Clicks that land on the select itself are left to the platform,
 * and `multiple` has no popup to open.
 */
const handleWrapperClick = (event: MouseEvent) => {
  const select = el.value;
  if (!select || props.disabled || props.multiple || event.target === select)
    return;
  const showPicker = (
    select as HTMLSelectElement & { showPicker?: () => void }
  ).showPicker;
  if (typeof showPicker === "function") {
    try {
      showPicker.call(select);
      return;
    } catch {
      // No activation or the platform refused — fall back to focusing,
      // which is still better than the click being lost.
    }
  }
  select.focus();
};
</script>

<template>
  <span :class="fieldClass" @click="handleWrapperClick">
    <span v-if="leadingIcon" :class="classNames(iconClass, 'mr-2')">
      <VNodeRenderer :nodes="leadingNodes" />
    </span>

    <select
      ref="el"
      :class="selectClass"
      :style="pickerAccent"
      :disabled="disabled"
      :multiple="multiple"
      v-bind="selectAttrs"
      @change="handleChange"
    >
      <option
        v-if="placeholder !== undefined || $slots.placeholder"
        value=""
        disabled
        hidden
      >
        <slot name="placeholder">{{ placeholder }}</slot>
      </option>
      <slot />
    </select>

    <span v-if="showCaret" :class="classNames(iconClass, 'ml-2')">
      <VNodeRenderer :nodes="renderIconFn('ArrowDown', sizeToken.icon)" />
    </span>
  </span>
</template>

<script lang="ts">
import type { VNode } from "vue";
import {
  TRUE_COLORS,
  VALIDATION_STATUSES,
  getGlowTokens,
  getInputVariantTokens,
  stripBorderColor,
  resolveGlowGradient,
} from "../theme/Theme";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
} from "../theme/Theme";

/** @deprecated Use `VALIDATION_STATUSES` from the theme. Kept as an alias. */
export const INPUT_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type InputValidationStatus =
  (typeof INPUT_VALIDATION_STATUSES)[number];
export type InputValidationStatusType = InputValidationStatus;

/**
 * The shared control scale, so an Input lines up with the Button, SearchBar and
 * Select beside it. Was a local `"sm" | "md" | "lg"`, which left `xs` and `xl`
 * unreachable even though every sibling control offered them.
 */
export type InputSize = ControlSize;

/**
 * Re-exported from the theme, where the surfaces live, so `Input`, `Textarea`
 * and `SearchBar` cannot drift apart.
 */
export type { InputVariant };

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list rather than hand-written. The map
// this replaces had 21 entries typed out by hand and two of them were wrong:
// `red` emitted `rose-400`/`rose-500` classes and `green` emitted `emerald-*`,
// so those two tones silently rendered as a different colour.

type InputToneTokens = {
  /** Border colour while anything inside the field has focus. */
  focusBorder: string;
  /** Glow ring while anything inside the field has focus. */
  focusRing: string;
  /** Leading/trailing icon colour while the field has focus. */
  icon: string;
  /** Focus ring for the inline trailing button. */
  buttonFocusRing: string;
};

const buildToneTokens = (color: TrueColor): InputToneTokens => ({
  focusBorder: `focus-within:border-${color}-400`,
  // Inset, matching SearchBar. An outer ring is painted outside the border box,
  // so any ancestor with `overflow: auto|hidden` clips it — `Panel`'s body is
  // `overflow-auto` by default, which shears the ring off and leaves hard
  // square corners.
  focusRing: `focus-within:ring-2 focus-within:ring-inset focus-within:ring-${color}-400/60`,
  icon: `group-focus-within:text-${color}-500`,
  buttonFocusRing: `focus-visible:ring-${color}-400/60`,
});

const TONE_TOKENS: Record<TrueColor, InputToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, InputToneTokens>;

const getToneTokens = (color: TrueColor): InputToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Sizing ────────────────────────────────────────────────────────────────────

/** Padding and type scale, mirroring `SearchBar` so the two line up stacked. */
const SIZE_STYLES: Record<
  ControlSize,
  {
    px: string;
    py: string;
    /** `underline` has no box to inset from, and needs room above the rule. */
    underlinePy: string;
    text: string;
    icon: ControlSize;
    /** Inline trailing button. */
    button: string;
  }
> = {
  xs: { px: "px-2", py: "py-1", underlinePy: "pt-1 pb-2", text: "text-xs", icon: "xs", button: "h-4 w-4" },
  sm: { px: "px-2.5", py: "py-1.5", underlinePy: "pt-1.5 pb-2.5", text: "text-xs", icon: "xs", button: "h-5 w-5" },
  md: { px: "px-3", py: "py-2", underlinePy: "pt-2 pb-3", text: "text-sm", icon: "sm", button: "h-5 w-5" },
  lg: { px: "px-4", py: "py-2.5", underlinePy: "pt-2.5 pb-3.5", text: "text-base", icon: "sm", button: "h-6 w-6" },
  xl: { px: "px-5", py: "py-3", underlinePy: "pt-3 pb-4", text: "text-base", icon: "sm", button: "h-6 w-6" },
};

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
const STATUS_CLASSES: Record<Exclude<InputValidationStatus, "none">, string> = {
  error:
    "border-rose-500 dark:border-rose-400 focus-within:border-rose-500 dark:focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-500/60 dark:focus-within:ring-rose-400/60",
  success:
    "border-emerald-500 dark:border-emerald-400 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500/60 dark:focus-within:ring-emerald-400/60",
};

export interface InputProps {
  /** Current value of the input (v-model). */
  modelValue?: string;
  /** @default "md" */
  size?: InputSize;
  /** Accent colour for the focus border, ring and icon highlight. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `SearchBar`'s prop name. */
  color?: TrueColor;
  /** Visual surface style. @default "flat" */
  variant?: InputVariant;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: InputValidationStatus;
  leadingIcon?: string | VNode;
  trailingIcon?: string | VNode;
  /** Renders the trailing icon as a button rather than a static decoration. */
  onTrailingIconClick?: (event: MouseEvent) => void;
  /** Accessible name for that button. @default "Input action" */
  trailingIconLabel?: string;
  /** @deprecated Use the `class` attribute, which is now the box. */
  wrapperClassName?: string;
  /** Classes for the inner `<input>` element itself. */
  inputClassName?: string;
  /** Drops the surface entirely — used by `InputGroup`. */
  unstyled?: boolean;
  fullHeight?: boolean;
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Input", inheritAttrs: false, __UI_INPUT: true });

const props = withDefaults(defineProps<InputProps>(), {
  size: "md",
  variant: "flat",
  glowIntensity: "soft",
  validationStatus: "none",
  trailingIconLabel: "Input action",
  unstyled: false,
  fullHeight: false,
  disabled: false,
});

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el });

const focused = ref(false);

const effectiveTone = computed(() => props.tone ?? props.color ?? "blue");
const sizeToken = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const tokens = computed(() => getToneTokens(effectiveTone.value));
const variantTokens = computed(() => getInputVariantTokens(props.variant));
const isUnderline = computed(() => props.variant === "underline");
const hasStatus = computed(() => props.validationStatus !== "none");

const glow = computed(() => getGlowTokens(props.glowIntensity));
const glowGradient = computed(() =>
  resolveGlowGradient(effectiveTone.value, props.gradientFrom, props.gradientTo),
);
const glowStyle = computed(() => ({
  background: `linear-gradient(to right, ${glowGradient.value[0]}, ${glowGradient.value[1]})`,
  opacity: focused.value
    ? glow.value.focusOpacity
    : glow.value.idleOpacity,
}));

const isGradient = computed(() => props.variant === "gradient" && !props.unstyled);

const statusIconClass = computed(() =>
  classNames(
    props.validationStatus === "error" && "text-rose-500 dark:text-rose-400",
    props.validationStatus === "success" &&
      "text-emerald-500 dark:text-emerald-400",
  ),
);

const iconClass = computed(() =>
  classNames(
    // Resting colour from the variant, focus accent from the tone. These do not
    // collide because the tone class is prefixed — the old code applied an
    // unprefixed `text-{tone}-500` next to the variant's own `text-*`, and
    // which one won was decided by emission order.
    variantTokens.value.icon,
    !hasStatus.value && tokens.value.icon,
    statusIconClass.value,
  ),
);

const leadingClass = computed(() =>
  classNames(
    "mr-2 inline-flex shrink-0 items-center transition-colors",
    iconClass.value,
  ),
);

const trailingClass = computed(() =>
  classNames(
    "pointer-events-none ml-2 inline-flex shrink-0 items-center transition-colors",
    iconClass.value,
  ),
);

const trailingButtonClass = computed(() =>
  classNames(
    "ml-2 inline-flex shrink-0 items-center justify-center rounded transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    sizeToken.value.button,
    tokens.value.buttonFocusRing,
    variantTokens.value.icon,
    !hasStatus.value && "hover:text-neutral-700 dark:hover:text-neutral-200",
    statusIconClass.value,
    "disabled:cursor-not-allowed",
  ),
);

const fieldClass = computed(() =>
  classNames(
    "group relative flex w-full items-center transition",
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
      STATUS_CLASSES[props.validationStatus as Exclude<InputValidationStatus, "none">],
    // Opacity, not a neutral fill: `disabled:bg-neutral-100` was a
    // same-specificity fight with every variant's own fill, and it turned a
    // glass or underline field into an opaque grey slab.
    props.disabled && "cursor-not-allowed opacity-60",
    props.fullHeight && "h-full",
    props.wrapperClassName,
    // The surface moved from the `<input>` to its wrapper (matching SearchBar),
    // so the caller's class lands on the element that carries the border, fill
    // and radius — except under `gradient`, where the outer glow box takes it.
    !isGradient.value && classAttr.value,
  ),
);

const inputClass = computed(() =>
  classNames(
    "min-w-0 flex-1 border-none bg-transparent p-0 outline-none",
    sizeToken.value.text,
    variantTokens.value.text,
    "disabled:cursor-not-allowed",
    props.fullHeight && "h-full",
    props.inputClassName,
  ),
);

const glowWrapperClass = computed(() =>
  classNames(
    "relative flex w-full",
    glow.value.pad,
    props.fullHeight && "h-full",
    classAttr.value,
  ),
);

const glowLayerClass = computed(() =>
  classNames(
    "absolute rounded-2xl leading-none transition-opacity duration-500",
    glow.value.inset,
    glow.value.blur,
  ),
);

const ariaInvalid = computed(() =>
  props.validationStatus === "error"
    ? "true"
    : (restAttrs.value["aria-invalid"] as
        | boolean
        | "true"
        | "false"
        | "grammar"
        | "spelling"
        | undefined),
);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <!-- The gradient variant is the same field with a coloured glow behind it,
       matching Textarea and SearchBar. `glow.pad` keeps the halo inside the
       component's own box, so a clipping ancestor cannot shear it off. Vue's
       Input had the `gradient` surface but never painted the glow at all.

       `display: contents` on the non-gradient branch keeps one element in the
       template without adding a box to the layout — a dynamic `<component
       :is="'template'">` is not a thing. -->
  <span :class="isGradient ? glowWrapperClass : 'contents'">
    <span
      v-if="isGradient"
      :class="glowLayerClass"
      :style="glowStyle"
      aria-hidden="true"
    />
    <span :class="fieldClass">
      <span v-if="leadingIcon" :class="leadingClass">
        <VNodeRenderer
          :nodes="
            typeof leadingIcon === 'string'
              ? renderIcon(leadingIcon, sizeToken.icon)
              : leadingIcon
          "
        />
      </span>

      <input
        ref="el"
        v-bind="restAttrs"
        :class="inputClass"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="ariaInvalid"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />

      <button
        v-if="trailingIcon && onTrailingIconClick"
        type="button"
        :class="trailingButtonClass"
        :disabled="disabled"
        :aria-label="trailingIconLabel"
        @click="onTrailingIconClick"
      >
        <VNodeRenderer
          :nodes="
            typeof trailingIcon === 'string'
              ? renderIcon(trailingIcon, sizeToken.icon)
              : trailingIcon
          "
        />
      </button>
      <span v-else-if="trailingIcon" :class="trailingClass">
        <VNodeRenderer
          :nodes="
            typeof trailingIcon === 'string'
              ? renderIcon(trailingIcon, sizeToken.icon)
              : trailingIcon
          "
        />
      </span>
    </span>
  </span>
</template>

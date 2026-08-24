<script lang="ts">
import { TRUE_COLORS, getInputVariantTokens } from "../theme/Theme";
import type { ControlSize, InputVariant, TrueColor } from "../theme/Theme";

export const INPUT_GROUP_VALIDATION_STATUSES = [
  "none",
  "error",
  "success",
] as const;
export type InputGroupValidationStatus =
  (typeof INPUT_GROUP_VALIDATION_STATUSES)[number];

/** The shared control scale, so a group lines up with the Button beside it. */
export type InputGroupSize = ControlSize;

/**
 * The same surfaces `Input`, `SearchBar` and `Checkbox` offer. The group owns
 * the box now — its children render `unstyled` — so the variant has to live
 * here or a group could never be anything but an opaque white card.
 */
export type InputGroupVariant = InputVariant;

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list. The map this replaces had six
// entries — indigo, blue, emerald, amber, rose, slate — and fell back to
// `toneTokens.neutral`, which was not one of them. So for the other fifteen
// tones the lookup produced `undefined` and the next line threw
// `Cannot read properties of undefined (reading 'ring')`: a hard crash, not a
// wrong colour.

type InputGroupToneTokens = {
  /**
   * Resting edge around the whole group. An `outline`, not a `ring`: a ring is
   * painted in the element's own background layer, so the addons — which sit
   * flush against the group's edges with opaque fills of their own — paint
   * straight over it. The focus indicator was only visible in the gap between
   * them, reading as a bar across the middle rather than an edge around the
   * control. Outlines are painted after all descendants, so they survive.
   */
  ring: string;
  /** The same edge, thicker, while anything inside has focus. */
  focusRing: string;
  /**
   * `underline` has no box, so it takes the focus on its bottom rule instead —
   * a full rectangle around it would contradict the variant, and is what a
   * standalone underline `Input` deliberately avoids.
   */
  focusBorder: string;
  /** Addon fill, border and copy. */
  addon: string;
};

const buildToneTokens = (color: TrueColor): InputGroupToneTokens => ({
  ring: `outline-${color}-200/70 dark:outline-${color}-500/30`,
  focusRing: `focus-within:outline-${color}-400 dark:focus-within:outline-${color}-400`,
  focusBorder: `focus-within:border-${color}-400`,
  addon: [
    `bg-${color}-50/80 border-${color}-200 text-${color}-700`,
    `dark:bg-${color}-500/15 dark:border-${color}-500/40 dark:text-${color}-200`,
  ].join(" "),
});

const TONE_TOKENS: Record<TrueColor, InputGroupToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, InputGroupToneTokens>;

const getToneTokens = (color: TrueColor): InputGroupToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Sizing ────────────────────────────────────────────────────────────────────

/** Addon padding and type, mirroring `Input`'s so the two halves line up. */
const SIZE_STYLES: Record<ControlSize, { padding: string; text: string }> = {
  xs: { padding: "px-2", text: "text-xs" },
  sm: { padding: "px-2.5", text: "text-xs" },
  md: { padding: "px-3", text: "text-sm" },
  lg: { padding: "px-4", text: "text-base" },
  xl: { padding: "px-5", text: "text-base" },
};

const STATUS_RING: Record<
  Exclude<InputGroupValidationStatus, "none">,
  string
> = {
  error:
    "outline-rose-400/70 focus-within:outline-rose-500 dark:outline-rose-400/40 dark:focus-within:outline-rose-400",
  success:
    "outline-emerald-400/70 focus-within:outline-emerald-500 dark:outline-emerald-400/40 dark:focus-within:outline-emerald-400",
};

/** The same states expressed on a bottom rule, for `underline`. */
const STATUS_BORDER: Record<
  Exclude<InputGroupValidationStatus, "none">,
  string
> = {
  error: "border-rose-500 dark:border-rose-400",
  success: "border-emerald-500 dark:border-emerald-400",
};

export interface InputGroupProps {
  leadingAddon?: string;
  trailingAddon?: string;
  /** @default "blue" */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `SearchBar`. */
  color?: TrueColor;
  /** Surface treatment of the group box. @default "elevated" */
  variant?: InputGroupVariant;
  /** @default "md" */
  size?: InputGroupSize;
  /** @default "none" */
  validationStatus?: InputGroupValidationStatus;
  disabled?: boolean;
}

const ADDON_BASE =
  "inline-flex min-w-0 shrink-0 items-center whitespace-nowrap border border-transparent font-medium";
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  isVNode,
  useSlots,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "InputGroup" });

const props = withDefaults(defineProps<InputGroupProps>(), {
  variant: "elevated",
  size: "md",
  validationStatus: "none",
  disabled: false,
});

const slots = useSlots();

const effectiveTone = computed(() => props.tone ?? props.color ?? "blue");
const toneToken = computed(() => getToneTokens(effectiveTone.value));
const sizeToken = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const variantTokens = computed(() => getInputVariantTokens(props.variant));
const hasStatus = computed(() => props.validationStatus !== "none");
const isUnderline = computed(() => props.variant === "underline");

const isAttachableChild = (child: VNodeChild) => {
  if (!isVNode(child)) {
    return false;
  }
  const type = child.type as { __UI_INPUT?: boolean; __UI_SELECT?: boolean };
  return Boolean(type && (type.__UI_INPUT || type.__UI_SELECT));
};

const attachChildProps = (child: VNodeChild): VNodeChild => {
  if (!isVNode(child) || !isAttachableChild(child)) {
    return child;
  }

  return cloneVNode(child, {
    tone: effectiveTone.value,
    size: props.size,
    unstyled: true,
    // `disabled` used to stop at the group's `opacity-60`, which dims a field
    // that is still perfectly editable. A child's own `disabled` still wins, so
    // one field in an enabled group can be locked on its own.
    disabled: props.disabled || child.props?.disabled === true,
  });
};

const enhancedChildren = (): VNodeChild[] =>
  (slots.default?.() ?? []).map(attachChildProps);

const groupClasses = computed(() =>
  classNames(
    "flex w-full items-stretch overflow-hidden transition",
    variantTokens.value.surface,
    // `-outline-offset-*` keeps it inside the rounded corner rather than
    // squaring off around it.
    !isUnderline.value &&
      "outline outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2",
    !isUnderline.value &&
      (hasStatus.value
        ? STATUS_RING[
            props.validationStatus as Exclude<InputGroupValidationStatus, "none">
          ]
        : classNames(toneToken.value.ring, toneToken.value.focusRing)),
    isUnderline.value &&
      (hasStatus.value
        ? STATUS_BORDER[
            props.validationStatus as Exclude<InputGroupValidationStatus, "none">
          ]
        : toneToken.value.focusBorder),
    props.disabled && "cursor-not-allowed opacity-60",
  ),
);

const addonClasses = computed(() =>
  classNames(
    ADDON_BASE,
    // The base used to carry a fixed `text-sm` next to the size token's own
    // `text-*`, so which one applied at `lg` was decided by emission order.
    sizeToken.value.text,
    sizeToken.value.padding,
    toneToken.value.addon,
  ),
);

const hasLeading = computed(
  () => props.leadingAddon !== undefined || Boolean(slots.leadingAddon),
);
const hasTrailing = computed(
  () => props.trailingAddon !== undefined || Boolean(slots.trailingAddon),
);
</script>

<template>
  <div
    :class="groupClasses"
    :data-disabled="String(disabled)"
    :data-status="validationStatus"
  >
    <span v-if="hasLeading" :class="classNames(addonClasses, 'border-r')">
      <slot name="leadingAddon">{{ leadingAddon }}</slot>
    </span>
    <div class="flex min-w-0 flex-1 items-center">
      <VNodeRenderer :nodes="enhancedChildren()" />
    </div>
    <span v-if="hasTrailing" :class="classNames(addonClasses, 'border-l')">
      <slot name="trailingAddon">{{ trailingAddon }}</slot>
    </span>
  </div>
</template>

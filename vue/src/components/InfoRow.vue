<script lang="ts">
import {
  PLAIN_SURFACE_VARIANTS,
  type ControlSize,
  type PlainSurfaceVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Every container surface, plus `plain` for a row dropped straight into a card
 * the app already owns — which is where an `InfoRow` normally lives, so it is
 * the default.
 */
export const INFO_ROW_VARIANTS = PLAIN_SURFACE_VARIANTS;
export type InfoRowVariant = PlainSurfaceVariant;

/** The shared control scale. Was a component-local `xs | sm | md | lg`. */
export type InfoRowSize = ControlSize;
/** The shared container padding scale. Was a component-local eight-member list. */
export type InfoRowPadding = SurfacePadding;
/** How a row reports that it is still waiting for its value. */
export const INFO_ROW_LOADERS = ["skeleton", "spinner"] as const;
export type InfoRowLoader = (typeof INFO_ROW_LOADERS)[number];

export interface InfoRowProps {
  /** Row label (left side). Use the `label` slot for composed/styled labels. */
  label?: string;
  /**
   * Override label text size independently from `size`.
   * When omitted the shared `size` prop drives label size.
   */
  labelSize?: InfoRowSize;
  /**
   * Extra classes for the label span. A text colour here replaces the row's
   * own rather than racing it — see `hasTextColor`.
   */
  labelClassName?: string;
  /**
   * Fixed width class for the label column (e.g. `"w-32"`).
   * Defaults to a size-appropriate width (`w-16` … `w-32`).
   * Pass `""` to let the label size naturally.
   */
  labelWidth?: string;
  /**
   * Row value (right side).
   * - `string` / `number` — rendered as text, copy button enabled automatically.
   * - `boolean` — rendered as "Yes" / "No" with copy enabled.
   * - `value` slot — rendered as-is, copy button suppressed.
   * - `null` / `undefined` / `''` — treated as empty (see `hideIfEmpty`).
   */
  value?: string | number | boolean | null;
  /**
   * Override value text size independently from `size`.
   * When omitted the shared `size` prop drives value size.
   */
  valueSize?: InfoRowSize;
  /**
   * Extra classes for the value span. A text colour here replaces the row's
   * own rather than racing it.
   */
  valueClassName?: string;
  /** Controls both label and value text size when individual overrides are absent. @default "md" */
  size?: InfoRowSize;
  /**
   * The surface the row draws for itself. `plain` draws none — just the
   * hairline — which is right for a row inside an existing card. @default "plain"
   */
  variant?: InfoRowVariant;
  /** Accent for the hover wash, the focus ring and the glass tint. @default "blue" */
  tone?: TrueColor;
  /** Corner radius when `variant` is not `plain`. */
  corner?: SurfaceCorner;
  /** Vertical padding override. When omitted, padding is derived from `size`. */
  padding?: InfoRowPadding;
  /**
   * Show a copy-to-clipboard button.
   * Shown automatically when the resolved value is a string or number. @default true
   */
  copyable?: boolean;
  /** Render the value in a monospace font. */
  mono?: boolean;
  /**
   * Hide the row entirely when `value` is `null`, `undefined`, or `''`.
   * Set to `false` to show the `emptyText` placeholder instead. @default true
   */
  hideIfEmpty?: boolean;
  /** Placeholder shown when `hideIfEmpty` is `false` and the value is empty. @default "—" */
  emptyText?: string;
  /** Allow the value to wrap to multiple lines instead of truncating. */
  wrap?: boolean;
  /**
   * Show a tooltip with the full value when the text is truncated.
   * Only active when `wrap` is `false` and the value is a string or number. @default true
   */
  tooltipOnTruncate?: boolean;
  /** The value is still being fetched: render a placeholder in its place. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: InfoRowLoader;
  /**
   * Something went wrong fetching this value. Replaces the value, and is
   * announced — a row that silently shows "—" for a failed lookup is
   * indistinguishable from one that is genuinely empty.
   */
  error?: string;
  /** Remove the bottom hairline (e.g. for a last row handled externally). */
  noBorder?: boolean;
  /** Remove the default horizontal padding. */
  noPadding?: boolean;
  /** Add a hover wash and rounded corners, in the row's own `tone`. */
  hoverable?: boolean;
  /** Glass fill transparency, when `variant` is a glass one. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, when `variant` is a glass one. */
  vibrancy?: GlassVibrancy;
}

// ── Size tokens ───────────────────────────────────────────────────────────────

type SizeToken = {
  defaultPadding: string;
  horizontalPadding: string;
  defaultLabelWidth: string;
  text: string;
  gap: string;
  /** Height of a skeleton bar, so the placeholder matches the real row. */
  bar: string;
  iconSize: ControlSize;
};

const sizeTokens: Record<InfoRowSize, SizeToken> = {
  xs: {
    defaultPadding: "py-1",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-16",
    text: "text-[11px]",
    gap: "gap-2",
    bar: "h-2",
    iconSize: "xs",
  },
  sm: {
    defaultPadding: "py-1.5",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-20",
    text: "text-xs",
    gap: "gap-2",
    bar: "h-2.5",
    iconSize: "xs",
  },
  md: {
    defaultPadding: "py-2",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-24",
    text: "text-sm",
    gap: "gap-3",
    bar: "h-3",
    iconSize: "sm",
  },
  lg: {
    defaultPadding: "py-2.5",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-28",
    text: "text-base",
    gap: "gap-3",
    bar: "h-3.5",
    iconSize: "md",
  },
  xl: {
    defaultPadding: "py-3",
    horizontalPadding: "px-5",
    defaultLabelWidth: "w-32",
    text: "text-lg",
    gap: "gap-4",
    bar: "h-4",
    iconSize: "md",
  },
};

const paddingTokens: Record<InfoRowPadding, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
  xl: "py-3",
};

// ── Value normalisation ───────────────────────────────────────────────────────

type NormalisedValue = {
  display: string | number | null;
  copyText: string | null;
  isEmpty: boolean;
};

function normaliseValue(
  value: string | number | boolean | null | undefined,
): NormalisedValue {
  if (value === undefined || value === null || value === "") {
    return { display: null, copyText: null, isEmpty: true };
  }
  if (typeof value === "boolean") {
    const text = value ? "Yes" : "No";
    return { display: text, copyText: text, isEmpty: false };
  }
  return { display: value, copyText: String(value), isEmpty: false };
}

/**
 * Writes to the clipboard, or reports why it could not.
 *
 * `navigator.clipboard` is absent outside a secure context and the write
 * rejects whenever the document is not focused — both extremely ordinary, and
 * both previously an uncaught throw or an unhandled rejection.
 */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "failed";
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import Panel from "./Panel.vue";
import InfoRowContent, {
  type InfoRowView,
} from "./internal/InfoRowContent.vue";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
  hasTextColor,
} from "../theme/Theme";

/**
 * One label/value line in a details panel, with copy-to-clipboard, truncation
 * tooltip, and loading / empty / error states.
 */
defineOptions({ name: "InfoRow", inheritAttrs: false });

const props = withDefaults(defineProps<InfoRowProps>(), {
  size: "md",
  variant: "plain",
  tone: "blue",
  corner: DEFAULT_SURFACE_CORNER,
  copyable: true,
  mono: false,
  hideIfEmpty: true,
  emptyText: "\u2014",
  wrap: false,
  tooltipOnTruncate: true,
  loading: false,
  loaderType: "skeleton",
  noBorder: false,
  noPadding: false,
  hoverable: false,
});

const emit = defineEmits<{ copy: [text: string] }>();

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();

const copyState = ref<CopyState>("idle");
let timer: ReturnType<typeof setTimeout> | null = null;

// The confirmation resets on a timer; without this the timer fires into an
// unmounted component whenever a row disappears within 1.6s of a copy.
onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

// A `value` slot behaves like a ReactNode value: rendered as-is, copy suppressed.
const hasValueSlot = computed(() => !!slots["value"]);
const normalised = computed<NormalisedValue>(() =>
  hasValueSlot.value
    ? { display: null, copyText: null, isEmpty: false }
    : normaliseValue(props.value),
);

const hasError = computed(() => Boolean(props.error));
/**
 * A `plain` row IS the root element. Wrapping it in anything would make every
 * row an only child, so `last:border-0` would match all of them and every
 * hairline would vanish. (This note lives here rather than in the template
 * because a template comment is a real node, and a comment beside the root
 * makes the component multi-root — which silently breaks attribute
 * inheritance and `$el`.)
 */
const isPlain = computed(() => props.variant === "plain");

// A row that is loading, or reporting a failure, has something to say even
// though it has no value yet — hiding it would be wrong.
const isHidden = computed(
  () =>
    normalised.value.isEmpty &&
    props.hideIfEmpty &&
    !props.loading &&
    !hasError.value,
);

/**
 * Vue has no `SurfaceProvider`, so a row cannot ask the card around it what it
 * is drawn on. When the row draws its own surface we can at least read the
 * right tokens for *that*; a `plain` row falls back to the solid set.
 */
// `isPlain` is a computed, so it cannot narrow `props.variant` for the
// compiler — the union has to be re-tested inline (the same trap the template
// hits below, hence `panelVariant`).
const surfaceVariant = computed<SurfaceVariant>(() =>
  props.variant === "plain" ? "elevated" : props.variant,
);
const text = computed(() => getSurfaceTextTokens(surfaceVariant.value));

/** A Vue template cannot narrow a union, so the narrowing happens here. */
const panelVariant = computed<SurfaceVariant>(() => surfaceVariant.value);

const tokens = computed(() => sizeTokens[props.size]);
const labelTokens = computed(() => sizeTokens[props.labelSize ?? props.size]);
const valueTokens = computed(() => sizeTokens[props.valueSize ?? props.size]);
const trigger = computed(() => getSurfaceTriggerTokens(props.tone));

const rowPadding = computed(() =>
  props.padding !== undefined
    ? paddingTokens[props.padding]
    : tokens.value.defaultPadding,
);

const showCopy = computed(
  () =>
    props.copyable &&
    normalised.value.copyText !== null &&
    !normalised.value.isEmpty &&
    !props.loading &&
    !hasError.value,
);

const canTooltip = computed(
  () =>
    props.tooltipOnTruncate &&
    !props.wrap &&
    normalised.value.copyText !== null &&
    !props.loading &&
    !hasError.value,
);

const useSmartLayout = computed(() => props.labelWidth === undefined);

const handleCopy = async () => {
  const copyText = normalised.value.copyText;
  if (!copyText) return;
  if (timer) clearTimeout(timer);
  const ok = await writeClipboard(copyText);
  copyState.value = ok ? "copied" : "failed";
  if (ok) emit("copy", copyText);
  timer = setTimeout(() => {
    copyState.value = "idle";
  }, 1600);
};

const copyLabel = computed(() =>
  copyState.value === "copied"
    ? "Copied to clipboard"
    : copyState.value === "failed"
      ? "Copy failed"
      : "Copy to clipboard",
);

const rowClass = computed(() =>
  classNames(
    "group flex items-center transition-colors duration-300",
    tokens.value.gap,
    rowPadding.value,
    !props.noPadding && tokens.value.horizontalPadding,
    props.hoverable && "rounded-md",
    // `idle` so the confirmation wash is never racing the hover wash for the
    // same property.
    props.hoverable && copyState.value === "idle" && trigger.value.hover,
    !props.noBorder &&
      !props.hoverable &&
      `border-b ${text.value.divider} last:border-0`,
    copyState.value === "copied" && "bg-emerald-500/10",
    copyState.value === "failed" && "bg-rose-500/10",
    // Only the plain row is the root element, so only it carries the caller's
    // class; otherwise the class goes on the Panel.
    isPlain.value && classAttr.value,
  ),
);

const labelClass = computed(() =>
  classNames(
    labelTokens.value.text,
    !hasTextColor(props.labelClassName) && text.value.muted,
    useSmartLayout.value
      ? "shrink-0 min-w-0 max-w-[30%] truncate"
      : `grow shrink-0 ${props.labelWidth ?? tokens.value.defaultLabelWidth}`,
    props.labelClassName,
  ),
);

const valueColorClass = computed(() =>
  hasError.value
    ? "text-rose-600 dark:text-rose-400"
    : normalised.value.isEmpty
      ? text.value.muted
      : text.value.body,
);

const valueClass = computed(() =>
  classNames(
    valueTokens.value.text,
    "font-medium rounded-sm",
    props.wrap ? "wrap-break-word whitespace-normal text-right" : "truncate",
    !hasTextColor(props.valueClassName) && valueColorClass.value,
    props.mono && "font-mono",
    trigger.value.focusRing,
    props.valueClassName,
  ),
);

// The loader follows the row's tone. Derived from the tone, never mapped:
// both shapes are already safelisted for all 21 colours.
const loaderInk = computed(
  () => `bg-${props.tone}-500/20 dark:bg-${props.tone}-500/25`,
);
const loaderText = computed(
  () => `text-${props.tone}-500 dark:text-${props.tone}-400`,
);

const spinnerClass = computed(() =>
  classNames(
    "inline-block animate-spin rounded-full border-2 border-current border-t-transparent aspect-square",
    "motion-reduce:animate-none",
    tokens.value.bar,
    loaderText.value,
  ),
);

const skeletonClass = computed(() =>
  classNames(
    // Same ink and shape as React's `SkeletonBar`, and the height and the ink
    // are each the only class of their kind rather than one of two racing.
    "block w-2/5 rounded-full animate-pulse motion-reduce:animate-none",
    loaderInk.value,
    tokens.value.bar,
  ),
);

const copyButtonClass = computed(() =>
  classNames(
    "shrink-0 transition-opacity duration-200",
    // Revealed on hover *and* on keyboard focus — an opacity-0 button is still
    // in the tab order, so a keyboard user used to land on something they
    // could not see.
    copyState.value === "idle"
      ? "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      : "opacity-100",
  ),
);

const view = computed<InfoRowView>(() => ({
  rowClass: rowClass.value,
  labelClass: labelClass.value,
  valueClass: valueClass.value,
  spinnerClass: spinnerClass.value,
  skeletonClass: skeletonClass.value,
  copyButtonClass: copyButtonClass.value,
  label: props.label,
  displayText: normalised.value.isEmpty
    ? props.emptyText
    : normalised.value.display,
  copyText: normalised.value.copyText,
  loading: props.loading,
  loaderType: props.loaderType,
  canTooltip: canTooltip.value,
  showCopy: showCopy.value,
  copyState: copyState.value,
  copyLabel: copyLabel.value,
  error: props.error,
  hasError: hasError.value,
  tone: props.tone,
  iconSize: tokens.value.iconSize,
}));
</script>

<template>
  <InfoRowContent
    v-if="!isHidden && isPlain"
    v-bind="restAttrs"
    :view="view"
    @copy="handleCopy"
  >
    <template v-if="$slots.label" #label><slot name="label" /></template>
    <template v-if="$slots.value" #value><slot name="value" /></template>
  </InfoRowContent>

  <Panel
    v-else-if="!isHidden"
    v-bind="restAttrs"
    :class="classAttr"
    :variant="panelVariant"
    :color="tone"
    :corner="corner"
    padding="none"
    :scrollable="false"
    :glass-opacity="glassOpacity"
    :vibrancy="vibrancy"
  >
    <InfoRowContent :view="view" @copy="handleCopy">
      <template v-if="$slots.label" #label><slot name="label" /></template>
      <template v-if="$slots.value" #value><slot name="value" /></template>
    </InfoRowContent>
  </Panel>
</template>

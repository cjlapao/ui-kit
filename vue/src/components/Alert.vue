<script lang="ts">
import type { VNode } from "vue";
import type {
  AlertIconAlign,
  AlertIntent,
  AlertVariant,
  ControlSize,
  SurfaceCorner,
  TrueColor,
} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy, SpecularMode } from "../theme/glass";
import type { IconSize } from "../types/Icon";

export type { AlertIconAlign, AlertIntent, AlertVariant };
export type AlertSize = ControlSize;

export interface AlertProps {
  /**
   * What the callout means. Picks the tone, the default icon and how assistive
   * technology announces it. `color` overrides just the tone.
   * @default "neutral"
   */
  intent?: AlertIntent;
  /** @deprecated Use `color`, or `intent` for a semantic callout. */
  tone?: TrueColor;
  /** Overrides the tone the `intent` would have chosen. */
  color?: TrueColor;
  /** @default "subtle" */
  variant?: AlertVariant;
  /** @default "md" */
  size?: AlertSize;
  /** Corner radius, on the shared container scale. */
  corner?: SurfaceCorner;
  title?: string;
  /** Body copy. The default slot is used instead when this is omitted. */
  description?: string;
  /** A registry icon name, a node, or `false` to show none. */
  icon?: string | VNode | false;
  /**
   * Icon size, on the shared control scale. Defaults to a step derived from
   * `size`, which is right in most cases — set this when the callout needs a
   * heavier glyph than its copy would suggest.
   */
  iconSize?: ControlSize;
  /**
   * Where the icon sits against the content. @default "top"
   */
  iconAlign?: AlertIconAlign;
  actions?: string;
  dismissible?: boolean;
  /**
   * Controls visibility. Leave it unset and a dismissible alert hides itself —
   * it used to render a dismiss button that did nothing unless the caller
   * wired up the `dismiss` event *and* their own state.
   */
  open?: boolean;
  /** Label for the dismiss button. @default "Dismiss alert" */
  dismissLabel?: string;
  /** Overrides the politeness the `intent` would have chosen. */
  live?: "assertive" | "polite" | "off";
  /** Glass fill transparency, for the glass variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the glass variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the glass variants. */
  specularMode?: SpecularMode;
}

type AlertSizeTokens = {
  container: string;
  gap: string;
  title: string;
  text: string;
  icon: IconSize;
  /**
   * Height of the icon's box when it is top-aligned: exactly the title's line
   * box, so the glyph centres on the title's cap height. The default glyph is
   * a couple of pixels taller than this and overflows it harmlessly — the
   * container's padding absorbs it.
   */
  iconBox: string;
  /**
   * The same height as a floor rather than a fixed value, used when the caller
   * overrides `iconSize`. A glyph much taller than the title would otherwise
   * spill outside the callout entirely at the small sizes, where the vertical
   * padding is only 6px.
   */
  iconBoxLoose: string;
  dismiss: string;
  dismissIcon: IconSize;
  actions: string;
};

const SIZE_STYLES: Record<AlertSize, AlertSizeTokens> = {
  xs: {
    container: "px-2.5 py-1.5",
    gap: "gap-2",
    title: "text-xs",
    text: "text-xs",
    icon: "sm",
    iconBox: "h-4",
    iconBoxLoose: "min-h-4",
    dismiss: "h-5 w-5",
    dismissIcon: "xs",
    actions: "pt-1.5",
  },
  sm: {
    container: "px-3 py-2",
    gap: "gap-2.5",
    title: "text-xs",
    text: "text-xs",
    icon: "sm",
    iconBox: "h-4",
    iconBoxLoose: "min-h-4",
    dismiss: "h-6 w-6",
    dismissIcon: "sm",
    actions: "pt-2",
  },
  md: {
    container: "px-4 py-3",
    gap: "gap-3",
    title: "text-sm",
    text: "text-sm",
    icon: "md",
    iconBox: "h-5",
    iconBoxLoose: "min-h-5",
    dismiss: "h-8 w-8",
    dismissIcon: "sm",
    actions: "pt-2",
  },
  lg: {
    container: "px-5 py-4",
    gap: "gap-3.5",
    title: "text-base",
    text: "text-sm",
    icon: "lg",
    iconBox: "h-6",
    iconBoxLoose: "min-h-6",
    dismiss: "h-9 w-9",
    dismissIcon: "md",
    actions: "pt-3",
  },
  xl: {
    container: "px-6 py-5",
    gap: "gap-4",
    title: "text-lg",
    text: "text-base",
    icon: "xl",
    iconBox: "h-7",
    iconBoxLoose: "min-h-7",
    dismiss: "h-10 w-10",
    dismissIcon: "md",
    actions: "pt-3",
  },
};

const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

/**
 * `top` keeps its own fixed-height box (see `iconWrapperClass`), so it only
 * needs the default `align-self`. The other two drop the box and let the flex
 * line place them against the full content height.
 */
const ALIGN_CLASSES: Record<AlertIconAlign, string> = {
  top: "self-start",
  center: "self-center",
  bottom: "self-end",
};
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  ALERT_INTENT_CONFIG,
  DEFAULT_SURFACE_CORNER,
  getAlertVariantTokens,
  getSurfaceCornerClass,
} from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../theme/glass";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Alert", inheritAttrs: false });

const props = withDefaults(defineProps<AlertProps>(), {
  intent: "neutral",
  // Vue casts an absent prop whose type includes Boolean to `false`, so
  // without these two the component cannot tell "not supplied" from "supplied
  // as false". `open` meant every alert rendered as nothing, and `icon` (typed
  // `string | VNode | false`, where `false` means "no icon") meant no alert
  // ever showed one. `default: undefined` opts out of the cast.
  open: undefined,
  icon: undefined,
  variant: "subtle",
  size: "md",
  corner: DEFAULT_SURFACE_CORNER,
  dismissible: false,
  iconAlign: "top",
  dismissLabel: "Dismiss alert",
  glassOpacity: "frosted",
  vibrancy: "medium",
  specularMode: "none",
});

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const el = ref<HTMLDivElement | null>(null);
defineExpose({ el });

const titleId = useId();
const selfDismissed = ref(false);

const config = computed(
  () => ALERT_INTENT_CONFIG[props.intent] ?? ALERT_INTENT_CONFIG.neutral,
);
const effectiveColor = computed(
  () => props.color ?? props.tone ?? config.value.tone,
);
const sizeToken = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const tokens = computed(() =>
  getAlertVariantTokens(effectiveColor.value, props.variant),
);

const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? props.open : !selfDismissed.value,
);

const isGlass = computed(() => GLASS_VARIANTS.includes(props.variant));

const specularClasses = computed(() =>
  isGlass.value ? getSpecularClasses(props.specularMode) : null,
);

const rootClass = computed(() =>
  classNames(
    "relative flex w-full border shadow-sm transition",
    sizeToken.value.container,
    sizeToken.value.gap,
    getSurfaceCornerClass(props.corner),
    tokens.value.surface,
    tokens.value.border,
    isGlass.value && "overflow-hidden",
    isGlass.value && [
      props.variant === "liquid-glass" ? "backdrop-blur-md" : "backdrop-blur-sm",
      getGlassFillClass(effectiveColor.value, props.glassOpacity),
      getGlassVibrancyClass(props.vibrancy),
      // A callout is not a control: no hover rim, no focus ring on the box
      // itself. The dismiss button brings its own.
      getGlassChromeClasses(effectiveColor.value, { interactive: false }),
    ],
    classAttr.value,
  ),
);

// `role="alert"` is an assertive live region — it interrupts the screen reader
// mid-sentence. Every alert used to carry it, including the purely
// informational ones that are on the page at load.
const politeness = computed(() => props.live ?? config.value.live);
const role = computed(() =>
  politeness.value === "assertive"
    ? "alert"
    : politeness.value === "polite"
      ? "status"
      : undefined,
);

const resolvedIcon = computed(() =>
  props.icon === false ? null : (props.icon ?? config.value.icon),
);

const iconWrapperClass = computed(() =>
  classNames(
    // `pt-1` used to fake the top alignment: a magic offset that only lined up
    // with the `md` title and drifted at every other size. A box exactly the
    // height of the title's line, with the glyph centred in it, lands on the
    // title's cap height at any size. An explicit `iconSize` relaxes that to a
    // floor — the caller is overriding the calibration, and a glyph much taller
    // than the title would otherwise spill outside the callout.
    "flex flex-shrink-0 items-center",
    ALIGN_CLASSES[props.iconAlign] ?? ALIGN_CLASSES.top,
    props.iconAlign === "top" &&
      (props.iconSize ? sizeToken.value.iconBoxLoose : sizeToken.value.iconBox),
    tokens.value.icon,
  ),
);

const resolvedIconSize = computed(() => props.iconSize ?? sizeToken.value.icon);

const hasTitle = computed(() => Boolean(props.title || slots.title));
const hasBody = computed(() => Boolean(props.description || slots.default));
const hasActions = computed(() =>
  Boolean(props.actions || slots.actions),
);

const handleDismiss = () => {
  if (!isControlled.value) selfDismissed.value = true;
  emit("dismiss");
};
</script>

<template>
  <div
    v-if="isOpen"
    ref="el"
    :class="rootClass"
    :role="role"
    :aria-live="politeness === 'off' ? undefined : politeness"
    :aria-labelledby="hasTitle ? titleId : undefined"
    v-bind="restAttrs"
  >
    <div
      v-if="specularClasses"
      :class="
        classNames(
          'pointer-events-none absolute inset-0 rounded-[inherit]',
          specularClasses,
        )
      "
      aria-hidden="true"
    />

    <div v-if="resolvedIcon" :class="iconWrapperClass">
      <VNodeRenderer :nodes="renderIcon(resolvedIcon, resolvedIconSize)" />
    </div>

    <div class="relative flex min-w-0 flex-1 flex-col gap-1">
      <div
        v-if="hasTitle"
        :id="titleId"
        :class="classNames('font-semibold leading-tight', sizeToken.title)"
      >
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        v-if="hasBody"
        :class="
          classNames('leading-relaxed', sizeToken.text, tokens.text)
        "
      >
        <slot>{{ description }}</slot>
      </div>
      <div
        v-if="hasActions"
        :class="classNames(sizeToken.actions, sizeToken.text)"
      >
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      :class="
        classNames(
          'relative inline-flex flex-shrink-0 items-center justify-center self-start rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2',
          sizeToken.dismiss,
          tokens.dismiss,
        )
      "
      :aria-label="dismissLabel"
      @click="handleDismiss"
    >
      <VNodeRenderer :nodes="renderIcon('Close', sizeToken.dismissIcon)" />
    </button>
  </div>
</template>

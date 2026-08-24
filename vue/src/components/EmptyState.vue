<script lang="ts">
import type { VNode } from "vue";
import type { ButtonVariant, ButtonSize, ButtonColor } from "./Button.vue";
import {
  SURFACE_VARIANTS,
  type ControlSize,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy, SpecularMode } from "../theme/glass";

/**
 * Every container surface, plus `plain` for an empty state dropped inside a
 * card the app already owns — the common case, and previously only reachable
 * by setting `disableBorder` *and* `transparentBackground` together.
 */
export const EMPTY_STATE_VARIANTS = [...SURFACE_VARIANTS, "plain"] as const;
export type EmptyStateVariant = (typeof EMPTY_STATE_VARIANTS)[number];

export type EmptyStateTone = TrueColor;
export type EmptyStateSize = ControlSize;
/** @deprecated Use `size`, which now drives the whole type scale. */
export type TextSize = ControlSize;

type EmptyStateSizeTokens = {
  /** Explicit icon dimensions — an empty state's glyph is far larger than a
   *  control's, so it does not sit on the shared icon scale. */
  icon: string;
  /** Padding of the tinted disc behind the icon. */
  iconPad: string;
  title: string;
  subtitle: string;
  gap: string;
  /** Space between the copy and the action row. */
  actionGap: string;
  action: ButtonSize;
};

const SIZE_STYLES: Record<EmptyStateSize, EmptyStateSizeTokens> = {
  xs: {
    icon: "h-8 w-8",
    iconPad: "p-2",
    title: "text-sm",
    subtitle: "text-xs",
    gap: "gap-2",
    actionGap: "mt-3",
    action: "xs",
  },
  sm: {
    icon: "h-10 w-10",
    iconPad: "p-2.5",
    title: "text-base",
    subtitle: "text-xs",
    gap: "gap-2.5",
    actionGap: "mt-4",
    action: "xs",
  },
  md: {
    icon: "h-12 w-12",
    iconPad: "p-3",
    title: "text-lg",
    subtitle: "text-sm",
    gap: "gap-3",
    actionGap: "mt-4",
    action: "sm",
  },
  lg: {
    icon: "h-14 w-14",
    iconPad: "p-3.5",
    title: "text-xl",
    subtitle: "text-base",
    gap: "gap-3.5",
    actionGap: "mt-5",
    action: "md",
  },
  xl: {
    icon: "h-16 w-16",
    iconPad: "p-4",
    title: "text-2xl",
    subtitle: "text-lg",
    gap: "gap-4",
    actionGap: "mt-6",
    action: "md",
  },
};

export interface EmptyStateProps {
  title?: string;
  subtitle?: string;

  /** @default "outlined" */
  variant?: EmptyStateVariant;
  /** @default "neutral" */
  tone?: EmptyStateTone;
  /** Alias for `tone`, matching `Panel`. */
  color?: TrueColor;
  /** Corner radius, on the shared container scale. */
  corner?: SurfaceCorner;
  /** Container padding, on the shared container scale. @default "lg" */
  padding?: SurfacePadding;
  /**
   * Density — icon, type scale, gaps and the action button's default size.
   * @default "md"
   */
  size?: EmptyStateSize;
  /** @deprecated Use `size`. Ignored when `size` is set. */
  textSize?: ControlSize;

  /**
   * The dashed rule that marks a drop zone or a slot waiting to be filled.
   * Drawn as an `outline` rather than a border so it works on every variant,
   * including the ring-based ones, without fighting the card's own border.
   * @default true
   */
  dashed?: boolean;

  /**
   * A registry icon name or a node. The default used to be `"Plus"`, which is
   * not in the registry — so every default empty state rendered CustomIcon's
   * missing-icon placeholder rather than a glyph. The name is `"Add"`.
   * @default "Add"
   */
  icon?: string | VNode;
  /** @default true */
  showIcon?: boolean;
  /** Overrides the dimensions the `size` would have chosen. */
  iconSize?: string;
  /** Overrides the tone for the glyph only. */
  iconColor?: TrueColor;
  /**
   * Tinted disc behind the glyph. It used to be a square `dark:bg-white/5`
   * with no light-mode partner, so it appeared out of nowhere in dark mode.
   * @default true
   */
  iconBackground?: boolean;

  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonVariant;
  actionColor?: ButtonColor;
  actionSize?: ButtonSize;
  actionLeadingIcon?: string | VNode;

  fullWidth?: boolean;
  fullHeight?: boolean;

  /** @deprecated Use `variant="plain"`. */
  disableBorder?: boolean;
  /** @deprecated Use `variant="plain"`. */
  transparentBackground?: boolean;

  /** Glass fill transparency, for the see-through variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the see-through variants. */
  specularMode?: SpecularMode;
}

export { SIZE_STYLES as EMPTY_STATE_SIZE_STYLES };
</script>

<script setup lang="ts">
import { computed, isVNode, useId, useSlots } from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import Panel from "./Panel.vue";
import { DEFAULT_SURFACE_CORNER } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";
import { useIconRenderer } from "../contexts/IconContext";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "EmptyState", inheritAttrs: false });

const props = withDefaults(defineProps<EmptyStateProps>(), {
  variant: "outlined",
  corner: DEFAULT_SURFACE_CORNER,
  padding: "lg",
  dashed: true,
  icon: "Add",
  showIcon: true,
  iconBackground: true,
  fullWidth: false,
  fullHeight: false,
  disableBorder: false,
  transparentBackground: false,
});

const emit = defineEmits<{ (e: "action"): void }>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const titleId = useId();

const effectiveTone = computed(() => props.tone ?? props.color ?? "neutral");
const iconTone = computed(() => props.iconColor ?? effectiveTone.value);
const effectiveSize = computed(() => props.size ?? props.textSize ?? "md");
const sizeToken = computed(
  () => SIZE_STYLES[effectiveSize.value] ?? SIZE_STYLES.md,
);

// The two deprecated flags together meant "no card at all", which is what
// `plain` is. Either one alone left a half-drawn surface.
const effectiveVariant = computed<EmptyStateVariant>(() =>
  props.disableBorder && props.transparentBackground ? "plain" : props.variant,
);
const isPlain = computed(() => effectiveVariant.value === "plain");

// An `outline` rather than a `border`: it sits on top of whatever the variant
// paints, needs no width to be reconciled against the card's own `border`, and
// takes no space in the box model.
const dashedClass = computed(() =>
  props.dashed && !isPlain.value
    ? classNames(
        "outline-2 outline-dashed -outline-offset-2",
        `outline-${effectiveTone.value}-300 dark:outline-${effectiveTone.value}-500/40`,
      )
    : undefined,
);

const panelClass = computed(() =>
  classNames(
    "items-center justify-center",
    props.fullHeight && "h-full",
    dashedClass.value,
    classAttr.value,
  ),
);

const plainClass = computed(() =>
  classNames("flex w-full flex-col", props.fullHeight && "h-full", classAttr.value),
);

const hasTitle = computed(() => Boolean(props.title || slots.title));
const hasSubtitle = computed(() => Boolean(props.subtitle || slots.subtitle));
// The action used to require `actionLabel` *and* `onAction` together, so a
// label with a handler resolved later rendered nothing at all.
const hasActions = computed(() =>
  Boolean(slots.actions || props.actionLabel),
);

const iconNodes = computed(() =>
  isVNode(props.icon)
    ? props.icon
    : renderIcon(props.icon, undefined, props.iconSize ?? sizeToken.value.icon),
);

const iconWrapperClass = computed(() =>
  classNames(
    "flex items-center justify-center rounded-full",
    sizeToken.value.iconPad,
    `text-${iconTone.value}-500 dark:text-${iconTone.value}-300`,
    props.iconBackground &&
      `bg-${iconTone.value}-100/70 dark:bg-${iconTone.value}-500/15`,
  ),
);

/**
 * Vue has no `SurfaceProvider`, so these are the solid-surface tokens spelled
 * out rather than read from the surface the way React's body does. Vue is a
 * step behind here: copy on a glass empty state will not step up in contrast.
 */
const titleClass = computed(() =>
  classNames(
    "font-semibold",
    sizeToken.value.title,
    "text-neutral-900 dark:text-neutral-100",
  ),
);

const subtitleClass = computed(() =>
  classNames(
    // `break-all` split ordinary prose mid-word. Only a long unbroken token
    // needs breaking, which is `break-words`.
    "mx-auto max-w-prose leading-relaxed break-words",
    sizeToken.value.subtitle,
    "text-neutral-600 dark:text-neutral-300",
  ),
);

// Only `emit`. Vue resolves an `action` emit to the parent's `onAction` prop,
// so calling `props.onAction` here as well fired the handler twice.
const handleAction = () => {
  emit("action");
};
</script>

<template>
  <component
    :is="isPlain ? 'section' : Panel"
    v-bind="{
      ...restAttrs,
      ...(isPlain
        ? { class: plainClass }
        : {
            class: panelClass,
            variant: effectiveVariant,
            tone: effectiveTone,
            corner,
            padding,
            fullWidth,
            glassOpacity,
            vibrancy,
            specularMode,
            scrollable: false,
            flexBody: true,
            bodyClassName: 'flex flex-1 flex-col items-center justify-center',
          }),
    }"
    :aria-labelledby="hasTitle ? titleId : undefined"
  >
    <div
      :class="
        classNames(
          'flex w-full flex-col items-center justify-center text-center',
          sizeToken.gap,
        )
      "
    >
      <div v-if="showIcon && icon" :class="iconWrapperClass">
        <!-- One sizing path. The old code passed the size class *and* the icon
             scale, and its `isVNode` branch skipped both. -->
        <VNodeRenderer :nodes="iconNodes" />
      </div>

      <div v-if="hasTitle || hasSubtitle" class="space-y-1">
        <p v-if="hasTitle" :id="titleId" :class="titleClass">
          <slot name="title">{{ title }}</slot>
        </p>
        <p v-if="hasSubtitle" :class="subtitleClass">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
      </div>

      <div
        v-if="hasActions"
        :class="
          classNames('flex flex-wrap justify-center gap-2', sizeToken.actionGap)
        "
      >
        <slot name="actions">
          <Button
            :size="actionSize ?? sizeToken.action"
            :variant="actionVariant ?? 'soft'"
            :color="actionColor ?? effectiveTone"
            :leading-icon="actionLeadingIcon"
            @click="handleAction"
          >
            {{ actionLabel }}
          </Button>
        </slot>
      </div>
    </div>
  </component>
</template>

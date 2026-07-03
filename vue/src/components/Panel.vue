<script lang="ts">
import type { CSSProperties, VNode } from "vue";
import type { ButtonProps } from "./Button.vue";
import type { LoaderProps } from "./Loader.vue";
import type { ThemeColor } from "../theme/Theme";

export type PanelVariant =
  | "elevated"
  | "outlined"
  | "subtle"
  | "tonal"
  | "default"
  | "glass"
  | "simple"
  | "liquid-glass";
export type PanelTone = ThemeColor;
export type PanelDecoration = "none" | "gradient" | "shapes" | "both";
export type PanelMediaPlacement = "top" | "start" | "end" | "overlay";
export type PanelPadding = "none" | "xs" | "sm" | "md" | "lg";
export type PanelCorner =
  | "rounded"
  | "rounded-sm"
  | "rounded-md"
  | "rounded-lg"
  | "rounded-full"
  | "pill"
  | "none";
export type PanelActionLayout = "auto" | "stacked" | "inline";
export type PanelLoaderType = Exclude<LoaderProps["variant"], undefined>;
export type PanelSpecularMode = "none" | "classic" | "halo";

export interface PanelAction
  extends Pick<
    ButtonProps,
    | "variant"
    | "color"
    | "size"
    | "weight"
    | "leadingIcon"
    | "trailingIcon"
    | "loading"
    | "disabled"
    | "accent"
    | "accentColor"
  > {
  id?: string;
  label: string | VNode;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

export interface PanelProps {
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  badge?: string;
  mediaPlacement?: PanelMediaPlacement;
  actions?: PanelAction[];
  actionLayout?: PanelActionLayout;
  variant?: PanelVariant;
  tone?: ThemeColor;
  padding?: PanelPadding;
  corner?: PanelCorner;
  fullWidth?: boolean;
  disabled?: boolean;
  flexBody?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  loading?: boolean;
  loaderType?: PanelLoaderType;
  loaderTitle?: string;
  loaderMessage?: string;
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  hoverShadow?: boolean;
  decoration?: PanelDecoration;
  /**
   * Adds a subtle background tint on hover and lightens any decoration elements.
   * Defaults to `true` when an `onClick` handler is present, otherwise `false`.
   */
  hoverable?: boolean;
  color?: ThemeColor;
  /**
   * Override the default hover color.
   * If not provided, it defaults to the `color` prop if available, or a neutral tint.
   */
  hoverColor?: ThemeColor;
  /**
   * Override the default border color.
   * If not provided, it defaults to the `tone` or `color` prop depending on variant.
   */
  borderColor?: ThemeColor;
  /**
   * Override the default background color.
   */
  backgroundColor?: ThemeColor;
  /**
   * controls if the panel body should be scrollable
   * @default true
   */
  scrollable?: boolean;
  /**
   * Backdrop vibrancy for the liquid-glass variant.
   * Preset takes priority over a numeric value when both are provided.
   */
  vibrancy?: "low" | "medium" | "high" | number;
  /**
   * Glass fill opacity for the liquid-glass variant.
   * Preset takes priority over a numeric value when both are provided.
   * @default "frosted"
   */
  glassOpacity?: "frosted" | "light" | "clear" | number;
/**
    * Whether the liquid-glass variant shows a specular highlight at the top.
    * @default true
    *
    * @deprecated Use specularMode instead. Kept for backward compatibility.
    */
   specularHighlight?: boolean;
   /**
    * Specular highlight mode for the liquid-glass variant.
    * Controls how light reflects off the glass surface.
    * @default "classic"
    */
   specularMode?: PanelSpecularMode;
 }

const variantBaseStyles: Record<PanelVariant, string> = {
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 text-neutral-900 dark:text-neutral-100",
  outlined:
    "bg-white/90 text-neutral-900 ring-1 dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/10",
  subtle:
    "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  tonal:
    "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  default:
    "bg-white/80 backdrop-blur-xl text-neutral-900 shadow-2xl ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  glass:
    "backdrop-blur-xl text-neutral-900 ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  "liquid-glass":
    "backdrop-blur-2xl ring-1 ring-transparent dark:ring-white/5",
  simple:
    "text-neutral-900  ring-transparent dark:text-neutral-100 dark:ring-white/5",
};

export const paddingStyles: Record<PanelPadding, string> = {
  none: "p-0",
  xs: "p-2 sm:p-3",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
};

const cornerStyles: Record<PanelCorner, string> = {
  rounded: "rounded-sm",
  "rounded-sm": "rounded-lg",
  "rounded-md": "rounded-2xl",
  "rounded-lg": "rounded-3xl",
  "rounded-full": "rounded-full",
  pill: "rounded-3xl",
  none: "rounded-none",
};

const actionButtonWidth: Record<PanelActionLayout, string> = {
  auto: "w-full sm:w-auto",
  stacked: "w-full",
  inline: "w-auto",
};

const actionWrapperLayout: Record<PanelActionLayout, string> = {
  auto: "flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
  stacked: "flex-col gap-3",
  inline: "flex-wrap items-center gap-3",
};

const defaultActionColor: ThemeColor = "theme";
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import Loader from "./Loader.vue";
import { getPanelToneStyles, resolveColor } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Panel", inheritAttrs: false });

const props = withDefaults(defineProps<PanelProps>(), {
  mediaPlacement: "top",
  actionLayout: "auto",
  variant: "elevated",
  tone: "neutral",
  padding: "md",
  corner: "rounded-sm",
  loading: false,
  disabled: false,
  flexBody: false,
  loaderType: "spinner",
  hoverShadow: false,
  decoration: "none",
  scrollable: true,
  vibrancy: "medium",
glassOpacity: "frosted",
   specularHighlight: true,
   specularMode: "classic",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const palette = computed(() => getPanelToneStyles(props.tone));
const colorPalette = computed(() =>
  props.color ? getPanelToneStyles(props.color) : palette.value,
);
const isHoverable = computed(
  () => props.hoverable ?? Boolean(restAttrs.value.onClick),
);

const effectiveHoverColor = computed(
  () =>
    props.hoverColor ??
    (props.color && props.color !== "neutral" ? props.color : undefined),
);
const hoverColorName = computed(() =>
  effectiveHoverColor.value ? resolveColor(effectiveHoverColor.value) : undefined,
);

const borderPalette = computed(() =>
  props.borderColor ? getPanelToneStyles(props.borderColor) : undefined,
);
const effectiveBorderClass = computed(() => borderPalette.value?.border);

const bgPalette = computed(() =>
  props.backgroundColor ? getPanelToneStyles(props.backgroundColor) : undefined,
);

const effectiveBgClass = computed(() => {
  if (!props.backgroundColor) return undefined;
  if (props.backgroundColor === "white") return "bg-white dark:bg-neutral-900";
  if (bgPalette.value) {
    if (props.variant === "glass") return bgPalette.value.glassBg;
    if (props.variant === "subtle") return bgPalette.value.subtleBg;
    if (props.variant === "simple") return bgPalette.value.tonalBg;
    if (props.variant === "tonal") return bgPalette.value.tonalBg;
    // For elevated/outlined, we might want to apply the subtle background
    return bgPalette.value.tonalBg;
  }
  return undefined;
});

const hasMedia = computed(() => Boolean(slots.media));
const isOverlay = computed(
  () => props.mediaPlacement === "overlay" && hasMedia.value,
);
// Decoration is suppressed in overlay mode since the image + gradient already provide impact
const showDecorationGradient = computed(
  () =>
    !isOverlay.value &&
    (props.decoration === "gradient" || props.decoration === "both"),
);
const showDecorationShapes = computed(
  () =>
    !isOverlay.value &&
    (props.decoration === "shapes" || props.decoration === "both"),
);

const resolvedStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {};
  if (props.maxWidth !== undefined) {
    styles.maxWidth =
      typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth;
  }
  if (props.minHeight !== undefined) {
    styles.minHeight =
      typeof props.minHeight === "number"
        ? `${props.minHeight}px`
        : props.minHeight;
  }
  return styles;
});

const vibrancyValue = computed(() => {
  if (typeof props.vibrancy === "number") return props.vibrancy;
  if (props.vibrancy === "low") return 1;
  if (props.vibrancy === "medium") return 1.2;
  if (props.vibrancy === "high") return 1.4;
  return 1.2;
});
const vibrancyClass = computed(
  () => `backdrop-saturate-[${vibrancyValue.value}]`,
);

const glassFillClass = computed(() => {
  const glassOpacity = props.glassOpacity;
  const litOpacity = (() => {
    if (typeof glassOpacity === "number") return Math.round((glassOpacity as number) * 100);
    if (glassOpacity === "frosted") return 45;
    if (glassOpacity === "light") return 70;
    if (glassOpacity === "clear") return 20;
    return 45;
  })();
  const drkOpacity = (() => {
    if (typeof glassOpacity === "number") return Math.min(Math.round((glassOpacity as number) * 30), 30);
    if (glassOpacity === "frosted") return 15;
    if (glassOpacity === "light") return 25;
    if (glassOpacity === "clear") return 5;
    return 15;
  })();
  const base = resolveColor(props.tone);
  return `bg-${base}-50/${litOpacity} dark:bg-${base}-500/${drkOpacity}`;
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "outlined":
      return classNames(
        variantBaseStyles.outlined,
        effectiveBorderClass.value ?? palette.value.border,
      );
    case "subtle":
      return classNames(
        variantBaseStyles.subtle,
        effectiveBorderClass.value ?? palette.value.border,
        effectiveBgClass.value ?? palette.value.subtleBg,
      );
    case "tonal":
      return classNames(
        variantBaseStyles.tonal,
        effectiveBgClass.value ?? palette.value.tonalBg,
        effectiveBorderClass.value,
      );
    case "default":
      return classNames(
        variantBaseStyles.default,
        effectiveBorderClass.value ?? "border border-white/40",
      );
    case "glass":
      return classNames(
        variantBaseStyles.glass,
        "border",
        effectiveBorderClass.value ?? colorPalette.value.glassBorder,
        effectiveBgClass.value ?? palette.value.glassBg,
      );
    case "liquid-glass":
      return classNames(
        "backdrop-blur-2xl ring-1 ring-transparent dark:ring-white/5",
        vibrancyClass.value,
        glassFillClass.value,
        effectiveBorderClass.value ?? palette.value.liquidBorder,
        palette.value.liquidShadow,
        palette.value.liquidHeading,
      );
    case "simple":
      return classNames(
        variantBaseStyles.simple,
        effectiveBgClass.value ?? palette.value.tonalBg,
        effectiveBorderClass.value,
      );
    case "elevated":
      return classNames(
        !effectiveBgClass.value && variantBaseStyles.elevated,
        effectiveBgClass.value &&
          "text-neutral-900 shadow-xl ring-1 ring-black/5 dark:text-neutral-100 dark:ring-white/10",
        effectiveBorderClass.value,
        effectiveBgClass.value,
      );
    default:
      return classNames(
        !effectiveBgClass.value && variantBaseStyles.elevated,
        effectiveBgClass.value &&
          "text-neutral-900 shadow-xl ring-1 ring-black/5 dark:text-neutral-100 dark:ring-white/10",
        effectiveBorderClass.value,
        effectiveBgClass.value,
      );
  }
});

const overlayClasses = computed(() =>
  isOverlay.value
    ? "relative overflow-hidden text-white shadow-xl ring-0"
    : undefined,
);

const headingClass = computed(() =>
  isOverlay.value
    ? "text-white"
    : props.variant === "liquid-glass"
      ? palette.value.liquidHeading
      : palette.value.heading,
);
const subtitleClass = computed(() =>
  isOverlay.value ? "text-white/80" : palette.value.muted,
);
const descriptionClass = computed(() =>
  isOverlay.value ? "text-white/75" : palette.value.muted,
);
const badgeClass = computed(() =>
  classNames(
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
    isOverlay.value
      ? "bg-white/15 text-white/90 backdrop-blur-sm"
      : palette.value.badge,
  ),
);

const hasHeaderSection = computed(() =>
  Boolean(
    props.badge ||
      props.title ||
      props.subtitle ||
      props.description ||
      slots.badge ||
      slots.title ||
      slots.subtitle ||
      slots.description,
  ),
);
const hasBodySection = computed(() => Boolean(slots.default));

const bodyContentClass = computed(() =>
  classNames(
    props.padding === "none" ? "" : "space-y-3 leading-6",
    props.flexBody ? "flex-1 flex flex-col w-full" : "",
    isOverlay.value
      ? "text-white/80"
      : "text-neutral-700 dark:text-neutral-300",
    props.bodyClassName,
  ),
);

const bodySectionClass = computed(() =>
  classNames(
    props.flexBody ? "flex-1 flex flex-col w-full" : "",
    "min-h-0 flex-1",
    props.scrollable
      ? "overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent"
      : "",
    props.padding === "none" ? "" : "pr-1",
  ),
);

const actionsWrapperClass = computed(() =>
  classNames(
    "flex pt-3",
    actionWrapperLayout[props.actionLayout],
    hasBodySection.value ? "mt-auto" : "mt-4",
  ),
);

const actionButtonProps = (action: PanelAction) => {
  const {
    id: _id,
    label: _label,
    className: _className,
    color: _color,
    size: _size,
    ...buttonProps
  } = action;
  return buttonProps;
};

const sectionClass = computed(() =>
  classNames(
    "relative flex w-full min-h-0 flex-col overflow-hidden shrink-0",
    variantClasses.value,
    paddingStyles[props.padding],
    cornerStyles[props.corner],
    props.fullWidth ? "w-full" : undefined,
    isOverlay.value ? overlayClasses.value : undefined,
    props.hoverShadow &&
      "transition-shadow duration-200 hover:shadow-xl hover:-translate-y-[1px]",
    isHoverable.value && "group cursor-pointer",
    isHoverable.value &&
      hoverColorName.value &&
      `hover:bg-${hoverColorName.value}-50 dark:hover:bg-${hoverColorName.value}-900/20`,
    classAttr.value,
  ),
);

const resolvedSpecularMode = computed<PanelSpecularMode>(() => {
  if (props.specularMode !== undefined) return props.specularMode;
  if (props.specularHighlight === false) return "none";
  return "classic";
});
</script>

<template>
  <section
    :class="sectionClass"
    :data-variant="variant"
    :data-tone="tone"
    :aria-busy="loading"
    v-bind="restAttrs"
    :style="resolvedStyle"
  >
    <template v-if="isOverlay">
      <div class="absolute inset-0 overflow-hidden">
        <div class="h-full w-full"><slot name="media" /></div>
      </div>
      <div
        :class="
          classNames(
            'pointer-events-none absolute inset-0 bg-gradient-to-br',
            palette.overlayGradient,
          )
        "
      />
    </template>
    <div
      v-if="showDecorationGradient"
      :class="
        classNames(
          'pointer-events-none absolute inset-0 bg-gradient-to-br',
          palette.decorationGradient,
          isHoverable &&
            'transition-opacity duration-200 group-hover:opacity-50',
        )
      "
      aria-hidden="true"
    />
    <template v-if="showDecorationShapes">
      <div
        :class="
          classNames(
            'pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full',
            palette.decorationShape,
            isHoverable &&
              'transition-opacity duration-200 group-hover:opacity-50',
          )
        "
        aria-hidden="true"
      />
      <div
        :class="
          classNames(
            'pointer-events-none absolute -left-8 -bottom-10 w-36 h-36 rounded-full opacity-70',
            palette.decorationShape,
            isHoverable &&
              'transition-opacity duration-200 group-hover:opacity-40',
          )
        "
        aria-hidden="true"
      />
      <div
        :class="
          classNames(
            'pointer-events-none absolute right-10 bottom-8 w-16 h-16 rounded-full opacity-50',
            palette.decorationShape,
            isHoverable &&
              'transition-opacity duration-200 group-hover:opacity-25',
          )
        "
        aria-hidden="true"
      />
    </template>
    <div
      v-if="isHoverable && !hoverColorName"
      class="pointer-events-none absolute inset-0 rounded-[inherit] bg-transparent transition-colors duration-200 group-hover:bg-black/[0.025] dark:group-hover:bg-white/[0.04]"
      aria-hidden="true"
    />
    <template v-if="variant === 'liquid-glass' && resolvedSpecularMode !== 'none'">
      <!-- Classic: single hairline -->
      <div
        v-if="resolvedSpecularMode === 'classic'"
        :class="
          classNames(
            'pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit]',
            'bg-gradient-to-r from-transparent via-white/40 to-transparent',
            'dark:via-white/10',
          )
        "
        aria-hidden="true"
      />
      <!-- Halo: corner caps + diffuse band + bottom darken -->
      <template v-if="resolvedSpecularMode === 'halo'">
        <!-- Top-left corner cap -->
        <div
          class="pointer-events-none absolute top-0 left-0 w-24 h-12 rounded-tl-[inherit] bg-gradient-to-br from-white/45 via-white/15 to-transparent"
          aria-hidden="true"
        />
        <!-- Top-right corner cap -->
        <div
          class="pointer-events-none absolute top-0 right-0 w-24 h-12 rounded-tr-[inherit] bg-gradient-to-bl from-white/45 via-white/15 to-transparent"
          aria-hidden="true"
        />
        <!-- Diffuse glow band -->
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-white/20 via-white/8 to-transparent"
          aria-hidden="true"
        />
        <!-- Bottom darken (depth cue) -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-transparent to-black/4"
          aria-hidden="true"
        />
      </template>
    </template>

    <div
      :class="
        classNames(
          'relative z-10 flex min-h-0 flex-1 flex-col gap-4',
          isOverlay && 'backdrop-blur-sm',
        )
      "
    >
      <div
        v-if="disabled"
        class="absolute inset-0 z-10 bg-white/70 dark:bg-slate-900/70"
        aria-hidden="true"
      />
      <div
        v-if="mediaPlacement === 'start' || mediaPlacement === 'end'"
        :class="
          classNames(
            'flex min-h-0 flex-1 flex-col gap-6 sm:flex-row',
            mediaPlacement === 'end' ? 'sm:flex-row-reverse' : 'sm:flex-row',
            hasMedia ? 'sm:items-start' : undefined,
          )
        "
      >
        <div
          v-if="hasMedia"
          class="w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10 sm:w-1/3 sm:min-w-[14rem]"
        >
          <slot name="media" />
        </div>
        <div class="flex min-h-0 flex-1 flex-col gap-4">
          <div
            v-if="hasHeaderSection"
            :class="`space-y-3${flexBody ? ' flex flex-col' : ''}`"
          >
            <div v-if="badge || $slots.badge">
              <slot name="badge">
                <span :class="badgeClass">{{ badge }}</span>
              </slot>
            </div>
            <div v-if="title || $slots.title" class="space-y-2">
              <slot name="title">
                <h3
                  :class="
                    classNames(
                      'text-xl font-semibold leading-7',
                      headingClass,
                      titleClassName,
                    )
                  "
                >
                  {{ title }}
                </h3>
              </slot>
            </div>
            <div v-if="subtitle || $slots.subtitle">
              <slot name="subtitle">
                <p
                  :class="
                    classNames(
                      'text-base font-medium leading-6',
                      subtitleClass,
                      subtitleClassName,
                    )
                  "
                >
                  {{ subtitle }}
                </p>
              </slot>
            </div>
            <div v-if="description || $slots.description">
              <slot name="description">
                <p
                  :class="
                    classNames(
                      'text-sm leading-6',
                      descriptionClass,
                      descriptionClassName,
                    )
                  "
                >
                  {{ description }}
                </p>
              </slot>
            </div>
          </div>
          <div v-if="hasBodySection" :class="bodySectionClass">
            <div :class="bodyContentClass" :style="bodyStyle"><slot /></div>
          </div>
          <div v-if="actions && actions.length > 0" :class="actionsWrapperClass">
            <Button
              v-for="(action, index) in actions"
              :key="action.id ?? `${index}`"
              :color="action.color ?? defaultActionColor"
              :size="action.size ?? 'md'"
              :class="
                classNames(actionButtonWidth[actionLayout], action.className)
              "
              v-bind="actionButtonProps(action)"
            >
              <VNodeRenderer :nodes="action.label" />
            </Button>
          </div>
        </div>
      </div>
      <div v-else class="flex min-h-0 flex-1 flex-col gap-4">
        <div
          v-if="hasMedia && mediaPlacement === 'top'"
          class="overflow-hidden"
        >
          <slot name="media" />
        </div>
        <div
          v-if="hasHeaderSection"
          :class="`space-y-3${flexBody ? ' flex flex-col' : ''}`"
        >
          <div v-if="badge || $slots.badge">
            <slot name="badge">
              <span :class="badgeClass">{{ badge }}</span>
            </slot>
          </div>
          <div v-if="title || $slots.title" class="space-y-2">
            <slot name="title">
              <h3
                :class="
                  classNames(
                    'text-xl font-semibold leading-7',
                    headingClass,
                    titleClassName,
                  )
                "
              >
                {{ title }}
              </h3>
            </slot>
          </div>
          <div v-if="subtitle || $slots.subtitle">
            <slot name="subtitle">
              <p
                :class="
                  classNames(
                    'text-base font-medium leading-6',
                    subtitleClass,
                    subtitleClassName,
                  )
                "
              >
                {{ subtitle }}
              </p>
            </slot>
          </div>
          <div v-if="description || $slots.description">
            <slot name="description">
              <p
                :class="
                  classNames(
                    'text-sm leading-6',
                    descriptionClass,
                    descriptionClassName,
                  )
                "
              >
                {{ description }}
              </p>
            </slot>
          </div>
        </div>
        <div v-if="hasBodySection" :class="bodySectionClass">
          <div :class="bodyContentClass" :style="bodyStyle"><slot /></div>
        </div>
        <div v-if="actions && actions.length > 0" :class="actionsWrapperClass">
          <Button
            v-for="(action, index) in actions"
            :key="action.id ?? `${index}`"
            :color="action.color ?? defaultActionColor"
            :size="action.size ?? 'md'"
            :class="
              classNames(actionButtonWidth[actionLayout], action.className)
            "
            v-bind="actionButtonProps(action)"
          >
            <VNodeRenderer :nodes="action.label" />
          </Button>
        </div>
      </div>
    </div>
    <Loader
      v-if="loading"
      overlay
      :variant="loaderType"
      :title="loaderTitle"
      :label="loaderMessage"
      :progress="loaderProgress"
      :color="loaderColor"
    />
  </section>
</template>

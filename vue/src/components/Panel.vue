<script lang="ts">
import type { CSSProperties, VNode } from "vue";
import type { ButtonProps } from "./Button.vue";
import type { LoaderProps } from "./Loader.vue";
import type {
  SurfaceCorner,
  SurfacePadding,
  SurfaceRimKind,
  SurfaceVariant,
  SurfaceTone,
  SurfaceTransparency,
  TrueColor,
} from "../theme/Theme";

/**
 * Aliased from the shared theme rather than redeclared, so the Vue and React
 * kits cannot drift. These were three separate hand-written unions; the corner
 * one had no `rounded-xl` and its `pill` duplicated `rounded-lg`.
 */
export type PanelVariant = SurfaceVariant;
export type PanelTone = SurfaceTone;
export type PanelDecoration = "none" | "gradient" | "shapes" | "both";
export type PanelMediaPlacement = "top" | "start" | "end" | "overlay";
export type PanelPadding = SurfacePadding;
export type PanelCorner = SurfaceCorner;
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
  transparency?: SurfaceTransparency;
  tone?: SurfaceTone;
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
   * Answers the pointer: the surface takes one background step, the rim
   * ignites, and any decoration fades. The step is measured against the
   * variant's own fill — deeper in light, lifted in dark — so a `tonal` card
   * darkens from its tint instead of flashing pale over it.
   *
   * Defaults to `true` when an `onClick` handler is present, otherwise `false`
   * — an `@click` is enough on its own, and the only way to switch the answer
   * off is to pass `hoverable="false"` by hand. The card keeps its pointer
   * cursor either way while it has a click handler; that follows the click, not
   * this prop.
   */
  hoverable?: boolean;
  color?: TrueColor;
  /**
   * Hue the hover, pressed and rim steps take. Defaults to the Panel's own
   * `tone`; with neither, a neutral veil is used instead.
   *
   * Only the hue is yours to pick — the depth of the step stays the theme's,
   * because it is measured against the variant's fill.
   */
  hoverColor?: TrueColor;
  /**
   * The sustained selected/current state: a 2px inset rim in the active hue
   * and a light tone-tinted fill, on the variant's own fill scale. This is
   * selection, not the pointer — the `hoverable` wash and the pressed step
   * keep layering over it, and it stays visible under the `disabled` veil.
   * The hue is `borderColor ?? tone`, with the kit's blue as floor when
   * untinted; an explicit `backgroundColor` wins over the active fill while
   * the rim still ignites. `data-active` is exposed for caller CSS.
   * @default false
   */
  active?: boolean;
  /**
   * The attention call: a glow that swells INWARD from the card's own rim
   * in the accent hue, clipped to the border-box and following the corner
   * radius, so it never spills into the layout. On while set, off while
   * `disabled` — a dimmed card may not demand attention, unlike the
   * selection rim, which is information. The hue is the rim's
   * `borderColor ?? tone` with the blue floor, so a card that is both
   * `active` and pulsing always agrees. Reduced-motion users get a static
   * inner glow instead of the swell.
   * @default false
   */
  pulse?: boolean;
  /**
   * Override the default border color.
   * If not provided, it defaults to the `tone` or `color` prop depending on variant.
   */
  borderColor?: TrueColor;
  /**
   * Override the default background color.
   */
  backgroundColor?: TrueColor;
  /** Set false to keep the normal fill inside a matching parent panel. */
  nestedSurface?: boolean;
  /**
   * Force at least the first nested-panels depth step, even outside a
   * matching parent panel — the fix for a tinted card on a neutral page
   * background, where the fill, rim and page all agree in neutral and the
   * card disappears.
   *
   * The card takes the same wash the nesting ladder paints (`bg-black/4%`
   * light, `dark:bg-white/4%`), so both themes are covered by construction.
   * It is a floor, never an override: a card physically nested two levels
   * deep keeps its deeper step. Unlike the auto ladder, the forced step is
   * not cancelled by `backgroundColor` or `nestedSurface={false}` — the
   * toggle is the caller explicitly asking for the step, and
   * `backgroundColor="neutral"` paints exactly the invisibility being fixed.
   * A documented no-op outside the ladder's tinted variants
   * (`simple`/`tonal`/`subtle`/`glass`/`liquid-glass`): `elevated` and
   * `outlined` separate from the page with fill, rim and shadow instead.
   * @default false
   */
  raisedSurface?: boolean;
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
  none: "",
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

/**
 * Re-exported from the theme for `CollapsiblePanel` and `TimelinePanel`, which
 * import the map directly rather than taking a Panel.
 */
export const paddingStyles: Record<PanelPadding, string> =
  getSurfacePaddingClasses();



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

const defaultActionColor: TrueColor = "blue";
</script>

<script setup lang="ts">
import { computed, inject, provide, useSlots } from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import {
  getPanelToneStyles,
  getSurfaceActiveTokens,
  getSurfaceCornerClass,
  getSurfaceHoverTokens,
  getSurfacePaddingClass,
  getSurfacePaddingClasses,
  getSurfaceTransparencyClasses,
  SURFACE_NEUTRAL_HOVER,
} from "../theme/Theme";
import Loader from "./Loader.vue";

import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";
import { NestedPanelKey } from "../contexts/NestedPanelContext";
import { nestedPanelSurface, NESTED_PANEL_WASH } from "../../../common/theme/nestedPanel";

defineOptions({ name: "Panel", inheritAttrs: false });

const props = withDefaults(defineProps<PanelProps>(), {
  mediaPlacement: "top",
  actionLayout: "auto",
  variant: "elevated",
  nestedSurface: true,
  raisedSurface: false,

  padding: "md",
  corner: "rounded-sm",
  loading: false,
  disabled: false,
  flexBody: false,
  loaderType: "spinner",
  hoverShadow: false,
  /**
   * `undefined` is load-bearing, so it has to be written down. A `boolean` prop
   * the parent omits is *cast to `false`* by Vue unless the option carries a
   * `default` key at all — and `hoverable` is read as `props.hoverable ??
   * Boolean(onClick)`, so an absent prop that arrived as `false` meant the
   * auto-from-`@click` branch could never run. No clickable Panel in this kit
   * had ever answered a pointer.
   */
  hoverable: undefined,
  active: false,
  pulse: false,
  decoration: "none",
  scrollable: true,
  vibrancy: "medium",
   glassOpacity: "frosted",
   specularHighlight: true,
   specularMode: "classic",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const resolvedTone = computed(() => props.tone ?? props.color ?? "none");
const parentPanel = inject(NestedPanelKey, null);
const nestedPanel = computed(() => nestedPanelSurface(parentPanel?.value ?? null, props.variant, resolvedTone.value, props.nestedSurface && !props.backgroundColor, props.raisedSurface));
provide(NestedPanelKey, nestedPanel);
const palette = computed(() => getPanelToneStyles(resolvedTone.value));
const colorPalette = palette;
const isHoverable = computed(
  () => props.hoverable ?? Boolean(restAttrs.value.onClick),
);

/**
 * The hue the hover wears: an explicit `hoverColor`, else the Panel's own tone.
 * `undefined` means no hue at all, and the neutral veil takes the wash. `neutral`
 * counts as a hue here — the depth-aware step is measured against the variant's
 * fill, which the veil never was.
 */
const hoverHue = computed(
  () => props.hoverColor ?? (resolvedTone.value === "none" ? undefined : resolvedTone.value),
);
/**
 * The rim each variant actually draws here. The shared table in the theme
 * describes React's `SURFACE_VARIANT_BASE`; this file's `variantBaseStyles`
 * still puts a `ring-1` on `outlined`, `default` and `liquid-glass` where React
 * puts a `border`, so the ignition has to follow the property that exists in
 * this kit — a rim colour on a property with no width paints nothing, which is
 * the whole class of bug this file keeps re-learning.
 */
const panelRimKind: Record<PanelVariant, SurfaceRimKind> = {
  none: "none",
  elevated: "ring",
  outlined: "ring",
  subtle: "ring",
  tonal: "ring",
  default: "ring",
  // The `glass` case below adds an explicit `border`, so it ignites a border.
  glass: "border",
  simple: "ring",
  "liquid-glass": "ring",
};

const hoverTokens = computed(() =>
  getSurfaceHoverTokens(
    props.variant,
    hoverHue.value ?? "none",
    panelRimKind[props.variant],
  ),
);
const isTintedHover = computed(() => hoverHue.value !== undefined);
/** The Vue Panel has no `clickable` prop; an `onClick` in the attrs is its card action. */
const isCardAction = computed(() => Boolean(restAttrs.value.onClick));

/**
 * The hue the active state wears: the caller's border hue, else the tone,
 * else the kit's blue floor — an untinted card still activates in colour,
 * never gray. `pulse` takes the same hue, so a card that is both selected
 * and calling for attention always has its glow and its rim agree.
 */
const activeHue = computed<TrueColor>(
  () => props.borderColor ?? (resolvedTone.value === "none" ? "blue" : resolvedTone.value),
);
const activePalette = computed(() => getPanelToneStyles(activeHue.value));
// The active fill follows the variant's own fill slot — a tonal card
// deepens tonally, a glass card stays glass, nothing flattens onto one
// wash. An explicit `backgroundColor` beats it: caller's paint wins over
// component state, while the rim still ignites.
const activeFill = computed(() =>
  props.active && !props.backgroundColor
    ? props.variant === "tonal" || props.variant === "simple"
      ? activePalette.value.tonalBg
      : props.variant === "glass" || props.variant === "default"
        ? activePalette.value.glassBg
        : props.variant === "liquid-glass"
          ? activePalette.value.liquidBg
          : activePalette.value.subtleBg
    : undefined,
);
// The 2px inset selection rim: an outline, not a border or a ring, so it
// never fights the variant's resting width classes for one property.
const activeRim = computed(() =>
  props.active ? getSurfaceActiveTokens(activeHue.value).rim : undefined,
);
// `disabled` wins the pulse — the Pill's rule: the rim is information that
// stays under the veil, the pulse is a demand a dimmed card may not make.
const pulsing = computed(() => props.pulse && !props.disabled);

const borderPalette = computed(() =>
  props.borderColor ? getPanelToneStyles(props.borderColor) : undefined,
);
const effectiveBorderClass = computed(() => borderPalette.value?.border);

const bgPalette = computed(() =>
  props.backgroundColor ? getPanelToneStyles(props.backgroundColor) : undefined,
);

const effectiveBgClass = computed(() => {
  if (!props.backgroundColor) return undefined;
  if (props.backgroundColor === "neutral") return "bg-white dark:bg-neutral-900";
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
  if (pulsing.value) {
    // The pulse's hue rides in the `--panel-glow` pair the `.panel-pulse`
    // keyframes read; the alpha lives in their `color-mix`, so there are no
    // per-tone class shapes to safelist — the Select accent precedent the
    // pill follows. Dark prefers `--panel-glow-dark`.
    (styles as Record<string, string>)["--panel-glow"] = `var(--color-${activeHue.value}-500)`;
    (styles as Record<string, string>)["--panel-glow-dark"] = `var(--color-${activeHue.value}-300)`;
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
  return resolvedTone.value === "none"
    ? `bg-white/${litOpacity} dark:bg-neutral-900/${drkOpacity}`
    : `bg-${resolvedTone.value}-50/${litOpacity} dark:bg-${resolvedTone.value}-500/${drkOpacity}`;
});

const variantClasses = computed(() => getSurfaceTransparencyClasses(classNames((() => {
  switch (props.variant) {
    case "none":
      return activeFill.value ?? (resolvedTone.value === "none" ? "" : palette.value.subtleBg);
    case "outlined":
      return classNames(
        // Active swaps the base's white fill for the active tint; the
        // hairline keeps its width and colour, and the 2px outline paints
        // over it, so no double rim shows.
        activeFill.value ? "border" : variantBaseStyles.outlined,
        effectiveBorderClass.value ?? palette.value.border,
        activeFill.value,
      );
    case "subtle":
      return classNames(
        variantBaseStyles.subtle,
        effectiveBorderClass.value ?? palette.value.border,
        effectiveBgClass.value ?? activeFill.value ?? palette.value.subtleBg,
      );
    case "tonal":
      return classNames(
        variantBaseStyles.tonal,
        effectiveBgClass.value ?? activeFill.value ?? palette.value.tonalBg,
        effectiveBorderClass.value,
      );
    case "default":
      return classNames(
        // Same fill-swap shape as `outlined`: keep the chrome, swap the fill.
        activeFill.value ? "border backdrop-blur-xl shadow-2xl" : variantBaseStyles.default,
        effectiveBorderClass.value ?? "border border-white/40",
        activeFill.value,
      );
    case "glass":
      return classNames(
        variantBaseStyles.glass,
        "border",
        effectiveBorderClass.value ?? colorPalette.value.glassBorder,
        effectiveBgClass.value ?? activeFill.value ?? palette.value.glassBg,
      );
    case "liquid-glass":
      return classNames(
        "backdrop-blur-2xl ring-1 ring-transparent dark:ring-white/5",
        vibrancyClass.value,
        activeFill.value ?? glassFillClass.value,
        effectiveBorderClass.value ?? palette.value.liquidBorder,
        palette.value.liquidShadow,
        palette.value.liquidHeading,
      );
    case "simple":
      return classNames(
        variantBaseStyles.simple,
        effectiveBgClass.value ?? activeFill.value ?? palette.value.tonalBg,
        effectiveBorderClass.value,
      );
    case "elevated":
    default: {
      // A caller-supplied background replaces the variant's own white fill
      // but keeps its shadow and ring; the active fill does the same on the
      // active hue, and the caller's paint still beats it.
      const elevatedFill = effectiveBgClass.value ?? activeFill.value;
      return classNames(
        elevatedFill
          ? "text-neutral-900 shadow-xl ring-1 ring-black/5 dark:text-neutral-100 dark:ring-white/10"
          : variantBaseStyles.elevated,
        effectiveBorderClass.value,
        elevatedFill,
      );
    }
  }
})(),
  // Both states go through the transparency rewrite together: a panel that
  // precomposes its alpha turns every background step into the
  // `--ui-surface-color` / `--ui-surface-alpha` pair `ui-surface-fill` reads, and
  // a plain `active:bg-*` left outside that call competes with it for
  // `background-color`, with stylesheet order as the referee.
  isHoverable.value && !props.disabled && isTintedHover.value && hoverTokens.value.wash,
  isCardAction.value &&
    isHoverable.value &&
    !props.disabled &&
    isTintedHover.value &&
    hoverTokens.value.pressed), props.variant, props.transparency));

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
    getSurfacePaddingClass(props.padding),
    getSurfaceCornerClass(props.corner),
    props.fullWidth ? "w-full" : undefined,
    isOverlay.value ? overlayClasses.value : undefined,
    props.hoverShadow && "hover:shadow-xl hover:-translate-y-[1px]",
    // One transition list, never two: `transition-shadow` and `transition-colors`
    // on the same element leave the winner to the stylesheet's order, and the one
    // that loses snaps. A panel that lifts and tints eases both, plus the
    // transform the lift uses.
    (props.hoverShadow || isHoverable.value) &&
      classNames(
        "duration-200",
        props.hoverShadow && isHoverable.value
          ? "transition-[background-color,box-shadow,transform]"
          : props.hoverShadow
            ? "transition-shadow"
            : "transition-colors",
      ),
    isHoverable.value && "group",
    // The pointer cursor follows an `@click`, as it always has in this kit — it
    // is not a second copy of `hoverable`. Tying it there meant a card that
    // opted out of the tint (`:hoverable="false"`) silently lost its cursor
    // too, which React's Panel never did. A disabled card says so with the
    // cursor instead.
    (isHoverable.value || isCardAction.value) &&
      (props.disabled ? "cursor-not-allowed" : "cursor-pointer"),
    isHoverable.value && !props.disabled && hoverTokens.value.rim,
    // The selection rim is not a hover answer — a selected card wears it
    // disabled or not, and the outline layer ignores the variants' resting
    // border/ring widths entirely.
    activeRim.value,
    // The attention glow is the stylesheet's inset box-shadow — its own
    // paint layer, so hover wash, selection rim and pulse all read at once.
    pulsing.value && "panel-pulse",
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
    :data-tone="resolvedTone"
    :data-variant="variant"
    :data-active="active || undefined"
    :class="sectionClass"
    :aria-busy="loading"
    v-bind="restAttrs"
    :style="resolvedStyle"
  >
    <div v-if="nestedPanel.depth > 0 && !isOverlay" aria-hidden="true" data-nested-panel-wash="" :class="classNames('pointer-events-none absolute inset-0', NESTED_PANEL_WASH[nestedPanel.depth])" />
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
    <!-- The untinted hover. A tinted panel takes a real background step on the
         section instead (`hoverTokens.wash`), which is what lets the transparency
         path precompose it; this is the fallback for a card with no hue to wash
         with, and it composites over whatever is under it. -->
    <div
      v-if="isHoverable && !isTintedHover && !disabled"
      :class="
        classNames(
          'pointer-events-none absolute inset-0 rounded-[inherit] bg-transparent transition-colors duration-200',
          SURFACE_NEUTRAL_HOVER.wash,
          SURFACE_NEUTRAL_HOVER.pressed,
        )
      "
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

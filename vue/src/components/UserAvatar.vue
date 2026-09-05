<script lang="ts">
import type { VNode } from "vue";
import type { IconName } from "../icons/registry";
import type { ControlSize, TrueColor } from "../theme/Theme";

export const USER_AVATAR_SHAPES = ["circle", "rounded", "square"] as const;
export type UserAvatarShape = (typeof USER_AVATAR_SHAPES)[number];

/**
 * PrimeVue Avatar's size names, accepted alongside the shared control ladder
 * so a `size="large"` avatar drops straight in from a PrimeVue codebase.
 */
export const USER_AVATAR_PRESET_SIZES = ["normal", "large", "xlarge"] as const;
export type UserAvatarPresetSize = (typeof USER_AVATAR_PRESET_SIZES)[number];

/** Control ladder rung, PrimeVue preset name, or an exact pixel box. */
export type UserAvatarSize = ControlSize | UserAvatarPresetSize | number;

export interface UserAvatarUser {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UserAvatarProps {
  user?: UserAvatarUser | null;
  /**
   * Scale on the shared control ladder. Was a bare pixel number, so an avatar
   * could not be told to match the `sm` Button beside it. A number still
   * works and wins, for the call sites that need an exact box; PrimeVue's
   * `normal` / `large` / `xlarge` are mapped onto `md` / `lg` / `xl`.
   * @default "md"
   */
  size?: UserAvatarSize;
  /** Accent for the fallback chip. @default "neutral" */
  tone?: TrueColor;
  /** @default "circle" */
  shape?: UserAvatarShape;
  /** @deprecated Use `shape`. */
  variant?: UserAvatarShape;
  /**
   * Text content, the PrimeVue `label` parity prop. Wins over `icon` and the
   * image, exactly as it does there, and gives the avatar its accessible name
   * when there is no user behind it.
   */
  label?: string;
  /** Registry icon name or node, the PrimeVue `icon` parity prop. */
  icon?: IconName | VNode;
  /**
   * Direct image URL, the PrimeVue `image` parity prop. `user.avatarUrl`
   * still resolves when this is absent; either way a broken URL falls back
   * to the label, initial or glyph instead of breaking the layout.
   */
  image?: string;
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import classNames from "classnames";
import CustomIcon from "./CustomIcon.vue";
import { getPillColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "UserAvatar", inheritAttrs: false });

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: "md",
  tone: "neutral",
});

// The PrimeVue `@error` parity: fires when the image fails, right before the
// avatar drops back to its label, initial or glyph.
const emit = defineEmits<{ (event: "error", payload: Event): void }>();

const attrs = useAttrs();
const { classAttr, restAttrs } = useClassAttrs();

const SIZE_PX: Record<ControlSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};

const SIZE_TEXT: Record<ControlSize, string> = {
  xs: "text-[10px]",
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

const SHAPE_CLASS: Record<UserAvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-md",
  square: "rounded-none",
};

/** PrimeVue's size names, folded onto the shared ladder. */
const PRESET_TO_CONTROL: Record<UserAvatarPresetSize, ControlSize> = {
  normal: "md",
  large: "lg",
  xlarge: "xl",
};

/** The nearest control size for an explicit pixel box, for the type scale. */
const sizeKeyFor = (px: number): ControlSize =>
  (Object.keys(SIZE_PX) as ControlSize[]).reduce((best, key) =>
    Math.abs(SIZE_PX[key] - px) < Math.abs(SIZE_PX[best] - px) ? key : best,
  );

const hasError = ref(false);

// A direct `image` wins over `user.avatarUrl`, mirroring how PrimeVue's
// `image` prop is the one source there while our `user` object stays.
const imgSrc = computed(() => props.image ?? props.user?.avatarUrl ?? null);

watch(imgSrc, () => {
  hasError.value = false;
});

const px = computed(() => {
  if (typeof props.size === "number") return props.size;
  if (props.size in PRESET_TO_CONTROL) {
    return SIZE_PX[PRESET_TO_CONTROL[props.size as UserAvatarPresetSize]];
  }
  return SIZE_PX[props.size as ControlSize];
});

/** Ladder rung for any accepted size spelling, for the type and icon scale. */
const sizeKey = computed(() => {
  if (typeof props.size === "number") return sizeKeyFor(props.size);
  if (props.size in PRESET_TO_CONTROL) {
    return PRESET_TO_CONTROL[props.size as UserAvatarPresetSize];
  }
  return props.size as ControlSize;
});

const resolvedShape = computed(() => props.shape ?? props.variant ?? "circle");
const shapeClass = computed(() => SHAPE_CLASS[resolvedShape.value]);

// Was a hardcoded `bg-slate-200 text-slate-600` — the chip was slate whatever
// the app's palette, and there was no way to tone it.
const chip = computed(() => getPillColorClasses(props.tone, "soft"));

const identifier = computed(
  () => props.user?.name || props.user?.username || props.user?.email,
);

/**
 * The avatar stands for a person, so it needs a name of its own; it used to be
 * an unlabelled `<div>` with an `<img alt>` only in the happy path. An explicit
 * `aria-label` attr still wins.
 *
 * (This note lives here rather than in the template because a template comment
 * is a real node, and a comment beside the root makes the component
 * multi-root — which silently breaks attribute inheritance.)
 */
const ariaLabel = computed(
  () =>
    (attrs["aria-label"] as string | undefined) ??
    identifier.value ??
    props.label ??
    "User avatar",
);

const title = computed(
  () => (attrs.title as string | undefined) ?? identifier.value,
);

// Shared skin for everything that draws on the tone chip: label, icon and the
// initial/glyph fallback.
const chipInnerClass = computed(() =>
  classNames(
    "flex h-full w-full items-center justify-center overflow-hidden font-bold",
    SIZE_TEXT[sizeKey.value],
    chip.value.base,
    shapeClass.value,
  ),
);

const rootClass = computed(() =>
  classNames(
    "flex items-center justify-center overflow-hidden",
    shapeClass.value,
    classAttr.value,
  ),
);

const imgClass = computed(() =>
  classNames("h-full w-full object-cover", shapeClass.value),
);

const onError = (event: Event) => {
  hasError.value = true;
  emit("error", event);
};
</script>

<template>
  <div
    v-bind="restAttrs"
    role="img"
    :aria-label="ariaLabel"
    :title="title"
    :class="rootClass"
    :style="{ width: `${px}px`, height: `${px}px` }"
  >
    <!-- The PrimeVue `template` slot: full control of the inside. -->
    <slot v-if="$slots.default" />
    <template v-else>
      <!-- PrimeVue's own precedence: label over icon over image. -->
      <div v-if="label" :class="chipInnerClass">
        <span class="max-w-full truncate leading-none">{{ label }}</span>
      </div>
      <div v-else-if="icon" :class="chipInnerClass">
        <CustomIcon
          v-if="typeof icon === 'string'"
          :icon="icon as IconName"
          :size="sizeKey"
        />
        <component :is="icon" v-else />
      </div>
      <img
        v-else-if="!hasError && imgSrc"
        :src="imgSrc"
        alt=""
        :class="imgClass"
        @error="onError"
      />
      <div v-else :class="chipInnerClass">
        <template v-if="identifier">{{ identifier[0].toUpperCase() }}</template>
        <!-- Decorative: the wrapper already carries the accessible name. -->
        <CustomIcon v-else icon="User" size="xs" aria-hidden="true" />
      </div>
    </template>
  </div>
</template>

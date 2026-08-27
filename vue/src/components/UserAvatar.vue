<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export const USER_AVATAR_SHAPES = ["circle", "rounded", "square"] as const;
export type UserAvatarShape = (typeof USER_AVATAR_SHAPES)[number];

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
   * works and wins, for the call sites that need an exact box.
   * @default "md"
   */
  size?: ControlSize | number;
  /** Accent for the fallback chip. @default "neutral" */
  tone?: TrueColor;
  /** @default "circle" */
  shape?: UserAvatarShape;
  /** @deprecated Use `shape`. */
  variant?: UserAvatarShape;
}

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

/** The nearest control size for an explicit pixel box, for the type scale. */
const sizeKeyFor = (px: number): ControlSize =>
  (Object.keys(SIZE_PX) as ControlSize[]).reduce((best, key) =>
    Math.abs(SIZE_PX[key] - px) < Math.abs(SIZE_PX[best] - px) ? key : best,
  );
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import CustomIcon from "./CustomIcon.vue";
import { getPillColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "UserAvatar", inheritAttrs: false });

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: "md",
  tone: "neutral",
});

const { classAttr, restAttrs } = useClassAttrs();

const hasError = ref(false);
const imgSrc = ref<string | null>(null);

watch(
  () => props.user?.avatarUrl,
  (url) => {
    hasError.value = false;
    imgSrc.value = url ?? null;
  },
  { immediate: true },
);

const px = computed(() =>
  typeof props.size === "number" ? props.size : SIZE_PX[props.size],
);
const sizeKey = computed(() =>
  typeof props.size === "number" ? sizeKeyFor(props.size) : props.size,
);
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
 * an unlabelled `<div>` with an `<img alt>` only in the happy path.
 *
 * (This note lives here rather than in the template because a template comment
 * is a real node, and a comment beside the root makes the component
 * multi-root — which silently breaks attribute inheritance.)
 */
const label = computed(() => identifier.value ?? "User avatar");

const rootClass = computed(() =>
  classNames(
    "flex items-center justify-center overflow-hidden",
    shapeClass.value,
    classAttr.value,
  ),
);

const fallbackClass = computed(() =>
  classNames(
    "flex h-full w-full items-center justify-center font-bold",
    SIZE_TEXT[sizeKey.value],
    chip.value.base,
    shapeClass.value,
  ),
);
</script>

<template>
  <div
    v-bind="restAttrs"
    role="img"
    :aria-label="label"
    :title="identifier"
    :class="rootClass"
    :style="{ width: `${px}px`, height: `${px}px` }"
  >
    <img
      v-if="!hasError && imgSrc"
      :src="imgSrc"
      alt=""
      :class="classNames('h-full w-full object-cover', shapeClass)"
      @error="hasError = true"
    />
    <div v-else :class="fallbackClass">
      <template v-if="identifier">{{ identifier[0].toUpperCase() }}</template>
      <!-- Decorative: the wrapper already carries the accessible name. -->
      <CustomIcon v-else icon="User" size="xs" aria-hidden="true" />
    </div>
  </div>
</template>

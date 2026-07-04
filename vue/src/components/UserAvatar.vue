<script lang="ts">
export interface UserAvatarUser {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UserAvatarProps {
  user?: UserAvatarUser | null;
  size?: number;
  variant?: "circle" | "rounded" | "square";
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "UserAvatar", inheritAttrs: false });

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: 32,
  variant: "circle",
});

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const hasError = ref(false);
const imgSrc = ref<string | null>(null);

watch(
  [() => props.user?.avatarUrl, () => props.size],
  () => {
    hasError.value = false;
    if (props.user?.avatarUrl) {
      imgSrc.value = props.user.avatarUrl;
    } else {
      imgSrc.value = null;
    }
  },
  { immediate: true },
);

const roundedClass = computed(() =>
  props.variant === "circle"
    ? "rounded-full"
    : props.variant === "rounded"
      ? "rounded-md"
      : "rounded-none",
);

const baseClasses = computed(
  () =>
    `flex items-center justify-center font-bold text-slate-600 overflow-hidden ${roundedClass.value} ${classAttr.value ?? ""}`,
);

const sizeStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const fallbackIdentifier = computed(
  () => props.user?.name || props.user?.username || props.user?.email,
);
</script>

<template>
  <div
    v-if="!user || !user.avatarUrl"
    :class="baseClasses"
    :style="sizeStyle"
    v-bind="restAttrs"
  >
    <div
      :class="`w-full h-full bg-slate-200 flex items-center justify-center text-xs dark:bg-slate-700 dark:text-slate-300 ${roundedClass}`"
    >
      <template v-if="fallbackIdentifier">
        {{ fallbackIdentifier[0].toUpperCase() }}
      </template>
      <VNodeRenderer v-else :nodes="renderIcon('User', 'xs')" />
    </div>
  </div>
  <div
    v-else
    :class="`${baseClasses} bg-transparent`"
    :style="sizeStyle"
    v-bind="restAttrs"
  >
    <img
      v-if="!hasError && imgSrc"
      :src="imgSrc"
      :alt="user?.name || user?.username || 'User Avatar'"
      :class="`h-full w-full object-cover ${roundedClass}`"
      @error="hasError = true"
    />
    <div
      v-else
      :class="`w-full h-full bg-slate-200 flex items-center justify-center text-xs dark:bg-slate-700 dark:text-slate-300 ${roundedClass}`"
    >
      <template v-if="fallbackIdentifier">
        {{ fallbackIdentifier[0].toUpperCase() }}
      </template>
      <VNodeRenderer v-else :nodes="renderIcon('User', 'xs')" />
    </div>
  </div>
</template>

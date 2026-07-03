<script lang="ts">
import type { InputProps } from "./Input.vue";

export type PasswordInputProps = Omit<
  InputProps,
  "trailingIcon" | "onTrailingIconClick"
>;
</script>

<script setup lang="ts">
import { computed, h, ref } from "vue";
import Input from "./Input.vue";
import { EyeOpen } from "../icons/components/EyeOpen";
import { EyeClosed } from "../icons/components/EyeClosed";

defineOptions({ name: "PasswordInput", inheritAttrs: false });

const showPassword = ref(false);

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const el = computed(() => inputRef.value?.el ?? null);
defineExpose({ el });

const trailingIcon = computed(() =>
  showPassword.value
    ? h(EyeClosed, { class: "w-4 h-4" })
    : h(EyeOpen, { class: "w-4 h-4" }),
);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <Input
    ref="inputRef"
    v-bind="$attrs"
    :type="showPassword ? 'text' : 'password'"
    :trailing-icon="trailingIcon"
    :on-trailing-icon-click="toggleShowPassword"
  />
</template>

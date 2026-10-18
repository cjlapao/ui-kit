<script lang="ts">
import type { InputProps } from "./Input.vue";

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "trailingIcon" | "onTrailingIconClick"> {
  /**
   * Offer the reveal toggle at all. Turn it off for a field the user should
   * never be able to read back (a stored secret being re-entered).
   * @default true
   */
  revealable?: boolean;
  /** Controlled reveal state. Omit for uncontrolled. */
  revealed?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import Input from "./Input.vue";

defineOptions({ name: "PasswordInput", inheritAttrs: false });

const props = withDefaults(defineProps<PasswordInputProps>(), {
  revealable: true,
  // `withDefaults` casts an absent boolean to `false`, which would make the
  // field permanently controlled-and-hidden. It has to stay `undefined`.
  revealed: undefined,
  disabled: undefined,
});

// Vue's `Input` declares no `readOnly` prop (React's has it through
// `InputHTMLAttributes`), so a read-only field arrives here as a plain attr.
const attrs = useAttrs();
const isReadOnly = computed(
  () => attrs.readonly !== undefined && attrs.readonly !== false,
);

const emit = defineEmits<{ "update:revealed": [revealed: boolean] }>();

/**
 * Everything `Input` owns, handed straight back to it.
 *
 * This is not optional plumbing: `PasswordInputProps extends InputProps`, so
 * Vue declares every one of `Input`'s props on *this* component — which
 * removes them from `$attrs`. The template forwarded only `$attrs`, so
 * `size`, `variant`, `tone`, the validation status and every other declared
 * prop was silently swallowed and `Input` fell back to its defaults. Only
 * native HTML attributes (`placeholder`, `autocomplete`) ever got through,
 * which is exactly why it looked like it worked.
 *
 * Built by removal rather than by listing, so a prop added to `Input` reaches
 * it without an edit here.
 */
const forwarded = computed(() => {
  const { revealable: _r, revealed: _v, ...rest } = props;
  // Drop absent values so `Input`'s own defaults still apply.
  return Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined),
  );
});

const internal = ref(false);
const isControlled = computed(() => props.revealed !== undefined);
const show = computed(() =>
  isControlled.value ? Boolean(props.revealed) : internal.value,
);

// The toggle is pointless on a field the user cannot edit, and it used to stay
// live there — a disabled password field could still be read.
const canReveal = computed(
  () => props.revealable && !props.disabled && !isReadOnly.value,
);

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const el = computed(() => inputRef.value?.el ?? null);
defineExpose({ el });

const toggle = () => {
  const next = !show.value;
  if (!isControlled.value) internal.value = next;
  emit("update:revealed", next);
};

// Registry names, not raw icon components with a hardcoded `w-4 h-4`. The
// literal size meant the glyph stayed 16px at every `size`, so it was visibly
// too small on `lg` and `xl`, and it bypassed the kit's icon renderer.
const trailingIcon = computed(() =>
  canReveal.value ? (show.value ? "EyeClosed" : "EyeOpen") : undefined,
);
</script>

<template>
  <Input
    ref="inputRef"
    v-bind="{ ...$attrs, ...forwarded }"
    :type="show && canReveal ? 'text' : 'password'"
    :trailing-icon="trailingIcon"
    :on-trailing-icon-click="canReveal ? toggle : undefined"
    :trailing-icon-label="show ? 'Hide password' : 'Show password'"
  />
</template>

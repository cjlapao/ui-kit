<script lang="ts">
export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueArrayFieldProps {
  label: string;
  hint?: string;
  modelValue: KeyValuePair[];
  error?: string;
  help?: string;
  isVisible?: boolean;
  addLabel?: string;
}
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import Button from "./Button.vue";
import CollapsibleHelpText from "./CollapsibleHelpText.vue";
import Input from "./Input.vue";

defineOptions({ name: "KeyValueArrayField" });

const props = withDefaults(defineProps<KeyValueArrayFieldProps>(), {
  isVisible: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: KeyValuePair[]): void;
}>();

const pairs = ref<KeyValuePair[]>(props.modelValue || []);

watch(
  () => props.modelValue,
  (value) => {
    pairs.value = value || [];
  },
);

const handleAddPair = () => {
  const nextPairs = [...pairs.value, { key: "", value: "" }];
  pairs.value = nextPairs;
  emit("update:modelValue", nextPairs);
};

const handleRemovePair = (index: number) => {
  const nextPairs = pairs.value.filter((_, i) => i !== index);
  pairs.value = nextPairs;
  emit("update:modelValue", nextPairs);
};

const handlePairChange = (
  index: number,
  field: "key" | "value",
  fieldValue: string,
) => {
  const nextPairs = pairs.value.map((pair, i) =>
    i === index ? { ...pair, [field]: fieldValue } : pair,
  );
  pairs.value = nextPairs;
  emit("update:modelValue", nextPairs);
};
</script>

<template>
  <div
    v-if="isVisible"
    class="space-y-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50"
  >
    <div class="flex flex-col gap-1">
      <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {{ label }}
      </span>
      <span v-if="hint" class="text-xs text-slate-500 dark:text-slate-400">
        {{ hint }}
      </span>
    </div>
    <CollapsibleHelpText
      v-if="help"
      :text="help"
      tone="indigo"
      :max-length="200"
      show-icon
    />
    <div class="space-y-3">
      <div
        v-for="(pair, index) in pairs"
        :key="`${pair.key}-${index}`"
        class="flex flex-wrap gap-3"
      >
        <Input
          class="flex-1 min-w-[140px]"
          size="sm"
          placeholder="Key"
          :value="pair.key"
          @input="
            handlePairChange(
              index,
              'key',
              ($event.target as HTMLInputElement).value,
            )
          "
        />
        <Input
          class="flex-1 min-w-[140px]"
          size="sm"
          placeholder="Value"
          :value="pair.value"
          @input="
            handlePairChange(
              index,
              'value',
              ($event.target as HTMLInputElement).value,
            )
          "
        />
        <Button
          variant="soft"
          color="rose"
          size="sm"
          class="flex-shrink-0"
          @click="handleRemovePair(index)"
        >
          Remove
        </Button>
      </div>
    </div>
    <Button variant="outline" color="blue" size="sm" @click="handleAddPair">
      {{ addLabel ?? `Add ${label}` }}
    </Button>
    <span v-if="error" class="text-xs text-rose-500">{{ error }}</span>
  </div>
</template>

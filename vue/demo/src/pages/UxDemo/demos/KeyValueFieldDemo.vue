<script setup lang="ts">
import { ref } from "vue";
import { KeyValueArrayField, Input } from "@cjlapao/ui-kit-vue";
import type { KeyValuePair } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

const keyValuePairs = ref<KeyValuePair[]>([
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
  { key: "host", value: "localhost" },
  { key: "port", value: "27017" },
]);
</script>

<template>
  <PlaygroundSection
    title="Key/Value Array"
    label="[KeyValueArrayField]"
    description="Collect arbitrary metadata pairs."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Add button label</span>
          <Input size="sm" model-value="Add entry" readonly />
          <span class="text-xs text-neutral-500">(Static in demo)</span>
        </label>
      </div>
    </template>
    <template #preview>
      <KeyValueArrayField
        label="Metadata"
        hint="Store extra settings via key/value pairs"
        v-model="keyValuePairs"
        help="Use this field to supply extra environment variables or service metadata."
      />
    </template>
  </PlaygroundSection>
</template>

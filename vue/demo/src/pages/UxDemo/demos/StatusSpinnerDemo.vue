<script setup lang="ts">
import { ref } from "vue";
import {
  StatusSpinner,
  MultiToggle,
  Toggle,
  type StatusSpinnerIntent,
  type StatusSpinnerProps,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  statusSpinnerIntentOptions,
  statusSpinnerSizeOptions,
} from "../constants";

// StatusSpinnerSize is not re-exported from the kit index; derive it from StatusSpinnerProps.
type StatusSpinnerSize = NonNullable<StatusSpinnerProps["size"]>;

const statusSpinnerIntent = ref<StatusSpinnerIntent>("neutral");
const statusSpinnerSize = ref<StatusSpinnerSize>("md");
const statusSpinnerAnimated = ref<boolean>(true);
</script>

<template>
  <PlaygroundSection
    title="Status Spinner"
    label="[StatusSpinner]"
    description="Labeled spinner for async states."
  >
    <template #controls>
      <div class="grid gap-3 text-sm md:grid-cols-2">
        <label class="flex flex-col gap-2">
          <span>Intent</span>
          <MultiToggle
            full-width
            size="sm"
            :options="statusSpinnerIntentOptions"
            :model-value="statusSpinnerIntent"
            @update:model-value="
              (value: string) =>
                (statusSpinnerIntent = value as StatusSpinnerIntent)
            "
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Size</span>
          <MultiToggle
            full-width
            size="sm"
            :options="statusSpinnerSizeOptions"
            :model-value="statusSpinnerSize"
            @update:model-value="
              (value: string) =>
                (statusSpinnerSize = value as StatusSpinnerSize)
            "
          />
        </label>
        <label class="flex items-center justify-between gap-2">
          <span>Animate</span>
          <Toggle size="sm" v-model="statusSpinnerAnimated" />
        </label>
      </div>
    </template>
    <template #preview>
      <div class="flex flex-wrap items-center gap-6">
        <StatusSpinner
          :intent="statusSpinnerIntent"
          :size="statusSpinnerSize"
          :animated="statusSpinnerAnimated"
          label="Deploying update"
        />
        <StatusSpinner intent="success" size="sm" label="Healthy" />
        <StatusSpinner
          intent="warning"
          size="md"
          :animated="statusSpinnerAnimated"
          label="Pending approval"
        />
        <StatusSpinner
          intent="danger"
          size="sm"
          :animated="false"
          label="Failed stage"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>

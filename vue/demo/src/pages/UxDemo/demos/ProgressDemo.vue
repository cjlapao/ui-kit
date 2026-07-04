<script setup lang="ts">
import { ref } from "vue";
import { Progress, MultiToggle } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { colorOptions } from "../constants";
import type {
  SpinnerColor,
  ProgressMotion,
  ProgressMotionSpeed,
  ProgressMotionDirection,
} from "@cjlapao/ui-kit-vue";

type ProgressSize = "xs" | "sm" | "md" | "lg";

const progressValue = ref(45);
const progressSize = ref<ProgressSize>("md");
const progressColor = ref<SpinnerColor>("blue");
const progressMotion = ref<ProgressMotion>("shimmer");
const progressMotionSpeed = ref<ProgressMotionSpeed>("normal");
const progressMotionDirection = ref<ProgressMotionDirection>("forward");
</script>

<template>
  <PlaygroundSection
    title="Progress"
    label="[Progress]"
    description="Deterministic progress bar with shimmer."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Value ({{ progressValue }}%)</span>
          <input
            type="range"
            min="0"
            max="100"
            :value="progressValue"
            class="w-full accent-blue-500"
            @input="progressValue = Number(($event.target as HTMLInputElement).value)"
          />
        </label>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'XS', value: 'xs' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
              ]"
              :model-value="progressSize"
              size="sm"
              @update:model-value="progressSize = $event as ProgressSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Color</span>
            <MultiToggle
              full-width
              :options="colorOptions"
              :model-value="progressColor"
              size="sm"
              @update:model-value="progressColor = $event as SpinnerColor"
            />
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span>Motion</span>
          <MultiToggle
            full-width
            :options="[
              { label: 'None', value: 'none' },
              { label: 'Shimmer', value: 'shimmer' },
              { label: 'Pulse', value: 'pulse' },
              { label: 'Stripes', value: 'stripes' },
              { label: 'Stripes + Shimmer', value: 'stripes-shimmer' },
              { label: 'Both', value: 'shimmer-pulse' },
            ]"
            :model-value="progressMotion"
            size="sm"
            @update:model-value="progressMotion = $event as ProgressMotion"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Motion Speed</span>
          <MultiToggle
            full-width
            :options="[
              { label: 'Slow', value: 'slow' },
              { label: 'Normal', value: 'normal' },
              { label: 'Fast', value: 'fast' },
            ]"
            :model-value="progressMotionSpeed"
            size="sm"
            @update:model-value="progressMotionSpeed = $event as ProgressMotionSpeed"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Direction</span>
          <MultiToggle
            full-width
            :options="[
              { label: 'Forward', value: 'forward' },
              { label: 'Reverse', value: 'reverse' },
            ]"
            :model-value="progressMotionDirection"
            size="sm"
            @update:model-value="progressMotionDirection = $event as ProgressMotionDirection"
          />
        </label>
      </div>
    </template>
    <template #preview>
      <div class="space-y-3">
        <Progress
          :value="progressValue"
          :size="progressSize"
          :color="progressColor"
          :motion="progressMotion"
          :motion-speed="progressMotionSpeed"
          :motion-direction="progressMotionDirection"
        />
        <Progress
          :value="100"
          size="sm"
          color="emerald"
          motion="stripes-shimmer"
          :motion-direction="progressMotionDirection"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>

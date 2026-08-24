<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  MultiToggle,
  Panel,
  Progress,
  Select,
  Toggle,
  CONTROL_SIZES,
  PROGRESS_MOTIONS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  ProgressCorner,
  ProgressMotion,
  ProgressMotionDirection,
  ProgressMotionSpeed,
  ProgressSize,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  progressCornerOptions,
  progressMotionDirectionOptions,
  progressMotionOptions,
  progressMotionSpeedOptions,
  trueColorOptions,
} from "../constants";

const value = ref(45);
const size = ref<ProgressSize>("md");
const color = ref<TrueColor>("blue");
const motion = ref<ProgressMotion>("shimmer");
const motionSpeed = ref<ProgressMotionSpeed>("normal");
const motionDirection = ref<ProgressMotionDirection>("forward");
const corner = ref<ProgressCorner>("full");

const indeterminate = ref(false);
const showLabel = ref(true);
const showValue = ref(true);
const running = ref(false);
const onGlass = ref(false);

// A bar that never moves hides every timing bug in the transition.
let timer: number | undefined;
watch(running, (isRunning) => {
  window.clearInterval(timer);
  if (!isRunning) return;
  timer = window.setInterval(() => {
    value.value = value.value >= 100 ? 0 : value.value + 7;
  }, 600);
});
onUnmounted(() => window.clearInterval(timer));

const stateToggles = [
  { label: "Indeterminate", model: indeterminate },
  { label: "Label", model: showLabel },
  { label: "Show value", model: showValue },
  { label: "Animate the value", model: running },
  { label: "On a glass panel", model: onGlass },
];

const formatDisk = (v: number, percent: number) =>
  `${v} MB of 1024 MB (${Math.round(percent)}%)`;
</script>

<template>
  <PlaygroundSection
    title="Progress"
    label="[Progress]"
    description="A determinate or indeterminate progress bar. Size and tone come from the shared scales; the motion overlays are driven by classes so a reduced-motion preference can switch them off."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Value — {{ value }}
          </span>
          <input
            type="range"
            :min="0"
            :max="100"
            v-model.number="value"
            :disabled="indeterminate"
            class="w-full accent-blue-500 disabled:opacity-50"
          />
        </label>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as ProgressSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Tone
            </span>
            <Select
              :model-value="color"
              @update:model-value="color = $event as TrueColor"
            >
              <option
                v-for="option in trueColorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
        </div>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Motion
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="progressMotionOptions"
            :model-value="motion"
            @update:model-value="motion = $event as ProgressMotion"
          />
        </label>

        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Speed
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="progressMotionSpeedOptions"
              :model-value="motionSpeed"
              @update:model-value="motionSpeed = $event as ProgressMotionSpeed"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Direction
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="progressMotionDirectionOptions"
              :model-value="motionDirection"
              @update:model-value="
                motionDirection = $event as ProgressMotionDirection
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Corner
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="progressCornerOptions"
              :model-value="corner"
              @update:model-value="corner = $event as ProgressCorner"
            />
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Toggle
            v-for="toggle in stateToggles"
            :key="toggle.label"
            size="sm"
            :label="toggle.label"
            v-model="toggle.model.value"
          />
        </div>

        <p class="text-xs opacity-70">
          <strong>Indeterminate</strong> drops <code>aria-valuenow</code>
          entirely — that absence is what tells a screen reader the extent is
          unknown. A <strong>label</strong> also becomes the bar's accessible
          name; without one, <code>role="progressbar"</code> is announced as
          just “progress bar”.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="p-4">
        <Panel
          :variant="onGlass ? 'liquid-glass' : 'outlined'"
          :tone="onGlass ? color : 'neutral'"
          padding="md"
        >
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Current settings
              </span>
              <Progress
                :value="value"
                :size="size"
                :color="color"
                :motion="motion"
                :motion-speed="motionSpeed"
                :motion-direction="motionDirection"
                :corner="corner"
                :indeterminate="indeterminate"
                :label="showLabel ? 'Restoring snapshot' : undefined"
                :show-value="showValue"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every motion
              </span>
              <div class="space-y-3">
                <Progress
                  v-for="each in PROGRESS_MOTIONS"
                  :key="each"
                  :value="value"
                  :size="size"
                  :color="color"
                  :motion="each"
                  :motion-speed="motionSpeed"
                  :motion-direction="motionDirection"
                  :corner="corner"
                  :label="each"
                  show-value
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Size ladder
              </span>
              <div class="space-y-3">
                <Progress
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :value="value"
                  :size="each"
                  :color="color"
                  :motion="motion"
                  :motion-speed="motionSpeed"
                  :motion-direction="motionDirection"
                  :corner="corner"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Indeterminate — extent unknown, so no percentage
              </span>
              <div class="space-y-3">
                <Progress
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :size="each"
                  :color="color"
                  :motion="motion"
                  :motion-speed="motionSpeed"
                  :motion-direction="motionDirection"
                  :corner="corner"
                  indeterminate
                  :label="`Size ${each}`"
                  show-value
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                An arbitrary range, with its own units
              </span>
              <Progress
                :value="640"
                :min="0"
                :max="1024"
                :size="size"
                :color="color"
                :motion="motion"
                :corner="corner"
                label="Disk image"
                show-value
                :format-value="formatDisk"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every tone
              </span>
              <div class="grid gap-3 md:grid-cols-2">
                <Progress
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  :value="value"
                  :size="size"
                  :color="each"
                  :motion="motion"
                  :motion-speed="motionSpeed"
                  :corner="corner"
                  :label="each"
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

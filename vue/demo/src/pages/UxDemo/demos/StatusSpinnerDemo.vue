<script setup lang="ts">
import { ref } from "vue";
import {
  MultiToggle,
  Panel,
  Select,
  StatusSpinner,
  Toggle,
  CONTROL_SIZES,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  StatusSpinnerSize,
  StatusSpinnerTone,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { controlSizeOptions, trueColorOptions } from "../constants";

const size = ref<StatusSpinnerSize>("md");
const tone = ref<StatusSpinnerTone>("blue");
const animated = ref(true);
const showLabel = ref(true);
const onGlass = ref(false);

const stateToggles = [
  { label: "Animate", model: animated },
  { label: "Label", model: showLabel },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Status Spinner"
    label="[StatusSpinner]"
    description="A spinner with a glowing centre dot for async states. The circle is the same size as the Spinner and Button beside it at each control size; the tone is one of the 21 true colours and the label is announced once, in the surface's own copy colour."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
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
              @update:model-value="size = $event as StatusSpinnerSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Tone
            </span>
            <Select
              :model-value="tone"
              @update:model-value="tone = $event as StatusSpinnerTone"
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
          Without a label the circle announces &ldquo;Loading&rdquo;; with
          one, the visible text is the announcement — the old sr-only copy
          would have said it twice. The ring stops spinning under
          <code>prefers-reduced-motion</code>.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="p-4">
        <Panel
          :variant="onGlass ? 'liquid-glass' : 'outlined'"
          :tone="onGlass ? tone : 'neutral'"
          padding="md"
        >
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Current settings
              </span>
              <StatusSpinner
                :size="size"
                :tone="tone"
                :animated="animated"
                :label="showLabel ? 'Deploying update' : undefined"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Size ladder
              </span>
              <div class="flex flex-wrap items-end gap-4">
                <div
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  class="flex flex-col items-center gap-2"
                >
                  <StatusSpinner
                    :size="each"
                    :tone="tone"
                    :animated="animated"
                  />
                  <span class="text-[11px] opacity-60">{{ each }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                States
              </span>
              <div class="flex flex-wrap items-center gap-6">
                <StatusSpinner
                  size="md"
                  :tone="tone"
                  animated
                  label="Working"
                />
                <StatusSpinner
                  size="md"
                  :tone="tone"
                  :animated="false"
                  label="Idle"
                />
                <StatusSpinner size="md" tone="emerald" label="Healthy" />
                <StatusSpinner size="md" tone="amber" label="Pending" />
                <StatusSpinner
                  size="md"
                  tone="rose"
                  :animated="false"
                  label="Failed"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Every tone
              </span>
              <div class="grid gap-3 md:grid-cols-2">
                <div
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  class="flex items-center gap-3"
                >
                  <StatusSpinner
                    :size="size"
                    :tone="each"
                    :animated="animated"
                  />
                  <span class="text-xs opacity-70">{{ each }}</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  MultiToggle,
  Panel,
  Select,
  Spinner,
  Toggle,
  CONTROL_SIZES,
  SPINNER_THICKNESSES,
  SPINNER_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  SpinnerSize,
  SpinnerThickness,
  SpinnerVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  controlSizeOptions,
  spinnerThicknessOptions,
  spinnerVariantOptions,
  trueColorOptions,
} from "../constants";

const size = ref<SpinnerSize>("md");
const color = ref<TrueColor>("blue");
const variant = ref<SpinnerVariant>("solid");
const thickness = ref<SpinnerThickness>("normal");
const showLabel = ref(true);
const onGlass = ref(false);

const stateToggles = [
  { label: "Label", model: showLabel },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Spinner"
    label="[Spinner]"
    description="An indeterminate ring. Size comes from the shared control scale so it lines up with the Button beside it; the label is announced once and takes its copy colour from the surface it sits on."
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
              @update:model-value="size = $event as SpinnerSize"
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

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Variant
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="spinnerVariantOptions"
              :model-value="variant"
              @update:model-value="variant = $event as SpinnerVariant"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Thickness
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="spinnerThicknessOptions"
              :model-value="thickness"
              @update:model-value="thickness = $event as SpinnerThickness"
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
          Without a label the ring announces &ldquo;Loading&rdquo;; with one,
          the visible text is the announcement — the old sr-only copy would
          have said it twice. The ring stops spinning under
          <code>prefers-reduced-motion</code>.
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
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Current settings
              </span>
              <Spinner
                :size="size"
                :color="color"
                :variant="variant"
                :thickness="thickness"
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
                  <Spinner
                    :size="each"
                    :color="color"
                    :variant="variant"
                    :thickness="thickness"
                  />
                  <span class="text-[11px] opacity-60">{{ each }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Every variant and thickness
              </span>
              <div class="space-y-3">
                <div
                  v-for="eachVariant in SPINNER_VARIANTS"
                  :key="eachVariant"
                  class="space-y-2"
                >
                  <span class="text-[11px] opacity-60">{{ eachVariant }}</span>
                  <div class="flex flex-wrap items-center gap-4">
                    <Spinner
                      v-for="eachThickness in SPINNER_THICKNESSES"
                      :key="eachThickness"
                      :size="size"
                      :color="color"
                      :variant="eachVariant"
                      :thickness="eachThickness"
                    />
                  </div>
                </div>
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
                  <Spinner
                    :size="size"
                    :color="each"
                    :variant="variant"
                    :thickness="thickness"
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

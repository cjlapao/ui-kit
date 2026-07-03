<script setup lang="ts">
import { ref } from "vue";
import {
  Spinner,
  Loader,
  Toggle,
  MultiToggle,
  type SpinnerSize,
  type SpinnerColor,
  type SpinnerVariant,
  type SpinnerProps,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { colorOptions } from "../constants";

// SpinnerThickness is not re-exported from the kit index; derive it from SpinnerProps.
type SpinnerThickness = NonNullable<SpinnerProps["thickness"]>;

const spinnerSize = ref<SpinnerSize>("md");
const spinnerColor = ref<SpinnerColor>("blue");
const spinnerVariant = ref<SpinnerVariant>("solid");
const spinnerThickness = ref<SpinnerThickness>("normal");
const spinnerLabel = ref(true);
</script>

<template>
  <PlaygroundSection
    title="Spinner & Loader"
    label="[Spinner / Loader]"
    description="Indeterminate spinner and loader previews."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Spinner size</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'XS', value: 'xs' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ]"
              :model-value="spinnerSize"
              size="sm"
              @update:model-value="
                (value: string) => (spinnerSize = value as SpinnerSize)
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Color</span>
            <MultiToggle
              full-width
              :options="colorOptions"
              :model-value="spinnerColor"
              size="sm"
              @update:model-value="
                (value: string) => (spinnerColor = value as SpinnerColor)
              "
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'Solid', value: 'solid' },
                { label: 'Segments', value: 'segments' },
              ]"
              :model-value="spinnerVariant"
              size="sm"
              @update:model-value="
                (value: string) => (spinnerVariant = value as SpinnerVariant)
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Thickness</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'Thin', value: 'thin' },
                { label: 'Normal', value: 'normal' },
                { label: 'Thick', value: 'thick' },
              ]"
              :model-value="spinnerThickness"
              size="sm"
              @update:model-value="
                (value: string) =>
                  (spinnerThickness = value as SpinnerThickness)
              "
            />
          </label>
        </div>
        <label class="flex items-center justify-between">
          <span>Show label</span>
          <Toggle size="sm" v-model="spinnerLabel" />
        </label>
      </div>
    </template>
    <template #preview>
      <div class="space-y-4">
        <Spinner
          :size="spinnerSize"
          :color="spinnerColor"
          :variant="spinnerVariant"
          :thickness="spinnerThickness"
          :label="spinnerLabel ? 'Deploying update' : undefined"
        />
        <Loader :overlay="false" title="Syncing..." spinner-variant="segments" />
      </div>
    </template>
  </PlaygroundSection>
</template>

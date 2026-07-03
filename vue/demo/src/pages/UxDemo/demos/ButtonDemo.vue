<script setup lang="ts">
import { ref } from "vue";
import { Button, Toggle, MultiToggle } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  colorOptions,
  buttonVariantOptions,
  buttonSizeOptions,
  buttonWeightOptions,
} from "../constants";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonColor,
} from "@cjlapao/ui-kit-vue";

type ButtonWeight = "normal" | "medium" | "semibold" | "bold";

const buttonVariant = ref<ButtonVariant>("solid");
const buttonSize = ref<ButtonSize>("md");
const buttonWeight = ref<ButtonWeight>("normal");
const buttonColor = ref<ButtonColor>("blue");
const buttonLoading = ref<boolean>(false);
const buttonDisabled = ref<boolean>(false);
const buttonShowLeadingIcon = ref<boolean>(false);
const buttonShowTrailingIcon = ref<boolean>(false);
const buttonFullWidth = ref<boolean>(false);

const stateToggleItems = [
  { label: "Loading", model: buttonLoading },
  { label: "Disabled", model: buttonDisabled },
];

const featureToggleItems = [
  { label: "Leading Icon", model: buttonShowLeadingIcon },
  { label: "Trailing Icon", model: buttonShowTrailingIcon },
  { label: "Full Width", model: buttonFullWidth },
];
</script>

<template>
  <PlaygroundSection
    title="Buttons"
    label="[Button]"
    description="Experiment with variants, weights, and icon options."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Color
          </span>
          <MultiToggle
            full-width
            :options="colorOptions"
            :model-value="buttonColor"
            size="sm"
            @update:model-value="buttonColor = $event as ButtonColor"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Variant
            </span>
            <MultiToggle
              full-width
              :options="buttonVariantOptions"
              :model-value="buttonVariant"
              size="sm"
              @update:model-value="buttonVariant = $event as ButtonVariant"
            />
          </div>
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Size
            </span>
            <MultiToggle
              full-width
              :options="buttonSizeOptions"
              :model-value="buttonSize"
              size="sm"
              @update:model-value="buttonSize = $event as ButtonSize"
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Weight
            </span>
            <MultiToggle
              full-width
              :options="buttonWeightOptions"
              :model-value="buttonWeight"
              size="sm"
              @update:model-value="buttonWeight = $event as ButtonWeight"
            />
          </div>
          <div class="grid gap-2 text-sm md:grid-cols-2">
            <label
              v-for="item in stateToggleItems"
              :key="item.label"
              class="flex items-center justify-between gap-2"
            >
              <span>{{ item.label }}</span>
              <Toggle size="sm" v-model="item.model.value" />
            </label>
          </div>
        </div>
        <div class="grid gap-2 text-sm md:grid-cols-2">
          <label
            v-for="item in featureToggleItems"
            :key="item.label"
            class="flex items-center justify-between gap-2"
          >
            <span>{{ item.label }}</span>
            <Toggle size="sm" v-model="item.model.value" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <Button
        :variant="buttonVariant"
        :color="buttonColor"
        :loading="buttonLoading"
        :disabled="buttonDisabled"
        :size="buttonSize"
        :weight="buttonWeight"
        :full-width="buttonFullWidth"
        :leading-icon="buttonShowLeadingIcon ? 'Search' : undefined"
        :trailing-icon="buttonShowTrailingIcon ? 'ArrowRight' : undefined"
      >
        Button Label
      </Button>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Toggle,
  MultiToggle,
  type ThemeColor,
  type ToggleProps,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  colorOptions,
  toggleSizeOptions,
  toggleAlignOptions,
  toggleDescriptionPlacementOptions,
} from "../constants";

// The individual Toggle option types are not re-exported from the kit index;
// derive them from ToggleProps.
type ToggleSize = NonNullable<ToggleProps["size"]>;
type ToggleAlign = NonNullable<ToggleProps["alignLabel"]>;
type ToggleDescriptionPlacement = NonNullable<
  ToggleProps["descriptionPlacement"]
>;

const toggleChecked = ref<boolean>(true);
const toggleColor = ref<ThemeColor>("blue");
const toggleSize = ref<ToggleSize>("md");
const toggleAlign = ref<ToggleAlign>("left");
const toggleLabel = ref<boolean>(true);
const toggleFullWidth = ref<boolean>(false);
const toggleCustomIcons = ref<boolean>(false);
const toggleDescription = ref<boolean>(false);
const toggleDisabled = ref<boolean>(false);
const toggleDescriptionPlacement = ref<ToggleDescriptionPlacement>("stacked");

const toggleBooleanOptions = computed(() => [
  {
    label: "Show label",
    value: toggleLabel.value,
    setter: (checked: boolean) => (toggleLabel.value = checked),
  },
  {
    label: "Disabled",
    value: toggleDisabled.value,
    setter: (checked: boolean) => (toggleDisabled.value = checked),
  },
  {
    label: "Show description",
    value: toggleDescription.value,
    setter: (checked: boolean) => (toggleDescription.value = checked),
  },
  {
    label: "Full width",
    value: toggleFullWidth.value,
    setter: (checked: boolean) => (toggleFullWidth.value = checked),
  },
  {
    label: "Custom icons",
    value: toggleCustomIcons.value,
    setter: (checked: boolean) => (toggleCustomIcons.value = checked),
  },
]);
</script>

<template>
  <PlaygroundSection
    title="Toggle"
    label="[Toggle]"
    description="Switch labels, layout, and icon treatments."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Tone
          </span>
          <MultiToggle
            full-width
            :options="colorOptions"
            :model-value="toggleColor"
            size="sm"
            @update:model-value="
              (value: string) => (toggleColor = value as ThemeColor)
            "
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-2 text-sm">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="toggleSizeOptions"
              :model-value="toggleSize"
              size="sm"
              @update:model-value="
                (value: string) => (toggleSize = value as ToggleSize)
              "
            />
          </label>
          <label class="flex flex-col gap-2 text-sm">
            <span>Label alignment</span>
            <MultiToggle
              full-width
              :options="toggleAlignOptions"
              :model-value="toggleAlign"
              size="sm"
              @update:model-value="
                (value: string) => (toggleAlign = value as ToggleAlign)
              "
            />
          </label>
        </div>
        <label class="flex flex-col gap-2 text-sm">
          <span>Description placement</span>
          <MultiToggle
            full-width
            :options="toggleDescriptionPlacementOptions"
            :model-value="toggleDescriptionPlacement"
            size="sm"
            @update:model-value="
              (value: string) =>
                (toggleDescriptionPlacement =
                  value as ToggleDescriptionPlacement)
            "
          />
        </label>
        <div class="grid gap-2 text-sm md:grid-cols-2">
          <label
            v-for="option in toggleBooleanOptions"
            :key="option.label"
            class="flex items-center justify-between"
          >
            <span>{{ option.label }}</span>
            <Toggle
              size="sm"
              :model-value="option.value"
              @update:model-value="option.setter"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <Toggle
        v-model="toggleChecked"
        :size="toggleSize"
        :color="toggleColor"
        :disabled="toggleDisabled"
        :label="toggleLabel ? 'Toggle Label' : undefined"
        :description="
          toggleDescription
            ? 'This is a description for the toggle component.'
            : undefined
        "
        :description-placement="toggleDescriptionPlacement"
        :align-label="toggleAlign"
        :full-width="toggleFullWidth"
        :icon-on="toggleCustomIcons ? 'Send' : undefined"
        :icon-off="toggleCustomIcons ? 'Close' : undefined"
      />
    </template>
  </PlaygroundSection>
</template>

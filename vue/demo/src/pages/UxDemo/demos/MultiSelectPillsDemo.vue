<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  MultiSelectPills,
  MultiToggle,
  Panel,
  Select,
  Toggle,
} from "@cjlapao/ui-kit-vue";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  MultiSelectPillOption,
  PillCorner,
  PillVariant,
  SpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  pillCornerOptions,
  pillSpecularOptions,
  pillVariantOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PillVariant[] = ["glass", "liquid-glass"];

const selectionModeOptions = [
  { label: "Multiple", value: "multiple" },
  { label: "Single", value: "single" },
];

const BASE_OPTIONS: (MultiSelectPillOption & { icon: string })[] = [
  { value: "containers", label: "Containers", icon: "Container", description: "42" },
  { value: "images", label: "Images", icon: "Docker", description: "17" },
  { value: "volumes", label: "Volumes", icon: "Save", description: "8" },
  { value: "networks", label: "Networks", icon: "Globe", description: "3" },
  { value: "secrets", label: "Secrets", icon: "Key", description: "0" },
  { value: "registry", label: "Registry", icon: "Cache", disabled: true },
];

const selected = ref<string[]>(["containers", "images"]);

const selectionMode = ref<"multiple" | "single">("multiple");
const color = ref<TrueColor>("blue");
const variant = ref<PillVariant>("solid");
const unselectedVariant = ref<PillVariant>("outline");
const size = ref<ControlSize>("sm");
const rounded = ref<PillCorner>("full");
const gap = ref<ControlSize>("sm");

const disabled = ref(false);
const allowDeselect = ref(true);
const withIcons = ref(true);
const withCounts = ref(false);
const checkmark = ref(false);
const withLegend = ref(true);
const onGlass = ref(false);

const glassOpacity = ref<GlassOpacity>("frosted");
const vibrancy = ref<GlassVibrancy>("medium");
const specularMode = ref<SpecularMode>("classic");

const options = computed<MultiSelectPillOption[]>(() =>
  BASE_OPTIONS.map((option) => ({
    ...option,
    icon: withIcons.value ? option.icon : undefined,
    description: withCounts.value ? option.description : undefined,
  })),
);

const isGlass = computed(
  () =>
    GLASS_VARIANTS.includes(variant.value) ||
    GLASS_VARIANTS.includes(unselectedVariant.value),
);

const submittedValue = computed(() =>
  selected.value.length
    ? selected.value.map((value) => `resources[]=${value}`).join("&")
    : "— nothing selected —",
);

const stateToggles = [
  { label: "Icons", model: withIcons },
  { label: "Counts", model: withCounts },
  { label: "Check mark", model: checkmark },
  { label: "Legend", model: withLegend },
  { label: "Allow deselect", model: allowDeselect },
  { label: "Disabled", model: disabled },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Multi Select Pills"
    label="[MultiSelectPills]"
    description="A row of pills used as a checkbox or radio group. It renders the kit's Pill, so it inherits every variant, tone, size and corner — including the glass pair."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Selection mode
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="selectionModeOptions"
              :model-value="selectionMode"
              @update:model-value="
                selectionMode = $event as 'multiple' | 'single'
              "
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
              Selected variant
            </span>
            <Select
              :model-value="variant"
              @update:model-value="variant = $event as PillVariant"
            >
              <option
                v-for="option in pillVariantOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Unselected variant
            </span>
            <Select
              :model-value="unselectedVariant"
              @update:model-value="unselectedVariant = $event as PillVariant"
            >
              <option
                v-for="option in pillVariantOptions"
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
            Size
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="controlSizeOptions"
            :model-value="size"
            @update:model-value="size = $event as ControlSize"
          />
        </label>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Corner
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="pillCornerOptions"
              :model-value="rounded"
              @update:model-value="rounded = $event as PillCorner"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Gap
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="gap"
              @update:model-value="gap = $event as ControlSize"
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

        <div
          v-if="isGlass"
          class="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10"
        >
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Specular
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="pillSpecularOptions"
              :model-value="specularMode"
              @update:model-value="specularMode = $event as SpecularMode"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Vibrancy
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="glassVibrancyOptions"
              :model-value="vibrancy as string"
              @update:model-value="vibrancy = $event as GlassVibrancy"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Glass opacity
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="glassOpacityOptions"
              :model-value="glassOpacity as string"
              @update:model-value="glassOpacity = $event as GlassOpacity"
            />
          </label>
        </div>

        <p class="text-xs opacity-70">
          <strong>Single</strong> mode behaves like a radio group; turn
          <strong>Allow deselect</strong> off to make the choice required.
          <strong>Registry</strong> is a per-option disabled pill — it stays
          unclickable even when the group is enabled. <strong>Check mark</strong>
          swaps a selected pill's icon for a tick, so the state is not carried by
          colour alone. Each pill carries
          <code>aria-pressed</code>; the hidden checkbox beside it exists only to
          carry the value to a form submit.
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
            <MultiSelectPills
              name="resources"
              v-model="selected"
              :options="options"
              :selection-mode="selectionMode"
              :color="color"
              :variant="variant"
              :unselected-variant="unselectedVariant"
              :size="size"
              :rounded="rounded"
              :gap="gap"
              :disabled="disabled"
              :allow-deselect="allowDeselect"
              :checkmark="checkmark"
              :glass-opacity="glassOpacity"
              :vibrancy="vibrancy"
              :specular-mode="specularMode"
              :legend="withLegend ? 'Resources to include' : undefined"
              :description="
                withLegend
                  ? 'Pick what the backup job should snapshot.'
                  : undefined
              "
            />

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                What a form submit would carry
              </span>
              <code
                class="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10"
              >
                {{ submittedValue }}
              </code>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Uncontrolled — it keeps its own state
              </span>
              <MultiSelectPills
                name="uncontrolled"
                :options="options"
                :default-value="['volumes']"
                :selection-mode="selectionMode"
                :color="color"
                :variant="variant"
                :unselected-variant="unselectedVariant"
                :size="size"
                :rounded="rounded"
                :gap="gap"
                :disabled="disabled"
                :allow-deselect="allowDeselect"
              :checkmark="checkmark"
                :glass-opacity="glassOpacity"
                :vibrancy="vibrancy"
                :specular-mode="specularMode"
              />
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

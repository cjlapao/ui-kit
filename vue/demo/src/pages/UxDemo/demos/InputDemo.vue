<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Input,
  MultiToggle,
  Panel,
  PasswordInput,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const variant = ref<InputVariant>("flat");
const size = ref<InputSize>("md");
const tone = ref<TrueColor>("blue");
const validationStatus = ref<InputValidationStatus>("none");
const glowIntensity = ref<GlowIntensity>("soft");

const placeholder = ref("ada@example.com");
const value = ref("");

const leading = ref(true);
const trailing = ref(false);
const clickableTrailing = ref(false);
const disabled = ref(false);
const onGlass = ref(false);

const leadingIcon = computed(() => (leading.value ? "Search" : undefined));
const trailingIcon = computed(() => (trailing.value ? "Info" : undefined));
const onTrailingIconClick = computed(() =>
  trailing.value && clickableTrailing.value
    ? () => {
        value.value = "";
      }
    : undefined,
);

const stateToggles = [
  { label: "Leading icon", model: leading },
  { label: "Trailing icon", model: trailing },
  { label: "Trailing is a button", model: clickableTrailing },
  { label: "Disabled", model: disabled },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Input"
    label="[Input]"
    description="The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Variant
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="inputVariantOptions"
            :model-value="variant"
            @update:model-value="variant = $event as InputVariant"
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
              @update:model-value="size = $event as InputSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Tone
            </span>
            <Select
              :model-value="tone"
              @update:model-value="tone = $event as TrueColor"
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
              Validation
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="inputValidationOptions"
              :model-value="validationStatus"
              @update:model-value="
                validationStatus = $event as InputValidationStatus
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Placeholder
            </span>
            <Input v-model="placeholder" />
          </label>
        </div>

        <label v-if="variant === 'gradient'" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Glow intensity
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="glowIntensityOptions"
            :model-value="glowIntensity"
            @update:model-value="glowIntensity = $event as GlowIntensity"
          />
        </label>

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
          The surface sits on the field's wrapper, not the
          <code>&lt;input&gt;</code> — same structure as
          <strong>SearchBar</strong>, so icons are flex siblings instead of
          absolutely positioned things the input has to leave padding for. The
          focus ring is <code>ring-inset</code>: an outer ring is painted outside
          the border box and any scrolling ancestor clips it.
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
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Current settings
              </span>
              <Input
                v-model="value"
                :variant="variant"
                :size="size"
                :tone="tone"
                :validation-status="validationStatus"
                :glow-intensity="glowIntensity"
                :disabled="disabled"
                :leading-icon="leadingIcon"
                :trailing-icon="trailingIcon"
                :on-trailing-icon-click="onTrailingIconClick"
                trailing-icon-label="Clear the field"
                :placeholder="placeholder"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every variant — at the same size, so they line up
              </span>
              <div class="grid gap-3 md:grid-cols-2">
                <Input
                  v-for="each in INPUT_VARIANTS"
                  :key="each"
                  :variant="each"
                  :size="size"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :glow-intensity="glowIntensity"
                  :disabled="disabled"
                  :leading-icon="leadingIcon"
                  :trailing-icon="trailingIcon"
                  :placeholder="each"
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
                <Input
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :variant="variant"
                  :size="each"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  :leading-icon="leadingIcon"
                  :trailing-icon="trailingIcon"
                  :placeholder="`Size ${each}`"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Validation
              </span>
              <div class="grid gap-3 md:grid-cols-3">
                <Input
                  v-for="status in (['none', 'error', 'success'] as const)"
                  :key="status"
                  :variant="variant"
                  :size="size"
                  :tone="tone"
                  :validation-status="status"
                  :leading-icon="leadingIcon"
                  :placeholder="status"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                PasswordInput — the same field with a reveal toggle
              </span>
              <PasswordInput
                :variant="variant"
                :size="size"
                :tone="tone"
                :disabled="disabled"
                placeholder="Password"
                model-value="correct-horse"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every tone — focus one to see its border and ring
              </span>
              <div class="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
                <Input
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  :variant="variant"
                  size="sm"
                  :tone="each"
                  :placeholder="each"
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

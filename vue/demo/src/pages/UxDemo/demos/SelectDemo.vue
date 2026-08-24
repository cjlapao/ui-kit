<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  SelectSize,
  SelectValidationStatus,
  SelectVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const variant = ref<SelectVariant>("flat");
const size = ref<SelectSize>("md");
const tone = ref<TrueColor>("blue");
const validationStatus = ref<SelectValidationStatus>("none");

const value = ref("");
const leadingIcon = ref(false);
const placeholder = ref(true);
const hideCaret = ref(false);
const multiple = ref(false);
const disabled = ref(false);
const onGlass = ref(false);

const resolvedLeadingIcon = computed(() =>
  leadingIcon.value ? "Globe" : undefined,
);

const stateToggles = [
  { label: "Leading icon", model: leadingIcon },
  { label: "Placeholder", model: placeholder },
  { label: "Hide caret", model: hideCaret },
  { label: "Multiple", model: multiple },
  { label: "Disabled", model: disabled },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Select"
    label="[Select]"
    description="The native dropdown, with the platform caret replaced by the kit's. Surface, size and tone come from the shared scales, so it lines up with the Input and SearchBar beside it."
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
            @update:model-value="variant = $event as SelectVariant"
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
              @update:model-value="size = $event as SelectSize"
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
              validationStatus = $event as SelectValidationStatus
            "
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
          <code>&lt;select&gt;</code> — same structure as <strong>Input</strong>,
          so the caret and leading icon are flex siblings rather than absolutely
          positioned things the select has to leave padding for. The
          <code>&lt;option&gt;</code> elements carry their own fill: the native
          dropdown is painted by the platform from the select's background,
          which is now transparent.
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
              <Select
                v-model="value"
                :variant="variant"
                :size="size"
                :tone="tone"
                :validation-status="validationStatus"
                :disabled="disabled"
                :leading-icon="resolvedLeadingIcon"
                :hide-caret="hideCaret"
                :multiple="multiple"
                :placeholder="placeholder ? 'Choose a region' : undefined"
                aria-label="Region"
              >
                <option v-for="region in REGIONS" :key="region" :value="region">
                  {{ region }}
                </option>
              </Select>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every variant — at the same size, so they line up
              </span>
              <div class="grid gap-3 md:grid-cols-2">
                <Select
                  v-for="each in INPUT_VARIANTS"
                  :key="each"
                  :variant="each"
                  :size="size"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  :leading-icon="resolvedLeadingIcon"
                  :hide-caret="hideCaret"
                  :placeholder="each"
                  :aria-label="each"
                >
                  <option v-for="region in REGIONS" :key="region" :value="region">
                    {{ region }}
                  </option>
                </Select>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Size ladder
              </span>
              <div class="space-y-3">
                <Select
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :variant="variant"
                  :size="each"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  :leading-icon="resolvedLeadingIcon"
                  :hide-caret="hideCaret"
                  :placeholder="`Size ${each}`"
                  :aria-label="`Size ${each}`"
                >
                  <option v-for="region in REGIONS" :key="region" :value="region">
                    {{ region }}
                  </option>
                </Select>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Validation
              </span>
              <div class="grid gap-3 md:grid-cols-3">
                <Select
                  v-for="status in (['none', 'error', 'success'] as const)"
                  :key="status"
                  :variant="variant"
                  :size="size"
                  :tone="tone"
                  :validation-status="status"
                  :leading-icon="resolvedLeadingIcon"
                  :placeholder="status"
                  :aria-label="status"
                >
                  <option v-for="region in REGIONS" :key="region" :value="region">
                    {{ region }}
                  </option>
                </Select>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every tone — focus one to see its border and ring
              </span>
              <div class="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
                <Select
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  :variant="variant"
                  size="sm"
                  :tone="each"
                  :placeholder="each"
                  :aria-label="each"
                >
                  <option v-for="region in REGIONS" :key="region" :value="region">
                    {{ region }}
                  </option>
                </Select>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

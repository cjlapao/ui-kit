<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Button,
  Input,
  InputGroup,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  InputGroupSize,
  InputGroupValidationStatus,
  InputGroupVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const variant = ref<InputGroupVariant>("elevated");
const size = ref<InputGroupSize>("md");
const tone = ref<TrueColor>("blue");
const validationStatus = ref<InputGroupValidationStatus>("none");

const leading = ref(true);
const trailing = ref(true);
const disabled = ref(false);
const onGlass = ref(false);

const stateToggles = [
  { label: "Leading addon", model: leading },
  { label: "Trailing addon", model: trailing },
  { label: "Disabled", model: disabled },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Input Group"
    label="[InputGroup]"
    description="A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size and tone scales as the Input inside it."
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
            @update:model-value="variant = $event as InputGroupVariant"
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
              @update:model-value="size = $event as InputGroupSize"
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
              validationStatus = $event as InputGroupValidationStatus
            "
          />
        </label>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <Toggle
            v-for="toggle in stateToggles"
            :key="toggle.label"
            size="sm"
            :label="toggle.label"
            v-model="toggle.model.value"
          />
        </div>

        <p class="text-xs opacity-70">
          <strong>Disabled</strong> now reaches the fields inside — it used to
          stop at the group's opacity, leaving a dimmed input you could still
          type into. A child that sets its own <code>disabled</code> stays locked
          even when the group is enabled.
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
              <InputGroup
                :variant="variant"
                :size="size"
                :tone="tone"
                :validation-status="validationStatus"
                :disabled="disabled"
                :leading-addon="leading ? 'https://' : undefined"
                :trailing-addon="trailing ? '.com' : undefined"
              >
                <Input placeholder="your-company" />
              </InputGroup>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every variant
              </span>
              <div class="grid gap-3 md:grid-cols-2">
                <InputGroup
                  v-for="each in INPUT_VARIANTS"
                  :key="each"
                  :variant="each"
                  :size="size"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  :leading-addon="each"
                >
                  <Input placeholder="your-company" />
                </InputGroup>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Size ladder — the addon tracks the field
              </span>
              <div class="space-y-3">
                <InputGroup
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :variant="variant"
                  :size="each"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  leading-addon="https://"
                  :trailing-addon="each"
                >
                  <Input placeholder="your-company" />
                </InputGroup>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                What else can go inside
              </span>
              <div class="space-y-3">
                <InputGroup
                  :variant="variant"
                  :size="size"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  leading-addon="Amount"
                >
                  <Input type="number" placeholder="0.00" />
                  <Select aria-label="Currency" unstyled>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </Select>
                </InputGroup>

                <InputGroup
                  :variant="variant"
                  :size="size"
                  :tone="tone"
                  :validation-status="validationStatus"
                  :disabled="disabled"
                  leading-addon="Search"
                >
                  <Input placeholder="Find a resource" />
                  <Button
                    :size="size"
                    variant="solid"
                    :color="tone"
                    :disabled="disabled"
                  >
                    Go
                  </Button>
                </InputGroup>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every tone — all 21 render; fifteen of them used to throw
              </span>
              <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <InputGroup
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  :variant="variant"
                  size="sm"
                  :tone="each"
                  :leading-addon="each"
                >
                  <Input placeholder="value" />
                </InputGroup>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

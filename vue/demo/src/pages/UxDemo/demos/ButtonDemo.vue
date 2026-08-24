<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Button,
  Toggle,
  MultiToggle,
  Select,
  TRUE_COLORS,
  BUTTON_VARIANTS,
  CONTROL_SIZES,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  buttonWeightOptions,
  glassVibrancyOptions,
  glassOpacityOptions,
  pillSpecularOptions,
} from "../constants";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonWeight,
  TrueColor,
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "@cjlapao/ui-kit-vue";

const buttonVariant = ref<ButtonVariant>("solid");
const buttonSize = ref<ButtonSize>("md");
const buttonWeight = ref<ButtonWeight>("normal");
const buttonColor = ref<TrueColor>("blue");
const buttonLoading = ref(false);
const buttonDisabled = ref(false);
const buttonActive = ref(false);
const buttonGlass = ref(false);
const buttonAccent = ref(false);
const buttonIconOnly = ref(false);
const buttonFullWidth = ref(false);
const buttonShowLeadingIcon = ref(false);
const buttonShowTrailingIcon = ref(false);
const buttonIconColorOn = ref(false);
const buttonIconColor = ref("#ef4444");
const buttonTooltip = ref(false);
const vibrancy = ref<GlassVibrancy>("medium");
const glassOpacity = ref<GlassOpacity>("frosted");
const specularMode = ref<SpecularMode>("none");
const onGlass = ref(false);

const leading = computed(() => (buttonShowLeadingIcon.value ? "Search" : undefined));
const trailing = computed(() => (buttonShowTrailingIcon.value ? "ArrowRight" : undefined));
// Icon-only buttons need a glyph to show; fall back to one when no leading
// icon is selected so the matrices don't render empty boxes.
const glyph = computed(() =>
  buttonIconOnly.value ? (leading.value ?? "Star") : leading.value,
);

const shared = computed(() => ({
  variant: buttonVariant.value,
  color: buttonColor.value,
  size: buttonSize.value,
  weight: buttonWeight.value,
  loading: buttonLoading.value,
  disabled: buttonDisabled.value,
  active: buttonActive.value,
  glass: buttonGlass.value,
  accent: buttonAccent.value,
  iconOnly: buttonIconOnly.value,
  fullWidth: buttonFullWidth.value,
  vibrancy: vibrancy.value,
  glassOpacity: glassOpacity.value,
  specularMode: specularMode.value,
  leadingIcon: glyph.value,
  trailingIcon: trailing.value,
  iconColor: buttonIconColorOn.value ? buttonIconColor.value : undefined,
  tooltip: buttonTooltip.value ? "A button with a tooltip" : undefined,
}));

// Fixed conditions for the reference examples — each block varies exactly
// one dimension and never moves with the controls.
const example = {
  color: "blue" as TrueColor,
  size: "md" as ButtonSize,
  weight: "normal" as ButtonWeight,
};

const stateToggles = [
  { label: "Loading", model: buttonLoading },
  { label: "Disabled", model: buttonDisabled },
  { label: "Active (pressed)", model: buttonActive },
  { label: "Glass", model: buttonGlass },
  { label: "Accent", model: buttonAccent },
  { label: "Icon only", model: buttonIconOnly },
  { label: "Full width", model: buttonFullWidth },
  { label: "Leading icon", model: buttonShowLeadingIcon },
  { label: "Trailing icon", model: buttonShowTrailingIcon },
  { label: "Icon color", model: buttonIconColorOn },
  { label: "Tooltip", model: buttonTooltip },
  { label: "On a glass panel", model: onGlass },
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
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Color
            </span>
            <Select
              :model-value="buttonColor"
              size="sm"
              @update:model-value="buttonColor = $event as TrueColor"
            >
              <option
                v-for="option in trueColorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Variant
            </span>
            <Select
              :model-value="buttonVariant"
              size="sm"
              aria-label="Variant"
              @update:model-value="buttonVariant = $event as ButtonVariant"
            >
              <option
                v-for="option in buttonVariantAllOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Size
            </span>
            <MultiToggle
              full-width
              :options="controlSizeOptions"
              :model-value="buttonSize"
              size="sm"
              @update:model-value="buttonSize = $event as ButtonSize"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
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
        </div>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
          <Toggle
            v-for="item in stateToggles"
            :key="item.label"
            size="sm"
            :label="item.label"
             v-model="item.model.value"
           />
         </div>
         <div v-if="buttonIconColorOn" class="space-y-2">
           <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
             Icon color (override)
           </span>
           <div class="flex items-center gap-2">
             <input
               type="color"
               :value="buttonIconColor"
               @input="buttonIconColor = ($event.target as HTMLInputElement).value"
               class="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600"
               aria-label="Icon color"
             />
             <span class="font-mono text-sm text-neutral-500 dark:text-neutral-400">
               {{ buttonIconColor }}
             </span>
           </div>
         </div>
         <div v-if="buttonGlass" class="grid gap-4 md:grid-cols-3">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Vibrancy
            </span>
            <MultiToggle
              full-width
              :options="glassVibrancyOptions"
              :model-value="String(vibrancy)"
              size="sm"
              @update:model-value="vibrancy = $event as GlassVibrancy"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Fill
            </span>
            <MultiToggle
              full-width
              :options="glassOpacityOptions"
              :model-value="String(glassOpacity)"
              size="sm"
              @update:model-value="glassOpacity = $event as GlassOpacity"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Specular
            </span>
            <MultiToggle
              full-width
              :options="pillSpecularOptions"
              :model-value="specularMode"
              size="sm"
              @update:model-value="specularMode = $event as SpecularMode"
            />
          </div>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-6 p-4">
        <!-- The only block the controls drive. The button sits in a plain
             (block) surface so `inline-flex` sizes it to its content — a
             `flex flex-col` parent would stretch it full width and the
             Full-width toggle would have nothing to do. "On a glass panel"
             just swaps that surface for a coloured one the glass blur reads. -->
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <div
            :class="
              onGlass
                ? 'rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-rose-300 p-6 dark:from-sky-600 dark:via-violet-600 dark:to-rose-500'
                : 'rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900'
            "
          >
            <Button v-bind="shared">Button Label</Button>
          </div>
        </div>

        <!-- Fixed reference specimens — none of these move with the controls. -->
        <div class="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Every variant — fixed tone, size, and weight
            </span>
            <div class="grid gap-3 md:grid-cols-2">
              <Button
                v-for="each in BUTTON_VARIANTS"
                :key="each"
                v-bind="example"
                :variant="each"
              >
                {{ each }}
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Size ladder — solid, fixed tone
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <Button
                v-for="each in CONTROL_SIZES"
                :key="each"
                v-bind="example"
                variant="solid"
                :size="each"
              >
                {{ each }}
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              All {{ TRUE_COLORS.length }} tones — solid, fixed size
            </span>
            <div class="grid gap-2 md:grid-cols-3">
              <Button
                v-for="each in TRUE_COLORS"
                :key="each"
                v-bind="example"
                variant="solid"
                :color="each"
              >
                {{ each }}
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Pressed (active) — the persistent &quot;on&quot; state
            </span>
            <div class="grid gap-3 md:grid-cols-2">
              <Button
                v-for="each in ['solid', 'soft', 'outline', 'ghost'] as ButtonVariant[]"
                :key="each"
                v-bind="example"
                :variant="each"
                active
              >
                {{ each }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

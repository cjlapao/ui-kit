<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  DropdownButton,
  MultiToggle,
  Toggle,
  Select,
  TRUE_COLORS,
  BUTTON_VARIANTS,
  CONTROL_SIZES,
} from "@cjlapao/ui-kit-vue";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from "@cjlapao/ui-kit-vue";
import {
  dropdownButtonOptions,
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  dropdownWidthOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id: id,
    message: `You clicked something!`,
    details:
      message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const safeLabelText = (label: unknown, fallback: string) =>
  typeof label === "string" ? label : fallback;

const dropdownButtonVariant = ref<ButtonVariant>("solid");
const dropdownButtonSize = ref<ButtonSize>("md");
const dropdownButtonColor = ref<ButtonColor>("blue");
const dropdownButtonDisabled = ref(false);
const dropdownButtonFullWidth = ref(false);
const dropdownButtonSplit = ref(true);
const dropdownMenuWidthChoice = ref<"trigger" | "240" | "320">("trigger");
const dropdownSelection = ref<string>("None");
const dropdownMenuWidthValue = computed(() =>
  dropdownMenuWidthChoice.value === "trigger"
    ? ("trigger" as const)
    : Number(dropdownMenuWidthChoice.value),
);

// Fixed conditions for the reference specimens — each block varies exactly one
// dimension and never moves with the controls above.
const example = {
  color: "blue" as ButtonColor,
  size: "md" as ButtonSize,
  split: true,
};
</script>

<template>
  <PlaygroundSection
    title="Dropdown Button"
    label="[DropdownButton]"
    description="A split button whose caret opens a menu. Pick any of the full palette, then browse the fixed specimens."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Color
            </span>
            <Select
              :model-value="dropdownButtonColor"
              size="sm"
              aria-label="Color"
              @update:model-value="
                dropdownButtonColor = $event as ButtonColor
              "
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
              :model-value="dropdownButtonVariant"
              size="sm"
              aria-label="Variant"
              @update:model-value="
                dropdownButtonVariant = $event as ButtonVariant
              "
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
              :model-value="dropdownButtonSize"
              size="sm"
              @update:model-value="dropdownButtonSize = $event as ButtonSize"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Menu Width
            </span>
            <MultiToggle
              full-width
              :options="dropdownWidthOptions"
              :model-value="dropdownMenuWidthChoice"
              size="sm"
              @update:model-value="
                dropdownMenuWidthChoice = $event as 'trigger' | '240' | '320'
              "
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
          <Toggle
            size="sm"
            full-width
            label="Split trigger"
            v-model="dropdownButtonSplit"
          />
          <Toggle
            size="sm"
            full-width
            label="Full width"
            v-model="dropdownButtonFullWidth"
          />
          <Toggle
            size="sm"
            full-width
            label="Disabled"
            v-model="dropdownButtonDisabled"
          />
        </div>
        <div
          class="space-y-2 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 text-sm text-neutral-600 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-200"
        >
          <p
            class="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
          >
            Last selection
          </p>
          <p class="font-semibold text-neutral-900 dark:text-neutral-100">
            {{ dropdownSelection }}
          </p>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-6 p-4">
        <!-- The only block the controls drive. The button sits in a plain
             (block) surface so `inline-flex` sizes it to its content. -->
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <div
            class="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <DropdownButton
              label="Something"
              :options="dropdownButtonOptions"
              :variant="dropdownButtonVariant"
              :color="dropdownButtonColor"
              :size="dropdownButtonSize"
              :disabled="dropdownButtonDisabled"
              :full-width="dropdownButtonFullWidth"
              :split="dropdownButtonSplit"
              :menu-width="dropdownMenuWidthValue"
              @primary-click="createUpdateToast('Primary action clicked')"
              @option-select="
                (option) => {
                  dropdownSelection = option.value;
                  const labelText = safeLabelText(
                    option.label,
                    option.value ?? '',
                  );
                  createUpdateToast(`Selected ${labelText}`);
                }
              "
            />
          </div>
        </div>

        <!-- Fixed reference specimens — none of these move with the controls. -->
        <div class="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Every variant — fixed tone and size
            </span>
            <div class="grid gap-3 md:grid-cols-2">
              <DropdownButton
                v-for="each in BUTTON_VARIANTS"
                :key="each"
                v-bind="example"
                :options="dropdownButtonOptions"
                :variant="each"
                :label="each"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Size ladder — solid, fixed tone
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <DropdownButton
                v-for="each in CONTROL_SIZES"
                :key="each"
                v-bind="example"
                :options="dropdownButtonOptions"
                variant="solid"
                :size="each"
                :label="each"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              All {{ TRUE_COLORS.length }} tones — solid, fixed size
            </span>
            <div class="grid gap-2 md:grid-cols-3">
              <DropdownButton
                v-for="each in TRUE_COLORS"
                :key="each"
                v-bind="example"
                :options="dropdownButtonOptions"
                variant="solid"
                :color="each"
                :label="each"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

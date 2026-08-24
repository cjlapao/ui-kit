<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  IconButton,
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
  SpecularMode,
} from "@cjlapao/ui-kit-vue";
import {
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  iconRoundedOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

type IconRounded = "md" | "lg" | "xl" | "full";

const ROUNDED_SHAPES: IconRounded[] = ["md", "lg", "xl", "full"];
const SPECULAR_MODES: SpecularMode[] = ["none", "classic", "halo"];

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id: id,
    message: `You clicked something!`,
    details: message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const iconButtonVariant = ref<ButtonVariant>("solid");
const iconButtonSize = ref<ButtonSize>("md");
const iconButtonColor = ref<ButtonColor>("blue");
const iconButtonRounded = ref<IconRounded>("full");
const iconButtonLoading = ref(false);
const iconButtonDisabled = ref(false);
const iconButtonAccent = ref(false);
const iconButtonGlass = ref(false);
const iconButtonTooltip = ref(false);
</script>

<template>
  <PlaygroundSection
    title="Icon Buttons"
    label="[IconButton]"
    description="A square icon-only control. Pick any of the full palette, then browse the fixed specimens for variant, size, tone, corner radius, states and glass."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Color
            </span>
            <Select
              size="sm"
              aria-label="Color"
              :model-value="iconButtonColor"
              @update:model-value="iconButtonColor = $event as ButtonColor"
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
              size="sm"
              aria-label="Variant"
              :model-value="iconButtonVariant"
              @update:model-value="iconButtonVariant = $event as ButtonVariant"
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
              :model-value="iconButtonSize"
              size="sm"
              @update:model-value="iconButtonSize = $event as ButtonSize"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Rounded
            </span>
            <MultiToggle
              full-width
              :options="iconRoundedOptions"
              :model-value="iconButtonRounded"
              size="sm"
              @update:model-value="iconButtonRounded = $event as 'md' | 'lg' | 'xl' | 'full'"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
          <Toggle
            size="sm"
            full-width
            label="Loading"
            v-model="iconButtonLoading"
          />
          <Toggle
            size="sm"
            full-width
            label="Disabled"
            v-model="iconButtonDisabled"
          />
          <Toggle
            size="sm"
            full-width
            label="Accent"
            v-model="iconButtonAccent"
          />
          <Toggle
            size="sm"
            full-width
            label="Glass"
            v-model="iconButtonGlass"
          />
          <Toggle
            size="sm"
            full-width
            label="Tooltip"
            v-model="iconButtonTooltip"
          />
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
            <IconButton
              icon="Send"
              :variant="iconButtonVariant"
              :color="iconButtonColor"
              :size="iconButtonSize"
              :rounded="iconButtonRounded"
              :loading="iconButtonLoading"
              :disabled="iconButtonDisabled"
              :accent="iconButtonAccent"
              :glass="iconButtonGlass"
              :tooltip="iconButtonTooltip ? 'Send message' : undefined"
              tooltip-position="top"
              sr-label="Send"
              @click="createUpdateToast('Icon button clicked')"
            />
          </div>
        </div>

        <!-- Fixed reference specimens — none of these move with the controls.
             Icon buttons carry no text label, so each swatch names itself below. -->
        <div class="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Every variant — fixed tone and size
            </span>
            <div class="grid gap-3 md:grid-cols-2">
              <div
                v-for="each in BUTTON_VARIANTS"
                :key="each"
                class="flex items-center gap-3"
              >
                <IconButton
                  icon="Send"
                  :variant="each"
                  color="blue"
                  size="md"
                  :sr-label="each"
                />
                <span class="text-sm opacity-70">{{ each }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Size ladder — solid, fixed tone
            </span>
            <div class="flex flex-wrap items-end gap-3">
              <div
                v-for="each in CONTROL_SIZES"
                :key="each"
                class="flex flex-col items-center gap-1.5"
              >
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  :size="each"
                  :sr-label="each"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              All {{ TRUE_COLORS.length }} tones — solid, fixed size
            </span>
            <div class="flex flex-wrap items-end gap-3">
              <div
                v-for="each in TRUE_COLORS"
                :key="each"
                class="flex flex-col items-center gap-1.5"
              >
                <IconButton
                  icon="Send"
                  variant="solid"
                  :color="each"
                  size="md"
                  :sr-label="each"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Corner radius — solid, fixed tone
            </span>
            <div class="flex flex-wrap items-end gap-4">
              <div
                v-for="each in ROUNDED_SHAPES"
                :key="each"
                class="flex flex-col items-center gap-1.5"
              >
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  size="lg"
                  :rounded="each"
                  :sr-label="each"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              States — hover and press these
            </span>
            <div class="flex flex-wrap items-end gap-4">
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  size="lg"
                  sr-label="Default"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Default
                </span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  size="lg"
                  loading
                  sr-label="Loading"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Loading
                </span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  size="lg"
                  disabled
                  sr-label="Disabled"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Disabled
                </span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Send"
                  variant="soft"
                  color="blue"
                  size="lg"
                  accent
                  sr-label="Accent"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Accent
                </span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Heart"
                  variant="soft"
                  color="neutral"
                  size="lg"
                  icon-color="red"
                  sr-label="Tinted icon"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Icon tint
                </span>
              </div>
              <div class="flex flex-col items-center gap-1.5">
                <IconButton
                  icon="Send"
                  variant="solid"
                  color="blue"
                  size="lg"
                  tooltip="Hover me"
                  tooltip-position="top"
                  sr-label="Tooltip"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  Tooltip
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Glass — hover and press these
            </span>
            <div class="flex flex-wrap items-end gap-4">
              <div
                v-for="each in SPECULAR_MODES"
                :key="each"
                class="flex flex-col items-center gap-1.5"
              >
                <IconButton
                  icon="Search"
                  variant="glass"
                  color="blue"
                  size="lg"
                  :specular-mode="each"
                  :sr-label="each"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Fill opacity, vibrancy and the full glass playground live in the
              Glass Buttons section above.
            </p>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

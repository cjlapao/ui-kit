<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { IconButton, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from "@cjlapao/ui-kit-vue";
import {
  colorOptions,
  buttonVariantOptions,
  buttonSizeOptions,
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

const iconButtonVariant = ref<ButtonVariant>("solid");
const iconButtonSize = ref<ButtonSize>("md");
const iconButtonColor = ref<ButtonColor>("blue");
const iconButtonLoading = ref(false);
const iconButtonDisabled = ref(false);
const iconButtonAccent = ref(false);

const toggleItems = [
  { label: "Loading", model: iconButtonLoading },
  { label: "Disabled", model: iconButtonDisabled },
  { label: "Accent", model: iconButtonAccent },
];
</script>

<template>
  <PlaygroundSection
    title="Icon Buttons"
    label="[IconButton]"
    description="Adjust accent, size, and loading states."
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
            :model-value="iconButtonColor"
            size="sm"
            @update:model-value="iconButtonColor = $event as ButtonColor"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-2 text-sm">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="buttonVariantOptions"
              :model-value="iconButtonVariant"
              size="sm"
              @update:model-value="iconButtonVariant = $event as ButtonVariant"
            />
          </label>
          <label class="flex flex-col gap-2 text-sm">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="buttonSizeOptions"
              :model-value="iconButtonSize"
              size="sm"
              @update:model-value="iconButtonSize = $event as ButtonSize"
            />
          </label>
        </div>
        <div class="grid gap-2 text-sm md:grid-cols-2">
          <label
            v-for="item in toggleItems"
            :key="item.label"
            class="flex items-center justify-between gap-2"
          >
            <span>{{ item.label }}</span>
            <Toggle
              size="sm"
              :model-value="item.model.value"
              @update:model-value="item.model.value = $event"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <IconButton
        :variant="iconButtonVariant"
        :color="iconButtonColor"
        :loading="iconButtonLoading"
        :disabled="iconButtonDisabled"
        icon="Send"
        :size="iconButtonSize"
        :accent="iconButtonAccent"
        @click="createUpdateToast()"
      />
    </template>
  </PlaygroundSection>
</template>

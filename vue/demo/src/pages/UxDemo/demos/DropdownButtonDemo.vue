<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  DropdownButton,
  DropdownMenu,
  MultiToggle,
  Toggle,
  Button,
} from "@cjlapao/ui-kit-vue";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from "@cjlapao/ui-kit-vue";
import {
  dropdownButtonOptions,
  dropdownMenuPreviewOptions,
  buttonVariantOptions,
  colorOptions,
  buttonSizeOptions,
  dropdownWidthOptions,
  dropdownAlignOptions,
  dropdownSideOptions,
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

const menuPreviewAlign = ref<"start" | "end">("end");
const menuPreviewSide = ref<"auto" | "top" | "bottom">("auto");
const menuPreviewOpen = ref(false);
const menuPreviewAnchorRef = ref<InstanceType<typeof Button> | null>(null);
const menuPreviewAnchorEl = computed(
  () => menuPreviewAnchorRef.value?.el ?? null,
);
const menuPreviewSelection = ref("Nothing selected");
</script>

<template>
  <PlaygroundSection
    title="Dropdown Button"
    label="[DropdownButton]"
    description="Control the trigger button plus preview the dropdown menu positioning."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-1">
          <span>Variant</span>
          <MultiToggle
            :options="buttonVariantOptions"
            :model-value="dropdownButtonVariant"
            size="sm"
            full-width
            @update:model-value="
              dropdownButtonVariant = $event as ButtonVariant
            "
          />
        </label>
        <label class="flex flex-col gap-1">
          <span>Color</span>
          <MultiToggle
            :options="colorOptions"
            :model-value="dropdownButtonColor"
            size="sm"
            full-width
            @update:model-value="dropdownButtonColor = $event as ButtonColor"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span>Size</span>
          <MultiToggle
            :options="buttonSizeOptions"
            :model-value="dropdownButtonSize"
            size="sm"
            full-width
            @update:model-value="dropdownButtonSize = $event as ButtonSize"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span>Menu Width</span>
          <MultiToggle
            :options="dropdownWidthOptions"
            :model-value="dropdownMenuWidthChoice"
            size="sm"
            full-width
            @update:model-value="
              dropdownMenuWidthChoice = $event as 'trigger' | '240' | '320'
            "
          />
        </label>
        <div class="grid grid-cols-2 gap-2">
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
      <div class="space-y-4">
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
              const labelText = safeLabelText(option.label, option.value ?? '');
              createUpdateToast(`Selected ${labelText}`);
            }
          "
        />
        <div
          class="rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100"
        >
          <div class="mb-2 flex flex-wrap gap-2">
            <label
              class="flex flex-col text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
            >
              Align
              <MultiToggle
                :options="dropdownAlignOptions"
                size="sm"
                :model-value="menuPreviewAlign"
                @update:model-value="
                  menuPreviewAlign = $event as 'start' | 'end'
                "
              />
            </label>
            <label
              class="flex flex-col text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
            >
              Side
              <MultiToggle
                :options="dropdownSideOptions"
                size="sm"
                :model-value="menuPreviewSide"
                @update:model-value="
                  menuPreviewSide = $event as 'auto' | 'top' | 'bottom'
                "
              />
            </label>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <Button
              ref="menuPreviewAnchorRef"
              variant="outline"
              size="sm"
              @click="menuPreviewOpen = !menuPreviewOpen"
            >
              {{ menuPreviewOpen ? "Hide Menu" : "Show Menu" }}
            </Button>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">
              Selection: {{ menuPreviewSelection }}
            </span>
          </div>
          <DropdownMenu
            :anchor-ref="menuPreviewAnchorEl"
            :open="menuPreviewOpen"
            :items="dropdownMenuPreviewOptions"
            :align="menuPreviewAlign"
            :side="menuPreviewSide"
            @close="menuPreviewOpen = false"
            @select="
              (item) => {
                menuPreviewSelection = safeLabelText(
                  item.label,
                  item.value ?? '',
                );
                menuPreviewOpen = false;
              }
            "
          />
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EmptyState, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type {
  EmptyStateProps,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  IconName,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  alertToneOptions,
  buttonVariantOptions,
  colorOptions,
  buttonSizeOptions,
} from "../constants";

type EmptyStateTone = EmptyStateProps["tone"];

const emptyTone = ref<EmptyStateTone>("neutral");
const emptyTitle = ref("All caught up");
const emptySubtitle = ref(
  "Connect your first workspace or import data to see activity here.",
);
const emptyShowSubtitle = ref(true);
const emptyShowIcon = ref(true);
const emptyShowAction = ref(true);
const emptyButtonText = ref("Create workspace");
const emptyActionVariant = ref<ButtonVariant>("soft");
const emptyActionColor = ref<ButtonColor>("blue");
const emptyFullWidth = ref(false);
const emptyActionSize = ref<ButtonSize>("sm");
const emptyActionUseIcon = ref(false);
// "Plus" matches the React demo; it is not in the registry, so CustomIcon
// renders its fallback badge — same visible behavior as the React app.
const emptyActionLeadingIcon = ref<IconName>("Plus" as IconName);

const toggleOptions = [
  { label: "Show subtitle", model: emptyShowSubtitle },
  { label: "Show icon", model: emptyShowIcon },
  { label: "Show action", model: emptyShowAction },
  { label: "Full width", model: emptyFullWidth },
  { label: "Leading icon", model: emptyActionUseIcon },
];
</script>

<template>
  <PlaygroundSection
    title="Empty States"
    label="[EmptyState]"
    description="Use Tailwind empty states with tone, icon, and action controls."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="alertToneOptions"
              :model-value="emptyTone ?? 'neutral'"
              size="sm"
              @update:model-value="emptyTone = $event as EmptyStateTone"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Action variant</span>
            <MultiToggle
              full-width
              :options="buttonVariantOptions"
              :model-value="emptyActionVariant"
              size="sm"
              @update:model-value="emptyActionVariant = $event as ButtonVariant"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Action color</span>
            <MultiToggle
              full-width
              :options="colorOptions"
              :model-value="emptyActionColor"
              size="sm"
              @update:model-value="emptyActionColor = $event as ButtonColor"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Action size</span>
            <MultiToggle
              full-width
              :options="buttonSizeOptions"
              :model-value="emptyActionSize"
              size="sm"
              @update:model-value="emptyActionSize = $event as ButtonSize"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Button label</span>
            <input
              type="text"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900"
              v-model="emptyButtonText"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Leading icon name</span>
            <input
              type="text"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900 disabled:opacity-50"
              :value="emptyActionLeadingIcon"
              :disabled="!emptyActionUseIcon"
              @input="
                emptyActionLeadingIcon = (
                  $event.target as HTMLInputElement
                ).value as IconName
              "
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Title</span>
            <input
              type="text"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900"
              v-model="emptyTitle"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Subtitle</span>
            <textarea
              :rows="3"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900"
              v-model="emptySubtitle"
            />
          </label>
        </div>
        <div class="grid gap-2 md:grid-cols-3">
          <label
            v-for="option in toggleOptions"
            :key="option.label"
            class="flex items-center justify-between"
          >
            <span>{{ option.label }}</span>
            <Toggle
              size="sm"
              :model-value="option.model.value"
              @update:model-value="option.model.value = $event"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <EmptyState
        :class="emptyFullWidth ? undefined : 'mx-auto max-w-xl'"
        :tone="emptyTone"
        :title="emptyTitle || 'Empty state title'"
        :subtitle="emptyShowSubtitle ? emptySubtitle || undefined : undefined"
        :show-icon="emptyShowIcon"
        :action-label="
          emptyShowAction ? emptyButtonText || 'Create item' : undefined
        "
        :on-action="
          emptyShowAction
            ? () => console.log('Empty state action clicked')
            : undefined
        "
        :action-variant="emptyActionVariant"
        :action-color="emptyActionColor"
        :action-size="emptyActionSize"
        :action-leading-icon="
          emptyActionUseIcon ? emptyActionLeadingIcon : undefined
        "
      />
    </template>
  </PlaygroundSection>
</template>

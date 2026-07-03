<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { CollapsibleHelpText, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type { ThemeColor } from "@cjlapao/ui-kit-vue";
import { colorOptions, collapsibleVariantOptions } from "../constants";

const helpTone = ref<ThemeColor>("emerald");
const helpShowIcon = ref<boolean>(true);
const helpUseLongCopy = ref<boolean>(true);
const helpMaxLength = ref<number>(130);
const helpVariant = ref<"card" | "plain">("card");

const shortHelpCopy =
  "We encrypt your API tokens client-side using the session keys you configure here.";
const longHelpCopy =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";
</script>

<template>
  <PlaygroundSection
    title="Collapsible Help Text"
    label="[CollapsibleHelpText]"
    description="Inline helper copy that truncates to a summary and expands for more context."
  >
    <template #controls>
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col gap-3">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1">
              <span
                class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
              >
                Tone
              </span>
              <MultiToggle
                full-width
                size="sm"
                :options="colorOptions"
                :model-value="helpTone"
                @update:model-value="helpTone = $event as ThemeColor"
              />
            </div>
            <div class="space-y-1">
              <span
                class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
              >
                Variant
              </span>
              <MultiToggle
                full-width
                size="sm"
                :options="collapsibleVariantOptions"
                :model-value="helpVariant"
                @update:model-value="helpVariant = $event as 'card' | 'plain'"
              />
            </div>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <label class="flex items-center justify-between gap-2 text-sm">
              <span>Show Icon</span>
              <Toggle size="sm" v-model="helpShowIcon" />
            </label>
            <label class="flex items-center justify-between gap-2 text-sm">
              <span>Use Long Copy</span>
              <Toggle size="sm" v-model="helpUseLongCopy" />
            </label>
          </div>
          <div class="space-y-1">
            <label
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Max Length ({{ helpMaxLength }} characters)
            </label>
            <input
              type="range"
              :min="60"
              :max="240"
              v-model.number="helpMaxLength"
              class="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>
    </template>
    <template #preview>
      <CollapsibleHelpText
        :title="helpUseLongCopy ? 'Why we ask for reviews' : 'Secret tokens'"
        :text="helpUseLongCopy ? longHelpCopy : shortHelpCopy"
        :show-icon="helpShowIcon"
        :tone="helpTone"
        :max-length="helpMaxLength"
        :variant="helpVariant"
      />
    </template>
  </PlaygroundSection>
</template>

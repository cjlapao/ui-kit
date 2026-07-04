<script setup lang="ts">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  CollapsiblePanel,
  MultiToggle,
  Toggle,
  Button,
} from "@cjlapao/ui-kit-vue";
import type { PanelTone } from "@cjlapao/ui-kit-vue";
import { panelToneOptions, GLOBAL_NOTIFICATION_CHANNEL } from "../constants";
import notificationService from "../mocks/NotificationService";

const collapsiblePanelVariant = ref<"elevated" | "glass">("elevated");
const collapsiblePanelTone = ref<PanelTone>("neutral");
const collapsiblePanelExpanded = ref(true);
const collapsiblePanelDisabled = ref(false);

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  console.info("Creating update notification with id:", id);
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
</script>

<template>
  <PlaygroundSection
    title="Collapsible Panel"
    label="[CollapsiblePanel]"
    description="Simple accordion-style panel with tone and variant controls."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'Elevated', value: 'elevated' },
                { label: 'Glass', value: 'glass' },
              ]"
              :model-value="collapsiblePanelVariant"
              size="sm"
              @update:model-value="
                collapsiblePanelVariant = $event as 'elevated' | 'glass'
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="panelToneOptions"
              :model-value="collapsiblePanelTone"
              size="sm"
              @update:model-value="collapsiblePanelTone = $event as PanelTone"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex items-center justify-between">
            <span>Expanded</span>
            <Toggle size="sm" v-model="collapsiblePanelExpanded" />
          </label>
          <label class="flex items-center justify-between">
            <span>Disabled</span>
            <Toggle size="sm" v-model="collapsiblePanelDisabled" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <CollapsiblePanel
        title="Deployment logs"
        subtitle="Last updated 5 minutes ago"
        :tone="collapsiblePanelTone"
        :variant="collapsiblePanelVariant"
        :expanded="collapsiblePanelExpanded"
        :disabled="collapsiblePanelDisabled"
        @toggle="collapsiblePanelExpanded = $event"
      >
        <template #actions>
          <Button
            size="xs"
            variant="ghost"
            color="slate"
            @click="createUpdateToast()"
          >
            Refresh
          </Button>
        </template>
        <p>
          Showing the latest deployment output. Errors and status logs appear
          here while we run automated checks against the new release.
        </p>
      </CollapsiblePanel>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { Alert, Button, MultiToggle, Toggle, Pill } from "@cjlapao/ui-kit-vue";
import type { AlertVariant, ThemeColor } from "@cjlapao/ui-kit-vue";
import { alertToneOptions, alertVariantOptions } from "../constants";
import notificationService from "../mocks/NotificationService";
import { GLOBAL_NOTIFICATION_CHANNEL } from "../constants";
import { v4 as uuidv4 } from "uuid";

type AlertTone = ThemeColor;

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
    message: "Update successful",
    details: message || "Your changes have been saved.",
    type: "success",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
  });
};

const alertTone = ref<AlertTone>("info");
const alertVariant = ref<AlertVariant>("subtle");
const alertTitle = ref("Deployment paused");
const alertDescription = ref(
  "We paused rollout while we investigate a spike in error rates.",
);
const alertShowIcon = ref(true);
const alertDismissible = ref(true);
const alertShowActions = ref(true);

const alertToggleItems = [
  { label: "Show icon", model: alertShowIcon },
  { label: "Dismissible", model: alertDismissible },
  { label: "Show actions", model: alertShowActions },
];

const successPillIcon = h(
  Pill,
  { size: "xs", tone: "success", variant: "solid" },
  () => "OK",
);
</script>

<template>
  <PlaygroundSection
    title="Alerts"
    label="[Alert]"
    description="Contextual banners with tone, icon, and action controls."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="alertToneOptions"
              :model-value="alertTone"
              size="sm"
              @update:model-value="alertTone = $event as AlertTone"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="alertVariantOptions"
              :model-value="alertVariant"
              size="sm"
              @update:model-value="alertVariant = $event as AlertVariant"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-1 text-sm">
            <span>Title</span>
            <input
              type="text"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900"
              v-model="alertTitle"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Description</span>
            <textarea
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900"
              v-model="alertDescription"
              :rows="3"
            />
          </label>
        </div>
        <div class="grid gap-2 md:grid-cols-4">
          <label
            v-for="item in alertToggleItems"
            :key="item.label"
            class="flex items-center justify-between gap-2"
          >
            <span>{{ item.label }}</span>
            <Toggle size="sm" v-model="item.model.value" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-4">
        <Alert
          :tone="alertTone"
          :variant="alertVariant"
          :title="alertTitle || undefined"
          :description="alertDescription || undefined"
          :icon="alertShowIcon ? undefined : false"
          :dismissible="alertDismissible"
          @dismiss="createUpdateToast('Alert dismissed')"
        >
          <template v-if="alertShowActions" #actions>
            <div class="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="soft"
                color="blue"
                @click="createUpdateToast()"
              >
                Resolve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                color="slate"
                @click="createUpdateToast('Snoozed')"
              >
                Snooze
              </Button>
            </div>
          </template>
        </Alert>
        <Alert
          tone="success"
          variant="outline"
          title="Everything looks good"
          description="We finished deploying the latest changes to all regions."
          :icon="successPillIcon"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>

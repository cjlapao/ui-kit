<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { Panel, MultiToggle, Toggle, Badge, useTheme } from "@cjlapao/ui-kit-vue";
import type { PanelProps, PanelTone, PanelSpecularMode } from "@cjlapao/ui-kit-vue";
import parallels from "@assets/images/parallels.png";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";
import {
  panelVariantOptions,
  panelToneOptions,
  panelMediaPlacementOptions,
  panelActionLayoutOptions,
  panelPaddingOptions,
  panelCornerOptions,
  panelLoadingTypeOptions,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { GLOBAL_NOTIFICATION_CHANNEL } from "../constants";
import { v4 as uuidv4 } from "uuid";

type PanelVariant = NonNullable<PanelProps["variant"]>;
type PanelCorner = NonNullable<PanelProps["corner"]>;
type PanelMediaPlacement = NonNullable<PanelProps["mediaPlacement"]>;
type PanelLoaderType = NonNullable<PanelProps["loaderType"]>;
type PanelActionLayout = NonNullable<PanelProps["actionLayout"]>;
type PanelPadding = NonNullable<PanelProps["padding"]>;
type PanelAction = NonNullable<PanelProps["actions"]>[number];

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

const panelTone = ref<PanelTone>("neutral");
const panelVariant = ref<PanelVariant>("elevated");
const panelLoading = ref<boolean>(false);
const panelCorner = ref<PanelCorner>("rounded");
const panelHasMedia = ref<boolean>(true);
const panelMediaPlacement = ref<PanelMediaPlacement>("top");
const panelHasActions = ref<boolean>(true);
const panelHasBadge = ref<boolean>(true);
const panelLoadingType = ref<PanelLoaderType>("spinner");
const panelActionLayout = ref<PanelActionLayout>("inline");
const panelPadding = ref<PanelPadding>("md");
const panelFullWidth = ref<boolean>(false);
const panelHoverShadow = ref<boolean>(false);
const panelDisabled = ref<boolean>(false);
const glassVibrancy = ref<"low" | "medium" | "high">("medium");
const glassOpacity = ref<"frosted" | "light" | "clear">("frosted");
const specularMode = ref<PanelSpecularMode>("classic");
const panelHasBackground = ref<boolean>(false);
const { effectiveTheme } = useTheme();

const panelActions = computed<PanelAction[]>(() =>
  panelHasActions.value
    ? [
        {
          variant: "solid",
          label: "Open",
          color: "blue",
          onClick: () => createUpdateToast(),
        },
        {
          variant: "solid",
          label: "Close",
          color: "rose",
          onClick: () => createUpdateToast(),
        },
      ]
    : [],
);

const panelTitle = computed(
  () =>
    `${panelVariant.value.charAt(0).toUpperCase() + panelVariant.value.slice(1)} Panel`,
);

const toggleOptions = [
  { label: "Media", state: panelHasMedia },
  { label: "Badge", state: panelHasBadge },
  { label: "Actions", state: panelHasActions },
  { label: "Loading", state: panelLoading },
  { label: "Full width", state: panelFullWidth },
  { label: "Disabled", state: panelDisabled },
  { label: "Hover shadow", state: panelHoverShadow },
  { label: "Background image", state: panelHasBackground },
];

const glassVibrancyOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const specularModeOptions = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

const glassOpacityOptions = [
  { label: "Frosted", value: "frosted" },
  { label: "Light", value: "light" },
  { label: "Clear", value: "clear" },
];
</script>

<template>
  <PlaygroundSection
    title="Panels"
    label="[Panel]"
    description="Card layout with media, badges, actions, and loaders."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="panelVariantOptions"
              :model-value="panelVariant"
              size="sm"
              @update:model-value="panelVariant = $event as PanelVariant"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="panelToneOptions"
              :model-value="panelTone"
              size="sm"
              @update:model-value="panelTone = $event as PanelTone"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex flex-col gap-2">
            <span>Media placement</span>
            <MultiToggle
              full-width
              :options="panelMediaPlacementOptions"
              :model-value="panelMediaPlacement"
              size="sm"
              @update:model-value="
                panelMediaPlacement = $event as PanelMediaPlacement
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Action layout</span>
            <MultiToggle
              full-width
              :options="panelActionLayoutOptions"
              :model-value="panelActionLayout"
              size="sm"
              @update:model-value="
                panelActionLayout = $event as PanelActionLayout
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Padding</span>
            <MultiToggle
              full-width
              :options="panelPaddingOptions"
              :model-value="panelPadding"
              size="sm"
              @update:model-value="panelPadding = $event as PanelPadding"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Corner</span>
            <MultiToggle
              full-width
              :options="panelCornerOptions"
              :model-value="panelCorner"
              size="sm"
              @update:model-value="panelCorner = $event as PanelCorner"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Loader type</span>
            <MultiToggle
              full-width
              :options="panelLoadingTypeOptions"
              :model-value="panelLoadingType"
              size="sm"
              @update:model-value="panelLoadingType = $event as PanelLoaderType"
            />
          </label>
        </div>
        <div class="grid gap-2 md:grid-cols-3">
          <Toggle
            v-for="option in toggleOptions"
            :key="option.label"
            size="sm"
            :label="option.label"
            v-model="option.state.value"
          />
        </div>
        <div
          v-if="panelVariant === 'liquid-glass'"
          class="grid gap-3 md:grid-cols-2"
        >
          <label class="flex flex-col gap-2 dark:text-white">
            <span>Glass vibrancy</span>
            <MultiToggle
              full-width
              :options="glassVibrancyOptions"
              :model-value="glassVibrancy"
              size="sm"
              @update:model-value="
                glassVibrancy = $event as 'low' | 'medium' | 'high'
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Glass opacity</span>
            <MultiToggle
              full-width
              :options="glassOpacityOptions"
              :model-value="glassOpacity"
              size="sm"
              @update:model-value="
                glassOpacity = $event as 'frosted' | 'light' | 'clear'
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Specular mode</span>
            <MultiToggle
              full-width
              :options="specularModeOptions"
              :model-value="specularMode"
              size="sm"
              @update:model-value="specularMode = $event as PanelSpecularMode"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div
        :class="
          panelHasBackground
            ? 'relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat'
            : undefined
        "
        :style="
          panelHasBackground
            ? {
                backgroundImage: `url(${
                  effectiveTheme === 'dark' ? backdropDark : backdropLight
                })`,
              }
            : undefined
        "
      >
        <div class="space-y-4 p-6">
          <Panel
            :title="panelTitle"
            subtitle="This is a subtitle"
            :tone="panelTone"
            :variant="panelVariant"
            :vibrancy="glassVibrancy"
            :glass-opacity="glassOpacity"
            :specular-mode="specularMode"
            :media-placement="panelMediaPlacement"
            :corner="panelCorner"
            :loader-progress="30"
            :loading="panelLoading"
            :disabled="panelDisabled"
            :loader-type="panelLoadingType"
            loader-title="Loading..."
            loader-message="Getting things ready..."
            :padding="panelPadding"
            :action-layout="panelActionLayout"
            :full-width="panelFullWidth"
            :actions="panelActions"
            :hover-shadow="panelHoverShadow"
          >
            <template v-if="panelHasMedia" #media>
              <img :src="parallels" alt="Parallels" />
            </template>
            <template v-if="panelHasBadge" #badge>
              <Badge :count="10" tone="brand" />
            </template>
            This Panel uses the {{ panelVariant }} variant
          </Panel>
          <Panel
            v-if="!panelFullWidth"
            title="Secondary Panel"
            subtitle="Loading demo"
            :tone="panelTone"
            :variant="panelVariant"
            :vibrancy="glassVibrancy"
            :glass-opacity="glassOpacity"
            :specular-mode="specularMode"
            :loader-progress="45"
            :loading="panelLoading"
            loader-type="progress"
            :padding="panelPadding"
            :action-layout="panelActionLayout"
            :actions="panelActions"
            :hover-shadow="panelHoverShadow"
          >
            Secondary panel preview
          </Panel>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Tabs,
  MultiToggle,
  Toggle,
  Select,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  TabsVariant,
  TabsSize,
  TabsOrientation,
  TabsJustify,
  TabItem,
  TrueColor,
  SpecularMode,
  TabsRadius,
} from "@cjlapao/ui-kit-vue";
import {
  trueColorOptions,
  tabVariantOptions,
  tabSizeOptions,
  tabOrientationOptions,
  tabJustifyOptions,
  tabRadiusOptions,
  glassVibrancyOptions,
  glassOpacityOptions,
  pillSpecularOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

const TAB_VARIANTS: TabsVariant[] = [
  "underline",
  "soft",
  "pill",
  "segmented",
  "minimal",
  "glass",
  "liquid-glass",
];
const TAB_SIZES: TabsSize[] = ["sm", "md", "lg"];

// The demo's glass pickers only offer the string presets, so the state is typed
// narrowly (a bare `GlassVibrancy`/`GlassOpacity` would carry `| number`, which
// a `MultiToggle` value can't accept). Both are still assignable to the props.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

// A soft, low-contrast backdrop so the glass variants have something to blur
// even when the header's "Background image" toggle is off.
const GLASS_BACKDROP =
  "rounded-2xl bg-gradient-to-br from-sky-200/60 via-violet-200/50 to-amber-200/60 p-4 dark:from-sky-950/50 dark:via-violet-950/40 dark:to-amber-950/40";

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id,
    message: "You clicked something!",
    details: message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const panel = (title: string, value: string, note: string) =>
  h("div", { class: "mt-3 rounded-xl border border-slate-200 bg-white/80 p-4" }, [
    h("p", { class: "text-xs font-semibold text-slate-500" }, title),
    h("p", { class: "text-xl font-bold text-slate-900 dark:text-white" }, value),
    h("p", { class: "text-xs text-slate-500" }, note),
  ]);

// Reference items for the fixed specimens. None carry a `panel`, so each
// renders only its tab bar.
const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

// Shows every tab-bar feature at once: icon, description, badge, a disabled
// tab, and contextual actions on the (default-active) first tab.
const STATE_ITEMS: TabItem[] = [
  {
    id: "a",
    label: "Deploy",
    icon: "Run",
    description: "Active rings",
    badge: "Live",
    actions: [
      {
        id: "create",
        icon: "Add",
        label: "Create release",
        active: true,
        onClick: () => createUpdateToast("Create release"),
      },
      {
        id: "sync",
        icon: "Reset",
        label: "Sync status",
        onClick: () => createUpdateToast("Sync status"),
      },
    ],
  },
  { id: "b", label: "Analytics", icon: "ViewGrid", description: "Usage" },
  { id: "c", label: "Locked", icon: "Key", disabled: true, badge: "3" },
];

const tabsVariant = ref<TabsVariant>("underline");
const tabsSize = ref<TabsSize>("md");
const tabsColor = ref<TrueColor>("blue");
const tabsOrientation = ref<TabsOrientation>("horizontal");
const tabsJustify = ref<TabsJustify>("start");
const tabsFullWidth = ref(false);
const tabsShowDividers = ref(false);
const tabsShowActions = ref(true);
const tabsScrollFade = ref(true);
const tabsVibrancy = ref<VibrancyPreset>("medium");
const tabsGlassOpacity = ref<OpacityPreset>("frosted");
const tabsSpecular = ref<SpecularMode>("none");
const tabsRadius = ref<TabsRadius>("md");
const tabsValue = ref("deployments");

const isGlass = computed(
  () =>
    tabsVariant.value === "glass" || tabsVariant.value === "liquid-glass",
);

const liveItems = computed<TabItem[]>(() => {
  const actions = tabsShowActions.value
    ? [
        {
          id: "create-release",
          icon: "Add",
          label: "Create release",
          active: true,
          onClick: () => createUpdateToast("Create release"),
        },
        {
          id: "sync-status",
          icon: "Reset",
          label: "Sync status",
          onClick: () => createUpdateToast("Sync status"),
        },
      ]
    : undefined;

  return [
    {
      id: "deployments",
      label: "Deployments",
      icon: "Run",
      description: "Active release rings",
      badge: "Live",
      actions,
      panel: panel("Production", "v2.18.4", "Healthy · deployed 3m ago"),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "ViewGrid",
      description: "Usage and adoption",
      panel: panel("Active seats", "247", "+12 new this week"),
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: "Notification",
      badge: "2",
      description: "Incidents & reviews",
      panel: panel("Open incidents", "2", "Database latency · API rate limit"),
    },
  ];
});
</script>

<template>
  <PlaygroundSection
    title="Tabs"
    label="[Tabs]"
    description="Switch between panes with contextual actions. Pick any of the full palette, choose a variant (including glass), and browse the fixed specimens for variant, size, tone, orientation, states and glass."
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
              :model-value="tabsColor"
              @update:model-value="tabsColor = $event as TrueColor"
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
              :model-value="tabsVariant"
              @update:model-value="tabsVariant = $event as TabsVariant"
            >
              <option
                v-for="option in tabVariantOptions"
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
              :options="tabSizeOptions"
              :model-value="tabsSize"
              size="sm"
              @update:model-value="tabsSize = $event as TabsSize"
            />
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Orientation
            </span>
            <MultiToggle
              full-width
              :options="tabOrientationOptions"
              :model-value="tabsOrientation"
              size="sm"
              @update:model-value="
                tabsOrientation = $event as TabsOrientation
              "
            />
          </div>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
            Justify
          </span>
          <MultiToggle
            full-width
            :options="tabJustifyOptions"
            :model-value="tabsJustify"
            size="sm"
            @update:model-value="tabsJustify = $event as TabsJustify"
          />
        </div>
        <div v-if="isGlass">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Vibrancy
              </span>
              <MultiToggle
                full-width
                :options="glassVibrancyOptions"
                :model-value="tabsVibrancy"
                size="sm"
                @update:model-value="tabsVibrancy = $event as VibrancyPreset"
              />
            </div>
            <div class="space-y-2">
              <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Fill opacity
              </span>
              <MultiToggle
                full-width
                :options="glassOpacityOptions"
                :model-value="tabsGlassOpacity"
                size="sm"
                @update:model-value="
                  tabsGlassOpacity = $event as OpacityPreset
                "
              />
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Specular
            </span>
            <MultiToggle
              full-width
              :options="pillSpecularOptions"
              :model-value="tabsSpecular"
              size="sm"
              @update:model-value="tabsSpecular = $event as SpecularMode"
            />
          </div>
          <div class="mt-4 space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Radius
            </span>
            <Select
              size="sm"
              aria-label="Radius"
              :model-value="tabsRadius"
              @update:model-value="tabsRadius = $event as TabsRadius"
            >
              <option
                v-for="option in tabRadiusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Toggle
            size="sm"
            full-width
            label="Full width"
            v-model="tabsFullWidth"
          />
          <Toggle
            size="sm"
            full-width
            label="Dividers"
            v-model="tabsShowDividers"
          />
          <Toggle
            size="sm"
            full-width
            label="Actions"
            v-model="tabsShowActions"
          />
          <Toggle
            size="sm"
            full-width
            label="Scroll fade"
            v-model="tabsScrollFade"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-4 p-2">
        <!-- The only block the controls drive. It sits on a soft backdrop so the
             glass variants have something to blur. -->
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <div :class="GLASS_BACKDROP">
            <Tabs
              v-model="tabsValue"
              :items="liveItems"
              :variant="tabsVariant"
              :size="tabsSize"
              :color="tabsColor"
              :orientation="tabsOrientation"
              :justify="tabsJustify"
              :full-width="tabsFullWidth"
              :show-dividers="tabsShowDividers"
              :scroll-fade="tabsScrollFade"
              :vibrancy="tabsVibrancy"
              :glass-opacity="tabsGlassOpacity"
              :specular-mode="tabsSpecular"
              :radius="tabsRadius"
            />
          </div>
        </div>

        <!-- Fixed reference specimens — none of these move with the controls. -->
        <div class="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Every variant — fixed tone &amp; size
            </span>
            <div :class="GLASS_BACKDROP">
              <div class="grid gap-3 md:grid-cols-2">
                <div
                  v-for="each in TAB_VARIANTS"
                  :key="each"
                  class="space-y-1.5"
                >
                  <span class="text-xs opacity-60">{{ each }}</span>
                  <Tabs
                    :items="MINI_ITEMS"
                    :variant="each"
                    color="blue"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Size ladder — underline, fixed tone
            </span>
            <div class="flex flex-wrap items-end gap-4">
              <div
                v-for="each in TAB_SIZES"
                :key="each"
                class="space-y-1.5"
              >
                <Tabs
                  :items="TRIO_ITEMS"
                  variant="underline"
                  color="blue"
                  :size="each"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              All {{ TRUE_COLORS.length }} tones — underline, fixed size
            </span>
            <div class="flex flex-wrap items-end gap-3">
              <div
                v-for="each in TRUE_COLORS"
                :key="each"
                class="space-y-1.5"
              >
                <Tabs
                  :items="MINI_ITEMS"
                  variant="underline"
                  :color="each"
                  size="sm"
                />
                <span class="text-[10px] uppercase tracking-wide opacity-60">
                  {{ each }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Vertical orientation — soft, fixed tone
            </span>
            <div class="flex gap-4">
              <Tabs
                :items="TRIO_ITEMS"
                variant="soft"
                color="blue"
                size="sm"
                orientation="vertical"
              />
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              States — icon, description, badge, disabled, actions
            </span>
            <Tabs
              :items="STATE_ITEMS"
              variant="soft"
              color="blue"
              size="md"
            />
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Glass — active tab carries a tone ring + specular
            </span>
            <div :class="GLASS_BACKDROP">
              <div class="flex flex-col gap-4">
                <Tabs
                  :items="TRIO_ITEMS"
                  variant="glass"
                  color="blue"
                  size="md"
                  specular-mode="classic"
                />
                <Tabs
                  :items="TRIO_ITEMS"
                  variant="liquid-glass"
                  color="indigo"
                  size="md"
                  specular-mode="halo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

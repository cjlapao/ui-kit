<script setup lang="ts">
import { computed, h, ref } from "vue";
import {
  Tabs,
  MultiToggle,
  Toggle,
  Button,
  type TabsProps,
  type TabItem,
  type ButtonColor,
  type IconName,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  tabVariantOptions,
  tabSizeOptions,
  tabColorOptions,
  tabOrientationOptions,
  tabJustifyOptions,
} from "../constants";

// The individual Tabs option types are not re-exported from the kit index;
// derive them from TabsProps.
type TabsVariant = NonNullable<TabsProps["variant"]>;
type TabsSize = NonNullable<TabsProps["size"]>;
type TabsOrientation = NonNullable<TabsProps["orientation"]>;
type TabsJustify = NonNullable<TabsProps["justify"]>;

const tabsVariant = ref<TabsVariant>("underline");
const tabsSize = ref<TabsSize>("md");
const tabsColor = ref<ButtonColor>("indigo");
const tabsOrientation = ref<TabsOrientation>("horizontal");
const tabsJustify = ref<TabsJustify>("start");
const tabsFullWidth = ref<boolean>(true);
const tabsShowDividers = ref<boolean>(false);
const tabsShowActions = ref<boolean>(true);
const tabsActiveAction = ref<string>("create-release");
const tabsValue = ref<string>("deployments");

const handleTabActionClick = (actionId: string | null) => {
  if (actionId) {
    tabsActiveAction.value = actionId;
  }
};

const tabsItems = computed<TabItem[]>(() => {
  const createActionId = "create-release";
  const syncActionId = "sync-status";
  const activeActions = tabsShowActions.value
    ? [
        {
          id: createActionId,
          icon: "Plus" as IconName,
          label: "Create release",
          active: tabsActiveAction.value === createActionId,
          onClick: () => handleTabActionClick(createActionId),
        },
        {
          id: syncActionId,
          icon: "Reset" as IconName,
          label: "Sync status",
          active: tabsActiveAction.value === syncActionId,
          onClick: () => handleTabActionClick(syncActionId),
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
      actions: activeActions,
      panel: h("div", { class: "mt-4 grid gap-3 md:grid-cols-2" }, [
        h(
          "div",
          {
            class:
              "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          },
          [
            h(
              "p",
              { class: "text-sm font-semibold text-slate-600" },
              "Production",
            ),
            h("p", { class: "text-2xl font-bold text-slate-900" }, "v2.18.4"),
            h(
              "p",
              { class: "text-xs text-slate-500" },
              "Healthy · last deploy 3 minutes ago",
            ),
          ],
        ),
        h(
          "div",
          {
            class:
              "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          },
          [
            h(
              "p",
              { class: "text-sm font-semibold text-slate-600" },
              "Staging",
            ),
            h(
              "p",
              { class: "text-2xl font-bold text-slate-900" },
              "v2.19.0-rc1",
            ),
            h("p", { class: "text-xs text-amber-600" }, "2 checks queued"),
          ],
        ),
      ]),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "ViewGrid",
      description: "Usage and adoption metrics",
      panel: h(
        "div",
        {
          class:
            "mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        },
        [
          h(
            "p",
            { class: "text-sm font-semibold text-slate-600" },
            "Active seats",
          ),
          h("div", { class: "mt-2 flex items-end gap-6" }, [
            h("div", [
              h("p", { class: "text-3xl font-bold text-slate-900" }, "247"),
              h(
                "p",
                { class: "text-xs text-emerald-600" },
                "+12 new this week",
              ),
            ]),
            h(
              "div",
              {
                class:
                  "flex flex-1 items-center gap-2 text-xs text-slate-500",
              },
              [
                h("span", {
                  class: "h-2 flex-1 rounded-full bg-emerald-500/30",
                }),
                h(
                  "span",
                  { class: "font-semibold text-emerald-700" },
                  "74% utilization",
                ),
              ],
            ),
          ]),
        ],
      ),
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: "Notification",
      badge: "2",
      description: "Incidents & change reviews",
      panel: h(
        "div",
        { class: "mt-4 space-y-3" },
        [
          {
            title: "Database latency spike",
            time: "10m ago",
            severity: "High",
          },
          {
            title: "API rate limit warning",
            time: "1h ago",
            severity: "Medium",
          },
        ].map((alert) =>
          h(
            "div",
            {
              key: alert.title,
              class:
                "flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2",
            },
            [
              h("div", [
                h(
                  "p",
                  { class: "text-sm font-medium text-slate-900" },
                  alert.title,
                ),
                h("p", { class: "text-xs text-slate-500" }, alert.time),
              ]),
              h(
                Button,
                {
                  size: "xs",
                  variant: "soft",
                  color: "slate",
                  onClick: () => handleTabActionClick(null),
                },
                () => "Ack",
              ),
            ],
          ),
        ),
      ),
    },
  ];
});
</script>

<template>
  <PlaygroundSection
    title="Tabs"
    label="[Tabs]"
    description="Switch between release dashboards with contextual actions."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Variant
            </span>
            <MultiToggle
              full-width
              :options="tabVariantOptions"
              :model-value="tabsVariant"
              size="sm"
              @update:model-value="
                (value: string) => (tabsVariant = value as TabsVariant)
              "
            />
          </div>
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Size
            </span>
            <MultiToggle
              full-width
              :options="tabSizeOptions"
              :model-value="tabsSize"
              size="sm"
              @update:model-value="
                (value: string) => (tabsSize = value as TabsSize)
              "
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Color
            </span>
            <MultiToggle
              full-width
              :options="tabColorOptions"
              :model-value="tabsColor"
              size="sm"
              @update:model-value="
                (value: string) => (tabsColor = value as ButtonColor)
              "
            />
          </div>
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Orientation
            </span>
            <MultiToggle
              full-width
              :options="tabOrientationOptions"
              :model-value="tabsOrientation"
              size="sm"
              @update:model-value="
                (value: string) =>
                  (tabsOrientation = value as TabsOrientation)
              "
            />
          </div>
        </div>
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Justify
          </span>
          <MultiToggle
            full-width
            :options="tabJustifyOptions"
            :model-value="tabsJustify"
            size="sm"
            @update:model-value="
              (value: string) => (tabsJustify = value as TabsJustify)
            "
          />
        </div>
        <div class="grid gap-2 md:grid-cols-3">
          <label class="flex items-center justify-between">
            <span class="text-sm">Full width</span>
            <Toggle size="sm" v-model="tabsFullWidth" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm">Show dividers</span>
            <Toggle size="sm" v-model="tabsShowDividers" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm">Show actions</span>
            <Toggle size="sm" v-model="tabsShowActions" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-4 rounded-2xl bg-slate-50 p-4">
        <Tabs
          v-model="tabsValue"
          :items="tabsItems"
          :variant="tabsVariant"
          :size="tabsSize"
          :color="tabsColor"
          :orientation="tabsOrientation"
          :justify="tabsJustify"
          :full-width="tabsFullWidth"
          :show-dividers="tabsShowDividers"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>

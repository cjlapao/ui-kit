<script setup lang="ts">
import { computed, h, ref, type VNode } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { TimelinePanel, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type {
  TimelinePanelItem,
  TimelinePanelVariant,
  TimelinePanelPadding,
} from "@cjlapao/ui-kit-vue";

// ── Inline SVG icons used in the demo ─────────────────────────────────────

const svgAttrs = {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.8",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;

const cameraIcon = (): VNode =>
  h("svg", svgAttrs, [
    h("path", {
      d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
    }),
    h("circle", { cx: "12", cy: "13", r: "4" }),
  ]);

const historyIcon = (): VNode =>
  h("svg", svgAttrs, [
    h("polyline", { points: "1 4 1 10 7 10" }),
    h("path", { d: "M3.51 15a9 9 0 1 0 .49-4.5" }),
    h("polyline", { points: "12 7 12 12 15 14" }),
  ]);

const dockerIcon = (): VNode =>
  h("svg", svgAttrs, [
    h("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    h("path", { d: "M7 8h2v2H7zM11 8h2v2h-2zM15 8h2v2h-2zM7 12h2v2H7zM11 12h2v2h-2z" }),
  ]);

const deployIcon = (): VNode =>
  h("svg", svgAttrs, [
    h("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }),
  ]);

// ── Snapshot data ──────────────────────────────────────────────────────────

const buildSnapshotItems = (
  onRevert: (id: string) => void,
  onDelete: (id: string) => void,
  onRename: (id: string) => void,
): TimelinePanelItem[] => {
  const snapshot = (
    id: string,
    icon: VNode | undefined,
    title: string,
    subtitle: string,
    extra: Partial<TimelinePanelItem>,
  ): TimelinePanelItem => ({
    id,
    icon,
    title,
    subtitle,
    ...extra,
    actions: [
      {
        label: "Revert to",
        variant: "ghost",
        color: "neutral",
        onClick: () => onRevert(id),
      },
      {
        label: "Delete",
        variant: "outline",
        color: "danger",
        onClick: () => onDelete(id),
      },
    ],
    overflowActions: [
      { label: "Comment/Rename", value: "rename", onClick: () => onRename(id) },
    ],
  });

  return [
    snapshot("snap-1", cameraIcon(), "Initial Base Image", "2024-06-14 10:15:22, 01:29 • 1.2 GB", { isRoot: true, depth: 0 }),
    snapshot("snap-2", dockerIcon(), "Pre-Docker Install", "2024-06-14 10:15:22, 01:22 • 1.2 GB", { depth: 1 }),
    snapshot("snap-3", historyIcon(), "Post-Configuration Patch", "2024-06-14 10:15:22, 03:30 • 1.2 GB", { depth: 2 }),
    snapshot("snap-4", historyIcon(), "Post-Configuration Patch", "2024-06-14 10:15:22, 09:30 • 1.2 GB", { depth: 2 }),
    {
      id: "current",
      title: "Current State",
      isCurrent: true,
      depth: 0,
      overflowActions: [
        {
          label: "Comment/Rename",
          value: "rename",
          onClick: () => onRename("current"),
        },
      ],
    },
  ];
};

const buildDeployItems = (): TimelinePanelItem[] => [
  {
    id: "dep-1",
    icon: deployIcon(),
    title: "Initial deploy",
    subtitle: "2024-05-01 09:00 • v1.0.0",
    isRoot: true,
    depth: 0,
    actions: [
      { label: "Rollback", variant: "outline", color: "warning", onClick: () => {} },
    ],
    overflowActions: [
      { label: "View logs", value: "logs" },
      { label: "Delete", value: "delete", danger: true },
    ],
  },
  {
    id: "dep-2",
    icon: deployIcon(),
    title: "Hotfix deploy",
    subtitle: "2024-05-03 14:22 • v1.0.1",
    depth: 1,
    actions: [
      { label: "Rollback", variant: "outline", color: "warning", onClick: () => {} },
    ],
    overflowActions: [
      { label: "View logs", value: "logs" },
      { label: "Delete", value: "delete", danger: true },
    ],
  },
  {
    id: "dep-3",
    icon: deployIcon(),
    title: "Feature release",
    subtitle: "2024-05-10 11:05 • v1.1.0",
    depth: 1,
    actions: [
      { label: "Rollback", variant: "outline", color: "warning", onClick: () => {} },
    ],
    overflowActions: [{ label: "View logs", value: "logs" }],
  },
  {
    id: "dep-current",
    title: "Live",
    isCurrent: true,
    depth: 0,
    overflowActions: [{ label: "View logs", value: "logs" }],
  },
];

// ── Demo state ─────────────────────────────────────────────────────────────

const variant = ref<TimelinePanelVariant>("elevated");
const padding = ref<TimelinePanelPadding>("sm");
const loading = ref(false);
const empty = ref(false);
const lastAction = ref("");

const handleRevert = (id: string) => (lastAction.value = `Revert to: ${id}`);
const handleDelete = (id: string) => (lastAction.value = `Delete: ${id}`);
const handleRename = (id: string) =>
  (lastAction.value = `Comment/Rename: ${id}`);

const snapshotItems = computed(() =>
  buildSnapshotItems(handleRevert, handleDelete, handleRename),
);
const deployItems = computed(() => buildDeployItems());

const emptyStateNode = (text: string) =>
  h("div", { class: "py-4 text-center text-sm text-neutral-400" }, text);
</script>

<template>
  <PlaygroundSection
    title="Timeline Panel"
    label="[TimelinePanel]"
    description="Generic timeline/history panel with icons, inline actions, and overflow menus. Designed for snapshots, deployment history, changelogs, and any ordered event list."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Variant
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="[
              { label: 'Elevated', value: 'elevated' },
              { label: 'Outlined', value: 'outlined' },
              { label: 'Subtle', value: 'subtle' },
              { label: 'Simple', value: 'simple' },
            ]"
            :model-value="variant"
            @update:model-value="variant = $event as TimelinePanelVariant"
          />
        </div>
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Padding
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="[
              { label: 'xs', value: 'xs' },
              { label: 'sm', value: 'sm' },
              { label: 'md', value: 'md' },
            ]"
            :model-value="padding"
            @update:model-value="padding = $event as TimelinePanelPadding"
          />
        </div>
        <div class="flex gap-6">
          <Toggle label="Loading" v-model="loading" />
          <Toggle label="Empty" v-model="empty" />
        </div>
        <div
          v-if="lastAction"
          class="rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
        >
          Action: <strong>{{ lastAction }}</strong>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex flex-col gap-6">
        <!-- Snapshot example (matches the mockup) -->
        <TimelinePanel
          title="Snapshots"
          :header-action="{
            label: 'Create Snapshot',
            color: 'danger',
            variant: 'solid',
            onClick: () => (lastAction = 'Create Snapshot clicked'),
          }"
          :items="empty ? [] : snapshotItems"
          :variant="variant"
          :padding="padding"
          :loading="loading"
          :empty-state="emptyStateNode('No snapshots yet')"
        />

        <!-- Deployment history example -->
        <TimelinePanel
          title="Deployment History"
          :items="empty ? [] : deployItems"
          :variant="variant"
          :padding="padding"
          :loading="loading"
          :empty-state="emptyStateNode('No deployments yet')"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>

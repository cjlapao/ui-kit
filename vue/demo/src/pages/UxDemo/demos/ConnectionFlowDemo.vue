<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  ConnectionFlow,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTION_FLOW_ITEM_PROGRESS,
  CONNECTION_FLOW_LOADERS,
  CONNECTION_FLOW_RING_SIZES,
  SURFACE_VARIANTS,
  CONNECTION_FLOW_PROGRESS_TYPES,
  CONNECTION_STATES,
} from "@cjlapao/ui-kit-vue";
import type {
  ConnectionFlowEdgeStyle,
  ConnectionFlowItemProgress,
  ConnectionFlowLoader,
  ConnectionFlowRingSize,
  ConnectionFlowNode,
  ConnectionFlowProgressType,
  ConnectionState,
  ControlSize,
  SurfaceCorner,
  SurfaceVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  panelCornerOptions,
  trueColorOptions,
} from "../constants";

const titleCase = (v: string) =>
  v
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

// Derived from the kit's own runtime lists, so a new renderer or edge style
// shows up here without touching the demo.
const edgeStyleOptions = CONNECTION_FLOW_EDGE_STYLES.map((value) => ({
  label: titleCase(value),
  value,
}));
/** The shared surfaces, plus the frameless option the flow adds. */
const variantOptions = [
  ...SURFACE_VARIANTS.map((value) => ({ label: titleCase(value), value })),
  { label: "Plain", value: "plain" },
];
const itemProgressOptions = CONNECTION_FLOW_ITEM_PROGRESS.map((value) => ({
  label: titleCase(value),
  value,
}));
const loaderOptions = CONNECTION_FLOW_LOADERS.map((value) => ({
  label: titleCase(value),
  value,
}));
const itemCapOptions = [0, 1, 2, 3, 5].map((value) => ({
  label: value === 0 ? "All" : String(value),
  value: String(value),
}));
const ringSizeOptions = CONNECTION_FLOW_RING_SIZES.map((value) => ({
  label: titleCase(value),
  value,
}));
const progressOptions = CONNECTION_FLOW_PROGRESS_TYPES.map((value) => ({
  label: titleCase(value),
  value,
}));
const stateOptions = CONNECTION_STATES.map((value) => ({
  label: titleCase(value),
  value,
}));

/**
 * Deliberately shaped to put every kind of path on screen at once: a one-to-one
 * hop, a fan-out sharing one spine, children hanging below two of the lanes, a
 * fan-in back to one, a bypass over a skipped step and a dashed tail into one
 * that has not been reached. The edge styles are only worth comparing on a
 * graph that has all of them.
 */
const CI_FLOW: ConnectionFlowNode[] = [
  { id: "release", title: "Release Canary version", subtitle: "10s", icon: "Rocket", status: "succeeded", progress: 1 },
  {
    id: "matrix-mac",
    group: "build",
    title: "Matrix: Release Go Binary (macOS)",
    subtitle: "2 jobs completed",
    icon: "Apple",
    status: "succeeded",
    kind: "parallel",
    items: [
      { id: "mac-arm", title: "darwin/arm64", subtitle: "1m 20s", status: "succeeded" },
      { id: "mac-x64", title: "darwin/amd64", subtitle: "1m 44s", status: "succeeded" },
      { id: "mac-uni", title: "darwin/universal", subtitle: "58s", status: "succeeded" },
      { id: "mac-sign", title: "codesign", subtitle: "12s", status: "succeeded" },
      { id: "mac-notary", title: "notarize", subtitle: "queued", status: "pending" },
    ],
  },
  {
    id: "matrix-win",
    group: "build",
    title: "Matrix: Release Go Binary (Windows)",
    subtitle: "6 jobs completed",
    icon: "Windows",
    status: "succeeded",
    kind: "parallel",
    itemProgress: "spinner",
    items: [
      { id: "win-x64", title: "windows/amd64", subtitle: "signing", progress: 0.62, status: "running" },
      { id: "win-arm", title: "windows/arm64", subtitle: "3m 02s", progress: 1, status: "succeeded" },
    ],
  },
  {
    id: "docker",
    group: "build",
    title: "Build Docker Images",
    icon: "Docker",
    status: "running",
    kind: "parallel",
    items: [
      { id: "dk-amd", title: "linux/amd64", subtitle: "pushing", progress: 0.8 },
      { id: "dk-arm", title: "linux/arm64", subtitle: "pushing", progress: 0.35 },
    ],
  },
  // Both of these depend on all three lanes above: consecutive `parallel` nodes
  // form one column, and a column connects to the whole column before it.
  { id: "staging", group: "publish", title: "Deploy to Staging", subtitle: "eu-west-1 · 4s", icon: "Host", status: "running", kind: "parallel", progress: 0.55, connector: { label: "on: main" } },
  {
    id: "announce",
    group: "publish",
    title: "Announce on Discord",
    icon: "Notification",
    status: "succeeded",
    kind: "parallel",
    // Capped rather than measured: the body outgrows the room we want to give
    // it, so it scrolls inside the cap.
    maxHeight: 120,
    maxItems: 0,
    items: [
      { id: "an-1", title: "#releases", subtitle: "posted", status: "succeeded" },
      { id: "an-2", title: "#engineering", subtitle: "posted", status: "succeeded" },
      { id: "an-3", title: "#support", subtitle: "posted", status: "succeeded" },
      { id: "an-4", title: "#changelog", subtitle: "posted", status: "succeeded" },
    ],
  },
  { id: "scan", title: "Security Scan", subtitle: "govulncheck", icon: "Key", status: "skipped" },
  { id: "cleanup", title: "Remove old canary release", subtitle: "waiting", icon: "Trash", status: "pending", connector: { state: "disabled" } },
];

const size = ref<ControlSize>("md");
const tone = ref<TrueColor>("neutral");
const corner = ref<SurfaceCorner>("rounded-md");
const edgeStyle = ref<ConnectionFlowEdgeStyle>("orthogonal");
const ringSize = ref<ConnectionFlowRingSize>("md");
const variant = ref<SurfaceVariant | "plain">("outlined");
const itemProgress = ref<ConnectionFlowItemProgress>("bar");
const maxVisibleItems = ref(2);
const loaderType = ref<ConnectionFlowLoader>("skeleton");
const dotSpeed = ref(120);
const dotInterval = ref(700);
const dotSpeedOptions = [60, 120, 180, 240, 360, 480].map((v) => ({
  label: `${v} px/s`,
  value: String(v),
}));
const dotIntervalOptions = [250, 450, 700, 1200].map((v) => ({
  label: `${v} ms`,
  value: String(v),
}));
const loading = ref(false);
const showHeader = ref(true);
const flowState = ref<ConnectionState>("flowing");
const progressType = ref<ConnectionFlowProgressType>("bar");

const autoState = ref(true);
const animated = ref(true);
const highlightPath = ref(true);
const showControls = ref(true);
const interactive = ref(true);
const onGlass = ref(false);

const selected = ref<string | null>(null);

const stateToggles = [
  { label: "Loading", model: loading },
  { label: "Header", model: showHeader },
  { label: "Auto state", model: autoState },
  { label: "Animated", model: animated },
  { label: "Highlight path", model: highlightPath },
  { label: "Zoom controls", model: showControls },
  { label: "Zoom / pan", model: interactive },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Connection Flow"
    label="[ConnectionFlow]"
    description="A pipeline graph: steps along a track, parallel lanes that fan out and back in, children hanging below their parent, and arcs over the steps that were skipped. Every edge is routed by one port-and-shape engine, so the edge style applies to all of them at once."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Size</span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as ControlSize"
            />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Tone</span>
            <Select :model-value="tone" @update:model-value="tone = $event as TrueColor">
              <option v-for="o in trueColorOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Corner</span>
            <Select :model-value="corner" @update:model-value="corner = $event as SurfaceCorner">
              <option v-for="o in panelCornerOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
            </Select>
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Edge style</span>
            <MultiToggle
              full-width
              size="sm"
              :options="edgeStyleOptions"
              :model-value="edgeStyle"
              @update:model-value="edgeStyle = $event as ConnectionFlowEdgeStyle"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Variant</span>
            <MultiToggle
              full-width
              size="sm"
              :options="variantOptions"
              :model-value="variant"
              @update:model-value="variant = $event as SurfaceVariant | 'plain'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Ring size</span>
            <MultiToggle
              full-width
              size="sm"
              :options="ringSizeOptions"
              :model-value="ringSize"
              @update:model-value="ringSize = $event as ConnectionFlowRingSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Item progress</span>
            <MultiToggle
              full-width
              size="sm"
              :options="itemProgressOptions"
              :model-value="itemProgress"
              @update:model-value="itemProgress = $event as ConnectionFlowItemProgress"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Rows before “show more”</span>
            <MultiToggle
              full-width
              size="sm"
              :options="itemCapOptions"
              :model-value="String(maxVisibleItems)"
              @update:model-value="maxVisibleItems = Number($event)"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Dot speed</span>
            <MultiToggle
              full-width
              size="sm"
              :options="dotSpeedOptions"
              :model-value="String(dotSpeed)"
              @update:model-value="dotSpeed = Number($event)"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Dot interval</span>
            <MultiToggle
              full-width
              size="sm"
              :options="dotIntervalOptions"
              :model-value="String(dotInterval)"
              @update:model-value="dotInterval = Number($event)"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Loader</span>
            <MultiToggle
              full-width
              size="sm"
              :options="loaderOptions"
              :model-value="loaderType"
              @update:model-value="loaderType = $event as ConnectionFlowLoader"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Progress</span>
            <MultiToggle
              full-width
              size="sm"
              :options="progressOptions"
              :model-value="progressType"
              @update:model-value="progressType = $event as ConnectionFlowProgressType"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">Flow state</span>
            <MultiToggle
              full-width
              size="sm"
              :options="stateOptions"
              :model-value="flowState"
              @update:model-value="flowState = $event as ConnectionState"
            />
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Toggle
            v-for="t in stateToggles"
            :key="t.label"
            size="sm"
            :label="t.label"
            v-model="t.model.value"
          />
        </div>

        <p class="text-xs opacity-70">
          Every edge — track, fan, child and bypass alike — is routed by one
          port-and-shape engine, so <strong>edge style</strong> applies to all of
          them at once. Scroll to zoom, drag to pan, and hover a node to light
          the path that reached it.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="p-4">
        <Panel
          :variant="onGlass ? 'liquid-glass' : 'outlined'"
          :tone="onGlass ? tone : 'neutral'"
          padding="md"
        >
          <div class="space-y-5">
            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Current settings
              </span>
              <ConnectionFlow
                :nodes="CI_FLOW"
                :size="size"
                :tone="tone"
                :corner="corner"
                :edge-style="edgeStyle"
                :ring-size="ringSize"
                eyebrow="release_canary.yml"
                title="Release Canary version"
                subtitle="on: workflow_dispatch"
                icon="Rocket"
                tag="LIVE"
                tag-tone="emerald"
                :show-header="showHeader"
                :loading="loading"
                :loader-type="loaderType"
                :variant="variant"
                :item-progress="itemProgress"
                :dot-speed="dotSpeed"
                :dot-interval="dotInterval"
                :max-visible-items="maxVisibleItems"
                :flow-state="flowState"
                :progress-type="progressType"
                :auto-state="autoState"
                :animated="animated"
                :highlight-path="highlightPath"
                :show-controls="showControls"
                :interactive="interactive"
                :height="300"
                @node-click="selected = $event.id"
              />
              <span class="text-xs opacity-60">
                {{ selected ? `Selected: ${selected}` : "Click a node to select it." }}
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Empty
              </span>
              <ConnectionFlow :nodes="[]" variant="plain" :height="160" />
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

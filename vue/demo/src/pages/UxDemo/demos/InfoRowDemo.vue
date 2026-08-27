<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  InfoRow,
  Panel,
  MultiToggle,
  Select,
  Toggle,
  INFO_ROW_VARIANTS,
  CONTROL_SIZES,
} from "@cjlapao/ui-kit-vue";
import type {
  ControlSize,
  InfoRowLoader,
  InfoRowVariant,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  infoRowLoaderOptions,
  infoRowVariantOptions,
  panelCornerOptions,
  trueColorOptions,
} from "../constants";

const LONG =
  "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

const variant = ref<InfoRowVariant>("plain");
const tone = ref<TrueColor>("blue");
const size = ref<ControlSize>("md");
const corner = ref<SurfaceCorner>("rounded-xl");
const loaderType = ref<InfoRowLoader>("skeleton");

const copyable = ref(true);
const mono = ref(false);
const wrap = ref(false);
const hoverable = ref(false);
const noBorder = ref(false);
const loading = ref(false);
const errored = ref(false);
const longValue = ref(false);
const onGlass = ref(false);

const behaviourToggles = [
  { label: "Copyable", model: copyable },
  { label: "Mono", model: mono },
  { label: "Wrap", model: wrap },
  { label: "Hoverable", model: hoverable },
  { label: "No border", model: noBorder },
];

const stateToggles = [
  { label: "Loading", model: loading },
  { label: "Error", model: errored },
  { label: "Long value", model: longValue },
  { label: "On a glass panel", model: onGlass },
];

const lastCopied = ref<string | null>(null);
</script>

<template>
  <PlaygroundSection
    title="Info Row"
    label="[InfoRow]"
    description="One label/value line in a details panel — copy to clipboard, a tooltip when the value is truncated, and loading, empty and error states. A plain row is its own root element, so the hairline's last:border-0 still matches among siblings."
  >
    <template #controls>
      <div class="grid gap-3 md:grid-cols-3">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Variant</span>
          <Select size="sm" :options="infoRowVariantOptions" :model-value="variant"
            @update:model-value="variant = $event as InfoRowVariant" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Tone</span>
          <Select size="sm" :options="trueColorOptions" :model-value="tone"
            @update:model-value="tone = $event as TrueColor" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Size</span>
          <MultiToggle full-width size="sm" :options="controlSizeOptions" :model-value="size"
            @update:model-value="size = $event as ControlSize" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Corner</span>
          <Select size="sm" :options="panelCornerOptions" :model-value="corner"
            @update:model-value="corner = $event as SurfaceCorner" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Loader</span>
          <MultiToggle full-width size="sm" :options="infoRowLoaderOptions" :model-value="loaderType"
            @update:model-value="loaderType = $event as InfoRowLoader" />
        </label>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <Toggle v-for="t in behaviourToggles" :key="t.label" size="sm" :label="t.label"
          v-model="t.model.value" />
      </div>
      <div class="grid gap-2 sm:grid-cols-3">
        <Toggle v-for="t in stateToggles" :key="t.label" size="sm" :label="t.label"
          v-model="t.model.value" />
      </div>
    </template>

    <template #preview>
      <div
        class="space-y-6 rounded-2xl p-4"
        :class="
          onGlass
            ? 'bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 dark:from-sky-900 dark:via-violet-900 dark:to-rose-900'
            : ''
        "
      >
        <div class="flex max-w-xl flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <Panel variant="outlined" padding="sm">
            <InfoRow
              label="Image digest"
              :value="longValue ? LONG : 'sha256:9f86d0'"
              :variant="variant"
              :tone="tone"
              :size="size"
              :corner="corner"
              :copyable="copyable"
              :mono="mono"
              :wrap="wrap"
              :hoverable="hoverable"
              :no-border="noBorder"
              :loading="loading"
              :loader-type="loaderType"
              :error="errored ? 'Registry unreachable' : undefined"
              @copy="lastCopied = $event"
            />
            <InfoRow
              label="Region"
              value="eu-west-1"
              :variant="variant"
              :tone="tone"
              :size="size"
              :corner="corner"
              :copyable="copyable"
              :mono="mono"
              :hoverable="hoverable"
              :no-border="noBorder"
            />
            <InfoRow
              label="Replicas"
              :value="3"
              :variant="variant"
              :tone="tone"
              :size="size"
              :corner="corner"
              :copyable="copyable"
              :hoverable="hoverable"
              :no-border="noBorder"
            />
          </Panel>
          <p v-if="lastCopied" class="text-xs opacity-60">
            Last copied: <code>{{ lastCopied.slice(0, 24) }}</code>
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every variant
          </span>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow
              v-for="v in INFO_ROW_VARIANTS"
              :key="v"
              :variant="v"
              tone="violet"
              :label="v"
              value="eu-west-1"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every size
          </span>
          <div class="grid gap-3 sm:grid-cols-2">
            <Panel v-for="s in CONTROL_SIZES" :key="s" variant="outlined" padding="sm">
              <InfoRow label="Size" :value="s" :size="s" />
              <InfoRow label="Region" value="eu-west-1" :size="s" />
            </Panel>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Loading, empty and error
          </span>
          <div class="grid gap-3 sm:grid-cols-2">
            <Panel variant="outlined" padding="sm">
              <InfoRow label="Digest" loading loader-type="skeleton" />
              <InfoRow label="Region" loading loader-type="spinner" />
              <InfoRow label="Replicas" :value="3" />
            </Panel>
            <Panel variant="outlined" padding="sm">
              <InfoRow label="Digest" error="Registry unreachable" />
              <InfoRow label="Region" value="" :hide-if-empty="false" />
              <InfoRow label="Replicas" :value="3" />
            </Panel>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

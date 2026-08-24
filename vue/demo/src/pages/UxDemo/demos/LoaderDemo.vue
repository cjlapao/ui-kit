<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import {
  Loader,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  GlassBlurIntensity,
  LoaderSize,
  LoaderVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  controlSizeOptions,
  loaderGlassBlurOptions,
  loaderVariantOptions,
  trueColorOptions,
} from "../constants";

const variant = ref<LoaderVariant>("spinner");
const size = ref<LoaderSize>("md");
const color = ref<TrueColor>("blue");
const indeterminate = ref(false);
const showTitle = ref(true);
const showLabel = ref(true);
const overlay = ref(false);
const glass = ref(true);
const glassBlur = ref<GlassBlurIntensity>("medium");
const progress = ref(40);
const running = ref(false);

let timer: number | undefined;
watch(running, (isRunning) => {
  window.clearInterval(timer);
  if (!isRunning) return;
  timer = window.setInterval(() => {
    progress.value = progress.value >= 100 ? 0 : progress.value + 7;
  }, 600);
});
onUnmounted(() => window.clearInterval(timer));

const stateToggles = [
  { label: "Indeterminate", model: indeterminate },
  { label: "Title", model: showTitle },
  { label: "Label", model: showLabel },
  { label: "Animate the value", model: running },
  { label: "Overlay", model: overlay },
  { label: "Glass overlay", model: glass },
];

const shared = computed(() => ({
  variant: variant.value,
  size: size.value,
  color: color.value,
  indeterminate: indeterminate.value,
  progress: progress.value,
  title: showTitle.value ? "Syncing workspace" : undefined,
  label: showLabel.value ? "Uploading files" : undefined,
}));
</script>

<template>
  <PlaygroundSection
    title="Loader"
    label="[Loader]"
    description="A loading state that can be a spinner, a progress bar, or an overlay covering its card. Size comes from the shared control scale and drives the ring, the bar, and the type together; the glass overlay takes its fill from the shared theme."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Variant
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="loaderVariantOptions"
              :model-value="variant"
              @update:model-value="variant = $event as LoaderVariant"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as LoaderSize"
            />
          </label>
        </div>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Tone
          </span>
          <Select
            :model-value="color"
            @update:model-value="color = $event as TrueColor"
          >
            <option
              v-for="option in trueColorOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </Select>
        </label>

        <label
          v-if="variant === 'progress'"
          class="flex flex-col gap-2"
        >
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Progress — {{ Math.round(progress) }}%
          </span>
          <input
            type="range"
            :min="0"
            :max="100"
            v-model.number="progress"
            :disabled="indeterminate"
            class="w-full accent-blue-500 disabled:opacity-50"
          />
        </label>

        <label v-if="overlay" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Glass blur
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="loaderGlassBlurOptions"
            :model-value="glassBlur"
            @update:model-value="glassBlur = $event as GlassBlurIntensity"
          />
        </label>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Toggle
            v-for="toggle in stateToggles"
            :key="toggle.label"
            size="sm"
            :label="toggle.label"
            v-model="toggle.model.value"
          />
        </div>

        <p class="text-xs opacity-70">
          <strong>Indeterminate</strong> sweeps the bar and drops
          <code>aria-valuenow</code> — its absence is what tells a screen
          reader the extent is unknown, not a zero. The overlay covers the
          nearest positioned ancestor, so it is hosted in a card here.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="space-y-6 p-4">
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <div v-if="overlay" class="relative h-56 overflow-hidden">
            <Panel variant="outlined" padding="sm">
              <div class="space-y-2 text-sm opacity-80">
                <p>Quarterly revenue, by region</p>
                <p class="opacity-70">
                  The overlay fills this card — blur and scrim included —
                  while the content behind stays in place.
                </p>
              </div>
            </Panel>
            <Loader
              v-bind="shared"
              overlay
              :glass="glass"
              :glass-blur-intensity="glassBlur"
            />
          </div>
          <Panel v-else variant="outlined" padding="md">
            <Loader v-bind="shared" />
          </Panel>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Size ladder
          </span>
          <div class="flex flex-wrap items-end gap-6">
            <Loader
              v-for="each in CONTROL_SIZES"
              :key="each"
              :size="each"
              :color="color"
              :label="each"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Determinate versus indeterminate
          </span>
          <div class="grid gap-4 md:grid-cols-2">
            <Loader
              variant="progress"
              size="md"
              :color="color"
              :progress="progress"
              label="Known extent"
            />
            <Loader
              variant="progress"
              size="md"
              :color="color"
              indeterminate
              label="Unknown extent"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Overlay — scrim versus glass
          </span>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="relative h-56 overflow-hidden">
              <Panel variant="outlined" padding="sm">
                <div class="space-y-2 text-sm opacity-80">
                  <p>Quarterly revenue, by region</p>
                  <p class="opacity-70">A solid scrim over the content.</p>
                </div>
              </Panel>
              <Loader overlay title="Working…" size="md" :color="color" />
            </div>
            <div class="relative h-56 overflow-hidden">
              <Panel variant="outlined" padding="sm">
                <div class="space-y-2 text-sm opacity-80">
                  <p>Quarterly revenue, by region</p>
                  <p class="opacity-70">A see-through glass fill instead.</p>
                </div>
              </Panel>
              <Loader
                overlay
                title="Working…"
                size="md"
                :color="color"
                glass
                :glass-blur-intensity="glassBlur"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every tone
          </span>
          <div class="grid gap-3 md:grid-cols-2">
            <div
              v-for="each in TRUE_COLORS"
              :key="each"
              class="flex items-center gap-3"
            >
              <Loader size="sm" :color="each" :label="each" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

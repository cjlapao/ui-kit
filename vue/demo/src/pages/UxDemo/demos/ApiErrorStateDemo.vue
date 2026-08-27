<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  ApiErrorState,
  MultiToggle,
  Select,
  Toggle,
  API_ERROR_KINDS,
  EMPTY_STATE_VARIANTS,
} from "@cjlapao/ui-kit-vue";
import type {
  ApiErrorKind,
  ControlSize,
  EmptyStateVariant,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  apiErrorKindOptions,
  controlSizeOptions,
  emptyStateVariantOptions,
  panelCornerOptions,
  trueColorOptions,
} from "../constants";

const kind = ref<ApiErrorKind>("unknown");
const variant = ref<EmptyStateVariant>("outlined");
const size = ref<ControlSize>("md");
const tone = ref<TrueColor | "">("");
const corner = ref<SurfaceCorner>("rounded-xl");

const showRetry = ref(true);
const retrying = ref(false);
const dashed = ref(true);
const showIcon = ref(true);
const iconBackground = ref(true);
const isError = ref(true);
const onGlass = ref(false);

const stateToggles = [
  { label: "Retry button", model: showRetry },
  { label: "Retrying", model: retrying },
  { label: "Dashed rule", model: dashed },
  { label: "Icon", model: showIcon },
  { label: "Icon disc", model: iconBackground },
  { label: "Is error", model: isError },
  { label: "On a glass panel", model: onGlass },
];

const toneOptions = [{ label: "From the kind", value: "" }, ...trueColorOptions];
const noop = () => {};
</script>

<template>
  <PlaygroundSection
    title="API Error State"
    label="[ApiErrorState]"
    description="The failure twin of Empty State. `kind` picks the tone, the glyph and the copy from one table — and whether retrying is even worth offering. Anything you state explicitly still wins."
  >
    <template #controls>
      <div class="grid gap-3 md:grid-cols-3">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Kind</span>
          <MultiToggle
            full-width
            size="sm"
            :options="apiErrorKindOptions"
            :model-value="kind"
            @update:model-value="kind = $event as ApiErrorKind"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Variant</span>
          <Select
            size="sm"
            :options="emptyStateVariantOptions"
            :model-value="variant"
            @update:model-value="variant = $event as EmptyStateVariant"
          />
        </label>
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
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Tone override</span>
          <Select
            size="sm"
            :options="toneOptions"
            :model-value="tone"
            @update:model-value="tone = $event as TrueColor | ''"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Corner</span>
          <Select
            size="sm"
            :options="panelCornerOptions"
            :model-value="corner"
            @update:model-value="corner = $event as SurfaceCorner"
          />
        </label>
      </div>

      <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        <Toggle
          v-for="t in stateToggles"
          :key="t.label"
          size="sm"
          :label="t.label"
          v-model="t.model.value"
        />
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
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <ApiErrorState
            :kind="kind"
            :variant="variant"
            :size="size"
            :tone="tone === '' ? undefined : (tone as TrueColor)"
            :corner="corner"
            :dashed="dashed"
            :show-icon="showIcon"
            :icon-background="iconBackground"
            :is-error="isError"
            :retrying="retrying"
            :on-retry="showRetry ? noop : undefined"
          />
          <span v-if="!isError" class="text-center text-xs opacity-60">
            Nothing rendered — `isError` is false.
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every kind
          </span>
          <div class="grid gap-3 lg:grid-cols-2">
            <ApiErrorState
              v-for="k in API_ERROR_KINDS"
              :key="k"
              :kind="k"
              size="xs"
              :on-retry="k === 'forbidden' || k === 'notFound' ? undefined : noop"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every surface
          </span>
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="v in EMPTY_STATE_VARIANTS" :key="v" class="flex flex-col gap-1">
              <span class="text-[11px] uppercase tracking-wide opacity-50">{{ v }}</span>
              <ApiErrorState
                :variant="v"
                kind="server"
                size="xs"
                subtitle="The server couldn't complete the request."
                :on-retry="noop"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

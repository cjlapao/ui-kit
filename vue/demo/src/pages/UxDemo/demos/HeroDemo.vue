<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Hero,
  MultiToggle,
  Select,
  Toggle,
  HERO_VARIANTS,
  TRUE_COLORS,
  CONTROL_SIZES,
} from "@cjlapao/ui-kit-vue";
import type {
  ControlSize,
  GlowIntensity,
  HeroTitleElement,
  HeroVariant,
  PanelDecoration,
  SurfaceCorner,
  SurfacePadding,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  glowIntensityOptions,
  heroTitleElementOptions,
  heroVariantOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../constants";

const variant = ref<HeroVariant>("gradient");
const tone = ref<TrueColor>("blue");
const titleSize = ref<ControlSize>("sm");
const subtitleSize = ref<ControlSize>("xs");
const padding = ref<SurfacePadding>("sm");
const corner = ref<SurfaceCorner>("rounded-xl");
const decoration = ref<PanelDecoration>("both");
const glowIntensity = ref<GlowIntensity>("soft");
const titleAs = ref<HeroTitleElement>("p");

const withIcon = ref(true);
const withSubtitle = ref(true);
const onGlass = ref(false);

const contentToggles = [
  { label: "Icon", model: withIcon },
  { label: "Subtitle", model: withSubtitle },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Hero"
    label="[Hero]"
    description="A banner on a saturated tone gradient or on any Panel surface. The gradient runs between the tone's own 700 and 800 shades, which is what keeps its white copy above the kit's measured contrast floor."
  >
    <template #controls>
      <div class="grid gap-3 md:grid-cols-3">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Variant</span>
          <Select size="sm" :options="heroVariantOptions" :model-value="variant"
            @update:model-value="variant = $event as HeroVariant" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Tone</span>
          <Select size="sm" :options="trueColorOptions" :model-value="tone"
            @update:model-value="tone = $event as TrueColor" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Title size</span>
          <MultiToggle full-width size="sm" :options="controlSizeOptions" :model-value="titleSize"
            @update:model-value="titleSize = $event as ControlSize" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Subtitle size</span>
          <MultiToggle full-width size="sm" :options="controlSizeOptions" :model-value="subtitleSize"
            @update:model-value="subtitleSize = $event as ControlSize" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Padding</span>
          <Select size="sm" :options="panelPaddingOptions" :model-value="padding"
            @update:model-value="padding = $event as SurfacePadding" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Corner</span>
          <Select size="sm" :options="panelCornerOptions" :model-value="corner"
            @update:model-value="corner = $event as SurfaceCorner" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Decoration</span>
          <Select size="sm" :options="panelDecorationOptions" :model-value="decoration"
            @update:model-value="decoration = $event as PanelDecoration" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Glow</span>
          <MultiToggle full-width size="sm" :options="glowIntensityOptions" :model-value="glowIntensity"
            @update:model-value="glowIntensity = $event as GlowIntensity" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Title element</span>
          <Select size="sm" :options="heroTitleElementOptions" :model-value="titleAs"
            @update:model-value="titleAs = $event as HeroTitleElement" />
        </label>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <Toggle v-for="t in contentToggles" :key="t.label" size="sm" :label="t.label"
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
        <div class="flex max-w-2xl flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <Hero
            :variant="variant"
            :tone="tone"
            :title-size="titleSize"
            :subtitle-size="subtitleSize"
            :padding="padding"
            :corner="corner"
            :decoration="decoration"
            :glow-intensity="glowIntensity"
            :title-as="titleAs"
            :icon="withIcon ? 'Rocket' : undefined"
            title="Release Canary version"
            :subtitle="withSubtitle ? 'on: workflow_dispatch' : undefined"
          />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every variant
          </span>
          <div class="grid gap-3 sm:grid-cols-2">
            <Hero v-for="v in HERO_VARIANTS" :key="v" :variant="v" tone="violet"
              :title="v" subtitle="Icon, heading, supporting line" icon="Rocket" padding="md" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every tone — each stays in its own
          </span>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Hero v-for="t in TRUE_COLORS" :key="t" :tone="t" :title="t"
              subtitle="White on -700" icon="Rocket" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every size
          </span>
          <div class="flex flex-col gap-3">
            <Hero v-for="s in CONTROL_SIZES" :key="s" tone="emerald" :title-size="s"
              :subtitle-size="s" :padding="s" :title="`titleSize=${s}`"
              subtitle="The chip scales with the type." icon="Rocket" />
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

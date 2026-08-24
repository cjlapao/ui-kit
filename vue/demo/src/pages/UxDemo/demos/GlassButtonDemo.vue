<script setup lang="ts">
import { computed, ref } from "vue";
import { Button, IconButton, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import type {
  ButtonColor,
  ButtonSize,
  GlassOpacity,
  GlassVibrancy,
  MultiToggleOption,
  SpecularMode,
} from "@cjlapao/ui-kit-vue";

// Real TrueColor tokens. The old list included "brand", which no longer exists
// since the TrueColor refactor — getGlassFillClass silently fell back to
// "neutral", so picking it appeared to do nothing.
const glassColorOptions: MultiToggleOption[] = [
  { label: "Blue", value: "blue" },
  { label: "Indigo", value: "indigo" },
  { label: "Emerald", value: "emerald" },
  { label: "Rose", value: "rose" },
  { label: "Amber", value: "amber" },
  { label: "Neutral", value: "neutral" },
];

const specularOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

const opacityOptions: MultiToggleOption[] = [
  { label: "Clear", value: "clear" },
  { label: "Frosted", value: "frosted" },
  { label: "Light", value: "light" },
];

const vibrancyOptions: MultiToggleOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const sizeOptions: MultiToggleOption[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const SPECULAR_MODES: SpecularMode[] = ["none", "classic", "halo"];
const OPACITY_PRESETS: GlassOpacity[] = ["clear", "frosted", "light"];

const glassColor = ref<ButtonColor>("blue");
const glassVibrancy = ref<GlassVibrancy>("medium");
const glassOpacity = ref<GlassOpacity>("frosted");
const glassSpecular = ref<SpecularMode>("classic");
const glassSize = ref<ButtonSize>("md");
const showIconButton = ref(true);
const disabled = ref(false);
const loading = ref(false);

const summary = computed(
  () =>
    `${glassColor.value} · ${glassOpacity.value} · specular ${glassSpecular.value} · vibrancy ${glassVibrancy.value}`,
);
</script>

<template>
  <PlaygroundSection
    title="Glass Buttons"
    label="[Button variant=glass]"
    description="Glass Button and IconButton — fill opacity, backdrop vibrancy and specular highlight. Turn on the background image to judge them over a real backdrop."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="space-y-2">
          <span
            class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
          >
            Color
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="glassColorOptions"
            :model-value="glassColor"
            @update:model-value="glassColor = $event as ButtonColor"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Fill opacity
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="opacityOptions"
              :model-value="String(glassOpacity)"
              @update:model-value="glassOpacity = $event as GlassOpacity"
            />
          </div>
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Specular
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="specularOptions"
              :model-value="glassSpecular"
              @update:model-value="glassSpecular = $event as SpecularMode"
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span
              class="text-sm font-semibold text-neutral-600 dark:text-neutral-200"
            >
              Vibrancy
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="vibrancyOptions"
              :model-value="String(glassVibrancy)"
              @update:model-value="glassVibrancy = $event as GlassVibrancy"
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
              size="sm"
              :options="sizeOptions"
              :model-value="glassSize"
              @update:model-value="glassSize = $event as ButtonSize"
            />
          </div>
        </div>
        <div class="grid gap-2 text-sm md:grid-cols-3">
          <label class="flex items-center justify-between gap-2">
            <span>Icon button</span>
            <Toggle size="sm" v-model="showIconButton" />
          </label>
          <label class="flex items-center justify-between gap-2">
            <span>Disabled</span>
            <Toggle size="sm" v-model="disabled" />
          </label>
          <label class="flex items-center justify-between gap-2">
            <span>Loading</span>
            <Toggle size="sm" v-model="loading" />
          </label>
        </div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Glass labels use the tone's darkest shade in light mode. Over a dark
          or busy backdrop, raise the fill to
          <code>glassOpacity="light"</code> to keep them legible.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="space-y-6">
        <!-- Live control -->
        <div class="space-y-2">
          <span
            class="inline-block rounded bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200"
          >
            {{ summary }}
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              :color="glassColor"
              :vibrancy="glassVibrancy"
              :glass-opacity="glassOpacity"
              :specular-mode="glassSpecular"
              :size="glassSize"
              :disabled="disabled"
              :loading="loading"
            >
              Glass Button
            </Button>
            <IconButton
              v-if="showIconButton"
              icon="Search"
              variant="glass"
              :color="glassColor"
              :vibrancy="glassVibrancy"
              :glass-opacity="glassOpacity"
              :specular-mode="glassSpecular"
              :size="glassSize"
              :disabled="disabled"
            />
          </div>
        </div>

        <!-- Specular comparison: the point of the mode is the difference -->
        <div class="space-y-2">
          <span
            class="inline-block rounded bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200"
          >
            Specular modes
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <div
              v-for="mode in SPECULAR_MODES"
              :key="mode"
              class="flex flex-col items-center gap-1"
            >
              <Button
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="glassOpacity"
                :specular-mode="mode"
                size="lg"
              >
                {{ mode }}
              </Button>
              <span
                class="rounded bg-white/75 px-1.5 text-[10px] text-neutral-600 dark:bg-black/45 dark:text-neutral-200"
              >
                {{ mode }}
              </span>
            </div>
          </div>
        </div>

        <!-- Opacity comparison -->
        <div class="space-y-2">
          <span
            class="inline-block rounded bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200"
          >
            Fill opacity
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <div
              v-for="preset in OPACITY_PRESETS"
              :key="String(preset)"
              class="flex flex-col items-center gap-1"
            >
              <Button
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="preset"
                :specular-mode="glassSpecular"
                size="lg"
              >
                {{ preset }}
              </Button>
              <span
                class="rounded bg-white/75 px-1.5 text-[10px] text-neutral-600 dark:bg-black/45 dark:text-neutral-200"
              >
                {{ preset }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Button,
  GlassBackground,
  Panel,
  Toggle,
  Badge,
  type ThemeColor,
  type GradientDirection,
  type GlassBackgroundPosition,
} from "@cjlapao/ui-kit-vue";

// ---------------------------------------------------------------------------
// Color options
// ---------------------------------------------------------------------------

const colorOptions: { label: string; value: ThemeColor }[] = [
  { label: "Purple", value: "purple" },
  { label: "Blue", value: "blue" },
  { label: "Indigo", value: "indigo" },
  { label: "Violet", value: "violet" },
  { label: "Rose", value: "rose" },
  { label: "Pink", value: "pink" },
  { label: "Emerald", value: "emerald" },
  { label: "Teal", value: "teal" },
  { label: "Amber", value: "amber" },
  { label: "Orange", value: "orange" },
  { label: "Cyan", value: "cyan" },
  { label: "Sky", value: "sky" },
  { label: "Lime", value: "lime" },
  { label: "Red", value: "red" },
  { label: "Slate", value: "slate" },
  { label: "Zinc", value: "zinc" },
  { label: "Stone", value: "stone" },
  { label: "Gray", value: "gray" },
  { label: "Neutral", value: "neutral" },
];

const directionOptions: { label: string; value: GradientDirection }[] = [
  { label: "Top", value: "t" },
  { label: "Top-Right", value: "tr" },
  { label: "Right", value: "r" },
  { label: "Bottom-Right", value: "br" },
  { label: "Bottom", value: "b" },
  { label: "Bottom-Left", value: "bl" },
  { label: "Left", value: "l" },
  { label: "Top-Left", value: "tl" },
];

const positionOptions: { label: string; value: GlassBackgroundPosition }[] = [
  { label: "Fixed", value: "fixed" },
  { label: "Absolute", value: "absolute" },
];

// ---------------------------------------------------------------------------
// Sign-in form controls
// ---------------------------------------------------------------------------

const formColor = ref<ThemeColor>("purple");
const formColorSecondary = ref<ThemeColor>("blue");
const formColorDeep = ref<ThemeColor>("indigo");
const formDirection = ref<GradientDirection>("br");
const formPosition = ref<GlassBackgroundPosition>("absolute");
const formShimmer = ref(false);
const formAmbient = ref(true);

// ---------------------------------------------------------------------------
// Color presets controls
// ---------------------------------------------------------------------------

const presetColor = ref<ThemeColor>("blue");
const presetSecondary = ref<ThemeColor>("indigo");
const presetDirection = ref<GradientDirection>("br");

// ---------------------------------------------------------------------------
// Direction grid controls
// ---------------------------------------------------------------------------

const gridColor = ref<ThemeColor>("rose");
const gridSecondary = ref<ThemeColor>("purple");

// ---------------------------------------------------------------------------
// Shimmer comparison controls
// ---------------------------------------------------------------------------

const shimmerLeft = ref(false);
const shimmerRight = ref(true);
const shimmerColor = ref<ThemeColor>("purple");
</script>

<template>
  <div class="space-y-8">
    <!-- ───────── Sign-in form ───────── -->
    <PlaygroundSection
      title="Sign-in form"
      label="[GlassBackground]"
      description="Interactive preview matching the Liquid Glass reference screenshot."
    >
      <template #controls>
        <div class="space-y-4 text-sm">
          <div class="grid gap-3 md:grid-cols-3">
            <label class="flex flex-col gap-2">
              <span>Primary color</span>
              <select
                :value="formColor"
                @change="
                  (e) => (formColor = (e.target as HTMLSelectElement).value as ThemeColor)
                "
                class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option
                  v-for="c in colorOptions"
                  :key="c.value"
                  :value="c.value"
                >
                  {{ c.label }}
                </option>
              </select>
            </label>
            <label class="flex flex-col gap-2">
              <span>Secondary color</span>
              <select
                :value="formColorSecondary"
                @change="
                  (e) =>
                    (formColorSecondary = (e.target as HTMLSelectElement)
                      .value as ThemeColor)
                "
                class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option
                  v-for="c in colorOptions"
                  :key="c.value"
                  :value="c.value"
                >
                  {{ c.label }}
                </option>
              </select>
            </label>
            <label class="flex flex-col gap-2">
              <span>Deep color</span>
              <select
                :value="formColorDeep"
                @change="
                  (e) =>
                    (formColorDeep = (e.target as HTMLSelectElement)
                      .value as ThemeColor)
                "
                class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option
                  v-for="c in colorOptions"
                  :key="c.value"
                  :value="c.value"
                >
                  {{ c.label }}
                </option>
              </select>
            </label>
          </div>
          <div class="grid gap-3 md:grid-cols-3">
            <label class="flex flex-col gap-2">
              <span>Direction</span>
              <select
                :value="formDirection"
                @change="
                  (e) =>
                    (formDirection = (e.target as HTMLSelectElement)
                      .value as GradientDirection)
                "
                class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option
                  v-for="d in directionOptions"
                  :key="d.value"
                  :value="d.value"
                >
                  {{ d.label }}
                </option>
              </select>
            </label>
            <label class="flex flex-col gap-2">
              <span>Position</span>
              <select
                :value="formPosition"
                @change="
                  (e) =>
                    (formPosition = (e.target as HTMLSelectElement)
                      .value as GlassBackgroundPosition)
                "
                class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option
                  v-for="p in positionOptions"
                  :key="p.value"
                  :value="p.value"
                >
                  {{ p.label }}
                </option>
              </select>
            </label>
          </div>
          <div class="grid gap-2 md:grid-cols-3">
            <label class="flex items-center justify-between">
              <span>Shimmer</span>
              <Toggle
                size="sm"
                :model-value="formShimmer"
                @update:model-value="(v) => (formShimmer = !!v)"
              />
            </label>
            <label class="flex items-center justify-between">
              <span>Ambient</span>
              <Toggle
                size="sm"
                :model-value="formAmbient"
                @update:model-value="(v) => (formAmbient = !!v)"
              />
            </label>
          </div>
        </div>
      </template>
      <template #preview>
        <div class="relative h-96 w-full overflow-hidden rounded-xl">
          <GlassBackground
            :position="formPosition"
            :color="formColor"
            :color-secondary="formColorSecondary"
            :color-deep="formColorDeep"
            :direction="formDirection"
            :shimmer="formShimmer"
            :ambient="formAmbient"
          >
            <div
              class="flex h-full min-h-0 flex-1 items-center justify-center p-4"
            >
              <div class="w-full max-w-sm space-y-5">
                <GlassPanel
                  title="Sign in"
                  variant="liquid-glass"
                  corner="rounded-lg"
                  glass-opacity="frosted"
                  vibrancy="high"
                >
                  <div class="space-y-3">
                    <input
                      class="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      placeholder="Email"
                    />
                    <input
                      class="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      placeholder="Password"
                      type="password"
                    />
                    <div
                      class="flex items-center justify-between py-1"
                    >
                      <span
                        class="text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        Remember me
                      </span>
                      <Toggle
                        glass
                        :model-value="true"
                        @update:model-value="() => {}"
                        color="blue"
                        size="sm"
                      />
                    </div>
                    <Button
                      color="blue"
                      variant="glass"
                    >
                      Continue
                    </Button>
                    <Button
                    color="slate"
                    variant="ghost"
                    >
                      Skip for now
                    </Button>
                  </div>
                </GlassPanel>

                <Panel variant="glass" corner="rounded-lg" tone="neutral" padding="sm">
                  <div class="flex items-start gap-3">
                    <Badge dot tone="blue" />
                    <div>
                      <p
                        class="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                      >
                        Theme note
                      </p>
                      <p
                        class="text-sm text-neutral-600 dark:text-neutral-400"
                      >
                        Everything in this app is built from the same glass
                        surface treatment for consistency.
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </GlassBackground>
        </div>
      </template>
    </PlaygroundSection>

    <!-- ───────── Color presets ───────── -->
    <PlaygroundSection
      title="Color presets"
      label="[GlassBackground]"
      description="Explore different color combinations with a shared glass panel."
    >
    </PlaygroundSection>
  </div>
</template>
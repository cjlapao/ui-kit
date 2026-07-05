<script setup lang="ts">
import { ref, computed } from "vue";
import { Button, IconButton, useTheme } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import type {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "@cjlapao/ui-kit-vue";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

const COLORS = ["blue", "brand", "red", "green", "purple"] as const;
const SPECULAR_MODES: SpecularMode[] = ["classic", "halo", "none"];
const OPACITY_PRESETS: GlassOpacity[] = ["frosted", "light", "clear"];
const VIBRANCY_LEVELS: GlassVibrancy[] = ["low", "medium", "high"];

type GlassColor = "blue" | "brand" | "red" | "green" | "purple";

const glassColor = ref<GlassColor>("blue");
const glassVibrancy = ref<GlassVibrancy>("medium");
const glassOpacity = ref<GlassOpacity>("frosted");
const glassSpecular = ref<SpecularMode>("none");
const glassSize = ref<"xs" | "sm" | "md" | "lg" | "xl">("md");
const showBg = ref(false);
const { effectiveTheme } = useTheme();

const bgStyle = computed(() => ({
  backgroundImage: `url(${
    effectiveTheme.value === "dark" ? backdropDark : backdropLight
  })`,
}));

const opacityLabel = (o: GlassOpacity): string =>
  typeof o === "number" ? `${Math.round(o * 100)}%` : o;

const specularLabel = (m: SpecularMode): string =>
  m === "none" ? "No specular" : `Specular: ${m}`;
</script>

<template>
  <PlaygroundSection
    title="Glass Buttons"
    label="[Glass]"
    description="Showcase of glass Button and IconButton variants with color, vibrancy, opacity, specular, and size combinations."
  >
    <template #controls>
      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Color
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="c in COLORS"
                :key="c"
                type="button"
                class="rounded-md px-3 py-1 text-xs font-medium transition capitalize"
                :class="
                  glassColor === c
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                "
                @click="glassColor = c"
              >
                {{ c }}
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Vibrancy
            </span>
            <div class="flex gap-2">
              <button
                v-for="v in VIBRANCY_LEVELS"
                :key="v"
                type="button"
                class="rounded-md px-3 py-1 text-xs font-medium transition"
                :class="
                  glassVibrancy === v
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                "
                @click="glassVibrancy = v"
              >
                {{ v }}
              </button>
            </div>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Opacity Preset
            </span>
            <div class="flex gap-2">
              <button
                v-for="o in OPACITY_PRESETS"
                :key="o"
                type="button"
                class="rounded-md px-3 py-1 text-xs font-medium transition"
                :class="
                  glassOpacity === o
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                "
                @click="glassOpacity = o"
              >
                {{ o }}
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Specular Mode
            </span>
            <div class="flex gap-2">
              <button
                v-for="m in SPECULAR_MODES"
                :key="m"
                type="button"
                class="rounded-md px-3 py-1 text-xs font-medium transition capitalize"
                :class="
                  glassSpecular === m
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                "
                @click="glassSpecular = m"
              >
                {{ m }}
              </button>
            </div>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Size
            </span>
            <div class="flex gap-2">
              <button
                v-for="s in ['xs', 'sm', 'md', 'lg', 'xl']"
                :key="s"
                type="button"
                class="rounded-md px-3 py-1 text-xs font-medium transition"
                :class="
                  glassSize === s
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                "
                @click="glassSize = s as 'xs' | 'sm' | 'md' | 'lg' | 'xl'"
              >
                {{ s.toUpperCase() }}
              </button>
            </div>
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2">
              <Toggle size="sm" v-model="showBg" />
              <span class="text-xs font-medium text-neutral-600 dark:text-neutral-200">
                Background image
              </span>
            </label>
          </div>
        </div>
      </div>
    </template>
    <template #preview>
      <div
        v-if="showBg"
        class="relative min-h-[200px] overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat"
        :style="bgStyle"
      >
        <div
          class="flex min-h-[48px] flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/50"
        >
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
            {{ `${glassColor} · ${opacityLabel(glassOpacity)} · ${specularLabel(glassSpecular)} · ${glassVibrancy}` }}
          </span>
          <div class="flex min-h-[48px] items-center justify-center gap-3">
            <Button
              variant="glass"
              :color="glassColor"
              :vibrancy="glassVibrancy"
              :glass-opacity="glassOpacity"
              :specular-mode="glassSpecular"
              :size="glassSize"
            >
              Glass Button
            </Button>
            <IconButton
              icon="Search"
              variant="glass"
              :color="glassColor"
              :vibrancy="glassVibrancy"
              :glass-opacity="glassOpacity"
              :specular-mode="glassSpecular"
              :size="glassSize"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex min-h-[48px] flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/50"
      >
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
          {{ `${glassColor} · ${opacityLabel(glassOpacity)} · ${specularLabel(glassSpecular)} · ${glassVibrancy}` }}
        </span>
        <div class="flex min-h-[48px] items-center justify-center gap-3">
          <Button
            variant="glass"
            :color="glassColor"
            :vibrancy="glassVibrancy"
            :glass-opacity="glassOpacity"
            :specular-mode="glassSpecular"
            :size="glassSize"
          >
            Glass Button
          </Button>
          <IconButton
            icon="Search"
            variant="glass"
            :color="glassColor"
            :vibrancy="glassVibrancy"
            :glass-opacity="glassOpacity"
            :specular-mode="glassSpecular"
            :size="glassSize"
          />
        </div>
      </div>
    </template>
  </PlaygroundSection>
    <!-- States Section -->
    <div
      class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/50"
    >
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
        States
      </span>
      <div class="flex w-full flex-col gap-4">
        <!-- Button States -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
            Button
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-col items-center gap-1">
              <Button
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="glassOpacity"
                :specular-mode="glassSpecular"
                size="sm"
              >
                Default
              </Button>
              <span class="text-[10px] text-slate-400">Default</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="scale-[1.02] brightness-105">
                <Button
                  variant="glass"
                  :color="glassColor"
                  :vibrancy="glassVibrancy"
                  :glass-opacity="glassOpacity"
                  :specular-mode="glassSpecular"
                  size="sm"
                >
                  Hover
                </Button>
              </div>
              <span class="text-[10px] text-slate-400">Hover</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="scale-[0.98] brightness-90">
                <Button
                  variant="glass"
                  :color="glassColor"
                  :vibrancy="glassVibrancy"
                  :glass-opacity="glassOpacity"
                  :specular-mode="glassSpecular"
                  size="sm"
                >
                  Active
                </Button>
              </div>
              <span class="text-[10px] text-slate-400">Active</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Button
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="glassOpacity"
                :specular-mode="glassSpecular"
                size="sm"
                disabled
              >
                Disabled
              </Button>
              <span class="text-[10px] text-slate-400">Disabled</span>
            </div>
          </div>
        </div>
        <!-- IconButton States -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
            IconButton
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-col items-center gap-1">
              <IconButton
                icon="Search"
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="glassOpacity"
                :specular-mode="glassSpecular"
                size="sm"
              />
              <span class="text-[10px] text-slate-400">Default</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="scale-[1.02] brightness-105">
                <IconButton
                  icon="Search"
                  variant="glass"
                  :color="glassColor"
                  :vibrancy="glassVibrancy"
                  :glass-opacity="glassOpacity"
                  :specular-mode="glassSpecular"
                  size="sm"
                />
              </div>
              <span class="text-[10px] text-slate-400">Hover</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="scale-[0.98] brightness-90">
                <IconButton
                  icon="Search"
                  variant="glass"
                  :color="glassColor"
                  :vibrancy="glassVibrancy"
                  :glass-opacity="glassOpacity"
                  :specular-mode="glassSpecular"
                  size="sm"
                />
              </div>
              <span class="text-[10px] text-slate-400">Active</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <IconButton
                icon="Search"
                variant="glass"
                :color="glassColor"
                :vibrancy="glassVibrancy"
                :glass-opacity="glassOpacity"
                :specular-mode="glassSpecular"
                size="sm"
                disabled
              />
              <span class="text-[10px] text-slate-400">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
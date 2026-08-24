<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Button,
  EmptyState,
  Input,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
} from "@cjlapao/ui-kit-vue";
import type {
  ButtonColor,
  ButtonVariant,
  ControlSize,
  EmptyStateSize,
  EmptyStateVariant,
  GlassOpacity,
  GlassVibrancy,
  IconName,
  SpecularMode,
  SurfaceCorner,
  SurfacePadding,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  buttonVariantAllOptions,
  controlSizeOptions,
  emptyStateVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  pillSpecularOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: EmptyStateVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const iconOptions: { label: string; value: IconName }[] = [
  { label: "Add", value: "Add" },
  { label: "Search", value: "Search" },
  { label: "Container", value: "Container" },
  { label: "CloudOff", value: "CloudOff" },
  { label: "Info", value: "Info" },
];

const variant = ref<EmptyStateVariant>("outlined");
const tone = ref<TrueColor>("neutral");
const corner = ref<SurfaceCorner>("rounded-md");
const padding = ref<SurfacePadding>("lg");
const size = ref<EmptyStateSize>("md");

const title = ref("All caught up");
const subtitle = ref(
  "Connect your first workspace or import data to see activity here.",
);
const icon = ref<IconName>("Add");

const dashed = ref(true);
const showIcon = ref(true);
const iconBackground = ref(true);
const showSubtitle = ref(true);
const showAction = ref(true);
const fullWidth = ref(true);
const onGlass = ref(false);

const actionLabel = ref("Create workspace");
const actionVariant = ref<ButtonVariant>("soft");
const actionColor = ref<ButtonColor>("blue");
const actionSize = ref<ControlSize | "auto">("auto");
const actionIcon = ref(false);

const glassOpacity = ref<GlassOpacity>("frosted");
const vibrancy = ref<GlassVibrancy>("medium");
const specularMode = ref<SpecularMode>("classic");

const isGlass = computed(() => GLASS_VARIANTS.includes(variant.value));
const isPlain = computed(() => variant.value === "plain");

const resolvedActionSize = computed(() =>
  actionSize.value === "auto" ? undefined : actionSize.value,
);

const actionSizeOptions = computed(() => [
  { label: "Auto", value: "auto" },
  ...controlSizeOptions,
]);

const stateToggles = [
  { label: "Dashed rule", model: dashed },
  { label: "Icon", model: showIcon },
  { label: "Icon disc", model: iconBackground },
  { label: "Subtitle", model: showSubtitle },
  { label: "Action", model: showAction },
  { label: "Action icon", model: actionIcon },
  { label: "Full width", model: fullWidth },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Empty States"
    label="[EmptyState]"
    description="The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus a dashed rule for a slot waiting to be filled."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Variant
            </span>
            <Select
              :model-value="variant"
              @update:model-value="variant = $event as EmptyStateVariant"
            >
              <option
                v-for="option in emptyStateVariantOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Tone
            </span>
            <Select
              :model-value="tone"
              @update:model-value="tone = $event as TrueColor"
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
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Corner
            </span>
            <Select
              :model-value="corner"
              :disabled="isPlain"
              @update:model-value="corner = $event as SurfaceCorner"
            >
              <option
                v-for="option in panelCornerOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Padding
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="panelPaddingOptions"
              :model-value="padding"
              @update:model-value="padding = $event as SurfacePadding"
            />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as EmptyStateSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Icon
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="iconOptions"
              :model-value="icon"
              @update:model-value="icon = $event as IconName"
            />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Title
            </span>
            <Input v-model="title" />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Subtitle
            </span>
            <Textarea :rows="3" v-model="subtitle" />
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <Toggle
            v-for="toggle in stateToggles"
            :key="toggle.label"
            size="sm"
            :label="toggle.label"
            v-model="toggle.model.value"
          />
        </div>

        <div
          class="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10"
        >
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Action label
            </span>
            <Input v-model="actionLabel" />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Action variant
            </span>
            <Select
              :model-value="actionVariant"
              @update:model-value="actionVariant = $event as ButtonVariant"
            >
              <option
                v-for="option in buttonVariantAllOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Action size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="actionSizeOptions"
              :model-value="actionSize"
              @update:model-value="actionSize = $event as ControlSize | 'auto'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Action colour
            </span>
            <Select
              :model-value="actionColor"
              @update:model-value="actionColor = $event as ButtonColor"
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
        </div>

        <div
          v-if="isGlass"
          class="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10"
        >
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Specular
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="pillSpecularOptions"
              :model-value="specularMode"
              @update:model-value="specularMode = $event as SpecularMode"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Vibrancy
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="glassVibrancyOptions"
              :model-value="vibrancy as string"
              @update:model-value="vibrancy = $event as GlassVibrancy"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Glass opacity
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="glassOpacityOptions"
              :model-value="glassOpacity as string"
              @update:model-value="glassOpacity = $event as GlassOpacity"
            />
          </label>
        </div>

        <p class="text-xs opacity-70">
          <strong>Plain</strong> draws no card at all — for an empty state
          dropped inside a panel the app already owns. The
          <strong>dashed rule</strong> is an <code>outline</code>, not a border,
          so it sits on top of any variant without having to be reconciled
          against the card's own edge. The action button defaults to the empty
          state's tone and to a size derived from <strong>size</strong>.
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
          <div class="space-y-6">
            <EmptyState
              :variant="variant"
              :tone="tone"
              :corner="corner"
              :padding="padding"
              :size="size"
              :dashed="dashed"
              :icon="icon"
              :show-icon="showIcon"
              :icon-background="iconBackground"
              :title="title || undefined"
              :subtitle="showSubtitle ? subtitle || undefined : undefined"
              :full-width="fullWidth"
              :class="fullWidth ? undefined : 'mx-auto max-w-md'"
              :action-label="
                showAction ? actionLabel || 'Create item' : undefined
              "
              :action-variant="actionVariant"
              :action-color="actionColor"
              :action-size="resolvedActionSize"
              :action-leading-icon="actionIcon ? 'Add' : undefined"
              :glass-opacity="glassOpacity"
              :vibrancy="vibrancy"
              :specular-mode="specularMode"
            />

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Size ladder
              </span>
              <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <EmptyState
                  v-for="option in controlSizeOptions"
                  :key="option.value"
                  :variant="variant"
                  :tone="tone"
                  :corner="corner"
                  :padding="padding"
                  :size="option.value as EmptyStateSize"
                  :dashed="dashed"
                  :icon="icon"
                  :title="`Size ${option.label}`"
                  subtitle="Icon, type and the action button move together."
                  action-label="Create"
                  full-width
                  :glass-opacity="glassOpacity"
                  :vibrancy="vibrancy"
                  :specular-mode="specularMode"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Custom footer instead of the generated button
              </span>
              <EmptyState
                :variant="variant"
                :tone="tone"
                :corner="corner"
                :padding="padding"
                :size="size"
                :dashed="dashed"
                icon="Search"
                title="No results for “orchestrator”"
                subtitle="Try a broader term, or clear the filters you have applied."
                full-width
                :glass-opacity="glassOpacity"
                :vibrancy="vibrancy"
                :specular-mode="specularMode"
              >
                <template #actions>
                  <Button size="sm" variant="soft" :color="tone">
                    Clear filters
                  </Button>
                  <Button size="sm" variant="ghost" color="slate">
                    Browse all
                  </Button>
                </template>
              </EmptyState>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

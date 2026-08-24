<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Alert,
  Button,
  Input,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
  ALERT_INTENTS,
  ALERT_INTENT_CONFIG,
} from "@cjlapao/ui-kit-vue";
import type {
  AlertIconAlign,
  AlertIntent,
  AlertSize,
  AlertVariant,
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  alertIconAlignOptions,
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  pillSpecularOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

const intent = ref<AlertIntent>("danger");
const variant = ref<AlertVariant>("subtle");
const size = ref<AlertSize>("md");
const corner = ref<SurfaceCorner>("rounded-md");
const overrideTone = ref(false);
const color = ref<TrueColor>("violet");

const title = ref("Deployment paused");
const description = ref(
  "We paused the rollout while we investigate a spike in error rates.",
);
const showIcon = ref(true);
const iconSize = ref<ControlSize | "auto">("auto");
const iconAlign = ref<AlertIconAlign>("top");
const longBody = ref(false);
const dismissible = ref(true);
const showActions = ref(true);
const onGlass = ref(false);

const glassOpacity = ref<GlassOpacity>("frosted");
const vibrancy = ref<GlassVibrancy>("medium");
const specularMode = ref<SpecularMode>("classic");

/** Bumped to remount the dismissible alert after it hides itself. */
const dismissKey = ref(0);

const isGlass = computed(() => GLASS_VARIANTS.includes(variant.value));

const effectiveColor = computed(() =>
  overrideTone.value ? color.value : undefined,
);

/** Padding for the alignment demo — a short callout cannot show the difference. */
const LONG_BODY =
  "Rollout is held at 12% of traffic. The error budget for this window is " +
  "spent, so the next attempt needs either a fix or an explicit override from " +
  "someone on the release rota. Nothing is being served from the new build.";

const resolvedIconSize = computed(() =>
  iconSize.value === "auto" ? undefined : iconSize.value,
);

const previewDescription = computed(() =>
  longBody.value
    ? `${description.value} ${LONG_BODY}`
    : description.value || undefined,
);

const iconSizeOptions = computed(() => [
  { label: "Auto", value: "auto" },
  ...controlSizeOptions,
]);

const stateToggles = [
  { label: "Icon", model: showIcon },
  { label: "Dismissible", model: dismissible },
  { label: "Long body", model: longBody },
  { label: "Actions", model: showActions },
  { label: "On a glass panel", model: onGlass },
];

const handleDismiss = () => {
  window.setTimeout(() => {
    dismissKey.value += 1;
  }, 900);
};
</script>

<template>
  <PlaygroundSection
    title="Alerts"
    label="[Alert]"
    description="Contextual callouts. An intent picks the tone, the icon and how a screen reader announces it; the full TrueColor scale is still available when you want a specific colour."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Intent
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="alertIntentOptions"
              :model-value="intent"
              @update:model-value="intent = $event as AlertIntent"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Variant
            </span>
            <Select
              :model-value="variant"
              @update:model-value="variant = $event as AlertVariant"
            >
              <option
                v-for="option in alertVariantOptions"
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
              Size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as AlertSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Corner
            </span>
            <Select
              :model-value="corner"
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
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Icon size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="iconSizeOptions"
              :model-value="iconSize"
              @update:model-value="iconSize = $event as ControlSize | 'auto'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Icon alignment
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="alertIconAlignOptions"
              :model-value="iconAlign"
              @update:model-value="iconAlign = $event as AlertIconAlign"
            />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Override the intent's tone
            </span>
            <Toggle
              size="sm"
              :label="overrideTone ? 'Using colour' : 'Using intent'"
              v-model="overrideTone"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Colour
            </span>
            <Select
              :model-value="color"
              :disabled="!overrideTone"
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
              Description
            </span>
            <Textarea :rows="3" v-model="description" />
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
          <strong>Intent</strong> is the semantic axis — it chooses the tone, the
          default icon and whether the callout is announced
          <code>assertive</code> (interrupting the reader, for a failure) or
          <code>polite</code>. Turn on the override to reach the full 21-colour
          scale instead. <strong>Solid</strong> and the glass pair both keep
          their copy legible on their own fill. Turn on
          <strong>Long body</strong> to see what <strong>icon alignment</strong>
          does — <code>top</code> pins the glyph to the title's line, the other
          two size against the whole block.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="p-4">
        <Panel
          :variant="onGlass ? 'liquid-glass' : 'outlined'"
          :tone="onGlass ? (overrideTone ? color : 'blue') : 'neutral'"
          padding="md"
        >
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Current settings
              </span>
              <Alert
                :key="dismissKey"
                :intent="intent"
                :color="effectiveColor"
                :variant="variant"
                :size="size"
                :corner="corner"
                :title="title || undefined"
                :description="previewDescription"
                :icon="showIcon ? undefined : false"
                :icon-size="resolvedIconSize"
                :icon-align="iconAlign"
                :dismissible="dismissible"
                :glass-opacity="glassOpacity"
                :vibrancy="vibrancy"
                :specular-mode="specularMode"
                @dismiss="handleDismiss"
              >
                <template v-if="showActions" #actions>
                  <div class="flex flex-wrap gap-2">
                    <Button size="sm" variant="soft" color="blue">
                      Resume rollout
                    </Button>
                    <Button size="sm" variant="ghost" color="slate">
                      Snooze
                    </Button>
                  </div>
                </template>
              </Alert>
              <span v-if="dismissible" class="text-xs opacity-60">
                Dismiss it — it hides itself with no state on your side, and
                comes back here after a second.
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every intent — tone, icon and politeness together
              </span>
              <div class="space-y-2">
                <Alert
                  v-for="each in ALERT_INTENTS"
                  :key="each"
                  :intent="each"
                  :color="effectiveColor"
                  :variant="variant"
                  :size="size"
                  :corner="corner"
                  :title="each"
                  :description="`tone ${ALERT_INTENT_CONFIG[each].tone} · announced ${ALERT_INTENT_CONFIG[each].live}`"
                  :icon-size="resolvedIconSize"
                  :icon-align="iconAlign"
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
                Every variant
              </span>
              <div class="space-y-2">
                <Alert
                  v-for="each in alertVariantOptions"
                  :key="each.value"
                  :intent="intent"
                  :color="effectiveColor"
                  :variant="each.value as AlertVariant"
                  :size="size"
                  :corner="corner"
                  :title="String(each.label)"
                  description="The quick brown fox jumps over the lazy dog."
                  :icon-size="resolvedIconSize"
                  :icon-align="iconAlign"
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
                Body-only — no title, content in the default slot
              </span>
              <Alert
                :intent="intent"
                :color="effectiveColor"
                :variant="variant"
                :size="size"
                :corner="corner"
                :icon-size="resolvedIconSize"
                :icon-align="iconAlign"
                :glass-opacity="glassOpacity"
                :vibrancy="vibrancy"
                :specular-mode="specularMode"
              >
                A callout with no title at all. This copy comes through the
                default slot, which the component used to ignore entirely.
              </Alert>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>

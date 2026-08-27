<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Stepper,
  MultiToggle,
  Toggle,
  Button,
  type StepperProps,
  type PanelTone,
  type ControlSize,
  type StepperOrientation,
  type StepperConnector,
  type StepperConnectorAlign,
  type StepperNodeCorner,
  type StepperLoaderType,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  panelVariantOptions,
  panelToneOptions,
  controlSizeOptions,
  stepperOrientationOptions,
  stepperConnectorOptions,
  stepperConnectorAlignOptions,
  stepperNodeCornerOptions,
  stepperLoaderTypeOptions,
} from "../constants";

// The surface variant rides the shared Panel scale, so derive its type from
// the component props rather than keeping a private scale.
type StepperVariant = NonNullable<StepperProps["variant"]>;

const deploymentSteps = [
  {
    id: "plan",
    title: "Plan Changes",
    subtitle: "Resolve diffs",
    description: "Review the pending infrastructure changes before applying.",
  },
  {
    id: "apply",
    title: "Apply Changes",
    subtitle: "Run terraform apply",
    description: "Execute the plan to provision resources.",
  },
  {
    id: "verify",
    title: "Verify",
    subtitle: "Smoke tests",
    description: "Confirm the deployment is healthy and logs are clean.",
  },
  {
    id: "complete",
    title: "Complete",
    description: "Notify stakeholders and archive the run.",
    optionalLabel: "Optional notes",
  },
];

const stepperCompletedIds = ref<string[]>([]);
const stepperLoading = ref(false);
const stepperDisabled = ref(false);
const stepperVariant = ref<StepperVariant>("elevated");
const stepperTone = ref<PanelTone>("neutral");
const stepperSize = ref<ControlSize>("md");
const stepperNodeCorner = ref<StepperNodeCorner>("full");
const stepperOrientation = ref<StepperOrientation>("horizontal");
const stepperConnector = ref<StepperConnector>("progress");
const stepperConnectorAlign = ref<StepperConnectorAlign>("center");
const stepperConnectNodes = ref<boolean>(false);
const stepperInteractive = ref<boolean>(true);
const stepperAnimated = ref<boolean>(true);
const stepperLoaderType = ref<StepperLoaderType>("spinner");
const stepperShowProgressBar = ref<boolean>(false);
const stepperShowProgressSummary = ref<boolean>(false);

const handleStepperStepClick = (id: string) => {
  if (stepperLoading.value) return;
  // Simulate async verification when clicking a completed step
  if (stepperCompletedIds.value.includes(id)) {
    stepperLoading.value = true;
    setTimeout(() => (stepperLoading.value = false), 1200);
  } else {
    // Toggle completion logic
    const index = deploymentSteps.findIndex((s) => s.id === id);
    if (index !== -1) {
      stepperCompletedIds.value = deploymentSteps
        .slice(0, index + 1)
        .map((s) => s.id ?? "");
    }
  }
};

const handleStepperChange = (index: number, stepId?: string) => {
  if (!stepId) return;
  stepperCompletedIds.value = deploymentSteps
    .slice(0, index)
    .map((step) => step.id ?? "");
  handleStepperStepClick(stepId);
};

const stepperBooleanOptions = computed(() => [
  {
    label: "Connect nodes",
    value: stepperConnectNodes.value,
    setter: (checked: boolean) => (stepperConnectNodes.value = checked),
  },
  {
    label: "Interactive",
    value: stepperInteractive.value,
    setter: (checked: boolean) => (stepperInteractive.value = checked),
  },
  {
    label: "Animated",
    value: stepperAnimated.value,
    setter: (checked: boolean) => (stepperAnimated.value = checked),
  },
  {
    label: "Progress bar",
    value: stepperShowProgressBar.value,
    setter: (checked: boolean) => (stepperShowProgressBar.value = checked),
  },
  {
    label: "Progress summary",
    value: stepperShowProgressSummary.value,
    setter: (checked: boolean) => (stepperShowProgressSummary.value = checked),
  },
  {
    label: "Loading",
    value: stepperLoading.value,
    setter: (checked: boolean) => (stepperLoading.value = checked),
  },
  {
    label: "Disabled",
    value: stepperDisabled.value,
    setter: (checked: boolean) => (stepperDisabled.value = checked),
  },
]);
</script>

<template>
  <PlaygroundSection
    title="Stepper"
    label="[Stepper]"
    description="Multi-step workflow on the shared panel surface, with connectors and progress."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="panelVariantOptions"
              :model-value="stepperVariant"
              size="sm"
              @update:model-value="
                (value: string) => (stepperVariant = value as StepperVariant)
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="panelToneOptions"
              :model-value="stepperTone"
              size="sm"
              @update:model-value="
                (value: string) => (stepperTone = value as PanelTone)
              "
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="controlSizeOptions"
              :model-value="stepperSize"
              size="sm"
              @update:model-value="
                (value: string) => (stepperSize = value as ControlSize)
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Orientation</span>
            <MultiToggle
              full-width
              :options="stepperOrientationOptions"
              :model-value="stepperOrientation"
              size="sm"
              @update:model-value="
                (value: string) =>
                  (stepperOrientation = value as StepperOrientation)
              "
            />
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span>Node corner</span>
          <MultiToggle
            full-width
            :options="stepperNodeCornerOptions"
            :model-value="stepperNodeCorner"
            size="sm"
            @update:model-value="
              (value: string) => (stepperNodeCorner = value as StepperNodeCorner)
            "
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Loader type</span>
          <MultiToggle
            full-width
            :options="stepperLoaderTypeOptions"
            :model-value="stepperLoaderType"
            size="sm"
            @update:model-value="
              (value: string) => (stepperLoaderType = value as StepperLoaderType)
            "
          />
        </label>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Connector</span>
            <MultiToggle
              full-width
              :options="stepperConnectorOptions"
              :model-value="stepperConnector"
              size="sm"
              @update:model-value="
                (value: string) => (stepperConnector = value as StepperConnector)
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Connector align</span>
            <MultiToggle
              full-width
              :options="stepperConnectorAlignOptions"
              :model-value="stepperConnectorAlign"
              size="sm"
              @update:model-value="
                (value: string) =>
                  (stepperConnectorAlign = value as StepperConnectorAlign)
              "
            />
          </label>
        </div>
        <div class="grid gap-2 md:grid-cols-3">
          <label
            v-for="option in stepperBooleanOptions"
            :key="option.label"
            class="flex items-center justify-between"
          >
            <span>{{ option.label }}</span>
            <Toggle
              size="sm"
              :model-value="option.value"
              @update:model-value="option.setter"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex flex-col gap-4">
        <Stepper
          :steps="deploymentSteps"
          :variant="stepperVariant"
          :tone="stepperTone"
          :size="stepperSize"
          :node-corner="stepperNodeCorner"
          :orientation="stepperOrientation"
          :connector="stepperConnector"
          :connector-align="stepperConnectorAlign"
          :connect-nodes="stepperConnectNodes"
          :interactive="stepperInteractive"
          :animated="stepperAnimated"
          :loader-type="stepperLoaderType"
          :disabled="stepperDisabled"
          :completed-step-ids="stepperCompletedIds"
          :loading="stepperLoading"
          :show-progress-bar="stepperShowProgressBar"
          :show-progress-summary="stepperShowProgressSummary"
          :loader-title="stepperLoading ? 'Revalidating...' : undefined"
          @change="handleStepperChange"
        />
        <div class="flex gap-2">
          <Button size="sm" variant="outline" @click="stepperCompletedIds = []">
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            @click="
              stepperCompletedIds = deploymentSteps.map((s) => s.id ?? '')
            "
          >
            Mark all complete
          </Button>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>

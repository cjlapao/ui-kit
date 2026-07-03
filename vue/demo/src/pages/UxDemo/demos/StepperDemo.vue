<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Stepper,
  MultiToggle,
  Toggle,
  Button,
  type StepperProps,
  type PanelTone,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  stepperVariantOptions,
  stepperOrientationOptions,
  stepperSizeOptions,
  stepperConnectorOptions,
  stepperConnectorAlignOptions,
  panelToneOptions,
} from "../constants";

// The individual Stepper option types are not re-exported from the kit index;
// derive them from StepperProps.
type StepperVariant = NonNullable<StepperProps["variant"]>;
type StepperOrientation = NonNullable<StepperProps["orientation"]>;
type StepperSize = NonNullable<StepperProps["size"]>;
type StepperConnector = NonNullable<StepperProps["connector"]>;
type StepperConnectorAlign = NonNullable<StepperProps["connectorAlign"]>;

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
const stepperLoadingIds = ref<string[]>([]);
const stepperLoading = ref(false);
const stepperTone = ref<PanelTone>("neutral");
const stepperOrientation = ref<StepperOrientation>("horizontal");
const stepperVariant = ref<StepperVariant>("card");
const stepperSize = ref<StepperSize>("md");
const stepperConnector = ref<StepperConnector>("line");
const stepperConnectorAlign = ref<StepperConnectorAlign>("center");
const stepperConnectNodes = ref<boolean>(false);
const stepperInteractive = ref<boolean>(true);
const stepperShowProgressBar = ref<boolean>(false);
const stepperShowProgressSummary = ref<boolean>(false);

const handleStepperStepClick = (id: string) => {
  if (stepperLoadingIds.value.includes(id) || stepperLoading.value) return;
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
    label: "Interactive",
    value: stepperInteractive.value,
    setter: (checked: boolean) => (stepperInteractive.value = checked),
  },
  {
    label: "Loading",
    value: stepperLoading.value,
    setter: (checked: boolean) => (stepperLoading.value = checked),
  },
]);
</script>

<template>
  <PlaygroundSection
    title="Stepper"
    label="[Stepper]"
    description="Multi-step workflow with optional actions and progress."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="stepperVariantOptions"
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
        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="stepperSizeOptions"
              :model-value="stepperSize"
              size="sm"
              @update:model-value="
                (value: string) => (stepperSize = value as StepperSize)
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
          <label class="flex flex-col gap-2">
            <span>Connector</span>
            <MultiToggle
              full-width
              :options="stepperConnectorOptions"
              :model-value="stepperConnector"
              size="sm"
              @update:model-value="
                (value: string) =>
                  (stepperConnector = value as StepperConnector)
              "
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
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
          <label class="flex items-center justify-between">
            <span>Connect nodes</span>
            <Toggle size="sm" v-model="stepperConnectNodes" />
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
          :orientation="stepperOrientation"
          :connector="stepperConnector"
          :connector-align="stepperConnectorAlign"
          :size="stepperSize"
          :connect-nodes="stepperConnectNodes"
          :interactive="stepperInteractive"
          :completed-step-ids="stepperCompletedIds"
          :loader-step-ids="stepperLoadingIds"
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

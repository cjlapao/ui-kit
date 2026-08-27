import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { Stepper, MultiToggle, Toggle, Button } from "@cjlapao/ui-kit";
import type {
  PanelVariant,
  PanelTone,
  ControlSize,
  StepperOrientation,
  StepperConnector,
  StepperConnectorAlign,
  StepperNodeCorner,
  StepperLoaderType,
} from "@cjlapao/ui-kit";
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

export const StepperDemo: React.FC = () => {
  const [stepperCompletedIds, setStepperCompletedIds] = useState<string[]>([]);
  const [stepperLoading, setStepperLoading] = useState(false);
  const [stepperDisabled, setStepperDisabled] = useState(false);
  const [stepperVariant, setStepperVariant] = useState<PanelVariant>("elevated");
  const [stepperTone, setStepperTone] = useState<PanelTone>("neutral");
  const [stepperSize, setStepperSize] = useState<ControlSize>("md");
  const [stepperNodeCorner, setStepperNodeCorner] =
    useState<StepperNodeCorner>("full");
  const [stepperOrientation, setStepperOrientation] =
    useState<StepperOrientation>("horizontal");
  const [stepperConnector, setStepperConnector] =
    useState<StepperConnector>("progress");
  const [stepperConnectorAlign, setStepperConnectorAlign] =
    useState<StepperConnectorAlign>("center");
  const [stepperConnectNodes, setStepperConnectNodes] =
    useState<boolean>(false);
  const [stepperInteractive, setStepperInteractive] = useState<boolean>(true);
  const [stepperAnimated, setStepperAnimated] = useState<boolean>(true);
  const [stepperLoaderType, setStepperLoaderType] =
    useState<StepperLoaderType>("spinner");
  const [stepperShowProgressBar, setStepperShowProgressBar] =
    useState<boolean>(false);
  const [stepperShowProgressSummary, setStepperShowProgressSummary] =
    useState<boolean>(false);

  const handleStepperStepClick = (id: string) => {
    if (stepperLoading) return;
    // Simulate async verification when clicking a completed step
    if (stepperCompletedIds.includes(id)) {
      setStepperLoading(true);
      setTimeout(() => setStepperLoading(false), 1200);
    } else {
      // Toggle completion logic
      const index = deploymentSteps.findIndex((s) => s.id === id);
      if (index !== -1) {
        const newCompleted = deploymentSteps
          .slice(0, index + 1)
          .map((s) => s.id ?? "");
        setStepperCompletedIds(newCompleted);
      }
    }
  };

  return (
    <PlaygroundSection
      title="Stepper"
      label="[Stepper]"
      description="Multi-step workflow on the shared panel surface, with connectors and progress."
      controls={
        <div className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Variant</span>
              <MultiToggle
                fullWidth
                options={panelVariantOptions}
                value={stepperVariant}
                size="sm"
                onChange={(value) => setStepperVariant(value as PanelVariant)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Tone</span>
              <MultiToggle
                fullWidth
                options={panelToneOptions}
                value={stepperTone}
                size="sm"
                onChange={(value) => setStepperTone(value as PanelTone)}
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Size</span>
              <MultiToggle
                fullWidth
                options={controlSizeOptions}
                value={stepperSize}
                size="sm"
                onChange={(value) => setStepperSize(value as ControlSize)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Orientation</span>
              <MultiToggle
                fullWidth
                options={stepperOrientationOptions}
                value={stepperOrientation}
                size="sm"
                onChange={(value) =>
                  setStepperOrientation(value as StepperOrientation)
                }
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span>Node corner</span>
            <MultiToggle
              fullWidth
              options={stepperNodeCornerOptions}
              value={stepperNodeCorner}
              size="sm"
              onChange={(value) => setStepperNodeCorner(value as StepperNodeCorner)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Loader type</span>
            <MultiToggle
              fullWidth
              options={stepperLoaderTypeOptions}
              value={stepperLoaderType}
              size="sm"
              onChange={(value) =>
                setStepperLoaderType(value as StepperLoaderType)
              }
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Connector</span>
              <MultiToggle
                fullWidth
                options={stepperConnectorOptions}
                value={stepperConnector}
                size="sm"
                onChange={(value) =>
                  setStepperConnector(value as StepperConnector)
                }
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Connector align</span>
              <MultiToggle
                fullWidth
                options={stepperConnectorAlignOptions}
                value={stepperConnectorAlign}
                size="sm"
                onChange={(value) =>
                  setStepperConnectorAlign(value as StepperConnectorAlign)
                }
              />
            </label>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              {
                label: "Connect nodes",
                value: stepperConnectNodes,
                setter: setStepperConnectNodes,
              },
              {
                label: "Interactive",
                value: stepperInteractive,
                setter: setStepperInteractive,
              },
              {
                label: "Animated",
                value: stepperAnimated,
                setter: setStepperAnimated,
              },
              {
                label: "Progress bar",
                value: stepperShowProgressBar,
                setter: setStepperShowProgressBar,
              },
              {
                label: "Progress summary",
                value: stepperShowProgressSummary,
                setter: setStepperShowProgressSummary,
              },
              {
                label: "Loading",
                value: stepperLoading,
                setter: setStepperLoading,
              },
              {
                label: "Disabled",
                value: stepperDisabled,
                setter: setStepperDisabled,
              },
            ].map((option) => (
              <label
                key={option.label}
                className="flex items-center justify-between"
              >
                <span>{option.label}</span>
                <Toggle
                  size="sm"
                  checked={option.value}
                  onChange={(event) => option.setter(event.target.checked)}
                />
              </label>
            ))}
          </div>
        </div>
      }
      preview={
        <div className="flex flex-col gap-4">
          <Stepper
            steps={deploymentSteps}
            variant={stepperVariant}
            tone={stepperTone}
            size={stepperSize}
            nodeCorner={stepperNodeCorner}
            orientation={stepperOrientation}
            connector={stepperConnector}
            connectorAlign={stepperConnectorAlign}
            connectNodes={stepperConnectNodes}
            interactive={stepperInteractive}
            animated={stepperAnimated}
            loaderType={stepperLoaderType}
            disabled={stepperDisabled}
            completedStepIds={stepperCompletedIds}
            loading={stepperLoading}
            showProgressBar={stepperShowProgressBar}
            showProgressSummary={stepperShowProgressSummary}
            loaderTitle={stepperLoading ? "Revalidating..." : undefined}
            onChange={(index, stepId) => {
              if (!stepId) return;
              const newCompleted = deploymentSteps
                .slice(0, index)
                .map((step) => step.id ?? "");
              setStepperCompletedIds(newCompleted);
              handleStepperStepClick(stepId);
            }}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStepperCompletedIds([])}
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setStepperCompletedIds(deploymentSteps.map((s) => s.id ?? ""))
              }
            >
              Mark all complete
            </Button>
          </div>
        </div>
      }
    />
  );
};

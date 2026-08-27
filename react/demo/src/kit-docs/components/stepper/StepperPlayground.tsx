import React, { useState } from "react";
import { Button, MultiToggle, Stepper, type Step } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  PanelVariant,
  StepperConnector,
  StepperConnectorAlign,
  StepperLoaderType,
  StepperNodeCorner,
  StepperOrientation,
  StepperProgressBarPosition,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  surfaceVariantOptions,
  stepperConnectorAlignOptions,
  stepperConnectorOptions,
  stepperLoaderTypeOptions,
  stepperNodeCornerOptions,
  stepperOrientationOptions,
  stepperProgressBarPositionOptions,
  trueColorOptions,
} from "../../shared/options";

const steps: Step[] = [
  {
    id: "plan",
    title: "Plan Changes",
    subtitle: "Resolve diffs",
    description: "Review the pending infrastructure changes.",
  },
  {
    id: "apply",
    title: "Apply Changes",
    subtitle: "Run terraform apply",
    description: "Provision the resources.",
  },
  {
    id: "verify",
    title: "Verify",
    subtitle: "Smoke tests",
    description: "Confirm the deployment is healthy.",
  },
  {
    id: "complete",
    title: "Complete",
    description: "Notify stakeholders and archive the run.",
  },
];

/**
 * Short option lists (≤3) use a segmented MultiToggle; the long ones — the
 * eight surface variants, the 21 tones, the five sizes and the seven node
 * corners — use a SelectControl dropdown so the control column stays narrow.
 */
export const StepperPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [orientation, setOrientation] =
    useState<StepperOrientation>("horizontal");
  const [nodeCorner, setNodeCorner] = useState<StepperNodeCorner>("full");
  const [loaderType, setLoaderType] = useState<StepperLoaderType>("spinner");
  const [connector, setConnector] = useState<StepperConnector>("progress");
  const [connectorAlign, setConnectorAlign] =
    useState<StepperConnectorAlign>("center");
  const [progressBarPosition, setProgressBarPosition] =
    useState<StepperProgressBarPosition>("bottom");
  const [interactive, setInteractive] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [connectNodes, setConnectNodes] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showProgressSummary, setShowProgressSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [completedIds, setCompletedIds] = useState<string[]>(["plan"]);

  const handleStepChange = (index: number) => {
    if (disabled || loading) return;
    setCurrentIndex(index);
    setCompletedIds(steps.slice(0, index).map((step) => step.id ?? ""));
  };

  return (
    <PlaygroundPanel
      previewClassName="w-full"
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as PanelVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <Control label="Orientation">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={stepperOrientationOptions}
                        value={orientation}
                        onChange={(v) => setOrientation(v as StepperOrientation)}
                      />
                    </Control>
                    <SelectControl
                      label="Node corner"
                      options={stepperNodeCornerOptions}
                      value={nodeCorner}
                      onChange={(v) => setNodeCorner(v as StepperNodeCorner)}
                    />
                  </>
                ),
              },
              {
                id: "loader",
                title: "Loader",
                controls: (
                  <Control label="Loader type">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={stepperLoaderTypeOptions}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as StepperLoaderType)}
                    />
                  </Control>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <Control label="Connector">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={stepperConnectorOptions}
                        value={connector}
                        onChange={(v) => setConnector(v as StepperConnector)}
                      />
                    </Control>
                    <Control label="Connector align">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={stepperConnectorAlignOptions}
                        value={connectorAlign}
                        onChange={(v) => setConnectorAlign(v as StepperConnectorAlign)}
                      />
                    </Control>
                    <Control label="Progress bar position">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={stepperProgressBarPositionOptions}
                        value={progressBarPosition}
                        onChange={(v) =>
                          setProgressBarPosition(v as StepperProgressBarPosition)
                        }
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Interactive" checked={interactive} onChange={setInteractive} />
                    <ToggleRow label="Animated" checked={animated} onChange={setAnimated} />
                    <ToggleRow label="Connect nodes" checked={connectNodes} onChange={setConnectNodes} />
                    <ToggleRow label="Progress bar" checked={showProgressBar} onChange={setShowProgressBar} />
                    <ToggleRow label="Progress summary" checked={showProgressSummary} onChange={setShowProgressSummary} />
                    <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Spinner</strong> and <strong>progress</strong> overlay the
            node (and the Panel when the whole stepper loads);{" "}
            <strong>skeleton</strong> replaces the content with pulsing discs
            and lines. Click a step to complete every step before it.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <Stepper
            steps={steps}
            variant={variant}
            tone={tone}
            size={size}
            orientation={orientation}
            nodeCorner={nodeCorner}
            connector={connector}
            connectorAlign={connectorAlign}
            progressBarPosition={progressBarPosition}
            connectNodes={connectNodes}
            interactive={interactive}
            animated={animated}
            loaderType={loaderType}
            disabled={disabled}
            currentIndex={currentIndex}
            completedStepIds={completedIds}
            loading={loading}
            showProgressBar={showProgressBar}
            showProgressSummary={showProgressSummary}
            onChange={handleStepChange}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentIndex(0);
                setCompletedIds([]);
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentIndex(steps.length - 1);
                setCompletedIds(steps.map((step) => step.id ?? ""));
              }}
            >
              Mark all complete
            </Button>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

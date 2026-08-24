import React, { useState } from "react";
import {
  CustomIcon,
  DEFAULT_SURFACE_CORNER,
  MultiToggle,
  sampleWorkflow,
  WorkflowTracker,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelSpecularMode,
  TrueColor,
  WorkflowData,
  WorkflowTrackerCorner,
  WorkflowTrackerPadding,
  WorkflowTrackerVariant,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  trueColorOptions,
  WORKFLOW_RELEASE_DATA,
} from "../../shared/options";

/** Variants whose card is see-through, so the glass controls apply. */
const GLASS_VARIANTS: WorkflowTrackerVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

type DataSet = "vendor" | "release" | "empty";

const DATA_SETS: { label: string; value: DataSet }[] = [
  { label: "Vendor onboarding", value: "vendor" },
  { label: "Release pipeline", value: "release" },
  { label: "Empty", value: "empty" },
];

const EMPTY_DATA: WorkflowData = {
  eyebrow: "NO PIPELINE",
  title: "Nothing running",
  steps: [],
};

export const WorkflowTrackerPlayground: React.FC = () => {
  const [dataSet, setDataSet] = useState<DataSet>("vendor");
  const [variant, setVariant] = useState<WorkflowTrackerVariant>("outlined");
  const [cardTone, setCardTone] = useState<TrueColor>("neutral");
  const [accent, setAccent] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<WorkflowTrackerCorner>(DEFAULT_SURFACE_CORNER);
  const [iconCorner, setIconCorner] =
    useState<WorkflowTrackerCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<WorkflowTrackerPadding>("none");
  const [loading, setLoading] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [stickyRail, setStickyRail] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("light");

  // The tracker never owns the active step — the parent swaps it in `data`.
  const [activeOverride, setActiveOverride] = useState<
    Record<string, string | undefined>
  >({});
  const [lastAction, setLastAction] = useState<string | null>(null);

  const base: WorkflowData =
    dataSet === "vendor"
      ? sampleWorkflow
      : dataSet === "release"
        ? WORKFLOW_RELEASE_DATA
        : EMPTY_DATA;
  const data: WorkflowData = {
    ...base,
    ...(activeOverride[dataSet]
      ? { activeStepId: activeOverride[dataSet] }
      : {}),
    icon: showIcon ? (
      <CustomIcon icon="Rocket" customSize={22} tone={accent} />
    ) : undefined,
  };

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Data set">
            <MultiToggle
              fullWidth
              size="sm"
              options={DATA_SETS}
              value={dataSet}
              onChange={(v) => setDataSet(v as DataSet)}
            />
          </Control>
          <SelectControl
            label="Card variant"
            options={surfaceVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as WorkflowTrackerVariant)}
          />
          <SelectControl
            label="Card tone"
            options={trueColorOptions}
            value={cardTone}
            onChange={(v) => setCardTone(v as TrueColor)}
          />
          <SelectControl
            label="Accent"
            options={trueColorOptions}
            value={accent}
            onChange={(v) => setAccent(v as TrueColor)}
          />
          <SelectControl
            label="Corner"
            options={panelCornerOptions}
            value={corner}
            onChange={(v) => setCorner(v as WorkflowTrackerCorner)}
          />
          <SelectControl
            label="Icon corner"
            options={panelCornerOptions}
            value={iconCorner}
            onChange={(v) => setIconCorner(v as WorkflowTrackerCorner)}
          />
          <SelectControl
            label="Padding"
            options={panelPaddingOptions}
            value={padding}
            onChange={(v) => setPadding(v as WorkflowTrackerPadding)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
            <ToggleRow
              label="Interactive"
              checked={interactive}
              onChange={setInteractive}
            />
            <ToggleRow
              label="Title icon"
              checked={showIcon}
              onChange={setShowIcon}
            />
            <ToggleRow label="Legend" checked={showLegend} onChange={setShowLegend} />
            <ToggleRow
              label="Header"
              checked={showHeader}
              onChange={setShowHeader}
            />
            <ToggleRow
              label="Sticky rail"
              checked={stickyRail}
              onChange={setStickyRail}
            />
          </div>
          {isGlass && (
            <>
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(v) => setSpecularMode(v as PanelSpecularMode)}
                />
              </Control>
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(v) => setVibrancy(v as GlassVibrancy)}
                />
              </Control>
              <Control label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                />
              </Control>
            </>
          )}
        </>
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <WorkflowTracker
              data={data}
              loading={loading}
              accentColor={accent}
              variant={variant}
              cardTone={cardTone}
              corner={corner}
              iconCorner={iconCorner}
              padding={padding}
              glassOpacity={glassOpacity}
              vibrancy={vibrancy}
              specularMode={specularMode}
              showLegend={showLegend}
              showHeader={showHeader}
              stickyRail={stickyRail}
              onStepSelect={
                interactive
                  ? (stepId) => {
                      setActiveOverride((prev) => ({
                        ...prev,
                        [dataSet]: stepId,
                      }));
                      setLastAction(`step "${stepId}" selected`);
                    }
                  : undefined
              }
              onSubStepSelect={
                interactive
                  ? (stepId, subStepId) =>
                      setLastAction(`sub-step "${subStepId}" of "${stepId}"`)
                  : undefined
              }
            />
            {lastAction && (
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                {lastAction}
              </p>
            )}
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

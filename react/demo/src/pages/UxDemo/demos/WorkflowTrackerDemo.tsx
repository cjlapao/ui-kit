import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  MultiToggle,
  Toggle,
  Select,
  WorkflowTracker,
  sampleWorkflow,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import logo from "@assets/images/logo.png";
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
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose card is see-through, so the glass controls apply. */
const GLASS_VARIANTS: WorkflowTrackerVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

/** Second fixture — proves the component is domain-agnostic. */
const releaseWorkflow: WorkflowData = {
  eyebrow: "RELEASE PIPELINE · v2.14.0",
  title: "orchestrator-api",
  live: true,
  activeStepId: "integration_tests",
  steps: [
    { id: "commit", label: "Commit pushed", status: "done", meta: "0m" },
    { id: "lint", label: "Lint & typecheck", status: "done", meta: "1m 12s" },
    {
      id: "unit_tests",
      label: "Unit tests",
      status: "done",
      meta: "3m 41s · 812 passed",
    },
    {
      id: "sbom",
      label: "SBOM generation",
      status: "skipped",
      badge: "Not needed",
      meta: "Unchanged dependency tree",
    },
    {
      id: "integration_tests",
      label: "Integration tests",
      status: "in_progress",
      badge: "In progress",
      meta: "6m · 2 of 4 suites",
      elapsed: "6m",
      description:
        "Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",
      owner: "CI · runner-07",
      startedAt: "19 Aug · 14:02",
      sla: "Budget 15m",
      subSteps: [
        {
          id: "api_suite",
          label: "API contract suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "2m",
        },
        {
          id: "db_suite",
          label: "Database migration suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "1m 50s",
        },
        {
          id: "e2e_suite",
          label: "End-to-end suite",
          status: "running",
          badge: "Running",
          note: "Shard 2 of 3 — 148 of 210 specs",
        },
        { id: "perf_suite", label: "Performance smoke", status: "not_started" },
      ],
    },
    {
      id: "image_scan",
      label: "Container image scan",
      status: "attention",
      badge: "Needs attention",
      meta: "1 high CVE in base image",
    },
    {
      id: "approval",
      label: "Release approval",
      status: "blocked",
      badge: "Blocked",
      meta: "Waiting on release manager",
    },
    { id: "deploy_staging", label: "Deploy to staging", status: "not_started" },
    { id: "deploy_prod", label: "Deploy to production", status: "not_started" },
  ],
};

const fixtures: Record<string, WorkflowData> = {
  vendor: sampleWorkflow,
  release: releaseWorkflow,
  empty: { eyebrow: "NO PIPELINE", title: "Nothing running", steps: [] },
};

export const WorkflowTrackerDemo: React.FC = () => {
  const [fixture, setFixture] = useState<keyof typeof fixtures>("vendor");
  const [accent, setAccent] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<WorkflowTrackerVariant>("outlined");
  const [cardTone, setCardTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<WorkflowTrackerCorner>(
    DEFAULT_SURFACE_CORNER,
  );
  const [padding, setPadding] = useState<WorkflowTrackerPadding>("none");
  const [showIcon, setShowIcon] = useState(true);
  const [iconCorner, setIconCorner] = useState<WorkflowTrackerCorner>(
    DEFAULT_SURFACE_CORNER,
  );
  const [loading, setLoading] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [stickyRail, setStickyRail] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("light");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  // The component never owns the active step — the parent swaps it in `data`.
  const [activeOverride, setActiveOverride] = useState<
    Record<string, string | undefined>
  >({});
  const [lastAction, setLastAction] = useState<string | null>(null);

  const data = useMemo<WorkflowData>(() => {
    const base = fixtures[fixture];
    const override = activeOverride[fixture];
    return {
      ...base,
      ...(override ? { activeStepId: override } : {}),
      // The tracker clips the node to `iconCorner`, so the raw asset is passed
      // through with no rounding of its own.
      icon: showIcon ? <img src={logo} alt="" /> : undefined,
    };
  }, [fixture, activeOverride, showIcon]);

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundSection
      title="Workflow Tracker"
      label="WorkflowTracker"
      description="Timeline rail, active-step detail with sub-steps, and roll-up cards for flagged and skipped steps — all derived from one data object."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Data set">
            <MultiToggle
              fullWidth
              size="sm"
              options={[
                { label: "Vendor onboarding", value: "vendor" },
                { label: "Release pipeline", value: "release" },
                { label: "Empty", value: "empty" },
              ]}
              value={fixture}
              onChange={(value) => setFixture(value as keyof typeof fixtures)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Eight variants is past what a MultiToggle can show legibly. */}
            <Field label="Card variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as WorkflowTrackerVariant)
                }
              >
                {panelVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Card tone">
              <Select
                value={cardTone}
                onChange={(event) =>
                  setCardTone(event.target.value as TrueColor)
                }
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Accent colour">
              <Select
                value={accent}
                onChange={(event) => setAccent(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Corner">
              <Select
                value={corner}
                onChange={(event) =>
                  setCorner(event.target.value as WorkflowTrackerCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title icon corner">
              <Select
                value={iconCorner}
                disabled={!showIcon}
                onChange={(event) =>
                  setIconCorner(event.target.value as WorkflowTrackerCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Card padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={padding}
                onChange={(value) =>
                  setPadding(value as WorkflowTrackerPadding)
                }
              />
            </Field>
          </div>

          <p className="text-xs opacity-70">
            Only the tinted variants — tonal, subtle, simple, glass, liquid
            glass — read the card tone.
          </p>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Loading"
              checked={loading}
              onChange={(event) => setLoading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Interactive"
              checked={interactive}
              onChange={(event) => setInteractive(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Title icon"
              checked={showIcon}
              onChange={(event) => setShowIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Legend"
              checked={showLegend}
              onChange={(event) => setShowLegend(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Header"
              checked={showHeader}
              onChange={(event) => setShowHeader(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Sticky rail"
              checked={stickyRail}
              onChange={(event) => setStickyRail(event.target.checked)}
            />
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) =>
                    setSpecularMode(value as PanelSpecularMode)
                  }
                />
              </Field>
              <Field label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </Field>
              <Field label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(value) => setGlassOpacity(value as GlassOpacity)}
                />
              </Field>
            </div>
          )}

          <p className="text-xs opacity-70">
            With <strong>Interactive</strong> on, timeline rows become buttons.
            The component stays controlled — this demo updates{" "}
            <code>data.activeStepId</code> itself.
          </p>
          {lastAction && (
            <div className="rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              Action: <strong>{lastAction}</strong>
            </div>
          )}
        </div>
      }
      preview={
        // No opaque wrapper here: it hid the playground's background image, so
        // the glass variants had nothing to be see-through against.
        <div className="p-4 sm:p-6">
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
                      [fixture]: stepId,
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
        </div>
      }
    />
  );
};

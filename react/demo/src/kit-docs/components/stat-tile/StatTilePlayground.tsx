import React, { useState } from "react";
import {
  StatCard,
  StatChartTile,
  StatCountTile,
  StatGoalTile,
  StatGraphTile,
  StatHealthCard,
  StatTile,
  STAT_GRAPH_CHART_TYPES,
} from "@cjlapao/ui-kit";
import type {
  EcgMonitorState,
  StatGraphChartType,
} from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { useStatBaseControls } from "../../shared/StatBaseControls";
import { ecgMonitorStateOptions } from "../../shared/options";

/**
 * Which member of the family the playground renders. They all inherit
 * `StatCardProps`, so the base controls drive every one of them and only the
 * extras below change.
 */
const STAT_VARIANTS = [
  { label: "Card", value: "card" },
  { label: "Tile", value: "tile" },
  { label: "Count", value: "count" },
  { label: "Goal", value: "goal" },
  { label: "Chart", value: "chart" },
  { label: "Graph", value: "graph" },
  { label: "Health", value: "health" },
] as const;

type StatVariant = (typeof STAT_VARIANTS)[number]["value"];

/** What each variant adds on top of the base card, shown under the preview. */
const EXTRAS: Record<StatVariant, string> = {
  card: "The base. Everything else on this page is this component with a body.",
  tile: "StatCard under the older prop names — `title`, `color`, `textColor`, a `progress` object. Nothing of its own.",
  count: "Adds `breakdown`: labelled rows under the count. Defaults `size` to `xl`.",
  goal: "Adds `goals` and `ringSize`. Rings scale with the card's `size`.",
  chart: "Adds `data` and `chartSize`: a navigable donut with a legend.",
  graph: "Adds `data`, `series` and `chartType`. `variant` is the Panel surface again — it used to be the chart kind.",
  health: "Adds `state`, `bpm` and `height`: a live ECG trace as the body.",
};

const GOALS = [
  { value: 78, label: "Uptime target", icon: "HealthCheck" as const },
  { value: 45, label: "Cost budget", icon: "Shop" as const },
  { value: 92, label: "Coverage", icon: "Rocket" as const },
];

const CHART_DATA = [
  {
    id: "regions",
    label: "By region",
    centerLabel: "capsules",
    items: [
      { label: "us-east", value: 48 },
      { label: "eu-west", value: 31 },
      { label: "ap-south", value: 22 },
      { label: "sa-east", value: 9 },
    ],
  },
  {
    id: "tiers",
    label: "By tier",
    centerLabel: "capsules",
    items: [
      { label: "Standard", value: 71 },
      { label: "Premium", value: 27 },
      { label: "Trial", value: 12 },
    ],
  },
];

const GRAPH_DATA = [
  { name: "Mon", requests: 42, errors: 4 },
  { name: "Tue", requests: 58, errors: 7 },
  { name: "Wed", requests: 51, errors: 3 },
  { name: "Thu", requests: 73, errors: 9 },
  { name: "Fri", requests: 66, errors: 5 },
];

const GRAPH_SERIES = [
  { key: "requests", label: "Requests" },
  { key: "errors", label: "Errors" },
];

const BREAKDOWN = [
  { label: "Running", value: 96 },
  { label: "Paused", value: 24 },
  { label: "Failed", value: 8, color: "rose" as const },
];

/**
 * One playground for the whole family. The base controls come from
 * `useStatBaseControls`, the same hook the `StatCard` page uses, so the two
 * cannot drift: add a prop to the base card, wire it there once, and every
 * variant here picks it up.
 */
export const StatTilePlayground: React.FC = () => {
  const { groups, statProps } = useStatBaseControls();
  const [variant, setVariant] = useState<StatVariant>("card");

  // Per-variant extras.
  const [breakdown, setBreakdown] = useState(true);
  const [ringSize, setRingSize] = useState("");
  const [datasets, setDatasets] = useState(true);
  const [chartType, setChartType] = useState<StatGraphChartType>("bar");
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [chartAnimation, setChartAnimation] = useState(true);
  const [health, setHealth] = useState<EcgMonitorState>("healthy");
  const [bpm, setBpm] = useState("60");

  const label = "Active capsules";
  const value = 128;

  const extras = (() => {
    switch (variant) {
      case "count":
        return (
          <Control label="Count extras">
            <ToggleRow label="Breakdown rows" checked={breakdown} onChange={setBreakdown} />
          </Control>
        );
      case "goal":
        return (
          <ChoiceControl
            label="Ring size"
            options={[
              { label: "(from size)", value: "" },
              { label: "40", value: "40" },
              { label: "64", value: "64" },
              { label: "88", value: "88" },
            ]}
            value={ringSize}
            onChange={setRingSize}
          />
        );
      case "chart":
        return (
          <Control label="Chart extras">
            <ToggleRow label="Two datasets" checked={datasets} onChange={setDatasets} />
          </Control>
        );
      case "graph":
        return (
          <>
            <ChoiceControl
              label="Chart type"
              options={STAT_GRAPH_CHART_TYPES.map((v) => ({ label: v, value: v }))}
              value={chartType}
              onChange={(v) => setChartType(v as StatGraphChartType)}
            />
            <Control label="Graph extras">
              <div className="space-y-1.5">
                <ToggleRow label="Axes" checked={showAxes} onChange={setShowAxes} />
                <ToggleRow label="Grid" checked={showGrid} onChange={setShowGrid} />
                <ToggleRow label="Legend" checked={showLegend} onChange={setShowLegend} />
                <ToggleRow label="Animate" checked={chartAnimation} onChange={setChartAnimation} />
              </div>
            </Control>
          </>
        );
      case "health":
        return (
          <>
            <ChoiceControl
              label="Health state"
              options={ecgMonitorStateOptions}
              value={health}
              onChange={(v) => setHealth(v as EcgMonitorState)}
            />
            <ChoiceControl
              label="BPM"
              options={[
                { label: "48", value: "48" },
                { label: "60", value: "60" },
                { label: "96", value: "96" },
                { label: "128", value: "128" },
              ]}
              value={bpm}
              onChange={setBpm}
            />
          </>
        );
      default:
        return null;
    }
  })();

  const preview = (() => {
    switch (variant) {
      case "tile":
        return <StatTile {...statProps} title={label} value={value} />;
      case "count":
        return (
          <StatCountTile
            {...statProps}
            label={label}
            value={value}
            breakdown={breakdown ? BREAKDOWN : undefined}
          />
        );
      case "goal":
        return (
          <StatGoalTile
            {...statProps}
            label={label}
            goals={GOALS}
            ringSize={ringSize ? Number(ringSize) : undefined}
          />
        );
      case "chart":
        return (
          <StatChartTile
            {...statProps}
            label={label}
            data={datasets ? CHART_DATA : CHART_DATA.slice(0, 1)}
          />
        );
      case "graph":
        return (
          <StatGraphTile
            {...statProps}
            label={label}
            value={value}
            data={GRAPH_DATA}
            series={GRAPH_SERIES}
            chartType={chartType}
            showAxes={showAxes}
            showGrid={showGrid}
            showLegend={showLegend}
            chartAnimation={chartAnimation}
          />
        );
      case "health":
        return (
          <StatHealthCard
            {...statProps}
            label={label}
            value={value}
            state={health}
            bpm={Number(bpm)}
          />
        );
      default:
        return <StatCard {...statProps} label={label} value={value} />;
    }
  })();

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "variant",
                title: "Variant",
                controls: (
                  <>
                    <ChoiceControl
                      label="Stat variant"
                      options={STAT_VARIANTS.map((v) => ({ ...v }))}
                      value={variant}
                      onChange={(v) => setVariant(v as StatVariant)}
                    />
                    {extras}
                  </>
                ),
              },
              ...groups,
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {EXTRAS[variant]} Every control below <strong>Stat variant</strong>{" "}
            is a <code>StatCard</code> prop and applies to all seven — they are
            the same hook the Stat Card page uses, so the two lists cannot
            drift.
          </p>
        </div>
      }
      preview={
        <div
          className={
            // The chart and graph bodies need room; the rest read better narrow.
            variant === "chart" || variant === "graph"
              ? "w-full max-w-md"
              : "w-full max-w-xs"
          }
        >
          {preview}
        </div>
      }
    />
  );
};

export default StatTilePlayground;

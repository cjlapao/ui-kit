// @ts-nocheck
import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  StatCard,
  StatHealthCard,
  Input,
  MultiToggle,
  Toggle,
} from "@cjlapao/ui-kit";
import {
  StatCardSize,
  StatCardTrend,
  PanelVariant,
  PanelCorner,
  EcgMonitorState,
  IconName,
} from "@cjlapao/ui-kit";
import {
  panelVariantOptions,
  panelCornerOptions,
  statCardIconOptions,
  statCardTrendDirectionOptions,
  statCardHealthOptions,
  statCardSizeOptions,
} from "../constants";

export const StatCardDemo: React.FC = () => {
  const [statLabel, setStatLabel] = useState("Total balance");
  const [statValue, setStatValue] = useState("$1.42M");
  const [statIcon, setStatIcon] = useState("Shop");
  const [statTrendOn, setStatTrendOn] = useState(true);
  const [statTrendDir, setStatTrendDir] =
    useState<StatCardTrend["direction"]>("up");
  const [statHealth, setStatHealth] = useState("off");
  const [statSize, setStatSize] = useState<StatCardSize>("md");
  const [statVariant, setStatVariant] = useState<PanelVariant>("elevated");
  const [statCorner, setStatCorner] = useState<PanelCorner>("rounded-lg");

  const trendValues: Record<StatCardTrend["direction"], string> = {
    up: "+12.4%",
    down: "-3.1%",
    neutral: "0.0%",
  };

  return (
    <PlaygroundSection
      title="Stat Card"
      label="[StatCard]"
      description="Dynamic metric card built on Panel — every part (label, icon, value, trend, live ECG health strip) can be hidden, and the surface, corner and size are adjustable."
      controls={
        <div className="space-y-4 text-sm">
          <label className="flex flex-col gap-2">
            <span>Label</span>
            <Input
              size="sm"
              value={statLabel}
              onChange={(event) => setStatLabel(event.target.value)}
              placeholder="Leave empty to hide"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Value</span>
            <Input
              size="sm"
              value={statValue}
              onChange={(event) => setStatValue(event.target.value)}
              placeholder="Leave empty to hide"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Icon</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={statCardIconOptions}
              value={statIcon}
              onChange={(value) => setStatIcon(value as IconName)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Trend</span>
            <Toggle
              size="sm"
              checked={statTrendOn}
              onChange={(event) => setStatTrendOn(event.target.checked)}
            />
          </label>
          {statTrendOn && (
            <label className="flex flex-col gap-2">
              <span>Trend direction</span>
              <MultiToggle
                fullWidth
                size="sm"
                options={statCardTrendDirectionOptions}
                value={statTrendDir}
                onChange={(value) =>
                  setStatTrendDir(value as StatCardTrend["direction"])
                }
              />
            </label>
          )}
          <label className="flex flex-col gap-2">
            <span>Live health (ECG)</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={statCardHealthOptions}
              value={statHealth}
              onChange={(value) => setStatHealth(value as string)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={statCardSizeOptions}
              value={statSize}
              onChange={(value) => setStatSize(value as StatCardSize)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Surface variant</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={panelVariantOptions}
              value={statVariant}
              onChange={(value) => setStatVariant(value as PanelVariant)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Corner</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={panelCornerOptions}
              value={statCorner}
              onChange={(value) => setStatCorner(value as PanelCorner)}
            />
          </label>
        </div>
      }
      preview={
        <div className="flex flex-col gap-6">
          {(() => {
            // The ECG strip is no longer a StatCard prop, so the health switch
            // now chooses between the plain card and StatHealthCard — which is
            // the same card with the monitor as its body, and takes every prop
            // below unchanged.
            const shared = {
              label: statLabel,
              icon: statIcon === "none" ? undefined : (statIcon as IconName),
              trend: statTrendOn
                ? { value: trendValues[statTrendDir], direction: statTrendDir }
                : undefined,
              size: statSize,
              variant: statVariant,
              corner: statCorner,
            };
            return statHealth === "off" ? (
              <StatCard {...shared} value={statValue} />
            ) : (
              <StatHealthCard
                {...shared}
                value={statValue}
                state={statHealth as EcgMonitorState}
              />
            );
          })()}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total balance"
              value="$1.42M"
              icon="Shop"
              trend={{ value: "+12.4%", direction: "up" }}
            />
            <StatCard
              label="API requests"
              value="1.2M/h"
              icon="Database"
              trend={{ value: "-3.1%", direction: "down" }}
            />
            <StatHealthCard
              label="Service health"
              icon="HealthCheck"
              state="healthy"
            />
            <StatCard label="Deployments" value="42" />
          </div>
        </div>
      }
    />
  );
};

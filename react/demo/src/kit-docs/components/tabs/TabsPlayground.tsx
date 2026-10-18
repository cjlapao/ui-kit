import React, { useState } from "react";
import { ColorSwatches, Panel, Tabs } from "@cjlapao/ui-kit";
import type {
  SpecularMode,
  TabItem,
  TabsJustify,
  TabsOrientation,
  TabsRadius,
  TabsSize,
  TabsVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { Kbd } from "../../shared/A11ySections";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  tabsJustifyOptions,
  tabsOrientationOptions,
  tabsRadiusOptions,
  tabsSizeOptions,
  tabsVariantOptions,
} from "../../shared/options";

// The pickers only offer the string presets; a bare `GlassVibrancy` /
// `GlassOpacity` would carry `| number`, which a MultiToggle value can't take.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const TabsPlayground: React.FC = () => {
  const [variant, setVariant] = useState<TabsVariant>("underline");
  const [size, setSize] = useState<TabsSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [orientation, setOrientation] = useState<TabsOrientation>("horizontal");
  const [justify, setJustify] = useState<TabsJustify>("start");
  const [fullWidth, setFullWidth] = useState(false);
  const [showDividers, setShowDividers] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [actionsAuto, setActionsAuto] = useState(true);
  const [actionsColor, setActionsColor] = useState<TrueColor>("blue");
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
  const [radius, setRadius] = useState<TabsRadius>("md");
  const [value, setValue] = useState("deployments");
  const [glassPanel, setGlassPanel] = useState(false);
  const [log, pushLog] = useEventLog();

  const isGlass = variant === "glass" || variant === "liquid-glass";

  const items: TabItem[] = [
    {
      id: "deployments",
      label: "Deployments",
      icon: "Run",
      description: "Active release rings",
      badge: "Live",
      actions: showActions
        ? [
            { id: "create", icon: "Add", label: "Create release" },
            { id: "sync", icon: "Reset", label: "Sync status" },
          ]
        : undefined,
      panel: (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Production
            </p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              v2.18.4
            </p>
            <p className="text-xs text-neutral-500">
              Healthy · deployed 3m ago
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Staging
            </p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              v2.19.0-rc1
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              2 checks queued
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "ViewGrid",
      description: "Usage and adoption",
      panel: (
        <div className="rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80">
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Active seats
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            247
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            +12 new this week
          </p>
        </div>
      ),
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: "Notification",
      badge: "2",
      description: "Incidents & reviews",
      panel: (
        <div className="space-y-2">
          {["Database latency spike", "API rate limit warning"].map((title) => (
            <div
              key={title}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/80"
            >
              <span className="font-medium text-neutral-900 dark:text-white">
                {title}
              </span>
              <span className="text-xs text-neutral-500">just now</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PlaygroundPanel
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
                      options={tabsVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as TabsVariant)}
                    />
                    <SelectControl
                      label="Size"
                      options={tabsSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as TabsSize)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={color}
                        onSelect={setColor}
                        defaultExpanded
                      />
                    </Control>
                    {showActions && (
                      <>
                        <ToggleRow
                          label="Actions follow tone"
                          checked={actionsAuto}
                          onChange={setActionsAuto}
                        />
                        {!actionsAuto && (
                          <Control label="Actions tone">
                            <ColorSwatches
                              selectable
                              size="sm"
                              value={actionsColor}
                              onSelect={setActionsColor}
                              defaultExpanded
                            />
                          </Control>
                        )}
                      </>
                    )}
                    <SelectControl
                      label="Orientation"
                      options={tabsOrientationOptions}
                      value={orientation}
                      onChange={(v) => setOrientation(v as TabsOrientation)}
                    />
                    <SelectControl
                      label="Justify"
                      options={tabsJustifyOptions}
                      value={justify}
                      onChange={(v) => setJustify(v as TabsJustify)}
                    />
                  </>
                ),
              },
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <SelectControl
                            label="Vibrancy"
                            options={glassVibrancyOptions}
                            value={vibrancy}
                            onChange={(v) => setVibrancy(v as VibrancyPreset)}
                          />
                          <SelectControl
                            label="Fill opacity"
                            options={glassOpacityOptions}
                            value={glassOpacity}
                            onChange={(v) =>
                              setGlassOpacity(v as OpacityPreset)
                            }
                          />
                          <SelectControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) => setSpecularMode(v as SpecularMode)}
                          />
                          <SelectControl
                            label="Radius"
                            options={tabsRadiusOptions}
                            value={radius}
                            onChange={(v) => setRadius(v as TabsRadius)}
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                    <ToggleRow
                      label="Dividers"
                      checked={showDividers}
                      onChange={setShowDividers}
                    />
                    <ToggleRow
                      label="Actions"
                      checked={showActions}
                      onChange={setShowActions}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — pick a tab, by keyboard if you like."
          />
          <p className="text-xs opacity-70">
            Contextual <strong>actions</strong> pin to whichever tab is active.
            <strong> Dividers</strong> only apply to underline and minimal. Tall
            panel content scrolls on the kit&rsquo;s own{" "}
            <strong>ScrollArea</strong> — the same overlay bars everywhere else,
            no browser-specific scrollbar styling.{" "}
            <strong>Actions follow the tone</strong> by default so they stay
            readable on glass and image hosts; untick to pin another tone. Focus
            lands on the selected tab and <Kbd>ArrowRight</Kbd>/
            <Kbd>ArrowLeft</Kbd> (or <Kbd>ArrowUp</Kbd>/<Kbd>ArrowDown</Kbd>{" "}
            when vertical) walk the list, skipping disabled tabs and wrapping;{" "}
            <Kbd>Home</Kbd>/<Kbd>End</Kbd> jump to the ends.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <Panel
            variant={glassPanel ? "glass" : "elevated"}
            padding="md"
            scrollable={false}
          >
            {/*
              The height must be definite HERE, not just on the Panel: the
              panel body wrapper is an auto-height block, and a vertical
              Tabs scrolls its own column only when its lane has a real
              height to be constrained by — otherwise the column grows and
              whatever contains the whole component scrolls instead.
            */}
            <div className="h-72">
              <Tabs
                items={items}
                value={value}
                onChange={(id) => {
                  setValue(id);
                  pushLog(`selected "${id}"`);
                }}
                variant={variant}
                size={size}
                color={color}
                orientation={orientation}
                justify={justify}
                fullWidth={fullWidth}
                actionsColor={actionsAuto ? "auto" : actionsColor}
                showDividers={showDividers}
                vibrancy={vibrancy}
                glassOpacity={glassOpacity}
                specularMode={isGlass ? specularMode : "none"}
                radius={radius}
              />
            </div>
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};

import React, { useState } from "react";
import { MultiToggle, Tabs } from "@cjlapao/ui-kit";
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
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  tabsJustifyOptions,
  tabsOrientationOptions,
  tabsRadiusOptions,
  tabsSizeOptions,
  tabsVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

// The pickers only offer the string presets; a bare `GlassVibrancy` /
// `GlassOpacity` would carry `| number`, which a MultiToggle value can't take.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const TabsPlayground: React.FC = () => {
  const [variant, setVariant] = useState<TabsVariant>("underline");
  const [size, setSize] = useState<TabsSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [orientation, setOrientation] =
    useState<TabsOrientation>("horizontal");
  const [justify, setJustify] = useState<TabsJustify>("start");
  const [fullWidth, setFullWidth] = useState(false);
  const [showDividers, setShowDividers] = useState(false);
  const [scrollFade, setScrollFade] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
  const [radius, setRadius] = useState<TabsRadius>("md");
  const [value, setValue] = useState("deployments");

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
            { id: "create", icon: "Add", label: "Create release", active: true },
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
          {["Database latency spike", "API rate limit warning"].map(
            (title) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/80"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {title}
                </span>
                <span className="text-xs text-neutral-500">just now</span>
              </div>
            ),
          )}
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
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={tabsSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as TabsSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={color}
                      onChange={(v) => setColor(v as TrueColor)}
                    />
                    <Control label="Orientation">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={tabsOrientationOptions}
                        value={orientation}
                        onChange={(v) => setOrientation(v as TabsOrientation)}
                      />
                    </Control>
                    <Control label="Justify">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={tabsJustifyOptions}
                        value={justify}
                        onChange={(v) => setJustify(v as TabsJustify)}
                      />
                    </Control>
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
                          <Control label="Vibrancy">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassVibrancyOptions}
                              value={vibrancy}
                              onChange={(v) => setVibrancy(v as VibrancyPreset)}
                            />
                          </Control>
                          <Control label="Fill opacity">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassOpacityOptions}
                              value={glassOpacity}
                              onChange={(v) => setGlassOpacity(v as OpacityPreset)}
                            />
                          </Control>
                          <Control label="Specular">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={panelSpecularOptions}
                              value={specularMode}
                              onChange={(v) => setSpecularMode(v as SpecularMode)}
                            />
                          </Control>
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
                    <ToggleRow label="Actions" checked={showActions} onChange={setShowActions} />
                    <ToggleRow label="Scroll fade" checked={scrollFade} onChange={setScrollFade} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Contextual <strong>actions</strong> pin to whichever tab is active.
            <strong> Dividers</strong> only apply to underline and minimal.
            The <strong>scroll fade</strong> softens panel content against the
            bar when it scrolls.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <div className={`flex h-72 flex-col ${GLASS_BACKDROP}`}>
            <Tabs
              items={items}
              value={value}
              onChange={(id) => setValue(id)}
              variant={variant}
              size={size}
              color={color}
              orientation={orientation}
              justify={justify}
              fullWidth={fullWidth}
              showDividers={showDividers}
              scrollFade={scrollFade}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              specularMode={isGlass ? specularMode : "none"}
              radius={radius}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>Active tab</Caption>
            <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
              {value}
            </code>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

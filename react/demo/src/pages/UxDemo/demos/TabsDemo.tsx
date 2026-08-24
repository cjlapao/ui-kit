import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { Tabs, MultiToggle, Toggle, Select, TRUE_COLORS } from "@cjlapao/ui-kit";
import type {
  TabsVariant,
  TabsSize,
  TabsOrientation,
  TabsJustify,
  TabItem,
  TrueColor,
  SpecularMode,
  TabsRadius,
} from "@cjlapao/ui-kit";
import {
  trueColorOptions,
  tabVariantOptions,
  tabSizeOptions,
  tabOrientationOptions,
  tabJustifyOptions,
  tabRadiusOptions,
  glassVibrancyOptions,
  glassOpacityOptions,
  panelSpecularOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

const TAB_VARIANTS: TabsVariant[] = [
  "underline",
  "soft",
  "pill",
  "segmented",
  "minimal",
  "glass",
  "liquid-glass",
];
const TAB_SIZES: TabsSize[] = ["sm", "md", "lg"];

// The demo's glass pickers only offer the string presets, so the state is typed
// narrowly (a bare `GlassVibrancy`/`GlassOpacity` would carry `| number`, which
// a `MultiToggle` value can't accept). Both are still assignable to the props.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

// A soft, low-contrast backdrop so the glass variants have something to blur
// even when the header's "Background image" toggle is off.
const GLASS_BACKDROP =
  "rounded-2xl bg-gradient-to-br from-sky-200/60 via-violet-200/50 to-amber-200/60 p-4 dark:from-sky-950/50 dark:via-violet-950/40 dark:to-amber-950/40";

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id,
    message: "You clicked something!",
    details: message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

// Reference items for the fixed specimens. None carry a `panel`, so each
// renders only its tab bar.
const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

// Shows every tab-bar feature at once: icon, description, badge, a disabled
// tab, and contextual actions on the (default-active) first tab.
const STATE_ITEMS: TabItem[] = [
  {
    id: "a",
    label: "Deploy",
    icon: "Run",
    description: "Active rings",
    badge: "Live",
    actions: [
      {
        id: "create",
        icon: "Add",
        label: "Create release",
        active: true,
        onClick: () => createUpdateToast("Create release"),
      },
      {
        id: "sync",
        icon: "Reset",
        label: "Sync status",
        onClick: () => createUpdateToast("Sync status"),
      },
    ],
  },
  { id: "b", label: "Analytics", icon: "ViewGrid", description: "Usage" },
  { id: "c", label: "Locked", icon: "Key", disabled: true, badge: "3" },
];

export const TabsDemo: React.FC = () => {
  const [tabsVariant, setTabsVariant] = useState<TabsVariant>("underline");
  const [tabsSize, setTabsSize] = useState<TabsSize>("md");
  const [tabsColor, setTabsColor] = useState<TrueColor>("blue");
  const [tabsOrientation, setTabsOrientation] =
    useState<TabsOrientation>("horizontal");
  const [tabsJustify, setTabsJustify] = useState<TabsJustify>("start");
  const [tabsFullWidth, setTabsFullWidth] = useState(false);
  const [tabsShowDividers, setTabsShowDividers] = useState(false);
  const [tabsShowActions, setTabsShowActions] = useState(true);
  const [tabsScrollFade, setTabsScrollFade] = useState(true);
  const [tabsVibrancy, setTabsVibrancy] = useState<VibrancyPreset>("medium");
  const [tabsGlassOpacity, setTabsGlassOpacity] =
    useState<OpacityPreset>("frosted");
  const [tabsSpecular, setTabsSpecular] = useState<SpecularMode>("none");
  const [tabsRadius, setTabsRadius] = useState<TabsRadius>("md");
  const [tabsValue, setTabsValue] = useState("deployments");

  const isGlass = tabsVariant === "glass" || tabsVariant === "liquid-glass";

  const liveItems = useMemo<TabItem[]>(() => {
    const actions = tabsShowActions
      ? [
          {
            id: "create-release",
            icon: "Add",
            label: "Create release",
            active: true,
            onClick: () => createUpdateToast("Create release"),
          },
          {
            id: "sync-status",
            icon: "Reset",
            label: "Sync status",
            onClick: () => createUpdateToast("Sync status"),
          },
        ]
      : undefined;

    return [
      {
        id: "deployments",
        label: "Deployments",
        icon: "Run",
        description: "Active release rings",
        badge: "Live",
        actions,
        panel: (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs font-semibold text-slate-500">Production</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                v2.18.4
              </p>
              <p className="text-xs text-slate-500">
                Healthy · deployed 3m ago
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs font-semibold text-slate-500">Staging</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                v2.19.0-rc1
              </p>
              <p className="text-xs text-amber-600">2 checks queued</p>
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
          <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-4">
            <p className="text-xs font-semibold text-slate-500">Active seats</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              247
            </p>
            <p className="text-xs text-emerald-600">+12 new this week</p>
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
          <div className="mt-3 space-y-2">
            {["Database latency spike", "API rate limit warning"].map((title) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white/80 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {title}
                </span>
                <span className="text-xs text-slate-500">just now</span>
              </div>
            ))}
          </div>
        ),
      },
    ];
  }, [tabsShowActions]);

  const stateToggle = (
    label: string,
    value: boolean,
    setter: (value: boolean) => void,
  ) => (
    <Toggle
      size="sm"
      label={label}
      checked={value}
      onChange={(event) => setter(event.target.checked)}
    />
  );

  return (
    <PlaygroundSection
      title="Tabs"
      label="[Tabs]"
      description="Switch between panes with contextual actions. Pick any of the full palette, choose a variant (including glass), and browse the fixed specimens for variant, size, tone, orientation, states and glass."
      controls={
        <div className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <Select
                size="sm"
                value={tabsColor}
                onChange={(event) =>
                  setTabsColor(event.target.value as TrueColor)
                }
                aria-label="Color"
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Variant
              </span>
              <Select
                size="sm"
                value={tabsVariant}
                onChange={(event) =>
                  setTabsVariant(event.target.value as TabsVariant)
                }
                aria-label="Variant"
              >
                {tabVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Size
              </span>
              <MultiToggle
                fullWidth
                options={tabSizeOptions}
                value={tabsSize}
                size="sm"
                onChange={(value) => setTabsSize(value as TabsSize)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Orientation
              </span>
              <MultiToggle
                fullWidth
                options={tabOrientationOptions}
                value={tabsOrientation}
                size="sm"
                onChange={(value) =>
                  setTabsOrientation(value as TabsOrientation)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Justify
            </span>
            <MultiToggle
              fullWidth
              options={tabJustifyOptions}
              value={tabsJustify}
              size="sm"
              onChange={(value) => setTabsJustify(value as TabsJustify)}
            />
          </div>
          {isGlass && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Vibrancy
                  </span>
                  <MultiToggle
                    fullWidth
                    options={glassVibrancyOptions}
                    value={tabsVibrancy}
                    size="sm"
                    onChange={(value) =>
                      setTabsVibrancy(value as VibrancyPreset)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Fill opacity
                  </span>
                  <MultiToggle
                    fullWidth
                    options={glassOpacityOptions}
                    value={tabsGlassOpacity}
                    size="sm"
                    onChange={(value) =>
                      setTabsGlassOpacity(value as OpacityPreset)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Specular
                </span>
                <MultiToggle
                  fullWidth
                  options={panelSpecularOptions}
                  value={tabsSpecular}
                  size="sm"
                  onChange={(value) => setTabsSpecular(value as SpecularMode)}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Radius
                </span>
                <Select
                  size="sm"
                  value={tabsRadius}
                  onChange={(event) =>
                    setTabsRadius(event.target.value as TabsRadius)
                  }
                  aria-label="Radius"
                >
                  {tabRadiusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {stateToggle("Full width", tabsFullWidth, setTabsFullWidth)}
            {stateToggle(
              "Dividers",
              tabsShowDividers,
              setTabsShowDividers,
            )}
            {stateToggle("Actions", tabsShowActions, setTabsShowActions)}
            {stateToggle("Scroll fade", tabsScrollFade, setTabsScrollFade)}
          </div>
        </div>
      }
      preview={
        <div className="space-y-4 p-2">
          {/* The only block the controls drive. It sits on a soft backdrop so the
              glass variants have something to blur. */}
          <div className="flex flex-col gap-2">
            <Caption>Current settings</Caption>
            <div className={GLASS_BACKDROP}>
              <Tabs
                items={liveItems}
                value={tabsValue}
                onChange={(id) => setTabsValue(id)}
                variant={tabsVariant}
                size={tabsSize}
                color={tabsColor}
                orientation={tabsOrientation}
                justify={tabsJustify}
                fullWidth={tabsFullWidth}
                showDividers={tabsShowDividers}
                scrollFade={tabsScrollFade}
                vibrancy={tabsVibrancy}
                glassOpacity={tabsGlassOpacity}
                specularMode={tabsSpecular}
                radius={tabsRadius}
              />
            </div>
          </div>

          {/* Fixed reference specimens — none of these move with the controls. */}
          <div className="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-col gap-3">
              <Caption>Every variant — fixed tone &amp; size</Caption>
              <div className={GLASS_BACKDROP}>
                <div className="grid gap-3 md:grid-cols-2">
                  {TAB_VARIANTS.map((each) => (
                    <div key={each} className="space-y-1.5">
                      <span className="text-xs opacity-60">{each}</span>
                      <Tabs
                        items={MINI_ITEMS}
                        variant={each}
                        color="blue"
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Size ladder — underline, fixed tone</Caption>
              <div className="flex flex-wrap items-end gap-4">
                {TAB_SIZES.map((each) => (
                  <div key={each} className="space-y-1.5">
                    <Tabs
                      items={TRIO_ITEMS}
                      variant="underline"
                      color="blue"
                      size={each}
                    />
                    <span className="text-[10px] uppercase tracking-wide opacity-60">
                      {each}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>
                All {TRUE_COLORS.length} tones — underline, fixed size
              </Caption>
              <div className="flex flex-wrap items-end gap-3">
                {TRUE_COLORS.map((each) => (
                  <div key={each} className="space-y-1.5">
                    <Tabs
                      items={MINI_ITEMS}
                      variant="underline"
                      color={each}
                      size="sm"
                    />
                    <span className="text-[10px] uppercase tracking-wide opacity-60">
                      {each}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Vertical orientation — soft, fixed tone</Caption>
              <div className="flex gap-4">
                <Tabs
                  items={TRIO_ITEMS}
                  variant="soft"
                  color="blue"
                  size="sm"
                  orientation="vertical"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>States — icon, description, badge, disabled, actions</Caption>
              <Tabs
                items={STATE_ITEMS}
                variant="soft"
                color="blue"
                size="md"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Glass — active tab carries a tone ring + specular</Caption>
              <div className={GLASS_BACKDROP}>
                <div className="flex flex-col gap-4">
                  <Tabs
                    items={TRIO_ITEMS}
                    variant="glass"
                    color="blue"
                    size="md"
                    specularMode="classic"
                  />
                  <Tabs
                    items={TRIO_ITEMS}
                    variant="liquid-glass"
                    color="indigo"
                    size="md"
                    specularMode="halo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

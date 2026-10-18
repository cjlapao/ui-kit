import React, { useState } from "react";
import { CustomIcon, MultiToggle, TimelinePanel } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  PanelSpecularMode,
  TimelinePanelCorner,
  TimelinePanelItem,
  TimelinePanelLoaderType,
  TimelinePanelPadding,
  TimelinePanelVariant,
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
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelLoaderTypeOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: TimelinePanelVariant[] = ["glass", "liquid-glass", "default"];

const ITEMS: TimelinePanelItem[] = [
  {
    id: "snap-a",
    icon: <CustomIcon icon="Save" customSize={16} />,
    iconBackground: true,
    title: "Snapshot A",
    subtitle: "2 days ago · 128 MB",
    isRoot: true,
    actions: [
      { label: "Revert", variant: "outline", color: "blue" },
      { label: "Delete", variant: "ghost", color: "rose", disabled: true },
    ],
    overflowActions: [
      { label: "Export", value: "export" },
      { label: "Rename", value: "rename" },
    ],
  },
  {
    id: "snap-b",
    icon: <CustomIcon icon="Image" customSize={16} />,
    iconBackground: true,
    title: "Snapshot B",
    subtitle: "1 day ago · 134 MB",
    depth: 1,
  },
  {
    id: "snap-c",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    title: "Snapshot C",
    subtitle: "Running · live environment",
    isCurrent: true,
  },
];

export const TimelinePanelPlayground: React.FC = () => {
  const [variant, setVariant] = useState<TimelinePanelVariant>("simple");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<TimelinePanelCorner>("none");
  const [padding, setPadding] = useState<TimelinePanelPadding>("sm");
  const [loaderType, setLoaderType] =
    useState<TimelinePanelLoaderType>("spinner");
  const [actionSize, setActionSize] = useState<ControlSize>("sm");
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [trunkDots, setTrunkDots] = useState(false);
  const [customLine, setCustomLine] = useState(false);
  const [hoverShadow, setHoverShadow] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundPanel
      controls={
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
                    onChange={(v) => setVariant(v as TimelinePanelVariant)}
                  />
                  <SelectControl
                    label="Tone"
                    options={trueColorOptions}
                    value={tone}
                    onChange={(v) => setTone(v as TrueColor)}
                  />
                  <SelectControl
                    label="Corner"
                    options={panelCornerOptions}
                    value={corner}
                    onChange={(v) => setCorner(v as TimelinePanelCorner)}
                  />
                  <SelectControl
                    label="Padding"
                    options={panelPaddingOptions}
                    value={padding}
                    onChange={(v) => setPadding(v as TimelinePanelPadding)}
                  />
                </>
              ),
            },
            {
              id: "content",
              title: "Content",
              controls: (
                <>
                  <Control label="Loader type">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={panelLoaderTypeOptions}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as TimelinePanelLoaderType)}
                    />
                  </Control>
                  <Control label="Action size">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={controlSizeOptions}
                      value={actionSize}
                      onChange={(v) => setActionSize(v as ControlSize)}
                    />
                  </Control>
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <div className="grid grid-cols-1 gap-2">
                  <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                  <ToggleRow label="Empty" checked={empty} onChange={setEmpty} />
                  <ToggleRow label="Animate" checked={animate} onChange={setAnimate} />
                  <ToggleRow
                    label="Trunk dots"
                    checked={trunkDots}
                    onChange={setTrunkDots}
                  />
                  <ToggleRow
                    label="Custom line color"
                    checked={customLine}
                    onChange={setCustomLine}
                  />
                  <ToggleRow
                    label="Hover shadow"
                    checked={hoverShadow}
                    onChange={setHoverShadow}
                  />
                </div>
              ),
            },
            ...(isGlass
              ? [
                  {
                    id: "glass",
                    title: "Glass",
                    controls: (
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
                    ),
                  },
                ]
              : []),
          ]}
        />
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <TimelinePanel
              title="Snapshots"
              headerAction={{
                label: "New Snapshot",
                variant: "solid",
                color: "blue",
                size: "sm",
                leadingIcon: <CustomIcon icon="Save" customSize={14} />,
              }}
              items={empty ? [] : ITEMS}
              variant={variant}
              tone={tone}
              corner={corner}
              padding={padding}
              lineColor={customLine ? "#8b5cf6" : undefined}
              showTrunkDots={trunkDots}
              actionSize={actionSize}
              animate={animate}
              loading={loading}
              loaderType={loaderType}
              emptyState="Nothing to show yet — create a snapshot."
              hoverShadow={hoverShadow}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              specularMode={specularMode}
            />
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

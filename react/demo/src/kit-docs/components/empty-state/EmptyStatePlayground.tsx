import React, { useState } from "react";
import {
  DEFAULT_SURFACE_CORNER,
  EmptyState,
  Input,
  MultiToggle,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  ButtonVariant,
  ControlSize,
  EmptyStateSize,
  EmptyStateVariant,
  GlassOpacity,
  GlassVibrancy,
  IconName,
  SpecularMode,
  SurfaceCorner,
  SurfacePadding,
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
  buttonVariantOptions,
  controlSizeOptions,
  emptyStateVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

const iconOptions = [
  { label: "Add", value: "Add" },
  { label: "Search", value: "Search" },
  { label: "Container", value: "Container" },
  { label: "CloudOff", value: "CloudOff" },
  { label: "Info", value: "Info" },
];

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: EmptyStateVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

export const EmptyStatePlayground: React.FC = () => {
  const [variant, setVariant] = useState<EmptyStateVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<SurfacePadding>("lg");
  const [size, setSize] = useState<EmptyStateSize>("md");
  const [icon, setIcon] = useState<IconName>("Add");
  const [title, setTitle] = useState("All caught up");
  const [subtitle, setSubtitle] = useState(
    "Connect your first workspace or import data to see activity here.",
  );
  const [dashed, setDashed] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [iconBackground, setIconBackground] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [actionIcon, setActionIcon] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [onGlass, setOnGlass] = useState(false);
  const [actionLabel, setActionLabel] = useState("Create workspace");
  const [actionVariant, setActionVariant] = useState<ButtonVariant>("soft");
  const [actionColor, setActionColor] = useState<TrueColor>("blue");
  const [actionSize, setActionSize] = useState<ControlSize | "auto">("auto");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(variant);
  const isPlain = variant === "plain";

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
                      options={emptyStateVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as EmptyStateVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    {!isPlain && (
                      <>
                        <SelectControl
                          label="Corner"
                          options={panelCornerOptions}
                          value={corner}
                          onChange={(v) => setCorner(v as SurfaceCorner)}
                        />
                        <Control label="Padding">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={panelPaddingOptions}
                            value={padding}
                            onChange={(v) => setPadding(v as SurfacePadding)}
                          />
                        </Control>
                      </>
                    )}
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as EmptyStateSize)}
                      />
                    </Control>
                    <Control label="Icon">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={iconOptions}
                        value={icon}
                        onChange={(v) => setIcon(v as IconName)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Dashed rule"
                      checked={dashed}
                      onChange={setDashed}
                    />
                    <ToggleRow
                      label="Icon"
                      checked={showIcon}
                      onChange={setShowIcon}
                    />
                    <ToggleRow
                      label="Icon disc"
                      checked={iconBackground}
                      onChange={setIconBackground}
                    />
                    <ToggleRow
                      label="Subtitle"
                      checked={showSubtitle}
                      onChange={setShowSubtitle}
                    />
                    <ToggleRow
                      label="Action"
                      checked={showAction}
                      onChange={setShowAction}
                    />
                    <ToggleRow
                      label="Action icon"
                      checked={actionIcon}
                      onChange={setActionIcon}
                    />
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={setOnGlass}
                    />
                  </div>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Title">
                      <Input
                        size="sm"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Control>
                    <Control label="Subtitle">
                      <Input
                        size="sm"
                        value={subtitle}
                        onChange={(event) => setSubtitle(event.target.value)}
                      />
                    </Control>
                  </>
                ),
              },
              ...(showAction
                ? [
                    {
                      id: "action",
                      title: "Action",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label="Action label">
                            <Input
                              size="sm"
                              value={actionLabel}
                              onChange={(event) =>
                                setActionLabel(event.target.value)
                              }
                            />
                          </Control>
                          <SelectControl
                            label="Action variant"
                            options={buttonVariantOptions}
                            value={actionVariant}
                            onChange={(v) =>
                              setActionVariant(v as ButtonVariant)
                            }
                          />
                          <SelectControl
                            label="Action colour"
                            options={trueColorOptions}
                            value={actionColor}
                            onChange={(v) => setActionColor(v as TrueColor)}
                          />
                          <Control label="Action size">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={[
                                { label: "Auto", value: "auto" },
                                ...controlSizeOptions,
                              ]}
                              value={actionSize}
                              onChange={(v) =>
                                setActionSize(v as ControlSize | "auto")
                              }
                            />
                          </Control>
                        </div>
                      ),
                    },
                  ]
                : []),
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label="Specular">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={panelSpecularOptions}
                              value={specularMode}
                              onChange={(v) =>
                                setSpecularMode(v as SpecularMode)
                              }
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
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Plain</strong> draws no card at all — for an empty state
            dropped inside a panel the app already owns. The{" "}
            <strong>dashed rule</strong> is an <code>outline</code>, not a
            border, so it sits on top of any variant without fighting the
            card&apos;s own edge. The action button defaults to the empty
            state&apos;s tone and to a size derived from <strong>size</strong>.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            <EmptyState
              variant={variant}
              tone={tone}
              corner={corner}
              padding={padding}
              size={size}
              dashed={dashed}
              icon={icon}
              showIcon={showIcon}
              iconBackground={iconBackground}
              title={title || undefined}
              subtitle={showSubtitle ? subtitle || undefined : undefined}
              fullWidth={fullWidth}
              className={fullWidth ? undefined : "mx-auto max-w-md"}
              actionLabel={showAction ? actionLabel || "Create item" : undefined}
              onAction={() => undefined}
              actionVariant={actionVariant}
              actionColor={actionColor}
              actionSize={actionSize === "auto" ? undefined : actionSize}
              actionLeadingIcon={actionIcon ? "Add" : undefined}
              glassOpacity={glassOpacity}
              vibrancy={vibrancy}
              specularMode={specularMode}
            />
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

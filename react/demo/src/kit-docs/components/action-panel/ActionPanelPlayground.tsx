import { useState } from "react";
import {
  ActionPanel,
  Badge,
  Button,
  ColorSwatches,
  Pill,
  type ActionPanelActionLayout,
  type ControlSize,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";

import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  panelCornerOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
} from "../../shared/options";

const actionLayoutOptions = [
  { label: "Inline", value: "inline" },
  { label: "Stacked", value: "stacked" },
];

export function ActionPanelPlayground() {
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [accentColor, setAccentColor] = useState<TrueColor>("amber");
  const [size, setSize] = useState<ControlSize>("sm");
  const [iconSize, setIconSize] = useState<ControlSize>("sm");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [actionLayout, setActionLayout] =
    useState<ActionPanelActionLayout>("inline");
  const [accent, setAccent] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showActions, setShowActions] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "surface",
              title: "Surface",
              controls: (
                <>
                  <SelectControl
                    label="Variant"
                    options={surfaceVariantOptions}
                    value={variant}
                    onChange={(value) => setVariant(value as SurfaceVariant)}
                  />
                  <Control label="Surface tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={tone}
                      onSelect={setTone}
                    />
                  </Control>
                  <Control label="Accent colour">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={accentColor}
                      onSelect={setAccentColor}
                    />
                  </Control>
                  <SelectControl
                    label="Padding"
                    options={panelPaddingOptions}
                    value={padding}
                    onChange={(value) => setPadding(value as SurfacePadding)}
                  />
                  <SelectControl
                    label="Corners"
                    options={panelCornerOptions}
                    value={corner}
                    onChange={(value) => setCorner(value as SurfaceCorner)}
                  />
                </>
              ),
            },
            {
              id: "content",
              title: "Content",
              controls: (
                <>
                  <SelectControl
                    label="Content size"
                    options={controlSizeOptions}
                    value={size}
                    onChange={(value) => setSize(value as ControlSize)}
                  />
                  <SelectControl
                    label="Icon size"
                    options={controlSizeOptions}
                    value={iconSize}
                    onChange={(value) => setIconSize(value as ControlSize)}
                  />
                  <SelectControl
                    label="Action layout"
                    options={actionLayoutOptions}
                    value={actionLayout}
                    onChange={(value) =>
                      setActionLayout(value as ActionPanelActionLayout)
                    }
                  />
                  <Control label="Visible regions">
                    <div className="space-y-1.5">
                      <ToggleRow
                        label="Accent edge"
                        checked={accent}
                        onChange={setAccent}
                      />
                      <ToggleRow
                        label="Icon"
                        checked={showIcon}
                        onChange={setShowIcon}
                      />
                      <ToggleRow
                        label="Title"
                        checked={showTitle}
                        onChange={setShowTitle}
                      />
                      <ToggleRow
                        label="Subtitle"
                        checked={showSubtitle}
                        onChange={setShowSubtitle}
                      />
                      <ToggleRow
                        label="Description"
                        checked={showDescription}
                        onChange={setShowDescription}
                      />
                      <ToggleRow
                        label="Actions"
                        checked={showActions}
                        onChange={setShowActions}
                      />
                    </div>
                  </Control>
                </>
              ),
            },
          ]}
        />
      }
      previewClassName="items-center"
      preview={
        <ActionPanel
          variant={variant}
          tone={tone}
          accent={accent}
          accentColor={accentColor}
          size={size}
          iconSize={iconSize}
          padding={padding}
          corner={corner}
          icon={showIcon ? "Warning" : undefined}
          title={
            showTitle ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge size="sm" tone={accentColor}>
                  Gate awaiting signoff
                </Badge>
                <span>qa-regression-v2</span>
                <span className="font-mono text-xs font-normal text-neutral-500 dark:text-neutral-400">
                  · Step 3/4
                </span>
              </div>
            ) : undefined
          }
          subtitle={
            showSubtitle ? "Review required before dispatch" : undefined
          }
          description={
            showDescription ? (
              <span>
                Agent <strong>surveyor</strong> proposed{" "}
                <Pill size="xs">+18 lines</Pill> in <code>SURVEY.md</code>.
              </span>
            ) : undefined
          }
          actions={
            showActions
              ? [
                  <Button
                    key="inspect"
                    size={size}
                    variant="soft"
                    leadingIcon="File"
                  >
                    Inspect diff
                  </Button>,
                  <Button
                    key="review"
                    size={size}
                    color={accentColor}
                    leadingIcon="Verified"
                  >
                    Review &amp; sign off
                  </Button>,
                ]
              : undefined
          }
          actionLayout={actionLayout}
        />
      }
    />
  );
}

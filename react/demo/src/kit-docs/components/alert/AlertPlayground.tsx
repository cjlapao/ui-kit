import React, { useState } from "react";
import {
  Alert,
  Button,
  Input,
  MultiToggle,
  Panel,
  Textarea,
} from "@cjlapao/ui-kit";
import type {
  AlertIconAlign,
  AlertIntent,
  AlertVariant,
  ControlSize,
  SpecularMode,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  alertIconAlignOptions,
  alertIconSizeOptions,
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

const DEFAULT_CORNER: SurfaceCorner = "rounded-md";

/** Padding for the alignment demo — a short callout cannot show the difference. */
const LONG_BODY =
  "Rollout is held at 12% of traffic. The error budget for this window is " +
  "spent, so the next attempt needs either a fix or an explicit override from " +
  "someone on the release rota. Nothing is being served from the new build.";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

// The pickers only offer the string presets; a bare `GlassVibrancy` /
// `GlassOpacity` would carry `| number`, which a MultiToggle value can't take.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const AlertPlayground: React.FC = () => {
  const [intent, setIntent] = useState<AlertIntent>("danger");
  const [variant, setVariant] = useState<AlertVariant>("subtle");
  const [size, setSize] = useState<ControlSize>("md");
  const [corner, setCorner] = useState<SurfaceCorner>(DEFAULT_CORNER);
  const [showIcon, setShowIcon] = useState(true);
  const [iconSize, setIconSize] = useState<ControlSize | "auto">("auto");
  const [iconAlign, setIconAlign] = useState<AlertIconAlign>("top");
  const [overrideTone, setOverrideTone] = useState(false);
  const [color, setColor] = useState<TrueColor>("violet");
  const [title, setTitle] = useState("Deployment paused");
  const [description, setDescription] = useState(
    "We paused the rollout while we investigate a spike in error rates.",
  );
  const [longBody, setLongBody] = useState(false);
  const [dismissible, setDismissible] = useState(false);
  const [withActions, setWithActions] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [open, setOpen] = useState(true);
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Intent">
            <MultiToggle
              fullWidth
              size="sm"
              options={alertIntentOptions}
              value={intent}
              onChange={(value) => setIntent(value as AlertIntent)}
            />
          </Control>
          <SelectControl
            label="Variant"
            options={alertVariantOptions}
            value={variant}
            onChange={(value) => setVariant(value as AlertVariant)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Control label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as ControlSize)}
              />
            </Control>
            <SelectControl
              label="Corner"
              options={panelCornerOptions}
              value={corner}
              onChange={(value) => setCorner(value as SurfaceCorner)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectControl
              label="Icon size"
              options={alertIconSizeOptions}
              value={iconSize}
              onChange={(value) => setIconSize(value as ControlSize | "auto")}
            />
            <Control label="Icon alignment">
              <MultiToggle
                fullWidth
                size="sm"
                options={alertIconAlignOptions}
                value={iconAlign}
                onChange={(value) => setIconAlign(value as AlertIconAlign)}
              />
            </Control>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Override the intent's tone"
              checked={overrideTone}
              onChange={setOverrideTone}
            />
          </div>
          {overrideTone && (
            <SelectControl
              label="Colour"
              options={trueColorOptions}
              value={color}
              onChange={(value) => setColor(value as TrueColor)}
            />
          )}
          <Control label="Title">
            <Input
              size="sm"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Control>
          <Control label="Description">
            <Textarea
              size="sm"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Control>
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Icon" checked={showIcon} onChange={setShowIcon} />
            <ToggleRow
              label="Dismissible"
              checked={dismissible}
              onChange={(checked) => {
                setDismissible(checked);
                setOpen(true);
              }}
            />
            <ToggleRow label="Long body" checked={longBody} onChange={setLongBody} />
            <ToggleRow label="Actions" checked={withActions} onChange={setWithActions} />
            <ToggleRow
              label="On a glass panel"
              checked={onGlass}
              onChange={setOnGlass}
            />
          </div>
          {dismissible && !open && (
            <Button
              size="xs"
              variant="outline"
              color="blue"
              onClick={() => setOpen(true)}
            >
              Reset the alert
            </Button>
          )}
          {isGlass && (
            <div className="flex flex-col gap-3">
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) => setSpecularMode(value as SpecularMode)}
                />
              </Control>
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy}
                  onChange={(value) => setVibrancy(value as VibrancyPreset)}
                />
              </Control>
              <Control label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity}
                  onChange={(value) => setGlassOpacity(value as OpacityPreset)}
                />
              </Control>
            </div>
          )}
          <p className="text-xs opacity-70">
            <strong>Intent</strong> is the semantic axis — it chooses the tone,
            the default icon and whether the callout is announced{" "}
            <code>assertive</code> (interrupting the reader, for a failure) or{" "}
            <code>polite</code>. Turn on the override to reach the full
            21-colour scale instead.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? (overrideTone ? color : "blue") : "neutral"}
            padding="md"
          >
            <div className="flex flex-col gap-3">
              <Alert
                intent={intent}
                variant={variant}
                size={size}
                corner={corner}
                iconAlign={iconAlign}
                iconSize={iconSize === "auto" ? undefined : iconSize}
                color={overrideTone ? color : undefined}
                glassOpacity={glassOpacity}
                vibrancy={vibrancy}
                specularMode={isGlass ? specularMode : "none"}
                title={title || undefined}
                description={
                  longBody ? `${description} ${LONG_BODY}` : description || undefined
                }
                icon={showIcon ? undefined : false}
                dismissible={dismissible}
                open={dismissible ? open : undefined}
                onDismiss={dismissible ? () => setOpen(false) : undefined}
                actions={
                  withActions ? (
                    <div className="flex flex-wrap gap-2">
                      <Button size="xs" variant="soft" color="blue">
                        Resume rollout
                      </Button>
                      <Button size="xs" variant="ghost" color="slate">
                        Snooze
                      </Button>
                    </div>
                  ) : undefined
                }
              />
              {dismissible && (
                <span className="text-xs opacity-60">
                  Dismiss it — it hides itself with no state on your side.
                </span>
              )}
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

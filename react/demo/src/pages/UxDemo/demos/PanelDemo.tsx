import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { Panel, MultiToggle, Toggle, Badge, Select } from "@cjlapao/ui-kit";
import type {
  ButtonVariant,
  ButtonWeight,
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  PanelAction,
  PanelActionLayout,
  PanelCorner,
  PanelDecoration,
  PanelLoaderType,
  PanelMediaPlacement,
  PanelPadding,
  PanelSpecularMode,
  PanelTone,
  PanelVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { DEFAULT_SURFACE_CORNER } from "@cjlapao/ui-kit";
import {
  buttonVariantAllOptions,
  buttonWeightOptions,
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelActionLayoutOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelLoadingTypeOptions,
  panelMediaPlacementOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { GLOBAL_NOTIFICATION_CHANNEL } from "../constants";
import { v4 as uuidv4 } from "uuid";
import logo from "@assets/images/logo.png";

const createUpdateToast = (message?: string) => {
  notificationService.createNotification({
    id: uuidv4(),
    message: `You clicked something!`,
    details:
      message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

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

export const PanelDemo: React.FC = () => {
  // Panel surface
  const [panelVariant, setPanelVariant] = useState<PanelVariant>("elevated");
  const [panelTone, setPanelTone] = useState<PanelTone>("neutral");
  // Starts on the Panel's own default so the playground opens showing what a
  // `<Panel>` with no `corner` actually looks like.
  const [panelCorner, setPanelCorner] = useState<PanelCorner>(
    DEFAULT_SURFACE_CORNER,
  );
  const [panelPadding, setPanelPadding] = useState<PanelPadding>("md");
  const [panelDecoration, setPanelDecoration] =
    useState<PanelDecoration>("none");

  // Content
  const [panelHasMedia, setPanelHasMedia] = useState(true);
  const [panelMediaPlacement, setPanelMediaPlacement] =
    useState<PanelMediaPlacement>("top");
  const [panelHasBadge, setPanelHasBadge] = useState(true);
  const [panelHasActions, setPanelHasActions] = useState(true);
  const [panelActionLayout, setPanelActionLayout] =
    useState<PanelActionLayout>("inline");

  // Action buttons — the Panel renders these through `Button`, so every
  // Button knob is worth exposing here.
  const [actionVariant, setActionVariant] = useState<ButtonVariant>("solid");
  const [actionColor, setActionColor] = useState<TrueColor>("blue");
  const [actionSize, setActionSize] = useState<ControlSize>("md");
  const [actionWeight, setActionWeight] = useState<ButtonWeight>("medium");
  const [actionIcons, setActionIcons] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDisabled, setActionDisabled] = useState(false);

  // State
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelLoadingType, setPanelLoadingType] =
    useState<PanelLoaderType>("spinner");
  const [panelFullWidth, setPanelFullWidth] = useState(false);
  const [panelHoverShadow, setPanelHoverShadow] = useState(false);
  const [panelHoverable, setPanelHoverable] = useState(false);
  const [panelDisabled, setPanelDisabled] = useState(false);

  // Glass
  const [glassVibrancy, setGlassVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(panelVariant);

  const actionDefaults = {
    variant: actionVariant,
    size: actionSize,
    weight: actionWeight,
    loading: actionLoading,
    disabled: actionDisabled,
  };

  const panelActions: PanelAction[] = panelHasActions
    ? [
        {
          ...actionDefaults,
          label: "Open",
          color: actionColor,
          leadingIcon: actionIcons ? "Check" : undefined,
          onClick: () => createUpdateToast(),
        },
        {
          ...actionDefaults,
          label: "Close",
          color: "rose",
          trailingIcon: actionIcons ? "Close" : undefined,
          onClick: () => createUpdateToast(),
        },
      ]
    : [];

  const sharedPanelProps = {
    tone: panelTone,
    variant: panelVariant,
    corner: panelCorner,
    padding: panelPadding,
    decoration: panelDecoration,
    vibrancy: glassVibrancy,
    glassOpacity: glassOpacity,
    specularMode: specularMode,
    actionLayout: panelActionLayout,
    actions: panelActions,
    hoverShadow: panelHoverShadow,
    hoverable: panelHoverable,
    loading: panelLoading,
    loaderType: panelLoadingType,
  };

  const preview = (
    <div className="space-y-4 p-6">
      <Panel
        {...sharedPanelProps}
        title={`${panelVariant} panel`}
        subtitle="This is a subtitle"
        description="And a description, which uses the surface's muted tone."
        media={
          panelHasMedia ? (
            <img src={logo} alt="logo" className="w-25" />
          ) : null
        }
        mediaPlacement={panelMediaPlacement}
        badge={panelHasBadge ? <Badge count={10} tone={panelTone} /> : null}
        disabled={panelDisabled}
        loaderProgress={30}
        loaderTitle="Loading..."
        loaderMessage="Getting things ready..."
        fullWidth={panelFullWidth}
      >
        This Panel uses the {panelVariant} variant, {panelCorner} corners and{" "}
        {panelPadding} padding.
      </Panel>

      {!panelFullWidth && (
        <Panel
          {...sharedPanelProps}
          title="Secondary Panel"
          subtitle="Same settings, no media"
          loaderProgress={45}
        >
          A second card, so corner and padding changes are easy to compare.
        </Panel>
      )}
    </div>
  );

  const toggles = [
    { label: "Media", value: panelHasMedia, setter: setPanelHasMedia },
    { label: "Badge", value: panelHasBadge, setter: setPanelHasBadge },
    { label: "Actions", value: panelHasActions, setter: setPanelHasActions },
    { label: "Loading", value: panelLoading, setter: setPanelLoading },
    { label: "Full width", value: panelFullWidth, setter: setPanelFullWidth },
    { label: "Disabled", value: panelDisabled, setter: setPanelDisabled },
    {
      label: "Hover shadow",
      value: panelHoverShadow,
      setter: setPanelHoverShadow,
    },
    { label: "Hoverable", value: panelHoverable, setter: setPanelHoverable },
  ];

  return (
    <PlaygroundSection
      title="Panels"
      label="[Panel]"
      description="Card layout with media, badges, actions, and loaders."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Eight variants is past what a MultiToggle can show legibly. */}
            <Field label="Variant">
              <Select
                value={panelVariant}
                onChange={(event) =>
                  setPanelVariant(event.target.value as PanelVariant)
                }
              >
                {panelVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={panelTone}
                onChange={(event) =>
                  setPanelTone(event.target.value as PanelTone)
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
            <Field label="Corner">
              <Select
                value={panelCorner}
                onChange={(event) =>
                  setPanelCorner(event.target.value as PanelCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={panelPadding}
                onChange={(value) => setPanelPadding(value as PanelPadding)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Media placement">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelMediaPlacementOptions}
                value={panelMediaPlacement}
                onChange={(value) =>
                  setPanelMediaPlacement(value as PanelMediaPlacement)
                }
              />
            </Field>
            <Field label="Decoration">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelDecorationOptions}
                value={panelDecoration}
                onChange={(value) =>
                  setPanelDecoration(value as PanelDecoration)
                }
              />
            </Field>
            <Field label="Loader type">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelLoadingTypeOptions}
                value={panelLoadingType}
                onChange={(value) =>
                  setPanelLoadingType(value as PanelLoaderType)
                }
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {toggles.map((option) => (
              <Toggle
                key={option.label}
                size="sm"
                label={option.label}
                checked={option.value}
                onChange={(event) => option.setter(event.target.checked)}
              />
            ))}
          </div>

          {/* ── Action buttons ─────────────────────────────────────────── */}
          <div className="space-y-3 rounded-xl border border-black/10 p-3 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                Action buttons
              </span>
              <Toggle
                size="sm"
                label="Show"
                checked={panelHasActions}
                onChange={(event) => setPanelHasActions(event.target.checked)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Button variant">
                <Select
                  value={actionVariant}
                  onChange={(event) =>
                    setActionVariant(event.target.value as ButtonVariant)
                  }
                >
                  {buttonVariantAllOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Button color">
                <Select
                  value={actionColor}
                  onChange={(event) =>
                    setActionColor(event.target.value as TrueColor)
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
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Button size">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={controlSizeOptions}
                  value={actionSize}
                  onChange={(value) => setActionSize(value as ControlSize)}
                />
              </Field>
              <Field label="Weight">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={buttonWeightOptions}
                  value={actionWeight}
                  onChange={(value) => setActionWeight(value as ButtonWeight)}
                />
              </Field>
              <Field label="Layout">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelActionLayoutOptions}
                  value={panelActionLayout}
                  onChange={(value) =>
                    setPanelActionLayout(value as PanelActionLayout)
                  }
                />
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Toggle
                size="sm"
                label="Icons"
                checked={actionIcons}
                onChange={(event) => setActionIcons(event.target.checked)}
              />
              <Toggle
                size="sm"
                label="Loading"
                checked={actionLoading}
                onChange={(event) => setActionLoading(event.target.checked)}
              />
              <Toggle
                size="sm"
                label="Disabled"
                checked={actionDisabled}
                onChange={(event) => setActionDisabled(event.target.checked)}
              />
            </div>
          </div>

          {/* ── Glass ──────────────────────────────────────────────────── */}
          {/* Shown for every see-through variant, not just liquid-glass —
              `default` and `glass` take a specular highlight too. */}
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
                  value={glassVibrancy as string}
                  onChange={(value) =>
                    setGlassVibrancy(value as GlassVibrancy)
                  }
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
        </div>
      }
      preview={preview}
    />
  );
};

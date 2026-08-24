import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  CollapsiblePanel,
  MultiToggle,
  Select,
  Toggle,
  Button,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelTone,
  PanelVariant,
} from "@cjlapao/ui-kit";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { GLOBAL_NOTIFICATION_CHANNEL } from "../constants";

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

const LOG_LINES = Array.from(
  { length: 14 },
  (_, index) =>
    `[12:0${index % 10}:31] step ${index + 1} — pulling layer sha256:${(
      index * 7919
    )
      .toString(16)
      .padStart(6, "0")}`,
);

export const CollapsiblePanelDemo: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<PanelTone>("neutral");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("md");
  const [expanded, setExpanded] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [withActions, setWithActions] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [longContent, setLongContent] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

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

  const isGlass = GLASS_VARIANTS.includes(variant);

  const shared = {
    tone,
    variant,
    corner,
    padding,
    disabled,
    glassOpacity,
    vibrancy,
    specularMode,
    actions: withActions ? (
      <Button
        size="xs"
        variant="ghost"
        color={tone}
        onClick={() => createUpdateToast("Refresh clicked")}
      >
        Refresh
      </Button>
    ) : undefined,
  };

  return (
    <PlaygroundSection
      title="Collapsible Panel"
      label="[CollapsiblePanel]"
      description="Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as PanelVariant)
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
                value={tone}
                onChange={(event) => setTone(event.target.value as PanelTone)}
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
                value={corner}
                onChange={(event) =>
                  setCorner(event.target.value as PanelCorner)
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
                value={padding}
                onChange={(value) => setPadding(value as PanelPadding)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Expanded"
              checked={expanded}
              onChange={(event) => setExpanded(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Header action"
              checked={withActions}
              onChange={(event) => setWithActions(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Subtitle"
              checked={withSubtitle}
              onChange={(event) => setWithSubtitle(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Long content"
              checked={longContent}
              onChange={(event) => setLongContent(event.target.checked)}
            />
          </div>

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
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
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

          <p className="text-xs opacity-70">
            <strong>Long content</strong> exceeds <code>contentMaxHeight</code>,
            so the body scrolls instead of growing. The second panel is
            uncontrolled — two on one page also checks that their ids stay
            distinct.
          </p>
        </div>
      }
      preview={
        <div className="space-y-4 p-4">
          <CollapsiblePanel
            {...shared}
            title="Deployment logs"
            subtitle={withSubtitle ? "Last updated 5 minutes ago" : undefined}
            expanded={expanded}
            onToggle={setExpanded}
          >
            {longContent ? (
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {LOG_LINES.join("\n")}
              </pre>
            ) : (
              <p>
                Showing the latest deployment output. Errors and status logs
                appear here while we run automated checks against the new
                release.
              </p>
            )}
          </CollapsiblePanel>

          {/* Uncontrolled, so the two can be open independently. */}
          <CollapsiblePanel
            {...shared}
            title="Build configuration"
            subtitle={withSubtitle ? "3 overrides" : undefined}
            defaultExpanded={false}
          >
            <p>
              An uncontrolled panel, driven by <code>defaultExpanded</code>.
            </p>
          </CollapsiblePanel>
        </div>
      }
    />
  );
};

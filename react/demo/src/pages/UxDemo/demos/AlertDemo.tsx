import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Alert,
  Button,
  Input,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
  ALERT_INTENTS,
  ALERT_INTENT_CONFIG,
} from "@cjlapao/ui-kit";
import type {
  AlertIconAlign,
  AlertIntent,
  AlertSize,
  AlertVariant,
  GlassOpacity,
  GlassVibrancy,
  ControlSize,
  SpecularMode,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  alertIconAlignOptions,
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../constants";

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

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

/** Padding for the alignment demo — a short callout cannot show the difference. */
const LONG_BODY =
  "Rollout is held at 12% of traffic. The error budget for this window is " +
  "spent, so the next attempt needs either a fix or an explicit override from " +
  "someone on the release rota. Nothing is being served from the new build.";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: AlertVariant[] = ["glass", "liquid-glass"];

export const AlertDemo: React.FC = () => {
  const [intent, setIntent] = useState<AlertIntent>("danger");
  const [variant, setVariant] = useState<AlertVariant>("subtle");
  const [size, setSize] = useState<AlertSize>("md");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [overrideTone, setOverrideTone] = useState(false);
  const [color, setColor] = useState<TrueColor>("violet");

  const [title, setTitle] = useState("Deployment paused");
  const [description, setDescription] = useState(
    "We paused the rollout while we investigate a spike in error rates.",
  );
  const [showIcon, setShowIcon] = useState(true);
  const [iconSize, setIconSize] = useState<ControlSize | "auto">("auto");
  const [iconAlign, setIconAlign] = useState<AlertIconAlign>("top");
  const [longBody, setLongBody] = useState(false);
  const [dismissible, setDismissible] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [onGlass, setOnGlass] = useState(false);

  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");

  /** Bumped to remount the dismissible alert after it hides itself. */
  const [dismissKey, setDismissKey] = useState(0);

  const isGlass = GLASS_VARIANTS.includes(variant);

  const shared = {
    variant,
    size,
    corner,
    iconAlign,
    iconSize: iconSize === "auto" ? undefined : iconSize,
    color: overrideTone ? color : undefined,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  const actions = showActions ? (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="soft" color="blue">
        Resume rollout
      </Button>
      <Button size="sm" variant="ghost" color="slate">
        Snooze
      </Button>
    </div>
  ) : null;

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Alert
          key={dismissKey}
          {...shared}
          intent={intent}
          title={title || undefined}
          description={
            longBody
              ? `${description} ${LONG_BODY}`
              : description || undefined
          }
          icon={showIcon ? undefined : false}
          dismissible={dismissible}
          onDismiss={() =>
            window.setTimeout(() => setDismissKey((key) => key + 1), 900)
          }
          actions={actions}
        />
        {dismissible && (
          <span className="text-xs opacity-60">
            Dismiss it — it hides itself with no state on your side, and comes
            back here after a second.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every intent — tone, icon and politeness together</Caption>
        <div className="space-y-2">
          {ALERT_INTENTS.map((each) => (
            <Alert
              key={each}
              {...shared}
              color={overrideTone ? color : undefined}
              intent={each}
              title={each}
              description={`tone ${ALERT_INTENT_CONFIG[each].tone} · announced ${ALERT_INTENT_CONFIG[each].live}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant</Caption>
        <div className="space-y-2">
          {alertVariantOptions.map((each) => (
            <Alert
              key={each.value}
              {...shared}
              variant={each.value as AlertVariant}
              intent={intent}
              title={each.label}
              description="The quick brown fox jumps over the lazy dog."
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Body-only — no title, content as children</Caption>
        <Alert {...shared} intent={intent}>
          A callout with no title at all. This copy comes through{" "}
          <code>children</code>, which the component used to accept and drop on
          the floor.
        </Alert>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Alerts"
      label="[Alert]"
      description="Contextual callouts. An intent picks the tone, the icon and how a screen reader announces it; the full TrueColor scale is still available when you want a specific colour."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Intent">
              <MultiToggle
                fullWidth
                size="sm"
                options={alertIntentOptions}
                value={intent}
                onChange={(value) => setIntent(value as AlertIntent)}
              />
            </Field>
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as AlertVariant)
                }
              >
                {alertVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as AlertSize)}
              />
            </Field>
            <Field label="Corner">
              <Select
                value={corner}
                onChange={(event) =>
                  setCorner(event.target.value as SurfaceCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Icon size">
              <MultiToggle
                fullWidth
                size="sm"
                options={[{ label: "Auto", value: "auto" }, ...controlSizeOptions]}
                value={iconSize}
                onChange={(value) => setIconSize(value as ControlSize | "auto")}
              />
            </Field>
            <Field label="Icon alignment">
              <MultiToggle
                fullWidth
                size="sm"
                options={alertIconAlignOptions}
                value={iconAlign}
                onChange={(value) => setIconAlign(value as AlertIconAlign)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Override the intent's tone">
              <Toggle
                size="sm"
                label={overrideTone ? "Using colour" : "Using intent"}
                checked={overrideTone}
                onChange={(event) => setOverrideTone(event.target.checked)}
              />
            </Field>
            <Field label="Colour">
              <Select
                value={color}
                disabled={!overrideTone}
                onChange={(event) => setColor(event.target.value as TrueColor)}
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
            <Field label="Title">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <Textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Toggle
              size="sm"
              label="Icon"
              checked={showIcon}
              onChange={(event) => setShowIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Dismissible"
              checked={dismissible}
              onChange={(event) => setDismissible(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Long body"
              checked={longBody}
              onChange={(event) => setLongBody(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Actions"
              checked={showActions}
              onChange={(event) => setShowActions(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
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
                  onChange={(value) => setSpecularMode(value as SpecularMode)}
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
            <strong>Intent</strong> is the semantic axis — it chooses the tone,
            the default icon and whether the callout is announced{" "}
            <code>assertive</code> (interrupting the reader, for a failure) or{" "}
            <code>polite</code>. Turn on the override to reach the full
            21-colour scale instead. <strong>Solid</strong> and the glass pair
            both keep their copy legible on their own fill.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? (overrideTone ? color : "blue") : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};

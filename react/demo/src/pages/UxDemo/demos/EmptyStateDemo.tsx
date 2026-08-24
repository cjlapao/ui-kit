import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Button,
  EmptyState,
  Input,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
} from "@cjlapao/ui-kit";
import type {
  ButtonColor,
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
  buttonVariantAllOptions,
  controlSizeOptions,
  emptyStateVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
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

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: EmptyStateVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const iconOptions: { label: string; value: IconName }[] = [
  { label: "Add", value: "Add" },
  { label: "Search", value: "Search" },
  { label: "Container", value: "Container" },
  { label: "CloudOff", value: "CloudOff" },
  { label: "Info", value: "Info" },
];

export const EmptyStateDemo: React.FC = () => {
  const [variant, setVariant] = useState<EmptyStateVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [padding, setPadding] = useState<SurfacePadding>("lg");
  const [size, setSize] = useState<EmptyStateSize>("md");

  const [title, setTitle] = useState("All caught up");
  const [subtitle, setSubtitle] = useState(
    "Connect your first workspace or import data to see activity here.",
  );
  const [icon, setIcon] = useState<IconName>("Add");

  const [dashed, setDashed] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [iconBackground, setIconBackground] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [fullWidth, setFullWidth] = useState(true);
  const [onGlass, setOnGlass] = useState(false);

  const [actionLabel, setActionLabel] = useState("Create workspace");
  const [actionVariant, setActionVariant] = useState<ButtonVariant>("soft");
  const [actionColor, setActionColor] = useState<ButtonColor>("blue");
  const [actionSize, setActionSize] = useState<ControlSize | "auto">("auto");
  const [actionIcon, setActionIcon] = useState(false);

  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(variant);
  const isPlain = variant === "plain";

  const shared = {
    variant,
    tone,
    corner,
    padding,
    size,
    dashed,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  const preview = (
    <div className="space-y-6">
      <EmptyState
        {...shared}
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
      />

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {controlSizeOptions.map((option) => (
            <EmptyState
              key={option.value}
              {...shared}
              size={option.value as EmptyStateSize}
              icon={icon}
              title={`Size ${option.label}`}
              subtitle="Icon, type and the action button move together."
              actionLabel="Create"
              onAction={() => undefined}
              fullWidth
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Custom footer instead of the generated button</Caption>
        <EmptyState
          {...shared}
          icon="Search"
          title="No results for “orchestrator”"
          subtitle="Try a broader term, or clear the filters you have applied."
          fullWidth
          actions={
            <>
              <Button size="sm" variant="soft" color={tone}>
                Clear filters
              </Button>
              <Button size="sm" variant="ghost" color="slate">
                Browse all
              </Button>
            </>
          }
        />
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Empty States"
      label="[EmptyState]"
      description="The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus a dashed rule for a slot waiting to be filled."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as EmptyStateVariant)
                }
              >
                {emptyStateVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
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
                disabled={isPlain}
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
            <Field label="Padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={padding}
                onChange={(value) => setPadding(value as SurfacePadding)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as EmptyStateSize)}
              />
            </Field>
            <Field label="Icon">
              <MultiToggle
                fullWidth
                size="sm"
                options={iconOptions}
                value={icon}
                onChange={(value) => setIcon(value as IconName)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field label="Subtitle">
              <Textarea
                rows={3}
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Toggle
              size="sm"
              label="Dashed rule"
              checked={dashed}
              onChange={(event) => setDashed(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Icon"
              checked={showIcon}
              onChange={(event) => setShowIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Icon disc"
              checked={iconBackground}
              onChange={(event) => setIconBackground(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Subtitle"
              checked={showSubtitle}
              onChange={(event) => setShowSubtitle(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Action"
              checked={showAction}
              onChange={(event) => setShowAction(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Action icon"
              checked={actionIcon}
              onChange={(event) => setActionIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Full width"
              checked={fullWidth}
              onChange={(event) => setFullWidth(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
            <Field label="Action label">
              <Input
                value={actionLabel}
                onChange={(event) => setActionLabel(event.target.value)}
              />
            </Field>
            <Field label="Action variant">
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
            <Field label="Action size">
              <MultiToggle
                fullWidth
                size="sm"
                options={[
                  { label: "Auto", value: "auto" },
                  ...controlSizeOptions,
                ]}
                value={actionSize}
                onChange={(value) =>
                  setActionSize(value as ControlSize | "auto")
                }
              />
            </Field>
            <Field label="Action colour">
              <Select
                value={actionColor}
                onChange={(event) =>
                  setActionColor(event.target.value as ButtonColor)
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
            <strong>Plain</strong> draws no card at all — for an empty state
            dropped inside a panel the app already owns. The{" "}
            <strong>dashed rule</strong> is an <code>outline</code>, not a
            border, so it sits on top of any variant without having to be
            reconciled against the card&apos;s own edge. The action button
            defaults to the empty state&apos;s tone and to a size derived from{" "}
            <strong>size</strong>.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};

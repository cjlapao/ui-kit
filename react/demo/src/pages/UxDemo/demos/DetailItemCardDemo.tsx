import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  DetailItemCard,
  Input,
  MultiToggle,
  Panel,
  Pill,
  Select,
  Toggle,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  DetailItemCardBadgesAlignment,
  DetailItemCardVariant,
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  TrueColor,
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

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: DetailItemCardVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const variantOptions = [
  { label: "Plain", value: "plain" },
  ...panelVariantOptions,
];

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

const ROWS = [
  {
    title: "orchestrator-api",
    subtitle: "Deployed 12 minutes ago",
    description: "Handles capsule lifecycle and scheduling.",
    icon: "Container",
  },
  {
    title: "reverse-proxy",
    subtitle: "Deployed 2 hours ago",
    description: "Terminates TLS and routes to each service.",
    icon: "ReverseProxy",
  },
  {
    title: "postgres",
    subtitle: "Deployed 3 days ago",
    description: "Primary datastore with nightly snapshots.",
    icon: "Database",
  },
];

export const DetailItemCardDemo: React.FC = () => {
  const [title, setTitle] = useState("orchestrator-api");
  const [subtitle, setSubtitle] = useState("Deployed 12 minutes ago");
  const [description, setDescription] = useState(
    "Handles capsule lifecycle and scheduling.",
  );
  const [badgesAlignment, setBadgesAlignment] =
    useState<DetailItemCardBadgesAlignment>("right");
  const [variant, setVariant] = useState<DetailItemCardVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [withIcon, setWithIcon] = useState(true);
  const [withBadges, setWithBadges] = useState(true);
  const [withDetail, setWithDetail] = useState(true);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [selected, setSelected] = useState<string | null>(null);

  const isGlass = GLASS_VARIANTS.includes(variant);

  const badges = withBadges ? (
    <>
      {/* `success` and `warning` are not TrueColors — the old demo passed them
          and both pills silently fell back to blue. */}
      <Pill tone="emerald" size="xs">
        Healthy
      </Pill>
      <Pill tone="amber" size="xs">
        2 warnings
      </Pill>
    </>
  ) : undefined;

  const shared = {
    variant,
    tone,
    corner,
    padding,
    badgesAlignment,
    disabled,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  return (
    <PlaygroundSection
      title="Detail Item Card"
      label="[DetailItemCard]"
      description="A list row with an optional expandable detail. Plain by default; give it a variant and it becomes a real card."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as DetailItemCardVariant)
                }
              >
                {variantOptions.map((option) => (
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
                disabled={variant === "plain"}
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

          <Field label="Badges alignment">
            <MultiToggle
              fullWidth
              size="sm"
              options={[
                { label: "Right", value: "right" },
                { label: "Bottom", value: "bottom" },
                { label: "Bottom end", value: "bottom-end" },
              ]}
              value={badgesAlignment}
              onChange={(value) =>
                setBadgesAlignment(value as DetailItemCardBadgesAlignment)
              }
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Title">
              <Input
                size="sm"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field label="Subtitle">
              <Input
                size="sm"
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <Input
                size="sm"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Icon"
              checked={withIcon}
              onChange={(event) => setWithIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Badges"
              checked={withBadges}
              onChange={(event) => setWithBadges(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Expandable detail"
              checked={withDetail}
              onChange={(event) => setWithDetail(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Row is clickable"
              checked={clickable}
              onChange={(event) => setClickable(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
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
            With <strong>Row is clickable</strong> on, the whole row becomes a
            keyboard-reachable button — tab to it and press Enter. Expanding a
            row never triggers it.
            {selected && ` Last selected: ${selected}.`}
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          <DetailItemCard
            {...shared}
            title={title}
            subtitle={subtitle}
            description={description}
            icon={withIcon ? "Container" : undefined}
            badges={badges}
            onClick={clickable ? () => setSelected(title) : undefined}
          >
            {withDetail ? (
              <>
                <p>
                  Everything in here is the expandable detail. It animates open
                  to its natural height and is inert while collapsed.
                </p>
                <p className="font-mono text-xs opacity-70">
                  image: ghcr.io/acme/orchestrator-api:2.14.0
                </p>
              </>
            ) : undefined}
          </DetailItemCard>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              As a list — plain rows inside one card
            </p>
            <Panel variant="outlined" tone="neutral" padding="sm">
              <div className="divide-y divide-black/5 dark:divide-white/10">
                {ROWS.map((row) => (
                  <div key={row.title} className="py-2 first:pt-0 last:pb-0">
                    <DetailItemCard
                      variant="plain"
                      tone={tone}
                      title={row.title}
                      subtitle={row.subtitle}
                      description={row.description}
                      icon={withIcon ? row.icon : undefined}
                      badges={badges}
                      badgesAlignment={badgesAlignment}
                      onClick={
                        clickable ? () => setSelected(row.title) : undefined
                      }
                    >
                      {withDetail ? (
                        <p className="font-mono text-xs opacity-70">
                          {row.title} — detail panel
                        </p>
                      ) : undefined}
                    </DetailItemCard>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      }
    />
  );
};

import React, { useState } from "react";
import {
  DEFAULT_SURFACE_CORNER,
  DetailItemCard,
  Input,
  MultiToggle,
  Panel,
  Pill,
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  detailItemCardVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: DetailItemCardVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const BADGES_ALIGNMENT_OPTIONS = [
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
  { label: "Bottom end", value: "bottom-end" },
];

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

export const DetailItemCardPlayground: React.FC = () => {
  const [title, setTitle] = useState("orchestrator-api");
  const [subtitle, setSubtitle] = useState("Deployed 12 minutes ago");
  const [description, setDescription] = useState(
    "Handles capsule lifecycle and scheduling.",
  );
  const [badgesAlignment, setBadgesAlignment] =
    useState<DetailItemCardBadgesAlignment>("right");
  const [variant, setVariant] =
    useState<DetailItemCardVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
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
                      options={detailItemCardVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as DetailItemCardVariant)}
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
                      onChange={(v) => setCorner(v as PanelCorner)}
                    />
                    <Control label="Padding">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={panelPaddingOptions}
                        value={padding}
                        onChange={(v) => setPadding(v as PanelPadding)}
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
                    <ToggleRow
                      label="Icon"
                      checked={withIcon}
                      onChange={setWithIcon}
                    />
                    <ToggleRow
                      label="Badges"
                      checked={withBadges}
                      onChange={setWithBadges}
                    />
                    <ToggleRow
                      label="Expandable detail"
                      checked={withDetail}
                      onChange={setWithDetail}
                    />
                    <ToggleRow
                      label="Row is clickable"
                      checked={clickable}
                      onChange={setClickable}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                  </div>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Badges alignment">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={BADGES_ALIGNMENT_OPTIONS}
                        value={badgesAlignment}
                        onChange={(v) =>
                          setBadgesAlignment(
                            v as DetailItemCardBadgesAlignment,
                          )
                        }
                      />
                    </Control>
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
                    <Control label="Description">
                      <Input
                        size="sm"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </Control>
                  </>
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
                              onChange={(v) =>
                                setSpecularMode(v as PanelSpecularMode)
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
                        </>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            With <strong>Row is clickable</strong> on, the whole row becomes a
            keyboard-reachable button — tab to it and press Enter. Expanding a
            row never triggers it.
            {selected && ` Last selected: ${selected}.`}
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
                    Everything in here is the expandable detail. It animates
                    open to its natural height and is inert while collapsed.
                  </p>
                  <p className="font-mono text-xs opacity-70">
                    image: ghcr.io/acme/orchestrator-api:2.14.0
                  </p>
                </>
              ) : undefined}
            </DetailItemCard>
          </div>
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
    >
    </PlaygroundPanel>
  );
};

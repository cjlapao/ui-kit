import React, { useState } from "react";
import {
  BreakdownCard,
  type BreakdownItem,
  type ButtonVariant,
  type SurfacePadding,
  type SurfaceVariant,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, ChoiceControl, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

const PRESETS: Record<string, { caption: string; items: BreakdownItem[] }> = {
  spend: {
    caption: "Q3 — all regions",
    items: [
      { id: "compute", label: "Compute", value: 42_800, displayValue: "$42.8k", tone: "blue" },
      { id: "storage", label: "Storage", value: 18_400, displayValue: "$18.4k", tone: "sky" },
      { id: "network", label: "Network", value: 9_100, displayValue: "$9.1k", tone: "teal" },
      { id: "support", label: "Support", value: 4_600, displayValue: "$4.6k", tone: "cyan" },
    ],
  },
  leads: {
    caption: "rolling 30 days",
    items: [
      { id: "organic", label: "Organic search", value: 1240, tone: "emerald" },
      { id: "referral", label: "Referrals", value: 731, tone: "lime" },
      { id: "social", label: "Social", value: 402, tone: "violet" },
      { id: "paid", label: "Paid", value: 265, tone: "amber" },
    ],
  },
  empty: {
    caption: "nothing booked yet",
    items: [
      { id: "free", label: "Free tier", value: 0, tone: "neutral" },
    ],
  },
};

const CTA_VARIANT_OPTIONS = [
  { value: "", label: "Auto" },
  { value: "solid", label: "Solid" },
  { value: "soft", label: "Soft" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
];

const PRESET_OPTIONS = [
  { value: "spend", label: "Spend" },
  { value: "leads", label: "Leads" },
  { value: "empty", label: "Empty" },
];

export const BreakdownCardPlayground: React.FC = () => {
  const [preset, setPreset] = useState("spend");
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [padding, setPadding] = useState<SurfacePadding>("md");
  const [showStats, setShowStats] = useState(true);
  const [showCta, setShowCta] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ctaVariant, setCtaVariant] = useState("");

  const { caption, items } = PRESETS[preset];

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "data",
                title: "Data",
                controls: (
                  <ChoiceControl label="Preset" options={PRESET_OPTIONS} value={preset} onChange={setPreset} />
                ),
              },
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <SelectControl label="Variant" options={surfaceVariantOptions} value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)} />
                  </>
                ),
              },
              {
                id: "parts",
                title: "Parts",
                controls: (
                  <>
                    <ToggleRow label="stats strip" checked={showStats} onChange={setShowStats} />
                    <ToggleRow label="cta" checked={showCta} onChange={setShowCta} />
                    <ToggleRow label="loading" checked={loading} onChange={setLoading} />
                    <SelectControl
                      label="CTA variant"
                      options={CTA_VARIANT_OPTIONS}
                      value={ctaVariant}
                      onChange={setCtaVariant}
                    />
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Shares are computed from the values, never passed in — an{" "}
            <code>0</code>-total preset shows why: the rows fall back to dashes.
          </p>
        </div>
      }
      preview={
        <div className="mx-auto w-full max-w-xl">
          <BreakdownCard
            title={preset === "leads" ? "Leads by source" : "Cloud spend by service"}
            caption={caption}
            items={items}
            variant={variant}
            padding={padding}
            stats={showStats ? [{ label: "Total", value: "Σ" }, { label: "Parts", value: String(items.length) }] : []}
            loading={loading}
            ctaLabel={showCta ? "See the whole story" : ""}
            ctaVariant={(ctaVariant || undefined) as ButtonVariant | undefined}
          />
        </div>
      }
    />
  );
};

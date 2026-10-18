import { useState } from "react";
import { STAT_CARD_LOADERS, STAT_CARD_PROGRESS_TYPES } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  StatPagerPlacement,
  PanelCorner,
  PanelDecoration,
  PanelPadding,
  PanelVariant,
  StatCardLoader,
  StatCardProgressType,
  StatCardProps,
  TrueColor,
} from "@cjlapao/ui-kit";
import { ChoiceControl, ToggleRow } from "./PlaygroundPanel";
import type { ControlGroup } from "./ControlAccordion";
import {
  controlSizeOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "./options";

const toneOptionsWithNone = [{ label: "(none)", value: "" }, ...trueColorOptions];
const sizeOptionsWithInherit = [
  { label: "(inherit)", value: "" },
  ...controlSizeOptions,
];

export interface StatBaseControls {
  /** The grouped controls for every prop `StatCard` defines. */
  groups: ControlGroup[];
  /**
   * The resolved props, ready to spread onto any member of the family. Every
   * Stat component inherits `StatCardProps`, so the same object drives all of
   * them — which is the point of the base controls being shared rather than
   * copied into each playground.
   */
  statProps: StatCardProps;
}

/**
 * The base `StatCard` controls, shared by every Stat playground.
 *
 * The Stat family all inherit `StatCardProps`, so their playgrounds must offer
 * the same base options — and the only way to keep that true as the base card
 * grows is for there to be one copy of the controls. Each playground adds its
 * own extras beside these.
 *
 * The controls are returned as `ControlGroup`s so the playgrounds can drop
 * them straight into `ControlAccordion` (collapsed by default). Group titles
 * match the option clusters, so no inner `Control` labels are repeated.
 */
export const useStatBaseControls = (): StatBaseControls => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<PanelPadding>("md");
  const [corner, setCorner] = useState<PanelCorner>("rounded-lg");
  const [decoration, setDecoration] = useState<PanelDecoration>("none");

  const [labelTone, setLabelTone] = useState("");
  const [labelSize, setLabelSize] = useState("");
  const [valueTone, setValueTone] = useState("");
  const [valueSize, setValueSize] = useState("");

  const [progressType, setProgressType] = useState<StatCardProgressType>("bar");
  const [progressOn, setProgressOn] = useState(false);
  const [syncValueToProgress, setSync] = useState(false);

  const [loaderType, setLoaderType] = useState<StatCardLoader>("skeleton");
  const [loading, setLoading] = useState(false);

  const [withIcon, setWithIcon] = useState(true);
  const [withTrend, setWithTrend] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [withMeta, setWithMeta] = useState(false);
  const [gradient, setGradient] = useState(false);
  const [errored, setErrored] = useState(false);
  const [clickable, setClickable] = useState(false);

  const [paged, setPaged] = useState(false);
  const [pagerPlacement, setPagerPlacement] = useState<StatPagerPlacement>("top");
  const [loopPages, setLoopPages] = useState(false);
  const [showPageIndicator, setShowPageIndicator] = useState(true);

  const groups: ControlGroup[] = [
    {
      id: "core",
      title: "Core",
      controls: (
        <>
          <ChoiceControl label="Variant" options={surfaceVariantOptions}
            value={variant} onChange={(v) => setVariant(v as PanelVariant)} />
          <ChoiceControl label="Tone" options={trueColorOptions}
            value={tone} onChange={(v) => setTone(v as TrueColor)} />
          <ChoiceControl label="Size" options={controlSizeOptions}
            value={size} onChange={(v) => setSize(v as ControlSize)} />
          <ChoiceControl label="Padding" options={panelPaddingOptions}
            value={padding} onChange={(v) => setPadding(v as PanelPadding)} />
          <ChoiceControl label="Corner" options={panelCornerOptions}
            value={corner} onChange={(v) => setCorner(v as PanelCorner)} />
          <ChoiceControl label="Decoration" options={panelDecorationOptions}
            value={decoration} onChange={(v) => setDecoration(v as PanelDecoration)} />
        </>
      ),
    },
    {
      id: "text",
      title: "Text",
      controls: (
        <>
          <ChoiceControl label="Label tone" options={toneOptionsWithNone}
            value={labelTone} onChange={setLabelTone} />
          <ChoiceControl label="Label size" options={sizeOptionsWithInherit}
            value={labelSize} onChange={setLabelSize} />
          <ChoiceControl label="Value tone" options={toneOptionsWithNone}
            value={valueTone} onChange={setValueTone} />
          <ChoiceControl label="Value size" options={sizeOptionsWithInherit}
            value={valueSize} onChange={setValueSize} />
        </>
      ),
    },
    {
      id: "progress",
      title: "Progress",
      controls: (
        <>
          <ChoiceControl label="Progress type"
            options={STAT_CARD_PROGRESS_TYPES.map((v) => ({ label: v, value: v }))}
            value={progressType} onChange={(v) => setProgressType(v as StatCardProgressType)} />
          <ChoiceControl label="Loader"
            options={STAT_CARD_LOADERS.map((v) => ({ label: v, value: v }))}
            value={loaderType} onChange={(v) => setLoaderType(v as StatCardLoader)} />
          <div className="space-y-1.5">
            <ToggleRow label="Show progress" checked={progressOn} onChange={setProgressOn} />
            <ToggleRow label="Sync to value" checked={syncValueToProgress} onChange={setSync} />
          </div>
        </>
      ),
    },
    {
      id: "content",
      title: "Content",
      controls: (
        <div className="space-y-1.5">
          <ToggleRow label="Icon" checked={withIcon} onChange={setWithIcon} />
          <ToggleRow label="Subtitle" checked={withSubtitle} onChange={setWithSubtitle} />
          <ToggleRow label="Trend" checked={withTrend} onChange={setWithTrend} />
          <ToggleRow label="Meta + footer" checked={withMeta} onChange={setWithMeta} />
          <ToggleRow label="Gradient wash" checked={gradient} onChange={setGradient} />
        </div>
      ),
    },
    {
      id: "paging",
      title: "Paging",
      controls: (
        <>
          <ChoiceControl label="Pager placement"
            options={[{ label: "top", value: "top" }, { label: "bottom", value: "bottom" }]}
            value={pagerPlacement} onChange={(v) => setPagerPlacement(v as StatPagerPlacement)} />
          <div className="space-y-1.5">
            <ToggleRow label="Paged" checked={paged} onChange={setPaged} />
            <ToggleRow label="Loop" checked={loopPages} onChange={setLoopPages} />
            <ToggleRow label="Counter" checked={showPageIndicator} onChange={setShowPageIndicator} />
          </div>
        </>
      ),
    },
    {
      id: "state",
      title: "State",
      controls: (
        <div className="space-y-1.5">
          <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
          <ToggleRow label="Error" checked={errored} onChange={setErrored} />
          <ToggleRow label="Clickable" checked={clickable} onChange={setClickable} />
        </div>
      ),
    },
  ];

  const statProps: StatCardProps = {
    variant,
    tone,
    size,
    padding,
    corner,
    decoration,
    gradient,
    labelTone: (labelTone || undefined) as TrueColor | undefined,
    labelSize: (labelSize || undefined) as ControlSize | undefined,
    valueTone: (valueTone || undefined) as TrueColor | undefined,
    valueSize: (valueSize || undefined) as ControlSize | undefined,
    icon: withIcon ? "Database" : undefined,
    subtitle: withSubtitle ? "across 3 regions" : undefined,
    trend: withTrend
      ? { value: "+12%", direction: "up", label: "vs. last week" }
      : undefined,
    meta: withMeta ? [{ text: "3 regions", icon: "Globe" }] : undefined,
    footer: withMeta ? (
      <span className="text-xs opacity-60">Updated just now</span>
    ) : undefined,
    progress: progressOn ? 72 : false,
    progressType,
    syncValueToProgress,
    loading,
    loaderType,
    error: errored ? { message: "Registry unreachable", onRetry: () => {} } : undefined,
    // A page overrides only what it sets, so these carry just a title and a
    // figure and inherit the rest of the card.
    pages: paged
      ? [
          { id: "us", title: "us-east", value: 128 },
          { id: "eu", title: "eu-west", value: 86 },
          { id: "ap", title: "ap-south", value: 41 },
        ]
      : undefined,
    pagerPlacement,
    loopPages,
    showPageIndicator,
    onClick: clickable ? () => {} : undefined,
  };

  return { groups, statProps };
};

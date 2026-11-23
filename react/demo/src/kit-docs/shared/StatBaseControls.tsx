import type { StatCardDrilldownItem, SurfaceTone } from "@cjlapao/ui-kit";
import { SurfaceToneControl } from "./SurfaceToneControl";
import { useCallback, useRef, useState } from "react";
import { STAT_CARD_LOADERS, STAT_CARD_PROGRESS_TYPES } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  StatCardIconPlacement,
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
import { HueControl } from "./HueControl";
import type { ControlGroup } from "./ControlAccordion";
import {
  controlSizeOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "./options";

/* The drilldown's fake endpoint — the contract an app supplies: page in,
   items out, `hasMore` and `total` back. 250–600 ms per page so the skeleton
   and the stagger are visible, and `armOutage` fails exactly one request so
   the retry path is reachable without leaving the playground. */
const POOL: StatCardDrilldownItem[] = Array.from({ length: 60 }, (_, i) => ({
  id: `e${i}`,
  title: `Capsule ${String(i + 1).padStart(3, "0")}`,
  subtitle: (["running", "queued", "retrying"] as const)[i % 3],
  icon: (["Check", "Send", "Target"] as const)[i % 3],
  tone: (["emerald", "blue", "amber"] as const)[i % 3],
  count: ((i * 5) % 19) + 1,
}));

const flakyRef = { current: false };

const fetchPool = async ({
  page,
  pageSize,
  signal,
}: {
  page: number;
  pageSize: number;
  signal: AbortSignal;
}) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 250 + Math.random() * 350),
  );
  if (signal.aborted) throw new Error("aborted");
  if (flakyRef.current) {
    flakyRef.current = false;
    throw new Error("simulated outage");
  }
  const start = page * pageSize;
  return {
    items: POOL.slice(start, start + pageSize),
    hasMore: start + pageSize < POOL.length,
    total: POOL.length,
  };
};

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
  /**
   * The class for the playground's preview wrapper. Normally `undefined` —
   * each playground sizes its own stage. When the drilldown's
   * <em>Fill the test area</em> is on it is `w-full`: the stage spans the
   * panel, while the card itself is pinned by `previewItemClassName`.
   */
  previewClassName?: string;
  /**
   * The class for the div wrapping the previewed component. Only set in
   * fill mode: the card keeps its ordinary size, pinned to the stage's
   * left edge, leaving the rest of the test area to the menu measured
   * against `previewStageRef`.
   */
  previewItemClassName?: string;
  /**
   * Attach to the playground's preview wrapper (the element carrying
   * `previewClassName`). Fill mode measures it and opens the menu at that
   * width; playgrounds outside the Stat family never touch it.
   */
  previewStageRef: (el: HTMLDivElement | null) => void;
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
  const [tone, setTone] = useState<SurfaceTone>("none");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<PanelPadding>("md");
  const [corner, setCorner] = useState<PanelCorner>("rounded-lg");
  const [decoration, setDecoration] = useState<PanelDecoration>("none");

  // The card's own state half of the Panel surface, which the Stat family
  // inherits wholesale — see `StatCardProps`.
  const [active, setActive] = useState(false);
  const [activeTone, setActiveTone] = useState<TrueColor | undefined>();
  const [pulse, setPulse] = useState(false);
  const [pulseTone, setPulseTone] = useState<TrueColor | undefined>();

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
  const [iconBackground, setIconBackground] = useState(false);
  const [iconPlacement, setIconPlacement] = useState<StatCardIconPlacement>("left");
  const [withTrend, setWithTrend] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [withMeta, setWithMeta] = useState(false);
  const [gradient, setGradient] = useState(false);
  const [errored, setErrored] = useState(false);
  const [clickable, setClickable] = useState(false);

  const [drilldownOn, setDrilldownOn] = useState(false);
  const [drilldownMatch, setDrilldownMatch] = useState(false);
  const [drilldownFill, setDrilldownFill] = useState(false);
  const [drilldownAlign, setDrilldownAlign] = useState<"start" | "center" | "end">(
    "start",
  );
  const [drilldownMinHeight, setDrilldownMinHeight] = useState(200);
  const [drilldownSquare, setDrilldownSquare] = useState(false);
  // The measured width of the playground's preview stage, so filling it can
  // size the menu to the test area itself — the tile stays a square.
  const [stageWidth, setStageWidth] = useState<number | undefined>();
  const stageObserver = useRef<ResizeObserver | null>(null);
  const previewStageRef = useCallback((el: HTMLDivElement | null) => {
    stageObserver.current?.disconnect();
    stageObserver.current = null;
    if (!el) return;
    setStageWidth(el.clientWidth || undefined);
    if (typeof ResizeObserver !== "undefined") {
      stageObserver.current = new ResizeObserver(() => {
        setStageWidth(el.clientWidth || undefined);
      });
      stageObserver.current.observe(el);
    }
  }, []);
  const [drilldownVariant, setDrilldownVariant] = useState<PanelVariant>("elevated");
  const [drilldownCorner, setDrilldownCorner] = useState<PanelCorner>("rounded-sm");
  const [drilldownPadding, setDrilldownPadding] = useState<PanelPadding>("none");
  const [drilldownFlaky, setDrilldownFlaky] = useState(false);

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
          <SurfaceToneControl label="Tone" value={tone} onChange={setTone} />
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
      id: "selection",
      title: "Selected & pulsing",
      controls: (
        <div className="space-y-1.5">
          <ToggleRow label="Selected" checked={active} onChange={setActive} />
          {active ? (
            <HueControl
              label="Selected hue"
              value={activeTone}
              onChange={setActiveTone}
              autoLabel="Auto — the card's own hue"
            />
          ) : null}
          <ToggleRow label="Pulse" checked={pulse} onChange={setPulse} />
          {pulse ? (
            <HueControl
              label="Pulse hue"
              value={pulseTone}
              onChange={setPulseTone}
              autoLabel="Auto — the selected hue"
            />
          ) : null}
        </div>
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
          <ChoiceControl label="Icon placement"
            options={[{ label: "left", value: "left" }, { label: "right", value: "right" }]}
            value={iconPlacement} onChange={(v) => setIconPlacement(v as StatCardIconPlacement)} />
          <ToggleRow label="Icon background" checked={iconBackground} onChange={setIconBackground} />
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
      id: "drilldown",
      title: "Drilldown",
      controls: (
        <div className="space-y-1.5">
          <ToggleRow label="List behind the tile" checked={drilldownOn} onChange={setDrilldownOn} />
          <ToggleRow label="Open at tile width" checked={drilldownMatch} onChange={setDrilldownMatch} />
          <ToggleRow
            label="Fill the test area"
            checked={drilldownFill}
            onChange={setDrilldownFill}
          />
          <ToggleRow label="Square card" checked={drilldownSquare} onChange={setDrilldownSquare} />
          {drilldownOn && (
            <>
              <ChoiceControl label="Stays" options={[
                { label: "Left edge", value: "start" },
                { label: "Centred", value: "center" },
                { label: "Right edge", value: "end" },
              ]} value={drilldownAlign} onChange={(v) => setDrilldownAlign(v as "start" | "center" | "end")} />
              <ChoiceControl label="Min height" options={[
                { label: "Off", value: "0" },
                { label: "200px", value: "200" },
                { label: "320px", value: "320" },
              ]} value={String(drilldownMinHeight)} onChange={(v) => setDrilldownMinHeight(Number(v))} />
              <ChoiceControl label="Surface" options={surfaceVariantOptions}
                value={drilldownVariant} onChange={(v) => setDrilldownVariant(v as PanelVariant)} />
              <ChoiceControl label="Corner" options={panelCornerOptions}
                value={drilldownCorner} onChange={(v) => setDrilldownCorner(v as PanelCorner)} />
              <ChoiceControl label="Padding" options={panelPaddingOptions}
                value={drilldownPadding} onChange={(v) => setDrilldownPadding(v as PanelPadding)} />
            </>
          )}
          <ToggleRow
            label="Fail the next request"
            checked={drilldownFlaky}
            onChange={(v) => {
              flakyRef.current = v;
              setDrilldownFlaky(v);
            }}
          />
        </div>
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
    active,
    activeTone,
    pulse,
    pulseTone,
    gradient,
    labelTone: (labelTone || undefined) as TrueColor | undefined,
    labelSize: (labelSize || undefined) as ControlSize | undefined,
    valueTone: (valueTone || undefined) as TrueColor | undefined,
    valueSize: (valueSize || undefined) as ControlSize | undefined,
    icon: withIcon ? "Database" : undefined,
    iconBackground,
    iconPlacement,
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
    square: drilldownSquare,
    drilldown: drilldownOn
      ? {
          fetchItems: fetchPool,
          pageSize: 8,
          // Filling the test area opens the menu at the measured stage
          // width; `align` says which edge of the tile it stays on, and the
          // menu narrows to the room that edge has instead of sliding.
          matchTileWidth: drilldownMatch && !drilldownFill,
          width: drilldownFill ? stageWidth : undefined,
          align: drilldownAlign,
          minHeight: drilldownMinHeight || undefined,
          maxHeight: drilldownFill ? 1200 : undefined,
          variant: drilldownVariant,
          corner: drilldownCorner,
          padding: drilldownPadding,
          title: "Everything behind this number",
          onItemClick: () => {},
          footer: (
            <span className="text-xs opacity-60">
              Keep scrolling — the next page loads itself.
            </span>
          ),
        }
      : undefined,
  };

  return {
    groups,
    statProps,
    previewClassName: drilldownFill ? "w-full" : undefined,
    // Fill mode changes the stage, never the card: same width as the
    // ordinary preview, pinned to its left edge.
    previewItemClassName: drilldownFill ? "w-full max-w-xs mr-auto" : undefined,
    previewStageRef,
  };
};

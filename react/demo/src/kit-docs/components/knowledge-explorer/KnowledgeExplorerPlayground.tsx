import React, { useState } from "react";
import {
  ColorSwatches,
  Input,
  KnowledgeExplorer,
  Slider,
  type ControlSize,
  type KnowledgeExplorerView,
  type MemoryRecord,
  type PanelLoaderType,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceTone,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import {
  controlSizeOptions,
  panelCornerOptions,
  panelLoaderTypeOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import {
  memories,
  points,
} from "./examples/data";

const dataStateOptions = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
];

const VIEW_OPTIONS = [
  { value: "library", label: "Memory library" },
  { value: "map", label: "Knowledge map" },
];

const INSPECTOR_WIDTH_OPTIONS = [
  { value: "280", label: "280 px" },
  { value: "340", label: "340 px (default)" },
  { value: "400", label: "400 px" },
];

const LOAD_MODE_OPTIONS = [
  { value: "scroll", label: "Scroll (infinite)" },
  { value: "button", label: "Button" },
];

// The presentation cap. There is always data beyond it (MAX_RECORDS stays
// above every option), so the library has to be the one that stops — the
// tail turns into a quiet "at most N" note instead of a dead affordance.
const LIMIT_OPTIONS = [
  { value: "", label: "Off" },
  { value: "12", label: "12 records" },
  { value: "16", label: "16 records" },
];

// Panel chrome pickers. The main panel's choices are concrete (its `"auto"`
// entry simply leaves the prop unset, keeping the part's own default card);
// the inspector's always start on `"auto"` so it mirrors the main panel.
const AUTO = { value: "", label: "Auto" };
// The kit's own padding scale, spelled like every other playground's —
// toOptions(SURFACE_PADDINGS): none/xs/sm/md/lg/xl under the token names.
const PADDING_OPTIONS = [AUTO, ...panelPaddingOptions];
const MAIN_VARIANT_OPTIONS = [AUTO, ...surfaceVariantOptions];
// SURFACE_CORNERS carries a literal "auto" member meaning "follow the theme
// default" — the playground's own Auto entry already covers that.
const MAIN_CORNER_OPTIONS = [AUTO, ...panelCornerOptions.filter((o) => o.value !== "auto")];

/** One link in the tone chain as a swatch picker: "Auto" lets the tone flow
 * up to controlsTone and the card's own accent (the kit default blue on an
 * untinted card); choosing a dot pins this control's tone. */
function ToneSwatchControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Control label={label}>
      <div className="space-y-2">
        <button
          type="button"
          aria-pressed={value === ""}
          onClick={() => onChange("")}
          className={`rounded-md border px-3 py-1 text-xs ${
            value === ""
              ? "border-neutral-500 bg-neutral-100 dark:border-neutral-400 dark:bg-neutral-800"
              : "border-neutral-300 dark:border-neutral-700"
          }`}
        >
          Auto
        </button>
        <ColorSwatches selectable size="sm" defaultExpanded value={value ? (value as TrueColor) : undefined} onSelect={(tone) => onChange(tone)} />
      </div>
    </Control>
  );
}

// The paged records the Load-more tail synthesises, so the scroll watcher and
// the button both have something to do. The delay is the page fetch — with
// scroll mode it makes the tiny spinner at the results' end visible.
const PAGE_SIZE = 4;
const MAX_RECORDS = 26;
const EXTRA_KINDS = ["lesson", "decision", "convention", "pitfall", "code", "documentation"] as const;
const EXTRA_TOPICS = ["Rendering", "Build", "Observability", "Transport", "Testing"];
const EXTRA_TITLES = [
  "Collapse noisy retry logs",
  "Snapshot long-lived fixtures",
  "Trace spans inherit request ids",
  "Gate flaky suites behind quarantine",
  "Budget worker threads per build",
  "Keep public types at the package edge",
];

function synthesise(offset: number, count: number): MemoryRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    return {
      id: `page-${n}`,
      title: `${EXTRA_TITLES[n % EXTRA_TITLES.length]} · ${n + 1}`,
      summary:
        "Generated for the paging demo — Load-more appends older records without replacing the list.",
      kind: EXTRA_KINDS[n % EXTRA_KINDS.length],
      topic: EXTRA_TOPICS[n % EXTRA_TOPICS.length],
      status: n % 5 === 0 ? "needs-review" : "active",
      usage: { retrievalCount: (n * 7) % 40 },
    } satisfies MemoryRecord;
  });
}

export const KnowledgeExplorerPlayground: React.FC = () => {
  const [surfaceTone, setSurfaceTone] = useState<SurfaceTone>("blue");
  // Elevated is the knowledge panels' default surface — start there so the
  // playground opens looking like the docs, not like a stripped card.
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [mainPadding, setMainPadding] = useState("none");
  const [mainCorner, setMainCorner] = useState("");
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("skeleton");
  const [loaderProgress, setLoaderProgress] = useState(50);
  const [projected, setProjected] = useState(false);
  const [customDetail, setCustomDetail] = useState(false);
  // NetworkGraph's demo: wrap the explorer in a fixed-height parent and let
  // fullHeight fill it, so growth and the docked inspector's parity show.
  const [fullHeightOn, setFullHeightOn] = useState(false);
  // The main column shows exactly one view; the inspector is the common
  // detail column beside it (NetworkGraph-style).
  const [view, setView] = useState<KnowledgeExplorerView>("library");
  const [inspectorOn, setInspectorOn] = useState(true);
  const [inspectorWidthValue, setInspectorWidthValue] = useState("340");
  const [inspectorVariant, setInspectorVariant] = useState("");
  const [inspectorToneColor, setInspectorToneColor] = useState("");
  const [inspectorPadding, setInspectorPadding] = useState("");
  const [inspectorCorner, setInspectorCorner] = useState("");
  // Empty means the inspectorTitle prop stays unset — the component's own
  // "Inspector" eyebrow (NetworkGraph-style) shows.
  const [inspectorTitleText, setInspectorTitleText] = useState("");
  const [dataState, setDataState] = useState("ready");
  // Nothing selected to begin with: the inspector follows NetworkGraph and
  // stays hidden until a memory is picked.
  const [selectedId, select] = useState<string | null>(null);
  const [records, setRecords] = useState<MemoryRecord[]>(memories);
  // Infinite is the library's default loading mode; the button tail stays
  // one choice away. The height cap is on by default so the ScrollArea and
  // the tail are seen doing their job.
  const [scroll, setScroll] = useState(true);
  const [loadMode, setLoadMode] = useState<"scroll" | "button">("scroll");
  const [hasMore, setHasMore] = useState(true);
  // On by default so the cap is seen taking effect: two pages of four grow
  // the eight seeded records to twelve, and the library stops there while
  // the dataset still has sixteen more behind it.
  const [limitValue, setLimitValue] = useState("12");
  // Toolbar chain: "auto" (empty) walks up to the card's own tone/variant.
  const [controlsSize, setControlsSize] = useState<ControlSize>("sm");
  const [controlsToneColor, setControlsToneColor] = useState("");
  const [searchToneColor, setSearchToneColor] = useState("");
  const [viewToneColor, setViewToneColor] = useState("");
  // The filter bar's own search section is a section the library can switch
  // off; its query survives the hide, like every other library section.
  const [searchOn, setSearchOn] = useState(true);
  // And the whole filter section — search and facets — can go together.
  const [filterBarOn, setFilterBarOn] = useState(true);
  // The map's camera pill — the NetworkGraph cluster, floating bottom-right
  // over the canvas; its controls ride their own tone, falling back to the
  // card accent through the map's chain.
  const [mapControlsOn, setMapControlsOn] = useState(true);
  const [mapToneColor, setMapToneColor] = useState("");
  // The graph's passive hover preview on points; off leaves a static canvas.
  const [mapHoverOn, setMapHoverOn] = useState(true);
  // The hairline under the map title — off by default in the component.
  const [mapDividerOn, setMapDividerOn] = useState(false);
  // The topic legend — on by default; hiding it is the explicit opt-out.
  const [mapLegendOn, setMapLegendOn] = useState(true);
  // The selection choreography, NetworkGraph's own: the shortest-pan reveal
  // once the inspector dock settles, and the opt-in animated fit of the
  // whole scene into the shrunken box that comes with it.
  const [mapRevealOn, setMapRevealOn] = useState(true);
  const [mapCenterOn, setMapCenterOn] = useState(true);
  const [mapFitOn, setMapFitOn] = useState(false);
  const [log, pushLog] = useEventLog();

  const titleOf = (id: string) =>
    records.find((memory) => memory.id === id)?.title ?? id;

  const loadMore = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setRecords((current) => [...current, ...synthesise(current.length, PAGE_SIZE)]);
  };

  const reset = () => {
    setRecords(memories);
    select(null);
    setDataState("ready");
  };

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "view",
                title: "Main view",
                defaultOpen: true,
                controls: (
                  <>
                    <ChoiceControl
                      label="Main view"
                      options={VIEW_OPTIONS}
                      value={view}
                      onChange={(v) => {
                        setView(v as KnowledgeExplorerView);
                        pushLog(`View → ${v === "map" ? "Knowledge map" : "Memory library"}`);
                      }}
                    />
                    <ToggleRow
                      label="Replace detail region"
                      checked={customDetail}
                      onChange={setCustomDetail}
                    />
                  </>
                ),
              },
              {
                id: "panel",
                title: "Main panel",
                defaultOpen: true,
                controls: (
                  <>
                    {/* The explorer's surface props paint the panel of
                        whichever view is showing — NetworkGraph-style, where
                        variant/tone/corner are the graph panel's own. */}
                    <ChoiceControl
                      label="Surface variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
                    />
                    <SurfaceToneControl value={surfaceTone} onChange={setSurfaceTone} />
                    <SelectControl
                      label="Padding"
                      options={PADDING_OPTIONS}
                      value={mainPadding}
                      onChange={setMainPadding}
                    />
                    <SelectControl
                      label="Corner"
                      options={MAIN_CORNER_OPTIONS}
                      value={mainCorner}
                      onChange={setMainCorner}
                    />
                    {dataState === "loading" && (
                      <>
                        <ChoiceControl
                          label="Loader type"
                          options={panelLoaderTypeOptions}
                          value={loaderType}
                          onChange={(v) => setLoaderType(v as PanelLoaderType)}
                        />
                        {loaderType === "progress" && <Control label={`Progress: ${loaderProgress}%`}>
                          <Slider ariaLabel="Loader progress" min={0} max={100} value={loaderProgress} onChange={(value) => setLoaderProgress(value as number)} />
                        </Control>}
                      </>
                    )}
                  </>
                ),
              },
              {
                id: "inspector",
                title: "Inspector",
                defaultOpen: true,
                controls: (
                  <>
                    <ToggleRow
                      label="Inspector (memory detail)"
                      checked={inspectorOn}
                      onChange={setInspectorOn}
                    />
                    <ToggleRow
                      label="Full height (fills a 640px parent)"
                      checked={fullHeightOn}
                      onChange={setFullHeightOn}
                    />
                    <Control label="Title">
                      <Input
                        value={inspectorTitleText}
                        onChange={(e) => setInspectorTitleText(e.target.value)}
                        placeholder="Inspector"
                      />
                    </Control>
                    {/* Auto follows the main surface except padding, which
                        uses the Panel default until a choice pins it. */}
                    <SelectControl
                      label="Variant"
                      options={MAIN_VARIANT_OPTIONS}
                      value={inspectorVariant}
                      onChange={setInspectorVariant}
                    />
                    <ToneSwatchControl
                      label="Tone"
                      value={inspectorToneColor}
                      onChange={setInspectorToneColor}
                    />
                    <SelectControl
                      label="Padding"
                      options={PADDING_OPTIONS}
                      value={inspectorPadding}
                      onChange={setInspectorPadding}
                    />
                    <SelectControl
                      label="Corner"
                      options={MAIN_CORNER_OPTIONS}
                      value={inspectorCorner}
                      onChange={setInspectorCorner}
                    />
                    <SelectControl
                      label="Width"
                      options={INSPECTOR_WIDTH_OPTIONS}
                      value={inspectorWidthValue}
                      onChange={setInspectorWidthValue}
                    />
                  </>
                ),
              },
              {
                id: "data",
                title: "Data state",
                defaultOpen: true,
                controls: (
                  <>
                    <ChoiceControl
                      label="State"
                      options={dataStateOptions}
                      value={dataState}
                      onChange={setDataState}
                    />
                    <ToggleRow
                      label="Supplied coordinates"
                      checked={projected}
                      onChange={setProjected}
                    />
                    <ToggleRow
                      label="Cap library height"
                      checked={scroll}
                      onChange={setScroll}
                    />
                    <SelectControl
                      label="Library load mode"
                      options={LOAD_MODE_OPTIONS}
                      value={loadMode}
                      onChange={(v) => setLoadMode(v as "scroll" | "button")}
                    />
                    <SelectControl
                      label="Display limit"
                      options={LIMIT_OPTIONS}
                      value={limitValue}
                      onChange={setLimitValue}
                    />
                    <ToggleRow
                      label="hasMore"
                      checked={hasMore}
                      onChange={setHasMore}
                    />
                    <button
                      type="button"
                      onClick={reset}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Reset sample data
                    </button>
                  </>
                ),
              },
              {
                id: "toolbar",
                title: "Filter & view controls",
                controls: (
                  <>
                    <ToggleRow
                      label="Filter bar"
                      checked={filterBarOn}
                      onChange={setFilterBarOn}
                    />
                    {filterBarOn && (
                      <ToggleRow
                        label="Search section"
                        checked={searchOn}
                        onChange={setSearchOn}
                      />
                    )}
                    <SelectControl
                      label="Controls size"
                      options={controlSizeOptions}
                      value={controlsSize}
                      onChange={(v) => setControlsSize(v as ControlSize)}
                    />
                    <ToneSwatchControl
                      label="Controls tone"
                      value={controlsToneColor}
                      onChange={setControlsToneColor}
                    />
                    <ToneSwatchControl
                      label="Search tone"
                      value={searchToneColor}
                      onChange={setSearchToneColor}
                    />
                    <ToneSwatchControl
                      label="View tone"
                      value={viewToneColor}
                      onChange={setViewToneColor}
                    />
                  </>
                ),
              },
              {
                id: "map",
                title: "Map camera",
                controls: (
                  <>
                    <ToggleRow
                      label="Camera pill"
                      checked={mapControlsOn}
                      onChange={setMapControlsOn}
                    />
                    <ToggleRow
                      label="Hover highlight"
                      checked={mapHoverOn}
                      onChange={setMapHoverOn}
                    />
                    <ToggleRow
                      label="Title divider"
                      checked={mapDividerOn}
                      onChange={setMapDividerOn}
                    />
                    <ToggleRow
                      label="Topic legend"
                      checked={mapLegendOn}
                      onChange={setMapLegendOn}
                    />
                    <ToggleRow
                      label="Reveal selection"
                      checked={mapRevealOn}
                      onChange={setMapRevealOn}
                    />
                    <ToggleRow
                      label="Center selection"
                      checked={mapCenterOn}
                      onChange={setMapCenterOn}
                    />
                    <ToggleRow
                      label="Fit on inspector dock"
                      checked={mapFitOn}
                      onChange={setMapFitOn}
                    />
                    <ToneSwatchControl
                      label="Camera tone"
                      value={mapToneColor}
                      onChange={setMapToneColor}
                    />
                  </>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — select memories, pin or archive."
          />
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Selection is shared across the columns — pick a card, a map point
            or a detail action and everything follows. The main column shows
            exactly one view — the <strong>Main view</strong> choice in this
            side menu picks between the library and the map, never both (the
            component’s own header switch is hidden here as redundant; the
            views still hand each other over in place — the library’s toggle
            ends in a map button, the map’s camera pill in a library button);
            the <strong>inspector</strong> is the common detail
            column on the right — it appears only while a memory is selected,
            docks beside the view while there is room (at NetworkGraph’s 16px
            gap), moves down under the view when the width runs out, and while
            docked it matches the view panel’s height, the detail scrolling
            inside its own card. The <strong>Main panel</strong> group styles
            the panel of whichever view is showing — variant, tone, padding,
            corner. The <strong>Inspector</strong> follows tone, variant and
            corner on <strong>Auto</strong>; its padding uses the Panel default
            unless overridden. The <strong>Width</strong> choice rebalances the split.
            <strong>Supplied
            coordinates</strong> feeds the map an explicit projection; without
            it, placement is illustrative. The <strong>Map camera</strong>{" "}
            group floats the NetworkGraph-style pill — fit, the zoom steps,
            the percent readout and a reset that clears selection — over the
            canvas, or switches it off to leave the canvas bare; the hover
            preview rim can go off with it.{" "}
            <strong>Replace detail region</strong>{" "}
            swaps the inspector’s body for consumer-owned content — the panel,
            its pinned title and the scroll area stay the shell’s, and their
            uniform inset wraps whatever the body renders. The library reads
            best in the narrower viewer — switch it to <strong>List</strong>{" "}
            for dense rows. With <strong>Cap library height</strong> on its
            results scroll in a <code>ScrollArea</code>: <strong>Scroll</strong>{" "}
            pages in as you approach the end, <strong>Button</strong> pins a
            Load-more under the panel. A <strong>Display limit</strong> stops
            the paging at N records — even with more data behind it, the tail
            settles into an “at most N” note. The filter bar is the kit
            <strong> FilterBar</strong> — switch the whole section off, or
            just its search half, while Type, Status and Topic menus
            multi-select with chips — and one <strong> controls size</strong>{" "}
            covers it and the view toggle; a tone chain lets each control's
            own tone override <strong>controls tone</strong>, which follows
            the card's own surface.
          </p>
        </div>
      }
      preview={
        <div className="w-full" style={{ height: fullHeightOn ? 640 : undefined }}>
          <KnowledgeExplorer
            // The side menu's Main view choice already drives the column, so
            // the component's own header switch would only echo it — hide it
            // (direct child only: the panels keep their own toolbars; the
            // `!` because kit CSS is unlayered and beats plain utilities).
            className="[&>.kit-knowledge-toolbar]:hidden!"
            fullHeight={fullHeightOn || undefined}
            tone={surfaceTone}
            variant={variant}
            padding={(mainPadding || undefined) as SurfacePadding | undefined}
            corner={(mainCorner || undefined) as SurfaceCorner | undefined}
            loaderType={loaderType}
            loaderProgress={loaderType === "progress" ? loaderProgress : undefined}
            memories={dataState === "empty" ? [] : records}
            points={projected ? points : undefined}
            view={view}
            onViewChange={(next) => {
              setView(next);
              pushLog(`View → ${next === "map" ? "Knowledge map" : "Memory library"}`);
            }}
            inspector={inspectorOn}
            inspectorWidth={Number(inspectorWidthValue)}
            inspectorVariant={(inspectorVariant || "auto") as SurfaceVariant | "auto"}
            inspectorTone={(inspectorToneColor || "auto") as SurfaceTone | "auto"}
            inspectorPadding={(inspectorPadding || "auto") as SurfacePadding | "auto"}
            inspectorCorner={(inspectorCorner || "auto") as SurfaceCorner | "auto"}
            inspectorTitle={inspectorTitleText || undefined}
            loading={dataState === "loading"}
            library={{
              // Under full height the results grow with the card instead of
              // sitting under a fixed scroll cap.
              maxHeight: scroll && !fullHeightOn ? 320 : undefined,
              hasMore: hasMore && records.length < MAX_RECORDS,
              onLoadMore: loadMore,
              loadMode,
              limit: limitValue ? Number(limitValue) : undefined,
              showFilterBar: filterBarOn,
              showSearch: searchOn,
              size: controlsSize,
              controlsTone: (controlsToneColor || "auto") as TrueColor | "auto",
              searchTone: (searchToneColor || "auto") as TrueColor | "auto",
              viewTone: (viewToneColor || "auto") as TrueColor | "auto",
            }}
            map={{
              showControls: mapControlsOn,
              hoverHighlight: mapHoverOn,
              showTitleDivider: mapDividerOn,
              showLegend: mapLegendOn,
              autoRevealSelected: mapRevealOn,
              autoCenterSelected: mapCenterOn,
              autoFitOnInspector: mapFitOn,
              size: controlsSize,
              controlsTone: (mapToneColor || "auto") as TrueColor | "auto",
            }}
            selectedId={selectedId}
            onSelectionChange={(id) => {
              select(id);
              pushLog(id ? `Selected “${titleOf(id)}”` : "Selection cleared");
            }}
            relationships={[
              {
                id: "replaces",
                source: "refresh",
                target: "legacy",
                label: "replaces",
              },
            ]}
            actions={[
              {
                id: "edit",
                label: "Edit",
                onClick: (memory) =>
                  pushLog(`Edit requested for “${memory.title}”`),
              },
              {
                id: "pin",
                label: (record) => (record.pinned ? "Unpin" : "Pin"),
                pressed: (record) => !!record.pinned,
                onClick: (record) => {
                  const pinned = !record.pinned;
                  setRecords((current) =>
                    current.map((memory) =>
                      memory.id === record.id ? { ...memory, pinned } : memory,
                    ),
                  );
                  pushLog(
                    `${pinned ? "Pinned" : "Unpinned"} “${titleOf(record.id)}”`,
                  );
                },
              },
              {
                id: "archive",
                label: "Archive",
                hidden: (record) => record.status === "archived",
                onClick: (record) => {
                  setRecords((current) =>
                    current.map((memory) =>
                      memory.id === record.id
                        ? { ...memory, status: "archived" }
                        : memory,
                    ),
                  );
                  pushLog(`Archived “${titleOf(record.id)}”`);
                },
              },
            ]}
            renderRegion={
              customDetail
                ? {
                    // Only the body is ours — the inspector's panel, pinned
                    // title and scroll area stay the shell's, and its uniform
                    // inset wraps this content, so no padding here.
                    detail: ({ selectedMemory, selectMemory }) => (
                      <div className="border-l-2 border-cyan-500/50 pl-3">
                        <p className="text-xs uppercase tracking-widest opacity-60">
                          Your own detail body
                        </p>
                        <h3 className="my-3 text-lg">
                          {selectedMemory?.title}
                        </h3>
                        <p className="text-sm opacity-70">
                          {selectedMemory?.content ?? selectedMemory?.summary}
                        </p>
                        <button
                          type="button"
                          className="mt-4 text-sm underline"
                          onClick={() => selectMemory(null)}
                        >
                          Clear selection
                        </button>
                      </div>
                    ),
                  }
                : undefined
            }
          />
        </div>
      }
    />
  );
};

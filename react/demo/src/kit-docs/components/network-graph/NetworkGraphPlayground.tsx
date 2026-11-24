import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import { useMemo, useState } from "react";
import {
  ColorSwatches,
  NetworkGraph,
  findNetworkPath,
} from "@cjlapao/ui-kit";
import type {
  ButtonVariant,
  GridBackgroundPattern,
  SurfaceVariant,
  SurfaceCorner,
  GlassOpacity,
  GlassVibrancy,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  buttonVariantOptions,
  surfaceVariantOptions,
  panelCornerOptions,
} from "../../shared/options";
import { communities, makeNetwork } from "./data";

export function NetworkGraphPlayground() {
  const [variant, setVariant] = useState<SurfaceVariant>("glass");
  const [tone, setTone] = useState<SurfaceTone>("none");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [raisedSurface, setRaisedSurface] = useState(false);
  const [opacity, setOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [count, setCount] = useState("180");
  const [legendPosition, setLegendPosition] = useState<
    "auto" | "right" | "bottom"
  >("auto");
  const [legendPanel, setLegendPanel] = useState(false);
  const [legendVariant, setLegendVariant] = useState<"auto" | SurfaceVariant>(
    "auto",
  );
  const [legendTone, setLegendTone] = useState<"auto" | SurfaceTone>("auto");
  const [legend, setLegend] = useState(true);
  const [labels, setLabels] = useState(false);
  const [path, setPath] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [inspector, setInspector] = useState(true);
  const [inspectorVariant, setInspectorVariant] = useState<
    "auto" | SurfaceVariant
  >("auto");
  const [inspectorTone, setInspectorTone] = useState<"auto" | SurfaceTone>(
    "auto",
  );
  const [inspectorButtonVariant, setInspectorButtonVariant] =
    useState<ButtonVariant>("solid");
  const [inspectorButtonTone, setInspectorButtonTone] =
    useState<TrueColor>("sky");
  const [customBody, setCustomBody] = useState(false);
  const [autoRevealSelected, setAutoRevealSelected] = useState(true);
  const [autoCenterSelected, setAutoCenterSelected] = useState(true);
  const [autoFitOnInspector, setAutoFitOnInspector] = useState(false);
  const [grid, setGrid] = useState(true);
  const [gridPattern, setGridPattern] = useState<GridBackgroundPattern>("dots");
  const [gridTone, setGridTone] = useState<TrueColor>("blue");
  const [hoverHighlight, setHoverHighlight] = useState(true);
  const [fullHeight, setFullHeight] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [log, pushLog] = useEventLog();
  const graph = useMemo(
    () => makeNetwork(empty ? 0 : Number(count)),
    [count, empty],
  );
  const highlighted = useMemo(
    () =>
      path
        ? findNetworkPath(graph.edges, "node-22", `node-${Number(count) - 1}`)
        : [],
    [path, graph, count],
  );
  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "appearance",
                title: "Appearance",
                controls: (
                  <>
                    <SelectControl
                      label="Variant"
                      value={variant}
                      options={surfaceVariantOptions}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
                    />
                    <Control label="Tone">
                      <SurfaceToneSwatches value={tone} onSelect={setTone} />
                    </Control>
                    <SelectControl
                      label="Corner"
                      value={corner}
                      options={panelCornerOptions}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Glass opacity"
                      value={String(opacity)}
                      options={[
                        { label: "Clear", value: "clear" },
                        { label: "Frosted", value: "frosted" },
                        { label: "Light", value: "light" },
                      ]}
                      onChange={(v) => setOpacity(v as GlassOpacity)}
                    />
                    <SelectControl
                      label="Vibrancy"
                      value={String(vibrancy)}
                      options={[
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" },
                      ]}
                      onChange={(v) => setVibrancy(v as GlassVibrancy)}
                    />
                    {/* One depth step up, for graphs that blend into the page. */}
                    <ToggleRow
                      label="Raised surface"
                      checked={raisedSurface}
                      onChange={setRaisedSurface}
                    />
                  </>
                ),
              },
              {
                id: "network",
                title: "Network",
                controls: (
                  <>
                    <SelectControl
                      label="Nodes"
                      value={count}
                      options={[
                        { label: "60 nodes", value: "60" },
                        { label: "180 nodes", value: "180" },
                        { label: "2,000 nodes", value: "2000" },
                      ]}
                      onChange={setCount}
                    />
                    <ToggleRow
                      label="Legend panel"
                      checked={legendPanel}
                      onChange={setLegendPanel}
                    />
                    <SelectControl
                      label="Legend variant"
                      value={legendVariant}
                      options={[
                        { label: "Auto (parent)", value: "auto" },
                        ...surfaceVariantOptions,
                      ]}
                      onChange={(v) =>
                        setLegendVariant(v as typeof legendVariant)
                      }
                    />
                    <Control label="Legend tone">
                      <ToggleRow
                        label="Follow parent tone"
                        checked={legendTone === "auto"}
                        onChange={(follow) =>
                          setLegendTone(follow ? "auto" : tone)
                        }
                      />
                      {legendTone !== "auto" && (
                        <SurfaceToneSwatches value={legendTone} onSelect={setLegendTone} />
                      )}
                    </Control>
                    <SelectControl
                      label="Legend position"
                      value={legendPosition}
                      options={[
                        { label: "Auto", value: "auto" },
                        { label: "Right", value: "right" },
                        { label: "Bottom", value: "bottom" },
                      ]}
                      onChange={(v) =>
                        setLegendPosition(v as typeof legendPosition)
                      }
                    />
                    <ToggleRow
                      label="Community legend"
                      checked={legend}
                      onChange={setLegend}
                    />
                    <ToggleRow
                      label="Node labels"
                      checked={labels}
                      onChange={setLabels}
                    />
                    <ToggleRow
                      label="Grid background"
                      checked={grid}
                      onChange={setGrid}
                    />
                    {grid && (
                      <>
                        <SelectControl
                          label="Grid pattern"
                          value={gridPattern}
                          options={[
                            { label: "Dots", value: "dots" },
                            { label: "Lines", value: "grid" },
                          ]}
                          onChange={(v) =>
                            setGridPattern(v as GridBackgroundPattern)
                          }
                        />
                        <Control label="Grid tone">
                          <ColorSwatches
                            selectable
                            size="sm"
                            value={gridTone}
                            onSelect={setGridTone}
                            defaultExpanded
                          />
                        </Control>
                      </>
                    )}
                    <ToggleRow
                      label="Highlight a path"
                      checked={path}
                      onChange={setPath}
                    />
                    <ToggleRow
                      label="Hover highlight"
                      checked={hoverHighlight}
                      onChange={setHoverHighlight}
                    />
                    <ToggleRow
                      label="Full height"
                      checked={fullHeight}
                      onChange={setFullHeight}
                    />
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                  </>
                ),
              },
              {
                id: "inspector",
                title: "Inspector",
                controls: (
                  <>
                    <ToggleRow
                      label="Inspector panel"
                      checked={inspector}
                      onChange={setInspector}
                    />
                    <ToggleRow
                      label="Auto-reveal selected"
                      checked={autoRevealSelected}
                      onChange={setAutoRevealSelected}
                    />
                    {autoRevealSelected && (
                      <ToggleRow
                        label="Auto-center selected"
                        checked={autoCenterSelected}
                        onChange={setAutoCenterSelected}
                      />
                    )}
                    <ToggleRow
                      label="Auto-fit on inspector open"
                      checked={autoFitOnInspector}
                      onChange={setAutoFitOnInspector}
                    />
                    <SelectControl
                      label="Inspector variant"
                      value={inspectorVariant}
                      options={[
                        { label: "Auto (parent)", value: "auto" },
                        ...surfaceVariantOptions,
                      ]}
                      onChange={(v) =>
                        setInspectorVariant(v as typeof inspectorVariant)
                      }
                    />
                    <Control label="Inspector tone">
                      <ToggleRow
                        label="Follow parent tone"
                        checked={inspectorTone === "auto"}
                        onChange={(follow) =>
                          setInspectorTone(follow ? "auto" : tone)
                        }
                      />
                      {inspectorTone !== "auto" && (
                        <SurfaceToneSwatches
                          value={inspectorTone}
                          onSelect={setInspectorTone}
                        />
                      )}
                    </Control>
                    <SelectControl
                      label="Button variant"
                      value={inspectorButtonVariant}
                      options={buttonVariantOptions}
                      onChange={(v) =>
                        setInspectorButtonVariant(v as ButtonVariant)
                      }
                    />
                    <Control label="Button tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={inspectorButtonTone}
                        onSelect={setInspectorButtonTone}
                        defaultExpanded
                      />
                    </Control>
                    <ToggleRow
                      label="Custom body"
                      checked={customBody}
                      onChange={setCustomBody}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="Empty"
                      checked={empty}
                      onChange={setEmpty}
                    />
                  </>
                ),
              },
            ]}
          />
          <EventLogControl log={log} />
        </div>
      }
      preview={
        <div className="w-full" style={{ height: fullHeight ? 640 : undefined }}>
          <NetworkGraph
            {...graph}
            communities={communities}
            variant={variant}
            tone={tone}
            corner={corner}
            raisedSurface={raisedSurface}
            glassOpacity={opacity}
            vibrancy={vibrancy}
            height={440}
            fullHeight={fullHeight}
            fullWidth={fullWidth}
            showCommunities={legend}
            legendPosition={legendPosition}
            legendPanel={legendPanel}
            legendVariant={legendVariant}
            legendTone={legendTone}
            inspector={inspector}
            autoRevealSelected={autoRevealSelected}
            autoCenterSelected={autoCenterSelected}
            autoFitOnInspector={autoFitOnInspector}
            inspectorVariant={inspectorVariant}
            inspectorTone={inspectorTone}
            inspectorButtonVariant={inspectorButtonVariant}
            inspectorButtonTone={inspectorButtonTone}
            renderInspectorBody={
              customBody
                ? (node, info) => (
                    <div className="space-y-2 text-sm">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Custom body · {node.id}
                      </p>
                      <p>
                        {info.connectionCount} connection
                      {info.connectionCount === 1 ? "" : "s"}
                      {info.community ? ` in ${info.community.label}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {info.neighbors.map((neighbor) => (
                        <span
                          key={neighbor.id}
                          className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800"
                        >
                          {neighbor.label ?? neighbor.id}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              : undefined
          }
          showLabels={labels}
          highlightedEdgeIds={highlighted}
          grid={grid ? { pattern: gridPattern } : false}
          gridTone={gridTone}
          hoverHighlight={hoverHighlight}
          disabled={disabled}
          loading={loading}
          onNodeSelect={(node) => pushLog(`Selected: ${node?.label ?? "none"}`)}
          onVisibleCommunitiesChange={(ids) =>
            pushLog(`Communities: ${ids.length}`)
          }
        />
        </div>
      }
    />
  );
}

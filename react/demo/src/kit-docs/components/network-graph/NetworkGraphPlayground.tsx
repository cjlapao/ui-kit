import { useMemo, useState } from "react";
import { ColorSwatches, NetworkGraph, findNetworkPath } from "@cjlapao/ui-kit";
import type {
  SurfaceVariant,
  SurfaceCorner,
  TrueColor,
  GlassOpacity,
  GlassVibrancy,
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
  surfaceVariantOptions,
  panelCornerOptions,
} from "../../shared/options";
import { communities, makeNetwork } from "./data";

export function NetworkGraphPlayground() {
  const [variant, setVariant] = useState<SurfaceVariant>("glass");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
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
  const [legendTone, setLegendTone] = useState<"auto" | TrueColor>("auto");
  const [legend, setLegend] = useState(true);
  const [labels, setLabels] = useState(false);
  const [path, setPath] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
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
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
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
                        <ColorSwatches
                          selectable
                          size="sm"
                          value={legendTone}
                          onSelect={setLegendTone}
                          defaultExpanded
                        />
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
                      label="Highlight a path"
                      checked={path}
                      onChange={setPath}
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
        <NetworkGraph
          {...graph}
          communities={communities}
          variant={variant}
          tone={tone}
          corner={corner}
          glassOpacity={opacity}
          vibrancy={vibrancy}
          height={440}
          showCommunities={legend}
          legendPosition={legendPosition}
          legendPanel={legendPanel}
          legendVariant={legendVariant}
          legendTone={legendTone}
          showLabels={labels}
          highlightedEdgeIds={highlighted}
          disabled={disabled}
          loading={loading}
          onNodeSelect={(node) => pushLog(`Selected: ${node?.label ?? "none"}`)}
          onVisibleCommunitiesChange={(ids) =>
            pushLog(`Communities: ${ids.length}`)
          }
        />
      }
    />
  );
}

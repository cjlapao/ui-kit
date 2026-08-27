import React, { useState } from "react";
import { ConnectionFlow } from "@cjlapao/ui-kit";
import type {
  ConnectionFlowEdgeStyle,
  ConnectionFlowItemProgress,
  ConnectionFlowLoader,
  ConnectionFlowProgressType,
  ConnectionFlowRingSize,
  ConnectionState,
  ControlSize,
  PanelVariant,
  SurfaceCorner,
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
  connectionFlowEdgeStyleOptions,
  connectionFlowItemCapOptions,
  connectionFlowItemProgressOptions,
  connectionFlowLoaderOptions,
  connectionFlowProgressOptions,
  connectionFlowRingSizeOptions,
  connectionStateOptions,
  controlSizeOptions,
  panelCornerOptions,
  connectionFlowVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import { CI_FLOW } from "./examples/sampleFlow";

export const ConnectionFlowPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [variant, setVariant] = useState<PanelVariant | "plain">("outlined");
  const [edgeStyle, setEdgeStyle] =
    useState<ConnectionFlowEdgeStyle>("orthogonal");
  const [ringSize, setRingSize] = useState<ConnectionFlowRingSize>("md");
  const [flowState, setFlowState] = useState<ConnectionState>("flowing");
  const [progressType, setProgressType] =
    useState<ConnectionFlowProgressType>("bar");
  const [itemProgress, setItemProgress] =
    useState<ConnectionFlowItemProgress>("bar");
  const [maxVisibleItems, setMaxVisibleItems] = useState(2);
  const [loaderType, setLoaderType] = useState<ConnectionFlowLoader>("skeleton");
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [dotSpeed, setDotSpeed] = useState(120);
  const [dotInterval, setDotInterval] = useState(700);

  const [autoState, setAutoState] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [highlightPath, setHighlightPath] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [interactive, setInteractive] = useState(true);

  const [selected, setSelected] = useState<string | null>(null);

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
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as ControlSize)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(value) => setTone(value as TrueColor)}
                    />
                    <SelectControl
                      label="Variant"
                      options={connectionFlowVariantOptions}
                      value={variant}
                      onChange={(value) =>
                        setVariant(value as PanelVariant | "plain")
                      }
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(value) => setCorner(value as SurfaceCorner)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <SelectControl
                      label="Loader"
                      options={connectionFlowLoaderOptions}
                      value={loaderType}
                      onChange={(value) =>
                        setLoaderType(value as ConnectionFlowLoader)
                      }
                    />
                    <SelectControl
                      label="Flow state"
                      options={connectionStateOptions}
                      value={flowState}
                      onChange={(value) => setFlowState(value as ConnectionState)}
                    />
                    <Control label="Behaviour">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Loading"
                          checked={loading}
                          onChange={setLoading}
                        />
                        <ToggleRow
                          label="Header"
                          checked={showHeader}
                          onChange={setShowHeader}
                        />
                        <ToggleRow
                          label="Auto state"
                          checked={autoState}
                          onChange={setAutoState}
                        />
                        <ToggleRow
                          label="Animated"
                          checked={animated}
                          onChange={setAnimated}
                        />
                        <ToggleRow
                          label="Highlight path"
                          checked={highlightPath}
                          onChange={setHighlightPath}
                        />
                        <ToggleRow
                          label="Zoom controls"
                          checked={showControls}
                          onChange={setShowControls}
                        />
                        <ToggleRow
                          label="Zoom / pan"
                          checked={interactive}
                          onChange={setInteractive}
                        />
                      </div>
                    </Control>
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <SelectControl
                      label="Edge style"
                      options={connectionFlowEdgeStyleOptions}
                      value={edgeStyle}
                      onChange={(value) =>
                        setEdgeStyle(value as ConnectionFlowEdgeStyle)
                      }
                    />
                    <SelectControl
                      label="Ring size"
                      options={connectionFlowRingSizeOptions}
                      value={ringSize}
                      onChange={(value) => setRingSize(value as ConnectionFlowRingSize)}
                    />
                    <SelectControl
                      label="Progress"
                      options={connectionFlowProgressOptions}
                      value={progressType}
                      onChange={(value) =>
                        setProgressType(value as ConnectionFlowProgressType)
                      }
                    />
                    <SelectControl
                      label="Item progress"
                      options={connectionFlowItemProgressOptions}
                      value={itemProgress}
                      onChange={(value) =>
                        setItemProgress(value as ConnectionFlowItemProgress)
                      }
                    />
                    <SelectControl
                      label="Rows before “show more”"
                      options={connectionFlowItemCapOptions}
                      value={String(maxVisibleItems)}
                      onChange={(value) => setMaxVisibleItems(Number(value))}
                    />
                  </>
                ),
              },
              {
                id: "motion",
                title: "Motion",
                controls: (
                  <>
                    <SelectControl
                      label="Dot speed"
                      options={[
                        { label: "60 px/s", value: "60" },
                        { label: "120 px/s", value: "120" },
                        { label: "180 px/s", value: "180" },
                        { label: "240 px/s", value: "240" },
                        { label: "360 px/s", value: "360" },
                        { label: "480 px/s", value: "480" },
                      ]}
                      value={String(dotSpeed)}
                      onChange={(value) => setDotSpeed(Number(value))}
                    />
                    <SelectControl
                      label="Dot interval"
                      options={[
                        { label: "250 ms", value: "250" },
                        { label: "450 ms", value: "450" },
                        { label: "700 ms", value: "700" },
                        { label: "1200 ms", value: "1200" },
                      ]}
                      value={String(dotInterval)}
                      onChange={(value) => setDotInterval(Number(value))}
                    />
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Every edge — track, fan, child and bypass alike — is routed by one
            port-and-shape engine, so <strong>edge style</strong> applies to all
            of them at once. Scroll to zoom, drag to pan, and hover a node to
            light the path that reached it. <strong>Variant</strong> is one
            decision, not two: the cards take the surface of the panel they sit
            in rather than a scale of their own. Every dot moves at one{" "}
            <strong>speed</strong>, and each source releases one at a time —
            first target, second, third, then round again — so a fan reads as
            one source feeding its targets rather than as a swarm. The matrix
            cards are built from{" "}
            <strong>items</strong>: one runs past the cap so the rest fold
            behind “show more”, one shows a spinner in place of its glyph until
            it finishes, and “Announce on Discord” is capped with{" "}
            <code>maxHeight</code> so its body scrolls.
          </p>
        </div>
      }
      preview={
        <div className="w-full space-y-2">
          <ConnectionFlow
            nodes={CI_FLOW}
            variant={variant}
            eyebrow="release_canary.yml"
            title="Release Canary version"
            subtitle="on: workflow_dispatch"
            icon="Rocket"
            tag="LIVE"
            tagTone="emerald"
            showHeader={showHeader}
            loading={loading}
            loaderType={loaderType}
            size={size}
            tone={tone}
            corner={corner}
            edgeStyle={edgeStyle}
            ringSize={ringSize}
            flowState={flowState}
            progressType={progressType}
            itemProgress={itemProgress}
            dotSpeed={dotSpeed}
            dotInterval={dotInterval}
            maxVisibleItems={maxVisibleItems}
            autoState={autoState}
            animated={animated}
            highlightPath={highlightPath}
            showControls={showControls}
            interactive={interactive}
            height={520}
            onNodeClick={(node) => setSelected(node.id)}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {selected ? `Selected: ${selected}` : "Click a node to select it."}
          </p>
        </div>
      }
    />
  );
};

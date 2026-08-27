import React, { useState } from "react";
import { InfoRow, Panel } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  InfoRowLoader,
  InfoRowVariant,
  SurfaceCorner,
  SurfacePadding,
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
  controlSizeOptions,
  infoRowLoaderOptions,
  infoRowVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../../shared/options";

const LONG =
  "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

export const InfoRowPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InfoRowVariant>("plain");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<SurfacePadding | "auto">("auto");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-xl");
  const [loaderType, setLoaderType] = useState<InfoRowLoader>("skeleton");

  const [copyable, setCopyable] = useState(true);
  const [mono, setMono] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [noBorder, setNoBorder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [longValue, setLongValue] = useState(false);
  const [emptyValue, setEmptyValue] = useState(false);
  const [hideIfEmpty, setHideIfEmpty] = useState(false);

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
                      options={infoRowVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as InfoRowVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Padding"
                      options={[{ label: "auto (from size)", value: "auto" }, ...panelPaddingOptions]}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding | "auto")}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Loader"
                      options={infoRowLoaderOptions}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as InfoRowLoader)}
                    />
                  </>
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <Control label="Behaviour">
                    <div className="space-y-1.5">
                      <ToggleRow label="Copyable" checked={copyable} onChange={setCopyable} />
                      <ToggleRow label="Mono" checked={mono} onChange={setMono} />
                      <ToggleRow label="Wrap" checked={wrap} onChange={setWrap} />
                      <ToggleRow label="Hoverable" checked={hoverable} onChange={setHoverable} />
                      <ToggleRow label="No border" checked={noBorder} onChange={setNoBorder} />
                    </div>
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <div className="space-y-1.5">
                      <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                      <ToggleRow label="Error" checked={errored} onChange={setErrored} />
                      <ToggleRow label="Long value" checked={longValue} onChange={setLongValue} />
                      <ToggleRow label="Empty value" checked={emptyValue} onChange={setEmptyValue} />
                      <ToggleRow
                        label="Hide if empty"
                        checked={hideIfEmpty}
                        onChange={setHideIfEmpty}
                      />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A <code>plain</code> row is its own root element, so the hairline's{" "}
            <code>last:border-0</code> still matches among siblings. Any other
            variant wraps the row in a <code>Panel</code>. Turn on{" "}
            <strong>Long value</strong> and hover or tab to the value to see the
            truncation tooltip — it is portaled, so a scrolling panel cannot
            clip it.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-xl">
          <Panel variant="outlined" padding="sm">
            {["Image digest", "Region", "Replicas"].map((label, i) => (
              <InfoRow
                key={label}
                label={label}
                value={
                  emptyValue && i === 0
                    ? ""
                    : longValue && i === 0
                      ? LONG
                      : i === 0
                        ? "sha256:9f86d0"
                        : i === 1
                          ? "eu-west-1"
                          : 3
                }
                variant={variant}
                tone={tone}
                size={size}
                padding={padding === "auto" ? undefined : padding}
                corner={corner}
                copyable={copyable}
                mono={mono}
                wrap={wrap}
                hoverable={hoverable}
                noBorder={noBorder}
                loading={loading && i === 0}
                loaderType={loaderType}
                error={errored && i === 0 ? "Registry unreachable" : undefined}
                hideIfEmpty={hideIfEmpty}
              />
            ))}
          </Panel>
        </div>
      }
    />
  );
};

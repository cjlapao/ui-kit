import React, { useState } from "react";
import { SplitView, SPLIT_VIEW_LOADERS, Pill } from "@cjlapao/ui-kit";
import type {
  InputVariant,
  SplitViewLoader,
  SurfaceVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  inputVariantOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const sizeOptions = controlSizeOptions.filter((o) =>
  ["sm", "md", "lg"].includes(o.value),
);

/** A sub-item list, so a row can expand in place instead of only opening the pane. */
const Replicas: React.FC<{ names: string[]; tone: TrueColor }> = ({
  names,
  tone,
}) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li
        key={name}
        className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300"
      >
        <span className="truncate">{name}</span>
        <Pill size="sm" tone={tone} variant="soft">
          ready
        </Pill>
      </li>
    ))}
  </ul>
);

export const SplitViewPlayground: React.FC = () => {
  const [tone, setTone] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<SurfaceVariant>("subtle");
  const [surfaceTone, setSurfaceTone] = useState<TrueColor>("neutral");
  const [searchVariant, setSearchVariant] = useState<string>("");
  const [size, setSize] = useState("md");
  const [loaderType, setLoaderType] = useState<SplitViewLoader>("skeleton");
  const [collapsible, setCollapsible] = useState(true);
  const [resizable, setResizable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [showHighlightIndicator, setShowHighlightIndicator] = useState(true);
  const [withSubItems, setWithSubItems] = useState(true);
  const [autoExpand, setAutoExpand] = useState(false);

  const items = [
    {
      id: "a",
      label: "api-gateway",
      subtitle: "eu-west-1",
      icon: "Container" as const,
      panel: <div className="p-6 text-sm">Gateway detail</div>,
      subContent: withSubItems ? (
        <Replicas names={["gateway-7f4c", "gateway-9d21"]} tone={tone} />
      ) : undefined,
    },
    {
      id: "b",
      label: "worker-pool",
      subtitle: "us-east-1",
      icon: "Container" as const,
      panel: <div className="p-6 text-sm">Worker detail</div>,
      subContent: withSubItems ? (
        <Replicas names={["worker-01", "worker-02", "worker-03"]} tone={tone} />
      ) : undefined,
    },
    {
      id: "c",
      label: "batch-runner",
      subtitle: "ap-south-1",
      icon: "Container" as const,
      panel: <div className="p-6 text-sm">Batch detail</div>,
      highlight: true,
      subContent: withSubItems ? (
        <Replicas names={["batch-nightly"]} tone={tone} />
      ) : undefined,
    },
  ];

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
                    <ChoiceControl label="Variant" options={surfaceVariantOptions}
                      value={variant} onChange={(v) => setVariant(v as SurfaceVariant)} />
                    <ChoiceControl label="Accent tone" options={trueColorOptions}
                      value={tone} onChange={(v) => setTone(v as TrueColor)} />
                    <ChoiceControl label="Surface tone" options={trueColorOptions}
                      value={surfaceTone} onChange={(v) => setSurfaceTone(v as TrueColor)} />
                    <ChoiceControl label="Size" options={sizeOptions} value={size} onChange={setSize} />
                  </>
                ),
              },
              {
                id: "search",
                title: "Search",
                controls: (
                  <ChoiceControl
                    label="Search variant"
                    options={[{ label: "(follows surface)", value: "" }, ...inputVariantOptions]}
                    value={searchVariant}
                    onChange={setSearchVariant}
                  />
                ),
              },
              {
                id: "loader",
                title: "Loader",
                controls: (
                  <ChoiceControl
                    label="Loader"
                    options={SPLIT_VIEW_LOADERS.map((v) => ({ label: v, value: v }))}
                    value={loaderType}
                    onChange={(v) => setLoaderType(v as SplitViewLoader)}
                  />
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <Control label="Layout">
                      <div className="space-y-1.5">
                        <ToggleRow label="Collapsible" checked={collapsible} onChange={setCollapsible} />
                        <ToggleRow label="Resizable" checked={resizable} onChange={setResizable} />
                      </div>
                    </Control>
                    <Control label="Rows">
                      <div className="space-y-1.5">
                        <ToggleRow label="Sub-items" checked={withSubItems} onChange={setWithSubItems} />
                        <ToggleRow label="Expand on select" checked={autoExpand} onChange={setAutoExpand} />
                        <ToggleRow
                          label="New-item indicator"
                          checked={showHighlightIndicator}
                          onChange={setShowHighlightIndicator}
                        />
                      </div>
                    </Control>
                  </>
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
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Accent tone</strong> drives the active row, the resizer and
            the search field; <strong>surface tone</strong> tints the panes and
            stays neutral by default — an accent that matches its own
            background has nothing to stand out against. The surface comes from
            the same family as <code>Panel</code>, and
            the search field follows it unless you override it — try{" "}
            <strong>glass</strong>. Turn <strong>Expand on select</strong> off
            and a caret appears on rows that have sub-items, so a row can open
            in place instead of only filling the pane.{" "}
            <strong>New-item indicator</strong> drops the pulsing dot on{" "}
            <code>highlight</code> rows while keeping their accent tint.
          </p>
        </div>
      }
      preview={
        <div className="h-96 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
          <SplitView
            items={items}
            tone={tone}
            surfaceTone={surfaceTone}
            variant={variant}
            searchVariant={(searchVariant || undefined) as InputVariant | undefined}
            size={size as "md"}
            listTitle="Capsules"
            collapsible={collapsible}
            resizable={resizable}
            autoExpand={autoExpand}
            showHighlightIndicator={showHighlightIndicator}
            loading={loading}
            loaderType={loaderType}
            loadingProgress={loaderType === "progress" ? 62 : undefined}
            error={errored ? "Could not reach the registry" : undefined}
            onRetry={() => {}}
          />
        </div>
      }
    />
  );
};

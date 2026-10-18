import React, { useState } from "react";
import {
  ColorSwatches,
  SplitView,
  SPLIT_VIEW_LOADERS,
  Pill,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  InputVariant,
  SplitViewItem,
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  inputVariantOptions,
  surfaceVariantOptions,
} from "../../shared/options";

// The shared control scale, whole — same sizes as every
// other component.
const sizeOptions = controlSizeOptions;

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
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [surfaceTone, setSurfaceTone] = useState<TrueColor>("neutral");
  const [toneAuto, setToneAuto] = useState(false);
  const [searchVariant, setSearchVariant] = useState<string>("");
  const [size, setSize] = useState<ControlSize>("md");
  const [loaderType, setLoaderType] = useState<SplitViewLoader>("skeleton");
  const [collapsible, setCollapsible] = useState(true);
  const [resizable, setResizable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  // The shared log — the pattern this playground invented, now lifted into
  // shared/EventLog so every playground reads the same.
  const [log, pushLog] = useEventLog();
  const [showHighlightIndicator, setShowHighlightIndicator] = useState(true);
  const [withSubItems, setWithSubItems] = useState(true);
  const [autoExpand, setAutoExpand] = useState(false);

  const items: SplitViewItem[] = [
    {
      id: "a",
      label: "api-gateway",
      subtitle: "eu-west-1",
      icon: "Container" as const,
      panel: <div className="p-6 text-sm">Gateway detail</div>,
      menu: [
        { label: "Rename", value: "rename" },
        { label: "Duplicate", value: "duplicate" },
        { label: "Delete", value: "delete", danger: true },
      ],
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
      menu: [
        { label: "Rename", value: "rename" },
        { label: "Duplicate", value: "duplicate" },
        { label: "Delete", value: "delete", danger: true },
      ],
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
      menu: [
        { label: "Rename", value: "rename" },
        { label: "Duplicate", value: "duplicate" },
        { label: "Delete", value: "delete", danger: true },
      ],
      highlight: true,
      subContent: withSubItems ? (
        <Replicas names={["batch-nightly"]} tone={tone} />
      ) : undefined,
      subItems: withSubItems
        ? [
            {
              id: "c-1",
              label: "batch-nightly-2f",
              menu: [{ label: "Restart", value: "restart" }],
              onClick: (sub) => pushLog(`Sub-item ${String(sub.label)}`),
            },
            {
              id: "c-2",
              label: "batch-nightly-8a",
              menu: [{ label: "Restart", value: "restart" }],
              onClick: (sub) => pushLog(`Sub-item ${String(sub.label)}`),
            },
          ]
        : undefined,
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
                    <ChoiceControl
                      label="Variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
                    />
                    {/* Both are colour decisions — pick them from colour
                        swatches, not from a dropdown of colour names. */}
                    <Control label="Accent tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <Control label="Surface tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={surfaceTone}
                        onSelect={setSurfaceTone}
                        defaultExpanded
                      />
                    </Control>
                    <ToggleRow
                      label="Surface tone follows accent"
                      checked={toneAuto}
                      onChange={setToneAuto}
                    />
                    <ChoiceControl
                      label="Size"
                      options={sizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                  </>
                ),
              },
              {
                id: "search",
                title: "Search",
                controls: (
                  <ChoiceControl
                    label="Search variant"
                    options={[
                      { label: "(follows surface)", value: "" },
                      ...inputVariantOptions,
                    ]}
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
                    options={SPLIT_VIEW_LOADERS.map((v) => ({
                      label: v,
                      value: v,
                    }))}
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
                        <ToggleRow
                          label="Collapsible"
                          checked={collapsible}
                          onChange={setCollapsible}
                        />
                        <ToggleRow
                          label="Resizable"
                          checked={resizable}
                          onChange={setResizable}
                        />
                      </div>
                    </Control>
                    <Control label="Rows">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Sub-items"
                          checked={withSubItems}
                          onChange={setWithSubItems}
                        />
                        <ToggleRow
                          label="Dots always visible"
                          checked={menuVisible}
                          onChange={setMenuVisible}
                        />
                        <ToggleRow
                          label="Expand on select"
                          checked={autoExpand}
                          onChange={setAutoExpand}
                        />
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
                      <ToggleRow
                        label="Loading"
                        checked={loading}
                        onChange={setLoading}
                      />
                      <ToggleRow
                        label="Error"
                        checked={errored}
                        onChange={setErrored}
                      />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — click rows, sub-items or menu options."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Accent tone</strong> drives the active row, the resizer and
            the search field; <strong>surface tone</strong> always paints the
            divider between the panes and colours the surface the way the
            variant handles a tone — fill, wash or rule. The surface comes from
            the same family as <code>Panel</code>, and the search field follows
            it unless you override it — try <strong>glass</strong>. Turn{" "}
            <strong>Expand on select</strong> off and a caret appears on rows
            that have sub-items, so a row can open in place instead of only
            filling the pane. <strong>New-item indicator</strong> drops the
            pulsing dot on <code>highlight</code> rows while keeping their
            accent tint. Row menus sit just before the caret — turn{" "}
            <strong>Dots always visible</strong> to keep them in place instead
            of on hover — and the <strong>Event log</strong> below records what
            you clicked.
          </p>
        </div>
      }
      preview={
        // No border of its own: variants that carry an edge (outlined,
        // liquid-glass) were doubling it against the wrapper's grey hairline.
        <div className="h-96 w-full overflow-hidden rounded-lg">
          <SplitView
            items={items}
            tone={tone}
            surfaceTone={toneAuto ? "auto" : surfaceTone}
            variant={variant}
            searchVariant={
              (searchVariant || undefined) as InputVariant | undefined
            }
            size={size}
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
            onChange={(_id, item) => pushLog(`Selected ${String(item.label)}`)}
            onMenuSelect={(item, option) =>
              pushLog(`Menu "${String(option.label)}" → ${String(item.label)}`)
            }
            menuVisibility={menuVisible ? "always" : "hover"}
          />
        </div>
      }
    />
  );
};

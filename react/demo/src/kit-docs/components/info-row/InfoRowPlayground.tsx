import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import React, { useState } from "react";
import { InfoRow, Panel, Toggle } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  IconName,
  InfoRowLoader,
  InfoRowVariant,
  SurfaceCorner,
  SurfacePadding,
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
} from "../../shared/options";

const LONG =
  "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

export const InfoRowPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InfoRowVariant>("elevated");
  const [tone, setTone] = useState<SurfaceTone>("none");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<SurfacePadding | "auto">("auto");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
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
  // The companion of Empty value: `emptyText={null}` renders no placeholder
  // at all, keeping the right edge of a chrome-only row clean.
  const [noPlaceholder, setNoPlaceholder] = useState(false);

  const [icon, setIcon] = useState<"" | IconName>("");
  const [subItems, setSubItems] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [bottomBorder, setBottomBorder] = useState(false);
  // bottomBorder only applies on the simple/none variants; the control says
  // so rather than appearing to do nothing.
  const bottomBorderAllowed = variant === "simple" || variant === "none";

  const rows = ["Image digest", "Region", "Replicas"].map((label, i) => {
    const isAnatomyRow = i === 0;
    return (
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
        emptyText={
          isAnatomyRow && emptyValue && noPlaceholder ? null : undefined
        }
        icon={icon === "" ? undefined : icon}
        subItems={
          subItems && isAnatomyRow
            ? [
                {
                  text: "Policy:",
                  value: "trigger_access.all-agents.sdsd.allow",
                  mono: true,
                },
              ]
            : undefined
        }
        collapsible={collapsible && isAnatomyRow ? true : undefined}
        expanded={collapsible && isAnatomyRow ? expanded : undefined}
        onToggle={collapsible && isAnatomyRow ? setExpanded : undefined}
        body={
          collapsible && isAnatomyRow ? (
            <p>
              Deployed from the release pipeline at 14:32 UTC. This body folds
              open with the same grid-rows animation as the collapsible panel.
            </p>
          ) : undefined
        }
        bottomBorder={bottomBorder}
      />
    );
  });

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
                    <Control label="Tone">
                      <SurfaceToneSwatches value={tone} onSelect={setTone} />
                    </Control>
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Padding"
                      options={[
                        { label: "auto (from size)", value: "auto" },
                        ...panelPaddingOptions,
                      ]}
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
                      <ToggleRow
                        label="Copyable"
                        checked={copyable}
                        onChange={setCopyable}
                      />
                      <ToggleRow
                        label="Mono"
                        checked={mono}
                        onChange={setMono}
                      />
                      <ToggleRow
                        label="Wrap"
                        checked={wrap}
                        onChange={setWrap}
                      />
                      <ToggleRow
                        label="Hoverable"
                        checked={hoverable}
                        onChange={setHoverable}
                      />
                      <ToggleRow
                        label="No border"
                        checked={noBorder}
                        onChange={setNoBorder}
                      />
                    </div>
                  </Control>
                ),
              },
              {
                id: "anatomy",
                title: "Anatomy",
                controls: (
                  <>
                    <SelectControl
                      label="Icon"
                      options={[
                        { label: "none", value: "" },
                        { label: "Check", value: "Check" },
                        { label: "Info", value: "Info" },
                        { label: "Link", value: "Link" },
                        { label: "Key", value: "Key" },
                      ]}
                      value={icon}
                      onChange={(v) => setIcon(v as "" | IconName)}
                    />
                    <Control label="Anatomy">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Sub-items"
                          checked={subItems}
                          onChange={setSubItems}
                        />
                        <ToggleRow
                          label="Collapsible"
                          checked={collapsible}
                          onChange={setCollapsible}
                        />
                        {collapsible ? (
                          <ToggleRow
                            label="Expanded"
                            checked={expanded}
                            onChange={setExpanded}
                          />
                        ) : null}
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- the label wraps the kit Toggle; static association cannot see through the component (same pattern as ToggleRow) */}
                        <label
                          className={
                            bottomBorderAllowed
                              ? "flex cursor-pointer items-center justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                              : "flex cursor-not-allowed items-center justify-between gap-2 text-sm text-neutral-400 dark:text-neutral-500"
                          }
                        >
                          <span>Bottom border</span>
                          <Toggle
                            size="sm"
                            color="blue"
                            checked={bottomBorder}
                            disabled={!bottomBorderAllowed}
                            onChange={(event) =>
                              setBottomBorder(event.target.checked)
                            }
                          />
                        </label>
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
                      <ToggleRow
                        label="Long value"
                        checked={longValue}
                        onChange={setLongValue}
                      />
                      <ToggleRow
                        label="Empty value"
                        checked={emptyValue}
                        onChange={setEmptyValue}
                      />
                      {emptyValue && (
                        <ToggleRow
                          label="No placeholder"
                          checked={noPlaceholder}
                          onChange={setNoPlaceholder}
                        />
                      )}
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
            <strong>Elevated</strong> is the kit default — each row renders a{" "}
            <code>Panel</code> of its own. Switch to <code>plain</code> for the
            details-list texture: the row is then its own root element, so the
            hairline&rsquo;s <code>last:border-0</code> still matches among
            siblings. Turn on <strong>Long value</strong> and hover or tab to
            the value to see the truncation tooltip — it is portaled, so a
            scrolling panel cannot clip it. In <strong>Anatomy</strong>, the
            icon follows the row <code>tone</code>; <strong>Collapsible</strong>{" "}
            makes the whole first row the toggle (the open body and any links
            keep their own clicks);{" "}
            <strong>Bottom border</strong> is honoured by <code>simple</code>{" "}
            and <code>none</code> only, so the switch is disabled on the other
            variants.
          </p>
        </div>
      }
      preview={
        /*
          A row that brings its own `Panel` must not be nested inside another
          one: the host's scrollable content box (`overflow-auto`) clips the
          inner shadows at its padding edge — the cut-off band and the clipped
          corner arcs the eye reads as a rendering bug. Surface rows stand on
          their own, with room for the shadow to fall; only the `plain` rows
          — which draw no surface at all — still need a host panel to sit on.
        */
        <div className="w-full max-w-xl">
          {variant === "plain" ? (
            <Panel variant="outlined" padding="sm" scrollable={false}>
              {rows}
            </Panel>
          ) : (
            <div className="flex flex-col gap-4">{rows}</div>
          )}
        </div>
      }
    />
  );
};

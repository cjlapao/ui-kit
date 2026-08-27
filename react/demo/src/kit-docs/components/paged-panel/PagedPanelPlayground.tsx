import React, { useState } from "react";
import { PagedPanel, PAGED_PANEL_LOADERS } from "@cjlapao/ui-kit";
import type { ControlSize, PagedPanelLoader, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, surfaceVariantOptions, trueColorOptions } from "../../shared/options";

const PAGES = [
  <p key="1" className="text-sm">First page — eu-west-1</p>,
  <p key="2" className="text-sm">Second page — us-east-1</p>,
  <p key="3" className="text-sm">Third page — ap-south-1</p>,
];

export const PagedPanelPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState("elevated");
  const [perPageTitles, setPerPageTitles] = useState(false);
  const [withSubtitle, setWithSubtitle] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<PagedPanelLoader>("skeleton");
  const [errored, setErrored] = useState(false);
  const [bare, setBare] = useState(false);

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
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Variant" options={surfaceVariantOptions} value={variant}
                      onChange={setVariant} />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Header">
                    <div className="space-y-1.5">
                      <ToggleRow label="Per-page titles" checked={perPageTitles} onChange={setPerPageTitles} />
                      <ToggleRow label="Subtitle" checked={withSubtitle} onChange={setWithSubtitle} />
                      <ToggleRow label="Bare (no Panel)" checked={bare} onChange={setBare} />
                    </div>
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <SelectControl label="Loader"
                      options={PAGED_PANEL_LOADERS.map((v) => ({ label: v, value: v }))}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as PagedPanelLoader)} />
                    <Control label="State">
                      <div className="space-y-1.5">
                        <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                        <ToggleRow label="No pages" checked={empty} onChange={setEmpty} />
                        <ToggleRow label="Error" checked={errored} onChange={setErrored} />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The position counter is a polite live region, so paging announces
            the new position — it used to swap the content silently. The nav is
            <code>IconButton</code>, so it takes the panel's tone and the kit's
            focus ring.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-md">
          <PagedPanel
            pages={empty ? [] : PAGES}
            title={perPageTitles ? ["First", "Second", "Third"] : "Regions"}
            subtitle={withSubtitle ? "rolling deploy" : undefined}
            error={errored ? "Could not reach the registry" : undefined}
            loading={loading}
            loaderType={loaderType}
            progress={40}
            size={size}
            tone={tone}
            variant={variant as "elevated"}
            bare={bare}
          />
        </div>
      }
    />
  );
};

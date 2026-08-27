import React, { useState } from "react";
import { TagPanel } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { pillVariantOptions, trueColorOptions } from "../../shared/options";

const sectionSizeOptions = ["sm", "md", "lg"].map((v) => ({ label: v, value: v }));
const pillSizeOptions = ["xs", "sm", "md", "lg"].map((v) => ({ label: v, value: v }));

const TAGS = ["prod", "eu-west-1", "docker", "gpu", "beta", "internal", "v2", "canary"];

export const TagPanelPlayground: React.FC = () => {
  const [size, setSize] = useState("md");
  const [tagSize, setTagSize] = useState("sm");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [variant, setVariant] = useState("soft");
  const [tagLimit, setTagLimit] = useState(5);
  const [empty, setEmpty] = useState(false);

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
                    <SelectControl label="Header size" options={sectionSizeOptions} value={size} onChange={setSize} />
                    <SelectControl label="Pill size" options={pillSizeOptions} value={tagSize} onChange={setTagSize} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Pill variant" options={pillVariantOptions} value={variant} onChange={setVariant} />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Overflow limit">
                    <input type="range" min={0} max={8} value={tagLimit} className="w-full"
                      onChange={(e) => setTagLimit(Number(e.target.value))} />
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <ToggleRow label="No tags" checked={empty} onChange={setEmpty} />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Header size</strong> and <strong>pill size</strong> are two
            different scales — they used to share one prop, so a{" "}
            <code>SectionSize</code> was handed to a <code>Pill</code> that
            expects a <code>PillSize</code>. Set the limit to 0 to show them all.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-md">
          <TagPanel
            title="Tags"
            subtitle="applied to this capsule"
            size={size as "md"}
            tagSize={tagSize as "sm"}
            tagLimit={tagLimit}
            tags={empty ? [] : TAGS.map((label) => ({ label, tone, variant: variant as "soft" }))}
          />
        </div>
      }
    />
  );
};

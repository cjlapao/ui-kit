import React, { useState } from "react";
import {
  ColorSwatches,
  Slider,
  TagPanel,
  type PillSize,
  type PillVariant,
  type SectionSize,
} from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { pillVariantOptions } from "../../shared/options";

const sectionSizeOptions = ["xs", "sm", "md", "lg"].map((v) => ({
  label: v,
  value: v,
}));
const pillSizeOptions = ["xs", "sm", "md", "lg"].map((v) => ({
  label: v,
  value: v,
}));

const TAGS = [
  "prod",
  "eu-west-1",
  "docker",
  "gpu",
  "beta",
  "internal",
  "v2",
  "canary",
];

export const TagPanelPlayground: React.FC = () => {
  const [size, setSize] = useState<SectionSize>("md");
  const [tagSize, setTagSize] = useState<PillSize>("sm");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [variant, setVariant] = useState<PillVariant>("soft");
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
                    <ChoiceControl
                      label="Header size"
                      options={sectionSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as SectionSize)}
                    />
                    <ChoiceControl
                      label="Pill size"
                      options={pillSizeOptions}
                      value={tagSize}
                      onChange={(v) => setTagSize(v as PillSize)}
                    />
                    {/* Tag colour is a colour decision — pick it from
                        swatches, not from a dropdown of words. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <ChoiceControl
                      label="Pill variant"
                      options={pillVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as PillVariant)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label={`Overflow limit — ${tagLimit}`}>
                    <Slider
                      min={0}
                      max={TAGS.length}
                      step={1}
                      value={tagLimit}
                      onChange={(v) => setTagLimit(v as number)}
                      ariaLabel="Overflow limit"
                    />
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <ToggleRow
                      label="No tags"
                      checked={empty}
                      onChange={setEmpty}
                    />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Header size</strong> and <strong>pill size</strong> are two
            different scales — they used to share one prop, so a{" "}
            <code>SectionSize</code> was handed to a <code>Pill</code> that
            expects a <code>PillSize</code>. Past the limit the overflow pills
            unfold the <code>ColorSwatches</code> way — cascaded in, rippled
            out, one chip for both directions. Set the limit to 0 to show them
            all.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-md">
          <TagPanel
            title="Tags"
            subtitle="applied to this capsule"
            size={size}
            tagSize={tagSize}
            tagLimit={tagLimit}
            tags={empty ? [] : TAGS.map((label) => ({ label, tone, variant }))}
          />
        </div>
      }
    />
  );
};

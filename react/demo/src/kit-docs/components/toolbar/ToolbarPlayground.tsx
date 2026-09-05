import React, { useState } from "react";
import { Button, IconButton, Input, Toolbar } from "@cjlapao/ui-kit";
import type { PanelCorner, PanelPadding, PanelVariant, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, Control, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  panelCornerOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const startGroup = (
  <>
    <IconButton icon="Add" variant="ghost" srLabel="Add" />
    <IconButton icon="Send" variant="ghost" srLabel="Send" />
    <IconButton icon="Download" variant="ghost" srLabel="Download" />
  </>
);

const centerGroup = <Input leadingIcon="Search" placeholder="Search" className="w-56" />;

const endGroup = (
  <Button leadingIcon="Save" color="indigo">
    Save
  </Button>
);

export const ToolbarPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [padding, setPadding] = useState<PanelPadding>("xs");
  const [corner, setCorner] = useState<PanelCorner>("rounded-md");
  const [hasStart, setHasStart] = useState(true);
  const [hasCenter, setHasCenter] = useState(true);
  const [hasEnd, setHasEnd] = useState(true);
  const [hasExtra, setHasExtra] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <SelectControl label="Variant" options={surfaceVariantOptions} value={variant}
                      onChange={(v) => setVariant(v as PanelVariant)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding}
                      onChange={(v) => setPadding(v as PanelPadding)} />
                    <SelectControl label="Corner" options={panelCornerOptions} value={corner}
                      onChange={(v) => setCorner(v as PanelCorner)} />
                  </>
                ),
              },
              {
                id: "regions",
                title: "Regions",
                controls: (
                  <Control label="Groups">
                    <div className="space-y-1.5">
                      <ToggleRow label="start — action buttons" checked={hasStart} onChange={setHasStart} />
                      <ToggleRow label="center — search field" checked={hasCenter} onChange={setHasCenter} />
                      <ToggleRow label="end — primary action" checked={hasEnd} onChange={setHasEnd} />
                      <ToggleRow label="extra children group" checked={hasExtra} onChange={setHasExtra} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The surface is Panel&apos;s — same variants, tones, corner and
            padding scales, painted from the same theme helpers. An empty
            region stays in the DOM (as in PrimeVue), so switching{" "}
            <em>only</em> <code>end</code> on still parks the action on the
            right. The bar is <code>role="toolbar"</code>; here it is named
            <code> aria-label="Preview toolbar"</code> — with several toolbars
            on a page, that name is what tells them apart.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Toolbar
            aria-label="Preview toolbar"
            variant={variant}
            tone={tone}
            padding={padding}
            corner={corner}
            start={hasStart ? startGroup : undefined}
            center={hasCenter ? centerGroup : undefined}
            end={hasEnd ? endGroup : undefined}
          >
            {hasExtra ? (
              <Button variant="ghost" size="sm" leadingIcon="Refresh">
                Regenerate
              </Button>
            ) : undefined}
          </Toolbar>
        </div>
      }
    />
  );
};

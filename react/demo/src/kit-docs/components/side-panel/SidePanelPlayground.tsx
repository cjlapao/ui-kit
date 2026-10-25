import React, { useState } from "react";
import {
  Button,
  ColorSwatches,
  SidePanel,
  SIDE_PANEL_SIDES,
  SIDE_PANEL_VARIANTS,
  SURFACE_CORNERS,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  SidePanelSide,
  SidePanelVariant,
  SurfaceCorner,
  SurfacePadding,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, panelPaddingOptions } from "../../shared/options";

export const SidePanelPlayground: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [variant, setVariant] = useState<SidePanelVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surfaceTone, setSurfaceTone] = useState<TrueColor>("neutral");
  const [size, setSize] = useState<ControlSize>("md");
  const [side, setSide] = useState<SidePanelSide>("right");
  const [resizable, setResizable] = useState(true);
  const [collapsible, setCollapsible] = useState(true);
  const [noise, setNoise] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [withFooter, setWithFooter] = useState(true);
  /**
   * "auto" plus the padding scale, not a toggle. `inset` is optional and
   * defaults from the variant — `floating` and `floating-glass` float on
   * their own — so always sending a value would mean no variant ever reached
   * its own default. That is exactly what made `floating` look unpadded.
   */
  const [inset, setInset] = useState<"auto" | SurfacePadding>("auto");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");

  return (
    <PlaygroundPanel
      controls={
        <>
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <ChoiceControl
                      label="Variant"
                      options={SIDE_PANEL_VARIANTS.map((v) => ({
                        label: v,
                        value: v,
                      }))}
                      value={variant}
                      onChange={(v) => setVariant(v as SidePanelVariant)}
                    />
                    {/* Both are colour decisions — pick them from colour swatches,
                  not from a dropdown of colour names. */}
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
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Corner"
                      options={SURFACE_CORNERS.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <ChoiceControl
                      label="Inset"
                      options={[
                        { label: "auto (from variant)", value: "auto" },
                        ...panelPaddingOptions,
                      ]}
                      value={inset}
                      onChange={(v) => setInset(v as "auto" | SurfacePadding)}
                    />
                    <ChoiceControl
                      label="Side"
                      options={SIDE_PANEL_SIDES.map((v) => ({ label: v, value: v }))}
                      value={side}
                      onChange={(v) => setSide(v as SidePanelSide)}
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
                        label="Open"
                        checked={open}
                        onChange={setOpen}
                      />
                      <ToggleRow
                        label="Resizable"
                        checked={resizable}
                        onChange={setResizable}
                      />
                      <ToggleRow
                        label="Collapsible (rail)"
                        checked={collapsible}
                        onChange={setCollapsible}
                      />
                      <ToggleRow
                        label="Overlay"
                        checked={overlay}
                        onChange={setOverlay}
                      />
                      <ToggleRow
                        label="Footer"
                        checked={withFooter}
                        onChange={setWithFooter}
                      />
                      <ToggleRow
                        label="Noise texture"
                        checked={noise}
                        onChange={setNoise}
                      />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            It is <code>position: absolute</code>, so it fills its container
            rather than the viewport and needs a positioned ancestor — the
            bordered box in the preview. Overlaying rather than occupying a
            column means opening it never reflows the content beside it.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Uses the same surface variants as <code>Panel</code> and the workflow
            rail. <strong>Inset</strong> adds a gap from the padding scale on the
            two edges beside the docked one, so the panel is a little shorter
            (or narrower) than its container — docked or overlaid. <strong>Top</strong> and <strong>bottom</strong> run the
            same open, collapse and resize motion on the height axis, folding to
            the header when collapsed. Corner sizing, resizing, and collapse
            controls work with every variant. Legacy <code>floating</code> and
            <code>floating-glass</code> names still imply inset positioning.
          </p>
        </>
      }
      preview={
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            <p className="font-medium">Page content</p>
            <p className="mt-1">
              The panel overlays this rather than pushing it aside, so nothing
              below reflows when it opens.
            </p>
            <Button
              className="mt-3"
              size="xs"
              variant="outline"
              color={tone}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close panel" : "Open panel"}
            </Button>
          </div>
          <SidePanel
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Details"
            subtitle="Everything about this record"
            variant={variant}
            tone={tone}
            surfaceTone={surfaceTone}
            size={size}
            side={side}
            overlay={overlay}
            resizable={resizable}
            collapsible={collapsible}
            collapsedLabel="Inspector"
            noise={noise}
            inset={inset === "auto" ? undefined : inset}
            corner={corner}
            width={280}
            height={200}
            footer={
              withFooter ? (
                <div className="flex justify-end gap-2">
                  <Button size="xs" variant="ghost" color={tone}>
                    Cancel
                  </Button>
                  <Button size="xs" variant="solid" color={tone}>
                    Save
                  </Button>
                </div>
              ) : undefined
            }
          >
            <div className="space-y-3 p-4 text-sm">
              <p>Panel body. Scrolls independently of the page behind it.</p>
              {Array.from({ length: 6 }).map((_, i) => (
                <p key={i} className="text-neutral-500 dark:text-neutral-400">
                  Row {i + 1}
                </p>
              ))}
            </div>
          </SidePanel>
        </div>
      }
    />
  );
};

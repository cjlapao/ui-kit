import React, { useState } from "react";
import {
  Button,
  SidePanel,
  SIDE_PANEL_VARIANTS,
  SURFACE_CORNERS,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  SidePanelSide,
  SidePanelVariant,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

export const SidePanelPlayground: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [variant, setVariant] = useState<SidePanelVariant>("sidebar");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surfaceTone, setSurfaceTone] = useState<TrueColor>("neutral");
  const [size, setSize] = useState<ControlSize>("md");
  const [side, setSide] = useState<SidePanelSide>("right");
  const [resizable, setResizable] = useState(true);
  const [noise, setNoise] = useState(false);
  const [withFooter, setWithFooter] = useState(true);
  /**
   * Tri-state, not a toggle. `inset` is optional and defaults from the
   * variant — `floating` and `floating-glass` float on their own — so a
   * boolean here would send `false` forever and no variant would ever reach
   * its own default. That is exactly what made `floating` look unpadded.
   */
  const [inset, setInset] = useState<"auto" | "on" | "off">("auto");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");

  return (
    <PlaygroundPanel
      controls={
        <>
          <ChoiceControl
            label="Variant"
            options={SIDE_PANEL_VARIANTS.map((v) => ({ label: v, value: v }))}
            value={variant}
            onChange={(v) => setVariant(v as SidePanelVariant)}
          />
          <ChoiceControl label="Accent tone" options={trueColorOptions}
            value={tone} onChange={(v) => setTone(v as TrueColor)} />
          <ChoiceControl label="Surface tone" options={trueColorOptions}
            value={surfaceTone} onChange={(v) => setSurfaceTone(v as TrueColor)} />
          <ChoiceControl label="Size" options={controlSizeOptions}
            value={size} onChange={(v) => setSize(v as ControlSize)} />
          <ChoiceControl
            label="Corner"
            options={SURFACE_CORNERS.map((c) => ({ label: c, value: c }))}
            value={corner}
            onChange={(v) => setCorner(v as SurfaceCorner)}
          />
          <ChoiceControl
            label="Inset"
            options={[
              { label: "auto (from variant)", value: "auto" },
              { label: "on", value: "on" },
              { label: "off", value: "off" },
            ]}
            value={inset}
            onChange={(v) => setInset(v as "auto" | "on" | "off")}
          />
          <ChoiceControl
            label="Side"
            options={[
              { label: "right", value: "right" },
              { label: "left", value: "left" },
            ]}
            value={side}
            onChange={(v) => setSide(v as SidePanelSide)}
          />
          <Control label="Behaviour">
            <div className="space-y-1.5">
              <ToggleRow label="Open" checked={open} onChange={setOpen} />
              <ToggleRow label="Resizable" checked={resizable} onChange={setResizable} />
              <ToggleRow label="Footer" checked={withFooter} onChange={setWithFooter} />
              <ToggleRow label="Noise texture" checked={noise} onChange={setNoise} />
            </div>
          </Control>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            It is <code>position: absolute</code>, so it fills its container
            rather than the viewport and needs a positioned ancestor — the
            bordered box in the preview. Overlaying rather than occupying a
            column means opening it never reflows the content beside it.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The variants are <code>SideMenu</code>&rsquo;s, not{" "}
            <code>Panel</code>&rsquo;s — a docked panel and a docked menu are
            the same object. <strong>Inset</strong> floats it off the top and bottom while
            it stays flush to its own edge — the corners that meet the
            container have nothing to round against, so only the two facing the
            content are rounded, on the same <code>SurfaceCorner</code> scale{" "}
            <code>Panel</code> takes.{" "}
            <code>floating</code> and <code>floating-glass</code> inset
            themselves, and the toggle overrides them either way.
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
            resizable={resizable}
            noise={noise}
            inset={inset === "auto" ? undefined : inset === "on"}
            corner={corner}
            width={280}
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

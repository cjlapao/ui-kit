import React, { useState } from "react";
import {
  HelpButton,
  MultiToggle,
  type ControlSize,
  type HelpButtonPlacement,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
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
  helpButtonContentTypeOptions,
  helpButtonPlacementOptions,
  panelCornerOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const MARKDOWN = [
  "## Keyboard shortcuts",
  "",
  "Press **⌘K** for the command palette, or use these to move around:",
  "",
  "- `↑` / `↓` — move between rows",
  "- `Enter` — open the focused item",
  "- `Esc` — close this panel",
  "",
  "| Key | Action |",
  "| --- | --- |",
  "| `s` | Save draft |",
  "| `p` | Publish |",
  "",
  "> Tip: every shortcut can be rebound under *Settings → Keyboard*.",
].join("\n");

const NODE = (
  <div className="space-y-2 text-sm">
    <p>
      Pass a <code className="rounded bg-neutral-100 px-1 font-mono text-xs">ReactNode</code>{" "}
      and it renders as-is — bring your own layout and compose with any kit
      component.
    </p>
    <ul className="list-disc space-y-0.5 pl-4">
      <li>Fully composable content</li>
      <li>Stays on the panel's surface</li>
    </ul>
  </div>
);

/**
 * The panel opens on click (it is a fixed-position popover), so the preview is
 * the trigger plus a hint. Short lists (content) use a MultiToggle; the long
 * ones — 8 variants, 21 tones, 5 sizes, 6 corners, 5 placements — are dropdowns.
 */
export const HelpButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [placement, setPlacement] =
    useState<HelpButtonPlacement>("auto");
  const [contentType, setContentType] = useState("markdown");
  const [maxWidth, setMaxWidth] = useState("360");
  const [loading, setLoading] = useState(false);

  return (
    <PlaygroundPanel
      previewClassName="w-full flex-col items-center gap-3"
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
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
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
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <ToggleRow
                    label="Loading"
                    checked={loading}
                    onChange={setLoading}
                  />
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <SelectControl
                      label="Placement"
                      options={helpButtonPlacementOptions}
                      value={placement}
                      onChange={(v) => setPlacement(v as HelpButtonPlacement)}
                    />
                    <SelectControl
                      label="Max width"
                      options={[
                        { label: "280px", value: "280" },
                        { label: "320px", value: "320" },
                        { label: "360px", value: "360" },
                        { label: "420px", value: "420" },
                      ]}
                      value={maxWidth}
                      onChange={setMaxWidth}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Content">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={helpButtonContentTypeOptions}
                      value={contentType}
                      onChange={setContentType}
                    />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Click the trigger to open the panel. The panel is a fixed popover,
            so it floats over the page.
          </p>
        </div>
      }
      preview={
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900">
            <HelpButton
              content={contentType === "markdown" ? MARKDOWN : NODE}
              title="Help"
              variant={variant}
              color={tone}
              size={size}
              corner={corner}
              placement={placement}
              maxWidth={Number(maxWidth)}
              loading={loading}
            />
          </div>
          <span className="text-xs opacity-70">
            {variant} · {tone} · {size} · {corner} · {placement}
            {loading ? " · loading" : ""}
          </span>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

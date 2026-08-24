import React, { useState, useRef, useMemo } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { DropdownMenu, MultiToggle, Toggle, Button } from "@cjlapao/ui-kit";
import {
  dropdownMenuPreviewOptions,
  dropdownMenuRichOptions,
  dropdownAlignOptions,
  dropdownSideOptions,
  dropdownWidthOptions,
  dropdownMaxHeightOptions,
} from "../constants";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const safeLabelText = (label: React.ReactNode, fallback: string) =>
  typeof label === "string" ? label : fallback;

export const DropdownMenuDemo: React.FC = () => {
  const [align, setAlign] = useState<"start" | "end">("end");
  const [side, setSide] = useState<"auto" | "top" | "bottom">("auto");
  const [widthChoice, setWidthChoice] = useState<"trigger" | "240" | "320">(
    "trigger",
  );
  const [maxHeightChoice, setMaxHeightChoice] = useState<
    "160" | "288" | "420"
  >("288");

  // Item-shape toggles: strip a field (or drop a whole row) from the rich
  // anatomy list so each shape can be switched on and off.
  const [showIcons, setShowIcons] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showDisabled, setShowDisabled] = useState(true);
  const [showDanger, setShowDanger] = useState(true);

  const widthValue =
    widthChoice === "trigger" ? "trigger" : Number(widthChoice);
  const maxValue = Number(maxHeightChoice);

  const liveItems = useMemo(
    () =>
      dropdownMenuRichOptions
        .filter((item) => {
          if (item.disabled && !showDisabled) return false;
          if (item.danger && !showDanger) return false;
          return true;
        })
        .map((item) => ({
          ...item,
          icon: showIcons ? item.icon : undefined,
          description: showDescriptions ? item.description : undefined,
        })),
    [showIcons, showDescriptions, showDisabled, showDanger],
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const previewAnchorRef = useRef<HTMLButtonElement>(null);
  const [selection, setSelection] = useState("Nothing selected");

  // Collision-detection playground: three anchors at the top / middle / bottom
  // of a full-viewport-height area. The menu is positioned against the
  // viewport, so the bottom anchor has no room below and flips upward.
  const [collisionTopOpen, setCollisionTopOpen] = useState(false);
  const [collisionMidOpen, setCollisionMidOpen] = useState(false);
  const [collisionBottomOpen, setCollisionBottomOpen] = useState(false);
  const collisionTopRef = useRef<HTMLButtonElement>(null);
  const collisionMidRef = useRef<HTMLButtonElement>(null);
  const collisionBottomRef = useRef<HTMLButtonElement>(null);

  return (
    <PlaygroundSection
      title="Dropdown Menu"
      label="[DropdownMenu]"
      description="The raw, positioning-only menu — no trigger of its own. Align, side, width, and max-height; icons, descriptions, disabled and danger items."
      controls={
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span>Align</span>
              <MultiToggle
                options={dropdownAlignOptions}
                value={align}
                size="sm"
                fullWidth
                onChange={(value) => setAlign(value as "start" | "end")}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Side</span>
              <MultiToggle
                options={dropdownSideOptions}
                value={side}
                size="sm"
                fullWidth
                onChange={(value) =>
                  setSide(value as "auto" | "top" | "bottom")
                }
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span>Width</span>
              <MultiToggle
                options={dropdownWidthOptions}
                value={widthChoice}
                size="sm"
                fullWidth
                onChange={(value) =>
                  setWidthChoice(value as "trigger" | "240" | "320")
                }
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Max height</span>
              <MultiToggle
                options={dropdownMaxHeightOptions}
                value={maxHeightChoice}
                size="sm"
                fullWidth
                onChange={(value) =>
                  setMaxHeightChoice(value as "160" | "288" | "420")
                }
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Toggle
              size="sm"
              fullWidth
              label="Icons"
              checked={showIcons}
              onChange={(e) => setShowIcons(e.target.checked)}
            />
            <Toggle
              size="sm"
              fullWidth
              label="Descriptions"
              checked={showDescriptions}
              onChange={(e) => setShowDescriptions(e.target.checked)}
            />
            <Toggle
              size="sm"
              fullWidth
              label="Disabled item"
              checked={showDisabled}
              onChange={(e) => setShowDisabled(e.target.checked)}
            />
            <Toggle
              size="sm"
              fullWidth
              label="Danger item"
              checked={showDanger}
              onChange={(e) => setShowDanger(e.target.checked)}
            />
          </div>
          <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 text-sm text-neutral-600 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-200">
            <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Last selection
            </p>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {selection}
            </p>
          </div>
        </div>
      }
      preview={
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100">
            <div className="flex flex-col gap-2">
              <Caption>Live menu</Caption>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  ref={previewAnchorRef}
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen((prev) => !prev)}
                >
                  {previewOpen ? "Hide menu" : "Show menu"}
                </Button>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Selection: {selection}
                </span>
              </div>
            </div>
            <DropdownMenu
              anchorRef={previewAnchorRef}
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              items={liveItems}
              align={align}
              side={side}
              width={widthValue}
              maxHeight={maxValue}
              onSelect={(item) =>
                setSelection(safeLabelText(item.label, item.value ?? ""))
              }
            />
          </div>

          <div className="flex min-h-screen flex-col justify-between rounded-2xl border border-dashed border-slate-300/80 p-4 dark:border-slate-700">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Collision detection
              </p>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                The menu is placed against the viewport, not the page. Open each
                anchor — the bottom one has no room below, so it flips upward.
              </p>
              <Button
                ref={collisionTopRef}
                variant="outline"
                size="sm"
                onClick={() => setCollisionTopOpen((prev) => !prev)}
              >
                Top anchor
              </Button>
              <DropdownMenu
                anchorRef={collisionTopRef}
                open={collisionTopOpen}
                onClose={() => setCollisionTopOpen(false)}
                items={dropdownMenuPreviewOptions}
                align="end"
                side="auto"
              />
            </div>
            <div>
              <Button
                ref={collisionMidRef}
                variant="outline"
                size="sm"
                onClick={() => setCollisionMidOpen((prev) => !prev)}
              >
                Middle anchor
              </Button>
              <DropdownMenu
                anchorRef={collisionMidRef}
                open={collisionMidOpen}
                onClose={() => setCollisionMidOpen(false)}
                items={dropdownMenuPreviewOptions}
                align="end"
                side="auto"
              />
            </div>
            <div>
              <Button
                ref={collisionBottomRef}
                variant="outline"
                size="sm"
                onClick={() => setCollisionBottomOpen((prev) => !prev)}
              >
                Bottom anchor (flips up)
              </Button>
              <DropdownMenu
                anchorRef={collisionBottomRef}
                open={collisionBottomOpen}
                onClose={() => setCollisionBottomOpen(false)}
                items={dropdownMenuPreviewOptions}
                align="end"
                side="auto"
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

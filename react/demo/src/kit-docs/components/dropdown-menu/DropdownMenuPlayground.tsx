import React, { useMemo, useRef, useState } from "react";
import { Button, DropdownMenu, MultiToggle } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  dropdownAlignOptions,
  dropdownMaxHeightOptions,
  dropdownMenuWidthOptions,
  dropdownSideOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const RICH_ITEMS: DropdownMenuOption[] = [
  {
    label: "Profile settings",
    value: "profile",
    icon: "User",
    description: "Update your name and avatar",
  },
  {
    label: "Team members",
    value: "team",
    icon: "Users",
    description: "Invite and manage people",
  },
  { label: "Security", value: "security", icon: "Key" },
  { label: "Coming soon", value: "soon", icon: "Rocket", disabled: true },
  { label: "Delete workspace", value: "delete", icon: "Trash", danger: true },
];

export const DropdownMenuPlayground: React.FC = () => {
  const [align, setAlign] = useState<"start" | "end">("end");
  const [side, setSide] = useState<"auto" | "top" | "bottom">("auto");
  const [widthChoice, setWidthChoice] = useState<"trigger" | "240" | "320">(
    "trigger",
  );
  const [maxHeightChoice, setMaxHeightChoice] = useState<"160" | "288" | "420">(
    "288",
  );
  const [showIcons, setShowIcons] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showDisabled, setShowDisabled] = useState(true);
  const [showDanger, setShowDanger] = useState(true);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Item-shape toggles: strip a field (or drop a whole row) from the rich
  // anatomy list so each shape can be switched on and off.
  const liveItems = useMemo(
    () =>
      RICH_ITEMS.filter((item) => {
        if (item.disabled && !showDisabled) return false;
        if (item.danger && !showDanger) return false;
        return true;
      }).map((item) => ({
        ...item,
        icon: showIcons ? item.icon : undefined,
        description: showDescriptions ? item.description : undefined,
      })),
    [showIcons, showDescriptions, showDisabled, showDanger],
  );

  return (
    <PlaygroundPanel
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <Control label="Align">
              <MultiToggle
                fullWidth
                size="sm"
                options={dropdownAlignOptions}
                value={align}
                onChange={(v) => setAlign(v as "start" | "end")}
              />
            </Control>
            <Control label="Side">
              <MultiToggle
                fullWidth
                size="sm"
                options={dropdownSideOptions}
                value={side}
                onChange={(v) => setSide(v as "auto" | "top" | "bottom")}
              />
            </Control>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Control label="Width">
              <MultiToggle
                fullWidth
                size="sm"
                options={dropdownMenuWidthOptions}
                value={widthChoice}
                onChange={(v) =>
                  setWidthChoice(v as "trigger" | "240" | "320")
                }
              />
            </Control>
            <Control label="Max height">
              <MultiToggle
                fullWidth
                size="sm"
                options={dropdownMaxHeightOptions}
                value={maxHeightChoice}
                onChange={(v) =>
                  setMaxHeightChoice(v as "160" | "288" | "420")
                }
              />
            </Control>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Icons" checked={showIcons} onChange={setShowIcons} />
            <ToggleRow
              label="Descriptions"
              checked={showDescriptions}
              onChange={setShowDescriptions}
            />
            <ToggleRow
              label="Disabled item"
              checked={showDisabled}
              onChange={setShowDisabled}
            />
            <ToggleRow
              label="Danger item"
              checked={showDanger}
              onChange={setShowDanger}
            />
          </div>
          <p className="text-xs opacity-70">
            The <strong>raw positioning layer</strong> — it has no trigger of
            its own. Arrow keys move through the enabled items, Home/End
            jump, Tab or Escape close, and the menu flips sides when the
            viewport has no room on the requested side.
          </p>
        </>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <Button
              ref={anchorRef}
              variant="outline"
              size="sm"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? "Hide menu" : "Show menu"}
            </Button>
          </div>
          <DropdownMenu
            anchorRef={anchorRef}
            open={open}
            onClose={() => setOpen(false)}
            items={liveItems}
            align={align}
            side={side}
            width={widthChoice === "trigger" ? "trigger" : Number(widthChoice)}
            maxHeight={Number(maxHeightChoice)}
            onSelect={(item) =>
              setSelection(typeof item.label === "string" ? item.label : item.value)
            }
          />
          <div className="flex flex-col gap-2">
            <Caption>Last selection</Caption>
            <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
              {selection || "— nothing yet —"}
            </code>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

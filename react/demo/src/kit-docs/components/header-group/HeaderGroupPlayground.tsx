import React, { useState } from "react";
import {
  Badge,
  Button,
  CustomIcon,
  HeaderGroup,
  IconButton,
  MultiToggle,
  Panel,
} from "@cjlapao/ui-kit";
import type { ControlSize, PanelVariant, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const GROUPS = [
  {
    label: "Navigation",
    content: (
      <>
        <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
        <IconButton
          icon="ArrowRight"
          variant="ghost"
          size="xs"
          srLabel="Forward"
        />
      </>
    ),
  },
  {
    label: "View",
    content: (
      <>
        <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
        <span className="text-sm font-medium">Grid</span>
      </>
    ),
  },
  {
    label: "Alerts",
    content: (
      <>
        <CustomIcon icon="Notification" size="sm" tone="blue" />
        <Badge count={4} tone="rose" size="xs" />
      </>
    ),
  },
  {
    label: "Actions",
    content: (
      <Button size="xs" variant="soft" color="blue">
        Deploy
      </Button>
    ),
  },
];

export const HeaderGroupPlayground: React.FC = () => {
  const [gap, setGap] = useState<ControlSize>("sm");
  const [itemGap, setItemGap] = useState<ControlSize>("xs");
  const [divider, setDivider] = useState(true);
  const [useTone, setUseTone] = useState(false);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surface, setSurface] = useState<PanelVariant>("outlined");
  const [groups, setGroups] = useState(3);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Gap between groups">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={gap}
              onChange={(v) => setGap(v as ControlSize)}
            />
          </Control>
          <Control label="Gap between items">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={itemGap}
              onChange={(v) => setItemGap(v as ControlSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <SelectControl
            label="Header surface"
            options={surfaceVariantOptions}
            value={surface}
            onChange={(v) => setSurface(v as PanelVariant)}
          />
          <Control label={`Groups — ${groups}`}>
            <input
              type="range"
              min={1}
              max={4}
              value={groups}
              onChange={(event) => setGroups(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Separator" checked={divider} onChange={setDivider} />
            <ToggleRow
              label="Tone the separator"
              checked={useTone}
              onChange={setUseTone}
            />
          </div>
          <p className="text-xs opacity-70">
            Drop to <strong>one group</strong> — no leading rule appears,
            because the separator is drawn by the <em>following</em> group.
            Untoned it is a fraction of the header's own text colour, so it
            follows the surface.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Panel variant={surface} tone="neutral" padding="none">
            <div className="flex h-14 items-center px-4">
              {GROUPS.slice(0, groups).map((group) => (
                <HeaderGroup
                  key={group.label}
                  gap={gap}
                  itemGap={itemGap}
                  divider={divider}
                  tone={useTone ? tone : undefined}
                  label={group.label}
                >
                  {group.content}
                </HeaderGroup>
              ))}
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

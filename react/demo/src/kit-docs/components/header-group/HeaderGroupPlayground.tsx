import React, { useState } from "react";
import {
  Badge,
  Button,
  ColorSwatches,
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";
import type { ControlSize, PanelVariant, TrueColor } from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  surfaceVariantOptions,
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
  const [separatorSize, setSeparatorSize] = useState<ControlSize>("xs");
  const [useTone, setUseTone] = useState(false);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surface, setSurface] = useState<PanelVariant>("outlined");
  const [groups, setGroups] = useState(3);

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
                      label="Gap between groups"
                      options={controlSizeOptions}
                      value={gap}
                      onChange={(v) => setGap(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Gap between items"
                      options={controlSizeOptions}
                      value={itemGap}
                      onChange={(v) => setItemGap(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Header surface"
                      options={surfaceVariantOptions}
                      value={surface}
                      onChange={(v) => setSurface(v as PanelVariant)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Separator"
                      checked={divider}
                      onChange={setDivider}
                    />
                    <ChoiceControl
                      label="Separator thickness"
                      options={controlSizeOptions}
                      value={separatorSize}
                      onChange={(v) => setSeparatorSize(v as ControlSize)}
                    />
                    <ToggleRow
                      label="Tone the separator"
                      checked={useTone}
                      onChange={setUseTone}
                    />
                    {/* Tone is a colour decision — pick it from colour
                        swatches, not from a dropdown of words. Off means the
                        rule follows the surface's own text colour. */}
                    {useTone && (
                      <Control label="Separator tone">
                        <ColorSwatches
                          selectable
                          size="sm"
                          value={tone}
                          onSelect={setTone}
                          defaultExpanded
                        />
                      </Control>
                    )}
                  </div>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label={`Groups — ${groups}`}>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={groups}
                      onChange={(event) =>
                        setGroups(Number(event.target.value))
                      }
                      className="w-full accent-blue-500"
                    />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Drop to <strong>one group</strong> — no leading rule appears,
            because the separator is drawn by the <em>following</em> group.
            Untoned it is a fraction of the header's own text colour, so it
            follows the surface.
          </p>
        </div>
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
                  separatorSize={separatorSize}
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
    ></PlaygroundPanel>
  );
};

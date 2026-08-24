import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Badge,
  Button,
  CustomIcon,
  HeaderGroup,
  IconButton,
  MultiToggle,
  Panel,
  Select,
  Toggle,
} from "@cjlapao/ui-kit";
import type { ControlSize, PanelVariant, TrueColor } from "@cjlapao/ui-kit";
import { panelVariantOptions, trueColorOptions } from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const sizeOptions: { label: string; value: ControlSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

export const HeaderGroupDemo: React.FC = () => {
  const [gap, setGap] = useState<ControlSize>("sm");
  const [itemGap, setItemGap] = useState<ControlSize>("xs");
  const [divider, setDivider] = useState(true);
  const [useTone, setUseTone] = useState(false);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surface, setSurface] = useState<PanelVariant>("outlined");
  const [groups, setGroups] = useState(3);

  const shared = {
    gap,
    itemGap,
    divider,
    tone: useTone ? tone : undefined,
  };

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
          <CustomIcon icon="ViewGrid" size="sm" tone={tone} />
          <span className="text-sm font-medium">Grid</span>
        </>
      ),
    },
    {
      label: "Alerts",
      content: (
        <>
          <CustomIcon icon="Notification" size="sm" tone={tone} />
          <Badge count={4} tone="rose" size="xs" />
        </>
      ),
    },
    {
      label: "Actions",
      content: (
        <Button size="xs" variant="soft" color={tone}>
          Deploy
        </Button>
      ),
    },
  ];

  return (
    <PlaygroundSection
      title="Header Group"
      label="[HeaderGroup]"
      description="Clusters related header controls. Adjacent groups get a separator automatically — a lone group never draws one."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Gap between groups">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={gap}
                onChange={(value) => setGap(value as ControlSize)}
              />
            </Field>
            <Field label="Gap between items">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={itemGap}
                onChange={(value) => setItemGap(value as ControlSize)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Separator tone">
              <Select
                value={tone}
                disabled={!useTone || !divider}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Header surface">
              <Select
                value={surface}
                onChange={(event) =>
                  setSurface(event.target.value as PanelVariant)
                }
              >
                {panelVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label={`Groups — ${groups}`}>
            <input
              type="range"
              min={1}
              max={4}
              value={groups}
              onChange={(event) => setGroups(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              size="sm"
              label="Separator"
              checked={divider}
              onChange={(event) => setDivider(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Tone the separator"
              checked={useTone}
              onChange={(event) => setUseTone(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            Drop to <strong>one group</strong> — no leading rule appears,
            because the separator is drawn by the <em>following</em> group.
            Untoned it is a fraction of the header's own text colour, so it
            follows the surface.
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          <Panel variant={surface} tone="neutral" padding="none">
            <div className="flex h-14 items-center px-4">
              {GROUPS.slice(0, groups).map((group) => (
                <HeaderGroup key={group.label} {...shared} label={group.label}>
                  {group.content}
                </HeaderGroup>
              ))}
            </div>
          </Panel>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              Gap ladder — the rule stays centred at every step
            </p>
            <Panel variant="outlined" tone="neutral" padding="none">
              <div className="divide-y divide-black/5 dark:divide-white/10">
                {sizeOptions.map(({ value }) => (
                  <div key={value} className="flex h-12 items-center px-4">
                    <span className="w-8 text-xs opacity-60">{value}</span>
                    {GROUPS.slice(0, 3).map((group) => (
                      <HeaderGroup
                        key={group.label}
                        {...shared}
                        gap={value}
                        label={group.label}
                      >
                        {group.content}
                      </HeaderGroup>
                    ))}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      }
    />
  );
};

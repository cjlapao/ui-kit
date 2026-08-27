import React, { useMemo, useState } from "react";
import {
  CustomIcon,
  iconRegistry,
  MultiToggle,
  Panel,
  SearchBar,
} from "@cjlapao/ui-kit";
import type { IconName, IconSize, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const ALL_ICONS = Object.keys(iconRegistry).sort() as IconName[];

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const iconOptions: { label: string; value: string }[] = ALL_ICONS.map(
  (name) => ({ label: name, value: name }),
);

export const CustomIconPlayground: React.FC = () => {
  const [icon, setIcon] = useState<IconName>("Notification");
  const [size, setSize] = useState<IconSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [useTone, setUseTone] = useState(true);
  const [hoverColor, setHoverColor] = useState(false);
  const [colored, setColored] = useState(false);
  const [spin, setSpin] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withAlt, setWithAlt] = useState(false);
  const [search, setSearch] = useState("");
  const [clicks, setClicks] = useState(0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ALL_ICONS;
    return ALL_ICONS.filter((name) => name.toLowerCase().includes(term));
  }, [search]);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "icons",
                title: "Icons",
                controls: (
                  <>
                    <SelectControl
                      label="Icon"
                      options={iconOptions}
                      value={icon}
                      onChange={(v) => setIcon(v as IconName)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as IconSize)}
                      />
                    </Control>
                    <Control label="Filter the gallery">
                      <SearchBar
                        size="sm"
                        color={tone}
                        debounceMs={0}
                        placeholder="Search icons..."
                        onSearch={setSearch}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Use tone"
                      checked={useTone}
                      onChange={setUseTone}
                    />
                    <ToggleRow
                      label="Hover colour"
                      checked={hoverColor}
                      onChange={setHoverColor}
                    />
                    <ToggleRow
                      label="Keep own colours"
                      checked={colored}
                      onChange={setColored}
                    />
                    <ToggleRow label="Spin" checked={spin} onChange={setSpin} />
                    <ToggleRow
                      label="Clickable"
                      checked={clickable}
                      onChange={setClickable}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Accessible name"
                      checked={withAlt}
                      onChange={setWithAlt}
                    />
                  </div>
                ),
              },
              ...(!colored
                ? [
                    {
                      id: "tone",
                      title: "Tone",
                      controls: (
                        <SelectControl
                          label="Tone"
                          options={trueColorOptions}
                          value={tone}
                          onChange={(v) => setTone(v as TrueColor)}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            Without an <strong>accessible name</strong> the icon is decoration
            and hidden from assistive tech; with one it is announced as an
            image. <strong>Clickable</strong> renders a real{" "}
            <code>&lt;button&gt;</code>, so it is reachable by keyboard.
            {clickable && ` Clicked ${clicks}×.`}
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <Panel variant="outlined" padding="md">
            <div className="flex flex-col gap-2">
              <Caption>Current settings</Caption>
              <div className="flex items-center gap-4">
                <CustomIcon
                  icon={icon}
                  size={size}
                  tone={useTone && !colored ? tone : undefined}
                  hoverColor={hoverColor ? "#f43f5e" : undefined}
                  colored={colored}
                  spin={spin}
                  disabled={disabled}
                  alt={withAlt ? `${icon} icon` : undefined}
                  onClick={clickable ? () => setClicks((n) => n + 1) : undefined}
                />
                <span className="text-xs opacity-60">{icon}</span>
              </div>
            </div>
          </Panel>
          <Panel variant="outlined" padding="md">
            <div className="flex flex-col gap-3">
              <Caption>
                Registry — {filtered.length} of {ALL_ICONS.length}
              </Caption>
              <div className="grid max-h-72 grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 overflow-y-auto">
                {filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIcon(name)}
                    className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <CustomIcon
                      icon={name}
                      size="md"
                      tone={useTone && !colored ? tone : undefined}
                      colored={colored}
                    />
                    <span className="w-full truncate text-[10px] opacity-60">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};

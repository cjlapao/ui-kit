import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  CustomIcon,
  MultiToggle,
  Panel,
  SearchBar,
  Select,
  Toggle,
  iconRegistry,
} from "@cjlapao/ui-kit";
import type { IconName, IconSize, TrueColor } from "@cjlapao/ui-kit";
import { trueColorOptions } from "../constants";

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

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const sizeOptions: { label: string; value: IconSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const ALL_ICONS = Object.keys(iconRegistry).sort() as IconName[];

export const CustomIconDemo: React.FC = () => {
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

  const shared = {
    size,
    tone: useTone ? tone : undefined,
    hoverColor: hoverColor ? "#f43f5e" : undefined,
    colored,
    spin,
    disabled,
    alt: withAlt ? `${icon} icon` : undefined,
    onClick: clickable ? () => setClicks((n) => n + 1) : undefined,
  };

  return (
    <PlaygroundSection
      title="Custom Icon"
      label="[CustomIcon]"
      description={`Renders any of the ${ALL_ICONS.length} icons in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons.`}
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Icon">
              <Select
                value={icon}
                onChange={(event) => setIcon(event.target.value as IconName)}
              >
                {ALL_ICONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                disabled={!useTone || colored}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(value) => setSize(value as IconSize)}
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Use tone"
              checked={useTone}
              onChange={(event) => setUseTone(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Hover colour"
              checked={hoverColor}
              onChange={(event) => setHoverColor(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Keep own colours"
              checked={colored}
              onChange={(event) => setColored(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Spin"
              checked={spin}
              onChange={(event) => setSpin(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Clickable"
              checked={clickable}
              onChange={(event) => setClickable(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Accessible name"
              checked={withAlt}
              onChange={(event) => setWithAlt(event.target.checked)}
            />
          </div>

          <Field label="Filter the gallery">
            <SearchBar
              size="sm"
              color={tone}
              debounceMs={0}
              placeholder="Search icons..."
              onSearch={setSearch}
            />
          </Field>

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
        <div className="space-y-6 p-4">
          <Panel variant="outlined" padding="md">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Caption>Current settings</Caption>
                <div className="flex items-center gap-4">
                  <CustomIcon icon={icon} {...shared} />
                  <span className="text-xs opacity-60">{icon}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Size ladder</Caption>
                <div className="flex items-end gap-3">
                  {sizeOptions.map(({ value }) => (
                    <CustomIcon
                      key={value}
                      icon={icon}
                      {...shared}
                      size={value}
                      onClick={undefined}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Unknown icon — fallback keeps its size</Caption>
                <div className="flex items-end gap-3">
                  {sizeOptions.map(({ value }) => (
                    <CustomIcon
                      key={value}
                      icon={"NotAnIcon" as IconName}
                      size={value}
                    />
                  ))}
                </div>
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
                      tone={useTone ? tone : undefined}
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
    />
  );
};

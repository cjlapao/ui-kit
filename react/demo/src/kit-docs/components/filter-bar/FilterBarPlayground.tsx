import { useState } from "react";
import { FilterBar, ColorSwatches, type FilterBarFilter, type FilterBarValue, type ExpandableButtonSpring, type ControlSize, type SurfaceVariant, type SurfaceTone, type PanelPadding, type PanelCorner, type ButtonVariant, type ButtonWeight, type TrueColor, type BadgeVariant, type InputVariant, type GlassOpacity, type GlassVibrancy, type SurfaceTransparency } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, ToggleRow, Control } from "../../shared/PlaygroundPanel";

import { ControlAccordion } from "../../shared/ControlAccordion";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import { surfaceVariantOptions, panelCornerOptions, panelPaddingOptions, buttonVariantOptions, buttonWeightOptions, controlSizeOptions, inputVariantOptions, glassOpacityOptions, glassVibrancyOptions } from "../../shared/options";

const devices = [
  { name: "MacBook-Pro.homelab.local", user: "Carlos", status: "online", enrollment: "enabled" },
  { name: "USAAL2ELEKORP.local", user: "Elena", status: "offline", enrollment: "enabled" },
  { name: "CANAL1DMYKORP.local", user: "Dmytro", status: "online", enrollment: "enabled" },
  { name: "Design workstation", user: "Carlos", status: "offline", enrollment: "enabled" },
  { name: "Build server", user: "Elena", status: "online", enrollment: "disabled" },
];
export function FilterBarPlayground() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<FilterBarValue>({});
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<SurfaceTone>("neutral");
  const [corner, setCorner] = useState<PanelCorner>("rounded-sm");
  const [padding, setPadding] = useState<PanelPadding>("xs");
  const [transparency, setTransparency] = useState<SurfaceTransparency | undefined>(undefined);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("outline");
  const [secondaryButtonVariant, setSecondaryButtonVariant] = useState<ButtonVariant>("ghost");
  const [applyButtonVariant, setApplyButtonVariant] = useState<ButtonVariant>("solid");
  const [buttonTone, setButtonTone] = useState<TrueColor>("blue");
  const [buttonSize, setButtonSize] = useState<ControlSize | undefined>(undefined);
  const [buttonCorner, setButtonCorner] = useState<PanelCorner | undefined>(undefined);
  const [buttonWeight, setButtonWeight] = useState<ButtonWeight>("normal");
  const [buttonDashed, setButtonDashed] = useState<boolean>(true);
  const [menuVariant, setMenuVariant] = useState<SurfaceVariant>("outlined");
  const [menuTone, setMenuTone] = useState<SurfaceTone>("none");
  const [menuCorner, setMenuCorner] = useState<PanelCorner>("rounded-sm");
  const [menuPadding, setMenuPadding] = useState<PanelPadding>("xs");
  const [chipVariant, setChipVariant] = useState<BadgeVariant>("soft");
  const [chipTone, setChipTone] = useState<TrueColor>("blue");
  const [color, setColor] = useState<TrueColor>("blue");
  const [searchVariant, setSearchVariant] = useState<InputVariant>("elevated");
  const [size, setSize] = useState<ControlSize>("md");
  const [spring, setSpring] = useState<ExpandableButtonSpring>("snappy");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showFilterLabel, setShowFilterLabel] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [showClearAll, setShowClearAll] = useState(true);
  const [showResultCount, setShowResultCount] = useState(true);
  const [showMenuCounts, setShowMenuCounts] = useState(true);
  const filters: FilterBarFilter[] = [
    { id: "status", label: "Status", options: ["online", "offline"].map(status => ({ value: status, label: status === "online" ? "Online" : "Offline", count: devices.filter(device => device.status === status).length })) },
    { id: "user", label: "User", options: ["Carlos", "Elena", "Dmytro"].map(user => ({ value: user, label: user, count: devices.filter(device => device.user === user).length })) },
    { id: "enrollment", label: "Enrollment", options: [{ value: "enabled", label: "Enabled", count: 4 }, { value: "disabled", label: "Disabled", count: 1 }] },
  ];
  const results = devices.filter(device => device.name.toLowerCase().includes(query.toLowerCase()) && Object.entries(value).every(([key, values]) => !values.length || values.includes(device[key as "status" | "user" | "enrollment"])));
  return <PlaygroundPanel controls={<div className="space-y-3">
    <ControlAccordion groups={[
      { id: "core", title: "Size and motion", controls: <>
      <SelectControl label="Size" value={size} onChange={next => setSize(next as ControlSize)} options={controlSizeOptions} />
      <SelectControl label="Spring" value={spring} onChange={next => setSpring(next as ExpandableButtonSpring)} options={["bouncy", "snappy", "gentle", "precise"].map(value => ({ value, label: value }))} />
      </> },
      { id: "surface", title: "Surface", controls: <>
      <SelectControl label="Variant" value={variant} onChange={next => setVariant(next as SurfaceVariant)} options={surfaceVariantOptions} />
      <Control label="Tone"><SurfaceToneSwatches value={tone} onSelect={setTone} /></Control>
      <SelectControl label="Corner" value={corner} onChange={next => setCorner(next as PanelCorner)} options={panelCornerOptions} />
      <SelectControl label="Padding" value={padding} onChange={next => setPadding(next as PanelPadding)} options={panelPaddingOptions} />
      <SelectControl label="Transparency" value={transparency ?? "auto"} onChange={next => setTransparency(next === "auto" ? undefined : next as SurfaceTransparency)} options={["auto", "none", "low", "medium", "high"].map(value => ({ value, label: value }))} />
      <SelectControl label="Glass opacity" value={String(glassOpacity)} onChange={next => setGlassOpacity(next as GlassOpacity)} options={glassOpacityOptions} />
      <SelectControl label="Glass vibrancy" value={String(vibrancy)} onChange={next => setVibrancy(next as GlassVibrancy)} options={glassVibrancyOptions} />
      </> },
      { id: "buttons", title: "Buttons", controls: <>
      <SelectControl label="Add filter variant" value={buttonVariant} onChange={next => setButtonVariant(next as ButtonVariant)} options={buttonVariantOptions} />
      <SelectControl label="Secondary button variant" value={secondaryButtonVariant} onChange={next => setSecondaryButtonVariant(next as ButtonVariant)} options={buttonVariantOptions} />
      <SelectControl label="Done button variant" value={applyButtonVariant} onChange={next => setApplyButtonVariant(next as ButtonVariant)} options={buttonVariantOptions} />
      <Control label="Button tone"><ColorSwatches value={buttonTone} onSelect={setButtonTone} selectable size="sm" defaultExpanded /></Control>
      <SelectControl label="Button size" value={buttonSize ?? "inherit"} onChange={next => setButtonSize(next === "inherit" ? undefined : next as ControlSize)} options={[{ value: "inherit", label: "Follow size" }, ...controlSizeOptions]} />
      <SelectControl label="Button corner" value={buttonCorner ?? "default"} onChange={next => setButtonCorner(next === "default" ? undefined : next as PanelCorner)} options={[{ value: "default", label: "Default shapes" }, ...panelCornerOptions]} />
      <SelectControl label="Button weight" value={buttonWeight} onChange={next => setButtonWeight(next as ButtonWeight)} options={buttonWeightOptions} />
      <ToggleRow label="Dashed Add filter border" checked={buttonDashed} onChange={setButtonDashed} />
      </> },
      { id: "search", title: "Search", controls: <>
      <SelectControl label="Search variant" value={searchVariant} onChange={next => setSearchVariant(next as InputVariant)} options={inputVariantOptions} />
      <Control label="Search accent"><ColorSwatches value={color} onSelect={setColor} selectable size="sm" defaultExpanded /></Control>
      </> },
      { id: "menu", title: "Filter menu", controls: <>
      <SelectControl label="Menu variant" value={menuVariant} onChange={next => setMenuVariant(next as SurfaceVariant)} options={surfaceVariantOptions} />
      <Control label="Menu tone"><SurfaceToneSwatches value={menuTone} onSelect={setMenuTone} /></Control>
      <SelectControl label="Menu corner" value={menuCorner} onChange={next => setMenuCorner(next as PanelCorner)} options={panelCornerOptions} />
      <SelectControl label="Menu padding" value={menuPadding} onChange={next => setMenuPadding(next as PanelPadding)} options={panelPaddingOptions} />
      </> },
      { id: "chips", title: "Applied chips", controls: <>
      <SelectControl label="Chip variant" value={chipVariant} onChange={next => setChipVariant(next as BadgeVariant)} options={["solid", "soft", "outline"].map(value => ({ value, label: value }))} />
      <Control label="Chip tone"><ColorSwatches value={chipTone} onSelect={setChipTone} selectable size="sm" defaultExpanded /></Control>
      </> },
      { id: "visibility", title: "Visible parts", controls: <>
      <ToggleRow label="Search" checked={showSearch} onChange={setShowSearch} />
      <ToggleRow label="Filters label" checked={showFilterLabel} onChange={setShowFilterLabel} />
      <ToggleRow label="Empty message" checked={showEmptyState} onChange={setShowEmptyState} />
      <ToggleRow label="Clear all" checked={showClearAll} onChange={setShowClearAll} />
      <ToggleRow label="Result count" checked={showResultCount} onChange={setShowResultCount} />
      <ToggleRow label="Menu counts" checked={showMenuCounts} onChange={setShowMenuCounts} />

      </> },
      { id: "state", title: "Behavior", controls: <>
      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
      <ToggleRow label="Search loading" checked={loading} onChange={setLoading} />
      <ToggleRow label="Manual search (Enter)" checked={manual} onChange={setManual} />
      </> },
    ]} />
  </div>} preview={
    <div className="w-full space-y-3">
      <FilterBar searchProps={{ onSearch: setQuery, placeholder: "Search by device name", loading, autoSearch: !manual, variant: searchVariant }} filters={filters} value={value} onChange={setValue} filteredCount={results.length} totalCount={devices.length} itemLabel="devices" size={size} spring={spring} disabled={disabled}
        variant={variant} tone={tone} corner={corner} padding={padding} transparency={transparency} glassOpacity={glassOpacity} vibrancy={vibrancy}
        buttonVariant={buttonVariant} secondaryButtonVariant={secondaryButtonVariant} applyButtonVariant={applyButtonVariant}
        buttonTone={buttonTone} buttonSize={buttonSize} buttonCorner={buttonCorner} buttonWeight={buttonWeight} buttonDashed={buttonDashed}
        menuVariant={menuVariant} menuTone={menuTone} menuCorner={menuCorner} menuPadding={menuPadding}
        chipVariant={chipVariant} chipTone={chipTone} color={color}
        showSearch={showSearch} showFilterLabel={showFilterLabel} showEmptyState={showEmptyState}
        showClearAll={showClearAll} showResultCount={showResultCount} showMenuCounts={showMenuCounts} />
      <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700">
        {results.map(device => <div key={device.name} className="flex flex-wrap items-center justify-between gap-2 p-4"><div><strong className="text-sm">{device.name}</strong><p className="text-xs text-neutral-500">{device.user} · {device.enrollment}</p></div><span className="text-xs text-neutral-500">{device.status}</span></div>)}
        {!results.length && <p className="p-6 text-center text-sm text-neutral-500">No matching devices</p>}
      </div>
    </div>
  } />;
}

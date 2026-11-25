import { getSurfaceAccentColor } from "@cjlapao/ui-kit";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import { useState } from "react";
import { Button, ColorSwatches, Menu, type ControlSize, type MenuItem, type MenuProps, type SurfaceCorner, type SurfacePadding, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

export function MenuPlayground() {
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<SurfaceTone>("none");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<SurfacePadding>("xs");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-sm");
  const [raisedSurface, setRaisedSurface] = useState(false);
  const [itemTone, setItemTone] = useState<TrueColor>("neutral");
  const [followTone, setFollowTone] = useState(true);
  const [itemPadding, setItemPadding] = useState<"auto" | SurfacePadding>("auto");
  const [itemCorner, setItemCorner] = useState<SurfaceCorner>("rounded-sm");
  const [submenuMode, setSubmenuMode] = useState<MenuProps["submenuMode"]>("tiered");
  const [placement, setPlacement] = useState<MenuProps["placement"]>("bottom");
  const [align, setAlign] = useState<MenuProps["align"]>("grow");
  const [widthFloor, setWidthFloor] = useState("256");
  const [maxWidth, setMaxWidth] = useState("380");
  const [popup, setPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [withIcons, setWithIcons] = useState(true);
  const [withChrome, setWithChrome] = useState(false);
  const [closeMode, setCloseMode] = useState("auto");
  const [withToggleRow, setWithToggleRow] = useState(true);
  const [autosave, setAutosave] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [scheme, setScheme] = useState("System");
  const [log, pushLog] = useEventLog();
  const items: MenuItem[] = [
    { id: "documents", type: "group", label: "Documents", items: [
      { id: "new", label: "New file", icon: withIcons ? "Add" : undefined, shortcut: "⌘N" },
      { id: "recent", label: "Open recent", icon: withIcons ? "Folder" : undefined, items: [
        { id: "notes", label: "Project notes" },
        { id: "report", label: "Release report", items: [{ id: "pdf", label: "Export PDF" }] },
      ] },
      { id: "archive", label: "Archive", disabled, icon: withIcons ? "Folder" : undefined },
    ] },
    { id: "separator", type: "separator" },
    { id: "preferences", type: "group", label: "Preferences", items: [
      { id: "notifications", type: "checkbox", label: "Notifications", checked, onCheckedChange: value => { setChecked(value); pushLog(`onCheckedChange → ${value}`); } },
      ...(withToggleRow ? [{ id: "autosave", type: "toggle" as const, label: "Autosave drafts", icon: withIcons ? "Star" : undefined, checked: autosave, onCheckedChange: (value: boolean) => { setAutosave(value); pushLog(`onCheckedChange → autosave ${value}`); } }] : []),
      ...["Light", "Dark", "System"].map(label => ({ id: label, label, type: "radio" as const, checked: scheme === label, onCheckedChange: () => { setScheme(label); pushLog(`onCheckedChange → ${label}`); } })),
    ] },
    { id: "logout", label: "Log out", danger: true },
  ];
  return <PlaygroundPanel controls={<div className="space-y-3"><ControlAccordion groups={[
    { id: "core", title: "Core", controls: <>
      <SelectControl label="Variant" options={surfaceVariantOptions} value={variant} onChange={v => setVariant(v as SurfaceVariant)} />
      <SelectControl label="Size" options={controlSizeOptions} value={size} onChange={v => setSize(v as ControlSize)} />
      <Control label="Surface tone"><SurfaceToneSwatches value={tone} onSelect={setTone} /></Control>
      <SelectControl label="Surface padding" options={panelPaddingOptions} value={padding} onChange={v => setPadding(v as SurfacePadding)} />
      <SelectControl label="Surface corner" options={panelCornerOptions} value={corner} onChange={v => setCorner(v as SurfaceCorner)} />
      {/* The get-out-of-flat clause: forces the first nested-panels depth step. */}
      <ToggleRow label="Raised surface" checked={raisedSurface} onChange={setRaisedSurface} />
    </> },
    { id: "items", title: "Menu items", controls: <>
      <ToggleRow label="Items follow surface tone" checked={followTone} onChange={setFollowTone} />
      <Control label="Item tone"><ColorSwatches selectable size="sm" value={followTone ? getSurfaceAccentColor(tone) : itemTone} onSelect={value => { setItemTone(value); setFollowTone(false); }} defaultExpanded /></Control>
      <SelectControl label="Item padding" options={[{ value: "auto", label: "Auto (follows size)" }, ...panelPaddingOptions]} value={itemPadding} onChange={v => setItemPadding(v as "auto" | SurfacePadding)} />
      <SelectControl label="Item corner" options={panelCornerOptions} value={itemCorner} onChange={v => setItemCorner(v as SurfaceCorner)} />
      <ToggleRow label="Show icons" checked={withIcons} onChange={setWithIcons} />
      <ToggleRow label="Autosave toggle row" checked={withToggleRow} onChange={setWithToggleRow} />
      <ToggleRow label="Disabled archive item" checked={disabled} onChange={setDisabled} />
    </> },
    { id: "behavior", title: "Behavior", controls: <>
      <SelectControl label="Submenus" options={[{value:"tiered",label:"Tiered"},{value:"inline",label:"Inline"}]} value={submenuMode ?? "tiered"} onChange={v => setSubmenuMode(v as MenuProps["submenuMode"])} />
      <SelectControl label="Select closes" options={[{ value: "auto", label: "Auto (per kind)" }, { value: "always", label: "Always" }, { value: "never", label: "Never" }]} value={closeMode} onChange={setCloseMode} />
      <ToggleRow label="Popup" checked={popup} onChange={setPopup} />
      <SelectControl label="Placement" options={["top","bottom","left","right"].map(value => ({value,label:value}))} value={placement ?? "bottom"} onChange={v => setPlacement(v as MenuProps["placement"])} />
      <SelectControl label="Popup align" options={[{value:"grow",label:"Grow (default)"},{value:"start",label:"Start — pin leading edge"},{value:"end",label:"End — pin trailing edge"}]} value={align ?? "grow"} onChange={v => setAlign(v as MenuProps["align"])} />
      <SelectControl label="Popup width floor" options={[{value:"256",label:"256 px (default)"},{value:"trigger",label:"Match trigger"}]} value={widthFloor} onChange={setWidthFloor} />
      <SelectControl label="Popup max width" options={[{ value: "288", label: "288 px" }, { value: "380", label: "380 px (default)" }, { value: "480", label: "480 px" }, { value: "600", label: "600 px" }]} value={maxWidth} onChange={setMaxWidth} />
      <ToggleRow label="Header and footer" checked={withChrome} onChange={setWithChrome} />
    </> },
  ]} /><p className="text-xs text-neutral-500">Item styles are independent of the surface. Individual MenuItem entries can override tone, padding, and corner. Danger rows keep their warning tone.</p></div>}
    preview={<div className="w-full space-y-4"><div className="flex min-h-80 items-start justify-center">
      <Menu key={popup ? "popup" : "inline"} aria-label="Playground commands" items={items} variant={variant} tone={tone} size={size} padding={padding} corner={corner} raisedSurface={raisedSurface}
        itemTone={followTone ? undefined : itemTone} itemPadding={itemPadding === "auto" ? undefined : itemPadding} itemCorner={itemCorner}
        submenuMode={submenuMode} closeOnSelect={closeMode === "auto" ? undefined : closeMode === "always"} placement={placement} align={align} width={widthFloor === "trigger" ? "trigger" : Number(widthFloor)} maxWidth={Number(maxWidth)} trigger={popup ? <Button tooltip="Run a command" tooltipDisabled={menuOpen}>Open menu</Button> : undefined}
        header={withChrome ? <div className="px-3 py-2 font-semibold">Workspace</div> : undefined}
        footer={withChrome ? <div className="px-3 py-2 text-xs text-neutral-500">Signed in as Alex Morgan</div> : undefined}
        onSelect={item => pushLog(`onSelect → ${item.id}`)} onOpenChange={open => { setMenuOpen(open); pushLog(`onOpenChange → ${open}`); }}
        onExpandedKeysChange={keys => pushLog(`onExpandedKeysChange → ${keys.join(", ") || "none"}`)} />
    </div><EventLogControl log={log} /></div>} />;
}

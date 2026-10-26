import { useState } from "react";
import { Button, ColorSwatches, Menu, type ControlSize, type MenuItem, type MenuProps, type SurfaceCorner, type SurfacePadding, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

export function MenuPlayground() {
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [size, setSize] = useState<ControlSize>("md");
  const [padding, setPadding] = useState<SurfacePadding>("xs");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [itemTone, setItemTone] = useState<TrueColor>("neutral");
  const [followTone, setFollowTone] = useState(true);
  const [itemPadding, setItemPadding] = useState<"auto" | SurfacePadding>("auto");
  const [itemCorner, setItemCorner] = useState<SurfaceCorner>("rounded-sm");
  const [submenuMode, setSubmenuMode] = useState<MenuProps["submenuMode"]>("inline");
  const [placement, setPlacement] = useState<MenuProps["placement"]>("bottom");
  const [popup, setPopup] = useState(false);
  const [withIcons, setWithIcons] = useState(true);
  const [withChrome, setWithChrome] = useState(false);
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
      ...["Light", "Dark", "System"].map(label => ({ id: label, label, type: "radio" as const, checked: scheme === label, onCheckedChange: () => { setScheme(label); pushLog(`onCheckedChange → ${label}`); } })),
    ] },
    { id: "logout", label: "Log out", danger: true },
  ];
  return <PlaygroundPanel controls={<div className="space-y-3"><ControlAccordion groups={[
    { id: "core", title: "Core", controls: <>
      <SelectControl label="Variant" options={surfaceVariantOptions} value={variant} onChange={v => setVariant(v as SurfaceVariant)} />
      <SelectControl label="Size" options={controlSizeOptions} value={size} onChange={v => setSize(v as ControlSize)} />
      <Control label="Surface tone"><ColorSwatches selectable size="sm" value={tone} onSelect={setTone} defaultExpanded /></Control>
      <SelectControl label="Surface padding" options={panelPaddingOptions} value={padding} onChange={v => setPadding(v as SurfacePadding)} />
      <SelectControl label="Surface corner" options={panelCornerOptions} value={corner} onChange={v => setCorner(v as SurfaceCorner)} />
    </> },
    { id: "items", title: "Menu items", controls: <>
      <ToggleRow label="Items follow surface tone" checked={followTone} onChange={setFollowTone} />
      <Control label="Item tone"><ColorSwatches selectable size="sm" value={followTone ? tone : itemTone} onSelect={value => { setItemTone(value); setFollowTone(false); }} defaultExpanded /></Control>
      <SelectControl label="Item padding" options={[{ value: "auto", label: "Auto (follows size)" }, ...panelPaddingOptions]} value={itemPadding} onChange={v => setItemPadding(v as "auto" | SurfacePadding)} />
      <SelectControl label="Item corner" options={panelCornerOptions} value={itemCorner} onChange={v => setItemCorner(v as SurfaceCorner)} />
      <ToggleRow label="Show icons" checked={withIcons} onChange={setWithIcons} />
      <ToggleRow label="Disabled archive item" checked={disabled} onChange={setDisabled} />
    </> },
    { id: "behavior", title: "Behavior", controls: <>
      <SelectControl label="Submenus" options={[{value:"inline",label:"Inline"},{value:"tiered",label:"Tiered"}]} value={submenuMode ?? "inline"} onChange={v => setSubmenuMode(v as MenuProps["submenuMode"])} />
      <ToggleRow label="Popup" checked={popup} onChange={setPopup} />
      <SelectControl label="Placement" options={["top","bottom","left","right"].map(value => ({value,label:value}))} value={placement ?? "bottom"} onChange={v => setPlacement(v as MenuProps["placement"])} />
      <ToggleRow label="Header and footer" checked={withChrome} onChange={setWithChrome} />
    </> },
  ]} /><p className="text-xs text-neutral-500">Item styles are independent of the surface. Individual MenuItem entries can override tone, padding, and corner. Danger rows keep their warning tone.</p></div>}
    preview={<div className="w-full space-y-4"><div className="flex min-h-80 items-start justify-center">
      <Menu key={popup ? "popup" : "inline"} aria-label="Playground commands" items={items} variant={variant} tone={tone} size={size} padding={padding} corner={corner}
        itemTone={followTone ? undefined : itemTone} itemPadding={itemPadding === "auto" ? undefined : itemPadding} itemCorner={itemCorner}
        submenuMode={submenuMode} placement={placement} trigger={popup ? <Button>Open menu</Button> : undefined}
        header={withChrome ? <div className="px-3 py-2 font-semibold">Workspace</div> : undefined}
        footer={withChrome ? <div className="px-3 py-2 text-xs text-neutral-500">Signed in as Alex Morgan</div> : undefined}
        onSelect={item => pushLog(`onSelect → ${item.id}`)} onOpenChange={open => pushLog(`onOpenChange → ${open}`)}
        onExpandedKeysChange={keys => pushLog(`onExpandedKeysChange → ${keys.join(", ") || "none"}`)} />
    </div><EventLogControl log={log} /></div>} />;
}

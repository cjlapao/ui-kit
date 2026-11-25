import { useState } from "react";
import { MenuButton, Pill, ColorSwatches, type ButtonVariant, type ButtonWeight, type ControlSize, type MenuItem, type MenuProps, type SurfaceCorner, type SurfacePadding, type SurfaceTone, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { buttonSizeOptions, buttonVariantOptions, buttonWeightOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

const LEAVES = [
  { value: "new-file", label: "New file" },
  { value: "project-notes", label: "Project notes" },
  { value: "release-report", label: "Release report" },
  { value: "archive", label: "Archive" },
  { value: "notifications", label: "Notifications" },
];

export function MenuButtonPlayground() {
  // Trigger
  const [withIcon, setWithIcon] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [withPill, setWithPill] = useState(true);
  const [withTooltip, setWithTooltip] = useState(true);
  const [pillTone, setPillTone] = useState<TrueColor>("neutral");
  const [caret, setCaret] = useState(true);
  // Button
  const [variant, setVariant] = useState<ButtonVariant>("outline");
  const [color, setColor] = useState<TrueColor>("neutral");
  const [size, setSize] = useState<ControlSize>("md");
  const [weight, setWeight] = useState<ButtonWeight>("normal");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glass, setGlass] = useState(false);
  // Menu
  const [menuVariant, setMenuVariant] = useState<SurfaceVariant>("outlined");
  const [menuTone, setMenuTone] = useState<SurfaceTone>("none");
  const [menuCorner, setMenuCorner] = useState<SurfaceCorner>("rounded-sm");
  const [menuPadding, setMenuPadding] = useState<SurfacePadding>("xs");
  const [submenuMode, setSubmenuMode] = useState<NonNullable<MenuProps["submenuMode"]>>("tiered");
  const [closeMode, setCloseMode] = useState("auto");
  const [withToggleRow, setWithToggleRow] = useState(true);
  const [livePreview, setLivePreview] = useState(true);
  const [placement, setPlacement] = useState<NonNullable<MenuProps["placement"]>>("bottom");
  const [menuMaxWidth, setMenuMaxWidth] = useState("380");
  const [selectedKey, setSelectedKey] = useState("new-file");
  const [withFooter, setWithFooter] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [log, pushLog] = useEventLog();

  const items: MenuItem[] = [
    { id: "documents", type: "group", label: "Documents", items: [
      { id: "new-file", label: "New file", icon: "Add", shortcut: "⌘N" },
      { id: "recent", label: "Open recent", icon: "Folder", items: [
        { id: "project-notes", label: "Project notes" },
        { id: "release-report", label: "Release report", items: [{ id: "export-pdf", label: "Export PDF" }] },
      ] },
      { id: "archive", label: "Archive", icon: "Folder", disabled },
    ] },
    { id: "separator", type: "separator" },
    { id: "preferences", type: "group", label: "Preferences", items: [
      { id: "notifications", label: "Notifications", description: "Ping me when agents finish", icon: "Info", badge: <Pill size="xs" tone="amber">Beta</Pill> },
      { id: "compact", label: "Quiet mode", type: "checkbox", checked: !notifications, onCheckedChange: value => { setNotifications(!value); pushLog(`Quiet mode → ${!value}`); } },
      ...(withToggleRow ? [{ id: "live-preview", label: "Live preview", description: "Render edits as you type", type: "toggle" as const, checked: livePreview, onCheckedChange: (value: boolean) => { setLivePreview(value); pushLog(`Live preview → ${value}`); } }] : []),
    ] },
    { id: "logout", label: "Log out", icon: "Warning", danger: true },
  ];

  return <PlaygroundPanel controls={<div className="space-y-3"><ControlAccordion groups={[
    { id: "trigger", title: "Trigger", defaultOpen: true, controls: <>
      <ToggleRow label="Leading icon" checked={withIcon} onChange={setWithIcon} />
      <ToggleRow label="Subtitle" checked={withSubtitle} onChange={setWithSubtitle} />
      <ToggleRow label="Pill" checked={withPill} onChange={setWithPill} />
      {withPill && <Control label="Pill tone"><ColorSwatches selectable size="sm" value={pillTone} onSelect={setPillTone} defaultExpanded /></Control>}
      <ToggleRow label="Caret" checked={caret} onChange={setCaret} />
      <ToggleRow label="Trigger tooltip" checked={withTooltip} onChange={setWithTooltip} />
    </> },
    { id: "button", title: "Button", defaultOpen: true, controls: <>
      <SelectControl label="Variant" options={buttonVariantOptions} value={variant} onChange={v => setVariant(v as ButtonVariant)} />
      <Control label="Color"><ColorSwatches selectable size="sm" value={color} onSelect={setColor} defaultExpanded /></Control>
      <SelectControl label="Size" options={buttonSizeOptions} value={size} onChange={v => setSize(v as ControlSize)} />
      <SelectControl label="Weight" options={buttonWeightOptions} value={weight} onChange={v => setWeight(v as ButtonWeight)} />
      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
      <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
      <ToggleRow label="Glass" checked={glass} onChange={setGlass} />
    </> },
    { id: "menu", title: "Menu surface", controls: <>
      <SelectControl label="Menu variant" options={surfaceVariantOptions} value={menuVariant} onChange={v => setMenuVariant(v as SurfaceVariant)} />
      <Control label="Menu tone"><SurfaceToneSwatches value={menuTone} onSelect={setMenuTone} /></Control>
      <SelectControl label="Menu corner" options={panelCornerOptions} value={menuCorner} onChange={v => setMenuCorner(v as SurfaceCorner)} />
      <SelectControl label="Menu padding" options={panelPaddingOptions} value={menuPadding} onChange={v => setMenuPadding(v as SurfacePadding)} />
      <SelectControl label="Placement" options={[{ value: "bottom", label: "Bottom" }, { value: "top", label: "Top" }, { value: "left", label: "Left" }, { value: "right", label: "Right" }]} value={placement} onChange={v => setPlacement(v as NonNullable<MenuProps["placement"]>)} />
      <SelectControl label="Menu max width" options={[{ value: "288", label: "288 px" }, { value: "380", label: "380 px (default)" }, { value: "480", label: "480 px" }, { value: "600", label: "600 px" }]} value={menuMaxWidth} onChange={setMenuMaxWidth} />
      <p className="px-1 text-[11px] leading-snug text-neutral-500">Collision handling is always on: the popup flips to the free side and caps its height to the space left, scrolling internally.</p>
    </> },
    { id: "behavior", title: "Behavior", controls: <>
      <SelectControl label="Submenus" options={[{ value: "tiered", label: "Tiered" }, { value: "inline", label: "Inline" }]} value={submenuMode} onChange={v => setSubmenuMode(v as NonNullable<MenuProps["submenuMode"]>)} />
      <SelectControl label="Select closes" options={[{ value: "auto", label: "Auto (per kind)" }, { value: "always", label: "Always" }, { value: "never", label: "Never" }]} value={closeMode} onChange={setCloseMode} />
      <SelectControl label="Selected" options={LEAVES} value={selectedKey} onChange={setSelectedKey} />
      <ToggleRow label="Footer" checked={withFooter} onChange={setWithFooter} />
      <ToggleRow label="Live preview toggle row" checked={withToggleRow} onChange={setWithToggleRow} />
    </> },
  ]} /><EventLogControl log={log} /></div>} preview={
    <div className="flex min-h-64 items-center justify-center">
      <MenuButton
        icon={withIcon ? "Star" : undefined}
        title="Acme workspace"
        subtitle={withSubtitle ? "Free plan · 3 agents" : undefined}
        pill={withPill ? { label: "Pro", tone: pillTone } : undefined}
        tooltip={withTooltip ? "Switch models and effort" : undefined}
        caret={caret}
        variant={variant}
        color={color}
        size={size}
        weight={weight}
        disabled={disabled}
        loading={loading}
        glass={glass}
        items={items}
        selectedKey={selectedKey}
        submenuMode={submenuMode}
        closeOnSelect={closeMode === "auto" ? undefined : closeMode === "always"}
        menuPlacement={placement}
        menuMaxWidth={Number(menuMaxWidth)}
        menuVariant={menuVariant}
        menuTone={menuTone}
        menuCorner={menuCorner}
        menuPadding={menuPadding}
        menuFooter={withFooter ? <div className="px-3 py-1.5 text-xs text-neutral-500">Menus flip and scroll to stay on screen.</div> : undefined}
        onSelect={item => pushLog(`onSelect → ${item.id}`)}
        onOpenChange={open => pushLog(`onOpenChange → ${open}`)}
      />
    </div>
  } />;
}

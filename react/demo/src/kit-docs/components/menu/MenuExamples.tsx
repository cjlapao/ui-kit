import { useState } from "react";
import { Button, Menu, MENU_VARIANTS, type MenuItem, type PanelVariant } from "@cjlapao/ui-kit";

export default function MenuExamples() {
  const [variant, setVariant] = useState<PanelVariant>("outlined");
  const [checked, setChecked] = useState(true);
  const [scheme, setScheme] = useState("System");
  const [message, setMessage] = useState("Choose an action");
  const command = (item: MenuItem) => setMessage(`Selected: ${item.textValue ?? item.label}`);
  const documents: MenuItem[] = [
    { id: "documents", type: "group", label: "Documents", items: [
      { id: "new", label: "New file", icon: "Add", shortcut: "⌘N", command },
      { id: "recent", label: "Open recent", icon: "Folder", items: [
        { id: "project", label: "Project notes", command },
        { id: "report", label: "Release report", command },
      ] },
    ] },
    { id: "divider", type: "separator" },
    { id: "workspace", type: "group", label: "Workspace", items: [
      { id: "reports", label: "Reports", icon: "File", items: [
        { id: "monthly", label: "Monthly", command },
        { id: "yearly", label: "Yearly", command },
      ] },
      { id: "locked", label: "Archive workspace", icon: "Folder", disabled: true },
    ] },
  ];
  const tiered: MenuItem[] = [
    { id: "file", label: "File", icon: "File", items: [
      { id: "new-tier", label: "New", icon: "Add", items: [
        { id: "document", label: "Document", icon: "File", command },
        { id: "image", label: "Image", icon: "Image", command },
      ] },
      { id: "open", label: "Open", icon: "Folder", command },
      { id: "export", label: "Export", items: [{ id: "pdf", label: "PDF", command }, { id: "markdown", label: "Markdown", command }] },
    ] },
    { id: "edit", label: "Edit", icon: "Edit", items: [{ id: "rename", label: "Rename", command }, { id: "delete", label: "Delete", danger: true, command }] },
    { id: "sep-tier", type: "separator" },
    { id: "share", label: "Share", items: [{ id: "link", label: "Copy link", command }, { id: "docs", label: "Documentation", href: "https://example.com", target: "_blank" }] },
  ];
  const settings: MenuItem[] = [
    { id: "notifications", type: "group", label: "Notifications", items: [
      { id: "enabled", type: "checkbox", label: "Enable notifications", checked, onCheckedChange: setChecked },
    ] },
    { id: "appearance", type: "group", label: "Appearance", items: ["Light", "Dark", "System"].map(label => ({ id: label, label, type: "radio", checked: scheme === label, onCheckedChange: () => setScheme(label) })) },
  ];
  const account: MenuItem[] = [
    { id: "usage", type: "section", submenuMode: "inline", label: "Usage remaining", icon: "Info", content: <div className="space-y-2 px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400"><div className="flex justify-between"><span>Weekly</span><span>66%</span></div><div className="h-1 rounded-full bg-neutral-200 dark:bg-neutral-700"><div className="h-full w-2/3 rounded-full bg-blue-500" /></div></div> },
    { id: "settings", label: "Settings", icon: "Settings", shortcut: "⌘,", command },
    { id: "help", label: "Help", icon: "Info", items: [{ id: "guide", label: "User guide", command }, { id: "shortcuts", label: "Keyboard shortcuts", shortcut: "⌘/", command }] },
    { id: "sep-account", type: "separator" },
    { id: "logout", label: "Log out", danger: true, command },
  ];
  return <div className="w-full space-y-5">
    <label className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">Surface
      <select aria-label="Menu surface" value={variant} onChange={e => setVariant(e.target.value as PanelVariant)} className="rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">{MENU_VARIANTS.map(value => <option key={value}>{value}</option>)}</select>
    </label>
    <div className="flex flex-wrap items-start gap-6">
      <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Inline groups</h3><Menu aria-label="Workspace commands" variant={variant} items={documents} defaultExpandedKeys={["reports"]} /></div>
      <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Tiered submenus</h3><Menu aria-label="File commands" variant={variant} submenuMode="tiered" items={tiered} /></div>
      <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Selections</h3><Menu aria-label="Preferences" variant={variant} items={settings} /></div>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <Menu aria-label="Account" variant={variant} submenuMode="tiered" items={account} header={<div className="flex items-center gap-3 p-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-xs font-bold text-neutral-950">AM</span><div><p className="text-sm font-medium">Alex Morgan</p><p className="text-xs text-neutral-500">Plus</p></div></div>} trigger={<Button variant="soft">Open account menu</Button>} />
      <Menu aria-label="Popup documents" variant={variant} items={documents} placement="top" trigger={<Button variant="outline">Open document menu</Button>} />
      <p role="status" className="text-sm text-neutral-500">{message}</p>
    </div>
  </div>;
}

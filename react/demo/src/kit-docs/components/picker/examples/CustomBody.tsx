import { useState } from "react";
import { CustomIcon, Picker, type PickerItem } from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  {
    id: "workspace",
    textValue: "Aeon workspace main connected",
    icon: <CustomIcon icon="Folder" size="sm" />,
    // body replaces title/subtitle/description. Keep its content presentational:
    // the row and trigger already own their button/listbox interactions.
    body: <span className="flex min-w-0 flex-col gap-1">
      <span className="flex items-center gap-2"><strong>Aeon workspace</strong><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /></span>
      <code className="truncate text-xs opacity-70">~/work/aeon-workspace</code>
    </span>,
    tags: [{ label: "main", tone: "blue" }, { label: "connected", tone: "emerald" }],
  },
  {
    id: "service",
    textValue: "Auth service feature jwt",
    body: <span className="flex flex-col gap-1"><strong>Auth service</strong><span className="text-xs opacity-70">Custom <em>React content</em> with its own layout</span></span>,
    tags: [{ label: "feat/jwt", tone: "amber" }],
  },
  { id: "standard", title: "Standard item", subtitle: "Existing text fields still work", tags: [{ label: "text" }] },
];

export default function CustomBody() {
  const [selectedId, setSelectedId] = useState("workspace");
  return <div className="w-full max-w-xl"><Picker items={ITEMS} selectedId={selectedId} onSelect={item => setSelectedId(item.id)} /></div>;
}

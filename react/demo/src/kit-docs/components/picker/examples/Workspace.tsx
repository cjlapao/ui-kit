import { useState } from "react";
import { CustomIcon, Picker, type PickerItem } from "@cjlapao/ui-kit";

const WORKSPACES: PickerItem[] = [
  { id: "qa", title: "@aeon-qa-workspace", subtitle: "~/work/aeon-qa-workspace", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "main", tone: "blue" }, { label: "3 uncommitted", tone: "neutral" }] },
  { id: "auth", title: "@auth-service", subtitle: "~/work/services/auth-api", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "feat/jwt-v2", tone: "amber" }] },
  { id: "core", title: "@aeon-core-engine", subtitle: "~/work/aeon-core-engine", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "main · idle", tone: "neutral" }] },
];

export default function Workspace() {
  const [selectedId, setSelectedId] = useState("core");
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Workspace picker with a fixed leading icon</p>
        <Picker items={WORKSPACES} selectedId={selectedId} onSelect={item => setSelectedId(item.id)}
          leadingIcon="Folder" size="sm" searchPlaceholder="Filter workspaces or branches…" />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Same picker without the caret — click or use Enter / Space to open</p>
        <Picker items={WORKSPACES} selectedId={selectedId} onSelect={item => setSelectedId(item.id)}
          leadingIcon={<CustomIcon icon="Blueprint" size="sm" />} hideCaret size="sm"
          searchPlaceholder="Filter workspaces or branches…" />
      </div>
    </div>
  );
}

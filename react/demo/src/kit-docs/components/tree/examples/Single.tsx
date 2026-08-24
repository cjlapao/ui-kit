import { useState } from "react";
import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "work", label: "Work", icon: "ViewRows" },
      { id: "personal", label: "Personal", icon: "User" },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "projects", label: "Projects", icon: "Container" },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Single() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["work"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="single"
        defaultExpandedIds={["documents", "development"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Files"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected:{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds[0] ?? "none"}
        </span>
      </p>
    </div>
  );
}

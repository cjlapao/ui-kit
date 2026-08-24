import { useState } from "react";
import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "report", label: "Report.pdf", icon: "Log" },
      { id: "notes", label: "Notes.txt", icon: "Script" },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
      { id: "infra", label: "infra", icon: "CloudOff" },
    ],
  },
];

export default function Multiple() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["report"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="multiple"
        defaultExpandedIds={["documents", "development"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Files"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"}: {selectedIds.join(", ")}
      </p>
    </div>
  );
}

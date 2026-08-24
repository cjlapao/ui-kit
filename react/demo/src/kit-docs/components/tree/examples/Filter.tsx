import { useState } from "react";
import { Input, Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      {
        id: "work",
        label: "Work",
        icon: "ViewRows",
        children: [
          { id: "report", label: "Report.pdf", icon: "Log" },
          { id: "notes", label: "Notes.txt", icon: "Script" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        icon: "User",
        children: [
          { id: "photos", label: "Photos", icon: "Image" },
          { id: "travel", label: "Travel", icon: "Globe" },
        ],
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      {
        id: "projects",
        label: "Projects",
        icon: "Container",
        children: [
          { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
          { id: "infra", label: "infra", icon: "CloudOff" },
        ],
      },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Filter() {
  const [filter, setFilter] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input
        leadingIcon="Search"
        placeholder="Filter nodes…"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <Tree
        items={items}
        defaultExpandedIds={["documents", "development"]}
        filter={filter}
        emptyMessage="No nodes match."
        ariaLabel="Files"
      />
    </div>
  );
}

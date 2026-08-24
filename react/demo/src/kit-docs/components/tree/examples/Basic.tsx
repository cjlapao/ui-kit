import { Tree, type TreeItem } from "@cjlapao/ui-kit";

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
  { id: "downloads", label: "Downloads", icon: "Download" },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Basic() {
  return (
    <div className="w-full max-w-md">
      <Tree
        items={items}
        defaultExpandedIds={["documents"]}
        ariaLabel="Files"
      />
    </div>
  );
}

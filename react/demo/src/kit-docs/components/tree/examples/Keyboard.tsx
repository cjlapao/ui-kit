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
      { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
      { id: "infra", label: "infra", icon: "CloudOff" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

const HINTS: { keys: string; action: string }[] = [
  { keys: "↑ ↓", action: "navigate" },
  { keys: "→", action: "expand / first child" },
  { keys: "←", action: "collapse / parent" },
  { keys: "Space", action: "select" },
];

export default function Keyboard() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="single"
        defaultExpandedIds={["documents"]}
        ariaLabel="Files"
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500">
        {HINTS.map((hint) => (
          <span key={hint.keys} className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {hint.keys}
            </kbd>
            {hint.action}
          </span>
        ))}
      </div>
    </div>
  );
}

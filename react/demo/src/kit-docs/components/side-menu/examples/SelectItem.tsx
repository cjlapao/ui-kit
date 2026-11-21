import { useState } from "react";
import {
  SideMenu,
  type PickerItem,
  type SideMenuItem,
  type SideMenuSelectPicker,
} from "@cjlapao/ui-kit";
import { CONTEXT_OPTIONS } from "../demoData";

export default function SelectItem() {
  // The app owns the selection — both embedded selects are the same context
  // decision, so they share one controlled value.
  const [context, setContext] = useState<string | undefined>("test-qa");
  const picker: SideMenuSelectPicker = {
    items: CONTEXT_OPTIONS,
    placeholder: "Pick a workspace",
    selectedId: context,
    onSelect: (item: PickerItem) => setContext(item.id),
  };

  const items: SideMenuItem[] = [
    { slug: "overview", label: "Overview", path: "/overview", icon: "Dashboard" },
    { slug: "environment", type: "select", label: "Environment", picker },
    { slug: "workspaces", type: "group", label: "Workspaces" },
    {
      slug: "test-qa",
      label: "Test QA",
      path: "/ws/test_qa",
      icon: "Folder",
      groupName: "workspaces",
      defaultOpen: true,
      // The screenshot's row: the sub-list is nothing but the context picker.
      children: [
        {
          slug: "current-context",
          type: "select",
          label: "Current context",
          picker,
        },
      ],
    },
    {
      slug: "test",
      label: "Test",
      path: "/ws/test",
      icon: "Folder",
      groupName: "workspaces",
    },
  ];

  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-neutral-950">
      <div className="flex h-full">
        <SideMenu fullHeight collapsible color="blue" title="Select item" items={items} />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {context
              ? `Context: ${CONTEXT_OPTIONS.find((o) => o.id === context)?.title ?? context}`
              : "No context picked yet."}
          </p>
          <p className="text-xs text-neutral-400">
            A select row carries a caption over a full-width Picker — at top
            level or inside an open parent. Selection is yours through
            picker.selectedId / onSelect; the menu search never hides them.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}

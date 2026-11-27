import { ContentActions, ExpandableButton } from "@cjlapao/ui-kit";

const ACTIONS: { icon: string; label: string; color?: "rose" }[] = [
  { icon: "Copy", label: "Duplicate agent" },
  { icon: "Edit", label: "Edit agent" },
  { icon: "Star", label: "Pin agent" },
  { icon: "Archive", label: "Archive agent" },
  { icon: "Link", label: "Copy link" },
  { icon: "Trash", label: "Delete agent", color: "rose" },
];

export function ScrollingActions() {
  return (
    <div className="w-[320px] max-w-full min-w-0 rounded-xl border border-neutral-300 p-4 dark:border-neutral-700">
      <ContentActions
        gap="sm"
        align="center"
        contentClassName="overflow-hidden"
        actions={
          <>
            {ACTIONS.map((action) => (
              <ExpandableButton
                key={action.label}
                icon={action.icon}
                label={action.label}
                variant="soft"
                color={action.color}
              />
            ))}
          </>
        }
      >
        <h3 className="truncate text-lg font-semibold">Brainstormer</h3>
        <p className="truncate text-xs opacity-70">Six actions in a 320 px box.</p>
      </ContentActions>
    </div>
  );
}

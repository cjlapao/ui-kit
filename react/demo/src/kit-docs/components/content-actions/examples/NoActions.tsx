import { ContentActions } from "@cjlapao/ui-kit";

export function NoActions() {
  return (
    <div className="w-full min-w-0 rounded-xl border border-neutral-300 p-4 dark:border-neutral-700">
      <ContentActions contentClassName="overflow-hidden">
        <h3 className="truncate text-lg font-semibold">Brainstormer</h3>
        <p className="line-clamp-2 text-sm opacity-70">
          A plan is ready to review. Nothing is actionable yet, so the actions prop is
          left off.
        </p>
      </ContentActions>
    </div>
  );
}

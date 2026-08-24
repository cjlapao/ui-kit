import { Panel, StatusSpinner } from "@cjlapao/ui-kit";

const OnGlass = () => (
  <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
    <Panel variant="liquid-glass" tone="blue" padding="md">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <StatusSpinner label="Deploying update" tone="blue" />
        <StatusSpinner size="sm" tone="emerald" />
      </div>
    </Panel>
  </div>
);

export default OnGlass;

import { EcgMonitor } from "@cjlapao/ui-kit";

const States = () => (
  <div className="grid w-full gap-4 lg:grid-cols-3">
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Healthy
      </span>
      <EcgMonitor
        state="healthy"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Warning
      </span>
      <EcgMonitor
        state="warning"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Unhealthy
      </span>
      <EcgMonitor
        state="unhealthy"
        height={96}
        useFullWidth
        className="rounded-xl"
      />
    </div>
  </div>
);

export default States;

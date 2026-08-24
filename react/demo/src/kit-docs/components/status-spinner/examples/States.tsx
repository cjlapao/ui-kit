import { StatusSpinner } from "@cjlapao/ui-kit";

const States = () => (
  <div className="flex w-full flex-wrap items-center justify-center gap-6">
    <StatusSpinner size="md" tone="blue" animated label="Working" />
    <StatusSpinner size="md" tone="blue" animated={false} label="Idle" />
    <StatusSpinner size="md" tone="emerald" label="Healthy" />
    <StatusSpinner size="md" tone="amber" label="Pending" />
    <StatusSpinner size="md" tone="rose" animated={false} label="Failed" />
  </div>
);

export default States;

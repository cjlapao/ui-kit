import { Led } from "@cjlapao/ui-kit";

export default function Signals() {
  return <div className="flex flex-wrap items-center gap-8 text-sm text-neutral-700 dark:text-neutral-200">
    <span className="inline-flex items-center gap-3"><Led tone="emerald" animation="pulse" label="Connected" />Connected</span>
    <span className="inline-flex items-center gap-3"><Led tone="amber" animation="breathe" label="Waiting" />Waiting</span>
    <span className="inline-flex items-center gap-3"><Led tone="rose" animation="vibrate" label="Attention required" />Attention</span>
    <span className="inline-flex items-center gap-3"><Led tone="blue" lit={false} label="Offline" />Offline</span>
  </div>;
}

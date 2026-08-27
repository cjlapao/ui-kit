import { MetricBar } from "@cjlapao/ui-kit";

/** Any tone from the shared scale. It used to take only a `SpinnerColor`. */
export default function Tones() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["emerald", "amber", "rose", "violet"] as const).map((tone) => (
        <MetricBar key={tone} label={tone} value={`${60}%`} percentage={60} tone={tone} />
      ))}
    </div>
  );
}

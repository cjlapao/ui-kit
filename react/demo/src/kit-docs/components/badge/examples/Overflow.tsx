import { Badge } from "@cjlapao/ui-kit";

export default function Overflow() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {[1, 98, 99, 100, 2000].map((n) => (
          <Badge key={n} count={n} maxCount={99} tone="rose" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Badge count="new" tone="emerald" />
        <span className="text-xs opacity-60">
          a non-numeric value is left alone
        </span>
      </div>
    </div>
  );
}

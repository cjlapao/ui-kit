import { Badge } from "@cjlapao/ui-kit";

export default function RingOverlap() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <span className="flex items-center gap-2">
        <span className="relative inline-flex">
          <span className="h-9 w-9 rounded-lg bg-blue-500" />
          <span className="absolute -right-1.5 -top-1.5">
            <Badge ring count={7} tone="rose" />
          </span>
        </span>
        <span className="text-xs opacity-60">Ring on</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="relative inline-flex">
          <span className="h-9 w-9 rounded-lg bg-blue-500" />
          <span className="absolute -right-1.5 -top-1.5">
            <Badge ring={false} count={7} tone="rose" />
          </span>
        </span>
        <span className="text-xs opacity-60">Ring off</span>
      </span>
    </div>
  );
}

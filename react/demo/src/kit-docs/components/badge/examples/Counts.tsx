import { Badge } from "@cjlapao/ui-kit";

export default function Counts() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge count={1} />
      <Badge count={7} />
      <Badge count={23} tone="amber" />
      <Badge count={150} tone="rose" />
      <Badge count={0} showZero tone="emerald" />
    </div>
  );
}

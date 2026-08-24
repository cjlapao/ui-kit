import { Badge } from "@cjlapao/ui-kit";

export default function Dots() {
  return (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="emerald" aria-label="Online" />
        Online
      </span>
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="amber" aria-label="Away" />
        Away
      </span>
      <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <Badge dot tone="rose" aria-label="Busy" />
        Busy
      </span>
    </div>
  );
}

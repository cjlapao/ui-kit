import { DetailItemCard, Pill } from "@cjlapao/ui-kit";
import type { DetailItemCardBadgesAlignment } from "@cjlapao/ui-kit";

const ALIGNMENTS: DetailItemCardBadgesAlignment[] = [
  "right",
  "bottom",
  "bottom-end",
];

export default function BadgeAlignments() {
  return (
    <div className="flex w-full flex-col gap-4">
      {ALIGNMENTS.map((alignment) => (
        <DetailItemCard
          key={alignment}
          variant="outlined"
          tone="indigo"
          title="billing-worker"
          subtitle="Deployed 1 hour ago"
          icon="Log"
          badgesAlignment={alignment}
          badges={
            <>
              <Pill tone="emerald" size="xs">
                Healthy
              </Pill>
              <Pill tone="amber" size="xs">
                2 warnings
              </Pill>
              <Pill tone="rose" size="xs">
                Degraded
              </Pill>
            </>
          }
        />
      ))}
    </div>
  );
}

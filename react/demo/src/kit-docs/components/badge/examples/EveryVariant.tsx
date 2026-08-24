import { Badge, BADGE_VARIANTS } from "@cjlapao/ui-kit";

export default function EveryVariant() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {BADGE_VARIANTS.map((each) => (
        <span key={each} className="flex items-center gap-1.5">
          <Badge variant={each} tone="rose" count={7} />
          <span className="text-xs opacity-60">{each}</span>
        </span>
      ))}
    </div>
  );
}

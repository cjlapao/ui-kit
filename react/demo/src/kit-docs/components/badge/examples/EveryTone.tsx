import { Badge, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TRUE_COLORS.map((each) => (
        <Badge key={each} tone={each} count={7} />
      ))}
    </div>
  );
}

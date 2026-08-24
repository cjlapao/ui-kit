import { Badge } from "@cjlapao/ui-kit";
import type { BadgeSize } from "@cjlapao/ui-kit";

const SIZES: BadgeSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function SizeLadder() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {SIZES.map((each) => (
        <span key={each} className="flex items-center gap-1.5">
          <Badge size={each} tone="rose" count={7} />
          <Badge size={each} tone="rose" dot />
          <span className="text-xs opacity-60">{each}</span>
        </span>
      ))}
    </div>
  );
}

import { AppDivider } from "@cjlapao/ui-kit";
import type { AppDividerLabelPosition } from "@cjlapao/ui-kit";

const POSITIONS: AppDividerLabelPosition[] = ["start", "center", "end"];

export default function LabelPositions() {
  return (
    <div className="flex w-full flex-col gap-5">
      {POSITIONS.map((position) => (
        <AppDivider
          key={position}
          orientation="horizontal"
          variant="dashed"
          label="OR"
          labelPosition={position}
        />
      ))}
    </div>
  );
}

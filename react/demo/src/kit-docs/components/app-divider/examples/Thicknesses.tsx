import { AppDivider } from "@cjlapao/ui-kit";
import type { ControlSize } from "@cjlapao/ui-kit";

const SIZES: ControlSize[] = ["xs", "sm", "md", "lg", "xl"];

const PITCH: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export default function Thicknesses() {
  return (
    <div className="flex w-full flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {size} — {PITCH[size]}px
          </p>
          <AppDivider orientation="horizontal" size={size} spacing="xs" />
        </div>
      ))}
    </div>
  );
}

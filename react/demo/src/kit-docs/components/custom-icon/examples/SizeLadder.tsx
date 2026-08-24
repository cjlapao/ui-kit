import { CustomIcon } from "@cjlapao/ui-kit";
import type { IconSize } from "@cjlapao/ui-kit";

const SIZES: IconSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function SizeLadder() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-end gap-4">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <CustomIcon icon="Rocket" size={size} tone="indigo" />
            <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              {size}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <CustomIcon icon="Rocket" customSize={48} tone="indigo" />
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            customSize={"{48}"}
          </span>
        </div>
      </div>
    </div>
  );
}

import { CustomIcon } from "@cjlapao/ui-kit";
import type { IconName, IconSize } from "@cjlapao/ui-kit";

const SIZES: IconSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function Fallback() {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs opacity-70">
        A name that is not in the registry renders a monogram fallback that
        keeps the requested size — the layout around it does not collapse.
      </p>
      <div className="flex items-end gap-4">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <CustomIcon icon={"NotAnIcon" as IconName} size={size} />
            <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              {size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

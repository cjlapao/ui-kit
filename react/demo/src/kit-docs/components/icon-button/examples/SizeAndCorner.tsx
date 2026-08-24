import { CONTROL_SIZES, IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const ROUNDED = ["md", "lg", "xl", "full"] as const;

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
  </div>
);

const SizeAndCorner = () => (
  <div className="flex w-full flex-col gap-6">
    <div className="flex flex-wrap items-end gap-3">
      {CONTROL_SIZES.map((size) => (
        <Swatch key={size} label={size}>
          <IconButton
            icon="Send"
            variant="solid"
            color="blue"
            size={size}
            srLabel={size}
          />
        </Swatch>
      ))}
    </div>
    <div className="flex flex-wrap items-end gap-4">
      {ROUNDED.map((rounded) => (
        <Swatch key={rounded} label={rounded}>
          <IconButton
            icon="Send"
            variant="solid"
            color="blue"
            size="lg"
            rounded={rounded}
            srLabel={rounded}
          />
        </Swatch>
      ))}
    </div>
  </div>
);

export default SizeAndCorner;

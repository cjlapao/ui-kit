import { IconButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
  </div>
);

const EveryTone = () => (
  <div className="flex w-full flex-wrap items-end gap-3">
    {TRUE_COLORS.map((color) => (
      <Swatch key={color} label={color}>
        <IconButton
          icon="Send"
          variant="solid"
          color={color}
          size="md"
          srLabel={color}
        />
      </Swatch>
    ))}
  </div>
);

export default EveryTone;

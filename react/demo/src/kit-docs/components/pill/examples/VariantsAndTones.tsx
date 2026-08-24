import { type ReactNode } from "react";
import { PILL_VARIANTS, TRUE_COLORS, Pill } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const VariantsAndTones = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Every variant</Caption>
      <div className="flex flex-wrap items-center gap-3">
        {PILL_VARIANTS.map((each) => (
          <Pill key={each} tone="blue" variant={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>Every tone</Caption>
      <div className="flex flex-wrap gap-1.5">
        {TRUE_COLORS.map((each) => (
          <Pill key={each} variant="soft" size="xs" tone={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
  </div>
);

export default VariantsAndTones;

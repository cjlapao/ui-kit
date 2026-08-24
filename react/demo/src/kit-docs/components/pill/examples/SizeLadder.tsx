import { type ReactNode } from "react";
import { Badge, Pill } from "@cjlapao/ui-kit";
import type { PillSize } from "@cjlapao/ui-kit";

const SIZES: PillSize[] = ["xs", "sm", "md", "lg", "xl"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const SizeLadder = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Size ladder — pill and dot</Caption>
      <div className="flex flex-wrap items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1.5">
            <Pill tone="blue" variant="soft" size={value}>
              {value}
            </Pill>
            <Pill
              tone="blue"
              variant="soft"
              size={value}
              dot
              label={`Status ${value}`}
            />
          </span>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>A dot lines up with a Badge dot at the same size</Caption>
      <div className="flex items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1">
            <Pill tone="blue" variant="solid" size={value} dot />
            <Badge tone="blue" size={value} dot />
            <span className="text-[10px] opacity-60">{value}</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default SizeLadder;

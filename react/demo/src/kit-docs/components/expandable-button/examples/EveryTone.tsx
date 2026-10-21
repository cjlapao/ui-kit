import { ExpandableButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const EveryTone = () => (
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover any circle to spring its label out.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-3">
      {TRUE_COLORS.map((color) => (
        <Swatch key={color} label={color}>
          <ExpandableButton
            icon="Send"
            label={color}
            variant="solid"
            color={color}
            size="md"
            srLabel={color}
          />
        </Swatch>
      ))}
    </div>
    <p className="text-center text-[11px] opacity-60">
      All 21 true colours, solid at one size — fill, text and focus ring all
      follow <code>color</code>.
    </p>
  </div>
);

export default EveryTone;

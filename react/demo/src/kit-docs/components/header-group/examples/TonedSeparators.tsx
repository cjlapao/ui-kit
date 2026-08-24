import React from "react";
import {
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const Pair: React.FC<{ tone?: TrueColor; surface: "outlined" | "glass" }> = ({
  tone,
  surface,
}) => (
  <Panel variant={surface} tone="neutral" padding="none">
    <div className="flex h-12 items-center px-4">
      <HeaderGroup tone={tone} label="Navigation">
        <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
        <IconButton
          icon="ArrowRight"
          variant="ghost"
          size="xs"
          srLabel="Forward"
        />
      </HeaderGroup>
      <HeaderGroup tone={tone} label="View">
        <CustomIcon icon="ViewGrid" size="sm" tone={tone ?? "blue"} />
        <span className="text-sm font-medium">Grid</span>
      </HeaderGroup>
    </div>
  </Panel>
);

const TonedSeparators: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col gap-2">
      <Label>Untoned — follows the surface</Label>
      <Pair surface="outlined" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Toned: rose</Label>
      <Pair tone="rose" surface="outlined" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Untoned on glass</Label>
      <Pair surface="glass" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Toned: blue on glass</Label>
      <Pair tone="blue" surface="glass" />
    </div>
    <p className="text-xs opacity-70 sm:col-span-2">
      Untoned the rule is a quarter of the surrounding text colour, so it
      adapts to light, dark and glass alike. A tone sets it to that colour at
      400.
    </p>
  </div>
);

export default TonedSeparators;

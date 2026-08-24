import { IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
  </div>
);

const States = () => (
  <div className="flex w-full flex-wrap items-end gap-4">
    <Swatch label="Default">
      <IconButton icon="Send" variant="solid" color="blue" size="lg" srLabel="Default" />
    </Swatch>
    <Swatch label="Loading">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        loading
        srLabel="Loading"
      />
    </Swatch>
    <Swatch label="Disabled">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        disabled
        srLabel="Disabled"
      />
    </Swatch>
    <Swatch label="Accent">
      <IconButton
        icon="Send"
        variant="soft"
        color="blue"
        size="lg"
        accent
        srLabel="Accent"
      />
    </Swatch>
    <Swatch label="Icon tint">
      <IconButton
        icon="Star"
        variant="soft"
        color="neutral"
        size="lg"
        iconColor="red"
        srLabel="Tinted icon"
      />
    </Swatch>
    <Swatch label="Tooltip">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        tooltip="Hover me"
        tooltipPosition="top"
        srLabel="Tooltip"
      />
    </Swatch>
  </div>
);

export default States;

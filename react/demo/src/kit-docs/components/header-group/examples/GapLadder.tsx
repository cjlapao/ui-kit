import React from "react";
import {
  Badge,
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";
import type { ControlSize } from "@cjlapao/ui-kit";

const SIZES: ControlSize[] = ["xs", "sm", "md", "lg", "xl"];

const Row: React.FC<{ gap: ControlSize }> = ({ gap }) => (
  <div className="flex h-12 items-center px-4">
    <span className="w-8 text-xs opacity-60">{gap}</span>
    <HeaderGroup gap={gap} label="Navigation">
      <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
      <IconButton
        icon="ArrowRight"
        variant="ghost"
        size="xs"
        srLabel="Forward"
      />
    </HeaderGroup>
    <HeaderGroup gap={gap} label="View">
      <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
      <span className="text-sm font-medium">Grid</span>
    </HeaderGroup>
    <HeaderGroup gap={gap} label="Alerts">
      <CustomIcon icon="Notification" size="sm" tone="blue" />
      <Badge count={4} tone="rose" size="xs" />
    </HeaderGroup>
  </div>
);

const GapLadder: React.FC = () => (
  <div className="flex flex-col gap-3">
    <Panel variant="outlined" tone="neutral" padding="none">
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {SIZES.map((size) => (
          <Row key={size} gap={size} />
        ))}
      </div>
    </Panel>
    <p className="text-xs opacity-70">
      The separator reads the same custom property as the gap, so the rule
      stays centred between the groups at every step of the scale.
    </p>
  </div>
);

export default GapLadder;

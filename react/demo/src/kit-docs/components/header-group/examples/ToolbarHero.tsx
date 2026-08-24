import React from "react";
import {
  Badge,
  Button,
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";

const ToolbarHero: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Panel variant="outlined" tone="neutral" padding="none">
      <div className="flex h-14 items-center px-4">
        <HeaderGroup label="Navigation">
          <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
          <IconButton
            icon="ArrowRight"
            variant="ghost"
            size="xs"
            srLabel="Forward"
          />
        </HeaderGroup>
        <HeaderGroup label="View">
          <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
          <span className="text-sm font-medium">Grid</span>
        </HeaderGroup>
        <HeaderGroup label="Alerts">
          <CustomIcon icon="Notification" size="sm" tone="blue" />
          <Badge count={4} tone="rose" size="xs" />
        </HeaderGroup>
        <HeaderGroup label="Actions">
          <Button size="xs" variant="soft" color="blue">
            Deploy
          </Button>
        </HeaderGroup>
      </div>
    </Panel>
    <p className="text-xs opacity-70">
      Four clusters — navigation, view, alerts and actions — with a separator
      drawn between each adjacent pair. The first group never gets a leading
      rule.
    </p>
  </div>
);

export default ToolbarHero;

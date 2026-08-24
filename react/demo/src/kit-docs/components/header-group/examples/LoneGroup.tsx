import React from "react";
import {
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const LoneGroup: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label>One group — no leading rule</Label>
      <Panel variant="outlined" tone="neutral" padding="none">
        <div className="flex h-12 items-center px-4">
          <HeaderGroup label="Navigation">
            <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
            <IconButton
              icon="ArrowRight"
              variant="ghost"
              size="xs"
              srLabel="Forward"
            />
          </HeaderGroup>
        </div>
      </Panel>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Two groups — a rule between them</Label>
      <Panel variant="outlined" tone="neutral" padding="none">
        <div className="flex h-12 items-center px-4">
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
        </div>
      </Panel>
    </div>
    <p className="text-xs opacity-70">
      The separator is a pseudo-element on the <em>following</em> group, so a
      lone group draws nothing and no wrapper is needed between groups.
    </p>
  </div>
);

export default LoneGroup;

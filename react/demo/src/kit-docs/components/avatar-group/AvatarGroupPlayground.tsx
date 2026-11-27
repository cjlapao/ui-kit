import React from "react";
import {
  AvatarGroup,
  type AvatarGroupItem,
  type AvatarGroupRounded,
  type ControlSize,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type { PlaygroundPreviewProps } from "../../shared/playground/schema";
import { avatarGroupConfig } from "./avatarGroupPlayground";

/**
 * AvatarGroup's playground: the config in `avatarGroupPlayground.ts` in, the
 * controls column, the strip and the Code view out.
 *
 * The preview still names its props the way any demo does — that is what keeps
 * the live render type-checked against the component. The engine's guard is the
 * test that every printed prop name appears in the page's `PropsTable`, so the
 * two descriptions cannot wander apart quietly.
 */
export const AvatarGroupPlayground: React.FC = () => {
  const playground = usePlayground(avatarGroupConfig);

  return (
    <Playground
      playground={playground}
      preview={Roster}
      component={{ tag: "AvatarGroup", imports: ["AvatarGroup"] }}
      filename="AvatarGroup.tsx"
      hint={
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          The <code>tone</code> picker sets the group&apos;s fallback colour —
          the two icon chips carry their own and ignore it. Resize the window: a
          strip too narrow for its chips condenses on its own. Switch the stage
          to Code for the <code>&lt;AvatarGroup /&gt;</code> these settings make,
          roster and all.
        </p>
      }
    />
  );
};

/** The stage. `key` remounts on the two props the component reads once. */
const Roster: React.FC<PlaygroundPreviewProps> = ({ state, data }) => (
  <div className="w-full">
    <AvatarGroup
      key={`${state.expandOn}-${state.defaultExpanded}`}
      items={data.roster as AvatarGroupItem[]}
      size={state.size as ControlSize}
      tone={state.tone as TrueColor}
      rounded={state.rounded as AvatarGroupRounded}
      border={Boolean(state.border)}
      expandOn={state.expandOn as "click" | "hover"}
      maxVisible={Number(state.maxVisible)}
      defaultExpanded={Boolean(state.defaultExpanded)}
      singleRow={Boolean(state.singleRow)}
    />
  </div>
);

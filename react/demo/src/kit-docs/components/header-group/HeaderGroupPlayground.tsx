import React from "react";
import { HeaderGroup, Panel } from "@cjlapao/ui-kit";
import type { ControlSize, PanelVariant, TrueColor } from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { headerGroupConfig } from "./headerGroupPlayground";
import { CLUSTERS } from "./headerGroupFixture";
import {
  barHeight,
  directionOf,
  GAP_PX,
  groupCount,
  isNamed,
  isToned,
  RULE_PX,
  separatorOffset,
  separatorValueOf,
  surfaceOf,
  defined,
} from "./headerGroupStage";

/**
 * The playground itself.
 *
 * One bar, four clusters, one rule between each adjacent pair. The stage owns the
 * bar (height, direction, the `Panel` behind it) and the clusters come from
 * `headerGroupFixture.tsx`, which the Code view prints from as well — preview and
 * snippet mount and print the same elements, so neither can invent a cluster the
 * other does not have.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const count = groupCount(state);
  const gap = String(state.gap ?? "sm") as ControlSize;
  const itemGap = String(state.itemGap ?? "xs") as ControlSize;
  const divider = state.divider !== false;
  const separatorSize = separatorValueOf(state);
  const tone = isToned(state)
    ? (String(state.tone ?? "blue") as TrueColor)
    : undefined;
  const named = isNamed(state);

  return (
    <div className="w-full min-w-0">
      <Panel
        variant={surfaceOf(state) as PanelVariant}
        tone="neutral"
        padding="none"
      >
        <div
          className="flex items-center px-4"
          dir={directionOf(state) === "rtl" ? "rtl" : undefined}
          style={{ height: barHeight(state) }}
        >
          {CLUSTERS.slice(0, count).map((cluster) => (
            <HeaderGroup
              key={cluster.label}
              gap={gap}
              itemGap={itemGap}
              divider={divider}
              separatorSize={separatorSize}
              tone={tone}
              label={named ? cluster.label : undefined}
              className={defined(state.className)}
            >
              {cluster.content}
            </HeaderGroup>
          ))}
        </div>
      </Panel>
    </div>
  );
};

/**
 * The Code view: a hoisted fixture, then the bar the groups were built inside.
 *
 * `key` is React's, not the component's, and it comes first because that is where
 * a keyed element puts it. The wrapper is printed too — `HeaderGroup` is `h-full`
 * (:153) inside a flex row, so a snippet without the bar would describe a group
 * floating in nothing.
 */
export const headerGroupCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const count = groupCount(state);
  const barAttributes = [
    ...(directionOf(state) === "rtl" ? ['dir="rtl"'] : []),
    'className="flex items-center px-4"',
    `style={{ height: ${barHeight(state)} }}`,
  ];
  const item = h.element(
    "HeaderGroup",
    ["key={group.label}", ...h.props()],
    3,
    "{group.content}",
  );
  const bar = h.element(
    "div",
    barAttributes,
    1,
    `{GROUPS.slice(0, ${count}).map((group) => (\n${h.indent(item, 2)}\n))}`,
  );
  const panel = h.element(
    "Panel",
    [
      `variant=${JSON.stringify(surfaceOf(state))}`,
      'tone="neutral"',
      'padding="none"',
    ],
    0,
    bar,
  );

  return h.snippet({
    imports: [
      "Badge",
      "Button",
      "CustomIcon",
      "HeaderGroup",
      "IconButton",
      "Panel",
    ],
    decls: [h.decl("clusters")],
    body: h.demo(panel),
  });
};

export const HeaderGroupPlayground: React.FC = () => {
  const thickness = RULE_PX.xs;
  const playground = usePlayground(headerGroupConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={headerGroupCode}
      filename="HeaderGroupDemo.tsx"
      hint={
        <div className="flex flex-col gap-2 text-xs leading-relaxed opacity-80">
          <p>
            One number does two jobs: <code>gap</code> becomes the{" "}
            <code>margin-left</code> between adjacent groups and the rule&rsquo;s
            offset, both from the same custom property (:162,:165-167), so the rule
            cannot drift out of the gutter — the kit&rsquo;s test pins the pair (
            <code>HeaderGroup.test.tsx:28-40</code>).
          </p>
          <p>
            At the defaults (gap <code>sm</code>, thickness <code>xs</code>) the rule
            is <code>{thickness}px</code> wide and sits{" "}
            <code>{separatorOffset("sm", "xs")}px</code> left of the group that draws
            it — centred in a <code>{GAP_PX.sm}px</code> gutter with whole-pixel
            edges, and deliberately <em>without</em> a transform, which is what keeps
            every rule the same visible thickness (<code>:41-59</code>, test :140-145).
          </p>
          <p>
            <strong>Drop to one cluster</strong>: no rule appears at all. The separator
            is a <code>::before</code> on the <em>second</em> of two adjacent groups (
            <code>[&amp;+&amp;]</code>, :62-70), so there is no leading rule to hide and
            no wrapper element between the groups. Turn <code>divider</code> off and the
            whole ladder leaves the class list (:157) rather than being recoloured —
            that, too, is a test (:18-26).
          </p>
          <p>
            Untoned, the rule is 25% of the group&rsquo;s own copy colour (:177), which
            is why it survives a dark header; a tone pins it to that colour&rsquo;s{" "}
            <code>400</code> step (:176, test <code>:63-68</code>). Set the bar to <strong>RTL</strong>{" "}
            and watch what is <em>not</em> mirrored: <code>ml-[&hellip;]</code> (:62) and{" "}
            <code>left-[&hellip;]</code> (:65) are physical, so the rule lands on the
            wrong side of the gutter while the clusters themselves flip.
          </p>
        </div>
      }
    />
  );
};

export default HeaderGroupPlayground;

import React from "react";
import { ContentActions, ExpandableButton } from "@cjlapao/ui-kit";
import type { ButtonColor } from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import {
  actionSet,
  actionsChoice,
  contentSummary,
  contentTitle,
  defined,
  stageWidth,
} from "./contentActionsStage";
import { contentActionsConfig } from "./contentActionsPlayground";

/**
 * The playground itself.
 *
 * The stage keeps the resizable box, because the component fills whatever width
 * it is handed and never sizes itself: the only way to watch content yield to the
 * actions is to change the box around them. Preview and Code view both draw from
 * `ACTION_SETS`, and the classes printed on the `<h3>` and `<p>` are the ones the
 * preview renders — the snippet is the preview, not a description of it.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const actions = actionSet(state);
  const title = contentTitle(state);
  const summary = contentSummary(state);

  return (
    <div className="w-full min-w-0">
      <div
        data-slot="content-actions-stage"
        className="max-w-full min-w-0 resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700"
        style={{ width: stageWidth(state), minWidth: 160 }}
      >
        <ContentActions
          gap={String(state.gap ?? "md") as "xs" | "sm" | "md" | "lg" | "xl"}
          align={String(state.align ?? "start") as "start" | "center" | "end"}
          contentClassName={defined(state.contentClassName)}
          actionsClassName={defined(state.actionsClassName)}
          aria-label={defined(state.ariaLabel)}
          actions={
            actions ? (
              <>
                {actions.map((action) => (
                  <ExpandableButton
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    variant="soft"
                    color={action.color as ButtonColor | undefined}
                  />
                ))}
              </>
            ) : undefined
          }
        >
          {title !== "" && (
            <h3 className="truncate text-lg font-semibold">{title}</h3>
          )}
          {summary !== "" && (
            <p className="line-clamp-3 text-sm opacity-70">{summary}</p>
          )}
        </ContentActions>
      </div>
    </div>
  );
};

export const contentActionsCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const imports = ["ContentActions"];
  const decls: string[] = [];
  const actions = actionSet(state);
  if (actions) {
    imports.push("ExpandableButton");
    // Hoisted, because the row is the thing worth reading: same order, same
    // widths, one line per action — the preview renders exactly this list.
    decls.push(
      h.const("ACTIONS", {
        source: `(<>\n${actions
          .map(
            (action) =>
              `  <ExpandableButton icon=${h.lit(action.icon)} label=${h.lit(
                action.label,
              )} variant="soft"${
                action.color ? ` color=${h.lit(action.color)}` : ""
              } />`,
          )
          .join("\n")}\n</>)`,
        label: "One row of actions, in reading order",
        note: "ContentActions.tsx:39 keeps them there — flex-nowrap, shrink-0, overflow-x-auto. Each action brings its own accessible name.",
      }),
    );
  }
  const lines: string[] = [];
  const title = contentTitle(state);
  const summary = contentSummary(state);
  if (title !== "") {
    lines.push(`<h3 className="truncate text-lg font-semibold">${title}</h3>`);
  }
  if (summary !== "") {
    lines.push(`<p className="line-clamp-3 text-sm opacity-70">${summary}</p>`);
  }
  return h.snippet({
    imports,
    decls,
    body: h.demo(
      h.element(
        "ContentActions",
        h.props(),
        0,
        lines.length > 0 ? lines.join("\n") : undefined,
      ),
    ),
  });
};

export const ContentActionsPlayground: React.FC = () => {
  const playground = usePlayground(contentActionsConfig);
  const { state } = playground;
  const choice = actionsChoice(state);
  const narrow = stageWidth(state) <= 240;
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={contentActionsCode}
      filename="ContentActions.tsx"
      hint={
        <>
          Two regions and nothing else: the root is a <code>div</code> with{" "}
          <code>flex min-w-0 flex-nowrap</code> plus the align and gap maps (
          <code>:30</code>), the content gets <code>min-w-0 flex-1</code> (
          <code>:32</code>) and the actions get <code>flex-initial</code>,{" "}
          <code>flex-nowrap</code>, <code>overflow-x-auto</code> and{" "}
          <code>[&amp;&gt;*]:shrink-0</code> (<code>:39</code>). No padding, no border,
          no background — the box around this preview is the playground&rsquo;s, which is
          what lets the component sit inside any surface.
          <br />
          {choice === "none" ? (
            <>
              <strong>No actions, no second region.</strong> The presence test is{" "}
              <code>actions != null &amp;&amp; typeof actions !== &quot;boolean&quot;</code>{" "}
              (<code>:25</code>), so <code>undefined</code>, <code>null</code> and{" "}
              <code>false</code> all mean the row is never rendered (<code>:35</code>) —
              not rendered empty, and no gap left behind where it used to be. The
              kit&rsquo;s own test pins all three (<code>ContentActions.test.tsx:20-22</code>).
            </>
          ) : choice === "six" ? (
            <>
              <strong>Past the edge.</strong> The row cannot wrap (<code>flex-nowrap</code>)
              and no action may shrink (<code>[&amp;&gt;*]:shrink-0</code>, both at{" "}
              <code>:39</code>), so it scrolls instead of squashing the icons — and since
              it is a scroll container rather than a clipped one, tabbing to a button that
              is off-screen brings it into view.
            </>
          ) : (
            <>
              <strong>Who yields.</strong> <code>gap</code> is applied twice — the space
              between the two regions (<code>:30</code>) and between the actions themselves
              (<code>:40</code>), the same map both times. The content row is the flexible
              one, so growth belongs to the actions and shrinking to the content; a
              truncating title still needs <code>truncate</code> and an{" "}
              <code>overflow-hidden</code> parent, which is what the two class hooks are
              for.
            </>
          )}
          <br />
          {narrow ? (
            <>
              <strong>At {stageWidth(state)}px.</strong> The content is a sliver and the
              actions keep their full widths — that is the trade this component makes on
              purpose (<code>:32</code>,<code>:39</code>). If the actions matter more than
              the title at that width, they are in the wrong component: this one will
              never move them to a second row.
            </>
          ) : (
            <>
              <strong>Drag the corner.</strong> The box is resizable and the slider sets
              the same width numerically. Nothing here re-lays out on a breakpoint: every
              behaviour above is what a flex box does with the width it is handed, which is
              why there is no <code>minWidth</code> prop to reach for.
            </>
          )}
        </>
      }
    />
  );
};

export default ContentActionsPlayground;

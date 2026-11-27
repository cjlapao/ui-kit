import React from "react";
import { CollapsibleHelpText } from "@cjlapao/ui-kit";
import type {
  CollapsibleHelpTextVariant,
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  SurfaceTone,
  SurfaceTransparency,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground";
import { defaultDeclarations, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import {
  RENDER_MARKDOWN_BODY,
  defined,
  isTruncated,
  renderMarkdownFixture,
} from "./collapsibleHelpStage";
import { collapsibleHelpConfig } from "./collapsibleHelpPlayground";

/**
 * The playground itself.
 *
 * The preview and the Code view read the same `state` and the same `data`, and
 * the four forwarded colour knobs are passed as `undefined` while the reader
 * leaves them on `auto` — `transparency={undefined}` is Panel's per-variant
 * answer, `transparency="medium"` is an override, and only one of them is what
 * the card on screen shows.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const tone = String(state.tone ?? "none");
  const children = String(data.children ?? "");
  return (
    <div className="w-full">
      <CollapsibleHelpText
        variant={String(state.variant) as CollapsibleHelpTextVariant}
        tone={tone === "none" ? undefined : (tone as SurfaceTone)}
        corner={String(state.corner) as PanelCorner}
        padding={String(state.padding) as PanelPadding}
        raisedSurface={state.raisedSurface === true}
        transparency={defined(state.transparency) as SurfaceTransparency | undefined}
        specularMode={defined(state.specularMode) as PanelSpecularMode | undefined}
        vibrancy={defined(state.vibrancy) as GlassVibrancy | undefined}
        glassOpacity={defined(state.glassOpacity) as GlassOpacity | undefined}
        text={String(data.text)}
        maxLength={Number(state.maxLength)}
        title={(state.showTitle ?? true) === true ? String(state.title) : undefined}
        showIcon={state.showIcon === true}
        icon={String(state.icon ?? "Help")}
        renderMarkdown={
          state.renderMarkdown === true ? renderMarkdownFixture : undefined
        }
        expandLabel={defined(state.expandLabel)}
        collapseLabel={defined(state.collapseLabel)}
      >
        {children.length > 0 ? children : undefined}
      </CollapsibleHelpText>
    </div>
  );
};

export const collapsibleHelpCode = ({
  state,
  data,
  h,
}: PlaygroundCodeContext): string => {
  const children = String(data.children ?? "");
  const decls: string[] = [];
  if (state.renderMarkdown === true) {
    decls.push(
      h.const("renderMarkdown", {
        source: RENDER_MARKDOWN_BODY,
        label: "Markdown for the copy",
        note: "it receives the truncated summary, not the full text (:150-151)",
      }),
    );
  }
  return h.snippet({
    imports: ["CollapsibleHelpText"],
    decls: [...decls, ...defaultDeclarations(collapsibleHelpConfig, state, h)],
    // `undefined`, not "": an empty string still asks for an open/close pair,
    // and the reader would find a blank line where the children should be.
    body: h.demo(
      h.element(
        "CollapsibleHelpText",
        h.props(),
        0,
        children.length > 0 ? children : undefined,
      ),
    ),
  });
};

export const CollapsibleHelpTextPlayground: React.FC = () => {
  const playground = usePlayground(collapsibleHelpConfig);
  const truncated = isTruncated(playground.state);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={collapsibleHelpCode}
      filename="CollapsibleHelpText.tsx"
      hint={
        <>
          Opens on <code>card</code> — the documented default, and an alias of the{" "}
          <code>outlined</code> Panel (<code>:44,260</code>) — with 239 characters
          of copy against the default <code>maxLength</code> of 160, so there is
          something to collapse.
          <br />
          {truncated ? (
            <>
              The trigger is a real <code>&lt;button&gt;</code> carrying{" "}
              <code>aria-expanded</code>, <code>aria-controls</code> and an{" "}
              <code>aria-label</code> (<code>:210-216</code>) — without that label
              its name would be the whole paragraph. Shorten the copy, or raise{" "}
              <code>maxLength</code>, and the button, the chevron and both label
              controls disappear together: under the limit the component renders a{" "}
              <code>div</code> (<code>:230</code>).
            </>
          ) : (
            <>
              This copy fits under <code>maxLength</code>, so there is no toggle at
              all: <code>:209</code> falls through to a plain <code>div</code>{" "}
              (<code>:230</code>) — no button, no <code>aria-expanded</code>, no
              chevron, and nothing for <code>expandLabel</code> to name. Put the
              copy back to <em>Long</em> to see the other branch.
            </>
          )}
          <br />
          <code>plain</code> retires every surface control, because it renders no{" "}
          <code>Panel</code> at all (<code>:305-311</code>). On the card variants{" "}
          <code>padding</code> lands on the <em>trigger</em>, not the card
          (<code>:205</code>), which is pinned to <code>none</code> (
          <code>:320</code>) so the hover wash stays full-bleed. And{" "}
          <code>children</code> never hides: it is rendered outside the collapsed
          branch (<code>:234-244</code>).
        </>
      }
    />
  );
};

export default CollapsibleHelpTextPlayground;

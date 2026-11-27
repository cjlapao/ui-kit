import React, { useState } from "react";
import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
  SurfaceTone,
  SurfaceTransparency,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground";
import { defaultDeclarations, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  LongBody,
  RichTitle,
  ShortBody,
  defined,
  isControlled,
  isOpen,
} from "./collapsiblePanelStage";
import { collapsiblePanelConfig } from "./collapsiblePanelPlayground";

/**
 * The playground itself.
 *
 * Two things make this preview different from the card's own playground:
 *
 *   - The disclosure is **live in both modes**. `expanded` is read as
 *     `typeof expanded === "boolean"` (:267), so the component cannot be handed
 *     the printed prop and left alone — a controlled card whose parent never
 *     updates has a header that does nothing (:277-282). The stage keeps its own
 *     copy of the value, seeded from what the Code view prints and re-seeded
 *     whenever that decision changes, which is what a parent doing its job
 *     looks like from the reader's side.
 *   - The four glass knobs arrive as `undefined` while the reader leaves them on
 *     `auto`. `transparency={undefined}` is Panel's per-variant answer;
 *     `transparency="medium"` is an override, and only one of them describes the
 *     card on screen.
 */

const StageBody: React.FC<{ state: PlaygroundState }> = ({ state }) => {
  const [open, setOpen] = useState(isOpen(state));
  const controlled = isControlled(state);
  const tone = String(state.tone ?? "none");
  const subtitle = String(state.subtitle ?? "");
  const minExpandedHeight = Number(state.minExpandedHeight ?? 0);

  return (
    <div className="w-full">
      <CollapsiblePanel
        title={
          (state.richTitle ?? false) === true ? <RichTitle /> : String(state.title)
        }
        subtitle={subtitle.trim() === "" ? undefined : subtitle}
        actions={
          (state.showActions ?? true) === false ? undefined : (
            // The node the snippet prints as `ACTIONS` (collapsiblePanelStage's
            // ACTIONS_JSX); the snippet test pins that markup, so the two cannot
            // drift apart without a failing assertion.
            <Button size="xs" variant="ghost">
              Refresh
            </Button>
          )
        }
        headerLabel={defined(state.headerLabel)}
        defaultExpanded={controlled ? undefined : state.defaultExpanded === true}
        expanded={controlled ? open : undefined}
        onToggle={controlled ? setOpen : undefined}
        contentMaxHeight={Number(state.contentMaxHeight ?? 320)}
        minExpandedHeight={minExpandedHeight > 0 ? minExpandedHeight : undefined}
        fillHeight={state.fillHeight === true}
        disabled={state.disabled === true}
        variant={String(state.variant ?? "elevated") as PanelVariant}
        tone={tone === "none" ? undefined : (tone as SurfaceTone)}
        corner={String(state.corner) as PanelCorner}
        padding={String(state.padding) as PanelPadding}
        raisedSurface={state.raisedSurface === true}
        hoverable={state.hoverable === true}
        transparency={defined(state.transparency) as SurfaceTransparency | undefined}
        specularMode={defined(state.specularMode) as PanelSpecularMode | undefined}
        vibrancy={defined(state.vibrancy) as GlassVibrancy | undefined}
        glassOpacity={defined(state.glassOpacity) as GlassOpacity | undefined}
      >
        {(state.content ?? "short") === "long" ? <LongBody /> : <ShortBody />}
      </CollapsiblePanel>
    </div>
  );
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  // The printed decision is the seed, not the live value: changing `Expanded`
  // (or the mode) remounts the card at that state, and clicking the header then
  // moves it the way a parent keeping its own state would.
  const key = `${isControlled(state) ? "controlled" : "uncontrolled"}:${isOpen(
    state,
  )}`;
  return <StageBody key={key} state={state} />;
};

export const collapsiblePanelCode = ({
  state,
  data,
  h,
}: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  if (isControlled(state) && (state.onToggle ?? true) !== false) {
    decls.push(
      h.const("handleToggle", {
        source: "(next: boolean) => {\n  // Own the value you print as `expanded`.\n}",
        label: "The value the card is about to take",
        note: ":281 calls it with !isExpanded, in controlled mode too",
      }),
    );
  }
  const children = String(data.children ?? "");
  const imports = ["CollapsiblePanel"];
  if ((state.showActions ?? true) !== false) imports.push("Button");
  return h.snippet({
    imports,
    decls: [...decls, ...defaultDeclarations(collapsiblePanelConfig, state, h)],
    body: h.demo(
      h.element("CollapsiblePanel", h.props(), 0, children || undefined),
    ),
  });
};

export const CollapsiblePanelPlayground: React.FC = () => {
  const playground = usePlayground(collapsiblePanelConfig);
  const { state } = playground;
  const controlled = isControlled(state);
  const fills = state.fillHeight === true;
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={collapsiblePanelCode}
      filename="CollapsiblePanel.tsx"
      hint={
        <>
          <code>CollapsiblePanel</code> is a <code>Panel</code> with a{" "}
          <code>CollapsibleBody</code> inside it (<code>:285-299</code>):{" "}
          <code>variant</code>, <code>tone</code>, <code>corner</code> and the
          rest of the container API are forwarded, while{" "}
          <code>padding</code> is taken off the card — it lands on the header and
          the content box (<code>:91,132,214</code>) and the card is pinned{" "}
          <code>padding="none"</code> (<code>:293</code>), which is what keeps the
          header&rsquo;s hover wash flush against the card edge.
          <br />
          {controlled ? (
            <>
              <strong>Controlled.</strong> The card is open because the snippet
              says <code>expanded={"{"}true{"}"} </code>, and{" "}
              <code>onToggle</code> is the prop that lets a header click survive{" "}
              <code>:267</code>&rsquo;s <code>typeof expanded === "boolean"</code>{" "}
              test. Drop the handler and the header still fires — there is just
              nobody to change the value. <code>expanded={"{"}false{"}"}</code> is
              a printed answer, not an absence: leaving the prop out switches
              modes rather than closing the card.
            </>
          ) : (
            <>
              <strong>Uncontrolled.</strong> No <code>expanded</code> is passed, so{" "}
              <code>:267</code> hands the state to <code>useState(defaultExpanded)</code>{" "}
              (<code>:266-268</code>) and the header drives itself.{" "}
              <code>onToggle</code> is optional here and still worth having: it
              fires with the <em>next</em> value, controlled or not (
              <code>:277-282</code>).
            </>
          )}
          <br />
          {fills ? (
            <>
              <code>fillHeight</code> swaps scrolling for stretching: the body gets{" "}
              <code>overflow-hidden</code> instead of the thin scrollbar and{" "}
              <code>contentMaxHeight</code> is not read at all (
              <code>:216-223</code>) — which is why that control is gone from this
              list. It needs a parent with a height to fill.
            </>
          ) : (
            <>
              The body is capped at <code>min(contentMaxHeight, 65vh)</code> (
              <code>:222</code>) and scrolls inside that: the 65vh half is not a
              prop, so past a tall card the viewport, not the number, is the
              answer. Switch to <code>fillHeight</code> and the cap stops being
              read.
            </>
          )}
        </>
      }
    />
  );
};

export default CollapsiblePanelPlayground;

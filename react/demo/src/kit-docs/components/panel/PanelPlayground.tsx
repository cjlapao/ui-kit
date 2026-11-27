import React from "react";
import { Panel } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelAction,
  PanelCorner,
  PanelDecoration,
  PanelLoaderType,
  PanelMediaPlacement,
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
} from "../../shared/playground/schema";
import { HANDLER_BODY, defined, hueOf, triState } from "./panelStage";
import { panelConfig } from "./panelPlayground";

/**
 * The playground itself.
 *
 * The preview and the Code view read the same `state` and the same `data`, and
 * the props below are passed exactly as `Panel.tsx:645-711` expects them: the
 * three-state props become `undefined` rather than `true`/`false` when the
 * reader leaves them on `auto`, because `hoverable ?? Boolean(onClick)`
 * (:725,731) is a different answer from `hoverable={true}` and the card on
 * screen has to be the one the snippet describes.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const tone = String(state.tone ?? "none");
  const loading = state.loading === true;
  const loaderType = String(state.loaderType ?? "skeleton") as PanelLoaderType;
  const skeleton = loaderType === "skeleton";
  return (
    <Panel
      variant={String(state.variant) as PanelVariant}
      tone={tone === "none" ? undefined : (tone as SurfaceTone)}
      transparency={defined(state.transparency) as SurfaceTransparency | undefined}
      corner={String(state.corner) as PanelCorner}
      padding={String(state.padding) as PanelPadding}
      maxWidth={Number(state.maxWidth) > 0 ? Number(state.maxWidth) : undefined}
      minHeight={Number(state.minHeight) > 0 ? Number(state.minHeight) : undefined}
      decoration={String(state.decoration) as PanelDecoration}
      media={state.showMedia === true ? (data.media as React.ReactElement) : undefined}
      mediaPlacement={String(state.mediaPlacement) as PanelMediaPlacement}
      badge={state.showBadge === true ? String(state.badge) : undefined}
      title={String(state.title)}
      subtitle={String(state.subtitle)}
      description={String(state.description)}
      actions={state.showActions === true ? (data.actions as PanelAction[]) : undefined}
      actionLayout={String(state.actionLayout) as "auto" | "stacked" | "inline"}
      loading={loading}
      loaderType={loaderType}
      skeletonLines={Number(state.skeletonLines ?? 3)}
      loaderTitle={loading && !skeleton ? String(state.loaderTitle) : undefined}
      loaderMessage={loading && !skeleton ? String(state.loaderMessage) : undefined}
      loaderProgress={
        loading && loaderType === "progress" ? Number(state.loaderProgress) : undefined
      }
      hoverShadow={state.hoverShadow === true}
      hoverable={triState(state.hoverable)}
      clickable={triState(state.clickable)}
      onClick={state.onClick === true ? () => undefined : undefined}
      disabled={state.disabled === true}
      disabledVeil={state.disabledVeil !== false}
      active={state.active === true}
      activeTone={hueOf(state.activeTone)}
      pulse={state.pulse === true}
      pulseTone={hueOf(state.pulseTone)}
      hoverColor={hueOf(state.hoverColor)}
      borderColor={hueOf(state.borderColor)}
      backgroundColor={hueOf(state.backgroundColor)}
      raisedSurface={state.raisedSurface === true}
      nestedSurface={state.nestedSurface !== false}
      scrollable={state.scrollable !== false}
      flexBody={state.flexBody === true}
      specularMode={defined(state.specularMode) as PanelSpecularMode | undefined}
      vibrancy={defined(state.vibrancy) as GlassVibrancy | undefined}
      glassOpacity={defined(state.glassOpacity) as GlassOpacity | undefined}
    >
      {String(data.content)}
    </Panel>
  );
};

export const panelCode = ({ state, data, h }: PlaygroundCodeContext): string => {
  // Handlers are the two props no literal can say. They are declared rather
  // than inlined so the reader sees the shape (`() => void`) and fills in the
  // body, instead of copying a playground's `pushLog` that exists nowhere.
  const handlers: string[] = [];
  if (state.onClick === true) {
    handlers.push(
      h.const("onActivate", {
        source: HANDLER_BODY,
        label: "What the card does when it is activated",
      }),
    );
  }
  if (state.showActions === true) {
    handlers.push(
      h.const("onAction", {
        source: HANDLER_BODY,
        label: "What the card's own buttons do",
      }),
    );
  }
  return h.snippet({
    imports: ["Panel"],
    // Handlers before the fixtures that name them: `ACTIONS` reads `onAction`
    // while it is being built, so a `const` declared after it would be a
    // temporal-dead-zone error in the code the reader copies.
    decls: [...handlers, ...defaultDeclarations(panelConfig, state, h)],
    body: h.demo(h.element("Panel", h.props(), 0, String(data.content))),
  });
};

export const PanelPlayground: React.FC = () => {
  const playground = usePlayground(panelConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={panelCode}
      filename="Panel.tsx"
      hint={
        <>
          Opens on the kit's container standard — <code>elevated</code>, no tint,{" "}
          <code>rounded-md</code> (which renders <code>rounded-2xl</code>) and{" "}
          <code>sm</code> padding, all from the component's own defaults
          (<code>Panel.tsx:645-711</code>).
          <br />
          Two controls are honest about being idle. <code>vibrancy</code> and{" "}
          <code>glassOpacity</code> appear only on <code>liquid-glass</code>,
          because that is the one branch that reads them
          (<code>:958,1011-1012</code>) — on <code>glass</code> they were always
          silently dropped. <code>hoverShadow</code> never disappears, because
          the lift it asks for is not inside the hoverable condition at all
          (<code>:1283</code>) — turn <code>hoverable</code> off and it still
          lifts, only without the tint or the shared transition.
          <br />
          <code>onClick</code> starts off, so <code>hoverable</code> and{" "}
          <code>clickable</code> can be watched doing what the component actually
          does with an absent prop: <code>Boolean(onClick)</code>
          (<code>:725,731</code>). Turn it on and the card gains{" "}
          <code>role=&quot;button&quot;</code>, a tab stop and the Enter/Space path
          (<code>:1330-1357</code>) without you asking for any of them.
        </>
      }
    />
  );
};

export default PanelPlayground;

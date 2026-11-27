import React from "react";
import classNames from "classnames";
import { PanelHero } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  IconName,
  PanelDecoration,
  PanelHeroTitleElement,
  PanelHeroVariant,
  SpecularMode,
  SurfaceCorner,
  SurfacePadding,
  SurfaceTone,
  SurfaceTransparency,
  GlowIntensity,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { panelHeroConfig } from "./panelHeroPlayground";
import { ACTIONS, FIXTURE_NAMES, ICON_NODE } from "./panelHeroFixture";
import {
  ARTWORK_CLASS,
  ARTWORK_PAD,
  CLIP_CLASS,
  DEFAULT_TITLE,
  PANEL_DEFAULT,
  hasActions,
  iconChoice,
  isGlassy,
  isGradient,
  textOf,
} from "./panelHeroStage";

/**
 * The playground itself.
 *
 * One banner, and the stage behind it: a plain page, or artwork with a
 * clipping ancestor on top of it. Only the artwork is printed — the band does
 * not need a wrapper to exist, so wrapping it in the snippet would be stage
 * theatre; the switch is there because the halo's claim (:316-318) can only be
 * checked against an ancestor that really does clip.
 */

const pick = <T extends string>(
  state: { [key: string]: unknown },
  id: string,
  fallback: T,
): T => String(state[id] ?? fallback) as T;

/** The glass knobs print nothing until the reader picks one of their own. */
const orPanel = (value: unknown): string | undefined => {
  const text = String(value ?? PANEL_DEFAULT);
  return text === PANEL_DEFAULT ? undefined : text;
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const icon = iconChoice(state);
  const artwork = String(state.backdrop ?? "page") === "artwork";

  const hero = (
    <PanelHero
      variant={pick<PanelHeroVariant>(state, "variant", "gradient")}
      tone={pick<SurfaceTone>(state, "tone", "none")}
      padding={pick<SurfacePadding>(state, "padding", "sm")}
      corner={pick<SurfaceCorner>(state, "corner", "rounded-md")}
      decoration={pick<PanelDecoration>(state, "decoration", "both")}
      raisedSurface={state.raisedSurface === true}
      titleAs={pick<PanelHeroTitleElement>(state, "titleAs", "p")}
      icon={
        icon === "none"
          ? undefined
          : icon === "node"
            ? ICON_NODE
            : (icon as IconName)
      }
      title={textOf(state, "title") || DEFAULT_TITLE}
      subtitle={textOf(state, "subtitle") || undefined}
      titleSize={pick<ControlSize>(state, "titleSize", "sm")}
      subtitleSize={pick<ControlSize>(state, "subtitleSize", "xs")}
      glowIntensity={
        isGradient(state)
          ? pick<GlowIntensity>(state, "glowIntensity", "soft")
          : undefined
      }
      gradientFrom={textOf(state, "gradientFrom") || undefined}
      gradientTo={textOf(state, "gradientTo") || undefined}
      glassOpacity={
        isGlassy(state)
          ? (orPanel(state.glassOpacity) as GlassOpacity | undefined)
          : undefined
      }
      transparency={
        isGlassy(state)
          ? (orPanel(state.transparency) as SurfaceTransparency | undefined)
          : undefined
      }
      vibrancy={
        isGlassy(state)
          ? (orPanel(state.vibrancy) as GlassVibrancy | undefined)
          : undefined
      }
      specularMode={
        isGlassy(state)
          ? (orPanel(state.specularMode) as SpecularMode | undefined)
          : undefined
      }
      className={textOf(state, "className") || undefined}
    >
      {hasActions(state) ? ACTIONS : undefined}
    </PanelHero>
  );

  if (!artwork) return <div className="w-full min-w-0">{hero}</div>;

  return (
    <div className="w-full min-w-0">
      <div className={classNames(ARTWORK_CLASS, ARTWORK_PAD, {
          [CLIP_CLASS]: state.clipped === true,
        })}>
        {hero}
      </div>
    </div>
  );
};

/** The name the artwork's class list is hoisted under. */
const BACKDROP_NAME = "BACKDROP_CLASS";

/**
 * The Code view.
 *
 * Attributes come from the config's order, which is the order a file would
 * write them in: the surface first, then the words, then the paint. The
 * children — if the reader kept them — are printed from the same element the
 * preview mounts, so a button that is not on screen cannot appear here.
 */
export const panelHeroCode = ({ state, h }: PlaygroundCodeContext): string => {
  const artwork = String(state.backdrop ?? "page") === "artwork";
  const children = hasActions(state)
    ? h.jsx(ACTIONS, { names: FIXTURE_NAMES })
    : undefined;
  const hero = h.element(
    "PanelHero",
    h.props(),
    artwork ? 1 : 0,
    children,
  );
  const body = artwork
    ? h.element("div", [`className={${BACKDROP_NAME}}`], 0, hero)
    : hero;
  const imports = ["PanelHero"];
  if (hasActions(state)) imports.push("Button");
  if (iconChoice(state) === "node") imports.push("CustomIcon");

  return h.snippet({
    imports,
    decls: artwork ? [h.decl("backdrop")] : [],
    body: h.demo(body),
  });
};

export const PanelHeroPlayground: React.FC = () => {
  const playground = usePlayground(panelHeroConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={panelHeroCode}
      filename="PanelHeroDemo.tsx"
      hint={<Hint />}
    />
  );
};

/** The four things worth saying about a banner that looks this simple. */
const Hint: React.FC = () => (
  <div className="flex flex-col gap-2 text-xs leading-relaxed opacity-80">
    <p>
      Nothing here is blue. The JSDoc still says <code>@default &quot;blue&quot;</code>{" "}
      (:73) but the component destructures no default (:239) and falls through{" "}
      <code>tone ?? color ?? &quot;none&quot;</code> (:260) to{" "}
      <code>neutral</code> (<code>common/theme/Theme.ts:69</code>) — so the
      control opens on <strong>None</strong> and the band reads neutral-700 into
      neutral-800. The halo behind it is a <em>different</em> pair, the
      tone&rsquo;s 600 and 400 (<code>Theme.ts:2093-2100</code>), which is why the
      kit&rsquo;s test reaches for the band by its <code>data-variant</code>{" "}
      rather than matching CSS (<code>PanelHero.test.tsx:19-27</code>).
    </p>
    <p>
      The band&rsquo;s stops are the tone&rsquo;s <strong>700</strong> and{" "}
      <strong>800</strong> (:309-312) because that is where white copy clears the
      kit&rsquo;s measured floor — 4.93:1 at worst, against 2.94:1 on the{" "}
      <code>-400</code> stop the hand-written table used (:223-233, and a test
      that asserts no 300/400/500/600 stop can appear: <code>:58-69</code>). Type
      a stop of your own and you have opted out of that guarantee; the field is
      there rather than hidden because the alternative is a component that cannot
      be branded.
    </p>
    <p>
      Only <code>gradient</code> is a band. Every other variant is a{" "}
      <code>Panel</code> (:281-303) — which is why switching to <strong>glass</strong>{" "}
      makes four more controls appear: <code>glassOpacity</code>,{" "}
      <code>transparency</code>, <code>vibrancy</code> and{" "}
      <code>specularMode</code> are forwarded to that <code>Panel</code> and do
      nothing on the band, exactly like <code>raisedSurface</code>. On a surface
      the copy also stops being white and starts coming from the surface (
      <code>:200</code>,<code>:210</code>; test :141-152).
    </p>
    <p>
      The title is a <code>&lt;p&gt;</code> until you say otherwise (:237,:155) — a
      page-top banner should pass <code>h1</code> or <code>h2</code>, or it
      announces nothing to a screen reader (test :156-170). Keep the actions in{" "}
      <code>children</code>: they are rendered under the title row (
      <code>:218</code>) after having once been spread onto the wrapper and
      overwritten (test :31-43), and every decorative layer — halo, three
      circles, wash — is <code>aria-hidden</code> (:320,:349,:353,:357,:364).
      Switch the backdrop to <strong>Artwork</strong> and turn on{" "}
      <strong>Ancestor clips</strong> to watch the halo survive a scroller: it is
      inset inside the padding the band reserves (:315,:323, <code>p-5</code>/
      <code>inset-5</code> at <code>Theme.ts:2056-2058</code>) instead of
      overflowing the box.
    </p>
  </div>
);

export default PanelHeroPlayground;

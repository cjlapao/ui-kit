import React from "react";
import {
  CustomIcon,
  PageHeader,
  SideMenu,
  getSurfaceAccentColor,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PageHeaderVariant,
  PanelCorner,
  PanelSpecularMode,
  SurfacePadding,
  SurfaceTone,
  SurfaceTransparency,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { DEMO_ITEMS } from "../side-menu/demoData";
import { pageHeaderConfig } from "./pageHeaderPlayground";
import { FIXTURE_NAMES } from "./pageHeaderFixture";
import {
  DEFAULT_ACCENT_COLOR,
  PANEL_DEFAULT,
  REGIONS,
  REGION_IDS,
  isFloatingGlass,
  isLiquid,
  regionOn,
  shellVariant,
  showsRaisedSurface,
  showsTone,
  showsTransparency,
  textOf,
} from "./pageHeaderStage";

/**
 * The playground itself.
 *
 * A header in the only context that explains it: beside a `SideMenu`. That menu
 * is the docs' own stand-in (`Shell` in the controls), not part of the printed
 * code — it is there because `default` and the two floating names are defined by
 * their relationship to it (:46-52,:136-141), so a bar floating in white space
 * cannot be read.
 */

const SHELL_FRAME =
  "h-80 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950";

const gutterOf = (state: PlaygroundPreviewProps["state"], id: string) => {
  const value = String(state[id] ?? PANEL_DEFAULT);
  return value === PANEL_DEFAULT ? undefined : (value as SurfacePadding);
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const label = textOf(state, "ariaLabel");
  const variant = String(state.variant ?? "default") as PageHeaderVariant;
  const accent = String(state.accentColor ?? DEFAULT_ACCENT_COLOR);
  const transparency = String(state.transparency ?? PANEL_DEFAULT);
  const showShell = state.shell !== false;

  return (
    <div className={SHELL_FRAME}>
      <div className="flex h-full">
        {showShell && (
          <SideMenu
            fullHeight
            collapsible
            variant={
              shellVariant(state) as
                | "sidebar"
                | "glass"
                | "floating"
                | "floating-glass"
            }
            color={
              accent === PANEL_DEFAULT
                ? getSurfaceAccentColor(
                    String(state.tone ?? "none") as SurfaceTone,
                  )
                : (accent as TrueColor)
            }
            logoIcon={
              <CustomIcon
                icon="UX"
                className="h-6 w-6 text-neutral-500 dark:text-neutral-300"
              />
            }
            logoText={
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                ui-kit
              </span>
            }
            collapsed={state.collapsed === true}
            onToggleCollapse={() => set("collapsed", state.collapsed !== true)}
            items={DEMO_ITEMS}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            {...(label === "" ? {} : { "aria-label": label })}
            variant={variant}
            tone={showsTone(state) ? (String(state.tone ?? "none") as SurfaceTone) : undefined}
            accentColor={
              isFloatingGlass(state) && accent !== PANEL_DEFAULT
                ? (accent as TrueColor)
                : undefined
            }
            corner={String(state.corner ?? "rounded-md") as PanelCorner}
            glassOpacity={
              isLiquid(state) && state.glassOpacity !== PANEL_DEFAULT
                ? (String(state.glassOpacity) as GlassOpacity)
                : undefined
            }
            vibrancy={
              isLiquid(state) && state.vibrancy !== PANEL_DEFAULT
                ? (String(state.vibrancy) as GlassVibrancy)
                : undefined
            }
            specularMode={
              isLiquid(state) && state.specularMode !== PANEL_DEFAULT
                ? (String(state.specularMode) as PanelSpecularMode)
                : undefined
            }
            transparency={
              showsTransparency(state) && transparency !== PANEL_DEFAULT
                ? (transparency as SurfaceTransparency)
                : undefined
            }
            raisedSurface={
              showsRaisedSurface(state) ? state.raisedSurface === true : undefined
            }
            padding={gutterOf(state, "padding")}
            paddingTop={gutterOf(state, "paddingTop")}
            paddingRight={gutterOf(state, "paddingRight")}
            paddingBottom={gutterOf(state, "paddingBottom")}
            paddingLeft={gutterOf(state, "paddingLeft")}
            className={textOf(state, "className") || undefined}
            start={regionOn(state, "start") ? REGIONS.start.element : undefined}
            center={regionOn(state, "center") ? REGIONS.center.element : undefined}
            end={regionOn(state, "end") ? REGIONS.end.element : undefined}
          >
            {regionOn(state, "extra") ? REGIONS.extra.element : undefined}
          </PageHeader>
          <div className="flex-1 space-y-3 p-6">
            <div className="h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The Code view.
 *
 * The shell the preview is standing in stays out of it — a page supplies its own
 * layout, and printing a `SideMenu` here would claim the header renders one. Each
 * region the reader keeps is hoisted to a named const: the bar is the API, the
 * groups are its content, and JSX three levels deep would bury the former
 * (:26-42).
 */
export const pageHeaderCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  const uses = new Set<string>();

  for (const id of REGION_IDS) {
    if (!regionOn(state, id)) continue;
    const spec = REGIONS[id];
    spec.uses.forEach((name) => uses.add(name));
    decls.push(
      h.const(spec.constName, {
        source: `(${h.jsx(spec.element, { names: FIXTURE_NAMES })})`,
        label: spec.label,
        note: spec.note,
      }),
    );
  }

  // The fourth group prints as a child, not an attribute — it is `children`
  // (:191), and the only region the bar lets go of when it is empty.
  const children = regionOn(state, "extra")
    ? `{${REGIONS.extra.constName}}`
    : undefined;

  return h.snippet({
    imports: ["PageHeader", ...uses].sort(),
    decls,
    body: h.demo(h.element("PageHeader", h.props(), 0, children)),
  });
};

export const PageHeaderPlayground: React.FC = () => {
  const playground = usePlayground(pageHeaderConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={pageHeaderCode}
      filename="PageHeaderDemo.tsx"
      hint={<Hint />}
    />
  );
};

/** What is worth knowing while dragging these particular controls. */
const Hint: React.FC = () => (
  <div className="flex flex-col gap-2 text-xs leading-relaxed opacity-80">
    <p>
      <strong>None of the <em>padding</em> controls pads the bar.</strong> They set
      the space <em>outside</em> it (:73-88, painted as{" "}
      <code>mt-*/mr-*/mb-*/ml-*</code> at :165-168 via Theme.ts:1932-1935); the
      inset inside stays the seam&rsquo;s own <code>px-5</code> (:163) and the inner{" "}
      <code>Panel</code> is pinned <code>padding=&quot;none&quot;</code> (:185). Each
      axis opens on <em>inherit</em> because the default is the variant&rsquo;s, not a
      constant: the flush bar closes on all four sides, the floating card keeps the
      menu&rsquo;s <code>m-2</code> above and to its right and sits flush left and
      below (:151-156, test :173-203). <em>padding</em> sets all four at once and
      loses to any axis you set yourself (:153-156).
    </p>
    <p>
      The <em>Glass</em> group is hidden until it can do something.{" "}
      <code>tone</code>, <code>glassOpacity</code>, <code>transparency</code>,{" "}
      <code>vibrancy</code>, <code>specularMode</code> and{" "}
      <code>raisedSurface</code> are forwarded to one body <code>Panel</code>{" "}
      (:181-186) that only exists on the shared variants (:143) — on{" "}
      <strong>default</strong>, <strong>floating</strong>,{" "}
      <strong>floating-glass</strong>, <strong>none</strong> and{" "}
      <strong>plain</strong> they are inert, so they are not offered. Within the
      shared ones, <code>tone</code> is invisible on <strong>elevated</strong>{" "}
      (Panel.tsx:963-968 reads no palette), the three glass knobs belong to{" "}
      <strong>liquid-glass</strong> alone (Panel.tsx:1011-1012), and{" "}
      <code>raisedSurface</code> is a documented no-op outside the nesting
      ladder&rsquo;s tinted variants (Panel.tsx:312-314). <code>accentColor</code>{" "}
      is <strong>floating-glass</strong> only (:144-145, and its JSDoc at :68 says
      the rest ignore it).
    </p>
    <p>
      The height is not a prop. Every variant is <code>h-15</code> (:164 +{" "}
      <code>SIDE_MENU_HEADER_HEIGHT</code>, Theme.ts:1718) because that is the
      sidebar&rsquo;s own logo-header height — which is also why the seam holds: the
      flush bar adds <code>border-b</code> in the same fill and border colours the{" "}
      <code>SideMenu</code> paints on its facing edge (:177, Theme.ts:1719-1721),
      and test :60-67 fails if either side drifts. A detached card has no seam to
      continue (:49-52), so <strong>floating</strong> keeps the border on all four
      sides instead (:170-176).
    </p>
    <p>
      Corner names lie by one step, as they do everywhere in the kit: the default{" "}
      <code>rounded-md</code> (:132 + Theme.ts:1531-1532) emits{" "}
      <code>rounded-2xl</code> (Theme.ts:1515) — precisely the radius the floating
      cards&rsquo; shared token already produced (:136-141), which is why a paired
      menu and header match until you turn the knob (test :205-222).
    </p>
  </div>
);

export default PageHeaderPlayground;

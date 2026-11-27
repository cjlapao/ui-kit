import React from "react";
import { SidePanel } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  SidePanelSide,
  SidePanelVariant,
  SurfaceCorner,
  SurfacePadding,
  SurfaceTone,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import { SIDE_PANEL_SLOTS, sidePanelConfig } from "./sidePanelPlayground";
import {
  CORNER_DEFAULT,
  HEIGHT_DEFAULT,
  INSET_AUTO,
  MAX_WIDTH_DEFAULT,
  MIN_WIDTH_DEFAULT,
  SIZE_DEFAULT,
  SURFACE_TONE_DEFAULT,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  WIDTH_DEFAULT,
  collapseChoice,
  flag,
  heightOf,
  isCollapsed,
  isCollapsible,
  isDocked,
  isInset,
  isResizable,
  isVertical,
  maxOf,
  minOf,
  needsHostState,
  sideOf,
  sizeEscapesBounds,
  textValue,
  usesOverlay,
  variantOf,
  widthOf,
} from "./sidePanelStage";
import {
  BODY_SOURCE,
  Body,
  PAGE_CONTENT,
  PAGE_CONTENT_SOURCE,
  SLOT_NAMES,
  STAGE_CLASS,
  SUBTITLE,
  TITLE,
} from "./sidePanelFixture";

/**
 * The preview passes exactly the props the Code view prints — the same gate,
 * written twice, once as JSX and once as a string. A prop at its documented
 * default is passed as `undefined` on this side and suppressed on that one, which
 * is why a reader can copy the block and get the panel they were looking at.
 */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const vertical = isVertical(state);
  const docked = isDocked(state);
  const resizable = isResizable(state);
  const reported = flag(state, "collapseReport");
  const slots = Object.fromEntries(
    SIDE_PANEL_SLOTS.map((slot) => [
      slot.id,
      flag(state, slot.id) ? slot.node : undefined,
    ]),
  ) as Record<(typeof SIDE_PANEL_SLOTS)[number]["id"], React.ReactNode>;

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {caption(state)}
      </p>
      <div className={STAGE_CLASS}>
        {PAGE_CONTENT}
        <SidePanel
          isOpen={state.open === true}
          side={
            sideOf(state) === "right" ? undefined : (sideOf(state) as SidePanelSide)
          }
          title={TITLE}
          subtitle={SUBTITLE}
          onClose={flag(state, "closable") ? () => set("open", false) : undefined}
          docked={docked || undefined}
          overlay={usesOverlay(state) ? true : undefined}
          collapsible={isCollapsible(state) || undefined}
          collapsed={
            collapseChoice(state) === "self"
              ? undefined
              : collapseChoice(state) === "collapsed"
                ? true
                : false
          }
          onCollapsedChange={
            reported
              ? (next: boolean) => set("collapse", next ? "collapsed" : "expanded")
              : undefined
          }
          collapsedLabel={
            textValue(state, "collapsedLabel").length > 0
              ? textValue(state, "collapsedLabel")
              : undefined
          }
          variant={
            variantOf(state) === VARIANT_DEFAULT
              ? undefined
              : (variantOf(state) as SidePanelVariant)
          }
          surfaceTone={
            String(state.surfaceTone ?? SURFACE_TONE_DEFAULT) === SURFACE_TONE_DEFAULT
              ? undefined
              : (String(state.surfaceTone) as SurfaceTone)
          }
          tone={
            String(state.tone ?? TONE_DEFAULT) === TONE_DEFAULT
              ? undefined
              : (String(state.tone) as TrueColor)
          }
          size={
            String(state.size ?? SIZE_DEFAULT) === SIZE_DEFAULT
              ? undefined
              : (String(state.size) as ControlSize)
          }
          corner={
            String(state.corner ?? CORNER_DEFAULT) === CORNER_DEFAULT
              ? undefined
              : (String(state.corner) as SurfaceCorner)
          }
          flush={state.flush === false ? false : undefined}
          inset={
            String(state.inset ?? INSET_AUTO) === INSET_AUTO
              ? undefined
              : isInset(state)
                ? (String(state.inset) as SurfacePadding)
                : false
          }
          noise={flag(state, "noise") || undefined}
          resizable={resizable || undefined}
          width={
            vertical || widthOf(state) === WIDTH_DEFAULT
              ? undefined
              : widthOf(state)
          }
          height={
            !vertical || heightOf(state) === HEIGHT_DEFAULT
              ? undefined
              : heightOf(state)
          }
          minWidth={
            resizable && !vertical && minOf(state) !== MIN_WIDTH_DEFAULT
              ? minOf(state)
              : undefined
          }
          maxWidth={
            resizable && !vertical && maxOf(state) !== MAX_WIDTH_DEFAULT
              ? maxOf(state)
              : undefined
          }
          headerActions={slots.headerActions}
          headerPills={slots.headerPills}
          subHeader={slots.subHeader}
          footer={slots.footer}
        >
          <Body />
        </SidePanel>
      </div>
    </div>
  );
};

/** The one sentence the frame needs right now, chosen by what is actually on it. */
const caption = (state: PlaygroundState): string => {
  if (state.open !== true) {
    return isDocked(state)
      ? "Nothing here: a docked panel that is not open returns null, so it keeps no space and leaves no shell behind (:839)."
      : "Nothing here: a closed panel unmounts when its close transition ends (:622), so it is not hiding in this frame, it is gone (:839).";
  }
  if (isCollapsed(state)) {
    return "Collapsed: the full panel stays mounted but `inert` and faded, and the 56px rail with its chevron is the only thing left to reach (:1012-1020,:1126-1150).";
  }
  if (usesOverlay(state) && !flag(state, "closable")) {
    return "The scrim covers the page and does nothing: its click handler is only attached when there is an `onClose` to call (:1162-1184).";
  }
  if (sizeEscapesBounds(state)) {
    return `The size sits outside the handle's own bounds — the separator clamps the next key press, not the number you passed (:827-833).`;
  }
  if (isResizable(state)) {
    return "The separator is a `role=\"separator\"` tab stop: the arrow pointing away from the docked edge grows the panel, its mirror shrinks it, and Home and End land on the bounds (:806-834,:1195-1211).";
  }
  if (!isCollapsible(state) && !flag(state, "closable")) {
    return "Nothing in this panel can dismiss it — the close button needs `onClose`, the chevron needs `collapsible`, and Escape is not the panel's business (:1080,:702).";
  }
  return "The sub-header and footer are `flex-none` outside the scroll container, so only the rows between them travel (:1094-1120).";
};

export const sidePanelCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const imports = new Set<string>(["SidePanel"]);
  const decls: string[] = [];

  // The page behind the panel, printed as the component the reader would write.
  decls.push(
    h.const("PageContent", {
      source: PAGE_CONTENT_SOURCE,
      label: "the page the panel covers",
      note: "nothing in it moves when the panel opens — the panel is out of flow",
    }),
  );
  decls.push(h.decl("rows"));

  for (const slot of SIDE_PANEL_SLOTS) {
    if (state[slot.id] !== true) continue;
    decls.push(
      h.const(slot.constName, {
        source: h.jsx(slot.node, { names: SLOT_NAMES }),
        label: `the ${slot.id} slot`,
      }),
    );
    for (const name of slot.imports) imports.add(name);
  }

  const attributes = [
    // The header the demo always shows; `title` is optional to the component and
    // the kit warns in development without one (:491).
    `title=${h.lit(TITLE)}`,
    `subtitle=${h.lit(SUBTITLE)}`,
    ...h.props(),
  ];

  // `elementOf` indents the children it is given, so they arrive un-indented —
  // pre-indenting here would double the pad the moment the tag no longer fits.
  const panel = h.element("SidePanel", attributes, 0, BODY_SOURCE);
  const root = h.element(
    "div",
    [`className=${JSON.stringify(STAGE_CLASS)}`],
    0,
    ["<PageContent />", panel].join("\n"),
  );

  /*
   * The host's own state, printed where hooks belong — inside the component. A
   * `useState` hoisted to module scope would be a snippet that does not compile,
   * and a printed `onClose` writing to a setter nobody declared is worse.
   */
  const hostState: string[] = [];
  if (needsHostState(state)) {
    hostState.push(`const [open, setOpen] = useState(${state.open === true});`);
    if (flag(state, "collapseReport") && collapseChoice(state) !== "self") {
      hostState.push(
        `const [collapsed, setCollapsed] = useState(${collapseChoice(state) === "collapsed"});`,
      );
    }
  }
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const snippet = h.snippet({
    imports: Array.from(imports).sort((a, b) => a.localeCompare(b)),
    decls,
    body: demo,
  });

  return needsHostState(state)
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

const SidePanelPlayground: React.FC = () => {
  const playground = usePlayground(sidePanelConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={sidePanelCode}
      filename="SidePanelDemo.tsx"
      hint={<SidePanelHint />}
    />
  );
};

const SidePanelHint: React.FC = () => (
  <>
    <p>
      <strong>It is not a dialog.</strong> The shell is <C>role=&quot;group&quot;</C>{" "}
      with an <C>aria-label</C> (:800,:1015) — there is no <C>role=&quot;dialog&quot;</C>,
      no <C>aria-modal</C>, no focus trap and no focus restore, and{" "}
      <C>onKeyDown</C> is a consumer passthrough whose own comment tells you to add
      Escape yourself (:403-408,:1031). Nothing here closes on Escape: the only keys
      the component answers are the resize handle&rsquo;s arrows, Home and End
      (:809-832). A panel that must block the page is a <em>Modal</em>.
    </p>
    <p>
      <strong>Absolute, not fixed.</strong> Out of flow the shell is{" "}
      <C>absolute z-40</C> pinned to one edge (:899-904), so it needs a positioned
      ancestor — it does not escape an <C>overflow: hidden</C> parent, and{" "}
      <C>zIndex</C> only means anything in that mode. <C>docked</C> is the other
      life: <C>relative shrink-0</C>, taking a column and never getting a scrim
      (:898,:1162). <C>overlay</C> does not decide whether the panel leaves the
      flow — only whether it gets a scrim to click.
    </p>
    <p>
      <strong>Two owners, one boolean.</strong> Omit <C>collapsed</C> and the panel
      keeps its own state; pass it and the host owns it — while{" "}
      <C>onCollapsedChange</C> fires either way (:702-707), so a controlled panel
      whose host ignores the callback simply refuses to expand. <C>collapsed</C>{" "}
      without <C>collapsible</C> does nothing at all (:702), and turning{" "}
      <C>collapsible</C> on takes the close button away (:1080): a panel is either
      dismissible or foldable by the chevron, never both.
    </p>
    <p>
      <strong>The theme answers some questions.</strong> <C>corner</C> defaults to{" "}
      <C>DEFAULT_SURFACE_CORNER</C>, which is <C>rounded-md</C> — <C>&quot;auto&quot;</C>{" "}
      is a request to keep tracking the theme, not a request for square corners
      (:474,:520). <C>inset</C> is derived from the variant&rsquo;s own offset, the
      one <C>SideMenu</C> publishes, so the floating aliases arrive inset without
      being told (:506-513). And <C>surfaceTone</C> really starts at{" "}
      <C>&quot;none&quot;</C> (:467) even though its JSDoc says <C>&quot;neutral&quot;</C>{" "}
      (:336): the plain panel has no fill of its own.
    </p>
  </>
);

export { SidePanelPlayground };
export default SidePanelPlayground;

import React from "react";
import { AppDivider, Panel, Pill } from "@cjlapao/ui-kit";
import type {
  AppDividerLabelPosition,
  AppDividerOrientation,
  AppDividerVariant,
  ControlSize,
  PanelVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground";
import { usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import {
  contextChoice,
  decorativeChoice,
  defined,
  hasLabel,
  isBadgeLabel,
  isToned,
  isVertical,
  LABEL_TEXT,
  lengthChoice,
  SIDE_ITEMS,
  SIDE_TEXT,
} from "./appDividerStage";
import { appDividerConfig } from "./appDividerPlayground";

/**
 * The playground itself.
 *
 * The preview is the two call sites the component was written for — three
 * toolbar items with rules between them, or two paragraphs with a rule across —
 * so the reader sees what `orientation`, `spacing` and `length` actually move.
 * Nothing here is invented: the same `LABEL_TEXT` / `LABEL_NODE_JSX` the Code
 * view prints is what gets rendered, and the wrapper Panel exists to show the one
 * behaviour no prop list can state — an untoned rule borrows the surface's own
 * `divider` colour (:170), so switching **Sits on** to the liquid-glass card makes
 * the rule change colour without a single prop changing.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const vertical = isVertical(state);
  const tone = String(state.tone ?? "none");
  const labelled = hasLabel(state);
  const decor = decorativeChoice(state);
  const length = lengthChoice(state);
  const context = contextChoice(state);

  const divider = (
    <AppDivider
      orientation={String(state.orientation ?? "vertical") as AppDividerOrientation}
      variant={String(state.variant ?? "solid") as AppDividerVariant}
      tone={isToned(state) ? (tone as TrueColor) : undefined}
      size={String(state.size ?? "xs") as ControlSize}
      spacing={String(state.spacing ?? "sm") as "none" | ControlSize}
      length={length === "auto" ? undefined : Number(length)}
      label={
        labelled
          ? isBadgeLabel(state)
            ? (
                <Pill tone="blue" variant="soft" size="xs">
                  3 new
                </Pill>
              )
            : String(state.label ?? LABEL_TEXT)
          : undefined
      }
      labelPosition={String(
        state.labelPosition ?? "center",
      ) as AppDividerLabelPosition}
      decorative={decor === "auto" ? undefined : decor === "yes"}
      className={defined(state.className)}
    />
  );

  const sample = vertical ? (
    <div className="flex h-16 items-center text-sm">
      {SIDE_ITEMS.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 ? divider : null}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div className="w-full text-sm">
      <p>{SIDE_TEXT[0]}</p>
      {divider}
      <p>{SIDE_TEXT[1]}</p>
    </div>
  );

  return (
    <div className="w-full">
      {context === "plain" ? (
        sample
      ) : (
        <Panel
          variant={context as PanelVariant}
          tone="neutral"
          padding="md"
          corner="rounded-lg"
        >
          {sample}
        </Panel>
      )}
    </div>
  );
};

export const appDividerCode = ({ state, h }: PlaygroundCodeContext): string => {
  const imports = ["AppDivider"];
  if (isBadgeLabel(state)) imports.push("Pill");
  return h.snippet({
    imports,
    body: h.demo(h.element("AppDivider", h.props(), 0)),
  });
};

export const AppDividerPlayground: React.FC = () => {
  const playground = usePlayground(appDividerConfig);
  const { state } = playground;
  const labelled = hasLabel(state);
  const decor = decorativeChoice(state);
  const forcedVisible = !labelled && decor === "no";
  const forcedHidden = labelled && decor === "yes";
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={appDividerCode}
      filename="AppDivider.tsx"
      hint={
        <>
          This is a <code>div</code> and nothing else (:206-229): no Panel, no
          loader, no state. <code>size</code> is the line&rsquo;s thickness in
          real pixels — 1/2/3/4/6 for xs–xl (:26-32) — because Tailwind&rsquo;s
          border ladder (1→2→4→8) is too coarse for a rule, and{" "}
          <code>spacing</code> is the margin on its cross axis (:35-45) while{" "}
          <code>length</code> runs along its own axis (:182-184).
          <br />
          {labelled ? (
            decor === "auto" ? (
              <>
                <strong>Announced.</strong> A label is the semantic switch:{" "}
                <code>decorative ?? !label</code> (:130) leaves this rule with{" "}
                <code>role=&quot;separator&quot;</code> and{" "}
                <code>aria-orientation</code> (:208-209) while the painted line
                stays <code>aria-hidden</code> (:161), so it is announced once, as
                the break it names — not as a rule plus a word.
              </>
            ) : forcedHidden ? (
              <>
                <strong>Forced decoration.</strong> <code>decorative=&#123;true&#125;</code>{" "}
                hides the whole wrapper (:210): the label is still painted and the
                line still drawn, but the accessibility tree no longer knows the
                break exists. That is the right call when the words are only
                decoration and the content either side already carries the
                meaning.
              </>
            ) : (
              <>
                <strong>Forced announcement.</strong> <code>decorative=&#123;false&#125;</code>{" "}
                keeps the label&rsquo;s separator role (:208) whatever the label
                says. Here it is doing nothing the label did not already do — the
                prop matters when you want a rule hidden despite having text, or
                announced despite not having one.
              </>
            )
          ) : forcedVisible ? (
            <>
              <strong>A separator with no name.</strong>{" "}
              <code>decorative=&#123;false&#125;</code> on an unlabelled rule
              publishes <code>role=&quot;separator&quot;</code> (:208) with nothing
              to announce, so a reader hears an unnamed separator. That is the
              honest cost of forcing it: give the rule a <code>label</code>, or
              leave <code>decorative</code> on <em>Inherit</em>.
            </>
          ) : (
            <>
              <strong>Decoration.</strong> No label means{" "}
              <code>decorative ?? !label</code> (:130) resolves to hidden:{" "}
              <code>aria-hidden</code> on the wrapper (:210), no{" "}
              <code>role</code>, no <code>aria-orientation</code> (:208-210). The
              rule is paint, and a screen reader never learns it is there — which
              is what you want between two toolbar items.
            </>
          )}
          <br />
          <strong>Tone is absent, not &quot;none&quot;.</strong> With no tone the
          rule borrows <code>surface.divider</code> from the surface context (:170), so
          switch <em>Sits on</em> to the liquid-glass card and the rule changes
          colour on its own. A tone routes to{" "}
          <code>getAppDividerToneTokens</code> (<code>common/theme/Theme.ts:1480</code>)
          instead — and the <em>gradient</em> variant consults neither: it paints a{" "}
          <code>linear-gradient</code> out of <code>var(--color-&#123;tone&#125;-400)</code>{" "}
          (:148-150), so an untoned gradient fades through neutral-400 whether or
          not the surface says otherwise.
        </>
      }
    />
  );
};

export default AppDividerPlayground;

import React from "react";
import { CustomIcon } from "@cjlapao/ui-kit";
import type { IconName, IconSize, TrueColor } from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import {
  customIconConfig,
  sizeStory,
  snippetDecls,
  stageCaption,
} from "./customIconPlayground";
import {
  SIZE_DEFAULT,
  STAGE_CLASS,
  customSizeValue,
  flag,
  hasAlt,
  hasClassName,
  hasColor,
  hasHoverColor,
  hasTone,
  iconName,
  isClickable,
  isColored,
  textValue,
} from "./customIconStage";

/**
 * The engine-driven playground for one `CustomIcon`. The tag the Code view prints
 * and the tag that paints come from the same config, so the only difference
 * between the two panes is that one of them is alive.
 */

/**
 * A knob left at the component's own default is not passed at all: the destructured
 * default (:62-77) has to earn its keep in front of the reader.
 */
const atDefault = <T extends string | number>(
  state: PlaygroundState,
  id: string,
  documented: T,
): T | undefined => {
  const raw = state[id];
  if (typeof raw !== "string" && typeof raw !== "number") return undefined;
  return String(raw) === String(documented) ? undefined : (raw as unknown as T);
};

/** The same question for a boolean, whose kit default is `false` (:70-73). */
const on = (state: PlaygroundState, id: string): true | undefined =>
  flag(state, id) ? true : undefined;

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const clickable = isClickable(state);
  // A span and a button are different elements (:146-171) and React would happily
  // reuse the DOM node across the switch — so the tag is remounted whenever the
  // mode changes, and with it the evidence of the last press.
  const mount = `${clickable ? "button" : "span"}:${
    flag(state, "disabled") ? "off" : "on"
  }`;

  const icon = (
    <CustomIcon
      key={mount}
      icon={iconName(state) as IconName}
      alt={hasAlt(state) ? textValue(state, "alt") : undefined}
      size={atDefault<IconSize>(state, "size", SIZE_DEFAULT)}
      customSize={customSizeValue(state)}
      tone={hasTone(state) ? (textValue(state, "tone") as TrueColor) : undefined}
      color={hasColor(state) ? textValue(state, "color") : undefined}
      hoverColor={
        hasHoverColor(state) ? textValue(state, "hoverColor") : undefined
      }
      colored={on(state, "colored")}
      spin={on(state, "spin")}
      disabled={on(state, "disabled")}
      className={hasClassName(state) ? textValue(state, "className") : undefined}
      onClick={clickable ? () => set("press", "pressed") : undefined}
    />
  );

  return (
    <div className={STAGE_CLASS}>
      <div className="flex min-h-16 flex-wrap items-center gap-3">
        {icon}
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {stageCaption(state)}
        </span>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {sizeStory(state)}
      </p>
      {isColored(state) ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          <C>colored</C> is on, so <C>tone</C>, <C>color</C> and <C>hoverColor</C>{" "}
          are inert — the glyph keeps its own paint (:35,:92-101,:109).
        </p>
      ) : null}
    </div>
  );
};

export const customIconCode = ({ state, h }: PlaygroundCodeContext): string => {
  const root = h.element("CustomIcon", [...h.props()], 1);
  const decls = snippetDecls(state);
  const demo = [
    ...decls,
    ...(decls.length ? [""] : []),
    "export default function Demo() {",
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ];
  return h.snippet({
    imports: ["CustomIcon"],
    decls: [],
    body: demo.join("\n"),
  });
};

/** What the stage is actually showing, in the reader's own language. */
const CustomIconHint: React.FC<{ state: PlaygroundState }> = ({ state }) => (
  <>
    <p>
      <strong>
        <C>alt</C> is the icon&rsquo;s whole accessibility contract.
      </strong>{" "}
      Leave it out and the wrapper is <C>aria-hidden</C> — the icon is decoration,
      which is right beside a label and wrong standing on its own (:125-128). Type
      one and the wrapper becomes <C>role=&quot;img&quot;</C> carrying it as{" "}
      <C>aria-label</C> (:126-128). Either way the glyph <em>inside</em> stays{" "}
      <C>aria-hidden</C> and <C>focusable=&quot;false&quot;</C>, because an inline
      SVG can otherwise join the tab order and hand a keyboard user a stop with no
      name (:131).
    </p>
    <p>
      <strong>
        <C>onClick</C> changes the element, not just the cursor.
      </strong>{" "}
      With it the component returns a real{" "}
      <C>&lt;button type=&quot;button&quot;&gt;</C> (:146-164); without it, a{" "}
      <C>&lt;span&gt;</C> (:167-171). The earlier shape put a click handler on a
      span — identical pixels, unreachable by keyboard. The focus ring is{" "}
      <C>focus-visible:ring-current</C>: the ring takes whatever tint the icon
      already carries, so it survives an arbitrary <C>color</C> (:154). Flip the
      switch and watch the element change under the preview.
    </p>
    <p>
      <strong>Three colour props, two of which are not what they look like.</strong>{" "}
      <C>color</C> here is <em>not</em> the <C>tone</C> alias other controls carry:
      it is a raw CSS string that goes straight into inline style and beats{" "}
      <C>tone</C>, which is only ever a <C>text-{`{tone}`}-500</C> class
      (:31,:97,:109). <C>hoverColor</C> cannot be an inline style at all — an inline
      style cannot express <C>:hover</C> — so it travels as the{" "}
      <C>--icon-hover-color</C> custom property and a stylesheet rule —{" "}
      <C>.custom-icon:hover {`{ color: var(--icon-hover-color) }`}</C> — consumes it;
      that class appears only when a hover colour was actually asked for
      (:33,:98-100,:119, rule at <C>styles.css:394-396</C>). <C>colored</C> switches all three off so a multicolour
      glyph keeps its paint (:35,:92-101).{" "}
      {isColored(state)
        ? "Which is what is happening right now."
        : "Try it with a tone set and watch nothing change."}
    </p>
    <p>
      <strong>Sizing has three masters, and only one of them prints a class.</strong>{" "}
      <C>customSize</C> wins and lands in inline style — a bare number is a pixel
      count, anything else is used verbatim as the CSS length (:81-91). With no{" "}
      <C>customSize</C> the component adds a rung of <C>SIZE_CLASS_MAP</C> (<C>md</C>{" "}
      is <C>h-6 w-6</C>, 24px) — but <em>only</em> if your own <C>className</C> does
      not already carry a width or height token (:51-57,:105-106). Type{" "}
      <C>h-10 w-10</C> above and the size knob keeps its label while quietly doing
      nothing; <C>mergeClassTokens</C> then drops the losing tokens instead of letting
      both classes fight (:113-123).
    </p>
    <p>
      <strong>The fallback is a placeholder that keeps its shape.</strong> An
      unresolvable name renders a monogram square carrying the name&rsquo;s first
      letter, inside the same sized wrapper — the old fallback dropped every computed
      class, so a missing icon had no size at all and collapsed the layout around it
      (:130-139). Once per name, in development, the console says{" "}
      <C>Icon not found in registry</C> (:59-60,:141-144). Choose <C>Unicorn</C>{" "}
      above to see both halves of that.
    </p>
    <p>
      <strong>Two things the props list does not tell you.</strong>{" "}
      <C>spin</C> is <C>animate-spin</C> plus <C>motion-reduce:animate-none</C>, so a
      reader who asked the system for less motion gets a still icon (:37,:120). And{" "}
      <C>forceSvg</C> is accepted, typed and <em>never read</em>: it is not in the
      destructuring, so it falls through <C>...rest</C> onto the DOM (:76,:160,:168) —
      the registry has been component-based only since the icons were rebuilt
      (:47-48). Prefer passing a component directly or calling <C>registerIcons</C>;
      late registrations repaint already-mounted icons, because the component
      subscribes to the registry with <C>useSyncExternalStore</C> (:78).
    </p>
  </>
);

export const CustomIconPlayground: React.FC = () => {
  const playground = usePlayground(customIconConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={customIconCode}
      filename="CustomIconDemo.tsx"
      hint={<CustomIconHint state={playground.state} />}
    />
  );
};

export default CustomIconPlayground;

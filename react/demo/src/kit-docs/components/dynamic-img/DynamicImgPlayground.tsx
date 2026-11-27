import React from "react";
import { DynamicImg, Panel } from "@cjlapao/ui-kit";
import type { DynamicImgSize, TrueColor } from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import { C } from "../../shared/A11ySections";
import type {
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  dynamicImgCode,
  dynamicImgConfig,
  sizeStory,
} from "./dynamicImgPlayground";
import {
  STAGE_CLASS,
  a11yCaption,
  altText,
  droppedCaption,
  fallbackIconValue,
  fillText,
  isColored,
  kindCaption,
  recolourCaption,
  sanitizedMarkup,
  sanitizerReport,
  sizeValue,
  sourceKind,
  sourceValue,
  strokeText,
  titleText,
  toneName,
} from "./dynamicImgStage";

/**
 * The engine-driven playground for Dynamic Image. The subject is a string the app
 * did not author, so the preview does more than render the component: it renders
 * it, then shows what the parser made of the value, what the allowlist removed and
 * what the recolouring did to the colours. Every one of those claims comes from the
 * kit&rsquo;s own `parseImageSource` and `sanitizeSvg` — the same calls the component
 * makes (:71-81) — so the captions and the DOM cannot drift apart.
 */

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
    {children}
  </p>
);

/** A source shown exactly as it arrived, or exactly as the page received it back. */
const Verbatim: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex w-full min-w-0 flex-col gap-1">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {label}
    </span>
    <pre className="max-h-28 w-full overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-2 font-mono text-[10px] text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
      {value === "" ? "(nothing)" : value}
    </pre>
  </div>
);

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const raw = sourceValue(state);
  const injected = sanitizedMarkup(state);
  const kind = sourceKind(state);
  const report = sanitizerReport(state);
  const cut = report.dropped.length + report.droppedAttributes.length;

  return (
    <div className={STAGE_CLASS}>
      <Panel
        variant={state.glass === true ? "glass" : "elevated"}
        padding="md"
        className="w-full"
      >
        <DynamicImg
          src={raw || undefined}
          alt={altText(state) || undefined}
          title={titleText(state) || undefined}
          size={sizeValue(state) as DynamicImgSize}
          tone={(toneName(state) || undefined) as TrueColor | undefined}
          fill={fillText(state) || undefined}
          stroke={strokeText(state) || undefined}
          colored={isColored(state)}
          fallbackIcon={fallbackIconValue(state)}
        />
      </Panel>

      <Caption>{kindCaption(state)}</Caption>
      {droppedCaption(state) ? <Caption>{droppedCaption(state)}</Caption> : null}
      <Caption>{recolourCaption(state)}</Caption>
      <Caption>{a11yCaption(state)}</Caption>
      <Caption>{sizeStory(state)}</Caption>
      {kind === "svg" && cut > 0 ? (
        <Caption>
          What reached the page is not what was handed in: {report.kept.length} element
          name{report.kept.length === 1 ? "" : "s"} survived, and the markup below is
          what the component injected — compare it with the DOM in dev tools.
        </Caption>
      ) : null}

      <Verbatim label="Handed in" value={raw} />
      {kind === "svg" ? (
        <Verbatim label="Injected after the allowlist" value={injected ?? ""} />
      ) : null}
    </div>
  );
};

export const DynamicImgHint: React.FC<{ state: PlaygroundState }> = ({ state }) => (
  <>
    <p>
      <C>src</C> is the whole job: a data URL, or raw <C>&lt;svg&gt;</C> markup
      (:20-23). <C>parseImageSource</C> decides which one it is — raw markup is
      anything starting <C>&lt;svg</C> or <C>&lt;?xml</C>, and everything else has to
      look like a data URL or it is not an image at all
      (<C>common/utils/sanitizeSvg.ts</C> :281-290).
    </p>
    <p>
      Only SVG goes through the sanitizer, and it goes through it every time
      (:71-81). What comes back is a <em>rebuilt</em> document, not a filtered copy:
      the allowlist names what may exist (:17-42,:56-140) and anything else is
      discarded, which is why a hostile element vanishes instead of surviving with its
      attributes shaved.
    </p>
    <p>
      Recolouring happens on the way in, not on the way out: <C>fill</C> and{" "}
      <C>stroke</C> replace every paint that is not <C>none</C> — and only on shapes
      that already declare the attribute, so an inheriting shape keeps inheriting
      (:212-218). Gradient stops are never touched (:208-210), and <C>colored</C>{" "}
      skips the whole pass so the drawing keeps its own palette (:77-78).
    </p>
    <p>
      <C>tone</C> is a class on the wrapper, not a colour on the shapes, so it only
      reaches the drawing through <C>currentColor</C> — and the component refuses to
      print the tone class at all once a raw <C>fill</C> or <C>colored</C> has decided
      the colour for it (:67,:111-120). There is no inline <C>color</C> anywhere, which
      is deliberate: a second <C>color</C> at the same specificity loses to whichever
      Tailwind utility was emitted last (:111-114).
    </p>
    <p>
      With no <C>alt</C> there is no name, and no name means decoration:{" "}
      <C>aria-hidden</C> on whichever element rendered (:83,:97,:123-125). The old
      component hardcoded <C>alt=&quot;Dynamic Image&quot;</C> onto every raster, which
      is what a list of rows sounds like to a reader (:26-31).
    </p>
    <p>
      Nothing to render, or markup the sanitizer threw away entirely, is the same
      answer: <C>fallbackIcon</C> goes to the app&rsquo;s icon renderer and comes back
      as a quiet placeholder (:85-88,:63).
    </p>
    {sourceKind(state) === "rejected" ? (
      <p>
        Right now that is what is happening: {fallbackIconValue(state)} is painting, and
        the value you handed in is not in the DOM at all.
      </p>
    ) : null}
  </>
);

export const DynamicImgPlayground: React.FC = () => {
  const playground = usePlayground(dynamicImgConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={dynamicImgCode}
      filename="DynamicImgDemo.tsx"
      hint={<DynamicImgHint state={playground.state} />}
    />
  );
};

export default DynamicImgPlayground;

import React, { useEffect, useState } from "react";
import { CustomIcon, registerIcons } from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import {
  iconsRegistryConfig,
  registryDecls,
  sizeStory,
  stageCaption,
  usedGlyphComponents,
} from "./iconsRegistryPlayground";
import {
  STAGE_CLASS,
  altText,
  batchGlyph,
  batchNames,
  hasAlt,
  hasTone,
  isAfterPaint,
  isOverride,
  isStacked,
  outcomeCaption,
  resolutionCaption,
  sizeValue,
  stackedGlyph,
  target,
  toneName,
  type Outcome,
} from "./iconsRegistryStage";

/**
 * The engine-driven playground for the icon registry. Unlike a component page,
 * the subject here is a module-level map: the reader decides what to register,
 * the workbench calls `registerIcons` for real, and the tag in the Code view is
 * resolved through that same map. Preview and snippet come from one config, so
 * what repaints and what prints cannot disagree.
 */

/*
  The three glyphs a consumer app might own. They take no props on purpose: this
  workspace carries two copies of `@types/react` (`react/` and `react/demo/`), and
  a props-forwarding `SVGProps<SVGSVGElement>` component will not typecheck against
  the kit's `IconComponent` — the same wall `../custom-icon/examples/ConsumerIcons.tsx`
  sits on. They pin themselves to the wrapper instead of reading `className`, which
  a real glyph must not do (customRegistry.ts:4 asks for prop forwarding); the kit's
  own tests cover that half.
 */
const Glyph = ({ shape }: { shape: string }): React.JSX.Element => {
  const body =
    shape === "Pulse" ? (
      <circle cx="12" cy="12" r="7" fill="currentColor" />
    ) : shape === "Ring" ? (
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    ) : (
      <g fill="currentColor">
        <rect x="4" y="5" width="4" height="14" />
        <rect x="10" y="5" width="4" height="14" />
        <rect x="16" y="5" width="4" height="14" />
      </g>
    );
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      data-glyph={shape}
      aria-hidden="true"
      focusable="false"
    >
      {body}
    </svg>
  );
};

const GLYPH_COMPONENTS: Record<string, () => React.JSX.Element> = {
  Pulse: () => <Glyph shape="Pulse" />,
  Ring: () => <Glyph shape="Ring" />,
  Bars: () => <Glyph shape="Bars" />,
};

/** The two calls the workbench is about to make, as plain data. */
const planOf = (state: PlaygroundState): string =>
  JSON.stringify([
    batchNames(state),
    isStacked(state) ? target(state) : null,
    isStacked(state) ? stackedGlyph(state) : null,
    isOverride(state),
    isAfterPaint(state),
  ]);

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const plan = planOf(state);
  const deferred = isAfterPaint(state);
  const [armed, setArmed] = useState(!deferred);
  const [registered, setRegistered] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome>("nothing");
  const [message, setMessage] = useState("");

  // Flipping the deferral switch re-arms the workbench either way, so the
  // preview never shows a registration the reader has just unscheduled.
  useEffect(() => {
    setArmed(!deferred);
  }, [deferred, plan]);

  useEffect(() => {
    if (!armed) {
      setRegistered([]);
      setOutcome("nothing");
      setMessage("");
      return;
    }
    const disposers: Array<() => void> = [];
    const taken: string[] = [];
    let rejection = "";
    const attempt = (
      icons: Record<string, () => React.JSX.Element>,
    ): boolean => {
      try {
        disposers.push(
          registerIcons(icons, isOverride(state) ? { override: true } : {}),
        );
        return true;
      } catch (error) {
        rejection = error instanceof Error ? error.message : String(error);
        return false;
      }
    };

    const entries: Record<string, () => React.JSX.Element> = {};
    for (const name of batchNames(state)) {
      const glyph = batchGlyph(state, name);
      if (glyph) entries[name] = GLYPH_COMPONENTS[glyph];
    }
    if (Object.keys(entries).length > 0 && attempt(entries)) {
      taken.push(...Object.keys(entries));
    }
    // A rejected batch registers nothing (:41-47), so the claim is only worth
    // attempting once the map is really in the state the reader asked for.
    if (isStacked(state) && !rejection) {
      const claimed = target(state);
      if (attempt({ [claimed]: GLYPH_COMPONENTS[stackedGlyph(state)] })) {
        taken.push(claimed);
      }
    }
    setRegistered(taken);
    setOutcome(rejection ? "rejected" : taken.length ? "registered" : "nothing");
    setMessage(rejection);
    return () => {
      // Registrations are process-global (:8-9); an undisposed one would follow
      // this page around into every other page that renders the same name.
      for (const dispose of disposers) dispose();
    };
    // `plan` is the serialised shape of every field the calls read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, armed]);

  const name = target(state);
  return (
    <div className={STAGE_CLASS}>
      <div className="flex min-h-16 flex-wrap items-center gap-3">
        <CustomIcon
          icon={name}
          alt={hasAlt(state) ? altText(state) : undefined}
          size={sizeValue(state) as "xs" | "sm" | "md" | "lg" | "xl"}
          tone={hasTone(state) ? (toneName(state) as never) : undefined}
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {stageCaption(state)}
        </span>
        {deferred && !armed ? (
          <button
            type="button"
            onClick={() => setArmed(true)}
            className="rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-500/30 focus-visible:outline-none focus-visible:ring-2 dark:text-blue-300"
          >
            Register the batch
          </button>
        ) : null}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {resolutionCaption(state, registered)}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {outcomeCaption(state, outcome, message)}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {sizeStory(state)}
      </p>
      {registered.length > 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Names this workbench is holding: {registered.join(", ")} — released when
          the preview unmounts (:55-66).
        </p>
      ) : null}
    </div>
  );
};

export const iconsRegistryCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const root = h.element("CustomIcon", [...h.props()], 1);
  const glyphs = usedGlyphComponents(state);
  const decls = [
    ...(glyphs.length
      ? [`import { ${glyphs.join(", ")} } from "./glyphs";`]
      : []),
    ...registryDecls(state),
  ];
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
    imports: ["CustomIcon", "registerIcons"],
    decls: [],
    body: demo.join("\n"),
  });
};

/** What the stage is actually showing, in the reader's own language. */
const IconsRegistryHint: React.FC<{ state: PlaygroundState }> = ({ state }) => (
  <>
    <p>
      <strong>The registry is generated, and the directory is the truth.</strong>{" "}
      <C>registry.ts</C> is one long list of <C>Name: Name</C> pairs that a script
      writes from <C>src/icons/components/*.tsx</C> (:246-249,{" "}
      <C>scripts/generate-icon-registry.mjs</C>), and the name that matters is the
      file&rsquo;s own <C>export const</C>, not its filename (generator :21-33). Drop
      a component in and forget to run the generator and this gallery still shows it —
      it reads the directory through <C>import.meta.glob</C> (<C>generatedIcons.ts</C>{" "}
      :11-14) — while <C>CustomIcon</C> cannot resolve it. That gap is what the vitest
      drift guard exists for: it fails the suite with the exact command to run
      (<C>icons/icons.test.ts:95-115</C>).
    </p>
    <p>
      <strong>
        <C>IconName</C> will not catch a typo.
      </strong>{" "}
      The union ends with <C>| (string &amp; &#123;&#125;)</C> (registry.ts:495) so any
      string type-checks — deliberately, so consumer registrations can be passed
      without widening. The cost is that <C>icon=&quot;CLose&quot;</C> compiles,
      renders a monogram and says nothing. The one signal is a development{" "}
      <C>console.warn</C> fired <em>once per name per process</em>
      (CustomIcon.tsx:59-60,:141-144): the workbench cannot show it twice, and neither
      can your app.
    </p>
    <p>
      <strong>One call, whole batch, all or nothing.</strong>{" "}
      <C>registerIcons</C> walks the entire record before it writes a single entry, so
      a batch with one bad name registers nothing at all (:41-47); an empty{" "}
      <C>&#123;&#125;</C> is legal and notifies nobody (:53). &ldquo;Already
      registered&rdquo; means the custom map <em>or</em> the generated one (:44), so a
      built-in name is a collision too, and <C>&#123; override: true &#125;</C> is
      per-call rather than per-entry (:38). Switch on <em>Claim the target name
      too</em> with <C>Star</C> selected to watch the rejection; the preview keeps the
      glyph that was there before, because the failed call changed nothing.
    </p>
    <p>
      <strong>The last call wins, and cleanup is a stack.</strong> Each name holds an{" "}
      <em>array</em> of registrations and resolution takes the newest
      (:8,:26,:50); a cleanup filters out <em>its own</em> entry and only deletes the
      key when the array empties, so unregistering reveals the glyph underneath
      (:55-66). That is why the returned function must be kept: registrations live in
      a module-level map, one per process, shared by every React root (:8-9) — and this
      preview releases its own the moment it unmounts.
    </p>
    <p>
      <strong>Register before the first render, including on the server.</strong>{" "}
      The docstring says so outright (:31-33). If a batch does land late, mounted
      icons still repaint, because <C>CustomIcon</C> subscribes to the map with{" "}
      <C>useSyncExternalStore</C> (CustomIcon.tsx:78, notify :12-15) — switch on{" "}
      <em>Register after first paint</em> and press the button to see the monogram turn
      into the glyph. The server snapshot is the constant <C>() =&gt; 0</C>
      (customRegistry.ts:22), so hydration never claims registrations it has not made;
      that is a stable first paint, not a statement that custom icons do not work in
      SSR.
    </p>
    <p>
      <strong>Only four names are public.</strong> The barrel re-exports{" "}
      <C>IconName</C>, <C>iconRegistry</C>, <C>registerIcons</C> and{" "}
      <C>IconComponent</C> (index.ts:39-42). <C>resolveIcon</C>,{" "}
      <C>subscribeIcons</C> and the revision getters are internal despite being{" "}
      <C>export</C>ed from their module — nothing in the kit&rsquo;s public surface
      hands you the map, so the honest way to ask &ldquo;what does this name
      resolve to?&rdquo; is to render it and look at the preview.{" "}
      <C>renderIcon</C> (utils/renderIcon.tsx:6-29) is public and is what{" "}
      <C>IconProvider</C> defaults to, but it is the loose one: an element input skips
      the registry, the size ladder and every accessibility attribute entirely.
    </p>
    {isStacked(state) && !isOverride(state) ? (
      <p>
        Right now the claim call is being <em>refused</em>: {target(state)} belongs to{" "}
        {isOverride(state) ? "" : "somebody else"} and{" "}
        <C>&#123; override: true &#125;</C> is off. That is the registry protecting a
        name rather than silently replacing it.
      </p>
    ) : null}
  </>
);

export const IconsPlayground: React.FC = () => {
  const playground = usePlayground(iconsRegistryConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={iconsRegistryCode}
      filename="IconsDemo.tsx"
      hint={<IconsRegistryHint state={playground.state} />}
    />
  );
};

export default IconsPlayground;

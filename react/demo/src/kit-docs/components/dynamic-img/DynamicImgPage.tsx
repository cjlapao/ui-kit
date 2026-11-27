import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type KeyboardBinding,
  type PropDoc,
} from "../../shared/A11ySections";
import { DynamicImgPlayground } from "./DynamicImgPlayground";
import SanitisedSources from "./examples/SanitisedSources";
import sanitisedSourcesCode from "./examples/SanitisedSources.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Recolouring from "./examples/Recolouring";
import recolouringCode from "./examples/Recolouring.tsx?raw";
import Accessibility from "./examples/Accessibility";
import accessibilityCode from "./examples/Accessibility.tsx?raw";

/**
 * Every row here is a line in `DynamicImg.tsx` or in the sanitizer it calls.
 * The last one is the spread: the component takes `HTMLAttributes<HTMLElement>`
 * apart from `color` and `children` (:17-18) and hands the remainder to whatever
 * element it renders (:103,:129), which is the honest way to say &ldquo;a caller
 * can attach anything&rdquo; without pretending each of those is a designed prop.
 */
export const DYNAMIC_IMG_PROPS: PropDoc[] = [
  {
    name: "src",
    type: "string",
    description:
      "A `data:image/…` URL (SVG, PNG, JPEG, GIF, WebP, AVIF, BMP — sanitizeSvg.ts:263) or raw `<svg>` markup (:20-23). Anything else is not an image, and the fallback paints instead of it (:85-88).",
  },
  {
    name: "base64",
    type: "string",
    description:
      'Deprecated alias of `src` (:24-25). The two are read as `src ?? base64 ?? ""`, so `src` wins when both are passed (:64).',
  },
  {
    name: "alt",
    type: "string",
    description:
      'Accessible name, and the only switch for decoration: omit it and the element is `aria-hidden` (:26-31,:83,:97,:125); supply it and the SVG branch becomes `role="img"` carrying it as `aria-label` (:123-124), while the raster branch hands it to the <img> as its own `alt` (:96).',
  },
  {
    name: "fallbackIcon",
    type: "string",
    default: '"Image"',
    description:
      "Icon name for the placeholder when there is nothing to render or the sanitizer returned null (:32-33,:52,:85-88). It goes to the app's icon renderer, so an `IconProvider` decides what it looks like (:63,:87).",
  },
  {
    name: "size",
    type: "DynamicImgSize",
    default: '"md"',
    description:
      "`ControlSize` — xs/sm/md/lg/xl, which here means 12/16/24/32/40px from `SIZE_CLASSES` (:9-15,:34-35,:53,:66). Both branches apply it; the raster one used to render at natural dimensions (:99-101).",
  },
  {
    name: "tone",
    type: "TrueColor",
    description:
      "Theme tint, applied as `text-{tone}-500 dark:text-{tone}-400` on the wrapper so the drawing picks it up through `currentColor` (:36-37,:67,:118). Suppressed entirely when `colored` or a raw `fill` is set (:67).",
  },
  {
    name: "fill",
    type: "string",
    description:
      "Raw colour replacing every SVG `fill` that is not `none`, `currentColor` if unset (:38-39,:79). Setting it also takes the tone class away, because the colour is no longer inherited (:67).",
  },
  {
    name: "stroke",
    type: "string",
    description:
      'Same rule for `stroke` (:40-41,:79). Neither touches `fill="none"` or gradient stops, and both apply only to shapes that already declare the attribute (sanitizeSvg.ts:208-221).',
  },
  {
    name: "colored",
    type: "boolean",
    default: "false",
    description:
      "Keep the SVG's own palette: the sanitizer is handed no recolouring options at all, so nothing is rewritten (:42-43,:57,:77-78).",
  },
  {
    name: "title",
    type: "string",
    description:
      "Native tooltip, on whichever element rendered (:44,:98,:122). Not an accessible name, and with no tab stop on this element it is a hover-only affordance.",
  },
  {
    name: "className",
    type: "string",
    description:
      "Merged onto the rendered element — the `<img>` (:101) or the `<span>` (:110-120). The last argument to `classNames`, so a caller's class wins over the size ladder.",
  },
  {
    name: "…rest",
    type: "HTMLAttributes<HTMLElement>",
    description:
      "Everything else the caller passes, minus `color` and `children` (:17-18), spread onto the rendered element (:103,:129) — `style` included (:60,:102,:121). It is why a caller can wrap this in a `button` and still own the interaction.",
  },
];

/**
 * There are no bindings to list, which is the finding: the component binds no key
 * and takes no focus. What the table records is therefore what *cannot* happen —
 * including what a hostile SVG cannot do — plus the one route by which a handler
 * reaches the element at all.
 */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Nothing. Neither branch is focusable — no <C>tabIndex</C> is set on the{" "}
        <code>&lt;img&gt;</code> (:92-105) or the <code>&lt;span&gt;</code>{" "}
        (:109-130), and <C>tabindex</C> is not in the attribute allowlist, so a hostile
        SVG cannot add itself to the tab order either (sanitizeSvg.ts:56-140).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        Nothing to activate. <C>DynamicImg</C> renders media, never a control: put the
        behaviour on a surrounding <code>button</code> or <code>a</code>, named by its
        own text or <C>aria-label</C>, and leave the image as decoration.
      </>
    ),
  },
  {
    keys: ["Any key"],
    action: (
      <>
        Only if the app bound it: <C>…rest</C> hands every remaining{" "}
        <code>HTMLAttributes</code> prop to the rendered element (:103,:129), so a
        caller&rsquo;s <C>onKeyDown</C> does arrive — on an element that takes no tab
        stop, which is why the kit does not offer it as a prop. A key handler written{" "}
        <em>inside</em> the SVG never gets that far: every <C>on*</C> attribute is
        dropped before any other rule runs (sanitizeSvg.ts:179-182).
      </>
    ),
  },
  {
    keys: ["Hover"],
    action: (
      <>
        The only pointer affordance there is: <C>title</C> becomes a native tooltip on
        both branches (:98,:122). Because the element takes no focus, it never appears
        for a keyboard reader — so it cannot carry anything a user needs.
      </>
    ),
  },
];

const RENDERED_CODE = `// Named: the SVG branch becomes a role="img" span that carries the name.
<DynamicImg src={BILLING_SVG} alt="Billing logo" tone="sky" />
// → <span class="inline-flex … h-6 w-6 text-sky-500 dark:text-sky-400"
//          role="img" aria-label="Billing logo"
//          dangerouslySetInnerHTML={{ __html: sanitised }} />

// Decoration: no name, so no announcement at all.
<DynamicImg src={BLOB_SVG} />
// → <span class="…" aria-hidden="true" dangerouslySetInnerHTML={…} />

// A raster is never wrapped — it is an <img> with the ladder on it.
<DynamicImg src={PNG_DATA_URL} alt="Invoice" size="lg" />
// → <img src={PNG_DATA_URL} alt="Invoice" class="object-contain h-8 w-8" />`;

export const DynamicImgPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dynamic Image"
      description="Renders a data URL or raw SVG markup. SVG is rebuilt from an allowlist before it is injected, then recoloured to follow the theme; rasters land in an inert img and anything that is not an image at all falls back to an icon."
    />
    <DynamicImgPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Sanitised sources"
        description="Seven sources at once: the fill and gradient follow the tone, the outline keeps its strokes, the raster renders in an inert img, the hostile SVG is stripped down to its safe path, and the non-image falls back to an icon."
        code={sanitisedSourcesCode}
        filename="SanitisedSources.tsx"
      >
        <SanitisedSources />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The same mark across the whole size scale — raster images respect it too."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Recolouring"
        description="Theme tone, raw fill, raw stroke, and colored to keep an SVG's own palette."
        code={recolouringCode}
        filename="Recolouring.tsx"
      >
        <Recolouring />
      </ExampleCard>
      <ExampleCard
        title="Accessibility"
        description="alt makes it a named image, omitting alt marks it decorative, title adds a tooltip, and rejected markup renders the fallback icon."
        code={accessibilityCode}
        filename="Accessibility.tsx"
      >
        <Accessibility />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Same contract as the rest of the kit: omit <C>alt</C> and the image is{" "}
          <em>decoration</em> — <C>aria-hidden</C> on whichever element rendered
          (:97,:125), so the <code>&lt;title&gt;</code> element the SVG carries is the
          only thing a reader may still announce, because <code>title</code> is on the
          element allowlist (sanitizeSvg.ts:23). Supply <C>alt</C> and the SVG branch
          becomes <C>role=&quot;img&quot;</C> with that name as its <C>aria-label</C>{" "}
          (:123-124), while the raster branch stays a plain named{" "}
          <code>&lt;img&gt;</code> (:96). The earlier shape hardcoded{" "}
          <C>alt=&quot;Dynamic Image&quot;</C> onto every raster — noise on every row of
          a list, with no way to opt out (:26-31,:94-95).
        </p>
        <p>
          The <C>fallbackIcon</C> placeholder is decoration by construction: rejected
          data should go quiet, not announce itself on every row — the app&rsquo;s own
          empty-state text is the place to say &ldquo;image unavailable&rdquo;. The
          placeholder is whatever the app&rsquo;s icon renderer returns for that name
          (:63,:87), so it inherits the same <C>aria-hidden</C> treatment the kit&rsquo;s
          own icons get.
        </p>
        <A11yCode code={RENDERED_CODE} filename="what-reaches-the-dom.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          Nothing to tab to — by design, and worth stating as a finding rather than a
          footnote. What follows is every route a key press could take through this
          component, including the ones an attacker would prefer.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          No strings of its own: <C>alt</C>, <C>title</C> and <C>fallbackIcon</C> are all
          caller values, rendered verbatim (:87,:96,:98,:122,:124) — nothing is composed,
          concatenated or pluralised, so <C>alt</C> is localised like any other label and
          the component needs no translation key. <C>fallbackIcon</C> is an icon{" "}
          <em>name</em>, not a word: it is resolved by the app&rsquo;s renderer (:63,:87),
          which is also the extension point if an empty state needs to speak the page
          language.
        </p>
        <p>
          One language-adjacent caution about the SVG itself: <code>text</code>,{" "}
          <code>tspan</code> and <code>textPath</code> are on the element allowlist
          (sanitizeSvg.ts:39-41) along with <C>font-family</C>, <C>writing-mode</C> and{" "}
          <C>letter-spacing</C> (:129-139), so words baked into a supplier&rsquo;s drawing
          survive sanitising exactly as they arrived — they are not extractable,{" "}
          <em>will not reflow</em>, and the attribute allowlist carries no{" "}
          <C>lang</C> or <C>xml:lang</C> for a reader to be told which language they are
          in. Treat such an SVG as artwork; if it carries meaningful words, pass{" "}
          <C>alt</C> in the page language instead.
        </p>
      </A11yTopic>

      <A11yTopic title="Sanitising is the security feature">
        <p>
          A &ldquo;dynamic image&rdquo; is by definition data the app did not author, and
          SVG is a scriptable format (sanitizeSvg.ts:1-14). Every SVG — data URL or raw
          markup — is rebuilt from an allowlist before it touches the DOM (:71-81):
          elements that are not geometry, paint or structure are removed outright, so{" "}
          <code>script</code>, <code>foreignObject</code>, <code>a</code>,{" "}
          <code>style</code>, <code>image</code> and the SMIL animation elements never
          reach the page (:44-53,:168-171). Every <C>on*</C> attribute goes in one rule
          before any allowlist lookup (:179-182); <C>href</C> and <C>xlink:href</C>{" "}
          survive only as same-document <code>#fragment</code> references (:143,:184-187);
          a <C>style</C> carrying <C>url()</C>, <C>expression()</C>, <C>javascript:</C> or{" "}
          <C>@import</C> is dropped whole (:146,:189-192), as is any paint attribute whose{" "}
          <C>url()</C> points outside the document (:202-205).
        </p>
        <p>
          Markup that cannot be sanitised is <em>rejected to the fallback icon</em> —
          unparseable input, a document whose root is not <C>&lt;svg&gt;</C>, or a server
          render with no <C>DOMParser</C> all return <C>null</C> (:237-259), and{" "}
          <C>null</C> means the placeholder, never the original string (:85-88). An
          allowlist fails closed: what you get is what the list permits, not what the
          source happened to avoid.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={DYNAMIC_IMG_PROPS} title="DynamicImgProps" />

    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
      The parser and the sanitizer are public on the barrel — <C>parseImageSource</C> and{" "}
      <C>sanitizeSvg</C> come out of <C>@cjlapao/ui-kit</C> via{" "}
      <C>react/src/utils/index.ts</C>:15, and the implementation lives in{" "}
      <C>common/utils/sanitizeSvg.ts</C> so the Vue port enforces the same list. Worth
      calling, if an app wants to check a supplier&rsquo;s markup before storing it: the
      component will not render what they return, and neither should a preview.
    </p>
  </div>
);

export default DynamicImgPage;

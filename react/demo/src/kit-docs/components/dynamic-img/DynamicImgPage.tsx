import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
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

export const DynamicImgPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dynamic Image"
      description="Renders a data URL or raw SVG markup. SVG is sanitised against an allowlist before it is injected, then recoloured to follow the theme."
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
          <em>decoration</em> — <C>aria-hidden</C> on both branches, so the
          sanitizer&rsquo;s <code>&lt;title&gt;</code> element inside the SVG is
          the only thing a reader may announce. Supply <C>alt</C> and the SVG
          branch becomes <C>role=&quot;img&quot;</C> with that <C>aria-label</C>
          , and the raster branch is a plain named <code>&lt;img&gt;</code>. The
          earlier shape hardcoded <C>alt=&quot;Dynamic Image&quot;</C> on every
          raster — noise on every row of a list, with no way to opt out.
        </p>
        <p>
          The <C>fallbackIcon</C> placeholder is decoration by construction:
          broken data should go quiet, not announce itself on every row — the
          app&rsquo;s own empty-state text is the right place to say
          &ldquo;image unavailable&rdquo;.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Nothing to tab to — by design. <C>DynamicImg</C> renders media, never
          a control, and sanitising drops every <code>tabindex</code> and event
          attribute, so a hostile SVG cannot inject itself into the tab order
          either. Put interactive behaviour on a surrounding <code>button</code>{" "}
          or <code>link</code>, named by its own text or aria-label; the image
          inside stays decoration.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          No strings of its own — <C>alt</C>, <C>title</C> and{" "}
          <C>fallbackIcon</C> are caller values; localize <C>alt</C> like any
          label, and keep <C>title</C> out of RTL-sensitive wording (it renders
          as a native tooltip). One language-adjacent caution: sanitised SVG can
          keep <code>&lt;text&gt;</code> nodes, so text baked into a
          supplier&rsquo;s SVG is <em>not</em> localizable and will not reflow —
          treat it as artwork, and if it carries meaningful words, pass{" "}
          <C>alt</C> in the page language.
        </p>
      </A11yTopic>

      <A11yTopic title="Sanitising is the security feature">
        <p>
          A &ldquo;dynamic image&rdquo; is by definition data the app did not
          author, and SVG is a scriptable format. Every SVG — data URL or raw
          markup — is rebuilt from an allowlist before it touches the DOM:
          non-geometry elements (<code>script</code>, <code>foreignObject</code>
          , <code>a</code>, <code>use</code> to remote targets,{" "}
          <code>image</code>) are dropped, every <code>on*</code> attribute is
          dropped before any other rule, and <C>href</C>/<C>xlink:href</C>{" "}
          survive only as same-document <code>#fragment</code> references.
          Styles carrying <code>url()</code>, <code>expression()</code> or{" "}
          <code>javascript:</code> are removed wholesale. Anything that cannot
          be sanitised is <em>rejected to the fallback icon</em> — markup is
          never rendered raw as a downgrade.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "src",
          type: "string",
          description:
            "A `data:image/...` URL (SVG, PNG, JPEG, GIF, WebP, AVIF, BMP) or raw `<svg>` markup. Anything else is not an image and renders the fallback.",
        },
        {
          name: "base64",
          type: "string",
          description:
            "Deprecated — alias of `src`, accepted at the same priority minus one.",
        },
        {
          name: "alt",
          type: "string",
          description:
            'Accessible name. Omit for decoration — the only way to opt out is to omit it; there is no `alt="` override.',
        },
        {
          name: "fallbackIcon",
          type: "string",
          default: '"Image"',
          description:
            "Icon name shown when the source is empty, unparseable, or rejected by the sanitiser.",
        },
        {
          name: "size",
          type: "DynamicImgSize",
          default: '"md"',
          description:
            "Shared control scale — `md` is 24px. Raster images respect it too (they used to render at natural dimensions).",
        },
        {
          name: "tone",
          type: "TrueColor",
          description:
            "Theme tint for a recoloured SVG. Without it, the SVG paints with `currentColor` — the surrounding text colour.",
        },
        {
          name: "fill",
          type: "string",
          description:
            "Raw fill colour, replacing every SVG `fill` that is not `none`. Defaults to `currentColor`; beats `tone`.",
        },
        {
          name: "stroke",
          type: "string",
          description:
            'Raw stroke colour, same `none` exemption. Outline-only SVGs survive because `fill="none"` is never recoloured.',
        },
        {
          name: "colored",
          type: "boolean",
          default: "false",
          description:
            "Keep the SVG's own colours — no recolouring at all. Gradient stops are never recoloured regardless.",
        },
        {
          name: "title",
          type: "string",
          description: "Native tooltip, both branches.",
        },
        {
          name: "className",
          type: "string",
          description: "Merged onto the rendered element.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Other HTML attributes spread through to the rendered element. The
      sanitiser lives in <C>common/utils/sanitizeSvg.ts</C> and is
      framework-agnostic — the Vue port enforces exactly the same allowlist.
    </p>
  </div>
);

export default DynamicImgPage;

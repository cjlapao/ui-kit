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
  type PropDoc,
} from "../../shared/A11ySections";
import { PanelPlayground } from "./PanelPlayground";
import MediaHeader from "./examples/MediaHeader";
import mediaHeaderCode from "./examples/MediaHeader.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Transparency from "./examples/Transparency";
import MediaPlacements from "./examples/MediaPlacements";
import mediaPlacementsCode from "./examples/MediaPlacements.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";
import Clickable from "./examples/Clickable";
import clickableCode from "./examples/Clickable.tsx?raw";
import Hues from "./examples/Hues";
import huesCode from "./examples/Hues.tsx?raw";
import NestedSurfaces from "./examples/NestedSurfaces";
import nestedSurfacesCode from "./examples/NestedSurfaces.tsx?raw";

export const PanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Panel"
      description="The shared container: eleven surface treatments, media in four placements, a badge, title, subtitle and description, action buttons, decorations and loaders. Its resting look is the kit's container standard — elevated, untinted, sm padding, the rounded-md token, which renders a 1rem radius (Theme.ts:1516-1528) — and most other containers in the kit start from that same scale. It also publishes two contexts: a SurfaceContext so nested copy picks the contrast its card can carry, and a NestedPanelContext so a panel inside a matching panel steps up one level."
    />
    <PanelPlayground />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A Panel is one <C>&lt;section&gt;</C> (Panel.tsx:1273). On a card that is
          only a surface, the component writes five attributes to it:{" "}
          <C>data-variant</C>, <C>data-tone</C>, <C>data-active</C>,{" "}
          <C>data-disabled</C> and <C>{'aria-busy="{loading}"'}</C>{" "}
          (:1324-1328) — <C>aria-busy</C> is written whether or not you are loading,
          so a resting card does report <C>aria-busy=&quot;false&quot;</C>. Nothing
          else: no <C>role</C>, no <C>aria-label</C>, no <C>aria-labelledby</C>. A{" "}
          <C>&lt;section&gt;</C> only becomes a <C>region</C> landmark once it has an
          accessible name, so an unnamed Panel is invisible to landmark navigation —
          name it yourself (<C>aria-label</C>, or a <C>&lt;heading&gt;</C> inside it)
          or let it stay anonymous on purpose.
        </p>
        <p>
          A card becomes a control by itself: with <C>onClick</C> and{" "}
          <C>clickable</C> not <C>false</C>, the section gets{" "}
          <C>role=&quot;button&quot;</C>, <C>tabIndex=&quot;0&quot;</C> and,{" "}
          <C>disabled</C> or not, <C>aria-disabled=&quot;true&quot;</C> (:1330-1332).
          That is the trap. A control nested inside <C>role=&quot;button&quot;</C> is
          announced as part of the button&apos;s name, not as a control — so the
          component watches your body for one and says so in the console (:805-817):
        </p>
        <A11yCode
          code={`Panel: a clickable Panel whose body contains controls is announced as a
single button named after all of its text, with those controls nested
inside it. Pass clickable={false} when the body owns the interaction, or
render the card's primary action as a real Button/Link.`}
        />
        <p>
          <C>{'clickable={false}'}</C> is the honest answer
          when the body owns the interaction: the card keeps its handler and its
          click guard and stops pretending to be a button. The check runs over the
          body only (:807), so the card&apos;s own <C>actions</C> row — the
          component&apos;s chrome, and already guarded (:778) — never trips it.
        </p>
        <p>
          Everything decorative is removed from the tree: the nested wash, the
          overlay media and its scrim, the decoration gradient and shapes, the
          untinted hover veil, the specular layers and the disabled sheet are all{" "}
          <C>aria-hidden=&quot;true&quot;</C> (:1360,1383,1395,1404,1413,1428,1442,1482),
          and the skeleton&apos;s whole wrapper is too (:586). Two things are meant to
          be found: the <C>&lt;h3&gt;</C> a string <C>title</C> becomes
          (:1080-1093) — pass a node and you bring your own heading, which is fine
          but is yours to get right — and, while loading, the{" "}
          <C>&lt;Loader&gt;</C>, which is <C>role=&quot;status&quot;</C> with{" "}
          <C>aria-live=&quot;polite&quot;</C> and announces <C>loaderTitle</C> and{" "}
          <C>loaderMessage</C> as they change. <C>actions</C> entries are real
          Buttons, with <C>aria-pressed</C> when you pass <C>pressed</C> (:1190-1199)
          — give each a label a screen reader can say, since nothing here supplies
          one.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard">
        <p>
          A plain Panel has no bindings to learn: it renders a{" "}
          <C>&lt;section&gt;</C> with no <C>tabIndex</C> and no key handler, so the
          tab ring reaches only the controls you put inside it. Pressing the card is
          something it learns from <C>onClick</C> — and only from that,{" "}
          <C>clickable</C> not being <C>false</C>, <C>disabled</C> being off, and the
          key arriving on the card itself rather than bubbling up from a field inside
          it (:786-798,1354-1357):
        </p>
        <KeyboardSupportTable
          bindings={[
            { keys: ["Tab"], action: "Reaches the card only while it is a control — tabIndex 0, or -1 once disabled (:1331). Your own tabIndex wins (:1330)." },
            { keys: ["Enter"], action: "Activates the card, but only if it is a control and the card element itself is the target: Enter typed into a nested textarea stays in that textarea (:789)." },
            { keys: ["Space"], action: "Same activation, and preventDefault so the page scrolls nowhere instead (:790-792)." },
            { keys: ["Any"], action: "Nothing. There is no onKeyDown of its own to fire on any other key — your onKeyDown replaces the component's outright (:1355)." },
          ]}
        />
        <p>
          Keyboard and pointer activation deliberately share one path: the key
          handler calls the element&apos;s own <C>click()</C> (:797), so your{" "}
          <C>onClick</C> receives the mouse event its type promises and the guard
          below runs for both. That guard is the other half of the keyboard story: a
          click that lands on a control inside the card belongs to that control —
          the card&apos;s own <C>actions</C>, a button, a link, a field,{" "}
          <C>[data-panel-no-click]</C> — and never activates the card (:775-784); and
          neither does a click that ends where it did not start, because that was a
          text selection rather than a press (:765-783, 4px of travel). So a card
          whose body is selectable text still activates cleanly under the pointer,
          and a keyboard activation is never mistaken for one.
        </p>
        <p>
          Two edges worth knowing. <C>{'clickable={true}'}</C>{" "}
          with no <C>onClick</C> hands you a <C>role=&quot;button&quot;</C> tab stop
          that does nothing (:1330-1331 read <C>isClickable</C>, :1333 reads{" "}
          <C>onClick</C>). And <C>disabled</C> alone does not remove the button: with
          no <C>onClick</C> the card is still <C>isClickable</C>, so it keeps{" "}
          <C>cursor: pointer</C> and the focus ring while refusing every click.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Panel has nothing to translate. It imports no i18n helper and writes no
          word of its own: the title, subtitle, description, badge, loader title and
          loader message are all props, and an all-English catalog contains no Panel
          key — the <C>smartgrid.*</C> and flow-editor <C>align: &quot;Align to
          grid&quot;</C> strings that match a grep for &quot;grid&quot; belong to
          other components. The loading copy travels as <C>loaderTitle</C> and{" "}
          <C>loaderMessage</C> too (:1487-1494), and the skeleton draws bars rather
          than words. With no provider in the tree nothing changes, because there is
          nothing to provide.
        </p>
        <p>
          The layout is mostly logical and follows <C>dir</C> for free: media on the
          start or end side is <C>sm:flex-row</C> versus <C>sm:flex-row-reverse</C>{" "}
          (:1244), which reorders along the inline axis. What is written physically
          and does not flip: the body&apos;s <C>pr-1</C> gutter (:1159), the
          decoration circles at <C>-right-10 -top-10</C>, <C>-left-8 -bottom-10</C>{" "}
          and <C>right-10 bottom-8</C> (:1390,1399,1411), and the spinner&apos;s{" "}
          <C>border-l-transparent</C> gap (:155). None carries meaning — decoration
          and a spinner gap — so mirroring them would be polish, not correctness.
        </p>
      </A11yTopic>

      <A11yTopic title="Motion">
        <p>
          Two motions, and both say what happens without them. A card that answers
          the pointer eases exactly one property list —{" "}
          <C>transition-colors</C>, or <C>transition-[background-color,box-shadow,transform]</C>{" "}
          when <C>hoverShadow</C> adds the lift, or <C>transition-shadow</C> when the
          lift arrives without hover tint, always <C>duration-200</C> (:1288-1296);
          one list rather than two competing utilities is deliberate, since a lost
          one would snap. The lift itself is <C>hover:shadow-xl</C> plus a 1px raise
          (:1283), and decorations fade to <C>opacity-50</C> under the pointer
          (:1381,1393,1402,1411).
        </p>
        <p>
          The attention glow is <C>.panel-pulse</C> (styles.css:344-346) running{" "}
          <C>@keyframes panel-pulse</C> (:352-373): an inset box-shadow driven by the{" "}
          <C>--panel-glow</C> the component writes from <C>pulseTone ?? activeHue</C>{" "}
          (:942-951,1320), and <C>disabled</C> cancels the pulse rather than dimming
          it — a card may still say which one is selected, but not demand attention
          (:921). Under <C>prefers-reduced-motion: reduce</C> the animation is set to{" "}
          <C>none</C> and a faint static inner glow stays (:375-387), so the
          information survives without the movement. The skeleton&apos;s shimmer and
          the loader&apos;s spin live in <C>Skeleton</C> and <C>Loader</C>.
        </p>
      </A11yTopic>
    </A11ySection>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        API
      </h2>
      <PropsTable props={PANEL_PROPS} />
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Media header card"
        description="The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions. Every slot is present, so this is also what the skeleton will be shaped from (Panel.tsx:548-637)."
        code={mediaHeaderCode}
        filename="MediaHeader.tsx"
      >
        <MediaHeader />
      </ExampleCard>
      <ExampleCard
        title="All surfaces"
        description="The eleven variants in SURFACE_VARIANTS (Theme.ts:1069-1079). Glass, liquid-glass and subtle are the three whose transparency resolves to high by default (surfaceTransparency.ts:7); the rest start opaque and only become translucent when you ask with transparency."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Background transparency"
        description={'transparency accepts none, low, medium and high, and rewrites the alpha of the variant\'s own background utilities — never its borders, shadows or decorations (surfaceTransparency.ts:20-45). Glass, liquid-glass and subtle default to high; the others default to none, and a variant with no translucent background token to rewrite — elevated among them — stays opaque whatever you pick. The glassOpacity presets bind the liquid-glass fill only (Panel.tsx:958,1012).'}
        filename="Transparency.tsx"
        code={`<Panel variant="tonal" transparency="none">Opaque by default</Panel>
<Panel variant="tonal" transparency="high">Original transparency</Panel>
<Panel variant="tonal" transparency="low">Less transparent tonal</Panel>`}
      >
        <Transparency />
      </ExampleCard>
      <ExampleCard
        title="Nested surfaces"
        description={'A simple, tonal, subtle, glass or liquid-glass panel with no tint, sitting on a parent of the same kind, takes one background step up automatically (Theme.ts:2058-2069). nestedSurface={false} keeps the original fill — and so does passing any backgroundColor, which takes over the paint (Panel.tsx:718). raisedSurface forces that first step even on a card that is not nested in a matching one, which is how a tinted card on a matching page background stays visible.'}
        code={nestedSurfacesCode}
        filename="NestedSurfaces.tsx"
      >
        <NestedSurfaces />
      </ExampleCard>
      <ExampleCard
        title="Media placements"
        description="mediaPlacement puts the media on top, on the start or end side — which reorder with the writing direction (:1244) — or paints it full-bleed behind the card with a tone gradient over it and the copy on top (:1362-1374). Overlay media is not pointer-events: none, so it does swallow clicks aimed at the card."
        code={mediaPlacementsCode}
        filename="MediaPlacements.tsx"
      >
        <MediaPlacements />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="loading is reported as aria-busy either way (:1328). The skeleton replaces the whole content row with bars shaped from the slots you actually passed (:1217-1237); spinner and progress instead drop an aria-live Loader over the copy, which stays painted (:1487-1494)."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
      <ExampleCard
        title="A clickable card"
        description={`Pass an \`onClick\` and the card becomes a real control: \`role="button"\`, a tab stop, Enter and Space, and a tone-coloured inset focus ring. A click that lands on a control inside the card — the card's own \`actions\`, a button, a link, a field — belongs to that control and never activates the card; a click that travelled more than 4px was a text selection, and is discarded for the same reason (:765-784). \`data-panel-no-click\` extends that to widgets with no semantics of their own. \`clickable={false}\` keeps the click and the guard but drops the button, which is what a card whose body owns the interaction wants.`}
        code={clickableCode}
        filename="Clickable.tsx"
      >
        <Clickable />
      </ExampleCard>
      <ExampleCard
        title="Hues of its own"
        description="`activeTone` dresses the whole selected state — the 2px inset rim and the wash under it — in a hue the card does not wear; `pulseTone` does the same for the attention glow. Left unset they agree with the card (`borderColor`, then `tone`, then the kit's blue), and the glow follows the selection, so a card that is both selected and pulsing still says one thing in one colour. The chosen card's hover asks the selection as well: put the pointer on the fifth card and the wash arrives in the hue its rim already wears, while the unchosen cards keep hovering in their own tone — the follow belongs to the state, not to the hue (:859). `hoverColor` overrules that, which is also the way back for a card that should keep hovering in its brand hue. The resting surface stays on `tone`, and `borderColor` stays the border: it is deliberately left out of the hover chain (:844-850)."
        code={huesCode}
        filename="Hues.tsx"
      >
        <Hues />
      </ExampleCard>
      <ExampleCard
        title="Liquid glass"
        description="The translucent variant over a photo-like backdrop. `specularMode` picks the highlight: `classic` is a 1px bright top edge plus a wash across the upper third, `halo` a full-bleed bloom with that same edge, `none` neither (:1431-1470). `vibrancy` and `glassOpacity` are read on this variant alone."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

/**
 * Every prop of `PanelProps` (Panel.tsx:86-350), with the default it is
 * destructured with at :645-711. Where a prop is only read under another
 * prop's value, the row says which, with the line that decides it — that is the
 * part a list of types cannot tell you, and the part the playground gates on.
 */
export const PANEL_PROPS: PropDoc[] = [
  { name: "variant", type: "PanelVariant", default: '"elevated"', description: "One of the eleven SURFACE_VARIANTS (Theme.ts:1069-1079): none, elevated, outlined, subtle, tonal, default, glass, simple, liquid-glass. Unread values fall through to elevated's classes (:1025-1038)." },
  { name: "tone", type: "SurfaceTone", default: '"none"', description: "The card's hue: 17 TrueColors or none. Drives the fill, heading, badge, hover, loader colour and the focus ring (:719). Read only when the deprecated color is absent (:494-498)." },
  { name: "color", type: "TrueColor", default: "undefined", description: "Deprecated alias of tone — and it wins over tone when both are passed (:497). Renders a deprecation warning in development (:499-501)." },
  { name: "transparency", type: "SurfaceTransparency", default: "per variant", description: "none | low | medium | high. Absent resolves to high for glass, liquid-glass and subtle, none for every other variant (surfaceTransparency.ts:7). Rewrites background alpha only; a variant whose fill carries no bg-* token — elevated, none, outlined, glass, default — is unchanged by it (:26)." },
  { name: "corner", type: "PanelCorner", default: "DEFAULT_SURFACE_CORNER", description: '"rounded-md", which renders rounded-2xl — a 1rem radius (Theme.ts:1516-1532). "auto" re-resolves to the same value; the names are one step behind the utilities they produce."' },
  { name: "padding", type: "PanelPadding", default: '"sm"', description: "none | xxs | xs | sm | md | lg (Theme.ts:1709,1859). Resolves to sm when given a value the table does not have (:1861-1863). none also drops the body's space-y-3 and pr-1 (:1139,1159)." },
  { name: "title", type: "ReactNode", description: "A string is wrapped in an h3 (:1080-1093); a node is rendered verbatim, headings included." },
  { name: "subtitle", type: "ReactNode", description: "A string becomes p.text-base (:1095-1108)." },
  { name: "description", type: "ReactNode", description: "A string becomes p.text-sm in the surface's muted tone (:1110-1123)." },
  { name: "badge", type: "ReactNode", description: "A string is wrapped in the pill span (:1064-1078); white-on-tone on an overlay card (:1069-1070)." },
  { name: "titleClassName / subtitleClassName / descriptionClassName", type: "string", description: "Appended with clsx (:1086,1101,1116) — concatenated, not merged, so a later text-lg and the component's text-xl both survive and the stylesheet decides." },
  { name: "media", type: "ReactNode", description: "Inert unless mediaPlacement finds a place for it (:1205-1215,1362). Overlay mode needs a sized child — h-full w-full (:1364-1366) — and gives it no pointer-events: none, so it swallows clicks aimed at the card." },
  { name: "mediaPlacement", type: "PanelMediaPlacement", default: '"top"', description: "top | start | end | overlay. overlay additionally forces white text (:1053-1063) and suppresses decoration (:927-930); it is also the only placement whose media ignores the skeleton (:1222)." },
  { name: "actions", type: "PanelAction[]", description: "Rendered as Buttons in a wrapper marked data-panel-actions (:1166-1203): each entry is ButtonProps plus id, label, pressed and className; color defaults to neutral and size to md (:1192-1193). pressed is passed through as aria-pressed, including false (:1194). Their clicks never activate the card (:775-784)." },
  { name: "actionLayout", type: "PanelActionLayout", default: '"auto"', description: "auto is row-with-wrap and w-full sm:w-auto per button, but full-width alone when there are two (Theme.ts:502-512) — 203 lines later, inside the same function, :799 reads the count too." },
  { name: "children", type: "ReactNode", description: "The body, in a div carrying bodyClassName and bodyStyle (:1135-1151), inside the scroll container (:1153-1164). Replaced entirely by the skeleton while loading (:1234-1237)." },
  { name: "bodyClassName / bodyStyle", type: "string / CSSProperties", description: "On the body div — not the section (:1145,1147). clsx again: width, padding and border utilities will collide with the component's own." },
  { name: "loading", type: "boolean", default: "false", description: "Writes aria-busy either way (:1328) and switches the content for the skeleton (:1217) or the Loader overlay (:1487-1494)." },
  { name: "loaderType", type: 'PanelLoaderType', default: '"skeleton"', description: "spinner | progress | skeleton. Read only while loading (:1217,1487); an unknown string still renders a Loader (:1489)." },
  { name: "loaderTitle / loaderMessage", type: "ReactNode", description: "The Loader's title and label (:1491-1492). Ignored by the skeleton (:1219-1231), which draws bars instead." },
  { name: "loaderProgress", type: "number", description: "Only the progress variant reads it, and the Meter clamps it to 0-100 (Loader.tsx:194)." },
  { name: "loaderColor", type: "LoaderProps['color']", description: "spinner and progress only; the skeleton uses the tone's skeleton colour (:111)." },
  { name: "skeletonLines", type: "number", default: "3", description: "Body bars in the skeleton, last one 60% wide (:607-617). 0 removes them but keeps the header bars, which is a different thing from an empty body." },
  { name: "hoverShadow", type: "boolean", default: "false", description: "hover:shadow-xl and a 1px raise (:1283) — inside the hoverable condition, so hoverable={false} means no lift (:1283,1288)." },
  { name: "hoverable", type: "boolean", default: "undefined → Boolean(onClick)", description: "The tint and the rim, not the activation: the wash, the rim, the neutral veil and the group cursor, all gated on isHoverable && !disabled (:1046,1297,1301,1311,1421)." },
  { name: "clickable", type: "boolean", default: "undefined → Boolean(onClick)", description: "The activation: role=button, tabIndex, the focus ring, the pressed step and the Enter/Space path (:1306,1330-1331,1354). Independent of hoverable — either can be switched off alone (:727-731). true without onClick gives you the button and the tab stop with nothing behind them." },
  { name: "disabled", type: "boolean", default: "false", description: "Cancels the hover, the rim, the veil and the pulse, sets cursor-not-allowed, and stops the click reaching you (:1333). It does not by itself remove role=button — isClickable does not read it (:731,1330)." },
  { name: "disabledVeil", type: "boolean", default: "true", description: "The white/neutral-900 sheet over the body while disabled, aria-hidden (:1479-1484). false brings your own dimming — but disabled already dims the card itself (:111), so the two stack." },
  { name: "active", type: "boolean", default: "false", description: "The selection: a 2px inset outline rim in activeHue plus the variant's own fill slot (:891-914,1315). The rim is not a hover answer — a selected card wears it while disabled too (:1312-1315)." },
  { name: "activeTone", type: "TrueColor", default: "undefined", description: "The hue the selection wears. Unset: borderColor, then tone, then blue (:891-894). Read even when the card is unselected, but only by the hover chain, and only while active (:859)." },
  { name: "pulse", type: "boolean", default: "false", description: "The attention glow, .panel-pulse (:1320) — cancelled outright by disabled rather than dimmed (:921)." },
  { name: "pulseTone", type: "TrueColor", default: "undefined", description: "Unset, the glow wears the selection's hue so a selected-and-pulsing card says one thing (:922); set, it is your licence to disagree." },
  { name: "hoverColor", type: "TrueColor", default: "undefined", description: "Pins the hover wash and rim to a hue, outranking both the selection's hue and the tone (:857-861)." },
  { name: "borderColor", type: "TrueColor", default: "undefined", description: "The resting edge: the variant's border colour class, keeping whatever width the variant has (:865-868,973,979,986,1003,1013,1021,1035). Feeds the selection hue but deliberately not the hover (:844-850)." },
  { name: "backgroundColor", type: "TrueColor", default: "undefined", description: "The variant's fill slot in that hue — glassBg for glass, liquidBg for liquid-glass, tonalBg for tonal/simple, subtleBg otherwise (:874-886) — and neutral resolves to plain white/neutral-900 (:876). It outranks the selection fill (:898-903) and turns off the nested depth step (:718)." },
  { name: "nestedSurface", type: "boolean", default: "true", description: "False keeps the original fill inside a matching parent panel (:718, Theme.ts:2058-2069). The ladder walks up ancestors of the same variant+tone (:2087-2097) and caps at five steps; any backgroundColor does the same thing without asking." },
  { name: "raisedSurface", type: "boolean", default: "false", description: "Forces the first depth step even when the parent is not a match (:2083-2085) — the fix for a tinted card on a page that matches it." },
  { name: "scrollable", type: "boolean", default: "true", description: "Off drops the body's overflow-auto and thin scrollbar (:1158); min-h-0 flex-1 stay, so the body still shrinks in a height-constrained parent." },
  { name: "flexBody", type: "boolean", default: "false", description: "Makes the header and the body flex columns that fill the card (:1127,1143,1156)." },
  { name: "fullWidth", type: "boolean", default: "undefined", description: "Adds w-full (:1281) — which the section already carries (:1276). A no-op on Panel." },
  { name: "maxWidth / minHeight", type: "string | number", description: "A number is suffixed with px (:934-941) into the section's style; a string is used verbatim." },
  { name: "decoration", type: "PanelDecoration", default: '"none"', description: "gradient | shapes | both, drawn as aria-hidden pointer-events-none layers, fading to opacity-50 under the pointer (:1375-1416). Suppressed entirely on an overlay card (:927-930)." },
  { name: "vibrancy", type: "GlassVibrancy", default: '"medium"', description: "low | medium | high | number — the backdrop-blur multiplier (:958). Read by the liquid-glass branch alone (:1011): on glass and default it changes nothing at all." },
  { name: "glassOpacity", type: "GlassOpacity", default: '"frosted"', description: "frosted | light | clear | number (glass.ts:38-41). Same: liquid-glass only (:959,1012)." },
  { name: "specularMode", type: "PanelSpecularMode", default: "undefined", description: "none | classic | halo. Absent resolves to classic, or to none if the deprecated specularHighlight is false (:820-824). Applied when the variant is glass, liquid-glass or default (:1431)." },
  { name: "specularHighlight", type: "boolean", default: "true", description: "Deprecated form of specularMode=\"none\", and ignored once specularMode is set (:820-824)." },
  { name: "onClick", type: "MouseEventHandler<HTMLElement>", description: "Pulled out of the spread so the card can guard it (:689,1333): a click belonging to a control inside the card is dropped (:775-778), a click that travelled more than 4px was a text selection and is dropped (:779-782), and anything else reaches you. It is also what hoverable and clickable default to (:725,731)." },
  { name: "onMouseDown / onMouseUp", type: "MouseEventHandler<HTMLElement>", description: "Chained, not replaced (:1335-1350): the card records the press and the travel for the guard above, then calls yours whichever way its own logic decided." },
  { name: "…HTMLAttributes<HTMLElement>", type: "element attributes", description: "Rest-spread onto the section before the component's own attributes (:1329), so your id, aria-* and data-* land on the card. role, tabIndex and onKeyDown are pulled out first and win over what a clickable card would set (:690-692,1330-1331,1355); className is concatenated by clsx (:1321), not merged — there is no tailwind-merge here, so a p-8 of yours does not beat p-4." },
  { name: "ref", type: "Ref<HTMLElement>", description: "forwardRef to the section (:644-713). Panel fills the same node from its own callback, so Modal's focus trap and your ref see one element." },
];

export default PanelPage;

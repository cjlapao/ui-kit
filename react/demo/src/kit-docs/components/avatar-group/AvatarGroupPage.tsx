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
} from "../../shared/A11ySections";
import { AvatarGroupPlayground } from "./AvatarGroupPlayground";
import TeamInitials from "./examples/TeamInitials";
import teamInitialsCode from "./examples/TeamInitials.tsx?raw";
import Integrations from "./examples/Integrations";
import integrationsCode from "./examples/Integrations.tsx?raw";
import TransparentLogos from "./examples/TransparentLogos";
import transparentLogosCode from "./examples/TransparentLogos.tsx?raw";
import CondensedOverflow from "./examples/CondensedOverflow";
import condensedOverflowCode from "./examples/CondensedOverflow.tsx?raw";
import ExpandOnHover from "./examples/ExpandOnHover";
import expandOnHoverCode from "./examples/ExpandOnHover.tsx?raw";
import SingleRowScroll from "./examples/SingleRowScroll";
import singleRowScrollCode from "./examples/SingleRowScroll.tsx?raw";

const NAMING_CODE = `// The chip names itself from the item; the artwork never double-announces.
<AvatarGroup
  items={[
    { name: "Ada Lovelace" },                       // role="img", name "Ada Lovelace", initials "AL"
    { name: "Deploy bot", icon: "Cog",              // role="img", icon aria-hidden
      onClick: openBot },                           // with onClick: a real <button>
    { initials: "SUP", tone: "rose" },              // no name: the accessible name is "SUP"
    {},                                             // nothing: the User glyph, named "User avatar"
  ]}
/>`;

export const AvatarGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Avatar Group"
      description="Identities on display: a strip of avatar chips — photos, icons or initials discs, each in its own tone or the group's — condensed into an overlapping stack behind a +N chip when the count (or the container width) outgrows the row, and expanded by unfolding exactly like the colour swatches: the stacked chips spread apart, the rest pop in left to right, one layout clipped or whole."
    />
    <AvatarGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Team Initials"
        description="Initials discs in the saturated tones — the group's emerald fallback, three personal overrides, and the kit's glyph-fill rule keeping every tone legible, yellow and lime included."
        code={teamInitialsCode}
        filename="TeamInitials.tsx"
      >
        <TeamInitials />
      </ExampleCard>
      <ExampleCard
        title="Integrations"
        description="Registry icons on the same tones almost transparent — a /10 wash that brands the chip without outshouting the glyph. Icons ride on the wash by default; background: false takes it away."
        code={integrationsCode}
        filename="Integrations.tsx"
      >
        <Integrations />
      </ExampleCard>
      <ExampleCard
        title="Transparent Logos"
        description="Image chips sit bare on the page by default; with background: true the tone wash paints under the art, showing through transparent logos and PNGs."
        code={transparentLogosCode}
        filename="TransparentLogos.tsx"
      >
        <TransparentLogos />
      </ExampleCard>
      <ExampleCard
        title="Condensed Overflow"
        description="Twelve identities in a card with room for five: overlapping, hidden behind a +7, unfolding downward — and a strip too narrow for its own count condenses on its own."
        code={condensedOverflowCode}
        filename="CondensedOverflow.tsx"
      >
        <CondensedOverflow />
      </ExampleCard>
      <ExampleCard
        title="Expand On Hover"
        description={`expandOn="hover" for rosters with room around them — opened by the pointer, folded by its leaving, chip still there for keyboard and touch.`}
        code={expandOnHoverCode}
        filename="ExpandOnHover.tsx"
      >
        <ExpandOnHover />
      </ExampleCard>
      <ExampleCard
        title="Single Row"
        description={`singleRow caps the expansion at one line: opened, the chips hold a single row and the strip scrolls sideways to reach the rest, with the collapse chip pinned to the right. Off, it unfolds and wraps as usual.`}
        code={singleRowScrollCode}
        filename="SingleRowScroll.tsx"
      >
        <SingleRowScroll />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The strip is a <C>role="group"</C> labelled <em>Avatars</em>, and the{" "}
          <C>+N</C> chip is one <C>aria-expanded</C> button wired to it with{" "}
          <C>aria-controls</C>. A chip is a <C>role="img"</C> figure named by
          its item — <C>aria-label</C> plus a <C>title</C> tooltip — or, with
          an <C>onClick</C>, a real <C>&lt;button&gt;</C> with the same name;
          its artwork is <C>aria-hidden</C> and images carry <C>alt=""</C>, so
          the person is announced once, not as name-and-photo. Condensing is
          pure presentation: every chip stays mounted and readable whether or
          not <em>you</em> have clicked the +N yet — only the tab order of the
          zero-width ones thins, until the strip opens. An item with no name,
          initials, icon or image renders the kit&apos;s <em>User</em> glyph
          under the shared <em>User avatar</em> name.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>
      <A11yTopic title="Keyboard Support">
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Move between the <C>+N</C> chip and chips that have an{" "}
                  <C>onClick</C>; condensed ones sit zero-width behind the
                  chip and are skipped until the strip is expanded.
                </>
              ),
            },
            {
              keys: ["enter", "space"],
              action: (
                <>
                  On the <C>+N</C> chip: unfold or fold the strip (native
                  button behaviour). On a chip: fire its <C>onClick</C>.
                </>
              ),
            },
            {
              keys: ["left", "right", "home", "end"],
              action: (
                <>
                  In <C>singleRow</C>, once the scroll viewport is focused:
                  scroll the row (native scroll behaviour). A row that already
                  fits leaves the viewport out of the tab order entirely.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Chips are silent about strings: their accessible names are the{" "}
          <C>name</C>/<C>initials</C> the caller passes, and the nameless
          fallback reuses the translated <em>User avatar</em> label. The
          built-in strings — the <em>Avatars</em> group label, the{" "}
          <C>+N</C> chip&apos;s <em>Show N more avatars</em> /{" "}
          <em>Collapse avatars</em> — are English built-ins, the same stance
          the colour swatches take; the counter is a bare number, and the
          strip lays out in the container&apos;s inline direction.
        </p>
      </A11yTopic>
    </A11ySection>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        API
      </h2>
      <div className="max-w-3xl">
        <PropsTable
          props={[
            {
              name: "items",
              type: "AvatarGroupItem[]",
              description:
                "The identities to display. An empty roster renders nothing.",
            },
            {
              name: "size",
              type: "ControlSize",
              default: '"md"',
              description:
                "Chip box on the shared control ladder — UserAvatar's px boxes (20–48) and text scale.",
            },
            {
              name: "tone",
              type: "TrueColor",
              default: '"blue"',
              description:
                "The global fallback colour, for every item that carries no tone of its own.",
            },
            {
              name: "rounded",
              type: '"full" | "lg" | "md" | "none"',
              default: '"full"',
              description:
                "One corner for every chip — discs, washes, image clips and halos alike.",
            },
            {
              name: "border",
              type: "boolean",
              default: "true",
              description:
                "A 2px tone-neutral rim on every chip — the glass-edge recipe, committed enough to read at normal size. It separates same-tone chips where they overlap and lifts near-transparent washes off same-colored surfaces.",
            },
            {
              name: "maxVisible",
              type: "number",
              default: "5",
              description:
                "Chips shown before the +N chip — and the cap once a too-narrow container condenses on its own. Non-finite falls back to 5, finite clamps to ≥ 1.",
            },
            {
              name: "expandOn",
              type: '"click" | "hover"',
              default: '"click"',
              description:
                "What opens the expansion; the +N chip always works too.",
            },
            {
              name: "defaultExpanded",
              type: "boolean",
              default: "false",
              description: "Whether the strip starts unfolded.",
            },
            {
              name: "singleRow",
              type: "boolean",
              default: "false",
              description:
                "Cap the expansion at one row. Off, the strip unfolds and wraps naturally, growing as tall as it needs; on, it holds a single row and scrolls sideways (a ScrollArea — wheel, touch and keyboard) to reach the rest, the collapse chip pinned to the right edge.",
            },
            {
              name: "padding",
              type: "SurfacePadding",
              default: '"none"',
              description: "Inset around the group, on the shared container scale.",
            },
            {
              name: "className + attributes",
              type: "—",
              description:
                "Everything else lands on the root div.",
            },
          ]}
        />
        <PropsTable
          title="AvatarGroupItem"
          props={[
            {
              name: "name",
              type: "string",
              description:
                "The accessible name, the tooltip, and the source of the derived initials (first letter, plus the last word's for a multi-word name).",
            },
            {
              name: "initials",
              type: "string",
              description:
                "Explicit initials — trimmed, uppercased, truncated to two; wins over the derivation.",
            },
            {
              name: "icon",
              type: "IconName | ReactElement",
              description: "Registry icon name or element.",
            },
            {
              name: "image",
              type: "string",
              description:
                "Image URL. A broken URL walks the chain (icon → initials → User glyph) instead of showing a dead frame.",
            },
            {
              name: "tone",
              type: "TrueColor",
              description:
                "This chip's colour; falls back to the group's tone.",
            },
            {
              name: "background",
              type: "boolean",
              default: "true for icons, false for images",
              description:
                "The tone wash behind an image/icon chip, painted under the art. Ignored by initials discs.",
            },
            {
              name: "onClick",
              type: "MouseEventHandler",
              description:
                "With a handler the chip is a real button — tone focus ring included.",
            },
          ]}
        />
        <p className="mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          The content chain is <code>image → icon → initials → User glyph</code>{" "}
          — there is no <code>kind</code> field to keep in sync. Condensing has
          two triggers, too many chips for <code>maxVisible</code> or a
          measured row too narrow; expansion is one layout unfolding, the same{" "}
          <code>CASCADE_EXPAND</code> rhythm the colour swatches and tag panel
          keep.
        </p>
      </div>
    </section>
  </div>
);

export default AvatarGroupPage;

import React from "react";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { UserAvatarPlayground } from "./UserAvatarPlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Fallbacks from "./examples/Fallbacks";
import fallbacksCode from "./examples/Fallbacks.tsx?raw";
import Content from "./examples/Content";
import contentCode from "./examples/Content.tsx?raw";
import Group from "./examples/Group";
import groupCode from "./examples/Group.tsx?raw";

export const UserAvatarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="User Avatar"
      description="A person, PrimeVue's four ways and ours: image, icon, label, or a template — with a user object, a toned initial or glyph fallback, and an accessible name in every branch. PrimeVue drop-in parity: `label`, `icon`, `image`, `onError`, the `normal`/`large`/`xlarge` sizes, and children as the template slot."
    />
    <UserAvatarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Content"
        description="PrimeVue Avatar's contents and precedence — label, icon, image — plus children as the `template` slot. `user.avatarUrl` still feeds the image slot, and `image` wins when both are given."
        code={contentCode}
        filename="Content.tsx"
      >
        <Content />
      </ExampleCard>
      <ExampleCard
        title="Group"
        description="Grouping, PrimeVue-style: a negative-gap stack with rings, capped by a `label` avatar for the overflow."
        code={groupCode}
        filename="Group.tsx"
      >
        <Group />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control ladder, plus PrimeVue's `normal` / `large` / `xlarge` folded onto it — `size` was a bare pixel number, so an avatar could not be told to match the control beside it; a number still works and wins."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Fallbacks"
        description="Initial, generic glyph, and the recovery when an image URL fails — the `onError` / `@error` event fires first, PrimeVue-style. The chip was a hardcoded slate whatever the app's palette; it now takes a `tone`."
        code={fallbacksCode}
        filename="Fallbacks.tsx"
      >
        <Fallbacks />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "user",
          type: "UserAvatarUser | null",
          description:
            "`{ name?, username?, email?, avatarUrl? }` — the first present of name/username/email is both the initial and the accessible name; `avatarUrl` feeds the image slot.",
        },
        {
          name: "label",
          type: "string",
          description:
            "PrimeVue&rsquo;s `label`. Text drawn on the tone chip; also the accessible name when there is no user behind the avatar.",
        },
        {
          name: "icon",
          type: "IconName | ReactElement",
          description:
            "PrimeVue&rsquo;s `icon` — a registry name or an element here instead of a CSS icon class. Decorative: the wrapper carries the name.",
        },
        {
          name: "image",
          type: "string",
          description:
            "PrimeVue&rsquo;s `image`. Wins over `user.avatarUrl`; either one falls back (and fires `onError`) when loading fails.",
        },
        {
          name: "size",
          type: 'ControlSize | "normal" | "large" | "xlarge" | number',
          default: '"md"',
          description:
            "The shared ladder, xs&rarr;xl. PrimeVue&rsquo;s presets fold onto `md` / `lg` / `xl`; a plain number is an exact pixel box and wins over everything.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"neutral"',
          description:
            "The chip that label, icon, initial and glyph all draw on — the fallback PrimeVue has no equivalent of.",
        },
        {
          name: "shape",
          type: '"circle" | "rounded" | "square"',
          default: '"circle"',
          description:
            "A superset of PrimeVue&rsquo;s circle/square pair. `variant` is the deprecated alias and still resolves.",
        },
        {
          name: "onError",
          type: "(event) => void",
          description:
            "PrimeVue&rsquo;s `@error` — fires when the picture fails, then the avatar falls back instead of blanking.",
        },
        {
          name: "onClick",
          type: "(event) => void",
          description:
            "With a handler the avatar becomes a native <button> — tab stop, Enter/Space, and a tone-tinted focus ring — instead of a div only the mouse can reach. Without one it stays role=img content.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Dims and blocks a clickable avatar (native `disabled`); meaningless without `onClick`.",
        },
        {
          name: "children",
          type: "ReactNode",
          description:
            "PrimeVue&rsquo;s `template` slot. Replaces the content wholesale; the wrapper keeps the box, shape and accessible name.",
        },
      ]}
    />
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      Standard div props spread onto the wrapper, except `color` (the avatar has
      none of its own — `tone` owns the colour). Content resolves in
      PrimeVue&rsquo;s order — children, then `label`, then `icon`, then the
      image — and falls below it to ours: the `user` initial, then the generic
      glyph. An image error fires `onError` and then falls back; PrimeVue emits
      `error` and shows a blank box.
    </p>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A plain avatar is one <code>role="img"</code> node named in every
          branch: an explicit <code>aria-label</code> first, else the
          person&rsquo;s identifier (name &rarr; username &rarr; email, so
          &ldquo;Ada Lovelace&rdquo; is announced), else the `label` text, else
          a translated &ldquo;User avatar&rdquo;. It used to be an unlabelled{" "}
          <code>div</code> whose only <code>alt</code> appeared on the happy
          image path. The picture and the fallback glyph stay decorative (
          <code>alt=""</code> / <code>aria-hidden</code>) so nothing announces
          twice, and <code>title</code> repeats the name for pointer users.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Plain avatars are content, not controls — deliberately outside the tab
          order, nothing to operate. Give one an `onClick`, though, and it
          becomes a native <code>&lt;button&gt;</code>: a real tab stop,
          Enter/Space activation, a tone-tinted <code>focus-visible</code> ring,
          and a native <code>disabled</code> state that dims it without leaving
          a mouse-creepable div behind. That is new — onClick used to ride a
          plain div, so keyboard and screen-reader users could see the person
          but never reach the action.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The last-resort accessible name is catalogued at{" "}
          <code>kit.useravatar.fallback</code> (en, es, fr, de, pt), so an
          unnamed avatar announces in the active language. Names, labels and
          initials come from your data untouched — the initial is the first
          letter of the trimmed identifier, which assumes scripts where that
          means something; pass `label` explicitly for CJK names or single
          ideographs.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default UserAvatarPage;

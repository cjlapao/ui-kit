import React from "react";
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

const mono = "font-mono text-[12px] text-neutral-700 dark:text-neutral-300";

const API_ROWS: { prop: string; type: string; def: string; note: string }[] = [
  {
    prop: "user",
    type: "UserAvatarUser | null",
    def: "—",
    note: "The person: `name` / `username` / `email` give the initial and the accessible name, `avatarUrl` the picture. Unchanged by the import.",
  },
  {
    prop: "label",
    type: "string",
    def: "—",
    note: "PrimeVue's `label`. Text drawn on the tone chip; also the accessible name when there is no user.",
  },
  {
    prop: "icon",
    type: "IconName | ReactElement",
    def: "—",
    note: "PrimeVue's `icon` — a registry name or an element here instead of a CSS icon class.",
  },
  {
    prop: "image",
    type: "string",
    def: "—",
    note: "PrimeVue's `image`. Wins over `user.avatarUrl`; either one falls back on error.",
  },
  {
    prop: "size",
    type: "ControlSize | \"normal\" | \"large\" | \"xlarge\" | number",
    def: `"md"`,
    note: "The shared ladder; PrimeVue's presets land on `md` / `lg` / `xl`, a number is the exact pixel box.",
  },
  {
    prop: "tone",
    type: "TrueColor",
    def: `"neutral"`,
    note: "The chip the label, icon, initial and glyph all draw on. No PrimeVue equivalent — its avatar has no fallback to tone.",
  },
  {
    prop: "shape",
    type: `"circle" | "rounded" | "square"`,
    def: `"circle"`,
    note: "A superset of PrimeVue's `circle` / `square`, with `rounded` added; `variant` is the deprecated alias.",
  },
  {
    prop: "onError",
    type: "(event) => void",
    def: "—",
    note: "PrimeVue's `@error` (a Vue `emit(\"error\")` there; it also bubbles through the attrs spread here) — then the avatar falls back instead of blanking.",
  },
  {
    prop: "children",
    type: "ReactNode",
    def: "—",
    note: "PrimeVue's `template` slot (the default slot in Vue). Replaces the content; the wrapper keeps the box, shape and name.",
  },
];

const ApiTable: React.FC = () => (
  <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
    <table className="w-full min-w-[760px] text-left text-sm">
      <caption className="sr-only">UserAvatar props, with PrimeVue Avatar equivalents</caption>
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          <th scope="col" className="px-4 py-2.5 font-semibold">Prop</th>
          <th scope="col" className="px-4 py-2.5 font-semibold">Type</th>
          <th scope="col" className="px-4 py-2.5 font-semibold">Default</th>
          <th scope="col" className="px-4 py-2.5 font-semibold">Notes</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {API_ROWS.map((row) => (
          <tr key={row.prop}>
            <td className={`px-4 py-2.5 align-top ${mono}`}>{row.prop}</td>
            <td className={`px-4 py-2.5 align-top ${mono}`}>{row.type}</td>
            <td className={`px-4 py-2.5 align-top ${mono}`}>{row.def}</td>
            <td className="px-4 py-2.5 align-top leading-5 text-neutral-600 dark:text-neutral-400">{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const UserAvatarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="User Avatar"
      description="A person, PrimeVue's four ways and ours: image, icon, label, or a template — with a user object, a toned initial or glyph fallback, and an accessible name in every branch. PrimeVue drop-in parity: `label`, `icon`, `image`, `onError`, the `normal`/`large`/`xlarge` sizes, and children as the template slot."
    />
    <UserAvatarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Content" description="PrimeVue Avatar's contents and precedence — label, icon, image — plus children as the `template` slot. `user.avatarUrl` still feeds the image slot, and `image` wins when both are given." code={contentCode} filename="Content.tsx"><Content /></ExampleCard>
      <ExampleCard title="Group" description="Grouping, PrimeVue-style: a negative-gap stack with rings, capped by a `label` avatar for the overflow." code={groupCode} filename="Group.tsx"><Group /></ExampleCard>
      <ExampleCard title="Sizes" description="The shared control ladder, plus PrimeVue's `normal` / `large` / `xlarge` folded onto it — `size` was a bare pixel number, so an avatar could not be told to match the control beside it; a number still works and wins." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard title="Fallbacks" description="Initial, generic glyph, and the recovery when an image URL fails — the `onError` / `@error` event fires first, PrimeVue-style. The chip was a hardcoded slate whatever the app's palette; it now takes a `tone`." code={fallbacksCode} filename="Fallbacks.tsx"><Fallbacks /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <ApiTable />
      <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Content resolves in PrimeVue&apos;s order — children, then `label`, then
        `icon`, then the image — and falls below it to ours: the `user`
        initial, then the generic glyph. The root is always `role="img"`; its
        name is an explicit `aria-label` first, else the user&apos;s identifier,
        then `label`. An image error fires `onError` and then falls back —
        unlike PrimeVue, which emits `error` and shows a blank box.
      </p>
    </section>
  </div>
);

export default UserAvatarPage;

import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { UserAvatarPlayground } from "./UserAvatarPlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Fallbacks from "./examples/Fallbacks";
import fallbacksCode from "./examples/Fallbacks.tsx?raw";

export const UserAvatarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="User Avatar"
      description="A person's picture, with an initial or a glyph when there is none. It carries an accessible name in every branch, takes a tone from the shared palette, and sizes on the control ladder."
    />
    <UserAvatarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Sizes" description="The shared control ladder. `size` was a bare pixel number, so an avatar could not be told to match the control beside it — a number still works and wins." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard title="Fallbacks" description="Initial, generic glyph, and the recovery when an image URL fails. The chip was a hardcoded slate whatever the app's palette; it now takes a `tone`." code={fallbacksCode} filename="Fallbacks.tsx"><Fallbacks /></ExampleCard>
    </section>
  </div>
);

export default UserAvatarPage;

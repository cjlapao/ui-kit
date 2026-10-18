import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { NotificationModalPlayground } from "./NotificationModalPlayground";
import Types from "./examples/Types";
import typesCode from "./examples/Types.tsx?raw";

export const NotificationModalPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Notification Modal"
      description="A small Modal for a single outcome — a glyph, a title, a message and one or two actions. The type picks the glyph and tone; both are overridable, and the rest of Modal's props pass through."
    />
    <NotificationModalPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Every type" description="error and warning now use different glyphs — both mapped to Warning, so a failure and a caution were indistinguishable at a glance." code={typesCode} filename="Types.tsx"><Types /></ExampleCard>
    </section>
  </div>
);

export default NotificationModalPage;

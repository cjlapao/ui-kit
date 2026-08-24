import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DropdownMenuPlayground } from "./DropdownMenuPlayground";
import MenuAnatomy from "./examples/MenuAnatomy";
import menuAnatomyCode from "./examples/MenuAnatomy.tsx?raw";
import PlainItems from "./examples/PlainItems";
import plainItemsCode from "./examples/PlainItems.tsx?raw";
import CollisionFlips from "./examples/CollisionFlips";
import collisionFlipsCode from "./examples/CollisionFlips.tsx?raw";

export const DropdownMenuPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dropdown Menu"
      description="The raw, positioning-only menu — no trigger of its own. Align, side, width and max-height against the viewport; icons, descriptions, disabled and danger items, with full keyboard support."
    />
    <DropdownMenuPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Menu anatomy"
        description="Every item shape at once — icons, descriptions, a disabled row and a danger row."
        code={menuAnatomyCode}
        filename="MenuAnatomy.tsx"
      >
        <MenuAnatomy />
      </ExampleCard>
      <ExampleCard
        title="Plain items"
        description="Label-only items for a simple action list."
        code={plainItemsCode}
        filename="PlainItems.tsx"
      >
        <PlainItems />
      </ExampleCard>
      <ExampleCard
        title="Collision flips"
        description="Three anchors top to bottom — the menu is placed against the viewport, so the bottom one flips upward."
        code={collisionFlipsCode}
        filename="CollisionFlips.tsx"
      >
        <CollisionFlips />
      </ExampleCard>
    </section>
  </div>
);

export default DropdownMenuPage;

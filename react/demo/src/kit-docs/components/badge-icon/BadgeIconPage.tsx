import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { BadgeIconPlayground } from "./BadgeIconPlayground";
import Notifications from "./examples/Notifications";
import notificationsCode from "./examples/Notifications.tsx?raw";
import Positions from "./examples/Positions";
import positionsCode from "./examples/Positions.tsx?raw";
import DotZeroOverflow from "./examples/DotZeroOverflow";
import dotZeroOverflowCode from "./examples/DotZeroOverflow.tsx?raw";
import CustomBadge from "./examples/CustomBadge";
import customBadgeCode from "./examples/CustomBadge.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

export const BadgeIconPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Badge Icon"
      description="An icon button with a badge indicator pinned to one of its four corners. Pass a count, a dot, or any custom badge node — the count, overflow cap and tone come from the Badge vocabulary via badgeProps, and the button itself is a full IconButton, so every of its props (variant, size, loading, onClick) works as usual."
    />
    <BadgeIconPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Notifications"
        description="The usual suspects in a toolbar: count badges in different tones, a dot for a bare 'there is something' signal, and a plain button with nothing to show."
        code={notificationsCode}
        filename="Notifications.tsx"
      >
        <Notifications />
      </ExampleCard>
      <ExampleCard
        title="Positions"
        description="badgePosition pins the badge to a corner — top-start, top-end (default), bottom-start or bottom-end."
        code={positionsCode}
        filename="Positions.tsx"
      >
        <Positions />
      </ExampleCard>
      <ExampleCard
        title="Dot, zero and overflow"
        description="A dot for a non-numeric signal, count 0 hiding the badge entirely, and a count above maxCount collapsing to the {maxCount}+ form."
        code={dotZeroOverflowCode}
        filename="DotZeroOverflow.tsx"
      >
        <DotZeroOverflow />
      </ExampleCard>
      <ExampleCard
        title="Custom badge"
        description="badgeContent replaces count and dot with any node — a glyph, a short label, a full mini-panel."
        code={customBadgeCode}
        filename="CustomBadge.tsx"
      >
        <CustomBadge />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="The badge takes the full 21-tone palette through badgeProps — a representative spread here."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>
  </div>
);

export default BadgeIconPage;

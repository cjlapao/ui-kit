import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ToolbarPlayground } from "./ToolbarPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Surface from "./examples/Surface";
import surfaceCode from "./examples/Surface.tsx?raw";
import Nav from "./examples/Nav";
import navCode from "./examples/Nav.tsx?raw";

export const ToolbarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toolbar"
      description="A named row of controls for the content beside it — PrimeVue's Toolbar with its start / center / end regions, wearing the kit's shared Panel surface: the same variants, tones, corner and padding scales, painted from the same theme helpers. role=toolbar throughout; empty regions hold their place, so an `end`-only bar still parks right, and the row wraps instead of overflowing."
    />
    <ToolbarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Basic" description="The PrimeVue demo itself: ghost icon buttons on the left, a search field centered, the primary Save on the right." code={basicCode} filename="Basic.tsx"><Basic /></ExampleCard>
      <ExampleCard title="Surface" description="A toolbar is a sideways Panel — the `variant` ladder from `simple` to `liquid-glass`, a `tone` for the tinted ones, and the container `corner` and `padding` scales." code={surfaceCode} filename="Surface.tsx"><Surface /></ExampleCard>
      <ExampleCard title="Nav" description="PrimeVue's custom toolbar is really a navbar — same three regions, different furniture. The `end` group closes with a `UserAvatar`, so the signed-in person is part of the bar." code={navCode} filename="Nav.tsx"><Nav /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Region props are <code>start</code>, <code>center</code> and{" "}
          <code>end</code> (React nodes; Vue named slots), plus{" "}
          <code>children</code> as an optional extra group appended after the
          regions. The surface props are Panel's: <code>variant</code> (the{" "}
          <code>SURFACE_VARIANTS</code> set, default <code>"outlined"</code>),{" "}
          <code>tone</code>, <code>padding</code> (the container scale,{" "}
          <code>"xs"</code> for a bar) and <code>corner</code>, plus{" "}
          <code>vibrancy</code> and <code>glassOpacity</code> for{" "}
          <code>liquid-glass</code>. The regions publish the surface through{" "}
          <code>SurfaceProvider</code>, so an <code>Input</code> on a glass
          bar picks its text contrast the same way one on a glass card does.
          Everything else — <code>aria-label</code>, <code>id</code>,{" "}
          <code>className</code> — lands on the root, which is always{" "}
          <code>role="toolbar"</code>. PrimeVue exposes only{" "}
          <code>aria-labelledby</code> there; here any attribute passes
          through, so give each toolbar a name of its own.
        </p>
      </div>
    </section>
  </div>
);

export default ToolbarPage;

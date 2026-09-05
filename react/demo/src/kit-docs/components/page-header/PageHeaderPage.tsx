import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PageHeaderPlayground } from "./PageHeaderPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithSideMenu from "./examples/WithSideMenu";
import withSideMenuCode from "./examples/WithSideMenu.tsx?raw";

export const PageHeaderPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Page Header"
      description="The bar across the top of the main column — the Toolbar's page-level sibling. Same start / center / end regions, but the furniture of a page (brand, breadcrumb, controls) and the SideMenu's own header chrome, so the seam line runs across the shell unbroken. (Not to be confused with the docs' own page-title block, which shares the name locally.)"
    />
    <PageHeaderPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Basic" description="Brand and breadcrumb trail on the left, page controls on the right — the regions of a Toolbar wearing header chrome." code={basicCode} filename="Basic.tsx"><Basic /></ExampleCard>
      <ExampleCard title="With SideMenu" description="The pairing it exists for: the sidebar's logo header and this bar paint the same height, seam colour and fill from one set of constants, so the horizontal line crosses the shell in one stroke — collapse the menu and nothing moves." code={withSideMenuCode} filename="WithSideMenu.tsx"><WithSideMenu /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Region props are <code>start</code>, <code>center</code> and{" "}
          <code>end</code> (React nodes; Vue named slots), plus{" "}
          <code>children</code> as an optional extra group — empty regions
          still hold their place, as in <code>Toolbar</code>. There are
          deliberately no <code>variant</code>, <code>padding</code> or{" "}
          <code>corner</code> props: the component exists so the seam
          continues unbroken from the sidebar's logo header, and both sides
          paint the shared <code>SIDE_MENU_HEADER_HEIGHT</code>,{" "}
          <code>SIDE_MENU_HEADER_SEAM</code> and{" "}
          <code>SIDE_MENU_HEADER_FILL</code> constants — drift is a red test,
          not a visual bug. It renders a <code>&lt;header&gt;</code> (the
          banner landmark at page top level); attributes pass through to it,
          so name it with <code>aria-label</code> when a page carries more
          than one.
        </p>
      </div>
    </section>
  </div>
);

export default PageHeaderPage;

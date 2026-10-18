import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
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
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Brand and breadcrumb trail on the left, page controls on the right — the regions of a Toolbar wearing header chrome."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With SideMenu"
        description="The pairing it exists for: the sidebar's logo header and this bar paint the same height, seam colour and fill from one set of constants, so the horizontal line crosses the shell in one stroke — collapse the menu and nothing moves."
        code={withSideMenuCode}
        filename="WithSideMenu.tsx"
      >
        <WithSideMenu />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The element is a <C>&lt;header&gt;</C> — the banner landmark at page
          top level — deliberately not <C>role="toolbar"</C>: this is a
          page&rsquo;s identity bar, not a command bar. Banners are found{" "}
          <C>by name</C>, and an unnamed one is just &ldquo;banner&rdquo;; a
          page carrying more than one header must name each with{" "}
          <C>aria-label</C>. Empty regions stay in the DOM but contribute
          nothing to the accessibility tree.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          None of its own — the bar is not focusable and adds no bindings.
          Buttons, links and search fields in the regions stay individually
          tabbable, in DOM order from left to right (start, center, end, then
          the children group).
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          No strings ship with it; every word arrives through the regions. The
          layout is flex flow, so under <C>dir="rtl"</C> the <C>start</C> region
          (brand, breadcrumb) and the <C>end</C> region (avatar, toggles) swap
          sides exactly as those logical names mean, and the gap keeps its
          rhythm while groups wrap instead of overflowing.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "start / center / end",
          type: "ReactNode",
          description:
            "The three regions; empty ones still hold their DOM place, so an end-only header parks right.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Extra group appended after the regions.",
        },
        {
          name: "—",
          type: "no surface props",
          description:
            "Deliberately no variant, tone, padding or corner: both this bar and the sidebar's logo header paint the shared SIDE_MENU_HEADER_HEIGHT / _FILL / _SEAM constants so the seam never breaks — drift is a red test, not a visual bug.",
        },
        {
          name: "…html props",
          type: "HTMLAttributes",
          description: (
            <>
              aria-label, id, className — everything lands on the{" "}
              <C>&lt;header&gt;</C> itself.
            </>
          ),
        },
      ]}
    />
  </div>
);

const NAMING_CODE = `// Two banners on one page — the names are all
// a screen reader has to tell them apart.
<PageHeader aria-label="Application" start={brand} end={account} />`;

export default PageHeaderPage;

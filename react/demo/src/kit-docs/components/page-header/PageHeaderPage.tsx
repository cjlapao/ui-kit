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
import FloatingShell from "./examples/FloatingShell";
import floatingShellCode from "./examples/FloatingShell.tsx?raw";

export const PageHeaderPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Page Header"
      description="The bar across the top of the main column — the Toolbar's page-level sibling. Same start / center / end regions, but the furniture of a page (brand, breadcrumb, controls) and the SideMenu's own header chrome, so the seam line runs across the shell unbroken. The floating variants pair with the floating SideMenu as one detached-card system. (Not to be confused with the docs' own page-title block, which shares the name locally.)"
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
      <ExampleCard
        title="Floating pairing"
        description="Set to the same treatment as the SideMenu, the header becomes the menu's card twin: shared offset, corner, rim and shadow resolved from the same token function — the opaque pair above, the frosted tone-tinted pair below. The seam only belongs to the flush world; a detached card has none to continue."
        code={floatingShellCode}
        filename="FloatingShell.tsx"
      >
        <FloatingShell />
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
          name: "variant",
          type: `"default" | "floating" | "floating-glass"`,
          description: (
            <>
              <em>default</em> paints the shared{" "}
              <C>SIDE_MENU_HEADER_HEIGHT / _FILL / _SEAM</C> constants so the
              seam never breaks — drift is a red test, not a visual bug. The
              floating pair borrows the SideMenu&rsquo;s detached-card chrome
              (rim, shadow) from the very <C>getSidebarSurfaceTokens</C> the
              menu renders, so paired cards can&rsquo;t drift either.
            </>
          ),
        },
        {
          name: "accentColor",
          type: "TrueColor",
          description:
            "Tone of the floating-glass frosted fill — same token, name and default as the SideMenu's color, so a menu and header on one tone read as one system. Ignored by the other variants.",
        },
        {
          name: "padding",
          type: `"none" | "xs" | "sm" | "md" | "lg" | "xl"`,
          description: (
            <>
              The gutter <em>outside</em> the bar — the space the card leaves
              around itself, on every axis at once; the per-axis props below
              win where given. Same token names as <C>Panel</C>&rsquo;s
              padding on a margin scale; <C>"xs"</C> is the floating
              SideMenu&rsquo;s <C>m-2</C> on one side.
            </>
          ),
        },
        {
          name: "paddingTop / paddingRight / paddingBottom / paddingLeft",
          type: `"none" | "xs" | "sm" | "md" | "lg" | "xl"`,
          description: (
            <>
              Each axis on its own. The defaults depend on the variant: the
              floating card pairs with the menu — its <C>m-2</C> above and to
              the right (<C>"xs"</C>) and flush (<C>"none"</C>) left and
              bottom — while the seam bar closes on every side. The
              bar&rsquo;s inner <C>px-5</C> and height stay the seam&rsquo;s,
              pinned.
            </>
          ),
        },
        {
          name: "corner",
          type: `"auto" | "none" | "rounded" | "rounded-sm" | "rounded-md" | "rounded-lg" | "rounded-xl"`,
          description: (
            <>
              Radius, on <C>Panel</C>&rsquo;s corner scale and with its default
              (<C>rounded-md</C> &rarr; <C>rounded-2xl</C>) — the exact class
              the floating cards&rsquo; token radius already produces, so a
              paired menu/header set matches until you turn the knob.
            </>
          ),
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

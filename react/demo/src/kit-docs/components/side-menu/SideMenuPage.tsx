import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SideMenuPlayground } from "./SideMenuPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Noise from "./examples/Noise";
import noiseCode from "./examples/Noise.tsx?raw";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";
import Collapse from "./examples/Collapse";
import collapseCode from "./examples/Collapse.tsx?raw";
import Nested from "./examples/Nested";
import nestedCode from "./examples/Nested.tsx?raw";
import Search from "./examples/Search";
import searchCode from "./examples/Search.tsx?raw";
import TopFooter from "./examples/TopFooter";
import topFooterCode from "./examples/TopFooter.tsx?raw";
import CallToActions from "./examples/CallToActions";
import callToActionsCode from "./examples/CallToActions.tsx?raw";
import DetailFooter from "./examples/DetailFooter";
import detailFooterCode from "./examples/DetailFooter.tsx?raw";
import Actions from "./examples/Actions";
import actionsCode from "./examples/Actions.tsx?raw";
import DualLayout from "./examples/DualLayout";
import dualLayoutCode from "./examples/DualLayout.tsx?raw";
import MultiLayout from "./examples/MultiLayout";
import multiLayoutCode from "./examples/MultiLayout.tsx?raw";
import Workspaces from "./examples/Workspaces";
import workspacesCode from "./examples/Workspaces.tsx?raw";
import Chat from "./examples/Chat";
import chatCode from "./examples/Chat.tsx?raw";

export const SideMenuPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Side Menu"
      description="App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. Pinned call-to-action cards — media, title, one action, and a scroll of their own when the stack overflows — and a tone-washed detail footer fill the space under the navigation. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer. Everything inside follows the kit's scales: the tone (default blue) paints rows, hovers and loaders, and every hairline and label takes the surface treatment."
    />
    <SideMenuPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="The standing look: a translucent blur pushed into the layout, groups, badges and active-state matching that also lights up a parent while any descendant is active."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Surface variants"
        description="sidebar is the standing look; inset is a flat panel with a hairline, floating a detached rounded card, floating-glass that card in the kit's liquid-glass language, and glass the liquid-glass look flush in the layout — both glass treatments tinted with the menu's tone. Rows inside take the matching treatment automatically."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Dither noise"
        description="An opt-in film-grain texture over the panel background (off by default). It blends with the surface and reads most clearly on dark fills — the right panel has noise enabled."
        code={noiseCode}
        filename="Noise.tsx"
      >
        <Noise />
      </ExampleCard>
      <ExampleCard
        title="Loading states"
        description="The same loader set as Panel: skeleton (the default) replaces the rows with a pulsing placeholder shaped like the menu's own chrome, while spinner and progress overlay the shared loader on top of the content."
        code={loadingCode}
        filename="Loading.tsx"
      >
        <Loading />
      </ExampleCard>
      <ExampleCard
        title="Collapse modes"
        description={'Collapsing is opt-in: without collapsible the menu stays expanded, shows no collapse control and ignores openOnHover. collapsible (or "icon") shrinks to an icon rail, "offcanvas" removes the panel entirely (a handle at the edge opens it again), and collapsible + openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all.'}
        code={collapseCode}
        filename="Collapse.tsx"
      >
        <Collapse />
      </ExampleCard>
      <ExampleCard
        title="Nested items"
        description="Children render as an indented sub-tree with its own chevron toggle. A parent that contains the active route carries the active tone, and defaultOpen pre-opens a branch."
        code={nestedCode}
        filename="Nested.tsx"
      >
        <Nested />
      </ExampleCard>
      <ExampleCard
        title="Search"
        description="A toggleable search below the top item matches each label and description, hides non-matching branches and auto-expands the parents of nested matches."
        code={searchCode}
        filename="Search.tsx"
      >
        <Search />
      </ExampleCard>
      <ExampleCard
        title="Top and footer menus"
        description="A full row above the navigation (workspace switcher) and one pinned above the collapse control (user menu), each with its own dropdown."
        code={topFooterCode}
        filename="TopFooter.tsx"
      >
        <TopFooter />
      </ExampleCard>
      <ExampleCard
        title="Call-to-action cards"
        description="Structured pitch cards pinned between the navigation and the footer — media, title, description and one action (router path or callback). More cards than the zone's cap leaves for and the stack scrolls on its own, independently of the nav; the ✕ on the capacity card is opt-in through onDismiss, with dismissed slugs kept in component state."
        code={callToActionsCode}
        filename="CallToActions.tsx"
      >
        <CallToActions />
      </ExampleCard>
      <ExampleCard
        title="Detail footer"
        description="A tone-washed status box above the collapse control: rows of wrapping text with a soft Pill or tinted value on the right. footerDetailsTone tints the box independently of the menu tone; nothing is removable — the array is the whole contract."
        code={detailFooterCode}
        filename="DetailFooter.tsx"
      >
        <DetailFooter />
      </ExampleCard>
      <ExampleCard
        title="Row actions and badges"
        description="Actions render at the end of a row — always, or only on hover via actionsOnHover — and badges ride along next to the label or as a dot in the icon rail."
        code={actionsCode}
        filename="Actions.tsx"
      >
        <Actions />
      </ExampleCard>
      <ExampleCard
        title="Dual sidebars (layout)"
        description="SideMenuLayout with a rightSideMenuProps renders a second menu on the opposite edge; each menu keeps its own collapse and mobile-drawer state."
        code={dualLayoutCode}
        filename="DualLayout.tsx"
      >
        <DualLayout />
      </ExampleCard>
      <ExampleCard
        title="Multi sidebars (layout)"
        description="With a secondarySideMenuProps the primary is pinned to the hover rail — always collapsed, expanding on hover — so the pair reads as one multi-sidebar rail."
        code={multiLayoutCode}
        filename="MultiLayout.tsx"
      >
        <MultiLayout />
      </ExampleCard>
      <ExampleCard
        title="Workspaces (group actions, tag, loading rows, lazy children)"
        description="A workspace navigator from the kit's own props — collapse it to see the rail: session times (`meta`) hide, and icon-less sessions show their initials. The group header carries `actions` (here only on hover) and a tone `tag`; a running session swaps its icon for a spinner with `loading`; each workspace shows its sessions a page at a time with `childrenPageSize`, and asks a (fake) server for the next page through `childrenTotal` + `onLoadMoreChildren` + `loadingChildren`."
        code={workspacesCode}
        filename="Workspaces.tsx"
      >
        <Workspaces />
      </ExampleCard>
      <ExampleCard
        title="Chat layout"
        description="The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body."
        code={chatCode}
        filename="Chat.tsx"
      >
        <Chat />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The rows live in a <C>nav</C> landmark named by <C>title</C> (or <C>kit.sidemenu.navAria</C>). Every row is a
          real router link; the current one carries <C>aria-current="page"</C>, and a <C>loading</C> row carries{" "}
          <C>aria-busy</C> — its spinner is hidden from assistive tech so a list of running rows does not chatter. A
          parent&rsquo;s chevron is a separate button with <C>aria-expanded</C> and a name built from the label
          (&ldquo;Expand new_agents submenu&rdquo;); its children sit in a <C>role="group"</C> named after the parent.
        </p>
        <p>
          &ldquo;Show N more&rdquo; is a button, <C>aria-busy</C> and disabled while <C>loadingChildren</C> fetches.
          Group <C>actions</C> are your own controls — give icon-only ones an <C>aria-label</C>; with{" "}
          <C>actionsOnHover</C> they also appear when focus enters the header, so keyboard users can reach them.
        </p>
      </A11yTopic>
      <KeyboardSupportTable
        bindings={[
          { keys: ["Tab"], action: "Moves through the top item, search, rows, submenu chevrons, group actions, Show more and the footer controls in document order." },
          { keys: ["Enter"], action: "Follows a row's link; on a chevron, Show more or a group action, activates it." },
          { keys: ["Space"], action: "Activates a focused button — chevron, Show more, group action, collapse control." },
          { keys: ["Esc"], action: "Closes the mobile drawer; in hover-rail mode, closes the hovered panel." },
        ]}
      />
      <A11yTopic title="Internationalization">
        <p>
          The menu&rsquo;s own words are <C>kit.sidemenu.*</C> catalog keys in all five locales: search placeholder and
          name, collapse / expand / close controls, the submenu toggle and group names, &ldquo;Show {"{count}"}{" "}
          more&rdquo;, the no-results line and the navigation&rsquo;s fallback name. Labels, badges and{" "}
          <C>moreChildrenLabel</C> are yours. <C>side="right"</C> docks it on the other edge.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        { name: "items", type: "SideMenuItem[]", description: "A flat list of links, group headers and dividers. A link joins a group with groupName; a group with no visible link hides itself." },
        { name: "link: label / path / icon / color / description", type: "string / string / IconName / TrueColor / string", description: "The row; description is matched by search. A long label ends in an ellipsis, with the full name on hover. In the icon rail an icon-less row shows its initials (\"Simple Greeting\" → SG)." },
        { name: "link: badge", type: "ReactNode", description: "A badge at the row end — a count, a status dot. In the icon rail it rides the icon's corner." },
        { name: "link: meta", type: "ReactNode", description: "Trailing metadata — \"38min\", \"4h\", a size. Muted at the row end when expanded; hidden in the icon rail, where it is copy, not a badge." },
        { name: "link: actions / actionsOnHover", type: "ReactNode / boolean", description: "Controls at the row end; hover-only when actionsOnHover. Hidden in the icon rail." },
        { name: "link: children / defaultOpen", type: "SideMenuItemLink[] / boolean", description: "Nested rows make the row collapsible; defaultOpen opens it at first." },
        { name: "link: loading", type: "boolean", default: "false", description: "A spinner takes the icon's place (in the rail too) and the link is aria-busy." },
        { name: "link: childrenPageSize", type: "number", description: "Show the children a page at a time with a \"Show N more\" row. Search shows every match; an active child past the page is always revealed." },
        { name: "link: childrenTotal / onLoadMoreChildren / loadingChildren", type: "number / () => void / boolean", description: "Lazy children: the total that exists, the fetch for the next page (called when paging passes the loaded ones), and its in-flight state (the Show more row spins and waits)." },
        { name: "link: moreChildrenLabel", type: "(remaining) => ReactNode", default: '"Show {count} more"', description: "Name what is being loaded — \"Show 15 more sessions\"." },
        { name: "group: label / hasDivider", type: "string / boolean", description: "A section header; hasDivider draws a rule above it." },
        { name: "group: actions / actionsOnHover", type: "ReactNode / boolean", description: "Controls at the end of the header — search, filter, add. Hover-only reveals on hover or when focus enters the header." },
        { name: "group: tag", type: "TrueColor", description: "A coloured vertical line before the group label, tagging the section with a tone." },
        { name: "guards / hidden", type: "SideMenuItemGuard[] / boolean", description: "Per item: guard rules (all must pass, evaluated by guardEvaluator) or a plain hide." },
        { name: "variant / side / color", type: "SidebarVariant / SidebarSide / TrueColor", default: '"sidebar" / "left" / "blue"', description: "Surface treatment, docked edge and accent." },
        { name: "collapsible", type: "SidebarCollapsible | boolean", default: '"none"', description: "Opt-in collapsing. Without it the panel stays expanded, shows no collapse control, ignores collapsed and does not open on hover. true / \"icon\" is the icon rail; \"offcanvas\" hides the panel behind an edge handle. The mobile drawer (responsive) is separate." },
        { name: "collapsed / onToggleCollapse", type: "boolean / () => void", description: "Controlled collapse state, when the menu is collapsible." },
        { name: "openOnHover / hoverTransitionMs", type: "boolean / number", default: "false / 250", description: "Keep a rail that grows into the full panel on hover. Needs collapsible." },
        { name: "mobileOpen / onCloseMobile / responsive", type: "boolean / () => void / boolean", default: "— / — / true", description: "Below 1024px the panel is an offcanvas drawer with a backdrop; Esc closes it." },
        { name: "search / searchValue / onSearchChange / searchPlaceholder", type: "boolean / string / (v) => void / string", description: "An item search over labels and descriptions; controlled or not." },
        { name: "topItem / footerItem", type: "SideMenuDropdownItem", description: "Rows above the navigation and above the collapse control, each with its own dropdown menu." },
        { name: "ctas / footerDetails / footerDetailsTone", type: "SideMenuCta[] / SideMenuDetailItem[] / TrueColor", description: "Pinned call-to-action cards and the status detail footer." },
        { name: "loading / loaderType / skeletonLines", type: "boolean / SideMenuLoaderType / number", default: 'false / "skeleton" / 4', description: "The whole menu's loading state — a skeleton shaped like the rows, or the shared Loader over them." },
        { name: "noise", type: "boolean", default: "false", description: "A dither-grain texture over the panel background." },
        { name: "title / logoIcon / logoText / fullHeight / className", type: "string / ReactNode / ReactNode / boolean / string", description: "Header and sizing." },
      ]}
    />
  </div>
);

export default SideMenuPage;

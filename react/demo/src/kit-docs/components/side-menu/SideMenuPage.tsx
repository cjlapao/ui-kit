import React from "react";
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
import Actions from "./examples/Actions";
import actionsCode from "./examples/Actions.tsx?raw";
import DualLayout from "./examples/DualLayout";
import dualLayoutCode from "./examples/DualLayout.tsx?raw";
import MultiLayout from "./examples/MultiLayout";
import multiLayoutCode from "./examples/MultiLayout.tsx?raw";
import Chat from "./examples/Chat";
import chatCode from "./examples/Chat.tsx?raw";

export const SideMenuPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Side Menu"
      description="App navigation with five surface treatments (sidebar, inset, floating, floating-glass, glass), icon-rail and offcanvas collapse, hover-to-expand rails, nested items, item search and top/footer dropdown menus. SideMenuLayout composes it into dual and multi-sidebar app shells, and both stay responsive — below 1024px the panel becomes an offcanvas drawer."
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
        description="icon shrinks to an icon rail, offcanvas removes the panel entirely (a handle at the edge opens it again) and openOnHover keeps a rail that expands as an overlay on hover — with no collapse control at all."
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
        title="Chat layout"
        description="The building blocks composed into a chat shell: conversation list with search, a user menu in the footer and the message pane in the layout body."
        code={chatCode}
        filename="Chat.tsx"
      >
        <Chat />
      </ExampleCard>
    </section>
  </div>
);

export default SideMenuPage;

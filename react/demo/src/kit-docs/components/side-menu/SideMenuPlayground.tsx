import { useState } from "react";
import {
  ColorSwatches,
  CustomIcon,
  SideMenu,
  SideMenuIconButton,
  type SideMenuCta,
  type SideMenuDetailItem,
  type SideMenuItem,
  type SideMenuDropdownItem,
  type SideMenuSelectPicker,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  sidebarCollapsibleOptions,
  sidebarLoaderTypeOptions,
  sidebarSideOptions,
  sidebarVariantOptions,
  sideMenuSearchScopeOptions,
} from "../../shared/options";
import { Playground } from "../../shared/playground/Playground";
import type {
  PlaygroundConfig,
  PlaygroundCodeContext,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import { useControlled, usePlayground } from "../../shared/playground/state";
import {
  buildWorkspaceSection,
  GroupAction,
  CONTEXT_OPTIONS,
  DEMO_CTAS,
  DEMO_DETAILS,
  DEMO_ITEMS,
  EXPAND_ONLY_SECTION,
  USER_MENU,
  WORKSPACE_MENU,
} from "./demoData";

/* ── the fixture, composed once for the preview *and* the snippet ─────────── */

const on = (v: unknown): boolean => v === true;
const str = (v: unknown, fallback: string): string =>
  v === undefined || v === null || v === "" ? fallback : String(v);

/** The picker the embedded select mounts. Controlled, because it must be. */
const contextPicker = (state: PlaygroundState): SideMenuSelectPicker => ({
  items: CONTEXT_OPTIONS,
  size: "sm",
  placeholder: "Pick a context",
  // The preview swaps these for real setters; the snippet shows what they do.
  ...(on(state.selectMultiple)
    ? { multi: true, selectedIds: ["prod"], onMultiChange: () => undefined }
    : { selectedId: "test-qa", onSelect: () => undefined }),
});

/** Everything `items` can hold, assembled from the toggles the reader flips. */
export const itemsFor = (state: PlaygroundState): SideMenuItem[] => {
  const items: SideMenuItem[] = [...DEMO_ITEMS];
  if (on(state.expandable)) items.push(...EXPAND_ONLY_SECTION);
  if (on(state.workspaces)) {
    items.push(
      ...buildWorkspaceSection({
        actions: on(state.groupActions),
        actionsOnHover: on(state.actionsOnHover),
        tag: state.groupTag === "none" ? undefined : (state.groupTag as TrueColor),
        loadingSession: on(state.loadingSession),
        pageSize: state.childrenPageSize === "off" ? undefined : Number(state.childrenPageSize),
        emojiIdentities: on(state.emojiIdentities),
        contextSelectHost: state.selectHost === "ui-kit" ? "ui-kit" : "new_agents",
        contextSelect: on(state.contextSelect)
          ? {
              slug: "context",
              type: "select",
              label: "Current context",
              fullWidth: on(state.selectFullWidth),
              picker: contextPicker(state),
            }
          : undefined,
      }),
    );
  }
  return items;
};

/** The cards, minus the ones the app has dismissed. */
export const ctasFor = (state: PlaygroundState): SideMenuCta[] =>
  DEMO_CTAS.map((cta) => ({
    ...cta,
    // The ✕ renders iff this exists — the knob is honest about that.
    onDismiss: on(state.ctaDismiss) ? () => undefined : undefined,
  }));

/** The two `role="menu"` rows, built the way the component reads them. */
export const TOP_FIXTURE: SideMenuDropdownItem = {
  label: "ACME Corp",
  icon: "Users",
  menu: WORKSPACE_MENU,
};
export const FOOTER_FIXTURE: SideMenuDropdownItem = {
  label: "Ada Lovelace",
  icon: "User",
  menu: USER_MENU,
};

/** JSX the printer has to name; the key is what gets printed. */
const NAMES = { GroupAction, CustomIcon };
const ITEM_JSX = {
  names: NAMES,
  replace: {
    moreChildrenLabel: "(n) => `Show ${n} more sessions`",
    items: "CONTEXT_OPTIONS",
    onSelect: "onSelect={(item) => setContext(item.id)}",
    onMultiChange: "onMultiChange={(ids) => setContexts(ids)}",
  },
};
const CTA_JSX = {
  names: NAMES,
  replace: {
    onDismiss: "onDismiss={() => dismiss(cta.slug)}",
    onClick: "onClick={() => joinWaitlist()}",
  },
};

/* ── the config ───────────────────────────────────────────────────────────── */

export const SIDE_MENU: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "collapse", title: "Collapse & size" },
    { id: "search", title: "Search" },
    { id: "loading", title: "Loading" },
    { id: "details", title: "Detail footer" },
    { id: "content", title: "Menu content" },
  ],
  fields: [
    {
      id: "variant",
      group: "surface",
      label: "Variant",
      kind: "choice",
      control: "segments",
      options: sidebarVariantOptions as PlaygroundOption[],
      default: "sidebar",
    },
    {
      id: "side",
      group: "surface",
      label: "Side",
      kind: "choice",
      control: "segments",
      options: sidebarSideOptions as PlaygroundOption[],
      default: "left",
    },
    {
      id: "color",
      group: "surface",
      label: "Colour",
      kind: "custom",
      default: "blue",
      render: ({ state, set }) => (
        <ColorSwatches
          selectable
          size="sm"
          defaultExpanded
          value={str(state.color, "blue") as TrueColor}
          onSelect={(color) => set("color", color)}
        />
      ),
    },
    {
      id: "noise",
      group: "surface",
      label: "Noise",
      kind: "toggle",
      default: false,
    },
    {
      id: "noiseScale",
      group: "surface",
      label: "Noise scale",
      valueType: "number",
      kind: "choice",
      control: "segments",
      options: [
        { label: "Auto", value: "auto" },
        { label: "0.25", value: "0.25" },
        { label: "0.5", value: "0.5" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
      ],
      default: "auto",
      when: (s) => on(s.noise),
    },
    {
      id: "collapsible",
      group: "collapse",
      label: "Collapsible",
      kind: "choice",
      control: "segments",
      options: sidebarCollapsibleOptions as PlaygroundOption[],
      default: "none",
    },
    {
      id: "flush",
      group: "collapse",
      label: "Flush",
      kind: "toggle",
      default: true,
      when: (s) => s.collapsible !== "none",
    },
    {
      id: "openOnHover",
      group: "collapse",
      label: "Open on hover",
      kind: "toggle",
      default: false,
      when: (s) => s.collapsible !== "none",
    },
    {
      id: "hoverTransitionMs",
      group: "collapse",
      label: "Hover transition (ms)",
      kind: "number",
      min: 0,
      max: 600,
      step: 25,
      default: 250,
      when: (s) => on(s.openOnHover) && s.collapsible !== "none",
    },
    {
      id: "responsive",
      group: "collapse",
      label: "Responsive",
      kind: "toggle",
      default: true,
    },
    {
      // Opens true so the menu fills this fixed-height stage; the component's
      // own default is false, which pins `sticky top-16 h-[calc(100vh-64px)]`
      // for an app header this box does not have.
      id: "fullHeight",
      group: "collapse",
      label: "Full height",
      kind: "toggle",
      default: true,
      docDefault: false,
    },
    {
      id: "search",
      group: "search",
      label: "Search",
      kind: "toggle",
      default: false,
    },
    {
      id: "searchScope",
      group: "search",
      label: "Scope",
      kind: "choice",
      control: "segments",
      options: sideMenuSearchScopeOptions as PlaygroundOption[],
      default: "all",
      when: (s) => on(s.search),
    },
    {
      id: "loading",
      group: "loading",
      label: "Loading",
      kind: "toggle",
      default: false,
    },
    {
      id: "loaderType",
      group: "loading",
      label: "Loader",
      kind: "choice",
      control: "segments",
      options: sidebarLoaderTypeOptions as PlaygroundOption[],
      default: "skeleton",
      when: (s) => on(s.loading),
    },
    {
      id: "skeletonLines",
      group: "loading",
      label: "Skeleton rows",
      kind: "number",
      min: 1,
      max: 10,
      step: 1,
      default: 4,
      when: (s) => on(s.loading) && s.loaderType === "skeleton",
    },
    {
      id: "showDetails",
      group: "details",
      label: "Detail rows",
      kind: "toggle",
      prop: null,
      default: false,
    },
    {
      id: "footerDetailsVariant",
      group: "details",
      label: "Box",
      kind: "choice",
      control: "segments",
      options: [
        { label: "Flat", value: "none" },
        { label: "Outlined", value: "outlined" },
        { label: "Subtle", value: "subtle" },
        { label: "Tonal", value: "tonal" },
        { label: "Glass", value: "glass" },
      ],
      default: "none",
      when: (s) => on(s.showDetails),
    },
    {
      id: "footerDetailsTone",
      group: "details",
      label: "Box tone",
      kind: "choice",
      control: "segments",
      options: [
        { label: "None", value: "none" },
        { label: "Blue", value: "blue" },
        { label: "Violet", value: "violet" },
        { label: "Green", value: "green" },
      ],
      default: "none",
      when: (s) => on(s.showDetails) && s.footerDetailsVariant !== "none",
    },
    {
      id: "raisedSurface",
      group: "details",
      label: "Raised surface",
      kind: "toggle",
      default: false,
      when: (s) =>
        on(s.showDetails) &&
        (s.footerDetailsVariant !== "none" ||
          s.variant === "glass" ||
          s.variant === "floating-glass"),
    },
    /* ── content: levers over the fixture, never props ──────────────────── */
    { id: "topItem", group: "content", label: "Logo-band menu", kind: "toggle", prop: null, default: false },
    { id: "footerItem", group: "content", label: "Footer menu", kind: "toggle", prop: null, default: false },
    { id: "ctaCards", group: "content", label: "CTA cards", kind: "toggle", prop: null, default: false },
    {
      id: "ctaDismiss",
      group: "content",
      label: "Dismissible",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.ctaCards),
    },
    { id: "expandable", group: "content", label: "Docs section", kind: "toggle", prop: null, default: false },
    { id: "workspaces", group: "content", label: "Workspaces", kind: "toggle", prop: null, default: false },
    {
      id: "groupActions",
      group: "content",
      label: "Group actions",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces),
    },
    {
      id: "actionsOnHover",
      group: "content",
      label: "Actions on hover",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces) && on(s.groupActions),
    },
    {
      id: "groupTag",
      group: "content",
      label: "Group tag",
      prop: null,
      kind: "choice",
      control: "segments",
      options: [
        { label: "None", value: "none" },
        { label: "Blue", value: "blue" },
        { label: "Amber", value: "amber" },
        { label: "Violet", value: "violet" },
      ],
      default: "none",
      when: (s) => on(s.workspaces),
    },
    {
      id: "loadingSession",
      group: "content",
      label: "Running session",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces),
    },
    {
      id: "childrenPageSize",
      group: "content",
      label: "Children page",
      prop: null,
      kind: "choice",
      control: "segments",
      options: [
        { label: "Off", value: "off" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "5", value: "5" },
      ],
      default: "off",
      when: (s) => on(s.workspaces),
    },
    {
      id: "emojiIdentities",
      group: "content",
      label: "Emoji identity",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces),
    },
    {
      id: "contextSelect",
      group: "content",
      label: "Embedded select",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces),
    },
    {
      id: "selectMultiple",
      group: "content",
      label: "Select multiple",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces) && on(s.contextSelect),
    },
    {
      id: "selectFullWidth",
      group: "content",
      label: "Select full width",
      kind: "toggle",
      prop: null,
      default: false,
      when: (s) => on(s.workspaces) && on(s.contextSelect),
    },
    {
      id: "selectHost",
      group: "content",
      label: "Select host",
      prop: null,
      kind: "choice",
      control: "segments",
      options: [
        { label: "new_agents", value: "new_agents" },
        { label: "ui-kit", value: "ui-kit" },
      ],
      default: "new_agents",
      when: (s) => on(s.workspaces) && on(s.contextSelect),
    },
    {
      id: "mobilePreview",
      group: "content",
      label: "Phone drawer",
      kind: "toggle",
      prop: null,
      default: false,
    },
  ],
  data: [
    {
      id: "items",
      label: "Menu tree",
      note: "one object mounted by the preview and printed here",
      prop: null,
      emit: "literal",
      value: (state) => itemsFor(state),
    },
    {
      id: "ctas",
      label: "Call-to-action cards",
      prop: null,
      emit: "literal",
      value: (state) => ctasFor(state),
      when: (state) => on(state.ctaCards),
    },
    {
      id: "footerDetails",
      label: "Detail rows",
      prop: null,
      emit: "literal",
      value: () => DEMO_DETAILS,
      when: (state) => on(state.showDetails),
    },
    {
      id: "topFixture",
      label: "Logo-band dropdown",
      prop: null,
      emit: "literal",
      value: () => TOP_FIXTURE,
      when: (state) => on(state.topItem),
    },
    {
      id: "footerFixture",
      label: "Footer dropdown",
      prop: null,
      emit: "literal",
      value: () => FOOTER_FIXTURE,
      when: (state) => on(state.footerItem),
    },
  ],
};

/** The snippet: fixture declarations, then the element that mounts them. */
export const sideMenuCode = ({ state, h }: PlaygroundCodeContext): string => {
    const decls: string[] = [];
    if (on(state.workspaces) && on(state.contextSelect)) {
      decls.push(
        `// Picker options — grouped, tagged, iconned.\nconst CONTEXT_OPTIONS = ${h.jsx(
          CONTEXT_OPTIONS,
          { names: NAMES },
        )};`,
      );
    }
    decls.push(
      `// ${"Menu tree"}\nconst ITEMS = ${h.jsx(itemsFor(state), ITEM_JSX)};`,
    );
    if (on(state.ctaCards)) {
      decls.push(`// CTA cards\nconst CTAS = ${h.jsx(ctasFor(state), CTA_JSX)};`);
    }
    if (on(state.showDetails)) {
      decls.push(`// Detail rows\nconst DETAILS = ${h.jsx(DEMO_DETAILS, {})};`);
    }
    if (on(state.topItem)) {
      decls.push(
        `// Logo-band dropdown\nconst TOP_ITEM = ${h.jsx(TOP_FIXTURE, { names: NAMES })};`,

      );
    }
    if (on(state.footerItem)) {
      decls.push(
        `// Footer dropdown\nconst FOOTER_ITEM = ${h.jsx(FOOTER_FIXTURE, { names: NAMES })};`,

      );
    }

    const props = h.props();
    props.push("items={ITEMS}");
    if (on(state.ctaCards)) props.push("ctas={CTAS}");
    if (on(state.showDetails)) props.push("footerDetails={DETAILS}");
    if (on(state.topItem)) props.push("topItem={TOP_ITEM}");
    if (on(state.footerItem)) props.push("footerItem={FOOTER_ITEM}");

    return h.snippet({
      imports: ["SideMenu"],
      decls,
      body: h.element("SideMenu", props),
    });
};

/* ── the preview ──────────────────────────────────────────────────────────── */

function Preview({ state, data }: { state: PlaygroundState; data: Record<string, unknown> }) {
  // What the menu holds itself and the app must own: a chosen context, a
  // dismissed card, an open drawer. None of it is a knob.
  const [context, setContext] = useControlled<string | undefined>("test-qa");
  const [contexts, setContexts] = useControlled<string[]>(["prod"]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const multiple = on(state.selectMultiple);
  const items = (data.items as SideMenuItem[]).map((item) =>
    item.type === "select"
      ? {
          ...item,
          ...(multiple
            ? { selectedIds: contexts, onMultiChange: (ids: string[]) => setContexts(ids) }
            : { selectedId: context, onSelect: (picked: { id: string }) => setContext(picked.id) }),
        }
      : item,
  );
  const ctas = (data.ctas as SideMenuCta[] | undefined)
    ?.filter((cta) => !dismissed.includes(cta.slug))
    .map((cta) =>
      cta.onDismiss ? { ...cta, onDismiss: () => setDismissed((d) => [...d, cta.slug]) } : cta,
    );
  const drawer = on(state.mobilePreview);

  return (
    <div className="relative flex h-[30rem] items-stretch justify-start overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <SideMenu
        variant={str(state.variant, "sidebar") as never}
        side={str(state.side, "left") as never}
        color={str(state.color, "blue") as TrueColor}
        collapsible={str(state.collapsible, "none") as never}
        flush={state.flush !== false}
        openOnHover={on(state.openOnHover)}
        hoverTransitionMs={Number(state.hoverTransitionMs ?? 250)}
        responsive={state.responsive !== false}
        fullHeight={on(state.fullHeight)}
        noise={on(state.noise)}
        noiseScale={state.noiseScale === "auto" ? undefined : Number(state.noiseScale)}
        search={on(state.search)}
        searchScope={str(state.searchScope, "all") as never}
        loading={on(state.loading)}
        loaderType={str(state.loaderType, "skeleton") as never}
        skeletonLines={Number(state.skeletonLines ?? 4)}
        footerDetailsVariant={
          state.footerDetailsVariant === "none"
            ? undefined
            : (str(state.footerDetailsVariant, "outlined") as never)
        }
        footerDetailsTone={str(state.footerDetailsTone, "none") as never}
        raisedSurface={on(state.raisedSurface)}
        items={items}
        ctas={on(state.ctaCards) ? ctas : undefined}
        footerDetails={on(state.showDetails) ? (data.footerDetails as SideMenuDetailItem[]) : undefined}
        topItem={on(state.topItem) ? TOP_FIXTURE : undefined}
        footerItem={on(state.footerItem) ? FOOTER_FIXTURE : undefined}
        footer={<SideMenuIconButton label="Settings">⚙</SideMenuIconButton>}
        mobileOpen={drawer ? mobileOpen : undefined}
        onCloseMobile={drawer ? () => setMobileOpen(false) : undefined}
      />
      {drawer ? (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="m-3 self-start rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
        >
          Open menu
        </button>
      ) : null}
    </div>
  );
}

export function SideMenuPlayground() {
  const playground = usePlayground(SIDE_MENU);
  return (
    <Playground
      playground={playground}
      preview={Preview}
      component={{ tag: "SideMenu", imports: ["SideMenu"] }}
      code={sideMenuCode}
      hint={
        <>
          Every control is a real prop; the content toggles change the{" "}
          <code>items</code>/<code>ctas</code> the Code view prints. Three things the
          component deliberately does <em>not</em> give you: a drawer trigger (
          <code>mobileOpen</code> is the app’s state, so the preview renders its own
          “Open menu” button), persistence for dismissed cards, and a collapse button
          unless <code>collapsible</code> is <code>"icon"</code> or{" "}
          <code>"offcanvas"</code>. The <code>footer</code> slot is mounted here to show
          it; it is not a knob. Search, hover-reveal of paged children and the embedded
          select all work — the open state is seeded at mount, so changing{" "}
          <code>defaultOpen</code> in the tree needs a remount.
        </>
      }
    />
  );
}
